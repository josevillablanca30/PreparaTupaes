import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const context={window:{}};vm.createContext(context);
for(const name of ['m2-bank.js','science-bank.js'])vm.runInContext(readFileSync(new URL('../'+name,import.meta.url),'utf8'),context,{filename:name});
// Claves independientes transcritas después de comprobar operaciones y condiciones
// de los 55 enunciados de M2. Este control detecta regresiones; no certifica temario.
const expected=["x=2","6","3/10","0,2","3π","5","8","7","$121.000","3","x≥5","8","25","1/8","3/10","-1/2","5","3","x²-9","1600","6","7","x=-4","12","(x+6)/3","7","8","3","0","x>4","20","13","5","120°","(5,3)","1/2","5","7","2/5","0","$3200","120","y=-2x+3","$1100","90","Cada una por sí sola","Ambas juntas, ninguna por sí sola","Solo (2)","Ambas juntas, ninguna por sí sola","Se requiere información adicional","Cada una por sí sola","9","1/6","25π","100"];
test('M2: 56 claves matemáticas revisadas y distractores distintos',()=>{
 const bank=context.window.CACHASTE_M2;assert.equal(bank.length,114);
 for(let i=0;i<expected.length;i++){
  const q=bank[i];assert.equal(q.id,'M2-'+String(i+1).padStart(3,'0'));
  assert.equal(q.options[q.answer],expected[i],q.id+' respuesta incorrecta');
  assert.equal(q.options.filter(x=>x===expected[i]).length,1,q.id+' clave duplicada');
  assert.ok(q.why?.trim().length>=20||q.editorial?.steps?.length>=3,q.id+' justificación insuficiente');
 }
 assert.deepEqual(Array.from(bank.slice(-8),q=>q.options[q.answer]),['1/2','$309.090,30','$85.000','1.920 UF','2^x','2','Su dominio es x>0, es creciente y tiene asíntota vertical x=0.','Parte en (0, 200), disminuye y se acerca a y=0 sin tocarla.']);
});
test('Ciencias: Aa x Aa distingue genotipo 1:2:1 y fenotipo 3:1',()=>{
 const q=context.window.SCIENCE_BANK.find(x=>x.id==='SCI-043');
 assert.ok(q);assert.match(q.options[q.answer],/1 AA : 2 Aa : 1 aa/);
 assert.match(q.explanations[1],/fenotip/i);
 assert.match(q.easy,/genotíp/i);
 assert.match(q.steps.join(' '),/AA, Aa, aA y aa/);
 assert.match(q.example,/Tt se cruza con tt/);
 assert.match(q.example,/cada una con probabilidad 1\/2/);
 assert.match(q.example,/probabilidades por descendiente/);
 assert.equal(q.examEligible,false);
});
