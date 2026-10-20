import test from'node:test';import assert from'node:assert/strict';import vm from'node:vm';import{readFileSync}from'node:fs';import{dailyCatalog}from'../scripts/daily-catalog.mjs';
const ctx=vm.createContext({Intl,Date});for(const f of['learning-core.js','daily-curriculum.js','daily-core.js'])vm.runInContext(readFileSync(new URL('../'+f,import.meta.url),'utf8'),ctx);const {items}=dailyCatalog(),C=ctx.CachasteCurriculum,D=ctx.CachasteDaily;
const memory=()=>{const m=new Map();return{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)}};
const fixtures=Array.from({length:24},(_,i)=>({id:String(i),sourceId:i,key:'M1:'+i,subjectKey:'M1',concept:i<12?'Porcentaje':'Ecuación',family:'M1:'+i,options:['sí','no'],answer:0}));
function engine(bank=fixtures,storage=memory(),now=()=>Date.parse('2026-10-15T15:00:00Z')){return D.create(storage,bank,C.subjects,now,()=>.5)}
test('Aciertos después de estudiar conservan XP e historial, sin dominio al recargar ni en el espejo',()=>{
 for(const subject of Object.keys(C.subjects)){
  const bank=fixtures.map(q=>({...q,subjectKey:subject,key:subject+':'+q.id,family:subject+':'+q.id}));
  const storage=memory(),e=engine(bank,storage);
  e.start(subject,2,'lesson','Porcentaje');
  for(let i=0;i<2;i++){
   e.state.session.studied=true;
   const row=e.answer(0,'seguro');
   assert.equal(row.afterStudy,true);
   assert.match(row.assessmentVersion,/^a1-[a-f0-9]{64}$/);
   assert.equal(row.correct,true);
   e.next();
  }
  const saved=storage.getItem(D.KEY),re=engine(bank,storage);
  assert.equal(re.stats().xp,30);
  assert.equal(re.history(subject).length,2,'el espejo no duplica respuestas');
  assert.equal(re.profile(subject)[0].status,'por reforzar',subject);
  assert.equal(re.stats().achievements.includes('Dominio demostrado'),false);
  const mirrored=JSON.parse(storage.getItem(C.subjects[subject].key));
  const rows=Array.isArray(mirrored)?mirrored:mirrored.history;
  assert.ok(rows.every(r=>r.afterStudy&&r.correct));
  assert.deepEqual(rows.map(r=>r.assessmentVersion),Array.from(re.history(subject),r=>r.assessmentVersion));
  const sourceBank=bank.map(q=>({...q,id:q.sourceId}));
  assert.equal(ctx.CachasteLearning.profile(sourceBank,rows)[0].status,'por reforzar');
  assert.equal(storage.getItem(D.KEY),saved,'consultar progreso no borra intentos');
 }
});
test('Currículo diario: clasifica 623 IDs estables sin cambiar claves ni perder las cinco materias',()=>{assert.equal(items.length,788);assert.equal(new Set(items.map(q=>q.key)).size,788);for(const s of Object.keys(C.subjects)){const axes=C.organize(items,s);assert.ok(axes.length);for(const q of items.filter(q=>q.subjectKey===s)){assert.ok(q.axis&&q.unit&&q.concept&&q.levelId);assert.ok(q.teaching);assert.ok(q.answer>=0&&q.answer<q.options.length);}}assert.equal(items.filter(q=>q.supplementary).length,33);assert.deepEqual(new Set(items.filter(q=>q.subjectKey==='Lectura').map(q=>q.axis)),new Set(['Localizar','Interpretar','Evaluar']));});
test('Diagnóstico tradicional alimenta el mismo dominio sin modificar borradores ni evaluaciones',()=>{const storage=memory(),old={history:[{id:'M2-001',correct:false,confidence:'seguro',date:'2026-10-14'}],session:{id:'old'},assessments:[{id:'diagnosis'}]};storage.setItem(C.subjects.M2.key,JSON.stringify(old));const e=engine(items,storage);assert.equal(e.profile('M2').find(p=>p.concept===items.find(q=>q.key==='M2:M2-001').concept).status,'por reforzar');assert.equal(storage.getItem(C.subjects.M2.key),JSON.stringify(old));});
test('Express: registrar presentación y reabrir impide repetir pregunta incluso abandonada',()=>{const storage=memory(),e=engine(fixtures,storage);e.start('M1',2);const first=e.state.session.keys[0];e.close();const resumed=engine(fixtures,storage);assert.ok(!resumed.select('M1',4).questions.some(q=>q.key===first));assert.equal(resumed.state.seen[first].count,1);});
test('Dominio: requiere dos ítems diferentes seguros; pistas o nuevo error reinician evidencia',()=>{const e=engine();e.start('M1',2,'lesson','Porcentaje');e.answer(0,'seguro');assert.equal(e.profile('M1')[0].status,'por comprobar');e.next();e.answer(0,'seguro');assert.equal(e.profile('M1')[0].status,'comprobado');e.next();e.start('M1',1,'smart','Porcentaje');e.state.session.hinted=true;e.answer(0,'seguro');assert.equal(e.profile('M1')[0].status,'por reforzar');});
test('Respuesta idempotente y recompensas: error no castiga, no gana XP dos veces',()=>{const e=engine();e.start('M1',1);e.answer(1,'duda');assert.equal(e.stats().xp,10);assert.equal(e.answer(0,'seguro'),null);assert.equal(e.stats().xp,10);assert.equal(e.state.attempts.length,1);assert.equal(e.state.attempts[0].evidence,'error persistente');});
test('Persistencia conserva elección, pista y sesión; combina historial espejo sin duplicarlo',()=>{const storage=memory(),e=engine(fixtures,storage);e.start('M1',2);e.state.session.selected=1;e.state.session.hinted=true;e.save();const re=engine(fixtures,storage);assert.equal(re.state.session.selected,1);assert.equal(re.state.session.hinted,true);re.answer(1,'duda');assert.equal(re.history('M1').length,1);assert.equal(JSON.parse(storage.getItem(C.subjects.M1.key)).length,1);});
test('Transferencia usa otra familia del mismo objetivo y reconoce la ya programada',()=>{const e=engine();e.start('M1',2,'lesson','Porcentaje');e.answer(1,'seguro');const first=e.state.session.keys[0],transfer=e.transfer();assert.equal(transfer.questions.length,1);assert.notEqual(transfer.questions[0].key,first);assert.notEqual(transfer.questions[0].family,e.byKey.get(first).family,'La comprobación nunca acredita la misma familia');assert.equal(transfer.questions[0].concept,'Porcentaje');assert.equal(e.state.session.keys.length,2);});
test('Banco agotado: informa, no repite inmediatamente ni certifica por leer',()=>{const e=engine(fixtures.slice(0,1));e.start('M1',1);assert.equal(e.profile('M1')[0].status,'sin explorar');e.answer(1,'seguro');assert.equal(e.transfer().questions.length,0);e.next();assert.equal(e.start('M1',1).questions.length,0);assert.equal(e.state.session,null);});
test('Rachas usan fecha chilena y conservan ayer, sin presión por horas exactas',()=>{let now=Date.parse('2026-10-15T02:00:00Z');assert.equal(D.day(now),'2026-10-14');const e=engine(fixtures,memory(),()=>now);e.start('M1',1);e.answer(0,'seguro');e.next();now+=86400000;e.start('M1',1);e.answer(1,'seguro');e.next();assert.equal(e.stats().streak,2);assert.equal(e.stats().xp,25);});
test('Guardar sin espacio informa un fallo real sin borrar el historial antiguo',()=>{const store={getItem:()=>null,setItem:()=>{throw Error('quota')}};const e=engine(fixtures,store);e.start('M1',1);assert.match(e.warning,/No pudimos guardar/);assert.equal(e.save(),false);});
test('Express inteligente prioriza conceptos débiles entre preguntas nunca vistas',()=>{const store=memory();store.setItem(C.subjects.M1.key,JSON.stringify([{id:15,correct:false,confidence:'seguro',date:'2026-10-14'}]));const e=engine(fixtures,store);assert.ok(e.select('M1',3).questions.every(q=>q.concept==='Ecuación'));});
test('Prerrequisitos y porcentajes: objetivos básicos preceden desafíos y M2 puede recomendar una base M1',()=>{const unit=C.organize(items,'M1').find(a=>a.name==='Números').units.find(u=>u.name==='Porcentajes');assert.equal(unit.levels[0].objective,'Parte porcentual');assert.equal(C.prerequisites('M2','Interés compuesto')[0].subject,'M1');});
test('Ciencias: transferencia distingue aceleración, rapidez, peso, unidades y magnitudes diferentes',()=>{const by=n=>items.find(q=>q.key==='Ciencias:SCI-'+String(n).padStart(3,'0'));assert.equal(by(17).concept,by(89).concept);assert.notEqual(by(17).concept,by(90).concept);assert.notEqual(by(16).concept,by(91).concept);assert.notEqual(by(22).concept,by(58).concept);assert.notEqual(by(191).concept,by(193).concept);});
test('Repaso espaciado: un ítem antiguo vuelve tras el intervalo, sin repetición inmediata',()=>{let now=Date.parse('2026-10-15T15:00:00Z');const store=memory(),e=engine(fixtures.slice(0,1),store,()=>now);e.start('M1',1);e.answer(1,'seguro');e.next();assert.equal(e.select('M1',1).questions.length,0);now+=2*86400000;assert.equal(e.select('M1',1).questions.length,1);});
test('La clase no cuenta una pregunta como presentada antes de abrir la práctica',()=>{const e=engine();e.start('M1',2,'lesson','Porcentaje');assert.equal(Object.keys(e.state.seen).length,0);});
test('Espejo tradicional conserva metadatos por asignatura y errores pendientes',()=>{for(const subject of ['M1','Ciencias','Lectura']){const store=memory(),e=engine(items,store);e.start(subject,1);const q=e.byKey.get(e.state.session.keys[0]);e.answer((q.answer+1)%4,'duda');const data=JSON.parse(store.getItem(C.subjects[subject].key)),row=Array.isArray(data)?data.at(-1):data.history.at(-1);assert.equal(row.skill,q.skill);assert.equal(row.concept,q.concept);assert.equal(row.area,q.area||q.axis);if(subject==='M1')assert.ok(JSON.parse(store.getItem('cachaste-m1-pending-review-v1')).ids.includes(q.sourceId));else{assert.equal(row.subject,q.subject||subject);assert.ok(data.pending.includes(q.sourceId));}}});
test('Sesión diaria dañada se descarta sin tocar respuestas, racha ni borradores tradicionales',()=>{const store=memory(),e=engine(fixtures,store);e.start('M1',1);e.answer(0,'seguro');e.state.session.results={wrong:'format'};e.save();const recovered=engine(fixtures,store);assert.equal(recovered.state.session,null);assert.equal(recovered.state.attempts.length,1);assert.equal(recovered.stats().xp,15);assert.equal(recovered.history('M1').length,1);});
test('M2: el contenido geométrico conserva su eje aunque el formato sea suficiencia de datos o modelación',()=>{for(const id of ['M2-049','M2-051','M2-101','M2-102'])assert.equal(items.find(q=>q.key==='M2:'+id).axis,'Geometría');});

