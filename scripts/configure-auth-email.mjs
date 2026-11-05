// Owner-side helper: never print credentials, SMTP identities or full Auth config.
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

const project='jmobinmdwrmdqrxtcruj';
const endpoint='https://api.supabase.com/v1/projects/'+project+'/config/auth';
export async function configureAuthEmail({token,fetchImpl=fetch,mode='apply'}={}){
 if(!token)throw Error('Falta SUPABASE_ACCESS_TOKEN en el entorno del propietario. No lo pegues en el chat.');
 if(!['apply','check','status'].includes(mode))throw Error('Modo de configuración desconocido.');
 const headers={Authorization:'Bearer '+token,'Content-Type':'application/json'};
 async function request(method='GET',body){
  let response;try{response=await fetchImpl(endpoint,{method,headers,...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(15000)});}catch{throw Error('No se pudo contactar la configuración Auth. No se muestran datos privados.');}
  if(!response.ok)throw Error('No se pudo '+(method==='PATCH'?'aplicar':'leer')+' Auth config: HTTP '+response.status);
  if(method==='PATCH')return;
  try{return await response.json();}catch{throw Error('Auth config devolvió una respuesta no válida.');}
 }
 const initial=await request();
 const nonempty=value=>typeof value==='string'&&value.trim().length>0;
 const status={project,customSmtpConfigured:['smtp_host','smtp_user','smtp_admin_email'].every(k=>nonempty(initial[k])),emailConfirmationRequired:initial.mailer_autoconfirm===false};
 if(mode==='status')return status;
 // New Free projects cannot customize templates with the default SMTP provider.
 // Default SMTP also cannot deliver signup emails to arbitrary closed-testers.
 if(!status.customSmtpConfigured)throw Error('SMTP propio no configurado o incompleto. Configúralo en Authentication > Email > SMTP antes de aplicar plantillas. El envío predeterminado restringe destinatarios y los proyectos Free nuevos no pueden personalizarlo.');
 if(!status.emailConfirmationRequired)throw Error('No se pudo confirmar que la verificación de correo esté activada. Revísala antes de aplicar plantillas.');
 const origin=initial.site_url;
 if(!['https://work-cachaste-web-comercial.cachaste-sitecacho.pages.dev','https://sitecacho.cl'].includes(origin)||!String(initial.uri_allow_list||'').split(',').map(v=>v.trim()).includes(origin+'/recuperar'))throw Error('Falta una URL pública de recuperación autorizada. No se modificó Auth ni SMTP.');
 const payload={mailer_subjects_confirmation:'Confirma tu correo en ¿Cachaste?',mailer_subjects_recovery:'¿Cachaste? — Recupera tu contraseña',mailer_templates_confirmation_content:await readFile(new URL('../supabase/templates/confirmation.html',import.meta.url),'utf8'),mailer_templates_recovery_content:await readFile(new URL('../supabase/templates/recovery.html',import.meta.url),'utf8')};
 for(const key of ['mailer_templates_confirmation_content','mailer_templates_recovery_content'])if(!payload[key].includes('{{ .Token }}')||/localhost|ConfirmationURL|<script/i.test(payload[key]))throw Error('La plantilla no cumple el flujo de recuperación.');
 if(!payload.mailer_templates_recovery_content.includes('{{ .SiteURL }}/recuperar#token_hash={{ .TokenHash }}&amp;type=recovery'))throw Error('La plantilla de recuperación debe conservar el enlace web y el código Android.');
 const matches=config=>Object.entries(payload).every(([key,value])=>config[key]===value);
 if(mode==='check'){
  if(!matches(initial))throw Error('Las plantillas alojadas aún no coinciden con las plantillas españolas de código. No se modificó la configuración.');
  return {...status,templatesMatch:true,changed:false};
 }
 if(matches(initial))return {...status,templatesMatch:true,changed:false};
 await request('PATCH',payload);
 const verified=await request();
 if(!matches(verified))throw Error('La configuración alojada no coincide después de aplicar las plantillas. No se declara verificada.');
 if(verified.mailer_autoconfirm!==false)throw Error('La verificación de correo cambió durante la operación. Revisar configuración; no se declara verificada.');
 return {...status,templatesMatch:true,changed:true};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 try{
  const flags=process.argv.slice(2);
  if(flags.length>1||flags.some(f=>!['--check','--status'].includes(f)))throw Error('Uso: node scripts/configure-auth-email.mjs [--status|--check]');
  const result=await configureAuthEmail({token:process.env.SUPABASE_ACCESS_TOKEN,mode:flags[0]?.slice(2)||'apply'});
  console.log(JSON.stringify(result));
  if(result.templatesMatch)console.log('Plantillas de confirmación y recuperación verificadas. Falta comprobar entrega real y registro en los teléfonos. No se modificaron SMTP, claves, URLs ni otras opciones.');
 }catch(error){console.error(error.message);process.exitCode=1;}
}
