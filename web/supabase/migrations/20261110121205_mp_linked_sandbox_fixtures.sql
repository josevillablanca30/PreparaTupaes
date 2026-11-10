-- Service-only support for testing the official associated-plan API. Public hosted checkout remains unassociated.
begin;
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
 if operation='reserve' then
  select * into row from cachaste_web.sandbox_checkouts where id=(payload->>'id')::uuid;
  if found then
   if row.user_id<>u or row.plan<>payload->>'plan' or row.provider_plan_id<>payload->>'providerPlanId' or row.provider_plan_linked<>coalesce((payload->>'linkedPlan')::boolean,false) then raise exception 'CHECKOUT_ALREADY_LINKED';end if;
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
