-- Additive web integration. Existing competition operations and Google receipts keep their contracts.
begin;
create schema cachaste_web;
revoke all on schema cachaste_web from public,anon;
grant usage on schema cachaste_web to authenticated,service_role;
create table cachaste_web.policy(id boolean primary key default true check(id),payments_enabled boolean not null default false,tax_ready boolean not null default false,allow_test_purchases boolean not null default false);
insert into cachaste_web.policy default values;
create table cachaste_web.learning_documents(
 user_id uuid not null references auth.users(id)on delete cascade,key text not null,
 value jsonb,version bigint not null default 1 check(version>0),updated_at timestamptz not null default now(),
 primary key(user_id,key),check(key in('cachaste-daily-v1','prepara-paes-demo-v1','prepara-paes-active-exam-v1','cachaste-m1-assessments-v1','cachaste-m1-diagnostic-30-v1','cachaste-m1-diagnostic-draft-v1','cachaste-m1-pending-review-v1','cachaste-science-v1','cachaste-reading-v1','cachaste-m2-v1','cachaste-history-v1')),
 check(value is null or jsonb_typeof(value)in('object','array')),check(octet_length(coalesce(value::text,''))<=1048576)
);
create table cachaste_web.checkouts(
 id uuid primary key,user_id uuid not null references auth.users(id)on delete cascade,
 plan text not null check(plan in('semanal','mensual','anual')),provider_plan_id text not null,
 provider_id text unique,trial_offered boolean not null default false,created_at timestamptz not null default now()
);
create index web_checkouts_user on cachaste_web.checkouts(user_id,created_at desc);
create table cachaste_web.subscriptions(
 provider_id text primary key,checkout_id uuid not null unique references cachaste_web.checkouts(id)on delete cascade,
 user_id uuid not null references auth.users(id)on delete cascade,plan text not null check(plan in('semanal','mensual','anual')),
 provider_status text not null,paid_until timestamptz,trial_until timestamptz,
 checked_at timestamptz not null default now(),observed_at timestamptz not null,
 live_mode boolean not null,renews boolean not null default false,next_payment_at timestamptz
);
create index web_subscriptions_user on cachaste_web.subscriptions(user_id,checked_at desc);
create table cachaste_web.trials(user_id uuid primary key references auth.users(id)on delete cascade,provider_id text not null,ends_at timestamptz not null,created_at timestamptz not null default now());
create table cachaste_web.payments(
 provider_id text primary key,subscription_id text references cachaste_web.subscriptions(provider_id)on delete set null,
 user_id uuid references auth.users(id)on delete set null,plan text not null,
 status text not null,amount_clp numeric(14,2)not null check(amount_clp>=0),fee_clp numeric(14,2)not null check(fee_clp>=0),net_clp numeric(14,2)not null,
 paid_at timestamptz,observed_at timestamptz not null,live_mode boolean not null
);
create index web_payments_user on cachaste_web.payments(user_id,paid_at desc);
create index web_payments_subscription on cachaste_web.payments(subscription_id);
create index web_payments_report on cachaste_web.payments(paid_at)where live_mode;
create table cachaste_web.webhook_receipts(signature_hash text primary key,received_at timestamptz not null default now());
-- No client gets direct table access. Caller-scoped invoker RPCs use a private dispatcher.
alter table cachaste_web.policy enable row level security;
alter table cachaste_web.learning_documents enable row level security;
alter table cachaste_web.checkouts enable row level security;
alter table cachaste_web.subscriptions enable row level security;
alter table cachaste_web.trials enable row level security;
alter table cachaste_web.payments enable row level security;
alter table cachaste_web.webhook_receipts enable row level security;
revoke all on all tables in schema cachaste_web from public,anon,authenticated;
grant all on all tables in schema cachaste_web to service_role;

