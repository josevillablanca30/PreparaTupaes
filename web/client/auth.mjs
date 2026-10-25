import {createClient} from '@supabase/supabase-js';

export const AUTH_STORAGE_KEY = 'cachaste-auth-v1';
const CLIENT = Symbol.for('cachaste.web.auth');

export function nextLearningPage(search = '') {
  const candidate = new URLSearchParams(search).get('next');
  return /^\/app\/[a-z0-9-]+\.html$/.test(candidate || '') ? candidate : '/app/inicio.html';
}

// All web bundles, including the retained competition client, share one SDK and
// refresh lock. Android still bundles its original client without this adapter.
export function getWebClient(config, storage = globalThis.localStorage) {
  const url = config.supabaseUrl, key = config.publishableKey;
  if (!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url || '') || !/^sb_publishable_/.test(key || '')) throw Error('AUTH_CONFIGURATION_REQUIRED');
  const existing = globalThis[CLIENT];
  if (existing) {
    if (existing.url !== url || existing.key !== key || existing.storage !== storage) throw Error('AUTH_CONFIGURATION_CHANGED');
    return existing.client;
  }
  const client = createClient(url, key, {auth: {storage, storageKey: AUTH_STORAGE_KEY, flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: false}});
  globalThis[CLIENT] = {client, url, key, storage};
  return client;
}

export async function startGoogleSignIn({sdk, config, location = globalThis.location, fetcher = fetch}) {
  if (!config.googleAuthEnabled || !config.authReturnReady) throw Error('GOOGLE_NOT_READY');
  const response = await fetcher('/api/auth/status', {cache: 'no-store'});
  if (!response.ok || (await response.json()).googleReady !== true) throw Error('GOOGLE_NOT_READY');
  const redirect = new URL('/cuenta.html', location.origin);
  redirect.searchParams.set('next', nextLearningPage(location.search));
  const {data, error} = await sdk.auth.signInWithOAuth({provider: 'google', options: {redirectTo: redirect.href, scopes: 'openid email profile', queryParams: {prompt: 'select_account'}, skipBrowserRedirect: true}});
  if (error) throw error;
  const target = new URL(data?.url || '', location.origin);
  if (target.origin !== config.supabaseUrl || target.pathname !== '/auth/v1/authorize' || target.searchParams.get('provider') !== 'google' || target.searchParams.get('code_challenge_method') !== 's256' || !/^[A-Za-z0-9_-]{43}$/.test(target.searchParams.get('code_challenge') || '')) throw Error('AUTH_REDIRECT_DENIED');
  location.assign(target.href);
}

export async function finishAuthReturn({sdk, location = globalThis.location, history = globalThis.history}) {
  const url = new URL(location.href), code = url.searchParams.get('code'), flowId = url.searchParams.get('sb_flow_id');
  const failed = url.searchParams.has('error') || url.searchParams.has('error_code') || /(?:^|&)error=/.test(url.hash.slice(1));
  const implicit = /(?:^|&)(?:access_token|refresh_token)=/.test(url.hash.slice(1));
  if (!code && !failed && !implicit) return false;
  // Do this before any request or render: authorization codes and provider error
  // text must not remain in history, links, referrers or screenshots.
  const clean = new URL('/cuenta.html', url.origin);
  if (url.searchParams.has('next')) clean.searchParams.set('next', nextLearningPage(url.search));
  if (url.searchParams.get('recovery') === '1') clean.searchParams.set('recovery', '1');
  history.replaceState(null, '', clean.pathname + clean.search);
  if (failed) throw Error('AUTH_RETURN_CANCELLED');
  if (!code || code.length > 2048 || !/^[A-Za-z0-9_-]+$/.test(code)) throw Error('AUTH_RETURN_INVALID');
  if (flowId !== null && !/^[a-f0-9]{32}$/.test(flowId)) throw Error('AUTH_RETURN_INVALID');
  const {error} = await sdk.auth.exchangeCodeForSession(code, flowId ? {flowId} : undefined);
  if (error) throw Error('AUTH_RETURN_INVALID');
  return true;
}
