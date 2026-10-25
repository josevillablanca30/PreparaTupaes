import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {getWebClient, nextLearningPage, startGoogleSignIn, finishAuthReturn} from '../client/auth.mjs';
import {adaptCompetitionClient} from '../shared/competition-client.mjs';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {adaptCompetitionUi} from '../shared/competition-ui.mjs';

const config = {supabaseUrl:'https://jmobinmdwrmdqrxtcruj.supabase.co',publishableKey:'sb_publishable_isolated_qa',googleAuthEnabled:true,authReturnReady:true};
const ready = async () => Response.json({googleReady:true});
test('Google uses the installed Supabase SDK with S256 PKCE and one shared refresh client', async t => {
  const values = new Map(), storage = {getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
  const sdk = getWebClient(config, storage);
  t.after(async()=>{await sdk.auth.stopAutoRefresh();delete globalThis[Symbol.for('cachaste.web.auth')];});
  assert.equal(getWebClient(config, storage), sdk);
  assert.throws(()=>getWebClient({...config,supabaseUrl:'https://foreign.supabase.co'},storage),/CONFIGURATION_CHANGED/);
  let assigned;
  await startGoogleSignIn({sdk,config,fetcher:ready,location:{origin:'https://sitecacho.cl',search:'?next=%2Fapp%2Fm2.html',assign:url=>assigned=new URL(url)}});
  assert.equal(assigned.origin,config.supabaseUrl);
  assert.equal(assigned.searchParams.get('provider'),'google');
  assert.equal(assigned.searchParams.get('code_challenge_method'),'s256');
  const verifier=JSON.parse(values.get('cachaste-auth-v1-code-verifier'));assert.ok(verifier);
  assert.equal(assigned.searchParams.get('code_challenge'),createHash('sha256').update(verifier).digest('base64url'));
  const redirect=new URL(assigned.searchParams.get('redirect_to'));assert.equal(redirect.origin,'https://sitecacho.cl');assert.equal(redirect.pathname,'/cuenta.html');assert.equal(redirect.searchParams.get('next'),'/app/m2.html');
  assert.ok(!assigned.href.includes('access_token'));
});
test('Google requires both launch gates and the real configured provider before redirecting',async()=>{
  let calls=0;const sdk={auth:{signInWithOAuth:async()=>{calls++;throw Error('must not reach provider');}}};
  for(const settings of[{...config,googleAuthEnabled:false},{...config,authReturnReady:false}])await assert.rejects(startGoogleSignIn({sdk,config:settings}),/GOOGLE_NOT_READY/);
  await assert.rejects(startGoogleSignIn({sdk,config,fetcher:async()=>Response.json({googleReady:false})}),/GOOGLE_NOT_READY/);
  assert.equal(calls,0);
});
test('OAuth cannot redirect to another host, provider or a non-PKCE authorization flow',async()=>{
  for(const url of['https://evil.example/auth/v1/authorize','https://jmobinmdwrmdqrxtcruj.supabase.co/auth/v1/authorize?provider=google','https://jmobinmdwrmdqrxtcruj.supabase.co/other?provider=google']){
    await assert.rejects(startGoogleSignIn({config,fetcher:ready,sdk:{auth:{signInWithOAuth:async()=>({data:{url}})}},location:{origin:'https://sitecacho.cl',assign:()=>assert.fail('foreign redirect')}}),/AUTH_REDIRECT_DENIED/);
  }
});
test('callback clears codes and errors from history before exchanging; expired codes never create a session',async()=>{
  const steps=[];await finishAuthReturn({location:{href:'https://sitecacho.cl/cuenta.html?code=one-time-code&next=https%3A%2F%2Fevil.example'},history:{replaceState:(_a,_b,path)=>steps.push(path)},sdk:{auth:{exchangeCodeForSession:async code=>{steps.push(code);return{};}}}});
  assert.deepEqual(steps,['/cuenta.html?next=%2Fapp%2Finicio.html','one-time-code']);
  for(const suffix of['?error=access_denied&error_description=untrusted','#access_token=private-token','?code=expired-code']){
    let clean;await assert.rejects(finishAuthReturn({location:{href:'https://sitecacho.cl/cuenta.html'+suffix},history:{replaceState:(_a,_b,path)=>clean=path},sdk:{auth:{exchangeCodeForSession:async()=>({error:Error('expired')})}}}),/AUTH_RETURN_/);
    assert.equal(clean,'/cuenta.html');
  }
});
test('normal account anchors stay intact; recovery callback keeps only its safe destination',async()=>{
  assert.equal(await finishAuthReturn({location:{href:'https://sitecacho.cl/cuenta.html#planes'}}),false);
  let clean;await finishAuthReturn({location:{href:'https://sitecacho.cl/cuenta.html?code=valid-code&recovery=1'},history:{replaceState:(_a,_b,path)=>clean=path},sdk:{auth:{exchangeCodeForSession:async()=>({})}}});assert.equal(clean,'/cuenta.html?recovery=1');
  for(const next of['https://evil.example','//evil.example','/app/%2e%2e/bank','/app/inicio.html?premium=true'])assert.equal(nextLearningPage('?next='+encodeURIComponent(next)),'/app/inicio.html');
});
test('the web competition adapter reuses the PKCE session without changing Android source',async()=>{
  const original=await readFile(new URL('../../competition-client.mjs',import.meta.url),'utf8'),adapted=adaptCompetitionClient(original);
  assert.ok(adapted.includes('getWebClient(config,storage)'));assert.ok(original.includes("detectSessionInUrl:typeof window!=="));
  assert.throws(()=>adaptCompetitionClient('changed upstream'),/REVIEW_COMPETITION_AUTH_ADAPTER/);
});
test('Google-only account deletion has no local password requirement, retains server confirmation, and remains valid JavaScript',async()=>{
 const original=await readFile(new URL('../../competition-app.js',import.meta.url),'utf8'),adapted=adaptCompetitionUi(original);new vm.Script(adapted);
 assert.ok(adapted.includes("api.user?.app_metadata?.provider==='google'"));assert.ok(adapted.includes('confirma con Google'));assert.ok(adapted.includes("await api.call('delete_account',{confirmation:values.get('confirmation')})"));assert.ok(original.includes("await api.signIn(email,String(values.get('password')));"));
});
