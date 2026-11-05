import {test} from 'node:test';
import assert from 'node:assert/strict';
import {database,users,sessions,grantTest} from './helpers/competition-db.mjs';

async function access(db,index){
 await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({sub:users[index],session_id:sessions[index],role:'authenticated'})]);
 await db.exec('set role authenticated');
 try{return(await db.query('select public.cachaste_access() as result')).rows[0].result;}
 finally{await db.exec('reset role');}
}
test('Educational access is per live Auth session and never derives from a client claim or another account',async()=>{
 const db=await database();
 try{
  const empty=await access(db,0);assert.equal(empty.active,false);assert.equal(empty.validUntilMs,null);
  await grantTest(db,0);assert.equal((await access(db,0)).active,false,'test entitlement is rejected in production');
  await db.query("update cachaste.entitlements set source='google_play_verified' where user_id=$1",[users[0]]);
  const allowed=await access(db,0);assert.equal(allowed.userId,users[0]);assert.equal(allowed.active,true);
  assert.equal(allowed.validUntilMs-allowed.serverTimeMs,12*60*60*1000);
  assert.equal((await access(db,1)).active,false,'a second account cannot borrow the first entitlement');
  await db.query("update auth.sessions set not_after=now()+interval '10 minutes' where id=$1",[sessions[0]]);
  const short=await access(db,0);assert.ok(short.validUntilMs-short.serverTimeMs<=600000);
  await db.query("update cachaste.entitlements set valid_until=now()+interval '2 minutes' where user_id=$1",[users[0]]);
  const sooner=await access(db,0);assert.ok(sooner.validUntilMs-sooner.serverTimeMs<=120000);
  await db.query("update cachaste.entitlements set status='revoked' where user_id=$1",[users[0]]);assert.equal((await access(db,0)).active,false);
  await db.query('delete from auth.sessions where id=$1',[sessions[0]]);await assert.rejects(access(db,0),/AUTH_REQUIRED/);
  const permission=(await db.query("select has_function_privilege('anon','public.cachaste_access()','execute') as anonymous,has_table_privilege('authenticated','cachaste.entitlements','update') as can_grant")).rows[0];
  assert.deepEqual(permission,{anonymous:false,can_grant:false});
 }finally{await db.close();}
});
