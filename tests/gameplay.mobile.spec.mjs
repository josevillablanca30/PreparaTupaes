import {test,expect} from '@playwright/test';

test('El clon MIT inspira un minijuego funcional: ordenar, equivocarse, corregir, retomar y resolver PAES',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('./inicio.html#courses');
 await page.locator('[data-action=pick-course][data-subject=M1]').click();await page.waitForURL(/#(?:tracks|modes|home)$/);if(await page.evaluate(()=>location.hash==='#modes')){await page.locator('[data-action=game-mode]').click();await page.locator('.mode-picker').waitFor({state:'detached'});}
 await page.evaluate(()=>{
  const e=CachasteDailyApp.engine;
  e.start('M1',2,'lesson','Descuento porcentual');
  location.hash='#session';CachasteDailyApp.render();
 });
 await expect(page.locator('.didactic-overview')).toBeVisible();
 await expect(page.locator('.didactic-key')).toContainText('Idea clave');
 await page.locator('[data-action=intro-next]').click();
 await expect(page.locator('.teacher-step')).toBeVisible();
 while(await page.locator('[data-action=intro-next]').count())await page.locator('[data-action=intro-next]').click();
 await expect(page.locator('[data-action=start-arcade]')).toBeVisible();
 await page.locator('[data-action=start-arcade]').click();
 await expect(page.locator('.arcade-session')).toBeVisible();
 await expect(page.locator('.arcade-tile')).toHaveCount(3);
 await expect(page.locator('.arcade-session .cat-frame')).toHaveCount(1);
 const original=await page.evaluate(()=>CachasteDailyApp.engine.state.session.arcade);
 const ordered=original.order.map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v).map(x=>x.i);
 const wrong=original.order.map((_,i)=>i);
 expect(wrong).not.toEqual(ordered);
 for(const index of wrong)await page.locator('.arcade-tile[data-index="'+index+'"]').click();
 await expect(page.locator('.arcade-chosen li')).toHaveCount(3);
 await page.reload();
 await expect(page.locator('.arcade-session')).toBeVisible();
 await expect(page.locator('.arcade-chosen li')).toHaveCount(3);
 await page.locator('[data-action=arcade-check]').click();
 await expect(page.locator('.arcade-feedback.retry')).toBeVisible();
 await page.locator('[data-action=arcade-retry]').click();
 for(const index of ordered)await page.locator('.arcade-tile[data-index="'+index+'"]').click();
 await page.locator('[data-action=arcade-check]').click();
 await expect(page.locator('.arcade-feedback.correct')).toBeVisible();
 await expect(page.locator('[data-action=begin-question]')).toHaveCount(1);
 await expect(page.locator('.arcade-tile').first()).not.toHaveAttribute('aria-label',/Elegir paso/);
 await test.info().attach('reto-razonamiento-PAES',{body:await page.screenshot({fullPage:true,animations:'disabled'}),contentType:'image/png'});
 expect(await page.evaluate(()=>CachasteDailyApp.engine.state.attempts.length)).toBe(0);
 await page.locator('[data-action=begin-question]').first().click();
 await expect(page.locator('.question-title')).toBeVisible();
 expect(await page.evaluate(()=>CachasteDailyApp.engine.state.session.stage)).toBe('question');
 expect(errors).toEqual([]);
});
test('El estudiante puede saltarse el minijuego y la prueba de dominio no se modifica',async({page})=>{
 await page.goto('./inicio.html#courses');
 await page.locator('[data-action=pick-course][data-subject=M1]').click();await page.waitForURL(/#(?:tracks|modes|home)$/);if(await page.evaluate(()=>location.hash==='#modes')){await page.locator('[data-action=game-mode]').click();await page.locator('.mode-picker').waitFor({state:'detached'});}
 await page.evaluate(()=>{CachasteDailyApp.engine.start('M1',2,'lesson','Descuento porcentual');location.hash='#session';CachasteDailyApp.render()});
 while(await page.locator('[data-action=intro-next]').count())await page.locator('[data-action=intro-next]').click();
 await page.locator('[data-action=begin-question]').first().click();
 await expect(page.locator('.question-title')).toBeVisible();
 expect(await page.evaluate(()=>CachasteDailyApp.engine.state.session.arcade)).toBeUndefined();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 expect(overflow).toBeLessThanOrEqual(1);
});