test('Estrellas del tutor provienen de evidencia independiente y no de XP ni pistas',()=>{
 const L=ctx.CachasteLearning;
 assert.equal(L.skillStars({attempts:0,correct:0,evidence:[],status:'sin explorar'}),0);
 assert.equal(L.skillStars({attempts:2,correct:0,evidence:[],status:'por reforzar'}),1);
 assert.equal(L.skillStars({attempts:2,correct:1,evidence:[],status:'por reforzar'}),2);
 assert.equal(L.skillStars({attempts:1,correct:1,evidence:['familia-1'],status:'por comprobar'}),3);
 assert.equal(L.skillStars({attempts:3,correct:3,evidence:['familia-1','familia-2'],status:'comprobado'}),4);
 assert.equal(L.skillStars({attempts:3,correct:3,evidence:['familia-1','familia-2','familia-3'],status:'comprobado'}),5);
 assert.equal(L.skillStars({attempts:4,correct:3,evidence:[],status:'por reforzar'}),2,'Una equivocación posterior no mantiene dominio ficticio');
});

test('Estrellas y tutor: una familia ya demostrada no desplaza ejercicios nuevos del mismo concepto',()=>{
 const bank=[
  {...fixtures[0],id:'A',sourceId:'A',key:'M1:A',family:'A',transferGroup:'A'},
  {...fixtures[1],id:'B',sourceId:'B',key:'M1:B',family:'B',transferGroup:'B'},
  {...fixtures[2],id:'C',sourceId:'C',key:'M1:C',family:'C',transferGroup:'C'}
 ];
 const e=engine(bank);
 e.start('M1',1,'free','Porcentaje');
 const first=e.state.session.keys[0];
 e.answer(0,'seguro');
 e.next();
 const next=e.select('M1',2,{concept:'Porcentaje'});
 assert.ok(next.questions.length>0);
 assert.ok(next.questions.every(q=>q.key!==first),'El ejercicio presentado no debe repetirse inmediatamente');
 assert.equal(e.profile('M1')[0].status,'por comprobar');
 assert.equal(ctx.CachasteLearning.skillStars(e.profile('M1')[0]),3);
});

