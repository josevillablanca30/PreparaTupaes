-- Basic completion must be graded against the immutable, server-issued key.
-- NOT APPLIED TO PRODUCTION. Caller must be service_role and must have
-- authenticated the user before passing p_user_id.
-- Remove the earlier unverified two-argument completion path entirely.
drop function if exists public.cachaste_complete_basic_learning_attempt(uuid,uuid);
drop function if exists cachaste_web.complete_basic_learning_attempt(uuid,uuid);

create or replace function cachaste_web.complete_basic_learning_attempt(
 p_user_id uuid,p_attempt_id uuid,p_answers jsonb
) returns jsonb language plpgsql security definer set search_path='' as $complete$
declare
 a cachaste_web.basic_learning_attempts%rowtype;
 issued jsonb;
 total_count integer;
 correct_count integer;
 today_chile date:=(now() at time zone 'America/Santiago')::date;
begin
 if auth.role() is distinct from 'service_role' then
  raise exception 'SERVER_ONLY' using errcode='42501';
 end if;
 if p_user_id is null or p_attempt_id is null or
    jsonb_typeof(p_answers) is distinct from 'array' then
  raise exception 'INVALID_COMPLETION' using errcode='22023';
 end if;
 perform pg_advisory_xact_lock(hashtextextended('basic-completion:'||p_user_id::text,0));
 select * into a from cachaste_web.basic_learning_attempts
 where id=p_attempt_id and user_id=p_user_id for update;
 if not found then raise exception 'ATTEMPT_NOT_FOUND' using errcode='22023'; end if;
 if a.status='completed' then
  -- Do not return success for a replay with different or unverified answers.
  raise exception 'ATTEMPT_ALREADY_COMPLETED' using errcode='22023';
 end if;
 if a.status<>'reserved' or a.created_at<now()-interval '90 minutes' or
    (a.kind<>'diagnostic' and a.usage_day<>today_chile) then
  raise exception 'ATTEMPT_EXPIRED' using errcode='22023';
 end if;
 select q.answer_key into issued from cachaste_web.basic_issued_questions q
 where q.attempt_id=a.id and q.user_id=a.user_id;
 if issued is null then raise exception 'QUESTIONS_NOT_ISSUED' using errcode='42501'; end if;
 total_count:=jsonb_array_length(issued);
 if jsonb_array_length(p_answers)<>total_count then
  raise exception 'INCOMPLETE_ANSWERS' using errcode='22023';
 end if;
 -- Ordinality binds every answer to its issued question in the original order.
 -- No client-supplied correctness, answer key, score, or completion flag is used.
 if exists(
  select 1 from jsonb_array_elements(issued) with ordinality as q(value,pos)
  join jsonb_array_elements(p_answers) with ordinality as ans(value,pos)
   on q.pos=ans.pos
  where jsonb_typeof(ans.value)<>'object'
     or (select count(*) from jsonb_object_keys(
       case when jsonb_typeof(ans.value)='object' then ans.value else '{}'::jsonb end
      ) as key_name where key_name not in ('questionId','selectedIndex'))>0
     or ans.value->>'questionId' is distinct from q.value->>'id'
     or jsonb_typeof(ans.value->'selectedIndex') is distinct from 'number'
     or coalesce(ans.value->>'selectedIndex','') !~ '^[0-9]{1,3}$'
     or case when coalesce(ans.value->>'selectedIndex','') ~ '^[0-9]{1,3}$'
        then (ans.value->>'selectedIndex')::integer>=jsonb_array_length(q.value->'options')
        else true end
 ) then raise exception 'INVALID_ANSWERS' using errcode='22023'; end if;
 select count(*)::integer into correct_count
 from jsonb_array_elements(issued) with ordinality as q(value,pos)
 join jsonb_array_elements(p_answers) with ordinality as ans(value,pos)
 on q.pos=ans.pos
 where (ans.value->>'selectedIndex')::integer=(q.value->>'answerIndex')::integer;
 insert into cachaste_web.basic_usage(user_id,kind,subject,usage_day,event_id)
 values(a.user_id,a.kind,a.subject,a.usage_day,a.id);
 update cachaste_web.basic_learning_attempts set status='completed',completed_at=now()
 where id=a.id;
 return jsonb_build_object('allowed',true,'tier','basica','attemptId',a.id,
  'completed',true,'correct',correct_count,'total',total_count);
end$complete$;
revoke all on function cachaste_web.complete_basic_learning_attempt(uuid,uuid,jsonb) from public,anon,authenticated;
grant execute on function cachaste_web.complete_basic_learning_attempt(uuid,uuid,jsonb) to service_role;
create or replace function public.cachaste_complete_basic_learning_attempt(
 p_user_id uuid,p_attempt_id uuid,p_answers jsonb
) returns jsonb language sql security invoker set search_path='' as $wrapper$
 select cachaste_web.complete_basic_learning_attempt(p_user_id,p_attempt_id,p_answers)
$wrapper$;
revoke all on function public.cachaste_complete_basic_learning_attempt(uuid,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.cachaste_complete_basic_learning_attempt(uuid,uuid,jsonb) to service_role;
