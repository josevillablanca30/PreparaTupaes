import test from 'node:test';
import assert from 'node:assert/strict';
import {preparePublicProject,validatePublicRequest,matchingPublicDeployment,configurePublicDomains} from '../scripts/publish-sitecacho.mjs';
import {prepareProject} from '../scripts/prepare-pages-project.mjs';
import {PAGES_ACCOUNT_ID,PAGES_PROJECT,PREVIEW_BRANCH,RESERVED_PRODUCTION_BRANCH,REPOSITORY,verifyTarget,publicSiteUrl,reviewedPublicRuntime} from '../scripts/pages-client.mjs';
const revision='a'.repeat(40);
const env={GITHUB_REPOSITORY:REPOSITORY,GITHUB_REF_NAME:PREVIEW_BRANCH,GITHUB_SHA:revision,CLOUDFLARE_ACCOUNT_ID:PAGES_ACCOUNT_ID,CLOUDFLARE_API_TOKEN:'fixture-public-no-real-token-123456789'};
const request={project:PAGES_PROJECT,sourceBranch:PREVIEW_BRANCH,productionBranch:RESERVED_PRODUCTION_BRANCH,scope:'public-web-payments-closed',realPayments:false,requiresSuccessfulQa:true,preserveResend:true,hosts:['sitecacho.cl','www.sitecacho.cl']};
const deployment=()=>({id:'reviewed-production',project_name:PAGES_PROJECT,environment:'production',is_skipped:false,latest_stage:{name:'deploy',status:'success'},deployment_trigger:{metadata:{branch:RESERVED_PRODUCTION_BRANCH,commit_hash:revision}}});
function api(){
 const calls=[];let domains=[{name:'sitecacho.cl',status:'active'},{name:'www.sitecacho.cl',status:'deactivated'}];
 const p={name:PAGES_PROJECT,source:null,production_branch:RESERVED_PRODUCTION_BRANCH,canonical_deployment:null,domains:[PAGES_PROJECT+'.pages.dev','sitecacho.cl'],deployment_configs:{production:{fail_open:false,env_vars:{}},preview:{fail_open:false,env_vars:{KEEP_PREVIEW:{type:'secret_text',value:'[encrypted]'}}}}};
 const client={getProject:async()=>structuredClone(p),configureProject:async configs=>{calls.push(configs);p.deployment_configs={...p.deployment_configs,...structuredClone(configs)};},listDomains:async()=>structuredClone(domains),retryDomain:async name=>{calls.push({retry:name});domains=domains.map(d=>d.name===name?{...d,status:'pending'}:d);},addDomain:async name=>calls.push({add:name})};
 return {p,client,calls};
}
const closed=async()=>Response.json({ready:false,trialAvailable:false});
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
