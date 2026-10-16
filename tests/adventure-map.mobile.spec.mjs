import {test,expect} from '@playwright/test';

test('Mapa videojuego: camino curvo, gato-guía, portal y mundos navegables',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('./inicio.html#courses');
 await page.locator('[data-action=pick-course][data-subject=M1]').click();
 const world=page.locator('.adventure-world');
 await expect(world).toHaveClass(/world-foundation/);
 await test.info().attach('12-mapa-videojuego-fundamentos',{body:await page.screenshot({fullPage:true,animations:'disabled'}),contentType:'image/png'});
 await expect(world.locator('.trail-stop')).toHaveCount(5);
 await expect(world.locator('.trail-stop.current')).toHaveCount(1);
 await expect(world.locator('.trail-guide .cat-frame img')).toHaveAttribute('src','assets/gatito-sabio-poses-v1.png');
 await expect(world.locator('.world-hud')).toContainText('0 de 5 misiones dominadas');
 await expect(world.locator('.world-gate')).toBeVisible();
 const road=await world.locator('.road-track').getAttribute('d');
 expect(road).toMatch(/^M \d+ \d+ C /);
 await page.locator('[data-action=focus-quest]').click();
 await expect(world.locator('.trail-stop.current .trail-node')).toBeFocused();
 await world.locator('[data-action=next-stage]').click();
 await expect(world).toHaveClass(/world-numbers/);
 await test.info().attach('13-mundo-numeros',{body:await page.screenshot({fullPage:true,animations:'disabled'}),contentType:'image/png'});
 await expect(world.locator('.world-hud')).toContainText('MUNDO 2');
 await expect(world.locator('.trail-stop')).not.toHaveCount(0);
 await world.locator('.world-gate [data-action=next-stage]').click();
 await expect(world.locator('.world-hud')).toContainText('MUNDO 3');
 await expect(world).toHaveClass(/world-numbers/);
 await page.locator('.stage-banner [data-action=units]').click();
 await expect(page.locator('.world-picker')).toBeVisible();
 await expect(page.locator('.world-picker-tile').first()).toContainText('Fundamentos');
 await page.locator('[data-action=stage][data-stage=basics]').click();
 await expect(world).toHaveClass(/world-foundation/);
 expect(errors).toEqual([]);
});

test('Los mundos cambian según la asignatura y Ciencias conserva su mención',async({page})=>{
 await page.goto('./inicio.html#courses');
 for(const [subject,kind] of [['Lectura','reading'],['Historia','history'],['M2','foundation']]){
  await page.locator('[data-action=pick-course][data-subject="'+subject+'"]').click();
  await expect(page.locator('.adventure-world')).toHaveClass(new RegExp('world-'+kind));
  await page.locator('[data-action=courses]').first().click();
 }
 await page.locator('[data-action=pick-course][data-subject=Ciencias]').click();
 await expect(page.locator('[data-action=pick-track]')).toHaveCount(4);
 await page.locator('[data-action=pick-track][data-track="Biología"]').click();
 await expect(page.locator('.adventure-world')).toHaveClass(/world-science/);
 await test.info().attach('14-ciencias-mencion-biologia',{body:await page.screenshot({fullPage:true,animations:'disabled'}),contentType:'image/png'});
 await expect(page.locator('.game-toolbar')).toContainText('Biología');
 await page.reload();
 await expect(page.locator('.game-toolbar')).toContainText('Biología');
 await expect(page.locator('.adventure-world .trail-stop')).not.toHaveCount(0);
});

test('Los hitos se ganan al comprobar aprendizajes, sin porcentajes ficticios',async({page})=>{
 await page.goto('./inicio.html#courses');
 await page.locator('[data-action=pick-course][data-subject=M1]').click();
 await expect(page.locator('.world-hud')).toContainText('0 de 5 misiones dominadas');
 await page.evaluate(()=>{
   const e=CachasteDailyApp.engine;
   e.state.basics.cantidad={history:[
    {id:'cantidad-1',correct:true,hinted:false},
    {id:'cantidad-2',correct:true,hinted:false}
   ]};
   e.save();CachasteDailyApp.render();
 });
 await expect(page.locator('.world-hud')).toContainText('1 de 5 misiones dominadas');
 await expect(page.locator('.trail-stop.mastered')).toHaveCount(1);
 await expect(page.locator('.trail-stop.current')).toHaveCount(1);
 await expect(page.locator('.world-gate')).toHaveClass(/gate-distant/);
 await test.info().attach('15-mapa-con-mision-superada',{body:await page.screenshot({fullPage:true,animations:'disabled'}),contentType:'image/png'});
});

test('Al completar un mundo aparece el portal y se puede volver a jugar',async({page})=>{
 await page.goto('./inicio.html#courses');
 await page.locator('[data-action=pick-course][data-subject=M1]').click();
 await page.evaluate(()=>{
  const e=CachasteDailyApp.engine,b=CachasteDailyApp.basics;
  e.state.basics||={};
  for(const l of b.lessons.filter(x=>!x.subject)){
   e.state.basics[l.id]={history:l.checks.slice(0,2).map(q=>({id:q.id,correct:true,hinted:false}))};
  }
  (e.state.stages||={}).M1='basics';
  e.save();CachasteDailyApp.render();
 });
 await expect(page.locator('.adventure-world')).toHaveClass(/world-foundation/);
 await expect(page.locator('.world-hud')).toContainText('5 de 5 misiones dominadas');
 await expect(page.locator('.world-gate')).toHaveClass(/gate-ready/);
 await expect(page.locator('.world-gate-cat .cat-frame')).toBeVisible();
 await test.info().attach('16-portal-mundo-completado',{body:await page.screenshot({fullPage:true,animations:'disabled'}),contentType:'image/png'});
 await page.locator('.world-gate [data-action=next-stage]').click();
 await expect(page.locator('.adventure-world')).toHaveClass(/world-numbers/);
 await page.locator('.stage-banner [data-action=units]').click();
 await page.locator('[data-action=stage][data-stage=basics]').click();
 await expect(page.locator('.world-gate')).toHaveClass(/gate-ready/);
});

test('Mapa accesible y estable en pantallas pequeñas y con movimiento reducido',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('./inicio.html#courses');
 await page.locator('[data-action=pick-course][data-subject=M1]').click();
 await expect(page.locator('.world-cloud').first()).toHaveCSS('animation-name','none');
 await expect(page.locator('.trail-guide')).toHaveCSS('animation-name','none');
 const details=await page.evaluate(()=>{
  const el=document.documentElement,world=document.querySelector('.adventure-world'),road=world.querySelector('.adventure-road');
  return {overflow:el.scrollWidth-window.innerWidth,hasRoad:!!road.querySelector('.road-track').getAttribute('d'),worldWidth:world.getBoundingClientRect().width};
 });
 expect(details.overflow).toBeLessThanOrEqual(1);
 expect(details.hasRoad).toBe(true);
 expect(details.worldWidth).toBeGreaterThan(200);
});
