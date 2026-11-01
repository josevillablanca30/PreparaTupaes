import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {configureAuthEmail} from '../scripts/configure-auth-email.mjs';

const token='owner-token-for-isolated-test';
const smtp={smtp_host:'smtp.example.test',smtp_user:'private-user',smtp_admin_email:'auth@example.test',smtp_pass:'private-smtp-password',mailer_autoconfirm:false};
const templates={mailer_subjects_confirmation:'Confirma tu correo en ¿Cachaste?',mailer_subjects_recovery:'Recupera tu acceso a ¿Cachaste?',mailer_templates_confirmation_content:await readFile(new URL('../supabase/templates/confirmation.html',import.meta.url),'utf8'),mailer_templates_recovery_content:await readFile(new URL('../supabase/templates/recovery.html',import.meta.url),'utf8')};
function backend(initial,after){let config={...initial};const calls=[];return {calls,fetchImpl:async(url,options)=>{calls.push({url,...options});if(options.method==='PATCH'){config={...config,...JSON.parse(options.body),...after};return new Response(null,{status:200});}return Response.json(config);}};}

test('Auth email preflight requires owner access before making any request',async()=>{
 let calls=0;await assert.rejects(configureAuthEmail({fetchImpl:async()=>{calls++;}}),/Falta SUPABASE_ACCESS_TOKEN/);assert.equal(calls,0);
});
test('Default SMTP and incomplete SMTP stop before any template write',async()=>{
 for(const config of [{mailer_autoconfirm:false},{...smtp,smtp_user:' '},{...smtp,smtp_admin_email:null}]){
  const b=backend(config);await assert.rejects(configureAuthEmail({token,...b}),/SMTP propio/);assert.equal(b.calls.length,1);assert.equal(b.calls[0].method,'GET');
 }
});
test('Read-only status exposes booleans, never SMTP addresses, password or owner token',async()=>{
 const b=backend({...smtp,...templates});const status=await configureAuthEmail({token,...b,mode:'status'});
 assert.deepEqual(status,{project:'jmobinmdwrmdqrxtcruj',customSmtpConfigured:true,emailConfirmationRequired:true});assert.equal(b.calls.length,1);
 for(const secret of [token,smtp.smtp_user,smtp.smtp_admin_email,smtp.smtp_pass])assert.ok(!JSON.stringify(status).includes(secret));
});
test('An unconfirmed verification policy cannot be mistaken for a safe signup setup',async()=>{
 for(const mailer_autoconfirm of [true,undefined]){const b=backend({...smtp,mailer_autoconfirm});await assert.rejects(configureAuthEmail({token,...b}),/verificación de correo/);assert.equal(b.calls.length,1);}
});
test('Check is strictly read-only whether templates match or differ',async()=>{
 const b=backend(smtp);await assert.rejects(configureAuthEmail({token,...b,mode:'check'}),/aún no coinciden/);assert.equal(b.calls.length,1);
 const ready=backend({...smtp,...templates});assert.equal((await configureAuthEmail({token,...ready,mode:'check'})).templatesMatch,true);assert.equal(ready.calls.length,1);
});
test('Apply changes exactly the two subjects and two bodies and verifies readback',async()=>{
 const b=backend(smtp);const result=await configureAuthEmail({token,...b});assert.equal(result.changed,true);assert.deepEqual(b.calls.map(c=>c.method),['GET','PATCH','GET']);assert.deepEqual(JSON.parse(b.calls[1].body),templates);
 assert.ok(b.calls.every(c=>c.url==='https://api.supabase.com/v1/projects/jmobinmdwrmdqrxtcruj/config/auth'));assert.ok(b.calls.every(c=>c.headers.Authorization==='Bearer '+token));
 const ready=backend({...smtp,...templates});assert.equal((await configureAuthEmail({token,...ready})).changed,false);assert.equal(ready.calls.length,1);
});
test('Rejected writes, stale readback and unexpected confirmation changes never report success',async()=>{
 const stale=backend(smtp,{mailer_subjects_confirmation:'old'});await assert.rejects(configureAuthEmail({token,...stale}),/no coincide después/);
 const disabled=backend(smtp,{mailer_autoconfirm:true});await assert.rejects(configureAuthEmail({token,...disabled}),/cambió durante/);
 const b=backend(smtp);await assert.rejects(configureAuthEmail({token,fetchImpl:async(url,options)=>options.method==='PATCH'?new Response('private remote error',{status:403}):b.fetchImpl(url,options)}),/HTTP 403/);
});
test('Transport failures and HTTP errors do not echo private remote responses',async()=>{
 for(const fetchImpl of [async()=>{throw Error(token);},async()=>new Response(token,{status:401}),async()=>new Response(token,{status:200})]){
  await assert.rejects(configureAuthEmail({token,fetchImpl}),error=>!error.message.includes(token));
 }
});
