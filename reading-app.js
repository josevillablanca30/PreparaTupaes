/* Cachaste Competencia Lectora · tutor sin servidor ni cuentas. */
(function(){
'use strict';
const PASSAGES=window.READING_PASSAGES||[],BANK=window.READING_QUESTIONS||[];
const KEY='cachaste-reading-v1',view=document.getElementById('view'),status=document.getElementById('status');
const skills=['Localizar','Interpretar','Evaluar'];
const stored=(()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return {}}})();
let history=Array.isArray(stored.history)?stored.history.filter(h=>BANK.some(q=>q.id===h.id)).slice(-3000):[];
let pending=Array.isArray(stored.pending)?stored.pending.filter(id=>BANK.some(q=>q.id===id)):[];
let baseline=stored.baseline?.completed&&stored.baseline?.results?.length===30?stored.baseline:null;
let session=validSession(stored.session)?stored.session:null;
let recent=Array.isArray(stored.recent)?stored.recent:[],screen='home',feedbackMode='steps';
function validSession(s){return s&&Array.isArray(s.ids)&&s.ids.length>=1&&s.ids.length<=65&&new Set(s.ids).size===s.ids.length&&s.ids.every(id=>BANK.some(q=>q.id===id))&&s.index>=0&&s.index<s.ids.length&&Array.isArray(s.results)&&['diagnostico','express','completo','errores'].includes(s.mode)}
function save(){try{localStorage.setItem(KEY,JSON.stringify({history,pending,baseline,session,recent}));return true}catch{if(status)status.textContent='Este dispositivo no permitió guardar. Puedes continuar, pero el avance podría perderse.';return false}}
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
 if(mode==='completo'&&!baseline){notice('Completa primero el diagnóstico de 30 preguntas.');return}
 if(mode==='express'&&!baseline){notice('Completa primero el diagnóstico de 30 preguntas.');return}
 const quotas=mode==='diagnostico'?{Localizar:10,Interpretar:12,Evaluar:8}:mode==='express'?{Localizar:3,Interpretar:4,Evaluar:3}:{Localizar:23,Interpretar:26,Evaluar:16};
 let pool=mode==='errores'?BANK.filter(q=>pending.includes(q.id)).slice(0,10):select(mode==='diagnostico'?30:mode==='express'?10:65,quotas);
 if(!pool.length){notice('Por ahora no tienes preguntas pendientes para reforzar.');return}
 session={mode,ids:pool.map(q=>q.id),index:0,selected:null,checked:false,confidence:'duda',hint:0,results:[],deadline:mode==='completo'?Date.now()+150*60*1000:null,started:Date.now()};
 feedbackMode='steps';screen='quiz';save();render(true);
}
function notice(t){if(status)status.textContent=t}
function choose(n){if(!session||session.checked||!Number.isInteger(n)||n<0||n>3)return;session.selected=n;save();render()}
function confidence(n){if(!session||session.checked||!['seguro','duda','azar'].includes(n))return;session.confidence=n;save();render()}
function hint(){if(!session||session.checked||session.mode!=='express'||session.hint>=2)return;session.hint++;save();render()}
function check(){
 if(!session||session.checked||session.selected===null)return;
 session.checked=true;save();render();
}
function advance(skip=false){
 if(!session)return;
 const q=current();
 if(session.mode!=='completo'&&!session.checked)return;
 if(session.mode==='completo'&&session.selected===null&&!skip)return;
 // Omitir debe registrar una respuesta en blanco incluso si había una alternativa marcada.
 const answer=skip?null:session.selected;
 const record={id:q.id,passageId:q.passageId,skill:q.skill,correct:answer!==null&&answer===q.answer,confidence:answer===null?'sin-declarar':session.confidence,assisted:session.hint>0,unanswered:answer===null,at:new Date().toISOString()};
 session.results.push(record);
 history.push(record);history=history.slice(-3000);
 if(!record.correct&&!pending.includes(q.id))pending.push(q.id);
 if(record.correct&&!record.assisted&&record.confidence==='seguro')pending=pending.filter(x=>x!==q.id);
 if(session.index===session.ids.length-1){finish();return}
 session.index++;session.selected=null;session.checked=false;session.hint=0;session.confidence='duda';feedbackMode='steps';save();render(true);
}
function finish(){
 if(!session)return;
 const done=session;
 // Al agotarse los 150 minutos, incluir preguntas pendientes como no respondidas.
 if(done.mode==='completo'&&done.results.length<done.ids.length){
  for(let i=done.results.length;i<done.ids.length;i++){
   const q=qBy(done.ids[i]);
   const skipped={id:q.id,passageId:q.passageId,skill:q.skill,correct:false,confidence:'sin-declarar',assisted:false,unanswered:true,at:new Date().toISOString()};
   done.results.push(skipped);history.push(skipped);
   if(!pending.includes(q.id))pending.push(q.id);
  }
  history=history.slice(-3000);
 }
 recent=done.results.slice();
 if(done.mode==='diagnostico'&&done.results.length===30)baseline={completed:true,results:done.results.slice(),at:new Date().toISOString()};
 session=null;screen='result';save();render(true);
}
function resume(){if(!session)return;if(session.mode==='completo'&&session.deadline&&Date.now()>=session.deadline){finish();return}screen='quiz';render(true)}
function back(){screen='home';save();render(true)}
function discard(){session=null;screen='home';save();render(true)}
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
function overview(){
 const blocks=skills.map(x=>{const rows=history.filter(h=>h.skill===x);return '<div class="skill-summary"><div class="row"><b>'+esc(x)+'</b><span>'+rows.filter(r=>r.correct).length+' / '+rows.length+' aciertos</span></div><div class="bar"><div style="width:'+(rows.length?rows.filter(r=>r.correct).length/rows.length*100:0)+'%"></div></div></div>'}).join('');
 return '<div class="card"><h2>Tu progreso lector</h2>'+blocks+'<p class="small">Estos resultados describen ejercicios formativos, no equivalen a un puntaje PAES oficial.</p></div>';
}
function home(){
 const completed=!!baseline;
 const route='<div class="card"><span class="eyebrow">TU RUTA</span><h2>Tres formas de prepararte</h2><div class="choices">'+
 '<article class="choice"><div class="row"><h3>Diagnóstico</h3><span class="pill">30 preguntas</span></div><p>'+(completed?'Puedes repetirlo para actualizar tus necesidades.':'Empieza aquí. Detectaremos si necesitas ayuda para localizar, interpretar o evaluar información.')+'</p><button class="btn" onclick="readingBegin(&quot;diagnostico&quot;)">'+(completed?'Repetir diagnóstico de 30':'Comenzar diagnóstico de 30')+'</button></article>'+
 '<article class="choice"><div class="row"><h3>Express</h3><span class="pill">10 preguntas</span></div><p>Practica con textos variados y prioridad en la habilidad que más te cuesta.</p><button class="btn secondary" onclick="readingBegin(&quot;express&quot;)" '+(!completed?'disabled':'')+'>Express · 10 preguntas</button></article>'+
 '<article class="choice"><div class="row"><h3>Ensayo completo</h3><span class="pill">65 preguntas · 150 min</span></div><p>Una prueba formativa con textos literarios y no literarios, respuestas sin corrección inmediata y cronómetro.</p><button class="btn secondary" onclick="readingBegin(&quot;completo&quot;)" '+(!completed?'disabled':'')+'>Ensayo · 65 preguntas</button></article>'+
 '</div>'+(!completed?'<p class="small">Primero completa el diagnóstico para desbloquear Express y el ensayo completo.</p>':'')+'</div>';
 const recommend=completed?'<div class="card"><span class="eyebrow">PARA APRENDER MEJOR</span><h2>Lo que te conviene practicar</h2><p>Consideramos aciertos, errores y respuestas con dudas o al azar; acertar sin seguridad no significa dominar.</p>'+weakness().map(x=>'<p class="weak"><strong>'+esc(x.skill)+'</strong> · '+x.correct+' de '+x.count+' correctas · '+x.unsure+' con dudas o al azar.</p>').join('')+'<p class="small">Express dará prioridad a estas habilidades, conservando siempre las tres.</p></div>':'';
 return '<span class="eyebrow">PAES · COMPETENCIA LECTORA</span><h1>Leer, comprender y descubrir.</h1><p>Textos originales con preguntas que te enseñan a encontrar evidencias, interpretar ideas y evaluar argumentos.</p>'+
 (session?'<div class="card notice"><h2>Tu práctica está guardada</h2><p>Pregunta '+(session.index+1)+' de '+session.ids.length+'. Continúa cuando quieras.</p><div class="actions"><button class="btn" onclick="readingResume()">Continuar práctica</button><button class="btn secondary" onclick="readingDiscard()">Descartar</button></div></div>':'')+
 route+recommend+overview()+(pending.length?'<div class="card"><h2>Tienes '+pending.length+' preguntas para reforzar</h2><button class="btn secondary" onclick="readingBegin(&quot;errores&quot;)">Repasar errores</button></div>':'')+
 '<p class="small">La PAES Regular de Competencia Lectora contempla 65 preguntas y 2 horas 30 minutos. El contenido de Cachaste es propio y no reemplaza materiales oficiales.</p>';
}
function feedback(q){
 const correct=session.selected===q.answer;
 const intro=correct?(session.hint?'¡Bien! Lo resolviste con una pista.':'¡Cachaste! Bien por encontrar la evidencia.'):'No resultó esta vez. Mira cómo se resuelve.';
 const details=feedbackMode==='steps'?'<ol>'+q.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol>':feedbackMode==='easy'?'<p>'+esc(q.easy)+'</p>':'<p>'+esc(q.example)+'</p>';
 return '<div class="feedback '+(correct?'right':'wrong')+'" role="status"><strong>'+intro+'</strong><p>'+esc(q.explanations[session.selected])+'</p><p><b>Respuesta correcta: '+String.fromCharCode(65+q.answer)+') '+esc(q.options[q.answer])+'</b></p></div>'+
 '<h3>Te lo explico de otra forma</h3><div class="tabs">'+[['steps','Paso a paso'],['easy','Más fácil'],['example','Con un ejemplo']].map(([key,label])=>'<button class="'+(feedbackMode===key?'active':'')+'" onclick="readingExplanation(&quot;'+key+'&quot;)">'+label+'</button>').join('')+'</div><div class="explanation">'+details+'</div>';
}
function quiz(){
 const q=current();if(!q)return '<div class="card">No encontramos la pregunta. <button class="btn" onclick="readingBack()">Volver</button></div>';
 const p=passageBy(q.passageId),exam=session.mode==='completo',count=session.ids.length;
 const passageMarkup='<details class="passage" open><summary><span>Texto '+esc(p.id)+' · '+esc(p.type)+'</span><b>'+esc(p.title)+'</b></summary><article aria-label="Texto de lectura: '+esc(p.title)+'">'+p.paragraphs.map((line,n)=>'<p><span class="paragraph-number" aria-hidden="true">'+(n+1)+'.</span> '+esc(line)+'</p>').join('')+'</article></details>';
 const opts=q.options.map((item,n)=>'<button class="option '+(session.selected===n?'chosen':'')+'" aria-pressed="'+(session.selected===n)+'" '+(session.checked?'disabled':'')+' onclick="readingChoose('+n+')">'+String.fromCharCode(65+n)+') '+esc(item)+'</button>').join('');
 const confidencePanel=!session.checked?'<fieldset class="confidence"><legend>¿Qué tan seguro estás?</legend><div class="confchoices">'+[['seguro','Lo tengo claro'],['duda','Tengo dudas'],['azar','Fue al azar']].map(([key,label])=>'<button class="'+(session.confidence===key?'active':'')+'" aria-pressed="'+(session.confidence===key)+'" onclick="readingConfidence(&quot;'+key+'&quot;)">'+label+'</button>').join('')+'</div></fieldset>':'';
 const hints=!exam&&session.mode==='express'&&!session.checked?'<div class="hint-zone"><button class="btn soft" '+(session.hint===2?'disabled':'')+' onclick="readingHint()">'+(session.hint===0?'Necesito una pista':session.hint===1?'Dame otra pista':'Ya tienes dos pistas')+'</button>'+(session.hint?'<p class="hint"><strong>Pista '+session.hint+' de 2.</strong> '+esc(q.steps[0])+(session.hint===2?' '+esc(q.steps[1]):'')+'</p>':'')+'</div>':'';
 const review=session.checked&&!exam?feedback(q):'';
 const nextButton=exam?'<div class="actions"><button class="btn" '+(session.selected===null?'disabled':'')+' onclick="readingAdvance()">'+(session.index===count-1?'Entregar ensayo':'Guardar y continuar →')+'</button><button class="btn secondary" onclick="readingAdvance(true)">'+(session.index===count-1?'Entregar sin responder':'Omitir pregunta →')+'</button></div>':session.checked?'<button class="btn" onclick="readingAdvance()">'+(session.index===count-1?'Ver mi resultado':'Siguiente pregunta →')+'</button>':'<button class="btn" '+(session.selected===null?'disabled':'')+' onclick="readingCheck()">Comprobar respuesta</button>';
 return '<div class="row progress-top"><span class="eyebrow">'+(exam?'ENSAYO COMPLETO':session.mode==='diagnostico'?'DIAGNÓSTICO':'PRÁCTICA LECTORA')+'</span><span class="pill">'+(session.index+1)+' / '+count+'</span></div><div class="bar"><div style="width:'+((session.index+1)/count*100)+'%"></div></div>'+
 (exam?'<p class="timer" role="timer" id="reading-timer">Tiempo restante: '+timeLeft()+'</p>':'')+
 passageMarkup+'<section class="card question"><span class="eyebrow">'+esc(q.skill)+'</span><h2>'+esc(q.question)+'</h2><div class="answers">'+opts+'</div>'+hints+confidencePanel+review+nextButton+'</section>';
}
function result(){
 const list=recent,good=list.filter(x=>x.correct).length;
 const report=skills.map(sk=>{const rows=list.filter(x=>x.skill===sk),right=rows.filter(x=>x.correct).length;return '<div class="skill-summary"><div class="row"><b>'+esc(sk)+'</b><span>'+right+' / '+rows.length+'</span></div><div class="bar"><div style="width:'+(rows.length?right/rows.length*100:0)+'%"></div></div></div>'}).join('');
 return '<span class="eyebrow">RESULTADOS DE LECTURA</span><h1>'+good+' de '+list.length+' respuestas correctas</h1><p>Más que una nota: aquí descubrirás qué habilidad debes seguir entrenando.</p><div class="card"><h2>Tu desempeño por habilidad</h2>'+report+
 '<p class="small">Los resultados no corresponden a una escala ni puntaje PAES oficial.</p><div class="actions"><button class="btn" onclick="readingBack()">Volver a mi preparación</button><button class="btn secondary" onclick="readingBegin(&quot;errores&quot;)" '+(!pending.length?'disabled':'')+'>Reforzar lo que costó</button></div></div>';
}
function render(top=false){
 if(session?.mode==='completo'&&screen==='quiz'&&session.deadline&&Date.now()>=session.deadline){finish();return}
 if(!view)return;
 view.innerHTML=screen==='home'?home():screen==='quiz'?quiz():result();
 if(top&&window.scrollTo)window.scrollTo(0,0);
}
window.readingBegin=begin;window.readingChoose=choose;window.readingConfidence=confidence;window.readingHint=hint;
window.readingCheck=check;window.readingAdvance=advance;window.readingResume=resume;window.readingDiscard=discard;window.readingBack=back;window.readingExplanation=setExplanation;
window.cachasteNativeBack=function(){if(screen!=='home'){back();return true}return false};
if(typeof setInterval==='function')setInterval(()=>{if(screen==='quiz'&&session?.deadline){if(Date.now()>=session.deadline){finish();return}const el=document.getElementById('reading-timer');if(el)el.textContent='Tiempo restante: '+timeLeft()}},1000);
render();
})();