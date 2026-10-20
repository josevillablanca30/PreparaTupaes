import {test,expect} from '@playwright/test';
async function game(page,subject='M1'){
 await page.goto('./inicio.html#courses');await page.locator('[data-action=pick-course][data-subject="'+subject+'"]').click();if(subject==='Ciencias')await page.locator('[data-track=Biología]').click();await page.locator('[data-action=game-mode]').click();await expect(page.locator('.adventure-world')).toBeVisible();
}
test('Mapa: camino curvo, gato oficial y portal bloqueado hasta aprender',async({page})=>{
 await game(page);const mission=page.locator('.trail-stop.current .trail-node');await expect(mission).toBeInViewport({ratio:1});await expect(page.locator('.world-quest-banner')).toBeHidden();const world=page.locator('.adventure-world');await expect(world.locator('.trail-stop.current')).toHaveCount(1);await expect(page.locator('.reference-map-guide .cat-frame img')).toHaveAttribute('src','assets/gatito-sabio-poses-v2.webp');expect(await world.locator('.road-track').getAttribute('d')).toMatch(/^M \d+ \d+ C /);await expect(world.locator('.world-gate')).toHaveClass(/gate-distant/);await expect(world.locator('.world-gate [data-action=next-stage]')).toHaveCount(0);
 await page.locator('.stage-banner [data-action=units]').click();await expect(page.locator('.ordered-stages button').first()).toBeEnabled();await expect(page.locator('.ordered-stages button').nth(1)).toBeDisabled();await expect(page.locator('.ordered-stages button').last()).toBeDisabled();
});
test('Las asignaturas conservan su mundo y Ciencias conserva la mención al reabrir',async({page})=>{
 for(const [subject,kind]of [['M1','numbers'],['M2','cosmic'],['Lectura','reading'],['Historia','history'],['Ciencias','science']]){await game(page,subject);await expect(page.locator('.adventure-world')).toHaveClass(new RegExp('world-'+kind));}
 await page.reload();await expect(page.locator('.game-toolbar')).toContainText('Biología');
});
test('Dos comprobaciones independientes abren el portal; los XP solos no lo abren',async({page})=>{
 await game(page);await page.evaluate(()=>{const e=CachasteDailyApp.engine,p=CachasteProgression.route(CACHASTE_DAILY_CATALOG.items,'M1',null,e.profile('M1')),u=p.units[0];e.state.stages||={};e.state.stages.M1=u.axis+'|'+u.name;e.state.days['2026-10-20']={keys:[],xp:10000};e.save();CachasteDailyApp.render();});await expect(page.locator('.world-gate')).toHaveClass(/gate-distant/);
 await page.evaluate(()=>{const e=CachasteDailyApp.engine,p=CachasteProgression.route(CACHASTE_DAILY_CATALOG.items,'M1',null,e.profile('M1'));for(const l of p.levels.slice(0,5)){e.start('M1',2,'free',l.objective);while(e.state.session){const s=e.state.session,q=e.byKey.get(s.keys[s.index]);e.answer(q.answer,'seguro');e.next();}}CachasteDailyApp.render();});
 await expect(page.locator('.world-gate')).toHaveClass(/gate-ready/);await page.locator('.world-gate [data-action=next-stage]').click();await expect(page.locator('.trail-stop.current')).toContainText(await page.evaluate(()=>CachasteProgression.route(CACHASTE_DAILY_CATALOG.items,'M1',null,CachasteDailyApp.engine.profile('M1')).current.objective));await expect(page.locator('.trail-stop.current')).toHaveCount(1);
});
test('El refuerzo de prerrequisitos conserva su sesión sin abrir las etapas principales',async({page})=>{
 await game(page);await page.locator('.stage-banner [data-action=units]').click();await page.locator('[data-stage=basics]').click();await expect(page.locator('.adventure-world')).toHaveClass(/world-foundation/);await page.locator('.trail-stop.current .trail-node').click();await page.locator('[data-action=basic-start]').click();await page.locator('[data-action=basic-forward]').click();const before=await page.evaluate(()=>JSON.stringify(CachasteDailyApp.engine.state.foundationDraft));await page.reload();expect(await page.evaluate(()=>JSON.stringify(CachasteDailyApp.engine.state.foundationDraft))).toBe(before);await expect(page.locator('.teacher-step')).toBeVisible();
});
test('Mapa accesible con movimiento reducido y sin desbordes',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await game(page);await expect(page.locator('.world-cloud').first()).toHaveCSS('animation-name','none');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await test.info().attach('mapa-secuencial',{body:await page.screenshot({fullPage:true,animations:'disabled'}),contentType:'image/png'});
});
