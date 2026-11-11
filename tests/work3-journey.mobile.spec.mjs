import {test,expect} from '@playwright/test';
import {renderedContrast} from './helpers/rendered-contrast.mjs';
import {fixturePage} from './helpers/competition-fixtures.mjs';
const text='h1,h2,h3,h4,p,small,li,summary,legend,label,button,a,strong,b,select,input';
function inside(scope){return text.split(',').map(t=>scope+' '+t).join(',');}
async function snapshot(page,info,scope,label){
 const rows=await page.evaluate(renderedContrast,inside(scope));
 expect(rows.length,label+' real text coverage').toBeGreaterThan(4);
 await info.attach(label+'-contrast.json',{body:JSON.stringify(rows,null,2),contentType:'application/json'});
 expect.soft(rows.filter(r=>!r.passed),label+' contrast').toEqual([]);
 expect.soft(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+' viewport fit').toBe(true);
 await page.screenshot({path:info.outputPath(label+'.png'),fullPage:true,animations:'disabled',scale:'css'});
}
test.beforeEach(async({page})=>{await page.setViewportSize({width:320,height:750});await page.emulateMedia({reducedMotion:'reduce',colorScheme:'dark'});});
test('De la asignatura al diagnóstico, mapa, ensayo Express y resultado guardado',async({page},info)=>{
 await page.goto('./inicio.html#courses');await page.locator('[data-action=pick-course][data-subject=M1]').click();
 await expect(page.locator('.mode-picker')).toBeVisible();await snapshot(page,info,'.mode-picker','modos');
 for(const mode of ['diagnostic','express']){
  if(mode==='express')await page.goto('./inicio.html#modes');
  await page.locator(`[data-action=${mode}-mode]`).click();await expect(page.locator('.question-title')).toBeVisible();
  await snapshot(page,info,'#daily-root',mode+'-question');
  await page.evaluate(()=>{
   const e=CachasteDailyApp.engine,n=e.state.session.keys.length;
   for(let i=0;i<n;i++){
    const q=e.byKey.get(e.state.session.keys[e.state.session.index]);document.querySelector('[data-action=choice][data-index="'+q.answer+'"]').click();
    document.querySelector('[data-action=check]').click();document.querySelector('[data-action=next]').click();
   }
  });
  await expect(page.locator('.express-report')).toBeVisible();await snapshot(page,info,'.express-report',mode+'-result');
  if(mode==='diagnostic'){await page.locator('[data-action=diagnostic-path]').click();await expect(page.locator('.adventure-world')).toBeVisible();await snapshot(page,info,'.adventure-world','mapa');}
 }
 const before=await page.evaluate(()=>localStorage.getItem('cachaste-daily-v1'));await page.reload();
 expect(await page.evaluate(()=>localStorage.getItem('cachaste-daily-v1'))).toBe(before);
});
for(const [file,subject] of [['index.html','M1'],['m2.html','M2'],['reading.html','Lectura'],['history.html','Historia'],['science.html','Ciencias']])test(`${subject}: diagnóstico clásico y opciones de evaluación reales`,async({page},info)=>{
 await page.goto('./'+file);
 await page.getByRole('button',{name:/diagnóstico/i}).first().click();
 const options=page.locator('button.option,button.choice');await expect(options.first()).toBeVisible();
 await snapshot(page,info,'main',subject+'-classical-normal');await options.first().click();await snapshot(page,info,'main',subject+'-classical-selected');
});
test('Duelos actuales, rankings, perfil y suscripción se pueden leer a 320 px',async({page},info)=>{
 await fixturePage(page);
 for(const [hash,selector] of [['duelos','.duel-row'],['rankings','.ranking-row'],['perfil','#profile-region']]){
  await page.goto('./competencia.html#'+hash);await expect(page.locator(selector).first()).toBeVisible();await snapshot(page,info,'#competition-root',hash);
 }
 await page.goto('./suscripcion.html');await expect(page.locator('#subscribe')).toBeDisabled();await snapshot(page,info,'main','suscripcion');
});
