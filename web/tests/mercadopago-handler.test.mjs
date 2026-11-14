import test from'node:test';import assert from'node:assert/strict';import{createMercadoPagoHandlers}from'../../supabase/functions/_shared/mercadopago-handler.mjs';
const uid='10000000-0000-4000-8000-000000000001',rid='30000000-0000-4000-8000-000000000001',now=Date.UTC(2026,9,24,13);
function harness(){
 const vars={SUPABASE_URL:'https://qa.example',SUPABASE_ANON_KEY:'qa-publishable',SUPABASE_SERVICE_ROLE_KEY:'qa-service',CACHASTE_MP_ENABLED:'true',CACHASTE_MP_TAX_READY:'true',CACHASTE_MP_MODE:'test',CACHASTE_MP_ALLOW_TEST_PURCHASES:'true',MP_ACCESS_TOKEN:'TEST-isolated-no-real-provider',MP_COLLECTOR_ID:'123',MP_TEST_COLLECTOR_ID:'123',MP_TEST_ACCESS_TOKEN:'TEST-isolated-no-real-provider',MP_WEBHOOK_SECRET:'qa-signing-only',CACHASTE_WEB_ORIGIN:'https://web.example',MP_PLAN_WEEKLY:'weekly',MP_PLAN_MONTHLY:'monthly',MP_PLAN_YEARLY:'yearly'},calls=[],checkouts=new Map(),subscriptions=[],seen=new Set(),applied=[];
 let rejectNext=0,fail=false,revoked=false,cancelled=false,policyEnabled=true;
 const createClient=(_url,key)=>key==='qa-service'?{rpc:async(_name,{operation:op,payload:p})=>{calls.push({op,p});if(op==='policy')return{data:{enabled:policyEnabled}};if(op==='rate')return{data:{}};if(op==='checkout'){if(!checkouts.has(p.id))checkouts.set(p.id,{id:p.id,user_id:p.userId,plan:p.plan,provider_plan_id:p.providerPlanId,created_at:new Date(now).toISOString(),trial_offered:p.trial,provider_plan_linked:p.linkedPlan,created:true});else {const row=checkouts.get(p.id);row.created=!!row.retryable;row.retryable=false;}return{data:{...checkouts.get(p.id)}};}if(op==='checkout_failed'){checkouts.get(p.id).retryable=true;return {data:{retryable:true}};}if(op==='attach'){checkouts.get(p.id).provider_id=p.providerId;return{data:{...checkouts.get(p.id)}};}if(op==='lookup')return{data:[...checkouts.values()].find(c=>c.provider_id===p.providerId||c.id===p.reference)||null};if(op==='subscriptions')return{data:subscriptions.length?subscriptions:[...checkouts.values()].filter(c=>c.provider_id).map(c=>({provider_id:c.provider_id}))};if(op==='webhook_seen')return{data:{seen:seen.has(p.hash)}};if(op==='webhook'){seen.add(p.hash);return{data:{fresh:true}};}if(op==='apply'){applied.push(p);return{data:{applied:true}};}if(op==='sales')return{data:{rows:[{provider_id:'1',amount_clp:7990,fee_clp:199,net_clp:7791,live_mode:false}]}};return{data:{}};}}:{auth:{getUser:async token=>token==='qa-token'?{data:{user:{id:uid,email:'student@example.invalid'}}}:{error:{message:'invalid'}}},rpc:async()=>revoked?{error:{message:'revoked'}}:{data:{trialUsed:[...checkouts.values()].some(c=>c.trial_offered),isAdmin:vars.QA_IS_ADMIN==='true'}}};
 const fetcher=async(url,o={})=>{calls.push({url,method:o.method||'GET',body:o.body?JSON.parse(o.body):undefined,headers:o.headers});if(rejectNext&&url.endsWith('/preapproval')&&o.method==='POST'){const status=rejectNext;rejectNext=0;return Response.json({error:'test_rejection'},{status});}if(fail)return Response.json({error:'unavailable'},{status:503});if(url.includes('/preapproval_plan/'))return Response.json({id:url.split('/').at(-1),status:'active',collector_id:123,auto_recurring:{currency_id:'CLP',transaction_amount:7990,frequency:1,frequency_type:'months',...(vars.QA_VALID_TRIAL==='true'&&url.endsWith('/monthly-trial')?{free_trial:{frequency:7,frequency_type:'days'}}:{})}});if(url.endsWith('/preapproval')&&o.method==='POST')return Response.json({id:'qa-sub',init_point:'https://www.mercadopago.cl/subscriptions/checkout?preapproval_id=qa-sub'});if(url.includes('/preapproval/')){if(o.method==='PUT')cancelled=true;return Response.json({id:'qa-sub',external_reference:rid,collector_id:123,site_id:'MLC',auto_recurring:{currency_id:'CLP',transaction_amount:7990,frequency:1,frequency_type:'months'},date_created:new Date(now).toISOString(),status:cancelled?'cancelled':'authorized',init_point:'https://www.mercadopago.cl/subscriptions/checkout?preapproval_id=qa-sub'});}if(url.includes('/authorized_payments/search'))return Response.json({results:[{preapproval_id:'qa-sub',status:'processed',payment:{id:1}}]});if(url.endsWith('/v1/payments/1'))return Response.json({id:1,collector_id:123,currency_id:'CLP',transaction_amount:7990,live_mode:false,status:'approved',date_approved:new Date(now).toISOString(),fee_details:[{amount:199}],transaction_amount_refunded:0});return Response.json({}, {status:404});};
 const handlers=createMercadoPagoHandlers({env:k=>vars[k],createClient,fetcher:async(url,options)=>{
  if(vars.QA_PAYMENT_FIXTURE){
   const response=vars.QA_PAYMENT_FIXTURE(url);
   if(response!==undefined){calls.push({url,method:options?.method||'GET'});return Response.json(response);}
  }
  return fetcher(url,options);
 },now:()=>now});
 const req=body=>new Request('https://qa.example/billing',{method:'POST',headers:{origin:'https://web.example',authorization:'Bearer qa-token'},body:JSON.stringify(body)});
 return{...handlers,req,vars,calls,checkouts,applied,seen,setReject:v=>rejectNext=v,setFail:v=>fail=v,revoke:()=>revoked=true,setPolicy:v=>policyEnabled=v};
}
async function signature(secret='qa-signing-only',bodyId='qa-sub',eventId='qa-sub',type='subscription_preapproval',{queryType,applicationId}={}){
 const ts=Math.floor(now/1000),manifest=`id:${eventId};request-id:qa-request;ts:${ts};`,key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']),sig=Buffer.from(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(manifest))).toString('hex');
 const url=new URL('https://qa.example/events');
 url.searchParams.set('data.id',eventId);
 if(queryType)url.searchParams.set('type',queryType);
 return new Request(url,{method:'POST',headers:{'x-request-id':'qa-request','x-signature':`ts=${ts},v1=${sig}`},body:JSON.stringify({type,application_id:applicationId,data:{id:bodyId}})});
}
test('checkout uses server price and plan, binds identity and reuses a request without a second subscription',async()=>{const h=harness(),body={action:'checkout',plan:'mensual',requestId:rid,amount:1,premium:true,userId:'other'};assert.equal((await h.billing(h.req(body))).status,200);assert.equal((await h.billing(h.req(body))).status,200);const posts=h.calls.filter(c=>c.method==='POST'&&c.url.endsWith('/preapproval'));assert.equal(posts.length,1);assert.equal(posts[0].body.payer_email,'student@example.invalid');assert.equal(posts[0].body.preapproval_plan_id,undefined);assert.equal(posts[0].body.auto_recurring.transaction_amount,7990);assert.equal(posts[0].body.auto_recurring.currency_id,'CLP');assert.equal(posts[0].body.transaction_amount,undefined);assert.equal(h.checkouts.get(rid).user_id,uid);assert.equal(h.applied.length,0);});
test('refresh reconciles the actual payment and cancellation keeps the existing paid period',async()=>{const h=harness();await h.billing(h.req({action:'checkout',plan:'mensual',requestId:rid}));assert.equal((await h.billing(h.req({action:'refresh'}))).status,200);assert.ok(h.applied[0].paidUntil);assert.equal(h.applied[0].liveMode,false);assert.equal((await h.billing(h.req({action:'cancel',subscriptionId:'qa-sub'}))).status,200);assert.equal(h.applied.at(-1).renews,false);assert.equal(h.applied.at(-1).paidUntil,h.applied[0].paidUntil);assert.equal((await h.billing(h.req({action:'cancel',subscriptionId:'someone-elses-sub'}))).status,400);});
test('revoked sessions, foreign origins, unapproved test mode and non-admin reports are denied',async()=>{const h=harness();assert.equal((await h.billing(h.req({action:'sales',from:new Date(now).toISOString(),to:new Date(now+10000).toISOString()}))).status,403);const foreign=new Request('https://qa.example/billing',{method:'POST',headers:{origin:'https://evil.example'},body:'{"action":"status"}'});assert.equal((await h.billing(foreign)).status,403);h.revoke();assert.equal((await h.billing(h.req({action:'checkout',plan:'mensual',requestId:rid}))).status,401);const other=harness();other.vars.CACHASTE_MP_ALLOW_TEST_PURCHASES='false';assert.equal((await other.billing(other.req({action:'refresh'}))).status,400);});
test('signed webhook deduplicates only after successful canonical payment processing; failures remain retryable',async()=>{const h=harness();await h.billing(h.req({action:'checkout',plan:'mensual',requestId:rid}));h.setFail(true);assert.equal((await h.webhook(await signature())).status,503);assert.equal(h.seen.size,0);h.setFail(false);assert.equal((await h.webhook(await signature())).status,200);assert.equal(h.applied.length,1);assert.equal(h.seen.size,1);assert.equal((await h.webhook(await signature())).status,200);assert.equal(h.applied.length,1);});
test('forged notification and body/query mismatch fail before contacting Mercado Pago',async()=>{const h=harness();assert.equal((await h.webhook(await signature('wrong'))).status,401);assert.equal((await h.webhook(await signature('qa-signing-only','other'))).status,401);assert.equal(h.calls.filter(c=>c.url).length,0);assert.equal(h.applied.length,0);});
test('commercial readiness separates the panel application from the catalogue and validates the existing webhook key',async()=>{
 const h=harness(),sellerId='3113741347',panelApp='48384472675774',catalogueApp='3489525217856496';
 Object.assign(h.vars,{
  CACHASTE_MP_MODE:'production',MP_COLLECTOR_ID:sellerId,MP_TEST_COLLECTOR_ID:'456',
  MP_ACCESS_TOKEN:'APP_USR-'+panelApp+'-local-fixture',MP_TEST_WEBHOOK_SECRET:'qa-signing-only'
 });
 const offers={
  weekly:{transaction_amount:2490,frequency:7,frequency_type:'days'},
  monthly:{transaction_amount:7990,frequency:1,frequency_type:'months'},
  yearly:{transaction_amount:64990,frequency:1,frequency_type:'years'}
 };
 h.vars.QA_PAYMENT_FIXTURE=url=>{
  if(url.endsWith('/users/me'))return {id:sellerId,site_id:'MLC',tags:[]};
  const id=url.split('/').at(-1);
  return {id,status:'active',collector_id:sellerId,application_id:catalogueApp,
   auto_recurring:{currency_id:'CLP',...offers[id]}};
 };
 h.setPolicy(false);
 const readiness=await h.commercialReadiness();
 assert.equal(readiness.checkoutApplicationId,panelApp);
 assert.equal(readiness.productionTokenApplicationId,panelApp);
 assert.equal(readiness.webhookUsesSameKeyAsSandbox,true);
 assert.equal(readiness.webhookSecretConfigured,true);
 assert.equal(readiness.ready,false);
 assert.ok(readiness.plans.every(offer=>offer.applicationId===catalogueApp));
 const callback=secret=>signature(secret,'qa-plan','qa-plan','subscription_preapproval_plan');
 assert.equal((await h.webhook(await callback('wrong'))).status,401);
 assert.equal((await h.webhook(await callback('qa-signing-only'))).status,200);
 const planId='f895a7dc01bc4c72a0591730d2bd3216';
 const simulator=({secret='qa-signing-only',id=planId,applicationId=panelApp,bodyId=id}={})=>
  signature(secret,bodyId,id,'subscription_preapproval',{queryType:'subscription_authorized_payment',applicationId});
 const beforeSimulation=h.calls.length;
 assert.equal((await h.webhook(await simulator())).status,200);
 assert.equal((await h.webhook(await simulator({secret:'wrong'}))).status,401);
 assert.equal((await h.webhook(await simulator({applicationId:catalogueApp}))).status,401);
 assert.equal((await h.webhook(await simulator({id:'other-resource'}))).status,401);
 assert.equal((await h.webhook(await simulator({bodyId:'other-resource'}))).status,401);
 assert.ok(h.calls.slice(beforeSimulation).every(call=>call.op==='webhook_seen'));
 assert.equal(h.applied.length,0);
 assert.equal(h.checkouts.size,0);
 h.vars.MP_ACCESS_TOKEN='APP_USR-'+catalogueApp+'-local-fixture';
 assert.equal((await h.webhook(await callback('qa-signing-only'))).status,503);
 h.vars.MP_WEBHOOK_SECRET='other-key';
 h.setPolicy(true);
 const mismatch=await h.commercialReadiness();
 assert.equal(mismatch.productionTokenApplicationId,catalogueApp);
 assert.equal(mismatch.ready,false);
});
test('a payment webhook uses the exact invoice and the subscription reference before attaching an existing reservation',async()=>{
 const h=harness();
 const reservation={id:rid,user_id:uid,plan:'mensual',provider_plan_linked:false,trial_offered:false,created_at:new Date(now).toISOString()};
 h.checkouts.set(rid,reservation);
 h.vars.CACHASTE_MP_MODE='production';h.vars.MP_ACCESS_TOKEN='APP_USR-fixture-never-real';
 h.vars.MP_TEST_COLLECTOR_ID='456';
 const payment={id:1,collector_id:123,payer:{id:987},currency_id:'CLP',transaction_amount:7990,live_mode:true,status:'approved',date_approved:new Date(now).toISOString()};
 const invoice={id:2,preapproval_id:'qa-sub',status:'processed',payment:{id:1}};
 let current=payment, invoices=[], history=[];
 h.vars.QA_PAYMENT_FIXTURE=url=>{
  if(url.endsWith('/users/me'))return {id:123,site_id:'MLC',tags:[]};
  if(url.endsWith('/preapproval/qa-sub'))return {id:'qa-sub',external_reference:rid,collector_id:123,payer_id:987,site_id:'MLC',
   auto_recurring:{currency_id:'CLP',transaction_amount:7990,frequency:1,frequency_type:'months'},date_created:new Date(now).toISOString(),status:'authorized'};
  if(url.endsWith('/v1/payments/1'))return current;
  if(url.endsWith('/authorized_payments/search?payment_id=1'))return {results:invoices};
  if(url.endsWith('/authorized_payments/search?preapproval_id=qa-sub'))return {results:history};
 };
 const event=()=>signature('qa-signing-only','1','1','payment');
 current={...payment,live_mode:false};assert.equal((await h.webhook(await event())).status,200);
 current={...payment,collector_id:999};assert.equal((await h.webhook(await event())).status,200);
 current=payment;invoices=[invoice,{...invoice,id:3}];assert.equal((await h.webhook(await event())).status,503);
 invoices=[invoice];assert.equal((await h.webhook(await event())).status,503);
 history=[invoice];current={...payment,transaction_amount:1};assert.equal((await h.webhook(await event())).status,503);
 current={...payment,payer:{id:654}};assert.equal((await h.webhook(await event())).status,503);
 assert.equal(reservation.provider_id,undefined);assert.equal(h.applied.length,0);assert.equal(h.seen.size,0);
 current=payment;assert.equal((await h.webhook(await event())).status,200);
 assert.equal(reservation.provider_id,'qa-sub');assert.ok(h.applied[0].paidUntil);
 assert.equal((await h.webhook(await event())).status,200);
 assert.equal(h.applied.length,1);
});

