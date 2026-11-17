import test from 'node:test';
import assert from 'node:assert/strict';
import {createGateway} from '../web/server/gateway.mjs';
const env={WEB_PAYMENTS_ENABLED:'false',ASSETS:{fetch:async()=>new Response('<html>OK</html>',{headers:{'content-type':'text/html'}})}};
const gateway=createGateway({fetcher:async()=>{throw Error('Backend must not be called for denied requests')},allowDevelopmentHttp:true,protectedFiles:['/app/inicio.html']});
const req=(path,options={})=>new Request('https://sitecacho.cl'+path,options);
const json=async res=>res.json();
test('no access to protected learning content without authentication',async()=>{
 for(const path of ['/app/inicio.html','/app/science-bank.js','/app/reading-bank.js','/app/competition-client.js']){
  const res=await gateway.fetch(req(path,{headers:{accept:'application/json'}}),env);
  assert.equal(res.status,path==='/app/inicio.html'?401:404,path);
 }
});
test('unknown API paths fail closed',async()=>{
 const res=await gateway.fetch(req('/api/unknown'),env);
 assert.equal(res.status,404);assert.equal((await json(res)).error,'NOT_FOUND');
});
test('cross-origin requests cannot mutate session, progress, or checkout',async()=>{
 for(const path of ['/api/session','/api/progress','/api/billing','/api/billing/sandbox']){
  const res=await gateway.fetch(req(path,{method:'POST',headers:{origin:'https://attacker.invalid','x-cachaste-request':'1','content-type':'application/json'},body:'{}'}),env);
  assert.equal(res.status,403,path);assert.equal((await json(res)).error,'ORIGIN_DENIED');
 }
});
test('public config never advertises payment enablement',async()=>{
 const res=await gateway.fetch(req('/api/config'),env);assert.equal(res.status,200);
 const data=await json(res);assert.equal(data.signupEnabled,false);assert.equal(data.googleAuthEnabled,false);
 assert.ok(!('serviceRoleKey'in data));
});
test('protected internal worker, encrypted assets, and source maps are denied',async()=>{
 for(const path of ['/_worker.js','/sw-template.js','/__encrypted/test.bin','/app/example.js.map']){
  const res=await gateway.fetch(req(path),env);assert.equal(res.status,404,path);
 }
});
test('www redirects to canonical apex without losing the query',async()=>{
 const res=await gateway.fetch(new Request('https://www.sitecacho.cl/cuenta.html?next=%2Fapp%2Finicio.html'),env);
 assert.equal(res.status,308);assert.equal(res.headers.get('location'),'https://sitecacho.cl/cuenta.html?next=%2Fapp%2Finicio.html');
});

test('commercial indexing publishes only canonical public pages after explicit activation',async()=>{
 const page='<html><head><meta name="robots" content="noindex,nofollow"><link rel="canonical" href="https://preview.example/"></head></html>';
 const bindings={WEB_INDEXING_ENABLED:'true',ASSETS:{fetch:async()=>new Response(page,{headers:{'content-type':'text/html'}})}};
 const ready=createGateway({commercial:true});
 const dormant=await gateway.fetch(req('/robots.txt'),bindings);
 assert.match(await dormant.text(),/^Disallow: \/$/m);
 assert.equal((await gateway.fetch(req('/sitemap.xml'),bindings)).status,404);
 const robot=await ready.fetch(req('/robots.txt'),bindings);
 assert.match(await robot.text(),/Sitemap: https:\/\/sitecacho\.cl\/sitemap\.xml/);
 const sitemap=await ready.fetch(req('/sitemap.xml'),bindings);
 assert.equal(sitemap.status,200);
 assert.deepEqual([...((await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g))].map(m=>m[1]),[
  'https://sitecacho.cl/','https://sitecacho.cl/privacidad.html',
  'https://sitecacho.cl/condiciones.html','https://sitecacho.cl/eliminar-cuenta.html'
 ]);
 const publicPage=await ready.fetch(req('/privacidad'),bindings);
 const published=await publicPage.text();
 assert.match(published,/rel="canonical" href="https:\/\/sitecacho\.cl\/privacidad\.html"/);
 assert.doesNotMatch(published,/noindex|preview\.example/);
 assert.equal(publicPage.headers.get('x-robots-tag'),null);
 for(const url of ['https://sitecacho.cl/cuenta.html','https://cachaste-sitecacho.pages.dev/']){
  const response=await ready.fetch(new Request(url),bindings);
  assert.match(response.headers.get('x-robots-tag'),/noindex/);
 }
});

