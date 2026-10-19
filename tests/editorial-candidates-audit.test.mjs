import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {buildTransfers} from '../scripts/paes-transfer-2027.mjs';
import {historiaCandidates} from '../scripts/paes-transfer-candidates-historia-2027.mjs';
import {scienceCandidates} from '../scripts/paes-transfer-candidates-fisica-2027.mjs';
import {biologyCandidates} from '../scripts/paes-transfer-candidates-biologia-2027.mjs';
import {scienceExpansionCandidates} from '../scripts/paes-transfer-candidates-ciencias-expansion-2027.mjs';

test('Auditoría editorial conjunta: nueve candidatos independientes, identificables y sin modificar el banco comercial',()=>{
 const {items}=dailyCatalog();
 const rows=[...historiaCandidates,...scienceCandidates,...biologyCandidates,...scienceExpansionCandidates];
 assert.equal(rows.length,9);
 assert.equal(new Set(rows.map(q=>q.id)).size,9);
 assert.equal(items.length,788);
 const generated=buildTransfers(items,rows);
 for(const item of generated){
  const original=items.find(q=>q.key===item.sourceKey);
  assert.ok(original,'Falta caso base para '+item.key);
  assert.equal(item.concept,original.concept,'Cambio de habilidad accidental en '+item.key);
  assert.notEqual(item.question,original.question);
  assert.equal(item.options.length,4);
  assert.ok(item.errors===undefined);
  assert.ok(item.explanations.every(x=>x.length>30));
  assert.ok(item.sourceTrace?.reviewStatus?.includes('pendiente'),'No debe presentarse el candidato como aprobado: '+item.key);
  assert.ok(!items.some(q=>q.key===item.key));
 }
});
