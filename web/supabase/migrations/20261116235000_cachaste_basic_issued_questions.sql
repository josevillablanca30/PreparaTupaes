-- Server-owned issued question keys for Basic educational attempts.
-- NOT APPLIED TO PRODUCTION. Never expose this table through client RPCs.
-- Issuance must happen after atomic reservation and only through a trusted server.
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

-- The service role can issue a key only for a reserved attempt belonging to
-- the same user. No update path: a question key is immutable after issuance.
create or replace function cachaste_web.issue_basic_question_key(
 p_user_id uuid,p_attempt_id uuid,p_answer_key jsonb
) returns boolean language plpgsql security definer set search_path='' as $$
declare
 target cachaste_web.basic_learning_attempts%rowtype;
begin
 if auth.role() is distinct from 'service_role' then
  raise exception 'SERVICE_ROLE_REQUIRED' using errcode='42501';
 end if;
 if p_user_id is null or p_attempt_id is null or
    jsonb_typeof(p_answer_key) is distinct from 'array' or
    jsonb_array_length(p_answer_key) not between 1 and 80 then
  raise exception 'INVALID_ISSUANCE' using errcode='22023';
 end if;
 select * into target from cachaste_web.basic_learning_attempts
 where id=p_attempt_id and user_id=p_user_id for update;
 if not found or target.status<>'reserved' or
    target.created_at<now()-interval '90 minutes' or
    (target.kind<>'diagnostic' and target.usage_day<>(now() at time zone 'America/Santiago')::date) then
  raise exception 'ATTEMPT_NOT_ELIGIBLE' using errcode='42501';
 end if;
 insert into cachaste_web.basic_issued_questions(attempt_id,user_id,answer_key)
 values(p_attempt_id,p_user_id,p_answer_key)
 on conflict(attempt_id) do nothing;
 -- A replay must not overwrite an existing key; return true only for insertion.
 return found;
end$$;
revoke all on function cachaste_web.issue_basic_question_key(uuid,uuid,jsonb) from public,anon,authenticated;
grant execute on function cachaste_web.issue_basic_question_key(uuid,uuid,jsonb) to service_role;
