import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {transferCasesBatch2} from '../scripts/paes-transfer-batch2-2027.mjs';

const {items}=dailyCatalog();
const cases=transferCasesBatch2;

test('Segundo lote: 18 problemas originales separados en M1, Ciencias e Historia',()=>{
 assert.equal(cases.length,18);
 assert.equal(items.length,706);
 assert.equal(new Set(items.map(q=>q.key)).size,706);
 assert.deepEqual(['M1','Ciencias','Historia'].map(subject=>cases.filter(r=>r.base.startsWith(subject+':')).length),[6,6,6]);
 assert.equal(new Set(cases.map(q=>q.base)).size,18,'No sustituir diferentes problemas con una misma habilidad');
 for(const row of cases){
  const base=items.find(q=>q.key===row.base),q=items.find(q=>q.id===row.id);
  assert.ok(base&&q,'Falta ejercicio: '+row.id);
  assert.equal(q.origin,'original-transfer-2027');
  assert.equal(base.levelId,q.levelId);
  assert.equal(base.concept,q.concept);
  assert.notEqual(base.question,q.question,'La transferencia no debe repetir el enunciado base');
  assert.notEqual(base.family,q.family,'Una pregunta nueva debe ser otra familia independiente');
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options).size,4);
  assert.equal(q.answer,row.answer);
  assert.ok(q.explanations.every((x,i)=>x.length>=35||i===row.answer),row.id);
  assert.ok(row.steps.length===3&&row.steps.every(x=>x.length>=55),row.id);
  assert.ok(row.errors.every((x,i)=>i===row.answer?x==='':x.length>=24),row.id);
  assert.equal(q.teaching.selectedFeedback[row.answer],null);
  assert.equal(q.teaching.selectedFeedback.filter(Boolean).length,3);
  assert.ok(items.filter(x=>x.subjectKey===base.subjectKey&&x.concept===base.concept).length>=2,row.id);
 }
});

test('Comprobar claves M1 numéricas y signos de los distractores del segundo lote',()=>{
 const answers=new Map(cases.map(r=>[r.id,r.options[r.answer]]));
 assert.equal(answers.get('TR-M1-007'),'14 km');
 assert.equal(answers.get('TR-M1-008'),'60');
 assert.equal(answers.get('TR-M1-009'),'9 m');
 assert.equal(answers.get('TR-M1-010'),'10 horas');
 assert.equal(answers.get('TR-M1-011'),'x² + 10x + 25');
 assert.equal(answers.get('TR-M1-012'),'70π m');
 assert.equal(7*(4/2),14);
 assert.equal(240*3/8*2/3,60);
 assert.equal(9**3,729);
 assert.equal(8*15/12,10);
 for(const x of [0,2,8])assert.equal((x+5)**2,x**2+10*x+25);
 assert.equal(2*35*Math.PI*100/100,70*Math.PI);
});

test('Validar resultados de Física/Química y sentido de los casos de Ciencias',()=>{
 const get=id=>{const q=items.find(q=>q.id===id);return q.options[q.answer]};
 assert.equal(get('TR-SCI-007'),'El cultivo con respiración aeróbica puede obtener mayor rendimiento de ATP');
 assert.equal(get('TR-SCI-008'),'El oxígeno es pequeño y no polar, mientras la glucosa requiere proteínas transportadoras');
 assert.equal(get('TR-SCI-009'),'El aparato de Golgi, que modifica y dirige proteínas hacia su destino');
 assert.equal(get('TR-SCI-010'),'La mutación que alcance un gameto que participe en la fecundación');
 assert.equal(get('TR-SCI-011'),'16 m/s');
 assert.equal(get('TR-SCI-012'),'4 % m/v');
 assert.equal(4+1.5*8,16);
 assert.equal(12/300*100,4);
});

test('Historia: comprobar principios, períodos y fuentes, sin definir banalidades',()=>{
 const expected={
  'TR-HIS-007':'La separación gradual entre funciones estatales y autoridad religiosa',
  'TR-HIS-008':'Se produjo una ruptura del orden democrático con concentración del poder',
  'TR-HIS-009':'La Junta fue parte de un proceso político de independencia con etapas y conflictos posteriores',
  'TR-HIS-010':'Una ampliación gradual de derechos y espacios de participación política',
  'TR-HIS-011':'La igualdad de trato y la prohibición de discriminación arbitraria',
  'TR-HIS-012':'Un sistema progresivo en el que la proporción aportada crece con el ingreso'
 };
 for(const [id,answer]of Object.entries(expected)){
  const q=items.find(q=>q.id===id);
  assert.ok(q,id);
  assert.equal(q.options[q.answer],answer,id);
  assert.match(q.question,/Chile|institución|persona|familia|estudiante|ejemplo|gráfico/i);
 }
});
