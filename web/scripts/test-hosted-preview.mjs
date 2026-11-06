// Explicit end-to-end QA of this preview only. Temporary Auth users are removed in finally.
// All privileged credentials remain in process memory; no email or payment is sent.
import {createClient} from '@supabase/supabase-js';
import {chromium,devices,expect} from '@playwright/test';
import {randomUUID} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {PROJECT_URL,PUBLISHABLE_KEY} from '../shared/config.mjs';
import {PREVIEW_BRANCH,REPOSITORY,previewUrl} from './pages-client.mjs';
const project='jmobinmdwrmdqrxtcruj',revision=process.env.GITHUB_SHA;
if(process.env.GITHUB_REPOSITORY!==REPOSITORY||process.env.GITHUB_REF_NAME!==PREVIEW_BRANCH||!process.env.SUPABASE_ACCESS_TOKEN||!/^\w{40}$/.test(revision||''))throw Error('HOSTED_QA_CONTEXT_REQUIRED');
const report=JSON.parse(await readFile('web/artifacts/pages-preview.json','utf8')),origin=previewUrl(report.url);
assert.equal(report.revision,revision);assert.equal(report.passed,true);
const management=async(suffix,body)=>{
 const r=await fetch('https://api.supabase.com/v1/projects/'+project+suffix,{method:body?'POST':'GET',redirect:'error',signal:AbortSignal.timeout(20000),headers:{authorization:'Bearer '+process.env.SUPABASE_ACCESS_TOKEN,...(body?{'content-type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
 if(!r.ok)throw Error('HOSTED_MANAGEMENT_HTTP_'+r.status);return r.json();
};
const query=(sql,parameters=[])=>management('/database/query',{query:sql,parameters});
const createSdk=()=>createClient(PROJECT_URL,PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const users=[],clients=[],contexts=[],checks=[],qaRun=randomUUID().replaceAll('-','').slice(0,12);let admin,browser,stage='access',failed=null,cleanup=true;
const record=name=>{checks.push({name,passed:true});console.log('PASS '+name);};
async function rpc(index,operation,payload={}){const r=await clients[index].rpc('cachaste_competition',{operation,payload});assert.ifError(r.error);return r.data;}
async function login(page,c){await page.goto(origin+'/cuenta.html');await page.getByLabel('Correo electrónico',{exact:true}).fill(c.email);await page.getByLabel('Contraseña',{exact:true}).fill(c.password);await page.getByRole('button',{name:'Entrar a mi cuenta',exact:false}).click();await expect(page.locator('[data-action=pick-course]')).toHaveCount(5);}
async function finishDuel(page,index){
 const started=page.waitForResponse(r=>r.url().endsWith('/rpc/cachaste_competition')&&r.request().postDataJSON()?.operation==='start');
 await page.getByRole('button',{name:'Comenzar duelo',exact:true}).click();let attempt=await(await started).json();const keys=[];
 for(let n=0;n<10;n++){
  await expect(page.locator('.question-meta strong')).toContainText((n+1)+'/10');keys.push(attempt.question.key);
  assert.equal(attempt.question.answer,undefined);assert.equal(attempt.question.steps,undefined);
  const rows=await query('select q.answer from cachaste.questions q join cachaste.attempts a on q.key=any(a.question_keys) where a.id=$1::uuid and a.user_id=$2::uuid and q.key=$3',[attempt.id,users[index].id,attempt.question.key]);
  assert.equal(rows.length,1);const correct=rows[0].answer,choice=index===0?correct:(correct+1)%attempt.question.options.length;
  await page.getByRole('radio').nth(choice).check();
  const answered=page.waitForResponse(r=>r.url().endsWith('/rpc/cachaste_competition')&&r.request().postDataJSON()?.operation==='answer');
  await page.getByRole('button',{name:'Enviar respuesta',exact:true}).click();attempt=await(await answered).json();
 }
 return keys;
}
try{
 const version=await fetch(origin+'/version.json',{cache:'no-store'}).then(r=>r.json());assert.equal(version.revision,revision);assert.equal(version.paymentsEnabledByBuild,false);
 const keys=await management('/api-keys?reveal=true');const secret=keys.find(k=>k.name==='service_role')?.api_key||keys.find(k=>k.type==='secret')?.api_key;
 if(!secret)throw Error('HOSTED_ADMIN_KEY_NOT_AVAILABLE');
 admin=createClient(PROJECT_URL,secret,{auth:{persistSession:false,autoRefreshToken:false}});
 stage='signup';
 for(let i=0;i<2;i++){
  const credentials={email:'cachaste-web-qa-'+qaRun+'-'+i+'@example.invalid',password:randomUUID()+randomUUID()},created=await admin.auth.admin.generateLink({type:'signup',...credentials});assert.ifError(created.error);
  const id=created.data.user.id;users.push({id,...credentials,nickname:'QA_'+qaRun+'_'+i});
  const sdk=createSdk();clients.push(sdk);assert.ifError((await sdk.auth.verifyOtp({token_hash:created.data.properties.hashed_token,type:'signup'})).error);assert.ifError((await sdk.auth.signInWithPassword(credentials)).error);
  await query("insert into cachaste.closed_test_access(user_id,valid_until,reason)values($1::uuid,now()+interval '20 minutes',$2)",[id,'web-unificada-qa:'+qaRun]);
  assert.equal((await sdk.rpc('cachaste_access')).data.active,true);
  await rpc(i,'save_profile',{nickname:users[i].nickname,communeCode:'05701',avatar:i,publicRanking:true,allowChallenges:true,showCommune:false,communityVersion:'2026-10-23'});
 }
 record('Two new real Auth identities confirm signup and sign in; confirmation email delivery is excluded');
 stage='browser-login';browser=await chromium.launch({headless:true});
 for(const use of [{viewport:{width:1365,height:900}},devices['Pixel 7']])contexts.push(await browser.newContext({...use,locale:'es-CL'}));
 const pages=await Promise.all(contexts.map(c=>c.newPage()));for(const p of pages)p.setDefaultTimeout(25000);
 await Promise.all(pages.map((p,i)=>login(p,users[i])));record('Desktop and Android-sized browser sign in through the deployed UI and cookie gate');
 stage='learning';
 const a=pages[0],b=pages[1];for(const subject of ['M1','M2','Lectura','Ciencias','Historia']){await a.goto(origin+'/app/inicio.html#courses');await a.locator('[data-action=pick-course][data-subject="'+subject+'"]').click();if(subject==='Ciencias')await a.locator('[data-track=Biología]').click();await expect(a.locator('[data-action=game-mode]')).toBeVisible();}
 await a.evaluate(()=>CachasteWebProgress.flush());await expect.poll(()=>a.evaluate(()=>CachasteWebProgress.pending())).toBe(0);
 const second=await browser.newContext({viewport:{width:390,height:844},locale:'es-CL'});contexts.push(second);const same=await second.newPage();await login(same,users[0]);await expect.poll(()=>same.evaluate(()=>CachasteDailyApp.engine.state.subject)).toBe('Historia');await same.close();
 assert.deepEqual((await clients[1].rpc('cachaste_web_progress',{operation:'snapshot',payload:{}})).data.documents.filter(d=>d.key==='cachaste-daily-v1'),[]);
 record('Five subjects open; a second browser resumes the same account and a different account stays separate');
 stage='full-education';
 // Exercise the real deployed learning UI, not only its five subject selection cards.
 await a.goto(origin+'/app/inicio.html#courses');
 await a.locator('[data-action=pick-course][data-subject="M1"]').click();
 await a.locator('[data-action=game-mode]').click();
 await a.locator('.trail-stop.current .trail-node').click();
 await a.locator('[data-action=lesson]').click();
 await expect(a.locator('.visual-lesson')).toBeVisible();
 for(let step=0;step<22&&!await a.locator('.visual-probe').count();step++)await a.locator('[data-action=intro-next]').click();
 await expect(a.locator('.visual-probe')).toBeVisible();
 const visualAnswer=await a.evaluate(()=>{const e=CachasteDailyApp.engine,s=e.state.session,q=e.byKey.get(s.keys[s.index]);return CachasteLessons.current(q,s.visualLesson).answer;});
 await a.locator('[data-action=visual-choose][data-value="'+visualAnswer+'"]').click();
 await expect(a.locator('.visual-response.right')).toBeVisible();
 record('Real deployed tutor opens its visual lesson and validates a correct conceptual answer');
 await a.goto(origin+'/app/inicio.html#courses');
 await a.locator('[data-action=pick-course][data-subject="M1"]').click();
 await a.locator('[data-action=express-mode]').click();
 for(let n=0;n<15;n++){
  await expect(a.locator('.question-title')).toBeVisible();
  const answer=await a.evaluate(n=>{const e=CachasteDailyApp.engine,s=e.state.session,q=e.byKey.get(s.keys[s.index]);return n<10?q.answer:(q.answer+1)%q.options.length;},n);
  await a.locator('[data-action=choice][data-index="'+answer+'"]').click();
  await a.locator('[data-action=check]').click();
  await a.locator('[data-action=next]').click();
 }
 await expect(a.locator('.express-report')).toContainText('10/15');
 await expect(a.locator('.express-review')).toHaveCount(15);
 await a.evaluate(()=>CachasteWebProgress.flush());
 await expect.poll(()=>a.evaluate(()=>CachasteWebProgress.pending())).toBe(0);
 record('Real deployed Express completes fifteen questions, verifies the 10/15 result and synchronizes review');
 await a.goto(origin+'/app/inicio.html#courses');
 await a.locator('[data-action=pick-course][data-subject="M2"]').click();
 await a.locator('[data-action=exam-mode]').click();
 await expect(a).toHaveURL(/modo=ensayo/);
 const examOptions=a.locator('[data-choice],.option,.answer-option');
 await expect(examOptions.first()).toBeVisible();
 await examOptions.first().click();
 await expect(examOptions.first()).toHaveClass(/selected|chosen/);
 await a.evaluate(()=>CachasteWebProgress.flush());
 await expect.poll(()=>a.evaluate(()=>CachasteWebProgress.pending())).toBe(0);
 await a.reload();
 await a.getByRole('button',{name:'Retomar sesión guardada',exact:true}).click();
 await expect(a.locator('[data-choice],.option,.answer-option').first()).toHaveClass(/selected|chosen/);
 record('Real deployed complete M2 exam resumes the selected answer after reload');
 await mkdir('web/artifacts/hosted-live',{recursive:true});
 await a.screenshot({path:'web/artifacts/hosted-live/full-exam-m2-desktop.png',fullPage:true});
 stage='duels';await Promise.all(pages.map(p=>p.goto(origin+'/app/competencia.html#duelos')));
 const duelIds=[];
 for(let round=0;round<3;round++){
  if(round===0){await a.getByRole('button',{name:'Desafiar',exact:true}).click();await a.getByRole('textbox',{name:'Nickname',exact:true}).fill(users[1].nickname);}
  else{await a.getByRole('button',{name:/Pedir revancha/}).click();await expect(a.getByRole('textbox',{name:'Nickname',exact:true})).toHaveValue(users[1].nickname);}
  const invitation=a.waitForResponse(r=>r.url().endsWith('/rpc/cachaste_competition')&&r.request().postDataJSON()?.operation==='create_duel');
  await a.getByRole('button',{name:'Enviar desafío',exact:true}).click();const created=await(await invitation).json();duelIds.push(created.id);
  await b.goto(origin+'/app/competencia.html#duelos');await b.locator('[data-action=accept][data-id="'+created.id+'"]').click();
  await a.getByRole('button',{name:'Actualizar duelo',exact:true}).click();
  const first=await finishDuel(a,0);const current=await rpc(0,'duel',{duelId:created.id});assert.equal(current.status,'active');
  const review=await clients[0].rpc('cachaste_competition',{operation:'review',payload:{attemptId:current.attemptId}});assert.ok(review.error);
  const second=await finishDuel(b,1);assert.deepEqual(first,second);
  await a.goto(origin+'/app/competencia.html#duelos');await a.locator('[data-action=open-duel][data-id="'+created.id+'"]').click();await expect(a.getByRole('heading',{name:'Resultado del duelo',exact:false})).toBeVisible();
  const result=await rpc(0,'duel',{duelId:created.id});assert.equal(result.result.creator.correct,10);assert.equal(result.result.opponent.correct,0);assert.equal(result.result.winner,users[0].id);
 }
 assert.equal(new Set(duelIds).size,3);const history=await rpc(0,'duel_history',{});assert.equal(history.summary.played,3);assert.equal(history.summary.wins,3);assert.deepEqual(new Set(history.duels.map(d=>d.id)),new Set(duelIds));
 await a.goto(origin+'/app/competencia.html#historial');await expect(a.locator('.duel-history .duel-row')).toHaveCount(3);
 const standings=await rpc(0,'rankings',{subject:'M1',track:'',mode:'duel',scope:'Chile',season:'all'});assert.ok(standings.me);assert.equal(standings.me.wins,3);
 record('Three full duels and two rematches use the real UI, same questions, independent completion, verified scores, rankings and retained history');
 await mkdir('web/artifacts/hosted-live',{recursive:true});await a.screenshot({path:'web/artifacts/hosted-live/history-desktop.png',fullPage:true});await b.screenshot({path:'web/artifacts/hosted-live/result-android.png',fullPage:true});
 stage='logout';await a.goto(origin+'/cuenta.html');await a.getByRole('button',{name:'Cerrar sesión',exact:true}).click();await expect(a.getByRole('heading',{name:'Tu preparación comienza aquí.'})).toBeVisible();assert.equal((await a.request.get(origin+'/app/daily-catalog.js')).status(),401);record('Logout revokes the browser cookie and private bank access');
}catch(e){failed=stage;console.error('HOSTED_PREVIEW_QA_FAILED at '+stage);process.exitCode=1;}
finally{
 for(const c of contexts)await c.close().catch(()=>{});if(browser)await browser.close().catch(()=>{});
 for(const sdk of clients)await sdk.auth.stopAutoRefresh();
 if(admin)for(const u of users){try{if(!/^cachaste-web-qa-[a-f0-9]{12}-[01]@example\.invalid$/.test(u.email))throw Error();const result=await admin.auth.admin.deleteUser(u.id);assert.ifError(result.error);}catch{cleanup=false;}}
 if(admin)await admin.auth.stopAutoRefresh();
 if(!cleanup){console.error('HOSTED_QA_TEMPORARY_ACCOUNT_CLEANUP_FAILED');process.exitCode=1;}
 await mkdir('web/artifacts/hosted-live',{recursive:true});
 await writeFile('web/artifacts/hosted-live/report.json',JSON.stringify({origin,revision,scope:'Real Cloudflare preview and hosted Supabase; two disposable accounts with temporary test access',passed:!failed&&cleanup,failedStage:failed,temporaryAccounts:users.length,temporaryAccountsRemoved:cleanup,emailSent:false,realPayments:false,physicalPhones:false,checks},null,2)+'\n');
}
