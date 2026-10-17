import test from 'node:test';
import assert from 'node:assert/strict';
import {loadBanks} from '../scripts/load-banks.mjs';
import {hasCompleteReasoningSequence} from '../scripts/reasoning-quality.mjs';

const banks=loadBanks();
test('keeps concise prompts when the complete science explanation develops the answer',()=>{
 const q=banks.Ciencias.find(item=>item.id==='SCI-001');
 assert.ok(q);
 assert.ok(q.steps.some(step=>step.length<45));
 assert.equal(hasCompleteReasoningSequence(q.steps),true);
});
test('keeps concise evidence cues when the complete reading explanation supports its answer',()=>{
 const q=banks.Lectura.find(item=>item.id==='LEC-097');
 assert.ok(q);
 assert.ok(q.steps.some(step=>step.length<45));
 assert.equal(hasCompleteReasoningSequence(q.steps),true);
});
test('flags an incomplete solution even when one paragraph is long',()=>{
 assert.equal(hasCompleteReasoningSequence([
  'La respuesta correcta corresponde a la mitocondria porque produce ATP mediante la respiración celular aerobia.',
  'La contracción usa energía.'
 ]),false);
});
