-- Read-only progress derived exclusively from server-verified completions.
-- NOT APPLIED TO PRODUCTION. This does not modify the Premium progress documents.
-- The student's identity is resolved from their authenticated JWT, never HTTP JSON.
create or replace function cachaste_web.basic_verified_progress_snapshot()
returns jsonb language plpgsql stable security definer set search_path='' as $snapshot$
declare
 u uuid:=cachaste.require_user();
 today_chile date:=(now() at time zone 'America/Santiago')::date;
 completed jsonb;
begin
 -- The ledger only contains trusted, completed attempts (or activated duels).
 select coalesce(jsonb_agg(jsonb_build_object(
   'eventId',q.event_id,'kind',q.kind,'subject',q.subject,
   'day',q.usage_day,'recordedAt',q.created_at
 ) order by q.created_at desc,q.event_id desc),'[]'::jsonb)
 into completed
 from cachaste_web.basic_usage q where q.user_id=u;
 return jsonb_build_object('verifiedCompletions',completed,'day',today_chile);
end$snapshot$;
revoke all on function cachaste_web.basic_verified_progress_snapshot() from public,anon,authenticated;
grant execute on function cachaste_web.basic_verified_progress_snapshot() to authenticated;
create or replace function public.cachaste_basic_verified_progress_snapshot()
returns jsonb language sql stable security invoker set search_path='' as $wrapper$
 select cachaste_web.basic_verified_progress_snapshot()
$wrapper$;
revoke all on function public.cachaste_basic_verified_progress_snapshot() from public,anon;
grant execute on function public.cachaste_basic_verified_progress_snapshot() to authenticated;
