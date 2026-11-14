import{test,expect}from'@playwright/test';
import{fixturePage}from'../../tests/helpers/competition-fixtures.mjs';
import{measureTextContrast,PUBLIC_SURFACE_TEXT}from'./helpers/text-contrast.mjs';
import{createRequire}from'node:module';import path from'node:path';
const require=createRequire(import.meta.url),{PNG}=require(path.join(path.dirname(require.resolve('playwright-core/package.json')),'lib/utilsBundle.js'));
async function showCompetition(page,state,prefix){const route=state==='rankings'?'rankings':'duelos';await page.goto(prefix+'#'+route);await expect(page.getByRole('heading',{name:route==='rankings'?'Rankings':'Duelos',exact:true})).toBeVisible();await expect(page.locator(route==='rankings'?'.ranking-row':'.duel-row')).toHaveCount(route==='rankings'?6:2);if(state==='duelo'||state==='resultado'){await page.getByRole('button',{name:'Desafiar',exact:true}).click();await page.getByRole('textbox',{name:'Nickname',exact:true}).fill('CataPAES');await page.getByRole('button',{name:'Enviar desafío',exact:true}).click();await expect(page.getByRole('heading',{name:'Duelo PAES',exact:true})).toBeVisible();if(state==='resultado'){await page.getByRole('button',{name:'Comenzar duelo',exact:true}).click();for(let i=0;i<10;i++){await expect(page.locator('.question-meta strong')).toContainText((i+1)+'/10');await page.getByRole('radio').nth(1).check();await page.getByRole('button',{name:'Enviar respuesta',exact:true}).click();}await expect(page.getByRole('heading',{name:'Resultado del duelo',exact:false})).toBeVisible();}}}

