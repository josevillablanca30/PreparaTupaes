import {test,expect} from '@playwright/test';

// Inspección móvil reproducible de la pantalla de información comercial.
// No ejecuta ni simula pagos.
test('pantalla de suscripción: legible, accesible y sin desbordamiento móvil',async({page},info)=>{
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto('suscripcion.html');
 expect(response?.status()).toBe(200);
 await expect(page.getByRole('heading',{name:'Aprende con acceso completo'})).toBeVisible();
 await expect(page.getByText('7 días gratis y luego plan mensual')).toBeVisible();
 for(const price of ['$2.490 CLP','$7.990 CLP','$64.990 CLP']){
  await expect(page.getByText(price,{exact:false}).first()).toBeVisible();
 }
 await expect(page.getByRole('button',{name:/Contratación deshabilitada/})).toBeDisabled();
 await expect(page.getByRole('button',{name:/Restauración deshabilitada/})).toBeDisabled();
 await expect(page.getByText(/fecha exacta del primer cobro/i)).toBeVisible();
 await expect(page.getByText(/Eliminar la aplicación no cancela la suscripción/i)).toBeVisible();
 const geometry=await page.evaluate(()=>{
  const width=document.documentElement.clientWidth;
  const overflow=document.documentElement.scrollWidth>width+1;
  const offscreen=[...document.querySelectorAll('button,a')].filter(el=>{
   const rect=el.getBoundingClientRect();
   return rect.width>0&&(rect.left< -1||rect.right>width+1||rect.height<44);
  }).map(el=>el.textContent.trim());
  return {overflow,offscreen};
 });
 expect(geometry).toEqual({overflow:false,offscreen:[]});
 expect(errors).toEqual([]);
 await info.attach('suscripcion-movil',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
 await page.getByRole('link',{name:/Volver a las asignaturas/}).click();
 await expect(page).toHaveURL(/inicio\.html$/);
});
