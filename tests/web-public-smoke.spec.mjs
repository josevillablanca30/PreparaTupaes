import {test,expect} from '@playwright/test';
test('landing loads with preserved branding and no horizontal overflow',async({page})=>{
 await page.goto('/');await expect(page.locator('h1').first()).toBeVisible();
 await expect(page.locator('img[src="/assets/gatito-sabio-oficial.png"]')).toBeVisible();
 const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
 expect(sizes.scroll).toBeLessThanOrEqual(sizes.client+1);
 await expect(page.getByText(/Los cobros todavía no están habilitados/i).first()).toBeVisible();
});
test('account and recovery pages load without horizontal overflow',async({page})=>{
 for(const route of ['/cuenta.html','/recuperar.html']){
  await page.goto(route);await expect(page.locator('body')).toBeVisible();
  const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
  expect(sizes.scroll,route).toBeLessThanOrEqual(sizes.client+1);
 }
});
test('private learning page is not available anonymously',async({request})=>{
 const response=await request.get('/app/inicio.html',{headers:{accept:'application/json'}});
 expect([401,402,404]).toContain(response.status());
});
test('live billing stays disabled in preview',async({request})=>{
 const response=await request.post('/api/billing',{headers:{origin:'http://127.0.0.1:5173','x-cachaste-request':'1'},data:{action:'checkout',plan:'semanal'}});
 expect(response.status()).toBeGreaterThanOrEqual(400);
});

test('recovery screen renders an accessible email form without submitting a real email',async({page})=>{
 await page.goto('/recuperar.html');
 await expect(page.getByRole('heading',{name:'Recupera tu contraseña.'})).toBeVisible();
 await expect(page.getByRole('textbox',{name:'Correo de tu cuenta'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Enviar correo de recuperación'})).toBeVisible();
 await expect(page.locator('html')).toHaveAttribute('lang','es-CL');
});
test('public prices stay aligned with approved weekly, monthly and annual plans',async({page})=>{
 await page.goto('/');
 const text=await page.locator('body').innerText();
 for(const price of ['$2.490','$7.990','$64.990'])expect(text).toContain(price);
});