create function cachaste_web.google_premium(u uuid)returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from cachaste.entitlements e cross join cachaste.settings s where e.user_id=u and e.valid_until>now()and e.status in('active','trial')and(e.source='google_play_verified'or(e.source='test_harness'and s.environment='test')))
$$;
revoke all on function cachaste_web.google_premium(uuid)from public,anon,authenticated;
create function cachaste_web.entitlement_until(u uuid)returns timestamptz language sql stable security definer set search_path='' as $$
 select max(least(greatest(s.paid_until,s.trial_until),s.checked_at+interval '12 hours'))
 from cachaste_web.subscriptions s cross join cachaste_web.policy p cross join cachaste.settings core
 where s.user_id=u and p.payments_enabled and p.tax_ready
 and(s.live_mode or(p.allow_test_purchases and core.environment='test'))
 and s.checked_at>now()-interval '12 hours'
 and s.provider_status in('authorized','cancelled','canceled','paused')
 and greatest(s.paid_until,s.trial_until)>now()
$$;
revoke all on function cachaste_web.entitlement_until(uuid)from public,anon,authenticated;
create or replace function cachaste.premium(u uuid)returns boolean language sql stable security definer set search_path='' as $$
 select cachaste_web.google_premium(u)or coalesce(cachaste_web.entitlement_until(u)>now(),false)
$$;
revoke all on function cachaste.premium(uuid)from public,anon,authenticated;
grant execute on function cachaste.premium(uuid)to service_role;
create or replace function cachaste.access_state()returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=cachaste.require_user();until_at timestamptz;google_until timestamptz;session_until timestamptz;
begin
 if cachaste_web.google_premium(u)then select valid_until into google_until from cachaste.entitlements where user_id=u;end if;
 until_at:=greatest(google_until,cachaste_web.entitlement_until(u));
 if until_at is not null then
  select not_after into session_until from auth.sessions where id::text=auth.jwt()->>'session_id'and user_id=u;
  until_at:=least(until_at,session_until,now()+interval '12 hours');
 end if;
 return jsonb_build_object('userId',u,'active',coalesce(until_at>now(),false),'serverTimeMs',floor(extract(epoch from now())*1000)::bigint,'validUntilMs',case when until_at>now()then floor(extract(epoch from until_at)*1000)::bigint else null end);
end$$;

create function cachaste_web.progress(operation text,payload jsonb default '{}')returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=cachaste.require_user();k text:=payload->>'key';doc cachaste_web.learning_documents;size_bytes bigint;response jsonb;
begin
 if not cachaste.premium(u)then raise exception 'SUBSCRIPTION_REQUIRED'using errcode='42501';end if;
 if operation='snapshot'then
  select coalesce(jsonb_agg(to_jsonb(d)-'user_id'order by d.key),'[]'::jsonb)into response from cachaste_web.learning_documents d where d.user_id=u;
  return jsonb_build_object('documents',response);
 end if;
 if operation<>'put'then raise exception 'INVALID_OPERATION';end if;
 if k is null or k not in('cachaste-daily-v1','prepara-paes-demo-v1','prepara-paes-active-exam-v1','cachaste-m1-assessments-v1','cachaste-m1-diagnostic-30-v1','cachaste-m1-diagnostic-draft-v1','cachaste-m1-pending-review-v1','cachaste-science-v1','cachaste-reading-v1','cachaste-m2-v1','cachaste-history-v1')then raise exception 'INVALID_PROGRESS_KEY';end if;
 if octet_length(payload::text)>1050000 or jsonb_typeof(payload->'value')not in('object','array','null')then raise exception 'INVALID_PROGRESS_VALUE';end if;
 perform pg_advisory_xact_lock(hashtextextended('web-progress:'||u::text,0));
 perform cachaste.rate(u,'web_progress',240,3600);
 select * into doc from cachaste_web.learning_documents where user_id=u and key=k;
 if coalesce((payload->>'baseVersion')::bigint,-1)<>coalesce(doc.version,0)then return jsonb_build_object('conflict',true,'document',case when doc.version is null then null else to_jsonb(doc)-'user_id'end);end if;
 select coalesce(sum(octet_length(coalesce(value::text,''))),0)into size_bytes from cachaste_web.learning_documents where user_id=u and key<>k;
 if size_bytes+octet_length(coalesce((payload->'value')::text,''))>2097152 then raise exception 'PROGRESS_QUOTA';end if;
 insert into cachaste_web.learning_documents(user_id,key,value)values(u,k,payload->'value')on conflict(user_id,key)do update set value=excluded.value,version=cachaste_web.learning_documents.version+1,updated_at=now()returning * into doc;
 return jsonb_build_object('conflict',false,'document',to_jsonb(doc)-'user_id');
