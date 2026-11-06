import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Script} from 'node:vm';
import {adaptCompetitionUi} from '../shared/competition-ui.mjs';

const source=await readFile(new URL('../../competition-app.js',import.meta.url),'utf8');

test('la adaptación web conserva fuente Android y produce JavaScript válido',()=>{
 const original=source;
 const web=adaptCompetitionUi(source);
 assert.equal(source,original);
 assert.doesNotThrow(()=>new Script(web,{filename:'competition-web.js'}));
 assert.match(web,/Pedir revancha al mismo rival/);
 assert.match(web,/action==='rematch'/);
});

test('la revancha reutiliza invitación con nickname y exige duelo terminado',()=>{
 const web=adaptCompetitionUi(source);
 assert.match(web,/d\?\.status!=='finished'/);
 assert.match(web,/modal\('challenge',other\.nickname\)/);
 assert.ok(web.includes(`value="'+esc(nickname?prefill:'')+'"`),'el nickname debe quedar precargado');
 assert.match(web,/if\(!guard\(\)\)return/);
});

test('falla explícitamente si cambia un ancla de Android',()=>{
 assert.throws(()=>adaptCompetitionUi(source.replace('Buscar otro duelo','Buscar siguiente duelo')),/REVIEW_WEB_REMATCH_RESULT/);
});

test('la versión web conserva las reglas de protección de cuentas',()=>{
 const web=adaptCompetitionUi(source);
 assert.match(web,/await cachasteRemoveWebProfilePhoto\(api\)/);
 assert.match(web,/AUTH_REQUIRED/);
 assert.match(web,/Pedir revancha al mismo rival/);
 assert.doesNotMatch(source,/Pedir revancha al mismo rival/);
});

test('el adaptador no agrega una revancha que salte el control de suscripción',()=>{
 const web=adaptCompetitionUi(source);
 const action=web.match(/if\(action==='rematch'\)\{[\s\S]*?modal\('challenge',other\.nickname\);return;\}/)?.[0];
 assert.ok(action,'debe existir la acción web');
 assert.match(action,/if\(!guard\(\)\)return/);
 assert.match(action,/d\?\.status!=='finished'/);
 assert.match(web,/api\.call\('create_duel'/);
});

test('el historial filtra únicamente duelos terminados y muestra conteos reales',()=>{
 const web=adaptCompetitionUi(source);
 assert.doesNotThrow(()=>new Script(web,{filename:'competition-web.js'}));
 assert.match(web,/finished=list\.filter\(d=>d\.status==='finished'\)/);
 assert.match(web,/visible=state\.webDuelFilter==='finished'\?finished:list/);
 assert.match(web,/visible\.map\(duelRow\)/);
 assert.match(web,/Terminados \('/);
 assert.match(web,/if\(action==='web-duel-filter'\)/);
 assert.doesNotMatch(source,/web-duel-filters/);
});
