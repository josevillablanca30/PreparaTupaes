import{MP_PLANS,validatePlan,checkoutUrl,canonicalSubscription,verifyMpSignature,csvReport,chileDateRange,subscriptionInvoices,subscriptionPayments,paymentInvoices}from'./mercadopago-core.mjs';
const UUID=/^[a-f\d]{8}-[a-f\d]{4}-[1-5][a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
const PROVIDER_ID=/^[a-zA-Z0-9_-]{1,100}$/;
const PLAN_KEYS={semanal:'WEEKLY',mensual:'MONTHLY',anual:'YEARLY'};
const CATALOGUE_CACHE_MS=60000;
const COMMERCIAL_ORIGIN='https://sitecacho.cl';
const ACONCANINO={sellerId:'3113741347',checkoutAppId:'48384472675774',catalogueAppId:'3489525217856496',plans:{
 WEEKLY:'f895a7dc01bc4c72a0591730d2bd3216',
 MONTHLY:'34744f64fd05415da55bbd416828576a',
 YEARLY:'2d545f0e863741cd9c2ec0341ece55d7'
}};
export function createMercadoPagoHandlers({env,createClient,fetcher=fetch,now=()=>Date.now()}){
 const supabaseUrl=()=>env('SUPABASE_URL'),anon=()=>env('SUPABASE_ANON_KEY')||env('SUPABASE_PUBLISHABLE_KEY');
 const live=()=>env('CACHASTE_MP_MODE')==='production';
 const webOrigin=()=>{if(live())return COMMERCIAL_ORIGIN;try{const value=new URL(env('CACHASTE_WEB_ORIGIN'));return value.protocol==='https:'&&value.pathname==='/'&&!value.search&&!value.hash?value.origin:null;}catch{return null;}};
 const productionAppId=()=>/^APP_USR-(\d+)-/.exec(env('MP_ACCESS_TOKEN')||'')?.[1]??null;
 const productionToken=()=>/^APP_USR-/.test(env('MP_ACCESS_TOKEN')||'')&&env('MP_ACCESS_TOKEN')!==env('MP_TEST_ACCESS_TOKEN');
 const testToken=()=>env('CACHASTE_MP_MODE')==='test'&&/^(TEST-|APP_USR-)/.test(env('MP_ACCESS_TOKEN')||'')&&
  !!env('MP_TEST_COLLECTOR_ID')&&String(env('MP_COLLECTOR_ID'))===String(env('MP_TEST_COLLECTOR_ID'))&&env('MP_ACCESS_TOKEN')===env('MP_TEST_ACCESS_TOKEN');
 const configured=()=>live()?productionToken():testToken();
 const productionAppMatches=()=>productionToken()&&productionAppId()===ACONCANINO.checkoutAppId;
 const checkoutAppReady=seller=>seller!==ACONCANINO.sellerId||productionAppMatches();
 // Mercado Pago can sign both callback URLs with the key of a single application.
 const signingReady=()=>!!env('MP_WEBHOOK_SECRET')&&(!live()||env('MP_WEBHOOK_SECRET')!==env('MP_TEST_WEBHOOK_SECRET')||
  productionAppMatches());
 const ready=()=>configured()&&signingReady()&&(live()||
  env('CACHASTE_MP_ENABLED')==='true'&&env('CACHASTE_MP_TAX_READY')==='true'&&
  !!webOrigin()&&Object.values(PLAN_KEYS).every(key=>!!env('MP_PLAN_'+key)));
 let sellerCheck,catalogueCheck;
 function cached(check,key,load){
  if(check?.key===key&&check.expires>now())return check;
  const record={key,expires:now()+CATALOGUE_CACHE_MS};
  record.value=load().catch(error=>{record.expires=0;throw error;});
  return record;
 }
 function cors(req){const origin=req.headers.get('origin'),allowed=webOrigin();if(origin&&origin!==allowed)throw Error('ORIGIN_DENIED');return{...(origin?{'access-control-allow-origin':origin,'vary':'Origin'}:{}),'access-control-allow-headers':'authorization,apikey,content-type,x-client-info','access-control-allow-methods':'POST,OPTIONS','cache-control':'no-store'};}
 const json=(req,data,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors(req),'content-type':'application/json'}});
 const admin=()=>createClient(supabaseUrl(),env('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false,autoRefreshToken:false}});
 const call=async(op,payload={})=>{const{data,error}=await admin().rpc('cachaste_web_billing_admin',{operation:op,payload});if(error)throw error;return data;};
 async function auth(req){const token=req.headers.get('authorization')?.replace(/^Bearer /i,'');if(!token)throw Error('AUTH_REQUIRED');const sdk=createClient(supabaseUrl(),anon(),{global:{headers:{Authorization:'Bearer '+token}},auth:{persistSession:false,autoRefreshToken:false}});const{data,error}=await sdk.auth.getUser(token);if(error||!data?.user)throw Error('AUTH_REQUIRED');const state=await sdk.rpc('cachaste_web_account');if(state.error)throw Error('AUTH_REQUIRED');return{user:data.user,state:state.data};}
 async function mp(path,options={}){if(!path.startsWith('/'))throw Error('INVALID_PROVIDER_PATH');const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);try{const res=await fetcher('https://api.mercadopago.com'+path,{...options,redirect:'error',signal:controller.signal,headers:{authorization:'Bearer '+env('MP_ACCESS_TOKEN'),'content-type':'application/json',...options.headers}});if(!res.ok)throw Object.assign(Error('PAYMENT_PROVIDER_UNAVAILABLE'),{providerStatus:res.status});return await res.json();}finally{clearTimeout(timer);}}
 function checkPlan(remote,plan,planId,collectorId,trial){
  validatePlan(remote,plan,planId,{trial:trial??(Number(remote?.auto_recurring?.free_trial?.frequency)>0),collectorId});
  if(live()&&(remote.live_mode===false||(remote.site_id&&remote.site_id!=='MLC')))throw Error('COMMERCIAL_PLAN_MISMATCH');
  if(live()&&collectorId===ACONCANINO.sellerId&&Object.values(ACONCANINO.plans).includes(planId)&&
     String(remote.application_id)!==ACONCANINO.catalogueAppId)throw Error('COMMERCIAL_PLAN_MISMATCH');
 }
 async function providerPlan(plan,planId,collectorId,trial=false){
  if(!PROVIDER_ID.test(planId||''))throw Error('PLAN_NOT_READY');
  const remote=await mp('/preapproval_plan/'+encodeURIComponent(planId));
  checkPlan(remote,plan,planId,collectorId,trial);
  return remote;
 }
 async function commercialSeller(){
  if(!live()||!productionToken())throw Error('COMMERCIAL_CREDENTIALS_NOT_CONFIGURED');
  const testSeller=String(env('MP_TEST_COLLECTOR_ID')),configuredSeller=env('MP_COLLECTOR_ID');
  const expected=configuredSeller&&configuredSeller!==testSeller?configuredSeller:ACONCANINO.sellerId;
  const key=JSON.stringify([env('MP_ACCESS_TOKEN'),expected,testSeller]);
  sellerCheck=cached(sellerCheck,key,async()=>{
   const seller=await mp('/users/me'),id=String(seller.id);
   if(!/^[1-9]\d{0,18}$/.test(id)||id===testSeller||expected!==id||
      seller.site_id!=='MLC'||!Array.isArray(seller.tags)||seller.tags.includes('test_user'))throw Error('COMMERCIAL_SELLER_MISMATCH');
   return {id,site:seller.site_id};
  });
  return sellerCheck.value;
 }
 async function collectorId(){
  return live()?(await commercialSeller()).id:String(env('MP_COLLECTOR_ID'));
 }
 function pendingCheckoutUrl(subscription){
  const url=new URL(checkoutUrl(subscription.init_point));
  if(live()&&(!PROVIDER_ID.test(String(subscription.id??''))||url.pathname!=='/subscriptions/checkout'||
     url.username||url.password||url.port||url.hash||url.searchParams.has('preapproval_plan_id')||
     url.searchParams.getAll('preapproval_id').length!==1||url.searchParams.get('preapproval_id')!==String(subscription.id)))
   throw Error('INVALID_CHECKOUT_URL');
  return url.href;
 }
 async function findCommercialPlans(){
  const plans=[];
  for(let offset=0;;){
   const page=await mp('/preapproval_plan/search'+(offset?'?offset='+offset:''));
   const total=Number(page.paging?.total);
   if(!Array.isArray(page.results)||Number(page.paging?.offset)!==offset||
      !Number.isSafeInteger(total)||total<offset||offset+page.results.length>total)throw Error('COMMERCIAL_PLAN_SEARCH_INCOMPLETE');
   plans.push(...page.results);
   if(plans.length===total)return plans;
   if(!page.results.length)throw Error('COMMERCIAL_PLAN_SEARCH_INCOMPLETE');
   offset+=page.results.length;
  }
 }
 async function commercialCatalogue({refresh=false}={}){
  const planKeys=[...Object.values(PLAN_KEYS),'MONTHLY_TRIAL'];
  const variables=['MP_ACCESS_TOKEN','MP_TEST_ACCESS_TOKEN','MP_COLLECTOR_ID','MP_TEST_COLLECTOR_ID','CACHASTE_MP_MODE',
   'CACHASTE_MP_TRIAL_ENABLED',...planKeys.flatMap(key=>['MP_PLAN_'+key,'MP_TEST_PLAN_'+key])];
  if(refresh){sellerCheck=null;catalogueCheck=null;}
  const key=JSON.stringify(variables.map(env));
  catalogueCheck=cached(catalogueCheck,key,loadCommercialCatalogue);
  return catalogueCheck.value;
 }
 async function loadCommercialCatalogue(){
  const seller=await commercialSeller();
  const catalogue=Object.entries(PLAN_KEYS).map(([plan,key])=>({plan,key,trial:plan==='mensual'?null:false}));
  if(env('CACHASTE_MP_TRIAL_ENABLED')==='true'&&env('MP_PLAN_MONTHLY_TRIAL'))catalogue.push({plan:'mensual',key:'MONTHLY_TRIAL',trial:true});
  const sandboxIds=new Set([...Object.values(PLAN_KEYS),'MONTHLY_TRIAL'].map(key=>env('MP_TEST_PLAN_'+key)));
  const configuredIds=catalogue.map(({key})=>env('MP_PLAN_'+key)||(seller.id===ACONCANINO.sellerId?ACONCANINO.plans[key]:undefined));
  if(configuredIds.some(id=>id&&sandboxIds.has(id)))throw Error('COMMERCIAL_PLAN_IDS_MISMATCH');
  const candidates=configuredIds.some(id=>!id)?await findCommercialPlans():[];
  const ids=catalogue.map(({plan,key,trial},index)=>{
   if(configuredIds[index])return configuredIds[index];
   const matches=new Set(candidates.filter(remote=>{
    if(!PROVIDER_ID.test(remote?.id||'')||sandboxIds.has(remote.id))return false;
    try{checkPlan(remote,plan,remote.id,seller.id,trial);return true;}catch{return false;}
   }).map(remote=>remote.id));
   if(matches.size!==1){
    const observations=candidates.filter(remote=>String(remote?.collector_id)===seller.id&&
     PROVIDER_ID.test(remote?.id||'')&&!sandboxIds.has(remote.id)).map(remote=>{
     const period=remote.auto_recurring??{};
     return {
      id:remote.id,status:remote.status,amount:period.transaction_amount,currency:period.currency_id,
      frequency:period.frequency,frequencyType:period.frequency_type,
      trialFrequency:period.free_trial?.frequency,trialFrequencyType:period.free_trial?.frequency_type,
      applicationId:remote.application_id,liveMode:remote.live_mode,
      cachaste:/cachaste/i.test(String(remote.reason||''))
     };
    });
    throw Object.assign(Error('COMMERCIAL_PLAN_'+key+(matches.size?'_AMBIGUOUS':'_MISSING')),{
     catalogue:{seller,plans:observations.slice(0,30),count:observations.length}
    });
   }
   return [...matches][0];
  });
  if(new Set(ids).size!==ids.length)throw Error('COMMERCIAL_PLAN_IDS_MISMATCH');
  const plans=await Promise.all(catalogue.map(async({plan,key,trial},index)=>{
   const id=ids[index],remote=await providerPlan(plan,id,seller.id,trial);
   const recurrence=remote.auto_recurring;
   return {
    key,id,applicationId:remote.application_id==null?null:String(remote.application_id),
    amount:Number(recurrence.transaction_amount),frequency:Number(recurrence.frequency),
    frequency_type:recurrence.frequency_type,trialDays:Number(recurrence.free_trial?.frequency)||0
   };
  }));
  return {seller,plans};
 }
 async function commercialReadiness(){
  const {seller,plans}=await commercialCatalogue({refresh:true});
  const checkoutEnabled=(await call('policy')).enabled===true;
  return {
   seller,plans,webOrigin:webOrigin(),webhookSecretConfigured:signingReady(),separateCredentials:true,
   checkoutApplicationId:seller.id===ACONCANINO.sellerId?ACONCANINO.checkoutAppId:null,
   productionTokenApplicationId:productionAppId(),
   webhookSecretPresent:!!env('MP_WEBHOOK_SECRET'),
   webhookUsesSameKeyAsSandbox:!!env('MP_WEBHOOK_SECRET')&&env('MP_WEBHOOK_SECRET')===env('MP_TEST_WEBHOOK_SECRET'),
   checkoutEnabled,ready:ready()&&checkoutEnabled&&checkoutAppReady(seller.id)
  };
 }
 function checkSubscriptionApplication(sub,seller){
  if(live()&&seller===ACONCANINO.sellerId&&String(sub.application_id)!==ACONCANINO.checkoutAppId)
   throw Error('SUBSCRIPTION_APPLICATION_MISMATCH');
 }
 async function pendingCheckout(req,checkout,seller,email){
  const plan=checkout.plan,requestId=checkout.id,p=MP_PLANS[plan];
  // A pending hosted checkout keeps the payment method at Mercado Pago.
  const auto_recurring={frequency:p.frequency,frequency_type:p.frequency_type,transaction_amount:p.amount,currency_id:'CLP',
   ...(checkout.trial_offered?{start_date:new Date(now()+7*86400000).toISOString()}:{})};
  let sub;
  try{
   sub=await mp('/preapproval',{method:'POST',headers:{'X-Idempotency-Key':requestId},body:JSON.stringify({
    auto_recurring,external_reference:requestId,payer_email:email,reason:'¿Cachaste? · '+plan,
    back_url:webOrigin()+'/cuenta.html?checkout=return',status:'pending'
   })});
  }catch(error){
   if([400,401,403,404,422].includes(error.providerStatus))
    await call('checkout_failed',{id:requestId,userId:checkout.user_id,status:error.providerStatus});
   throw error;
  }
  checkSubscriptionApplication(sub,seller);
  if(live()&&seller===ACONCANINO.sellerId&&
     (sub.status!=='pending'||sub.external_reference!==requestId||String(sub.collector_id)!==seller||sub.live_mode===false))
   throw Error('SUBSCRIPTION_MISMATCH');
  const url=pendingCheckoutUrl(sub),id=String(sub.id);
  await call('attach',{id:requestId,userId:checkout.user_id,providerId:id});
  return json(req,{checkoutUrl:url,id});
 }
 async function controlledCheckout(req,ticket){
  if(typeof ticket!=='string'||!UUID.test(ticket))throw Error('AUTH_REQUIRED');
  if(!live()||!ready()||!productionAppMatches())return json(req,{error:'BILLING_NOT_READY'},503);
  const {data:reservation,error}=await admin().rpc('cachaste_mp_controlled_checkout_claim',{ticket});
  if(error)throw error;
  if(!reservation)throw Error('AUTH_REQUIRED');
  const {id,userId,email,providerPlanId}=reservation;
  if(providerPlanId!==ACONCANINO.plans.WEEKLY)throw Error('INVALID_PLAN');
  const seller=await collectorId();
  await providerPlan('semanal',providerPlanId,seller);
  return pendingCheckout(req,{id,user_id:userId,plan:'semanal',trial_offered:false},seller,email);
 }
 async function reconcile(id,requiredPaymentId=null,verifiedSeller){
  if(typeof id!=='string'||!PROVIDER_ID.test(id))throw Error('INVALID_PROVIDER_ID');
  const observedAt=now(),seller=verifiedSeller??await collectorId();
  const sub=await mp('/preapproval/'+id);
  if(sub.live_mode!=null&&sub.live_mode!==live())throw Error('SUBSCRIPTION_MISMATCH');
  checkSubscriptionApplication(sub,seller);
  if(!UUID.test(sub.external_reference||''))throw Error('UNKNOWN_CHECKOUT');
  const checkout=await call('lookup',{reference:sub.external_reference});
  if(!checkout)throw Error('UNKNOWN_CHECKOUT');
  if(checkout.provider_id&&checkout.provider_id!==id)throw Error('SUBSCRIPTION_MISMATCH');
  const existing=(await call('subscriptions',{userId:checkout.user_id})).find(s=>s.provider_id===id);
  const records=await subscriptionInvoices(mp,id);
  if(requiredPaymentId&&!records.some(record=>String(record.payment?.id)===requiredPaymentId))throw Error('INCOMPLETE_PAYMENT_HISTORY');
  if(records.some(record=>record.live_mode!=null&&record.live_mode!==live()))throw Error('CHARGE_MISMATCH');
  const payments=await subscriptionPayments(mp,records);
  if(requiredPaymentId&&!payments.some(payment=>String(payment.id)===requiredPaymentId))throw Error('INCOMPLETE_PAYMENT_HISTORY');
  if(sub.payer_id!=null&&payments.some(payment=>payment.payer?.id!=null&&String(payment.payer.id)!==String(sub.payer_id)))throw Error('PAYMENT_MISMATCH');
  const canonical=canonicalSubscription(sub,{...checkout,provider_id:id},records,payments,{now:observedAt,collectorId:seller,liveMode:live(),existing});
  if(!checkout.provider_id)await call('attach',{id:checkout.id,userId:checkout.user_id,providerId:id});
  return call('apply',canonical);
 }
 async function reconcileScheduled(req,ticket){
  if(typeof ticket!=='string'||!UUID.test(ticket))throw Error('AUTH_REQUIRED');
  if(!live()||!configured())return json(req,{error:'BILLING_NOT_READY'},503);
  const {data:ids,error}=await admin().rpc('cachaste_mp_reconciliation_claim',{ticket});
  if(error)throw error;
  if(!Array.isArray(ids))throw Error('AUTH_REQUIRED');
  if(!ids.length)return json(req,{reconciled:0,failed:0});
  const seller=await collectorId();
  const deadline=now()+80000;
  let reconciled=0;
  for(let index=0;index<ids.length&&now()<deadline;index+=4){
   const results=await Promise.allSettled(ids.slice(index,index+4).map(id=>reconcile(id,null,seller)));
   for(const result of results){
    if(result.status==='fulfilled')reconciled++;
    else{
     const code=String(result.reason?.message||'');
     console.error('MP_SCHEDULED_RECONCILIATION_ERROR',/^[A-Z_]+$/.test(code)?code:'INTERNAL_ERROR');
    }
   }
  }
  return json(req,{reconciled,failed:ids.length-reconciled},reconciled===ids.length?200:503);
 }
 async function billing(req){try{
  cors(req);if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors(req)});
  if(req.method!=='POST')return json(req,{error:'METHOD_NOT_ALLOWED'},405);
  if(Number(req.headers.get('content-length')||0)>8192)return json(req,{error:'PAYLOAD_TOO_LARGE'},413);
  const text=await req.text();if(text.length>8192)return json(req,{error:'PAYLOAD_TOO_LARGE'},413);const body=JSON.parse(text||'{}');
  if(body.action==='reconcile_scheduled')return await reconcileScheduled(req,body.ticket);
  if(body.action==='checkout_controlled')return await controlledCheckout(req,body.ticket);
  if(body.action==='status'){
   let enabled=ready()&&(await call('policy')).enabled===true;
   let trialAvailable=false;
   if(enabled&&live()){
    try{
     const {seller,plans}=await commercialCatalogue();
     enabled=checkoutAppReady(seller.id);
     trialAvailable=enabled&&plans.some(plan=>plan.trialDays===7);
    }
    catch{enabled=false;}
   }else if(enabled&&env('CACHASTE_MP_TRIAL_ENABLED')==='true'&&env('MP_PLAN_MONTHLY_TRIAL')){
    try{await providerPlan('mensual',env('MP_PLAN_MONTHLY_TRIAL'),await collectorId(),true);trialAvailable=true;}catch{}
   }
   return json(req,{ready:enabled,trialAvailable,managementReady:configured(),mode:live()?'production':env('CACHASTE_MP_MODE')==='test'?'test':null});
  }
  const{user,state}=await auth(req);
  if(body.action==='commercial_readiness'){
   if(state.isAdmin!==true)throw Error('FORBIDDEN');
   return json(req,await commercialReadiness());
  }
  if(body.action==='sales'){
   if(state.isAdmin!==true)throw Error('FORBIDDEN');
   const range=body.fromDate||body.toDate?chileDateRange(body.fromDate,body.toDate):body;const from=Date.parse(range.from),to=Date.parse(range.to);if(!Number.isFinite(from)||!Number.isFinite(to)||to<=from||to-from>367*86400000)throw Error('INVALID_REPORT_RANGE');
   const report=await call('sales',{from:new Date(from).toISOString(),to:new Date(to).toISOString()});return new Response(csvReport(report.rows),{headers:{...cors(req),'content-type':'text/csv; charset=utf-8','content-disposition':'attachment; filename="cachaste-ventas-comisiones.csv"'}});
  }
  // The database launch policy is authoritative for creating new subscriptions,
  // even when every provider credential and environment flag is configured.
  if(body.action==='checkout'&&(!ready()||(await call('policy')).enabled!==true))return json(req,{error:'BILLING_NOT_READY',ready:false},503);
  if(body.action!=='checkout'&&!configured())return json(req,{error:'BILLING_NOT_READY',ready:false},503);
  if(!live()&&env('CACHASTE_MP_ALLOW_TEST_PURCHASES')!=='true')throw Error('TEST_PURCHASES_DISABLED');
  if(body.action==='checkout'){
   if(state.complimentary?.active===true)return json(req,{error:'COMPLIMENTARY_ACCESS'},409);
   if(live()&&(state.access?.active===true||state.subscriptions?.some(sub=>sub.renews===true)))
    return json(req,{error:'SUBSCRIPTION_ALREADY_ACTIVE'},409);
   if(!Object.hasOwn(PLAN_KEYS,body.plan)||!UUID.test(body.requestId||''))throw Error('INVALID_PLAN');await call('rate',{userId:user.id});
   const catalog=live()?await commercialCatalogue():null;
   const seller=catalog?.seller.id??await collectorId();
   if(catalog&&!checkoutAppReady(seller))return json(req,{error:'BILLING_NOT_READY',ready:false},503);
   const eligibleForTrial=body.plan==='mensual'&&!state.trialUsed;
   const optionalTrial=eligibleForTrial&&env('CACHASTE_MP_TRIAL_ENABLED')==='true'&&!!env('MP_PLAN_MONTHLY_TRIAL');
   const key=optionalTrial?'MONTHLY_TRIAL':PLAN_KEYS[body.plan];
   const offer=catalog?.plans.find(plan=>plan.key===key);
   const trial=eligibleForTrial&&(catalog?offer?.trialDays===7:optionalTrial);
   const planId=catalog?offer?.id:env('MP_PLAN_'+key);
   await providerPlan(body.plan,planId,seller,catalog?offer?.trialDays===7:trial);
   const checkout=await call('checkout',{id:body.requestId,userId:user.id,plan:body.plan,providerPlanId:planId,trial,linkedPlan:false});
   if(checkout.provider_id){
    const current=await mp('/preapproval/'+checkout.provider_id);
    checkSubscriptionApplication(current,seller);
    if(live()&&current.status!=='pending')return json(req,{error:'CHECKOUT_ALREADY_FINISHED'},409);
    if(live()&&(String(current.id)!==checkout.provider_id||current.external_reference!==checkout.id))throw Error('SUBSCRIPTION_MISMATCH');
    return json(req,{checkoutUrl:pendingCheckoutUrl(current),id:checkout.provider_id});
   }
   if(!checkout.created)return json(req,{error:'CHECKOUT_PENDING'},409);
   if(checkout.provider_plan_id!==planId){
    const priorTrial=live()&&body.plan==='mensual'&&!checkout.trial_offered?null:checkout.trial_offered;
    await providerPlan(body.plan,checkout.provider_plan_id,seller,priorTrial);
   }
   return await pendingCheckout(req,checkout,seller,user.email);
  }
  if(body.action==='refresh'){await call('rate',{userId:user.id});const rows=await call('subscriptions',{userId:user.id});for(const sub of rows)await reconcile(sub.provider_id);return json(req,{refreshed:true});}
  if(body.action==='cancel'){
   const rows=await call('subscriptions',{userId:user.id}),sub=rows.find(s=>s.provider_id===body.subscriptionId);if(!sub)throw Error('NOT_FOUND');
   await mp('/preapproval/'+sub.provider_id,{method:'PUT',body:JSON.stringify({status:'cancelled'})});await reconcile(sub.provider_id);return json(req,{cancelled:true});
  }
  throw Error('INVALID_OPERATION');
 }catch(e){const key=String(e?.message||'REQUEST_FAILED'),status=/AUTH_REQUIRED/.test(key)?401:/FORBIDDEN|ORIGIN_DENIED/.test(key)?403:/PROVIDER_UNAVAILABLE/.test(key)?503:400;try{return json(req,{error:/^[A-Z_]+$/.test(key)?key:'REQUEST_FAILED'},status);}catch{return new Response('Forbidden',{status:403});}}}
 async function webhook(req){try{
  if(req.method!=='POST')return new Response(null,{status:405});
  if(!signingReady())return new Response('Billing disabled',{status:503});
  const signature=await verifyMpSignature(req,env('MP_WEBHOOK_SECRET'),now());
  if(!configured())return new Response('Billing disabled',{status:503});
  if((await call('webhook_seen',{hash:signature.hash})).seen)return new Response(null,{status:200});
  const text=await req.text();if(text.length>16384)throw Error('PAYLOAD_TOO_LARGE');const body=JSON.parse(text);
  if(String(body.data?.id)!==signature.id)throw Error('EVENT_ID_MISMATCH');
  const queryType=new URL(req.url).searchParams.get('type');
  // The dashboard simulator can send a plan ID with two different subscription topics.
  // A signed, known catalogue ID can only acknowledge the simulation.
  const planSimulation=live()&&queryType==='subscription_authorized_payment'&&
   body.type==='subscription_preapproval'&&String(body.application_id)===ACONCANINO.checkoutAppId&&
   Object.values(ACONCANINO.plans).includes(signature.id);
  if(queryType&&queryType!==body.type&&!planSimulation)throw Error('EVENT_ID_MISMATCH');
  if(live()&&(body.type==='subscription_preapproval_plan'||planSimulation)){
   console.info('MP_COMMERCIAL_WEBHOOK_SIGNATURE_VERIFIED','subscription_preapproval_plan');
   return new Response(null,{status:200});
  }
  if(!['subscription_preapproval','subscription_authorized_payment','payment'].includes(body.type))return new Response(null,{status:200});
  if(live())console.info('MP_COMMERCIAL_WEBHOOK_SIGNATURE_VERIFIED',body.type);
  let id,paymentId=null,seller;
  if(body.type==='subscription_preapproval')id=signature.id;
  else if(body.type==='subscription_authorized_payment'){
   if(!/^\d+$/.test(signature.id))throw Error('EVENT_ID_MISMATCH');
   const charge=await mp('/authorized_payments/'+signature.id);
   if(String(charge.id)!==signature.id)throw Error('EVENT_ID_MISMATCH');
   if(charge.live_mode!=null&&charge.live_mode!==live())return new Response(null,{status:200});
   id=charge.preapproval_id;
   if(charge.payment?.id!=null)paymentId=String(charge.payment.id);
  }else if(body.type==='payment'){
   if(!/^\d+$/.test(signature.id))throw Error('EVENT_ID_MISMATCH');
   const payment=await mp('/v1/payments/'+signature.id);
   if(String(payment.id)!==signature.id)throw Error('EVENT_ID_MISMATCH');
   if(payment.live_mode!==live())return new Response(null,{status:200});
   seller=await collectorId();
   if(String(payment.collector_id)!==seller)return new Response(null,{status:200});
   const invoices=(await paymentInvoices(mp,signature.id)).filter(invoice=>String(invoice.payment?.id)===signature.id);
   if(invoices.length!==1||typeof invoices[0].preapproval_id!=='string')throw Error('PAYMENT_SUBSCRIPTION_NOT_MATCHED');
   id=invoices[0].preapproval_id;
   paymentId=signature.id;
  }
  await reconcile(id,paymentId,seller);await call('webhook',{hash:signature.hash});return new Response(null,{status:200});
 }catch(e){const code=String(e?.message||'UNKNOWN_ERROR');console.error('MP_WEBHOOK_PROCESSING_ERROR',/^[A-Z_]+$/.test(code)?code:'INTERNAL_ERROR');return new Response(/SIGNATURE|EVENT_ID/.test(code)?'Invalid notification':'Notification not processed',{status:/SIGNATURE|EVENT_ID/.test(code)?401:503});}}
 return{billing,webhook,commercialReadiness};
}
