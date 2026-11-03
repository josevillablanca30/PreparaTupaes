import{initPwa}from'./shell.mjs';
import{isRecoveryReturn,captureRecoveryReturn}from'./recovery-flow.mjs';
import{mountRecoveryPage}from'./recovery-page.mjs';
// Old Android builds omit redirectTo, so Supabase uses the site's root. Capture
// the callback before other page work, without copying credentials to a new URL.
let recoveryMounted=false;
function showRecoveryReturn(){
 if(recoveryMounted||!isRecoveryReturn(location))return false;
 recoveryMounted=true;
 const entry=captureRecoveryReturn(location,history);
 document.documentElement.setAttribute('data-recovery-return','');
 const mount=()=>{
  const template=document.getElementById('recovery-page-template');
  document.body.replaceChildren(template.content.cloneNode(true));
  document.body.className='recovery-page';
  document.title='Recupera tu contraseña · ¿Cachaste?';
  document.documentElement.removeAttribute('data-recovery-return');
  mountRecoveryPage({root:document.getElementById('recovery-root'),status:document.getElementById('recovery-status'),entry});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
 return true;
}
window.addEventListener('hashchange',showRecoveryReturn);
if(!showRecoveryReturn()){
initPwa();
(async()=>{try{const response=await fetch('/api/billing',{method:'POST',headers:{'content-type':'application/json','x-cachaste-request':'1'},body:JSON.stringify({action:'status'})});if(!response.ok)return;const state=await response.json();if(state.ready){document.querySelector('[data-opening]')?.remove();const note=document.querySelector('[data-plan-note]');if(note)note.textContent='Precios en pesos chilenos. La suscripción se renueva hasta que la canceles. Revisa las condiciones en el checkout oficial de Mercado Pago.';}if(state.trialAvailable){const trial=document.querySelector('[data-trial]');if(trial)trial.textContent='7 días gratis y luego $7.990 mensuales. Sujeto a elegibilidad.';}}catch{}})();
}
