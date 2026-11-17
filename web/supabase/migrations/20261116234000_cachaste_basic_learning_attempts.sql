-- Basic educational attempts: atomic per-user admission, disabled by default.
-- This reserves a slot at the start of an activity, not after a client-claimed completion.
-- Not applied to production. Do not enable until server-issued questions and
-- completion attestation are integrated.
alter table cachaste_web.basic_feature_flags
 add column if not exists learning_attempts_enabled boolean not null default false;

create table if not exists cachaste_web.basic_learning_attempts(
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 kind text not null check(kind in ('lesson','diagnostic','expressExam')),
 subject text not null check(subject in ('m1','m2','lectora','ciencias','historia','all')),
 usage_day date not null,
 request_key uuid not null,
 status text not null default 'reserved' check(status in ('reserved','completed','expired')),
 created_at timestamptz not null default now(),
 completed_at timestamptz,
 constraint basic_learning_attempt_subject check(
  (kind in ('lesson','diagnostic') and subject<>'all') or
  (kind='expressExam' and subject='all')
 )
);
create unique index if not exists basic_learning_attempt_request_idx
 on cachaste_web.basic_learning_attempts(user_id,request_key);
create index if not exists basic_learning_attempt_quota_idx
 on cachaste_web.basic_learning_attempts(user_id,kind,subject,usage_day);
create unique index if not exists basic_learning_diagnostic_once_idx
 on cachaste_web.basic_learning_attempts(user_id,subject) where kind='diagnostic' and status<>'expired';
alter table cachaste_web.basic_learning_attempts enable row level security;
revoke all on cachaste_web.basic_learning_attempts from public,anon,authenticated;

create or replace function cachaste_web.reserve_basic_learning_attempt(
 p_kind text,p_subject text,p_request_key uuid
) returns jsonb language plpgsql security definer set search_path='' as $$
declare
 u uuid:=cachaste.require_user();
 today_chile date:=(now() at time zone 'America/Santiago')::date;
 used_count integer;
 max_count integer;
 attempt_id uuid;
 prior cachaste_web.basic_learning_attempts;
begin
 if p_kind is null or p_subject is null or
  p_kind not in ('lesson','diagnostic','expressExam') or
  (p_kind in ('lesson','diagnostic') and p_subject not in ('m1','m2','lectora','ciencias','historia')) or
  (p_kind='expressExam' and p_subject<>'all') then
  raise exception 'INVALID_ACTIVITY' using errcode='22023';
 end if;
 if p_request_key is null then raise exception 'REQUEST_KEY_REQUIRED' using errcode='22023';end if;
 if not coalesce((select learning_attempts_enabled from cachaste_web.basic_feature_flags where id=true),false) then
  raise exception 'BASIC_ATTEMPTS_NOT_READY' using errcode='42501';
 end if;
 if cachaste.premium(u) then
  return jsonb_build_object('allowed',true,'tier','premium','unlimited',true);
 end if;
 -- Same lock namespace as completion ledger and duel activation.
 perform pg_advisory_xact_lock(hashtextextended('basic-completion:'||u::text,0));
 -- Reclaim abandoned reservations only after a conservative 90-minute lease.
 -- This is safe for admission, but trusted completion must reject expired attempts.
 update cachaste_web.basic_learning_attempts a set status='expired'
 where a.user_id=u and a.status='reserved'
 and a.created_at < now()-interval '90 minutes';

 select * into prior from cachaste_web.basic_learning_attempts a
 where a.user_id=u and a.request_key=p_request_key;
 if found then
  if prior.kind is distinct from p_kind or prior.subject is distinct from p_subject then
   raise exception 'REQUEST_KEY_CONFLICT' using errcode='22023';
  end if;
  -- Never revive a prior day's daily attempt by replaying its request key.
  -- Diagnostics are lifetime-scoped and remain replayable for the same attempt.
  if p_kind<>'diagnostic' and prior.usage_day<>today_chile then
   raise exception 'REQUEST_KEY_EXPIRED' using errcode='22023';
  end if;
  -- A replay of an already completed attempt is not a new admission.
  if prior.status='expired' then
   raise exception 'ATTEMPT_EXPIRED' using errcode='22023';
  end if;
  if prior.status='completed' then
   raise exception 'ATTEMPT_ALREADY_COMPLETED' using errcode='22023';
  end if;
  -- Reservation availability counts both completed and still-reserved attempts.
  -- Completed attempts must later be attested by a trusted server.
  -- A retry returns the current authoritative admission quota.
  max_count:=case p_kind when 'lesson' then 3 when 'diagnostic' then 1 else 1 end;
  select count(*)::integer into used_count from cachaste_web.basic_learning_attempts a
  where a.user_id=u and a.kind=p_kind and a.subject=p_subject
  and a.status<>'expired' and (p_kind='diagnostic' or a.usage_day=today_chile);
  return jsonb_build_object('allowed',true,'tier','basica','attemptId',prior.id,
   'remaining',greatest(0,max_count-used_count),'day',prior.usage_day,'replayed',true);
 end if;
 max_count:=case p_kind when 'lesson' then 3 when 'diagnostic' then 1 else 1 end;
 select count(*)::integer into used_count from cachaste_web.basic_learning_attempts a
 where a.user_id=u and a.kind=p_kind and a.subject=p_subject
 and a.status<>'expired' and (p_kind='diagnostic' or a.usage_day=today_chile);
 if used_count>=max_count then
  return jsonb_build_object('allowed',false,'tier','basica','remaining',0);
 end if;
 insert into cachaste_web.basic_learning_attempts(user_id,kind,subject,usage_day,request_key)
 values(u,p_kind,p_subject,today_chile,p_request_key) returning id into attempt_id;
 return jsonb_build_object('allowed',true,'tier','basica','attemptId',attempt_id,
  'remaining',max_count-used_count-1,'day',today_chile);
end$$;
revoke all on function cachaste_web.reserve_basic_learning_attempt(text,text,uuid) from public,anon,authenticated;
grant execute on function cachaste_web.reserve_basic_learning_attempt(text,text,uuid) to authenticated;
create or replace function public.cachaste_reserve_basic_learning_attempt(
 p_kind text,p_subject text,p_request_key uuid
) returns jsonb language sql security invoker set search_path='' as $$
 select cachaste_web.reserve_basic_learning_attempt(p_kind,p_subject,p_request_key)
$$;
revoke all on function public.cachaste_reserve_basic_learning_attempt(text,text,uuid) from public,anon;
grant execute on function public.cachaste_reserve_basic_learning_attempt(text,text,uuid) to authenticated;

-- IMPORTANT: reservations do not write to basic_usage. Only trusted, independently
-- verified completions may be recorded there. The reservation table counts
-- in-flight slots to prevent concurrent devices overbooking the daily quota.
-- A completion attestation endpoint and abandoned-attempt recovery are still
-- required before enabling any Basic learning feature flags.