test('Auditoría de cobertura para cuatro estrellas en cinco materias y menciones',()=>{
 const routes=['M1','M2','Lectura','Historia','Ciencias'];
 for(const subject of routes){
  const tracks=subject==='Ciencias'?['Biología','Física','Química','TP']:[null];
  for(const track of tracks){
   const catalog=items.filter(q=>q.subjectKey===subject&&(subject!=='Ciencias'||q.module==='MC'||(track==='TP'?q.module==='MTP':q.module==='ME'&&q.subject===track)));
   const concepts=new Set(catalog.map(q=>q.concept));
   let scarce=0,ready=0;
   for(const concept of concepts){
    const matching=catalog.filter(q=>q.concept===concept);
    const eligible=matching.filter(q=>!q.supplementary&&q.examEligible!==false);
    const usable=eligible.length?eligible:matching;
    const families=new Set(usable.map(q=>q.transferGroup||q.family||q.key));
    if(families.size>=2)ready++;else {scarce++;console.log('HABILIDAD CON COBERTURA INSUFICIENTE '+subject+(track?' '+track:'')+': '+concept+' ('+families.size+' familia independiente)');}
    assert.ok(families.size>=1,'No hay preguntas para '+subject+'/'+track+'/'+concept);
   }
   assert.equal(ready+scarce,concepts.size);
   console.log('AUDITORÍA ESTRELLAS '+subject+(track?' '+track:'')+': '+ready+' habilidades con 2+ familias, '+scarce+' sin cobertura suficiente (sin bloqueo)');
  }
 }
});

