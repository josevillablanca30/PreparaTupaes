import {test,expect} from '@playwright/test';
async function fit(page){
 const problems=await page.evaluate(()=>{
  const w=document.documentElement.clientWidth,errs=[];
  if(document.documentElement.scrollWidth>w+1)errs.push('desbordamiento horizontal');
  for(const el of document.querySelectorAll('button,a')){
   const r=el.getBoundingClientRect();
   if(r.width===0&&r.height===0)continue;
   if(r.left<-.5||r.right>w+.5)errs.push('fuera de pantalla: '+el.textContent.slice(0,40));
   if(el.tagName==='BUTTON'&&(r.width<44||r.height<44))errs.push('control pequeño: '+el.textContent.slice(0,30));
  }
  return errs;
 });
 expect(problems).toEqual([]);
}
async function completeDiagnostic(page){
 await page.getByRole('button',{name:'Comenzar diagnóstico de 30'}).tap();
 await expect(page.getByText('1 / 30',{exact:true})).toBeVisible();
 await page.locator('button.option').first().tap();
 await page.getByRole('button',{name:'Comprobar respuesta'}).tap();
 await page.getByRole('button',{name:'Siguiente pregunta →'}).tap();
 await page.evaluate(()=>{
  for(let i=1;i<30;i++){
   document.querySelector('button.option').click();
   document.querySelector('button[onclick="readingCheck()"]').click();
   document.querySelector('button[onclick="readingAdvance()"]').click();
  }
 });
 await expect(page.getByRole('heading',{name:'Tu desempeño por habilidad'})).toBeVisible();
}
test('Lectora: entra desde inicio unificado y los textos son legibles en móvil',async({page},info)=>{
 await page.goto('./inicio.html#traditional');
 await page.getByRole('link',{name:'Entrar a Competencia Lectora'}).tap();
 await expect(page).toHaveTitle('Cachaste · Competencia Lectora');
 await expect(page.getByRole('heading',{name:'Tres formas de prepararte'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Express · 10 preguntas'})).toBeDisabled();
 await page.getByRole('button',{name:'Comenzar diagnóstico de 30'}).tap();
 await expect(page.locator('.passage')).toBeVisible();
 await expect(page.locator('.passage article p')).toHaveCount(3);
 await expect(page.locator('button.option')).toHaveCount(4);
 await expect(page.getByText('¿Qué tan seguro estás?')).toBeVisible();
 await fit(page);
 await info.attach('lectura-texto-movil',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
});
test('Lectora: diagnóstico completo abre Express, recomendaciones y guardado',async({page})=>{
 await page.goto('./reading.html');
 await completeDiagnostic(page);
 await page.getByRole('button',{name:'Volver a mi preparación'}).tap();
 await expect(page.getByRole('button',{name:'Express · 10 preguntas'})).toBeEnabled();
 await expect(page.getByRole('button',{name:'Ensayo · 65 preguntas'})).toBeEnabled();
 await expect(page.getByText('Lo que te conviene practicar')).toBeVisible();
 await page.reload();
 await expect(page.getByRole('button',{name:'Express · 10 preguntas'})).toBeEnabled();
 await page.getByRole('button',{name:'Express · 10 preguntas'}).tap();
 await expect(page.getByText('1 / 10',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Necesito una pista'}).tap();
 await expect(page.getByText('Pista 1 de 2.',{exact:false})).toBeVisible();
 await fit(page);
});
test('Lectora: recuperar pregunta y seguridad luego de reiniciar app',async({page})=>{
 await page.goto('./reading.html');
 await page.getByRole('button',{name:'Comenzar diagnóstico de 30'}).tap();
 await page.getByRole('button',{name:'Fue al azar'}).tap();
 await page.locator('button.option').first().tap();
 await page.reload();
 await page.getByRole('button',{name:'Continuar práctica'}).tap();
 await expect(page.locator('button.option.chosen')).toHaveCount(1);
 await expect(page.getByRole('button',{name:'Fue al azar'})).toHaveAttribute('aria-pressed','true');
 await expect(page.getByText('1 / 30',{exact:true})).toBeVisible();
 await fit(page);
});
test('Lectora: ensayo completo presenta 65 preguntas y cronómetro',async({page})=>{
 await page.goto('./reading.html');
 await completeDiagnostic(page);
 await page.getByRole('button',{name:'Volver a mi preparación'}).tap();
 await page.getByRole('button',{name:'Ensayo · 65 preguntas'}).tap();
 await expect(page.getByText('1 / 65',{exact:true})).toBeVisible();
 await expect(page.locator('#reading-timer')).toContainText('Tiempo restante:');
 await expect(page.getByRole('button',{name:'Comprobar respuesta'})).toHaveCount(0);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('cachaste-reading-v1')).session);
 expect(saved.ids.length).toBe(65);
 expect(new Set(saved.ids).size).toBe(65);
 await page.getByRole('button',{name:'Omitir pregunta →'}).tap();
 await expect(page.getByText('2 / 65',{exact:true})).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:'Continuar práctica'}).tap();
 await expect(page.getByText('2 / 65',{exact:true})).toBeVisible();
 await fit(page);
});
