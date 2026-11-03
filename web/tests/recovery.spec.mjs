import{test,expect}from'@playwright/test';
import{session}from'../../tests/helpers/competition-fixtures.mjs';
const project='https://jmobinmdwrmdqrxtcruj.supabase.co',hash='b'.repeat(64),mail='recovery-fixture@example.invalid';
async function recovery(page,{expired=false,network=false}={}){
 let consumed=expired,resets=0,updates=0,requests=[];const identity={...session(),refresh_token:'legacy123456'};identity.access_token=identity.access_token.replace('.fixture-signature','.c2lnbmF0dXJl');
 await page.route(project+'/**',async route=>{
  const request=route.request(),url=new URL(request.url()),body=request.postData()?request.postDataJSON():{};requests.push({path:url.pathname,method:request.method(),body});
  if(url.pathname.endsWith('/recover')){resets++;requests.at(-1).redirectTo=url.searchParams.get('redirect_to');await route.fulfill({json:{}});return;}
  if(url.pathname.endsWith('/verify')||(url.pathname.endsWith('/token')&&url.searchParams.get('grant_type')==='pkce')){
   if(network){await route.abort('internetdisconnected');return;}
   if(consumed){await route.fulfill({status:403,json:{code:'otp_expired',msg:'Token has expired or is invalid'}});return;}consumed=true;await route.fulfill({json:identity});return;
  }
  if(url.pathname.endsWith('/user')){if(request.method()==='PUT')updates++;await route.fulfill({json:identity.user});return;}
  if(url.pathname.endsWith('/logout')){await route.fulfill({status:204,body:''});return;}
  await route.fulfill({status:400,json:{code:'invalid_request'}});
 });
 return{identity,requests,get resets(){return resets;},get updates(){return updates;},recoverNetwork(){network=false;}};
}
async function clean(page){await expect(page).toHaveURL(/\/recuperar$/);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);for(const link of await page.locator('a[href],form[action]').all()){const value=await link.getAttribute('href')||await link.getAttribute('action');expect(value).not.toMatch(/token_hash|access_token|refresh_token|fixture-pkce/);}}
test('The public recovery page needs no subscription and requests only its email; repeated requests wait sixty seconds',async({page},info)=>{
 await page.clock.install();const state=await recovery(page);await page.goto('/recuperar');await expect(page.getByRole('heading',{name:'Recupera tu contraseña.'})).toBeVisible();await expect(page.locator('input[type=password]')).toHaveCount(0);await page.getByLabel('Correo de tu cuenta').fill(mail);await page.getByRole('button',{name:'Enviar correo de recuperación',exact:true}).click();await expect(page.getByRole('heading',{name:'Revisa tu correo.'})).toBeVisible();expect(state.resets).toBe(1);await expect(page.locator('[data-recovery=resend]')).toBeDisabled();await page.clock.fastForward(61000);await page.getByRole('button',{name:'Enviar otro correo',exact:true}).click();await expect.poll(()=>state.resets).toBe(2);await clean(page);await page.screenshot({path:info.outputPath('recovery-request.png'),fullPage:true});
});
test('A recovery hash is validated, erased from history, changes the password and cannot be reused',async({page},info)=>{
 const state=await recovery(page);await page.goto('/recuperar#token_hash='+hash+'&type=recovery');await expect(page.getByRole('heading',{name:'Elige tu nueva contraseña.'})).toBeVisible();await clean(page);await page.getByLabel('Nueva contraseña',{exact:true}).fill('Nueva-frase-de-prueba-2026');await page.getByLabel('Repite la nueva contraseña',{exact:true}).fill('Otra-frase-distinta-2026');await page.getByRole('button',{name:'Cambiar mi contraseña',exact:true}).click();await expect(page.getByRole('alert')).toContainText('deben coincidir');expect(state.updates).toBe(0);await expect(page.getByLabel('Nueva contraseña',{exact:true})).toHaveValue('Nueva-frase-de-prueba-2026');await page.getByLabel('Repite la nueva contraseña',{exact:true}).fill('Nueva-frase-de-prueba-2026');await page.getByRole('button',{name:'Cambiar mi contraseña',exact:true}).click();await expect(page.getByRole('heading',{name:'Contraseña actualizada.'})).toBeVisible();expect(state.updates).toBe(1);expect(state.requests.some(r=>r.path.endsWith('/logout'))).toBe(true);await clean(page);await page.screenshot({path:info.outputPath('recovery-success.png'),fullPage:true});await page.goto('/recuperar#token_hash='+hash+'&type=recovery');await expect(page.getByRole('heading',{name:'Pidamos un enlace nuevo.'})).toBeVisible();await expect(page.locator('input[type=password]')).toHaveCount(0);await clean(page);
});
test('Expired and wrong-purpose links offer a new email without echoing the URL or showing a password form',async({page},info)=>{
 await recovery(page,{expired:true});await page.goto('/recuperar?token_hash='+hash+'&type=recovery&error_description=untrusted-private-provider-text');await expect(page.getByRole('heading',{name:'Pidamos un enlace nuevo.'})).toBeVisible();await expect(page.locator('body')).not.toContainText('untrusted-private-provider-text');await clean(page);await page.getByLabel('Correo de tu cuenta').fill(mail);await page.getByRole('button',{name:'Enviar correo de recuperación',exact:true}).click();await expect(page.getByRole('heading',{name:'Revisa tu correo.'})).toBeVisible();await page.screenshot({path:info.outputPath('recovery-expired.png'),fullPage:true});await page.goto('/recuperar#token_hash='+hash+'&type=signup');await expect(page.getByRole('heading',{name:'Pidamos un enlace nuevo.'})).toBeVisible();await expect(page.locator('input[type=password]')).toHaveCount(0);
});
test('Legacy Android implicit links and the older cuenta callback finish in the same public recovery screen',async({page})=>{
 const state=await recovery(page);await page.goto('/cuenta.html#access_token='+state.identity.access_token+'&refresh_token='+state.identity.refresh_token+'&type=recovery');await expect(page.getByRole('heading',{name:'Elige tu nueva contraseña.'})).toBeVisible();await clean(page);await page.reload();await expect(page.getByRole('heading',{name:'Elige tu nueva contraseña.'})).toBeVisible();
});
test('New recovery requests work across browsers without a PKCE verifier and always specify the public recovery path',async({page})=>{
 const state=await recovery(page);await page.goto('/recuperar');await page.getByLabel('Correo de tu cuenta').fill(mail);await page.getByRole('button',{name:'Enviar correo de recuperación',exact:true}).click();await expect(page.getByRole('heading',{name:'Revisa tu correo.'})).toBeVisible();const request=state.requests.find(r=>r.path.endsWith('/recover'));expect(new URL(request.redirectTo).pathname).toBe('/recuperar');expect(request.body.code_challenge).toBeNull();await clean(page);
});
test('A legacy PKCE recovery code also works at the default Site URL with its original verifier',async({page})=>{
 const state=await recovery(page);await page.addInitScript(()=>localStorage.setItem('cachaste-auth-v1-code-verifier',JSON.stringify('a'.repeat(64)+'/recovery')));await page.goto('/?code=fixture-pkce-single-use');await expect(page.getByRole('heading',{name:'Elige tu nueva contraseña.'})).toBeVisible();expect(state.requests.some(r=>r.path.endsWith('/token')&&r.body.auth_code==='fixture-pkce-single-use'&&r.body.code_verifier?.length>=43)).toBe(true);await clean(page);
});
test('The default Android email callback at the landing page opens the password form and skips commercial requests',async({page})=>{
 const state=await recovery(page),commercial=[];page.on('request',request=>{if(/\/api\/(billing|session)/.test(request.url()))commercial.push(request.url());});await page.goto('/#access_token='+state.identity.access_token+'&refresh_token='+state.identity.refresh_token+'&type=recovery');await expect(page.getByRole('heading',{name:'Elige tu nueva contraseña.'})).toBeVisible();await expect(page.getByText('Te lo dejamos')).toHaveCount(0);expect(commercial).toEqual([]);await clean(page);
});
test('An expired email returned to the landing page explains the problem instead of silently showing the homepage',async({page})=>{
 await recovery(page,{expired:true});await page.goto('/#error=access_denied&error_code=otp_expired&error_description=private-provider-detail');await expect(page.getByRole('heading',{name:'Pidamos un enlace nuevo.'})).toBeVisible();await expect(page.locator('body')).not.toContainText('private-provider-detail');await clean(page);
});
test('An email hash opened while the landing page is already in the same tab is still captured',async({page})=>{
 await recovery(page);await page.goto('/');await page.goto('/#token_hash='+hash+'&type=recovery');await expect(page.getByRole('heading',{name:'Elige tu nueva contraseña.'})).toBeVisible();await clean(page);
});
test('A normal signed-in session without a recovery link never grants the change-password form',async({page})=>{
 const state=await recovery(page);await page.addInitScript(value=>localStorage.setItem('cachaste-auth-v1',JSON.stringify(value)),state.identity);await page.goto('/recuperar');await expect(page.getByRole('heading',{name:'Recupera tu contraseña.'})).toBeVisible();await expect(page.locator('input[type=password]')).toHaveCount(0);expect(state.updates).toBe(0);
});
test('Connection errors keep the recovery material in memory for retry and never claim that a change succeeded',async({page})=>{
 const state=await recovery(page,{network:true});await page.goto('/recuperar#token_hash='+hash+'&type=recovery');await expect(page.getByRole('heading',{name:'Volvamos a intentarlo.'})).toBeVisible({timeout:20000});await clean(page);state.recoverNetwork();await page.getByRole('button',{name:'Reintentar conexión',exact:true}).click();await expect(page.getByRole('heading',{name:'Elige tu nueva contraseña.'})).toBeVisible();expect(state.updates).toBe(0);
});