test('the landing never promises a trial until the actual provider plan validates seven free days',async()=>{
 const h=harness();
 h.vars.CACHASTE_MP_TRIAL_ENABLED='true';
 h.vars.MP_PLAN_MONTHLY_TRIAL='monthly-trial';
 const status=()=>h.billing(h.req({action:'status'}));
 const ready={ready:true,managementReady:true,mode:'test'};
 assert.deepEqual(await(await status()).json(),{...ready,trialAvailable:false});
 assert.ok(h.calls.some(c=>c.url?.includes('/preapproval_plan/monthly-trial')));
 h.vars.QA_VALID_TRIAL='true';
 assert.deepEqual(await(await status()).json(),{...ready,trialAvailable:true});
});

test('pausing new sales never prevents a customer cancellation, reconciliation or an accounting export',async()=>{const h=harness();await h.billing(h.req({action:'checkout',plan:'mensual',requestId:rid}));h.vars.CACHASTE_MP_ENABLED='false';h.vars.CACHASTE_MP_TAX_READY='false';assert.equal((await h.billing(h.req({action:'checkout',plan:'mensual',requestId:rid}))).status,503);assert.equal((await h.billing(h.req({action:'cancel',subscriptionId:'qa-sub'}))).status,200);assert.equal(h.applied.at(-1).renews,false);assert.equal((await h.webhook(await signature())).status,200);h.vars.QA_IS_ADMIN='true';h.vars.MP_ACCESS_TOKEN=undefined;const report=await h.billing(h.req({action:'sales',fromDate:'2026-07-15',toDate:'2026-07-15'}));assert.equal(report.status,200);assert.ok((await report.text()).includes('fee_clp'));const range=h.calls.filter(c=>c.op==='sales').at(-1).p;assert.equal(range.from,'2026-07-15T04:00:00.000Z');assert.equal(range.to,'2026-07-16T04:00:00.000Z');});
test('production checkout accepts the sitecacho.cl origin and rejects a stale preview origin',async()=>{
 const h=harness();
 Object.assign(h.vars,{CACHASTE_MP_MODE:'production',MP_ACCESS_TOKEN:'APP_USR-fixture-never-real',
  CACHASTE_WEB_ORIGIN:'https://preview.example',CACHASTE_MP_ENABLED:'false'});
 const status=origin=>h.billing(new Request('https://qa.example/billing',{method:'POST',headers:{origin},body:'{"action":"status"}'}));
 assert.equal((await status('https://preview.example')).status,403);
 assert.equal((await status('https://sitecacho.cl')).status,200);
});

