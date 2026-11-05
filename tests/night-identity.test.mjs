import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {competitionRows} from '../scripts/competition-catalog.mjs';
test('La unificación estética conserva las 802 evaluaciones publicadas',()=>{
 const rows=competitionRows();assert.equal(rows.length,802);
 const digest=createHash('md5').update(rows.sort((a,b)=>a.key<b.key?-1:a.key>b.key?1:0).map(q=>q.key+':'+q.hash).join(',')).digest('hex');
 assert.equal(digest,'71c682244491099641acb8fdba4b2b06','No cambiar enunciados, alternativas, respuestas o figuras de evaluación durante un cambio estético');
});
