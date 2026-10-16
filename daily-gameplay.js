/* Offline interaction engine for PAES reasoning.
   Inspired by the challenge -> check -> feedback -> continue lifecycle
   in Mohanad AL Faleet's MIT-licensed duolingo-nextjs clone.
   Ordering, validation, question selection and persistence are original to Cachaste.
   https://github.com/mohannadofficial/duolingo-nextjs
   Copyright (c) 2024 Mohanad AL Faleet (MIT attribution in docs).
*/
(function(g){'use strict';
 const clean=q=>{
  const steps=q?.teaching?.example?.steps;
  if(!Array.isArray(steps)||steps.length<3||steps.length>5)return null;
  const rows=steps.map(x=>typeof x==='string'?x.trim():'');
  if(rows.some(x=>x.length<12||x.length>500)||new Set(rows).size!==rows.length)return null;
  return rows;
 };
 const permutation=(key,n)=>{
  const chars=String(key||'PAES');
  let hash=0;for(const c of chars)hash=(Math.imul(hash,33)+c.charCodeAt(0))>>>0;
  const order=Array.from({length:n},(_,i)=>i);
  for(let i=n-1;i>0;i--){hash=(Math.imul(hash,1664525)+1013904223)>>>0;const j=hash%(i+1);[order[i],order[j]]=[order[j],order[i]];}
  if(order.every((x,i)=>x===i)){[order[0],order[1]]=[order[1],order[0]];}
  return order;
 };
 function create(q){const steps=clean(q);if(!steps)return null;return{key:q.key,order:permutation(q.key,steps.length),chosen:[],checked:false,correct:false,tries:0};}
 function valid(q,state){const steps=clean(q);if(!steps||!state||state.key!==q.key||!Array.isArray(state.order)||!Array.isArray(state.chosen)||state.order.length!==steps.length)return false;
  if(new Set(state.order).size!==steps.length||state.order.some(v=>!Number.isInteger(v)||v<0||v>=steps.length))return false;
  if(new Set(state.chosen).size!==state.chosen.length||state.chosen.some(v=>!state.order.includes(v)))return false;
  return typeof state.checked==='boolean'&&typeof state.correct==='boolean'&&Number.isInteger(state.tries)&&state.tries>=0;
 }
 function choose(q,s,index){if(!valid(q,s)||s.checked||!Number.isInteger(index)||index<0||index>=s.order.length)return false;const v=s.order[index];if(s.chosen.includes(v))return false;s.chosen.push(v);return true;}
 function undo(q,s){if(!valid(q,s)||s.checked||!s.chosen.length)return false;s.chosen.pop();return true;}
 function reset(q,s){if(!valid(q,s))return false;s.chosen=[];s.checked=false;s.correct=false;return true;}
 function check(q,s){if(!valid(q,s)||s.checked||s.chosen.length!==s.order.length)return null;s.tries++;s.correct=s.chosen.every((v,i)=>v===i);s.checked=true;return s.correct;}
 g.CachasteGameplay={create,clean,valid,choose,undo,reset,check};
})(typeof window==='undefined'?globalThis:window);
