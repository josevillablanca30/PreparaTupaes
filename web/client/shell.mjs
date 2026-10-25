import{getWebClient}from'./auth.mjs';
import{installSessionLifecycle}from'./session-lifecycle.mjs';
import{PROJECT_URL,PUBLISHABLE_KEY}from'../shared/config.mjs';
function serviceWorkerMessage(message){return new Promise(resolve=>{if(!navigator.serviceWorker?.controller){resolve(false);return;}const channel=new MessageChannel(),timer=setTimeout(()=>resolve(false),4000);channel.port1.onmessage=e=>{clearTimeout(timer);resolve(e.data);};navigator.serviceWorker.controller.postMessage(message,[channel.port2]);});}
export{serviceWorkerMessage};
export async function initPwa(license=null){
 if(!('serviceWorker'in navigator))return;
 try{const registration=await navigator.serviceWorker.register('/sw.js',{scope:'/'});await navigator.serviceWorker.ready;
 if(license){const warm=async()=>{const result=await serviceWorkerMessage({type:'LICENSE',token:license});if(result?.ok&&location.pathname.startsWith('/app/')&&!window.CachasteWebShellInstalled){
 window.CachasteWebShellInstalled=true;const urls=[location.href.split('#')[0],...Array.from(document.querySelectorAll('script[src],link[rel=stylesheet],img[src]'),node=>node.src||node.href)].filter(Boolean);serviceWorkerMessage({type:'CACHE_URLS',urls});}};if(navigator.serviceWorker.controller)await warm();else navigator.serviceWorker.addEventListener('controllerchange',warm,{once:true});}
 registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)dispatchEvent(new Event('cachaste-update'));});});
 }catch{document.querySelector('[data-pwa-status]')?.replaceChildren(document.createTextNode('La instalación estará disponible al conectar el sitio por HTTPS.'));}
}
let installPrompt=null;addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;});
export async function installPwa(){if(installPrompt){await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;}else{
 const dialog=document.createElement('dialog');dialog.className='web-dialog';dialog.innerHTML='<h2>Tu preparación, a mano</h2><p>Agrega ¿Cachaste? a la pantalla de inicio desde el menú de tu navegador. En iPhone, abre el menú Compartir de Safari y elige Agregar a inicio.</p><button type="button">Entendido</button>';document.body.append(dialog);dialog.querySelector('button').onclick=()=>{dialog.close();dialog.remove();};dialog.showModal();
}}
if(typeof window!=='undefined'&&location.pathname.startsWith('/app/')&&!window.CachasteWebShellInstalled){
 window.CachasteWebShellInstalled=true;
 document.body.classList.add('web-learning');const bar=document.createElement('div');bar.className='web-appbar';bar.innerHTML='<a href="/cuenta.html" aria-label="Mi cuenta de Cachaste"><img src="/assets/cachaste-icon.svg" alt="" width="28" height="28"><span>Mi cuenta</span></a><button data-sync-open aria-label="Estado de sincronización"><span data-sync-label>Guardando…</span></button><button data-install>Instalar</button>';document.body.prepend(bar);
 const labels={saved:'Guardado en tu cuenta',pending:'Guardado aquí · por sincronizar',conflict:'Hay dos sesiones guardadas',expired:'Renueva tu acceso',reload:'Progreso combinado · vuelve a abrir'};
 const update=()=>{bar.querySelector('[data-sync-label]').textContent=labels[window.CachasteWebSyncStatus]||'Guardando…';bar.dataset.sync=window.CachasteWebSyncStatus||'pending';};addEventListener('cachaste-sync',update);update();
 bar.querySelector('[data-install]').onclick=installPwa;
 bar.querySelector('[data-sync-open]').onclick=async()=>{
  const sync=window.CachasteWebProgress,entry=Object.entries(sync?.conflicts||{})[0];if(!entry){await sync?.flush();return;}
  const[key,conflict]=entry,dialog=document.createElement('dialog');dialog.className='web-dialog';dialog.innerHTML='<h2>Conservamos tus dos avances</h2><p>Hay cambios simultáneos en dos dispositivos. Elige qué sesión retomar. La alternativa queda guardada en este dispositivo.</p>'+(conflict.canMerge?'<button data-choice="merge">Combinar el historial de ambos</button>':'')+'<button data-choice="local">Retomar este dispositivo</button><button data-choice="remote">Retomar la sesión de tu cuenta</button><button data-close>Decidir después</button>';document.body.append(dialog);dialog.querySelector('[data-close]').onclick=()=>{dialog.close();dialog.remove();};
  for(const b of dialog.querySelectorAll('[data-choice]'))b.onclick=async()=>{b.disabled=true;try{if(await sync.resolve(key,b.dataset.choice))location.reload();}catch{b.disabled=false;b.textContent='El avance cambió. Vuelve a abrir esta opción.';}};
  dialog.showModal();
 };
 initPwa(window.CachasteWebBootstrap?.offlineLicense);
}
if(typeof window!=='undefined'&&location.pathname.startsWith('/app/')&&window.CachasteWebBootstrap&&!window.CachasteWebSession){
 const sdk=getWebClient({supabaseUrl:PROJECT_URL,publishableKey:PUBLISHABLE_KEY});
 const lifecycle=installSessionLifecycle({sdk,userId:window.CachasteWebBootstrap.userId,progress:window.CachasteWebProgress,requireAccess:location.pathname!=='/app/competencia.html',onLicense:license=>initPwa(license),onState:state=>{if(['offline','reconnecting'].includes(state)){window.CachasteWebSyncStatus='pending';dispatchEvent(new Event('cachaste-sync'));}},onEnd:async()=>{
  await serviceWorkerMessage({type:'PURGE_PRIVATE'});
  try{await fetch('/api/session',{method:'DELETE',headers:{'x-cachaste-request':'1'},signal:AbortSignal.timeout(8000)});}catch{}
  location.replace('/cuenta.html?next='+encodeURIComponent(location.pathname));
 }});
 window.CachasteWebSession=lifecycle;
 addEventListener('online',()=>lifecycle.reconnect());
 addEventListener('pageshow',event=>{if(event.persisted)lifecycle.reconnect();});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)lifecycle.reconnect();});
}
