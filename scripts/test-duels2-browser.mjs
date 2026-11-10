// Two browser sessions + real isolated Postgres. Auth is a local test fixture;
// all competition RPCs execute the SQL migration. No production requests are allowed.
import{chromium,expect}from'@playwright/test';import assert from'node:assert/strict';import{createServer}from'node:http';import{readFile,mkdir,writeFile,cp}from'node:fs/promises';import{execFileSync}from'node:child_process';import{randomUUID}from'node:crypto';import path from'node:path';import{fileURLToPath}from'node:url';
import{isolatedPostgres,users,sessions}from'../tests/helpers/duels2-postgres.mjs';import{adaptCompetitionUi}from'../web/shared/competition-ui.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,'test-results/duels2'),native=path.join(root,'dist/duels2-android/dist'),web=path.join(root,'dist/duels2-web-ui');
await mkdir(out,{recursive:true});await cp(native,web,{recursive:true});await writeFile(path.join(web,'competition-app.js'),adaptCompetitionUi(execFileSync('git',['show','685e9ecc3d55d353c8c9fdf3e29f9549eaa5fac9:competition-app.js'],{encoding:'utf8'})));
const db=await isolatedPostgres();let browser;try{browser=await chromium.launch({...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox','--disable-dev-shm-usage']});}catch(error){await db.close();throw error;}
const types={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png'};
const server=createServer(async(req,res)=>{try{const uri=new URL(req.url,'http://local').pathname,platform=uri.startsWith('/native/')?'native':'web',rel=uri.replace(/^\/(native|web)\//,'');const base=platform==='native'?native:web,target=path.resolve(base,rel);if(!target.startsWith(base+'/'))throw Error('path');res.setHeader('content-type',types[path.extname(target)]||'application/octet-stream');res.end(await readFile(target));}catch{res.writeHead(404).end();}});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
const errors=[],requests=[];
async function context(i,width=390){
 const ctx=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true});
 const user={id:users[i],email:'isolated-'+i+'@example.invalid',aud:'authenticated',role:'authenticated',app_metadata:{provider:'email'},user_metadata:{},created_at:'2026-10-01T00:00:00Z'};
 const token='eyJhbGciOiJIUzI1NiJ9.'+Buffer.from(JSON.stringify({sub:users[i],session_id:sessions[i],role:'authenticated',exp:Math.floor(Date.now()/1000)+3600})).toString('base64url')+'.isolated-fixture';
 await ctx.addInitScript(({user,token})=>{localStorage.setItem('cachaste-auth-v1',JSON.stringify({user,access_token:token,refresh_token:'isolated-fixture',token_type:'bearer',expires_at:Math.floor(Date.now()/1000)+3600,expires_in:3600}));},{user,token});
 await ctx.routeWebSocket('**/*.supabase.co/**',socket=>socket.close());
 await ctx.route('https://*.supabase.co/**',async route=>{
  const url=new URL(route.request().url());try{
   if(url.pathname==='/auth/v1/user')return route.fulfill({json:user});
   if(url.pathname.startsWith('/functions/'))return route.fulfill({json:{premium:true}});
   if(url.pathname.startsWith('/rest/v1/rpc/')){
    const name=url.pathname.split('/').at(-1),body=route.request().postDataJSON()||{};requests.push({i,name,...body});
    if(name==='cachaste_competition_health')return route.fulfill({json:{catalogueReady:true,apiVersion:1}});
    if(!['cachaste_competition','cachaste_duels2'].includes(name))throw Error('Unexpected RPC '+name);
    const result=await db.rpc(i,body.operation,body.payload,name);return route.fulfill({json:result});
   }
   throw Error('Unexpected production request '+url.pathname);
  }catch(e){return route.fulfill({status:400,json:{message:e.message,code:e.code||'TEST_ERROR'}});}
 });
 const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));return{ctx,page};
}
async function layout(page){assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'mobile horizontal overflow');const clipped=await page.locator('.answer-option').evaluateAll(nodes=>nodes.some(n=>n.scrollWidth>n.clientWidth+2));assert.equal(clipped,false,'clipped alternatives');}
async function begin(page,platform,d){await page.goto(origin+'/'+platform+'/competencia.html#duelos');await expect(page.getByRole('heading',{name:'Duelos',exact:true})).toBeVisible();await page.locator('[data-action=open-duel][data-id="'+d.id+'"]').click();await page.locator('[data-action=start-duel]').click();const rules=page.locator('[data-action=duels2-rules-accept]');if(await rules.isVisible())await rules.click();await expect(page.locator('#competitive-answer')).toBeVisible();}
async function answerPage(page,i,isCorrect){
 const a=await page.locator('#competitive-answer').getAttribute('data-attempt-id');const state=await db.rpc(i,'attempt',{attemptId:a});const key=(await db.pool.query('select answer from cachaste.questions where key=$1',[state.question.key])).rows[0].answer;
 await page.getByRole('radio').nth(isCorrect?key:(key+1)%state.question.options.length).check();await page.getByRole('button',{name:'Enviar respuesta',exact:true}).click();
 await expect.poll(async()=>{const s=await db.rpc(i,'attempt',{attemptId:a});return s.position;}).toBe(state.position+1);
 if(state.position<9)await expect(page.locator('.question-meta strong')).toContainText((state.position+2)+'/10');
}
try{
 const created=await db.rpc(0,'create_duel',{subject:'M1',nickname:'TestAlumno1',requestId:randomUUID()});await db.rpc(1,'accept',{duelId:created.id});
 const one=await context(0,390),two=await context(1,320);await Promise.all([begin(one.page,'web',created),begin(two.page,'native',created)]);await layout(one.page);await layout(two.page);
 assert.ok(await one.page.locator('.duels2-meter').count());assert.ok(await two.page.locator('.duels2-meter').count());
 await Promise.all([answerPage(one.page,0,true),answerPage(two.page,1,false)]);
 await expect.poll(()=>one.page.locator('[data-duels2-meter]').getAttribute('aria-valuenow')).toBe('2');await expect.poll(()=>two.page.locator('[data-duels2-meter]').getAttribute('aria-valuenow')).toBe('-2');
 await one.page.getByRole('radio').nth(0).check();await new Promise(r=>setTimeout(r,2200));assert.equal(await one.page.getByRole('radio').nth(0).isChecked(),true,'polling must preserve chosen alternative');
 await one.page.screenshot({path:path.join(out,'web-dominio.png'),fullPage:true});await two.page.screenshot({path:path.join(out,'android-320-dominio.png'),fullPage:true});
 for(let n=1;n<10;n++)await answerPage(one.page,0,n!==3);await expect(one.page.getByText('Ya terminaste. Esperamos a tu rival.',{exact:true})).toBeVisible();await expect(one.page.locator('[data-action=review]')).toHaveCount(0);
 await two.page.reload();await expect(two.page.locator('#competitive-answer')).toBeVisible();await expect(two.page.locator('.question-meta strong')).toContainText('2/10');
 for(let n=1;n<10;n++)await answerPage(two.page,1,n<5);
 for(const p of[one.page,two.page]){await expect(p.getByRole('heading',{name:'Resultado del duelo',exact:false})).toBeVisible({timeout:12000});await layout(p);await expect(p.locator('.duels2-result-note')).toContainText('/ 20');}
 await one.page.screenshot({path:path.join(out,'web-resultado.png'),fullPage:true});await one.page.locator('[data-action=review]').click();await expect(one.page.locator('.tutor-review-card')).toHaveCount(1);await expect(one.page.getByText('Tu alternativa:',{exact:false})).toBeVisible();await one.page.locator('[data-action=tutor][data-mode=easy]').click();await expect(one.page.locator('.tutor-review-card')).toHaveCount(1);await one.page.locator('[data-action=tutor][data-mode=example]').click();await expect(one.page.locator('.tutor-review-card')).toHaveCount(1);await layout(one.page);await one.page.screenshot({path:path.join(out,'web-repaso.png'),fullPage:true});
 await two.page.locator('[data-action=rematch]').click();await expect(two.page.locator('.waiting-state')).toBeVisible();const rematch=(await db.pool.query('select * from cachaste_duels2.matches where rematch_of=$1',[created.id])).rows[0];assert.ok(rematch);assert.equal(rematch.creator,users[1]);
 await one.ctx.close();await two.ctx.close();
 // Virtual duel from actual automatic matchmaking, including server plan and review.
 const three=await context(2,320);await three.page.goto(origin+'/web/competencia.html#duelos');await three.page.locator('[data-action=random]').click();await three.page.locator('[data-action=duels2-rules-accept]').click();await expect(three.page.getByRole('heading',{name:'Buscando otro estudiante…'})).toBeVisible();
 // Shorten only the isolated queue timestamp; the client cannot do this.
 await db.pool.query("update cachaste_duels2.queue set joined_at=clock_timestamp()-interval '11 seconds'where user_id=$1",[users[2]]);
 await expect(three.page.locator('.duels2-rival-note')).toContainText('Rival virtual',{timeout:12000});await three.page.locator('[data-action=start-duel]').click();await expect(three.page.locator('#competitive-answer')).toBeVisible();
 for(let n=0;n<10;n++)await answerPage(three.page,2,n!==1);
 const virtual=(await db.pool.query("select id from cachaste_duels2.matches where creator=$1 and opponent_kind='bot'order by created_at desc limit 1",[users[2]])).rows[0];await db.pool.query("update cachaste_duels2.bot_plan set due_at=clock_timestamp()-interval '1 second'where player_id in(select id from cachaste_duels2.players where match_id=$1)",[virtual.id]);
 await expect(three.page.getByRole('heading',{name:'Resultado del duelo',exact:false})).toBeVisible({timeout:12000});await three.page.locator('[data-action=review]').click();await expect(three.page.getByText('Tu alternativa:',{exact:false})).toBeVisible();await layout(three.page);await three.ctx.close();
 assert.deepEqual(errors,[]);console.log('PASS: web + Android WebView source, 390/320 px, two browser sessions, 30 human answers + bot plan, synchronized aggregate polling, selection retention, reconnect, result, rematch and all tutor tabs.');console.log('NOTE: hosted Supabase WebSocket transport is intentionally blocked in this isolated browser test; live Realtime delivery remains an integration check.');
 await writeFile(path.join(out,'results.json'),JSON.stringify({passed:true,errors,requests:requests.map(({payload,...r})=>({...r,payloadKeys:Object.keys(payload||{})})),transport:'isolated-postgres-and-polling',hostedRealtime:'not-run'},null,2));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));await db.close();}
