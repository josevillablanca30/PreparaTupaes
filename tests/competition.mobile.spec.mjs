import{test,expect}from'@playwright/test';
import{fixturePage,session,duel,finished}from'./helpers/competition-fixtures.mjs';
import{dailyCatalog}from'../scripts/daily-catalog.mjs';

async function layout(page){
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await expect(page.locator('#competition-root')).toHaveAttribute('aria-busy','false');
 expect(await page.locator('#competition-root button:visible').evaluateAll(nodes=>nodes.map(n=>({label:n.getAttribute('aria-label')||n.textContent,height:n.getBoundingClientRect().height})).filter(n=>n.height<47.5))).toEqual([]);
 await expect.poll(()=>page.locator('img').evaluateAll(nodes=>nodes.every(n=>n.complete&&n.naturalWidth>0))).toBe(true);
 const nav=await page.locator('.comp-nav').boundingBox();expect(nav.y+nav.height).toBeLessThanOrEqual(await page.evaluate(()=>innerHeight)+1);
}
test('Rankings: four modalities, three locations, five subjects and real empty state without authentication',async({page})=>{
 await page.goto('./competencia.html#rankings');await expect(page.getByRole('heading',{name:'Rankings',exact:true})).toBeVisible();await expect(page.getByRole('group',{name:'Modalidad de ranking'}).getByRole('button')).toHaveCount(4);await expect(page.getByRole('group',{name:'Ubicación del ranking'}).getByRole('button')).toHaveCount(3);await expect(page.getByRole('group',{name:'Asignatura'}).getByRole('button')).toHaveCount(5);
 await expect(page.getByText('Todavía no hay resultados en esta categoría',{exact:true})).toBeVisible();await expect(page.getByText('CataPAES',{exact:true})).toHaveCount(0);await layout(page);
});
test('Approved ranking composition uses isolated fixtures; filters send comparable category and geography',async({page},info)=>{
 const requests=await fixturePage(page);await page.goto('./competencia.html#rankings');await expect(page.locator('.ranking-row')).toHaveCount(6);await layout(page);await page.screenshot({path:info.outputPath('competition-rankings.png'),fullPage:true});
 await page.getByRole('button',{name:'Chile',exact:true}).click();await expect.poll(()=>requests.filter(r=>r.operation==='rankings').at(-1)?.payload.scope).toBe('Chile');
 await page.getByRole('button',{name:'Ciencias',exact:true}).click();await page.locator('#science-track').selectOption('Química');await expect.poll(()=>requests.filter(r=>r.operation==='rankings').at(-1)?.payload.track).toBe('Química');
 await page.getByRole('button',{name:'Liga de duelos',exact:true}).click();await expect.poll(()=>requests.filter(r=>r.operation==='rankings').at(-1)?.payload.mode).toBe('duel');
});
test('Duelos and VS preserve the approved cards, original art, touch targets and verified opponent data',async({page},info)=>{
 await fixturePage(page);await page.goto('./competencia.html#duelos');await expect(page.locator('.duel-row')).toHaveCount(2);await layout(page);await page.screenshot({path:info.outputPath('competition-duelos.png'),fullPage:true});
 await page.getByRole('button',{name:'Desafiar',exact:true}).click();await page.getByRole('textbox',{name:'Nickname',exact:true}).fill('CataPAES');await page.getByRole('button',{name:'Enviar desafío',exact:true}).click();await expect(page.getByRole('heading',{name:'Duelo PAES',exact:true})).toBeVisible();await expect(page.locator('.versus-player h2')).toHaveText(['JoséPAES','CataPAES']);await expect(page.getByText('11 estrellas competitivas',{exact:true})).toBeVisible();await layout(page);await page.screenshot({path:info.outputPath('competition-vs.png'),fullPage:true});
});
for(const outcome of['win','loss','draw'])test('Ten-question turn and '+outcome+' result; educational review opens only after settlement',async({page},info)=>{
 const requests=await fixturePage(page,{outcome});await page.goto('./competencia.html#duelos');await expect(page.locator('.duel-row')).toHaveCount(2);await page.getByRole('button',{name:'Desafiar',exact:true}).click();await page.getByRole('textbox',{name:'Nickname',exact:true}).fill('CataPAES');await page.getByRole('button',{name:'Enviar desafío',exact:true}).click();await page.getByRole('button',{name:'Comenzar duelo',exact:true}).click();
 for(let i=0;i<10;i++){await expect(page.locator('.question-meta strong')).toContainText((i+1)+'/10');await expect(page.getByText('Respuesta:',{exact:false})).toHaveCount(0);await page.getByRole('radio').nth(1).check();await page.getByRole('button',{name:'Enviar respuesta',exact:true}).click();}
 await expect(page.getByRole('heading',{name:'Resultado del duelo',exact:false})).toBeVisible();expect(requests.filter(r=>r.operation==='answer')).toHaveLength(10);expect(requests.filter(r=>r.operation==='answer').every(r=>!('elapsedMs'in r.payload)&&!('score'in r.payload))).toBe(true);await layout(page);await page.screenshot({path:info.outputPath('competition-result-'+outcome+'.png'),fullPage:true});
 await page.getByRole('button',{name:'Ver explicación de errores',exact:false}).click();await expect(page.getByRole('heading',{name:'Ahora sí, cachémoslo',exact:true})).toBeVisible();await page.getByRole('button',{name:'Más fácil',exact:true}).click();await expect(page.getByText('Imagina dos lápices y luego agrega tres.',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Otro ejemplo',exact:true}).click();await expect(page.getByText('Con cuatro lápices y uno más también tienes cinco.',{exact:true})).toBeVisible();
});
test('No Premium from user metadata; disconnecting keeps education accessible and competition closed',async({page,context})=>{
 await fixturePage(page,{premium:false,metadata:{premium:true,subscriptionValid:true}});await page.goto('./competencia.html#duelos');await expect(page.getByText('Tu acceso todavía no tiene una suscripción validada.',{exact:false})).toBeVisible();await page.getByRole('button',{name:'Desafiar',exact:true}).click();await expect(page.locator('dialog')).not.toBeVisible();
 await context.setOffline(true);await expect(page.getByText('Estás sin conexión',{exact:true})).toBeVisible();await expect(page.getByRole('link',{name:'Volver a estudiar',exact:true})).toHaveAttribute('href','inicio.html#courses');await context.setOffline(false);
});
test('Profile uses nickname separate from login, opt-in privacy and all official regions and communes',async({page})=>{
 const requests=await fixturePage(page);await page.goto('./competencia.html#perfil');await expect(page.locator('#profile-region option')).toHaveCount(17);await page.locator('#profile-region').selectOption('13');await page.locator('#profile-commune').selectOption('13101');await page.getByLabel('Participar voluntariamente',{exact:false}).uncheck();await page.getByRole('button',{name:'Guardar mi perfil',exact:true}).click();await expect.poll(()=>requests.filter(r=>r.operation==='save_profile').at(-1)?.payload.communeCode).toBe('13101');const payload=requests.find(r=>r.operation==='save_profile').payload;expect(payload.publicRanking).toBe(false);expect(payload).not.toHaveProperty('email');expect(payload).not.toHaveProperty('premium');await layout(page);
});
test('Home links competition without replacing the five subjects or existing learning progression',async({page})=>{
 await page.goto('./inicio.html#courses');await expect(page.locator('[data-action=pick-course]')).toHaveCount(5);await page.getByRole('link',{name:'Duelos',exact:true}).click();await expect(page.getByRole('heading',{name:'Duelos',exact:true})).toBeVisible();await page.getByRole('link',{name:'Inicio',exact:true}).click();await expect(page.locator('[data-action=pick-course]')).toHaveCount(5);
});
test('A lost response retries its receipt once, reconnects and recovers the same server position after reload',async({page,context})=>{
 const requests=await fixturePage(page,{failAnswerOnce:true});await page.goto('./competencia.html#duelos');await expect(page.locator('.duel-row')).toHaveCount(2);await page.getByRole('button',{name:'Desafiar',exact:true}).click();await page.getByRole('textbox',{name:'Nickname',exact:true}).fill('CataPAES');await page.getByRole('button',{name:'Enviar desafío',exact:true}).click();await page.getByRole('button',{name:'Comenzar duelo',exact:true}).click();await page.getByRole('radio').nth(1).check();await page.getByRole('button',{name:'Enviar respuesta',exact:true}).click();await expect(page.getByRole('button',{name:'Reintentar respuesta pendiente',exact:true})).toBeVisible();
 await context.setOffline(true);await context.setOffline(false);await expect(page.locator('.question-meta strong')).toContainText('2/10');const answers=requests.filter(r=>r.operation==='answer');expect(answers.length).toBe(2);expect(answers[0].payload.requestId).toBe(answers[1].payload.requestId);
 await page.reload();await expect(page.locator('.question-meta strong')).toContainText('2/10');expect(requests.filter(r=>r.operation==='start').length).toBe(1);
});
test('Reload after a saved but unconfirmed response never sends the previous choice for the next question',async({page})=>{
 const requests=await fixturePage(page,{failAnswerOnce:true});await page.goto('./competencia.html#duelos');await expect(page.locator('.duel-row')).toHaveCount(2);await page.getByRole('button',{name:'Desafiar',exact:true}).click();await page.getByRole('textbox',{name:'Nickname',exact:true}).fill('CataPAES');await page.getByRole('button',{name:'Enviar desafío',exact:true}).click();await page.getByRole('button',{name:'Comenzar duelo',exact:true}).click();await page.getByRole('radio').nth(1).check();await page.getByRole('button',{name:'Enviar respuesta',exact:true}).click();await expect(page.getByRole('button',{name:'Reintentar respuesta pendiente',exact:true})).toBeVisible();
 await page.reload();await expect(page.locator('.question-meta strong')).toContainText('2/10');await expect(page.getByRole('button',{name:'Reintentar respuesta pendiente',exact:true})).not.toBeVisible();await page.getByRole('radio').nth(0).check();await page.getByRole('button',{name:'Enviar respuesta',exact:true}).click();await expect(page.locator('.question-meta strong')).toContainText('3/10');
 const answers=requests.filter(r=>r.operation==='answer');expect(answers).toHaveLength(2);expect(answers[0].payload.choice).toBe(1);expect(answers[1].payload.choice).toBe(0);expect(answers[1].payload.position).toBe(1);
});
test('Privacy deletion remains available when a subscription is no longer valid',async({page})=>{
 const requests=await fixturePage(page,{premium:false});await page.goto('./competencia.html#perfil');await page.getByRole('button',{name:'Borrar mi perfil público',exact:true}).click();await page.getByRole('button',{name:'Borrar perfil',exact:true}).click();await expect.poll(()=>requests.some(r=>r.operation==='delete_profile')).toBe(true);
});
test('A verified SDK recovery event opens password renewal, then clears the session after saving',async({page})=>{
 await fixturePage(page,{signed:false,premium:false});const s=session(),hash=new URLSearchParams({access_token:s.access_token,refresh_token:s.refresh_token,type:'recovery',expires_in:'3600',token_type:'bearer'});
 await page.goto('./competencia.html#'+hash);await expect(page.getByRole('heading',{name:'Crea tu nueva contraseña',exact:true})).toBeVisible();await expect(page.locator('.auth-panel')).toContainText('ui-fixture@example.invalid');
 await page.getByLabel('Nueva contraseña',{exact:true}).fill('Nueva-clave-segura-2026');await page.getByLabel('Repite la nueva contraseña',{exact:true}).fill('Nueva-clave-segura-2026');await page.getByRole('button',{name:'Guardar nueva contraseña',exact:true}).click();await expect(page.getByText('Contraseña actualizada.',{exact:false})).toBeVisible();await expect(page.getByRole('heading',{name:'Entra a tu cuenta',exact:true})).toBeVisible();expect(await page.evaluate(()=>localStorage.getItem('cachaste-auth-v1'))).toBe(null);expect(page.url()).not.toContain('access_token');
});
test('Recovery requests mail without validating the login password and verifies it inside Android',async({page})=>{
 await fixturePage(page,{signed:false});let reset=0,verified=0;
 await page.route('**/auth/v1/recover',async route=>{reset++;expect(route.request().postDataJSON().email).toBe('ui-fixture@example.invalid');await route.fulfill({json:{}});});
 await page.route('**/auth/v1/verify',async route=>{verified++;expect(route.request().postDataJSON().type).toBe('recovery');await route.fulfill({json:session()});});
 await page.goto('./competencia.html#perfil');await page.getByLabel('Correo de acceso',{exact:true}).fill('ui-fixture@example.invalid');await page.getByRole('button',{name:'Recuperar contraseña',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Recupera tu contraseña',exact:true})).toBeVisible();expect(reset).toBe(1);
 await page.getByLabel('Enlace o código del correo').fill('123456');await page.getByRole('button',{name:'Verificar correo',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Crea tu nueva contraseña',exact:true})).toBeVisible();expect(verified).toBe(1);
});
test('Signup submits only its own fields, confirms mail and persists the new session after reload',async({page})=>{
 await fixturePage(page,{signed:false});let registrations=0,verifications=0;
 await page.route('**/auth/v1/signup',async route=>{registrations++;const body=route.request().postDataJSON();expect(body.email).toBe('ui-fixture@example.invalid');expect(body.password).toBe('Nueva-clave-segura-2026');await route.fulfill({json:session().user});});
 await page.route('**/auth/v1/verify',async route=>{verifications++;await route.fulfill({json:session()});});
 await page.goto('./competencia.html#perfil');await page.getByRole('button',{name:'Crear cuenta',exact:true}).click();await page.getByLabel('Correo de acceso',{exact:true}).fill('ui-fixture@example.invalid');await page.getByLabel('Contraseña nueva',{exact:true}).fill('Nueva-clave-segura-2026');await page.getByRole('button',{name:'Crear cuenta',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Confirma tu correo',exact:true})).toBeVisible();expect(registrations).toBe(1);
 await page.getByLabel('Enlace o código del correo').fill('https://jmobinmdwrmdqrxtcruj.supabase.co/auth/v1/verify?type=signup&token='+ 'a'.repeat(64));await page.getByRole('button',{name:'Verificar correo',exact:true}).click();
 await expect(page.locator('#profile-form')).toBeVisible();expect(verifications).toBe(1);await page.reload();await expect(page.locator('#profile-form')).toBeVisible();
 await page.getByRole('button',{name:'Cerrar sesión',exact:true}).click();await expect(page.locator('#auth-form')).toBeVisible();expect(await page.evaluate(()=>localStorage.getItem('cachaste-auth-v1'))).toBe(null);
});
test('Auth failures explain unconfirmed mail and incorrect passwords; dialog errors remain visible',async({page})=>{
 await fixturePage(page,{signed:false});await page.route('**/auth/v1/token**',route=>route.fulfill({status:400,headers:{'x-supabase-api-version':'2024-01-01'},json:{code:'email_not_confirmed',msg:'Email not confirmed'}}));
 await page.goto('./competencia.html#perfil');await page.getByLabel('Correo de acceso',{exact:true}).fill('ui-fixture@example.invalid');await page.getByLabel('Contraseña',{exact:true}).fill('an-old-pass');await page.getByRole('button',{name:'Iniciar sesión',exact:true}).click();await expect(page.getByText('Confirma tu correo antes de iniciar sesión.',{exact:true})).toBeVisible();
 await page.getByLabel('Correo de acceso',{exact:true}).fill('ui-fixture@example.invalid');await page.getByRole('button',{name:'Confirmar mi correo',exact:true}).click();await page.getByLabel('Enlace o código del correo').fill('https://evil.invalid/?token=secret');await page.getByRole('button',{name:'Verificar correo',exact:true}).click();await expect(page.locator('dialog [role=alert]')).toContainText('Pega el enlace');
});
test('Competitive questions retain all five original types of required graph and geometry stimulus',async({page},info)=>{
 const examples=[...new Map(dailyCatalog().items.filter(q=>q.visual).map(q=>[q.visual.type,q.visual])).values()],visual={};await fixturePage(page,{visual});
 for(const v of examples){for(const key of Object.keys(visual))delete visual[key];Object.assign(visual,v);await page.goto('./competencia.html#duelos');await expect(page.locator('.duel-row')).toHaveCount(2);await page.getByRole('button',{name:'Desafiar',exact:true}).click();await page.getByRole('textbox',{name:'Nickname',exact:true}).fill('CataPAES');await page.getByRole('button',{name:'Enviar desafío',exact:true}).click();await page.getByRole('button',{name:'Comenzar duelo',exact:true}).click();await expect(page.locator('.question-visual svg')).toBeVisible();await expect(page.locator('.question-visual figcaption')).toHaveText(v.caption);await layout(page);await page.screenshot({path:info.outputPath('competition-stimulus-'+v.type+'.png'),fullPage:true});}
 expect(examples).toHaveLength(5);
});

test('Settled duel invalidates the league cache immediately',async({page})=>{
 const requests=await fixturePage(page);
 await page.goto('./competencia.html#rankings');
 await page.getByRole('button',{name:'Liga de duelos',exact:true}).click();
 await expect.poll(()=>requests.filter(r=>r.operation==='rankings'&&r.payload.mode==='duel').length).toBe(1);
 await page.locator('.comp-nav').getByRole('link',{name:'Duelos',exact:true}).click();
 await page.getByRole('button',{name:'Desafiar',exact:true}).click();
 await page.getByRole('textbox',{name:'Nickname',exact:true}).fill('CataPAES');
 await page.getByRole('button',{name:'Enviar desafío',exact:true}).click();
 await page.getByRole('button',{name:'Comenzar duelo',exact:true}).click();
 for(let i=0;i<10;i++){
  await expect(page.locator('.question-meta strong')).toContainText((i+1)+'/10');
  await page.getByRole('radio').nth(1).check();
  await page.getByRole('button',{name:'Enviar respuesta',exact:true}).click();
 }
 await expect(page.getByRole('heading',{name:'Resultado del duelo',exact:false})).toBeVisible();
 await page.evaluate(()=>{location.hash='rankings';});
 await expect.poll(()=>requests.filter(r=>r.operation==='rankings'&&r.payload.mode==='duel').length).toBe(2);
});

test('Returning to a waiting duel retrieves the rival result from the server',async({page})=>{
 await fixturePage(page);
 let rivalFinished=false;
 await page.route('**/rest/v1/rpc/cachaste_competition',async route=>{
  if(route.request().postDataJSON()?.operation!=='duel')return route.fallback();
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(rivalFinished?finished():duel())});
 });
 await page.goto('./competencia.html#duelos');
 await page.getByRole('button',{name:'Desafiar',exact:true}).click();
 await page.getByRole('textbox',{name:'Nickname',exact:true}).fill('CataPAES');
 await page.getByRole('button',{name:'Enviar desafío',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Duelo PAES',exact:true})).toBeVisible();
 rivalFinished=true;
 await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
 await expect(page.getByRole('heading',{name:'Resultado del duelo',exact:false})).toBeVisible();
});

test('Registration opens its own form without validating empty login fields',async({page})=>{
 await page.goto('./competencia.html#perfil');
 await expect(page.getByRole('heading',{name:'Entra a tu cuenta'})).toBeVisible();
 await page.getByRole('button',{name:'Crear cuenta'}).click();
 await expect(page.locator('#signup-form')).toBeVisible();
 await expect(page.locator('#auth-form')).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Ya tengo cuenta'})).toBeVisible();
 await expect(page.locator('#signup-form input[name="email"]')).toHaveAttribute('required','');
 await page.getByRole('button',{name:'Ya tengo cuenta'}).click();
 await expect(page.locator('#auth-form')).toBeVisible();
});
