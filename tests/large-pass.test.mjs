import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync,readdirSync} from 'node:fs';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {readinessAudit} from '../scripts/readiness-audit.mjs';
import {transferCasesBatch11} from '../scripts/paes-transfer-batch11-2027.mjs';
import {transferCasesBatch12} from '../scripts/paes-transfer-batch12-2027.mjs';
import {transferCasesBatch13} from '../scripts/paes-transfer-batch13-2027.mjs';

const rows=[...transferCasesBatch11,...transferCasesBatch12,...transferCasesBatch13];
const {items}=dailyCatalog(),byKey=new Map(items.map(q=>[q.key,q]));
const ctx=vm.createContext({Intl,Date});
for(const f of ['learning-core.js','daily-curriculum.js','daily-core.js'])vm.runInContext(readFileSync(new URL('../'+f,import.meta.url),'utf8'),ctx);
const memory=()=>{const values=new Map();return{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)}};
const engine=(bank=items,store=memory())=>ctx.CachasteDaily.create(store,bank,ctx.CachasteCurriculum.subjects,()=>Date.parse('2026-10-18T15:00:00Z'),()=>.5);
const key=id=>{const q=items.find(q=>q.id===id);assert.ok(q,id);return q.options[q.answer]};

test('Pasada amplia: 50 casos con bases estables, fuentes existentes y revisión del cambio de tarea',()=>{
 assert.equal(rows.length,50);
 const inventory=new Set();
 const visit=v=>{if(!v||typeof v!=='object')return;if(v.id)inventory.add(v.id);for(const child of Object.values(v))visit(child)};
 for(const file of readdirSync(new URL('../reports/',import.meta.url)).filter(f=>/^drive-inventory-part-\d+\.json$/.test(f)))visit(JSON.parse(readFileSync(new URL('../reports/'+file,import.meta.url),'utf8')));
 for(const row of rows){
  const base=byKey.get(row.base),q=items.find(q=>q.id===row.id);
  assert.ok(base&&q,row.id);
  assert.equal(q.concept,base.concept);assert.equal(q.levelId,base.levelId);
  assert.notEqual(q.family,base.family);assert.notEqual(q.question,base.question);
  assert.equal(new Set(q.options).size,4);assert.equal(q.teaching.selectedFeedback.filter(Boolean).length,3);
  assert.equal(q.why,row.steps.join(' '),'El tutor tradicional debe explicar la nueva pregunta');
  assert.ok(q.teaching.application.every(s=>s.length>=55),row.id);
  assert.ok(row.transferDesign.baseTask!==row.transferDesign.newTask,row.id);
  assert.ok(inventory.has(q.sourceTrace.driveFileId),'Fuente ausente del inventario: '+row.id);
  assert.ok(q.sourceTrace.officialPages.length&&q.sourceTrace.driveSection&&q.sourceTrace.alignmentRationale);
  assert.equal(q.supplementary,false);assert.equal(q.examEligible,true);
 }
});

test('Claves cuantitativas nuevas: cálculos independientes y unidades coherentes',()=>{
 assert.equal((15*12+10*18)/25,14.4);assert.match(key('TR-M2-001'),/14,4/);
 assert.equal(100+(160-100)+(250-160),250);assert.equal(key('TR-HIS-037'),'$250');
 assert.equal(205-40,165);assert.equal(key('TR-SCI-056'),'165 g');
 assert.ok(Math.abs((.2*1+.3*2)/(.2+.3)-1.6)<1e-12);assert.match(key('TR-SCI-057'),/1,6 M/);
 assert.equal(35-18,17);assert.equal(key('TR-SCI-061'),'17 protones y 17 electrones');
 assert.equal(8*2.5,20);assert.equal(key('TR-SCI-062'),'20 mg');
 assert.equal((200*.1/(200-50)*100).toFixed(1),'13.3');assert.equal(key('TR-SCI-063'),'13,3 % m/m');
 assert.deepEqual([12**2/6,12**2/12],[24,12]);assert.equal(key('TR-SCI-064'),'A disipa 24 W y B disipa 12 W');
 assert.equal((880+1760)/220,12);assert.match(key('TR-SCI-065'),/12 A/);
 assert.equal(12-18,-6);assert.equal(key('TR-SCI-066'),'A 6 m/s hacia el oeste');
 assert.equal(600*2/3,400);assert.equal(key('TR-SCI-067'),'400 nm');
 assert.equal(2*(2-6)/2,-4);assert.equal(key('TR-SCI-069'),'4 N hacia la izquierda');
 assert.equal(key('TR-SCI-070'),'4, 4, 2 y 2');
 const consumedOxygen=3/2;assert.equal(2-consumedOxygen,.5);assert.match(key('TR-SCI-076'),/3 mol de agua.*0,5 mol/);
 assert.ok(Math.abs(.8*.1/.4*.05-.01)<1e-12);assert.equal(key('TR-SCI-077'),'0,2 M y 0,010 mol');
 assert.equal(1/(.5-.1),2.5);assert.equal(key('TR-SCI-079'),'0,4 s y 2,5 Hz');
 assert.ok(30/18>30/44);assert.match(key('TR-SCI-081'),/agua tiene más moles/);
 assert.equal(120/(60/60+60/30),40);assert.match(key('TR-SCI-082'),/^40 km\/h/);
 assert.equal(2*3/4,1.5);assert.match(key('TR-SCI-083'),/^1,5 m\/s²/);
});

