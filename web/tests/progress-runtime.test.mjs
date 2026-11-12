import test from'node:test';import assert from'node:assert/strict';import{installProgressRuntime}from'../client/progress-runtime.mjs';
class LocalStorage{getItem(key){return Object.hasOwn(this,key)?this[key]:null;}setItem(key,value){Object.defineProperty(this,key,{value:String(value),writable:true,enumerable:true,configurable:true});}removeItem(key){delete this[key];}}
const uid='10000000-0000-4000-8000-000000000001',key='cachaste-daily-v1';
test('browser lifecycle saves its own queue without firing unload requests, then resumes and resolves conflicts without dropping another account',async()=>{
 const saved={Storage:globalThis.Storage,document:globalThis.document,addEventListener:globalThis.addEventListener,removeEventListener:globalThis.removeEventListener,navigator:Object.getOwnPropertyDescriptor(globalThis,'navigator')},events=new Map(),docEvents=new Map(),calls=[],storage=new LocalStorage();
 globalThis.Storage=LocalStorage;globalThis.addEventListener=(name,fn)=>events.set(name,fn);globalThis.removeEventListener=(name,fn)=>{if(events.get(name)===fn)events.delete(name);};globalThis.document={hidden:false,addEventListener:(name,fn)=>docEvents.set(name,fn),removeEventListener:(name,fn)=>{if(docEvents.get(name)===fn)docEvents.delete(name);}};Object.defineProperty(globalThis,'navigator',{value:{onLine:true},configurable:true});
 const rawGet=LocalStorage.prototype.getItem;storage.setItem(key,JSON.stringify({subject:'Historia'}));storage.setItem('cachaste-auth-v1','session-secret-qa');storage.setItem('cachaste-web:other:'+key,'another-student');
 let runtime;const boot={userId:uid,documents:[{key,value:{subject:'M1',attempts:[]},version:1}]};
 const fetcher=async(_url,opts)=>{calls.push(opts);const p=JSON.parse(opts.body).payload;return Response.json({conflict:false,document:{key:p.key,value:p.value,version:2}});};
 try{
  runtime=installProgressRuntime({bootstrap:boot,storage,fetcher});assert.equal(JSON.parse(storage.getItem(key)).subject,'M1');assert.equal(JSON.parse(rawGet.call(storage,key)).subject,'Historia');
  storage.setItem(key,JSON.stringify({subject:'M2',attempts:[{eventId:'a',correct:true}]}));assert.equal(runtime.pending(),1);document.hidden=true;docEvents.get('visibilitychange')();events.get('pagehide')();assert.equal(calls.length,0);assert.equal(JSON.parse(rawGet.call(storage,'cachaste-web:'+uid+':sync'))[key].dirty,true);
  runtime.restore();document.hidden=false;runtime=installProgressRuntime({bootstrap:boot,storage,fetcher});assert.equal(JSON.parse(storage.getItem(key)).subject,'M2');await runtime.flush();assert.equal(runtime.pending(),0);assert.equal(calls[0].keepalive,true);assert.equal(JSON.parse(calls[0].body).payload.baseVersion,1);runtime.restore();
  const remote={key,value:{subject:'Lectura',attempts:[{eventId:'b',correct:false}]},version:3};runtime=installProgressRuntime({bootstrap:{userId:uid,documents:[]},storage,fetcher:async()=>Response.json({conflict:true,document:remote})});storage.setItem(key,JSON.stringify({subject:'Ciencias',attempts:[{eventId:'a',correct:true}]}));await runtime.flush();assert.equal(runtime.conflicts[key].local.subject,'Ciencias');assert.equal(JSON.parse(storage.getItem(key)).subject,'Ciencias');await runtime.resolve(key,'remote');assert.equal(JSON.parse(storage.getItem(key)).subject,'Lectura');const archive=Object.keys(storage).find(k=>k.includes('conflict-archive:'));assert.ok(archive);assert.equal(JSON.parse(rawGet.call(storage,archive)).local.subject,'Ciencias');runtime.erase();assert.equal(Object.keys(storage).some(k=>k.startsWith('cachaste-web:'+uid+':')),false);assert.equal(storage.getItem('cachaste-auth-v1'),'session-secret-qa');assert.equal(storage.getItem('cachaste-web:other:'+key),'another-student');
 }finally{runtime?.restore();for(const name of['Storage','document','addEventListener','removeEventListener'])saved[name]===undefined?delete globalThis[name]:globalThis[name]=saved[name];if(saved.navigator)Object.defineProperty(globalThis,'navigator',saved.navigator);else delete globalThis.navigator;}
});

