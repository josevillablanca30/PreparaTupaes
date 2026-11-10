import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {validateLiveEvidence} from '../scripts/verify-live-billing-evidence.mjs';
const original=JSON.parse(readFileSync(new URL('../reports/mercadopago-20261110/live-sandbox.json',import.meta.url),'utf8'));
const fixture=()=>structuredClone(original),clock={now:Date.parse(original.checkedAt)};
test('live evidence reports executed API checks and explicitly distinguishes an unexecuted additional browser suite',()=>{
 const r=validateLiveEvidence(fixture(),original.sourceHashes,clock);assert.equal(r.verified,true);assert.equal(r.executedBackendChecks,22);assert.equal(r.additionalHostedBrowserSuite,'not_executed');assert.equal(r.providerWebhookDelivery,'not_verified');
});
test('stale, failed, mismatched or incompletely cleaned-up evidence cannot satisfy hosted backend verification',()=>{
 assert.throws(()=>validateLiveEvidence(fixture(),original.sourceHashes,{now:clock.now+86400001}),/FRESH/);
 const bad=fixture();bad.checks[0].passed=false;assert.throws(()=>validateLiveEvidence(bad,original.sourceHashes,clock),/CHECK_MISSING/);
 const dirty=fixture();dirty.cleanup[0].cancelled=false;assert.throws(()=>validateLiveEvidence(dirty,original.sourceHashes,clock),/CLEANUP_FAILED/);
 assert.throws(()=>validateLiveEvidence(fixture(),{},clock),/SOURCE_MISMATCH/);
});
