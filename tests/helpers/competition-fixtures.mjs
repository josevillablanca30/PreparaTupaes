// Isolated UI fixtures. This module is never imported by application or build files.
export const actor={id:'10000000-0000-4000-8000-000000000001',nickname:'JoséPAES',avatar:0,commune:'San Felipe',region:'Valparaíso'};
export const opponent={id:'10000000-0000-4000-8000-000000000002',nickname:'CataPAES',avatar:1,commune:'Viña del Mar',region:'Valparaíso'};
export const profile={user_id:actor.id,nickname:actor.nickname,avatar:0,region:'Valparaíso',region_code:'05',commune:'San Felipe',commune_code:'05701',public_ranking:true,allow_challenges:true,show_commune:true};
export const user={id:actor.id,email:'ui-fixture@example.invalid',aud:'authenticated',role:'authenticated',app_metadata:{provider:'email'},user_metadata:{},created_at:'2026-10-01T00:00:00Z'};
export function session(){const payload={sub:actor.id,role:'authenticated',exp:Math.floor(Date.now()/1000)+3600,session_id:'20000000-0000-4000-8000-000000000001'};return{access_token:'eyJhbGciOiJIUzI1NiJ9.'+btoa(JSON.stringify(payload))+'.fixture-signature',refresh_token:'isolated-ui-fixture',token_type:'bearer',expires_in:3600,expires_at:payload.exp,user};}
export function duel(status='active',result=null){return{id:'30000000-0000-4000-8000-000000000001',subject:'M1',track:'',creator:actor,opponent,creatorStars:8,opponentStars:11,season:'2026-10-19',status,createdAt:'2026-10-22T18:00:00Z',expiresAt:'2026-10-24T18:00:00Z',attemptId:'40000000-0000-4000-8000-000000000001',attemptStatus:status==='finished'?'complete':'ready',result};}
export function finished(outcome='win'){const winner=outcome==='draw'?null:outcome==='loss'?opponent.id:actor.id;return duel('finished',{winner,reason:outcome==='draw'?'draw':'correct',changes:{[actor.id]:outcome==='draw'?0:outcome==='loss'?-1:1},creator:{correct:outcome==='loss'?6:8,elapsedMs:300000,status:'complete'},opponent:{correct:outcome==='loss'?9:outcome==='draw'?8:7,elapsedMs:300000,status:'complete'}});}
export const ranking={season:'2026-10-19',scope:'Región',participating:true,category:'express-M1--2026-10-19-v1',top:['CataPAES','LectorPro','MatiMaster','BioCrack','HistoriaTop'].map((nickname,i)=>({nickname,avatar:i+1,position:i+1,commune:['Viña del Mar','Quilpué','Valparaíso','Villa Alemana','Quilpué'][i],region:'Valparaíso',value:15-i,total:15,user_id:'fixture-'+i,wins:12,losses:4,draws:0,streak:3})),me:{nickname:actor.nickname,avatar:0,position:12,commune:'San Felipe',region:'Valparaíso',value:8,total:15,user_id:actor.id,wins:12,losses:4,draws:0,streak:3},nearby:[]};
export function attempt(position=0,status='active'){return{id:'40000000-0000-4000-8000-000000000001',duelId:duel().id,kind:'duel',subject:'M1',track:'',position,status,total:10,deadline:new Date(Date.now()+900000).toISOString(),questionDeadline:new Date(Date.now()+90000).toISOString(),serverNow:new Date().toISOString(),question:status==='active'?{key:'fixture-math',question:'¿Cuánto es 2 + 3?',options:['4','5','6','7'],concept:'Números y cantidades'}:null};}
export function dashboard(done=false,outcome='win'){return{season:'2026-10-19',stats:{stars:8,wins:12,losses:4,draws:0,streak:3},history:{wins:done?13:12,losses:4,draws:0,streak:done?4:3},duels:[done?finished(outcome):duel('invited'),{...duel('invited'),id:'30000000-0000-4000-8000-000000000002',creator:opponent,opponent:actor}]};}
export async function fixturePage(page,{signed=true,premium=true,outcome='win',failAnswerOnce=false,metadata={},visual=null}={}){
 let pos=0,done=false,lost=false;const requests=[];
 if(signed)await page.addInitScript(value=>localStorage.setItem('cachaste-auth-v1',JSON.stringify(value)),session());
 await page.route('https://jmobinmdwrmdqrxtcruj.supabase.co/**',async route=>{
  const url=route.request().url();let data;
  if(url.includes('/auth/v1/user'))data={...user,user_metadata:metadata};
  else if(url.includes('/auth/v1/token'))data=session();
  else if(url.includes('/rpc/cachaste_competition_health'))data={apiVersion:1,catalogueReady:true};
  else if(url.includes('/rpc/cachaste_competition')){
   const body=route.request().postDataJSON();requests.push(body);const{operation:op,payload:p}=body;
   if(op==='profile')data={profile,premium,season:'2026-10-19'};
   else if(op==='save_profile')data={profile,premium,season:'2026-10-19'};
   else if(op==='rankings')data=ranking;
   else if(op==='dashboard')data=dashboard(done,outcome);
   else if(['create_duel','join_code','accept','random'].includes(op))data=duel();
   else if(op==='duel')data=done?finished(outcome):duel();
   else if(op==='start'||op==='attempt'){data=attempt(pos,done?'complete':'active');if(data.question&&visual)data.question.visual=visual;}
   else if(op==='answer'){pos=Math.max(pos,p.position+1);done=pos===10;data=attempt(pos,done?'complete':'active');if(failAnswerOnce&&!lost){lost=true;await route.abort('failed');return;}}
   else if(op==='review')data={errors:[{question:{concept:'Números y cantidades',question:'¿Cuánto es 2 + 3?',options:['4','5','6','7'],steps:['Partimos con dos.','Agregamos tres unidades.','Llegamos a cinco.'],easy:'Imagina dos lápices y luego agrega tres.',example:'Con cuatro lápices y uno más también tienes cinco.',explanations:['Faltó sumar una unidad.']},choice:0,correct:false,answer:1}]};
   else if(op==='objectives')data={objectives:['Números y cantidades']};
   else data={};
  }else data={};
  await route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(data)});
 });
 return requests;
}
