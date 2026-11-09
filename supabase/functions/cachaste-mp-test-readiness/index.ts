// Diagnóstico aislado de Mercado Pago. No crea suscripciones ni cobra.
 // Usa exclusivamente variables MP_TEST_*; nunca reutiliza MP_ACCESS_TOKEN.
Deno.serve((req: Request) => {
  if (req.method !== 'GET') return new Response(null, { status: 405 });
  const mode = Deno.env.get('MP_TEST_MODE');
  const token = Deno.env.get('MP_TEST_ACCESS_TOKEN') || '';
  const collector = Deno.env.get('MP_TEST_COLLECTOR_ID') || '';
  const plans = ['WEEKLY', 'MONTHLY', 'YEARLY'].map(
    key => Boolean(Deno.env.get('MP_TEST_PLAN_' + key))
  );
  const safe = {
    isolated: true,
    modeValid: mode === 'test',
    tokenFormatValid: /^TEST-/.test(token),
    collectorConfigured: Boolean(collector),
    planConfigured: { weekly: plans[0], monthly: plans[1], yearly: plans[2] },
    readyForManualReview: mode === 'test' && /^TEST-/.test(token) &&
      Boolean(collector) && plans.every(Boolean),
    chargesEnabled: false
  };
  return new Response(JSON.stringify(safe), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });
});
