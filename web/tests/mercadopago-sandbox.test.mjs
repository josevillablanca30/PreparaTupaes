import test from 'node:test';
import assert from 'node:assert/strict';
import {createSandboxHandlers} from '../../supabase/functions/_shared/mercadopago-sandbox.mjs';
import {canonicalSubscription} from '../../supabase/functions/_shared/mercadopago-core.mjs';
const userId='10000000-0000-4000-8000-000000000001',requestId='30000000-0000-4000-8000-000000000001',now=Date.now();
const day=86400000,hostedBuyer='3829500000',hostedId='qa-hosted-sub';
const invoiceId = '6400000001';
function harness(){
 const vars={SUPABASE_URL:'https://qa.invalid',SUPABASE_ANON_KEY:'public',SUPABASE_SERVICE_ROLE_KEY:'service',MP_TEST_MODE:'test',MP_TEST_ACCESS_TOKEN:'APP_USR-synthetic-test-seller',MP_TEST_COLLECTOR_ID:'123',MP_TEST_PLAN_MONTHLY_TRIAL:'trial',MP_TEST_PLAN_MONTHLY:'monthly',MP_TEST_PLAN_WEEKLY:'weekly',MP_TEST_PLAN_YEARLY:'yearly',MP_TEST_WEBHOOK_SECRET:'synthetic-qa-secret',MP_ACCESS_TOKEN:'PRODUCTION_MUST_NEVER_BE_USED'};
 const calls=[],rows=new Map(),receipts=new Set();let isAdmin=true,validSession=true,testSeller=true,subStatus='pending',providerFails=false;
 let hostedPlanUrl='https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=weekly',hostedPayments=[];
 const hosted={id:hostedId,payer_id:hostedBuyer,collector_id:123,site_id:'MLC',preapproval_plan_id:'weekly',status:'authorized',date_created:new Date(now-9*day).toISOString(),next_payment_date:new Date(now+6*day).toISOString(),auto_recurring:{transaction_amount:2490,currency_id:'CLP',frequency:7,frequency_type:'days'}};
 const createClient=(_url,key)=>key==='service'?{rpc:async(name,{operation,payload:p})=>{
  assert.equal(name,'cachaste_mp_sandbox_admin');calls.push({operation,p});let data={};
  if(operation==='reserve'){if(rows.has(p.id))data={...rows.get(p.id),created:false};else {data={id:p.id,user_id:p.userId,plan:p.plan,provider_plan_id:p.providerPlanId,provider_plan_linked:false,trial_offered:p.trial,created_at:new Date(now).toISOString(),created:true};rows.set(p.id,data);}}
  if(operation==='attach'){rows.get(p.id).provider_id=p.providerId;data=rows.get(p.id);}
  if(operation==='list')data=[...rows.values()].filter(r=>r.user_id===p.userId);
  if(operation==='lookup')data=[...rows.values()].find(r=>r.provider_id===p.providerId||r.id===p.reference)||null;
  if(operation==='apply'){rows.get(p.id).snapshot=p.snapshot;data={stored:true,productionAccess:false};}
  if(operation==='seen'){if(p.record)receipts.add(p.hash);data={seen:receipts.has(p.hash)};}
  return {data};
 }}:{auth:{getUser:async()=>validSession?{data:{user:{id:userId}}}:{error:{message:'revoked'}}},rpc:async()=>validSession?{data:{isAdmin}}:{error:{message:'revoked'}}};
 const fetcher=async(url,options={})=>{
  calls.push({url,options});assert.equal(options.headers.authorization,'Bearer '+vars.MP_TEST_ACCESS_TOKEN);assert.ok(!JSON.stringify(options).includes(vars.MP_ACCESS_TOKEN));
  if(providerFails)return Response.json({message:'provider failure'},{status:503});
  if(url.endsWith('/users/me'))return Response.json({id:123,tags:testSeller?['test_user']:[],site_id:'MLC'});
  if(url.includes('/preapproval_plan/')){const id=url.split('/').at(-1),p=id==='weekly'?{transaction_amount:2490,frequency:7,frequency_type:'days'}:id==='yearly'?{transaction_amount:64990,frequency:12,frequency_type:'months'}:{transaction_amount:7990,frequency:1,frequency_type:'months'};return Response.json({id,status:'active',collector_id:123,init_point:id==='weekly'?hostedPlanUrl:undefined,auto_recurring:{currency_id:'CLP',...p,...(id==='trial'?{free_trial:{frequency:7,frequency_type:'days'}}:{})}});}
  if(url.includes('/preapproval/search?'))return Response.json({results:[hosted,{...hosted,id:'other-payer',payer_id:'654'},{...hosted,id:'other-plan',preapproval_plan_id:'monthly'},{...hosted,id:'live',live_mode:true}],paging:{total:4}});
  if(url.endsWith('/preapproval/'+hostedId)){if(options.method==='PUT'){assert.deepEqual(JSON.parse(options.body),{status:'cancelled'});hosted.status='cancelled';hosted.next_payment_date=null;}return Response.json(hosted);}
  if (url.endsWith('/authorized_payments/' + invoiceId)) {
   return Response.json({ id: invoiceId, preapproval_id: 'qa-sub', status: 'scheduled' });
  }
  if(url.includes('/authorized_payments/search?preapproval_id='+hostedId))return Response.json({results:hostedPayments.map(p=>({id:p.id,preapproval_id:hostedId,payment:{id:p.id},status:'processed'}))});
  if(url.includes('/v1/payments/'))return Response.json(hostedPayments.find(p=>String(p.id)===url.split('/').at(-1)));
  if(url.endsWith('/preapproval')&&options.method==='POST')return Response.json({id:'qa-sub',init_point:'https://www.mercadopago.cl/subscriptions/checkout?preapproval_id=qa-sub'});
  if(url.includes('/preapproval/')){if(options.method==='PUT')subStatus='cancelled';return Response.json({id:'qa-sub',external_reference:requestId,collector_id:123,site_id:'MLC',status:subStatus,date_created:new Date(now).toISOString(),auto_recurring:{transaction_amount:7990,currency_id:'CLP',frequency:1,frequency_type:'months'},init_point:'https://www.mercadopago.cl/subscriptions/checkout?preapproval_id=qa-sub'});}
  if(url.includes('/authorized_payments/search'))return Response.json({results:[]});return Response.json({}, {status:404});
 };
 const handlers=createSandboxHandlers({env:key=>vars[key],createClient,fetcher,now:()=>now});
 const req=body=>new Request('https://qa.invalid/function',{method:'POST',headers:{origin:'https://sitecacho.cl',authorization:'Bearer qa-session'},body:JSON.stringify(body)});
 return {...handlers,req,vars,calls,rows,receipts,hosted,setHostedUrl:v=>hostedPlanUrl=v,setHostedPayments:v=>hostedPayments=v,setAdmin:v=>isAdmin=v,revoke:()=>validSession=false,setTestSeller:v=>testSeller=v,setStatus:v=>subStatus=v,setFail:v=>providerFails=v};
}
const checkout={action:'checkout',plan:'MONTHLY_TRIAL',payerEmail:'test_user_synthetic@testuser.com',requestId};
async function notification(secret = 'synthetic-qa-secret', stamp = now, {
 id = 'qa-sub', type = 'subscription_preapproval', queryType = type,
 request = 'qa-request'
} = {}) {
 const ts = Math.floor(stamp / 1000);
 const manifest = `id:${id};request-id:${request};ts:${ts};`;
 const encoder = new TextEncoder();
 const key = await crypto.subtle.importKey('raw', encoder.encode(secret),
  { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
 const signature = Buffer.from(await crypto.subtle.sign('HMAC', key, encoder.encode(manifest))).toString('hex');
 const query = new URLSearchParams({ 'data.id': id, type: queryType });
 return new Request(`https://qa.invalid/events?${query}`, {
  method: 'POST',
  headers: { 'x-request-id': request, 'x-signature': `ts=${ts},v1=${signature}` },
  body: JSON.stringify({ type, data: { id } })
 });
}
test('sandbox hosted checkout copies verified recurrence, has no card data and reuses the same provider subscription',async()=>{
 const h=harness();assert.equal((await h.billing(h.req(checkout))).status,200);assert.equal((await h.billing(h.req(checkout))).status,200);
 const posts=h.calls.filter(c=>c.url?.endsWith('/preapproval')&&c.options.method==='POST');assert.equal(posts.length,1);
 const body=JSON.parse(posts[0].options.body);assert.equal(body.preapproval_plan_id,undefined);assert.equal(body.status,'pending');assert.equal(body.auto_recurring.transaction_amount,7990);assert.equal(body.external_reference,requestId);assert.equal(body.auto_recurring.start_date,new Date(now+7*86400000).toISOString());assert.equal(body.card_token_id,undefined);
});
test('only a current database admin and a verified test seller can start sandbox provider calls',async()=>{
 const h=harness();h.setAdmin(false);assert.equal((await h.billing(h.req(checkout))).status,403);assert.equal(h.calls.length,0);
 h.setAdmin(true);h.revoke();assert.equal((await h.billing(h.req(checkout))).status,401);assert.equal(h.calls.length,0);
 const real=harness();real.setTestSeller(false);assert.equal((await real.billing(real.req(checkout))).status,503);assert.equal(real.calls.filter(c=>c.url?.endsWith('/preapproval')).length,0);
});
test('sandbox refuses real payer emails, client prices, foreign origins and malformed request IDs',async()=>{
 const h=harness();for(const body of [{...checkout,payerEmail:'real@gmail.com'},{...checkout,requestId:'bad'},{...checkout,plan:'CUSTOM',amount:1}])assert.equal((await h.billing(h.req(body))).status,400);
 const other=new Request('https://qa.invalid/function',{method:'POST',headers:{origin:'https://foreign.invalid'},body:'{}'});assert.equal((await h.billing(other)).status,403);
 assert.equal(h.rows.size,0);
});
test('sandbox status validates four plans, flags the absent webhook key and never opens production',async()=>{
 const h=harness();delete h.vars.MP_TEST_WEBHOOK_SECRET;const r=await h.billing(h.req({action:'status'}));assert.equal(r.status,200);const status=await r.json();assert.equal(status.plans.length,4);assert.equal(status.productionEnabled,false);assert.equal(status.webhookConfigured,false);
});
test('pending never grants sandbox access; authorization records a seven day trial; cancellation preserves its end',async()=>{
 const h=harness();await h.billing(h.req(checkout));await h.billing(h.req({action:'refresh'}));assert.equal(h.rows.get(requestId).snapshot.trialUntil,null);
 h.setStatus('authorized');await h.billing(h.req({action:'refresh'}));const initial=h.rows.get(requestId).snapshot;assert.equal(initial.trialUntil,new Date(now+7*86400000).toISOString());assert.equal(initial.liveMode,false);
 const response=await h.billing(h.req({action:'cancel',subscriptionId:'qa-sub'}));assert.equal(response.status,200);const cancelled=await response.json();assert.equal(cancelled.cancelled,true);assert.equal(cancelled.snapshot.trialUntil,initial.trialUntil);assert.equal(cancelled.snapshot.renews,false);
 assert.equal((await h.billing(h.req({action:'cancel',subscriptionId:'someone-else'}))).status,400);
});
test('sandbox signed webhooks are retryable, reject forged and stale signatures and deduplicate successful events',async()=>{
 const h=harness();await h.billing(h.req(checkout));h.setStatus('authorized');h.setFail(true);
 assert.equal((await h.webhook(await notification())).status,503);assert.equal(h.receipts.size,0);h.setFail(false);
 assert.equal((await h.webhook(await notification('forged'))).status,401);assert.equal((await h.webhook(await notification('synthetic-qa-secret',now-600000))).status,401);
 assert.equal((await h.webhook(await notification())).status,200);const applied=h.calls.filter(c=>c.operation==='apply').length;
 assert.equal((await h.webhook(await notification())).status,200);assert.equal(h.calls.filter(c=>c.operation==='apply').length,applied);assert.equal(h.receipts.size,1);
});
test('a signed invoice reconciles only when the notification body identifies an invoice', async () => {
 const h = harness();
 assert.equal((await h.billing(h.req(checkout))).status, 200);
 h.setStatus('authorized');
 const invoiceType = 'subscription_authorized_payment';

 const simulated = await notification(undefined, now, { id: invoiceId, queryType: invoiceType });
 assert.equal((await h.webhook(simulated)).status, 200);
 assert.equal(h.rows.get(requestId).snapshot, undefined);
 assert.equal(h.receipts.size, 0);
 assert.equal(h.calls.some(call => call.url?.endsWith('/authorized_payments/' + invoiceId)), false);

 const invoice = await notification(undefined, now, {
  id: invoiceId, type: invoiceType, request: 'qa-invoice-request'
 });
 assert.equal((await h.webhook(invoice)).status, 200);
 assert.equal(h.rows.get(requestId).snapshot.status, 'authorized');
 assert.equal(h.rows.get(requestId).snapshot.paidUntil, null);
 assert.equal(h.receipts.size, 1);
});
test('an unassociated checkout still requires exact provider identity, reference, amount and cadence',()=>{
 const row={id:requestId,user_id:userId,provider_id:'qa-sub',provider_plan_id:'catalogue',provider_plan_linked:false,plan:'mensual',created_at:new Date(now).toISOString()};
 const sub={id:'qa-sub',collector_id:123,external_reference:requestId,status:'pending',auto_recurring:{transaction_amount:7990,currency_id:'CLP',frequency:1,frequency_type:'months'}};
 assert.equal(canonicalSubscription(sub,row,[],[],{now,collectorId:123}).paidUntil,null);
 for(const bad of [{...sub,external_reference:'forged'},{...sub,collector_id:456},{...sub,preapproval_plan_id:'foreign'},{...sub,auto_recurring:{...sub.auto_recurring,transaction_amount:1}}])assert.throws(()=>canonicalSubscription(bad,row,[],[],{now,collectorId:123}),/SUBSCRIPTION_MISMATCH/);
});

test('the verified test plan opens by payer ID without an email or creation API call',async()=>{
 const h=harness();
 const r=await h.billing(h.req({action:'checkout',plan:'WEEKLY',payerId:hostedBuyer}));
 assert.equal(r.status,200);
 assert.deepEqual(await r.json(),{mode:'sandbox',checkoutMode:'hosted_plan',payerId:hostedBuyer,providerPlanId:'weekly',checkoutUrl:'https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=weekly',productionEnabled:false});
 assert.equal(h.rows.size,0);
 assert.ok(h.calls.every(c=>!c.operation&&c.options.method==='GET'));
 for(const url of ['https://foreign.invalid/subscriptions/checkout?preapproval_plan_id=weekly','https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=monthly','https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=weekly&preapproval_plan_id=monthly']){
  h.setHostedUrl(url);
  const rejected=await h.billing(h.req({action:'checkout',plan:'WEEKLY',payerId:hostedBuyer}));
  assert.equal((await rejected.json()).error,'INVALID_PLAN_CHECKOUT_URL');
 }
 const seller=await h.billing(h.req({action:'checkout',plan:'WEEKLY',payerId:'123'}));
 assert.equal((await seller.json()).error,'INVALID_TEST_PAYER_ID');
});

test('the hosted plan search and renewal observation match the provider payer, plan and paid dates',async()=>{
 const h=harness(),scope={action:'plan_status',plan:'WEEKLY',payerId:hostedBuyer};
 const search=await h.billing(h.req(scope));
 assert.equal(search.status,200);
 assert.deepEqual((await search.json()).subscriptions.map(s=>s.id),[hostedId]);
 assert.ok(h.calls.some(c=>c.url?.includes('payer_id='+hostedBuyer)&&c.url.includes('preapproval_plan_id=weekly')));
 const payment=(id,ago)=>({id,collector_id:123,currency_id:'CLP',transaction_amount:2490,live_mode:false,status:'approved',date_approved:new Date(now-ago*day).toISOString()});
 h.setHostedPayments([payment(101,8),payment(102,1),{...payment(103,0),transaction_amount_refunded:2490}]);
 const result=await h.billing(h.req({...scope,subscriptionId:hostedId}));
 assert.equal(result.status,200);
 const {snapshot}=await result.json();
 assert.equal(snapshot.approvedPayments,2);
 assert.equal(snapshot.paidUntil,new Date(now+6*day).toISOString());
 assert.equal(snapshot.nextPaymentAt,h.hosted.next_payment_date);
 assert.equal(snapshot.renews,true);
 assert.equal(snapshot.liveMode,false);
});

test('a hosted sandbox cancellation rejects foreign and live resources before the write and confirms cancellation',async()=>{
 const scope={action:'plan_cancel',plan:'WEEKLY',payerId:hostedBuyer,subscriptionId:hostedId};
 for(const fields of [{payer_id:'456'},{collector_id:456},{preapproval_plan_id:'monthly'},{live_mode:true}]){
  const h=harness();Object.assign(h.hosted,fields);
  const rejected=await h.billing(h.req(scope));
  assert.equal((await rejected.json()).error,'SUBSCRIPTION_MISMATCH');
  assert.ok(!h.calls.some(c=>c.options?.method==='PUT'));
 }
 const livePayment=harness();livePayment.setHostedPayments([{id:101,collector_id:123,currency_id:'CLP',transaction_amount:2490,live_mode:true,status:'approved',date_approved:new Date(now-day).toISOString()}]);
 assert.equal((await (await livePayment.billing(livePayment.req(scope))).json()).error,'PAYMENT_MISMATCH');
 assert.ok(!livePayment.calls.some(c=>c.options?.method==='PUT'));
 const h=harness(),cancel=await h.billing(h.req(scope));
 assert.equal(cancel.status,200);
 const reply=await cancel.json();assert.equal(reply.cancelled,true);assert.equal(reply.snapshot.renews,false);assert.equal(reply.snapshot.status,'cancelled');
 assert.equal((await h.billing(h.req(scope))).status,200);
 assert.equal(h.calls.filter(c=>c.options?.method==='PUT').length,1);
});
