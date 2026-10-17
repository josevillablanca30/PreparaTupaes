import{test,expect}from'@playwright/test';
test('Ensayo M2 mantiene 55 preguntas sin elegir dos variantes equivalentes cuando hay banco suficiente',async({page})=>{
 await page.addInitScript(()=>{Math.random=()=>0.5;localStorage.setItem('cachaste-m2-v1',JSON.stringify({diagnosticDone:true,history:[]}));});
 await page.goto('./m2.html');
 // Ambas variantes de media quedan al principio para que el caso no dependa del azar del sorteo.
 await page.evaluate(()=>window.CACHASTE_M2.sort((a,b)=>Number(!a.transferGroup)-Number(!b.transferGroup)));
 await page.locator('#full').click();
 const selected=await page.evaluate(()=>JSON.parse(localStorage.getItem('cachaste-m2-v1')).session.ids.map(id=>{const q=window.CACHASTE_M2.find(q=>q.id===id);return{id,family:q.transferGroup||q.id};}));
 expect(selected).toHaveLength(55);expect(new Set(selected.map(q=>q.family)).size).toBe(55);
 expect(selected.filter(q=>q.family==='m2-mean-2-4-6-8')).toHaveLength(1);
});
for(const id of ['M2-001','M2-003','M2-007','M2-050']){
 test('Profesor M2 '+id+': tres estrategias, error elegido, recuperación y transferencia real',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(id=>{if(!localStorage.getItem('teacher-fixture')){localStorage.setItem('teacher-fixture','1');localStorage.setItem('cachaste-m2-v1',JSON.stringify({diagnosticDone:true,history:[],session:{id:'teacher-check',mode:'express',ids:[id],index:0,selected:null,checked:false,confidence:null,results:[],started:Date.now(),answers:[null],flags:[]}}));}},id);
  await page.goto('./m2.html');await page.locator('#resume').click();
  const chosen=await page.evaluate(id=>{const q=window.CACHASTE_M2.find(q=>q.id===id),wrong=q.options[(q.answer+1)%q.options.length];[...document.querySelectorAll('[data-choice]')].find(b=>b.textContent.slice(3)===wrong).click();return wrong;},id);
  await page.locator('[data-conf="duda"]').click();await page.locator('#check').click();
  const panel=page.locator('.tutor-panel');await expect(panel.getByText('Elegiste: '+chosen,{exact:true})).toBeVisible();await expect(panel.getByRole('heading',{name:'El concepto desde cero',exact:true})).toBeVisible();
  await panel.locator('.error-reason summary').click();await expect(panel.locator('.error-reason details')).toHaveAttribute('open','');
  const saved=await page.evaluate(()=>localStorage.getItem('cachaste-m2-v1'));
  const steps=await panel.innerText();await panel.getByRole('button',{name:'Más fácil',exact:true}).click();await expect(panel.getByRole('heading',{name:'Imagínalo así',exact:true})).toBeVisible();const easy=await panel.innerText();expect(easy).not.toBe(steps);
  await panel.getByRole('button',{name:'Con un ejemplo',exact:true}).click();await expect(panel.getByRole('heading',{name:'Un problema distinto',exact:true})).toBeVisible();const example=await panel.innerText();expect(example).not.toBe(easy);
  expect(await page.evaluate(()=>localStorage.getItem('cachaste-m2-v1'))).toBe(saved);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.reload();await page.locator('#resume').click();await expect(page.locator('.tutor-panel')).toBeVisible();await expect(page.locator('.error-reason')).toContainText(chosen);
  await page.locator('#next').click();await page.locator('#reinforce').click();
  const transfer=await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('cachaste-m2-v1')).session;return s.ids.map(id=>window.CACHASTE_M2.find(q=>q.id===id));});
  expect(transfer.length).toBeGreaterThan(0);expect(transfer.every(q=>q.id!==id)).toBe(true);expect(new Set(transfer.map(q=>q.concept)).size).toBe(1);expect(errors).toEqual([]);
 });
}
// Recorre las 113 preguntas reales en lotes de diez: no solo cuatro ejemplos escogidos.
for(let start=1;start<=113;start+=10){
 const ids=Array.from({length:Math.min(10,113-start)},(_,i)=>'M2-'+String(start+i).padStart(3,'0'));
 test('M2 completo '+ids[0]+'–'+ids.at(-1)+': cada modo corresponde al ítem y al distractor',async({page})=>{
  await page.addInitScript(ids=>localStorage.setItem('cachaste-m2-v1',JSON.stringify({diagnosticDone:true,history:[],session:{id:'all-teaching',mode:'express',ids,index:0,selected:null,checked:false,confidence:null,results:[],started:Date.now(),answers:ids.map(()=>null),flags:[]}})),ids);
  await page.goto('./m2.html');await page.locator('#resume').click();
  const completed=await page.evaluate(ids=>{
   for(const id of ids){
    const q=window.CACHASTE_M2.find(q=>q.id===id),wrong=(q.answer+1)%q.options.length;
    const button=[...document.querySelectorAll('[data-choice]')].find(b=>b.textContent.slice(3)===q.options[wrong]);if(!button)throw Error(id+' no ofrece la alternativa esperada');button.click();
    document.querySelector('[data-conf="duda"]').click();document.getElementById('check').click();
    if(!document.querySelector('.error-reason').textContent.includes(q.explanations[wrong]))throw Error(id+' diagnóstico ajeno al distractor');
    const expectations={steps:q.teaching.check,easy:q.teaching.intuition[0],example:q.teaching.example.problem};
    for(const [mode,content]of Object.entries(expectations)){
     document.querySelector('[data-explain="'+mode+'"]').click();const body=[...document.querySelectorAll('.tutor-panel > .teaching-section')].map(s=>s.textContent).join('\n');
     if(!body.includes(content))throw Error(id+' contenido incorrecto en '+mode);
     if(document.documentElement.scrollWidth>innerWidth+1)throw Error(id+' desborde horizontal en '+mode);
    }
    document.getElementById('next').click();
   }
   const saved=JSON.parse(localStorage.getItem('cachaste-m2-v1'));return {count:saved.lastResult.total,correct:saved.lastResult.correct,history:saved.history.length};
  },ids);
  expect(completed).toEqual({count:ids.length,correct:0,history:ids.length});
 });
}
