import assert from 'node:assert/strict';
import test from 'node:test';
import {createHmac,randomUUID} from 'node:crypto';
import {createMercadoPagoHandlers} from '../../supabase/functions/_shared/mercadopago-handler.mjs';
import {billing,database,sessions,users} from './database.mjs';

test('commercial payment and scheduled renewal update only the owner’s web and Android access',async t=>{
 const db=await database();
 t.after(()=>db.close());
 const reference=randomUUID(),providerId='commercial-fixture',sellerId='123',buyerId='987';
 const recurring={currency_id:'CLP',transaction_amount:64990,frequency:1,frequency_type:'years'};
 const subscription={
  id:providerId,collector_id:sellerId,payer_id:buyerId,external_reference:reference,
  status:'authorized',auto_recurring:recurring,site_id:'MLC',live_mode:true
 };
 const invoice={id:22,status:'processed',payment:{id:11},preapproval_id:providerId};
 const payment={
  id:11,collector_id:sellerId,payer:{id:buyerId},currency_id:'CLP',
  transaction_amount:64990,date_approved:new Date(Date.now()-1000).toISOString(),live_mode:true,status:'pending'
 };
 const secret='local-fixture-signing-key',vars={
  CACHASTE_MP_MODE:'production',MP_COLLECTOR_ID:sellerId,MP_ACCESS_TOKEN:'APP_USR-local-fixture',
  MP_WEBHOOK_SECRET:secret
 };
 const handlers=createMercadoPagoHandlers({env:key=>vars[key],createClient:()=>({
  rpc:async(name,{operation,payload,ticket})=>{
   if(name==='cachaste_web_billing_admin')return {data:await billing(db,operation,payload)};
   assert.equal(name,'cachaste_mp_reconciliation_claim');
   await db.exec('set role service_role');
   try{
    return {data:(await db.query('select public.cachaste_mp_reconciliation_claim($1) ids',[ticket])).rows[0].ids};
   }finally{await db.exec('reset role');}
  }
 }),fetcher:async value=>{
  const url=new URL(value);
  const fixture={
   '/users/me':{id:sellerId,site_id:'MLC',tags:[]},
   ['/preapproval/'+providerId]:subscription,
   '/v1/payments/11':payment,
   '/authorized_payments/search':{results:[invoice]}
  }[url.pathname];
  assert.ok(fixture,url.pathname);
  return Response.json(fixture);
 }});
 const notify=requestId=>{
  const ts=Date.now(),manifest=`id:11;request-id:${requestId};ts:${ts};`;
  const hash=createHmac('sha256',secret).update(manifest).digest('hex');
  return new Request('https://local.invalid/events?data.id=11&type=payment',{
   method:'POST',headers:{'x-request-id':requestId,'x-signature':`ts=${ts},v1=${hash}`},
   body:JSON.stringify({type:'payment',data:{id:'11'}})
  });
 };
 async function verifyAccess(index,active){
  const claims=JSON.stringify({sub:users[index],session_id:sessions[index],role:'authenticated'});
  await db.query("select set_config('request.jwt.claims',$1,false)",[claims]);
  await db.exec('set role authenticated');
  try{
   const {web,android}=(await db.query('select public.cachaste_web_account() web,public.cachaste_access() android')).rows[0];
   assert.equal(web.access.active,active);
   assert.equal(android.active,active);
   assert.equal(android.userId,users[index]);
  }finally{await db.exec('reset role');}
 }

 await db.exec('update cachaste_web.policy set payments_enabled=true,tax_ready=true');
 await billing(db,'checkout',{id:reference,userId:users[0],plan:'anual',providerPlanId:'existing-yearly-plan',linkedPlan:false});
 await db.exec('update cachaste_web.policy set payments_enabled=false,tax_ready=false');
 assert.equal((await handlers.webhook(notify('fixture-pending'))).status,200);
 await verifyAccess(0,false);
 payment.status='approved';
 const confirm=notify('fixture-confirmed');
 assert.equal((await handlers.webhook(confirm.clone())).status,200);
 assert.equal((await handlers.webhook(confirm)).status,200);
 await verifyAccess(0,true);
 await verifyAccess(1,false);

 await db.exec("update cachaste_web.subscriptions set checked_at=now()-interval '13 hours'");
 await verifyAccess(0,false);
 assert.deepEqual((await db.query('select provider_id from cachaste_web.mp_reconciliation_due()')).rows,[{provider_id:providerId}]);
 const ticket=randomUUID();
 await db.query("insert into cachaste_web.mp_reconciliation_tickets values(sha256(convert_to($1,'UTF8')),now()+interval '3 minutes')",[ticket]);
 const scheduled=()=>new Request('https://local.invalid/billing',{
  method:'POST',body:JSON.stringify({action:'reconcile_scheduled',ticket})
 });
 assert.equal((await handlers.billing(scheduled())).status,200);
 assert.equal((await handlers.billing(scheduled())).status,401);
 await verifyAccess(0,true);
 await verifyAccess(1,false);
 assert.deepEqual((await db.query('select count(*)::int total from cachaste_web.payments')).rows,[{total:1}]);
 assert.deepEqual((await db.query('select provider_id from cachaste_web.mp_reconciliation_due()')).rows,[]);
});
