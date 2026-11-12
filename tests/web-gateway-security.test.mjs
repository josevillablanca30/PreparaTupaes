import test from 'node:test';
import assert from 'node:assert/strict';
import {createGateway} from '../web/server/gateway.mjs';
const env={WEB_PAYMENTS_ENABLED:'false',ASSETS:{fetch:async()=>new Response('<html>OK</html>',{headers:{'content-type':'text/html'}})}};
const gateway=createGateway({fetcher:async()=>{throw Error('Backend must not be called for denied requests')},allowDevelopmentHttp:true});
const req=(path,options={})=>new Request('https://sitecacho.cl'+path,options);
const json=async res=>res.json();
test('no access to protected learning content without authentication',async()=>{
 for(const path of ['/app/inicio.html','/app/science-bank.js','/app/reading-bank.js','/app/competition-client.js']){
  const res=await gateway.fetch(req(path,{headers:{accept:'application/json'}}),env);
  assert.equal(res.status,404,path);
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
