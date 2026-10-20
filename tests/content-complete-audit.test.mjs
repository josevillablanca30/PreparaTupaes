import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {buildTransfers} from '../scripts/paes-transfer-2027.mjs';
import {historiaCandidates} from '../scripts/paes-transfer-candidates-historia-2027.mjs';
import {scienceCandidates} from '../scripts/paes-transfer-candidates-fisica-2027.mjs';
import {biologyCandidates} from '../scripts/paes-transfer-candidates-biologia-2027.mjs';
import {scienceExpansionCandidates} from '../scripts/paes-transfer-candidates-ciencias-expansion-2027.mjs';
import {scienceRemainingCandidates} from '../scripts/paes-transfer-candidates-ciencias-final-2027.mjs';
import {tpCandidates} from '../scripts/paes-transfer-candidates-tp-2027.mjs';

const candidates=[...historiaCandidates,...scienceCandidates,...biologyCandidates,...scienceExpansionCandidates,...scienceRemainingCandidates,...tpCandidates];
const normalize=s=>String(s||'').normalize('NFKC').trim().toLocaleLowerCase('es');

test('Auditoría editorial integral: 14 candidatas con diagnóstico específico en cada distractor',()=>{
 const {items}=dailyCatalog(),built=buildTransfers(items,candidates);
 assert.equal(built.length,14);
 for(let i=0;i<built.length;i++){
  const q=built[i],row=candidates[i],base=items.find(x=>x.key===row.base);
  assert.ok(base);
  assert.equal(row.options.length,4);
  assert.equal(new Set(row.options.map(normalize)).size,4,'Alternativas duplicadas en '+row.id);
  assert.equal(row.errors[row.answer],'','La alternativa correcta no debe tener diagnóstico de error en '+row.id);
  for(let j=0;j<4;j++)if(j!==row.answer){
   assert.ok(row.errors[j].length>=45,'Distractor insuficientemente explicado '+row.id+'/'+j);
   assert.ok(q.teaching.selectedFeedback[j].diagnosis===row.errors[j]);
  }
  assert.ok(row.steps.every(s=>s.length>=60),'Explicación demasiado escueta '+row.id);
  assert.ok(row.transferDesign?.newTask,'Sin tarea de transferencia '+row.id);
  assert.ok(!items.some(x=>normalize(x.question)===normalize(row.question)),'Pregunta candidata repetida en banco: '+row.id);
  assert.ok(row.sourceTrace?.reviewStatus?.includes('pendiente'),'No afirmar certificación curricular '+row.id);
 }
});

test('Auditoría de contenido comercial por asignatura: claves coherentes, alternativas únicas y cobertura reportada',()=>{
 const {items}=dailyCatalog(),subjects=['M1','M2','Lectura','Historia','Ciencias'],report={};
 for(const subject of subjects){
  const bank=items.filter(x=>x.subjectKey===subject);
  let malformed=0,duplicates=0,missingExplanation=0;
  const normalized=new Set();
  for(const q of bank){
   if(!Array.isArray(q.options)||q.options.length<2||!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length)malformed++;
   else if(new Set(q.options.map(normalize)).size!==q.options.length)duplicates++;
   if(!q.teaching||!(q.why||q.steps?.length||q.teaching?.application?.length))missingExplanation++;
   const key=normalize(q.question);
   if(normalized.has(key)&&key){duplicates++;console.log('CONTENIDO DUPLICADO '+subject+': '+q.key+' — '+q.question);}else normalized.add(key);
  }
  report[subject]={total:bank.length,malformed,duplicates,missingExplanation};
  assert.equal(malformed,0,'Hay preguntas con estructura inválida en '+subject);
 }
 console.log('AUDITORÍA DE CONTENIDOS '+JSON.stringify(report));
 assert.equal(items.length,788,'No incrementar banco comercial por una auditoría');
});
