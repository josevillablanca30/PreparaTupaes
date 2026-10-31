import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];
function app(saved = '[]', failSave = false, savedSession = null, savedReview = null, savedDiagnostic = null, savedMathDraft = null) {
  const element = { innerHTML: '' };
  const keys = new Map([['prepara-paes-demo-v1',saved]]);
  if(savedSession) keys.set('prepara-paes-active-exam-v1',savedSession);
  if(savedReview) keys.set('cachaste-m1-pending-review-v1',savedReview);
  if(savedDiagnostic) keys.set('cachaste-m1-diagnostic-30-v1',savedDiagnostic);
  if(savedMathDraft) keys.set('cachaste-m1-diagnostic-draft-v1',savedMathDraft);
  const context = vm.createContext({
    document: { getElementById: () => element },
    window: { scrollTo() {} },
    localStorage: { getItem: key => keys.get(key) ?? null, setItem: (key, value) => {
      if (failSave) throw new Error('Storage blocked');
      keys.set(key, value);
    }, removeItem: key => keys.delete(key) }
  });
  vm.runInContext(readFileSync(new URL('../learning-core.js',import.meta.url),'utf8'),context);
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
  run("start('diagnostico');choice=0;confidence='azar';check();mode='easy';navigate('home');discardMath();start('rapida')");
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
 assert.equal(run('queue.length'),10);
 assert.equal(run('queue.every(q=>q.skill==="Porcentajes"&&q.id!==1)'),true);
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

test('banco M1 ampliado: 116 ítems íntegros, respuestas válidas y ejes trazables',()=>{
 const run=app();
 assert.equal(run('catalog.length'),116);
 assert.equal(run('new Set(catalog.map(q=>q.id)).size'),116);
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
 assert.equal(run('home().includes("Refuerzo y otras prácticas")'),true);
});
test('repaso adaptativo busca en las 116 preguntas, no solamente en las cinco iniciales',()=>{
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
 assert.equal(run('catalog.length'),116);
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
 assert.equal(run('queue.length'),10);
 assert.equal(run('queue.every(q=>!pendingReview.includes(q.id))'),true);
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

test('errores de simulacro largo: 65 pendientes sobreviven al cierre',()=>{
 const run=app();
 run("startExam('full');finishExam()");
 assert.equal(run('pendingReview.length'),65);
 assert.equal(run('home().includes("Continuar mi repaso")'),true);
 const saved=run('localStorage.getItem(reviewKey)');
 const opened=app('[]',false,null,saved);
 assert.equal(opened('pendingReview.length'),65);
 opened('reviewPending()');
 assert.equal(opened('queue.length'),10);
 assert.equal(opened('round.length'),0);
 assert.equal(opened('pendingReview.length'),65);
});
test('refuerzo con pistas usa otros ítems sin acreditar dominio',()=>{
 const run=app();run("startExam('full');finishExam();reviewPending()");
 const first=run('queue.map(q=>q.id)');
 assert.equal(run('queue.every(q=>!pendingReview.includes(q.id))'),true);
 run("for(let j=0;j<10;j++){requestHint();choice=queue[i].answer;check();next()}");
 assert.equal(run('pendingReview.length'),65);
 run('reviewPending()');
 assert.equal(run('queue.every(q=>!'+JSON.stringify(first)+'.includes(q.id))'),true);
});
test('un acierto con pistas no sustituye dos evidencias independientes y seguras',()=>{
 const run=app();run("start('rapida');choice=0;check();reviewPending();requestHint();choice=queue[i].answer;check()");
 assert.equal(run('history.at(-1).assisted'),true);
 assert.equal(run('pendingReview.length'),1);
 run("reviewPending();choice=queue[i].answer;confidence='seguro';check()");
 assert.equal(run('pendingReview.length'),1);
});
test('progreso móvil organizado por los cuatro ejes y habilidades plegadas',()=>{
 const run=app('[{"id":1,"correct":true,"confidence":"seguro"}]');
 const page=run('progress()');
 assert.equal((page.match(/class="axis-progress"/g)||[]).length,4);
 assert.match(page,/Tu mapa por eje/);
 assert.match(page,/Ver detalle de 1 habilidad practicada/);
 assert.match(page,/role="progressbar"/);
 assert.equal(page.includes('1 respuesta registrada'),true);
 assert.equal(page.includes('Practicar Números'),true);
});

test('recuperación robusta: no reanuda ensayos vacíos o con IDs duplicados',()=>{
 const empty=app('[]',false,JSON.stringify({ids:[],answers:[],index:0}));
 assert.equal(empty('resumeExam'),null);
 assert.equal(empty('home().includes("Continuar ensayo")'),false);
 const duplicated=app('[]',false,JSON.stringify({ids:[1,1],answers:[null,null],index:0}));
 assert.equal(duplicated('resumeExam'),null);
});
test('repaso corrupto: descarta IDs inexistentes y cursor inválido',()=>{
 const run=app('[]',false,null,JSON.stringify({ids:[1,2,999999,1],cursor:'Infinity'}));
 assert.equal(run('pendingReview.length'),2);
 assert.equal(run('reviewCursor'),0);
 run('reviewPending()');
 assert.equal(run('queue.length'),10);
 assert.equal(run('queue.every(q=>![1,2].includes(q.id))'),true);
});

test('16 desafíos de argumentar detectan errores conceptuales de cuatro ejes',()=>{
 const run=app();
 assert.equal(run('reasoningBank.length'),16);
 assert.equal(run('reasoningBank.every(q=>q.habilidadPAES==="Argumentar"&&q.explanations.length===4&&q.steps.length>=2)'),true);
 assert.equal(run('new Set(reasoningBank.map(q=>q.id)).size'),16);
 run("start('argumentar')");
 assert.equal(run('queue.length'),8);
 assert.equal(run('queue.every(q=>q.habilidadPAES==="Argumentar")'),true);
 for(const eje of ['Números','Álgebra y funciones','Geometría','Probabilidad y estadística'])
  assert.equal(run('queue.filter(q=>q.axis==="'+eje+'").length'),2);
 assert.equal(run('home().includes("Detectar errores y razonar")'),true);
});
test('simulacro 65 incorpora preguntas originales de argumentación sin salirse del temario',()=>{
 const run=app();
 for(let j=0;j<12;j++){
  run("startExam('full')");
  assert.equal(run('queue.length'),65);
  assert.equal(run('queue.some(q=>q.habilidadPAES==="Argumentar")'),true);
 }
});

test('diagnóstico integral abarca los cuatro ejes y 12 preguntas sin repetir',()=>{
 const run=app();
 for(let repeat=0;repeat<8;repeat++){
  run("start('diagnosticoIntegral')");
  assert.equal(run('queue.length'),12);
  assert.equal(run('new Set(queue.map(q=>q.id)).size'),12);
  for(const axis of ['Números','Álgebra y funciones','Geometría','Probabilidad y estadística']){
   assert.equal(run('queue.filter(q=>axisOf(q)==="'+axis+'").length'),3);
  }
  assert.equal(run('queue.every((q,i)=>i===0||difficultyOrder(queue[i-1])<=difficultyOrder(q))'),true);
 }
 assert.equal(run('home().includes("Diagnóstico integral M1")'),true);
});
test('diagnóstico integral produce resultados comparables por eje',()=>{
 const run=app();
 run("start('diagnosticoIntegral');for(let j=0;j<12;j++){choice=queue[i].answer;check();next()}");
 assert.equal(run('page'),'result');
 assert.equal(run('round.length'),12);
 assert.equal(run('result().includes("Tu desempeño por eje")'),true);
 assert.equal(run('round.filter(x=>x.correct).length'),12);
});

test('nuevo diagnóstico M1: 30 preguntas distintas y los cuatro ejes',()=>{
 const run=app();run("start('diagnostico30')");
 assert.equal(run('queue.length'),30);
 assert.equal(run('new Set(queue.map(q=>q.id)).size'),30);
 for(const [axis,total] of [['Números',8],['Álgebra y funciones',8],['Geometría',7],['Probabilidad y estadística',7]]) {
  assert.equal(run('queue.filter(q=>axisOf(q)==='+JSON.stringify(axis)+').length'),total);
 }
 assert.equal(run('home().includes("Comenzar diagnóstico de 30")'),true);
 assert.equal(run('home().includes("disabled")'),true);
});
test('M1: finalizar diagnóstico desbloquea Express y produce plan persistente',()=>{
 const run=app();run("start('diagnostico30')");
 run("for(let n=0;n<30;n++){choice=queue[i].answer;confidence=n%2===0?'seguro':'azar';check();next()}");
 assert.equal(run('page'),'result');
 assert.equal(run('mathDiagnostic.results.length'),30);
 assert.equal(run('mathReady()'),true);
 assert.equal(run('mathWeakAxes().length'),4);
 const saved=run('localStorage.getItem(mathDiagnosticKey)');
 const reopened=app('[]',false,null,null,saved);
 assert.equal(reopened('mathDiagnostic.completed'),true);
 assert.equal(reopened('home().includes("Repetir diagnóstico de 30")'),true);
 assert.equal(reopened('home().includes("Esto conviene reforzar primero")'),true);
});

test('M1: diagnóstico de 30 reanuda pregunta, historial y autoconfianza',()=>{
 const run=app();run("start('diagnostico30');for(let n=0;n<9;n++){choice=queue[i].answer;check();next()}");
 assert.equal(run('i'),9);
 assert.equal(run('round.length'),9);
 run("confidence='azar';choice=2;draw()");
 const draft=run('localStorage.getItem(mathDraftKey)');
 const reopened=app('[]',false,null,null,null,draft);
 assert.equal(reopened('savedMathDraft.index'),9);
 assert.equal(reopened('home().includes("Continuar práctica guardada")'),true);
 reopened('resumeMathDiagnosis()');
 assert.equal(reopened('queue.length'),30);
 assert.equal(reopened('round.length'),9);
 assert.equal(reopened('confidence'),'azar');
 assert.equal(reopened('choice'),2);
});

test('M1 protege la sesión guardada al intentar iniciar otra desde inicio',()=>{
 const run=app();run("start('diagnostico30');choice=1;confidence='azar';draw();navigate('home')");
 const before=run('localStorage.getItem(mathDraftKey)');
 run("startExam('full')");assert.equal(run('localStorage.getItem(mathDraftKey)'),before);assert.equal(run('exam'),false);
 run('requestDiscardMath()');assert.equal(run('page'),'discard');run("navigate('home');resumeMathDiagnosis()");assert.equal(run('choice'),1);assert.equal(run('confidence'),'azar');
});

test('M1 guarda versión en práctica y ensayo sin cambiar el índice elegido',()=>{
 const run=app();run("start('rapida');choice=0;check()");
 assert.equal(run('history.at(-1).assessmentVersion'),run('window.CachasteLearning.assessmentVersion(queue[i])'));
 assert.equal(run('history.at(-1).selected'),0);
 const exam=app();exam("startExam('express');finishExam()");
 assert.equal(exam('history.every(r=>r.assessmentVersion===window.CachasteLearning.assessmentVersion(catalog.find(q=>q.id===r.id)))'),true);
});
