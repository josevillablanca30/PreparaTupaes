begin;
-- One authority, read fresh from server-controlled app_metadata. No environment allowlists.
create or replace function cachaste_web.is_admin(u uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select exists(select 1 from auth.users where id=u and raw_app_meta_data->>'role'='admin'
 and deleted_at is null and not coalesce(is_anonymous,false))
$$;
revoke all on function cachaste_web.is_admin(uuid) from public,anon,authenticated;
grant execute on function cachaste_web.is_admin(uuid) to service_role;
create or replace function cachaste_web.complimentary_until(u uuid) returns timestamptz
language plpgsql stable security definer set search_path='' as $$
declare until_at timestamptz;
begin
 if to_regprocedure('cachaste.closed_test_until(uuid)') is not null then
  execute 'select cachaste.closed_test_until($1)' into until_at using u;
 end if;
 return until_at;
end$$;
revoke all on function cachaste_web.complimentary_until(uuid) from public,anon,authenticated;
grant execute on function cachaste_web.complimentary_until(uuid) to service_role;
create or replace function cachaste_web.account() returns jsonb
language plpgsql security definer set search_path='' as $$
declare u uuid:=cachaste.require_user(); data jsonb; free_until timestamptz;
begin
 free_until:=cachaste_web.complimentary_until(u);
 select coalesce(jsonb_agg(jsonb_build_object('id',s.provider_id,'plan',s.plan,'status',s.provider_status,
 'paidUntil',s.paid_until,'trialUntil',s.trial_until,'renews',s.renews,'nextPaymentAt',s.next_payment_at)
 order by s.checked_at desc),'[]'::jsonb) into data from cachaste_web.subscriptions s where s.user_id=u;
 return jsonb_build_object('access',cachaste.access_state(),'subscriptions',data,
 'trialUsed',(exists(select 1 from cachaste_web.trials where user_id=u) or exists(select 1 from cachaste_web.checkouts where user_id=u and trial_offered)),
 'isAdmin',cachaste_web.is_admin(u),'complimentary',jsonb_build_object('active',coalesce(free_until>now(),false),
 'validUntil',free_until,'renews',false));
end$$;
-- Preserve the existing caller-scoped wrapper and its grants.
create or replace function cachaste_web.protect_complimentary_checkout() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if cachaste_web.complimentary_until(new.user_id)>now() then raise exception 'COMPLIMENTARY_ACCESS'; end if;
 return new;
end$$;
revoke all on function cachaste_web.protect_complimentary_checkout() from public,anon,authenticated;
create trigger protect_complimentary_checkout before insert on cachaste_web.checkouts
for each row execute function cachaste_web.protect_complimentary_checkout();
commit;
