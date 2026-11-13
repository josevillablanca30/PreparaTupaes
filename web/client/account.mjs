import{getWebClient,nextLearningPage,startGoogleSignIn,finishAuthReturn}from'./auth.mjs';
import{PLANS}from'../shared/config.mjs';
import{initPwa,installPwa,serviceWorkerMessage}from'./shell.mjs';
import{isRecoveryReturn}from'./recovery-flow.mjs';
import{mountRecoveryPage}from'./recovery-page.mjs';
if(isRecoveryReturn(location)){
 mountRecoveryPage({root:document.getElementById('account-root'),status:document.getElementById('account-status')});
}else{
const root=document.getElementById('account-root'),status=document.getElementById('account-status');
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=x=>new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(x);
const messages={COMPLIMENTARY_ACCESS:'Tu acceso de tester es gratuito. No necesitas contratar una suscripción ni ingresar una tarjeta.',TEST_BUYER_EMAIL_REQUIRED:'Ingresa el correo exacto de una cuenta de prueba entregado por Mercado Pago.',NOT_TEST_SELLER:'La cuenta vendedora no pudo verificarse como cuenta de prueba.',CHECKOUT_ALREADY_FINISHED:'Esta solicitud ya fue completada. Actualiza los resultados de prueba.',GOOGLE_NOT_READY:'El acceso con Google está preparado, pero aún falta autorizar el proveedor y su retorno seguro. No se ha creado una cuenta.',AUTH_RETURN_CANCELLED:'El acceso fue cancelado. Puedes volver a intentarlo.',AUTH_RETURN_INVALID:'El enlace de acceso venció o se abrió en otro navegador. Vuelve a iniciar sesión desde aquí.',AUTH_REDIRECT_DENIED:'No pudimos validar el destino de acceso. Vuelve a intentarlo.',AUTH_REQUIRED:'Inicia sesión para continuar.',BILLING_NOT_READY:'Las suscripciones todavía están en preparación. Los cobros siguen desactivados.',CHECKOUT_PENDING:'Tu solicitud anterior sigue en revisión. Actualiza el acceso antes de crear otra.',TRIAL_ALREADY_USED:'La prueba gratuita ya fue utilizada o reservada para esta cuenta. Puedes elegir el plan mensual sin prueba.',PLAN_NOT_READY:'Este plan todavía no está habilitado por el responsable.',SERVICE_UNAVAILABLE:'No logramos conectar. Vuelve a intentarlo cuando tengas conexión.',SYNC_UNAVAILABLE:'No logramos sincronizar. Conservamos el avance de este dispositivo.',QA_ADMIN_REQUIRED:'Tu cuenta aún no está autorizada para pruebas de Mercado Pago.',ORIGIN_NOT_ALLOWED:'Abre la prueba desde el sitio oficial de ¿Cachaste?.',PROVIDER_CHECKOUT_FAILED:'Mercado Pago no pudo iniciar la suscripción de prueba.',TEST_CONFIG_MISSING:'Falta completar la configuración del entorno de prueba.'};
let config,sdk,account=null,billing={ready:false,trialAvailable:false},busy=false,qaState=null,qaEmail='',recovering=location.search.includes('recovery=1');
const checkoutReturned=new URLSearchParams(location.search).get('checkout')==='return';
let emailMode='login',emailDraft='';
async function request(body,url='/api/billing',method='POST',signal){
 const{data:{session}}=sdk?await sdk.auth.getSession():{data:{session:null}};
 const res=await fetch(url,{method,signal,headers:{'content-type':'application/json','x-cachaste-request':'1',...(session?{authorization:'Bearer '+session.access_token}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});
 const data=await res.json();if(!res.ok)throw Error(data.error||'SERVICE_UNAVAILABLE');return data;
}
async function clearBrowserAccess(){await serviceWorkerMessage({type:'PURGE_PRIVATE'});const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);try{await fetch('/api/session',{method:'DELETE',headers:{'x-cachaste-request':'1'},signal:controller.signal});}catch{}finally{clearTimeout(timer);}}
async function connect(verifyPayments=false){
 const{data:{session},error}=await sdk.auth.getSession();if(error)throw error;
 if(!session){account=null;if(navigator.onLine!==false)await clearBrowserAccess();return;}
 let reconciliationDelayed=false;
 if(verifyPayments&&(billing.managementReady||billing.ready)){
  try{await request({action:'refresh'},'/api/billing','POST',AbortSignal.timeout(8000));}catch{reconciliationDelayed=true;}
 }
 const checked=await request({},'/api/session');
 if(!checked.offlineLicense)await serviceWorkerMessage({type:'PURGE_PRIVATE'});
 await initPwa(checked.offlineLicense);
 account=await request(undefined,'/api/session','GET');
 if(reconciliationDelayed)notice('Tu cuenta está disponible. Mercado Pago aún no responde. Puedes actualizar tu acceso más tarde.');
 else if(verifyPayments&&checkoutReturned&&!account?.access?.active)notice('Estamos esperando la confirmación del pago. Puedes consultar el estado en Actualizar mi acceso.');
}
function notice(text){status.textContent=text;}
function emailForm(){
 const email='<label>Correo electrónico<input name="email" type="email" autocomplete="email" maxlength="254" value="'+esc(emailDraft)+'" required></label>';
 const back='<button type="button" class="text-button" data-action="login-form">Volver a iniciar sesión</button>';
 if(emailMode==='confirm')return '<section aria-labelledby="confirm-heading"><h2 id="confirm-heading">Confirma tu correo</h2><p>Ingresa el código que enviamos a '+esc(emailDraft)+'.</p><form id="verify-signup-form"><label>Código del correo<input name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6,10}" maxlength="10" required></label><button type="submit">Verificar correo</button><button type="button" class="secondary" data-action="resend-signup">Reenviar código</button>'+back+'</form></section>';
 if(emailMode==='signup')return '<section aria-labelledby="signup-heading"><h2 id="signup-heading">Crea tu cuenta</h2><form id="signup-form">'+email+'<label>Contraseña nueva<input name="password" type="password" autocomplete="new-password" minlength="12" required></label><p class="legal-note">Usa al menos 12 caracteres.</p><button type="submit">Crear mi cuenta</button>'+back+'</form></section>';
 return '<form id="login-form">'+email+'<label>Contraseña<input name="password" type="password" autocomplete="current-password" required></label><button type="submit">Entrar a mi cuenta <span>→</span></button><button type="button" data-action="signup-form" class="secondary">Crear mi cuenta</button><button type="button" data-action="reset" class="text-button">Recuperar contraseña</button></form>';
}
function changeEmailMode(mode){
 emailDraft=root.querySelector('input[name=email]')?.value.trim()||emailDraft;
 emailMode=mode;
 render();
 root.querySelector('#signup-form input, #login-form input, #verify-signup-form input')?.focus();
}
async function work(fn){if(busy)return;const loginDraft=Array.from(root.querySelectorAll('#login-form input'),x=>[x.name,x.value]);busy=true;root.setAttribute('aria-busy','true');root.querySelectorAll('button').forEach(b=>b.disabled=true);try{notice('');await fn();}catch(e){notice(messages[e.message]||(/Invalid login credentials/i.test(e.message)?'Revisa tu correo y contraseña.':/rate.limit/i.test(e.message)?'Espera unos minutos antes de volver a intentarlo.':'No pudimos completar la operación. Reinténtalo.'));}finally{busy=false;render();if(!account)for(const[name,value]of loginDraft){const input=root.querySelector('#login-form input[name="'+name+'"]');if(input)input.value=value;}}}
const plans=()=>'<section class="account-plans" id="planes"><div class="section-heading"><span class="eyebrow">Tu preparación completa</span><h2>Elige tu ritmo.</h2><p>Una sola suscripción para aprender y competir. Sin vidas limitadas.</p></div><div class="price-grid">'+Object.entries(PLANS).map(([id,p])=>'<article class="price-card '+(id==='mensual'?'featured':'')+'">'+(id==='mensual'?'<span class="price-tag">Elige tu mes de preparación</span>':'')+'<h3>'+p.name+'</h3><p class="price">'+money(p.amount)+'<small> / '+{semanal:'semana',mensual:'mes',anual:'año'}[id]+'</small></p><p>'+esc(id==='mensual'&&billing.trialAvailable&&!account?.trialUsed?'7 días gratis y luego $7.990 al mes. Sujeto a elegibilidad.':id==='semanal'?'Para una semana de práctica enfocada.':id==='mensual'?'Avanza a tu ritmo, un ratito cada día.':'Tu preparación durante todo un año.')+'</p><ul><li>Las cinco asignaturas</li><li>Lecciones, tutor y ensayos</li><li>Rankings y duelos</li></ul><button type="button" data-plan="'+id+'" '+(account?.complimentary?.active?'disabled':'')+'>'+(account?.complimentary?.active?'Acceso gratuito vigente':billing.ready?(account?'Elegir '+p.name.toLowerCase():'Iniciar sesión para suscribirme'):'Ver estado de apertura')+'</button></article>').join('')+'</div>'+(!billing.ready?'<p class="opening-note">Estamos preparando la apertura. La contratación todavía no está habilitada y no se realizarán cobros.</p>':'<p class="legal-note">La suscripción se renueva hasta que la canceles. Revisa el monto y las condiciones en el checkout oficial de Mercado Pago.</p>')+'</section>';
function render(){if(!config)return;
 const user=account?.user,active=account?.access?.active;
 const freeNotice=account?.complimentary?.active?'<section class="account-card"><h2>Tu año gratuito de tester</h2><p>Tu acceso es gratuito hasta '+esc(new Date(account.complimentary.validUntil).toLocaleDateString('es-CL'))+'. No tiene renovación automática ni requiere tarjeta.</p></section>':'';
 root.innerHTML=(user&&new URLSearchParams(location.search).get('reauth')==='google'?'<section class="account-card"><h2>Confirma tu acceso con Google</h2><p>Vuelve a elegir tu cuenta y después abre Perfil para confirmar la eliminación. Tu progreso y tu suscripción no cambian al confirmar el acceso.</p><button type="button" class="google-signin" data-action="google">Confirmar con Google</button></section>':'')+(recovering&&user?'<section class="account-card"><span class="eyebrow">Recupera tu acceso</span><h1>Elige tu nueva contraseña.</h1><form id="recovery-form"><label>Nueva contraseña<input name="password" type="password" minlength="12" autocomplete="new-password" required></label><label>Repite tu contraseña<input name="repeat" type="password" minlength="12" autocomplete="new-password" required></label><button type="submit">Guardar contraseña</button></form></section>':user?'<section class="account-card"><span class="eyebrow">Tu cuenta de ¿Cachaste?</span><h1>Sigamos desde donde quedaste.</h1><p class="account-email">'+esc(user.email)+'</p><p class="access-state">'+(active?'Tu acceso está verificado.':'Tu cuenta está lista. Necesitas una suscripción vigente para abrir tu preparación.')+'</p><div class="account-actions">'+(active?'<a class="primary-button" href="'+nextPage()+'">Continuar mi preparación <span>→</span></a>':'<a class="primary-button" href="#planes">Ver suscripciones</a>')+'<button type="button" class="secondary" data-action="refresh">Actualizar mi acceso</button>'+ '<a class="text-link" href="/app/competencia.html#perfil">Perfil, privacidad y eliminación</a>'+'<button class="text-button" data-action="signout" type="button">Cerrar sesión</button></div></section>':'<section class="account-card"><span class="eyebrow">Un ratito a la vez</span><h1>Tu preparación comienza aquí.</h1><p>Una misma cuenta para tu aprendizaje y competencia. Tu progreso educativo web se guarda en tu cuenta.</p><button type="button" class="google-signin" data-action="google" aria-describedby="google-status"><img src="/icons/google-g.png" alt="" width="20" height="20"> Continuar con Google</button><p id="google-status" class="legal-note">'+(config.googleAuthEnabled&&config.authReturnReady?'Usa tu cuenta de Google para entrar o registrarte.':'Acceso con Google en preparación. Aún no está habilitado.')+'</p><div class="auth-divider"><span>o entra con tu correo</span></div>'+emailForm()+'<p class="legal-note">El acceso educativo y competitivo requiere una suscripción vigente. <a href="/privacidad.html">Privacidad</a> · <a href="/condiciones.html">Condiciones</a></p></section>')+
 (user?'<section class="account-subscriptions">'+(account.subscriptions||[]).map(s=>'<article><h2>Plan '+esc(s.plan)+'</h2><p>Estado: '+esc({authorized:'activo',pending:'pendiente',paused:'pausado',cancelled:'renovación cancelada',canceled:'renovación cancelada'}[s.status]||s.status)+'</p>'+(s.paidUntil?'<p>Período pagado hasta '+esc(new Date(s.paidUntil).toLocaleDateString('es-CL'))+'</p>':'')+(s.renews?'<button class="secondary" type="button" data-cancel="'+esc(s.id)+'">Cancelar renovación</button>':'')+'</article>').join('')+'</section>':'')+freeNotice+plans()+(account?.isAdmin?'<section class="account-card"><h2>Ventas y comisiones</h2><p>Exporta el registro verificado por días de Chile. Este reporte no reemplaza los documentos tributarios.</p><form id="sales-form"><label>Desde<input name="from" type="date" required></label><label>Hasta<input name="to" type="date" required></label><button type="submit">Descargar CSV</button></form></section>':'');
 if(user&&account?.isAdmin&&new URLSearchParams(location.search).get('qa')==='mp')root.innerHTML+='<section class="account-card" id="mp-qa"><span class="eyebrow">Solo administración · Pruebas</span><h2>Checkout Mercado Pago QA</h2><p>Solo cuentas de prueba. Los resultados se guardan separados del acceso real de estudiantes.</p><button type="button" class="secondary" data-action="mp-qa-status">Verificar configuración y suscripciones</button><label>Correo real de la cuenta compradora de prueba<input id="mp-qa-email" type="email" autocomplete="off" value="'+esc(qaEmail)+'" placeholder="Correo entregado por Mercado Pago" required></label><label>Plan de prueba<select id="mp-qa-plan"><option value="MONTHLY_TRIAL">Mensual · 7 días gratis</option><option value="WEEKLY">Semanal · $2.490</option><option value="MONTHLY">Mensual · $7.990</option><option value="YEARLY">Anual · $64.990</option></select></label><button type="button" data-action="mp-qa">Abrir checkout de prueba</button>'+(qaState?'<p>Vendedor y planes de prueba verificados. '+(qaState.webhookConfigured?'Webhooks configurados.':'Falta la firma de webhooks de la aplicación de prueba.')+'</p>'+qaState.subscriptions.filter(s=>s.provider_id).map(s=>'<article><p>'+esc(s.plan)+' · '+esc(s.snapshot?.status||'pendiente')+'</p><button type="button" class="secondary" data-qa-cancel="'+esc(s.provider_id)+'">Cancelar suscripción de prueba</button></article>').join('')+'<button type="button" class="secondary" data-action="mp-qa-refresh">Actualizar resultados de prueba</button>':'')+'</section>'; root.setAttribute('aria-busy','false');
}
function nextPage(){return nextLearningPage(location.search);}
root.addEventListener('submit',e=>{e.preventDefault();const values=new FormData(e.target);work(async()=>{
 if(e.target.id==='login-form'){
  emailDraft=String(values.get('email')).trim();
  const {error}=await sdk.auth.signInWithPassword({email:emailDraft,password:values.get('password')});
  if(error?.code==='email_not_confirmed'){
   emailMode='confirm';
   notice('Confirma tu correo para entrar. Puedes pedir otro código si lo necesitas.');
   return;
  }
  if(error)throw error;
  await connect(true);
  if(account?.access?.active)location.assign(nextPage());
 }
 if(e.target.id==='signup-form'){
  if(!config.signupEnabled){notice('El registro se habilitará cuando esté disponible la confirmación por correo.');return;}
  emailDraft=String(values.get('email')).trim();
  const {data,error}=await sdk.auth.signUp({email:emailDraft,password:values.get('password'),options:{emailRedirectTo:location.origin+'/cuenta.html'}});
  if(error)throw error;
  if(!data.session){emailMode='confirm';notice('Revisa tu bandeja de entrada y spam.');return;}
  emailMode='login';
  await connect(true);
  if(account?.access?.active)location.assign(nextPage());
 }
 if(e.target.id==='verify-signup-form'){
  const token=String(values.get('code')).trim();
  if(!emailDraft||!/^\d{6,10}$/.test(token)){notice('Ingresa el código completo que llegó a tu correo.');return;}
  const {error}=await sdk.auth.verifyOtp({email:emailDraft,token,type:'signup'});
  if(error?.code==='otp_expired'){notice('El código venció o ya se usó. Pide uno nuevo.');return;}
  if(error)throw error;
  emailMode='login';
  await connect(true);
  if(account?.access?.active)location.assign(nextPage());
  else notice('Correo confirmado. Tu cuenta está lista.');
 }
 if(e.target.id==='recovery-form'){if(values.get('password')!==values.get('repeat')){notice('Las contraseñas deben coincidir.');return;}const{error}=await sdk.auth.updateUser({password:values.get('password')});if(error)throw error;await signout();recovering=false;notice('Contraseña actualizada. Vuelve a iniciar sesión.');}
 if(e.target.id==='sales-form'){
  const{data:{session}}=await sdk.auth.getSession();const res=await fetch('/api/billing',{method:'POST',headers:{'content-type':'application/json','x-cachaste-request':'1',authorization:'Bearer '+session.access_token},body:JSON.stringify({action:'sales',fromDate:values.get('from'),toDate:values.get('to')})});if(!res.ok)throw Error('REPORT_UNAVAILABLE');const url=URL.createObjectURL(await res.blob()),a=document.createElement('a');a.href=url;a.download='cachaste-ventas-comisiones.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
});});
async function signout(){await serviceWorkerMessage({type:'PURGE_PRIVATE'});await request(undefined,'/api/session','DELETE');await sdk.auth.signOut({scope:'local'});account=null;}
root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!b.matches('[data-action],[data-plan],[data-cancel],[data-qa-cancel]'))return;
 if(b.dataset.action==='signup-form'){
  if(!config.signupEnabled){notice('El registro se habilitará cuando esté disponible la confirmación por correo.');return;}
  notice('');changeEmailMode('signup');return;
 }
 if(b.dataset.action==='login-form'){notice('');changeEmailMode('login');return;}
 work(async()=>{
 if(b.dataset.action==='resend-signup'){
  if(!emailDraft||emailMode!=='confirm')return;
  const {error}=await sdk.auth.resend({type:'signup',email:emailDraft,options:{emailRedirectTo:location.origin+'/cuenta.html'}});
  if(error)throw error;
  notice('Te enviamos otro código. Usa el más reciente.');
  return;
 }
 if(b.dataset.action==='retry'){location.reload();return;}
 if(b.dataset.action==='google'){await startGoogleSignIn({sdk,config});return;}
 if(b.dataset.action==='signout')await signout();
 if(b.dataset.action==='refresh'){await request({action:'refresh'});await connect();notice(account?.access?.active?'Tu acceso está verificado.':'Todavía no hay un pago o prueba verificados.');}
 if(b.dataset.action==='reset'){location.assign('/recuperar');return;}
 if(b.dataset.action==='mp-qa-status'||b.dataset.action==='mp-qa-refresh'||b.dataset.qaCancel){
  qaEmail=root.querySelector('#mp-qa-email')?.value.trim()||qaEmail;
  if(b.dataset.qaCancel)await request({action:'cancel',subscriptionId:b.dataset.qaCancel},'/api/billing/sandbox');
  if(b.dataset.action==='mp-qa-refresh')await request({action:'refresh'},'/api/billing/sandbox');
  qaState=await request({action:'status'},'/api/billing/sandbox');notice('Estado sandbox verificado. Los cobros reales siguen desactivados.');return;
 }
 if(b.dataset.action==='mp-qa'){
  if(!account?.isAdmin||new URLSearchParams(location.search).get('qa')!=='mp')throw Error('AUTH_REQUIRED');
  qaEmail=root.querySelector('#mp-qa-email')?.value.trim()||'';
  const plan=root.querySelector('#mp-qa-plan').value,key='cachaste-sandbox-checkout:'+account.user.id+':'+plan;
  let requestId=sessionStorage.getItem(key);if(!requestId){requestId=crypto.randomUUID();sessionStorage.setItem(key,requestId);}
  const result=await request({action:'checkout',plan,payerEmail:qaEmail,requestId},'/api/billing/sandbox');
  if(!result.checkoutUrl)throw Error('SERVICE_UNAVAILABLE');location.assign(result.checkoutUrl);return;
 }
 if(b.dataset.plan){if(!billing.ready){notice(messages.BILLING_NOT_READY);return;}if(!account){root.querySelector('[name=email]')?.focus();notice('Primero entra a tu cuenta para vincular la suscripción.');return;}const key='cachaste-checkout:'+account.user.id+':'+b.dataset.plan;let id=localStorage.getItem(key);if(!id){id=crypto.randomUUID();localStorage.setItem(key,id);}const response=await request({action:'checkout',plan:b.dataset.plan,requestId:id});location.assign(response.checkoutUrl);}
 if(b.dataset.cancel){const id=b.dataset.cancel,dialog=document.createElement('dialog');dialog.className='web-dialog';dialog.innerHTML='<h2>Cancelar la renovación</h2><p>Conservarás el período pagado vigente. No se cobrarán renovaciones posteriores a la cancelación confirmada por Mercado Pago.</p><button data-confirm>Confirmar cancelación</button><button data-close class="secondary">Conservar mi plan</button>';document.body.append(dialog);dialog.querySelector('[data-close]').onclick=()=>{dialog.close();dialog.remove();};dialog.querySelector('[data-confirm]').onclick=()=>work(async()=>{await request({action:'cancel',subscriptionId:id});dialog.close();dialog.remove();await connect();notice('Renovación cancelada.');});dialog.showModal();}
});});
document.querySelectorAll('[data-install]').forEach(b=>b.addEventListener('click',installPwa));
(async()=>{try{config=await(await fetch('/api/config')).json();sdk=getWebClient(config);sdk.auth.onAuthStateChange(event=>{if(event==='PASSWORD_RECOVERY')recovering=true;if(['PASSWORD_RECOVERY','TOKEN_REFRESHED','SIGNED_IN','SIGNED_OUT'].includes(event))setTimeout(()=>{if(!busy)work(connect);},0);});try{await finishAuthReturn({sdk});}catch(e){notice(messages[e.message]||messages.AUTH_RETURN_INVALID);}try{billing=await request({action:'status'});}catch{}await connect(true);render();await initPwa();}catch{notice('No logramos conectar tu cuenta. Revisa la conexión y vuelve a intentarlo.');root.innerHTML='<section class="account-card"><h1>Volvamos a intentarlo</h1><p>Conservamos el progreso que ya guardaste en este dispositivo.</p><button data-action="retry" type="button">Reintentar conexión</button></section>';}})();

}
