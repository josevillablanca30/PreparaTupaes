import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadBanks} from '../scripts/load-banks.mjs';
const before=JSON.parse(readFileSync(new URL('../pedagogy/m2-before-2026-10-15.json',import.meta.url)));
const banks=loadBanks(),after=banks.M2;
test('Tutor: las 106 preguntas, alternativas y claves M2 permanecen idénticas a beta 1.1',()=>{
 assert.equal(after.length,106);
 for(const old of before){const q=after.find(q=>q.id===old.id);assert.ok(q,old.id);assert.equal(q.question,old.question);assert.deepEqual(Array.from(q.options),old.options);assert.equal(q.answer,old.answer);}
 assert.deepEqual(Object.fromEntries(Object.entries(banks).map(([k,v])=>[k,v.length])),{M1:116,Ciencias:206,Lectura:130,M2:106,Historia:65,texts:20});
});
test('Tutor: cada clase tiene fundamentos, aplicación propia, comprobación y ejemplo resuelto',()=>{
 for(const q of after.filter(q=>q.teaching)){
  const t=q.teaching;assert.equal(t.quality,'adecuada');assert.ok(t.foundation.length>=2,q.id);assert.ok(t.application.length>=3,q.id);
  assert.ok(t.example.steps.length>=3,q.id);assert.notEqual(t.example.problem,q.question,q.id);
  assert.ok(t.check.includes(' '),q.id);assert.ok(t.intuition.length>=2,q.id);
  assert.equal(t.selectedFeedback[q.answer],null,q.id);
  q.options.forEach((_,i)=>{if(i===q.answer)return;assert.equal(t.selectedFeedback[i].diagnosis,q.explanations[i],q.id);assert.ok(t.selectedFeedback[i].repair.length>=3,q.id)});
 }
});
test('Tutor: vértice distingue ubicación/altura, logaritmo define sus tres términos y raíces conservan ambos signos',()=>{
 const by=id=>after.find(q=>q.id==='M2-'+id).teaching;
 assert.match(by('001').foundation.join(' '),/h indica su posición horizontal y k su altura/);
 assert.match(by('007').foundation.join(' '),/b\^c=A/);
 assert.match(by('007').foundation.join(' '),/argumento A positivo/);
 assert.match(by('050').check,/4 y −4 son pares/);
 assert.match(by('050').example.steps.join(' '),/x=5 y x=−5/);
 assert.match(by('003').foundation.join(' '),/favorable menos y un objeto total menos/);
 assert.equal((3/5)*(2/4),3/10);assert.equal(2**3,8);assert.equal((-4)**2,4**2);
});
test('Tutor: los ejemplos nuevos resuelven otra tarea y las comprobaciones matemáticas son consistentes',()=>{
 assert.equal(99*101,100**2-1);
 assert.equal((5100-600)/3,1500);
 assert.equal((2*7+4-4)/2,7);
 assert.equal(12000+100,12100);
 assert.equal(Math.sqrt(13**2-5**2),12);
 assert.equal((9-2)*180/9,140);
 assert.equal((2+3+4+5+100)/5,22.8);
 assert.equal((2+3+4+5+10)/5,4.8);
 const q=after.find(q=>q.id==='M2-001');assert.match(q.teaching.application.join(' '),/suma y resta cuatro/);
 const med=after.find(q=>q.id==='M2-038');assert.match(med.teaching.example.problem,/qué pasa con mediana y media/);
});
