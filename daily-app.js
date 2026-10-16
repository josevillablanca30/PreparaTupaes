(function(){'use strict';
 const root=document.getElementById('daily-root'),traditional=document.getElementById('traditional-section'),C=window.CachasteCurriculum,{items,texts}=window.CACHASTE_DAILY_CATALOG,E=window.CachasteDaily.create(localStorage,items,C.subjects),B=window.CachasteBasics.attach(E),esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let subject=Object.hasOwn(C.subjects,E.state.subject)?E.state.subject:'M1',notice='',profileCache=new Map();
 const profile=s=>{if(!profileCache.has(s))profileCache.set(s,E.profile(s));return profileCache.get(s);};
 const poses={neutral:[0,0],explaining:[1,0],thinking:[2,0],celebrating:[0,1],error:[1,1],encouraging:[1,1],walking:[2,1]};
 const avatar=(state,size='')=>{const[c,r]=poses[state]||poses.neutral;return'<span class="cat-frame '+size+'" role="img" aria-label="Gatito sabio '+esc(state)+'"><img src="assets/gatito-sabio-poses-v1.png" alt="" style="left:'+(-c*100)+'%;top:'+(-r*100)+'%" width="1536" height="1024"></span>';};
 const cat=(state,text)=>'<aside class="wise-cat" data-cat-state="'+state+'" aria-live="polite">'+avatar(state)+'<p>'+esc(text)+'</p></aside>';
 const teacherStep=(state,text,index,total,withMascot=true)=>'<div class="teacher-step'+(withMascot?'':' text-only')+'"><div class="teacher-step-meta">IDEA CLAVE · PASO '+(index+1)+' DE '+total+'</div>'+(withMascot?'<div class="wise-cat" data-cat-state="'+state+'">'+avatar(state)+'<p class="lesson-text">'+esc(text)+'</p></div>':'<p class="lesson-text">'+esc(text)+'</p>')+'</div>';
 const button=(action,label,attrs='',cls='')=>'<button type="button" data-action="'+action+'" '+attrs+' class="'+cls+'">'+esc(label)+'</button>';
 const scrollToLessonStart=()=>{window.scrollTo(0,0);requestAnimationFrame(()=>{if(document.scrollingElement)document.scrollingElement.scrollTop=0;window.scrollTo(0,0);});};
 const goto=hash=>{if(location.hash!==hash){location.hash=hash;return;}render();scrollToLessonStart();};
 const selectedSubject=()=>button('courses',C.subjects[subject].name+(subject==='Ciencias'?' · '+(E.state.track||'Elige tu mención'):''),'','course-switch');
 const pool=()=>C.sciencePool(items,subject==='Ciencias'?E.state.track:null);
 function units(){return C.course(pool(),subject);}
 function levels(){return units().flatMap(u=>u.levels);}
 function levelState(l){return profile(subject).find(p=>p.concept===l.objective)||{status:'sin explorar',evidence:[]};}
 function recommend(){const all=levels(),available=l=>E.select(subject,1,{concept:l.objective}).questions.length>0;return all.find(l=>levelState(l).status==='por reforzar'&&available(l))||all.find(l=>levelState(l).status==='por comprobar'&&available(l))||all.find(l=>levelState(l).status!=='comprobado'&&available(l))||all[0];}
 function pendingBasic(){return B.lessons.filter(l=>(l.subject||'M1')===subject||(subject==='M2'&&!l.subject)).find(l=>!B.status(l.id).complete); }
 function learningPace(){const recent=E.state.completed.filter(x=>x.subject===subject&&Number(x.total)>0).slice(-6),strong=recent.filter(x=>Number(x.correct)/Number(x.total)>=.85),mastered=profile(subject).filter(x=>x.status==='comprobado').length;return recent.length>=3&&strong.length>=3&&mastered>=2?'rápido':recent.length>=2?'guiado':'inicial';}
 function paceMessage(){const pace=learningPace();return pace==='rápido'?'¡Vas muy bien! Puedes explorar una unidad más avanzada cuando quieras.':pace==='guiado'?'Cada intento nos muestra qué reforzar. Sigue a tu ritmo.':'Partimos desde lo más sencillo. Si ya sabes un tema, puedes avanzar a otra unidad sin esperar.';}
 function navigate(h){return'<nav class="daily-nav" aria-label="Navegación principal">'+[['home','⌂','Aprender'],['practice','↯','Practicar'],['progress','◉','Mi progreso'],['traditional','▤','Ensayos']].map(([a,icon,label])=>'<button data-action="'+a+'" aria-current="'+((h==='#'+a||a==='home'&&h==='#path')?'page':'false')+'"><span aria-hidden="true">'+icon+'</span>'+label+'</button>').join('')+'</nav>';}
 function toolbar(){const stats=E.stats();return'<header class="game-toolbar">'+selectedSubject()+'<div class="game-totals"><span aria-label="'+stats.streak+' días de racha">♨ '+stats.streak+'</span><span aria-label="'+stats.xp+' puntos de experiencia">✦ '+stats.xp+'</span></div></header>';}
 function courses(){const icons={M1:'±',M2:'ƒ',Lectura:'Aa',Ciencias:'⚗',Historia:'H'};return'<section class="course-picker"><h1>¿Qué quieres aprender?</h1>'+cat('neutral','Elige una materia. Guardaré tu lugar en cada recorrido.')+'<div class="course-choices">'+Object.entries(C.subjects).map(([key,v])=>'<button data-action="pick-course" data-subject="'+key+'" class="course-tile"><span class="course-icon '+key+'" aria-hidden="true">'+icons[key]+'</span><span><strong>'+v.name+'</strong><small>'+(key==='Ciencias'?'Biología, Física, Química o TP':key==='M1'?'Desde las bases hasta la PAES':key==='M2'?'Profundiza con apoyo de M1':key==='Lectura'?'Encuentra, interpreta y evalúa':'Comprende procesos y ciudadanía')+'</small></span><span aria-hidden="true">›</span></button>').join('')+'</div>'+button('home','Volver a mi recorrido')+'</section>';}
 function tracks(){return'<h1>Tu camino en Ciencias</h1>'+cat('explaining','Todos los caminos incluyen las tres ciencias. Tu mención agrega profundidad en la especialidad que elijas.')+'<div class="course-choices">'+[['Biología','Células, organismos y herencia','🧬'],['Física','Movimiento, ondas y energía','⚡'],['Química','Materia, átomos y reacciones','⚗'],['TP','Formación técnico profesional','TP']].map(([key,description,icon])=>'<button class="course-tile" data-action="pick-track" data-track="'+key+'"><span class="course-icon">'+icon+'</span><span><strong>'+key+'</strong><small>'+description+'</small></span><span>›</span></button>').join('')+'</div>'+button('courses','Volver a materias');}
 function stageKey(){return subject+(subject==='Ciencias'?':'+E.state.track:'');}
 function stage(){const list=units(),saved=E.state.stages?.[stageKey()];if(saved==='basics'&&(E.state.basicsOptional?.[stageKey()]||E.state.foundationDraft&&B.lesson(E.state.foundationDraft.lesson)?.subject===subject))return{basic:true};const found=list.find(u=>u.axis+'|'+u.name===saved);if(found)return{unit:found};return{unit:list[0]||null};}
 function examKey(u){return u.axis+'|'+u.name;}
 function examResult(u){return E.state.unitExams?.[subject+':'+(subject==='Ciencias'?E.state.track||'':'')+':'+examKey(u)];}
 function examPanel(u){if(!u)return '';const result=examResult(u),concepts=u.levels.map(l=>l.objective),bank=items.filter(q=>q.subjectKey===subject&&concepts.includes(q.concept)&&(subject!=='Ciencias'||q.module==='MC'||(E.state.track==='TP'?q.module==='MTP':q.module==='ME'&&q.subject===E.state.track))),families=new Set(bank.map(q=>q.family));return '<section class="pace-panel"><h2>¿Ya dominas esta unidad?</h2><p>Rinde una prueba de 10 preguntas. Con 8 respuestas correctas o más puedes eximirte y pasar a la siguiente unidad. No hay pistas durante la prueba.</p>'+(result?'<p role="status">Último resultado: '+result.correct+'/10 · '+(result.passed?'Unidad eximida':'Sigue reforzando y vuelve a intentarlo')+'</p>':'')+(families.size>=10?button('unit-exam','Dar prueba para eximirme','data-unit="'+esc(examKey(u))+'"','primary'):'<p>Esta unidad todavía no dispone de diez preguntas diferentes para una prueba válida.</p>')+'</section>';}
 function saveStage(key){(E.state.stages||={})[stageKey()]=key;(E.state.basicsOptional||={})[stageKey()]=key==='basics';E.save();}
 // Ruta ondulante: adaptación de lesson-button.tsx, © 2024 Mohanad AL Faleet (MIT).
 function trailOffset(index){const phase=index%8;const indentation=phase<=2?phase:phase<=4?4-phase:phase<=6?4-phase:phase-8;return -indentation*29;}

 function sceneTheme(basic,u){if(subject==='Lectura')return'reading';if(subject==='Ciencias')return'science';if(subject==='Historia')return'history';if(basic)return'foundation';if(subject==='M2')return'cosmic';const a=(u?.axis||'').toLowerCase();return a.includes('geometr')?'geometry':a.includes('álgebra')?'algebra':a.includes('probabilidad')?'night':'numbers';}
 function sceneMotif(theme){return({foundation:'La aldea de los fundamentos',numbers:'Las colinas de los números',algebra:'El bosque de las ecuaciones',geometry:'El valle de las formas',night:'El observatorio de los datos',cosmic:'La galaxia matemática',reading:'El bosque de las historias',science:'El laboratorio de los descubrimientos',history:'La ruta del tiempo'})[theme]||'Tu siguiente aventura';}
 function levelComplete(l,basic){return basic?B.status(l.id).complete:levelState(l).status==='comprobado';}
 function node(l,i,basic=false,currentId=''){
  const p=basic?B.status(l.id):levelState(l),done=levelComplete(l,basic),practiced=basic?p.attempts>0:p.status!=='sin explorar',next=!done&&l.id===currentId;
  const attrs=basic?'data-basic="'+esc(l.id)+'"':'data-level="'+esc(l.id)+'"';
  const state=done?'mastered':next?'current':practiced?'practiced':'waiting';
  const label=done?'Completado':next?'Jugar misión':practiced?'Reforzar':'Por descubrir';
  return '<li class="trail-stop '+state+'" data-map-stop="'+i+'" style="--offset:'+trailOffset(i)+'px;--quest-index:'+i+'">'+
   '<div class="trail-interaction">'+
   '<button type="button" class="trail-node" data-action="'+(basic?'basic-level':'level')+'" '+attrs+' aria-label="'+esc(l.title||l.objective)+' · '+label+'"><span aria-hidden="true">'+(done?'✓':next?'★':practiced?'↗':i+1)+'</span></button>'+
   (next?'<span class="trail-guide" aria-hidden="true">'+avatar('walking','map-guide')+'</span>':'')+
   '</div><strong>'+esc(l.title||l.objective)+'</strong>'+
   '<small class="trail-status">'+(done?'✓ Misión completada':next?'▶ JUGAR AHORA':practiced?'Volver a practicar':'Misión '+(i+1))+'</small></li>';
 }
 function worldMap(ls,basic,u,n,list,current){
  const theme=sceneTheme(basic,u),total=ls.length,completed=ls.filter(l=>levelComplete(l,basic)).length,allDone=total>0&&completed===total;
  const isLast=basic?list.length===0:!list[n+1],guide=allDone?'¡Dominaste las misiones de esta zona! Puedes explorar el siguiente mundo.':completed?'Buen avance. Las misiones pendientes te esperan en el camino.':'Elige una estrella para comenzar tu aventura.';
  return '<section class="adventure-world world-'+theme+'" aria-label="Mapa de misiones: '+esc(sceneMotif(theme))+'">'+
   '<div class="world-landscape" aria-hidden="true"><span class="world-orb"></span><span class="world-cloud cloud-a"></span><span class="world-cloud cloud-b"></span><span class="world-hills far"></span><span class="world-hills near"></span><span class="world-tower tower-a"></span><span class="world-tower tower-b"></span><span class="world-sprout sprout-a"></span><span class="world-sprout sprout-b"></span></div>'+
   '<header class="world-hud"><div><span class="world-kicker">MUNDO '+(n+1)+'</span><h2>'+esc(sceneMotif(theme))+'</h2><p>'+completed+' de '+total+' misiones dominadas</p></div><div class="world-medal" aria-label="'+completed+' misiones completadas">✦ <strong>'+completed+'/'+total+'</strong></div></header>'+
   '<div class="world-quest-banner"><span class="quest-signal" aria-hidden="true">✦</span><div><span class="quest-eyebrow">'+(allDone?'MUNDO SUPERADO':'MISIÓN ACTUAL')+'</span><strong>'+esc(allDone?'Todas las misiones dominadas':((current||ls[0])?.title||(current||ls[0])?.objective||'Elige tu desafío'))+'</strong></div>'+
   (current?button(basic?'basic-level':'level','Jugar',basic?'data-basic="'+esc(current.id)+'"':'data-level="'+esc(current.id)+'"','primary'):button('next-stage','Explorar','', 'primary'))+
   '</div>'+
   '<svg class="adventure-road" viewBox="0 0 400 900" preserveAspectRatio="none" aria-hidden="true"><path class="road-shadow"></path><path class="road-track"></path><path class="road-cleared"></path></svg>'+
   '<ol class="learning-trail daily-levels">'+ls.map((l,i)=>node(l,i,basic,current?.id||'')).join('')+'</ol>'+
   '<div class="world-gate '+(allDone?'gate-ready':'gate-distant')+'"><div class="world-gate-mark" aria-hidden="true"><span>✦</span></div>'+(allDone?'<div class="world-gate-cat" aria-hidden="true">'+avatar('celebrating','map-portal-cat')+'</div>':'')+'<div class="world-gate-copy"><strong>'+(allDone?'¡Mundo completado!':'Portal a otra etapa')+'</strong><p>'+guide+'</p></div>'+
   (isLast?button('units','Ver otros mundos','','gate-button'):button('next-stage',allDone?'Entrar al siguiente mundo':'Explorar otro mundo','','gate-button'))+
   '</div></section>';
 }

 function missionTeaser(stats){const done=Math.min(3,Number(stats.mission)||0);return '<section class="mission-teaser" aria-label="Misión de hoy"><div><strong>Tu misión de hoy</strong><p>'+done+' de 3 preguntas · '+(done===3?'¡Completada!':'Un ratito de práctica suma')+'</p><div class="daily-quest-progress" role="progressbar" aria-label="Preguntas de hoy" aria-valuemin="0" aria-valuemax="3" aria-valuenow="'+done+'"><span style="width:'+Math.round(done/3*100)+'%"></span></div></div>'+button(done===3?'progress':'mission-practice',done===3?'Ver logros':'Practicar')+'</section>';}


 function curriculumOverview(expanded=false){
  const scope=C.secondaryScope?.[subject]||[],list=units(),roadmap=C.roadmap(pool(),subject),ready=roadmap.reduce((a,x)=>a+x.readyLevels,0),total=roadmap.reduce((a,x)=>a+x.levels,0);
  const topicGroups=[...new Set(list.map(u=>u.axis))];
  return '<details class="curriculum-overview"'+(expanded?' open':'')+'><summary><span>Programa de enseñanza media</span><strong>Ver contenidos de 1.º a 4.º medio</strong></summary>'+
   '<p class="curriculum-overview-note">Los contenidos se ordenan según los ejes DEMRE y los índices de los materiales de preparación revisados. Avanza por la ruta o elige una unidad; los prerrequisitos se refuerzan solo cuando hacen falta.</p>'+
   '<div class="curriculum-scope">'+scope.map(x=>'<div class="scope-theme"><strong>'+esc(x.title)+'</strong><p>'+esc(x.topics)+'</p></div>').join('')+'</div>'+
   '<p class="curriculum-coverage"><strong>Disponible ahora:</strong> '+list.length+' unidades del banco actual, distribuidas en '+topicGroups.length+' ejes. '+(ready+' de '+total+' habilidades tienen al menos dos variantes en el banco. Las demás necesitan más ejercicios; este mapa no declara cubierta toda la enseñanza media.')+'</p>'+
   button('units','Explorar las unidades disponibles','','primary')+'</details>';
 }

 function home(){
  if(subject==='Ciencias'&&!E.state.track)return tracks();
  const selected=stage(),list=units(),u=selected.unit,basic=!!selected.basic;
  const ls=basic?B.lessons.filter(l=>(l.subject||'M1')===subject||(subject==='M2'&&!l.subject)):u?.levels||[];
  const n=basic?0:Math.max(0,list.findIndex(x=>examKey(x)===examKey(u))),title=basic?(subject==='M1'||subject==='M2'?'Construyamos la base':'Tu primera misión PAES'):u?.name||'Tu recorrido',stats=E.stats(),active=E.state.session||E.state.foundationDraft;
  const current=ls.find(l=>l.id===(basic?pendingBasic()?.id:recommend()?.id)&&!levelComplete(l,basic))||ls.find(l=>!levelComplete(l,basic))||null;
  return toolbar()+'<section class="stage-banner"><span>ETAPA '+(n+1)+' · '+esc(basic?starterTitle():u?.axis||'Mi recorrido')+'</span><h1>'+esc(title)+'</h1>'+button('units','Elegir mundo','','unit-link')+'</section>'+
   (active?'<div class="resume-strip">'+button('resume','Continuar mi sesión guardada','','primary')+'</div>':'')+
   curriculumOverview(false)+worldMap(ls,basic,u,n,list,current)+
   '<div class="world-after"><p>'+esc(paceMessage())+'</p>'+button('focus-quest','Encontrar mi misión','','focus-quest')+'</div>'+
   pendingReviewPanel()+missionTeaser(stats)+(basic?'':examPanel(u));
 }




 function unitPicker(){
  const list=units(),sourceRoute=C.roadmap(pool(),subject),basics=B.lessons.filter(l=>(l.subject||'M1')===subject||(subject==='M2'&&!l.subject));
  const mastered=profile(subject).filter(p=>p.status==='comprobado').length;
  const lessonTile=(stage,i,basic=false)=>{
   const done=stage.ls.filter(l=>levelComplete(l,basic)).length,whole=stage.ls.length,finished=whole>0&&done===whole,theme=sceneTheme(basic,stage.u);
   const note=basic?'Refuerzo voluntario cuando te falta una base':stage.meta.partial?'Ejercitación en ampliación · sigue avanzando':'Con variantes para practicar y comprobar';
   return '<button type="button" class="world-picker-tile world-'+theme+(basic?' optional-support':'')+'" data-action="stage" data-stage="'+esc(stage.id)+'"><span class="world-picker-number">'+(basic?'↩':finished?'✓':i+1)+'</span><span class="world-picker-details"><small>'+esc(stage.axis)+'</small><strong>'+esc(stage.name)+'</strong><span>'+done+' de '+whole+' misiones dominadas</span><span class="world-tile-evidence">'+esc(note)+(basic?'':' · '+stage.meta.questions+' preguntas en el banco')+'</span></span><span class="world-picker-arrow" aria-hidden="true">›</span></button>';
  };
  let idx=0;
  return toolbar()+'<section class="world-picker"><span class="world-picker-kicker">TU AVENTURA PAES</span><h1>Programa y misiones</h1>'+
   '<p>La ruta sigue los ejes evaluados por DEMRE y las secuencias pedagógicas de los preuniversitarios. La dificultad aumenta según tu desempeño: no tienes que repetir contenidos de básica.</p>'+
   curriculumOverview(true)+
   '<div class="world-picker-list">'+sourceRoute.map(section=>{
    const cards=section.units.map(u=>{const original=list.find(x=>x.axis+'|'+x.name===u.id);return lessonTile({ls:original.levels,name:original.name,axis:original.axis,id:u.id,u:original,meta:u},++idx)}).join('');
    return '<section class="curriculum-chapter"><header class="curriculum-chapter-header"><small>EJE DE ESTUDIO '+(sourceRoute.indexOf(section)+1)+'</small><h2>'+esc(section.axis)+'</h2><p>'+esc(section.goal)+'</p><div class="curriculum-source">Referencia didáctica: '+esc(section.source)+'</div><span class="curriculum-chapter-evidence">'+section.questions+' preguntas · '+section.readyLevels+'/'+section.levels+' habilidades con variantes disponibles</span></header><div class="curriculum-chapter-units">'+cards+'</div></section>';
   }).join('')+
   (basics.length?'<section class="curriculum-chapter support-chapter"><header class="curriculum-chapter-header"><small>REFUERZO VOLUNTARIO</small><h2>Solo si necesitas recuperar una base</h2><p>No es parte obligatoria de tu recorrido PAES.</p></header>'+lessonTile({ls:basics,name:'Reforzar prerrequisitos',axis:'Herramienta de apoyo',id:'basics'},idx+1,true)+'</section>':'')+
   '</div><p>'+mastered+' habilidades comprobadas en '+esc(C.subjects[subject].name)+'.</p>'+button('home','Volver al mapa','','primary')+'</section>';
 }


 function level(id){
  const l=levels().find(l=>l.id===id);if(!l)return home();
  const u=units().find(u=>u.levels.some(x=>x.id===l.id)),p=levelState(l),source=C.sources?.[subject]?.[u?.axis];
  const checks=items.filter(q=>q.subjectKey===subject&&q.concept===l.objective&&(subject!=='Ciencias'||q.module==='MC'||(E.state.track==='TP'?q.module==='MTP':q.module==='ME'&&q.subject===E.state.track)));
  const families=new Set(checks.map(q=>q.family)),studio=window.CachasteStudios.get(subject,l.objective);
  const support=C.prerequisites(subject,l.objective).map(req=>{
   const target=C.course(items,req.subject).flatMap(u=>u.levels).find(x=>x.objective===req.concept);
   return target?'<div class="prerequisite-card"><p>Si este contenido se te complica, puedes repasar <strong>'+esc(req.concept)+'</strong> en '+esc(C.subjects[req.subject].name)+'.</p>'+button('base','Repasar esa base','data-subject="'+esc(req.subject)+'" data-level="'+esc(target.id)+'"')+'</div>':'';
  }).join('');
  return '<div class="lesson-top">'+button('home','← Volver al camino')+'<span>Desafío PAES</span></div>'+
   '<section class="mission-preview"><span class="mission-emblem" aria-hidden="true">✦</span>'+
   '<span class="mission-kicker">'+esc(u?.axis||C.subjects[subject].name)+' · '+esc(u?.name||'Misión')+'</span>'+
   '<h1>'+esc(l.objective)+'</h1><p>'+esc(source?.goal||'Aprende a resolver y justificar situaciones con esta habilidad.')+'</p>'+
   cat('encouraging','¿Ya manejas este contenido? Pruébalo directamente. Si necesitas apoyo, te lo explico con ejemplos y luego lo comprobamos.')+
   '<div class="daily-actions mission-actions">'+button('check-first','Probar lo que sé','data-concept="'+esc(l.objective)+'"','primary')+
   button('lesson','Aprender con el gatito','data-concept="'+esc(l.objective)+'"')+
   button('study','Ver la explicación','data-level="'+esc(l.id)+'"')+(studio?button('studio-open','Jugar taller completo','data-studio="'+esc(studio.id)+'"','studio-entry'):'')+'</div>'+
   '<p class="mission-meta">'+(families.size>=2?'Hay '+families.size+' variantes independientes del concepto.':'Este concepto todavía necesita más variantes de ejercicios. No te mostraremos un dominio ficticio.')+'</p>'+support+
   (p.status==='comprobado'?'<p>Ya demostraste este aprendizaje. Puedes reforzarlo cuando quieras.</p>':'')+'</section>';
 }


 function studio(){
  const P=window.CachasteStudios,d=E.state.studioDraft,l=P.byId.get(d?.id);
  if(!l||!P.valid(d))return home();
  if(l.subject!==subject)return home();
  const progress=profile(subject).find(p=>p.concept===l.concept),evidence=(progress?.status||'sin explorar');
  const header='<div class="lesson-top">'+button('studio-exit','← Volver a mi recorrido')+'<span>'+esc(C.subjects[subject].name)+'</span></div>'+
   '<div class="studio-progress" role="progressbar" aria-valuemin="0" aria-valuemax="3" aria-valuenow="'+(d.stage==='learn'?1:d.stage==='match'?2:3)+'" aria-label="Etapa del taller"><span style="width:'+((d.stage==='learn'?1:d.stage==='match'?2:3)/3*100)+'%"></span></div>';
  const evidenceLine='<p class="studio-evidence">Dominio PAES: <strong>'+esc(evidence)+'</strong>. Acertar en un minijuego no modifica este resultado: se comprueba con preguntas nuevas y sin ayuda.</p>';
  if(d.stage==='learn'){
   const c=l.cards[d.card];
   return header+'<section class="studio-panel"><span class="studio-kicker">LABORATORIO PAES · CONCEPTO '+(d.card+1)+'/'+l.cards.length+'</span>'+
    '<h1>'+esc(l.title)+'</h1><p>'+esc(l.intro)+'</p>'+
    '<div class="studio-goals"><strong>Qué aprenderás</strong><ul>'+l.goals.map(g=>'<li>'+esc(g)+'</li>').join('')+'</ul></div>'+
    '<article class="studio-card"><h2>'+esc(c.title)+'</h2>'+cat('explaining',c.text)+'</article>'+
    '<div class="studio-actions">'+button('studio-next-card',d.card+1<l.cards.length?'Siguiente idea':'Jugar: conecta las ideas','','primary')+'</div>'+
    '<small class="studio-source">Referencia curricular: '+esc(l.source)+'. Explicaciones originales de ¿Cachaste?.</small></section>';
  }
  if(d.stage==='match'){
   const pair=l.pairs[d.round],order=P.choices(l,d.round),wrong=d.checked&&!d.seen.at(-1)?.correct;
   return header+'<section class="studio-panel"><span class="studio-kicker">JUEGO DE RELACIONES · '+(d.round+1)+'/'+l.pairs.length+'</span><h1>Conecta concepto y evidencia</h1>'+
    cat(d.checked?(wrong?'thinking':'celebrating'):'encouraging',wrong?'Esa relación tiene un detalle importante. Revisa el porqué.':d.checked?'¡Bien conectado!':'Elige la explicación que corresponde a la situación. No se trata de memorizar palabras.')+
    '<div class="studio-scenario"><strong>Situación</strong><p>'+esc(pair.prompt)+'</p></div>'+
    '<div class="studio-options">'+order.map(id=>button('studio-choice',l.pairs[id].answer,'data-choice="'+id+'" '+(d.checked?'disabled':'')+' aria-pressed="'+(d.selected===id)+'"','studio-choice'+(d.checked&&id===d.round?' studio-right':'')+(d.checked&&id===d.selected&&id!==d.round?' studio-wrong':''))).join('')+'</div>'+
    (d.checked?'<div class="studio-feedback" role="status"><strong>'+(wrong?'Revisa la relación':'¡Evidencia conectada!')+'</strong><p>'+esc(pair.why)+'</p>'+(wrong?'<p class="studio-repair">'+esc(l.confusion)+'</p>':'')+'</div>':'')+
    '<div class="studio-actions">'+(d.checked?button('studio-advance',d.round+1<l.pairs.length?'Siguiente relación':'Ver mi resultado','','primary'):button('studio-check','Comprobar',d.selected===null?'disabled':'','primary'))+'</div>'+
    '<p class="studio-evidence">Aquí puedes equivocarte sin perder vidas ni XP. El resultado no acredita dominio.</p></section>';
  }
  const strong=d.correct===l.pairs.length,message=strong?'Conectaste todas las relaciones. Lo importante ahora es transferir la idea a problemas nuevos.':'Identificamos relaciones que todavía necesitan refuerzo. Puedes repetir el juego o demostrar lo que sabes directamente.';
  const subjectQuestions=items.filter(q=>q.subjectKey===subject&&q.concept===l.concept&&(subject!=='Ciencias'||q.module==='MC'||(E.state.track==='TP'?q.module==='MTP':q.module==='ME'&&q.subject===E.state.track)));
  const families=new Set(subjectQuestions.map(q=>q.family)).size;
  return header+'<section class="studio-panel studio-complete">'+avatar(strong?'celebrating':'encouraging','hero')+
   '<span class="studio-kicker">TALLER PRÁCTICO COMPLETADO</span><h1>'+esc(l.title)+'</h1><p>'+esc(message)+'</p>'+
   '<div class="studio-score"><strong>'+d.correct+'/'+l.pairs.length+'</strong><span>relaciones correctas · '+d.mistakes+' por revisar</span></div>'+evidenceLine+
   '<div class="studio-actions">'+(families>=2?button('studio-assess','Comprobar con ejercicios PAES','','primary'):'<p>Este concepto necesita más familias independientes para una comprobación justa.</p>')+
   button('studio-lesson','Ordenar razonamiento con el gatito')+button('studio-retry','Practicar las relaciones otra vez')+
   button('studio-exit','Volver al camino')+'</div><small class="studio-source">Referencias: '+esc(l.source)+'</small></section>';
 }

 function starterMessage(phase,good=false){
  if(subject==='Historia')return phase==='question'?'Analiza las causas y los efectos. Busca la alternativa con mejor evidencia.':good?'¡Bien fundamentado! Ahora aplicaremos ese criterio a otro caso.':'Revisa qué causa, consecuencia o evidencia descarta las otras alternativas.';
  if(subject==='Lectura')return phase==='question'?'Lee los matices: elige lo que el texto permite concluir.':good?'Buena interpretación. Comprobemos si puedes transferirla.':'Contrasta tu alternativa con lo que el texto afirma realmente.';
  if(subject==='Ciencias')return phase==='question'?'Identifica las variables y comprueba qué conclusión permiten los datos.':good?'Bien razonado. Probemos otra situación.':'Vuelve al diseño del experimento: ¿qué cambia y qué se mantiene?';
  return phase==='question'?'Observa el ejemplo y elige la operación que corresponde.':good?'¡Buena! Vamos a probarlo de otra manera.':'Revisemos el procedimiento para encontrar en qué paso cambió el resultado.';
 }
 function starterTitle(){return ['Historia','Lectura','Ciencias'].includes(subject)?'Herramientas PAES':'Fundamentos';}
 function basicLevel(id){
  const l=B.lesson(id);if(!l)return home();
  const unitLessons=B.lessons.filter(x=>(x.subject||'M1')===(l.subject||'M1')),mission=unitLessons.findIndex(x=>x.id===l.id)+1;
  const nonMath=!!l.subject&&l.subject!=='M1',intro=nonMath?'Trabajaremos un caso conectado con la PAES. El objetivo es analizar, no memorizar definiciones obvias.':'Construyamos las ideas desde ejemplos para que puedas resolver preguntas más difíciles.';
  return '<div class="lesson-top">'+button('home','← Volver al camino')+'</div>'+
   '<section class="mission-preview"><span class="mission-emblem" aria-label="Misión '+mission+'">'+mission+'</span><span class="mission-kicker">'+esc(starterTitle())+' · Misión '+mission+'</span><h1>'+esc(l.title)+'</h1><p>'+esc(l.goal)+'</p>'+cat('encouraging',intro)+
   '<p class="mission-meta">3 ideas clave y desafíos de aplicación. Puedes pedir una pista cuando la necesites.</p>'+
   button('basic-start','Comenzar desafío','data-basic="'+esc(l.id)+'"','primary')+'</section>';
 }
 function basicSession(){
  const d=E.state.foundationDraft;if(!d)return home();
  const l=B.lesson(d.lesson),q=B.current(),learning=d.stage==='learn',card=l.cards[d.card],feedback=d.results.at(-1);
  const progress=Math.min(100,Math.max(0,Math.round((learning?(d.card+1)/(l.cards.length+2):(l.cards.length+d.index+1)/(l.cards.length+d.queue.length))*100)));
  const talking=learning?'':cat(d.checked?(feedback.correct?'celebrating':'error'):'thinking',d.checked?starterMessage('feedback',feedback.correct):starterMessage('question'));
  return '<div class="lesson-top">'+button('pause','✕ Pausar')+'<span>'+esc(l.title)+'</span></div>'+
   '<div class="lesson-meter" role="progressbar" aria-label="Avance de la lección" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+progress+'"><span style="width:'+progress+'%"></span></div>'+
   '<article class="lesson-sheet">'+(learning?'<h1>'+esc(card.title)+'</h1>'+CachasteFoundationVisual(card.visual)+
   '<div class="teacher-explanation">'+teacherStep('explaining',card.text,d.card,l.cards.length)+'</div>'+
   '<div class="daily-actions">'+(d.card?button('basic-prev','Anterior'):'')+button('basic-forward',d.card+1<l.cards.length?'Siguiente idea':'Resolver un caso','','primary')+'</div>':
   talking+'<h1 class="question-title">'+esc(q.prompt)+'</h1>'+CachasteFoundationVisual(q.visual)+
   '<div class="daily-options">'+q.options.map((o,i)=>button('basic-choice',o,'data-index="'+i+'" aria-pressed="'+(d.selected===i)+'" '+(d.checked?'disabled':''),d.checked&&i===q.answer?'correct':'')).join('')+'</div>'+
   (d.checked?'<div class="answer-feedback" role="status"><strong>'+(feedback.correct?'Respuesta correcta':'Analicemos esta respuesta')+'</strong><p>'+esc(q.why)+'</p></div>'+button('basic-next','Siguiente desafío','','primary'):
   button('basic-hint','Ver una pista')+(d.hinted?'<p class="hint">'+esc(q.hint||l.goal)+'</p>':'')+button('basic-check','Comprobar',(d.selected===null?'disabled':''),'primary')))+
   '</article>';
 }

 function practice(){return toolbar()+'<h1>Tu ratito de práctica</h1>'+cat('encouraging','Elige cuánto quieres practicar. Si algo cuesta, nos detenemos a entenderlo.')+'<section class="daily-card"><div class="daily-fields"><label>Tiempo orientativo<select id="daily-time"><option value="2">3 minutos</option><option value="4" selected>5 minutos</option><option value="8">10 minutos</option></select></label><label>Preguntas<input id="daily-count" type="number" inputmode="numeric" min="1" max="10" value="4"></label></div><div class="daily-actions">'+button('smart','Express inteligente','','primary')+button('free','Express libre')+'</div><p>El inteligente se enfoca en tus necesidades; el libre combina temas de '+esc(C.subjects[subject].name)+'.</p></section>'+((E.state.session||E.state.foundationDraft)?button('resume','Retomar sesión pendiente','','primary')+button('close','Cerrar sesión pendiente conservando avances'):'')+'<a href="#traditional" class="daily-link">Diagnóstico de 30 y ensayos completos →</a>';}

 function arcadeSession(q){
  const s=E.state.session,G=window.CachasteGameplay,a=s?.arcade,steps=G.clean(q);
  if(!G.valid(q,a))return intro(q);
  const selected=a.chosen.map((id,i)=>'<li><span class="arcade-counter">'+(i+1)+'</span><span>'+esc(steps[id])+'</span></li>').join('');
  const opts=a.order.map((id,i)=>button('arcade-pick',steps[id],'data-index="'+i+'" '+(a.chosen.includes(id)?'disabled':''),'arcade-tile'+(a.chosen.includes(id)?' arcade-used':''))).join('');
  const status=a.checked?'<div role="status" class="arcade-feedback '+(a.correct?'correct':'retry')+'"><strong>'+(a.correct?'¡Ordenaste el razonamiento!':'El orden todavía tiene un salto')+'</strong><p>'+(a.correct?'Bien conectado: cada paso prepara el siguiente. Ahora demuestra que sabes aplicar la idea sin ayuda.':'Piensa qué información necesitas obtener antes de realizar cada operación. Puedes reorganizar los pasos y volver a intentarlo.')+'</p></div>':'';
  return '<div class="lesson-top">'+button('pause','✕ Pausar')+'<span>Mini-juego · '+esc(q.concept)+'</span></div>'+
   '<section class="arcade-session" aria-label="Ordenar el razonamiento">'+
   '<div class="arcade-kicker">DESAFÍO INTERACTIVO · '+(a.chosen.length)+'/'+steps.length+' PASOS</div>'+
   '<h1>Ordena cómo se resuelve</h1><p class="arcade-prompt">'+esc(q.teaching.example.problem||q.concept)+'</p>'+
   cat(a.checked?(a.correct?'celebrating':'thinking'):'encouraging',a.checked?(a.correct?'¡Cachaste el proceso!':'Vuelve a comprobar qué paso depende del anterior.'):'Toca los pasos en el orden lógico. Aquí puedes probar sin perder vidas ni progreso.')+
   '<h2>Tu secuencia</h2><ol class="arcade-chosen">'+(selected||'<li class="arcade-placeholder">Toca un paso de las tarjetas de abajo para comenzar.</li>')+'</ol>'+
   '<div class="arcade-options" aria-label="Pasos para ordenar">'+opts+'</div>'+status+
   '<div class="arcade-actions">'+(!a.checked?button('arcade-undo','Deshacer último',(!a.chosen.length?'disabled':'')):'')+
   (!a.checked?button('arcade-check','Comprobar orden',(a.chosen.length!==steps.length?'disabled':''),'primary'):'')+
   (a.checked&&!a.correct?button('arcade-retry','Intentarlo de nuevo','','primary'):'')+
   (a.checked&&a.correct?button('begin-question','Resolver un desafío PAES','','primary'):'')+
   (!a.checked||!a.correct?button('begin-question','Ir directamente a la pregunta'):'')+'</div>'+
   '<p class="arcade-honesty">Este minijuego sirve para practicar el procedimiento. El dominio se comprueba con preguntas PAES distintas y sin ayuda.</p>'+
   '</section>';
 }

 function intro(q,standalone=false){const s=E.state.session,t=q.teaching,steps=[...t.foundation,'Otro ejemplo: '+t.example.problem,...t.example.steps,t.example.bridge],i=standalone?0:Math.min(s.card,steps.length-1);return '<div class="lesson-top">'+button(standalone?'home':'pause',standalone?'← Volver al camino':'✕ Pausar')+'</div>'+(standalone?cat('explaining','Repasa estos pasos y contrástalos con un caso nuevo.'):'')+'<article class="daily-card"><h2>'+esc(q.concept)+'</h2>'+(standalone?steps.map((x,i)=>'<details '+(i===0?'open':'')+'><summary>Paso '+(i+1)+'</summary><p>'+esc(x)+'</p></details>').join(''):'<p class="daily-note">Clase · '+(i+1)+' de '+steps.length+'</p><div class="teacher-explanation">'+teacherStep('explaining',steps[i],i,steps.length)+'</div><div class="daily-actions">'+(i?button('intro-prev','Anterior'):'')+(i+1<steps.length?button('intro-next','Siguiente paso','','primary'):(window.CachasteGameplay.clean(q)?button('start-arcade','Ordenar los pasos del ejemplo','','primary')+button('begin-question','Ir directamente a la pregunta'):button('begin-question','Ahora me toca practicar','','primary')))+'</div>')+'</article>';}
 function tutor(q){const s=E.state.session,t=q.teaching,mode=s.tutor||'steps',cards=mode==='easy'?t.intuition:mode==='example'?[t.example.problem,...t.example.steps,t.example.bridge]:[t.aim,...t.foundation,...t.application,t.check];const i=Math.min(s.card,cards.length-1);return'<section class="daily-card tutor" aria-label="Profesor particular"><h3>Vamos a entenderlo</h3><div class="daily-actions">'+['steps','easy','example'].map((m,i)=>button('mode',['Paso a paso','Explícame más fácil','Otro ejemplo'][i],'data-mode="'+m+'" aria-pressed="'+(mode===m)+'"')).join('')+'</div><p class="daily-note">Paso '+(i+1)+' de '+cards.length+'</p><div class="teacher-explanation" aria-live="polite">'+teacherStep(mode==='easy'?'encouraging':mode==='example'?'thinking':'explaining',cards[i],i,cards.length,false)+'</div><div class="daily-actions">'+(i?button('card-prev','Anterior'):'')+(i+1<cards.length?button('card-next','Siguiente paso','','primary'):'')+'</div><details><summary>Revisar las alternativas una por una</summary>'+q.options.map((o,i)=>'<details><summary>'+esc(o)+(i===q.answer?' · Correcta':'')+'</summary><p>'+esc(q.explanations[i])+'</p></details>').join('')+'</details>'+button('study','Repasar el concepto','data-level="'+esc(q.levelId)+'"')+'</section>';}
 function confidenceGuide(s,q){if(!s.checked||s.mode==='unit-exam')return '';const r=E.reviewFor(s.subject,s.track,q.concept);if(!r)return '';return '<aside class="confidence-guide" role="status"><strong>¿Qué cambia con tu respuesta?</strong><p>'+esc(r.feedback)+'</p><small>'+(r.days===1?'Revisión sugerida: mañana':'Revisión sugerida: en '+r.days+' días')+' · El próximo refuerzo priorizará este concepto cuando corresponda.</small></aside>';}
 function pendingReviewPanel(){const due=E.dueReviews(subject,subject==='Ciencias'?E.state.track:null);if(!due.length)return '';return '<section class="due-review" aria-label="Repasos pendientes"><div><strong>Tu repaso está listo</strong><p>'+due.length+' '+(due.length===1?'concepto necesita':'conceptos necesitan')+' una nueva comprobación, con preguntas diferentes.</p></div>'+button('review-due','Repasar ahora','','primary')+'</section>';}
 function session(){const s=E.state.session;if(!s)return home();const q=E.byKey.get(s.keys[s.index]);if(s.stage==='intro')return intro(q);if(s.stage==='arcade')return arcadeSession(q);const passage=q.passageId?texts.find(t=>t.id===q.passageId):null;const pct=Math.round(100*(s.index+(s.checked?1:0))/s.keys.length),meter='<div class="challenge-meter" role="progressbar" aria-label="Avance del desafío" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'"><span style="width:'+pct+'%"></span></div>';return meter+cat(s.mode==='unit-exam'?'thinking':s.checked?(s.results.at(-1)?.correct?'celebrating':'error'):'thinking',s.mode==='unit-exam'?(s.checked?'Respuesta guardada. Sigue hasta terminar las diez preguntas para conocer tu resultado.':'Confía en lo que aprendiste. Durante este desafío no te diré si acertaste hasta el final.'):s.checked?(s.results.at(-1)?.correct?'¡Ahora sí cachaste! Para demostrar dominio necesitamos aplicarlo otra vez.':'Ojo, aquí hay una confusión súper común. Veamos tu alternativa y probemos otra estrategia.'):'Lee con calma. Equivocarse también nos muestra qué conviene aprender.')+'<div class="daily-session-head"><span>'+esc(C.subjects[s.subject].name)+' · '+(s.index+1)+'/'+s.keys.length+'</span>'+button('pause','Pausar y guardar')+'</div>'+(s.notice?'<p role="status">'+esc(s.notice)+'</p>':'')+'<article class="daily-card"><p class="kicker">'+esc(q.concept)+(q.supplementary?' · Complementario':'')+'</p>'+(passage?'<details open class="daily-passage"><summary>'+esc(passage.title)+'</summary>'+passage.paragraphs.map((p,i)=>'<p><small>Párrafo '+(i+1)+'</small><br>'+(s.checked?(q.teaching.evidence||[]).filter(e=>e.paragraph===i&&e.passageId===q.passageId).reduce((html,e)=>html.replace(esc(e.quote),'<mark>'+esc(e.quote)+'</mark>'),esc(p)):esc(p))+'</p>').join('')+'</details>':'')+'<h2 class="question-title">'+esc(q.question)+'</h2>'+window.CachasteDailyVisual(q)+'<div class="daily-options">'+q.options.map((o,i)=>button('choice',String.fromCharCode(65+i)+'. '+o,'data-index="'+i+'" aria-pressed="'+(s.selected===i)+'" '+(s.checked?'disabled':''),s.checked&&s.mode!=='unit-exam'&&i===q.answer?'correct':'')).join('')+'</div>'+(!s.checked?'<fieldset><legend>¿Qué tan seguro estás?</legend><div class="daily-actions">'+['seguro','duda','azar'].map(c=>button('confidence',{seguro:'Lo sé',duda:'Tengo dudas',azar:'Fue al azar'}[c],'data-confidence="'+c+'" aria-pressed="'+(s.confidence===c)+'"')).join('')+'</div></fieldset>'+(s.mode==='unit-exam'?'':button('hint','Una pista'))+(s.hinted?'<p class="hint">'+esc(q.hint||q.teaching.foundation[0])+'</p>':'')+button('check','Comprobar respuesta',(s.selected===null||!s.confidence?'disabled':''),'primary'):(s.mode==='unit-exam'?'<p class="answer-feedback" role="status">Respuesta registrada. Conocerás tu resultado al finalizar las 10 preguntas.</p>':'<p class="answer-feedback" role="status">'+esc(q.explanations[s.selected])+'</p>')+button('next',s.index+1<s.keys.length?'Seguir practicando':'Terminar mi ratito','','primary'))+'</article>'+(s.checked&&s.mode!=='unit-exam'?confidenceGuide(s,q)+tutor(q):'');}
 function dailyQuests(stats){const answered=Math.min(3,Number(stats.mission)||0),goal=3;const tasks=[{title:'Tu misión diaria',description:'Responde tres preguntas hoy.',value:answered,target:goal,action:'practice',label:'Practicar ahora'},{title:'Fortalece una habilidad',description:'Continúa tu camino de aprendizaje.',value:Math.min(1,E.state.completed.filter(r=>r.subject===subject&&new Date(r.at).toLocaleDateString('en-CA',{timeZone:'America/Santiago'})===new Date().toLocaleDateString('en-CA',{timeZone:'America/Santiago'})).length),target:1,action:'home',label:'Ir a mis niveles'}];return '<section class="daily-card" aria-label="Misiones diarias"><h2>Misiones de hoy</h2><p class="daily-note">Pequeñas metas para avanzar a tu ritmo. Los errores también enseñan.</p>'+tasks.map(t=>'<div class="daily-quest"><div><strong>'+esc(t.title)+'</strong><p>'+esc(t.description)+'</p></div><div class="daily-quest-progress" role="progressbar" aria-label="'+esc(t.title)+'" aria-valuemin="0" aria-valuemax="'+t.target+'" aria-valuenow="'+t.value+'"><span style="width:'+Math.round(100*t.value/t.target)+'%"></span></div><p class="daily-note">'+t.value+' de '+t.target+(t.value===t.target?' · ¡Cumplida!':'')+'</p>'+(t.value<t.target?button(t.action,t.label):'')+'</div>').join('')+'</section>';}
 function progress(){const stats=E.stats(),p=E.profile(subject);return toolbar()+'<h1>Mi progreso</h1>'+pendingReviewPanel()+'<p>'+B.lessons.filter(l=>(l.subject||'M1')===subject||(subject==='M2'&&!l.subject)).filter(l=>B.status(l.id).complete).length+' de '+B.lessons.filter(l=>(l.subject||'M1')===subject||(subject==='M2'&&!l.subject)).length+' misiones de fundamentos de esta materia completadas.</p>'+dailyQuests(stats)+cat('celebrating','Cada respuesta aporta información. Ver una explicación ayuda a estudiar; demostrarlo después en otra pregunta es lo que acredita dominio.')+'<article class="daily-card"><h2>Mi progreso</h2><p>'+stats.xp+' XP · '+stats.streak+' días de racha · '+Math.min(stats.mission,3)+'/3 preguntas de hoy.</p><p>'+p.filter(x=>x.status==='comprobado').length+' de '+p.length+' objetivos con dominio demostrado.</p><h3>Logros</h3><p>'+esc(stats.achievements.join(' · ')||'Tu primer logro llega al terminar una sesión.')+'</p><h3>Mis últimos ratitos</h3><ul>'+E.state.completed.slice(-6).reverse().map(r=>'<li>'+esc(C.subjects[r.subject]?.name)+' · '+r.correct+'/'+r.total+' aciertos · '+esc(new Date(r.at).toLocaleDateString('es-CL'))+'</li>').join('')+'</ul><h3>Conviene reforzar</h3><ul>'+p.filter(x=>x.status==='por reforzar').slice(0,8).map(x=>'<li>'+esc(x.concept)+'</li>').join('')+'</ul><p>Los errores no quitan puntos ni bloquean el estudio.</p></article>'+button('path','Ver mis niveles');}
 function celebrate(){const r=E.state.celebration||{},complete=r.mastered;if(r.exam)return '<section class="celebration-screen">'+avatar(r.passed?'celebrating':'encouraging','hero')+'<span class="celebration-sparks" aria-hidden="true">'+(r.passed?'✦ ★ ✧':'✧ · ✦')+'</span>'+'<h1>'+(r.passed?'¡Unidad eximida!':'¡Sigamos aprendiendo!')+'</h1><p>'+esc(r.title)+'</p><div class="reward-card"><strong>'+r.correct+'/10</strong><span>'+(r.passed?'Superaste el mínimo de 8 respuestas correctas.':'Necesitas al menos 8 correctas para eximirte.')+'</span></div>'+'<div class="exam-reflection"><h2>Qué aprendimos de tus respuestas</h2><p>'+(r.secureErrors?'En '+r.secureErrors+' '+(r.secureErrors===1?'pregunta estabas seguro, pero había un error.':'preguntas estabas seguro, pero había errores.'):'No detectamos errores respondidos con seguridad.')+'</p><p>'+(r.uncertainCorrect?'Acertaste '+r.uncertainCorrect+' '+(r.uncertainCorrect===1?'pregunta':'preguntas')+' con dudas: las reforzaremos para ganar confianza.':'Tus aciertos con seguridad cuentan como evidencia de aprendizaje.')+'</p></div>'+button('home','Volver a mi camino','','primary')+(r.passed?button('next-stage','Ir a la siguiente unidad'):'')+'</section>';return'<section class="celebration-screen">'+avatar('celebrating','hero')+'<span class="celebration-sparks" aria-hidden="true">✦ · ✧</span><h1>'+(complete?'¡Ahora sí cachaste!':'¡Un buen avance!')+'</h1><p>'+esc(r.title||'Cada ratito suma')+'</p><div class="reward-card"><strong>'+E.stats().xp+' XP</strong><span>'+esc(r.correct??0)+' de '+esc(r.total??0)+' respuestas correctas</span></div><p>'+(complete?'Aplicaste lo aprendido en ejercicios distintos. ¡Vamos por la siguiente misión!':'Ya estudiaste y practicaste. Seguiremos comprobando lo aprendido con otras preguntas.')+'</p>'+button('home','Volver al camino','','primary')+button('progress','Ver mi progreso')+'</section>';}

 // Draw a real curved trail through the rendered mission coordinates, responsive to every screen size.
 let adventureObserver=null;
 function syncAdventureRoad(){
  const world=root.querySelector('.adventure-world'),svg=world?.querySelector('.adventure-road');
  if(!world||!svg)return;
  const base=world.getBoundingClientRect(),nodes=[...world.querySelectorAll('.trail-stop .trail-node')];
  const gate=world.querySelector('.world-gate-mark');
  const points=nodes.concat(gate?[gate]:[]).map(n=>{const r=n.getBoundingClientRect();return{x:Math.round(r.left+r.width/2-base.left),y:Math.round(r.top+r.height/2-base.top)};});
  const curve=(p,q)=>' C '+p.x+' '+Math.round(p.y+(q.y-p.y)*.5)+', '+q.x+' '+Math.round(q.y-(q.y-p.y)*.5)+', '+q.x+' '+q.y;
  const path=pts=>pts.length?'M '+pts[0].x+' '+pts[0].y+pts.slice(1).map((p,i)=>curve(pts[i],p)).join(''):'';
  const done=nodes.findIndex(n=>!n.closest('.trail-stop').classList.contains('mastered'));
  const doneCount=done===-1?nodes.length:done;
  svg.setAttribute('viewBox','0 0 '+Math.max(1,Math.round(base.width))+' '+Math.max(1,Math.round(base.height)));
  svg.querySelector('.road-shadow')?.setAttribute('d',path(points));
  svg.querySelector('.road-track')?.setAttribute('d',path(points));
  svg.querySelector('.road-cleared')?.setAttribute('d',path(points.slice(0,doneCount+(doneCount===nodes.length?1:0))));
 }
 function observeAdventureRoad(){
  adventureObserver?.disconnect();adventureObserver=null;
  const world=root.querySelector('.adventure-world');
  if(!world)return;
  syncAdventureRoad();
  world.addEventListener('animationend',event=>{if(event.target===world||event.target.classList?.contains('trail-stop'))syncAdventureRoad();});
  if(typeof ResizeObserver!=='undefined'){adventureObserver=new ResizeObserver(()=>syncAdventureRoad());adventureObserver.observe(world);}
 }

 function render(){profileCache=new Map();const h=location.hash||(E.state.chosenCourse?'#home':'#courses'),isTraditional=h==='#traditional',isLesson=['#session','#basic','#studio'].includes(h)||h.startsWith('#study:');traditional.hidden=!isTraditional;root.hidden=isTraditional;document.body.classList.toggle('is-learning',isLesson);document.body.classList.toggle('is-traditional',isTraditional);if(isTraditional){adventureObserver?.disconnect();adventureObserver=null;return;}let body;
  try{if(h==='#courses')body=courses();else if(h==='#tracks')body=tracks();else if(h==='#practice')body=practice();else if(h==='#units')body=unitPicker();else if(h==='#session')body=session();else if(h==='#basic')body=basicSession();else if(h==='#studio')body=studio();else if(h==='#celebrate')body=celebrate();else if(h==='#progress')body=progress();else if(h.startsWith('#level:'))body=level(decodeURIComponent(h.slice(7)));else if(h.startsWith('#basiclevel:'))body=basicLevel(decodeURIComponent(h.slice(12)));else if(h.startsWith('#study:')){const q=items.find(q=>q.levelId===decodeURIComponent(h.slice(7)));body=q?intro(q,true):home();}else body=home();
   const previousCat=root.querySelector('.wise-cat[data-cat-state]'),previousState=previousCat?.dataset.catState||'',previousWords=previousCat?.querySelector('p')?.textContent||'';
   root.innerHTML=(notice?'<div class="daily-notice" role="status">'+esc(notice)+'</div>':'')+(E.warning?'<p role="alert">'+esc(E.warning)+'</p>':'')+body+(!isLesson&&h!=='#celebrate'?navigate(h):'');
   observeAdventureRoad();
   const currentCat=root.querySelector('.wise-cat[data-cat-state]');if(currentCat&&(currentCat.dataset.catState!==previousState||currentCat.querySelector('p')?.textContent!==previousWords))currentCat.classList.add('cat-just-spoke');
   const celebration=root.querySelector('.celebration-screen');if(celebration)celebration.classList.add('reward-reveal');
  }catch(error){root.innerHTML='<h1>Volvamos a tu camino</h1><p>Tu progreso sigue guardado.</p>'+button('home','Abrir mi recorrido');console.error(error);}
 }
 root.addEventListener('change',e=>{if(e.target.id==='daily-time')document.getElementById('daily-count').value=e.target.value;});
 root.addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(!b)return;const a=b.dataset.action,s=E.state.session,d=E.state.foundationDraft;notice='';
  if(a==='studio-open'){
   const pilot=window.CachasteStudios.byId.get(b.dataset.studio);
   if(!pilot||pilot.subject!==subject)return;
   if(E.state.session||E.state.foundationDraft){notice='Primero termina o pausa tu sesión en curso.';render();return;}
   const draft=E.state.studioDraft;
   if(!window.CachasteStudios.valid(draft)||draft.id!==pilot.id)E.state.studioDraft=window.CachasteStudios.start(pilot);
   E.save();goto('#studio');return;
  }
  if(a==='studio-exit'){E.save();goto('#home');return;}
  if(a.startsWith('studio-')){
   const P=window.CachasteStudios,draft=E.state.studioDraft,l=P.byId.get(draft?.id);
   if(!l||!P.valid(draft)||l.subject!==subject){goto('#home');return;}
   if(a==='studio-next-card')P.nextCard(draft);
   else if(a==='studio-choice')P.choose(draft,Number(b.dataset.choice));
   else if(a==='studio-check')P.check(draft);
   else if(a==='studio-advance')P.advance(draft);
   else if(a==='studio-retry')P.retry(draft);
   else if(a==='studio-assess'||a==='studio-lesson'){
    if(E.state.session||E.state.foundationDraft){notice='Continúa la sesión guardada antes de iniciar otra.';render();return;}
    const mode=a==='studio-lesson'?'lesson':'free';
    const r=E.start(subject,2,mode,l.concept);
    notice=r.message||'';E.save();goto(E.state.session&&!r.blocked?'#session':'#studio');return;
   }
   E.save();render();scrollToLessonStart();return;
  }
  if(a==='review-due'){if(E.state.session||E.state.foundationDraft){notice='Primero termina la sesión que dejaste guardada.';goto('#home');return;}const due=E.dueReviews(subject,subject==='Ciencias'?E.state.track:null);const target=due[0];if(target){const result=E.start(subject,2,'smart',target.concept);notice=result.message||'';goto(E.state.session&&!result.blocked?'#session':'#home');}return;}
  if(a==='focus-quest'){const target=root.querySelector('.trail-stop.current .trail-node')||root.querySelector('.trail-stop:not(.mastered) .trail-node')||root.querySelector('.world-gate');if(target){target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});if(target.tagName==='BUTTON')target.focus({preventScroll:true});}return;}
  if(['home','path','progress','courses','tracks','practice','units','traditional','mission-practice'].includes(a)){goto('#'+(a==='mission-practice'?'practice':a));return;}
  if(a==='pick-course'){subject=b.dataset.subject;E.state.subject=subject;E.state.chosenCourse=true;E.save();goto(subject==='Ciencias'?'#tracks':'#home');return;}
  if(a==='pick-track'){subject='Ciencias';E.state.subject=subject;E.state.track=b.dataset.track;E.save();goto('#home');return;}
  if(a==='stage'){saveStage(b.dataset.stage);goto('#home');return;}
  if(a==='next-stage'){const st=stage(),all=units(),n=st.basic?-1:all.findIndex(x=>examKey(x)===examKey(st.unit));if(all[n+1]){saveStage(all[n+1].axis+'|'+all[n+1].name);goto('#home');}else goto('#units');return;}
  if(a==='unit-exam'){const u=units().find(x=>examKey(x)===b.dataset.unit);if(!u){notice='No se encontró la unidad.';render();return;}const result=E.startUnitExam(subject,examKey(u),u.levels.map(l=>l.objective),subject==='Ciencias'?E.state.track:null);notice=result.message||'';if(E.state.session&&!result.blocked)goto('#session');else render();return;}
  if(a==='basic-level'){goto('#basiclevel:'+encodeURIComponent(b.dataset.basic));return;}
  if(a==='basic-start'){if(!B.start(b.dataset.basic)){notice='Tienes una misión guardada. Retómala antes de empezar otra.';render();return;}goto('#basic');return;}
  if(a==='resume'){goto(d?'#basic':s?'#session':'#home');return;}
  if(a==='base'){subject=b.dataset.subject;E.state.subject=subject;E.save();goto('#level:'+encodeURIComponent(b.dataset.level));return;}
  if(a==='level'||a==='study'){goto('#'+(a==='level'?'level:':'study:')+encodeURIComponent(b.dataset.level));return;}
  if(a==='close'){E.close();E.state.foundationDraft=null;E.save();render();return;}
  if(a==='pause'){E.save();goto('#home');return;}
  if(a.startsWith('basic-')&&d){if(a==='basic-prev')d.card=Math.max(0,d.card-1);if(a==='basic-forward'){if(d.card+1<B.lesson(d.lesson).cards.length)d.card++;else d.stage='practice';}
   if(a==='basic-choice'&&!d.checked)d.selected=Number(b.dataset.index);if(a==='basic-hint'&&!d.checked)d.hinted=true;if(a==='basic-check')B.answer(d.selected);
   if(a==='basic-next'){const copy={title:B.lesson(d.lesson).title,total:d.results.length,correct:d.results.filter(r=>r.correct).length,mastered:B.status(d.lesson).complete};if(B.next()){E.state.celebration=copy;E.save();goto('#celebrate');return;}}E.save();render();scrollToLessonStart();return;}
  if(a==='check-first'){if(subject==='Ciencias'&&!E.state.track){goto('#tracks');return;}const result=E.start(subject,2,'free',b.dataset.concept||null);notice=result.message||'';if(E.state.session&&!result.blocked)goto('#session');else render();return;}
  if(['smart','free','lesson'].includes(a)){if(subject==='Ciencias'&&!E.state.track){goto('#tracks');return;}const n=a==='lesson'?2:Math.max(1,Math.min(10,Number(document.getElementById('daily-count')?.value)||4)),result=E.start(subject,n,a==='lesson'?'lesson':a,b.dataset.concept||null);notice=result.message||'';if(E.state.session&&!result.blocked)goto('#session');else render();return;}
  if(!s)return;
  if(a==='intro-next')s.card++;if(a==='intro-prev')s.card=Math.max(0,s.card-1);
  if(a==='start-arcade'){
   const q=E.byKey.get(s.keys[s.index]),challenge=window.CachasteGameplay.create(q);
   if(challenge){s.arcade=challenge;s.stage='arcade';E.save();render();scrollToLessonStart();}
   return;
  }
  if(a.startsWith('arcade-')&&s.stage==='arcade'){
   const q=E.byKey.get(s.keys[s.index]),G=window.CachasteGameplay;
   if(!G.valid(q,s.arcade)){s.stage='intro';E.save();render();return;}
   if(a==='arcade-pick')G.choose(q,s.arcade,Number(b.dataset.index));
   if(a==='arcade-undo')G.undo(q,s.arcade);
   if(a==='arcade-retry')G.reset(q,s.arcade);
   if(a==='arcade-check')G.check(q,s.arcade);
   E.save();render();return;
  }
  if(a==='begin-question'){s.stage='question';E.presented(E.byKey.get(s.keys[s.index]));s.studied=true;s.studyConcepts=[s.concept];s.card=0;}
  if(a==='choice'&&!s.checked)s.selected=Number(b.dataset.index);if(a==='confidence'&&!s.checked)s.confidence=b.dataset.confidence;if(a==='hint'&&!s.checked)s.hinted=true;
  if(a==='check'){const r=E.answer(s.selected,s.mode==='unit-exam'?'seguro':s.confidence);if(r&&s.mode!=='unit-exam'&&(!r.correct||r.confidence!=='seguro')){s.tutor=E.reviewFor(s.subject,s.track,E.byKey.get(s.keys[s.index]).concept)?.tutor||'steps';s.studyConcepts=[...new Set([...(s.studyConcepts||[]),E.byKey.get(s.keys[s.index]).concept])];const transfer=E.transfer();if(!transfer.questions.length)s.notice=r.correct?'Aunque acertaste, la duda cuenta. Reforzaremos esta idea en otro momento con una pregunta distinta.':'Podemos repasar la explicación y avanzar a otro tema. No te haré repetir la misma pregunta ahora.';}}
  if(a==='mode'){s.tutor=b.dataset.mode;s.card=0;}if(a==='card-next')s.card++;if(a==='card-prev')s.card=Math.max(0,s.card-1);
  if(a==='next'){const result=s.mode==='unit-exam'?{exam:true,title:s.unitKey,correct:s.results.filter(r=>r.correct&&!r.assisted).length,total:10,passed:s.results.filter(r=>r.correct&&!r.assisted).length>=8,secureErrors:s.results.filter(r=>!r.correct&&r.confidence==='seguro').length,uncertainCorrect:s.results.filter(r=>r.correct&&r.confidence!=='seguro').length}:null;const copy=result||{title:s.concept||C.subjects[s.subject].name,total:s.results.length,correct:s.results.filter(r=>r.correct).length,mastered:s.concept&&E.profile(s.subject).some(p=>p.concept===s.concept&&p.status==='comprobado')};if(E.next()){E.state.celebration=copy;E.save();goto('#celebrate');return;}E.state.session.studied=(E.state.session.studyConcepts||[]).includes(E.byKey.get(E.state.session.keys[E.state.session.index]).concept);}
  E.save();render();if(['next','intro-next','intro-prev'].includes(a))window.scrollTo(0,0);
 });
 window.addEventListener('resize',()=>syncAdventureRoad(),{passive:true});
 window.addEventListener('hashchange',()=>{render();scrollToLessonStart();});window.addEventListener('pagehide',E.save);document.addEventListener('visibilitychange',()=>{if(document.hidden)E.save();});
 window.cachasteNativeBack=()=>{if(location.hash&&location.hash!=='#home'){E.save();goto('#home');return true;}return false;};window.CachasteDailyApp={engine:E,basics:B,render};render();
})();
