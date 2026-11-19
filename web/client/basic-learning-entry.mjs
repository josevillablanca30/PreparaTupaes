import {createBasicLearningView} from './basic-learning-ui.mjs';

// Web-only integration boundary. Call only after server-confirmed Basic access,
// an authenticated token, and the actual subject are available. No auto-hook.
const SUBJECTS=new Set(['M1','M2','Lectora','Ciencias','Historia']);
const MODES=Object.freeze({'diagnostic-mode':'diagnostic','express-mode':'express-exam','lesson':'lesson'});
export function attachBasicLearningEntry({root,accessToken,getSubject,isBasicEnabled,onComplete=()=>{}}={}){
 if(!root||typeof root.addEventListener!=='function'||typeof getSubject!=='function'||typeof isBasicEnabled!=='function'||typeof accessToken!=='string'||accessToken.length<10)throw Error('BASIC_BRIDGE_CONFIGURATION_REQUIRED');
 let view=null,activePanel=null;
 const handler=event=>{
  const button=event.target.closest?.('button[data-action]');
  const mode=button&&MODES[button.dataset.action];
  if(!mode||!isBasicEnabled())return;
  if(view){event.preventDefault();event.stopImmediatePropagation();return;}
  const subject=getSubject();
  if(!SUBJECTS.has(subject))return; // Never consume an event with unknown course.
  if(mode==='lesson'&&!button.dataset.concept)return; // No implicit lesson selection.
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
