import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];
function app(saved = '[]', failSave = false, savedSession = null) {
  const element = { innerHTML: '' };
  const keys = new Map([['prepara-paes-demo-v1',saved]]);
  if(savedSession) keys.set('prepara-paes-active-exam-v1',savedSession);
  const context = vm.createContext({
    document: { getElementById: () => element },
    window: { scrollTo() {} },
    localStorage: { getItem: key => keys.get(key) ?? null, setItem: (key, value) => {
      if (failSave) throw new Error('Storage blocked');
      keys.set(key, value);
    }, removeItem: key => keys.delete(key) }
  });
  vm.runInContext(source, context);
  return code => vm.runInContext(code, context);
}

test('diagnóstico: calcula solamente las respuestas de la ronda actual', () => {
  const run = app(JSON.stringify([{ id: 1, correct: false }]));
  run("start('diagnostico'); for(let n=0;n<5;n++){choice=queue[i].answer;check();next()}");
  assert.equal(run('page'), 'result');
  assert.match(run('result()'), /5 de 5 correctas/);
  assert.equal(run('history.length'), 6);
});
test('no registra respuestas vacías ni duplicadas', () => {
  const run = app();
  run("start('rapida');check()");
  assert.equal(run('history.length'), 0);
  run('choice=2;check();check()');
  assert.equal(run('history.length'), 1);
});
test('almacenamiento bloqueado: permite terminar y muestra el aviso', () => {
  const run = app('[]', true);
  run("start('rapida'); for(let n=0;n<3;n++){choice=queue[i].answer;check();next()}");
  assert.equal(run('page'), 'result');
  assert.equal(run('round.length'), 3);
  assert.equal(run('storageAvailable'), false);
});
test('datos dañados: conserva registros válidos y normaliza sus etiquetas', () => {
  const run = app('[null,{"id":1,"correct":true,"skill":"<img src=x>"},{"id":99,"correct":false}]');
  assert.equal(run('history.length'), 1);
  assert.equal(run('history[0].skill'), 'Porcentajes');
  for (const value of ['{}', 'null', 'invalid']) assert.equal(app(value)('history.length'), 0);
});
test('repaso: prioriza la habilidad con respuesta incorrecta', () => {
  const run = app('[{"id":4,"correct":false},{"id":1,"correct":true}]');
  run("start('repaso')");
  assert.equal(run('queue[0].id'), 4);
  assert.equal(run('queue.length'), 3);
});
test('nueva ronda: reinicia alternativa, confianza y explicación', () => {
  const run = app();
  run("start('diagnostico');choice=0;confidence='azar';check();mode='easy';navigate('home');start('rapida')");
  assert.equal(run('choice'), null);
  assert.equal(run('confidence'), 'duda');
  assert.equal(run('mode'), 'steps');
  assert.equal(run('round.length'), 0);
});

test('variantes: cada habilidad prioritaria tiene una pregunta nueva con solución válida', () => {
  const run=app();
  assert.equal(run('variants.length'),3);
  assert.equal(run('variants.every(v=>v.answer>=0&&v.answer<v.options.length&&v.steps.length>=2)'),true);
  run("start('diagnostico');choice=0;check();startVariant()");
  assert.equal(run('queue[0].id'),101);
  assert.equal(run('page'),'quiz');
  assert.equal(run('checked'),false);
});
test('simulacro: no muestra corrección, admite omisiones y corrige al finalizar', () => {
  const run=app();
  run('startExam()');
  assert.equal(run('exam'),true);
  assert.equal(run('quiz().includes("Respuesta correcta")'),false);
  run('examMove(1);examMove(-1)');
  assert.equal(run('i'),0);
  run('choice=2;examAnswers[0]=2;examMove(1);examMove(1);examMove(1);examMove(1);examMove(1)');
  assert.equal(run('page'),'result');
  assert.equal(run('round.length'),5);
  assert.equal(run('round.filter(x=>x.unanswered).length'),4);
  assert.equal(run('round.filter(x=>x.correct).length'),1);
});

