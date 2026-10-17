import{test,expect}from'@playwright/test';import{loadBanks}from'../scripts/load-banks.mjs';const ids=loadBanks().Lectura.filter(q=>q.teaching).map(q=>q.id);
for(const offset of[1,2,3])for(let start=0;start<ids.length;start+=10){const batch=ids.slice(start,start+10);
 test('Lectora profesora '+batch[0]+'–'+batch.at(-1)+' distractor '+offset,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(ids=>localStorage.setItem('cachaste-reading-v1',JSON.stringify({history:[],session:{mode:'express',ids,index:0,selected:null,checked:false,confidence:'duda',hint:0,results:[],answers:{},flags:[],started:Date.now()}})),batch);
 await page.goto('./reading.html');await page.evaluate(()=>window.readingResume());
 const result=await page.evaluate(({ids,offset})=>{for(const id of ids){const q=window.READING_QUESTIONS.find(q=>q.id===id),wrong=(q.answer+offset)%4;window.readingChoose(wrong);window.readingCheck();const el=document.querySelector('.feedback');if(!el.textContent.includes(q.explanations[wrong])||!el.textContent.includes('Elegiste: '+q.options[wrong]))throw Error(id+' diagnóstico ajeno');
 for(const[m,content]of Object.entries({steps:q.teaching.evidence[0].quote,easy:q.teaching.intuition[0],example:q.teaching.example.problem})){window.readingExplanation(m);const text=document.querySelector('.explanation').textContent;if(!text.includes(content))throw Error(id+' '+m+' incorrecto');if(document.documentElement.scrollWidth>innerWidth+1)throw Error(id+' desborde');}window.readingAdvance();}const s=JSON.parse(localStorage.getItem('cachaste-reading-v1'));return{history:s.history.length,total:s.recent.length};},{ids:batch,offset});
 expect(result).toEqual({history:batch.length,total:batch.length});expect(errors).toEqual([]);
 });
}
