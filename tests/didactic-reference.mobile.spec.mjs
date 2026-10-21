import {test,expect} from '@playwright/test';
for(const subject of ['M1','M2','Lectura','Historia','Ciencias']){
 test('Corrección didáctica visible sin cambiar de modo · '+subject,async({page})=>{
  await page.goto('./inicio.html');
  const expected=await page.evaluate(subject=>{
   const e=CachasteDailyApp.engine;e.close();
   e.state.track=subject==='Ciencias'?'Biología':null;
   const q=CACHASTE_DAILY_CATALOG.items.find(q=>q.subjectKey===subject&&(!e.state.track||q.subject===e.state.track));
   e.start(subject,2,'lesson',q.concept);const s=e.state.session;
   s.stage='question';location.hash='#session';CachasteDailyApp.render();
   const current=e.byKey.get(s.keys[s.index]);
   return{wrong:(current.answer+1)%current.options.length,easy:current.teaching.intuition[0],example:current.teaching.example.problem};
  },subject);
  await page.locator('[data-action=choice][data-index="'+expected.wrong+'"]').click();

  await page.locator('[data-action=check]').click();
  await expect(page.locator('.reference-easy-card')).toContainText(expected.easy);
  await expect(page.locator('.reference-example-card')).toContainText(expected.example);
  const before=await page.evaluate(()=>{const e=CachasteDailyApp.engine;return{xp:e.stats().xp,attempts:e.state.attempts.length};});
  await page.reload();
  await expect(page.locator('.reference-easy-card')).toContainText(expected.easy);
  expect(await page.evaluate(()=>{const e=CachasteDailyApp.engine;return{xp:e.stats().xp,attempts:e.state.attempts.length};})).toEqual(before);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 });
}
