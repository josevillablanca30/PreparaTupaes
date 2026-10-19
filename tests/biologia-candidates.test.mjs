import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {buildTransfers} from '../scripts/paes-transfer-2027.mjs';
import {biologyCandidates} from '../scripts/paes-transfer-candidates-biologia-2027.mjs';

test('Biología: ventilación y memoria inmunológica cuentan con transferencias independientes en revisión',()=>{
 const {items}=dailyCatalog();
 assert.equal(items.length,788,'Los candidatos no modifican la versión estable');
 const generated=buildTransfers(items,biologyCandidates);
 assert.deepEqual(generated.map(q=>q.id),['TR-SCI-090','TR-SCI-091']);
 for(const q of generated){
  const base=items.find(x=>x.key===q.sourceKey);
  assert.ok(base,'El ejercicio base debe existir');
  assert.equal(q.concept,base.concept,'La transferencia evalúa la misma habilidad');
  assert.equal(q.subjectKey,'Ciencias');
  assert.equal(q.options.length,4);
  assert.equal(q.explanations.length,4);
  assert.ok(q.steps.every(x=>x.length>=55));
  assert.ok(!items.some(x=>x.key===q.key));
  assert.equal(q.examEligible,base.examEligible!==false&&!base.supplementary);
 }
});
