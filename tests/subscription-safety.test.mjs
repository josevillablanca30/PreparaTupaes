import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../suscripcion.html',import.meta.url),'utf8');
const home=readFileSync(new URL('../inicio.html',import.meta.url),'utf8');
const build=readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
const manifest=readFileSync(new URL('../scripts/verify-distribution.mjs',import.meta.url),'utf8');
const android=readFileSync(new URL('../android/app/src/main/java/cl/preparatupaes/app/MainActivity.java',import.meta.url),'utf8');

test('Oferta comercial: tres precios CLP y prueba gratuita sin ambigüedad',()=>{
 for(const price of ['$2.490','$7.990','$64.990'])assert.ok(html.includes(price),price);
 assert.match(html,/7 días gratis/i);
 assert.match(html,/renovación automática/i);
 assert.match(html,/fecha exacta del primer cobro/i);
 assert.match(html,/cancelar/i);
 assert.match(html,/restaurar compras/i);
});
test('Seguridad: no se habilitan compras ni se concede Premium desde la página',()=>{
 assert.equal((html.match(/<button\b/g)||[]).length,2);
 assert.equal((html.match(/<button\b[^>]*\bdisabled\b/g)||[]).length,2);
 assert.deepEqual([...html.matchAll(/<script src="([^"]+)"/g)].map(x=>x[1]),['competition-config.js','competition-client.js','competition-billing.js']);
 assert.doesNotMatch(html,/<script(?! src=)/i);
 assert.doesNotMatch(html,/localStorage|sessionStorage|purchaseToken|setPremium|grantAccess/i);
});
test('Distribución: navegación, compilación y allowlist contemplan suscripción',()=>{
 assert.match(home,/href="suscripcion\.html"/);
 assert.match(build,/dist\/suscripcion\.html/);
 assert.match(manifest,/'suscripcion\.html'/);
 assert.match(android,/path\.equals\("file:\/\/\/android_asset\/suscripcion\.html"\)/);
});
