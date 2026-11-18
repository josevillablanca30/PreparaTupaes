import {completeVerifiedBasicAttempt} from '../shared/basic-verified-completion.mjs';
import {issueBasicQuestions} from '../shared/basic-question-issuance.mjs';
import {verifyBasicAnswers} from '../shared/basic-answer-verification.mjs';
import {basicQuotaGateway} from '../client/basic-quota.mjs';
import assert from 'node:assert/strict';
import {BASIC_LIMITS,MONTHLY_TRIAL,PAES_SUBJECTS,accessTier,basicQuota} from '../shared/access-tiers.mjs';
assert.equal(PAES_SUBJECTS.length,5);
assert.equal(accessTier({active:true}), 'premium');
assert.equal(accessTier({active:false,basicEnabled:true}), 'basica');
assert.equal(accessTier({active:false}), 'unavailable');
for(const subject of PAES_SUBJECTS){
 assert.equal(basicQuota({kind:'lesson',subject,used:2}).allowed,true);
 assert.equal(basicQuota({kind:'lesson',subject,used:3}).allowed,false);
 assert.equal(basicQuota({kind:'diagnostic',subject,diagnosticUsed:false}).allowed,true);
 assert.equal(basicQuota({kind:'diagnostic',subject,diagnosticUsed:true}).allowed,false);
}
assert.equal(basicQuota({kind:'expressExam',used:1}).allowed,false);
assert.equal(basicQuota({kind:'duel',used:1}).allowed,true);
assert.equal(basicQuota({kind:'duel',used:2}).allowed,false);
assert.equal(basicQuota({kind:'fullExam',used:0}).allowed,false);
assert.equal(MONTHLY_TRIAL.renewalPlan,'mensual');
assert.equal(MONTHLY_TRIAL.days,7);
assert.equal(BASIC_LIMITS.lessonsPerSubjectPerDay,3);
const {basicQuota:remoteQuota}=await import('../client/basic-quota.mjs');
const calls=[];
const sdk={rpc:async(name,args)=>{calls.push({name,args});return {data:{allowed:true,remaining:2,tier:'basica'},error:null};}};
assert.equal((await remoteQuota({sdk,kind:'lesson',subject:'m1'})).allowed,true);
assert.deepEqual(calls[0],{name:'cachaste_basic_quota',args:{operation:'check',kind:'lesson',subject:'m1',event_id:null}});
const id='ad4d7f88-7f50-4d5c-a833-111111111111';
await remoteQuota({sdk,kind:'duel',operation:'consume',eventId:id});
assert.equal(calls[1].args.event_id,id);
await assert.rejects(()=>remoteQuota({sdk,kind:'lesson',subject:'all'}),/INVALID_SUBJECT/);
await assert.rejects(()=>remoteQuota({sdk,kind:'duel',operation:'consume'}),/EVENT_ID_REQUIRED/);
await assert.rejects(()=>remoteQuota({sdk:{rpc:async()=>({error:Error('DATABASE_DOWN')})},kind:'duel'}),/DATABASE_DOWN/);
console.log('Básica/Premium: reglas y cliente RPC verificados');

let sent;
const fetcher=async(path,options)=>{sent={path,options};return {ok:true,json:async()=>({allowed:true,tier:'basica',remaining:2})};};
assert.equal((await basicQuotaGateway({kind:'lesson',subject:'m1',fetcher})).remaining,2);
assert.equal(sent.path,'/api/basic/quota');
assert.equal(sent.options.headers['x-cachaste-request'],'1');
assert.deepEqual(JSON.parse(sent.options.body),{operation:'check',kind:'lesson',subject:'m1',eventId:null});
await assert.rejects(()=>basicQuotaGateway({kind:'duel',fetcher:async()=>({ok:false,status:503})}),/BASIC_NOT_READY/);
await assert.rejects(()=>basicQuotaGateway({kind:'duel',fetcher:async()=>({ok:true,json:async()=>({})})}),/INVALID_QUOTA_RESPONSE/);