test('Claves interpretativas distinguen mecanismo, evidencia y límites de la conclusión',()=>{
 const checks={
  'TR-HIS-027':/acceso es abierto.*consumo es rival/,'TR-HIS-028':/proceso diverso.*autodeterminación/,
  'TR-HIS-029':/precipitó una crisis.*tensiones acumuladas/,'TR-HIS-030':/caída de ventas.*actividad e ingresos/,
  'TR-HIS-031':/misma ley sin privilegios/,'TR-HIS-032':/coexistir.*dominio y extracción/,
  'TR-HIS-033':/demanda a la izquierda/,'TR-HIS-034':/mercados externos.*transporte/,
  'TR-HIS-035':/propiedad y control estatal/,'TR-HIS-036':/efectos desiguales/,'TR-HIS-038':/consolidación del bloque occidental/,
  'TR-SCI-051':/carboxilo.*ácido carboxílico/,'TR-SCI-052':/primero se une a un H.*dos grupos carbonados/,
  'TR-SCI-053':/éster a éter.*eliminó el carbonilo/,'TR-SCI-054':/^Un éter y un alcohol$/,
  'TR-SCI-055':/virtual.*prolongaciones/,'TR-SCI-058':/distribución de ángulos/,'TR-SCI-059':/contradice.*A.*compatible con B/,
  'TR-SCI-060':/Se mantiene.*kilogramos de solvente/,'TR-SCI-068':/Masa en el eje vertical y volumen en el horizontal/,
  'TR-SCI-071':/menor capacidad.*menos superficie/,'TR-SCI-072':/A se apaga y B permanece/,
  'TR-SCI-073':/variantes del mismo gen podrían/,'TR-SCI-074':/A se acerca y B se aleja/,'TR-SCI-075':/O₂ producidos por minuto/,
  'TR-SCI-078':/igual rapidez.*visible tiene mayor frecuencia/,'TR-SCI-080':/P y Q.*igual número de protones/,
  'TR-SCI-084':/oxígeno molecular liberado procede del agua/,'TR-SCI-085':/inhibir la ovulación no constituye una barrera/,
  'TR-SCI-086':/combinaciones nuevas.*sin.*crear alelos nuevos/,'TR-SCI-087':/depende del ambiente/
 };
 for(const [id,expected]of Object.entries(checks))assert.match(key(id),expected,id);
});

test('Elegibilidad heredada: una transferencia nunca promueve un contenido complementario a PAES',()=>{
 for(const q of items.filter(q=>q.origin==='original-transfer-2027')){
  const base=byKey.get(q.sourceKey),eligible=base.examEligible!==false&&!base.supplementary;
  assert.equal(q.examEligible,eligible,q.id);assert.equal(q.supplementary,!eligible,q.id);
 }
 assert.equal(items.filter(q=>q.supplementary).length,33);
 assert.deepEqual(items.filter(q=>q.subjectKey==='Historia'&&q.supplementary).map(q=>q.id),['HIS-045','HIS-054']);
});

test('Cada ruta de Ciencias puede seleccionar dos familias PAES por concepto sin cambiar de mención',()=>{
 const report=readinessAudit(items);
 assert.equal(report.scopes.paes.overall.questions,755);assert.equal(report.scopes.paes.overall.concepts,270);
 assert.equal(report.scopes.paes.overall.unverifiableConcepts,0);
 assert.equal(report.overall.unverifiableConcepts,7);
 for(const track of ['Biología','Física','Química','TP']){
  const e=engine(),pool=ctx.CachasteCurriculum.sciencePool(items,track).filter(q=>q.subjectKey==='Ciencias'&&q.examEligible!==false&&!q.supplementary);
  assert.equal(report.scienceTracks[track].overall.unverifiableConcepts,0,track);
  for(const concept of new Set(pool.map(q=>q.concept))){
   const selected=e.select('Ciencias',2,{concept,track}).questions;
   assert.equal(selected.length,2,track+':'+concept);assert.equal(new Set(selected.map(q=>q.family)).size,2);
   assert.ok(selected.every(q=>pool.includes(q)&&!q.supplementary),concept);
  }
 }
});

