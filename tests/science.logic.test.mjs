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
 vm.runInContext(readFileSync(new URL('../learning-core.js',import.meta.url),'utf8'),context);
 vm.runInContext(bankSrc,context);
 vm.runInContext(appSrc,context);
 return {data,elements,window,bank:window.SCIENCE_BANK,saved:()=>JSON.parse(data.get('cachaste-science-v1')||'{}')};
}
function unlockedData(data=new Map()){data.set('cachaste-science-v1',JSON.stringify({baseline:{completed:true,results:Array.from({length:30},()=>({subject:'Biología',area:'Herencia y evolución',correct:true,confidence:'seguro'}))}}));return data}
test('Ciencias: 206 ítems originales sin respuestas, IDs ni alternativas duplicadas',()=>{
 const {bank}=science();
 assert.equal(bank.length,206);
 assert.equal(new Set(bank.map(q=>q.id)).size,206);
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
  assert.equal(bank.filter(q=>q.subject===sub&&q.module==='MC').length,22);
  assert.equal(bank.filter(q=>q.subject===sub&&q.module==='ME').length,sub==='Biología'?41:sub==='Física'?33:34);
  assert.equal(bank.filter(q=>q.examEligible!==false&&q.subject===sub&&q.module==='MTP').length,sub==='Química'?8:9);
 }
 assert.equal(new Set(bank.map(q=>q.area)).size,11);
 assert.equal(new Set(bank.map(q=>q.skill)).size,5);
 assert.ok(window.SCIENCE_TOPICS.Biología.length===4);
});
test('Ciencias: diagnóstico inicial de 30 presenta las tres ciencias y la mención seleccionada',()=>{
 for(const track of ['Biología','Física','Química','TP']){
  const a=science();a.window.chooseTrack(track);a.window.setup('diagnostico');
  const q=a.saved().session.ids.map(id=>a.bank.find(x=>x.id===id));
  assert.equal(q.length,30);
  assert.equal(new Set(q.map(x=>x.id)).size,30);
  assert.equal(q.filter(x=>x.module==='MC').length,27);
  assert.equal(q.filter(x=>x.module=== (track==='TP'?'MTP':'ME')).length,3);
  for(const sub of ['Biología','Física','Química'])assert.equal(q.filter(x=>x.subject===sub).length,track==='TP'?10:sub===track?12:9);
  assert.ok(q.every((x,i)=>i===0||x.subject!==q[i-1].subject));
 }
});
test('Ciencias: antes del diagnóstico Express no puede iniciarse',()=>{
 const a=science();a.window.setup('express');
 assert.equal(a.saved().session??null,null);
 assert.ok(a.elements.view.innerHTML.includes('Comenzar diagnóstico de 30'));
 assert.ok(a.elements.view.innerHTML.includes('disabled'));
});
test('Ciencias: Express intercala 7 comunes y 3 de la mención elegida',()=>{
 for(const track of ['Biología','Física','Química']){
  const a=science(unlockedData());a.window.chooseTrack(track);a.window.setup('express');
  const q=a.saved().session.ids.map(id=>a.bank.find(x=>x.id===id));
  assert.equal(q.length,10);
  assert.equal(new Set(q.map(x=>x.id)).size,10);
  assert.equal(q.filter(x=>x.module==='MC').length,7);
  assert.equal(q.filter(x=>x.module==='ME'&&x.subject===track).length,3);
  assert.equal(q.filter(x=>x.subject===track).length,5);
  assert.ok(q.every((x,i)=>i===0||x.subject!==q[i-1].subject));
 }
});
test('Ciencias: TP Express presenta las tres materias',()=>{
 const a=science(unlockedData());a.window.chooseTrack('TP');a.window.setup('express');
 const q=a.saved().session.ids.map(id=>a.bank.find(x=>x.id===id));
 assert.equal(q.length,10);
 assert.equal(q.filter(x=>x.module==='MC').length,7);
 assert.equal(q.filter(x=>x.module==='MTP').length,3);
 for(const sub of ['Biología','Física','Química'])assert.ok(q.filter(x=>x.subject===sub).length>=3);
});
test('Ciencias: práctica común alterna tres ciencias',()=>{
 const a=science(unlockedData());a.window.setup('mixto');
 const q=a.saved().session.ids.map(id=>a.bank.find(x=>x.id===id));
 assert.equal(q.length,9);
 assert.equal(q.filter(x=>x.module==='MC').length,9);
 for(const sub of ['Biología','Física','Química'])assert.equal(q.filter(x=>x.subject===sub).length,3);
 assert.ok(q.every((x,i)=>i===0||x.subject!==q[i-1].subject));
});
test('Ciencias: diagnóstico guardado desbloquea Express y produce un plan propio',()=>{
 const data=new Map(),a=science(data);
 a.window.setup('diagnostico');
 for(let i=0;i<30;i++){
  const current=a.saved().session;
  const q=a.bank.find(x=>x.id===current.ids[current.index]);
  a.window.answer(i<7?(q.answer+1)%4:q.answer);
  if(i===8)a.window.confidence('azar');
  a.window.check();
  a.window.next();
 }
 assert.equal(a.saved().baseline.results.length,30);
 assert.ok(a.elements.view.innerHTML.includes('Resultados por asignatura'));
 a.window.backHome();
 assert.ok(a.elements.view.innerHTML.includes('Lo que conviene aprender primero'));
 assert.ok(a.elements.view.innerHTML.includes('Express · 10 preguntas'));
 a.window.setup('express');
 assert.equal(a.saved().session.ids.length,10);
 const reopened=science(data);
 assert.equal(reopened.saved().baseline.completed,true);
});
test('Ciencias: se registra seguridad y azar sin confundirlo con dominio autónomo',()=>{
 const a=science(unlockedData());a.window.setup('express');
 const q=a.bank.find(x=>x.id===a.saved().session.ids[0]);
 a.window.confidence('azar');a.window.answer(q.answer);a.window.check();
 assert.equal(a.saved().history.at(-1).confidence,'azar');
 assert.equal(a.saved().history.at(-1).correct,true);
 assert.equal(a.saved().history.at(-1).assisted,false);
});
test('Ciencias: tutor enseña con pistas, corrección por alternativa y explicación sencilla',()=>{
 const a=science(unlockedData());a.window.setup('Biología');
 const first=a.bank.find(q=>q.id===a.saved().session.ids[0]);
 assert.ok(a.elements.view.innerHTML.includes('Necesito una pista'));
 a.window.hint();a.window.hint();assert.equal(a.saved().session.hint,2);
 a.window.answer(first.answer);a.window.check();
 assert.ok(a.elements.view.innerHTML.includes('¡Cachaste, con una pista!'));
 assert.ok(a.elements.view.innerHTML.includes(first.explanations[first.answer]));
 a.window.changeMode('easy');for(const part of first.teaching?[...first.teaching.intuition,...first.teaching.application]:[first.easy])assert.ok(a.elements.view.innerHTML.includes(part),first.id+' explicación accesible completa');
 a.window.changeMode('example');for(const part of first.teaching?[first.teaching.example.problem,...first.teaching.example.steps,first.teaching.example.bridge]:[first.example])assert.ok(a.elements.view.innerHTML.includes(part),first.id+' ejemplo completo');
 const data=a.saved();assert.equal(data.history.length,1);
 assert.equal(data.history[0].assisted,true);
});
test('Ciencias: otro problema del concepto refuerza sin cerrar el error por un solo acierto',()=>{
 const fixture=unlockedData();const saved=JSON.parse(fixture.get('cachaste-science-v1'));saved.session={mode:'mixto',ids:['SCI-017'],index:0,selected:null,checked:false,results:[],confidence:'duda',hint:0,started:Date.now()};fixture.set('cachaste-science-v1',JSON.stringify(saved));const a=science(fixture);a.window.resume();
 const id=a.saved().session.ids[0],q=a.bank.find(x=>x.id===id),wrong=(q.answer+1)%4;
 a.window.answer(wrong);a.window.check();
 assert.ok(a.saved().pending.includes(id));
 a.window.discard();a.window.setup('errores');
 const ids=a.saved().session.ids;
 assert.ok(ids.length>0);
 assert.ok(!ids.includes(id),'El refuerzo debe usar preguntas diferentes a la fallada');
 assert.ok(ids.every(candidate=>{const item=a.bank.find(x=>x.id===candidate);return item.concept===q.concept}),'El refuerzo debe profundizar en la misma área');
 a.window.answer(a.bank.find(x=>x.id===ids[0]).answer);a.window.check();
 assert.ok(a.saved().pending.includes(id),'Un acierto en otra pregunta no elimina automáticamente el error original');
});
test('Ciencias: la sesión continúa después de cerrar y volver a abrir',()=>{
 const data=unlockedData();const a=science(data);a.window.setup('Química');a.window.hint();
 const before=a.saved().session;const reopened=science(data);
 assert.equal(reopened.saved().session.ids[0],before.ids[0]);
 reopened.window.resume();
 assert.ok(reopened.elements.view.innerHTML.includes('Pista 1 de 2'));
});
test('Ciencias: permite dejar observaciones en Biología sin cambiar respuestas oficiales',()=>{
 const data=unlockedData();const a=science(data);a.window.setup('Biología');
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
 assert.ok(a.elements.view.innerHTML.includes('Ensayo completo · 80 preguntas'));
 assert.ok(!a.data.has('prepara-paes-demo-v1'));
 assert.ok(!a.data.has('prepara-paes-active-exam-v1'));
});

