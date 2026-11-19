import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fetchBasicVerifiedProgress} from '../client/basic-verified-progress.mjs';

const gateway=readFileSync(new URL('../server/gateway.mjs',import.meta.url),'utf8');
const migration=readFileSync(new URL('../supabase/migrations/20261117002000_cachaste_basic_verified_progress_snapshot.sql',import.meta.url),'utf8');
test('Verified progress RPC resolves identity from JWT, not supplied user ID',()=>{
 assert.match(migration,/u uuid:=cachaste\.require_user\(\)/);
 assert.match(migration,/where user_id=u and kind in \('lesson','diagnostic','expressExam'\)/);
 assert.match(migration,/from cachaste_web\.basic_usage/);
 assert.doesNotMatch(migration,/insert into cachaste_web\.basic_usage/i);
});
test('Gateway requires completion attestation and authenticated identity',()=>{
 const start=gateway.indexOf("if(path==='/api/basic/verified-progress'");
 assert.ok(start>=0);
 const route=gateway.slice(start,gateway.indexOf("if(path==='/api/basic/summary'",start));
 assert.match(route,/WEB_BASIC_COMPLETION_ATTESTATION_READY/);
 assert.match(route,/identity\(req,env,\{active:false,fresh:true\}\)/);
 assert.match(route,/cachaste_basic_verified_progress_snapshot/);
 assert.doesNotMatch(route,/SUPABASE_SERVICE_ROLE_KEY/);
});
test('Client reads server-verified history and rejects malformed results',async()=>{
 const record={eventId:'123e4567-e89b-42d3-a456-426614174002',kind:'lesson',subject:'m1',day:'2026-11-18',recordedAt:'2026-11-18T12:00:00Z'};
 const calls=[];
 const fetcher=async(path,opts)=>{calls.push({path,opts});return new Response(JSON.stringify({day:'2026-11-18',verifiedCompletions:[record]}));};
 const result=await fetchBasicVerifiedProgress({fetcher});
 assert.equal(calls[0].path,'/api/basic/verified-progress');
 assert.equal(calls[0].opts.method,'GET');
 assert.equal(result.verifiedCompletions[0].kind,'lesson');
 await assert.rejects(fetchBasicVerifiedProgress({fetcher:async()=>new Response('{}')}),/INVALID_BASIC_PROGRESS/);
 await assert.rejects(fetchBasicVerifiedProgress({fetcher:async()=>new Response('{}',{status:503})}),/BASIC_NOT_READY/);
});

test('Verified progress rejects forged, duplicated and non-completion records',async()=>{
 const good={eventId:'123e4567-e89b-42d3-a456-426614174002',kind:'lesson',subject:'m1',day:'2026-11-18',recordedAt:'2026-11-18T12:00:00Z'};
 const read=items=>fetchBasicVerifiedProgress({fetcher:async()=>Response.json({day:'2026-11-18',verifiedCompletions:items})});
 await assert.rejects(read([{...good,kind:'duel',subject:'all'}]),/INVALID_BASIC_PROGRESS/);
 await assert.rejects(read([good,good]),/INVALID_BASIC_PROGRESS/);
 await assert.rejects(read([{...good,kind:'expressExam',subject:'m1'}]),/INVALID_BASIC_PROGRESS/);
 await assert.rejects(read([{...good,eventId:'not-a-uuid'}]),/INVALID_BASIC_PROGRESS/);
 await assert.rejects(read([{...good,recordedAt:'invalid'}]),/INVALID_BASIC_PROGRESS/);
 await assert.rejects(read(Array.from({length:101},(_,i)=>({...good,eventId:'123e4567-e89b-42d3-a456-'+String(i).padStart(12,'0')}))),/INVALID_BASIC_PROGRESS/);
 const result=await read([good]);
 assert.equal(result.verifiedCompletions.length,1);
 assert.equal(Object.isFrozen(result.verifiedCompletions[0]),true);
});
