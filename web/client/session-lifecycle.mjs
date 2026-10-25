// No tokens or identity claims from this module grant access. Every exchange is
// checked by Auth and cachaste_access in the Pages gateway.
export function installSessionLifecycle({sdk, userId, progress, requireAccess = true, fetcher = fetch, onLicense = async () => {}, onState = () => {}, onEnd = async () => {}, online = () => navigator.onLine !== false, schedule = fn => setTimeout(fn, 0)}) {
  let ended = false, pending = null, running = null, lastToken = null;
  async function end(reason) {
    if (ended) return;
    ended = true;
    progress?.pause();
    onState(reason);
    await onEnd(reason);
  }
  async function drain() {
    while (pending && !ended) {
      const session = pending; pending = null;
      if (session.user?.id !== userId) { await end('account-changed'); break; }
      if (!online()) { onState('offline'); continue; }
      try {
        const response = await fetcher('/api/session', {method: 'POST', cache: 'no-store', headers: {'content-type': 'application/json', 'x-cachaste-request': '1', authorization: 'Bearer ' + session.access_token}, body: '{}'});
        if (response.status === 401) { await end('signed-out'); break; }
        if (!response.ok) throw Error('SESSION_UNAVAILABLE');
        const checked = await response.json();
        if (ended) break;
        if (checked.user?.id !== userId) { await end('account-changed'); break; }
        lastToken = session.access_token;
        if (requireAccess && checked.access?.active !== true) { await end('access-expired'); break; }
        await onLicense(checked.offlineLicense);
        progress?.resume(); onState('ready');
      } catch { if (!ended) onState('reconnecting'); }
    }
  }
  function renew(session, force = false) {
    if (ended) return Promise.resolve();
    if (!session) return online() ? end('signed-out') : Promise.resolve(onState('offline'));
    if (session.user?.id !== userId) return end('account-changed');
    if (!force && session.access_token === lastToken) return running || Promise.resolve();
    pending = session;
    if (!running) running = drain().finally(() => { running = null; });
    return running;
  }
  const {data: {subscription}} = sdk.auth.onAuthStateChange((event, session) => {
    // Supabase holds its auth lock during this callback. All async SDK/network
    // work starts outside the callback, avoiding deadlocks on mobile browsers.
    if (event === 'SIGNED_OUT') { progress?.pause(); schedule(() => end('signed-out')); }
    else if (['INITIAL_SESSION', 'SIGNED_IN', 'TOKEN_REFRESHED'].includes(event)) {
      if (session?.user?.id && session.user.id !== userId) progress?.pause();
      schedule(() => renew(session));
    }
  });
  return {
    renew,
    async reconnect() {
      if (ended || !online()) return;
      try { const {data, error} = await sdk.auth.getSession(); if (error) throw error; await renew(data.session, true); }
      catch { if (!ended) onState('reconnecting'); }
    },
    dispose() { ended = true; pending = null; subscription.unsubscribe(); },
  };
}
