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
 global.CachasteM1Teach=function(bank){
  for(const q of bank){const row=rows[q.id];if(!row)continue;const base=lessons[row.key];
   const t={revision:'tutor-profesor-2026-10-15',qualityBefore:'básica',quality:'adecuada',aim:row.aim,foundation:base.foundation.slice(),application:row.application.slice(),check:row.check,intuition:base.intuition.slice(),example:{...base.example,steps:base.example.steps.slice()}};
   q.concept=row.key;
   q.explanations=q.options.map((option,i)=>i===q.answer?row.check:'Elegiste «'+option+'». '+row.wrong[i]+' Para corregirlo: '+row.application.join(' '));
   t.selectedFeedback=q.options.map((_,i)=>i===q.answer?null:{diagnosis:q.explanations[i],repair:row.application.slice()});
   q.teaching=t;q.steps=[row.aim,...t.foundation,...t.application,t.check];q.easy=[...t.intuition,...t.application].join('\n\n');q.example=[t.example.problem,...t.example.steps,t.example.bridge].join('\n\n');
  }
 };
})(typeof window!=='undefined'?window:globalThis);
