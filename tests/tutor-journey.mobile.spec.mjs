import {test,expect} from '@playwright/test';

for(const subject of ['M1','M2','Lectura','Historia','Ciencias']){
 test('Tutor guiado '+subject+': error, explicación simplificada, ejemplo y repaso accesible',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('./inicio.html#courses');
  await page.locator('[data-action=pick-course][data-subject="'+subject+'"]').click();
  if(subject==='Ciencias')await page.locator('[data-track=Biología]').click();
  await page.locator('.adventure-world [data-action=level]').first().click();
  await expect(page.locator('[data-action=check-first]')).toBeVisible();
  await page.locator('[data-action=check-first]').click();
  await expect(page.locator('.question-title')).toBeVisible();
  const wrong=await page.evaluate(()=>{
   const e=CachasteDailyApp.engine,s=e.state.session,q=e.byKey.get(s.keys[s.index]);
   return(q.answer+1)%q.options.length;
  });
  await page.locator('[data-action=choice][data-index="'+wrong+'"]').click();
  await page.locator('[data-action=confidence][data-confidence=seguro]').click();
  await page.locator('[data-action=check]').click();
  await expect(page.locator('.daily-card.tutor')).toBeVisible();
  await expect(page.locator('.selected-repair')).toContainText('Tu error');
  for(const mode of ['easy','example','steps']){
   await page.locator('[data-action=mode][data-mode="'+mode+'"]').click();
   await expect(page.locator('.teacher-explanation')).not.toBeEmpty();
   await expect(page.locator('.daily-card.tutor [data-action=mode][data-mode="'+mode+'"]')).toHaveAttribute('aria-pressed','true');
  }
  await page.locator('[data-action=mode][data-mode="easy"]').click();
  const check=await page.evaluate(()=>{const e=CachasteDailyApp.engine,s=e.state.session;return e.byKey.get(s.keys[s.index]).teaching.check.trim();});
  while(await page.locator('.daily-card.tutor [data-action=card-next]').count())await page.locator('.daily-card.tutor [data-action=card-next]').click();
  await expect(page.locator('.teacher-explanation')).toContainText(check);
  await page.reload();
  await expect(page.locator('.teacher-explanation')).toContainText(check);
  await expect(page.locator('[data-action=mode][data-mode="easy"]')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.daily-card.tutor [data-action=study]')).toBeVisible();
  expect(errors).toEqual([]);
 });
}
