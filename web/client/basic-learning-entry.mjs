import {createBasicLearningView} from './basic-learning-ui.mjs';
import {basicQuotaSummary} from './basic-quota.mjs';

// This check is read-only and never activates the Basic release by itself.
// Both the release flag and the authenticated server entitlement must agree.
export async function verifyBasicLearningAccess({fetcher=fetch,accessToken=null}={}){
 try{
  const response=await fetcher('/api/config',{method:'GET',credentials:'same-origin',cache:'no-store'});
  if(!response.ok)return false;
  const config=await response.json();
  if(config?.basicEnabled!==true)return false;
  const summary=await basicQuotaSummary({fetcher,accessToken});
  return summary.tier==='basica';
 }catch{return false;}
}

// Web-only integration boundary. Call only after server-confirmed Basic access,
// an authenticated token, and the actual subject are available. No auto-hook.
const SUBJECTS=new Set(['M1','M2','Lectora','Ciencias','Historia']);
const installedBridges=new WeakMap();
// Lesson launch requires binding the selected concept to server issuance first.
// Do not silently replace a chosen lesson with unrelated questions.
const MODES=Object.freeze({'diagnostic-mode':'diagnostic'});
// These legacy launchers do not enforce Basic quota or server-issued grading.
// Every action below can launch an unmetered legacy question session.
// Block the launch (not navigation) until its original engine is quota-attested.
const UNSUPPORTED_BASIC_ACTIONS=new Set(['exam-mode','unit-exam','studio-lesson','express-mode','studio-direct-test','studio-assess','review-due','keep-practicing','check-first','smart','free','lesson','study-practice','basic-start','resume','switch-start']);
export function attachBasicLearningEntry({root,accessToken=null,getSubject,isBasicEnabled,onComplete=()=>{}}={}){
 if(!root||typeof root.addEventListener!=='function'||typeof getSubject!=='function'||typeof isBasicEnabled!=='function'||(accessToken!==null&&(typeof accessToken!=='string'||accessToken.length<10)))throw Error('BASIC_BRIDGE_CONFIGURATION_REQUIRED');
 if(installedBridges.has(root))return installedBridges.get(root);
 let view=null,activePanel=null,activeClose=null,restoreVisibility=null,selectedSubject=null;
 const clearActivity=()=>{
  activePanel?.remove();activeClose?.remove();
  if(restoreVisibility!==null)root.hidden=restoreVisibility;
  view=null;activePanel=null;activeClose=null;restoreVisibility=null;
 };
 const handler=event=>{
  const button=event.target.closest?.('button[data-action]');
  const action=button?.dataset.action;
  const mode=action&&MODES[action];
  // Track only explicit course selections from the existing daily-app UI.
  // Never infer a course from a local question bank or an unverified URL.
  if(action==='pick-course')selectedSubject=SUBJECTS.has(button.dataset.subject)?button.dataset.subject:null;
  if(action==='pick-track')selectedSubject='Ciencias';
  if(!isBasicEnabled())return;
  if(!mode&&UNSUPPORTED_BASIC_ACTIONS.has(action)){
   event.preventDefault();event.stopImmediatePropagation();
   let notice=root.querySelector('[data-basic-restriction]');
   if(!notice){notice=root.ownerDocument.createElement('p');notice.dataset.basicRestriction='';notice.setAttribute('role','alert');root.prepend(notice);}
   notice.textContent=action==='exam-mode'?'Los ensayos completos requieren Premium.':action==='express-mode'?'El PAES Express todavía no está habilitado en Básica.':'Esta actividad todavía no está habilitada en Básica.';
   return;
  }
  if(!mode)return;
  if(view){event.preventDefault();event.stopImmediatePropagation();return;}
  const configuredSubject=getSubject();
  // A fresh, explicit course choice takes precedence over a stale persisted value.
  const subject=selectedSubject??configuredSubject;
  if(!SUBJECTS.has(subject)){
   // An enabled Basic account must never fall through to the legacy local
   // question engine when its selected course cannot be verified.
   event.preventDefault();event.stopImmediatePropagation();
   let notice=root.querySelector('[data-basic-restriction]');
   if(!notice){notice=root.ownerDocument.createElement('p');notice.dataset.basicRestriction='';notice.setAttribute('role','alert');root.prepend(notice);}
   notice.textContent='Selecciona primero una asignatura para iniciar el diagnóstico.';
   return;
  }
  root.querySelector('[data-basic-restriction]')?.remove();
  event.preventDefault();event.stopImmediatePropagation();
  const panel=root.ownerDocument.createElement('section');panel.setAttribute('aria-label','Actividad Básica');
  view=createBasicLearningView({root:panel,accessToken,onComplete});
  activePanel=panel;
  // Mount outside the legacy renderer: daily-app may replace root.innerHTML
  // while the activity is open. Never let that destroy an issued attempt.
  restoreVisibility=root.hidden;
  root.hidden=true;
  const close=root.ownerDocument.createElement('button');close.type='button';close.textContent='Volver a las actividades';
  close.addEventListener('click',()=>{
   const phase=view?.snapshot().phase;
   if(phase==='issued'||phase==='reserved'||phase==='issuing'||phase==='reserving'||phase==='completing')return;
   clearActivity();
  });
  activeClose=close;
  root.after(close,panel);
  // Never discard a failed launch silently: the activity view owns recovery
  // and must remain mounted when the server may already have reserved quota.
  void view.start({mode,subject,requestKey:crypto.randomUUID()}).catch(()=>{
   const phase=view?.snapshot().phase;
   if(phase==='idle'&&!panel.textContent.trim()){
    const error=root.ownerDocument.createElement('p');
    error.setAttribute('role','alert');
    error.textContent='No pudimos iniciar la actividad. Vuelve a intentarlo.';
    panel.append(error);
   }
  });
 };
 root.addEventListener('click',handler,true);
 const bridge=Object.freeze({detach(){if(view){const phase=view.snapshot().phase;if(['issued','reserved','issuing','reserving','completing'].includes(phase))return false;}root.removeEventListener('click',handler,true);clearActivity();installedBridges.delete(root);return true;},snapshot:()=>view?.snapshot()??{phase:'idle'},get panel(){return activePanel;}});
 installedBridges.set(root,bridge);
 return bridge;
}

// The production release flag remains false. This boot path is inert until
// /api/config AND the authenticated quota summary both authorize Basic.
export async function initializeBasicLearningEntry({documentRef=globalThis.document,fetcher=fetch}={}){
 if(!documentRef?.getElementById)return null;
 const enabled=await verifyBasicLearningAccess({fetcher});
 if(!enabled)return null;
 const root=documentRef.getElementById('daily-root');
 if(!root)return null;
 // No untrusted local entitlement and no guessing a persisted subject.
 return attachBasicLearningEntry({root,getSubject:()=>null,isBasicEnabled:()=>true});
}
if(typeof window!=='undefined'){
 window.CachasteBasicLearningBridge=Object.freeze({attach:attachBasicLearningEntry,verifyAccess:verifyBasicLearningAccess,initialize:initializeBasicLearningEntry});
 const boot=()=>{void initializeBasicLearningEntry().catch(()=>{});};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
}