test('Ciencias: 66 comunes y 108 de especialidad para ensayos completos sin duplicados',()=>{
 const a=science(),bank=a.bank;
 assert.equal(bank.filter(q=>q.module==='MC').length,66);
 assert.equal(bank.filter(q=>q.module==='ME').length,108);
 assert.equal(bank.filter(q=>q.examEligible!==false&&q.module==='MTP').length,26);
 assert.equal(bank.length,206);
 assert.equal(new Set(bank.map(q=>q.question)).size,206);
 for(const q of bank){
  assert.ok(q.steps.every(t=>t.length>=15),q.id);
  assert.equal(q.explanations.length,4,q.id);
  assert.ok(q.explanations.every(t=>t.length>15),q.id);
 }
});

test('Ciencias: ensayo completo 80 respeta 54 comunes y 26 mención, sin repeticiones',()=>{
 for(const track of ['Biología','Física','Química','TP']){
  const a=science(unlockedData());a.window.chooseTrack(track);a.window.setup('completo');
  const state=a.saved().session,rows=state.ids.map(id=>a.bank.find(x=>x.id===id));
  assert.equal(rows.length,80);assert.equal(new Set(rows.map(x=>x.id)).size,80);assert.equal(new Set(rows.map(x=>x.transferGroup||x.id)).size,80);
  assert.equal(rows.filter(x=>x.module==='MC').length,54);
  assert.equal(rows.filter(x=>x.module===(track==='TP'?'MTP':'ME')).length,26);
  if(track!=='TP')assert.equal(rows.filter(x=>x.module==='ME'&&x.subject===track).length,26);
  else assert.equal(new Set(rows.filter(x=>x.module==='MTP').map(x=>x.subject)).size,3);
  assert.equal(state.track,track);
  assert.ok(state.deadline-state.started>150*60*1000);
  assert.ok(a.elements.view.innerHTML.includes('80'));
  assert.ok(!a.elements.view.innerHTML.includes('Comprobar respuesta'));
  assert.ok(a.elements.view.innerHTML.includes('Tiempo restante:'));
 }
});
test('Ciencias: modo examen no revela respuestas y al terminar guarda resultados',()=>{
 const a=science(unlockedData());a.window.setup('completo');
 const id=a.saved().session.ids[0],q=a.bank.find(x=>x.id===id);
 a.window.answer((q.answer+1)%4);a.window.check();
 assert.equal(a.saved().session.results.length,0);
 assert.ok(!a.elements.view.innerHTML.includes('Respuesta correcta:'));
 a.window.examAdvance();
 assert.equal(a.saved().session.index,1);
 assert.equal(a.saved().session.results.length,0);
 assert.equal(a.saved().history.length,0);
 assert.equal(a.saved().session.answers[id],(q.answer+1)%4);
 for(let n=1;n<80;n++)a.window.examAdvance(true);
 a.window.examAction('finish');
 assert.equal(a.saved().session??null,null);
 assert.equal(a.saved().history.length,80);
 assert.ok(a.elements.view.innerHTML.includes('Resultados por asignatura'));
});

