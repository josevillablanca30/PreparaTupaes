import {test,expect} from '@playwright/test';

const cases=[['M2','M2-006'],['M2','M2-113'],['Historia','HIS-002'],['Ciencias','SCI-001']];
for(const [subject,id] of cases)test(subject+' '+id+': título, fórmulas, controles y tutor conservan su espacio',async({page},info)=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('./inicio.html');
 await page.evaluate(({subject,id})=>{
  const e=CachasteDailyApp.engine,q=CACHASTE_DAILY_CATALOG.items.find(q=>q.subjectKey===subject&&q.id===id);
  e.state.track=subject==='Ciencias'?q.subject:null;e.start(subject,2,'lesson',q.concept);
  e.state.session.keys[0]=q.key;location.hash='#session';CachasteDailyApp.render();
 },{subject,id});
 const title=page.locator('.reference-lesson-hero h1');
 expect(await title.evaluate(n=>n.scrollWidth<=n.clientWidth+2)).toBe(true);
 const titleBox=await title.boundingBox(),catBox=await page.locator('.reference-lesson-hero .lesson-scene').boundingBox();
 expect(titleBox.x+titleBox.width).toBeLessThanOrEqual(catBox.x+1);
 for(const n of await page.locator('.lesson-chapters button,.lesson-reading-control button,.lesson-top button').all())expect((await n.boundingBox()).height).toBeGreaterThanOrEqual(48);
 await info.attach('lesson-'+id,{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
 await page.locator('[data-action=begin-question]').click();
 const wrong=await page.evaluate(()=>{const e=CachasteDailyApp.engine,s=e.state.session,q=e.byKey.get(s.keys[0]);return(q.answer+1)%q.options.length});
 await page.locator('[data-action=choice][data-index="'+wrong+'"]').click();await page.locator('[data-action=check]').click();
 await page.locator('[data-mode=example]').click();
 const example=page.locator('.reference-example-card');await example.scrollIntoViewIfNeeded();
 expect(await page.locator('.reference-example-card li,.tutor li').evaluateAll(ns=>ns.every(n=>n.scrollWidth<=n.clientWidth+2))).toBe(true);
 await info.attach('example-'+id,{body:await page.screenshot({animations:'disabled'}),contentType:'image/png'});
});