async function identity(page,index=0){
 const data=await(await page.request.get('/__qa/session')).json(),session=data.users[index];
 await page.addInitScript(session=>{if(!sessionStorage.getItem('cachaste-qa-initialized')){localStorage.setItem('cachaste-auth-v1',JSON.stringify(session));sessionStorage.setItem('cachaste-qa-initialized','1');}const transport=window.fetch.bind(window);window.fetch=(input,options)=>{const target=new URL(typeof input==='string'||input instanceof URL?input:input.url,location.href);if(target.origin==='https://jmobinmdwrmdqrxtcruj.supabase.co'){const local=location.origin+'/__qa/supabase'+target.pathname+target.search;return transport(input instanceof Request?new Request(local,input):local,options);}return transport(input,options);};},session);return session;
}
async function enter(page,index=0){await identity(page,index);await page.goto('/cuenta.html');await expect(page.getByRole('link',{name:'Continuar mi preparación',exact:false})).toBeVisible();await page.getByRole('link',{name:'Continuar mi preparación',exact:false}).click();await expect(page.locator('[data-action=pick-course]')).toHaveCount(5);}
async function layout(page,{checkCompetitionLabels=true}={}){expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await expect.poll(()=>page.locator('img').evaluateAll(nodes=>nodes.every(x=>x.complete&&x.naturalWidth>0))).toBe(true);if(checkCompetitionLabels)expect(await page.locator('.subject-tabs button').evaluateAll(buttons=>buttons.every(button=>{const box=button.getBoundingClientRect(),walker=document.createTreeWalker(button,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){if(!node.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(node);const text=range.getBoundingClientRect();if(text.left<box.left-1||text.right>box.right+1)return false;}return true;}))).toBe(true);}
test.beforeEach(async({request})=>{await request.post('/__qa/control',{data:{reset:true}});});
test('public account, prices and recovery retain readable text on their rendered surfaces',async({page},info)=>{
 for(const[path,heading]of[['/','Te lo dejamos clarito para un buen resultado.'],['/cuenta.html','Tu preparación comienza aquí.'],['/recuperar','Recupera tu contraseña.']]){
  await page.goto(path);await expect(page.getByRole('heading',{name:heading,exact:true})).toBeVisible();
  const measurements=await page.evaluate(measureTextContrast,PUBLIC_SURFACE_TEXT);expect(measurements.length).toBeGreaterThan(8);expect(measurements.filter(x=>!x.passed)).toEqual([]);
  await page.screenshot({path:info.outputPath('readable-'+(path==='/'?'landing':path.includes('cuenta')?'account':'recovery')+'.png'),fullPage:!info.project.name.includes('iPhone')});
 }
 await identity(page);await page.goto('/cuenta.html');await expect(page.getByRole('heading',{name:'Sigamos desde donde quedaste.',exact:true})).toBeVisible();
 expect((await page.evaluate(measureTextContrast,PUBLIC_SURFACE_TEXT)).filter(x=>!x.passed)).toEqual([]);
});
test('landing is complete, uses original art, prices and working subject and account links',async({page},info)=>{
 await page.goto('/');await expect(page.getByRole('heading',{name:'Te lo dejamos clarito para un buen resultado.',exact:false})).toBeVisible();await expect(page.locator('.subject-grid a')).toHaveCount(5);await expect(page.locator('.price-card')).toHaveCount(3);await layout(page);await page.screenshot({path:info.outputPath('01-landing-real-browser.png'),fullPage:!info.project.name.includes('iPhone')&&!info.project.name.includes('mobile')&&!info.project.name.includes('Android')});await page.locator('.faq-list summary').first().click();await expect(page.getByText('No. El camino parte de las bases',{exact:false})).toBeVisible();await page.locator('a.header-account[href="/cuenta.html"]').click();await expect(page.getByRole('heading',{name:'Tu preparación comienza aquí.',exact:true})).toBeVisible();
});
test('anonymous bank request, forged JWT and Premium URL flags all fail closed',async({page,request})=>{
 for(const path of['/app/daily-catalog.js','/app/m2-bank.js','/app/history-bank.js']){const r=await request.get(path);expect(r.status()).toBe(401);expect(await r.text()).not.toContain('CACHASTE_DAILY_CATALOG');}
 const bad=await request.get('/app/daily-catalog.js?premium=true',{headers:{authorization:'Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjQwMDAwMDAwMDB9.forged'}});expect(bad.status()).toBe(401);await page.goto('/app/inicio.html');await expect(page).toHaveURL(/cuenta.html/);
});
test('login crosses real browser UI and cookie gate; disabled registration and billing stay honest',async({page})=>{
 await identity(page);await page.goto('/cuenta.html');await page.getByRole('button',{name:'Cerrar sesión',exact:true}).click();await expect(page.getByRole('heading',{name:'Tu preparación comienza aquí.'})).toBeVisible();await page.getByLabel('Correo electrónico',{exact:true}).fill('student-a@example.invalid');await page.getByLabel('Contraseña',{exact:true}).fill('Isolated-qa-password-2026');await page.getByRole('button',{name:'Crear mi cuenta',exact:true}).click();await expect(page.locator('#account-status')).toContainText('El registro se habilitará');await page.getByRole('button',{name:'Entrar a mi cuenta',exact:false}).click();await expect(page.locator('[data-action=pick-course]')).toHaveCount(5);
});
test('the account stays usable when payment reconciliation is delayed',async({page})=>{
 await identity(page);
 let refreshes=0;
 await page.route('**/api/billing',async route=>{
  const {action}=route.request().postDataJSON();
  if(action==='status')return route.fulfill({json:{ready:false,trialAvailable:false,managementReady:true}});
  expect(action).toBe('refresh');
  refreshes++;
  await route.fulfill({status:503,json:{error:'PAYMENT_PROVIDER_UNAVAILABLE'}});
 });
 await page.goto('/cuenta.html?checkout=return');
 await expect(page.getByRole('link',{name:'Continuar mi preparación',exact:false})).toBeVisible();
 await expect(page.locator('#account-status')).toContainText('Mercado Pago aún no responde');
 await expect(page.getByRole('button',{name:'Ver estado de apertura'})).toHaveCount(3);
 expect(refreshes).toBe(1);
});
test('a checkout return waits for server-confirmed access',async({page,request})=>{
 await identity(page);
 await request.post('/__qa/control',{data:{active:false}});
 await page.goto('/cuenta.html?checkout=return&status=approved');
 await expect(page.locator('#account-status')).toContainText('esperando la confirmación del pago');
 await expect(page.getByRole('link',{name:'Continuar mi preparación',exact:false})).toHaveCount(0);
 await expect(page.locator('.access-state')).toContainText('Necesitas una suscripción vigente');
});
test('an unpaid student signs in, chooses a plan and enters only after server confirmation',async({page,request})=>{
 await identity(page);
 await page.goto('/cuenta.html');
 await page.getByRole('button',{name:'Cerrar sesión',exact:true}).click();
 await request.post('/__qa/control',{data:{active:false}});
 await expect(page.getByRole('heading',{name:'Tu preparación comienza aquí.'})).toBeVisible();
 await expect(page.locator('[data-plan]')).toHaveCount(0);
 await page.route('**/api/billing',async route=>{
  const {action,plan}=route.request().postDataJSON();
  if(action==='status')return route.fulfill({json:{ready:true,managementReady:true,trialAvailable:true}});
  if(action==='refresh')return route.fulfill({json:{refreshed:true}});
  expect({action,plan}).toEqual({action:'checkout',plan:'semanal'});
  return route.fulfill({json:{checkoutUrl:new URL('/cuenta.html?checkout=return',route.request().url()).href}});
 });
 await page.reload();
 await page.getByLabel('Correo electrónico',{exact:true}).fill('student-a@example.invalid');
 await page.getByLabel('Contraseña',{exact:true}).fill('Isolated-qa-password-2026');
 await page.getByRole('button',{name:'Entrar a mi cuenta',exact:false}).click();
 await expect(page.getByRole('heading',{name:'Elige tu plan',exact:true})).toBeFocused();
 await expect(page.getByRole('button',{name:'Elegir semanal',exact:true})).toBeVisible();
 await expect(page.getByRole('link',{name:'Continuar mi preparación',exact:false})).toHaveCount(0);
 await page.goto('/app/competencia.html#rankings');
 await expect(page).toHaveURL(/\/cuenta\.html\?.*#planes$/);
 await page.getByRole('link',{name:'Perfil, privacidad y eliminación',exact:true}).click();
 await expect(page.getByRole('button',{name:'Eliminar mi cuenta',exact:false})).toBeVisible();
 await expect(page.getByRole('link',{name:'Rankings',exact:true})).toHaveCount(0);
 await expect(page.getByRole('link',{name:'Abrir duelos y rankings',exact:true})).toHaveCount(0);
 await page.evaluate(()=>new Promise(resolve=>{
  addEventListener('hashchange',()=>requestAnimationFrame(resolve),{once:true});
  location.hash='duelos';
 }));
 await expect(page.getByRole('heading',{name:'Duelos',exact:true})).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'Mi perfil público',exact:true})).toBeVisible();
 await page.getByRole('link',{name:'Volver a Mi cuenta',exact:true}).click();
 await page.getByRole('button',{name:'Elegir semanal',exact:true}).click();
 await expect(page.locator('#account-status')).toContainText('esperando la confirmación del pago');
 await expect(page.getByRole('link',{name:'Continuar mi preparación',exact:false})).toHaveCount(0);
 await request.post('/__qa/control',{data:{active:true}});
 await page.getByRole('button',{name:'Actualizar mi acceso',exact:true}).click();
 await page.getByRole('link',{name:'Continuar mi preparación',exact:false}).click();
 await expect(page.locator('[data-action=pick-course]')).toHaveCount(5);
});
test('Google opens only a configured S256 flow and the real SDK exchanges its one-time callback before entering the five subjects',async({page,request,baseURL},info)=>{
 await request.post('/__qa/control',{data:{googleReady:true}});
 // Isolated provider transport: no Google account, consent or production grant
 // is created. The installed SDK and Pages/session handlers are the real code.
 await page.addInitScript(()=>{const transport=window.fetch.bind(window);window.fetch=(input,options)=>{const target=new URL(typeof input==='string'||input instanceof URL?input:input.url,location.href);if(target.origin==='https://jmobinmdwrmdqrxtcruj.supabase.co')return transport(location.origin+'/__qa/supabase'+target.pathname+target.search,options);return transport(input,options);};});
 let challenged=false;await page.route('https://jmobinmdwrmdqrxtcruj.supabase.co/auth/v1/authorize**',async route=>{
  const url=new URL(route.request().url());expect(url.searchParams.get('code_challenge_method')).toBe('s256');const challenge=url.searchParams.get('code_challenge');expect(challenge).toMatch(/^[A-Za-z0-9_-]{43}$/);await request.post('/__qa/control',{data:{oauthChallenge:challenge}});challenged=true;
  // WebKit cannot fulfill an intercepted navigation with a 302. A disposable
  // consent page exercises a normal browser link back to the real callback.
  const redirect=new URL(url.searchParams.get('redirect_to'));expect(redirect.origin).toBe(baseURL);redirect.searchParams.set('code','qa-google-single-use');await route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html lang="es"><title>Proveedor OAuth aislado</title><a href="'+redirect.href.replaceAll('&','&amp;').replaceAll('"','&quot;')+'">Completar acceso de prueba</a></html>'});
 });
 await page.goto('/cuenta.html?next=%2Fapp%2Finicio.html');await page.getByRole('button',{name:'Continuar con Google',exact:false}).click();await page.getByRole('link',{name:'Completar acceso de prueba',exact:true}).click();await expect(page.getByRole('link',{name:'Continuar mi preparación',exact:false})).toBeVisible();expect(challenged).toBe(true);expect(page.url()).not.toContain('code=');await layout(page);await page.screenshot({path:info.outputPath('google-pkce-verified-account.png'),fullPage:true});
 await page.getByRole('link',{name:'Continuar mi preparación',exact:false}).click();await expect(page.locator('[data-action=pick-course]')).toHaveCount(5);
});
test('unconfigured Google and cancelled callback stay clear, accessible and do not create a student session',async({page},info)=>{
 await page.goto('/cuenta.html?error=access_denied&error_description=DO_NOT_RENDER_PROVIDER_TEXT');await expect(page.getByRole('heading',{name:'Tu preparación comienza aquí.'})).toBeVisible();await expect(page.locator('#account-status')).toContainText('cancelado');expect(page.url()).not.toContain('error');await expect(page.locator('body')).not.toContainText('DO_NOT_RENDER_PROVIDER_TEXT');
 await page.getByRole('button',{name:'Continuar con Google',exact:false}).click();await expect(page.locator('#account-status')).toContainText('aún falta autorizar');expect(await page.evaluate(()=>localStorage.getItem('cachaste-auth-v1'))).toBe(null);await layout(page);await page.screenshot({path:info.outputPath('google-closed-no-account.png'),fullPage:true});
});
test('the PWA never stores an OAuth authorization code in a public cache request URL',async({page,request})=>{
 await enter(page);await page.evaluate(()=>navigator.serviceWorker.ready);await page.goto('/cuenta.html?code=do-not-cache-authorization-code');await expect(page).not.toHaveURL(/code=/);
 const cached=await page.evaluate(async()=>{const urls=[];for(const name of await caches.keys())if(name.startsWith('cachaste-public-'))for(const req of await(await caches.open(name)).keys())urls.push(req.url);return urls;});expect(cached.some(url=>url.includes('do-not-cache-authorization-code'))).toBe(false);
 const response=await request.get('/cuenta.html?code=header-check-only');expect(response.headers()['referrer-policy']).toBe('no-referrer');expect(response.headers()['cache-control']).toContain('no-store');
});
test('long practice renews a missing cookie from the refreshable session without losing the draft',async({page,context})=>{
 await enter(page);await page.locator('[data-action=pick-course][data-subject=M2]').click();await page.evaluate(()=>CachasteWebProgress.flush());await expect.poll(()=>page.evaluate(()=>CachasteWebProgress.pending())).toBe(0);
 await context.clearCookies();await page.evaluate(()=>CachasteWebSession.reconnect());await expect.poll(async()=>(await context.cookies()).some(c=>c.name==='cachaste_web_session'&&c.httpOnly)).toBe(true);await page.reload();await expect.poll(()=>page.evaluate(()=>window.CachasteDailyApp?.engine.state.subject)).toBe('M2');
});
test('switching students in the SDK preserves the old local draft and never uploads it for the new account',async({page,request})=>{
 const sessions=await(await request.get('/__qa/session')).json();await enter(page);await page.evaluate(()=>CachasteWebProgress.pause());await page.locator('[data-action=pick-course][data-subject=Historia]').click();const old=await page.evaluate(()=>({id:CachasteWebBootstrap.userId,draft:localStorage.getItem('cachaste-daily-v1')}));
 await page.evaluate(async other=>{const sdk=globalThis[Symbol.for('cachaste.web.auth')].client;await sdk.auth.setSession({access_token:other.access_token,refresh_token:other.refresh_token});},sessions.users[1]);await expect(page).toHaveURL(/cuenta.html/);await expect(page.locator('.account-email')).toContainText('student-b@example.invalid');expect(await page.evaluate(id=>localStorage.getItem('cachaste-web:'+id+':cachaste-daily-v1'),old.id)).toBe(old.draft);
 const state=await(await request.get('/__qa/state')).json();expect(state.documents.find(r=>r.userId===sessions.users[1].user.id)?.documents||[]).toEqual([]);
});
test('switching from Mi cuenta to a student without Premium removes the previous offline authorization and private cache',async({page,request})=>{
 const sessions=await(await request.get('/__qa/session')).json();await enter(page);await page.evaluate(()=>navigator.serviceWorker.ready);await page.goto('/cuenta.html');await expect(page.locator('.account-email')).toContainText('student-a@example.invalid');await expect.poll(()=>page.evaluate(async()=>[...await caches.keys()].some(k=>k.startsWith('cachaste-license-')))).toBe(true);
 await request.post('/__qa/control',{data:{active:false}});await page.evaluate(async other=>{await globalThis[Symbol.for('cachaste.web.auth')].client.auth.setSession({access_token:other.access_token,refresh_token:other.refresh_token});},sessions.users[1]);await expect(page.locator('.account-email')).toContainText('student-b@example.invalid');await expect(page.locator('.access-state')).toContainText('Necesitas una suscripción');await expect.poll(()=>page.evaluate(async()=>[...await caches.keys()].filter(k=>k.startsWith('cachaste-private-')||k.startsWith('cachaste-license-')).length)).toBe(0);
});
test('a Google-only student can administer and delete the account after Premium expires without inventing a password',async({page,request})=>{
 await enter(page);await expect.poll(()=>page.evaluate(()=>!!window.CachasteWebSession)).toBe(true);await page.evaluate(()=>CachasteWebSession.reconnect());await request.post('/__qa/control',{data:{active:false,googleAccount:true}});await page.goto('/app/competencia.html?manage=profile#perfil');await expect(page.getByRole('heading',{name:'Mi perfil público',exact:true})).toBeVisible();await page.getByRole('button',{name:'Eliminar mi cuenta',exact:false}).click();await expect(page.locator('#delete-account-form')).toBeVisible();await expect(page.locator('#delete-account-form input[name=password]')).toHaveCount(0);await expect(page.locator('a[href="/cuenta.html?reauth=google&next=%2Fapp%2Fcompetencia.html"]')).toBeVisible();
 await page.getByLabel('Escribe ELIMINAR',{exact:true}).fill('ELIMINAR');await page.getByRole('button',{name:'Eliminar definitivamente mi cuenta',exact:true}).click();await expect(page).toHaveURL(/cuenta.html/);await expect(page.getByRole('heading',{name:'Tu preparación comienza aquí.'})).toBeVisible();expect(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('cachaste-web:')).length)).toBe(0);
 const state=await(await request.get('/__qa/state')).json(),remove=state.calls.findIndex(x=>x.operation==='photo_storage_remove'),deletion=state.calls.findIndex(x=>x.operation==='delete_account');expect(remove).toBeGreaterThanOrEqual(0);expect(deletion).toBeGreaterThan(remove);
});
test('web profile deletion removes its Storage thumbnail first even after educational access expires',async({page,request})=>{
 await enter(page);await request.post('/__qa/control',{data:{active:false}});await page.goto('/app/competencia.html?manage=profile#perfil');await page.getByRole('button',{name:'Borrar mi perfil público',exact:true}).click();await page.getByRole('button',{name:'Borrar perfil',exact:true}).click();
 await expect.poll(async()=>{const state=await(await request.get('/__qa/state')).json();return state.calls.filter(x=>['photo_storage_remove','delete_profile'].includes(x.operation)).map(x=>x.operation);}).toEqual(['photo_storage_remove','delete_profile']);
});
test('five subjects and all science tracks retain the full educational engine',async({page},info)=>{
 await enter(page);for(const subject of['M1','M2','Lectura','Historia','Ciencias']){
  await page.goto('/app/inicio.html#courses');await page.locator('[data-action=pick-course][data-subject="'+subject+'"]').click();if(subject==='Ciencias'){await expect(page.locator('[data-action=pick-track]')).toHaveCount(4);await page.locator('[data-action=pick-track]').first().click();}
  await layout(page);await page.screenshot({path:info.outputPath('subject-'+subject+'.png'),fullPage:true});
 }
 expect(await page.evaluate(()=>window.CACHASTE_DAILY_CATALOG.items.length)).toBe(802);
});
for(const subject of ['M1','M2','Lectura','Ciencias','Historia'])test(subject+': real lesson interaction, correction and persistence without granting mastery',async({page},info)=>{
 await enter(page);await page.locator('[data-action=pick-course][data-subject="'+subject+'"]').click();if(subject==='Ciencias')await page.locator('[data-track=Biología]').click();await page.locator('[data-action=game-mode]').click();await page.locator('.trail-stop.current .trail-node').click();await page.locator('[data-action=lesson]').click();await expect(page.locator('.visual-lesson')).toBeVisible();await page.locator('[data-action=intro-next]').click();
 const before=await page.evaluate(()=>({xp:CachasteDailyApp.engine.stats().xp,attempts:CachasteDailyApp.engine.state.attempts.length}));
 for(let n=0;n<20&&!await page.locator('.visual-probe').count();n++)await page.locator('[data-action=intro-next]').click();await expect(page.locator('.visual-probe')).toBeVisible();
 const answer=await page.evaluate(()=>{const e=CachasteDailyApp.engine,s=e.state.session,q=e.byKey.get(s.keys[s.index]);return CachasteLessons.current(q,s.visualLesson).answer;});await page.locator('[data-action=visual-choose][data-value="'+((answer+1)%3)+'"]').click();await expect(page.locator('.visual-response.try-again')).toBeVisible();await page.evaluate(()=>CachasteWebProgress.flush());await page.reload();await expect(page.locator('.visual-response.try-again')).toBeVisible();await page.locator('[data-action=visual-choose][data-value="'+answer+'"]').click();await expect(page.locator('.visual-response.right')).toBeVisible();expect(await page.evaluate(()=>({xp:CachasteDailyApp.engine.stats().xp,attempts:CachasteDailyApp.engine.state.attempts.length}))).toEqual(before);await layout(page);await page.screenshot({path:info.outputPath('lesson-'+subject+'.png'),fullPage:true});
});
for(const subject of ['M1','M2','Lectura','Ciencias','Historia'])test(subject+': full PAES exam, answer navigation and cloud persistence use the complete original bank',async({page},info)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await enter(page);await page.locator('[data-action=pick-course][data-subject="'+subject+'"]').click();if(subject==='Ciencias')await page.locator('[data-track=Biología]').click();await page.locator('[data-action=exam-mode]').click();await expect(page).toHaveURL(/modo=ensayo/);
 const options=page.locator('[data-choice],.option,.answer-option');await expect(options.first()).toBeVisible();await options.first().click();await expect(options.first()).toHaveClass(/selected|chosen/);
 const count=await page.evaluate(subject=>{if(subject==='M1')return queue.length;const key={M2:'cachaste-m2-v1',Lectura:'cachaste-reading-v1',Ciencias:'cachaste-science-v1',Historia:'cachaste-history-v1'}[subject];return JSON.parse(localStorage.getItem(key)).session.ids.length;},subject);expect(count).toBe(subject==='M2'?55:subject==='Ciencias'?80:65);await page.evaluate(()=>CachasteWebProgress.flush());await expect.poll(()=>page.evaluate(()=>CachasteWebProgress.pending())).toBe(0);await page.reload();await page.getByRole('button',{name:{M1:'Continuar ensayo',M2:'Retomar sesión guardada',Lectura:'Continuar práctica',Ciencias:'Continuar donde quedé',Historia:'Retomar sesión guardada'}[subject],exact:true}).click();await expect(page.locator('[data-choice],.option,.answer-option').first()).toHaveClass(/selected|chosen/);await layout(page);await page.screenshot({path:info.outputPath('full-exam-'+subject+'.png'),fullPage:true});expect(errors).toEqual([]);
});
for(const subject of ['M1','M2','Lectura','Ciencias','Historia'])test(subject+': complete Express results, educational review and diagnostic resume are synchronized',async({page},info)=>{
 test.setTimeout(90000);await enter(page);await page.locator('[data-action=pick-course][data-subject="'+subject+'"]').click();if(subject==='Ciencias')await page.locator('[data-track=Biología]').click();await page.locator('[data-action=express-mode]').click();
 for(let n=0;n<15;n++){await expect(page.locator('.question-title')).toBeVisible();const answer=await page.evaluate(n=>{const e=CachasteDailyApp.engine,s=e.state.session,q=e.byKey.get(s.keys[s.index]);return n<10?q.answer:(q.answer+1)%q.options.length;},n);await page.locator('[data-action=choice][data-index="'+answer+'"]').click();await page.locator('[data-action=check]').click();await expect(page.locator('.daily-options .correct,.selected-repair,.tutor,[data-action=hint]')).toHaveCount(0);await page.locator('[data-action=next]').click();}
 await expect(page.locator('.express-report')).toContainText('10/15');await expect(page.locator('.express-review')).toHaveCount(15);await page.locator('.express-review').last().click();await expect(page.locator('.express-review').last()).toContainText('Elegiste:');await page.evaluate(()=>CachasteWebProgress.flush());await expect.poll(()=>page.evaluate(()=>CachasteWebProgress.pending())).toBe(0);await page.reload();await expect(page.locator('.express-report')).toContainText('10/15');await layout(page);await page.screenshot({path:info.outputPath('express-result-'+subject+'.png'),fullPage:true});
 await page.locator('[data-action=modes]').click();await page.locator('[data-action=diagnostic-mode]').click();await expect(page.locator('.question-title')).toBeVisible();expect(await page.evaluate(()=>CachasteDailyApp.engine.state.session.keys.length)).toBe(30);const key=await page.evaluate(()=>CachasteDailyApp.engine.state.session.keys[0]);await page.evaluate(()=>CachasteWebProgress.flush());await expect.poll(()=>page.evaluate(()=>CachasteWebProgress.pending())).toBe(0);await page.reload();expect(await page.evaluate(()=>CachasteDailyApp.engine.state.session.keys[0])).toBe(key);await expect(page.locator('.question-title')).toBeVisible();
});
test('public legal pages work anonymously and deletion offers a request without login on every viewport',async({page,context},info)=>{
 await context.clearCookies();
 for(const[slug,title]of[['privacidad','Política de privacidad'],['condiciones','Condiciones de uso'],['eliminar-cuenta','Eliminar cuenta y datos']]){
  const response=await page.goto('/'+slug+'.html');expect(response.status()).toBe(200);await expect(page.getByRole('heading',{level:1})).toHaveText(title);await expect(page.locator('main')).toContainText('3 de noviembre de 2026');await expect(page.locator('main .legal-nav a')).toHaveCount(3);await layout(page);
  if(slug==='eliminar-cuenta'){const request=page.getByRole('link',{name:'Solicitar eliminación de mi cuenta',exact:true});await expect(request).toBeVisible();expect(await request.getAttribute('href')).toMatch(/^mailto:jose\.villablanca\.horta@gmail\.com\?subject=Eliminar/);await expect(page.locator('main')).toContainText('progreso educativo local');}
  await page.screenshot({path:info.outputPath('legal-'+slug+'.png'),fullPage:true});
 }
 for(const entry of['/','/cuenta.html','/recuperar']){await page.goto(entry);for(const slug of['privacidad','condiciones','eliminar-cuenta'])await expect(page.locator('footer a[href="/'+slug+'.html"]')).toBeVisible();}
});
test('authenticated educational web keeps all three legal links on its own public domain',async({page})=>{
 await enter(page);for(const slug of['privacidad','condiciones','eliminar-cuenta'])await expect(page.locator('.web-legal-links a[href="/'+slug+'.html"]')).toBeVisible();await page.locator('.web-legal-links a[href="/eliminar-cuenta.html"]').click();await expect(page.getByRole('heading',{level:1})).toHaveText('Eliminar cuenta y datos');
});
test('two browser contexts synchronize one identity; another student does not inherit progress',async({browser,request,baseURL})=>{
 const a=await browser.newContext({baseURL}),b=await browser.newContext({baseURL}),other=await browser.newContext({baseURL});try{
  const pa=await a.newPage();await identity(pa);await pa.goto(baseURL+'/cuenta.html');await pa.getByRole('link',{name:'Continuar mi preparación',exact:false}).click();await expect(pa.locator('[data-action=pick-course]')).toHaveCount(5);await pa.locator('[data-action=pick-course][data-subject=M2]').click();await pa.evaluate(()=>window.CachasteWebProgress.flush());await expect.poll(()=>pa.evaluate(()=>CachasteWebProgress.pending())).toBe(0);
  const pb=await b.newPage();await identity(pb);await pb.goto(baseURL+'/cuenta.html');await pb.getByRole('link',{name:'Continuar mi preparación',exact:false}).click();await expect.poll(()=>pb.evaluate(()=>window.CachasteDailyApp?.engine.state.subject)).toBe('M2');
  const pc=await other.newPage();await identity(pc,1);await pc.goto(baseURL+'/cuenta.html');await pc.getByRole('link',{name:'Continuar mi preparación',exact:false}).click();await expect(pc.locator('[data-action=pick-course]')).toHaveCount(5);expect(await pc.evaluate(()=>window.CachasteDailyApp.engine.state.chosenCourse)).not.toBe(true);
 }finally{await a.close();await b.close();await other.close();}
});
for(const state of['rankings','duelos','duelo','resultado'])test('approved '+state+' UI keeps the Android composition and original art',async({page,browser,baseURL},info)=>{
 await identity(page);await page.goto('/cuenta.html');await expect(page.getByRole('link',{name:'Continuar mi preparación',exact:false})).toBeVisible();await showCompetition(page,state,'/app/competencia.html');
 await layout(page);await page.screenshot({path:info.outputPath('competition-'+state+'-web.png'),fullPage:true});
 expect(await page.locator('.brand img').first().getAttribute('src')).toBe('assets/competition-logo.svg');
 const use=info.project.use,baselineContext=await browser.newContext({baseURL,viewport:page.viewportSize(),userAgent:use.userAgent,deviceScaleFactor:use.deviceScaleFactor,isMobile:use.isMobile,hasTouch:use.hasTouch,serviceWorkers:'block'}),baseline=await baselineContext.newPage();
 try{
  await fixturePage(baseline);await showCompetition(baseline,state,'/__android_reference/competencia.html');
  await layout(baseline,{checkCompetitionLabels:false});
  await baseline.screenshot({path:info.outputPath('competition-'+state+'-android-reference.png'),fullPage:true,animations:'disabled'});
  // Desktop intentionally uses the available width. Mobile compares the unchanged
  // official hero, excluding web-only navigation and recent-history filters.
  const desktop=page.viewportSize().width>=1000;
  const selector=state==='duelo'?'.versus-intro':'.comp-hero';
  expect(await page.locator(selector+' img').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src')))).toEqual(await baseline.locator(selector+' img').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src'))));
  if(desktop){expect((await page.locator('#competition-root').boundingBox()).width).toBeGreaterThan(1000);expect((await baseline.locator('#competition-root').boundingBox()).width).toBeLessThanOrEqual(760);}
  else{
   const a=PNG.sync.read(await page.locator(selector).screenshot({animations:'disabled'})),b=PNG.sync.read(await baseline.locator(selector).screenshot({animations:'disabled'}));
   expect(a.width).toBe(b.width);expect(a.height).toBe(b.height);let changed=0;
   for(let i=0;i<a.data.length;i+=4)if(Math.max(...[0,1,2].map(c=>Math.abs(a.data[i+c]-b.data[i+c])))>36)changed++;
   const ratio=changed/(a.width*a.height);await info.attach('visual-comparison.json',{body:Buffer.from(JSON.stringify({state,reference:'Pinned current Android official hero',pixels:a.width*a.height,changed,ratio,tolerance:0.025})),contentType:'application/json'});expect(ratio).toBeLessThanOrEqual(0.025);
  }
 }finally{await baselineContext.close();}
});
test('four independent rankings send the correct subject and geography filters to the shared server',async({page,request})=>{
 await identity(page);await page.goto('/cuenta.html');await expect(page.getByRole('link',{name:'Continuar mi preparación',exact:false})).toBeVisible();await page.goto('/app/competencia.html#rankings');await expect(page.locator('.ranking-row')).toHaveCount(6);
 const query=async filters=>{const data=await(await request.get('/__qa/state')).json();return data.calls.filter(x=>x.operation==='rankings').map(x=>x.payload).findLast(p=>Object.entries(filters).every(([key,value])=>p[key]===value));};
 // Returning to a category within 60 seconds reuses its verified server result.
 // Check the selected UI and that category's request, rather than requiring a
 // duplicate request to become the latest entry in the transport log.
 for(const[name,mode]of[['Ensayo PAES','exam'],['PAES Express','express'],['Modo juego','game'],['Liga de duelos','duel']]){const button=page.getByRole('button',{name,exact:true});await button.click();await expect(button).toHaveAttribute('aria-pressed','true');await expect(page.locator('.ranking-row')).toHaveCount(6);await expect.poll(()=>query({subject:'M1',mode,scope:'Región',track:''})).toBeTruthy();}
 for(const scope of['Comuna','Región','Chile']){const button=page.getByRole('button',{name:scope,exact:true});await button.click();await expect(button).toHaveAttribute('aria-pressed','true');await expect(page.locator('.ranking-row')).toHaveCount(6);await expect.poll(()=>query({subject:'M1',mode:'duel',scope,track:''})).toBeTruthy();}
 await page.getByRole('button',{name:'Ciencias',exact:true}).click();await page.locator('#science-track').selectOption('Química');await expect(page.locator('#science-track')).toHaveValue('Química');await expect(page.locator('.ranking-row')).toHaveCount(6);await expect.poll(()=>query({subject:'Ciencias',mode:'duel',scope:'Chile',track:'Química'})).toBeTruthy();
});
test('PWA manifest, original icons, signed private cache and logout purge work',async({page,request,context})=>{
 const manifest=await(await request.get('/manifest.webmanifest')).json();expect(manifest.display).toBe('standalone');expect(manifest.icons).toHaveLength(3);for(const icon of manifest.icons)expect((await request.get(icon.src)).status()).toBe(200);
 await enter(page);await page.evaluate(()=>navigator.serviceWorker.ready);await expect.poll(()=>page.evaluate(async()=>[...await caches.keys()].some(k=>k.startsWith('cachaste-license-')))).toBe(true);await expect.poll(()=>page.evaluate(async()=>{const names=(await caches.keys()).filter(k=>k.startsWith('cachaste-private-'));for(const name of names)if((await(await caches.open(name)).keys()).some(r=>r.url.endsWith('/app/daily-catalog.js')))return true;return false;})).toBe(true);await context.setOffline(true);await page.reload();await expect(page.locator('[data-action=pick-course]')).toHaveCount(5);await context.setOffline(false);await page.goto('/cuenta.html');await page.getByRole('button',{name:'Cerrar sesión',exact:true}).click();await expect.poll(()=>page.evaluate(async()=>[...await caches.keys()].filter(k=>k.startsWith('cachaste-private-')||k.startsWith('cachaste-license-')).length)).toBe(0);
});
test('a server-expired subscription denies sync and never opens an unguarded bank',async({page,request})=>{
 await enter(page);await request.post('/__qa/control',{data:{active:false}});const response=await page.evaluate(async()=>{const r=await fetch('/api/progress',{method:'POST',headers:{'x-cachaste-request':'1','content-type':'application/json'},body:JSON.stringify({operation:'snapshot'})});return r.status;});expect(response).toBe(402);await page.goto('/app/inicio.html');await expect(page).toHaveURL(/cuenta.html/);await expect(page.locator('.access-state')).toContainText('Necesitas una suscripción');
});


