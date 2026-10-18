/* M2: banco inicial de elaboración original; práctica formativa, no DEMRE oficial. */
window.CACHASTE_M2=[
['Funciones','Si f(x)=x²-4x+1, ¿en qué valor de x alcanza su mínimo?',['x=2','x=4','x=-2','x=0'],0,'Completa el cuadrado: f(x)=(x-2)²-3. El cuadrado es mínimo cuando x=2.','El vértice de una parábola indica su extremo.'],
['Funciones','Si g(x)=2^x, ¿cuál es g(3)-g(1)?',['6','4','8','2'],0,'Primero evalúa ambas potencias: 2³=8 y 2¹=2. Después resta los resultados: 8-2=6. No restes los exponentes.','Evalúa cada potencia antes de restar.'],
['Probabilidad','En una bolsa hay 3 fichas rojas y 2 azules. Si se extraen dos sin reposición, ¿cuál es la probabilidad de que ambas sean rojas?',['3/10','9/25','3/5','1/5'],0,'P(roja y roja)=(3/5)·(2/4)=6/20=3/10.','Sin reposición, el total disminuye después de la primera extracción.'],
['Probabilidad','Si P(A)=0,4 y P(B)=0,5 y son independientes, ¿cuál es P(A∩B)?',['0,2','0,9','0,1','0,45'],0,'Para eventos independientes, P(A∩B)=P(A)·P(B)=0,4·0,5=0,2.','Recuerda la regla del producto para independencia.'],
['Geometría','Un círculo de radio 3 tiene un sector de 120°. ¿Cuál es el área del sector?',['3π','6π','9π','2π'],0,'El sector representa 120/360=1/3 del círculo: (1/3)·π·3²=3π.','Calcula qué fracción de la circunferencia corresponde al ángulo central.'],
['Geometría','¿Cuál es la distancia entre los puntos (1,2) y (4,6)?',['5','7','4','√7'],0,'Por Pitágoras: √((4-1)²+(6-2)²)=√(9+16)=5.','Calcula primero las diferencias horizontal y vertical.'],
['Álgebra','¿Qué solución tiene la ecuación log₂(x)=3?',['8','6','9','1'],0,'La definición de logaritmo equivale a 2³=x, por tanto x=8.','Convierte la igualdad logarítmica a una potencia.'],
['Álgebra','Si a>0 y a²=49, ¿cuánto vale a?',['7','-7','49','14'],0,'Las raíces de a²=49 son ±7, pero a>0 exige a=7.','No olvides la restricción del enunciado.'],
['Modelación','Un capital de $100.000 crece un 10% anual compuesto. ¿Cuánto habrá tras dos años?',['$121.000','$120.000','$110.000','$122.000'],0,'100.000·1,1²=121.000; el segundo aumento se aplica sobre 110.000.','El crecimiento compuesto multiplica, no suma porcentajes sobre la base inicial.'],
['Modelación','Un modelo lineal pasa por (0,5) y (2,11). ¿Cuál es su pendiente?',['3','6','2','5'],0,'La pendiente es (11-5)/(2-0)=6/2=3.','Usa cambio vertical dividido por cambio horizontal.']
].map(([area,question,options,answer,why,hint],i)=>({id:'M2-'+String(i+1).padStart(3,'0'),area,question,options,answer,why,hint,origin:'original'}));

window.CACHASTE_M2.push(...[
['Funciones','¿Cuál es el dominio real de h(x)=√(x-5)?',['x≥5','x>0','x≤5','Todos los reales'],0,'Para obtener una raíz cuadrada real, el radicando debe ser no negativo: x-5≥0; por eso x≥5.','Establece la desigualdad del interior de la raíz.'],
['Funciones','¿Cuál es el valor de f(2) si f(x)=3x²-2x?',['8','4','12','16'],0,'Sustituye x=2: 3·2²-2·2=12-4=8. Primero resuelve la potencia y luego las multiplicaciones.','Respeta el orden de operaciones.'],
['Funciones','Si f(x)=x+2 y g(x)=x², ¿cuál es (g∘f)(3)?',['25','11','13','7'],0,'La composición g(f(3)) exige calcular primero f(3)=5 y luego g(5)=25.','En una composición se evalúa primero la función interior.'],
['Probabilidad','Una moneda equilibrada se lanza tres veces. ¿Cuál es la probabilidad de obtener tres caras?',['1/8','1/3','3/8','1/6'],0,'Cada lanzamiento tiene probabilidad 1/2 de cara y son independientes: (1/2)³=1/8.','Multiplica las probabilidades de eventos independientes.'],
['Probabilidad','Se elige un número del 1 al 10 de manera uniforme. ¿Cuál es la probabilidad de que sea múltiplo de 3?',['3/10','1/3','1/5','4/10'],0,'Los múltiplos de 3 en el conjunto son 3, 6 y 9: tres casos favorables entre diez posibles.','Enumera los casos antes de dividir.'],
['Geometría','¿Cuál es la pendiente de una recta perpendicular a otra de pendiente 2?',['-1/2','2','1/2','-2'],0,'Las pendientes de rectas perpendiculares no verticales cumplen m₁·m₂=-1; así m₂=-1/2.','Usa el recíproco con signo contrario.'],
['Geometría','Un vector v=(3,4). ¿Cuál es su magnitud?',['5','7','12','√7'],0,'La magnitud de (a,b) es √(a²+b²). Para (3,4): √(9+16)=5.','Aplica el teorema de Pitágoras a las componentes.'],
['Álgebra','¿Cuál es la solución de 2^(x+1)=16?',['3','4','5','2'],0,'Como 16=2⁴, se igualan exponentes: x+1=4, luego x=3.','Expresa ambos lados con la misma base.'],
['Álgebra','¿Cuál es el resultado de (x+3)(x-3)?',['x²-9','x²+9','x²-6x+9','x²+6x-9'],0,'Es una diferencia de cuadrados: (a+b)(a-b)=a²-b². Por tanto, x²-9.','Reconoce los factores conjugados.'],
['Modelación','Una población de 200 bacterias se duplica cada hora. ¿Cuántas hay después de tres horas?',['1600','600','800','1200'],0,'El modelo exponencial es 200·2³. Tras tres duplicaciones, 200·8=1600.','No confundas duplicar tres veces con multiplicar por tres.']
].map(([area,question,options,answer,why,hint],i)=>({id:'M2-'+String(i+11).padStart(3,'0'),area,question,options,answer,why,hint,origin:'original'})));

window.CACHASTE_M2.push(...[["Funciones","Si f(x)=2x+3, ¿qué valor de x cumple f(x)=15?",["6","9","12","4"],0,"Resuelve 2x+3=15: resta 3 y divide por 2. Se obtiene x=6.","Despeja la incógnita antes de reemplazar."],["Funciones","¿Cuál es la imagen de x=-2 bajo f(x)=x²+3?",["7","1","-1","5"],0,"Sustituye -2 y eleva al cuadrado: (-2)²+3=4+3=7.","El cuadrado de un número negativo es positivo."],["Funciones","¿Cuál es el eje de simetría de y=(x+4)²-1?",["x=-4","x=4","y=-1","x=1"],0,"La forma de vértice y=(x-h)²+k muestra h=-4. El eje vertical es x=-4.","Observa el signo dentro del paréntesis."],["Funciones","Si una función exponencial es f(x)=3·2^x, ¿cuál es f(2)?",["12","9","6","18"],0,"Calcula primero 2²=4 y después multiplica por 3. Así f(2)=12.","La potencia se calcula antes del producto."],["Funciones","¿Cuál es la inversa de f(x)=3x-6?",["(x+6)/3","3x+6","(x-6)/3","x/3-6"],0,"Escribe y=3x-6 e intercambia x e y. Despeja y=(x+6)/3.","Intercambia las variables y despeja."],["Álgebra","Resuelve el sistema x+y=10 y x-y=4. ¿Cuál es x?",["7","6","3","14"],0,"Suma ambas ecuaciones: 2x=14, por lo que x=7.","Sumar las ecuaciones elimina y."],["Álgebra","¿Qué valor satisface |x-3|=5 y x>3?",["8","-2","5","3"],0,"Para x>3 se cumple x-3=5; despejando resulta x=8.","El valor absoluto admite dos ramas, pero hay una restricción."],["Álgebra","¿Cuánto vale log₁₀(1000)?",["3","10","100","2"],0,"Un logaritmo indica el exponente: 10³=1000. Por ello log₁₀(1000)=3.","Busca la potencia de diez equivalente."],["Álgebra","¿Cuál es el discriminante de x²-4x+4=0?",["0","4","-4","16"],0,"El discriminante es b²-4ac. Con a=1, b=-4 y c=4: 16-16=0.","Aplica la fórmula del discriminante."],["Álgebra","Si 3x-5>7, ¿qué desigualdad cumple x?",["x>4","x<4","x>2","x≥4"],0,"Suma cinco: 3x>12. Divide por tres positivo y resulta x>4.","Dividir por un número positivo conserva el signo."],["Geometría","¿Cuál es el área de un triángulo de base 8 y altura 5?",["20","40","13","26"],0,"El área de un triángulo es base por altura dividido por dos: 8·5/2=20.","Recuerda el factor un medio."],["Geometría","Un triángulo rectángulo tiene catetos 5 y 12. ¿Cuánto mide su hipotenusa?",["13","17","10","12"],0,"Por Pitágoras, la hipotenusa es √(5²+12²)=√169=13.","Suma los cuadrados de ambos catetos."],["Geometría","¿Cuál es la distancia entre (-1,0) y (2,4)?",["5","7","4","√13"],0,"Las diferencias de coordenadas son 3 y 4. La distancia es √(3²+4²)=5.","Usa la fórmula de distancia entre dos puntos."],["Geometría","¿Cuánto mide el ángulo interior de un hexágono regular?",["120°","60°","90°","135°"],0,"La suma de ángulos interiores es (6-2)·180=720°. Divide por seis: 120°.","Usa la fórmula de suma de ángulos interiores."],["Geometría","¿Qué vector se obtiene al sumar (2,-1)+(3,4)?",["(5,3)","(1,5)","(6,-4)","(5,-5)"],0,"La suma vectorial se realiza componente a componente: (2+3,-1+4)=(5,3).","Suma coordenadas correspondientes."],["Probabilidad","Se lanza un dado justo. ¿Cuál es la probabilidad de obtener un número par?",["1/2","1/3","2/3","1/6"],0,"Los resultados pares son 2, 4 y 6: tres de seis resultados equiprobables, o 1/2.","Cuenta resultados favorables entre seis."],["Probabilidad","¿Cuál es la media de los datos 2, 4, 6 y 8?",["5","4","6","20"],0,"Suma los cuatro datos: 20. Divide por la cantidad de datos: 20/4=5.","La media es suma dividida por cantidad."],["Probabilidad","¿Cuál es la mediana de 1, 3, 7, 9 y 12?",["7","3","9","6"],0,"Los cinco valores están ordenados; la mediana es el valor central, el tercero: 7.","Ubica el dato del centro en una lista ordenada."],["Probabilidad","En una urna hay 4 bolas verdes y 6 amarillas. ¿Cuál es P(verde)?",["2/5","3/5","1/4","4/6"],0,"Hay cuatro resultados favorables entre diez bolas: 4/10=2/5.","Divide casos favorables por el total."],["Probabilidad","Si dos eventos son mutuamente excluyentes, ¿cuánto vale P(A∩B)?",["0","1","P(A)+P(B)","P(A)P(B)"],0,"Eventos mutuamente excluyentes no pueden ocurrir juntos, por lo que su intersección es vacía y tiene probabilidad cero.","Piensa si ambos pueden suceder a la vez."],["Modelación","Un taxi cobra $1200 fijos y $500 por kilómetro. ¿Cuánto cuesta recorrer 4 km?",["$3200","$2000","$1700","$4800"],0,"El costo es 1200+500·4=3200 pesos. El cargo fijo se suma una sola vez.","Separa tarifa base y tarifa variable."],["Modelación","Una cantidad disminuye 20% desde 150. ¿Cuál es el valor final?",["120","130","30","180"],0,"Calcula 20% de 150: 30. Luego resta 150-30=120.","Un descuento se resta del valor inicial."],["Modelación","Una recta tiene pendiente -2 y pasa por (0,3). ¿Cuál es su ecuación?",["y=-2x+3","y=2x+3","y=-2x-3","y=3x-2"],0,"En y=mx+b la pendiente es m=-2 y la intersección vertical b=3.","Identifica pendiente e intercepto."],["Modelación","Si una inversión de $1000 gana 5% anual simple durante 2 años, ¿cuál es el total?",["$1100","$1102,50","$1050","$1200"],0,"El interés simple es 1000·0,05·2=100; el capital final es 1100.","En interés simple el porcentaje se calcula sobre el capital inicial."],["Modelación","Una máquina produce 18 piezas por hora. ¿Cuántas fabrica en 5 horas a ritmo constante?",["90","23","72","108"],0,"Multiplica tasa por tiempo: 18 piezas/hora por 5 horas son 90 piezas.","Usa cantidad igual a tasa por tiempo."],["Suficiencia de datos","Se desea determinar x. (1) x+2=7. (2) 2x=10. ¿Qué información es suficiente?",["Cada una por sí sola","Solo (1)","Solo (2)","Ambas juntas, ninguna por sí sola"],0,"La afirmación (1) da x=5 y la (2) también da x=5; cada una permite determinar x sin la otra.","Comprueba si cada afirmación entrega una solución única."],["Suficiencia de datos","Se desea conocer el valor de x. (1) x+y=9. (2) y=4. ¿Qué información es suficiente?",["Ambas juntas, ninguna por sí sola","Solo (1)","Solo (2)","Cada una por sí sola"],0,"La primera ecuación tiene dos incógnitas; la segunda solo fija y. Juntas permiten despejar x=5.","Prueba las afirmaciones individualmente y combinadas."],["Suficiencia de datos","Se desea determinar si x es positivo. (1) x²=9. (2) x>0. ¿Qué información es suficiente?",["Solo (2)","Solo (1)","Ambas juntas, ninguna por sí sola","Cada una por sí sola"],0,"La condición x²=9 admite x=3 o x=-3 y no decide el signo. La afirmación (2) sí asegura que x es positivo.","La pregunta es por el signo, no por el valor exacto."],["Suficiencia de datos","Se desea hallar el área de un rectángulo. (1) Su base mide 6 cm. (2) Su altura mide 4 cm. ¿Qué información es suficiente?",["Ambas juntas, ninguna por sí sola","Solo (1)","Solo (2)","Cada una por sí sola"],0,"El área es base por altura. Con una sola medida no alcanza; ambas juntas dan 6·4=24 cm².","El área requiere dos dimensiones."],["Suficiencia de datos","Se desea determinar x. (1) x²=16. (2) x es un número par. ¿Qué información es suficiente?",["Se requiere información adicional","Solo (1)","Solo (2)","Ambas juntas, ninguna por sí sola"],0,"La primera permite x=4 o -4 y ambas opciones son pares, por lo que la segunda no elimina la ambigüedad.","Comprueba si siguen existiendo dos soluciones posibles."]] .map(([area,question,options,answer,why,hint],i)=>({id:'M2-'+String(i+21).padStart(3,'0'),area,question,options,answer,why,hint,origin:'original'})));

window.CACHASTE_M2.push(...[["Suficiencia de datos","Se desea determinar el perímetro de un cuadrado. (1) Su lado mide 7 cm. (2) Su área es 49 cm². ¿Qué información basta?",["Cada una por sí sola","Solo (1)","Solo (2)","Ambas juntas, ninguna por sí sola"],0,"El lado queda determinado como 7 cm por cualquiera de las afirmaciones; el perímetro es 28 cm.","Comprueba si el área permite recuperar el lado positivo."],["Funciones","¿Cuál es el máximo de f(x)=-(x-1)²+9?",["9","1","-9","0"],0,"El cuadrado es no negativo, por lo que su opuesto es menor o igual a cero; el máximo es 9 cuando x=1.","La forma de vértice permite reconocer el máximo."],["Probabilidad","Al lanzar dos dados, ¿cuál es la probabilidad de sumar 7?",["1/6","1/12","1/3","7/36"],0,"Existen seis pares ordenados con suma 7 entre 36 resultados equiprobables; 6/36=1/6.","Enumera los pares que suman siete."],["Geometría","¿Cuál es el área de un círculo de diámetro 10?",["25π","100π","10π","5π"],0,"El radio es la mitad del diámetro, es decir 5; el área vale π·5²=25π.","Primero transforma diámetro en radio."],["Modelación","Un valor inicial de 80 aumenta un 25%. ¿Cuál es el nuevo valor?",["100","105","95","120"],0,"Un 25% de 80 corresponde a 20; sumado al valor inicial da 100.","Calcula una cuarta parte del valor inicial."]].map(([area,question,options,answer,why,hint],i)=>({id:'M2-'+String(i+51).padStart(3,'0'),area,question,options,answer,why,hint,origin:'original'})));


/* Revisión editorial individual, lote M2-001 a M2-010.
   Fundamento: operaciones algebraicas y reglas matemáticas verificables; la coincidencia
   con un temario no convierte estos ejercicios originales en preguntas oficiales. */
const M2_EDITORIAL_REVIEW={
 'M2-001':{steps:['Completa el cuadrado: x²−4x+1=(x−2)²−3.','Como todo cuadrado real es mayor o igual que cero, (x−2)² alcanza su mínimo 0 cuando x=2.','Por eso el valor mínimo de la función es −3 y ocurre en x=2.'],easy:'La parábola tiene forma de U. Su punto más bajo está en x=2, porque allí el término (x−2)² vale cero.',example:'Compara f(1)=−2, f(2)=−3 y f(3)=−2. El menor valor es −3, y ocurre en x=2.'},
 'M2-002':{steps:['Calcula g(3)=2³=8.','Calcula g(1)=2¹=2.','Resta los valores obtenidos: 8−2=6.'],easy:'Primero resuelve las dos potencias por separado: 8 y 2. Después réstalas: 6.',example:'Una cantidad que se duplica en cada etapa pasa de 2 en la etapa 1 a 8 en la etapa 3. La diferencia es 6.'},
 'M2-003':{steps:['Hay 3 fichas rojas entre 5: P(primera roja)=3/5.','Sin reposición, quedan 2 rojas entre 4: P(segunda roja dada la primera)=2/4.','Multiplica probabilidades condicionadas: (3/5)(2/4)=6/20=3/10.'],easy:'Sacar una ficha roja deja menos fichas en la bolsa. Por eso la segunda probabilidad no sigue siendo 3/5.',example:'De los 5×4=20 pares ordenados posibles de extracciones, 3×2=6 son dos rojas: 6/20=3/10.'},
 'M2-004':{steps:['El enunciado establece que A y B son independientes.','Para eventos independientes se cumple P(A∩B)=P(A)·P(B).','Sustituye: 0,4×0,5=0,2.'],easy:'Que sean independientes significa que saber si ocurre uno no cambia la probabilidad del otro. Por eso se multiplican.',example:'Si una moneda justa da cara con probabilidad 0,5 y otro evento independiente ocurre con probabilidad 0,4, ambos suceden con probabilidad 0,2.'},
 'M2-005':{steps:['El área del círculo completo es πr²=9π.','Un sector de 120° representa 120/360=1/3 del círculo.','Calcula 9π/3=3π unidades cuadradas.'],easy:'120 grados es un tercio de una vuelta completa. El sector ocupa entonces un tercio del área total: 3π.',example:'Si tres sectores de 120° forman el círculo de radio 3, cada uno tiene área 3π y juntos suman 9π.'},
 'M2-006':{steps:['La separación horizontal es 4−1=3.','La separación vertical es 6−2=4.','Por Pitágoras, distancia=√(3²+4²)=√25=5.'],easy:'Los dos puntos forman un triángulo rectángulo con catetos 3 y 4. Su hipotenusa mide 5.',example:'Caminar 3 unidades a la derecha y 4 hacia arriba forma un recorrido en L; la distancia directa entre los extremos es 5.'},
 'M2-007':{steps:['log₂(x)=3 significa que 2 elevado a 3 da x.','Calcula 2³=8.','Comprueba: log₂(8)=3, porque 2³=8.'],easy:'Un logaritmo pregunta qué exponente necesita la base. Para que 2 llegue a 8, necesitas el exponente 3.',example:'Del mismo modo que log₁₀(100)=2 porque 10²=100, log₂(8)=3 porque 2³=8.'},
 'M2-008':{steps:['Resolver a²=49 da dos posibilidades: a=7 y a=−7.','El enunciado exige a>0.','Descarta −7 y conserva a=7.'],easy:'Tanto 7 como −7 al cuadrado dan 49, pero la pregunta pide expresamente un número positivo.',example:'Si una longitud al cuadrado mide 49 unidades cuadradas, la longitud positiva es 7 unidades.'},
 'M2-009':{steps:['Tras el primer año: $100.000×1,10=$110.000.','El segundo 10 % se aplica a $110.000: $110.000×1,10=$121.000.','Equivale a $100.000×(1,10)²=$121.000.'],easy:'Cada año ganas 10 % sobre el monto actualizado, no siempre sobre los $100.000 iniciales.',example:'En el segundo año el aumento es $11.000, no $10.000, porque el capital ya había crecido a $110.000.'},
 'M2-010':{steps:['Identifica los puntos (0,5) y (2,11).','El cambio vertical es 11−5=6 y el horizontal es 2−0=2.','La pendiente es 6/2=3.'],easy:'La recta sube 6 unidades cuando avanzas 2 hacia la derecha. Por cada unidad horizontal sube 3.',example:'La recta y=3x+5 pasa por (0,5) y (2,11), porque 3×2+5=11.'}
};
for(const q of window.CACHASTE_M2){const review=M2_EDITORIAL_REVIEW[q.id];if(review){q.editorial=review;q.reviewStatus='revisado_conceptualmente';}}

const M2_EDITORIAL_LOTE_2={"M2-011":{"steps":["El radicando x−5 debe ser mayor o igual a cero.","Despeja x−5≥0 sumando 5 a ambos lados.","Concluye x≥5; valores menores producen raíz no real."],"easy":"Concluye x≥5; valores menores producen raíz no real.","example":"Si x=5, √0=0; si x=4, √(−1) no es real."},"M2-012":{"steps":["Sustituye x=2 en 3x²−2x.","Calcula 2²=4 y multiplica 3×4=12.","Resta 2×2=4: 12−4=8."],"easy":"Resta 2×2=4: 12−4=8.","example":"Con x=2, la potencia se calcula antes que la resta: 3×4−4=8."},"M2-013":{"steps":["La composición g∘f aplica primero f y luego g.","Calcula f(3)=3+2=5.","Evalúa g(5)=5²=25."],"easy":"Evalúa g(5)=5²=25.","example":"No calcules f(g(3)): ese orden daría 11, que responde a otra composición."},"M2-014":{"steps":["Cada lanzamiento tiene dos resultados equiprobables.","Tres lanzamientos independientes producen 2³=8 secuencias.","Solo CCC tiene tres caras: probabilidad 1/8."],"easy":"Solo CCC tiene tres caras: probabilidad 1/8.","example":"CCC es una de las ocho secuencias posibles: CCC, CCS, CSC, SCC, CSS, SCS, SSC, SSS."},"M2-015":{"steps":["El conjunto tiene diez números equiprobables, del 1 al 10.","Los múltiplos de 3 son 3, 6 y 9.","Hay 3 casos favorables de 10: 3/10."],"easy":"Hay 3 casos favorables de 10: 3/10.","example":"El 10 no es múltiplo de 3; por eso no se cuenta como cuarto caso."},"M2-016":{"steps":["En rectas perpendiculares de pendientes definidas, m₁m₂=−1.","Con m₁=2, despeja m₂=−1/2.","Comprueba 2×(−1/2)=−1."],"easy":"Comprueba 2×(−1/2)=−1.","example":"Una recta que sube 2 unidades por cada 1 horizontal es perpendicular a otra con pendiente −0,5."},"M2-017":{"steps":["La magnitud de (a,b) se obtiene con Pitágoras.","Eleva las componentes: 3²=9 y 4²=16.","Suma 25 y extrae raíz: |v|=5."],"easy":"Suma 25 y extrae raíz: |v|=5.","example":"Un desplazamiento 3 a la derecha y 4 arriba tiene longitud 5."},"M2-018":{"steps":["Escribe 16 como potencia de 2: 16=2⁴.","Con la misma base positiva distinta de 1, iguala exponentes.","x+1=4 y x=3."],"easy":"x+1=4 y x=3.","example":"Al sustituir x=3, 2^(3+1)=2⁴=16."},"M2-019":{"steps":["Reconoce factores conjugados (x+3)(x−3).","Usa (a+b)(a−b)=a²−b².","Obtén x²−3²=x²−9."],"easy":"Obtén x²−3²=x²−9.","example":"Con x=5, los factores dan 8×2=16 y x²−9 también da 16."},"M2-020":{"steps":["La cantidad inicial es 200 bacterias.","Cada hora se multiplica por 2; tras tres horas es 200×2³.","Como 2³=8, resulta 1.600."],"easy":"Como 2³=8, resulta 1.600.","example":"Horas 0, 1, 2 y 3: 200, 400, 800 y 1.600 bacterias."},"M2-021":{"steps":["Plantea 2x+3=15.","Resta 3: 2x=12.","Divide por 2: x=6."],"easy":"Divide por 2: x=6.","example":"Comprueba f(6)=2×6+3=15."},"M2-022":{"steps":["Sustituye x=−2 en x²+3.","Recuerda que (−2)²=4, no −4.","Suma 4+3=7."],"easy":"Suma 4+3=7.","example":"Elevar un número negativo al cuadrado da positivo: (−2)(−2)=4."},"M2-023":{"steps":["Identifica la forma de vértice (x−h)²+k.","Como x+4=x−(−4), el vértice tiene coordenada x=−4.","El eje de simetría es la recta vertical x=−4."],"easy":"El eje de simetría es la recta vertical x=−4.","example":"Los puntos x=−3 y x=−5 están a igual distancia del eje y tienen el mismo valor de y."},"M2-024":{"steps":["Evalúa la potencia 2²=4.","Multiplica por el coeficiente 3.","f(2)=3×4=12."],"easy":"f(2)=3×4=12.","example":"No sumes 3+4: el punto indica multiplicación."},"M2-025":{"steps":["Escribe y=3x−6.","Intercambia variables: x=3y−6.","Despeja y=(x+6)/3."],"easy":"Despeja y=(x+6)/3.","example":"Comprueba: f(4)=6 y f⁻¹(6)=(6+6)/3=4."},"M2-026":{"steps":["Suma x+y=10 y x−y=4.","Las y se cancelan y queda 2x=14.","Divide por 2: x=7."],"easy":"Divide por 2: x=7.","example":"Al reemplazar x=7, y=3 satisface ambas ecuaciones."},"M2-027":{"steps":["La ecuación |x−3|=5 tiene dos posibilidades.","Como x>3, corresponde x−3=5.","Despeja x=8."],"easy":"Despeja x=8.","example":"La otra solución x=−2 no cumple la condición x>3."},"M2-028":{"steps":["El logaritmo pregunta a qué exponente elevar 10 para obtener 1.000.","Reconoce 1.000=10³.","Por eso log₁₀(1000)=3."],"easy":"Por eso log₁₀(1000)=3.","example":"Como 10×10×10=1000, el exponente buscado es 3."},"M2-029":{"steps":["Identifica a=1, b=−4, c=4.","Aplica Δ=b²−4ac.","Δ=(−4)²−4×1×4=16−16=0."],"easy":"Δ=(−4)²−4×1×4=16−16=0.","example":"Δ=0 indica una raíz real doble: x=2."},"M2-030":{"steps":["Suma 5 a ambos lados: 3x>12.","Divide por 3, que es positivo; no cambies el signo.","Obtén x>4."],"easy":"Obtén x>4.","example":"x=5 cumple 15−5>7; x=4 no cumple porque 12−5=7."},"M2-031":{"steps":["Usa área=(base×altura)/2.","Multiplica 8×5=40.","Divide por 2: área=20 unidades cuadradas."],"easy":"Divide por 2: área=20 unidades cuadradas.","example":"Dos triángulos iguales de base 8 y altura 5 forman un paralelogramo de área 40."},"M2-032":{"steps":["En un triángulo rectángulo, c²=a²+b².","Calcula 5²+12²=25+144=169.","Extrae √169=13."],"easy":"Extrae √169=13.","example":"La hipotenusa es el lado opuesto al ángulo recto y siempre es el mayor."},"M2-033":{"steps":["Resta coordenadas: Δx=2−(−1)=3 y Δy=4−0=4.","Aplica d=√(Δx²+Δy²).","Calcula √(9+16)=5."],"easy":"Calcula √(9+16)=5.","example":"La separación horizontal es 3 y la vertical 4: un triángulo 3-4-5."},"M2-034":{"steps":["Un hexágono tiene seis lados.","Suma interior=(6−2)×180°=720°.","Como es regular, cada ángulo mide 720°/6=120°."],"easy":"Como es regular, cada ángulo mide 720°/6=120°.","example":"Si los seis ángulos son iguales, 6×120°=720°."},"M2-035":{"steps":["Suma componentes x: 2+3=5.","Suma componentes y: −1+4=3.","El vector resultante es (5,3)."],"easy":"El vector resultante es (5,3).","example":"Los vectores se suman coordenada a coordenada, no multiplicando sus magnitudes."}};
for(const q of window.CACHASTE_M2){if(M2_EDITORIAL_LOTE_2[q.id]){q.editorial=M2_EDITORIAL_LOTE_2[q.id];q.reviewStatus='revisado_con_calculo';}}

const M2_EDITORIAL_LOTE_3={"M2-036":{"steps":["El dado tiene seis resultados equiprobables.","Los pares son 2, 4 y 6: tres favorables.","P(par)=3/6=1/2."],"easy":"P(par)=3/6=1/2.","example":"La mitad de las caras de un dado común son pares."},"M2-037":{"steps":["Suma los datos: 2+4+6+8=20.","Hay cuatro observaciones.","Media=20/4=5."],"easy":"Media=20/4=5.","example":"La media no es necesariamente un dato observado: aquí 5 no aparece en la lista."},"M2-038":{"steps":["Los datos ya están ordenados: 1, 3, 7, 9, 12.","Hay cinco números, por lo que el central es el tercero.","La mediana es 7."],"easy":"La mediana es 7.","example":"Dos números quedan a cada lado de 7."},"M2-039":{"steps":["Cuenta las bolas: 4 verdes y 6 amarillas, total 10.","Hay cuatro casos favorables.","P(verde)=4/10=2/5."],"easy":"P(verde)=4/10=2/5.","example":"La probabilidad es 40%, equivalente a 2/5."},"M2-040":{"steps":["Mutuamente excluyentes significa que A y B no ocurren a la vez.","La intersección A∩B es vacía.","Por eso P(A∩B)=0."],"easy":"Por eso P(A∩B)=0.","example":"En un único lanzamiento de dado, sacar 2 y sacar 5 son eventos incompatibles."},"M2-041":{"steps":["El costo fijo es $1.200.","El costo variable por 4 km es 500×4=$2.000.","Total=$1.200+$2.000=$3.200."],"easy":"Total=$1.200+$2.000=$3.200.","example":"El cargo fijo se paga una sola vez, no por cada kilómetro."},"M2-042":{"steps":["Calcula 20% de 150: 0,20×150=30.","Como disminuye, resta 30 al valor inicial.","150−30=120."],"easy":"150−30=120.","example":"También puedes calcular 80% de 150: 0,8×150=120."},"M2-043":{"steps":["La forma pendiente-intersección es y=mx+b.","La pendiente es m=−2 y el punto (0,3) da b=3.","La ecuación es y=−2x+3."],"easy":"La ecuación es y=−2x+3.","example":"Si x=0, y=3; si x aumenta una unidad, y disminuye dos."},"M2-044":{"steps":["Interés simple: I=capital×tasa×tiempo.","I=1000×0,05×2=$100.","Monto final=$1.000+$100=$1.100."],"easy":"Monto final=$1.000+$100=$1.100.","example":"En interés simple cada año genera $50 sobre el capital inicial."},"M2-045":{"steps":["La producción es de 18 piezas cada hora.","Multiplica 18 piezas/hora por 5 horas.","Se fabrican 90 piezas."],"easy":"Se fabrican 90 piezas.","example":"Las horas se cancelan en las unidades: (piezas/hora)×hora=piezas."},"M2-046":{"steps":["La afirmación (1) da x+2=7, por tanto x=5.","La afirmación (2) da 2x=10, por tanto x=5.","Cada afirmación determina x de forma independiente."],"easy":"Cada afirmación determina x de forma independiente.","example":"Aunque ambas coincidan, no necesitas usar las dos para conocer x."},"M2-047":{"steps":["La afirmación (1) x+y=9 no fija x sin conocer y.","La afirmación (2) y=4 tampoco fija x.","Juntas dan x=9−4=5."],"easy":"Juntas dan x=9−4=5.","example":"Solo la suma de datos permite despejar la incógnita."},"M2-048":{"steps":["La afirmación (1) x²=9 admite x=3 o x=−3.","La afirmación (2) x>0 responde directamente si x es positivo.","Solo (2) es suficiente."],"easy":"Solo (2) es suficiente.","example":"No necesitas saber el valor exacto de x para determinar su signo."},"M2-049":{"steps":["Con base 6 cm, faltaría la altura para calcular el área.","Con altura 4 cm, faltaría la base.","Ambas juntas permiten A=6×4=24 cm²."],"easy":"Ambas juntas permiten A=6×4=24 cm².","example":"Conocer solo un lado de un rectángulo no determina su área."},"M2-050":{"steps":["De x²=16 se deduce x=4 o x=−4.","La condición de ser par se cumple para ambos valores.","Incluso juntas las afirmaciones no determinan x."],"easy":"Incluso juntas las afirmaciones no determinan x.","example":"Se necesitaría, por ejemplo, saber si x es positivo."},"M2-051":{"steps":["Si el lado mide 7 cm, el perímetro es 4×7=28 cm.","Si el área es 49 cm², el lado positivo es √49=7 cm.","Cada afirmación basta por separado."],"easy":"Cada afirmación basta por separado.","example":"En un cuadrado, conocer área o lado determina las demás medidas."},"M2-052":{"steps":["Como (x−1)²≥0, su negativo es ≤0.","Por eso −(x−1)²+9≤9.","El máximo es 9, alcanzado en x=1."],"easy":"El máximo es 9, alcanzado en x=1.","example":"El vértice de esta parábola abre hacia abajo."},"M2-053":{"steps":["Dos dados tienen 6×6=36 pares ordenados equiprobables.","Suman 7 los pares (1,6),(2,5),(3,4),(4,3),(5,2),(6,1).","P(suma 7)=6/36=1/6."],"easy":"P(suma 7)=6/36=1/6.","example":"(1,6) y (6,1) son resultados distintos al distinguir ambos dados."},"M2-054":{"steps":["El diámetro es 10, así que el radio es 5.","Área de círculo: A=πr².","A=π×5²=25π."],"easy":"A=π×5²=25π.","example":"No uses diámetro como radio: eso cuadruplicaría el área."},"M2-055":{"steps":["El aumento es 25% de 80: 0,25×80=20.","Suma el incremento al valor inicial.","80+20=100."],"easy":"80+20=100.","example":"También equivale a multiplicar 80×1,25=100."}};
for(const q of window.CACHASTE_M2){if(M2_EDITORIAL_LOTE_3[q.id]){q.editorial=M2_EDITORIAL_LOTE_3[q.id];q.reviewStatus='revisado_con_calculo';}}

