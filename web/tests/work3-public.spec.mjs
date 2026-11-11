import {test,expect} from '@playwright/test';
import {renderedContrast} from '../../tests/helpers/rendered-contrast.mjs';
for(const width of [320,360,390,430,1280])test(`${width}px: portada, acciones, formularios e información`,async({page},info)=>{
 await page.setViewportSize({width,height:width>600?900:844});await page.emulateMedia({reducedMotion:'reduce',colorScheme:'dark'});
 for(const path of ['/','/cuenta.html','/recuperar','/privacidad.html','/condiciones.html','/eliminar-cuenta.html']){
  await page.goto(path);await expect(page.locator('h1')).toBeVisible();
  if(path==='/cuenta.html')await expect(page.locator('#login-form')).toBeVisible();
  const measurements=await page.evaluate(renderedContrast,'main h1,main h2,main h3,main p,main li,main label,main button,main a,main small,main .eyebrow,main input,header a,footer p,footer a,footer small');
  expect(measurements.length).toBeGreaterThan(8);await info.attach(path.replaceAll('/','_')+'contrast.json',{body:JSON.stringify(measurements,null,2),contentType:'application/json'});
  expect(measurements.filter(x=>!x.passed)).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  if(path==='/'){
   await expect(page.locator('.hero-art img')).toHaveAttribute('src','/assets/landing-cat-rank-cutout.png');await expect(page.locator('.hero-art figcaption')).toHaveCount(0);
   expect(await page.locator('.hero-art img').evaluate(el=>getComputedStyle(el).objectFit)).toBe('contain');
   await page.locator('.hero-actions .secondary-button').click();await expect(page).toHaveURL(/#como-aprendes$/);
   await page.locator('.hero-actions .primary-button').click();await expect(page).toHaveURL(/cuenta.html$/);await expect(page.locator('#login-form')).toBeVisible();await page.goBack();
  }
  if(['/','/cuenta.html','/recuperar'].includes(path))await page.screenshot({path:info.outputPath(width+'-'+(path==='/'?'landing':path.slice(1))+'.png'),fullPage:true,animations:'disabled'});
 }
});

test('Portada anterior: recurso y composición del commit web revisado',async({page},info)=>{
 const {execFileSync}=await import('node:child_process');
 const html=execFileSync('git',['show','89b71fbc8f19750afaefd5fe15f068c521179a82:web/public/index.html'],{encoding:'utf8'}),css=execFileSync('git',['show','89b71fbc8f19750afaefd5fe15f068c521179a82:web/public/web.css'],{encoding:'utf8'});
 await page.route('http://127.0.0.1:4175/',r=>r.fulfill({contentType:'text/html',body:html}));await page.route('**/web.css',r=>r.fulfill({contentType:'text/css',body:css}));await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('.hero-art img')).toBeVisible();await page.screenshot({path:info.outputPath('before-landing-390.png'),fullPage:true,animations:'disabled'});
});
