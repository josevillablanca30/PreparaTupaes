import{test,expect}from'@playwright/test';
import{fixturePage,opponent}from'./helpers/competition-fixtures.mjs';

test('Community consent is required before saving and never adds account or payment fields',async({page})=>{
 const requests=await fixturePage(page);await page.goto('./competencia.html#perfil');
 const consent=page.getByLabel('He leído y acepto las reglas de comunidad.',{exact:true});await expect(consent).toBeChecked();await consent.uncheck();
 await page.getByRole('button',{name:'Guardar mi perfil',exact:true}).click();expect(requests.filter(r=>r.operation==='save_profile')).toHaveLength(0);
 await page.locator('.community-rules summary').click();await expect(page.getByText('No suplantes a otra persona',{exact:false})).toBeVisible();
 await consent.check();await page.getByRole('button',{name:'Guardar mi perfil',exact:true}).click();await expect.poll(()=>requests.some(r=>r.operation==='save_profile')).toBe(true);
 const p=requests.find(r=>r.operation==='save_profile').payload;expect(p.communityVersion).toBe('2026-10-23');expect(p).not.toHaveProperty('community_accepted_at');expect(p).not.toHaveProperty('moderation_status');
});

test('Report uses a selected reason and sends only target and reason',async({page})=>{
 const requests=await fixturePage(page);await page.goto('./competencia.html#rankings');
 const options=page.getByRole('button',{name:'Opciones de CataPAES',exact:true});await expect(options).toBeVisible();const box=await options.boundingBox();expect(box.width).toBeGreaterThanOrEqual(48);expect(box.height).toBeGreaterThanOrEqual(48);
 await options.click();await page.getByRole('button',{name:'Denunciar estudiante',exact:true}).click();await page.getByLabel('Motivo',{exact:true}).selectOption('nickname');await page.getByRole('button',{name:'Enviar denuncia',exact:true}).click();
 await expect(page.locator('#competition-root').getByText('Denuncia recibida para revisión.',{exact:true})).toBeVisible();expect(requests.find(r=>r.operation==='report').payload).toEqual({userId:opponent.id,reason:'nickname'});
});

test('Block hides the ranking row; privacy management remains available after Premium expires',async({page})=>{
 const requests=await fixturePage(page);await page.goto('./competencia.html#rankings');await expect(page.locator('.ranking-row')).toHaveCount(6);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.getByRole('button',{name:'Opciones de CataPAES',exact:true}).click();await page.getByRole('button',{name:'Bloquear estudiante',exact:true}).click();await expect(page.locator('.ranking-row')).toHaveCount(5);
 await page.getByRole('link',{name:'Perfil',exact:true}).click();await page.getByRole('button',{name:'Ver estudiantes bloqueados',exact:true}).click();await expect(page.locator('dialog')).toContainText('CataPAES');await page.getByRole('button',{name:'Desbloquear',exact:true}).click();await expect(page.locator('dialog')).toContainText('No tienes estudiantes bloqueados.');expect(requests.filter(r=>r.operation==='unblock')).toHaveLength(1);
});

test('Safety actions work without a subscription from an existing duel',async({page})=>{
 const requests=await fixturePage(page,{premium:false});await page.goto('./competencia.html#perfil');await page.getByRole('button',{name:'Ver estudiantes bloqueados',exact:true}).click();await expect(page.locator('dialog')).toContainText('No tienes estudiantes bloqueados.');expect(requests.some(r=>r.operation==='blocked_users')).toBe(true);
});
