import {expect,test} from '@playwright/test';

const supabase='https://jmobinmdwrmdqrxtcruj.supabase.co';
const student='student-a@example.invalid';

test('A closed registration button explains availability without requiring login fields',async({page})=>{
  await page.goto('/cuenta.html');
  await page.getByRole('button',{name:'Crear mi cuenta',exact:true}).click();
  await expect(page.getByText('El registro se habilitará cuando esté disponible la confirmación por correo.')).toBeVisible();
  await expect(page.locator('#login-form')).toBeVisible();
});

test('Email signup opens a separate form, verifies the OTP and preserves account access',async({page})=>{
  await page.request.post('/__qa/control',{data:{reset:true,active:false,signupEnabled:true}});
  await page.addInitScript(origin=>{
    const transport=window.fetch.bind(window);
    window.fetch=(input,options)=>{
      const target=new URL(input instanceof Request?input.url:input,location.href);
      if(target.origin!==origin)return transport(input,options);
      const local=location.origin+'/__qa/supabase'+target.pathname+target.search;
      return transport(input instanceof Request?new Request(local,input):local,options);
    };
  },supabase);
  try{
    await page.goto('/cuenta.html');
    await page.getByRole('button',{name:'Crear mi cuenta',exact:true}).click();
    await expect(page.locator('#signup-form')).toBeVisible();
    await expect(page.locator('#login-form')).toHaveCount(0);
    await page.getByLabel('Correo electrónico',{exact:true}).fill(student);
    await page.getByLabel('Contraseña nueva',{exact:true}).fill('Cachaste-prueba-2026!');
    await page.getByRole('button',{name:'Crear mi cuenta',exact:true}).click();
    await expect(page.getByRole('heading',{name:'Confirma tu correo'})).toBeVisible();
    await page.getByLabel('Código del correo').fill('000000');
    await page.getByRole('button',{name:'Verificar correo'}).click();
    await expect(page.getByText('El código venció o ya se usó. Pide uno nuevo.')).toBeVisible();
    await page.getByRole('button',{name:'Reenviar código'}).click();
    await expect(page.getByText('Te enviamos otro código. Usa el más reciente.')).toBeVisible();
    await page.getByLabel('Código del correo').fill('123456');
    await page.getByRole('button',{name:'Verificar correo'}).click();
    await expect(page.getByText(student,{exact:true})).toBeVisible();
    await page.reload();
    await expect(page.getByText(student,{exact:true})).toBeVisible();
    const {calls}=await (await page.request.get('/__qa/state')).json();
    expect(calls.filter(c=>c.operation?.startsWith('email_')).map(c=>c.operation)).toEqual(['email_signup','email_verify','email_resend','email_verify']);
  }finally{await page.request.post('/__qa/control',{data:{reset:true}});}
});
