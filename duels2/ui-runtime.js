 // CACHASTE_DUELS2_RUNTIME — injected into both reviewed platform presentations.
 const d2Style=document.createElement('style');d2Style.textContent=/*DUELS2_CSS*/;document.head.append(d2Style);
 /*DUELS2_HISTORY*/
 const d2BaseCall=api.call.bind(api),d2OriginalRender=render;
 const d2Operations=new Set(['create_duel','join_code','accept','decline','random','cancel_queue','duel','start','attempt','answer','forfeit','review','rematch']);
 const d2ExistingOperations=new Set(['join_code','accept','decline','duel','start','attempt','answer','forfeit','review','rematch']);
 let d2Available=false;
 const d2Missing=error=>error?.code==='PGRST202'||(error?.code==='42883'&&/public\.cachaste_duels2\(/.test(error.message||''));
 const d2ReadUnavailable=error=>/^(PROFILE_REQUIRED|COMMUNITY_REQUIRED|ACCOUNT_RESTRICTED|SUBSCRIPTION_REQUIRED)$/.test(error?.message||'');
 let d2Channel=null,d2ChannelMatch=null,d2Realtime=false,d2Polling=false,d2PendingAction=null,d2QueuePayload=null,d2QueueGeneration=0,d2LastWidth=50,d2LastQuestion=null;
 function d2Rules(){return '<div class="duels2-rules"><h2 id="dialog-title">Así se juega Duelos 2.0</h2><ul><li>Ambos reciben las mismas <strong>10 preguntas</strong>, en distinto orden.</li><li>Importa acertar: <strong>terminar primero no da ventaja</strong>. Tienen 40 minutos desde el inicio del duelo.</li><li>Cada acierto suma un punto de dominio para ti. Cada error le entrega un punto al rival.</li><li>La barra compartida cambia en tiempo real. No muestra las preguntas, respuestas ni avance del rival.</li><li>Buscamos personas primero. Si no aparece nadie tras unos 10 segundos, jugarás con un <strong>rival virtual identificado</strong>.</li><li>Contra personas: victoria <strong>+3 estrellas</strong> y derrota <strong>−3</strong>. Contra bots: <strong>+1 / −1</strong>. Empate: 0. Tu saldo nunca baja de cero.</li><li>Si abandonas o vence tu tiempo sin terminar, pierdes. Tu rival conserva su turno. Si ambos abandonan, no cambia el saldo.</li><li>Al terminar ambos, podrás revisar tu alternativa, la respuesta correcta y el tutor paso a paso.</li></ul><p>Las estrellas competitivas y tu dominio académico se guardan por separado.</p></div>';}
 async function d2Rpc(operation,payload){
  if(!api.sdk)throw Error('SERVICE_NOT_READY');
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{const{data,error}=await api.sdk.rpc('cachaste_duels2',{operation,payload}).abortSignal(controller.signal);if(error)throw error;return data;}finally{clearTimeout(timer);}
 }
 api.call=async function(operation,payload={}){
  if(operation==='dashboard'||operation==='duel_history'){
   const legacy=await d2BaseCall(operation,payload);
   if(!api.user||!api.premium||!api.sdk){d2Available=false;return legacy;}
   let modern;
   try{modern=await d2Rpc(operation,payload);d2Available=true;}
   catch(error){if(!d2Missing(error)&&!d2ReadUnavailable(error))throw error;d2Available=false;return legacy;}
   if(operation==='duel_history')return mergeDuelHistory(legacy,modern);
   const rows=[...(modern.duels||[]),...(legacy.duels||[])].sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt));
   return {...legacy,...(operation==='dashboard'?{stats:modern.stats,history:modern.history}:{}),duels:rows};
  }
  if(!d2Operations.has(operation))return d2BaseCall(operation,payload);
  const knownD2=state.duel?.version===2||state.attempt?.version===2;
  // A resumed attempt has an ID before the dashboard or match is hydrated.
  if(!api.sdk||!api.user||!api.premium||(!d2Available&&!knownD2&&!d2ExistingOperations.has(operation)))return d2BaseCall(operation,payload);
  const body={...payload};
  if(operation==='random'){d2QueuePayload={subject:body.subject,track:body.track||''};body.requestId=api.request('duels2-random:'+JSON.stringify(d2QueuePayload));}
  try{
   const value=await d2Rpc(operation,body);
   d2Available=true;
   if(operation==='random'&&!value.waiting){api.clearRequest('duels2-random:'+JSON.stringify(d2QueuePayload));d2QueuePayload=null;}
   if(operation==='cancel_queue'){if(d2QueuePayload)api.clearRequest('duels2-random:'+JSON.stringify(d2QueuePayload));d2QueuePayload=null;}
   if(value?.version===2&&value.duelId){if(state.duel?.id!==value.duelId)state.duel=await d2Rpc('duel',{duelId:value.duelId});else state.duel.balance=value.balance;}
   return value;
  }catch(error){
   // Only a missing D2 identity falls through. Auth/access/network failures never do.
   if(error?.message==='D2_NOT_FOUND'&&d2ExistingOperations.has(operation))return d2BaseCall(operation,payload);
   if(d2Missing(error)){
    if(knownD2)throw Error('SERVICE_NOT_READY');
    d2Available=false;return d2BaseCall(operation,payload);
   }
   throw error;
  }
 };
 function d2Balance(value){const d=state.duel;if(!d||d.version!==2)return;const own=d.creator?.id===api.user?.id?Number(value):-Number(value),width=Math.max(0,Math.min(100,50+own*2.5)),fill=root.querySelector('.duels2-fill'),meter=root.querySelector('[data-duels2-meter]');if(fill)fill.style.width=width+'%';if(meter){meter.setAttribute('aria-valuenow',String(own));meter.setAttribute('aria-valuetext',own===0?'Dominio equilibrado':own>0?'Dominio a tu favor':'Dominio a favor de tu rival');}d2LastWidth=width;}
 function d2Paint(){
  const d=state.duel;if(d?.version!==2||!['duelo','pregunta','resultado'].includes(state.route))return;
  const other=d.creator?.id===api.user?.id?d.opponent:d.creator;
  if(!root.querySelector('[data-duels2-meter]')){
   const section=document.createElement('section');section.className='duels2-meter';section.innerHTML='<header><strong>'+esc(api.profile?.nickname||'Tú')+'</strong><strong>'+esc(other?.nickname||'Rival')+'</strong></header><div class="duels2-track" data-duels2-meter role="meter" aria-label="Balance de dominio compartido" aria-valuemin="-20" aria-valuemax="20" aria-valuenow="0"><div class="duels2-fill"></div></div><footer><span>Dominio compartido · sin velocidad</span><span class="duels2-live-label"></span></footer>';
   const target=root.querySelector('.competitive-question')||root.querySelector('.versus-stage')||root.querySelector('.result-score');if(target)target.before(section);
   const fill=section.querySelector('.duels2-fill');fill.style.width=d2LastWidth+'%';requestAnimationFrame(()=>d2Balance(d.balance));
  }else d2Balance(d.balance);
  const live=root.querySelector('.duels2-live-label');if(live)live.textContent=d.status==='finished'?'Final verificado':d2Realtime?'En vivo':'Actualizando';
  if(state.route==='pregunta'&&state.attempt?.version===2){
   const a=state.attempt,question=root.querySelector('.competitive-question');question?.classList.add('duels2-question-in');
   if(!root.querySelector('.duels2-personal-streak')){const node=document.createElement('p');node.className='duels2-personal-streak';node.textContent=a.streak>1?'Tu racha: '+a.streak+' aciertos seguidos':'Tómate tu tiempo. Ambos pueden responder las diez.';question?.querySelector('.question-rules')?.after(node);}
   if(d2LastQuestion!==null&&d2LastQuestion!==a.question?.key)root.querySelector('.duels2-meter')?.classList.add('duels2-registered');d2LastQuestion=a.question?.key;
  }
  if(!root.querySelector('.duels2-rival-note')){const node=document.createElement('p');node.className='duels2-rival-note';node.textContent=d.opponentKind==='bot'?'Rival virtual · '+({initial:'nivel inicial',intermediate:'nivel intermedio',advanced:'nivel avanzado'}[d.opponent?.level]||'entrenamiento')+' · +1 / −1 estrella':'Rival humano · +3 / −3 estrellas';root.querySelector('.duels2-meter')?.after(node);}
  if(state.route==='resultado'&&d.result&&!root.querySelector('.duels2-result-note')){const note=document.createElement('p');note.className='panel duels2-result-note';const own=d.creator?.id===api.user?.id?d.result.creator:d.result.opponent;note.textContent='Tu dominio final: '+own.mastery+' / 20 · Tus aciertos: '+own.correct+' / 10. Los errores del rival también suman a tu dominio.';root.querySelector('.result-score')?.after(note);}
 }
 function d2Subscribe(){
  const d=state.duel,match=api.user&&api.premium&&d?.version===2&&d.status==='active'&&['duelo','pregunta'].includes(state.route)?d.id:null;
  if(match===d2ChannelMatch)return;
  if(d2Channel)api.sdk?.removeChannel(d2Channel);d2Channel=null;d2ChannelMatch=match;d2Realtime=false;
  if(!match||!api.sdk)return;
  d2Channel=api.sdk.channel('duels2:'+match).on('postgres_changes',{event:'UPDATE',schema:'public',table:'cachaste_duels2_live',filter:'id=eq.'+match},()=>{
   // Fetch the authoritative aggregate: ignore stale/reordered event payloads entirely.
   void d2Sync();
  }).subscribe(status=>{d2Realtime=status==='SUBSCRIBED';const live=root.querySelector('.duels2-live-label');if(live)live.textContent=d2Realtime?'En vivo':'Actualizando';});
 }
 render=function(...args){d2OriginalRender(...args);d2Paint();d2Subscribe();
  if(d2Available&&state.route==='duelos'&&!root.querySelector('[data-action="duels2-rules"]')){const node=document.createElement('div');node.innerHTML=btn('duels2-rules','Cómo se juega Duelos 2.0','soft wide');root.querySelector('.duel-actions')?.before(node);}
 };
 async function d2Sync(){
  if(d2Polling||state.busy||!state.online||document.hidden||!api.user||!api.premium)return;
  d2Polling=true;
  try{
   if(state.queue){
    const generation=d2QueueGeneration,d=await api.call('random',d2QueuePayload||bodySubject());
    if(generation!==d2QueueGeneration||!state.queue)return;
    if(!d.waiting){state.queue=false;state.duel=d;go('duelo');}return;
   }
   const current=state.duel;
   if(current?.version!==2||!['duelo','pregunta'].includes(state.route)||!['active','invited'].includes(current.status))return;
   const d=await api.call('duel',{duelId:current.id});if(state.duel?.id!==current.id)return;state.duel=d;
   d2Balance(d.balance);
   if(d.status==='finished'){rankCache.clear();await openDuel(d.id);return;}
   if(current.status!==d.status||current.attemptStatus!==d.attemptStatus&&state.route!=='pregunta'){render();return;}
   if(state.route==='pregunta'&&state.attempt?.version===2){const a=await api.call('attempt',{attemptId:state.attempt.id});if(a.status!==state.attempt.status||a.position!==state.attempt.position)await processAttempt(a);}
  }catch(error){const node=root.querySelector('.duels2-live-label');if(node)node.textContent='Reconectando';}finally{d2Polling=false;}
 }
 setInterval(()=>void d2Sync(),2000);
 root.addEventListener('click',event=>{
  const target=event.target.closest('[data-action]'),action=target?.dataset.action;if(!action)return;
  if(action==='cancel-queue'){d2QueueGeneration++;}
  if(action==='duels2-rules'){
   event.preventDefault();event.stopImmediatePropagation();dialog.innerHTML=d2Rules()+btn('duels2-rules-close','Entendido','primary wide');dialog.showModal();return;
  }
  if(action==='start-duel'&&state.duel?.version!==2)return;
  if(d2Available&&['random','challenge','join','start-duel'].includes(action)&&api.user&&api.premium&&api.storage.getItem(api.key('duels2-rules'))!=='2026-11-10'){
   event.preventDefault();event.stopImmediatePropagation();d2PendingAction=action;dialog.innerHTML=d2Rules()+btn('duels2-rules-accept','Entendido, vamos','primary wide')+btn('duels2-rules-close','Volver','soft wide');dialog.showModal();return;
  }
  if(action==='rematch'&&state.duel?.version===2){
   event.preventDefault();event.stopImmediatePropagation();if(!guard())return;
   work(async()=>{const previous=state.duel,scope='duels2-rematch:'+previous.id,d=await api.call('rematch',{duelId:previous.id,requestId:api.request(scope)});api.clearRequest(scope);state.duel=d;state.subject=d.subject;state.track=d.track||state.track;go('duelo');});
  }
 },true);
 dialog.addEventListener('click',event=>{const action=event.target.closest('[data-action]')?.dataset.action;if(!['duels2-rules-close','duels2-rules-accept'].includes(action))return;event.preventDefault();event.stopImmediatePropagation();dialog.close();if(action==='duels2-rules-accept'){api.storage.setItem(api.key('duels2-rules'),'2026-11-10');const action=d2PendingAction;d2PendingAction=null;root.querySelector('[data-action="'+action+'"]')?.click();}},true);
 window.addEventListener('hashchange',()=>{if(state.queue&&location.hash!=='#duelos'){state.queue=false;d2QueueGeneration++;void api.call('cancel_queue').catch(()=>{});}});
 window.addEventListener('pagehide',()=>{if(d2Channel)api.sdk?.removeChannel(d2Channel);});
