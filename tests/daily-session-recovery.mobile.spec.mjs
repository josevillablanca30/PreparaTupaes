import {test,expect} from '@playwright/test';
for(const subject of ['M1','M2','Lectura','Ciencias','Historia']){
 test(subject+': retomar tutor después de actualizar el banco conserva evaluación, reparación y XP',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('./inicio.html#courses');
  await page.locator('[data-action=pick-course][data-subject="'+subject+'"]').click();await page.waitForURL(/#(?:tracks|modes|home)$/);if(await page.evaluate(()=>location.hash==='#modes')){await page.locator('[data-action=game-mode]').click();await page.locator('.mode-picker').waitFor({state:'detached'});}
  if(subject==='Ciencias')await page.locator('[data-track=Biología]').click();await page.waitForURL(/#(?:tracks|modes|home)$/);if(await page.evaluate(()=>location.hash==='#modes')){await page.locator('[data-action=game-mode]').click();await page.locator('.mode-picker').waitFor({state:'detached'});}
  await page.locator('.adventure-world [data-action=level]').first().click();
  await page.locator('[data-action=check-first]').click();
  const original=await page.evaluate(()=>{
   const e=CachasteDailyApp.engine,s=e.state.session,q=e.byKey.get(s.keys[s.index]);
   return{key:q.key,question:q.question,wrong:(q.answer+1)%q.options.length,options:q.options};
  });
  await page.locator('[data-action=choice][data-index="'+original.wrong+'"]').click();

  await page.locator('[data-action=check]').click();
  const before=await page.evaluate(()=>({xp:CachasteDailyApp.engine.stats().xp,rows:CachasteDailyApp.engine.state.attempts.length}));
  await page.route('**/daily-catalog.js',async route=>{
   const response=await route.fetch(),body=await response.text();
   const data=JSON.parse(body.slice(body.indexOf('=')+1).trim().replace(/;$/,''));
   const q=data.items.find(q=>q.key===original.key);q.question='Enunciado de una revisión posterior';q.options=q.options.map((_,i)=>'Alternativa revisada '+i);q.answer=(q.answer+1)%q.options.length;
   await route.fulfill({response,body:'window.CACHASTE_DAILY_CATALOG='+JSON.stringify(data)+';\n'});
  });
  await page.reload();
  await expect(page.locator('.question-title')).toHaveText(original.question);
  await expect(page.locator('.selected-repair')).toContainText('Tu error');
  for(let i=0;i<original.options.length;i++)await expect(page.locator('[data-action=choice][data-index="'+i+'"]')).toContainText(original.options[i]);
  expect(await page.evaluate(()=>({xp:CachasteDailyApp.engine.stats().xp,rows:CachasteDailyApp.engine.state.attempts.length}))).toEqual(before);
  expect(errors).toEqual([]);
 });
}
