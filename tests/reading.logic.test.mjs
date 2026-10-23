import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const bankSrc=readFileSync(new URL('../reading-bank.js',import.meta.url),'utf8');
const appSrc=readFileSync(new URL('../reading-app.js',import.meta.url),'utf8');
function reading(data=new Map()){
 const elements={view:{innerHTML:''},status:{textContent:''}};
 const win={scrollTo(){}};
 const document={getElementById:k=>elements[k]||null};
 const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 const cx=vm.createContext({window:win,document,localStorage:storage,console});
 vm.runInContext(readFileSync(new URL('../learning-core.js',import.meta.url),'utf8'),cx);vm.runInContext(bankSrc,cx);vm.runInContext(appSrc,cx);
 return {win,elements,data,items:win.READING_QUESTIONS,passages:win.READING_PASSAGES,get:()=>JSON.parse(data.get('cachaste-reading-v1')||'{}')};
}
function finishDiagnosis(a,wrong=0){
 a.win.readingBegin('diagnostico');
 for(let n=0;n<30;n++){
  const ses=a.get().session,q=a.items.find(x=>x.id===ses.ids[ses.index]);
  a.win.readingChoose(n<wrong?(q.answer+1)%4:q.answer);
  if(n===3)a.win.readingConfidence('azar');
  a.win.readingCheck();a.win.readingAdvance();
 }
}
test('Lectura: 20 textos originales y 130 preguntas únicas con tres habilidades',()=>{
 const a=reading();assert.equal(a.passages.length,20);assert.equal(a.items.length,130);
 assert.equal(new Set(a.items.map(x=>x.id)).size,130);
 assert.equal(new Set(a.items.map(x=>x.question)).size,130);
 for(const p of a.passages){assert.ok(p.paragraphs.length>=2);assert.ok(p.paragraphs.join(' ').length>500);}
 const distribution={};
 for(const q of a.items){
  distribution[q.skill]=(distribution[q.skill]||0)+1;
  assert.ok(a.passages.some(p=>p.id===q.passageId),q.id);
  assert.equal(q.options.length,4,q.id);
  assert.equal(new Set(q.options).size,4,q.id);
  assert.ok(q.explanations.every(s=>s.length>25),q.id);
  assert.ok(q.steps.length>=2,q.id);
  assert.ok(q.answer>=0&&q.answer<4,q.id);
 }
 assert.equal(distribution.Localizar,45);
 assert.equal(distribution.Interpretar,53);
 assert.equal(distribution.Evaluar,32);
});
test('Lectura: ensayo directo y diagnóstico independiente de 30 distribuye 10/12/8',()=>{
 const a=reading();a.win.readingBegin('express');
 assert.equal(a.get().session??null,null);
 a.win.readingBegin('completo');
 assert.equal(a.get().session.ids.length,65);
 a.win.readingDiscard();a.win.readingDiscard();
 a.win.readingBegin('diagnostico');
 const q=a.get().session.ids.map(id=>a.items.find(x=>x.id===id));
 assert.equal(q.length,30);assert.equal(new Set(q.map(x=>x.id)).size,30);
 assert.equal(q.filter(x=>x.skill==='Localizar').length,10);
 assert.equal(q.filter(x=>x.skill==='Interpretar').length,12);
 assert.equal(q.filter(x=>x.skill==='Evaluar').length,8);
 assert.ok(a.elements.view.innerHTML.includes('Texto'));
 assert.ok(!a.elements.view.innerHTML.includes('¿Qué tan seguro estás?'));
});
test('Lectura: responde sin pistas ni declaración de seguridad',()=>{
 const a=reading();a.win.readingBegin('diagnostico');
 assert.ok(!a.elements.view.innerHTML.includes('Necesito una pista'));
 const ses=a.get().session,q=a.items.find(x=>x.id===ses.ids[0]);
 a.win.readingConfidence('azar');a.win.readingChoose(q.answer);a.win.readingCheck();a.win.readingAdvance();
 assert.equal(a.get().history[0].confidence,'no-declarada');
 assert.equal(a.get().history[0].correct,true);
 assert.equal(a.get().history[0].assisted,false);
});
test('Lectura: completar diagnóstico genera recomendaciones y habilita Express',()=>{
 const a=reading();finishDiagnosis(a,8);
 assert.equal(a.get().baseline.results.length,30);
 assert.equal(a.get().history.length,30);
 a.win.readingBack();
 assert.ok(a.elements.view.innerHTML.includes('Lo que te conviene practicar'));
 a.win.readingBegin('express');
 const arr=a.get().session.ids.map(id=>a.items.find(x=>x.id===id));
 assert.equal(arr.length,10);assert.equal(new Set(arr.map(q=>q.id)).size,10);
 assert.equal(arr.filter(q=>q.skill==='Localizar').length,3);
 assert.equal(arr.filter(q=>q.skill==='Interpretar').length,4);
 assert.equal(arr.filter(q=>q.skill==='Evaluar').length,3);
});
test('Lectura: práctica Express permite pistas y explicación sin inflar confianza',()=>{
 const a=reading();finishDiagnosis(a);a.win.readingBegin('express');
 const q=a.items.find(x=>x.id===a.get().session.ids[0]);
 a.win.readingHint();assert.equal(a.get().session.hint,1);
 a.win.readingChoose(q.answer);a.win.readingCheck();
 assert.ok(a.elements.view.innerHTML.includes('Te lo explico de otra forma'));
 a.win.readingExplanation('easy');for(const part of q.teaching?[...q.teaching.intuition,...q.teaching.application]:[q.easy])assert.ok(a.elements.view.innerHTML.includes(part),q.id+' explicación accesible y aplicación completas');
 a.win.readingAdvance();
 assert.equal(a.get().history.at(-1).assisted,true);
});
test('Lectura: sesión de diagnóstico se recupera tras reiniciar',()=>{
 const data=new Map(),a=reading(data);a.win.readingBegin('diagnostico');
 a.win.readingChoose(1);a.win.readingConfidence('seguro');
 const b=reading(data);
 assert.equal(b.get().session.index,0);
 b.win.readingResume();
 assert.ok(b.elements.view.innerHTML.includes('1 / 30'));
 assert.equal(b.get().session.selected,1);
 assert.equal(b.get().session.confidence,'seguro');
});
test('Lectura: ensayo de 65 preguntas completas sin retroalimentación anticipada y con temporizador',()=>{
 const a=reading();finishDiagnosis(a);a.win.readingBegin('completo');
 const session=a.get().session,ids=session.ids.map(id=>a.items.find(q=>q.id===id));
 assert.equal(ids.length,65);assert.equal(new Set(ids.map(x=>x.id)).size,65);
 assert.ok(session.deadline>session.started);
 assert.ok(a.elements.view.innerHTML.includes('Tiempo restante'));
 assert.ok(!a.elements.view.innerHTML.includes('Necesito una pista'));
 const q=ids[0];a.win.readingChoose(q.answer);
 assert.ok(!a.elements.view.innerHTML.includes('Respuesta correcta:'));
 a.win.readingAdvance();
 assert.equal(a.get().session.index,1);
});
test('Lectura: repaso persistente y progreso separados de M1 y Ciencias',()=>{
 const data=new Map(),a=reading(data);finishDiagnosis(a,12);
 const ids=a.get().pending;assert.ok(ids.length<=12); // Puede quedar vacío si el diagnóstico acredita los conceptos con respuestas independientes.const proved=new Set(a.win.CachasteLearning.profile(a.items,a.get().history).filter(p=>p.status==='comprobado').map(p=>p.concept));assert.ok(ids.every(id=>!proved.has(a.items.find(q=>q.id===id).concept)));
 a.win.readingBegin('errores');
 assert.ok(a.get().session.ids.length<=10);
 const b=reading(data);
 assert.equal(b.get().pending.length,ids.length);
 assert.equal(b.get().baseline.completed,true);
 assert.ok(!data.has('cachaste-science-v1'));
 assert.ok(!data.has('prepara-paes-demo-v1'));
});

