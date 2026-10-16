import {test,expect} from '@playwright/test';

test('Móvil: la certeza tiene consecuencia visible y genera un repaso real',async({page})=>{
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('./inicio.html#courses');
 await page.locator('[data-action=pick-course][data-subject=M1]').click();
 const started=await page.evaluate(()=>{
  const e=CachasteDailyApp.engine;
  return e.start('M1',1,'smart','Descuento porcentual');
 });
 expect(started.questions.length).toBeGreaterThan(0);
 await page.evaluate(()=>{location.hash='#session';CachasteDailyApp.render();});
 await expect(page.locator('.challenge-meter[role=progressbar]')).toBeVisible();
 const answer=await page.evaluate(()=>{const e=CachasteDailyApp.engine;return e.byKey.get(e.state.session.keys[0]).answer;});
 await page.locator('[data-action=choice][data-index="'+answer+'"]').click();
 await page.locator('[data-confidence=duda]').click();
 await page.locator('[data-action=check]').click();
 await expect(page.locator('.confidence-guide')).toContainText('Acertaste, pero con dudas');
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
