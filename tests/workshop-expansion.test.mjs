import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';

const ctx=vm.createContext({});
for(const f of ['daily-curriculum.js','daily-studios.js'])vm.runInContext(readFileSync(new URL('../'+f,import.meta.url),'utf8'),ctx);
const C=ctx.CachasteCurriculum,S=ctx.CachasteStudios,{items}=dailyCatalog();
const coverage=S.hydrate(items,C);

test('Ampliación pedagógica utiliza ejemplos del banco y llega a todas las materias, sin fabricar preguntas',()=>{
 console.log('COBERTURA DE TALLERES:',JSON.stringify(coverage));
 assert.ok(coverage.total>=25,'Deben existir muchas más clases que los cinco pilotos iniciales');
 for(const subject of Object.keys(C.subjects))assert.ok(coverage.bySubject[subject]>=3,subject+' carece de talleres reales');
 const keys=new Set();
 for(const lesson of S.lessons){
  const key=lesson.subject+':'+lesson.concept;
  assert.ok(!keys.has(key),'Concepto duplicado '+key);keys.add(key);
  assert.equal(S.get(lesson.subject,lesson.concept)?.id,lesson.id);
  assert.equal(lesson.cards.length,3);
  assert.equal(lesson.pairs.length,3);
  assert.ok(lesson.cards.every(c=>c.text.length>=100),'Explicación débil: '+key);
  assert.equal(new Set(lesson.pairs.map(p=>p.answer)).size,3);
  if(lesson.generatedType){
   const question=items.find(x=>x.key===lesson.generatedFrom);
   assert.ok(question,'No existe fuente pedagógica para '+key);
   assert.equal(question.concept,lesson.concept);
   assert.equal(lesson.exampleProblem,question.teaching.example.problem);
   assert.notEqual(lesson.exampleProblem,question.question,'Ejemplo filtró respuesta de evaluación');
   assert.deepEqual(Array.from(lesson.pairs,p=>p.answer),Array.from(question.teaching.example.steps.slice(0,3)));
  }
 }
});

test('Secuencias pedagógicas dinámicas se pueden completar, errar, reparar y retomar sin XP',()=>{
 const generated=S.lessons.filter(l=>l.generatedType);
 assert.ok(generated.length>=20);
 for(const l of generated){
  const draft=S.start(l);
  assert.ok(S.valid(draft));
  for(let k=0;k<3;k++)S.nextCard(draft);
  assert.equal(draft.stage,'match');
  S.choose(draft,1);assert.equal(S.check(draft),false);
  S.advance(draft);
  S.choose(draft,1);assert.equal(S.check(draft),true);
  S.advance(draft);
  S.choose(draft,2);assert.equal(S.check(draft),true);
  S.advance(draft);
  assert.equal(draft.stage,'complete');
  assert.ok(S.valid(JSON.parse(JSON.stringify(draft))));
  assert.equal(draft.correct,2);
  assert.equal(S.retry(draft),true);
 }
});
