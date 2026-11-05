import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LocalDuel,pickQuestions,SUBJECTS,QUESTION_MS} from '../beta/local-duel.mjs';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
const catalog=dailyCatalog();
const options={subject:'M1',players:[{nickname:'Prueba_A'},{nickname:'Prueba_B'}]};
const make=()=>{const d=new LocalDuel(catalog);d.create(options);return d;};
const turn=(d,correct,start,elapsed)=>{d.begin(start);for(let i=0;i<10;i++){const q=d.question();d.answer(i<correct?q.answer:(q.answer+1)%q.options.length,start+(i+1)*elapsed);}};

test('Every subject and all science tracks offer ten eligible questions from different original families',()=>{
 for(const subject of Object.keys(SUBJECTS))for(const track of subject==='Ciencias'?['Biología','Física','Química']:['']){
  const q=pickQuestions(catalog.items,subject,track);assert.equal(q.length,10);assert.equal(new Set(q.map(q=>q.family)).size,10);
  assert(q.every(q=>q.subjectKey===subject&&!q.supplementary&&q.examEligible!==false&&(subject!=='Ciencias'||q.subject===track)));
 }
});
test('Solutions and results stay unavailable until both finish; saved handoff contains the same questions',()=>{
 const d=make(),keys=[...d.state.keys];assert.equal(d.result(),null);assert.deepEqual(d.review(0),[]);
 turn(d,7,1000,2000);assert.equal(d.state.phase,'handoff');assert.equal(d.result(),null);assert.deepEqual(d.review(0),[]);
 const restored=new LocalDuel(catalog,JSON.parse(JSON.stringify(d.state)));assert.deepEqual(restored.state.keys,keys);
 turn(restored,8,100000,4000);assert.equal(restored.state.phase,'finished');assert.equal(restored.result().winner,1);assert.equal(restored.result().reason,'correct');assert.equal(restored.review(0).length,10);
});
test('Accuracy decides before time; equal accuracy uses rounded tenths and a full tie stays a draw',()=>{
 const d=make();turn(d,8,1000,1000);turn(d,9,200000,2000);assert.equal(d.result().winner,1);assert.equal(d.result().reason,'correct');
 const fast=make();turn(fast,8,1000,1000);turn(fast,8,200000,2000);assert.equal(fast.result().winner,0);assert.equal(fast.result().reason,'time');
 const tie=make();turn(tie,8,1000,1000);turn(tie,8,200000,1000);assert.equal(tie.result().winner,null);assert.equal(tie.result().reason,'draw');
});
test('Expired questions record no answer, retain the absolute deadline across reload and await readiness',()=>{
 const d=make();d.begin(1000);const copy=new LocalDuel(catalog,JSON.parse(JSON.stringify(d.state)));
 assert.equal(copy.remaining(11000),80000);assert.equal(copy.answer(copy.question().answer,1000+QUESTION_MS),true);
 assert.equal(copy.state.phase,'timeout');assert.equal(copy.state.answers[0][0].choice,null);assert.equal(copy.state.answers[0][0].elapsedMs,QUESTION_MS);
 assert.equal(copy.answer(0,200000),false);assert.equal(copy.state.answers[0].length,1);copy.begin(200000);assert.equal(copy.remaining(200000),QUESTION_MS);
});
test('Local names and restored data cannot inject markup, repeat players or resume a malformed turn',()=>{
 const d=new LocalDuel(catalog);assert.throws(()=>d.create({...options,players:[{nickname:'<img>'},{nickname:'Prueba_B'}]}));
 assert.throws(()=>d.create({...options,players:[{nickname:'Prueba'},{nickname:'prueba'}]}));
 d.create(options);const s=JSON.parse(JSON.stringify(d.state));s.phase='finished';assert.throws(()=>new LocalDuel(catalog,s));
 s.phase='versus';s.keys[0]=s.keys[1];assert.throws(()=>new LocalDuel(catalog,s));
});
