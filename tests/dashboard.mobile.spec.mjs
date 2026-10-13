import { test, expect } from '@playwright/test';
async function checkDashboard(page) {
 const issues=await page.evaluate(()=>{
  const width=document.documentElement.clientWidth, problems=[];
  if(document.documentElement.scrollWidth>width+1)problems.push('horizontal overflow');
  for(const link of document.querySelectorAll('a.subject,a.subnav,.subjects-nav a,.subjects-back a')){
   const r=link.getBoundingClientRect();
   if(r.width<44||r.height<44)problems.push('small link '+link.textContent);
   if(r.left<-1||r.right>width+1)problems.push('offscreen '+link.textContent);
  }
  return problems;
 });
 expect(issues).toEqual([]);
}
test('Cachaste: inicio unificado muestra asignaturas y rutas accesibles',async({page},info)=>{
 await page.goto('./inicio.html');
 await expect(page).toHaveTitle('Cachaste · Elige tu asignatura');
 await expect(page.getByRole('heading',{name:'¿Qué quieres aprender hoy?'})).toBeVisible();
 for(const name of ['Entrar a Matemática M1','Entrar a Biología','Entrar a Química','Entrar a Física']){
  await expect(page.getByRole('link',{name,exact:true})).toBeVisible();
 }
 await expect(page.getByRole('link',{name:'Ver Ciencias completa →'})).toBeVisible();
 await checkDashboard(page);
 await info.attach('selector-asignaturas',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
});
test('Navegación: M1 y Ciencias vuelven al mismo selector',async({page})=>{
 await page.goto('./inicio.html');
 await page.getByRole('link',{name:'Entrar a Matemática M1'}).tap();
 await expect(page).toHaveTitle('Cachaste · Aprende a tu ritmo');
 await expect(page.getByRole('button',{name:'Hacer diagnóstico · 5 preguntas'})).toBeVisible();
 await page.getByRole('link',{name:'← Todas las asignaturas'}).tap();
 await expect(page).toHaveTitle('Cachaste · Elige tu asignatura');
 await page.getByRole('link',{name:'Entrar a Biología'}).tap();
 await expect(page).toHaveTitle('Cachaste · Ciencias');
 await expect(page.getByText('Elegiste Biología')).toBeVisible();
 await expect(page.getByRole('button',{name:'Comenzar Biología'})).toBeVisible();
 await page.getByRole('link',{name:'← Asignaturas'}).tap();
 await expect(page).toHaveTitle('Cachaste · Elige tu asignatura');
 await checkDashboard(page);
});
test('Selector: Química y Física muestran la materia elegida al entrar',async({page})=>{
 await page.goto('./inicio.html');
 await page.getByRole('link',{name:'Entrar a Química'}).tap();
 await expect(page.getByText('Elegiste Química')).toBeVisible();
 await page.getByRole('button',{name:'Comenzar Química'}).tap();
 await expect(page.getByText('Química · MC',{exact:true})).toBeVisible();
 await page.getByRole('link',{name:'← Asignaturas'}).tap();
 await page.getByRole('link',{name:'Entrar a Física'}).tap();
 await expect(page.getByText('Elegiste Física')).toBeVisible();
 await page.getByRole('button',{name:'Comenzar Física'}).tap();
 await expect(page.getByText('Física · MC',{exact:true})).toBeVisible();
 await checkDashboard(page);
});
test('Progreso: selector reúne resúmenes de M1 y Ciencias sin mezclarlos',async({page})=>{
 await page.goto('./inicio.html');
 await expect(page.locator('#m1-progress')).toHaveText('Aún sin practicar');
 await expect(page.locator('#science-progress')).toHaveText('Aún sin practicar');
 await page.getByRole('link',{name:'Entrar a Matemática M1'}).tap();
 await page.getByRole('button',{name:'Hacer diagnóstico · 5 preguntas'}).tap();
 await page.locator('button.option').first().tap();
 await page.getByRole('button',{name:'Comprobar respuesta'}).tap();
 await page.getByRole('link',{name:'← Todas las asignaturas'}).tap();
 await expect(page.locator('#m1-progress')).toHaveText('1 respuesta');
 await expect(page.locator('#science-progress')).toHaveText('Aún sin practicar');
 await page.getByRole('link',{name:'Entrar a Biología'}).tap();
 await page.getByRole('button',{name:'Comenzar Biología'}).tap();
 await page.locator('button.option').first().tap();
 await page.getByRole('button',{name:'Comprobar respuesta'}).tap();
 await page.getByRole('link',{name:'← Asignaturas'}).tap();
 await expect(page.locator('#m1-progress')).toHaveText('1 respuesta');
 await expect(page.locator('#science-progress')).toHaveText('1 respuesta');
 await page.reload();
 await expect(page.locator('#m1-progress')).toHaveText('1 respuesta');
 await expect(page.locator('#science-progress')).toHaveText('1 respuesta');
 await checkDashboard(page);
});
