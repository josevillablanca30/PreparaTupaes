import test from'node:test';import assert from'node:assert/strict';
import{createGateway}from'../server/gateway.mjs';import{offlineLicense,publicOfflineKey,safeJson}from'../server/offline.mjs';
const uid='10000000-0000-4000-8000-000000000001';
const token=()=>['eyJhbGciOiJIUzI1NiJ9',Buffer.from(JSON.stringify({sub:uid,exp:Math.floor(Date.now()/1000)+3600})).toString('base64url'),'isolated-test-signature'].join('.');
function harness(options={}){let active=true,revoked=false;const t=token(),calls=[];const gateway=createGateway({...options,protectedFiles:['/app/index.html','/app/daily-catalog.js'],revision:'qa-build',fetcher:async(url,options)=>{
 calls.push({url,options});if(options.headers.authorization!=='Bearer '+t||revoked)return Response.json({message:'AUTH_REQUIRED'},{status:401});
 if(url.endsWith('/auth/v1/user'))return Response.json({id:uid,email:'student@example.invalid'});
 if(url.endsWith('/rpc/cachaste_access'))return Response.json({userId:uid,active,serverTimeMs:Date.now(),validUntilMs:active?Date.now()+3600000:null});
 if(url.endsWith('/rpc/cachaste_web_account'))return Response.json({access:{userId:uid,active},subscriptions:[],trialUsed:false});
 if(url.endsWith('/rpc/cachaste_web_progress'))return Response.json({documents:[]});
 return Response.json({error:'NOT_FOUND'},{status:404});
 }}),env={ASSETS:{async fetch(req){const p=new URL(req.url).pathname;if(p==='/app/index.html')return new Response('<html><head><!--CACHASTE_WEB_BOOTSTRAP--></head></html>',{headers:{'content-type':'text/html'}});if(p==='/app/daily-catalog.js')return new Response('PRIVATE_BANK_ANSWERS',{headers:{'content-type':'text/javascript'}});if(p==='/')return new Response('PUBLIC_LANDING');return new Response('Not found',{status:404});}}};
 const req=(path,options={})=>new Request('https://qa.example'+path,options);
 return{gateway,env,token:t,calls,req,setActive:v=>active=v,revoke:()=>revoked=true};}
