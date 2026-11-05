import {test,expect} from '@playwright/test';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {fixturePage} from './helpers/competition-fixtures.mjs';
const items=dailyCatalog().items;
for(const key of ['M1:TR-M1-007','M1:TR-M1-022'])test('Enunciado y gráfico coherentes en un duelo: '+key,async({page},info)=>{
 const q=items.find(q=>q.key===key),safe={key,question:q.question,options:q.options,visual:q.visual,concept:q.concept};
 const requests=await fixturePage(page,{question:safe});await page.goto('./competencia.html#duelos');
 await page.getByRole('button',{name:'Desafiar',exact:true}).click();await page.getByRole('textbox',{name:'Nickname',exact:true}).fill('CataPAES');await page.getByRole('button',{name:'Enviar desafío',exact:true}).click();await page.getByRole('button',{name:'Comenzar duelo',exact:true}).click();
 await expect(page.getByRole('heading',{name:q.question,exact:true})).toBeVisible();await expect(page.locator('.question-visual svg')).toBeVisible();await expect(page.locator('.question-visual figcaption')).toHaveText(q.visual.caption);
 await expect(page.locator('.question-visual')).not.toContainText(/Comida|Transp\.|Préstamos/);
 if(key.endsWith('007')){await expect(page.locator('.question-visual')).toContainText('2 cm en el plano');await expect(page.locator('.question-visual')).not.toContainText('14 km');}
 else for(const label of ['Fútbol','Dibujo','Música','Lectura'])await expect(page.locator('.question-visual')).toContainText(label);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.screenshot({path:info.outputPath(key.replaceAll(':','-')+'.png'),fullPage:true});
 await page.getByRole('radio').nth(q.answer).check();await page.getByRole('button',{name:'Enviar respuesta',exact:true}).click();await expect.poll(()=>requests.some(r=>r.operation==='answer'&&r.payload.choice===q.answer)).toBe(true);
});
