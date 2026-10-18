import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {readinessAudit} from '../scripts/readiness-audit.mjs';
import {transferCasesBatch10 as cases} from '../scripts/paes-transfer-batch10-2027.mjs';

const {items}=dailyCatalog(),byKey=new Map(items.map(q=>[q.key,q]));
test('Lote 10: seis transferencias originales cierran brechas independientes de Ciencias',()=>{
 assert.equal(cases.length,6);
 assert.deepEqual(cases.map(c=>c.id),Array.from({length:6},(_,i)=>`TR-SCI-${String(i+45).padStart(3,'0')}`));
 assert.equal(new Set(cases.map(c=>c.base)).size,6);
 assert.equal(items.length,788);
 assert.equal(new Set(items.map(q=>q.key)).size,788);
 assert.equal(items.filter(q=>q.origin==='original-transfer-2027').length,157);
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
 assert.equal(gate.overall.questions,788);
 assert.equal(gate.overall.transfers,157);
 assert.equal(gate.overall.unverifiableConcepts,7);
 assert.equal(gate.subjects.Ciencias.transfers,87);
 assert.equal(gate.subjects.Ciencias.unverifiableConcepts,5);
 for(const c of cases)assert.ok(!gate.gaps.some(g=>g.subject==='Ciencias'&&g.concept===byKey.get(c.base).concept),c.id);
});

test('Lote 10: claves numéricas y biológicas se verifican aparte',()=>{
 const answer=id=>{const c=cases.find(x=>x.id===id);assert.ok(c,id);return c.options[c.answer]};
 assert.match(answer('TR-SCI-045'),/14 días/); assert.deepEqual([26-12,32-18],[14,14]);
 assert.equal(answer('TR-SCI-046'),'3 mol'); assert.equal((1+3)/(4+1+3),0.5);
 assert.equal(answer('TR-SCI-047'),'sp²');
 assert.match(answer('TR-SCI-048'),/ancestro común/);
 assert.equal(answer('TR-SCI-049'),'2 m');
 assert.equal(answer('TR-SCI-050'),'14 V'); assert.equal((8/0.4)*0.7,14);
});
