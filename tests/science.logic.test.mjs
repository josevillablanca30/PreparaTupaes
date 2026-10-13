import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const bankSrc=readFileSync(new URL('../science-bank.js',import.meta.url),'utf8');
const appSrc=readFileSync(new URL('../science-app.js',import.meta.url),'utf8');
function science(initial=new Map()){
 const data=initial;
 const elements={view:{innerHTML:''},status:{textContent:''},'science-note':{value:''},'science-note-export':{value:'',select(){},focus(){}}};
 const window={scrollTo(){}};
 const document={getElementById:id=>elements[id]||null,execCommand:()=>true};
 const storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 const context=vm.createContext({window,document,localStorage:storage,console});
 vm.runInContext(bankSrc,context);
 vm.runInContext(appSrc,context);
 return {data,elements,window,bank:window.SCIENCE_BANK,saved:()=>JSON.parse(data.get('cachaste-science-v1')||'{}')};
}
test('Ciencias: 63 ítems originales sin respuestas, IDs ni alternativas duplicadas',()=>{
 const {bank}=science();
 assert.equal(bank.length,63);
 assert.equal(new Set(bank.map(q=>q.id)).size,63);
 const texts=new Set();
 for(const q of bank){
  assert.equal(q.options.length,4,q.id);
  assert.equal(new Set(q.options).size,4,q.id);
  assert.ok(q.answer>=0&&q.answer<4,q.id);
  assert.equal(q.explanations.length,4,q.id);
  assert.ok(q.explanations.every(x=>x.length>=15),q.id);
  assert.ok(q.steps.length>=2&&q.easy&&q.example,q.id);
  assert.ok(!texts.has(q.question),q.id);
  texts.add(q.question);
 }
});
test('Ciencias: Módulo Común, Electivo y TP tienen cobertura balanceada',()=>{
 const {bank,window}=science();
 for(const sub of ['Biología','Física','Química']){
  assert.equal(bank.filter(q=>q.subject===sub&&q.module==='MC').length,15);
  assert.equal(bank.filter(q=>q.subject===sub&&q.module==='ME').length,4);
  assert.equal(bank.filter(q=>q.subject===sub&&q.module==='MTP').length,2);
 }
 assert.equal(new Set(bank.map(q=>q.area)).size,11);
 assert.equal(new Set(bank.map(q=>q.skill)).size,5);
 assert.ok(window.SCIENCE_TOPICS.Biología.length===4);
});
test('Ciencias: cada electivo practica 9 MC (tres por materia) y 3 especialistas',()=>{
 for(const elected of ['Biología','Física','Química']){
  const a=science();a.window.chooseTrack(elected);a.window.setup('modulo');
  const saved=a.saved(),chosen=saved.session.ids.map(id=>a.bank.find(q=>q.id===id));
  assert.equal(chosen.length,12);
  assert.equal(chosen.filter(q=>q.module==='MC').length,9);
  assert.equal(chosen.filter(q=>q.module==='ME'&&q.subject===elected).length,3);
  for(const sub of ['Biología','Física','Química'])
   assert.equal(chosen.filter(q=>q.module==='MC'&&q.subject===sub).length,3);
 }
});
test('Ciencias: módulo Técnico Profesional contiene las tres materias y refuerzo TP',()=>{
 const a=science();a.window.chooseTrack('TP');a.window.setup('modulo');
 const q=a.saved().session.ids.map(id=>a.bank.find(x=>x.id===id));
 assert.equal(q.length,12);
 assert.equal(q.filter(x=>x.module==='MC').length,9);
 assert.equal(q.filter(x=>x.module==='MTP').length,3);
 assert.equal(new Set(q.filter(x=>x.module==='MTP').map(x=>x.subject)).size,3);
});
test('Ciencias: tutor enseña con pistas, corrección por alternativa y explicación sencilla',()=>{
 const a=science();a.window.setup('Biología');
 const first=a.bank.find(q=>q.id===a.saved().session.ids[0]);
 assert.ok(a.elements.view.innerHTML.includes('Necesito una pista'));
 a.window.hint();a.window.hint();assert.equal(a.saved().session.hint,2);
 a.window.answer(first.answer);a.window.check();
 assert.ok(a.elements.view.innerHTML.includes('¡Cachaste, con una pista!'));
 assert.ok(a.elements.view.innerHTML.includes(first.explanations[first.answer]));
 a.window.changeMode('easy');assert.ok(a.elements.view.innerHTML.includes(first.easy));
 a.window.changeMode('example');assert.ok(a.elements.view.innerHTML.includes(first.example));
 const data=a.saved();assert.equal(data.history.length,1);
 assert.equal(data.history[0].assisted,true);
});
test('Ciencias: error queda pendiente y se recupera en otra práctica; acierto autónomo lo cierra',()=>{
 const a=science();a.window.setup('Física');
 const id=a.saved().session.ids[0],q=a.bank.find(x=>x.id===id),wrong=(q.answer+1)%4;
 a.window.answer(wrong);a.window.check();
 assert.ok(a.saved().pending.includes(id));
 a.window.setup('errores');
 assert.equal(a.saved().session.ids[0],id);
 a.window.answer(q.answer);a.window.check();
 assert.equal(a.saved().pending.includes(id),false);
});
test('Ciencias: la sesión continúa después de cerrar y volver a abrir',()=>{
 const data=new Map();const a=science(data);a.window.setup('Química');a.window.hint();
 const before=a.saved().session;const reopened=science(data);
 assert.equal(reopened.saved().session.ids[0],before.ids[0]);
 reopened.window.resume();
 assert.ok(reopened.elements.view.innerHTML.includes('Pista 1 de 2'));
});
test('Ciencias: permite dejar observaciones en Biología sin cambiar respuestas oficiales',()=>{
 const data=new Map();const a=science(data);a.window.setup('Biología');
 const id=a.saved().session.ids[0],q=a.bank.find(x=>x.id===id);
 a.window.reviewToggle();a.elements['science-note'].value='Proponer una explicación más rigurosa y una fuente.';
 a.window.saveNote();assert.equal(a.saved().notes[id].note,'Proponer una explicación más rigurosa y una fuente.');
 assert.equal(a.bank.find(x=>x.id===id).answer,q.answer);
 const b=science(data);b.window.exportNotes();
 assert.ok(b.elements.view.innerHTML.includes('Proponer una explicación'));
 assert.ok(b.elements.view.innerHTML.includes('Copiar observaciones'));
});
test('Ciencias: progreso independiente de M1 y mensajes responsables sobre el examen',()=>{
 const a=science();
 assert.ok(a.elements.view.innerHTML.includes('54 del Módulo Común'));
 assert.ok(a.elements.view.innerHTML.includes('no habilitamos un simulacro completo'));
 assert.ok(!a.data.has('prepara-paes-demo-v1'));
 assert.ok(!a.data.has('prepara-paes-active-exam-v1'));
});
