import{MP_PLANS,validatePlan,checkoutUrl,canonicalSubscription,verifyMpSignature,csvReport,chileDateRange,subscriptionInvoices,subscriptionPayments,paymentInvoices}from'./mercadopago-core.mjs';
const UUID=/^[a-f\d]{8}-[a-f\d]{4}-[1-5][a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
const PROVIDER_ID=/^[a-zA-Z0-9_-]{1,100}$/;
export function createMercadoPagoHandlers({env,createClient,fetcher=fetch,now=()=>Date.now()}){
 const supabaseUrl=()=>env('SUPABASE_URL'),anon=()=>env('SUPABASE_ANON_KEY')||env('SUPABASE_PUBLISHABLE_KEY');
 const configured=()=>!!env('MP_COLLECTOR_ID')&&((env('CACHASTE_MP_MODE')==='production'&&/^APP_USR-/.test(env('MP_ACCESS_TOKEN')||''))||(env('CACHASTE_MP_MODE')==='test'&&/^(TEST-|APP_USR-)/.test(env('MP_ACCESS_TOKEN')||'')&&!!env('MP_TEST_COLLECTOR_ID')&&String(env('MP_COLLECTOR_ID'))===String(env('MP_TEST_COLLECTOR_ID'))&&!!env('MP_TEST_ACCESS_TOKEN')&&env('MP_ACCESS_TOKEN')===env('MP_TEST_ACCESS_TOKEN')));
 const webOrigin=()=>{try{const value=new URL(env('CACHASTE_WEB_ORIGIN'));return value.protocol==='https:'&&value.pathname==='/'&&!value.search&&!value.hash?value.origin:null;}catch{return null;}};
 const ready=()=>configured()&&env('CACHASTE_MP_ENABLED')==='true'&&env('CACHASTE_MP_TAX_READY')==='true'&&!!env('MP_WEBHOOK_SECRET')&&!!webOrigin()&&(env('CACHASTE_MP_MODE')!=='production'||new URL(webOrigin()).hostname.endsWith('.cl'))&&['WEEKLY','MONTHLY','YEARLY'].every(x=>!!env('MP_PLAN_'+x));
 const live=()=>env('CACHASTE_MP_MODE')==='production';
 function cors(req){const origin=req.headers.get('origin'),allowed=webOrigin();if(origin&&origin!==allowed)throw Error('ORIGIN_DENIED');return{...(origin?{'access-control-allow-origin':origin,'vary':'Origin'}:{}),'access-control-allow-headers':'authorization,apikey,content-type,x-client-info','access-control-allow-methods':'POST,OPTIONS','cache-control':'no-store'};}
 const json=(req,data,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors(req),'content-type':'application/json'}});
 const admin=()=>createClient(supabaseUrl(),env('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false,autoRefreshToken:false}});
 const call=async(op,payload={})=>{const{data,error}=await admin().rpc('cachaste_web_billing_admin',{operation:op,payload});if(error)throw error;return data;};
 async function auth(req){const token=req.headers.get('authorization')?.replace(/^Bearer /i,'');if(!token)throw Error('AUTH_REQUIRED');const sdk=createClient(supabaseUrl(),anon(),{global:{headers:{Authorization:'Bearer '+token}},auth:{persistSession:false,autoRefreshToken:false}});const{data,error}=await sdk.auth.getUser(token);if(error||!data?.user)throw Error('AUTH_REQUIRED');const state=await sdk.rpc('cachaste_web_account');if(state.error)throw Error('AUTH_REQUIRED');return{user:data.user,state:state.data};}
 async function mp(path,options={}){if(!path.startsWith('/'))throw Error('INVALID_PROVIDER_PATH');const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);try{const res=await fetcher('https://api.mercadopago.com'+path,{...options,signal:controller.signal,headers:{authorization:'Bearer '+env('MP_ACCESS_TOKEN'),'content-type':'application/json',...options.headers}});if(!res.ok)throw Object.assign(Error('PAYMENT_PROVIDER_UNAVAILABLE'),{providerStatus:res.status});return await res.json();}finally{clearTimeout(timer);}}
 async function reconcile(id,requiredPaymentId=null){
  if(typeof id!=='string'||!PROVIDER_ID.test(id))throw Error('INVALID_PROVIDER_ID');
  const sub=await mp('/preapproval/'+id);
  if(sub.live_mode!=null&&sub.live_mode!==live())throw Error('SUBSCRIPTION_MISMATCH');
  if(!UUID.test(sub.external_reference||''))throw Error('UNKNOWN_CHECKOUT');
  const checkout=await call('lookup',{reference:sub.external_reference});
  if(!checkout)throw Error('UNKNOWN_CHECKOUT');
  if(checkout.provider_id&&checkout.provider_id!==id)throw Error('SUBSCRIPTION_MISMATCH');
  const existing=(await call('subscriptions',{userId:checkout.user_id})).find(s=>s.provider_id===id);
  const records=await subscriptionInvoices(mp,id);
  if(requiredPaymentId&&!records.some(record=>String(record.payment?.id)===requiredPaymentId))throw Error('INCOMPLETE_PAYMENT_HISTORY');
  const payments=await subscriptionPayments(mp,records);
  const canonical=canonicalSubscription(sub,{...checkout,provider_id:id},records,payments,{now:now(),collectorId:env('MP_COLLECTOR_ID'),liveMode:live(),existing});
  if(!checkout.provider_id)await call('attach',{id:checkout.id,userId:checkout.user_id,providerId:id});
  return call('apply',canonical);
 }
 async function billing(req){try{
  cors(req);if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors(req)});
  if(req.method!=='POST')return json(req,{error:'METHOD_NOT_ALLOWED'},405);
  if(Number(req.headers.get('content-length')||0)>8192)return json(req,{error:'PAYLOAD_TOO_LARGE'},413);
  const text=await req.text();if(text.length>8192)return json(req,{error:'PAYLOAD_TOO_LARGE'},413);const body=JSON.parse(text||'{}');
  if(body.action==='status'){const enabled=ready()&&(await call('policy')).enabled===true;let trialAvailable=false;if(enabled&&env('CACHASTE_MP_TRIAL_ENABLED')==='true'&&env('MP_PLAN_MONTHLY_TRIAL')){try{const planId=env('MP_PLAN_MONTHLY_TRIAL');validatePlan(await mp('/preapproval_plan/'+encodeURIComponent(planId)),'mensual',planId,{trial:true,collectorId:env('MP_COLLECTOR_ID')});trialAvailable=true;}catch{}}return json(req,{ready:enabled,trialAvailable,managementReady:configured()});}
  const{user,state}=await auth(req);
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
   if(!MP_PLANS[body.plan]||!UUID.test(body.requestId||''))throw Error('INVALID_PLAN');await call('rate',{userId:user.id});
   const trial=body.plan==='mensual'&&!state.trialUsed&&env('CACHASTE_MP_TRIAL_ENABLED')==='true'&&!!env('MP_PLAN_MONTHLY_TRIAL');
   const planId=env(trial?'MP_PLAN_MONTHLY_TRIAL':'MP_PLAN_'+{semanal:'WEEKLY',mensual:'MONTHLY',anual:'YEARLY'}[body.plan]);
   const plan=await mp('/preapproval_plan/'+encodeURIComponent(planId));validatePlan(plan,body.plan,planId,{trial,collectorId:env('MP_COLLECTOR_ID')});
   const checkout=await call('checkout',{id:body.requestId,userId:user.id,plan:body.plan,providerPlanId:planId,trial,linkedPlan:false});
   if(checkout.provider_id){const current=await mp('/preapproval/'+checkout.provider_id);return json(req,{checkoutUrl:checkoutUrl(current.init_point),id:checkout.provider_id});}
   if(!checkout.created)return json(req,{error:'CHECKOUT_PENDING'},409);
   if(checkout.provider_plan_id!==planId)validatePlan(await mp('/preapproval_plan/'+encodeURIComponent(checkout.provider_plan_id)),body.plan,checkout.provider_plan_id,{trial:checkout.trial_offered,collectorId:env('MP_COLLECTOR_ID')});
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
  if(req.method!=='POST')return new Response(null,{status:405});if(!configured()||!env('MP_WEBHOOK_SECRET')){console.error('MP_WEBHOOK_CONFIGURATION_INCOMPLETE',JSON.stringify({collectorId:!!env('MP_COLLECTOR_ID'),mode:env('CACHASTE_MP_MODE')||'unset',accessTokenFormat:env('CACHASTE_MP_MODE')==='production'?/^APP_USR-/.test(env('MP_ACCESS_TOKEN')||''):env('CACHASTE_MP_MODE')==='test'?/^TEST-/.test(env('MP_ACCESS_TOKEN')||''):false,webhookSecret:!!env('MP_WEBHOOK_SECRET')}));return new Response('Billing disabled',{status:503});}
  const signature=await verifyMpSignature(req,env('MP_WEBHOOK_SECRET'),now());
  if((await call('webhook_seen',{hash:signature.hash})).seen)return new Response(null,{status:200});
  const text=await req.text();if(text.length>16384)throw Error('PAYLOAD_TOO_LARGE');const body=JSON.parse(text);
  if(String(body.data?.id)!==signature.id)throw Error('EVENT_ID_MISMATCH');
  const queryType=new URL(req.url).searchParams.get('type');
  if(queryType&&queryType!==body.type)throw Error('EVENT_ID_MISMATCH');
  let id,paymentId=null;
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
   if(payment.live_mode!==live()||String(payment.collector_id)!==String(env('MP_COLLECTOR_ID')))return new Response(null,{status:200});
   const invoices=(await paymentInvoices(mp,signature.id)).filter(invoice=>String(invoice.payment?.id)===signature.id);
   if(invoices.length!==1||typeof invoices[0].preapproval_id!=='string')throw Error('PAYMENT_SUBSCRIPTION_NOT_MATCHED');
   id=invoices[0].preapproval_id;
   paymentId=signature.id;
  }
  else return new Response(null,{status:200});
  await reconcile(id,paymentId);await call('webhook',{hash:signature.hash});return new Response(null,{status:200});
 }catch(e){const code=String(e?.message||'UNKNOWN_ERROR');console.error('MP_WEBHOOK_PROCESSING_ERROR',/^[A-Z_]+$/.test(code)?code:'INTERNAL_ERROR');return new Response(/SIGNATURE|EVENT_ID/.test(code)?'Invalid notification':'Notification not processed',{status:/SIGNATURE|EVENT_ID/.test(code)?401:503});}}
 return{billing,webhook};
}
