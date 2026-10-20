import {test,expect} from '@playwright/test';
async function choose(page,subject){await page.goto('./inicio.html#courses');await page.locator('[data-action=pick-course][data-subject="'+subject+'"]').click();if(subject==='Ciencias')await page.locator('[data-track=Biología]').click();}
for(const subject of ['M1','M2','Lectura','Ciencias','Historia']){
 test(subject+': materia, dos modos claros y camino bloqueado en orden',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await choose(page,subject);
  await expect(page.locator('.mode-choices button')).toHaveCount(2);await expect(page.locator('[data-action=game-mode]')).toContainText('Aprender jugando');await expect(page.locator('[data-action=exam-mode]')).toContainText('Ensayo PAES completo');
  await page.locator('[data-action=game-mode]').click();await expect(page.locator('.adventure-world')).toBeVisible();await expect(page.locator('.trail-stop.current')).toHaveCount(1);
  expect(await page.locator('[data-action=practice]').count()).toBe(0);expect(await page.locator('.studio-feature').count()).toBe(0);
  const last=await page.evaluate(()=>{const e=CachasteDailyApp.engine,p=CachasteProgression.route(CACHASTE_DAILY_CATALOG.items,e.state.subject,e.state.track,e.profile(e.state.subject));return p.levels.at(-1).id;});
  await page.evaluate(id=>{location.hash='#level:'+encodeURIComponent(id);},last);await expect(page.locator('.skill-gate')).toBeVisible();await expect(page.locator('[data-action=lesson]')).toHaveCount(0);
  await page.locator('.skill-gate [data-action=level]').click();await expect(page.locator('.mission-actions button')).toHaveCount(2);await expect(page.locator('[data-action=lesson]')).toHaveText('Comenzar lección');
  expect(errors).toEqual([]);
 });
 test(subject+': ensayo completo directo sin diagnóstico obligatorio ni corrección anticipada',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await choose(page,subject);await page.locator('[data-action=exam-mode]').click();
  await expect(page).toHaveURL(/modo=ensayo/);await expect(page.locator('[data-choice],.option,.answer-option,[onclick*=answer],[onclick*=choose]')).not.toHaveCount(0);expect(errors).toEqual([]);
  const count=await page.evaluate(()=>{const subject=new URLSearchParams(location.search);if(location.pathname.endsWith('/index.html'))return queue.length;const keys=Object.keys(localStorage).filter(k=>/science|reading|m2|history/.test(k));for(const key of keys){let s;try{s=JSON.parse(localStorage.getItem(key))?.session}catch{}if(s?.ids)return s.ids.length;}return 0;});expect(count).toBe(subject==='M2'?55:subject==='Ciencias'?80:65);
 });
}