const fakeToken=(exp=Math.floor(Date.now()/1000)+3600)=>'a.'+Buffer.from(JSON.stringify({exp})).toString('base64url')+'.c';
test('Supabase user identity must match access entitlement user ID',async()=>{
 const token=fakeToken(),calls=[];
 const protectedGateway=createGateway({allowDevelopmentHttp:true,protectedFiles:['/app/inicio.html'],fetcher:async url=>{
  calls.push(url);
  if(url.endsWith('/auth/v1/user'))return Response.json({id:'student-a'});
  if(url.endsWith('/rest/v1/rpc/cachaste_access'))return Response.json({userId:'student-b',serverTimeMs:Date.now(),active:true,validUntilMs:Date.now()+60000});
  throw Error('Unexpected backend request');
 }});
 const res=await protectedGateway.fetch(req('/app/inicio.html',{headers:{authorization:'Bearer '+token,accept:'application/json'}}),env);
 assert.equal(res.status,400);assert.equal((await json(res)).error,'INVALID_ACCESS_RESPONSE');
 assert.equal(calls.length,2);
});
test('expired tokens are rejected before contacting Supabase',async()=>{
 let calls=0;const protectedGateway=createGateway({allowDevelopmentHttp:true,protectedFiles:['/app/inicio.html'],fetcher:async()=>{calls++;throw Error('must not contact backend');}});
 const res=await protectedGateway.fetch(req('/app/inicio.html',{headers:{authorization:'Bearer '+fakeToken(1),accept:'application/json'}}),env);
 assert.equal(res.status,401);assert.equal(calls,0);
});
test('inactive subscription cannot access protected learning page',async()=>{
 const token=fakeToken();const protectedGateway=createGateway({allowDevelopmentHttp:true,protectedFiles:['/app/inicio.html'],fetcher:async url=>{
  if(url.endsWith('/auth/v1/user'))return Response.json({id:'student-a'});
  if(url.endsWith('/rest/v1/rpc/cachaste_access'))return Response.json({userId:'student-a',serverTimeMs:Date.now(),active:false,validUntilMs:Date.now()+60000});
  throw Error('Unexpected backend request');
 }});
 const res=await protectedGateway.fetch(req('/app/inicio.html',{headers:{authorization:'Bearer '+token,accept:'application/json'}}),env);
 assert.equal(res.status,402);assert.equal((await json(res)).error,'SUBSCRIPTION_REQUIRED');
});

test('authenticated account endpoint returns the verified student and access',async()=>{
 const token=fakeToken();const seen=[];
 const g=createGateway({allowDevelopmentHttp:true,fetcher:async (url,options)=>{
  seen.push({url,method:options.method,auth:options.headers.authorization});
  if(url.endsWith('/auth/v1/user'))return Response.json({id:'student-a',email:'student@example.invalid'});
  if(url.endsWith('/rest/v1/rpc/cachaste_access'))return Response.json({userId:'student-a',active:true,serverTimeMs:Date.now(),validUntilMs:Date.now()+3600000});
  if(url.endsWith('/rest/v1/rpc/cachaste_web_account'))return Response.json({access:{active:true},subscriptions:[],trialUsed:false,isAdmin:false});
  throw Error('Unexpected backend request');
 }});
 const res=await g.fetch(req('/api/session',{headers:{authorization:'Bearer '+token}}),env);
 assert.equal(res.status,200);const data=await json(res);
 assert.equal(data.user.id,'student-a');assert.equal(data.user.email,'student@example.invalid');
 assert.equal(data.isAdmin,false);assert.equal(seen.length,3);
 assert.ok(seen.every(call=>call.auth==='Bearer '+token));
});
test('authenticated progress writes cannot claim another student identity',async()=>{
 const token=fakeToken();const seen=[];
 const g=createGateway({allowDevelopmentHttp:true,fetcher:async (url)=>{
  seen.push(url);
  if(url.endsWith('/auth/v1/user'))return Response.json({id:'student-a'});
  if(url.endsWith('/rest/v1/rpc/cachaste_access'))return Response.json({userId:'student-a',active:true,serverTimeMs:Date.now(),validUntilMs:Date.now()+3600000});
  throw Error('Progress RPC must not be invoked for mismatched user');
 }});
 const res=await g.fetch(req('/api/progress',{method:'POST',headers:{origin:'https://sitecacho.cl','x-cachaste-request':'1','content-type':'application/json',authorization:'Bearer '+token},body:JSON.stringify({userId:'student-b',operation:'put',payload:{}})}),env);
 assert.equal(res.status,409);assert.equal((await json(res)).error,'SESSION_CHANGED');assert.equal(seen.length,2);
});

