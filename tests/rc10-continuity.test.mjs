import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFileSync} from 'node:fs';import {dailyCatalog} from '../scripts/daily-catalog.mjs';
const c=vm.createContext({Intl,Date});for(const file of ['learning-core.js','daily-curriculum.js','daily-school.js','daily-progression.js','daily-core.js'])vm.runInContext(readFileSync(new URL('../'+file,import.meta.url),'utf8'),c);
const {items}=dailyCatalog(),L=c.CachasteLearning,C=c.CachasteCurriculum;
const memory=()=>{const data=new Map();return{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)}};
for(const subject of Object.keys(C.subjects))for(const track of subject==='Ciencias'?['Biología','Física','Química','TP']:[null])test('Express 15 equilibrado, persistente y sin eximición: '+subject+'/'+track,()=>{
 const storage=memory(),e=c.CachasteDaily.create(storage,items,C.subjects);e.state.track=track;const result=e.startExpress(subject,track);assert.equal(result.questions.length,15);assert.equal(new Set(result.questions.map(q=>q.family)).size,15);assert.ok(result.questions.every(q=>!q.supplementary&&q.examEligible!==false));
 const areaCounts={};for(const q of result.questions){const area=q.axis||q.area||q.skill;areaCounts[area]=(areaCounts[area]||0)+1;}
 assert.ok(Object.keys(areaCounts).length>=3);assert.ok(Math.max(...Object.values(areaCounts))-Math.min(...Object.values(areaCounts))<=1);
 if(subject==='Ciencias')assert.ok(result.questions.every(q=>q.module==='MC'||(track==='TP'?q.module==='MTP':q.module==='ME'&&q.subject===track)));
 const first=e.byKey.get(e.state.session.keys[0]);assert.equal(e.answer(first.answer).confidence,'no-declarada');assert.equal(e.transfer().questions.length,0);
 const reopened=c.CachasteDaily.create(storage,items,C.subjects);assert.equal(reopened.state.session.mode,'express-exam');assert.equal(reopened.state.session.checked,true);assert.equal(reopened.startExpress(subject,track).blocked,true);reopened.next();
 while(reopened.state.session){const s=reopened.state.session,q=reopened.byKey.get(s.keys[s.index]);reopened.answer(q.answer);reopened.next();}
 assert.equal(reopened.state.completed.at(-1).total,15);assert.equal(Object.keys(reopened.state.unitExams||{}).length,0);
});
test('Respuesta observada cuenta sin inventar seguridad; ayuda, repaso y familias iguales no acreditan dominio',()=>{
 const bank=[{id:'a',concept:'X',transferGroup:'A'},{id:'b',concept:'X',transferGroup:'B'}],rows=[{id:'a',correct:true,confidence:'no-declarada'},{id:'b',correct:true,confidence:'no-declarada'}];assert.equal(L.skillStars(L.profile(bank,rows)[0]),4);
 for(const flag of ['assisted','afterStudy','repeatedReview'])assert.ok(L.skillStars(L.profile(bank,rows.map(r=>({...r,[flag]:true})))[0])<4);
 assert.equal(L.skillStars(L.profile(bank,[rows[0],rows[0]])[0]),3);assert.notEqual(L.profile(bank,rows.map(r=>({...r,confidence:'sin-declarar'})))[0].status,'comprobado');
});
