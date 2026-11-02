import {readable} from './helpers/readable-surface.mjs';
import {test,expect} from '@playwright/test';
import {fixturePage,actor,duel,finished} from './helpers/competition-fixtures.mjs';

async function layout(page){expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);}
async function settled(page,{subject='M1',track=''}={}){
 await fixturePage(page);await page.addInitScript(({owner,id})=>localStorage.setItem('cachaste-competition-v1:'+owner+':duel',id),{owner:actor.id,id:duel().id});
 await page.route('**/rest/v1/rpc/cachaste_competition',async route=>{if(route.request().postDataJSON().operation==='duel')await route.fulfill({json:{...finished(),subject,track}});else await route.fallback();});
 await page.goto('./competencia.html#resultado');await expect(page.getByRole('button',{name:'Pedir revancha',exact:true})).toBeVisible();
}

test('The first screen gives learning and competition real independent routes with an undistorted official logo',async({page},info)=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./inicio.html#courses');
 await expect(page.locator('.entry-paths')).toHaveCount(1);await expect(page.locator('[data-action=pick-course]')).toHaveCount(5);
 const brand=page.locator('.reference-brand img');await expect(brand).toHaveAttribute('src','assets/competition-logo.svg');
 await expect.poll(()=>brand.evaluate(n=>n.complete&&n.naturalWidth>0)).toBe(true);const b=await brand.boundingBox();expect(b.height).toBeLessThanOrEqual(49);expect(Math.abs(b.width/b.height-355/97)).toBeLessThan(.03);
 await expect(page.locator('.mentor-principle')).toContainText('Primero cachémoslo fácil');
 const duelLink=page.getByRole('link',{name:'Jugar un duelo',exact:true});const duelBox=await duelLink.boundingBox(),subjectsBox=await page.locator('.training-subjects').boundingBox();expect(duelBox.y).toBeLessThan(subjectsBox.y);
 await expect(page.getByRole('link',{name:/Ver rankings/})).toHaveAttribute('href','competencia.html#rankings');
 const nav=await page.locator('.competition-entry-nav').boundingBox();for(const action of [page.locator('.learning-entry .primary'),duelLink]){const box=await action.boundingBox();expect(box.y+box.height).toBeLessThanOrEqual(nav.y+1);}await layout(page);await page.screenshot({path:info.outputPath('rc10-home-viewport.png'),animations:'disabled'});await page.screenshot({path:info.outputPath('rc10-home-full.png'),fullPage:true,animations:'disabled'});
 await page.getByRole('button',{name:'Elegir asignatura',exact:true}).click();await expect(page.getByRole('heading',{name:'Elige tu asignatura',exact:true})).toBeFocused();
 await page.locator('[data-action=pick-course][data-subject=M1]').click();await expect(page.locator('.mode-choices button')).toHaveCount(4);await page.locator('[data-action=game-mode]').click();await expect(page.locator('.trail-stop.current')).toHaveCount(1);await layout(page);
});

test('The home competition action reaches real invitation controls and returns to all learning subjects',async({page},info)=>{
 await fixturePage(page);await page.goto('./inicio.html#courses');await page.getByRole('link',{name:'Jugar un duelo',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Duelos',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Desafiar',exact:true})).toBeVisible();await expect(page.locator('.competition-format')).toContainText('90 segundos');
 await expect(page.locator('.action-tile')).toHaveCount(3);await expect(page.locator('.next-duel')).toContainText('desafío pendiente');
 await layout(page);await page.screenshot({path:info.outputPath('rc10-duels.png'),fullPage:true,animations:'disabled'});
 await page.getByRole('link',{name:'Inicio',exact:true}).click();await expect(page.locator('[data-action=pick-course]')).toHaveCount(5);
});

test('Changing presentation preserves an unfinished educational session and its progress across reload',async({page})=>{
 await fixturePage(page);await page.goto('./inicio.html#courses');const before=await page.evaluate(()=>{const e=CachasteDailyApp.engine;e.start('M1',3,'free');e.save();location.hash='#courses';CachasteDailyApp.render();return{session:JSON.stringify(e.state.session),xp:e.stats().xp,attempts:e.state.attempts.length};});
 await page.reload();await expect(page.locator('.learning-entry [data-action=resume]')).toBeVisible();
 await page.getByRole('link',{name:'Ver rankings',exact:false}).click();await page.getByRole('link',{name:'Inicio',exact:true}).click();await expect(page.locator('.learning-entry [data-action=resume]')).toBeVisible();
 expect(await page.evaluate(()=>{const e=CachasteDailyApp.engine;return{session:JSON.stringify(e.state.session),xp:e.stats().xp,attempts:e.state.attempts.length};})).toEqual(before);
 await page.locator('.learning-entry [data-action=resume]').click();expect(await page.evaluate(()=>JSON.stringify(CachasteDailyApp.engine.state.session))).toBe(before.session);
});