test('valid student progress reaches the RPC with the authenticated token',async()=>{
 const token=fakeToken();const calls=[];
 const g=createGateway({allowDevelopmentHttp:true,fetcher:async(url,options)=>{
  calls.push({url,options});
  if(url.endsWith('/auth/v1/user'))return Response.json({id:'student-a'});
  if(url.endsWith('/rest/v1/rpc/cachaste_access'))return Response.json({userId:'student-a',active:true,serverTimeMs:Date.now(),validUntilMs:Date.now()+3600000});
  if(url.endsWith('/rest/v1/rpc/cachaste_web_progress'))return Response.json({documents:[],revision:2});
  throw Error('Unexpected backend request');
 }});
 const payload={userId:'student-a',operation:'snapshot',payload:{}};
 const res=await g.fetch(req('/api/progress',{method:'POST',headers:{origin:'https://sitecacho.cl','x-cachaste-request':'1','content-type':'application/json',authorization:'Bearer '+token},body:JSON.stringify(payload)}),env);
 assert.equal(res.status,200);assert.equal((await json(res)).revision,2);
 assert.equal(calls.length,3);
 assert.equal(calls[2].options.headers.authorization,'Bearer '+token);
 assert.deepEqual(JSON.parse(calls[2].options.body),payload);
});

test('basic quota remains closed without a complete educational release',async()=>{
 const res=await gateway.fetch(req('/api/basic/quota',{method:'POST',headers:{origin:'https://sitecacho.cl','x-cachaste-request':'1','content-type':'application/json'},body:JSON.stringify({operation:'consume',kind:'lesson',subject:'m1',eventId:'ad4d7f88-7f50-4d5c-a833-111111111111'})}),env);
 assert.equal(res.status,503);
 assert.equal((await json(res)).error,'BASIC_NOT_READY');
});
test('basic quota rejects cross-origin calls before checking release flag',async()=>{
 const res=await gateway.fetch(req('/api/basic/quota',{method:'POST',headers:{origin:'https://attacker.invalid','x-cachaste-request':'1','content-type':'application/json'},body:'{}'}),env);
 assert.equal(res.status,403);
 assert.equal((await json(res)).error,'ORIGIN_DENIED');
});
test('basic quota does not appear enabled in public configuration',async()=>{
 const res=await gateway.fetch(req('/api/config'),{...env,WEB_BASIC_ACCESS_ENABLED:'true'});
 assert.equal(res.status,200);
 assert.equal((await json(res)).basicEnabled,false);
});

test('basic quota gateway requires a verified identity and forwards only validated fields',async()=>{
 const token=fakeToken(),calls=[];
 const quotaGateway=createGateway({allowDevelopmentHttp:true,fetcher:async(url,options={})=>{
  calls.push({url,options});
  if(url.endsWith('/auth/v1/user'))return Response.json({id:'student-a'});
  if(url.endsWith('/rest/v1/rpc/cachaste_access'))return Response.json({userId:'student-a',serverTimeMs:Date.now(),active:false,validUntilMs:null});
  if(url.endsWith('/rest/v1/rpc/cachaste_basic_quota'))return Response.json({allowed:true,tier:'basica',remaining:2});
  throw Error('Unexpected backend request');
 }});
 const headers={origin:'https://sitecacho.cl','x-cachaste-request':'1','content-type':'application/json',authorization:'Bearer '+token};
 const enabled={...env,WEB_BASIC_ACCESS_ENABLED:'true',WEB_BASIC_EDUCATIONAL_GUARDS_READY:'true',WEB_BASIC_COMPLETION_ATTESTATION_READY:'true'};
 const eventId='ad4d7f88-7f50-4d5c-a833-111111111111';
 const response=await quotaGateway.fetch(req('/api/basic/quota',{method:'POST',headers,body:JSON.stringify({operation:'check',kind:'lesson',subject:'m1',ignored:'secret'})}),enabled);
 assert.equal(response.status,200);
 assert.equal((await json(response)).remaining,2);
 assert.equal(calls.length,3);
 assert.deepEqual(JSON.parse(calls[2].options.body),{operation:'check',kind:'lesson',subject:'m1',event_id:null});
 const invalid=await quotaGateway.fetch(req('/api/basic/quota',{method:'POST',headers,body:JSON.stringify({operation:'check',kind:'lesson',subject:'all'})}),enabled);
 assert.equal(invalid.status,400);
 assert.equal(calls.length,5);
});

