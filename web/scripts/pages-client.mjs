// Official Pages API only. No zone, DNS, billing, account-plan or other-project endpoints.
export const PAGES_PROJECT = 'cachaste-sitecacho';
// Public resource identifier confirmed in the owner's Cloudflare screenshot; not an API credential.
export const PAGES_ACCOUNT_ID = 'cfe4b77c0c39bb056306d16133a93642';
export const PREVIEW_BRANCH = 'work/cachaste-web-comercial-20261024';
export const RESERVED_PRODUCTION_BRANCH = 'production-requires-owner-approval';
export const REPOSITORY = 'josevillablanca30/PreparaTupaes';

export function credentials(env) {
  if (env.GITHUB_REF_NAME !== PREVIEW_BRANCH) throw Error('PRODUCTION_DEPLOYMENT_DENIED');
  if (env.CLOUDFLARE_PAGES_PROJECT && env.CLOUDFLARE_PAGES_PROJECT !== PAGES_PROJECT) throw Error('UNRELATED_PROJECT_DENIED');
  if (env.CLOUDFLARE_ACCOUNT_ID !== PAGES_ACCOUNT_ID) throw Error('UNRELATED_ACCOUNT_DENIED');
  if (!/^[A-Za-z0-9_-]{20,256}$/.test(env.CLOUDFLARE_API_TOKEN || '')) throw Error('CLOUDFLARE_API_TOKEN_REQUIRED_IN_GITHUB_SECRETS');
  return {account: env.CLOUDFLARE_ACCOUNT_ID, token: env.CLOUDFLARE_API_TOKEN};
}

export function verifyTarget(project, branch) {
  if (project?.name !== PAGES_PROJECT) throw Error('UNRELATED_PROJECT_DENIED');
  if (branch !== PREVIEW_BRANCH || project.production_branch !== RESERVED_PRODUCTION_BRANCH) throw Error('PRODUCTION_DEPLOYMENT_DENIED');
  if (project.source) throw Error('DIRECT_UPLOAD_PROJECT_REQUIRED');
  if (project.canonical_deployment) throw Error('EXISTING_PRODUCTION_DEPLOYMENT_DENIED');
  const domains = new Set([PAGES_PROJECT + '.pages.dev', 'sitecacho.cl', 'www.sitecacho.cl']);
  if ((project.domains || []).some(x => !domains.has(x))) throw Error('UNRELATED_DOMAIN_DENIED');
}

export function pagesClient(env, {fetcher = fetch} = {}) {
  const {account, token} = credentials(env);
  const base = 'https://api.cloudflare.com/client/v4/accounts/' + account + '/pages/projects';
  async function request(method, suffix, body, {missing = false} = {}) {
    let response, data;
    try {
      response = await fetcher(base + suffix, {
        method, redirect: 'error', signal: AbortSignal.timeout(30000),
        headers: {authorization: 'Bearer ' + token, ...(body ? {'content-type': 'application/json'} : {})},
        ...(body ? {body: JSON.stringify(body)} : {}),
      });
      if (missing && response.status === 404) return null;
      data = await response.json();
    } catch { throw Error('CLOUDFLARE_API_UNAVAILABLE'); }
    // Provider bodies may include secret bindings. Never print or propagate them in errors.
    if (!response.ok || data.success !== true) throw Error('CLOUDFLARE_API_REJECTED_HTTP_' + response.status);
    return data.result;
  }
  return {
    getProject: () => request('GET', '/' + PAGES_PROJECT, undefined, {missing: true}),
    createProject: deployment_configs => request('POST', '', {
      name: PAGES_PROJECT, production_branch: RESERVED_PRODUCTION_BRANCH, deployment_configs,
    }),
    configureProject: deployment_configs => request('PATCH', '/' + PAGES_PROJECT, {deployment_configs}),
    listDeployments: () => request('GET', '/' + PAGES_PROJECT + '/deployments?env=preview&per_page=25'),
  };
}

export function previewUrl(value) {
  let url;
  try { url = new URL(value); } catch { throw Error('UNRELATED_PREVIEW_URL_DENIED'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.search || url.hash || url.pathname !== '/' ||
      !/^[a-z0-9-]+\.cachaste-sitecacho\.pages\.dev$/.test(url.hostname)) throw Error('UNRELATED_PREVIEW_URL_DENIED');
  return url.origin;
}
