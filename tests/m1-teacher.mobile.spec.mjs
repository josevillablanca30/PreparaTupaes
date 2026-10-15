import{test,expect}from'@playwright/test';import{loadBanks}from'../scripts/load-banks.mjs';
const ids=loadBanks().M1.filter(q=>q.teaching).map(q=>q.id);
for(let start=0;start<ids.length;start+=10){const batch=ids.slice(start,start+10);
 test('M1 profesor '+batch[0]+'–'+batch.at(-1)+': tres modos y todos los distractores',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('./index.html');
  const count=await page.evaluate(ids=>{for(const id of ids){const q=catalog.find(q=>q.id===id);for(let wrong=0;wrong<q.options.length;wrong++){if(wrong===q.answer)continue;
   exam=false;queue=[q];i=0;round=[];checked=false;choice=wrong;confidence='duda';hintStage=0;mode='steps';page='quiz';check();
   const result=document.querySelector('.result');if(!result.textContent.includes(q.options[wrong])||!result.textContent.includes(q.explanations[wrong]))throw Error(id+': diagnóstico incorrecto');
   for(const [m,value]of Object.entries({steps:q.teaching.check,easy:q.teaching.intuition[0],example:q.teaching.example.problem})){mode=m;draw();const body=[...document.querySelectorAll('.teaching-section')].map(e=>e.textContent).join('\n');if(!body.includes(value))throw Error(id+': '+m);if(document.documentElement.scrollWidth>innerWidth+1)throw Error(id+': desborde en '+m);}
  }}return ids.length;},batch);
  expect(count).toBe(batch.length);expect(errors).toEqual([]);
 });
}
test('M1 clase se recupera al cerrar; cambiar explicación conserva resultado y alternativa elegida',async({page})=>{
 await page.goto('./index.html');await page.evaluate(()=>{exam=false;queue=[catalog.find(q=>q.id===208)];i=0;round=[];checked=false;choice=2;confidence='duda';hintStage=0;mode='steps';page='quiz';check();});
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('prepara-paes-demo-v1')));await page.getByRole('button',{name:'Más fácil',exact:true}).click();await page.getByRole('button',{name:'Con un ejemplo',exact:true}).click();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('prepara-paes-demo-v1')))).toEqual(before);
 await page.reload();await page.evaluate(()=>resumeMathDiagnosis());await expect(page.locator('.result')).toContainText('$19.200');await expect(page.getByRole('heading',{name:'Un problema distinto',exact:true})).toBeVisible();
});