test('basic quota requires both release and educational enforcement flags',async()=>{
 const headers={origin:'https://sitecacho.cl','x-cachaste-request':'1','content-type':'application/json'};
 const body=JSON.stringify({operation:'check',kind:'lesson',subject:'m1'});
 for(const bindings of [{...env,WEB_BASIC_ACCESS_ENABLED:'true'},{...env,WEB_BASIC_EDUCATIONAL_GUARDS_READY:'true'}]){
  const res=await gateway.fetch(req('/api/basic/quota',{method:'POST',headers,body}),bindings);
  assert.equal(res.status,503);
  assert.equal((await json(res)).error,'BASIC_NOT_READY');
 }
});

test('basic quota rejects malformed JSON without reaching the database',async()=>{
 const token=fakeToken();let quotaCalls=0;
 const g=createGateway({allowDevelopmentHttp:true,fetcher:async url=>{
  if(url.endsWith('/auth/v1/user'))return Response.json({id:'student-a'});
  if(url.endsWith('/rest/v1/rpc/cachaste_access'))return Response.json({userId:'student-a',serverTimeMs:Date.now(),active:false,validUntilMs:null});
  quotaCalls++;throw Error('Unexpected quota database request');
 }});
 const headers={origin:'https://sitecacho.cl','x-cachaste-request':'1','content-type':'application/json',authorization:'Bearer '+token};
 const flags={...env,WEB_BASIC_ACCESS_ENABLED:'true',WEB_BASIC_EDUCATIONAL_GUARDS_READY:'true'};
 for(const body of ['{invalid','null','[]']){
  const res=await g.fetch(req('/api/basic/quota',{method:'POST',headers,body}),flags);
  assert.equal(res.status,400,body);
 }
 assert.equal(quotaCalls,0);
});

test('basic consumption remains closed without server-side completion attestation',async()=>{
 const token=fakeToken(),calls=[];
 const g=createGateway({allowDevelopmentHttp:true,fetcher:async url=>{
  calls.push(url);
  if(url.endsWith('/auth/v1/user'))return Response.json({id:'student-a'});
  if(url.endsWith('/rest/v1/rpc/cachaste_access'))return Response.json({userId:'student-a',serverTimeMs:Date.now(),active:false,validUntilMs:null});
  throw Error('No quota RPC expected');
 }});
 const headers={origin:'https://sitecacho.cl','x-cachaste-request':'1','content-type':'application/json',authorization:'Bearer '+token};
 const flags={...env,WEB_BASIC_ACCESS_ENABLED:'true',WEB_BASIC_EDUCATIONAL_GUARDS_READY:'true'};
 const response=await g.fetch(req('/api/basic/quota',{method:'POST',headers,body:JSON.stringify({operation:'consume',kind:'lesson',subject:'m1',eventId:'ad4d7f88-7f50-4d5c-a833-111111111111'})}),flags);
 assert.equal(response.status,403);
 assert.equal((await json(response)).error,'SERVER_VERIFIED_COMPLETION_REQUIRED');
 assert.equal(calls.length,2);
});

