import test from'node:test';
import assert from'node:assert/strict';
import{installProgressRuntime}from'../client/progress-runtime.mjs';

const key='cachaste-daily-v1',userId='student-a';
function environment(t,fetcher){
 const names=['Storage','localStorage','document','navigator','addEventListener','removeEventListener'];
 const descriptors=new Map(names.map(name=>[name,Object.getOwnPropertyDescriptor(globalThis,name)]));
 class Storage{
  getItem(key){return Object.hasOwn(this,key)?this[key]:null;}
  setItem(key,value){Object.defineProperty(this,key,{value:String(value),writable:true,enumerable:true,configurable:true});}
  removeItem(key){delete this[key];}
 }
 const storage=new Storage(),events=new EventTarget(),document=new EventTarget();document.hidden=false;
 const values={Storage,localStorage:storage,document,navigator:{onLine:true},addEventListener:events.addEventListener.bind(events),removeEventListener:events.removeEventListener.bind(events)};
 for(const[name,value]of Object.entries(values))Object.defineProperty(globalThis,name,{value,configurable:true,writable:true});
 const runtimes=[];
 t.after(()=>{for(const runtime of runtimes.reverse())runtime.restore();for(const[name,descriptor]of descriptors)descriptor?Object.defineProperty(globalThis,name,descriptor):delete globalThis[name];});
 return{storage,events,document,open(){const runtime=installProgressRuntime({bootstrap:{userId,documents:[]},storage,fetcher});runtimes.push(runtime);return runtime;}};
}
const saved=body=>Response.json({document:{key:body.payload.key,value:body.payload.value,version:body.payload.baseVersion+1}});

test('navigation preserves the pending lesson and the next document drains it for the same account',async t=>{
 const calls=[],env=environment(t,async(_,init)=>{const body=JSON.parse(init.body);calls.push(body);return saved(body);});
 const first=env.open();env.storage.setItem(key,JSON.stringify({session:{id:'lesson-1',index:4}}));
 env.events.dispatchEvent(new Event('pagehide'));await first.flush();assert.equal(calls.length,0);assert.equal(first.pending(),1);first.restore();
 const next=env.open();assert.deepEqual(JSON.parse(env.storage.getItem(key)),{session:{id:'lesson-1',index:4}});await next.flush();
 assert.equal(next.pending(),0);assert.deepEqual(calls[0].payload.value,{session:{id:'lesson-1',index:4}});
});

test('an edit made during a network write stays pending without losing its new answer',async t=>{
 let release;const calls=[],env=environment(t,async(_,init)=>{const body=JSON.parse(init.body);calls.push(body);if(calls.length===1)await new Promise(resolve=>release=resolve);return saved(body);});
 const runtime=env.open();env.storage.setItem(key,JSON.stringify({session:{index:1}}));const first=runtime.flush();
 env.storage.setItem(key,JSON.stringify({session:{index:2}}));release();await first;assert.equal(runtime.pending(),1);
 await runtime.flush();assert.equal(runtime.pending(),0);assert.equal(calls[1].payload.baseVersion,1);assert.equal(calls[1].payload.value.session.index,2);
});

test('small writes survive navigation; large progress does not exceed the browser keepalive budget',async t=>{
 const requests=[],env=environment(t,async(_,init)=>{requests.push(init);return saved(JSON.parse(init.body));}),runtime=env.open();
 env.storage.setItem(key,JSON.stringify({session:{index:3}}));await runtime.flush();assert.equal(requests[0].keepalive,true);
 env.storage.setItem(key,JSON.stringify({notes:'x'.repeat(65000)}));await runtime.flush();assert.equal(requests[1].keepalive,false);assert.equal(runtime.pending(),0);
});

test('hiding a page does not start unload requests and returning resumes its durable queue',async t=>{
 let count=0;const env=environment(t,async(_,init)=>{count++;return saved(JSON.parse(init.body));}),runtime=env.open();
 env.storage.setItem(key,JSON.stringify({session:{index:2}}));env.document.hidden=true;env.document.dispatchEvent(new Event('visibilitychange'));assert.equal(count,0);
 env.document.hidden=false;env.document.dispatchEvent(new Event('visibilitychange'));await new Promise(resolve=>setImmediate(resolve));
 assert.equal(count,1);assert.equal(runtime.pending(),0);
});

test('failed writes survive a back-forward navigation and retry without duplicating their base version',async t=>{
 const calls=[],env=environment(t,async(_,init)=>{const body=JSON.parse(init.body);calls.push(body);if(calls.length===1)throw new TypeError('Network unavailable');return saved(body);}),runtime=env.open();
 env.storage.setItem(key,JSON.stringify({attempts:[{eventId:'answer-1'}]}));await runtime.flush();assert.equal(runtime.pending(),1);
 env.events.dispatchEvent(new Event('pagehide'));env.events.dispatchEvent(new Event('pageshow'));await new Promise(resolve=>setImmediate(resolve));
 assert.equal(runtime.pending(),0);assert.deepEqual(calls[0],calls[1]);
});
