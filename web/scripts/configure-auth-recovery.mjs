import{readFile,writeFile,mkdir}from'node:fs/promises';
import{fileURLToPath}from'node:url';
import path from'node:path';
const project='jmobinmdwrmdqrxtcruj';
const endpoint='https://api.supabase.com/v1/projects/'+project+'/config/auth';
export const STABLE_RECOVERY_ORIGIN='https://work-cachaste-web-comercial.cachaste-sitecacho.pages.dev';
const privateSmtpFields=['smtp_host','smtp_port','smtp_user','smtp_pass','smtp_admin_email','smtp_max_frequency'];
export function recoveryOrigin(input){
 const url=new URL(input);
 if(url.origin!==input||url.protocol!=='https:'||url.username||url.password||url.port||!['work-cachaste-web-comercial.cachaste-sitecacho.pages.dev','sitecacho.cl'].includes(url.hostname))throw Error('PUBLIC_RECOVERY_ORIGIN_NOT_ALLOWED');
 return url.origin;
}
export function recoveryAllowList(previous,origin){
 return [...new Set([...String(previous||'').split(',').map(v=>v.trim()).filter(v=>v&&!/^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?=[:/]|$)/i.test(v)),origin+'/recuperar',origin+'/cuenta.html?recovery=1'])].join(',');
}
export async function configureRecovery({token,origin=STABLE_RECOVERY_ORIGIN,revision,fetcher=fetch,mode='apply'}={}){
 origin=recoveryOrigin(origin);
 if(!token)throw Error('SUPABASE_ACCESS_TOKEN_REQUIRED: falta acceso a la configuración Auth; no se modificó SMTP.');
 if(!['apply','check','status'].includes(mode))throw Error('INVALID_CONFIGURATION_MODE');
 const headers={authorization:'Bearer '+token,'content-type':'application/json'};
 async function request(method='GET',body){
  let response;try{response=await fetcher(endpoint,{method,headers,redirect:'error',signal:AbortSignal.timeout(15000),...(body?{body:JSON.stringify(body)}:{})});}catch{throw Error('AUTH_CONFIGURATION_UNAVAILABLE');}
  if(!response.ok)throw Error('AUTH_CONFIGURATION_HTTP_'+response.status);
  if(method==='PATCH')return;
  try{return await response.json();}catch{throw Error('AUTH_CONFIGURATION_INVALID_RESPONSE');}
 }
 const initial=await request();
 const status={project,customSmtpPresent:['smtp_host','smtp_user','smtp_admin_email'].every(k=>typeof initial[k]==='string'&&initial[k].length>0),emailConfirmationRequired:initial.mailer_autoconfirm===false};
 if(mode==='status')return status;
 if(!status.customSmtpPresent||!status.emailConfirmationRequired)throw Error('EXISTING_SMTP_AND_EMAIL_CONFIRMATION_REQUIRED');
 let page,version;
 try{
  const response=await fetcher(origin+'/recuperar',{redirect:'manual',signal:AbortSignal.timeout(15000),headers:{'cache-control':'no-cache'}});
  page=response.status===200&&(await response.text()).includes('id="recovery-root"')&&/no-referrer/.test(response.headers.get('referrer-policy')||'')&&/no-store/.test(response.headers.get('cache-control')||'');
  if(revision){if(!/^[a-f0-9]{40}$/.test(revision))throw Error();const result=await fetcher(origin+'/version.json',{redirect:'error',signal:AbortSignal.timeout(15000)});version=result.ok&&(await result.json()).revision===revision;}
 }catch{throw Error('PUBLIC_RECOVERY_PAGE_NOT_VERIFIED');}
 if(!page||(revision&&!version))throw Error('PUBLIC_RECOVERY_PAGE_NOT_VERIFIED');
 const recovery=await readFile(new URL('../auth/recovery.html',import.meta.url),'utf8');
 if(!recovery.includes('{{ .Token }}')||!recovery.includes('{{ .TokenHash }}')||!recovery.includes('{{ .SiteURL }}/recuperar#token_hash=')||/localhost|ConfirmationURL|<script/i.test(recovery))throw Error('RECOVERY_TEMPLATE_INVALID');
 const payload={site_url:origin,uri_allow_list:recoveryAllowList(initial.uri_allow_list,origin),mailer_subjects_recovery:'¿Cachaste? — Recupera tu contraseña',mailer_templates_recovery_content:recovery,smtp_sender_name:'¿Cachaste?'};
 const matches=config=>Object.entries(payload).every(([key,value])=>config[key]===value);
 if(mode==='check'){if(!matches(initial))throw Error('HOSTED_RECOVERY_CONFIGURATION_DIFFERS');return{...status,origin,recoveryUrl:origin+'/recuperar',verified:true,changed:false,smtpCredentialsUnchanged:true};}
 if(matches(initial))return{...status,origin,recoveryUrl:origin+'/recuperar',verified:true,changed:false,smtpCredentialsUnchanged:true};
 await request('PATCH',payload);const actual=await request();
 if(!matches(actual)||actual.mailer_autoconfirm!==initial.mailer_autoconfirm||privateSmtpFields.some(key=>actual[key]!==initial[key]))throw Error('AUTH_CONFIGURATION_READBACK_FAILED');
 return{...status,origin,recoveryUrl:origin+'/recuperar',verified:true,changed:true,smtpCredentialsUnchanged:true};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const flags=process.argv.slice(2);if(flags.length>1||flags.some(f=>!['--status','--check'].includes(f)))throw Error('Use --status, --check o ninguna bandera.');
  const result=await configureRecovery({token:process.env.SUPABASE_ACCESS_TOKEN,origin:process.env.CACHASTE_RECOVERY_ORIGIN||STABLE_RECOVERY_ORIGIN,revision:process.env.CACHASTE_RECOVERY_REVISION,mode:flags[0]?.slice(2)||'apply'});
  await mkdir(new URL('../artifacts/',import.meta.url),{recursive:true});await writeFile(new URL('../artifacts/auth-recovery-configuration.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }catch(error){console.error(error.message);process.exitCode=1;}
}
