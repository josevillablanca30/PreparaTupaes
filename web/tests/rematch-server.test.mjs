import test from 'node:test';import assert from 'node:assert/strict';import {randomUUID} from 'node:crypto';
import {database,rpc,profile,grantTest,users} from './database.mjs';
test('consecutive real server duels preserve history, rotate the finite bank and keep retries idempotent',async t=>{
 const db=await database();t.after(()=>db.close());await db.exec("update cachaste.settings set environment='test'");
 for(let i=0;i<2;i++){await profile(db,i);await grantTest(db,i);}
 const ids=[],questionSets=[];
 for(let round=0;round<3;round++){
  const payload={subject:'M1',nickname:'TestAlumno1',requestId:randomUUID()},created=await rpc(db,0,'create_duel',payload);ids.push(created.id);
  assert.equal((await rpc(db,0,'create_duel',payload)).id,created.id);
  await assert.rejects(rpc(db,0,'create_duel',{...payload,requestId:randomUUID()}),/PAIR_LIMIT/);
  await rpc(db,1,'accept',{duelId:created.id});
  const attempts=(await db.query('select id,question_keys from cachaste.attempts where duel_id=$1 order by user_id',[created.id])).rows;
  assert.deepEqual(attempts[0].question_keys,attempts[1].question_keys);assert.equal(new Set(attempts[0].question_keys).size,10);questionSets.push(attempts[0].question_keys);
  for(let i=0;i<2;i++){
   let a=await rpc(db,i,'start',{attemptId:attempts[i].id});
   while(a.status==='active'){
    assert.equal(a.question.answer,undefined);assert.equal(a.question.steps,undefined);
    const correct=(await db.query('select answer from cachaste.questions where key=$1',[a.question.key])).rows[0].answer;
    const answer={attemptId:a.id,position:a.position,choice:i===0?correct:(correct+1)%a.question.options.length,requestId:randomUUID(),elapsedMs:-1000};
    a=await rpc(db,i,'answer',answer);assert.equal((await rpc(db,i,'answer',answer)).position,a.position);
   }
   if(i===0){assert.equal((await rpc(db,0,'duel',{duelId:created.id})).status,'active');await assert.rejects(rpc(db,0,'review',{attemptId:a.id}),/SOLUTIONS_HIDDEN/);}
  }
  const result=await rpc(db,0,'duel',{duelId:created.id});assert.equal(result.status,'finished');assert.equal(result.result.winner,users[0]);assert.equal(result.result.creator.correct,10);assert.equal(result.result.opponent.correct,0);
  assert.equal((await rpc(db,0,'create_duel',payload)).id,created.id);
 }
 assert.equal(new Set(ids).size,3);assert.notDeepEqual(questionSets[0],questionSets[1]);
 const history=await rpc(db,0,'duel_history',{});assert.equal(history.summary.played,3);assert.equal(history.summary.wins,3);assert.deepEqual(new Set(history.duels.map(d=>d.id)),new Set(ids));
 assert.equal((await rpc(db,1,'duel_history',{})).summary.losses,3);
 await assert.rejects(rpc(db,2,'duel',{duelId:ids[0]}),/SUBSCRIPTION_REQUIRED|PROFILE_REQUIRED|NOT_FOUND/);
 const dashboard=await rpc(db,0,'dashboard',{subject:'M1'});assert.equal(dashboard.stats.wins,3);assert.equal(dashboard.stats.stars,3);
 const definition=(await db.query("select pg_get_functiondef('cachaste.dispatch_before_community(text,jsonb)'::regprocedure) source")).rows[0].source;
 assert.ok(definition.indexOf('Recheck request after caller lock')>definition.indexOf("cachaste.rate(u,'challenge'"));
});
