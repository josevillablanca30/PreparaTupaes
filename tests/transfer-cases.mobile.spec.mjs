import {test,expect} from '@playwright/test';

const cases=[
 {subject:'M1',concept:'Parte porcentual',id:'TR-M1-001'},
 {subject:'Ciencias',concept:'Variable independiente',id:'TR-SCI-001'},
 {subject:'Historia',concept:'Razón y crítica ilustrada',id:'TR-HIS-001'},
 {subject:'M1',concept:'Unidades de una escala gráfica',id:'TR-M1-007'},
 {subject:'Ciencias',concept:'Respiración celular y ATP',id:'TR-SCI-007'},
 {subject:'Historia',concept:'Secularización del Estado',id:'TR-HIS-007'},
 {subject:'M1',concept:'Raíz cuadrada principal',id:'TR-M1-013'},
 {subject:'Ciencias',concept:'Pregunta investigable',id:'TR-SCI-021'},
 {subject:'Historia',concept:'Guerra Fría',id:'TR-HIS-019'}
];
for(const spec of cases){
 test(spec.subject+' '+spec.id+': evaluación de transferencia usa dos contextos distintos, explicaciones y guardado',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('./inicio.html#courses');
  await page.locator('[data-action=pick-course][data-subject="'+spec.subject+'"]').click();
  if(spec.subject==='Ciencias')await page.locator('[data-action=pick-track][data-track=Biología]').click();
  const picked=await page.evaluate(({subject,concept,id})=>{
   const e=CachasteDailyApp.engine,r=e.start(subject,2,'free',concept);
   if(r.questions.length!==2)throw Error('Faltan los 2 contextos de '+concept+': '+r.message);
   location.hash='#session';CachasteDailyApp.render();
   return{keys:r.questions.map(q=>q.key),unique:new Set(r.questions.map(q=>q.family)).size};
  },spec);
  expect(picked.keys).toContain(spec.subject+':'+spec.id);
  expect(picked.unique).toBe(2);
  await expect(page.locator('.question-title')).toBeVisible();
  const first=await page.evaluate(()=>{const e=CachasteDailyApp.engine;return e.byKey.get(e.state.session.keys[0]);});
  await page.locator('[data-action=choice][data-index="'+((first.answer+1)%4)+'"]').click();
  await page.locator('[data-confidence=duda]').click();
  await page.locator('[data-action=check]').click();
  await expect(page.locator('.selected-repair li')).toHaveCount(first.teaching.selectedFeedback[(first.answer+1)%4].repair.length);
  await page.locator('[data-action=next]').click();
  await expect(page.locator('.question-title')).toBeVisible();
  const second=await page.evaluate(()=>{const e=CachasteDailyApp.engine;return e.byKey.get(e.state.session.keys[e.state.session.index]);});
  expect(second.key).not.toBe(first.key);
  expect(second.family).not.toBe(first.family);
  await page.reload();
  await expect(page.locator('.question-title')).toBeVisible();
  expect(await page.evaluate(()=>CachasteDailyApp.engine.state.session.index)).toBe(1);
  const xp=await page.evaluate(()=>CachasteDailyApp.engine.stats().xp);
  expect(xp).toBeGreaterThanOrEqual(0);
  expect(errors).toEqual([]);
 });
}
