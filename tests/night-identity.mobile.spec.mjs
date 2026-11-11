import {test,expect} from '@playwright/test';
import {readable} from './helpers/readable-surface.mjs';
const subjects=['M1','M2','Lectura','Historia','Ciencias'];
async function fits(page){expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);}
async function dark(page){expect(await page.locator('body').evaluate(n=>getComputedStyle(n).backgroundColor)).toBe('rgb(8, 6, 17)');}
async function screen(page,info,name){await page.screenshot({path:info.outputPath(name+'.png'),fullPage:true,animations:'disabled'});}
test.beforeEach(async({page})=>{await page.emulateMedia({reducedMotion:'reduce'});});
test('Portada, recorrido y progreso conservan la misma identidad y sus datos reales',async({page},info)=>{
 await page.goto('./inicio.html#courses');await dark(page);await expect(page.getByRole('heading',{name:'Tu camino, a tu ritmo'})).toBeVisible();await screen(page,info,'01-portada');
 await page.locator('[data-action=pick-course][data-subject=M1]').click();await dark(page);await readable(page.locator('.mode-picker h1'));await screen(page,info,'02-modos');
 await page.locator('[data-action=game-mode]').click();await dark(page);await expect(page.locator('.mentor-stage')).toHaveAttribute('src','assets/competition-cat-book-v4.webp');await expect(page.locator('.trail-stop.current')).toHaveCount(1);await expect(page.locator('.trail-stop.locked')).toHaveCount(4);
 expect(await page.locator('.trail-stop.locked button').evaluateAll(ns=>ns.every(n=>n.disabled))).toBe(true);await readable(page.locator('.stage-banner h1'));await readable(page.locator('.world-hud p'));await fits(page);await screen(page,info,'03-recorrido');
 for(const item of await page.locator('.trail-stop strong,.trail-status,.world-gate-copy strong,.world-gate-copy p:visible,.trail-stop.current .trail-node').all())await readable(item);
 const before=await page.evaluate(()=>{const e=CachasteDailyApp.engine;return{xp:e.stats().xp,attempts:e.state.attempts.length,completed:e.state.completed.length};});
 await page.locator('.daily-nav [data-action=progress]').click();await dark(page);await expect(page.locator('.progress-stats')).toBeVisible();await expect(page.getByRole('heading',{name:'Ensayos Express',exact:true})).toBeVisible();await expect(page.getByRole('heading',{name:'Últimas sesiones',exact:true})).toBeVisible();
 for(const item of await page.locator('.daily-card h2,.daily-card p,.daily-nav [aria-current=page]').all())await readable(item);
 await fits(page);await screen(page,info,'04-progreso');await page.reload();await dark(page);expect(await page.evaluate(()=>{const e=CachasteDailyApp.engine;return{xp:e.stats().xp,attempts:e.state.attempts.length,completed:e.state.completed.length};})).toEqual(before);
});
for(const subject of subjects)test(subject+': el tutor mantiene lectura, contraste y maestro oficial',async({page},info)=>{
 await page.goto('./inicio.html');const content=await page.evaluate(subject=>{const e=CachasteDailyApp.engine,seed=CACHASTE_DAILY_CATALOG.items.find(q=>q.subjectKey===subject);e.close();e.state.track=subject==='Ciencias'?seed.subject:null;e.start(subject,2,'lesson',seed.concept);const q=e.byKey.get(e.state.session.keys[0]);location.hash='#session';CachasteDailyApp.render();return{key:q.key,question:q.question,options:q.options,answer:q.answer,foundation:q.teaching.foundation};},subject);
 await dark(page);await expect(page.locator('.reference-lesson-hero')).toBeVisible();await expect(page.locator('.reference-lesson-hero .official-master img')).toHaveAttribute('src',/competition-cat-(book|point|crossed)-v4\.webp$/);
 expect(await page.locator('.official-master img').evaluateAll(ns=>ns.every(n=>n.complete&&n.naturalWidth>0))).toBe(true);
 for(const heading of await page.locator('.reference-lesson-hero h1,.reference-speech,.reference-subject,.didactic-overview h2,.didactic-key>p,.didactic-depth summary,.lab-caption,.worked-pin,.worked-status,.visual-guided-note,.lesson-chapters button').all())await readable(heading);
 expect(await page.locator('.lesson-chapters button').evaluateAll(ns=>ns.every(n=>n.scrollWidth<=n.clientWidth+1))).toBe(true);
 await fits(page);await screen(page,info,'05-leccion-'+subject);
 await page.locator('[data-action=begin-question]').click();await expect(page.locator('.question-title')).toHaveText(content.question);await readable(page.locator('.question-title'));for(const option of await page.locator('.daily-options button').all())await readable(option);
 await fits(page);await screen(page,info,'06-pregunta-'+subject);
 const wrong=(content.answer+1)%content.options.length;await page.locator('[data-action=choice][data-index="'+wrong+'"]').click();await page.locator('[data-action=check]').click();await expect(page.locator('.tutor')).toBeVisible();await readable(page.locator('.tutor h3').first());
 for(const item of await page.locator('.daily-options button,.answer-feedback,.tutor .lesson-text p,.tutor .complete-correction aside p,.tutor .complete-correction aside strong,.tutor summary:visible,.confidence-guide strong,.confidence-guide p,.confidence-guide small,.selected-repair small').all())await readable(item);
 expect(await page.evaluate(key=>{const q=CachasteDailyApp.engine.byKey.get(key);return{question:q.question,options:q.options,answer:q.answer,foundation:q.teaching.foundation};},content.key)).toEqual({question:content.question,options:content.options,answer:content.answer,foundation:content.foundation});
 await fits(page);await screen(page,info,'07-tutor-'+subject);
});
for(const [file,name] of [['index.html','M1'],['m2.html','M2'],['reading.html','Lectura'],['history.html','Historia'],['science.html','Ciencias']])test(name+': ensayo y revisión comparten el fondo de la app',async({page},info)=>{
 await page.goto('./'+file);await dark(page);await fits(page);for(const heading of await page.locator('h1:visible,h2:visible,h3:visible,h4:visible,p:visible,small:visible,label:visible,legend:visible,summary:visible,a:visible,button:not(:disabled):visible,.brand b:visible,.pill:visible').all())await readable(heading);await screen(page,info,'08-ensayo-'+name);
});
