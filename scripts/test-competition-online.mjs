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
const users=[],clients=[],events=[];const record=(name,details={})=>{events.push({name,passed:true,...details});console.log('PASS',name);};
const call=async(i,operation,payload={})=>{const{data,error}=await clients[i].rpc('cachaste_competition',{operation,payload});if(error)throw error;return data;};
try{
 assert.equal((await db.query('select count(*)::int n from auth.users')).rows[0].n,0,'test stack must start without users');
 for(let i=0;i<2;i++){
  const email='cachaste-ci-'+randomUUID()+'@example.invalid',password=randomUUID()+randomUUID();const{data,error}=await admin.auth.admin.createUser({email,password,email_confirm:true});if(error)throw error;users.push(data.user.id);
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
 const exposed=await clients[0].from('entitlements').select('*');assert.ok(exposed.error);record('Client cannot access or modify subscription tables');
 await db.query("update cachaste.settings set environment='production'");const locked=await clients[0].rpc('cachaste_competition',{operation:'rankings',payload:{mode:'duel',subject:'M1',scope:'Chile'}});assert.equal(locked.error?.code,'42501');record('Restoring production environment rejects the same test entitlement');
 await writeFile('reports/competition-online-integration.json',JSON.stringify({scope:'disposable local Supabase; real HTTP Auth/PostgREST, not hosted production',events,passed:events.length,failed:0},null,2)+'\n');
}finally{
 for(const id of users){const{error}=await admin.auth.admin.deleteUser(id);if(error)console.error('Fixture cleanup requires attention');}
 await db.query("update cachaste.settings set environment='production'");await db.end();
}
