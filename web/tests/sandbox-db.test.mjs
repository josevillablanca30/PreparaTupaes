import test from 'node:test';
import assert from 'node:assert/strict';
import {database,users,sessions,rpc,profile,billing} from './database.mjs';
async function sandbox(db,operation,payload={}){
 await db.exec('set role service_role');try{return(await db.query('select public.cachaste_mp_sandbox_admin($1,$2::jsonb) result',[operation,JSON.stringify(payload)])).rows[0].result;}finally{await db.exec('reset role');}
}
test('sandbox database enforces service access, ownership, monotonic observations and production isolation',async t=>{
 const db=await database();t.after(()=>db.close());const id=crypto.randomUUID();
 for(const role of ['anon','authenticated']){
  await db.exec('set role '+role);try{
   await assert.rejects(db.exec("select public.cachaste_mp_sandbox_admin('list','{}')"),/permission denied/);
   await assert.rejects(db.exec('select * from cachaste_web.sandbox_checkouts'),/permission denied/);
  }finally{await db.exec('reset role');}
 }
 await assert.rejects(sandbox(db,'reserve',{id,userId:users[0],plan:'mensual',providerPlanId:'trial',trial:true}),/QA_ADMIN_REQUIRED/);
 await db.query("update auth.users set raw_app_meta_data=jsonb_build_object('role','admin') where id=any($1::uuid[])",[[users[0],users[1]]]);
 const payload={id,userId:users[0],plan:'mensual',providerPlanId:'trial',trial:true};
 assert.equal((await sandbox(db,'reserve',payload)).created,true);assert.equal((await sandbox(db,'reserve',payload)).created,false);
 await assert.rejects(sandbox(db,'reserve',{...payload,userId:users[1]}),/CHECKOUT_ALREADY_LINKED/);
 await sandbox(db,'attach',{id,userId:users[0],providerId:'synthetic-sub'});
 assert.deepEqual(await sandbox(db,'list',{userId:users[1]}),[]);
 const snapshot={checkoutId:id,providerId:'synthetic-sub',userId:users[0],plan:'mensual',status:'authorized',trialUntil:new Date(Date.now()+7*86400000).toISOString(),paidUntil:null,observedAt:new Date().toISOString(),liveMode:false,renews:true,payments:[]};
 assert.equal((await sandbox(db,'apply',{id,userId:users[0],snapshot})).stored,true);
 await profile(db,0);assert.equal((await rpc(db,0,'profile')).premium,false);
 await db.exec("update cachaste_web.policy set payments_enabled=true,tax_ready=true,allow_test_purchases=true;update cachaste.settings set environment='test'");
 assert.equal((await rpc(db,0,'profile')).premium,false);
 const cancelled={...snapshot,status:'cancelled',renews:false,observedAt:new Date().toISOString()};
 assert.equal((await sandbox(db,'apply',{id,userId:users[0],snapshot:cancelled})).stored,true);
 assert.equal((await sandbox(db,'apply',{id,userId:users[0],snapshot:{...snapshot,observedAt:new Date(Date.now()-60000).toISOString()}})).stored,false);
 assert.equal((await sandbox(db,'list',{userId:users[0]}))[0].snapshot.renews,false);
 await assert.rejects(sandbox(db,'apply',{id,userId:users[0],snapshot:{...snapshot,liveMode:true}}),/INVALID_SANDBOX_OBSERVATION/);
 assert.equal((await db.query('select count(*)::int n from cachaste_web.subscriptions')).rows[0].n,0);
 assert.equal((await db.query('select count(*)::int n from cachaste_web.checkouts')).rows[0].n,0);
});

async function linkHosted(db,payload){
 await db.exec('set role service_role');
 try{
  return (await db.query('select public.cachaste_mp_sandbox_link_hosted($1::jsonb) result',[JSON.stringify(payload)])).rows[0].result;
 }finally{await db.exec('reset role');}
}
async function clientAccess(db,index=0){
 const claims={sub:users[index],session_id:sessions[index],role:'authenticated'};
 await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify(claims)]);
 await db.exec('set role authenticated');
 try{
  return (await db.query("select public.cachaste_web_account() web, public.cachaste_access() android")).rows[0];
 }finally{await db.exec('reset role');}
}

