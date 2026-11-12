import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {database,rpc,profile,grantTest,users,sessions} from './database.mjs';

export async function d2(db,index,operation,payload={}){
 await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({sub:users[index],session_id:sessions[index],role:'authenticated'})]);
 await db.exec('set role authenticated');
 try{return(await db.query('select public.cachaste_duels2($1,$2::jsonb) result',[operation,JSON.stringify(payload)])).rows[0].result;}
 finally{await db.exec('reset role');}
}
async function setup(t){const db=await database();t.after(()=>db.close());await db.exec("update cachaste.settings set environment='test'");for(let i=0;i<3;i++){await profile(db,i);await grantTest(db,i);}return db;}
async function human(db,subject='M1'){
 const d=await d2(db,0,'create_duel',{subject,nickname:'TestAlumno1',requestId:randomUUID()});await d2(db,1,'accept',{duelId:d.id});return d2(db,0,'duel',{duelId:d.id});
}
async function answer(db,i,a,correct=true,requestId=randomUUID()){
 const key=(await db.query('select answer from cachaste.questions where key=$1',[a.question.key])).rows[0].answer;
 const payload={attemptId:a.id,position:a.position,choice:correct?key:(key+1)%a.question.options.length,requestId,score:999,elapsedMs:-999,botLevel:'advanced'};
 return {result:await d2(db,i,'answer',payload),payload};
}
async function complete(db,i,pid,n=10){let a=await d2(db,i,'start',{attemptId:pid});while(a.status==='active')a=(await answer(db,i,a,a.position<n)).result;return a;}
async function bot(db,i=0){const payload={subject:'M1',requestId:randomUUID()};assert.equal((await d2(db,i,'random',payload)).waiting,true);await db.query("update cachaste_duels2.queue set joined_at=clock_timestamp()-interval '11 seconds'where user_id=$1",[users[i]]);const d=await d2(db,i,'random',payload);assert.equal(d.opponentKind,'bot');return d;}
async function releaseBot(db,d,n=5){const p=(await db.query('select id from cachaste_duels2.players where match_id=$1 and slot=1',[d.id])).rows[0];await db.query('update cachaste_duels2.bot_plan set correct=position<$2,due_at=clock_timestamp()-interval \'1 second\' where player_id=$1',[p.id,n]);return d2(db,0,'duel',{duelId:d.id});}

test('Duelos 2: humans, same ten questions, private aggregate, both full turns, no speed advantage and educational review',async t=>{
 const db=await setup(t),d=await human(db),rows=(await db.query('select * from cachaste_duels2.players where match_id=$1 order by slot',[d.id])).rows;
 assert.equal(rows.length,2);assert.equal(rows[0].question_keys.length,10);assert.deepEqual([...rows[0].question_keys].sort(),[...rows[1].question_keys].sort());assert.notDeepEqual(rows[0].question_keys,rows[1].question_keys);assert.equal(new Set(rows[0].question_keys).size,10);
 let a=await d2(db,0,'start',{attemptId:rows[0].id});assert.ok(Date.parse(a.deadline)-Date.parse(a.serverNow)>2390000);
 assert.equal(a.question.answer,undefined);assert.equal(a.question.steps,undefined);assert.equal(a.question.teaching,undefined);assert.equal(a.question.explanations,undefined);
 const first=await answer(db,0,a,true);a=first.result;assert.equal(a.balance,1);assert.equal(a.streak,1);assert.equal((await d2(db,0,'answer',first.payload)).position,1);
 assert.equal((await d2(db,0,'answer',{...first.payload,requestId:randomUUID()})).position,1);
 a=(await answer(db,0,a,false)).result;assert.equal(a.balance,0);assert.equal(a.streak,0);
 const rival=await d2(db,1,'duel',{duelId:d.id});assert.equal(rival.balance,0);assert.equal(rival.result,null);for(const k of ['correct','position','answers','question','questionKeys','opponentPosition'])assert.equal(rival[k],undefined);
 await assert.rejects(d2(db,1,'attempt',{attemptId:rows[0].id}),/D2_NOT_FOUND/);await assert.rejects(d2(db,2,'duel',{duelId:d.id}),/D2_NOT_FOUND/);
 while(a.status==='active')a=(await answer(db,0,a,true)).result;assert.equal(a.position,10);assert.equal((await d2(db,0,'duel',{duelId:d.id})).status,'active');await assert.rejects(d2(db,0,'review',{attemptId:a.id}),/SOLUTIONS_HIDDEN/);
 await complete(db,1,rows[1].id,5);const final=await d2(db,0,'duel',{duelId:d.id});assert.equal(final.status,'finished');assert.equal(final.result.creator.correct,9);assert.equal(final.result.creator.mastery,14);assert.equal(final.result.opponent.mastery,6);assert.equal(final.balance,8);assert.equal(final.result.winner,users[0]);assert.equal(final.result.reason,'mastery');assert.equal(final.result.changes[users[0]],3);assert.equal(final.result.changes[users[1]],0);
 const review=await d2(db,0,'review',{attemptId:a.id});assert.equal(review.errors.length,1);const r=review.errors[0];assert.ok(Number.isInteger(r.choice));assert.ok(Number.isInteger(r.answer));assert.ok(r.question.options[r.choice]);assert.ok(r.question.options[r.answer]);assert.ok(r.question.teaching||r.question.steps||r.question.explanations);
 assert.equal((await rpc(db,0,'education')).stars,0);
 for(const scope of ['Chile','Región','Comuna'])assert.equal((await rpc(db,0,'rankings',{mode:'duel',subject:'M1',scope})).me.value,3);
 for(let n=0;n<4;n++)await d2(db,0,'duel',{duelId:d.id});assert.equal((await db.query('select count(*)::int n from cachaste_duels2.star_ledger')).rows[0].n,4);
 const columns=(await db.query("select column_name from information_schema.columns where table_name='cachaste_duels2_live'order by ordinal_position")).rows.map(x=>x.column_name);assert.deepEqual(columns,['id','creator','opponent','balance','status']);
});

