import {readFile,writeFile,mkdir,appendFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {PROJECT_URL,PUBLISHABLE_KEY} from '../shared/config.mjs';
import {credentials,pagesClient,verifyTarget,reviewedPublicRuntime,publicSiteUrl,PAGES_PROJECT,PREVIEW_BRANCH,RESERVED_PRODUCTION_BRANCH,PUBLIC_RELEASE_MARKER,REPOSITORY} from './pages-client.mjs';
import {runtimeSecrets} from './prepare-pages-project.mjs';
import {requireQa} from './verify-preview-qa.mjs';
import {probeDeployment} from './verify-pages-preview.mjs';

const hosts=['sitecacho.cl','www.sitecacho.cl'];
const allowedVariables=['SUPABASE_URL','SUPABASE_PUBLISHABLE_KEY','WEB_SIGNUP_ENABLED','WEB_AUTH_RETURN_READY','WEB_GOOGLE_AUTH_ENABLED','WEB_PAYMENTS_ENABLED','WEB_PUBLIC_RELEASE','BANK_CONTENT_KEY','OFFLINE_SIGNING_JWK'];
export function validatePublicRequest(request,env){
  if(env.GITHUB_REPOSITORY!==REPOSITORY||env.GITHUB_REF_NAME!==PREVIEW_BRANCH||!/^[a-f\d]{40}$/.test(env.GITHUB_SHA||'')||
    request.project!==PAGES_PROJECT||request.sourceBranch!==PREVIEW_BRANCH||request.productionBranch!==RESERVED_PRODUCTION_BRANCH||
    request.scope!=='public-web-payments-closed'||request.realPayments!==false||request.requiresSuccessfulQa!==true||request.preserveResend!==true||
    JSON.stringify(request.hosts)!==JSON.stringify(hosts))throw Error('PUBLIC_CLOSED_PAYMENTS_REQUEST_REQUIRED');
  return true;
}
const plain=value=>({type:'plain_text',value});
const bindingShape=config=>JSON.stringify({fail_open:config?.fail_open,env_vars:Object.fromEntries(Object.entries(config?.env_vars||{}).sort().map(([k,v])=>[k,{type:v.type,...(v.type==='plain_text'?{value:v.value}:{})}]))});
export async function requirePaymentsClosed({fetcher=fetch}={}){
  const r=await fetcher(PROJECT_URL+'/functions/v1/cachaste-mercadopago',{method:'POST',headers:{apikey:PUBLISHABLE_KEY,'content-type':'application/json'},body:JSON.stringify({action:'status'}),redirect:'error',signal:AbortSignal.timeout(15000)});
  const status=await r.json();
  if(!r.ok||status.ready!==false||status.trialAvailable!==false)throw Error('PUBLIC_RELEASE_REQUIRES_PAYMENTS_CLOSED');
}
export async function preparePublicProject(env,{client=pagesClient(env),fetcher=fetch,generate=runtimeSecrets}={}){
  credentials(env);
  const before=await client.getProject();verifyTarget(before,env.GITHUB_REF_NAME);
  if(Object.keys(before.deployment_configs?.production?.env_vars||{}).some(k=>!allowedVariables.includes(k)))throw Error('UNREVIEWED_PRODUCTION_BINDING');
  await requirePaymentsClosed({fetcher});
  const secrets=generate();
  const config={fail_open:false,compatibility_date:'2026-10-24',env_vars:{
    SUPABASE_URL:plain(PROJECT_URL),SUPABASE_PUBLISHABLE_KEY:plain(PUBLISHABLE_KEY),
    ...Object.fromEntries(['WEB_SIGNUP_ENABLED','WEB_AUTH_RETURN_READY','WEB_GOOGLE_AUTH_ENABLED','WEB_PAYMENTS_ENABLED'].map(k=>[k,plain('false')])),
    WEB_PUBLIC_RELEASE:plain(PUBLIC_RELEASE_MARKER),
    ...Object.fromEntries(Object.entries(secrets).map(([k,value])=>[k,{type:'secret_text',value}])),
  }};
  // Patch only the existing named project's public runtime. No DNS, zones, account settings or payment credentials.
  await client.configureProject({production:config});
  const after=await client.getProject();verifyTarget(after,env.GITHUB_REF_NAME);
  if(!reviewedPublicRuntime(after.deployment_configs?.production))throw Error('CLOSED_PUBLIC_RUNTIME_READBACK_FAILED');
  if(bindingShape(before.deployment_configs?.preview)!==bindingShape(after.deployment_configs?.preview))throw Error('PREVIEW_RUNTIME_CHANGED');
  return {secrets,project:PAGES_PROJECT,environment:'production',realPayments:false,previewPreserved:true};
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
export async function verifyPublicSite(env,manifest,{client=pagesClient(env),fetcher=fetch,wait=ms=>new Promise(r=>setTimeout(r,ms))}={}){
  const project=await client.getProject();verifyTarget(project,env.GITHUB_REF_NAME);
  if(!reviewedPublicRuntime(project.deployment_configs?.production)||manifest.revision!==env.GITHUB_SHA)throw Error('PUBLIC_BUILD_OR_RUNTIME_MISMATCH');
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
    probes.push(await probeDeployment({url,revision:env.GITHUB_SHA,protectedFiles:manifest.protectedFiles,encryptedFiles:manifest.encryptedFiles,fetcher,validateUrl:publicSiteUrl}));
  }
  const www=domains.find(d=>d.name==='www.sitecacho.cl');let wwwProbe;
  if(www?.status==='active')wwwProbe=await probeDeployment({url:'https://www.sitecacho.cl',revision:env.GITHUB_SHA,protectedFiles:manifest.protectedFiles,encryptedFiles:manifest.encryptedFiles,fetcher,validateUrl:publicSiteUrl});
  return {url:'https://sitecacho.cl',checkedAt:new Date().toISOString(),revision:env.GITHUB_SHA,deployment,fullQa:env.VERIFIED_QA_URL,
    passed:probes.every(p=>p.passed===true),realPayments:false,probes,www:wwwProbe||{url:'https://www.sitecacho.cl',passed:false,status:www?.status||'not_attached',reason:'DNS_ACTIVATION_PENDING'},
    limits:['No habilita pagos, registro nuevo ni Google.','No acredita teléfonos físicos ni la aprobación interactiva del comprador.']};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{
    const env=process.env;validatePublicRequest(JSON.parse(await readFile('web/deploy-public.request','utf8')),env);
    await mkdir('web/artifacts',{recursive:true});
    if(process.argv.includes('--prepare')){
      if(!env.GITHUB_ENV)throw Error('GITHUB_ACTIONS_ENVIRONMENT_REQUIRED');
      const qa=await requireQa(env);await appendFile(env.GITHUB_ENV,'VERIFIED_QA_URL='+qa+'\n');
      const result=await preparePublicProject(env);
      for(const [key,value]of Object.entries(result.secrets)){console.log('::add-mask::'+value);await appendFile(env.GITHUB_ENV,key+'='+value+'\n',{mode:0o600});}
      const {secrets,...safe}=result;console.log(JSON.stringify(safe));
    }else if(process.argv.includes('--domains')){
      const result=await configurePublicDomains(env);await writeFile('web/artifacts/public-domains.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
    }else if(process.argv.includes('--verify')){
      const manifest=JSON.parse(await readFile('web/artifacts/build-manifest.json','utf8'));
      const report=await verifyPublicSite(env,manifest);await writeFile('web/artifacts/pages-public.json',JSON.stringify(report,null,2)+'\n');
      console.log(JSON.stringify({url:report.url,revision:report.revision,passed:report.passed,checks:report.probes.reduce((n,p)=>n+p.checks.length,0),www:report.www.passed}));
      if(!report.passed)process.exitCode=1;
    }else throw Error('PUBLIC_RELEASE_OPERATION_REQUIRED');
  }catch(e){console.error(/^[A-Z_0-9]+$/.test(e.message)?e.message:'PUBLIC_RELEASE_FAILED');if(e.cloudflare)console.error(JSON.stringify(e.cloudflare));process.exitCode=1;}
}
