import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync,readdirSync} from 'node:fs';
import {loadBanks} from '../scripts/load-banks.mjs';
const context=vm.createContext({window:{}});
vm.runInContext(readFileSync(new URL('../learning-core.js',import.meta.url),'utf8'),context);
const L=context.window.CachasteLearning;
const bank=[{id:'a',concept:'Fracciones',area:'Números',options:['1','2','3','4']},{id:'b',concept:'Fracciones',area:'Números',options:['1','2','3','4']},{id:'c',concept:'Fracciones',area:'Números',options:['1','2','3','4']},{id:'d',concept:'Áreas',area:'Geometría',options:['1','2','3','4']}];
const secure=id=>({id,correct:true,confidence:'seguro',assisted:false});
test('Todos los scripts y HTML compilados tienen sintaxis JavaScript válida',()=>{
 for(const file of readdirSync(new URL('../',import.meta.url))){
  if(file.endsWith('.js'))assert.doesNotThrow(()=>new vm.Script(readFileSync(new URL('../'+file,import.meta.url),'utf8'),{filename:file}));
  if(file.endsWith('.html'))for(const [i,m]of [...readFileSync(new URL('../'+file,import.meta.url),'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)].entries())assert.doesNotThrow(()=>new vm.Script(m[1],{filename:file+':'+i}));
 }
});
test('Dominio requiere dos ítems distintos seguros después del último error',()=>{
 const state=rows=>L.profile(bank,rows).find(x=>x.concept==='Fracciones').status;
 assert.equal(state([secure('a'),secure('a')]),'por comprobar');
 assert.equal(state([secure('a'),secure('b')]),'comprobado');
 assert.equal(state([secure('a'),secure('b'),{id:'c',correct:false}]),'por reforzar');
 assert.notEqual(state([{...secure('a'),assisted:true},secure('b')]),'comprobado');
 assert.notEqual(state([{...secure('a'),confidence:'azar'},secure('b')]),'comprobado');
 assert.notEqual(state([{...secure('a'),confidence:'sin-declarar'},{...secure('b'),confidence:'sin-declarar'}]),'comprobado');
});
test('Refuerzo cambia pregunta, conserva concepto y no repite el último intento',()=>{
 const history=[{id:'a',correct:false,confidence:'duda'}];
 const transfer=L.transfer(bank,history,history,10);
 assert.deepEqual(Array.from(transfer.map(q=>q.id)).sort(),['b','c']);
 assert.ok(transfer.every(q=>q.concept==='Fracciones'));
 assert.equal(L.transfer(bank,[...history,secure('b'),secure('c')],[...history,secure('b'),secure('c')],10).length,0);
});
test('Estudiar la solución no acredita dominio y exige nueva evidencia independiente',()=>{
 const guided={...secure('b'),afterStudy:true};
 const history=[secure('a'),guided];
 const original=JSON.stringify(history);
 const result=L.profile(bank,history).find(x=>x.concept==='Fracciones');
 assert.equal(result.status,'por reforzar');
 assert.equal(result.correct,2,'los aciertos siguen siendo aciertos');
 assert.equal(result.evidence.length,0);
 assert.equal(L.profile(bank,[...history,secure('c')])[0].status,'por comprobar');
 assert.equal(L.profile(bank,[...history,secure('c'),secure('a')])[0].status,'comprobado');
 assert.equal(JSON.stringify(history),original,'no reescribir intentos históricos');
});
test('El acierto tras estudiar genera transferencia del mismo concepto a otra familia',()=>{
 const row={...secure('a'),afterStudy:true};
 const result=L.transfer(bank,[row],[row],10);
 assert.deepEqual(Array.from(result.map(q=>q.id)).sort(),['b','c']);
 assert.ok(result.every(q=>q.concept==='Fracciones'));
});
test('Datos de sesión dañados se rechazan sin bloquear el arranque',()=>{
 for(const s of [null,{}, {mode:'full',ids:['a','a'],index:0,results:[]},{mode:'full',ids:['z'],index:0,results:[]},{mode:'full',ids:['a'],index:0.5,results:[]},{mode:'full',ids:['a'],index:0,results:[],selected:5}])assert.equal(L.validSession(s,bank,['full']),false);
 assert.equal(L.validSession({mode:'full',ids:['a'],index:0,results:[],selected:null},bank,['full']),true);
});
test('Bancos ampliados: claves de cálculos nuevas comprobadas por separado',()=>{
 const b=loadBanks();const m=id=>b.M2.find(q=>q.id===id);const key=q=>q.options[q.answer];
 const expected=['9','5','320 g','Ninguna','8','2','108 cm²','(−6,2)','5 m','3/4','6','36π cm³','15','60','3/8','0,271','0,5','2','1','No cambia','$208.080','$9.000','3√2','2','50°'];
 for(let i=0;i<25;i++){const q=m('M2-'+String(56+i).padStart(3,'0'));assert.ok(q);assert.equal(key(q),expected[i],q.id);}
 assert.ok(Math.abs(500*.8**2-320)<1e-10);assert.equal(6*5/2,15);assert.equal(5*4*3,60);assert.equal(6/16,3/8);assert.ok(Math.abs(1-.9**3-.271)<1e-12);assert.equal((130-100)/15,2);
 for(const q of b.M2.filter(q=>q.area==='Suficiencia de datos'))assert.equal(q.options.length,5);
});
test('Ciencias conserva históricos complementarios y dispone de 54+26 para cada mención',()=>{
 const all=loadBanks().Ciencias,eligible=all.filter(q=>q.examEligible!==false);
 assert.equal(all.length,206);assert.equal(eligible.length,181);
 for(const sub of ['Biología','Física','Química']){
  assert.ok(eligible.filter(q=>q.subject===sub&&q.module==='MC').length>=18);
  assert.ok(eligible.filter(q=>q.subject===sub&&q.module==='ME').length>=26);
 }
 assert.equal(eligible.filter(q=>q.module==='MTP').length,26);
 assert.equal(all.find(q=>q.id==='SCI-075').examEligible,false);
});
test('Refuerzo: cada concepto de M2 tiene transferencia y las 26 claves nuevas son correctas',()=>{
 const banks=loadBanks(),counts=new Map();
 assert.equal(new Set(banks.M2.slice(80).map(q=>q.answer)).size,4,'Claves nuevas distribuidas entre cuatro posiciones');
 for(const q of banks.M2)counts.set(q.concept,(counts.get(q.concept)||0)+1);
 for(const [concept,count]of counts)assert.ok(count>=2,concept);
 const expected=['2/7','12π cm²','x≥4','9','−1/4','3','x²−25','(x+10)/5','1','−4','x≤−4','35 cm²','15 cm','135°','(4,2)','5','5,5','0,7','$3.800','2,5 horas','Ambas juntas, ninguna por sí sola','Cada una por sí sola','1/9','49π cm²','16π cm²','7√3'];
 expected.forEach((key,i)=>{const q=banks.M2.find(q=>q.id==='M2-'+String(81+i).padStart(3,'0'));assert.equal(q.options[q.answer],key,q.id);assert.ok(q.explanations.every(t=>typeof t==='string'&&t.length>15),q.id);});
 assert.equal((4/7)*(3/6),2/7);assert.equal(120/360*6**2,12);assert.equal(17**2-8**2,15**2);assert.equal((1+3+8+12)/4,6);
 assert.equal(banks.Ciencias.filter(q=>q.concept==='Expresión de ADN introducido'&&q.examEligible!==false).length,2);
 const astronomy=['SCI-188','SCI-206'].map(id=>banks.Ciencias.find(q=>q.id===id));
 assert.ok(astronomy.every(q=>q.examEligible!==false&&q.teaching));
 assert.notEqual(astronomy[0].concept,astronomy[1].concept,'Evaluar evidencia de modelos y describir una elipse no certifican el mismo objetivo');
});
