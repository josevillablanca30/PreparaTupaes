import {accountId,sha256,validToken,evaluateSubscription,unbase64,googleAccessToken,fetchSubscription,acknowledgeSubscription,PACKAGE} from './play-verifier.mjs';
const decode=s=>unbase64(s.replaceAll('-','+').replaceAll('_','/'));
export async function verifyGooglePush(token,{audience,email,keys,now=Date.now()}){
 if(typeof token!=='string'||token.length>16384||!email||!audience)throw Error('PUSH_AUTH_REQUIRED');
 const [head,body,signature,...extra]=token.split('.');if(!signature||extra.length)throw Error('PUSH_AUTH_REQUIRED');
 const header=JSON.parse(new TextDecoder().decode(decode(head))),claims=JSON.parse(new TextDecoder().decode(decode(body)));
 if(header.alg!=='RS256'||!header.kid||!['https://accounts.google.com','accounts.google.com'].includes(claims.iss)||claims.aud!==audience||claims.email!==email||claims.email_verified!==true||typeof claims.sub!=='string'||!claims.sub||!Number.isInteger(claims.exp)||!Number.isInteger(claims.iat)||claims.exp<=claims.iat||claims.exp*1000<=now||claims.iat*1000>now+60000||claims.exp-claims.iat>3900)throw Error('PUSH_AUTH_REQUIRED');
 const jwk=keys.find(k=>k.kid===header.kid&&k.kty==='RSA');if(!jwk)throw Error('PUSH_AUTH_REQUIRED');
 const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
 if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode(signature),new TextEncoder().encode(head+'.'+body)))throw Error('PUSH_AUTH_REQUIRED');
 return claims;
}
export function createPlayEventsHandler({env,createClient,fetcher=fetch,now=()=>Date.now()}){
 let keys=[],keysExpire=0,access=null,accessExpires=0;
 return async req=>{
  const reply=(status,data)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
  if(req.method!=='POST')return reply(405,{error:'METHOD_NOT_ALLOWED'});
  if(env('CACHASTE_PLAY_ENABLED')!=='true'||!env('GOOGLE_PLAY_SERVICE_ACCOUNT')||!env('GOOGLE_PLAY_PUBSUB_EMAIL'))return reply(503,{error:'BILLING_NOT_CONFIGURED'});
  try{
   const token=req.headers.get('authorization')?.match(/^Bearer ([^\s]+)$/)?.[1];if(!token)return reply(401,{error:'PUSH_AUTH_REQUIRED'});
   if(now()>keysExpire){const r=await fetcher('https://www.googleapis.com/oauth2/v3/certs',{signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error('GOOGLE_UNAVAILABLE');keys=(await r.json()).keys||[];keysExpire=now()+3600000;}
   await verifyGooglePush(token,{audience:env('SUPABASE_URL')+'/functions/v1/cachaste-play-events',email:env('GOOGLE_PLAY_PUBSUB_EMAIL'),keys,now:now()});
  }catch{return reply(401,{error:'PUSH_AUTH_REQUIRED'});}
  try{
   const raw=await req.text();if(raw.length>16384)return reply(400,{error:'INVALID_NOTIFICATION'});
   const envelope=JSON.parse(raw),notification=JSON.parse(new TextDecoder().decode(unbase64(envelope.message?.data||'')));
   if(notification.packageName!==PACKAGE)return reply(400,{error:'PACKAGE_MISMATCH'});
   if(notification.testNotification)return reply(200,{accepted:true});
   const token=notification.subscriptionNotification?.purchaseToken;if(!validToken(token))return reply(400,{error:'INVALID_NOTIFICATION'});
   const admin=createClient(env('SUPABASE_URL'),env('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false,autoRefreshToken:false}});
   const call=async(operation,payload)=>{const r=await admin.rpc('cachaste_play_admin',{operation,payload});if(r.error)throw Error('SERVER_UNAVAILABLE');return r.data;};
   const hash=await sha256(token),receipt=await call('lookup',{hash});if(!receipt)return reply(202,{accepted:true}); // A new receipt must first be bound by its authenticated owner.
   const observedAt=new Date(now()).toISOString();
   if(!access||now()>accessExpires){access=await googleAccessToken(JSON.parse(env('GOOGLE_PLAY_SERVICE_ACCOUNT')),fetcher,now());accessExpires=now()+50*60000;}
   let verdict;
   try{verdict=evaluateSubscription(await fetchSubscription(token,access,fetcher),await accountId(receipt.user_id),{now:now(),allowTestPurchases:env('CACHASTE_PLAY_ALLOW_LICENSE_TESTS')==='true'});}
   catch(e){if(e.message!=='RECEIPT_NOT_FOUND')throw e;verdict={productId:receipt.product_id,basePlan:receipt.base_plan,state:'SUBSCRIPTION_STATE_EXPIRED',expiresAt:observedAt,testPurchase:receipt.test_purchase,autoRenewing:false,acknowledged:false,entitled:false};}
   if(verdict.entitled&&!verdict.acknowledged){await acknowledgeSubscription(token,access,fetcher);verdict.acknowledged=true;}
   await call('apply',{...verdict,userId:receipt.user_id,hash,observedAt,ciphertext:receipt.token_ciphertext,iv:receipt.token_iv});
   return reply(200,{accepted:true});
  }catch{return reply(503,{error:'VERIFICATION_UNAVAILABLE'});}
 };
}
