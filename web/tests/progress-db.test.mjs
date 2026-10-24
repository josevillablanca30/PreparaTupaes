import test from'node:test';import assert from'node:assert/strict';import{randomUUID}from'node:crypto';
import{database,users,sessions,webRpc,rpc,profile,grantTest,billing}from'./database.mjs';
test('Web schema: caller-scoped sync, conflict versions and payment isolation',async t=>{
 const db=await database();t.after(()=>db.close());
 await t.test('default policy is closed; private schema has RLS and no direct client table privileges',async()=>{
  assert.deepEqual(await billing(db,'policy'),{enabled:false,allowTests:false});
  assert.equal((await db.query("select count(*)::int n from pg_tables where schemaname='cachaste_web'and not rowsecurity")).rows[0].n,0);
  await db.exec('set role authenticated');try{await assert.rejects(db.exec('select * from cachaste_web.learning_documents'),/permission denied/);await assert.rejects(db.exec("select public.cachaste_web_billing_admin('checkout','{}')"),/permission denied/);}finally{await db.exec('reset role');}
 });
 await t.test('no editable metadata or local progress activates Premium',async()=>{
  await assert.rejects(webRpc(db,0,'snapshot'),/SUBSCRIPTION_REQUIRED/);for(let i=0;i<3;i++)await profile(db,i);
  assert.equal((await rpc(db,0,'profile')).premium,false);
  await assert.rejects(billing(db,'checkout',{id:randomUUID(),userId:users[0],plan:'mensual',providerPlanId:'qa-monthly',trial:false}),/BILLING_NOT_READY/);
  await db.exec("update cachaste.settings set environment='test'");for(let i=0;i<2;i++)await grantTest(db,i);
 });
 await t.test('two devices see the same key and version, while another identity remains separate',async()=>{
  const p={key:'cachaste-daily-v1',value:{version:1,attempts:[{eventId:'q1',correct:true}],subject:'M1'},baseVersion:0,user_id:users[1],premium:true};
  const first=await webRpc(db,0,'put',p);assert.equal(first.document.version,1);assert.equal(first.document.user_id,undefined);
  const deviceB=await webRpc(db,0,'snapshot');assert.equal(deviceB.documents[0].value.subject,'M1');assert.deepEqual((await webRpc(db,1,'snapshot')).documents,[]);
  const stale=await webRpc(db,0,'put',{...p,value:{version:1,subject:'M2'}});assert.equal(stale.conflict,true);assert.equal(stale.document.value.subject,'M1');
  const updated=await webRpc(db,0,'put',{...p,value:{version:1,subject:'M2'},baseVersion:1});assert.equal(updated.document.version,2);
  assert.equal((await db.query('select count(*)::int n from cachaste.stats')).rows[0].n,0);
 });
 await t.test('allowed keys, document types, size and revoked live sessions are enforced by the server',async()=>{
  await assert.rejects(webRpc(db,0,'put',{key:'premium',baseVersion:0,value:{premium:true}}),/INVALID_PROGRESS_KEY/);
  await assert.rejects(webRpc(db,0,'put',{key:'cachaste-m2-v1',baseVersion:0,value:'bad'}),/INVALID_PROGRESS_VALUE/);
  await assert.rejects(webRpc(db,0,'put',{key:'cachaste-m2-v1',baseVersion:0,value:{x:'x'.repeat(1050000)}}),/INVALID_PROGRESS_VALUE/);
  await db.query("update auth.sessions set not_after=now()-interval '1 second'where id=$1",[sessions[0]]);await assert.rejects(webRpc(db,0,'snapshot'),/AUTH_REQUIRED/);await db.query('update auth.sessions set not_after=null where id=$1',[sessions[0]]);
 });
 let checkout;
 await t.test('verified web entitlement extends the same access API without overwriting Google receipts',async()=>{
  await db.exec('update cachaste_web.policy set payments_enabled=true,tax_ready=true');checkout=randomUUID();
  const created=await billing(db,'checkout',{id:checkout,userId:users[2],plan:'mensual',providerPlanId:'qa-monthly',trial:false});assert.equal(created.created,true);
  assert.equal((await billing(db,'checkout',{id:checkout,userId:users[2],plan:'mensual',providerPlanId:'qa-monthly',trial:false})).created,false);
  await assert.rejects(billing(db,'checkout',{id:checkout,userId:users[0],plan:'mensual',providerPlanId:'qa-monthly'}),/CHECKOUT_ALREADY_LINKED/);
  await billing(db,'attach',{id:checkout,userId:users[2],providerId:'qa-subscription'});
  await billing(db,'apply',{userId:users[2],checkoutId:checkout,providerId:'qa-subscription',plan:'mensual',status:'authorized',paidUntil:new Date(Date.now()+86400000).toISOString(),trialUntil:null,observedAt:new Date().toISOString(),liveMode:true,renews:true,nextPaymentAt:null,payments:[]});
  assert.equal((await rpc(db,2,'profile')).premium,true);assert.ok((await rpc(db,2,'dashboard',{subject:'M1'})).season);
  await webRpc(db,2,'snapshot');assert.equal((await db.query('select count(*)::int n from cachaste.entitlements where user_id=$1',[users[2]])).rows[0].n,0);
  await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({sub:users[2],session_id:sessions[2]})]);const access=(await db.query('select public.cachaste_access() x')).rows[0].x;assert.equal(access.active,true);assert.equal(access.userId,users[2]);assert.ok(access.validUntilMs-access.serverTimeMs<=43200000);
 });
 await t.test('a verified test purchase is rejected in production and stale observations cannot revive a cancellation',async()=>{
  await db.exec("update cachaste_web.subscriptions set live_mode=false;update cachaste_web.policy set allow_test_purchases=true;update cachaste.settings set environment='production'");
  assert.equal((await rpc(db,2,'profile')).premium,false);
  await db.exec("update cachaste.settings set environment='test'");assert.equal((await rpc(db,2,'profile')).premium,true);
  await db.exec("update cachaste_web.subscriptions set paid_until=now()-interval '1 day',observed_at=now()+interval '1 second'");
  await billing(db,'apply',{userId:users[2],checkoutId:checkout,providerId:'qa-subscription',plan:'mensual',status:'authorized',paidUntil:new Date(Date.now()+86400000).toISOString(),observedAt:new Date(Date.now()-1000).toISOString(),liveMode:true,renews:true,payments:[]});assert.equal((await rpc(db,2,'profile')).premium,false);
  assert.equal((await rpc(db,0,'profile')).premium,true);
 });
 await t.test('deleting an account erases progress and personal billing links, retaining only the private accounting ledger',async()=>{
  await db.query("insert into cachaste_web.payments(provider_id,subscription_id,user_id,plan,status,amount_clp,fee_clp,net_clp,paid_at,observed_at,live_mode)values('qa-payment','qa-subscription',$1,'mensual','approved',7990,199,7791,now(),now(),true)",[users[2]]);
  await rpc(db,0,'delete_account',{confirmation:'ELIMINAR'});assert.equal((await db.query('select count(*)::int n from cachaste_web.learning_documents where user_id=$1',[users[0]])).rows[0].n,0);assert.equal((await rpc(db,1,'profile')).profile.nickname,'TestAlumno1');
  await rpc(db,2,'delete_account',{confirmation:'ELIMINAR'});assert.equal((await db.query('select count(*)::int n from cachaste_web.subscriptions')).rows[0].n,0);const ledger=(await db.query("select user_id,subscription_id,amount_clp from cachaste_web.payments where provider_id='qa-payment'")).rows[0];assert.equal(ledger.user_id,null);assert.equal(ledger.subscription_id,null);assert.equal(Number(ledger.amount_clp),7990);
 });
});
