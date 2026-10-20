import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
const ctx=vm.createContext({Intl,Date});
for(const file of ['learning-core.js','daily-curriculum.js','daily-core.js'])vm.runInContext(readFileSync(new URL('../'+file,import.meta.url),'utf8'),ctx);
const {CachasteDaily:D,CachasteCurriculum:C,CachasteLearning:L}=ctx;
const memory=()=>{const data=new Map();return {getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)};};
const now=()=>Date.parse('2026-10-20T12:00:00Z');
const catalog=dailyCatalog();
const engine=(bank,storage,passages=[])=>D.create(storage,bank,C.subjects,now,()=>.5,passages);
for(const subject of Object.keys(C.subjects)){
 test('Sesión diaria '+subject+': actualizar alternativas conserva selección, tutor, clave e historial originales',()=>{
  const storage=memory(),bank=catalog.items.filter(q=>q.subjectKey===subject),first=engine(bank,storage,catalog.texts);
  if(subject==='Ciencias')first.state.track='Biología';
  first.start(subject,2,'free');const s=first.state.session,key=s.keys[0],q=first.byKey.get(key);
  s.selected=q.answer;s.confidence='seguro';s.tutor='easy';s.card=2;first.save();
  const updated=bank.map(item=>({...item,question:item.question+' [edición posterior]',options:[...item.options].reverse(),answer:item.options.length-1-item.answer}));
  const resumed=engine(updated,storage,catalog.texts),active=resumed.byKey.get(key);
  assert.equal(active.question,q.question);assert.deepEqual(Array.from(active.options),Array.from(q.options));assert.equal(active.teaching.aim,q.teaching.aim);
  assert.equal(resumed.state.session.selected,q.answer);assert.equal(resumed.state.session.tutor,'easy');assert.equal(resumed.state.session.card,2);
  const answer=resumed.answer(q.answer,'seguro');assert.equal(answer.correct,true);assert.equal(answer.assessmentVersion,L.assessmentVersion(q));
  assert.equal(resumed.stats().xp,15);assert.equal(resumed.history(subject).length,1,'El espejo no duplica el intento');
  assert.equal(resumed.profile(subject).find(p=>p.concept===q.concept).status,'sin explorar','Una respuesta antigua no acredita la evaluación nueva');
  resumed.close();assert.equal(resumed.byKey.get(key).question,updated.find(x=>x.key===key).question);
  const again=engine(updated,storage,catalog.texts);assert.equal(again.stats().xp,15);assert.equal(again.history(subject).length,1);
 });
}
test('Lectura: el texto original permanece junto a la pregunta al actualizar el pasaje',()=>{
 const storage=memory(),bank=catalog.items.filter(q=>q.subjectKey==='Lectura'),e=engine(bank,storage,catalog.texts);
 e.start('Lectura',1,'free');const key=e.state.session.keys[0],q=e.byKey.get(key),original=catalog.texts.find(p=>p.id===q.passageId);
 const texts=catalog.texts.map(p=>({...p,paragraphs:['Texto revisado que ya no contiene la evidencia original.']}));
 const updated=bank.map(q=>({...q}));L.bindPassages(updated,texts);
 const resumed=engine(updated,storage,texts),active=resumed.byKey.get(key);
 assert.deepEqual(Array.from(active.passageSnapshot.paragraphs),Array.from(original.paragraphs));assert.equal(active.passageVersion,q.passageVersion);
 const corrupt=JSON.parse(storage.getItem(D.KEY));corrupt.session.questionSnapshots[0].passageSnapshot.paragraphs[0]='Texto alterado';storage.setItem(D.KEY,JSON.stringify(corrupt));
 assert.equal(engine(updated,storage,texts).state.session,null,'No mostrar un texto que no corresponde a la versión guardada');
});
test('Transferencia añadida queda congelada y puede retomarse después de una actualización',()=>{
 const bank=catalog.items.filter(q=>q.subjectKey==='M1'),storage=memory(),e=engine(bank,storage);
 e.start('M1',1,'free');const q=e.byKey.get(e.state.session.keys[0]);e.answer((q.answer+1)%q.options.length,'seguro');
 const transfer=e.transfer();assert.equal(transfer.questions.length,1);assert.equal(e.state.session.questionSnapshots.length,2);
 e.next();const key=e.state.session.keys[1],original=e.byKey.get(key);
 const updated=bank.map(q=>({...q,question:q.question+' [nueva versión]'})),resumed=engine(updated,storage);
 assert.equal(resumed.state.session.index,1);assert.equal(resumed.byKey.get(key).question,original.question);
 resumed.answer(original.answer,'seguro');assert.equal(resumed.next(),true);assert.equal(resumed.state.session,null);
 assert.equal(resumed.byKey.get(key).question,updated.find(q=>q.key===key).question,'Restituir catálogo al terminar');
});
test('Archivo de sesión corrupto no reinterpreta respuestas ni elimina XP e historial',()=>{
 const storage=memory(),bank=catalog.items.filter(q=>q.subjectKey==='M2'),e=engine(bank,storage);
 e.start('M2',2,'free');const q=e.byKey.get(e.state.session.keys[0]);e.answer(q.answer,'seguro');
 const data=JSON.parse(storage.getItem(D.KEY));data.session.questionSnapshots[0].answer=(q.answer+1)%q.options.length;storage.setItem(D.KEY,JSON.stringify(data));
 const resumed=engine(bank,storage);assert.equal(resumed.state.session,null);assert.equal(resumed.stats().xp,15);assert.equal(resumed.history('M2').length,1);assert.match(resumed.warning,/verificar/);
});
test('Tutor: modo fácil conecta intuición, aplicación particular y comprobación en los 788 ejercicios',()=>{
 for(const q of catalog.items){const cards=Array.from(L.lessonCards(q,'easy')),t=q.teaching;
  assert.ok(cards.includes(t.intuition[0].trim()),q.key+' sin intuición');assert.ok(cards.includes(t.application[0].trim()),q.key+' sin aplicación');assert.equal(cards.at(-1),t.check.trim(),q.key+' sin comprobación');
  assert.ok(cards.every(card=>card.trim()),q.key+' tarjeta vacía');
  const html=L.lesson(q,'easy');assert.ok(html.includes('Comprobemos el resultado'),q.key);
 }
});
