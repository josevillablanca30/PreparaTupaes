/* Cachaste Ciencias: tutor local, independiente de Matemática M1. */
(function(){
'use strict';
const BANK=window.SCIENCE_BANK||[],TOPICS=window.SCIENCE_TOPICS||{};
const KEY='cachaste-science-v1',view=document.getElementById('view'),status=document.getElementById('status');
const subjects=['Biología','Física','Química'];
function load(){try{const value=JSON.parse(localStorage.getItem(KEY)||'{}');return value&&typeof value==='object'?value:{}}catch{return {}}}
const saved=load();
const subjectSlug=((window.location&&window.location.search)||'').toLowerCase();
const focusSubject=/(?:^\?|&)asignatura=biologia(?:&|$)/.test(subjectSlug)?'Biología':/(?:^\?|&)asignatura=quimica(?:&|$)/.test(subjectSlug)?'Química':/(?:^\?|&)asignatura=fisica(?:&|$)/.test(subjectSlug)?'Física':null;
let track=focusSubject||(['Biología','Física','Química','TP'].includes(saved.track)?saved.track:'Biología');
let history=Array.isArray(saved.history)?saved.history.filter(x=>BANK.some(q=>q.id===x.id)).slice(-2000):[];
let pending=Array.isArray(saved.pending)?[...new Set(saved.pending.filter(id=>BANK.some(q=>q.id===id)))]:[];
let notes=saved.notes&&typeof saved.notes==='object'&&!Array.isArray(saved.notes)?saved.notes:{};
let session=validateSession(saved.session)?saved.session:null;
let baseline=saved.baseline&&saved.baseline.completed===true&&Array.isArray(saved.baseline.results)&&saved.baseline.results.length===30?saved.baseline:null;
let screen='home',showReview=false,displayMode='steps',copied=false;
function validateSession(value){return !!(value&&Array.isArray(value.ids)&&value.ids.length>=1&&value.ids.length<=80&&new Set(value.ids).size===value.ids.length&&value.ids.every(id=>BANK.some(q=>q.id===id))&&Number.isInteger(value.index)&&value.index>=0&&value.index<value.ids.length&&Array.isArray(value.results))}
function store(){try{localStorage.setItem(KEY,JSON.stringify({track,history,pending,notes,session,baseline}));return true}catch{message('No pudimos guardar este cambio en el dispositivo.');return false}}
function message(x){if(status)status.textContent=x}
function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
function list(pool,count){const fresh=pool.map(q=>({q,seen:history.filter(h=>h.id===q.id).length,tie:Math.random()})).sort((a,b)=>a.seen-b.seen||a.tie-b.tie);return fresh.slice(0,count).map(x=>x.q)}
function skillMap(q){const name=q.area;if(name.includes('estructura')||name.includes('celular'))return 'Busca qué estructura realiza la función indicada.';if(name.includes('Reacciones'))return 'Escribe qué entra y qué sale; comprueba la conservación de la materia.';if(name==='Mecánica')return 'Identifica las magnitudes y sus unidades antes de calcular.';if(name==='Electricidad')return 'Distingue corriente, voltaje, resistencia, potencia y energía.';return 'Subraya la variable que cambia y la evidencia que permite responder.'}
function selected(){return session?BANK.find(q=>q.id===session.ids[session.index]):null}
function chooseTrack(next){if(!['Biología','Física','Química','TP'].includes(next))return;track=next;store();render()}
function adaptiveScore(q){
 const record=baseline?baseline.results.filter(x=>x.subject===q.subject&&x.area===q.area):[];
 const missed=record.filter(x=>!x.correct).length;
 const unsure=record.filter(x=>x.confidence==='duda'||x.confidence==='azar'||x.assisted).length;
 const seen=history.filter(x=>x.id===q.id).length;
 // Favorecemos habilidades débiles, pero preferimos ejercicios aún no vistos.
 return (missed*3+unsure)*-1+seen*8;
}
function adapted(pool,count){
 return pool.map(q=>({q,score:adaptiveScore(q),tie:Math.random()})).sort((a,b)=>a.score-b.score||a.tie-b.tie).slice(0,count).map(x=>x.q);
}
function mixScience(pool){
 const remaining=[...pool],mixed=[];let last=null;
 while(remaining.length){
  const counts={};for(const q of remaining)counts[q.subject]=(counts[q.subject]||0)+1;
  const possible=remaining.filter(q=>q.subject!==last);
  const choices=(possible.length?possible:remaining).sort((a,b)=>counts[b.subject]-counts[a.subject]||Math.random()-.5);
  const next=choices[0];mixed.push(next);remaining.splice(remaining.indexOf(next),1);last=next.subject;
 }
 return mixed;
}
function mixedSelection(mode){
 let pool=[];
 if(mode==='diagnostico'){
  // 27 comunes, 9 de cada ciencia, y 3 de la mención o del perfil TP.
  pool=subjects.flatMap(sub=>list(BANK.filter(q=>q.module==='MC'&&q.subject===sub),9));
  if(track==='TP')pool.push(...subjects.flatMap(sub=>list(BANK.filter(q=>q.module==='MTP'&&q.subject===sub),1)));
  else pool.push(...list(BANK.filter(q=>q.module==='ME'&&q.subject===track),3));
 }else if(mode==='express'){
  // 7 comunes + 3 de especialidad (aproximación a 54/26 de la prueba oficial).
  if(track==='TP'){
   const rotated=subjects[Math.floor(Math.random()*subjects.length)];
   pool=subjects.flatMap(sub=>adapted(BANK.filter(q=>q.module==='MC'&&q.subject===sub),sub===rotated?3:2));
   pool.push(...subjects.flatMap(sub=>adapted(BANK.filter(q=>q.module==='MTP'&&q.subject===sub),1)));
  }else{
   const others=subjects.filter(sub=>sub!==track);
   pool.push(...adapted(BANK.filter(q=>q.module==='MC'&&q.subject===track),2));
   pool.push(...adapted(BANK.filter(q=>q.module==='MC'&&q.subject===others[0]),3));
   pool.push(...adapted(BANK.filter(q=>q.module==='MC'&&q.subject===others[1]),2));
   pool.push(...adapted(BANK.filter(q=>q.module==='ME'&&q.subject===track),3));
  }
 }else if(mode==='mixto'){
  pool=subjects.flatMap(sub=>adapted(BANK.filter(q=>q.module==='MC'&&q.subject===sub),3));
 }else if(mode==='completo'){
  pool=BANK.filter(q=>q.module==='MC');
  pool.push(...(track==='TP'?BANK.filter(q=>q.module==='MTP'):mixScience(BANK.filter(q=>q.module==='ME'&&q.subject===track)).slice(0,26)));
  if(pool.length!==80||new Set(pool.map(q=>q.id)).size!==80)throw Error('Banco insuficiente o duplicado para mención '+track);
 }
 return mixScience(pool);
}
function setup(mode){
 if(mode==='modulo')mode='express';
 if(!baseline&&mode!=='diagnostico'&&mode!=='errores'&&mode!=='resume'){
  message('Primero completa el diagnóstico de 30 preguntas para preparar tu ruta de estudio.');return;
 }
 let pool=[];
 if(['diagnostico','express','mixto','completo'].includes(mode))pool=mixedSelection(mode);
 else if(mode==='errores')pool=adapted(BANK.filter(q=>pending.includes(q.id)),10);
 else if(subjects.includes(mode))pool=adapted(BANK.filter(q=>q.subject===mode&&q.module==='MC'),8);
 else if(mode.startsWith('electivo:')){const sub=mode.slice(9);pool=adapted(BANK.filter(q=>q.subject===sub&&q.module==='ME'),4)}
 if(!pool.length){message('Por ahora no hay ejercicios pendientes en esta sección.');return}
 session={ids:pool.map(q=>q.id),index:0,selected:null,checked:false,hint:0,confidence:'duda',results:[],mode,track,started:Date.now(),deadline:mode==='completo'?Date.now()+160*60*1000:null};
 displayMode='steps';showReview=false;screen='quiz';store();render(true);
}
function backHome(){screen='home';showReview=false;store();render(true)}
function resume(){if(!session)return;if(session.mode==='completo'&&Date.now()>=session.deadline){finishScienceExam();return}screen='quiz';render(true)}
function answer(n){if(!session||session.checked||!Number.isInteger(n)||n<0||n>3)return;session.selected=n;store();render()}
function hint(){if(!session||session.checked||session.hint>=2||['diagnostico','completo'].includes(session.mode))return;session.hint++;store();render()}
function confidence(value){if(!session||session.checked||!['seguro','duda','azar'].includes(value))return;session.confidence=value;store();render()}
function check(){if(!session||session.mode==='completo'||session.checked||session.selected===null)return;const q=selected();if(!q)return;
 session.checked=true;
 const result={id:q.id,subject:q.subject,correct:session.selected===q.answer,assisted:session.hint>0,confidence:session.confidence||'duda',area:q.area,module:q.module,date:new Date().toISOString()};
 session.results.push(result);history.push(result);history=history.slice(-2000);
 if(result.correct&&!result.assisted)pending=pending.filter(id=>id!==q.id);
 else if(!result.correct&&!pending.includes(q.id))pending.push(q.id);
 displayMode='steps';store();render()}
function timeRemaining(){
 if(!session?.deadline)return '';
 const secs=Math.max(0,Math.ceil((session.deadline-Date.now())/1000));
 return String(Math.floor(secs/3600)).padStart(2,'0')+':'+String(Math.floor(secs%3600/60)).padStart(2,'0')+':'+String(secs%60).padStart(2,'0');
}
function finishScienceExam(){
 if(!session||session.mode!=='completo')return;
 const results=session.results.slice();
 for(let n=results.length;n<session.ids.length;n++){
  const q=BANK.find(item=>item.id===session.ids[n]);
  const row={id:q.id,subject:q.subject,correct:false,assisted:false,confidence:'sin-declarar',area:q.area,module:q.module,unanswered:true,date:new Date().toISOString()};
  results.push(row);history.push(row);
  if(!pending.includes(q.id))pending.push(q.id);
 }
 history=history.slice(-2000);lastResults=results;session=null;screen='result';store();render(true);
}
function examAdvance(skip=false){
 if(!session||session.mode!=='completo')return;
 if(session.deadline&&Date.now()>=session.deadline){finishScienceExam();return}
 if(session.selected===null&&!skip)return;
 const q=selected();
 const row={id:q.id,subject:q.subject,correct:session.selected===q.answer,assisted:false,confidence:session.selected===null?'sin-declarar':session.confidence,area:q.area,module:q.module,unanswered:session.selected===null,date:new Date().toISOString()};
 session.results.push(row);history.push(row);history=history.slice(-2000);
 if(!row.correct&&!pending.includes(q.id))pending.push(q.id);
 else if(row.correct&&row.confidence==='seguro')pending=pending.filter(id=>id!==q.id);
 if(session.index===session.ids.length-1){lastResults=session.results.slice();session=null;screen='result';store();render(true);return}
 session.index++;session.selected=null;session.checked=false;session.confidence='duda';session.hint=0;store();render(true);
}
function scienceExamQuestion(){
 const q=selected();if(!q)return '<div class="card">No encontramos la pregunta.</div>';
 const options=q.options.map((x,n)=>'<button class="option '+(session.selected===n?'selected':'')+'" aria-pressed="'+(session.selected===n)+'" onclick="answer('+n+')">'+String.fromCharCode(65+n)+') '+esc(x)+'</button>').join('');
 const conf='<fieldset class="confidence-field"><legend>¿Qué tan seguro estás?</legend><div class="confidence-choices">'+[['seguro','Lo tengo claro'],['duda','Tengo dudas'],['azar','Fue al azar']].map(([v,t])=>'<button type="button" class="confidence-choice '+(session.confidence===v?'active':'')+'" aria-pressed="'+(session.confidence===v)+'" onclick="confidence(&quot;'+v+'&quot;)">'+t+'</button>').join('')+'</div></fieldset>';
 return '<div class="timer" id="science-timer" role="timer">Tiempo restante: '+timeRemaining()+'</div>'+
 '<div class="row"><span class="eyebrow">Ensayo · '+esc(q.subject)+' · '+esc(q.module)+'</span><span class="pill">'+(session.index+1)+' / 80</span></div>'+
 '<div class="bar"><div style="width:'+((session.index+1)/80*100)+'%"></div></div>'+
 '<div class="card"><p class="small">'+esc(q.area)+'</p><h2>'+esc(q.question)+'</h2><div class="stack">'+options+'</div>'+conf+
 '<p class="small">En este ensayo no mostramos corrección ni pistas hasta terminar. Puedes omitir una pregunta.</p><div class="actions">'+
 '<button class="btn" onclick="examAdvance()" '+(session.selected===null?'disabled':'')+'>'+(session.index===79?'Entregar ensayo':'Guardar y continuar →')+'</button>'+
 '<button class="btn secondary" onclick="examAdvance(true)">'+(session.index===79?'Entregar sin responder':'Omitir pregunta →')+'</button></div></div>'+
 '<button class="btn secondary" onclick="backHome()">← Volver a Ciencias</button>';
}
function next(){if(!session||!session.checked)return;if(session.index===session.ids.length-1){screen='result';const copy=JSON.parse(JSON.stringify(session));session=null;lastResults=copy.results;if(copy.mode==='diagnostico'&&copy.results.length===30)baseline={completed:true,track:copy.track,results:copy.results,updated:new Date().toISOString()};store();render(true);return}
 session.index++;session.selected=null;session.checked=false;session.hint=0;session.confidence='duda';showReview=false;displayMode='steps';store();render(true)}
let lastResults=[];
function changeMode(next){if(!['steps','easy','example'].includes(next))return;displayMode=next;render()}
function reviewToggle(){showReview=!showReview;render()}
function saveNote(){const q=selected(),field=document.getElementById('science-note');if(!q||!field)return;const txt=field.value.trim().slice(0,3000);if(txt){notes[q.id]={id:q.id,subject:q.subject,area:q.area,question:q.question,answer:q.options[q.answer],note:txt,updated:new Date().toISOString()}}else{delete notes[q.id]}store();showReview=false;message('Observación guardada en este dispositivo.');render()}
function exportNotes(){screen='notes';render(true)}
function copyNotes(){const el=document.getElementById('science-note-export');if(!el)return;el.focus();el.select();let ok=false;try{ok=!!document.execCommand('copy')}catch{}message(ok?'Observaciones copiadas.':'Selecciona el texto y utiliza Copiar.')}
function notesText(){return Object.values(notes).filter(x=>x&&x.note).map(x=>x.id+' | '+x.subject+' | '+x.area+'\nPregunta: '+x.question+'\nRespuesta actual: '+x.answer+'\nObservación: '+x.note+'\n').join('\n---\n')}
function reviewTitle(){return '<span class="eyebrow">Tus observaciones</span><h1>Mejoremos Ciencias juntos.</h1><p>Estas correcciones quedan guardadas solo en este celular. Puedes copiarlas para compartirlas y aplicarlas después en el banco oficial de Cachaste.</p>'}
function reviewPage(){const records=Object.values(notes).filter(x=>x&&x.note);return reviewTitle()+'<div class="card"><h2>'+records.length+' observaciones guardadas</h2>'+(records.length?'<label for="science-note-export">Informe para revisar y compartir</label><textarea id="science-note-export" readonly rows="12">'+esc(notesText())+'</textarea><div class="actions"><button class="btn" onclick="copyNotes()">Copiar observaciones</button><button class="btn secondary" onclick="backHome()">Volver</button></div>':'<p>Cuando detectes una mejora en una pregunta, entra a la explicación y toca “Proponer corrección”.</p><button class="btn secondary" onclick="backHome()">Volver</button>')+'</div>'}
function weakAreas(){
 if(!baseline)return [];
 const stats=new Map();
 for(const r of baseline.results){
  const key=r.subject+'|'+r.area;let row=stats.get(key);
  if(!row)stats.set(key,row={subject:r.subject,area:r.area,total:0,correct:0,unsure:0});
  row.total++;if(r.correct)row.correct++;
  if(r.confidence==='duda'||r.confidence==='azar'||r.assisted)row.unsure++;
 }
 return [...stats.values()].sort((a,b)=>(a.correct/a.total)-(b.correct/b.total)||b.unsure-a.unsure);
}
function guidance(){
 if(!baseline)return '';
 const areas=weakAreas().slice(0,3);
 return '<div class="card learning-plan"><span class="eyebrow">PLAN PERSONALIZADO</span><h2>Lo que conviene aprender primero</h2><p>Nos guiamos por tus errores y tus respuestas con dudas o al azar. No suponemos que dominaste un tema solo por acertar.</p>'+areas.map((r,i)=>'<div class="weak-area"><strong>'+(i+1)+'. '+esc(r.subject)+' · '+esc(r.area)+'</strong><p class="small">'+r.correct+' de '+r.total+' correctas · '+r.unsure+' con dudas o al azar.</p></div>').join('')+'<p class="small">En Express priorizaremos temas que necesitan refuerzo, sin dejar de mezclar las tres ciencias.</p></div>';
}
function home(){
 const tracks=[['Biología','Mención Biología'],['Física','Mención Física'],['Química','Mención Química'],['TP','Modalidad Técnico-Profesional']].map(([name,desc])=>'<button class="track '+(track===name?'active':'')+'" aria-pressed="'+(track===name)+'" onclick="chooseTrack('+JSON.stringify(name).replace(/"/g,'&quot;')+')">'+esc(name)+'<small>'+esc(desc)+'</small></button>').join('');
 const done=!!baseline;
 return '<span class="eyebrow">PAES Ciencias · Admisión 2027</span><h1>Una prueba. Las tres ciencias.</h1><p>Elige tu mención. Te ayudamos a aprender Biología, Física y Química sin dejar ninguna de lado.</p>'+
 (session?'<div class="card"><h2>Tienes una prueba pendiente</h2><p>Tus respuestas están guardadas.</p><div class="actions"><button class="btn" onclick="resume()">Continuar donde quedé</button><button class="btn secondary" onclick="discard()">Descartar</button></div></div>':'')+
 '<div class="card"><span class="eyebrow">PASO 1</span><h2>¿Qué mención rendirás?</h2><p>El módulo común siempre incluye las tres materias. Tu mención añade preguntas de especialidad.</p><div class="track-grid">'+tracks+'</div><p class="small">Elección: <b>'+esc(track==='TP'?'Técnico-Profesional':track)+'</b>. Puedes cambiarla antes de comenzar.</p></div>'+
 '<div class="card"><span class="eyebrow">PASO 2</span><h2>Elige cómo practicar</h2><div class="exam-choices">'+
 '<div class="exam-choice '+(!done?'recommended':'')+'"><div class="row"><h3>Diagnóstico</h3><span class="pill">30 preguntas</span></div><p>'+(done?'Ya completaste el diagnóstico. Puedes repetirlo si quieres actualizar tus fortalezas.':'Tu primera prueba. Identifica qué sabes y lo que necesitas aprender para personalizar el estudio.')+'</p><button class="btn" onclick="setup(&quot;diagnostico&quot;)">'+(done?'Repetir diagnóstico de 30':'Comenzar diagnóstico de 30')+'</button></div>'+
 '<div class="exam-choice"><div class="row"><h3>Ensayo Express</h3><span class="pill">10 preguntas</span></div><p>Biología, Física y Química intercaladas, con más preguntas de tu mención y prioridad para los temas difíciles.</p><button class="btn secondary" onclick="setup(&quot;express&quot;)" '+(!done?'disabled':'')+'>Express · 10 preguntas</button></div>'+
 '<div class="exam-choice"><div class="row"><h3>Ensayo completo</h3><span class="pill">80 preguntas · 160 min</span></div><p>54 del Módulo Común y 26 de tu mención o TP. Sin preguntas repetidas ni corrección anticipada.</p><button class="btn secondary" onclick="setup(&quot;completo&quot;)" '+(!done?'disabled':'')+'>Ensayo completo · 80 preguntas</button></div>'+
 '</div>'+(!done?'<p class="small">El diagnóstico es obligatorio una sola vez antes de Express. Si lo interrumpes, puedes retomarlo.</p>':'')+'</div>'+
 guidance()+
 (done?'<details class="card reinforcement"><summary>Más opciones de refuerzo</summary><p>Si una materia te cuesta, puedes practicarla puntualmente. Después vuelve a Express para seguir ejercitando las tres.</p><div class="stack">'+subjects.map(sub=>'<button class="btn secondary" onclick="setup('+JSON.stringify(sub).replace(/"/g,'&quot;')+')">Reforzar '+esc(sub)+'</button>').join('')+'<button class="btn secondary" onclick="setup(&quot;mixto&quot;)">Práctica común · 9 preguntas</button></div></details>':'')+
 '<div class="card"><h2>Tu progreso</h2><p>'+history.length+' respuestas registradas · '+pending.length+' por reforzar.</p><div class="actions"><button class="btn secondary" onclick="progress()">Ver progreso</button><button class="btn secondary" onclick="setup(&quot;errores&quot;)" '+(!pending.length?'disabled':'')+'>Repasar errores</button><button class="btn secondary" onclick="exportNotes()">Mis correcciones ('+Object.keys(notes).length+')</button></div></div>'+
 '<p class="small">La prueba oficial de Ciencias considera 80 preguntas: 54 del Módulo Común y 26 de la mención o modalidad TP, en 160 minutos. Estos ensayos son formativos y no estiman un puntaje oficial.</p>';
}
function discard(){session=null;store();render()}
function feedback(q){const ok=session.selected===q.answer;const content=displayMode==='easy'?'<p>'+esc(q.easy)+'</p>':displayMode==='example'?'<p>'+esc(q.example)+'</p>':'<ol class="checklist">'+q.steps.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>';
 return '<div class="explain '+(ok?'':'error')+'" role="status"><h3>'+(ok?(session.hint?'¡Cachaste, con una pista!':'¡Cachaste!'):'Todavía no, pero vamos a entenderlo.')+'</h3><p><b>Respuesta correcta:</b> '+esc(q.options[q.answer])+'</p><p>'+esc(q.explanations[session.selected])+'</p></div><div class="card"><h3>Te lo explico como prefieras</h3><div class="tabrow"><button class="btn secondary" onclick="changeMode(&quot;steps&quot;)">Paso a paso</button><button class="btn secondary" onclick="changeMode(&quot;easy&quot;)">Más fácil</button><button class="btn secondary" onclick="changeMode(&quot;example&quot;)">Con un ejemplo</button></div>'+content+'</div>';
}
function question(){if(session?.mode==='completo')return scienceExamQuestion();const q=selected();if(!q)return '<div class="card">No encontramos esa pregunta. <button class="btn" onclick="backHome()">Inicio</button></div>';
 const count=session.ids.length;const options=q.options.map((x,n)=>'<button class="option '+(session.selected===n?'selected ':'')+(session.checked&&n===q.answer?'right ':session.checked&&session.selected===n?'wrong ':'')+'" aria-pressed="'+(session.selected===n)+'" onclick="answer('+n+')" '+(session.checked?'disabled':'')+'>'+String.fromCharCode(65+n)+') '+esc(x)+'</button>').join('');
 const hintText=session.hint?'<div class="hint" role="status"><b>Pista '+session.hint+' de 2</b><p>'+esc(skillMap(q))+'</p>'+(session.hint===2?'<p><b>Primer paso:</b> '+esc(q.steps[0])+'</p>':'')+'</div>':'';
const confidencePanel=!session.checked?'<fieldset class="confidence-field"><legend>¿Qué tan seguro estás?</legend><div class="confidence-choices">'+[['seguro','Lo tengo claro'],['duda','Tengo dudas'],['azar','Fue al azar']].map(([v,t])=>'<button type="button" class="confidence-choice '+((session.confidence||'duda')===v?'active':'')+'" aria-pressed="'+((session.confidence||'duda')===v)+'" onclick="confidence(&quot;'+v+'&quot;)">'+t+'</button>').join('')+'</div></fieldset>':'';
 const note=notes[q.id]?.note||'';
 return '<div class="row"><span class="eyebrow">'+esc(q.subject)+' · '+esc(q.module)+'</span><span class="pill">'+(session.index+1)+' / '+count+'</span></div><div class="bar"><div style="width:'+((session.index+1)/count*100)+'%"></div></div><div class="card"><p class="small">'+esc(q.area)+' · '+esc(q.skill)+'</p><h2>'+esc(q.question)+'</h2><div class="stack">'+options+'</div>'+(session.checked?feedback(q):(session.mode==='diagnostico'?'<p class="small">Este diagnóstico es tu punto de partida: primero responde por ti mismo; después podrás revisar cada explicación.</p>':hintText+'<div class="actions"><button class="btn soft" '+(session.hint===2?'disabled':'')+' onclick="hint()">'+(session.hint===0?'Necesito una pista':session.hint===1?'Dame otra pista':'Ya tienes dos pistas')+'</button></div>')+confidencePanel+'<div class="actions"><button class="btn" '+(session.selected===null?'disabled':'')+' onclick="check()">Comprobar respuesta</button></div>')+(session.checked?'<div class="actions"><button class="btn" onclick="next()">'+(session.index===count-1?'Ver mi resultado':'Siguiente pregunta →')+'</button></div>':'')+'</div>'+
 '<div class="card"><div class="row"><h3>¿Algo que corregir?</h3><button class="btn secondary" onclick="reviewToggle()">'+(showReview?'Cerrar':'Proponer corrección')+'</button></div><p class="small">Especialmente en Biología, puedes revisar científicamente la pregunta o proponer una explicación mejor. No cambia la pregunta automáticamente.</p>'+(showReview?'<label for="science-note">¿Qué cambiarías y por qué?</label><textarea id="science-note" maxlength="3000" placeholder="Ej.: la alternativa C también podría considerarse correcta si..." >'+esc(note)+'</textarea><button class="btn" onclick="saveNote()">Guardar mi observación</button>':note?'<p class="small">Ya tienes una observación guardada para esta pregunta.</p>':'')+'</div>'+
 '<button class="btn secondary" onclick="backHome()">← Volver a Ciencias</button>';
}
function result(){
 const results=lastResults,good=results.filter(x=>x.correct).length,assisted=results.filter(x=>x.correct&&x.assisted).length;
 const perSubject=subjects.map(sub=>{const items=results.filter(x=>x.subject===sub),correct=items.filter(x=>x.correct).length;return '<div class="science-subject-stat"><div class="row"><strong>'+esc(sub)+'</strong><span>'+correct+' de '+items.length+' aciertos</span></div><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+(items.length?Math.round(correct/items.length*100):0)+'" aria-label="Aciertos en '+esc(sub)+'"><div style="width:'+(items.length?correct/items.length*100:0)+'%"></div></div><p class="small">'+(items.length?Math.round(correct/items.length*100)+'% de esta práctica.':'Sin preguntas en esta ronda.')+'</p></div>'}).join('');
 return '<span class="eyebrow">Resultado de Ciencias · las tres materias</span><h1>'+good+' de '+results.length+' correctas</h1><p>¡Bien por practicar! Revisa cómo te fue en cada materia: tu mención importa, pero también las otras ciencias.</p><div class="card"><div class="stat"><div><strong>'+good+'</strong><small>Aciertos totales</small></div><div><strong>'+assisted+'</strong><small>Con pistas</small></div><div><strong>'+pending.length+'</strong><small>Por reforzar</small></div></div><h2>Resultados por asignatura</h2>'+perSubject+'<h3 style="margin-top:22px">¿Qué hacemos ahora?</h3><div class="actions"><button class="btn" onclick="setup(&quot;modulo&quot;)">Otra práctica de Ciencias mixtas</button><button class="btn secondary" onclick="setup(&quot;errores&quot;)" '+(pending.length?'':'disabled')+'>Reforzar mis errores</button><button class="btn secondary" onclick="backHome()">Elegir mención</button><button class="btn secondary" onclick="progress()">Ver progreso completo</button></div></div>';
}
function progress(){screen='progress';render(true)}
function progressPage(){const blocks=subjects.map(sub=>{const done=history.filter(x=>x.subject===sub);const correct=done.filter(x=>x.correct).length,assisted=done.filter(x=>x.correct&&x.assisted).length;const per=done.length?Math.round(100*correct/done.length):0;return '<div class="card"><div class="row"><h2>'+sub+'</h2><span class="pill">'+done.length+' intentos</span></div><div class="bar" role="progressbar" aria-valuenow="'+per+'" aria-valuemin="0" aria-valuemax="100" aria-label="Aciertos '+sub+'"><div style="width:'+per+'%"></div></div><p>'+correct+' aciertos · '+assisted+' con pistas.</p><button class="btn secondary" onclick="setup('+JSON.stringify(sub).replace(/"/g,'&quot;')+')">Practicar '+sub+'</button></div>'}).join('');return '<span class="eyebrow">Ciencias · progreso local</span><h1>Aprender también es volver a intentar.</h1><p>No convertimos los aciertos a puntaje PAES: representan únicamente los ejercicios que realizaste.</p>'+blocks+'<button class="btn secondary" onclick="backHome()">← Volver a Ciencias</button>'}
function render(scroll=false){if(session?.mode==='completo'&&screen==='quiz'&&session.deadline&&Date.now()>=session.deadline){finishScienceExam();return}if(!view)return;view.innerHTML=screen==='quiz'&&session?question():screen==='result'?result():screen==='progress'?progressPage():screen==='notes'?reviewPage():home();if(scroll)window.scrollTo(0,0)}
window.chooseTrack=chooseTrack;window.setup=setup;window.examAdvance=examAdvance;window.answer=answer;window.hint=hint;window.check=check;window.next=next;window.changeMode=changeMode;window.reviewToggle=reviewToggle;window.saveNote=saveNote;window.exportNotes=exportNotes;window.copyNotes=copyNotes;window.backHome=backHome;window.resume=resume;window.discard=discard;window.progress=progress;window.confidence=confidence;
window.cachasteNativeBack=function(){if(screen!=='home'){backHome();return true}return false};
if(typeof setInterval==='function')setInterval(()=>{if(screen==='quiz'&&session?.mode==='completo'){if(Date.now()>=session.deadline){finishScienceExam();return}const el=document.getElementById('science-timer');if(el)el.textContent='Tiempo restante: '+timeRemaining()}},1000);
render();
})();
