import test from 'node:test';
import assert from 'node:assert/strict';
import {database,users,sessions,billing} from './database.mjs';
async function account(db,index=0,extra={}){
 await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({sub:users[index],session_id:sessions[index],role:'authenticated',...extra})]);
 await db.exec('set role authenticated');
 try{return(await db.query('select public.cachaste_web_account() result')).rows[0].result;}finally{await db.exec('reset role');}
}
test('administration reads the current trusted role; editable or stale JWT claims cannot grant it',async t=>{
 const db=await database();t.after(()=>db.close());
 assert.equal((await account(db,0,{user_metadata:{role:'admin'},app_metadata:{role:'admin'}})).isAdmin,false);
 await db.query("update auth.users set raw_app_meta_data='{}'::jsonb || jsonb_build_object('role','admin') where id=$1",[users[0]]);
 assert.equal((await account(db)).isAdmin,true);
 assert.equal((await account(db,1)).isAdmin,false);
 await db.query("update auth.users set raw_app_meta_data='{}'::jsonb where id=$1",[users[0]]);
 assert.equal((await account(db,0,{app_metadata:{role:'admin'}})).isAdmin,false);
 await db.exec('set role anon');try{await assert.rejects(db.exec('select public.cachaste_web_account()'),/permission denied/);}finally{await db.exec('reset role');}
});
test('complimentary tester access cannot create a recurring checkout even with launch flags enabled',async t=>{
 const db=await database();t.after(()=>db.close());
 await db.exec(`create function cachaste.closed_test_until(u uuid) returns timestamptz language sql stable as $$select now()+interval '1 year'$$;
 update cachaste_web.policy set payments_enabled=true,tax_ready=true;`);
 const state=await account(db);
 assert.equal(state.complimentary.active,true);assert.equal(state.complimentary.renews,false);assert.deepEqual(state.subscriptions,[]);
 await assert.rejects(billing(db,'checkout',{id:crypto.randomUUID(),userId:users[0],plan:'mensual',providerPlanId:'qa',trial:true}),/COMPLIMENTARY_ACCESS/);
 assert.equal((await db.query('select count(*)::int n from cachaste_web.checkouts')).rows[0].n,0);
});
