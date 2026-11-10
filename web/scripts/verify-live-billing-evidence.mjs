// Alternative hosted-backend verification when CI has no personal Supabase management token.
// This does not claim that the additional hosted browser suite ran.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';import path from 'node:path';
import {PROJECT_URL,PUBLISHABLE_KEY} from '../shared/config.mjs';
const sources=['supabase/functions/_shared/mercadopago-core.mjs','supabase/functions/_shared/mercadopago-sandbox.mjs'];
const required=['two_real_temporary_auth_sessions','anonymous_is_denied','editable_metadata_cannot_grant_administration','service_only_sandbox_rpc_is_denied_to_student','admin_reads_verified_four_plan_catalogue','hosted_checkout_created_with_real_test_seller','checkout_retry_reuses_provider_id','pending_checkout_grants_no_trial','provider_authorizes_test_subscription','sandbox_trial_activation_is_verified_and_separate','sandbox_never_activates_production_learning','signed_simulated_webhook_with_real_provider_and_database','signed_webhook_replay_is_idempotent','forged_webhook_is_rejected','deployed_cancel_confirms_no_future_renewal','cancellation_keeps_verified_trial_end','another_subscription_cannot_be_cancelled','admin_revocation_applies_to_existing_jwt'];
export function validateLiveEvidence(report,hashes,{now=Date.now()}={}){
 const stamp=Date.parse(report?.checkedAt);
 if(!Number.isFinite(stamp)||now-stamp>86400000||stamp-now>300000)throw Error('FRESH_LIVE_BILLING_EVIDENCE_REQUIRED');
 if(report.failed!==null||report.mode!=='sandbox'||report.productionPurchasesCreated!==0)throw Error('LIVE_BILLING_EVIDENCE_FAILED');
 if(required.some(name=>!report.checks?.some(c=>c.name===name&&c.passed===true))||report.checks.some(c=>c.passed===false))throw Error('LIVE_BILLING_CHECK_MISSING');
 if(!report.cleanup?.length||report.cleanup.some(c=>c.providerSubscription?c.cancelled!==true:c.deleted!==true))throw Error('LIVE_BILLING_CLEANUP_FAILED');
 if(sources.some(name=>report.sourceHashes?.[name]!==hashes[name]))throw Error('LIVE_BILLING_SOURCE_MISMATCH');
 return {verified:true,executedBackendChecks:report.checks.filter(c=>c.passed===true).length,providerWebhookDelivery:report.checks.find(c=>c.name==='provider_delivered_signed_webhook')?.passed===true?'verified':'not_verified',additionalHostedBrowserSuite:'not_executed',reason:'SUPABASE_ACCESS_TOKEN_NOT_CONFIGURED',limits:report.limits};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const report=JSON.parse(await readFile('web/reports/mercadopago-20261110/live-sandbox.json','utf8')),hashes={};
  for(const name of sources)hashes[name]=createHash('sha256').update(await readFile(name)).digest('hex');
  const result=validateLiveEvidence(report,hashes);
  const post=async(slug,body)=>fetch(PROJECT_URL+'/functions/v1/'+slug,{method:'POST',headers:{apikey:PUBLISHABLE_KEY,'content-type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
  const denied=await post('cachaste-mp-sandbox-checkout',{action:'status'});if(denied.status!==401)throw Error('SANDBOX_ANONYMOUS_DENIAL_FAILED');
  const status=await post('cachaste-mercadopago',{action:'status'});if(!status.ok)throw Error('PRODUCTION_STATUS_UNAVAILABLE');if((await status.json()).ready!==false)throw Error('PRODUCTION_PAYMENTS_NOT_CLOSED');
  const evidence={...result,checkedAt:new Date().toISOString(),currentAnonymousSandboxStatus:denied.status,currentProductionPaymentsReady:false};
  await mkdir('web/artifacts/hosted-live',{recursive:true});await writeFile('web/artifacts/hosted-live/billing-evidence.json',JSON.stringify(evidence,null,2)+'\n');
  console.log(JSON.stringify(evidence));
 }catch(e){console.error(e.message);process.exitCode=1;}
}
