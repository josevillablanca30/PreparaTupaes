import assert from 'node:assert/strict';
import {randomBytes,randomUUID} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {createClient} from '@supabase/supabase-js';
import {PROJECT_URL,PUBLISHABLE_KEY} from './web/shared/config.mjs';

const origin='https://sitecacho.cl';
const ref=new URL(PROJECT_URL).hostname.split('.')[0];
const adminToken=process.env.SUPABASE_ACCESS_TOKEN;
const keys=await fetch('https://api.supabase.com/v1/projects/'+ref+'/api-keys',{headers:{Authorization:'Bearer '+adminToken}});
assert.ok(keys.ok,'Falta autorización de QA en Supabase');
const service=(await keys.json()).find(k=>k.name==='service_role');
assert.ok(service?.api_key,'Falta la credencial de provisión');
const options={auth:{persistSession:false,autoRefreshToken:false}};
const admin=createClient(PROJECT_URL,service.api_key,options);
const password=randomBytes(30).toString('base64url');
const email='qa-portada-'+randomUUID()+'@example.com';
const created=await admin.auth.admin.createUser({email,password,email_confirm:true});
assert.ok(created.data.user?.id,'No se pudo provisionar la cuenta temporal');
const uid=created.data.user.id;
let browser;
try {
  const user=createClient(PROJECT_URL,PUBLISHABLE_KEY,options);
  const login=await user.auth.signInWithPassword({email,password});
  assert.equal(login.data.user?.id,uid);
  assert.equal(login.data.user.role,'authenticated');
  const session=await fetch(origin+'/api/session',{method:'GET',headers:{authorization:'Bearer '+login.data.session.access_token}});
  assert.equal(session.status,200);
  const state=await session.json();
  assert.equal(state.access.tier,'basica');
  assert.notEqual(state.access.active,true);
  assert.equal(state.subscriptions.length,0);
  console.log('Usuario nuevo: nivel Básica, sin Premium ni suscripciones.');
  browser=await chromium.launch();
  const page=await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'});
  const html=await readFile('web/public/index.html','utf8');
  const css=await readFile('web/public/web.css','utf8');
  await page.route(origin+'/',route=>route.fulfill({contentType:'text/html',body:html}));
  await page.route(origin+'/web.css',route=>route.fulfill({contentType:'text/css',body:css}));
  await page.goto(origin);
  const cards=page.locator('#planes article');
  assert.deepEqual(await cards.locator('h3').allTextContents(),['Básico','Semanal','Mensual','Anual']);
  for(const width of [390,850,1440]){
    await page.setViewportSize({width,height:844});
    const boxes=await cards.evaluateAll(nodes=>nodes.map(n=>({x:n.getBoundingClientRect().x,y:n.getBoundingClientRect().y,right:n.getBoundingClientRect().right})));
    assert.ok(boxes.every(b=>b.x>=0&&b.right<=width+1));
    assert.ok(boxes.every(b=>b.y>=boxes[0].y-1));
  }
  await cards.first().getByRole('link',{name:/Empezar gratis/}).click();
  await page.getByRole('button',{name:'Crear mi cuenta'}).click();
  await page.locator('#signup-form').waitFor();
  await page.getByRole('button',{name:'Volver a iniciar sesión'}).click();
  await page.locator('#login-form input[name=email]').fill(email);
  await page.locator('#login-form input[name=password]').fill(password);
  await page.locator('#login-form button[type=submit]').click();
  const start=page.locator('button[data-action=basic]');
  await start.waitFor({timeout:45000});
  await start.click();
  await page.waitForURL('**/app/inicio.html',{timeout:45000});
  const response=await page.request.get(origin+'/app/inicio.html');
  assert.equal(response.status(),200);
  const body=await response.text();
  assert.ok(body.includes('learning-access.js'));
  console.log('Portada candidata en móvil/tableta/escritorio. Registro accesible. Cuenta normal en selector real -> Empezar gratis -> inicio educativo HTTP 200.');
} finally {
  try {await browser?.close()} finally {
    const removed=await admin.auth.admin.deleteUser(uid);
    assert.equal(removed.error,null,'Revisar limpieza de la cuenta temporal');
    console.log('Cuenta temporal eliminada.');
  }
}
