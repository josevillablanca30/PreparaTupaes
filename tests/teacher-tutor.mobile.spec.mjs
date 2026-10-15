import{test,expect}from'@playwright/test';
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
