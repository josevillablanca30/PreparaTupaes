import{test,expect}from'@playwright/test';
const fit=async p=>expect(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
async function choose(p,s='M1',track){await p.goto('./inicio.html#courses');await p.locator('[data-action=pick-course][data-subject="'+s+'"]').click();if(s==='Ciencias')await p.locator('[data-track="'+(track||'Biología')+'"]').click();}
async function basic(p){await choose(p);await p.locator('.stage-banner [data-action=units]').click();await p.locator('[data-action=stage][data-stage=basics]').click();await p.locator('[data-action=basic-level]').first().click();await p.locator('[data-action=basic-start]').click();await expect(p.locator('.learning-picture')).toBeVisible();}
test('Desde cero: cinco materias claras, primera misión con imágenes y sin tarjetas de ensayos debajo',async({page})=>{const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('./inicio.html');await expect(page.locator('[data-action=pick-course]')).toHaveCount(5);await choose(page);await expect(page.locator('.stage-banner')).toContainText('ETAPA');await expect(page.locator('.curriculum-overview')).toBeVisible();await page.locator('.stage-banner [data-action=units]').click();await page.locator('[data-action=stage][data-stage=basics]').click();await expect(page.locator('.stage-banner')).toContainText('Fundamentos');await expect(page.locator('.trail-stop.current')).toContainText('Números y cantidades');await page.locator('[data-action=basic-level]').first().click();await page.locator('[data-action=basic-start]').click();await expect(page.locator('.learning-picture')).toBeVisible();await expect(page.locator('#traditional-section')).toBeHidden();await expect(page.locator('.daily-nav')).toHaveCount(0);await expect(page.locator('.lesson-text')).toContainText('El cero');await fit(page);while(await page.locator('[data-action=basic-forward]').count())await page.locator('[data-action=basic-forward]').click();const first=await page.evaluate(()=>CachasteDailyApp.basics.current());await page.locator('[data-action=basic-choice][data-index="'+((first.answer+1)%4)+'"]').click();await page.locator('[data-action=basic-check]').click();await expect(page.locator('.wise-cat')).toHaveAttribute('data-cat-state','error');await page.reload();await expect(page.locator('.answer-feedback')).toBeVisible();await page.locator('[data-action=basic-next]').click();expect(await page.evaluate(()=>CachasteDailyApp.basics.current().id)).not.toBe(first.id);await page.locator('[data-action=pause]').click();await expect(page.locator('[data-action=resume]')).toBeVisible();await fit(page);expect(errors).toEqual([]);});
test('Materias y menciones: navegación y práctica libre sin diagnóstico obligatorio',async({page})=>{for(const s of['M1','M2','Lectura','Ciencias','Historia']){await choose(page,s,'Química');await expect(page.locator('.stage-banner')).toBeVisible();await page.locator('[data-action=practice]').click();await page.locator('#daily-count').fill('1');await page.locator('[data-action=free]').click();await expect(page.locator('.question-title')).toBeVisible();await expect(page.locator('#traditional-section')).toBeHidden();await fit(page);if(s==='Ciencias'){expect(await page.evaluate(()=>{const e=CachasteDailyApp.engine,q=e.byKey.get(e.state.session.keys[0]);return q.module==='MC'||q.subject==='Química';})).toBe(true);}await page.locator('[data-action=pause]').click();await page.locator('[data-action=practice]').click();await page.locator('[data-action=close]').click();}});
test('PAES: tres modos, distractor específico y comprobación diferente conservan historial',async({page})=>{await choose(page);await page.evaluate(()=>{const e=CachasteDailyApp.engine;e.start('M1',2,'lesson','Descuento porcentual');location.hash='#session';CachasteDailyApp.render();});while(await page.locator('[data-action=intro-next]').count())await page.locator('[data-action=intro-next]').click();await page.locator('[data-action=begin-question]').click();const q=await page.evaluate(()=>{const e=CachasteDailyApp.engine;return e.byKey.get(e.state.session.keys[0]);});await page.locator('[data-action=choice][data-index="'+((q.answer+1)%4)+'"]').click();await page.locator('[data-confidence=duda]').click();await page.locator('[data-action=check]').click();await expect(page.locator('.answer-feedback')).toHaveText(q.explanations[(q.answer+1)%4]);for(const mode of ['easy','example']){await page.locator('[data-mode="'+mode+'"]').click();await expect(page.locator('.tutor .lesson-text')).toHaveText(mode==='easy'?q.teaching.intuition[0]:q.teaching.example.problem);}await page.reload();await expect(page.locator('.answer-feedback')).toBeVisible();await page.locator('[data-action=next]').click();expect(await page.evaluate(()=>{const e=CachasteDailyApp.engine;return e.byKey.get(e.state.session.keys[e.state.session.index]).key;})).not.toBe(q.key);await fit(page);});
test('Dos comprobaciones reales celebran y desbloquean la siguiente base, sin duplicar XP al reabrir',async({page})=>{await basic(page);while(await page.locator('[data-action=basic-forward]').count())await page.locator('[data-action=basic-forward]').click();for(let n=0;n<2;n++){const q=await page.evaluate(()=>CachasteDailyApp.basics.current());await page.locator('[data-action=basic-choice][data-index="'+q.answer+'"]').click();await page.locator('[data-action=basic-check]').click();await page.locator('[data-action=basic-next]').click();}await expect(page.locator('.celebration-screen')).toContainText('¡Ahora sí cachaste!');const xp=await page.evaluate(()=>CachasteDailyApp.engine.stats().xp);expect(xp).toBe(30);await page.reload();expect(await page.evaluate(()=>CachasteDailyApp.engine.stats().xp)).toBe(xp);await page.locator('[data-action=next-quest]').click();await expect(page.locator('.trail-stop.mastered').first()).toContainText('Números y cantidades');await expect(page.locator('.trail-stop.current')).toContainText('Juntar y quitar');await expect(page.locator('.trail-stop.current .trail-node')).toBeFocused();await fit(page);});
test('Gráfico M1 y evidencia de Lectura siguen disponibles dentro de la pantalla de lección',async({page})=>{await choose(page);await page.evaluate(()=>{const e=CachasteDailyApp.engine,q=CACHASTE_DAILY_CATALOG.items.find(q=>q.subjectKey==='M1'&&q.visual);e.start('M1',1);e.state.session.keys=[q.key];e.save();location.hash='#session';CachasteDailyApp.render();});await expect(page.locator('.question-visual svg')).toBeVisible();await page.locator('[data-action=pause]').click();await page.locator('[data-action=practice]').click();await page.locator('[data-action=close]').click();await choose(page,'Lectura');await page.locator('[data-action=practice]').click();await page.locator('[data-action=free]').click();const q=await page.evaluate(()=>{const e=CachasteDailyApp.engine;return e.byKey.get(e.state.session.keys[0]);});await page.locator('[data-action=choice][data-index="'+q.answer+'"]').click();await page.locator('[data-confidence=seguro]').click();await page.locator('[data-action=check]').click();await expect(page.locator('.daily-passage mark').first()).toBeVisible();await fit(page);});

test('Gatito expresa duda, pista y resultado sin perder controles táctiles',async({page})=>{
 await choose(page,'M1');
 await page.locator('[data-action=practice]').click();
 await page.locator('#daily-count').fill('1');
 await page.locator('[data-action=free]').click();
 await expect(page.locator('.wise-cat[data-cat-state=thinking]')).toBeVisible();
 await page.locator('[data-confidence=duda]').click();
 await expect(page.locator('.wise-cat[data-cat-state=encouraging]')).toBeVisible();
 await page.locator('[data-action=hint]').click();
 await expect(page.locator('.wise-cat[data-cat-state=explaining]')).toBeVisible();
 const wrong=await page.evaluate(()=>{const e=CachasteDailyApp.engine,q=e.byKey.get(e.state.session.keys[e.state.session.index]);return(q.answer+1)%q.options.length;});
 await page.locator('[data-action=choice][data-index="'+wrong+'"]').click();
 await page.locator('[data-action=check]').click();
 await expect(page.locator('.wise-cat[data-cat-state=error]')).toBeVisible();
 await expect(page.locator('[data-action=next]')).toBeVisible();
 await fit(page);
});

test('Mapa muestra avance real de dominio sin confundir XP con misiones completadas',async({page})=>{
 await choose(page,'M1');
 const progress=page.locator('.world-hud .world-progress');
 await expect(progress).toHaveCount(1);
 const expected=await page.locator('.learning-trail .trail-stop.mastered').count();
 const total=await page.locator('.learning-trail .trail-stop').count();
 await expect(progress).toHaveAttribute('aria-valuemin','0');
 await expect(progress).toHaveAttribute('aria-valuemax',String(Math.max(1,total)));
 await expect(progress).toHaveAttribute('aria-valuenow',String(expected));
 await expect(progress.locator('span')).toHaveAttribute('style','width:'+Math.round(expected/Math.max(1,total)*100)+'%');
 await fit(page);
});

test('Tutor ofrece aprender antes de comprobar estrellas en una habilidad nueva',async({page})=>{
 await choose(page,'M1');
 const target=page.locator('.trail-stop.current .trail-node').first();
 await target.click();
 await expect(page.locator('.star-tutor-guide')).toContainText('0 de 5 estrellas');
 await expect(page.locator('.mission-actions [data-action=lesson]')).toHaveText('Aprender para mi siguiente estrella');
 await expect(page.locator('.mission-actions [data-action=lesson]')).toHaveClass(/primary/);
 await page.locator('.mission-actions [data-action=lesson]').click();
 await expect(page.locator('.daily-session-head, .lesson-top').first()).toBeVisible();
 await fit(page);
});
