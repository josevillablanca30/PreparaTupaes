/* Cachaste Competencia Lectora · tutor sin servidor ni cuentas. */
(function(){
'use strict';
const PASSAGES=window.READING_PASSAGES||[],BANK=window.READING_QUESTIONS||[];
const KEY='cachaste-reading-v1',view=document.getElementById('view'),status=document.getElementById('status');
const skills=['Localizar','Interpretar','Evaluar'];
const stored=(()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return {}}})();
let history=Array.isArray(stored.history)?stored.history.filter(h=>h&&typeof h.correct==='boolean'&&BANK.some(q=>q.id===h.id)).slice(-3000):[];
let pending=Array.isArray(stored.pending)?stored.pending.filter(id=>BANK.some(q=>q.id===id)):[];
let baseline=stored.baseline?.completed&&stored.baseline?.results?.length===30&&stored.baseline.results.every(r=>r&&typeof r.correct==='boolean')?stored.baseline:null;
let session=validSession(stored.session)?stored.session:null;
let recent=Array.isArray(stored.recent)?window.CachasteLearning.cleanRows(BANK,stored.recent,200):[],screen='home',feedbackMode='steps',examMap=false,examConfirm=false;
let assessments=Array.isArray(stored.assessments)?stored.assessments.map(a=>window.CachasteLearning.cleanAssessment(BANK,a)).filter(Boolean).slice(-100):[];
if(session?.mode==='completo'){if(!Number.isFinite(session.deadline))session=null;else{if(!session.answers)session.legacyResults=session.results.slice();session.answers=session.answers||Object.fromEntries(session.results.map(r=>[r.id,r.selected??(r.correct?qBy(r.id).answer:null)]));session.flags=Array.isArray(session.flags)?session.flags.filter(id=>session.ids.includes(id)):[];session.answers=Object.fromEntries(session.ids.map(id=>{const n=session.answers[id];return[id,Number.isInteger(n)&&n>=0&&n<qBy(id).options.length?n:null]}));}}
if(session){session.selected=session.selected??null;session.hint=Number.isInteger(session.hint)?Math.max(0,Math.min(2,session.hint)):0;session.checked=!!session.checked&&session.selected!==null;}
function validSession(s){return window.CachasteLearning.validSession(s,BANK,['diagnostico','express','completo','errores'],65)}
function save(){try{localStorage.setItem(KEY,JSON.stringify({version:2,history,pending,baseline,session,recent,assessments}));return true}catch{if(status)status.textContent='Este dispositivo no permitió guardar. Puedes continuar, pero el avance podría perderse.';return false}}
function esc(t){return String(t??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
function qBy(id){return BANK.find(q=>q.id===id)}
function passageBy(id){return PASSAGES.find(p=>p.id===id)}
function current(){return session?qBy(session.ids[session.index]):null}
function score(q){
 const same=baseline?.results.filter(r=>r.skill===q.skill)||[];
 const weak=same.filter(r=>!r.correct||r.confidence==='azar'||r.confidence==='duda').length;
 const seen=history.filter(h=>h.id===q.id).length;
 // Reforzar errores y respuestas inseguras recientes, sin saturar con la misma pregunta.
 const recent=history.slice(-120).filter(h=>h.id===q.id);
 const needsReview=recent.length&&(!recent[recent.length-1].correct||recent[recent.length-1].confidence!=='seguro');
 return seen*8-weak*2-(needsReview?5:0);
}
function select(count, quotas){
 const chosen=[],seenPassages={};
 for(const skill of skills){
  const pool=BANK.filter(q=>q.skill===skill).map(q=>({q,order:Math.random()}));
  for(let n=0;n<(quotas[skill]||0);n++){
   pool.sort((a,b)=>(score(a.q)+(seenPassages[a.q.passageId]||0)*5)-(score(b.q)+(seenPassages[b.q.passageId]||0)*5)||a.order-b.order);
   const candidate=pool.shift();if(!candidate)break;
   chosen.push(candidate.q);seenPassages[candidate.q.passageId]=(seenPassages[candidate.q.passageId]||0)+1;
  }
 }
 if(chosen.length!==count)throw Error('Banco insuficiente para '+count+' preguntas');
 // Lectura real: las preguntas de un mismo texto aparecen juntas para evitar cambios de contexto.
 const groups=new Map();
 for(const q of chosen){if(!groups.has(q.passageId))groups.set(q.passageId,[]);groups.get(q.passageId).push(q)}
 return [...groups.values()].flat();
}
function begin(mode){
 if(session){notice('Tienes una sesión guardada. Retómala o descártala antes de comenzar otra.');screen='home';render();return;}
 if(mode==='completo'&&!baseline){notice('Completa primero el diagnóstico de 30 preguntas.');return}
 if(mode==='express'&&!baseline){notice('Completa primero el diagnóstico de 30 preguntas.');return}
 const quotas=mode==='diagnostico'?{Localizar:10,Interpretar:12,Evaluar:8}:mode==='express'?{Localizar:3,Interpretar:4,Evaluar:3}:{Localizar:23,Interpretar:26,Evaluar:16};
 let pool;
 if(mode==='errores')pool=window.CachasteLearning?window.CachasteLearning.transfer(BANK,history,[...recent,...history.slice(-30)],10):BANK.filter(q=>pending.some(id=>qBy(id)?.skill===q.skill)&&!pending.includes(q.id)&&!history.some(h=>h.id===q.id)).slice(0,10);
 else if(mode==='completo'){
  const eligible=PASSAGES.filter(p=>BANK.filter(q=>q.passageId===p.id).length>=9);
  // DEMRE specifies 7 texts / 65 questions. Five blocks of 9 and two of 10.
  const blocks=eligible.sort((a,b)=>BANK.filter(q=>q.passageId===b.id).length-BANK.filter(q=>q.passageId===a.id).length).slice(0,7);
  pool=blocks.flatMap((p,i)=>BANK.filter(q=>q.passageId===p.id).slice(0,i<2?10:9));
  if(blocks.length!==7||pool.length!==65){notice('El banco no permite construir siete textos completos.');return;}
 }else pool=select(mode==='diagnostico'?30:10,quotas);
 if(!pool.length){notice('Por ahora no tienes preguntas pendientes para reforzar.');return}
 session={mode,ids:pool.map(q=>q.id),index:0,selected:null,checked:false,confidence:'duda',hint:0,results:[],answers:{},flags:[],deadline:mode==='completo'?Date.now()+150*60*1000:null,started:Date.now()};
 feedbackMode='steps';screen='quiz';save();render(true);
}
function notice(t){if(status)status.textContent=t}
function choose(n){if(!session||session.checked||!Number.isInteger(n)||n<0||n>3)return;if(session.mode==='completo'&&Date.now()>=session.deadline){finish();return}session.selected=n;if(session.mode==='completo')session.answers[current().id]=n;save();render()}
function confidence(n){if(!session||session.checked||!['seguro','duda','azar'].includes(n))return;session.confidence=n;save();render()}
function hint(){if(!session||session.checked||session.mode!=='express'||session.hint>=2)return;session.hint++;save();render()}
function check(){
 if(!session||session.mode==='completo'||session.checked||session.selected===null)return;
 session.checked=true;save();render();
}
function advance(skip=false){
 if(!session)return;
 if(session.mode==='completo'){if(skip){session.selected=null;session.answers[current().id]=null;session.explicitlyOmitted=[...new Set([...(session.explicitlyOmitted||[]),current().id])];}if(session.index===session.ids.length-1){examConfirm=true;save();render();}else examJump(session.index+1);return;}
 const q=current();
 if(session.mode!=='completo'&&!session.checked)return;
 if(session.mode==='completo'&&session.selected===null&&!skip)return;
 // Omitir debe registrar una respuesta en blanco incluso si había una alternativa marcada.
 const answer=skip?null:session.selected;
 const record={id:q.id,passageId:q.passageId,skill:q.skill,concept:q.concept,selected:answer,correct:answer!==null&&answer===q.answer,confidence:answer===null?'sin-declarar':session.confidence,assisted:session.hint>0,unanswered:answer===null,at:new Date().toISOString()};
 session.results.push(record);
 history.push(record);history=history.slice(-3000);
 if(!record.correct&&!pending.includes(q.id))pending.push(q.id);
 if(record.correct&&!record.assisted&&record.confidence==='seguro')pending=pending.filter(x=>x!==q.id);
 if(window.CachasteLearning){const proved=new Set(window.CachasteLearning.profile(BANK,history).filter(p=>p.status==='comprobado').map(p=>p.concept));pending=pending.filter(id=>!proved.has(qBy(id).concept));}
 if(session.index===session.ids.length-1){finish();return}
 session.index++;session.selected=null;session.checked=false;session.hint=0;session.confidence='duda';feedbackMode='steps';save();render(true);
}
function finish(){
 if(!session)return;
 const done=session;
 if(done.mode==='completo'){
  const legacy=done.legacyResults||[],oldTail=history.slice(-legacy.length);if(legacy.length&&oldTail.length===legacy.length&&legacy.every((r,i)=>r.id===oldTail[i].id&&r.at&&r.at===oldTail[i].at&&r.correct===oldTail[i].correct))history=history.slice(0,-legacy.length);
  done.results=done.ids.map(id=>{const q=qBy(id),n=done.answers[id]??null,old=legacy.find(r=>r.id===id),unknownOld=n===null&&old&&!old.correct&&!old.unanswered&&!done.explicitlyOmitted?.includes(id);return {id,passageId:q.passageId,skill:q.skill,concept:q.concept,selected:n,correct:n!==null&&n===q.answer,confidence:'sin-declarar',assisted:false,unanswered:n===null&&!unknownOld,at:old?.at||new Date().toISOString()}});
  history.push(...done.results);history=history.slice(-3000);
  for(const r of done.results)if(!r.correct&&!pending.includes(r.id))pending.push(r.id);
 }
 assessments.push({id:'reading-'+Date.now(),mode:done.mode,at:new Date().toISOString(),results:done.results.slice(),correct:done.results.filter(r=>r.correct).length,total:done.results.length});assessments=assessments.slice(-100);
 examMap=false;examConfirm=false;
 recent=done.results.slice();
 if(done.mode==='diagnostico'&&done.results.length===30)baseline={completed:true,results:done.results.slice(),at:new Date().toISOString()};
 session=null;screen='result';save();render(true);
}
function resume(){if(!session)return;if(session.mode==='completo'&&session.deadline&&Date.now()>=session.deadline){finish();return}screen='quiz';render(true)}
function back(){screen='home';save();render(true)}
function discard(){if(screen!=='discard'){screen='discard';render(true);return}session=null;screen='home';save();render(true)}
function showResult(){screen='result';render(true)}
function setExplanation(m){if(!['steps','easy','example'].includes(m))return;feedbackMode=m;render()}
function timeLeft(){if(!session?.deadline)return '';const secs=Math.max(0,Math.ceil((session.deadline-Date.now())/1000));return String(Math.floor(secs/3600)).padStart(2,'0')+':'+String(Math.floor(secs%3600/60)).padStart(2,'0')+':'+String(secs%60).padStart(2,'0')}
function weakness(){
 if(!baseline)return [];
 return skills.map(skill=>{
  const rows=baseline.results.filter(r=>r.skill===skill);
  return {skill,count:rows.length,correct:rows.filter(r=>r.correct).length,unsure:rows.filter(r=>r.confidence==='duda'||r.confidence==='azar'||r.assisted).length};
 }).sort((a,b)=>a.correct/a.count-b.correct/b.count||b.unsure-a.unsure);
}
function past(id){const a=assessments.find(a=>a.id===id);if(a){recent=a.results;screen='result';render(true)}}
function historyCards(){return '<div class="card"><h2>Historial de sesiones</h2>'+assessments.slice().reverse().map(a=>'<button class="history-item" onclick="readingPast(&quot;'+esc(a.id)+'&quot;)">'+esc(a.mode)+' · '+a.correct+'/'+a.total+' · '+esc(new Date(a.at).toLocaleDateString('es-CL'))+'</button>').join('')+'</div>'}
function reviewResults(rows){return '<div class="card"><h2>Revisa y comprende tus respuestas</h2>'+rows.map((r,n)=>{const q=qBy(r.id);return '<details class="review"><summary>'+(n+1)+'. '+(r.correct?'Correcta':r.unanswered?'En blanco':'Por reforzar')+' · '+esc(q.question)+'</summary><p><b>Tu respuesta:</b> '+esc(Number.isInteger(r.selected)?q.options[r.selected]:r.unanswered?'En blanco':'No registrada en esta versión anterior')+'</p><p><b>Respuesta correcta:</b> '+esc(q.options[q.answer])+'</p>'+(Number.isInteger(r.selected)?'<p>'+esc(q.explanations[r.selected])+'</p>':'')+'<h3>Paso a paso</h3>'+window.CachasteLearning.lesson(q,'steps')+'<h3>Más fácil</h3>'+window.CachasteLearning.lesson(q,'easy')+'<h3>Con un ejemplo</h3>'+window.CachasteLearning.lesson(q,'example')+'<details><summary>Volver al texto</summary>'+passageBy(q.passageId).paragraphs.map(x=>'<p>'+esc(x)+'</p>').join('')+'</details></details>'}).join('')+'</div>'}
function overview(){
 const blocks=skills.map(x=>{const rows=history.filter(h=>h.skill===x);return '<div class="skill-summary"><div class="row"><b>'+esc(x)+'</b><span>'+rows.filter(r=>r.correct).length+' / '+rows.length+' aciertos</span></div><div class="bar"><div style="width:'+(rows.length?rows.filter(r=>r.correct).length/rows.length*100:0)+'%"></div></div></div>'}).join('');
 return '<div class="card"><h2>Tu progreso lector</h2>'+blocks+'<p class="small">Estos resultados describen ejercicios formativos, no equivalen a un puntaje PAES oficial.</p></div>';
}
function home(){
 const completed=!!baseline;
 const route='<div class="card"><span class="eyebrow">TU RUTA</span><h2>Tres formas de prepararte</h2><div class="choices">'+
 '<article class="choice"><div class="row"><h3>Diagnóstico</h3><span class="pill">30 preguntas</span></div><p>'+(completed?'Puedes repetirlo para actualizar tus necesidades.':'Empieza aquí. Detectaremos si necesitas ayuda para localizar, interpretar o evaluar información.')+'</p><button class="btn" onclick="readingBegin(&quot;diagnostico&quot;)">'+(completed?'Repetir diagnóstico de 30':'Comenzar diagnóstico de 30')+'</button></article>'+
 '<article class="choice"><div class="row"><h3>Express</h3><span class="pill">10 preguntas</span></div><p>Practica con textos variados y prioridad en la habilidad que más te cuesta.</p><button class="btn secondary" onclick="readingBegin(&quot;express&quot;)" '+(!completed?'disabled':'')+'>Express · 10 preguntas</button></article>'+
 '<article class="choice"><div class="row"><h3>Ensayo completo</h3><span class="pill">65 preguntas · 150 min</span></div><p>Siete textos y una prueba formativa con textos literarios y no literarios, respuestas sin corrección inmediata y cronómetro.</p><button class="btn secondary" onclick="readingBegin(&quot;completo&quot;)" '+(!completed?'disabled':'')+'>Ensayo · 65 preguntas</button></article>'+
 '</div>'+(!completed?'<p class="small">Primero completa el diagnóstico para desbloquear Express y el ensayo completo.</p>':'')+'</div>';
 const recommend=completed?'<div class="card"><span class="eyebrow">PARA APRENDER MEJOR</span><h2>Lo que te conviene practicar</h2><p>Consideramos aciertos, errores y respuestas con dudas o al azar; acertar sin seguridad no significa dominar.</p>'+weakness().map(x=>'<p class="weak"><strong>'+esc(x.skill)+'</strong> · '+x.correct+' de '+x.count+' correctas · '+x.unsure+' con dudas o al azar.</p>').join('')+'<p class="small">Express dará prioridad a estas habilidades, conservando siempre las tres.</p></div>':'';
 return '<span class="eyebrow">PAES · COMPETENCIA LECTORA</span><h1>Leer, comprender y descubrir.</h1><p>Textos originales con preguntas que te enseñan a encontrar evidencias, interpretar ideas y evaluar argumentos.</p>'+
 (session?'<div class="card notice"><h2>Tu práctica está guardada</h2><p>Pregunta '+(session.index+1)+' de '+session.ids.length+'. Continúa cuando quieras.</p><div class="actions"><button class="btn" onclick="readingResume()">Continuar práctica</button><button class="btn secondary" onclick="readingDiscard()">Descartar</button></div></div>':'')+
 route+recommend+overview()+historyCards()+(pending.length?'<div class="card"><h2>Tienes '+pending.length+' preguntas para reforzar</h2><button class="btn secondary" onclick="readingBegin(&quot;errores&quot;)">Repasar errores</button></div>':'')+
 '<p class="small">La PAES Regular de Competencia Lectora contempla 65 preguntas y 2 horas 30 minutos. El contenido de Cachaste es propio y no reemplaza materiales oficiales.</p>';
}
function feedback(q){
 const correct=session.selected===q.answer;
 const intro=correct?(session.hint?'¡Bien! Lo resolviste con una pista.':'¡Cachaste! Bien por encontrar la evidencia.'):'No resultó esta vez. Mira cómo se resuelve.';
 const details=window.CachasteLearning.lesson(q,feedbackMode);
 return '<div class="feedback '+(correct?'right':'wrong')+'" role="status"><strong>'+intro+'</strong><p><b>Elegiste: '+esc(q.options[session.selected])+'</b></p><p>'+esc(q.explanations[session.selected])+'</p><p><b>Respuesta correcta: '+String.fromCharCode(65+q.answer)+') '+esc(q.options[q.answer])+'</b></p></div>'+
 '<h3>Te lo explico de otra forma</h3><div class="tabs">'+[['steps','Paso a paso'],['easy','Más fácil'],['example','Con un ejemplo']].map(([key,label])=>'<button class="'+(feedbackMode===key?'active':'')+'" onclick="readingExplanation(&quot;'+key+'&quot;)">'+label+'</button>').join('')+'</div><div class="explanation">'+details+'</div>';
}
function examJump(n){if(!session||session.mode!=='completo'||!Number.isInteger(n)||n<0||n>=session.ids.length)return;if(Date.now()>=session.deadline){finish();return}session.index=n;session.selected=session.answers[current().id]??null;examConfirm=false;save();render(true)}
function examAction(action){if(!session||session.mode!=='completo')return;if(action==='map')examMap=!examMap;else if(action==='flag'){const id=current().id;session.flags=session.flags.includes(id)?session.flags.filter(x=>x!==id):[...session.flags,id]}else if(action==='submit'){finish();return}else if(action==='continue')examConfirm=false;save();render()}
function quiz(){
 if(examConfirm)return '<section class="card"><h1>¿Entregar tu ensayo?</h1><p>'+Object.values(session.answers).filter(n=>n!==null).length+' de 65 respuestas guardadas. Las preguntas en blanco se registrarán como no respondidas.</p><button class="btn" onclick="readingExamAction(&quot;submit&quot;)">Entregar ensayo</button><button class="btn secondary" onclick="readingExamAction(&quot;continue&quot;)">Seguir revisando</button></section>';
 const q=current();if(!q)return '<div class="card">No encontramos la pregunta. <button class="btn" onclick="readingBack()">Volver</button></div>';
 const p=passageBy(q.passageId),exam=session.mode==='completo',count=session.ids.length;
 const passageMarkup='<details class="passage" open><summary><span>Texto '+esc(p.id)+' · '+esc(p.type)+'</span><b>'+esc(p.title)+'</b></summary><article aria-label="Texto de lectura: '+esc(p.title)+'">'+p.paragraphs.map((line,n)=>'<p><span class="paragraph-number" aria-hidden="true">'+(n+1)+'.</span> '+esc(line)+'</p>').join('')+'</article></details>';
 const opts=q.options.map((item,n)=>'<button class="option '+(session.selected===n?'chosen':'')+'" aria-pressed="'+(session.selected===n)+'" '+(session.checked?'disabled':'')+' onclick="readingChoose('+n+')">'+String.fromCharCode(65+n)+') '+esc(item)+'</button>').join('');
 const confidencePanel=!exam&&!session.checked?'<fieldset class="confidence"><legend>¿Qué tan seguro estás?</legend><div class="confchoices">'+[['seguro','Lo tengo claro'],['duda','Tengo dudas'],['azar','Fue al azar']].map(([key,label])=>'<button class="'+(session.confidence===key?'active':'')+'" aria-pressed="'+(session.confidence===key)+'" onclick="readingConfidence(&quot;'+key+'&quot;)">'+label+'</button>').join('')+'</div></fieldset>':'';
 const hints=!exam&&session.mode==='express'&&!session.checked?'<div class="hint-zone"><button class="btn soft" '+(session.hint===2?'disabled':'')+' onclick="readingHint()">'+(session.hint===0?'Necesito una pista':session.hint===1?'Dame otra pista':'Ya tienes dos pistas')+'</button>'+(session.hint?'<p class="hint"><strong>Pista '+session.hint+' de 2.</strong> '+esc(q.steps[0])+(session.hint===2?' '+esc(q.steps[1]):'')+'</p>':'')+'</div>':'';
 const review=session.checked&&!exam?feedback(q):'';
 const nextButton=exam?'<div class="actions"><button class="btn secondary" '+(session.index===0?'disabled':'')+' onclick="readingExamJump('+(session.index-1)+')">Anterior</button><button class="btn" onclick="readingAdvance()">'+(session.index===count-1?'Revisar entrega':'Guardar y continuar →')+'</button><button class="btn secondary" onclick="readingAdvance(true)">'+'Omitir pregunta →'+'</button></div>':session.checked?'<button class="btn" onclick="readingAdvance()">'+(session.index===count-1?'Ver mi resultado':'Siguiente pregunta →')+'</button>':'<button class="btn" '+(session.selected===null?'disabled':'')+' onclick="readingCheck()">Comprobar respuesta</button>';
 return '<div class="row progress-top"><span class="eyebrow">'+(exam?'ENSAYO COMPLETO':session.mode==='diagnostico'?'DIAGNÓSTICO':'PRÁCTICA LECTORA')+'</span><span class="pill">'+(session.index+1)+' / '+count+'</span></div><div class="bar"><div style="width:'+((session.index+1)/count*100)+'%"></div></div>'+
 (exam?'<div class="exam-top"><p class="timer" role="timer" id="reading-timer">Tiempo restante: '+timeLeft()+'</p><button class="btn secondary" onclick="readingExamAction(&quot;map&quot;)">Mapa de preguntas</button><button class="btn secondary" onclick="readingExamAction(&quot;flag&quot;)">'+(session.flags.includes(q.id)?'Desmarcar':'Marcar para revisar')+'</button></div>'+(examMap?'<nav class="question-map" aria-label="Preguntas del ensayo">'+session.ids.map((id,n)=>'<button class="'+(session.answers[id]!=null?'answered ':'')+(session.flags.includes(id)?'flagged':'')+'" onclick="readingExamJump('+n+')" aria-current="'+(n===session.index?'step':'false')+'">'+(n+1)+'</button>').join('')+'</nav>':''):'')+
 passageMarkup+'<section class="card question"><span class="eyebrow">'+esc(q.skill)+'</span><h2>'+esc(q.question)+'</h2><div class="answers">'+opts+'</div>'+hints+confidencePanel+review+nextButton+'</section>';
}
function diagnosticReport(rows){
 if(!rows?.length)return '';
 const examResult=rows.every(r=>r.confidence==='sin-declarar');
 const explain={Localizar:'Busca datos explícitos y comprueba exactamente en qué parte del texto aparecen.',Interpretar:'Relaciona ideas, identifica causas y consecuencias y fundamenta inferencias con pistas del texto.',Evaluar:'Distingue hechos de opiniones, examina la intención del autor y contrasta la evidencia con la conclusión.'};
 const groups=skills.map(skill=>{const a=rows.filter(x=>x.skill===skill);return {skill,total:a.length,correct:a.filter(x=>x.correct).length,secure:a.filter(x=>x.correct&&(examResult||x.confidence==='seguro')&&!x.assisted).length,unsure:a.filter(x=>x.confidence==='duda'||x.confidence==='azar'||x.assisted).length}}).filter(x=>x.total).sort((a,b)=>a.secure/a.total-b.secure/b.total);
 const card=g=>'<div class="skill-summary"><strong>'+esc(g.skill)+'</strong><p>'+g.correct+' de '+g.total+' correctas · '+g.secure+(examResult?' sin pistas · ':' seguras · ')+g.unsure+' con dudas o ayuda.</p><p>'+esc(explain[g.skill])+'</p><p>'+(g.secure/g.total>=.75?'Fortaleza: aumenta la dificultad y cambia de tipo de texto.':'Prioridad: practica esta habilidad con otros textos y preguntas nuevas; no memorices la alternativa anterior.')+'</p></div>';
 return '<div class="card">'+(examResult?'<p class="small">El ensayo no recoge autoconfianza. Un buen resultado orienta tu práctica; confirma el aprendizaje en otras preguntas.</p>':'')+'<span class="eyebrow">DIAGNÓSTICO LECTOR</span><h2>Lo que ya haces bien</h2>'+(groups.filter(x=>x.secure/x.total>=.75).map(card).join('')||'<p>Todavía no hay una habilidad suficientemente consolidada en esta muestra.</p>')+'<h2>Lo que necesitas mejorar</h2>'+(groups.filter(x=>x.secure/x.total<.75).map(card).join('')||'<p>No aparecen debilidades claras; continúa con textos nuevos.</p>')+'<h2>Plan recomendado</h2><p>1. Revisa la habilidad menos segura. 2. Aprende cómo se encuentra la evidencia. 3. Resuelve preguntas diferentes con textos nuevos. 4. Explica con tus palabras por qué descartas cada alternativa.</p><p class="small">Diagnóstico formativo: no representa un puntaje PAES ni certifica dominio definitivo.</p></div>';
}
function result(){
 const list=recent,good=list.filter(x=>x.correct).length;
 const report=skills.map(sk=>{const rows=list.filter(x=>x.skill===sk),right=rows.filter(x=>x.correct).length;return '<div class="skill-summary"><div class="row"><b>'+esc(sk)+'</b><span>'+right+' / '+rows.length+'</span></div><div class="bar"><div style="width:'+(rows.length?right/rows.length*100:0)+'%"></div></div></div>'}).join('');
 return '<span class="eyebrow">RESULTADOS DE LECTURA</span><h1>'+good+' de '+list.length+' respuestas correctas</h1><p>Más que una nota: aquí descubrirás qué habilidad debes seguir entrenando.</p><div class="card"><h2>Tu desempeño por habilidad</h2>'+report+
 '<p class="small">Los resultados no corresponden a una escala ni puntaje PAES oficial.</p><div class="actions"><button class="btn" onclick="readingBack()">Volver a mi preparación</button><button class="btn secondary" onclick="readingBegin(&quot;errores&quot;)" '+(!pending.length?'disabled':'')+'>Reforzar lo que costó</button></div></div>'+diagnosticReport(list)+reviewResults(list);
}
function render(top=false){
 if(session?.mode==='completo'&&screen==='quiz'&&session.deadline&&Date.now()>=session.deadline){finish();return}
 if(!view)return;
 view.innerHTML=screen==='discard'?'<div class="card"><h1>¿Descartar esta sesión?</h1><p>Las respuestas ya registradas se conservan en tu progreso; este recorrido pendiente se cerrará.</p><button class="btn" onclick="readingDiscard()">Sí, descartar</button><button class="btn secondary" onclick="readingBack()">Conservar sesión</button></div>':screen==='home'?home():screen==='quiz'?quiz():result();
 if(top&&window.scrollTo)window.scrollTo(0,0);
}
window.readingExamJump=examJump;window.readingExamAction=examAction;window.readingPast=past;window.readingBegin=begin;window.readingChoose=choose;window.readingConfidence=confidence;window.readingHint=hint;
window.readingCheck=check;window.readingAdvance=advance;window.readingResume=resume;window.readingDiscard=discard;window.readingBack=back;window.readingExplanation=setExplanation;
window.cachasteNativeBack=function(){if(screen!=='home'){back();return true}return false};
if(typeof setInterval==='function')setInterval(()=>{if(screen==='quiz'&&session?.deadline){if(Date.now()>=session.deadline){finish();return}const el=document.getElementById('reading-timer');if(el)el.textContent='Tiempo restante: '+timeLeft()}},1000);
if(window.addEventListener)window.addEventListener('pagehide',save);
render();
})();