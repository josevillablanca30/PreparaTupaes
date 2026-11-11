import {test,expect} from '@playwright/test';
import {renderedContrast} from './helpers/rendered-contrast.mjs';
import {execFileSync} from 'node:child_process';
const subjects=[['M1',null],['M2',null],['Lectura',null],['Historia',null],['Ciencias','Biología'],['Ciencias','Física'],['Ciencias','Química'],['Ciencias','TP']];
const targets='.reference-speech,.didactic-overview *,.reference-easy-card *,.reference-example-card *,.tutor *,.wise-cat p,.answer-feedback,.selected-repair *,.confidence-guide *,.daily-options button,.question-title,.lesson-chapters button,.daily-session-head *,.daily-card>.kicker,#daily-root [data-action=check],#daily-root [data-action=hint],#daily-root [data-action=pause]';
async function audit(page,info,label){
 const measurements=await page.evaluate(renderedContrast,targets);
 expect(measurements.length,'Educational text must actually be measured').toBeGreaterThan(10);
 await info.attach(label+'-contrast.json',{body:JSON.stringify(measurements,null,2),contentType:'application/json'});
 expect(measurements.filter(m=>!m.passed),label+' actual text fill, alpha and gradient contrast').toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+' horizontal fit').toBe(true);
 expect(await page.locator('.daily-options button:visible,.visual-choices button:visible').evaluateAll(ns=>ns.every(n=>n.getBoundingClientRect().height>=44)),label+' touch targets').toBe(true);
}
async function seed(page,subject,track,kind='lesson'){
 return page.evaluate(({subject,track,kind})=>{
  const e=CachasteDailyApp.engine;e.close();e.state.foundationDraft=null;e.state.track=track;
  const pool=CachasteCurriculum.sciencePool(CACHASTE_DAILY_CATALOG.items,track);
  const q=pool.find(q=>q.subjectKey===subject&&(!track||track==='TP'||q.subject===track));
  if(!q)throw Error('Missing real subject content');e.start(subject,2,kind,q.concept);location.hash='#session';CachasteDailyApp.render();
  return{xp:e.stats().xp,attempts:e.state.attempts.length};
 },{subject,track,kind});
}
async function capture(page,info,name){await page.screenshot({path:info.outputPath(name+'.png'),fullPage:true,animations:'disabled'});}
for(const width of [320,360,390,430,1280])for(const[subject,track]of subjects){
 test(`${width}px · ${subject} ${track||''}: tutor, mini práctica y alternativas`,async({page},info)=>{
  await page.setViewportSize({width,height:width>600?900:844});await page.emulateMedia({reducedMotion:'reduce',colorScheme:'dark'});
  await page.goto('./inicio.html');const before=await seed(page,subject,track);
  await expect(page.locator('.didactic-overview')).toBeVisible();
  await audit(page,info,'lesson');await capture(page,info,'lesson');
  // Work through the real mini-practice controls, including wrong/correct feedback.
  const probe=page.locator('.didactic-practice [data-action=visual-choose]');
  if(await probe.count()){
   const answer=await page.evaluate(()=>{const e=CachasteDailyApp.engine,q=e.byKey.get(e.state.session.keys[0]);return CachasteLessons.deck(q).cards.find(c=>c.kind==='probe').answer;});
   await probe.nth((answer+1)%await probe.count()).click();await audit(page,info,'mini-wrong');await capture(page,info,'mini-wrong');
   await probe.nth(answer).click();await audit(page,info,'mini-correct');
  }else if(await page.locator('.didactic-practice [data-visual-answer]').count()){
   const answer=await page.evaluate(()=>{const e=CachasteDailyApp.engine,q=e.byKey.get(e.state.session.keys[0]),c=CachasteLessons.deck(q).cards.find(c=>c.kind==='laboratory');return CachasteLessons.labs[c.lab].task.answer;});
   const input=page.locator('.didactic-practice [data-visual-answer]');await input.fill(String(answer+100));await page.locator('.didactic-practice [data-action=visual-try]').click();await audit(page,info,'mini-wrong');
   await input.fill(String(answer));await page.locator('.didactic-practice [data-action=visual-try]').click();await audit(page,info,'mini-correct');
  }else if(await page.locator('.didactic-practice [data-action=visual-reveal-all]').count()){
   await page.locator('.didactic-practice [data-action=visual-reveal-all]').click();await audit(page,info,'worked-steps');await capture(page,info,'worked-steps');
  }
  await page.reload();await expect(page.locator('.didactic-overview')).toBeVisible();
  expect(await page.evaluate(()=>{const e=CachasteDailyApp.engine;return{xp:e.stats().xp,attempts:e.state.attempts.length};})).toEqual(before);
  await page.locator('[data-action=begin-question]').click();await expect(page.locator('[data-action=check]')).toBeDisabled();await audit(page,info,'unanswered');
  const wrong=await page.evaluate(()=>{const e=CachasteDailyApp.engine,q=e.byKey.get(e.state.session.keys[0]);return(q.answer+1)%q.options.length;});
  await page.locator(`[data-action=choice][data-index="${wrong}"]`).click();await audit(page,info,'selected');await page.locator('[data-action=check]').click();
  await expect(page.locator('.tutor')).toBeVisible();await audit(page,info,'review');await capture(page,info,'review');
  for(const mode of ['easy','example','steps']){await page.locator(`[data-action=mode][data-mode=${mode}]`).click();await audit(page,info,'tutor-'+mode);}
  await page.locator('.tutor>details>summary').click();for(const summary of await page.locator('.tutor>details>details>summary').all())await summary.click();await audit(page,info,'distractors');
 });
}
test('Antes documentado: tutor M1 y Ciencias con los estilos del run fallido',async({page},info)=>{
 for(const file of ['daily-ui.css','daily-reference.css']){const old=execFileSync('git',['show','e3a0434d70042afc40dccdbf6d57307a16c2e16e:'+file],{encoding:'utf8'});await page.route('**/'+file,route=>route.fulfill({contentType:'text/css',body:old}));}
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 for(const[subject,track]of[['M1',null],['Ciencias','Biología']]){
  await page.goto('./inicio.html');await seed(page,subject,track);await capture(page,info,'before-lesson-'+subject);
  await page.locator('[data-action=begin-question]').click();await page.locator('[data-action=choice]').first().click();await page.locator('[data-action=check]').click();await capture(page,info,'before-review-'+subject);
  await info.attach('baseline-'+subject+'.json',{body:JSON.stringify({baseline:'e3a0434',measurements:await page.evaluate(renderedContrast,targets)},null,2),contentType:'application/json'});
 }
});
