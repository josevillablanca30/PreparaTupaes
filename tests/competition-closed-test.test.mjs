import test from 'node:test';
import assert from 'node:assert/strict';
import {database,rpc,profile,users,sessions,grantTest} from './helpers/competition-db.mjs';

test('Closed test: owner allowlist grants competition and native access without purchases',async t=>{
 const db=await database();t.after(()=>db.close());
 for(let i=0;i<3;i++)await profile(db,i);
 const access=async i=>{await rpc(db,i,'profile');await db.exec('set role authenticated');try{return(await db.query('select public.cachaste_access() result')).rows[0].result;}finally{await db.exec('reset role');}};
 assert.equal((await access(0)).active,false);
 await assert.rejects(rpc(db,0,'dashboard'),/SUBSCRIPTION_REQUIRED/);
 for(let i=0;i<2;i++)await db.query("insert into cachaste.closed_test_access(user_id,valid_until,reason)values($1,now()+interval '20 minutes','isolated test')",[users[i]]);
 assert.equal((await rpc(db,0,'profile')).premium,true);
 const permission=await access(0);assert.equal(permission.active,true);assert.equal(permission.accessSource,'closed_test');assert.ok(permission.validUntilMs-permission.serverTimeMs<=1200000);
 assert.equal((await access(2)).active,false);
 const d=await rpc(db,0,'create_duel',{subject:'M1',nickname:'TestAlumno1',requestId:crypto.randomUUID()});await rpc(db,1,'accept',{duelId:d.id});
 assert.equal((await rpc(db,0,'duel',{duelId:d.id})).status,'active');
 await db.exec('set role authenticated');
 await assert.rejects(db.query('select * from cachaste.closed_test_access'),/permission denied/);
 await assert.rejects(db.query("insert into cachaste.closed_test_access(user_id,valid_until,reason)values($1,now()+interval '1 day','self grant')",[users[2]]),/permission denied/);
 await assert.rejects(db.query('select cachaste.closed_test_until($1)',[users[0]]),/permission denied/);
 await db.exec('reset role');
 await db.query('update cachaste.closed_test_access set revoked_at=now() where user_id=$1',[users[0]]);
 assert.equal((await access(0)).active,false);await assert.rejects(rpc(db,0,'dashboard'),/SUBSCRIPTION_REQUIRED/);
 await db.query("update cachaste.closed_test_access set granted_at=now()-interval '2 days',valid_until=now()-interval '1 day' where user_id=$1",[users[1]]);
 assert.equal((await access(1)).active,false);
 await assert.rejects(db.query("insert into cachaste.closed_test_access(user_id,valid_until,reason)values($1,now()+interval '31 days','too long')",[users[2]]),/check constraint/);
 await grantTest(db,2);assert.equal((await access(2)).active,false); // production still denies test_harness
 await db.exec("update cachaste.settings set environment='test'");assert.equal((await access(2)).active,true); // original policy retained
 await db.query("insert into cachaste.closed_test_access(user_id,valid_until,reason)values($1,now()+interval '1 day','session limit')",[users[2]]);
 await db.query("update auth.sessions set not_after=now()+interval '2 minutes'where id=$1",[sessions[2]]);
 const bounded=await access(2);assert.ok(bounded.validUntilMs-bounded.serverTimeMs<=120000);
 await db.query('delete from auth.sessions where id=$1',[sessions[2]]);await assert.rejects(access(2),/AUTH_REQUIRED/);
});

test('Closed test email preauthorization needs verified Auth email and is revocable without creating users',async t=>{
 const db=await database();t.after(()=>db.close());
 await profile(db,0);await profile(db,1);
 await db.exec("insert into cachaste.closed_test_emails(email_hash,valid_until,reason)values(sha256(convert_to('closed-test@example.invalid','UTF8')),now()+interval '1 day','isolated preauthorization')");
 await db.query("update auth.users set email=' Closed-Test@Example.Invalid ' where id=$1",[users[0]]);
 assert.equal((await rpc(db,0,'profile')).premium,false);
 await db.query('update auth.users set email_confirmed_at=now()where id=$1',[users[0]]);
 assert.equal((await rpc(db,0,'profile')).premium,true);
 assert.equal((await rpc(db,1,'profile')).premium,false);
 await db.exec('set role authenticated');await assert.rejects(db.exec('select * from cachaste.closed_test_emails'),/permission denied/);await db.exec('reset role');
 await db.query("update auth.users set email='different@example.invalid'where id=$1",[users[0]]);assert.equal((await rpc(db,0,'profile')).premium,false);
 await db.query("update auth.users set email='closed-test@example.invalid'where id=$1",[users[0]]);
 await db.exec('update cachaste.closed_test_emails set revoked_at=now()');assert.equal((await rpc(db,0,'profile')).premium,false);
});
