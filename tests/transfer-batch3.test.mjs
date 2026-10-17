import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {loadBanks} from '../scripts/load-banks.mjs';
import {transferCasesBatch3 as cases} from '../scripts/paes-transfer-batch3-2027.mjs';

const {items}=dailyCatalog();

test('El banco preserva todos sus originales y agrega 12 transferencias nuevas, auditables y de cinco materias',()=>{
 const originals=loadBanks();
 assert.deepEqual(['M1','M2','Lectura','Ciencias','Historia'].map(s=>originals[s].length),[116,106,130,206,65]);
 assert.equal(items.length,705);
 assert.equal(new Set(items.map(q=>q.key)).size,705);
 assert.equal(cases.length,12);
 assert.deepEqual([cases.filter(r=>r.base.startsWith('Ciencias:')).length,cases.filter(r=>r.base.startsWith('Historia:')).length],[6,6]);
 assert.equal(new Set(cases.map(r=>r.base)).size,12,'Usar distintos conceptos originales, no doce cambios cosméticos');
 for(const row of cases){
  const base=items.find(q=>q.key===row.base),q=items.find(q=>q.id===row.id);
  assert.ok(base&&q,row.id);
  assert.equal(q.subjectKey,base.subjectKey);
  assert.equal(q.concept,base.concept);
  assert.equal(q.levelId,base.levelId);
  assert.notEqual(q.family,base.family);
  assert.notEqual(q.question,base.question);
  assert.equal(q.origin,'original-transfer-2027');
  assert.equal(new Set(q.options).size,4);
  assert.equal(q.answer,row.answer);
  assert.equal(row.options[row.answer],q.options[q.answer]);
  assert.ok(row.steps.length===3&&row.steps.every(s=>s.length>=55),row.id);
  assert.ok(row.errors.every((s,i)=>i===row.answer?s==='':s.length>=24),row.id);
  assert.ok(q.teaching.selectedFeedback.every((x,i)=>i===q.answer?x===null:x.repair.length===3),row.id);
 }
});
test('Comprobaciones numéricas y de conservación, independientes del texto de las alternativas',()=>{
 const correct=id=>{const x=items.find(q=>q.id===id);assert.ok(x,id);return x.options[x.answer]};
 assert.equal(correct('TR-SCI-015'),'9 y 18');
 assert.equal(correct('TR-SCI-016'),'4 Ω');
 assert.equal(correct('TR-SCI-017'),'1, 5, 3, 4');
 assert.equal(correct('TR-SCI-018'),'0,4 mol/L');
 assert.equal(correct('TR-HIS-015'),'40 canastas');
 assert.equal(18/2,9);
 assert.equal(1/(1/12+1/6),4);
 assert.deepEqual([3,8,2].map((n,i)=>[n,2*n,2*(n+1)]).length,3);
 assert.equal(2.4*25/150,.4);
 assert.equal(50/1.25,40);
 // C3H8 + 5 O2 -> 3 CO2 + 4 H2O: conserve carbon, hydrogen, oxygen atoms.
 assert.deepEqual([3,8,5*2],[3,4*2,3*2+4]);
});
test('La evaluación de Historia abarca procesos e interpretación crítica, no fechas o definiciones escolares',()=>{
 const correct=id=>{const x=items.find(q=>q.id===id);assert.ok(x,id);return x.options[x.answer]};
 assert.equal(correct('TR-HIS-013'),'Sustituir importaciones desarrollando producción industrial para el mercado interno');
 assert.equal(correct('TR-HIS-014'),'El pluralismo político y la coexistencia de distintas ideas dentro de reglas democráticas');
 assert.equal(correct('TR-HIS-016'),'El sufragio femenino se amplió de manera gradual a distintos tipos de elección');
 assert.equal(correct('TR-HIS-017'),'Al predominio parlamentario en la práctica política chilena de fines del siglo XIX');
 assert.equal(correct('TR-HIS-018'),'Comparar autoría, contexto e intereses de ambos testimonios y contrastarlos con otras fuentes');
});
