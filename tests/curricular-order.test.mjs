import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';

const c=vm.createContext({});
vm.runInContext(readFileSync(new URL('../daily-curriculum.js',import.meta.url),'utf8'),c);
const C=c.CachasteCurriculum;
const {items}=dailyCatalog();

test('Historia sigue la secuencia de grandes bloques cotejada con bitácoras CPECH y temario DEMRE',()=>{
 const names=Array.from(C.course(items,'Historia'),u=>u.name);
 assert.deepEqual(names,['Historia mundial','Historia de Chile','Interpretación de fuentes','Formación ciudadana','Economía y sociedad']);
 const world=C.course(items,'Historia')[0].levels.map(l=>l.objective);
 assert.equal(world[0],'Razón y crítica ilustrada');
 assert.ok(world.indexOf('Igualdad jurídica en 1789')<world.indexOf('Industrialización y urbanización'));
 assert.ok(world.indexOf('Industrialización y urbanización')<world.indexOf('Imperialismo y dominio colonial'));
 assert.ok(world.indexOf('Guerra Fría')>world.indexOf('Gran Depresión de 1929'));
});

test('M1 empieza con números de enseñanza media, no con contar objetos',()=>{
 const names=Array.from(C.course(items,'M1'),u=>u.name);
 assert.deepEqual(names.slice(0,4),['Enteros','Racionales','Potencias','Raíces']);
 assert.ok(names.indexOf('Álgebra')>names.indexOf('Raíces'));
 assert.ok(names.indexOf('Geometría')>names.indexOf('Ecuaciones'));
});

test('Lectora progresa por habilidades PAES y Ciencias conserva la organización por áreas',()=>{
 assert.deepEqual(Array.from(C.course(items,'Lectura'),u=>u.name),['Información explícita','Relaciones y sentido','Lectura crítica']);
 const science=Array.from(C.course(C.sciencePool(items,'Biología'),'Ciencias'),u=>u.name);
 assert.equal(science[0],'Organización, estructura y actividad celular');
 assert.ok(science.indexOf('Herencia y evolución')>science.indexOf('Procesos y funciones biológicas'));
 assert.ok(science.includes('Mecánica'));
 assert.ok(science.includes('Estructura atómica'));
});

test('El panorama del 1.º a 4.º medio está declarado para las cinco materias sin inventar cobertura del banco',()=>{
 for(const subject of Object.keys(C.subjects)){
  const scope=C.secondaryScope[subject];
  assert.ok(Array.isArray(scope)&&scope.length>=4,subject);
  for(const section of scope){
   assert.ok(section.title.length>=5,subject);
   assert.ok(section.topics.length>=50,subject);
  }
 }
 assert.deepEqual(Array.from(C.secondaryScope.Historia,s=>s.title),[
  'Historia mundial','Historia de Chile y América','Interpretación de fuentes históricas','Formación ciudadana','Sistema económico'
 ]);
});
