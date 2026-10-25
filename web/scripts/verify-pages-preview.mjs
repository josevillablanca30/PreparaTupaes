import {readFile, mkdir, writeFile, appendFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {pagesClient, previewUrl, verifyTarget, PAGES_PROJECT, PREVIEW_BRANCH} from './pages-client.mjs';

export function matchingDeployment(deployments, revision) {
  if (!/^[a-f\d]{40}$/.test(revision || '')) throw Error('DEPLOYMENT_REVISION_REQUIRED');
  const deployment = deployments.find(item => item.environment === 'preview' && item.project_name === PAGES_PROJECT &&
    item.deployment_trigger?.metadata?.branch === PREVIEW_BRANCH && item.deployment_trigger?.metadata?.commit_hash === revision &&
    item.latest_stage?.name === 'deploy' && item.latest_stage?.status === 'success' && item.is_skipped !== true);
  if (!deployment) throw Error('SUCCESSFUL_PREVIEW_FOR_THIS_COMMIT_NOT_FOUND');
  return {id: deployment.id, url: previewUrl(deployment.url), aliases: (deployment.aliases || []).map(previewUrl)};
}

export async function probePreview({url, revision, protectedFiles, encryptedFiles, fetcher = fetch}) {
  const origin = previewUrl(url), checks = [];
  async function check(name, pathname, inspect, options = {}) {
    try {
      const response = await fetcher(origin + pathname, {
        redirect: 'manual', signal: AbortSignal.timeout(20000), ...options,
      });
      const body = await response.text();
      checks.push({name, passed: Boolean(inspect(response, body))});
    } catch { checks.push({name, passed: false}); }
  }
  const parse = text => {try {return JSON.parse(text);} catch {return null;}};
  const noStore = response => /no-store/.test(response.headers.get('cache-control') || '');
  await check('Landing HTTPS y CSP del Worker', '/', (r, text) => r.status === 200 && text.includes('¿Cachaste?') && /frame-ancestors 'none'/.test(r.headers.get('content-security-policy') || ''));
  await check('Cuenta pública', '/cuenta.html', (r, text) => r.status === 200 && text.includes('cuenta'));
  await check('PWA instalable', '/manifest.webmanifest', (r, text) => r.status === 200 && parse(text)?.display === 'standalone' && parse(text)?.icons?.some(icon => icon.sizes === '512x512'));
  await check('Worker real, mismo commit y registro cerrado', '/api/config', (r, text) => {
    const config = parse(text);
    return r.status === 200 && noStore(r) && config?.revision === revision && config.signupEnabled === false && config.authReturnReady === false;
  });
  await check('Distribución web, versión y cobros cerrados', '/version.json', (r, text) => {
    const version = parse(text);
    return r.status === 200 && version?.revision === revision && version.distribution === 'web-commercial' && version.paymentsEnabledByBuild === false;
  });
  await check('Sesión anónima rechazada', '/api/session', (r, text) => r.status === 401 && noStore(r) && parse(text)?.error === 'AUTH_REQUIRED');
  const post = value => ({method: 'POST', headers: {origin, 'x-cachaste-request': '1', 'content-type': 'application/json'}, body: JSON.stringify(value)});
  await check('Progreso anónimo rechazado', '/api/progress', r => r.status === 401, post({operation: 'snapshot'}));
  await check('Checkout anónimo rechazado sin crear compra', '/api/billing', r => r.status === 401, post({action: 'checkout', plan: 'mensual'}));
  await check('Mercado Pago realmente deshabilitado', '/api/billing', (r, text) => {
    const billing = parse(text);
    return r.status === 200 && billing?.ready === false && billing.trialAvailable === false && billing.managementReady === false;
  }, post({action: 'status'}));
  await check('Escritura desde otro sitio rechazada', '/api/session', r => r.status === 403, {...post({}), headers: {origin: 'https://example.invalid', 'x-cachaste-request': '1'}});
  const forged = Buffer.from(JSON.stringify({alg: 'none'})).toString('base64url') + '.' + Buffer.from(JSON.stringify({sub: '00000000-0000-4000-8000-000000000001', exp: Math.floor(Date.now() / 1000) + 3600})).toString('base64url') + '.forged';
  await check('Token fabricado no concede Premium', '/app/daily-catalog.js', r => r.status === 401, {headers: {authorization: 'Bearer ' + forged}});
  await check('Navegación privada exige cuenta', '/app/inicio.html', r => r.status === 302 && r.headers.get('location')?.startsWith(origin + '/cuenta.html?'), {headers: {accept: 'text/html'}});
  await check('Service worker con clave pública offline', '/sw.js', (r, text) => r.status === 200 && text.includes(revision) && text.includes('"crv":"P-256"') && !/"d"\s*:/.test(text));
  await check('Código del Worker oculto', '/_worker.js', r => r.status === 404);
  // Exercise every actual bank, page and ciphertext path, not just a sample subject.
  for (let start = 0; start < protectedFiles.length; start += 4) {
    await Promise.all(protectedFiles.slice(start, start + 4).map(async pathname => {
      await check('Acceso privado denegado: ' + pathname, pathname, (r, text) => r.status === 401 && noStore(r) && parse(text)?.error === 'AUTH_REQUIRED', {headers: {accept: 'application/octet-stream'}});
      await check('Cifrado no descargable: ' + pathname, encryptedFiles[pathname], r => r.status === 404);
    }));
  }
  return {url: origin, checkedAt: new Date().toISOString(), passed: checks.every(x => x.passed), checks};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const client = pagesClient(process.env);
    verifyTarget(await client.getProject(), process.env.GITHUB_REF_NAME);
    const deployment = matchingDeployment(await client.listDeployments(), process.env.GITHUB_SHA);
    const manifest = JSON.parse(await readFile(new URL('../artifacts/build-manifest.json', import.meta.url), 'utf8'));
    if (manifest.revision !== process.env.GITHUB_SHA) throw Error('BUILD_REVISION_MISMATCH');
    // A successful API deployment can take a few seconds to reach every edge location.
    let available = false;
    for (let attempt = 0; attempt < 15; attempt++) {
      try {
        const response = await fetch(deployment.url + '/api/config', {redirect: 'manual', signal: AbortSignal.timeout(5000)});
        if (response.ok && (await response.json()).revision === process.env.GITHUB_SHA) {available = true; break;}
      } catch {}
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    if (!available) throw Error('PREVIEW_NOT_YET_AVAILABLE');
    const evidence = await probePreview({url: deployment.url, revision: process.env.GITHUB_SHA, protectedFiles: manifest.protectedFiles, encryptedFiles: manifest.encryptedFiles});
    const report = {project: PAGES_PROJECT, environment: 'preview', revision: process.env.GITHUB_SHA,
      fullQa: process.env.VERIFIED_QA_URL, deployment, ...evidence,
      limits: ['Sin prueba de cobro real ni de teléfonos físicos.', 'No concede acceso Premium artificial al backend compartido.']};
    const dir = new URL('../artifacts/', import.meta.url);
    await mkdir(dir, {recursive: true});
    await writeFile(new URL('pages-preview.json', dir), JSON.stringify(report, null, 2) + '\n');
    if (process.env.GITHUB_STEP_SUMMARY) {
      await appendFile(process.env.GITHUB_STEP_SUMMARY, '## ¿Cachaste? · vista de prueba\n\n' +
        '[Abrir preview](' + deployment.url + ')\n\nCommit: `' + process.env.GITHUB_SHA + '`\n\n' +
        checksSummary(evidence) + '\n\nDetalle: artefacto `Cachaste-Pages-Preview`.\n');
    }
    console.log(JSON.stringify({url: deployment.url, passed: evidence.passed, checks: evidence.checks.length}));
    if (!evidence.passed) process.exitCode = 1;
  } catch { console.error('Live preview verification failed. No verified test URL can be declared.'); process.exitCode = 1; }
}

function checksSummary(evidence) {
  return evidence.checks.filter(x => x.passed).length + '/' + evidence.checks.length + ' verificaciones HTTP correctas.';
}
