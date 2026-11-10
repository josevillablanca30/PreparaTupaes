import test from 'node:test';
import assert from 'node:assert/strict';
import {database,users,rpc,profile} from './database.mjs';
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
