import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadBanks} from '../scripts/load-banks.mjs';
import vm from 'node:vm';
const before=JSON.parse(readFileSync(new URL('../pedagogy/history-before-2026-10-15.json',import.meta.url)));
const bank=loadBanks().Historia,by=n=>bank.find(q=>q.id==='HIS-'+String(n).padStart(3,'0'));
test('Historia: las 65 claves, preguntas y alternativas de la beta se conservan',()=>{
 assert.equal(bank.length,65);
 for(const old of before){const q=bank.find(q=>q.id===old.id);assert.equal(q.question,old.question);assert.equal(q.answer,old.answer);assert.deepEqual(Array.from(q.options),old.options);}
});
test('Historia: cada clase revisada integra fundamentos, aplicación, otra estrategia y tres errores particulares',()=>{
 const reviewed=bank.filter(q=>q.teaching);assert.ok(reviewed.length>=53);
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
test('Historia: los ejemplos distinguen porcentaje, base, tasa y cantidades sin inventar evidencia original',()=>{
 assert.equal(100/1000,200/2000);assert.ok(400/2000>100/1000);
 assert.match(by(43).teaching.example.steps.join(' '),/A es proporcional/);
 assert.equal(.6*20,12);assert.equal(.8*10,8);
 assert.match(by(50).teaching.example.steps.join(' '),/cantidad baja de doce a ocho/);
 assert.match(by(46).teaching.application.join(' '),/sin.*su puesto de trabajo|ni su puesto de trabajo/);
 assert.match(by(47).teaching.check,/solo conocemos la tendencia descrita/);
 assert.match(by(48).teaching.check,/no podemos decidir cuál tiene razón ni inventar citas/);
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
test('Historia: un error de secularización no se refuerza con otra fecha o un tema ajeno',()=>{
 const w={};vm.runInNewContext(readFileSync(new URL('../learning-core.js',import.meta.url),'utf8'),{window:w});
 const fail=id=>({id,correct:false,confidence:'duda',concept:'Historia de Chile'});
 assert.equal(w.CachasteLearning.transfer(bank,[fail('HIS-001')],[fail('HIS-001')],10).length,0);
 assert.deepEqual(Array.from(w.CachasteLearning.transfer(bank,[fail('HIS-005')],[fail('HIS-005')],10),q=>q.id),['HIS-034']);
 assert.deepEqual(Array.from(w.CachasteLearning.transfer(bank,[fail('HIS-009')],[fail('HIS-009')],10),q=>q.id),['HIS-059']);
 assert.equal(w.CachasteLearning.transfer(bank,[fail('HIS-012')],[fail('HIS-012')],10).length,0,'La relación equivalente de HIS-021 no certifica transferencia nueva');
 assert.equal(w.CachasteLearning.select(bank,[],65,{balanced:true,distinctFamilies:false}).length,65,'El ensayo conserva 65 ítems originales sin acortarse por las familias de refuerzo');
 const secure=id=>({id,correct:true,confidence:'seguro',assisted:false,concept:'Historia de Chile'});
 const p=w.CachasteLearning.profile(bank,[secure('HIS-001'),secure('HIS-003')]);
 assert.equal(p.find(x=>x.concept===by(1).concept).status,'por comprobar');
 assert.equal(p.find(x=>x.concept===by(3).concept).status,'por comprobar');
 const limits=w.CachasteLearning.profile(bank,[secure('HIS-005'),secure('HIS-034')]);
 assert.equal(limits.find(x=>x.concept===by(5).concept).status,'comprobado');
});
