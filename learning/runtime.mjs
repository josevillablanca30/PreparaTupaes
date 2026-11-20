import {getWebClient} from '../web/client/auth.mjs';
import {PROJECT_URL,PUBLISHABLE_KEY,STORAGE_KEYS} from '../web/shared/config.mjs';
import {restoreVerifiedHistory} from './verified-history.mjs';
import {attachOriginalEngine} from './original-engine.mjs';
import {installProgressRuntime} from '../web/client/progress-runtime.mjs';
const enabled=location.origin==='https://appassets.androidplatform.net'||window.CachasteWebBootstrap?.originalEngineEnabled===true;
const android=location.origin==='https://appassets.androidplatform.net';
const sdk=enabled?getWebClient({supabaseUrl:PROJECT_URL,publishableKey:PUBLISHABLE_KEY}):null;
let access=null,bootstrap=null,sync=null,adapter=null;
const nativeRequests=new Map();
if(android&&window.CachasteAccess)window.CachasteAccess.onmessage=event=>{try{const reply=JSON.parse(event.data),pending=nativeRequests.get(reply.id);if(!pending)return;nativeRequests.delete(reply.id);clearTimeout(pending.timer);reply.error?pending.reject(Error(reply.error)):pending.resolve(reply);}catch{}};
async function native(action){
 if(!android||!window.CachasteAccess?.postMessage)return null;
 const data=action==='cached'?{session:null}:(await sdk.auth.getSession()).data;
 return new Promise((resolve,reject)=>{const id=crypto.randomUUID(),timer=setTimeout(()=>{nativeRequests.delete(id);reject(Error('ACCESS_UNAVAILABLE'));},20000);nativeRequests.set(id,{resolve,reject,timer});window.CachasteAccess.postMessage(JSON.stringify({id,action,token:data.session?.access_token,userId:data.session?.user?.id}));});
}
const rpc=async(operation,payload={})=>{
 const {data,error}=await sdk.rpc('cachaste_original_learning',{operation,payload});if(error)throw error;return data;
};
function failed(){
 const root=document.getElementById('daily-root');if(root){root.replaceChildren();const p=document.createElement('p');p.setAttribute('role','alert');p.textContent='Conéctate e inicia sesión para recuperar tu acceso y continuar aprendiendo.';const a=document.createElement('a');a.href=android?'competencia.html#perfil':'/cuenta.html';a.textContent='Ir a mi cuenta';root.append(p,a);}
}
async function refresh(){
 if(android&&navigator.onLine===false){const cached=await native('cached');if(cached?.active!==true||cached.tier!=='premium'||!cached.userId||access?.userId&&cached.userId!==access.userId)throw Error('ACCESS_UNAVAILABLE');access={userId:cached.userId,tier:'premium',active:true};return 'premium';}
 const {data,error}=await sdk.rpc('cachaste_learning_access');if(error||!data?.userId||!['premium','basica'].includes(data.tier))throw error||Error('ACCESS_UNAVAILABLE');
 if(access?.userId&&access.userId!==data.userId)throw Error('SESSION_CHANGED');
 access=data;if(android)await native('verify');return data.tier;
}
const ready=(async()=>{
 if(!enabled)return;
 let data;
 if(android&&navigator.onLine===false){
  await refresh();let remembered;try{remembered=JSON.parse(localStorage.getItem('cachaste-auth-v1'));}catch{}
  if(remembered?.user?.id!==access.userId)throw Error('AUTH_REQUIRED');
  data={user:{id:access.userId}};bootstrap={documents:[],activity:null};
 }else{
  const checked=await sdk.auth.getUser();if(checked.error||!checked.data.user)throw Error('AUTH_REQUIRED');data=checked.data;
  await refresh();bootstrap=await rpc('state');
 }
 if(android&&navigator.onLine!==false){
  const archive=await native('legacy');let legacy;try{legacy=JSON.parse(archive?.legacy||'{}');}catch{legacy={};}
  const bound=localStorage.getItem('cachaste-legacy-owner');
  if(!bound){
   // Preserve the device's pre-account educational data without overwriting a remote document.
   for(const key of STORAGE_KEYS){const value=legacy[key];if(typeof value==='string'&&!bootstrap.documents.some(d=>d.key===key)&&localStorage.getItem('cachaste-web:'+data.user.id+':'+key)===null){localStorage.setItem('cachaste-web:'+data.user.id+':'+key,value);}}
   localStorage.setItem('cachaste-legacy-owner',data.user.id);
  }
 }
 if(globalThis.CachasteWebProgress&&access.tier==='basica')globalThis.CachasteWebProgress.pause();
 if(!globalThis.CachasteWebProgress){
  // Use the same user-scoped document keys and conflict handling as the web.
  // Legacy local progress stays in its original keys as a durable backup.
  sync=installProgressRuntime({bootstrap:{userId:data.user.id,tier:access.tier,documents:bootstrap.documents},fetcher:async(path,options)=>{
   const request=JSON.parse(options.body);
   const result=await sdk.rpc('cachaste_web_progress',{operation:request.operation,payload:request.payload});
   return new Response(JSON.stringify(result.error?{error:result.error.message}:result.data),{status:result.error?503:200});
  }});
  if(access.tier==='basica')sync.pause();
 }
 sdk.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT'){sync?.pause();failed();}});
})();
// Handle the rejection here too: the daily engine waits on this promise and renders its own error.
ready.catch(()=>{});
function prepare(E){
 if(!enabled)return;
 if(access.tier==='basica')restoreVerifiedHistory(E,window.CACHASTE_DAILY_CATALOG);
 adapter=attachOriginalEngine({engine:E,rpc,tier:access.tier,activity:bootstrap.activity,refresh,notify:result=>{
  const app=window.CachasteDailyApp;
  if(result.message){let n=document.querySelector('[data-learning-notice]');if(!n){n=document.createElement('p');n.dataset.learningNotice='';n.setAttribute('role','alert');document.getElementById('daily-root').before(n);}n.textContent=result.message;}
  if(result.started){location.hash='#session';app?.restoreSubject?.();app?.render();}
  if(result.answered)app?.render();
  if(result.advance)document.querySelector('#daily-root button[data-action="next"]')?.click();
 }});
 const root=document.getElementById('daily-root');
 root.addEventListener('click',event=>{
  const action=event.target.closest('button[data-action]')?.dataset.action;
  if(adapter.tier!=='basica')return;
  // Foundation micro-lessons remain readable; their separate local quiz cannot bypass the stage quota.
  if(['exam-mode','unit-exam','basic-start','basic-check','basic-next'].includes(action)){
   event.preventDefault();event.stopImmediatePropagation();
   let note=document.querySelector('[data-learning-notice]');if(!note){note=document.createElement('p');note.dataset.learningNotice='';note.setAttribute('role','alert');root.before(note);}note.textContent=action==='exam-mode'||action==='unit-exam'?'El ensayo completo es exclusivo de Premium.':'Continúa desde las etapas de tu camino para guardar tu avance.';
  }
 },true);
 const verifyOnResume=async()=>{if(document.hidden)return;try{const tier=await refresh();await adapter.setTier(tier);sync?.setVerifiedOnly(tier==='basica');if(tier==='basica')sync?.pause();else sync?.resume();}catch{failed();}};
 if(android)setInterval(()=>{void verifyOnResume();},60000);
 document.addEventListener('visibilitychange',verifyOnResume);window.addEventListener('online',verifyOnResume);
 // Reading a legacy full-exam URL requires Premium on BOTH platforms.
 window.addEventListener('hashchange',()=>{if(adapter.tier==='basica'&&location.hash==='#traditional')location.hash='#home';});
 if(adapter.tier==='basica'&&location.hash==='#traditional')location.hash='#home';
}
window.CachasteLearningAccess=Object.freeze({enabled,ready,prepare,failed});
