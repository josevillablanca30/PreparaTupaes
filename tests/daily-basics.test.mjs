import test from'node:test';import assert from'node:assert/strict';import vm from'node:vm';import{readFileSync}from'node:fs';import{dailyCatalog}from'../scripts/daily-catalog.mjs';
const c=vm.createContext({Intl,Date});for(const f of['learning-core.js','daily-core.js','daily-basics.js','daily-curriculum.js'])vm.runInContext(readFileSync(new URL('../'+f,import.meta.url),'utf8'),c);const items=dailyCatalog().items,C=c.CachasteCurriculum;
function setup(store=new Map()){const storage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};const e=c.CachasteDaily.create(storage,items,C.subjects),b=c.CachasteBasics.attach(e);return{e,b,store};}
test('Fundamentos: cinco misiones y veinte comprobaciones únicas, separadas del banco PAES',()=>{const l=c.CachasteBasics.lessons;assert.equal(l.length,8);const qs=l.flatMap(l=>l.checks);assert.equal(qs.length,32);assert.equal(new Set(qs.map(q=>q.id)).size,32);for(const q of qs){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.why.length>35);assert.ok(q.answer>=0&&q.answer<4);}assert.equal(items.length,623);});
test('Fundamentos: claves aritméticas y fracciones comprobadas independientemente',()=>{const expected=[8,'La de 9',0,8,4+3,9-4,8-5,0+6,2*5,12/4,5*3,20/5,-1+3,2-5,-1,0,'1/4','La mitad','2/3','1/2'];const qs=c.CachasteBasics.lessons.slice(0,5).flatMap(l=>l.checks);qs.forEach((q,i)=>{const option=q.options[q.answer];assert.equal(typeof expected[i]==='number'?parseFloat(option.replace('−','-').replace('$','')):option,expected[i],q.id);});});
test('Fundamentos: leer no acredita; dos preguntas distintas sí, error o pistas reinician evidencia',()=>{const {e,b}=setup();b.start('cantidad');assert.equal(b.status('cantidad').complete,false);b.answer(b.current().answer);assert.equal(b.status('cantidad').complete,false);b.next();e.state.foundationDraft.hinted=true;b.answer(b.current().answer);assert.equal(b.status('cantidad').complete,false);b.next();b.answer(b.current().answer);b.next();b.answer(b.current().answer);assert.equal(b.status('cantidad').complete,true);assert.equal(b.next(),true);assert.equal(e.state.foundationDraft,null);assert.equal(e.state.attempts.length,0);});
test('Fundamentos: se recupera el paso y la selección sin sobrescribir resultados tradicionales',()=>{const {e,b,store}=setup();store.set('prepara-paes-demo-v1',JSON.stringify([{id:1,correct:false}]));b.start('fracciones');e.state.foundationDraft.card=2;e.state.foundationDraft.selected=1;e.save();const re=setup(store);assert.equal(re.e.state.foundationDraft.card,2);assert.equal(re.e.state.foundationDraft.selected,1);assert.equal(re.e.history('M1').length,1);assert.equal(re.b.status('fracciones').complete,false);});
test('Fundamentos: una respuesta no gana XP dos veces ni coexiste con otra sesión',()=>{const {e,b}=setup();b.start('sumar');const first=b.current();b.answer(first.answer);const xp=e.stats().xp;b.answer(first.answer);assert.equal(e.stats().xp,xp);assert.equal(e.start('M1',2).blocked,true);const other=setup();other.e.start('M1',1);assert.equal(other.b.start('sumar'),false);});
test('Ciencias: los cuatro recorridos mezclan común con la mención correcta',()=>{for(const track of ['Biología','Física','Química','TP']){const{e}=setup();e.state.track=track;const qs=e.select('Ciencias',30).questions;assert.equal(qs.length,30);for(const q of qs)assert.ok(q.module==='MC'||(track==='TP'?q.module==='MTP':q.module==='ME'&&q.subject===track),q.id);const pool=C.sciencePool(items,track).filter(q=>q.subjectKey==='Ciencias');assert.ok(pool.some(q=>q.module==='MC'&&q.subject!==(track==='TP'?'none':track)));}});
test('M1: números y fracciones preceden potencias, raíces, ecuaciones y porcentajes',()=>{const names=C.course(items,'M1').map(u=>u.name);assert.equal(names[0],'Enteros');for(const[a,b]of[['Racionales','Potencias'],['Potencias','Raíces'],['Raíces','Ecuaciones'],['Ecuaciones','Porcentajes']])assert.ok(names.indexOf(a)<names.indexOf(b),a+' antes de '+b);});

test('Tres materias adicionales parten desde cero con ejercicios independientes',()=>{for(const subject of ['Lectura','Ciencias','Historia']){const l=c.CachasteBasics.lessons.find(x=>x.subject===subject);assert.ok(l,subject);assert.equal(l.cards.length,3);assert.equal(l.checks.length,4);const{e,b}=setup();assert.equal(b.status(l.id).complete,false);b.start(l.id);assert.equal(b.current().id,l.checks[0].id);b.answer(l.checks[0].answer);b.next();b.answer(l.checks[1].answer);assert.equal(b.status(l.id).complete,true);b.next();assert.equal(e.state.completed.at(-1).subject,subject);}});

test('Fundamentos: dominio aprobado no se pierde tras errores, pistas ni repasos',()=>{
 const{b,store}=setup();
 assert.equal(b.start('cantidad'),true);
 b.answer(b.current().answer);
 assert.equal(b.next(),false);
 b.answer(b.current().answer);
 assert.equal(b.status('cantidad').complete,true);
 assert.equal(b.next(),true);
 assert.equal(b.start('cantidad'),true);
 b.answer((b.current().answer+1)%4);
 assert.equal(b.status('cantidad').complete,true,'un error de repaso no revoca el logro');
 assert.equal(b.next(),false,'un repaso conserva al menos dos ejercicios');
 const q=b.current();
 b.answer(q.answer);
 assert.equal(b.next(),true);
 assert.equal(setup(store).b.status('cantidad').complete,true,'el logro persiste después de recargar');
});

test('Fundamentos: datos antiguos mantienen dominio aun si hubo un error posterior',()=>{
 const{e,b,store}=setup();
 e.state.basics.cantidad={history:[
 {id:'cantidad-1',correct:true,hinted:false},
 {id:'cantidad-2',correct:true,hinted:false},
 {id:'cantidad-3',correct:false,hinted:false}
 ]};
 e.save();
 assert.equal(setup(store).b.status('cantidad').complete,true);
});
