import {randomBytes, generateKeyPairSync} from 'node:crypto';
import {appendFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {PROJECT_URL, PUBLISHABLE_KEY} from '../shared/config.mjs';
import {credentials, pagesClient, verifyTarget, PAGES_PROJECT} from './pages-client.mjs';
import {verifyProject} from './verify-pages-project.mjs';

export function runtimeSecrets() {
  const {privateKey} = generateKeyPairSync('ec', {namedCurve: 'P-256'});
  return {BANK_CONTENT_KEY: randomBytes(32).toString('base64'), OFFLINE_SIGNING_JWK: JSON.stringify(privateKey.export({format: 'jwk'}))};
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
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
