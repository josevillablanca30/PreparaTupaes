import test from 'node:test';
import assert from 'node:assert/strict';
import {preparePublicProject,validatePublicRequest,matchingPublicDeployment,configurePublicDomains,probeCanonicalWww,validateFinalRelease,checkFinalRelease,finalReleaseKey,registerFinalReleaseKey} from '../scripts/publish-sitecacho.mjs';
import {prepareProject} from '../scripts/prepare-pages-project.mjs';
import {PAGES_ACCOUNT_ID,PAGES_PROJECT,PREVIEW_BRANCH,PUBLIC_SOURCE_BRANCH,FINAL_RELEASE_BRANCH,RESERVED_PRODUCTION_BRANCH,REPOSITORY,verifyTarget,publicSiteUrl,reviewedPublicRuntime,pagesClient} from '../scripts/pages-client.mjs';
import {requireQa} from '../scripts/verify-preview-qa.mjs';
const revision='a'.repeat(40);
const env={GITHUB_REPOSITORY:REPOSITORY,GITHUB_REF_NAME:PUBLIC_SOURCE_BRANCH,GITHUB_SHA:revision,CLOUDFLARE_ACCOUNT_ID:PAGES_ACCOUNT_ID,CLOUDFLARE_API_TOKEN:'fixture-public-no-real-token-123456789'};
const request={project:PAGES_PROJECT,sourceBranch:PUBLIC_SOURCE_BRANCH,productionBranch:RESERVED_PRODUCTION_BRANCH,scope:'public-web-payments-closed',realPayments:false,requiresSuccessfulQa:true,preserveResend:true,hosts:['sitecacho.cl','www.sitecacho.cl']};
const deployment=()=>({id:'reviewed-production',project_name:PAGES_PROJECT,environment:'production',is_skipped:false,latest_stage:{name:'deploy',status:'success'},deployment_trigger:{metadata:{branch:RESERVED_PRODUCTION_BRANCH,commit_hash:revision}}});
function api(){
 const calls=[];let domains=[{name:'sitecacho.cl',status:'active'},{name:'www.sitecacho.cl',status:'deactivated'}];
 const p={name:PAGES_PROJECT,source:null,production_branch:RESERVED_PRODUCTION_BRANCH,canonical_deployment:null,domains:[PAGES_PROJECT+'.pages.dev','sitecacho.cl'],deployment_configs:{production:{fail_open:false,env_vars:{}},preview:{fail_open:false,env_vars:{KEEP_PREVIEW:{type:'secret_text',value:'[encrypted]'}}}}};
 const client={getProject:async()=>structuredClone(p),configureProject:async configs=>{calls.push(configs);p.deployment_configs={...p.deployment_configs,...structuredClone(configs)};},listDomains:async()=>structuredClone(domains),retryDomain:async name=>{calls.push({retry:name});domains=domains.map(d=>d.name===name?{...d,status:'pending'}:d);},addDomain:async name=>calls.push({add:name})};
 return {p,client,calls};
}
const closed=async()=>Response.json({ready:false,trialAvailable:false});
const finalEnv={...env,GITHUB_REF_NAME:FINAL_RELEASE_BRANCH,GITHUB_SHA:'b'.repeat(40),REVIEWED_RELEASE_SHA:revision,GITHUB_RUN_ID:'123',GITHUB_RUN_ATTEMPT:'1'};
const finalRequest={...request,sourceBranch:FINAL_RELEASE_BRANCH,enabled:true,reviewedRevision:revision,indexing:false,emailSignup:true};
test('final release requires an enabled request for the exact reviewed revision with sales and indexing off',()=>{
 assert.equal(validateFinalRelease(finalRequest,finalEnv),true);
 for(const change of [{enabled:false},{reviewedRevision:'c'.repeat(40)},{realPayments:true},{indexing:true},{emailSignup:false}]){
  assert.throws(()=>validateFinalRelease({...finalRequest,...change},finalEnv));
 }
 assert.throws(()=>validateFinalRelease({...finalRequest,reviewedRevision:undefined},{...finalEnv,REVIEWED_RELEASE_SHA:undefined}));
});
test('final release accepts only the integration workflow for its branch and reviewed SHA',async()=>{
 const run={id:123,head_sha:revision,head_branch:FINAL_RELEASE_BRANCH,path:'.github/workflows/web-final-integration.yml',event:'push',status:'completed',conclusion:'success'};
 const wrongBranch={...run,id:999,head_branch:PUBLIC_SOURCE_BRANCH,path:'.github/workflows/web-commercial-guardrails.yml',run_number:99};
 const qaEnv={...finalEnv,GITHUB_SHA:revision,GH_TOKEN:'fixture-read'};
 const result=await requireQa(qaEnv,{fetcher:async()=>Response.json({workflow_runs:[wrongBranch,run]})});
 assert.match(result,/\/actions\/runs\/123$/);
 await assert.rejects(requireQa(qaEnv,{fetcher:async()=>Response.json({workflow_runs:[{...run,conclusion:'failure'}]})}),/DID_NOT_PASS/);
});
test('final release reads production before adding a separate key and preserves existing bindings',async()=>{
 const a=api();await preparePublicProject(env,{client:a.client,fetcher:closed,emailSignup:false});
 a.p.deployment_configs.production.env_vars.WEB_SIGNUP_ENABLED.value='true';
 a.p.canonical_deployment=deployment();
 const before=structuredClone(a.p.deployment_configs),calls=[];
 const client=pagesClient(finalEnv,{fetcher:async (url,options)=>{
  if(options.method==='PATCH'){
   const {deployment_configs:configs}=JSON.parse(options.body);calls.push(configs);
   Object.assign(a.p.deployment_configs.production.env_vars,configs.production.env_vars);
  }else assert.equal(options.method,'GET');
  return Response.json({success:true,result:a.p});
 }});
 const readyFetch=async url=>url.endsWith('/auth/v1/settings')?Response.json({external:{email:true},disable_signup:false,mailer_autoconfirm:false}):closed();
 const domains=[{name:'sitecacho.cl',status:'active'},{name:'www.sitecacho.cl',status:'active'}];
 await assert.rejects(checkFinalRelease(finalEnv,{client:{...client,listDomains:async()=>domains.slice(0,1)},fetcher:readyFetch}),/BOTH_PUBLIC_DOMAINS/);
 await checkFinalRelease(finalEnv,{client:{...client,listDomains:async()=>domains},fetcher:readyFetch});
 assert.equal(calls.length,0);
 const key=finalReleaseKey(finalEnv);
 await registerFinalReleaseKey(finalEnv,key,{client});
 assert.deepEqual(calls,[{production:{env_vars:{[key.binding]:{type:'secret_text',value:key.value}}}}]);
 const after=structuredClone(a.p.deployment_configs);
 delete after.production.env_vars[key.binding];
 assert.deepEqual(after,before);
 await assert.rejects(registerFinalReleaseKey(finalEnv,key,{client}),/NEW_RELEASE_CONTENT_BINDING_REQUIRED/);
 assert.equal(calls.length,1);
});
test('public release requires the explicit fixed website request and cannot enable real payments or another branch',()=>{
 assert.equal(validatePublicRequest(request,env),true);
 for(const change of[{realPayments:true},{scope:'production'},{preserveResend:false},{requiresSuccessfulQa:false},{hosts:['other.cl']},{productionBranch:'main'}])assert.throws(()=>validatePublicRequest({...request,...change},env));
 for(const change of[{GITHUB_REPOSITORY:'other/repo'},{GITHUB_REF_NAME:'work/cachaste-duelos-2-20261110'},{GITHUB_SHA:'unknown'}])assert.throws(()=>validatePublicRequest(request,{...env,...change}));
});
test('public preparation writes only its production runtime, preserves preview secrets and explicitly closes payment and launch gates',async()=>{
 const a=api(),before=structuredClone(a.p.deployment_configs.preview);
 const result=await preparePublicProject(env,{client:a.client,fetcher:closed});
 assert.deepEqual(Object.keys(a.calls[0]),['production']);assert.deepEqual(a.p.deployment_configs.preview,before);
 assert.equal(reviewedPublicRuntime(a.p.deployment_configs.production),true);assert.equal(result.realPayments,false);
 const vars=a.p.deployment_configs.production.env_vars;
 assert.equal(vars.BANK_CONTENT_KEY.type,'secret_text');assert.equal(vars.BANK_CONTENT_KEY.value,result.secrets.BANK_CONTENT_KEY);
 assert.equal(vars.WEB_PAYMENTS_ENABLED.value,'false');assert.equal(vars.WEB_SIGNUP_ENABLED.value,'false');assert(!('MP_ACCESS_TOKEN' in vars));
});
test('provider readiness, unknown production credentials and an unrelated canonical site stop publication before mutation',async()=>{
 for(const status of[{ready:true,trialAvailable:false},{ready:false,trialAvailable:true},{}]){
  const a=api();await assert.rejects(preparePublicProject(env,{client:a.client,fetcher:async()=>Response.json(status)}),/PAYMENTS_CLOSED/);assert.equal(a.calls.length,0);
 }
 const unknown=api();unknown.p.deployment_configs.production.env_vars.MP_ACCESS_TOKEN={type:'secret_text',value:'[encrypted]'};
 await assert.rejects(preparePublicProject(env,{client:unknown.client,fetcher:closed}),/UNREVIEWED_PRODUCTION_BINDING/);assert.equal(unknown.calls.length,0);
 const unrelated=api();unrelated.p.canonical_deployment={id:'foreign'};
 await assert.rejects(preparePublicProject(env,{client:unrelated.client,fetcher:closed}),/EXISTING_PRODUCTION/);assert.equal(unrelated.calls.length,0);
});
test('future preview builds preserve the reviewed public runtime rather than replacing its production encryption keys',async()=>{
 const a=api();await preparePublicProject(env,{client:a.client,fetcher:closed});
 a.p.canonical_deployment=deployment();const before=structuredClone(a.p.deployment_configs.production);a.calls.length=0;
 verifyTarget(a.p,PREVIEW_BRANCH);assert.equal((await prepareProject(env,{client:a.client})).publicWebsitePresent,true);
 assert.deepEqual(Object.keys(a.calls[0]),['preview']);assert.deepEqual(a.p.deployment_configs.production,before);
 const forged=structuredClone(a.p);forged.deployment_configs.production.env_vars.WEB_PAYMENTS_ENABLED.value='true';assert.throws(()=>verifyTarget(forged,PREVIEW_BRANCH));
});
test('public verification requires the canonical successful deployment of the exact SHA and only the three named origins',()=>{
 const d=deployment(),p={canonical_deployment:{id:d.id}};
 assert.equal(matchingPublicDeployment(p,[d],revision).url,'https://cachaste-sitecacho.pages.dev');
 for(const change of[{environment:'preview'},{project_name:'other'},{latest_stage:{name:'deploy',status:'failure'}},{deployment_trigger:{metadata:{branch:'main',commit_hash:revision}}}])assert.throws(()=>matchingPublicDeployment(p,[{...d,...change}],revision));
 assert.throws(()=>matchingPublicDeployment({canonical_deployment:{id:'old'}},[d],revision));
 for(const url of['https://other.cl','http://sitecacho.cl','https://sitecacho.cl.evil.invalid','https://sitecacho.cl/path','https://sitecacho.cl?key=value'])assert.throws(()=>publicSiteUrl(url));
});
test('domain revalidation leaves an already active apex intact and records only the named www retry without DNS changes',async()=>{
 const a=api(),r=await configurePublicDomains(env,{client:a.client});
 assert.deepEqual(a.calls,[{retry:'www.sitecacho.cl'}]);assert.equal(r.dnsRecordsModified,false);assert.equal(r.resendModified,false);
 assert.equal(r.domains.find(d=>d.name==='sitecacho.cl').status,'active');assert.equal(r.domains.find(d=>d.name==='www.sitecacho.cl').status,'pending');
});
test('the active www host must preserve paths and queries in its HTTPS canonical redirect and reach the reviewed closed revision',async()=>{
 const fixture=({badLocation=false,badStatus=false,badRevision=false}={})=>async(url,options)=>{
  assert.equal(options.redirect,'manual');const u=new URL(url);
  if(u.hostname==='sitecacho.cl')return Response.json({revision:badRevision?'b'.repeat(40):revision,signupEnabled:false,authReturnReady:false});
  assert.equal(u.hostname,'www.sitecacho.cl');return new Response(null,{status:badStatus?302:308,headers:{location:(badLocation?'https://unrelated.invalid':'https://sitecacho.cl')+u.pathname+u.search,'referrer-policy':'no-referrer'}});
 };
 const good=await probeCanonicalWww({revision,fetcher:fixture()});assert.equal(good.passed,true);assert.equal(good.checks.length,9);
 for(const change of[{badLocation:true},{badStatus:true},{badRevision:true}])assert.equal((await probeCanonicalWww({revision,fetcher:fixture(change)})).passed,false);
});

test('Explicit email signup requires hosted confirmation while checkout and Google stay closed', async () => {
 const blocked=api();
 const settings=enabled=>async url=>url.endsWith('/auth/v1/settings')
  ?Response.json({external:{email:true,google:false},disable_signup:false,mailer_autoconfirm:!enabled})
  :closed();
 await assert.rejects(preparePublicProject(env,{client:blocked.client,fetcher:settings(false),emailSignup:true}),/HOSTED_EMAIL_CONFIRMATION_REQUIRED/);
 assert.equal(blocked.calls.length,0);
 const ready=api();
 const result=await preparePublicProject(env,{client:ready.client,fetcher:settings(true),emailSignup:true});
 assert.equal(result.emailSignup,true);
 assert.equal(result.realPayments,false);
 assert.equal(reviewedPublicRuntime(ready.p.deployment_configs.production,true),true);
 assert.equal(reviewedPublicRuntime(ready.p.deployment_configs.production,false),false);
});
