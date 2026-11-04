import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {buildTransfers,transferCases} from '../scripts/paes-transfer-2027.mjs';
import {auditContentContext} from '../scripts/content-context-audit.mjs';
import {previousTransferAssessments} from '../scripts/transfer-context-review-20261104.mjs';
const {items}=dailyCatalog(),byKey=new Map(items.map(q=>[q.key,q]));
const ctx=vm.createContext({});for(const file of ['learning-core.js','daily-visuals.js'])vm.runInContext(readFileSync(new URL('../'+file,import.meta.url),'utf8'),ctx);
test('802 preguntas: estructura, 130 textos, 18 figuras y 70 respuestas contrastadas independientemente',()=>{
 const report=auditContentContext(items);assert.equal(report.questions,802);assert.equal(report.transfers,171);assert.equal(report.visuals,18);assert.equal(report.calculations.length,70);assert.deepEqual(report.issues,[]);
});
test('Una pregunta nueva no puede heredar silenciosamente el gráfico ni el texto de su base',()=>{
 const base=byKey.get('M1:271'),row={...transferCases[0],base:base.key,id:'REGRESSION'};
 assert.throws(()=>buildTransfers([base],[row]),/decisión explícita/);
 const [without]=buildTransfers([base],[{...row,visual:null}]);assert.equal(without.visual,null);assert.equal(without.q,row.question);assert.equal(without.passageId,null);
 const own={type:'bar',labels:['A','B'],values:[3,5],caption:'Otro contexto'};
 assert.deepEqual(buildTransfers([base],[{...row,visual:own}])[0].visual,own);
});
test('La escala usa centímetros y kilómetros, nunca el presupuesto anterior ni la solución en la figura',()=>{
 const q=byKey.get('M1:TR-M1-007'),svg=ctx.CachasteDailyVisual(q);
 assert.deepEqual(q.visual.labels,['1 cm','2 cm']);assert.deepEqual(q.visual.values,[2,4]);assert.equal(q.options[q.answer],4/2*7+' km');
 assert.match(svg,/0 km/);assert.match(svg,/4 km/);assert.match(svg,/2 cm en el plano/);assert.match(svg,/no medir en pantalla/);assert.doesNotMatch(svg,/14 km/);
 assert.doesNotMatch(JSON.stringify([q.visual,q.teaching,q.easy,q.example]),/presupuesto|transporte|miles de pesos|frecuencia/i);
});
test('La encuesta muestra sus cuatro preferencias y sus 50 respuestas, con dos máximos de 15',()=>{
 const q=byKey.get('M1:TR-M1-022'),v=q.visual;
 assert.deepEqual(v.labels,['Fútbol','Dibujo','Música','Lectura']);assert.deepEqual(v.values,[12,15,15,8]);assert.equal(v.values.reduce((a,b)=>a+b),50);
 const max=Math.max(...v.values);assert.deepEqual(v.labels.filter((_,i)=>v.values[i]===max),['Dibujo','Música']);
 assert.doesNotMatch(JSON.stringify([v,q.teaching,q.easy,q.example]),/préstamos|lunes|martes|miércoles|jueves/i);
});
test('Los tres cambios de evaluación conservan sus versiones anteriores y las claves de respuesta',()=>{
 for(const [key,old] of Object.entries(previousTransferAssessments)){
  const q=byKey.get(key);assert.equal(ctx.CachasteLearning.assessmentVersion(old),old.assessmentVersion);assert.notEqual(ctx.CachasteLearning.assessmentVersion(q),old.assessmentVersion);
  assert.deepEqual(q.options,old.options);assert.equal(q.answer,old.answer);assert.equal(q.legacyAssessmentVersion,old.assessmentVersion);assert.equal(q.previousAssessments[0].assessmentVersion,old.assessmentVersion);
 }
});
test('Potencias: el contexto admite factor 5 y las identidades se verifican con valores independientes',()=>{
 const q=byKey.get('M1:TR-M1-021');assert.doesNotMatch(q.question,/reduce/i);assert.doesNotMatch(q.example,/sumamos sus cantidades/);assert.equal(5**4*5**2/5**5,5);
 assert.equal(3**4*3**2/3**3,3**3);
 for(const x of [-4,0,2,11]){assert.equal(4*(2*x-3)-2*(x+1),6*x-14);assert.equal((x+5)**2,x*x+10*x+25);}
 for(const x of [8,10,19])assert.equal((x*x-49)/(x+7),x-7);
 assert.ok(Math.abs((6*Math.sqrt(2))**2-72)<1e-12);
});
test('El tutor del pez explica branquias, transporte y ATP sin asignarle pulmones',()=>{
 const q=byKey.get('Ciencias:TR-SCI-097'),text=JSON.stringify([q.teaching,q.easy,q.example]);assert.match(text,/branquias/);assert.match(text,/ATP/);assert.doesNotMatch(text,/pulmones|pulmonar|mueve aire/);
});
test('Figuras con texto no confiable se escapan y una escala incoherente se rechaza',()=>{
 const q=structuredClone(byKey.get('M1:TR-M1-007'));q.visual.caption='<script>alert(1)</script>';assert.doesNotMatch(ctx.CachasteDailyVisual(q),/<script>/);
 q.visual.values=[2,5];assert.equal(ctx.CachasteDailyVisual(q),'');
});
