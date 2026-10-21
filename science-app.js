/* Cachaste Ciencias: tutor local, independiente de Matemática M1. */
(function(){
'use strict';
const BANK=window.SCIENCE_BANK||[],TOPICS=window.SCIENCE_TOPICS||{};
const KEY='cachaste-science-v1',view=document.getElementById('view'),status=document.getElementById('status');
const subjects=['Biología','Física','Química'];
function load(){try{const value=JSON.parse(localStorage.getItem(KEY)||'{}');return value&&typeof value==='object'?value:{}}catch{return {}}}
const saved=load();saved.session=window.CachasteLearning.restoreSession(saved.session,BANK);
const subjectSlug=((window.location&&window.location.search)||'').toLowerCase();
const focusSubject=/(?:^\?|&)asignatura=biologia(?:&|$)/.test(subjectSlug)?'Biología':/(?:^\?|&)asignatura=quimica(?:&|$)/.test(subjectSlug)?'Química':/(?:^\?|&)asignatura=fisica(?:&|$)/.test(subjectSlug)?'Física':null;
let track=focusSubject||(['Biología','Física','Química','TP'].includes(saved.track)?saved.track:'Biología');
let history=Array.isArray(saved.history)?saved.history.filter(x=>x&&BANK.some(q=>q.id===x.id)&&typeof x.correct==='boolean').slice(-2000):[];
let pending=Array.isArray(saved.pending)?[...new Set(saved.pending.filter(id=>BANK.some(q=>q.id===id)))]:[];
let notes=saved.notes&&typeof saved.notes==='object'&&!Array.isArray(saved.notes)?saved.notes:{};
let cachedSnapshots=null,cachedQuestions=[];
let session=validateSession(saved.session)?saved.session:null;
let baseline=saved.baseline&&saved.baseline.completed===true&&Array.isArray(saved.baseline.results)&&saved.baseline.results.length===30&&saved.baseline.results.every(r=>r&&typeof r.correct==='boolean')?saved.baseline:null;
let screen='home',showReview=false,displayMode='steps',copied=false;
let lastResults=Array.isArray(saved.recent)?window.CachasteLearning.cleanRows(BANK,saved.recent,200):[];
let assessments=Array.isArray(saved.assessments)?saved.assessments.map(a=>window.CachasteLearning.cleanAssessment(BANK,a)).filter(Boolean).slice(-100):[];
let examMap=false,examConfirm=false;
if(session){session.selected=session.selected??null;session.hint=Number.isInteger(session.hint)?Math.max(0,Math.min(2,session.hint)):0;session.checked=!!session.checked&&session.selected!==null;}
if(session?.mode==='completo'){
 if(!session.answers)session.legacyResults=session.results.slice();
 const old=session.answers&&typeof session.answers==='object'?session.answers:Object.fromEntries(session.results.map(r=>[r.id,r.selected??(r.correct?activeQuestion(r.id).answer:null)]));
 session.answers=Object.fromEntries(session.ids.map(id=>{const n=old[id];return[id,Number.isInteger(n)&&n>=0&&n<activeQuestion(id).options.length?n:null]}));
 session.flags=Array.isArray(session.flags)?session.flags.filter(id=>session.ids.includes(id)):[];
 if(!Number.isFinite(session.deadline))session=null;
}
function validateSession(value){return window.CachasteLearning.validSession(value,BANK,['diagnostico','express','mixto','completo','errores',...subjects,...subjects.map(s=>'electivo:'+s)],80)}
function store(){if(session&&!session.questionSnapshots)window.CachasteLearning.freezeSession(session,BANK);try{localStorage.setItem(KEY,JSON.stringify({version:2,track,history,pending,notes,session,baseline,recent:lastResults,assessments}));return true}catch{message('No pudimos guardar este cambio en el dispositivo.');return false}}
function message(x){if(status)status.textContent=x}
function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
function list(pool,count){const fresh=pool.map(q=>({q,seen:history.filter(h=>h.id===q.id).length,tie:Math.random()})).sort((a,b)=>a.seen-b.seen||a.tie-b.tie);return fresh.slice(0,count).map(x=>x.q)}
function skillMap(q){const name=q.area;if(name.includes('estructura')||name.includes('celular'))return 'Busca qué estructura realiza la función indicada.';if(name.includes('Reacciones'))return 'Escribe qué entra y qué sale; comprueba la conservación de la materia.';if(name==='Mecánica')return 'Identifica las magnitudes y sus unidades antes de calcular.';if(name==='Electricidad')return 'Distingue corriente, voltaje, resistencia, potencia y energía.';return 'Subraya la variable que cambia y la evidencia que permite responder.'}
function activeQuestion(id){if(cachedSnapshots!==session?.questionSnapshots){cachedSnapshots=session?.questionSnapshots;cachedQuestions=window.CachasteLearning.archivedSessionQuestions(session)||[];}return cachedQuestions.find(q=>q.id===id)||BANK.find(q=>q.id===id)}
function selected(){return session?activeQuestion(session.ids[session.index]):null}
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
 if(window.CachasteLearning)return window.CachasteLearning.select(pool,history,count);
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
  pool=subjects.flatMap(sub=>list(BANK.filter(q=>q.examEligible!==false&&q.module==='MC'&&q.subject===sub),9));
  if(track==='TP')pool.push(...subjects.flatMap(sub=>list(BANK.filter(q=>q.examEligible!==false&&q.module==='MTP'&&q.subject===sub),1)));
  else pool.push(...list(BANK.filter(q=>q.examEligible!==false&&q.module==='ME'&&q.subject===track),3));
 }else if(mode==='express'){
  // 7 comunes + 3 de especialidad (aproximación a 54/26 de la prueba oficial).
  if(track==='TP'){
   const rotated=subjects[Math.floor(Math.random()*subjects.length)];
   pool=subjects.flatMap(sub=>adapted(BANK.filter(q=>q.examEligible!==false&&q.module==='MC'&&q.subject===sub),sub===rotated?3:2));
   pool.push(...subjects.flatMap(sub=>adapted(BANK.filter(q=>q.examEligible!==false&&q.module==='MTP'&&q.subject===sub),1)));
  }else{
   const others=subjects.filter(sub=>sub!==track);
   pool.push(...adapted(BANK.filter(q=>q.examEligible!==false&&q.module==='MC'&&q.subject===track),2));
   pool.push(...adapted(BANK.filter(q=>q.examEligible!==false&&q.module==='MC'&&q.subject===others[0]),3));
   pool.push(...adapted(BANK.filter(q=>q.examEligible!==false&&q.module==='MC'&&q.subject===others[1]),2));
   pool.push(...adapted(BANK.filter(q=>q.examEligible!==false&&q.module==='ME'&&q.subject===track),3));
  }
 }else if(mode==='mixto'){
  pool=subjects.flatMap(sub=>adapted(BANK.filter(q=>q.examEligible!==false&&q.module==='MC'&&q.subject===sub),3));
 }else if(mode==='completo'){
  const eligible=BANK.filter(q=>q.examEligible!==false),family=q=>q.transferGroup||q.id;
  const distinct=(items,n)=>{const used=new Set();return list(items,items.length).filter(q=>{const key=family(q);if(used.has(key))return false;used.add(key);return true}).slice(0,n)};
  const speciality=track==='TP'?eligible.filter(q=>q.module==='MTP'):distinct(eligible.filter(q=>q.module==='ME'&&q.subject===track),26);
  const used=new Set(speciality.map(family));
  const common=subjects.flatMap(sub=>distinct(eligible.filter(q=>q.module==='MC'&&q.subject===sub&&!used.has(family(q))),18));
  pool=[...common,...speciality];
  if(common.length!==54||speciality.length!==26||new Set(pool.map(family)).size!==80)throw Error('Banco insuficiente o familias duplicadas para mención '+track);
 }
 return mixScience(pool);
}
function setup(mode){
 if(session){message('Tienes una sesión guardada. Retómala o descártala antes de iniciar otra.');screen='home';render();return;}
 if(mode==='modulo')mode='express';
 if(!baseline&&mode!=='diagnostico'&&mode!=='errores'&&mode!=='resume'&&mode!=='completo'){
  message('Primero completa el diagnóstico de 30 preguntas para preparar tu ruta de estudio.');return;
 }
 let pool=[];
 if(['diagnostico','express','mixto','completo'].includes(mode))pool=mixedSelection(mode);
 else if(mode==='errores'){
  const targets=BANK.filter(q=>q.examEligible!==false&&pending.includes(q.id));
  if(window.CachasteLearning){pool=window.CachasteLearning.transfer(BANK.filter(q=>q.examEligible!==false),history,[...lastResults,...history.slice(-30)],10)}else{
   const topics=new Set(targets.map(q=>q.subject+'|'+q.area));
   const seen=new Set([...history.map(x=>x.id),...pending]);
   pool=adapted(BANK.filter(q=>q.examEligible!==false&&topics.has(q.subject+'|'+q.area)&&!seen.has(q.id)),10);
  }
 }
 else if(subjects.includes(mode))pool=adapted(BANK.filter(q=>q.examEligible!==false&&q.subject===mode&&q.module==='MC'),8);
 else if(mode.startsWith('electivo:')){const sub=mode.slice(9);pool=adapted(BANK.filter(q=>q.examEligible!==false&&q.subject===sub&&q.module==='ME'),4)}
 if(!pool.length){message('Por ahora no hay ejercicios pendientes en esta sección.');return}
 session={ids:pool.map(q=>q.id),index:0,selected:null,checked:false,hint:0,confidence:'duda',results:[],mode,track,started:Date.now(),deadline:mode==='completo'?Date.now()+160*60*1000:null,answers:{},flags:[]};
 examMap=false;examConfirm=false;
 displayMode='steps';showReview=false;screen='quiz';store();render(true);
}
function backHome(){screen='home';showReview=false;store();render(true)}
function resume(){if(!session)return;if(session.mode==='completo'&&Date.now()>=session.deadline){finishScienceExam();return}screen='quiz';render(true)}
function answer(n){if(!session||session.checked||!Number.isInteger(n)||n<0||n>3)return;if(session.mode==='completo'&&Date.now()>=session.deadline){finishScienceExam();return}session.selected=n;if(session.mode==='completo')session.answers[selected().id]=n;store();render()}
function hint(){if(!session||session.checked||session.hint>=2||['diagnostico','completo'].includes(session.mode))return;session.hint++;store();render()}
function confidence(value){if(!session||session.checked||!['seguro','duda','azar'].includes(value))return;session.confidence=value;store();render()}
function check(){if(!session||session.mode==='completo'||session.checked||session.selected===null)return;const q=selected();if(!q)return;
 session.checked=true;
 const result={id:q.id,assessmentVersion:window.CachasteLearning.assessmentVersion(q),selected:session.selected,concept:q.concept||q.area,subject:q.subject,correct:session.selected===q.answer,assisted:session.hint>0,confidence:'no-declarada',area:q.area,module:q.module,date:new Date().toISOString()};
 session.results.push(result);history.push(result);history=history.slice(-2000);
 if(!result.correct&&!pending.includes(q.id))pending.push(q.id);
 if(window.CachasteLearning){const proved=new Set(window.CachasteLearning.profile(BANK,history).filter(p=>p.status==='comprobado').map(p=>p.concept));pending=pending.filter(id=>!proved.has(BANK.find(q=>q.id===id).concept));}
 displayMode='steps';store();render()}
