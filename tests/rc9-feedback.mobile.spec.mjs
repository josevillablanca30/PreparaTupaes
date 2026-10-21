import {test,expect} from '@playwright/test';

test('Eximición: cambiar la sesión pendiente, rendir diez preguntas y aprobar con ocho',async({page})=>{
 await page.goto('./inicio.html');await page.evaluate(()=>{const e=CachasteDailyApp.engine;e.close();e.state.foundationDraft=null;e.state.subject='M1';e.state.track=null;const r=CachasteProgression.route(CACHASTE_DAILY_CATALOG.items,'M1',null,e.profile('M1'));e.state.unitExams=Object.fromEntries(r.units.slice(0,2).map(u=>['M1::'+u.routeKey,{correct:8,total:10,passed:true,at:Date.now()}]));e.state.stages={M1:r.units[2].routeKey};e.start('M1',2,'lesson','Enteros y cambios');e.save();location.hash='#home';CachasteDailyApp.render();});
 await page.locator('[data-action=unit-exam]').click();await expect(page.locator('.session-switch')).toBeVisible();await page.locator('[data-action=switch-start]').click();await expect(page.locator('.question-title')).toBeVisible();
 expect(await page.evaluate(()=>CachasteDailyApp.engine.state.session.keys.length)).toBe(10);
 for(let i=0;i<10;i++){
  const choice=await page.evaluate(i=>{const e=CachasteDailyApp.engine,s=e.state.session,q=e.byKey.get(s.keys[s.index]);return i<8?q.answer:(q.answer+1)%q.options.length;},i);
  await page.locator('[data-action=choice][data-index="'+choice+'"]').click();await page.locator('[data-confidence=seguro]').click();await page.locator('[data-action=check]').click();await page.locator('[data-action=next]').click();
 }
 await expect(page.locator('.celebration-screen')).toContainText('¡Unidad eximida!');await expect(page.locator('.reward-card')).toContainText('8/10');
 await page.reload();await expect(page.locator('.reward-card')).toContainText('8/10');
});

for(const action of ['lesson','check-first'])test('Sesión pendiente: resolver el bloqueo y abrir '+action,async({page})=>{
 await page.goto('./inicio.html');
 const before=await page.evaluate(()=>{const e=CachasteDailyApp.engine;e.close();e.state.foundationDraft=null;e.state.track=null;e.start('M1',2,'free','Enteros y cambios');const q=e.byKey.get(e.state.session.keys[0]);e.answer(q.answer,'seguro');const proof={id:e.state.session.id,attempts:e.state.attempts.length,xp:e.stats().xp};e.state.subject='Ciencias';e.state.track='Biología';e.save();location.hash='#courses';return proof;});
 await page.reload();await page.locator('[data-subject=Ciencias][data-action=pick-course]').click();await page.locator('[data-track=Biología]').click();await page.locator('[data-action=game-mode]').click();await page.locator('.adventure-world [data-action=level]').first().click();
 await page.locator('[data-action='+action+']').click();await expect(page.getByRole('region',{name:'Sesión pendiente'})).toBeVisible();
 expect(await page.evaluate(()=>CachasteDailyApp.engine.state.session.id)).toBe(before.id);
 await page.locator('[data-action=cancel-start]').click();expect(await page.evaluate(()=>CachasteDailyApp.engine.state.session.id)).toBe(before.id);
 await page.locator('[data-action='+action+']').click();await page.locator('[data-action=switch-start]').click();
 await expect(page.locator(action==='lesson'?'.didactic-overview':'.question-title')).toBeVisible();
 expect(await page.evaluate(()=>{const e=CachasteDailyApp.engine;return{subject:e.state.session.subject,attempts:e.state.attempts.length,xp:e.stats().xp};})).toEqual({subject:'Ciencias',attempts:before.attempts,xp:before.xp});
 await page.reload();await expect(page.locator(action==='lesson'?'.didactic-overview':'.question-title')).toBeVisible();
});

test('Recta: explicación desde cero, cinco pasos, reinicio y práctica diferente',async({page})=>{
 await page.goto('./inicio.html');await page.evaluate(()=>{const e=CachasteDailyApp.engine;e.start('M1',2,'lesson','Enteros y cambios');location.hash='#session';CachasteDailyApp.render();});
 await expect(page.locator('.didactic-key')).toContainText('La recta numérica es una línea');await expect(page.locator('.didactic-key')).toContainText('una unidad');
 for(let i=0;i<5;i++)await page.locator('[data-action=visual-move]').click();
 await expect(page.locator('.numberline-complete')).toContainText('cinco pasos');await page.locator('[data-action=visual-reset-line]').click();await expect(page.locator('.numberline-demo')).toContainText('Paso 0 de 5');
 await expect(page.locator('.didactic-practice')).toContainText('1 − 4');await expect(page.locator('.didactic-practice')).not.toContainText('−2 + 5');
 await page.locator('.didactic-practice [data-action=visual-choose]').first().click();await expect(page.locator('.didactic-practice .visual-response.right')).toBeVisible();
});

for(const [subject,file,key,countField] of [['M1','index.html','cachaste-m1-diagnostic-draft-v1','queue'],['M2','m2.html','cachaste-m2-v1','ids'],['Historia','history.html','cachaste-history-v1','ids'],['Lectura','reading.html','cachaste-reading-v1','ids'],['Ciencias','science.html','cachaste-science-v1','ids']])test(subject+': entrar al diagnóstico real desde la selección de modo',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('./inicio.html');await page.locator('[data-action=pick-course][data-subject='+subject+']').click();if(subject==='Ciencias')await page.locator('[data-track=Biología]').click();
 await page.locator('[data-action=diagnostic-mode]').click();await expect(page).toHaveURL(new RegExp(file.replace('.','\\.')+'\\?modo=diagnostico'));
 await expect.poll(()=>page.evaluate(({key,countField,subject})=>{const data=JSON.parse(localStorage.getItem(key));return subject==='M1'?data?.ids?.length??data?.queue?.length:data?.session?.[countField]?.length;},{key,countField,subject})).toBe(30);expect(errors).toEqual([]);
});
