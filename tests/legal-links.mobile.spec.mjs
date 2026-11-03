import{test,expect}from'@playwright/test';
import{fixturePage}from'./helpers/competition-fixtures.mjs';
const origin='https://work-cachaste-web-comercial.cachaste-sitecacho.pages.dev';
for(const signed of[false,true])test('Legal links remain available '+(signed?'with an expired educational grant':'before account login'),async({page})=>{
 await fixturePage(page,{signed,premium:false});await page.goto('./competencia.html#perfil');
 for(const slug of['privacidad','condiciones','eliminar-cuenta']){const link=page.locator('.competition-legal-links a[href="'+origin+'/'+slug+'.html"]');await expect(link).toBeVisible();await link.scrollIntoViewIfNeeded();await expect(link).toBeInViewport();}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.route(origin+'/eliminar-cuenta.html',r=>r.fulfill({contentType:'text/html',body:'<h1>Solicitud pública de eliminación</h1>'}));
 await page.locator('.competition-legal-links a[href="'+origin+'/eliminar-cuenta.html"]').click();await expect(page).toHaveURL(origin+'/eliminar-cuenta.html');await expect(page.getByRole('heading')).toHaveText('Solicitud pública de eliminación');
});
