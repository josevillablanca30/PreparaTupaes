import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {loadBanks} from '../scripts/load-banks.mjs';
import {transferCases} from '../scripts/paes-transfer-2027.mjs';

const ctx=vm.createContext({Intl,Date});
for(const file of ['learning-core.js','daily-curriculum.js','daily-core.js'])vm.runInContext(readFileSync(new URL('../'+file,import.meta.url),'utf8'),ctx);
const {items}=dailyCatalog(),C=ctx.CachasteCurriculum,D=ctx.CachasteDaily;
const fakeStore=()=>{const map=new Map();return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)}};

test('El banco conserva 623 ítems originales e incorpora 18 nuevos casos independientes con clave inequívoca',()=>{
 const old=loadBanks();
 assert.deepEqual([old.M1.length,old.M2.length,old.Lectura.length,old.Ciencias.length,old.Historia.length],[116,106,130,206,65]);
 assert.equal(transferCases.length,18);
 assert.equal(items.length,659);
 assert.equal(new Set(items.map(q=>q.key)).size,659);
 for(const name of ['M1','Ciencias','Historia']){
  assert.equal(items.filter(q=>q.subjectKey===name&&q.origin==='original-transfer-2027').length,12,name);
 }
 for(const r of transferCases){
  const newQ=items.find(q=>q.id===r.id),base=items.find(q=>q.key===r.base);
  assert.ok(newQ&&base,r.id);
  assert.equal(newQ.subjectKey,base.subjectKey);
  assert.equal(newQ.concept,base.concept);
  assert.equal(newQ.levelId,base.levelId);
  assert.equal(newQ.question,r.question);
  assert.notEqual(newQ.question,base.question,'Mismo caso evaluado');
  assert.notEqual(newQ.family,base.family,'No hay independencia de preguntas');
  assert.equal(newQ.options.length,4);
  assert.equal(new Set(newQ.options).size,4);
  assert.equal(newQ.answer,r.answer);
  assert.ok(newQ.explanations.every((s,i)=>s.length>=30||i===r.answer),r.id);
  assert.ok(newQ.teaching?.selectedFeedback.every((f,i)=>i===newQ.answer?f===null:f.repair?.length===3),r.id);
  assert.equal(newQ.origin,'original-transfer-2027');
 }
});
test('Las 18 claves numéricas y explicaciones editoriales tienen resultados correctos',()=>{
 const answerOf=id=>{const x=items.find(q=>q.id===id);assert.ok(x);return x.options[x.answer]};
 const expected={
  'TR-M1-001':'81','TR-M1-002':'$50.000','TR-M1-003':'3³','TR-M1-004':'6x − 14','TR-M1-005':'48,8%','TR-M1-006':'77',
  'TR-SCI-001':'La concentración de nitrógeno aplicada',
  'TR-SCI-002':'La conclusión excede la población y condiciones observadas',
  'TR-SCI-003':'1,0 kWh','TR-SCI-004':'Salió agua por ósmosis y ocurrió plasmólisis',
  'TR-SCI-005':'12 protones, 10 electrones, carga +2','TR-SCI-006':'80 W',
  'TR-HIS-001':'La crítica racional y los límites al poder',
  'TR-HIS-002':'Impulsar cooperación y solución pacífica de conflictos',
  'TR-HIS-003':'El secreto y la libertad del sufragio',
  'TR-HIS-004':'Son transformaciones vinculadas con la cuestión social y las demandas de organización laboral',
  'TR-HIS-005':'Mayor oferta, precio menor y cantidad mayor',
  'TR-HIS-006':'Una externalidad negativa cuyo costo social excede el costo privado'
 };
 for(const [id,answer]of Object.entries(expected))assert.equal(answerOf(id),answer,id);
 assert.equal(450*.18,81);
 assert.ok(Math.abs(36000/(.9*.8)-50000)<1e-8);
 assert.equal(3**4*3**2/3**3,3**3);
 assert.equal(4*(2*2-3)-2*(2+1),6*2-14);
 assert.ok(Math.abs(1-.8**3-.488)<1e-12);
 assert.equal(80*.25+60*.35+90*.40,77);
 assert.equal(.75*(80/60),1);
 assert.equal(400*6/30,80);
});
test('El motor exige respuestas seguras distintas: una clase o un acierto no certifican dominio',()=>{
 const e=D.create(fakeStore(),items,C.subjects,()=>Date.parse('2026-10-16T16:00:00Z'),()=>.45);
 const original=items.find(q=>q.key==='Historia:HIS-013'),transfer=items.find(q=>q.id==='TR-HIS-001');
 const eProfile=()=>e.profile('Historia').find(x=>x.concept===original.concept);
 assert.ok(original&&transfer);
 const select=e.select('Historia',2,{concept:original.concept});
 assert.equal(select.questions.length,2);
 assert.equal(new Set(select.questions.map(x=>x.family)).size,2);
 assert.equal(eProfile().status,'sin explorar');
 e.start('Historia',2,'free',original.concept);
 const keys=e.state.session.keys;
 assert.ok(keys.includes(original.key)&&keys.includes(transfer.key));
 e.answer(e.byKey.get(keys[0]).answer,'seguro');
 assert.notEqual(eProfile().status,'comprobado');
 e.next();
 e.answer(e.byKey.get(keys[1]).answer,'seguro');
 assert.equal(eProfile().status,'comprobado');
});
