import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CompetitionClient,errorMessage} from '../competition-client.mjs';

test('A pending answer keeps its original receipt and choice even after a refreshed server position',async()=>{
 const values=new Map(),storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)},client=new CompetitionClient({},storage);
 client.user={id:'isolated-account'};
 const receipts=[];let lost=true;
 client.call=async(_op,payload)=>{receipts.push(structuredClone(payload));if(lost){lost=false;throw new Error('Network response lost after server commit');}return{id:'attempt',position:1,status:'active'};};
 await assert.rejects(client.answer({id:'attempt',position:0},2));
 await client.answer({id:'attempt',position:1},0);
 assert.deepEqual(receipts[1],receipts[0]);
 assert.equal(receipts[1].position,0);assert.equal(receipts[1].choice,2);assert.equal(client.pending(),null);
 await client.answer({id:'attempt',position:1},0);
 assert.equal(receipts[2].position,1);assert.equal(receipts[2].choice,0);assert.notEqual(receipts[2].requestId,receipts[0].requestId);
});

test('A disconnected signed-out client has no pending private answer',()=>{
 const client=new CompetitionClient({},{getItem:()=>{throw new Error('Must not read another identity');}});
 assert.equal(client.pending(),null);
});

function signedInClient(invoke){
 const client=new CompetitionClient({billingReady:true},{});
 client.sdk={
  rpc:()=>({abortSignal:async()=>({data:{catalogueReady:true}})}),
  auth:{getSession:async()=>({data:{session:{}}}),getUser:async()=>({data:{user:{id:'account'}}})},
  functions:{invoke}
 };
 client.call=async()=>({profile:{nickname:'Estudiante'},premium:true,season:'2026-10-19'});
 return client;
}
test('A verifier outage preserves account administration without granting competitive access',async()=>{
 for(const invoke of [async()=>({error:Error('503')}),async()=>{throw Error('Network unavailable');},async()=>({data:{error:'VERIFICATION_UNAVAILABLE'}}),async()=>({data:{}})]){
  const client=signedInClient(invoke);
  const state=await client.connect();
  assert.equal(client.user.id,'account');assert.equal(client.profile.nickname,'Estudiante');
  assert.equal(client.billingUnavailable,true);assert.equal(client.premium,false);assert.equal(state.premium,false);
 }
});
test('Reconnecting after the verifier recovers clears the outage and reads the server entitlement again',async()=>{
 let unavailable=true;
 const client=signedInClient(async()=>unavailable?{error:Error('503')}:{data:{premium:true}});
 await client.connect();unavailable=false;await client.connect();
 assert.equal(client.billingUnavailable,false);assert.equal(client.premium,true);
});
test('An invalid Auth session clears the previous identity and its public profile',async()=>{
 const client=signedInClient(async()=>({data:{}}));
 client.user={id:'previous-account'};client.profile={nickname:'Previous'};client.premium=true;
 client.sdk.auth.getUser=async()=>({data:{user:null},error:Error('Invalid session')});
 await assert.rejects(client.connect(),/Invalid session/);
 assert.equal(client.user,null);assert.equal(client.profile,null);assert.equal(client.premium,false);
});
test('The native educational bridge receives the Auth token only after a verified entitlement; denied native access stays visible',async()=>{
 const previous=globalThis.CachasteAccess,requests=[];
 const bridge={postMessage(raw){const request=JSON.parse(raw);requests.push(request);queueMicrotask(()=>bridge.onmessage({data:JSON.stringify({id:request.id,required:true,active:false})}));}};
 globalThis.CachasteAccess=bridge;
 try{
  const client=signedInClient(async()=>({data:{premium:true}}));
  client.sdk.auth.getSession=async()=>({data:{session:{access_token:'auth-session-token'}}});
  await client.connect();assert.equal(client.nativeAccessUnavailable,true);
  assert.equal(requests[0].action,'verify');assert.equal(requests[0].token,'auth-session-token');
  client.call=async()=>({profile:null,premium:false});await client.connect();assert.equal(requests.at(-1).action,'clear');
 }finally{if(previous===undefined)delete globalThis.CachasteAccess;else globalThis.CachasteAccess=previous;}
});
test('A server-revoked session clears native offline access even when Auth still recognizes its JWT',async()=>{
 const client=signedInClient(async()=>({data:{premium:true}})),actions=[];
 client.nativeAccess=async action=>{actions.push(action);return null;};
 client.call=async()=>{throw Object.assign(Error('AUTH_REQUIRED'),{code:'28000'});};
 await assert.rejects(client.connect(),/AUTH_REQUIRED/);
 assert.equal(client.user,null);assert.equal(client.premium,false);assert.deepEqual(actions,['clear']);
});

test('Email verification accepts only this project and the requested action, never passwords or another origin',async()=>{
 const client=new CompetitionClient({supabaseUrl:'https://test.supabase.co'},{}),seen=[];
 client.serviceReady=true;client.sdk={auth:{verifyOtp:async p=>{seen.push(p);return{};},resetPasswordForEmail:async(...p)=>{seen.push(p);return{};}}};client.connect=async()=>({});
 await client.verifyEmail(' student@example.invalid ','123456','signup');assert.deepEqual(seen.pop(),{email:'student@example.invalid',token:'123456',type:'email'});
 const token='a'.repeat(64);
 await client.verifyEmail('student@example.invalid','https://test.supabase.co/auth/v1/verify?type=email&token='+token,'signup');assert.deepEqual(seen.pop(),{token_hash:token,type:'email'});
 await client.verifyEmail('student@example.invalid','https://test.supabase.co/auth/v1/verify?type=recovery&token='+token,'recovery');assert.equal(client.recovering,true);seen.pop();
 for(const url of ['https://evil.invalid/auth/v1/verify?type=recovery&token='+token,'https://test.supabase.co/auth/v1/verify?type=signup&token='+token,'https://test.supabase.co/other?type=recovery&token='+token,'not a code'])await assert.rejects(client.verifyEmail('student@example.invalid',url,'recovery'),/INVALID_EMAIL_LINK/);
 assert.equal(seen.length,0);await client.resetPassword(' student@example.invalid ');assert.deepEqual(seen.pop(),['student@example.invalid',{}]);
});
test('Expected Auth errors have actionable messages without echoing credentials',()=>{
 for(const code of ['invalid_credentials','email_not_confirmed','weak_password','over_email_send_rate_limit','otp_expired']){const message=errorMessage({code,message:'secret-password'});assert.ok(message.length>10);assert.ok(!message.includes('secret-password'));}
});

test('Legacy Auth error responses without a machine code remain actionable',()=>{assert.equal(errorMessage(Error('Email not confirmed')),errorMessage({code:'email_not_confirmed'}));assert.equal(errorMessage(Error('Invalid login credentials')),errorMessage({code:'invalid_credentials'}));});