test('an edit during an in-flight save is sent again automatically',async()=>{
 const saved={Storage:globalThis.Storage,document:globalThis.document,addEventListener:globalThis.addEventListener,removeEventListener:globalThis.removeEventListener,navigator:Object.getOwnPropertyDescriptor(globalThis,'navigator')};
 const storage=new LocalStorage(),events=new Map(),docEvents=new Map();
 globalThis.Storage=LocalStorage;globalThis.addEventListener=(name,fn)=>events.set(name,fn);globalThis.removeEventListener=(name,fn)=>events.delete(name);
 globalThis.document={hidden:false,addEventListener:(name,fn)=>docEvents.set(name,fn),removeEventListener:(name,fn)=>docEvents.delete(name)};
 Object.defineProperty(globalThis,'navigator',{value:{onLine:true},configurable:true});
 let release,started;const startedPromise=new Promise(resolve=>started=resolve),firstReply=new Promise(resolve=>release=resolve),writes=[];
 const fetcher=async(_url,opts)=>{
  const body=JSON.parse(opts.body);writes.push(body.payload.value);
  if(writes.length===1){started();await firstReply;}
  return Response.json({conflict:false,document:{key,value:body.payload.value,version:writes.length+1}});
 };
 let runtime;
 try{
  runtime=installProgressRuntime({bootstrap:{userId:uid,documents:[{key,value:{subject:'M1'},version:1}]},storage,fetcher});
  storage.setItem(key,JSON.stringify({subject:'M2'}));
  const flushing=runtime.flush();await startedPromise;
  storage.setItem(key,JSON.stringify({subject:'Ciencias'}));
  release();await flushing;assert.equal(runtime.pending(),1);
  await new Promise((resolve,reject)=>{const startedAt=Date.now();const check=()=>{if(writes.length===2)return resolve();if(Date.now()-startedAt>3500)return reject(Error('Newer edit was not retried'));setTimeout(check,40);};check();});
  assert.equal(writes[0].subject,'M2');assert.equal(writes[1].subject,'Ciencias');
  assert.equal(runtime.pending(),0);
 }finally{
  release?.();runtime?.restore();
  for(const name of['Storage','document','addEventListener','removeEventListener'])saved[name]===undefined?delete globalThis[name]:globalThis[name]=saved[name];
  if(saved.navigator)Object.defineProperty(globalThis,'navigator',saved.navigator);else delete globalThis.navigator;
 }
});

test('a temporary server error retries pending progress without navigation',async()=>{
 const saved={Storage:globalThis.Storage,document:globalThis.document,addEventListener:globalThis.addEventListener,removeEventListener:globalThis.removeEventListener,navigator:Object.getOwnPropertyDescriptor(globalThis,'navigator')};
 const storage=new LocalStorage(),events=new Map(),docEvents=new Map();let calls=0;
 globalThis.Storage=LocalStorage;globalThis.addEventListener=(name,fn)=>events.set(name,fn);globalThis.removeEventListener=(name)=>events.delete(name);
 globalThis.document={hidden:false,addEventListener:(name,fn)=>docEvents.set(name,fn),removeEventListener:(name)=>docEvents.delete(name)};
 Object.defineProperty(globalThis,'navigator',{value:{onLine:true},configurable:true});
 let runtime;
 try{
  runtime=installProgressRuntime({bootstrap:{userId:uid,documents:[{key,value:{subject:'M1'},version:1}]},storage,fetcher:async(_url,opts)=>{
   calls++;if(calls===1)return Response.json({error:'TEMPORARY'},{status:503});
   const p=JSON.parse(opts.body).payload;return Response.json({conflict:false,document:{key:p.key,value:p.value,version:2}});
  }});
  storage.setItem(key,JSON.stringify({subject:'M2'}));await runtime.flush();
  assert.equal(calls,1);assert.equal(runtime.pending(),1);
  await new Promise((resolve,reject)=>{const start=Date.now();const check=()=>{if(calls>=2)return resolve();if(Date.now()-start>7000)return reject(Error('Pending progress was never retried'));setTimeout(check,50);};check();});
  assert.equal(runtime.pending(),0);
 }finally{
  runtime?.restore();
  for(const name of['Storage','document','addEventListener','removeEventListener'])saved[name]===undefined?delete globalThis[name]:globalThis[name]=saved[name];
  if(saved.navigator)Object.defineProperty(globalThis,'navigator',saved.navigator);else delete globalThis.navigator;
 }
});

