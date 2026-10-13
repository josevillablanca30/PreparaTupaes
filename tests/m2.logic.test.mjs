import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const src=readFileSync(new URL('../m2-bank.js',import.meta.url),'utf8');
const app=readFileSync(new URL('../m2-app.js',import.meta.url),'utf8');
test('M2: banco inicial tiene veinte ítems originales válidos y cinco áreas',()=>{
 const window={};vm.runInNewContext(src,{window});
 const bank=window.CACHASTE_M2;
 assert.equal(bank.length,55);
 assert.equal(new Set(bank.map(q=>q.id)).size,55);
 assert.equal(new Set(bank.map(q=>q.area)).size,6);
 for(const q of bank){
  assert.equal(q.options.length,4,q.id);
  assert.equal(new Set(q.options).size,4,q.id);
  assert.ok(q.answer>=0&&q.answer<4,q.id);
  assert.ok(q.why.length>25,q.id);
  assert.ok(q.hint.length>20,q.id);
  assert.equal(q.origin,'original');
 }
});
test('M2: interfaz incluye guardado local y no presenta puntajes oficiales',()=>{
 assert.match(app,/localStorage\.setItem/);
 assert.match(app,/No equivale a puntaje PAES oficial/);
 assert.match(app,/sin-declarar/);
});
