import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, readFile, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {randomBytes, createCipheriv, createHash} from 'node:crypto';
import {pagesClient, credentials, previewUrl, PAGES_PROJECT, PAGES_ACCOUNT_ID, PREVIEW_BRANCH, RESERVED_PRODUCTION_BRANCH, REPOSITORY} from '../scripts/pages-client.mjs';
import {prepareProject, runtimeSecrets} from '../scripts/prepare-pages-project.mjs';
import {verifyProject} from '../scripts/verify-pages-project.mjs';
import {matchingQaRun, requireQa} from '../scripts/verify-preview-qa.mjs';
import {matchingDeployment, probePreview} from '../scripts/verify-pages-preview.mjs';
import {createGateway} from '../server/gateway.mjs';
import {verifyPrivateDistribution} from '../scripts/verify-private-distribution.mjs';

const revision = 'a'.repeat(40);
const env = () => ({GITHUB_REF_NAME: PREVIEW_BRANCH, CLOUDFLARE_ACCOUNT_ID: PAGES_ACCOUNT_ID, CLOUDFLARE_API_TOKEN: 'fixture-no-real-token-1234567890'});
const initialProject = () => ({name: PAGES_PROJECT, production_branch: RESERVED_PRODUCTION_BRANCH, source: null, canonical_deployment: null, domains: []});
function cloudflare(initial = null) {
  let project = initial;
  const calls = [], base = 'https://api.cloudflare.com/client/v4/accounts/' + PAGES_ACCOUNT_ID + '/pages/projects';
  const client = pagesClient(env(), {fetcher: async (url, options) => {
    assert.equal(options.redirect, 'error');
    assert.equal(options.headers.authorization, 'Bearer ' + env().CLOUDFLARE_API_TOKEN);
    const body = options.body ? JSON.parse(options.body) : null;
    calls.push({url, method: options.method, body});
    if (options.method === 'GET') {
      assert.equal(url, base + '/' + PAGES_PROJECT);
      if (!project) return Response.json({success: false}, {status: 404});
      const masked = structuredClone(project);
      for (const config of Object.values(masked.deployment_configs || {})) for (const item of Object.values(config.env_vars || {})) if (item.type === 'secret_text') item.value = '[encrypted]';
      return Response.json({success: true, result: masked});
    }
    if (options.method === 'POST') {
      assert.equal(url, base); assert.equal(body.name, PAGES_PROJECT);
      assert.equal(body.production_branch, RESERVED_PRODUCTION_BRANCH);
      project = {...initialProject(), ...body};
    } else {
      assert.equal(options.method, 'PATCH'); assert.equal(url, base + '/' + PAGES_PROJECT);
      assert.deepEqual(Object.keys(body), ['deployment_configs']);
      project.deployment_configs = body.deployment_configs;
    }
    return Response.json({success: true, result: project});
  }});
  return {client, calls, project: () => project};
}

test('bootstrap creates only the named Direct Upload project with encrypted preview keys and no production key', async () => {
  const api = cloudflare(), result = await prepareProject(env(), {client: api.client});
  assert.equal(result.created, true);
  assert.deepEqual(api.calls.map(x => x.method), ['GET', 'POST', 'GET']);
  const configs = api.project().deployment_configs;
  assert.equal(configs.preview.fail_open, false); assert.equal(configs.production.fail_open, false);
  assert.equal(configs.preview.env_vars.BANK_CONTENT_KEY.type, 'secret_text');
  assert.equal(configs.preview.env_vars.BANK_CONTENT_KEY.value, result.secrets.BANK_CONTENT_KEY);
  assert.equal(Buffer.from(result.secrets.BANK_CONTENT_KEY, 'base64').length, 32);
  const jwk = JSON.parse(result.secrets.OFFLINE_SIGNING_JWK);
  const key = await crypto.subtle.importKey('jwk', jwk, {name: 'ECDSA', namedCurve: 'P-256'}, false, ['sign']);
  assert.equal(key.type, 'private'); assert.equal(jwk.crv, 'P-256');
  assert.equal(configs.production.env_vars.BANK_CONTENT_KEY, undefined);
  assert.equal(configs.production.env_vars.OFFLINE_SIGNING_JWK, undefined);
  for (const config of Object.values(configs)) {
    assert.equal(config.env_vars.WEB_SIGNUP_ENABLED.value, 'false');
    assert.equal(config.env_vars.WEB_AUTH_RETURN_READY.value, 'false');
    assert.deepEqual(Object.keys(config).sort(), ['compatibility_date', 'env_vars', 'fail_open']);
  }
  assert.equal(result.verified.environment, 'preview');
});

