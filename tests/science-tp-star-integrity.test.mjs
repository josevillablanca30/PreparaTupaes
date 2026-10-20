import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {buildTransfers} from '../scripts/paes-transfer-2027.mjs';
import {biologyCandidates} from '../scripts/paes-transfer-candidates-biologia-2027.mjs';
import {scienceRemainingCandidates} from '../scripts/paes-transfer-candidates-ciencias-final-2027.mjs';

test('La evidencia de una mención no se acredita automáticamente en Ciencias TP',()=>{
 const {items}=dailyCatalog({includeReviewed:false});
 const candidates=buildTransfers(items.filter(q=>!/^TR-SCI-09[0-9]$/.test(q.id)),[...biologyCandidates,...scienceRemainingCandidates]);
 const tp=rows=>rows.filter(q=>q.subjectKey==='Ciencias'&&(q.module==='MC'||q.module==='MTP'));
 const eligible=tp([...items,...candidates]);
 for(const concept of ['Ventilación y demanda metabólica','Defensas innatas y memoria inmune','Tono e intensidad del sonido']){
  const matches=eligible.filter(q=>q.concept===concept);
  const exam=matches.filter(q=>!q.supplementary&&q.examEligible!==false);
  const families=new Set((exam.length?exam:matches).map(q=>q.transferGroup||q.family||q.key));
  assert.equal(families.size,1,'No certificar cuatro estrellas en TP con preguntas exclusivas de otra mención: '+concept);
 }
 assert.ok(candidates.length>=4);
});
