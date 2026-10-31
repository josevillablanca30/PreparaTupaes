import {test, expect} from '@playwright/test';

// Audit every shipped variant, rather than whichever random question starts a lesson.
for (const subject of ['M1','M2','Lectura','Historia','Ciencias']) {
 test(subject+': todo el catálogo enseña, muestra sus alternativas y corrige cada error en móvil', async ({page}, info) => {
  test.setTimeout(240000);
  const errors=[];
  page.on('pageerror', error=>errors.push(error.message));
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('./inicio.html');
  const report=await page.evaluate(async subject=>{
   const e=CachasteDailyApp.engine, bank=CACHASTE_DAILY_CATALOG.items.filter(q=>q.subjectKey===subject);
   const failures=[], counts={questions:0,lessons:0,feedback:0,tutorModes:0};
   const clean=text=>String(text||'').replace(/\s+/g,' ').trim();
   let key='',state='';
   const fail=detail=>failures.push({key,state,...detail});
   function layout(){
    if(document.documentElement.scrollWidth>innerWidth+1)fail({kind:'page-overflow',width:document.documentElement.scrollWidth});
    for(const n of document.querySelectorAll('#daily-root p,#daily-root h1,#daily-root h2,#daily-root h3,#daily-root li,#daily-root button,#daily-root summary,#daily-root td,#daily-root th')){
     const r=n.getBoundingClientRect();if(r.width<=2||r.height<=2)continue; // Visually hidden context remains available to screen readers.
     if(n.scrollWidth>n.clientWidth+2)fail({kind:'internal-overflow',tag:n.tagName,class:n.className,text:clean(n.textContent).slice(0,120),width:n.clientWidth,content:n.scrollWidth});
    }
   }
   async function images(){
    for(const im of document.querySelectorAll('#daily-root img')){
     try{await im.decode();}catch{fail({kind:'image-not-loaded',src:im.getAttribute('src')});}
    }
   }
   for(const q of bank){
    key=q.key;e.close();e.state.foundationDraft=null;e.state.subject=subject;e.state.track=subject==='Ciencias'?q.subject:null;
    e.state.session={id:'catalogue-layout',subject,track:e.state.track,mode:'lesson',keys:[key],index:0,selected:null,confidence:null,checked:false,results:[],started:Date.now(),stage:'intro'};
    location.hash='#session';CachasteDailyApp.render();
    state='overview';counts.lessons++;await images();layout();
    if(document.querySelectorAll('.didactic-overview > section').length!==3)fail({kind:'missing-teaching'});
    const depth=document.querySelector('.didactic-depth');
    if(depth){depth.open=true;if(!q.teaching.foundation.every(p=>clean(depth.textContent).includes(clean(p))))fail({kind:'missing-foundation'});}
    state='reader';CachasteLessons.draft(q,e.state.session).readAll=true;CachasteDailyApp.render();layout();
    const reader=clean(document.querySelector('.lesson-reader')?.textContent);
    for(const text of [...q.teaching.foundation,...q.teaching.intuition,...q.teaching.example.steps,q.teaching.example.bridge]){
     if(!reader.includes(clean(text)))fail({kind:'missing-full-teaching',text});
    }
    document.querySelector('[data-action=visual-overview]').click();
    document.querySelector('[data-action=begin-question]').click();state='question';layout();counts.questions++;
    if(clean(document.querySelector('.question-title')?.textContent)!==clean(q.question))fail({kind:'changed-stem'});
    const choices=[...document.querySelectorAll('.daily-options button')];
    if(choices.length!==q.options.length)fail({kind:'missing-options'});
    for(let i=0;i<q.options.length;i++){
     if(clean(choices[i]?.textContent)!==clean(String.fromCharCode(65+i)+'. '+q.options[i]))fail({kind:'changed-option',index:i});
     if(i===q.answer)continue;
     const s=e.state.session;s.id='layout:'+key+':'+i;s.selected=i;s.checked=false;s.results=[];CachasteDailyApp.render();
     document.querySelector('[data-action=check]').click();state='feedback-'+i;layout();counts.feedback++;
     const repair=clean(document.querySelector('.selected-repair')?.textContent);
     if(!repair.includes(clean(q.options[i])))fail({kind:'missing-selected-error',index:i});
     for(const mode of ['steps','easy','example']){
      document.querySelector('[data-mode='+mode+']').click();state='tutor-'+mode;layout();counts.tutorModes++;
      if(!clean(document.querySelector('.tutor .lesson-text')?.textContent))fail({kind:'empty-tutor',mode});
     }
    }
   }
   return {subject,counts,failures};
  },subject);
  await info.attach('catalogue-layout-'+subject,{body:JSON.stringify(report,null,2),contentType:'application/json'});
  expect(report.failures,JSON.stringify(report.failures.slice(0,20),null,2)).toEqual([]);
  expect(errors).toEqual([]);
 });
}
