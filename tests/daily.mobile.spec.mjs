import{test,expect}from'@playwright/test';
const fit=async p=>expect(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
async function choose(p,s='M1',track){await p.goto('./inicio.html#courses');await p.locator('[data-action=pick-course][data-subject="'+s+'"]').click();await p.waitForURL(/#(?:tracks|modes|home)$/);if(await p.evaluate(()=>location.hash==='#modes')){await p.locator('[data-action=game-mode]').click();await p.locator('.mode-picker').waitFor({state:'detached'});}if(s==='Ciencias')await p.locator('[data-track="'+(track||'Biología')+'"]').click();await p.waitForURL(/#(?:tracks|modes|home)$/);if(await p.evaluate(()=>location.hash==='#modes')){await p.locator('[data-action=game-mode]').click();await p.locator('.mode-picker').waitFor({state:'detached'});}}
async function basic(p){await choose(p);await p.locator('.stage-banner [data-action=units]').click();await p.locator('[data-action=stage][data-stage=basics]').click();await p.locator('[data-action=basic-level]').first().click();await p.locator('[data-action=basic-start]').click();await expect(p.locator('.learning-picture')).toBeVisible();}
test('Desde cero: cinco materias claras, primera misión con imágenes y sin tarjetas de ensayos debajo',async({page})=>{const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('./inicio.html');await expect(page.locator('[data-action=pick-course]')).toHaveCount(5);await choose(page);await expect(page.locator('.stage-banner')).toContainText('ETAPA');await expect(page.locator('.stage-banner')).toBeVisible();await page.locator('.stage-banner [data-action=units]').click();await page.locator('[data-action=stage][data-stage=basics]').click();await expect(page.locator('.stage-banner')).toContainText('Fundamentos');await expect(page.locator('.trail-stop.current')).toContainText('Números y cantidades');await page.locator('[data-action=basic-level]').first().click();await page.locator('[data-action=basic-start]').click();await expect(page.locator('.learning-picture')).toBeVisible();await expect(page.locator('#traditional-section')).toBeHidden();await expect(page.locator('.daily-nav')).toHaveCount(0);await expect(page.locator('.lesson-text')).toContainText('El cero');await fit(page);while(await page.locator('[data-action=basic-forward]').count())await page.locator('[data-action=basic-forward]').click();const first=await page.evaluate(()=>CachasteDailyApp.basics.current());await page.locator('[data-action=basic-choice][data-index="'+((first.answer+1)%4)+'"]').click();await page.locator('[data-action=basic-check]').click();await expect(page.locator('.wise-cat')).toHaveAttribute('data-cat-state','error');await page.reload();await expect(page.locator('.answer-feedback')).toBeVisible();await page.locator('[data-action=basic-next]').click();expect(await page.evaluate(()=>CachasteDailyApp.basics.current().id)).not.toBe(first.id);await page.locator('[data-action=pause]').click();await expect(page.locator('[data-action=resume]')).toBeVisible();await fit(page);expect(errors).toEqual([]);});
test('Materias y menciones: navegación y práctica libre sin diagnóstico obligatorio',async({page})=>{for(const s of['M1','M2','Lectura','Ciencias','Historia']){await choose(page,s,'Química');await expect(page.locator('.stage-banner')).toBeVisible();await page.evaluate(()=>{location.hash='#practice';CachasteDailyApp.render();});await page.locator('#daily-count').fill('1');await page.locator('[data-action=free]').click();await expect(page.locator('.question-title')).toBeVisible();await expect(page.locator('#traditional-section')).toBeHidden();await fit(page);if(s==='Ciencias'){expect(await page.evaluate(()=>{const e=CachasteDailyApp.engine,q=e.byKey.get(e.state.session.keys[0]);return q.module==='MC'||q.subject==='Química';})).toBe(true);}await page.locator('[data-action=pause]').click();await page.evaluate(()=>{location.hash='#practice';CachasteDailyApp.render();});await page.locator('[data-action=close]').click();}});
test('PAES: tres modos, distractor específico y comprobación diferente conservan historial',async({page})=>{await choose(page);await page.evaluate(()=>{const e=CachasteDailyApp.engine;e.start('M1',2,'lesson','Descuento porcentual');location.hash='#session';CachasteDailyApp.render();});while(await page.locator('[data-action=intro-next]').count())await page.locator('[data-action=intro-next]').click();await page.locator('[data-action=begin-question]').click();const q=await page.evaluate(()=>{const e=CachasteDailyApp.engine;return e.byKey.get(e.state.session.keys[0]);});await page.locator('[data-action=choice][data-index="'+((q.answer+1)%4)+'"]').click();await page.locator('[data-action=check]').click();await expect(page.locator('.answer-feedback')).toHaveText(q.explanations[(q.answer+1)%4]);for(const mode of ['easy','example']){await page.locator('[data-mode="'+mode+'"]').click();await expect(page.locator('.tutor .lesson-text')).toHaveText(mode==='easy'?q.teaching.intuition[0]:q.teaching.example.problem);}await page.reload();await expect(page.locator('.answer-feedback')).toBeVisible();await page.locator('[data-action=next]').click();expect(await page.evaluate(()=>{const e=CachasteDailyApp.engine;return e.byKey.get(e.state.session.keys[e.state.session.index]).key;})).not.toBe(q.key);await fit(page);});
test('Dos comprobaciones reales celebran y desbloquean la siguiente base, sin duplicar XP al reabrir',async({page})=>{await basic(page);while(await page.locator('[data-action=basic-forward]').count())await page.locator('[data-action=basic-forward]').click();for(let n=0;n<2;n++){const q=await page.evaluate(()=>CachasteDailyApp.basics.current());await page.locator('[data-action=basic-choice][data-index="'+q.answer+'"]').click();await page.locator('[data-action=basic-check]').click();await page.locator('[data-action=basic-next]').click();}await expect(page.locator('.celebration-screen')).toContainText('¡Ahora sí cachaste!');const xp=await page.evaluate(()=>CachasteDailyApp.engine.stats().xp);expect(xp).toBe(30);await page.reload();expect(await page.evaluate(()=>CachasteDailyApp.engine.stats().xp)).toBe(xp);await page.locator('[data-action=next-quest]').click();await expect(page.locator('.trail-stop.mastered').first()).toContainText('Números y cantidades');await expect(page.locator('.trail-stop.current')).toContainText('Juntar y quitar');await expect(page.locator('.trail-stop.current .trail-node')).toBeFocused();await fit(page);});
test('Gráfico M1 y evidencia de Lectura siguen disponibles dentro de la pantalla de lección',async({page})=>{await choose(page);await page.evaluate(()=>{const e=CachasteDailyApp.engine,q=CACHASTE_DAILY_CATALOG.items.find(q=>q.subjectKey==='M1'&&q.visual);e.start('M1',1);e.state.session.keys=[q.key];e.state.session.questionSnapshots=[{...q,assessmentVersion:CachasteLearning.assessmentVersion(q),...(q.passageId?{passageSnapshot:CACHASTE_DAILY_CATALOG.texts.find(p=>p.id===q.passageId)}:{})}];e.save();location.hash='#session';CachasteDailyApp.render();});await expect(page.locator('.question-visual svg')).toBeVisible();await page.locator('[data-action=pause]').click();await page.evaluate(()=>{location.hash='#practice';CachasteDailyApp.render();});await page.locator('[data-action=close]').click();await choose(page,'Lectura');await page.evaluate(()=>{location.hash='#practice';CachasteDailyApp.render();});await page.locator('[data-action=free]').click();const q=await page.evaluate(()=>{const e=CachasteDailyApp.engine;return e.byKey.get(e.state.session.keys[0]);});await page.locator('[data-action=choice][data-index="'+q.answer+'"]').click();await page.locator('[data-action=check]').click();await expect(page.locator('.daily-passage mark').first()).toBeVisible();await fit(page);});

test('Gatito acompaña la pregunta, pista y resultado sin perder controles táctiles',async({page})=>{
 await choose(page,'M1');
 await page.evaluate(()=>{location.hash='#practice';CachasteDailyApp.render();});
 await page.locator('#daily-count').fill('1');
 await page.locator('[data-action=free]').click();
 await expect(page.locator('.wise-cat[data-cat-state=thinking]')).toBeVisible();

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
 await expect(page.locator('.mission-preview .skill-stars')).toHaveAttribute('aria-label',/0 de 5 estrellas/);
 await expect(page.locator('.mission-actions [data-action=lesson]')).toHaveText('Comenzar lección');
 await expect(page.locator('.mission-actions [data-action=lesson]')).toHaveClass(/primary/);
 await page.locator('.mission-actions [data-action=lesson]').click();
 await expect(page.locator('.daily-session-head, .lesson-top').first()).toBeVisible();
 await fit(page);
});

test('Mapa: cuatro estrellas desbloquean la siguiente habilidad',async({page})=>{
 await choose(page,'M1');
 const skill=await page.evaluate(()=>{
  const app=CachasteDailyApp,e=app.engine,C=CachasteCurriculum;
  const route=C.course(CACHASTE_DAILY_CATALOG.items.filter(q=>q.subjectKey==='M1'),'M1').flatMap(u=>u.levels);
  const n=route.findIndex((level,i)=>i>0&&new Set(CACHASTE_DAILY_CATALOG.items.filter(q=>q.subjectKey==='M1'&&q.concept===route[i-1].objective).map(q=>q.transferGroup||q.family||q.key)).size>=2);
  return n<0?null:{id:route[n].id,previous:route[n-1].objective};
 });
 if(!skill)return;
 await page.goto('./inicio.html#level:'+encodeURIComponent(skill.id));
 await expect(page.locator('.skill-gate')).toContainText('4 estrellas');await expect(page.locator('.skill-gate [data-action=level]')).toBeVisible();
 await fit(page);
});


test('M2: Logaritmos y el banco completo conservan ancho móvil en 320 y 390 px', async ({page}) => {
 test.setTimeout(120000);
 await choose(page,'M2');
 for (const width of [320,390]) {
  await page.setViewportSize({width,height:740});
  const failures=await page.evaluate(() => {
   const e=CachasteDailyApp.engine;
   const bank=CACHASTE_DAILY_CATALOG.items.filter(q=>q.subjectKey==='M2');
   const problems=[];
   for(const q of bank){
    e.start('M2',1);
    e.state.session.keys=[q.key];
    e.state.session.questionSnapshots=[{...q,assessmentVersion:CachasteLearning.assessmentVersion(q)}];
    e.save();
    location.hash='#session';
    CachasteDailyApp.render();
    const actual=document.documentElement.scrollWidth;
    const allowed=document.documentElement.clientWidth+1;
    if(actual>allowed)problems.push({key:q.key,concept:q.concept,actual,allowed});
   }
   return problems;
  });
  expect(failures, 'Ancho '+width+'px: '+JSON.stringify(failures.slice(0,15))).toEqual([]);
 }
});


test('QA de 20 alertas editoriales: lectura completa, opciones e imágenes móviles',async({page})=>{
 test.setTimeout(120000);
 await choose(page,'M2');
 const flagged={
  M1:['210','224','291','292','294'],
  Ciencias:['SCI-043','SCI-124','SCI-185','TR-SCI-039','TR-SCI-055','TR-SCI-080','TR-SCI-084'],
  Lectura:['LEC-017','LEC-053','LEC-087','LEC-088'],
  M2:['M2-011','M2-072','M2-083'],
  Historia:['HIS-041']
 };
 const failures=await page.evaluate(async flagged=>{
  const app=CachasteDailyApp,e=app.engine,bank=CACHASTE_DAILY_CATALOG.items;
  const issues=[];
  for(const [subject,ids] of Object.entries(flagged)){
   for(const id of ids){
    const q=bank.find(q=>q.subjectKey===subject&&String(q.id)===id);
    if(!q){issues.push(subject+':'+id+' sin pregunta');continue;}
    e.start(subject,1);e.state.session.keys=[q.key];
    e.state.session.questionSnapshots=[{...q,assessmentVersion:CachasteLearning.assessmentVersion(q)}];
    e.save();location.hash='#session';app.render();
    const title=document.querySelector('.question-title');
    const options=document.querySelectorAll('.daily-options button');
    if(!title||!title.textContent.trim())issues.push(q.key+': enunciado ausente');
    if(options.length!==(q.options||[]).length)issues.push(q.key+': alternativas incompletas');
    for(const [i,el] of [...options].entries()){
      if(!el.textContent.trim())issues.push(q.key+': opción '+i+' vacía');
    }
    if(document.documentElement.scrollWidth>document.documentElement.clientWidth+1)issues.push(q.key+': desborde de pantalla');
    for(const el of document.querySelectorAll('.question-title,.daily-options button,.question-visual svg,.question-visual img')){
      const css=getComputedStyle(el),r=el.getBoundingClientRect();
      if(r.width===0||r.right>innerWidth+2||r.left< -2)issues.push(q.key+': elemento fuera de pantalla '+el.tagName);
      if(css.overflowX==='hidden'&&el.scrollWidth>el.clientWidth+2)issues.push(q.key+': posible texto recortado '+el.tagName);
      if(el.tagName==='IMG'){
       await new Promise(resolve=>{if(el.complete)return resolve();el.addEventListener('load',resolve,{once:true});el.addEventListener('error',resolve,{once:true});});
       if(!el.naturalWidth)issues.push(q.key+': imagen fallida');
      }
    }
   }
  }
  return issues;
 },flagged);
 expect(failures).toEqual([]);
});


test('Integridad visual: imagen del gatito y áreas gráficas en recorridos de las cinco materias',async({page})=>{
 test.setTimeout(120000);
 for(const subject of ['M1','M2','Lectura','Ciencias','Historia']){
  await choose(page,subject,'Biología');
  const problems=await page.evaluate(async subject=>{
    const bank=CACHASTE_DAILY_CATALOG.items.filter(q=>q.subjectKey===subject);
    const selected=[bank[0],bank[Math.floor(bank.length/2)],bank[bank.length-1]].filter(Boolean);
    const errors=[];
    for(const q of selected){
      const e=CachasteDailyApp.engine;
      e.start(subject,1);e.state.session.keys=[q.key];
      e.state.session.questionSnapshots=[{...q,assessmentVersion:CachasteLearning.assessmentVersion(q)}];
      e.save();location.hash='#session';CachasteDailyApp.render();
      const nodes=document.querySelectorAll('.cat-frame img,.question-visual img,.question-visual svg');
      for(const el of nodes){
        const rect=el.getBoundingClientRect();
        const holder=el.closest('.cat-frame,.question-visual');
        const h=holder?.getBoundingClientRect();
        if(h&&h.width&&rect.width===0)errors.push(q.key+': gráfico sin tamaño');
        if(el.tagName==='IMG'){
          await el.decode().catch(()=>{});
          if(el.complete&&!el.naturalWidth)errors.push(q.key+': recurso visual no disponible');
        }
      }
      if(document.documentElement.scrollWidth>document.documentElement.clientWidth+1)errors.push(q.key+': ancho excedido');
    }
    return errors;
  },subject);
  expect(problems,subject+': '+JSON.stringify(problems)).toEqual([]);
 }
});
