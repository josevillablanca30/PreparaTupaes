import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {readinessAudit} from '../scripts/readiness-audit.mjs';

const {items}=dailyCatalog(),report=readinessAudit(items);
test('Auditoría continua detecta las brechas que restan sin inflar logros ni bancos',()=>{
 assert.equal(report.overall.originals,623);
 assert.equal(report.overall.transfers,60);
 assert.equal(report.overall.questions,683);
 assert.equal(report.overall.concepts,287);
 assert.ok(report.overall.unverifiableConcepts<136,'Los ejercicios nuevos deben reducir los objetivos no comprobables');
 assert.ok(report.overall.unverifiableConcepts>0,'No ocultar las brechas que quedan');
 assert.equal(report.gaps.length,report.overall.unverifiableConcepts);
 assert.equal(Object.values(report.subjects).reduce((n,s)=>n+s.concepts,0),287);
 assert.equal(Object.values(report.subjects).reduce((n,s)=>n+s.transfers,0),60);
 for(const gap of report.gaps){assert.equal(gap.families,1);assert.ok(gap.questions>=1);assert.ok(gap.concept.length>3);}
 console.log('BRECHAS AÚN PENDIENTES:',JSON.stringify(Object.fromEntries(Object.entries(report.subjects).map(([k,v])=>[k,{concepts:v.concepts,pendientes:v.unverifiableConcepts,transferencias:v.transfers}]))));
});
test('Mismo concepto no se acredita por duplicar ítems de una sola familia',()=>{
 const fake=[
  {subjectKey:'Ciencias',concept:'Experimento A',key:'A',family:'misma-familia'},
  {subjectKey:'Ciencias',concept:'Experimento A',key:'B',family:'misma-familia'},
  {subjectKey:'Historia',concept:'Interpretar dos documentos',key:'C',family:'fuente-1'},
  {subjectKey:'Historia',concept:'Interpretar dos documentos',key:'D',family:'fuente-2'}
 ];
 const result=readinessAudit(fake);
 assert.equal(result.overall.concepts,2);
 assert.equal(result.overall.unverifiableConcepts,1);
 assert.equal(result.subjects.Ciencias.unverifiableConcepts,1);
 assert.equal(result.subjects.Historia.unverifiableConcepts,0);
});
