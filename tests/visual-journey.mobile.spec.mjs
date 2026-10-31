import {test,expect} from '@playwright/test';

const noOverflow=async page=>expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
const capture=async(page,name)=>{await noOverflow(page);await test.info().attach(name,{body:await page.screenshot({fullPage:true,animations:'disabled'}),contentType:'image/png'});};
const start=async page=>{await page.goto('./inicio.html#courses');await expect(page.locator('[data-action=pick-course]')).toHaveCount(5);await capture(page,'01-materias');await page.locator('[data-action=pick-course][data-subject=M1]').click();await page.waitForURL(/#(?:tracks|modes|home)$/);if(await page.evaluate(()=>location.hash==='#modes')){await page.locator('[data-action=game-mode]').click();await page.locator('.mode-picker').waitFor({state:'detached'});}await expect(page.locator('.learning-trail .trail-node').first()).toBeVisible();await capture(page,'02-mapa-misiones');};

test('Auditoría visual: materias, mapa, fundamentos, respuesta y celebración',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await start(page);
 await expect(page.locator('.trail-stop.current')).toHaveCount(1);
 await expect(page.locator('.trail-stop.current .trail-node')).toBeVisible();
 await page.locator('.stage-banner [data-action=units]').click();
 await page.locator('[data-action=stage][data-stage=basics]').click();
 await page.locator('[data-action=basic-level]').first().click();
 await capture(page,'03-mision');
 await page.locator('[data-action=basic-start]').click();
 await expect(page.locator('.teacher-step .wise-cat[data-cat-state=explaining]')).toBeVisible();
 await expect(page.locator('.lesson-sheet .cat-frame')).toHaveCount(1);
 await expect(page.locator('.lesson-meter[role=progressbar]')).toBeVisible();
 await capture(page,'04-gatito-explica');
 while(await page.locator('[data-action=basic-forward]').count())await page.locator('[data-action=basic-forward]').click();
 await capture(page,'05-pregunta');
 for(let i=0;i<2;i++){
   const q=await page.evaluate(()=>CachasteDailyApp.basics.current());
   await page.locator('[data-action=basic-choice][data-index="'+q.answer+'"]').click();
   await page.locator('[data-action=basic-check]').click();
   await expect(page.locator('.wise-cat[data-cat-state=celebrating]')).toBeVisible();
   await capture(page,'06-gatito-acierto-'+i);
   await page.locator('[data-action=basic-next]').click();
 }
 await expect(page.locator('.celebration-screen')).toBeVisible();
 // The official sprite has an off-center cell: both paws must fit in the actual viewport.
 await page.emulateMedia({reducedMotion:'reduce'});
 expect(await page.locator('.celebration-screen .cat-frame img').evaluate(im=>{
  const style=getComputedStyle(im),width=parseFloat(style.width),left=parseFloat(style.left);
  return -left/width*im.naturalWidth<=38.5 && (im.parentElement.clientWidth-left)/width*im.naturalWidth>=545.5;
 })).toBe(true);
 await capture(page,'07-celebracion');
 await page.reload();
 await expect(page.locator('.celebration-screen')).toBeVisible();
 await noOverflow(page);
 expect(errors).toEqual([]);
});

test('Auditoría visual: tutor, opciones y retroalimentación sin desbordes',async({page})=>{
 await start(page);
 await page.evaluate(()=>{const e=CachasteDailyApp.engine;e.start('M1',2,'lesson','Descuento porcentual');location.hash='#session';CachasteDailyApp.render();});
 while(await page.locator('[data-action=intro-next]').count())await page.locator('[data-action=intro-next]').click();
 await page.locator('[data-action=begin-question]').click();
 const q=await page.evaluate(()=>{const e=CachasteDailyApp.engine;return e.byKey.get(e.state.session.keys[0]);});
 await capture(page,'08-pregunta-paes');
 await page.locator('[data-action=choice][data-index="'+((q.answer+1)%4)+'"]').click();

 await page.locator('[data-action=check]').click();
 await expect(page.locator('.wise-cat[data-cat-state=error]')).toBeVisible();
 await expect(page.locator('.tutor')).toBeVisible();
 await capture(page,'09-error-y-tutor');
 await page.locator('[data-mode=easy]').click();
 await expect(page.locator('.tutor .lesson-text')).toBeVisible();
 await capture(page,'10-tutor-facil');
 await noOverflow(page);
});

test('Auditoría de movimiento reducido: mascota y recompensas accesibles',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await start(page);
 await expect(page.locator('.trail-stop.current .trail-node')).toHaveCSS('animation-name','none');
 await page.locator('.stage-banner [data-action=units]').click();
 await page.locator('[data-action=stage][data-stage=basics]').click();
 await page.locator('[data-action=basic-level]').first().click();
 await page.locator('[data-action=basic-start]').click();
 await expect(page.locator('.wise-cat .cat-frame').first()).toHaveCSS('animation-name','none');
 await capture(page,'11-movimiento-reducido');
});
