// Read-only deployment guard. This script cannot create a project, buy a service or publish production.
import{fileURLToPath}from'node:url';import path from'node:path';
export function verifyProject(project,{branch,contentKey}={}){
 if(!project?.name||!project.production_branch)throw Error('PAGES_PROJECT_MISSING');
 if(project.name!=='cachaste-sitecacho')throw Error('UNRELATED_PROJECT_DENIED');
 if(branch!=='work/cachaste-web-comercial-20261024'||project.production_branch===branch)throw Error('PRODUCTION_DEPLOYMENT_DENIED');
 if(Buffer.from(contentKey||'','base64').length!==32)throw Error('BANK_CONTENT_KEY_REQUIRED');
 for(const environment of['preview','production'])if(project.deployment_configs?.[environment]?.fail_open!==false)throw Error('PAGES_FAIL_CLOSED_REQUIRED');
 const vars=project.deployment_configs.preview.env_vars||{};
 for(const key of['BANK_CONTENT_KEY','OFFLINE_SIGNING_JWK'])if(vars[key]?.type!=='secret_text')throw Error('PAGES_SECRET_BINDING_REQUIRED: '+key);
 if(vars.WEB_SIGNUP_ENABLED?.value==='true'||vars.WEB_AUTH_RETURN_READY?.value==='true')throw Error('PREVIEW_MUST_KEEP_REGISTRATION_CLOSED');
 return{name:project.name,branch,environment:'preview',failClosed:true};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const{CLOUDFLARE_ACCOUNT_ID:account,CLOUDFLARE_API_TOKEN:token,CLOUDFLARE_PAGES_PROJECT:project,BANK_CONTENT_KEY:contentKey,GITHUB_REF_NAME:branch}=process.env;
 if(!/^[a-f0-9]{32}$/i.test(account||'')||!token||!/^[a-z0-9-]{1,58}$/.test(project||''))throw Error('Configure Cloudflare credentials in the protected GitHub environment');
 const response=await fetch('https://api.cloudflare.com/client/v4/accounts/'+account+'/pages/projects/'+project,{headers:{authorization:'Bearer '+token}}),data=await response.json();if(!response.ok||!data.success)throw Error('CLOUDFLARE_PROJECT_UNAVAILABLE');
 console.log(JSON.stringify(verifyProject(data.result,{branch,contentKey})));
}
