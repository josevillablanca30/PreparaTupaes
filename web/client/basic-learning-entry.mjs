import {createBasicLearningView} from './basic-learning-ui.mjs';
import {basicQuotaSummary} from './basic-quota.mjs';

// This check is read-only and never activates the Basic release by itself.
// Both the release flag and the authenticated server entitlement must agree.
export async function verifyBasicLearningAccess({fetcher=fetch,accessToken=null}={}){
 const response=await fetcher('/api/config',{method:'GET',credentials:'same-origin',cache:'no-store'});
 if(!response.ok)return false;
 const config=await response.json();
 if(config?.basicEnabled!==true)return false;
 try{
  const summary=await basicQuotaSummary({fetcher,accessToken});
  return summary.tier==='basica';
 }catch{return false;}
}

// Web-only integration boundary. Call only after server-confirmed Basic access,
// an authenticated token, and the actual subject are available. No auto-hook.
const SUBJECTS=new Set(['M1','M2','Lectora','Ciencias','Historia']);
// Lesson launch requires binding the selected concept to server issuance first.
// Do not silently replace a chosen lesson with unrelated questions.
const MODES=Object.freeze({'diagnostic-mode':'diagnostic'});
// These legacy launchers do not enforce Basic quota or server-issued grading.
const UNSUPPORTED_BASIC_ACTIONS=new Set(['exam-mode','unit-exam','studio-lesson','express-mode']);
export function attachBasicLearningEntry({root,accessToken=null,getSubject,isBasicEnabled,onComplete=()=>{}}={}){
 if(!root||typeof root.addEventListener!=='function'||typeof getSubject!=='function'||typeof isBasicEnabled!=='function'||(accessToken!==null&&(typeof accessToken!=='string'||accessToken.length<10)))throw Error('BASIC_BRIDGE_CONFIGURATION_REQUIRED');
 let view=null,activePanel=null,selectedSubject=null;
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
   return;
  }
  event.preventDefault();event.stopImmediatePropagation();
  const panel=root.ownerDocument.createElement('section');panel.setAttribute('aria-label','Actividad Básica');
  view=createBasicLearningView({root:panel,accessToken,onComplete});
  activePanel=panel;
  // Keep the original learning tree mounted so closing Basic restores navigation.
  const existing=[...root.children];
  const priorVisibility=existing.map(node=>node.hidden);
  for(const node of existing)node.hidden=true;
  const close=root.ownerDocument.createElement('button');close.type='button';close.textContent='Volver a las actividades';
  close.addEventListener('click',()=>{
   const phase=view?.snapshot().phase;
   if(phase==='issued'||phase==='reserved'||phase==='issuing'||phase==='reserving'||phase==='completing')return;
   panel.remove();close.remove();existing.forEach((node,i)=>{node.hidden=priorVisibility[i];});
   view=null;activePanel=null;
  });
  root.append(close,panel);
  void view.start({mode,subject,requestKey:crypto.randomUUID()}).catch(()=>{});
 };
 root.addEventListener('click',handler,true);
 return Object.freeze({detach(){root.removeEventListener('click',handler,true);},snapshot:()=>view?.snapshot()??{phase:'idle'},get panel(){return activePanel;}});
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