test('Tutor tipo Duolingo: cuatro estrellas requieren dos aciertos independientes y seguros',()=>{
 const bank=fixtures.slice(0,4),e=engine(bank);
 e.start('M1',1,'free','Porcentaje');
 const first=e.state.session.keys[0],r1=e.answer(0,'seguro');
 assert.equal(r1.correct,true);
 assert.equal(ctx.CachasteLearning.skillStars(e.profile('M1')[0]),3,'Un solo acierto seguro no desbloquea la habilidad');
 const transfer=e.transfer();
 assert.equal(transfer.questions.length,1,'Debe proponer una nueva comprobación');
 assert.notEqual(transfer.questions[0].family,e.byKey.get(first).family,'No repetir familia conceptual');
 e.next();
 const second=e.state.session.keys[e.state.session.index];
 assert.equal(second,transfer.questions[0].key);
 const r2=e.answer(0,'seguro');
 assert.equal(r2.correct,true);
 assert.equal(ctx.CachasteLearning.skillStars(e.profile('M1')[0]),4,'Dos aciertos independientes comprueban la habilidad');
 const saved=e.state.attempts;
 assert.equal(new Set(saved.map(x=>x.key)).size,2);
});

test('Tutor: equivocarse, acertar con duda o estudiar no certifica cuatro estrellas',()=>{
 for(const mode of ['error','duda','estudiado']){
  const e=engine(fixtures.slice(0,4));
  e.start('M1',2,'free','Porcentaje');
  if(mode==='estudiado')e.state.session.studied=true;
  const first=e.answer(mode==='error'?1:0,mode==='duda'?'duda':'seguro');
  assert.equal(first.correct,mode!=='error');
  assert.equal(ctx.CachasteLearning.skillStars(e.profile('M1')[0])<4,true,mode);
  const next=e.transfer();
  assert.ok(next.questions.length,'El tutor debe poder proponer una comprobación diferente después de '+mode);
  const firstKey=e.state.session.keys[0];
  assert.notEqual(next.questions[0].family,e.byKey.get(firstKey).family,mode);
  e.next();
  e.answer(0,'seguro');
  assert.equal(ctx.CachasteLearning.skillStars(e.profile('M1')[0])<4,true,'Un solo acierto independiente posterior al refuerzo no acredita dominio: '+mode);
 }
});
