import {test,expect} from '@playwright/test';

const firstCourse=async(page,subject)=>{
 await page.goto('./inicio.html#courses');
 await page.locator('[data-action=pick-course][data-subject="'+subject+'"]').click();await page.waitForURL(/#(?:tracks|modes|home)$/);if(await page.evaluate(()=>location.hash==='#modes')){await page.locator('[data-action=game-mode]').click();await page.locator('.mode-picker').waitFor({state:'detached'});}
 if(subject==='Ciencias')await page.locator('[data-action=pick-track][data-track="Biología"]').click();await page.waitForURL(/#(?:tracks|modes|home)$/);if(await page.evaluate(()=>location.hash==='#modes')){await page.locator('[data-action=game-mode]').click();await page.locator('.mode-picker').waitFor({state:'detached'});}
 await expect(page.locator('.adventure-world')).toBeVisible();
 await expect(page.locator('.stage-banner')).toBeVisible();
 await page.locator('.stage-banner [data-action=units]').click();
 await page.locator('[data-action=stage][data-stage=basics]').click();
 await page.locator('[data-action=basic-level]').first().click();
};

for(const [subject,title,firstQuestion] of [
 ['Historia','Conectar procesos de Chile y el mundo',/Primera Junta de Gobierno.*independencia/i],
 ['Lectura','Leer entre líneas',/columna sostiene/i],
 ['Ciencias','Investigar con criterio',/reacciones químicas/i]
]){
 test(subject+' empieza con un caso PAES, numeración 1 y un solo gatito que explica',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await firstCourse(page,subject);
  await expect(page.locator('.mission-emblem')).toHaveText('1');
  await expect(page.locator('.mission-preview h1')).toHaveText(title);
  await expect(page.locator('.mission-preview')).not.toContainText('Aprende con imágenes');
  await page.locator('[data-action=basic-start]').click();
  await expect(page.locator('.teacher-step .wise-cat')).toHaveCount(1);
  await expect(page.locator('.lesson-sheet .cat-frame')).toHaveCount(1);
  await expect(page.locator('.lesson-sheet')).not.toContainText('antes de usar una fórmula');
  await expect(page.locator('.lesson-sheet')).not.toContainText('cada cantidad');
  await expect(page.locator('.teacher-step-meta')).toContainText('IDEA CLAVE');
  if(subject==='Historia'||subject==='Ciencias')await expect(page.locator('.concept-bridge')).toBeVisible();
  await test.info().attach(subject+'-contexto-enseñanza-media',{body:await page.screenshot({fullPage:true,animations:'disabled'}),contentType:'image/png'});
  while(await page.locator('[data-action=basic-forward]').count())await page.locator('[data-action=basic-forward]').click();
  await expect(page.locator('.question-title')).toHaveText(firstQuestion);
  await expect(page.locator('.lesson-sheet .cat-frame')).toHaveCount(1);
  await expect(page.locator('.teacher-step')).toHaveCount(0);
  await page.locator('[data-action=basic-hint]').click();
  await expect(page.locator('.hint')).toBeVisible();
  await expect(page.locator('.hint')).not.toContainText('Relacionar un número');
  await test.info().attach(subject+'-primera-pregunta-PAES',{body:await page.screenshot({fullPage:true,animations:'disabled'}),contentType:'image/png'});
  expect(errors).toEqual([]);
 });
}

test('El antiguo 8 ya no aparece como la misión 1 de Historia y el registro antiguo no acredita la nueva evaluación',async({page})=>{
 await page.goto('./inicio.html#courses');
 await page.locator('[data-action=pick-course][data-subject=Historia]').click();await page.waitForURL(/#(?:tracks|modes|home)$/);if(await page.evaluate(()=>location.hash==='#modes')){await page.locator('[data-action=game-mode]').click();await page.locator('.mode-picker').waitFor({state:'detached'});}
 await page.locator('.stage-banner [data-action=units]').click();
 await page.locator('[data-action=stage][data-stage=basics]').click();
 await page.evaluate(()=>{
  const e=CachasteDailyApp.engine;
  e.state.basics??={};
  e.state.basics['historia-inicio']={history:[
   {id:'historia-inicio-1',correct:true,hinted:false},
   {id:'historia-inicio-2',correct:true,hinted:false}
  ]};
  e.save();CachasteDailyApp.render();
 });
 await expect(page.locator('.world-hud')).toContainText('0 de 1 misiones dominadas');
 await page.locator('.trail-stop.current [data-action=basic-level]').click();
 await expect(page.locator('.mission-emblem')).toHaveText('1');
 await expect(page.locator('.mission-preview h1')).toContainText('Conectar procesos de Chile y el mundo');
});
