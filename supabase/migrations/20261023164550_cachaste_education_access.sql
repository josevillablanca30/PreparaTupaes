begin;
-- Read only the caller's server-verified entitlement. No client can choose an owner or expiry.
create function cachaste.access_state() returns jsonb
language plpgsql security definer set search_path='' as $$
declare u uuid:=cachaste.require_user(); until_at timestamptz; session_until timestamptz;
begin
 if cachaste.premium(u) then
  select valid_until into until_at from cachaste.entitlements where user_id=u;
  select not_after into session_until from auth.sessions where id::text=auth.jwt()->>'session_id' and user_id=u;
  until_at:=least(until_at,session_until,now()+interval '12 hours');
 end if;
 return jsonb_build_object('userId',u,'active',coalesce(until_at>now(),false),
  'serverTimeMs',floor(extract(epoch from now())*1000)::bigint,
  'validUntilMs',case when until_at>now() then floor(extract(epoch from until_at)*1000)::bigint else null end);
end$$;
revoke all on function cachaste.access_state() from public,anon,authenticated;
grant execute on function cachaste.access_state() to authenticated;
create function public.cachaste_access() returns jsonb
language sql security invoker set search_path='' as $$select cachaste.access_state()$$;
revoke all on function public.cachaste_access() from public,anon,authenticated;
grant execute on function public.cachaste_access() to authenticated;
commit;
