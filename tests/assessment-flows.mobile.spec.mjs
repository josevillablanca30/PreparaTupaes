import {test,expect} from '@playwright/test';
const subjects=[{page:'m2.html',key:'cachaste-m2-v1',bank:'CACHASTE_M2',count:55,minutes:140},{page:'history.html',key:'cachaste-history-v1',bank:'CACHASTE_HISTORIA',count:65,minutes:120}];
async function diagnosis(page,subject,wrong=false){
 await page.locator('#diagnostic').click();
 await page.evaluate(({key,bank,wrong})=>{
  for(let n=0;n<30;n++){
   const state=JSON.parse(localStorage.getItem(key)).session;
   const q=window[bank].find(q=>q.id===state.ids[state.index]);
   const value=q.options[wrong?(q.answer+1)%q.options.length:q.answer];
   [...document.querySelectorAll('[data-choice]')].find(b=>b.textContent.slice(3)===value).click();
   document.querySelector('[data-conf="seguro"]').click();document.getElementById('check').click();document.getElementById('next').click();
  }
 },{...subject,wrong});
 await expect(page.getByRole('heading',{name:(wrong?'0':'30')+' de 30 correctas',exact:true})).toBeVisible();
}
for(const subject of subjects){
 test(subject.page+': ensayo editable, sin corrección anticipada, omisión e historial persistente',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('./'+subject.page);await diagnosis(page,subject);await page.locator('#back').click();await page.locator('#full').click();
  const start=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),subject.key);
  expect(start.session.ids.length).toBe(subject.count);expect(start.session.deadline-start.session.started).toBe(subject.minutes*60000);
  await page.locator('[data-choice]').first().click();await page.locator('#flag').click();await page.locator('#omit').click();
  await page.locator('#map').click();await page.locator('[data-jump="0"]').click();
  await expect(page.locator('[data-choice][aria-pressed="true"]')).toHaveCount(0);
  await expect(page.locator('#flag')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.tutor-panel')).toHaveCount(0);await expect(page.locator('[data-conf]')).toHaveCount(0);
  await page.locator('[data-jump="'+(subject.count-1)+'"]').click();
  await page.evaluate(({key,bank})=>{const s=JSON.parse(localStorage.getItem(key)).session,q=window[bank].find(q=>q.id===s.ids[s.index]);[...document.querySelectorAll('[data-choice]')].find(b=>b.textContent.slice(3)===q.options[q.answer]).click();},subject);
  await page.locator('#pause').click();await page.reload();await page.locator('#resume').click();
  await expect(page.locator('[data-choice][aria-pressed="true"]')).toHaveCount(1);
  await page.locator('#exam-next').click();await expect(page.getByRole('heading',{name:'¿Entregar tu ensayo?'})).toBeVisible();
  expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).history.length,subject.key)).toBe(30);
  await page.locator('#cancel-finish').click();await page.locator('#exam-next').click();await page.locator('#finish').click();
  await expect(page.getByRole('heading',{name:'1 de '+subject.count+' correctas',exact:true})).toBeVisible();
  const result=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),subject.key);
  expect(result.session).toBeNull();expect(result.assessments.length).toBe(2);expect(result.history.length).toBe(30+subject.count);
  expect(result.lastResult.results[0].unanswered).toBe(true);expect(result.lastResult.results.at(-1).correct).toBe(true);
  await page.reload();await page.locator('#last').click();await expect(page.getByRole('heading',{name:'1 de '+subject.count+' correctas',exact:true})).toBeVisible();
  expect(errors).toEqual([]);
 });
 test(subject.page+': estudiante con dificultades recibe preguntas diferentes del mismo concepto',async({page})=>{
  await page.goto('./'+subject.page);await diagnosis(page,subject,true);const before=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).lastResult.results,subject.key);
  await page.locator('#reinforce').click();const after=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).session,subject.key);
  expect(after.mode).toBe('reinforce');expect(after.ids.length).toBeGreaterThan(0);expect(after.ids.every(id=>!before.some(r=>r.id===id))).toBe(true);
  await page.locator('[data-choice]').first().click();await page.locator('[data-conf="duda"]').click();await page.locator('#check').click();
  await expect(page.locator('.tutor-panel')).toBeVisible();const first=await page.locator('.tutor-panel').innerText();
  await page.getByRole('button',{name:'Más fácil',exact:true}).click();expect(await page.locator('.tutor-panel').innerText()).not.toBe(first);
  await page.getByRole('button',{name:'Con un ejemplo',exact:true}).click();await expect(page.locator('[data-explain="example"]')).toHaveAttribute('aria-pressed','true');
 });
 test(subject.page+': tiempo agotado entrega una vez e incluye todas las preguntas en blanco',async({page})=>{
  await page.clock.install();await page.goto('./'+subject.page);await diagnosis(page,subject);await page.locator('#back').click();await page.locator('#full').click();
  await page.clock.fastForward((subject.minutes+1)*60000);
  await expect(page.getByRole('heading',{name:'0 de '+subject.count+' correctas',exact:true})).toBeVisible();
  const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),subject.key);expect(saved.assessments.length).toBe(2);expect(saved.lastResult.results.every(r=>r.unanswered)).toBe(true);
  await page.clock.fastForward(60000);expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).assessments.length,subject.key)).toBe(2);
 });
}
test('Lectura: siete textos, mapa, cambios y corrección completa al entregar',async({page})=>{
 await page.goto('./reading.html');await page.evaluate(()=>{readingBegin('diagnostico');for(let i=0;i<30;i++){readingChoose(0);readingCheck();readingAdvance();}readingBack();readingBegin('completo');});
 const initial=await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('cachaste-reading-v1')).session;return {count:s.ids.length,texts:[...new Set(s.ids.map(id=>window.READING_QUESTIONS.find(q=>q.id===id).passageId))]}});
 expect(initial.count).toBe(65);expect(initial.texts.length).toBe(7);
 await page.locator('button.option').first().click();await page.getByRole('button',{name:'Marcar para revisar',exact:true}).click();await page.getByRole('button',{name:'Omitir pregunta →',exact:true}).click();
 await page.getByRole('button',{name:'Mapa de preguntas',exact:true}).click();await page.locator('.question-map button').first().click();await expect(page.locator('button.option.chosen')).toHaveCount(0);
 await expect(page.getByText('¿Qué tan seguro estás?',{exact:true})).toHaveCount(0);
 await page.locator('.question-map button').last().click();await page.locator('button.option').first().click();await page.getByRole('button',{name:'Revisar entrega',exact:true}).click();
 await page.getByRole('button',{name:'Entregar ensayo',exact:true}).click();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('cachaste-reading-v1')));expect(saved.session).toBeNull();expect(saved.recent.length).toBe(65);expect(saved.recent[0].unanswered).toBe(true);expect(saved.assessments.length).toBe(2);
 await page.reload();await expect(page.getByRole('heading',{name:'Historial de sesiones',exact:true})).toBeVisible();
});
