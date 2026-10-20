import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {buildTransfers} from '../scripts/paes-transfer-2027.mjs';
import {scienceCandidates} from '../scripts/paes-transfer-candidates-fisica-2027.mjs';

test('Física: dos transferencias independientes mantienen distractores trazables y banco estable',()=>{
 const {items}=dailyCatalog({includeReviewed:false});
 assert.equal(items.length,788);
 assert.deepEqual(scienceCandidates.map(row=>row.id),['TR-SCI-088','TR-SCI-089']);
 const next=buildTransfers(items,scienceCandidates);
 for(const q of next){
  const base=items.find(row=>row.key===q.sourceKey);
  assert.ok(base,'Existe un ítem base real para '+q.key);
  assert.equal(q.subjectKey,'Ciencias');
  assert.equal(q.concept,base.concept);
  assert.equal(q.options.length,4);
  assert.equal(q.explanations.length,4);
  assert.ok(q.steps.every(step=>step.length>=55));
  assert.ok(!items.some(row=>row.key===q.key));
  assert.equal(q.examEligible,base.examEligible!==false&&!base.supplementary);
 }
});
