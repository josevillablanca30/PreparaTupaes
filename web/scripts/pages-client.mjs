// Official Pages API only. No zone, DNS, billing, account-plan or other-project endpoints.
export const PAGES_PROJECT = 'cachaste-sitecacho';
// Public resource identifier confirmed in the owner's Cloudflare screenshot; not an API credential.
export const PAGES_ACCOUNT_ID = 'cfe4b77c0c39bb056306d16133a93642';
export const PREVIEW_BRANCH = 'work/cachaste-web-unificada-20261106';
export const RESERVED_PRODUCTION_BRANCH = 'production-requires-owner-approval';
// The owner requested the public website on 2026-11-10; payment activation remains separate.
export const PUBLIC_RELEASE_MARKER = 'sitecacho-payments-closed-v1';
export const REPOSITORY = 'josevillablanca30/PreparaTupaes';

export function normalizeApiToken(value) {
  if (typeof value !== 'string' || !value.trim()) throw Error('CLOUDFLARE_API_TOKEN_REQUIRED_IN_GITHUB_SECRETS');
  let token = value.trim();
  // Pasting a quoted Authorization header or a Bearer value must not send a
  // second scheme, quotes or surrounding line breaks to the provider.
  for (let attempt = 0; attempt < 3; attempt++) {
    if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) token = token.slice(1, -1).trim();
    token = token.replace(/^Authorization\s*:\s*/i, '').replace(/^Bearer[\t ]+/i, '').trim();
  }
  // RFC 6750 b64token characters. Cloudflare, rather than a guessed local
  // checksum/length format, decides whether the opaque credential is valid.
  if (token.length < 20 || token.length > 4096 || !/^[A-Za-z0-9._~+\/-]+=*$/.test(token)) throw Error('CLOUDFLARE_API_TOKEN_HEADER_FORMAT_INVALID');
  return token;
}

// Cloudflare responses may contain private bindings or credential fragments.
// Keep only numeric codes and fixed diagnostic labels, never provider text.
function apiDiagnostic(method, suffix, status, data) {
  const queue = Array.isArray(data?.errors) ? [...data.errors] : [], codes = [], messages = [];
  for (let count = 0; queue.length && count < 12; count++) {
    const item = queue.shift();
    if (Number.isSafeInteger(item?.code) && item.code >= 0 && item.code <= 999999999) codes.push(item.code);
    if (typeof item?.message === 'string') messages.push(item.message.slice(0, 2000));
    if (Array.isArray(item?.error_chain)) queue.push(...item.error_chain);
  }
  const description = messages.join(' ');
  const category = codes.includes(8000066) ? 'FAIL_CLOSED_ENVIRONMENTS_REQUIRED'
    : codes.includes(6111) || /invalid.*(?:authorization|request headers)|invalid format for.*header/i.test(description) ? 'AUTH_HEADER_FORMAT'
    : /authenticat|invalid.*token|expired.*token|revoked.*token/i.test(description) ? 'AUTHENTICATION'
    : /permission|not authorized|access denied/i.test(description) ? 'PERMISSION'
    : /compatibility.?date|date.*future/i.test(description) ? 'COMPATIBILITY_DATE'
    : /deployment.config|environment.variable|env_vars|fail_open|secret.binding/i.test(description) ? 'DEPLOYMENT_CONFIGURATION'
    : 'API_REQUEST_REJECTED';
  return {method, operation: suffix.includes('/deployments') ? 'list-deployments' : method === 'POST' ? 'create-project' : method === 'PATCH' ? 'configure-project' : 'read-project', status, codes: [...new Set(codes)], category};
}

export function credentials(env) {
  if (env.GITHUB_REF_NAME !== PREVIEW_BRANCH) throw Error('PRODUCTION_DEPLOYMENT_DENIED');
  if (env.CLOUDFLARE_PAGES_PROJECT && env.CLOUDFLARE_PAGES_PROJECT !== PAGES_PROJECT) throw Error('UNRELATED_PROJECT_DENIED');
  if (env.CLOUDFLARE_ACCOUNT_ID !== PAGES_ACCOUNT_ID) throw Error('UNRELATED_ACCOUNT_DENIED');
  return {account: env.CLOUDFLARE_ACCOUNT_ID, token: normalizeApiToken(env.CLOUDFLARE_API_TOKEN)};
}

