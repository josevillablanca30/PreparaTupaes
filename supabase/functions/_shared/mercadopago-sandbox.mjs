import {MP_PLANS,validatePlan,checkoutUrl,canonicalSubscription,verifyMpSignature,subscriptionInvoices,paymentInvoices,subscriptionPayments,isApprovedPayment,iso} from './mercadopago-core.mjs';
const UUID=/^[a-f\d]{8}-[a-f\d]{4}-[1-5][a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
const PROVIDER_ID=/^[a-z\d_-]{1,128}$/i;
const NUMERIC_ID=/^[1-9]\d{0,18}$/;
const choices={WEEKLY:{plan:'semanal'},MONTHLY:{plan:'mensual'},YEARLY:{plan:'anual'},MONTHLY_TRIAL:{plan:'mensual',trial:true}};
const subscriptionStatuses=['pending','authorized','paused','cancelled','canceled'];
function planCheckoutUrl(value,planId){
 let url;
 try{url=new URL(checkoutUrl(value));}catch{throw Error('INVALID_PLAN_CHECKOUT_URL');}
 const plans=url.searchParams.getAll('preapproval_plan_id');
 if(url.pathname!=='/subscriptions/checkout'||url.username||url.password||url.port||plans.length!==1||plans[0]!==planId||url.searchParams.has('preapproval_id'))throw Error('INVALID_PLAN_CHECKOUT_URL');
 return url.href;
}
export function createSandboxHandlers({env,createClient,fetcher=fetch,now=()=>Date.now()}){
 const client=(key,token)=>createClient(env('SUPABASE_URL'),key,{auth:{persistSession:false,autoRefreshToken:false},...(token?{global:{headers:{Authorization:'Bearer '+token}}}:{})});
 const collector=()=>env('MP_TEST_COLLECTOR_ID');
 async function serviceRpc(name,params){
  const {data,error}=await client(env('SUPABASE_SERVICE_ROLE_KEY')).rpc(name,params);
  if(error)throw Error(error.message);
  return data;
 }
 const call=(operation,payload={})=>serviceRpc('cachaste_mp_sandbox_admin',{operation,payload});
 const originAllowed=origin=>origin==='https://sitecacho.cl'||/^https:\/\/[a-z0-9-]+\.cachaste-sitecacho\.pages\.dev$/.test(origin);
 function cors(req){const origin=req.headers.get('origin');if(origin&&!originAllowed(origin))throw Error('ORIGIN_NOT_ALLOWED');return {'content-type':'application/json','cache-control':'no-store','x-content-type-options':'nosniff',...(origin?{'access-control-allow-origin':origin,'vary':'Origin'}:{}),'access-control-allow-methods':'POST,OPTIONS','access-control-allow-headers':'authorization,apikey,content-type,x-client-info'};}
 const reply=(req,data,status=200)=>new Response(JSON.stringify(data),{status,headers:cors(req)});
 async function authenticate(req){
  const token=req.headers.get('authorization')?.match(/^Bearer\s+(\S+)$/i)?.[1];if(!token)throw Error('AUTH_REQUIRED');
  const sdk=client(env('SUPABASE_ANON_KEY')||env('SUPABASE_PUBLISHABLE_KEY'),token);
  const {data,error}=await sdk.auth.getUser(token);if(error||!data?.user)throw Error('AUTH_REQUIRED');
  const account=await sdk.rpc('cachaste_web_account');if(account.error)throw Error('AUTH_REQUIRED');
  if(account.data?.isAdmin!==true)throw Error('QA_ADMIN_REQUIRED');return data.user;
 }
 async function mp(path,{method='GET',body,requestId}={}){
  if(!path.startsWith('/'))throw Error('INVALID_PROVIDER_PATH');
  const response=await fetcher('https://api.mercadopago.com'+path,{method,headers:{authorization:'Bearer '+env('MP_TEST_ACCESS_TOKEN'),'content-type':'application/json',...(requestId?{'X-Idempotency-Key':requestId}:{})},...(body?{body:JSON.stringify(body)}:{}),redirect:'error',signal:AbortSignal.timeout(12000)});
  const data=await response.json().catch(()=>({}));
  if(!response.ok){console.error('MP_SANDBOX_PROVIDER_ERROR',JSON.stringify({status:response.status,operation:path.split('?')[0].replace(/\/[a-f0-9]{20,}/g,'/:id')}));throw Object.assign(Error('PROVIDER_CHECKOUT_FAILED'),{providerStatus:response.status});}return data;
 }
 async function seller(){
  if(env('MP_TEST_MODE')!=='test'||!env('MP_TEST_ACCESS_TOKEN')||!NUMERIC_ID.test(collector()||''))throw Error('TEST_CONFIG_MISSING');
  const me=await mp('/users/me');
  if(String(me.id)!==collector()||!Array.isArray(me.tags)||!me.tags.includes('test_user')||me.site_id!=='MLC')throw Error('NOT_TEST_SELLER');
  return {id:String(me.id),site:me.site_id,testUser:true};
 }
 async function catalogue(key){
  const c=choices[key];if(!c)throw Error('INVALID_PLAN');const id=env('MP_TEST_PLAN_'+key);if(!id)throw Error('TEST_CONFIG_MISSING');
  const remote=await mp('/preapproval_plan/'+encodeURIComponent(id));validatePlan(remote,c.plan,id,{trial:!!c.trial,collectorId:env('MP_TEST_COLLECTOR_ID')});return {...c,id,remote};
 }
 function testPayerId(id){
  if(typeof id!=='string'||!NUMERIC_ID.test(id)||id===collector())throw Error('INVALID_TEST_PAYER_ID');
  return id;
 }
 function sandboxPaymentIssue(payment,id){
  if(String(payment?.id)!==id)return 'provider_payment_id_mismatch';
  if(String(payment.collector_id)!==collector())return 'provider_seller_mismatch';
  if(payment.live_mode===true)return 'provider_live_mode';
  if(payment.live_mode!==false)return 'provider_mode_unverified';
  return null;
 }
 function verifiedPlanPayment(payment,paymentId,payerId,plan,observedAt){
  return !sandboxPaymentIssue(payment,paymentId)&&String(payment.payer?.id)===payerId&&
   Number(payment.transaction_amount)===MP_PLANS[plan.plan].amount&&payment.currency_id==='CLP'&&
   (payment.application_id==null||String(payment.application_id)===String(plan.remote.application_id))&&
   isApprovedPayment(payment,observedAt);
 }
 function processedPaymentInvoice(invoice,paymentId){
  return String(invoice.payment?.id)===paymentId&&invoice.status==='processed'&&
   (invoice.live_mode==null||invoice.live_mode===false)&&
   (invoice.payment?.status==null||invoice.payment.status==='approved');
 }
 async function invoiceForPayment(paymentId){
  const invoices=(await paymentInvoices(mp,paymentId)).filter(invoice=>String(invoice.payment?.id)===paymentId);
  if(invoices.length===0)return null;
  if(invoices.length!==1||!PROVIDER_ID.test(String(invoices[0].id??''))||
     typeof invoices[0].preapproval_id!=='string'||!PROVIDER_ID.test(invoices[0].preapproval_id)){
   throw Error('PAYMENT_SUBSCRIPTION_NOT_MATCHED');
  }
  return invoices[0];
 }
 function subscriptionSnapshot(remote,row,invoices,payments,observedAt){
  if(!subscriptionStatuses.includes(remote.status))throw Error('INVALID_SUBSCRIPTION_STATUS');
  if((remote.live_mode!=null&&remote.live_mode!==false)||
     (row.hosted_application_id&&String(remote.application_id)!==row.hosted_application_id)||
     (row.hosted_collector_id&&row.hosted_collector_id!==collector())){
   throw Error('SUBSCRIPTION_MISMATCH');
  }
  return canonicalSubscription(remote,row,invoices,payments,{
   now:observedAt,collectorId:collector(),liveMode:false,
   sandboxPayerId:row.hosted_payer_id??undefined,
   existing:row.snapshot?{trial_until:row.snapshot.trialUntil}:null
  });
 }
 async function observeSubscription(row,{remote,observedAt=now(),expectedInvoice}={}){
  remote??=await mp('/preapproval/'+encodeURIComponent(row.provider_id));
  subscriptionSnapshot(remote,row,[],[],observedAt);
  const invoices=await subscriptionInvoices(mp,row.provider_id);
  if(invoices.some(invoice=>(invoice.live_mode!=null&&invoice.live_mode!==false)||
   (row.hosted_application_id&&invoice.application_id!=null&&String(invoice.application_id)!==row.hosted_application_id))){
   throw Error('CHARGE_MISMATCH');
  }
  if(expectedInvoice&&!invoices.some(invoice=>String(invoice.id)===String(expectedInvoice.id)&&
   String(invoice.payment?.id)===String(expectedInvoice.payment.id))){
   throw Error('INCOMPLETE_PAYMENT_HISTORY');
  }
  const payments=await subscriptionPayments(mp,invoices);
  if(row.hosted_application_id&&payments.some(payment=>payment.application_id!=null&&
   String(payment.application_id)!==row.hosted_application_id))throw Error('PAYMENT_MISMATCH');
  const paymentIds=new Set(payments.map(payment=>String(payment.id)));
  if(invoices.some(invoice=>invoice.payment?.id!=null&&!paymentIds.has(String(invoice.payment.id)))){
   throw Error('INCOMPLETE_PAYMENT_HISTORY');
  }
  return {invoices,payments,snapshot:subscriptionSnapshot(remote,row,invoices,payments,observedAt)};
 }
 async function observePlanSubscription(plan,payerId,id,{cancel=false,expectedInvoice,observedAt=now()}={}){
  if(typeof id!=='string'||!PROVIDER_ID.test(id))throw Error('INVALID_SUBSCRIPTION_ID');
  const path='/preapproval/'+encodeURIComponent(id);
  let remote=await mp(path);
  const row={
   id:null,provider_id:id,provider_plan_id:plan.id,plan:plan.plan,trial_offered:!!plan.trial,
   created_at:remote.date_created,hosted_payer_id:payerId,
   hosted_application_id:remote.application_id==null?null:plan.remote.application_id?.toString()
  };
  const observation=await observeSubscription(row,{remote,observedAt});
  const {invoices,payments}=observation;
  let {snapshot}=observation;
  if(expectedInvoice){
   const paymentId=String(expectedInvoice.payment.id);
   const invoice=invoices.find(item=>String(item.id)===String(expectedInvoice.id)&&processedPaymentInvoice(item,paymentId));
   const payment=payments.find(item=>String(item.id)===paymentId);
   if(!invoice||!verifiedPlanPayment(payment,paymentId,payerId,plan,observedAt))throw Error('PAYMENT_NOT_VERIFIED');
  }
  if(cancel&&!['cancelled','canceled'].includes(remote.status)){
   await mp(path,{method:'PUT',body:{status:'cancelled'}});
   remote=await mp(path);
   if(!['cancelled','canceled'].includes(remote.status))throw Error('PROVIDER_CANCELLATION_UNCONFIRMED');
   snapshot=subscriptionSnapshot(remote,{...row,snapshot},invoices,payments,observedAt);
  }
  const processed=new Set(invoices.filter(invoice=>invoice.status==='processed').map(invoice=>String(invoice.payment?.id)));
  const approvedPayments=payments.filter(payment=>processed.has(String(payment.id))&&isApprovedPayment(payment,observedAt)).length;
  const view={id,status:snapshot.status,createdAt:iso(remote.date_created),paidUntil:snapshot.paidUntil,trialUntil:snapshot.trialUntil,
   renews:snapshot.renews,nextPaymentAt:snapshot.nextPaymentAt,approvedPayments,liveMode:false};
  return {view,snapshot,remote};
 }
 async function listPlanSubscriptions(plan,payerId){
  const query=new URLSearchParams({payer_id:payerId,preapproval_plan_id:plan.id,limit:'10'});
  const result=await mp('/preapproval/search?'+query);
  if(!Array.isArray(result.results))throw Error('INVALID_SUBSCRIPTION_SEARCH');
  const subscriptions=result.results.filter(s=>String(s.payer_id)===payerId&&s.preapproval_plan_id===plan.id&&
   String(s.collector_id)===env('MP_TEST_COLLECTOR_ID')&&(s.live_mode==null||s.live_mode===false)&&(!s.site_id||s.site_id==='MLC')&&typeof s.id==='string'&&PROVIDER_ID.test(s.id))
   .map(s=>({id:s.id,status:s.status,createdAt:iso(s.date_created)}));
  return {subscriptions,hasMore:Number(result.paging?.total)>result.results.length};
 }
 async function reconcile(row,{attach=false,...options}={}){
  const {snapshot}=await observeSubscription(row,options);
  if(attach)await call('attach',{id:row.id,userId:row.user_id,providerId:row.provider_id});
  const result=await call('apply',{id:row.id,userId:row.user_id,snapshot});
  if(result.stored)return snapshot;
  const current=await call('lookup',{providerId:row.provider_id});
  if(!current?.snapshot)throw Error('SANDBOX_CHECKOUT_CHANGED');
  return current.snapshot;
 }
 async function verifyHostedPayment(body){
  const payerId=testPayerId(body.payerId);
  const paymentId=typeof body.paymentId==='string'||Number.isSafeInteger(body.paymentId)?String(body.paymentId):'';
  if(!NUMERIC_ID.test(paymentId))throw Error('INVALID_PAYMENT_ID');
  const observedAt=now(),plan=await catalogue(body.plan);
  const payment=await mp('/v1/payments/'+paymentId);
  if(!verifiedPlanPayment(payment,paymentId,payerId,plan,observedAt))throw Error('PAYMENT_NOT_VERIFIED');
  const invoice=await invoiceForPayment(paymentId);
  if(!invoice||!processedPaymentInvoice(invoice,paymentId))throw Error('PAYMENT_SUBSCRIPTION_NOT_MATCHED');
  const observation=await observePlanSubscription(plan,payerId,invoice.preapproval_id,{expectedInvoice:invoice,observedAt});
  return {payerId,paymentId,plan,invoice,...observation};
 }
 async function linkHostedPayment(userId,{payerId,paymentId,plan,invoice,remote,snapshot,view}){
  const applicationId=String(plan.remote.application_id);
  if(!NUMERIC_ID.test(applicationId)||String(remote.application_id)!==applicationId||
     (plan.remote.live_mode!=null&&plan.remote.live_mode!==false)){
   throw Error('SUBSCRIPTION_MISMATCH');
  }
  if(remote.external_reference)throw Error('CHECKOUT_REFERENCE_PRESENT');
  const confirmed=await mp('/authorized_payments/'+encodeURIComponent(String(invoice.id)));
  if(String(confirmed.id)!==String(invoice.id)||confirmed.preapproval_id!==remote.id||
     !processedPaymentInvoice(confirmed,paymentId)||
     (confirmed.application_id!=null&&String(confirmed.application_id)!==applicationId)){
   throw Error('PAYMENT_SUBSCRIPTION_NOT_MATCHED');
  }
  return serviceRpc('cachaste_mp_sandbox_link_hosted',{payload:{
   userId,payerId,paymentId,collectorId:collector(),applicationId,providerId:remote.id,
   providerPlanId:plan.id,plan:plan.plan,trial:!!plan.trial,createdAt:view.createdAt,snapshot
  }});
 }
 async function billing(req){try{
  cors(req);if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors(req)});if(req.method!=='POST')return reply(req,{error:'METHOD_NOT_ALLOWED'},405);
  const user=await authenticate(req),text=await req.text();if(text.length>8192)throw Error('PAYLOAD_TOO_LARGE');
  const body=JSON.parse(text||'{}');if(!['status','checkout','refresh','cancel','plan_status','plan_cancel','plan_payment_lookup','plan_payment_reconcile'].includes(body.action))throw Error('INVALID_ACTION');
  const verifiedSeller=await seller();
  if(body.action==='status'){
   const plans=[];
   for(const key of Object.keys(choices)){
    const c=await catalogue(key);
    plans.push({
     key,plan:c.plan,providerPlanId:c.id,applicationId:c.remote.application_id?.toString()??null,
     ...MP_PLANS[c.plan],currency:c.remote.auto_recurring.currency_id,trialDays:c.trial?7:0
    });
   }
   const webhookConfigured=!!env('MP_TEST_WEBHOOK_SECRET');
   const subscriptions=await call('list',{userId:user.id});
   console.info('MP_SANDBOX_STATUS',JSON.stringify({plans:plans.length,webhookConfigured,subscriptions:subscriptions.length}));
   return reply(req,{ready:true,mode:'sandbox',productionEnabled:false,seller:verifiedSeller,webhookConfigured,plans,subscriptions});
  }
  if(body.action==='checkout'){
   const c=await catalogue(body.plan);
   if(body.payerId!==undefined){
    if(body.payerEmail)throw Error('AMBIGUOUS_TEST_PAYER');
    const payerId=testPayerId(body.payerId);
    return reply(req,{mode:'sandbox',checkoutMode:'hosted_plan',payerId,providerPlanId:c.id,checkoutUrl:planCheckoutUrl(c.remote.init_point,c.id),productionEnabled:false});
   }
   const email=String(body.payerEmail||env('MP_TEST_BUYER_EMAIL')||'').trim();
   if(!/^[^\s@]{1,200}@testuser\.(com|cl)$/i.test(email))throw Error('TEST_BUYER_EMAIL_REQUIRED');
   if(!UUID.test(body.requestId||''))throw Error('INVALID_REQUEST_ID');
   const row=await call('reserve',{id:body.requestId,userId:user.id,plan:c.plan,providerPlanId:c.id,trial:!!c.trial});
   if(row.provider_id){const existing=await mp('/preapproval/'+encodeURIComponent(row.provider_id));if(existing.status!=='pending')throw Error('CHECKOUT_ALREADY_FINISHED');return reply(req,{id:row.provider_id,checkoutUrl:checkoutUrl(existing.init_point),mode:'sandbox'});}
   if(!row.created)throw Error('CHECKOUT_PENDING');
   const p=MP_PLANS[c.plan],auto_recurring={frequency:p.frequency,frequency_type:p.frequency_type,transaction_amount:p.amount,currency_id:'CLP',...(c.trial?{start_date:new Date(now()+7*86400000).toISOString()}:{})};
   let sub;try{sub=await mp('/preapproval',{method:'POST',requestId:row.id,body:{auto_recurring,external_reference:row.id,payer_email:email,reason:'Cachaste QA '+c.plan,back_url:'https://sitecacho.cl/cuenta.html?qa=mp&checkout=return',status:'pending'}});}catch(error){if([400,401,403,404,422].includes(error.providerStatus))await call('checkout_failed',{id:row.id,userId:user.id,status:error.providerStatus});throw error;}
   await call('attach',{id:row.id,userId:user.id,providerId:String(sub.id)});
   return reply(req,{checkoutUrl:checkoutUrl(sub.init_point),id:String(sub.id),mode:'sandbox',notice:'QA_ONLY_NOT_APP_ENTITLEMENT'});
  }
  if(body.action==='plan_payment_lookup'||body.action==='plan_payment_reconcile'){
   const verified=await verifyHostedPayment(body);
   const {payerId,paymentId,plan,view}=verified;
   const reconciliation=body.action==='plan_payment_reconcile'
    ?{reconciled:true,snapshot:await linkHostedPayment(user.id,verified)}:{};
   return reply(req,{mode:'sandbox',verified:true,productionEnabled:false,
     buyerId:payerId,plan:plan.plan,paymentId,subscription:{subscriptionId:view.id,...view},...reconciliation,
     notice:'QA_ONLY_NOT_APP_ENTITLEMENT'});
  }
  if(body.action==='plan_status'||body.action==='plan_cancel'){
   const payerId=testPayerId(body.payerId),plan=await catalogue(body.plan);
   const cancel=body.action==='plan_cancel';
   if(!cancel&&body.subscriptionId===undefined)return reply(req,{mode:'sandbox',...await listPlanSubscriptions(plan,payerId)});
   const {view:snapshot}=await observePlanSubscription(plan,payerId,body.subscriptionId,{cancel});
   return reply(req,{mode:'sandbox',snapshot,...(cancel?{cancelled:true}:{})});
  }
  const rows=await call('list',{userId:user.id});
  if(body.action==='cancel'){
   const row=rows.find(r=>r.provider_id===body.subscriptionId);if(!row)throw Error('NOT_FOUND');
   const {snapshot:current}=await observeSubscription(row);
   if(!['cancelled','canceled'].includes(current.status))await mp('/preapproval/'+encodeURIComponent(row.provider_id),{method:'PUT',body:{status:'cancelled'}});
   const snapshot=await reconcile(row);return reply(req,{cancelled:['cancelled','canceled'].includes(snapshot.status),snapshot,mode:'sandbox'});
  }
  const snapshots=[];for(const row of rows)if(row.provider_id)snapshots.push(await reconcile(row));return reply(req,{refreshed:true,snapshots,mode:'sandbox'});
 }catch(e){const raw=String(e?.message||''),code=/^[A-Z_]+$/.test(raw)?raw:'SERVICE_UNAVAILABLE',status=code==='AUTH_REQUIRED'?401:/QA_ADMIN_REQUIRED|ORIGIN_NOT_ALLOWED|OWNERSHIP_REQUIRED/.test(code)?403:/CONFIG|NOT_TEST_SELLER/.test(code)?503:/PROVIDER/.test(code)?502:/PENDING|FINISHED/.test(code)?409:400;try{return reply(req,{error:code},status);}catch{return new Response('Forbidden',{status:403});}}}
 function webhookReply(type,result,reason){
  const outcome={result,...(reason?{reason}:{})};
  console.info('MP_SANDBOX_WEBHOOK',JSON.stringify({type,...outcome}));
  return Response.json(outcome,{headers:{'cache-control':'no-store'}});
 }
 async function routeWebhook(type,resourceId){
  if(type==='subscription_preapproval')return {providerId:resourceId};
  if(type==='subscription_authorized_payment'){
   const invoice=await mp('/authorized_payments/'+encodeURIComponent(resourceId));
   if(String(invoice.id)!==resourceId)throw Error('EVENT_ID_MISMATCH');
   if(invoice.live_mode!=null&&invoice.live_mode!==false)return {ignored:'provider_mode'};
   return {providerId:invoice.preapproval_id,invoice};
  }
  const payment=await mp('/v1/payments/'+encodeURIComponent(resourceId));
  const issue=sandboxPaymentIssue(payment,resourceId);
  if(issue)return {ignored:issue};
  const reference=UUID.test(payment.external_reference||'')
   ?await call('lookup',{reference:payment.external_reference}):null;
  const invoice=await invoiceForPayment(resourceId);
  if(!invoice){
   if(reference)throw Error('INCOMPLETE_PAYMENT_HISTORY');
   return {ignored:'invoice_not_found'};
  }
  if(invoice.live_mode!=null&&invoice.live_mode!==false)return {ignored:'provider_mode'};
  if(reference?.provider_id&&reference.provider_id!==invoice.preapproval_id)throw Error('CHARGE_MISMATCH');
  return {providerId:invoice.preapproval_id,invoice,reference};
 }
 async function recoverReservation(providerId){
  const remote=await mp('/preapproval/'+encodeURIComponent(providerId)).catch(error=>{
   if(error.providerStatus!==404)throw error;
   return null;
  });
  if(!remote||String(remote.id)!==providerId||!UUID.test(remote.external_reference||''))return null;
  const row=await call('lookup',{reference:remote.external_reference});
  if(!row)return null;
  if(row.provider_id&&row.provider_id!==providerId)throw Error('SUBSCRIPTION_MISMATCH');
  return {row:{...row,provider_id:providerId},remote,attach:!row.provider_id};
 }
 async function webhook(req){try{
  if(req.method!=='POST')return new Response(null,{status:405});
  const secret=env('MP_TEST_WEBHOOK_SECRET');if(!secret)return new Response('Sandbox webhook not configured',{status:503});
  const observedAt=now(),signature=await verifyMpSignature(req,secret,observedAt),text=await req.text();
  if(text.length>16384)throw Error('PAYLOAD_TOO_LARGE');
  const body=JSON.parse(text),type=body.type;
  if(String(body.data?.id)!==signature.id||!(type==='payment'?NUMERIC_ID:PROVIDER_ID).test(signature.id))throw Error('EVENT_ID_MISMATCH');
  if(!['subscription_preapproval','subscription_authorized_payment','payment'].includes(type))return webhookReply('other','ignored','unsupported_type');
  const queryType=new URL(req.url).searchParams.get('type');
  if(queryType&&queryType!==type)return webhookReply(type,'ignored','topic_mismatch');
  if((await call('seen',{hash:signature.hash})).seen)return webhookReply(type,'duplicate');
  await seller();
  const route=await routeWebhook(type,signature.id);
  if(route.ignored)return webhookReply(type,'ignored',route.ignored);
  const {providerId,invoice,reference}=route;
  if(typeof providerId!=='string'||!PROVIDER_ID.test(providerId))throw Error('INVALID_SUBSCRIPTION_ID');
  const linked=await call('lookup',{providerId});
  const association=linked?{row:linked}:await recoverReservation(providerId);
  if(!association)return webhookReply(type,'ignored','not_linked');
  if(reference&&association.row.id!==reference.id)throw Error('CHARGE_MISMATCH');
  await reconcile(association.row,{
   observedAt,remote:association.remote,attach:association.attach,
   expectedInvoice:invoice?.payment?.id!=null?invoice:undefined
  });
  await call('seen',{hash:signature.hash,record:true});
  return webhookReply(type,'processed');
 }catch(e){const code=String(e?.message||'');console.error('MP_SANDBOX_WEBHOOK_ERROR',/^[A-Z_]+$/.test(code)?code:'INTERNAL_ERROR');return new Response('Notification not processed',{status:/SIGNATURE|EVENT_ID/.test(code)?401:503});}}
 return {billing,webhook};
}
