import {test,expect} from '@playwright/test';
for(const subject of ['M1','M2','Lectura','Ciencias','Historia']){
 test(subject+': el tutor explica el distractor elegido y tres reparaciones concretas',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('./inicio.html#courses');
  await page.locator('[data-action=pick-course][data-subject="'+subject+'"]').click();
  if(subject==='Ciencias')await page.locator('[data-action=pick-track][data-track=Biología]').click();
  const info=await page.evaluate(sub=>{
   const e=CachasteDailyApp.engine;
   const eligible=CACHASTE_DAILY_CATALOG.items.filter(q=>q.subjectKey===sub&&Array.isArray(q.teaching?.selectedFeedback)&&q.teaching.selectedFeedback.some(f=>f&&f.repair?.length>=3)&&(sub!=='Ciencias'||q.module==='MC'));
   if(!eligible.length)throw Error('Falta reparación editorial en '+sub);
   const q=eligible[0];
   const r=e.start(sub,1,'free',q.concept);
   if(!e.state.session)throw Error('No pudo abrir sesión: '+r.message);
   e.state.session.keys=[q.key];e.save();
   location.hash='#session';CachasteDailyApp.render();
   const wrong=q.options.findIndex((_,i)=>i!==q.answer&&q.teaching.selectedFeedback[i]?.repair?.length>=3);
   return{wrong,steps:q.teaching.selectedFeedback[wrong].repair};
  },subject);
  await expect(page.locator('.question-title')).toBeVisible();
  await page.locator('[data-action=choice][data-index="'+info.wrong+'"]').click();
  await page.locator('[data-confidence=duda]').click();
  await page.locator('[data-action=check]').click();
  await expect(page.locator('.selected-repair ol li')).toHaveCount(info.steps.length);
  await expect(page.locator('.selected-repair ol li').first()).toHaveText(info.steps[0]);
  await expect(page.locator('.tutor [data-mode=easy]')).toBeVisible();
  await page.reload();
  await expect(page.locator('.selected-repair ol li')).toHaveCount(info.steps.length);
  expect(errors).toEqual([]);
 });
}
