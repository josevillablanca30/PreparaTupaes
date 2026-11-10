import test from'node:test';import assert from'node:assert/strict';import{execFileSync}from'node:child_process';import{readFileSync}from'node:fs';import vm from'node:vm';import{adaptDuels2Ui}from'../duels2/ui-transform.mjs';import{adaptCompetitionUi}from'../web/shared/competition-ui.mjs';
for(const ref of ['685e9ecc3d55d353c8c9fdf3e29f9549eaa5fac9','e3a0434d70042afc40dccdbf6d57307a16c2e16e'])test('Duelos 2 transformer keeps photos, tutor, native access and valid JS on '+ref,()=>{
 const input=execFileSync('git',['show',ref+':competition-app.js'],{encoding:'utf8'}),out=ref.startsWith('685')?adaptCompetitionUi(input):adaptDuels2Ui(input);new vm.Script(out);
 const avatar=input.slice(input.indexOf(' const avatar='),input.indexOf(' const avatar=')+input.slice(input.indexOf(' const avatar=')).indexOf('\n'));assert.ok(out.includes(avatar));
 for(const text of ['CACHASTE_DUELS2_RUNTIME','Tu alternativa:','Respuesta:','Paso a paso','Más fácil','Otro ejemplo',"api.call('review'",'cachasteNativeBack','cachaste_duels2_live','prefers-reduced-motion'])assert.ok(out.includes(text),text);
 assert.ok(!out.includes('90 segundos por pregunta · gana quien tenga más aciertos.'));assert.equal(adaptDuels2Ui(out),out);
});
test('Realtime publishes no player progress and UI refetches authoritative aggregates',()=>{
 const sql=readFileSync(new URL('../web/supabase/migrations/20261110130920_cachaste_duels2_isolated.sql',import.meta.url),'utf8'),runtime=readFileSync(new URL('../duels2/ui-runtime.js',import.meta.url),'utf8');
 assert.ok(!sql.includes('alter function cachaste.dispatch'));assert.ok(!sql.includes('create or replace function cachaste.premium'));assert.ok(runtime.includes('ignore stale/reordered event payloads'));assert.ok(runtime.includes("table:'cachaste_duels2_live'"));
});
