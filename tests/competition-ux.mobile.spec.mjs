import {test,expect} from '@playwright/test';
import {fixturePage,actor,duel,dashboard,finished} from './helpers/competition-fixtures.mjs';

async function startDuel(page){
 await page.goto('./competencia.html#duelos');
 await page.getByRole('button',{name:'Desafiar',exact:true}).click();
 await page.getByRole('textbox',{name:'Nickname',exact:true}).fill('CataPAES');
 await page.getByRole('button',{name:'Enviar desafío',exact:true}).click();
 await page.getByRole('button',{name:'Comenzar duelo',exact:true}).click();
 await expect(page.locator('.question-meta strong')).toContainText('1/10');
}

test('League details opens the duel ranking for the selected subject',async({page})=>{
 const calls=await fixturePage(page);await page.goto('./competencia.html#duelos');
 await page.getByRole('button',{name:'M2',exact:true}).click();
 await page.locator('.league-panel').getByRole('link',{name:/Ver detalles/}).click();
 await expect(page.getByRole('button',{name:'Liga de duelos',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect.poll(()=>calls.filter(c=>c.operation==='rankings').at(-1)?.payload).toMatchObject({mode:'duel',subject:'M2'});
});

test('The illustrated review card opens the settled duel tutor',async({page})=>{
 const calls=await fixturePage(page);
 await page.addInitScript(({owner,id})=>localStorage.setItem('cachaste-competition-v1:'+owner+':duel',id),{owner:actor.id,id:duel().id});
 await page.route('**/rest/v1/rpc/cachaste_competition',async route=>{
  if(route.request().postDataJSON().operation==='duel')await route.fulfill({json:finished()});else await route.fallback();
 });
 await page.goto('./competencia.html#resultado');
 await page.getByRole('link',{name:'Revisar errores del duelo',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Ahora sí, cachémoslo',exact:true})).toBeVisible();
 expect(calls.filter(c=>c.operation==='review')).toHaveLength(1);
});

test('A duplicate nickname retains all profile edits and identifies the field to correct',async({page},info)=>{
 const calls=await fixturePage(page);let saves=0;
 await page.route('**/rest/v1/rpc/cachaste_competition',async route=>{
  if(route.request().postDataJSON().operation==='save_profile'&&++saves===1)await route.fulfill({status:409,json:{code:'23505',message:'duplicate key value violates unique constraint profiles_nickname'}});else await route.fallback();
 });
 await page.goto('./competencia.html#perfil');
 await page.getByLabel('Nickname público',{exact:true}).fill('NuevoGato');
 await page.locator('#profile-region').selectOption('13');await page.locator('#profile-commune').selectOption('13101');
 await page.locator('.avatar-collection summary').click();await page.getByRole('radio',{name:'Gatita fotógrafa',exact:true}).check();
 await page.locator('[name=publicRanking]').uncheck();await page.locator('[name=showCommune]').uncheck();
 await page.getByRole('button',{name:'Guardar mi perfil',exact:true}).click();
 await expect(page.locator('#profile-form-error')).toContainText('nickname');
 await expect(page.getByLabel('Nickname público',{exact:true})).toHaveValue('NuevoGato');
 await expect(page.getByLabel('Nickname público',{exact:true})).toHaveAttribute('aria-invalid','true');
 await expect(page.getByLabel('Nickname público',{exact:true})).toBeFocused();
 await expect(page.locator('#profile-region')).toHaveValue('13');await expect(page.locator('#profile-commune')).toHaveValue('13101');
 await expect(page.getByRole('radio',{name:'Gatita fotógrafa',exact:true})).toBeChecked();
 await expect(page.locator('[name=publicRanking]')).not.toBeChecked();await expect(page.locator('[name=showCommune]')).not.toBeChecked();
 await page.screenshot({path:info.outputPath('recoverable-profile-error.png'),fullPage:true});
 await page.getByLabel('Nickname público',{exact:true}).fill('NuevoGato2');await page.getByRole('button',{name:'Guardar mi perfil',exact:true}).click();
 await expect(page.locator('.toast')).toHaveText('Tu perfil quedó guardado.');
 expect(calls.filter(c=>c.operation==='save_profile').at(-1).payload).toMatchObject({nickname:'NuevoGato2',avatar:23,communeCode:'13101',publicRanking:false,showCommune:false});
});

test('An unavailable rival preserves the typed nickname inside the invitation dialog',async({page})=>{
 await fixturePage(page);let attempts=0;
 await page.route('**/rest/v1/rpc/cachaste_competition',async route=>{
  if(route.request().postDataJSON().operation==='create_duel'&&++attempts===1)await route.fulfill({status:400,json:{code:'P0001',message:'RIVAL_UNAVAILABLE'}});else await route.fallback();
 });
 await page.goto('./competencia.html#duelos');await page.getByRole('button',{name:'Desafiar',exact:true}).click();
 await page.getByRole('textbox',{name:'Nickname',exact:true}).fill('CataPAES');await page.getByRole('button',{name:'Enviar desafío',exact:true}).click();
 await expect(page.locator('dialog')).toBeVisible();await expect(page.locator('dialog [role=alert]')).toContainText('no está disponible');
 await expect(page.getByRole('textbox',{name:'Nickname',exact:true})).toHaveValue('CataPAES');
 await page.getByRole('button',{name:'Enviar desafío',exact:true}).click();await expect(page.getByRole('heading',{name:'Duelo PAES',exact:true})).toBeVisible();
});

test('A slow invitation shows progress and prevents duplicate submissions',async({page})=>{
 await fixturePage(page);let release,calls=0;const wait=new Promise(resolve=>{release=resolve;});
 await page.route('**/rest/v1/rpc/cachaste_competition',async route=>{
  if(route.request().postDataJSON().operation==='create_duel'){calls++;await wait;await route.fulfill({json:duel()});}else await route.fallback();
 });
 try{
  await page.goto('./competencia.html#duelos');await page.getByRole('button',{name:'Desafiar',exact:true}).click();await page.getByRole('textbox',{name:'Nickname',exact:true}).fill('CataPAES');await page.getByRole('button',{name:'Enviar desafío',exact:true}).click();
  await expect(page.locator('#competition-root')).toHaveAttribute('aria-busy','true');await expect(page.locator('dialog [data-busy-message]')).toBeVisible();await expect(page.getByRole('button',{name:'Enviar desafío',exact:true})).toBeDisabled();
  await page.locator('#invite-form').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));expect(calls).toBe(1);release();
  await expect(page.getByRole('heading',{name:'Duelo PAES',exact:true})).toBeVisible();await expect(page.locator('#competition-progress')).not.toBeVisible();await expect(page.locator('#competition-root')).toHaveAttribute('aria-busy','false');
 }finally{release();}
});

test('An unsent choice survives offline, reconnect and reload but never moves to the next question',async({page,context})=>{
 const calls=await fixturePage(page);await startDuel(page);await page.getByRole('radio').nth(1).check();
 await context.setOffline(true);await expect(page.getByRole('radio').nth(1)).toBeChecked();await context.setOffline(false);
 await expect(page.locator('#competition-root')).toHaveAttribute('aria-busy','false');await expect(page.getByRole('radio').nth(1)).toBeChecked();
 await page.reload();await expect(page.getByRole('radio').nth(1)).toBeChecked();await page.getByRole('button',{name:'Enviar respuesta',exact:true}).click();
 await expect(page.locator('.question-meta strong')).toContainText('2/10');await expect(page.locator('#competitive-answer input:checked')).toHaveCount(0);
 expect(calls.filter(c=>c.operation==='answer')).toHaveLength(1);expect(calls.find(c=>c.operation==='answer').payload.choice).toBe(1);
});

test('An unchanged lobby refresh retains the actual focused control and prioritizes invitations',async({page})=>{
 await page.clock.install();const calls=await fixturePage(page);await page.goto('./competencia.html#duelos');await expect(page.locator('.duel-row')).toHaveCount(2);
 await expect(page.locator('.duel-row').first()).toContainText('te desafió');await expect(page.locator('.next-duel')).toContainText('1 desafío pendiente');await expect(page.locator('.invitation-count')).toHaveText('1');
 const bell=page.getByRole('button',{name:'Invitaciones pendientes',exact:true});await bell.focus();await bell.evaluate(el=>window.qaBell=el);const before=calls.filter(c=>c.operation==='dashboard').length;
 await page.clock.fastForward(21000);await expect.poll(()=>calls.filter(c=>c.operation==='dashboard').length).toBeGreaterThan(before);await expect(bell).toBeFocused();expect(await bell.evaluate(el=>el===window.qaBell)).toBe(true);
});

test('A changed lobby refresh preserves focus; invitation actions remain visible above the fixed navigation',async({page},info)=>{
 await page.clock.install();await fixturePage(page);let calls=0;
 await page.route('**/rest/v1/rpc/cachaste_competition',async route=>{
  if(route.request().postDataJSON().operation==='dashboard'){calls++;const data=dashboard();if(calls>1)data.history.wins=42;await route.fulfill({json:data});}else await route.fallback();
 });
 await page.goto('./competencia.html#duelos');await expect(page.locator('.duel-row')).toHaveCount(2);await page.getByRole('button',{name:'Jugar ahora',exact:true}).focus();await page.clock.fastForward(21000);
 await expect(page.locator('.league-panel .stat-grid')).toContainText('42');await expect(page.getByRole('button',{name:'Jugar ahora',exact:true})).toBeFocused();
 await page.locator('.next-duel').getByRole('button',{name:'Ver desafío',exact:true}).click();await expect(page.getByRole('button',{name:'Aceptar',exact:true})).toBeFocused();
 const box=await page.getByRole('button',{name:'Aceptar',exact:true}).boundingBox(),nav=await page.locator('.comp-nav').boundingBox();expect(box.y+box.height).toBeLessThanOrEqual(nav.y+1);
 expect(await page.locator('.circle-button:visible').evaluateAll(nodes=>nodes.every(el=>{const r=el.getBoundingClientRect();return r.width>=47.5&&r.height>=47.5;}))).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.screenshot({path:info.outputPath('pending-duel-focus.png'),fullPage:true});
});
