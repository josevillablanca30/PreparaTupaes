begin;
-- A receipt is bound permanently to one Auth UUID. Only the server verifier can write it.
create table cachaste.play_receipts (
 receipt_hash text primary key check(receipt_hash ~ '^[a-f0-9]{64}$'),
 user_id uuid not null references auth.users(id) on delete cascade,
 token_ciphertext text not null, token_iv text not null,
 product_id text not null check(product_id='cachaste_premium'),
 base_plan text not null check(base_plan in ('semanal','mensual','anual')),
 store_state text not null, expires_at timestamptz not null,
 observed_at timestamptz not null, checked_at timestamptz not null default now(),
 test_purchase boolean not null default false,
 auto_renewing boolean not null, acknowledged boolean not null
);
create index play_receipts_user on cachaste.play_receipts(user_id,expires_at desc);
create index play_receipts_refresh on cachaste.play_receipts(checked_at);
alter table cachaste.play_receipts enable row level security;
revoke all on cachaste.play_receipts from public,anon,authenticated;
grant all on cachaste.play_receipts to service_role;
alter table cachaste.rate_events add column id bigint generated always as identity primary key;
grant usage,select on sequence cachaste.rate_events_id_seq to service_role;
grant execute on function cachaste.rate(uuid,text,int,int) to service_role;
grant execute on function cachaste.premium(uuid) to service_role;

-- A private privileged transaction checks Auth existence without giving service_role SELECT on auth.users.
create function cachaste.play_admin(operation text,payload jsonb default '{}') returns jsonb
language plpgsql security definer set search_path='' as $$
declare u uuid; r cachaste.play_receipts; best cachaste.play_receipts; h text; observed timestamptz;
begin
 if operation='lookup' then
  select * into r from cachaste.play_receipts where receipt_hash=payload->>'hash';
  return case when found then to_jsonb(r) else null end;
 end if;
 u:=(payload->>'userId')::uuid;
 if not exists(select 1 from auth.users where id=u and not coalesce(is_anonymous,false) and deleted_at is null)then raise exception 'AUTH_REQUIRED';end if;
 if operation='rate' then perform cachaste.rate(u,'play_verify',20,3600);return '{}'::jsonb;end if;
 if operation='receipts' then
  return coalesce((select jsonb_agg(to_jsonb(x)) from (select * from cachaste.play_receipts where user_id=u order by checked_at limit 10)x),'[]'::jsonb);
 end if;
 if operation<>'apply' then raise exception 'INVALID_OPERATION';end if;
 h:=payload->>'hash';observed:=(payload->>'observedAt')::timestamptz;
 if observed>clock_timestamp()+interval '5 seconds' or observed<clock_timestamp()-interval '10 minutes' then raise exception 'INVALID_OBSERVATION';end if;
 perform pg_advisory_xact_lock(hashtextextended('play:'||u::text,0));
 insert into cachaste.play_receipts(receipt_hash,user_id,token_ciphertext,token_iv,product_id,base_plan,store_state,expires_at,observed_at,test_purchase,auto_renewing,acknowledged)
 values(h,u,payload->>'ciphertext',payload->>'iv',payload->>'productId',payload->>'basePlan',payload->>'state',(payload->>'expiresAt')::timestamptz,observed,coalesce((payload->>'testPurchase')::boolean,false),(payload->>'autoRenewing')::boolean,(payload->>'acknowledged')::boolean)
 on conflict(receipt_hash)do update set store_state=excluded.store_state,expires_at=excluded.expires_at,observed_at=excluded.observed_at,checked_at=clock_timestamp(),auto_renewing=excluded.auto_renewing,acknowledged=excluded.acknowledged
 where cachaste.play_receipts.user_id=excluded.user_id and cachaste.play_receipts.observed_at<=excluded.observed_at;
 if not found and exists(select 1 from cachaste.play_receipts where receipt_hash=h and user_id<>u)then raise exception 'RECEIPT_ALREADY_LINKED';end if;
 select * into best from cachaste.play_receipts where user_id=u and expires_at>now()
  and checked_at>now()-interval '12 hours' and acknowledged
  and store_state in ('SUBSCRIPTION_STATE_ACTIVE','SUBSCRIPTION_STATE_IN_GRACE_PERIOD','SUBSCRIPTION_STATE_CANCELED')
 order by expires_at desc limit 1;
 if found then
  insert into cachaste.entitlements(user_id,valid_until,source,status,receipt_hash,verified_at)
  values(u,least(best.expires_at,best.checked_at+interval '12 hours'),'google_play_verified','active',best.receipt_hash,best.checked_at)
  on conflict(user_id)do update set valid_until=excluded.valid_until,source=excluded.source,status=excluded.status,receipt_hash=excluded.receipt_hash,verified_at=excluded.verified_at;
 else update cachaste.entitlements set status='revoked',valid_until=now(),verified_at=now() where user_id=u and source='google_play_verified';end if;
 return jsonb_build_object('premium',cachaste.premium(u),'expiresAt',best.expires_at,'renews',best.auto_renewing);
end$$;
revoke all on function cachaste.play_admin(text,jsonb) from public,anon,authenticated;
grant execute on function cachaste.play_admin(text,jsonb) to service_role;
create function public.cachaste_play_admin(operation text,payload jsonb default '{}') returns jsonb
language sql security invoker set search_path='' as $$select cachaste.play_admin(operation,payload)$$;
revoke all on function public.cachaste_play_admin(text,jsonb) from public,anon,authenticated;
grant execute on function public.cachaste_play_admin(text,jsonb) to service_role;
commit;
