function serviceWorkerMessage(message){return new Promise(resolve=>{if(!navigator.serviceWorker?.controller){resolve(false);return;}const channel=new MessageChannel(),timer=setTimeout(()=>resolve(false),4000);channel.port1.onmessage=e=>{clearTimeout(timer);resolve(e.data);};navigator.serviceWorker.controller.postMessage(message,[channel.port2]);});}
export{serviceWorkerMessage};
export async function initPwa(license=null){
 if(!('serviceWorker'in navigator))return;
 try{const registration=await navigator.serviceWorker.register('/sw.js',{scope:'/'});await navigator.serviceWorker.ready;
 if(license){if(navigator.serviceWorker.controller)await serviceWorkerMessage({type:'LICENSE',token:license});else navigator.serviceWorker.addEventListener('controllerchange',()=>serviceWorkerMessage({type:'LICENSE',token:license}),{once:true});}
 registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)dispatchEvent(new Event('cachaste-update'));});});
 }catch{document.querySelector('[data-pwa-status]')?.replaceChildren(document.createTextNode('La instalación estará disponible al conectar el sitio por HTTPS.'));}
}
let installPrompt=null;addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;});
export async function installPwa(){if(installPrompt){await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;}else{
 const dialog=document.createElement('dialog');dialog.className='web-dialog';dialog.innerHTML='<h2>Tu preparación, a mano</h2><p>Agrega ¿Cachaste? a la pantalla de inicio desde el menú de tu navegador. En iPhone, abre el menú Compartir de Safari y elige Agregar a inicio.</p><button type="button">Entendido</button>';document.body.append(dialog);dialog.querySelector('button').onclick=()=>{dialog.close();dialog.remove();};dialog.showModal();
}}
if(typeof window!=='undefined'&&location.pathname.startsWith('/app/')){
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