test('a closed database launch policy blocks checkout even when Mercado Pago credentials are configured',async()=>{
 const h=harness();h.setPolicy(false);
 const response=await h.billing(h.req({action:'checkout',plan:'mensual',requestId:rid}));
 assert.equal(response.status,503);
 assert.equal((await response.json()).error,'BILLING_NOT_READY');
 assert.equal(h.calls.filter(c=>c.url?.includes('mercadopago.com')).length,0);
 assert.equal(h.checkouts.size,0);
 assert.equal(h.applied.length,0);
});

test('commercial readiness verifies the existing Chilean seller and plans without creating a checkout',async()=>{
 const h=harness();
 Object.assign(h.vars,{
  CACHASTE_MP_MODE:'production',MP_ACCESS_TOKEN:'APP_USR-fixture-never-real',MP_TEST_COLLECTOR_ID:'456',
  CACHASTE_WEB_ORIGIN:'https://sitecacho.cl',CACHASTE_MP_ENABLED:'false',CACHASTE_MP_TAX_READY:'false'
 });
 h.setPolicy(false);
 const request=()=>new Request('https://sitecacho.cl/api/billing',{method:'POST',headers:{
  origin:'https://sitecacho.cl',authorization:'Bearer qa-token'
 },body:JSON.stringify({action:'commercial_readiness'})});
 assert.equal((await h.billing(request())).status,403);
 assert.equal(h.calls.length,0);
 h.vars.QA_IS_ADMIN='true';
 const plans={
  weekly:{transaction_amount:2490,frequency:7,frequency_type:'days'},
  monthly:{transaction_amount:7990,frequency:1,frequency_type:'months'},
  yearly:{transaction_amount:64990,frequency:12,frequency_type:'months'}
 };
 let tags=[];
 h.vars.QA_PAYMENT_FIXTURE=url=>{
  if(url.endsWith('/users/me'))return {id:123,site_id:'MLC',tags};
  const id=url.split('/').at(-1);
  return {id,status:'active',collector_id:123,site_id:'MLC',auto_recurring:{currency_id:'CLP',...plans[id]}};
 };
 const result=await h.billing(request());
 assert.equal(result.status,200);
 const state=await result.json();
 assert.deepEqual(state.seller,{id:'123',site:'MLC'});
 assert.deepEqual(state.plans.map(p=>p.id),Object.keys(plans));
 assert.equal(state.webhookSecretConfigured,true);
 assert.equal(state.ready,false);
 assert.equal(h.checkouts.size,0);
 assert.ok(h.calls.filter(c=>c.url).every(c=>c.method==='GET'));
 tags=['test_user'];
 const wrongSeller=await h.billing(request());
 assert.equal((await wrongSeller.json()).error,'COMMERCIAL_SELLER_MISMATCH');
 tags=[];
 h.vars.MP_TEST_PLAN_WEEKLY='weekly';
 const wrongPlan=await h.billing(request());
 assert.equal((await wrongPlan.json()).error,'COMMERCIAL_PLAN_IDS_MISMATCH');
});