test('complimentary testers see their expiry and cannot start a subscription; sandbox stays admin-only',async({page,request},info)=>{
 await request.post('/__qa/control',{data:{complimentary:true}});await identity(page);await page.goto('/cuenta.html?qa=mp');
 await expect(page.getByRole('heading',{name:'Tu año gratuito de tester'})).toBeVisible();
 await expect(page.getByText('No tiene renovación automática ni requiere tarjeta.',{exact:false})).toBeVisible();
 for(const button of await page.locator('[data-plan]').all())await expect(button).toBeDisabled();
 await expect(page.locator('#mp-qa')).toHaveCount(0);
 await request.post('/__qa/control',{data:{qaAdmin:true}});await page.reload();
 await expect(page.getByRole('heading',{name:'Checkout Mercado Pago QA'})).toBeVisible();
 await page.getByRole('button',{name:'Verificar configuración y suscripciones'}).click();
 await expect(page.getByText('Falta la firma de webhooks de la aplicación de prueba.',{exact:false})).toBeVisible();
 await page.getByLabel('Correo real de la cuenta compradora de prueba').fill('test_user_synthetic@testuser.com');
 await page.getByLabel('Plan de prueba').selectOption('MONTHLY_TRIAL');
 const posted=page.waitForRequest(r=>r.url().endsWith('/api/billing/sandbox')&&r.postDataJSON()?.action==='checkout');
 await page.route('https://www.mercadopago.cl/subscriptions/checkout?**',route=>route.fulfill({status:200,contentType:'text/html',body:'<h1>Destino de checkout simulado para QA de interfaz</h1>'}));
 await page.screenshot({path:info.outputPath('sandbox-admin-and-complimentary-account.png'),fullPage:true});
 await page.getByRole('button',{name:'Abrir checkout de prueba'}).click();
 const payload=(await posted).postDataJSON();expect(payload.plan).toBe('MONTHLY_TRIAL');expect(payload.payerEmail).toBe('test_user_synthetic@testuser.com');expect(payload.requestId).toMatch(/^[a-f0-9-]{36}$/);
 await expect(page.getByRole('heading',{name:'Destino de checkout simulado para QA de interfaz'})).toBeVisible();
});

