import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {database,users,sessions,grantTest} from '../web/tests/database.mjs';
import {originalCatalogSeed} from '../scripts/seed-original-learning.mjs';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {attachOriginalEngine} from '../learning/original-engine.mjs';
const catalog=dailyCatalog();
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};};
function engine(storage=memory()){
 const ctx=vm.createContext({Intl,Date,console});for(const file of ['learning-core.js','daily-curriculum.js','daily-core.js'])vm.runInContext(readFileSync(new URL('../'+file,import.meta.url),'utf8'),ctx);
 return ctx.CachasteDaily.create(storage,catalog.items,ctx.CachasteCurriculum.subjects,undefined,()=>0.37,catalog.texts);
}
async function asUser(db,user,fn){
 await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({sub:users[user],session_id:sessions[user],role:'authenticated'})]);await db.exec('set role authenticated');
 try{return await fn();}finally{await db.exec('reset role');}
}
const invoke=(db,user,operation,payload={})=>asUser(db,user,async()=>(await db.query('select public.cachaste_original_learning($1,$2::jsonb) result',[operation,JSON.stringify(payload)])).rows[0].result);
const access=(db,user)=>asUser(db,user,async()=>(await db.query('select public.cachaste_learning_access() result')).rows[0].result);
const proposal=(E,mode='lesson',subject='M1',concept)=>{
 E.close();if(mode==='diagnostic')E.startDiagnosis(subject);else if(mode==='express-exam')E.startExpress(subject);else E.start(subject,2,'lesson',concept||catalog.items.find(q=>q.subjectKey===subject)?.concept);
 const s=E.state.session;assert.ok(s,'original engine must create a real activity');return {requestKey:crypto.randomUUID(),mode:s.mode,subject:s.subject,track:s.track,concept:s.concept,keys:[...s.keys]};
};
async function complete(db,user,activity){
 for(let i=0;i<activity.keys.length;i++)await invoke(db,user,'answer',{attemptId:activity.id,position:i,selectedIndex:catalog.items.find(q=>q.key===activity.keys[i]).answer});
 return invoke(db,user,'complete',{attemptId:activity.id});
}
test('Original motor: 3 lesson stages per subject, safe recovery, canonical answers and no local-storage bypass',async()=>{
 const db=await database();try{
 await db.exec(originalCatalogSeed());
 assert.equal((await access(db,0)).tier,'unavailable');
 await assert.rejects(()=>invoke(db,0,'state'),/BASIC_NOT_READY/);
 await db.exec('update cachaste_web.basic_feature_flags set original_learning_enabled=true');
 assert.equal((await access(db,0)).tier,'basica');
 const E=engine();let first;
 for(let stage=0;stage<3;stage++){
  const p=proposal(E);const result=await invoke(db,0,'start',p);const a=result.activity;assert.equal(a.keys.length,2);first??=a;
  assert.deepEqual((await invoke(db,0,'start',p)).activity,a,'same UUID must recover exact server activity');
  assert.equal((await invoke(db,0,'state')).activity.id,a.id,'a second device recovers the same attempt');
  await assert.rejects(()=>invoke(db,1,'answer',{attemptId:a.id,position:0,selectedIndex:0}),/ATTEMPT_NOT_FOUND/);
  await assert.rejects(()=>invoke(db,0,'answer',{attemptId:a.id,position:1,selectedIndex:0}),/ANSWER_OUT_OF_ORDER/);
  await assert.rejects(()=>invoke(db,0,'answer',{attemptId:a.id,position:0,selectedIndex:99}),/INVALID_ANSWER/);
  const result2=await complete(db,0,a);assert.equal(result2.correct,2);
  assert.equal((await invoke(db,0,'complete',{attemptId:a.id})).replayed,true);
 }
 await assert.rejects(()=>invoke(db,0,'start',proposal(engine())),/BASIC_QUOTA_EXHAUSTED/);
 const other=await invoke(db,0,'start',proposal(engine(),'lesson','M2'));assert.equal(other.activity.subject,'M2');
 await complete(db,0,other.activity);
 const state=await invoke(db,0,'state'),daily=state.documents.find(d=>d.key==='cachaste-daily-v1').value;
 assert.equal(daily.completed.length,4);assert.equal(daily.attempts.length,8);assert.ok(daily.days);assert.equal(state.activity,null);
 assert.equal((await db.query('select count(*) n from cachaste_web.basic_usage where user_id=$1',[users[0]])).rows[0].n,4);
 }finally{await db.close();}
});
test('Original diagnoses and Express, empty technical failures, daily reset and Premium priority',async()=>{
 const db=await database();try{
 await db.exec(originalCatalogSeed());await db.exec('update cachaste_web.basic_feature_flags set original_learning_enabled=true');
 const E=engine();const p=proposal(E,'diagnostic','Lectura'),a=(await invoke(db,0,'start',p)).activity;
 assert.equal(a.keys.length,30);assert.equal((await invoke(db,0,'abandon',{attemptId:a.id})).released,true);
 const b=(await invoke(db,0,'start',{...p,requestKey:crypto.randomUUID()})).activity;await complete(db,0,b);
 await assert.rejects(()=>invoke(db,0,'start',{...p,requestKey:crypto.randomUUID()}),/BASIC_QUOTA_EXHAUSTED/);
 const ex=proposal(engine(),'express-exam','Historia'),exA=(await invoke(db,0,'start',ex)).activity;assert.equal(exA.keys.length,15);await complete(db,0,exA);
 const canonical=(await invoke(db,0,'state')).documents.find(d=>d.key==='cachaste-daily-v1').value;const storage=memory();storage.setItem('cachaste-daily-v1',JSON.stringify(canonical));const restored=engine(storage);const {restoreVerifiedHistory}=await import('../learning/verified-history.mjs');restoreVerifiedHistory(restored,catalog);assert.equal(restored.state.expressReports[0].total,15);assert.equal(restored.state.expressReports[0].subject,'Historia');assert.equal(restored.state.diagnosticReports[0].total,30);
 await assert.rejects(()=>invoke(db,0,'start',{...ex,requestKey:crypto.randomUUID()}),/BASIC_QUOTA_EXHAUSTED/);
 // A previous day does not spend today's Express. Lifetime diagnosis still does.
 await db.exec("update cachaste_web.original_learning_sessions set usage_day=usage_day-1 where kind='expressExam';update cachaste_web.basic_usage set usage_day=usage_day-1 where kind='expressExam'");
 assert.ok((await invoke(db,0,'start',{...ex,requestKey:crypto.randomUUID()})).activity);
 await db.exec("update cachaste.settings set environment='test'");await grantTest(db,0);assert.equal((await access(db,0)).tier,'premium');assert.equal((await invoke(db,0,'start',proposal(engine()))).unlimited,true);
 await db.query("update cachaste.entitlements set valid_until=now()-interval '1 second' where user_id=$1",[users[0]]);assert.equal((await access(db,0)).tier,'basica');
 }finally{await db.close();}
});
test('Original UI adapter preserves engine selection and tutor; uncertain network retries same request',async()=>{
 const E=engine(),storage=memory(),calls=[],events=[];let attempt=null,fail=true;
 const rpc=async(operation,p)=>{calls.push([operation,p]);if(operation==='start'){if(fail){fail=false;throw Error('network');}attempt={id:crypto.randomUUID(),basicAttempt:true,subject:p.subject,track:p.track,mode:p.mode,concept:p.concept,keys:p.keys,index:0,results:[],stage:'intro',selected:null,checked:false};return {tier:'basica',activity:attempt};}throw Error('unexpected');};
 attachOriginalEngine({engine:E,rpc,tier:'basica',storage,notify:e=>events.push(e)});
 const concept=catalog.items.find(q=>q.subjectKey==='M1').concept;
 E.start('M1',2,'lesson',concept);await new Promise(r=>setTimeout(r,10));assert.equal(E.state.session,null);
 E.start('M1',2,'lesson',concept);await new Promise(r=>setTimeout(r,10));assert.ok(E.state.session.basicAttempt);
 assert.equal(calls[0][1].requestKey,calls[1][1].requestKey);assert.equal(JSON.stringify(calls[0][1].keys),JSON.stringify(calls[1][1].keys));
 assert.ok(E.byKey.get(E.state.session.keys[0]).teaching,'original tutor data retained');
});
test('Two Basic Duelos 2.0 daily, no charge for queue/failed activation, Premium never spends Basic quota',async()=>{
 const db=await database();try{
 const {profile}=await import('../web/tests/database.mjs');for(let i=0;i<3;i++)await profile(db,i);
 await db.exec('update cachaste_web.basic_feature_flags set original_learning_enabled=true,duel_admission_enabled=true');
 const d2=(i,operation,payload={})=>asUser(db,i,async()=>(await db.query('select public.cachaste_duels2($1,$2::jsonb) result',[operation,JSON.stringify(payload)])).rows[0].result);
 const bot=async(i)=>{const p={subject:'M1',requestId:crypto.randomUUID()};assert.equal((await d2(i,'random',p)).waiting,true);await db.query("update cachaste_duels2.queue set joined_at=clock_timestamp()-interval '11 seconds' where user_id=$1",[users[i]]);return d2(i,'random',p);};
 for(let n=0;n<2;n++){
  const d=await bot(0);assert.equal(d.opponentKind,'bot');assert.equal((await d2(0,'duel',{duelId:d.id})).id,d.id);
  await d2(0,'forfeit',{attemptId:d.attemptId});await db.query("update cachaste_duels2.matches set expires_at=clock_timestamp()-interval '1 second' where id=$1",[d.id]);await d2(0,'duel',{duelId:d.id});
 }
 await assert.rejects(()=>bot(0),/BASIC_DUEL_LIMIT_REACHED/);
 assert.equal((await db.query("select count(*) n from cachaste_web.basic_usage where user_id=$1 and kind='duel'",[users[0]])).rows[0].n,2);
 await db.exec("update cachaste.settings set environment='test'");await grantTest(db,1);
 const premiumDuel=await bot(1);assert.ok(premiumDuel.id);
 assert.equal((await db.query("select count(*) n from cachaste_web.basic_usage where user_id=$1 and kind='duel'",[users[1]])).rows[0].n,0);
 }finally{await db.close();}
});
test('Existing web subscription, trial, cancellation, expiry and both tester grants keep priority over Basic',async()=>{
 const db=await database();try{
 const {installCurrentEntitlementFixture}=await import('./helpers/current-entitlement-fixture.mjs');await installCurrentEntitlementFixture(db);
 await db.exec('update cachaste_web.basic_feature_flags set original_learning_enabled=true');
 // Synthetic subscriptions only; no provider request or payment is made.
 await db.exec('update cachaste_web.policy set payments_enabled=true,tax_ready=true');
 const checkout=crypto.randomUUID();await db.query("insert into cachaste_web.checkouts(id,user_id,plan,provider_plan_id) values($1,$2,'mensual','fixture')",[checkout,users[0]]);
 await db.query("insert into cachaste_web.subscriptions(provider_id,checkout_id,user_id,plan,provider_status,paid_until,observed_at,live_mode) values('fixture-subscription',$1,$2,'mensual','authorized',now()+interval '1 day',now(),true)",[checkout,users[0]]);
 assert.equal((await access(db,0)).tier,'premium');
 await db.exec("update cachaste_web.subscriptions set provider_status='cancelled'");assert.equal((await access(db,0)).tier,'premium','cancelled renewal retains paid time');
 await db.exec("update cachaste_web.subscriptions set paid_until=now()-interval '1 day'");assert.equal((await access(db,0)).tier,'basica');
 await db.exec("update cachaste_web.subscriptions set provider_status='authorized',trial_until=now()+interval '7 days'");assert.equal((await access(db,0)).tier,'premium');
 await db.query("insert into cachaste.closed_test_access(user_id,valid_until) values($1,now()+interval '1 year')",[users[0]]);
 await db.exec("update cachaste_web.subscriptions set trial_until=now()-interval '1 day'");assert.equal((await access(db,0)).tier,'premium','special benefit survives subscription expiry');
 await db.query("update auth.users set email='fixture-tester@example.test',email_confirmed_at=now() where id=$1",[users[1]]);
 await db.exec("insert into cachaste.closed_test_emails(email_hash,valid_until) values(sha256(convert_to('fixture-tester@example.test','UTF8')),now()+interval '1 year')");assert.equal((await access(db,1)).tier,'premium','existing confirmed tester email grant');
 assert.equal((await access(db,2)).tier,'basica');
 await db.query("update auth.sessions set not_after=now()-interval '1 second' where user_id=$1",[users[0]]);await assert.rejects(()=>access(db,0),/AUTH_REQUIRED/);
 }finally{await db.close();}
});
test('All original subjects and science mentions share their approved subject quota; free practice retains its mode',async()=>{
 const db=await database();try{
 await db.exec(originalCatalogSeed());await db.exec('update cachaste_web.basic_feature_flags set original_learning_enabled=true');
 for(const subject of ['M1','M2','Lectura','Historia']){
  const E=engine();const a=(await invoke(db,0,'start',proposal(E,'lesson',subject))).activity;assert.equal(a.subject,subject);assert.equal(a.mode,'lesson');await complete(db,0,a);
 }
 for(const track of ['Biología','Física','Química']){
  const E=engine();E.state.track=track;const a=(await invoke(db,0,'start',proposal(E,'lesson','Ciencias'))).activity;assert.equal(a.track,track);await complete(db,0,a);
 }
 const tp=engine();tp.state.track='TP';await assert.rejects(()=>invoke(db,0,'start',proposal(tp,'lesson','Ciencias')),/BASIC_QUOTA_EXHAUSTED/);
 const invalid=proposal(engine(),'lesson','Ciencias');await assert.rejects(()=>invoke(db,1,'start',invalid),/SCIENCE_TRACK_REQUIRED/);
 const E=engine();E.start('Historia',4,'free');const s=E.state.session;
 const free=(await invoke(db,0,'start',{requestKey:crypto.randomUUID(),mode:s.mode,subject:s.subject,track:s.track,concept:s.concept,keys:[...s.keys]})).activity;
 assert.equal(free.mode,'free');assert.equal(free.stage,'question');assert.equal(free.keys.length,4);await complete(db,0,free);
 }finally{await db.close();}
});