test('ensayo express contiene diez preguntas originales distintas', () => {
  const run=app();
  run("startExam('express')");
  assert.equal(run('queue.length'),10);
  assert.equal(run('new Set(queue.map(q=>q.id)).size'),10);
  assert.equal(run('quiz().includes("Respuesta correcta:")'),false);
});
test('resultado de ensayo ofrece repaso de habilidades falladas', () => {
  const run=app();
  run("startExam('express');for(let j=0;j<10;j++){examMove(1)}");
  assert.equal(run('round.length'),10);
  assert.match(run('result()'),/Revisar mis errores/);
  run('reviewErrors()');
  assert.equal(run('queue.length'),10);
  assert.equal(run('exam'),false);
});

test('comprobación de aprendizaje usa otra pregunta de la misma habilidad', () => {
 const run=app();
 run("startExam();for(let n=0;n<5;n++){examAnswers[n]=queue[n].answer;};examAnswers[0]=0;for(let n=0;n<5;n++)examMove(1)");
 const before=run('round.filter(x=>!x.correct).map(x=>x.id)');
 run('verifyLearning()');
 const after=run('queue.map(x=>x.id)');
 assert.equal(run('exam'),true);
 assert.equal(run('queue.length')>0,true);
 assert.equal(after.some(id=>before.includes(id)),false);
 assert.equal(run('quiz().includes("Respuesta correcta:")'),false);
});

test('ensayo Express ofrece transferencia solamente cuando hay ejercicios distintos', () => {
 const run=app();
 run("startExam('express');for(let n=0;n<10;n++)examMove(1)");
 assert.equal(run('round.length'),10);
 const available=run('round.some(h=>catalog.some(v=>v.skill===h.skill&&!round.some(r=>r.id===v.id)))');
 assert.equal(run('result().includes("Comprobar si aprendí")'),available);
});
test('tras fallar solo porcentajes, ofrece comprobación con otra pregunta', () => {
 const run=app();
 run("startExam();for(let n=0;n<5;n++){examAnswers[n]=queue[n].answer;};examAnswers[0]=0;for(let n=0;n<5;n++)examMove(1)");
 assert.equal(run('round.filter(x=>!x.correct).length'),1);
 assert.equal(run('result().includes("Comprobar si aprendí")'),true);
 run('verifyLearning()');
 assert.equal(run('queue.length'),1);
 assert.notEqual(run('queue[0].id'),1);
});

test('geometría y estadística: seis ejercicios originales con soluciones completas', () => {
 const run=app();
 assert.equal(run('expansion.length'),6);
 assert.equal(run('expansion.filter(q=>q.skill==="Geometría").length'),3);
 assert.equal(run('expansion.filter(q=>q.skill==="Estadística").length'),3);
 assert.equal(run('expansion.every(q=>q.answer>=0 && q.answer<q.options.length && q.explanations.length===q.options.length && q.steps.length>=2)'),true);
 run("start('geodatos')");
 assert.equal(run('queue.length'),6);
 assert.equal(run('queue[0].id'),106);
 assert.equal(run('home().includes("Geometría y Estadística")'),true);
});

test('Express equilibra habilidades y admite combinaciones distintas', () => {
 const run=app();
 for(let k=0;k<15;k++){
  run("startExam('express')");
  assert.equal(run('queue.length'),10);
  assert.equal(run('new Set(queue.map(q=>q.id)).size'),10);
  assert.equal(run('new Set(queue.map(q=>axisOf(q))).size'),4);
  assert.equal(run('queue.filter(q=>axisOf(q)==="Geometría").length'),2);
  assert.equal(run('queue.filter(q=>axisOf(q)==="Probabilidad y estadística").length'),2);
 }
});

test('desafíos aplicados: cuatro problemas M1 completos y seleccionables',()=>{
 const run=app();
 assert.equal(run('challenges.length'),4);
 assert.equal(run('challenges.every(q=>q.answer>=0&&q.answer<q.options.length&&q.explanations.length===4&&q.steps.length>=3)'),true);
 run("start('desafios')");
 assert.equal(run('queue.length'),4);
 assert.equal(run('queue[0].id'),112);
 assert.equal(run('home().includes("Desafíos aplicados")'),true);
});

