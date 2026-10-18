import {test,expect} from '@playwright/test';
for(const subject of [
 {file:'m2.html',key:'cachaste-m2-v1',title:'Cachaste · Matemática M2',count:55,areas:6},
 {file:'history.html',key:'cachaste-history-v1',title:'Cachaste · Historia y Ciencias Sociales',count:65,areas:6}
]){
 test(subject.file+': diagnóstico balanceado, persistencia y 5 áreas como mínimo',async({page})=>{
  await page.goto('./'+subject.file);
  await expect(page).toHaveTitle(subject.title);
  await expect(page.getByRole('button',{name:'Diagnóstico · 30 preguntas'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Express · 10 preguntas'})).toBeDisabled();
  await page.getByRole('button',{name:'Diagnóstico · 30 preguntas'}).tap();
  await expect(page.locator('.eyebrow')).toContainText('1 de 30');
  const sample=await page.evaluate(key=>{const s=JSON.parse(localStorage.getItem(key)).session;const bank=key.includes('m2')?window.CACHASTE_DAILY_CATALOG.items.filter(q=>q.subjectKey==='M2'):window.CACHASTE_DAILY_CATALOG.items.filter(q=>q.subjectKey==='Historia');return {ids:s.ids,areas:s.ids.map(id=>bank.find(q=>q.id===id).area)}},subject.key);
  expect(sample.ids.length).toBe(30);
  expect(new Set(sample.ids).size).toBe(30);
  const tally={};for(const area of sample.areas)tally[area]=(tally[area]||0)+1;
  expect(Object.keys(tally).length).toBeGreaterThanOrEqual(5);
  expect(Math.max(...Object.values(tally))-Math.min(...Object.values(tally))).toBeLessThanOrEqual(1);
  await page.locator('[data-choice="0"]').tap();
  await page.getByRole('button',{name:'Fue al azar'}).tap();
  await page.reload();
  await page.getByRole('button',{name:'Retomar sesión guardada'}).tap();
  await expect(page.locator('[data-choice="0"]')).toHaveClass(/selected/);
  await expect(page.getByRole('button',{name:'Fue al azar'})).toHaveClass(/selected/);
  await expect(page.getByRole('button',{name:'Revisar respuesta'})).toBeEnabled();
  const overflows=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
  expect(overflows).toBe(false);
 });
 test(subject.file+': completar diagnóstico habilita Express y banco completo',async({page})=>{
  await page.goto('./'+subject.file);
  await page.getByRole('button',{name:'Diagnóstico · 30 preguntas'}).tap();
  for(let i=0;i<30;i++){
   await page.locator('[data-choice="0"]').click();
   await page.getByRole('button',{name:'Tengo dudas'}).click();
   await page.getByRole('button',{name:'Revisar respuesta'}).click();
   await page.getByRole('button',{name:i===29?'Ver resultado':'Continuar'}).click();
  }
  await expect(page.getByRole('heading',{name:/de 30 correctas/})).toBeVisible();
  await page.getByRole('button',{name:'Volver al inicio'}).click();
  await expect(page.getByRole('button',{name:'Express · 10 preguntas'})).toBeEnabled();
  await expect(page.getByRole('button',{name:'Ensayo completo · '+subject.count+' preguntas'})).toBeEnabled();
  await page.getByRole('button',{name:'Express · 10 preguntas'}).click();
  const ids=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).session.ids,subject.key);
  expect(ids.length).toBe(10);
  expect(new Set(ids).size).toBe(10);
 });
}
