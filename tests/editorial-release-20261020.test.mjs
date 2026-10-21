import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFileSync} from 'node:fs';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';import {readinessAudit} from '../scripts/readiness-audit.mjs';import {reviewedTransfers,reviewedTransferKeys} from '../scripts/editorial-transfers-20261020.mjs';
const ctx=vm.createContext({Intl,Date});for(const file of ['learning-core.js','daily-curriculum.js','daily-progression.js'])vm.runInContext(readFileSync(new URL('../'+file,import.meta.url),'utf8'),ctx);const L=ctx.CachasteLearning,{items}=dailyCatalog();
test('Las 24 reformulaciones conservan versión anterior y 14 ejercicios revisados cierran las familias pendientes',()=>{
 const revised=items.filter(q=>q.editorialRevision==='2026-10-20');assert.equal(revised.length,24);assert.equal(reviewedTransfers.length,14);assert.equal(items.length,802);
 for(const q of revised){const old=q.previousAssessments[0];assert.equal(L.assessmentVersion(old),old.assessmentVersion);assert.notEqual(L.assessmentVersion(q),old.assessmentVersion);assert.equal(q.answer,old.answer,q.key+' conserva índice de clave');assert.equal(q.concept,old.concept);assert.equal(q.examEligible,old.examEligible);assert.equal(q.legacyAssessmentVersion,old.assessmentVersion);
  assert.equal(L.compatibleAttempt(q,{correct:true}),false);assert.equal(L.compatibleAttempt(q,{assessmentVersion:old.assessmentVersion,correct:true}),false);assert.equal(L.verifiedAssessmentQuestion(null,{id:q.id,correct:true,assessmentVersion:old.assessmentVersion},q).question,old.question);
  const legacy={ids:[q.id],mode:'express',index:0,results:[],selected:old.answer};const restored=L.restoreSession(legacy,[q]);assert.equal(L.archivedSessionQuestions(restored)[0].assessmentVersion,old.assessmentVersion);
 }
 const report=readinessAudit(items);assert.equal(report.overall.unverifiableConcepts,0);assert.equal(report.scopes.paes.overall.questions,755);assert.equal(report.scopes.complementary.overall.questions,47);
 for(const key of reviewedTransferKeys){const q=items.find(q=>q.key===key);assert.ok(q);assert.equal(q.sourceTrace.reviewStatus,'revision-editorial-2026-10-20');assert.ok(q.sourceTrace.driveFileId);const base=items.find(x=>x.key===q.sourceKey);assert.equal(q.examEligible,base.examEligible!==false&&!base.supplementary);}
});
test('La ruta recomienda la primera habilidad pendiente y permite explorar sin regalar logros',()=>{
 const C=ctx.CachasteProgression;
 for(const subject of ['M1','M2','Lectura','Historia','Ciencias'])for(const track of subject==='Ciencias'?['Biología','Física','Química','TP']:[null]){
  const initial=C.route(items,subject,track,[]);assert.ok(initial.levels.length>1);assert.equal(initial.access(initial.levels[0].id),true);assert.equal(initial.access(initial.levels[1].id),true);assert.equal(initial.access(initial.levels.at(-1).id),true);
  const first=initial.levels[0];const state={concept:first.objective,status:'comprobado',attempts:2,correct:2,evidence:['a','b']};const advanced=C.route(items,subject,track,[state]);assert.equal(advanced.access(first.id),true);assert.equal(advanced.access(initial.levels[1].id),true);assert.equal(advanced.access(initial.levels[2]?.id),true);assert.equal(advanced.levels.some(l=>l.supplementary),false);
 }
});
