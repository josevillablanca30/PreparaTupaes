import {adaptDuels2Ui} from '../duels2/ui-transform.mjs';
export function adaptOriginalLearning(source){
 const start="(function(){'use strict';",end='window.CachasteDailyApp={engine:E,basics:B,render};render();';
 if(!source.startsWith(start)||!source.includes(end)||! /\}\)\(\);\s*$/.test(source))throw Error('REVIEW_ORIGINAL_LEARNING_BOUNDARY');
 let body=source.slice(start.length).replace(/\}\)\(\);\s*$/,'');
 body=body.replace('<span>En este dispositivo</span>','<span data-home-progress-scope>En este dispositivo</span>');
 body=body.replace(' const workshopCoverage=', ' window.CachasteLearningAccess.prepare(E);\n const workshopCoverage=');
 const mounted="window.CachasteDailyApp={engine:E,basics:B,render,restoreSubject(){subject=E.state.subject;profileCache=new Map();progressionCache=null;}};render();";
 body=body.replace(end,mounted+"\n window.dispatchEvent(new Event('cachaste-learning-mounted'));");
 // The disabled web path starts synchronously and does not initialize an Auth SDK.
 return "(function(){function launch(){'use strict';"+body+"}\nconst access=window.CachasteLearningAccess;const updateScope=()=>{const label=document.querySelector('[data-home-progress-scope]');if(label){const text=access.progressScope();if(label.textContent!==text)label.textContent=text;}};window.addEventListener('cachaste-sync',updateScope);window.addEventListener('cachaste-learning-mounted',()=>{updateScope();const root=document.getElementById('daily-root');new MutationObserver(updateScope).observe(root,{childList:true});});if(access.enabled)access.ready.then(launch).catch(access.failed);else launch();})();\n";
}
export function adaptConsumptionCompetition(source,{commercialCopy=true}={}){
 source=adaptDuels2Ui(source);
 // Premium remains a separate entitlement; Basic may use Duelos 2.0 and its rankings only.
 source=source.replaceAll('!api.premium','!(api.premium||api.basic)').replaceAll('&&api.premium','&&(api.premium||api.basic)');
 if(commercialCopy){
  source=source.replace("function authForm(){return", "function authForm(){return (window.CACHASTE_COMPETITION_CONFIG?.googleAuthReady?btn('android-google','Continuar con Google','outline wide'):'')+");
  // Use a separate capture listener, leaving the existing form/navigation renderer unchanged.
  source=source.replace(" window.CachasteCompetition={api,render};", ` document.addEventListener('click',event=>{if(event.target.closest?.('[data-action="android-google"]')){event.preventDefault();work(async()=>{const {data,error}=await api.sdk.auth.signInWithOAuth({provider:'google',options:{redirectTo:'cl.preparatupaes.app://auth/callback',skipBrowserRedirect:true}});if(error)throw error;if(data.url)location.href=data.url;});}});\n window.CachasteCompetition={api,render};`);
 }
 if(commercialCopy)source=source.replace('Los cobros y la prueba de siete días se habilitarán con Google Play.','Si ya tienes Premium, inicia sesión con la misma cuenta para utilizar tus beneficios.');
 if(commercialCopy)source=source.replaceAll('Ver planes y restauración','Mi acceso').replaceAll('Planes, cancelación y restauración','Mi acceso').replaceAll('Competencia con suscripción','Tu acceso a la competencia');
 source=source.replace("function accessNote(){","function accessNote(){if(api.basic)return '<section class=\"access-note\"><p>Plan Básico · 2 duelos diarios. Tu progreso se conserva.</p></section>';");
 return source;
}
