import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fetchBasicVerifiedProgress} from '../client/basic-verified-progress.mjs';

const gateway=readFileSync(new URL('../server/gateway.mjs',import.meta.url),'utf8');
const migration=readFileSync(new URL('../supabase/migrations/20261117002000_cachaste_basic_verified_progress_snapshot.sql',import.meta.url),'utf8');
test('Verified progress RPC resolves identity from JWT, not supplied user ID',()=>{
 assert.match(migration,/u uuid:=cachaste\.require_user\(\)/);
 assert.match(migration,/where q\.user_id=u/);
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
 const record={eventId:'123e4567-e89b-42d3-a456-426614174002',kind:'lesson',subject:'m1',day:'2026-11-18'};
 const calls=[];
 const fetcher=async(path,opts)=>{calls.push({path,opts});return new Response(JSON.stringify({day:'2026-11-18',verifiedCompletions:[record]}));};
 const result=await fetchBasicVerifiedProgress({fetcher});
 assert.equal(calls[0].path,'/api/basic/verified-progress');
 assert.equal(calls[0].opts.method,'GET');
 assert.equal(result.verifiedCompletions[0].kind,'lesson');
 await assert.rejects(fetchBasicVerifiedProgress({fetcher:async()=>new Response('{}')}),/INVALID_BASIC_PROGRESS/);
 await assert.rejects(fetchBasicVerifiedProgress({fetcher:async()=>new Response('{}',{status:503})}),/BASIC_NOT_READY/);
});
