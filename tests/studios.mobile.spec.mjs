import {test,expect} from '@playwright/test';

const pilots=[
 ['M1','Ecuación lineal'],
 ['M2','Vértice de una cuadrática'],
 ['Lectura','Límites de una conclusión'],
 ['Ciencias','Redes tróficas y energía'],
 ['Historia','Funciones y separación de poderes']
];
for(const [subject,concept] of pilots){
 test(subject+': clase, relaciones interactivas, persistencia y comprobación PAES independientes',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('./inicio.html#courses');
  await page.locator('[data-action=pick-course][data-subject="'+subject+'"]').click();
  if(subject==='Ciencias')await page.locator('[data-action=pick-track][data-track=Biología]').click();
  await expect(page.locator('.studio-feature')).toBeVisible();
  await expect(page.locator('.studio-feature')).toContainText('MISIÓN ESPECIAL');
  await page.locator('.studio-feature [data-action=studio-open]').click();
  await expect(page.locator('.studio-panel')).toBeVisible();
  await expect(page.locator('.studio-card .cat-frame')).toHaveCount(1);
  await expect(page.locator('.studio-goals li')).toHaveCount(3);
  const xpBefore=await page.evaluate(()=>CachasteDailyApp.engine.stats().xp);
  await page.locator('[data-action=studio-next-card]').click();
  await page.reload();
  await expect(page.locator('.studio-panel .studio-card')).toBeVisible();
  expect(await page.evaluate(()=>CachasteDailyApp.engine.state.studioDraft.card)).toBe(1);
  while(await page.locator('[data-action=studio-next-card]').count())await page.locator('[data-action=studio-next-card]').click();
  await expect(page.locator('.studio-options .studio-choice')).toHaveCount(3);
  await expect(page.locator('.studio-panel .cat-frame')).toHaveCount(1);
  for(let round=0;round<3;round++){
   const selected=round===0?1:round;
   await page.locator('[data-action=studio-choice][data-choice="'+selected+'"]').click();
   await page.locator('[data-action=studio-check]').click();
   await expect(page.locator('.studio-feedback')).toBeVisible();
   if(round===0)await expect(page.locator('.studio-repair')).toBeVisible();
   await page.locator('[data-action=studio-advance]').click();
  }
  await expect(page.locator('.studio-complete')).toBeVisible();
  await expect(page.locator('.studio-score')).toContainText('2/3');
  expect(await page.evaluate(()=>CachasteDailyApp.engine.stats().xp)).toBe(xpBefore);
  await test.info().attach(subject+'-taller-PAES',{body:await page.screenshot({fullPage:true,animations:'disabled'}),contentType:'image/png'});
  await page.locator('[data-action=studio-assess]').click();
  await expect(page.locator('.question-title')).toBeVisible();
  const session=await page.evaluate(()=>CachasteDailyApp.engine.state.session);
  expect(session.subject).toBe(subject);
  expect(session.concept).toBe(concept);
  expect(session.keys.length).toBeGreaterThanOrEqual(1);
  expect(errors).toEqual([]);
 });
}
test('Un estudiante puede ir del juego a una clase con el gatito sin perder progreso ni inventar dominio',async({page})=>{
 await page.goto('./inicio.html#courses');
 await page.locator('[data-action=pick-course][data-subject=M1]').click();
 await page.evaluate(()=>{
  const q=CACHASTE_DAILY_CATALOG.items.find(x=>x.subjectKey==='M1'&&x.concept==='Ecuación lineal');
  location.hash='#level:'+encodeURIComponent(q.levelId);CachasteDailyApp.render();
 });
 await page.locator('[data-action=studio-open]').click();
 await expect(page.locator('.studio-card')).toBeVisible();
 while(await page.locator('[data-action=studio-next-card]').count())await page.locator('[data-action=studio-next-card]').click();
 for(let i=0;i<3;i++){
  await page.locator('[data-action=studio-choice][data-choice="'+i+'"]').click();
  await page.locator('[data-action=studio-check]').click();
  await page.locator('[data-action=studio-advance]').click();
 }
 await page.locator('[data-action=studio-lesson]').click();
 await expect(page.locator('.teacher-step')).toBeVisible();
 await expect(page.locator('.lesson-text')).toBeVisible();
 const session=await page.evaluate(()=>CachasteDailyApp.engine.state.session);
 expect(session.mode).toBe('lesson');
 expect(session.stage).toBe('intro');
});

test('Diagnóstico previo sin clases no crea XP, ni da por dominada una habilidad',async({page})=>{
 await page.goto('./inicio.html#courses');
 await page.locator('[data-action=pick-course][data-subject=Historia]').click();
 await expect(page.locator('.studio-feature [data-action=studio-direct-test]')).toBeVisible();
 await page.locator('.studio-feature [data-action=studio-direct-test]').click();
 await expect(page.locator('.question-title')).toBeVisible();
 const facts=await page.evaluate(()=>{
  const e=CachasteDailyApp.engine;
  return{mode:e.state.session.mode,concept:e.state.session.concept,xp:e.stats().xp,studio:e.state.studioDraft};
 });
 expect(facts.mode).toBe('free');
 expect(facts.concept).toBe('Funciones y separación de poderes');
 expect(facts.xp).toBe(0);
 expect(facts.studio??null).toBeNull();
});
