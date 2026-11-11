import{session,user,profile,ranking,duel,attempt,finished,dashboard}from'./competition-fixtures.mjs';
// Android instrumentation only. Neither this source nor this bundle is in the candidate APK.
localStorage.setItem('cachaste-auth-v1',JSON.stringify(session()));
const original=window.fetch.bind(window);let position=0,done=false;
const modern=new URLSearchParams(location.search).get('fixture')==='duels2';
const balance=()=>position*2;
function modernDuel(){
 const d=done?finished():duel();
 if(d.result){d.result.reason='mastery';d.result.creator.mastery=14;d.result.opponent.mastery=6;}
 return {...d,version:2,balance:balance(),opponentKind:'bot',opponent:{...d.opponent,id:'virtual',nickname:'Rival virtual',virtual:true,level:'initial'}};
}
const modernAttempt=()=>({...attempt(position,done?'complete':'active'),version:2,balance:balance(),streak:position});
if(modern){
 // An unreachable transport exercises the polling path without calling hosted services.
 window.WebSocket=class extends EventTarget{
  static CONNECTING=0;static OPEN=1;static CLOSING=2;static CLOSED=3;
  readyState=3;
  close(){}
  send(){}
 };
}
window.fetch=async(input,init)=>{
 const request=new Request(input,init);if(!request.url.startsWith('https://jmobinmdwrmdqrxtcruj.supabase.co/'))return original(input,init);
 let data={};
 if(request.url.includes('/rpc/cachaste_duels2')){
  if(!modern)return new Response(JSON.stringify({code:'PGRST202',message:'cachaste_duels2 is not installed in the legacy fixture'}),{status:404,headers:{'content-type':'application/json'}});
  const {operation,payload}=await request.json();
  if(operation==='dashboard')data={...dashboard(done),duels:[]};
  else if(operation==='random'||operation==='duel')data=modernDuel();
  else if(operation==='start'||operation==='attempt')data=modernAttempt();
  else if(operation==='answer'){position=Math.max(position,payload.position+1);done=position===10;data=modernAttempt();}
  else if(operation==='review')data={errors:[{question:{concept:'Números',question:'¿Cuánto es 2 + 3?',options:['4','5','6','7'],steps:['Partimos con dos y agregamos tres.'],easy:'Dos lápices más tres lápices.',example:'Cuatro más uno también es cinco.',explanations:['Faltó una unidad.']},choice:0,answer:1,correct:false}]};
  else if(operation==='rematch'){position=0;done=false;data=modernDuel();}
  return new Response(JSON.stringify(data),{headers:{'content-type':'application/json'}});
 }
 if(request.url.includes('/auth/v1/user'))data=user;
 else if(request.url.includes('/auth/v1/token'))data=session();
 else if(request.url.includes('/rpc/cachaste_competition_health'))data={apiVersion:1,catalogueReady:true};
 else if(request.url.includes('/rpc/cachaste_competition')){
  const{operation:op,payload:p}=await request.json();
  if(op==='profile'||op==='save_profile')data={profile,premium:true,season:'2026-10-19'};
  else if(op==='rankings')data=ranking;
  else if(op==='dashboard')data=dashboard(done);
  else if(['create_duel','join_code','accept','random'].includes(op))data=duel();
  else if(op==='duel')data=done?finished():duel();
  else if(op==='start'||op==='attempt'){data=attempt(position,done?'complete':'active');if(position===0&&data.question)data.question=__CACHASTE_QA_STIMULUS__;}
  else if(op==='answer'){position=Math.max(position,p.position+1);done=position===10;data=attempt(position,done?'complete':'active');}
  else if(op==='review')data={errors:[{question:{concept:'Números y cantidades',question:'¿Cuánto es 2 + 3?',options:['4','5','6','7'],steps:['Partimos con dos unidades.','Agregamos tres unidades.','Dos más tres es cinco.'],easy:'Imagina dos lápices y agrega otros tres.',example:'Cuatro lápices y uno más también forman cinco.',explanations:['Faltó sumar una unidad.']},choice:0,answer:1,correct:false}]};
 }
 return new Response(JSON.stringify(data),{status:200,headers:{'content-type':'application/json'}});
};
