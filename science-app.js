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
let screen='home',showReview=false,displayMode='steps',copied=false;
function validateSession(value){return !!(value&&Array.isArray(value.ids)&&value.ids.length>=1&&value.ids.length<=20&&new Set(value.ids).size===value.ids.length&&value.ids.every(id=>BANK.some(q=>q.id===id))&&Number.isInteger(value.index)&&value.index>=0&&value.index<value.ids.length&&Array.isArray(value.results))}
function store(){try{localStorage.setItem(KEY,JSON.stringify({track,history,pending,notes,session}));return true}catch{message('No pudimos guardar este cambio en el dispositivo.');return false}}
function message(x){if(status)status.textContent=x}
function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
function list(pool,count){const fresh=pool.map(q=>({q,seen:history.filter(h=>h.id===q.id).length,tie:Math.random()})).sort((a,b)=>a.seen-b.seen||a.tie-b.tie);return fresh.slice(0,count).map(x=>x.q)}
function skillMap(q){const name=q.area;if(name.includes('estructura')||name.includes('celular'))return 'Busca qué estructura realiza la función indicada.';if(name.includes('Reacciones'))return 'Escribe qué entra y qué sale; comprueba la conservación de la materia.';if(name==='Mecánica')return 'Identifica las magnitudes y sus unidades antes de calcular.';if(name==='Electricidad')return 'Distingue corriente, voltaje, resistencia, potencia y energía.';return 'Subraya la variable que cambia y la evidencia que permite responder.'}
function selected(){return session?BANK.find(q=>q.id===session.ids[session.index]):null}
function chooseTrack(next){if(!['Biología','Física','Química','TP'].includes(next))return;track=next;store();render()}
function mixScience(pool){
 const remaining=[...pool],mixed=[];let last=null;
 while(remaining.length){
  const counts={};for(const q of remaining)counts[q.subject]=(counts[q.subject]||0)+1;
  const possible=remaining.filter(q=>q.subject!==last);
  const choices=(possible.length?possible:remaining).sort((a,b)=>counts[b.subject]-counts[a.subject]||Math.random()-.5);
  const next=choices[0];
  mixed.push(next);remaining.splice(remaining.indexOf(next),1);last=next.subject;
 }
 return mixed;
}
function setup(mode){let pool=[];
 if(mode==='mixto')pool=subjects.flatMap(sub=>list(BANK.filter(q=>q.module==='MC'&&q.subject===sub),3));
 else if(mode==='modulo'){
   if(track==='TP'){
    // Practica formativa: 8 comunes (3,3,2) + 4 TP (1,1,2).
    // Se compensan para mostrar las tres ciencias en partes iguales.
    const rotated=subjects[Math.floor(Math.random()*subjects.length)];
    pool=subjects.flatMap(sub=>list(BANK.filter(q=>q.module==='MC'&&q.subject===sub),sub===rotated?2:3));
    pool.push(...subjects.flatMap(sub=>list(BANK.filter(q=>q.module==='MTP'&&q.subject===sub),sub===rotated?2:1)));
   }else{
    // Formato corto proporcional: 8 MC + 4 electivos.
    // Mención elegida: 2 MC + 4 ME (6/12); otras materias: 3 MC cada una.
    pool=subjects.flatMap(sub=>list(BANK.filter(q=>q.module==='MC'&&q.subject===sub),sub===track?2:3));
    pool.push(...list(BANK.filter(q=>q.module==='ME'&&q.subject===track),4));
   }
 }else if(mode==='errores')pool=list(BANK.filter(q=>pending.includes(q.id)),10);
 else if(subjects.includes(mode))pool=list(BANK.filter(q=>q.subject===mode&&q.module==='MC'),8);
 else if(mode.startsWith('electivo:')){const sub=mode.slice(9);pool=list(BANK.filter(q=>q.subject===sub&&q.module==='ME'),4)}
 if(!pool.length){message('Por ahora no hay ejercicios pendientes en esta sección.');return}
 if(['mixto','modulo'].includes(mode))pool=mixScience(pool);
 session={ids:pool.map(q=>q.id),index:0,selected:null,checked:false,hint:0,results:[],mode,track};
 displayMode='steps';showReview=false;screen='quiz';store();render(true);
}
function backHome(){screen='home';showReview=false;store();render(true)}
function resume(){if(!session)return;screen='quiz';render(true)}
function answer(n){if(!session||session.checked||!Number.isInteger(n)||n<0||n>3)return;session.selected=n;store();render()}
function hint(){if(!session||session.checked||session.hint>=2)return;session.hint++;store();render()}
function check(){if(!session||session.checked||session.selected===null)return;const q=selected();if(!q)return;
 session.checked=true;
 const result={id:q.id,subject:q.subject,correct:session.selected===q.answer,assisted:session.hint>0,date:new Date().toISOString()};
 session.results.push(result);history.push(result);history=history.slice(-2000);
 if(result.correct&&!result.assisted)pending=pending.filter(id=>id!==q.id);
 else if(!result.correct&&!pending.includes(q.id))pending.push(q.id);
 displayMode='steps';store();render()}
