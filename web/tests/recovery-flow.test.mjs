import test from'node:test';import assert from'node:assert/strict';
import{captureRecoveryReturn,isRecoveryReturn,verifyRecoveryReturn,rememberRecovery,resumeRecovery,forgetRecovery,changeRecoveredPassword,requestRecovery,recoveryError,RECOVERY_MARKER}from'../client/recovery-flow.mjs';
const uid='10000000-0000-4000-8000-000000000001',token='a'.repeat(64),origin='https://sitecacho.cl';
const session={access_token:'eyJ'+token,refresh_token:'refresh-'+token,user:{id:uid},expires_at:Math.floor(Date.now()/1000)+3600};
function capture(suffix){const steps=[];return{steps,entry:captureRecoveryReturn({href:origin+'/recuperar'+suffix},{replaceState:(_a,_b,value)=>steps.push(value)})};}
test('Recovery captures official hash, implicit and PKCE forms and removes all callback material first',()=>{
 for(const [suffix,kind]of[['#token_hash='+token+'&type=recovery','hash'],['?token_hash='+token+'&type=recovery','hash'],['#access_token='+session.access_token+'&refresh_token='+session.refresh_token+'&type=recovery','implicit'],['?code=pkce-qa-code&recovery=1','pkce']]){const value=capture(suffix);assert.equal(value.entry.kind,kind);assert.deepEqual(value.steps,['/recuperar']);}
 for(const suffix of['?error=expired&error_description='+token,'#token_hash='+token+'&type=signup','?code=first&code=second','?token_hash='+token+'&type=recovery#token_hash='+token,'#access_token=invalid'])assert.equal(capture(suffix).entry.kind,'invalid');
 assert.equal(capture('').entry.kind,'none');assert.equal(isRecoveryReturn({href:origin+'/cuenta.html?recovery=1&code=qa-code'}),true);assert.equal(isRecoveryReturn({href:origin+'/cuenta.html?code=ordinary-google-code'}),false);
});
test('A verified recovery calls only the official SDK method and verifies the resulting user',async()=>{
 for(const entry of[capture('#token_hash='+token+'&type=recovery').entry,capture('#access_token='+session.access_token+'&refresh_token='+session.refresh_token+'&type=recovery').entry,capture('?code=pkce-qa-code&recovery=1').entry]){
  const calls=[],auth={getUser:async()=>({data:{user:session.user}})};for(const name of['verifyOtp','setSession','exchangeCodeForSession'])auth[name]=async(...args)=>{calls.push({name,args});return{data:{session}};};
  const result=await verifyRecoveryReturn({auth},entry);assert.equal(result.userId,uid);assert.equal(calls.length,1);assert.equal(calls[0].name,{hash:'verifyOtp',implicit:'setSession',pkce:'exchangeCodeForSession'}[entry.kind]);
 }
 await assert.rejects(verifyRecoveryReturn({auth:{}},{kind:'invalid'}),/RECOVERY_EXPIRED/);
 await assert.rejects(verifyRecoveryReturn({auth:{verifyOtp:async()=>({data:{session}}),getUser:async()=>({data:{user:{id:'another-user'}}})}},capture('#token_hash='+token+'&type=recovery').entry),/RECOVERY_EXPIRED/);
});
test('Only a verified, matching, unexpired recovery can resume; a normal login never grants this form',async()=>{
 const values=new Map(),storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)},sdk={auth:{getSession:async()=>({data:{session}}),getUser:async()=>({data:{user:session.user}})}};
 assert.equal(await resumeRecovery(sdk,storage),null);await rememberRecovery(storage,{session,userId:uid});assert.ok(await resumeRecovery(sdk,storage));assert.ok(!values.get(RECOVERY_MARKER).includes(session.access_token));
 assert.equal(await resumeRecovery(sdk,storage,Date.now()+3600001),null);await rememberRecovery(storage,{session,userId:uid});sdk.auth.getUser=async()=>({data:{user:{id:'changed-account'}}});assert.equal(await resumeRecovery(sdk,storage),null);forgetRecovery(storage);assert.equal(values.size,0);
});
test('Password updates enforce matching identity, length, confirmation and global logout without falsely undoing a completed change',async()=>{
 let updates=0,scope;const sdk={auth:{getUser:async()=>({data:{user:session.user}}),updateUser:async()=>{updates++;return{data:{user:session.user}};},signOut:async options=>{scope=options.scope;return{};}}};
 await assert.rejects(changeRecoveredPassword(sdk,'a-valid-new-password','a-valid-new-password'),/RECOVERY_REQUIRED/);
 await assert.rejects(changeRecoveredPassword(sdk,'short','short',{verified:true,userId:uid}),/PASSWORD_TOO_SHORT/);
 await assert.rejects(changeRecoveredPassword(sdk,'a-valid-new-password','different-password',{verified:true,userId:uid}),/PASSWORD_MISMATCH/);
 await assert.rejects(changeRecoveredPassword(sdk,'a-valid-new-password','a-valid-new-password',{verified:true,userId:'another-user'}),/RECOVERY_EXPIRED/);assert.equal(updates,0);
 assert.equal((await changeRecoveredPassword(sdk,'a-valid-new-password','a-valid-new-password',{verified:true,userId:uid})).changed,true);assert.equal(scope,'global');
 sdk.auth.signOut=async()=>{throw Error('Network failed');};const result=await changeRecoveredPassword(sdk,'another-new-password','another-new-password',{verified:true,userId:uid});assert.equal(result.changed,true);assert.equal(result.sessionsClosed,false);
});
test('Recovery requests explicitly target HTTPS recuperar and diagnostics never echo credentials or provider errors',async()=>{
 let payload;await requestRecovery({auth:{resetPasswordForEmail:async(...args)=>{payload=args;return{};}}},' student@example.invalid ',origin);assert.deepEqual(payload,['student@example.invalid',{redirectTo:origin+'/recuperar'}]);
 for(const error of[{code:'otp_expired',message:token},{code:'weak_password',message:'secret-password'},{message:'Network error with '+token},{code:'unexpected_failure',message:'Error sending email: private SMTP diagnostic'}]){assert.ok(!recoveryError(error).includes(token));assert.ok(!recoveryError(error).includes('secret-password'));assert.ok(!recoveryError(error).includes('private SMTP'));}
});
