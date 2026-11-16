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
