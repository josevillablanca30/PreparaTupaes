import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Clave de segunda lectura redactada por separado del catálogo. Protege contra
// cambios accidentales de alternativa; no sustituye validación pedagógica externa.
const expected = new Map([
  [
    "1",
    "$30.000"
  ],
  [
    "2",
    "5"
  ],
  [
    "3",
    "$9.000"
  ],
  [
    "4",
    "17"
  ],
  [
    "5",
    "2/5"
  ],
  [
    "101",
    "$24.000"
  ],
  [
    "102",
    "7"
  ],
  [
    "103",
    "$20.000"
  ],
  [
    "104",
    "20%"
  ],
  [
    "105",
    "1/2"
  ],
  [
    "106",
    "40 cm²"
  ],
  [
    "107",
    "30 cm²"
  ],
  [
    "108",
    "5"
  ],
  [
    "109",
    "35 minutos"
  ],
  [
    "110",
    "28 m"
  ],
  [
    "111",
    "25"
  ],
  [
    "112",
    "25%"
  ],
  [
    "113",
    "7 km"
  ],
  [
    "114",
    "87 m²"
  ],
  [
    "115",
    "12 minutos"
  ],
  [
    "200",
    "−2 °C"
  ],
  [
    "201",
    "−12"
  ],
  [
    "202",
    "$6.000"
  ],
  [
    "203",
    "3/4"
  ],
  [
    "204",
    "3/8 taza"
  ],
  [
    "205",
    "2/3"
  ],
  [
    "206",
    "$19.800"
  ],
  [
    "207",
    "72"
  ],
  [
    "208",
    "$20.000"
  ],
  [
    "209",
    "2⁵"
  ],
  [
    "210",
    "1/8"
  ],
  [
    "211",
    "12"
  ],
  [
    "212",
    "5"
  ],
  [
    "213",
    "5√2"
  ],
  [
    "214",
    "x² + 6x + 9"
  ],
  [
    "215",
    "(x−4)(x+4)"
  ],
  [
    "216",
    "2x + 6y"
  ],
  [
    "217",
    "10"
  ],
  [
    "218",
    "4 horas"
  ],
  [
    "219",
    "1.000 g"
  ],
  [
    "220",
    "1,5 km"
  ],
  [
    "221",
    "5"
  ],
  [
    "222",
    "8"
  ],
  [
    "223",
    "x < 4"
  ],
  [
    "224",
    "x < −4"
  ],
  [
    "225",
    "6"
  ],
  [
    "226",
    "$8.000"
  ],
  [
    "227",
    "$7.300"
  ],
  [
    "228",
    "2"
  ],
  [
    "229",
    "−5"
  ],
  [
    "230",
    "x=−3 y x=3"
  ],
  [
    "231",
    "t=3"
  ],
  [
    "232",
    "−1"
  ],
  [
    "233",
    "4 m"
  ],
  [
    "234",
    "10"
  ],
  [
    "235",
    "5 cm"
  ],
  [
    "236",
    "78,5 cm²"
  ],
  [
    "237",
    "24 m"
  ],
  [
    "238",
    "32 cm²"
  ],
  [
    "239",
    "36 cm²"
  ],
  [
    "240",
    "64 cm³"
  ],
  [
    "241",
    "30 m³"
  ],
  [
    "242",
    "54 cm²"
  ],
  [
    "243",
    "60 cm³"
  ],
  [
    "244",
    "144 cm²"
  ],
  [
    "245",
    "(−3,−2)"
  ],
  [
    "246",
    "(2,2)"
  ],
  [
    "247",
    "(−1,2)"
  ],
  [
    "248",
    "1,5 m"
  ],
  [
    "249",
    "15 cm"
  ],
  [
    "250",
    "30%"
  ],
  [
    "251",
    "50"
  ],
  [
    "252",
    "12"
  ],
  [
    "253",
    "5,6"
  ],
  [
    "254",
    "8"
  ],
  [
    "255",
    "4"
  ],
  [
    "256",
    "Deja aproximadamente al 75% de los datos en o bajo ese valor"
  ],
  [
    "257",
    "8"
  ],
  [
    "258",
    "0,65"
  ],
  [
    "259",
    "7/10"
  ],
  [
    "260",
    "1/4"
  ],
  [
    "261",
    "1/10"
  ],
  [
    "262",
    "2/3"
  ],
  [
    "263",
    "0"
  ],
  [
    "264",
    "20"
  ],
  [
    "265",
    "Mar y Mié"
  ],
  [
    "266",
    "15 min"
  ],
  [
    "267",
    "9"
  ],
  [
    "268",
    "40%"
  ],
  [
    "269",
    "3/10"
  ],
  [
    "270",
    "25%"
  ],
  [
    "271",
    "$25.000"
  ],
  [
    "272",
    "3"
  ],
  [
    "273",
    "−2"
  ],
  [
    "274",
    "17"
  ],
  [
    "275",
    "$4"
  ],
  [
    "276",
    "96 m²"
  ],
  [
    "277",
    "26 m"
  ],
  [
    "278",
    "30 cm²"
  ],
  [
    "279",
    "48 cm²"
  ],
  [
    "280",
    "Bastián: queda al 96% del valor original."
  ],
  [
    "281",
    "5/6 es mayor porque 10/12 supera 9/12."
  ],
  [
    "282",
    "3⁻²=1/9 porque el exponente negativo indica el recíproco."
  ],
  [
    "283",
    "Es verdadero porque 1÷4=0,25."
  ],
  [
    "284",
    "Debe obtener x > −4 porque dividió por un número negativo."
  ],
  [
    "285",
    "No multiplicó el 3 por 2 al distribuir."
  ],
  [
    "286",
    "Es incorrecto: $500 es fijo y cada uso aumenta $200."
  ],
  [
    "287",
    "No tiene soluciones reales: x² no puede ser −4 si x es real."
  ],
  [
    "288",
    "El área queda nueve veces mayor."
  ],
  [
    "289",
    "Que c sea el lado opuesto al ángulo recto."
  ],
  [
    "290",
    "Se cuadruplica."
  ],
  [
    "291",
    "Las longitudes de sus lados se conservan."
  ],
  [
    "292",
    "La mediana es 3; el promedio es 35."
  ],
  [
    "293",
    "Si sale azul primero, quedan 1 azul entre 4 fichas."
  ],
  [
    "294",
    "Cara y sello no pueden ocurrir juntos en un lanzamiento; la probabilidad es 0."
  ],
  [
    "295",
    "El 50% central del curso B está en un intervalo más estrecho."
  ]
]);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const source=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source,'Script de aplicación presente');
const context=vm.createContext({
  document:{getElementById:()=>({innerHTML:''})},
  window:{scrollTo(){}},
  localStorage:{getItem:()=>null,setItem(){},removeItem(){}}
});
vm.runInContext(source,context);
const catalog=vm.runInContext('catalog',context);
test('clave editorial M1: 116 respuestas esperadas sin ítems omitidos',()=>{
  assert.equal(expected.size,116);
  assert.equal(catalog.length,116);
  assert.equal(new Set(catalog.map(q=>q.id)).size,catalog.length);
  for(const q of catalog){
    assert.ok(expected.has(String(q.id)),'Sin segunda clave para '+q.id);
    assert.equal(q.options[q.answer],expected.get(String(q.id)),'Respuesta discrepante para '+q.id);
    assert.equal(q.explanations.length,q.options.length,'Falta explicación en '+q.id);
    assert.ok(q.steps.every(step=>step.trim().length>=5),'Paso vacío en '+q.id);
  }
});
test('PAES M1: cuatro ejes y dificultad pedagógica definida',()=>{
  assert.equal(new Set(catalog.map(q=>vm.runInContext('axisOf(catalog.find(x=>x.id==='+q.id+'))',context))).size,4);
  assert.equal(catalog.every(q=>['inicial','intermedio','desafío'].includes(vm.runInContext('difficultyOf(catalog.find(x=>x.id==='+q.id+'))',context))),true);
});
