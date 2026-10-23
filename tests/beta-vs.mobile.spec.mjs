import {test,expect} from '@playwright/test';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {STORAGE_KEY} from '../beta/local-duel.mjs';
test.skip(process.env.CACHASTE_BETA_PREVIEW!=='1','Debug-only overlay requires explicit beta preview.');
const catalog=dailyCatalog(),byKey=new Map(catalog.items.map(q=>[q.key,q]));
async function prepare(page,subject='M1',track='Biología'){
 await page.goto('./beta-vs.html');await page.getByRole('combobox',{name:'Asignatura',exact:true}).selectOption(subject);
 if(subject==='Ciencias')await page.getByRole('combobox',{name:'Área de Ciencias',exact:true}).selectOption(track);
 await page.getByRole('textbox',{name:'Apodo del jugador 1',exact:true}).fill('Prueba_A');await page.getByRole('textbox',{name:'Apodo del jugador 2',exact:true}).fill('Prueba_B');await page.getByRole('button',{name:'Preparar duelo',exact:true}).click();
}
async function layout(page){
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await expect.poll(()=>page.locator('img').evaluateAll(nodes=>nodes.every(n=>n.complete&&n.naturalWidth>0))).toBe(true);
 expect(await page.locator('button:visible').evaluateAll(nodes=>nodes.filter(n=>n.getBoundingClientRect().height<47.5).map(n=>n.textContent))).toEqual([]);
}
async function answerTurn(page,wrong=false){
 for(let i=0;i<10;i++){
  await expect(page.locator('.question-meta strong')).toContainText((i+1)+'/10');
  const s=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),STORAGE_KEY),q=byKey.get(s.keys[i]);
  await expect(page.locator('.competitive-question h1')).toHaveText(q.question);
  if(q.visual)await expect(page.locator('.question-visual svg')).toBeVisible();
  if(q.passageId)await expect(page.locator('.reading-passage')).toBeVisible();
  await expect(page.getByText('Respuesta:',{exact:false})).toHaveCount(0);
  await page.getByRole('radio').nth(wrong?(q.answer+1)%q.options.length:q.answer).check();await page.getByRole('button',{name:'Enviar respuesta',exact:true}).click();
 }
}
for(const subject of ['M1','M2','Lectura','Historia','Ciencias'])test(subject+': two real local turns, identical questions, hidden solutions, result and original explanations',async({page},info)=>{
 const requests=[];page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4173/'))requests.push(r.url());});
 await prepare(page,subject);await page.evaluate(()=>localStorage.setItem('beta-education-sentinel','preservado'));
 await expect(page.getByRole('heading',{name:'Duelo PAES',exact:true})).toBeVisible();await expect(page.locator('.versus-player h2')).toHaveText(['Prueba_A','Prueba_B']);await layout(page);
 if(subject==='M1')await page.screenshot({path:info.outputPath('beta-vs.png'),fullPage:true});
 await page.getByRole('button',{name:'Comenzar mi turno',exact:true}).click();await answerTurn(page);
 await expect(page.getByRole('heading',{name:'¡Primer turno listo!',exact:true})).toBeVisible();await expect(page.getByText('10 / 10',{exact:false})).toHaveCount(0);
 await page.reload();await expect(page.getByRole('heading',{name:'¡Primer turno listo!',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Ya tengo el celular · comenzar mi turno',exact:true}).click();await answerTurn(page,true);
 await expect(page.getByRole('heading',{name:'Ganó Prueba_A',exact:true})).toBeVisible();await expect(page.locator('.result-players b')).toHaveText(['10 / 10','0 / 10']);await layout(page);
 if(subject==='M1')await page.screenshot({path:info.outputPath('beta-vs-result.png'),fullPage:true});
 await page.getByRole('button',{name:'Revisar las respuestas',exact:true}).click();await expect(page.locator('.beta-review-card')).toHaveCount(10);await page.getByRole('combobox',{name:'Respuestas de',exact:true}).selectOption('1');await expect(page.locator('.beta-review-card').first()).toContainText('Para repasar');await layout(page);
 expect(await page.evaluate(()=>localStorage.getItem('beta-education-sentinel'))).toBe('preservado');expect(requests).toEqual([]);
});
test('Beta entry is visible without login; reload resumes the same question and a deadline expires safely',async({page})=>{
 await page.goto('./competencia.html#duelos');await page.getByRole('link',{name:'Probar VS local',exact:true}).click();await expect(page.getByRole('heading',{name:'Prueba tu duelo',exact:true})).toBeVisible();
 await prepare(page);await page.getByRole('button',{name:'Comenzar mi turno',exact:true}).click();const q=await page.locator('.competitive-question h1').textContent();await page.reload();await expect(page.locator('.competitive-question h1')).toHaveText(q);
 await page.clock.install();await page.clock.fastForward(91000);await expect(page.getByRole('heading',{name:'Se terminó el tiempo',exact:true})).toBeVisible();
 await page.clock.fastForward(300000);await expect(page.getByRole('heading',{name:'Se terminó el tiempo',exact:true})).toBeVisible();await page.getByRole('button',{name:'Siguiente pregunta',exact:true}).click();await expect(page.locator('.question-meta strong')).toContainText('2/10');
 await page.getByRole('button',{name:'Salir de esta prueba',exact:true}).click();await page.getByRole('button',{name:'Seguir jugando',exact:true}).click();await expect(page.locator('.question-meta strong')).toContainText('2/10');
 await page.getByRole('button',{name:'Salir de esta prueba',exact:true}).click();await page.getByRole('button',{name:'Borrar duelo local',exact:true}).click();await expect(page.getByRole('heading',{name:'Prueba tu duelo',exact:true})).toBeVisible();
});
