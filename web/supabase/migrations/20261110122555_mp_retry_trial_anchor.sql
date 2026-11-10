-- A definitively rejected request gets a new seven-day anchor only when its retry is atomically claimed.
begin;
create or replace function cachaste_web.billing_admin(operation text,payload jsonb default '{}')returns jsonb language plpgsql security definer set search_path='' as $$
#variable_conflict use_column
declare u uuid;id text;checkout cachaste_web.checkouts;sub cachaste_web.subscriptions;observed timestamptz;trial_end timestamptz;p jsonb;rows jsonb;
begin
 if operation='policy'then return(select jsonb_build_object('enabled',payments_enabled and tax_ready,'allowTests',allow_test_purchases)from cachaste_web.policy limit 1);end if;
 if operation='lookup'then select to_jsonb(c)into rows from cachaste_web.checkouts c where c.provider_id=payload->>'providerId'or c.id::text=payload->>'reference';return rows;end if;
 if operation='webhook_seen'then return jsonb_build_object('seen',exists(select 1 from cachaste_web.webhook_receipts where signature_hash=payload->>'hash'));end if;
 if operation='webhook'then
  insert into cachaste_web.webhook_receipts(signature_hash)values(payload->>'hash')on conflict do nothing;
  return jsonb_build_object('fresh',found);
 end if;
 if operation='sales'then
  select coalesce(jsonb_agg(to_jsonb(v)order by v.paid_at),'[]'::jsonb)into rows from(select provider_id,subscription_id,user_id,plan,status,amount_clp,fee_clp,net_clp,paid_at,live_mode from cachaste_web.payments where paid_at>=(payload->>'from')::timestamptz and paid_at<(payload->>'to')::timestamptz order by paid_at limit 10001)v;
  return jsonb_build_object('rows',rows);
 end if;
 u:=(payload->>'userId')::uuid;
 if not exists(select 1 from auth.users where auth.users.id=u and not coalesce(is_anonymous,false)and deleted_at is null)then raise exception 'AUTH_REQUIRED';end if;
 perform pg_advisory_xact_lock(hashtextextended('web-billing:'||u::text,0));
 if operation='rate'then perform cachaste.rate(u,'mp_checkout',10,3600);return '{}'::jsonb;end if;
 if operation='subscriptions'then select coalesce(jsonb_agg(coalesce(to_jsonb(s),jsonb_build_object('provider_id',c.provider_id,'plan',c.plan))),'[]'::jsonb)into rows from cachaste_web.checkouts c left join cachaste_web.subscriptions s on s.provider_id=c.provider_id where c.user_id=u and c.provider_id is not null;return rows;end if;
 if operation='checkout_failed'then
  if coalesce((payload->>'status')::integer,0) not in (400,401,403,404,422) then raise exception 'UNSAFE_CHECKOUT_RETRY';end if;
  update cachaste_web.checkouts set retryable=true where id=(payload->>'id')::uuid and user_id=u and provider_id is null;
  return jsonb_build_object('retryable',found);
 end if;
 if operation='checkout'then
  if not exists(select 1 from cachaste_web.policy where payments_enabled and tax_ready)then raise exception 'BILLING_NOT_READY';end if;
  select * into checkout from cachaste_web.checkouts where cachaste_web.checkouts.id=(payload->>'id')::uuid;
  if found then
   if checkout.user_id<>u or checkout.plan<>payload->>'plan'then raise exception 'CHECKOUT_ALREADY_LINKED';end if;
   if checkout.retryable and checkout.provider_id is null then
    update cachaste_web.checkouts set retryable=false,created_at=clock_timestamp() where id=checkout.id returning * into checkout;
    return to_jsonb(checkout)||jsonb_build_object('created',true);
   end if;
   return to_jsonb(checkout)||jsonb_build_object('created',false);
  end if;
  if coalesce((payload->>'trial')::boolean,false)and(exists(select 1 from cachaste_web.trials where user_id=u)or exists(select 1 from cachaste_web.checkouts where user_id=u and trial_offered and cachaste_web.checkouts.id<>(payload->>'id')::uuid))then raise exception 'TRIAL_ALREADY_USED';end if;
  insert into cachaste_web.checkouts(id,user_id,plan,provider_plan_id,trial_offered,provider_plan_linked)values((payload->>'id')::uuid,u,payload->>'plan',payload->>'providerPlanId',coalesce((payload->>'trial')::boolean,false),coalesce((payload->>'linkedPlan')::boolean,true))on conflict(id)do nothing;
  select * into checkout from cachaste_web.checkouts where cachaste_web.checkouts.id=(payload->>'id')::uuid;
  if checkout.user_id<>u or checkout.plan<>payload->>'plan'then raise exception 'CHECKOUT_ALREADY_LINKED';end if;
  return to_jsonb(checkout)||jsonb_build_object('created',true);
 end if;
 if operation='attach'then
  update cachaste_web.checkouts set provider_id=payload->>'providerId'where cachaste_web.checkouts.id=(payload->>'id')::uuid and user_id=u and(provider_id is null or provider_id=payload->>'providerId')returning * into checkout;
  if not found then raise exception 'CHECKOUT_ALREADY_LINKED';end if;return to_jsonb(checkout);
 end if;
 if operation<>'apply'then raise exception 'INVALID_OPERATION';end if;
 observed:=(payload->>'observedAt')::timestamptz;
 if observed>clock_timestamp()+interval '5 seconds'or observed<clock_timestamp()-interval '10 minutes'then raise exception 'INVALID_OBSERVATION';end if;
 select * into checkout from cachaste_web.checkouts where cachaste_web.checkouts.id=(payload->>'checkoutId')::uuid and user_id=u and provider_id=payload->>'providerId';
 if not found or checkout.plan<>payload->>'plan'then raise exception 'UNKNOWN_CHECKOUT';end if;
 trial_end:=(payload->>'trialUntil')::timestamptz;
 if trial_end is not null then
  if not checkout.trial_offered or checkout.plan<>'mensual'or trial_end>checkout.created_at+interval '7 days 5 minutes'then raise exception 'INVALID_TRIAL';end if;
  insert into cachaste_web.trials(user_id,provider_id,ends_at)values(u,payload->>'providerId',trial_end)on conflict(user_id)do nothing;
  if not exists(select 1 from cachaste_web.trials where user_id=u and provider_id=payload->>'providerId')then raise exception 'TRIAL_ALREADY_USED';end if;
 end if;
 insert into cachaste_web.subscriptions(provider_id,checkout_id,user_id,plan,provider_status,paid_until,trial_until,observed_at,live_mode,renews,next_payment_at)
 values(payload->>'providerId',checkout.id,u,checkout.plan,payload->>'status',(payload->>'paidUntil')::timestamptz,trial_end,observed,(payload->>'liveMode')::boolean,(payload->>'renews')::boolean,(payload->>'nextPaymentAt')::timestamptz)
 on conflict(provider_id)do update set provider_status=excluded.provider_status,paid_until=excluded.paid_until,trial_until=excluded.trial_until,observed_at=excluded.observed_at,checked_at=clock_timestamp(),live_mode=excluded.live_mode,renews=excluded.renews,next_payment_at=excluded.next_payment_at
 where cachaste_web.subscriptions.user_id=excluded.user_id and cachaste_web.subscriptions.observed_at<=excluded.observed_at;
 if not found and exists(select 1 from cachaste_web.subscriptions where provider_id=payload->>'providerId'and user_id<>u)then raise exception 'SUBSCRIPTION_ALREADY_LINKED';end if;
 for p in select * from jsonb_array_elements(coalesce(payload->'payments','[]'::jsonb))loop
  insert into cachaste_web.payments(provider_id,subscription_id,user_id,plan,status,amount_clp,fee_clp,net_clp,paid_at,observed_at,live_mode)
  values(p->>'id',payload->>'providerId',u,checkout.plan,p->>'status',(p->>'amount')::numeric,(p->>'fee')::numeric,(p->>'net')::numeric,(p->>'paidAt')::timestamptz,observed,(p->>'liveMode')::boolean)
  on conflict(provider_id)do update set status=excluded.status,amount_clp=excluded.amount_clp,fee_clp=excluded.fee_clp,net_clp=excluded.net_clp,paid_at=excluded.paid_at,observed_at=excluded.observed_at
  where cachaste_web.payments.user_id=excluded.user_id and cachaste_web.payments.subscription_id=excluded.subscription_id and cachaste_web.payments.observed_at<=excluded.observed_at;
 end loop;
 return jsonb_build_object('premium',cachaste.premium(u));
