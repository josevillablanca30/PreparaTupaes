import {prepareBasicIssuance} from '../server/basic-issuance.mjs';
import {createBasicLearningSession} from '../client/basic-session.mjs';
import assert from 'node:assert/strict';
import {basicCompleteActivity} from '../client/basic-quota.mjs';
const attemptId='123e4567-e89b-42d3-a456-426614174002';
const answers=[{questionId:'q1',selectedIndex:1}];
const calls=[];
const fetcher=async(path,options)=>{
 calls.push({path,options});
 return new Response(JSON.stringify({allowed:true,completed:true,attemptId,correct:1,total:1}),{status:200});
};
const completed=await basicCompleteActivity({attemptId,answers,fetcher});
assert.deepEqual(completed,{attemptId,correct:1,total:1,completed:true});
assert.equal(calls[0].path,'/api/basic/complete');
assert.equal(calls[0].options.headers['x-cachaste-request'],'1');
assert.deepEqual(JSON.parse(calls[0].options.body),{attemptId,answers});
await assert.rejects(basicCompleteActivity({attemptId,answers:[{questionId:'q1',selectedIndex:1,correct:true}],fetcher}),/INVALID_ANSWERS/);
await assert.rejects(basicCompleteActivity({attemptId,answers:[...answers,...answers],fetcher}),/INVALID_ANSWERS/);
await assert.rejects(basicCompleteActivity({attemptId,answers,fetcher:async()=>new Response('{}',{status:503})}),/BASIC_NOT_READY/);
await assert.rejects(basicCompleteActivity({attemptId,answers,fetcher:async()=>new Response(JSON.stringify({allowed:true,completed:true,attemptId,correct:2,total:1}))}),/INVALID_COMPLETION_RESPONSE/);
console.log('Basic completion client checks passed');

const bank={m1:Array.from({length:30},(_,i)=>({id:'q'+i,prompt:'Pregunta '+i,options:['A','B','C'],answerIndex:1,status:'reviewed',origin:{rights:'owned'}}))};
const issuance=prepareBasicIssuance({attemptId,subject:'m1',kind:'lesson',bankJson:JSON.stringify(bank)});
assert.equal(issuance.publicQuestions.length,10);
assert.equal(issuance.answerKey.length,10);
assert.ok(issuance.publicQuestions.every(q=>!('answerIndex' in q)));
assert.ok(issuance.answerKey.every(q=>q.answerIndex===1));
assert.throws(()=>prepareBasicIssuance({attemptId,subject:'m2',kind:'lesson',bankJson:JSON.stringify(bank)}),/INVALID_SERVER_BANK/);
const session=createBasicLearningSession({fetcher:async()=>new Response('{}',{status:503})});
await assert.rejects(session.start({mode:'lesson',subject:'M1',requestKey:attemptId}),/BASIC_NOT_READY/);
assert.equal(session.snapshot().phase,'idle');

const express=prepareBasicIssuance({attemptId,subject:'m1',kind:'expressExam',bankJson:JSON.stringify(bank)});
assert.equal(express.publicQuestions.length,15);
assert.ok(express.publicQuestions.every(q=>q.id.startsWith('q')));
assert.throws(()=>prepareBasicIssuance({attemptId,subject:'all',kind:'expressExam',bankJson:JSON.stringify(bank)}),/BASIC_ISSUANCE_NOT_READY/);
const duplicates={m1:[...bank.m1.slice(0,10),bank.m1[0]]};
assert.throws(()=>prepareBasicIssuance({attemptId,subject:'m1',kind:'lesson',bankJson:JSON.stringify(duplicates)}),/DUPLICATE_QUESTION_IDS/);

const isolated=createBasicLearningSession({fetcher:async()=>new Response('{}',{status:503})});
assert.equal(Object.hasOwn(isolated,'acceptIssuedQuestions'),false,'client cannot inject its own question set');
assert.equal(typeof isolated.issue,'function');

assert.throws(()=>prepareBasicIssuance({attemptId,subject:'m1',kind:'lesson',bankJson:JSON.stringify({m1:[...bank.m1.slice(0,9),{...bank.m1[9],id:'x'.repeat(129)}]})}),/INVALID_TRUSTED_QUESTION/,'server must never issue IDs that completion rejects');

// Integrated launcher: a reservation alone must not display local questions.
const integratedCalls=[];
const launchFetcher=async(path,options)=>{
 integratedCalls.push(path);
 if(path==='/api/basic/reserve')return new Response(JSON.stringify({allowed:true,tier:'basica',remaining:2,day:'2026-11-18',attemptId}));
 if(path==='/api/basic/issue')return new Response(JSON.stringify({attemptId,questions:issuance.publicQuestions}));
 if(path==='/api/basic/complete')return new Response(JSON.stringify({allowed:true,completed:true,attemptId,correct:10,total:10}));
 throw Error('UNEXPECTED_ROUTE');
};
const integrated=createBasicLearningSession({fetcher:launchFetcher});
const launched=await integrated.launch({mode:'lesson',subject:'M1',requestKey:attemptId});
assert.equal(launched.started,true);
assert.equal(launched.questions.length,10);
assert.deepEqual(integratedCalls,['/api/basic/reserve','/api/basic/issue']);
assert.equal(integrated.snapshot().phase,'issued');
const graded=await integrated.finish({answers:launched.questions.map(q=>({questionId:q.id,selectedIndex:1}))});
assert.equal(graded.completed,true);
assert.deepEqual(integratedCalls,['/api/basic/reserve','/api/basic/issue','/api/basic/complete']);
assert.equal(integrated.snapshot().phase,'completed');
const blocked=createBasicLearningSession({fetcher:async(path)=>path==='/api/basic/reserve'?new Response('{}',{status:503}):Promise.reject(Error('ISSUANCE_MUST_NOT_RUN'))});
await assert.rejects(blocked.launch({mode:'lesson',subject:'M1',requestKey:attemptId}),/BASIC_NOT_READY/);
assert.equal(blocked.snapshot().phase,'idle');

// Legacy reservation-only launcher must not bypass server question issuance.
const {withBasicReservation}=await import('../client/basic-quota.mjs');
let legacyEngineStarted=false;
const legacy=await withBasicReservation({mode:'lesson',subject:'M1',requestKey:attemptId,
 fetcher:async()=>new Response(JSON.stringify({allowed:true,tier:'basica',remaining:2,day:'2026-11-18',attemptId})),
 start:async()=>{legacyEngineStarted=true;}
});
assert.equal(legacy.started,false);
assert.equal(legacy.reason,'BASIC_SERVER_ISSUANCE_REQUIRED');
assert.equal(legacyEngineStarted,false);
