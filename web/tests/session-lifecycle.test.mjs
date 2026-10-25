import test from 'node:test';
import assert from 'node:assert/strict';
import {installSessionLifecycle} from '../client/session-lifecycle.mjs';
const session=(token='refreshed',id='student-a')=>({access_token:token,user:{id}});
function setup(options={}){
  let listener;const calls=[],states=[],ends=[];let pauses=0,resumes=0;
  const sdk={auth:{onAuthStateChange:fn=>{listener=fn;return{data:{subscription:{unsubscribe(){listener=null;}}}};},getSession:async()=>({data:{session:session()}})}};
  const runtime=installSessionLifecycle({sdk,userId:'student-a',progress:{pause(){pauses++;},resume(){resumes++;}},onState:s=>states.push(s),onEnd:r=>ends.push(r),fetcher:async(_url,init)=>{calls.push(init);return Response.json({user:{id:'student-a'},access:{active:true},offlineLicense:'signed-lease'});},online:()=>true,...options});
  return{runtime,sdk,calls,states,ends,emit:(e,s)=>listener(e,s),get pauses(){return pauses;},get resumes(){return resumes;}};
}
test('a refreshed access token renews the checked HttpOnly session and offline lease once',async()=>{
  const licenses=[],h=setup({onLicense:l=>licenses.push(l)});await h.runtime.renew(session());await h.runtime.renew(session());
  assert.equal(h.calls.length,1);assert.equal(h.calls[0].headers.authorization,'Bearer refreshed');assert.equal(h.calls[0].cache,'no-store');assert.deepEqual(licenses,['signed-lease']);assert.equal(h.resumes,1);h.runtime.dispose();
});
test('a different SDK or server identity pauses the old draft and never synchronizes it as the new student',async()=>{
  const h=setup();await h.runtime.renew(session('other','student-b'));assert.equal(h.calls.length,0);assert.equal(h.pauses,1);assert.deepEqual(h.ends,['account-changed']);
  let resumed=0;const other=setup({fetcher:async()=>Response.json({user:{id:'student-b'},access:{active:true}}),onLicense:()=>resumed++});await other.runtime.renew(session());assert.equal(resumed,0);assert.deepEqual(other.ends,['account-changed']);
});
test('a lost connection preserves the draft; reconnect retries, and server revocation ends the session',async()=>{
  let network=false;const h=setup({fetcher:async()=>{if(!network)throw Error('network');return Response.json({user:{id:'student-a'},access:{active:true}});}});
  await h.runtime.renew(session());assert.deepEqual(h.states,['reconnecting']);assert.equal(h.ends.length,0);network=true;await h.runtime.reconnect();assert.equal(h.states.at(-1),'ready');
  const revoked=setup({fetcher:async()=>Response.json({error:'AUTH_REQUIRED'},{status:401})});await revoked.runtime.renew(session());assert.deepEqual(revoked.ends,['signed-out']);assert.equal(revoked.resumes,0);h.runtime.dispose();
});
test('expired Premium blocks learning but leaves account administration available',async()=>{
  const fetcher=async()=>Response.json({user:{id:'student-a'},access:{active:false}});
  const learning=setup({fetcher});await learning.runtime.renew(session());assert.deepEqual(learning.ends,['access-expired']);
  const profile=setup({fetcher,requireAccess:false});await profile.runtime.renew(session());assert.equal(profile.ends.length,0);assert.equal(profile.resumes,1);profile.runtime.dispose();
});
test('auth callbacks release the SDK lock before asynchronous work, and offline use is not signed out',async()=>{
  const tasks=[],h=setup({schedule:fn=>tasks.push(fn)});h.emit('TOKEN_REFRESHED',session());assert.equal(h.calls.length,0);await tasks.shift()();assert.equal(h.calls.length,1);h.runtime.dispose();
  const offline=setup({online:()=>false});await offline.runtime.renew(null);await offline.runtime.renew(session());assert.equal(offline.calls.length,0);assert.equal(offline.ends.length,0);offline.runtime.dispose();
});
