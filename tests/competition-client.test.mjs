import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CompetitionClient} from '../competition-client.mjs';

test('A pending answer keeps its original receipt and choice even after a refreshed server position',async()=>{
 const values=new Map(),storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)},client=new CompetitionClient({},storage);
 client.user={id:'isolated-account'};
 const receipts=[];let lost=true;
 client.call=async(_op,payload)=>{receipts.push(structuredClone(payload));if(lost){lost=false;throw new Error('Network response lost after server commit');}return{id:'attempt',position:1,status:'active'};};
 await assert.rejects(client.answer({id:'attempt',position:0},2));
 await client.answer({id:'attempt',position:1},0);
 assert.deepEqual(receipts[1],receipts[0]);
 assert.equal(receipts[1].position,0);assert.equal(receipts[1].choice,2);assert.equal(client.pending(),null);
 await client.answer({id:'attempt',position:1},0);
 assert.equal(receipts[2].position,1);assert.equal(receipts[2].choice,0);assert.notEqual(receipts[2].requestId,receipts[0].requestId);
});

test('A disconnected signed-out client has no pending private answer',()=>{
 const client=new CompetitionClient({},{getItem:()=>{throw new Error('Must not read another identity');}});
 assert.equal(client.pending(),null);
});