test('rerunning rotates preview encryption and signing together without recreating or publishing the project', async () => {
  const api = cloudflare();
  const first = await prepareProject(env(), {client: api.client});
  const second = await prepareProject(env(), {client: api.client});
  assert.equal(second.created, false);
  assert.notEqual(first.secrets.BANK_CONTENT_KEY, second.secrets.BANK_CONTENT_KEY);
  assert.notEqual(first.secrets.OFFLINE_SIGNING_JWK, second.secrets.OFFLINE_SIGNING_JWK);
  assert.deepEqual(api.calls.map(x => x.method), ['GET', 'POST', 'GET', 'GET', 'PATCH', 'GET']);
  assert(api.calls.every(x => !/zones|billing|subscriptions|lovable|somosvillablanca/.test(x.url)));
});

test('an unrelated project, existing production, Git integration or unrelated domain stops bootstrap before any write', async () => {
  const variants = [
    {name: 'somosvillablanca'}, {production_branch: PREVIEW_BRANCH}, {production_branch: 'main'},
    {canonical_deployment: {id: 'already-live'}}, {source: {type: 'github'}}, {domains: ['somosvillablanca.cl']},
  ];
  for (const variant of variants) {
    const api = cloudflare({...initialProject(), ...variant}); let generated = false;
    await assert.rejects(prepareProject(env(), {client: api.client, generate: () => {generated = true; return runtimeSecrets();}}));
    assert.deepEqual(api.calls.map(x => x.method), ['GET']); assert.equal(generated, false);
  }
});

test('missing token or a different account, project or branch cause zero Cloudflare calls and do not accept a global API key', () => {
  for (const change of [{CLOUDFLARE_ACCOUNT_ID: ''}, {CLOUDFLARE_ACCOUNT_ID: 'f'.repeat(32)}, {CLOUDFLARE_API_TOKEN: ''}, {GITHUB_REF_NAME: 'main'}, {CLOUDFLARE_PAGES_PROJECT: 'somosvillablanca'}]) {
    let called = false;
    assert.throws(() => pagesClient({...env(), ...change}, {fetcher: () => {called = true;}}));
    assert.equal(called, false);
  }
  assert.throws(() => credentials({...env(), CLOUDFLARE_API_TOKEN: undefined, CLOUDFLARE_API_KEY: 'old-global-key'}), /TOKEN_REQUIRED/);
});

test('Cloudflare error bodies and secret bindings cannot leak through exception messages', async () => {
  const sensitive = 'private-provider-body-must-stay-private';
  const client = pagesClient(env(), {fetcher: async () => Response.json({success: false, errors: [{message: sensitive}]}, {status: 403})});
  await assert.rejects(client.getProject(), error => error.message === 'CLOUDFLARE_API_REJECTED_HTTP_403' && !String(error.stack).includes(sensitive));
});

test('read-only guard rejects plaintext keys, missing gates, fail open or missing content encryption', async () => {
  const api = cloudflare(); const prepared = await prepareProject(env(), {client: api.client});
  for (const mutate of [
    p => {p.deployment_configs.preview.env_vars.BANK_CONTENT_KEY.type = 'plain_text';},
    p => {delete p.deployment_configs.preview.env_vars.WEB_AUTH_RETURN_READY;},
    p => {p.deployment_configs.production.fail_open = true;},
  ]) {
    const project = structuredClone(api.project()); mutate(project);
    assert.throws(() => verifyProject(project, {branch: PREVIEW_BRANCH, contentKey: prepared.secrets.BANK_CONTENT_KEY}));
  }
  assert.throws(() => verifyProject(api.project(), {branch: PREVIEW_BRANCH, contentKey: ''}), /BANK_CONTENT_KEY_REQUIRED/);
});

