import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {auditDidacticCoverage} from '../scripts/didactic-coverage-audit.mjs';

test('Los repasos de las cinco materias reciben explicación alternativa sin alterar evaluación',()=>{
 const {items}=dailyCatalog();
 for(const key of ['Ciencias:TR-SCI-007','M2:M2-020','Historia:HIS-030']){
  const q=items.find(q=>q.key===key);assert.ok(q,key);
  for(const intuition of q.teaching.intuition)assert.ok(q.easy.includes(intuition),key);
 }
 const report=auditDidacticCoverage(items);
 assert.equal(report.totalQuestions,802);assert.equal(report.totalObjectives,287);
 for(const subject of Object.values(report.subjects)){
  assert.equal(subject.checks.reviewExplanation,subject.questions);
  assert.equal(subject.checks.reviewDoesNotRepeatSteps,subject.questions);
 }
});
test('La cobertura estructural no se presenta como aprobación editorial y detecta ejemplos repetidos',()=>{
 const q=structuredClone(dailyCatalog().items[0]);q.teaching.example.problem=q.question;
 q.teaching.selectedFeedback[(q.answer+1)%q.options.length]=null;
 const report=auditDidacticCoverage([q]);
 assert.equal(report.releaseReady,false);
 assert.equal(report.objectives[0].editorialApproval,'pending-individual-review');
 assert.ok(report.objectives[0].structuralGaps.some(x=>x.check==='differentWorkedExample'));
 assert.ok(report.objectives[0].structuralGaps.some(x=>x.check==='optionFeedback'));
});
