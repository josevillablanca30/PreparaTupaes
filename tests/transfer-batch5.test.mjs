import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {readinessAudit} from '../scripts/readiness-audit.mjs';
import {transferCasesBatch5 as cases} from '../scripts/paes-transfer-batch5-2027.mjs';

const {items}=dailyCatalog(),byKey=new Map(items.map(q=>[q.key,q]));
test('Lote 5: doce casos originales, referenciados a DEMRE y a archivos reales de la biblioteca',()=>{
 assert.equal(cases.length,12);
 assert.equal(items.length,706);
 assert.equal(new Set(items.map(q=>q.key)).size,706);
 assert.equal(items.filter(x=>x.origin==='original-transfer-2027').length,83);
 assert.deepEqual(['M1','Ciencias','Historia'].map(s=>cases.filter(c=>c.base.startsWith(s+':')).length),[4,4,4]);
 assert.equal(new Set(cases.map(x=>x.base)).size,12);
 for(const c of cases){
  const base=byKey.get(c.base),newQ=byKey.get(c.base.split(':')[0]+':'+c.id);
  assert.ok(base&&newQ,c.id);
  assert.equal(newQ.concept,base.concept,c.id);
  assert.equal(newQ.levelId,base.levelId,c.id);
  assert.notEqual(base.question,newQ.question,c.id);
  assert.notEqual(base.family,newQ.family,c.id);
  assert.equal(newQ.origin,'original-transfer-2027');
  assert.equal(newQ.reviewStatus,'editorial-structure-validated');
  assert.equal(newQ.question,c.question);
  assert.equal(newQ.answer,c.answer);
  assert.deepEqual(newQ.options,c.options);
  assert.equal(new Set(c.options).size,4);
  assert.equal(c.steps.length,3);
  assert.ok(c.steps.every(s=>s.length>=55),c.id);
  assert.ok(c.errors.every((s,i)=>i===c.answer?s==='':s.length>=24),c.id);
  assert.equal(newQ.teaching.selectedFeedback.filter(Boolean).length,3);
  assert.ok(newQ.teaching.selectedFeedback.every((x,i)=>i===c.answer?x===null:x.repair.length===3),c.id);
  assert.ok(c.sourceTrace.officialTemario.includes('acceso.mineduc.cl'),c.id);
  assert.ok(c.sourceTrace.officialEje.length>=16,c.id);
  assert.match(c.sourceTrace.driveFileId,/^[A-Za-z0-9_-]{20,}$/);
  assert.ok(c.sourceTrace.driveMaterial.length>=18,c.id);
  assert.ok(c.sourceTrace.alignmentRationale.length>=35,c.id);
  assert.ok(!/pregunta oficial|copiada del DEMRE/i.test(c.sourceTrace.sourceUse),c.id);
 }
});
test('Claves con verificación matemática independiente de la explicación textual',()=>{
 const answer=id=>{const r=cases.find(x=>x.id===id);assert.ok(r,id);return r.options[r.answer]};
 assert.equal(answer('TR-M1-017'),'3a + 7b');
 assert.equal(answer('TR-M1-018'),'29');
 assert.equal(answer('TR-M1-019'),'84 m²');
 assert.equal(answer('TR-M1-020'),'6 %');
 for(const [a,b]of [[3,2],[-2,3],[0,-3]])assert.equal((5*a+3*b)-(2*a-4*b),3*a+7*b);
 assert.equal(2*(-2)**2-3*(-2)*3+3,29);
 assert.equal(12*7,84);
 assert.ok(Math.abs(.3*.2-.06)<1e-12);
 assert.equal(answer('TR-SCI-023'),'48 N');
 assert.equal(answer('TR-SCI-024'),'3 m/s²');
 assert.equal(answer('TR-SCI-025'),'A: 6 %; B: 9 %, por lo que B es mayor');
 assert.equal(answer('TR-SCI-026'),'3 g/cm³');
 assert.equal(12*4,48);
 assert.equal((17-5)/4,3);
 assert.equal(12/200*100,6);
 assert.equal(9/100*100,9);
 assert.equal(90/30,3);
});
test('Historia distingue inferencias sociales, participación, justicia y movimiento de demanda',()=>{
 const answer=id=>{const r=cases.find(x=>x.id===id);assert.ok(r);return r.options[r.answer]};
 assert.match(answer('TR-HIS-023'),/Reforma agraria/);
 assert.match(answer('TR-HIS-024'),/participación ciudadana/);
 assert.match(answer('TR-HIS-025'),/debido proceso/);
 assert.match(answer('TR-HIS-026'),/movimiento a lo largo/);
 for(const c of cases.filter(x=>x.base.startsWith('Historia:')))assert.ok(!/siempre demuestra|sin ninguna duda|es inevitable/i.test(c.options[c.answer]));
});
test('La puerta de liberación registra nuevas familias sin asumir certificación didáctica',()=>{
 const gate=readinessAudit(items);
 assert.equal(gate.overall.originals,623);
 assert.equal(gate.overall.transfers,83);
 assert.equal(gate.overall.concepts,287);
 assert.ok(gate.overall.unverifiableConcepts<=77,'Ningún nuevo caso debe empeorar cobertura');
 for(const c of cases){
  const base=byKey.get(c.base);
  assert.ok(!gate.gaps.some(g=>g.subject===base.subjectKey&&g.concept===base.concept),c.id);
 }
});