test('hosted ownership and payment are verified atomically and cannot be replayed onto another account',async t=>{
 const db=await database();t.after(()=>db.close());
 const providerId='sandbox-hosted-proof',paymentId='90870001',payerId='90870002',collectorId='90870003',applicationId='90870004';
 const observedAt=new Date(Date.now()-10000).toISOString();
 const paidUntil=new Date(Date.now()+6*86400000).toISOString();
 const snapshot={providerId,plan:'semanal',status:'authorized',paidUntil,observedAt,liveMode:false,renews:true,
  payments:[{id:paymentId,status:'approved',liveMode:false}]};
 const payload={userId:users[0],providerId,paymentId,payerId,collectorId,applicationId,providerPlanId:'weekly',
  createdAt:observedAt,plan:'semanal',snapshot};
 for(const role of ['anon','authenticated','service_role']){
  await db.exec('set role '+role);
  try{
   await assert.rejects(db.exec('select * from cachaste_web.sandbox_hosted_ownership'),/permission denied/);
   if(role!=='service_role')await assert.rejects(db.exec("select public.cachaste_mp_sandbox_link_hosted('{}')"),/permission denied/);
  }finally{await db.exec('reset role');}
 }
 await assert.rejects(linkHosted(db,payload),/QA_ADMIN_REQUIRED/);
 await db.query("update auth.users set raw_app_meta_data=jsonb_build_object('role','admin') where id=any($1::uuid[])",[users.slice(0,2)]);
 await assert.rejects(linkHosted(db,payload),/OWNERSHIP_REQUIRED/);
 await db.query(`insert into cachaste_web.sandbox_hosted_ownership
  (provider_id,user_id,payer_id,collector_id,application_id,evidence_ref)
  values($1,$2,$3,$4,$5,'qa verification record')`,[providerId,users[0],payerId,collectorId,applicationId]);
 for(const different of [{userId:users[1]},{payerId:'999'},{collectorId:'999'},{applicationId:'999'}]){
  await assert.rejects(linkHosted(db,{...payload,...different}),/OWNERSHIP_REQUIRED/);
 }
 await assert.rejects(linkHosted(db,{...payload,snapshot:{...snapshot,liveMode:true}}),/INVALID_SANDBOX_OBSERVATION/);
 await assert.rejects(linkHosted(db,{...payload,snapshot:{...snapshot,payments:[]}}),/PAYMENT_NOT_VERIFIED/);
 await assert.rejects(linkHosted(db,{...payload,snapshot:{...snapshot,observedAt:'2000-01-01T00:00:00Z'}}),/INVALID_OBSERVATION/);
 assert.deepEqual(await sandbox(db,'list',{userId:users[0]}),[]);

 const first=await linkHosted(db,{...payload,snapshot:{...snapshot,userId:users[1],checkoutId:'client-value'}});
 assert.equal(first.userId,users[0]);
 assert.match(first.checkoutId,/^[a-f0-9-]{36}$/);
 assert.deepEqual(await linkHosted(db,payload),first);
 const cancelled={...first,status:'cancelled',renews:false,observedAt:new Date().toISOString()};
 await sandbox(db,'apply',{userId:users[0],id:first.checkoutId,snapshot:cancelled});
 assert.deepEqual(await linkHosted(db,payload),cancelled);

 const otherId='sandbox-hosted-other-proof';
 await db.query(`insert into cachaste_web.sandbox_hosted_ownership
  (provider_id,user_id,payer_id,collector_id,application_id,evidence_ref)
  values($1,$2,$3,$4,$5,'second qa verification')`,[otherId,users[1],payerId,collectorId,applicationId]);
 await assert.rejects(linkHosted(db,{...payload,userId:users[1],providerId:otherId,snapshot:{...snapshot,providerId:otherId}}),/CHECKOUT_ALREADY_LINKED/);
 assert.deepEqual(await sandbox(db,'list',{userId:users[1]}),[]);

 await db.exec("update cachaste_web.policy set payments_enabled=true,tax_ready=true,allow_test_purchases=true;update cachaste.settings set environment='test'");
 const {web,android}=await clientAccess(db);
 assert.deepEqual(web.access,android);
 assert.equal(android.active,false);
 assert.deepEqual(web.subscriptions,[]);
 assert.equal((await db.query('select count(*)::int n from cachaste_web.sandbox_checkouts')).rows[0].n,1);
 assert.equal((await db.query('select count(*)::int n from cachaste_web.payments')).rows[0].n,0);
});

test('web and Android read the same activation, paid cancellation and revocation from Supabase',async t=>{
 const db=await database();t.after(()=>db.close());
 const check=async (active,index=0)=>{
  const {web,android}=await clientAccess(db,index);
  assert.equal(web.access.active,active);
  assert.deepEqual(web.access,android);
  return web;
 };
 await check(false);
 await db.exec('update cachaste_web.policy set payments_enabled=true,tax_ready=true');
 const checkoutId=crypto.randomUUID(),providerId='isolated-commercial-sub';
 const userId=users[0],plan='semanal';
 await billing(db,'checkout',{id:checkoutId,userId,plan,providerPlanId:'weekly'});
 await billing(db,'attach',{id:checkoutId,userId,providerId});
 const paidAt=new Date(Date.now()-86400000).toISOString(),paidUntil=new Date(Date.now()+6*86400000).toISOString();
 const payment={id:'91000001',status:'approved',liveMode:true,amount:2490,fee:0,net:2490,paidAt};
 const snapshot={checkoutId,userId,providerId,plan,liveMode:true,paidUntil,trialUntil:null};
 await billing(db,'apply',{...snapshot,status:'authorized',renews:true,payments:[payment],observedAt:new Date(Date.now()-1000).toISOString()});
 assert.equal((await check(true)).subscriptions[0].renews,true);
 await check(false,1);
 await billing(db,'apply',{...snapshot,status:'cancelled',renews:false,payments:[payment],observedAt:new Date(Date.now()-500).toISOString()});
 assert.equal((await check(true)).subscriptions[0].renews,false);
 await billing(db,'apply',{...snapshot,status:'cancelled',renews:false,paidUntil:null,payments:[{...payment,status:'refunded',net:0}],observedAt:new Date().toISOString()});
 assert.equal((await check(false)).subscriptions[0].paidUntil,null);
});
