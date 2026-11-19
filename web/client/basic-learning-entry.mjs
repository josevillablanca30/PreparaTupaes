import {createBasicLearningView} from './basic-learning-ui.mjs';

// Web-only integration boundary. Call only after server-confirmed Basic access,
// an authenticated token, and the actual subject are available. No auto-hook.
const SUBJECTS=new Set(['M1','M2','Lectora','Ciencias','Historia']);
// Lesson launch requires binding the selected concept to server issuance first.
// Do not silently replace a chosen lesson with unrelated questions.
const MODES=Object.freeze({'diagnostic-mode':'diagnostic','express-mode':'express-exam'});
// These legacy launchers do not enforce Basic quota or server-issued grading.
const UNSUPPORTED_BASIC_ACTIONS=new Set(['exam-mode','unit-exam','studio-lesson']);
export function attachBasicLearningEntry({root,accessToken=null,getSubject,isBasicEnabled,onComplete=()=>{}}={}){
 if(!root||typeof root.addEventListener!=='function'||typeof getSubject!=='function'||typeof isBasicEnabled!=='function'||(accessToken!==null&&(typeof accessToken!=='string'||accessToken.length<10)))throw Error('BASIC_BRIDGE_CONFIGURATION_REQUIRED');
 let view=null,activePanel=null;
 const handler=event=>{
  const button=event.target.closest?.('button[data-action]');
  const action=button?.dataset.action;
  const mode=action&&MODES[action];
  if(!isBasicEnabled())return;
  if(!mode&&UNSUPPORTED_BASIC_ACTIONS.has(action)){
   event.preventDefault();event.stopImmediatePropagation();
   let notice=root.querySelector('[data-basic-restriction]');
   if(!notice){notice=root.ownerDocument.createElement('p');notice.dataset.basicRestriction='';notice.setAttribute('role','alert');root.prepend(notice);}
   notice.textContent=action==='exam-mode'?'Los ensayos completos requieren Premium.':'Esta actividad todavía no está habilitada en Básica.';
   return;
  }
  if(!mode)return;
  if(view){event.preventDefault();event.stopImmediatePropagation();return;}
  const subject=getSubject();
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

// Export a callable bridge from the classic web bundle; publishing this API
// does not activate Basic or install any event listener.
if(typeof window!=='undefined')window.CachasteBasicLearningBridge=Object.freeze({attach:attachBasicLearningEntry});
