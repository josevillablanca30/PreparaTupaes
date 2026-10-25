import {appendFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {REPOSITORY, PREVIEW_BRANCH} from './pages-client.mjs';

export function matchingQaRun(runs, revision) {
  return runs.filter(run => run.path === '.github/workflows/web-commercial.yml' && run.head_sha === revision &&
    run.head_branch === PREVIEW_BRANCH && ['push', 'workflow_dispatch'].includes(run.event))
    .sort((a, b) => b.run_number - a.run_number || b.run_attempt - a.run_attempt || b.id - a.id)[0];
}

export async function requireQa(env, {fetcher = fetch, wait = ms => new Promise(resolve => setTimeout(resolve, ms)), now = Date.now, timeoutMs = 20 * 60000} = {}) {
  if (env.GITHUB_REPOSITORY !== REPOSITORY || env.GITHUB_REF_NAME !== PREVIEW_BRANCH || !/^[a-f\d]{40}$/.test(env.GITHUB_SHA || '') || !env.GH_TOKEN) throw Error('QA_CONTEXT_INVALID');
  const endpoint = 'https://api.github.com/repos/' + REPOSITORY + '/actions/runs?head_sha=' + env.GITHUB_SHA + '&per_page=100';
  const deadline = now() + timeoutMs;
  while (now() < deadline) {
    const response = await fetcher(endpoint, {redirect: 'error', signal: AbortSignal.timeout(30000), headers: {
      authorization: 'Bearer ' + env.GH_TOKEN, 'X-GitHub-Api-Version': '2022-11-28', accept: 'application/vnd.github+json',
    }});
    if (!response.ok) throw Error('QA_STATUS_UNAVAILABLE');
    const run = matchingQaRun((await response.json()).workflow_runs || [], env.GITHUB_SHA);
    if (run?.status === 'completed') {
      if (run.conclusion !== 'success') throw Error('FULL_QA_DID_NOT_PASS');
      if (!Number.isSafeInteger(run.id)) throw Error('QA_RUN_INVALID');
      return 'https://github.com/' + REPOSITORY + '/actions/runs/' + run.id;
    }
    await wait(5000);
  }
  throw Error('FULL_QA_TIMEOUT');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const url = await requireQa(process.env);
    if (process.env.GITHUB_ENV) await appendFile(process.env.GITHUB_ENV, 'VERIFIED_QA_URL=' + url + '\n');
    console.log('Verified successful full QA: ' + url);
  } catch { console.error('Full QA for this exact commit has not been verified. Deployment stopped.'); process.exitCode = 1; }
}
