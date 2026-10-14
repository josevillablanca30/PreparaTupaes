import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const ctx={window:{}};vm.createContext(ctx);
for(const name of ['reading-bank.js','history-bank.js','m2-bank.js','science-bank.js']){
 vm.runInContext(readFileSync(new URL('../'+name,import.meta.url),'utf8'),ctx,{filename:name});
}
const w=ctx.window;
test('Lectura: 100 preguntas y 20 textos, con tutor y evidencias editoriales',()=>{
 assert.equal(w.READING_PASSAGES.length,20);
 assert.equal(w.READING_QUESTIONS.length,100);
 const passages=new Map(w.READING_PASSAGES.map(p=>[p.id,p]));
 for(const [i,q] of w.READING_QUESTIONS.entries()){
  assert.equal(q.id,'LEC-'+String(i+1).padStart(3,'0'));
  assert.ok(passages.has(q.passageId),q.id+' sin texto');
  assert.equal(q.options.length,4,q.id+' alternativas');
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,q.id+' clave');
  assert.equal(new Set(q.options).size,4,q.id+' distractores repetidos');
  assert.equal(q.reviewStatus,'revisado_con_evidencia_textual',q.id+' sin pasada editorial');
  assert.ok(Array.isArray(q.steps)&&q.steps.length>=3,q.id+' pasos');
  assert.ok(q.steps.every(s=>s.trim().length>=30),q.id+' paso genérico');
  assert.ok(q.easy?.trim().length>=35,q.id+' explicación simple');
  assert.ok(q.example?.trim().length>=40,q.id+' ejemplo');
 }
});
test('Historia: 65 preguntas con tutor editorial y claves únicas',()=>{
 assert.equal(w.CACHASTE_HISTORIA.length,65);
 for(const [i,q] of w.CACHASTE_HISTORIA.entries()){
  assert.equal(q.id,'HIS-'+String(i+1).padStart(3,'0'));
  assert.ok(q.options[q.answer],q.id+' sin respuesta');
  assert.equal(new Set(q.options).size,q.options.length,q.id+' opciones repetidas');
  assert.ok(q.editorial?.steps?.length>=3,q.id+' pasos editoriales');
  assert.ok(q.editorial?.easy?.length>=30,q.id+' explicación fácil');
  assert.ok(q.editorial?.example?.length>=30,q.id+' ejemplo');
 }
});
test('Ciencias: 166 preguntas con respuestas y tres modos de tutor',()=>{
 assert.equal(w.SCIENCE_BANK.length,166);
 for(const [i,q] of w.SCIENCE_BANK.entries()){
  assert.equal(q.id,'SCI-'+String(i+1).padStart(3,'0'));
  assert.ok(q.options[q.answer],q.id+' clave');
  assert.ok(q.steps?.length>=2,q.id+' pasos');
  assert.ok(q.easy?.trim().length>=15,q.id+' fácil');
  assert.ok(q.example?.trim().length>=15,q.id+' ejemplo');
 }
});
