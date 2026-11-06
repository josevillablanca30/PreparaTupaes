import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {PREVIEW_BRANCH,PAGES_PROJECT,REPOSITORY} from './pages-client.mjs';

export function validatePreviewRequest(request,env){
 if(!request||typeof request!=='object'||Array.isArray(request))throw Error('PREVIEW_REQUEST_INVALID');
 if(request.project!==PAGES_PROJECT||request.branch!==PREVIEW_BRANCH||request.scope!=='preview-only')throw Error('PREVIEW_REQUEST_TARGET_DENIED');
 if(request.production!==false||request.realPayments!==false||request.requiresSuccessfulQa!==true||request.verifyHostedSupabase!==true)throw Error('PREVIEW_REQUEST_SAFETY_DENIED');
 if(!/^web-unificada-[a-z0-9-]+$/.test(request.request||''))throw Error('PREVIEW_REQUEST_ID_INVALID');
 if(env.GITHUB_REF_NAME!==PREVIEW_BRANCH||env.GITHUB_REPOSITORY!==REPOSITORY)throw Error('PREVIEW_REQUEST_CONTEXT_DENIED');
 return true;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const request=JSON.parse(await readFile(new URL('../deploy-preview.request',import.meta.url),'utf8'));
  validatePreviewRequest(request,process.env);
  console.log('Preview request validated for isolated branch, mandatory QA and disabled payments.');
 }catch{console.error('Preview request validation failed; deployment stopped.');process.exitCode=1;}
}