/* Segunda revisión individual, 14-10-2026: errores concretos y conceptos transferibles. */
{
const reviewRows = `
1|Vértice de una cuadrática|4 es el valor asociado al coeficiente lineal, no la abscisa del vértice: −b/(2a)=4/2.|Con x=−2 resulta 13, mayor que el mínimo −3.|Con x=0 resulta 1; en x=2 la función vale −3, que es menor.
2|Función exponencial|4 resulta de 2 elevado a 3−1; la resta de potencias no permite restar exponentes.|8 es g(3); falta restar g(1)=2.|2 es g(1), no la diferencia 8−2.
3|Probabilidad sin reposición|9/25 mantendría 3 rojas entre 5 en la segunda extracción: eso sería con reposición.|3/5 solo describe la primera extracción.|1/5 no incluye correctamente las dos etapas: 3/5 por 2/4.
4|Independencia de eventos|0,9 suma las probabilidades; se pide que ocurran ambos, no una suma.|0,1 es la diferencia entre probabilidades; no mide su intersección.|La independencia exige multiplicar 0,4 por 0,5: el producto es 0,2.
5|Sectores circulares|6π es la circunferencia completa de radio 3, una longitud, no el área del sector.|9π es el área del círculo completo; el sector ocupa solo un tercio.|2π es la longitud del arco de 120°, no su área.
6|Distancia en el plano|7 suma los desplazamientos horizontal y vertical; la distancia recta es la hipotenusa.|4 solo mide la diferencia vertical.|Falta elevar al cuadrado: bajo la raíz va 3²+4²=25, no 3+4.
7|Logaritmos|6 multiplica base y exponente; el logaritmo pide la potencia 2³.|9 corresponde a 3², intercambiando base y exponente.|El valor 1 corresponde al exponente cero, porque 2⁰=1. Aquí el exponente es 3: necesitas x=2³=8; así log₂(8)=3.
8|Raíces y restricciones|−7 cumple a²=49, pero viola la condición a>0.|49 es el cuadrado de a, no a.|14 duplica 7; 14²=196, no 49.
9|Interés compuesto|120.000 usa interés simple: ignora el interés del segundo año sobre los 10.000 ganados.|110.000 es el capital tras un año, no tras dos.|El segundo interés es 11.000 sobre 110.000: total 121.000, no 122.000.
10|Rectas y pendiente|6 es el cambio vertical; falta dividirlo por el cambio horizontal 2.|2 es el cambio horizontal, no el cociente entre cambios.|5 es la ordenada al origen, no la pendiente.
11|Dominio de raíces|x>0 admite valores como 1, cuyo radicando es −4 y no tiene raíz cuadrada real.|Para x<5 el radicando es negativo. La desigualdad va hacia x≥5.|Los números menores que 5 dejan un radicando negativo; no pertenecen al dominio real.
12|Evaluación de funciones|4 confunde 2² con 2 o deja fuera el factor 3. El primer término es 12.|12 es solo 3·2²; falta restar 2·2=4.|16 suma 4 al primer término, pero la función pide restarlo.
13|Composición de funciones|11 calcula f(g(3)); aquí el orden solicitado es g(f(3)).|13 no resulta de evaluar primero 3+2 y después elevarlo al cuadrado.|7 corresponde a 3+2+2, una doble suma, no a elevar f(3) al cuadrado.
14|Independencia de eventos|Tres lanzamientos no son tres resultados equiprobables: hay ocho secuencias.|3/8 corresponde a ciertos resultados con dos caras; tres caras tiene una sola secuencia.|La probabilidad se obtiene multiplicando tres factores 1/2; no sumando los denominadores.
15|Probabilidad equiprobable|Hay 3 casos favorables entre 10, no entre 9.|1/5 equivaldría a dos casos favorables; son tres: 3, 6 y 9.|El 0 no está en el conjunto 1 a 10; hay tres múltiplos, no cuatro.
16|Rectas perpendiculares|La misma pendiente da rectas paralelas, no perpendiculares.|Falta el signo negativo: 2·(1/2)=1 y debe ser −1.|Cambiaste el signo sin invertir: 2·(−2)=−4, no −1.
17|Distancia en el plano|7 suma las componentes; el módulo se obtiene con Pitágoras.|12 multiplica las componentes, operación que no da la longitud.|Bajo la raíz deben estar los cuadrados 9+16, no 3+4.
18|Ecuaciones exponenciales|4 es x+1, no x. Debes restar 1.|5 suma 1 al exponente en vez de restarlo.|Con x=2 resulta 2³=8 y no 16.
19|Productos notables|Los términos constantes dan 3·(−3)=−9, no +9.|Esa es la expansión de (x−3)²; aquí los términos lineales se cancelan.|Los términos +3x y −3x suman cero; no queda +6x.
20|Función exponencial|600 usa crecimiento lineal 200·3; el modelo duplica cada hora.|800 es el resultado después de dos duplicaciones.|Cada hora se multiplica por 2: 200, 400, 800, 1600; 1200 no es el tercer paso.
21|Ecuaciones lineales|Con x=9, 2x+3=21, no 15.|12 es 15−3; falta dividir por el coeficiente 2.|Con x=4, f(x)=11, por lo que no cumple la condición.
22|Evaluación de funciones|El cuadrado de −2 es +4; no restes el signo dos veces.|(−2)² es 4, no −4. Los paréntesis incluyen el signo en la potencia.|La potencia indica (−2)·(−2)=4, no el valor absoluto 2.
23|Vértice de una cuadrática|La forma es x−h; x+4 equivale a x−(−4), de modo que h=−4.|y=−1 indica la altura del vértice; el eje de simetría es vertical.|El −1 es el desplazamiento vertical; no fija un eje x=1.
24|Función exponencial|9 proviene de sumar 3 al exponente o confundir operaciones; 3·2²=12.|6 es f(1), porque 3·2=6.|Primero calcula la potencia 2²=4; luego 3·4=12.
25|Inversa de funciones|Para deshacer 3x−6 hay que sumar 6 y dividir por 3, no multiplicar por 3.|El término −6 se deshace sumando 6.|El +6 también debe quedar dividido por 3; la inversa es x/3+2.
26|Sistemas lineales|Sumar ecuaciones da 2x=14; la mitad de 14 es 7.|3 es y=10−7; se pide x.|14 es 2x, no x. Falta dividir por dos.
27|Valor absoluto|−2 cumple |x−3|=5, pero incumple x>3.|5 es la distancia entre x y 3; se debe sumar a 3.|Con x=3, |x−3| vale 0, no 5.
28|Logaritmos|10 es la base, no el exponente al que hay que elevarla.|100 es 10²; el logaritmo de 1000 pide el exponente 3.|10²=100; se requiere un factor 10 adicional.
29|Discriminante|4 es el término independiente; el discriminante usa b²−4ac.|Con b=−4, su cuadrado es +16; 16−16=0.|16 es solo b²; falta restar 4ac=16.
30|Inecuaciones|Dividir por 3 positivo conserva >. Solo un divisor negativo invierte el signo.|Tras sumar 5 queda 3x>12; 12/3 es 4.|x=4 da igualdad 7=7 y no satisface el signo estricto >.
31|Área de triángulos|40 es base por altura; en un triángulo falta dividir por 2.|Sumar base y altura no da una superficie.|26 es el doble de base más altura; no es el área triangular.
32|Teorema de Pitágoras|17 suma catetos; la hipotenusa es √(25+144).|10 es dos veces 5; no usa el otro cateto 12.|La hipotenusa debe ser mayor que cada cateto, incluido 12.
33|Distancia en el plano|7 recorre los dos catetos en vez del segmento recto.|4 es solo el cambio vertical.|La diferencia horizontal es 2−(−1)=3; su cuadrado es 9, no 1.
34|Ángulos de polígonos|60° es el ángulo exterior; el interior es su suplemento.|90° corresponde al interior de un cuadrado regular.|135° es el ángulo interior de un octógono regular, no de un hexágono.
35|Vectores|Debes sumar coordenadas en el mismo eje: 2+3 y −1+4.|Eso multiplica componentes; aquí se pide sumarlas.|−1+4=3, no −5. El segundo componente de (3,4) es positivo.
36|Probabilidad equiprobable|Hay tres pares, no dos, entre los seis resultados del dado.|2/3 equivaldría a cuatro casos favorables, pero solo son 2, 4 y 6.|1/6 es la probabilidad de un número específico, no de cualquiera de los tres pares.
37|Media aritmética|4 es uno de los datos; el promedio usa los cuatro valores.|6 también es un dato particular; la suma total es 20 y hay cuatro datos.|20 es la suma; falta dividir por la cantidad de datos, 4.
38|Mediana|3 ocupa la segunda posición; con cinco valores el centro es el tercero.|9 ocupa la cuarta posición; quedan tres datos menores y solo uno mayor.|6 no es el centro de esta lista ordenada; tampoco se promedian valores para una lista impar.
39|Probabilidad equiprobable|3/5 es la probabilidad de amarilla, 6/10.|El denominador es la cantidad total de bolas, 10, no las cuatro verdes.|4/6 compara verdes con amarillas; la probabilidad usa verdes sobre total.
40|Eventos excluyentes|1 indicaría que ambos ocurren con certeza; no pueden ocurrir simultáneamente.|Esa suma corresponde a la unión cuando los eventos son excluyentes.|El producto corresponde a independencia, que es una condición distinta de exclusión mutua.
41|Modelo afín|2000 es el costo por kilómetros; falta sumar el cargo fijo 1200.|1700 cubre solo un kilómetro más el cargo fijo.|4800 multiplica el cargo fijo por 4 e ignora la tarifa variable.
42|Porcentajes|20% no significa restar 20 unidades: 0,2·150=30.|30 es la disminución, no el valor que queda.|180 aumenta 20%; aquí se pide disminuirlo.
43|Rectas y pendiente|Cambiaste el signo de la pendiente; la recta dada desciende.|El punto (0,3) exige ordenada +3, no −3.|Intercambiaste la pendiente y la ordenada al origen.
44|Interés simple|1102,50 usa interés compuesto, pero el problema especifica interés simple.|1050 corresponde a un año; son dos años de interés.|1200 usa un total de interés de 20%, pero 5% por dos años suma 10%.
45|Proporcionalidad|23 suma tasa y tiempo; sus unidades no se pueden sumar para contar piezas.|72 corresponde a cuatro horas, no cinco.|108 corresponde a seis horas a esa tasa, no cinco.
52|Vértice de una cuadrática|1 es el valor de x donde se alcanza el máximo; el valor máximo de f es 9.|−9 cambia el signo del término que determina la altura del vértice.|0 es un valor menor que 9 y no es el máximo de la función.
53|Probabilidad de dos dados|1/12 cuenta solo tres pares sin considerar que el orden de los dados distingue resultados.|1/3 contaría doce casos favorables, pero solo hay seis.|Siete es la suma buscada, no el número de resultados que la producen.
54|Área de círculos|100π usa el diámetro como radio; el radio es 5.|10π es el perímetro, una longitud, no el área.|5π multiplica radio por π sin elevarlo al cuadrado.
55|Porcentajes|25% no es sumar 25 unidades: es sumar 0,25·80=20.|15 no es el 25% de 80. La cuarta parte de 80 es 20.|120 corresponde a aumentar 50%, no 25%.
`.trim().split('\n');
for (const line of reviewRows) { const [n,concept,...wrong]=line.split('|'),q=window.CACHASTE_M2[+n-1];q.concept=concept;q.explanations=[q.why,...wrong];q.reviewStatus='revision_individual_2026-10-14';q.difficulty=+n>=46?'intermedio':'inicial'; }
const labels=['Solo (1)','Solo (2)','Ambas juntas, ninguna por sí sola','Cada una por sí sola','Se requiere información adicional'];
const suff={46:[3,'Ecuaciones lineales',['(1) sí basta, pero también basta (2).','(2) sí basta, pero también basta (1).','No necesitas unirlas: x=5 sale de cualquiera.','Ambas ecuaciones fijan por separado el mismo único x=5.','No falta información: cada afirmación determina x.']],47:[2,'Sistemas lineales',['Con solo x+y=9 hay muchos pares posibles.','y=4 no determina x sin otra relación.','Al unirlas, x=9−4=5 es único.','Ninguna permite determinar x por separado.','Las dos juntas sí fijan x=5.']],48:[1,'Raíces y restricciones',['x²=9 admite 3 y −3: no decide el signo.','x>0 responde directamente que x es positivo.','La segunda basta sola, sin usar la primera.','La primera es ambigua, por lo que no bastan ambas separadamente.','La segunda ya entrega la información solicitada.']],49:[2,'Área de rectángulos',['Solo la base deja infinitas alturas y áreas posibles.','Solo la altura deja infinitas bases y áreas posibles.','Con ambas medidas A=6·4=24 cm² es único.','Cada afirmación sola deja una dimensión desconocida.','Ambas medidas juntas sí permiten calcular el área.']],50:[4,'Raíces y restricciones',['x²=16 admite dos valores: 4 y −4.','Ser par admite infinitos valores.','4 y −4 cumplen ambas afirmaciones; todavía hay ambigüedad.','Ninguna fija un único valor por separado.','Ni juntas distinguen entre 4 y −4.']],51:[3,'Área de cuadrados',['(1) basta, pero el área positiva de (2) también fija el lado.','(2) basta, pero el lado de (1) también basta.','No se necesitan ambas a la vez: cada una da lado 7.','Una longitud es positiva: de lado 7 o de área 49 se obtiene P=28.','No hace falta más información: cualquiera determina el perímetro.']]};
for(const [n,[answer,concept,explanations]] of Object.entries(suff)){Object.assign(window.CACHASTE_M2[+n-1],{options:labels.slice(),answer,concept,explanations,difficulty:'intermedio',reviewStatus:'revision_individual_2026-10-14'});}
window.CACHASTE_M2[52].question='Al lanzar dos dados justos e independientes, ¿cuál es la probabilidad de sumar 7?';
}

