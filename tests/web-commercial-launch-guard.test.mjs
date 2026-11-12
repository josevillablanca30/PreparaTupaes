import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const css=readFileSync(new URL('../web/public/web.css',import.meta.url),'utf8');
const landing=readFileSync(new URL('../web/public/index.html',import.meta.url),'utf8');
const account=readFileSync(new URL('../web/public/cuenta.html',import.meta.url),'utf8');
test('commercial landing retains mobile-safe heading and approved artwork',()=>{
 assert.match(css,/\.hero-copy h1\{font-size:clamp\(32px,8\.8vw,54px\)/);
 assert.match(css,/\.landing-hero\{grid-template-columns:minmax\(0,1fr\)\}/);
 assert.match(css,/\.hero-art>img\{aspect-ratio:408\/278/);
 assert.match(landing,/<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">/);
});
test('commercial review must not accidentally enable public checkout or indexing',()=>{
 assert.match(landing,/name="robots" content="noindex,nofollow"/);
 assert.match(landing,/La contratación todavía no está habilitada/);
 assert.match(landing,/Los cobros todavía no están habilitados/);
 assert.match(account,/name="robots" content="noindex,nofollow"/);
});
test('landing exposes account, plan prices and essential disclosures',()=>{
 assert.match(landing,/href="\/cuenta\.html"/);
 for(const price of ['$2.490','$7.990','$64.990'])assert.ok(landing.includes(price),price);
 assert.match(landing,/id="preguntas"/);
 assert.match(landing,/¿Puedo cancelar mi suscripción\?/);
});
