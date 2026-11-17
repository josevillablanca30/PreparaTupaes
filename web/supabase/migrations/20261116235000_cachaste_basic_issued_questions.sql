-- Server-only issued answer keys. Not applied to production.
create table if not exists cachaste_web.basic_issued_questions(
 attempt_id uuid primary key references cachaste_web.basic_learning_attempts(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 answer_key jsonb not null check(jsonb_typeof(answer_key)='array'),
 issued_at timestamptz not null default now()
);
create index if not exists basic_issued_questions_user_idx
 on cachaste_web.basic_issued_questions(user_id);
alter table cachaste_web.basic_issued_questions enable row level security;
revoke all on cachaste_web.basic_issued_questions from public,anon,authenticated;
grant select,insert on cachaste_web.basic_issued_questions to service_role;

create or replace function cachaste_web.issue_basic_question_key(
 p_user_id uuid,p_attempt_id uuid,p_answer_key jsonb
) returns boolean language plpgsql security definer set search_path='' as $issue$
declare
 target cachaste_web.basic_learning_attempts%rowtype;
 inserted_id uuid;
begin
 if auth.role() is distinct from 'service_role' then
  raise exception 'SERVICE_ROLE_REQUIRED' using errcode='42501';
 end if;
 if p_user_id is null or p_attempt_id is null or
    jsonb_typeof(p_answer_key) is distinct from 'array' or
    jsonb_array_length(case when jsonb_typeof(p_answer_key)='array' then p_answer_key else '[]'::jsonb end) not between 1 and 80 then
  raise exception 'INVALID_ISSUANCE' using errcode='22023';
 end if;
 if (select count(distinct q->>'id') from jsonb_array_elements(p_answer_key) q)<>jsonb_array_length(p_answer_key) or
    exists(select 1 from jsonb_array_elements(p_answer_key) q
      where jsonb_typeof(q)<>'object' or
       jsonb_typeof(q->'id')<>'string' or
       coalesce(q->>'id','')='' or
       jsonb_typeof(q->'options')<>'array' or
       jsonb_array_length(case when jsonb_typeof(q->'options')='array' then q->'options' else '[]'::jsonb end) not between 2 and 8 or
       jsonb_typeof(q->'answerIndex')<>'number' or
       (q->>'answerIndex')!~'^[0-9]+$' or
       case when (q->>'answerIndex')~'^[0-9]{1,3}$'
        then (q->>'answerIndex')::integer>=jsonb_array_length(case when jsonb_typeof(q->'options')='array' then q->'options' else '[]'::jsonb end)
        else true end) then
  raise exception 'INVALID_ISSUANCE' using errcode='22023';
 end if;
 perform pg_advisory_xact_lock(hashtextextended('basic-completion:'||p_user_id::text,0));
 select * into target from cachaste_web.basic_learning_attempts
 where id=p_attempt_id and user_id=p_user_id for update;
 if not found or target.status<>'reserved' or
    target.created_at<now()-interval '90 minutes' or
    (target.kind<>'diagnostic' and target.usage_day<>(now() at time zone 'America/Santiago')::date) then
  raise exception 'ATTEMPT_NOT_ELIGIBLE' using errcode='42501';
 end if;
 insert into cachaste_web.basic_issued_questions(attempt_id,user_id,answer_key)
 values(p_attempt_id,p_user_id,p_answer_key)
 on conflict(attempt_id) do nothing returning attempt_id into inserted_id;
 return inserted_id is not null;
end$issue$;
revoke all on function cachaste_web.issue_basic_question_key(uuid,uuid,jsonb) from public,anon,authenticated;
grant execute on function cachaste_web.issue_basic_question_key(uuid,uuid,jsonb) to service_role;

-- The earlier completion RPC is replaced after the issued-question table exists.
-- A privileged caller must still independently grade the submitted answers.
create or replace function cachaste_web.complete_basic_learning_attempt(
 p_user_id uuid,p_attempt_id uuid
) returns jsonb language plpgsql security definer set search_path='' as $complete$
declare
 a cachaste_web.basic_learning_attempts%rowtype;
 today_chile date:=(now() at time zone 'America/Santiago')::date;
begin
 if auth.role() is distinct from 'service_role' then
  raise exception 'SERVER_ONLY' using errcode='42501';
 end if;
 if p_user_id is null or p_attempt_id is null then
  raise exception 'INVALID_COMPLETION' using errcode='22023';
 end if;
 perform pg_advisory_xact_lock(hashtextextended('basic-completion:'||p_user_id::text,0));
 select * into a from cachaste_web.basic_learning_attempts
 where id=p_attempt_id and user_id=p_user_id for update;
 if not found then raise exception 'ATTEMPT_NOT_FOUND' using errcode='22023'; end if;
 if a.status='completed' then
  return jsonb_build_object('allowed',true,'tier','basica','replayed',true,'attemptId',a.id);
 end if;
 if a.status<>'reserved' or a.created_at<now()-interval '90 minutes' or
  (a.kind<>'diagnostic' and a.usage_day<>today_chile) then
  raise exception 'ATTEMPT_EXPIRED' using errcode='22023';
 end if;
 if not exists(
  select 1 from cachaste_web.basic_issued_questions q
  where q.attempt_id=a.id and q.user_id=a.user_id
 ) then
  raise exception 'QUESTIONS_NOT_ISSUED' using errcode='42501';
 end if;
 insert into cachaste_web.basic_usage(user_id,kind,subject,usage_day,event_id)
 values(a.user_id,a.kind,a.subject,a.usage_day,a.id);
 update cachaste_web.basic_learning_attempts set status='completed',completed_at=now()
 where id=a.id;
 return jsonb_build_object('allowed',true,'tier','basica','attemptId',a.id,'completed',true);
end$complete$;
