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
 assert.equal(res.status,503);assert.equal((await json(res)).error,'INVALID_ACCESS_RESPONSE');
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