test('Duelos 2: rematch consent, fresh questions, tie independent of time, human ±3, idempotency and clipped losses',async t=>{
 const db=await setup(t);let d=await human(db);let players=(await db.query('select id from cachaste_duels2.players where match_id=$1 order by slot',[d.id])).rows;await complete(db,0,players[0].id,10);await complete(db,1,players[1].id,5);
 const payload={duelId:d.id,requestId:randomUUID()},next=await d2(db,0,'rematch',payload);assert.equal(next.status,'invited');assert.equal((await d2(db,0,'rematch',payload)).id,next.id);assert.equal((await d2(db,1,'rematch',{...payload,requestId:randomUUID()})).id,next.id);
 await d2(db,1,'accept',{duelId:next.id});await d2(db,1,'accept',{duelId:next.id});players=(await db.query('select id,question_keys from cachaste_duels2.players where match_id=$1 order by slot',[next.id])).rows;const oldKeys=(await db.query('select question_keys from cachaste_duels2.matches where id=$1',[d.id])).rows[0].question_keys;assert.equal(players[0].question_keys.some(k=>oldKeys.includes(k)),false);
 await complete(db,0,players[0].id,4);await complete(db,1,players[1].id,9);d=await d2(db,0,'duel',{duelId:next.id});assert.equal(d.result.changes[users[0]],-3);assert.equal(d.result.changes[users[1]],3);
 const tie=await d2(db,0,'rematch',{duelId:d.id,requestId:randomUUID()});await d2(db,1,'accept',{duelId:tie.id});players=(await db.query('select id from cachaste_duels2.players where match_id=$1 order by slot',[tie.id])).rows;await complete(db,0,players[0].id,6);await db.query("update cachaste_duels2.matches set activated_at=activated_at-interval '5 minutes' where id=$1",[tie.id]);await complete(db,1,players[1].id,6);d=await d2(db,0,'duel',{duelId:tie.id});assert.equal(d.result.winner,null);assert.equal(d.result.reason,'draw');assert.equal(d.result.creator.mastery,10);assert.equal(d.result.changes[users[0]],0);assert.equal(d.result.changes[users[1]],0);
});

