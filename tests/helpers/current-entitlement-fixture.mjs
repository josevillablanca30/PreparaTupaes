// Test-only projection of the entitlement composition observed read-only in production on 2026-11-20.
// No user data. Never included in deployment or executed against a hosted database.
export async function installCurrentEntitlementFixture(db){
 await db.exec(`
 create table cachaste.closed_test_access(user_id uuid,valid_until timestamptz,granted_at timestamptz default now(),revoked_at timestamptz);
 create table cachaste.closed_test_emails(email_hash bytea,valid_until timestamptz,granted_at timestamptz default now(),revoked_at timestamptz);
 create function cachaste.closed_test_until(u uuid) returns timestamptz language sql stable security definer set search_path='' as $$
  select max(valid_until) from (
   select a.valid_until from cachaste.closed_test_access a where a.user_id=u and a.revoked_at is null and a.valid_until>now() and a.granted_at<=now()
   union all select e.valid_until from cachaste.closed_test_emails e join auth.users au on au.id=u
    where au.email_confirmed_at is not null and au.deleted_at is null and not coalesce(au.is_anonymous,false)
    and e.email_hash=sha256(convert_to(lower(btrim(au.email)),'UTF8')) and e.revoked_at is null and e.valid_until>now() and e.granted_at<=now()
  ) grants
 $$;
 alter function cachaste.premium(uuid) rename to commercial_premium;
 alter function cachaste.access_state() rename to commercial_access_state;
 create function cachaste.premium(u uuid) returns boolean language sql stable security definer set search_path='' as $$
  select cachaste.commercial_premium(u) or coalesce(cachaste.closed_test_until(u)>now(),false)
 $$;
 create function cachaste.access_state() returns jsonb language plpgsql security definer set search_path='' as $$
 declare u uuid:=cachaste.require_user();baseline jsonb;until_at timestamptz;session_until timestamptz;test_until timestamptz;begin
 if cachaste.commercial_premium(u) then baseline:=cachaste.commercial_access_state();end if;
 test_until:=cachaste.closed_test_until(u);until_at:=greatest(to_timestamp((baseline->>'validUntilMs')::numeric/1000),test_until);
 select not_after into session_until from auth.sessions where id::text=auth.jwt()->>'session_id' and user_id=u;
 if until_at is not null then until_at:=least(until_at,session_until,now()+interval '12 hours');end if;
 return jsonb_build_object('userId',u,'active',coalesce(until_at>now(),false),'serverTimeMs',floor(extract(epoch from now())*1000)::bigint,'validUntilMs',case when until_at>now() then floor(extract(epoch from until_at)*1000)::bigint else null end,'accessSource',case when coalesce(test_until>now(),false) then 'closed_test' when coalesce((baseline->>'active')::boolean,false) then 'subscription' else null end);end$$;
 `);
}
