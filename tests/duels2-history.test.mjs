import test from'node:test';import assert from'node:assert/strict';import{mergeDuelHistory}from'../duels2/history.mjs';
test('mixed history paginates once across engines, preserves microseconds and combines real summaries',()=>{
 const row=n=>({id:String(n).padStart(36,'0'),createdAt:'2026-11-10T12:00:00.'+String(n).padStart(6,'0')+'Z'});
 const legacy={duels:Array.from({length:20},(_,i)=>row(2*i)),summary:{played:20,wins:10,losses:5,draws:5},next:null},modern={duels:Array.from({length:20},(_,i)=>row(2*i+1)),summary:{played:20,wins:8,losses:9,draws:3},next:null};
 const first=mergeDuelHistory(legacy,modern);assert.equal(first.duels.length,20);assert.equal(first.duels[0].id,row(39).id);assert.equal(first.duels.at(-1).id,row(20).id);assert.deepEqual(first.summary,{played:40,wins:18,losses:14,draws:8});assert.deepEqual(first.next,{createdAt:row(20).createdAt,id:row(20).id});
 const second=mergeDuelHistory({...legacy,duels:legacy.duels.filter(d=>d.id<row(20).id)},{...modern,duels:modern.duels.filter(d=>d.id<row(20).id)});assert.equal(second.duels.length,20);assert.equal(second.next,null);assert.equal(new Set([...first.duels,...second.duels].map(d=>d.id)).size,40);
});
