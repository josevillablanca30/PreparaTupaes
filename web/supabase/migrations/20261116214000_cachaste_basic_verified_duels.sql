-- Server-verified Duelos 2.0 completion. Not a public student endpoint.
-- Must be called only after a match is finalized by the authoritative duel engine.
-- This does not yet grant Basic users permission to create matches.
create or replace function cachaste_web.basic_record_finished_duel(
 p_user_id uuid,p_match_id uuid
) returns jsonb language plpgsql security definer set search_path='' as $$
declare
 m cachaste_duels2.matches%rowtype;
 player_status text;
begin
 if auth.role() is distinct from 'service_role' then
  raise exception 'SERVER_ONLY' using errcode='42501';
 end if;
 if p_user_id is null or p_match_id is null then
  raise exception 'INVALID_DUEL' using errcode='22023';
 end if;
 select * into m from cachaste_duels2.matches where id=p_match_id;
 if not found or m.status<>'finished' or m.result is null or\n    jsonb_typeof(m.result)<>'object' or\n    coalesce(m.result->>'reason','') not in ('mastery','draw','abandonment','both_abandoned') or\n    coalesce(m.result->'creator'->>'status','') not in ('complete','forfeit') or\n    coalesce(m.result->'opponent'->>'status','') not in ('complete','forfeit') then
  raise exception 'DUEL_NOT_FINISHED' using errcode='42501';
 end if;
 -- A participant must have a completed or forfeited authoritative player record.\n -- The match result must have been written by the authoritative finalizer.
 select p.status into player_status from cachaste_duels2.players p
 where p.match_id=p_match_id and p.user_id=p_user_id;
 if p_user_id not in (m.creator,m.opponent) or\n    player_status is null or player_status not in ('complete','forfeit') then
  raise exception 'DUEL_PARTICIPATION_NOT_VERIFIED' using errcode='42501';
 end if;
 return cachaste_web.basic_record_verified_completion(p_user_id,'duel','all',p_match_id);
end$$;
revoke all on function cachaste_web.basic_record_finished_duel(uuid,uuid) from public,anon,authenticated;
grant execute on function cachaste_web.basic_record_finished_duel(uuid,uuid) to service_role;
create or replace function public.cachaste_basic_record_finished_duel(
 p_user_id uuid,p_match_id uuid
) returns jsonb language sql security invoker set search_path=''
as $$select cachaste_web.basic_record_finished_duel(p_user_id,p_match_id)$$;
revoke all on function public.cachaste_basic_record_finished_duel(uuid,uuid) from public,anon,authenticated;
grant execute on function public.cachaste_basic_record_finished_duel(uuid,uuid) to service_role;
