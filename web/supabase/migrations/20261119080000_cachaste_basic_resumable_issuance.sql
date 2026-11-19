-- Preserve the exact public question set alongside the private grading key.
-- NOT APPLIED TO PRODUCTION. The Worker must authenticate the user first.
alter table cachaste_web.basic_issued_questions
 add column if not exists public_questions jsonb;

create or replace function public.cachaste_store_basic_question_set(
 p_user_id uuid,p_attempt_id uuid,p_answer_key jsonb,p_public_questions jsonb
) returns boolean language plpgsql security definer set search_path='' as $store$
declare a cachaste_web.basic_learning_attempts%rowtype;
begin
 if auth.role() is distinct from 'service_role' then raise exception 'SERVER_ONLY' using errcode='42501';end if;
 if p_user_id is null or p_attempt_id is null or jsonb_typeof(p_answer_key)<>'array' or
    jsonb_typeof(p_public_questions)<>'array' or jsonb_array_length(p_answer_key) not between 1 and 80 or
    jsonb_array_length(p_answer_key)<>jsonb_array_length(p_public_questions) then
  raise exception 'INVALID_ISSUANCE' using errcode='22023';
 end if;
 if exists(select 1 from jsonb_array_elements(p_public_questions) with ordinality q(value,pos)
  join jsonb_array_elements(p_answer_key) with ordinality k(value,pos) on q.pos=k.pos
  where q.value->>'id' is distinct from k.value->>'id' or
        q.value->'options' is distinct from k.value->'options' or
        jsonb_typeof(q.value->'prompt') is distinct from 'string' or
        jsonb_typeof(q.value->'options') is distinct from 'array' or
        q.value ? 'answerIndex' or
        (select count(*) from jsonb_object_keys(q.value) key where key not in ('id','prompt','options'))>0
 ) then raise exception 'INVALID_ISSUANCE' using errcode='22023';end if;
 -- Reuse the previously reviewed issuance validator (IDs, options, answer
 -- indices, ownership, lease and duplicate prevention) atomically.
 if not cachaste_web.issue_basic_question_key(p_user_id,p_attempt_id,p_answer_key) then return false;end if;
 update cachaste_web.basic_issued_questions
 set public_questions=p_public_questions
 where attempt_id=p_attempt_id and user_id=p_user_id;
 return true;
end$store$;
revoke all on function public.cachaste_store_basic_question_set(uuid,uuid,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.cachaste_store_basic_question_set(uuid,uuid,jsonb,jsonb) to service_role;

create or replace function public.cachaste_resume_basic_question_set(p_user_id uuid,p_attempt_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $resume$
declare a cachaste_web.basic_learning_attempts%rowtype; questions jsonb;
begin
 if auth.role() is distinct from 'service_role' then raise exception 'SERVER_ONLY' using errcode='42501';end if;
 select * into a from cachaste_web.basic_learning_attempts where id=p_attempt_id and user_id=p_user_id;
 if not found or a.status<>'reserved' or a.created_at<now()-interval '90 minutes' or
    (a.kind<>'diagnostic' and a.usage_day<>(now() at time zone 'America/Santiago')::date) then
  raise exception 'ATTEMPT_NOT_ELIGIBLE' using errcode='42501';end if;
 select public_questions into questions from cachaste_web.basic_issued_questions
 where attempt_id=a.id and user_id=a.user_id;
 if questions is null then return null;end if;
 return jsonb_build_object('attemptId',a.id,'questions',questions);
end$resume$;
revoke all on function public.cachaste_resume_basic_question_set(uuid,uuid) from public,anon,authenticated;
grant execute on function public.cachaste_resume_basic_question_set(uuid,uuid) to service_role;
