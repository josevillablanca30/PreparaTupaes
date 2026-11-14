import {createClient} from 'npm:@supabase/supabase-js@2.118.0';
import {createSandboxHandlers} from '../_shared/mercadopago-sandbox.mjs';
import {createMercadoPagoHandlers} from '../_shared/mercadopago-handler.mjs';

declare const EdgeRuntime: { waitUntil(task: Promise<void>): void };

const env = (key: string) => Deno.env.get(key);
const {commercialReadiness} = createMercadoPagoHandlers({env,createClient});
let lastCommercialCheck = 0;

async function probeCommercialWebhook() {
  const type = 'cachaste_configuration_probe';
  const id = crypto.randomUUID(), requestId = crypto.randomUUID(), ts = Date.now();
  const bytes = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', bytes.encode(env('MP_WEBHOOK_SECRET')), {name: 'HMAC', hash: 'SHA-256'}, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, bytes.encode(`id:${id};request-id:${requestId};ts:${ts};`));
  const hex = Array.from(new Uint8Array(signature), value => value.toString(16).padStart(2,'0')).join('');
  const url = new URL('/functions/v1/cachaste-mp-events', env('SUPABASE_URL'));
  url.searchParams.set('data.id', id);
  url.searchParams.set('type', type);
  const response = await fetch(url, {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(8000),
    headers: {'content-type': 'application/json','x-request-id': requestId, 'x-signature': `ts=${ts},v1=${hex}`},
    body: JSON.stringify({type, data: {id}}),
  });
  return response.status;
}

function inspectCommercial() {
  const now = Date.now();
  if (now - lastCommercialCheck < 60_000) return;
  lastCommercialCheck = now;
  EdgeRuntime.waitUntil(commercialReadiness().then(async ({seller, plans, ...state}) => {
    const webhookProbeStatus = state.webhookSecretConfigured ? await probeCommercialWebhook().catch(() => null) : null;
    console.info('MP_COMMERCIAL_READINESS', JSON.stringify({
      seller, plans, ...state, webhookProbeStatus,
    }));
  }).catch((error: Error) => {
    const mode = env('CACHASTE_MP_MODE');
    console.info('MP_COMMERCIAL_READINESS', JSON.stringify({
      error: /^[A-Z_]+$/.test(error.message) ? error.message : 'PROVIDER_READ_UNAVAILABLE',
      status: 'providerStatus' in error ? error.providerStatus : undefined,
      catalogue: 'catalogue' in error ? error.catalogue : undefined,
      mode: mode === 'production' || mode === 'test' ? mode : null,
      credentialsPresent: !!env('MP_ACCESS_TOKEN') && !!env('MP_COLLECTOR_ID'),
      credentialsMatchSandbox: !!env('MP_TEST_ACCESS_TOKEN') && env('MP_ACCESS_TOKEN') === env('MP_TEST_ACCESS_TOKEN'),
      webhookMatchesSandbox: !!env('MP_TEST_WEBHOOK_SECRET') && env('MP_WEBHOOK_SECRET') === env('MP_TEST_WEBHOOK_SECRET'),
      configuredPlans: ['WEEKLY', 'MONTHLY', 'YEARLY', 'MONTHLY_TRIAL'].filter(key => !!env('MP_PLAN_'+key)),
      webhookSecretConfigured: !!env('MP_WEBHOOK_SECRET'),
    }));
  }));
}

Deno.serve(createSandboxHandlers({env,createClient,inspectCommercial}).billing);
