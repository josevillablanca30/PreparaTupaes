// Read-only deployment guard; bootstrap separately creates/configures the one allowed project.
import{fileURLToPath}from'node:url';import path from'node:path';
import{pagesClient,verifyTarget}from'./pages-client.mjs';
export function verifyProject(project,{branch,contentKey}={}){
 verifyTarget(project,branch);
 if(!/^[A-Za-z0-9+/]{43}=$/.test(contentKey||'')||Buffer.from(contentKey,'base64').length!==32)throw Error('BANK_CONTENT_KEY_REQUIRED');
 for(const environment of['preview','production'])if(project.deployment_configs?.[environment]?.fail_open!==false)throw Error('PAGES_FAIL_CLOSED_REQUIRED');
 const vars=project.deployment_configs.preview.env_vars||{};
 for(const key of['BANK_CONTENT_KEY','OFFLINE_SIGNING_JWK'])if(vars[key]?.type!=='secret_text')throw Error('PAGES_SECRET_BINDING_REQUIRED: '+key);
 if(vars.WEB_SIGNUP_ENABLED?.value!=='false'||vars.WEB_AUTH_RETURN_READY?.value!=='false')throw Error('PREVIEW_MUST_KEEP_REGISTRATION_CLOSED');
 if(vars.WEB_GOOGLE_AUTH_ENABLED&&vars.WEB_GOOGLE_AUTH_ENABLED.value!=='false')throw Error('PREVIEW_MUST_KEEP_GOOGLE_CLOSED');
 return{name:project.name,branch,environment:'preview',failClosed:true};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const project=await pagesClient(process.env).getProject();console.log(JSON.stringify(verifyProject(project,{branch:process.env.GITHUB_REF_NAME,contentKey:process.env.BANK_CONTENT_KEY})));}
 catch(error){console.error(error.message);process.exitCode=1;}
}
