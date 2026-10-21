import {test,expect} from '@playwright/test';
for(const [subject,track] of [['M1',null],['M2',null],['Lectura',null],['Historia',null],['Ciencias','Biología'],['Ciencias','Física'],['Ciencias','Química']]){
 test('Vista didáctica integrada · '+subject+' '+(track||''),async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('./inicio.html');
  const original=await page.evaluate(({subject,track})=>{
   const e=CachasteDailyApp.engine;e.close();e.state.foundationDraft=null;e.state.track=track;
   const q=CACHASTE_DAILY_CATALOG.items.find(q=>q.subjectKey===subject&&(!track||q.subject===track));
   e.start(subject,2,'lesson',q.concept);location.hash='#session';CachasteDailyApp.render();
   return{xp:e.stats().xp,attempts:e.state.attempts.length};
  },{subject,track});
  for(const name of ['Idea clave','Modelo visual','Mini práctica'])await expect(page.getByRole('region',{name,exact:true})).toBeVisible();
  await expect(page.locator('.reference-lesson-hero img')).toHaveCount(1);
  await expect(page.locator('.reference-easy-card')).toBeVisible();await expect(page.locator('.reference-example-card')).toBeVisible();
  const choice=page.locator('.didactic-overview [data-action=visual-choose]').first();
  if(await choice.count())await choice.click();else await page.locator('.didactic-practice [data-action=visual-reveal]').click();
  await page.reload();await expect(page.locator('.didactic-overview')).toBeVisible();
  expect(await page.evaluate(()=>{const e=CachasteDailyApp.engine;return{xp:e.stats().xp,attempts:e.state.attempts.length};})).toEqual(original);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.locator('[data-action=begin-question]').click();await expect(page.locator('.question-title')).toBeVisible();expect(errors).toEqual([]);
 });
}
