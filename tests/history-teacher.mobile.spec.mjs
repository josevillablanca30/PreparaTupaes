import{currentSession}from'./current-fixture.mjs';
import{test,expect}from'@playwright/test';
async function restoreVersionedDraft(page){
 const active=await page.evaluate(({key,subject})=>{
  const saved=JSON.parse(localStorage.getItem(key)||'null');if(!saved?.session)return false;
  const pool=CACHASTE_DAILY_CATALOG.items.filter(q=>q.subjectKey===subject);
  const questions=saved.session.ids.map(id=>pool.find(q=>q.id===id));
  if(questions.some(q=>!q))throw Error('Missing assessment fixture');
  saved.session.assessmentVersions=questions.map(q=>CachasteLearning.assessmentVersion(q));
  saved.session.questionSnapshots=questions.map(q=>({...q,...CachasteLearning.assessmentSnapshot(q)}));
  const payload=JSON.stringify(saved);localStorage.setItem(key,payload);
  // Study's visibilitychange/pagehide handlers may overwrite storage during reload.
  // Reinstall the verified fixture immediately before application scripts run.
  window.addEventListener('pagehide',()=>localStorage.setItem(key,payload),{once:true});
  return true;
 },{key:'cachaste-history-v1',subject:'Historia'});
 if(active){
  await page.addInitScript(({key,payload})=>{const current=JSON.parse(localStorage.getItem(key)||'null');if(current?.session&&!current.session.assessmentVersions)localStorage.setItem(key,payload);},{key:'cachaste-history-v1',payload:await page.evaluate(key=>localStorage.getItem(key),'cachaste-history-v1')});
  await page.reload();
 }
}

