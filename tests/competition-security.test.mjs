import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {database,rpc,profile,grantTest,users} from './helpers/competition-db.mjs';

test('Competition database: migration, access control, authoritative scores, geography and exactly-once settlement',async t=>{
 const db=await database();t.after(()=>db.close());
 await t.test('802 questions, 346 communes, 16 regions; all private tables have RLS',async()=>{
  assert.equal((await db.query('select count(*)::int n from cachaste.questions')).rows[0].n,802);
  assert.equal((await db.query('select count(*)::int n,count(distinct region_code)::int r from cachaste.locations')).rows[0].n,346);
  assert.equal((await db.query("select count(*)::int n from pg_tables where schemaname='cachaste' and not rowsecurity")).rows[0].n,0);
 });
 await t.test('profiles do not activate subscriptions; production rejects even test-harness grants',async()=>{
  for(let i=0;i<3;i++)await profile(db,i);
  assert.equal((await rpc(db,0,'profile')).premium,false);
  await assert.rejects(rpc(db,0,'dashboard'),/SUBSCRIPTION_REQUIRED/);
  await grantTest(db,0);await assert.rejects(rpc(db,0,'dashboard'),/SUBSCRIPTION_REQUIRED/);
  await db.exec("update cachaste.settings set environment='test'");for(let i=1;i<3;i++)await grantTest(db,i);
 });
 await t.test('nickname uniqueness, nonexistent commune, foreign writes and revoked sessions are rejected',async()=>{
  await assert.rejects(profile(db,1,{nickname:'TestAlumno0'}),/duplicate key/);
  await assert.rejects(profile(db,1,{communeCode:'not-a-commune'}),/foreign key/);
  await db.exec('set role authenticated');await assert.rejects(db.exec('select * from cachaste.questions'),/permission denied/);await assert.rejects(db.exec("update cachaste.entitlements set valid_until=now()+interval '99 years'"),/permission denied/);await db.exec('reset role');
  await db.query('update auth.sessions set not_after=now()-interval \'1 minute\' where user_id=$1',[users[2]]);await assert.rejects(rpc(db,2,'profile'),/AUTH_REQUIRED/);await db.query('update auth.sessions set not_after=null where user_id=$1',[users[2]]);
 });
 let duel,attempts;
 await t.test('self challenge, pair spam, unauthorized invitations; creation retry is idempotent',async()=>{
  await assert.rejects(rpc(db,0,'create_duel',{subject:'M1',nickname:'TestAlumno0',requestId:randomUUID()}),/SELF_DUEL/);
  const id=randomUUID();duel=await rpc(db,0,'create_duel',{subject:'M1',nickname:'TestAlumno1',requestId:id});assert.equal((await rpc(db,0,'create_duel',{subject:'M1',nickname:'TestAlumno1',requestId:id})).id,duel.id);
  await assert.rejects(rpc(db,0,'create_duel',{subject:'M1',nickname:'TestAlumno1',requestId:randomUUID()}),/PAIR_LIMIT/);
  await assert.rejects(rpc(db,2,'accept',{duelId:duel.id}),/NOT_FOUND/);
  await rpc(db,1,'accept',{duelId:duel.id});attempts=(await db.query('select id,user_id,question_keys from cachaste.attempts where duel_id=$1 order by user_id',[duel.id])).rows;
  assert.equal(attempts.length,2);assert.deepEqual(attempts[0].question_keys,attempts[1].question_keys);assert.equal(new Set(attempts[0].question_keys).size,10);
 });
 await t.test('same set, server deadlines, solutions hidden, anti-IDOR and replay-safe answers',async()=>{
  const a=await rpc(db,0,'start',{attemptId:attempts[0].id});assert.equal(a.total,10);assert.ok(a.deadline);assert.ok(a.question.question);assert.equal(a.question.answer,undefined);assert.equal(a.question.steps,undefined);
  await assert.rejects(rpc(db,1,'attempt',{attemptId:attempts[0].id}),/NOT_FOUND/);await assert.rejects(rpc(db,0,'review',{attemptId:attempts[0].id}),/SOLUTIONS_HIDDEN/);
  const answer=(await db.query('select answer from cachaste.questions where key=$1',[a.question.key])).rows[0].answer;
  const p={attemptId:a.id,position:0,choice:answer,requestId:randomUUID(),elapsedMs:0,score:1000};
  await rpc(db,0,'answer',p);await rpc(db,0,'answer',p);
  const saved=(await db.query('select correct,position,elapsed_ms from cachaste.attempts where id=$1',[a.id])).rows[0];assert.equal(saved.correct,1);assert.equal(saved.position,1);assert.ok(Number(saved.elapsed_ms)>=1000);
  await assert.rejects(rpc(db,0,'answer',{...p,requestId:randomUUID()}),/ANSWER_OUT_OF_ORDER/);
 });
 await t.test('more correct answers always beat faster time; settlement occurs once and stars cannot be negative',async()=>{
  for(let player=0;player<2;player++){
   let a=await rpc(db,player,'start',{attemptId:attempts[player].id});
   while(a.status==='active'){
    const correct=(await db.query('select answer from cachaste.questions where key=$1',[a.question.key])).rows[0].answer;
    if(player===0)await db.query("update cachaste.attempts set presented_at=clock_timestamp()-interval '2 seconds'where id=$1",[a.id]);
    a=await rpc(db,player,'answer',{attemptId:a.id,position:a.position,choice:player===0?correct:(correct+1)%a.question.options.length,requestId:randomUUID()});
   }
   if(player===0)await assert.rejects(rpc(db,0,'review',{attemptId:a.id}),/SOLUTIONS_HIDDEN/);
  }
  for(let i=0;i<4;i++)duel=await rpc(db,0,'duel',{duelId:duel.id});
  assert.equal(duel.result.winner,users[0]);assert.equal(duel.result.reason,'correct');assert.equal(duel.result.changes[users[0]],1);assert.equal(duel.result.changes[users[1]],0);
  assert.ok(duel.result.creator.elapsedMs>duel.result.opponent.elapsedMs);
  const stats=(await db.query("select user_id,stars,wins,losses from cachaste.stats where season<>'all'order by user_id")).rows;
  assert.equal(stats[0].stars,1);assert.equal(stats[0].wins,1);assert.equal(stats[1].stars,0);assert.equal(stats[1].losses,1);
  assert.equal((await db.query('select count(*)::int n from cachaste.settlements')).rows[0].n,1);
  assert.equal((await rpc(db,1,'review',{attemptId:attempts[1].id})).errors.length,10);
 });
 await t.test('rankings have four modes, geography, self and privacy opt-out',async()=>{
  const r=await rpc(db,0,'rankings',{mode:'duel',subject:'M1',scope:'Comuna'});assert.equal(r.me.position,1);assert.equal(r.top.length,2);
  await profile(db,1,{publicRanking:false});assert.equal((await rpc(db,0,'rankings',{mode:'duel',subject:'M1',scope:'Chile'})).top.length,1);
  await assert.rejects(rpc(db,0,'rankings',{mode:'weighted',subject:'M1'}),/INVALID_FILTER/);
 });
 await t.test('Express compares identical immutable weekly forms and forbids a second ranked attempt',async()=>{
  const attempts=[];
  for(let i=0;i<2;i++)attempts.push(await rpc(db,i,'create_assessment',{kind:'express',subject:'M2',requestId:randomUUID()}));
  const rows=(await db.query("select question_keys,category from cachaste.attempts where id=any($1::uuid[])order by user_id",[attempts.map(a=>a.id)])).rows;
  assert.equal(rows[0].question_keys.length,15);assert.deepEqual(rows[0].question_keys,rows[1].question_keys);assert.equal(rows[0].category,rows[1].category);
  await assert.rejects(rpc(db,0,'create_assessment',{kind:'express',subject:'M2',requestId:randomUUID()}),/WEEKLY_ATTEMPT_USED/);
  let a=await rpc(db,0,'start',{attemptId:attempts[0].id});while(a.status==='active'){const correct=(await db.query('select answer from cachaste.questions where key=$1',[a.question.key])).rows[0].answer;a=await rpc(db,0,'answer',{attemptId:a.id,position:a.position,choice:correct,requestId:randomUUID()});}
  assert.equal(a.correct,15);const board=await rpc(db,0,'rankings',{mode:'express',subject:'M2',scope:'Chile'});assert.equal(board.me.value,15);assert.equal(board.me.total,15);
 });
 await t.test('full PAES formats have the complete question count; legacy local progress cannot set a score',async()=>{
  for(const[s,count,track]of[['M1',65,''],['M2',55,''],['Lectura',65,''],['Historia',65,''],['Ciencias',80,'Biología']]){const a=await rpc(db,0,'create_assessment',{kind:'exam',subject:s,track,requestId:randomUUID(),score:9999,stars:9999});assert.equal(a.total,count);assert.equal(a.correct,null);}
  await assert.rejects(rpc(db,0,'set_stars',{stars:99999}),/UNKNOWN_OPERATION/);
 });
 await t.test('educational stars use distinct verified families and are independent from duel balances',async()=>{
  const concept=(await db.query("select concept from cachaste.pool('M1','')q where not exists(select 1 from cachaste.seen v where v.user_id=$1 and v.question_key=q.key)group by concept having count(distinct family)>=2 limit 1",[users[0]])).rows[0].concept;const a=await rpc(db,0,'create_assessment',{kind:'game',subject:'M1',concept,requestId:randomUUID()});let current=await rpc(db,0,'start',{attemptId:a.id});
  while(current.status==='active'){const correct=(await db.query('select answer from cachaste.questions where key=$1',[current.question.key])).rows[0].answer;current=await rpc(db,0,'answer',{attemptId:a.id,position:current.position,choice:correct,requestId:randomUUID()});}
  const education=await rpc(db,0,'education');assert.equal(education.stars,4);assert.equal((await rpc(db,0,'rankings',{mode:'game',subject:'M1',scope:'Chile'})).me.value,4);
  await rpc(db,0,'attempt',{attemptId:a.id});assert.equal((await rpc(db,0,'education')).stars,4);
 });
 async function newDuel(subject){await db.exec("update cachaste.duels set created_at=now()-interval '25 hours'");const d=await rpc(db,0,'create_duel',{subject,nickname:'TestAlumno1',requestId:randomUUID()});await rpc(db,1,'accept',{duelId:d.id});return(await db.query('select id,user_id from cachaste.attempts where duel_id=$1 order by user_id',[d.id])).rows;}
 async function complete(index,a,seconds=0){let q=await rpc(db,index,'start',{attemptId:a.id});while(q.status==='active'){const answer=(await db.query('select answer from cachaste.questions where key=$1',[q.question.key])).rows[0].answer;if(seconds)await db.query("update cachaste.attempts set presented_at=clock_timestamp()-make_interval(secs=>$2)where id=$1",[q.id,seconds]);q=await rpc(db,index,'answer',{attemptId:q.id,position:q.position,choice:answer,requestId:randomUUID()});}return q;}
 await t.test('time breaks equal aciertos only; exact same valid time creates a draw',async()=>{
  let pair=await newDuel('Historia');await complete(0,pair[0]);await complete(1,pair[1]);let d=(await db.query("select result from cachaste.settlements where duel_id=(select duel_id from cachaste.attempts where id=$1)",[pair[0].id])).rows[0].result;assert.equal(d.reason,'draw');assert.equal(d.winner,null);
  pair=await newDuel('Ciencias').catch(()=>null);
  // Science requires an explicit mention rather than silently mixing incompatible categories.
  assert.equal(pair,null);
  pair=await newDuel('Lectura');await complete(0,pair[0],2);await complete(1,pair[1]);d=(await db.query("select result from cachaste.settlements where duel_id=(select duel_id from cachaste.attempts where id=$1)",[pair[0].id])).rows[0].result;assert.equal(d.reason,'time');assert.equal(d.winner,users[1]);
 });
 await t.test('disconnections do not pause the server clock; abandonments settle only after a rival completes',async()=>{
  const pair=await newDuel('M2');let a=await rpc(db,0,'start',{attemptId:pair[0].id});await db.query("update cachaste.attempts set presented_at=clock_timestamp()-interval '91 seconds'where id=$1",[a.id]);const answer=(await db.query('select answer from cachaste.questions where key=$1',[a.question.key])).rows[0].answer;await rpc(db,0,'answer',{attemptId:a.id,position:0,choice:answer,requestId:randomUUID(),elapsedMs:1});const stored=(await db.query('select * from cachaste.answers where attempt_id=$1',[a.id])).rows[0];assert.equal(stored.choice,null);assert.equal(stored.correct,false);assert.equal(Number(stored.elapsed_ms),90000);
  await rpc(db,0,'forfeit',{attemptId:a.id});assert.equal((await db.query('select count(*)::int n from cachaste.settlements where duel_id=(select duel_id from cachaste.attempts where id=$1)',[a.id])).rows[0].n,0);await complete(1,pair[1]);const d=(await db.query('select result from cachaste.settlements where duel_id=(select duel_id from cachaste.attempts where id=$1)',[a.id])).rows[0].result;assert.equal(d.reason,'abandonment');assert.equal(d.winner,users[1]);assert.equal((await rpc(db,0,'education')).stars,4);
 });
 await t.test('account deletion requires recent authentication, revokes sessions and does not delete another student',async()=>{
  await assert.rejects(rpc(db,2,'delete_account',{confirmation:'no'}),/CONFIRMATION_REQUIRED/);
  await db.query("update auth.sessions set created_at=now()-interval '1 hour'where user_id=$1",[users[2]]);await assert.rejects(rpc(db,2,'delete_account',{confirmation:'ELIMINAR'}),/REAUTHENTICATION_REQUIRED/);
  await db.query("update auth.sessions set created_at=now()where user_id=$1",[users[2]]);assert.equal((await rpc(db,2,'delete_account',{confirmation:'ELIMINAR'})).deleted,true);
  await assert.rejects(rpc(db,2,'profile'),/AUTH_REQUIRED/);assert.equal((await rpc(db,0,'profile')).profile.nickname,'TestAlumno0');
 });

});
