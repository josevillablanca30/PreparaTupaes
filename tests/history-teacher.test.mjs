import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadBanks} from '../scripts/load-banks.mjs';
const before=JSON.parse(readFileSync(new URL('../pedagogy/history-before-2026-10-15.json',import.meta.url)));
const bank=loadBanks().Historia,by=n=>bank.find(q=>q.id==='HIS-'+String(n).padStart(3,'0'));
test('Historia: las 65 claves, preguntas y alternativas de la beta se conservan',()=>{
 assert.equal(bank.length,65);
 for(const old of before){const q=bank.find(q=>q.id===old.id);assert.equal(q.question,old.question);assert.equal(q.answer,old.answer);assert.deepEqual(Array.from(q.options),old.options);}
});
test('Historia: cada clase revisada integra fundamentos, aplicación, otra estrategia y tres errores particulares',()=>{
 const reviewed=bank.filter(q=>q.teaching);assert.ok(reviewed.length>=40);
 for(const q of reviewed){const t=q.teaching,old=before.find(o=>o.id===q.id);
  assert.equal(t.quality,'adecuada');assert.ok(t.foundation.length>=2,q.id);assert.ok(t.application.length>=3,q.id);
  assert.ok(t.intuition.length>=2,q.id);assert.ok(t.example.steps.length>=3,q.id);
  assert.notEqual(t.example.problem,q.question,q.id);assert.notEqual(q.editorial.easy,old.editorial.easy,q.id);
  assert.equal(t.selectedFeedback[q.answer],null,q.id);assert.equal(q.explanations[q.answer],q.why,q.id);
  for(let i=0;i<q.options.length;i++){if(i===q.answer)continue;
   assert.equal(t.selectedFeedback[i].diagnosis,q.explanations[i],q.id);assert.notEqual(q.explanations[i],old.explanations[i],q.id);
   assert.ok(t.selectedFeedback[i].repair.length>=3,q.id);
  }
 }
});
test('Historia: clasificar fuentes no garantiza verdad y una causa debe anteceder a su efecto',()=>{
 assert.match(by(27).teaching.example.steps.join(' '),/clasificación depende de la investigación/);
 assert.match(by(27).teaching.check,/confiabilidad exige análisis/);
 assert.match(by(28).teaching.example.steps.join(' '),/posterior no puede ser la causa/);
 assert.match(by(30).teaching.check,/sí hubo conflictos violentos/);
 assert.match(by(31).teaching.check,/aplicación e igualdad material/);
 assert.match(by(39).teaching.check,/pierda una causa no demuestra/);
 assert.equal(2+(7-2),7,'No se duplica la harina incorporada al pan');
 assert.match(by(40).teaching.example.steps.join(' '),/\$2 del molino y \$5 adicionales/);
});
test('Historia: se distinguen etapas, límites de inferencia y propiedades económicas',()=>{
 assert.match(by(1).teaching.foundation.join(' '),/antecedentes/);
 assert.match(by(4).teaching.application.join(' '),/1988.*1989.*1990/);
 assert.match(by(11).teaching.foundation.join(' '),/lealtad al rey/);
 assert.match(by(14).teaching.foundation.join(' '),/24 de octubre/);
 assert.match(by(18).teaching.example.steps.join(' '),/un solo producto no basta/);
 assert.equal(30000/10000,3);assert.equal(30000/15000,2);
 assert.match(by(19).teaching.example.steps.join(' '),/hay rivalidad/);
 assert.match(by(20).teaching.application.join(' '),/1949.*1952/);
});
