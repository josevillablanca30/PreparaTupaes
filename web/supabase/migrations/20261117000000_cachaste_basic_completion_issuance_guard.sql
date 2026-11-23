-- Defense in depth: a Basic attempt cannot become completed without a
-- server-issued answer key. Trusted answer grading remains required separately.
-- NOT APPLIED TO PRODUCTION.
create or replace function cachaste_web.guard_basic_completion_issuance()
returns trigger language plpgsql security definer set search_path='' as $guard$
begin
 if new.status='completed' and old.status is distinct from 'completed' then
  if old.status<>'reserved' or not exists(
   select 1 from cachaste_web.basic_issued_questions q
   where q.attempt_id=new.id and q.user_id=new.user_id
  ) then
   raise exception 'ISSUED_QUESTIONS_REQUIRED' using errcode='42501';
  end if;
 end if;
 return new;
end$guard$;
revoke all on function cachaste_web.guard_basic_completion_issuance() from public,anon,authenticated;
drop trigger if exists basic_completion_requires_issuance on cachaste_web.basic_learning_attempts;
create trigger basic_completion_requires_issuance
 before update of status on cachaste_web.basic_learning_attempts
 for each row execute function cachaste_web.guard_basic_completion_issuance();
