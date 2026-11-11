import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {database,rpc,profile,grantTest,users} from './helpers/competition-db.mjs';

test('Community: consent, safety without Premium, private reports and fair blocks',async t=>{
 const db=await database();t.after(()=>db.close());
 await t.test('consent must be explicit; actor and acceptance time come from Auth/server',async()=>{
  await assert.rejects(profile(db,0,{communityVersion:null}),/COMMUNITY_REQUIRED/);
  const saved=await profile(db,0,{communityAcceptedAt:'2000-01-01',moderation_status:'suspended'});
  assert.equal(saved.profile.community_version,'2026-10-23');assert.equal(saved.profile.moderation_status,'active');
  assert.ok(Date.parse(saved.profile.community_accepted_at)>Date.parse('2026-01-01'));
  const again=await profile(db,0);assert.equal(again.profile.community_accepted_at,saved.profile.community_accepted_at);
  await profile(db,1);await profile(db,2);
 });
 await t.test('reports work without a subscription; cannot forge reporter, status or nickname',async()=>{
  await assert.rejects(rpc(db,0,'dashboard'),/SUBSCRIPTION_REQUIRED/);
  const p={userId:users[1],reason:'nickname',reporter_id:users[2],status:'reviewed',nickname_snapshot:'Forged'};
  assert.deepEqual(await rpc(db,0,'report',p),{reported:true});await rpc(db,0,'report',p);
  const rows=(await db.query('select * from cachaste.reports')).rows;assert.equal(rows.length,1);
  assert.equal(rows[0].reporter_id,users[0]);assert.equal(rows[0].target_id,users[1]);assert.equal(rows[0].status,'pending');assert.equal(rows[0].nickname_snapshot,'TestAlumno1');
  assert.equal((await rpc(db,1,'profile')).profile.moderation_status,'active');
  await assert.rejects(rpc(db,0,'report',{userId:users[1],reason:'invented'}),/INVALID_REPORT_REASON/);
  await assert.rejects(rpc(db,0,'block',{userId:users[0]}),/INVALID_PLAYER/);
  await assert.rejects(rpc(db,0,'report',{userId:randomUUID(),reason:'other'}),/INVALID_PLAYER/);
 });
 await t.test('reports and legacy dispatcher are inaccessible directly to client roles',async()=>{
  await db.exec('set role authenticated');
  try{await assert.rejects(db.query('select * from cachaste.reports'),/permission denied/);await assert.rejects(db.query("select cachaste.dispatch_before_community('save_profile','{}')"),/permission denied/);}
  finally{await db.exec('reset role');}
 });
 await t.test('blocks cancel invitations, hide ranking and nearby rows without improving rank',async()=>{
  await db.exec("update cachaste.settings set environment='test'");for(let i=0;i<3;i++)await grantTest(db,i);
  const invitation=await rpc(db,1,'create_duel',{subject:'M1',nickname:'TestAlumno0',requestId:randomUUID()});
  for(let i=0;i<3;i++)await db.query("insert into cachaste.stats(user_id,subject,track,season,stars)values($1,'M1','',cachaste.season(),$2)",[users[i],10+i]);
  const before=await rpc(db,0,'rankings',{subject:'M1',mode:'duel',scope:'Chile'});assert.equal(before.me.position,3);
  await rpc(db,0,'block',{userId:users[1]});
  assert.equal((await db.query('select status from cachaste.duels where id=$1',[invitation.id])).rows[0].status,'cancelled');
  const after=await rpc(db,0,'rankings',{subject:'M1',mode:'duel',scope:'Chile'});
  assert.equal(after.me.position,3);assert.ok(!after.top.some(p=>p.user_id===users[1]));assert.ok(!after.nearby.some(p=>p.user_id===users[1]));
  assert.equal((await rpc(db,0,'blocked_users')).users[0].id,users[1]);
  await assert.rejects(rpc(db,1,'create_duel',{subject:'M1',nickname:'TestAlumno0',requestId:randomUUID()}),/RIVAL_UNAVAILABLE/);
  const reverse=await rpc(db,1,'rankings',{subject:'M1',mode:'duel',scope:'Chile'});assert.ok(!reverse.top.some(p=>p.user_id===users[0]));
  await rpc(db,0,'unblock',{userId:users[1]});assert.equal((await rpc(db,0,'blocked_users')).users.length,0);
  assert.ok((await rpc(db,0,'rankings',{subject:'M1',mode:'duel',scope:'Chile'})).top.some(p=>p.user_id===users[1]));
 });
 await t.test('operator restriction removes queue and invitations; client cannot lift it; privacy still works',async()=>{
  await rpc(db,2,'random',{subject:'M2'});
  const invitation=await rpc(db,2,'create_duel',{subject:'M2',requestId:randomUUID()});
  await db.query("update cachaste.profiles set moderation_status='suspended'where user_id=$1",[users[2]]);
  assert.equal((await db.query('select count(*)::int n from cachaste.match_queue where user_id=$1',[users[2]])).rows[0].n,0);
  assert.equal((await db.query('select status from cachaste.duels where id=$1',[invitation.id])).rows[0].status,'cancelled');
  await assert.rejects(profile(db,2,{moderation_status:'active'}),/ACCOUNT_RESTRICTED/);
  await assert.rejects(rpc(db,2,'dashboard'),/ACCOUNT_RESTRICTED/);
  assert.equal((await rpc(db,2,'profile')).profile.public_ranking,false);
  assert.deepEqual(await rpc(db,2,'report',{userId:users[1],reason:'other'}),{reported:true});
  assert.deepEqual(await rpc(db,2,'block',{userId:users[1]}),{blocked:true});
  await rpc(db,2,'delete_profile');await assert.rejects(profile(db,2),/ACCOUNT_RESTRICTED/);
  await db.query('delete from cachaste.community_restrictions where user_id=$1',[users[2]]);await profile(db,2);
 });
 await t.test('reports are rate limited and account deletion removes private safety data',async()=>{
  for(const reason of ['harassment','impersonation','other'])await rpc(db,0,'report',{userId:users[1],reason});
  await rpc(db,0,'report',{userId:users[2],reason:'nickname'});
  await assert.rejects(rpc(db,0,'report',{userId:users[2],reason:'other'}),/RATE_LIMIT/);
  assert.deepEqual(await rpc(db,0,'delete_account',{confirmation:'ELIMINAR'}),{deleted:true});
  assert.equal((await db.query('select count(*)::int n from cachaste.reports where reporter_id=$1',[users[0]])).rows[0].n,0);
 });
});
