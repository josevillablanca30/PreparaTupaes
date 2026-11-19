import {createBasicLearningSession} from './basic-session.mjs';
import {classifyDailyAdmission} from '../shared/basic-completion-contract.mjs';

// Web-only, server-issued Basic learning view. It never invokes the local
// Android learning engine or receives the private answer key.
export function createBasicLearningView({root,accessToken,fetcher=fetch,onComplete=()=>{}}={}){
 if(!root||typeof root.replaceChildren!=='function')throw Error('BASIC_VIEW_ROOT_REQUIRED');
 if(accessToken!==null&&(typeof accessToken!=='string'||accessToken.length<10))throw Error('AUTH_REQUIRED');
 let session=null,questions=[],answers=[],index=0,busy=false,activity=null;
 const element=(tag,text)=>{const n=root.ownerDocument.createElement(tag);if(text!==undefined)n.textContent=String(text);return n;};
 const show=(...nodes)=>root.replaceChildren(...nodes);
 const message=(text)=>show(element('p',text));
 function render(){
  if(!session||session.snapshot().phase!=='issued')return;
  const q=questions[index],wrap=element('section'),title=element('h2',activity.mode==='diagnostic'?'Diagnóstico':activity.mode==='express-exam'?'PAES Express':'Lección');
  const progress=element('p',`Pregunta ${index+1} de ${questions.length}`),prompt=element('p',q.prompt),choices=element('fieldset');
  choices.setAttribute('aria-label','Alternativas');
  q.options.forEach((option,i)=>{
   const label=element('label'),radio=element('input');radio.type='radio';radio.name='basic-answer';radio.value=String(i);
   radio.checked=answers[index]===i;radio.disabled=busy;
   radio.addEventListener('change',()=>{if(!busy)answers[index]=i;});
   label.append(radio,element('span',option));choices.append(label);
  });
  const next=element('button',index===questions.length-1?'Terminar actividad':'Siguiente');next.type='button';next.disabled=busy;
  next.addEventListener('click',async()=>{
   if(busy)return;
   const selected=choices.querySelector('input:checked');if(!selected){const warning=element('p','Selecciona una alternativa para continuar.');warning.setAttribute('role','alert');wrap.append(warning);return;}
   answers[index]=Number(selected.value);
   if(index<questions.length-1){index++;render();return;}
   busy=true;next.disabled=true;
   try{
    const result=await session.finish({answers:questions.map((item,j)=>({questionId:item.id,selectedIndex:answers[j]}))});
    const heading=element('h2','Actividad completada'),score=element('p',`Respuestas correctas: ${result.correct} de ${result.total}`);
    show(heading,score);onComplete(result);
   }catch(error){busy=false;message('No pudimos confirmar tu actividad. Conserva esta pantalla y vuelve a intentarlo.');
    const retry=element('button','Reintentar confirmación');retry.type='button';retry.addEventListener('click',()=>render());root.append(retry);
   }
  });
  const previous=element('button','Anterior');previous.type='button';previous.disabled=busy||index===0;
  previous.addEventListener('click',()=>{if(busy||index===0)return;const selected=choices.querySelector('input:checked');if(selected)answers[index]=Number(selected.value);index--;render();});
  wrap.append(title,progress,prompt,choices,previous,next);show(wrap);
 }
 function showRetry(){
  const button=element('button','Reintentar carga');button.type='button';
  button.addEventListener('click',()=>{button.disabled=true;void api.retry().catch(()=>{});});
  root.append(button);
 }
 const api=Object.freeze({
  async start({mode,subject,requestKey}={}){
   if(busy||session)throw Error('BASIC_SESSION_ALREADY_STARTED');
   if(!classifyDailyAdmission({mode,subject}).allowed)throw Error('BASIC_ACTIVITY_MISMATCH');
   session=createBasicLearningSession({fetcher,accessToken});activity={mode,subject,requestKey};busy=true;message('Preparando actividad…');
   try{
    const result=await session.launch(activity);
    if(!result.started){busy=false;session=null;activity=null;message(result.reason==='BASIC_QUOTA_EXHAUSTED'?'Ya utilizaste los cupos disponibles.':'Esta actividad todavía no está disponible.');return result;}
    questions=result.questions;answers=new Array(questions.length).fill(null);index=0;busy=false;render();return result;
   }catch(error){busy=false;message('No pudimos cargar la actividad.');if(session.snapshot().phase==='reserved')showRetry();else if(session.snapshot().phase==='idle'){session=null;activity=null;}throw error;}
  },
  async retry(){
   if(!session||session.snapshot().phase!=='reserved'||busy)throw Error('BASIC_RETRY_NOT_AVAILABLE');
   busy=true;message('Recuperando actividad…');
   try{const result=await session.launch(activity);questions=result.questions;answers=new Array(questions.length).fill(null);index=0;busy=false;render();return result;}
   catch(error){busy=false;message('La actividad sigue pendiente.');showRetry();throw error;}
  },
  snapshot:()=>Object.freeze({phase:session?.snapshot().phase??'idle',index,total:questions.length})
 });
 return api;
}