import{loadBanks}from'../scripts/load-banks.mjs';
import{dailyCatalog}from'../scripts/daily-catalog.mjs';
const historyBank=dailyCatalog().items.filter(q=>q.subjectKey==='Historia'&&q.examEligible!==false);
const sourceQuestion=historyBank.find(q=>q.id==='HIS-001');
const siblingIds=historyBank.filter(q=>q.concept===sourceQuestion.concept&&q.id!==sourceQuestion.id).map(q=>q.id);
const reviewedIds=loadBanks().Historia.filter(q=>q.teaching).map(q=>q.id);
// Cada distractor del lote se usa realmente en la interfaz, en tres modos.
for(const wrongIndex of [1,2,3])for(let start=0;start<reviewedIds.length;start+=10){
 const ids=reviewedIds.slice(start,start+10);
 test('Historia profesor '+ids[0]+'–'+ids.at(-1)+' alternativa '+wrongIndex,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(session=>localStorage.setItem('cachaste-history-v1',JSON.stringify({diagnosticDone:true,history:[],session})),currentSession(dailyCatalog().items.filter(q=>q.subjectKey==='Historia'),{id:'history-teacher',mode:'express',ids,index:0,selected:null,checked:false,confidence:null,results:[],started:Date.now(),answers:ids.map(()=>null),flags:[]}));
  await page.goto('./history.html');await page.locator('#resume').click();
  const result=await page.evaluate(({ids,wrongIndex})=>{
   for(const id of ids){const q=window.CACHASTE_DAILY_CATALOG.items.filter(q=>q.subjectKey==='Historia').find(q=>q.id===id);
    [...document.querySelectorAll('[data-choice]')].find(b=>b.textContent.slice(3)===q.options[wrongIndex]).click();
    document.getElementById('check').click();
    const error=document.querySelector('.error-reason');
    if(!error.textContent.includes('Elegiste: '+q.options[wrongIndex])||!error.textContent.includes(q.explanations[wrongIndex]))throw Error(id+' error ajeno a la alternativa');
    error.querySelector('summary').click();if(!error.querySelector('details').open)throw Error(id+' reparación cerrada');
    for(const [mode,content]of Object.entries({steps:q.teaching.check,easy:q.teaching.intuition[0],example:q.teaching.example.problem})){
     document.querySelector('[data-explain="'+mode+'"]').click();
     const text=[...document.querySelectorAll('.tutor-panel > .teaching-section')].map(s=>s.textContent).join('\n');
     if(!text.includes(content))throw Error(id+' contenido incorrecto en '+mode);
     if(document.documentElement.scrollWidth>innerWidth+1)throw Error(id+' desborde en '+mode);
    }
    document.getElementById('next').click();
   }
   const s=JSON.parse(localStorage.getItem('cachaste-history-v1'));return{total:s.lastResult.total,correct:s.lastResult.correct,history:s.history.length};
  },{ids,wrongIndex});
  expect(result).toEqual({total:ids.length,correct:0,history:ids.length});expect(errors).toEqual([]);
 });
}
test('Historia: una decisión nueva comprueba costo de oportunidad después de recuperar la clase',async({page})=>{
 await page.addInitScript(()=>{if(localStorage.getItem('history-fixture'))return;localStorage.setItem('history-fixture','1');!JSON.parse(localStorage.getItem('cachaste-history-v1')||'null')?.session?.assessmentVersions&&localStorage.setItem('cachaste-history-v1',JSON.stringify({diagnosticDone:true,history:[],session:{id:'history-transfer',mode:'express',ids:['HIS-009'],index:0,selected:null,checked:false,confidence:null,results:[],started:Date.now(),answers:[null],flags:[]}}));});
 await page.goto('./history.html');await restoreVersionedDraft(page);await page.locator('#resume').click();
 const wrong='El precio escrito en la etiqueta de un cuaderno';await page.getByRole('button').filter({hasText:wrong}).click();
 await page.locator('#check').click();
 await expect(page.locator('.error-reason')).toContainText(wrong);
 const saved=await page.evaluate(()=>localStorage.getItem('cachaste-history-v1'));
 await page.getByRole('button',{name:'Más fácil',exact:true}).click();await expect(page.locator('.tutor-panel')).toContainText('Tu sábado');
 await page.getByRole('button',{name:'Con un ejemplo',exact:true}).click();await expect(page.locator('.tutor-panel')).toContainText('espacio de música');
 expect(await page.evaluate(()=>localStorage.getItem('cachaste-history-v1'))).toBe(saved);
 await page.reload();await page.locator('#resume').click();await expect(page.locator('.error-reason')).toContainText(wrong);
 await page.locator('#next').click();await page.locator('#reinforce').click();
 const ids=await page.evaluate(()=>JSON.parse(localStorage.getItem('cachaste-history-v1')).session.ids);
 expect(ids).toEqual(['HIS-059']);
});
for(const exhausted of [false,true])test('Historia: '+(exhausted?'avisa cuando se agotaron las variantes recientes del concepto':'ofrece un refuerzo disponible del mismo concepto'),async({page})=>{
 expect(siblingIds.length).toBeGreaterThan(0);
 await page.addInitScript(history=>!JSON.parse(localStorage.getItem('cachaste-history-v1')||'null')?.session?.assessmentVersions&&localStorage.setItem('cachaste-history-v1',JSON.stringify({diagnosticDone:true,history,session:{id:'no-unrelated-transfer',mode:'express',ids:['HIS-001'],index:0,selected:null,checked:false,confidence:null,results:[],started:Date.now(),answers:[null],flags:[]}})),exhausted?siblingIds.map(id=>({id,correct:true,confidence:'seguro'})):[]);
 await page.goto('./history.html');await restoreVersionedDraft(page);await page.locator('#resume').click();
 await page.getByRole('button').filter({hasText:'El reconocimiento del sufragio femenino'}).click();
 await page.locator('#check').click();await page.locator('#next').click();
 await page.locator('#reinforce').click();
 if(!exhausted){
  const session=await page.evaluate(()=>JSON.parse(localStorage.getItem('cachaste-history-v1')).session);
  expect(session.mode).toBe('reinforce');expect(session.ids.length).toBeGreaterThan(0);
  for(const id of session.ids)expect(siblingIds).toContain(id);
  expect(session.ids).not.toContain('HIS-001');
  await expect(page.locator('#check')).toBeVisible();
  return;
 }
 await expect(page.locator('#study-notice')).toContainText('Ya trabajaste los ejercicios distintos disponibles');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('cachaste-history-v1')).session)).toBeNull();
 await page.locator('#back').click();await page.locator('#full').click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('cachaste-history-v1')).session.ids.length)).toBe(65);
});