test('an expired session stops progress writes without discarding local answers',async()=>{
 const saved={Storage:globalThis.Storage,document:globalThis.document,addEventListener:globalThis.addEventListener,removeEventListener:globalThis.removeEventListener,navigator:Object.getOwnPropertyDescriptor(globalThis,'navigator')};
 const storage=new LocalStorage(),events=new Map(),docEvents=new Map(),statuses=[];let calls=0;
 globalThis.Storage=LocalStorage;globalThis.addEventListener=(name,fn)=>events.set(name,fn);globalThis.removeEventListener=(name)=>events.delete(name);
 globalThis.document={hidden:false,addEventListener:(name,fn)=>docEvents.set(name,fn),removeEventListener:(name)=>docEvents.delete(name)};
 Object.defineProperty(globalThis,'navigator',{value:{onLine:true},configurable:true});
 let runtime;
 try{
  runtime=installProgressRuntime({bootstrap:{userId:uid,documents:[{key,value:{subject:'M1'},version:1}]},storage,onStatus:s=>statuses.push(s),fetcher:async()=>{calls++;return Response.json({error:'AUTH_REQUIRED'},{status:401});}});
  storage.setItem(key,JSON.stringify({subject:'M2',answers:[1,2,3]}));
  await runtime.flush();assert.equal(calls,1);assert.equal(runtime.pending(),1);assert.equal(statuses.at(-1),'expired');
  await runtime.flush();assert.equal(calls,1);
  assert.deepEqual(JSON.parse(storage.getItem(key)).answers,[1,2,3]);
 }finally{
  runtime?.restore();
  for(const name of['Storage','document','addEventListener','removeEventListener'])saved[name]===undefined?delete globalThis[name]:globalThis[name]=saved[name];
  if(saved.navigator)Object.defineProperty(globalThis,'navigator',saved.navigator);else delete globalThis.navigator;
 }
});

test('server conflict matching submitted answer rebases a newer local answer',async()=>{
 const saved={Storage:globalThis.Storage,document:globalThis.document,addEventListener:globalThis.addEventListener,removeEventListener:globalThis.removeEventListener,navigator:Object.getOwnPropertyDescriptor(globalThis,'navigator')};
 const storage=new LocalStorage(),events=new Map(),docEvents=new Map();let started,release,calls=0;
 const waiting=new Promise(resolve=>started=resolve),reply=new Promise(resolve=>release=resolve);
 globalThis.Storage=LocalStorage;globalThis.addEventListener=(name,fn)=>events.set(name,fn);globalThis.removeEventListener=(name)=>events.delete(name);
 globalThis.document={hidden:false,addEventListener:(name,fn)=>docEvents.set(name,fn),removeEventListener:(name)=>docEvents.delete(name)};
 Object.defineProperty(globalThis,'navigator',{value:{onLine:true},configurable:true});
 let runtime;
 try{
  runtime=installProgressRuntime({bootstrap:{userId:uid,documents:[{key,value:{subject:'M1'},version:1}]},storage,fetcher:async(_url,opts)=>{
   calls++;const p=JSON.parse(opts.body).payload;
   if(calls===1){started();await reply;return Response.json({conflict:true,document:{key,value:p.value,version:2}});}
   assert.equal(p.baseVersion,2);return Response.json({conflict:false,document:{key,value:p.value,version:3}});
  }});
  storage.setItem(key,JSON.stringify({subject:'M2'}));
  const first=runtime.flush();await waiting;
  storage.setItem(key,JSON.stringify({subject:'Ciencias'}));
  release();await first;
  assert.equal(runtime.pending(),1);assert.equal(Object.keys(runtime.conflicts).length,0);
  await new Promise((resolve,reject)=>{const start=Date.now();const check=()=>{if(calls===2)return resolve();if(Date.now()-start>3500)return reject(Error('Rebased answer not synchronized'));setTimeout(check,40);};check();});
  assert.equal(runtime.pending(),0);assert.equal(JSON.parse(storage.getItem(key)).subject,'Ciencias');
 }finally{
  release?.();runtime?.restore();
  for(const name of['Storage','document','addEventListener','removeEventListener'])saved[name]===undefined?delete globalThis[name]:globalThis[name]=saved[name];
  if(saved.navigator)Object.defineProperty(globalThis,'navigator',saved.navigator);else delete globalThis.navigator;
 }
});
