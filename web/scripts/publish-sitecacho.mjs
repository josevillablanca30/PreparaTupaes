import {readFile,writeFile,mkdir,appendFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';
import path from 'node:path';
import {PROJECT_URL,PUBLISHABLE_KEY} from '../shared/config.mjs';
import {credentials,pagesClient,verifyTarget,reviewedPublicRuntime,publicSiteUrl,PAGES_PROJECT,PUBLIC_SOURCE_BRANCH,FINAL_RELEASE_BRANCH,RELEASE_CONTENT_KEY,RESERVED_PRODUCTION_BRANCH,PUBLIC_RELEASE_MARKER,REPOSITORY} from './pages-client.mjs';
import {runtimeSecrets} from './prepare-pages-project.mjs';
import {requireQa} from './verify-preview-qa.mjs';
import {probeDeployment} from './verify-pages-preview.mjs';

const hosts=['sitecacho.cl','www.sitecacho.cl'];
const allowedVariables=['SUPABASE_URL','SUPABASE_PUBLISHABLE_KEY','WEB_SIGNUP_ENABLED','WEB_AUTH_RETURN_READY','WEB_GOOGLE_AUTH_ENABLED','WEB_PAYMENTS_ENABLED','WEB_PUBLIC_RELEASE','BANK_CONTENT_KEY','OFFLINE_SIGNING_JWK'];
export function validatePublicRequest(request,env){
  if(env.GITHUB_REPOSITORY!==REPOSITORY||![PUBLIC_SOURCE_BRANCH,FINAL_RELEASE_BRANCH].includes(env.GITHUB_REF_NAME)||!/^[a-f\d]{40}$/.test(env.GITHUB_SHA||'')||
    request.project!==PAGES_PROJECT||request.sourceBranch!==env.GITHUB_REF_NAME||request.productionBranch!==RESERVED_PRODUCTION_BRANCH||
    request.scope!=='public-web-payments-closed'||request.realPayments!==false||request.requiresSuccessfulQa!==true||request.preserveResend!==true||
    (request.emailSignup!==undefined&&typeof request.emailSignup!=='boolean')||
    JSON.stringify(request.hosts)!==JSON.stringify(hosts))throw Error('PUBLIC_CLOSED_PAYMENTS_REQUEST_REQUIRED');
  return true;
}
export function validateFinalRelease(request,env){
  validatePublicRequest(request,env);
  if(env.GITHUB_REF_NAME!==FINAL_RELEASE_BRANCH||request.enabled!==true||
     request.indexing!==false||request.emailSignup!==true||
     !/^[a-f\d]{40}$/.test(env.REVIEWED_RELEASE_SHA||'')||
     request.reviewedRevision!==env.REVIEWED_RELEASE_SHA)throw Error('FINAL_RELEASE_REQUEST_REQUIRED');
  return true;
}
const plain=value=>({type:'plain_text',value});
const bindingShape=config=>JSON.stringify({fail_open:config?.fail_open,env_vars:Object.fromEntries(Object.entries(config?.env_vars||{}).sort().map(([k,v])=>[k,{type:v.type,...(v.type==='plain_text'?{value:v.value}:{})}]))});
export async function requirePaymentsClosed({fetcher=fetch}={}){
  const r=await fetcher(PROJECT_URL+'/functions/v1/cachaste-mercadopago',{method:'POST',headers:{apikey:PUBLISHABLE_KEY,'content-type':'application/json'},body:JSON.stringify({action:'status'}),redirect:'error',signal:AbortSignal.timeout(15000)});
  const status=await r.json();
  if(!r.ok||status.ready!==false||status.trialAvailable!==false)throw Error('PUBLIC_RELEASE_REQUIRES_PAYMENTS_CLOSED');
}
export async function requireHostedEmailSignup({fetcher=fetch}={}){
  const r=await fetcher(PROJECT_URL+'/auth/v1/settings',{headers:{apikey:PUBLISHABLE_KEY},redirect:'error',signal:AbortSignal.timeout(15000)});
  const settings=await r.json();
  if(!r.ok||settings.external?.email!==true||settings.disable_signup!==false||settings.mailer_autoconfirm!==false)throw Error('HOSTED_EMAIL_CONFIRMATION_REQUIRED');
}
export async function preparePublicProject(env,{client=pagesClient(env),fetcher=fetch,generate=runtimeSecrets,emailSignup=false}={}){
  credentials(env);
  const before=await client.getProject();verifyTarget(before,env.GITHUB_REF_NAME);
  if(Object.keys(before.deployment_configs?.production?.env_vars||{}).some(k=>!allowedVariables.includes(k)&&!RELEASE_CONTENT_KEY.test(k)))throw Error('UNREVIEWED_PRODUCTION_BINDING');
  await requirePaymentsClosed({fetcher});
  if(emailSignup)await requireHostedEmailSignup({fetcher});
  const secrets=generate();
  const config={fail_open:false,compatibility_date:'2026-10-24',env_vars:{
    SUPABASE_URL:plain(PROJECT_URL),SUPABASE_PUBLISHABLE_KEY:plain(PUBLISHABLE_KEY),
    ...Object.fromEntries(['WEB_AUTH_RETURN_READY','WEB_GOOGLE_AUTH_ENABLED','WEB_PAYMENTS_ENABLED'].map(k=>[k,plain('false')])),
    WEB_SIGNUP_ENABLED:plain(String(emailSignup)),
    WEB_PUBLIC_RELEASE:plain(PUBLIC_RELEASE_MARKER),
    ...Object.fromEntries(Object.entries(secrets).map(([k,value])=>[k,{type:'secret_text',value}])),
  }};
  // Patch only the existing named project's public runtime. No DNS, zones, account settings or payment credentials.
  await client.configureProject({production:config});
  const after=await client.getProject();verifyTarget(after,env.GITHUB_REF_NAME);
  if(!reviewedPublicRuntime(after.deployment_configs?.production,emailSignup))throw Error('CLOSED_PUBLIC_RUNTIME_READBACK_FAILED');
  if(bindingShape(before.deployment_configs?.preview)!==bindingShape(after.deployment_configs?.preview))throw Error('PREVIEW_RUNTIME_CHANGED');
  return {secrets,project:PAGES_PROJECT,environment:'production',emailSignup,realPayments:false,previewPreserved:true};
}
export async function checkFinalRelease(env,{client=pagesClient(env),fetcher=fetch}={}){
  const project=await client.getProject();
  verifyTarget(project,env.GITHUB_REF_NAME);
  if(!project.canonical_deployment||!reviewedPublicRuntime(project.deployment_configs?.production,true))throw Error('EXISTING_CLOSED_RUNTIME_REQUIRED');
  const domains=await client.listDomains();
  if(!hosts.every(name=>domains.some(domain=>domain.name===name&&domain.status==='active')))throw Error('BOTH_PUBLIC_DOMAINS_MUST_BE_ACTIVE');
  await requirePaymentsClosed({fetcher});
  await requireHostedEmailSignup({fetcher});
  return project;
}
export function finalReleaseKey(env,generate=randomBytes){
  const binding='BANK_CONTENT_KEY_RELEASE_'+env.GITHUB_RUN_ID+'_'+env.GITHUB_RUN_ATTEMPT;
  if(!RELEASE_CONTENT_KEY.test(binding))throw Error('EXACT_RELEASE_RUN_REQUIRED');
  return {binding,value:generate(32).toString('base64')};
}
export async function registerFinalReleaseKey(env,{binding,value},{client=pagesClient(env)}={}){
  const before=await client.getProject();
  verifyTarget(before,env.GITHUB_REF_NAME);
  const config=before.deployment_configs?.production;
  if(!before.canonical_deployment||!reviewedPublicRuntime(config,true)||Object.hasOwn(config.env_vars,binding))throw Error('NEW_RELEASE_CONTENT_BINDING_REQUIRED');
  await client.addReleaseContentKey(binding,value,config.wrangler_config_hash);
  const after=await client.getProject();
  verifyTarget(after,env.GITHUB_REF_NAME);
  const { [binding]: added, ...existing }=after.deployment_configs.production.env_vars;
  if(added?.type!=='secret_text'||
     before.canonical_deployment.id!==after.canonical_deployment?.id||
     bindingShape(config)!==bindingShape({...after.deployment_configs.production,env_vars:existing})||
     bindingShape(before.deployment_configs?.preview)!==bindingShape(after.deployment_configs?.preview))throw Error('EXISTING_PAGES_BINDINGS_CHANGED');
}
export async function configurePublicDomains(env,{client=pagesClient(env)}={}){
  verifyTarget(await client.getProject(),env.GITHUB_REF_NAME);
  const before=await client.listDomains(),attempts=[];
  for(const name of hosts){
    const current=before.find(d=>d.name===name);
    if(current?.status==='active')continue;
    try{if(current)await client.retryDomain(name);else await client.addDomain(name);attempts.push({name,requested:true});}
    catch(e){attempts.push({name,requested:false,reason:/^CLOUDFLARE_API_REJECTED_HTTP_\d+$/.test(e.message)?e.message:'DOMAIN_VALIDATION_UNAVAILABLE'});}
  }
  const domains=(await client.listDomains()).filter(d=>hosts.includes(d.name)).map(d=>({name:d.name,status:d.status,validationStatus:d.validation_data?.status,verificationStatus:d.verification_data?.status}));
  return {checkedAt:new Date().toISOString(),domains,attempts,dnsRecordsModified:false,resendModified:false};
}
export function matchingPublicDeployment(project,deployments,revision){
  if(!/^[a-f\d]{40}$/.test(revision||''))throw Error('EXACT_REVISION_REQUIRED');
  const d=deployments.find(x=>x.project_name===PAGES_PROJECT&&x.environment==='production'&&x.is_skipped!==true&&x.latest_stage?.name==='deploy'&&x.latest_stage.status==='success'&&
    x.deployment_trigger?.metadata?.branch===RESERVED_PRODUCTION_BRANCH&&x.deployment_trigger.metadata.commit_hash===revision);
  if(!d||project.canonical_deployment?.id!==d.id)throw Error('CANONICAL_PUBLIC_REVISION_REQUIRED');
  return {id:d.id,environment:d.environment,revision,url:publicSiteUrl('https://'+PAGES_PROJECT+'.pages.dev')};
}
export async function probeCanonicalWww({revision,expectedSignupEnabled=false,fetcher=fetch}){
  if(!/^[a-f\d]{40}$/.test(revision||''))throw Error('EXACT_REVISION_REQUIRED');
  const from='https://www.sitecacho.cl',to='https://sitecacho.cl',checks=[];
  for(const path of['/','/cuenta.html?next=%2Fapp%2Finicio.html','/recuperar?audit=public-domain','/privacidad.html','/version.json','/api/config','/app/daily-catalog.js','/__encrypted/domain-audit.bin']){
    try{
      const r=await fetcher(from+path,{redirect:'manual',signal:AbortSignal.timeout(20000)});
      checks.push({path,status:r.status,passed:r.status===308&&r.headers.get('location')===to+path&&r.headers.get('referrer-policy')==='no-referrer'});
    }catch{checks.push({path,passed:false});}
  }
  try{
    const r=await fetcher(to+'/api/config',{redirect:'manual',signal:AbortSignal.timeout(20000)}),d=await r.json();
    checks.push({path:'/api/config',canonicalRevision:true,passed:r.status===200&&d.revision===revision&&d.signupEnabled===expectedSignupEnabled&&d.authReturnReady===false});
  }catch{checks.push({path:'/api/config',canonicalRevision:true,passed:false});}
  return{url:from,canonicalOrigin:to,checkedAt:new Date().toISOString(),passed:checks.every(x=>x.passed),checks};
}
export async function verifyPublicSite(env,manifest,{client=pagesClient(env),fetcher=fetch,emailSignup=false,wait=ms=>new Promise(r=>setTimeout(r,ms))}={}){
  const project=await client.getProject();verifyTarget(project,env.GITHUB_REF_NAME);
  if(!reviewedPublicRuntime(project.deployment_configs?.production,emailSignup)||manifest.revision!==env.GITHUB_SHA)throw Error('PUBLIC_BUILD_OR_RUNTIME_MISMATCH');
  if(env.GITHUB_REF_NAME===FINAL_RELEASE_BRANCH&&
     (!RELEASE_CONTENT_KEY.test(manifest.contentKeyBinding||'')||
      project.deployment_configs.production.env_vars[manifest.contentKeyBinding]?.type!=='secret_text'))throw Error('PUBLIC_BUILD_OR_RUNTIME_MISMATCH');
  const deployment=matchingPublicDeployment(project,await client.listPublicDeployments(),env.GITHUB_SHA);
  const probes=[];
  const domains=await client.listDomains();
  for(const url of [deployment.url,'https://sitecacho.cl']){
    let available=false;
    for(let n=0;n<15;n++){
      try{const r=await fetcher(url+'/api/config',{redirect:'manual',signal:AbortSignal.timeout(5000)});if(r.ok&&(await r.json()).revision===env.GITHUB_SHA){available=true;break;}}catch{}
      await wait(2000);
    }
    if(!available){probes.push({url,passed:false,reason:'PUBLIC_REVISION_NOT_YET_AVAILABLE',checks:[]});continue;}
    probes.push(await probeDeployment({url,revision:env.GITHUB_SHA,protectedFiles:manifest.protectedFiles,encryptedFiles:manifest.encryptedFiles,expectedSignupEnabled:emailSignup,fetcher,validateUrl:publicSiteUrl}));
  }
  const www=domains.find(d=>d.name==='www.sitecacho.cl');let wwwProbe;
  if(www?.status==='active')wwwProbe=await probeCanonicalWww({revision:env.GITHUB_SHA,expectedSignupEnabled:emailSignup,fetcher});
  return {url:'https://sitecacho.cl',checkedAt:new Date().toISOString(),revision:env.GITHUB_SHA,deployment,fullQa:env.VERIFIED_QA_URL,
    passed:probes.every(p=>p.passed===true)&&(!wwwProbe||wwwProbe.passed===true),realPayments:false,probes,www:wwwProbe||{url:'https://www.sitecacho.cl',passed:false,status:www?.status||'not_attached',reason:'DNS_ACTIVATION_PENDING'},
    emailSignup,googleAuth:false,limits:['Compras reales deshabilitadas.','La verificación pública usa navegador y HTTP.']};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{
    const final=process.env.GITHUB_REF_NAME===FINAL_RELEASE_BRANCH;
    const env=final?{...process.env,GITHUB_SHA:process.env.REVIEWED_RELEASE_SHA}:process.env;
    const request=JSON.parse(await readFile(final?'web/deploy-final-public.request':'web/deploy-public.request','utf8'));
    validatePublicRequest(request,env);
    if(final)validateFinalRelease(request,env);
    const emailSignup=request.emailSignup===true;
    await mkdir('web/artifacts',{recursive:true});
    if(final&&process.argv.includes('--prepare-final')){
      if(!env.GITHUB_ENV)throw Error('GITHUB_ACTIONS_ENVIRONMENT_REQUIRED');
      const qa=await requireQa({...env,GITHUB_SHA:request.reviewedRevision});
      await checkFinalRelease(env);
      const {binding,value}=finalReleaseKey(env);
      console.log('::add-mask::'+value);
      await appendFile(env.GITHUB_ENV,'VERIFIED_QA_URL='+qa+'\nBANK_CONTENT_KEY_BINDING='+binding+'\nBANK_CONTENT_KEY='+value+'\n',{mode:0o600});
    }else if(final&&process.argv.includes('--register-final-key')){
      await registerFinalReleaseKey(env,{binding:env.BANK_CONTENT_KEY_BINDING,value:env.BANK_CONTENT_KEY});
    }else if(!final&&process.argv.includes('--prepare')){
      if(!env.GITHUB_ENV)throw Error('GITHUB_ACTIONS_ENVIRONMENT_REQUIRED');
      const qa=await requireQa(env);await appendFile(env.GITHUB_ENV,'VERIFIED_QA_URL='+qa+'\n');
      const result=await preparePublicProject(env,{emailSignup});
      for(const [key,value]of Object.entries(result.secrets)){console.log('::add-mask::'+value);await appendFile(env.GITHUB_ENV,key+'='+value+'\n',{mode:0o600});}
      const {secrets,...safe}=result;console.log(JSON.stringify(safe));
    }else if(process.argv.includes('--domains')){
      const result=await configurePublicDomains(env);await writeFile('web/artifacts/public-domains.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
    }else if(process.argv.includes('--verify')){
      const manifest=JSON.parse(await readFile('web/artifacts/build-manifest.json','utf8'));
      const report=await verifyPublicSite(env,manifest,{emailSignup});await writeFile('web/artifacts/pages-public.json',JSON.stringify(report,null,2)+'\n');
      console.log(JSON.stringify({url:report.url,revision:report.revision,passed:report.passed,checks:report.probes.reduce((n,p)=>n+p.checks.length,0),www:report.www.passed}));
      if(!report.passed)process.exitCode=1;
    }else throw Error('PUBLIC_RELEASE_OPERATION_REQUIRED');
  }catch(e){console.error(/^[A-Z_0-9]+$/.test(e.message)?e.message:'PUBLIC_RELEASE_FAILED');if(e.cloudflare)console.error(JSON.stringify(e.cloudflare));process.exitCode=1;}
}
