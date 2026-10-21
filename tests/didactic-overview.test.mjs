import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
const c={};
for(const f of ['learning-core.js','daily-demonstrations.js','daily-scenarios.js','daily-topic-visuals.js','daily-lessons.js'])vm.runInNewContext(readFileSync(f,'utf8'),c);
const P=c.CachasteLessons,items=dailyCatalog().items;
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
test('Las cinco asignaturas componen idea, modelo y práctica con el material integrado, sin modificarlo',()=>{
 for(const q of items){
  const before=JSON.stringify(q),v=P.draft(q,{}),html=P.overview(q,v);
  for(const name of ['Idea clave','Modelo visual','Mini práctica'])assert.ok(html.includes('aria-label="'+name+'"'),q.key+' '+name);
  for(const paragraph of [q.teaching.aim,...q.teaching.foundation])assert.ok(html.includes(esc(paragraph)),q.key+' fundamento omitido');
  assert.ok(P.modelSupport(q,v).includes('data-lesson-card='),q.key);
  assert.equal(JSON.stringify(q),before,q.key+' cambió contenido');
 }
});
test('Los controles de modelo y mini práctica mantienen estados distintos y reanudables',()=>{
 for(const subject of ['M1','M2','Lectura','Historia','Ciencias']){
  const q=items.find(q=>q.subjectKey===subject&&P.deck(q).cards.some(c=>c.kind==='probe'));
  const holder={results:[],attempts:[],xp:0},v=P.draft(q,holder),cards=P.deck(q).cards,probe=cards.findIndex(c=>c.kind==='probe');
  P.actAt(q,v,probe,'choose',cards[probe].answer);
  assert.equal(v.card,0);assert.equal(v.selected[probe],cards[probe].answer);
  assert.match(P.overview(q,v),/visual-response right/);
  const restored=JSON.parse(JSON.stringify(holder));assert.equal(P.draft(q,restored).selected[probe],cards[probe].answer);
  assert.deepEqual(holder.results,[]);assert.deepEqual(holder.attempts,[]);assert.equal(holder.xp,0);
 }
});
test('El ejemplo guiado se revela dentro de la vista general y no avanza el recorrido',()=>{
 const q=items.find(q=>!P.deck(q).cards.some(c=>c.kind==='probe')),v=P.draft(q,{}),at=P.deck(q).cards.findIndex(c=>c.kind==='worked');
 P.actAt(q,v,at,'reveal-all');assert.equal(v.card,0);
 for(const text of q.teaching.example.steps)assert.ok(P.overview(q,v).includes(esc(text)));
 P.actAt(q,v,-1,'next');assert.equal(v.card,0);
});
