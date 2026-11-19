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
assert.equal(Object.isFrozen(launched.questions),true);
assert.equal(Object.isFrozen(launched.questions[0].options),true);
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

// Lost completion response: verify the ledger rather than retrying an already
// completed attempt or inventing a score.
const recoveryCalls=[];
const recoveryFetcher=async(path)=>{
 recoveryCalls.push(path);
 if(path==='/api/basic/reserve')return Response.json({allowed:true,tier:'basica',remaining:2,day:'2026-11-18',attemptId});
 if(path==='/api/basic/issue')return Response.json({attemptId,questions:issuance.publicQuestions});
 if(path==='/api/basic/complete')throw Error('NETWORK_RESPONSE_LOST');
 if(path==='/api/basic/verified-progress')return Response.json({day:'2026-11-18',verifiedCompletions:[{eventId:attemptId,kind:'lesson',subject:'m1',day:'2026-11-18',recordedAt:'2026-11-18T12:00:00Z'}]});
 throw Error('UNEXPECTED_ROUTE');
};
const recoverySession=createBasicLearningSession({fetcher:recoveryFetcher});
const recoveryLaunch=await recoverySession.launch({mode:'lesson',subject:'M1',requestKey:attemptId});
await assert.rejects(recoverySession.finish({answers:recoveryLaunch.questions.map(q=>({questionId:q.id,selectedIndex:1}))}),/NETWORK_RESPONSE_LOST/);
const recovered=await recoverySession.recoverCompletion();
assert.equal(recovered.completed,true);
assert.equal(recovered.recovered,true);
assert.equal(recovered.scoreAvailable,false);
assert.equal(recoverySession.snapshot().phase,'completed');
assert.equal(recoveryCalls.filter(path=>path==='/api/basic/complete').length,1);

// An oversized or malformed issuance must never become a playable activity.
const malformedSession=createBasicLearningSession({fetcher:async(path)=>{
 if(path==='/api/basic/reserve')return Response.json({allowed:true,tier:'basica',remaining:2,day:'2026-11-18',attemptId});
 if(path==='/api/basic/issue')return Response.json({attemptId,questions:[{id:'x'.repeat(129),prompt:'Pregunta',options:['A','B']}]});
 throw Error('UNEXPECTED_ROUTE');
}});
await assert.rejects(malformedSession.launch({mode:'lesson',subject:'M1',requestKey:attemptId}),/INVALID_BASIC_ISSUANCE/);
assert.equal(malformedSession.snapshot().phase,'reserved');
const missingRecovery=createBasicLearningSession({fetcher:async(path)=>{
 if(path==='/api/basic/reserve')return Response.json({allowed:true,tier:'basica',remaining:2,day:'2026-11-18',attemptId});
 if(path==='/api/basic/issue')return Response.json({attemptId,questions:issuance.publicQuestions});
 if(path==='/api/basic/verified-progress')return Response.json({day:'2026-11-18',verifiedCompletions:[]});
 throw Error('UNEXPECTED_ROUTE');
}});
await missingRecovery.launch({mode:'lesson',subject:'M1',requestKey:attemptId});
assert.equal((await missingRecovery.recoverCompletion()).recovered,false);
assert.equal(missingRecovery.snapshot().phase,'issued');

// The server cannot silently shorten or expand a Basic activity.
for(const count of [9,11]){
 const wrongCount=createBasicLearningSession({fetcher:async(path)=>{
  if(path==='/api/basic/reserve')return Response.json({allowed:true,tier:'basica',remaining:2,day:'2026-11-18',attemptId});
  if(path==='/api/basic/issue')return Response.json({attemptId,questions:issuance.publicQuestions.slice(0,count).concat(count===11?[{id:'extra',prompt:'Extra',options:['A','B']}]:[])});
  throw Error('UNEXPECTED_ROUTE');
 }});
 await assert.rejects(wrongCount.launch({mode:'lesson',subject:'M1',requestKey:attemptId}),/INVALID_BASIC_ISSUANCE/);
 assert.equal(wrongCount.snapshot().phase,'reserved');
}
