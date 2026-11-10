import test from 'node:test';import assert from 'node:assert/strict';import {database,users,billing} from './database.mjs';
async function sandbox(db,operation,payload){await db.exec('set role service_role');try{return(await db.query('select public.cachaste_mp_sandbox_admin($1,$2::jsonb) result',[operation,JSON.stringify(payload)])).rows[0].result;}finally{await db.exec('reset role');}}
test('only a definitive provider rejection releases an unattached checkout for one safe retry',async t=>{
 const db=await database();t.after(()=>db.close());await db.exec('update cachaste_web.policy set payments_enabled=true,tax_ready=true');
 const request={id:crypto.randomUUID(),userId:users[0],plan:'mensual',providerPlanId:'catalogue',trial:false};
 assert.equal((await billing(db,'checkout',request)).created,true);assert.equal((await billing(db,'checkout',request)).created,false);
 for(const status of [408,409,429,500,503])await assert.rejects(billing(db,'checkout_failed',{...request,status}),/UNSAFE_CHECKOUT_RETRY/);
 assert.equal((await billing(db,'checkout',request)).created,false);
 assert.equal((await billing(db,'checkout_failed',{...request,status:400})).retryable,true);
 assert.equal((await billing(db,'checkout',request)).created,true);assert.equal((await billing(db,'checkout',request)).created,false);
 await billing(db,'attach',{...request,providerId:'synthetic-created'});
 assert.equal((await billing(db,'checkout_failed',{...request,status:400})).retryable,false);
 assert.equal((await billing(db,'checkout',request)).created,false);
});
test('sandbox checkout retries remain isolated, scoped to their owner and rate limited',async t=>{
 const db=await database();t.after(()=>db.close());await db.query("update auth.users set raw_app_meta_data=jsonb_build_object('role','admin') where id=$1",[users[0]]);
 const request={id:crypto.randomUUID(),userId:users[0],plan:'mensual',providerPlanId:'catalogue',trial:false};
 assert.equal((await sandbox(db,'reserve',request)).created,true);
 await assert.rejects(sandbox(db,'checkout_failed',{...request,status:503}),/UNSAFE_CHECKOUT_RETRY/);
 assert.equal((await sandbox(db,'reserve',request)).created,false);
 assert.equal((await sandbox(db,'checkout_failed',{...request,status:422})).retryable,true);
 assert.equal((await sandbox(db,'reserve',request)).created,true);
 await sandbox(db,'attach',{...request,providerId:'synthetic-created'});
 assert.equal((await sandbox(db,'checkout_failed',{...request,status:400})).retryable,false);
 assert.equal((await db.query('select count(*)::int n from cachaste_web.checkouts')).rows[0].n,0);
});
