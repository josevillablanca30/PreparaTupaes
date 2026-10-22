import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const config=JSON.parse(readFileSync(new URL('../billing/subscription-plans.cl.json',import.meta.url),'utf8'));
test('Suscripciones Cachaste: tres planes en Chile y montos acordados',()=>{
 assert.equal(config.market,'CL');
 assert.equal(config.currency,'CLP');
 assert.deepEqual(config.plans.map(p=>[p.id,p.duration,p.priceCLP]),[
  ['weekly','P1W',2490],['monthly','P1M',7990],['yearly','P1Y',64990]
 ]);
 assert.equal(new Set(config.plans.map(p=>p.appleProductId)).size,3);
 assert.equal(new Set(config.plans.map(p=>p.googlePlayBasePlanId)).size,3);
});
test('No se activan cobros desde esta configuración',()=>{
 assert.equal(config.publicationState,'configuration_only_not_for_live_purchase');
 assert.equal(config.billing.android,'google_play_billing');
 assert.equal(config.billing.ios,'app_store_storekit');
 assert.equal(config.billing.allowOfflineSelfActivation,false);
 assert.equal(config.billing.requireVerifiedStoreEntitlement,true);
});
