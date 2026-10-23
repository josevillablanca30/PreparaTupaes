/* Store prices and receipts come from Google Play. Access always comes from the server. */
(()=>{
 'use strict';
 const config=window.CACHASTE_COMPETITION_CONFIG,Client=window.CachasteCompetitionClient?.CompetitionClient;
 const buy=document.getElementById('subscribe'),restore=document.getElementById('restore'),notice=document.getElementById('billing-status'),selector=document.getElementById('store-offer');
 if(!buy||!restore||!notice||!selector||!Client)return;
 const client=new Client(config),requests=new Map();let available=false,hasOffers=false,busy=false,purchaseBlocked=true,reconnectRequested=false;
 const say=text=>{notice.textContent=text;};
 const lock=()=>{buy.disabled=!available||!hasOffers||busy||purchaseBlocked||client.premium===true;restore.disabled=!available||busy;selector.disabled=buy.disabled;buy.setAttribute('aria-label',available?'Contratar desde Google Play':'Contratación deshabilitada hasta configurar Google Play Billing');restore.setAttribute('aria-label',available?'Restaurar compras':'Restauración deshabilitada hasta conectar verificación de compras');};
 const finish=()=>{busy=false;lock();if(reconnectRequested&&navigator.onLine!==false){reconnectRequested=false;initialize();}};
 function native(action,payload={}){
  if(!window.CachastePlay?.postMessage)return Promise.reject(Error('NATIVE_REQUIRED'));
  return new Promise((resolve,reject)=>{const id=crypto.randomUUID(),timer=setTimeout(()=>{requests.delete(id);reject(Error('STORE_TIMEOUT'));},action==='purchase'?900000:20000);requests.set(id,{resolve,reject,timer});try{window.CachastePlay.postMessage(JSON.stringify({id,action,...payload}));}catch(error){requests.delete(id);clearTimeout(timer);reject(error);}});
 }
 if(window.CachastePlay)window.CachastePlay.onmessage=event=>{
  try{const data=JSON.parse(event.data),pending=requests.get(data.id);if(!pending)return;requests.delete(data.id);clearTimeout(pending.timer);data.error?pending.reject(Error(data.error)):pending.resolve(data.data);}catch{}
 };
 async function server(body){
  const {data,error}=await client.sdk.functions.invoke('cachaste-play',{body});
  if(error||data?.error){let detail=data?.error;try{detail||=(await error.context.clone().json()).error;}catch{}throw Error(detail||'VERIFICATION_UNAVAILABLE');}return data;
 }
 async function verify(data){
  // Until Play and the verifier both answer, ownership is unknown: never offer another charge.
  purchaseBlocked=true;
  const purchases=data?.purchases;if(!Array.isArray(purchases)||purchases.length>10||typeof data?.pending!=='boolean')throw Error('VERIFICATION_UNAVAILABLE');
  for(const purchase of purchases)await server({action:'verify',purchaseToken:purchase.purchaseToken});
  await server({action:'refresh'});await client.connect();
  if(client.billingUnavailable||client.serviceReady===false||!client.user)throw Error('VERIFICATION_UNAVAILABLE');
  purchaseBlocked=data.pending;
  say(client.premium?'Tu suscripción está validada. Ya tienes acceso competitivo.':data?.pending?'Google Play está procesando el pago. El acceso se activará cuando lo confirme.':'No encontramos una suscripción vigente para esta cuenta. Puedes revisar tus suscripciones en Google Play.');
 }
 const errors={USER_CANCELED:'Cancelaste la compra. No se activó una suscripción desde esta pantalla.',ACCOUNT_MISMATCH:'La compra está vinculada a otra cuenta de ¿Cachaste?. Ingresa con la cuenta original.',RECEIPT_ALREADY_LINKED:'Esta compra ya está vinculada a otra cuenta. Ingresa con la cuenta original.',OFFER_UNAVAILABLE:'La oferta cambió o ya no está disponible. Actualiza los planes antes de continuar.',BILLING_NOT_CONFIGURED:'La contratación aún está pendiente de configuración. No se iniciará ningún cobro.',NATIVE_REQUIRED:'Las compras y la restauración se realizan desde la versión de Google Play.'};
 async function perform(action){
  if(!available||busy||action==='purchase'&&(!hasOffers||purchaseBlocked||client.premium))return;
  busy=true;purchaseBlocked=true;lock();
  try{say(action==='purchase'?'Confirma las condiciones y el precio en Google Play.':'Consultando tus compras en Google Play…');await verify(await native(action,action==='purchase'?{userId:client.user.id,offer:selector.value}:{}));}
  catch(e){if(action==='purchase'&&e.message==='USER_CANCELED')purchaseBlocked=false;say(errors[e.message]||'No pudimos verificar la compra. Conserva tu cuenta e intenta Restaurar compras cuando vuelva la conexión; no contrates de nuevo.');}
  finally{finish();}
 }
 buy.addEventListener('click',()=>perform('purchase'));restore.addEventListener('click',()=>perform('restore'));
 async function initialize(){
  if(busy){reconnectRequested=true;return;}
  available=false;hasOffers=false;purchaseBlocked=true;lock();
  if(!config?.billingReady)return;
  if(navigator.onLine===false){say('Conéctate para consultar y verificar tu suscripción.');return;}
  busy=true;lock();
  try{
   await client.connect();if(!client.user){say('Ingresa a tu cuenta desde Perfil para contratar o restaurar tu suscripción.');return;}
   const response=await fetch(config.supabaseUrl+'/functions/v1/cachaste-play',{signal:AbortSignal.timeout(10000)});
   if(!response.ok||!(await response.json()).ready)throw Error('BILLING_NOT_CONFIGURED');
   if(!window.CachastePlay?.postMessage)throw Error('NATIVE_REQUIRED');
   available=true;
   // Restoring an existing purchase must not depend on availability of new offers.
   let offerError=null;
   try{
   const offers=await native('offers');selector.replaceChildren();
   for(const offer of offers){
    const last=offer.phases.at(-1),trial=offer.phases.length===2&&offer.phases[0].micros===0&&offer.phases[0].period==='P7D';
    const label={semanal:'Semanal',mensual:'Mensual',anual:'Anual'}[offer.basePlan];if(!label||last.currency!=='CLP')continue;
    const option=document.createElement('option');option.value=offer.id;option.textContent=label+' · '+(trial?'7 días gratis, luego ':'')+last.price+' CLP / '+{P1W:'semana',P1M:'mes',P1Y:'año'}[last.period];selector.append(option);
    if(trial)selector.value=offer.id;
   }
   if(!selector.options.length)throw Error('OFFER_UNAVAILABLE');
   hasOffers=true;
   selector.closest('label').hidden=false;buy.textContent='Continuar en Google Play';restore.textContent='Restaurar compras';
   const intro=document.getElementById('subscription-intro');if(intro)intro.textContent='Elige tu plan y confirma las condiciones en Google Play. La prueba gratuita está sujeta a elegibilidad.';
   }catch(e){offerError=e;}
   // Recover purchases whose Play dialog completed while Android recreated or closed the Activity.
   const owned=await native('restore');
   await verify(owned);
   if(!client.premium&&!owned.pending)say(offerError?'Los planes no están disponibles por ahora. Puedes restaurar una compra existente.':'Precios y ofertas consultados en Google Play. Revisa la renovación y la fecha del primer cobro antes de confirmar.');
  }catch(e){say(errors[e.message]||'No pudimos verificar la compra. Conserva tu cuenta e intenta Restaurar compras cuando vuelva la conexión; no contrates de nuevo.');}
  finally{finish();}
 }
 window.addEventListener('offline',()=>{available=false;lock();say('Sin conexión: no se puede contratar ni acreditar una compra.');});
 window.addEventListener('online',initialize);initialize();
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&available&&!busy)perform('restore');});
})();
