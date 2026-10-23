import {accountId,sha256,validToken,evaluateSubscription,unbase64,encryptToken,decryptToken,googleAccessToken,fetchSubscription,acknowledgeSubscription} from './play-verifier.mjs';
const allowedOrigins=new Set(['https://appassets.androidplatform.net','https://josevillablanca30.github.io']);
async function body(req){
 if(!req.headers.get('content-type')?.startsWith('application/json'))throw Error('INVALID_REQUEST');
 const reader=req.body?.getReader();if(!reader)throw Error('INVALID_REQUEST');let bytes=0;const chunks=[];
 while(true){const r=await reader.read();if(r.done)break;bytes+=r.value.length;if(bytes>12288){await reader.cancel();throw Error('INVALID_REQUEST');}chunks.push(r.value);}
 const merged=new Uint8Array(bytes);let at=0;for(const c of chunks){merged.set(c,at);at+=c.length;}return JSON.parse(new TextDecoder().decode(merged));
}
export function createPlayHandler({env,createClient,fetcher=fetch,now=()=>Date.now()}){
 let cachedToken=null,tokenExpires=0;
 return async req=>{
  const origin=req.headers.get('origin'),headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin'};
  if(origin&&allowedOrigins.has(origin))Object.assign(headers,{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, GET, OPTIONS'});
  const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers});
  if(origin&&!allowedOrigins.has(origin))return reply(403,{error:'ORIGIN_DENIED'});
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
  const configured=env('CACHASTE_PLAY_ENABLED')==='true'&&!!env('GOOGLE_PLAY_SERVICE_ACCOUNT')&&!!env('PLAY_RECEIPT_ENCRYPTION_KEY');
  if(req.method==='GET')return reply(200,{ready:configured,packageName:'cl.preparatupaes.app',productId:'cachaste_premium'});
  if(req.method!=='POST')return reply(405,{error:'METHOD_NOT_ALLOWED'});
  if(!req.headers.get('authorization')?.match(/^Bearer [^\s]+$/))return reply(401,{error:'AUTH_REQUIRED'});
  if(!configured)return reply(503,{error:'BILLING_NOT_CONFIGURED'});
  try{
   const payload=await body(req),authorization=req.headers.get('authorization');
   const client=createClient(env('SUPABASE_URL'),env('SUPABASE_ANON_KEY'),{global:{headers:{Authorization:authorization}},auth:{persistSession:false,autoRefreshToken:false}});
   const auth=await client.auth.getUser(authorization.slice(7));if(auth.error||!auth.data?.user||auth.data.user.is_anonymous)return reply(401,{error:'AUTH_REQUIRED'});
   const userId=auth.data.user.id,profile=await client.rpc('cachaste_competition',{operation:'profile',payload:{}});
   if(profile.error)return reply(401,{error:'AUTH_REQUIRED'}); // Also checks the live Auth session, including deletion/revocation.
   const admin=createClient(env('SUPABASE_URL'),env('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false,autoRefreshToken:false}});
   const call=async(operation,values)=>{const r=await admin.rpc('cachaste_play_admin',{operation,payload:values});if(r.error)throw Error(r.error.message==='RECEIPT_ALREADY_LINKED'?'RECEIPT_ALREADY_LINKED':'SERVER_UNAVAILABLE');return r.data;};
   const key=unbase64(env('PLAY_RECEIPT_ENCRYPTION_KEY'));if(key.length!==32)throw Error('BILLING_NOT_CONFIGURED');
   const verify=async(token,existing=null)=>{
    if(!validToken(token))throw Error('INVALID_RECEIPT');
    const hash=await sha256(token),linked=existing||await call('lookup',{hash});
    if(linked&&linked.user_id!==userId)throw Error('RECEIPT_ALREADY_LINKED');
    if(!cachedToken||now()>tokenExpires){cachedToken=await googleAccessToken(JSON.parse(env('GOOGLE_PLAY_SERVICE_ACCOUNT')),fetcher,now());tokenExpires=now()+50*60000;}
    const observedAt=new Date(now()).toISOString();let verdict;
    try{verdict=evaluateSubscription(await fetchSubscription(token,cachedToken,fetcher),await accountId(userId),{now:now(),allowTestPurchases:env('CACHASTE_PLAY_ALLOW_LICENSE_TESTS')==='true'});}
    catch(e){if(e.message!=='RECEIPT_NOT_FOUND'||!linked)throw e;verdict={productId:linked.product_id,basePlan:linked.base_plan,state:'SUBSCRIPTION_STATE_EXPIRED',expiresAt:observedAt,testPurchase:linked.test_purchase,autoRenewing:false,acknowledged:false,entitled:false};}
    if(verdict.entitled&&!verdict.acknowledged){await acknowledgeSubscription(token,cachedToken,fetcher);verdict.acknowledged=true;}
    const encrypted=linked?{ciphertext:linked.token_ciphertext,iv:linked.token_iv}:await encryptToken(token,key);
    return call('apply',{...verdict,...encrypted,userId,hash,observedAt});
   };
   let result;
   if(payload.action==='refresh'){
    const receipts=await call('receipts',{userId});result={premium:profile.data?.premium===true};
    const stale=receipts.filter(receipt=>Date.parse(receipt.checked_at)<now()-5*60000);
    // Opening a screen with recently verified receipts must not consume the purchase-verification quota.
    if(stale.length)await call('rate',{userId});
    for(const receipt of stale)result=await verify(await decryptToken(receipt,key),receipt);
   }else if(payload.action==='verify'&&validToken(payload.purchaseToken)){await call('rate',{userId});result=await verify(payload.purchaseToken);}
   else return reply(400,{error:'INVALID_REQUEST'});
   return reply(200,result);
  }catch(e){
   const known=new Set(['INVALID_REQUEST','INVALID_RECEIPT','ACCOUNT_MISMATCH','PRODUCT_MISMATCH','INVALID_EXPIRY','LICENSE_TEST_DISABLED','RECEIPT_ALREADY_LINKED','RECEIPT_NOT_FOUND']);
   const error=known.has(e.message)?e.message:'VERIFICATION_UNAVAILABLE';
   return reply(known.has(e.message)?(e.message==='RECEIPT_ALREADY_LINKED'?409:400):503,{error});
  }
 };
}
