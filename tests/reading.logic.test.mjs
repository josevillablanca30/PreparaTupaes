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
 vm.runInContext(bankSrc,cx);vm.runInContext(appSrc,cx);
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
test('Lectura: 18 textos originales y 90 preguntas únicas con tres habilidades',()=>{
 const a=reading();assert.equal(a.passages.length,18);assert.equal(a.items.length,90);
 assert.equal(new Set(a.items.map(x=>x.id)).size,90);
 assert.equal(new Set(a.items.map(x=>x.question)).size,75);
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
 assert.equal(distribution.Localizar,33);
 assert.equal(distribution.Interpretar,36);
 assert.equal(distribution.Evaluar,21);
});
test('Lectura: diagnóstico obligatorio de 30 distribuye 10/12/8',()=>{
 const a=reading();a.win.readingBegin('express');
 assert.equal(a.get().session??null,null);
 a.win.readingBegin('completo');
 assert.equal(a.get().session??null,null);
 a.win.readingBegin('diagnostico');
 const q=a.get().session.ids.map(id=>a.items.find(x=>x.id===id));
 assert.equal(q.length,30);assert.equal(new Set(q.map(x=>x.id)).size,30);
 assert.equal(q.filter(x=>x.skill==='Localizar').length,10);
 assert.equal(q.filter(x=>x.skill==='Interpretar').length,12);
 assert.equal(q.filter(x=>x.skill==='Evaluar').length,8);
 assert.ok(a.elements.view.innerHTML.includes('Texto'));
 assert.ok(a.elements.view.innerHTML.includes('¿Qué tan seguro estás?'));
});
test('Lectura: responde sin pistas en diagnóstico y guarda autoconfianza',()=>{
 const a=reading();a.win.readingBegin('diagnostico');
 assert.ok(!a.elements.view.innerHTML.includes('Necesito una pista'));
 const ses=a.get().session,q=a.items.find(x=>x.id===ses.ids[0]);
 a.win.readingConfidence('azar');a.win.readingChoose(q.answer);a.win.readingCheck();a.win.readingAdvance();
 assert.equal(a.get().history[0].confidence,'azar');
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
 a.win.readingExplanation('easy');assert.ok(a.elements.view.innerHTML.includes(q.easy));
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
 const ids=a.get().pending;assert.ok(ids.length>=12);
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
 const rec=a.get().session.results[0];
 assert.equal(rec.unanswered,true);
 assert.equal(rec.correct,false);
 assert.equal(rec.confidence,'sin-declarar');
});