test('the complete answer bank is denied without a verified server entitlement',async()=>{const h=harness();const r=await h.gateway.fetch(h.req('/app/daily-catalog.js'),h.env);assert.equal(r.status,401);assert.ok(!(await r.text()).includes('PRIVATE_BANK_ANSWERS'));h.setActive(false);const n=await h.gateway.fetch(h.req('/app/daily-catalog.js',{headers:{authorization:'Bearer '+h.token}}),h.env);assert.equal(n.status,402);assert.equal((await h.gateway.fetch(h.req('/'),h.env)).status,200);});
test('editing a token or sending a Premium flag never bypasses Auth and server access',async()=>{const h=harness();const forged=h.token.replace('isolated-test','forged');const r=await h.gateway.fetch(h.req('/app/daily-catalog.js?premium=true',{headers:{authorization:'Bearer '+forged}}),h.env);assert.equal(r.status,401);});
test('hosted Auth may reject an invalid JWT with 400 or 403; all unauthorized identities remain a clear 401 without reading a bank',async()=>{
 for(const status of[400,401,403]){
  let assets=0,calls=0;const gateway=createGateway({protectedFiles:['/app/daily-catalog.js'],fetcher:async url=>{calls++;assert.ok(url.endsWith('/auth/v1/user'));return Response.json({msg:'Invalid JWT'},{status});}});
  const response=await gateway.fetch(new Request('https://qa.example/app/daily-catalog.js',{headers:{authorization:'Bearer '+token()}}),{ASSETS:{fetch:async()=>{assets++;return new Response('PRIVATE_BANK');}}});
  assert.equal(response.status,401);assert.deepEqual(await response.json(),{error:'AUTH_REQUIRED'});assert.match(response.headers.get('cache-control'),/no-store/);assert.equal(assets,0);assert.equal(calls,1);
 }
});
test('session exchange issues HttpOnly cookie and HTML bootstrap belongs to the checked identity',async()=>{const h=harness();const r=await h.gateway.fetch(h.req('/api/session',{method:'POST',headers:{origin:'https://qa.example','x-cachaste-request':'1',authorization:'Bearer '+h.token},body:'{}'}),h.env);assert.equal(r.status,200);const c=r.headers.get('set-cookie');assert.match(c,/HttpOnly/);assert.match(c,/Secure/);assert.match(c,/SameSite=Lax/);const html=await h.gateway.fetch(h.req('/app/index.html',{headers:{cookie:c.split(';')[0]}}),h.env);assert.equal(html.status,200);assert.match(await html.text(),new RegExp(uid));assert.equal(html.headers.get('cache-control'),'private, no-store');assert.equal(html.headers.get('x-cachaste-user'),uid);});
test('cross-origin state changes fail before any backend request',async()=>{const h=harness();for(const path of['/api/session','/api/progress','/api/billing']){const r=await h.gateway.fetch(h.req(path,{method:'POST',headers:{origin:'https://evil.example',authorization:'Bearer '+h.token,'x-cachaste-request':'1'},body:'{}'}),h.env);assert.equal(r.status,403);}assert.equal(h.calls.length,0);});
test('a stale tab cannot upload one student draft under a different cookie identity',async()=>{
 const h=harness();const r=await h.gateway.fetch(h.req('/api/progress',{method:'POST',headers:{origin:'https://qa.example','x-cachaste-request':'1',authorization:'Bearer '+h.token},body:JSON.stringify({operation:'put',userId:'another-student',payload:{key:'cachaste-daily-v1',value:{subject:'M1'},baseVersion:0}})}),h.env);
 assert.equal(r.status,409);assert.deepEqual(await r.json(),{error:'SESSION_CHANGED'});assert.equal(h.calls.some(x=>x.url.endsWith('/rpc/cachaste_web_progress')),false);
});
test('Google readiness checks the actual Auth provider, and closed flags do not contact the backend',async()=>{
 let calls=0;const g=createGateway({fetcher:async url=>{calls++;assert.ok(url.endsWith('/auth/v1/settings'));return Response.json({external:{google:true}});}}),req=new Request('https://qa.example/api/auth/status');
 const closed=await g.fetch(req,{});assert.deepEqual(await closed.json(),{googleReady:false});assert.equal(calls,0);
 const opened=await g.fetch(req,{WEB_GOOGLE_AUTH_ENABLED:'true',WEB_AUTH_RETURN_READY:'true'});assert.deepEqual(await opened.json(),{googleReady:true});assert.equal(calls,1);assert.equal(opened.headers.get('cache-control'),'private, no-store');
});
test('synchronization verifies current access and a revoked live session fails immediately',async()=>{const h=harness();const r=await h.gateway.fetch(h.req('/api/progress',{method:'POST',headers:{origin:'https://qa.example','x-cachaste-request':'1',authorization:'Bearer '+h.token},body:JSON.stringify({operation:'snapshot'})}),h.env);assert.equal(r.status,200);h.revoke();const revoked=await h.gateway.fetch(h.req('/api/progress',{method:'POST',headers:{origin:'https://qa.example','x-cachaste-request':'1',authorization:'Bearer '+h.token},body:JSON.stringify({operation:'snapshot'})}),h.env);assert.equal(revoked.status,401);});
test('unknown and encoded private paths cannot fall through to public assets',async()=>{const h=harness();for(const p of['/app/hidden.sql','/%2561pp/daily-catalog.js','/_worker.js','/private.map']){const r=await h.gateway.fetch(h.req(p),h.env);assert.ok([400,404].includes(r.status));assert.ok(!(await r.text()).includes('PRIVATE_BANK_ANSWERS'));}});
test('offline license is signed with server-owned EC key, audience and bounded expiry',async()=>{const keys=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']),jwk=await crypto.subtle.exportKey('jwk',keys.privateKey),env={OFFLINE_SIGNING_JWK:JSON.stringify(jwk)},now=Date.now();const lease=await offlineLicense(env,uid,now+86400000,'https://qa.example','test',now),parts=lease.split('.'),payload=JSON.parse(Buffer.from(parts[1],'base64url'));assert.equal(payload.sub,uid);assert.equal(payload.aud,'https://qa.example');assert.ok(payload.exp*1000<=now+43200000);assert.ok(await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},keys.publicKey,Buffer.from(parts[2],'base64url'),Buffer.from(parts[0]+'.'+parts[1])));assert.equal(publicOfflineKey(env).d,undefined);assert.equal(await offlineLicense({},uid,now+10000,'https://qa.example','test'),null);});
test('student-controlled progress cannot close the bootstrap script tag',()=>{assert.ok(!safeJson({session:'</script><script>alert(1)</script>'}).includes('<'));});

test('account administration works after expiry while the educational bank remains locked',async()=>{const h=harness({accountFiles:['/app/index.html']});h.setActive(false);const account=await h.gateway.fetch(h.req('/app/index.html',{headers:{authorization:'Bearer '+h.token}}),h.env);assert.equal(account.status,200);assert.ok(!(await account.text()).includes('PRIVATE_BANK_ANSWERS'));assert.equal((await h.gateway.fetch(h.req('/app/daily-catalog.js',{headers:{authorization:'Bearer '+h.token}}),h.env)).status,402);});
test('an access grant cached before expiry cannot prevent profile administration or request an expired learning snapshot',async()=>{
 const h=harness({accountFiles:['/app/index.html']});await h.gateway.fetch(h.req('/api/session',{method:'POST',headers:{origin:'https://qa.example','x-cachaste-request':'1',authorization:'Bearer '+h.token}}),h.env);h.setActive(false);const start=h.calls.length;
 const page=await h.gateway.fetch(h.req('/app/index.html',{headers:{authorization:'Bearer '+h.token,accept:'text/html'}}),h.env);assert.equal(page.status,200);const html=await page.text();assert.match(html,/"documents":\[\]/);assert.match(html,/"offlineLicense":null/);assert.equal(h.calls.slice(start).some(c=>c.url.endsWith('/rpc/cachaste_web_progress')),false);assert.ok(h.calls.slice(start).some(c=>c.url.endsWith('/rpc/cachaste_access')));
});
test('opening a learning page rechecks current access even while a static-file grant is cached',async()=>{
 const h=harness();await h.gateway.fetch(h.req('/app/daily-catalog.js',{headers:{authorization:'Bearer '+h.token}}),h.env);h.setActive(false);
 const page=await h.gateway.fetch(h.req('/app/index.html',{headers:{authorization:'Bearer '+h.token,accept:'text/html'}}),h.env);assert.equal(page.status,302);assert.match(page.headers.get('location'),/\/cuenta.html\?next=/);
});
test('production gateway always redirects HTTP; the managed local preview is the only opt-in exception',async()=>{const h=harness();const response=await h.gateway.fetch(new Request('http://web.example/'),h.env);assert.equal(response.status,308);assert.equal(response.headers.get('location'),'https://web.example/');});
test('Pages HTML canonicalization serves account and public documents at their stable return URLs, preserving queries and security headers',async()=>{
 const gateway=createGateway();
 for(const [original,canonical]of[['/cuenta.html','/cuenta'],['/privacidad.html','/privacidad'],['/condiciones.html','/condiciones'],['/eliminar-cuenta.html','/eliminar-cuenta'],['/offline.html','/offline'],['/index.html','/']]){
  const calls=[],search='?next=%2Fapp%2Finicio.html';
  const env={ASSETS:{fetch:async req=>{const url=new URL(req.url);calls.push(url.pathname+url.search);if(url.pathname===original)return new Response(null,{status:308,headers:{location:canonical}});assert.equal(url.pathname,canonical);return new Response('PUBLIC_DOCUMENT',{headers:{'content-type':'text/html'}});}}};
  const response=await gateway.fetch(new Request('https://qa.example'+original+search),env);
  assert.equal(response.status,200);assert.equal(await response.text(),'PUBLIC_DOCUMENT');assert.deepEqual(calls,[original+search,canonical+search]);assert.match(response.headers.get('content-security-policy'),/frame-ancestors 'none'/);assert.equal(response.headers.get('location'),null);
 }
});
test('a public asset redirect cannot cause the gateway to fetch another origin or an unexpected path',async()=>{
 const gateway=createGateway();
 for(const location of['https://foreign.example/cuenta','/app/daily-catalog.js']){
  let calls=0;const env={ASSETS:{fetch:async()=>{calls++;return new Response(null,{status:308,headers:{location}});}}};
  const response=await gateway.fetch(new Request('https://qa.example/cuenta.html'),env);assert.equal(response.status,308);assert.equal(calls,1);
 }
});
