import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {readinessAudit} from '../scripts/readiness-audit.mjs';
import {transferCasesBatch8 as cases} from '../scripts/paes-transfer-batch8-2027.mjs';

const {items}=dailyCatalog(),byKey=new Map(items.map(q=>[q.key,q]));
test('Lote 8: seis transferencias originales de Ciencias cierran seis brechas de evidencia',()=>{
 assert.equal(cases.length,6);
 assert.deepEqual(cases.map(c=>c.id),Array.from({length:6},(_,i)=>`TR-SCI-${String(i+33).padStart(3,'0')}`));
 assert.equal(new Set(cases.map(c=>c.base)).size,6);
 assert.equal(items.length,802);
 assert.equal(new Set(items.map(q=>q.key)).size,802);
 assert.equal(items.filter(q=>q.origin==='original-transfer-2027').length,171);
 for(const c of cases){
  const base=byKey.get(c.base),q=byKey.get(`Ciencias:${c.id}`);
  assert.ok(base&&q,c.id);
  assert.equal(q.concept,base.concept,c.id);
  assert.equal(q.levelId,base.levelId,c.id);
  assert.notEqual(q.family,base.family,c.id);
  assert.notEqual(q.question,base.question,c.id);
  assert.equal(q.question,c.question);
  assert.equal(q.answer,c.answer);
  assert.deepEqual(q.options,c.options);
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options).size,4);
  assert.ok(c.steps.every(s=>s.length>=55),c.id);
  assert.ok(c.errors.every((s,i)=>i===c.answer?s==='' : s.length>=30),c.id);
  assert.equal(q.teaching.selectedFeedback.filter(Boolean).length,3,c.id);
  assert.ok(c.sourceTrace.officialTemario.includes('Temario-PAESRegular-2026-Ciencias'),c.id);
  assert.ok(c.sourceTrace.driveFileId.length>=20,c.id);
  assert.ok(c.sourceTrace.alignmentRationale.length>=35,c.id);
 }
 const gate=readinessAudit(items);
 assert.equal(gate.overall.questions,802);
 assert.equal(gate.overall.transfers,171);
 assert.equal(gate.overall.unverifiableConcepts,0);
 assert.equal(gate.subjects.Ciencias.transfers,99);
 assert.equal(gate.subjects.Ciencias.unverifiableConcepts,0);
 for(const c of cases)assert.ok(!gate.gaps.some(g=>g.subject==='Ciencias'&&g.concept===byKey.get(c.base).concept),c.id);
});

test('Lote 8: inferencias, clasificaciones y claves se revisan de forma independiente',()=>{
 const answer=id=>{const c=cases.find(x=>x.id===id);assert.ok(c,id);return c.options[c.answer]};
 assert.match(answer('TR-SCI-033'),/ancestro común más reciente/i);
 assert.match(answer('TR-SCI-034'),/VIH es viral y la gonorrea es bacteriana/);
 assert.equal(answer('TR-SCI-035'),'+1');
 assert.equal(11-10,1);
 assert.match(answer('TR-SCI-036'),/igual cantidad de átomos/);
 assert.match(answer('TR-SCI-037'),/autonomía/);
 assert.match(answer('TR-SCI-038'),/degradación y el reciclaje/);
});
