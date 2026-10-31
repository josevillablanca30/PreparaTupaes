import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {readinessAudit} from '../scripts/readiness-audit.mjs';
import {transferCasesBatch7 as cases} from '../scripts/paes-transfer-batch7-2027.mjs';

const {items}=dailyCatalog(),byKey=new Map(items.map(q=>[q.key,q]));
test('Lote 7: seis transferencias originales cierran brechas de Biología, Física y Química',()=>{
 assert.equal(cases.length,6);
 assert.deepEqual(cases.map(c=>c.id),Array.from({length:6},(_,i)=>`TR-SCI-${String(i+27).padStart(3,'0')}`));
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
  assert.ok(q.teaching.selectedFeedback.filter(Boolean).length>=3,c.id);
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

test('Lote 7: cálculos y principios de las seis claves se verifican por separado',()=>{
 const answer=id=>{const c=cases.find(x=>x.id===id);assert.ok(c,id);return c.options[c.answer]};
 assert.match(answer('TR-SCI-027'),/síntesis de proteínas/);
 assert.match(answer('TR-SCI-028'),/conformación/);
 assert.equal(answer('TR-SCI-029'),'32°');
 assert.equal(64/2,32);
 assert.equal(answer('TR-SCI-030'),'70 % y 80 %');
 assert.equal(420/600,0.7);
 assert.equal(400/500,0.8);
 assert.match(answer('TR-SCI-031'),/atracciones electrostáticas/i);
 assert.equal(answer('TR-SCI-032'),'CH₂O');
 assert.deepEqual([4,8,4].map(n=>n/4),[1,2,1]);
});
