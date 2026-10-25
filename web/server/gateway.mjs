import{PROJECT_URL,PUBLISHABLE_KEY}from'../shared/config.mjs';
import{privateAsset}from'./content.mjs';
import{publicOfflineKey,offlineLicense,safeJson}from'./offline.mjs';
const COOKIE='cachaste_web_session';
const PUBLIC_HTML_ALIASES=new Map([['/index.html','/'],...['cuenta','privacidad','condiciones','eliminar-cuenta','offline'].map(name=>['/'+name+'.html','/'+name])]);
const ACCESS_HEADERS={'cache-control':'private, no-store','vary':'Cookie','x-content-type-options':'nosniff','referrer-policy':'no-referrer','x-frame-options':'DENY','permissions-policy':'camera=(), microphone=(), geolocation=(), payment=()'};
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{...ACCESS_HEADERS,'content-type':'application/json; charset=utf-8',...headers}});
const jwtExpires=token=>{try{const s=token.split('.')[1];return JSON.parse(atob(s.replaceAll('-','+').replaceAll('_','/'))).exp*1000;}catch{return 0;}};
const bearer=req=>req.headers.get('authorization')?.match(/^Bearer ([A-Za-z0-9_.-]+)$/)?.[1];
const cookie=req=>req.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
export function createGateway({fetcher=fetch,now=()=>Date.now(),revision='local',pagePolicies={},protectedFiles=[],accountFiles=[],encryptedFiles={},allowDevelopmentHttp=false}={}){
 const allowed=new Set(protectedFiles),accountAllowed=new Set(accountFiles),grants=new Map();
 async function backend(env,path,token,{body,method='GET'}={}){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
  try{const res=await fetcher((env.SUPABASE_URL||PROJECT_URL)+path,{method,signal:controller.signal,headers:{apikey:env.SUPABASE_PUBLISHABLE_KEY||PUBLISHABLE_KEY,...(token?{authorization:'Bearer '+token}:{}),...(body!==undefined?{'content-type':'application/json'}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});const value=await res.json().catch(()=>({}));if(!res.ok){const e=Error(value.message||value.error||'BACKEND_UNAVAILABLE');e.status=res.status;throw e;}return value;}finally{clearTimeout(timer);}
 }
 async function identity(req,env,{active=true,fresh=false}={}){
  const token=bearer(req)||cookie(req);if(!token||token.length>10000||jwtExpires(token)<=now())throw Object.assign(Error('AUTH_REQUIRED'),{status:401});
  const key=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token)),hash=Array.from(new Uint8Array(key),x=>x.toString(16).padStart(2,'0')).join('');
  const cached=grants.get(hash);if(!fresh&&cached&&cached.until>now()&&(!active||cached.access.active))return{...cached,token};
  let user;try{user=await backend(env,'/auth/v1/user',token);}catch(error){if([400,401,403].includes(error.status))throw Object.assign(Error('AUTH_REQUIRED'),{status:401});throw error;}if(!user.id)throw Object.assign(Error('AUTH_REQUIRED'),{status:401});
  const access=await backend(env,'/rest/v1/rpc/cachaste_access',token,{method:'POST',body:{}});
  if(access.userId!==user.id||!Number.isFinite(access.serverTimeMs))throw Error('INVALID_ACCESS_RESPONSE');
  const value={user,access,until:Math.min(now()+30000,jwtExpires(token),access.active?access.validUntilMs:now()+30000)};
  if(grants.size>1000)grants.clear();grants.set(hash,value);
  if(active&&access.active!==true)throw Object.assign(Error('SUBSCRIPTION_REQUIRED'),{status:402});
  return{...value,token};
 }
 const sameOrigin=req=>{const origin=req.headers.get('origin');return origin===new URL(req.url).origin&&req.headers.get('x-cachaste-request')==='1';};
 async function handler(req,env,ctx={}){
  const url=new URL(req.url);let path;try{path=decodeURIComponent(url.pathname);}catch{return json({error:'BAD_PATH'},400);}
  if(!allowDevelopmentHttp&&url.protocol!=='https:'&&!['127.0.0.1','localhost','[::1]'].includes(url.hostname)){url.protocol='https:';return Response.redirect(url.href,308);}
  if(path.includes('..')||path.includes('\\')||path.includes('\0')||/%[a-f\d]{2}/i.test(path))return json({error:'BAD_PATH'},400);
  try{
   if(path==='/api/config')return json({supabaseUrl:env.SUPABASE_URL||PROJECT_URL,publishableKey:env.SUPABASE_PUBLISHABLE_KEY||PUBLISHABLE_KEY,signupEnabled:env.WEB_SIGNUP_ENABLED==='true',authReturnReady:env.WEB_AUTH_RETURN_READY==='true',googleAuthEnabled:env.WEB_GOOGLE_AUTH_ENABLED==='true',revision});
   if(path==='/api/auth/status'&&req.method==='GET'){
    if(env.WEB_GOOGLE_AUTH_ENABLED!=='true'||env.WEB_AUTH_RETURN_READY!=='true')return json({googleReady:false});
    const settings=await backend(env,'/auth/v1/settings');
    return json({googleReady:settings.external?.google===true});
   }
   if(path==='/api/session'&&req.method==='GET'){
    const auth=await identity(req,env,{active:false,fresh:true});let account;
    try{account=await backend(env,'/rest/v1/rpc/cachaste_web_account',auth.token,{method:'POST',body:{}});}catch(e){if(e.status===404)account={access:auth.access,subscriptions:[],trialUsed:false};else throw e;}
    return json({user:{id:auth.user.id,email:auth.user.email},...account,offlineAvailable:!!publicOfflineKey(env),isAdmin:(env.WEB_ADMIN_IDS||'').split(',').includes(auth.user.id)});
   }
   if(path==='/api/session'&&req.method==='POST'){
    if(!sameOrigin(req))return json({error:'ORIGIN_DENIED'},403);
    const auth=await identity(req,env,{active:false,fresh:true}),secure=url.protocol==='https:'?'; Secure':'';
    const lease=auth.access.active?await offlineLicense(env,auth.user.id,auth.access.validUntilMs,url.origin,revision,now()):null;
    return json({user:{id:auth.user.id,email:auth.user.email},access:auth.access,offlineLicense:lease},200,{'set-cookie':`${COOKIE}=${auth.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.max(0,Math.floor((jwtExpires(auth.token)-now())/1000))}${secure}`});
   }
   if(path==='/api/session'&&req.method==='DELETE'){
    if(!sameOrigin(req))return json({error:'ORIGIN_DENIED'},403);
    const token=bearer(req)||cookie(req);if(token){const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token))),x=>x.toString(16).padStart(2,'0')).join('');grants.delete(hash);}
    return json({signedOut:true},200,{'set-cookie':`${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${url.protocol==='https:'?'; Secure':''}`});
   }
   if(path==='/api/progress'&&req.method==='POST'){
    if(!sameOrigin(req))return json({error:'ORIGIN_DENIED'},403);
    const auth=await identity(req,env,{fresh:true});const text=await req.text();if(new TextEncoder().encode(text).length>1050000)return json({error:'PROGRESS_TOO_LARGE'},413);
    const body=JSON.parse(text);if(body.userId!==undefined&&body.userId!==auth.user.id)return json({error:'SESSION_CHANGED'},409);if(!['snapshot','put'].includes(body.operation))return json({error:'INVALID_OPERATION'},400);
    return json(await backend(env,'/rest/v1/rpc/cachaste_web_progress',auth.token,{method:'POST',body}));
   }
   if(path==='/api/billing'&&req.method==='POST'){
    if(!sameOrigin(req))return json({error:'ORIGIN_DENIED'},403);
    const text=await req.text();if(text.length>8192)return json({error:'PAYLOAD_TOO_LARGE'},413);const body=JSON.parse(text);
    if(body.action!=='status')await identity(req,env,{active:false,fresh:true});
    const res=await fetcher((env.SUPABASE_URL||PROJECT_URL)+'/functions/v1/cachaste-mercadopago',{method:'POST',headers:{apikey:env.SUPABASE_PUBLISHABLE_KEY||PUBLISHABLE_KEY,'content-type':'application/json',...(body.action!=='status'?{authorization:'Bearer '+(bearer(req)||cookie(req))}:{})},body:JSON.stringify(body)});
    const headers=new Headers(ACCESS_HEADERS);for(const name of['content-type','content-disposition'])if(res.headers.has(name))headers.set(name,res.headers.get(name));
    return new Response(res.body,{status:res.status,headers});
   }
   if(path.startsWith('/api/'))return json({error:'NOT_FOUND'},404);
   if(path==='/sw.js'){
    const asset=await env.ASSETS.fetch(new Request(new URL('/sw-template.js',url.origin),req));
    return new Response((await asset.text()).replace('__OFFLINE_PUBLIC_JWK__',safeJson(publicOfflineKey(env))).replaceAll('__BUILD_REVISION__',revision),{headers:{'content-type':'text/javascript','cache-control':'no-cache','service-worker-allowed':'/','x-content-type-options':'nosniff'}});
   }
   if(path.startsWith('/__encrypted/')||path==='/sw-template.js'||path==='/_worker.js'||path.endsWith('.map'))return new Response('Not found',{status:404});
   if(path==='/app'||path==='/app/')return Response.redirect(url.origin+'/app/inicio.html',302);
   if(path==='/app/suscripcion.html')return Response.redirect(url.origin+'/cuenta.html#planes',302);
   if(path.startsWith('/app/')){
    if(!allowed.has(path))return json({error:'NOT_FOUND'},404);
    let auth;try{auth=await identity(req,env,{active:!accountAllowed.has(path),fresh:path.endsWith('.html')});}catch(e){
     if(path.endsWith('.html')&&req.headers.get('accept')?.includes('text/html'))return Response.redirect(url.origin+'/cuenta.html?next='+encodeURIComponent(path),302);
     throw e;
    }
    const response=await privateAsset(req,env,encryptedFiles);if(!response.ok)return response;
    const headers=new Headers(response.headers);for(const[k,v]of Object.entries(ACCESS_HEADERS))headers.set(k,v);
    headers.set('x-cachaste-user',auth.user.id);headers.set('content-security-policy',policy(path,pagePolicies));
    if(path.endsWith('.html')){
     const snapshot=auth.access.active?await backend(env,'/rest/v1/rpc/cachaste_web_progress',auth.token,{method:'POST',body:{operation:'snapshot',payload:{}}}):{documents:[]};
     const lease=auth.access.active?await offlineLicense(env,auth.user.id,auth.access.validUntilMs,url.origin,revision,now()):null;
     const bootstrap={userId:auth.user.id,documents:snapshot.documents,offlineLicense:lease,revision,accessUntil:auth.access.validUntilMs};
     return new Response((await response.text()).replace('<!--CACHASTE_WEB_BOOTSTRAP-->','<script id="cachaste-web-bootstrap" type="application/json">'+safeJson(bootstrap)+'</script>'),{status:response.status,headers});
    }
    return new Response(response.body,{status:response.status,headers});
   }
   let response=await env.ASSETS.fetch(req);
   // Pages canonicalizes public *.html assets. Follow only the known internal alias so Auth
   // return URLs and PWA caches retain their original address without a browser redirect.
   if(PUBLIC_HTML_ALIASES.has(path)&&[301,308].includes(response.status)&&response.headers.has('location')){
    const target=new URL(response.headers.get('location'),url);
    if(target.origin===url.origin&&target.pathname===PUBLIC_HTML_ALIASES.get(path)){
     target.search=url.search;response=await env.ASSETS.fetch(new Request(target,req));
    }
   }
   const headers=new Headers(response.headers);headers.set('content-security-policy',policy(path,pagePolicies));headers.set('x-content-type-options','nosniff');headers.set('referrer-policy','strict-origin-when-cross-origin');headers.set('x-frame-options','DENY');headers.set('permissions-policy','camera=(), microphone=(), geolocation=()');
   return new Response(response.body,{status:response.status,headers});
  }catch(e){const raw=String(e?.message||''),status=e.status||(/AUTH_REQUIRED/.test(raw)?401:/SUBSCRIPTION_REQUIRED/.test(raw)?402:/INVALID|JSON|Unexpected/.test(raw)?400:503);return json({error:/^[A-Z_]+$/.test(raw)?raw:'SERVICE_UNAVAILABLE'},status);}
 }
 return{fetch:handler};
}
export function policy(path,pagePolicies){return `default-src 'self'; script-src 'self' ${(pagePolicies[path]||[]).join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ${PROJECT_URL}; worker-src 'self'; manifest-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'none'; form-action 'self'`;}
