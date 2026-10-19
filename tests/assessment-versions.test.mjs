import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadBanks} from '../scripts/load-banks.mjs';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
const ctx=vm.createContext({});
vm.runInContext(readFileSync(new URL('../learning-core.js',import.meta.url),'utf8'),ctx);
const L=ctx.CachasteLearning;
const question=()=>({id:'a',question:'¿Cuánto es 2 + 3?',options:['5','6','7','8'],answer:0,concept:'Suma',transferGroup:'suma-a'});
test('La huella offline coincide con SHA-256 para Unicode y varios bloques',()=>{
 for(const text of ['', 'abc', '¿Cachaste? 🐱 · x² ≥ 3', 'a'.repeat(55),'a'.repeat(56),'b'.repeat(64),'contenido '.repeat(1000)]){
  assert.equal(L.contentHash(text),createHash('sha256').update(text).digest('hex'));
 }
});
test('La versión distingue evaluaciones pero permite mejorar el tutor sin invalidar respuestas',()=>{
 const q=question(),version=L.assessmentVersion(q);
 assert.match(version,/^a1-[a-f0-9]{64}$/);
 assert.equal(L.assessmentVersion({...q,explanations:['nueva explicación'],teaching:{revision:'nueva'}}),version);
 for(const change of [{question:'¿Cuánto es 3 + 2?'},{options:['6','5','7','8']},{answer:1},{concept:'Resta'},{transferGroup:'otra-familia'},{visual:{type:'bar',value:3}}]){
  assert.notEqual(L.assessmentVersion({...q,...change}),version);
 }
 q.options[0]='otra alternativa';assert.notEqual(L.assessmentVersion(q),version,'la caché no oculta cambios del objeto');
});
test('Cambiar un pasaje con el mismo ID cambia la evaluación lectora',()=>{
 const q={...question(),passageId:'p'},passages=[{id:'p',title:'Título',paragraphs:['Primera evidencia.']}];
 L.bindPassages([q],passages);const before=L.assessmentVersion(q);
 passages[0].paragraphs[0]='Evidencia distinta.';L.bindPassages([q],passages);
 assert.notEqual(L.assessmentVersion(q),before);
});
test('Una respuesta versionada incompatible no se convierte en dominio del contenido nuevo',()=>{
 const a=question(),b={...a,id:'b',transferGroup:'suma-b'};
 const history=[a,b].map(q=>({id:q.id,correct:true,confidence:'seguro',selected:0,assessmentVersion:L.assessmentVersion(q)}));
 assert.equal(L.profile([a,b],history)[0].status,'comprobado');
 const before=JSON.stringify(history);a.options=['10','11','12','13'];
 assert.equal(L.profile([a,b],history)[0].status,'por comprobar');
 assert.equal(L.compatibleAttempt(a,history[0]),false);
 assert.equal(JSON.stringify(history),before,'no recalificar ni borrar intentos');
 assert.equal(L.compatibleAttempt(a,{id:'a',correct:true}),true,'compatibilidad transitoria del historial sin versión');
});
test('Las cinco materias y su catálogo diario generan la misma versión de cada original',()=>{
 const banks=loadBanks(),{items}=dailyCatalog();let checked=0;
 for(const [subject,bank] of Object.entries(banks)){
  if(subject==='texts')continue;
  for(const q of bank){const daily=items.find(x=>x.subjectKey===subject&&x.id===String(q.id));assert.ok(daily);
   assert.equal(L.assessmentVersion(q),L.assessmentVersion(daily),subject+':'+q.id);checked++;
  }
 }
 assert.equal(checked,631);
 assert.equal(new Set(items.map(q=>q.subjectKey+':'+L.assessmentVersion(q))).size,788);
});
test('La limpieza no recorta el índice histórico al reducir opciones de otra versión',()=>{
 const q=question(),row={id:q.id,selected:3,correct:false,assessmentVersion:L.assessmentVersion(q)};
 q.options=['5','6'];
 const cleaned=L.cleanRows([q],[row]);
 assert.equal(cleaned[0].selected,3);assert.equal(cleaned[0].correct,false);
 assert.equal(cleaned[0].assessmentVersion,row.assessmentVersion);
 assert.equal(L.cleanRows([q],[{id:q.id,selected:3,correct:false}])[0].selected,null,'se conserva el saneamiento legado');
});


