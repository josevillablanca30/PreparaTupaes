import test from 'node:test';
import assert from 'node:assert/strict';
import {nextLearningPage,finishAuthReturn,startGoogleSignIn} from '../web/client/auth.mjs';
test('post-login destinations only allow internal educational HTML pages',()=>{
 assert.equal(nextLearningPage('?next=%2Fapp%2Finicio.html'),'/app/inicio.html');
 for(const next of ['https://evil.example','//evil.example','/cuenta.html','/app/../cuenta.html','/app/%2e%2e/secret.html','/app/evil.js'])
  assert.equal(nextLearningPage('?next='+encodeURIComponent(next)),'/app/inicio.html',next);
});
test('OAuth return removes authorization code before exchange',async()=>{
 const location={href:'https://sitecacho.cl/cuenta.html?code=example_code&next=%2Fapp%2Freading.html'};
 let cleaned='',called=false;
 const history={replaceState(_a,_b,path){cleaned=path;}};
 const sdk={auth:{async exchangeCodeForSession(code){called=true;assert.equal(code,'example_code');assert.equal(cleaned,'/cuenta.html?next=%2Fapp%2Freading.html');return {error:null};}}};
 assert.equal(await finishAuthReturn({sdk,location,history}),true);assert.equal(called,true);
});
test('malformed OAuth return is cleaned and rejected',async()=>{
 let cleaned='';
 await assert.rejects(()=>finishAuthReturn({sdk:{auth:{exchangeCodeForSession(){throw Error('must not exchange');}}},location:{href:'https://sitecacho.cl/cuenta.html?code=bad%20code'},history:{replaceState(_a,_b,path){cleaned=path;}}}),/AUTH_RETURN_INVALID/);
 assert.equal(cleaned,'/cuenta.html');
});
test('Google sign-in cannot start when provider is not approved',async()=>{
 await assert.rejects(()=>startGoogleSignIn({sdk:{auth:{}},config:{googleAuthEnabled:false,authReturnReady:false},fetcher:()=>{throw Error('must not fetch');}}),/GOOGLE_NOT_READY/);
});