test('banco M1 ampliado: 100 ítems íntegros, respuestas válidas y ejes trazables',()=>{
 const run=app();
 assert.equal(run('catalog.length'),100);
 assert.equal(run('new Set(catalog.map(q=>q.id)).size'),100);
 assert.equal(run('catalog.every(q=>q.options.length===4&&new Set(q.options).size===4&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4&&q.explanations.length===4&&q.steps.length>=2&&q.easy&&q.example)'),true);
 assert.equal(run('new Set(catalog.map(q=>axisOf(q))).size'),4);
});
test('simulacro completo: 65 preguntas únicas, cuota de ejes y 140 minutos',()=>{
 const run=app();
 run("startExam('full')");
 assert.equal(run('queue.length'),65);
 assert.equal(run('new Set(queue.map(q=>q.id)).size'),65);
 assert.equal(run('queue.filter(q=>axisOf(q)==="Números").length'),16);
 assert.equal(run('queue.filter(q=>axisOf(q)==="Álgebra y funciones").length'),19);
 assert.equal(run('queue.filter(q=>axisOf(q)==="Geometría").length'),15);
 assert.equal(run('queue.filter(q=>axisOf(q)==="Probabilidad y estadística").length'),15);
 assert.equal(run('examDeadline-Date.now() > 139*60*1000'),true);
 assert.equal(run('examQuiz(queue[0]).includes("Tiempo restante")'),true);
 run('examMove(1)');
 const saved=run('localStorage.getItem(sessionKey)');
 assert.equal(JSON.parse(saved).index,1);
 const resumed=app('[]',false,saved);
 resumed('resumeSavedExam()');
 assert.equal(resumed('queue.length'),65);
 assert.equal(resumed('i'),1);
 assert.equal(resumed('examDeadline> Date.now()'),true);
 run('finishExam()');
 assert.equal(run('round.length'),65);
 assert.equal(run('page'),'result');
 assert.equal(run('localStorage.getItem(sessionKey)'),null);
});

test('práctica por eje usa ocho ejercicios de contenido ampliado',()=>{
 const run=app();
 for(const [mode,axis] of [['numeros','Números'],['algebra','Álgebra y funciones'],['geometria','Geometría'],['estadistica','Probabilidad y estadística']]){
  run("start('"+mode+"')");
  assert.equal(run('queue.length'),8);
  assert.equal(run('queue.every(q=>axisOf(q)==="'+axis+'")'),true);
 }
 assert.equal(run('home().includes("¿Qué quieres reforzar hoy?")'),true);
});
test('repaso adaptativo busca en las 100 preguntas, no solamente en las cinco iniciales',()=>{
 const run=app('[{"id":245,"correct":false}]');
 run("start('repaso')");
 assert.equal(run('queue[0].id'),245);
});

test('simulacro completo: dificultad formativa ascendente por bloques',()=>{
 const run=app();
 for(let k=0;k<12;k++){
  run("startExam('full')");
  assert.equal(run('queue.every((q,i)=>i===0||difficultyOrder(queue[i-1])<=difficultyOrder(q))'),true);
  assert.equal(run('queue.some(q=>difficultyOf(q)==="desafío")'),true);
  assert.equal(run('new Set(queue.map(q=>q.id)).size'),65);
 }
});
test('simulacro 65: marcar, recuperar y revisar antes de entregar',()=>{
 const run=app();
 run("startExam('full');toggleExamFlag();toggleExamOverview()");
 assert.equal(run('examFlags.length'),1);
 assert.equal(run('examQuiz(queue[i]).includes("Mapa del ensayo")'),true);
 const saved=run('localStorage.getItem(sessionKey)');
 const resumed=app('[]',false,saved);
 resumed('resumeSavedExam()');
 assert.equal(resumed('examFlags.length'),1);
 resumed('jumpExamQuestion(64);examMove(1)');
 assert.equal(resumed('examConfirming'),true);
 assert.equal(resumed('examQuiz(queue[i]).includes("Revisa tu simulacro")'),true);
 assert.equal(resumed('page'), 'quiz');
 resumed('finishExam()');
 assert.equal(resumed('page'),'result');
 assert.equal(resumed('round.length'),65);
});

