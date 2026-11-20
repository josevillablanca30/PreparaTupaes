// An admission/persistence adapter around the ORIGINAL engine. No replacement quiz or tutor.
export function attachOriginalEngine({engine:E,rpc,tier,activity=null,storage=globalThis.localStorage,notify=()=>{},refresh=async()=>tier}={}){
 if(!E||typeof rpc!=='function'||!['premium','basica'].includes(tier))throw Error('LEARNING_CONFIGURATION_REQUIRED');
 const original=Object.fromEntries(['start','startDiagnosis','startExpress','startUnitExam','answer','next','transfer','close'].map(k=>[k,E[k].bind(E)]));
 let busy=false,currentTier=tier,pendingAnswer=null,completedPermit=false;
 const message=e=>String(e?.message||e).includes('BASIC_QUOTA_EXHAUSTED')?'¡Vas súper bien! 🔥 Completaste tus actividades gratuitas. Vuelve mañana para seguir practicando.':String(e?.message||e).includes('BASIC_NOT_READY')?'Tu acceso se está preparando. Vuelve a intentarlo en un momento.':'No pudimos confirmar tu actividad. Tu avance se conserva; vuelve a intentarlo.';
 const key='cachaste-original-launch-v1';
 const savePending=value=>{try{value?storage.setItem(key,JSON.stringify(value)):storage.removeItem(key);}catch{}};
 const setActivity=s=>{if(s){for(const k of s.keys)if(!E.byKey.has(k))throw Error('CATALOGUE_VERSION_MISMATCH');E.state.session=structuredClone(s);E.state.subject=s.subject;E.state.track=s.track;E.state.foundationDraft=null;const seen=new Set(E.state.attempts.map(r=>r.eventId));for(const row of s.results||[])if(!seen.has(row.eventId))E.state.attempts.push(structuredClone(row));}else E.state.session=null;E.save();};
 // Ignore client-supplied sessions in Basic: only the server can restore one.
 if(currentTier==='basica')setActivity(activity);
 const announce=text=>notify({message:text});
 async function start(method,args){
  if(busy)return;busy=true;
  try{
   const nextTier=await refresh();
   if(nextTier==='basica'&&currentTier==='premium'){
    if(E.state.session)storage.setItem('cachaste-premium-session-backup',JSON.stringify(E.state.session));
    const server=await rpc('state');setActivity(server.activity);
   }
   currentTier=nextTier;
   if(currentTier==='premium'){savePending(null);original[method](...args);notify({started:true});return;}
   if(E.state.session?.basicAttempt){notify({started:true,resumed:true});return;}
   if(method==='startUnitExam'){announce('Los ensayos completos y las pruebas de eximición requieren Premium.');return;}
   const result=original[method](...args),proposal=E.state.session;
   if(!proposal||result?.blocked){announce(result?.message||'No pudimos iniciar esta etapa.');return;}
   // Keep the original selector: server checks every ID, subject, concept, track and answer.
   let pending;try{pending=JSON.parse(storage.getItem(key));}catch{}
   const context={mode:proposal.mode,subject:proposal.subject,track:proposal.track,concept:proposal.concept};
   if(!pending||JSON.stringify(pending.context)!==JSON.stringify(context))pending={context,requestKey:crypto.randomUUID(),keys:proposal.keys};
   savePending(pending);E.state.session=null;E.save();
   const issued=await rpc('start',{...context,keys:pending.keys,requestKey:pending.requestKey});
   if(issued.tier==='premium'){currentTier='premium';original[method](...args);}else setActivity(issued.activity);
   savePending(null);notify({started:true,resumed:issued.resumed===true});
  }catch(e){announce(message(e));}finally{busy=false;}
 }
 for(const method of ['start','startDiagnosis','startExpress','startUnitExam'])E[method]=(...args)=>{
  if(currentTier==='premium'){
   // Recheck on EVERY start. An expired Premium lease cannot open unlimited local sessions.
   void start(method,args);return {blocked:true,message:'Verificando tu acceso…'};
  }
  if(method==='start'&&!['lesson'].includes(args[2])){
   // Original guided practice entry points are still lesson stages under the same budget.
   args=[args[0],2,'lesson',args[3]];
  }
  void start(method,args);return {blocked:true,message:'Preparando tu etapa…'};
 };
 E.answer=(index,...args)=>{
  if(currentTier==='premium')return original.answer(index,...args);
  const s=E.state.session;if(!s?.basicAttempt||busy)return null;
  // Retry precisely the same answer after network uncertainty, never a new attempt.
  pendingAnswer??={attemptId:s.id,position:s.index,selectedIndex:index,assisted:!!s.hinted,afterStudy:!!s.studied};
  busy=true;
  void rpc('answer',pendingAnswer).then(reply=>{
   if(E.state.session?.id!==s.id)throw Error('SESSION_CHANGED');
   original.answer(reply.row.selected,...args);pendingAnswer=null;notify({answered:true});
  }).catch(e=>announce(message(e))).finally(()=>{busy=false;});return null;
 };
 E.next=()=>{
  const s=E.state.session;if(currentTier==='premium')return original.next();
  if(!s?.basicAttempt||busy||pendingAnswer)return false;
  if(completedPermit){completedPermit=false;return original.next();}
  if(s.index+1<s.keys.length)return original.next();
  busy=true;
  void rpc('complete',{attemptId:s.id}).then(()=>{completedPermit=true;busy=false;notify({advance:true});}).catch(e=>announce(message(e))).finally(()=>{busy=false;});
  return false;
 };
 E.transfer=()=>currentTier==='premium'?original.transfer():{questions:[]};
 E.close=()=>{
  if(currentTier==='premium')return original.close();
  const s=E.state.session;if(!s?.basicAttempt)return original.close();
  // Pausing must not throw away a partially answered activity or create a fresh quota slot.
  announce('Tu etapa queda guardada. Puedes retomarla para seguir aprendiendo.');
 };
 return {get busy(){return busy;},get tier(){return currentTier;},setTier(value){currentTier=value;}};
}