test('the admin can obtain and review a sandbox plan link by payer ID',async({page,request})=>{
 await request.post('/__qa/control',{data:{qaAdmin:true}});
 const session=await identity(page);
 const checkoutUrl='https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=synthetic-weekly';
 const payerId='1234567890';
 await page.goto('/cuenta.html?qa=mp');
 const buyer=page.getByLabel('ID de la cuenta compradora de prueba');
 const plan=page.getByLabel('Plan de prueba');
 const link=page.getByRole('link',{name:'Abrir enlace sandbox del plan'});
 const button=page.getByRole('button',{name:'Obtener enlace por ID'});
 await plan.selectOption('WEEKLY');
 await buyer.fill(payerId);
 const posted=page.waitForRequest(r=>r.url().endsWith('/api/billing/sandbox')&&r.method()==='POST');
 await button.click();
 const checkout=await posted;
 expect(checkout.postDataJSON()).toEqual({action:'checkout',plan:'WEEKLY',payerId});
 expect(await checkout.headerValue('authorization')).toBe('Bearer '+session.access_token);
 expect(await checkout.headerValue('x-cachaste-request')).toBe('1');
 await expect(link).toHaveAttribute('href',checkoutUrl);
 await expect(link).toHaveAttribute('target','_blank');
 await expect(page).toHaveURL(/\/cuenta\.html\?qa=mp$/);
 expect(page.context().pages()).toEqual([page]);
 await expect(plan).toHaveValue('WEEKLY');
 await expect(buyer).toHaveValue(payerId);

 await buyer.fill('1234567891');
 await expect(link).toHaveCount(0);
 await page.route('**/api/billing/sandbox',async route=>{
  const response=await route.fetch();
  await route.fulfill({response,json:{...await response.json(),productionEnabled:true}});
 });
 await button.click();
 await expect(page.locator('#account-status')).toContainText('El servidor no devolvió un enlace válido');
 await expect(link).toHaveCount(0);
});

