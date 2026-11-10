import {MP_PLANS,validatePlan,checkoutUrl,canonicalSubscription,verifyMpSignature,subscriptionInvoices,subscriptionPayments} from './mercadopago-core.mjs';
const UUID=/^[a-f\d]{8}-[a-f\d]{4}-[1-5][a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
const choices={WEEKLY:{plan:'semanal'},MONTHLY:{plan:'mensual'},YEARLY:{plan:'anual'},MONTHLY_TRIAL:{plan:'mensual',trial:true}};
export function createSandboxHandlers({env,createClient,fetcher=fetch,now=()=>Date.now()}){
 const client=(key,token)=>createClient(env('SUPABASE_URL'),key,{auth:{persistSession:false,autoRefreshToken:false},...(token?{global:{headers:{Authorization:'Bearer '+token}}}:{})});
 const call=async(operation,payload={})=>{const {data,error}=await client(env('SUPABASE_SERVICE_ROLE_KEY')).rpc('cachaste_mp_sandbox_admin',{operation,payload});if(error)throw Error(error.message);return data;};
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
  const response=await fetcher('https://api.mercadopago.com'+path,{method,headers:{authorization:'Bearer '+env('MP_TEST_ACCESS_TOKEN'),'content-type':'application/json',...(requestId?{'X-Idempotency-Key':requestId}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(12000)});
  const data=await response.json().catch(()=>({}));
  if(!response.ok){console.error('MP_SANDBOX_PROVIDER_ERROR',JSON.stringify({status:response.status,operation:path.split('?')[0].replace(/\/[a-f0-9]{20,}/g,'/:id')}));throw Error('PROVIDER_CHECKOUT_FAILED');}return data;
 }
 async function seller(){
  if(env('MP_TEST_MODE')!=='test'||!env('MP_TEST_ACCESS_TOKEN')||!/^\d+$/.test(env('MP_TEST_COLLECTOR_ID')||''))throw Error('TEST_CONFIG_MISSING');
  const me=await mp('/users/me');if(String(me.id)!==String(env('MP_TEST_COLLECTOR_ID'))||!me.tags?.includes('test_user')||me.site_id!=='MLC')throw Error('NOT_TEST_SELLER');
 }
 async function catalogue(key){
  const c=choices[key];if(!c)throw Error('INVALID_PLAN');const id=env('MP_TEST_PLAN_'+key);if(!id)throw Error('TEST_CONFIG_MISSING');
  const remote=await mp('/preapproval_plan/'+encodeURIComponent(id));validatePlan(remote,c.plan,id,{trial:!!c.trial,collectorId:env('MP_TEST_COLLECTOR_ID')});return {...c,id};
 }
 async function reconcile(row){
  const sub=await mp('/preapproval/'+encodeURIComponent(row.provider_id));
  const authorized=await subscriptionInvoices(mp,row.provider_id),payments=await subscriptionPayments(mp,authorized);
  const snapshot=canonicalSubscription(sub,row,authorized,payments,{now:now(),collectorId:env('MP_TEST_COLLECTOR_ID'),liveMode:false,existing:row.snapshot?{trial_until:row.snapshot.trialUntil}:null});
  await call('apply',{id:row.id,userId:row.user_id,snapshot});return snapshot;
 }
 async function billing(req){try{
  cors(req);if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors(req)});if(req.method!=='POST')return reply(req,{error:'METHOD_NOT_ALLOWED'},405);
  const user=await authenticate(req),text=await req.text();if(text.length>8192)throw Error('PAYLOAD_TOO_LARGE');
  const body=JSON.parse(text||'{}');if(!['status','checkout','refresh','cancel'].includes(body.action))throw Error('INVALID_ACTION');
  await seller();
  if(body.action==='status'){
   const plans=[];for(const key of Object.keys(choices)){const c=await catalogue(key);plans.push({key,plan:c.plan,...MP_PLANS[c.plan],trialDays:c.trial?7:0});}
   return reply(req,{ready:true,mode:'sandbox',productionEnabled:false,webhookConfigured:!!env('MP_TEST_WEBHOOK_SECRET'),plans,subscriptions:await call('list',{userId:user.id})});
  }
  if(body.action==='checkout'){
   const c=await catalogue(body.plan),email=String(body.payerEmail||env('MP_TEST_BUYER_EMAIL')||'').trim();
   if(!/^[^\s@]{1,200}@testuser\.(com|cl)$/i.test(email))throw Error('TEST_BUYER_EMAIL_REQUIRED');
   if(!UUID.test(body.requestId||''))throw Error('INVALID_REQUEST_ID');
   const row=await call('reserve',{id:body.requestId,userId:user.id,plan:c.plan,providerPlanId:c.id,trial:!!c.trial});
   if(row.provider_id){const existing=await mp('/preapproval/'+encodeURIComponent(row.provider_id));if(existing.status!=='pending')throw Error('CHECKOUT_ALREADY_FINISHED');return reply(req,{id:row.provider_id,checkoutUrl:checkoutUrl(existing.init_point),mode:'sandbox'});}
   if(!row.created)throw Error('CHECKOUT_PENDING');
   const p=MP_PLANS[c.plan],auto_recurring={frequency:p.frequency,frequency_type:p.frequency_type,transaction_amount:p.amount,currency_id:'CLP',...(c.trial?{start_date:new Date(now()+7*86400000).toISOString()}:{})};
   const sub=await mp('/preapproval',{method:'POST',requestId:row.id,body:{auto_recurring,external_reference:row.id,payer_email:email,reason:'Cachaste QA '+c.plan,back_url:'https://sitecacho.cl/cuenta.html?qa=mp&checkout=return',status:'pending'}});
   await call('attach',{id:row.id,userId:user.id,providerId:String(sub.id)});
   return reply(req,{checkoutUrl:checkoutUrl(sub.init_point),id:String(sub.id),mode:'sandbox',notice:'QA_ONLY_NOT_APP_ENTITLEMENT'});
  }
  const rows=await call('list',{userId:user.id});
  if(body.action==='cancel'){
   const row=rows.find(r=>r.provider_id===body.subscriptionId);if(!row)throw Error('NOT_FOUND');
   const remote=await mp('/preapproval/'+encodeURIComponent(row.provider_id));
   canonicalSubscription(remote,row,[],[],{now:now(),collectorId:env('MP_TEST_COLLECTOR_ID'),liveMode:false});
   if(!['cancelled','canceled'].includes(remote.status))await mp('/preapproval/'+encodeURIComponent(row.provider_id),{method:'PUT',body:{status:'cancelled'}});
   const snapshot=await reconcile(row);return reply(req,{cancelled:['cancelled','canceled'].includes(snapshot.status),snapshot,mode:'sandbox'});
  }
  const snapshots=[];for(const row of rows)if(row.provider_id)snapshots.push(await reconcile(row));return reply(req,{refreshed:true,snapshots,mode:'sandbox'});
 }catch(e){const raw=String(e?.message||''),code=/^[A-Z_]+$/.test(raw)?raw:'SERVICE_UNAVAILABLE',status=code==='AUTH_REQUIRED'?401:/QA_ADMIN_REQUIRED|ORIGIN_NOT_ALLOWED/.test(code)?403:/CONFIG|NOT_TEST_SELLER/.test(code)?503:/PROVIDER/.test(code)?502:/PENDING|FINISHED/.test(code)?409:400;try{return reply(req,{error:code},status);}catch{return new Response('Forbidden',{status:403});}}}
 async function webhook(req){try{
  if(req.method!=='POST')return new Response(null,{status:405});
  const secret=env('MP_TEST_WEBHOOK_SECRET');if(!secret)return new Response('Sandbox webhook not configured',{status:503});
  const signature=await verifyMpSignature(req,secret,now()),text=await req.text();if(text.length>16384)throw Error('PAYLOAD_TOO_LARGE');const body=JSON.parse(text);
  if(String(body.data?.id)!==signature.id)throw Error('EVENT_ID_MISMATCH');
  if((await call('seen',{hash:signature.hash})).seen)return new Response(null,{status:200});await seller();
  let id;if(body.type==='subscription_preapproval')id=signature.id;
  else if(body.type==='subscription_authorized_payment')id=(await mp('/authorized_payments/'+encodeURIComponent(signature.id))).preapproval_id;
  else if(body.type==='payment'){
   const payment=await mp('/v1/payments/'+encodeURIComponent(signature.id));const checkout=await call('lookup',{reference:payment.external_reference});id=checkout?.provider_id;
  }else return new Response(null,{status:200});
  const row=id?await call('lookup',{providerId:String(id)}):null;
  if(!row)return new Response(null,{status:200});
  await reconcile(row);await call('seen',{hash:signature.hash,record:true});return new Response(null,{status:200});
 }catch(e){const code=String(e?.message||'');console.error('MP_SANDBOX_WEBHOOK_ERROR',/^[A-Z_]+$/.test(code)?code:'INTERNAL_ERROR');return new Response('Notification not processed',{status:/SIGNATURE|EVENT_ID/.test(code)?401:503});}}
 return {billing,webhook};
}
