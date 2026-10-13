import {test,expect} from '@playwright/test';
async function mobileFit(page){
 const broken=await page.evaluate(()=>{
  const w=document.documentElement.clientWidth,issues=[];
  if(document.documentElement.scrollWidth>w+1)issues.push('horizontal overflow');
  for(const el of document.querySelectorAll('button')){
   const r=el.getBoundingClientRect();
   if(r.width<44||r.height<44)issues.push('control pequeño: '+el.textContent);
   if(r.left<-1||r.right>w+1)issues.push('control fuera de pantalla');
  }
  return issues;
 });
 expect(broken).toEqual([]);
}
test('Ciencias: abre desde M1, selección de módulo y diseño móvil',async({page})=>{
 await page.goto('./');
 await page.getByRole('link',{name:'Entrar a Cachaste Ciencias →'}).tap();
 await expect(page).toHaveTitle('Cachaste · Ciencias');
 await expect(page.getByRole('heading',{name:'¿Qué módulo rendirás?'})).toBeVisible();
 await expect(page.getByText(/54 del Módulo Común/)).toBeVisible();
 await page.locator('.track').filter({hasText:'Química'}).tap();
 await expect(page.locator('.track').filter({hasText:'Química'})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Practicar mi módulo · 12 preguntas'}).tap();
 await expect(page.locator('button.option')).toHaveCount(4);
 await expect(page.getByText('1 / 12',{exact:true})).toBeVisible();
 await mobileFit(page);
});
test('Ciencias: pistas y explicaciones funcionan en Biología',async({page})=>{
 await page.goto('./science.html');
 await page.getByRole('button',{name:'Practicar Biología · 8 preguntas'}).tap();
 await page.getByRole('button',{name:'Necesito una pista'}).tap();
 await expect(page.getByText('Pista 1 de 2')).toBeVisible();
 await page.getByRole('button',{name:'Dame otra pista'}).tap();
 await expect(page.getByText('Pista 2 de 2')).toBeVisible();
 await page.locator('button.option').first().tap();
 await page.getByRole('button',{name:'Comprobar respuesta'}).tap();
 await expect(page.getByText('Respuesta correcta:',{exact:false})).toBeVisible();
 await page.getByRole('button',{name:'Más fácil'}).tap();
 await expect(page.getByRole('heading',{name:'Te lo explico como prefieras',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Con un ejemplo'}).tap();
 await expect(page.getByRole('button',{name:'Siguiente pregunta →'})).toBeVisible();
 await mobileFit(page);
});
test('Ciencias: guardar una corrección de Biología, cerrar y recuperarla',async({page})=>{
 await page.goto('./science.html');
 await page.getByRole('button',{name:'Practicar Biología · 8 preguntas'}).tap();
 await page.getByRole('button',{name:'Proponer corrección'}).tap();
 await page.locator('#science-note').fill('Revisar la alternativa B con referencias al contenido celular.');
 await page.getByRole('button',{name:'Guardar mi observación'}).tap();
 await page.getByRole('button',{name:'← Volver a Ciencias'}).tap();
 await expect(page.getByRole('button',{name:'Mis correcciones (1)'})).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:'Mis correcciones (1)'}).tap();
 await expect(page.locator('#science-note-export')).toContainText('Revisar la alternativa B');
 await mobileFit(page);
});
test('Ciencias: TP, diagnóstico mixto y M1 mantienen rutas independientes',async({page})=>{
 await page.goto('./science.html');
 await page.locator('.track').filter({hasText:'TP'}).tap();
 await expect(page.locator('.track').filter({hasText:'TP'})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Diagnóstico mixto · 9 preguntas'}).tap();
 await expect(page.getByText('1 / 9',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'← Volver a Ciencias'}).tap();
 await page.getByRole('link',{name:'← Matemática M1'}).tap();
 await expect(page).toHaveTitle('Cachaste · Aprende a tu ritmo');
 await expect(page.getByRole('button',{name:'Hacer diagnóstico · 5 preguntas'})).toBeVisible();
 await mobileFit(page);
});
