import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
function load(file){const window={};vm.runInNewContext(readFileSync(new URL('../'+file,import.meta.url),'utf8'),{window});return window}
const sci=load('science-bank.js').SCIENCE_BANK;
const rd=load('reading-bank.js').READING_QUESTIONS;
const banned=/centrifugación del núcleo atómico|reparación de vehículos|color de los estantes|descomponedores crean energía desde la nada|cloroplastos.*sináptic|se vuelve cero siempre|se detienen todos los impulsos/i;
test('Auditoría final: claves, explicaciones y distractores completos en Ciencias y Lectura',()=>{
 for(const [subject,bank] of [['Ciencias',sci],['Lectura',rd]]){
  assert.ok(bank.length>=100,subject);
  const ids=new Set(),stems=new Set();
  for(const q of bank){
   assert.ok(!ids.has(q.id),q.id+' ID repetido');ids.add(q.id);
   assert.ok(!stems.has(q.question),q.id+' enunciado repetido');stems.add(q.question);
   assert.equal(q.options.length,4,q.id);assert.equal(new Set(q.options).size,4,q.id);
   assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,q.id);
   assert.equal(q.explanations.length,4,q.id);
   assert.ok(q.options.every(o=>o.trim().length>=1),q.id);
   assert.ok(q.explanations.every(x=>x.length>=25),q.id);
   for(const option of q.options)assert.ok(!banned.test(option),q.id+' distractor manifiestamente ajeno: '+option);
   assert.ok(q.steps.length>=2&&q.easy.length>=20,q.id);
  }
 }
});
test('Auditoría final: ítems científicos distribuidos por habilidad y nivel',()=>{
 const skills=new Set(sci.map(q=>q.skill));
 assert.ok(skills.size>=5);
 const modules=new Set(sci.map(q=>q.module));
 assert.equal(modules.size,3);
 for(const sub of ['Biología','Física','Química'])assert.ok(sci.filter(q=>q.subject===sub).length>=40,sub);
});
test('Auditoría final: lectura evalúa localizar, interpretar y evaluar con variedad textual',()=>{
 const counts=Object.fromEntries(['Localizar','Interpretar','Evaluar'].map(s=>[s,rd.filter(q=>q.skill===s).length]));
 assert.ok(Object.values(counts).every(n=>n>=20),JSON.stringify(counts));
 const texts=load('reading-bank.js').READING_PASSAGES;
 assert.ok(new Set(texts.map(x=>x.type)).size>=4);
});
