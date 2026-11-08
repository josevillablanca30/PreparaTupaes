import test from 'node:test';
import assert from 'node:assert/strict';
import {createPlayHandler} from '../../supabase/functions/_shared/play-handler.mjs';
function fixture(checkedAt){
 const calls=[];
 const values={CACHASTE_PLAY_ENABLED:'true',GOOGLE_PLAY_SERVICE_ACCOUNT:'{}',PLAY_RECEIPT_ENCRYPTION_KEY:Buffer.alloc(32,1).toString('base64'),SUPABASE_URL:'https://qa.example',SUPABASE_ANON_KEY:'public-test',SUPABASE_SERVICE_ROLE_KEY:'service-test'};
 const createClient=(_url,key)=>key==='service-test'?{rpc:async(_name,{operation})=>{calls.push(operation);return {data:operation==='receipts'?[{checked_at:checkedAt,token_ciphertext:'invalid',token_iv:'invalid'}]:{}};}}:{auth:{getUser:async()=>({data:{user:{id:'10000000-0000-4000-8000-000000000001'}}})},rpc:async()=>({data:{premium:false}})};
 const handler=createPlayHandler({env:key=>values[key],createClient,now:()=>Date.UTC(2026,10,8)});
 const request=new Request('https://qa.example/play',{method:'POST',headers:{authorization:'Bearer qa-token','content-type':'application/json'},body:JSON.stringify({action:'refresh'})});
 return {calls,handler,request};
}
test('Play refresh rechecks receipts with missing or invalid checked_at',async()=>{
 for(const checkedAt of [null,undefined,'not-a-date']){
  const h=fixture(checkedAt);const response=await h.handler(h.request);
  assert.equal(response.status,503);
  assert.ok(h.calls.includes('rate'),'stale receipt must enter verification flow');
 }
});
test('Play refresh avoids rate quota for a recently checked receipt',async()=>{
 const h=fixture(new Date(Date.UTC(2026,10,8)).toISOString());const response=await h.handler(h.request);
 assert.equal(response.status,200);assert.deepEqual(await response.json(),{premium:false});assert.ok(!h.calls.includes('rate'));
});
