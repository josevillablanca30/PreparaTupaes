import {test,expect} from '@playwright/test';
import {database,users,sessions,grantTest} from '../web/tests/database.mjs';
import {originalCatalogSeed} from '../scripts/seed-original-learning.mjs';
let db;
const token=Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url')+'.'+Buffer.from(JSON.stringify({sub:users[0],role:'authenticated',session_id:sessions[0],exp:Math.floor(Date.now()/1000)+3600})).toString('base64url')+'.fixture';
const user={id:users[0],email:'basic-fixture@example.test',aud:'authenticated',role:'authenticated',app_metadata:{provider:'email'},user_metadata:{},created_at:'2026-11-20T00:00:00Z',email_confirmed_at:'2026-11-20T00:00:00Z'};
async function install(context){
 await context.addInitScript(({token,user})=>{window.CachasteWebBootstrap={originalEngineEnabled:true};localStorage.setItem('cachaste-auth-v1',JSON.stringify({access_token:token,refresh_token:'fixture-refresh',expires_at:Math.floor(Date.now()/1000)+3600,expires_in:3600,token_type:'bearer',user}));},{token,user});
 await context.route('https://jmobinmdwrmdqrxtcruj.supabase.co/**',async route=>{
  const req=route.request(),url=new URL(req.url());if(req.method()==='OPTIONS'){await route.fulfill({status:200,headers:{'access-control-allow-origin':'*','access-control-allow-headers':'*'}});return;}
  let result,status=200;
  try{
   if(url.pathname==='/auth/v1/user')result=user;
   else if(url.pathname.startsWith('/rest/v1/rpc/')){
    const name=url.pathname.split('/').at(-1),p=req.postDataJSON()||{};
    if(!['cachaste_original_learning','cachaste_learning_access','cachaste_web_progress'].includes(name))throw Error('UNEXPECTED_RPC '+name);
    await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({sub:users[0],session_id:sessions[0],role:'authenticated'})]);await db.exec('set role authenticated');
    try{result=(await db.query(name==='cachaste_learning_access'?'select public.cachaste_learning_access() result':`select public.${name}($1,$2::jsonb) result`,name==='cachaste_learning_access'?[]:[p.operation,JSON.stringify(p.payload||{})])).rows[0].result;}finally{await db.exec('reset role');}
   }else throw Error('UNEXPECTED_REQUEST '+url.pathname);
  }catch(e){result={code:'42501',message:e.message};status=400;}
  await route.fulfill({status,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(result)});
 });
}
test.beforeEach(async({context})=>{db=await database();await db.exec(originalCatalogSeed());await db.exec('update cachaste_web.basic_feature_flags set original_learning_enabled=true');await install(context);});
test.afterEach(async()=>{await db?.close();});
async function launch(page){
 await page.evaluate(()=>{const E=window.CachasteDailyApp.engine;const concept=[...E.byKey.values()].find(q=>q.subjectKey==='M1').concept;E.start('M1',2,'lesson',concept);});
 await expect.poll(()=>page.evaluate(()=>window.CachasteDailyApp.engine.state.session?.basicAttempt)).toBe(true);
}
async function finish(page){
 for(let i=0;i<2;i++){
  await page.evaluate(()=>{const E=window.CachasteDailyApp.engine;E.state.session.stage='question';E.state.session.studied=false;E.save();window.CachasteDailyApp.render();});
  const answer=await page.evaluate(()=>{const E=window.CachasteDailyApp.engine;return E.byKey.get(E.state.session.keys[E.state.session.index]).answer;});
  await page.locator(`[data-action="choice"][data-index="${answer}"]`).click();await page.locator('[data-action="check"]').click();
  await expect.poll(()=>page.evaluate(()=>window.CachasteDailyApp.engine.state.session?.checked)).toBe(true);
  await page.locator('[data-action="next"]').click();
  if(i===0)await expect.poll(()=>page.evaluate(()=>window.CachasteDailyApp.engine.state.session?.index)).toBe(1);
 }
 await expect.poll(()=>page.evaluate(()=>window.CachasteDailyApp.engine.state.session)).toBe(null);
 await expect(page.locator('.celebration-screen')).toBeVisible();
}
test('Basic completes three original lesson stages, keeps mascot/tutor and stops a fourth',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/inicio.html');await expect.poll(()=>page.evaluate(()=>!!window.CachasteDailyApp)).toBe(true);
 await expect(page.locator('.reference-brand')).toBeVisible();
 for(let n=0;n<3;n++){await launch(page);await expect(page.locator('.reference-lesson-hero').first()).toBeVisible();await finish(page);}
 await page.evaluate(()=>{const E=window.CachasteDailyApp.engine;E.start('M1',2,'lesson',[...E.byKey.values()].find(q=>q.subjectKey==='M1').concept);});
 await expect(page.locator('[data-learning-notice]')).toContainText('Vuelve mañana');expect(errors).toEqual([]);
 expect((await db.query('select count(*) n from cachaste_web.basic_usage')).rows[0].n).toBe(3);
});
test('Reload and another device recover a server-owned attempt; local quota/session edits do not add access',async({page,browser})=>{
 await page.goto('/inicio.html');await expect.poll(()=>page.evaluate(()=>!!window.CachasteDailyApp)).toBe(true);await launch(page);
 const id=await page.evaluate(()=>window.CachasteDailyApp.engine.state.session.id);
 await page.reload();await expect.poll(()=>page.evaluate(()=>window.CachasteDailyApp?.engine.state.session?.id)).toBe(id);
 const second=await browser.newContext();await install(second);const other=await second.newPage();await other.goto('/inicio.html');await expect.poll(()=>other.evaluate(()=>window.CachasteDailyApp?.engine.state.session?.id)).toBe(id);await second.close();
 await page.evaluate(()=>{localStorage.setItem('premium','true');localStorage.setItem('basic-quota','0');});await page.reload();await expect.poll(()=>page.evaluate(()=>window.CachasteDailyApp?.engine.state.session?.id)).toBe(id);
});
test('Premium keeps the original 15-question subject Express and full-exam launcher',async({page})=>{
 await db.exec("update cachaste.settings set environment='test'");await grantTest(db,0);
 await page.goto('/inicio.html');await expect.poll(()=>page.evaluate(()=>!!window.CachasteDailyApp)).toBe(true);
 await page.evaluate(()=>window.CachasteDailyApp.engine.startExpress('Historia'));await expect.poll(()=>page.evaluate(()=>window.CachasteDailyApp.engine.state.session?.keys.length)).toBe(15);
 expect(await page.evaluate(()=>window.CachasteDailyApp.engine.state.session.basicAttempt)).toBeUndefined();
 expect((await db.query('select count(*) n from cachaste_web.basic_usage')).rows[0].n).toBe(0);
});