test('estadísticas: un acierto de ensayo no se confunde con una respuesta con dudas',()=>{
 const run=app('[{"id":1,"correct":true,"confidence":"sin-declarar"}]');
 const row=run('skillInsights().find(x=>x.skill==="Porcentajes")');
 assert.equal(row.uncertain,0);
 assert.equal(row.essayCorrect,1);
 assert.equal(row.confident,0);
 assert.equal(run('progress().includes("1 aciertos en ensayo")'),true);
});
test('cronómetro permanece visible en el resumen previo a entregar',()=>{
 const run=app();
 run("startExam('full');jumpExamQuestion(64);examMove(1)");
 assert.equal(run('examConfirming'),true);
 assert.equal(run('examReviewScreen().includes("Tiempo restante")'),true);
});

test('preguntas visuales: 16 diagramas originales accesibles',()=>{
 const run=app();
 assert.equal(run('visualBankA.length+visualBankB.length+visualBankC.length'),16);
 assert.equal(run('catalog.length'),100);
 assert.equal(run('catalog.filter(q=>q.visual).length'),16);
 assert.equal(run('catalog.filter(q=>q.visual).every(q=>renderVisual(q).includes("role="))'),true);
 assert.equal(run('catalog.filter(q=>q.visual).every(q=>renderVisual(q).includes("<figcaption>"))'),true);
 run("start('visuales')");
 assert.equal(run('queue.length'),8);
 assert.equal(run('queue.every(q=>q.visual)'),true);
 assert.equal(run('new Set(queue.map(q=>axisOf(q))).size'),4);
 assert.equal(run('quiz().includes("<svg")'),true);
});
test('tutor: las pistas no cuentan como dominio independiente',()=>{
 const run=app();
 run("start('diagnostico');requestHint();requestHint();choice=queue[i].answer;confidence='seguro';check()");
 assert.equal(run('hintStage'),2);
 assert.equal(run('history.at(-1).assisted'),true);
 assert.equal(run('skillInsights().find(x=>x.skill==="Porcentajes").confident'),0);
 assert.equal(run('skillInsights().find(x=>x.skill==="Porcentajes").assisted'),1);
 assert.equal(run('quiz().includes("Lo lograste con una pista")'),true);
 run('next()');
 assert.equal(run('hintStage'),0);
});
test('ensayos no muestran pistas incluso con contenido visual',()=>{
 const run=app();
 run("startExam('full')");
 assert.equal(run('examQuiz(queue[i]).includes("Necesito una pista")'),false);
 run('requestHint()');
 assert.equal(run('hintStage'),0);
});
test('repaso reinicia la ronda y registra solamente sus respuestas nuevas',()=>{
 const run=app();
 run("startExam();for(let j=0;j<5;j++)examMove(1)");
 assert.equal(run('round.length'),5);
 run('reviewErrors()');
 assert.equal(run('round.length'),0);
 assert.equal(run('queue.length'),5);
 run('choice=queue[i].answer;check()');
 assert.equal(run('round.length'),1);
});
test('comprobación de aprendizaje usa ejercicios distintos y reinicia el resultado',()=>{
 const run=app();
 run("startExam();for(let j=0;j<5;j++)examMove(1)");
 const ids=run('round.map(x=>x.id)');
 run('verifyLearning()');
 assert.equal(run('exam'),true);
 assert.equal(run('round.length'),0);
 assert.equal(run('queue.every(q=>!'+JSON.stringify(ids)+'.includes(q.id))'),true);
 assert.equal(run('examAnswers.length'),run('queue.length'));
});