end$$;

create or replace function cachaste_web.sandbox_admin(operation text,payload jsonb default '{}') returns jsonb
language plpgsql security definer set search_path='' as $$
#variable_conflict use_column
declare u uuid; row cachaste_web.sandbox_checkouts; new_snapshot jsonb; rows jsonb; inserted boolean;
begin
 if operation='seen' then
  if coalesce((payload->>'record')::boolean,false) then insert into cachaste_web.sandbox_receipts values(payload->>'hash',now()) on conflict do nothing;end if;
  return jsonb_build_object('seen',exists(select 1 from cachaste_web.sandbox_receipts where signature_hash=payload->>'hash'));
 end if;
 if operation='lookup' then
  select to_jsonb(c) into rows from cachaste_web.sandbox_checkouts c where provider_id=payload->>'providerId' or id::text=payload->>'reference';return rows;
 end if;
 u:=(payload->>'userId')::uuid;
 if not cachaste_web.is_admin(u) then raise exception 'QA_ADMIN_REQUIRED';end if;
 perform pg_advisory_xact_lock(hashtextextended('mp-sandbox:'||u::text,0));
 if operation='list' then select coalesce(jsonb_agg(to_jsonb(c) order by created_at desc),'[]'::jsonb) into rows from cachaste_web.sandbox_checkouts c where user_id=u;return rows;end if;
 if operation='checkout_failed' then
  if coalesce((payload->>'status')::integer,0) not in (400,401,403,404,422) then raise exception 'UNSAFE_CHECKOUT_RETRY';end if;
  update cachaste_web.sandbox_checkouts set retryable=true where id=(payload->>'id')::uuid and user_id=u and provider_id is null;
  return jsonb_build_object('retryable',found);
 end if;
 if operation='reserve' then
  select * into row from cachaste_web.sandbox_checkouts where id=(payload->>'id')::uuid;
  if found then
   if row.user_id<>u or row.plan<>payload->>'plan' or row.provider_plan_id<>payload->>'providerPlanId' or row.provider_plan_linked<>coalesce((payload->>'linkedPlan')::boolean,false) then raise exception 'CHECKOUT_ALREADY_LINKED';end if;
   if row.retryable and row.provider_id is null then
    perform cachaste.rate(u,'mp_sandbox_checkout',10,3600);
    update cachaste_web.sandbox_checkouts set retryable=false,created_at=clock_timestamp() where id=row.id returning * into row;
    return to_jsonb(row)||jsonb_build_object('created',true);
   end if;
   return to_jsonb(row)||jsonb_build_object('created',false);
  end if;
  perform cachaste.rate(u,'mp_sandbox_checkout',10,3600);
  insert into cachaste_web.sandbox_checkouts(id,user_id,plan,provider_plan_id,trial_offered,provider_plan_linked)
  values((payload->>'id')::uuid,u,payload->>'plan',payload->>'providerPlanId',coalesce((payload->>'trial')::boolean,false),coalesce((payload->>'linkedPlan')::boolean,false)) returning * into row;
  return to_jsonb(row)||jsonb_build_object('created',true);
 end if;
 if operation='attach' then
  update cachaste_web.sandbox_checkouts set provider_id=payload->>'providerId' where id=(payload->>'id')::uuid and user_id=u and (provider_id is null or provider_id=payload->>'providerId') returning * into row;
  if not found then raise exception 'CHECKOUT_ALREADY_LINKED';end if;return to_jsonb(row);
 end if;
 if operation='apply' then
  new_snapshot:=payload->'snapshot';
  if (new_snapshot->>'liveMode')::boolean is distinct from false or (new_snapshot->>'checkoutId') is distinct from (payload->>'id') or (new_snapshot->>'userId') is distinct from u::text then raise exception 'INVALID_SANDBOX_OBSERVATION';end if;
  if new_snapshot->>'observedAt' is null or (new_snapshot->>'observedAt')::timestamptz>clock_timestamp()+interval '5 seconds' or (new_snapshot->>'observedAt')::timestamptz<clock_timestamp()-interval '10 minutes' then raise exception 'INVALID_OBSERVATION';end if;
  update cachaste_web.sandbox_checkouts set snapshot=payload->'snapshot',checked_at=clock_timestamp()
  where id=(payload->>'id')::uuid and user_id=u and provider_id=new_snapshot->>'providerId'
  and (snapshot is null or coalesce((cachaste_web.sandbox_checkouts.snapshot->>'observedAt')::timestamptz,'-infinity')<=(payload->'snapshot'->>'observedAt')::timestamptz);
  return jsonb_build_object('stored',found,'productionAccess',false);
 end if;
 raise exception 'INVALID_OPERATION';
end$$;
commit;