function next(){if(!session||!session.checked)return;if(session.index===session.ids.length-1){screen='result';const copy=JSON.parse(JSON.stringify(session));session=null;lastResults=copy.results;store();render(true);return}
 session.index++;session.selected=null;session.checked=false;session.hint=0;showReview=false;displayMode='steps';store();render(true)}
let lastResults=[];
function changeMode(next){if(!['steps','easy','example'].includes(next))return;displayMode=next;render()}
function reviewToggle(){showReview=!showReview;render()}
function saveNote(){const q=selected(),field=document.getElementById('science-note');if(!q||!field)return;const txt=field.value.trim().slice(0,3000);if(txt){notes[q.id]={id:q.id,subject:q.subject,area:q.area,question:q.question,answer:q.options[q.answer],note:txt,updated:new Date().toISOString()}}else{delete notes[q.id]}store();showReview=false;message('Observación guardada en este dispositivo.');render()}
function exportNotes(){screen='notes';render(true)}
function copyNotes(){const el=document.getElementById('science-note-export');if(!el)return;el.focus();el.select();let ok=false;try{ok=!!document.execCommand('copy')}catch{}message(ok?'Observaciones copiadas.':'Selecciona el texto y utiliza Copiar.')}
function notesText(){return Object.values(notes).filter(x=>x&&x.note).map(x=>x.id+' | '+x.subject+' | '+x.area+'\nPregunta: '+x.question+'\nRespuesta actual: '+x.answer+'\nObservación: '+x.note+'\n').join('\n---\n')}
function reviewTitle(){return '<span class="eyebrow">Tus observaciones</span><h1>Mejoremos Ciencias juntos.</h1><p>Estas correcciones quedan guardadas solo en este celular. Puedes copiarlas para compartirlas y aplicarlas después en el banco oficial de Cachaste.</p>'}
function reviewPage(){const records=Object.values(notes).filter(x=>x&&x.note);return reviewTitle()+'<div class="card"><h2>'+records.length+' observaciones guardadas</h2>'+(records.length?'<label for="science-note-export">Informe para revisar y compartir</label><textarea id="science-note-export" readonly rows="12">'+esc(notesText())+'</textarea><div class="actions"><button class="btn" onclick="copyNotes()">Copiar observaciones</button><button class="btn secondary" onclick="backHome()">Volver</button></div>':'<p>Cuando detectes una mejora en una pregunta, entra a la explicación y toca “Proponer corrección”.</p><button class="btn secondary" onclick="backHome()">Volver</button>')+'</div>'}
function home(){
 const tracks=[['Biología','Común + mención Biología'],['Física','Común + mención Física'],['Química','Común + mención Química'],['TP','Común + modalidad TP']].map(([name,desc])=>'<button class="track '+(track===name?'active':'')+'" aria-pressed="'+(track===name)+'" onclick="chooseTrack('+JSON.stringify(name).replace(/"/g,'&quot;')+')">'+esc(name)+'<small>'+esc(desc)+'</small></button>').join('');
 const reinforcement=subjects.map(sub=>'<button class="btn secondary" onclick="setup('+JSON.stringify(sub).replace(/"/g,'&quot;')+')">Reforzar '+esc(sub)+' · 8 ejercicios</button>').join('');
 return '<span class="eyebrow">PAES Ciencias · Admisión 2027</span><h1>Una prueba, tres ciencias.</h1><p>Elige la mención que rendirás y practica Biología, Física y Química mezcladas. Tu especialidad recibe más preguntas, pero nunca dejamos de repasar las otras dos.</p>'+
 (session?'<div class="card"><h2>Tienes una práctica pendiente</h2><p>Puedes continuar donde quedaste sin perder respuestas ni pistas.</p><div class="actions"><button class="btn" onclick="resume()">Continuar mi práctica</button><button class="btn secondary" onclick="discard()">Descartar</button></div></div>':'')+
 '<div class="card"><span class="eyebrow">PASO 1 · ANTES DE LA PRUEBA</span><h2>¿Qué mención rendirás?</h2><p>El Módulo Común incluye las tres ciencias. Después se suman preguntas de la mención seleccionada o de la modalidad TP.</p><div class="track-grid">'+tracks+'</div><p class="small">Tu elección actual: <b>'+esc(track==='TP'?'Técnico-Profesional':track)+'</b>. Puedes cambiarla antes de comenzar.</p><div class="module-preview"><strong>Así será tu práctica de 12 preguntas</strong><p>'+(track==='TP'?'8 comunes de las tres ciencias + 4 de refuerzo TP, distribuidas para practicar las tres áreas.':'8 comunes de las tres ciencias + 4 de mención '+esc(track)+'. En total: 6 de '+esc(track)+' y 3 de cada una de las otras ciencias.')+'</p><p class="small">Las preguntas aparecerán intercaladas, no agrupadas por asignatura. Es una práctica formativa, no un ensayo oficial de 80.</p></div><button class="btn" onclick="setup(&quot;modulo&quot;)">Comenzar Ciencias mixtas · 12 preguntas</button></div>'+
 '<div class="card"><h2>Diagnóstico de todas las ciencias</h2><p>Nueve preguntas comunes: tres de Biología, tres de Física y tres de Química, intercaladas.</p><button class="btn secondary" onclick="setup(&quot;mixto&quot;)">Diagnóstico mixto · 9 preguntas</button></div>'+
 '<details class="card reinforcement"><summary>Refuerzo por materia · opcional</summary><p>Úsalo para mejorar una dificultad específica, pero vuelve al entrenamiento mixto para mantener frescas las otras materias.</p><div class="stack">'+reinforcement+'</div><p class="small">La profundización de cada mención también está disponible para practicar conceptos específicos.</p><div class="subject-grid">'+subjects.map(sub=>'<button class="btn secondary" onclick="setup('+JSON.stringify('electivo:'+sub).replace(/"/g,'&quot;')+')">Profundizar '+esc(sub)+'</button>').join('')+'</div></details>'+
 '<div class="card"><h2>Lo que vas aprendiendo</h2><p>'+history.length+' respuestas registradas · '+pending.length+' ejercicios por reforzar.</p><div class="actions"><button class="btn secondary" onclick="progress()">Progreso de las tres ciencias</button><button class="btn secondary" onclick="setup(&quot;errores&quot;)" '+(!pending.length?'disabled':'')+'>Repasar errores</button><button class="btn secondary" onclick="exportNotes()">Mis correcciones ('+Object.keys(notes).length+')</button></div></div>'+
 '<p class="small">La prueba real tiene 80 preguntas: 54 del Módulo Común y 26 del electivo o TP; su duración es de 160 minutos. No habilitamos un simulacro completo mientras falte ampliar y revisar el banco.</p>';
}
function discard(){session=null;store();render()}
function feedback(q){const ok=session.selected===q.answer;const content=displayMode==='easy'?'<p>'+esc(q.easy)+'</p>':displayMode==='example'?'<p>'+esc(q.example)+'</p>':'<ol class="checklist">'+q.steps.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>';
 return '<div class="explain '+(ok?'':'error')+'" role="status"><h3>'+(ok?(session.hint?'¡Cachaste, con una pista!':'¡Cachaste!'):'Todavía no, pero vamos a entenderlo.')+'</h3><p><b>Respuesta correcta:</b> '+esc(q.options[q.answer])+'</p><p>'+esc(q.explanations[session.selected])+'</p></div><div class="card"><h3>Te lo explico como prefieras</h3><div class="tabrow"><button class="btn secondary" onclick="changeMode(&quot;steps&quot;)">Paso a paso</button><button class="btn secondary" onclick="changeMode(&quot;easy&quot;)">Más fácil</button><button class="btn secondary" onclick="changeMode(&quot;example&quot;)">Con un ejemplo</button></div>'+content+'</div>';
}
function question(){const q=selected();if(!q)return '<div class="card">No encontramos esa pregunta. <button class="btn" onclick="backHome()">Inicio</button></div>';
 const count=session.ids.length;const options=q.options.map((x,n)=>'<button class="option '+(session.selected===n?'selected ':'')+(session.checked&&n===q.answer?'right ':session.checked&&session.selected===n?'wrong ':'')+'" aria-pressed="'+(session.selected===n)+'" onclick="answer('+n+')" '+(session.checked?'disabled':'')+'>'+String.fromCharCode(65+n)+') '+esc(x)+'</button>').join('');
 const hintText=session.hint?'<div class="hint" role="status"><b>Pista '+session.hint+' de 2</b><p>'+esc(skillMap(q))+'</p>'+(session.hint===2?'<p><b>Primer paso:</b> '+esc(q.steps[0])+'</p>':'')+'</div>':'';
 const note=notes[q.id]?.note||'';
 return '<div class="row"><span class="eyebrow">'+esc(q.subject)+' · '+esc(q.module)+'</span><span class="pill">'+(session.index+1)+' / '+count+'</span></div><div class="bar"><div style="width:'+((session.index+1)/count*100)+'%"></div></div><div class="card"><p class="small">'+esc(q.area)+' · '+esc(q.skill)+'</p><h2>'+esc(q.question)+'</h2><div class="stack">'+options+'</div>'+(session.checked?feedback(q):hintText+'<div class="actions"><button class="btn soft" '+(session.hint===2?'disabled':'')+' onclick="hint()">'+(session.hint===0?'Necesito una pista':session.hint===1?'Dame otra pista':'Ya tienes dos pistas')+'</button><button class="btn" '+(session.selected===null?'disabled':'')+' onclick="check()">Comprobar respuesta</button></div>')+(session.checked?'<div class="actions"><button class="btn" onclick="next()">'+(session.index===count-1?'Ver mi resultado':'Siguiente pregunta →')+'</button></div>':'')+'</div>'+
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
function render(scroll=false){if(!view)return;view.innerHTML=screen==='quiz'&&session?question():screen==='result'?result():screen==='progress'?progressPage():screen==='notes'?reviewPage():home();if(scroll)window.scrollTo(0,0)}
window.chooseTrack=chooseTrack;window.setup=setup;window.answer=answer;window.hint=hint;window.check=check;window.next=next;window.changeMode=changeMode;window.reviewToggle=reviewToggle;window.saveNote=saveNote;window.exportNotes=exportNotes;window.copyNotes=copyNotes;window.backHome=backHome;window.resume=resume;window.discard=discard;window.progress=progress;
window.cachasteNativeBack=function(){if(screen!=='home'){backHome();return true}return false};
render();
})();
