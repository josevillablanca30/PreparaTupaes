import {createClient} from 'npm:@supabase/supabase-js@2.118.0';
import {createSandboxHandlers} from '../_shared/mercadopago-sandbox.mjs';
import {createMercadoPagoHandlers} from '../_shared/mercadopago-handler.mjs';

declare const EdgeRuntime: { waitUntil(task: Promise<void>): void };

const env = (key: string) => Deno.env.get(key);
const {commercialReadiness} = createMercadoPagoHandlers({env,createClient});
let lastCommercialCheck = 0;

function inspectCommercial() {
  const now = Date.now();
  if (now - lastCommercialCheck < 60_000) return;
  lastCommercialCheck = now;
  EdgeRuntime.waitUntil(commercialReadiness().then(({seller, plans, ...state}) => {
    console.info('MP_COMMERCIAL_READINESS', JSON.stringify({
      seller, plans: plans.map(({key, id, applicationId}) => ({key, id, applicationId})), ...state,
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