const qaRun = overrides => ({id: 123, run_number: 20, run_attempt: 1, event: 'push', path: '.github/workflows/web-commercial.yml', head_sha: revision, head_branch: PREVIEW_BRANCH, status: 'completed', conclusion: 'success', ...overrides});
const qaEnv = () => ({GITHUB_REPOSITORY: REPOSITORY, GITHUB_REF_NAME: PREVIEW_BRANCH, GITHUB_SHA: revision, GH_TOKEN: 'fixture-read-only'});
test('QA gate requires the latest matching full workflow on this branch and SHA, not another green check', async () => {
  const unrelated = [qaRun({id: 999, head_branch: 'main'}), qaRun({id: 998, head_sha: 'b'.repeat(40)}), qaRun({id: 997, path: '.github/workflows/web-pages-preview.yml'}), qaRun({id: 996, event: 'pull_request'})];
  assert.equal(matchingQaRun(unrelated, revision), undefined);
  assert.equal(matchingQaRun([...unrelated, qaRun()], revision).id, 123);
  const result = await requireQa(qaEnv(), {fetcher: async url => {
    assert(url.includes('head_sha=' + revision)); return Response.json({workflow_runs: [...unrelated, qaRun()]});
  }});
  assert.equal(result, 'https://github.com/' + REPOSITORY + '/actions/runs/123');
  await assert.rejects(requireQa(qaEnv(), {fetcher: async () => Response.json({workflow_runs: [qaRun(), qaRun({run_number: 21, id: 124, conclusion: 'failure'})]})}), /DID_NOT_PASS/);
});

test('absent or unfinished QA times out without silently allowing a deployment', async () => {
  let clock = 0;
  await assert.rejects(requireQa(qaEnv(), {fetcher: async () => Response.json({workflow_runs: [qaRun({status: 'in_progress', conclusion: null})]}), now: () => clock, wait: async () => {clock += 6000;}, timeoutMs: 5000}), /TIMEOUT/);
  await assert.rejects(requireQa({...qaEnv(), GITHUB_REF_NAME: 'main'}), /CONTEXT_INVALID/);
});

const deployment = overrides => ({id: 'fixture-deployment', project_name: PAGES_PROJECT, environment: 'preview', url: 'https://123abcd.cachaste-sitecacho.pages.dev', aliases: ['https://work-cachaste-web.cachaste-sitecacho.pages.dev'], latest_stage: {name: 'deploy', status: 'success'}, deployment_trigger: {metadata: {branch: PREVIEW_BRANCH, commit_hash: revision}}, ...overrides});
test('live evidence can target only a successful preview of this SHA returned by the official Pages API', () => {
  assert.equal(matchingDeployment([deployment()], revision).url, 'https://123abcd.cachaste-sitecacho.pages.dev');
  for (const change of [{environment: 'production'}, {project_name: 'somosvillablanca'}, {latest_stage: {name: 'deploy', status: 'failure'}}, {deployment_trigger: {metadata: {branch: 'main', commit_hash: revision}}}]) assert.throws(() => matchingDeployment([deployment(change)], revision));
  for (const url of ['https://somosvillablanca.cl', 'https://cachaste-sitecacho.pages.dev', 'http://abc.cachaste-sitecacho.pages.dev', 'https://abc.cachaste-sitecacho.pages.dev.evil.invalid', 'https://user:password@abc.cachaste-sitecacho.pages.dev', 'https://abc.cachaste-sitecacho.pages.dev/other']) assert.throws(() => previewUrl(url));
});

async function liveFixture() {
  const keys = runtimeSecrets(), protectedFiles = ['/app/daily-catalog.js', '/app/inicio.html'];
  const encryptedFiles = Object.fromEntries(protectedFiles.map((name, i) => [name, '/__encrypted/' + String(i).repeat(64) + '.bin']));
  const gateway = createGateway({revision, protectedFiles, encryptedFiles, fetcher: async url => {
    if (url.endsWith('/auth/v1/user')) return Response.json({error: 'AUTH_REQUIRED'}, {status: 401});
    if (url.endsWith('/cachaste-mercadopago')) return Response.json({ready: false, trialAvailable: false, managementReady: false});
    throw Error('UNEXPECTED_BACKEND_CALL');
  }});
  const assets = new Map([
    ['/', '<title>¿Cachaste?</title>'], ['/cuenta.html', '<h1>Mi cuenta</h1>'],
    ['/manifest.webmanifest', JSON.stringify({display: 'standalone', icons: [{sizes: '512x512'}]})],
    ['/version.json', JSON.stringify({revision, distribution: 'web-commercial', paymentsEnabledByBuild: false})],
    ['/sw-template.js', 'const key=__OFFLINE_PUBLIC_JWK__;const rev="__BUILD_REVISION__";'],
  ]);
  const bindings = {...keys, ASSETS: {fetch: async request => {
    const body = assets.get(new URL(request.url).pathname);
    return new Response(body || 'not found', {status: body ? 200 : 404});
  }}};
  return {url: 'https://123abcd.cachaste-sitecacho.pages.dev', revision, protectedFiles, encryptedFiles,
    fetcher: async (url, options) => gateway.fetch(new Request(url, options), bindings)};
}

