/* Pasada amplia de Ciencias: 25 situaciones originales con cambios de tarea explícitos. */
const sources={
 organic:['1FtkJYLz0SMmUWjjf7H2j_u8ox4bDWmGJ','PDV · Compendio 4: Química Orgánica','Grupos funcionales; tabla de funciones orgánicas'],
 solutions:['13iIDJCjokhTCm2w_rxxkzWX1C3RMmCKt','PDV · Compendio 2: Estequiometría, Disoluciones y Contaminación','Disoluciones químicas; unidades de concentración y mezclas'],
 atoms:['1DZ4ce-NoVWGMZwU0EtevBx2mIWeBTqWK','PDV · Compendio 1: Átomo, Tabla Periódica y Enlace Químico','Modelos atómicos; partículas; número atómico y número másico'],
 physics:['1WTyLTfNs5Xt3aiO50cxVvSJlurZs_a0W','CPECH · Física, Ciencias Plan Común','Método científico; sistemas de referencia; fuerzas; lentes y refracción'],
 electricity:['1Br-fqf2HsB1oeUK2RfiunAmsQrNrLD19','PDV · Cuaderno de ejercicios 5: Electricidad','Potencia eléctrica; circuitos; componentes y funciones'],
 meiosis:['1ALLN-fBd0OjLL29otkMF3MZ3nioIHkjL','FILADD · Guía teórica Eje 3-2: Meiosis','Anafase I; separación de homólogos; meiosis II'],
 cells:['1JMyd3VkMlsZD1EqHUVkwgHVuDu6koHRJ','CPECH · Biología, Ciencias Plan Común','Diferenciaciones de membrana; microvellosidades y absorción']
};
function trace(source,officialEje,officialPages,alignmentRationale){
 const [driveFileId,driveMaterial,driveSection]=sources[source];
 return {officialTemario:'https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf',officialEje,officialPages,driveFileId,driveMaterial,driveSection,alignmentRationale,reviewedAt:'2026-10-17',sourceUse:'Consulta de secciones del material; datos didácticos, enunciados, alternativas y soluciones originales.'};
}
const design=(baseTask,newTask)=>({baseTask,newTask,review:'Comparación editorial del procedimiento y de la evidencia; no basta cambiar cifras o nombres.'});
export const transferCasesBatch12=[
 {
  base:'Ciencias:SCI-030',id:'TR-SCI-051',
  question:'Una estudiante clasifica CH₃COOH como alcohol porque observa un grupo −OH. ¿Qué explicación corrige esa clasificación?',
  options:['Toda molécula que contiene oxígeno pertenece a la misma función orgánica','En CH₃COOH el −OH forma parte del grupo carboxilo, por lo que es un ácido carboxílico','El carbono del grupo −COOH está saturado y solo tiene enlaces simples','El grupo −OH impide que exista un enlace C=O en la molécula'],answer:1,
  steps:['Un alcohol tiene un grupo hidroxilo unido a un carbono saturado; reconocer solo las letras OH no basta para clasificar una función.','En CH₃COOH, el carbono unido al −OH también presenta un enlace doble con oxígeno, formando el grupo −C(=O)OH.','Ese conjunto es un carboxilo y caracteriza a un ácido carboxílico, a diferencia del grupo alcohol presente en CH₃CH₂OH.'],
  errors:['Las funciones orgánicas dependen de la conectividad y los enlaces, no solo de contener oxígeno.','','El carbono del carboxilo tiene un enlace doble con oxígeno; no es un carbono saturado.','La estructura descrita contiene ambos enlaces en el mismo grupo carboxilo.'],
  transferDesign:design('Identificar el grupo del etanol','Evaluar una regla incorrecta distinguiendo alcohol y ácido carboxílico'),
  sourceTrace:trace('organic','Química · Química orgánica, grupos funcionales',[12],'Distinguir conectividad y grupo funcional sin clasificar cualquier OH como alcohol.')
 },
 {
  base:'Ciencias:SCI-135',id:'TR-SCI-052',
  question:'Se comparan CH₃CH₂CHO y CH₃COCH₃, ambos de fórmula molecular C₃H₆O. ¿Qué diferencia permite reconocer al primero como aldehído y al segundo como cetona?',
  options:['El primero contiene tres carbonos y el segundo contiene dos','El primero carece de oxígeno y el segundo tiene dos oxígenos','El carbonilo del primero se une a un H; el del segundo, a dos grupos carbonados','La fórmula molecular por sí sola asigna funciones diferentes a ambos'],answer:2,
  steps:['Las dos moléculas tienen igual fórmula molecular, de modo que el número de átomos por sí solo no distingue sus funciones.','En CH₃CH₂CHO, el carbono del grupo carbonilo se enlaza a un hidrógeno; en CH₃COCH₃ se enlaza a dos grupos metilo.','La presencia de ese hidrógeno en el carbonilo identifica al aldehído; un carbonilo unido a dos grupos carbonados caracteriza a la cetona.'],
  errors:['Ambas fórmulas muestran tres átomos de carbono, por lo que esa diferencia no existe.','Cada compuesto tiene un átomo de oxígeno, según sus fórmulas.','','La fórmula molecular es igual; se requiere examinar la conectividad de los átomos.'],
  transferDesign:design('Escoger una molécula con grupo aldehído','Comparar isómeros y justificar la distinción aldehído-cetona por conectividad'),
  example:{problem:'Una fórmula condensada termina en −CH₂−CHO. Otra contiene −CH₂−CO−CH₂− en su interior. ¿Cómo se distingue la función de cada carbonilo?',steps:['En el extremo −CHO, el carbono del carbonilo está unido a un hidrógeno y a un grupo carbonado: corresponde a un aldehído.','En −CH₂−CO−CH₂−, el carbonilo está unido a grupos carbonados por ambos lados, formando una cetona.','El criterio es quién está enlazado al carbono del grupo C=O; contar oxígenos o carbonos totales no basta para distinguir estas funciones.'],bridge:'Dibuja los enlaces alrededor del carbonilo antes de asignar el grupo funcional.'},
  sourceTrace:trace('organic','Química · Química orgánica, aldehídos y cetonas',[12],'Reconocer funciones diferentes con la misma fórmula molecular.')
 },
 {
  base:'Ciencias:SCI-196',id:'TR-SCI-053',
  question:'Al representar un compuesto se cambia CH₃−C(=O)−O−CH₃ por CH₃−CH₂−O−CH₃. Se afirma que la función orgánica se conservó porque aún hay un oxígeno entre carbonos. ¿Cuál es la evaluación correcta?',
  options:['La función se conserva: ambos compuestos son ésteres','La función cambia de éster a alcohol por aparecer un grupo −OH','La función cambia de éster a aldehído por conservarse un grupo −CHO','La función cambia de éster a éter porque se eliminó el carbonilo adyacente al oxígeno'],answer:3,
  steps:['El éster inicial presenta el patrón −C(=O)−O−, donde un oxígeno está unido al carbono de un carbonilo.','En la estructura modificada ya no está ese carbonilo y queda un oxígeno enlazado por enlaces simples a dos grupos carbonados.','La modificación convierte la función éster en éter; conservar un oxígeno entre carbonos no garantiza conservar el grupo funcional.'],
  errors:['Un éster requiere el carbonilo junto al oxígeno; la segunda estructura no lo conserva.','La segunda estructura no contiene un grupo hidroxilo −OH.','La segunda estructura no presenta carbonilo ni grupo terminal −CHO.',''],
  transferDesign:design('Reconocer un éster en una fórmula condensada','Evaluar cómo una modificación de enlaces cambia la función orgánica'),
  example:{problem:'Compara CH₃CH₂−O−CH₂CH₃ con CH₃CH₂−C(=O)−O−CH₂CH₃. ¿Qué información adicional entrega el carbonilo de la segunda estructura?',steps:['En la primera estructura, el oxígeno une dos grupos carbonados por enlaces simples y no hay carbonilo adyacente: es un éter.','La segunda estructura contiene el patrón −C(=O)−O−, que define un éster; el oxígeno está unido al carbono de un carbonilo.','Ambas contienen oxígeno entre carbonos, pero solo una tiene el patrón completo del éster. La conectividad permite distinguirlas.'],bridge:'Revisa si el oxígeno vecino está junto a C=O; esa relación cambia la función.'},
  sourceTrace:trace('organic','Química · Química orgánica, ésteres y éteres',[12],'Justificar la función mediante el patrón de enlaces y no solo la presencia de oxígeno.')
 },
 {
  base:'Ciencias:SCI-197',id:'TR-SCI-054',
  question:'En CH₃−O−CH₂−CH₂−OH hay dos átomos de oxígeno en posiciones distintas. ¿Qué funciones se reconocen en esta estructura?',
  options:['Un éter y un alcohol','Dos éteres','Un éster y un alcohol','Un aldehído y un alcohol'],answer:0,
  steps:['El primer oxígeno está unido a dos grupos carbonados mediante enlaces simples, lo que forma un grupo éter.','El oxígeno terminal forma −OH y está unido a un carbono saturado, de modo que ese extremo presenta un grupo alcohol.','La molécula reúne ambas funciones; no se observa un enlace C=O que permitiera reconocer un éster o un aldehído.'],
  errors:['','El oxígeno terminal está unido a un hidrógeno, no a dos grupos carbonados como requiere un éter.','Un éster requiere un carbonilo adyacente al oxígeno; la estructura no lo tiene.','Un aldehído requiere un grupo −CHO con carbonilo, ausente en esta estructura.'],
  transferDesign:design('Nombrar la función de una molécula con un solo oxígeno','Distinguir dos funciones dentro de una molécula con dos entornos de oxígeno'),
  example:{problem:'En HO−CH₂−CH₂−CHO aparecen un −OH y un −CHO. ¿Por qué no deben clasificarse ambos oxígenos como si pertenecieran a la misma función?',steps:['El extremo HO−CH₂− tiene un hidroxilo unido a un carbono saturado: en ese extremo se reconoce un grupo alcohol.','El extremo −CHO contiene un carbonilo unido a hidrógeno, lo que permite reconocer un grupo aldehído.','Una molécula puede reunir funciones diferentes; cada grupo se identifica observando su propio entorno de enlaces.'],bridge:'Analiza cada oxígeno por separado y luego reúne las funciones que efectivamente aparecen.'},
  sourceTrace:trace('organic','Química · Química orgánica, funciones y representación molecular',[12],'Analizar por separado la conectividad de cada oxígeno en una molécula multifuncional.')
 },
 {
  base:'Ciencias:SCI-185',id:'TR-SCI-055',
  question:'Se usa una lente convergente como lupa, situando un objeto entre la lente y su foco. Los rayos que salen de la lente divergen, pero sus prolongaciones hacia atrás se encuentran. ¿Cómo debe interpretarse la imagen?',
  options:['Es real, porque los rayos se cruzan físicamente detrás de la lente','Es virtual: surge de las prolongaciones y no se recoge directamente en una pantalla','Es real y necesariamente invertida por tratarse de una lente convergente','No puede existir imagen si los rayos que salen de la lente divergen'],answer:1,
  steps:['La convergencia del tipo de lente no garantiza una imagen real para cualquier posición del objeto.','En el caso descrito se encuentran las prolongaciones hacia atrás, mientras que los rayos reales que salen de la lente divergen.','Ese encuentro aparente define una imagen virtual, como la de una lupa, que no se proyecta directamente sobre una pantalla.'],
  errors:['El enunciado distingue prolongaciones geométricas de rayos que se cruzan físicamente.','','Dentro de la distancia focal, una lente convergente puede producir una imagen virtual y derecha.','El encuentro aparente de prolongaciones permite observar una imagen virtual.'],
  transferDesign:design('Predecir el destino de rayos paralelos en una lente convergente','Distinguir imagen real y virtual a partir del trazado y la posición del objeto'),
  sourceTrace:trace('physics','Física · Ondas, formación de imágenes en lentes',[9],'Interpretar rayos y prolongaciones en el funcionamiento de una lupa.')
 },
 {
  base:'Ciencias:SCI-157',id:'TR-SCI-056',
  question:'Un vaso vacío tiene masa 40 g. Con agua, la balanza indica 190 g; después de disolver sal sin pérdidas indica 205 g. ¿Cuál es la masa de la solución, sin contar el vaso?',
  options:['15 g','150 g','165 g','205 g'],answer:2,
  steps:['La lectura final de la balanza incluye tanto el vaso como la solución; se debe descontar la masa del recipiente vacío.','Restamos 205 g − 40 g = 165 g para obtener la masa de solución.','Como comprobación, hay 190 − 40 = 150 g de agua y se añadieron 205 − 190 = 15 g de sal; 150 + 15 = 165 g.'],
  errors:['15 g es la masa de sal agregada, no la masa del conjunto formado por sal y agua.','150 g es la masa del agua antes de incorporar la sal.','','205 g incluye la masa del vaso, que el problema pide descontar.'],
  transferDesign:design('Sumar masas explícitas de soluto y solvente','Interpretar mediciones con tara y distinguir soluto, solvente y solución'),
  sourceTrace:trace('solutions','Química · Reacciones y estequiometría, componentes de soluciones',[13],'Usar conservación de masa y lecturas de balanza con recipiente.')
 },
 {
  base:'Ciencias:SCI-194',id:'TR-SCI-057',
  question:'Se mezclan 200 mL de una solución 1 M y 300 mL de otra 2 M del mismo soluto. No hay reacción y los volúmenes son aditivos. Se propone una concentración final de 1,5 M por promediar 1 y 2. ¿Qué corrección corresponde?',
  options:['La concentración es 1,5 M porque los volúmenes no influyen','La concentración es 3 M porque deben sumarse las molaridades','La concentración es 0,8 M porque hay 0,8 mol de soluto','La concentración es 1,6 M al dividir 0,8 mol por 0,5 L'],answer:3,
  steps:['Calculamos los moles de cada porción: 1 mol/L × 0,200 L = 0,200 mol y 2 mol/L × 0,300 L = 0,600 mol.','La mezcla contiene 0,800 mol en 0,500 L; su molaridad es 0,800 / 0,500 = 1,6 mol/L.','El promedio simple de las concentraciones exige iguales volúmenes; aquí la solución más concentrada aporta un volumen mayor.'],
  errors:['El promedio simple asigna igual peso a porciones de distinto volumen.','Las concentraciones no son cantidades de soluto que puedan sumarse directamente.','0,8 es la cantidad de moles; falta dividir por el volumen total en litros.',''],
  transferDesign:design('Hallar concentración al mezclar volúmenes iguales','Evaluar un promedio incorrecto con volúmenes desiguales y conservar moles'),
  sourceTrace:trace('solutions','Química · Reacciones y estequiometría, mezclas de soluciones',[13],'Distinguir cantidad de materia, concentración y volumen en una mezcla.')
 },
 {
  base:'Ciencias:SCI-175',id:'TR-SCI-058',
  question:'Dos modelos atómicos atribuyen igual carga positiva total al átomo: uno la distribuye por todo su volumen y otro la concentra en una región central pequeña. ¿Qué medición sería más directa para contrastar esas distribuciones con partículas alfa?',
  options:['Registrar la distribución de ángulos de desviación al atravesar una lámina delgada','Medir solamente la masa total de la lámina antes del ensayo','Anotar únicamente el color visible del metal utilizado','Contar los protones totales sin estudiar las trayectorias'],answer:0,
  steps:['Los modelos difieren en cómo se distribuye la carga, aunque coinciden en la cantidad total; medir solo esta última no los distingue.','Las trayectorias de partículas alfa permiten observar cómo interactúan con la distribución de carga que encuentran.','La proporción de desviaciones pequeñas y grandes aporta evidencia para contrastar un núcleo concentrado con una carga positiva difusa.'],
  errors:['','La masa total no mide directamente la distribución espacial de la carga que distingue a los modelos.','El color visible no permite seguir las interacciones ni los cambios de trayectoria de las partículas alfa.','La cantidad total de protones sería compatible con ambos modelos planteados.'],
  transferDesign:design('Relacionar grandes desviaciones con un núcleo pequeño','Elegir evidencia experimental que discrimine entre modelos con igual carga total'),
  sourceTrace:trace('atoms','Química · Estructura atómica, modelos de Thomson y Rutherford',[12],'Seleccionar una medición coherente con la diferencia entre dos modelos atómicos.')
 },
 {
  base:'Ciencias:SCI-188',id:'TR-SCI-059',
  question:'En una comparación didáctica de modelos astronómicos, el modelo A predice que Venus no puede verse casi lleno desde la Tierra y el modelo B permite esa fase. Se observa una fase casi llena. ¿Qué conclusión está justificada con esa evidencia?',
  options:['La observación demuestra que todas las predicciones de B son correctas','La observación contradice esa predicción de A y es compatible con B','La observación verifica A porque ambos modelos estudian a Venus','La observación permite concluir que ninguna teoría puede describir órbitas'],answer:1,
  steps:['Se comparan predicciones explícitas sobre una misma observación, por lo que la evidencia puede evaluarse respecto de cada modelo.','La fase registrada es incompatible con la predicción de A, mientras que B sí la permite.','Esto favorece B en esa comparación, pero una observación compatible no verifica automáticamente todas sus predicciones ni descarta cualquier otro modelo.'],
  errors:['Una observación compatible no demuestra todas las afirmaciones posibles de un modelo.','','Estudiar el mismo astro no vuelve compatible una predicción con un resultado que la contradice.','La evidencia cuestiona una predicción concreta, no la posibilidad de construir modelos astronómicos.'],
  transferDesign:design('Identificar una observación de Galileo','Evaluar predicciones contrapuestas y limitar la conclusión a la evidencia disponible'),
  sourceTrace:trace('physics','Física · Mecánica, modelos del sistema solar y evaluación de evidencia',[5,10],'Aplicar contraste de modelos a predicciones astronómicas dadas en el propio enunciado; referencia Drive para método científico.')
 },
 {
  base:'Ciencias:SCI-191',id:'TR-SCI-060',
  question:'Se calienta una solución en un recipiente cerrado y su volumen aumenta. No hay reacción ni pérdida de soluto o solvente. ¿Qué ocurre con la molalidad?',
  options:['Disminuye porque se divide por un volumen mayor','Aumenta porque la temperatura pasa a formar parte de su definición','Se mantiene, porque no cambian los moles de soluto ni los kilogramos de solvente','Se vuelve igual a la molaridad por tratarse de un recipiente cerrado'],answer:2,
  steps:['La molalidad se define como moles de soluto por kilogramo de solvente, y no utiliza el volumen de la solución como denominador.','En el proceso descrito se conservan la cantidad de soluto y la masa del solvente, aunque se produzca expansión térmica.','La razón entre esas cantidades permanece igual; la variación de volumen sí sería relevante para la molaridad.'],
  errors:['Ese razonamiento emplea volumen y confunde molalidad con molaridad.','La temperatura no es un factor de la definición de molalidad.','','Cerrar el recipiente no hace equivalentes kilogramos de solvente y litros de solución.'],
  transferDesign:design('Calcular molalidad a partir de moles y masa','Predecir invariancia y diferenciar molalidad de molaridad ante expansión térmica'),
  sourceTrace:trace('solutions','Química · Reacciones y estequiometría, unidades de concentración',[13],'Relacionar la definición de molalidad con cantidades conservadas.')
 },
 {
  base:'Ciencias:SCI-027',id:'TR-SCI-061',
  question:'Un átomo neutro tiene número másico A = 35 y contiene 18 neutrones. ¿Qué combinación de protones y electrones es compatible con esos datos?',
  options:['35 protones y 35 electrones','18 protones y 18 electrones','17 protones y 18 electrones','17 protones y 17 electrones'],answer:3,
  steps:['El número másico cuenta protones y neutrones, de modo que los protones son A − neutrones = 35 − 18 = 17.','El número atómico es, por tanto, 17; la neutralidad exige igual cantidad de protones y electrones.','La combinación compatible es 17 protones y 17 electrones; los 18 neutrones no contribuyen a la carga neta.'],
  errors:['35 es el total de nucleones y no la cantidad de protones por separado.','18 es la cantidad de neutrones dada, no el número atómico calculado.','17 protones y 18 electrones producirían un ion con carga −1, en contradicción con la neutralidad.',''],
  transferDesign:design('Igualar electrones a un número atómico dado','Deducir número atómico desde A y neutrones y aplicar neutralidad'),
  sourceTrace:trace('atoms','Química · Estructura atómica, partículas y números atómico y másico',[12],'Distinguir número másico, carga y composición nuclear.')
 },
 {
  base:'Ciencias:SCI-193',id:'TR-SCI-062',
  question:'Para un experimento se fija una concentración de 8 ppm masa/masa. Se prepararán 2,5 kg de solución. ¿Qué masa de soluto corresponde? Usa que 1 ppm masa/masa equivale a 1 mg de soluto por kg de solución.',
  options:['20 mg','3,2 mg','0,020 mg','20.000 mg'],answer:0,
  steps:['La equivalencia proporcionada permite leer 8 ppm como 8 mg de soluto por cada kilogramo de solución.','Multiplicamos esa razón por la masa total de solución: 8 mg/kg × 2,5 kg = 20 mg.','Los kilogramos se cancelan y queda una masa de soluto en miligramos; la concentración fijada es un dato del experimento, no una norma sanitaria.'],
  errors:['','3,2 resulta de dividir por la masa total cuando corresponde multiplicar la razón por ella.','0,020 es la masa expresada en gramos; acompañarla con mg introduce un error de factor mil.','20.000 mg multiplica innecesariamente por mil un resultado que ya estaba en miligramos.'],
  transferDesign:design('Convertir masa de soluto por kg a ppm','Determinar masa de soluto para una concentración y una masa final especificadas'),
  sourceTrace:trace('solutions','Química · Reacciones y estequiometría, concentración física en ppm',[13],'Resolver la relación inversa entre concentración en masa y cantidad de soluto.')
 },
 {
  base:'Ciencias:SCI-178',id:'TR-SCI-063',
  question:'Una solución de 200 g contiene 10 % m/m de un soluto no volátil. Se evaporan 50 g de agua y todo el soluto permanece disuelto. ¿Cuál es la nueva concentración aproximada?',
  options:['10 % m/m','13,3 % m/m','15 % m/m','20 % m/m'],answer:1,
  steps:['Inicialmente hay 0,10 × 200 g = 20 g de soluto; esa masa se conserva porque solo se evapora agua.','La masa final de solución es 200 − 50 = 150 g, y no la masa inicial de 200 g.','La nueva concentración es 20 / 150 × 100 ≈ 13,3 % m/m; aumenta al disminuir la masa de solvente.'],
  errors:['10 % usaría la masa inicial de solución e ignoraría el agua evaporada.','','15 % no resulta de dividir los 20 g de soluto por los 150 g de solución final.','20 g es la masa de soluto, no su porcentaje; el denominador final es 150 g.'],
  transferDesign:design('Calcular porcentaje desde masas iniciales','Conservar soluto y recalcular el denominador después de evaporar solvente'),
  sourceTrace:trace('solutions','Química · Reacciones y estequiometría, %m/m y soluciones',[13],'Relacionar conservación de masa de soluto con cambio de concentración.')
 },
 {
  base:'Ciencias:SCI-126',id:'TR-SCI-064',
  question:'Dos resistores, A de 6 Ω y B de 12 Ω, se conectan por separado a una misma fuente ideal de 12 V. ¿Qué comparación de potencias es correcta?',
  options:['A disipa 12 W y B disipa 24 W','Ambos disipan 24 W por tener igual voltaje','A disipa 24 W y B disipa 12 W','A disipa 2 W y B disipa 1 W'],answer:2,
  steps:['Con igual voltaje, la corriente depende de la resistencia: I_A = 12 / 6 = 2 A e I_B = 12 / 12 = 1 A.','La potencia se obtiene con P = V × I: A disipa 12 × 2 = 24 W y B disipa 12 × 1 = 12 W.','Duplicar la resistencia a voltaje constante reduce la potencia a la mitad; no debe confundirse esta condición con mantener corriente constante.'],
  errors:['La comparación invierte las potencias: a igual voltaje, mayor resistencia implica menor corriente.','La igualdad de voltajes no asegura igual potencia si las corrientes son diferentes.','','2 y 1 son las corrientes en amperes; aún falta multiplicarlas por el voltaje para obtener watts.'],
  transferDesign:design('Multiplicar voltaje por corriente explícita','Combinar ley de Ohm y potencia comparando resistencias a voltaje constante'),
  sourceTrace:trace('electricity','Física · Electricidad, ley de Ohm y potencia',[11],'Justificar la comparación de potencia identificando qué variable permanece constante.')
 },
 {
  base:'Ciencias:SCI-150',id:'TR-SCI-065',
  question:'En un modelo de circuito a 220 V hay dos cargas en paralelo de 880 W y 1760 W. Una protección ideal abre el circuito cuando la corriente total supera 10 A. ¿Qué predice el modelo cuando ambas funcionan a la vez?',
  options:['Circulan 4 A y la protección permanece cerrada','Circulan 8 A y la protección permanece cerrada','Circulan 10 A y la protección abre por igualdad con el umbral','Circulan 12 A y la protección abre por superar el umbral'],answer:3,
  steps:['Cada carga está sometida a 220 V; sus corrientes son 880 / 220 = 4 A y 1760 / 220 = 8 A.','En la parte común de un circuito paralelo se suman las corrientes de las ramas: 4 + 8 = 12 A.','Como 12 A supera el umbral ideal de 10 A definido en el problema, la protección interrumpe el circuito.'],
  errors:['4 A considera solo la carga de 880 W y omite la otra rama.','8 A considera solo la carga de 1760 W y omite la otra rama.','La suma calculada es 12 A; además, el modelo especifica superar el umbral, no igualarlo.',''],
  transferDesign:design('Nombrar un dispositivo de protección','Predecir la actuación de una protección desde potencias y corriente total'),
  sourceTrace:trace('electricity','Física · Electricidad, potencia e instalación domiciliaria',[11],'Aplicar un modelo ideal explícito; no es una instrucción para modificar instalaciones reales.')
 },
 {
  base:'Ciencias:SCI-187',id:'TR-SCI-066',
  question:'Dos vehículos avanzan hacia el este en una recta. Respecto del suelo, A va a 18 m/s y B a 12 m/s. Según la composición galileana de velocidades, ¿cómo se mueve B respecto de A?',
  options:['A 6 m/s hacia el oeste','A 6 m/s hacia el este','A 30 m/s hacia el este','A 12 m/s hacia el este'],answer:0,
  steps:['Tomamos el este como sentido positivo; las velocidades respecto del suelo son +18 m/s y +12 m/s.','La velocidad de B medida desde A es v_B/A = v_B/suelo − v_A/suelo = 12 − 18 = −6 m/s.','El signo negativo indica oeste: desde A, el vehículo B se queda atrás aunque ambos avancen hacia el este respecto del suelo.'],
  errors:['','6 m/s es la magnitud, pero el signo de 12 − 18 indica el sentido opuesto.','30 m/s suma velocidades que deben restarse para cambiar del suelo al marco de A.','12 m/s es la velocidad de B respecto del suelo, no respecto del vehículo A.'],
  transferDesign:design('Sumar movimiento de un pasajero y su tren','Cambiar entre dos marcos móviles y distinguir sentido relativo de sentido respecto del suelo'),
  sourceTrace:trace('physics','Física · Mecánica, sistemas de referencia y relatividad de Galileo',[10],'Calcular velocidad relativa en movimientos rectilíneos uniformes.')
 },
 {
  base:'Ciencias:SCI-015',id:'TR-SCI-067',
  question:'Una onda luminosa pasa del aire a un vidrio estacionario. En el vidrio su rapidez es dos tercios de la que tenía en el aire y la frecuencia se conserva. Si su longitud de onda inicial era 600 nm, ¿cuál es su longitud de onda en el vidrio?',
  options:['900 nm','400 nm','600 nm','1200 nm'],answer:1,
  steps:['La relación entre rapidez, longitud de onda y frecuencia es v = λf. El enunciado establece que f permanece constante.','Al reducirse la rapidez a dos tercios, la longitud de onda también se reduce a dos tercios: λ_vidrio = (2/3) × 600 nm.','El resultado es 400 nm; conservar la frecuencia al refractarse no implica conservar la rapidez ni la longitud de onda.'],
  errors:['900 nm invierte la razón: correspondería a aumentar, no a reducir, la longitud de onda.','','600 nm mantendría la misma longitud de onda pese al cambio de rapidez y frecuencia constante.','1200 nm duplica la longitud de onda sin aplicar la relación de dos tercios.'],
  transferDesign:design('Nombrar la refracción al cambiar de medio','Relacionar rapidez, frecuencia y longitud de onda durante la refracción'),
  sourceTrace:trace('physics','Física · Ondas, refracción y relación entre rapidez, frecuencia y longitud de onda',[9],'Aplicar una relación física para predecir un efecto del cambio de medio.')
 },
 {
  base:'Ciencias:SCI-042',id:'TR-SCI-068',
  question:'Se registran pares (volumen en cm³, masa en g): (2,8), (4,16) y (6,24). Se quiere representar los datos de manera que la pendiente permita estimar la densidad. ¿Qué elección de ejes corresponde?',
  options:['Volumen en el eje vertical y masa en el horizontal','Masa en el eje vertical y número de muestra en el horizontal','Masa en el eje vertical y volumen en el horizontal, con sus unidades','Porcentaje de muestras en un gráfico circular'],answer:2,
  steps:['La densidad relaciona masa con volumen: ρ = m / V, de modo que interesa una pendiente con unidades g/cm³.','Si la masa se ubica en el eje vertical y el volumen en el horizontal, la pendiente es Δm / ΔV.','Con los datos, (16 − 8) / (4 − 2) = 4 g/cm³; invertir los ejes daría el inverso de la densidad.'],
  errors:['Esos ejes producen una pendiente ΔV / Δm, inversa de la densidad solicitada.','El número de muestra no representa el volumen que requiere la relación física.','','Un gráfico circular muestra proporciones de un total, no la pendiente entre dos variables medidas.'],
  transferDesign:design('Elegir un gráfico de dispersión','Seleccionar ejes y unidades según la magnitud física que debe representar la pendiente'),
  sourceTrace:trace('atoms','Habilidades científicas · Comunicar; Química · propiedades físicas y densidad',[5,12],'Elegir una representación para un objetivo concreto y comprobar dimensionalmente su pendiente.')
 },
 {
  base:'Ciencias:SCI-147',id:'TR-SCI-069',
  question:'Un bloque de 2 kg se desliza hacia la derecha sobre una superficie horizontal. Su velocidad baja de 6 m/s a 2 m/s en 2 s con desaceleración constante. Si el roce es la única fuerza horizontal, ¿cuál es su magnitud y sentido?',
  options:['4 N hacia la derecha','8 N hacia la izquierda','0 N porque el bloque sigue moviéndose','4 N hacia la izquierda'],answer:3,
  steps:['Definimos la derecha como positiva y calculamos la aceleración: a = (2 − 6) / 2 = −2 m/s².','La fuerza horizontal neta es F = ma = 2 × (−2) = −4 N; por la condición del problema, esa fuerza es el roce.','La magnitud es 4 N y su sentido es hacia la izquierda, opuesto a la velocidad del bloque.'],
  errors:['Una fuerza hacia la derecha no explica la disminución de una velocidad dirigida hacia ese lado.','8 N omite dividir el cambio de velocidad por los 2 s transcurridos.','Seguir moviéndose no implica fuerza neta nula; la velocidad está cambiando.',''],
  transferDesign:design('Reconocer el roce como causa de frenado','Inferir fuerza y sentido desde datos de velocidad y la segunda ley de Newton'),
  sourceTrace:trace('physics','Física · Mecánica, aceleración, leyes de Newton y roce',[10],'Determinar una fuerza de roce a partir del cambio de movimiento medido.')
 },
 {
  base:'Ciencias:SCI-117',id:'TR-SCI-070',
  question:'Una célula tiene 2n = 6 cromosomas. En meiosis I, los dos homólogos de un par van al mismo polo; los demás pares se separan normalmente. Si la meiosis II ocurre sin nuevos errores, ¿cuántos cromosomas tendrán los cuatro productos?',
  options:['4, 4, 2 y 2','3, 3, 3 y 3','6, 6, 0 y 0','4, 3, 3 y 2'],answer:0,
  steps:['Normalmente cada producto haploide tendría n = 3 cromosomas, uno de cada par de homólogos.','El error de meiosis I deja una célula con un homólogo extra, 4 cromosomas, y la otra con uno menos, 2 cromosomas.','Al separarse las cromátidas normalmente en meiosis II, se producen dos células de 4 cromosomas y dos de 2.'],
  errors:['','3, 3, 3 y 3 sería el resultado sin el error de separación descrito.','Solo un par se distribuye incorrectamente; los demás homólogos se reparten con normalidad.','Ese patrón incluye productos de 3 cromosomas, pero el error en meiosis I afecta a ambas células que entran a meiosis II.'],
  transferDesign:design('Describir la separación normal de homólogos','Predecir productos meióticos cuando falla la separación de un par en meiosis I'),
  sourceTrace:trace('meiosis','Biología · Herencia y evolución, etapas de meiosis I y II',[8],'Usar separación de homólogos y de cromátidas para deducir un resultado, sin memorizar una enfermedad.')
 },
 {
  base:'Ciencias:SCI-169',id:'TR-SCI-071',
  question:'Se comparan dos grupos de enterocitos con igual número de células y la misma cantidad de transportadores por unidad de membrana. En el grupo B, microvellosidades más cortas reducen la superficie total. Manteniendo las demás condiciones, ¿qué predicción está mejor sustentada?',
  options:['B tendrá más transportadores totales porque sus microvellosidades son más cortas','B tendrá menor capacidad de absorción al disponer de menos superficie y transportadores totales','Ambos grupos tendrán igual capacidad por conservar el mismo número de células','B absorberá más porque una superficie menor siempre aumenta el transporte'],answer:1,
  steps:['La comparación mantiene constantes el número de células y la densidad de transportadores por unidad de membrana.','Al reducirse la superficie con igual densidad, el número total de transportadores disponibles también disminuye.','Se predice menor capacidad de absorción en B bajo esas condiciones; la explicación depende de la superficie funcional, no solo del número de células.'],
  errors:['Igual densidad en una superficie menor implica menos transportadores totales, no más.','','Igual número de células no garantiza igual superficie de membrana ni igual cantidad de transportadores.','La reducción de superficie no sustenta ese aumento; el enunciado controla las otras variables.'],
  transferDesign:design('Vincular microvellosidades con aumento de superficie','Predecir un resultado experimental controlando número de células y densidad de transportadores'),
  sourceTrace:trace('cells','Biología · Organización celular, relación estructura-función del enterocito',[6],'Explicar una predicción mediante superficie de membrana y capacidad de transporte.')
 },
 {
  base:'Ciencias:SCI-149',id:'TR-SCI-072',
  question:'Una batería ideal alimenta dos ramas en paralelo. Cada rama tiene una ampolleta y su propio interruptor en serie. Ambos interruptores están cerrados y las ampolletas encendidas. ¿Qué ocurre al abrir solo el interruptor de la rama A?',
  options:['Se apagan ambas porque cualquier interrupción corta todas las ramas','A permanece encendida y B se apaga','A se apaga y B permanece encendida porque conserva su camino cerrado','Ambas permanecen encendidas porque el circuito es paralelo'],answer:2,
  steps:['En paralelo, cada rama tiene su propio recorrido entre los dos terminales de la batería.','Abrir el interruptor de A interrumpe el camino de esa rama, por lo que deja de circular corriente por su ampolleta.','El recorrido de B sigue cerrado y conectado a la batería ideal, así que su ampolleta permanece encendida.'],
  errors:['La interrupción está dentro de A, no en un tramo común a ambas ramas.','La rama abierta es A; B conserva el interruptor cerrado y su conexión con la batería.','','Estar en paralelo no permite corriente por una rama cuyo propio recorrido fue abierto.'],
  transferDesign:design('Reconocer que una ampolleta necesita circuito cerrado','Razonar sobre continuidad independiente de ramas de un circuito paralelo'),
  sourceTrace:trace('electricity','Física · Electricidad, circuitos paralelos y componentes',[11],'Identificar el efecto de abrir una rama sin cortar el trayecto de la otra.')
 },
 {
  base:'Ciencias:SCI-143',id:'TR-SCI-073',
  question:'Dos líneas de plantas conservan distinto color de flor al cultivarse en condiciones similares. Al analizar un gen relacionado con pigmentos se encuentran variantes de su secuencia entre las líneas. ¿Qué hipótesis se puede investigar con esos antecedentes?',
  options:['El ambiente dejó de influir en cualquier característica de las plantas','La comparación demuestra que todas las diferencias de color tienen una sola causa','Las variantes encontradas son necesariamente genes de especies diferentes','Distintas variantes del mismo gen podrían contribuir a la diferencia de color'],answer:3,
  steps:['Los datos describen diferencias de secuencia en el mismo gen, lo que permite plantear la existencia de variantes o alelos.','La conservación de diferencias en condiciones similares es compatible con una contribución heredable al color, aunque no basta para probar causalidad.','Una hipótesis investigable es que esas variantes contribuyen al rasgo; habría que contrastarla con más evidencia y controles.'],
  errors:['Mantener algunas condiciones similares no demuestra que el ambiente carezca de influencia en todo rasgo.','La asociación observada no identifica por sí sola una causa única de todas las diferencias.','El enunciado compara variantes de un mismo gen, no establece que correspondan a especies distintas.',''],
  transferDesign:design('Reconocer alelos como explicación posible de variación heredable','Plantear una hipótesis molecular sin convertir asociación en prueba causal'),
  sourceTrace:trace('cells','Biología · Herencia y evolución, variabilidad y evidencia molecular',[8],'Relacionar variación genética y fenotípica delimitando la fuerza de la evidencia.')
 },
 {
  base:'Ciencias:SCI-186',id:'TR-SCI-074',
  question:'Dos fuentes emiten una misma línea luminosa cuando están en reposo. Un observador registra en A una longitud de onda menor que la de reposo y en B una mayor. Considerando solo el efecto Doppler, ¿qué interpretación corresponde?',
  options:['A se acerca y B se aleja respecto del observador','A se aleja y B se acerca respecto del observador','Ambas se alejan, porque toda onda observada se alarga','Ambas están en reposo, porque la longitud de onda solo mide intensidad'],answer:0,
  steps:['El dato de referencia es la longitud de onda de la misma emisión en reposo, lo que permite comparar ambos desplazamientos.','Una menor longitud de onda corresponde a un corrimiento hacia el azul por acercamiento; una mayor, hacia el rojo por alejamiento.','Por tanto, A se acerca y B se aleja bajo la condición del problema de atribuir el cambio solo al efecto Doppler.'],
  errors:['','La opción invierte el sentido de los corrimientos hacia menores y mayores longitudes de onda.','El acercamiento puede acortar la longitud de onda observada; no todo movimiento la alarga.','La intensidad y la longitud de onda son magnitudes distintas; el cambio descrito tiene información de movimiento.'],
  transferDesign:design('Predecir el cambio de luz de una fuente que se aleja','Inferir movimientos contrapuestos desde dos espectros relativos a una referencia'),
  sourceTrace:trace('physics','Física · Ondas, efecto Doppler en ondas electromagnéticas',[9],'Aplicar cualitativamente desplazamientos espectrales; usar el temario vigente para delimitar el caso a luz, no sonido.')
 },
 {
  base:'Ciencias:SCI-145',id:'TR-SCI-075',
  question:'Se estudia cómo distintas concentraciones de CO₂ afectan la producción de oxígeno de algas iluminadas. Se mantienen iguales la temperatura, la biomasa y el tiempo de observación. ¿Qué registro cuantifica mejor la variable dependiente?',
  options:['La concentración de CO₂ preparada para cada tratamiento','Los mililitros de O₂ producidos por minuto en cada tratamiento','La temperatura fijada igual para todos los recipientes','Los minutos de observación fijados antes de iniciar el ensayo'],answer:1,
  steps:['La concentración de CO₂ es el factor modificado para comparar tratamientos; temperatura, biomasa y tiempo se controlan.','La respuesta estudiada es la producción de oxígeno, por lo que debe medirse una cantidad relacionada directamente con ella.','Registrar mililitros de O₂ por minuto cuantifica esa respuesta y permite comparar los tratamientos en una unidad común.'],
  errors:['La concentración de CO₂ es la variable independiente manipulada por el equipo.','','La temperatura es una condición controlada, no el resultado que se quiere explicar.','El tiempo se fija como condición común; por sí solo no mide producción de oxígeno.'],
  transferDesign:design('Elegir qué medir para evaluar crecimiento vegetal','Operacionalizar una variable de respuesta y separarla de tratamiento y controles'),
  sourceTrace:trace('cells','Habilidades científicas · Variables; Biología · fotosíntesis',[4,8],'Seleccionar una medida con unidad y relación directa con el efecto investigado.')
 }
];
