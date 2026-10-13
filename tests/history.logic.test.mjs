import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const src=readFileSync(new URL('../history-bank.js',import.meta.url),'utf8');
const app=readFileSync(new URL('../history-app.js',import.meta.url),'utf8');
test('Historia: banco de 65 preguntas originales, cuatro opciones y explicaciones',()=>{
 const window={};vm.runInNewContext(src,{window});const bank=window.CACHASTE_HISTORIA;
 assert.equal(bank.length,65);assert.equal(new Set(bank.map(q=>q.id)).size,65);
 const distribution=Object.fromEntries([...new Set(bank.map(q=>q.area))].map(area=>[area,bank.filter(q=>q.area===area).length]));
 assert.ok(Object.values(distribution).every(count=>count>=5),JSON.stringify(distribution));
 for(const q of bank){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.why.length>25);assert.ok(q.hint.length>20);assert.equal(q.origin,'original')}
});
test('Historia: sesión guardada independiente de otras materias',()=>{
 assert.match(app,/cachaste-history-v1/);assert.match(app,/localStorage\.setItem/);
 assert.match(app,/No equivale a puntaje PAES oficial/);
});
test('Historia: auditoría de hechos históricos, ciudadanía, economía y análisis de fuentes',()=>{
 const window={};vm.runInNewContext(src,{window});
 const bank=window.CACHASTE_HISTORIA;
 const checks=[
  [1,'1925','Iglesia y Estado'],[3,'1973','golpe de Estado'],[4,'1990','Patricio Aylwin'],
  [5,'autoridades','Estado de derecho'],[6,'Congreso','leyes'],
  [11,'18 de septiembre','1810'],[14,'1945','Naciones Unidas'],
  [20,'sufragio femenino','1952'],[23,'1891','predominio parlamentario'],
  [24,'1939','industrialización'],[26,'1988','opción No'],
  [30,'Guerra Fría','URSS'],[31,'1789','Igualdad jurídica'],
  [41,'oferta','disminuir'],[43,'progresivo','tasa efectiva'],
  [46,'carta de 1900','percibía'],[47,'matrícula','creció'],
  [51,'ferrocarril','transporte'],[52,'1914','Francisco Fernando'],
  [55,'70%','siete de cada diez'],[56,'Araucanía','mapuche'],
  [57,'Marshall','Europa occidental'],[61,'1971','gran minería del cobre'],
  [62,'1929','crisis económica'],[65,'desempleados','fuerzas laborales']
 ];
 for(const [number,stem,answer] of checks){
  const id='HIS-'+String(number).padStart(3,'0');
  const q=bank.find(q=>q.id===id);
  assert.ok(q,id);assert.ok(q.question.includes(stem),id+' enunciado');
  assert.ok(q.options[q.answer].includes(answer),id+' clave');
  assert.ok(q.why.length>40,id+' explicación');
 }
 assert.equal(checks.length,25);
 assert.equal(bank.filter(q=>q.question.toLowerCase().includes('costo de oportunidad')).length,2);
});
