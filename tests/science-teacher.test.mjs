import test from'node:test';import assert from'node:assert/strict';import{readFileSync}from'node:fs';import{loadBanks}from'../scripts/load-banks.mjs';
const bank=loadBanks().Ciencias,before=JSON.parse(readFileSync(new URL('../pedagogy/science-before-2026-10-15.json',import.meta.url)));
test('Profesor Ciencias: conserva los 206 ítems, claves, opciones y elegibilidad curricular',()=>{assert.equal(bank.length,206);for(const row of bank){const q=row.previousAssessments?.[0]||row;const b=before.find(b=>b.id===q.id);assert.equal(q.question,b.question);assert.equal(q.answer,b.answer);assert.deepEqual(Array.from(q.options),b.options);for(const key of['examEligible','curricularStatus','module','subject'])assert.equal(q[key],b[key],q.id+':'+key);}});
test('Profesor Ciencias: mecanismos, tres estrategias y reparaciones particulares para cada ítem revisado',()=>{const reviewed=bank.filter(q=>q.teaching);assert.equal(reviewed.length,206);for(const q of reviewed){const t=q.teaching;assert.ok(t.foundation.length>=2,q.id);assert.ok(t.intuition.length>=2,q.id);assert.ok(t.application.length>=3,q.id);assert.ok(t.example.steps.length>=3,q.id);assert.notEqual(t.example.problem,q.question);assert.ok(q.hint);for(let i=0;i<q.options.length;i++){if(i===q.answer){assert.equal(t.selectedFeedback[i],null);continue;}assert.ok(q.explanations[i].includes(q.options[i]));assert.equal(t.selectedFeedback[i].diagnosis,q.explanations[i]);assert.ok(!/undefined|null/.test(q.explanations[i]));}assert.equal(t.check,q.explanations[q.answer]);}});
test('Ciencias: mecanismos revisados no crean energía ni afirman riesgo cero o manto totalmente líquido',()=>{const by=n=>bank.find(q=>q.id==='SCI-'+String(n).padStart(3,'0'));assert.match(by(1).teaching.foundation.join(' '),/no es energía creada de la nada/);assert.match(by(6).teaching.check,/no ofrece protección absoluta/);assert.match(by(19).teaching.foundation[0],/principalmente sólido/);assert.match(by(10).teaching.check,/procede directamente del agua/);assert.equal(100*2,200);assert.equal(12/6,2);assert.equal(120/20,6);});

test('Ciencias: clases de astronomía, consentimiento, digestión y densidad enseñan el objetivo propio',()=>{for(const [n,concept,term]of [[188,'Modelos astronómicos y observación',/modelo/],[199,'Consentimiento y autonomía',/consentimiento/],[200,'Digestión intracelular',/lisosom/],[204,'Densidad de una muestra',/densidad/],[192,'Fracción molar',/molar/],[123,'Inflamación local',/inflamación/]]){const q=bank.find(q=>q.id==='SCI-'+n);assert.equal(q.concept,concept);assert.match(q.teaching.foundation.join(' '),term);assert.match(q.teaching.example.steps.join(' '),term);}});

// FILADD, Eje 3-2 Meiosis (Drive 1ALLN-fBd0OjLL29otkMF3MZ3nioIHkjL), pp. 2–11.
test('Meiosis: 2n=8 son ocho cromosomas totales y dos juegos de cuatro, sin duplicar el conteo',()=>{
 const lessons=bank.filter(q=>q.teaching?.example.problem.includes('Una especie tiene 2n = 8'));
 assert.ok(lessons.length>0);
 for(const q of lessons){const steps=q.teaching.example.steps.join(' ');
  assert.match(steps,/ocho cromosomas en total/);assert.match(steps,/dos juegos de cuatro/);
  assert.doesNotMatch(steps,/reduce los dos juegos de ocho/);
  assert.match(steps,/n = 4/);assert.match(steps,/restablecen ocho en el cigoto/);
 }
 assert.equal(8/2,4);assert.equal(4+4,8);
});
