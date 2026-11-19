import {createBasicLearningView} from './basic-learning-ui.mjs';

// The web-only bridge is deliberately inert until the authenticated server
// bootstrap explicitly identifies a Basic learner and the release is enabled.
const bootstrap=window.CachasteWebBootstrap;
if(bootstrap?.basicEnabled===true&&bootstrap?.accessTier==='basica'&&location.pathname==='/app/inicio.html'){
 const root=document.getElementById('daily-root');
 if(root){
  const supported=new Map([['diagnostic-mode','diagnostic'],['express-mode','express-exam'],['lesson','lesson']]);
  let view=null;
  root.addEventListener('click',event=>{
   const button=event.target.closest('button[data-action]');
   if(!button||!supported.has(button.dataset.action))return;
   event.preventDefault();event.stopImmediatePropagation();
   if(view)return;
   const mode=supported.get(button.dataset.action);
   const subject=window.CachasteWebBasicSubject;
   // Subject must come from an explicitly synchronized and validated source;
   // never infer it from the visible label or silently start the wrong course.
   if(!['M1','M2','Lectora','Ciencias','Historia'].includes(subject))return;
   const panel=document.createElement('section');panel.setAttribute('aria-label','Actividad Básica');
   root.replaceChildren(panel);
   view=createBasicLearningView({root:panel,accessToken:null,onComplete:()=>{}});
   void view.start({mode,subject,requestKey:crypto.randomUUID()}).catch(()=>{});
  },true);
 }
}
