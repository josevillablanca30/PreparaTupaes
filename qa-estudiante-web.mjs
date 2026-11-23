import assert from 'node:assert/strict';

import {mkdir} from 'node:fs/promises';
import {chromium,devices} from 'playwright';
import {createClient} from '@supabase/supabase-js';
const base='https://sitecacho.cl';
const config=await fetch(base+'/api/config').then(r=>r.json());
assert.equal(config.revision,'672b304ad3c661da5bc45926dce15759e810837a');
await mkdir('evidencia',{recursive:true});
const browser=await chromium.launch();
try {
 const ctx=await browser.newContext({...devices['Pixel 7'],serviceWorkers:'block'});
 const page=await ctx.newPage();
 await page.goto(base+'/#planes');
 const cards=page.locator('#planes article');
 assert.deepEqual(await cards.locator('h3').allTextContents(),['Básico','Semanal','Mensual','Anual']);
 await cards.first().getByRole('link',{name:/Empezar gratis/}).click();

 const support=await page.getByRole('link',{name:'Soporte'}).getAttribute('href');
 assert.match(support,/^mailto:[^@]+@gmail\.com$/);
 const email=support.slice(7).replace('@','+cachaste.qa.20261123@');
 const password=process.env.CACHASTE_QA_STUDENT_PASSWORD;
 assert.ok(password,'Falta la contraseña de la cuenta de QA confirmada');
 async function submit(form){
   await page.locator(form+' [name=email]').fill(email);
   await page.locator(form+' [name=password]').fill(password);
   await page.locator(form+' button[type=submit]').click();
 }
 const client=createClient(config.supabaseUrl,config.publishableKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await client.auth.signInWithPassword({email,password});
 assert.ok(!error && data.session,'La cuenta de QA debe tener correo confirmado y contraseña vigente');
 const state=await fetch(base+'/api/session',{headers:{Authorization:'Bearer '+data.session.access_token}}).then(r=>r.json());
 assert.equal(state.isAdmin,false);assert.equal(state.subscriptions.length,0);assert.equal(state.access.active,false);
 await client.auth.signOut({scope:'local'});
 await submit('#login-form');
 const basic=page.locator('button[data-action=basic]');
 await basic.waitFor();
 await basic.screenshot({path:'evidencia/selector.png'});
 await basic.click();
 await page.waitForURL('**/app/inicio.html');
 await page.waitForFunction(()=>window.CachasteDailyApp?.engine?.byKey?.size);
 await page.evaluate(()=>{const E=CachasteDailyApp.engine;E.start('M1',2,'lesson',[...E.byKey.values()].find(q=>q.subjectKey==='M1').concept)});
 await page.waitForFunction(()=>CachasteDailyApp.engine.state.session?.basicAttempt);
 for(let i=0;i<2;i++){
   const direct=page.locator('[data-action=begin-question]').first();
   if(await direct.isVisible())await direct.click();
   if(!await page.locator('[data-action=choice]').first().isVisible()){
     await page.evaluate(()=>{const E=CachasteDailyApp.engine;E.state.session.stage='question';E.save();CachasteDailyApp.render()});
   }
   await page.locator('[data-action=choice][data-index="0"]').click();
   await page.locator('[data-action=check]').click();
   await page.waitForFunction(()=>CachasteDailyApp.engine.state.session?.checked);
   await page.locator('[data-action=next]').click();
   if(i===0)await page.waitForFunction(()=>CachasteDailyApp.engine.state.session?.index===1);
 }
 await page.locator('.celebration-screen').waitFor();await page.screenshot({path:'evidencia/leccion.png'});
 await page.goto(base+'/cuenta.html');
 await page.locator('[data-action=signout]').click();
 await page.locator('#login-form').waitFor();await ctx.close();
 const fresh=await browser.newContext({...devices['Pixel 7']});
 const again=await fresh.newPage();await again.goto(base+'/cuenta.html#planes');
 await again.locator('#login-form [name=email]').fill(email);
 await again.locator('#login-form [name=password]').fill(password);
 await again.locator('#login-form button[type=submit]').click();
 await again.locator('button[data-action=basic]').click();
 await again.waitForURL('**/app/inicio.html');
 await again.waitForFunction(()=>CachasteDailyApp.engine.state.completed?.length>0);
 console.log('Cuenta sin Premium y sin administrador: lección M1 completada, cierre y reingreso limpio con progreso conservado.');
}finally{await browser.close()}
