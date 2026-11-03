import {randomBytes, generateKeyPairSync} from 'node:crypto';
import {appendFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {PROJECT_URL, PUBLISHABLE_KEY} from '../shared/config.mjs';
import {credentials, pagesClient, verifyTarget, PAGES_PROJECT, PAGES_ACCOUNT_ID} from './pages-client.mjs';
import {verifyProject} from './verify-pages-project.mjs';

export function runtimeSecrets() {
  const {privateKey} = generateKeyPairSync('ec', {namedCurve: 'P-256'});
  return {BANK_CONTENT_KEY: randomBytes(32).toString('base64'), OFFLINE_SIGNING_JWK: JSON.stringify(privateKey.export({format: 'jwk'}))};
}

async function inspectAuthentication(env) {
  const {token} = credentials(env);
  const kind = token.startsWith('cfat_') ? 'account-api-token' : token.startsWith('cfut_') ? 'user-api-token' : token.startsWith('cfk_') || /^[a-f0-9]{37,45}$/.test(token) ? 'global-api-key-format' : 'legacy-or-other-token-format';
  const results = [];
  for (const [type, endpoint] of [['user-token', '/user/tokens/verify'], ['account-token', '/accounts/' + PAGES_ACCOUNT_ID + '/tokens/verify']]) {
    try {
      const response = await fetch('https://api.cloudflare.com/client/v4' + endpoint, {headers: {authorization: 'Bearer ' + token}, redirect: 'error', signal: AbortSignal.timeout(15000)});
      const value = await response.json();
      results.push({type, httpStatus: response.status, active: value.success === true && value.result?.status === 'active', codes: (value.errors || []).map(item => item.code).filter(Number.isSafeInteger)});
    } catch { results.push({type, transportUnavailable: true}); }
  }
  // Compare a second HTTP client against the exact same read-only Pages URL.
  // The secret goes through stdin, never process arguments, output or a file.
  const curl = spawnSync('curl', ['--silent', '--show-error', '--max-time', '15', '--config', '-', '--write-out', '\n%{http_code}', '--url', 'https://api.cloudflare.com/client/v4/accounts/' + PAGES_ACCOUNT_ID + '/pages/projects/' + PAGES_PROJECT], {input: 'header = ' + JSON.stringify('Authorization: Bearer ' + token) + '\n', encoding: 'utf8', maxBuffer: 1024 * 1024});
  let curlResult = {transportUnavailable: true};
  if (curl.status === 0) {
    try { const separator = curl.stdout.lastIndexOf('\n'), body = JSON.parse(curl.stdout.slice(0, separator)); curlResult = {httpStatus: Number(curl.stdout.slice(separator + 1)), success: body.success === true, codes: (body.errors || []).map(item => item.code).filter(Number.isSafeInteger)}; } catch {}
  }
  console.log(JSON.stringify({authenticationInspection: {credentialKind: kind, verification: results, independentProjectRead: curlResult}}));
}

export async function prepareProject(env, {client = pagesClient(env), generate = runtimeSecrets} = {}) {
  credentials(env);
  let project = await client.getProject();
  const created = !project;
  // Inspect before any write. Never adopt a Git-connected project or existing production site.
  if (project) verifyTarget(project, env.GITHUB_REF_NAME);
  const secrets = generate();
  const publicVars = {
    SUPABASE_URL: {type: 'plain_text', value: PROJECT_URL},
    SUPABASE_PUBLISHABLE_KEY: {type: 'plain_text', value: PUBLISHABLE_KEY},
    WEB_SIGNUP_ENABLED: {type: 'plain_text', value: 'false'},
    WEB_AUTH_RETURN_READY: {type: 'plain_text', value: 'false'},
    WEB_GOOGLE_AUTH_ENABLED: {type: 'plain_text', value: 'false'},
  };
  const deployment_configs = {
    preview: {
      fail_open: false, compatibility_date: '2026-10-24',
      env_vars: {...publicVars, ...Object.fromEntries(Object.entries(secrets).map(([key, value]) => [key, {type: 'secret_text', value}]))},
    },
    // Reserve production, fail closed and omit educational decryption/signing keys.
    production: {fail_open: false, compatibility_date: '2026-10-24', env_vars: {...publicVars}},
  };
  if (created) await client.createProject(deployment_configs);
  else await client.configureProject(deployment_configs);
  project = await client.getProject();
  const verified = verifyProject(project, {branch: env.GITHUB_REF_NAME, contentKey: secrets.BANK_CONTENT_KEY});
  return {verified, created, secrets};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.includes('--check-credentials')) {
      credentials(process.env);
      console.log('Cloudflare credentials present; fixed preview target verified. No API writes performed.');
    } else if (process.argv.includes('--check-access')) {
      try {
        const project = await pagesClient(process.env).getProject();
        if (project) verifyTarget(project, process.env.GITHUB_REF_NAME);
        console.log(JSON.stringify({project: PAGES_PROJECT, accessVerified: true, projectPresent: Boolean(project), readOnly: true}));
      } catch (error) {
        if (error.cloudflare?.category === 'AUTHENTICATION' || error.cloudflare?.category === 'AUTH_HEADER_FORMAT') await inspectAuthentication(process.env);
        throw error;
      }
    } else {
      if (!process.env.GITHUB_ENV) throw Error('GITHUB_ACTIONS_ENVIRONMENT_REQUIRED');
      const result = await prepareProject(process.env);
      for (const [key, value] of Object.entries(result.secrets)) {
        // GitHub masks these values before they can appear in later command output.
        console.log('::add-mask::' + value);
        await appendFile(process.env.GITHUB_ENV, key + '=' + value + '\n', {mode: 0o600});
      }
      console.log(JSON.stringify({project: PAGES_PROJECT, created: result.created, ...result.verified}));
    }
  } catch (error) {
    console.error(error.message);
    if (error.cloudflare) console.error(JSON.stringify(error.cloudflare));
    process.exitCode = 1;
  }
}
