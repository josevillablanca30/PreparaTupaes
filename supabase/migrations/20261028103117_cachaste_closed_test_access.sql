begin;
-- Owner-authorized closed test, separate from purchases. No identities are seeded.
create table cachaste.closed_test_access (
 user_id uuid primary key references auth.users(id) on delete cascade,
 granted_at timestamptz not null default now(),
 valid_until timestamptz not null,
 revoked_at timestamptz,
 reason text not null check(length(reason) between 1 and 240),
 check(valid_until>granted_at and valid_until<=granted_at+interval '30 days')
);
alter table cachaste.closed_test_access enable row level security;
revoke all on cachaste.closed_test_access from public,anon,authenticated,service_role;
comment on table cachaste.closed_test_access is 'Owner-managed UUID allowlist. No client grants. Maximum 30 days per explicit administrative grant.';
-- Preserve whichever commercial policy is installed (Android-only or shared web).
do $$begin
 execute replace(pg_get_functiondef('cachaste.premium(uuid)'::regprocedure),'FUNCTION cachaste.premium(', 'FUNCTION cachaste.commercial_premium(');
 execute replace(pg_get_functiondef('cachaste.access_state()'::regprocedure),'FUNCTION cachaste.access_state(', 'FUNCTION cachaste.commercial_access_state(');
end$$;
revoke all on function cachaste.commercial_premium(uuid),cachaste.commercial_access_state() from public,anon,authenticated,service_role;
create function cachaste.closed_test_until(u uuid) returns timestamptz
language sql stable security definer set search_path='' as $$
 select valid_until from cachaste.closed_test_access
 where user_id=u and revoked_at is null and valid_until>now() and granted_at<=now()
$$;
revoke all on function cachaste.closed_test_until(uuid) from public,anon,authenticated,service_role;
create or replace function cachaste.premium(u uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select cachaste.commercial_premium(u) or coalesce(cachaste.closed_test_until(u)>now(),false)
$$;
revoke all on function cachaste.premium(uuid) from public,anon,authenticated;
grant execute on function cachaste.premium(uuid) to service_role;
create or replace function cachaste.access_state() returns jsonb
language plpgsql security definer set search_path='' as $$
declare u uuid:=cachaste.require_user(); baseline jsonb; until_at timestamptz; session_until timestamptz; test_until timestamptz;
begin
 -- Only invoke the saved commercial path if its own original policy grants access.
 -- This prevents a test grant from being interpreted as a paid entitlement.
 if cachaste.commercial_premium(u) then baseline:=cachaste.commercial_access_state();end if;
 test_until:=cachaste.closed_test_until(u);
 until_at:=greatest(to_timestamp((baseline->>'validUntilMs')::numeric/1000),test_until);
 select not_after into session_until from auth.sessions where id::text=auth.jwt()->>'session_id' and user_id=u;
 if until_at is not null then until_at:=least(until_at,session_until,now()+interval '12 hours');end if;
 return jsonb_build_object('userId',u,'active',coalesce(until_at>now(),false),
  'serverTimeMs',floor(extract(epoch from now())*1000)::bigint,
  'validUntilMs',case when until_at>now()then floor(extract(epoch from until_at)*1000)::bigint else null end,
  'accessSource',case when coalesce(test_until>now(),false)then 'closed_test' when coalesce((baseline->>'active')::boolean,false)then 'subscription' else null end);
end$$;
revoke all on function cachaste.access_state() from public,anon,authenticated;
grant execute on function cachaste.access_state() to authenticated;
commit;
