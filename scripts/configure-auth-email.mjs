// Owner-side Management API helper. It never prints credentials or full Auth configuration.
import {readFile} from 'node:fs/promises';
const token=process.env.SUPABASE_ACCESS_TOKEN;
if(!token){console.error('Falta SUPABASE_ACCESS_TOKEN en el entorno del propietario. No lo pegues en el chat.');process.exit(1);}
const project='jmobinmdwrmdqrxtcruj',url='https://api.supabase.com/v1/projects/'+project+'/config/auth',headers={Authorization:'Bearer '+token,'Content-Type':'application/json'};
const payload={mailer_subjects_confirmation:'Confirma tu correo en ¿Cachaste?',mailer_subjects_recovery:'Recupera tu acceso a ¿Cachaste?',mailer_templates_confirmation_content:await readFile(new URL('../supabase/templates/confirmation.html',import.meta.url),'utf8'),mailer_templates_recovery_content:await readFile(new URL('../supabase/templates/recovery.html',import.meta.url),'utf8')};
for(const body of Object.values(payload).filter(v=>v.includes('<html'))){if(!body.includes('{{ .Token }}')||/localhost|ConfirmationURL|TokenHash/.test(body))throw Error('La plantilla no cumple el flujo de código');}
const first=await fetch(url,{headers,signal:AbortSignal.timeout(15000)});if(!first.ok)throw Error('No se puede leer Auth config: HTTP '+first.status);
if(!process.argv.includes('--check')){const applied=await fetch(url,{method:'PATCH',headers,body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});if(!applied.ok)throw Error('No se pudieron aplicar plantillas: HTTP '+applied.status);}
const response=await fetch(url,{headers,signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('No se pudo verificar Auth config: HTTP '+response.status);const actual=await response.json();
for(const[k,v]of Object.entries(payload))if(actual[k]!==v)throw Error('La configuración alojada no coincide: '+k);
console.log('Confirmación y recuperación verificadas: correo en español con código visible. No se modificaron SMTP, claves, URLs ni otras opciones.');
