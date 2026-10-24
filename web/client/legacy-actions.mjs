// Execute only the existing, named educational handlers. No eval, Function or inline event CSP exception.
import{parseLegacyAction}from'../shared/legacy-actions.mjs';
document.addEventListener('click',event=>{
 const node=event.target.closest('[data-web-legacy]');if(!node||node.disabled)return;
 let action;try{action=parseLegacyAction(node.getAttribute('data-web-legacy'));}catch{console.error('Unsupported educational action');return;}event.preventDefault();
 if(action.type==='call'){const fn=window[action.name];if(typeof fn==='function')fn(...action.args);return;}
 if(!location.pathname.endsWith('/index.html'))return;
 // These bindings belong to the original M1 classic script, in the same global lexical scope.
 if(action.type==='math-choice'){choice=action.choice;draw();}
 else if(action.type==='math-exam-choice'){choice=action.choice;examAnswers[i]=choice;persistExam();draw();}
 else if(action.type==='math-mode'){mode=action.mode;draw();}
 else if(action.type==='math-overview'){examConfirming=false;examOverviewOpen=true;draw();}
 else if(action.type==='math-confirm'){examConfirming=true;examOverviewOpen=false;draw();}
});