test('Una sesión abierta conserva versiones por pregunta y detecta cambios sin alterarla',()=>{
 const q=question(),other={...question(),id:'b',question:'Otro ejercicio'};
 const session={ids:['a','b'],assessmentVersions:[L.assessmentVersion(q),L.assessmentVersion(other)],answers:[2,null],index:1};
 const before=JSON.stringify(session);
 assert.equal(L.sessionVersionStatus(session,[q,other]),'compatible');
 assert.equal(L.sessionVersionStatus({...session,assessmentVersions:undefined},[q,other]),'legacy');
 assert.equal(L.sessionVersionStatus(session,[q,{...other,options:['4','6','7','8']}]),'changed');
 assert.equal(L.sessionVersionStatus({...session,assessmentVersions:[session.assessmentVersions[0]]},[q,other]),'changed');
 assert.equal(JSON.stringify(session),before);
});


test('Una sesión sin huella no se considera compatible de forma implícita',()=>{
 const q=question();
 assert.equal(L.sessionVersionStatus({ids:[q.id]},[q]),'legacy');
 assert.equal(L.sessionVersionStatus({ids:[q.id],assessmentVersions:[L.assessmentVersion(q)]},[q]),'compatible');
 assert.equal(L.sessionVersionStatus({ids:[q.id],assessmentVersions:['a1-'+ '0'.repeat(64)]},[q]),'changed');
});


test('Una sesión nueva guarda una copia independiente de su evaluación',()=>{
 const q=question(),copy=L.assessmentSnapshot(q);
 assert.equal(copy.assessmentVersion,L.assessmentVersion(q));
 assert.equal(copy.question,'¿Cuánto es 2 + 3?');
 q.question='Enunciado actualizado';q.options[0]='10';
 assert.equal(copy.question,'¿Cuánto es 2 + 3?');
 assert.equal(copy.options[0],'5');
 assert.notEqual(copy.assessmentVersion,L.assessmentVersion(q));
});


test('La copia de evaluación preserva datos visuales y la huella lectora sin referencias mutables',()=>{
 const q={...question(),passageId:'T01',passageVersion:'huella-original',visual:{type:'bars',data:[2,4]}};
 const copy=L.assessmentSnapshot(q);
 q.visual.data[0]=999; q.passageVersion='huella-nueva';
 assert.equal(copy.visual.data[0],2);
 assert.equal(copy.passageVersion,'huella-original');
 assert.equal(copy.passageId,'T01');
 assert.notEqual(copy.assessmentVersion,L.assessmentVersion(q));
});

test('Respaldo completo recupera la pregunta original y rechaza manipulaciones',()=>{
 const first=question(),second={...question(),id:'b',question:'¿Cuánto es 4 + 1?',transferGroup:'suma-b'};
 const qs=[first,second],session={ids:qs.map(q=>q.id),assessmentVersions:qs.map(q=>L.assessmentVersion(q)),questionSnapshots:qs.map(q=>L.assessmentSnapshot(q))};
 first.options[0]='100';second.question='Pregunta modificada';
 const recovered=L.archivedSessionQuestions(session);
 assert.equal(recovered[0].options[0],'5');
 assert.equal(recovered[1].question,'¿Cuánto es 4 + 1?');
 recovered[0].options[0]='edición';
 assert.equal(session.questionSnapshots[0].options[0],'5');
 assert.equal(L.archivedSessionQuestions({...session,questionSnapshots:session.questionSnapshots.map((q,i)=>i===0?{...q,answer:2}:q)}),null);
 assert.equal(L.archivedSessionQuestions({...session,assessmentVersions:[session.assessmentVersions[1],session.assessmentVersions[0]]}),null);
 assert.equal(L.archivedSessionQuestions({...session,questionSnapshots:[]}),null);
 assert.equal(L.archivedSessionQuestions({ids:['a']}),null);
});

test('Una sesión con alternativas modificadas sigue siendo válida con archivo verificado',()=>{
 const q=question(),session={mode:'express',ids:['a'],index:0,selected:3,results:[],assessmentVersions:[L.assessmentVersion(q)],questionSnapshots:[L.assessmentSnapshot(q)]};
 assert.equal(L.validSession(session,[{...q,options:['5','6']}],['express']),true);
 assert.equal(L.validSession({...session,questionSnapshots:null},[{...q,options:['5','6']}],['express']),false);
});

