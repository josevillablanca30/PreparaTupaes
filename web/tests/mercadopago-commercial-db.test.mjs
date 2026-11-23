import assert from 'node:assert/strict';
import test from 'node:test';
import {createHmac,randomUUID} from 'node:crypto';
import {createMercadoPagoHandlers} from '../../supabase/functions/_shared/mercadopago-handler.mjs';
import {billing,database,sessions,users} from './database.mjs';

test('commercial readiness keeps public sales closed while a single controlled checkout is issued',async t=>{
 const db=await database();
 t.after(()=>db.close());
 const sellerId='3113741347',appId='48384472675774',planId='f895a7dc01bc4c72a0591730d2bd3216';
 const email='buyer@example.invalid',reference=randomUUID(),ticket=randomUUID(),providerId='pending-locally';
 const checkoutUrl='https://www.mercadopago.cl/subscriptions/checkout?preapproval_id='+providerId;
 const recurrence={currency_id:'CLP',transaction_amount:2490,frequency:7,frequency_type:'days'};
 const vars={
  CACHASTE_MP_MODE:'production',MP_COLLECTOR_ID:sellerId,MP_ACCESS_TOKEN:'APP_USR-'+appId+'-fixture',
  MP_WEBHOOK_SECRET:'local-fixture-signing-key'
 };
 await db.query('update auth.users set email=$1 where id=$2',[email,users[0]]);
 await db.query("insert into cachaste_web.checkouts(id,user_id,plan,provider_plan_id,provider_plan_linked) values($1,$2,'semanal',$3,false)",[reference,users[0],planId]);
 const issueTicket=()=>db.query("insert into cachaste_web.mp_controlled_checkout_tickets values(sha256(convert_to($1,'UTF8')),$2,now()+interval '3 minutes')",[ticket,reference]);
 const providerRequests=[];
 const handlers=createMercadoPagoHandlers({env:key=>vars[key],createClient:()=>({
  rpc:async(name,{operation,payload,ticket})=>{
   if(name==='cachaste_web_billing_admin')return {data:await billing(db,operation,payload)};
   assert.equal(name,'cachaste_mp_controlled_checkout_claim');
   await db.exec('set role service_role');
   try{
    return {data:(await db.query('select public.cachaste_mp_controlled_checkout_claim($1) claim',[ticket])).rows[0].claim};
   }finally{await db.exec('reset role');}
  }
 }),fetcher:async(value,options)=>{
  const {pathname}=new URL(value);
  providerRequests.push(pathname);
  if(pathname==='/users/me')return Response.json({id:sellerId,site_id:'MLC',tags:[]});
  if(pathname==='/preapproval_plan/'+planId)return Response.json({
   id:planId,collector_id:sellerId,application_id:'3489525217856496',status:'active',auto_recurring:recurrence
  });
  assert.equal(pathname,'/preapproval');
  assert.equal(options.method,'POST');
  assert.equal(options.headers['X-Idempotency-Key'],reference);
  assert.deepEqual(JSON.parse(options.body),{
   auto_recurring:recurrence,external_reference:reference,payer_email:email,reason:'¿Cachaste? · semanal',
   back_url:'https://sitecacho.cl/cuenta.html?checkout=return',status:'pending'
  });
  return Response.json({id:providerId,external_reference:reference,collector_id:sellerId,application_id:appId,
   status:'pending',init_point:checkoutUrl});
 }});
 const invoke=(action,ticket)=>handlers.billing(new Request('https://local.invalid/billing',{
  method:'POST',body:JSON.stringify({action,ticket,plan:'anual',payer_email:'ignored@example.invalid'})
 }));
 await issueTicket();
 assert.equal((await invoke('checkout_controlled',ticket)).status,401);
 assert.deepEqual(providerRequests,[]);
 await db.query('update auth.users set email_confirmed_at=now() where id=$1',[users[0]]);
 await issueTicket();
 assert.equal((await invoke('checkout_controlled',randomUUID())).status,401);
 const response=await invoke('checkout_controlled',ticket);
 assert.equal(response.status,200);
 assert.deepEqual(await response.json(),{checkoutUrl,id:providerId});
 assert.equal((await invoke('checkout_controlled',ticket)).status,401);
 assert.equal(providerRequests.filter(path=>path==='/preapproval').length,1);
 assert.equal((await(await invoke('status')).json()).ready,false);
 assert.deepEqual((await db.query('select provider_id from cachaste_web.checkouts')).rows,[{provider_id:providerId}]);
 assert.deepEqual((await db.query('select count(*)::int total from cachaste_web.payments')).rows,[{total:0}]);
 assert.deepEqual((await db.query('select cachaste.premium($1) active',[users[0]])).rows,[{active:false}]);
});

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