await assert.rejects(()=>basicQuotaGateway({kind:'duel',fetcher:async()=>({ok:true,json:async()=>({allowed:true,tier:'basica',remaining:-1})})}),/INVALID_QUOTA_RESPONSE/);
await assert.rejects(()=>basicQuotaGateway({kind:'duel',fetcher:async()=>({ok:true,json:async()=>({allowed:true,tier:'basica',remaining:'2'})})}),/INVALID_QUOTA_RESPONSE/);
assert.equal((await basicQuotaGateway({kind:'duel',fetcher:async()=>({ok:true,json:async()=>({allowed:true,tier:'basica',replayed:true})})})).replayed,true);

import {readFileSync} from 'node:fs';
const migration=readFileSync(new URL('../supabase/migrations/20261116193000_cachaste_basic_quota.sql',import.meta.url),'utf8');
assert.match(migration,/if operation='consume' then raise exception 'COMPLETION_ATTESTATION_REQUIRED'/);
assert.doesNotMatch(migration,/insert into cachaste_web\.basic_usage\s*\(/i);
assert.match(migration,/create unique index if not exists basic_diagnostic_once_idx/);
const gatewaySource=readFileSync(new URL('../server/gateway.mjs',import.meta.url),'utf8');
assert.match(gatewaySource,/WEB_BASIC_EDUCATIONAL_GUARDS_READY/);
assert.match(gatewaySource,/SERVER_VERIFIED_COMPLETION_REQUIRED/);

assert.match(migration,/u uuid:=cachaste\.require_user\(\)/);
assert.doesNotMatch(migration,/u uuid:=auth\.uid\(\)/);

const {basicQuotaSummary}=await import('../client/basic-quota.mjs');
const sample={tier:'basica',day:'2026-11-16',
 lessonsRemaining:Object.fromEntries(PAES_SUBJECTS.map(x=>[x,3])),
 diagnosticsRemaining:Object.fromEntries(PAES_SUBJECTS.map(x=>[x,1])),
 expressExamsRemaining:1,duelsRemaining:2,fullExamsRemaining:0};
const summaryFetch=data=>async()=>Response.json(data);
assert.equal((await basicQuotaSummary({fetcher:summaryFetch(sample)})).lessonsRemaining.m1,3);
assert.equal((await basicQuotaSummary({fetcher:summaryFetch({tier:'premium',unlimited:true})})).tier,'premium');
for(const invalid of [
 {...sample,lessonsRemaining:{...sample.lessonsRemaining,m1:4}},
 {...sample,diagnosticsRemaining:{...sample.diagnosticsRemaining,m2:-1}},
 {...sample,expressExamsRemaining:2},
 {...sample,fullExamsRemaining:1},
 {...sample,day:'not-a-date'}
]){
 await assert.rejects(()=>basicQuotaSummary({fetcher:summaryFetch(invalid)}),/INVALID_QUOTA_RESPONSE/);
}
await assert.rejects(()=>basicQuotaSummary({fetcher:async()=>Response.json({error:'BASIC_NOT_READY'},{status:503})}),/BASIC_NOT_READY/);

const {renderBasicQuotaSummary}=await import('../client/basic-quota-view.mjs');
const rendered=renderBasicQuotaSummary(sample);
assert.match(rendered,/Matemática M1/);
assert.match(rendered,/Competencia Lectora/);
assert.match(rendered,/Ensayos PAES completos: solo Premium/);
assert.match(renderBasicQuotaSummary({tier:'premium',unlimited:true}),/acceso Premium/);
assert.throws(()=>renderBasicQuotaSummary({...sample,duelsRemaining:3}),/INVALID_QUOTA_RESPONSE/);

const accountSource=readFileSync(new URL('../client/account.mjs',import.meta.url),'utf8');
assert.match(accountSource,/config\?\.basicEnabled===true&&account\?\.access\?\.active!==true/);
assert.match(accountSource,/renderBasicQuotaSummary\(basicSummary\)/);
assert.match(accountSource,/basicSummary=null;account=null/);

let summaryRequest;
await basicQuotaSummary({accessToken:'example-session-token',fetcher:async(url,options)=>{summaryRequest={url,options};return Response.json(sample);}});
assert.equal(summaryRequest.url,'/api/basic/summary');
assert.equal(summaryRequest.options.headers.authorization,'Bearer example-session-token');
assert.match(readFileSync(new URL('../client/account.mjs',import.meta.url),'utf8'),/basicQuotaSummary\(\{accessToken:session\.access_token\}\)/);

let quotaRequest;

await basicQuotaGateway({kind:'lesson',subject:'m1',accessToken:'example-session-token',fetcher:async(url,options)=>{quotaRequest={url,options};return Response.json({allowed:true,tier:'basica',remaining:3});}});
assert.equal(quotaRequest.url,'/api/basic/quota');
assert.equal(quotaRequest.options.headers.authorization,'Bearer example-session-token');
assert.equal(quotaRequest.options.headers['x-cachaste-request'],'1');
await assert.rejects(()=>basicQuotaGateway({kind:'lesson',subject:'m1',accessToken:'short',fetcher:async()=>{throw Error('MUST_NOT_FETCH');}}),/INVALID_AUTH_TOKEN/);

const completionSql=readFileSync(new URL('../supabase/migrations/20261116211000_cachaste_basic_server_consumption.sql',import.meta.url),'utf8');
assert.match(completionSql,/auth\.role\(\) is distinct from 'service_role'/);
assert.match(completionSql,/pg_advisory_xact_lock/);
assert.match(completionSql,/EVENT_ID_REUSED/);
assert.match(completionSql,/replayed',true/);
assert.match(completionSql,/revoke all on function public\.cachaste_basic_record_verified_completion\(uuid,text,text,uuid\) from public,anon,authenticated/);
assert.match(completionSql,/grant execute on function public\.cachaste_basic_record_verified_completion\(uuid,text,text,uuid\) to service_role/);

const {classifyDailyCompletion,classifyDuelCompletion}=await import('../shared/basic-completion-contract.mjs');
assert.deepEqual(classifyDailyCompletion({mode:'lesson',subject:'M1'}),{kind:'lesson',subject:'m1'});
assert.deepEqual(classifyDailyCompletion({mode:'lesson',subject:'Ciencias'}),{kind:'lesson',subject:'ciencias'});
assert.deepEqual(classifyDailyCompletion({mode:'diagnostic',subject:'Historia'}),{kind:'diagnostic',subject:'historia'});
assert.deepEqual(classifyDailyCompletion({mode:'express-exam',subject:'Lectora'}),{kind:'expressExam',subject:'all'});
for(const mode of ['free','smart','unit-exam','full-exam','unknown'])assert.equal(classifyDailyCompletion({mode,subject:'M1'}),null);
assert.equal(classifyDailyCompletion({mode:'lesson',subject:'invalid'}),null);
assert.deepEqual(classifyDuelCompletion({finished:true,matchId:'ad4d7f88-7f50-4d5c-a833-111111111111'}),{kind:'duel',subject:'all',eventId:'ad4d7f88-7f50-4d5c-a833-111111111111'});
assert.equal(classifyDuelCompletion({finished:false,matchId:'ad4d7f88-7f50-4d5c-a833-111111111111'}),null);
assert.equal(classifyDuelCompletion({finished:true,matchId:'not-a-uuid'}),null);

const verifiedDuelsSql=readFileSync(new URL('../supabase/migrations/20261116214000_cachaste_basic_verified_duels.sql',import.meta.url),'utf8');
assert.match(verifiedDuelsSql,/auth\.role\(\) is distinct from 'service_role'/);
assert.match(verifiedDuelsSql,/m\.status<>'finished'/);
assert.match(verifiedDuelsSql,/p\.match_id=p_match_id and p\.user_id=p_user_id/);
assert.match(verifiedDuelsSql,/player_status not in \('complete','forfeit'\)/);
assert.match(verifiedDuelsSql,/basic_record_verified_completion\(p_user_id,'duel','all',p_match_id\)/);
assert.match(verifiedDuelsSql,/revoke all on function public\.cachaste_basic_record_finished_duel\(uuid,uuid\) from public,anon,authenticated/);

assert.match(verifiedDuelsSql,/m\.result is null/);
assert.match(verifiedDuelsSql,/jsonb_typeof\(m\.result\)<>'object'/);
assert.match(verifiedDuelsSql,/coalesce\(m\.result->>'reason',''\) not in/);

assert.match(verifiedDuelsSql,/not \(p_user_id=m\.creator or \(m\.opponent is not null and p_user_id=m\.opponent\)\)/);

assert.match(verifiedDuelsSql,/coalesce\(m\.result->'creator'->>'status',''\) not in/);
assert.match(verifiedDuelsSql,/coalesce\(m\.result->'opponent'->>'status',''\) not in/);

// Literal escaped newlines in SQL are syntax errors, not formatting.
assert.equal(verifiedDuelsSql.includes(String.raw`\n`),false,'SQL migration must not contain literal backslash-n tokens');

// Release blocker: do not accidentally enable Basic while educational activity
// verification, progress authorization and duel admission remain premium-only.
assert.match(gatewaySource,/basicEnabled:false/);
assert.match(gatewaySource,/WEB_BASIC_EDUCATIONAL_GUARDS_READY/);
assert.match(gatewaySource,/SERVER_VERIFIED_COMPLETION_REQUIRED/);
const legacyDuelsSource=readFileSync(new URL('../supabase/migrations/20261110130920_cachaste_duels2_isolated.sql',import.meta.url),'utf8');
assert.match(legacyDuelsSource,/cachaste\.premium\(u\)/);
const legacyProgressSource=readFileSync(new URL('../supabase/migrations/20261024144927_cachaste_web_commercial.sql',import.meta.url),'utf8');
assert.match(legacyProgressSource,/cachaste\.premium\(u\)/);

const duelReservationSql=readFileSync(new URL('../supabase/migrations/20261116220000_cachaste_basic_duel_activation_reservations.sql',import.meta.url),'utf8');
assert.match(duelReservationSql,/before update of status on cachaste_duels2\.matches/);
assert.match(duelReservationSql,/old\.status is distinct from 'invited'/);
assert.match(duelReservationSql,/new\.status='active'/);
assert.match(duelReservationSql,/pg_advisory_xact_lock/);
assert.match(duelReservationSql,/order by x\.user_id/);
assert.match(duelReservationSql,/if used_count>=2/);
assert.match(duelReservationSql,/not cachaste\.premium\(u\)/);
assert.match(duelReservationSql,/new\.opponent_kind='human'/);
assert.equal(duelReservationSql.includes(String.raw`\\n`),false);

const basicDuelAdmissionSql=readFileSync(new URL('../supabase/migrations/20261116223000_cachaste_basic_duel_admission.sql',import.meta.url),'utf8');
assert.match(basicDuelAdmissionSql,/duel_admission_enabled boolean not null default false/);
assert.match(basicDuelAdmissionSql,/values\(true,false\)/);
assert.match(basicDuelAdmissionSql,/revoke all on cachaste_web\.basic_feature_flags from public,anon,authenticated/);
assert.match(basicDuelAdmissionSql,/cachaste\.premium\(u\) or cachaste_web\.basic_duels_enabled\(\)/);
assert.match(basicDuelAdmissionSql,/cachaste\.community_restrictions/);
assert.match(basicDuelAdmissionSql,/COMMUNITY_REQUIRED/);
assert.equal(basicDuelAdmissionSql.includes(String.raw`\\n`),false);

// Match admission remains available for review/in-progress actions even after quota exhaustion.
// The activation trigger is the authoritative place that rejects new matches.
assert.doesNotMatch(basicDuelAdmissionSql,/basic_used>=2/);
assert.match(duelReservationSql,/BASIC_DUEL_LIMIT_REACHED/);

const basicReadonlyProgressSql=readFileSync(new URL('../supabase/migrations/20261116230000_cachaste_basic_readonly_progress.sql',import.meta.url),'utf8');
assert.match(basicReadonlyProgressSql,/progress_snapshot_enabled boolean not null default false/);
assert.match(basicReadonlyProgressSql,/operation<>'snapshot' or not cachaste_web\.basic_progress_snapshot_enabled\(\)/);
assert.match(basicReadonlyProgressSql,/if operation<>'put'then raise exception 'INVALID_OPERATION'/);
assert.match(basicReadonlyProgressSql,/pg_advisory_xact_lock/);
assert.match(basicReadonlyProgressSql,/cachaste\.premium\(u\)/);
assert.equal(basicReadonlyProgressSql.includes(String.raw`\\n`),false);

const {classifyDailyAdmission}=await import('../shared/basic-completion-contract.mjs');
assert.deepEqual(classifyDailyAdmission({mode:'lesson',subject:'M1'}),{allowed:true,kind:'lesson',subject:'m1'});
assert.deepEqual(classifyDailyAdmission({mode:'diagnostic',subject:'Ciencias'}),{allowed:true,kind:'diagnostic',subject:'ciencias'});
assert.deepEqual(classifyDailyAdmission({mode:'express-exam',subject:'Historia'}),{allowed:true,kind:'expressExam',subject:'all'});
assert.deepEqual(classifyDailyAdmission({mode:'full-exam',subject:'M1'}),{allowed:false,reason:'PREMIUM_REQUIRED'});
assert.deepEqual(classifyDailyAdmission({mode:'unit-exam',subject:'M1'}),{allowed:false,reason:'PREMIUM_REQUIRED'});
assert.deepEqual(classifyDailyAdmission({mode:'free',subject:'M1'}),{allowed:false,reason:'ACTIVITY_NOT_AVAILABLE_IN_BASIC'});
assert.deepEqual(classifyDailyAdmission({mode:'lesson',subject:'invalid'}),{allowed:false,reason:'INVALID_SUBJECT_OR_MODE'});

const {basicActivityAdmission}=await import('../client/basic-quota.mjs');
const admissionCalls=[];
const deniedAdmission=await basicActivityAdmission({mode:'lesson',subject:'M1',accessToken:'test-token-123456',fetcher:async(url,options)=>{
 admissionCalls.push({url,options});
 return Response.json({allowed:false,kind:'lesson',subject:'m1',tier:'basica',remaining:0,preflightOnly:true});
}});
assert.equal(deniedAdmission.allowed,false);
assert.equal(admissionCalls[0].url,'/api/basic/admission');
assert.equal(admissionCalls[0].options.headers.authorization,'Bearer test-token-123456');
await assert.rejects(()=>basicActivityAdmission({mode:'lesson',subject:'M1',fetcher:async()=>Response.json({allowed:true,kind:'lesson',subject:'m1',tier:'basica',remaining:-1,preflightOnly:true})}),/INVALID_ADMISSION_RESPONSE/);
await assert.rejects(()=>basicActivityAdmission({mode:'full-exam',subject:'M1',fetcher:async()=>Response.json({reason:'PREMIUM_REQUIRED'},{status:403})}),/PREMIUM_OR_BASIC_RESTRICTION/);

const {withBasicAdmission}=await import('../client/basic-quota.mjs');
let startInvocations=0;
const noStart=()=>{startInvocations++;};
const basicExhausted=await withBasicAdmission({mode:'lesson',subject:'M1',start:noStart,fetcher:async()=>Response.json({allowed:false,kind:'lesson',subject:'m1',tier:'basica',remaining:0,preflightOnly:true})});
assert.equal(basicExhausted.started,false);
assert.equal(basicExhausted.reason,'BASIC_QUOTA_EXHAUSTED');
const basicPreflight=await withBasicAdmission({mode:'lesson',subject:'M1',start:noStart,fetcher:async()=>Response.json({allowed:true,kind:'lesson',subject:'m1',tier:'basica',remaining:3,preflightOnly:true})});
assert.equal(basicPreflight.started,false);
assert.equal(basicPreflight.reason,'BASIC_ATTEMPT_RESERVATION_NOT_READY');
assert.equal(startInvocations,0);

const learningAttemptSql=readFileSync(new URL('../supabase/migrations/20261116234000_cachaste_basic_learning_attempts.sql',import.meta.url),'utf8');
assert.match(learningAttemptSql,/learning_attempts_enabled boolean not null default false/);
assert.match(learningAttemptSql,/pg_advisory_xact_lock/);
assert.match(learningAttemptSql,/basic_learning_diagnostic_once_idx/);
assert.match(learningAttemptSql,/p_kind='diagnostic' or a.usage_day=today_chile/);
assert.match(learningAttemptSql,/select count\(\*\)::integer into used_count from cachaste_web.basic_learning_attempts a/);
assert.match(learningAttemptSql,/BASIC_ATTEMPTS_NOT_READY/);
assert.match(learningAttemptSql,/alter table cachaste_web.basic_learning_attempts enable row level security/);
assert.match(learningAttemptSql,/grant execute on function public.cachaste_reserve_basic_learning_attempt\(text,text,uuid\) to authenticated/);

const {basicReserveActivity}=await import('../client/basic-quota.mjs');
const validAttempt={allowed:true,tier:'basica',attemptId:'a2f817ca-a0e1-4d83-a6d1-99319124ab7a',remaining:2,day:'2026-11-16'};
const reservation=await basicReserveActivity({mode:'lesson',subject:'M1',requestKey:'a2f817ca-a0e1-4d83-a6d1-99319124ab7a',fetcher:async()=>Response.json(validAttempt)});
assert.equal(reservation.attemptId,validAttempt.attemptId);
await assert.rejects(()=>basicReserveActivity({mode:'lesson',subject:'M1',requestKey:'a2f817ca-a0e1-4d83-a6d1-99319124ab7a',fetcher:async()=>Response.json({...validAttempt,day:'invalid'})}),/INVALID_RESERVATION_RESPONSE/);
await assert.rejects(()=>basicReserveActivity({mode:'lesson',subject:'M1',requestKey:'a2f817ca-a0e1-4d83-a6d1-99319124ab7a',fetcher:async()=>Response.json({...validAttempt,attemptId:'invalid'})}),/INVALID_RESERVATION_RESPONSE/);
await assert.rejects(()=>basicReserveActivity({mode:'lesson',subject:'M1',requestKey:'a2f817ca-a0e1-4d83-a6d1-99319124ab7a',fetcher:async()=>Response.json({error:'BASIC_NOT_READY'},{status:503})}),/BASIC_NOT_READY/);

const {withBasicReservation}=await import('../client/basic-quota.mjs');
let launches=0,launchAttempt=null;
const launch=async({attemptId})=>{launches++;launchAttempt=attemptId;return 'started';};
const exhausted=await withBasicReservation({mode:'lesson',subject:'M1',requestKey:'a2f817ca-a0e1-4d83-a6d1-99319124ab7a',start:launch,fetcher:async()=>Response.json({allowed:false,tier:'basica',remaining:0})});
assert.equal(exhausted.started,false);
assert.equal(launches,0);
const launched=await withBasicReservation({mode:'lesson',subject:'M1',requestKey:'a2f817ca-a0e1-4d83-a6d1-99319124ab7a',start:launch,fetcher:async()=>Response.json(validAttempt)});
assert.equal(launched.started,true);
assert.equal(launched.value,'started');
assert.equal(launchAttempt,validAttempt.attemptId);
assert.equal(launches,1);
await assert.rejects(()=>withBasicReservation({mode:'lesson',subject:'M1',requestKey:'a2f817ca-a0e1-4d83-a6d1-99319124ab7a',start:launch,fetcher:async()=>Response.json({...validAttempt,attemptId:'fake'})}),/INVALID_RESERVATION_RESPONSE/);
assert.equal(launches,1);

assert.match(readFileSync('web/supabase/migrations/20261116234000_cachaste_basic_learning_attempts.sql','utf8'),/REQUEST_KEY_EXPIRED/);
assert.match(readFileSync('web/supabase/migrations/20261116234000_cachaste_basic_learning_attempts.sql','utf8'),/ATTEMPT_ALREADY_COMPLETED/);
const replayedAttempt={...validAttempt,remaining:2,replayed:true};
const replayed=await basicReserveActivity({mode:'lesson',subject:'M1',requestKey:'a2f817ca-a0e1-4d83-a6d1-99319124ab7a',fetcher:async()=>Response.json(replayedAttempt)});
assert.equal(replayed.replayed,true);
assert.equal(replayed.attemptId,validAttempt.attemptId);
await assert.rejects(()=>basicReserveActivity({mode:'lesson',subject:'M1',requestKey:'invalid',fetcher:async()=>Response.json(validAttempt)}),/INVALID_REQUEST_KEY/);
await assert.rejects(()=>basicReserveActivity({mode:'lesson',subject:'M1',requestKey:'a2f817ca-a0e1-4d83-a6d1-99319124ab7a',fetcher:async()=>Response.json({...replayedAttempt,remaining:null})}),/INVALID_RESERVATION_RESPONSE/);

const reservationSql=readFileSync('web/supabase/migrations/20261116234000_cachaste_basic_learning_attempts.sql','utf8');
assert.equal((reservationSql.match(/from cachaste_web\.basic_learning_attempts a/g)||[]).length>=2,true);
assert.doesNotMatch(reservationSql,/create trigger cachaste_basic_learning_reservation/);
assert.doesNotMatch(reservationSql.split('-- Server-only transition.')[0],/insert into cachaste_web\.basic_usage/);

const leaseSql=readFileSync('web/supabase/migrations/20261116234000_cachaste_basic_learning_attempts.sql','utf8');
assert.match(leaseSql,/status='expired'/);
assert.match(leaseSql,/interval '90 minutes'/);
assert.match(leaseSql,/ATTEMPT_EXPIRED/);
assert.match(leaseSql,/where kind='diagnostic' and status<>'expired'/);
assert.ok(leaseSql.indexOf("pg_advisory_xact_lock(hashtextextended('basic-completion:'")<leaseSql.indexOf("update cachaste_web.basic_learning_attempts a set status='expired'"));

const attemptCompletionSql=readFileSync('web/supabase/migrations/20261116234000_cachaste_basic_learning_attempts.sql','utf8');
assert.match(attemptCompletionSql,/function cachaste_web\.complete_basic_learning_attempt/);
assert.match(attemptCompletionSql,/auth\.role\(\) is distinct from 'service_role'/);
assert.match(attemptCompletionSql,/a\.created_at<now\(\)-interval '90 minutes'/);
assert.match(attemptCompletionSql,/ATTEMPT_EXPIRED/);
assert.match(attemptCompletionSql,/insert into cachaste_web\.basic_usage\(user_id,kind,subject,usage_day,event_id\)/);
assert.match(attemptCompletionSql,/set status='completed',completed_at=now\(\)/);
assert.match(attemptCompletionSql,/grant execute on function public\.cachaste_complete_basic_learning_attempt\(uuid,uuid\) to service_role/);

const gradingId='a2f817ca-a0e1-4d83-a6d1-99319124ab7a';
const trustedQuestions=[{id:'q1',options:['a','b','c'],answerIndex:1},{id:'q2',options:['x','y'],answerIndex:0}];
assert.deepEqual(verifyBasicAnswers({attemptId:gradingId,issuedQuestions:trustedQuestions,answers:[{questionId:'q1',selectedIndex:1},{questionId:'q2',selectedIndex:1}]}),{attemptId:gradingId,answered:2,correct:1,total:2,complete:true});
assert.throws(()=>verifyBasicAnswers({attemptId:gradingId,issuedQuestions:trustedQuestions,answers:[{questionId:'q2',selectedIndex:1},{questionId:'q1',selectedIndex:0}]}),/INVALID_ANSWER/);
assert.throws(()=>verifyBasicAnswers({attemptId:gradingId,issuedQuestions:[trustedQuestions[0],trustedQuestions[0]],answers:[{questionId:'q1',selectedIndex:1},{questionId:'q1',selectedIndex:1}]}),/INVALID_TRUSTED_QUESTION/);
assert.throws(()=>verifyBasicAnswers({attemptId:gradingId,issuedQuestions:trustedQuestions,answers:[{questionId:'q1',selectedIndex:1}]}),/INVALID_QUESTION_SET/);

assert.throws(()=>verifyBasicAnswers({attemptId:gradingId,issuedQuestions:trustedQuestions,answers:[{questionId:'q1',selectedIndex:1,answerIndex:1},{questionId:'q2',selectedIndex:0}]}),/INVALID_ANSWER/);
assert.throws(()=>verifyBasicAnswers({attemptId:gradingId,issuedQuestions:[{id:'q1',options:['a',''],answerIndex:0}],answers:[{questionId:'q1',selectedIndex:0}]}),/INVALID_TRUSTED_QUESTION/);

const issued=issueBasicQuestions({attemptId:gradingId,questions:[{id:'q1',prompt:'Pregunta 1',options:['A','B'],answerIndex:1}]});
assert.deepEqual(issued.publicQuestions,[{id:'q1',prompt:'Pregunta 1',options:['A','B']}]);
assert.equal(JSON.stringify(issued.publicQuestions).includes('answerIndex'),false);
assert.equal(issued.answerKey[0].answerIndex,1);
assert.equal(verifyBasicAnswers({attemptId:gradingId,issuedQuestions:issued.answerKey,answers:[{questionId:'q1',selectedIndex:1}]}).correct,1);
assert.throws(()=>issueBasicQuestions({attemptId:gradingId,questions:[{id:'q1',prompt:'',options:['A','B'],answerIndex:1}]}),/INVALID_TRUSTED_QUESTION/);

const completionCalls=[];
const completed=await completeVerifiedBasicAttempt({userId:'student',attemptId:gradingId,answers:[{questionId:'q1',selectedIndex:1}],loadIssuedAttempt:async ({userId,attemptId})=>({userId,attemptId,status:'reserved',answerKey:issued.answerKey}),commitCompletion:async payload=>{completionCalls.push(payload);return {completed:true};}});
assert.deepEqual(completed,{attemptId:gradingId,correct:1,total:1,completed:true});
assert.equal(completionCalls.length,1);
assert.equal(completionCalls[0].grading.correct,1);
await assert.rejects(()=>completeVerifiedBasicAttempt({userId:'student',attemptId:gradingId,answers:[{questionId:'q1',selectedIndex:1}],loadIssuedAttempt:async()=>({userId:'other',attemptId:gradingId,status:'reserved',answerKey:issued.answerKey}),commitCompletion:async()=>{throw Error('MUST_NOT_COMMIT');}}),/ATTEMPT_NOT_ELIGIBLE/);
await assert.rejects(()=>completeVerifiedBasicAttempt({userId:'student',attemptId:gradingId,answers:[{questionId:'q1',selectedIndex:1}],loadIssuedAttempt:async()=>({userId:'student',attemptId:gradingId,status:'completed',answerKey:issued.answerKey}),commitCompletion:async()=>({completed:true})}),/ATTEMPT_NOT_ELIGIBLE/);

const issuedKeySql=readFileSync('web/supabase/migrations/20261116235000_cachaste_basic_issued_questions.sql','utf8');
assert.match(issuedKeySql,/basic_issued_questions enable row level security/);
assert.match(issuedKeySql,/revoke all on cachaste_web\.basic_issued_questions from public,anon,authenticated/);
assert.match(issuedKeySql,/grant execute on function cachaste_web\.issue_basic_question_key\(uuid,uuid,jsonb\) to service_role/);
assert.match(issuedKeySql,/on conflict\(attempt_id\) do nothing/);
assert.match(issuedKeySql,/target\.status<>'reserved'/);

assert.match(issuedKeySql,/target\.usage_day<>\(now\(\) at time zone 'America\/Santiago'\)::date/);
assert.match(issuedKeySql,/jsonb_array_elements\(p_answer_key\)/);
assert.match(issuedKeySql,/jsonb_typeof\(q->'answerIndex'\)/);

assert.match(issuedKeySql,/count\(distinct q->>'id'\)/);
assert.match(issuedKeySql,/not between 2 and 8/);

assert.match(issuedKeySql,/QUESTIONS_NOT_ISSUED/);
assert.match(issuedKeySql,/from cachaste_web\.basic_issued_questions q/);

const verifiedCompletionSql=readFileSync('web/supabase/migrations/20261117000000_cachaste_basic_verified_answer_completion.sql','utf8');
assert.match(verifiedCompletionSql,/drop function if exists public\.cachaste_complete_basic_learning_attempt\(uuid,uuid\)/);
assert.match(verifiedCompletionSql,/drop function if exists cachaste_web\.complete_basic_learning_attempt\(uuid,uuid\)/);
assert.match(verifiedCompletionSql,/jsonb_array_elements\(issued\) with ordinality/);
assert.match(verifiedCompletionSql,/jsonb_array_elements\(p_answers\) with ordinality/);
assert.match(verifiedCompletionSql,/INCOMPLETE_ANSWERS/);
assert.match(verifiedCompletionSql,/INVALID_ANSWERS/);
assert.match(verifiedCompletionSql,/grant execute on function public\.cachaste_complete_basic_learning_attempt\(uuid,uuid,jsonb\) to service_role/);
assert.ok(verifiedCompletionSql.indexOf('INVALID_ANSWERS')<verifiedCompletionSql.indexOf('insert into cachaste_web.basic_usage'));

assert.match(verifiedCompletionSql,/ATTEMPT_ALREADY_COMPLETED/);
assert.doesNotMatch(verifiedCompletionSql,/replayed',true/);

assert.match(issuedKeySql,/create or replace function public\.cachaste_issue_basic_question_key/);
assert.match(issuedKeySql,/grant execute on function public\.cachaste_issue_basic_question_key\(uuid,uuid,jsonb\) to service_role/);
assert.match(issuedKeySql,/revoke all on function public\.cachaste_issue_basic_question_key\(uuid,uuid,jsonb\) from public,anon,authenticated/);