test('Duelos 2: ten-second human priority, server bot plan, virtual ±1 and full review',async t=>{
 const db=await setup(t),pending={subject:'M1',requestId:randomUUID()};await d2(db,0,'random',pending);await db.query("update cachaste_duels2.queue set joined_at=clock_timestamp()-interval '11 seconds'where user_id=$1",[users[0]]);
 const matched=await d2(db,1,'random',{subject:'M1',requestId:randomUUID()});assert.equal(matched.opponentKind,'human');assert.equal((await d2(db,0,'random',pending)).id,matched.id);await d2(db,0,'forfeit',{attemptId:(await d2(db,0,'duel',{duelId:matched.id})).attemptId});await d2(db,1,'forfeit',{attemptId:matched.attemptId});
 const d=await bot(db);assert.equal(d.opponent.virtual,true);assert.equal(d.opponent.id,'virtual');assert.equal(d.botPlan,undefined);const before=(await db.query('select choice,correct,due_at from cachaste_duels2.bot_plan order by position')).rows;assert.equal(before.length,10);assert.ok(before.every((x,i)=>i===0||Date.parse(x.due_at)>Date.parse(before[i-1].due_at)));
 await complete(db,0,d.attemptId,9);assert.deepEqual((await db.query('select choice,correct,due_at from cachaste_duels2.bot_plan order by position')).rows,before);await releaseBot(db,d,4);let end=await d2(db,0,'duel',{duelId:d.id});assert.equal(end.result.changes[users[0]],1);assert.equal((await d2(db,0,'review',{attemptId:d.attemptId})).errors.length,1);
 const next=await d2(db,0,'rematch',{duelId:d.id,requestId:randomUUID()});assert.equal(next.opponentKind,'bot');assert.equal(next.status,'active');await complete(db,0,next.attemptId,2);await releaseBot(db,next,9);end=await d2(db,0,'duel',{duelId:next.id});assert.equal(end.result.winner,'virtual');assert.equal(end.result.changes[users[0]],-1);assert.equal((await d2(db,0,'review',{attemptId:next.attemptId})).errors.length,8);
 const third=await d2(db,0,'rematch',{duelId:next.id,requestId:randomUUID()});await complete(db,0,third.attemptId,5);await releaseBot(db,third,5);end=await d2(db,0,'duel',{duelId:third.id});assert.equal(end.result.reason,'draw');assert.equal(end.result.changes[users[0]],0);
});

test('Duelos 2: reconnect, abandonment, server deadline and service-only maintenance unlock every match',async t=>{
 const db=await setup(t),d=await human(db),p=(await db.query('select id from cachaste_duels2.players where match_id=$1 order by slot',[d.id])).rows;
 let a=await d2(db,0,'start',{attemptId:p[0].id});a=(await answer(db,0,a,true)).result;const recovered=await d2(db,0,'attempt',{attemptId:a.id});assert.equal(recovered.position,1);assert.equal(recovered.question.key,a.question.key);
 const resume=await d2(db,0,'random',{subject:'Historia',requestId:randomUUID()});assert.equal(resume.id,d.id);await d2(db,0,'forfeit',{attemptId:a.id});assert.equal((await d2(db,0,'duel',{duelId:d.id})).status,'active');await complete(db,1,p[1].id,3);const end=await d2(db,0,'duel',{duelId:d.id});assert.equal(end.result.reason,'abandonment');assert.equal(end.result.winner,users[1]);assert.equal((await d2(db,0,'review',{attemptId:a.id})).errors.length,9);
 const next=await d2(db,0,'rematch',{duelId:d.id,requestId:randomUUID()});await d2(db,1,'accept',{duelId:next.id});await complete(db,0,(await d2(db,0,'duel',{duelId:next.id})).attemptId,4);await db.query("update cachaste_duels2.matches set expires_at=clock_timestamp()-interval '1 second'where id=$1",[next.id]);
 await db.exec('set role authenticated');await assert.rejects(db.query('select public.cachaste_duels2_maintenance()'),/permission denied/);await db.exec('reset role');
 await db.exec('set role service_role');await db.query('select public.cachaste_duels2_maintenance()');await db.exec('reset role');assert.equal((await d2(db,0,'duel',{duelId:next.id})).status,'finished');assert.equal((await db.query('select count(*)::int n from cachaste_duels2.players where not released')).rows[0].n,0);
});

test('Duelos 2: private tables/RLS/authorization, opt-out, blocks, suspended account and idempotent migration',async t=>{
 const db=await setup(t);await db.exec(await readFile(new URL('../supabase/migrations/20261110130920_cachaste_duels2_isolated.sql',import.meta.url),'utf8'));
 assert.equal((await db.query("select count(*)::int n from pg_tables where schemaname='cachaste_duels2' and not rowsecurity")).rows[0].n,0);
 await db.exec('set role anon');await assert.rejects(db.query("select public.cachaste_duels2('health','{}')"),/permission denied/);await db.exec('reset role');
 await db.exec('set role authenticated');for(const table of ['matches','players','answers','bot_plan','star_ledger'])await assert.rejects(db.query('select * from cachaste_duels2.'+table),/permission denied/);await assert.rejects(db.query('update public.cachaste_duels2_live set balance=20'),/permission denied/);await assert.rejects(db.query('select cachaste_duels2.advance(gen_random_uuid())'),/permission denied/);await db.exec('reset role');
 const d=await human(db);await d2(db,2,'health');await db.exec('set role authenticated');assert.equal((await db.query('select * from public.cachaste_duels2_live')).rows.length,0);await db.exec('reset role');await d2(db,0,'health');await db.exec('set role authenticated');assert.equal((await db.query('select * from public.cachaste_duels2_live')).rows.length,1);await db.exec('reset role');
 await db.query("update cachaste.profiles set moderation_status='suspended'where user_id=$1",[users[2]]);await assert.rejects(d2(db,2,'health'),/ACCOUNT_RESTRICTED/);
 await db.query("update auth.sessions set not_after=now()-interval '1 second'where id=$1",[sessions[0]]);await assert.rejects(d2(db,0,'duel',{duelId:d.id}),/AUTH_REQUIRED/);await db.exec('set role authenticated');assert.equal((await db.query('select * from public.cachaste_duels2_live')).rows.length,0);await db.exec('reset role');
});

