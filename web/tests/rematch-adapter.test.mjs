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
 assert.match(web,/value=\\"'\+esc\(nickname\?prefill:''\)/);
 assert.match(web,/if\(!guard\(\)\)return/);
});

test('falla explícitamente si cambia un ancla de Android',()=>{
 assert.throws(()=>adaptCompetitionUi(source.replace('Buscar otro duelo','Buscar siguiente duelo')),/REVIEW_WEB_REMATCH_RESULT/);
});
