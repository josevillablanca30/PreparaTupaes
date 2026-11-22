import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('Free selector preserves all paid plans and opens the existing educational route',async()=>{
 const source=await readFile(new URL('../client/account.mjs',import.meta.url),'utf8');
 assert.match(source,/<h3>Plan Básico<\/h3><p class="price">Gratis<\/p>/);
 assert.match(source,/data-action="basic">Empezar gratis/);
 assert.match(source,/price-grid">'\+basic\+cards/);
 assert.match(source,/location.assign\('\/app\/inicio.html'\)/);
 const {PLANS}=await import('../shared/config.mjs');
 assert.deepEqual(Object.fromEntries(Object.entries(PLANS).map(([k,v])=>[k,v.amount])),{mensual:7990,semanal:2490,anual:64990});
});
