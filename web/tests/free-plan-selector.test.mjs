import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('Free selector preserves all paid plans and opens the existing educational route',async()=>{
 const source=await readFile(new URL('../client/account.mjs',import.meta.url),'utf8');
 assert.match(source,/<h3>Plan Básico<\/h3><p class="price">Gratis<\/p>/);
 assert.match(source,/data-action="basic">Empezar gratis/);
 assert.match(source,/price-grid">'\+basic\+cards/);
 assert.match(source,/location.assign\('\/app\/inicio.html'\)/);
 const {PLANS}=await import('../shared/config.mjs');
 assert.deepEqual(Object.fromEntries(Object.entries(PLANS).map(([k,v])=>[k,v.amount])),{mensual:7990,semanal:2490,anual:64990});
});

import {createGateway} from '../server/gateway.mjs';
test('Account reload uses a deployment-specific bundle even with a four-hour cached previous script',async()=>{
 const gateway=createGateway({revision:'release-basic-cache-fix'});
 const env={ASSETS:{fetch:async req=>new Response(new URL(req.url).pathname==='/account.js'?'new-account-bundle':'<html><script src="/account.js" defer></script><script src="/web-shell.js"></script><script src="/web-init.js"></script></html>',{headers:{'content-type':new URL(req.url).pathname==='/account.js'?'application/javascript':'text/html','cache-control':'public, max-age=14400','etag':'old-asset','content-length':'123'}})}};
 for(const path of ['/cuenta','/cuenta.html','/cuenta.html?next=%2Fapp%2Finicio.html']){
  const response=await gateway.fetch(new Request('https://sitecacho.cl'+path),env);
  assert.equal(response.headers.get('cache-control'),'private, no-store');
  assert.equal(response.headers.get('etag'),null);
  const html=await response.text();
  for(const name of ['account','web-shell','web-init'])assert.ok(html.includes('/'+name+'.js?v=release-basic-cache-fix'));
 }
 const bundle=await gateway.fetch(new Request('https://sitecacho.cl/account.js?v=release-basic-cache-fix'),env);
 assert.equal(bundle.headers.get('cache-control'),'private, no-store');
 assert.equal(await bundle.text(),'new-account-bundle');
});

test('Educational HTML also versions its shared access scripts for previously installed browsers',async()=>{
 const gateway=createGateway({revision:'new-basic-runtime',protectedFiles:['/app/inicio.html'],fetcher:async url=>Response.json(url.endsWith('/auth/v1/user')?{id:'student'}:url.endsWith('/cachaste_access')?{userId:'student',active:true,serverTimeMs:Date.now(),validUntilMs:Date.now()+60000}:{documents:[]})});
 const env={ASSETS:{fetch:async()=>new Response('<html><!--CACHASTE_WEB_BOOTSTRAP--><script src="/web-init.js"></script><script src="/web-shell.js"></script><script src="/learning-access.js"></script></html>')}};
 const payload=Buffer.from(JSON.stringify({sub:'student',exp:Math.floor(Date.now()/1000)+600})).toString('base64url');
 const response=await gateway.fetch(new Request('https://sitecacho.cl/app/inicio.html',{headers:{authorization:'Bearer a.'+payload+'.fixture'}}),env);
 assert.equal(response.status,200);
 const html=await response.text();
 for(const name of ['web-init','web-shell','learning-access'])assert.ok(html.includes('/'+name+'.js?v=new-basic-runtime'));
});
