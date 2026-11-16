-- Básica: contador transaccional y repetición segura por usuario.
-- No ejecutar en producción hasta integrar la autorización de rutas y motores web/Android.
create table if not exists cachaste_web.basic_usage (
 user_id uuid not null references auth.users(id) on delete cascade,
 kind text not null check (kind in ('lesson','diagnostic','expressExam','duel')),
 subject text not null check (subject in ('m1','m2','lectora','ciencias','historia','all')),
 usage_day date not null,
 event_id uuid not null,
 created_at timestamptz not null default now(),
 primary key(user_id,event_id),
 constraint basic_usage_subject check (
   (kind in ('lesson','diagnostic') and subject<>'all') or
   (kind in ('expressExam','duel') and subject='all')
 )
);
create index if not exists basic_usage_quota_idx on cachaste_web.basic_usage(user_id,kind,subject,usage_day);
create unique index if not exists basic_diagnostic_once_idx
 on cachaste_web.basic_usage(user_id,subject)
 where kind='diagnostic';
alter table cachaste_web.basic_usage enable row level security;
revoke all on cachaste_web.basic_usage from public,anon,authenticated;

create or replace function cachaste_web.basic_quota(
 operation text, kind text, subject text default 'all', event_id uuid default null
) returns jsonb
language plpgsql security definer set search_path=''
as $$
declare
 u uuid:=cachaste.require_user();
 today_chile date:=(now() at time zone 'America/Santiago')::date;
 quota integer;
 used integer;
 premium boolean;
begin
 if operation is null or kind is null or operation not in ('check','consume') or kind not in ('lesson','diagnostic','expressExam','duel')
 then raise exception 'INVALID_OPERATION' using errcode='22023';end if;
 if subject is null or (kind in ('lesson','diagnostic') and subject not in ('m1','m2','lectora','ciencias','historia'))
 or (kind in ('expressExam','duel') and subject<>'all')
 then raise exception 'INVALID_SUBJECT' using errcode='22023';end if;
 -- An authenticated browser can call public RPC directly, bypassing the web gateway.
 -- No client-supplied event UUID is proof of a completed lesson or duel.
 -- Consumption must be moved to a server-attested transaction before release.
 if operation='consume' then raise exception 'COMPLETION_ATTESTATION_REQUIRED' using errcode='42501';end if;
 -- Read-only quota check. A future server-attested completion transaction must
 -- perform idempotent consumption and write progress/results atomically.
 premium:=cachaste.premium(u);
 if premium then return jsonb_build_object('allowed',true,'tier','premium','remaining',null,'day',today_chile);end if;
 quota:=case kind when 'lesson' then 3 when 'diagnostic' then 1 when 'expressExam' then 1 when 'duel' then 2 end;
 select count(*) into used from cachaste_web.basic_usage q
 where q.user_id=u and q.kind=basic_quota.kind and q.subject=basic_quota.subject
 and (basic_quota.kind='diagnostic' or q.usage_day=today_chile);
 if used>=quota then return jsonb_build_object('allowed',false,'tier','basica','remaining',0,'day',today_chile);end if;
 return jsonb_build_object('allowed',true,'tier','basica','remaining',quota-used,'day',today_chile);
end$$;
revoke all on function cachaste_web.basic_quota(text,text,text,uuid) from public,anon,authenticated;
grant execute on function cachaste_web.basic_quota(text,text,text,uuid) to authenticated;

create or replace function public.cachaste_basic_quota(
 operation text, kind text, subject text default 'all', event_id uuid default null
) returns jsonb language sql security invoker set search_path=''
as $$select cachaste_web.basic_quota(operation,kind,subject,event_id)$$;
revoke all on function public.cachaste_basic_quota(text,text,text,uuid) from public,anon;
grant execute on function public.cachaste_basic_quota(text,text,text,uuid) to authenticated;

-- Read-only, single-round-trip quota dashboard for web and Android.
-- Premium status is checked server-side; all Basic counters are derived from stored rows.
create or replace function cachaste_web.basic_quota_summary()
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 u uuid:=cachaste.require_user();
 today_chile date:=(now() at time zone 'America/Santiago')::date;
 premium boolean:=cachaste.premium(u);
 lessons jsonb;
 diagnostics jsonb;
 express_used integer;
 duels_used integer;
begin
 if premium then
  return jsonb_build_object('tier','premium','day',today_chile,'unlimited',true);
 end if;
 select coalesce(jsonb_object_agg(s.subject, greatest(0,3-coalesce(v.used,0))),'{}'::jsonb)
 into lessons
 from (values('m1'),('m2'),('lectora'),('ciencias'),('historia')) s(subject)
 left join lateral (
  select count(*)::integer as used from cachaste_web.basic_usage q
  where q.user_id=u and q.kind='lesson' and q.subject=s.subject and q.usage_day=today_chile
 ) v on true;
 select coalesce(jsonb_object_agg(s.subject, greatest(0,1-coalesce(v.used,0))),'{}'::jsonb)
 into diagnostics
 from (values('m1'),('m2'),('lectora'),('ciencias'),('historia')) s(subject)
 left join lateral (
  select count(*)::integer as used from cachaste_web.basic_usage q
  where q.user_id=u and q.kind='diagnostic' and q.subject=s.subject
 ) v on true;
 select count(*)::integer into express_used from cachaste_web.basic_usage q
 where q.user_id=u and q.kind='expressExam' and q.usage_day=today_chile;
 select count(*)::integer into duels_used from cachaste_web.basic_usage q
 where q.user_id=u and q.kind='duel' and q.usage_day=today_chile;
 return jsonb_build_object('tier','basica','day',today_chile,
  'lessonsRemaining',lessons,'diagnosticsRemaining',diagnostics,
  'expressExamsRemaining',greatest(0,1-express_used),
  'duelsRemaining',greatest(0,2-duels_used),'fullExamsRemaining',0);
end$$;
revoke all on function cachaste_web.basic_quota_summary() from public,anon,authenticated;
grant execute on function cachaste_web.basic_quota_summary() to authenticated;
create or replace function public.cachaste_basic_quota_summary()
returns jsonb language sql security invoker set search_path=''
as $$select cachaste_web.basic_quota_summary()$$;
revoke all on function public.cachaste_basic_quota_summary() from public,anon;
grant execute on function public.cachaste_basic_quota_summary() to authenticated;