export function verifyTarget(project, branch) {
  if (project?.name !== PAGES_PROJECT) throw Error('UNRELATED_PROJECT_DENIED');
  if (branch !== PREVIEW_BRANCH || project.production_branch !== RESERVED_PRODUCTION_BRANCH) throw Error('PRODUCTION_DEPLOYMENT_DENIED');
  if (project.source) throw Error('DIRECT_UPLOAD_PROJECT_REQUIRED');
  if (project.canonical_deployment) {
    const release=project.canonical_deployment;
    if (!reviewedPublicRuntime(project.deployment_configs?.production) || release.project_name!==PAGES_PROJECT || release.environment!=='production' ||
      release.deployment_trigger?.metadata?.branch!==RESERVED_PRODUCTION_BRANCH || !/^[a-f\d]{40}$/.test(release.deployment_trigger?.metadata?.commit_hash||'')) throw Error('EXISTING_PRODUCTION_DEPLOYMENT_DENIED');
  }
  const domains = new Set([PAGES_PROJECT + '.pages.dev', 'sitecacho.cl', 'www.sitecacho.cl']);
  if ((project.domains || []).some(x => !domains.has(x))) throw Error('UNRELATED_DOMAIN_DENIED');
}

export function reviewedPublicRuntime(config, expectedSignupEnabled) {
  const v=config?.env_vars||{};
  const signup=v.WEB_SIGNUP_ENABLED;
  return config?.fail_open===false && v.WEB_PUBLIC_RELEASE?.type==='plain_text' && v.WEB_PUBLIC_RELEASE.value===PUBLIC_RELEASE_MARKER &&
    ['WEB_PAYMENTS_ENABLED','WEB_AUTH_RETURN_READY','WEB_GOOGLE_AUTH_ENABLED'].every(k=>v[k]?.type==='plain_text'&&v[k].value==='false') &&
    signup?.type==='plain_text' && ['true','false'].includes(signup.value) &&
    (expectedSignupEnabled===undefined||signup.value===String(expectedSignupEnabled)) &&
    ['BANK_CONTENT_KEY','OFFLINE_SIGNING_JWK'].every(k=>v[k]?.type==='secret_text');
}

export function publicSiteUrl(value) {
  let url;try{url=new URL(value);}catch{throw Error('UNRELATED_PUBLIC_SITE_DENIED');}
  if(url.protocol!=='https:'||url.username||url.password||url.port||url.search||url.hash||url.pathname!=='/'||
    !['sitecacho.cl','www.sitecacho.cl',PAGES_PROJECT+'.pages.dev'].includes(url.hostname))throw Error('UNRELATED_PUBLIC_SITE_DENIED');
  return url.origin;
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
    if (!response.ok || data.success !== true) {
      const error = Error('CLOUDFLARE_API_REJECTED_HTTP_' + response.status);
      error.cloudflare = apiDiagnostic(method, suffix, response.status, data);
      throw error;
    }
    return data.result;
  }
  return {
    getProject: () => request('GET', '/' + PAGES_PROJECT, undefined, {missing: true}),
    createProject: deployment_configs => request('POST', '', {
      name: PAGES_PROJECT, production_branch: RESERVED_PRODUCTION_BRANCH, deployment_configs,
    }),
    // When setting fail_open, Pages requires a value in both environments (8000066).
    // Omit the other environment's variables so its encrypted bindings remain unchanged.
    configureProject: deployment_configs => {
      if(Object.values(deployment_configs).some(c=>c?.fail_open===true))throw Error('PAGES_FAIL_CLOSED_REQUIRED');
      return request('PATCH','/'+PAGES_PROJECT,{deployment_configs:{preview:{fail_open:false,...deployment_configs.preview},production:{fail_open:false,...deployment_configs.production}}});
    },
    listDeployments: () => request('GET', '/' + PAGES_PROJECT + '/deployments?env=preview&per_page=25'),
    listPublicDeployments: () => request('GET', '/' + PAGES_PROJECT + '/deployments?env=production&per_page=25'),
    listDomains: () => request('GET', '/' + PAGES_PROJECT + '/domains'),
    addDomain: name => {if(!['sitecacho.cl','www.sitecacho.cl'].includes(name))throw Error('UNRELATED_DOMAIN_DENIED');return request('POST','/'+PAGES_PROJECT+'/domains',{name});},
    retryDomain: name => {if(!['sitecacho.cl','www.sitecacho.cl'].includes(name))throw Error('UNRELATED_DOMAIN_DENIED');return request('PATCH','/'+PAGES_PROJECT+'/domains/'+name,{});},
  };
}

export function previewUrl(value) {
  let url;
  try { url = new URL(value); } catch { throw Error('UNRELATED_PREVIEW_URL_DENIED'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.search || url.hash || url.pathname !== '/' ||
      !/^[a-z0-9-]+\.cachaste-sitecacho\.pages\.dev$/.test(url.hostname)) throw Error('UNRELATED_PREVIEW_URL_DENIED');
  return url.origin;
}
