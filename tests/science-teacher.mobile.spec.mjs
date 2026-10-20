import{currentSession}from'./current-fixture.mjs';
import{test,expect}from'@playwright/test';import{loadBanks}from'../scripts/load-banks.mjs';const ids=loadBanks().Ciencias.filter(q=>q.teaching).map(q=>q.id);
for(const offset of[1,2,3])for(let start=0;start<ids.length;start+=12){const batch=ids.slice(start,start+12);
 test('Ciencias profesor '+batch[0]+'–'+batch.at(-1)+' distractor '+offset,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(session=>localStorage.setItem('cachaste-science-v1',JSON.stringify({history:[],track:'Biología',session})),currentSession(loadBanks().Ciencias,{mode:'mixto',ids:batch,index:0,selected:null,checked:false,confidence:'duda',hint:0,results:[],answers:{},flags:[],started:Date.now()}));
 await page.goto('./science.html');await page.evaluate(()=>window.resume());
 const count=await page.evaluate(({ids,offset})=>{for(const id of ids){const q=window.SCIENCE_BANK.find(q=>q.id===id),wrong=(q.answer+offset)%4;window.answer(wrong);window.check();if(!document.querySelector('.explain').textContent.includes(q.explanations[wrong]))throw Error(id+' diagnóstico ajeno');
 for(const[m,content]of Object.entries({steps:q.teaching.check,easy:q.teaching.intuition[0],example:q.teaching.example.problem})){window.changeMode(m);if(![...document.querySelectorAll('.teaching-section')].some(e=>e.textContent.includes(content)))throw Error(id+' '+m+' incorrecto');if(document.documentElement.scrollWidth>innerWidth+1)throw Error(id+' desborde');}window.next();}return JSON.parse(localStorage.getItem('cachaste-science-v1')).history.length;},{ids:batch,offset});expect(count).toBe(batch.length);expect(errors).toEqual([]);
 });
}
