import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
const {items}=dailyCatalog(),c={};
for(const file of ['learning-core.js','editorial-revisions.js','daily-topic-visuals.js','daily-demonstrations.js','daily-scenarios.js','daily-lessons.js'])vm.runInNewContext(readFileSync(file,'utf8'),c);
const L=c.CachasteLearning,P=c.CachasteLessons;

test('Ocho objetivos celulares: analogías con límites, ejemplos distintos y fuente con páginas',()=>{
 const revised=items.filter(q=>q.teaching.didacticReview?.batch==='cellular-2026-10-21');
 assert.equal(revised.length,16);assert.equal(new Set(revised.map(q=>q.concept)).size,8);
 for(const q of revised){
  assert.ok(q.teaching.foundation[0].length>100,q.key);
  assert.notEqual(q.teaching.example.problem,q.question,q.key);
  assert.ok(q.teaching.editorialSources.some(s=>s.section.startsWith('Páginas impresas ')),q.key);
  assert.equal(q.teaching.didacticReview.approval,'partial');
  const before=JSON.stringify(q),version=L.assessmentVersion(q);
  c.CachasteEditorial.apply([q]);assert.equal(JSON.stringify(q),before,q.key+' idempotencia');
  assert.equal(L.assessmentVersion(q),version,q.key+' versión estable');
 }
});
test('Golgi pasa de nombrar el organelo a interpretar evidencia, y recupera el ejercicio anterior',()=>{
 const q=items.find(q=>q.key==='Ciencias:TR-SCI-009'),old=q.previousAssessments.at(-1);
 assert.match(q.question,/grupo control/);assert.match(q.teaching.check,/no identifica por sí solo/);
 assert.notEqual(L.assessmentVersion(q),old.assessmentVersion);
 assert.equal(L.verifiedAssessmentQuestion(null,{id:q.id,assessmentVersion:old.assessmentVersion},q).question,old.question);
 assert.equal(L.compatibleAttempt(q,{assessmentVersion:old.assessmentVersion,correct:true}),false);
 for(let i=0;i<q.options.length;i++)if(i!==q.answer)assert.ok(q.teaching.selectedFeedback[i].diagnosis.includes(q.options[i]));
});
test('ATP, ósmosis y microvellosidades explicitan lo que el modelo permite concluir',()=>{
 const find=concept=>items.find(q=>q.subjectKey==='Ciencias'&&q.concept===concept).teaching;
 assert.match(find('Respiración celular y ATP').intuition.join(' '),/no significa.*todo el ATP/);
 assert.match(find('Ósmosis en medio hipertónico').example.steps.join(' '),/ambos sentidos/);
 assert.match(find('Superficie de intercambio').example.steps.join(' '),/exactamente a la mitad/);
 assert.match(find('Pared y organización vegetal').example.steps.join(' '),/ausencia de cloroplastos no excluye/);
});
test('Todas las preguntas ofrecen ayuda simple y otro ejemplo sin necesitar una ilustración especial',()=>{
 for(const q of items){
  const before=JSON.stringify(q),html=P.repairSupport(q);
  assert.match(html,/reference-easy-card/);assert.match(html,/reference-example-card/);
  assert.ok(html.includes(q.teaching.example.problem.replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]))),q.key);
  assert.equal(JSON.stringify(q),before,q.key);
 }
 const q=structuredClone(items[0]);q.teaching.intuition=['<script>texto & texto</script>'];
 assert.doesNotMatch(P.repairSupport(q),/<script>/);assert.match(P.repairSupport(q),/&lt;script&gt;/);
});
