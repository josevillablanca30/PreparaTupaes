import {test,expect} from '@playwright/test';
import {dailyCatalog} from '../../scripts/daily-catalog.mjs';
async function enter(page){
 const data=await(await page.request.get('/__qa/session')).json();
 await page.addInitScript(session=>{localStorage.setItem('cachaste-auth-v1',JSON.stringify(session));const original=window.fetch.bind(window);window.fetch=(input,options)=>{const url=new URL(typeof input==='string'||input instanceof URL?input:input.url,location.href);return url.origin==='https://jmobinmdwrmdqrxtcruj.supabase.co'?original(location.origin+'/__qa/supabase'+url.pathname+url.search,options):original(input,options);};},data.users[0]);
 await page.goto('/cuenta.html');await expect(page.getByRole('link',{name:'Continuar mi preparación',exact:false})).toBeVisible();
}
for(const key of ['M1:TR-M1-007','M1:TR-M1-022'])test('El duelo web conserva contexto y figura: '+key,async({page,request},info)=>{
 const q=dailyCatalog().items.find(q=>q.key===key),question={key,question:q.question,options:q.options,visual:q.visual,concept:q.concept};
 await request.post('/__qa/control',{data:{reset:true,question}});await enter(page);await page.goto('/app/competencia.html#duelos');
 await page.getByRole('button',{name:'Desafiar',exact:true}).click();await page.getByRole('textbox',{name:'Nickname',exact:true}).fill('CataPAES');await page.getByRole('button',{name:'Enviar desafío',exact:true}).click();await page.getByRole('button',{name:'Comenzar duelo',exact:true}).click();
 await expect(page.getByRole('heading',{name:q.question,exact:true})).toBeVisible();await expect(page.locator('.question-visual svg')).toBeVisible();await expect(page.locator('.question-visual figcaption')).toHaveText(q.visual.caption);await expect(page.locator('.question-visual')).not.toContainText(/Comida|Transp\.|Préstamos/);
 if(key.endsWith('007')){await expect(page.locator('.question-visual')).toContainText('2 cm en el plano');await expect(page.locator('.question-visual')).not.toContainText('14 km');}
 else for(const label of ['Fútbol','Dibujo','Música','Lectura'])await expect(page.locator('.question-visual')).toContainText(label);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await page.screenshot({path:info.outputPath(key.replaceAll(':','-')+'.png'),fullPage:true});
 await page.reload();await expect(page.locator('.question-visual figcaption')).toHaveText(q.visual.caption);
});