function timeRemaining(){
 if(!session?.deadline)return '';
 const secs=Math.max(0,Math.ceil((session.deadline-Date.now())/1000));
 return String(Math.floor(secs/3600)).padStart(2,'0')+':'+String(Math.floor(secs%3600/60)).padStart(2,'0')+':'+String(secs%60).padStart(2,'0');
}
function remember(mode,results,trackName=track){
 const entry={id:'science-'+Date.now(),mode,track:trackName,at:new Date().toISOString(),correct:results.filter(r=>r.correct).length,total:results.length,results:results.slice()};
 assessments.push(entry);assessments=assessments.slice(-100);lastResults=results.slice();
}
function finishScienceExam(){
 if(!session||session.mode!=='completo')return;
 const legacy=session.legacyResults||[];
 const oldTail=history.slice(-legacy.length);if(legacy.length&&oldTail.length===legacy.length&&legacy.every((r,i)=>r.id===oldTail[i].id&&r.date&&r.date===oldTail[i].date&&r.correct===oldTail[i].correct))history=history.slice(0,-legacy.length);
 const results=session.ids.map(id=>{const q=activeQuestion(id),n=session.answers?.[id]??null,old=legacy.find(r=>r.id===id),unknownOld=n===null&&old&&!old.correct&&!old.unanswered&&!session.explicitlyOmitted?.includes(id);return {id,assessmentVersion:window.CachasteLearning.assessmentVersion(q),selected:n,subject:q.subject,concept:q.concept||q.area,correct:n!==null&&n===q.answer,assisted:false,confidence:'sin-declarar',area:q.area,module:q.module,unanswered:n===null&&!unknownOld,date:old?.date||new Date().toISOString()}});
 history.push(...results);history=history.slice(-2000);
 for(const r of results)if(!r.correct&&!pending.includes(r.id))pending.push(r.id);
 remember('completo',results,session.track);session=null;screen='result';examConfirm=false;store();render(true);
}
function examAdvance(skip=false){
 if(!session||session.mode!=='completo')return;
 if(Date.now()>=session.deadline){finishScienceExam();return}
 if(skip){session.selected=null;session.answers[selected().id]=null;session.explicitlyOmitted=[...new Set([...(session.explicitlyOmitted||[]),selected().id])];}
 // Unanswered items may be revisited from the map before submitting.
 if(session.index===session.ids.length-1){examConfirm=true;store();render(true);return}
 examJump(session.index+1);
}
function examJump(index){
 if(!session||session.mode!=='completo'||!Number.isInteger(index)||index<0||index>=session.ids.length)return;
 if(Date.now()>=session.deadline){finishScienceExam();return}
 session.index=index;session.selected=session.answers[selected().id]??null;examConfirm=false;store();render(true);
}
function examAction(action){if(!session)return;if(action==='map')examMap=!examMap;if(action==='continue')examConfirm=false;if(action==='finish'){finishScienceExam();return}if(action==='flag'){const id=selected().id;session.flags=session.flags.includes(id)?session.flags.filter(x=>x!==id):[...session.flags,id];store()}render()}
function scienceExamQuestion(){
 const q=selected();if(!q)return '';
 if(examConfirm)return '<div class="card"><h1>¿Entregar el ensayo?</h1><p>'+Object.values(session.answers).filter(n=>n!==null).length+' de 80 respuestas guardadas. Las preguntas en blanco se registrarán como no respondidas.</p><div class="actions"><button class="btn" onclick="examAction(&quot;finish&quot;)">Confirmar entrega</button><button class="btn secondary" onclick="examAction(&quot;continue&quot;)">Seguir revisando</button></div></div>';
 const map=examMap?'<nav class="question-map" aria-label="Preguntas del ensayo">'+session.ids.map((id,i)=>'<button class="'+(session.answers[id]!=null?'answered ':'')+(session.flags.includes(id)?'flagged':'')+'" aria-current="'+(i===session.index?'step':'false')+'" onclick="examJump('+i+')">'+(i+1)+'</button>').join('')+'</nav>':'';
 const options=q.options.map((x,n)=>'<button class="option '+(session.selected===n?'selected':'')+'" aria-pressed="'+(session.selected===n)+'" onclick="answer('+n+')">'+String.fromCharCode(65+n)+') '+esc(x)+'</button>').join('');
 return '<div class="timer" id="science-timer" role="timer">Tiempo restante: '+timeRemaining()+'</div><div class="actions"><button onclick="examAction(&quot;map&quot;)">Mapa de preguntas</button><button onclick="examAction(&quot;flag&quot;)">'+(session.flags.includes(q.id)?'Desmarcar':'Marcar para revisar')+'</button></div>'+map+'<div class="row"><span class="eyebrow">Ensayo · '+esc(q.subject)+' · '+esc(q.module)+'</span><span class="pill">'+(session.index+1)+' / 80</span></div><div class="card"><p class="small">'+esc(q.area)+'</p><h2>'+esc(q.question)+'</h2><div class="stack">'+options+'</div><p class="small">Puedes revisar y cambiar respuestas hasta entregar. El tutor se abre al finalizar.</p><div class="actions"><button class="btn secondary" onclick="examJump('+(session.index-1)+')" '+(session.index===0?'disabled':'')+'>Anterior</button><button class="btn" onclick="examAdvance()" '+(session.selected===null?'disabled':'')+'>'+(session.index===79?'Entregar ensayo':'Guardar y continuar →')+'</button><button class="btn secondary" onclick="examAdvance(true)">Omitir pregunta →</button></div></div><button class="btn secondary" onclick="backHome()">← Volver a Ciencias</button>';
}
function next(){if(!session||!session.checked)return;if(session.index===session.ids.length-1){screen='result';const copy=JSON.parse(JSON.stringify(session));session=null;remember(copy.mode,copy.results,copy.track);if(copy.mode==='diagnostico'&&copy.results.length===30)baseline={completed:true,track:copy.track,results:copy.results,updated:new Date().toISOString()};store();render(true);return}
 session.index++;session.selected=null;session.checked=false;session.hint=0;session.confidence='duda';showReview=false;displayMode='steps';store();render(true)}

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
function feedback(q){
 const ok=session.selected===q.answer;
 const correct=esc(q.options[q.answer]);
 const chosen=esc(q.options[session.selected]||'');
 const reasoning=(q.steps||[]).filter(Boolean);
 const explanation=q.explanations?.[session.selected]||'';
 const mistake=ok?'':('<p><b>Elegiste:</b> '+chosen+'</p><p><b>Por qué no corresponde:</b> '+esc(explanation||'Esta alternativa no responde a lo que pregunta el enunciado.')+'</p>');
 const conclusion='<p><b>Por qué es correcta:</b> '+esc(q.explanations?.[q.answer]||reasoning[reasoning.length-1]||q.easy||'Revisa los datos del enunciado y compáralos con las alternativas.')+'</p>';
 const easy=q.easy&&q.easy.length>85?q.easy:([q.easy,...reasoning].filter(Boolean).join(' '));
 const example=q.example&&q.example.length>85?q.example:([q.example,'Vuelve a la pregunta: '+q.question,'La opción correcta es '+q.options[q.answer]+'.'].filter(Boolean).join(' '));
 const exampleLabel=q.example?.startsWith('Aplica esta idea')?'Aplicado a esta pregunta':'Con un ejemplo';
 const content=q.teaching?window.CachasteLearning.lesson(q,displayMode):displayMode==='easy'?'<p>'+esc(easy)+'</p>':displayMode==='example'?'<p>'+esc(example)+'</p>':'<ol class="checklist">'+reasoning.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>';
 return '<div class="explain '+(ok?'':'error')+'" role="status"><h3>'+(ok?(session.hint?'¡Cachaste, con una pista!':'¡Cachaste!'):'Todavía no, pero vamos a entenderlo.')+'</h3><p><b>Respuesta correcta:</b> '+correct+'</p>'+mistake+conclusion+'</div><div class="card"><h3>Te lo explico como prefieras</h3><div class="tabrow"><button class="btn secondary" onclick="changeMode(&quot;steps&quot;)">Paso a paso</button><button class="btn secondary" onclick="changeMode(&quot;easy&quot;)">Más fácil</button><button class="btn secondary" onclick="changeMode(&quot;example&quot;)">'+esc(exampleLabel)+'</button></div>'+content+'</div>';
}
function question(){if(session?.mode==='completo')return scienceExamQuestion();const q=selected();if(!q)return '<div class="card">No encontramos esa pregunta. <button class="btn" onclick="backHome()">Inicio</button></div>';
 const count=session.ids.length;const options=q.options.map((x,n)=>'<button class="option '+(session.selected===n?'selected ':'')+(session.checked&&n===q.answer?'right ':session.checked&&session.selected===n?'wrong ':'')+'" aria-pressed="'+(session.selected===n)+'" onclick="answer('+n+')" '+(session.checked?'disabled':'')+'>'+String.fromCharCode(65+n)+') '+esc(x)+'</button>').join('');
 const hintText=session.hint?'<div class="hint" role="status"><b>Pista '+session.hint+' de 2</b><p>'+esc(skillMap(q))+'</p>'+(session.hint===2?'<p><b>Primer paso:</b> '+esc(q.hint||q.steps[0])+'</p>':'')+'</div>':'';
 const confidencePanel='';
 const note=notes[q.id]?.note||'';
 return '<div class="row"><span class="eyebrow">'+esc(q.subject)+' · '+esc(q.module)+'</span><span class="pill">'+(session.index+1)+' / '+count+'</span></div><div class="bar"><div style="width:'+((session.index+1)/count*100)+'%"></div></div><div class="card"><p class="small">'+esc(q.area)+' · '+esc(q.skill)+'</p><h2>'+esc(q.question)+'</h2><div class="stack">'+options+'</div>'+(session.checked?feedback(q):(session.mode==='diagnostico'?'<p class="small">Este diagnóstico es tu punto de partida: primero responde por ti mismo; después podrás revisar cada explicación.</p>':hintText+'<div class="actions"><button class="btn soft" '+(session.hint===2?'disabled':'')+' onclick="hint()">'+(session.hint===0?'Necesito una pista':session.hint===1?'Dame otra pista':'Ya tienes dos pistas')+'</button></div>')+confidencePanel+'<div class="actions"><button class="btn" '+(session.selected===null?'disabled':'')+' onclick="check()">Comprobar respuesta</button></div>')+(session.checked?'<div class="actions"><button class="btn" onclick="next()">'+(session.index===count-1?'Ver mi resultado':'Siguiente pregunta →')+'</button></div>':'')+'</div>'+
 '<div class="card"><div class="row"><h3>¿Algo que corregir?</h3><button class="btn secondary" onclick="reviewToggle()">'+(showReview?'Cerrar':'Proponer corrección')+'</button></div><p class="small">Especialmente en Biología, puedes revisar científicamente la pregunta o proponer una explicación mejor. No cambia la pregunta automáticamente.</p>'+(showReview?'<label for="science-note">¿Qué cambiarías y por qué?</label><textarea id="science-note" maxlength="3000" placeholder="Ej.: la alternativa C también podría considerarse correcta si..." >'+esc(note)+'</textarea><button class="btn" onclick="saveNote()">Guardar mi observación</button>':note?'<p class="small">Ya tienes una observación guardada para esta pregunta.</p>':'')+'</div>'+
 '<button class="btn secondary" onclick="backHome()">← Volver a Ciencias</button>';
}
function diagnosticReport(rows){
 if(!rows?.length)return '';
 const examResult=rows.every(r=>r.confidence==='sin-declarar');
 const groups=new Map();
 for(const x of rows){const key=x.subject+'|'+x.area;let g=groups.get(key);if(!g){g={subject:x.subject,area:x.area,total:0,right:0,secure:0,uncertain:0};groups.set(key,g)}g.total++;if(x.correct)g.right++;if(x.correct&&(examResult||['seguro','no-declarada'].includes(x.confidence))&&!x.assisted)g.secure++;if(x.confidence==='azar'||x.confidence==='duda'||x.assisted)g.uncertain++}
 const stats=[...groups.values()].sort((a,b)=>a.secure/a.total-b.secure/b.total);
 const line=g=>'<div class="weak-area"><strong>'+esc(g.subject)+' · '+esc(g.area)+'</strong><p class="small">'+g.right+' de '+g.total+' correctas · '+g.secure+(examResult?' sin pistas · ':' con seguridad · ')+g.uncertain+' con dudas o ayuda.</p><p>'+ (g.secure/g.total>=.75?'Fortaleza: sigue practicando con preguntas nuevas para confirmar el dominio.':g.secure/g.total>=.5?'En desarrollo: comprende el concepto y practica su aplicación en contextos diferentes.':'Prioridad: revisa la idea central y aprende a distinguir las alternativas antes de practicar con preguntas nuevas.')+'</p></div>';
 const strengths=stats.filter(g=>g.secure/g.total>=.75);
 const weaknesses=stats.filter(g=>g.secure/g.total<.75);
 return '<div class="card learning-plan">'+(examResult?'<p class="small">El ensayo no recoge autoconfianza: estos aciertos describen el desempeño de esta muestra. Confirma el aprendizaje en preguntas distintas.</p>':'')+'<span class="eyebrow">DIAGNÓSTICO PERSONALIZADO</span><h2>Lo que ya manejas</h2>'+(strengths.length?strengths.map(line).join(''):'<p>Aún no hay temas con dominio seguro suficiente; eso indica dónde empezar a estudiar, no que no puedas aprenderlos.</p>')+'<h2>Lo que debes mejorar</h2>'+(weaknesses.length?weaknesses.map(line).join(''):'<p>No se detectaron debilidades claras en esta muestra. Continúa con ejercicios nuevos.</p>')+'<h2>Tu plan de estudio</h2><p>1. Parte por los temas con menos respuestas correctas y seguras. 2. Revisa por qué fallaron tus alternativas. 3. Practica con preguntas distintas del mismo tema. 4. Comprueba si puedes explicar la respuesta sin ayuda.</p><p class="small">Cada tema puede tener pocas preguntas en el diagnóstico: este resultado es orientativo, no una certificación de dominio ni un puntaje PAES.</p></div>';
}
function result(){
 const results=lastResults,good=results.filter(x=>x.correct).length,assisted=results.filter(x=>x.correct&&x.assisted).length;
 const perSubject=subjects.map(sub=>{const items=results.filter(x=>x.subject===sub),correct=items.filter(x=>x.correct).length;return '<div class="science-subject-stat"><div class="row"><strong>'+esc(sub)+'</strong><span>'+correct+' de '+items.length+' aciertos</span></div><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+(items.length?Math.round(correct/items.length*100):0)+'" aria-label="Aciertos en '+esc(sub)+'"><div style="width:'+(items.length?correct/items.length*100:0)+'%"></div></div><p class="small">'+(items.length?Math.round(correct/items.length*100)+'% de esta práctica.':'Sin preguntas en esta ronda.')+'</p></div>'}).join('');
 return '<span class="eyebrow">Resultado de Ciencias · las tres materias</span><h1>'+good+' de '+results.length+' correctas</h1><p>¡Bien por practicar! Revisa cómo te fue en cada materia: tu mención importa, pero también las otras ciencias.</p><div class="card"><div class="stat"><div><strong>'+good+'</strong><small>Aciertos totales</small></div><div><strong>'+assisted+'</strong><small>Con pistas</small></div><div><strong>'+pending.length+'</strong><small>Por reforzar</small></div></div><h2>Resultados por asignatura</h2>'+perSubject+diagnosticReport(results)+reviewResults(results)+'<h3 style="margin-top:22px">¿Qué hacemos ahora?</h3><div class="actions"><button class="btn" onclick="setup(&quot;modulo&quot;)">Otra práctica de Ciencias mixtas</button><button class="btn secondary" onclick="setup(&quot;errores&quot;)" '+(pending.length?'':'disabled')+'>Reforzar mis errores</button><button class="btn secondary" onclick="backHome()">Elegir mención</button><button class="btn secondary" onclick="progress()">Ver progreso completo</button></div></div>';
}
function reviewResults(rows){return '<h2>Revisa tus respuestas</h2>'+rows.map(r=>{const bankQ=BANK.find(x=>x.id===r.id),q=window.CachasteLearning.verifiedAssessmentQuestion(null,r,bankQ);if(!q)return '';return '<details class="review-item"><summary>'+(r.correct?'✓ ':'↗ ')+esc(q.question)+'</summary><p><strong>Tu respuesta:</strong> '+esc(r.selected==null?(r.unanswered?'Sin responder':'No guardada en la versión anterior'):q.options[r.selected])+'</p><p><strong>Correcta:</strong> '+esc(q.options[q.answer])+'</p>'+(r.selected!=null&&!r.correct?'<p>'+esc(q.explanations[r.selected])+'</p>':'')+'<h3>Paso a paso</h3><ol>'+q.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol><h3>Más fácil</h3><p>'+esc(q.easy)+'</p><h3>Con un ejemplo</h3><p>'+esc(q.example)+'</p></details>'}).join('')}
function sciencePast(index){const a=assessments[index];if(a){lastResults=a.results;screen='result';render(true)}}
function scienceHistory(){return '<h2>Historial de sesiones</h2>'+assessments.map((a,i)=>'<button class="history-item" onclick="sciencePast('+i+')">'+esc(a.mode)+' · '+a.correct+'/'+a.total+' · '+esc(new Date(a.at).toLocaleDateString('es-CL'))+'</button>').reverse().join('')}
function progress(){screen='progress';render(true)}
function progressPage(){const blocks=subjects.map(sub=>{const done=history.filter(x=>x.subject===sub);const correct=done.filter(x=>x.correct).length,assisted=done.filter(x=>x.correct&&x.assisted).length;const per=done.length?Math.round(100*correct/done.length):0;return '<div class="card"><div class="row"><h2>'+sub+'</h2><span class="pill">'+done.length+' intentos</span></div><div class="bar" role="progressbar" aria-valuenow="'+per+'" aria-valuemin="0" aria-valuemax="100" aria-label="Aciertos '+sub+'"><div style="width:'+per+'%"></div></div><p>'+correct+' aciertos · '+assisted+' con pistas.</p><button class="btn secondary" onclick="setup('+JSON.stringify(sub).replace(/"/g,'&quot;')+')">Practicar '+sub+'</button></div>'}).join('');return '<span class="eyebrow">Ciencias · progreso local</span><h1>Aprender también es volver a intentar.</h1><p>No convertimos los aciertos a puntaje PAES: representan únicamente los ejercicios que realizaste.</p>'+blocks+scienceHistory()+'<button class="btn secondary" onclick="backHome()">← Volver a Ciencias</button>'}
function render(scroll=false){if(session?.mode==='completo'&&screen==='quiz'&&session.deadline&&Date.now()>=session.deadline){finishScienceExam();return}if(!view)return;view.innerHTML=screen==='quiz'&&session?question():screen==='result'?result():screen==='progress'?progressPage():screen==='notes'?reviewPage():home();if(scroll)window.scrollTo(0,0)}
window.examJump=examJump;window.examAction=examAction;window.sciencePast=sciencePast;window.chooseTrack=chooseTrack;window.setup=setup;window.examAdvance=examAdvance;window.answer=answer;window.hint=hint;window.check=check;window.next=next;window.changeMode=changeMode;window.reviewToggle=reviewToggle;window.saveNote=saveNote;window.exportNotes=exportNotes;window.copyNotes=copyNotes;window.backHome=backHome;window.resume=resume;window.discard=discard;window.progress=progress;window.confidence=confidence;
window.cachasteNativeBack=function(){if(screen!=='home'){backHome();return true}return false};
if(typeof setInterval==='function')setInterval(()=>{if(screen==='quiz'&&session?.mode==='completo'){if(Date.now()>=session.deadline){finishScienceExam();return}const el=document.getElementById('science-timer');if(el)el.textContent='Tiempo restante: '+timeRemaining()}},1000);
if(typeof window.addEventListener==='function')window.addEventListener('pagehide',store);
render();
if(typeof URLSearchParams!=='undefined'&&new URLSearchParams(window.location?.search||'').get('modo')&&['ensayo','diagnostico'].includes(new URLSearchParams(window.location.search).get('modo'))&&!session){const requested=new URLSearchParams(window.location.search).get('asignatura');if(['Biología','Física','Química','TP'].includes(requested))track=requested;setup(new URLSearchParams(window.location.search).get('modo')==='diagnostico'?'diagnostico':'completo');}
})();
