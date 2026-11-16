import assert from 'node:assert/strict';
import {BASIC_LIMITS,MONTHLY_TRIAL,PAES_SUBJECTS,accessTier,basicQuota} from '../shared/access-tiers.mjs';
assert.equal(PAES_SUBJECTS.length,5);
assert.equal(accessTier({active:true}), 'premium');
assert.equal(accessTier({active:false,basicEnabled:true}), 'basica');
assert.equal(accessTier({active:false}), 'unavailable');
for(const subject of PAES_SUBJECTS){
 assert.equal(basicQuota({kind:'lesson',subject,used:2}).allowed,true);
 assert.equal(basicQuota({kind:'lesson',subject,used:3}).allowed,false);
 assert.equal(basicQuota({kind:'diagnostic',subject,diagnosticUsed:false}).allowed,true);
 assert.equal(basicQuota({kind:'diagnostic',subject,diagnosticUsed:true}).allowed,false);
}
assert.equal(basicQuota({kind:'expressExam',used:1}).allowed,false);
assert.equal(basicQuota({kind:'duel',used:1}).allowed,true);
assert.equal(basicQuota({kind:'duel',used:2}).allowed,false);
assert.equal(basicQuota({kind:'fullExam',used:0}).allowed,false);
assert.equal(MONTHLY_TRIAL.renewalPlan,'mensual');
assert.equal(MONTHLY_TRIAL.days,7);
assert.equal(BASIC_LIMITS.lessonsPerSubjectPerDay,3);
console.log('Básica/Premium: reglas de producto verificadas');
