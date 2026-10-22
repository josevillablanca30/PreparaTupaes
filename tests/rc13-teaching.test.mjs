import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';

test('La transferencia sobre huelga enseña a contrastar testimonios y conserva su identidad y evaluación',()=>{
 const {items}=dailyCatalog(),q=items.find(q=>q.key==='Historia:TR-HIS-018');
 assert.equal(q.concept,'Evidencias de cambios territoriales'); // Legacy progress identifier.
 assert.match(q.question,/huelga/);
 assert.match(q.options[q.answer],/Comparar autoría, contexto/);
 assert.ok(q.teaching.foundation.some(s=>/fuente|perspectiva|testimonio/i.test(s)));
 assert.doesNotMatch(JSON.stringify([q.teaching.foundation,q.teaching.intuition,q.teaching.example]),/tu pregunta fronteriza|cambió una frontera|Con fronteras sucede/);
 assert.equal(items.length,802);
});

test('La notación ceil se explica antes de evaluar el cálculo de percentiles',()=>{
 const q=dailyCatalog().items.find(q=>q.key==='M1:TR-M1-024');
 assert.ok(q.teaching.foundation.some(s=>s.includes('ceil(4,2) = 5')&&s.includes('ceil(4) = 4')));
 assert.equal(q.options[q.answer],'28 min');
});