test('basic quota summary requires both flags and an authenticated user',async()=>{
 const token=fakeToken(),calls=[];
 const g=createGateway({allowDevelopmentHttp:true,fetcher:async(url,options={})=>{
  calls.push({url,options});
  if(url.endsWith('/auth/v1/user'))return Response.json({id:'student-a'});
  if(url.endsWith('/rest/v1/rpc/cachaste_access'))return Response.json({userId:'student-a',serverTimeMs:Date.now(),active:false,validUntilMs:null});
  if(url.endsWith('/rest/v1/rpc/cachaste_basic_quota_summary'))return Response.json({tier:'basica',day:'2026-11-16',lessonsRemaining:{m1:3,m2:3,lectora:3,ciencias:3,historia:3},diagnosticsRemaining:{m1:1,m2:1,lectora:1,ciencias:1,historia:1},expressExamsRemaining:1,duelsRemaining:2,fullExamsRemaining:0});
  throw Error('Unexpected backend request');
 }});
 const path='/api/basic/summary';
 assert.equal((await g.fetch(req(path),env)).status,503);
 const flags={...env,WEB_BASIC_ACCESS_ENABLED:'true',WEB_BASIC_EDUCATIONAL_GUARDS_READY:'true'};
 assert.equal((await g.fetch(req(path),flags)).status,401);
 const response=await g.fetch(req(path,{headers:{authorization:'Bearer '+token}}),flags);
 assert.equal(response.status,200);
 const body=await json(response);
 assert.equal(body.lessonsRemaining.m1,3);
 assert.equal(body.fullExamsRemaining,0);
 assert.equal(calls.length,3);
 assert.equal(calls[2].options.method,'POST');
});

test('browser cannot consume Basic quota even if all release flags are enabled',async()=>{
 const token=fakeToken(),calls=[];
 const g=createGateway({allowDevelopmentHttp:true,fetcher:async(url)=>{
  calls.push(url);
  if(url.endsWith('/auth/v1/user'))return Response.json({id:'student-a'});
  if(url.endsWith('/rest/v1/rpc/cachaste_access'))return Response.json({userId:'student-a',serverTimeMs:Date.now(),active:false});
  throw Error('MUST_NOT_WRITE_QUOTA');
 }});
 const headers={origin:'https://sitecacho.cl','x-cachaste-request':'1','content-type':'application/json',authorization:'Bearer '+token};
 const flags={...env,WEB_BASIC_ACCESS_ENABLED:'true',WEB_BASIC_EDUCATIONAL_GUARDS_READY:'true',WEB_BASIC_COMPLETION_ATTESTATION_READY:'true'};
 const response=await g.fetch(req('/api/basic/quota',{method:'POST',headers,body:JSON.stringify({operation:'consume',kind:'lesson',subject:'m1',eventId:'ad4d7f88-7f50-4d5c-a833-111111111111'})}),flags);
 assert.equal(response.status,403);
 assert.equal((await json(response)).error,'SERVER_VERIFIED_COMPLETION_REQUIRED');
 assert.equal(calls.length,2);
});

test('Basic progress snapshot is opt-in and cannot be used for client writes',async()=>{
 const token=fakeToken(),calls=[];
 const g=createGateway({allowDevelopmentHttp:true,fetcher:async(url,options={})=>{
  calls.push({url,options});
  if(url.endsWith('/auth/v1/user'))return Response.json({id:'student-a'});
  if(url.endsWith('/rest/v1/rpc/cachaste_access'))return Response.json({userId:'student-a',serverTimeMs:Date.now(),active:false,validUntilMs:null});
  if(url.endsWith('/rest/v1/rpc/cachaste_web_progress'))return Response.json({documents:[]});
  throw Error('Unexpected backend request: '+url);
 }});
 const headers={origin:'https://sitecacho.cl','x-cachaste-request':'1','content-type':'application/json',authorization:'Bearer '+token};
 const post=(operation,flags)=>g.fetch(req('/api/progress',{method:'POST',headers,body:JSON.stringify({operation})}),flags);
 const ready={...env,WEB_BASIC_ACCESS_ENABLED:'true',WEB_BASIC_EDUCATIONAL_GUARDS_READY:'true',WEB_BASIC_PROGRESS_SNAPSHOT_READY:'true'};
 assert.equal((await post('snapshot',env)).status,402);
 assert.equal((await post('snapshot',{...ready,WEB_BASIC_PROGRESS_SNAPSHOT_READY:'false'})).status,402);
 assert.equal((await post('put',ready)).status,402);
 assert.equal(calls.filter(x=>x.url.endsWith('/rest/v1/rpc/cachaste_web_progress')).length,0);
 assert.equal((await post('snapshot',ready)).status,200);
 assert.equal(calls.filter(x=>x.url.endsWith('/rest/v1/rpc/cachaste_web_progress')).length,1);
});