end$$;
revoke all on function cachaste_web.progress(text,jsonb)from public,anon,authenticated;
grant execute on function cachaste_web.progress(text,jsonb)to authenticated;
create function public.cachaste_web_progress(operation text,payload jsonb default '{}')returns jsonb language sql security invoker set search_path='' as $$select cachaste_web.progress(operation,payload)$$;
revoke all on function public.cachaste_web_progress(text,jsonb)from public,anon;
grant execute on function public.cachaste_web_progress(text,jsonb)to authenticated;

create function cachaste_web.account()returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=cachaste.require_user();data jsonb;begin
 select coalesce(jsonb_agg(jsonb_build_object('id',s.provider_id,'plan',s.plan,'status',s.provider_status,'paidUntil',s.paid_until,'trialUntil',s.trial_until,'renews',s.renews,'nextPaymentAt',s.next_payment_at)order by s.checked_at desc),'[]'::jsonb)into data from cachaste_web.subscriptions s where s.user_id=u;
 return jsonb_build_object('access',cachaste.access_state(),'subscriptions',data,'trialUsed',(exists(select 1 from cachaste_web.trials where user_id=u)or exists(select 1 from cachaste_web.checkouts where user_id=u and trial_offered)));
end$$;
revoke all on function cachaste_web.account()from public,anon,authenticated;
grant execute on function cachaste_web.account()to authenticated;
create function public.cachaste_web_account()returns jsonb language sql security invoker set search_path='' as $$select cachaste_web.account()$$;
revoke all on function public.cachaste_web_account()from public,anon;
grant execute on function public.cachaste_web_account()to authenticated;

-- Service-role-only payment transaction; never exposed to a logged-in student.
create function cachaste_web.billing_admin(operation text,payload jsonb default '{}')returns jsonb language plpgsql security definer set search_path='' as $$
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
 if operation='checkout'then
  if not exists(select 1 from cachaste_web.policy where payments_enabled and tax_ready)then raise exception 'BILLING_NOT_READY';end if;
  select * into checkout from cachaste_web.checkouts where cachaste_web.checkouts.id=(payload->>'id')::uuid;
  if found then
   if checkout.user_id<>u or checkout.plan<>payload->>'plan'then raise exception 'CHECKOUT_ALREADY_LINKED';end if;
   return to_jsonb(checkout)||jsonb_build_object('created',false);
  end if;
  if coalesce((payload->>'trial')::boolean,false)and(exists(select 1 from cachaste_web.trials where user_id=u)or exists(select 1 from cachaste_web.checkouts where user_id=u and trial_offered and cachaste_web.checkouts.id<>(payload->>'id')::uuid))then raise exception 'TRIAL_ALREADY_USED';end if;
  insert into cachaste_web.checkouts(id,user_id,plan,provider_plan_id,trial_offered)values((payload->>'id')::uuid,u,payload->>'plan',payload->>'providerPlanId',coalesce((payload->>'trial')::boolean,false))on conflict(id)do nothing;
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
revoke all on function cachaste_web.billing_admin(text,jsonb)from public,anon,authenticated;
grant execute on function cachaste_web.billing_admin(text,jsonb)to service_role;
create function public.cachaste_web_billing_admin(operation text,payload jsonb default '{}')returns jsonb language sql security invoker set search_path='' as $$select cachaste_web.billing_admin(operation,payload)$$;
revoke all on function public.cachaste_web_billing_admin(text,jsonb)from public,anon,authenticated;
grant execute on function public.cachaste_web_billing_admin(text,jsonb)to service_role;
commit;