test('commercial readiness resolves existing plans by exact seller and recurrence and rejects ambiguity',async()=>{
 const h=harness();
 Object.assign(h.vars,{
  CACHASTE_MP_MODE:'production',MP_ACCESS_TOKEN:'APP_USR-fixture-never-real',
  MP_TEST_COLLECTOR_ID:'456',MP_COLLECTOR_ID:'123',CACHASTE_WEB_ORIGIN:'https://preview.example',
  MP_PLAN_WEEKLY:undefined,MP_PLAN_MONTHLY:undefined,MP_PLAN_YEARLY:undefined,
  MP_TEST_PLAN_WEEKLY:'test-weekly',CACHASTE_MP_ENABLED:'false'
 });
 h.setPolicy(false);
 const weekly={id:'weekly-verified',status:'active',collector_id:123,auto_recurring:{currency_id:'CLP',transaction_amount:2490,frequency:7,frequency_type:'days'}};
 const monthly={...weekly,id:'monthly-verified',auto_recurring:{currency_id:'CLP',transaction_amount:7990,frequency:1,frequency_type:'months',free_trial:{frequency:7,frequency_type:'days'}}};
 const yearly={...weekly,id:'yearly-verified',auto_recurring:{currency_id:'CLP',transaction_amount:64990,frequency:1,frequency_type:'years'}};
 const plans=[{...weekly,id:'test-weekly'},{...weekly,id:'foreign-weekly',collector_id:999},weekly,monthly,yearly];
 let ambiguous=false;
 h.vars.QA_PAYMENT_FIXTURE=url=>{
  if(url.endsWith('/users/me'))return {id:123,site_id:'MLC',tags:[]};
  if(url.includes('/preapproval_plan/search')){
   const offset=Number(new URL(url).searchParams.get('offset')||0);
   const results=ambiguous?[...plans,{...weekly,id:'other-weekly'}]:plans;
   return {paging:{offset,total:results.length},results:results.slice(offset,offset+2)};
  }
  return plans.find(plan=>url.endsWith('/'+plan.id));
 };
 const state=await h.commercialReadiness();
 assert.deepEqual(state.seller,{id:'123',site:'MLC'});
 assert.equal(state.webOrigin,'https://sitecacho.cl');
 assert.deepEqual(state.plans.map(plan=>plan.id),['weekly-verified','monthly-verified','yearly-verified']);
 assert.deepEqual(state.plans.map(plan=>plan.trialDays),[0,7,0]);
 assert.equal(state.ready,false);
 assert.ok(h.calls.filter(call=>call.url).every(call=>call.method==='GET'));
 assert.equal(h.checkouts.size,0);
 ambiguous=true;
 await assert.rejects(h.commercialReadiness(),/COMMERCIAL_PLAN_WEEKLY_AMBIGUOUS/);
 ambiguous=false;
 const checkout=requestId=>new Request('https://sitecacho.cl/api/billing',{method:'POST',headers:{
  origin:'https://sitecacho.cl',authorization:'Bearer qa-token'
 },body:JSON.stringify({action:'checkout',plan:'mensual',requestId})});
 assert.equal((await h.billing(checkout(rid))).status,503);
 h.setPolicy(true);
 assert.equal((await h.billing(checkout(rid))).status,200);
 const nextId='30000000-0000-4000-8000-000000000002';
 assert.equal((await h.billing(checkout(nextId))).status,200);
 const pending=h.calls.filter(call=>call.method==='POST'&&call.url?.endsWith('/preapproval'));
 assert.equal(pending.length,2);
 assert.equal(pending[0].body.auto_recurring.start_date,new Date(now+7*86400000).toISOString());
 assert.equal(pending[1].body.auto_recurring.start_date,undefined);
 for(const call of pending){
  assert.equal(call.body.status,'pending');
  assert.equal(call.body.back_url,'https://sitecacho.cl/cuenta.html?checkout=return');
  assert.equal(call.body.auto_recurring.transaction_amount,7990);
 }
 assert.equal(h.checkouts.get(nextId).trial_offered,false);
});


test('a definitive checkout rejection can retry its original seven day trial without silently switching to immediate billing',async()=>{
 const h=harness();h.vars.CACHASTE_MP_TRIAL_ENABLED='true';h.vars.MP_PLAN_MONTHLY_TRIAL='monthly-trial';h.vars.QA_VALID_TRIAL='true';h.setReject(400);
 const body={action:'checkout',plan:'mensual',requestId:rid};
 assert.equal((await h.billing(h.req(body))).status,503);
 assert.equal(h.checkouts.get(rid).retryable,true);
 assert.equal((await h.billing(h.req(body))).status,200);
 const posts=h.calls.filter(c=>c.url?.endsWith('/preapproval')&&c.method==='POST');assert.equal(posts.length,2);
 for(const post of posts)assert.equal(post.body.auto_recurring.start_date,new Date(now+7*86400000).toISOString());
 assert.equal(h.checkouts.get(rid).provider_plan_id,'monthly-trial');
});