/* Cobertura M2 ampliada: modelos, trigonometría, combinatoria, dispersión y datos. */
{
const rows=[
['Álgebra','Logaritmos','Si log₂(x−1)=3, ¿cuál es el valor de x?',['9','8','7','4'],['El argumento exige x>1.','Convierte el logaritmo: x−1=2³=8.','Suma 1: x=9; comprueba log₂(8)=3.'],'El logaritmo pregunta qué exponente da 8 al elevar 2. Recupera primero el argumento y después despeja x.','Si log₃(y+2)=2, entonces y+2=9 y y=7. El argumento queda positivo.', ['8 es el argumento x−1, no x.','Debes sumar 1 a 8, no restarlo.','La potencia es 2³=8, no 2+1.']],
['Álgebra','Logaritmos','¿Cuál es log₁₀(100·1000)?',['5','6','2,5','100.000'],['100·1000=10²·10³=10⁵.','El logaritmo en base 10 de 10⁵ es 5.','También puedes sumar log₁₀(100)+log₁₀(1000)=2+3.'],'El logaritmo de un producto suma los exponentes de la misma base; no multiplica esos exponentes.','log₂(4·8)=log₂(2²·2³)=5, porque 4·8=32=2⁵.', ['6 multiplica los logaritmos 2·3; la regla pide sumarlos.','2,5 promedia los exponentes; no hay un promedio en la regla.','100.000 es el argumento del logaritmo, no su valor.']],
['Funciones','Función exponencial','Una sustancia conserva el 80% de su masa cada hora. Partiendo de 500 g, ¿cuánta masa queda al cabo de 2 horas?',['320 g','300 g','400 g','180 g'],['Conservar 80% equivale a multiplicar por 0,8 en cada hora.','Tras una hora quedan 500·0,8=400 g.','Tras dos horas quedan 400·0,8=320 g.'],'La segunda pérdida se calcula sobre los 400 g restantes; no vuelve a calcularse sobre 500 g.','Con 100 g y retención del 50% por hora quedan 50 g tras una hora y 25 g tras dos.', ['300 g resta dos veces 100 g: supone pérdida constante, no porcentual.','400 g es la masa después de una hora.','180 g es la masa perdida, no la que queda.']],
['Funciones','Sistemas lineales','¿Cuántas soluciones tiene el sistema x+y=4 y 2x+2y=10?',['Ninguna','Una','Dos','Infinitas'],['Duplica la primera ecuación: 2x+2y=8.','La segunda exige que la misma suma valga 10.','Una suma no puede valer a la vez 8 y 10: no hay solución.'],'Las rectas tienen la misma pendiente y diferentes interceptos; son paralelas y nunca se cruzan.','x+y=3 y 2x+2y=6 sí describen la misma recta y tienen infinitas soluciones.', ['Una solución requeriría una intersección; las igualdades son incompatibles.','Dos rectas distintas no pueden tener exactamente dos intersecciones.','Los términos independientes tendrían que ser proporcionales: 8, no 10.']],
['Funciones','Funciones trigonométricas','En h(t)=3·sen(πt/4)+5, ¿cuál es el período?',['8','4','3','5'],['El seno repite sus valores cuando el argumento aumenta 2π.','Resuelve (π/4)·T=2π.','T=8; la amplitud 3 y el desplazamiento 5 no modifican el período.'],'Busca cuánto debe avanzar t para que el ángulo complete una vuelta. Aquí necesita avanzar 8.','En g(t)=2·cos(πt)+1, el período es 2π/π=2.', ['4 hace avanzar el argumento π, solo media vuelta.','3 es la amplitud, no el tiempo de repetición.','5 desplaza la gráfica verticalmente, sin cambiar el período.']],
['Funciones','Funciones trigonométricas','Una altura se modela por h(t)=4+2·cos(πt/3), con t en segundos. ¿Cuánto vale h(3)?',['2','6','4','−2'],['Sustituye t=3: el ángulo es π·3/3=π.','cos(π)=−1.','h(3)=4+2·(−1)=2.'],'A los 3 segundos el coseno está en su mínimo; la altura queda dos unidades bajo el nivel central 4.','Con y(t)=10+3·cos(πt), al segundo 1 se obtiene 10−3=7.', ['6 usa cos(π)=1, pero ese valor corresponde a cos(0).','4 omite el término oscilatorio, que en este instante vale −2.','−2 es el término 2·cos(π); falta sumar el nivel central 4.']],
['Geometría','Homotecia','Una figura tiene área 12 cm². Se aplica una homotecia de razón 3. ¿Cuál es el área de la imagen?',['108 cm²','36 cm²','15 cm²','324 cm²'],['Una homotecia multiplica cada longitud por |3|.','El área usa dos dimensiones y se multiplica por 3²=9.','12·9=108 cm².'],'Si triplicas base y altura, multiplicas el área por nueve. Triplicar solo el área confunde longitudes y superficies.','Un cuadrado de área 5 cm² ampliado con razón 2 tiene área 5·4=20 cm².', ['36 multiplica el área solo por 3, como si fuera una longitud.','15 suma 3; la homotecia produce un cambio multiplicativo.','324 aplica un factor 27, propio de volumen, no de área.']],
['Geometría','Homotecia','Una homotecia de centro (0,0) y razón −2 transforma P=(3,−1). ¿Cuál es su imagen?',['(−6,2)','(6,−2)','(1,−3)','(−1,1)'],['Con centro en el origen se multiplica cada coordenada por la razón.','x′=−2·3=−6; y′=−2·(−1)=2.','La razón negativa ubica la imagen al lado opuesto del centro.'],'Multiplica las dos coordenadas por −2: duplica las distancias y cambia el sentido desde el origen.','El punto (−2,4), con razón −3 y centro en el origen, pasa a (6,−12).', ['Corresponde a razón +2; falta el cambio de sentido.','Es una traslación de vector (−2,−2), no una homotecia.','No conserva la razón −2 entre coordenadas correspondientes.']],
['Geometría','Razones trigonométricas','Una escalera de 10 m forma 30° con el suelo horizontal. Usando sen(30°)=1/2, ¿qué altura alcanza?',['5 m','10 m','20 m','5√3 m'],['La escalera es la hipotenusa; la altura es el cateto opuesto a 30°.','sen(30°)=altura/10.','altura=10·1/2=5 m.'],'Usa el seno porque relaciona la altura opuesta con la escalera completa. El ángulo está medido desde el suelo.','Una rampa de 8 m a 30° alcanza 8·1/2=4 m de altura.', ['10 m es la longitud de la escalera, mayor que su altura vertical.','Un cateto no puede superar la hipotenusa de 10 m.','5√3 m corresponde al cateto adyacente, la distancia horizontal.']],
['Geometría','Razones trigonométricas','En un triángulo rectángulo, respecto del ángulo α, el cateto opuesto mide 6 y el adyacente 8. ¿Cuál es tan(α)?',['3/4','3/5','4/3','4/5'],['La tangente relaciona cateto opuesto con cateto adyacente.','tan(α)=6/8.','Simplifica dividiendo por 2: 3/4.'],'Para la tangente no necesitas calcular la hipotenusa: divide el cateto de enfrente por el que está junto al ángulo.','Si el opuesto mide 3 y el adyacente 4, la tangente también es 3/4, aunque el triángulo sea menor.', ['3/5 es sen(α), usando hipotenusa 10.','4/3 invierte el cociente de la tangente solicitada.','4/5 es cos(α), no tan(α).']],
['Geometría','Relaciones en la circunferencia','Dos cuerdas se cortan dentro de una circunferencia. Los segmentos de una miden 3 y 8; los de la otra, 4 y x. ¿Cuánto vale x?',['6','7','24','12'],['Para cuerdas que se intersectan, los productos de los segmentos son iguales.','3·8=4·x.','x=24/4=6.'],'Empareja los dos segmentos de cada cuerda. Se igualan productos, no las sumas de las longitudes.','Si una cuerda queda dividida en 2 y 9, y la otra en 3 y y, entonces y=18/3=6.', ['7 iguala sumas: 3+8=4+7, pero la regla correcta usa productos.','24 es el producto 3·8; falta dividir por 4.','12 no cumple 4·12=24.']],
['Geometría','Esferas','Una esfera tiene radio 3 cm. ¿Cuál es su volumen?',['36π cm³','12π cm³','27π cm³','108π cm³'],['El volumen de una esfera es (4/3)πr³.','Sustituye r=3: (4/3)π·27.','El resultado es 36π cm³.'],'Primero eleva el radio al cubo y después multiplica por cuatro tercios. El resultado mide espacio en tres dimensiones.','Para radio 2 cm: V=(4/3)π·8=32π/3 cm³.', ['12π usa r² en lugar de r³.','27π omite el factor 4/3.','108π multiplica por 4, pero olvida dividir por 3.']],
['Probabilidad','Combinatoria','De 6 estudiantes se elige un comité de 2, sin cargos distintos. ¿Cuántos comités se pueden formar?',['15','30','12','36'],['Hay 6 posibilidades para una primera persona y 5 para otra.','6·5=30 cuenta cada pareja en los dos órdenes.','Como no hay cargos, divide por 2: 15 comités.'],'Elegir a Ana y Beto forma el mismo comité que elegir a Beto y Ana. Por eso cada pareja se cuenta una vez.','De 4 personas se pueden formar 4·3/2=6 parejas sin cargos.', ['30 distingue los órdenes; el comité no tiene cargos.','12 multiplica 6 por 2 sin contar las parejas posibles.','36 permite elegir a la misma persona dos veces y además distingue el orden.']],
['Probabilidad','Combinatoria','Cinco corredores distintos disputan oro, plata y bronce. Sin empates, ¿cuántos podios son posibles?',['60','10','15','125'],['Hay 5 opciones para oro.','Quedan 4 para plata y 3 para bronce.','Los puestos importan: 5·4·3=60 podios.'],'El orden sí cambia el resultado: intercambiar oro y plata produce otro podio. Una persona no ocupa dos lugares.','Con 4 participantes y dos puestos hay 4·3=12 resultados ordenados.', ['10 elige grupos de tres sin distinguir sus puestos.','15 multiplica 5 por 3; no considera quién ocupa cada puesto.','125 permite repetir corredores en varios puestos.']],
['Probabilidad','Modelo binomial','Se realizan 4 intentos independientes con probabilidad de éxito 1/2. ¿Cuál es la probabilidad de exactamente 2 éxitos?',['3/8','1/16','1/4','1/2'],['El número de formas de ubicar 2 éxitos en 4 intentos es C(4,2)=6.','Cada secuencia tiene probabilidad (1/2)⁴=1/16.','Suma las 6 secuencias: 6/16=3/8.'],'No basta con una secuencia como éxito-éxito-fallo-fallo. Hay seis posiciones posibles para los dos éxitos.','En 3 intentos con p=1/2, exactamente un éxito tiene probabilidad C(3,1)/8=3/8.', ['1/16 considera una sola secuencia y olvida las otras cinco.','1/4 multiplica solo dos éxitos y no exige los dos fallos restantes.','1/2 es la probabilidad de éxito de un intento, no de dos éxitos exactos.']],
['Probabilidad','Modelo binomial','Un componente falla con probabilidad 0,1, independientemente de los demás. ¿Cuál es la probabilidad de que al menos uno de 3 componentes falle?',['0,271','0,3','0,001','0,729'],['Es más simple calcular el complemento: ninguno falla.','Cada uno funciona con probabilidad 0,9; los tres funcionan con 0,9³=0,729.','Al menos un fallo tiene probabilidad 1−0,729=0,271.'],'Resta del total el único caso que no quieres: que los tres funcionen. Así incluyes uno, dos o tres fallos.','Si dos piezas fallan con p=0,2, la probabilidad de al menos un fallo es 1−0,8²=0,36.', ['0,3 suma probabilidades sin descontar solapamientos entre fallos.','0,001 es la probabilidad de que fallen los tres.','0,729 es que no falle ninguno; falta tomar el complemento.']],
['Probabilidad','Distribución normal','X tiene distribución normal con media 50. ¿Cuál es P(X<50)?',['0,5','0,25','0,95','No se puede saber sin la desviación estándar'],['La distribución normal es simétrica respecto de su media.','La mitad del área queda a cada lado de 50.','Por tanto P(X<50)=0,5, cualquiera sea su desviación estándar positiva.'],'La media está en el centro de la campana: la mitad de los resultados queda a la izquierda.','Si Y es normal con media 100, P(Y>100)=0,5, por la misma simetría.', ['0,25 es un cuarto; la media divide el área en mitades.','0,95 suele aludir a un intervalo centrado, no al lado izquierdo de la media.','La desviación cambia el ancho, pero no la mitad de probabilidad a cada lado del centro.']],
['Probabilidad','Distribución normal','Una variable normal tiene media 100 y desviación estándar 15. ¿Cuál es el valor estandarizado z de una observación 130?',['2','30','8,67','−2'],['La estandarización mide distancia a la media en desviaciones estándar.','Resta la media: 130−100=30.','Divide por 15: z=30/15=2.'],'130 está dos desviaciones estándar sobre la media: cada desviación equivale a 15 unidades.','Con media 60 y desviación 5, una observación 50 tiene z=(50−60)/5=−2.', ['30 es la distancia en unidades originales, falta dividir por 15.','8,67 divide 130 por 15 sin centrarlo en la media.','El signo es positivo porque 130 está por encima de 100.']],
['Probabilidad','Dispersión','Los datos son 2, 2, 4 y 4. Usando varianza poblacional (división por n), ¿cuál es la varianza?',['1','2','3','0'],['La media es (2+2+4+4)/4=3.','Las desviaciones son −1,−1,1,1; sus cuadrados suman 4.','La varianza poblacional es 4/4=1.'],'La varianza promedia distancias cuadradas a la media. No se anulan los negativos porque se elevan al cuadrado.','Para 1 y 5, la media es 3 y la varianza poblacional es (4+4)/2=4.', ['2 es el rango 4−2, no la varianza.','3 es la media, no la dispersión alrededor de ella.','0 aparecería al sumar desviaciones sin elevarlas al cuadrado.']],
['Probabilidad','Dispersión','A todos los valores de un conjunto se les suma 10. ¿Qué ocurre con su desviación estándar?',['No cambia','Aumenta 10','Se multiplica por 10','Se vuelve cero'],['La media también aumenta 10.','Cada distancia a la nueva media permanece igual: (x+10)−(media+10)=x−media.','Como las desviaciones no cambian, tampoco cambia la desviación estándar.'],'Mover todos los datos por igual cambia su ubicación, pero conserva qué tan separados están entre sí.','Los conjuntos 1,3,5 y 11,13,15 tienen medias distintas y la misma dispersión.', ['Aumenta la media en 10, no la desviación estándar.','Multiplicar por 10 tendría ese efecto; sumar 10 es otra transformación.','Solo sería cero si todos los datos fueran iguales antes y después.']],
['Modelación','Interés compuesto','Un crédito hipotético de $200.000 se paga en una sola cuota al cabo de 2 meses, con interés compuesto de 2% mensual y sin cargos. ¿Cuánto se paga?',['$208.080','$208.000','$204.000','$240.000'],['Cada mes el saldo se multiplica por 1,02.','Después del primer mes: 200.000·1,02=204.000.','Después del segundo: 204.000·1,02=208.080.'],'El segundo mes cobra interés también sobre el interés del primero. Las condiciones son las de este ejercicio hipotético.','Un saldo de $10.000 al 10% compuesto por dos períodos llega a $12.100, porque 10.000·1,1²=12.100.', ['208.000 usa interés simple y omite 80 de interés sobre interés.','204.000 corresponde a un mes.','240.000 suma 20%: confunde 2% con 20%.']],
['Modelación','Interés simple','Una cuenta hipotética paga interés simple anual de 6% sobre $50.000 durante 3 años. Sin cargos, ¿cuánto interés genera?',['$9.000','$59.000','$3.000','$9.550,80'],['Interés simple: I=capital·tasa·tiempo.','Sustituye: I=50.000·0,06·3.','El interés es $9.000; el capital final sería $59.000.'],'Se pide solo la ganancia. Cada año produce $3.000 sobre el capital inicial y hay tres años.','Con $20.000 al 5% simple durante dos años, el interés es 20.000·0,05·2=$2.000.', ['59.000 incluye el capital inicial y no es solo el interés.','3.000 es el interés de un año.','9.550,80 aplica interés compuesto, que el enunciado no pide.']],
['Álgebra','Números reales','¿Cuál es el valor de √50−√8?',['3√2','√42','7√2','21'],['Extrae cuadrados perfectos: √50=5√2 y √8=2√2.','Son términos semejantes con el factor común √2.','Resta coeficientes: (5−2)√2=3√2.'],'No puedes meter la resta dentro de una sola raíz. Primero simplifica cada raíz y después reúne términos semejantes.','√27−√12=3√3−2√3=√3.', ['La raíz no distribuye la resta: √a−√b no es √(a−b).','7√2 suma los términos, pero la operación es una resta.','21 resta los radicandos y divide por 2, regla que no corresponde a raíces.']],
['Funciones','Sistemas lineales','¿Para qué valor de k el sistema x+y=3 y 2x+ky=6 tiene infinitas soluciones?',['2','3','6','0'],['Para infinitas soluciones, las ecuaciones deben representar la misma recta.','Multiplica la primera por 2: 2x+2y=6.','Se requiere k=2 para que coincida con la segunda.'],'Los coeficientes y el término independiente tienen que cambiar en la misma proporción; aquí el factor es 2.','x−y=5 y 3x−3y=15 son equivalentes y comparten todos sus puntos.', ['Con k=3 las rectas se cruzan en un único punto.','6 es el término independiente, no el coeficiente proporcional de y.','Con k=0 queda x=3 y luego y=0: una sola solución.']],
['Geometría','Relaciones en la circunferencia','Un ángulo inscrito intercepta un arco de 100°. ¿Cuánto mide el ángulo inscrito?',['50°','100°','200°','80°'],['El vértice de un ángulo inscrito está en la circunferencia.','Su medida es la mitad de la del arco interceptado que no contiene el vértice.','100°/2=50°.'],'Un ángulo central que mira el mismo arco mide el doble del inscrito. Aquí 100° es el arco, por eso divides por dos.','Un ángulo inscrito que intercepta una semicircunferencia de 180° es recto: mide 90°.', ['100° correspondería al ángulo central sobre el mismo arco.','200° duplica cuando la relación requiere dividir por dos.','80° resta a 180°, pero no es la relación entre arco y ángulo inscrito.']]
];
for(const [area,concept,question,options,steps,easy,example,wrong] of rows){const id='M2-'+String(window.CACHASTE_M2.length+1).padStart(3,'0');window.CACHASTE_M2.push({id,area,concept,question,options,answer:0,why:steps.join(' '),hint:steps[0],editorial:{steps,easy,example},explanations:[steps.join(' '),...wrong],origin:'original',difficulty:'intermedio',reviewStatus:'revision_individual_2026-10-14'});}
}
/* Transfer examples solve a different case; the original solution remains in steps. */
{
const examples=`
1|Para h(x)=(x−5)²+7, el cuadrado vale cero en x=5. Allí h=7 es el mínimo; distingue el lugar x=5 del valor mínimo 7.
2|Si h(x)=3^x, h(2)−h(1)=9−3=6. Primero evalúas cada potencia; no calculas 3^(2−1).
3|En una bolsa con 2 verdes y 4 blancas, sacar dos verdes sin reposición tiene probabilidad (2/6)(1/5)=1/15.
4|Dos dispositivos independientes funcionan con probabilidades 0,8 y 0,9. Que ambos funcionen tiene probabilidad 0,8×0,9=0,72.
5|Un sector de 90° y radio 4 ocupa un cuarto de círculo: área=(90/360)π×4²=4π.
6|Entre (1,2) y (7,10) hay diferencias 6 y 8. La distancia directa es √(6²+8²)=10.
7|log₃(81)=4 porque 3⁴=81. El logaritmo responde qué exponente necesita la base.
8|Para x²=36 y x>0, las raíces son ±6 y la condición selecciona 6. Sin ella no podrías descartar −6.
9|$50.000 al 20% compuesto anual durante dos años dan 50.000×1,2²=$72.000. El segundo interés se calcula sobre $60.000.
10|Una recta de pendiente 2 que pasa por (1,5) cumple 5=2×1+b; b=3. Su ecuación es y=2x+3.
11|Para √(x−7), el radicando exige x−7≥0. El dominio real es x≥7; en el extremo la raíz vale cero.
12|Si h(x)=2x²−3, h(−2)=2×4−3=5. Los paréntesis conservan el signo de la entrada antes de elevar al cuadrado.
13|Si f(x)=x+4 y g(x)=3x, g(f(2))=g(6)=18. En cambio f(g(2))=10: cambiar el orden cambia el resultado.
14|En cuatro lanzamientos independientes de moneda equilibrada, cuatro caras tienen probabilidad (1/2)⁴=1/16.
15|Entre los números 1 a 12, los múltiplos de 4 son 4,8,12. Elegir uno uniformemente da probabilidad 3/12=1/4.
16|Una recta con pendiente −4 es perpendicular a una de pendiente 1/4, pues su producto es −1.
17|El vector (5,12) tiene módulo √(25+144)=13. No sumas 5+12: esa suma mide un recorrido por ejes.
18|Para 3^(x−1)=27, escribe 27=3³. Iguala exponentes x−1=3 y obtienes x=4.
19|Al desarrollar (x+5)(x−5), los términos +5x y −5x se cancelan: queda x²−25.
20|Un cultivo idealizado comienza con 150 células y se duplica cada hora. A las cuatro horas tiene 150×2⁴=2.400 células.
21|Si f(x)=4x−1 y f(x)=19, resuelve 4x=20: x=5. Sustituye para comprobar 4×5−1=19.
22|Si h(x)=x²+1, h(−3)=9+1=10. Elevar −3 al cuadrado produce 9, porque multiplicas dos negativos.
23|En f(x)=(x+2)²−5, el eje de simetría es x=−2. Los puntos −3 y −1 tienen ambos imagen −4.
24|log₂(16)+log₂(2)=4+1=5. También puedes usar log₂(16×2)=log₂(32)=5.
25|Para f(x)=2x+8, escribe y=2x+8 y despeja x=(y−8)/2. La inversa es f⁻¹(x)=(x−8)/2.
26|Si x+y=12 y x−y=4, suma para obtener 2x=16. Así x=8 e y=4; verifica ambas ecuaciones.
27|Si x²−x−6=0, factoriza (x−3)(x+2)=0. Con la condición x<0, solo x=−2 es admisible.
28|log₅(125)=3 porque 5³=125. La base indica qué potencia debes buscar.
29|En x²−6x+9=0, Δ=36−36=0. Hay una raíz real doble x=3; la gráfica toca el eje sin cruzarlo.
30|Para 4x−3>9, suma 3 y divide por 4: x>3. x=3 no sirve porque produciría igualdad.
31|Un triángulo de base 12 y altura perpendicular 7 tiene área 12×7/2=42 unidades cuadradas.
32|Si los catetos miden 5 y 12, la hipotenusa es √(25+144)=13. La raíz se aplica después de sumar los cuadrados.
33|De A=(−1,1) a B=(5,9), las diferencias son 6 y 8: distancia √100=10 unidades.
34|Un pentágono tiene suma de ángulos interiores (5−2)×180°=540°. Si es regular, cada ángulo mide 108°.
35|Al sumar (2,−5)+(−3,4), suma por coordenadas: (−1,−1). No mezcles una coordenada horizontal con una vertical.
36|En un dado justo, los números mayores que 2 son cuatro de seis: P=4/6=2/3.
37|Los datos 1,3,5,7 suman 16. Su media es 16/4=4, aunque 4 no sea uno de los datos.
38|Al ordenar 9,2,6,4,7 obtienes 2,4,6,7,9. La mediana es el tercer valor: 6.
39|Si hay 6 casos favorables entre 15 igualmente probables, P=6/15=2/5. No dividas por los nueve desfavorables.
40|Al extraer una sola ficha roja o azul, los eventos son incompatibles. P(roja y azul)=0; no se aplica independencia.
41|Un transporte cobra $900 fijos más $600 por kilómetro. Por 4 km se paga 900+600×4=$3.300.
42|Un producto de $200 con 15% de descuento queda en 200×0,85=$170. El ahorro es $30, no el precio final.
43|La recta 3x+y=12 equivale a y=−3x+12. Por cada unidad que aumenta x, y baja tres.
44|Un capital de $2.000 al 4% simple anual por tres años genera 2.000×0,04×3=$240 de interés. Total final: $2.240.
45|Una máquina produce 18 piezas por hora durante 5 horas: 18×5=90 piezas, suponiendo ritmo constante.
46|Para hallar x: (1) x+2=9; (2) 3x=21. Cada dato aislado determina x=7; no es necesario combinarlos.
47|Para hallar x: (1) x+y=8; (2) x−y=2. Cada dato admite múltiples valores de x; juntos fijan x=5.
48|Para decidir si x>0: (1) x²=16; (2) x=4. El primer dato deja ±4; el segundo basta por sí solo.
49|Para hallar el área de un rectángulo: (1) base=6; (2) altura=7. Ningún dato basta solo; juntos dan 42.
50|Para hallar x: (1) x²=25; (2) |x|=5. Incluso juntos dejan x=5 o x=−5: falta información.
51|Para hallar el perímetro de un cuadrado: (1) lado=3; (2) área=9. Cada dato basta por separado y lleva a perímetro 12.
52|La función h(t)=−(t−4)²+10 tiene máximo 10 en t=4. El coeficiente negativo hace que la parábola abra hacia abajo.
53|En dos dados justos independientes, suma 3 ocurre en (1,2) y (2,1). Son 2 de 36 pares: P=1/18.
54|Un círculo de diámetro 10 tiene radio 5. Su área es 25π; usar 10 como radio la multiplicaría por cuatro.
55|Si 120 aumenta 10%, el incremento es 12 y el nuevo valor 132. Multiplicar por 1,10 calcula directamente el total.
`.trim().split('\n');
for(const line of examples){const [n,example]=line.split('|');window.CACHASTE_M2[+n-1].editorial.example=example;}
}
/* Ejercicios de transferencia: cada concepto dispone de al menos dos ítems distintos. */
{
window.CACHASTE_M2.find(q=>q.id==='M2-024').editorial.example='Si h(x)=5·3^x, h(2)=5×9=45. El coeficiente multiplica la potencia; no se suma a ella ni se convierte en exponente.';
const rows=[
[3,'Una bolsa contiene 4 fichas verdes y 3 negras. Se extraen dos sin reposición. ¿Cuál es la probabilidad de que ambas sean verdes?','2/7',['16/49','4/7','1/7'],['16/49 mantiene la bolsa inicial en la segunda extracción: eso sería con reposición.','4/7 solo mide la primera extracción.','Debes considerar cuatro verdes al inicio y tres entre seis después, no un único caso.'],['La primera verde tiene probabilidad 4/7.','Sin devolverla, quedan tres verdes entre seis: 3/6.','Multiplica (4/7)(3/6)=12/42=2/7.'],'Al retirar una ficha cambian los casos disponibles. Cuenta de nuevo antes de calcular la segunda probabilidad.','Con 2 verdes y 3 blancas, dos verdes sin reposición tienen probabilidad (2/5)(1/4)=1/10.'],
[5,'Un sector de un círculo de radio 6 cm tiene ángulo central 120°. ¿Cuál es su área?','12π cm²',['36π cm²','6π cm²','4π cm²'],['36π es el área del círculo completo, pero el sector ocupa un tercio.','Se debe usar el radio al cuadrado antes de aplicar la fracción angular.','4π correspondería a otros datos; el círculo completo aquí mide 36π.'],['El círculo completo tiene área π×6²=36π cm².','El sector representa 120/360=1/3 del círculo.','Multiplica (1/3)×36π=12π cm².'],'Calcula primero todo el círculo y después toma la parte que corresponde al ángulo.','Un sector de 90° y radio 2 tiene área (90/360)π×2²=π unidades cuadradas.'],
[11,'¿Cuál es el dominio real de f(x)=√(2x−8)?','x≥4',['x>4','x≤4','Todos los reales'],['x=4 sí está permitido: √0 es real.','Para x menor que 4 el radicando resulta negativo.','Hay entradas que producen radicando negativo, por lo que no se admiten todos los reales.'],['Una raíz cuadrada real requiere radicando mayor o igual a cero.','Plantea 2x−8≥0 y suma ocho: 2x≥8.','Divide por dos positivo: x≥4, incluyendo el extremo.'],'Lo que está dentro de la raíz puede valer cero, pero no un número negativo si trabajas en los reales.','Para √(3x−6), exige 3x−6≥0. El dominio es x≥2.'],
[13,'Si f(x)=x−2 y g(x)=x², ¿cuánto vale g(f(5))?','9',['23','25','3'],['23 resulta de f(g(5)); invertiste el orden de composición.','25 es g(5), sin aplicar primero f.','3 es solo f(5); falta evaluar g sobre ese resultado.'],['La función interior es f: f(5)=5−2=3.','Ahora aplica g a la salida obtenida: g(3)=3².','El resultado es 9; componer no es intercambiar el orden.'],'Resuelve de adentro hacia afuera: el resultado de una función pasa a ser la entrada de la otra.','Si f(x)=x+1 y g(x)=3x, g(f(2))=g(3)=9; f(g(2))=7 es otra composición.'],
[16,'Una recta tiene pendiente 4. ¿Cuál es la pendiente de una recta perpendicular a ella?','−1/4',['4','−4','1/4'],['Pendiente igual da una recta paralela o coincidente, no perpendicular.','Cambiar solo el signo no basta: el producto sería −16, no −1.','Falta el signo negativo para que el producto de pendientes sea −1.'],['Para dos rectas no verticales perpendiculares, m₁m₂=−1.','Sustituye m₁=4 y despeja m₂=−1/4.','Comprueba: 4×(−1/4)=−1.'],'Usa el recíproco y cambia el signo; verifica siempre multiplicando ambas pendientes.','Una recta de pendiente 3 es perpendicular a otra de pendiente −1/3.'],
[18,'Si 3^(x+1)=81, ¿cuál es el valor de x?','3',['4','2','5'],['Cuatro es el exponente x+1, no x.','Con x=2 obtienes 3³=27, no 81.','Con x=5 obtienes 3⁶=729, no 81.'],['Expresa 81 como una potencia de tres: 81=3⁴.','Con bases iguales, x+1=4.','Resta uno: x=3. Sustituir da 3⁴=81.'],'Primero escribe ambos lados con la misma base. Después resuelve la ecuación de los exponentes.','Para 5^(x−2)=125, escribe 125=5³: x−2=3 y x=5.'],
[19,'¿Cuál es el desarrollo de (x+5)(x−5)?','x²−25',['x²+25','x²−5','x²−10x−25'],['El producto de +5 por −5 es negativo, no +25.','El término constante es −5²=−25, no −5.','Los términos +5x y −5x se cancelan; no queda término lineal.'],['Distribuye: x²−5x+5x−25.','Los términos lineales se anulan: −5x+5x=0.','Queda x²−25, una diferencia de cuadrados.'],'Los factores conjugados conservan el cuadrado del primero menos el cuadrado del segundo.','(y+2)(y−2)=y²−4. En cambio (y−2)² sí tiene un término lineal −4y.'],
[25,'Si h(x)=5x−10, ¿cuál es su función inversa?','(x+10)/5',['5x+10','(x−10)/5','1/(5x−10)'],['La inversa debe deshacer también la multiplicación por cinco, no mantenerla.','Para deshacer la resta de diez primero debes sumar diez.','Inversa de función no significa recíproco de su valor.'],['Escribe y=5x−10 y suma diez: y+10=5x.','Despeja la entrada: x=(y+10)/5.','Intercambia el nombre de las variables: h⁻¹(x)=(x+10)/5.'],'Para volver a la entrada, deshaz las operaciones en orden inverso: sumar diez y dividir por cinco.','Si f(x)=3x+6, su inversa es (x−6)/3. Comprobar f⁻¹(f(4))=4 valida el resultado.'],
[27,'Si |x−4|=3 y x<4, ¿cuánto vale x?','1',['7','−1','3'],['Siete cumple el valor absoluto, pero no la condición x<4.','Con −1, la distancia a cuatro es cinco, no tres.','Con x=3, |3−4| vale uno, no tres.'],['El valor absoluto expresa distancia tres respecto de cuatro.','Las posibilidades son x−4=3 o x−4=−3: x=7 o x=1.','La condición x<4 selecciona x=1.'],'Busca los dos puntos a esa distancia y aplica luego la condición que distingue uno de ellos.','Si |x+1|=2 y x>−1, las soluciones candidatas son 1 y −3. Solo 1 cumple la condición.'],
[29,'Para x²−4x+5=0, ¿cuál es el discriminante?','−4',['4','0','36'],['Debes restar 4ac=20 a b²=16; el resultado no es positivo.','Cero requeriría igualdad entre b² y 4ac, que aquí no ocurre.','36 suma 16 y 20; la fórmula exige restarlos.'],['Identifica a=1, b=−4 y c=5.','Aplica Δ=b²−4ac=16−20=−4.','El discriminante negativo indica ausencia de soluciones reales.'],'El discriminante permite anticipar cuántas raíces reales hay antes de resolver toda la ecuación.','En x²−2x+1=0, Δ=4−4=0: hay una raíz real doble x=1.'],
[30,'¿Cuál es la solución de −2x+3≥11?','x≤−4',['x≥−4','x≤4','x<−4'],['Al dividir por un negativo debes invertir el sentido de la desigualdad.','Al dividir ocho por −2 obtienes −4, no +4.','El extremo x=−4 sí cumple igualdad, por lo que se incluye.'],['Resta tres a ambos lados: −2x≥8.','Divide por −2 e invierte el signo: x≤−4.','Comprueba el extremo: −2(−4)+3=11.'],'Dividir por un número negativo invierte el orden; además, conserva la posibilidad de igualdad.','De −3x<9 se obtiene x>−3. El signo se invierte por dividir entre −3.'],
[31,'Un triángulo tiene base 14 cm y altura perpendicular 5 cm. ¿Cuál es su área?','35 cm²',['70 cm²','19 cm²','140 cm²'],['Setenta es base por altura; falta dividir por dos.','Sumar base y altura no determina un área.','Ciento cuarenta duplica el producto en vez de tomar su mitad.'],['Usa área triangular=(base×altura perpendicular)/2.','Multiplica 14×5=70.','Divide por dos: 35 cm².'],'Un triángulo ocupa la mitad de un paralelogramo de igual base y altura.','Con base 8 y altura 3, el área es 8×3/2=12 unidades cuadradas.'],
[32,'En un triángulo rectángulo, la hipotenusa mide 17 cm y un cateto 8 cm. ¿Cuánto mide el otro cateto?','15 cm',['9 cm','√353 cm','25 cm'],['No se restan directamente las longitudes: se relacionan sus cuadrados.','Sumaste los cuadrados como si buscaras la hipotenusa; aquí falta un cateto.','Sumar 17 y 8 no aplica el teorema de Pitágoras.'],['Aplica Pitágoras: el cateto desconocido cumple a²+8²=17².','Despeja a²=289−64=225.','La longitud es positiva: a=√225=15 cm.'],'Si conoces la hipotenusa, resta cuadrados para obtener el cuadrado del cateto que falta.','Con hipotenusa 10 y cateto 6, el otro cateto es √(100−36)=8.'],
[34,'¿Cuánto mide cada ángulo interior de un octágono regular?','135°',['1080°','45°','144°'],['1080° es la suma de los ocho ángulos, no uno de ellos.','45° corresponde al ángulo exterior regular, no al interior.','144° es el ángulo interior de un decágono regular, no un octágono.'],['La suma interior de un polígono de n lados es (n−2)×180°.','Con n=8, la suma es 1080°.','Al ser regular, divide entre ocho: 135° por ángulo.'],'Primero calcula el total interior y luego repártelo por igual entre los ocho vértices.','En un pentágono regular la suma es 540° y cada ángulo interior mide 108°.'],
[35,'Si u=(−2,5) y v=(6,−3), ¿cuál es u+v?','(4,2)',['(−8,8)','(−12,−15)','(4,8)'],['Ese resultado resta v a u en lugar de sumar.','Multiplicaste componentes; no es la operación pedida.','La segunda coordenada es 5+(−3)=2, no ocho.'],['Suma las coordenadas horizontales: −2+6=4.','Suma las verticales con sus signos: 5−3=2.','El vector suma es (4,2).'],'Combina horizontal con horizontal y vertical con vertical, respetando los signos de cada componente.','(1,−1)+(2,4)=(3,3); no se mezclan las coordenadas de ejes diferentes.'],
[37,'Los valores de un conjunto son 2, 4, 6 y 8. ¿Cuál es su media aritmética?','5',['20','4','6'],['Veinte es la suma total, pero falta dividir por cuatro datos.','Cuatro no distribuye la suma total entre los cuatro valores.','Seis es un dato observado; la media aquí queda entre los dos valores centrales.'],['Suma todos los datos: 2+4+6+8=20.','Cuenta cuatro observaciones.','Divide 20/4=5; una media puede no estar entre los datos originales.'],'La media reparte el total en partes iguales, una por cada observación.','Con 3, 6 y 9, la suma 18 dividida por tres da media 6.'],
[38,'Los datos ordenados son 1, 3, 8 y 12. ¿Cuál es su mediana?','5,5',['3','8','6'],['Con cantidad par de datos no basta tomar solo el central inferior.','También debes considerar el central inferior, no solo el superior.','Seis es la media de los cuatro datos; la mediana usa los dos centrales.'],['Hay cuatro datos: la cantidad es par.','Los dos valores centrales son tres y ocho.','Su promedio es (3+8)/2=5,5.'],'En una lista par, la mediana queda a mitad de camino entre los dos valores centrales.','En 2, 4, 10 y 20, la mediana es (4+10)/2=7, aunque la media sea otra.'],
[40,'Dos eventos A y B son mutuamente excluyentes. Si P(A)=0,3 y P(B)=0,4, ¿cuál es P(A∪B)?','0,7',['0,12','0,1','0,58'],['El producto no calcula esta unión y la intersección aquí es cero.','La diferencia no mide que ocurra A o B.','0,58 restaría una intersección de 0,12; los eventos dados no tienen casos compartidos.'],['Ser excluyentes significa P(A∩B)=0.','Aplica P(A∪B)=P(A)+P(B)−P(A∩B).','Calcula 0,3+0,4−0=0,7.'],'Como no pueden pasar juntos, no hay casos compartidos que debas descontar al sumar.','Si dos categorías excluyentes tienen probabilidades 0,2 y 0,5, pertenecer a una u otra tiene probabilidad 0,7.'],
[41,'Un servicio cobra $2.000 fijos más $600 por hora. ¿Cuánto cuesta usarlo durante 3 horas?','$3.800',['$1.800','$7.800','$2.600'],['Ese monto incluye las tres horas, pero omite el cargo fijo.','Multiplicaste también el cargo fijo por tres, aunque se cobra una sola vez.','Ese es el costo de una hora, no de tres.'],['Modela C(t)=2000+600t.','Calcula el costo variable: 600×3=1800.','Suma el cargo fijo: 2000+1800=3800 pesos.'],'Se paga una parte una sola vez y otra parte por cada hora; sepáralas antes de calcular.','Un cobro C(n)=100+50n cuesta 300 cuando n=4: el cargo de 100 no se multiplica por cuatro.'],
[45,'Ocho personas terminan un trabajo en 5 horas. Suponiendo la misma productividad por persona y sin interferencias, ¿cuánto tardan 16 personas en el mismo trabajo?','2,5 horas',['10 horas','5 horas','40 horas'],['Duplicar personas reduce el tiempo bajo estos supuestos; no lo duplica.','Mantener cinco horas ignoraría la duplicación de capacidad total.','Cuarenta son horas-persona del trabajo, no horas de las dieciséis personas.'],['El trabajo requiere 8×5=40 horas-persona.','Con dieciséis personas, divide 40/16.','Se necesitan 2,5 horas, bajo los supuestos de proporcionalidad indicados.'],'Al duplicar personas con igual productividad y el mismo trabajo, el tiempo se reduce a la mitad.','Si tres personas tardan ocho horas, seis personas tardarían cuatro bajo el mismo modelo ideal.'],
[49,'Para determinar el área de un rectángulo se sabe: (1) su base mide 5 cm; (2) su altura mide 9 cm. ¿Qué información es suficiente?','Ambas juntas, ninguna por sí sola',['Solo (1)','Solo (2)','Cada una por sí sola','Se requiere información adicional'],['Solo una base admite muchas alturas y áreas.','Solo una altura admite muchas bases y áreas.','Cada dato aislado deja indeterminado el otro lado.','Con ambos lados el área queda determinada: 5×9=45 cm².'],['El área rectangular es base por altura.','La base sola o la altura sola no fijan ese producto.','Juntas dan 45 cm²; ninguna afirmación basta por separado.'],'Para saber el área necesitas las dos dimensiones perpendiculares. Un lado no determina el otro.','Una base cuatro y una altura seis, juntas, fijan área 24. Sin una de ellas todavía hay muchas áreas posibles.'],
[51,'Para determinar el área de un cuadrado se sabe: (1) su perímetro es 20 cm; (2) su diagonal mide 5√2 cm. ¿Qué información es suficiente?','Cada una por sí sola',['Solo (1)','Solo (2)','Ambas juntas, ninguna por sí sola','Se requiere información adicional'],['El perímetro basta, pero la diagonal también permite hallar el lado.','La diagonal basta, pero el perímetro también determina el lado.','No es necesario combinar las afirmaciones: cada una fija el mismo cuadrado.','Cada dato determina lado cinco y área veinticinco; no falta otra medida.'],['Del perímetro: lado=20/4=5 y área=25 cm².','De diagonal=d=lado×√2: lado=(5√2)/√2=5, también área 25 cm².','Cada afirmación es suficiente por sí sola.'],'En un cuadrado todas las longitudes se relacionan con el lado. Tanto perímetro como diagonal pueden determinarlo solos.','Un perímetro doce fija lado tres y área nueve; una diagonal 3√2 conduce al mismo resultado sin usar el perímetro.'],
[53,'Se lanzan dos dados justos e independientes de seis caras. ¿Cuál es la probabilidad de que sumen 5?','1/9',['1/6','5/36','1/12'],['Una suma de cinco tiene cuatro pares favorables, no seis.','No existen cinco pares favorables: un dado no puede mostrar cero.','Tres pares darían 1/12; para sumar cinco hay cuatro.'],['Hay 6×6=36 pares ordenados equiprobables.','Los favorables son (1,4), (2,3), (3,2) y (4,1).','P=4/36=1/9.'],'Cuenta pares posibles de caras; las sumas no tienen todas la misma probabilidad.','Para suma cuatro hay tres pares: (1,3), (2,2), (3,1). Su probabilidad es 3/36=1/12.'],
[54,'Un círculo tiene radio 7 cm. ¿Cuál es su área?','49π cm²',['14π cm²','7π cm²','196π cm²'],['14π corresponde a la longitud de la circunferencia, con unidades de longitud.','Falta elevar el radio al cuadrado en la fórmula del área.','Usaste el diámetro catorce como si fuera el radio, cuadruplicando el área.'],['El área de un círculo es A=πr².','Eleva el radio: 7²=49.','Multiplica por π y expresa área: 49π cm².'],'El área crece con el cuadrado del radio; no se obtiene con la fórmula del contorno.','Si el diámetro es seis, el radio es tres y el área es 9π, no 36π.'],
[67,'¿Cuál es el área de la superficie de una esfera de radio 2 cm?','16π cm²',['(32/3)π cm²','4π cm²','8π cm²'],['Ese número viene de la fórmula de volumen, aunque aquí se pide superficie.','Se omitió el factor cuatro de A=4πr².','Se multiplicó por el radio sin elevarlo al cuadrado.'],['Distingue superficie de volumen: A=4πr².','Sustituye radio dos: A=4π×2².','El área superficial es 16π cm².'],'La superficie usa unidades cuadradas y la fórmula 4πr²; el volumen usa unidades cúbicas y otra fórmula.','Una esfera de radio uno tiene superficie 4π y volumen 4π/3; distinguirlos evita usar la fórmula equivocada.'],
[78,'¿Cuál es una expresión simplificada de √75+√12?','7√3',['√87','√63','7√6'],['No se puede sumar radicandos como si la raíz distribuyera sobre una suma.','El enunciado suma raíces; tampoco se restan directamente los radicandos.','Tras extraer cuadrados ambas raíces quedan en √3; no se multiplica por otra raíz.'],['Descompón: √75=√(25×3)=5√3.','También √12=√(4×3)=2√3.','Son radicales semejantes: 5√3+2√3=7√3.'],'Extrae los factores cuadrados y después suma solo los coeficientes de la misma raíz.','√27−√3=3√3−√3=2√3. La raíz común permanece igual.']
];
const suff=['Solo (1)','Solo (2)','Ambas juntas, ninguna por sí sola','Cada una por sí sola','Se requiere información adicional'];
rows.forEach(([base,question,correct,wrong,reasons,steps,easy,example],i)=>{
 const original=window.CACHASTE_M2.find(q=>q.id==='M2-'+String(base).padStart(3,'0'));
 const choices=[correct,...wrong],offset=i%4;
 const options=original.area==='Suficiencia de datos'?suff.slice():choices.slice(offset).concat(choices.slice(0,offset));
 const why=steps.join(' '),lookup=new Map(wrong.map((w,n)=>[w,reasons[n]]));
 window.CACHASTE_M2.push({id:'M2-'+String(81+i).padStart(3,'0'),area:original.area,concept:original.concept,question,options,answer:options.indexOf(correct),explanations:options.map(o=>o===correct?'¡Cachaste! '+why:lookup.get(o)),why,hint:steps[0],editorial:{steps,easy,example},origin:'original',difficulty:'intermedio',reviewStatus:'revision_individual_2026-10-15'});
});
}

