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
