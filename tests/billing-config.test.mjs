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

test('La aplicación completa requiere suscripción; la prueba gratuita se convierte al mensual',()=>{
 assert.equal(config.productModel,'subscription_required_full_app');
 assert.equal(config.freeTier.enabled,false);
 assert.ok(config.plans.every(p=>p.access==='full_app'&&p.automaticRenewal===true));
 assert.deepEqual(
  [config.defaultOffer.planId,config.defaultOffer.duration,config.defaultOffer.priceCLP,
   config.defaultOffer.afterTrial.planId,config.defaultOffer.afterTrial.priceCLP,config.defaultOffer.afterTrial.renewal],
  ['monthly','P7D',0,'monthly',7990,'P1M']
 );
 assert.equal(config.defaultOffer.requiresExplicitConsent,true);
 assert.equal(config.defaultOffer.showFirstChargeDate,true);
 assert.equal(config.defaultOffer.showCancellationInstructions,true);
 assert.equal(config.defaultOffer.showStorePricing,true);
 assert.equal(config.trialReminder.requiresNotificationPermission,true);
});