/* Clases del tutor, revisión pedagógica desde fundamentos. No altera ítems ni claves. */
/* Correcciones de diagnósticos: asociación exacta por alternativa, sin atribuir operaciones falsas. */
{
 const replacements={
 'M2-003':{'1/5':'1/5 cuenta una ficha concreta entre cinco en una sola extracción. Aquí hay tres rojas favorables y se necesitan dos seguidas: actualiza después a dos rojas entre cuatro y multiplica 3/5 por 2/4.'},
 'M2-004':{'0,45':'0,45 es el promedio de 0,4 y 0,5: (0,4+0,5)/2. Promediar no calcula que sucedan ambos eventos. Además, 0,45 supera 0,4, imposible para una intersección contenida en A. Usa el producto por la independencia dada.'},
 'M2-013':{'13':'El resultado intermedio es f(3)=5 y ese cinco completo debe entrar en g. Por eso la salida es 5×5, no trece. Separar entrada, resultado intermedio y salida evita mezclar partes de las dos reglas.'},
 'M2-024':{'9':'Nueve puede obtenerse como 3², pero tres es el coeficiente, no la base de la potencia. La base es dos y el exponente dos: primero 2×2=4 y después tres grupos de cuatro.','18':'Si el total fuera dieciocho, al dividirlo por el factor externo tres quedaría seis. Pero la potencia 2² debe valer cuatro. Recalcula ese bloque como 2×2 y luego multiplícalo una sola vez por tres.'},
 'M2-026':{'6':'Si x fuera seis, la primera ecuación exigiría y=4 y la segunda y=2. No puede ser la misma pareja. Al sumar ambas ecuaciones, las y desaparecen y queda 2x=14; dividir entre dos corrige la inconsistencia.'},
 'M2-063':{'(−1,1)':'Para una homotecia con centro en el origen ambas coordenadas deben multiplicarse por −2. Aquí −1/3 y 1/(−1)=−1 son factores distintos y ninguno produce la razón pedida. Calcula −2·3 y −2·(−1) por separado.'},
 'M2-082':{'6π cm²':'6π es una sexta parte de 36π, la superficie que correspondería a 60°. Aquí el ángulo de 120° ocupa el doble: un tercio del círculo. Comprueba la fracción 120/360 antes de multiplicar por 36π.','4π cm²':'4π es la novena parte de 36π, que correspondería a un ángulo de 40°, no 120°. La porción pedida es un tercio del círculo y mide tres veces esa área: 12π cm². Comparar tu área con el total permite detectar la fracción equivocada.'},
 'M2-081':{'1/7':'1/7 representa una ficha concreta entre siete en un primer intento. No cuenta las cuatro fichas verdes ni la segunda extracción. Empieza con cuatro favorables entre siete y después tres entre seis: 4/7·3/6=2/7.'},
 'M2-096':{'4':'Cuatro es la cantidad de datos y también uno de los valores, pero no el reparto uniforme del total. Si cada uno tuviera cuatro, sumarían dieciséis y faltaría parte de los veinte originales. Repartir veinte entre cuatro da cinco.'}
 };
 for(const [id,byOption]of Object.entries(replacements)){const q=window.CACHASTE_M2.find(q=>q.id===id);q.explanations=q.options.map((o,i)=>byOption[o]||q.explanations[i]);}
 const q=window.CACHASTE_M2.find(q=>q.id==='M2-027');
 q.explanations=['La distancia cinco desde tres permite ocho o menos dos. La condición x>3 selecciona ocho.','Menos dos sí está a cinco unidades de tres: |−2−3|=5. Pero queda a su izquierda y viola x>3. Conserva el candidato del lado derecho: 3+5=8.','Cinco es la distancia pedida, no la coordenada del punto. Si x=5, |5−3|=2, no cinco. Para avanzar cinco desde el centro tres hay que sumar 3+5=8.','Tres es el punto de referencia: su distancia a sí mismo es |3−3|=0. Necesitas alejarte cinco unidades y, como x>3, hacerlo hacia la derecha hasta ocho.'];
}
window.CACHASTE_M2_APPLICATIONS={
 'M2-001':['Buscamos el x del mínimo, no el valor de f. El término x²−4x se parece a (x−2)² porque (x−2)²=x²−4x+4.','Para conservar la expresión, suma y resta cuatro: x²−4x+1=x²−4x+4−4+1.','Agrupa los tres primeros términos: f(x)=(x−2)²−3. No se cambió la función; solo su escritura.','El cuadrado alcanza su mínimo cero cuando x−2=0, es decir x=2.','Allí f(2)=−3. Como preguntan en qué x ocurre, se elige x=2.'],
 'M2-021':['La condición f(x)=15 se escribe 2x+3=15.','Restar tres en ambos lados conserva la igualdad: 2x+3−3=15−3, así que 2x=12.','Dividir ambos lados entre dos da 2x/2=12/2 y x=6.','Sustituye en la regla original: 2·6+3=15.'],
 'M2-025':['Escribe la salida como y=3x−6. Queremos una regla que reciba y y recupere x.','Suma seis a ambos lados: y+6=3x−6+6=3x.','Divide ambos lados entre tres: x=(y+6)/3.','Renombra la entrada de la regla inversa como x: f⁻¹(x)=(x+6)/3. El paréntesis exige dividir toda la suma.'],
 'M2-026':['La misma pareja debe cumplir x+y=10 y x−y=4.','Suma los miembros correspondientes: (x+y)+(x−y)=10+4.','Agrupa: 2x+(y−y)=14, por tanto 2x=14.','Divide entre dos: x=7. En la primera igualdad queda y=10−7=3.','Comprueba también la segunda: 7−3=4. La pregunta pide x, no y.']
};
window.CACHASTE_M2_TEACH = function(lessons) {
 for(const q of window.CACHASTE_M2){
  const l=lessons[q.concept];if(!l)continue;
  if(q.teaching)throw new Error('Clase duplicada: '+q.id);
  const old={...q.editorial,steps:window.CACHASTE_M2_APPLICATIONS[q.id]||q.editorial.steps}, suff=q.area==='Suficiencia de datos';
  const foundation=l.foundation.slice();
  if(suff)foundation.push('Esta es una pregunta de suficiencia: no basta encontrar una respuesta posible. Prueba (1) sin usar (2), luego (2) sin usar (1) y solo después combínalas si hace falta. Si piden un valor, debe quedar uno solo; si preguntan si una propiedad se cumple, la información debe decidirla sin ambigüedad. Dos ejemplos compatibles con respuestas distintas demuestran que un dato no basta.');
  const check=l.checks[q.id.slice(3)];if(!check)throw new Error('Falta comprobación específica: '+q.id);
  q.teaching={revision:'tutor-profesor-2026-10-15',quality:'adecuada',aim:l.aim,foundation,application:old.steps.slice(),check,intuition:l.intuition.slice(),example:{problem:l.problem,steps:l.example.slice(),bridge:l.bridge},selectedFeedback:q.explanations.map((text,i)=>i===q.answer?null:{diagnosis:text,repair:old.steps.slice()})};
  // Representación textual completa para exportación, pruebas y lectores anteriores.
  q.editorial={steps:[l.aim,...foundation,...old.steps,check],easy:l.intuition.join('\n\n')+'\n\nEn tu ejercicio: '+old.steps.join(' '),example:l.problem+'\n\n'+l.example.join('\n\n')+'\n\n'+l.bridge};
  q.why=q.editorial.steps.join('\n\n');q.hint=l.aim;q.explanations[q.answer]=q.why;
 }
};
window.CACHASTE_M2_TEACH({
'Vértice de una cuadrática':{
 aim:'Primero distingue dos preguntas diferentes: dónde está el punto más alto o bajo, y cuánto vale la función allí. La primera pide una entrada x; la segunda pide una altura, f(x). El eje de simetría también se describe mediante una entrada x.',
 foundation:['Una función asigna una salida a cada entrada. En una cuadrática aparece x² y su gráfica es una parábola. El vértice es el punto donde cambia de bajar a subir, o al revés. En f(x)=a(x−h)²+k, h indica su posición horizontal y k su altura. Si a>0, abre hacia arriba y hay mínimo; si a<0, abre hacia abajo y hay máximo.','Un cuadrado real nunca es negativo: por ejemplo, (−3)²=9 y 0²=0. Por eso (x−h)² es lo más pequeño posible cuando x=h. Completar el cuadrado consiste en reescribir la misma expresión en esta forma, sin cambiar sus valores. El signo dentro del paréntesis importa: x+4 equivale a x−(−4).'],
 intuition:['Imagina un valle: una cosa es el kilómetro del camino donde está el fondo y otra es la altura del fondo. Confundir esas dos coordenadas es como responder «kilómetro 2» cuando preguntaron «a qué altura».','El término al cuadrado mide cuánto te alejaste horizontalmente del centro. A ambos lados, alejarse lo mismo produce el mismo cuadrado. Con signo positivo subes desde el fondo; con signo negativo bajas desde una cumbre. Esta imagen explica tanto el extremo como la simetría.'],
 problem:'Otro problema: un modelo inventado para el costo de fabricar q piezas es C(q)=(q−6)²+20. ¿Cómo comparar q=4 y q=8, y qué producción minimiza el costo?',
 example:['Con q=4: (4−6)²+20=4+20=24. Con q=8: (8−6)²+20=4+20=24. Las dos producciones están a dos unidades de seis.','Ningún cuadrado puede restar a 20. Con q=6 el cuadrado vale cero y el costo es 20; cualquier otra entrada suma un valor positivo.','La producción que minimiza es q=6; el costo mínimo es 20. La recta q=6 divide la parábola en mitades simétricas. Son tres respuestas relacionadas, pero distintas.'],
 bridge:'En la pregunta original identifica cuál de esas tres cosas solicitan. Luego localiza el cuadrado que puede anularse; no confundas el número dentro del paréntesis con la altura exterior.',
 checks:{'001':'Comprueba sustituyendo: f(2)=4−8+1=−3. Como f(x)=(x−2)²−3 y el cuadrado es ≥0, ningún otro x produce menos de −3. Se pidió el x: responde 2.','023':'Prueba a ambos lados de −4: en x=−5 y x=−3 se obtiene 0; en x=−4 se obtiene −1. La simetría está alrededor de x=−4, no de la altura y=−1.','052':'Sustituye x=1: f(1)=9. Para cualquier otro x, restas un cuadrado positivo a nueve. Así se comprueba el máximo 9; uno es su ubicación, no su valor.'}},
'Función exponencial':{
 aim:'Busca si el cambio se produce por sumar siempre una cantidad o por multiplicar repetidamente por un factor. En una exponencial la variable está en el exponente, y cada período aplica otra multiplicación.',
 foundation:['En a·b^t, a es la cantidad inicial, b el factor por período y t la cantidad de períodos. La potencia b³ significa b·b·b. Con b>1 hay crecimiento; con 0<b<1 hay disminución. No es lo mismo multiplicar tres veces por dos que sumar tres veces dos.','Para evaluar una expresión respeta el orden: primero cada potencia, después sus multiplicaciones y finalmente sumas o restas. La propiedad que resta exponentes sirve para un cociente de potencias de igual base; no sirve para restar sus valores. Un porcentaje conservado se convierte en factor: 80% equivale a 0,8.'],
 intuition:['Piensa en copiar una imagen y después copiar todas las copias. Si cada ronda duplica lo que había, las rondas siguientes actúan sobre una cantidad ya cambiada. El comienzo es la ronda cero: todavía no aplicaste ninguna copia.','También puedes imaginar un recipiente que pierde la misma fracción cada vez. La segunda pérdida se calcula sobre lo que quedó, no sobre lo que había al principio. Haz una fila por período: ayuda a entender el modelo antes de abreviar con potencias.'],
 problem:'Otro problema: una hoja ideal de grosor d se dobla por la mitad repetidamente, y cada doblez duplica el número de capas. ¿Cómo comparar el grosor después de un doblez y después de cuatro?',
 example:['Antes de doblar hay una capa: grosor d. Las cantidades de capas después de cada doblez son 2, 4, 8 y 16.','Después de uno el grosor es 2d; después de cuatro, 16d. La diferencia es 16d−2d=14d. El cociente, en cambio, es 16d/(2d)=8.','No reemplaces la diferencia por 2^(4−1): ese cálculo describe la razón ocho entre los grosores, no las catorce capas adicionales. El modelo es ideal y no afirma que una hoja real pueda doblarse indefinidamente.'],
 bridge:'En tu ejercicio identifica el factor que se repite y cuántas veces se aplica. Si se pide una diferencia entre valores de la función, calcula ambos valores antes de restarlos.',
 checks:{'002':'g(3)=8 y g(1)=2: al restar obtienes 6. En cambio 2^(3−1)=4; que dé otro número permite detectar la propiedad de exponentes mal aplicada.','020':'Cuenta tres cambios, no dos: al inicio 200; tras una hora 400; tras dos 800; tras tres 1.600. La secuencia verifica el exponente tres.','024':'El término 3·2² significa tres grupos de cuatro: 12. No significa (3·2)²=36 ni 3+2²=7; los paréntesis indicarían operaciones distintas.','058':'Después de dos horas quedan 320 g; se perdieron 180 g. Comprueba 320/400=0,8 y 400/500=0,8: ambas horas conservan la misma fracción.'}},
'Probabilidad sin reposición':{
 aim:'Necesitamos que ocurran dos resultados seguidos. Antes de calcular, aclara si el primer objeto vuelve al conjunto: «sin reposición» significa que no vuelve y cambia las posibilidades siguientes.',
 foundation:['Una probabilidad compara casos favorables con casos posibles, cuando todos los objetos se eligen con la misma posibilidad. Para dos éxitos consecutivos se multiplica la probabilidad del primero por la del segundo condicionada a que el primero haya ocurrido. «Condicionada» significa que actualizamos la información.','Si el primer objeto cumple la condición deseada y lo retiramos, quedan un objeto favorable menos y un objeto total menos. Es incorrecto mantener la misma fracción en ambas extracciones. No sumamos porque se exige el primer resultado Y el segundo, no uno U otro.'],
 intuition:['Imagina repartir los últimos queques de una bandeja. Después de entregar uno, la bandeja tiene menos queques. Si justo entregaste uno de chocolate, también quedan menos de chocolate. La segunda persona no elige de la bandeja que existía antes.','Haz un dibujo y tacha el primer objeto deseado. Cuenta de nuevo lo disponible; así puedes construir la segunda fracción sin memorizar una fórmula. Multiplicar ambas fracciones encadena los dos requisitos.'],
 problem:'Otro problema: cuatro personas, Ana, Beto, Cata y Diego, se ordenan al azar para exponer. ¿Qué probabilidad hay de que Ana y Beto ocupen los primeros dos lugares en cualquier orden?',
 example:['Para que el primer lugar sea de una de esas dos personas hay 2 opciones favorables entre 4: probabilidad 2/4.','Una vez que expuso una de ellas, queda solo la otra entre tres personas. La segunda probabilidad es 1/3, no 2/4.','Multiplica (2/4)·(1/3)=1/6. Esto incluye los órdenes Ana–Beto y Beto–Ana. Comprobar solo un orden daría 1/12 y dejaría fuera la mitad de los casos pedidos.'],
 bridge:'Aunque tu pregunta habla de fichas y este ejemplo de posiciones, ambos consumen una opción en la primera etapa. Actualiza tanto los favorables como el total antes de calcular la segunda.',
 checks:{'003':'La fracción segunda es 2/4 porque ya salió una de las tres rojas. (3/5)·(2/4)=6/20=3/10. El resultado debe ser menor que 3/5, pues obtener dos rojas exige más que obtener solo la primera.','081':'Tras una verde quedan tres verdes entre seis fichas. (4/7)·(3/6)=12/42=2/7. Usar (4/7)² describiría otra experiencia, con devolución de la primera ficha.'}},
'Independencia de eventos':{
 aim:'Identifica si piden que ocurran simultáneamente varios eventos y si el enunciado permite tratarlos como independientes. Son dos preguntas distintas: qué resultado buscamos y qué relación existe entre los eventos.',
 foundation:['Un evento es un conjunto de resultados que nos interesa. A∩B se lee «A y B». Independencia significa que conocer lo ocurrido en uno no cambia la probabilidad del otro; no significa que sean imposibles de combinar. En ese caso P(A∩B)=P(A)·P(B).','Para repetir el argumento con varios intentos, cada probabilidad debe mantenerse al conocer los resultados anteriores. Una moneda equilibrada tiene probabilidad 1/2 de cara en cada lanzamiento independiente, aunque antes hayan salido muchas caras. La fórmula de multiplicación se usa porque deben cumplirse todos los requisitos.'],
 intuition:['Piensa en pasar dos controles separados: primero necesitas cumplir uno y después el otro. Si de cada diez casos pasan cuatro el primer control, y la mitad de esos vuelve a pasar el segundo sin que cambie la proporción, al final pasan dos de cada diez.','No sumes ambas probabilidades para responder «los dos». Una suma contaría también casos que solo pasan uno. Tampoco confundas independencia con exclusión: dos lanzamientos pueden dar cara a la vez, aunque ninguno influya en el otro.'],
 problem:'Otro problema: en un modelo de fábrica dos controles son independientes. Un producto supera el primero con probabilidad 0,8 y el segundo con 0,75. ¿Qué fracción supera ambos y cuál no supera ambos?',
 example:['De 100 productos esperados en el modelo, 80 pasan el primero. Entre esos 80, el 75% pasa el segundo: 80·0,75=60.','La probabilidad de ambos es 0,8·0,75=0,60. El resto, 1−0,60=0,40, falla al menos un control.','No confundas ese 0,40 con fallar los dos: fallar ambos sería 0,2·0,25=0,05. «No ambos» y «ninguno» son condiciones distintas.'],
 bridge:'Traduce primero el enunciado a «todos estos requisitos deben cumplirse». Si la independencia está establecida, multiplica las probabilidades correspondientes, sin arrastrar resultados anteriores como si cambiaran el azar.',
 checks:{'004':'De 100 casos del modelo, 40 cumplen A y la mitad de esos 40 cumple también B: son 20 de 100, equivalentes a 0,2. El producto no puede superar la probabilidad de cada evento.','014':'Las ocho secuencias son CCC, CCS, CSC, CSS, SCC, SCS, SSC y SSS. Solo CCC cumple tres caras: 1/8. Enumerarlas verifica el producto (1/2)³.'}},
'Sectores circulares':{
 aim:'Un sector es una porción del interior del círculo, como una rebanada. Se pide su superficie: no la longitud del borde ni la del arco curvo.',
 foundation:['El radio r es la distancia desde el centro al borde. El área del círculo completo es πr², donde π es una constante cercana a 3,14. Elevar r al cuadrado refleja que medimos una superficie en dos dimensiones; sus unidades son cuadradas.','Una vuelta completa tiene 360°. Si el ángulo central del sector es θ, este ocupa la fracción θ/360 del círculo. Por eso el área es (θ/360)·πr². El arco usa la misma fracción de 2πr, pero ese resultado es longitud y no responde una pregunta de superficie.'],
 intuition:['Imagina que pintas una mesa redonda y marcas tres porciones iguales desde el centro. Cada porción recibe un tercio de la pintura que cubre toda la mesa. Medir solo la cinta de su borde no diría cuánta pintura necesitas.','El ángulo dice qué parte de la mesa escogiste; el radio dice cuán grande es toda la mesa. Primero piensa en el tamaño completo y después toma la parte que corresponde. Así no mezclas tamaño con fracción.'],
 problem:'Otro problema: un aspersor riega un círculo completo de radio 4 m. Una pared obliga a limitarlo a un ángulo central de 90°. ¿Qué superficie deja de regarse?',
 example:['El círculo completo mide π·4²=16π m². Un ángulo de 90° ocupa 90/360=1/4 de ese círculo.','La superficie que todavía se riega es 16π/4=4π m².','La pregunta pide la superficie que queda sin regar: 16π−4π=12π m². Calcular bien el sector no basta si luego respondemos por la región equivocada.'],
 bridge:'En la pregunta original identifica si se pide el sector o su complemento y conserva unidades cuadradas. El ángulo se compara con 360°, no con el radio.',
 checks:{'005':'El círculo de radio tres mide 9π. Tres sectores de 120° completan 360°: cada uno debe medir 9π/3=3π. 6π mediría el contorno completo, no una superficie.','082':'El círculo de radio seis tiene 36π cm². Un tercio es 12π cm²; tres sectores de esa área reconstruyen los 36π del total.'}},
'Distancia en el plano':{
 aim:'Queremos una longitud recta entre dos puntos o desde el origen hasta la punta de un vector. Debemos combinar la separación horizontal con la vertical, no recorrer los dos ejes por separado.',
 foundation:['En un punto (x,y), x indica la posición horizontal e y la vertical. Al restar coordenadas obtenemos cambios: Δx=x₂−x₁ y Δy=y₂−y₁. Esos cambios forman los catetos de un triángulo rectángulo; el segmento directo es su hipotenusa.','Pitágoras relaciona los cuadrados de sus longitudes: d²=(Δx)²+(Δy)². Sacamos raíz positiva porque una distancia no es negativa. Para el vector (a,b), el punto inicial es el origen y su magnitud es √(a²+b²). Los signos dan dirección; los cuadrados permiten medir la longitud.'],
 intuition:['En una cuadrícula, ir tres cuadras a la derecha y cuatro hacia arriba suma siete cuadras de camino. Un trayecto directo en diagonal es más corto. Sumar tres y cuatro responde cuánto caminaste por los bordes, no cuánto mide la diagonal.','Dibuja el rectángulo que une las posiciones. Sus lados te ayudan a ver los dos cambios y su diagonal la distancia que buscas. Si intercambias inicio y final, cambian los signos de las restas, pero la longitud debe seguir igual.'],
 problem:'Otro problema: un robot pasa de A=(−2,1) a B=(4,9). ¿Qué recorrido es más largo: seguir los ejes o ir por el segmento directo?',
 example:['El cambio horizontal es 4−(−2)=6 y el vertical 9−1=8. El recorrido siguiendo ejes mide 6+8=14 unidades.','El segmento directo mide √(6²+8²)=√(36+64)=√100=10 unidades.','La diferencia es 14−10=4. El cálculo también sirve para el módulo del vector desplazamiento (6,8), aunque el robot podría haber seguido un camino real más largo.'],
 bridge:'Primero determina las diferencias, incluyendo los signos de coordenadas negativas. Luego decide si se pide longitud directa, módulo de vector o recorrido por ejes: esas magnitudes no siempre coinciden.',
 checks:{'006':'Las diferencias son tres y cuatro: 5²=25 coincide con 3²+4²=9+16. Así se verifica la distancia cinco sin sumar los catetos.','017':'Un vector de componentes tres y cuatro tiene módulo cinco porque 5²=3²+4². El módulo debe ser al menos tan grande como la magnitud de cada componente.','033':'2−(−1)=3: restar un negativo suma. La comprobación es 5²=3²+4². Si usas uno como diferencia horizontal, estarías uniendo otros puntos.'}},
'Logaritmos':{
 aim:'Un logaritmo permite recuperar un exponente. Antes de operar distingue la base, el argumento y el resultado: cada uno cumple un papel diferente.',
 foundation:['En log_b(A)=c, b es la base que elevamos, A el número que queremos obtener y c el exponente buscado. La expresión significa exactamente b^c=A. Trabajamos con base positiva distinta de uno y argumento A positivo; el logaritmo real de cero o de un número negativo no está definido.','Si el argumento es una expresión con x, primero la tratamos como un bloque: recuperamos ese bloque mediante una potencia y después despejamos x. Para argumentos positivos, log_b(UV)=log_b(U)+log_b(V), porque multiplicar potencias de igual base suma sus exponentes; no multiplica los valores de los logaritmos.'],
 intuition:['Imagina una escalera donde cada peldaño multiplica por la misma base. El logaritmo pregunta cuántos peldaños subiste para llegar al número final. La base es la regla de crecimiento y el argumento es el lugar de llegada; ninguno es por sí mismo la cantidad de peldaños.','Si la llegada está escrita como «x menos uno», todavía debes averiguar x después de encontrar esa llegada. Es como conocer el saldo de una caja después de retirar una ficha: no es todavía la cantidad que había antes.'],
 problem:'Otro problema: un archivo se divide en tres partes iguales por ronda. Después de n rondas hay 243 partes. ¿Cuántas rondas hubo y qué pasaría si fueran 729 partes?',
 example:['Desde una parte inicial: 3, 9, 27, 81, 243. Hay cinco multiplicaciones por tres: 3⁵=243, por lo que log₃(243)=5.','Como 729=243·3=3⁶, se necesita una ronda adicional, no tres veces más rondas. Su logaritmo es seis.','Podemos comprobar la regla del producto: log₃(243·3)=log₃(243)+log₃(3)=5+1=6. El resultado cuenta rondas, no partes.'],
 bridge:'Convierte el logaritmo de tu pregunta en una potencia con los tres papeles bien ubicados. Si hay una variable dentro del argumento, termina también ese despeje y comprueba que el argumento sea positivo.',
 checks:{'007':'La respuesta ocho se comprueba elevando la base: 2³=8. Se pide x, no el exponente tres que ya estaba dado.','028':'10·10·10=1.000, por eso el exponente es tres. 10² solo alcanza cien: falta una multiplicación por diez.','056':'Con x=9, x−1=8>0 y log₂(8)=3. Con x=8 el argumento sería siete y la ecuación no se cumpliría.','057':'100·1.000=100.000=10⁵. El resultado del logaritmo es cinco; 100.000 es el número dentro del logaritmo, no su exponente.'}},
'Raíces y restricciones':{
 aim:'Separa encontrar candidatos de elegir los que cumplen todas las condiciones. En suficiencia, además, pregunta si los datos distinguen un único valor o deciden la propiedad solicitada.',
 foundation:['Elevar al cuadrado multiplica un número por sí mismo. Tanto un número positivo como su opuesto tienen el mismo cuadrado: 3²=9 y (−3)²=9. Por eso resolver x²=a con a>0 produce dos candidatos, ±√a. El símbolo √a por sí solo representa la raíz no negativa.','Una restricción es información adicional que descarta candidatos: positivo significa mayor que cero; negativo, menor que cero. Ser par no implica ser positivo: −4 también es par. Para probar que unos datos no bastan, muestra dos valores que los cumplen pero dan respuestas diferentes a lo solicitado.'],
 intuition:['Imagina que alguien te dice que una persona está a cuatro cuadras de tu casa, en una calle recta. Puede estar a la derecha o a la izquierda. Saber la distancia no elige el lado; saber «hacia la derecha» sí lo elige.','El cuadrado borra la diferencia de signo de manera parecida. Después de obtener dos candidatos, lee las demás pistas. No inventes que una letra debe ser positiva si el enunciado no lo exige.'],
 problem:'Otro problema: una pieza se desplaza en una recta numerada. Sabemos que está a cinco unidades del origen y que su coordenada es un entero. ¿Podemos conocer su coordenada exacta?',
 example:['Estar a cinco unidades deja dos candidatos: x=5 y x=−5. Ambos cumplen x²=25.','Los dos son enteros, así que ese segundo dato no elimina ninguno. Distancia e integridad juntas no fijan una coordenada.','Si se añadiera x<0, quedaría solamente −5. Para decidir solo si es positiva bastaría una condición que determine el signo, aunque no nos dé su valor exacto.'],
 bridge:'Repite esta prueba con los candidatos de tu pregunta. No confundas «sé cuánto vale su cuadrado» con «sé su signo» ni con «conozco su valor único».',
 checks:{'008':'7²=49 y 7>0. Aunque (−7)² también es 49, −7 incumple a>0; esta condición es la razón para descartarlo.','048':'Con (1), x=3 y x=−3 son posibles y tienen signos diferentes. (2) dice directamente x>0, así que decide la positividad sin necesidad de hallar cuánto vale x.','050':'4 y −4 son pares y ambos elevados al cuadrado dan dieciséis. Son dos contraejemplos a la unicidad: incluso las afirmaciones juntas necesitan más información.'}},
'Interés compuesto':{
 aim:'Determina si se pide el saldo completo o solo lo ganado, y cuántos períodos de interés pasan. Este es un modelo matemático hipotético con las condiciones indicadas, no una predicción de una cuenta real.',
 foundation:['El capital es la cantidad de partida. La tasa r representa la fracción que se añade en cada período: 10%=0,10. En interés compuesto, la base se actualiza después de cada período, por lo que el interés posterior también incluye lo ganado antes.','El factor 1+r conserva el monto anterior y añade su fracción de interés. Después de n períodos: monto=C(1+r)^n, con C capital inicial. La tasa y el tiempo deben usar el mismo período: una tasa mensual se aplica por meses. El interés total es monto menos C, no el monto completo.'],
 intuition:['Imagina una bola de nieve que crece una décima parte de su tamaño en cada vuelta. La segunda décima parte se toma de una bola más grande. No agregas siempre el mismo trozo de nieve.','Puedes evitar la fórmula haciendo una cuenta por período: monto anterior, interés calculado sobre ese monto y nuevo total. Si cada interés sale idéntico pese a que el saldo aumentó, probablemente aplicaste interés simple.'],
 problem:'Otro problema: dos modelos de ahorro parten de $10.000 y pagan 10% por período. Uno calcula siempre sobre el capital inicial y el otro reinvierte lo ganado. ¿Por qué después de dos períodos difieren?',
 example:['En ambos modelos el primer interés es 10.000·0,10=$1.000, así que llegan a $11.000.','El simple vuelve a ganar $1.000: saldo $12.000. El compuesto calcula 11.000·0,10=$1.100: saldo $12.100.','Los $100 de diferencia son el 10% de los $1.000 ganados antes. Esto explica el interés sobre interés; no son un cargo adicional inventado.'],
 bridge:'Reconstruye los períodos de tu ejercicio con sus propios montos y tasas. Comprueba si la alternativa elegida detuvo el proceso antes o mantuvo por error el capital inicial como base.',
 checks:{'009':'El segundo interés debe ser 10% de $110.000, o sea $11.000. Sumado a $110.000 entrega $121.000; $120.000 omite $1.000 de interés sobre interés.','076':'El segundo mes cobra 204.000·0,02=$4.080. Total: 204.000+4.080=$208.080. El exceso de $80 frente al cálculo simple es 2% de los $4.000 del primer mes.'}},
'Rectas y pendiente':{
 aim:'Distingue la inclinación de una recta de la altura desde donde parte. La pendiente mide un cambio relativo; la ordenada al origen indica qué salida corresponde a entrada cero.',
 foundation:['En y=mx+b, x es la entrada, y la salida, m la pendiente y b la ordenada al origen. La pendiente se calcula como cambio vertical dividido por cambio horizontal: m=(y₂−y₁)/(x₂−x₁), cuando x₂≠x₁. Mantén el mismo orden de los puntos en ambas restas.','Una pendiente positiva significa que y aumenta al aumentar x; una negativa, que disminuye. Si conoces m y un punto, sustituyes sus coordenadas para despejar b. Si el punto tiene x=0, queda y=b. Una recta vertical no tiene una pendiente definida por ese cociente porque el denominador sería cero.'],
 intuition:['Piensa en una escalera: importa cuánto sube por cada paso horizontal, no solo la altura total. Subir seis unidades al avanzar dos equivale a subir tres por cada una.','También puede ser un saldo que disminuye con cada compra. El saldo inicial se parece a b y lo que cambia en cada compra a m. Intercambiarlos cambia tanto el punto de partida como el ritmo, aunque uses los mismos números.'],
 problem:'Otro problema: un estanque contiene 50 litros al empezar y pierde 4 litros por minuto a ritmo constante. ¿Qué ecuación describe el volumen y cómo comprobarla?',
 example:['Llama t a los minutos transcurridos y V al volumen en litros. Al inicio t=0 y V=50: la ordenada es 50.','Cada minuto hay cuatro litros menos: la pendiente es −4 litros por minuto. El modelo es V(t)=50−4t, hasta que se vacía.','A los tres minutos predice 38 litros. Entre t=1 y t=3 el volumen pasa de 46 a 38: (38−46)/(3−1)=−8/2=−4, la misma pendiente.'],
 bridge:'En tu pregunta identifica si debes obtener la pendiente a partir de dos puntos o construir una ecuación con pendiente y punto inicial. Comprueba ambas informaciones, no solo una.',
 checks:{'010':'La pendiente tres predice un aumento de 3·2=6 al pasar de x=0 a x=2: y pasa de cinco a once. Se cumplen los dos puntos.','043':'Con x=0, y=−2·0+3=3, y al aumentar x en uno, y baja dos. La ecuación respeta tanto el punto como la pendiente negativa.'}},
'Dominio de raíces':{
 aim:'El dominio es el conjunto de entradas permitidas, no el resultado de una sola cuenta. Debemos encontrar todos los x que hacen que la raíz cuadrada exista como número real.',
 foundation:['Una raíz cuadrada real de A es un número cuyo cuadrado vale A. Como ningún cuadrado real es negativo, el radicando —lo que está dentro del signo √— debe ser mayor o igual que cero. Cero sí sirve: √0=0.','Escribe la desigualdad del radicando y despéjala conservando equivalencias. Puedes sumar lo mismo a ambos lados y dividir por un número positivo sin cambiar su sentido. Si dividieras por un negativo tendrías que invertirlo. Al final conserva todo el intervalo de entradas que cumple la condición, incluido el extremo cuando corresponde.'],
 intuition:['Piensa en un terreno cuadrado. Su área puede ser cero o positiva, y la raíz cuadrada del área da el largo del lado. Un área de −3 no produce un lado real.','La expresión dentro de la raíz es como la casilla de área: revisa cuándo permite un número válido. No basta comprobar una entrada que funciona; necesitamos describir todas las entradas que funcionan.'],
 problem:'Otro problema: un modelo geométrico da el lado de un cuadrado como L(t)=√(12−3t). ¿Qué valores de t permite la raíz real y qué representa el límite?',
 example:['El radicando debe cumplir 12−3t≥0. Restamos doce: −3t≥−12.','Dividimos por −3 e invertimos el signo: t≤4. Si además t fuera un tiempo no negativo, el contexto reduciría el intervalo a 0≤t≤4.','En t=4 el lado es √0=0. En t=5 aparecería √(−3), que no es real. Separar la condición algebraica de la condición física evita inventar restricciones.'],
 bridge:'En tu expresión forma la desigualdad con el radicando completo, no solo con x. Prueba el extremo y un valor de cada lado para comprobar el intervalo que obtuviste.',
 checks:{'011':'x=5 da √0 y está permitido. x=6 da √1; x=4 da raíz de −1 y no es real. Estas pruebas confirman x≥5 y la inclusión del extremo.','083':'Con x=4, 2x−8=0; con x=5 vale dos y con x=3 vale −2. Por tanto se acepta x≥4, incluyendo cuatro.'}},
'Evaluación de funciones':{
 aim:'Evaluar f(a) significa encontrar la salida de la regla cuando su entrada es a. No debes resolver una ecuación para x ni multiplicar el nombre f por el número.',
 foundation:['Una función es una regla que asigna una salida a una entrada permitida. En f(x), x representa el lugar de la entrada; para f(2), sustituimos todas sus apariciones por dos. Cada aparición debe recibir el mismo valor.','Al sustituir un negativo usa paréntesis: (−2)²=(−2)·(−2)=4. Es distinto de −2²=−(2²)=−4 cuando el signo queda fuera de la potencia. Resuelve primero paréntesis y potencias, después multiplicaciones y al final sumas o restas. El coeficiente de x² multiplica el cuadrado completo.'],
 intuition:['Piensa en una receta que usa siempre la misma cantidad de porciones en varios pasos. Si cocinarás para dos, todos los espacios que decían «porciones» reciben dos; no cambias solo el primero.','La regla es la receta y la entrada es tu decisión. El nombre f solo identifica esa receta. Llevar una cuenta por línea evita que un signo o una operación pendiente desaparezca al mirar el resultado parcial.'],
 problem:'Otro problema: una pieza rectangular tiene lados n+1 y n−1, con n>1. Su área es A(n)=n²−1. ¿Qué nos dice A(4) y por qué no es lo mismo que multiplicar cuatro por el nombre A?',
 example:['A(4) pide usar n=4 en la regla: A(4)=4²−1=16−1=15. El resultado es superficie, no el largo de un lado.','Podemos comprobarlo con el rectángulo: sus lados son cinco y tres, y 5·3=15. Dos cálculos representan la misma área.','La notación A(4) describe la salida de una regla para una entrada concreta; no es A por cuatro. Tampoco sirve detenerse en 16, porque la regla todavía exige restar uno.'],
 bridge:'Sustituye en tu regla completa, conserva los signos entre paréntesis y revisa si aún queda un término por sumar o restar antes de escoger la alternativa.',
 checks:{'012':'3·2²−2·2=3·4−4=12−4=8. Comprueba por separado los dos términos; doce es solo el primero y no la salida completa.','022':'(−2)·(−2)=4, y 4+3=7. La misma regla da f(2)=7: coincide porque en ambos casos la entrada se eleva al cuadrado.'}},
'Composición de funciones':{
 aim:'Componer funciones significa encadenar dos reglas: la salida de la primera se transforma en la entrada de la segunda. Lee de adentro hacia afuera.',
 foundation:['g(f(x)), también escrito (g∘f)(x), pide aplicar primero f y después g. No significa multiplicar f por g ni sumar sus resultados. Para no perder el orden, llama u a la salida intermedia: u=f(x), luego calcula g(u).','En general g(f(x)) y f(g(x)) son diferentes, como hornear y luego enfriar no equivale a enfriar y luego hornear. La salida de la función interior debe estar permitida como entrada de la exterior. Al escribir una regla compuesta reemplazas toda la entrada de la exterior por la expresión interior, usando paréntesis.'],
 intuition:['Imagina una línea de dos máquinas. La primera corta una pieza y la segunda la pinta. La segunda recibe lo que entrega la primera, no la pieza inicial de nuevo.','Etiqueta las cajas como «primero» y «después» antes de calcular. Si empiezas por la máquina que está más afuera en g(f(x)), cambias el proceso, aunque los dos nombres y los números sean los mismos.'],
 problem:'Otro problema: un precio p recibe un descuento del 20% mediante D(p)=0,8p y un envío fijo de $1.000 mediante E(p)=p+1.000. ¿Da lo mismo D(E(p)) que E(D(p))?',
 example:['E(D(p)) aplica descuento y luego envío: 0,8p+1.000.','D(E(p)) añade envío y después descuenta todo: 0,8(p+1.000)=0,8p+800. En esta segunda regla se descuenta también parte del envío.','Para p=$10.000 salen $9.000 y $8.800, respectivamente. La diferencia de $200 explica por qué el orden es parte del problema y no solo una convención de escritura.'],
 bridge:'En tu composición calcula primero la función escrita dentro del paréntesis y entrega su salida a la otra. No reutilices la entrada original al realizar la segunda etapa.',
 checks:{'013':'f(3)=5 y g(5)=25. Invertir el orden produciría f(g(3))=f(9)=11; esa alternativa resuelve otra pregunta.','084':'f(5)=3 y g(3)=9. La alternativa 23 proviene de f(g(5))=25−2, que invierte el proceso indicado.'}},
'Probabilidad equiprobable':{
 aim:'Define con precisión qué resultados se eligen al azar y cuáles cumplen la condición. Solo podremos contar favorables sobre posibles si esos resultados básicos tienen igual probabilidad.',
 foundation:['El espacio muestral es el conjunto de resultados posibles. Un evento reúne los que cumplen lo solicitado. Cuando todos los resultados básicos son equiprobables, P(evento)=cantidad de favorables/cantidad total. El total incluye tanto favorables como desfavorables.','Que una categoría tenga un nombre no la vuelve tan probable como otra: una urna con más bolas amarillas que verdes no elige ambos colores con probabilidad mitad y mitad. «Múltiplo de tres» es un número que resulta de multiplicar tres por un entero; se cuentan solo los que pertenecen al conjunto dado.'],
 intuition:['Piensa en una rifa con un número por papel y papeles idénticos. Cada papel tiene la misma oportunidad, pero alguien con cuatro papeles tiene cuatro maneras de ganar. No comparas sus cuatro papeles solo con los de la otra persona: comparas con todos los que hay en la caja.','Primero puedes listar o dibujar los resultados y rodear los favorables. Recién después escribes la fracción. Así evitas elegir el denominador a partir del nombre del evento en lugar del experimento completo.'],
 problem:'Otro problema: una ruleta está dividida en ocho sectores iguales. Tres dicen «premio», dos «repetir» y tres «sin premio». ¿Cuál es la probabilidad de no obtener un premio en ese giro?',
 example:['Los ocho sectores tienen igual tamaño, por lo que sus resultados básicos son equiprobables. «No premio» incluye los dos sectores de repetir y los tres de sin premio.','Hay cinco favorables para lo preguntado y ocho posibles: P(no premio)=5/8.','También se comprueba con el complemento: P(premio)=3/8 y 1−3/8=5/8. No hay tres resultados equiprobables solo porque aparezcan tres frases distintas.'],
 bridge:'En tu ejercicio identifica los objetos o números básicos y cuenta todos, incluidos los que no quieres obtener. Después lista los favorables exactos, respetando los extremos del conjunto.',
 checks:{'015':'Entre uno y diez los únicos múltiplos de tres son tres, seis y nueve. El cero no pertenece al conjunto. Son tres de diez: 3/10.','036':'Los pares son dos, cuatro y seis, y los impares uno, tres y cinco. Tres de cada seis son pares: 3/6=1/2.','039':'El total es cuatro más seis, diez. P(verde)=4/10=2/5 y P(amarilla)=6/10=3/5: juntas suman uno.'}},
'Rectas perpendiculares':{
 aim:'Una recta perpendicular forma un ángulo recto, de 90°, con la otra. Debemos hallar su inclinación, no su posición: muchas rectas distintas pueden compartir la pendiente pedida.',
 foundation:['La pendiente m expresa cuánto cambia y por cada unidad que cambia x. Para dos rectas no verticales y con pendientes no nulas que son perpendiculares, m₁·m₂=−1. Por tanto m₂=−1/m₁: se invierte la fracción y se cambia el signo.','La inversión refleja que una dirección girada 90° intercambia el papel horizontal y vertical y cambia uno de sus sentidos. Cambiar solo el signo no intercambia esas magnitudes; conservar la misma pendiente produce paralelismo o coincidencia. Una recta horizontal es perpendicular a una vertical, cuya pendiente no está definida: ese caso se trata aparte.'],
 intuition:['Dibuja una flecha que avanza dos casillas y sube una. Si la giras un cuarto de vuelta, puede avanzar una y bajar dos: pendiente −2 en lugar de 1/2. La inclinación se volvió «la fracción al revés con signo opuesto».','No basta imaginar una recta que ahora baja: puede bajar con muchos ángulos diferentes. La multiplicación de pendientes igual a −1 es la comprobación que distingue el ángulo recto.'],
 problem:'Otro problema: un sendero recto tiene dirección dada por el vector (2,1). ¿Por qué una dirección (1,−2) sirve para un sendero perpendicular?',
 example:['La primera dirección tiene pendiente 1/2: sube una unidad por dos horizontales. La segunda tiene pendiente −2/1=−2.','Multiplica (1/2)·(−2)=−1. También el producto escalar de las direcciones es 2·1+1·(−2)=0, otra forma de verificar el ángulo recto.','La dirección (2,−1) solo daría pendiente −1/2; el producto sería −1/4 y no se obtendrían 90°, aunque la recta también descienda.'],
 bridge:'En tu pregunta calcula el recíproco con signo opuesto y comprueba el producto. No necesitas una ordenada al origen si solo preguntan la pendiente.',
 checks:{'016':'2·(−1/2)=−1. En cambio 2·(−2)=−4: cambiar solo el signo no basta.','085':'4·(−1/4)=−1. La pendiente +1/4 da producto +1 y la pendiente −4 da −16; ambas fallan la condición.'}},
'Ecuaciones exponenciales':{
 aim:'La incógnita está en un exponente. Necesitamos encontrar qué exponente produce el valor dado y después resolver la expresión que contiene x.',
 foundation:['Una potencia b^n repite el factor b. Si b es positiva y distinta de uno, dos potencias de esa misma base solo son iguales cuando sus exponentes lo son. Por eso conviene escribir ambos lados con una base común.','Igualar exponentes no significa que x sea automáticamente el exponente encontrado: puede aparecer x+1 o x−2. Resuelve esa ecuación manteniendo la igualdad; sumar o restar la misma cantidad a ambos lados deshace el cambio sin alterar las soluciones. Si no reconoces una potencia común se pueden usar logaritmos, pero no son necesarios aquí.'],
 intuition:['Imagina una máquina que multiplica por tres en cada ronda. Saber que termina en 81 permite contar cuatro rondas: 3, 9, 27, 81. Pero si te dicen que el número de rondas es «tu número más uno», tu número no es cuatro: debes quitar ese uno.','Separa esas dos tareas: primero encontrar cuántas multiplicaciones hubo y después averiguar qué valor de la letra produce esa cantidad. Mezclarlas genera muchas respuestas que están a una unidad de la correcta.'],
 problem:'Otro problema: un cultivo idealizado empieza con cinco unidades y triplica su cantidad por ronda. ¿Cuántas rondas necesita para llegar a 135?',
 example:['El modelo es 5·3^n=135. Primero divide ambos lados por cinco: 3^n=27.','Como 27=3·3·3=3³, la igualdad exige n=3. No hay 27 rondas: 27 es el factor total de crecimiento.','Comprueba en el modelo completo: 5·3³=5·27=135. La cuenta por rondas también da cinco, quince, cuarenta y cinco y ciento treinta y cinco.'],
 bridge:'Escribe el valor dado como una potencia de la base de tu problema. Después resuelve el exponente completo, incluyendo las sumas o restas junto a x, y sustituye para comprobar.',
 checks:{'018':'Con x=3 el exponente es cuatro y 2⁴=16. Con x=4 sería 2⁵=32: cuatro era el exponente completo, no x.','086':'x=3 da 3^(3+1)=3⁴=81. Restar uno a cuatro es necesario porque el exponente original es x+1.'}}
});
window.CACHASTE_M2_TEACH({
'Productos notables':{
 aim:'Reconoce si multiplicas una suma por su diferencia. No es el cuadrado de un binomio: los factores tienen signos distintos y eso cambia los términos que sobreviven.',
 foundation:['Multiplicar expresiones requiere distribuir: cada término de un factor multiplica a cada término del otro. En (a+b)(a−b) aparecen a²−ab+ab−b². Los dos términos intermedios son opuestos y suman cero; queda a²−b². Esa es la diferencia de cuadrados.','El segundo cuadrado también debe calcularse: b² no es b. Además, (a−b)² significa (a−b)(a−b), cuyos términos intermedios tienen el mismo signo y no se cancelan. Reconocer un patrón sirve porque podemos justificarlo con la distribución, no porque una expresión se parezca visualmente a otra.'],
 intuition:['Imagina un rectángulo que se alarga un poquito en una dirección y se acorta lo mismo en la otra. La ganancia y pérdida de las franjas largas se compensan, pero queda la pérdida de un cuadradito.','En las letras ocurre algo similar: un término mixto se suma y el otro se resta. Escríbelos ambos antes de tacharlos; así sabes que se cancelan por ser opuestos, no porque esté permitido borrar cualquier término parecido.'],
 problem:'Otro problema: calcula mentalmente 99·101 sin hacer una multiplicación larga. ¿Por qué el resultado no es 10.000?',
 example:['Los números están a uno de cien: 99=100−1 y 101=100+1. El producto es (100−1)(100+1).','Al distribuir: 10.000+100−100−1. Los cien positivos y negativos se compensan y queda 9.999.','La diferencia con 100·100 es un cuadrado de lado uno: 1². El mismo razonamiento permitiría calcular 98·102 como 100²−2²=9.996.'],
 bridge:'En tu expresión identifica qué término juega el papel de a y cuál el de b. Puedes verificar el desarrollo con un valor sencillo de x, además de revisar la cancelación algebraica.',
 checks:{'019':'Con x=4, los factores originales dan 7·1=7 y x²−9 da 16−9=7. Además, −3x+3x se anulan para cualquier x, lo que demuestra la identidad y no solo ese ejemplo.','087':'Distribuye los cuatro productos: x²−5x+5x−25. Para x=6, ambos lados valen once: 11·1=36−25. No queda un término lineal.'}},
'Ecuaciones lineales':{
 aim:'Determinar la entrada es distinto de evaluar una función: aquí conocemos la salida y buscamos qué número la produjo. En suficiencia también debemos decidir si cada afirmación permite hallar ese número por separado.',
 foundation:['Una ecuación es una igualdad que contiene una incógnita. Resolverla significa encontrar los valores que vuelven verdadera esa igualdad. En ax+b=c, a multiplica a x y b se suma después. Para aislar x se deshacen las operaciones en orden inverso: restar b y dividir por a si a≠0.','La igualdad se conserva porque hacemos la misma operación en ambos lados. No se trata de que un número «salte» y cambie de signo mágicamente. Cuando obtenemos un candidato, sustituimos en la igualdad inicial: si ambos lados coinciden, pasa la comprobación.'],
 intuition:['Piensa en una balanza equilibrada con varias cajas iguales y unas pesas sueltas. Primero retiras las mismas pesas de los dos platos. Después repartes lo que queda entre la cantidad de cajas.','Si quitas peso de un solo lado ya no conservas la situación original. Despejar funciona porque cada paso mantiene el equilibrio y hace visible el contenido de una caja.'],
 problem:'Otro problema: una cuenta entre tres personas incluye $600 de envío. El total es $5.100 y cada persona paga la misma comida. ¿Cuánto costó la comida de cada una?',
 example:['Llama x al costo de una comida. Las tres comidas más el envío satisfacen 3x+600=5.100.','Resta $600 en ambos lados: 3x=4.500. Divide entre tres: x=1.500.','Comprueba en la cuenta original: 3·1.500+600=4.500+600=5.100. Dividir primero el total entre tres mezclaría el envío con el precio de cada comida.'],
 bridge:'Identifica qué operaciones recibió la incógnita y deshazlas conservando ambos lados de la igualdad. En suficiencia, haz esa prueba sin tomar prestada información de la otra afirmación.',
 checks:{'021':'Con x=6, f(6)=2·6+3=15. El doce de la etapa intermedia era 2x, no el valor de x.','046':'(1) da 5+2=7 y (2) da 2·5=10. Cada una obtiene y verifica x=5 sin usar la otra; por eso no basta responder que juntas funcionan.'}},
'Inversa de funciones':{
 aim:'La función inversa recupera la entrada a partir de una salida. Debemos deshacer la regla completa, no tomar el recíproco de su resultado.',
 foundation:['Si f transforma x en y, su inversa f⁻¹ transforma ese y nuevamente en x. La notación −1 aquí nombra una función inversa; no significa 1/f(x). Para una regla lineal con pendiente no nula, escribe y=f(x), despeja la entrada y después renombra la variable de entrada de la nueva regla.','El orden importa: si primero multiplicaste y después restaste, deshaces primero la resta sumando y después la multiplicación dividiendo. Una comprobación completa es f⁻¹(f(x))=x; significa que el viaje de ida y vuelta devuelve la entrada. En funciones no inyectivas se debe restringir el dominio para hablar de una inversa, pero estas reglas lineales no tienen esa ambigüedad.'],
 intuition:['Para ponerse zapatos primero van los calcetines y después los zapatos. Para deshacerlo, quitas primero los zapatos y después los calcetines. No basta realizar operaciones contrarias: también hay que invertir su orden.','Una regla de cobro puede sumar un cargo y multiplicar una cantidad. La regla inversa reconstruye lo que había antes. El recíproco, en cambio, solo dividiría uno por el precio final y no recuperaría la entrada.'],
 problem:'Otro problema: un código transforma un número n mediante C(n)=2n+4. Recibes el código 18. ¿Cómo recuperas el número y cómo escribes un decodificador general?',
 example:['Para deshacer el último paso, resta cuatro al código: 18−4=14. Después deshaz la multiplicación por dos: 14/2=7.','Si llamamos c al código recibido, el decodificador es D(c)=(c−4)/2. La letra puede cambiar; la secuencia de operaciones no.','Comprueba con cualquier entrada n: D(C(n))=(2n+4−4)/2=n. Para la entrada siete, codificar vuelve a dar 18.'],
 bridge:'Aplica la misma idea a los signos y al coeficiente de tu función. Los paréntesis del numerador indican que toda la suma o resta se divide, no solamente una parte.',
 checks:{'025':'La composición de vuelta es (3x−6+6)/3=x. Por ejemplo, f(4)=6 y la inversa entrega (6+6)/3=4.','088':'Si h(4)=5·4−10=10, su inversa debe devolver cuatro: (10+10)/5=4. (x−10)/5 desharía una suma, pero la función original restaba diez.'}},
'Sistemas lineales':{
 aim:'Un sistema exige cumplir todas sus ecuaciones a la vez. Busca si determinan una misma pareja, describen exactamente la misma relación o se contradicen.',
 foundation:['Dos incógnitas representan cantidades distintas. Cada ecuación lineal relaciona ambas y puede admitir muchas parejas. Resolver el sistema es encontrar las parejas que pertenecen a todas esas relaciones; gráficamente son puntos compartidos por sus rectas.','Puedes sumar ecuaciones para eliminar una incógnita o sustituir un dato en otra relación. Multiplicar una ecuación completa por un número no nulo produce una equivalente. Si al comparar queda 0=0, no agrega una condición independiente; si queda algo imposible como 0=2, no hay solución. Tener dos ecuaciones no garantiza una única pareja.'],
 intuition:['Imagina dos pistas sobre una compra. «Entre panes y jugos gasté diez» permite muchas combinaciones. Una segunda pista útil puede distinguirlas; repetir la misma pista con otras palabras no agrega información.','Si una pista dice que el mismo total es ocho y otra que es diez, no existe una compra que cumpla ambas. Si una fija el valor de una de las cantidades, puedes introducirlo en la otra para descubrir la que falta.'],
 problem:'Otro problema: dos entradas de adulto y una infantil cuestan $13.000. Una entrada de adulto y una infantil cuestan $8.000. ¿Cuánto vale cada tipo de entrada?',
 example:['Llama a al precio adulto e i al infantil: 2a+i=13.000 y a+i=8.000.','Resta la segunda ecuación completa de la primera: a=5.000. Sustituye en a+i=8.000: i=3.000.','Comprueba ambas: 2·5.000+3.000=13.000 y 5.000+3.000=8.000. Verificar una sola dejaría sin comprobar una parte del problema.'],
 bridge:'En tu ejercicio observa qué cambia entre las ecuaciones. Para suficiencia, ensaya parejas distintas antes de afirmar que un dato aislado fija la incógnita.',
 checks:{'026':'Con x=7 queda y=3. Ambas igualdades se cumplen: 7+3=10 y 7−3=4. Responder tres confundiría la incógnita solicitada con y.','047':'(1) admite x=5,y=4 o x=6,y=3. (2) solo fija y=4 y deja cualquier x. Juntas obligan a x=5; ninguna lo determina sola.','059':'Si x+y=4, necesariamente 2x+2y=8. No puede valer también diez: la contradicción prueba que no existe ninguna pareja solución.','079':'Con k=2, la segunda ecuación es exactamente dos veces la primera, incluido el seis. Cada punto de x+y=3 satisface ambas; con otro k aparecería otra condición.'}},
'Valor absoluto':{
 aim:'El valor absoluto expresa distancia respecto de un punto. Una distancia no indica por sí sola en qué lado estamos: primero encuentra las dos posiciones y después aplica las restricciones.',
 foundation:['|x| es la distancia de x a cero en la recta numérica. Por eso |5|=5 y |−5|=5. De modo semejante, |x−a| mide la distancia entre x y a. Si |x−a|=d con d>0, podemos estar en a+d o en a−d.','No se borran signos arbitrariamente: el interior del valor absoluto puede ser positivo o negativo. Una condición como x>a selecciona el lado derecho y x<a el izquierdo. Al final sustituimos en la expresión original y comprobamos también la condición adicional.'],
 intuition:['Si te dicen que una parada está a tres cuadras de una plaza en una calle recta, hay una a cada lado que cumple la distancia. «A la izquierda de la plaza» elimina una, pero la distancia tres sigue siendo positiva.','Dibuja la plaza como un punto y cuenta las mismas cuadras hacia ambos lados. Esto evita confundir el signo de la ubicación con el signo de la distancia, que nunca es negativo.'],
 problem:'Otro problema: un termómetro debe estar a dos grados de una temperatura de referencia de −1 °C. ¿Cuáles temperaturas cumplen y cuál está por encima de la referencia?',
 example:['La condición es |T−(−1)|=2, es decir |T+1|=2. Buscamos dos posiciones a distancia dos de −1.','Una es −1+2=1 °C y la otra −1−2=−3 °C. En ambas la diferencia absoluta respecto de −1 es dos.','La condición adicional «por encima de la referencia» selecciona 1 °C. No seleccionamos por el signo de la temperatura en general, sino por su comparación con −1.'],
 bridge:'Identifica el centro de la distancia en tu expresión. Encuentra los dos candidatos y lee la desigualdad adicional antes de elegir uno; el procedimiento es distinto de resolver una cuadrática, aunque a veces también haya dos candidatos.',
 checks:{'027':'|8−3|=|5|=5 y 8>3. El otro candidato, −2, también está a cinco de tres, pero no cumple x>3.','089':'|1−4|=|−3|=3 y 1<4. Siete cumple la distancia pero está al otro lado de cuatro y viola la condición solicitada.'}},
'Discriminante':{
 aim:'El discriminante permite saber cuántas soluciones reales tiene una ecuación cuadrática. Si preguntan por él, entrega ese número; no lo confundas con una raíz de la ecuación.',
 foundation:['Escribe la ecuación como ax²+bx+c=0, con a≠0. a multiplica x², b multiplica x y c es el término sin x; conserva sus signos. El discriminante es Δ=b²−4ac. Aparece dentro de la raíz en la fórmula x=(−b±√Δ)/(2a).','Si Δ>0, la raíz existe y los signos ± dan dos soluciones reales distintas. Si Δ=0, ambas coinciden: una raíz doble. Si Δ<0, no hay raíces reales porque un cuadrado real no puede ser negativo. Esto no significa que no existan números complejos, sino que estamos clasificando soluciones en los reales.'],
 intuition:['Piensa en la parábola y el eje horizontal. Puede cruzarlo dos veces, tocarlo en un solo punto o pasar completamente por encima o por debajo. El discriminante anuncia cuál de esas situaciones ocurre antes de calcular cada cruce.','El signo de b y el de b² no son lo mismo. Si b es negativo, ponlo entre paréntesis al elevarlo al cuadrado: multiplicar dos negativos produce un positivo. Después todavía queda restar 4ac.'],
 problem:'Otro problema: un modelo de altura idealizado es h(t)=−t²+4t−5. ¿Puede su gráfica alcanzar altura cero para algún tiempo real?',
 example:['Igualamos a cero: −t²+4t−5=0, con a=−1, b=4 y c=−5.','Δ=4²−4·(−1)·(−5)=16−20=−4. Al ser negativo, no hay ningún tiempo real que haga h(t)=0.','Podemos comprobarlo sin la fórmula: h(t)=−(t−2)²−1. Su máximo es −1, de modo que nunca alcanza cero. El modelo puede ser poco útil como altura sobre el suelo, pero la conclusión matemática es consistente.'],
 bridge:'En tu ecuación identifica los tres coeficientes con su signo y calcula primero el cuadrado y el producto por separado. Solo después resta y, si corresponde, interpreta el signo.',
 checks:{'029':'Δ=(−4)²−4·1·4=16−16=0. La ecuación es (x−2)²=0, que efectivamente tiene una raíz doble x=2.','090':'Δ=16−20=−4. Reescribir x²−4x+5 como (x−2)²+1 muestra que nunca vale cero en los reales, coherente con el discriminante negativo.'}},
'Inecuaciones':{
 aim:'Una inecuación no suele buscar un número único, sino un conjunto de valores que hace verdadera una comparación. También importa si el límite se incluye o se excluye.',
 foundation:['Los símbolos > y < comparan estrictamente; ≥ y ≤ permiten además la igualdad. Puedes sumar o restar lo mismo a ambos lados sin alterar el orden. Al multiplicar o dividir por un positivo, el sentido se conserva; con un negativo, se invierte.','La inversión tiene una razón: de 2<3, al multiplicar por −1 obtienes −2>−3. Los números cambian de lado en la recta. Al resolver, aplica esa misma regla, no un cambio automático de signo cada vez que aparece una resta. Comprueba el valor frontera y al menos un valor interior del intervalo.'],
 intuition:['Imagina un requisito «más de cuatro puntos». Cuatro exactos no alcanzan; cinco sí. Si el requisito dijera «al menos cuatro», el cuatro estaría incluido. No es un detalle decorativo del símbolo.','Una escala que crece hacia la derecha invierte su orden al reflejarla. Esa imagen ayuda a recordar por qué dividir por un número negativo cambia mayor por menor, mientras dividir por uno positivo no lo hace.'],
 problem:'Otro problema: un recipiente tiene 20 litros y pierde dos por minuto. Queremos que queden al menos seis. ¿Hasta qué minuto cumple el modelo esa condición?',
 example:['Llama t al tiempo no negativo. El volumen es 20−2t y la condición es 20−2t≥6.','Resta veinte: −2t≥−14. Divide por −2 e invierte el sentido: t≤7. Con el contexto, 0≤t≤7.','En t=7 quedan seis litros y se acepta por «al menos». En t=8 quedan cuatro y ya no se acepta. Un tiempo de seis deja ocho y comprueba el interior del intervalo.'],
 bridge:'Sigue las operaciones de tu pregunta y detente a mirar el signo del divisor. Al final decide si el extremo está permitido por el símbolo original, no por la apariencia de una alternativa.',
 checks:{'030':'En x=4, 3x−5=7: no supera siete, así que cuatro queda fuera. En x=5 vale diez y sí sirve; en x=3 vale cuatro y falla. Esto confirma x>4.','091':'Con x=−4 se obtiene once y se permite la igualdad. Con x=−5 se obtiene trece y sí sirve; con x=−3 se obtiene nueve y falla. Se confirma x≤−4.'}},
'Área de triángulos':{
 aim:'El área mide la superficie interior, no cuánto mide el contorno. Identifica una base y su altura correspondiente, que siempre es perpendicular a esa base.',
 foundation:['La base puede ser cualquiera de los lados elegidos como referencia. La altura es la distancia perpendicular desde el vértice opuesto hasta la recta de esa base; no siempre coincide con un lado inclinado.','Dos triángulos iguales pueden formar un paralelogramo de la misma base y altura. Su área total es base·altura, por lo que un triángulo ocupa la mitad: A=b·h/2. Si base y altura se miden en centímetros, el producto tiene unidades cm². Sumar longitudes no crea una superficie.'],
 intuition:['Imagina cortar un rectángulo por una diagonal. Las dos piezas son triángulos del mismo tamaño, y cada una ocupa la mitad de lo que cubría el rectángulo.','El corte no cambia cuánta superficie había: solo la reparte en dos. Por eso multiplicar base por altura todavía cuenta dos triángulos; falta tomar la mitad, aunque el triángulo del dibujo no esté apoyado horizontalmente.'],
 problem:'Otro problema: una bandera rectangular de 10 cm por 6 cm se corta por una diagonal. Se pintará de azul solo una de las piezas triangulares. ¿Cuánto se pinta y qué proporción de la bandera es?',
 example:['La bandera completa tiene 10·6=60 cm². El corte diagonal la divide en dos triángulos congruentes, es decir, de igual forma y tamaño.','Cada pieza ocupa 60/2=30 cm². Las longitudes diez y seis funcionan como base y altura perpendicular del triángulo.','La parte pintada representa 30/60=1/2 del total. El perímetro de la pieza usaría además la diagonal y no sirve para calcular la pintura.'],
 bridge:'En tu problema construye primero el área del paralelogramo de igual base y altura y toma la mitad. Si no está explícito que la altura sea perpendicular, revisa el dibujo o la descripción antes de usar un lado cualquiera.',
 checks:{'031':'Dos triángulos de base ocho y altura cinco formarían un paralelogramo de área cuarenta. Cada uno mide veinte unidades cuadradas, no cuarenta.','092':'14·5=70 cm² es el área del paralelogramo correspondiente. La mitad es 35 cm²; al duplicarla recuperas setenta y verificas el resultado.'}},
'Teorema de Pitágoras':{
 aim:'Identifica el ángulo recto antes de usar la relación. La hipotenusa es el lado opuesto a ese ángulo y es el más largo; los otros dos son catetos.',
 foundation:['En un triángulo rectángulo, si a y b son catetos y c la hipotenusa, se cumple a²+b²=c². No se suman las longitudes directamente: se suman las áreas de cuadrados construidos sobre los catetos.','Si buscas la hipotenusa, sumas los cuadrados y extraes raíz positiva. Si buscas un cateto y conoces la hipotenusa, resta al cuadrado de la hipotenusa el del otro cateto. No sirve aplicar esta igualdad a un triángulo cualquiera sin saber que tiene 90°. Las longitudes físicas se toman positivas.'],
 intuition:['Puedes imaginar tres cuadrados pegados a los lados del triángulo. Los dos cuadrados pequeños reúnen exactamente tanta superficie como el grande. Eso explica por qué aparecen cuadrados antes de la raíz.','Si ya conoces el cuadrado grande y quieres uno de los pequeños, debes quitar el otro pequeño, no agregárselo. Marcar con una letra el lado que falta ayuda a escoger entre suma y resta.'],
 problem:'Otro problema: una rampa recta mide 13 m y debe subir una altura de 5 m. ¿Cabe si solo hay 11 m de suelo horizontal disponibles?',
 example:['La rampa es la hipotenusa porque queda enfrente del ángulo entre suelo y altura. Si d es la distancia horizontal, d²+5²=13².','d²=169−25=144 y d=12 m. No restamos 13−5, pues la relación conecta cuadrados.','Como se requieren doce metros de suelo y hay once, no cabe con esa altura y longitud. Comprobación: 12²+5²=144+25=169=13².'],
 bridge:'Decide cuál lado falta en tu triángulo, escribe la ecuación con ese lado en su lugar y recién después despeja. Una respuesta que no sea mayor que los catetos no puede ser una hipotenusa.',
 checks:{'032':'13²=169 y 5²+12²=25+144=169. Trece supera a ambos catetos; doce no podría ser la hipotenusa porque ya es uno de ellos.','093':'15²+8²=225+64=289=17². Además quince es menor que la hipotenusa diecisiete y positivo, como corresponde al cateto que faltaba.'}},
'Ángulos de polígonos':{
 aim:'Separa el total de ángulos interiores, la medida de uno y la del ángulo exterior. «Regular» es la condición que permite repartir el total por igual.',
 foundation:['Un polígono de n lados puede dividirse, desde un vértice, en n−2 triángulos sin superponer sus interiores. Como cada triángulo suma 180°, la suma interior es (n−2)·180°.','En un polígono regular todos sus ángulos interiores son iguales: divide esa suma por n. Un ángulo exterior adyacente completa 180° con el interior; en un polígono regular convexo cada exterior mide 360°/n. El total interior y el ángulo de una esquina no tienen por qué ser el mismo número.'],
 intuition:['Imagina caminar siguiendo el borde de un polígono y girar un poco en cada esquina. Al completar la vuelta giraste 360°. Si las esquinas son iguales, repartes ese giro en n partes iguales.','Ese giro es el ángulo exterior. El interior queda al otro lado de la esquina y entre ambos forman una línea recta de 180°. Mirar la esquina desde dentro o describir cuánto giraste al caminar responde preguntas distintas.'],
 problem:'Otro problema: al caminar por el borde de un polígono regular convexo giras 40° en cada esquina. ¿Cuántos lados tiene y cuánto mide su ángulo interior?',
 example:['Los giros exteriores suman una vuelta de 360°. Si cada uno mide 40°, hay 360/40=9 esquinas y nueve lados.','Cada ángulo interior es 180°−40°=140°. No es cuarenta, porque el giro exterior y la abertura interior son suplementarios.','Verifica con la suma interior: (9−2)·180°=1.260° y 1.260°/9=140°. Las dos estrategias coinciden.'],
 bridge:'En tu pregunta identifica primero cuántos lados hay y si se pide interior o exterior. Si calculaste una suma, todavía debes repartirla para contestar por un solo ángulo.',
 checks:{'034':'Con seis lados, cada exterior es 360°/6=60°; el interior es 180°−60°=120°. Seis interiores suman 720°, como exige (6−2)·180°.','094':'Con ocho lados, el exterior es 45° y el interior 135°. Ocho veces 135° da 1.080°, que coincide con seis triángulos de 180°.'}},
'Vectores':{
 aim:'Un vector describe desplazamiento con dirección y magnitud. Su par de componentes dice cuánto cambia la posición horizontal y cuánto la vertical; al sumar, combina cada eje con el mismo eje.',
 foundation:['En (a,b), a es la componente horizontal y b la vertical. Un signo negativo indica el sentido opuesto al positivo de ese eje. La suma (a,b)+(c,d)=(a+c,b+d) representa realizar un desplazamiento y después el otro.','No multipliques componentes ni mezcles una horizontal con una vertical. El resultado puede ser cero aunque se haya recorrido un camino: la suma de desplazamientos mide el cambio entre inicio y final, mientras la distancia recorrida acumula todos los tramos. Si quieres una longitud debes calcular el módulo después, no interpretar el par como un solo número.'],
 intuition:['Piensa en instrucciones para moverte por una ciudad: dos cuadras al este y una al sur, después tres al oeste y cuatro al norte. Cuenta por separado cuánto quedaste al este/oeste y cuánto al norte/sur.','Las instrucciones contrarias se compensan dentro de cada eje. Hacer primero una ruta y después la otra llega al mismo punto que combinar sus componentes, aunque cambie el recorrido concreto.'],
 problem:'Otro problema: una persona camina con desplazamientos (3,0), luego (0,4) y finalmente (−3,−4). ¿Cuál es su desplazamiento total y por qué no es igual a la distancia recorrida?',
 example:['Suma horizontales: 3+0−3=0. Suma verticales: 0+4−4=0. El vector total es (0,0): volvió al comienzo.','Los tramos tienen longitudes tres, cuatro y cinco, pues √(3²+4²)=5. Recorrió 3+4+5=12 unidades.','No hay contradicción entre desplazamiento cero y camino doce: son medidas distintas. El vector conserva la diferencia de posición, no toda la historia del trayecto.'],
 bridge:'En la suma de tu ejercicio conserva los signos y las parejas de coordenadas. Escribe una cuenta horizontal y otra vertical antes de reconstruir el par ordenado.',
 checks:{'035':'Horizontal: 2+3=5; vertical: −1+4=3. Puedes deshacer la suma: (5,3)−(3,4)=(2,−1), el primer vector original.','095':'(4,2)−(6,−3)=(−2,5), así recuperas el primer sumando y verificas los signos de ambas componentes.'}},
'Media aritmética':{
 aim:'La media o promedio resume cuánto correspondería a cada observación si repartiéramos el total por igual. No consiste en escoger un dato que parezca central.',
 foundation:['Para n observaciones x₁,…,x_n, la media es la suma de todas dividida por n. Cada observación cuenta, incluidas las repetidas y las que valen cero. No divides por el mayor dato ni por la cantidad de valores diferentes.','La media puede no aparecer en la lista y puede ser decimal aunque todos los datos sean enteros. Una comprobación útil es multiplicar la media por n: debe recuperar la suma original. Si todos los datos están entre dos valores, la media también debe quedar dentro de ese intervalo; un valor extremo puede desplazarla.'],
 intuition:['Imagina varias personas que juntan sus monedas en una mesa y después las reparten de manera que todos tengan lo mismo. La cantidad igual para cada persona es la media.','Las monedas totales no desaparecen: se redistribuyen. Por eso dar como respuesta la suma sin repartir cuenta lo que había para todo el grupo, no lo que tocaría a cada uno.'],
 problem:'Otro problema: tres estudiantes reúnen 12, 6 y 0 fichas. Si quieren que los tres tengan el promedio, ¿cuántas debe tener cada uno y cómo lograrlo?',
 example:['Reúnen 12+6+0=18 fichas. Hay tres estudiantes, incluyendo quien no aportó: media=18/3=6.','Quien tenía doce entrega seis a quien tenía cero; quien ya tenía seis no cambia. Ahora las cantidades son 6,6,6 y el total sigue siendo dieciocho.','Si omitiéramos el cero al contar personas, calcularíamos 18/2=9, pero repartir nueve a cada uno requeriría 27 fichas. Esa contradicción descubre el error.'],
 bridge:'En tus datos suma todas las observaciones y cuenta cuántas hay, no solo sus valores diferentes. Verifica que el total se conserve al imaginar a todos con la media.',
 checks:{'037':'La suma es veinte y son cuatro observaciones. Cuatro grupos de cinco vuelven a sumar veinte, de modo que cinco es el reparto uniforme correcto.','096':'Los valores suman veinte y 5·4=20. La media cinco no tiene que estar en la lista 2,4,6,8 para ser válida.'}},
'Mediana':{
 aim:'La mediana describe el centro de los datos ordenados. La posición central se decide después de ordenar, y no coincide necesariamente con el promedio de todos los valores.',
 foundation:['Ordena de menor a mayor conservando los datos repetidos. Con n impar, la mediana es el dato en la posición (n+1)/2. Con n par, hay dos posiciones centrales, n/2 y n/2+1; la mediana usual es el promedio de sus valores.','No confundas posiciones con valores. La cuarta posición puede contener nueve o cien: primero localizas la posición y después miras el dato. La mediana divide la lista ordenada en mitades y suele cambiar menos que la media cuando se modifica un dato extremo.'],
 intuition:['Imagina personas ordenadas por estatura en una fila. La persona del centro no depende de sumar las estaturas, sino de contar cuántas quedan a cada lado.','Si hay un número par de personas, el centro queda entre dos; usamos el punto medio de sus estaturas. Cambiar cuánto mide la persona más alta no mueve automáticamente a las dos personas centrales.'],
 problem:'Otro problema: los tiempos de espera son 2, 3, 4, 5 y 100 minutos. Si el último tiempo baja a 10, ¿qué pasa con mediana y media?',
 example:['Ambas listas ya están ordenadas y tienen cinco datos. En las dos el tercero es cuatro: la mediana permanece en cuatro minutos.','La primera media es (2+3+4+5+100)/5=114/5=22,8. La segunda es 24/5=4,8 minutos.','El cambio del extremo afecta mucho la suma y por eso la media. La mediana mantiene su posición central: comprender qué resume cada indicador permite escogerlos con sentido.'],
 bridge:'En tu pregunta cuenta si la cantidad de datos es par o impar. Si es par, promedia únicamente los dos centrales, no toda la lista ni sus dos extremos.',
 checks:{'038':'Hay dos datos menores que siete y dos mayores. La posición tercera de cinco es el centro, así que no hace falta promediar toda la lista.','097':'Los centrales son tres y ocho; su punto medio es 5,5, a 2,5 unidades de cada uno. La media de todos es seis, que responde otra pregunta.'}},
'Eventos excluyentes':{
 aim:'Distingue «A y B» de «A o B». Que dos eventos sean excluyentes significa que no hay un resultado del experimento que pertenezca a ambos.',
 foundation:['La intersección A∩B reúne los resultados compartidos; la unión A∪B reúne los que están en A, en B o en ambos. En general P(A∪B)=P(A)+P(B)−P(A∩B), porque al sumar contamos dos veces los compartidos.','Si son mutuamente excluyentes, la intersección está vacía y su probabilidad es cero. La unión entonces se calcula sumando sin restar nada. Eso es distinto de independencia: si A y B tienen probabilidad positiva y no pueden ocurrir juntos, saber que ocurrió A sí cambia la probabilidad de B, que pasa a cero.'],
 intuition:['Imagina elegir un solo asiento numerado. Ese asiento no puede ser simultáneamente el número dos y el número cinco. Pero sí puede ser «par» y «menor que cinco» a la vez: el asiento dos cumple ambas categorías.','Por eso las palabras de los eventos importan. «Distintos» no basta para decir «excluyentes»: debes comprobar si existe algún resultado compartido. Un dibujo con dos grupos que no se tocan ayuda a entender cuándo puedes sumar directamente.'],
 problem:'Otro problema: se elige uniformemente un número del uno al seis. A significa «menor que tres» y B «mayor que cuatro». ¿Cuál es la probabilidad de A o B y de que no ocurra ninguno?',
 example:['A={1,2} y B={5,6}. No comparten números, así que A∩B es vacío.','La unión tiene cuatro resultados: {1,2,5,6}. Su probabilidad es 4/6=2/3, igual a 2/6+2/6.','No ocurre ninguno si sale tres o cuatro: probabilidad 2/6=1/3. La unión y su complemento suman uno; la intersección, en cambio, vale cero.'],
 bridge:'En tu ejercicio reconoce el símbolo solicitado antes de operar. Si piden intersección de excluyentes, la imposibilidad da cero; si piden unión, suma las probabilidades dadas.',
 checks:{'040':'No existe resultado compartido por A y B, de modo que no hay casos favorables para A∩B: su probabilidad es cero. La suma de probabilidades se refiere a otra operación, la unión.','098':'Como no se superponen, 0,3+0,4=0,7 sin descuento. El complemento vale 0,3; restar 0,12 supondría una intersección que contradice la exclusión dada.'}},
'Modelo afín':{
 aim:'Separa lo que se paga o se tiene al empezar de lo que cambia por cada unidad. Multiplicar ambos por la cantidad usaría una regla diferente de la descrita.',
 foundation:['Un modelo afín tiene forma C(x)=b+mx: x cuenta unidades, b es una cantidad fija y m es el cambio por unidad. Al evaluar, primero calcula mx y luego suma b una sola vez. El valor C(0)=b permite reconocer el monto de partida.','Si m está en pesos por hora y x en horas, el producto mx queda en pesos y puede sumarse al cargo fijo en pesos. No sumes una tasa a un tiempo ni multipliques el cargo fijo por x. Las unidades son una forma de comprobar el significado de la operación.'],
 intuition:['Piensa en una mochila que ya tiene dos libros y recibe uno por cada visita a la biblioteca. Los dos libros iniciales no vuelven a aparecer con cada visita; solo se añade lo que corresponde al cambio.','En una tarifa ocurre lo mismo: el cobro fijo entra una vez y el precio por unidad se repite. Dibujar dos cajas, «parte fija» y «parte variable», evita mezclar sus papeles.'],
 problem:'Otro problema: una impresión cobra $800 por preparar el archivo y $50 por copia. ¿Qué cambia al pasar de diez a veinte copias y por qué no se duplica el total?',
 example:['Para diez copias: C(10)=800+50·10=1.300. Para veinte: C(20)=800+50·20=1.800 pesos.','Las diez copias adicionales cuestan $500. El cargo de preparación sigue siendo $800 en ambos pedidos; no se paga otra vez por cada copia.','Duplicar $1.300 daría $2.600 y cobraría dos preparaciones. La expresión correcta crece en cantidad fija por copia, pero el total no es proporcional a x cuando b≠0.'],
 bridge:'En la pregunta original calcula aparte el componente que se repite y luego suma el fijo. Prueba con cero unidades para detectar si tu fórmula conserva correctamente el cargo inicial.',
 checks:{'041':'A cero kilómetros el modelo cobra $1.200. A cuatro, agrega 4·500=$2.000 y totaliza $3.200. Una regla que dé cero al inicio habría perdido el cargo fijo.','099':'El cargo por horas es 3·600=$1.800 y se añade una vez $2.000: total $3.800. El aumento entre dos y tres horas debe ser solo $600, no otro cargo fijo.'}},
'Porcentajes':{
 aim:'Un porcentaje es una proporción del valor de referencia. Primero identifica esa referencia y después distingue el cambio calculado del valor final que preguntan.',
 foundation:['Por ciento significa «por cada cien»: p%=p/100. El p% de una cantidad C es (p/100)·C. En un aumento se suma ese cambio a C; en una disminución se resta. Por eso el factor final es 1+p/100 o 1−p/100, respectivamente.','No interpretes 20% como veinte unidades: sería así solo si la base fuera cien. Tampoco confundas «aumenta en 25%» con «queda en 25%»: la primera conserva el 100% previo y añade 25%; la segunda deja únicamente una cuarta parte.'],
 intuition:['Imagina una barra completa que representa el valor original. Dividirla en cien partes permite decir qué fracción añadimos o quitamos sin importar cuánto medía la barra. Veinticinco de esas partes son una cuarta parte de esa barra, no necesariamente veinticinco pesos.','Puedes empezar con fracciones conocidas: 50% es mitad, 25% cuarta parte y 10% décima parte. Esa estimación te ayuda a comprobar si el cambio calculado tiene un tamaño razonable.'],
 problem:'Otro problema: una cuenta de $24.000 incluye un cargo adicional del 10%. ¿Cuánto se agrega y qué porcentaje de la cuenta original representa el total?',
 example:['La décima parte de $24.000 es $2.400: ese es el cargo, no el total.','Al sumar: 24.000+2.400=$26.400. El total representa 100%+10%=110% del valor original.','Podemos comprobarlo con el factor: 24.000·1,10=26.400. Si después se descontara 10% del nuevo total, no volveríamos al original, porque la referencia habría cambiado.'],
 bridge:'Usa la cantidad inicial de tu ejercicio como base y conserva el sentido del cambio. Antes de escoger una alternativa, decide si ese número corresponde al incremento, al descuento o al resultado completo.',
 checks:{'042':'20% de 150 es treinta. Al quitarlo queda 120, que equivale al 80% de 150: 0,8·150=120. Treinta responde por el descuento, no por el final.','055':'25% es una cuarta parte: 80/4=20. El nuevo valor es 80+20=100; el aumento relativo se comprueba con (100−80)/80=1/4=25%.'}}
});
window.CACHASTE_M2_TEACH({
'Interés simple':{
 aim:'Identifica si se pide solo el interés o el total acumulado. En el modelo simple, todas las ganancias por período se calculan sobre el mismo capital inicial.',
 foundation:['Llamamos C al capital inicial, r a la tasa por período escrita como decimal y t al número de períodos. Cada período genera C·r; después de t períodos, el interés es I=C·r·t. El total o monto final es C+I.','La palabra «simple» indica que las ganancias previas no se reinvierten para producir más interés. La tasa debe corresponder a la unidad de t: si la tasa es anual y t se expresa en años, las unidades coinciden. Estas cuentas describen únicamente el modelo hipotético sin cargos especificado por el problema.'],
 intuition:['Piensa en una máquina que entrega siempre la misma cantidad de fichas por vuelta. Aunque guardes las fichas ganadas en una bolsa, la máquina no aumenta su premio por ver una bolsa más grande.','Contar lo que entregó la máquina no es lo mismo que contar todo lo que llevas en la bolsa, porque esta ya tenía fichas antes de empezar. Interés y capital final se distinguen de esa misma manera.'],
 problem:'Otro problema: dos ahorros hipotéticos ganan cada año un 5% simple. Uno parte con $20.000 y otro con $40.000. ¿Qué relación hay entre sus ganancias de tres años y sus montos finales?',
 example:['El primero gana 20.000·0,05=$1.000 por año; en tres años gana $3.000. Su monto es $23.000.','El segundo gana 40.000·0,05=$2.000 por año; en tres años gana $6.000. Su monto es $46.000.','Duplicar el capital duplica la ganancia bajo la misma tasa y tiempo. En cada caso el interés es una parte del monto, no una segunda manera de nombrar todo el saldo.'],
 bridge:'En tu pregunta calcula primero la ganancia por período y después decide si corresponde añadir el capital. Si el segundo interés usa un saldo actualizado, cambiaste sin autorización al modelo compuesto.',
 checks:{'044':'Cada año genera 1.000·0,05=$50. En dos años son $100 de interés y $1.100 en total; $1.102,50 correspondería a reinvertir el primer interés.','077':'Cada año genera 50.000·0,06=$3.000. Tres años generan $9.000 y el saldo sería $59.000. Como se pidió interés, se responde $9.000.'}},
'Proporcionalidad':{
 aim:'Antes de multiplicar o dividir, identifica qué cantidad permanece constante. Dos variables pueden aumentar juntas o variar en sentidos opuestos; no se elige una regla solo por ver tres números.',
 foundation:['En proporcionalidad directa el cociente entre variables es constante: y=kx. Por ejemplo, con una tasa fija de piezas por hora, duplicar horas duplica piezas. La tasa k tiene unidades y/x.','En proporcionalidad inversa se mantiene un producto: xy=k. Para un mismo trabajo y productividad idéntica, más personas reducen el tiempo porque personas·horas conserva el trabajo total. El modelo requiere los supuestos indicados: interferencias o ritmos diferentes pueden invalidarlo. Revisa qué relación describe el contexto antes de aplicar una regla de tres.'],
 intuition:['No es lo mismo llenar más jarras del mismo tamaño que repartir una jarra fija entre más vasos. En el primer caso aumenta el líquido total; en el segundo, aumentar el número de vasos reduce lo que recibe cada uno.','Pregunta «¿qué estoy manteniendo igual?». La respuesta te dice si debes conservar una cantidad por unidad o un total repartido. Eso explica el procedimiento en vez de obligarte a memorizar una tabla de flechas.'],
 problem:'Otro problema: una jarra tiene 2 litros. ¿Cuántos vasos de 250 mL llena y qué pasa si usamos vasos de 125 mL? ¿Y si llenamos tres jarras iguales?',
 example:['Dos litros son 2.000 mL. Para vasos de 250 mL: 2.000/250=8 vasos.','Con vasos de 125 mL: 2.000/125=16. Reducir a la mitad el tamaño duplica el número: tamaño por cantidad conserva 2.000 mL.','Tres jarras de dos litros reúnen seis litros: cantidad de jarras y volumen total son directamente proporcionales. En un mismo contexto aparecen dos relaciones, según qué se mantenga fijo.'],
 bridge:'En tu ejercicio distingue la producción con tasa fija del tiempo para un trabajo fijo. Escribe la unidad de la tasa o del producto conservado; luego comprueba que el cambio tenga el sentido esperado.',
 checks:{'045':'18 piezas por hora durante cinco horas da 18·5=90 piezas; dividir 90 entre cinco recupera la tasa dieciocho. 23 no tiene esa relación con la tasa.','100':'El trabajo total es 8·5=40 horas-persona. Con dieciséis personas y 2,5 horas, 16·2,5=40: se conserva el trabajo bajo los supuestos dados.'}},
'Área de rectángulos':{
 aim:'Para determinar la superficie de un rectángulo necesitas suficiente información sobre sus dos dimensiones. Conocer un lado no fija automáticamente el otro.',
 foundation:['El área rectangular es A=b·h, donde b es la base y h la altura perpendicular. Puedes entenderla contando filas de cuadrados unidad: cuántos hay por fila multiplicado por cuántas filas hay. Si las longitudes están en cm, la superficie queda en cm².','La forma rectangular no exige lados iguales. Tampoco el perímetro fija el área de un rectángulo cualquiera: distintos pares de lados pueden tener la misma suma y productos distintos. En suficiencia demuestra la ambigüedad con dos rectángulos que respeten el dato pero tengan áreas diferentes.'],
 intuition:['Piensa en cubrir un piso con baldosas iguales. Saber que una fila lleva seis baldosas no dice cuántas filas tendrá la pieza. Podrían ser dos o diez y cambiaría mucho la superficie.','Una medida horizontal y otra vertical permiten contar todas las baldosas. Conocer solo una dirección deja una familia entera de pisos posibles; no completes el dibujo imaginando un cuadrado que nadie indicó.'],
 problem:'Otro problema: un rectángulo tiene perímetro 12 m y su largo es el doble del ancho. ¿Basta cada dato por sí solo para saber el área?',
 example:['El perímetro solo no basta: lados uno y cinco dan 12 m de borde y área cinco; lados dos y cuatro también dan 12 y área ocho.','La proporción sola tampoco basta: uno por dos tiene área dos, y dos por cuatro tiene área ocho. Ambos tienen largo doble del ancho.','Juntas: si el ancho es w y el largo 2w, el perímetro es 2(w+2w)=6w=12. Entonces w=2, largo cuatro y área ocho m².'],
 bridge:'En tus afirmaciones prueba cada dimensión de manera aislada. Si una no permite fijar el producto, muestra qué dimensión falta y luego comprueba qué cambia al combinarlas.',
 checks:{'049':'Con base seis, altura uno da área seis y altura dos da doce: (1) sola no fija el área. Una altura cuatro tampoco fija la base. Juntas dan 6·4=24 cm².','101':'Con base cinco aún sirven alturas distintas; con altura nueve aún sirven bases distintas. Al usar ambas, solo queda el producto 5·9=45 cm².'}},
'Área de cuadrados':{
 aim:'Un cuadrado tiene todos sus lados iguales. Esa condición permite relacionar lado, perímetro, área y diagonal: conocer una de esas magnitudes puede determinar las demás.',
 foundation:['Si el lado positivo es s, el perímetro es P=4s y el área A=s². El perímetro mide borde en unidades de longitud; el área mide superficie en unidades cuadradas. De un área positiva recuperas el lado s=√A; se elige la raíz positiva porque se trata de una longitud.','La diagonal forma un triángulo rectángulo con dos lados s. Por Pitágoras, d²=s²+s²=2s² y d=s√2. Por eso s=d/√2. No necesitas siempre combinar dos datos: si cada uno fija por separado el lado, cada afirmación ya es suficiente.'],
 intuition:['Imagina un patio cuadrado: al saber el largo de una orilla ya sabes el de las otras tres. La cuerda para rodearlo y las baldosas para cubrirlo se calculan con ese mismo lado, pero miden cosas diferentes.','Si duplicas el lado, cada orilla se duplica y la cuerda también. Las baldosas, en cambio, se duplican en ambas direcciones, por lo que la superficie se multiplica por cuatro.'],
 problem:'Otro problema: se amplía un patio cuadrado de modo que su área pasa de 9 a 36 m². ¿La cantidad de cerco también se cuadruplica?',
 example:['El lado inicial es √9=3 m y el nuevo √36=6 m: el lado se duplicó.','Los perímetros son 4·3=12 m y 4·6=24 m. El cerco necesario se duplica, aunque la superficie se haya cuadruplicado.','La relación se explica por las dimensiones: el área usa s² y el borde usa s. Saber el área de cada cuadrado bastó para recuperar sus lados, sin otro dato adicional.'],
 bridge:'En la pregunta original convierte cada afirmación al lado positivo y desde allí a la magnitud solicitada. Solo después decide si basta una, las dos por separado o la combinación.',
 checks:{'051':'(1) da P=4·7=28 cm. (2) da s=√49=7 cm y luego P=28 cm. Cada afirmación llega sola al perímetro, sin usar la otra.','102':'(1) da s=20/4=5 y A=25 cm². (2) da s=(5√2)/√2=5 y la misma área. Ambas rutas son independientes: no necesitas combinarlas.'}},
'Probabilidad de dos dados':{
 aim:'El resultado básico son las dos caras, no su suma. Las sumas no aparecen con la misma frecuencia porque algunas pueden formarse de muchas maneras y otras de muy pocas.',
 foundation:['Distingue los dados, por ejemplo uno rojo y uno azul. Hay seis caras posibles en el primero y seis en el segundo: 6·6=36 pares ordenados. Si ambos son justos e independientes, cada par tiene probabilidad 1/36.','(1,4) y (4,1) son resultados diferentes porque intercambian qué muestra cada dado. Si solo nos interesa la suma, se agrupan los pares que la producen, pero no se vuelven equiprobables las categorías de suma. Para una suma buscada, lista los pares válidos sin permitir caras cero o siete.'],
 intuition:['Imagina una tabla de seis filas y seis columnas. La fila representa el dado rojo y la columna el azul. Cada casilla es una posibilidad del mismo tamaño.','La suma dos ocupa una sola casilla, uno con uno. La suma siete ocupa una diagonal de seis casillas. Mirar los nombres «dos» y «siete» como si fueran dos opciones iguales perdería esa diferencia.'],
 problem:'Otro problema: en un juego ganas si sumas dos o doce; en otro ganas si sumas siete. Con los mismos dos dados justos, ¿qué juego ofrece mayor probabilidad de ganar?',
 example:['Para dos solo sirve (1,1); para doce solo (6,6). El primer juego tiene dos pares favorables de 36: 2/36=1/18.','Siete se obtiene con (1,6),(2,5),(3,4),(4,3),(5,2),(6,1). Son seis de 36: 1/6.','Aunque el primer juego permite dos sumas y el segundo solo una, el segundo tiene tres veces más probabilidad: 6/36 frente a 2/36. Contamos casillas, no nombres de sumas.'],
 bridge:'Construye la lista de pares que cumple la condición de tu pregunta. El número de la suma no es la cantidad de casos favorables y ambos órdenes cuentan cuando son distintos.',
 checks:{'053':'La lista contiene seis pares que suman siete; 6/36=1/6. Siete dividido por 36 confundiría el valor de la suma con la cantidad de pares.','103':'Para suma cinco sirven (1,4),(2,3),(3,2),(4,1): cuatro pares. 4/36=1/9; no existe (0,5) porque las caras comienzan en uno.'}},
'Área de círculos':{
 aim:'Identifica si se informa radio o diámetro y si se busca superficie o contorno. Esas diferencias deciden qué número entra en la fórmula y qué unidades debe tener la respuesta.',
 foundation:['El radio r va del centro al borde. El diámetro d cruza el círculo pasando por el centro y mide dos radios: d=2r. Por tanto, si conoces d, primero calcula r=d/2.','El área interior es A=πr², en unidades cuadradas; la longitud de la circunferencia es 2πr, en unidades de longitud. Usar el diámetro en el lugar del radio duplica la longitud empleada y cuadruplica el área, porque (2r)²=4r². El número π puede conservarse exacto si así están escritas las alternativas.'],
 intuition:['Imagina cubrir con papel una mesa redonda y poner una cinta en el borde. El papel mide superficie; la cinta mide longitud. Saber cuánta cinta usar no contesta cuánto papel necesitas.','El diámetro es el viaje completo de una orilla a la otra pasando por el centro. La fórmula de superficie usa solo la mitad de ese viaje: el radio. Señalar el centro en un dibujo puede evitar duplicarlo por error.'],
 problem:'Otro problema: una piscina circular tiene radio 4 m y un camino alrededor hasta radio exterior 5 m. ¿Cuánta superficie ocupa solamente el camino?',
 example:['El disco exterior completo tiene área π·5²=25π m². La piscina ocupa π·4²=16π m².','El camino es la región entre ambos bordes: 25π−16π=9π m². No es un círculo de radio uno; el ancho del camino no es el radio de toda esa superficie.','Puedes comprobar el sentido: el camino debe medir menos que el disco exterior y, junto con la piscina, reconstruir sus 25π m². La longitud de sus bordes sería otra magnitud.'],
 bridge:'En tu ejercicio usa el radio correcto y eleva esa longitud al cuadrado antes de multiplicar por π. Si te entregan diámetro, anota expresamente la mitad para no saltarte ese paso.',
 checks:{'054':'Con diámetro diez, el radio es cinco y A=π·5²=25π. Comparado con un círculo de radio 2,5, el radio se duplicó y el área se cuadruplicó: 4·6,25π=25π. El resultado 100π usa el diámetro como radio.','104':'Con radio siete, A=49π cm². La circunferencia sería 14π cm: además de cambiar el número, cambian las unidades, lo que permite distinguir el error.'}},
'Funciones trigonométricas':{
 aim:'Estas funciones describen repeticiones. Identifica si se pide un valor en cierto instante o cuánto tarda el ciclo en repetirse: sustituir t y calcular el período son tareas diferentes.',
 foundation:['Seno y coseno relacionan un ángulo con posiciones en una circunferencia unidad. Sus valores van de −1 a 1 y se repiten después de 2π radianes, una vuelta completa; π radianes son media vuelta, 180°. El punto de ese círculo que gira desde la derecha tiene coordenadas (cos(θ),sen(θ)). Al empezar está en (1,0), así que cos(0)=1. Tras media vuelta está en (−1,0), así que cos(π)=−1; estos valores describen posiciones, no signos elegidos arbitrariamente.','En h(t)=A·cos(bt)+d, d es el nivel central y |A| la amplitud, o distancia máxima a ese nivel. El factor b controla qué tan rápido cambia el ángulo. Si b≠0, el período es T=2π/|b| porque |b|·T debe completar una vuelta. Seno comparte ese período. La amplitud y el nivel central no cambian el tiempo de repetición.'],
 intuition:['Piensa en un reloj: una cosa es qué posición tiene la aguja en un instante y otra cuánto demora en volver a esa posición completando el mismo movimiento. Mover todo el reloj más alto no hace que la aguja gire más lento.','En una rueda, la altura del centro se parece a d y el radio a la amplitud. El ciclo de giro fija el período. Separar «altura», «tamaño del vaivén» y «duración» ayuda a no responder con un dato que sí aparece en la fórmula, pero cumple otro papel.'],
 problem:'Otro problema: un modelo de rueda tiene altura mínima de 2 m, máxima de 10 m y tarda 12 s por vuelta. Si una cabina parte arriba, ¿cómo construir un modelo de su altura y predecir la de media vuelta?',
 example:['El nivel central es (10+2)/2=6 y la amplitud (10−2)/2=4. Para completar 2π en doce segundos, b=2π/12=π/6.','Como parte arriba, sirve h(t)=6+4·cos(πt/6). En t=0, cos(0)=1 y h=10.','A los seis segundos el ángulo es π: cos(π)=−1 y h=6−4=2 m. A los doce vuelve al máximo. Cada parámetro explica una característica distinta del movimiento.'],
 bridge:'En tu expresión identifica primero A, b y d. Para un instante, sustituye t dentro del ángulo; para el período, pregunta cuánto debe avanzar t para que ese ángulo complete 2π.',
 checks:{'060':'Si t avanza ocho, el argumento (π/4)t avanza 2π y el seno repite su ciclo. Avanzar cuatro solo añade π. Los números tres y cinco controlan altura, no duración.','061':'En t=3, πt/3=π y cos(π)=−1. El término oscilatorio es −2, pero la altura completa suma cuatro: h(3)=2, el mínimo del modelo.'}},
'Homotecia':{
 aim:'Una homotecia cambia el tamaño de una figura respecto de un centro. Antes de aplicar su razón, identifica si se pide una longitud, un área o las coordenadas de un punto.',
 foundation:['La razón k multiplica el vector que va desde el centro C hasta cada punto P: P′=C+k(P−C). Si el centro es el origen, se multiplican directamente ambas coordenadas por k. Con k negativo el punto imagen queda en el sentido opuesto respecto del centro.','Las longitudes se multiplican por |k| y las áreas por k² porque cambian dos dimensiones. El signo de k no produce área negativa. Sumar k a cada coordenada describe una traslación, no una homotecia. Si el centro no fuera el origen, multiplicar coordenadas directamente desplazaría la figura de forma equivocada.'],
 intuition:['Imagina ampliar una foto manteniendo su forma. Duplicar ancho y alto hace que ocupe cuatro veces más papel, no dos. La escala que se imprime como «por dos» suele referirse a las longitudes.','Para el signo, imagina una flecha desde el centro. Una razón negativa obliga a mirar hacia el lado contrario antes de ajustar su largo. La superficie sigue contando papel positivo, esté donde esté la imagen.'],
 problem:'Otro problema: en una ampliación por homotecia de razón positiva, un dibujo pasa de 6 a 24 cm². ¿Cuál es la razón y cuánto medirá un segmento que antes medía 5 cm?',
 example:['El área se multiplicó por 24/6=4. Como el factor de área es k², necesitamos k²=4.','La razón es positiva, por lo que k=2. Sin ese dato, las razones 2 y −2 tendrían el mismo efecto en las áreas.','El segmento pasa a 2·5=10 cm. Verifica: duplicar dos dimensiones multiplica por cuatro la superficie. No uses cuatro como razón de longitudes.'],
 bridge:'En tu ejercicio decide si corresponde k, |k| o k². Para coordenadas, además, comprueba que el centro sea el origen antes de multiplicar directamente cada componente.',
 checks:{'062':'La razón tres triplica cada longitud y multiplica el área por 3·3=9. El resultado 108/12=9 confirma el factor de superficie.','063':'(−6,2)=(−2)·(3,−1). Ambos componentes se multiplicaron por la misma razón negativa; el punto queda al lado opuesto del centro y al doble de distancia.'}},
'Razones trigonométricas':{
 aim:'Primero identifica el ángulo de referencia y el ángulo recto. Los nombres «opuesto» y «adyacente» dependen del ángulo elegido; la hipotenusa siempre está frente al ángulo recto.',
 foundation:['En un triángulo rectángulo, respecto de un ángulo agudo α, seno=cateto opuesto/hipotenusa, coseno=cateto adyacente/hipotenusa y tangente=cateto opuesto/cateto adyacente. Las razones comparan longitudes; no son longitudes por sí mismas.','Elige la razón que conecte el dato conocido con el que necesitas. Si sen(α)=h/L, multiplicar por L da h=L·sen(α). Si buscas un cociente de catetos no necesitas calcular primero la hipotenusa. Triángulos semejantes conservan estas razones aunque sus tamaños cambien.'],
 intuition:['Piensa en mirar desde un ángulo una escalera apoyada. El lado de enfrente es el que atraviesa tu mirada al otro lado del triángulo; el adyacente acompaña al ángulo, sin ser la escalera inclinada que forma la hipotenusa.','No memorices «altura siempre es seno»: si cambias el ángulo de referencia, esa altura puede pasar a ser adyacente. Dibuja y marca el ángulo antes de decidir qué dividir.'],
 problem:'Otro problema: para un ángulo de elevación se sabe tan(α)=3/4. Un objeto está a 12 m horizontales del observador sobre un terreno ideal plano. ¿Qué altura corresponde a ese ángulo?',
 example:['La altura es el cateto opuesto y los doce metros el adyacente: tan(α)=h/12=3/4.','Multiplica por doce: h=12·3/4=9 m. El triángulo mide tres veces los catetos tres y cuatro que representan esa razón.','La línea de vista mediría √(9²+12²)=15 m. Comprobar 9/12=3/4 confirma la tangente; 9/15=3/5 sería el seno y respondería otra relación.'],
 bridge:'En tu triángulo etiqueta los lados respecto del ángulo que efectivamente se da. Después escoge una sola razón que vincule lo conocido con lo pedido y conserva las unidades al despejar.',
 checks:{'064':'La altura calculada cinco satisface 5/10=1/2=sen(30°). Debe ser menor que la escalera de diez; 5√3 sería la separación horizontal, no la altura.','065':'La tangente es 6/8=3/4. La hipotenusa diez permitiría calcular seno 6/10 y coseno 8/10, pero ninguna de esas razones es la tangente solicitada.'}},
'Relaciones en la circunferencia':{
 aim:'Observa qué objetos geométricos aparecen: segmentos de cuerdas o un ángulo inscrito. Pertenecer a una circunferencia no vuelve intercambiables todas sus relaciones.',
 foundation:['Una cuerda es un segmento que une dos puntos de la circunferencia. Si dos cuerdas se cortan dentro, el producto de las longitudes de los dos segmentos de una es igual al producto de los dos segmentos de la otra. Se emparejan por cuerda, no por posición visual.','Un ángulo inscrito tiene su vértice sobre la circunferencia y sus lados cortan un arco. Mide la mitad del arco interceptado que no contiene el vértice. Un ángulo central que mira ese mismo arco mide lo mismo que el arco. Estas son relaciones diferentes: una conecta longitudes y otra conecta medidas angulares.'],
 intuition:['Para las cuerdas imagina dos varillas que se cruzan dentro del borde circular: cada varilla queda partida en dos pedazos. Multiplica los pedazos de la misma varilla antes de comparar.','Para los ángulos piensa en mirar el mismo arco desde el centro o desde una orilla. La abertura desde la orilla es la mitad. Identificar dónde está el observador —el vértice— evita usar la medida del arco como si fuera la del ángulo.'],
 problem:'Otro problema: en una figura circular hay un triángulo inscrito cuyo lado AB es un diámetro. En otra figura, dos cuerdas se cruzan en segmentos 2 y 6, y 3 y z. ¿Qué se puede deducir en cada una?',
 example:['El arco AB que queda enfrente del tercer vértice es una semicircunferencia de 180°. El ángulo inscrito correspondiente mide 180°/2=90°. Esto identifica un triángulo rectángulo sin medir sus lados.','En la segunda figura se comparan productos de segmentos de cada cuerda: 2·6=3·z. Así 12=3z y z=4.','Comprueba 2·6=3·4. No intentamos obtener z usando la regla angular ni el ángulo usando sumas de segmentos: la información indica qué relación geométrica corresponde.'],
 bridge:'En tu pregunta reconoce primero la configuración. Si son cuerdas que se cortan dentro, iguala productos; si el vértice está sobre la circunferencia y se da el arco, usa la relación de mitad.',
 checks:{'066':'3·8=24 y 4·6=24. La igualdad de productos confirma x=6; x=7 igualaría sumas, que no es el teorema para cuerdas interiores.','080':'El ángulo inscrito cincuenta intercepta un arco del doble, cien grados. Cien sería el ángulo central sobre ese arco, no el inscrito.'}},
'Esferas':{
 aim:'Una esfera tiene superficie y volumen. Antes de usar una fórmula, decide si quieres cubrir su exterior o medir cuánto espacio ocupa: requieren dimensiones distintas.',
 foundation:['El radio r es la distancia del centro a la superficie. El área superficial es A=4πr² y se mide en unidades cuadradas. El volumen es V=(4/3)πr³ y se mide en unidades cúbicas. En ambas fórmulas π es la constante del círculo, pero el exponente y el factor numérico no son los mismos.','El cuadrado corresponde a dos dimensiones y el cubo a tres. Si el radio se multiplica por k>0, la superficie cambia por k² y el volumen por k³. Sustituye el radio antes de hacer potencias y conserva el factor 4/3 completo en el volumen: omitir dividir entre tres triplica el resultado.'],
 intuition:['Piensa en una pelota hueca y en una pelota maciza del mismo tamaño. La pintura necesaria para cubrirlas depende de su exterior, mientras el material de la maciza depende de todo el espacio interior.','Si haces una pelota al doble de tamaño lineal, una capa exterior usa cuatro veces la superficie y llenarla usa ocho veces el volumen. Esa diferencia ayuda a detectar si respondiste con la fórmula de otra magnitud.'],
 problem:'Otro problema: se fabrica una esfera con el doble del radio de otra. ¿Cuántas veces más superficie habrá que pintar y cuántas veces más material se necesitará si ambas son macizas?',
 example:['Llama r al radio pequeño y 2r al grande. Área grande: 4π(2r)²=4π·4r²=4 veces el área pequeña.','Volumen grande: (4/3)π(2r)³=(4/3)π·8r³=8 veces el volumen pequeño.','No necesitamos conocer r para comparar. Las constantes se conservan en ambas y los factores cuatro y ocho provienen de cuántas dimensiones cambian.'],
 bridge:'En tu ejercicio decide qué magnitud piden y verifica que las alternativas tengan sus unidades. Después calcula la potencia del radio y aplica todos los factores de la fórmula correspondiente.',
 checks:{'067':'Para volumen, r³=27 y (4/3)·27=36: V=36π cm³. Si calculas 4πr² también obtienes 36π en este caso, pero en cm²; la coincidencia numérica no vuelve iguales ambas magnitudes.','105':'La superficie es 4π·2²=16π cm². El volumen sería (4/3)π·2³=32π/3 cm³, con otra fórmula y otras unidades.'}},
'Combinatoria':{
 aim:'Cuenta resultados posibles sin duplicarlos. La decisión esencial es si intercambiar a dos personas u objetos crea un resultado diferente y si se permite repetirlos.',
 foundation:['Si una elección se realiza en etapas, multiplica las opciones disponibles en cada etapa. Sin repetición, elegir un objeto lo retira de las opciones siguientes: cinco opciones, luego cuatro y luego tres. Si los puestos tienen nombres distintos, cambiar el orden sí produce otro resultado.','Si solo eliges un grupo sin cargos, varios órdenes representan el mismo grupo. Para parejas, cada una se cuenta dos veces al ordenar sus miembros, por lo que se divide entre dos. Para grupos mayores se usa el número de órdenes internos correspondiente. No elijas una fórmula antes de resolver si el orden importa y si hay repetición.'],
 intuition:['Un equipo formado por dos personas no cambia si dices sus nombres al revés. Una contraseña de dos letras sí cambia al invertirlas. Los mismos objetos pueden producir cuentas distintas según qué sea un resultado.','Puedes listar un caso pequeño y mirar las repeticiones antes de generalizar. Si una persona aparece dos veces en un podio, contaste una posibilidad que el enunciado prohíbe.'],
 problem:'Otro problema: con las letras A, B y C se crean códigos de dos letras distintas. Luego se forman parejas de letras para decorar una tarjeta, sin importar su orden. ¿Cuántos resultados hay en cada caso?',
 example:['Códigos: AB, AC, BA, BC, CA y CB. Hay 3·2=6 porque no se puede repetir la primera letra.','Para decorar, AB y BA son la misma pareja. Lo mismo pasa con AC/CA y BC/CB: quedan tres parejas.','La cuenta del grupo es 6/2=3. Si permitiéramos repetición en códigos, aparecerían además AA, BB y CC y el total sería 3·3=9; sería otro problema.'],
 bridge:'En tu ejercicio identifica si hay cargos o posiciones diferentes y si los participantes pueden repetirse. Después cuenta por etapas y elimina únicamente los órdenes que realmente describen el mismo resultado.',
 checks:{'068':'6·5=30 cuenta las parejas en ambos órdenes. Cada comité de dos personas aparece dos veces, así que 30/2=15. No hay cargos que permitan distinguir esos órdenes.','069':'Oro tiene cinco opciones, plata cuatro y bronce tres: 5·4·3=60. Los seis órdenes internos de un mismo grupo de tres sí son podios distintos y no se eliminan.'}},
'Modelo binomial':{
 aim:'Define exactamente qué cuenta como éxito y qué cantidad de éxitos pide la frase. «Exactamente dos» excluye cualquier otra cantidad; «al menos uno» incluye uno, dos y todos los demás hasta el total.',
 foundation:['El modelo binomial cuenta éxitos en n intentos independientes con la misma probabilidad p. Cada intento se clasifica como éxito o no éxito; «éxito» es solo el nombre del evento que contamos y puede representar una falla si eso interesa. La probabilidad de no éxito es 1−p.','Una secuencia con k éxitos y n−k no éxitos tiene probabilidad p^k·(1−p)^(n−k). Para exactamente k hay que sumar todas las posiciones posibles de esos éxitos: el factor C(n,k) cuenta esas posiciones. Para «al menos uno» suele ser más simple usar el complemento: 1−P(ninguno)=1−(1−p)^n.'],
 intuition:['Imagina casilleros donde marcas acierto o fallo. Saber cuántas marcas de acierto hay no dice en qué casilleros cayeron. Dos aciertos pueden ocupar posiciones distintas y todas deben contarse.','Para saber si apareció alguna marca, puedes mirar lo contrario: la hoja completamente sin aciertos. Quitar esa única clase del total incluye todas las maneras de tener uno o más; no incluye solamente una secuencia elegida.'],
 problem:'Otro problema: en un modelo ideal de dos tiros independientes se acierta con probabilidad 3/4. ¿Es lo mismo fallar exactamente uno que fallar al menos uno?',
 example:['Fallar exactamente uno puede ser fallo–acierto o acierto–fallo. Cada secuencia tiene probabilidad (1/4)·(3/4)=3/16. Sumadas dan 6/16=3/8.','Al menos un fallo incluye además fallo–fallo, cuya probabilidad es (1/4)²=1/16. El total es 7/16.','Comprueba por complemento: ningún fallo significa dos aciertos, probabilidad (3/4)²=9/16. 1−9/16=7/16. La diferencia entre las frases es el caso en que fallan ambos.'],
 bridge:'En tu pregunta decide qué evento llamas éxito y traduce exactamente/al menos antes de calcular. No olvides las posiciones cuando buscas un número exacto ni los solapamientos cuando sumas eventos.',
 checks:{'070':'Las posiciones de dos éxitos son EEFF, EFEF, EFFE, FEEF, FEFE y FFEE. Cada secuencia vale 1/16; seis de ellas suman 6/16=3/8.','071':'Ningún componente falla con probabilidad 0,9³=0,729. Su complemento es 0,271 e incluye uno, dos o tres fallos. 0,001 representa solo los tres fallos simultáneos.'}},
'Distribución normal':{
 aim:'Distingue una observación, su distancia a la media y la probabilidad de una región. Son objetos diferentes aunque aparezcan en la misma campana normal.',
 foundation:['Una distribución normal se representa con una curva simétrica de campana. La media μ está en su centro; la desviación estándar σ>0 describe el ancho. El área total bajo la curva representa probabilidad uno y la simetría deja la mitad a cada lado de la media. Al ser continua, un único valor exacto tiene probabilidad cero.','El valor estandarizado z=(x−μ)/σ expresa cuántas desviaciones estándar separan una observación del centro. Primero resta la media y después divide; z positivo indica estar encima y negativo debajo. Estandarizar no es calcular una probabilidad por sí mismo: para una región distinta de la mitad central se requiere información adicional de la distribución o sus tablas.'],
 intuition:['Imagina comparar posiciones en dos grupos cuyos resultados están muy juntos o muy separados. Estar diez puntos sobre el promedio puede ser un cambio enorme en el grupo apretado y pequeño en el grupo disperso.','La desviación estándar funciona como una regla propia de cada grupo. z cuenta cuántas de esas reglas caben entre el promedio y tu dato. Por otra parte, la mitad de una figura simétrica queda a cada lado del centro sin importar lo ancha que sea.'],
 problem:'Otro problema: en un modelo de dos pruebas, una persona obtiene 70 en un grupo de media 60 y desviación 5; otra obtiene 85 en un grupo de media 70 y desviación 10. ¿Cuál está más desviaciones sobre su media?',
 example:['Primera posición: z₁=(70−60)/5=10/5=2. Está dos desviaciones por encima de su media.','Segunda posición: z₂=(85−70)/10=15/10=1,5. Está una y media por encima de su media.','Aunque 85 sea un puntaje bruto mayor, 70 está más lejos de su centro en la escala de su grupo. No afirmamos una probabilidad exacta a partir de dos sin consultar la región correspondiente.'],
 bridge:'En tu pregunta observa si se pide un área a un lado del centro o el número z de una observación. Usa simetría para lo primero cuando corresponde y resta/división para lo segundo.',
 checks:{'072':'La simetría divide el área total uno en dos partes iguales a ambos lados de cincuenta: 0,5. El ancho cambia con σ, pero no esa división por el centro.','073':'z=2 significa 100+2·15=130. Esta reconstrucción recupera la observación y comprueba tanto el signo como la escala.'}},
'Dispersión':{
 aim:'La dispersión describe qué tan separados están los datos de su centro. Una media grande no implica necesariamente dispersión grande; desplazar todo el grupo y separarlo más son transformaciones distintas.',
 foundation:['Para la varianza poblacional, calcula la media μ, resta esa media a cada dato, eleva cada diferencia al cuadrado, suma y divide por n. El cuadrado impide que diferencias positivas y negativas se anulen. La desviación estándar es la raíz cuadrada de esa varianza y vuelve a las unidades de los datos.','Si sumas la misma constante c a todos los datos, la media también aumenta c. Las diferencias siguen iguales: (x+c)−(μ+c)=x−μ; por eso no cambia la dispersión. Multiplicar todos por k sí multiplica la desviación estándar por |k| y la varianza por k². No confundas varianza poblacional, división por n, con la estimación muestral que usa n−1.'],
 intuition:['Imagina un grupo de personas paradas sobre una línea. Si todas caminan diez pasos en el mismo sentido, el grupo cambió de lugar, pero no se abrió ni se cerró.','Si cada persona se aleja al doble de distancia respecto del centro, sí cambió la separación. Para medirla no sumamos distancias con signos, porque alguien a la izquierda y alguien a la derecha podrían cancelarse sin estar juntos.'],
 problem:'Otro problema: A tiene datos 4 y 6; B tiene datos 0 y 10. Ambos tienen media cinco. ¿Tienen igual dispersión y qué ocurre si a A se le suma veinte?',
 example:['En A, las diferencias respecto de cinco son −1 y 1. Varianza poblacional=(1+1)/2=1 y desviación estándar uno.','En B, las diferencias son −5 y 5. Varianza=(25+25)/2=25 y desviación cinco. Igual media no significa igual dispersión.','Al cambiar A a 24 y 26, su media pasa a veinticinco y sus diferencias siguen siendo −1 y 1. Conserva varianza uno aunque sus valores sean mucho mayores.'],
 bridge:'En tus datos calcula distancias respecto de la media, no respecto de cero. Si se aplica una transformación a todos, revisa si esas distancias cambiaron antes de hacer cuentas largas.',
 checks:{'074':'La media es tres. Las cuatro diferencias son −1,−1,1,1 y sus cuadrados suman cuatro. Dividir por los cuatro datos da varianza poblacional uno, en unidades cuadradas.','075':'Cada diferencia queda (x+10)−(media+10)=x−media. Como ni los cuadrados ni su promedio cambian, su raíz, la desviación estándar, tampoco cambia.'}},
'Números reales':{
 aim:'Para combinar raíces, primero descubre si pueden escribirse como múltiplos de una misma raíz. Sumar o restar lo que hay dentro de dos raíces no equivale a sumarlas o restarlas fuera.',
 foundation:['La raíz cuadrada √a es el número no negativo cuyo cuadrado es a, para a≥0. Si un radicando contiene un factor cuadrado perfecto, puedes extraerlo: √(m²·b)=|m|√b con b≥0. Por ejemplo, √(9·2)=3√2.','Las raíces semejantes tienen el mismo factor radical y se combinan como unidades iguales: 5√2−2√2=(5−2)√2. La raíz no distribuye sobre una suma: √(4+9)=√13, mientras √4+√9=5. Tampoco la resta puede introducirse sin más en un solo radicando.'],
 intuition:['Piensa en cada √2 como una pieza del mismo tamaño. Cinco piezas menos dos piezas dejan tres piezas, no cambian el tamaño de cada una.','Antes de contar piezas iguales debes abrir los paquetes: √50 es un paquete de cinco piezas √2 y √8 uno de dos. Al simplificar conservas exactamente el mismo valor, no una aproximación decimal.'],
 problem:'Otro problema: un rectángulo tiene un lado igual al lado de un cuadrado de área 8 y el otro igual al lado de un cuadrado de área 18. ¿Cuál es su perímetro exacto?',
 example:['Los lados de los cuadrados son √8=√(4·2)=2√2 y √18=√(9·2)=3√2. Esas son las longitudes del rectángulo.','Su perímetro es dos veces la suma de los lados: 2(2√2+3√2)=2·5√2=10√2.','No se obtiene 2√26: eso habría sumado radicandos como si la raíz distribuyera una suma. El perímetro combina longitudes, así que su unidad no es cuadrada.'],
 bridge:'En tu expresión extrae los cuadrados perfectos de cada raíz por separado. Luego reúne únicamente los coeficientes de raíces iguales y conserva el signo de la operación pedida.',
 checks:{'078':'√50=5√2 y √8=2√2, por tanto la diferencia es 3√2. Como aproximación, 7,07−2,83≈4,24 y 3√2≈4,24; √42≈6,48 no coincide.','106':'√75=5√3 y √12=2√3: suman 7√3. Los dos términos conservan √3; multiplicar por √6 o sumar radicandos produciría otra operación.'}}
});
/* El mismo conjunto de datos no constituye una pregunta nueva de transferencia. */
for(const id of ['M2-037','M2-096'])window.CACHASTE_M2.find(q=>q.id===id).transferGroup='m2-mean-2-4-6-8';

