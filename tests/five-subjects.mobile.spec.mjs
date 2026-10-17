import {test,expect} from '@playwright/test';
test('Cachaste: las cinco materias cargan desde el selector sin errores JavaScript',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('./inicio.html#traditional');
 const routes=[
  {link:'Entrar a Matemática M1',title:'Cachaste · Aprende a tu ritmo'},
  {link:'Entrar a Matemática M2',title:'Cachaste · Matemática M2'},
  {link:'Entrar a Competencia Lectora',title:'Cachaste · Competencia Lectora'},
  {link:'Practicar Historia →',title:'Cachaste · Historia y Ciencias Sociales'},
  {link:'Elegir mención Biología',title:'Cachaste · Ciencias'}
 ];
 for(const route of routes){
  await page.goto('./inicio.html#traditional');
  await page.getByRole('link',{name:route.link}).click();
  await expect(page).toHaveTitle(route.title);
  await expect(page.locator('body')).not.toBeEmpty();
  await expect(page.getByRole('button',{name:/diagnóstico/i}).first()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
 }
 expect(errors).toEqual([]);
});
