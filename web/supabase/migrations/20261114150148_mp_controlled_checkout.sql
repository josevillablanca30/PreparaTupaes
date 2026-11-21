begin;

-- Reserve one weekly checkout for a confirmed account while public sales stay closed.
create table cachaste_web.mp_controlled_checkout_tickets (
 token_hash bytea primary key,
 checkout_id uuid not null references cachaste_web.checkouts(id) on delete cascade,
 expires_at timestamptz not null
);
alter table cachaste_web.mp_controlled_checkout_tickets enable row level security;
revoke all on cachaste_web.mp_controlled_checkout_tickets from public,anon,authenticated,service_role;

create function public.cachaste_mp_controlled_checkout_claim(ticket uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 checkout_key uuid;
 buyer record;
begin
 delete from cachaste_web.mp_controlled_checkout_tickets
 where token_hash=sha256(convert_to(ticket::text,'UTF8')) and expires_at>now()
 returning checkout_id into checkout_key;
 if not found then return null; end if;

 select c.id,c.user_id,c.provider_plan_id,u.email into buyer
 from cachaste_web.checkouts c
 join auth.users u on u.id=c.user_id
 where c.id=checkout_key and c.plan='semanal' and c.provider_plan_linked=false
  and c.trial_offered=false and c.provider_id is null
  and u.email_confirmed_at is not null and not coalesce(u.is_anonymous,false)
  and u.deleted_at is null and u.email is not null
  and not coalesce(cachaste_web.complimentary_until(u.id)>now(),false)
  and not cachaste.premium(u.id)
  and not exists(select 1 from cachaste_web.subscriptions s where s.user_id=u.id and s.renews)
  and not exists(select 1 from cachaste_web.policy where payments_enabled);
 if not found then return null; end if;
 return jsonb_build_object('id',buyer.id,'userId',buyer.user_id,'providerPlanId',buyer.provider_plan_id,'email',buyer.email);
end$$;
revoke all on function public.cachaste_mp_controlled_checkout_claim(uuid) from public,anon,authenticated;
grant execute on function public.cachaste_mp_controlled_checkout_claim(uuid) to service_role;

notify pgrst,'reload schema';
commit;
