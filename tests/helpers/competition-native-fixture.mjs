import{session,user,profile,ranking,duel,attempt,finished,dashboard}from'./competition-fixtures.mjs';
// Android instrumentation only. Neither this source nor this bundle is in the candidate APK.
localStorage.setItem('cachaste-auth-v1',JSON.stringify(session()));
const original=window.fetch.bind(window);let position=0,done=false;
window.fetch=async(input,init)=>{
 const request=new Request(input,init);if(!request.url.startsWith('https://jmobinmdwrmdqrxtcruj.supabase.co/'))return original(input,init);
 let data={};
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
  else if(op==='start'||op==='attempt')data=attempt(position,done?'complete':'active');
  else if(op==='answer'){position=Math.max(position,p.position+1);done=position===10;data=attempt(position,done?'complete':'active');}
  else if(op==='review')data={errors:[{question:{concept:'Números y cantidades',question:'¿Cuánto es 2 + 3?',options:['4','5','6','7'],steps:['Partimos con dos unidades.','Agregamos tres unidades.','Dos más tres es cinco.'],easy:'Imagina dos lápices y agrega otros tres.',example:'Cuatro lápices y uno más también forman cinco.',explanations:['Faltó sumar una unidad.']},choice:0,answer:1,correct:false}]};
 }
 return new Response(JSON.stringify(data),{status:200,headers:{'content-type':'application/json'}});
};
