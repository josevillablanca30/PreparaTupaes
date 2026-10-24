import{STORAGE_KEYS}from'../shared/config.mjs';
import{mergeDocument,validateDocument}from'../shared/progress.mjs';
export function installProgressRuntime({bootstrap,storage=localStorage,fetcher=fetch,onStatus=()=>{},onConflict=()=>{}}){
 if(!bootstrap?.userId)throw Error('AUTH_REQUIRED');
 const uid=bootstrap.userId,prefix='cachaste-web:'+uid+':',keys=new Set(STORAGE_KEYS),original={get:Storage.prototype.getItem,set:Storage.prototype.setItem,remove:Storage.prototype.removeItem};
 const get=k=>original.get.call(storage,k),set=(k,v)=>original.set.call(storage,k,v),remove=k=>original.remove.call(storage,k);
 const parse=(raw,fallback=null)=>{try{return JSON.parse(raw)||fallback;}catch{return fallback;}};
 let meta=parse(get(prefix+'sync'),{}),timer=null,running=false,stopped=false,erased=false,conflicts=parse(get(prefix+'conflicts'),{});
 const persist=()=>{if(!erased)set(prefix+'sync',JSON.stringify(meta));};
 const pending=()=>Object.entries(meta).filter(([,v])=>v.dirty).length;
 const status=()=>onStatus(stopped?'expired':Object.keys(conflicts).length?'conflict':pending()?'pending':'saved');
 for(const document of bootstrap.documents||[]){
  const saved=meta[document.key];if(!keys.has(document.key))continue;
  if(!saved?.dirty){document.value===null?remove(prefix+document.key):set(prefix+document.key,JSON.stringify(document.value));meta[document.key]={version:document.version,base:document.value,dirty:false};}
 }
 persist();
 const enqueue=key=>{if(!keys.has(key)||stopped)return;meta[key]={...(meta[key]||{version:0,base:null}),dirty:true};persist();status();clearTimeout(timer);timer=setTimeout(flush,1800);};
 const wrappedGet=function(key){return original.get.call(this,this===storage&&keys.has(key)?prefix+key:key);};
 const wrappedSet=function(key,value){original.set.call(this,this===storage&&keys.has(key)?prefix+key:key,String(value));if(this===storage&&keys.has(key))enqueue(key);};
 const wrappedRemove=function(key){original.remove.call(this,this===storage&&keys.has(key)?prefix+key:key);if(this===storage&&keys.has(key))enqueue(key);};
 Storage.prototype.getItem=wrappedGet;Storage.prototype.setItem=wrappedSet;Storage.prototype.removeItem=wrappedRemove;
 async function rpc(operation,payload){const body=JSON.stringify({operation,payload}),keepalive=new TextEncoder().encode(body).length<60000;const res=await fetcher('/api/progress',{method:'POST',headers:{'content-type':'application/json','x-cachaste-request':'1'},body,keepalive});if(res.status===401||res.status===402){stopped=true;status();throw Error('ACCESS_EXPIRED');}if(!res.ok)throw Error('SYNC_UNAVAILABLE');return res.json();}
 async function flush(){
  if(running||stopped||navigator.onLine===false)return;running=true;
  try{for(const[key,record]of Object.entries(meta)){
   if(!record.dirty||conflicts[key])continue;
   const local=parse(get(prefix+key));validateDocument(key,local);
   let reply=await rpc('put',{key,value:local,baseVersion:record.version||0});
   if(reply.conflict){
    const remote=reply.document||{version:0,value:null},latest=parse(get(prefix+key)),merged=mergeDocument(record.base,latest,remote.value);
    if(JSON.stringify(latest)===JSON.stringify(remote.value)){meta[key]={version:remote.version,base:remote.value,dirty:false};persist();continue;}
    conflicts[key]={local:latest,remote,base:record.base,fields:merged.conflicts,canMerge:merged.conflicts.length===0};
    set(prefix+'conflicts',JSON.stringify(conflicts));onConflict({key,...conflicts[key]});continue;
   }
   const saved=reply.document;const changed=JSON.stringify(parse(get(prefix+key)))!==JSON.stringify(local);
   meta[key]={version:saved.version,base:saved.value,dirty:changed};persist();
  }}catch(e){if(e.message!=='ACCESS_EXPIRED')onStatus('pending');}
  finally{running=false;status();}
 }
 async function resolve(key,choice){
  const conflict=conflicts[key];if(!conflict||!['local','remote','merge'].includes(choice))return false;
  // Archive the alternative locally; choosing does not erase the other draft.
  set(prefix+'conflict-archive:'+Date.now()+':'+key,JSON.stringify(conflict));
  const latest=parse(get(prefix+key)),merge=mergeDocument(conflict.base,latest,conflict.remote.value);if(choice==='merge'&&merge.conflicts.length)throw Error('CONFLICT_CHANGED');
  const value=choice==='local'?latest:choice==='merge'?merge.value:conflict.remote.value;
  if(choice!=='remote'){const reply=await rpc('put',{key,value,baseVersion:conflict.remote.version});if(reply.conflict){conflicts[key].remote=reply.document;set(prefix+'conflicts',JSON.stringify(conflicts));throw Error('CONFLICT_CHANGED');}meta[key]={version:reply.document.version,base:value,dirty:false};}
  else meta[key]={version:conflict.remote.version,base:value,dirty:false};
  value===null?remove(prefix+key):set(prefix+key,JSON.stringify(value));delete conflicts[key];set(prefix+'conflicts',JSON.stringify(conflicts));persist();status();return true;
 }
 addEventListener('online',flush);addEventListener('pagehide',()=>{clearTimeout(timer);persist();});// Safari may abort new network work during navigation. Persist the queue; foreground debounce/online/reopen performs the sync.
 document.addEventListener('visibilitychange',()=>{if(document.hidden)persist();});
 status();if(pending())timer=setTimeout(flush,50);
 return{flush,resolve,pending,conflicts,userId:uid,erase(){erased=true;stopped=true;clearTimeout(timer);for(const key of Object.keys(storage))if(key.startsWith(prefix))remove(key);},restore(){Storage.prototype.getItem=original.get;Storage.prototype.setItem=original.set;Storage.prototype.removeItem=original.remove;clearTimeout(timer);}};
}
if(typeof window!=='undefined'){
 const node=document.getElementById('cachaste-web-bootstrap');
 if(node){const bootstrap=JSON.parse(node.textContent);window.CachasteWebBootstrap=bootstrap;window.CachasteWebProgress=installProgressRuntime({bootstrap,onStatus:status=>{window.CachasteWebSyncStatus=status;dispatchEvent(new CustomEvent('cachaste-sync',{detail:status}));},onConflict:()=>dispatchEvent(new Event('cachaste-conflict'))});}
}