test('Ensayo pausado: reanuda la versión original, conserva omisiones y no recalifica con banco cambiado',()=>{
 const original={...question(),id:'M2-001',area:'Álgebra',question:'Pregunta original',options:['1','2','3','4'],answer:0};
 const changed={...original,question:'Pregunta nueva',options:['10','20','30','40'],answer:2};
 const session={id:'ensayo-congelado',mode:'full',ids:[original.id],index:0,selected:null,checked:false,confidence:null,results:[],started:Date.now()-1000,deadline:Date.now()+600000,answers:[null],flags:[0],assessmentVersions:[L.assessmentVersion(original)],questionSnapshots:[L.assessmentSnapshot(original)]};
 const state={diagnosticDone:true,history:[],session};
 const store=new Map([['cachaste-test-v1',JSON.stringify(state)]]);
 const nodes=new Map(),root={innerHTML:'',querySelectorAll:()=>[]};
 const document={getElementById:id=>id==='app'?root:(nodes.has(id)?nodes.get(id):nodes.set(id,{}).get(id)),addEventListener:()=>{},hidden:false};
 const localStorage={getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value)};
 const window={addEventListener:()=>{},scrollTo:()=>{}};
 const sandbox=vm.createContext({window,document,localStorage,setInterval:()=>0,Date,Intl});
 vm.runInContext(readFileSync(new URL('../learning-core.js',import.meta.url),'utf8'),sandbox);
 vm.runInContext(readFileSync(new URL('../study-app.js',import.meta.url),'utf8'),sandbox);
 window.CachasteStudy({bank:[changed],key:'cachaste-test-v1',title:'M2',minutes:140,count:1});
 nodes.get('resume').onclick();
 assert.ok(root.innerHTML.includes('Pregunta original'));
 assert.ok(!root.innerHTML.includes('Pregunta nueva'));
 nodes.get('exam-next').onclick();
 assert.ok(root.innerHTML.includes('Entregar tu ensayo'));
 nodes.get('finish').onclick();
 const saved=JSON.parse(store.get('cachaste-test-v1'));
 assert.equal(saved.lastResult.total,1);
 assert.equal(saved.lastResult.correct,0);
 assert.equal(saved.lastResult.results[0].unanswered,true);
 assert.equal(saved.lastResult.results[0].assessmentVersion,session.assessmentVersions[0]);
 assert.equal(saved.lastResult.questionSnapshots[0].question,'Pregunta original');
 assert.ok(root.innerHTML.includes('Pregunta original'));
 assert.equal(saved.session,null);
});

test('Ensayo reanudado conserva selección, marcas y plazo original',()=>{
 const original={...question(),id:'M2-002',area:'Álgebra',question:'Pregunta anterior',options:['A','B','C','D'],answer:1};
 const changed={...original,question:'Pregunta renovada',options:['E','F','G','H'],answer:0};
 const until=Date.now()+900000,session={id:'timed',mode:'full',ids:[original.id],index:0,selected:2,checked:false,confidence:null,results:[],started:Date.now()-2000,deadline:until,answers:[2],flags:[0],assessmentVersions:[L.assessmentVersion(original)],questionSnapshots:[L.assessmentSnapshot(original)]};
 const store=new Map([['study-timed',JSON.stringify({diagnosticDone:true,history:[],session})]]);
 const root={innerHTML:'',querySelectorAll:()=>[]},elements=new Map();
 const document={getElementById:id=>id==='app'?root:(elements.has(id)?elements.get(id):elements.set(id,{}).get(id)),addEventListener:()=>{},hidden:false};
 const localStorage={getItem:key=>store.get(key)||null,setItem:(key,val)=>store.set(key,val)};
 const window={addEventListener:()=>{},scrollTo:()=>{}};
 const context=vm.createContext({window,document,localStorage,setInterval:()=>0,Date,Intl});
 vm.runInContext(readFileSync(new URL('../learning-core.js',import.meta.url),'utf8'),context);
 vm.runInContext(readFileSync(new URL('../study-app.js',import.meta.url),'utf8'),context);
 window.CachasteStudy({bank:[changed],key:'study-timed',title:'M2',minutes:140,count:1});
 elements.get('resume').onclick();
 assert.ok(root.innerHTML.includes('Pregunta anterior'));
 assert.ok(root.innerHTML.includes('C) A'));
 assert.ok(root.innerHTML.includes('aria-pressed="true"'));
 const persisted=JSON.parse(store.get('study-timed')).session;
 assert.equal(persisted.deadline,until);
 assert.equal(persisted.answers[0],2);
 assert.deepEqual(persisted.flags,[0]);
 elements.get('exam-next').onclick();
 elements.get('finish').onclick();
 const final=JSON.parse(store.get('study-timed')).lastResult;
 assert.equal(final.correct,0);
 assert.equal(final.results[0].selected,0,'La respuesta visual C se guarda como índice original 0 tras la rotación de M2');
 assert.equal(final.results[0].assessmentVersion,session.assessmentVersions[0]);
 assert.equal(final.questionSnapshots[0].question,'Pregunta anterior');
});
