import{getWebClient}from'./auth.mjs';
import{captureRecoveryReturn,verifyRecoveryReturn,rememberRecovery,resumeRecovery,forgetRecovery,requestRecovery,changeRecoveredPassword,recoveryError}from'./recovery-flow.mjs';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function mountRecoveryPage({root,status,location=window.location,history=window.history,storage=window.sessionStorage}={}){
 const entry=captureRecoveryReturn(location,history);
 let sdk,ready=false,verifiedUserId=null,busy=false,mode='loading',email='',sentAt=0,tick=null,active=entry.kind!=='none'&&entry.kind!=='invalid'?entry:null;
 root.classList.add('recovery-root');
 const note=(text,error=false)=>{status.textContent=text;status.setAttribute('role',error?'alert':'status');};
 const stopClock=()=>{if(tick)clearInterval(tick);tick=null;};
 function render(){
  stopClock();root.setAttribute('aria-busy',String(busy||mode==='loading'));
  const top='<section class="account-card recovery-card"><span class="eyebrow">TU CUENTA DE ¿CACHASTE?</span>';
  const request='<form id="recovery-email-form"><label>Correo de tu cuenta<input name="email" type="email" autocomplete="email" autocapitalize="none" spellcheck="false" maxlength="254" value="'+esc(email)+'" required></label><button type="submit"'+(!sdk||busy?' disabled':'')+'>Enviar correo de recuperación</button></form><p class="recovery-help">Revisa Recibidos y Spam. Si vuelves a pedirlo, usa el correo más reciente.</p><a class="text-link" href="/cuenta.html">Volver a iniciar sesión</a>';
  if(mode==='loading')root.innerHTML=top+'<h1>Revisando tu enlace…</h1><p>Un momento y seguimos.</p></section>';
  if(mode==='request')root.innerHTML=top+'<h1>Recupera tu contraseña.</h1><p>Escribe el correo que usas para entrar a ¿Cachaste? y te enviaremos un enlace.</p>'+request+'</section>';
  if(mode==='invalid')root.innerHTML=top+'<h1>Pidamos un enlace nuevo.</h1><p>Este enlace venció, ya se usó o no es válido. Tu cuenta sigue ahí.</p>'+request+'</section>';
  if(mode==='connection')root.innerHTML=top+'<h1>Volvamos a intentarlo.</h1><p>No logramos conectar. Revisa tu conexión y vuelve a intentarlo.</p><button type="button" data-recovery="retry">Reintentar conexión</button><button type="button" class="secondary" data-recovery="request">Pedir otro correo</button><a class="text-link" href="/cuenta.html">Volver a ¿Cachaste?</a></section>';
  if(mode==='password')root.innerHTML=top+'<h1>Elige tu nueva contraseña.</h1><p>Ya validamos el enlace. Elige una frase de al menos doce caracteres que puedas recordar.</p><form id="recovery-password-form"><label>Nueva contraseña<input name="password" type="password" minlength="12" maxlength="256" autocomplete="new-password" required></label><label>Repite la nueva contraseña<input name="repeat" type="password" minlength="12" maxlength="256" autocomplete="new-password" required></label><button type="button" class="text-button" data-recovery="show" aria-pressed="false">Mostrar contraseñas</button><button type="submit"'+(busy?' disabled':'')+'>Cambiar mi contraseña</button></form><button type="button" class="secondary" data-recovery="request">Pedir otro enlace</button></section>';
  if(mode==='sent')root.innerHTML=top+'<h1>Revisa tu correo.</h1><p>Si existe una cuenta con ese correo, recibirás las instrucciones para cambiar tu contraseña.</p><p class="recovery-help">Revisa también Spam y usa el mensaje más reciente. No cierres la app si prefieres ingresar el código ahí.</p><button type="button" data-recovery="resend">Enviar otro correo</button><button type="button" class="secondary" data-recovery="request">Cambiar correo</button><a class="text-link" href="/cuenta.html">Volver a ¿Cachaste?</a></section>';
  if(mode==='success')root.innerHTML=top+'<span class="recovery-success-mark" aria-hidden="true">✓</span><h1>Contraseña actualizada.</h1><p>Ya puedes entrar a ¿Cachaste? con tu nueva contraseña.</p><p class="recovery-help">Si usas la aplicación Android, vuelve a abrirla e inicia sesión. Tu progreso se conserva.</p><a class="primary-button" href="/cuenta.html">Ir a iniciar sesión</a></section>';
  root.querySelectorAll('button').forEach(button=>button.disabled=busy||(!sdk&&button.type==='submit'));
  if(mode==='sent'){const update=()=>{const button=root.querySelector('[data-recovery=resend]');if(!button)return;const seconds=Math.max(0,Math.ceil((sentAt+60000-Date.now())/1000));button.disabled=busy||seconds>0;button.textContent=seconds?'Pedir otro correo en '+seconds+' s':'Enviar otro correo';};update();tick=setInterval(update,1000);}
 }
 async function connect(){
  mode='loading';render();
  try{
   if(!sdk){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);try{const response=await fetch('/api/config',{cache:'no-store',referrerPolicy:'no-referrer',signal:controller.signal});if(!response.ok)throw Error('RECOVERY_CONNECTION');sdk=getWebClient(await response.json());}finally{clearTimeout(timer);}}
   if(active){forgetRecovery(storage);const verified=await verifyRecoveryReturn(sdk,active);await rememberRecovery(storage,verified);active=null;ready=true;verifiedUserId=verified.userId;mode='password';}
   else if(entry.kind==='invalid'){forgetRecovery(storage);ready=false;mode='invalid';}
   else{const resumed=await resumeRecovery(sdk,storage);ready=!!resumed;verifiedUserId=resumed?.userId||null;mode=ready?'password':'request';}
   note('');
  }catch(error){const message=recoveryError(error),connection=message.startsWith('No logramos conectarnos');ready=false;if(!connection){active=null;forgetRecovery(storage);}mode=connection?'connection':'invalid';note(message,true);}
  render();
 }
 async function send(){await requestRecovery(sdk,email,location.origin);sentAt=Date.now();mode='sent';note('');}
 async function work(action,{redraw=true}={}){
  if(busy)return;busy=true;root.setAttribute('aria-busy','true');root.querySelectorAll('button').forEach(b=>button.disabled=true);note('');
  try{await action();}catch(error){note(recoveryError(error),true);if(['RECOVERY_EXPIRED','RECOVERY_REQUIRED','session_not_found','refresh_token_not_found','otp_expired'].includes(error?.code||error?.message)){ready=false;forgetRecovery(storage);mode='invalid';}}
  finally{busy=false;if(redraw)render();else{root.setAttribute('aria-busy','false');root.querySelectorAll('button').forEach(b=>button.disabled=false);}}
 }
 root.addEventListener('submit',event=>{
  if(!['recovery-email-form','recovery-password-form'].includes(event.target.id))return;event.preventDefault();const values=new FormData(event.target);
  if(event.target.id==='recovery-email-form'){email=String(values.get('email')).trim();work(send);return;}
  work(async()=>{const result=await changeRecoveredPassword(sdk,String(values.get('password')),String(values.get('repeat')),{verified:ready,userId:verifiedUserId});if(result.changed){ready=false;verifiedUserId=null;forgetRecovery(storage);active=null;mode='success';}},{redraw:false}).then(()=>{if(mode==='success'||mode==='invalid')render();});
 });
 root.addEventListener('click',event=>{
  const button=event.target.closest('[data-recovery]');if(!button||busy)return;
  if(button.dataset.recovery==='show'){const visible=button.getAttribute('aria-pressed')!=='true';root.querySelectorAll('#recovery-password-form input').forEach(input=>input.type=visible?'text':'password');button.setAttribute('aria-pressed',String(visible));button.textContent=visible?'Ocultar contraseñas':'Mostrar contraseñas';return;}
  if(button.dataset.recovery==='request'){ready=false;active=null;forgetRecovery(storage);mode='request';note('');render();return;}
  if(button.dataset.recovery==='resend'){if(Date.now()-sentAt<60000)return;work(send);return;}
  if(button.dataset.recovery==='retry')work(connect);
 });
 window.addEventListener('pagehide',stopClock,{once:true});
 await connect();
}
