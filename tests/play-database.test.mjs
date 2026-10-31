import {test} from 'node:test';import assert from 'node:assert/strict';
import {database,users} from './helpers/competition-db.mjs';
test('Google receipt ledger binds owners, survives replay and revocation, and rejects client access',async()=>{
 const db=await database();const now=Date.now(),hash='a'.repeat(64);
 const payload={userId:users[0],hash,ciphertext:'encrypted-only',iv:'nonce',productId:'cachaste_premium',basePlan:'mensual',state:'SUBSCRIPTION_STATE_ACTIVE',expiresAt:new Date(now+3*86400000).toISOString(),observedAt:new Date(now).toISOString(),testPurchase:false,autoRenewing:true,acknowledged:true};
 const call=async p=>(await db.query("select public.cachaste_play_admin('apply',$1::jsonb) as result",[JSON.stringify(p)])).rows[0].result;
 try{
  assert.equal((await call(payload)).premium,true);assert.equal((await call(payload)).premium,true);
  assert.equal((await db.query('select count(*)::int n from cachaste.play_receipts')).rows[0].n,1);
  const validity=(await db.query('select valid_until<=now()+interval \'12 hours\' as bounded from cachaste.entitlements')).rows[0];assert.equal(validity.bounded,true);
  await assert.rejects(call({...payload,userId:users[1]}),/RECEIPT_ALREADY_LINKED/);
  assert.equal((await call({...payload,state:'SUBSCRIPTION_STATE_ON_HOLD',observedAt:new Date(now+100).toISOString()})).premium,false);
  assert.equal((await call(payload)).premium,false,'an older response cannot restore a revoked subscription');
  assert.equal((await call({...payload,hash:'b'.repeat(64),observedAt:new Date(now+200).toISOString()})).premium,true);
  assert.equal((await call({...payload,state:'SUBSCRIPTION_STATE_EXPIRED',observedAt:new Date(now+300).toISOString()})).premium,true,'another verified receipt remains valid');
  for(const role of ['anon','authenticated']){
   await db.exec('set role '+role);
   await assert.rejects(db.query('select * from cachaste.play_receipts'),/permission denied/);
   await assert.rejects(db.query("select public.cachaste_play_admin('lookup','{}')"),/permission denied/);
   await db.exec('reset role');
  }
  await db.exec('set role service_role');
  assert.equal((await db.query("select public.cachaste_play_admin('lookup',$1) as r",[JSON.stringify({hash})])).rows[0].r.user_id,users[0]);
  await db.exec('reset role');
 }finally{await db.close();}
});
