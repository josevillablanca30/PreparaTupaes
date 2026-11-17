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
 status text not null default 'reserved' check(status in ('reserved','completed')),
 created_at timestamptz not null default now(),
 completed_at timestamptz,
 constraint basic_learning_attempt_subject check(
  (kind in ('lesson','diagnostic') and subject<>'all') or
  (kind='expressExam' and subject='all')
 )
);
create index if not exists basic_learning_attempt_quota_idx
 on cachaste_web.basic_learning_attempts(user_id,kind,subject,usage_day);
create unique index if not exists basic_learning_diagnostic_once_idx
 on cachaste_web.basic_learning_attempts(user_id,subject) where kind='diagnostic';
alter table cachaste_web.basic_learning_attempts enable row level security;
revoke all on cachaste_web.basic_learning_attempts from public,anon,authenticated;

create or replace function cachaste_web.reserve_basic_learning_attempt(
 p_kind text,p_subject text
) returns jsonb language plpgsql security definer set search_path='' as $$
declare
 u uuid:=cachaste.require_user();
 today_chile date:=(now() at time zone 'America/Santiago')::date;
 used_count integer;
 max_count integer;
 attempt_id uuid;
begin
 if p_kind is null or p_subject is null or
  p_kind not in ('lesson','diagnostic','expressExam') or
  (p_kind in ('lesson','diagnostic') and p_subject not in ('m1','m2','lectora','ciencias','historia')) or
  (p_kind='expressExam' and p_subject<>'all') then
  raise exception 'INVALID_ACTIVITY' using errcode='22023';
 end if;
 if not coalesce((select learning_attempts_enabled from cachaste_web.basic_feature_flags where id=true),false) then
  raise exception 'BASIC_ATTEMPTS_NOT_READY' using errcode='42501';
 end if;
 if cachaste.premium(u) then
  return jsonb_build_object('allowed',true,'tier','premium','unlimited',true);
 end if;
 -- Same lock namespace as completion ledger and duel activation.
 perform pg_advisory_xact_lock(hashtextextended('basic-completion:'||u::text,0));
 max_count:=case p_kind when 'lesson' then 3 when 'diagnostic' then 1 else 1 end;
 select count(*)::integer into used_count from cachaste_web.basic_learning_attempts a
 where a.user_id=u and a.kind=p_kind and a.subject=p_subject
 and (p_kind='diagnostic' or a.usage_day=today_chile);
 if used_count>=max_count then
  return jsonb_build_object('allowed',false,'tier','basica','remaining',0);
 end if;
 insert into cachaste_web.basic_learning_attempts(user_id,kind,subject,usage_day)
 values(u,p_kind,p_subject,today_chile) returning id into attempt_id;
 return jsonb_build_object('allowed',true,'tier','basica','attemptId',attempt_id,
  'remaining',max_count-used_count-1,'day',today_chile);
end$$;
revoke all on function cachaste_web.reserve_basic_learning_attempt(text,text) from public,anon,authenticated;
grant execute on function cachaste_web.reserve_basic_learning_attempt(text,text) to authenticated;
create or replace function public.cachaste_reserve_basic_learning_attempt(
 p_kind text,p_subject text
) returns jsonb language sql security invoker set search_path='' as $$
 select cachaste_web.reserve_basic_learning_attempt(p_kind,p_subject)
$$;
revoke all on function public.cachaste_reserve_basic_learning_attempt(text,text) from public,anon;
grant execute on function public.cachaste_reserve_basic_learning_attempt(text,text) to authenticated;
