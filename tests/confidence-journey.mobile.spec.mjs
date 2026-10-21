import {test,expect} from '@playwright/test';

test('La clase conserva sus aciertos sin acreditar dominio después de recargar',async({page})=>{
 await page.goto('./inicio.html#courses');
 await page.locator('[data-action=pick-course][data-subject=M1]').click();await page.waitForURL(/#(?:tracks|modes|home)$/);if(await page.evaluate(()=>location.hash==='#modes')){await page.locator('[data-action=game-mode]').click();await page.locator('.mode-picker').waitFor({state:'detached'});}
 const count=await page.evaluate(()=>{
  const e=CachasteDailyApp.engine;
  const result=e.start('M1',2,'lesson','Descuento porcentual');
  location.hash='#session';CachasteDailyApp.render();
  return result.questions.length;
 });
 expect(count).toBe(2);
 for(let step=0;step<30&&await page.locator('[data-action=intro-next]').count();step++){
  await page.locator('[data-action=intro-next]').click();
 }
 await page.locator('[data-action=begin-question]').click();
 for(let i=0;i<2;i++){
  const answer=await page.evaluate(()=>{
   const e=CachasteDailyApp.engine;
   return e.byKey.get(e.state.session.keys[e.state.session.index]).answer;
  });
  await page.locator('[data-action=choice][data-index="'+answer+'"]').click();

  await page.locator('[data-action=check]').click();
  await expect(page.locator('.selected-repair')).toContainText('no equivale a dominio demostrado');
  await page.locator('[data-action=next]').click();
 }
 await page.reload();
 const result=await page.evaluate(()=>{
  const e=CachasteDailyApp.engine;
  return {rows:e.history('M1'),status:e.profile('M1').find(p=>p.concept==='Descuento porcentual').status,xp:e.stats().xp};
 });
 expect(result.rows).toHaveLength(2);
 expect(result.rows.every(r=>r.correct&&r.afterStudy)).toBe(true);
 expect(result.xp).toBe(30);
 expect(result.status).toBe('por reforzar');
});

test('Móvil: pedir una pista genera un repaso real sin pedir declarar seguridad',async({page})=>{
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('./inicio.html#courses');
 await page.locator('[data-action=pick-course][data-subject=M1]').click();await page.waitForURL(/#(?:tracks|modes|home)$/);if(await page.evaluate(()=>location.hash==='#modes')){await page.locator('[data-action=game-mode]').click();await page.locator('.mode-picker').waitFor({state:'detached'});}
 const started=await page.evaluate(()=>{
  const e=CachasteDailyApp.engine;
  return e.start('M1',1,'smart','Descuento porcentual');
 });
 expect(started.questions.length).toBeGreaterThan(0);
 await page.evaluate(()=>{location.hash='#session';CachasteDailyApp.render();});
 await expect(page.locator('.challenge-meter[role=progressbar]')).toBeVisible();
 const answer=await page.evaluate(()=>{const e=CachasteDailyApp.engine;return e.byKey.get(e.state.session.keys[0]).answer;});
 await page.locator('[data-action=choice][data-index="'+answer+'"]').click();

 await page.locator('[data-action=hint]').click();await page.locator('[data-action=check]').click();
 await expect(page.locator('.confidence-guide')).toContainText('Acertaste con apoyo');
 await expect(page.locator('.tutor')).toBeVisible();
 await page.evaluate(()=>{
  const e=CachasteDailyApp.engine,q=e.byKey.get(e.state.session.keys[e.state.session.index]);
  const r=e.reviewFor('M1',null,q.concept);
  r.nextAt=Date.now()-1000;
  e.close();
  location.hash='#home';
  CachasteDailyApp.render();
 });
 await expect(page.locator('.due-review')).toContainText('Tu repaso está listo');
 await page.reload();
 await expect(page.locator('.due-review')).toBeVisible();
 await expect(page.locator('[data-action=review-due]')).toBeVisible();
 expect(errors).toEqual([]);
});
