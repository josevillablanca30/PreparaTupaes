-- Expose only the service-role issuance RPC to the trusted Worker.
-- Its underlying function checks attempt ownership, reservation and lease.
-- NOT APPLIED TO PRODUCTION.
create or replace function public.cachaste_issue_basic_question_key(
 p_user_id uuid,p_attempt_id uuid,p_answer_key jsonb
) returns boolean language sql security invoker set search_path='' as $issue$
 select cachaste_web.issue_basic_question_key(p_user_id,p_attempt_id,p_answer_key)
$issue$;
revoke all on function public.cachaste_issue_basic_question_key(uuid,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.cachaste_issue_basic_question_key(uuid,uuid,jsonb) to service_role;
