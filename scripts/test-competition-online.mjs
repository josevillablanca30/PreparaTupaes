// Real GoTrue + PostgREST integration on a disposable LOCAL Supabase stack only.
// No hosted URL, production user, subscription or payment can be modified by this test.
import {createClient} from '@supabase/supabase-js';
import pg from 'pg';
import {readFile,writeFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import assert from 'node:assert/strict';
const status=JSON.parse(await readFile(process.argv[2]||'/tmp/cachaste-supabase-status.json','utf8'));
const url=new URL(status.API_URL),dbUrl=new URL(status.DB_URL);
if(!['localhost','127.0.0.1'].includes(url.hostname)||!['localhost','127.0.0.1'].includes(dbUrl.hostname))throw new Error('Integration test refuses any hosted or production project');
const admin=createClient(url.href,status.SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}}),db=new pg.Client({connectionString:status.DB_URL});await db.connect();
const users=[],clients=[],credentials=[],events=[];const record=(name,details={})=>{events.push({name,passed:true,...details});console.log('PASS',name);};
const call=async(i,operation,payload={})=>{const{data,error}=await clients[i].rpc('cachaste_competition',{operation,payload});if(error)throw error;return data;};
// Only this disposable database may age fixtures or control server clocks. No test hook exists in the app/RPC.
async function agePair(){await db.query("update cachaste.duels set created_at=now()-interval '2 days'");}
async function startBoth(duelId){const list=[];for(let i=0;i<2;i++){const d=await call(i,'duel',{duelId});list.push(await call(i,'start',{attemptId:d.attemptId}));}return list;}
async function finishTurn(i,turn,{correct=true,seconds=1}={}){while(turn.status==='active'){
 const key=(await db.query('select answer from cachaste.questions where key=$1',[turn.question.key])).rows[0].answer;
 await db.query("update cachaste.attempts set presented_at=clock_timestamp()-make_interval(secs=>$2)where id=$1",[turn.id,seconds+.05]);
 turn=await call(i,'answer',{attemptId:turn.id,position:turn.position,choice:correct?key:(key+1)%turn.question.options.length,requestId:randomUUID()});
 }return turn;}
