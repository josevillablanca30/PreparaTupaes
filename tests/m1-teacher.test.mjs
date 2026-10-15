import test from 'node:test';import assert from 'node:assert/strict';import{readFileSync}from'node:fs';import vm from'node:vm';import{loadBanks}from'../scripts/load-banks.mjs';
const bank=loadBanks().M1,old=JSON.parse(readFileSync(new URL('../pedagogy/m1-before-2026-10-15.json',import.meta.url))),by=id=>bank.find(q=>q.id===id);
test('M1 profesor conserva las 116 preguntas, claves, alternativas y gráficos',()=>{assert.equal(bank.length,116);for(const q of bank){const before=old.find(o=>o.id===q.id);assert.equal(q.q,before.q);assert.equal(q.answer,before.answer);assert.deepEqual(Array.from(q.options),before.options);assert.equal(JSON.stringify(q.visual),JSON.stringify(before.visual));}});
test('M1: clases completas y diagnóstico correspondiente a cada distractor del lote',()=>{
 const reviewed=bank.filter(q=>q.teaching);assert.ok(reviewed.length>=40);for(const q of reviewed){const t=q.teaching;assert.equal(t.quality,'adecuada');assert.ok(t.foundation.length>=2,q.id);assert.ok(t.application.length>=3,q.id);assert.ok(t.intuition.length>=2,q.id);assert.ok(t.example.steps.length>=3,q.id);assert.ok(t.check);assert.notEqual(t.example.problem,q.q);assert.equal(t.selectedFeedback[q.answer],null);assert.equal(q.explanations[q.answer],t.check);
 for(let i=0;i<q.options.length;i++){if(i===q.answer)continue;const text=q.explanations[i];assert.ok(!/undefined|null/.test(text),q.id+':'+i);assert.ok(text.includes(q.options[i]),q.id+':'+i);assert.equal(t.selectedFeedback[i].diagnosis,text);assert.ok(!text.includes('¡Cachaste!'));}
 }});
test('M1: comprobaciones reparan cálculos incorrectamente atribuidos y comparan todas las fracciones',()=>{
 assert.match(by(200).explanations[0],/restar tres a −5/);assert.equal(-5-3,-8);
 assert.match(by(202).explanations[1],/No puede aumentar/);assert.equal(-5000+13000-2000,6000);
 assert.match(by(208).explanations[2],/15.360/);assert.equal(19200*.8,15360);
 assert.match(by(205).teaching.application.join(' '),/54\/90.*60\/90.*50\/90.*45\/90/);
 assert.match(by(113).explanations[2],/5.250/);assert.equal(1200+450*9,5250);
});
test('Profesor compartido escapa HTML y acepta el modo antiguo sin ejecutar contenido',()=>{const w={};vm.runInNewContext(readFileSync(new URL('../learning-core.js',import.meta.url),'utf8'),{window:w});const q=JSON.parse(JSON.stringify(by(1)));q.teaching.aim='<img src=x onerror=alert(1)>';const markup=w.CachasteLearning.lesson(q,'steps');assert.ok(markup.includes('&lt;img'));assert.ok(!markup.includes('<img'));assert.equal(w.CachasteLearning.lesson(q,'basic'),w.CachasteLearning.lesson(q,'easy'));});
