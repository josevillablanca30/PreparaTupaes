// Shared by the Edge Function and Node tests. No phone claim can grant access.
const encoder=new TextEncoder();
export const PRODUCT='cachaste_premium';
export const PACKAGE='cl.preparatupaes.app';
export const BASE_PLANS=new Set(['semanal','mensual','anual']);
export async function sha256(value){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value)))].map(n=>n.toString(16).padStart(2,'0')).join('');}
export const accountId=userId=>sha256('cachaste:'+userId.toLowerCase());
export function validToken(token){return typeof token==='string'&&token.length>=16&&token.length<=4096&&/^[\x21-\x7e]+$/.test(token);}
export function evaluateSubscription(purchase,expectedAccount,{now=Date.now(),allowTestPurchases=false}={}){
 if(!purchase||purchase.externalAccountIdentifiers?.obfuscatedExternalAccountId!==expectedAccount)throw Error('ACCOUNT_MISMATCH');
 if(purchase.testPurchase&&!allowTestPurchases)throw Error('LICENSE_TEST_DISABLED');
 const items=(purchase.lineItems||[]).filter(i=>i.productId===PRODUCT&&BASE_PLANS.has(i.offerDetails?.basePlanId)&&i.autoRenewingPlan);
 if(!items.length)throw Error('PRODUCT_MISMATCH');
 const item=items.sort((a,b)=>Date.parse(b.expiryTime)-Date.parse(a.expiryTime))[0],expires=Date.parse(item.expiryTime);
 const state=purchase.subscriptionState;
 if(!Number.isFinite(expires)&&!['SUBSCRIPTION_STATE_PENDING','SUBSCRIPTION_STATE_PENDING_PURCHASE_CANCELED'].includes(state))throw Error('INVALID_EXPIRY');
 const entitled=['SUBSCRIPTION_STATE_ACTIVE','SUBSCRIPTION_STATE_IN_GRACE_PERIOD','SUBSCRIPTION_STATE_CANCELED'].includes(state)&&expires>now;
 return {productId:PRODUCT,basePlan:item.offerDetails.basePlanId,state,expiresAt:new Date(Number.isFinite(expires)?expires:now).toISOString(),testPurchase:!!purchase.testPurchase,autoRenewing:item.autoRenewingPlan.autoRenewEnabled===true,acknowledged:purchase.acknowledgementState==='ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED',entitled};
}
export const base64=bytes=>btoa(String.fromCharCode(...new Uint8Array(bytes)));
export const unbase64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
export async function encryptToken(token,keyBytes){
 if(keyBytes.length!==32)throw Error('ENCRYPTION_KEY_REQUIRED');
 const key=await crypto.subtle.importKey('raw',keyBytes,'AES-GCM',false,['encrypt']),iv=crypto.getRandomValues(new Uint8Array(12));
 return {ciphertext:base64(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,encoder.encode(token))),iv:base64(iv)};
}
export async function decryptToken(row,keyBytes){
 const key=await crypto.subtle.importKey('raw',keyBytes,'AES-GCM',false,['decrypt']);
 return new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:unbase64(row.token_iv)},key,unbase64(row.token_ciphertext)));
}
const b64url=s=>base64(typeof s==='string'?encoder.encode(s):s).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
export async function googleAccessToken(serviceAccount,fetcher=fetch,now=Date.now()){
 if(!/^[^@]+@[^@]+\.iam\.gserviceaccount\.com$/.test(serviceAccount?.client_email||'')||!serviceAccount?.private_key)throw Error('GOOGLE_CREDENTIALS_REQUIRED');
 const head=b64url(JSON.stringify({alg:'RS256',typ:'JWT'})),body=b64url(JSON.stringify({iss:serviceAccount.client_email,scope:'https://www.googleapis.com/auth/androidpublisher',aud:'https://oauth2.googleapis.com/token',iat:Math.floor(now/1000),exp:Math.floor(now/1000)+3600}));
 const bytes=unbase64(serviceAccount.private_key.replace(/-----[^-]+-----|\s/g,''));
 const key=await crypto.subtle.importKey('pkcs8',bytes,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['sign']);
 const assertion=head+'.'+body+'.'+b64url(await crypto.subtle.sign('RSASSA-PKCS1-v1_5',key,encoder.encode(head+'.'+body)));
 const response=await fetcher('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion}),signal:AbortSignal.timeout(10000)});
 if(!response.ok)throw Error('GOOGLE_AUTH_UNAVAILABLE');
 const result=await response.json();if(!result.access_token)throw Error('GOOGLE_AUTH_UNAVAILABLE');return result.access_token;
}
export async function fetchSubscription(token,accessToken,fetcher=fetch){
 if(!validToken(token))throw Error('INVALID_RECEIPT');
 const url='https://androidpublisher.googleapis.com/androidpublisher/v3/applications/'+PACKAGE+'/purchases/subscriptionsv2/tokens/'+encodeURIComponent(token);
 const r=await fetcher(url,{headers:{Authorization:'Bearer '+accessToken},signal:AbortSignal.timeout(10000)});
 if(r.status===404||r.status===410)throw Error('RECEIPT_NOT_FOUND');
 if(!r.ok)throw Error('GOOGLE_UNAVAILABLE');return r.json();
}
export async function acknowledgeSubscription(token,accessToken,fetcher=fetch){
 const url='https://androidpublisher.googleapis.com/androidpublisher/v3/applications/'+PACKAGE+'/purchases/subscriptions/'+PRODUCT+'/tokens/'+encodeURIComponent(token)+':acknowledge';
 const r=await fetcher(url,{method:'POST',headers:{Authorization:'Bearer '+accessToken,'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(10000)});
 if(!r.ok)throw Error('ACKNOWLEDGEMENT_UNAVAILABLE');
}