test('Lectura: tutor identifica el distractor y la evidencia textual',()=>{
 const a=reading();
 for(const q of a.items){
  assert.ok(q.explanations[q.answer].includes('¡Cachaste!'),q.id);
  for(let i=0;i<4;i++)if(i!==q.answer){
   assert.ok(q.explanations[i].includes(q.options[i]),q.id+' distractor '+i);
   assert.ok(q.explanations[i].includes(q.options[q.answer]),q.id+' respuesta');
  }
 }
});
test('Lectura: omitir con alternativa marcada no cuenta como acierto',()=>{
 const a=reading();finishDiagnosis(a);
 a.win.readingBegin('completo');
 const first=a.get().session.ids[0],q=a.items.find(x=>x.id===first);
 a.win.readingChoose(q.answer);
 a.win.readingAdvance(true);
 assert.equal(a.get().session.results.length,0);
 assert.equal(a.get().session.answers[first],null);
 a.win.readingExamAction('submit');
 const rec=a.get().recent[0];
 assert.equal(rec.unanswered,true);
 assert.equal(rec.correct,false);
 assert.equal(rec.confidence,'sin-declarar');
});

test('Lectura: distractores del primer texto son pertinentes y no absurdos',()=>{
 const a=reading();
 const first=a.items.filter(q=>q.passageId==='T01');
 assert.equal(first.length,10);
 const banned=['reparación de vehículos','Color de los estantes','La camioneta había dejado de funcionar','Todos los días'];
 for(const q of first)for(const option of q.options)for(const phrase of banned)assert.ok(!option.includes(phrase),q.id+' '+phrase);
 assert.ok(first.every(q=>q.explanations.filter((_,i)=>i!==q.answer).every(x=>x.length>35)));
 assert.ok(new Set(first[0].explanations).size===4);
});

test('Lectura migra respuestas anteriores sin duplicar historial y conserva los aciertos',()=>{
 const a=reading();finishDiagnosis(a);a.win.readingBegin('completo');const state=a.get(),session=state.session;
 const rows=session.ids.slice(0,2).map((id,i)=>({id,correct:i===0,unanswered:false,confidence:'sin-declarar',at:'2026-10-13T12:00:0'+i+'Z'}));
 delete session.answers;session.results=rows;session.index=2;state.history.push(...rows);
 const b=reading(new Map([['cachaste-reading-v1',JSON.stringify(state)]]));b.win.readingResume();b.win.readingExamAction('submit');const done=b.get();
 assert.equal(done.history.length,95);assert.equal(done.recent[0].correct,true);assert.equal(done.recent[1].unanswered,false);
});

test('Lectura conserva versión y pasaje en diagnóstico y ensayo',()=>{
 const a=reading();finishDiagnosis(a);
 assert.ok(a.get().history.every(r=>r.assessmentVersion===a.win.CachasteLearning.assessmentVersion(a.items.find(q=>q.id===r.id))));
 a.win.readingBegin('completo');a.win.readingExamAction('submit');
 assert.ok(a.get().recent.every(r=>r.assessmentVersion===a.win.CachasteLearning.assessmentVersion(a.items.find(q=>q.id===r.id))));
});
