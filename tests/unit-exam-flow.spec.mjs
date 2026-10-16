import {test,expect} from '@playwright/test';

test('Eximición móvil: diez respuestas directas, sin pistas y aprobación persistente',async({page})=>{
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('./inicio.html#courses');
 await page.locator('[data-action=pick-course][data-subject=M1]').click();
 const started=await page.evaluate(()=>{
  const e=window.CachasteDailyApp.engine;
  const concepts=[...new Set(window.CACHASTE_DAILY_CATALOG.items.filter(q=>q.subjectKey==='M1').map(q=>q.concept))];
  return e.startUnitExam('M1','comprobacion-de-flujo',concepts,null);
 });
 expect(started.blocked).not.toBe(true);
 await page.evaluate(()=>{location.hash='#session';window.CachasteDailyApp.render();});
 for(let i=0;i<10;i++){
  await expect(page.locator('[data-confidence]')).toHaveCount(0);
  await expect(page.locator('[data-action=hint]')).toHaveCount(0);
  await expect(page.locator('[data-action=check]')).toBeDisabled();
  const correct=await page.evaluate(()=>{
   const e=window.CachasteDailyApp.engine,s=e.state.session;
   return e.byKey.get(s.keys[s.index]).answer;
  });
  await page.locator('[data-action=choice][data-index="'+correct+'"]').click();
  await expect(page.locator('[data-action=check]')).toBeEnabled();
  await page.locator('[data-action=check]').click();
  await expect(page.locator('.answer-feedback')).toContainText('Respuesta registrada');
  if(i===0){
   await page.reload();
   await expect(page.locator('.answer-feedback')).toContainText('Respuesta registrada');
  }
  await page.locator('[data-action=next]').click();
 }
 await expect(page.locator('.celebration-screen')).toContainText('¡Unidad eximida!');
 expect(await page.evaluate(()=>window.CachasteDailyApp.engine.state.unitExams['M1::comprobacion-de-flujo']?.passed)).toBe(true);
 await page.reload();
 await expect(page.locator('.celebration-screen')).toContainText('¡Unidad eximida!');
 expect(errors).toEqual([]);
});
