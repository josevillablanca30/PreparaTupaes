import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {readinessAudit} from '../scripts/readiness-audit.mjs';
import {transferCasesBatch4 as additions} from '../scripts/paes-transfer-batch4-2027.mjs';

const {items}=dailyCatalog();
const byKey=new Map(items.map(q=>[q.key,q]));
const sourceDomains=['acceso.mineduc.cl'];
test('12 ítems nuevos verificables, distintos de los originales y trazados a temarios DEMRE y documentos del Drive',()=>{
 assert.equal(additions.length,12);
 assert.equal(items.length,706);
 assert.equal(items.filter(x=>x.origin==='original-transfer-2027').length,83);
 assert.equal(new Set(additions.map(x=>x.id)).size,12);
 assert.equal(new Set(additions.map(x=>x.base)).size,12);
 assert.deepEqual(['M1','Ciencias','Historia'].map(s=>additions.filter(x=>x.base.startsWith(s+':')).length),[4,4,4]);
 for(const row of additions){
  const base=byKey.get(row.base),q=byKey.get(row.base.split(':')[0]+':'+row.id);
  assert.ok(base&&q,'Registro perdido: '+row.id);
  assert.equal(q.concept,base.concept,row.id);
  assert.equal(q.axis,base.axis,row.id);
  assert.equal(q.levelId,base.levelId,row.id);
  assert.equal(q.family,row.base.split(':')[0]+':'+row.id);
  assert.notEqual(q.question,base.question);
  assert.notEqual(q.options[q.answer],undefined);
  assert.equal(q.answer,row.answer);
  assert.deepEqual(q.options,row.options);
  assert.equal(q.origin,'original-transfer-2027');
  assert.equal(q.reviewStatus,'editorial-structure-validated');
  assert.equal(q.sourceTrace.officialTemario,row.sourceTrace.officialTemario);
  assert.ok(sourceDomains.some(x=>row.sourceTrace.officialTemario.includes(x)));
  assert.ok(row.sourceTrace.officialEje.length>=16);
  assert.ok(row.sourceTrace.driveFileId.length>=20);
  assert.ok(row.sourceTrace.driveMaterial.length>=12);
  assert.ok(row.sourceTrace.alignmentRationale.length>=35);
  assert.equal(row.options.length,4);
  assert.equal(new Set(row.options).size,4);
  assert.equal(row.steps.length,3);
  assert.ok(row.steps.every(x=>x.length>=55));
  assert.ok(row.errors.every((x,i)=>i===row.answer?x==='':x.length>=24));
  assert.ok(q.explanations.every(x=>x.length>=35));
  assert.equal(q.teaching.selectedFeedback.filter(Boolean).length,3);
  assert.ok(q.teaching.selectedFeedback.every((x,i)=>i===row.answer?x===null:x.repair.length===3));
 }
});
test('Claves matemáticas correctas y unidades sin distractores equivalentes',()=>{
 const answer=id=>additions.find(q=>q.id===id).options[additions.find(q=>q.id===id).answer];
 assert.equal(answer('TR-M1-013'),'14 m');
 assert.equal(answer('TR-M1-014'),'6√2 m');
 assert.equal(answer('TR-M1-015'),'(x − 7) m');
 assert.equal(answer('TR-M1-016'),'55 m²');
 assert.equal(Math.sqrt(196),14);
 assert.ok(Math.abs((6*Math.SQRT2)**2-72)<1e-10);
 for(const x of [8,9,12,17])assert.equal((x+7)*(x-7),x*x-49);
 assert.equal((14+8)*5/2,55);
 assert.equal(answer('TR-SCI-019'),'17 protones y 17 electrones');
 assert.equal(answer('TR-SCI-020'),'5,0 × 10¹⁴ Hz');
 assert.equal(answer('TR-SCI-022'),'3 A');
 assert.equal(35-17,18);
 assert.equal(24/8,3);
 assert.equal(answer('TR-HIS-020'),'La matrícula aumentó 50 % entre ambos años, sin demostrar por sí sola cambios de calidad');
 assert.equal((1800-1200)/1200,0.5);
});
test('Las interpretaciones científicas e históricas no convierten evidencia limitada en certeza universal',()=>{
 const get=id=>additions.find(x=>x.id===id);
 assert.match(get('TR-SCI-021').options[get('TR-SCI-021').answer],/conservar el mismo bloque/);
 assert.match(get('TR-HIS-019').options[get('TR-HIS-019').answer],/confrontaciones indirectas/);
 assert.match(get('TR-HIS-021').options[get('TR-HIS-021').answer],/articulación/);
 assert.match(get('TR-HIS-022').options[get('TR-HIS-022').answer],/libertad de informar/i);
 for(const row of additions)assert.ok(!row.question.includes('¿Qué es una revolución?'),row.id);
});
test('La incorporación reduce las brechas, sin fingir cobertura completa del temario',()=>{
 const report=readinessAudit(items);
 assert.equal(report.overall.originals,623);
 assert.equal(report.overall.transfers,83);
 assert.equal(report.overall.concepts,287);
 assert.ok(report.overall.unverifiableConcepts<100);
 for(const row of additions)assert.ok(!report.gaps.some(g=>g.subject===row.base.split(':')[0]&&g.concept===byKey.get(row.base).concept),row.id);
});
