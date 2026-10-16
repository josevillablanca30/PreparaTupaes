/* ¿Cachaste? Five pilot PAES workshops. Original micro-lessons informed by
   DEMRE Regular 2026/Admisión 2027 axes and indexes of the user's CPECH/PDV
   reference library. Do not reproduce or label as DEMRE official items.
   Real PAES-style evidence is assessed separately by daily-core.js. */
(function(g){'use strict';
 const lessons=[
  {id:'m1-ecuaciones',subject:'M1',concept:'Ecuación lineal',title:'Ecuaciones que explican situaciones',axis:'Álgebra y funciones',source:'DEMRE M1 · CPECH/PDV Álgebra',
   intro:'Una ecuación es un modelo: expresa una relación que debe mantenerse. En PAES importa plantearla, despejar y comprobar qué significa la solución.',
   goals:['Modelar una situación con una incógnita','Aplicar operaciones equivalentes en ambos lados','Comprobar la solución en el contexto'],
   cards:[
    {title:'Modelar antes de operar',text:'Un servicio cobra $2.500 fijos más $1.200 por cada viaje. Si el total es $8.500, la relación es 2.500 + 1.200x = 8.500. La incógnita x representa cantidad de viajes, no dinero.'},
    {title:'Conservar la igualdad',text:'Restar 2.500 en ambos lados da 1.200x = 6.000; dividir ambos lados por 1.200 da x = 5. Evita “pasar” términos sin explicar la operación equivalente.'},
    {title:'Interpretar y comprobar',text:'Cinco viajes cuestan 2.500 + 1.200×5 = 8.500. La comprobación detecta errores de signo y también respuestas que no tienen sentido en la situación.'}
   ],
   pairs:[
    {prompt:'Antes de despejar',answer:'Identificar qué representa x y escribir la igualdad',why:'Una ecuación mal planteada no se arregla haciendo operaciones correctas.'},
    {prompt:'Al quitar un término fijo',answer:'Realizar la misma operación en ambos lados',why:'La transformación debe conservar el conjunto de soluciones.'},
    {prompt:'Después de hallar x',answer:'Sustituir su valor en el modelo inicial',why:'La sustitución verifica tanto el cálculo como la interpretación.'}
   ],
   confusion:'Si confundes la cantidad fija con la variable, vuelve a escribir la expresión antes de despejar.'
  },
  {id:'m2-vertice',subject:'M2',concept:'Vértice de una cuadrática',title:'El punto decisivo de una parábola',axis:'Álgebra y funciones',source:'DEMRE M2 · TESLA M2 Funciones · PDV M2',
   intro:'Las funciones cuadráticas permiten optimizar situaciones. El vértice no es un número que se memoriza: es el extremo de la función y debe interpretarse.',
   goals:['Interpretar la forma de vértice','Distinguir máximos y mínimos','Validar la solución usando el modelo'],
   cards:[
    {title:'Reconoce el extremo',text:'En f(x) = (x−2)²−3, el cuadrado nunca es negativo. La menor altura es −3 y ocurre en x = 2. El vértice es el punto (2, −3).'},
    {title:'El signo cambia todo',text:'Si la función es f(x) = −(x−2)²+5, el término cuadrático ahora resta. La función tiene un máximo 5 cuando x = 2.'},
    {title:'Verifica valores cercanos',text:'Comparar f(1), f(2) y f(3) ayuda a comprobar si el extremo es máximo o mínimo. En problemas contextualizados verifica también el dominio permitido de x.'}
   ],
   pairs:[
    {prompt:'f(x) = (x−2)²−3',answer:'Mínimo −3 cuando x = 2',why:'El coeficiente del cuadrado es positivo; el vértice representa el menor valor.'},
    {prompt:'g(x) = −(x−1)²+4',answer:'Máximo 4 cuando x = 1',why:'El cuadrado se resta: el vértice ahora es el mayor valor.'},
    {prompt:'Optimización con x restringido a [0,1]',answer:'Comparar el vértice con los extremos del intervalo',why:'Un vértice fuera del dominio no responde por sí solo al problema contextual.'}
   ],
   confusion:'La coordenada x del vértice señala dónde ocurre el extremo; la coordenada y indica el valor máximo o mínimo.'
  },
  {id:'lectura-conclusiones',subject:'Lectura',concept:'Límites de una conclusión',title:'¿Qué permite concluir el texto?',axis:'Interpretar',source:'DEMRE Competencia Lectora · PDV lectura intensiva LE01 · CPECH Lectora',
   intro:'Comprender es saber hasta dónde llega la evidencia de un texto. Muchas alternativas fallan no por ser absurdas, sino por exagerar lo que se puede inferir.',
   goals:['Diferenciar dato observado de generalización','Reconocer matices y restricciones','Fundamentar una inferencia en evidencia textual'],
   cards:[
    {title:'Los límites de una muestra',text:'Un reportaje indica que mejoró la asistencia en dos escuelas tras una medida. Puedes afirmar lo observado en esas escuelas, no que todos los establecimientos del país obtendrán el mismo resultado.'},
    {title:'Atiende al grado de certeza',text:'“Podría aumentar”, “se asocia a” y “siempre aumenta” no significan lo mismo. Una alternativa que transforma una posibilidad en certeza añade información que el autor no sostuvo.'},
    {title:'Relación no equivale a causa demostrada',text:'Que dos fenómenos ocurran juntos no prueba por sí solo que uno produjo al otro. Compara la pregunta con el texto y busca qué explicación alternativa permanece abierta.'}
   ],
   pairs:[
    {prompt:'“Se observó en dos colegios”',answer:'Conclusión acotada a esos establecimientos',why:'La evidencia no cubre todos los colegios de Chile.'},
    {prompt:'“El resultado podría mejorar”',answer:'Posibilidad, no consecuencia garantizada',why:'El condicional expresa un grado de certeza limitado.'},
    {prompt:'“Ambos indicadores aumentaron”',answer:'Asociación observada, sin causalidad automática',why:'Para hablar de causas se necesitan más antecedentes.'}
   ],
   confusion:'Cuando una alternativa agrega “todos”, “siempre” o “demuestra”, revisa si el texto entrega evidencia suficiente.'
  },
  {id:'ciencias-redes',subject:'Ciencias',concept:'Redes tróficas y energía',title:'Seguir la energía de un ecosistema',axis:'Biología',source:'DEMRE Ciencias · CPECH Biología Ecología · PDV Biología',
   intro:'Las redes tróficas exigen relacionar organismos, energía y cambios en el sistema. La habilidad PAES es explicar consecuencias a partir de datos o un modelo.',
   goals:['Identificar la dirección del flujo energético','Inferir efectos de cambios en poblaciones','Separar flujo energético y reciclaje de materia'],
   cards:[
    {title:'La flecha indica transferencia',text:'En pasto → conejo → zorro, la flecha va desde el recurso consumido hacia quien lo consume. El conejo recibe energía química del pasto; el zorro la obtiene al alimentarse del conejo.'},
    {title:'Un cambio altera relaciones',text:'Si una población de herbívoros cae, un depredador especializado podría disponer de menos alimento. El efecto real depende de si hay presas alternativas y otras relaciones tróficas.'},
    {title:'La materia y la energía no siguen el mismo ciclo',text:'La materia puede reciclarse mediante descomponedores; la energía fluye por los niveles tróficos y parte se disipa como calor. Evita afirmar que la energía “regresa” intacta a los productores.'}
   ],
   pairs:[
    {prompt:'Pasto → conejo',answer:'Transferencia de energía del productor al consumidor',why:'La flecha indica la dirección de la transferencia de materia y energía alimentaria.'},
    {prompt:'Disminuyen los conejos',answer:'Posible menor alimento para un zorro especializado',why:'La respuesta depende de toda la red y no implica un efecto idéntico en cada ecosistema.'},
    {prompt:'Los descomponedores transforman restos',answer:'Materia reutilizable en el ecosistema',why:'Los nutrientes pueden reincorporarse; la energía se disipa y no se recicla del mismo modo.'}
   ],
   confusion:'Las flechas no indican quién persigue a quién: indican la dirección de la transferencia energética.'
  },
  {id:'historia-poderes',subject:'Historia',concept:'Funciones y separación de poderes',title:'¿Quién decide qué en una democracia?',axis:'Formación ciudadana',source:'DEMRE Historia/FC · CPECH Formación Ciudadana · TESLA FC',
   intro:'Analizar instituciones democráticas exige reconocer funciones, controles y límites del poder. No basta memorizar los nombres de tres órganos.',
   goals:['Diferenciar funciones estatales','Analizar controles institucionales','Justificar decisiones con el principio de Estado de derecho'],
   cards:[
    {title:'El Estado no es una sola autoridad',text:'En Chile, el Poder Ejecutivo dirige el gobierno y administra el Estado dentro de sus atribuciones; el Legislativo participa en elaborar y aprobar leyes; los tribunales ejercen jurisdicción al resolver conflictos conforme al derecho.'},
    {title:'Separar poder también implica controlarlo',text:'La separación de funciones evita concentrar todas las decisiones en una autoridad. La fiscalización parlamentaria y el control judicial operan con procedimientos y límites establecidos en el ordenamiento jurídico.'},
    {title:'Analiza un caso, no solo una definición',text:'Si una autoridad dicta una medida sin competencia legal, el problema es de límites al poder. Para interpretarlo identifica la atribución discutida, la institución competente y qué mecanismo permite revisarla.'}
   ],
   pairs:[
    {prompt:'Una ley necesita discusión y aprobación parlamentaria',answer:'Función legislativa',why:'En Chile el Congreso interviene en la formación de las leyes, junto con las atribuciones del Ejecutivo previstas por la Constitución.'},
    {prompt:'Un tribunal resuelve una controversia jurídica',answer:'Función jurisdiccional',why:'Los tribunales conocen y resuelven causas conforme al derecho; no sustituyen al Legislativo.'},
    {prompt:'Una autoridad administra un servicio público',answer:'Función ejecutiva y administrativa',why:'La administración opera dentro de las competencias que establece el ordenamiento jurídico.'}
   ],
   confusion:'La separación de poderes no significa aislamiento absoluto: significa competencias diferenciadas y controles entre instituciones.'
  }
 ];
 const byId=new Map(lessons.map(l=>[l.id,l]));
 const byConcept=new Map(lessons.map(l=>[l.subject+':'+l.concept,l]));
 function get(s,c){return byConcept.get(s+':'+c)||null;}
 function start(lesson){if(!lesson)return null;return{version:1,id:lesson.id,stage:'learn',card:0,round:0,selected:null,checked:false,mistakes:0,correct:0,seen:[],started:Date.now()};}
 function valid(d){const l=byId.get(d?.id);return!!l&&d.version===1&&['learn','match','complete'].includes(d.stage)&&Number.isInteger(d.card)&&d.card>=0&&d.card<l.cards.length&&Number.isInteger(d.round)&&d.round>=0&&d.round<=l.pairs.length&&Array.isArray(d.seen)&&Number.isInteger(d.mistakes)&&d.mistakes>=0&&Number.isInteger(d.correct)&&d.correct>=0&&typeof d.checked==='boolean'&&(d.selected===null||Number.isInteger(d.selected)&&d.selected>=0&&d.selected<l.pairs.length);}
 function choices(l,round){const ids=Array.from({length:l.pairs.length},(_,i)=>i);let hash=0;for(const c of l.id+':'+round)hash=(Math.imul(hash,31)+c.charCodeAt(0))>>>0;for(let i=ids.length-1;i>0;i--){hash=(Math.imul(hash,1664525)+1013904223)>>>0;const j=hash%(i+1);[ids[i],ids[j]]=[ids[j],ids[i]];}return ids;}
 function nextCard(d){if(!valid(d)||d.stage!=='learn')return false;const l=byId.get(d.id);if(d.card+1<l.cards.length)d.card++;else d.stage='match';return true;}
 function choose(d,id){if(!valid(d)||d.stage!=='match'||d.checked||!Number.isInteger(id)||id<0||id>=byId.get(d.id).pairs.length)return false;d.selected=id;return true;}
 function check(d){if(!valid(d)||d.stage!=='match'||d.checked||d.selected===null)return null;const ok=d.selected===d.round;d.checked=true;d.correct+=ok?1:0;d.mistakes+=ok?0:1;d.seen.push({round:d.round,selected:d.selected,correct:ok});return ok;}
 function advance(d){if(!valid(d)||d.stage!=='match'||!d.checked)return false;const l=byId.get(d.id);d.round++;d.selected=null;d.checked=false;if(d.round>=l.pairs.length)d.stage='complete';return true;}
 function retry(d){if(!valid(d)||d.stage!=='complete')return false;d.stage='match';d.round=0;d.selected=null;d.checked=false;d.correct=0;d.mistakes=0;d.seen=[];return true;}
 g.CachasteStudios={lessons,get,byId,valid,start,choices,nextCard,choose,check,advance,retry};
})(typeof window==='undefined'?globalThis:window);
