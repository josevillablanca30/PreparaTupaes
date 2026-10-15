import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const dashboard=read('inicio.html');
const script=dashboard.match(/<script>([\s\S]*?)<\/script>/)?.[1];
function openHome(data=new Map()){
 const rendered={'m1-progress':{textContent:'Aún sin practicar'},'science-progress':{textContent:'Aún sin practicar'},'reading-progress':{textContent:'Aún sin practicar'},'m2-progress':{textContent:'Aún sin practicar'},'history-progress':{textContent:'Aún sin practicar'},'continue-study':{innerHTML:''}};
 vm.runInNewContext(script,{
  localStorage:{getItem:key=>data.get(key)??null},
  document:{getElementById:id=>rendered[id]}
 });
 return rendered;
}
test('selector Cachaste: pantalla inicial contiene las cuatro asignaturas y Ciencias agrupada',()=>{
 assert.ok(script,'falta JS de dashboard');
 for(const name of ['¿Qué quieres aprender hoy?','Matemática M1','Biología','Química','Física','Competencia Lectora'])assert.ok(dashboard.includes(name),name);
 for(const href of ['index.html','science.html','science.html?asignatura=biologia','science.html?asignatura=quimica','science.html?asignatura=fisica','reading.html'])assert.ok(dashboard.includes('href="'+href+'"'),href);
 assert.ok(dashboard.includes('viewport-fit=cover'));
 assert.ok(dashboard.includes('prefers-reduced-motion'));
});
test('selector Cachaste: los avances de M1 y Ciencias se leen sin mezclarse',()=>{
 const data=new Map([
  ['prepara-paes-demo-v1',JSON.stringify([{id:1,correct:true},{id:2,correct:false}])],
  ['cachaste-science-v1',JSON.stringify({history:[{id:'SCI-001',correct:true}],pending:[]})],
  ['cachaste-reading-v1',JSON.stringify({history:[{id:'LEC-001',correct:true},{id:'LEC-002',correct:false}]})]
 ]);
 const rendered=openHome(data);
 assert.equal(rendered['m1-progress'].textContent,'2 respuestas');
 assert.equal(rendered['science-progress'].textContent,'1 respuesta');
 assert.equal(rendered['reading-progress'].textContent,'2 respuestas');
 const empty=openHome();
 assert.equal(empty['m1-progress'].textContent,'Aún sin practicar');
 assert.equal(empty['science-progress'].textContent,'Aún sin practicar');
});
test('selector Cachaste: recupera formato corrupto de progreso sin bloquear el inicio',()=>{
 const data=new Map([['prepara-paes-demo-v1','{JSON malformado'],['cachaste-science-v1','null']]);
 const rendered=openHome(data);
 assert.equal(rendered['m1-progress'].textContent,'Aún sin practicar');
});
test('APK unificado abre selector e incluye Matemática y Ciencias sin descarga de red',()=>{
 const java=read('android/app/src/main/java/cl/preparatupaes/app/MainActivity.java');
 const workflow=read('.github/workflows/android-apk.yml');
 const build=read('scripts/build.mjs');
 const preview=read('scripts/preview.mjs');
 assert.ok(java.includes('webView.loadUrl("file:///android_asset/inicio.html")'));
 for(const file of ['inicio.html','index.html','science.html','science-bank.js','science-app.js','reading.html','reading-bank.js','reading-app.js']){
  assert.ok(workflow.includes('dist/'+file),'APK no incluye '+file);
  assert.ok(build.includes(file),'build no incluye '+file);
 }
 assert.ok(preview.includes('/PreparaTupaes/inicio.html'));
 assert.ok(java.includes('cachasteNativeBack'));
 assert.ok(read('index.html').includes('href="inicio.html"'));
 assert.ok(read('science.html').includes('href="inicio.html"'));
});
