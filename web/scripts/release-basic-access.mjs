import {readFile,writeFile,appendFile} from 'node:fs/promises';
import {randomBytes,createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pagesClient,verifyTarget,reviewedPublicRuntime} from './pages-client.mjs';
const env=process.env,client=pagesClient(env);
const flags=['WEB_BASIC_ACCESS_ENABLED','WEB_BASIC_EDUCATIONAL_GUARDS_READY','WEB_BASIC_ORIGINAL_ENGINE_READY'];
const stable=p=>JSON.stringify({preview:p.deployment_configs.preview,production:Object.fromEntries(Object.entries(p.deployment_configs.production.env_vars).filter(([k])=>!flags.includes(k)&&!k.startsWith('BANK_CONTENT_KEY_RELEASE_')).sort(([a],[b])=>a.localeCompare(b)))});
const digest=p=>createHash('sha256').update(stable(p)).digest('hex');
const before=await client.getProject();verifyTarget(before,env.GITHUB_REF_NAME);
if(!reviewedPublicRuntime(before.deployment_configs.production,true))throw Error('PUBLIC_RUNTIME_REQUIRED');
const request=JSON.parse(await readFile('web/deploy-basic-public.request','utf8'));
const reviewed=execFileSync('git',['rev-parse','HEAD^1'],{encoding:'utf8'}).trim();
if(request.reviewedRevision!==reviewed||request.expectedProductionRevision!==before.canonical_deployment.deployment_trigger.metadata.commit_hash||request.scope!=='basic-web-access-only'||request.preservePayments!==true)throw Error('BASIC_RELEASE_REQUEST_MISMATCH');
if(execFileSync('git',['diff','--name-only',reviewed,'HEAD'],{encoding:'utf8'}).trim()!=='web/deploy-basic-public.request')throw Error('REQUEST_ONLY_COMMIT_REQUIRED');
const binding='BANK_CONTENT_KEY_RELEASE_'+env.GITHUB_RUN_ID+'_'+env.GITHUB_RUN_ATTEMPT;
const key=randomBytes(32).toString('base64');
// Add one encrypted build key and the three educational flags; never write payment bindings.
await client.addReleaseContentKey(binding,key,before.deployment_configs.production.wrangler_config_hash);
await client.configureProject({production:{env_vars:Object.fromEntries(flags.map(k=>[k,{type:'plain_text',value:'true'}]))}});
const after=await client.getProject();verifyTarget(after,env.GITHUB_REF_NAME);
if(digest(before)!==digest(after)||!flags.every(k=>after.deployment_configs.production.env_vars[k]?.value==='true'))throw Error('EXISTING_RUNTIME_CHANGED');
const commercial=before.deployment_configs.production.env_vars.WEB_PAYMENTS_ENABLED.value==='true';
// Reuse the already approved seller, prices and terms. Only set the build's source revision.
const approved=JSON.parse(await readFile('web/deploy-final-public.request','utf8'));
if(approved.realPayments!==commercial)throw Error('PAYMENT_BUILD_MODE_MISMATCH');
approved.reviewedRevision=reviewed;await writeFile('web/deploy-final-public.request',JSON.stringify(approved,null,2)+'\n');
await appendFile(env.GITHUB_ENV,`BANK_CONTENT_KEY=${key}\nBANK_CONTENT_KEY_BINDING=${binding}\nREVIEWED_RELEASE_SHA=${reviewed}\nCACHASTE_COMMERCIAL_RELEASE=${commercial}\n`);
console.log(JSON.stringify({source:reviewed,previousProduction:request.expectedProductionRevision,basicEnabled:true,paymentModePreserved:true,existingBindingsPreserved:true}));
