import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const ctx=vm.createContext({});
vm.runInContext(readFileSync(new URL('../daily-gameplay.js',import.meta.url),'utf8'),ctx);
const G=ctx.CachasteGameplay;
const q={key:'M1:porcentajes',teaching:{example:{
 problem:'En un estanque hay 80 litros y se usa el 15%.',
 steps:[
  'Primero reconocemos el total inicial de agua y lo que representa el 15%.',
  'Calculamos 80 multiplicado por 15 y dividido por 100 para obtener 12 litros.',
  'Restamos 80 menos 12 y comprobamos que quedaron 68 litros en el estanque.'
 ]
}}};
const list=x=>Array.from(x);
test('Desafíos de pasos se construyen con texto pedagógico del banco, no con preguntas inventadas',()=>{
 const source=G.clean(q);
 assert.equal(source.length,3);
 const s=G.create(q);
 assert.equal(s.key,q.key);
 assert.deepEqual([...s.order].sort(),[0,1,2]);
 assert.notDeepEqual(list(s.order),[0,1,2]);
 assert.deepEqual(list(s.chosen),[]);
 assert.equal(s.tries,0);
 assert.equal(G.valid(q,s),true);
 assert.equal(G.create(q).order.join(','),s.order.join(','));
});
test('La respuesta requiere elegir todos los pasos en orden, permite error sin penalización y luego acierto',()=>{
 const state=G.create(q);
 for(let i=0;i<3;i++)assert.equal(G.choose(q,state,i),true);
 assert.equal(G.choose(q,state,0),false);
 assert.equal(G.check(q,state),false);
 assert.equal(state.tries,1);
 assert.equal(G.choose(q,state,0),false);
 assert.equal(G.reset(q,state),true);
 for(const index of state.order.map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v).map(x=>x.i))G.choose(q,state,index);
 assert.equal(G.check(q,state),true);
 assert.equal(state.tries,2);
 assert.equal(G.check(q,state),null);
 assert.equal(G.valid(q,JSON.parse(JSON.stringify(state))),true);
});
test('Deshacer funciona y estados inválidos o contenidos incompletos no se muestran ni acreditan dominio',()=>{
 const state=G.create(q);
 G.choose(q,state,1);assert.equal(state.chosen.length,1);
 assert.equal(G.undo(q,state),true);
 assert.equal(state.chosen.length,0);
 assert.equal(G.check(q,state),null);
 const noSequence={...q,teaching:{example:{steps:['Una idea corta','La otra']}}};
 assert.equal(G.create(noSequence),null);
 const forged=JSON.parse(JSON.stringify(state));forged.order=[0,0,2];
 assert.equal(G.valid(q,forged),false);
 assert.equal(G.check(q,forged),null);
});
