import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const src=readFileSync(new URL('../m2-bank.js',import.meta.url),'utf8');
const app=readFileSync(new URL('../m2-app.js',import.meta.url),'utf8');
test('M2: banco de 109 preguntas originales válidas en seis áreas',()=>{
 const window={};vm.runInNewContext(src,{window});
 const bank=window.CACHASTE_M2;
 assert.equal(bank.length,109);
 assert.equal(new Set(bank.map(q=>q.id)).size,109);
 assert.equal(new Set(bank.map(q=>q.area)).size,6);
 const distribution=Object.fromEntries([...new Set(bank.map(q=>q.area))].map(area=>[area,bank.filter(q=>q.area===area).length]));
 assert.ok(Object.values(distribution).every(count=>count>=5),JSON.stringify(distribution));
 assert.ok(bank.some(q=>q.area==='Suficiencia de datos'&&q.why.includes('afirmaci')));
 for(const q of bank){
  assert.equal(q.options.length,q.area==='Suficiencia de datos'?5:4,q.id);
  assert.equal(new Set(q.options).size,q.options.length,q.id);
  assert.ok(q.answer>=0&&q.answer<q.options.length,q.id);
  assert.ok(q.why.length>25,q.id);
  assert.ok(q.hint.length>20,q.id);
  assert.equal(q.origin,'original');
 }
 for(const [id,answer] of [['M2-107','1/2'],['M2-108','$309.090,30'],['M2-109','$85.000']]){
  const q=bank.find(q=>q.id===id);assert.ok(q,id);assert.equal(q.options[q.answer],answer,id);
  assert.ok(q.why.includes('hipotétic')||q.id==='M2-107',id);
  assert.equal(q.explanations.length,q.options.length,id);
  assert.ok(q.teaching?.check,id+' debe tener tutor');
 }
 assert.equal(3/6,1/2,'probabilidad condicionada tras actualizar la urna');
 assert.equal(Math.round(300_000*1.01**3*100)/100,309_090.30,'capitalización mensual del crédito hipotético');
 assert.equal(850_000*0.10,85_000,'porcentaje del ingreso hipotético');
});
test('M2: interfaz incluye guardado local y no presenta puntajes oficiales',()=>{
 assert.match(readFileSync(new URL('../study-app.js',import.meta.url),'utf8'),/localStorage\.setItem/);
 assert.match(readFileSync(new URL('../study-app.js',import.meta.url),'utf8'),/No equivale a puntaje PAES oficial/);
 assert.match(readFileSync(new URL('../study-app.js',import.meta.url),'utf8'),/sin-declarar/);
});

test('M2: claves de cálculo verificadas de manera independiente',()=>{
 const window={};vm.runInNewContext(src,{window});
 const byId=new Map(window.CACHASTE_M2.map(q=>[q.id,q]));
 const cases=[
  ['M2-001','x=2'],['M2-002','6'],['M2-003','3/10'],['M2-004','0,2'],
  ['M2-005','3π'],['M2-006','5'],['M2-007','8'],['M2-008','7'],
  ['M2-009','$121.000'],['M2-010','3'],['M2-011','x≥5'],['M2-012','8'],
  ['M2-013','25'],['M2-014','1/8'],['M2-015','3/10'],['M2-016','-1/2'],
  ['M2-017','5'],['M2-018','3'],['M2-019','x²-9'],['M2-020','1600'],
  ['M2-021','6'],['M2-022','7'],['M2-023','x=-4'],['M2-024','12'],
  ['M2-025','(x+6)/3'],['M2-026','7'],['M2-027','8'],['M2-028','3'],
  ['M2-029','0'],['M2-030','x>4'],['M2-031','20'],['M2-032','13'],
  ['M2-033','5'],['M2-034','120°'],['M2-035','(5,3)'],
  ['M2-036','1/2'],['M2-037','5'],['M2-038','7'],['M2-039','2/5'],
  ['M2-040','0'],['M2-041','$3200'],['M2-042','120'],
  ['M2-043','y=-2x+3'],['M2-044','$1100'],['M2-045','90'],
  ['M2-046','Cada una por sí sola'],['M2-047','Ambas juntas, ninguna por sí sola'],
  ['M2-048','Solo (2)'],['M2-049','Ambas juntas, ninguna por sí sola'],
  ['M2-050','Se requiere información adicional'],['M2-051','Cada una por sí sola'],
  ['M2-052','9'],['M2-053','1/6'],['M2-054','25π'],['M2-055','100']
 ];
 assert.equal(cases.length,55);
 for(const [id,expected] of cases){const q=byId.get(id);assert.ok(q,id);assert.equal(q.options[q.answer],expected,id)}
});
