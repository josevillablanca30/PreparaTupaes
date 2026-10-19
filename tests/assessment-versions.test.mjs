import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadBanks} from '../scripts/load-banks.mjs';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
const ctx=vm.createContext({});
vm.runInContext(readFileSync(new URL('../learning-core.js',import.meta.url),'utf8'),ctx);
const L=ctx.CachasteLearning;
const question=()=>({id:'a',question:'¿Cuánto es 2 + 3?',options:['5','6','7','8'],answer:0,concept:'Suma',transferGroup:'suma-a'});
test('La huella offline coincide con SHA-256 para Unicode y varios bloques',()=>{
 for(const text of ['', 'abc', '¿Cachaste? 🐱 · x² ≥ 3', 'a'.repeat(55),'a'.repeat(56),'b'.repeat(64),'contenido '.repeat(1000)]){
  assert.equal(L.contentHash(text),createHash('sha256').update(text).digest('hex'));
 }
});
test('La versión distingue evaluaciones pero permite mejorar el tutor sin invalidar respuestas',()=>{
 const q=question(),version=L.assessmentVersion(q);
 assert.match(version,/^a1-[a-f0-9]{64}$/);
 assert.equal(L.assessmentVersion({...q,explanations:['nueva explicación'],teaching:{revision:'nueva'}}),version);
 for(const change of [{question:'¿Cuánto es 3 + 2?'},{options:['6','5','7','8']},{answer:1},{concept:'Resta'},{transferGroup:'otra-familia'},{visual:{type:'bar',value:3}}]){
  assert.notEqual(L.assessmentVersion({...q,...change}),version);
 }
 q.options[0]='otra alternativa';assert.notEqual(L.assessmentVersion(q),version,'la caché no oculta cambios del objeto');
});
test('Cambiar un pasaje con el mismo ID cambia la evaluación lectora',()=>{
 const q={...question(),passageId:'p'},passages=[{id:'p',title:'Título',paragraphs:['Primera evidencia.']}];
 L.bindPassages([q],passages);const before=L.assessmentVersion(q);
 passages[0].paragraphs[0]='Evidencia distinta.';L.bindPassages([q],passages);
 assert.notEqual(L.assessmentVersion(q),before);
});
test('Una respuesta versionada incompatible no se convierte en dominio del contenido nuevo',()=>{
 const a=question(),b={...a,id:'b',transferGroup:'suma-b'};
 const history=[a,b].map(q=>({id:q.id,correct:true,confidence:'seguro',selected:0,assessmentVersion:L.assessmentVersion(q)}));
 assert.equal(L.profile([a,b],history)[0].status,'comprobado');
 const before=JSON.stringify(history);a.options=['10','11','12','13'];
 assert.equal(L.profile([a,b],history)[0].status,'por comprobar');
 assert.equal(L.compatibleAttempt(a,history[0]),false);
 assert.equal(JSON.stringify(history),before,'no recalificar ni borrar intentos');
 assert.equal(L.compatibleAttempt(a,{id:'a',correct:true}),true,'compatibilidad transitoria del historial sin versión');
});
test('Las cinco materias y su catálogo diario generan la misma versión de cada original',()=>{
 const banks=loadBanks(),{items}=dailyCatalog();let checked=0;
 for(const [subject,bank] of Object.entries(banks)){
  if(subject==='texts')continue;
  for(const q of bank){const daily=items.find(x=>x.subjectKey===subject&&x.id===String(q.id));assert.ok(daily);
   assert.equal(L.assessmentVersion(q),L.assessmentVersion(daily),subject+':'+q.id);checked++;
  }
 }
 assert.equal(checked,631);
 assert.equal(new Set(items.map(q=>q.subjectKey+':'+L.assessmentVersion(q))).size,788);
});
test('La limpieza no recorta el índice histórico al reducir opciones de otra versión',()=>{
 const q=question(),row={id:q.id,selected:3,correct:false,assessmentVersion:L.assessmentVersion(q)};
 q.options=['5','6'];
 const cleaned=L.cleanRows([q],[row]);
 assert.equal(cleaned[0].selected,3);assert.equal(cleaned[0].correct,false);
 assert.equal(cleaned[0].assessmentVersion,row.assessmentVersion);
 assert.equal(L.cleanRows([q],[{id:q.id,selected:3,correct:false}])[0].selected,null,'se conserva el saneamiento legado');
});
