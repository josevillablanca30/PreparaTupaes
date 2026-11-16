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
 u uuid:=auth.uid();
 today_chile date:=(now() at time zone 'America/Santiago')::date;
 quota integer;
 used integer;
 prior cachaste_web.basic_usage%rowtype;
 premium boolean;
begin
 if u is null or (auth.jwt()->>'is_anonymous')='true'
 then raise exception 'AUTH_REQUIRED' using errcode='42501';end if;
 if operation not in ('check','consume') or kind not in ('lesson','diagnostic','expressExam','duel')
 then raise exception 'INVALID_OPERATION' using errcode='22023';end if;
 if (kind in ('lesson','diagnostic') and subject not in ('m1','m2','lectora','ciencias','historia'))
 or (kind in ('expressExam','duel') and subject<>'all')
 then raise exception 'INVALID_SUBJECT' using errcode='22023';end if;
 if operation='consume' and event_id is null
 then raise exception 'EVENT_ID_REQUIRED' using errcode='22023';end if;
 premium:=cachaste.premium(u);
 if premium then return jsonb_build_object('allowed',true,'tier','premium','remaining',null,'day',today_chile);end if;
 quota:=case kind when 'lesson' then 3 when 'diagnostic' then 1 when 'expressExam' then 1 when 'duel' then 2 end;
 perform pg_advisory_xact_lock(hashtextextended('basic-quota:'||u::text,0));
 if operation='consume' and event_id is not null then
   select * into prior from cachaste_web.basic_usage where user_id=u and basic_usage.event_id=basic_quota.event_id;
   if found then
     if prior.kind<>kind or prior.subject<>subject then raise exception 'EVENT_REUSED' using errcode='22023';end if;
     return jsonb_build_object('allowed',true,'tier','basica','replayed',true,'day',prior.usage_day);
   end if;
 end if;
 select count(*) into used from cachaste_web.basic_usage q
 where q.user_id=u and q.kind=basic_quota.kind and q.subject=basic_quota.subject
 and (basic_quota.kind='diagnostic' or q.usage_day=today_chile);
 if used>=quota then return jsonb_build_object('allowed',false,'tier','basica','remaining',0,'day',today_chile);end if;
 if operation='consume' then
   insert into cachaste_web.basic_usage(user_id,kind,subject,usage_day,event_id)
   values(u,kind,subject,today_chile,event_id);
   used:=used+1;
 end if;
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
