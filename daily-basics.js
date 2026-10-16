/* Short, authored prerequisite lessons. These checks are separate from the 623 PAES items. */
(function(g){'use strict';
 const q=(id,prompt,options,answer,why,visual)=>({id,prompt,options,answer,why,visual});
 const lessons=[
 {id:'cantidad',title:'Números y cantidades',goal:'Relacionar un número con una cantidad y comparar cantidades.',cards:[
 {title:'Un número cuenta algo',text:'Si hay tres lápices, escribimos 3. Cada lápiz cuenta una vez. El cero, 0, significa que no hay ninguno.',visual:{type:'dots',rows:1,cols:3}},
 {title:'Más grande, más cantidad',text:'En la recta, los números crecen hacia la derecha. Cinco está después de tres: 5 representa más unidades que 3.',visual:{type:'line',from:0,to:6,start:3,end:5}},
 {title:'Probemos juntos',text:'Veo dos grupos de tres puntos. Al contar uno por uno llego a seis. El número 6 representa todos los puntos, no solo un grupo.',visual:{type:'dots',rows:2,cols:3}}],checks:[
 q('cantidad-1','Cuenta los puntos. ¿Cuántos hay?',['5','6','8','10'],2,'Hay dos filas de cuatro: contamos 1, 2, 3, 4 y después 5, 6, 7, 8.',{type:'dots',rows:2,cols:4}),
 q('cantidad-2','Una caja tiene 6 lápices y otra tiene 9. ¿Cuál tiene más?',['La de 6','La de 9','Tienen lo mismo','No se puede saber'],1,'Nueve está más a la derecha que seis en la recta: representa tres lápices más.',{type:'compare',a:6,b:9}),
 q('cantidad-3','No quedó ninguna ficha en una bolsa. ¿Qué número representa esa cantidad?',['1','10','0','2'],2,'Cero representa ausencia de fichas. Uno significaría que todavía queda una.'),
 q('cantidad-4','¿Qué número está inmediatamente después de 7 al contar?',['6','8','9','5'],1,'Contamos 6, 7, 8. Avanzar una unidad desde siete nos lleva a ocho.',{type:'line',from:4,to:10,start:7})]},
 {id:'sumar',title:'Juntar y quitar',goal:'Entender qué hacen la suma y la resta antes de usar reglas.',cards:[
 {title:'Sumar es juntar',text:'Tienes tres fichas y recibes dos más. Conservas las tres y agregas dos: cuatro, cinco. Escribimos 3 + 2 = 5.',visual:{type:'addition',a:3,b:2}},
 {title:'Restar es quitar o comparar',text:'De cinco fichas entregas dos. Quedan tres: 5 − 2 = 3. También puedes preguntar cuántas unidades hay entre dos cantidades.',visual:{type:'line',from:0,to:6,start:5,end:3}},
 {title:'Una operación comprueba la otra',text:'Si 5 − 2 = 3, devolver esas dos fichas recupera cinco: 3 + 2 = 5. La suma nos sirve para revisar una resta.',visual:{type:'addition',a:3,b:2}}],checks:[
 q('sumar-1','Hay 4 cuadernos en una mesa y agregas 3. ¿Cuántos hay ahora?',['1','6','7','12'],2,'Juntamos ambas cantidades: 4 + 3 = 7. Restar daría la diferencia, no el total.',{type:'addition',a:4,b:3}),
 q('sumar-2','Tenías 9 monedas y entregaste 4. ¿Cuántas conservas?',['13','5','4','6'],1,'Quitar cuatro a nueve deja cinco. Comprobamos: 5 + 4 = 9.'),
 q('sumar-3','Un equipo tiene 8 integrantes y otro 5. ¿Cuántos más tiene el primero?',['13','5','3','8'],2,'Buscamos la diferencia: 8 − 5 = 3. Juntar ambos equipos respondería otra pregunta.'),
 q('sumar-4','El marcador partió en 0 y avanzó 6 lugares. ¿Dónde quedó?',['0','−6','12','6'],3,'Partir en cero y agregar seis es 0 + 6 = 6.',{type:'line',from:0,to:8,start:0})]},
 {id:'repartir',title:'Grupos y repartos',goal:'Conectar multiplicar con grupos iguales y dividir con repartir.',cards:[
 {title:'Multiplicar reúne grupos iguales',text:'Tres grupos de cuatro fichas contienen 4 + 4 + 4 = 12 fichas. Abreviamos esa suma como 3 × 4 = 12.',visual:{type:'dots',rows:3,cols:4}},
 {title:'Dividir reparte en partes iguales',text:'Repartir doce fichas entre tres personas deja cuatro para cada una: 12 ÷ 3 = 4. Cada persona debe recibir lo mismo.',visual:{type:'groups',rows:3,cols:4}},
 {title:'Comprobar un reparto',text:'Si tres personas reciben cuatro cada una, recuperamos las doce fichas: 3 × 4 = 12. Multiplicar comprueba nuestra división.'}],checks:[
 q('repartir-1','Hay 2 filas con 5 sillas cada una. ¿Cuántas sillas hay?',['7','10','3','25'],1,'Son dos grupos iguales de cinco: 5 + 5 = 10, o 2 × 5 = 10.',{type:'dots',rows:2,cols:5}),
 q('repartir-2','Repartes 12 fichas por igual entre 4 personas. ¿Cuántas recibe cada una?',['4','8','3','16'],2,'Doce dividido entre cuatro es tres. Comprobamos: 4 personas × 3 fichas = 12.'),
 q('repartir-3','Cada caja contiene 3 jugos. ¿Cuántos hay en 5 cajas?',['8','15','2','10'],1,'Cinco grupos de tres son 3 + 3 + 3 + 3 + 3 = 15, o 5 × 3 = 15.'),
 q('repartir-4','Se distribuyen 20 plantas en 5 filas iguales. ¿Cuántas van por fila?',['25','15','5','4'],3,'Repartimos veinte en cinco grupos: 20 ÷ 5 = 4. Cinco filas de cuatro recuperan veinte.') ]},
 {id:'signos',title:'El cero y los números negativos',goal:'Ubicar números respecto de cero y entender cambios.',cards:[
 {title:'El cero es una referencia',text:'Los números positivos quedan a la derecha del cero. Los negativos quedan a su izquierda. Por ejemplo, −2 está dos lugares a la izquierda de 0.',visual:{type:'line',from:-4,to:4,start:-2}},
 {title:'Sumar un cambio positivo',text:'Si la temperatura es −2 grados y sube 3, avanzamos tres lugares a la derecha: −1, 0, 1. Llegamos a 1 grado.',visual:{type:'line',from:-4,to:4,start:-2,end:1}},
 {title:'Bajar nos lleva a la izquierda',text:'Desde 1, bajar 4 significa retroceder a 0, −1, −2, −3. Escribimos 1 − 4 = −3. No desaparecen las unidades: cambiamos de lado respecto de cero.',visual:{type:'line',from:-4,to:4,start:1,end:-3}}],checks:[
 q('signos-1','La temperatura era −1 °C y subió 3 °C. ¿Cuál es ahora?',['−4 °C','−2 °C','2 °C','4 °C'],2,'Desde −1 avanzamos a 0, 1 y 2. El cambio positivo se suma: −1 + 3 = 2.'),
 q('signos-2','Un ascensor está en el piso 2 y baja 5 pisos. ¿A qué piso llega?',['7','−3','3','−7'],1,'Retrocedemos cinco desde 2: 1, 0, −1, −2, −3. Dos menos cinco es −3.'),
 q('signos-3','¿Cuál es mayor: −4 o −1?',['−4','Son iguales','−1','No son comparables'],2,'−1 está más a la derecha en la recta. Estar más cerca de cero entre negativos significa ser mayor.',{type:'line',from:-5,to:1,start:-4,end:-1}),
 q('signos-4','Debes $3 y pagas esos $3 completos. ¿Qué deuda queda?',['$6','$3','−$6','$0'],3,'Cancelar tres de una deuda de tres nos lleva a cero: −3 + 3 = 0. No queda deuda.') ]},
 {id:'fracciones',title:'Partes de un mismo entero',goal:'Entender numerador, denominador y fracciones equivalentes.',cards:[
 {title:'Partir en partes iguales',text:'Imagina una barra dividida en cuatro partes del mismo tamaño. Una de esas partes es un cuarto y se escribe 1/4.',visual:{type:'fraction',parts:4,filled:1}},
 {title:'Qué dicen los dos números',text:'En 1/4, el 4 de abajo cuenta las partes iguales del entero: se llama denominador. El 1 de arriba cuenta cuántas tomamos: se llama numerador.',visual:{type:'fraction',parts:4,filled:1}},
 {title:'Distintos nombres, misma cantidad',text:'Dos de cuatro partes ocupan la misma cantidad que una de dos: 2/4 = 1/2. El tamaño del entero debe ser el mismo para comparar.',visual:{type:'equivalent',parts:4,filled:2}}],checks:[
 q('fracciones-1','¿Qué fracción de la barra está pintada?',['1/4','4/1','3/4','1/3'],0,'Hay cuatro partes iguales en total y una pintada. Por eso el numerador es uno y el denominador cuatro.',{type:'fraction',parts:4,filled:1}),
 q('fracciones-2','Comiste 3 de 6 partes iguales de una torta. ¿Qué parte comiste?',['Toda la torta','Un tercio','La mitad','Un sexto'],2,'Tres es la mitad de seis. La fracción 3/6 representa la misma cantidad que 1/2.',{type:'fraction',parts:6,filled:3}),
 q('fracciones-3','Una unidad se divide en 3 partes iguales y eliges 2. ¿Cómo lo escribes?',['3/2','2/3','1/2','2/1'],1,'El denominador cuenta tres partes en el entero y el numerador las dos elegidas: 2/3.'),
 q('fracciones-4','¿Cuál representa la misma cantidad que 2/4 de un mismo entero?',['1/4','2/8','1/2','4/2'],2,'Dos de cuatro partes son la mitad. Podemos dividir numerador y denominador por dos: 2/4 = 1/2.',{type:'equivalent',parts:4,filled:2}) ]}
 ,{id:'lectura-inicio',subject:'Lectura',title:'Leer para comprender',goal:'Distinguir lo que un texto dice de lo que imaginamos.',cards:[
 {title:'Primero, lee lo que dice',text:'Un texto entrega pistas. Si dice “Camila salió con paraguas porque llovía”, sabemos que llovía; no sabemos si tenía frío.'},
 {title:'Encuentra la evidencia',text:'Para responder, vuelve a la oración que entrega la información. No necesitas adivinar: la respuesta debe apoyarse en palabras del texto.'},
 {title:'Una idea y una conclusión',text:'Si el texto dice “La plaza cerró por reparaciones”, la causa del cierre son las reparaciones. No podemos afirmar que cerró por falta de visitantes.'}],checks:[
 q('lectura-inicio-1','Texto: “Tomás llegó temprano al colegio”. ¿Qué sabemos?',['Tomás llegó temprano','Tomás perdió el bus','Tomás estaba enfermo','Tomás llegó tarde'],0,'La oración afirma explícitamente que Tomás llegó temprano. Las otras opciones agregan información que no aparece.'),
 q('lectura-inicio-2','Texto: “Se suspendió el partido por la lluvia”. ¿Cuál fue la causa?',['Faltaban jugadores','La lluvia','El árbitro llegó tarde','Se acabó el tiempo'],1,'La expresión “por la lluvia” explica directamente la causa. Debemos volver al texto y no inventar motivos.'),
 q('lectura-inicio-3','Texto: “Martina llevó un libro a la biblioteca”. ¿Qué NO podemos asegurar?',['Llevó un libro','Fue a la biblioteca','Compró el libro ayer','El libro estaba con Martina'],2,'El texto nunca dice cuándo ni dónde compró el libro. Una inferencia necesita evidencia, no una suposición.'),
 q('lectura-inicio-4','Texto: “La feria abre los sábados”. ¿Qué día menciona el texto?',['Domingo','Lunes','Viernes','Sábado'],3,'La información está escrita literalmente: los sábados. Localizar significa encontrar el dato sin cambiarlo.')
 ]},
 {id:'ciencias-inicio',subject:'Ciencias',title:'Observar y explicar',goal:'Diferenciar observaciones, hipótesis y pruebas.',cards:[
 {title:'La ciencia comienza observando',text:'Observar es describir lo que ocurre: “la planta mide 12 cm”. Decir “crece porque está feliz” no es una observación medible.'},
 {title:'Una hipótesis se puede probar',text:'Una hipótesis propone una explicación comprobable. Por ejemplo: “si una planta recibe más luz, crecerá más”, manteniendo iguales las demás condiciones.'},
 {title:'Comparar con justicia',text:'Si quieres estudiar la luz, mantén igual el agua, el tipo de planta y el tiempo. Cambia solo la luz para comparar resultados.'}],checks:[
 q('ciencias-inicio-1','¿Cuál es una observación que se puede medir?',['La planta está contenta','La planta mide 12 cm','La planta quiere sol','La planta es la más linda'],1,'Medir 12 centímetros entrega un dato observable. Las emociones atribuidas a la planta no son mediciones.'),
 q('ciencias-inicio-2','Para probar si la luz cambia el crecimiento, ¿qué conviene variar?',['El agua y la luz','La especie y la tierra','Solo la luz','Todo a la vez'],2,'Cambiar solo la cantidad de luz permite atribuir diferencias de crecimiento a esa variable con mayor confianza.'),
 q('ciencias-inicio-3','¿Cuál es una hipótesis comprobable?',['Las plantas son mágicas','La ciencia es entretenida','La luz es bonita','Con más luz, una planta crecerá más en una semana'],3,'La última afirmación puede ponerse a prueba midiendo el crecimiento bajo distintas condiciones de luz.'),
 q('ciencias-inicio-4','Dos plantas reciben distinta luz. ¿Qué debes mantener igual para comparar?',['La cantidad de agua','El color de las macetas solamente','La hora en que las miras únicamente','Nada'],0,'Mantener igual el agua evita confundir el efecto de la luz con el efecto de un riego diferente.')
 ]},
 {id:'historia-inicio',subject:'Historia',title:'Entender el pasado',goal:'Reconocer fuentes, secuencias y relaciones de causa y consecuencia.',cards:[
 {title:'¿Cómo sabemos qué pasó?',text:'Para estudiar el pasado usamos fuentes: cartas, fotografías, objetos, testimonios y documentos. Cada fuente muestra una parte de lo ocurrido.'},
 {title:'Antes y después',text:'Una línea de tiempo ordena acontecimientos. Si un hecho ocurrió en 1810 y otro en 1818, el de 1810 ocurrió primero.'},
 {title:'Causas y consecuencias',text:'Una causa ayuda a explicar por qué ocurrió un hecho; una consecuencia es algo que pasó después debido a él. No todo lo que viene después es necesariamente una consecuencia.'}],checks:[
 q('historia-inicio-1','¿Cuál de estos objetos puede ser una fuente para estudiar el pasado?',['Una fotografía antigua','Una predicción del futuro','Una suposición sin evidencia','Una opinión inventada'],0,'Una fotografía antigua conserva información de una época. Como toda fuente, debe interpretarse en su contexto.'),
 q('historia-inicio-2','¿Qué año ocurrió primero?',['2020','1818','1810','1900'],2,'En una línea de tiempo los años menores de la misma era ocurren antes: 1810 es anterior a 1818.'),
 q('historia-inicio-3','Si una inundación destruye un puente, ¿qué es la destrucción del puente?',['Una fuente oral','Una causa de la lluvia','Un hecho sin relación','Una consecuencia de la inundación'],3,'La inundación es el hecho que provocó el daño; la destrucción del puente es una consecuencia.'),
 q('historia-inicio-4','Para conocer cómo vivía una familia hace cien años, ¿qué serviría más?',['Inventar su rutina','Examinar cartas y fotografías de la época','Suponer que vivía igual que hoy','Consultar solo rumores actuales'],1,'Las cartas y fotografías de la época son fuentes que pueden aportar evidencias sobre la vida cotidiana.')
 ]}

 ];
 function attach(engine){const s=engine.state;s.basics=s.basics&&typeof s.basics==='object'?s.basics:{};const validDraft=d=>d&&lessons.some(l=>l.id===d.lesson)&&['learn','practice'].includes(d.stage)&&Number.isInteger(d.card)&&Array.isArray(d.queue)&&d.queue.every(id=>lessons.find(l=>l.id===d.lesson).checks.some(q=>q.id===id))&&Number.isInteger(d.index)&&d.index>=0&&d.index<d.queue.length&&Array.isArray(d.results);if(s.foundationDraft&&!validDraft(s.foundationDraft))s.foundationDraft=null;
 const lesson=id=>lessons.find(l=>l.id===id),status=id=>{const h=s.basics[id]?.history||[];let evidence=new Set(),mastered=false;for(const r of h){if(!r.correct||r.hinted)evidence.clear();else evidence.add(r.id);if(evidence.size>=2)mastered=true;}return{complete:mastered,evidence:evidence.size,needsReview:mastered&&evidence.size<2,attempts:h.length};};
 function start(id){if(engine.state.session||s.foundationDraft)return false;const l=lesson(id);if(!l)return false;const used=new Set((s.basics[id]?.history||[]).map(r=>r.id));const queue=[...l.checks.filter(q=>!used.has(q.id)),...l.checks.filter(q=>used.has(q.id))].map(q=>q.id);s.foundationDraft={lesson:id,stage:'learn',card:0,queue,index:0,selected:null,checked:false,hinted:false,reviewMode:status(id).complete,results:[],started:Date.now()};engine.save();return true;}
 function current(){const d=s.foundationDraft;return d&&lesson(d.lesson).checks.find(q=>q.id===d.queue[d.index]);}
 function answer(index){const d=s.foundationDraft,q=current();if(!d||d.checked||!Number.isInteger(index)||index<0||index>=q.options.length)return null;const r={id:q.id,selected:index,correct:index===q.answer,hinted:d.hinted,at:Date.now()};d.results.push(r);(s.basics[d.lesson]||={history:[]}).history.push(r);d.checked=true;d.selected=index;const key='basic:'+q.id,date=g.CachasteDaily.day(Date.now()),today=s.days[date]||={keys:[],xp:0};if(!today.keys.includes(key)){today.keys.push(key);today.xp+=r.correct?15:10;}engine.save();return r;}
 function next(){const d=s.foundationDraft;if(!d?.checked)return false;const done=(d.reviewMode?d.results.length>=2:status(d.lesson).complete)||d.index+1>=d.queue.length;if(done){s.completed.push({id:'basic-'+d.started,subject:lesson(d.lesson).subject||'M1',mode:'foundation',lesson:d.lesson,at:Date.now(),total:d.results.length,correct:d.results.filter(r=>r.correct).length});s.foundationDraft=null;}else{d.index++;d.selected=null;d.checked=false;d.hinted=false;}engine.save();return done;}
 return{lessons,lesson,status,start,current,answer,next};}
 g.CachasteBasics={lessons,attach};
})(typeof window==='undefined'?globalThis:window);
