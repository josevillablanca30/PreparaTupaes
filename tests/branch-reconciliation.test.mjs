import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
const fixture=JSON.parse(readFileSync(new URL('../pedagogy/reconciliation-2026-10-18.json',import.meta.url)));
const {items}=dailyCatalog(), recovered=new Set(fixture.recovered.map(q=>q.id));
const sha=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const find=id=>items.find(q=>q.subjectKey==='M2'&&q.id===id);
test('Reconciliación: los 780 registros anteriores conservan identidad, preguntas, claves y familias',()=>{
 const prior=items.filter(q=>!(q.subjectKey==='M2'&&recovered.has(q.id))).map(q=>({id:q.id,key:q.key,question:q.question,options:q.options,answer:q.answer,concept:q.concept,family:q.family,examEligible:q.examEligible,supplementary:q.supplementary}));
 assert.equal(prior.length,780);assert.equal(sha(prior),fixture.previousAssessmentSha256);
});
test('Reconciliación: se recuperan las ocho evaluaciones de main con sus mismos IDs y claves',()=>{
 for(const entry of fixture.recovered){const q=find(entry.id);assert.ok(q,entry.id);assert.equal(sha([q.question,q.options,q.answer]),entry.assessmentSha256);assert.equal(q.recoveredFrom.commit,fixture.main);}
 assert.equal(items.length,788);assert.equal(new Set(items.map(q=>q.key)).size,788);
});
test('M2 recuperado: claves cuantitativas y rasgos de funciones se verifican por separado',()=>{
 const key=id=>{const q=find(id);return q.options[q.answer]};
 assert.equal((4-1)/(7-1),1/2);assert.equal(key('M2-107'),'1/2');
 const clp=n=>'$'+n.toLocaleString('es-CL',{minimumFractionDigits:2,maximumFractionDigits:2});
 assert.equal(key('M2-108'),clp(300000*1.01**3));
 assert.equal(850000*.1,85000);assert.equal(key('M2-109'),'$85.000');
 assert.equal(2400*(1-.2),1920);assert.equal(key('M2-110'),'1.920 UF');
 assert.equal((3*(3+5)/4)-4,2);assert.equal(key('M2-112'),'2');
 assert.equal(key('M2-111'),'2^x');assert.equal(2**0,1);assert.ok(2**(-10)<2**(-1)&&2**1<2**2);
 assert.equal(Math.log2(1),0);assert.ok(Math.log2(2)>Math.log2(1));assert.match(key('M2-113'),/x>0.*creciente.*vertical x=0/);
 assert.equal(200*.6**0,200);assert.equal(200*.6,120);assert.ok(200*.6**10>0&&200*.6**10<120);assert.match(key('M2-114'),/\(0, 200\).*disminuye.*y=0/);
 assert.match(find('M2-107').teaching.aim,/solo la probabilidad de la segunda/);
});