test('post-deploy probe exercises the actual gateway, forgery denial, every private route and ciphertext denial', async () => {
  const result = await probePreview(await liveFixture());
  assert.equal(result.passed, true, JSON.stringify(result.checks.filter(x => !x.passed)));
  assert.equal(result.checks.length, 18);
});

test('post-deploy probe detects a static fail-open bank leak and an accidentally active payment provider', async () => {
  const fixture = await liveFixture(), original = fixture.fetcher;
  fixture.fetcher = async (url, options) => {
    if (url.endsWith('/app/daily-catalog.js')) return new Response('plaintext bank');
    if (url.endsWith('/api/billing') && JSON.parse(options.body).action === 'status') return Response.json({ready: true, trialAvailable: true, managementReady: true});
    return original(url, options);
  };
  const result = await probePreview(fixture);
  assert.equal(result.passed, false);
  assert(result.checks.some(x => x.name.includes('Acceso privado denegado: /app/daily-catalog.js') && !x.passed));
  assert(result.checks.some(x => x.name.includes('Mercado Pago realmente') && !x.passed));
});

async function encryptedDistribution(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'cachaste-deploy-cipher-'));
  t.after(() => rm(root, {recursive: true, force: true}));
  const key = randomBytes(32), contentKey = key.toString('base64'), dist = path.join(root, 'web/dist');
  const protectedFiles = ['daily-catalog.js', 'm2-bank.js', 'reading-bank.js', 'science-bank.js', 'history-bank.js', '.nojekyll'].map(x => '/app/' + x);
  const encryptedFiles = {};
  await mkdir(path.join(dist, '__encrypted'), {recursive: true});
  await mkdir(path.join(root, 'web/artifacts'), {recursive: true});
  for (const name of protectedFiles) {
    const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', key, iv);
    cipher.setAAD(Buffer.from(name));
    const plain = name.endsWith('.nojekyll') ? '' : 'synthetic test fixture, no educational questions';
    encryptedFiles[name] = '/__encrypted/' + createHash('sha256').update(name).digest('hex') + '.bin';
    await writeFile(path.join(dist, encryptedFiles[name]), Buffer.concat([iv, cipher.update(plain), cipher.final(), cipher.getAuthTag()]));
  }
  await writeFile(path.join(root, 'web/artifacts/build-manifest.json'), JSON.stringify({protectedFiles, encryptedFiles}));
  await writeFile(path.join(dist, '_routes.json'), JSON.stringify({version: 1, include: ['/*'], exclude: []}));
  await writeFile(path.join(dist, '_worker.js'), 'export default {};');
  return {root, dist, contentKey, encryptedFiles};
}

test('pre-upload verification authenticates ciphertext with its matching build key, including the empty packaging marker', async t => {
  const fixture = await encryptedDistribution(t);
  assert.equal((await verifyPrivateDistribution(fixture)).authenticatedEncryptedFiles, 6);
  await assert.rejects(verifyPrivateDistribution({...fixture, contentKey: randomBytes(32).toString('base64')}));
  const filename = path.join(fixture.dist, fixture.encryptedFiles['/app/science-bank.js']);
  const bytes = await readFile(filename); bytes[15] ^= 1; await writeFile(filename, bytes);
  await assert.rejects(verifyPrivateDistribution(fixture));
});

test('pre-upload verification refuses public educational folders, gateway exclusions and secrets embedded in a Worker', async t => {
  const fixture = await encryptedDistribution(t);
  await mkdir(path.join(fixture.dist, 'app'));
  await assert.rejects(verifyPrivateDistribution(fixture), /PLAINTEXT_EDUCATIONAL_FILES_DENIED/);
  await rm(path.join(fixture.dist, 'app'), {recursive: true});
  await writeFile(path.join(fixture.dist, '_routes.json'), JSON.stringify({version: 1, include: ['/*'], exclude: ['/app/*']}));
  await assert.rejects(verifyPrivateDistribution(fixture), /ALL_ROUTES_MUST_USE_PREMIUM_GATEWAY/);
  await writeFile(path.join(fixture.dist, '_routes.json'), JSON.stringify({version: 1, include: ['/*'], exclude: []}));
  await writeFile(path.join(fixture.dist, '_worker.js'), 'const badKey="' + fixture.contentKey + '";');
  await assert.rejects(verifyPrivateDistribution(fixture), /CONTENT_KEY_EXPOSED_IN_WORKER/);
});
