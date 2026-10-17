/* Clases de M1: fundamentos reutilizados por concepto y resolución individual.
 * No cambia enunciados, opciones ni claves. La cobertura se deriva de las clases presentes. */
(function(global){
 'use strict';
 const lessons={};
 const define=(key,foundation,intuition,problem,steps,bridge)=>lessons[key]={foundation,intuition,example:{problem,steps,bridge}};
 define('Descuento porcentual',[
  'Un porcentaje expresa una parte de cada cien. El 25% significa 25 de cada 100 y se escribe 25/100 = 0,25. La base es el precio antes de descontar.',
  'Descontar significa quitar una parte del precio, no pagar esa parte. Primero calculamos descuento = precio × porcentaje/100; después precio final = precio − descuento. También podemos multiplicar por la fracción que queda.'
 ],[
  'Imagina una barra que representa todo el precio. Si la repartes en cien casillas y tachas las del descuento, pagas las casillas que siguen pintadas. El dinero que se borra y el dinero que entregas son dos cantidades distintas.',
  'Un cuarto de descuento es como dejar una de cuatro porciones de una pizza: quedan tres. Antes de calcular, pregúntate si buscan lo que ahorras o lo que pagas.'
 ],'Un estanque tenía 80 litros y se utilizó el 15% para regar. ¿Cuánta agua queda?',[
  'El total inicial de referencia son 80 litros. Usar 15% significa retirar 15 de cada cien partes del agua.',
  'La parte usada es 80 × 15/100 = 12 litros. Esa cantidad todavía no responde cuánto queda.',
  'Restamos 80 − 12 = 68 litros. Comprobamos: 68 + 12 = 80, y 68/80 = 0,85: queda el 85%.'
 ],'El agua utilizada cumple el papel del descuento y el agua restante el del precio final: calcula la parte retirada y luego lo que queda.');
 define('Ecuación lineal',[
  'Una ecuación afirma que dos expresiones tienen el mismo valor. La letra x representa una cantidad desconocida; 3x significa tres veces esa cantidad.',
  'Para conservar una igualdad debemos hacer la misma operación a ambos lados. Despejar es dejar x sola: deshacemos sumas o restas y luego multiplicaciones. Finalmente sustituimos el valor encontrado en la expresión original.'
 ],[
  'Piensa en una balanza equilibrada. Si retiras el mismo peso de ambos platos, sigue equilibrada. Si repartes el contenido de cada plato en el mismo número de grupos, también.',
  'Una caja cerrada representa x: no necesitamos abrirla para averiguar cuánto contiene si conocemos el peso de varias cajas y los objetos que las acompañan.'
 ],'Tres paquetes iguales y un objeto de 2 kg pesan juntos 17 kg. ¿Cuánto pesa cada paquete?',[
  'Llamamos p al peso de un paquete. La balanza representa 3p + 2 = 17.',
  'Quitamos 2 kg de ambos lados: 3p = 15. Ahora esos quince kilos corresponden a tres paquetes, no a uno.',
  'Dividimos ambos lados por tres: p = 5 kg. Al reponerlo, 3 × 5 + 2 = 17 kg: la balanza cuadra.'
 ],'Identifica qué parte acompaña a la incógnita y qué número la multiplica. Deshaz ambas operaciones conservando la igualdad.');
 define('Proporción directa',[
  'Dos cantidades son directamente proporcionales cuando su razón se mantiene constante: cada unidad requiere o cuesta lo mismo. Duplicar una duplica la otra.',
  'El valor unitario se obtiene dividiendo el total conocido por el número de unidades. Multiplicarlo por las nuevas unidades evita sumar cantidades que tienen unidades diferentes.'
 ],[
  'Imagina una máquina que entrega siempre la misma cantidad de agua por cada ficha. Si averiguas lo que entrega con una ficha, puedes anticipar lo que entrega con cualquier número de fichas.',
  'El puente entre un grupo conocido y otro distinto es pasar por una sola unidad. No sumes pesos con cuadernos ni gramos con panes: primero averigua cuánto corresponde a uno.'
 ],'Una llave llena 18 litros en 3 minutos con caudal constante. ¿Cuánto entrega en 7 minutos?',[
  'La condición de caudal constante significa que cada minuto entrega la misma cantidad.',
  'Por minuto entrega 18 ÷ 3 = 6 litros. En siete minutos entrega 6 × 7 = 42 litros.',
  'Verificamos la razón: 42/7 = 6 litros por minuto, igual que 18/3. No bastaba sumar cuatro litros porque aumentaron cuatro minutos.'
 ],'Conserva la razón por unidad, igual que el precio unitario de entradas o cuadernos y la harina necesaria por pan.');
 define('Potencias y operaciones',[
  'Una potencia aⁿ representa n factores iguales a a cuando n es un entero positivo. La base indica el factor y el exponente cuántas veces aparece: 2³ = 2 × 2 × 2.',
  'Primero resolvemos potencias, luego multiplicaciones y divisiones, y finalmente sumas y restas. Sumar potencias no permite sumar sus exponentes ni mezclar sus bases.'
 ],[
  'Piensa en cajas dentro de cajas: tres niveles con dos posibilidades por nivel producen 2 × 2 × 2 posibilidades, no dos por tres.',
  'Si agregas después otro grupo de objetos, cuentas cada grupo antes de juntarlos. La suma que separa las potencias es una señal para calcular cada bloque por separado.'
 ],'Una contraseña usa cuatro decisiones binarias y otra usa dos posiciones con tres símbolos cada una. ¿Cuántas contraseñas hay en total si los grupos se distinguen?',[
  'El primer grupo tiene 2⁴ = 2 × 2 × 2 × 2 = 16 posibilidades.',
  'El segundo tiene 3² = 3 × 3 = 9. Son grupos distintos, de modo que sumamos sus cantidades.',
  'En total hay 16 + 9 = 25. Multiplicar 16 por 9 describiría combinar ambas contraseñas, que sería otra pregunta.'
 ],'Calcula cada potencia como un producto propio y solo después utiliza la operación que une los dos bloques.');
 define('Probabilidad simple',[
  'La probabilidad mide qué parte de los resultados posibles cumple una condición. Si todos los resultados elementales son igualmente probables, P = casos favorables / casos posibles.',
  'El denominador incluye todos los objetos o resultados disponibles, también los que no sirven. El numerador cuenta solo los que cumplen la condición. La probabilidad siempre queda entre cero y uno.'
 ],[
  'Imagina que cada objeto tiene un boleto idéntico y que eliges un boleto sin mirar. La pregunta es qué parte de todos los boletos lleva la marca que buscas.',
  'Comparar objetos favorables con objetos de otro color responde otra cosa. Necesitamos comparar lo que queremos con todo lo que podría salir.'
 ],'Se sortean ocho turnos numerados del 1 al 8. ¿Qué probabilidad hay de obtener un número mayor que 5?',[
  'Los resultados favorables son 6, 7 y 8: tres turnos. Los posibles son los ocho números.',
  'P(número mayor que 5) = 3/8. No usamos 3/5 porque cinco es la cantidad de turnos que no cumplen la condición.',
  'Los cinco turnos restantes tienen probabilidad 5/8. Ambas partes suman 3/8 + 5/8 = 1, como debe ocurrir.'
 ],'Enumera los resultados que cumplen lo solicitado y divídelos por todos los resultados posibles, no por los desfavorables.');
 define('Variación porcentual',[
  'Un aumento absoluto indica cuánto se agregó. Un aumento porcentual compara esa diferencia con el valor inicial: porcentaje = (final − inicial)/inicial × 100.',
  'La base debe ser el valor desde el cual comenzó el cambio. Dividir por el valor final calcula otra proporción; dividir final por inicial entrega el nivel final relativo, que incluye el cien por ciento original.'
 ],[
  'Si tu recorrido inicial son cuatro cuadras y agregas una, esa cuadra extra equivale a una de las cuatro que ya tenías: un cuarto, o 25%. No es una de las cinco finales.',
  'Pregunta siempre: ¿más que antes en relación con cuánto había antes? Así separas el crecimiento de la cantidad total que terminó existiendo.'
 ],'Una biblioteca pasa de 200 a 260 préstamos mensuales. ¿Cuánto creció en porcentaje?',[
  'El aumento es 260 − 200 = 60 préstamos. La referencia son los doscientos iniciales.',
  'Calculamos 60/200 = 0,30; multiplicar por cien da 30%. El nivel final es 130% del inicial, pero el aumento es solo 30%.',
  'Comprobamos: 30% de 200 es 60 y 200 + 60 = 260. Usar 260 como base no respondería el crecimiento respecto del inicio.'
 ],'Separa el aumento del total final y compáralo con el precio o cantidad original.');
 define('Área rectangular',[
  'El área mide la superficie que cubre una figura. Una unidad cuadrada es un cuadrado de un centímetro o metro de lado, según las unidades.',
  'En un rectángulo, base × altura cuenta las unidades por fila y la cantidad de filas. El perímetro, en cambio, es la longitud del borde y suma los lados. No son intercambiables.'
 ],[
  'Imagina un piso cubierto con baldosas cuadradas: contar baldosas mide superficie; caminar por el borde mide contorno.',
  'Si caben ocho baldosas en una fila y hay cinco filas, cada fila aporta otras ocho. Por eso se multiplica, en lugar de sumar las dos dimensiones.'
 ],'Una pared de 3 m de ancho y 2 m de alto tiene una ventana de 1 m². ¿Qué superficie se pinta?',[
  'La pared completa contiene 3 × 2 = 6 cuadrados de un metro cuadrado.',
  'La ventana ocupa uno de esos cuadrados y no se pinta: 6 − 1 = 5 m².',
  'Comprobamos sumando la parte pintada y la ventana: 5 + 1 = 6 m². Medir el borde de la pared no serviría para comprar pintura.'
 ],'Cuenta la superficie mediante base por altura; si una parte no se usa, calcula su área y réstala, sin mezclar longitudes con superficies.');
 define('Área triangular',[
  'El área de un triángulo es base × altura / 2. La altura es la distancia perpendicular entre la base y el vértice opuesto; un lado inclinado no siempre es la altura.',
  'Dos copias congruentes de un triángulo pueden formar un paralelogramo con la misma base y altura. Cada copia ocupa la mitad de esa superficie: de ahí sale la división por dos.'
 ],[
  'Imagina un paño rectangular y un corte diagonal que lo divide en dos piezas iguales. Cada triángulo se queda con la mitad del paño, aunque conserve toda la base y toda la altura.',
  'La altura se mide en línea recta hacia la base, formando una esquina de 90 grados. Medir por el borde inclinado cambia el problema.'
 ],'Un letrero triangular tiene base de 1,2 m y altura perpendicular de 0,5 m. ¿Qué superficie hay que pintar?',[
  'El rectángulo de referencia tendría 1,2 × 0,5 = 0,6 m².',
  'El triángulo ocupa la mitad: 0,6 ÷ 2 = 0,3 m².',
  'Al juntar dos letreros iguales obtenemos 0,6 m². Esa comprobación explica por qué multiplicar sin dividir por dos daría el doble.'
 ],'Busca la base y su altura perpendicular, calcula su producto y toma la mitad.');
 define('Moda',[
  'La moda es el valor que aparece con mayor frecuencia. Frecuencia significa cuántas veces se repite un valor, no cuánto vale ese dato.',
  'Conviene hacer un recuento por valor y comparar las cantidades. Puede haber una moda, varias empatadas o ningún valor que destaque; no se obtiene sumando todos los datos.'
 ],[
  'Piensa en una votación por talla de polera. Gana la talla que más personas piden: no la talla de número más grande ni la suma de las tallas.',
  'En un gráfico de frecuencias, la barra más alta señala al ganador; luego hay que leer su etiqueta. La altura cuenta votos y la etiqueta dice qué talla ganó.'
 ],'Una tienda registra las tallas S, M, L, M, S, M y L. ¿Cuál es la moda?',[
  'Contamos S dos veces, M tres veces y L dos veces.',
  'La mayor frecuencia es tres, pero el valor que tiene esa frecuencia es M. Por eso la moda es M, no 3.',
  'No necesitamos sumar ni ordenar alfabéticamente las tallas: comparamos cuántas veces aparece cada categoría.'
 ],'Cuenta repeticiones y responde el valor o categoría que más se repite, no su frecuencia.');
 define('Media aritmética',[
  'La media o promedio aritmético es el reparto equitativo de una cantidad total entre todos los datos: media = suma de valores / cantidad de valores.',
  'Cada dato cuenta una vez, también si se repite. La media puede ser un número que no aparezca en la lista; no equivale necesariamente al valor central ni al más frecuente.'
 ],[
  'Imagina juntar lo que trajeron cuatro personas y repartirlo de nuevo por igual. El promedio es lo que recibiría cada una, conservando el total.',
  'Por eso sumar es solo la primera parte. Sin dividir tendrías el aporte del grupo completo y estarías respondiendo cuánto reunieron, no cuánto corresponde a cada persona.'
 ],'Tres equipos recogen 2, 7 y 9 bolsas de basura. ¿Cuál es el promedio por equipo?',[
  'Sumamos las bolsas: 2 + 7 + 9 = 18. Hay tres equipos, no dieciocho.',
  'Repartimos 18 ÷ 3 = 6 bolsas por equipo. Ninguno recogió exactamente seis, pero ese reparto tendría el mismo total.',
  'Comprobamos: 6 × 3 = 18. El dato central de la lista es 7; eso sería la mediana, una medida diferente.'
 ],'Suma los aportes de todos los grupos y divide por cuántos grupos aportaron.');
 define('Perímetro',[
  'El perímetro mide la longitud total del borde de una figura: sumamos todos sus lados. Su unidad es de longitud, como metros, nunca metros cuadrados.',
  'Un cuadrado tiene cuatro lados iguales, de modo que P = 4l. Un rectángulo tiene dos lados de cada longitud: P = 2 × base + 2 × altura. Multiplicar base por altura calcula área, no borde.'
 ],[
  'Imagina rodear un terreno con una cinta sin cruzar por dentro. Al volver al punto de partida debes haber pasado por todos los lados.',
  'Una suma de largo y ancho solo recorre media vuelta del rectángulo. El área responde cuánto suelo cubres; la cinta responde cuántos metros de borde rodeas.'
 ],'Un huerto de 6 m por 3 m tendrá una cerca, dejando una entrada de 1 m. ¿Cuánta cerca se instala?',[
  'El borde completo mide 6 + 3 + 6 + 3 = 18 m.',
  'La entrada ocupa un metro de ese borde, por lo que se instalan 18 − 1 = 17 m de cerca.',
  'Los 18 m² que resulta de 6 × 3 son superficie del huerto: aunque coincida el número en este ejemplo, no sirven para medir la cerca.'
 ],'Recorre todos los lados del contorno y suma sus longitudes; no uses la fórmula de superficie.');
 define('Lectura y suma de frecuencias',[
  'Una frecuencia cuenta cuántas observaciones pertenecen a una categoría. Para obtener el total de categorías que no se superponen, sumamos sus frecuencias.',
  'Antes de calcular debemos leer qué representa cada etiqueta y la unidad del gráfico o tabla. Una cantidad parcial, una diferencia y un total contestan preguntas distintas.'
 ],[
  'Imagina contar personas por filas sin contar a nadie dos veces. Una fila llena no te dice cuántas personas hay en toda la sala: necesitas reunir todos los grupos.',
  'Si el dibujo usa miles de pesos, una marca de 25 significa veinticinco miles, no veinticinco pesos. Las etiquetas son parte de los datos.'
 ],'En una campaña se reciben 7 cajas el viernes y 11 el sábado; cada caja contiene 4 libros. ¿Cuántos libros llegan?',[
  'Sumamos las cajas de días diferentes: 7 + 11 = 18 cajas.',
  'La pregunta pide libros: cada caja aporta cuatro, de modo que 18 × 4 = 72 libros.',
  'Podemos comprobar contando por día: 7 × 4 + 11 × 4 = 28 + 44 = 72. No debemos confundir la cantidad de grupos con su contenido.'
 ],'Identifica las categorías y sus unidades antes de sumar o convertir la frecuencia que buscas.');
 define('Mediana',[
  'La mediana es el valor central de los datos ordenados de menor a mayor. Deja la mitad de las posiciones a cada lado; no se calcula sumando todos los valores.',
  'Con una cantidad impar de datos, la posición central es (n + 1)/2. Con una cantidad par se promedian los dos datos centrales. La posición no es el valor que se debe responder.'
 ],[
  'Imagina formar una fila por estatura y señalar a la persona que queda al centro. Quien mide muchísimo no cambia por sí solo a quién le toca la posición central.',
  'La media reparte un total; la mediana busca un lugar en una fila ordenada. Son preguntas distintas y por eso un valor extremo puede separarlas mucho.'
 ],'Los atrasos de cinco buses fueron 1, 2, 8, 3 y 26 minutos. ¿Cuál es la mediana?',[
  'Ordenamos primero: 1, 2, 3, 8, 26. Hay cinco datos, así que buscamos la tercera posición.',
  'El dato de esa posición es 3 minutos: quedan dos datos antes y dos después.',
  'El promedio sería (1 + 2 + 3 + 8 + 26)/5 = 40/5 = 8 minutos. No sustituye la mediana: el atraso de 26 afecta mucho esa suma.'
 ],'Ordena y busca la posición central; no confundas esa posición con su dato ni con el promedio del grupo.');
 define('Enteros y cambios',[
  'Los números negativos representan posiciones bajo un punto de referencia, como una deuda o una temperatura bajo cero. Sumar un aumento desplaza hacia valores mayores; restar una disminución hacia menores.',
  'El signo de una cantidad no es su tamaño absoluto. En la recta numérica, lo que queda más a la izquierda es menor: −12 es menor que −3 aunque doce tenga mayor valor absoluto.'
 ],[
  'Piensa en un ascensor: el piso cero es la referencia, subir suma pisos y bajar los resta. Puedes cruzar el cero y seguir hacia un subterráneo sin cambiar la dirección del movimiento.',
  'Una deuda de doce mil te deja con menos saldo que una deuda de tres mil. El signo cuenta en qué lado de la referencia estás y no debe borrarse al calcular.'
 ],'Un ascensor parte en el piso −2, sube 7 pisos y baja 3. ¿Dónde termina?',[
  'Representamos el recorrido con signos: −2 + 7 − 3.',
  'Primero −2 + 7 = 5: cruzó el cero y llegó al quinto piso. Luego 5 − 3 = 2.',
  'El movimiento neto fue subir cuatro pisos. Partir en −2 y subir cuatro también lleva al piso 2. Esto comprueba la dirección de ambos cambios.'
 ],'Marca el punto inicial y conserva el signo de cada cambio: depósito o subida suma, retiro o bajada resta.');
 define('Fracciones y unidad común',[
  'Una fracción a/b representa a partes de un entero dividido en b partes iguales. Para sumar o comparar fracciones debemos expresar partes del mismo tamaño.',
  'Multiplicar numerador y denominador por el mismo número no cambia la cantidad: 1/2 = 2/4. Al sumar fracciones con denominador común sumamos los numeradores y conservamos el denominador.'
 ],[
  'No sumas media pizza y un cuarto contando dos trozos como si fueran iguales. Cortas la media pizza en dos cuartos y ahora tienes tres cuartos iguales.',
  'Para comparar, imagina las barras de la misma longitud divididas en una cuadrícula común. Gana la que cubre más casillas, no la que tiene el número más grande escrito abajo.'
 ],'Una cinta tiene 2/3 de metro y se agrega otra de 1/6 de metro. ¿Cuánto miden juntas?',[
  'Un tercio equivale a dos sextos, así que 2/3 = 4/6. Expresamos ambas longitudes en sextos.',
  'Sumamos 4/6 + 1/6 = 5/6 de metro: contamos cinco partes de tamaño un sexto.',
  'No sumamos los denominadores: 3 y 6 describen el tamaño de las partes. El resultado 5/6 es mayor que 2/3 y menor que un metro, lo que concuerda con agregar una parte pequeña.'
 ],'Construye fracciones equivalentes con la misma unidad de parte antes de sumar o comparar.');
 define('Fracción de una cantidad',[
  'Tomar una fracción de una cantidad significa multiplicarla por esa fracción. La mitad de una cantidad se obtiene dividiéndola por dos, aunque esa cantidad ya sea una fracción.',
  'Al multiplicar a/b por c/d, multiplicamos numeradores entre sí y denominadores entre sí. Tomar la mitad de una cantidad positiva debe producir algo menor, no el doble.'
 ],[
  'Imagina un chocolate que ya está partido: si tienes tres de sus cuatro tiras y debes compartirlas por igual, puedes cortar cada tira en dos.',
  'Cada tira pequeña pasa a ser un octavo de la tableta entera. Tú conservas tres de esas piezas y la otra persona las otras tres: no cambió el tamaño de la tableta original.'
 ],'Una botella contiene 2/3 de litro. Se utiliza la cuarta parte de ese contenido. ¿Cuánto se utiliza?',[
  'No buscamos un cuarto de litro, sino un cuarto de los dos tercios que hay.',
  'Calculamos 1/4 × 2/3 = 2/12 = 1/6 de litro.',
  'Cuatro porciones de 1/6 suman 4/6 = 2/3 de litro, exactamente el contenido disponible. Así verificamos que repartimos la cantidad correcta.'
 ],'Distingue la fracción del entero de la fracción que tomas de lo disponible y multiplica ambas.');
 define('Cambios porcentuales sucesivos',[
  'Cada cambio porcentual usa como base el valor que existe justo antes de ese cambio. Subir p% multiplica por 1 + p/100 y bajar p% multiplica por 1 − p/100.',
  'Subir y bajar el mismo porcentaje no se cancelan porque las bases son distintas. El descenso posterior se calcula sobre una cantidad mayor, de modo que quita más que el aumento inicial.'
 ],[
  'Imagina estirar una banda y luego recortar una parte de la banda ya estirada. La segunda parte se mide sobre una banda distinta: no puedes tratar ambos recortes como si tuvieran el mismo tamaño.',
  'Con cien fichas, agregar veinte da ciento veinte; quitar después una quinta parte de ciento veinte quita veinticuatro. El orden de las cantidades de referencia explica el resultado.'
 ],'Una colonia de 500 bacterias aumenta 50% y después pierde 50% de la población que tiene en ese momento. ¿Cuántas quedan?',[
  'El primer aumento agrega 500 × 0,50 = 250; ahora hay 750 bacterias.',
  'La segunda pérdida es la mitad de 750: se pierden 375 y quedan 750 − 375 = 375.',
  'Comprobamos con factores: 500 × 1,5 × 0,5 = 375. El segundo 50% equivale a 375 individuos y no a los 250 del primer cambio.'
 ],'Actualiza la base después del primer cambio antes de aplicar el segundo; no restes los porcentajes directamente.');
 define('Parte porcentual',[
  'Para calcular p% de un total T usamos T × p/100. El porcentaje es una proporción sin unidad; el resultado conserva la unidad del total, por ejemplo estudiantes.',
  'El 10% es una décima parte y el 30% son tres décimas. Es útil descomponer un porcentaje para comprobar el cálculo sin memorizar una regla aislada.'
 ],[
  'Imagina dividir el curso completo en diez grupos del mismo tamaño. Cada grupo representa 10% y tomar tres de esos grupos representa 30%.',
  'No buscas cuántos puntos de porcentaje dice la etiqueta, sino a cuántas personas corresponde esa parte del curso.'
 ],'De un trayecto de 60 km ya se recorrió el 35%. ¿Cuántos kilómetros se avanzaron?',[
  'El total de referencia son 60 km. Calculamos 35/100 × 60 = 21 km.',
  'Otra manera: 30% de 60 es 18 y 5% de 60 es 3; juntos son 21 km.',
  'Faltan 60 − 21 = 39 km. Recorrido y pendiente suman el total, y 21/60 = 0,35 confirma la proporción.'
 ],'Multiplica el total original por la fracción que representa el porcentaje solicitado.');
 define('Recuperar valor original',[
  'Después de un descuento de p%, el precio final representa (100 − p)% del precio original. Si F es el final y O el original, F = O × (1 − p/100).',
  'Para recuperar O dividimos F por la fracción conservada. Sumar p% al precio rebajado usa una base diferente y no revierte el descuento original.'
 ],[
  'Si una caja está llena a cuatro quintas partes, lo que ves no es la caja completa. Puedes repartir esa cantidad en cuatro partes y agregar una quinta parte del mismo tamaño.',
  'La parte que falta se calcula respecto de la caja original. Por eso agregar una quinta parte de lo que queda no completa necesariamente toda la caja.'
 ],'Un tanque quedó con 36 litros después de consumir el 25% del agua inicial. ¿Cuánta agua tenía?',[
  'Queda el 75% del agua inicial: 0,75 × cantidad inicial = 36.',
  'Dividimos: cantidad inicial = 36/0,75 = 48 litros. También 36 son tres cuartos, por lo que un cuarto son 12 y cuatro cuartos 48.',
  'Verificamos: 25% de 48 son 12 y 48 − 12 = 36. Agregar 25% de 36 daría 45, una cantidad que no pasa esta comprobación.'
 ],'Identifica qué fracción del original quedó y divide el valor conocido por esa fracción.');
 define('Producto de potencias',[
  'Una potencia de exponente natural es un producto de factores iguales. En un producto de potencias con la misma base, todos los factores siguen siendo iguales y podemos contarlos juntos.',
  'Por eso aᵐ × aⁿ = aᵐ⁺ⁿ. La base no cambia y los exponentes se suman. Multiplicar exponentes corresponde a una potencia de otra potencia, que es una operación diferente.'
 ],[
  'Imagina dos cadenas hechas con el mismo tipo de eslabón. Al unirlas no cambias el tipo de eslabón: cuentas los eslabones de ambas cadenas.',
  'La base dice de qué están hechos los factores y el exponente cuenta cuántos son. Multiplicar las bases y sumar los exponentes a la vez contaría otra cadena.'
 ],'Una cuadrícula tiene 5² filas y en cada fila hay 5³ puntos. Expresa el total como una potencia.',[
  'El total se obtiene multiplicando filas por puntos por fila: 5² × 5³.',
  'Al escribir todos los factores obtenemos (5 × 5) × (5 × 5 × 5): son cinco factores iguales a cinco.',
  'El total es 5⁵ = 3.125 puntos. No es 5⁶, que tendría un factor adicional, ni 25⁵, que cambiaría cada factor.'
 ],'Expande mentalmente los factores de la misma base y cuéntalos: conserva la base y suma los exponentes.');
 define('Exponente negativo',[
  'Un exponente negativo indica el recíproco de una potencia: a⁻ⁿ = 1/aⁿ, con a distinto de cero. No indica que el resultado deba ser negativo.',
  'La regla mantiene el patrón de las potencias: al reducir el exponente en uno dividimos por la base. Con base 2: 2¹ = 2, 2⁰ = 1, 2⁻¹ = 1/2 y 2⁻² = 1/4.'
 ],[
  'Piensa en retroceder por una escalera donde cada peldaño hacia adelante duplica la cantidad. Hacia atrás la reduces a la mitad; no saltas a una cantidad con signo menos.',
  'El menos está en la altura de la escalera, el exponente, no delante del resultado. Puedes obtener una fracción positiva muy pequeña.'
 ],'Una señal conserva una décima parte de su intensidad en cada filtro. Después de tres filtros, ¿qué fracción conserva?',[
  'Cada filtro multiplica por 1/10. Tres filtros producen (1/10) × (1/10) × (1/10).',
  'El resultado es 1/1.000 = 10⁻³: una fracción positiva, no −1.000.',
  'Al multiplicar 10⁻³ por 10³ obtenemos 1. Esa comprobación muestra la relación de recíprocos.'
 ],'Calcula primero la potencia positiva y colócala en el denominador; comprueba que su producto con la potencia original sea uno.');
 define('Raíces',[
  'La raíz cuadrada principal de un número no negativo es el número no negativo cuyo cuadrado lo produce. La raíz cúbica busca el número cuyo producto por sí mismo tres veces da el valor original.',
  'Simplificar una raíz cuadrada consiste en separar factores que sean cuadrados perfectos: √(a²b) = |a|√b. No dividimos el número por dos ni sacamos fuera un factor sin obtener su raíz.'
 ],[
  'Si conoces cuántas baldosas cuadradas forman un tablero cuadrado, la raíz descubre cuántas hay en cada borde. Si conoces los cubitos de un cubo, la raíz cúbica descubre cuántos hay en una arista.',
  'Para simplificar una raíz, busca paquetes que ya formen cuadrados completos. Su lado puede salir de la raíz; las piezas que no forman ese cuadrado se quedan dentro.'
 ],'Un tablero cuadrado tiene 72 cm² de superficie. ¿Cuál es la longitud exacta de su lado?',[
  'Si l es el lado, l² = 72. Como una longitud es no negativa, l = √72.',
  'Descomponemos 72 = 36 × 2. El factor 36 es el cuadrado perfecto de 6: √72 = 6√2 cm.',
  'Comprobamos elevando al cuadrado: (6√2)² = 36 × 2 = 72. No sería 36√2 porque su cuadrado resultaría mucho mayor.'
 ],'Identifica si debes invertir un cuadrado o un cubo; en una simplificación extrae la raíz del factor perfecto y comprueba elevando el resultado.');
 define('Productos algebraicos',[
  'La propiedad distributiva dice a(b + c) = ab + ac: un factor fuera del paréntesis multiplica a cada término interior. Una expresión al cuadrado significa multiplicarla por sí misma.',
  'En (x + a)² aparecen cuatro productos: x², ax, ax y a². Los dos términos del medio se suman. Factorizar hace el camino inverso: expresa una suma o diferencia como un producto.'
 ],[
  'Imagina ampliar un patio cuadrado agregando una franja a cada lado. Aparecen el cuadrado original, dos franjas y una esquina nueva: olvidar una franja es olvidar uno de los productos cruzados.',
  'Los paréntesis son paquetes completos. Al multiplicar dos paquetes debes combinar cada parte del primero con cada parte del segundo, sin saltarte ninguna.'
 ],'Un cuadrado tiene lado t + 2. ¿Cómo se expresa su área sin paréntesis?',[
  'El área es (t + 2)(t + 2), porque multiplicamos el lado por sí mismo.',
  'Distribuimos: t·t + t·2 + 2·t + 2·2 = t² + 2t + 2t + 4.',
  'Agrupamos los dos términos 2t y resulta t² + 4t + 4. Para t = 3, ambas formas dan 25; t² + 4 daría 13 y omitiría las franjas.'
 ],'Escribe los productos de cada término y comprueba que al desarrollar o factorizar reaparezca exactamente la expresión original.');
 define('Términos semejantes',[
  'Los términos semejantes tienen las mismas letras elevadas a los mismos exponentes. Solo sus coeficientes, los números que multiplican esas letras, se suman o restan.',
  'La letra conserva su significado: 3x − x = (3 − 1)x. Sumar cantidades diferentes como x e y no las convierte en un producto xy.'
 ],[
  'Es como ordenar compras: tres manzanas menos una dejan dos manzanas; dos peras más cuatro dejan seis peras. Las frutas distintas no se fusionan al juntarlas.',
  'Las letras son etiquetas de cantidades. Cuenta por separado lo que lleva la etiqueta x y lo que lleva la etiqueta y, respetando el signo de cada aporte.'
 ],'Una bodega recibe 5 cajas de tipo a y 3 de tipo b; devuelve 2 cajas a y recibe otra b. ¿Cómo queda el registro?',[
  'El registro es 5a + 3b − 2a + b. La devolución se escribe con signo menos.',
  'Agrupamos el tipo a: 5a − 2a = 3a. Agrupamos b: 3b + b = 4b.',
  'Queda 3a + 4b. Si a = 10 unidades y b = 2, el registro inicial y el simplificado valen ambos 38; 7ab daría otra cantidad.'
 ],'Agrupa solo los términos de la misma especie y suma sus coeficientes conservando letras y signos.');
 define('Sustitución con signos',[
  'Evaluar una expresión significa reemplazar cada letra por el valor indicado, usando paréntesis si es negativo. Luego aplicamos la prioridad de operaciones: potencias, productos y finalmente sumas o restas.',
  'Un producto de dos números negativos es positivo. Restar un número negativo equivale a sumar su opuesto; no se debe perder el signo del valor sustituido.'
 ],[
  'Piensa en una receta con casilleros: en cada casillero va el valor completo, incluido el signo. El paréntesis lo mantiene junto para que no cambie la operación que lo rodea.',
  'Quitar una deuda mejora tu saldo: esa idea ayuda a recordar por qué restar una cantidad negativa puede aumentar el resultado.'
 ],'Una regla calcula el puntaje P = u² − 3v. Si u = −2 y v = −4, ¿cuánto vale P?',[
  'Sustituimos con paréntesis: P = (−2)² − 3(−4).',
  'La potencia da (−2)(−2) = 4 y el producto 3(−4) = −12.',
  'Entonces P = 4 − (−12) = 16. Es distinto de −4 − 12: el cuadrado incluye el signo y la resta cambia el signo del producto negativo.'
 ],'Sustituye valores completos entre paréntesis antes de calcular, y separa el producto negativo de la resta que lo precede.');
 define('Proporción inversa',[
  'Cuando un trabajo fijo se reparte entre personas de igual rendimiento que pueden trabajar simultáneamente, aumentar las personas reduce el tiempo. Personas × horas se mantiene constante.',
  'La unidad persona-hora mide una cantidad de trabajo bajo ese supuesto. Primero calculamos el trabajo total y luego dividimos por el nuevo número de personas; no conservamos el cociente de una proporción directa.'
 ],[
  'Imagina repartir la misma montaña de sobres entre más personas. Hay menos sobres por persona, por lo que cada una termina antes si todas tienen el mismo ritmo.',
  'El tamaño de la montaña no cambió. Si duplicas las manos disponibles, cada una se queda con la mitad del trabajo, siempre que puedan colaborar sin estorbarse.'
 ],'Cuatro bombas iguales vacían un depósito en 9 horas. ¿Cuánto tardan seis bombas con el mismo caudal constante?',[
  'El trabajo del depósito equivale a 4 × 9 = 36 bomba-horas.',
  'Con seis bombas simultáneas, tiempo = 36/6 = 6 horas.',
  'Comprobamos 6 × 6 = 36. El tiempo baja al agregar bombas, como esperamos. El modelo supone que cada bomba mantiene su caudal y que el depósito es el mismo.'
 ],'Conserva el trabajo total, no el cociente: multiplica personas por tiempo y reparte ese trabajo entre las nuevas personas.');
 const rows={};
 const add=(id,key,aim,application,check,wrong)=>rows[id]={key,aim,application,check,wrong};
 add(1,'Descuento porcentual','Buscamos cuánto se paga por la chaqueta, después de quitar el 25% de $40.000.', ['La base es $40.000. Escribimos 25% = 25/100 = 1/4.','El descuento es 40.000/4 = $10.000. Eso es lo que ahorras.','Restamos el ahorro al precio: 40.000 − 10.000 = $30.000.'], 'Pagas tres cuartos: 30.000/40.000 = 0,75. Los $30.000 pagados más $10.000 ahorrados recuperan el precio original.', ['10.000 es el descuento, no el precio final.','25.000 confunde el porcentaje escrito con una cantidad de pesos; descontaría $15.000, que es 37,5%.',null,'35.000 solo quita $5.000, un 12,5%, no un 25%.']);
 add(2,'Ecuación lineal','Hay que encontrar un número que, triplicado y aumentado en cinco, dé veinte.',['La igualdad es 3x + 5 = 20. Quitamos cinco en ambos lados: 3x = 15.','Quince corresponde a tres veces x. Dividimos ambos lados por tres: x = 5.','Sustituimos: 3 × 5 + 5 = 15 + 5 = 20.'], 'El valor 5 satisface la igualdad original, no solo una de sus operaciones.', ['Con x = 3, el lado izquierdo vale 9 + 5 = 14, no 20; no se puede elegir el coeficiente como solución.',null,'Con x = 7, 3 × 7 + 5 = 26, no 20. Primero resta cinco en ambos lados y luego divide por tres.','15 es el valor de 3x después de restar cinco; todavía debes dividirlo entre tres.']);
 add(3,'Proporción directa','Queremos el costo de seis cuadernos conservando el mismo precio por cuaderno.',['Cuatro cuadernos cuestan $6.000: uno cuesta 6.000/4 = $1.500.','Seis cuadernos cuestan 6 × 1.500 = $9.000.','También seis son 1,5 veces cuatro: 6.000 × 1,5 = 9.000.'], '9.000/6 = 1.500 pesos por cuaderno, igual que al principio.', ['8.000 daría 8.000/6 pesos por cuaderno, diferente de $1.500. Sumar dos mil por dos cuadernos inventa un precio unitario. ',null,'10.000 implica más de $1.500 por cuaderno: no conserva el precio unitario.','12.000 duplica el costo de cuatro y compraría ocho cuadernos, no seis.']);
 add(4,'Potencias y operaciones','Debemos sumar dos potencias; los exponentes no son factores externos.',['Desarrollamos 2³ = 2 × 2 × 2 = 8.','Desarrollamos 3² = 3 × 3 = 9.','La operación entre los bloques es suma: 8 + 9 = 17.'], '17 se obtiene de dos productos independientes. Ni 2 × 3 ni sumar las bases respeta lo escrito.', ['12 resulta si haces 2 × 3 + 3 × 2; eso confunde elevar con multiplicar por el exponente.','13 no coincide con la suma de 8 y 9; vuelve a desarrollar cada potencia antes de sumar.',null,'25 sería 5², pero 2³ + 3² no es (2 + 3)².']);
 add(5,'Probabilidad simple','Buscamos qué fracción de todas las bolitas corresponde a azules.',['Hay 3 + 2 = 5 bolitas posibles. Suponemos extracción al azar con iguales posibilidades por bolita.','Las favorables son las dos azules.','La probabilidad es 2/5.'], '2/5 + 3/5 = 1: azul y roja cubren todas las posibilidades.', ['2/3 compara azules con rojas, no con las cinco bolitas totales.',null,'3/5 es la probabilidad de roja, una condición distinta.','Dos colores no significan mitades: hay cantidades distintas de bolitas por color.']);
 add(101,'Descuento porcentual','Buscamos el precio que queda del polerón de $30.000 tras rebajar un 20%.',['20% = 20/100 = 0,20. El ahorro es 30.000 × 0,20 = $6.000.','El precio final es 30.000 − 6.000 = $24.000.','También queda 80%: 30.000 × 0,80 = $24.000.'], '24.000 + 6.000 = 30.000 y el ahorro representa una quinta parte del original.', ['6.000 es lo que ahorras; todavía debes restarlo del precio inicial.',null,'26.000 quita $4.000, que no corresponde al 20% de $30.000.','28.000 quita $2.000; un 20% no equivale a dos mil pesos independientemente del precio.']);
 add(102,'Ecuación lineal','Hay que encontrar x sabiendo que cuatro veces x, menos ocho, vale veinte.',['Partimos de 4x − 8 = 20. Sumamos ocho en ambos lados: 4x = 28.','Dividimos ambos lados por cuatro: x = 7.','Reponemos: 4 × 7 − 8 = 28 − 8 = 20.'], 'El signo menos ocho se deshace sumando ocho, conservando la igualdad.', ['3 resulta de hacer (20 − 8)/4: se restó ocho donde correspondía sumarlo.','5 da 4 × 5 − 8 = 12; dividir veinte por cuatro ignora el ocho que se resta.',null,'12 da 4 × 12 − 8 = 40, no 20. Prueba la alternativa en la igualdad antes de aceptarla.']);
 add(103,'Proporción directa','Queremos comprar cinco entradas manteniendo el costo unitario de las tres conocidas.',['Una entrada cuesta 12.000/3 = $4.000.','Cinco cuestan 5 × 4.000 = $20.000.','La cantidad aumenta por un factor 5/3, igual que el precio total.'], '20.000/5 = 4.000, la misma razón que 12.000/3.', ['15.000 supondría $3.000 por entrada, diferente del dato inicial.','18.000 supondría $3.600 por entrada, diferente del dato inicial.',null,'24.000 alcanza para seis entradas de $4.000, no cinco.']);
 add(104,'Variación porcentual','Necesitamos el aumento como porcentaje del precio original de $50.000.',['Primero aislamos el aumento: 60.000 − 50.000 = $10.000.','La fracción de aumento es 10.000/50.000 = 1/5 = 0,20.','Multiplicamos por cien: 20%.'], '20% de 50.000 son 10.000 y al sumarlos se recuperan $60.000.', ['10% confunde diez mil pesos con diez de cada cien: 10% de 50.000 son solo 5.000.','15% de 50.000 son 7.500, insuficientes para llegar a 60.000.',null,'25% de 50.000 son 12.500 y llevarían a 62.500.']);
 add(105,'Probabilidad simple','Hay que contar las caras pares de un dado de seis caras igualmente probables.',['Los resultados posibles son 1, 2, 3, 4, 5 y 6.','Los pares son 2, 4 y 6: tres favorables.','P(par) = 3/6 = 1/2, al dividir numerador y denominador por tres.'], 'Hay tres pares y tres impares; ambas probabilidades son 1/2 y suman uno.', ['1/6 sirve para una cara específica, pero aquí sirven tres.','1/3 equivale a 2/6 y solo contaría dos caras favorables.',null,'2/3 equivale a 4/6 y contaría cuatro caras; solo tres son pares.']);
 add(106,'Área rectangular','Buscamos superficie del rectángulo de 8 por 5 cm, no el borde.',['Podemos imaginar cinco filas con ocho cuadrados de un centímetro cuadrado.','A = base × altura = 8 × 5 = 40.','La unidad es cm² porque multiplicamos cm por cm.'], 'Cuarenta cuadrados de 1 cm² cubren la superficie; 26 cm sería el perímetro.', ['13 suma largo y ancho; no cuenta cuadrados de superficie.','26 es 2 × (8 + 5), el perímetro, que se mide en cm y no cm².',null,'80 duplica el área: ocho por cinco ya cuenta todo el rectángulo una vez.']);
 add(107,'Área triangular','La base es 10 cm y la altura perpendicular 6 cm; buscamos su superficie.',['El paralelogramo de referencia tiene área 10 × 6 = 60 cm².','El triángulo ocupa la mitad: 60/2 = 30 cm².','La altura debe ser perpendicular a la base, como indica el enunciado.'], 'Dos triángulos iguales suman 60 cm²; uno ocupa 30 cm².', ['16 suma base y altura, una operación de longitudes que no calcula superficie.',null,'60 omite la mitad y corresponde al paralelogramo de referencia.','120 duplica el producto; el triángulo requiere dividirlo entre dos.']);
 add(108,'Moda','Buscamos la nota que más se repite, no la mayor ni el total de notas.',['En 4, 5, 6, 5, 5, la nota 4 aparece una vez.','La nota 5 aparece tres veces y la nota 6 una vez.','La mayor frecuencia corresponde al valor 5: esa es la moda.'], 'La frecuencia ganadora es tres, pero la nota que se responde es cinco.', ['4 solo aparece una vez, menos que las tres apariciones de 5.',null,'6 es la nota más alta, pero aparece una sola vez.','25 es la suma de las notas: 4 + 5 + 6 + 5 + 5 = 25. Esa operación no busca repeticiones y su total no es una nota observada.']);
 add(109,'Media aritmética','Queremos repartir equitativamente los minutos de los cuatro estudiantes.',['Sumamos 20 + 30 + 40 + 50 = 140 minutos.','Hay cuatro estudiantes; el promedio es 140/4 = 35 minutos.','El resultado puede quedar entre dos datos y no aparecer en la lista.'], 'Si cada estudiante estudiara 35 minutos, sumarían 4 × 35 = 140, el mismo total.', ['30 es uno de los datos, pero cuatro grupos de 30 sumarían 120, no 140.',null,'40 es otro dato; cuatro grupos de 40 sumarían 160, demasiado.','140 es la suma total del grupo; falta dividir por cuatro estudiantes.']);
 add(110,'Perímetro','La plaza es cuadrada de lado 7 m; queremos recorrer su borde completo.',['Un cuadrado tiene cuatro lados de igual longitud.','Sumamos 7 + 7 + 7 + 7 = 28 m.','La multiplicación equivalente es 4 × 7 = 28.'], 'La unidad m corresponde a un recorrido. Los 49 m² serían superficie.', ['14 suma solo dos de los cuatro lados.','21 suma tres lados y deja uno sin contar.',null,'49 es 7 × 7, la superficie de la plaza; no mide el contorno.']);
 add(111,'Lectura y suma de frecuencias','Necesitamos reunir a las personas de los tres medios de transporte, sin repetirlas.',['Leemos 8 caminando, 12 en bus y 5 en bicicleta como categorías separadas del registro.','Primero 8 + 12 = 20; luego 20 + 5 = 25.','El total encuestado representado es 25 estudiantes.'], 'Las tres cantidades son personas: sumarlas conserva esa unidad.', ['12 solo cuenta quienes van en bus.','20 reúne caminantes y pasajeros del bus, pero deja fuera las cinco bicicletas.',null,'30 excede la suma de las tres categorías; no hay cinco estudiantes adicionales en los datos.']);
 add(112,'Variación porcentual','Hay que comparar el alza de la entrada con sus $8.000 originales.',['El aumento absoluto es 10.000 − 8.000 = $2.000.','Comparamos con la base inicial: 2.000/8.000 = 1/4 = 0,25.','Expresamos como porcentaje: 25%.'], 'Un cuarto de $8.000 son $2.000; precio original más ese aumento da $10.000.', ['20% divide el aumento por el precio final de 10.000, una base distinta.',null,'80% compara 8.000 con 10.000 y no mide el aumento respecto del original.','125% es 10.000/8.000 × 100: incluye el 100% original. El aumento es lo que sobra de ese 100%.']);
 add(113,'Ecuación lineal','El total de $4.350 incluye un cargo fijo de $1.200 y $450 por cada kilómetro.',['Si k es la cantidad de kilómetros, 1.200 + 450k = 4.350.','Restamos el cargo fijo en ambos lados: 450k = 3.150.','Dividimos por 450: k = 7 kilómetros.'], '1.200 + 450 × 7 = 1.200 + 3.150 = $4.350; el precio coincide.', ['Cinco kilómetros costarían 1.200 + 2.250 = 3.450, menos de lo pagado.',null,'Nueve kilómetros costarían 1.200 + 4.050 = 5.250, no 4.350. Quita primero el cargo fijo, luego divide el resto.','Doce kilómetros costarían 1.200 + 5.400 = 6.600, muy por encima del total.']);
 add(114,'Área rectangular','Debemos pavimentar el patio excluyendo la superficie del jardín.',['El patio completo tiene 12 × 8 = 96 m².','El jardín cuadrado ocupa 3 × 3 = 9 m², no solo 3 m².','Restamos las superficies: 96 − 9 = 87 m².'], 'Pavimento 87 más jardín 9 suman los 96 m² del patio completo.', [null,'93 resta el lado 3 a un área 96; mezcla metros con metros cuadrados.','96 es la superficie completa y todavía incluye el jardín.','105 suma el jardín al patio, aunque ya estaba dentro y se debe excluir.']);
 add(115,'Mediana','Los cinco tiempos están ordenados; buscamos el valor de la tercera posición.',['Hay cinco datos: 8, 10, 12, 15 y 40.','La posición central es (5 + 1)/2 = 3.','El tercer dato es 12 minutos; quedan dos tiempos menores y dos mayores.'], 'El dato extremo de 40 minutos no cambia la posición central. El promedio sería 85/5 = 17.', ['10 es el segundo dato, no el central.',null,'17 es el promedio de la suma 85 entre cinco; no la mediana.','40 es el tiempo máximo, no el central.']);
 add(200,'Enteros y cambios','Hay que seguir una temperatura inicial de 4 °C, una bajada de nueve y una subida de tres.',['Escribimos los cambios: 4 − 9 + 3.','Después de bajar nueve: 4 − 9 = −5 °C.','Después de subir tres: −5 + 3 = −2 °C.'], 'El cambio neto es −6 °C: 4 − 6 = −2 °C. Subir desde −5 hacia cero aumenta la temperatura.', ['−8 corresponde a restar tres a −5; la última variación era una subida, por lo que se suma.',null,'2 borra el signo del resultado; todavía faltan dos grados para llegar a cero.','16 suma ambas variaciones como si fueran subidas: 4 + 9 + 3.']);
 add(201,'Enteros y cambios','Buscamos el número situado más a la izquierda entre −3, −12, 0 y 5.',['Los negativos quedan antes que cero y que los positivos.','Entre negativos, −12 está doce unidades bajo cero y −3 solo tres.','El orden es −12 < −3 < 0 < 5; el menor es −12.'], 'Doce grados bajo cero es menor temperatura que tres bajo cero: importa el signo, no solo la cifra.', ['−3 es negativo, pero queda a la derecha de −12 en la recta numérica.',null,'0 es mayor que los dos números negativos.','5 es el máximo de la lista, no el menor.']);
 add(202,'Enteros y cambios','La cuenta parte con deuda de $5.000; un depósito suma y un retiro resta.',['Representamos el saldo: −5.000 + 13.000 − 2.000.','El depósito primero cubre la deuda y deja −5.000 + 13.000 = $8.000.','El retiro reduce ese saldo: 8.000 − 2.000 = $6.000.'], 'El depósito neto tras retirar es 11.000; menos la deuda inicial 5.000 quedan 6.000.', [null,'10.000 no coincide con ninguno de los cambios: después de cubrir la deuda quedan 8.000 y el retiro los reduce a 6.000. No puede aumentar a 10.000.','−6.000 invierte el signo del saldo: el depósito sí alcanza para cubrir la deuda y el retiro.','16.000 supera incluso el depósito recibido: trata la deuda o el retiro como ingresos, cuando ambos reducen el saldo.']);
 add(203,'Fracciones y unidad común','Vamos a sumar una mitad y un cuarto del mismo entero.',['Convertimos la mitad a cuartos: 1/2 = 2/4.','Ahora las partes tienen igual tamaño: 2/4 + 1/4 = 3/4.','Conservamos el denominador cuatro porque seguimos contando cuartos.'], '3/4 es mayor que 1/2 y menor que uno; coincide con agregar un cuarto a una mitad.', ['2/6 suma los denominadores: cambia el tamaño de las partes y da menos que la mitad inicial.','2/4 conserva el cuatro sin convertir antes la mitad a dos cuartos.',null,'1/8 es el producto 1/2 × 1/4; la operación pedida era una suma.']);
 add(204,'Fracción de una cantidad','Queremos la mitad de tres cuartos de taza, no la mitad de una taza entera.',['Escribimos 1/2 × 3/4.','Multiplicamos numeradores 1 × 3 = 3 y denominadores 2 × 4 = 8.','La porción es 3/8 de taza.'], 'Dos porciones de 3/8 suman 6/8 = 3/4, la receta original.', [null,'3/6 = 1/2 taza y dos de esas porciones sumarían una taza, más que los tres cuartos disponibles.','3/2 duplica tres cuartos en vez de reducirlos a la mitad.','1/4 no es la mitad de 3/4: dos cuartos solo suman media taza.']);
 add(205,'Fracciones y unidad común','Hay que comparar las cuatro fracciones usando partes de igual tamaño.',['Un denominador común para 5, 3, 9 y 2 es 90.','Convertimos: 3/5 = 54/90; 2/3 = 60/90; 5/9 = 50/90; 1/2 = 45/90.','El mayor numerador es 60, por lo tanto gana 2/3.'], 'La comparación incluye las cuatro alternativas; no basta enfrentar solo dos.', ['3/5 ocupa 54 de 90 partes, menos que las 60 de 2/3.',null,'5/9 tiene numerador mayor, pero sus partes son menores; equivale a 50/90.','1/2 equivale a 45/90, la menor de las cuatro cantidades.']);
 add(206,'Cambios porcentuales sucesivos','Debemos aplicar una subida y una bajada del 10% usando la base correspondiente en cada momento.',['La subida es 10% de 20.000 = 2.000; el nuevo precio es $22.000.','La bajada es 10% de 22.000 = 2.200.','Restamos: 22.000 − 2.200 = $19.800.'], '20.000 × 1,10 × 0,90 = 19.800. La bajada quita 200 pesos más de lo que agregó la subida.', ['20.000 supone que ambos porcentajes se cancelan, pero se calculan sobre bases distintas.',null,'18.000 aplica solamente una rebaja del 10% al original y omite la subida.','22.000 aplica la subida y omite por completo la rebaja posterior.']);
 add(207,'Parte porcentual','Buscamos cuántos estudiantes representa el 30% del total de 240.',['30% = 30/100 = 3/10.','Una décima parte de 240 es 24 estudiantes.','Tres décimas partes son 3 × 24 = 72 estudiantes.'], '72/240 = 0,30. Quedan 168 que no están en esa categoría y ambas cantidades suman 240.', ['24 es el 10%, una décima parte en lugar de tres.','60 es 240/4, es decir 25%, no 30%.',null,'80 es 240/3, una tercera parte cercana al 33,3%, distinta de 30%.']);
 add(208,'Recuperar valor original','El precio conocido de $16.000 representa el 80% que queda tras descontar un 20%.',['Si O es el original: 0,80 × O = 16.000.','Dividimos ambos lados por 0,80: O = 16.000/0,80 = $20.000.','El descuento original fue 20% de 20.000 = $4.000.'], '20.000 − 4.000 = 16.000. El original debe ser mayor que el precio rebajado.', ['12.800 aplica otro descuento del 20% a 16.000 en lugar de recuperar el precio anterior.','18.000 tendría descuento de 3.600 y precio final 14.400: no pasa la comprobación.','19.200 suma 20% de 16.000, pero usa como base el precio rebajado; descontarle 20% da 15.360.',null]);
 add(209,'Producto de potencias','Queremos expresar el producto de dos potencias de base dos como una sola potencia.',['2³ aporta tres factores 2 y 2² aporta dos.','El producto contiene cinco factores: 2 × 2 × 2 × 2 × 2.','Conservamos la base y sumamos exponentes: 2³ × 2² = 2⁵.'], '8 × 4 = 32 y 2⁵ = 32, ambas formas coinciden.', [null,'2⁶ multiplica los exponentes como si fuera (2³)²; aquí se multiplican dos potencias separadas.','4⁵ cambia indebidamente la base; los factores originales son dos, no cuatro.','2¹ resta exponentes, regla que corresponde a dividir potencias de la misma base.']);
 add(210,'Exponente negativo','El menos en el exponente pide el recíproco de 2³, no un número con signo negativo.',['Calculamos 2³ = 2 × 2 × 2 = 8.','Aplicamos la definición: 2⁻³ = 1/2³ = 1/8.','El resultado es positivo porque la base y su recíproco son positivos.'], '2⁻³ × 2³ = (1/8) × 8 = 1.', ['−8 convierte el signo del exponente en signo del resultado, sin tomar el recíproco.','−1/8 toma el recíproco pero agrega un signo negativo que no corresponde.',null,'8 ignora el signo del exponente: es 2³, no 2⁻³.']);
 add(211,'Raíces','Buscamos el número no negativo cuyo cuadrado es 144.',['La raíz cuadrada invierte el producto de un número por sí mismo.','Probamos 12 × 12 = 144, por lo tanto √144 = 12.','El símbolo √ designa la raíz principal no negativa; no se responde ±12 en esta expresión.'], '12² = 144, mientras que 11² = 121 y 24² = 576.', ['11 al cuadrado da 121, no 144.',null,'24 al cuadrado da 576; una raíz no es un múltiplo elegido del radicando.','72 es la mitad de 144; dividir entre dos no invierte elevar al cuadrado.']);
 add(212,'Raíces','La raíz cúbica pide un número que multiplicado tres veces por sí mismo dé 125.',['Probamos 5 × 5 = 25.','Multiplicamos una vez más por cinco: 25 × 5 = 125.','Entonces ∛125 = 5.'], 'La comprobación usa un cubo: 5³ = 125, no un cuadrado.', ['4³ = 64, insuficiente para producir 125.',null,'10³ = 1.000, no 125.','25 es 5², pero 25³ no da 125. La raíz cúbica devuelve el factor repetido, cinco.']);
 add(213,'Raíces','Queremos extraer de √50 un factor que sea un cuadrado perfecto.',['Descomponemos 50 = 25 × 2.','Como √25 = 5, √50 = √25 × √2 = 5√2.','El dos permanece dentro porque no contiene otro factor cuadrado perfecto mayor que uno.'], '(5√2)² = 25 × 2 = 50: la expresión conserva el valor.', ['25√2 saca el 25 sin obtener su raíz; al cuadrarlo resultaría 1.250.','10√5 al cuadrado da 100 × 5 = 500, no 50.','2√25 vale 10 y al cuadrado da 100, no 50.',null]);
 add(214,'Productos algebraicos','Hay que desarrollar el producto completo (x + 3)(x + 3).',['Distribuimos cada término: x·x + x·3 + 3·x + 3·3.','Obtenemos x² + 3x + 3x + 9.','Agrupamos los términos semejantes: x² + 6x + 9.'], 'Con x = 1 el original vale 4² = 16; la expresión correcta también da 1 + 6 + 9 = 16.', ['x² + 9 omite ambos productos cruzados 3x.',null,'x² + 3x + 9 conserva solo uno de los dos productos cruzados.','2x + 6 duplica la suma: elevar al cuadrado exige multiplicar la expresión por sí misma.']);
 add(215,'Productos algebraicos','Buscamos dos factores cuyo producto reconstruya x² − 16.',['16 = 4², de modo que tenemos una diferencia de cuadrados.','Probamos (x − 4)(x + 4) = x² + 4x − 4x − 16.','Los términos +4x y −4x se cancelan; queda x² − 16.'], 'La cancelación de los términos lineales es esencial: el original no contiene un término en x.', [null,'(x − 8)(x + 2) desarrolla x² − 6x − 16: agrega un término −6x.','(x − 4)² desarrolla x² − 8x + 16; no tiene los signos ni el término lineal del original.','(x − 16)(x + 1) da x² − 15x − 16: el término −15x no aparece en el original.']);
 add(216,'Términos semejantes','Vamos a reunir por separado las cantidades de x y de y.',['Agrupamos 3x − x = (3 − 1)x = 2x.','Agrupamos 2y + 4y = (2 + 4)y = 6y.','La expresión queda 2x + 6y; no se puede fusionar la x con la y.'], 'Para x = 1 e y = 1, original y resultado dan ocho; además cada coeficiente conserva su especie.', [null,'4x suma 3x + x y pierde el signo menos que precede a x.','2y no reúne correctamente 2y + 4y, que son 6y.','8xy transforma una suma de dos especies en un producto. Con x = 2 e y = 1 daría 16, mientras el original da 10.']);
 add(217,'Sustitución con signos','Reemplazaremos a por 2 y b por −3, conservando el signo negativo de b.',['Escribimos a² − 2b = 2² − 2(−3).','La potencia da 4 y el producto 2(−3) da −6.','Restamos el producto completo: 4 − (−6) = 4 + 6 = 10.'], 'Restar dos veces un número negativo aumenta el valor; no convierte el cuatro en negativo.', ['−2 resulta de 4 − 6: se perdió el signo negativo de b.','1 no respeta ni el cuadrado de a ni el producto 2b; calcula por separado 4 y −6 antes de restarlos.',null,'14 no es 4 + 6; al sustituir a = 2, su cuadrado es cuatro, no ocho.']);
 add(218,'Proporción inversa','El mismo muro se reparte entre el doble de personas con igual rendimiento.',['El trabajo fijo equivale a 6 × 8 = 48 persona-horas.','Con doce personas, tiempo = 48/12 = 4 horas.','La cantidad de personas se duplicó, por lo que el tiempo se redujo a la mitad.'], '12 × 4 = 48, igual que 6 × 8. Esto supone colaboración simultánea al mismo ritmo.', [null,'6 horas con doce personas implicaría 72 persona-horas, más trabajo que el muro original.','8 horas conserva el tiempo pese a duplicar el equipo, contrario al modelo de trabajo compartido.','16 horas aplica proporción directa: más personas no deberían tardar el doble para este mismo trabajo.']);
 add(219,'Proporción directa','Todos los panes son iguales, así que la harina por pan debe mantenerse constante.',['Cada pan requiere 600/15 = 40 g de harina.','Veinticinco panes requieren 25 × 40 = 1.000 g.','También son diez panes más: agregan 10 × 40 = 400 g a los 600 iniciales.'], '1.000/25 = 40 g por pan, igual que 600/15.', ['750 g para 25 panes daría 30 g por pan; cambia la receta.','900 g para 25 daría 36 g por pan, menos de los 40 necesarios.',null,'1.200 g duplica la harina y corresponde a treinta panes, no veinticinco.']);
 define('Escala y semejanza',[
  'Una escala 1:n conserva una razón entre longitudes: una unidad en el dibujo corresponde a n de la misma unidad en la realidad. Antes de convertir unidades, multiplicamos por el factor de escala.',
  'En figuras semejantes los lados correspondientes se multiplican por un mismo factor k. Las longitudes cambian por k, las áreas por k² y los volúmenes por k³. Identifica qué magnitud pide la pregunta.'
 ],[
  'Un plano es una foto reducida con una regla de correspondencia. Cada pequeño tramo representa siempre la misma cantidad de longitud real: las unidades no cambian por sí solas.',
  'Al ampliar una foto al triple, hay tres veces más ancho y tres veces más alto. Por eso ocupa nueve veces más papel, aunque cada borde solo se triplique.'
 ],'Una fotografía de 4 cm por 6 cm se amplía para que el lado de 4 cm mida 10 cm. ¿Qué ocurre con el otro lado y con el área?',[
  'El factor de longitudes es k = 10/4 = 2,5. El otro lado pasa de 6 a 6 × 2,5 = 15 cm.',
  'El área inicial es 4 × 6 = 24 cm² y la nueva 10 × 15 = 150 cm².',
  'La razón de áreas es 150/24 = 6,25 = 2,5². La razón de longitudes y la razón de áreas son diferentes porque el área cambia en dos direcciones.'
 ],'Encuentra el factor entre lados correspondientes, conserva las unidades y distingue longitud de área.');
 define('Inecuaciones',[
  'Una inecuación describe valores que cumplen una comparación, no necesariamente un único número. El signo < significa menor que y > mayor que; si son estrictos, el extremo no está incluido.',
  'Sumar o restar lo mismo a ambos lados conserva el orden. Multiplicar o dividir por un positivo también; hacerlo por un negativo invierte el orden. Por ejemplo, 2 < 5 pero −2 > −5.'
 ],[
  'Piensa en una fila de números. Multiplicar por un negativo refleja toda la fila alrededor del cero y cambia quién queda a la izquierda. Esa vuelta explica por qué la flecha debe invertirse.',
  'No es una regla para cambiar todos los signos porque sí: ocurre al multiplicar o dividir la comparación por un negativo. Para comprobar, elige un número dentro del intervalo y otro fuera.'
 ],'Un congelador registra T = −2h grados después de h horas. ¿Para qué h se cumple T < −10 en este modelo?',[
  'Sustituimos la regla de temperatura: −2h < −10.',
  'Dividimos por −2 e invertimos < a >: h > 5. A las cinco horas T = −10 y todavía no es estrictamente menor.',
  'Probamos h = 6: T = −12 < −10, sí cumple. Con h = 4, T = −8, no cumple. Esto confirma la dirección del intervalo.'
 ],'Despeja conservando la comparación e invierte el sentido solo al multiplicar o dividir por un negativo; prueba valores a ambos lados.');
 define('Sistemas lineales',[
  'Un sistema exige que las mismas incógnitas cumplan dos igualdades a la vez. Cada letra debe representar la misma cantidad y unidad en las dos ecuaciones.',
  'Sumar o restar ecuaciones permite eliminar una incógnita si sus coeficientes se cancelan. Luego se despeja la otra y se sustituye para comprobar ambas condiciones, no solo una.'
 ],[
  'Imagina dos bolsas con compras casi iguales. Si quitas de la bolsa grande todo lo que también está en la pequeña, la diferencia del precio corresponde a lo que quedó dentro.',
  'Con dos pistas sobre las mismas cantidades, ninguna se descarta: una respuesta válida debe hacer que las dos compras cuadren.'
 ],'En una feria, tres manzanas y dos peras pesan 800 g; una manzana y dos peras pesan 500 g. ¿Cuánto pesa una manzana?',[
  'Llamamos m al peso de una manzana y p al de una pera: 3m + 2p = 800 y m + 2p = 500.',
  'Restamos la segunda igualdad de la primera: 2m = 300, por lo que m = 150 g.',
  'En la segunda igualdad, 150 + 2p = 500: p = 175 g. Comprobamos la primera: 450 + 350 = 800 g. Las dos pistas se cumplen.'
 ],'Compara lo que se repite en ambas igualdades y cancélalo; interpreta la diferencia como cantidad de objetos, no siempre como una sola unidad.');
 define('Función afín y tarifa fija',[
  'Una función asigna a cada entrada x una salida f(x). En f(x) = b + mx, b es el valor cuando x = 0 y m es el cambio de la salida por cada unidad de x.',
  'Evaluar consiste en reemplazar x por la entrada completa. En una tarifa, la parte fija se cobra una vez y la parte variable se multiplica por la cantidad de usos. Las unidades ayudan: pesos por uso × usos = pesos.'
 ],[
  'Piensa en subir a un taxi: antes de avanzar ya puede haber un cobro. Luego el marcador agrega siempre la misma cantidad por cada tramo. El cobro de partida y el de cada tramo no cumplen el mismo papel.',
  'Para reconocer cuál es cuál, imagina cero usos y después un uso más. Lo que queda en cero es fijo; lo que cambia entre un uso y el siguiente es el incremento.'
 ],'Un estanque tiene 12 litros y recibe 3 litros por minuto: V(t) = 12 + 3t. ¿Cuánta agua tiene a los 4 minutos y qué representa cada término?',[
  'La entrada t mide minutos y la salida V mide litros. El 12 es el agua inicial; el 3 mide litros por minuto.',
  'En cuatro minutos entran 3 × 4 = 12 litros. Sumamos los iniciales: V(4) = 12 + 12 = 24 litros.',
  'V(0) = 12 comprueba la cantidad fija. De t = 4 a t = 5 se pasa de 24 a 27: el aumento por minuto es tres, no doce.'
 ],'Distingue la salida inicial del cambio por unidad y sustituye la entrada donde aparece la letra, conservando sus signos.');
 define('Pendiente de una recta',[
  'La pendiente indica cuánto cambia la salida y por cada unidad de entrada x: m = (y₂ − y₁)/(x₂ − x₁). Los subíndices solo distinguen los dos puntos; debemos restar en el mismo orden arriba y abajo.',
  'Una pendiente positiva indica aumento, una negativa disminución. El valor donde la recta cruza el eje vertical es la salida inicial y no necesariamente coincide con la pendiente.'
 ],[
  'Imagina una rampa: no basta saber cuánto sube, también importa en cuánto avance horizontal ocurre esa subida. Una elevación de cuatro en dos pasos equivale a dos por paso.',
  'Si en vez de subir la rampa baja, el cambio vertical es negativo. Leer la altura de un único punto no permite medir esa inclinación.'
 ],'Una reserva baja de 90 a 66 litros mientras el reloj pasa de 2 a 6 minutos. ¿Cuál es la pendiente?',[
  'El cambio de agua es 66 − 90 = −24 litros. El cambio de tiempo es 6 − 2 = 4 minutos.',
  'Dividimos: m = −24/4 = −6 litros por minuto. El signo menos expresa pérdida.',
  'Durante cuatro minutos perder seis por minuto equivale a perder veinticuatro litros: 90 − 24 = 66. Usar solo −24 ignoraría cuántos minutos transcurrieron.'
 ],'Lee dos puntos, calcula ambos cambios con el mismo orden y divide el cambio vertical por el horizontal.');
 define('Cuadráticas y soluciones reales',[
  'El cuadrado de un número real nunca es negativo: un positivo por sí mismo es positivo y un negativo por sí mismo también. Por eso x² = c tiene dos soluciones reales si c > 0, una si c = 0 y ninguna si c < 0.',
  'Cuando c es positivo, las dos soluciones son √c y −√c. Esto no contradice que el símbolo √c indique solo la raíz principal no negativa: resolver la ecuación pide todos los valores que la cumplen.'
 ],[
  'Piensa en distancias a una marca: estar tres pasos a la izquierda o tres a la derecha da el mismo cuadrado de distancia. El cuadrado pierde esa diferencia de dirección.',
  'Pero ninguna distancia al cuadrado puede dar una cantidad negativa. Antes de buscar raíces, mira qué número debe alcanzar el cuadrado.'
 ],'Una coordenada cumple z² − 25 = 0. ¿Cuáles son sus soluciones y qué cambiaría si fuera z² + 25 = 0?',[
  'En la primera ecuación sumamos 25 a ambos lados: z² = 25.',
  'Tanto 5² como (−5)² valen 25, de modo que z = 5 o z = −5. Sustituir ambos produce cero en z² − 25.',
  'En la segunda ecuación necesitaríamos z² = −25. No hay z real que lo cumpla: cambiar el signo del término constante cambia la existencia de soluciones reales.'
 ],'Aísla el cuadrado y comprueba el signo de lo que debe valer; si es positivo, verifica los dos signos de la raíz.');
 define('Extremos de una cuadrática',[
  'La forma a(x − p)² + q permite reconocer el punto extremo. El cuadrado (x − p)² siempre es no negativo y se hace cero exactamente cuando x = p.',
  'Si a es positivo, se suma una cantidad no negativa a q y q es el mínimo. Si a es negativo, se resta una cantidad no negativa de q y q es el máximo. La entrada p donde ocurre y el valor q alcanzado son respuestas diferentes.'
 ],[
  'Imagina el punto más bajo de un cuenco o el más alto de un cerro. Alejarte del centro en cualquier dirección cambia la altura según un cuadrado.',
  'La posición del centro dice dónde ocurre el extremo; la altura dice cuánto vale. Confundir ambas es como contestar una hora cuando preguntan una altura.'
 ],'La pérdida de energía se modela por L(t) = (t − 4)² + 7. ¿Cuál es la pérdida mínima y cuándo ocurre?',[
  'Como todo cuadrado es no negativo, (t − 4)² nunca baja de cero.',
  'Se hace cero con t = 4. Entonces L(4) = 0 + 7 = 7, la pérdida mínima.',
  'Con t = 3 o t = 5 obtenemos 8, mayor que siete. La entrada del mínimo es cuatro; el mínimo de la salida es siete. No son la misma cantidad.'
 ],'Busca cuándo el cuadrado se anula y distingue el valor de entrada de la altura o salida extrema.');
 define('Teorema de Pitágoras',[
  'Un triángulo rectángulo tiene un ángulo de 90°. Los dos lados que forman ese ángulo son catetos; el lado opuesto es la hipotenusa, el más largo.',
  'Pitágoras relaciona los cuadrados de esas longitudes: a² + b² = c², con c como hipotenusa. Para hallar c sumamos los cuadrados; para un cateto restamos su cuadrado conocido al de c. Finalmente tomamos la raíz no negativa.'
 ],[
  'En un cruce de calles perpendiculares, caminar primero por una calle y luego por otra no mide el atajo en diagonal. La diagonal es un tercer lado y se calcula con cuadrados, no sumando los recorridos.',
  'Busca primero la esquina recta en el dibujo. El lado de enfrente es el que queda solo a un lado de la igualdad, aunque la figura esté girada.'
 ],'Una persona avanza 9 m hacia el este y 12 m hacia el norte. ¿A qué distancia en línea recta quedó del inicio?',[
  'Las dos direcciones son perpendiculares; 9 y 12 son catetos. La distancia directa d es la hipotenusa.',
  'Aplicamos d² = 9² + 12² = 81 + 144 = 225, así que d = 15 m.',
  'Quince es mayor que cada cateto y menor que el recorrido de 21 m. Al cuadrarlo se recupera 225: ambas comprobaciones concuerdan con la geometría.'
 ],'Identifica la hipotenusa antes de escribir la igualdad y distingue si buscas esa longitud o uno de los catetos.');
 define('Área de un círculo',[
  'El radio r une el centro con el borde; el diámetro atraviesa el centro y mide 2r. El área del círculo es A = πr², donde π es la constante que vincula contorno y diámetro.',
  'El cuadrado del radio cuenta cómo cambia una superficie en dos direcciones. La longitud de la circunferencia, 2πr, mide solo el borde. Utiliza el valor de π solicitado y unidades cuadradas para el área.'
 ],[
  'Imagina una pizza: el radio va desde el centro hasta la orilla. Comprar queso para cubrirla requiere su superficie; poner un cordón en la orilla requiere el contorno.',
  'Si duplicas el radio, la pizza crece al doble en dos direcciones y necesita cuatro veces más cobertura. No basta duplicar la cantidad de queso.'
 ],'Una tapa circular tiene diámetro de 10 cm. Con π = 3, ¿qué superficie cubre una etiqueta que ocupa la mitad de la tapa?',[
  'El radio es la mitad del diámetro: r = 10/2 = 5 cm.',
  'El área completa es πr² = 3 × 5² = 75 cm².',
  'La etiqueta ocupa la mitad: 75/2 = 37,5 cm². Usar diez como radio daría una tapa cuatro veces mayor que la descrita.'
 ],'Distingue radio de diámetro y cobertura de contorno; aplica el cuadrado al radio, no a π.');
 define('Longitud de circunferencia',[
  'La circunferencia es el borde de un círculo. Su longitud es L = πd = 2πr, donde d es diámetro y r radio; d = 2r.',
  'π expresa cuántas veces cabe el diámetro en el contorno. Esta longitud se mide en metros o centímetros; la superficie interior se mide en unidades cuadradas y utiliza otra fórmula.'
 ],[
  'Imagina una cinta que da una vuelta exacta a una rueda. La cinta mide el borde, mientras que una línea recta que atraviesa el centro mide el diámetro.',
  'Con π aproximado por tres, la cinta es aproximadamente tres veces esa línea de lado a lado. Si ya conoces el diámetro, no necesitas duplicarlo otra vez.'
 ],'Una rueda de radio 0,4 m da cinco vueltas sin resbalar. Con π = 3, ¿qué distancia recorre?',[
  'Su diámetro es 2 × 0,4 = 0,8 m.',
  'Cada vuelta recorre un contorno: πd = 3 × 0,8 = 2,4 m.',
  'Cinco vueltas recorren 5 × 2,4 = 12 m. El área del disco no permitiría obtener esta distancia.'
 ],'Para medir borde o recorrido de una vuelta, utiliza π por diámetro y evita duplicar un diámetro ya conocido.');
 define('Áreas de paralelogramo y trapecio',[
  'El área de un paralelogramo es base por altura perpendicular: inclinar sus lados no cambia el área si conserva esas dos medidas. La altura no es necesariamente el lado inclinado.',
  'En un trapecio las bases paralelas pueden tener distinta longitud. Su área es A = (B + b)h/2: el promedio de las bases multiplicado por la altura. Dos trapecios iguales forman un paralelogramo de base B + b.'
 ],[
  'Puedes cortar la punta inclinada de un paralelogramo y moverla al otro lado para formar un rectángulo sin perder papel. La misma base y altura siguen midiendo su superficie.',
  'Para un trapecio, imagina apoyar una copia invertida contra la primera. Juntas completan una figura de base igual a la suma de las dos bases; la mitad pertenece al trapecio original.'
 ],'Una franja de terreno tiene forma de trapecio con bases 12 y 8 m y separación perpendicular de 5 m. Se siembra la mitad. ¿Qué superficie se siembra?',[
  'El promedio de las bases es (12 + 8)/2 = 10 m.',
  'El área del trapecio completo es 10 × 5 = 50 m².',
  'Sembrar la mitad requiere 50/2 = 25 m². La primera división por dos corresponde a la forma del trapecio y la segunda a la parte que se siembra: son motivos distintos.'
 ],'Reconoce la figura, usa altura perpendicular y justifica si corresponde o no dividir por dos.');
 define('Volumen y superficie de prismas',[
  'El volumen mide el espacio interior y se cuenta en unidades cúbicas. Un prisma rectangular de largo l, ancho a y altura h tiene V = l × a × h: área de la base multiplicada por cantidad de capas.',
  'En un cubo todos los lados miden s: V = s³. Cubrirlo con papel mide superficie, no volumen: tiene seis caras cuadradas de área s², por lo que el área total es 6s².'
 ],[
  'Piensa en llenar una caja con cubitos y después envolverla. Los cubitos cuentan espacio en tres direcciones; el papel cuenta solo los cuadrados de la piel exterior.',
  'Una capa de cubitos no llena toda la caja si hay varias capas. Y una cara de papel no envuelve los seis lados de un cubo cerrado.'
 ],'Una caja cerrada tiene largo 4 cm, ancho 3 cm y alto 2 cm. ¿Cuál es su volumen y cuánta superficie tiene?',[
  'Cada capa de 1 cm de alto contiene 4 × 3 = 12 cm³. Dos capas ocupan V = 4 × 3 × 2 = 24 cm³.',
  'Las caras vienen en pares: dos de 4 × 3, dos de 4 × 2 y dos de 3 × 2 cm².',
  'El papel necesario es 2 × (12 + 8 + 6) = 52 cm². Las unidades y los cálculos distinguen llenar de envolver.'
 ],'Decide si buscas espacio interior o cobertura; usa tres dimensiones para volumen y suma todas las caras para superficie.');
 define('Cilindro: volumen',[
  'Un cilindro tiene bases circulares iguales. Su volumen es V = πr²h: área de la base, πr², multiplicada por altura h. r es radio, no diámetro.',
  'Con la altura fija, cambiar el radio por un factor k cambia el volumen por k², porque el radio aparece al cuadrado. El resultado se mide en unidades cúbicas.'
 ],[
  'Imagina apilar monedas del mismo tamaño: el espacio ocupado depende de cuánto cubre cada moneda y de la altura de la pila.',
  'Hacer cada moneda más ancha no solo agrega un borde: amplía el disco en dos direcciones. Por eso duplicar el radio cuadruplica el espacio de una pila de la misma altura.'
 ],'Un recipiente cilíndrico tiene diámetro 6 cm y altura 4 cm. Con π = 3, ¿qué volumen ocupa la mitad de su capacidad?',[
  'El radio es 6/2 = 3 cm. Su base tiene área 3 × 3² = 27 cm².',
  'La capacidad completa es 27 × 4 = 108 cm³.',
  'La mitad es 108/2 = 54 cm³. Si el radio se duplicara a seis con altura fija, la capacidad completa sería 432 cm³, cuatro veces 108.'
 ],'Calcula primero la superficie circular de una base, después multiplícala por la altura; para comparar radios conserva su cuadrado.');
 define('Cilindro: superficie lateral',[
  'La superficie lateral de un cilindro es su costado, sin las dos bases. Al desplegarlo forma un rectángulo: un lado mide la circunferencia de la base, 2πr, y el otro la altura h.',
  'Su área es 2πrh. No es volumen porque no cuenta el interior, ni área total porque no incorpora los dos discos de las bases. La unidad es cuadrada.'
 ],[
  'Piensa en sacar la etiqueta de una lata y aplanarla. La etiqueta es rectangular: debe alcanzar a dar una vuelta completa y llegar de abajo arriba.',
  'El ancho de la etiqueta es el recorrido alrededor, no el radio ni el diámetro. Los círculos de arriba y abajo quedarían descubiertos porque solo estamos envolviendo el costado.'
 ],'Una lata tiene diámetro 10 cm y altura 8 cm. Con π = 3, ¿cuánto papel ocupa una etiqueta que cubre todo el costado?',[
  'Una vuelta mide πd = 3 × 10 = 30 cm: ese es el ancho de la etiqueta.',
  'La altura de la etiqueta es 8 cm. Su área rectangular es 30 × 8 = 240 cm².',
  'No sumamos bases ni multiplicamos por el área del disco. Si dibujamos el rectángulo desplegado se distinguen sus dos dimensiones: 30 y 8.'
 ],'Despliega mentalmente el costado: circunferencia por altura. Decide si se piden también las bases antes de agregarlas.');
 define('Reflexión',[
  'Reflejar es obtener la imagen especular respecto de una recta: cada punto y su imagen están a igual distancia perpendicular del eje, en lados opuestos.',
  'Respecto del eje y cambia el signo de x y se conserva y: (x,y) → (−x,y). La reflexión conserva longitudes, ángulos y áreas, aunque invierte la orientación de la figura.'
 ],[
  'Imagina un espejo vertical en la línea x = 0: alguien tres pasos a la derecha aparece tres a la izquierda, pero a la misma altura.',
  'El espejo no estira las figuras ni las gira un cuarto de vuelta. Tu mano reflejada tiene el mismo tamaño, aunque su orientación se invierta.'
 ],'Los extremos de un segmento son (1,2) y (4,2). ¿Dónde quedan al reflejarlos respecto del eje y y cuánto mide el segmento?',[
  'Cambiamos solo las coordenadas horizontales: (1,2) pasa a (−1,2) y (4,2) a (−4,2).',
  'Antes la separación horizontal era 4 − 1 = 3; después es |−4 − (−1)| = 3.',
  'La longitud se conserva. Las alturas siguen siendo dos y cada extremo queda al lado opuesto del espejo, a la misma distancia de él.'
 ],'Ubica el eje del espejo, cambia solo la coordenada perpendicular a él y comprueba que se conserven distancias.');
 define('Traslación',[
  'Una traslación mueve todos los puntos en la misma dirección y distancia. Un vector (a,b) indica desplazamiento horizontal a y vertical b; se suma componente a componente.',
  'La regla es (x,y) → (x+a,y+b). Un desplazamiento negativo apunta a la izquierda o hacia abajo. No intercambiamos coordenadas y no multiplicamos por el vector.'
 ],[
  'Es como mover una ficha por un tablero: tres pasos a la derecha cambian la columna, dos hacia abajo cambian la fila. La posición de partida todavía importa.',
  'El vector da instrucciones de movimiento y no la dirección del punto de llegada. Sigue cada instrucción desde donde estabas.'
 ],'Un robot está en (−2,−1) y avanza según el vector (5,3). Luego retrocede ese mismo vector. ¿Qué ocurre?',[
  'Al avanzar sumamos componentes: (−2 + 5, −1 + 3) = (3,2).',
  'Retroceder el vector equivale a sumar (−5,−3): (3 − 5, 2 − 3) = (−2,−1).',
  'Volver al punto inicial verifica la suma componente a componente. No se intercambian las coordenadas ni se modifica la forma del robot.'
 ],'Aplica el desplazamiento horizontal a x y el vertical a y; comprueba deshaciendo el movimiento.');
 define('Rotación',[
  'Una rotación gira una figura alrededor de un centro por cierto ángulo y sentido, conservando distancias al centro. El sentido antihorario es contrario al movimiento de las manecillas del reloj.',
  'Para 90° antihorarios alrededor del origen, (x,y) se transforma en (−y,x). El vector horizontal positivo pasa al vertical positivo, y el vertical positivo pasa al horizontal negativo.'
 ],[
  'Imagina una hoja transparente que gira un cuarto de vuelta a la izquierda alrededor de una chinche en el origen. El punto gira con ella; no se refleja en un espejo.',
  'Una flecha que apuntaba a la derecha termina apuntando arriba. Esa referencia ayuda a recordar el sentido antes de aplicar la regla.'
 ],'Una flecha va del origen a (3,−2). ¿Dónde termina después de girar 90° antihorarios?',[
  'Usamos (x,y) → (−y,x). Aquí x = 3 e y = −2.',
  'La nueva coordenada horizontal es −(−2) = 2 y la vertical es 3: queda (2,3).',
  'Las distancias al origen conservan su cuadrado: 3² + (−2)² = 13 y 2² + 3² = 13. Además un punto abajo y a la derecha pasó arriba y a la derecha, como indica el giro.'
 ],'Verifica centro, ángulo y sentido, después aplica (−y,x) y comprueba la distancia al origen.');
 define('Frecuencia relativa',[
  'La frecuencia absoluta cuenta casos de una categoría. La relativa compara esos casos con todos los del grupo: f relativa = f absoluta/total. Multiplicar por cien la expresa como porcentaje.',
  'Primero sumamos todas las categorías si el total no aparece. El número de una barra no es automáticamente un porcentaje; la base debe ser el total de observaciones.'
 ],[
  'Imagina repartir cien espacios de un mural entre talleres según cuántas personas tienen. Un taller con veinticuatro personas no ocupa necesariamente veinticuatro espacios: depende de cuántas personas hay entre todos.',
  'La pregunta de proporción es «de cada cien del grupo completo, cuántas pertenecen a esta categoría». Antes de responder necesitas el grupo completo.'
 ],'En una biblioteca, 18 préstamos son de novela, 6 de poesía y 6 de ensayo. ¿Qué porcentaje corresponde a novela?',[
  'El total es 18 + 6 + 6 = 30 préstamos.',
  'La parte de novela es 18/30 = 0,60, equivalente a 60%.',
  'El resto suma 12/30 = 40%. Ambos porcentajes suman cien. El 18 era un recuento, no un porcentaje.'
 ],'Divide la frecuencia de interés por el total y solo entonces convierte a porcentaje si lo solicitan.');
 define('Comparación de frecuencias',[
  'Preguntar cuántos más tiene una categoría que otra requiere restar sus frecuencias, no sumar ni elegir la frecuencia mayor sin comparar.',
  'En un gráfico primero relacionamos etiqueta y altura de cada barra con su escala. Si preguntan por un empate máximo, buscamos todas las barras con la mayor frecuencia, no cualquier pareja de igual altura.'
 ],[
  'Imagina dos filas de personas frente a frente: al emparejarlas, las que sobran en la fila larga muestran la diferencia.',
  'Para un empate ganador miras quiénes llegaron a la altura más alta. Que dos grupos tengan igual tamaño no basta si hay otro más numeroso.'
 ],'Un club tiene 17 socios adultos, 11 juveniles y 17 infantiles. ¿Cuántos adultos más que juveniles hay y quiénes empatan en el máximo?',[
  'La diferencia solicitada es 17 − 11 = 6 socios, no 28.',
  'La frecuencia máxima es 17 y aparece en adultos e infantiles.',
  'La diferencia y el empate son conclusiones distintas a partir de los mismos datos. Siempre deben conservarse las etiquetas de las categorías.'
 ],'Lee las categorías exactas y distingue diferencia de suma y de búsqueda del máximo.');
 define('Promedio ponderado',[
  'Un promedio ponderado asigna a cada dato una proporción de influencia. Cuando los pesos suman uno, multiplicamos cada valor por su peso y sumamos los productos.',
  'El 40% se escribe 0,40 y el 60% como 0,60. El promedio simple asigna 50% a cada dato, por lo que solo corresponde cuando ambos pesan lo mismo.'
 ],[
  'Piensa en mezclar jugos: si pones más del segundo sabor, el resultado se acerca más a él. La cantidad de cada jugo funciona como el peso de cada nota.',
  'No basta promediar dos números porque haya dos pruebas: una puede influir más que la otra. A cada nota le toca la parte del resultado que dice su ponderación.'
 ],'Una evaluación tiene proyecto 80 puntos con peso 75% y exposición 60 puntos con peso 25%. ¿Cuál es el resultado?',[
  'Los pesos suman 75% + 25% = 100%, por lo que cubren toda la evaluación.',
  'El proyecto aporta 80 × 0,75 = 60 puntos y la exposición 60 × 0,25 = 15.',
  'El resultado es 60 + 15 = 75 puntos. Está entre 60 y 80 y más cerca de 80, el dato de mayor peso. El promedio simple de 70 no respeta las ponderaciones.'
 ],'Asocia cada peso con su dato antes de multiplicar y comprueba que el resultado se acerque al de mayor influencia.');
 define('Cuartiles y dispersión central',[
  'Los cuartiles describen posiciones en datos ordenados: Q1 deja aproximadamente 25% de las observaciones en o bajo él y Q3 aproximadamente 75%. Su cálculo en muestras pequeñas depende de la convención indicada.',
  'El rango intercuartílico RIC = Q3 − Q1 mide el ancho del intervalo central, aproximadamente la mitad de los datos. No entrega el mínimo, máximo ni cantidad de observaciones, y no debe confundirse con la mediana.'
 ],[
  'Imagina ordenar una fila y marcar dónde termina su primer cuarto y dónde termina su tercer cuarto. La distancia entre esas marcas describe qué tan extendida está la parte central.',
  'Dos filas pueden tener la misma persona en el centro y distinta separación entre sus marcas. Saber dónde está el centro no basta para saber cuán repartidos están los datos.'
 ],'Dos registros de tiempos tienen Q1 = 5 y Q3 = 17, y Q1 = 8 y Q3 = 14 minutos, respectivamente. ¿Cuál tiene menor dispersión central?',[
  'En el primero, RIC = 17 − 5 = 12 minutos. En el segundo, RIC = 14 − 8 = 6 minutos.',
  'El segundo tiene un intervalo central más estrecho: seis frente a doce minutos.',
  'Eso no demuestra que sus mínimos, máximos o tamaños sean iguales. La comparación se limita al ancho de los dos intervalos centrales.'
 ],'Identifica los cuartiles que delimitan el intervalo central, réstalos y limita la conclusión a la información que realmente entregan.');
 define('Percentiles',[
  'Un percentil ubica un dato dentro de una distribución ordenada. El percentil p es un valor que deja aproximadamente p% de las observaciones en o bajo ese nivel, según la convención de cálculo.',
  'El número del percentil describe una posición relativa y no una puntuación absoluta ni el porcentaje de respuestas correctas. Los empates y el tamaño de la muestra explican por qué hablamos de aproximadamente.'
 ],[
  'Imagina una carrera con cien posiciones ordenadas por puntuación. Decir que tu puntuación está cerca del lugar que deja setenta y cinco detrás describe tu posición, no los puntos que ganaste.',
  'Puedes tener pocos o muchos puntos y estar en el mismo percentil de grupos distintos. Lo que importa es cómo te ubicas respecto de ese grupo.'
 ],'Una medición de estatura coincide con el percentil 40 de un grupo. ¿Significa que mide 40 cm?',[
  'No: cuarenta identifica una posición relativa en las estaturas ordenadas.',
  'Aproximadamente 40% del grupo tiene una estatura en o bajo esa medición; el resto queda sobre ella, con las salvedades de empates y convención.',
  'Para conocer centímetros necesitamos el valor de estatura correspondiente. El percentil por sí solo no permite inventarlo.'
 ],'Interpreta el porcentaje como proporción del grupo en la distribución, nunca como la unidad física o puntuación del dato.');
 define('Complemento de un evento',[
  'Un evento y su complemento cubren todos los resultados y no ocurren juntos. Si A es que llueva, su complemento es que no llueva bajo la misma definición de día y lugar.',
  'Las probabilidades de ambos suman uno: P(no A) = 1 − P(A). No se suman al uno porque el total de posibilidades ya está completo.'
 ],[
  'Imagina un círculo repartido en la parte donde ocurre algo y la parte donde no. Si conoces el espacio ocupado, la otra parte es lo que falta para completar el círculo.',
  'No necesitas nuevos datos para completar hasta cien por ciento, pero debes estar hablando del mismo evento y sus mismas condiciones.'
 ],'La probabilidad de que un envío llegue tarde es 0,12. ¿Cuál es la probabilidad de que no llegue tarde?',[
  'Llegar tarde y no llegar tarde cubren todos los resultados definidos para el envío.',
  'Restamos del total: 1 − 0,12 = 0,88, equivalente a 88%.',
  'Comprobamos 0,12 + 0,88 = 1. El resultado no significa que todos los envíos lleguen exactamente a la misma hora: solo que no cumplen la condición de retraso.'
 ],'Identifica la negación exacta del evento y calcula lo que falta para completar la probabilidad total de uno.');
 define('Unión de eventos',[
  'El conector O pide la unión: resultados que cumplen una condición, la otra o ambas. Debemos contar cada resultado una sola vez.',
  'P(A o B) = P(A) + P(B) − P(A y B). Si los eventos son incompatibles no comparten resultados y basta sumar. Si se superponen, restamos la intersección que habíamos contado dos veces.'
 ],[
  'Imagina dos listas de personas invitadas: una por deporte y otra por música. Para saber cuántas reciben invitación, quien aparece en las dos listas debe contarse solo una vez.',
  'La palabra O suele ampliar el grupo, pero no permite duplicar a nadie. Si hablamos de una sola bolita, no puede ser de dos colores exclusivos a la vez.'
 ],'Se elige al azar un número del 1 al 10. ¿Cuál es la probabilidad de que sea múltiplo de 2 o de 3?',[
  'Los múltiplos de dos son 2, 4, 6, 8 y 10; los de tres son 3, 6 y 9.',
  'El seis aparece en ambas listas. La unión sin duplicados es 2, 3, 4, 6, 8, 9, 10: siete resultados.',
  'La probabilidad es 7/10. También (5 + 3 − 1)/10 = 7/10: se resta el seis duplicado.'
 ],'Forma el conjunto que cumple al menos una condición y revisa si debes eliminar resultados repetidos.');
 add(220,'Escala y semejanza','Buscamos la distancia real que representan 3 cm en escala 1:50.000.',['Una unidad del plano equivale a 50.000 de la misma unidad real: 3 × 50.000 = 150.000 cm.','Como 100 cm = 1 m, 150.000/100 = 1.500 m.','Como 1.000 m = 1 km, 1.500/1.000 = 1,5 km.'],'Convertir de cm a km divide por 100.000. La escala se aplica antes y con unidades iguales.',['150 m se queda diez veces corto: 150.000 cm equivalen a 1.500 m.',null,'15 km es diez veces la distancia: faltó un factor diez en la conversión.','150 km es cien veces lo representado. No confundas los 150.000 cm con kilómetros.']);
 add(221,'Ecuación lineal','El dos multiplica al paquete completo x + 4; hay que deshacer ese producto y luego la suma.',['En 2(x + 4) = 18 dividimos ambos lados por dos: x + 4 = 9.','Restamos cuatro en ambos lados: x = 5.','Comprobamos 2(5 + 4) = 2 × 9 = 18.'],'Dividir por dos antes de restar es válido porque el paréntesis completo estaba multiplicado por dos.',[null,'Con x = 7, 2(7 + 4) = 22, no 18. La suma interior debe valer nueve.','9 es el valor del paréntesis x + 4; aún falta restar cuatro.','14 resta cuatro directamente a 18 e ignora que el dos multiplica todo el paréntesis.']);
 add(222,'Ecuación lineal','Hay que separar el pago fijo de $3.500 del cobro de $250 por mensaje extra.',['Sea m la cantidad de mensajes: 3.500 + 250m = 5.500.','Restamos 3.500: 250m = 2.000.','Dividimos por 250: m = 8 mensajes.'],'3.500 + 250 × 8 = 5.500: ambos componentes recuperan la cuenta.',['Cuatro mensajes agregarían 1.000 y el total sería 4.500, no 5.500.','Seis agregarían 1.500 y el total sería 5.000; todavía faltarían $500.',null,'Diez agregarían 2.500 y el total sería 6.000, más de lo pagado.']);
 add(223,'Inecuaciones','Buscamos todos los valores de x para los que 3x + 2 resulta estrictamente menor que 14.',['Restamos dos a ambos lados: 3x < 12.','Dividimos por tres positivo, por lo que conservamos el sentido: x < 4.','Con x = 3 obtenemos 11 < 14; con x = 4 obtenemos 14 y no cumple la condición estricta.'],'El extremo cuatro queda excluido y los valores menores sí cumplen.',[null,'x > 4 invierte la comparación al dividir por tres positivo. Con x = 5, el resultado 17 no es menor que 14.','x < 6 admite valores que fallan, como x = 5: 3 × 5 + 2 = 17.','x > 6 combina un límite incorrecto con sentido invertido; x = 7 produce 23, que no cumple.']);
 add(224,'Inecuaciones','El factor −2 obliga a invertir la comparación cuando despejamos x.',['Dividimos ambos lados de −2x > 8 por −2.','8/(−2) = −4 y el signo > cambia a <: x < −4.','Probamos x = −5: −2(−5) = 10 > 8; x = −3 daría 6 y no cumple.'],'x = −4 produce igualdad, por lo que queda fuera de esta desigualdad estricta.',['x > −4 conserva indebidamente el signo al dividir por un negativo.',null,'x > 4 pierde el signo del cociente y también la dirección correcta; x = 5 da −10.','x < 4 usa el extremo positivo; incluye cero, que produciría 0 > 8, falso.']);
 add(225,'Sistemas lineales','Las mismas cantidades x e y deben sumar nueve y diferenciarse en tres.',['Sumamos las ecuaciones: (x + y) + (x − y) = 9 + 3.','Los términos y y −y se cancelan: 2x = 12, de donde x = 6.','Sustituimos en x + y = 9: y = 3; también 6 − 3 = 3.'],'El par (6,3) cumple ambas ecuaciones, por eso x vale seis.',['3 es y, no x. Si x fuera tres, la primera exigiría y = 6 y la segunda daría −3.','Con x = 4 la primera exige y = 5, pero entonces x − y = −1, no 3.',null,'9 es la suma x + y: asignársela a x deja y = 0 y la diferencia sería nueve.']);
 add(226,'Sistemas lineales','Las compras solo se diferencian en una entrada adulta; su diferencia de precios revela su valor.',['Llamamos a a la entrada adulta e i a la infantil: 2a + i = 19.000 y a + i = 11.000.','Restamos ambas igualdades: a = 19.000 − 11.000 = $8.000.','La infantil cuesta 11.000 − 8.000 = 3.000; comprobamos 2 × 8.000 + 3.000 = 19.000.'],'La diferencia de compras contiene exactamente una entrada adulta, sin entrada infantil.',['Con adulto 7.000 e infantil 4.000, la compra grande sería 18.000, no 19.000.',null,'Con adulto 9.000 e infantil 2.000, la compra grande sería 20.000.','11.000 es el costo de adulto e infantil juntos; no de la entrada adulta sola.']);
 add(227,'Función afín y tarifa fija','Debemos evaluar la tarifa f(x) = 2.500 + 800x en x = 6 kilómetros.',['El fijo es 2.500 pesos y el costo por kilómetro 800 pesos.','Reemplazamos solo x: f(6) = 2.500 + 800 × 6 = 2.500 + 4.800.','Sumamos ambas partes: f(6) = $7.300.'],'El cargo fijo se paga una vez y los seis kilómetros agregan 4.800 pesos.',['4.800 calcula solo los seis kilómetros y omite la tarifa fija.',null,'8.100 correspondería a siete kilómetros, porque 2.500 + 800 × 7 = 8.100.','15.000 multiplica 2.500 por seis; el fijo no es el cobro por kilómetro y además falta el término variable.']);
 add(228,'Pendiente de una recta','Los dos puntos permiten comparar el cambio vertical con el horizontal.',['De (0,3) a (2,7), el cambio de y es 7 − 3 = 4.','El cambio de x es 2 − 0 = 2.','La pendiente es 4/2 = 2 unidades de y por cada unidad de x.'],'La regla y = 3 + 2x produce y = 7 cuando x = 2: sube cuatro al avanzar dos.',['1 no reproduce el cambio: avanzar dos haría subir solo dos y terminaría en cinco.',null,'3 es la ordenada inicial, y cuando x = 0, no el aumento por unidad.','4 es el cambio vertical completo; falta repartirlo entre las dos unidades horizontales.']);
 add(229,'Función afín y tarifa fija','La entrada de f es −1; debemos sustituirla completa y conservar el signo.',['f(−1) = 3(−1) − 2.','Primero el producto: 3(−1) = −3.','Después la resta: −3 − 2 = −5.'],'Al restar dos a −3 avanzamos hacia valores más negativos, no hacia cero.',[null,'−1 resulta de −3 + 2; la función indica restar dos, no sumarlos.','1 es f(1) = 3 − 2: cambia indebidamente la entrada negativa por positiva.','5 toma la magnitud del resultado, pero el signo negativo también forma parte de la salida.']);
 add(230,'Cuadráticas y soluciones reales','La ecuación requiere todos los valores reales cuyo cuadrado sea nueve.',['Sumamos nueve a ambos lados de x² − 9 = 0: x² = 9.','3² = 9 y (−3)² = 9.','Las dos soluciones son x = −3 y x = 3.'],'Ambas producen cero al restar nueve; ninguna debe omitirse.',['Solo 3 omite −3, cuyo producto (−3)(−3) también vale nueve.','Solo −3 omite el valor positivo 3, que también cumple.',null,'Con cero obtenemos −9 y con nueve obtenemos 72: ninguno hace cero la expresión.']);
 add(231,'Extremos de una cuadrática','Nos preguntan en qué instante ocurre la altura máxima, no cuánto mide esa altura.',['En h(t) = −(t − 3)² + 9, el cuadrado es siempre no negativo.','Restarlo de nueve da como máximo nueve, cuando el cuadrado vale cero.','Eso ocurre si t − 3 = 0: t = 3. Entonces h(3) = 9.'],'Con t = 2 o t = 4 la altura vale ocho, menor que nueve; el instante del máximo es tres.',['En t = 0 la altura es −9 + 9 = 0, no el máximo.',null,'t = 6 produce también altura cero, cuando la pelota ya bajó.','9 es la altura máxima, no el instante en que ocurre; t = 9 no anula el cuadrado.']);
 add(232,'Extremos de una cuadrática','Buscamos el valor mínimo de f, no solamente la coordenada x del vértice.',['Reescribimos x² − 4x + 3 como (x − 2)² − 1, porque (x − 2)² = x² − 4x + 4.','El cuadrado alcanza su mínimo cero con x = 2.','Entonces f(2) = 0 − 1 = −1. Cualquier otro cuadrado agrega una cantidad no negativa.'],'Para todo x real, (x − 2)² − 1 ≥ −1, y x = 2 efectivamente alcanza ese límite.',[null,'0 es un valor posible en las raíces, pero f(2) = −1 demuestra que puede bajar más.','1 no es mínimo: al sustituir x = 2 se obtiene −1. No confundas el término final de la forma cuadrada con un signo positivo.','3 es f(0), una salida particular que está por encima del mínimo.']);
 add(233,'Teorema de Pitágoras','La escalera de 5 m es la hipotenusa; la distancia al muro de 3 m es un cateto.',['El muro y el suelo forman el ángulo recto. Si h es la altura, h² + 3² = 5².','Despejamos h² = 25 − 9 = 16.','Tomamos la raíz positiva porque es longitud: h = 4 m.'],'3² + 4² = 9 + 16 = 25 = 5². La altura es menor que la escalera.',['2 resta 5 − 3 directamente, pero Pitágoras relaciona cuadrados, no una resta de lados.','3 es la distancia horizontal conocida, no la altura; dos catetos de tres darían hipotenusa √18.',null,'8 suma las longitudes conocidas; la altura ni siquiera podría superar la escalera de cinco.']);
 add(234,'Teorema de Pitágoras','La diagonal del rectángulo forma la hipotenusa con los lados perpendiculares de seis y ocho.',['Escribimos d² = 6² + 8².','Calculamos 36 + 64 = 100.','La diagonal mide d = √100 = 10 unidades.'],'10² = 6² + 8²; diez supera ambos lados sin alcanzar el recorrido de catorce por el borde.',['7 es menor que el lado de ocho, por lo que no puede ser la hipotenusa.',null,'14 suma seis y ocho: es el recorrido por dos bordes, no la diagonal.','48 es 6 × 8, el área del rectángulo, no una longitud.']);
 add(235,'Teorema de Pitágoras','La hipotenusa es 13 cm y conocemos un cateto de 12; falta el otro cateto.',['Si c es el cateto faltante, c² + 12² = 13².','Restamos: c² = 169 − 144 = 25.','Por ser longitud tomamos la raíz positiva: c = √25 = 5 cm.'],'12² + 5² = 144 + 25 = 169 = 13²; no confundimos c² con c.',['1 resta las longitudes 13 − 12 en vez de restar sus cuadrados.',null,'12,5 no es √25; su cuadrado es 156,25 y no completaría la igualdad.','25 es el cuadrado del cateto; falta obtener su raíz para responder la longitud.']);
 add(236,'Área de un círculo','El radio mide 5 cm y debemos calcular superficie usando π = 3,14.',['Aplicamos A = πr² con r = 5 cm.','Primero el cuadrado: 5² = 25 cm².','Multiplicamos 3,14 × 25 = 78,5 cm².'],'El radio se eleva al cuadrado antes de multiplicar por π; 31,4 cm sería contorno, otra magnitud.',['15,7 es πr y omite uno de los factores cinco necesarios para el área.','31,4 es 2πr, la longitud del contorno, y debería medirse en cm.',null,'157 es el doble del área: añade un factor dos que la superficie circular no requiere.']);
 add(237,'Longitud de circunferencia','Ya conocemos el diámetro de 8 m y queremos el borde, con π = 3.',['Usamos L = πd porque nos dieron el diámetro.','Sustituimos: L = 3 × 8.','El contorno mide 24 m; no aparece ninguna unidad al cuadrado.'],'El radio sería cuatro: 2 × 3 × 4 = 24 m, equivalente a usar πd.',['12 multiplica π por el radio y solo alcanza la mitad del contorno.','16 duplica el diámetro sin usar π; no mide la vuelta completa.',null,'48 duplica de nuevo el diámetro ya conocido; 2πr y πd son alternativas, no factores que se agreguen juntos.']);
 add(238,'Áreas de paralelogramo y trapecio','El trapecio tiene bases paralelas de 10 y 6 cm y altura perpendicular de cuatro.',['Sumamos las bases: 10 + 6 = 16 cm.','Su promedio es 16/2 = 8 cm.','Multiplicamos por la altura: 8 × 4 = 32 cm².'],'Dos trapecios iguales forman un paralelogramo de base 16 y altura cuatro, área 64; uno ocupa 32.',['16 suma las bases pero no incorpora la altura ni toma el promedio.','24 usa solo la base menor por la altura: omite el ensanchamiento hasta la base mayor.',null,'64 es el área de dos copias del trapecio; falta dividir por dos.']);
 add(239,'Áreas de paralelogramo y trapecio','Aunque el paralelogramo esté inclinado, conocemos base nueve y altura perpendicular cuatro.',['El área de un paralelogramo es base por altura perpendicular.','Sustituimos A = 9 × 4.','Obtenemos 36 cm², sin dividir entre dos.'],'Reacomodar su esquina lo convierte en un rectángulo de nueve por cuatro sin cambiar su superficie.',['13 suma dos longitudes y no obtiene superficie.','18 divide por dos como si fuera un triángulo; el paralelogramo ya ocupa el área completa.',null,'72 duplica el área; no hay dos figuras que sumar.']);
 add(240,'Volumen y superficie de prismas','La caja es un cubo de arista 4 cm; buscamos espacio interior.',['Una base tiene 4 × 4 = 16 cm².','La altura es también cuatro: V = 16 × 4 = 64 cm³.','Equivalentemente V = 4³ = 4 × 4 × 4.'],'Cuatro capas de dieciséis cubitos de 1 cm³ suman 64 cm³.',['12 suma tres aristas y no mide espacio interior.','16 es el área de una cara; falta la tercera dimensión.','48 es tres veces el área de una cara, no cuatro capas de altura.',null]);
 add(241,'Volumen y superficie de prismas','El depósito mide 5 por 3 por 2 m; el volumen necesita las tres dimensiones.',['La base rectangular mide 5 × 3 = 15 m².','Multiplicamos por dos metros de altura: V = 15 × 2 = 30 m³.','El resultado cuenta treinta cubos de un metro de lado.'],'Una capa de 1 m de altura contiene quince metros cúbicos; hay dos capas.',['10 multiplica largo por altura y deja fuera el ancho.','15 es el área de la base, todavía sin la altura.',null,'60 duplica el volumen; las tres dimensiones ya cuentan el espacio completo.']);
 add(242,'Volumen y superficie de prismas','Se quiere papel para cubrir las seis caras del cubo cerrado, no para llenarlo.',['Cada cara cuadrada tiene 3 × 3 = 9 cm².','Un cubo tiene seis caras, incluyendo tapa y fondo.','El total es 6 × 9 = 54 cm².'],'Al desplegar el cubo aparecen seis cuadrados de área nueve cada uno.',['9 cubre solo una de las seis caras.','18 cubre dos caras, no el cubo completo.','27 es 3³, el volumen en cm³; el papel se mide en cm².',null]);
 add(243,'Cilindro: volumen','El cilindro tiene radio dos y altura cinco; utilizamos π = 3.',['La base tiene área πr² = 3 × 2² = 3 × 4 = 12 cm².','Multiplicamos por la altura: V = 12 × 5.','El volumen es 60 cm³.'],'Cada centímetro de altura contiene 12 cm³ y cinco capas suman 60.',['30 usa 3 × 2 × 5 y omite elevar el radio al cuadrado.',null,'90 no conserva el área de base de 12 cm²: a cinco centímetros de altura implicaría una base de 18. Calcula primero 3 × 2².','120 agrega un factor dos extra; no se duplica el volumen por tener dos bases.']);
 add(244,'Cilindro: superficie lateral','Solo vamos a envolver el costado: radio cuatro, altura seis y π = 3.',['La vuelta de la base mide 2πr = 2 × 3 × 4 = 24 cm.','Desplegado, el costado es un rectángulo de 24 por 6 cm.','Su área es 24 × 6 = 144 cm², sin sumar discos.'],'El ancho de la etiqueta da una vuelta completa; el alto alcanza los seis centímetros.',['24 es el contorno de la base en cm; todavía falta multiplicar por la altura.','48 usa 2 × 4 × 6 pero omite el factor π = 3.','72 usa πrh y recorre solo media circunferencia: falta el factor dos.',null]);
 add(245,'Reflexión','El espejo es el eje y, así que cambia la posición horizontal y se mantiene la altura.',['El punto (3,−2) está tres unidades a la derecha y dos abajo del origen.','Reflejar respecto del eje y lo lleva tres a la izquierda, conservando las dos abajo.','La imagen es (−3,−2).'],'Ambos puntos tienen la misma coordenada y y distancias opuestas de tres al eje vertical.',['(3,2) refleja en el eje x, que no es el solicitado.',null,'(−3,2) cambia ambas coordenadas, equivalente a media vuelta alrededor del origen.','(2,−3) intercambia posiciones y signos sin respetar la distancia perpendicular al eje y.']);
 add(246,'Traslación','Partimos en (−1,4) y movemos tres a la derecha y dos hacia abajo.',['Aplicamos la componente horizontal: −1 + 3 = 2.','Aplicamos la componente vertical: 4 + (−2) = 2.','El punto de llegada es (2,2).'],'El desplazamiento entre llegada y partida es (2 − (−1), 2 − 4) = (3,−2), el vector pedido.',['(−4,6) resta el vector en lugar de sumarlo.',null,'(2,6) mueve hacia arriba dos en lugar de bajar dos.','(−3,1) no corresponde a sumar cada componente; conserva el orden horizontal y vertical.']);
 add(247,'Rotación','El giro es un cuarto de vuelta antihorario alrededor del origen.',['Para 90° antihorarios aplicamos (x,y) → (−y,x).','En (2,1), la nueva x es −1 y la nueva y es 2.','La imagen es (−1,2).'],'La distancia al origen conserva su cuadrado 2² + 1² = 5; el punto pasa del primer al segundo cuadrante.',['(1,−2) corresponde a un cuarto de vuelta horario, el sentido contrario.',null,'(−2,−1) corresponde a una media vuelta de 180°.','(2,−1) es una reflexión en el eje horizontal, no un giro de 90°.']);
 add(248,'Escala y semejanza','Una altura de 1,5 cm en escala 1:100 representa cien veces esa longitud real.',['Multiplicamos manteniendo centímetros: 1,5 × 100 = 150 cm.','Cien centímetros forman un metro: 150/100 = 1,5 m.','La altura real es 1,5 m; la conversión de unidad no cambia la distancia física.'],'1,5 m son 150 cm; divididos por la escala cien regresan a 1,5 cm del modelo.',['0,15 m son quince centímetros, diez veces menos que lo representado.',null,'15 m son 1.500 cm y equivaldrían a quince centímetros del modelo.','150 m conserva el número en centímetros pero cambia la etiqueta sin convertir la unidad.']);
 add(249,'Escala y semejanza','El lado de tres corresponde a nueve; debemos usar ese mismo factor en el lado de cinco.',['El factor de semejanza es k = 9/3 = 3.','Multiplicamos el lado correspondiente de cinco por el mismo factor: 5 × 3 = 15 cm.','El lado de cuatro pasaría a doce; el triángulo mayor tiene lados nueve, doce y quince.'],'Las razones 9/3, 12/4 y 15/5 valen todas tres.',['11 suma la diferencia 9 − 3 al lado cinco; la semejanza conserva razones, no diferencias.','12 corresponde al lado de cuatro, no al de cinco.',null,'45 multiplica cinco por nueve, pero nueve es un lado, no el factor de escala.']);
 add(250,'Frecuencia relativa','Queremos el porcentaje de los cuarenta estudiantes que representa el grupo de doce.',['Los favorables a estudiar de mañana son doce y el total son cuarenta.','La frecuencia relativa es 12/40 = 0,30.','Al multiplicar por cien se obtiene 30%.'],'Treinta de cada cien es la misma proporción que doce de cada cuarenta.',['12% toma el recuento doce como si ya estuviera sobre cien.',null,'40% confunde el total cuarenta con la proporción del subgrupo.','70% corresponde a los veintiocho que no eligieron estudiar de mañana.']);
 add(251,'Lectura y suma de frecuencias','Para hallar la venta total debemos incluir los cuatro días.',['Lunes y martes suman 12 + 15 = 27.','Agregamos miércoles: 27 + 9 = 36.','Agregamos jueves: 36 + 14 = 50 jugos.'],'La agrupación alternativa (12 + 14) + (15 + 9) = 26 + 24 también da cincuenta.',['36 omite los catorce jugos del jueves.','41 omite los nueve jugos del miércoles.',null,'60 excede en diez la suma de las ventas; suma cada día una sola vez.']);
 add(252,'Comparación de frecuencias','Se pregunta cuántos más hay en fútbol que en teatro, no cuántos hay juntos.',['Leemos fútbol dieciocho y teatro seis.','Restamos el grupo menor del mayor: 18 − 6 = 12.','Las doce personas son la diferencia entre ambos talleres.'],'Seis de teatro más doce de diferencia recuperan las dieciocho de fútbol.',['6 responde la cantidad en teatro, sin comparar.','9 es el dato de dibujo; no corresponde a los dos talleres preguntados.',null,'24 suma 18 + 6: responde cuántas inscripciones reúnen, no cuántas más tiene fútbol.']);
 add(253,'Promedio ponderado','La nota seis pesa más que la cinco; debemos respetar sus porcentajes de influencia.',['La prueba de cinco aporta 5 × 0,40 = 2,0.','La prueba de seis aporta 6 × 0,60 = 3,6.','Sumamos los aportes: 2,0 + 3,6 = 5,6.'],'5,6 está entre cinco y seis y más cerca de seis, la nota que pesa 60%.',['5,4 intercambia los pesos: 5 × 0,60 + 6 × 0,40.','5,5 es el promedio simple y daría el mismo peso a las dos pruebas.',null,'6,0 ignora por completo la primera nota, que sí representa el 40%.']);
 add(254,'Mediana','Los siete datos ya están ordenados; necesitamos el cuarto valor.',['La posición central es (7 + 1)/2 = 4.','Contamos 2, 4, 6, 8: el cuarto dato es ocho.','Quedan tres datos antes y tres después, por lo que la mediana es ocho.'],'Aquí media y mediana coinciden en ocho, pero la justificación de mediana es su posición.',['6 es el tercer dato y deja distinto número de observaciones a cada lado.','7 es la cantidad de datos, no el dato de la posición central.',null,'10 es el quinto valor, después del centro.']);
 add(255,'Cuartiles y dispersión central','El enunciado define Q1 como mediana de la mitad inferior excluyendo la mediana general.',['La mediana general es ocho y se excluye al partir el registro.','La mitad inferior queda formada por 2, 4 y 6.','La mediana de esa mitad es cuatro, por lo que Q1 = 4.'],'Usamos exactamente la convención indicada; otros métodos de cuartiles pueden dar resultados diferentes en muestras pequeñas.',['2 es el mínimo de la mitad inferior, no su dato central.',null,'6 es el máximo de la mitad inferior, no su mediana.','8 es la mediana general que la convención pidió excluir.']);
 add(256,'Percentiles','Hay que interpretar una posición relativa: el percentil 75 no expresa necesariamente setenta y cinco puntos.',['Ordenamos conceptualmente las puntuaciones de menor a mayor.','El nivel P75 deja aproximadamente 75% de los datos en o bajo ese valor.','La puntuación concreta dependerá del grupo; el número 75 identifica una posición porcentual.'],'La interpretación admite aproximación y empates; no informa la puntuación exacta ni asegura que sea el máximo.',['Superar solo al 25% confunde P75 con una posición cercana al primer cuartil.','75 puntos convierte la etiqueta de posición en una puntuación que no conocemos.',null,'Ser máximo no se deduce: P75 describe una posición relativa y no aporta el valor máximo del registro.']);
 add(257,'Cuartiles y dispersión central','Q1 y Q3 son los extremos de la caja; buscamos su ancho, no su suma.',['La caja empieza en diez y termina en dieciocho.','El rango intercuartílico es Q3 − Q1 = 18 − 10.','Su ancho es ocho unidades.'],'Sumar el ancho ocho a Q1 = 10 llega exactamente a Q3 = 18.',['4 es la mitad del ancho; no se pide dividirlo entre dos.',null,'10 es Q1, el extremo inicial, no la distancia entre extremos.','28 suma los extremos y no mide la separación de la caja.']);
 add(258,'Complemento de un evento','Si llover tiene probabilidad 0,35, no llover ocupa el resto del total.',['Llover y no llover son complementarios bajo las mismas condiciones.','Sus probabilidades suman uno.','P(no lluvia) = 1 − 0,35 = 0,65.'],'0,35 + 0,65 = 1; el complemento equivale a 65%.',['0,35 repite la probabilidad de lluvia en vez de su negación.','0,55 deja una suma de 0,90: faltarían posibilidades sin contar.',null,'1,35 supera uno y no puede ser probabilidad; se sumó donde correspondía restar.']);
 add(259,'Unión de eventos','En una extracción sirven tanto las bolitas verdes como las rojas.',['El total es 5 + 3 + 2 = 10 bolitas.','Verde y roja son colores excluyentes en esta bolsa: hay 5 + 2 = 7 favorables.','P(verde o roja) = 7/10.'],'Las tres amarillas son el complemento: 7/10 + 3/10 = 1.',['1/2 solo cuenta las cinco verdes y omite las dos rojas.',null,'3/10 cuenta las amarillas, exactamente las que no queremos.','8/10 supondría ocho favorables, pero solo hay cinco verdes y dos rojas.']);

 define('Eventos independientes',[
  'Para que ocurran dos eventos juntos en ensayos independientes, multiplicamos sus probabilidades. Independientes significa que conocer el primero no cambia las posibilidades del segundo.',
  'Dos lanzamientos de una moneda equilibrada son ensayos distintos: cada uno tiene cara y sello con probabilidad 1/2. Conviene listar los resultados como pares para no confundir dos lanzamientos con uno.'
 ],[
  'Imagina dos puertas seguidas, cada una con dos salidas de igual posibilidad. Pasar por una salida de la primera no elimina las salidas de la segunda.',
  'Elegir un recorrido completo requiere acertar una puerta y después la otra. No basta con que ocurra una de las dos elecciones: por eso la probabilidad del recorrido se hace menor.'
 ],'Se elige al azar uno de tres sobres y después se lanza un dado equilibrado. ¿Cuál es la probabilidad de elegir el sobre A y obtener seis?',[
  'Elegir A tiene probabilidad 1/3. Obtener seis tiene probabilidad 1/6, independientemente del sobre.',
  'La condición exige ambas cosas: (1/3) × (1/6) = 1/18.',
  'Podemos listar 3 × 6 = 18 pares sobre-cara de dado, igualmente probables. Solo uno es (A,6), lo que comprueba la multiplicación.'
 ],'Distingue ensayos diferentes y comprueba que el primero no altere al segundo antes de multiplicar probabilidades.');
 define('Extracción sin reposición',[
  'Sin reposición significa que el objeto extraído no vuelve a la bolsa. Cambian tanto el total disponible como la cantidad del color que salió.',
  'Para dos extracciones usamos P(primera y segunda) = P(primera) × P(segunda dada la primera). La segunda probabilidad es condicional: describe la bolsa después del primer resultado, no la original.'
 ],[
  'Imagina repartir naipes sin devolverlos al mazo. Después de dar un as ya quedan menos ases y una carta menos; el mazo del siguiente turno es distinto.',
  'Que la extracción sea al azar no significa que no cambie nada. Dibuja o tacha el primer objeto para contar correctamente lo que queda.'
 ],'Una caja tiene cuatro lápices negros y dos verdes. Si se sacan dos sin devolver el primero, ¿qué probabilidad hay de que ambos sean verdes?',[
  'La probabilidad de verde primero es 2/6.',
  'Si ya salió verde, quedan un verde y cuatro negros: cinco lápices. La probabilidad de verde segundo bajo esa condición es 1/5.',
  'La probabilidad de ambos verdes es (2/6)(1/5) = 2/30 = 1/15. Usar 2/6 otra vez supondría devolver el primer lápiz, contradiciendo el enunciado.'
 ],'Actualiza la composición después de la primera extracción. Distingue la probabilidad del segundo resultado dado el primero de la probabilidad de toda la secuencia.');
 define('Eventos incompatibles',[
  'Dos eventos son incompatibles cuando no pueden ocurrir en un mismo resultado. Su intersección, expresada por Y, está vacía y tiene probabilidad cero.',
  'No confundas incompatible con independiente. Si ocurre cara en un único lanzamiento, sello ya no puede ocurrir en ese mismo lanzamiento. No corresponde multiplicar las probabilidades como si fueran dos ensayos independientes.'
 ],[
  'Una puerta puede estar abierta o cerrada en el instante definido, pero no en ambos estados a la vez. Pedir ambos estados simultáneos es distinto de pedir cualquiera de los dos.',
  'La palabra Y exige coincidencia. La palabra O acepta cualquiera de las opciones. Antes de usar una operación, imagina si existe un resultado concreto que cumpla todo lo que se pide.'
 ],'Al elegir una tarjeta numerada del 1 al 4, ¿qué probabilidad hay de obtener simultáneamente un 2 y un 4? ¿Y de obtener 2 o 4?',[
  'Una tarjeta tiene un solo número. Ninguna tarjeta es a la vez 2 y 4: P(2 y 4) = 0.',
  'Para 2 o 4 sí sirven dos de las cuatro tarjetas, así que P(2 o 4) = 2/4 = 1/2.',
  'Multiplicar (1/4)(1/4) inventaría dos elecciones independientes. Aquí solo se realiza una elección y la coincidencia solicitada es imposible.'
 ],'Verifica si existe algún resultado que cumpla las dos condiciones en el mismo ensayo; si no existe, la intersección tiene probabilidad cero.');
 add(260,'Eventos independientes','Dos lanzamientos diferentes deben dar cara; no basta con acertar uno.',['Los pares posibles son cara-cara, cara-sello, sello-cara y sello-sello, igualmente probables.','Solo cara-cara cumple ambos requisitos: uno entre cuatro.','También (1/2)(1/2) = 1/4 por independencia.'],'La probabilidad de la secuencia es menor que la de cara en un solo lanzamiento.',['1/2 corresponde a cara en un lanzamiento, sin exigir el otro.','1/3 cuenta tres combinaciones sin distinguir cara-sello de sello-cara; esos órdenes son resultados distintos.',null,'3/4 es la probabilidad de al menos una cara, que también acepta cara-sello y sello-cara.']);
 add(261,'Extracción sin reposición','Queremos la secuencia de dos rojas sin devolver la primera a la caja.',['Primera roja: dos favorables entre cinco, probabilidad 2/5.','Después de una roja quedan una roja y tres azules: cuatro fichas. Segunda roja: 1/4.','Multiplicamos las etapas condicionadas: (2/5)(1/4) = 2/20 = 1/10.'],'Hay diez pares no ordenados de cinco fichas y solo uno contiene las dos rojas; coincide con 1/10.',[null,'2/5 solo mide que la primera sea roja y no exige una segunda roja.','1/5 no coincide con (2/5)(1/4): el denominador del segundo paso debe ser cuatro y el producto es 2/20.','4/25 multiplica 2/5 dos veces como si se devolviera la ficha: omite el cambio en la bolsa.']);
 add(262,'Unión de eventos','Basta obtener par o mayor que cuatro, contando una sola vez el seis que cumple ambas condiciones.',['Pares: 2, 4, 6. Mayores que cuatro: 5, 6.','La unión sin duplicados es 2, 4, 5, 6: cuatro caras.','La probabilidad es 4/6 = 2/3.'],'Sumar tres y dos sin quitar el seis repetido daría cinco casos, uno de más.',['1/3 cuenta solo dos caras; la unión contiene cuatro.','1/2 cuenta únicamente las tres caras pares y deja fuera el cinco.',null,'5/6 cuenta el seis dos veces al sumar las dos listas sin descontar su intersección.']);
 add(263,'Eventos incompatibles','En una sola cara del dado se exige que aparezcan el uno y el seis simultáneamente.',['Un lanzamiento produce solo uno de los números 1 a 6.','No hay cara etiquetada a la vez uno y seis: los eventos son incompatibles.','Hay cero favorables de seis posibles, por lo tanto la probabilidad es cero.'],'La condición Y exige ambos en el mismo lanzamiento; no se realizaron dos lanzamientos.',[null,'1/6 sería la probabilidad de una cara específica, pero ninguna cumple las dos condiciones.','1/3 corresponde a 1 o 6: acepta dos caras, una condición diferente de Y.','1 significa certeza; este evento es imposible y su probabilidad está en el extremo opuesto.']);
 add(264,'Comparación de frecuencias','Necesitamos la diferencia de asistencia del jueves frente al miércoles.',['La barra de jueves marca 35 y la de miércoles 15 personas.','Restamos 35 − 15 = 20.','El jueves asistieron veinte personas más.'],'15 + 20 = 35 recupera la asistencia del jueves.',['10 no es la diferencia entre 35 y 15; puede surgir al leer otra pareja de barras.','15 es la asistencia del miércoles, no la diferencia solicitada.',null,'50 suma las dos asistencias, en vez de calcular cuántas más hubo.']);
 add(265,'Comparación de frecuencias','Buscamos los dos días empatados en el mayor número de préstamos.',['Leemos lunes 12, martes 18, miércoles 18 y jueves 9.','El máximo es dieciocho y aparece en martes y miércoles.','La pareja es Mar y Mié.'],'No hay otro día con dieciocho préstamos; el empate ocurre exactamente en las dos barras más altas.',['Lunes tiene doce y martes dieciocho: no empatan.',null,'Miércoles tiene dieciocho y jueves nueve: no empatan.','Lunes y jueves tienen doce y nueve, respectivamente; ninguno alcanza el máximo.']);
 add(266,'Moda','El gráfico relaciona cada tiempo de espera con cuántas personas lo registraron.',['Las frecuencias para 5, 10, 15, 20 y 25 minutos son 4, 7, 12, 7 y 5 personas.','La frecuencia máxima es doce personas y corresponde a quince minutos.','La moda es el valor 15 min, no la frecuencia doce.'],'Quince minutos tiene una barra más alta que todos los otros tiempos.',['Cinco minutos aparece cuatro veces, no es el más frecuente.','Diez minutos aparece siete veces, menos que las doce de quince minutos.',null,'Veinte minutos también aparece siete veces; el empate de siete no es el máximo.']);
 add(267,'Media aritmética','Hay cuatro grupos y debemos repartir el total de ejercicios por igual entre ellos.',['Leemos las cuatro barras: 6, 8, 10 y 12 ejercicios.','Sumamos 6 + 8 + 10 + 12 = 36.','Dividimos por cuatro grupos: 36/4 = 9 ejercicios por grupo.'],'Cuatro grupos de nueve sumarían los mismos treinta y seis ejercicios.',['Ocho es solo el dato del grupo B; cuatro veces ocho daría treinta y dos.',null,'Diez es el dato de C; cuatro veces diez daría cuarenta.','Doce es el máximo del grupo D y no representa el reparto equitativo.']);
 add(268,'Frecuencia relativa','Necesitamos la proporción de B respecto de los inscritos en los tres talleres.',['Las barras muestran A = 16, B = 24 y C = 20: total 16 + 24 + 20 = 60.','La fracción de B es 24/60 = 0,40.','Convertimos a porcentaje: 40%.'],'40% de sesenta son veinticuatro, la barra de B.',['24% toma la frecuencia absoluta como si el total fuera cien.','30% de sesenta son dieciocho, no los veinticuatro de B.',null,'60% corresponde al complemento de B: A y C reúnen treinta y seis de sesenta.']);
 add(269,'Probabilidad simple','El gráfico entrega la composición de la bolsa; buscamos la fracción azul.',['Hay ocho rojas, doce azules y veinte verdes: total cuarenta.','Las favorables son las doce azules, de modo que P(azul) = 12/40.','Simplificamos dividiendo ambos términos por cuatro: 3/10.'],'3/10 equivale a 0,30 y el resto de colores ocupa 28/40 = 0,70.',['1/5 corresponde a 8/40, la proporción roja.',null,'1/2 corresponde a 20/40, la proporción verde.','3/5 compara doce azules con veinte verdes en vez de con las cuarenta fichas.']);
 add(270,'Variación porcentual','La referencia solicitada es enero, con ochenta ventas, no el total final de febrero.',['La barra de enero vale ochenta y la de febrero cien.','La diferencia es 100 − 80 = 20 ventas.','El aumento relativo es 20/80 × 100 = 25%.'],'25% de ochenta son veinte y ochenta más veinte da cien.',['20% toma la diferencia veinte como porcentaje o la divide por las cien ventas finales.',null,'40% de ochenta serían treinta y dos ventas adicionales, no veinte.','80% confunde las ochenta ventas iniciales con el aumento relativo.']);
 add(271,'Lectura y suma de frecuencias','La escala del presupuesto está en miles de pesos; hay que leer la barra de transporte con esa unidad.',['Identificamos la etiqueta Transp., cuyo valor es veinticinco.','Cada unidad representa mil pesos, según la leyenda.','Convertimos: 25 × 1.000 = $25.000.'],'Las otras barras son comida cuarenta, ahorro veinte y otros quince; no corresponden a transporte.',['15.000 lee la categoría Otros en vez de transporte.','20.000 lee la categoría Ahorro en vez de transporte.',null,'40.000 lee Comida, la barra mayor, pero no la solicitada.']);
 add(272,'Pendiente de una recta','La pendiente compara cuánto aumenta f al aumentar x.',['En el gráfico leemos (0,2) y (1,5).','El cambio vertical es 5 − 2 = 3 y el horizontal 1 − 0 = 1.','La pendiente es 3/1 = 3; también de cinco a ocho aumenta tres.'],'La regla f(x) = 2 + 3x reproduce todos los puntos del gráfico.',['Uno es el avance horizontal entre puntos, no el cociente de ambos cambios.','Dos es la salida inicial en x = 0, no la pendiente.',null,'Cinco es la salida en x = 1; hay que restarle la salida inicial para obtener el aumento.']);
 add(273,'Pendiente de una recta','La recta baja de diez a ocho cuando x pasa de cero a uno.',['Cambio vertical: 8 − 10 = −2.','Cambio horizontal: 1 − 0 = 1.','Pendiente = −2/1 = −2; los siguientes intervalos también bajan dos.'],'La regla y = 10 − 2x entrega diez, ocho, seis y cuatro.',['−3 indica una bajada de tres por unidad, pero el gráfico baja dos.',null,'Dos conserva la magnitud pero pierde el signo de disminución.','Diez es el valor inicial de la salida, no su cambio por unidad.']);
 add(274,'Función afín y tarifa fija','Hay que extender la regla afín que lleva de uno a cinco, nueve y trece.',['Por cada unidad de x, la salida aumenta cuatro: 5 − 1 = 9 − 5 = 13 − 9 = 4.','La salida inicial es uno, por lo que f(x) = 1 + 4x.','f(4) = 1 + 4 × 4 = 17; también 13 + 4 = 17.'],'La condición de función afín justifica conservar el aumento; no adivinamos un patrón sin esa condición.',['Catorce agrega solo uno al último dato, cuando cada avance agrega cuatro.','Quince agrega dos al último dato y no conserva la pendiente.','Dieciséis calcula solo 4x y olvida el uno inicial.',null]);
 add(275,'Función afín y tarifa fija','El costo fijo es lo que ya se cobra con cero usos, no lo que se agrega en cada uso.',['El punto de x = 0 muestra costo cuatro pesos.','Al avanzar a uno, dos y tres usos los costos son seis, ocho y diez.','La regla es C(x) = 4 + 2x, así que el fijo son $4.'],'C(0) = 4; el cambio de dos por uso cumple otro papel: la tarifa variable.',['Dos es el aumento por uso, no el cobro inicial.',null,'Seis es el total con un uso y ya incluye una parte variable.','Diez es el costo con tres usos, no la tarifa fija.']);
 add(276,'Área rectangular','El patio del dibujo tiene largo doce y ancho ocho metros; buscamos superficie.',['Leemos las medidas de la figura: 12 m y 8 m.','Área = largo × ancho = 12 × 8.','El resultado es 96 m².'],'Ocho filas de doce cuadrados de 1 m² cubren el patio.',['Veinte suma largo y ancho; no calcula superficie.','Cuarenta es el perímetro 2 × (12 + 8), que se mediría en metros.',null,'Ciento noventa y dos duplica la superficie que ya se contó una vez.']);
 add(277,'Perímetro','La reja recorre el borde del rectángulo de nueve por cuatro metros.',['El rectángulo tiene dos lados de nueve y dos de cuatro.','Sumamos 9 + 4 + 9 + 4 = 26.','Se necesitan 26 metros de reja.'],'Dos veces largo más ancho da 2 × (9 + 4) = 26 m; 36 m² sería el área.',['Trece solo recorre dos lados: nueve más cuatro.',null,'Treinta y seis multiplica nueve por cuatro y mide superficie, no borde.','Cincuenta y dos cuenta cada lado dos veces; veintiséis ya da una vuelta completa.']);
 add(278,'Área triangular','La figura señala base diez y altura perpendicular seis centímetros.',['El producto base por altura es 10 × 6 = 60 cm².','El triángulo ocupa la mitad de ese paralelogramo: 60/2 = 30.','El área es 30 cm²; la perpendicularidad de la altura permite aplicar la fórmula.'],'Dos copias del triángulo suman sesenta centímetros cuadrados.',['Dieciséis suma las medidas como longitudes y no obtiene superficie.',null,'Sesenta omite dividir por dos.','Ciento veinte duplica el producto en vez de tomar su mitad.']);
 add(279,'Área de un círculo','La figura indica radio cuatro, y usamos π = 3 para calcular superficie.',['El área es πr²; el radio no es el diámetro.','Elevamos el radio: 4² = 16 cm².','Multiplicamos por π: 3 × 16 = 48 cm².'],'El contorno sería veinticuatro centímetros y no mide la superficie solicitada.',['Doce calcula πr y omite elevar el radio al cuadrado.','Veinticuatro calcula 2πr, el contorno, otra magnitud.',null,'Noventa y seis agrega un factor dos extra a los cuarenta y ocho de superficie.']);
 add(280,'Cambios porcentuales sucesivos','Queremos decidir qué razonamiento describe un alza y una baja del 20% sobre bases sucesivas.',['Representamos el precio inicial con cien unidades: subir veinte por ciento lleva a ciento veinte.','La rebaja siguiente quita 20% de 120 = 24 unidades.','Quedan 120 − 24 = 96, es decir 96% del original: tiene razón Bastián.'],'Para cualquier precio P, el final es P × 1,20 × 0,80 = 0,96P; no depende de elegir cien.',['Ana usa la misma base para los dos porcentajes, aunque el segundo se aplica sobre ciento veinte.',null,'Camila aplica solo una rebaja del veinte por ciento al precio original y omite el aumento.','Diego invierte el efecto neto: el producto de los factores es 0,96, no 1,04.']);
 add(281,'Fracciones y unidad común','Hay que elegir un argumento que compare las cantidades completas, no solo sus numeradores o denominadores.',['Usamos doceavos: 3/4 = 9/12 y 5/6 = 10/12.','Con partes iguales, diez doceavos supera nueve doceavos.','Por tanto 5/6 es mayor y el argumento correcto es el que usa 10/12 y 9/12.'],'La diferencia es 1/12; ambos números están bajo uno, y cinco sextos queda más cerca de uno.',['Un denominador menor no basta para comparar cuando los numeradores también cambian.',null,'Tener denominadores distintos no implica igualdad; al expresarlos en doceavos aparecen cantidades diferentes.','Un numerador menor tampoco decide: hay que considerar a la vez tamaño y cantidad de partes.']);
 add(282,'Exponente negativo','Hay que corregir la confusión entre exponente negativo y resultado negativo.',['La base es positiva y el exponente −2 pide recíproco.','Calculamos 3² = 9; luego 3⁻² = 1/9.','La afirmación válida es la que expresa esa relación de recíprocos.'],'(1/9) × 3² = 1 comprueba la definición de exponente negativo.',[null,'−6 multiplica base por exponente; una potencia no se calcula 3 × (−2).','Nueve ignora el menos del exponente; es 3² y no su recíproco.','−1/9 toma el recíproco pero inventa un signo negativo delante del resultado.']);
 add(283,'Fracciones y unidad común','El decimal y la fracción pueden representar exactamente la misma cantidad.',['0,25 son veinticinco centésimos: 25/100.','Simplificamos dividiendo numerador y denominador por veinticinco: 25/100 = 1/4.','La división 1 ÷ 4 = 0,25 ofrece la justificación correcta.'],'Cuatro porciones de 0,25 suman uno, igual que cuatro cuartos.',['Usar notaciones distintas no implica valores distintos: decimal y fracción son representaciones.',null,'Que 1 + 4 = 5 es cierto, pero sumar numerador y denominador no justifica el valor de una fracción.','0,25 es menor que uno: tiene cero unidades enteras y veinticinco centésimos.']);
 add(284,'Inecuaciones','El error está en mantener el sentido de < después de dividir por −3.',['Partimos de −3x < 12.','Dividimos por −3: el cociente es −4 y la comparación se invierte.','Obtenemos x > −4. Con x = 0, la igualdad de prueba da 0 < 12, verdadero.'],'x = −5 no cumple porque −3(−5) = 15, mayor que doce; la prueba descarta x < −4.',['Mantener x < −4 admite −5, que no cumple la condición original.',null,'x < 4 cambia el signo del número límite sin justificar la comparación y admite valores como −5 que fallan.','x > 4 pierde el signo negativo de 12/(−3) y excluye soluciones válidas, como cero.']);
 add(285,'Productos algebraicos','El dos multiplica tanto a x como al tres dentro del paréntesis.',['Distribuimos correctamente: 2(x + 3) = 2x + 2 × 3 = 2x + 6.','La ecuación es 2x + 6 = 14; restamos seis: 2x = 8 y x = 4.','La comprobación 2(4 + 3) = 14 confirma la corrección.'],'La línea 2x + 3 = 14 describe otra ecuación: dejó de multiplicar el tres.',['Dividir ambos lados por dos al principio sería válido y daría x + 3 = 7; ese no fue el error.',null,'Sí hay solución: cuatro. Una distribución equivocada no vuelve imposible la ecuación original.','Distribuir significa multiplicar cada término por dos, no sumarle dos.']);
 add(286,'Función afín y tarifa fija','Hay que interpretar qué cambia con cada uso y qué se paga una sola vez en C(x) = 500 + 200x.',['Si no hay usos, C(0) = 500: ese es el cobro fijo.','Con un uso, C(1) = 700; con dos, C(2) = 900.','Cada uso aumenta el costo en doscientos pesos, por lo que quinientos es fijo y doscientos por uso.'],'C(x + 1) − C(x) = 200; el quinientos se cancela al comparar usos consecutivos.',['La posición de un número en la expresión no define su papel; quinientos no está multiplicando a x.',null,'El término quinientos permanece incluso con x = 0, por lo que sí hay costo fijo.','x representa cantidad de usos, no pesos; 200x convierte esa cantidad en costo variable.']);
 add(287,'Cuadráticas y soluciones reales','Debemos comprobar si algún número real puede tener cuadrado igual a −4.',['De x² + 4 = 0 despejamos x² = −4.','Todo cuadrado real es no negativo; no puede alcanzar −4.','La ecuación no tiene soluciones reales. En particular, ±2 dan 4 + 4 = 8, no cero.'],'El límite de la conclusión es el conjunto de los reales: aquí no se buscan soluciones complejas.',['Que (±2)² sea cuatro no basta: el enunciado suma otro cuatro y exige resultado cero.',null,'Con x = 0 obtenemos cuatro, no cero, por lo que no es solución.','Que x pueda variar no significa que todos sus valores cumplan la igualdad: ninguno real puede hacerlo.']);
 add(288,'Escala y semejanza','Todos los lados se multiplican por tres, así que la superficie cambia en dos direcciones.',['En una figura semejante, la razón de áreas es el cuadrado de la razón de longitudes.','Como k = 3, el área nueva es k² = 3² = 9 veces la original.','Por ejemplo, un rectángulo 2 × 4 tiene área ocho; ampliado a 6 × 12 tiene área setenta y dos, nueve veces ocho.'],'Se conservó la forma, pero 72/8 = 9 comprueba que el área no se conserva.',['Triplicar describe las longitudes; la superficie se amplía en dos dimensiones.',null,'Sumar tres unidades cuadradas no corresponde a una ampliación proporcional y depende arbitrariamente de la unidad.','Conservar la forma no implica conservar tamaño: las longitudes se triplicaron.']);
 add(289,'Teorema de Pitágoras','En a² + b² = c², la letra c debe representar la hipotenusa, no un cateto elegido arbitrariamente.',['Buscamos el ángulo recto de 90°.','El lado opuesto a ese ángulo es la hipotenusa; ese debe ser c.','Los dos lados que forman el ángulo recto son a y b, cuyo orden sí puede intercambiarse.'],'En un triángulo de tres, cuatro y cinco, solo 3² + 4² = 5² cumple el papel de la fórmula.',['La hipotenusa es el lado más largo, no el más corto.',null,'La orientación del dibujo puede girar; el lado vertical no es siempre hipotenusa.','Asignar c a un cateto dejaría el cuadrado de un lado corto igual a una suma mayor, contrario a la relación.']);
 add(290,'Cilindro: volumen','Con la misma altura, solo cambia el radio: debemos observar que aparece al cuadrado.',['El primer volumen es V₁ = πr²h.','Si el radio es 2r, V₂ = π(2r)²h = 4πr²h.','Por tanto V₂ = 4V₁: se cuadruplica.'],'La altura no cambia y el área de la base se multiplica por cuatro, por eso ocurre lo mismo con el volumen.',['Duplicar solo cuenta un factor dos, pero el radio aparece dos veces en r².','Triplicar no se deduce de duplicar el radio: (2r)² es 4r², no 3r².',null,'Mantener altura no mantiene volumen si la base ocupa más superficie.']);
 add(291,'Reflexión','Hay que reconocer qué propiedad se conserva al formar una imagen en un espejo.',['Cada punto queda a igual distancia del eje en el lado opuesto.','Ese movimiento conserva las distancias entre puntos: las longitudes de los lados no cambian.','También se conservan área y perímetro, aunque cambie la orientación.'],'Una reflexión es una isometría, término que significa que conserva distancias.',['El espejo no reduce el tamaño; el área permanece igual.',null,'Una reflexión invierte la orientación de la figura; una traslación no.','Si cada lado conserva su longitud, la suma de lados también se conserva: el perímetro no se duplica.']);
 add(292,'Mediana','Los tres datos permiten comparar posición central con reparto del total.',['Los valores ordenados son 2, 3 y 100. El central es tres: esa es la mediana.','El promedio usa la suma: (2 + 3 + 100)/3 = 105/3 = 35.','La afirmación correcta distingue mediana tres de media treinta y cinco.'],'El valor extremo cien eleva mucho la media, pero no desplaza el dato central de la lista.',['La mediana es el dato central (3); el promedio reparte la suma total (35).',null,'Cien es el máximo, no el valor central.','El primer dato ordenado es 2, pero el central es 3; ese valor corresponde a la mediana.']);
 add(293,'Extracción sin reposición','Sabemos que la primera ficha fue azul: hay que describir la bolsa que quedó, no la inicial.',['Al principio había tres rojas y dos azules, cinco en total.','Retiramos una azul y no la devolvemos: quedan tres rojas y una azul, cuatro en total.','Por eso P(azul segunda | azul primera) = 1/4; la afirmación de una azul entre cuatro es correcta.'],'La probabilidad de la secuencia azul-azul sería (2/5)(1/4) = 1/10, distinta de la probabilidad condicional pedida.',['2/5 reutiliza la composición inicial e ignora que salió una azul.',null,'Ser al azar no garantiza independencia: conocer el primer color cambia la bolsa disponible.','La segunda extracción tiene cuatro fichas porque una ya se retiró y no se devolvió.']);
 add(294,'Eventos incompatibles','Un solo lanzamiento no puede mostrar cara y sello simultáneamente.',['Cara y sello son resultados distintos del mismo ensayo.','Su intersección está vacía, así que P(cara y sello) = 0.','Multiplicar 1/2 × 1/2 describiría cara en un lanzamiento y sello en otro independiente, que no es este caso.'],'P(cara o sello) = 1 expresa certeza de uno de los dos; la condición Y exige ambos juntos.',['Que ambos resultados tengan probabilidad 1/2 no los hace independientes: cara y sello se excluyen en un lanzamiento.',null,'1/2 corresponde a cara sola o sello solo; la condición Y exige ambos en el mismo lanzamiento.','Cara o sello es una unión segura; cara y sello simultáneamente son incompatibles.']);
 add(295,'Cuartiles y dispersión central','Aunque las medianas coincidan, queremos comparar el ancho de las cajas centrales.',['Para A: RIC = 60 − 40 = 20.','Para B: RIC = 55 − 45 = 10.','Diez es menor que veinte, así que el intervalo del 50% central de B es más estrecho.'],'Los cuartiles no dan tamaños de curso ni valores mínimos; la conclusión solo compara dispersión central.',['Misma mediana solo garantiza igual posición central, no igual ancho entre Q1 y Q3.',null,'No conocemos la cantidad de estudiantes en ninguno de los cursos.','No se entregaron los mínimos; coincidir en la mediana no los obliga a coincidir.']);
 const preciseConcepts={
  211:'Raíz cuadrada principal',212:'Raíz cúbica',213:'Simplificación de radicales',
  214:'Cuadrado de una suma',215:'Diferencia de cuadrados',285:'Propiedad distributiva',
  240:'Volumen de prismas',241:'Volumen de prismas',242:'Superficie total de un cubo',
  238:'Área de un trapecio',239:'Área de un paralelogramo',
  245:'Reflexión y conservación de distancias',291:'Reflexión y conservación de distancias',
  255:'Cálculo de cuartiles',257:'Rango intercuartílico',295:'Rango intercuartílico',
  111:'Total de frecuencias',251:'Total de frecuencias',271:'Unidades de una escala gráfica',
  264:'Diferencia de frecuencias',252:'Diferencia de frecuencias',265:'Máximos y empates',
  216:'Términos semejantes',217:'Sustitución con signos',
  227:'Evaluación de función afín',229:'Evaluación de función afín',274:'Evaluación de función afín',
  275:'Interpretación de función afín',286:'Interpretación de función afín',
  231:'Extremo de una cuadrática',232:'Extremo de una cuadrática',
  220:'Escalas de longitudes',248:'Escalas de longitudes',249:'Semejanza de longitudes',288:'Escala de áreas'
 };

 global.CachasteM1Teach=function(bank){
  for(const q of bank){const row=rows[q.id];if(!row)continue;const base=lessons[row.key];
   const t={revision:'tutor-profesor-2026-10-15',qualityBefore:'básica',quality:'adecuada',aim:row.aim,foundation:base.foundation.slice(),application:row.application.slice(),check:row.check,intuition:base.intuition.slice(),example:{...base.example,steps:base.example.steps.slice()}};
   q.concept=preciseConcepts[q.id]||row.key;
   if([107,278].includes(q.id))q.transferGroup='m1-triangulo-10-6';
   q.explanations=q.options.map((option,i)=>i===q.answer?row.check:'Elegiste «'+option+'». '+row.wrong[i]+' Para corregirlo: '+row.application.join(' '));
   t.selectedFeedback=q.options.map((_,i)=>i===q.answer?null:{diagnosis:q.explanations[i],repair:row.application.slice()});
   q.teaching=t;q.steps=[row.aim,...t.foundation,...t.application,t.check];q.easy=[...t.intuition,...t.application].join('\n\n');q.example=[t.example.problem,...t.example.steps,t.example.bridge].join('\n\n');
  }
 };
})(typeof window!=='undefined'?window:globalThis);
