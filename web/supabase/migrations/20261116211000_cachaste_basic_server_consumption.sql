-- Server-only atomic quota consumption. Not exposed to authenticated students.
-- Apply only after trusted completion verification is wired into the educational engine.
-- The caller must validate the real completed activity and its stable event UUID.
create or replace function cachaste_web.basic_record_verified_completion(
 p_user_id uuid, p_kind text, p_subject text, p_event_id uuid
) returns jsonb language plpgsql security definer set search_path='' as $$
declare
 today_chile date:=(now() at time zone 'America/Santiago')::date;
 limit_count integer;
 used_count integer;
 existing cachaste_web.basic_usage%rowtype;
begin
 if auth.role() is distinct from 'service_role' then
  raise exception 'SERVER_ONLY' using errcode='42501';
 end if;
 if p_user_id is null or p_event_id is null or p_kind is null or p_subject is null or
    p_kind not in ('lesson','diagnostic','expressExam','duel') or
    (p_kind in ('lesson','diagnostic') and p_subject not in ('m1','m2','lectora','ciencias','historia')) or
    (p_kind in ('expressExam','duel') and p_subject<>'all') then
  raise exception 'INVALID_COMPLETION' using errcode='22023';
 end if;
 -- Serialize all Basic activity consumption per student, including parallel devices.
 perform pg_advisory_xact_lock(hashtextextended('basic-completion:'||p_user_id::text,0));
 select * into existing from cachaste_web.basic_usage q
 where q.user_id=p_user_id and q.event_id=p_event_id;
 if found then
  if existing.kind<>p_kind or existing.subject<>p_subject then
   raise exception 'EVENT_ID_REUSED' using errcode='23505';
  end if;
  return jsonb_build_object('allowed',true,'tier','basica','replayed',true,'day',existing.usage_day);
 end if;
 if cachaste.premium(p_user_id) then
  return jsonb_build_object('allowed',true,'tier','premium','unlimited',true);
 end if;
 limit_count:=case p_kind when 'lesson' then 3 when 'diagnostic' then 1
  when 'expressExam' then 1 when 'duel' then 2 end;
 select count(*)::integer into used_count from cachaste_web.basic_usage q
 where q.user_id=p_user_id and q.kind=p_kind and q.subject=p_subject
 and (p_kind='diagnostic' or q.usage_day=today_chile);
 if used_count>=limit_count then
  return jsonb_build_object('allowed',false,'tier','basica','remaining',0,'day',today_chile);
 end if;
 insert into cachaste_web.basic_usage(user_id,kind,subject,usage_day,event_id)
 values(p_user_id,p_kind,p_subject,today_chile,p_event_id);
 return jsonb_build_object('allowed',true,'tier','basica','remaining',limit_count-used_count-1,'day',today_chile);
end$$;
revoke all on function cachaste_web.basic_record_verified_completion(uuid,text,text,uuid) from public,anon,authenticated;
grant execute on function cachaste_web.basic_record_verified_completion(uuid,text,text,uuid) to service_role;
-- Public RPC name is callable only by service_role. The browser never receives this credential.
create or replace function public.cachaste_basic_record_verified_completion(
 p_user_id uuid,p_kind text,p_subject text,p_event_id uuid
) returns jsonb language sql security invoker set search_path=''
as $$select cachaste_web.basic_record_verified_completion(p_user_id,p_kind,p_subject,p_event_id)$$;
revoke all on function public.cachaste_basic_record_verified_completion(uuid,text,text,uuid) from public,anon,authenticated;
grant execute on function public.cachaste_basic_record_verified_completion(uuid,text,text,uuid) to service_role;