test('La auditoría detecta falsa cobertura si la otra familia está fuera de alcance o en otra mención',()=>{
 const common={subjectKey:'Ciencias',concept:'Contraste de hipótesis',module:'MC',subject:'Biología'};
 const report=readinessAudit([
  {...common,key:'A',family:'A'},
  {...common,key:'B',family:'B',module:'ME',subject:'Física'},
  {...common,key:'C',family:'C',supplementary:true,examEligible:false}
 ]);
 assert.equal(report.overall.unverifiableConcepts,0);
 assert.equal(report.scienceTracks.Física.overall.unverifiableConcepts,0);
 for(const track of ['Biología','Química','TP'])assert.equal(report.scienceTracks[track].overall.unverifiableConcepts,1,track);
 const scoped=readinessAudit([{...common,key:'A',family:'A'},{...common,key:'B',family:'B',examEligible:false}]);
 assert.equal(scoped.overall.unverifiableConcepts,0);assert.equal(scoped.scopes.paes.overall.unverifiableConcepts,1);
});

test('Práctica general y conceptos mixtos excluyen complementarios; una lección opcional sigue accesible',()=>{
 for(const subject of Object.keys(ctx.CachasteCurriculum.subjects))assert.ok(engine().select(subject,1000).questions.every(q=>!q.supplementary&&q.examEligible!==false),subject);
 const optional=items.find(q=>q.key==='Historia:HIS-054');
 assert.ok(engine().select('Historia',2,{concept:optional.concept}).questions.some(q=>q.key===optional.key));
 const mixed=items.find(q=>q.key==='Ciencias:SCI-143');
 assert.ok(engine().select('Ciencias',10,{concept:mixed.concept,track:'TP'}).questions.every(q=>!q.supplementary));
 const eligible=items.filter(q=>q.subjectKey==='M2').slice(0,9).map((q,i)=>({...q,concept:'Unidad',family:'unique-'+i}));
 const supplement={...eligible[0],id:'optional',key:'M2:optional',family:'optional',supplementary:true,examEligible:false};
 assert.equal(engine([...eligible,supplement]).startUnitExam('M2','test',['Unidad']).blocked,true,'Un décimo ítem fuera de alcance no habilita examen');
 const store=memory(),e=engine(items,store);e.start('Historia',1,'free',optional.concept);e.answer(0,'duda');
 const restored=engine(items,store);assert.equal(restored.state.attempts.length,1);assert.equal(restored.state.session.keys[0],optional.key);
});

test('M2 e Historia tradicionales usan las transferencias, completan el ensayo y preservan el historial',()=>{
 for(const spec of [{name:'M2',file:'m2',count:55,legacy:'M2-001'},{name:'Historia',file:'history',count:65,legacy:'HIS-045'}]){
  const key='cachaste-'+spec.file+'-v1',store=memory(),nodes=new Map();
  const root={innerHTML:'',querySelectorAll:()=>[]};
  const document={getElementById:id=>id==='app'?root:(nodes.has(id)?nodes.get(id):nodes.set(id,{}).get(id)),addEventListener:()=>{}};
  const window={CACHASTE_DAILY_CATALOG:{items},addEventListener:()=>{},scrollTo:()=>{}};
  const local=vm.createContext({window,document,localStorage:store,setInterval:()=>0,Date,Intl});
  const history=[{id:spec.legacy,correct:false,confidence:'duda',date:'2026-10-17T15:00:00Z'}];
  store.setItem(key,JSON.stringify({diagnosticDone:true,history}));
  for(const file of ['learning-core.js','study-app.js',spec.file+'-app.js'])vm.runInContext(readFileSync(new URL('../'+file,import.meta.url),'utf8'),local);
  nodes.get('full').onclick();
  let saved=JSON.parse(store.getItem(key));
  assert.equal(saved.session.ids.length,spec.count);assert.deepEqual(saved.history,history);
  const selected=saved.session.ids.map(id=>byKey.get(spec.name+':'+id));
  assert.ok(selected.every(q=>q&&!q.supplementary&&q.examEligible!==false));
  assert.equal(new Set(selected.map(q=>q.family)).size,spec.count);
  nodes.get('finish').onclick();saved=JSON.parse(store.getItem(key));
  assert.equal(saved.lastResult.total,spec.count);assert.equal(saved.history.length,spec.count+1);
  assert.equal(saved.history[0].id,spec.legacy);
  const transfer=items.find(q=>q.subjectKey===spec.name&&q.origin==='original-transfer-2027');
  store.setItem(key,JSON.stringify({diagnosticDone:true,history,session:{id:'existing-transfer',mode:'express',ids:[transfer.id],index:0,selected:null,checked:false,confidence:null,results:[],started:Date.now(),answers:[null],flags:[]}}));
  vm.runInContext(readFileSync(new URL('../'+spec.file+'-app.js',import.meta.url),'utf8'),local);
  nodes.get('resume').onclick();
  const paused=JSON.parse(store.getItem(key));
  assert.equal(paused.session.ids[0],transfer.id,'El ID de transferencia anterior permanece guardado');
  assert.equal(paused.session.assessmentVersions,undefined,'No se inventa una huella de versión para la sesión anterior');
  assert.ok(root.innerHTML.includes('sesión') && !root.innerHTML.includes('data-choice='),'La sesión sin versión no se recalifica contra el banco actual');
 }
});
