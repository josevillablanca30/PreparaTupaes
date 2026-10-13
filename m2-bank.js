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
