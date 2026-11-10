// Readiness is now an authenticated action of cachaste-mp-sandbox-checkout.
// This retired diagnostic performs no provider requests and logs no configuration.
Deno.serve(()=>new Response('Not found',{status:404,headers:{'cache-control':'no-store'}}));