try{
 assert.equal((await db.query('select count(*)::int n from auth.users')).rows[0].n,0,'test stack must start without users');
 for(let i=0;i<2;i++){
  const email='cachaste-ci-'+randomUUID()+'@example.invalid',password=randomUUID()+randomUUID();const{data,error}=await admin.auth.admin.createUser({email,password,email_confirm:true});if(error)throw error;users.push(data.user.id);credentials.push({email,password});
  const client=createClient(url.href,status.ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}});const login=await client.auth.signInWithPassword({email,password});if(login.error)throw login.error;clients.push(client);
  await call(i,'save_profile',{nickname:'TestCachaste'+i,communeCode:i?'05109':'05701',publicRanking:true,allowChallenges:true,showCommune:true,avatar:i});
 }
 record('Two independent accounts authenticate through real GoTrue over HTTP');
 const denied=await clients[0].rpc('cachaste_competition',{operation:'dashboard',payload:{}});assert.equal(denied.error?.code,'42501');
 await db.query("update cachaste.settings set environment='test'");
 for(const id of users)await db.query("insert into cachaste.entitlements(user_id,valid_until,source,status,receipt_hash)values($1,now()+interval '1 hour','test_harness','active',$2)",[id,'isolated-ci-'+id]);
 record('No subscription means server denial; isolated test entitlement never enables production access');
 const original=await call(0,'create_duel',{subject:'M1',nickname:'TestCachaste1',requestId:randomUUID()});await call(1,'accept',{duelId:original.id});
 let turns=[];for(let i=0;i<2;i++){const d=await call(i,'duel',{duelId:original.id});turns.push(await call(i,'start',{attemptId:d.attemptId}));}
 assert.equal(turns[0].question.key,turns[1].question.key);assert.equal(turns[0].question.answer,undefined);assert.equal(turns[0].question.explanations,undefined);
 const hidden=await clients[0].rpc('cachaste_competition',{operation:'review',payload:{attemptId:turns[0].id}});assert.equal(hidden.error?.message,'SOLUTIONS_HIDDEN');record('Both players get the same question, without answers or tutor leakage');
 for(let i=0;i<2;i++)while(turns[i].status==='active'){
  const a=turns[i],answer=(await db.query('select answer from cachaste.questions where key=$1',[a.question.key])).rows[0].answer;
  const choice=i===0?answer:(answer+1)%a.question.options.length,payload={attemptId:a.id,position:a.position,choice,requestId:randomUUID(),elapsedMs:0,score:9999};turns[i]=await call(i,'answer',payload);
  const replay=await call(i,'answer',payload);assert.equal(replay.position,turns[i].position);
 }
 const result=await call(0,'duel',{duelId:original.id});assert.equal(result.status,'finished');assert.equal(result.result.winner,users[0]);assert.equal(result.result.creator.correct,10);assert.equal(result.result.opponent.correct,0);record('Complete 10-versus-10 network duel; server grades and replay cannot duplicate an answer');
 for(let i=0;i<3;i++)await call(0,'duel',{duelId:original.id});assert.equal((await db.query('select count(*)::int n from cachaste.settlements')).rows[0].n,1);
 const ranks=await call(0,'rankings',{mode:'duel',subject:'M1',scope:'Chile'});assert.equal(Number(ranks.me.value),1);assert.equal((await call(1,'rankings',{mode:'duel',subject:'M1',scope:'Chile'})).me.value,0);record('Persistent rankings update once; winner +1 and loser floored at zero');
 assert.equal((await call(1,'review',{attemptId:turns[1].id})).errors.length,10);record('Educational tutor unlocks only after verified final settlement');
 await agePair();
 const invite=await call(0,'create_duel',{subject:'M1',requestId:randomUUID()});const joined=await call(1,'join_code',{code:invite.code});assert.equal(joined.id,invite.id);
 turns=await startBoth(invite.id);
 const first=turns[0],key=(await db.query('select answer from cachaste.questions where key=$1',[first.question.key])).rows[0].answer;
 const receipt={attemptId:first.id,position:0,choice:key,requestId:randomUUID()};
 await call(0,'answer',receipt); // Deliberately discard a successful HTTP response, like a lost connection.
 clients[0]=createClient(url.href,status.ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}});const recovered=await clients[0].auth.signInWithPassword(credentials[0]);if(recovered.error)throw recovered.error;
 turns[0]=await call(0,'attempt',{attemptId:first.id});assert.equal(turns[0].position,1);assert.equal((await call(0,'answer',receipt)).position,1);
 assert.equal((await db.query('select count(*)::int n from cachaste.answers where attempt_id=$1',[first.id])).rows[0].n,1);record('Invitation code and reconnect after a lost response recover one saved answer without duplication');
 turns[0]=await finishTurn(0,turns[0],{correct:false});turns[1]=await finishTurn(1,turns[1]);
 const loss=await call(0,'duel',{duelId:invite.id});assert.equal(loss.result.winner,users[1]);assert.equal(loss.result.changes[users[0]],-1);assert.equal(Number((await call(0,'rankings',{mode:'duel',subject:'M1',scope:'Chile'})).me.value),0);record('A real network defeat removes one competitive star and preserves the nonnegative floor');
 await agePair();
 const queued=await call(0,'random',{subject:'M1'});assert.equal(queued.waiting,true);const randomMatch=await call(1,'random',{subject:'M1'});assert.ok(randomMatch.id);turns=await startBoth(randomMatch.id);
 for(let i=0;i<2;i++)turns[i]=await finishTurn(i,turns[i]);
 const draw=await call(0,'duel',{duelId:randomMatch.id});assert.equal(draw.result.winner,null);assert.equal(draw.result.reason,'draw');assert.deepEqual(Object.values(draw.result.changes),[0,0]);record('Asynchronous random matching and equal correct answers/time produce a persistent draw without star changes');
 await agePair();
 const abandoned=await call(0,'create_duel',{subject:'M1',nickname:'TestCachaste1',requestId:randomUUID()});await call(1,'accept',{duelId:abandoned.id});turns=await startBoth(abandoned.id);
 await db.query("update cachaste.attempts set presented_at=clock_timestamp()-interval '91 seconds'where id=$1",[turns[0].id]);
 const timeoutKey=(await db.query('select answer from cachaste.questions where key=$1',[turns[0].question.key])).rows[0].answer;
 turns[0]=await call(0,'answer',{attemptId:turns[0].id,position:0,choice:timeoutKey,requestId:randomUUID(),elapsedMs:0});assert.equal(turns[0].correct,null);assert.equal((await db.query('select correct from cachaste.attempts where id=$1',[turns[0].id])).rows[0].correct,0);
 await call(0,'forfeit',{attemptId:turns[0].id});assert.equal((await call(1,'duel',{duelId:abandoned.id})).status,'active');
 turns[1]=await finishTurn(1,turns[1]);const forfeit=await call(1,'duel',{duelId:abandoned.id});assert.equal(forfeit.result.winner,users[1]);assert.equal(forfeit.result.reason,'abandonment');record('Server question timeout ignores a forged phone time; abandonment settles only after the rival finishes');
 const finalRank=await call(1,'rankings',{mode:'duel',subject:'M1',scope:'Chile'});assert.equal(Number(finalRank.me.value),2);assert.equal(finalRank.me.wins,2);assert.equal(finalRank.me.losses,1);assert.equal(finalRank.me.draws,1);assert.equal((await db.query('select count(*)::int n from cachaste.settlements')).rows[0].n,4);record('Four complete scenarios retain historical wins, losses, draws and four unique settlements');
 const exposed=await clients[0].from('entitlements').select('*');assert.ok(exposed.error);record('Client cannot access or modify subscription tables');
 await db.query("update cachaste.settings set environment='production'");const locked=await clients[0].rpc('cachaste_competition',{operation:'rankings',payload:{mode:'duel',subject:'M1',scope:'Chile'}});assert.equal(locked.error?.code,'42501');record('Restoring production environment rejects the same test entitlement');
 await writeFile('reports/competition-online-integration.json',JSON.stringify({scope:'disposable local Supabase; real HTTP Auth/PostgREST, not hosted production',events,passed:events.length,failed:0},null,2)+'\n');
}finally{
 for(const id of users){const{error}=await admin.auth.admin.deleteUser(id);if(error)console.error('Fixture cleanup requires attention');}
 await db.query("update cachaste.settings set environment='production'");await db.end();
}
