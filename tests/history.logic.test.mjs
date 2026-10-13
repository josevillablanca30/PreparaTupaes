import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const src=readFileSync(new URL('../history-bank.js',import.meta.url),'utf8');
const app=readFileSync(new URL('../history-app.js',import.meta.url),'utf8');
test('Historia: banco inicial con veinte preguntas originales, cuatro opciones y explicaciones',()=>{
 const window={};vm.runInNewContext(src,{window});const bank=window.CACHASTE_HISTORIA;
 assert.equal(bank.length,65);assert.equal(new Set(bank.map(q=>q.id)).size,65);
 for(const q of bank){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.why.length>25);assert.ok(q.hint.length>20);assert.equal(q.origin,'original')}
});
test('Historia: sesión guardada independiente de otras materias',()=>{
 assert.match(app,/cachaste-history-v1/);assert.match(app,/localStorage\.setItem/);
 assert.match(app,/No equivale a puntaje PAES oficial/);
});