test('Duelos 2: challenge opt-out, blocked invitation, stable queue wait and both abandoned expiry',async t=>{
 const db=await setup(t);
 await db.query('update cachaste.profiles set allow_challenges=false where user_id=$1',[users[1]]);
 await assert.rejects(d2(db,1,'random',{subject:'M1',requestId:randomUUID()}),/CHALLENGES_DISABLED/);
 await assert.rejects(d2(db,0,'create_duel',{subject:'M1',nickname:'TestAlumno1',requestId:randomUUID()}),/RIVAL_UNAVAILABLE/);
 await db.query('update cachaste.profiles set allow_challenges=true where user_id=$1',[users[1]]);
 const invite=await d2(db,0,'create_duel',{subject:'Historia',nickname:'TestAlumno1',requestId:randomUUID()});await rpc(db,0,'block',{userId:users[1]});
 assert.equal((await d2(db,1,'accept',{duelId:invite.id})).status,'cancelled');
 await rpc(db,0,'unblock',{userId:users[1]});
 const payload={subject:'M1',requestId:randomUUID()};await d2(db,0,'random',payload);const joined=(await db.query('select joined_at from cachaste_duels2.queue where user_id=$1',[users[0]])).rows[0].joined_at;
 assert.equal((await d2(db,0,'random',payload)).waiting,true);assert.deepEqual((await db.query('select joined_at from cachaste_duels2.queue where user_id=$1',[users[0]])).rows[0].joined_at,joined);
 await d2(db,0,'cancel_queue');assert.equal((await db.query('select count(*)::int n from cachaste_duels2.queue')).rows[0].n,0);
 const d=await human(db);await db.query("update cachaste_duels2.matches set expires_at=clock_timestamp()-interval '1 second'where id=$1",[d.id]);const end=await d2(db,0,'duel',{duelId:d.id});assert.equal(end.result.reason,'both_abandoned');assert.equal(end.result.changes[users[0]],0);assert.equal(end.result.changes[users[1]],0);assert.equal((await d2(db,0,'review',{attemptId:d.attemptId})).errors.length,10);
});

test('Duelos 2: all PAES subjects and science tracks retain ten safe real questions',async t=>{
 const db=await setup(t);
 for(const[subject,track]of[['M1',''],['M2',''],['Lectura',''],['Historia',''],['Ciencias','Biología'],['Ciencias','Física'],['Ciencias','Química'],['Ciencias','TP']]){
  const d=await d2(db,0,'create_duel',{subject,track,nickname:'TestAlumno1',requestId:randomUUID()});await d2(db,1,'accept',{duelId:d.id});
  const p=(await db.query('select id,question_keys from cachaste_duels2.players where match_id=$1 order by slot',[d.id])).rows;
  assert.equal(p[0].question_keys.length,10);assert.deepEqual([...p[0].question_keys].sort(),[...p[1].question_keys].sort());
  const a=await d2(db,0,'start',{attemptId:p[0].id});assert.ok(a.question.question);assert.ok(a.question.options.length>=2);assert.equal(a.question.answer,undefined);
  await d2(db,0,'forfeit',{attemptId:p[0].id});await d2(db,1,'forfeit',{attemptId:p[1].id});
 }
});

test('Duelos 2 history counts virtual losses and paginates without repeating results',async t=>{
 const db=await setup(t);
 // Isolated history fixtures test the cursor independently of gameplay scoring.
 await db.query("insert into cachaste_duels2.matches(creator,opponent_kind,subject,season,status,created_at,result)select $1,'bot','M1',cachaste.season(),'finished',clock_timestamp()-make_interval(secs=>n),jsonb_build_object('winner','virtual')from generate_series(1,25)n",[users[0]]);
 const first=await d2(db,0,'duel_history');assert.equal(first.summary.played,25);assert.equal(first.summary.losses,25);assert.equal(first.duels.length,20);assert.ok(first.next);
 const second=await d2(db,0,'duel_history',{before:first.next});assert.equal(second.duels.length,5);assert.equal(second.next,null);assert.equal(new Set([...first.duels,...second.duels].map(d=>d.id)).size,25);
 await assert.rejects(d2(db,0,'duel_history',{before:{id:first.duels[0].id}}),/INVALID_FILTER/);
});