test('A rematch keeps the actual rival and science track, waits for confirmation and retries without duplicate identities',async({page},info)=>{
 await settled(page,{subject:'Ciencias',track:'Física'});let calls=0;const payloads=[],newDuel={...duel(),id:'30000000-0000-4000-8000-000000000010',subject:'Ciencias',track:'Física'};
 await page.route('**/rest/v1/rpc/cachaste_competition',async route=>{const b=route.request().postDataJSON();if(b.operation==='create_duel'){calls++;payloads.push(b.payload);if(calls===1){await route.fulfill({status:400,json:{message:'RIVAL_UNAVAILABLE',code:'P0001'}});return;}await route.fulfill({json:newDuel});return;}if(b.operation==='duel'&&b.payload.duelId===newDuel.id){await route.fulfill({json:newDuel});return;}await route.fallback();});
 await page.getByRole('button',{name:'Pedir revancha',exact:true}).click();await expect(page.getByRole('textbox',{name:'Nickname',exact:true})).toHaveValue('CataPAES');expect(calls).toBe(0);
 await expect(page.locator('dialog')).toContainText('Ciencias');await page.screenshot({path:info.outputPath('rc10-rematch.png'),animations:'disabled'});
 await page.getByRole('button',{name:'Enviar desafío',exact:true}).click();await expect(page.locator('dialog [role=alert]')).toBeVisible();await expect(page.getByRole('textbox',{name:'Nickname',exact:true})).toHaveValue('CataPAES');
 await page.getByRole('button',{name:'Enviar desafío',exact:true}).click();await expect(page.getByRole('heading',{name:'Duelo PAES',exact:true})).toBeVisible();
 await expect(page).toHaveURL(/#duelo$/);expect(payloads).toHaveLength(2);for(const p of payloads)expect(p).toMatchObject({subject:'Ciencias',track:'Física',nickname:'CataPAES'});expect(payloads[0].requestId).toBe(payloads[1].requestId);
});

test('A settled result keeps review available and opens the duel league in the result subject',async({page},info)=>{
 await settled(page,{subject:'M2'});await expect(page.getByRole('link',{name:'Revisar errores del duelo',exact:true})).toBeVisible();
 await page.screenshot({path:info.outputPath('rc10-result.png'),fullPage:true,animations:'disabled'});await page.getByRole('button',{name:'Ver mi liga de duelos',exact:true}).click();
 await expect(page.getByRole('button',{name:'Liga de duelos',exact:true})).toHaveAttribute('aria-pressed','true');await expect(page.getByRole('button',{name:'M2',exact:true})).toHaveAttribute('aria-pressed','true');await layout(page);
 await expect(page.getByRole('region',{name:'Tu posición en la liga'})).toBeVisible();await expect(page.locator('.personal-standing')).toContainText('#12');await page.screenshot({path:info.outputPath('rc10-ranking.png'),fullPage:true,animations:'disabled'});
});

test('Duel history pages retain real scores, deduplicate retries and open the recorded result',async({page},info)=>{
 await fixturePage(page);const a={...finished(),createdAt:'2026-11-02T10:00:00Z'},b={...finished('loss'),id:'30000000-0000-4000-8000-000000000099',createdAt:'2026-11-01T10:00:00Z'};let reads=0;
 await page.route('**/rest/v1/rpc/cachaste_competition',async route=>{const {operation,payload}=route.request().postDataJSON();if(operation==='duel_history'){reads++;await route.fulfill({json:{duels:payload.before?[a,b]:[a],next:payload.before?null:{createdAt:a.createdAt,id:a.id},summary:{played:2,wins:1,losses:1,draws:0}}});return;}if(operation==='duel'){await route.fulfill({json:payload.duelId===b.id?b:a});return;}await route.fallback();});
 await page.goto('./competencia.html#duelos');await page.getByRole('link',{name:'Ver historial de duelos'}).click();
 await expect(page.locator('.duel-history')).toContainText('2 jugados');await expect(page.locator('.duel-history .duel-row')).toHaveCount(1);
 await expect(page.locator('.duel-history')).toContainText('Victoria');await page.getByRole('button',{name:'Ver encuentros anteriores'}).click();
 await expect(page.locator('.duel-history .duel-row')).toHaveCount(2);await expect(page.locator('.duel-history')).toContainText('Derrota');await expect(page.getByRole('button',{name:'Ver encuentros anteriores'})).toHaveCount(0);
 await layout(page);await page.screenshot({path:info.outputPath('rematches-history.png'),fullPage:true,animations:'disabled'});
 await page.locator('.duel-history [data-action=open-duel]').last().click();await expect(page.getByRole('button',{name:'Pedir revancha',exact:true})).toBeVisible();expect(reads).toBe(2);
});

test('The signed-in session can be closed before testing registration without clearing educational progress',async({page})=>{
 await fixturePage(page);await page.addInitScript(()=>localStorage.setItem('keep-learning-test','retained'));
 await page.goto('./competencia.html#perfil');await expect(page.locator('.session-panel')).toContainText('Actualizar la app conserva tu sesión');
 await page.getByRole('button',{name:'Cerrar sesión',exact:true}).click();await expect(page.locator('#auth-form')).toBeVisible();
 await expect(page.locator('.profile-panel')).toHaveCount(0);expect(await page.evaluate(()=>localStorage.getItem('keep-learning-test'))).toBe('retained');
 await page.getByRole('button',{name:'Crear cuenta',exact:true}).click();await expect(page.locator('#signup-form')).toBeVisible();
});

test('An optional profile photo is compressed, previewed, consented and uploaded independently from profile edits',async({page},info)=>{
 await fixturePage(page);let photoVersion=null,uploads=0;const raw=Buffer.from('UklGRkgAAABXRUJQVlA4IDwAAAAwAwCdASogACAAPm00lkekIyIhKAgAgA2JZQDJAoAAQFBQAP7wm0P/z0z+tv4/7Pv4oBSOJQzRGqAAAAA=','base64');
 await page.route('**/storage/v1/object/**',async route=>{
  if(route.request().method()==='POST'){uploads++;expect(route.request().postDataBuffer().length).toBeLessThan(35000);photoVersion='2026-11-02T10:00:00Z';await route.fulfill({json:{Key:actor.id+'/avatar.webp',Id:'photo-test'}});}
  else if(route.request().method()==='DELETE'){photoVersion=null;await route.fulfill({json:[]});}
  else await route.fulfill({contentType:'image/webp',body:raw});
 });
 await page.route('**/rest/v1/rpc/cachaste_competition',async route=>{const {operation}=route.request().postDataJSON();if(operation==='photo_status'){await route.fulfill({json:{canUpload:uploads===0,photoVersion,nextChangeAt:'2026-11-09T10:00:00Z'}});return;}if(operation==='profile'){const {profile}=await import('./helpers/competition-fixtures.mjs');await route.fulfill({json:{profile:{...profile,photoVersion},premium:true,season:'2026-10-19'}});return;}await route.fallback();});
 await page.goto('./competencia.html#perfil');await page.locator('[name=nickname]').fill('PhotoDraft');await page.getByRole('button',{name:'Subir mi foto',exact:true}).click();
 const input=page.locator('#photo-form input[type=file]');await input.setInputFiles({name:'bad.pdf',mimeType:'application/pdf',buffer:Buffer.from('invalid')});await expect(page.locator('[data-photo-note]')).toContainText('Elige una foto');await expect(page.locator('#photo-form [type=submit]')).toBeDisabled();
 await input.setInputFiles({name:'too-large.webp',mimeType:'image/webp',buffer:Buffer.concat([raw,Buffer.alloc(5*1024*1024+1-raw.length)])});await expect(page.locator('[data-photo-note]')).toContainText('hasta 5 MB');await expect(page.locator('#photo-form [type=submit]')).toBeDisabled();expect(uploads).toBe(0);
 await input.setInputFiles({name:'personal.webp',mimeType:'image/webp',buffer:Buffer.concat([raw,Buffer.alloc(5*1024*1024-raw.length)])});await expect(page.locator('.photo-preview')).toBeVisible();
 const size=await page.locator('.photo-preview').evaluate(async img=>{const blob=await window.CachasteCompetitionClient.prepareProfilePhoto(img.closest('form').querySelector('[type=file]').files[0]);return{width:img.naturalWidth,height:img.naturalHeight,bytes:blob.size,type:blob.type};});expect(size.width).toBe(256);expect(size.height).toBe(256);expect(size.bytes).toBeLessThanOrEqual(32768);expect(size.type).toBe('image/webp');
 await page.locator('#photo-form [type=submit]').click();expect(uploads).toBe(0);await page.locator('[name=photoConsent]').check();await page.locator('#photo-form [type=submit]').click();
 await expect(page.locator('dialog')).not.toBeVisible();await expect(page.locator('.profile-photo-panel img.profile-photo')).toBeVisible();await expect(page.locator('[name=nickname]')).toHaveValue('PhotoDraft');expect(uploads).toBe(1);await readable(page.locator('.toast'));await readable(page.locator('.community-rules summary'));await layout(page);await page.screenshot({path:info.outputPath('profile-photo.png'),fullPage:true,animations:'disabled'});
 await page.getByRole('button',{name:'Cambiar mi foto',exact:true}).click();await expect(page.locator('.toast')).toContainText('Podrás subir otra foto');expect(uploads).toBe(1);
 await page.getByRole('button',{name:'Quitar foto y usar mi gatito'}).click();await expect(page.getByRole('button',{name:'Subir mi foto',exact:true})).toBeVisible();await expect(page.locator('.profile-photo-panel img.profile-photo')).toHaveCount(0);
});
