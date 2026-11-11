import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';

const ctx=vm.createContext({Intl,Date});
for(const file of ['learning-core.js','daily-core.js','daily-curriculum.js'])vm.runInContext(readFileSync(new URL('../'+file,import.meta.url),'utf8'),ctx);
const items=dailyCatalog().items,C=ctx.CachasteCurriculum;
const DAY=86400000;
function create(){
 const store=new Map(),storage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
 let now=Date.parse('2026-10-16T12:00:00Z');
 const engine=ctx.CachasteDaily.create(storage,items,C.subjects,()=>now,()=>0.314159);
 return {engine,advance:days=>{now+=days*DAY;},reload:()=>ctx.CachasteDaily.create(storage,items,C.subjects,()=>now,()=>0.314159)};
}
function answerOne(engine,confidence,correct=true){
 const result=engine.start('M1',1,'smart');
 assert.ok(result.questions.length,'debe existir una pregunta disponible');
 const q=engine.byKey.get(engine.state.session.keys[0]);
 const index=correct?q.answer:(q.answer+1)%q.options.length;
 const row=engine.answer(index,confidence);
 assert.ok(row);
 return {row,q};
}
test('La confianza decide plazos reales y persiste en almacenamiento offline',()=>{
 for(const [confidence,days,kind] of [['seguro',3,'dominado'],['duda',1,'reforzar-confianza'],['azar',1,'reforzar-confianza']]){
  const {engine,advance,reload}=create();
  const {q}=answerOne(engine,confidence);
  const entry=engine.reviewFor('M1',null,q.concept);
  assert.equal(entry.days,days);
  assert.equal(entry.kind,kind);
  assert.equal(engine.dueReviews('M1').length,0);
  advance(days);
  assert.ok(reload().dueReviews('M1').some(r=>r.concept===q.concept));
 }
});
test('Respuesta segura equivocada prepara refuerzo guiado, sin marcar dominio',()=>{
 const {engine,advance}=create();
 const {row,q}=answerOne(engine,'seguro',false);
 const entry=engine.reviewFor('M1',null,q.concept);
 assert.equal(entry.kind,'revisar-confusion');
 assert.equal(entry.tutor,'steps');
 assert.equal(entry.days,1);
 assert.equal(row.reviewKind,'revisar-confusion');
 assert.notEqual(engine.profile('M1').find(p=>p.concept===q.concept)?.status,'comprobado');
 advance(1);
 assert.ok(engine.dueReviews('M1').some(r=>r.concept===q.concept));
});
test('La respuesta al azar no acredita dominio aunque sea correcta',()=>{
 const {engine}=create();
 const {q}=answerOne(engine,'azar');
 assert.equal(engine.profile('M1').find(p=>p.concept===q.concept)?.status,'por reforzar');
 assert.equal(engine.reviewFor('M1',null,q.concept).tutor,'easy');
});
test('Una pregunta de eximición no entrega retroalimentación anticipada',()=>{
 const {engine}=create();
 const concepts=[...new Set(items.filter(q=>q.subjectKey==='M1').map(q=>q.concept))];
 const result=engine.startUnitExam('M1','verificacion',concepts);
 assert.ok(!result.blocked);
 const q=engine.byKey.get(engine.state.session.keys[0]);
 const row=engine.answer(q.answer,'duda');
 assert.equal(row.reviewKind,undefined);
 assert.equal(engine.dueReviews('M1').length,0);
});
