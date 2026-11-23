import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';

const version = JSON.parse(await readFile('web/dist/version.json', 'utf8'));
const manifest = JSON.parse(await readFile('web/artifacts/build-manifest.json', 'utf8'));
assert.equal(version.revision, process.env.GITHUB_SHA);
assert.equal(version.distribution, 'web-commercial');
assert.equal(version.paymentsEnabledByBuild, false);
assert.equal(manifest.revision, version.revision);

for (const file of ['index.html','web.css','assets/landing-cat-rank-cutout.png']) {
  const bytes = await readFile('web/dist/' + file);
  if (file === 'index.html') {
    const html = bytes.toString();
    assert.match(html, /name="robots" content="noindex,nofollow"/);
    assert.match(html, /La contratación todavía no está habilitada/);
    assert.match(html, /src="\/assets\/landing-cat-rank-cutout\.png"/);
    for (const legal of ['privacidad','condiciones','eliminar-cuenta']) {
      assert.ok(html.includes('href="/' + legal + '.html"'), legal);
    }
  } else {
    assert.deepEqual(bytes, await readFile('web/public/' + file), file);
  }
  console.log(file, createHash('sha256').update(bytes).digest('hex'));
}

for (const [file, title] of [
  ['privacidad', 'Política de privacidad'],
  ['condiciones', 'Condiciones de uso'],
  ['eliminar-cuenta', 'Eliminar cuenta y datos'],
]) {
  const html = await readFile('web/dist/' + file + '.html', 'utf8');
  assert.ok(html.includes('<h1>' + title + '</h1>'), file);
}
assert.match(await readFile('web/dist/robots.txt', 'utf8'), /^Disallow: \/$/m);

const {fetch: worker} = (await import('../dist/_worker.js')).default;
const origin = 'https://sitecacho.cl';
const assets = {fetch: async () => { throw Error('Protected routes may not fetch assets without entitlement'); }};
const bindings = {ASSETS: assets, WEB_SIGNUP_ENABLED: 'true', WEB_PAYMENTS_ENABLED: 'false'};
const config = await worker(new Request(origin + '/api/config'), bindings);
assert.equal((await config.json()).revision, version.revision);
assert.equal((await worker(new Request(origin + '/app/inicio.html'), bindings)).status, 401);
assert.equal((await worker(new Request(origin + '/api/billing', {
  method: 'POST', headers: {origin, 'x-cachaste-request': '1'}, body: '{"action":"checkout","plan":"semanal"}',
}), bindings)).status, 401);
console.log('Distribución integrada: revisión, arte aprobado, legales, noindex y acceso cerrado verificados.');
