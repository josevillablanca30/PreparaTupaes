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
assert.match(gatewaySource,/WEB_BASIC_COMPLETION_ATTESTATION_READY/);

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
const {basicQuotaGateway}=await import('../client/basic-quota.mjs');
await basicQuotaGateway({kind:'lesson',subject:'m1',accessToken:'example-session-token',fetcher:async(url,options)=>{quotaRequest={url,options};return Response.json({allowed:true,tier:'basica',remaining:3});}});
assert.equal(quotaRequest.url,'/api/basic/quota');
assert.equal(quotaRequest.options.headers.authorization,'Bearer example-session-token');
assert.equal(quotaRequest.options.headers['x-cachaste-request'],'1');
await assert.rejects(()=>basicQuotaGateway({kind:'lesson',subject:'m1',accessToken:'short',fetcher:async()=>{throw Error('MUST_NOT_FETCH');}}),/INVALID_AUTH_TOKEN/);
