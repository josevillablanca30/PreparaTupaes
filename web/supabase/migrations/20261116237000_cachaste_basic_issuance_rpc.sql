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

-- Lookup through public RPC because the internal schema is not exposed in PostgREST.
create or replace function public.cachaste_basic_issuance_attempt(p_attempt_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $lookup$
declare a cachaste_web.basic_learning_attempts%rowtype;
begin
 if auth.role() is distinct from 'service_role' then
  raise exception 'SERVER_ONLY' using errcode='42501';
 end if;
 select * into a from cachaste_web.basic_learning_attempts where id=p_attempt_id;
 if not found then return null; end if;
 return jsonb_build_object('id',a.id,'user_id',a.user_id,'kind',a.kind,
  'subject',a.subject,'status',a.status);
end$lookup$;
revoke all on function public.cachaste_basic_issuance_attempt(uuid) from public,anon,authenticated;
grant execute on function public.cachaste_basic_issuance_attempt(uuid) to service_role;
