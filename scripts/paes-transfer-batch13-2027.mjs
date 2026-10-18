/* Doce casos del módulo común: la segunda evidencia debe estar disponible en cada ruta. */
const materials={
 chemistry:['13iIDJCjokhTCm2w_rxxkzWX1C3RMmCKt','PDV · Compendio 2: Estequiometría, Disoluciones y Contaminación','Estequiometría; mol y masa molar; dilución'],
 atoms:['1DZ4ce-NoVWGMZwU0EtevBx2mIWeBTqWK','PDV · Compendio 1: Átomo, Tabla Periódica y Enlace Químico','Número atómico, número másico e isótopos'],
 physics:['1WTyLTfNs5Xt3aiO50cxVvSJlurZs_a0W','CPECH · Física, Ciencias Plan Común','Ondas electromagnéticas; frecuencia y período; rapidez media; segunda ley de Newton'],
 biology:['1JMyd3VkMlsZD1EqHUVkwgHVuDu6koHRJ','CPECH · Biología, Ciencias Plan Común','Fotosíntesis; variabilidad genética; evolución y selección natural'],
 reproduction:['1CRIRkNfTXcOEMlvi4Xul4aM0mF9iAngA','FILADD · Guía teórica Eje 2-1: Sexualidad Humana','Métodos anticonceptivos; prevención de infecciones de transmisión sexual'],
 meiosis:['1ALLN-fBd0OjLL29otkMF3MZ3nioIHkjL','FILADD · Guía teórica Eje 3-2: Meiosis','Profase I; entrecruzamiento y variabilidad genética']
};
function trace(material,officialEje,officialPages,alignmentRationale){
 const [driveFileId,driveMaterial,driveSection]=materials[material];
 return {officialTemario:'https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf',officialEje,officialPages,driveFileId,driveMaterial,driveSection,alignmentRationale,reviewedAt:'2026-10-18',sourceUse:'Consulta conceptual del material; situaciones, datos, alternativas y soluciones originales.'};
}
const design=(baseTask,newTask)=>({baseTask,newTask,review:'Caso común disponible en las cuatro rutas; cambio de tarea respecto del ítem base.'});
export const transferCasesBatch13=[
 {
  base:'Ciencias:SCI-033',id:'TR-SCI-076',
  question:'En la reacción 2H₂ + O₂ → 2H₂O se mezclan 3 mol de H₂ y 2 mol de O₂. La reacción avanza hasta agotar un reactivo. ¿Qué resultado respeta la proporción de la ecuación?',
  options:['Se forman 4 mol de agua y no queda oxígeno','Se forman 3 mol de agua y quedan 0,5 mol de oxígeno','Se forman 5 mol de agua y no queda ningún reactivo','Se forman 1,5 mol de agua y quedan 2 mol de oxígeno'],answer:1,
  steps:['La ecuación indica que por cada dos moles de hidrógeno se consume un mol de oxígeno y se forman dos moles de agua.','Los 3 mol de hidrógeno requieren 1,5 mol de oxígeno, cantidad menor que los 2 mol disponibles; se agota primero el hidrógeno.','Se producen 3 mol de agua y sobran 2 − 1,5 = 0,5 mol de oxígeno; no se pueden sumar los moles de reactantes como si todos fueran agua.'],
  errors:['Producir 4 mol de agua requiere 4 mol de hidrógeno, pero solo se dispone de 3 mol.','','Sumar los moles iniciales ignora la proporción estequiométrica y el reactivo que se agota.','La relación entre hidrógeno y agua es 2:2, y la formación de agua consume parte del oxígeno.'],
  transferDesign:design('Seleccionar coeficientes de balance','Aplicar la ecuación a una mezcla no estequiométrica y calcular el exceso'),
  sourceTrace:trace('chemistry','Química · Reacciones y estequiometría',[13],'Conservar átomos al interpretar proporciones molares y reactivo limitante.')
 },
 {
  base:'Ciencias:SCI-036',id:'TR-SCI-077',
  question:'Se diluyen 100 mL de una solución 0,8 M hasta completar 400 mL y se homogeneiza. Luego se retiran 50 mL. Sin reacción ni pérdida de soluto durante la dilución, ¿qué concentración tiene la porción retirada y cuántos moles contiene?',
  options:['0,8 M y 0,040 mol','0,2 M y 0,080 mol','0,2 M y 0,010 mol','0,1 M y 0,005 mol'],answer:2,
  steps:['La solución inicial contiene 0,8 mol/L × 0,100 L = 0,080 mol de soluto, que se conservan al agregar solvente.','Al completar 0,400 L, la concentración es 0,080 / 0,400 = 0,2 M; una porción de la mezcla homogénea tiene esa misma concentración.','Los 50 mL retirados equivalen a 0,050 L y contienen 0,2 × 0,050 = 0,010 mol, no todos los moles de la solución preparada.'],
  errors:['La concentración inicial cambia al cuadruplicarse el volumen sin aumentar los moles.','0,080 mol es la cantidad en los 400 mL completos, no en la porción retirada.','','Retirar parte de una solución homogénea no reduce su concentración a la mitad.'],
  transferDesign:design('Predecir que agregar agua disminuye concentración','Distinguir conservación durante dilución y cantidad contenida en una alícuota'),
  sourceTrace:trace('chemistry','Química · Reacciones y estequiometría, dilución',[13],'Diferenciar concentración intensiva y cantidad de soluto en una porción.')
 },
 {
  base:'Ciencias:SCI-171',id:'TR-SCI-078',
  question:'Una onda de luz visible de longitud de onda 500 nm y una onda de radio de longitud de onda 1 m se propagan en el vacío. ¿Qué comparación es correcta?',
  options:['Tienen igual rapidez y la luz visible tiene mayor frecuencia','La luz visible viaja más rápido porque tiene mayor frecuencia','Tienen igual frecuencia porque ambas son electromagnéticas','La onda de radio tiene mayor frecuencia porque su longitud de onda es mayor'],answer:0,
  steps:['Todas las ondas electromagnéticas se propagan con la misma rapidez en el vacío, independientemente de su región del espectro.','La relación c = λf indica que, al conservarse la rapidez, una menor longitud de onda corresponde a una mayor frecuencia.','500 nm equivale a 0,0000005 m, mucho menos que 1 m; por eso la luz visible tiene mayor frecuencia y la misma rapidez que la onda de radio.'],
  errors:['','Una frecuencia mayor no cambia la rapidez de propagación electromagnética en el vacío.','Pertenecer al mismo tipo de onda no implica tener la misma frecuencia.','Con rapidez fija, longitud de onda y frecuencia varían en sentidos opuestos.'],
  transferDesign:design('Reconocer una región de mayor frecuencia que la visible','Relacionar rapidez, longitud de onda y frecuencia entre dos regiones'),
  sourceTrace:trace('physics','Física · Ondas, espectro electromagnético',[9],'Comparar propiedades de dos radiaciones usando una condición de propagación común.')
 },
 {
  base:'Ciencias:SCI-067',id:'TR-SCI-079',
  question:'Un detector registra máximos consecutivos de una señal periódica en t = 0,1 s, 0,5 s y 0,9 s. ¿Cuáles son el período y la frecuencia de la señal?',
  options:['0,9 s y 3,3 Hz','0,8 s y 1,25 Hz','0,4 s y 0,4 Hz','0,4 s y 2,5 Hz'],answer:3,
  steps:['El período se obtiene entre dos estados equivalentes consecutivos: 0,5 − 0,1 = 0,4 s, igual que 0,9 − 0,5.','Entre el primer y el tercer máximo transcurren dos períodos, no tres; contar marcas no equivale a contar ciclos completos.','La frecuencia es el inverso del período, f = 1 / 0,4 = 2,5 Hz, que representa 2,5 ciclos por segundo.'],
  errors:['El primer máximo no ocurre en cero y tres máximos consecutivos delimitan dos ciclos completos.','0,8 s abarca dos períodos, desde el primer máximo al tercero.','Período y frecuencia tienen unidades distintas y se relacionan mediante una razón inversa.',''],
  transferDesign:design('Dividir oscilaciones totales por tiempo','Interpretar marcas temporales y distinguir cantidad de máximos de intervalos'),
  sourceTrace:trace('physics','Física · Ondas, frecuencia y período',[9],'Obtener magnitudes de una señal periódica a partir de mediciones temporales.')
 },
 {
  base:'Ciencias:SCI-070',id:'TR-SCI-080',
  question:'Se describen tres especies: P tiene 17 protones, 18 neutrones y 18 electrones; Q tiene 17 protones, 20 neutrones y 17 electrones; R tiene 18 protones, 18 neutrones y 18 electrones. ¿Qué par corresponde a isótopos del mismo elemento?',
  options:['P y R, porque tienen igual número de electrones','P y Q, porque tienen igual número de protones y distinto número de neutrones','Q y R, porque ambos son neutros','Ningún par, porque un ion no puede pertenecer al mismo elemento que un átomo neutro'],answer:1,
  steps:['La identidad de un elemento está determinada por su número de protones; el número de electrones determina su carga, no su identidad.','P y Q tienen 17 protones, pero sus cantidades de neutrones son diferentes: 18 y 20; sus números másicos son 35 y 37.','Por ello corresponden a isótopos del mismo elemento, aunque P tenga carga negativa y Q sea neutro; R pertenece a otro elemento.'],
  errors:['La coincidencia de electrones no basta: P y R tienen distinto número atómico.','','Ser neutro no identifica un elemento; Q y R tienen distinto número de protones.','Ganar o perder electrones cambia la carga sin cambiar el número de protones del elemento.'],
  transferDesign:design('Nombrar átomos con igual elemento y distintos neutrones','Seleccionar un par en datos de protones, neutrones y electrones sin confundir carga e identidad'),
  sourceTrace:trace('atoms','Química · Estructura atómica',[12],'Distinguir número atómico, número másico y carga al comparar especies.')
 },
 {
  base:'Ciencias:SCI-034',id:'TR-SCI-081',
  question:'Dos muestras puras contienen 30 g de H₂O y 30 g de CO₂, respectivamente. Sus masas molares son 18 g/mol y 44 g/mol. Se afirma que ambas contienen igual número de moléculas por tener igual masa. ¿Cómo se evalúa esa afirmación?',
  options:['Es incorrecta: el agua tiene más moles y, por tanto, más moléculas','Es correcta: igual masa siempre implica igual cantidad de moléculas','Es incorrecta: el CO₂ tiene más moléculas porque su masa molar es mayor','Es correcta: ambas moléculas tienen tres átomos'],answer:0,
  steps:['El número de moles se calcula dividiendo la masa de la muestra por su masa molar; igual masa no garantiza iguales moles.','Para el agua se obtiene 30 / 18 ≈ 1,67 mol y para el dióxido de carbono 30 / 44 ≈ 0,68 mol.','Cada mol contiene la misma cantidad de entidades; como la muestra de agua tiene más moles, contiene más moléculas.'],
  errors:['','Las masas molares son distintas, de modo que la misma masa corresponde a distintas cantidades de sustancia.','Una mayor masa molar implica menos moles para una misma masa de muestra.','Los átomos por molécula no determinan cuántas moléculas hay en 30 g de cada sustancia.'],
  transferDesign:design('Calcular moles de una única sustancia','Evaluar una inferencia de igualdad de partículas comparando dos masas molares'),
  sourceTrace:trace('chemistry','Química · Reacciones y estequiometría, mol y masa molar',[13],'Relacionar masa, cantidad de sustancia y número de moléculas sin confundirlos.')
 },
 {
  base:'Ciencias:SCI-016',id:'TR-SCI-082',
  question:'Un vehículo recorre los primeros 60 km a 60 km/h y los siguientes 60 km a 30 km/h, sin detenciones. Una persona propone una rapidez media de 45 km/h por promediar ambas rapideces. ¿Cuál es el cálculo correcto para el viaje completo?',
  options:['45 km/h, porque los tramos tienen igual distancia','90 km/h, porque se suman las rapideces','40 km/h, porque recorre 120 km en 3 horas','30 km/h, porque el último tramo determina el promedio'],answer:2,
  steps:['Los tiempos de los dos tramos son 60 / 60 = 1 hora y 60 / 30 = 2 horas; el vehículo permanece más tiempo a la rapidez menor.','La rapidez media del viaje es distancia total dividida por tiempo total: (60 + 60) / (1 + 2) = 40 km/h.','El promedio simple de rapideces corresponde a intervalos de igual duración; aquí las duraciones son distintas aunque las distancias coincidan.'],
  errors:['Iguales distancias no equivalen a iguales tiempos y no justifican el promedio simple de rapideces.','Las rapideces de etapas sucesivas no se suman para obtener la rapidez media del recorrido.','','La rapidez media considera todo el recorrido y todo el tiempo, no únicamente la última etapa.'],
  transferDesign:design('Dividir una distancia por un tiempo dado','Evaluar un promedio incorrecto en dos tramos con tiempos desiguales'),
  sourceTrace:trace('physics','Física · Mecánica, movimiento rectilíneo',[10],'Calcular e interpretar rapidez media a partir de tiempos de etapas diferentes.')
 },
 {
  base:'Ciencias:SCI-017',id:'TR-SCI-083',
  question:'Un carrito de 2 kg acelera 3 m/s² bajo una fuerza neta horizontal constante. Se repite el ensayo con una masa total de 4 kg y la misma fuerza neta. ¿Qué predicción corresponde a la segunda ley de Newton?',
  options:['6 m/s², porque la aceleración crece con la masa','3 m/s², porque la fuerza neta no cambió','12 m/s², porque se multiplica masa por aceleración','1,5 m/s², porque al duplicarse la masa con fuerza fija la aceleración se reduce a la mitad'],answer:3,
  steps:['En el ensayo inicial, la fuerza neta es F = ma = 2 × 3 = 6 N; esa fuerza se mantiene en la repetición.','Con la masa total de 4 kg, la aceleración será a = F / m = 6 / 4 = 1,5 m/s².','La comparación muestra una relación inversa entre masa y aceleración cuando la fuerza neta está controlada y permanece constante.'],
  errors:['Con fuerza neta constante, aumentar la masa reduce la aceleración, no la aumenta.','Mantener la fuerza no mantiene la aceleración cuando cambia la masa total del carrito.','El producto de masa por aceleración es una fuerza y no puede interpretarse como una aceleración.',''],
  transferDesign:design('Calcular fuerza para una masa y aceleración dadas','Predecir el efecto de variar la masa manteniendo controlada la fuerza neta'),
  sourceTrace:trace('physics','Física · Mecánica, leyes de Newton',[10],'Interpretar una relación entre variables en dos ensayos controlados.')
 },
 {
  base:'Ciencias:SCI-010',id:'TR-SCI-084',
  question:'En un ensayo con algas se marca el oxígeno del agua y se usa CO₂ sin esa marca. Tras iluminar, la marca se detecta en el O₂ liberado. ¿Qué conclusión está apoyada directamente por este resultado?',
  options:['El carbono de la glucosa proviene del agua','El oxígeno molecular liberado procede del agua utilizada','Las algas no incorporan CO₂ durante la fotosíntesis','Todos los átomos de los productos fotosintéticos provienen del agua'],answer:1,
  steps:['El marcador permite seguir los átomos de oxígeno que estaban en el agua suministrada, distinguiéndolos de los del dióxido de carbono.','Su presencia en el oxígeno molecular liberado apoya que el agua es la fuente de ese producto de la fotosíntesis oxigénica.','El ensayo no muestra que todos los productos provengan del agua ni elimina la incorporación de carbono desde el CO₂.'],
  errors:['Se siguieron átomos de oxígeno, no átomos de carbono; el agua además no contiene carbono.','','Identificar la fuente del O₂ no implica que el CO₂ no participe en la fijación de carbono.','La evidencia se refiere al O₂ liberado y no determina el origen de todos los átomos de todos los productos.'],
  transferDesign:design('Recordar la fuente del oxígeno liberado','Interpretar un experimento de trazador y delimitar la conclusión'),
  sourceTrace:trace('biology','Biología · Organismos y ambiente, fotosíntesis',[8],'Evaluar evidencia experimental sobre los reactantes y productos de la fotosíntesis.')
 },
 {
  base:'Ciencias:SCI-006',id:'TR-SCI-085',
  question:'Una ficha didáctica describe el método X como una barrera física y el método Y como hormonal, con inhibición de la ovulación. Se concluye que Y reduce la transmisión de ITS por el mismo mecanismo que X. ¿Qué evaluación corresponde?',
  options:['La conclusión es válida porque cualquier anticonceptivo impide toda infección','La conclusión es válida porque inhibir la ovulación bloquea físicamente a los agentes infecciosos','La conclusión no se justifica: inhibir la ovulación no constituye una barrera frente a agentes infecciosos','La conclusión falla porque el método X solo actúa sobre la ovulación'],answer:2,
  steps:['Los mecanismos descritos son distintos: uno emplea una barrera física y el otro modifica un proceso reproductivo como la ovulación.','Impedir o reducir la probabilidad de fecundación no equivale a impedir la exposición a agentes que causan infecciones de transmisión sexual.','Por eso no se puede atribuir al método hormonal la función de barrera del preservativo ni inferir protección frente a ITS por inhibir la ovulación.'],
  errors:['La anticoncepción y la reducción de transmisión de ITS son resultados diferentes; no todos los métodos tienen ambos efectos.','Inhibir la ovulación no genera una barrera física durante el contacto sexual.','','La ficha describe X como barrera; atribuirle inhibición de ovulación cambia el mecanismo dado.'],
  transferDesign:design('Reconocer una afirmación correcta sobre el preservativo','Evaluar una inferencia que confunde dos mecanismos y dos resultados preventivos'),
  sourceTrace:trace('reproduction','Biología · Procesos y funciones biológicas, sexualidad y reproducción',[7],'Comparar mecanismos anticonceptivos y distinguirlos de la prevención de ITS.')
 },
 {
  base:'Ciencias:SCI-008',id:'TR-SCI-086',
  question:'Antes de la meiosis, un cromosoma tiene los alelos A y B, y su homólogo tiene a y b. Tras un entrecruzamiento entre ambos genes aparecen cromátidas Ab y aB. ¿Qué interpretación es correcta?',
  options:['Se generaron combinaciones nuevas de alelos existentes sin que sea necesario crear alelos nuevos','El entrecruzamiento creó obligatoriamente los alelos A y b mediante mutaciones','Se duplicó necesariamente el número de cromosomas de cada gameto','Se eliminaron todos los alelos recesivos del par de homólogos'],answer:0,
  steps:['Antes del intercambio ya estaban presentes los cuatro alelos A, B, a y b, distribuidos en las combinaciones AB y ab.','El intercambio de segmentos entre cromátidas de cromosomas homólogos puede reorganizarlos y originar las combinaciones Ab y aB.','Esta recombinación aumenta la variedad de combinaciones sin requerir una mutación que genere alelos nuevos ni duplicar el número cromosómico.'],
  errors:['','Los alelos mencionados ya existían antes del intercambio; no se demuestra la aparición de mutaciones.','El intercambio de segmentos no duplica por sí mismo la cantidad de cromosomas de los gametos.','Las combinaciones resultantes aún contienen a y b; no se eliminaron esos alelos.'],
  transferDesign:design('Nombrar recombinación y distribución como fuentes de variabilidad','Interpretar una representación de alelos y distinguir recombinación de mutación'),
  sourceTrace:trace('meiosis','Biología · Herencia y evolución, meiosis y variabilidad',[8],'Relacionar intercambio cromosómico con nuevas combinaciones de información hereditaria.')
 },
 {
  base:'Ciencias:SCI-009',id:'TR-SCI-087',
  question:'En dos ambientes se comparan aves con variantes heredables de pico. Entre aves de pico ancho, la media de descendientes supervivientes es 4 en el ambiente A y 1 en B; entre aves de pico estrecho, es 1 en A y 4 en B. ¿Qué conclusión apoyan estos datos?',
  options:['El pico ancho es siempre ventajoso, independientemente del ambiente','Cada ave cambia voluntariamente su pico antes de reproducirse','Las diferencias de descendencia no pueden modificar frecuencias de variantes heredables','La ventaja reproductiva de cada variante depende del ambiente y podría favorecer cambios distintos en su frecuencia'],answer:3,
  steps:['La comparación relevante es el éxito reproductivo de ambas variantes dentro de cada ambiente, no una clasificación universal del mejor pico.','En A, las aves de pico ancho dejan más descendientes supervivientes; en B ocurre lo contrario para las aves de pico estrecho.','Al ser variantes heredables, esas diferencias podrían favorecer aumentos de frecuencia distintos según el ambiente, sin requerir cambios dirigidos en cada individuo.'],
  errors:['Los datos de B muestran menor éxito reproductivo para el pico ancho; no respaldan una ventaja universal.','El estudio compara variantes heredables existentes y no describe cambios voluntarios del pico.','Las diferencias en descendientes supervivientes son precisamente una vía para cambiar frecuencias heredables.',''],
  transferDesign:design('Predecir aumento de resistencia bajo un insecticida','Comparar éxito reproductivo en ambientes contrastantes y evaluar dependencia ambiental'),
  sourceTrace:trace('biology','Biología · Herencia y evolución, selección natural',[8],'Interpretar datos de éxito reproductivo y variación heredable sin asumir una ventaja universal.')
 }
];
