import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../public/index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../public/web.css',import.meta.url),'utf8');
test('landing shows useful PAES preparation and clearly labels restricted testing',()=>{
 assert.match(html,/id="preparacion-paes"/);
 assert.match(html,/La PAES se acerca/);
 assert.match(html,/acceso completo todavía está limitado/);
 assert.match(html,/Los cobros no están activos/);
 assert.match(html,/Ya tengo acceso de prueba/);
 assert.match(html,/href="#asignaturas"/);
 assert.match(html,/href="#preparacion-paes"/);
 assert.doesNotMatch(html,/href="\/cuenta.html">Comenzar mi preparación/);
 assert.match(css,/@media\(max-width:760px\)/);
 assert.match(css,/\.paes-moment-steps/);
});
test('prelaunch pricing FAQ never promises active Mercado Pago billing',()=>{
 assert.match(html,/Los cobros web todavía no están habilitados/);
 assert.doesNotMatch(html,/suscripción web confirmada por Mercado Pago/);
 assert.match(html,/Preparación independiente de DEMRE/);
});
