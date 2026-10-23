import {test} from 'node:test';
import assert from 'node:assert/strict';
import {accountId,evaluateSubscription,encryptToken,decryptToken,googleAccessToken,fetchSubscription,acknowledgeSubscription,base64,unbase64,validToken} from '../supabase/functions/_shared/play-verifier.mjs';
import {createPlayHandler} from '../supabase/functions/_shared/play-handler.mjs';
import {verifyGooglePush,createPlayEventsHandler} from '../supabase/functions/_shared/play-events.mjs';
const now=Date.now(),uuid='10000000-0000-4000-8000-000000000001',hash=await accountId(uuid);
const sample=()=>({externalAccountIdentifiers:{obfuscatedExternalAccountId:hash},subscriptionState:'SUBSCRIPTION_STATE_ACTIVE',acknowledgementState:'ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED',lineItems:[{productId:'cachaste_premium',offerDetails:{basePlanId:'mensual'},expiryTime:new Date(now+86400000).toISOString(),autoRenewingPlan:{autoRenewEnabled:true}}]});
test('Google subscription state, expiry and Auth account jointly determine access',()=>{
 assert.equal(evaluateSubscription(sample(),hash,{now}).entitled,true);
 for(const state of ['SUBSCRIPTION_STATE_PENDING','SUBSCRIPTION_STATE_ON_HOLD','SUBSCRIPTION_STATE_PAUSED','SUBSCRIPTION_STATE_EXPIRED','SUBSCRIPTION_STATE_PENDING_PURCHASE_CANCELED','unknown']){const p=sample();p.subscriptionState=state;assert.equal(evaluateSubscription(p,hash,{now}).entitled,false,state);}
 for(const state of ['SUBSCRIPTION_STATE_CANCELED','SUBSCRIPTION_STATE_IN_GRACE_PERIOD']){const p=sample();p.subscriptionState=state;p.lineItems[0].autoRenewingPlan.autoRenewEnabled=false;assert.equal(evaluateSubscription(p,hash,{now}).entitled,true);assert.equal(evaluateSubscription(p,hash,{now}).autoRenewing,false);}
 const expired=sample();expired.lineItems[0].expiryTime=new Date(now).toISOString();assert.equal(evaluateSubscription(expired,hash,{now}).entitled,false);
 assert.throws(()=>evaluateSubscription(sample(),'someone-else'),/ACCOUNT_MISMATCH/);
});
test('Unknown products/plans, invalid expiries and unapproved license tests cannot unlock access',()=>{
 for(const mutate of [p=>p.lineItems[0].productId='forged',p=>p.lineItems[0].offerDetails.basePlanId='free']){const p=sample();mutate(p);assert.throws(()=>evaluateSubscription(p,hash),/PRODUCT_MISMATCH/);}
 const bad=sample();bad.lineItems[0].expiryTime='not a date';assert.throws(()=>evaluateSubscription(bad,hash),/INVALID_EXPIRY/);
 const pending=sample();pending.subscriptionState='SUBSCRIPTION_STATE_PENDING';delete pending.lineItems[0].expiryTime;assert.equal(evaluateSubscription(pending,hash,{now}).entitled,false);
 const license=sample();license.testPurchase={};assert.throws(()=>evaluateSubscription(license,hash),/LICENSE_TEST_DISABLED/);assert.equal(evaluateSubscription(license,hash,{allowTestPurchases:true,now}).entitled,true);
});
test('Purchase tokens are encrypted with integrity; neither corruption nor a wrong key can be restored',async()=>{
 const key=crypto.getRandomValues(new Uint8Array(32)),token='a-private-google-receipt-token';
 const a=await encryptToken(token,key),b=await encryptToken(token,key);assert.notEqual(a.ciphertext,b.ciphertext);assert.ok(!a.ciphertext.includes(token));
 const row={token_ciphertext:a.ciphertext,token_iv:a.iv};assert.equal(await decryptToken(row,key),token);
 await assert.rejects(decryptToken(row,crypto.getRandomValues(new Uint8Array(32))));
 const corrupt=unbase64(a.ciphertext);corrupt[0]^=1;await assert.rejects(decryptToken({...row,token_ciphertext:base64(corrupt)},key));
 await assert.rejects(encryptToken(token,new Uint8Array(16)),/ENCRYPTION_KEY_REQUIRED/);
});
const rsa=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
const credentials={client_email:'verifier@cachaste.iam.gserviceaccount.com',private_key:'-----BEGIN PRIVATE KEY-----\n'+base64(await crypto.subtle.exportKey('pkcs8',rsa.privateKey))+'\n-----END PRIVATE KEY-----'};
test('Pub/Sub requires a verified Google signature, exact audience and permitted service-account identity',async()=>{
 const audience='https://project.supabase.co/functions/v1/cachaste-play-events',email='push@cachaste.iam.gserviceaccount.com';
 const jwk=await crypto.subtle.exportKey('jwk',rsa.publicKey);jwk.kid='test-google-key';
 const url64=value=>base64(new TextEncoder().encode(JSON.stringify(value))).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
 const head=url64({alg:'RS256',kid:jwk.kid}),payload=url64({iss:'https://accounts.google.com',aud:audience,email,email_verified:true,sub:'123',iat:Math.floor(now/1000),exp:Math.floor(now/1000)+3600});
 const signed=head+'.'+payload,sig=base64(await crypto.subtle.sign('RSASSA-PKCS1-v1_5',rsa.privateKey,new TextEncoder().encode(signed))).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
 const token=signed+'.'+sig,options={audience,email,keys:[jwk],now};assert.equal((await verifyGooglePush(token,options)).email,email);
 await assert.rejects(verifyGooglePush(token,{...options,email:'attacker@cachaste.iam.gserviceaccount.com'}),/PUSH_AUTH_REQUIRED/);
 await assert.rejects(verifyGooglePush(token,{...options,audience:audience+'-forged'}),/PUSH_AUTH_REQUIRED/);
 await assert.rejects(verifyGooglePush(token,{...options,now:now+4000000}),/PUSH_AUTH_REQUIRED/);
 await assert.rejects(verifyGooglePush(head+'.'+url64({aud:audience,email,premium:true})+'.'+sig,options),/PUSH_AUTH_REQUIRED/);
 const handler=createPlayEventsHandler({env:()=>undefined,createClient:()=>{throw Error('must stay closed');}});assert.equal((await handler(new Request('https://example.invalid',{method:'POST'}))).status,503);
});
test('Server signs the Google OAuth assertion and fixes the publisher API host and application',async()=>{
 let checked=false;
 const token=await googleAccessToken(credentials,async(url,request)=>{
  assert.equal(url,'https://oauth2.googleapis.com/token');const assertion=request.body.get('assertion'),[head,body,signature]=assertion.split('.');
  const decode=s=>unbase64(s.replaceAll('-','+').replaceAll('_','/'));
  const claims=JSON.parse(new TextDecoder().decode(decode(body)));assert.equal(claims.iss,credentials.client_email);assert.equal(claims.scope,'https://www.googleapis.com/auth/androidpublisher');assert.equal(claims.exp-claims.iat,3600);
  assert.equal(await crypto.subtle.verify('RSASSA-PKCS1-v1_5',rsa.publicKey,decode(signature),new TextEncoder().encode(head+'.'+body)),true);checked=true;return Response.json({access_token:'google-access'});
 },now);assert.equal(token,'google-access');assert.equal(checked,true);
 const receipt='opaque-token/with?reserved=characters';let seen;
 await fetchSubscription(receipt,token,async(url,request)=>{seen=url;assert.equal(request.headers.Authorization,'Bearer google-access');return Response.json(sample());});
 assert.ok(seen.startsWith('https://androidpublisher.googleapis.com/androidpublisher/v3/applications/cl.preparatupaes.app/'));assert.ok(seen.endsWith(encodeURIComponent(receipt)));
 await assert.rejects(fetchSubscription(receipt,token,async()=>new Response('',{status:404})),/RECEIPT_NOT_FOUND/);
 await assert.rejects(fetchSubscription(receipt,token,async()=>new Response('',{status:503})),/GOOGLE_UNAVAILABLE/);
 await acknowledgeSubscription(receipt,token,async(url,request)=>{assert.ok(url.endsWith(':acknowledge'));assert.equal(request.method,'POST');return new Response(null,{status:204});});
 assert.equal(validToken('bad\nreceipt'),false);assert.equal(validToken('x'.repeat(5000)),false);
});
test('Verifier remains closed without server configuration, Auth or an approved origin',async()=>{
 const handler=createPlayHandler({env:()=>undefined,createClient:()=>{throw Error('Auth must not be touched');}});
 assert.deepEqual(await(await handler(new Request('https://example.invalid'))).json(),{ready:false,packageName:'cl.preparatupaes.app',productId:'cachaste_premium'});
 assert.equal((await handler(new Request('https://example.invalid',{method:'POST'}))).status,401);
 const response=await handler(new Request('https://example.invalid',{method:'POST',headers:{Authorization:'Bearer forged'}}));assert.equal(response.status,503);assert.equal((await response.json()).error,'BILLING_NOT_CONFIGURED');
 assert.equal((await handler(new Request('https://example.invalid',{headers:{Origin:'https://untrusted.invalid'}}))).status,403);
});
test('Verified Google receipt is acknowledged before the server transaction; client score/Premium claims are ignored',async()=>{
 const calls=[],events=[],key=crypto.getRandomValues(new Uint8Array(32)),env={CACHASTE_PLAY_ENABLED:'true',GOOGLE_PLAY_SERVICE_ACCOUNT:JSON.stringify(credentials),PLAY_RECEIPT_ENCRYPTION_KEY:base64(key),SUPABASE_URL:'https://example.invalid',SUPABASE_ANON_KEY:'public',SUPABASE_SERVICE_ROLE_KEY:'server'};
 let store=sample();store.acknowledgementState='ACKNOWLEDGEMENT_STATE_PENDING';
 const handler=createPlayHandler({env:k=>env[k],now:()=>now,createClient:(_url,k)=>k==='server'?{rpc:async(_name,args)=>{calls.push(args);if(args.operation==='apply'){events.push('apply');return{data:{premium:true}};}return{data:null};}}:{auth:{getUser:async()=>({data:{user:{id:uuid}}})},rpc:async()=>({data:{premium:false}})},fetcher:async url=>{
  if(url==='https://oauth2.googleapis.com/token')return Response.json({access_token:'google-access'});
  if(url.endsWith(':acknowledge')){events.push('acknowledge');return new Response(null,{status:204});}return Response.json(store);
 }});
 const response=await handler(new Request('https://example.invalid',{method:'POST',headers:{Authorization:'Bearer signed-session','Content-Type':'application/json'},body:JSON.stringify({action:'verify',purchaseToken:'private-receipt-token',premium:true,validUntil:'2999-01-01'})}));
 assert.equal(response.status,200);assert.deepEqual(events,['acknowledge','apply']);
 const applied=calls.find(c=>c.operation==='apply').payload;assert.equal(applied.userId,uuid);assert.equal(applied.acknowledged,true);assert.equal(applied.expiresAt,sample().lineItems[0].expiryTime);assert.ok(!JSON.stringify(applied).includes('private-receipt-token'));
 assert.equal(await decryptToken({token_ciphertext:applied.ciphertext,token_iv:applied.iv},key),'private-receipt-token');
 store=sample();store.externalAccountIdentifiers.obfuscatedExternalAccountId='forged';
 const rejected=await handler(new Request('https://example.invalid',{method:'POST',headers:{Authorization:'Bearer signed-session','Content-Type':'application/json'},body:JSON.stringify({action:'verify',purchaseToken:'another-private-token'})}));assert.equal(rejected.status,400);assert.equal((await rejected.json()).error,'ACCOUNT_MISMATCH');assert.equal(events.length,2);
});
