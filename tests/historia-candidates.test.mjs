import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {buildTransfers} from '../scripts/paes-transfer-2027.mjs';
import {historiaCandidates} from '../scripts/paes-transfer-candidates-historia-2027.mjs';

test('Candidatos de Historia: dos preguntas originales completas, sin alterar el banco aprobado',()=>{
 const {items}=dailyCatalog();
 assert.equal(items.length,788,'Los ejercicios en evaluación editorial no deben modificar la versión estable');
 assert.equal(historiaCandidates.length,2);
 assert.deepEqual(historiaCandidates.map(q=>q.id),['TR-HIS-067','TR-HIS-068']);
 const generated=buildTransfers(items,historiaCandidates);
 for(const q of generated){
  const base=items.find(row=>row.key===q.sourceKey);
  assert.ok(base,'Cada transferencia requiere un caso base verificado');
  assert.equal(q.subjectKey,'Historia');
  assert.equal(q.concept,base.concept);
  assert.equal(q.options.length,4);
  assert.equal(q.explanations.length,4);
  assert.ok(q.steps.every(step=>step.length>55));
  assert.ok(q.transferGroup!==base.transferGroup);
  assert.ok(!items.some(row=>row.key===q.key),'Ningún candidato debe estar ya publicado');
  assert.equal(q.examEligible,base.examEligible!==false&&!base.supplementary,'No transformar contenidos complementarios en preguntas PAES');
 }
});
