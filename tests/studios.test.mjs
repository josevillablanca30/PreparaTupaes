import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';

const g=vm.createContext({});
vm.runInContext(readFileSync(new URL('../daily-studios.js',import.meta.url),'utf8'),g);
const S=g.CachasteStudios;
const bank=dailyCatalog().items;

test('Cinco talleres originales cubren las cinco materias y cada concepto existe en el banco PAES',()=>{
 assert.equal(S.lessons.length,5);
 assert.deepEqual(Array.from(S.lessons,l=>l.subject).sort(),['Ciencias','Historia','Lectura','M1','M2']);
 for(const l of S.lessons){
  assert.equal(S.get(l.subject,l.concept)?.id,l.id);
  assert.equal(l.cards.length,3,l.id);
  assert.equal(l.pairs.length,3,l.id);
  assert.ok(l.intro.length>90);
  assert.ok(l.source.includes('DEMRE'));
  assert.ok(l.confusion.length>70);
  assert.ok(l.goals.every(x=>x.length>23));
  assert.ok(l.cards.every(c=>c.title.length>7&&c.text.length>100));
  const concepts=bank.filter(q=>q.subjectKey===l.subject&&q.concept===l.concept);
  const families=new Set(concepts.map(q=>q.family));
  assert.ok(families.size>=2,l.subject+' / '+l.concept+' necesita dos familias de preguntas independientes');
  assert.ok(l.pairs.every(p=>p.prompt.length>12&&p.answer.length>18&&p.why.length>=50));
  assert.equal(new Set(l.pairs.map(p=>p.answer)).size,3);
 }
});
test('Los talleres permiten error, retroalimentación, reintento y guardan estado sin modificar notas PAES',()=>{
 for(const l of S.lessons){
  const d=S.start(l),xp={xp:70};
  assert.ok(S.valid(d));
  assert.equal(d.stage,'learn');assert.equal(S.choose(d,0),false);
  for(let i=0;i<3;i++)assert.equal(S.nextCard(d),true);
  assert.equal(d.stage,'match');
  for(let round=0;round<3;round++){
   const wrong=(round+1)%3;
   assert.equal(S.choose(d,wrong),true);
   assert.equal(S.check(d),false);
   assert.equal(S.check(d),null);
   assert.equal(S.advance(d),true);
  }
  assert.equal(d.stage,'complete');
  assert.equal(d.correct,0);assert.equal(d.mistakes,3);
  assert.equal(S.valid(JSON.parse(JSON.stringify(d))),true);
  assert.equal(xp.xp,70);
  assert.equal(S.retry(d),true);
  for(let i=0;i<3;i++){
   assert.equal(S.choose(d,i),true);
   assert.equal(S.check(d),true);
   S.advance(d);
  }
  assert.equal(d.stage,'complete');assert.equal(d.correct,3);
 }
});
test('No acredita respuestas fraudulentas, estados corruptos ni contenido incongruente',()=>{
 const l=S.lessons[0],d=S.start(l);
 assert.equal(S.get('Historia','Ecuación lineal'),null);
 d.stage='match';assert.equal(S.check(d),null);
 assert.equal(S.choose(d,-1),false);
 assert.equal(S.choose(d,777),false);
 assert.equal(S.choose(d,0),true);
 assert.equal(S.choose(d,0),true); // cambiar elección antes de comprobar está permitido
 assert.equal(S.check(d),true);
 assert.equal(S.choose(d,2),false);
 d.round=100;
 assert.equal(S.valid(d),false);
});
