import{PROJECT_URL,PUBLISHABLE_KEY}from'../shared/config.mjs';
import{privateAsset}from'./content.mjs';
import{classifyDailyAdmission}from'../shared/basic-completion-contract.mjs';
import{prepareBasicIssuance}from'./basic-issuance.mjs';
import{publicOfflineKey,offlineLicense,safeJson}from'./offline.mjs';
const COOKIE='cachaste_web_session';
const PUBLIC_HTML_ALIASES=new Map([['/index.html','/'],...['cuenta','recuperar','privacidad','condiciones','eliminar-cuenta','offline'].map(name=>['/'+name+'.html','/'+name])]);
const SEARCH_ORIGIN='https://sitecacho.cl';
const SEARCH_PAGES=['/','/privacidad.html','/condiciones.html','/eliminar-cuenta.html'];
const COMPETITION_PAGE='/app/competencia.html';
const SEARCH_ALIASES=new Map([['/index.html','/'],...SEARCH_PAGES.slice(1).map(path=>[path.slice(0,-5),path])]);
const ACCESS_HEADERS={'cache-control':'private, no-store','vary':'Cookie','x-content-type-options':'nosniff','referrer-policy':'no-referrer','x-frame-options':'DENY','permissions-policy':'camera=(), microphone=(), geolocation=(), payment=()'};
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{...ACCESS_HEADERS,'content-type':'application/json; charset=utf-8',...headers}});
const jwtExpires=token=>{try{const s=token.split('.')[1];return JSON.parse(atob(s.replaceAll('-','+').replaceAll('_','/'))).exp*1000;}catch{return 0;}};
const bearer=req=>req.headers.get('authorization')?.match(/^Bearer ([A-Za-z0-9_.-]+)$/)?.[1];
const cookie=req=>req.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
export function createGateway({fetcher=fetch,now=()=>Date.now(),revision='local',pagePolicies={},protectedFiles=[],accountFiles=[],encryptedFiles={},contentKeyBinding,commercial=false,allowDevelopmentHttp=false}={}){
 const allowed=new Set(protectedFiles),accountAllowed=new Set(accountFiles),grants=new Map();
 async function backend(env,path,token,{body,method='GET'}={}){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
  try{const res=await fetcher((env.SUPABASE_URL||PROJECT_URL)+path,{method,signal:controller.signal,headers:{apikey:(env.SUPABASE_SERVICE_ROLE_KEY&&token===env.SUPABASE_SERVICE_ROLE_KEY)?env.SUPABASE_SERVICE_ROLE_KEY:(env.SUPABASE_PUBLISHABLE_KEY||PUBLISHABLE_KEY),...(token?{authorization:'Bearer '+token}:{}),...(body!==undefined?{'content-type':'application/json'}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});const value=await res.json().catch(()=>({}));if(!res.ok){const e=Error(value.message||value.error||'BACKEND_UNAVAILABLE');e.status=res.status;throw e;}return value;}finally{clearTimeout(timer);}
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
 const accountRuntime=/^\/(?:account|web-init|web-shell|web-legacy|web-competition|learning-access|web-basic-entry)\.js$/;
 const versionScripts=html=>html.replace(/(<script\b[^>]*\bsrc=")(\/(?:account|web-init|web-shell|web-legacy|web-competition|learning-access|web-basic-entry)\.js)(")/g,(_,before,src,after)=>before+src+'?v='+encodeURIComponent(revision)+after);
 const originalReady=env=>env.WEB_BASIC_ACCESS_ENABLED==='true'&&env.WEB_BASIC_EDUCATIONAL_GUARDS_READY==='true'&&env.WEB_BASIC_ORIGINAL_ENGINE_READY==='true';
 const sameOrigin=req=>{const origin=req.headers.get('origin');return origin===new URL(req.url).origin&&req.headers.get('x-cachaste-request')==='1';};
 async function handler(req,env,ctx={}){
  const url=new URL(req.url);let path;try{path=decodeURIComponent(url.pathname);}catch{return json({error:'BAD_PATH'},400);}
  if(!allowDevelopmentHttp&&url.protocol!=='https:'&&!['127.0.0.1','localhost','[::1]'].includes(url.hostname)){url.protocol='https:';return Response.redirect(url.href,308);}
  if(url.hostname==='www.sitecacho.cl'){url.hostname='sitecacho.cl';return new Response(null,{status:308,headers:{location:url.href,'referrer-policy':'no-referrer'}});}
  if(path.includes('..')||path.includes('\\')||path.includes('\0')||/%[a-f\d]{2}/i.test(path))return json({error:'BAD_PATH'},400);
  const commercialHost=commercial&&url.origin===SEARCH_ORIGIN;
  const indexing=commercialHost&&env.WEB_INDEXING_ENABLED==='true';
  const payments=commercialHost&&env.WEB_PAYMENTS_ENABLED==='true';
  const searchPage=SEARCH_ALIASES.get(path)||path;
  try{
   if(path==='/robots.txt'){
    const body=indexing?'User-agent: *\nAllow: /\nSitemap: '+SEARCH_ORIGIN+'/sitemap.xml\n':'User-agent: *\nDisallow: /\n';
    return new Response(body,{headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-cache'}});
   }
   if(path==='/sitemap.xml'){
    if(!indexing)return new Response('Not found',{status:404});
    const entries=SEARCH_PAGES.map(page=>'<url><loc>'+SEARCH_ORIGIN+page+'</loc></url>').join('');
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+entries+'</urlset>',{headers:{'content-type':'application/xml; charset=utf-8','cache-control':'no-cache'}});
   }
   if(path==='/api/config')return json({supabaseUrl:env.SUPABASE_URL||PROJECT_URL,publishableKey:env.SUPABASE_PUBLISHABLE_KEY||PUBLISHABLE_KEY,signupEnabled:env.WEB_SIGNUP_ENABLED==='true',basicEnabled:originalReady(env),authReturnReady:commercialHost,googleAuthEnabled:commercialHost,revision});
   if(path==='/api/auth/status'&&req.method==='GET'){
    if(!commercialHost)return json({googleReady:false});
    // The provider status is verified against Supabase below; no separate Cloudflare launch flags are required.
    const settings=await backend(env,'/auth/v1/settings');
    return json({googleReady:settings.external?.google===true});
   }
   if(path==='/api/session'&&req.method==='GET'){
    const auth=await identity(req,env,{active:false,fresh:true});let account;
    try{account=await backend(env,'/rest/v1/rpc/cachaste_web_account',auth.token,{method:'POST',body:{}});}catch(e){if(e.status===404)account={access:auth.access,subscriptions:[],trialUsed:false};else throw e;}
    return json({user:{id:auth.user.id,email:auth.user.email},...account,offlineAvailable:!!publicOfflineKey(env),isAdmin:account.isAdmin===true});
   }
   if(path==='/api/session'&&req.method==='POST'){
    if(!sameOrigin(req))return json({error:'ORIGIN_DENIED'},403);
    const auth=await identity(req,env,{active:false,fresh:true}),secure=url.protocol==='https:'?'; Secure':'';
    const lease=auth.access.active?await offlineLicense(env,auth.user.id,auth.access.validUntilMs,url.origin,revision,now()):null;
    const access=originalReady(env)?await backend(env,'/rest/v1/rpc/cachaste_learning_access',auth.token,{method:'POST',body:{}}):auth.access;
    return json({user:{id:auth.user.id,email:auth.user.email},access,offlineLicense:lease},200,{'set-cookie':`${COOKIE}=${auth.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.max(0,Math.floor((jwtExpires(auth.token)-now())/1000))}${secure}`});
   }
   if(path==='/api/session'&&req.method==='DELETE'){
    if(!sameOrigin(req))return json({error:'ORIGIN_DENIED'},403);
    const token=bearer(req)||cookie(req);if(token){const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token))),x=>x.toString(16).padStart(2,'0')).join('');grants.delete(hash);}
    return json({signedOut:true},200,{'set-cookie':`${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${url.protocol==='https:'?'; Secure':''}`});
   }
   if(path==='/api/basic/reserve'&&req.method==='POST'){
    if(!sameOrigin(req))return json({error:'ORIGIN_DENIED'},403);
    // Must be explicitly enabled only after DB migration, server-issued learning
    // attempts and completion attestation are deployed together.
    if(env.WEB_BASIC_ACCESS_ENABLED!=='true'||env.WEB_BASIC_EDUCATIONAL_GUARDS_READY!=='true'||
       env.WEB_BASIC_ATTEMPT_RESERVATIONS_READY!=='true'||env.WEB_BASIC_COMPLETION_ATTESTATION_READY!=='true'||
       env.WEB_BASIC_SERVER_ISSUANCE_READY!=='true'||!env.SUPABASE_SERVICE_ROLE_KEY||!env.BASIC_QUESTION_BANK_JSON)
      return json({error:'BASIC_NOT_READY'},503);
    const auth=await identity(req,env,{active:false,fresh:true});
    const raw=await req.text();if(raw.length>1024)return json({error:'PAYLOAD_TOO_LARGE'},413);
    let body;try{body=JSON.parse(raw);}catch{return json({error:'INVALID_JSON'},400);}
    if(!body||typeof body!=='object'||Array.isArray(body))return json({error:'INVALID_ACTIVITY'},400);
    if(typeof body.requestKey!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.requestKey))return json({error:'INVALID_REQUEST_KEY'},400);
    const admission=classifyDailyAdmission({mode:body.mode,subject:body.subject});
    if(!admission.allowed)return json({allowed:false,reason:admission.reason},403);
    return json(await backend(env,'/rest/v1/rpc/cachaste_reserve_basic_learning_attempt',auth.token,{
     method:'POST',body:{p_kind:admission.kind,p_subject:admission.subject,p_request_key:body.requestKey}
    }));
   }
   if(path==='/api/basic/issue'&&req.method==='POST'){
    if(!sameOrigin(req))return json({error:'ORIGIN_DENIED'},403);
    if(env.WEB_BASIC_ACCESS_ENABLED!=='true'||env.WEB_BASIC_EDUCATIONAL_GUARDS_READY!=='true'||
       env.WEB_BASIC_ATTEMPT_RESERVATIONS_READY!=='true'||env.WEB_BASIC_COMPLETION_ATTESTATION_READY!=='true'||
       env.WEB_BASIC_SERVER_ISSUANCE_READY!=='true'||!env.SUPABASE_SERVICE_ROLE_KEY||
       !env.BASIC_QUESTION_BANK_JSON)return json({error:'BASIC_NOT_READY'},503);
    const auth=await identity(req,env,{active:false,fresh:true});
    const raw=await req.text();if(raw.length>1024)return json({error:'PAYLOAD_TOO_LARGE'},413);
    let body;try{body=JSON.parse(raw);}catch{return json({error:'INVALID_JSON'},400);}
    if(!body||typeof body!=='object'||Array.isArray(body)||
       typeof body.attemptId!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.attemptId)||
       !['m1','m2','lectora','ciencias','historia'].includes(body.subject)||
       !['lesson','diagnostic','expressExam'].includes(body.kind))return json({error:'INVALID_ISSUANCE'},400);
    // Read the reservation with the server credential and require ownership,
    // kind, subject and reserved status before constructing any question set.
    const service=env.SUPABASE_SERVICE_ROLE_KEY;
    const attempt=await backend(env,'/rest/v1/rpc/cachaste_basic_issuance_attempt',service,{
     method:'POST',body:{p_attempt_id:body.attemptId}
    });
    if(!attempt||attempt.user_id!==auth.user.id||attempt.kind!==body.kind||
       attempt.subject!==(body.kind==='expressExam'?'all':body.subject)||
       attempt.status!=='reserved')return json({error:'ATTEMPT_NOT_ELIGIBLE'},403);
    const validStoredQuestions=(payload)=>{
     const expected=body.kind==='diagnostic'?30:body.kind==='expressExam'?15:10;
     if(!payload||payload.attemptId!==body.attemptId||payload.kind!==body.kind||
        payload.subject!==(body.kind==='expressExam'?'all':body.subject)||
        !Array.isArray(payload.questions)||payload.questions.length!==expected)return false;
     const seen=new Set();
     for(const q of payload.questions){
      if(!q||typeof q!=='object'||Array.isArray(q)||
         Object.keys(q).some(k=>!['id','prompt','options'].includes(k))||
         typeof q.id!=='string'||!q.id||q.id.length>128||seen.has(q.id)||
         typeof q.prompt!=='string'||!q.prompt.trim()||q.prompt.length>10000||
         !Array.isArray(q.options)||q.options.length<2||q.options.length>8||
         q.options.some(o=>typeof o!=='string'||!o.trim()||o.length>2000))return false;
      seen.add(q.id);
     }
     return true;
    };
    const existing=await backend(env,'/rest/v1/rpc/cachaste_resume_basic_question_set',service,{
     method:'POST',body:{p_user_id:auth.user.id,p_attempt_id:body.attemptId}
    });
    if(existing!==null){
     if(!validStoredQuestions(existing))
      return json({error:'INVALID_STORED_QUESTIONS'},502);
     return json(existing);
    }
    let issuance;try{issuance=prepareBasicIssuance({
     attemptId:body.attemptId,subject:body.subject,kind:body.kind,bankJson:env.BASIC_QUESTION_BANK_JSON
    });}catch{return json({error:'BASIC_ISSUANCE_NOT_READY'},503);}
    const stored=await backend(env,'/rest/v1/rpc/cachaste_store_basic_question_set',service,{
     method:'POST',body:{p_user_id:auth.user.id,p_attempt_id:body.attemptId,
      p_answer_key:issuance.answerKey,p_public_questions:issuance.publicQuestions}
    });
    if(stored!==true){
     // A concurrent retry may have persisted the same attempt first. Return
     // only that stored set, never the newly randomized candidate questions.
     const replay=await backend(env,'/rest/v1/rpc/cachaste_resume_basic_question_set',service,{
      method:'POST',body:{p_user_id:auth.user.id,p_attempt_id:body.attemptId}
     });
     if(validStoredQuestions(replay))return json(replay);
     return json({error:'QUESTIONS_ALREADY_ISSUED_RETRY'},409);
    }
    return json({attemptId:body.attemptId,questions:issuance.publicQuestions});
   }
   if(path==='/api/basic/complete'&&req.method==='POST'){
    if(!sameOrigin(req))return json({error:'ORIGIN_DENIED'},403);
    if(env.WEB_BASIC_ACCESS_ENABLED!=='true'||env.WEB_BASIC_EDUCATIONAL_GUARDS_READY!=='true'||
       env.WEB_BASIC_ATTEMPT_RESERVATIONS_READY!=='true'||env.WEB_BASIC_COMPLETION_ATTESTATION_READY!=='true'||
       env.WEB_BASIC_SERVER_ISSUANCE_READY!=='true')return json({error:'BASIC_NOT_READY'},503);
    const auth=await identity(req,env,{active:false,fresh:true});
    if(!env.SUPABASE_SERVICE_ROLE_KEY)return json({error:'BASIC_NOT_READY'},503);
    const raw=await req.text();if(raw.length>16000)return json({error:'PAYLOAD_TOO_LARGE'},413);
    let body;try{body=JSON.parse(raw);}catch{return json({error:'INVALID_JSON'},400);}
    if(!body||typeof body!=='object'||Array.isArray(body)||
       typeof body.attemptId!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.attemptId)||
       !Array.isArray(body.answers)||body.answers.length<1||body.answers.length>80)
      return json({error:'INVALID_COMPLETION'},400);
    for(const answer of body.answers){
     if(!answer||typeof answer!=='object'||Array.isArray(answer)||
        Object.keys(answer).some(key=>!['questionId','selectedIndex'].includes(key))||
        typeof answer.questionId!=='string'||answer.questionId.length>128||
        !Number.isInteger(answer.selectedIndex)||answer.selectedIndex<0||answer.selectedIndex>7)
       return json({error:'INVALID_ANSWERS'},400);
    }
    // A repeated question ID must never count as two answered questions.
    if(new Set(body.answers.map(answer=>answer.questionId)).size!==body.answers.length)
      return json({error:'DUPLICATE_QUESTION_ANSWERS'},400);
    // Service key stays exclusively in the Worker environment; identity is
    // freshly verified and user ID is never accepted from the browser.
    return json(await backend(env,'/rest/v1/rpc/cachaste_complete_basic_learning_attempt',
      env.SUPABASE_SERVICE_ROLE_KEY,{method:'POST',body:{
       p_user_id:auth.user.id,p_attempt_id:body.attemptId,p_answers:body.answers
      }}));
   }
   if(path==='/api/basic/admission'&&req.method==='POST'){
    if(!sameOrigin(req))return json({error:'ORIGIN_DENIED'},403);
    if(env.WEB_BASIC_ACCESS_ENABLED!=='true'||env.WEB_BASIC_EDUCATIONAL_GUARDS_READY!=='true')return json({error:'BASIC_NOT_READY'},503);
    const auth=await identity(req,env,{active:false,fresh:true});
    const raw=await req.text();if(raw.length>1024)return json({error:'PAYLOAD_TOO_LARGE'},413);
    let body;try{body=JSON.parse(raw);}catch{return json({error:'INVALID_JSON'},400);}
    if(!body||typeof body!=='object'||Array.isArray(body))return json({error:'INVALID_ACTIVITY'},400);
    const admission=classifyDailyAdmission({mode:body.mode,subject:body.subject});
    if(!admission.allowed)return json({allowed:false,reason:admission.reason},403);
    const quota=await backend(env,'/rest/v1/rpc/cachaste_basic_quota',auth.token,{method:'POST',body:{operation:'check',kind:admission.kind,subject:admission.subject,event_id:null}});
    // Preflight only. An authoritative attempt reservation must still occur at start.
    if(typeof quota?.allowed!=='boolean')return json({error:'INVALID_QUOTA_RESPONSE'},502);
    return json({allowed:quota.allowed,kind:admission.kind,subject:admission.subject,tier:quota.tier,remaining:quota.remaining??null,preflightOnly:true});
   }
   if(path==='/api/basic/verified-progress'&&req.method==='GET'){
    // Server-attested history only. Never accept user IDs or client-written progress.
    if(env.WEB_BASIC_ACCESS_ENABLED!=='true'||env.WEB_BASIC_EDUCATIONAL_GUARDS_READY!=='true'||
       env.WEB_BASIC_COMPLETION_ATTESTATION_READY!=='true')return json({error:'BASIC_NOT_READY'},503);
    const auth=await identity(req,env,{active:false,fresh:true});
    const progress=await backend(env,'/rest/v1/rpc/cachaste_basic_verified_progress_snapshot',auth.token,{method:'POST',body:{}});
    if(!progress||!Array.isArray(progress.verifiedCompletions))return json({error:'INVALID_PROGRESS_RESPONSE'},502);
    return json(progress);
   }
   if(path==='/api/basic/summary'&&req.method==='GET'){
    if(env.WEB_BASIC_ACCESS_ENABLED!=='true'||env.WEB_BASIC_EDUCATIONAL_GUARDS_READY!=='true')return json({error:'BASIC_NOT_READY'},503);
    const auth=await identity(req,env,{active:false,fresh:true});
    return json(await backend(env,'/rest/v1/rpc/cachaste_basic_quota_summary',auth.token,{method:'POST',body:{}}));
   }
   if(path==='/api/basic/quota'&&req.method==='POST'){
    if(!sameOrigin(req))return json({error:'ORIGIN_DENIED'},403);
    // Closed until the educational engines enforce quotas and the basic content route is isolated.
    if(env.WEB_BASIC_ACCESS_ENABLED!=='true'||env.WEB_BASIC_EDUCATIONAL_GUARDS_READY!=='true')return json({error:'BASIC_NOT_READY'},503);
    const auth=await identity(req,env,{active:false,fresh:true});
    const raw=await req.text();if(raw.length>1024)return json({error:'PAYLOAD_TOO_LARGE'},413);
    let body;try{body=JSON.parse(raw);}catch{return json({error:'INVALID_JSON'},400);}
    if(!body||typeof body!=='object'||Array.isArray(body))return json({error:'INVALID_OPERATION'},400);
    if(body.operation==='consume')return json({error:'SERVER_VERIFIED_COMPLETION_REQUIRED'},403);
    if(body.operation!=='check'||!['lesson','diagnostic','expressExam','duel'].includes(body.kind))
      return json({error:'INVALID_OPERATION'},400);
    // Browser quota requests are read-only. Only a verified server-side
    // activity transaction may call the service-role completion ledger.
    const subject=body.subject||'all';
    if(!((['lesson','diagnostic'].includes(body.kind)&&['m1','m2','lectora','ciencias','historia'].includes(subject))||
       (['expressExam','duel'].includes(body.kind)&&subject==='all')))
      return json({error:'INVALID_SUBJECT'},400);
    return json(await backend(env,'/rest/v1/rpc/cachaste_basic_quota',auth.token,{method:'POST',body:{operation:body.operation,kind:body.kind,subject,event_id:null}}));
   }
   if(path==='/api/progress'&&req.method==='POST'){
    if(!sameOrigin(req))return json({error:'ORIGIN_DENIED'},403);
    const auth=await identity(req,env,{active:false,fresh:true});const text=await req.text();if(new TextEncoder().encode(text).length>1050000)return json({error:'PROGRESS_TOO_LARGE'},413);
    let body;try{body=JSON.parse(text);}catch{return json({error:'INVALID_JSON'},400);}
    if(!body||typeof body!=='object'||Array.isArray(body))return json({error:'INVALID_OPERATION'},400);
    if(body.userId!==undefined&&body.userId!==auth.user.id)return json({error:'SESSION_CHANGED'},409);if(!['snapshot','put'].includes(body.operation))return json({error:'INVALID_OPERATION'},400);
    if(auth.access.active!==true){
     // Non-premium accounts can only read existing progress, never write it.
     // Both gateway and database opt-in flags are required before Basic release.
     if(body.operation!=='snapshot'||env.WEB_BASIC_ACCESS_ENABLED!=='true'||env.WEB_BASIC_EDUCATIONAL_GUARDS_READY!=='true'||env.WEB_BASIC_PROGRESS_SNAPSHOT_READY!=='true')
      return json({error:'SUBSCRIPTION_REQUIRED'},402);
    }
    return json(await backend(env,'/rest/v1/rpc/cachaste_web_progress',auth.token,{method:'POST',body}));
   }
   if(path==='/api/billing/sandbox'&&req.method==='POST'){
    if(!sameOrigin(req))return json({error:'ORIGIN_DENIED'},403);
    const auth=await identity(req,env,{active:false,fresh:true});
    const account=await backend(env,'/rest/v1/rpc/cachaste_web_account',auth.token,{method:'POST',body:{}});
    if(account.isAdmin!==true)return json({error:'QA_ADMIN_REQUIRED'},403);
    const text=await req.text();if(text.length>8192)return json({error:'PAYLOAD_TOO_LARGE'},413);
    const body=JSON.parse(text);
    const data=await backend(env,'/functions/v1/cachaste-mp-sandbox-checkout',auth.token,{method:'POST',body});
    return json(data);
   }
   if(path==='/api/billing'&&req.method==='POST'){
    if(!sameOrigin(req))return json({error:'ORIGIN_DENIED'},403);
    const text=await req.text();if(text.length>8192)return json({error:'PAYLOAD_TOO_LARGE'},413);const body=JSON.parse(text);
    // Checkout stays explicitly disabled until the owner approves live web payments.
    // Status/refresh may still reconcile existing access without initiating a charge.
    if(body.action!=='status')await identity(req,env,{active:false,fresh:true});
    if(!['status','refresh','cancel','sales','commercial_readiness'].includes(body.action)&&!payments)return json({error:'BILLING_NOT_READY'},503);
    const res=await fetcher((env.SUPABASE_URL||PROJECT_URL)+'/functions/v1/cachaste-mercadopago',{method:'POST',headers:{apikey:env.SUPABASE_PUBLISHABLE_KEY||PUBLISHABLE_KEY,'content-type':'application/json',...(body.action!=='status'?{authorization:'Bearer '+(bearer(req)||cookie(req))}:{})},body:JSON.stringify(body)});
    const headers=new Headers(ACCESS_HEADERS);for(const name of['content-type','content-disposition'])if(res.headers.has(name))headers.set(name,res.headers.get(name));
    if(body.action==='status'&&!payments&&res.ok){
     const provider=await res.json();
     return json({...provider,ready:false,trialAvailable:false,managementReady:provider.managementReady===true});
    }
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
    const accountOnly=path===COMPETITION_PAGE&&url.searchParams.get('manage')==='profile';
    const accountAsset=accountAllowed.has(path)&&(path!==COMPETITION_PAGE||accountOnly);
    let auth;try{auth=await identity(req,env,{active:!accountAsset&&!originalReady(env),fresh:path.endsWith('.html')});
     if(!auth.access.active&&!accountAsset){
      if(!originalReady(env)||path.endsWith('.html')&&!['/app/inicio.html','/app/competencia.html'].includes(path))throw Object.assign(Error('SUBSCRIPTION_REQUIRED'),{status:402});
      const entitlement=await backend(env,'/rest/v1/rpc/cachaste_learning_access',auth.token,{method:'POST',body:{}});
      if(entitlement.tier!=='basica')throw Object.assign(Error('BASIC_NOT_READY'),{status:503});
     }}catch(e){
     if(path.endsWith('.html')&&req.headers.get('accept')?.includes('text/html')){
      const next=encodeURIComponent(path),plans=e.message==='SUBSCRIPTION_REQUIRED'?'#planes':'';
      const accountPath=accountOnly?'/cuenta.html?manage=profile':'/cuenta.html?next='+next+plans;
      return new Response(null,{status:302,headers:{...ACCESS_HEADERS,location:url.origin+accountPath}});
     }
     throw e;
    }
    const response=await privateAsset(req,env,encryptedFiles,contentKeyBinding);if(!response.ok)return response;
    const headers=new Headers(response.headers);for(const[k,v]of Object.entries(ACCESS_HEADERS))headers.set(k,v);
    headers.set('x-robots-tag','noindex, nofollow, noarchive');
    headers.set('x-cachaste-user',auth.user.id);headers.set('content-security-policy',policy(path,pagePolicies));
    if(path.endsWith('.html')){
     const learning=auth.access.active&&!accountOnly;
     const basic=!auth.access.active&&originalReady(env)&&!accountOnly;
     const snapshot=basic?await backend(env,'/rest/v1/rpc/cachaste_original_learning',auth.token,{method:'POST',body:{operation:'state',payload:{}}}):learning?await backend(env,'/rest/v1/rpc/cachaste_web_progress',auth.token,{method:'POST',body:{operation:'snapshot',payload:{}}}):{documents:[]};
     const lease=learning?await offlineLicense(env,auth.user.id,auth.access.validUntilMs,url.origin,revision,now()):null;
     const bootstrap={userId:auth.user.id,originalEngineEnabled:originalReady(env),tier:basic?'basica':'premium',documents:snapshot.documents,offlineLicense:lease,revision,accessUntil:auth.access.validUntilMs,accountOnly};
     return new Response(versionScripts(await response.text()).replace('<!--CACHASTE_WEB_BOOTSTRAP-->','<script id="cachaste-web-bootstrap" type="application/json">'+safeJson(bootstrap)+'</script>'),{status:response.status,headers});
    }
    return new Response(response.body,{status:response.status,headers});
   }
   const publicRequest=path==='/recuperar/'?new Request(new URL('/recuperar.html',url.origin),req):req;
   let response=await env.ASSETS.fetch(publicRequest);
   // Pages canonicalizes public *.html assets. Follow only the known internal alias so Auth
   // return URLs and PWA caches retain their original address without a browser redirect.
   if(PUBLIC_HTML_ALIASES.has(path)&&[301,308].includes(response.status)&&response.headers.has('location')){
    const target=new URL(response.headers.get('location'),url);
    if(target.origin===url.origin&&target.pathname===PUBLIC_HTML_ALIASES.get(path)){
     target.search=url.search;response=await env.ASSETS.fetch(new Request(target,req));
    }
   }
   // A fragment callback is invisible to the server. The root must have the
   // same privacy headers as /recuperar for old Android/default-template links.
   const authPage=['/','/index.html','/cuenta.html','/cuenta','/recuperar.html','/recuperar','/recuperar/'].includes(path);
   const headers=new Headers(response.headers);headers.set('content-security-policy',policy(path,pagePolicies));headers.set('x-content-type-options','nosniff');headers.set('referrer-policy',authPage?'no-referrer':'strict-origin-when-cross-origin');if(authPage||accountRuntime.test(path))headers.set('cache-control','private, no-store');headers.set('x-frame-options','DENY');headers.set('permissions-policy','camera=(), microphone=(), geolocation=()');
   // An old account bundle may remain fresh in the browser for four hours.
   // Give each deployment a distinct URL, including behind an older service worker.
   if(response.ok&&['/cuenta','/cuenta.html'].includes(path)&&/text\/html/i.test(headers.get('content-type')||'')){
    const html=versionScripts(await response.text());
    for(const name of ['content-length','content-encoding','etag'])headers.delete(name);
    headers.set('x-robots-tag','noindex, nofollow, noarchive');
    return new Response(html,{status:response.status,headers});
   }
   if(response.ok&&/text\/html/i.test(headers.get('content-type')||'')){
    const mayIndex=indexing&&SEARCH_PAGES.includes(searchPage);
    if(!mayIndex)headers.set('x-robots-tag','noindex, nofollow, noarchive');
    if(SEARCH_PAGES.includes(searchPage)&&req.method==='GET'){
     const html=(await response.text())
      .replace(/<meta name="robots"[^>]*>/,mayIndex?'':'<meta name="robots" content="noindex,nofollow">')
      .replace(/<link rel="canonical"[^>]*>/,'')
      .replace('</head>','<link rel="canonical" href="'+SEARCH_ORIGIN+searchPage+'"></head>');
     headers.delete('content-length');headers.delete('content-encoding');headers.delete('etag');
     return new Response(html,{status:response.status,headers});
    }
   }
   return new Response(response.body,{status:response.status,headers});
  }catch(e){const raw=String(e?.message||''),status=e.status||(/AUTH_REQUIRED/.test(raw)?401:/SUBSCRIPTION_REQUIRED/.test(raw)?402:/INVALID|JSON|Unexpected/.test(raw)?400:503);return json({error:/^[A-Z_]+$/.test(raw)?raw:'SERVICE_UNAVAILABLE'},status);}
 }
 return{fetch:handler};
}
export function policy(path,pagePolicies){const realtime=path==='/app/competencia.html'?' wss://jmobinmdwrmdqrxtcruj.supabase.co':'';return `default-src 'self'; script-src 'self' ${(pagePolicies[path]||[]).join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: ${PROJECT_URL}/storage/v1/object/public/cachaste-profile-photos/; connect-src 'self' ${PROJECT_URL}${realtime}; worker-src 'self'; manifest-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'none'; form-action 'self'`;}
