import{MP_PLANS,validatePlan,checkoutUrl,canonicalSubscription,verifyMpSignature,csvReport}from'./mercadopago-core.mjs';
const UUID=/^[a-f\d]{8}-[a-f\d]{4}-[1-5][a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
export function createMercadoPagoHandlers({env,createClient,fetcher=fetch,now=()=>Date.now()}){
 const supabaseUrl=()=>env('SUPABASE_URL'),anon=()=>env('SUPABASE_ANON_KEY')||env('SUPABASE_PUBLISHABLE_KEY');
 const ready=()=>env('CACHASTE_MP_ENABLED')==='true'&&env('CACHASTE_MP_TAX_READY')==='true'&&((env('CACHASTE_MP_MODE')==='production'&&/^APP_USR-/.test(env('MP_ACCESS_TOKEN')||''))||(env('CACHASTE_MP_MODE')==='test'&&/^TEST-/.test(env('MP_ACCESS_TOKEN')||'')))&&!!env('MP_COLLECTOR_ID')&&!!env('MP_WEBHOOK_SECRET')&&!!env('CACHASTE_WEB_ORIGIN')&&['WEEKLY','MONTHLY','YEARLY'].every(x=>!!env('MP_PLAN_'+x));
 const live=()=>env('CACHASTE_MP_MODE')==='production';
 function cors(req){const origin=req.headers.get('origin'),allowed=env('CACHASTE_WEB_ORIGIN');if(origin&&origin!==allowed)throw Error('ORIGIN_DENIED');return{...(origin?{'access-control-allow-origin':origin,'vary':'Origin'}:{}),'access-control-allow-headers':'authorization,apikey,content-type,x-client-info','access-control-allow-methods':'POST,OPTIONS','cache-control':'no-store'};}
 const json=(req,data,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors(req),'content-type':'application/json'}});
 const admin=()=>createClient(supabaseUrl(),env('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false,autoRefreshToken:false}});
 const call=async(op,payload={})=>{const{data,error}=await admin().rpc('cachaste_web_billing_admin',{operation:op,payload});if(error)throw error;return data;};
 async function auth(req){const token=req.headers.get('authorization')?.replace(/^Bearer /i,'');if(!token)throw Error('AUTH_REQUIRED');const sdk=createClient(supabaseUrl(),anon(),{global:{headers:{Authorization:'Bearer '+token}},auth:{persistSession:false,autoRefreshToken:false}});const{data,error}=await sdk.auth.getUser(token);if(error||!data?.user)throw Error('AUTH_REQUIRED');const state=await sdk.rpc('cachaste_web_account');if(state.error)throw Error('AUTH_REQUIRED');return{user:data.user,state:state.data};}
 async function mp(path,options={}){if(!path.startsWith('/'))throw Error('INVALID_PROVIDER_PATH');const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);try{const res=await fetcher('https://api.mercadopago.com'+path,{...options,signal:controller.signal,headers:{authorization:'Bearer '+env('MP_ACCESS_TOKEN'),'content-type':'application/json',...options.headers}});if(!res.ok)throw Error('PAYMENT_PROVIDER_UNAVAILABLE');return await res.json();}finally{clearTimeout(timer);}}
 async function reconcile(id,reference=null){
  if(!/^[a-zA-Z0-9_-]{1,100}$/.test(id))throw Error('INVALID_PROVIDER_ID');
  const sub=await mp('/preapproval/'+id),checkout=await call('lookup',{providerId:id,reference:reference||sub.external_reference});if(!checkout)throw Error('UNKNOWN_CHECKOUT');
  if(!checkout.provider_id){await call('attach',{id:checkout.id,userId:checkout.user_id,providerId:id});checkout.provider_id=id;}
  const existing=(await call('subscriptions',{userId:checkout.user_id})).find(s=>s.provider_id===id);
  const charges=await mp('/authorized_payments/search?preapproval_id='+encodeURIComponent(id)+'&limit=50');
  const records=charges.results||[],payments=[];
  if(records.length>=50)throw Error('PAYMENT_RECONCILIATION_LIMIT');
  for(const charge of records)if(charge.payment?.id){if(!/^\d+$/.test(String(charge.payment.id)))throw Error('INVALID_PAYMENT_ID');payments.push(await mp('/v1/payments/'+charge.payment.id));}
  const canonical=canonicalSubscription(sub,checkout,records,payments,{now:now(),collectorId:env('MP_COLLECTOR_ID'),liveMode:live(),existing});
  return call('apply',canonical);
 }
 async function billing(req){try{
  cors(req);if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors(req)});
  if(req.method!=='POST')return json(req,{error:'METHOD_NOT_ALLOWED'},405);
  if(Number(req.headers.get('content-length')||0)>8192)return json(req,{error:'PAYLOAD_TOO_LARGE'},413);
  const text=await req.text();if(text.length>8192)return json(req,{error:'PAYLOAD_TOO_LARGE'},413);const body=JSON.parse(text||'{}');
  if(body.action==='status'){const enabled=ready()&&(await call('policy')).enabled===true;let trialAvailable=false;if(enabled&&env('CACHASTE_MP_TRIAL_ENABLED')==='true'&&env('MP_PLAN_MONTHLY_TRIAL')){try{const planId=env('MP_PLAN_MONTHLY_TRIAL');validatePlan(await mp('/preapproval_plan/'+encodeURIComponent(planId)),'mensual',planId,{trial:true,collectorId:env('MP_COLLECTOR_ID')});trialAvailable=true;}catch{}}return json(req,{ready:enabled,trialAvailable});}
  const{user,state}=await auth(req);
  if(!ready())return json(req,{error:'BILLING_NOT_READY',ready:false},503);
  if(!live()&&env('CACHASTE_MP_ALLOW_TEST_PURCHASES')!=='true')throw Error('TEST_PURCHASES_DISABLED');
  if(body.action==='checkout'){
   if(!MP_PLANS[body.plan]||!UUID.test(body.requestId||''))throw Error('INVALID_PLAN');await call('rate',{userId:user.id});
   const trial=body.plan==='mensual'&&!state.trialUsed&&env('CACHASTE_MP_TRIAL_ENABLED')==='true'&&!!env('MP_PLAN_MONTHLY_TRIAL');
   const planId=env(trial?'MP_PLAN_MONTHLY_TRIAL':'MP_PLAN_'+{semanal:'WEEKLY',mensual:'MONTHLY',anual:'YEARLY'}[body.plan]);
   const plan=await mp('/preapproval_plan/'+encodeURIComponent(planId));validatePlan(plan,body.plan,planId,{trial,collectorId:env('MP_COLLECTOR_ID')});
   const checkout=await call('checkout',{id:body.requestId,userId:user.id,plan:body.plan,providerPlanId:planId,trial});
   if(checkout.provider_id){const current=await mp('/preapproval/'+checkout.provider_id);return json(req,{checkoutUrl:checkoutUrl(current.init_point),id:checkout.provider_id});}
   if(!checkout.created)return json(req,{error:'CHECKOUT_PENDING'},409);
   const sub=await mp('/preapproval',{method:'POST',headers:{'X-Idempotency-Key':body.requestId},body:JSON.stringify({preapproval_plan_id:planId,external_reference:body.requestId,payer_email:user.email,reason:'¿Cachaste? · '+body.plan,back_url:env('CACHASTE_WEB_ORIGIN')+'/cuenta.html?checkout=return',status:'pending'})});
   await call('attach',{id:body.requestId,userId:user.id,providerId:String(sub.id)});
   return json(req,{checkoutUrl:checkoutUrl(sub.init_point),id:String(sub.id)});
  }
  if(body.action==='refresh'){await call('rate',{userId:user.id});const rows=await call('subscriptions',{userId:user.id});for(const sub of rows)await reconcile(sub.provider_id);return json(req,{refreshed:true});}
  if(body.action==='cancel'){
   const rows=await call('subscriptions',{userId:user.id}),sub=rows.find(s=>s.provider_id===body.subscriptionId);if(!sub)throw Error('NOT_FOUND');
   await mp('/preapproval/'+sub.provider_id,{method:'PUT',body:JSON.stringify({status:'cancelled'})});await reconcile(sub.provider_id);return json(req,{cancelled:true});
  }
  if(body.action==='sales'){
   const admins=(env('CACHASTE_WEB_ADMIN_IDS')||'').split(',').filter(Boolean);if(!admins.includes(user.id))throw Error('FORBIDDEN');
   const from=Date.parse(body.from),to=Date.parse(body.to);if(!Number.isFinite(from)||!Number.isFinite(to)||to<=from||to-from>367*86400000)throw Error('INVALID_REPORT_RANGE');
   const report=await call('sales',{from:new Date(from).toISOString(),to:new Date(to).toISOString()});return new Response(csvReport(report.rows),{headers:{...cors(req),'content-type':'text/csv; charset=utf-8','content-disposition':'attachment; filename="cachaste-ventas-comisiones.csv"'}});
  }
  throw Error('INVALID_OPERATION');
 }catch(e){const key=String(e?.message||'REQUEST_FAILED'),status=/AUTH_REQUIRED/.test(key)?401:/FORBIDDEN|ORIGIN_DENIED/.test(key)?403:/PROVIDER_UNAVAILABLE/.test(key)?503:400;try{return json(req,{error:/^[A-Z_]+$/.test(key)?key:'REQUEST_FAILED'},status);}catch{return new Response('Forbidden',{status:403});}}}
 async function webhook(req){try{
  if(req.method!=='POST')return new Response(null,{status:405});if(!ready())return new Response('Billing disabled',{status:503});
  const signature=await verifyMpSignature(req,env('MP_WEBHOOK_SECRET'),now());
  if((await call('webhook_seen',{hash:signature.hash})).seen)return new Response(null,{status:200});
  const text=await req.text();if(text.length>16384)throw Error('PAYLOAD_TOO_LARGE');const body=JSON.parse(text);
  if(String(body.data?.id)!==signature.id)throw Error('EVENT_ID_MISMATCH');
  let id;if(body.type==='subscription_preapproval')id=signature.id;
  else if(body.type==='subscription_authorized_payment'){const charge=await mp('/authorized_payments/'+signature.id);id=String(charge.preapproval_id);}
  else if(body.type==='payment'){const payment=await mp('/v1/payments/'+signature.id);if(!payment.external_reference)throw Error('UNKNOWN_CHECKOUT');const checkout=await call('lookup',{reference:payment.external_reference});id=checkout?.provider_id;if(!id)throw Error('UNKNOWN_CHECKOUT');}
  else return new Response(null,{status:200});
  await reconcile(id);await call('webhook',{hash:signature.hash});return new Response(null,{status:200});
 }catch(e){return new Response(/SIGNATURE|EVENT_ID/.test(String(e?.message))?'Invalid notification':'Notification not processed',{status:/SIGNATURE|EVENT_ID/.test(String(e?.message))?401:503});}}
 return{billing,webhook};
}
