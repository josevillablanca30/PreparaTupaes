// Disposable loopback-only HTTP QA. Never imported by a deployment or production build.
import{createServer}from'node:http';import{readFile,stat}from'node:fs/promises';import path from'node:path';import{fileURLToPath}from'node:url';
import{createGateway}from'../server/gateway.mjs';import{actor,opponent,profile,ranking,duel,finished,attempt,dashboard,user as actorUser}from'../../tests/helpers/competition-fixtures.mjs';
const root=fileURLToPath(new URL('../dist',import.meta.url)),androidRoot=fileURLToPath(new URL('../../dist',import.meta.url));
const users=[actor.id,opponent.id,'10000000-0000-4000-8000-000000000003'];
const tokenFor=id=>'eyJhbGciOiJIUzI1NiJ9.'+Buffer.from(JSON.stringify({sub:id,exp:Math.floor(Date.now()/1000)+3600,role:'authenticated',session_id:'20000000-0000-4000-8000-000000000001'})).toString('base64url')+'.qa-signature';
const tokens=new Map(users.map(id=>[id,tokenFor(id)]));
let active=true,revoked=false,documents=new Map(),position=0,done=false,calls=[];
const keyPair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']),offlineKey=await crypto.subtle.exportKey('jwk',keyPair.privateKey);
const accountUser=id=>({...actorUser,id,email:id===users[0]?'student-a@example.invalid':'student-b@example.invalid'});
const auth=header=>[...tokens].find(([,token])=>header==='Bearer '+token)?.[0];
async function backend(url,options={}){
 const parsed=new URL(url),op=parsed.pathname.split('/').at(-1),headers=new Headers(options.headers),id=auth(headers.get('authorization'));
 if(parsed.pathname.includes('/functions/v1/'))return Response.json({ready:false,trialAvailable:false});
 if(parsed.pathname.endsWith('/auth/v1/token')){const body=JSON.parse(options.body||'{}'),u=body.email==='student-b@example.invalid'?users[1]:users[0];return Response.json({access_token:tokens.get(u),refresh_token:'qa-refresh-'+u,token_type:'bearer',expires_in:3600,user:accountUser(u)});}
 if(!id||revoked)return Response.json({message:'AUTH_REQUIRED'},{status:401});
 if(parsed.pathname.endsWith('/auth/v1/user'))return Response.json(accountUser(id));
 const access={userId:id,active,serverTimeMs:Date.now(),validUntilMs:active?Date.now()+3600000:null};
 if(op==='cachaste_access')return Response.json(access);
 if(op==='cachaste_web_account')return Response.json({access,subscriptions:[],trialUsed:false});
 if(op==='cachaste_competition_health')return Response.json({apiVersion:1,catalogueReady:true});
 const body=JSON.parse(options.body||'{}');calls.push({userId:id,...body});
 if(op==='cachaste_web_progress'){
  if(!active)return Response.json({message:'SUBSCRIPTION_REQUIRED'},{status:403});const store=documents.get(id)||new Map();documents.set(id,store);
  if(body.operation==='snapshot')return Response.json({documents:[...store.values()]});
  const p=body.payload,current=store.get(p.key);if((current?.version||0)!==p.baseVersion)return Response.json({conflict:true,document:current||null});
  const doc={key:p.key,value:p.value,version:(current?.version||0)+1,updated_at:new Date().toISOString()};store.set(p.key,doc);return Response.json({conflict:false,document:doc});
 }
 if(op==='cachaste_competition'){
  const p=body.payload||{},operation=body.operation;let data={};
  if(operation==='profile'||operation==='save_profile')data={profile:{...profile,user_id:id,nickname:id===actor.id?actor.nickname:opponent.nickname},premium:active,season:'2026-10-19'};
  else if(!active)return Response.json({message:'SUBSCRIPTION_REQUIRED'},{status:403});
  else if(operation==='rankings')data=ranking;
  else if(operation==='dashboard')data=dashboard(done);
  else if(['create_duel','join_code','accept','random'].includes(operation))data=duel();
  else if(operation==='duel')data=done?finished():duel();
  else if(['start','attempt'].includes(operation))data=attempt(position,done?'complete':'active');
  else if(operation==='answer'){position=Math.max(position,p.position+1);done=position===10;data=attempt(position,done?'complete':'active');}
  else if(operation==='review')data={errors:[{question:{concept:'Números y cantidades',question:'¿Cuánto es 2 + 3?',options:['4','5','6','7'],steps:['Partimos con dos.','Agregamos tres.'],easy:'Junta dos lápices y agrega tres.',example:'Cuatro y uno también hacen cinco.',explanations:['Revisa la suma.']},choice:0,answer:1}]};
  else if(operation==='blocked_users')data={users:[]};
  return Response.json(data);
 }
 return Response.json({error:'NOT_FOUND'},{status:404});
}
const manifest=JSON.parse(await readFile(new URL('../artifacts/build-manifest.json',import.meta.url),'utf8'));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.txt':'text/plain'};
async function asset(url,base=root){let p=decodeURIComponent(new URL(url).pathname);if(base===androidRoot)p=p.replace('/__android_reference','');if(p==='/')p='/index.html';const full=path.resolve(base,'.'+p);if(!full.startsWith(base+path.sep))return new Response('Forbidden',{status:403});try{if(!(await stat(full)).isFile())throw Error();return new Response(await readFile(full),{headers:{'content-type':mime[path.extname(full)]||'application/octet-stream'}});}catch{return new Response('Not found',{status:404});}}
const gateway=createGateway({...manifest,fetcher:backend});
let local={};try{local=JSON.parse(await readFile(new URL('../.local-bindings.json',import.meta.url),'utf8'));}catch{}
const env={...local,BANK_CONTENT_KEY:process.env.BANK_CONTENT_KEY||local.BANK_CONTENT_KEY,ASSETS:{fetch:req=>asset(req.url)},OFFLINE_SIGNING_JWK:JSON.stringify(offlineKey),WEB_SIGNUP_ENABLED:'false',WEB_AUTH_RETURN_READY:'false'};
createServer(async(req,res)=>{try{
 const chunks=[];for await(const chunk of req)chunks.push(chunk);const body=Buffer.concat(chunks),url=new URL(req.url,'http://'+req.headers.host);let response;
 if(url.pathname==='/__qa/session')response=Response.json({users:users.map(id=>({user:accountUser(id),access_token:tokens.get(id),refresh_token:'qa-refresh-'+id,token_type:'bearer',expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600}))});
 else if(url.pathname==='/__qa/control'&&req.method==='POST'){const control=JSON.parse(body.toString()||'{}');if(control.reset){active=true;revoked=false;documents=new Map();position=0;done=false;calls=[];}if('active'in control)active=control.active;if('revoked'in control)revoked=control.revoked;response=Response.json({ok:true});}
 else if(url.pathname==='/__qa/state')response=Response.json({calls,documents:[...documents].map(([id,map])=>({userId:id,documents:[...map.values()]}))});
 else if(url.pathname.startsWith('/__qa/supabase/'))response=await backend('https://jmobinmdwrmdqrxtcruj.supabase.co/'+url.pathname.slice('/__qa/supabase/'.length)+url.search,{method:req.method,headers:req.headers,body:body.toString()});
 else if(url.pathname.startsWith('/__android_reference/'))response=await asset(url,androidRoot);
 else response=await gateway.fetch(new Request(url,{method:req.method,headers:req.headers,...(body.length?{body}:{}),duplex:'half'}),env,{});
 res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(e){res.writeHead(500,{'content-type':'text/plain'}).end(String(e.message));}}).listen(4175,'127.0.0.1',()=>console.log('Isolated web QA server listening on loopback 4175'));
