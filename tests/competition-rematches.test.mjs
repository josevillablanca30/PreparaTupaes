import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {database,rpc,profile,grantTest,users} from './helpers/competition-db.mjs';

test('Repeated rivals: no daily cap, real settlement, finite-bank rotation and private paginated history',async t=>{
 const db=await database();t.after(()=>db.close());
 await db.exec("update cachaste.settings set environment='test'");
 for(let i=0;i<3;i++){await profile(db,i);await grantTest(db,i);}
 let previous=[],first;
 for(let round=0;round<12;round++){
  const requestId=randomUUID();const created=await rpc(db,0,'create_duel',{subject:'M1',nickname:'TestAlumno1',requestId});
  assert.equal((await rpc(db,0,'create_duel',{subject:'M1',nickname:'TestAlumno1',requestId})).id,created.id);
  await assert.rejects(rpc(db,0,'create_duel',{subject:'M1',nickname:'TestAlumno1',requestId:randomUUID()}),/PAIR_LIMIT/);
  // A code invitation must use its stored subject, not a caller-controlled category.
  if(round%2===0)await rpc(db,1,'join_code',{code:created.code,subject:'M2'});else await rpc(db,1,'accept',{duelId:created.id});
  const keys=(await db.query('select question_keys from cachaste.duels where id=$1',[created.id])).rows[0].question_keys;
  assert.equal(keys.length,10);assert.equal(keys.some(k=>previous.includes(k)),false);
  assert.equal((await db.query('select count(distinct family)::int n from cachaste.questions where key=any($1)',[keys])).rows[0].n,10);
  previous=keys;
  for(let player=0;player<2;player++){
   const view=await rpc(db,player,'duel',{duelId:created.id});let a=await rpc(db,player,'start',{attemptId:view.attemptId});
   while(a.status==='active'){
    const answer=(await db.query('select answer from cachaste.questions where key=$1',[a.question.key])).rows[0].answer;
    const payload={attemptId:a.id,position:a.position,choice:player===round%2?answer:(answer+1)%a.question.options.length,requestId:randomUUID()};
    a=await rpc(db,player,'answer',payload);assert.equal((await rpc(db,player,'answer',payload)).position,a.position);
   }
  }
  const done=await rpc(db,0,'duel',{duelId:created.id});first||=done;
  assert.equal(done.status,'finished');assert.equal(done.result.winner,users[round%2]);
  await rpc(db,1,'duel',{duelId:created.id});
  // Exhaust freshness deliberately: unlimited play must rotate least-recent questions rather than block.
  if(round===0)await db.query("insert into cachaste.seen(user_id,question_key,last_seen)select $1,key,now()-interval '1 day' from cachaste.pool('M1','')on conflict do nothing",[users[0]]);
 }
 const summary=await rpc(db,0,'duel_history',{});
 assert.deepEqual(summary.summary,{played:12,wins:6,losses:6,draws:0});
 assert.equal((await db.query('select count(*)::int n from cachaste.settlements')).rows[0].n,12);
 const board=await rpc(db,0,'rankings',{mode:'duel',subject:'M1',scope:'Chile'});assert.equal(board.me.wins,6);assert.equal(board.me.losses,6);
 // More than one page, including identical timestamps: UUID breaks cursor ties.
 for(let i=0;i<11;i++){const d=await rpc(db,1,'create_duel',{subject:'M2',nickname:'TestAlumno0',requestId:randomUUID()});await rpc(db,0,'decline',{duelId:d.id});}
 await db.exec("update cachaste.duels set created_at='2026-11-02 00:00:00+00'");
 const page1=await rpc(db,0,'duel_history',{});assert.equal(page1.duels.length,20);assert.ok(page1.next);
 const page2=await rpc(db,0,'duel_history',{before:page1.next});assert.equal(page2.duels.length,3);assert.equal(page2.next,null);
 const ids=[...page1.duels,...page2.duels].map(d=>d.id);assert.equal(new Set(ids).size,23);assert.ok(ids.includes(first.id));
 assert.deepEqual((await rpc(db,2,'duel_history',{userId:users[0]})).duels,[]);
 await assert.rejects(rpc(db,2,'duel',{duelId:first.id}),/NOT_FOUND/);
 await assert.rejects(rpc(db,0,'duel_history',{before:{id:first.id}}),/INVALID_FILTER/);
 await db.exec('set role authenticated');await assert.rejects(db.query('select cachaste.duel_history($1,$2)',[users[0],{}]),/permission denied/);await db.exec('reset role');
});