test('the sandbox panel verifies the new payment before allowing reconciliation',async({page,request})=>{
 await request.post('/__qa/control',{data:{qaAdmin:true}});
 await identity(page);
 const payerId='1234567890',paymentId='9876543210';
 await page.goto('/cuenta.html?qa=mp');
 await page.getByLabel('Plan de prueba').selectOption('WEEKLY');
 await page.getByLabel('ID de la cuenta compradora de prueba').fill(payerId);
 await page.getByLabel('ID del pago de prueba').fill(paymentId);
 const lookup=page.getByRole('button',{name:'Verificar pago de prueba'});
 const reconcile=page.getByRole('button',{name:'Conciliar pago de prueba'});
 const sandboxPost=()=>page.waitForRequest(r=>r.url().endsWith('/api/billing/sandbox')&&r.method()==='POST');
 await expect(reconcile).toHaveCount(0);
 const lookedUp=sandboxPost();
 await lookup.click();
 expect((await lookedUp).postDataJSON()).toEqual({action:'plan_payment_lookup',plan:'WEEKLY',payerId,paymentId});
 await expect(page.locator('#mp-qa-payment')).toContainText('synthetic-qa-subscription');
 const sandboxPath='**/api/billing/sandbox';
 await page.route(sandboxPath,route=>route.fulfill({status:403,json:{error:'OWNERSHIP_REQUIRED'}}),{times:1});
 await reconcile.click();
 await expect(page.locator('#account-status')).toContainText('Falta registrar la evidencia de titularidad');
 await expect(reconcile).toHaveCount(0);
 await lookup.click();
 await expect(reconcile).toBeVisible();
 const reconciled=sandboxPost();
 await reconcile.click();
 expect((await reconciled).postDataJSON()).toEqual({action:'plan_payment_reconcile',plan:'WEEKLY',payerId,paymentId});
 await expect(page.locator('#mp-qa-payment')).toContainText('Conciliación sandbox registrada.');

 await page.getByLabel('ID del pago de prueba').fill('9876543211');
 await page.route(sandboxPath,async route=>{
  const response=await route.fetch();
  const data=await response.json();
  await route.fulfill({response,json:{...data,subscription:{...data.subscription,liveMode:true}}});
 });
 await lookup.click();
 await expect(page.locator('#account-status')).toContainText('Mercado Pago no confirmó un pago sandbox elegible');
 await expect(reconcile).toHaveCount(0);
});
