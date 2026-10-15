import{test,expect}from'@playwright/test';
import{loadBanks}from'../scripts/load-banks.mjs';
const reviewedIds=loadBanks().Historia.filter(q=>q.teaching).map(q=>q.id);
// Cada distractor del lote se usa realmente en la interfaz, en tres modos.
for(const wrongIndex of [1,2,3])for(let start=0;start<reviewedIds.length;start+=10){
 const ids=reviewedIds.slice(start,start+10);
 test('Historia profesor '+ids[0]+'–'+ids.at(-1)+' alternativa '+wrongIndex,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(ids=>localStorage.setItem('cachaste-history-v1',JSON.stringify({diagnosticDone:true,history:[],session:{id:'history-teacher',mode:'express',ids,index:0,selected:null,checked:false,confidence:null,results:[],started:Date.now(),answers:ids.map(()=>null),flags:[]}})),ids);
  await page.goto('./history.html');await page.locator('#resume').click();
  const result=await page.evaluate(({ids,wrongIndex})=>{
   for(const id of ids){const q=window.CACHASTE_HISTORIA.find(q=>q.id===id);
    [...document.querySelectorAll('[data-choice]')].find(b=>b.textContent.slice(3)===q.options[wrongIndex]).click();
    document.querySelector('[data-conf="duda"]').click();document.getElementById('check').click();
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
 await page.addInitScript(()=>{if(localStorage.getItem('history-fixture'))return;localStorage.setItem('history-fixture','1');localStorage.setItem('cachaste-history-v1',JSON.stringify({diagnosticDone:true,history:[],session:{id:'history-transfer',mode:'express',ids:['HIS-009'],index:0,selected:null,checked:false,confidence:null,results:[],started:Date.now(),answers:[null],flags:[]}}));});
 await page.goto('./history.html');await page.locator('#resume').click();
 const wrong='El precio escrito en la etiqueta de un cuaderno';await page.getByRole('button').filter({hasText:wrong}).click();
 await page.locator('[data-conf="duda"]').click();await page.locator('#check').click();
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
test('Historia: no se ofrece un tema ajeno ni un dominio ficticio cuando falta otro ítem del concepto',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('cachaste-history-v1',JSON.stringify({diagnosticDone:true,history:[],session:{id:'no-unrelated-transfer',mode:'express',ids:['HIS-001'],index:0,selected:null,checked:false,confidence:null,results:[],started:Date.now(),answers:[null],flags:[]}})));
 await page.goto('./history.html');await page.locator('#resume').click();
 await page.getByRole('button').filter({hasText:'El reconocimiento del sufragio femenino'}).click();
 await page.locator('[data-conf="duda"]').click();await page.locator('#check').click();await page.locator('#next').click();
 await page.locator('#reinforce').click();await expect(page.locator('#study-notice')).toContainText('Ya trabajaste los ejercicios distintos disponibles');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('cachaste-history-v1')).session)).toBeNull();
 await page.locator('#back').click();await page.locator('#full').click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('cachaste-history-v1')).session.ids.length)).toBe(65);
});
