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
