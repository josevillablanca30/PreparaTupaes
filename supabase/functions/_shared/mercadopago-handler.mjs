import{MP_PLANS,validatePlan,checkoutUrl,canonicalSubscription,verifyMpSignature,csvReport,chileDateRange,subscriptionInvoices,subscriptionPayments,paymentInvoices}from'./mercadopago-core.mjs';
const UUID=/^[a-f\d]{8}-[a-f\d]{4}-[1-5][a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
const PROVIDER_ID=/^[a-zA-Z0-9_-]{1,100}$/;
const PLAN_KEYS={semanal:'WEEKLY',mensual:'MONTHLY',anual:'YEARLY'};
const CATALOGUE_CACHE_MS=60000;
const COMMERCIAL_ORIGIN='https://sitecacho.cl';
export function createMercadoPagoHandlers({env,createClient,fetcher=fetch,now=()=>Date.now()}){
 const supabaseUrl=()=>env('SUPABASE_URL'),anon=()=>env('SUPABASE_ANON_KEY')||env('SUPABASE_PUBLISHABLE_KEY');
 const live=()=>env('CACHASTE_MP_MODE')==='production';
 const webOrigin=()=>{if(live())return COMMERCIAL_ORIGIN;try{const value=new URL(env('CACHASTE_WEB_ORIGIN'));return value.protocol==='https:'&&value.pathname==='/'&&!value.search&&!value.hash?value.origin:null;}catch{return null;}};
 const productionToken=()=>/^APP_USR-/.test(env('MP_ACCESS_TOKEN')||'')&&env('MP_ACCESS_TOKEN')!==env('MP_TEST_ACCESS_TOKEN');
 const testToken=()=>env('CACHASTE_MP_MODE')==='test'&&/^(TEST-|APP_USR-)/.test(env('MP_ACCESS_TOKEN')||'')&&
  !!env('MP_TEST_COLLECTOR_ID')&&String(env('MP_COLLECTOR_ID'))===String(env('MP_TEST_COLLECTOR_ID'))&&env('MP_ACCESS_TOKEN')===env('MP_TEST_ACCESS_TOKEN');
 const configured=()=>live()?productionToken():testToken();
 const signingReady=()=>!!env('MP_WEBHOOK_SECRET')&&(!live()||env('MP_WEBHOOK_SECRET')!==env('MP_TEST_WEBHOOK_SECRET'));
 const ready=()=>configured()&&env('CACHASTE_MP_ENABLED')==='true'&&env('CACHASTE_MP_TAX_READY')==='true'&&signingReady()&&
  (live()||!!webOrigin()&&Object.values(PLAN_KEYS).every(key=>!!env('MP_PLAN_'+key)));
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
  validatePlan(remote,plan,planId,{trial,collectorId});
  if(live()&&(remote.live_mode===false||(remote.site_id&&remote.site_id!=='MLC')))throw Error('COMMERCIAL_PLAN_MISMATCH');
 }
 async function providerPlan(plan,planId,collectorId,trial=false){
  if(!PROVIDER_ID.test(planId||''))throw Error('PLAN_NOT_READY');
  const remote=await mp('/preapproval_plan/'+encodeURIComponent(planId));
  checkPlan(remote,plan,planId,collectorId,trial);
  return remote;
 }
 async function commercialSeller(){
  if(!live()||!productionToken())throw Error('COMMERCIAL_CREDENTIALS_NOT_CONFIGURED');
  const expected=env('MP_COLLECTOR_ID'),testSeller=String(env('MP_TEST_COLLECTOR_ID'));
  const key=JSON.stringify([env('MP_ACCESS_TOKEN'),expected,testSeller]);
  sellerCheck=cached(sellerCheck,key,async()=>{
   const seller=await mp('/users/me'),id=String(seller.id);
   if(!/^[1-9]\d{0,18}$/.test(id)||id===testSeller||(expected&&String(expected)!==testSeller&&String(expected)!==id)||
      seller.site_id!=='MLC'||!Array.isArray(seller.tags)||seller.tags.includes('test_user'))throw Error('COMMERCIAL_SELLER_MISMATCH');
   return {id,site:seller.site_id};
  });
  return sellerCheck.value;
 }
 async function collectorId(){
  return live()?(await commercialSeller()).id:String(env('MP_COLLECTOR_ID'));
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
  const catalogue=Object.entries(PLAN_KEYS).map(([plan,key])=>({plan,key,trial:false}));
  if(env('CACHASTE_MP_TRIAL_ENABLED')==='true'&&env('MP_PLAN_MONTHLY_TRIAL'))catalogue.push({plan:'mensual',key:'MONTHLY_TRIAL',trial:true});
  const sandboxIds=new Set([...Object.values(PLAN_KEYS),'MONTHLY_TRIAL'].map(key=>env('MP_TEST_PLAN_'+key)));
  const configuredIds=catalogue.map(({key})=>env('MP_PLAN_'+key));
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
   return {key,id,applicationId:remote.application_id==null?null:String(remote.application_id),...MP_PLANS[plan],trialDays:trial?7:0};
  }));
  return {seller,plans};
 }
 async function commercialReadiness(){
  const {seller,plans}=await commercialCatalogue({refresh:true});
  const policy=await call('policy');
  return {
   seller,plans,webOrigin:webOrigin(),webhookSecretConfigured:signingReady(),separateCredentials:true,
   checkoutEnabled:env('CACHASTE_MP_ENABLED')==='true',taxReady:env('CACHASTE_MP_TAX_READY')==='true',
   databaseReady:policy.enabled===true,ready:ready()&&policy.enabled===true
  };
 }
 async function reconcile(id,requiredPaymentId=null,verifiedSeller){
  if(typeof id!=='string'||!PROVIDER_ID.test(id))throw Error('INVALID_PROVIDER_ID');
  const observedAt=now(),seller=verifiedSeller??await collectorId();
  const sub=await mp('/preapproval/'+id);
  if(sub.live_mode!=null&&sub.live_mode!==live())throw Error('SUBSCRIPTION_MISMATCH');
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
 async function billing(req){try{
  cors(req);if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors(req)});
  if(req.method!=='POST')return json(req,{error:'METHOD_NOT_ALLOWED'},405);
  if(Number(req.headers.get('content-length')||0)>8192)return json(req,{error:'PAYLOAD_TOO_LARGE'},413);
  const text=await req.text();if(text.length>8192)return json(req,{error:'PAYLOAD_TOO_LARGE'},413);const body=JSON.parse(text||'{}');
  if(body.action==='status'){
   let enabled=ready()&&(await call('policy')).enabled===true;
   let trialAvailable=false;
   if(enabled&&live()){
    try{trialAvailable=(await commercialCatalogue()).plans.some(plan=>plan.trialDays===7);}
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
   if(!Object.hasOwn(PLAN_KEYS,body.plan)||!UUID.test(body.requestId||''))throw Error('INVALID_PLAN');await call('rate',{userId:user.id});
   const trial=body.plan==='mensual'&&!state.trialUsed&&env('CACHASTE_MP_TRIAL_ENABLED')==='true'&&!!env('MP_PLAN_MONTHLY_TRIAL');
   const key=trial?'MONTHLY_TRIAL':PLAN_KEYS[body.plan];
   const catalog=live()?await commercialCatalogue():null;
   const seller=catalog?.seller.id??await collectorId();
   const planId=catalog?catalog.plans.find(plan=>plan.key===key)?.id:env('MP_PLAN_'+key);
   await providerPlan(body.plan,planId,seller,trial);
   const checkout=await call('checkout',{id:body.requestId,userId:user.id,plan:body.plan,providerPlanId:planId,trial,linkedPlan:false});
   if(checkout.provider_id){const current=await mp('/preapproval/'+checkout.provider_id);return json(req,{checkoutUrl:checkoutUrl(current.init_point),id:checkout.provider_id});}
   if(!checkout.created)return json(req,{error:'CHECKOUT_PENDING'},409);
   if(checkout.provider_plan_id!==planId)await providerPlan(body.plan,checkout.provider_plan_id,seller,checkout.trial_offered);
   // Associated plans require a card token. A hosted pending checkout instead
   // copies the verified server catalogue recurrence, keeping card data at MP.
   const p=MP_PLANS[body.plan],auto_recurring={frequency:p.frequency,frequency_type:p.frequency_type,transaction_amount:p.amount,currency_id:'CLP',...(checkout.trial_offered?{start_date:new Date(now()+7*86400000).toISOString()}:{})};
   let sub;try{sub=await mp('/preapproval',{method:'POST',headers:{'X-Idempotency-Key':body.requestId},body:JSON.stringify({auto_recurring,external_reference:body.requestId,payer_email:user.email,reason:'¿Cachaste? · '+body.plan,back_url:webOrigin()+'/cuenta.html?checkout=return',status:'pending'})});}catch(error){if([400,401,403,404,422].includes(error.providerStatus))await call('checkout_failed',{id:body.requestId,userId:user.id,status:error.providerStatus});throw error;}
   await call('attach',{id:body.requestId,userId:user.id,providerId:String(sub.id)});
   return json(req,{checkoutUrl:checkoutUrl(sub.init_point),id:String(sub.id)});
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
  if(queryType&&queryType!==body.type)throw Error('EVENT_ID_MISMATCH');
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
