import {test,expect} from '@playwright/test';
async function choose(page,subject='M1'){await page.goto('./inicio.html');await page.locator('[data-action=pick-course][data-subject='+subject+']').click();if(subject==='Ciencias')await page.locator('[data-track=Biología]').click();}
for(const subject of ['M1','M2','Lectura','Historia','Ciencias'])test(subject+': Express 15 sin seguridad ni corrección anticipada, resultado y recuperación',async({page})=>{
 test.setTimeout(60000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await choose(page,subject);await page.locator('[data-action=express-mode]').click();
 for(let i=0;i<15;i++){
  await expect(page.locator('.question-title')).toBeVisible();await expect(page.locator('[data-action=confidence]')).toHaveCount(0);await expect(page.locator('[data-action=check]')).toBeDisabled();
  const index=await page.evaluate(i=>{const e=CachasteDailyApp.engine,s=e.state.session,q=e.byKey.get(s.keys[s.index]);return i<10?q.answer:(q.answer+1)%q.options.length},i);
  await page.locator('[data-action=choice][data-index="'+index+'"]').click();await expect(page.locator('[data-action=check]')).toBeEnabled();await page.locator('[data-action=check]').click();await expect(page.locator('.daily-options .correct,.selected-repair,.tutor,[data-action=hint]')).toHaveCount(0);
  if(i===3){await page.reload();await expect(page.locator('.answer-feedback')).toContainText('Respuesta registrada');}
  await page.locator('[data-action=next]').click();
 }
 await expect(page.locator('.express-report')).toContainText('10/15');await expect(page.locator('.express-report')).toContainText('Qué mejorar por área');await expect(page.locator('.express-review')).toHaveCount(15);await page.locator('.express-review').last().click();await expect(page.locator('.express-review').last()).toContainText('Elegiste:');
 await page.reload();await expect(page.locator('.express-report')).toContainText('10/15');await page.locator('[data-action=home]').click();await page.locator('[data-action=progress]').click();await page.locator('[data-action=express-result]').click();await expect(page.locator('.express-report')).toContainText('10/15');await page.locator('[data-action=express-mode]').click();await expect(page.locator('.question-title')).toBeVisible();expect(errors).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
});
test('Dos estrellas: seguir repasando o explorar la siguiente misión, sin cortar el uso',async({page})=>{
 await choose(page);await page.locator('[data-action=game-mode]').click();await page.locator('.map-help summary').click();await expect(page.locator('.map-help')).toContainText('La quinta es extra');
 const before=await page.evaluate(()=>{const e=CachasteDailyApp.engine,q=CACHASTE_DAILY_CATALOG.items.find(q=>q.subjectKey==='M1'&&q.concept==='Enteros y cambios');for(const n of CACHASTE_DAILY_CATALOG.items.filter(n=>n.subjectKey==='M1'&&n.concept===q.concept))e.state.seen[n.key]={last:Date.now(),first:Date.now(),count:1};e.state.celebration={subject:'M1',concept:q.concept,title:q.concept,correct:1,total:2,mastered:false};e.save();location.hash='#celebrate';CachasteDailyApp.render();return e.stats().xp;});
 await page.locator('[data-action=keep-practicing]').click();await expect(page.locator('.daily-session-head').locator('..')).toContainText('repaso');
 const index=await page.evaluate(()=>{const e=CachasteDailyApp.engine,s=e.state.session;return e.byKey.get(s.keys[s.index]).answer;});await page.locator('[data-action=choice][data-index="'+index+'"]').click();await page.locator('[data-action=check]').click();expect(await page.evaluate(()=>CachasteDailyApp.engine.state.attempts.at(-1).repeatedReview)).toBe(true);
 await page.evaluate(()=>{const e=CachasteDailyApp.engine;e.close();location.hash='#celebrate';CachasteDailyApp.render();});await page.locator('[data-action=explore-next]').click();await expect(page.locator('.mission-preview h1')).not.toHaveText('Enteros y cambios');await page.locator('[data-action=lesson]').click();await expect(page.locator('.didactic-overview')).toBeVisible();
});