// Recuperación selectiva de M2-107–114 desde main 560e48c; conserva IDs y claves.
window.CACHASTE_M2.push(...[
  {
    "id": "M2-107",
    "area": "Probabilidad",
    "concept": "Probabilidad sin reposición",
    "question": "En una urna hay 4 fichas rojas y 3 azules. La primera ficha extraída es roja y no se devuelve. Sabiendo esto, ¿cuál es la probabilidad de que la segunda también sea roja?",
    "options": [
      "1/2",
      "3/7",
      "2/3",
      "4/7"
    ],
    "answer": 0,
    "why": "La primera extracción ya ocurrió y sabemos que fue roja. Calcularemos solo la probabilidad de la segunda bajo esa condición.\n\nUna probabilidad condicionada utiliza la información conocida para actualizar el conjunto de casos posibles. Aquí la primera roja ya fue retirada, así que no calculamos la probabilidad de que ocurra ese primer resultado.\n\nSin reposición quedan una ficha roja menos y una ficha total menos: 3 rojas y 3 azules entre 6 fichas. Cada ficha restante tiene la misma posibilidad de salir.\n\nLa condición «la primera fue roja» cambia la información disponible para la segunda extracción.\n\nQuedan 6 fichas: 3 azules y 3 rojas.\n\nP(roja en la segunda | roja en la primera)=3/6=1/2.\n\nLa primera roja ya no está en la urna: quedan 6 fichas, 3 rojas. La probabilidad condicionada de otra roja es 3/6=1/2. La cifra 3/7 ignora la información de que la primera fue roja.",
    "hint": "Tacha la ficha roja ya retirada y vuelve a contar las rojas y el total que quedan en la urna.",
    "editorial": {
      "steps": [
        "La primera extracción ya ocurrió y sabemos que fue roja. Calcularemos solo la probabilidad de la segunda bajo esa condición.",
        "Una probabilidad condicionada utiliza la información conocida para actualizar el conjunto de casos posibles. Aquí la primera roja ya fue retirada, así que no calculamos la probabilidad de que ocurra ese primer resultado.",
        "Sin reposición quedan una ficha roja menos y una ficha total menos: 3 rojas y 3 azules entre 6 fichas. Cada ficha restante tiene la misma posibilidad de salir.",
        "La condición «la primera fue roja» cambia la información disponible para la segunda extracción.",
        "Quedan 6 fichas: 3 azules y 3 rojas.",
        "P(roja en la segunda | roja en la primera)=3/6=1/2.",
        "La primera roja ya no está en la urna: quedan 6 fichas, 3 rojas. La probabilidad condicionada de otra roja es 3/6=1/2. La cifra 3/7 ignora la información de que la primera fue roja."
      ],
      "easy": "Dibuja las siete fichas y tacha una roja, porque sabemos que esa fue retirada. La segunda elección ocurre entre las seis que todavía están en la urna.\n\nMultiplicar por 4/7 respondería otra pregunta: la probabilidad de obtener ambas rojas antes de comenzar. Aquí el primer resultado ya es información conocida.\n\nLa condición «la primera fue roja» cambia la información disponible para la segunda extracción.\n\nQuedan 6 fichas: 3 azules y 3 rojas.\n\nP(roja en la segunda | roja en la primera)=3/6=1/2.",
      "example": "Una caja contiene 5 tarjetas verdes y 4 amarillas. Se retiró una amarilla sin devolverla. ¿Qué probabilidad tiene la siguiente de ser verde?\n\nLa tarjeta retirada es amarilla: quedan las 5 verdes y solo 3 amarillas.\n\nHay 8 tarjetas posibles y 5 favorables, por lo que la probabilidad condicionada es 5/8.\n\nNo multiplicamos por 4/9: eso incluiría la probabilidad del primer resultado, que el problema ya nos informa.\n\nActualiza los colores y el total según lo que ya ocurrió; después calcula únicamente el evento solicitado."
    },
    "explanations": [
      "Necesitamos que ocurran dos resultados seguidos. Antes de calcular, aclara si el primer objeto vuelve al conjunto: «sin reposición» significa que no vuelve y cambia las posibilidades siguientes.\n\nUna probabilidad compara casos favorables con casos posibles, cuando todos los objetos se eligen con la misma posibilidad. Para dos éxitos consecutivos se multiplica la probabilidad del primero por la del segundo condicionada a que el primero haya ocurrido. «Condicionada» significa que actualizamos la información.\n\nSi el primer objeto cumple la condición deseada y lo retiramos, quedan un objeto favorable menos y un objeto total menos. Es incorrecto mantener la misma fracción en ambas extracciones. No sumamos porque se exige el primer resultado Y el segundo, no uno U otro.\n\nLa condición «la primera fue roja» cambia la información disponible para la segunda extracción.\n\nQuedan 6 fichas: 3 azules y 3 rojas.\n\nP(roja en la segunda | roja en la primera)=3/6=1/2.\n\nLa primera roja ya no está en la urna: quedan 6 fichas, 3 rojas. La probabilidad condicionada de otra roja es 3/6=1/2. La cifra 3/7 ignora la información de que la primera fue roja.",
      "3/7 usa el total antes de retirar la primera ficha.",
      "2/3 conserva las cuatro rojas iniciales como favorables y solo actualiza el total a seis; también hay que descontar la primera roja.",
      "4/7 es la probabilidad de que la primera ficha fuera roja, que ya está dada."
    ],
    "origin": "original",
    "difficulty": "intermedio",
    "reviewStatus": "revision_individual_2026-10-17",
    "teaching": {
      "revision": "tutor-profesor-2026-10-15",
      "quality": "adecuada",
      "aim": "La primera extracción ya ocurrió y sabemos que fue roja. Calcularemos solo la probabilidad de la segunda bajo esa condición.",
      "foundation": [
        "Una probabilidad condicionada utiliza la información conocida para actualizar el conjunto de casos posibles. Aquí la primera roja ya fue retirada, así que no calculamos la probabilidad de que ocurra ese primer resultado.",
        "Sin reposición quedan una ficha roja menos y una ficha total menos: 3 rojas y 3 azules entre 6 fichas. Cada ficha restante tiene la misma posibilidad de salir."
      ],
      "application": [
        "La condición «la primera fue roja» cambia la información disponible para la segunda extracción.",
        "Quedan 6 fichas: 3 azules y 3 rojas.",
        "P(roja en la segunda | roja en la primera)=3/6=1/2."
      ],
      "check": "La primera roja ya no está en la urna: quedan 6 fichas, 3 rojas. La probabilidad condicionada de otra roja es 3/6=1/2. La cifra 3/7 ignora la información de que la primera fue roja.",
      "intuition": [
        "Dibuja las siete fichas y tacha una roja, porque sabemos que esa fue retirada. La segunda elección ocurre entre las seis que todavía están en la urna.",
        "Multiplicar por 4/7 respondería otra pregunta: la probabilidad de obtener ambas rojas antes de comenzar. Aquí el primer resultado ya es información conocida."
      ],
      "example": {
        "problem": "Una caja contiene 5 tarjetas verdes y 4 amarillas. Se retiró una amarilla sin devolverla. ¿Qué probabilidad tiene la siguiente de ser verde?",
        "steps": [
          "La tarjeta retirada es amarilla: quedan las 5 verdes y solo 3 amarillas.",
          "Hay 8 tarjetas posibles y 5 favorables, por lo que la probabilidad condicionada es 5/8.",
          "No multiplicamos por 4/9: eso incluiría la probabilidad del primer resultado, que el problema ya nos informa."
        ],
        "bridge": "Actualiza los colores y el total según lo que ya ocurrió; después calcula únicamente el evento solicitado."
      },
      "selectedFeedback": [
        null,
        {
          "diagnosis": "3/7 usa el total antes de retirar la primera ficha.",
          "repair": [
            "La condición «la primera fue roja» cambia la información disponible para la segunda extracción.",
            "Quedan 6 fichas: 3 azules y 3 rojas.",
            "P(roja en la segunda | roja en la primera)=3/6=1/2."
          ]
        },
        {
          "diagnosis": "2/3 conserva las cuatro rojas iniciales como favorables y solo actualiza el total a seis; también hay que descontar la primera roja.",
          "repair": [
            "La condición «la primera fue roja» cambia la información disponible para la segunda extracción.",
            "Quedan 6 fichas: 3 azules y 3 rojas.",
            "P(roja en la segunda | roja en la primera)=3/6=1/2."
          ]
        },
        {
          "diagnosis": "4/7 es la probabilidad de que la primera ficha fuera roja, que ya está dada.",
          "repair": [
            "La condición «la primera fue roja» cambia la información disponible para la segunda extracción.",
            "Quedan 6 fichas: 3 azules y 3 rojas.",
            "P(roja en la segunda | roja en la primera)=3/6=1/2."
          ]
        }
      ]
    },
    "recoveredFrom": {
      "branch": "main",
      "commit": "560e48cb937cdced1556d86a866c10d5c8012fc7",
      "reviewedAt": "2026-10-18"
    }
  },
  {
    "id": "M2-108",
    "area": "Modelación",
    "concept": "Interés compuesto",
    "question": "Un crédito de consumo hipotético de $300.000 aumenta 1% mensual compuesto durante 3 meses, sin pagos ni cargos. ¿Cuál es el saldo al final?",
    "options": [
      "$309.090,30",
      "$309.000",
      "$303.000",
      "$330.000"
    ],
    "answer": 0,
    "why": "Determina si se pide el saldo completo o solo lo ganado, y cuántos períodos de interés pasan. Este es un modelo matemático hipotético con las condiciones indicadas, no una predicción de una cuenta real.\n\nEl capital es la cantidad de partida. La tasa r representa la fracción que se añade en cada período: 10%=0,10. En interés compuesto, la base se actualiza después de cada período, por lo que el interés posterior también incluye lo ganado antes.\n\nEl factor 1+r conserva el monto anterior y añade su fracción de interés. Después de n períodos: monto=C(1+r)^n, con C capital inicial. La tasa y el tiempo deben usar el mismo período: una tasa mensual se aplica por meses. El interés total es monto menos C, no el monto completo.\n\nCada mes el saldo completo se multiplica por 1,01.\n\nDespués de 3 meses: 300.000·1,01³.\n\nEl saldo es $309.090,30.\n\nCalcula por período: 300.000·1,01=$303.000; luego $306.030; al tercer mes $309.090,30. $309.000 aplica interés simple y omite la capitalización.",
    "hint": "Determina si se pide el saldo completo o solo lo ganado, y cuántos períodos de interés pasan. Este es un modelo matemático hipotético con las condiciones indicadas, no una predicción de una cuenta real.",
    "editorial": {
      "steps": [
        "Determina si se pide el saldo completo o solo lo ganado, y cuántos períodos de interés pasan. Este es un modelo matemático hipotético con las condiciones indicadas, no una predicción de una cuenta real.",
        "El capital es la cantidad de partida. La tasa r representa la fracción que se añade en cada período: 10%=0,10. En interés compuesto, la base se actualiza después de cada período, por lo que el interés posterior también incluye lo ganado antes.",
        "El factor 1+r conserva el monto anterior y añade su fracción de interés. Después de n períodos: monto=C(1+r)^n, con C capital inicial. La tasa y el tiempo deben usar el mismo período: una tasa mensual se aplica por meses. El interés total es monto menos C, no el monto completo.",
        "Cada mes el saldo completo se multiplica por 1,01.",
        "Después de 3 meses: 300.000·1,01³.",
        "El saldo es $309.090,30.",
        "Calcula por período: 300.000·1,01=$303.000; luego $306.030; al tercer mes $309.090,30. $309.000 aplica interés simple y omite la capitalización."
      ],
      "easy": "Imagina una bola de nieve que crece una décima parte de su tamaño en cada vuelta. La segunda décima parte se toma de una bola más grande. No agregas siempre el mismo trozo de nieve.\n\nPuedes evitar la fórmula haciendo una cuenta por período: monto anterior, interés calculado sobre ese monto y nuevo total. Si cada interés sale idéntico pese a que el saldo aumentó, probablemente aplicaste interés simple.\n\nCada mes el saldo completo se multiplica por 1,01.\n\nDespués de 3 meses: 300.000·1,01³.\n\nEl saldo es $309.090,30.",
      "example": "Otro problema: dos modelos de ahorro parten de $10.000 y pagan 10% por período. Uno calcula siempre sobre el capital inicial y el otro reinvierte lo ganado. ¿Por qué después de dos períodos difieren?\n\nEn ambos modelos el primer interés es 10.000·0,10=$1.000, así que llegan a $11.000.\n\nEl simple vuelve a ganar $1.000: saldo $12.000. El compuesto calcula 11.000·0,10=$1.100: saldo $12.100.\n\nLos $100 de diferencia son el 10% de los $1.000 ganados antes. Esto explica el interés sobre interés; no son un cargo adicional inventado.\n\nReconstruye los períodos de tu ejercicio con sus propios montos y tasas. Comprueba si la alternativa elegida detuvo el proceso antes o mantuvo por error el capital inicial como base."
    },
    "explanations": [
      "Determina si se pide el saldo completo o solo lo ganado, y cuántos períodos de interés pasan. Este es un modelo matemático hipotético con las condiciones indicadas, no una predicción de una cuenta real.\n\nEl capital es la cantidad de partida. La tasa r representa la fracción que se añade en cada período: 10%=0,10. En interés compuesto, la base se actualiza después de cada período, por lo que el interés posterior también incluye lo ganado antes.\n\nEl factor 1+r conserva el monto anterior y añade su fracción de interés. Después de n períodos: monto=C(1+r)^n, con C capital inicial. La tasa y el tiempo deben usar el mismo período: una tasa mensual se aplica por meses. El interés total es monto menos C, no el monto completo.\n\nCada mes el saldo completo se multiplica por 1,01.\n\nDespués de 3 meses: 300.000·1,01³.\n\nEl saldo es $309.090,30.\n\nCalcula por período: 300.000·1,01=$303.000; luego $306.030; al tercer mes $309.090,30. $309.000 aplica interés simple y omite la capitalización.",
      "$309.000 aplica interés simple y omite la capitalización.",
      "$303.000 calcula solo un mes de interés.",
      "$330.000 agrega $30.000, el 10% del capital inicial, en vez de capitalizar el 1% mensual durante tres meses."
    ],
    "origin": "original",
    "difficulty": "intermedio",
    "reviewStatus": "revision_individual_2026-10-17",
    "teaching": {
      "revision": "tutor-profesor-2026-10-15",
      "quality": "adecuada",
      "aim": "Determina si se pide el saldo completo o solo lo ganado, y cuántos períodos de interés pasan. Este es un modelo matemático hipotético con las condiciones indicadas, no una predicción de una cuenta real.",
      "foundation": [
        "El capital es la cantidad de partida. La tasa r representa la fracción que se añade en cada período: 10%=0,10. En interés compuesto, la base se actualiza después de cada período, por lo que el interés posterior también incluye lo ganado antes.",
        "El factor 1+r conserva el monto anterior y añade su fracción de interés. Después de n períodos: monto=C(1+r)^n, con C capital inicial. La tasa y el tiempo deben usar el mismo período: una tasa mensual se aplica por meses. El interés total es monto menos C, no el monto completo."
      ],
      "application": [
        "Cada mes el saldo completo se multiplica por 1,01.",
        "Después de 3 meses: 300.000·1,01³.",
        "El saldo es $309.090,30."
      ],
      "check": "Calcula por período: 300.000·1,01=$303.000; luego $306.030; al tercer mes $309.090,30. $309.000 aplica interés simple y omite la capitalización.",
      "intuition": [
        "Imagina una bola de nieve que crece una décima parte de su tamaño en cada vuelta. La segunda décima parte se toma de una bola más grande. No agregas siempre el mismo trozo de nieve.",
        "Puedes evitar la fórmula haciendo una cuenta por período: monto anterior, interés calculado sobre ese monto y nuevo total. Si cada interés sale idéntico pese a que el saldo aumentó, probablemente aplicaste interés simple."
      ],
      "example": {
        "problem": "Otro problema: dos modelos de ahorro parten de $10.000 y pagan 10% por período. Uno calcula siempre sobre el capital inicial y el otro reinvierte lo ganado. ¿Por qué después de dos períodos difieren?",
        "steps": [
          "En ambos modelos el primer interés es 10.000·0,10=$1.000, así que llegan a $11.000.",
          "El simple vuelve a ganar $1.000: saldo $12.000. El compuesto calcula 11.000·0,10=$1.100: saldo $12.100.",
          "Los $100 de diferencia son el 10% de los $1.000 ganados antes. Esto explica el interés sobre interés; no son un cargo adicional inventado."
        ],
        "bridge": "Reconstruye los períodos de tu ejercicio con sus propios montos y tasas. Comprueba si la alternativa elegida detuvo el proceso antes o mantuvo por error el capital inicial como base."
      },
      "selectedFeedback": [
        null,
        {
          "diagnosis": "$309.000 aplica interés simple y omite la capitalización.",
          "repair": [
            "Cada mes el saldo completo se multiplica por 1,01.",
            "Después de 3 meses: 300.000·1,01³.",
            "El saldo es $309.090,30."
          ]
        },
        {
          "diagnosis": "$303.000 calcula solo un mes de interés.",
          "repair": [
            "Cada mes el saldo completo se multiplica por 1,01.",
            "Después de 3 meses: 300.000·1,01³.",
            "El saldo es $309.090,30."
          ]
        },
        {
          "diagnosis": "$330.000 agrega $30.000, el 10% del capital inicial, en vez de capitalizar el 1% mensual durante tres meses.",
          "repair": [
            "Cada mes el saldo completo se multiplica por 1,01.",
            "Después de 3 meses: 300.000·1,01³.",
            "El saldo es $309.090,30."
          ]
        }
      ]
    },
    "recoveredFrom": {
      "branch": "main",
      "commit": "560e48cb937cdced1556d86a866c10d5c8012fc7",
      "reviewedAt": "2026-10-18"
    }
  },
  {
    "id": "M2-109",
    "area": "Modelación",
    "concept": "Porcentajes",
    "question": "En un ejercicio hipotético de ahorro previsional, se deposita el 10% de un ingreso mensual de $850.000. ¿Cuánto se deposita ese mes?",
    "options": [
      "$85.000",
      "$8.500",
      "$765.000",
      "$935.000"
    ],
    "answer": 0,
    "why": "Un porcentaje es una proporción del valor de referencia. Primero identifica esa referencia y después distingue el cambio calculado del valor final que preguntan.\n\nPor ciento significa «por cada cien»: p%=p/100. El p% de una cantidad C es (p/100)·C. En un aumento se suma ese cambio a C; en una disminución se resta. Por eso el factor final es 1+p/100 o 1−p/100, respectivamente.\n\nNo interpretes 20% como veinte unidades: sería así solo si la base fuera cien. Tampoco confundas «aumenta en 25%» con «queda en 25%»: la primera conserva el 100% previo y añade 25%; la segunda deja únicamente una cuarta parte.\n\nConvierte 10% a decimal: 0,10.\n\nMultiplica el ingreso por la tasa: 850.000·0,10.\n\nEl depósito del ejercicio es $85.000.\n\nEl 10% es 0,10; 850.000·0,10=85.000. La tasa la fija este ejercicio hipotético y no debe confundirse con una tasa normativa.",
    "hint": "Un porcentaje es una proporción del valor de referencia. Primero identifica esa referencia y después distingue el cambio calculado del valor final que preguntan.",
    "editorial": {
      "steps": [
        "Un porcentaje es una proporción del valor de referencia. Primero identifica esa referencia y después distingue el cambio calculado del valor final que preguntan.",
        "Por ciento significa «por cada cien»: p%=p/100. El p% de una cantidad C es (p/100)·C. En un aumento se suma ese cambio a C; en una disminución se resta. Por eso el factor final es 1+p/100 o 1−p/100, respectivamente.",
        "No interpretes 20% como veinte unidades: sería así solo si la base fuera cien. Tampoco confundas «aumenta en 25%» con «queda en 25%»: la primera conserva el 100% previo y añade 25%; la segunda deja únicamente una cuarta parte.",
        "Convierte 10% a decimal: 0,10.",
        "Multiplica el ingreso por la tasa: 850.000·0,10.",
        "El depósito del ejercicio es $85.000.",
        "El 10% es 0,10; 850.000·0,10=85.000. La tasa la fija este ejercicio hipotético y no debe confundirse con una tasa normativa."
      ],
      "easy": "Imagina una barra completa que representa el valor original. Dividirla en cien partes permite decir qué fracción añadimos o quitamos sin importar cuánto medía la barra. Veinticinco de esas partes son una cuarta parte de esa barra, no necesariamente veinticinco pesos.\n\nPuedes empezar con fracciones conocidas: 50% es mitad, 25% cuarta parte y 10% décima parte. Esa estimación te ayuda a comprobar si el cambio calculado tiene un tamaño razonable.\n\nConvierte 10% a decimal: 0,10.\n\nMultiplica el ingreso por la tasa: 850.000·0,10.\n\nEl depósito del ejercicio es $85.000.",
      "example": "Otro problema: una cuenta de $24.000 incluye un cargo adicional del 10%. ¿Cuánto se agrega y qué porcentaje de la cuenta original representa el total?\n\nLa décima parte de $24.000 es $2.400: ese es el cargo, no el total.\n\nAl sumar: 24.000+2.400=$26.400. El total representa 100%+10%=110% del valor original.\n\nPodemos comprobarlo con el factor: 24.000·1,10=26.400. Si después se descontara 10% del nuevo total, no volveríamos al original, porque la referencia habría cambiado.\n\nUsa la cantidad inicial de tu ejercicio como base y conserva el sentido del cambio. Antes de escoger una alternativa, decide si ese número corresponde al incremento, al descuento o al resultado completo."
    },
    "explanations": [
      "Un porcentaje es una proporción del valor de referencia. Primero identifica esa referencia y después distingue el cambio calculado del valor final que preguntan.\n\nPor ciento significa «por cada cien»: p%=p/100. El p% de una cantidad C es (p/100)·C. En un aumento se suma ese cambio a C; en una disminución se resta. Por eso el factor final es 1+p/100 o 1−p/100, respectivamente.\n\nNo interpretes 20% como veinte unidades: sería así solo si la base fuera cien. Tampoco confundas «aumenta en 25%» con «queda en 25%»: la primera conserva el 100% previo y añade 25%; la segunda deja únicamente una cuarta parte.\n\nConvierte 10% a decimal: 0,10.\n\nMultiplica el ingreso por la tasa: 850.000·0,10.\n\nEl depósito del ejercicio es $85.000.\n\nEl 10% es 0,10; 850.000·0,10=85.000. La tasa la fija este ejercicio hipotético y no debe confundirse con una tasa normativa.",
      "$8.500 corresponde a 1% del ingreso.",
      "$765.000 es el ingreso restante, no el depósito.",
      "$935.000 suma el ingreso y el 10%; no calcula la parte porcentual."
    ],
    "origin": "original",
    "difficulty": "intermedio",
    "reviewStatus": "revision_individual_2026-10-17",
    "teaching": {
      "revision": "tutor-profesor-2026-10-15",
      "quality": "adecuada",
      "aim": "Un porcentaje es una proporción del valor de referencia. Primero identifica esa referencia y después distingue el cambio calculado del valor final que preguntan.",
      "foundation": [
        "Por ciento significa «por cada cien»: p%=p/100. El p% de una cantidad C es (p/100)·C. En un aumento se suma ese cambio a C; en una disminución se resta. Por eso el factor final es 1+p/100 o 1−p/100, respectivamente.",
        "No interpretes 20% como veinte unidades: sería así solo si la base fuera cien. Tampoco confundas «aumenta en 25%» con «queda en 25%»: la primera conserva el 100% previo y añade 25%; la segunda deja únicamente una cuarta parte."
      ],
      "application": [
        "Convierte 10% a decimal: 0,10.",
        "Multiplica el ingreso por la tasa: 850.000·0,10.",
        "El depósito del ejercicio es $85.000."
      ],
      "check": "El 10% es 0,10; 850.000·0,10=85.000. La tasa la fija este ejercicio hipotético y no debe confundirse con una tasa normativa.",
      "intuition": [
        "Imagina una barra completa que representa el valor original. Dividirla en cien partes permite decir qué fracción añadimos o quitamos sin importar cuánto medía la barra. Veinticinco de esas partes son una cuarta parte de esa barra, no necesariamente veinticinco pesos.",
        "Puedes empezar con fracciones conocidas: 50% es mitad, 25% cuarta parte y 10% décima parte. Esa estimación te ayuda a comprobar si el cambio calculado tiene un tamaño razonable."
      ],
      "example": {
        "problem": "Otro problema: una cuenta de $24.000 incluye un cargo adicional del 10%. ¿Cuánto se agrega y qué porcentaje de la cuenta original representa el total?",
        "steps": [
          "La décima parte de $24.000 es $2.400: ese es el cargo, no el total.",
          "Al sumar: 24.000+2.400=$26.400. El total representa 100%+10%=110% del valor original.",
          "Podemos comprobarlo con el factor: 24.000·1,10=26.400. Si después se descontara 10% del nuevo total, no volveríamos al original, porque la referencia habría cambiado."
        ],
        "bridge": "Usa la cantidad inicial de tu ejercicio como base y conserva el sentido del cambio. Antes de escoger una alternativa, decide si ese número corresponde al incremento, al descuento o al resultado completo."
      },
      "selectedFeedback": [
        null,
        {
          "diagnosis": "$8.500 corresponde a 1% del ingreso.",
          "repair": [
            "Convierte 10% a decimal: 0,10.",
            "Multiplica el ingreso por la tasa: 850.000·0,10.",
            "El depósito del ejercicio es $85.000."
          ]
        },
        {
          "diagnosis": "$765.000 es el ingreso restante, no el depósito.",
          "repair": [
            "Convierte 10% a decimal: 0,10.",
            "Multiplica el ingreso por la tasa: 850.000·0,10.",
            "El depósito del ejercicio es $85.000."
          ]
        },
        {
          "diagnosis": "$935.000 suma el ingreso y el 10%; no calcula la parte porcentual.",
          "repair": [
            "Convierte 10% a decimal: 0,10.",
            "Multiplica el ingreso por la tasa: 850.000·0,10.",
            "El depósito del ejercicio es $85.000."
          ]
        }
      ]
    },
    "recoveredFrom": {
      "branch": "main",
      "commit": "560e48cb937cdced1556d86a866c10d5c8012fc7",
      "reviewedAt": "2026-10-18"
    }
  },
  {
    "id": "M2-110",
    "area": "Modelación",
    "concept": "Porcentajes",
    "question": "En un ejemplo hipotético de crédito hipotecario, una vivienda cuesta 2.400 UF y el pie corresponde al 20% del precio. Sin otros cargos ni reajustes, ¿qué monto se financia?",
    "options": [
      "1.920 UF",
      "480 UF",
      "2.400 UF",
      "2.880 UF"
    ],
    "answer": 0,
    "why": "Un porcentaje es una proporción del valor de referencia. Primero identifica esa referencia y después distingue el cambio calculado del valor final que preguntan.\n\nPor ciento significa «por cada cien»: p%=p/100. El p% de una cantidad C es (p/100)·C. En un aumento se suma ese cambio a C; en una disminución se resta. Por eso el factor final es 1+p/100 o 1−p/100, respectivamente.\n\nNo interpretes 20% como veinte unidades: sería así solo si la base fuera cien. Tampoco confundas «aumenta en 25%» con «queda en 25%»: la primera conserva el 100% previo y añade 25%; la segunda deja únicamente una cuarta parte.\n\nCalcula el pie: 20% de 2.400 UF.\n\nEl pie es 0,20·2.400=480 UF.\n\nResta al precio total: 2.400−480=1.920 UF financiadas.\n\nEl pie cubre 20% de 2.400 UF, o sea 480 UF. Queda por financiar el 80%: 2.400−480=1.920 UF. No añadas el pie al precio ni respondas con el aporte.",
    "hint": "Un porcentaje es una proporción del valor de referencia. Primero identifica esa referencia y después distingue el cambio calculado del valor final que preguntan.",
    "editorial": {
      "steps": [
        "Un porcentaje es una proporción del valor de referencia. Primero identifica esa referencia y después distingue el cambio calculado del valor final que preguntan.",
        "Por ciento significa «por cada cien»: p%=p/100. El p% de una cantidad C es (p/100)·C. En un aumento se suma ese cambio a C; en una disminución se resta. Por eso el factor final es 1+p/100 o 1−p/100, respectivamente.",
        "No interpretes 20% como veinte unidades: sería así solo si la base fuera cien. Tampoco confundas «aumenta en 25%» con «queda en 25%»: la primera conserva el 100% previo y añade 25%; la segunda deja únicamente una cuarta parte.",
        "Calcula el pie: 20% de 2.400 UF.",
        "El pie es 0,20·2.400=480 UF.",
        "Resta al precio total: 2.400−480=1.920 UF financiadas.",
        "El pie cubre 20% de 2.400 UF, o sea 480 UF. Queda por financiar el 80%: 2.400−480=1.920 UF. No añadas el pie al precio ni respondas con el aporte."
      ],
      "easy": "Imagina una barra completa que representa el valor original. Dividirla en cien partes permite decir qué fracción añadimos o quitamos sin importar cuánto medía la barra. Veinticinco de esas partes son una cuarta parte de esa barra, no necesariamente veinticinco pesos.\n\nPuedes empezar con fracciones conocidas: 50% es mitad, 25% cuarta parte y 10% décima parte. Esa estimación te ayuda a comprobar si el cambio calculado tiene un tamaño razonable.\n\nCalcula el pie: 20% de 2.400 UF.\n\nEl pie es 0,20·2.400=480 UF.\n\nResta al precio total: 2.400−480=1.920 UF financiadas.",
      "example": "Otro problema: una cuenta de $24.000 incluye un cargo adicional del 10%. ¿Cuánto se agrega y qué porcentaje de la cuenta original representa el total?\n\nLa décima parte de $24.000 es $2.400: ese es el cargo, no el total.\n\nAl sumar: 24.000+2.400=$26.400. El total representa 100%+10%=110% del valor original.\n\nPodemos comprobarlo con el factor: 24.000·1,10=26.400. Si después se descontara 10% del nuevo total, no volveríamos al original, porque la referencia habría cambiado.\n\nUsa la cantidad inicial de tu ejercicio como base y conserva el sentido del cambio. Antes de escoger una alternativa, decide si ese número corresponde al incremento, al descuento o al resultado completo."
    },
    "explanations": [
      "Un porcentaje es una proporción del valor de referencia. Primero identifica esa referencia y después distingue el cambio calculado del valor final que preguntan.\n\nPor ciento significa «por cada cien»: p%=p/100. El p% de una cantidad C es (p/100)·C. En un aumento se suma ese cambio a C; en una disminución se resta. Por eso el factor final es 1+p/100 o 1−p/100, respectivamente.\n\nNo interpretes 20% como veinte unidades: sería así solo si la base fuera cien. Tampoco confundas «aumenta en 25%» con «queda en 25%»: la primera conserva el 100% previo y añade 25%; la segunda deja únicamente una cuarta parte.\n\nCalcula el pie: 20% de 2.400 UF.\n\nEl pie es 0,20·2.400=480 UF.\n\nResta al precio total: 2.400−480=1.920 UF financiadas.\n\nEl pie cubre 20% de 2.400 UF, o sea 480 UF. Queda por financiar el 80%: 2.400−480=1.920 UF. No añadas el pie al precio ni respondas con el aporte.",
      "480 UF es el pie calculado, no el saldo financiado.",
      "2.400 UF repite el precio completo y no descuenta el aporte inicial.",
      "2.880 UF suma 20% al precio en vez de separar el monto aportado."
    ],
    "origin": "original",
    "difficulty": "intermedio",
    "reviewStatus": "revision_individual_2026-10-17",
    "teaching": {
      "revision": "tutor-profesor-2026-10-15",
      "quality": "adecuada",
      "aim": "Un porcentaje es una proporción del valor de referencia. Primero identifica esa referencia y después distingue el cambio calculado del valor final que preguntan.",
      "foundation": [
        "Por ciento significa «por cada cien»: p%=p/100. El p% de una cantidad C es (p/100)·C. En un aumento se suma ese cambio a C; en una disminución se resta. Por eso el factor final es 1+p/100 o 1−p/100, respectivamente.",
        "No interpretes 20% como veinte unidades: sería así solo si la base fuera cien. Tampoco confundas «aumenta en 25%» con «queda en 25%»: la primera conserva el 100% previo y añade 25%; la segunda deja únicamente una cuarta parte."
      ],
      "application": [
        "Calcula el pie: 20% de 2.400 UF.",
        "El pie es 0,20·2.400=480 UF.",
        "Resta al precio total: 2.400−480=1.920 UF financiadas."
      ],
      "check": "El pie cubre 20% de 2.400 UF, o sea 480 UF. Queda por financiar el 80%: 2.400−480=1.920 UF. No añadas el pie al precio ni respondas con el aporte.",
      "intuition": [
        "Imagina una barra completa que representa el valor original. Dividirla en cien partes permite decir qué fracción añadimos o quitamos sin importar cuánto medía la barra. Veinticinco de esas partes son una cuarta parte de esa barra, no necesariamente veinticinco pesos.",
        "Puedes empezar con fracciones conocidas: 50% es mitad, 25% cuarta parte y 10% décima parte. Esa estimación te ayuda a comprobar si el cambio calculado tiene un tamaño razonable."
      ],
      "example": {
        "problem": "Otro problema: una cuenta de $24.000 incluye un cargo adicional del 10%. ¿Cuánto se agrega y qué porcentaje de la cuenta original representa el total?",
        "steps": [
          "La décima parte de $24.000 es $2.400: ese es el cargo, no el total.",
          "Al sumar: 24.000+2.400=$26.400. El total representa 100%+10%=110% del valor original.",
          "Podemos comprobarlo con el factor: 24.000·1,10=26.400. Si después se descontara 10% del nuevo total, no volveríamos al original, porque la referencia habría cambiado."
        ],
        "bridge": "Usa la cantidad inicial de tu ejercicio como base y conserva el sentido del cambio. Antes de escoger una alternativa, decide si ese número corresponde al incremento, al descuento o al resultado completo."
      },
      "selectedFeedback": [
        null,
        {
          "diagnosis": "480 UF es el pie calculado, no el saldo financiado.",
          "repair": [
            "Calcula el pie: 20% de 2.400 UF.",
            "El pie es 0,20·2.400=480 UF.",
            "Resta al precio total: 2.400−480=1.920 UF financiadas."
          ]
        },
        {
          "diagnosis": "2.400 UF repite el precio completo y no descuenta el aporte inicial.",
          "repair": [
            "Calcula el pie: 20% de 2.400 UF.",
            "El pie es 0,20·2.400=480 UF.",
            "Resta al precio total: 2.400−480=1.920 UF financiadas."
          ]
        },
        {
          "diagnosis": "2.880 UF suma 20% al precio en vez de separar el monto aportado.",
          "repair": [
            "Calcula el pie: 20% de 2.400 UF.",
            "El pie es 0,20·2.400=480 UF.",
            "Resta al precio total: 2.400−480=1.920 UF financiadas."
          ]
        }
      ]
    },
    "recoveredFrom": {
      "branch": "main",
      "commit": "560e48cb937cdced1556d86a866c10d5c8012fc7",
      "reviewedAt": "2026-10-18"
    }
  },
  {
    "id": "M2-111",
    "area": "Funciones",
    "concept": "Función exponencial",
    "question": "El gráfico de una función exponencial creciente f pasa por (0,1) y se aproxima al eje x hacia la izquierda. ¿Cuál podría ser f(x)?",
    "options": [
      "2^x",
      "(1/2)^x",
      "2x+1",
      "log₂(x)"
    ],
    "answer": 0,
    "why": "Leer un gráfico exponencial requiere atender a su punto de partida, crecimiento y asíntota.\n\nEn f(x)=a^x con a>1, el gráfico pasa por (0,1), es creciente y se aproxima al eje x hacia la izquierda. La asíntota y=0 no se alcanza.\n\nEn f(x)=a^x con 0<a<1, el gráfico pasa por (0,1), pero es decreciente. Una función logarítmica tiene dominio x>0 y asíntota vertical en x=0.\n\nEvalúa la intersección con el eje y: 2⁰=1.\n\nComo la base 2 es mayor que 1, la función exponencial es creciente.\n\nCuando x tiende a menos infinito, 2^x se acerca a 0 sin alcanzarlo; el eje x es una asíntota horizontal.\n\nComprobación: f(0)=2⁰=1. Al avanzar a la derecha los valores crecen; al retroceder, se acercan a cero.",
    "hint": "Compara el valor en x=0, el sentido de crecimiento y la asíntota horizontal.",
    "explanations": [
      "Es creciente, f(0)=1 y tiene asíntota horizontal y=0 hacia la izquierda.",
      "(1/2)^x también vale 1 en cero, pero decrece cuando x aumenta.",
      "2x+1 es una recta, no tiene asíntota horizontal y no se aproxima al eje x.",
      "log₂(x) no está definida para x=0 y tiene una asíntota vertical, no horizontal."
    ],
    "editorial": {
      "steps": [
        "Leer un gráfico exponencial requiere atender a su punto de partida, crecimiento y asíntota.",
        "En f(x)=a^x con a>1, el gráfico pasa por (0,1), es creciente y se aproxima al eje x hacia la izquierda. La asíntota y=0 no se alcanza.",
        "En f(x)=a^x con 0<a<1, el gráfico pasa por (0,1), pero es decreciente. Una función logarítmica tiene dominio x>0 y asíntota vertical en x=0.",
        "Evalúa la intersección con el eje y: 2⁰=1.",
        "Como la base 2 es mayor que 1, la función exponencial es creciente.",
        "Cuando x tiende a menos infinito, 2^x se acerca a 0 sin alcanzarlo; el eje x es una asíntota horizontal.",
        "Comprobación: f(0)=2⁰=1. Al avanzar a la derecha los valores crecen; al retroceder, se acercan a cero."
      ],
      "easy": "El exponente cero siempre produce uno, por eso estas curvas cruzan el eje vertical en altura uno.\n\nUna base mayor que uno aumenta el valor hacia la derecha; una base entre cero y uno lo reduce.\n\nEvalúa la intersección con el eje y: 2⁰=1.\n\nComo la base 2 es mayor que 1, la función exponencial es creciente.\n\nCuando x tiende a menos infinito, 2^x se acerca a 0 sin alcanzarlo; el eje x es una asíntota horizontal.",
      "example": "¿Qué rasgos distinguen los gráficos de 3^x y (1/3)^x?\n\nAmbos pasan por (0,1), porque una base positiva elevada a cero es uno.\n\n3^x es creciente; (1/3)^x es decreciente.\n\nAmbas tienen asíntota horizontal y=0 y dominio de todos los reales.\n\nEn el gráfico revisa el cruce con los ejes, el sentido de cambio y si la asíntota es horizontal o vertical."
    },
    "teaching": {
      "quality": "adecuada",
      "revision": "tutor-profesor-2026-10-15",
      "aim": "Leer un gráfico exponencial requiere atender a su punto de partida, crecimiento y asíntota.",
      "foundation": [
        "En f(x)=a^x con a>1, el gráfico pasa por (0,1), es creciente y se aproxima al eje x hacia la izquierda. La asíntota y=0 no se alcanza.",
        "En f(x)=a^x con 0<a<1, el gráfico pasa por (0,1), pero es decreciente. Una función logarítmica tiene dominio x>0 y asíntota vertical en x=0."
      ],
      "application": [
        "Evalúa la intersección con el eje y: 2⁰=1.",
        "Como la base 2 es mayor que 1, la función exponencial es creciente.",
        "Cuando x tiende a menos infinito, 2^x se acerca a 0 sin alcanzarlo; el eje x es una asíntota horizontal."
      ],
      "check": "Comprobación: f(0)=2⁰=1. Al avanzar a la derecha los valores crecen; al retroceder, se acercan a cero.",
      "intuition": [
        "El exponente cero siempre produce uno, por eso estas curvas cruzan el eje vertical en altura uno.",
        "Una base mayor que uno aumenta el valor hacia la derecha; una base entre cero y uno lo reduce."
      ],
      "example": {
        "problem": "¿Qué rasgos distinguen los gráficos de 3^x y (1/3)^x?",
        "steps": [
          "Ambos pasan por (0,1), porque una base positiva elevada a cero es uno.",
          "3^x es creciente; (1/3)^x es decreciente.",
          "Ambas tienen asíntota horizontal y=0 y dominio de todos los reales."
        ],
        "bridge": "En el gráfico revisa el cruce con los ejes, el sentido de cambio y si la asíntota es horizontal o vertical."
      },
      "selectedFeedback": [
        null,
        {
          "diagnosis": "(1/2)^x también vale 1 en cero, pero decrece cuando x aumenta.",
          "repair": [
            "Evalúa la intersección con el eje y: 2⁰=1.",
            "Como la base 2 es mayor que 1, la función exponencial es creciente.",
            "Cuando x tiende a menos infinito, 2^x se acerca a 0 sin alcanzarlo; el eje x es una asíntota horizontal."
          ]
        },
        {
          "diagnosis": "2x+1 es una recta, no tiene asíntota horizontal y no se aproxima al eje x.",
          "repair": [
            "Evalúa la intersección con el eje y: 2⁰=1.",
            "Como la base 2 es mayor que 1, la función exponencial es creciente.",
            "Cuando x tiende a menos infinito, 2^x se acerca a 0 sin alcanzarlo; el eje x es una asíntota horizontal."
          ]
        },
        {
          "diagnosis": "log₂(x) no está definida para x=0 y tiene una asíntota vertical, no horizontal.",
          "repair": [
            "Evalúa la intersección con el eje y: 2⁰=1.",
            "Como la base 2 es mayor que 1, la función exponencial es creciente.",
            "Cuando x tiende a menos infinito, 2^x se acerca a 0 sin alcanzarlo; el eje x es una asíntota horizontal."
          ]
        }
      ]
    },
    "origin": "original",
    "difficulty": "intermedio",
    "reviewStatus": "revision_interna_pendiente",
    "recoveredFrom": {
      "branch": "main",
      "commit": "560e48cb937cdced1556d86a866c10d5c8012fc7",
      "reviewedAt": "2026-10-18"
    }
  },
  {
    "id": "M2-112",
    "area": "Geometría",
    "concept": "Relaciones en la circunferencia",
    "question": "Desde un punto exterior se trazan dos secantes a una circunferencia. La primera tiene segmento exterior 3 y segmento interior 5; la segunda tiene segmento exterior 4 y segmento interior x. ¿Cuánto vale x?",
    "options": [
      "2",
      "4",
      "3",
      "6"
    ],
    "answer": 0,
    "why": "Resolver secantes que parten de un punto exterior usando la longitud total de cada secante.\n\nPara dos secantes desde un punto exterior común, exterior₁·(exterior₁+interior₁)=exterior₂·(exterior₂+interior₂).\n\nDistingue estas secantes exteriores de dos cuerdas que se cruzan dentro. Para secantes se usa exterior por longitud total; para cuerdas interiores, los dos segmentos de cada cuerda.\n\nLa secante completa suma su parte exterior e interior.\n\nLa primera mide 3+5=8; la segunda mide 4+x.\n\nAplica 3·8=4·(4+x): 24=16+4x, por lo tanto x=2.\n\nComprueba sustituyendo x=2: 3·(3+5)=24 y 4·(4+2)=24.",
    "hint": "Multiplica el segmento exterior por la longitud completa de cada secante.",
    "explanations": [
      "3·8=4·6=24; al despejar 24=16+4x resulta x=2.",
      "4 no satisface la relación: 3·8=24, mientras 4·(4+4)=32.",
      "3 no satisface la relación: 4·(4+3)=28, no 24.",
      "6 no satisface la relación: 4·(4+6)=40, no 24."
    ],
    "editorial": {
      "steps": [
        "Resolver secantes que parten de un punto exterior usando la longitud total de cada secante.",
        "Para dos secantes desde un punto exterior común, exterior₁·(exterior₁+interior₁)=exterior₂·(exterior₂+interior₂).",
        "Distingue estas secantes exteriores de dos cuerdas que se cruzan dentro. Para secantes se usa exterior por longitud total; para cuerdas interiores, los dos segmentos de cada cuerda.",
        "La secante completa suma su parte exterior e interior.",
        "La primera mide 3+5=8; la segunda mide 4+x.",
        "Aplica 3·8=4·(4+x): 24=16+4x, por lo tanto x=2.",
        "Comprueba sustituyendo x=2: 3·(3+5)=24 y 4·(4+2)=24."
      ],
      "easy": "La parte exterior se cuenta como primer factor y la secante completa como segundo factor.\n\nSuma los dos pedazos para encontrar la longitud completa antes de multiplicar.\n\nLa secante completa suma su parte exterior e interior.\n\nLa primera mide 3+5=8; la segunda mide 4+x.\n\nAplica 3·8=4·(4+x): 24=16+4x, por lo tanto x=2.",
      "example": "Una secante tiene parte exterior 2 e interior 7; otra tiene exterior 3 e interior x. Encuentra x.\n\nLa primera longitud completa es 2+7=9; su producto es 2·9=18.\n\nLa segunda mide 3+x. Iguala 3(3+x)=18.\n\nDivide por 3: 3+x=6; luego x=3 y 3·6=18.\n\nMarca el punto exterior común. En cada secante identifica el tramo exterior y suma exterior+interior."
    },
    "teaching": {
      "quality": "adecuada",
      "revision": "tutor-profesor-2026-10-15",
      "aim": "Resolver secantes que parten de un punto exterior usando la longitud total de cada secante.",
      "foundation": [
        "Para dos secantes desde un punto exterior común, exterior₁·(exterior₁+interior₁)=exterior₂·(exterior₂+interior₂).",
        "Distingue estas secantes exteriores de dos cuerdas que se cruzan dentro. Para secantes se usa exterior por longitud total; para cuerdas interiores, los dos segmentos de cada cuerda."
      ],
      "application": [
        "La secante completa suma su parte exterior e interior.",
        "La primera mide 3+5=8; la segunda mide 4+x.",
        "Aplica 3·8=4·(4+x): 24=16+4x, por lo tanto x=2."
      ],
      "check": "Comprueba sustituyendo x=2: 3·(3+5)=24 y 4·(4+2)=24.",
      "intuition": [
        "La parte exterior se cuenta como primer factor y la secante completa como segundo factor.",
        "Suma los dos pedazos para encontrar la longitud completa antes de multiplicar."
      ],
      "example": {
        "problem": "Una secante tiene parte exterior 2 e interior 7; otra tiene exterior 3 e interior x. Encuentra x.",
        "steps": [
          "La primera longitud completa es 2+7=9; su producto es 2·9=18.",
          "La segunda mide 3+x. Iguala 3(3+x)=18.",
          "Divide por 3: 3+x=6; luego x=3 y 3·6=18."
        ],
        "bridge": "Marca el punto exterior común. En cada secante identifica el tramo exterior y suma exterior+interior."
      },
      "selectedFeedback": [
        null,
        {
          "diagnosis": "4 no satisface la relación: 3·8=24, mientras 4·(4+4)=32.",
          "repair": [
            "La secante completa suma su parte exterior e interior.",
            "La primera mide 3+5=8; la segunda mide 4+x.",
            "Aplica 3·8=4·(4+x): 24=16+4x, por lo tanto x=2."
          ]
        },
        {
          "diagnosis": "3 no satisface la relación: 4·(4+3)=28, no 24.",
          "repair": [
            "La secante completa suma su parte exterior e interior.",
            "La primera mide 3+5=8; la segunda mide 4+x.",
            "Aplica 3·8=4·(4+x): 24=16+4x, por lo tanto x=2."
          ]
        },
        {
          "diagnosis": "6 no satisface la relación: 4·(4+6)=40, no 24.",
          "repair": [
            "La secante completa suma su parte exterior e interior.",
            "La primera mide 3+5=8; la segunda mide 4+x.",
            "Aplica 3·8=4·(4+x): 24=16+4x, por lo tanto x=2."
          ]
        }
      ]
    },
    "origin": "original",
    "difficulty": "intermedio",
    "reviewStatus": "revision_interna_pendiente",
    "recoveredFrom": {
      "branch": "main",
      "commit": "560e48cb937cdced1556d86a866c10d5c8012fc7",
      "reviewedAt": "2026-10-18"
    }
  },
  {
    "id": "M2-113",
    "area": "Funciones",
    "concept": "Logaritmos",
    "question": "La gráfica de g(x)=log₂(x) cruza el eje x en (1,0). ¿Qué descripción corresponde?",
    "options": [
      "Su dominio es x>0, es creciente y tiene asíntota vertical x=0.",
      "Su dominio son todos los números reales, es creciente y tiene asíntota horizontal y=0.",
      "Su dominio es x>0, es decreciente y tiene asíntota vertical x=0.",
      "Su dominio es x>0, es creciente y tiene asíntota horizontal y=0."
    ],
    "answer": 0,
    "why": "Reconocer dominio, monotonicidad e intersección de la gráfica logarítmica.\n\nEn g(x)=log_b(x), se requiere x>0 y el punto (1,0) siempre pertenece al gráfico.\n\nSi b>1, la función es creciente; la recta x=0 es asíntota vertical. Si 0<b<1, es decreciente.\n\nEl argumento x debe ser positivo, así que el dominio es x>0.\n\nlog₂(1)=0 y la base 2>1; la gráfica cruza en (1,0) y es creciente.\n\nAl acercarse x a 0 por la derecha, los valores disminuyen sin límite; la asíntota vertical es x=0.\n\nVerifica dos rasgos: log₂(1)=0 y log₂(2)=1. La gráfica sube hacia la derecha, solo existe para x>0 y se aproxima a x=0 sin tocarla.",
    "hint": "Comprueba dónde está definida, si sube o baja y si su asíntota es vertical u horizontal.",
    "explanations": [
      "La función logarítmica requiere x>0; con base 2 crece y se aproxima al eje y (x=0), su asíntota vertical.",
      "El dominio no son todos los reales y la asíntota de una función logarítmica es vertical; la horizontal y=0 caracteriza aquí una exponencial.",
      "La base 2 genera una función creciente; la decreciente corresponde a una base entre 0 y 1.",
      "El dominio y crecimiento son correctos, pero la asíntota es la recta vertical x=0, no la horizontal y=0."
    ],
    "editorial": {
      "steps": [
        "Reconocer dominio, monotonicidad e intersección de la gráfica logarítmica.",
        "En g(x)=log_b(x), se requiere x>0 y el punto (1,0) siempre pertenece al gráfico.",
        "Si b>1, la función es creciente; la recta x=0 es asíntota vertical. Si 0<b<1, es decreciente.",
        "El argumento x debe ser positivo, así que el dominio es x>0.",
        "log₂(1)=0 y la base 2>1; la gráfica cruza en (1,0) y es creciente.",
        "Al acercarse x a 0 por la derecha, los valores disminuyen sin límite; la asíntota vertical es x=0.",
        "Verifica dos rasgos: log₂(1)=0 y log₂(2)=1. La gráfica sube hacia la derecha, solo existe para x>0 y se aproxima a x=0 sin tocarla."
      ],
      "easy": "La función logarítmica pregunta qué exponente produce un número positivo.\n\nEl uno es especial: cualquier base válida elevada a cero da uno, por eso el logaritmo de uno vale cero.\n\nEl argumento x debe ser positivo, así que el dominio es x>0.\n\nlog₂(1)=0 y la base 2>1; la gráfica cruza en (1,0) y es creciente.\n\nAl acercarse x a 0 por la derecha, los valores disminuyen sin límite; la asíntota vertical es x=0.",
      "example": "¿Qué rasgos tiene f(x)=log₅(x)?\n\nSu argumento debe ser positivo: x>0.\n\nlog₅(1)=0 y log₅(5)=1.\n\nComo 5>1, es creciente y su asíntota vertical es x=0.\n\nEn un gráfico logarítmico busca primero el dominio, el punto (1,0), el sentido de crecimiento y la asíntota vertical."
    },
    "teaching": {
      "quality": "adecuada",
      "revision": "tutor-profesor-2026-10-15",
      "aim": "Reconocer dominio, monotonicidad e intersección de la gráfica logarítmica.",
      "foundation": [
        "En g(x)=log_b(x), se requiere x>0 y el punto (1,0) siempre pertenece al gráfico.",
        "Si b>1, la función es creciente; la recta x=0 es asíntota vertical. Si 0<b<1, es decreciente."
      ],
      "application": [
        "El argumento x debe ser positivo, así que el dominio es x>0.",
        "log₂(1)=0 y la base 2>1; la gráfica cruza en (1,0) y es creciente.",
        "Al acercarse x a 0 por la derecha, los valores disminuyen sin límite; la asíntota vertical es x=0."
      ],
      "check": "Verifica dos rasgos: log₂(1)=0 y log₂(2)=1. La gráfica sube hacia la derecha, solo existe para x>0 y se aproxima a x=0 sin tocarla.",
      "intuition": [
        "La función logarítmica pregunta qué exponente produce un número positivo.",
        "El uno es especial: cualquier base válida elevada a cero da uno, por eso el logaritmo de uno vale cero."
      ],
      "example": {
        "problem": "¿Qué rasgos tiene f(x)=log₅(x)?",
        "steps": [
          "Su argumento debe ser positivo: x>0.",
          "log₅(1)=0 y log₅(5)=1.",
          "Como 5>1, es creciente y su asíntota vertical es x=0."
        ],
        "bridge": "En un gráfico logarítmico busca primero el dominio, el punto (1,0), el sentido de crecimiento y la asíntota vertical."
      },
      "selectedFeedback": [
        null,
        {
          "diagnosis": "El dominio no son todos los reales y la asíntota de una función logarítmica es vertical; la horizontal y=0 caracteriza aquí una exponencial.",
          "repair": [
            "El argumento debe ser positivo, así que el dominio es x>0.",
            "log₂(1)=0, por eso la gráfica cruza el eje x en (1,0); como la base 2 es mayor que 1, es creciente.",
            "Al acercarse x a 0 por la derecha, los valores disminuyen sin límite: x=0 es una asíntota vertical."
          ]
        },
        {
          "diagnosis": "La base 2 genera una función creciente; la decreciente corresponde a una base entre 0 y 1.",
          "repair": [
            "El argumento debe ser positivo, así que el dominio es x>0.",
            "log₂(1)=0, por eso la gráfica cruza el eje x en (1,0); como la base 2 es mayor que 1, es creciente.",
            "Al acercarse x a 0 por la derecha, los valores disminuyen sin límite: x=0 es una asíntota vertical."
          ]
        },
        {
          "diagnosis": "El dominio y crecimiento son correctos, pero la asíntota es la recta vertical x=0, no la horizontal y=0.",
          "repair": [
            "El argumento debe ser positivo, así que el dominio es x>0.",
            "log₂(1)=0, por eso la gráfica cruza el eje x en (1,0); como la base 2 es mayor que 1, es creciente.",
            "Al acercarse x a 0 por la derecha, los valores disminuyen sin límite: x=0 es una asíntota vertical."
          ]
        }
      ]
    },
    "origin": "original",
    "difficulty": "intermedio",
    "reviewStatus": "revision_interna_pendiente",
    "recoveredFrom": {
      "branch": "main",
      "commit": "560e48cb937cdced1556d86a866c10d5c8012fc7",
      "reviewedAt": "2026-10-18"
    }
  },
  {
    "id": "M2-114",
    "area": "Funciones",
    "concept": "Función exponencial",
    "question": "Un modelo para la concentración de una sustancia es C(t)=200(0,6)^t, con t en horas y C en mg/L. ¿Qué descripción coincide con su gráfica?",
    "options": [
      "Parte en (0, 200), disminuye y se acerca a y=0 sin tocarla.",
      "Parte en (200, 0), disminuye y se acerca a x=0.",
      "Parte en (0, 200), aumenta y se acerca a y=0.",
      "Parte en (0, 0), aumenta en línea recta."
    ],
    "answer": 0,
    "why": "Interpretar inicio, decrecimiento y asíntota horizontal en un modelo exponencial.\n\nEn f(t)=A·b^t, f(0)=A porque b^0=1. El punto inicial es (0,A).\n\nSi 0<b<1 y A>0, los valores decrecen y permanecen positivos; cuando t aumenta, se aproximan a cero.\n\nCalcula el valor inicial: C(0)=200, por lo que el gráfico parte en (0,200).\n\nCalcula una hora después: C(1)=200·0,6=120. El factor menor que uno hace que disminuya.\n\nLa curva se acerca al eje horizontal y=0 sin alcanzarlo para un tiempo finito; esa recta es la asíntota horizontal.\n\nComprueba C(0)=200 y C(1)=120. Luego compara 72·0,6=43,2: cada hora baja, pero permanece sobre cero.",
    "hint": "Evalúa el modelo en t=0 y t=1; después fíjate en qué provoca que la base esté entre 0 y 1.",
    "explanations": [
      "C(0)=200 y C(1)=120. Como la base está entre 0 y 1, la curva decrece y tiene asíntota horizontal y=0.",
      "Las coordenadas invierten el orden: el eje horizontal representa t, así que al inicio el punto es (0,200).",
      "La base 0,6 está entre 0 y 1; por eso cada hora el valor se multiplica por un número menor que uno y disminuye.",
      "C(0)=200, no cero. Además, una potencia con exponente variable no describe una recta."
    ],
    "editorial": {
      "steps": [
        "Interpretar inicio, decrecimiento y asíntota horizontal en un modelo exponencial.",
        "En f(t)=A·b^t, f(0)=A porque b^0=1. El punto inicial es (0,A).",
        "Si 0<b<1 y A>0, los valores decrecen y permanecen positivos; cuando t aumenta, se aproximan a cero.",
        "Calcula el valor inicial: C(0)=200, por lo que el gráfico parte en (0,200).",
        "Calcula una hora después: C(1)=200·0,6=120. El factor menor que uno hace que disminuya.",
        "La curva se acerca al eje horizontal y=0 sin alcanzarlo para un tiempo finito; esa recta es la asíntota horizontal.",
        "Comprueba C(0)=200 y C(1)=120. Luego compara 72·0,6=43,2: cada hora baja, pero permanece sobre cero."
      ],
      "easy": "Multiplicar por 0,6 equivale a conservar el 60% del valor anterior.\n\nEn un modelo exponencial decreciente, el gráfico se acerca al eje horizontal aunque cada valor siga siendo positivo.\n\nCalcula el valor inicial: C(0)=200, por lo que el gráfico parte en (0,200).\n\nCalcula una hora después: C(1)=200·0,6=120. El factor menor que uno hace que disminuya.\n\nLa curva se acerca al eje horizontal y=0 sin alcanzarlo para un tiempo finito; esa recta es la asíntota horizontal.",
      "example": "Un indicador sigue H(t)=500·(0,8)^t. ¿Qué rasgos tiene su gráfico?\n\nH(0)=500·1=500; comienza en (0,500).\n\nH(1)=500·0,8=400; como 0,8 está entre cero y uno, disminuye.\n\nLos valores se acercan a cero cuando t aumenta, por lo que y=0 es una asíntota horizontal.\n\nEvalúa primero t=0 para ubicar el inicio y luego compara la base con 1 para decidir si el modelo crece o decrece."
    },
    "teaching": {
      "quality": "adecuada",
      "revision": "tutor-profesor-2026-10-17",
      "aim": "Interpretar inicio, decrecimiento y asíntota horizontal en un modelo exponencial.",
      "foundation": [
        "En f(t)=A·b^t, f(0)=A porque b^0=1. El punto inicial es (0,A).",
        "Si 0<b<1 y A>0, los valores decrecen y permanecen positivos; cuando t aumenta, se aproximan a cero."
      ],
      "application": [
        "Calcula el valor inicial: C(0)=200, por lo que el gráfico parte en (0,200).",
        "Calcula una hora después: C(1)=200·0,6=120. El factor menor que uno hace que disminuya.",
        "La curva se acerca al eje horizontal y=0 sin alcanzarlo para un tiempo finito; esa recta es la asíntota horizontal."
      ],
      "check": "Comprueba C(0)=200 y C(1)=120. Luego compara 72·0,6=43,2: cada hora baja, pero permanece sobre cero.",
      "intuition": [
        "Multiplicar por 0,6 equivale a conservar el 60% del valor anterior.",
        "En un modelo exponencial decreciente, el gráfico se acerca al eje horizontal aunque cada valor siga siendo positivo."
      ],
      "example": {
        "problem": "Un indicador sigue H(t)=500·(0,8)^t. ¿Qué rasgos tiene su gráfico?",
        "steps": [
          "H(0)=500·1=500; comienza en (0,500).",
          "H(1)=500·0,8=400; como 0,8 está entre cero y uno, disminuye.",
          "Los valores se acercan a cero cuando t aumenta, por lo que y=0 es una asíntota horizontal."
        ],
        "bridge": "Evalúa primero t=0 para ubicar el inicio y luego compara la base con 1 para decidir si el modelo crece o decrece."
      },
      "selectedFeedback": [
        null,
        {
          "diagnosis": "Las coordenadas invierten el orden: el eje horizontal representa t, así que al inicio el punto es (0,200).",
          "repair": [
            "Sustituye t=0: C(0)=200(0,6)^0=200; el gráfico parte en (0,200).",
            "La base 0,6 está entre cero y uno. Al aumentar t, cada valor se multiplica nuevamente por 0,6, así que la concentración baja.",
            "La potencia nunca es negativa ni llega a cero para un t finito; al aumentar t se aproxima a cero. La asíntota horizontal es y=0."
          ]
        },
        {
          "diagnosis": "La base 0,6 está entre 0 y 1; por eso cada hora el valor se multiplica por un número menor que uno y disminuye.",
          "repair": [
            "Sustituye t=0: C(0)=200(0,6)^0=200; el gráfico parte en (0,200).",
            "La base 0,6 está entre cero y uno. Al aumentar t, cada valor se multiplica nuevamente por 0,6, así que la concentración baja.",
            "La potencia nunca es negativa ni llega a cero para un t finito; al aumentar t se aproxima a cero. La asíntota horizontal es y=0."
          ]
        },
        {
          "diagnosis": "C(0)=200, no cero. Además, una potencia con exponente variable no describe una recta.",
          "repair": [
            "Sustituye t=0: C(0)=200(0,6)^0=200; el gráfico parte en (0,200).",
            "La base 0,6 está entre cero y uno. Al aumentar t, cada valor se multiplica nuevamente por 0,6, así que la concentración baja.",
            "La potencia nunca es negativa ni llega a cero para un t finito; al aumentar t se aproxima a cero. La asíntota horizontal es y=0."
          ]
        }
      ]
    },
    "origin": "original",
    "difficulty": "intermedio",
    "reviewStatus": "revision_interna_pendiente",
    "recoveredFrom": {
      "branch": "main",
      "commit": "560e48cb937cdced1556d86a866c10d5c8012fc7",
      "reviewedAt": "2026-10-18"
    }
  }
]);