test('Ciencias: distractores de Biología distinguen mecanismos próximos, no objetos ajenos',()=>{
 const {bank}=science();
 const byStem=part=>bank.find(q=>q.question.includes(part));
 const secretion=byStem('clasificarse y empaquetarse');
 assert.deepEqual(Array.from(secretion.options),['Complejo de Golgi','Retículo endoplasmático rugoso','Ribosomas libres','Lisosomas']);
 const synapse=byStem('espacio sináptico');
 assert.ok(synapse.options.includes('Vesículas sinápticas completas'));
 assert.ok(synapse.options.includes('Receptores de membrana postsinápticos'));
 const reflex=byStem('arco reflejo simple');
 assert.ok(reflex.options.includes('Exigir una decisión consciente antes de cada respuesta'));
 for(const q of [secretion,synapse,reflex])for(let i=0;i<4;i++)if(i!==q.answer)assert.ok(q.explanations[i].length>45,q.id);
});

test('Sistema nervioso PAES 2027: ocho casos nuevos con explicaciones y errores plausibles',()=>{
 const {bank}=science();
 const topics=['dendritas y transmite','mielina intacta','canales de sodio','superficie caliente','entrada de calcio','sueño insuficiente','consume alcohol','presión sobre la piel'];
 for(const stem of topics){
  const q=bank.find(x=>x.question.includes(stem));
  assert.ok(q,'Falta caso: '+stem);
  assert.equal(q.subject,'Biología');
  assert.equal(q.area,'Procesos y funciones biológicas');
  assert.equal(q.module,'ME');
  assert.equal(new Set(q.options).size,4);
  for(let i=0;i<4;i++)assert.ok(q.explanations[i].length>=30,q.id);
 }
});

