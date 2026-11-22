-- Permanent educational access for the authorized owner account.
-- This does not update any payments, subscriptions, tester grants or user metadata.
create function cachaste.owner_learning_access(u uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select u='94006b4b-015e-46df-99ea-2a098a2438b0'::uuid and cachaste_web.is_admin(u)
$$;
revoke all on function cachaste.owner_learning_access(uuid) from public,anon,authenticated;

create or replace function cachaste.premium(u uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select cachaste.owner_learning_access(u) or cachaste.commercial_premium(u)
  or coalesce(cachaste.closed_test_until(u)>now(),false)
$$;

create or replace function cachaste.access_state()
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 u uuid:=cachaste.require_user();
 administrator boolean:=cachaste.owner_learning_access(u);
 baseline jsonb;
 until_at timestamptz;
 session_until timestamptz;
 test_until timestamptz;
begin
 if not administrator then
  if cachaste.commercial_premium(u) then baseline:=cachaste.commercial_access_state();end if;
  test_until:=cachaste.closed_test_until(u);
 end if;
 until_at:=case when administrator then now()+interval '12 hours'
  else greatest(to_timestamp((baseline->>'validUntilMs')::numeric/1000),test_until) end;
 select not_after into session_until from auth.sessions where id::text=auth.jwt()->>'session_id' and user_id=u;
 if until_at is not null then until_at:=least(until_at,session_until,now()+interval '12 hours');end if;
 return jsonb_build_object('userId',u,'active',coalesce(until_at>now(),false),
  'serverTimeMs',floor(extract(epoch from now())*1000)::bigint,
  'validUntilMs',case when until_at>now() then floor(extract(epoch from until_at)*1000)::bigint else null end,
  'accessSource',case when administrator then 'admin' when coalesce(test_until>now(),false) then 'closed_test'
   when coalesce((baseline->>'active')::boolean,false) then 'subscription' else null end);
end
$$;
