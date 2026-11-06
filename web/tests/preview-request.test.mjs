import test from 'node:test';
import assert from 'node:assert/strict';
import {validatePreviewRequest} from '../scripts/verify-preview-request.mjs';
const env={GITHUB_REF_NAME:'work/cachaste-web-unificada-20261106',GITHUB_REPOSITORY:'josevillablanca30/PreparaTupaes'};
const request={request:'web-unificada-qa-and-preview-20261106',project:'cachaste-sitecacho',branch:env.GITHUB_REF_NAME,scope:'preview-only',production:false,realPayments:false,requiresSuccessfulQa:true,verifyHostedSupabase:true};
test('preview only accepts the current isolated branch with full QA and payments disabled',()=>{
 assert.equal(validatePreviewRequest(request,env),true);
 for(const [field,value] of [['production',true],['realPayments',true],['requiresSuccessfulQa',false],['verifyHostedSupabase',false],['branch','main'],['project','somosvillablanca'],['scope','production']]){
  assert.throws(()=>validatePreviewRequest({...request,[field]:value},env),/DENIED/);
 }
 assert.throws(()=>validatePreviewRequest(request,{...env,GITHUB_REF_NAME:'main'}),/DENIED/);
 assert.throws(()=>validatePreviewRequest(request,{...env,GITHUB_REPOSITORY:'another/repo'}),/DENIED/);
 assert.throws(()=>validatePreviewRequest({...request,request:'legacy'},env),/INVALID/);
});