test('Ciencias migra ensayo anterior sin duplicar intentos ni convertir un error en omisión',()=>{
 const a=science(unlockedData());a.window.setup('completo');const state=a.saved(),session=state.session;
 const rows=session.ids.slice(0,2).map((id,i)=>({id,correct:i===0,unanswered:false,confidence:'sin-declarar',date:'2026-10-13T12:00:0'+i+'Z'}));
 delete session.answers;session.results=rows;session.index=2;state.history=rows;
 const data=new Map([['cachaste-science-v1',JSON.stringify(state)]]),b=science(data);
 b.window.resume();b.window.examAction('finish');const done=b.saved();
 assert.equal(done.history.length,80);assert.equal(done.recent[0].correct,true);assert.equal(done.recent[1].correct,false);assert.equal(done.recent[1].unanswered,false);
});

test('Ciencias: 80 familias caben en todas las menciones incluso con nuevas paráfrasis agrupadas',()=>{for(const track of ['Biología','Física','Química','TP'])for(let trial=0;trial<30;trial++){const a=science(unlockedData());a.window.chooseTrack(track);a.window.setup('completo');const rows=a.saved().session.ids.map(id=>a.bank.find(q=>q.id===id));assert.equal(rows.length,80);assert.equal(new Set(rows.map(q=>q.transferGroup||q.id)).size,80);}});
