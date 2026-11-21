begin;

-- Created by a trusted project operator after verifying control of both accounts.
-- evidence_ref is an internal review reference, never a credential or a checkout ID.
create table cachaste_web.sandbox_hosted_ownership(
 provider_id text primary key check(provider_id ~ '^[a-zA-Z0-9_-]{1,128}$'),
 user_id uuid not null references auth.users(id) on delete cascade,
 payer_id text not null check(payer_id ~ '^[1-9][0-9]{0,18}$'),
 collector_id text not null check(collector_id ~ '^[1-9][0-9]{0,18}$'),
 application_id text not null check(application_id ~ '^[1-9][0-9]{0,18}$'),
 evidence_ref text not null check(length(btrim(evidence_ref)) between 1 and 160),
 verified_at timestamptz not null default now(),
 check(payer_id <> collector_id)
);
create index sandbox_hosted_ownership_user on cachaste_web.sandbox_hosted_ownership(user_id);
alter table cachaste_web.sandbox_hosted_ownership enable row level security;
revoke all on cachaste_web.sandbox_hosted_ownership from public,anon,authenticated,service_role;

alter table cachaste_web.sandbox_checkouts
 add column hosted_payment_id text unique check(hosted_payment_id ~ '^[1-9][0-9]{0,18}$'),
 add column hosted_payer_id text check(hosted_payer_id ~ '^[1-9][0-9]{0,18}$'),
 add column hosted_collector_id text check(hosted_collector_id ~ '^[1-9][0-9]{0,18}$'),
 add column hosted_application_id text check(hosted_application_id ~ '^[1-9][0-9]{0,18}$'),
 add constraint sandbox_hosted_binding_complete check(
  num_nonnulls(hosted_payment_id,hosted_payer_id,hosted_collector_id,hosted_application_id)=0
  or (num_nonnulls(hosted_payment_id,hosted_payer_id,hosted_collector_id,hosted_application_id)=4
      and provider_id is not null and provider_plan_linked and hosted_payer_id<>hosted_collector_id)
 );

create function cachaste_web.link_sandbox_hosted(payload jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare
 owner_id uuid := (payload->>'userId')::uuid;
 subscription_id text := payload->>'providerId';
 payment_id text := payload->>'paymentId';
 snapshot jsonb := payload->'snapshot';
 proof cachaste_web.sandbox_hosted_ownership;
 checkout cachaste_web.sandbox_checkouts;
begin
 if not cachaste_web.is_admin(owner_id) then raise exception 'QA_ADMIN_REQUIRED'; end if;
 perform pg_advisory_xact_lock(hashtextextended('mp-sandbox:'||owner_id::text,0));

 select * into proof from cachaste_web.sandbox_hosted_ownership
 where provider_id=subscription_id and user_id=owner_id
   and payer_id=payload->>'payerId' and collector_id=payload->>'collectorId'
   and application_id=payload->>'applicationId'
 for share;
 if not found then raise exception 'OWNERSHIP_REQUIRED'; end if;

 if snapshot->>'providerId' is distinct from subscription_id
    or snapshot->>'plan' is distinct from payload->>'plan'
    or snapshot->'liveMode' is distinct from 'false'::jsonb
    or jsonb_typeof(snapshot->'payments') is distinct from 'array' then
  raise exception 'INVALID_SANDBOX_OBSERVATION';
 end if;
 if not exists(
  select 1 from jsonb_array_elements(snapshot->'payments') as payment
  where payment->>'id'=payment_id and payment->>'status'='approved' and payment->'liveMode'='false'::jsonb
 ) then raise exception 'PAYMENT_NOT_VERIFIED'; end if;

 insert into cachaste_web.sandbox_checkouts(
  id,user_id,plan,provider_plan_id,provider_plan_linked,trial_offered,provider_id,created_at,
  hosted_payment_id,hosted_payer_id,hosted_collector_id,hosted_application_id
 ) values(
  gen_random_uuid(),owner_id,payload->>'plan',payload->>'providerPlanId',true,
  coalesce((payload->>'trial')::boolean,false),subscription_id,(payload->>'createdAt')::timestamptz,
  payment_id,proof.payer_id,proof.collector_id,proof.application_id
 ) on conflict do nothing;

 select * into checkout from cachaste_web.sandbox_checkouts where provider_id=subscription_id;
 if not found or checkout.user_id<>owner_id or checkout.plan<>payload->>'plan'
    or checkout.provider_plan_id<>payload->>'providerPlanId'
    or checkout.hosted_payment_id is distinct from payment_id
    or checkout.hosted_payer_id is distinct from proof.payer_id
    or checkout.hosted_collector_id is distinct from proof.collector_id
    or checkout.hosted_application_id is distinct from proof.application_id then
  raise exception 'CHECKOUT_ALREADY_LINKED';
 end if;

 perform cachaste_web.sandbox_admin('apply',jsonb_build_object(
  'id',checkout.id,'userId',owner_id,
  'snapshot',snapshot||jsonb_build_object('checkoutId',checkout.id,'userId',owner_id)
 ));
 return (select c.snapshot from cachaste_web.sandbox_checkouts c where c.id=checkout.id);
end$$;
revoke all on function cachaste_web.link_sandbox_hosted(jsonb) from public,anon,authenticated;
grant execute on function cachaste_web.link_sandbox_hosted(jsonb) to service_role;

create function public.cachaste_mp_sandbox_link_hosted(payload jsonb) returns jsonb
language sql security invoker set search_path='' as $$select cachaste_web.link_sandbox_hosted(payload)$$;
revoke all on function public.cachaste_mp_sandbox_link_hosted(jsonb) from public,anon,authenticated;
grant execute on function public.cachaste_mp_sandbox_link_hosted(jsonb) to service_role;
commit;
