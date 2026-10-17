/* Cachaste Competencia Lectora — corpus 100 % original.
   Temario PAES Regular 2026 / admisión 2027: Localizar, Interpretar, Evaluar.
   Material de entrenamiento propio, no textos ni ítems oficiales DEMRE. */
const READING_PASSAGES=[],READING_QUESTIONS=[];
function readingAdd(type,title,paragraphs,questions){
 const id='T'+String(READING_PASSAGES.length+1).padStart(2,'0');
 if(!['Narrativo','Expositivo','Argumentativo','Discontinuo'].includes(type)||paragraphs.length<2||questions.length<5)throw Error('Lectura inválida '+id);
 READING_PASSAGES.push({id,type,title,paragraphs});
 for(const [skill,question,correct,wrong,why,clue] of questions){
  const qi=READING_QUESTIONS.length;
  const answers=[correct,...wrong];
  if(!['Localizar','Interpretar','Evaluar'].includes(skill)||answers.length!==4||new Set(answers).size!==4||!why||!clue)throw Error('Ítem inválido '+id+' '+question);
  const rotation=qi%4,options=answers.map((_,i)=>answers[(i+rotation)%4]);
  const correctIndex=options.indexOf(correct);
  READING_QUESTIONS.push({id:'LEC-'+String(qi+1).padStart(3,'0'),passageId:id,skill,question,options,answer:correctIndex,
   explanations:options.map((x,i)=>i===correctIndex?'¡Cachaste! '+why:'Elegiste «'+x+'». Contrástala con la evidencia del texto: '+clue+' La respuesta correcta es «'+correct+'». '+why),
   steps:['Identifica la habilidad que pide el enunciado: '+skill+'. '+question,'Busca en el texto esta pista concreta: '+clue,'Conecta esa pista con la conclusión: '+why],easy:'La respuesta es «'+correct+'». '+why+' Para comprobarlo, '+clue.charAt(0).toLowerCase()+clue.slice(1),example:'Aplicación al texto «'+title+'»: '+clue+' Por eso la alternativa «'+correct+'» responde mejor a la pregunta que las otras opciones. '+why,origin:'original'});
 }
}
readingAdd('Expositivo','La biblioteca que comenzó a caminar',[
'En la comuna de Arroyo Claro, la biblioteca municipal detectó que la mayoría de los préstamos se concentraba en el centro. Quienes vivían en sectores alejados debían tomar dos buses para devolver un libro. La dirección decidió adaptar una pequeña camioneta con estantes y recorrer plazas y sedes vecinales dos veces por semana.',
'Los primeros meses hubo menos préstamos que en el edificio principal, pero aumentó el número de personas que utilizaban el servicio por primera vez. El equipo comenzó a registrar también consultas breves y recomendaciones de lectura. Esa información permitió modificar las paradas: se añadieron las ferias de los sábados y se redujeron las visitas a lugares con poca demanda.',
'La biblioteca móvil no reemplazó a la sede central. Allí continuaron los talleres y el acceso a computadores, mientras el vehículo ofrecía principalmente préstamos y devoluciones. Para evaluar el programa, el municipio decidió comparar el uso del servicio por barrios y no solo contar libros prestados.'
],[
['Localizar','¿Cuántas veces por semana recorría la camioneta las plazas y sedes vecinales?','Dos veces',['Una vez','Tres veces','Solo los sábados'],'El primer párrafo señala expresamente una frecuencia de dos recorridos semanales.','Busca la frecuencia del recorrido en el primer párrafo.'],
['Localizar','¿Qué servicio seguía disponible en la sede central?','Talleres y acceso a computadores',['Préstamos en ferias','Consultas en plazas','Recorridos en sedes vecinales'],'El tercer párrafo atribuye los talleres y computadores al edificio principal.','Relee qué hace la sede central.'],
['Interpretar','¿Por qué se incorporaron las ferias de los sábados al recorrido?','Los registros mostraron oportunidades para mejorar el acceso',['Se buscaba aumentar la cantidad de computadores en la sede central','El municipio quería que el vehículo reemplazara todos los talleres','El equipo decidió mantener las paradas sin considerar su uso'],'El equipo utilizó información de uso para ajustar las paradas según la demanda.','Relaciona el registro de consultas con la modificación del itinerario.'],
['Interpretar','¿Qué idea resume mejor la experiencia narrada?','Un servicio público se adapta a barreras territoriales y a la evidencia de uso',['Los préstamos son el único indicador relevante para evaluar una biblioteca','La movilidad del servicio basta para reemplazar los talleres de la sede central','La frecuencia de visitas debe mantenerse igual en todos los barrios'],'La idea central es ampliar acceso y ajustar un servicio sin sustituir sus funciones complementarias.','Busca una idea que abarque los tres párrafos.'],
['Evaluar','¿Qué dato ayudaría más a comprobar que la biblioteca móvil redujo desigualdades de acceso?','Usuarios nuevos de barrios lejanos antes y después del programa',['Cantidad total de préstamos en la sede central sin distinguir barrios','Número de paradas realizadas sin información sobre sus usuarios','Gasto de combustible del vehículo antes y después del programa'],'Comparar usuarios de sectores alejados en dos períodos permite evaluar cambios en acceso.','Elige información que mida directamente la barrera territorial inicial.']
]);
readingAdd('Expositivo','Árboles, sombra y temperatura',[
'Un grupo escolar midió durante una semana la temperatura del suelo en dos plazas cercanas. En la Plaza Norte había árboles adultos que cubrían gran parte de los senderos; en la Plaza Sur predominaban superficies de cemento expuestas al sol. Las mediciones se realizaron a las 15:00, con termómetros del mismo modelo y en días sin lluvia.',
'La Plaza Norte registró en promedio 28 °C en el suelo y la Plaza Sur 36 °C. El grupo advirtió que las plazas también diferían en tránsito de vehículos y tipo de pavimento. Por eso, aunque los datos coincidían con la idea de que la sombra reduce la temperatura superficial, no era correcto atribuir toda la diferencia solo a los árboles.',
'En su informe recomendaron repetir las mediciones en más horarios y comparar lugares con pavimentos semejantes. Además, sugirieron consultar a quienes utilizan las plazas, pues una superficie más fresca no informa por sí sola si un espacio es cómodo, accesible y seguro.'
],[
['Localizar','¿A qué hora se realizaron las mediciones iniciales?','A las 15:00',['A las 9:00','Al mediodía','A las 20:00'],'El primer párrafo precisa que las mediciones fueron a las 15:00.','Ubica el horario del procedimiento.'],
['Localizar','¿Qué temperatura promedio registró el suelo de la Plaza Sur?','36 °C',['28 °C','8 °C','15 °C'],'La Plaza Sur registró 36 °C, mientras que la Norte alcanzó 28 °C.','Compara los dos resultados del segundo párrafo.'],
['Interpretar','¿Por qué el grupo evita afirmar que los árboles explican toda la diferencia de temperatura?','Las plazas también varían en pavimento y tránsito',['Los termómetros usados eran de modelos distintos','La diferencia de 8 °C prueba por sí sola una causa única','Los días sin lluvia impiden comparar plazas'],'Hay otras variables diferentes entre las plazas que podrían influir en los resultados.','Reconoce los factores de confusión mencionados.'],
['Interpretar','¿Qué función cumple la recomendación de medir en más horarios?','Proponer una manera de fortalecer la evidencia obtenida',['Confirmar automáticamente que el pavimento no influye','Sustituir la comparación entre plazas por una única medición','Comprobar que una observación aislada basta para establecer causalidad'],'Repetir con mejores controles hace más sólida la investigación sin negar sus observaciones.','Relaciona una limitación del estudio con una mejora de método.'],
['Evaluar','¿Cuál conclusión resulta mejor sustentada por el texto?','Se observó una diferencia térmica, pero falta aislar sus causas',['La diferencia de 8 °C demuestra el efecto exclusivo de la sombra','Las condiciones de tránsito fueron controladas en ambas plazas','La temperatura del suelo basta para evaluar la calidad integral de una plaza'],'La diferencia de 8 °C está documentada; atribuirla totalmente a árboles excede los datos.','Distingue resultado medido de causalidad demostrada.']
]);
readingAdd('Argumentativo','El teléfono en la sala: ¿prohibir o enseñar?',[
'Cada marzo reaparece la propuesta de prohibir totalmente los teléfonos en las salas de clases. Sus defensores señalan las interrupciones y el uso de redes sociales durante las actividades. Son problemas reales, pero una prohibición absoluta pasa por alto que esos mismos dispositivos pueden apoyar experiencias de aprendizaje cuando existe una tarea clara.',
'Una escuela que permita usar celulares sin reglas también corre riesgos. Por eso propongo tres acuerdos: guardarlos durante explicaciones, utilizarlos solo en actividades indicadas y definir consecuencias proporcionales al incumplimiento. Además, las familias y los docentes deben conocer las reglas para que no dependan del criterio improvisado de cada clase.',
'No sostengo que toda actividad requiera pantallas. La lectura extensa, la discusión oral y los experimentos manuales conservan su valor. Sostengo, más bien, que una norma es mejor cuando protege la atención y a la vez enseña a decidir cuándo una herramienta aporta y cuándo estorba.'
],[
['Localizar','¿En cuál situación propone el autor guardar los teléfonos?','Durante las explicaciones',['Durante todas las actividades, incluso las autorizadas','Solo cuando los estudiantes usan redes sociales','Durante los experimentos manuales, aunque no haya instrucciones'],'El segundo párrafo propone guardarlos durante explicaciones.','Busca el primer acuerdo propuesto.'],
['Interpretar','¿Cuál es la tesis principal del texto?','Regular el uso de teléfonos es preferible a una prohibición absoluta',['Permitir teléfonos libremente enseña mejor que establecer acuerdos','Prohibirlos totalmente es la única forma de proteger la atención','Usar pantallas en cada actividad mejora necesariamente el aprendizaje'],'La postura propone normas claras y usos con propósito en lugar de prohibir todo uso.','Identifica la propuesta que organiza los tres párrafos.'],
['Interpretar','¿Qué función cumple mencionar la lectura extensa y los experimentos manuales?','Aclarar que la propuesta no busca usar pantallas en toda actividad',['Presentar la lectura extensa como una actividad que requiere teléfonos','Sostener que las normas claras hacen innecesarios los experimentos','Reconocer que toda herramienta digital debe utilizarse siempre'],'El último párrafo limita el alcance de la tesis y evita una interpretación extrema.','Observa qué posible malentendido corrige el autor.'],
['Evaluar','¿Qué evidencia fortalecería más la propuesta del autor?','Resultados comparables de atención con reglas claras frente a prohibición total',['Encuesta de preferencia estudiantil sin medir aprendizaje ni atención','Registro de cantidad de teléfonos disponibles en cada curso','Opiniones docentes sobre disciplina sin comparar resultados de las normas'],'Comparar atención y aprendizaje entre modelos de regulación permite evaluar la tesis.','Elige evidencia que pruebe la afirmación central.'],
['Evaluar','¿Qué objeción está reconocida explícitamente por el autor?','Permitir teléfonos sin normas puede generar problemas',['Las prohibiciones absolutas son siempre fáciles de aplicar','Las actividades con pantallas deben reemplazar las lecturas extensas','Los acuerdos de uso nunca requieren consecuencias por incumplimiento'],'El segundo párrafo admite riesgos del uso sin reglas y los aborda con acuerdos.','Busca una concesión del argumento.']
]);
readingAdd('Discontinuo','Reporte de un huerto comunitario',[
'Una junta vecinal registró cosechas en tres meses. Los datos corresponden a kilogramos entregados gratuitamente en el comedor del barrio. Tabla: abril, lechugas 18 kg, tomates 0 kg, zanahorias 7 kg; mayo, lechugas 15 kg, tomates 6 kg, zanahorias 8 kg; junio, lechugas 12 kg, tomates 16 kg, zanahorias 10 kg.',
'El registro indica cantidades cosechadas, pero no informa cuántas personas participaron ni el costo de producir cada cultivo. La coordinación explicó que los tomates comenzaron a madurar más tarde que las lechugas. Sin embargo, un integrante señaló que el aumento mensual del total cosechado no bastaba para demostrar que el huerto se estaba volviendo más eficiente.',
'Para el siguiente trimestre, el grupo decidió añadir horas de trabajo, superficie plantada y cantidad de agua utilizada. Así podría comparar producción y recursos sin dejar de registrar cuánto alimento recibía el comedor.'
],[
['Localizar','¿Cuántos kilogramos de tomates se cosecharon en junio?','16 kg',['6 kg','12 kg','10 kg'],'En el registro de junio aparecen 16 kg de tomates.','Lee la fila de junio y la columna de tomates.'],
['Localizar','¿Qué cultivo disminuyó su cosecha cada mes?','Lechugas',['Zanahorias','Tomates','Tomates, porque su cosecha creció más al final'],'Lechugas registró 18, 15 y 12 kg en los tres meses.','Compara los tres valores de cada cultivo.'],
['Interpretar','¿Por qué la coordinación menciona la maduración tardía de los tomates?','Para explicar por qué su cosecha fue nula en abril y creció después',['Para demostrar que las lechugas no pudieron cosecharse en abril','Para explicar la disminución mensual de la cosecha de lechugas','Para afirmar que el total producido creció por igual en los tres cultivos'],'La explicación relaciona el ciclo del cultivo con su cosecha tardía.','Relación entre el dato inicial y la característica del cultivo.'],
['Interpretar','¿Cuál es el total de kilogramos registrados en mayo?','29 kg',['23 kg','31 kg','39 kg'],'Mayo reúne 15 kg de lechugas, 6 kg de tomates y 8 kg de zanahorias: 29 kg.','Suma los tres valores del mes de mayo.'],
['Evaluar','¿Cuál dato adicional permitiría evaluar mejor la eficiencia en el uso de agua?','Litros de agua consumidos por kilogramo cosechado',['Litros de agua utilizados en el trimestre sin considerar la cosecha','Kilogramos cosechados sin registrar el agua empleada','Número de jornadas de trabajo sin medir el consumo hídrico'],'Relacionar recursos consumidos y producción permite evaluar eficiencia hídrica.','Busca una medida que compare agua utilizada con cosecha obtenida.']
]);
readingAdd('Argumentativo','Una ciudad que se escucha',[
'Una ciclovía nueva puede reducir el tiempo de traslado de cientos de personas. Sin embargo, decidir su recorrido mirando solo un plano es insuficiente: una línea recta puede atravesar cruces peligrosos, dejar fuera paraderos o dificultar el acceso a un consultorio.',
'Antes de invertir, la municipalidad debería publicar alternativas de trazado y escuchar a peatones, ciclistas, conductores del transporte público y vecinos con movilidad reducida. Escuchar no significa que todas las solicitudes puedan cumplirse; significa conocer efectos que el plano no muestra y explicar públicamente por qué se adopta una decisión.',
'La participación tampoco garantiza por sí sola una obra exitosa. Después de inaugurarla, se deberían medir accidentes, tiempos de viaje y uso de las conexiones. Si los resultados no coinciden con lo previsto, modificar el diseño sería una señal de responsabilidad, no de fracaso.'
],[
['Localizar','¿Qué instalación de salud se menciona como posible afectada por un mal trazado?','Un consultorio',['Un hospital regional','Una farmacia privada','Un laboratorio universitario'],'El primer párrafo menciona explícitamente el acceso a un consultorio.','Localiza el ejemplo de acceso a servicios de salud.'],
['Interpretar','¿Qué significa escuchar a la comunidad según el segundo párrafo?','Conocer efectos y justificar decisiones, aunque no se satisfaga todo pedido',['Aprobar automáticamente cada solicitud','Renunciar a cualquier proyecto vial','Preguntar únicamente a ciclistas expertos'],'El texto entiende la participación como información y rendición de cuentas, no como unanimidad.','Fíjate en la aclaración sobre solicitudes incompatibles.'],
['Interpretar','¿Qué función tienen los indicadores posteriores a la inauguración?','Comprobar si la obra produce los efectos esperados',['Reemplazar toda la consulta previa','Evitar que se conozcan errores','Medir solo el número de automóviles'],'Los indicadores permiten evaluar resultados reales y realizar correcciones.','Relaciona mediciones con revisión del diseño.'],
['Evaluar','¿Qué supuesto cuestiona principalmente el autor?','Que un recorrido eficiente en el plano necesariamente funciona bien para todas las personas',['Que las calles tienen cruces y paraderos','Que los barrios requieren acceso a servicios','Que una obra se puede evaluar después de inaugurarse'],'Se critica decidir únicamente desde el plano ignorando usos y obstáculos reales.','Busca la idea criticada en el primer párrafo.'],
['Evaluar','¿Qué característica fortalece la argumentación del texto?','Reconoce límites de la participación y propone evaluar resultados',['Promete que ninguna obra tendrá problemas','Rechaza cualquier información cuantitativa','Presenta una única opinión como dato indiscutible'],'El autor introduce límites y propone indicadores verificables en lugar de promesas absolutas.','Observa si el texto admite condiciones y posibilidades de error.']
]);

readingAdd('Narrativo','La radio del último piso',[
'Cada jueves, Mara subía al último piso del edificio para visitar a la señora Elvira. La encontraba junto a una radio antigua cuyo dial apenas iluminaba. Elvira anotaba en un cuaderno las canciones que sonaban y, al lado de cada título, escribía una fecha que Mara no comprendía.',
'Una tarde se cortó la luz. Mara ofreció encender la linterna del teléfono, pero Elvira prefirió abrir la ventana. Desde la calle llegaba la música de un grupo que ensayaba en la plaza. Sin radio, Elvira reconoció una melodía y buscó en su cuaderno una página de hacía cuarenta años. Le mostró a Mara una nota: «Primer baile con Ernesto. Llovía».',
'Cuando volvió la electricidad, Mara no pidió encender la radio. Preguntó por Ernesto y escuchó una historia que Elvira no había contado antes. Al despedirse, entendió que aquel cuaderno era menos un registro de canciones que una manera de conservar momentos.'
],[
['Localizar','¿Qué anotaba Elvira junto al título de cada canción?','Una fecha',['La hora exacta','El nombre de Mara','El precio del disco'],'El primer párrafo indica que junto a cada canción escribía una fecha.','Busca qué aparecía a la derecha de cada título.'],
['Localizar','¿De dónde provenía la música cuando se cortó la luz?','De un grupo que ensayaba en la plaza',['De una radio portátil','De la televisión del vecino','De un automóvil estacionado'],'El segundo párrafo atribuye la música a un grupo de la plaza.','Relee la descripción de lo que llegaba desde la calle.'],
['Interpretar','¿Qué representa principalmente el cuaderno para Elvira?','Un vínculo entre las canciones y sus recuerdos personales',['Una lista de compras pendientes','Una colección de instrucciones de reparación','Un calendario de transmisiones futuras'],'Cada canción aparece asociada a una experiencia significativa de su vida.','Une la nota de Ernesto con la reflexión final.'],
['Interpretar','¿Por qué Mara ya no pide encender la radio al volver la luz?','Porque desea conocer la historia que la melodía despertó',['Porque la radio se había descompuesto para siempre','Porque tiene prohibido escuchar música','Porque olvidó que Elvira estaba presente'],'La curiosidad se desplaza del aparato a la memoria de Elvira.','Observa qué pregunta hace Mara al terminar el corte.'],
['Evaluar','¿Cuál elemento sostiene mejor la idea de que el relato trata sobre memoria?','La nota sobre el primer baile y la conversación posterior',['La altura exacta del edificio','La marca comercial de la radio','La hora en que regresó la electricidad'],'La anotación y el diálogo muestran que las canciones recuperan momentos del pasado.','Distingue detalles ambientales de hechos que desarrollan el tema central.']
]);
readingAdd('Narrativo','El sendero detrás del tranque',[
'Ignacio conocía el camino más corto hacia el tranque: cruzar una reja vieja y seguir una huella que apenas figuraba en los mapas. Cuando llevó a su hermana menor a observar aves, le prometió llegar antes de que bajara el sol.',
'Tras una curva encontraron una cinta amarilla que advertía sobre un derrumbe reciente. Ignacio miró la hora y calculó que, si retrocedían, perderían la mejor luz para fotografiar. Su hermana observó piedras sueltas junto al borde y propuso regresar por el camino señalizado, aunque tardaran más.',
'Volvieron sin fotografías del tranque. Cerca del pueblo, sin embargo, vieron una bandada posada en los cables y alcanzaron a dibujar sus siluetas. Ignacio escribió en su libreta: «No llegamos al lugar esperado, pero aprendimos a mirar el camino». Al día siguiente avisaron al municipio sobre el derrumbe.'
],[
['Localizar','¿Qué advertía la cinta amarilla?','Un derrumbe reciente',['La presencia de animales protegidos','Un incendio activo','La falta de agua en el tranque'],'La cinta señalaba un derrumbe reciente en el sendero.','Busca la advertencia encontrada tras la curva.'],
['Localizar','¿Qué hicieron los hermanos al día siguiente?','Avisaron al municipio sobre el derrumbe',['Cerraron todas las rutas del pueblo','Regresaron solos por la huella prohibida','Organizaron un concurso de fotografía'],'La última oración dice que avisaron al municipio.','Lee las acciones posteriores al regreso.'],
['Interpretar','¿Qué conflicto enfrenta principalmente Ignacio?','Elegir entre llegar rápido o actuar con prudencia',['Decidir cuál cámara comprar','Competir por una fotografía premiada','Escoger entre estudiar y trabajar'],'La presión por aprovechar la luz choca con la señal de peligro.','Contrasta la promesa inicial con la advertencia del sendero.'],
['Interpretar','¿Qué cambio expresa la frase final de la libreta?','Valorar lo aprendido durante el trayecto más que alcanzar la meta prevista',['Abandonar para siempre la observación de aves','Concluir que los caminos largos son inútiles','Culpar a su hermana por el regreso'],'La reflexión resignifica una salida que no cumplió el objetivo inicial.','Compara la meta original con lo que realmente consiguieron.'],
['Evaluar','¿Cuál decisión del relato aparece mejor justificada por la información disponible?','Regresar por la ruta señalizada ante piedras sueltas y derrumbe',['Ignorar la cinta por falta de fotografías','Cruzar la reja para ahorrar tiempo','Acelerar la marcha junto al borde inestable'],'La señal y el terreno dan evidencia directa de peligro, aunque no cuantifiquen su magnitud.','Evalúa las decisiones a partir del riesgo descrito.']
]);
readingAdd('Expositivo','Cuando el río cambió de color',[
'Durante tres días, vecinos de Puerto Arrayán notaron que el agua del estero se veía más turbia después de una lluvia intensa. Una agrupación ambiental reunió fotografías de distintos puntos y registró los horarios. El fenómeno preocupó porque el estero atravesaba huertos familiares, aunque las imágenes no permitían identificar sustancias disueltas.',
'Un equipo universitario tomó muestras río arriba y abajo de un puente. Analizó sedimentos, acidez y algunos indicadores biológicos. Los resultados mostraron un aumento de partículas en suspensión, pero no permitieron confirmar la presencia de un contaminante específico. Los investigadores recomendaron repetir el muestreo tras otras lluvias.',
'La agrupación publicó tanto las observaciones vecinales como las limitaciones del análisis. Explicó que una apariencia turbia puede tener distintas causas y que registrar un cambio visible es una señal útil para investigar, no una prueba suficiente para señalar a un responsable.'
],[
['Localizar','¿Qué información registró inicialmente la agrupación ambiental?','Fotografías de distintos puntos y sus horarios',['Análisis de sangre de todos los habitantes','Imágenes satelitales de veinte años','Certificados de empresas sancionadas'],'El primer párrafo menciona fotografías y horarios.','Identifica el primer método vecinal de observación.'],
['Localizar','¿Qué encontraron los análisis universitarios?','Más partículas en suspensión',['Confirmación de una sustancia tóxica concreta','Ausencia absoluta de sedimentos','Un cambio confirmado en todas las especies'],'Los resultados mostraron aumento de partículas, sin identificar contaminante específico.','Vuelve al segundo párrafo y separa resultado y limitación.'],
['Interpretar','¿Qué relación establece el texto entre observación y prueba científica?','Las observaciones orientan investigaciones, pero no demuestran por sí solas una causa',['Una fotografía basta para establecer toda responsabilidad','Las observaciones ciudadanas nunca sirven','El laboratorio elimina cualquier incertidumbre'],'El texto distingue detectar un fenómeno de identificar su causa.','Contrasta las imágenes iniciales con el muestreo universitario.'],
['Interpretar','¿Por qué recomiendan muestrear después de nuevas lluvias?','Para comprobar si el patrón se repite en condiciones comparables',['Para evitar que se registren resultados contradictorios','Para convertir las imágenes en certificados legales','Para impedir observaciones de vecinos'],'Repetir observaciones permite evaluar regularidad y fortalecer inferencias.','Fíjate en lo que aún no permiten concluir los análisis.'],
['Evaluar','¿Cuál titular respetaría mejor la evidencia disponible?','Detectan más sedimentos en estero y piden nuevos análisis',['Prueban culpabilidad de empresa sin analizar sustancias','Confirman emergencia química irreversible','Demuestran que todas las aguas del sector son potables'],'Solo está confirmado un aumento de partículas; no una fuente contaminante concreta.','Elige un titular que no afirme más de lo demostrado.']
]);
readingAdd('Argumentativo','El valor de reparar',[
'Es fácil celebrar una compra nueva y olvidar el objeto que dejó de funcionar. Sin embargo, antes de reemplazar una tostadora, una mochila o una silla, convendría preguntar cuánto costaría repararlas. Esa decisión puede reducir residuos y conservar recursos utilizados para fabricarlas.',
'Reparar no siempre es la alternativa correcta. Si un artefacto eléctrico presenta fallas peligrosas, insistir sin diagnóstico puede poner en riesgo a quien lo use. También existen equipos cuyo arreglo cuesta más que uno nuevo y ofrece una vida útil muy corta. Por eso hacen falta servicios técnicos confiables y disponibilidad de repuestos.',
'Propongo que escuelas y municipios organicen talleres demostrativos para aprender a detectar problemas sencillos y reconocer cuándo solicitar ayuda especializada. No se trata de idealizar todo objeto antiguo, sino de volver visible una opción que suele descartarse demasiado pronto.'
],[
['Localizar','¿Qué instituciones propone el autor para organizar talleres?','Escuelas y municipios',['Aerolíneas y hospitales exclusivamente','Bancos centrales y tribunales','Solo fabricantes extranjeros'],'En el tercer párrafo propone talleres desde escuelas y municipios.','Busca quiénes podrían organizar los talleres.'],
['Localizar','¿Qué condición hace riesgosa una reparación improvisada?','Fallas eléctricas peligrosas sin diagnóstico',['Una mochila con una costura suelta','Una silla que necesita limpieza','Una caja con pintura desgastada'],'El segundo párrafo advierte explícitamente sobre equipos eléctricos peligrosos.','Diferencia reparación simple de intervención que requiere especialistas.'],
['Interpretar','¿Cuál es la propuesta principal del autor?','Considerar reparación antes de reemplazo cuando sea viable y seguro',['Conservar cualquier objeto sin importar sus riesgos','Prohibir la compra de productos nuevos','Reparar equipos eléctricos sin ayuda profesional'],'El texto propone evaluar reparación caso a caso y facilitar condiciones para hacerla.','Busca una tesis que incluya tanto ventajas como límites.'],
['Interpretar','¿Qué función cumple el segundo párrafo?','Introducir límites y condiciones a favor de una decisión responsable',['Negar que la fabricación use recursos','Enumerar marcas de electrodomésticos','Describir únicamente el pasado de los talleres'],'El autor reconoce riesgos y costos que matizan su recomendación.','Observa cómo se corrige una afirmación demasiado absoluta.'],
['Evaluar','¿Qué dato fortalecería más la propuesta sobre reducción de residuos?','Cantidad de objetos reparados que evitaron desecharse durante un año',['Cantidad de anuncios de productos nuevos','Número de vitrinas de un centro comercial','Colores más comunes de las herramientas'],'Para probar reducción de residuos conviene medir reemplazos evitados.','Vincula el indicador con el beneficio ambiental declarado.']
]);
readingAdd('Narrativo','El sobre que no tenía remitente',[
'Al terminar la jornada, Lucía encontró un sobre amarillo sobre el mesón de la imprenta. No llevaba nombre ni dirección. Dentro había una fotografía de su padre joven frente a una bicicleta que ella nunca había visto. En el reverso alguien escribió: «Se la prometió al mar y después cambió de idea».',
'Lucía pasó la tarde pensando que la frase escondía un secreto importante. Preguntó a dos clientes antiguos, sin resultados. Al llegar a casa mostró la imagen a su tía Rosa, quien se rio antes de explicar: su padre había intentado vender esa bicicleta para viajar a la costa; al final se quedó en el pueblo porque consiguió trabajo en la imprenta.',
'Al día siguiente Lucía devolvió la fotografía al cajón familiar. La frase misteriosa no había sido una promesa solemne, pero le había permitido conocer una decisión pequeña de la que dependieron muchos años de su historia. Dejó el sobre abierto para preguntarle más a su padre esa noche.'
],[
['Localizar','¿Dónde encontró Lucía el sobre amarillo?','Sobre el mesón de la imprenta',['En el cajón familiar','En la orilla del mar','Sobre una bicicleta nueva'],'El primer párrafo sitúa el sobre en el mesón de la imprenta.','Busca el lugar del hallazgo inicial.'],
['Localizar','¿Por qué el padre no realizó finalmente el viaje?','Porque consiguió trabajo en la imprenta',['Porque perdió la fotografía','Porque la bicicleta fue robada','Porque se cerraron las rutas costeras'],'La tía explica que consiguió trabajo y se quedó en el pueblo.','Localiza la explicación de Rosa.'],
['Interpretar','¿Cómo cambia la interpretación de Lucía sobre la frase del sobre?','Pasa de imaginar un gran secreto a valorar una decisión cotidiana',['Comprueba que su padre jamás tuvo bicicleta','Descubre que la tía inventó todos sus recuerdos','Concluye que nadie debe viajar a la costa'],'El desenlace reemplaza el misterio grandioso por significado familiar.','Compara lo que imagina al principio con lo que comprende después.'],
['Interpretar','¿Qué motiva a Lucía a dejar el sobre abierto?','Su deseo de conversar con su padre sobre su pasado',['Su intención de enviar una carta anónima','Su plan para vender la fotografía','Su necesidad de ocultar lo ocurrido'],'El sobre abierto simboliza una conversación aún pendiente.','Relaciona el último gesto con la decisión de preguntar.'],
['Evaluar','¿Qué elemento aporta más al giro narrativo?','La explicación espontánea de la tía Rosa',['El color amarillo del sobre','La hora de cierre de la imprenta','La ubicación del cajón familiar'],'La tía ofrece una interpretación sencilla que cambia el sentido del supuesto secreto.','Identifica qué información transforma la expectativa inicial.']
]);


readingAdd('Expositivo','El archivo de las fotografías sin fecha',[
'El museo local recibió cajas de fotografías familiares donadas por distintas personas. La mayoría no tenía fecha, y algunas mostraban calles cuyo nombre había cambiado. Antes de publicar las imágenes, el equipo catalogó detalles visibles: rótulos de locales, modelos de buses y construcciones que todavía existían en planos antiguos.',
'Una fotografía de la plaza fue fechada inicialmente en 1974 porque se veía un letrero de una tienda. Luego apareció un aviso de periódico que mostraba que esa tienda utilizó el mismo letrero entre 1972 y 1978. En lugar de mantener una fecha exacta, el museo corrigió su ficha y escribió «entre 1972 y 1978».',
'Las descripciones también incluyeron una distinción: una persona podía reconocer un edificio sin que eso probara cuándo se tomó la imagen. El equipo invitó a la comunidad a aportar recuerdos y documentos, pero señaló que las identificaciones debían quedar registradas junto a su grado de certeza.'
],[
['Localizar','¿Qué fuentes revisó el museo para reconocer elementos de las fotografías?','Rótulos, modelos de buses y planos antiguos',['Encuestas a antiguos residentes sobre la época','Registros de transporte y planos de otras ciudades','Entrevistas a fotógrafos que cubrieron la zona'],'El primer párrafo menciona rótulos, buses y construcciones comparadas con planos.','Identifica las pistas materiales usadas al catalogar.'],
['Localizar','¿Cuál fue la fecha corregida de la fotografía de la plaza?','Entre 1972 y 1978',['Exactamente 1974','Antes de 1900','En 1988'],'El segundo párrafo reemplaza el año único por un intervalo 1972–1978.','Busca la fecha escrita en la ficha revisada.'],
['Interpretar','¿Por qué el museo reemplaza 1974 por un intervalo de años?','La evidencia solo permite acotar un período, no fijar un año exacto',['La ficha conservó 1974 como fecha confirmada','El aviso comercial acredita que la foto se tomó en 1974','Un rótulo permite determinar el día de captura'],'El letrero existió durante varios años y no distingue un año específico.','Distingue coincidencia posible de identificación exacta.'],
['Interpretar','¿Qué papel cumplen los recuerdos de la comunidad en el proyecto?','Pueden aportar pistas que requieren registro y contraste',['Permiten atribuir una fecha precisa si varios recuerdos coinciden','Se conservan como anécdotas separadas de las fichas fotográficas','Se utilizan antes que los registros para fechar las fotografías'],'El museo recibe recuerdos, pero distingue su certeza y los compara con otras fuentes.','Relaciona participación con cautela metodológica.'],
['Evaluar','¿Qué práctica muestra mayor rigurosidad histórica según el texto?','Explicitar incertidumbre y conservar fuentes que sustentan cada ficha',['Asignar siempre la fecha más antigua','Descartar cualquier testimonio oral','Publicar fotografías con datos inventados'],'Registrar pruebas y márgenes de duda evita falsa precisión.','Observa cómo se corrigió la ficha ante evidencia insuficiente.']
]);
readingAdd('Narrativo','La puerta azul de la estación',[
'En el pueblo nadie llamaba «estación» al edificio desde que dejó de pasar el tren. Solo quedaba una puerta azul y un reloj detenido. Tomás iba allí para dibujar en silencio; a veces imaginaba las voces de viajeros que nunca conoció.',
'Un día una vecina le pidió ayuda para trasladar cajas de una bodega cercana. En el fondo apareció un libro de horarios con anotaciones a lápiz: «suspender salida por temporal», «esperar correspondencia», «pasajera busca a su perro». Tomás rió con la última nota. La estación había sido menos solemne de lo que imaginaba.',
'La vecina contó que su padre era quien anotaba los retrasos y también resolvía problemas pequeños. Al terminar, Tomás dibujó de nuevo la puerta azul. Esta vez añadió personas conversando, un perro en el andén y una mesa donde alguien ofrecía agua. El edificio seguía vacío, pero su dibujo ya no lo estaba.'
],[
['Localizar','¿Qué objeto de la antigua estación permanecía detenido?','Un reloj',['Un tren de pasajeros','Una bicicleta','Una máquina registradora'],'El primer párrafo señala que quedaba un reloj detenido.','Localiza los objetos que todavía estaban en el edificio.'],
['Localizar','¿Dónde aparecieron las anotaciones del antiguo personal ferroviario?','En un libro de horarios',['En un mapa turístico','En la pared de la escuela','En la puerta azul'],'El segundo párrafo dice que las notas estaban en un libro de horarios.','Identifica el soporte de las anotaciones.'],
['Interpretar','¿Qué descubre Tomás sobre la vida en la estación?','Que mezclaba viajes con problemas y gestos cotidianos',['Que nunca hubo pasajeros en ella','Que el reloj siempre funcionaba bien','Que solo se registraban ceremonias oficiales'],'Las notas pequeñas muestran la dimensión humana de ese lugar.','Compara la imaginación solemne con las notas del libro.'],
['Interpretar','¿Qué efecto tiene la conversación con la vecina en el dibujo final?','Incorpora escenas humanas que antes no imaginaba',['Hace que Tomás abandone definitivamente el dibujo','Borra la puerta azul de la ilustración','Convierte la estación en un centro comercial'],'La memoria compartida transforma la representación del edificio.','Observa qué personajes aparecen en el segundo dibujo.'],
['Evaluar','¿Qué detalle apoya mejor la caracterización de la estación como espacio comunitario?','La nota sobre la pasajera que buscaba a su perro',['Que el reloj estuviera detenido','Que el edificio tuviera una puerta azul','Que Tomás llevara lápices'],'Una necesidad cotidiana atendida por el personal sugiere relaciones más allá del transporte.','Elige el detalle que muestra interacción entre personas.']
]);
readingAdd('Argumentativo','Información compartida no siempre es información comprobada',[
'Cuando un mensaje alarmante llega a un grupo de amistades, la velocidad para reenviarlo suele superar al tiempo necesario para leerlo completo. El hecho de que llegue de alguien conocido genera confianza, pero no convierte su contenido en verdadero.',
'Antes de compartir una afirmación, conviene buscar su fuente original, revisar la fecha y verificar si otras fuentes confiables describen lo mismo. Una captura de pantalla sin enlace puede haber sido recortada; un dato de hace cinco años puede presentarse como noticia reciente. También es útil distinguir una opinión de una medición.',
'Verificar no significa desconfiar de todas las personas. Significa hacerse responsable del efecto que puede tener una información incorrecta. Compartir una corrección cuando descubrimos un error no es vergonzoso: demuestra que preferimos una conversación mejor informada a conservar una impresión inicial.'
],[
['Localizar','¿Qué tres acciones recomienda el texto antes de compartir una afirmación?','Buscar fuente original, revisar fecha y contrastar fuentes',['Aumentar el tamaño de letra, cambiar portada y borrar autor','Preguntar solo a la primera persona que la envió','Leer únicamente el título y reenviar'],'El segundo párrafo enuncia tres medidas explícitas de verificación.','Ubica la secuencia de acciones recomendadas.'],
['Interpretar','¿Por qué recibir un mensaje de alguien conocido no basta para creerlo?','La confianza en el remitente no prueba que el contenido sea verdadero',['Toda persona conocida intenta engañar','Los mensajes privados siempre son falsos','La verdad depende del número de contactos'],'Se distingue relación social de evidencia de veracidad.','Contrasta la fuente interpersonal con la fuente original del dato.'],
['Interpretar','¿Qué función cumple el ejemplo de una captura de pantalla recortada?','Ilustrar cómo el contexto omitido puede distorsionar un mensaje',['Enseñar técnicas de edición de imágenes','Afirmar que ninguna pantalla contiene textos reales','Promover el uso de aplicaciones de recorte'],'Muestra una forma concreta de perder información necesaria para evaluar el contenido.','Relaciona el ejemplo con el principio de verificar contexto.'],
['Evaluar','¿Cuál afirmación representa mejor la postura del autor?','Corregir públicamente un error puede ser una señal de responsabilidad',['Jamás debe compartirse una noticia','Reenviar rápidamente es siempre suficiente','La evidencia sobra cuando hay amistad'],'El tercer párrafo valora reconocer errores antes que mantener una impresión equivocada.','Localiza la conclusión sobre compartir correcciones.'],
['Evaluar','¿Qué aspecto sería más débil en un argumento que solo afirma «me lo mandó alguien de confianza»?','Carece de evidencia sobre la información misma',['Contiene una fuente original fechada','Incluye mediciones contrastadas','Distingue hechos y opiniones'],'La relación con quien envía un mensaje no verifica los hechos afirmados.','Evalúa si el argumento aporta pruebas o solo cercanía personal.']
]);
readingAdd('Expositivo','Cómo observar el cielo sin telescopio',[
'Una agrupación astronómica explicó que para observar estrellas no siempre se necesita un telescopio. Primero conviene elegir un lugar con iluminación artificial reducida y esperar a que los ojos se adapten a la oscuridad. También hay que revisar el pronóstico de nubes y las fases de la Luna, pues una Luna brillante puede dificultar la observación de objetos débiles.',
'En su taller, el grupo pidió a los asistentes comparar un mismo sector del cielo al comienzo y después de quince minutos. Algunos reconocieron estrellas que al principio no distinguían. El objetivo no era contar todas las estrellas posibles, sino experimentar cómo cambian las condiciones de percepción.',
'Los monitores recordaron que un objeto brillante no es necesariamente una estrella: algunos planetas también resultan visibles sin instrumentos. Recomendaron usar mapas celestes actualizados y registrar lugar, hora y fecha, ya que la apariencia del cielo cambia con la posición del observador y el transcurso del tiempo.'
],[
['Localizar','¿Cuánto tiempo esperó el taller antes de comparar nuevamente el cielo?','Quince minutos',['Un minuto','Una hora','Toda la noche'],'El segundo párrafo indica una comparación tras quince minutos.','Busca el intervalo del ejercicio del taller.'],
['Localizar','¿Qué condiciones recomienda revisar para planificar la observación?','Nubes y fases de la Luna',['Precio de telescopios y anuncios','Estado del tráfico y programación de radio','Número de turistas y horario comercial'],'El primer párrafo menciona nubes y fases lunares.','Identifica factores que cambian la visibilidad.'],
['Interpretar','¿Por qué los participantes vieron nuevas estrellas tras esperar?','Sus ojos pudieron adaptarse mejor a la oscuridad',['Las estrellas aparecieron físicamente de repente','La Tierra dejó de moverse durante quince minutos','Los planetas se transformaron en estrellas'],'El taller buscó observar el efecto de la adaptación visual.','Relaciona la espera con el cambio en percepción.'],
['Interpretar','¿Qué función tiene la advertencia sobre los planetas visibles?','Evitar clasificar todo punto brillante como estrella',['Afirmar que las estrellas son invisibles','Prohibir el uso de mapas celestes','Demostrar que todos los planetas brillan igual'],'Se agrega una precaución de interpretación ante apariencias semejantes.','Observa qué conclusión apresurada busca prevenir el aviso.'],
['Evaluar','¿Qué registro permitiría repetir mejor la observación del taller?','Lugar, fecha, hora y condiciones de iluminación',['Solo el color de la libreta','La cantidad de personas que llevaron comida','El nombre de la tienda donde compraron lápices'],'Registrar condiciones y ubicación hace comparables observaciones futuras.','Elige variables que puedan afectar la apariencia del cielo.']
]);
readingAdd('Narrativo','El jardín que seguía dando semillas',[
'Después de la mudanza, Julia encontró una caja de sobres de papel debajo del lavaplatos. Su abuelo había escrito nombres de flores en cada uno y añadido instrucciones breves: «regar poco», «dar sombra al mediodía», «esperar hasta septiembre». Ella no sabía cuál de las semillas seguiría siendo fértil.',
'En lugar de sembrarlas todas juntas, preparó tres macetas y anotó qué había puesto en cada una. Una semana después, solo apareció un brote. Julia llamó a su abuelo, frustrada por los sobres silenciosos. Él le preguntó si había considerado la estación y la cantidad de luz del patio.',
'Julia cambió las macetas de sitio y decidió esperar. No obtuvo un jardín inmediato, pero comenzó a entender que los resultados no siempre dependen de las ganas. Cuando la segunda semilla germinó, hizo una marca junto a su fecha en el calendario. Le pareció una forma de conversación que continuaba aun a distancia.'
],[
['Localizar','¿Dónde encontró Julia los sobres de semillas?','Debajo del lavaplatos',['Dentro del calendario','En la escuela','En la estación de buses'],'El primer párrafo ubica la caja debajo del lavaplatos.','Busca el lugar del hallazgo.'],
['Localizar','¿Cuántos brotes aparecieron durante la primera semana?','Uno',['Dos','Tres','Ninguno'],'El segundo párrafo indica que solo apareció un brote.','Busca el resultado inicial de las macetas.'],
['Interpretar','¿Por qué el abuelo pregunta por la estación y la luz?','Para ayudarla a considerar condiciones que afectan la germinación',['Para sugerir que las semillas no necesitan agua','Para decir que todas las especies crecen igual','Para probar que las macetas eran demasiado pequeñas'],'El abuelo orienta a Julia a pensar en variables ambientales.','Relaciona sus preguntas con el fracaso parcial inicial.'],
['Interpretar','¿Qué aprendizaje desarrolla Julia a lo largo del relato?','Que observar condiciones y tener paciencia importa más que desear un resultado rápido',['Que cualquier semilla germina el mismo día','Que anotar resultados es inútil','Que las instrucciones del abuelo deben desecharse'],'Ella pasa de la frustración a observar y esperar de manera reflexiva.','Contrasta la reacción inicial con su actitud final.'],
['Evaluar','¿Qué recurso literario tiene la frase final sobre una conversación a distancia?','Una imagen que vincula el cultivo con el lazo afectivo familiar',['Una descripción matemática de las macetas','Una instrucción literal para hablar con una planta','Una prueba científica sobre la voz de las semillas'],'La germinación funciona como símbolo de continuidad del vínculo con su abuelo.','Identifica qué significado no literal adquiere el jardín.']
]);


readingAdd('Argumentativo','¿Debe una ciudad medir el éxito por la velocidad?',[
'Cada mañana, los indicadores de tránsito celebran que una avenida permite ahorrar tres minutos. Ese dato importa para quienes viajan, pero no describe por completo la experiencia urbana. Un trayecto puede ser rápido y, al mismo tiempo, inseguro para una persona mayor que debe cruzar seis pistas sin sombra ni descanso.',
'Quienes defienden ampliar las vías sostienen que la congestión cuesta dinero y que mejorar la circulación beneficia a toda la ciudad. Sus argumentos merecen atención: las ambulancias, los buses y el transporte de mercancías necesitan desplazarse. Sin embargo, cuando la evaluación considera exclusivamente los minutos de los automóviles, deja fuera a quienes caminan, pedalean o esperan locomoción colectiva.',
'Una política de movilidad debería medir tiempos de viaje, accidentes, accesibilidad y calidad del espacio público. No se trata de prohibir los vehículos, sino de reconocer que una calle cumple varias funciones. Antes de anunciar una obra como un éxito, conviene preguntar quién ganó tiempo, quién perdió espacio y qué efectos se observaron después de inaugurarla.'
],[
['Localizar','¿Qué ahorro de tiempo celebran los indicadores de la avenida?','Tres minutos',['Seis minutos','Diez minutos','Media hora'],'El primer párrafo especifica tres minutos como indicador de circulación.','Ubica la cifra en la primera oración.'],
['Localizar','¿Qué vehículos se mencionan como necesitados de desplazamiento eficiente?','Ambulancias, buses y transporte de mercancías',['Bicicletas y motocicletas en trayectos urbanos','Taxis y automóviles particulares en hora punta','Trenes y embarcaciones entre ciudades'],'El segundo párrafo enumera esos tres ejemplos.','Revisa la concesión que hace el autor a quienes defienden las vías.'],
['Interpretar','¿Para qué menciona el autor a una persona mayor cruzando seis pistas?','Para mostrar una consecuencia que no refleja el indicador de rapidez',['Para afirmar que todas las personas mayores conducen','Para proponer eliminar los semáforos','Para demostrar que una calle ancha siempre es segura'],'El ejemplo contrapone la rapidez vehicular con la seguridad peatonal.','Relaciona el ejemplo con la crítica a medir solo minutos.'],
['Interpretar','¿Qué postura expresa mejor la tesis del texto?','Evaluar la movilidad con indicadores diversos y considerando a distintos usuarios',['Priorizar siempre los automóviles sobre los peatones','Rechazar cualquier mejora de transporte','Usar únicamente el ahorro de tiempo como medida'],'La conclusión propone considerar tiempos, seguridad, accesibilidad y espacio público.','Identifica la propuesta explícita del último párrafo.'],
['Evaluar','¿Qué información fortalecería más la propuesta del autor?','Una comparación de tiempos, accidentes y accesibilidad antes y después de una obra',['Una fotografía de la avenida recién inaugurada','La opinión de un único conductor satisfecho','El número de autos de una marca vendidos en la comuna'],'Comparar resultados en varias dimensiones permite poner a prueba la tesis.','Elige evidencia que mida los distintos criterios propuestos.']
]);
readingAdd('Discontinuo','Registro de préstamos de una biblioteca escolar',[
'El centro de recursos publicó un balance de préstamos por formato. En marzo se registraron 120 libros impresos, 40 libros digitales y 20 audiolibros. En abril hubo 110 impresos, 60 digitales y 30 audiolibros. En mayo se prestaron 100 impresos, 90 digitales y 40 audiolibros.',
'La encargada explicó que el establecimiento incorporó dispositivos de lectura durante abril, pero advirtió que el aumento de préstamos digitales no demuestra por sí solo una mejora de la comprensión lectora. Para estudiar ese efecto sería necesario observar qué leen los estudiantes, cómo interpretan los textos y qué oportunidades de acceso tienen.',
'El informe también indicó que los préstamos son transacciones, no necesariamente lectores distintos: una misma persona puede retirar varios materiales. Por eso, la dirección evitó presentar el total mensual como cantidad de estudiantes beneficiados.'
],[
['Localizar','¿Cuántos audiolibros se prestaron en mayo?','40',['20','30','90'],'La tabla descrita en el primer párrafo registra 40 audiolibros en mayo.','Busca el dato de mayo para el formato audio.'],
['Localizar','¿Qué formato pasó de 40 préstamos en marzo a 90 en mayo?','Libros digitales',['Libros impresos','Audiolibros','Revistas escolares'],'Los libros digitales registraron 40 en marzo y 90 en mayo.','Compara las cifras del mismo formato entre marzo y mayo.'],
['Interpretar','¿Qué tendencia muestran los libros impresos durante los tres meses?','Una disminución gradual de diez préstamos por mes',['Un crecimiento constante de veinte préstamos','Una estabilidad absoluta','Una caída de cincuenta préstamos cada mes'],'La secuencia 120, 110 y 100 representa descensos sucesivos de diez.','Ordena las tres cifras de impresos cronológicamente.'],
['Interpretar','¿Por qué el informe distingue préstamos de lectores distintos?','Porque una persona puede realizar más de un préstamo',['Porque los libros digitales no cuentan como préstamos','Porque cada estudiante recibe exactamente un libro','Porque todos los materiales fueron devueltos el mismo día'],'La unidad de conteo es el préstamo, no la persona.','Relee la advertencia del tercer párrafo.'],
['Evaluar','¿Qué conclusión sería injustificada usando únicamente estos datos?','Que la comprensión lectora mejoró gracias a los dispositivos',['Que los préstamos digitales aumentaron','Que los préstamos impresos disminuyeron','Que en mayo hubo más audiolibros que en marzo'],'El registro mide circulación de materiales, no desempeño en comprensión.','Distingue entre una observación de préstamos y un resultado de aprendizaje.']
]);
readingAdd('Narrativo','El cuaderno de las mareas',[
'Cuando Elisa encontró el cuaderno en el taller de su abuela, pensó que era una colección de recetas. Cada página tenía fechas, números y dibujos de pequeñas lunas. Su abuela, que había trabajado reparando redes en el puerto, le explicó que allí anotaba la altura del agua y el momento en que las embarcaciones podían entrar sin rozar el fondo.',
'Elisa quiso convertir las anotaciones en una aplicación para pescadores. Pasó varias tardes copiando números hasta descubrir una dificultad: algunos días estaban incompletos y otros incluían advertencias como «viento del sur, no confiarse». Su primer gráfico mostraba curvas elegantes, pero ocultaba esas observaciones. La abuela le preguntó si una línea bonita podía reemplazar la experiencia de quienes salían al mar.',
'La muchacha decidió conservar las notas junto a los datos y marcar claramente los días sin registros. Cuando mostró la nueva versión, su abuela no felicitó los colores ni las animaciones: señaló una advertencia que ahora aparecía al lado de una marea alta. Elisa entendió entonces que ordenar información también significa reconocer lo que no se sabe.'
],[
['Localizar','¿Dónde encontró Elisa el cuaderno?','En el taller de su abuela',['En una biblioteca municipal','En una embarcación abandonada','En la oficina del colegio'],'El primer párrafo sitúa el hallazgo en el taller de su abuela.','Ubica el lugar mencionado al inicio.'],
['Localizar','¿Qué advertencia aparecía en algunas anotaciones?','Viento del sur, no confiarse',['Esperar que baje la marea antes de salir','Evitar navegar cuando cambie la dirección del viento','Consultar la tabla de mareas antes de preparar las redes'],'El segundo párrafo reproduce esa observación meteorológica.','Busca la frase escrita entre comillas.'],
['Interpretar','¿Qué problema tenía el primer gráfico de Elisa?','Omitía advertencias y vacíos importantes del registro',['La curva exageraba pequeñas variaciones entre mareas','Mezclaba la altura de la marea con la fuerza del viento','La escala vertical comenzaba en cero y comprimía variaciones'],'Las curvas visualmente atractivas ocultaban información necesaria para interpretar los datos.','Contrasta la apariencia del gráfico con lo que dejó fuera.'],
['Interpretar','¿Qué cambio muestra el aprendizaje de Elisa?','De privilegiar la apariencia a comunicar datos con sus límites',['De confiar en los registros a destruirlos','De reparar redes a abandonar la tecnología','De estudiar mareas a ignorar el clima'],'La nueva versión preserva observaciones y señala faltantes.','Compara su primera y segunda versión.'],
['Evaluar','¿Qué función cumple la pregunta de la abuela sobre la línea bonita?','Cuestionar si una representación atractiva basta para tomar decisiones',['Confirmar que el diseño visual es siempre inútil','Ordenar que Elisa deje de aprender programación','Demostrar que las mareas no pueden registrarse'],'La pregunta invita a examinar la relación entre presentación, experiencia y seguridad.','Piensa qué supuesto del proyecto pone en duda.']
]);


readingAdd('Expositivo','La temperatura bajo los árboles',[
'Un equipo de estudiantes midió la temperatura a las tres de la tarde en tres lugares de una misma plaza. En el sector con árboles obtuvo 26 grados; junto a una pared de cemento, 31 grados; y sobre el estacionamiento asfaltado, 34 grados. Todas las mediciones se realizaron el mismo día, con instrumentos iguales y durante cinco minutos en cada punto.',
'La profesora les pidió evitar una conclusión apresurada. La diferencia observada era compatible con el efecto de la sombra y de los materiales, pero también podían influir el viento, la ubicación del termómetro y el calor acumulado por las superficies. Una sola jornada no permitía describir todo el verano.',
'El grupo decidió repetir el procedimiento durante cuatro semanas y registrar nubosidad y horario. También propuso conversar con vecinos para saber cuáles sectores evitaban durante las horas de mayor calor. Así combinarían observaciones físicas con experiencias de uso del espacio público.'
],[
['Localizar','¿Qué temperatura se registró en el estacionamiento?','34 grados',['26 grados','28 grados','31 grados'],'El primer párrafo registra 34 grados sobre el asfalto.','Busca la medición asociada al estacionamiento.'],
['Localizar','¿Durante cuánto tiempo midieron en cada punto?','Cinco minutos',['Una hora','Quince minutos','Cuatro semanas'],'Las mediciones iniciales duraron cinco minutos por punto.','Ubica la duración del procedimiento inicial.'],
['Interpretar','¿Por qué la profesora pidió cautela con las conclusiones?','Porque una jornada no permite aislar todas las variables ni representar el verano',['Porque los termómetros eran distintos','Porque no se registraron temperaturas','Porque el grupo trabajó en diferentes ciudades'],'Se mencionan variables alternativas y el límite temporal del registro.','Relaciona el segundo párrafo con la decisión de repetir mediciones.'],
['Interpretar','¿Qué aporta entrevistar a los vecinos?','Información sobre cómo experimentan y usan los espacios de la plaza',['Una sustitución exacta de todas las mediciones','Una forma de calcular la temperatura del asfalto','Una garantía de que la plaza cambiará de diseño'],'Los testimonios complementan los datos físicos con experiencias de uso.','Distingue entre medir temperatura y conocer hábitos.'],
['Evaluar','¿Qué diseño permitiría comparar mejor los sectores?','Medir los tres lugares a horas equivalentes durante varias jornadas',['Medir solo el estacionamiento una tarde','Preguntar únicamente a una persona','Cambiar el termómetro en cada lugar sin calibrarlo'],'La comparación requiere repetición y condiciones consistentes.','Evalúa qué procedimiento reduce sesgos de tiempo y medición.']
]);
readingAdd('Argumentativo','La escuela y el silencio digital',[
'Una escuela anunció que eliminaría todos los teléfonos durante la jornada. Sus autoridades esperaban reducir distracciones y mejorar la convivencia. Algunas familias celebraron la medida; otras preguntaron cómo se comunicarían ante emergencias y si una prohibición total enseñaba a usar responsablemente la tecnología.',
'La discusión suele presentarse como una elección entre permitirlo todo o prohibirlo todo. Sin embargo, hay alternativas intermedias: horarios sin pantallas, excepciones de accesibilidad y actividades para verificar información. Estas medidas exigen acompañamiento docente y reglas comprensibles, no solo guardar dispositivos bajo llave.',
'Defiendo que la escuela establezca momentos de concentración sin teléfonos y enseñe criterios de uso digital. La eficacia de esa decisión debería evaluarse con indicadores de atención, convivencia y bienestar, además de escuchar a estudiantes y familias. Una regla que nadie entiende puede ser fácil de anunciar, pero difícil de sostener.'
],[
['Localizar','¿Qué esperaba conseguir la escuela con la prohibición?','Reducir distracciones y mejorar la convivencia',['Aumentar la venta de dispositivos','Eliminar las clases presenciales','Sustituir a los docentes por aplicaciones'],'La finalidad aparece explícita en el primer párrafo.','Busca la expectativa de las autoridades.'],
['Localizar','¿Qué excepción se propone entre las medidas intermedias?','Excepciones de accesibilidad',['Excepciones para publicidad','Excepciones solo para exámenes finales','Excepciones para recreos obligatorios'],'El segundo párrafo menciona expresamente la accesibilidad.','Revisa la enumeración de alternativas.'],
['Interpretar','¿Qué critica la expresión permitirlo todo o prohibirlo todo?','Una falsa oposición que oculta soluciones intermedias',['La imposibilidad de establecer cualquier norma','La obligación de usar pantallas en todas las clases','La necesidad de eliminar la convivencia escolar'],'El autor introduce alternativas para superar una dicotomía rígida.','Relaciona la expresión con los ejemplos que siguen.'],
['Interpretar','¿Cuál es la postura principal del autor?','Combinar espacios sin teléfonos con educación para el uso responsable',['Permitir teléfonos sin reglas en cualquier momento','Prohibir toda tecnología dentro y fuera del colegio','Evaluar solo cuántos dispositivos se confiscan'],'La tesis final combina concentración y formación digital.','Identifica qué medida defiende explícitamente el último párrafo.'],
['Evaluar','¿Qué evidencia permitiría juzgar mejor la eficacia de la propuesta?','Datos de atención y convivencia antes y después, junto con opiniones de la comunidad',['Cantidad de carteles que anuncian la regla','Precio de los teléfonos más vendidos','Número de páginas del reglamento sin considerar sus efectos'],'La evaluación requiere resultados y perspectivas de los afectados.','Selecciona evidencia alineada con los objetivos de la propuesta.']
]);

window.READING_PASSAGES=READING_PASSAGES;
window.READING_QUESTIONS=READING_QUESTIONS;

const LECTURA_EDITORIAL_LOTE_1={"LEC-001":{"steps":["La camioneta recorría plazas y sedes vecinales «dos veces por semana», según el primer párrafo.","La pregunta solicita una frecuencia explícita, no una inferencia.","Por eso la respuesta correcta es «Dos veces»; no confundas las ferias de los sábados con la frecuencia semanal del vehículo."],"easy":"La respuesta aparece literalmente en el primer párrafo: dos veces por semana.","example":"El texto señala que la camioneta recorría plazas y sedes vecinales dos veces por semana. Esa frecuencia es la que pregunta el ejercicio."},"LEC-002":{"steps":["El tercer párrafo distingue funciones de la sede central y de la biblioteca móvil.","En la sede central continuaron los talleres y el acceso a computadores.","La camioneta ofrecía principalmente préstamos y devoluciones; por eso esos servicios no son la respuesta."],"easy":"Los talleres y computadores seguían en la sede central, mientras la camioneta prestaba y recibía libros.","example":"El texto contrapone «Allí continuaron los talleres y el acceso a computadores» con los préstamos y devoluciones del vehículo."},"LEC-003":{"steps":["El segundo párrafo indica que el equipo registró consultas y recomendaciones, además de préstamos.","Con esa información modificó las paradas e incorporó las ferias de los sábados.","Por lo tanto, el cambio se apoyó en evidencia de uso y no en una sustitución de la sede central."],"easy":"Se agregaron las ferias porque el equipo utilizó registros del servicio para ajustar dónde detener la camioneta.","example":"Primero se registró el uso de la biblioteca móvil; después se añadieron ferias y se redujeron visitas a puntos con baja demanda."},"LEC-004":{"steps":["El primer párrafo presenta una barrera territorial: algunas personas debían tomar dos buses.","El segundo describe ajustes de recorrido basados en registros de uso.","El tercero aclara que el servicio móvil complementa, pero no reemplaza, la sede central. La síntesis debe abarcar los tres hechos."],"easy":"La biblioteca se acercó a barrios alejados y ajustó su servicio según la información que reunió.","example":"El problema inicial era la distancia; la solución fue una camioneta, cuyos recorridos se modificaron con evidencia y sin cerrar la sede central."},"LEC-005":{"steps":["La desigualdad descrita es territorial: barrios alejados tenían mayores dificultades para acceder.","Para evaluar si disminuyó, hay que comparar el acceso de esos barrios antes y después.","Contar únicamente préstamos totales no distingue a quién benefició el programa."],"easy":"Para medir si mejoró el acceso, importa saber si aumentaron los usuarios de sectores lejanos.","example":"Si antes había pocos usuarios de barrios alejados y después aumentan, el dato aporta evidencia de mejora en acceso; el total de libros prestados no basta."},"LEC-006":{"steps":["El primer párrafo explica el procedimiento de medición de ambas plazas.","Indica expresamente que las mediciones se realizaron «a las 15:00».","El horario es un dato textual: no debe inferirse a partir de la temperatura."],"easy":"Las mediciones iniciales fueron a las tres de la tarde.","example":"En la descripción del procedimiento se precisa que se usaron termómetros del mismo modelo a las 15:00."},"LEC-007":{"steps":["El segundo párrafo informa 28 °C para Plaza Norte y 36 °C para Plaza Sur.","La pregunta pide solo la temperatura promedio de Plaza Sur.","La respuesta es 36 °C; 28 °C corresponde a la otra plaza."],"easy":"Plaza Sur tuvo 36 °C; Plaza Norte, 28 °C.","example":"El contraste textual de los promedios permite distinguir el dato pedido: Plaza Sur = 36 °C."},"LEC-008":{"steps":["El texto informa que las plazas diferían no solo en árboles, sino también en pavimento y tránsito.","Esas variables pueden afectar la temperatura del suelo.","Por eso no es válido atribuir toda la diferencia observada exclusivamente a la sombra."],"easy":"La diferencia de temperatura podría deberse también al pavimento y al tránsito.","example":"Si una plaza tiene árboles y otra además tiene más cemento, no se puede aislar el efecto de los árboles sin controlar el tipo de superficie."}};
for(const q of READING_QUESTIONS){if(LECTURA_EDITORIAL_LOTE_1[q.id]){Object.assign(q,LECTURA_EDITORIAL_LOTE_1[q.id]);q.reviewStatus='revisado_con_evidencia_textual';}}

const LECTURA_EDITORIAL_LOTE_2={"LEC-009":{"steps":["El tercer párrafo recomienda repetir mediciones en distintos horarios.","También propone comparar superficies de pavimento semejante.","Esto permite evaluar si el patrón térmico se mantiene y controlar otras causas posibles."],"easy":"Medir en más horarios evita basarse en una sola hora del día.","example":"Si las plazas se comparan a las 9:00 y 15:00 con pavimentos similares, se puede comprobar mejor si la diferencia persiste."},"LEC-010":{"steps":["Los datos indican 28 °C en Plaza Norte y 36 °C en Plaza Sur.","La diferencia observada es 8 °C, pero hay diferencias de tránsito y pavimento.","Por eso se puede afirmar que existe una diferencia térmica, no que los árboles explican toda su magnitud."],"easy":"Una plaza fue 8 °C más cálida; todavía no sabemos cuánto de esa diferencia se debe solo a la sombra.","example":"La medición muestra 36−28=8 °C, pero para atribuirlos a los árboles habría que controlar el pavimento y otras variables."},"LEC-011":{"steps":["En el segundo párrafo se enumeran tres acuerdos de uso.","El primero dice guardar los celulares durante las explicaciones.","No se propone guardarlos en todas las actividades: pueden usarse cuando la tarea lo indique."],"easy":"El autor pide guardar los teléfonos mientras el docente explica.","example":"El mismo párrafo permite usarlos en actividades indicadas, así que no defiende una prohibición permanente."},"LEC-012":{"steps":["El primer párrafo reconoce distracciones, pero cuestiona la prohibición absoluta.","El segundo propone reglas concretas y usos con finalidad pedagógica.","El tercero concluye que una norma debe proteger la atención y enseñar cuándo usar una herramienta."],"easy":"El autor propone reglas claras, no prohibir completamente los celulares.","example":"La tesis se ve en la propuesta de guardarlos durante explicaciones y permitirlos en tareas indicadas."},"LEC-013":{"steps":["El tercer párrafo menciona lectura extensa, discusión oral y experimentos manuales.","Esas actividades muestran que el autor reconoce aprendizajes valiosos sin pantallas.","La mención evita interpretar su tesis como una defensa de usar celulares siempre."],"easy":"El autor aclara que no todo aprendizaje necesita pantallas.","example":"Al destacar la lectura extensa sin celular, limita su propuesta a usos justificados por una tarea."},"LEC-014":{"steps":["La tesis sostiene que reglas claras pueden equilibrar atención y aprendizaje.","Para probarla, hay que comparar resultados de estudiantes con reglas frente a prohibición absoluta.","Una opinión aislada no basta: se requieren indicadores comparables de atención y aprendizaje."],"easy":"La mejor evidencia compararía qué pasa con reglas claras y con prohibición total.","example":"Dos grupos con características semejantes podrían medir interrupciones y resultados de aprendizaje bajo normas diferentes."},"LEC-015":{"steps":["El segundo párrafo admite que permitir celulares sin reglas también genera riesgos.","El autor propone acuerdos de uso precisamente para responder a esa objeción.","Por eso no sostiene que todo uso libre sea positivo."],"easy":"El autor reconoce que dejar usar celulares sin normas puede causar problemas.","example":"El texto propone consecuencias proporcionales al incumplimiento, lo que confirma que reconoce riesgos reales."},"LEC-016":{"steps":["El primer párrafo incluye una tabla expresada en texto con datos por mes y cultivo.","En junio se registran 12 kg de lechugas, 16 kg de tomates y 10 kg de zanahorias.","La pregunta pide solo tomates, así que corresponde 16 kg."],"easy":"En junio se cosecharon 16 kg de tomates.","example":"En la fila de junio, el dato de tomates es 16 kg, distinto de los 12 kg de lechugas."},"LEC-017":{"steps":["La serie de lechugas es abril 18 kg, mayo 15 kg y junio 12 kg.","Los valores disminuyen en cada paso: 18 > 15 > 12.","Los tomates y las zanahorias aumentan, por lo que no cumplen esa condición."],"easy":"Las lechugas bajaron todos los meses: 18, luego 15 y después 12 kg.","example":"En la tabla, los tomates pasan de 0 a 6 a 16 kg; en cambio las lechugas bajan de 18 a 15 a 12 kg."},"LEC-018":{"steps":["En abril la cosecha de tomates fue 0 kg.","En mayo fue 6 kg y en junio 16 kg.","La coordinación atribuye ese inicio tardío al momento de maduración del cultivo."],"easy":"Los tomates no estaban maduros al principio; por eso la cosecha apareció después.","example":"El registro pasa de 0 kg en abril a 16 kg en junio, lo que concuerda con una maduración más tardía."},"LEC-019":{"steps":["En mayo la tabla muestra 15 kg de lechugas.","Ese mes también se registran 6 kg de tomates y 8 kg de zanahorias.","Suma las tres cantidades: 15+6+8=29 kg."],"easy":"En mayo se cosecharon 29 kg entre los tres cultivos.","example":"Si sumas 15 kg de lechugas, 6 de tomates y 8 de zanahorias, obtienes 29 kg."},"LEC-020":{"steps":["La eficiencia hídrica compara producción obtenida con el agua utilizada.","El total cosechado por sí solo no indica cuánta agua fue necesaria.","El indicador pertinente es litros de agua por kilogramo cosechado."],"easy":"Para saber si se usa bien el agua, hay que relacionar litros consumidos y kilos cosechados.","example":"Dos meses pueden producir 30 kg; si uno gastó 300 litros y otro 600, sus eficiencias hídricas son distintas."}};
for(const q of READING_QUESTIONS){if(LECTURA_EDITORIAL_LOTE_2[q.id]){Object.assign(q,LECTURA_EDITORIAL_LOTE_2[q.id]);q.reviewStatus='revisado_con_evidencia_textual';}}

const LECTURA_EDITORIAL_LOTE_3={"LEC-021":{"steps":["El primer párrafo señala que un trazado mal elegido puede dificultar el acceso a un consultorio.","También menciona cruces peligrosos y paraderos excluidos, pero la pregunta pide una instalación de salud.","La respuesta correcta es consultorio, no paradero ni ciclovía."],"easy":"La instalación de salud mencionada es un consultorio.","example":"El texto dice que una línea recta puede «dificultar el acceso a un consultorio», aunque parezca eficiente en un plano."},"LEC-022":{"steps":["El segundo párrafo propone consultar a distintos usuarios antes de construir.","Aclara que escuchar no obliga a cumplir todas las solicitudes.","La participación sirve para descubrir efectos y justificar públicamente la decisión."],"easy":"Escuchar significa considerar los efectos y explicar las decisiones, no dar la razón a todos.","example":"Si peatones y ciclistas discrepan sobre un cruce, la municipalidad puede justificar un trazado sin satisfacer cada petición."},"LEC-023":{"steps":["El tercer párrafo propone medir accidentes, tiempos de viaje y conexiones después de inaugurar.","Estos indicadores permiten comparar resultados reales con los previstos.","Si no coinciden, el autor propone corregir el diseño."],"easy":"Los indicadores sirven para saber si la ciclovía funcionó como se esperaba.","example":"Si los accidentes aumentan pese a un trazado prometedor, el indicador revela la necesidad de revisar la obra."},"LEC-024":{"steps":["El autor critica decidir una ciclovía únicamente mirando un plano.","Una ruta recta puede ignorar cruces, paraderos y accesos esenciales.","Por eso cuestiona que eficiencia geométrica equivalga a utilidad real para todos."],"easy":"La ruta más corta en el mapa no siempre es la mejor para las personas.","example":"Una línea recta que impide llegar a un consultorio puede ser inadecuada aunque reduzca metros recorridos."},"LEC-025":{"steps":["El texto reconoce que no todas las solicitudes pueden cumplirse.","También advierte que participar no garantiza por sí solo una obra exitosa.","Propone indicadores posteriores para evaluar y corregir, fortaleciendo el argumento."],"easy":"El autor reconoce límites y propone medir resultados en vez de prometer éxito automático.","example":"Medir accidentes después de inaugurar permite revisar una decisión, aunque se haya consultado antes a los vecinos."},"LEC-026":{"steps":["El primer párrafo describe el cuaderno de Elvira.","Señala que junto a cada canción anotaba una fecha.","La pregunta pide ese dato literal, no el motivo de la anotación."],"easy":"Elvira escribía una fecha junto a cada título.","example":"El texto explica que Mara no comprendía las fechas, pero confirma que estaban anotadas junto a las canciones."},"LEC-027":{"steps":["Durante el corte de luz, Elvira abrió la ventana.","El segundo párrafo señala que un grupo ensayaba en la plaza.","La música venía de la calle, no de la radio apagada."],"easy":"La música venía de un grupo que ensayaba en la plaza.","example":"Como se cortó la luz, Elvira escuchó la melodía desde la ventana, proveniente del ensayo en la plaza."},"LEC-028":{"steps":["Elvira relacionaba cada canción con una fecha.","Una melodía le permitió recuperar el recuerdo del primer baile con Ernesto.","Por eso el cuaderno conserva experiencias personales, no solo títulos musicales."],"easy":"El cuaderno guardaba recuerdos de Elvira asociados a canciones.","example":"La nota «Primer baile con Ernesto. Llovía» convierte una canción en una puerta a su historia personal."},"LEC-029":{"steps":["Al volver la electricidad, Mara ya no pide encender la radio.","En cambio, pregunta por Ernesto y escucha un relato de Elvira.","La curiosidad se desplaza del aparato hacia la memoria despertada por la música."],"easy":"Mara prefiere escuchar la historia de Ernesto antes que volver a usar la radio.","example":"El texto contrasta directamente «no pidió encender la radio» con «preguntó por Ernesto»."},"LEC-030":{"steps":["El cuaderno vincula canciones y fechas, pero el recuerdo se revela con una anotación concreta.","La nota sobre el primer baile con Ernesto provoca una conversación sobre el pasado.","Esa relación entre música, anotación y relato sostiene el tema de la memoria."],"easy":"La nota del primer baile y la conversación muestran cómo una canción recupera recuerdos.","example":"La frase «Primer baile con Ernesto. Llovía» lleva a Elvira a contar una historia que nunca había relatado a Mara."}};
for(const q of READING_QUESTIONS){if(LECTURA_EDITORIAL_LOTE_3[q.id]){Object.assign(q,LECTURA_EDITORIAL_LOTE_3[q.id]);q.reviewStatus='revisado_con_evidencia_textual';}}

const LECTURA_EDITORIAL_LOTE_4={"LEC-031":{"steps":["Ubica el dato o la idea en «El sendero detrás del tranque».","La cinta amarilla advertía un derrumbe reciente en el sendero.","La alternativa «Un derrumbe reciente» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"La cinta amarilla advertía un derrumbe reciente en el sendero.","example":"La evidencia específica es: La cinta amarilla advertía un derrumbe reciente en el sendero. Por eso corresponde «Un derrumbe reciente»."},"LEC-032":{"steps":["Ubica el dato o la idea en «El sendero detrás del tranque».","Al día siguiente los hermanos avisaron al municipio sobre el derrumbe.","La alternativa «Avisaron al municipio sobre el derrumbe» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"Al día siguiente los hermanos avisaron al municipio sobre el derrumbe.","example":"La evidencia específica es: Al día siguiente los hermanos avisaron al municipio sobre el derrumbe. Por eso corresponde «Avisaron al municipio sobre el derrumbe»."},"LEC-033":{"steps":["Ubica el dato o la idea en «El sendero detrás del tranque».","Ignacio debe escoger entre llegar antes del atardecer y respetar una advertencia de peligro.","La alternativa «Elegir entre llegar rápido o actuar con prudencia» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"Ignacio debe escoger entre llegar antes del atardecer y respetar una advertencia de peligro.","example":"La evidencia específica es: Ignacio debe escoger entre llegar antes del atardecer y respetar una advertencia de peligro. Por eso corresponde «Elegir entre llegar rápido o actuar con prudencia»."},"LEC-034":{"steps":["Ubica el dato o la idea en «El sendero detrás del tranque».","La libreta afirma que no llegaron al destino, pero aprendieron a observar el camino.","La alternativa «Valorar lo aprendido durante el trayecto más que alcanzar la meta prevista» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"La libreta afirma que no llegaron al destino, pero aprendieron a observar el camino.","example":"La evidencia específica es: La libreta afirma que no llegaron al destino, pero aprendieron a observar el camino. Por eso corresponde «Valorar lo aprendido durante el trayecto más que alcanzar la meta prevista»."},"LEC-035":{"steps":["Ubica el dato o la idea en «El sendero detrás del tranque».","La cinta y las piedras sueltas justifican regresar por la ruta señalizada.","La alternativa «Regresar por la ruta señalizada ante piedras sueltas y derrumbe» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"La cinta y las piedras sueltas justifican regresar por la ruta señalizada.","example":"La evidencia específica es: La cinta y las piedras sueltas justifican regresar por la ruta señalizada. Por eso corresponde «Regresar por la ruta señalizada ante piedras sueltas y derrumbe»."},"LEC-036":{"steps":["Ubica el dato o la idea en «Cuando el río cambió de color».","La agrupación registró fotografías tomadas en distintos puntos y sus horarios.","La alternativa «Fotografías de distintos puntos y sus horarios» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"La agrupación registró fotografías tomadas en distintos puntos y sus horarios.","example":"La evidencia específica es: La agrupación registró fotografías tomadas en distintos puntos y sus horarios. Por eso corresponde «Fotografías de distintos puntos y sus horarios»."},"LEC-037":{"steps":["Ubica el dato o la idea en «Cuando el río cambió de color».","El análisis encontró más partículas en suspensión, sin identificar un contaminante concreto.","La alternativa «Más partículas en suspensión» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"El análisis encontró más partículas en suspensión, sin identificar un contaminante concreto.","example":"La evidencia específica es: El análisis encontró más partículas en suspensión, sin identificar un contaminante concreto. Por eso corresponde «Más partículas en suspensión»."},"LEC-038":{"steps":["Ubica el dato o la idea en «Cuando el río cambió de color».","La turbiedad observada motivó muestras científicas, pero por sí sola no establece una causa.","La alternativa «Las observaciones orientan investigaciones, pero no demuestran por sí solas una causa» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"La turbiedad observada motivó muestras científicas, pero por sí sola no establece una causa.","example":"La evidencia específica es: La turbiedad observada motivó muestras científicas, pero por sí sola no establece una causa. Por eso corresponde «Las observaciones orientan investigaciones, pero no demuestran por sí solas una causa»."},"LEC-039":{"steps":["Ubica el dato o la idea en «Cuando el río cambió de color».","Repetir el muestreo tras otras lluvias permite comprobar si el fenómeno se repite.","La alternativa «Para comprobar si el patrón se repite en condiciones comparables» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"Repetir el muestreo tras otras lluvias permite comprobar si el fenómeno se repite.","example":"La evidencia específica es: Repetir el muestreo tras otras lluvias permite comprobar si el fenómeno se repite. Por eso corresponde «Para comprobar si el patrón se repite en condiciones comparables»."},"LEC-040":{"steps":["Ubica el dato o la idea en «Cuando el río cambió de color».","El aumento de sedimentos sí se observó; atribuir contaminación específica no está demostrado.","La alternativa «Detectan más sedimentos en estero y piden nuevos análisis» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"El aumento de sedimentos sí se observó; atribuir contaminación específica no está demostrado.","example":"La evidencia específica es: El aumento de sedimentos sí se observó; atribuir contaminación específica no está demostrado. Por eso corresponde «Detectan más sedimentos en estero y piden nuevos análisis»."},"LEC-041":{"steps":["Ubica el dato o la idea en «El valor de reparar».","El autor propone talleres desde escuelas y municipios.","La alternativa «Escuelas y municipios» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"El autor propone talleres desde escuelas y municipios.","example":"La evidencia específica es: El autor propone talleres desde escuelas y municipios. Por eso corresponde «Escuelas y municipios»."},"LEC-042":{"steps":["Ubica el dato o la idea en «El valor de reparar».","El segundo párrafo advierte que fallas eléctricas peligrosas requieren diagnóstico.","La alternativa «Fallas eléctricas peligrosas sin diagnóstico» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"El segundo párrafo advierte que fallas eléctricas peligrosas requieren diagnóstico.","example":"La evidencia específica es: El segundo párrafo advierte que fallas eléctricas peligrosas requieren diagnóstico. Por eso corresponde «Fallas eléctricas peligrosas sin diagnóstico»."},"LEC-043":{"steps":["Ubica el dato o la idea en «El valor de reparar».","La tesis pide considerar reparar antes de reemplazar, cuando resulte seguro y viable.","La alternativa «Considerar reparación antes de reemplazo cuando sea viable y seguro» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"La tesis pide considerar reparar antes de reemplazar, cuando resulte seguro y viable.","example":"La evidencia específica es: La tesis pide considerar reparar antes de reemplazar, cuando resulte seguro y viable. Por eso corresponde «Considerar reparación antes de reemplazo cuando sea viable y seguro»."},"LEC-044":{"steps":["Ubica el dato o la idea en «El valor de reparar».","El segundo párrafo introduce riesgos, costos y límites de la reparación.","La alternativa «Introducir límites y condiciones a favor de una decisión responsable» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"El segundo párrafo introduce riesgos, costos y límites de la reparación.","example":"La evidencia específica es: El segundo párrafo introduce riesgos, costos y límites de la reparación. Por eso corresponde «Introducir límites y condiciones a favor de una decisión responsable»."},"LEC-045":{"steps":["Ubica el dato o la idea en «El valor de reparar».","Para medir residuos evitados serviría contar objetos reparados que no se desecharon.","La alternativa «Cantidad de objetos reparados que evitaron desecharse durante un año» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"Para medir residuos evitados serviría contar objetos reparados que no se desecharon.","example":"La evidencia específica es: Para medir residuos evitados serviría contar objetos reparados que no se desecharon. Por eso corresponde «Cantidad de objetos reparados que evitaron desecharse durante un año»."},"LEC-046":{"steps":["Ubica el dato o la idea en «El sobre que no tenía remitente».","Lucía encontró el sobre amarillo sobre el mesón de la imprenta.","La alternativa «Sobre el mesón de la imprenta» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"Lucía encontró el sobre amarillo sobre el mesón de la imprenta.","example":"La evidencia específica es: Lucía encontró el sobre amarillo sobre el mesón de la imprenta. Por eso corresponde «Sobre el mesón de la imprenta»."},"LEC-047":{"steps":["Ubica el dato o la idea en «El sobre que no tenía remitente».","Su padre no viajó porque consiguió trabajo en la imprenta.","La alternativa «Porque consiguió trabajo en la imprenta» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"Su padre no viajó porque consiguió trabajo en la imprenta.","example":"La evidencia específica es: Su padre no viajó porque consiguió trabajo en la imprenta. Por eso corresponde «Porque consiguió trabajo en la imprenta»."},"LEC-048":{"steps":["Ubica el dato o la idea en «El sobre que no tenía remitente».","Lucía deja de imaginar un gran secreto y valora una decisión familiar cotidiana.","La alternativa «Pasa de imaginar un gran secreto a valorar una decisión cotidiana» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"Lucía deja de imaginar un gran secreto y valora una decisión familiar cotidiana.","example":"La evidencia específica es: Lucía deja de imaginar un gran secreto y valora una decisión familiar cotidiana. Por eso corresponde «Pasa de imaginar un gran secreto a valorar una decisión cotidiana»."},"LEC-049":{"steps":["Ubica el dato o la idea en «El sobre que no tenía remitente».","El sobre abierto expresa su deseo de conversar con su padre sobre ese pasado.","La alternativa «Su deseo de conversar con su padre sobre su pasado» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"El sobre abierto expresa su deseo de conversar con su padre sobre ese pasado.","example":"La evidencia específica es: El sobre abierto expresa su deseo de conversar con su padre sobre ese pasado. Por eso corresponde «Su deseo de conversar con su padre sobre su pasado»."},"LEC-050":{"steps":["Ubica el dato o la idea en «El sobre que no tenía remitente».","La explicación de la tía Rosa transforma el supuesto misterio en una historia familiar.","La alternativa «La explicación espontánea de la tía Rosa» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"La explicación de la tía Rosa transforma el supuesto misterio en una historia familiar.","example":"La evidencia específica es: La explicación de la tía Rosa transforma el supuesto misterio en una historia familiar. Por eso corresponde «La explicación espontánea de la tía Rosa»."},"LEC-051":{"steps":["Ubica el dato o la idea en «El archivo de las fotografías sin fecha».","El museo comparó rótulos, modelos de buses y construcciones con planos antiguos.","La alternativa «Rótulos, modelos de buses y planos antiguos» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"El museo comparó rótulos, modelos de buses y construcciones con planos antiguos.","example":"La evidencia específica es: El museo comparó rótulos, modelos de buses y construcciones con planos antiguos. Por eso corresponde «Rótulos, modelos de buses y planos antiguos»."},"LEC-052":{"steps":["Ubica el dato o la idea en «El archivo de las fotografías sin fecha».","La fecha de la fotografía de la plaza se corrigió al intervalo 1972–1978.","La alternativa «Entre 1972 y 1978» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"La fecha de la fotografía de la plaza se corrigió al intervalo 1972–1978.","example":"La evidencia específica es: La fecha de la fotografía de la plaza se corrigió al intervalo 1972–1978. Por eso corresponde «Entre 1972 y 1978»."},"LEC-053":{"steps":["Ubica el dato o la idea en «El archivo de las fotografías sin fecha».","El letrero se utilizó durante varios años y no permite identificar solo 1974.","La alternativa «La evidencia solo permite acotar un período, no fijar un año exacto» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"El letrero se utilizó durante varios años y no permite identificar solo 1974.","example":"La evidencia específica es: El letrero se utilizó durante varios años y no permite identificar solo 1974. Por eso corresponde «La evidencia solo permite acotar un período, no fijar un año exacto»."},"LEC-054":{"steps":["Ubica el dato o la idea en «El archivo de las fotografías sin fecha».","Los recuerdos comunitarios ofrecen pistas que necesitan registro y contraste.","La alternativa «Pueden aportar pistas que requieren registro y contraste» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"Los recuerdos comunitarios ofrecen pistas que necesitan registro y contraste.","example":"La evidencia específica es: Los recuerdos comunitarios ofrecen pistas que necesitan registro y contraste. Por eso corresponde «Pueden aportar pistas que requieren registro y contraste»."},"LEC-055":{"steps":["Ubica el dato o la idea en «El archivo de las fotografías sin fecha».","El museo muestra rigor al conservar fuentes y expresar la incertidumbre de la fecha.","La alternativa «Explicitar incertidumbre y conservar fuentes que sustentan cada ficha» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"El museo muestra rigor al conservar fuentes y expresar la incertidumbre de la fecha.","example":"La evidencia específica es: El museo muestra rigor al conservar fuentes y expresar la incertidumbre de la fecha. Por eso corresponde «Explicitar incertidumbre y conservar fuentes que sustentan cada ficha»."},"LEC-056":{"steps":["Ubica el dato o la idea en «La puerta azul de la estación».","En el edificio permanecía detenido un reloj.","La alternativa «Un reloj» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"En el edificio permanecía detenido un reloj.","example":"La evidencia específica es: En el edificio permanecía detenido un reloj. Por eso corresponde «Un reloj»."},"LEC-057":{"steps":["Ubica el dato o la idea en «La puerta azul de la estación».","Las anotaciones aparecieron en un libro de horarios ferroviarios.","La alternativa «En un libro de horarios» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"Las anotaciones aparecieron en un libro de horarios ferroviarios.","example":"La evidencia específica es: Las anotaciones aparecieron en un libro de horarios ferroviarios. Por eso corresponde «En un libro de horarios»."},"LEC-058":{"steps":["Ubica el dato o la idea en «La puerta azul de la estación».","Las notas sobre temporales, correspondencia y una pasajera muestran la vida cotidiana.","La alternativa «Que mezclaba viajes con problemas y gestos cotidianos» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"Las notas sobre temporales, correspondencia y una pasajera muestran la vida cotidiana.","example":"La evidencia específica es: Las notas sobre temporales, correspondencia y una pasajera muestran la vida cotidiana. Por eso corresponde «Que mezclaba viajes con problemas y gestos cotidianos»."},"LEC-059":{"steps":["Ubica el dato o la idea en «La puerta azul de la estación».","Tras escuchar a la vecina, Tomás incorpora personas y escenas humanas al dibujo.","La alternativa «Incorpora escenas humanas que antes no imaginaba» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"Tras escuchar a la vecina, Tomás incorpora personas y escenas humanas al dibujo.","example":"La evidencia específica es: Tras escuchar a la vecina, Tomás incorpora personas y escenas humanas al dibujo. Por eso corresponde «Incorpora escenas humanas que antes no imaginaba»."},"LEC-060":{"steps":["Ubica el dato o la idea en «La puerta azul de la estación».","La nota de la pasajera que buscaba a su perro muestra vínculos comunitarios más allá del viaje.","La alternativa «La nota sobre la pasajera que buscaba a su perro» se desprende de esa información. Descarta opciones que agreguen datos no mencionados o contradigan el relato."],"easy":"La nota de la pasajera que buscaba a su perro muestra vínculos comunitarios más allá del viaje.","example":"La evidencia específica es: La nota de la pasajera que buscaba a su perro muestra vínculos comunitarios más allá del viaje. Por eso corresponde «La nota sobre la pasajera que buscaba a su perro»."}};
for(const q of READING_QUESTIONS){if(LECTURA_EDITORIAL_LOTE_4[q.id]){Object.assign(q,LECTURA_EDITORIAL_LOTE_4[q.id]);q.reviewStatus='revisado_con_evidencia_textual';}}

const LECTURA_EDITORIAL_LOTE_5={"LEC-061":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","El segundo párrafo recomienda buscar fuente original, revisar fecha y contrastar otras fuentes.","La respuesta «Buscar fuente original, revisar fecha y contrastar fuentes» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"El segundo párrafo recomienda buscar fuente original, revisar fecha y contrastar otras fuentes.","example":"En este texto, la pista decisiva es: El segundo párrafo recomienda buscar fuente original, revisar fecha y contrastar otras fuentes. Eso respalda «Buscar fuente original, revisar fecha y contrastar fuentes»."},"LEC-062":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","El primer párrafo distingue confianza en quien envía de veracidad del mensaje.","La respuesta «La confianza en el remitente no prueba que el contenido sea verdadero» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"El primer párrafo distingue confianza en quien envía de veracidad del mensaje.","example":"En este texto, la pista decisiva es: El primer párrafo distingue confianza en quien envía de veracidad del mensaje. Eso respalda «La confianza en el remitente no prueba que el contenido sea verdadero»."},"LEC-063":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","Una captura recortada puede ocultar contexto y alterar la interpretación.","La respuesta «Ilustrar cómo el contexto omitido puede distorsionar un mensaje» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"Una captura recortada puede ocultar contexto y alterar la interpretación.","example":"En este texto, la pista decisiva es: Una captura recortada puede ocultar contexto y alterar la interpretación. Eso respalda «Ilustrar cómo el contexto omitido puede distorsionar un mensaje»."},"LEC-064":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","El tercer párrafo considera responsable corregir públicamente información errónea.","La respuesta «Corregir públicamente un error puede ser una señal de responsabilidad» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"El tercer párrafo considera responsable corregir públicamente información errónea.","example":"En este texto, la pista decisiva es: El tercer párrafo considera responsable corregir públicamente información errónea. Eso respalda «Corregir públicamente un error puede ser una señal de responsabilidad»."},"LEC-065":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","La confianza en el remitente no sustituye evidencia sobre los hechos.","La respuesta «Carece de evidencia sobre la información misma» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"La confianza en el remitente no sustituye evidencia sobre los hechos.","example":"En este texto, la pista decisiva es: La confianza en el remitente no sustituye evidencia sobre los hechos. Eso respalda «Carece de evidencia sobre la información misma»."},"LEC-066":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","El taller compara el mismo cielo al inicio y quince minutos después.","La respuesta «Quince minutos» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"El taller compara el mismo cielo al inicio y quince minutos después.","example":"En este texto, la pista decisiva es: El taller compara el mismo cielo al inicio y quince minutos después. Eso respalda «Quince minutos»."},"LEC-067":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","El primer párrafo recomienda revisar nubosidad y fase lunar.","La respuesta «Nubes y fases de la Luna» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"El primer párrafo recomienda revisar nubosidad y fase lunar.","example":"En este texto, la pista decisiva es: El primer párrafo recomienda revisar nubosidad y fase lunar. Eso respalda «Nubes y fases de la Luna»."},"LEC-068":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","Esperar permite que los ojos se adapten a la oscuridad y perciban objetos débiles.","La respuesta «Sus ojos pudieron adaptarse mejor a la oscuridad» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"Esperar permite que los ojos se adapten a la oscuridad y perciban objetos débiles.","example":"En este texto, la pista decisiva es: Esperar permite que los ojos se adapten a la oscuridad y perciban objetos débiles. Eso respalda «Sus ojos pudieron adaptarse mejor a la oscuridad»."},"LEC-069":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","El tercer párrafo advierte que un punto brillante también puede ser un planeta.","La respuesta «Evitar clasificar todo punto brillante como estrella» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"El tercer párrafo advierte que un punto brillante también puede ser un planeta.","example":"En este texto, la pista decisiva es: El tercer párrafo advierte que un punto brillante también puede ser un planeta. Eso respalda «Evitar clasificar todo punto brillante como estrella»."},"LEC-070":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","Registrar lugar, fecha, hora e iluminación ayuda a reproducir observaciones.","La respuesta «Lugar, fecha, hora y condiciones de iluminación» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"Registrar lugar, fecha, hora e iluminación ayuda a reproducir observaciones.","example":"En este texto, la pista decisiva es: Registrar lugar, fecha, hora e iluminación ayuda a reproducir observaciones. Eso respalda «Lugar, fecha, hora y condiciones de iluminación»."},"LEC-071":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","Julia halló la caja de semillas debajo del lavaplatos.","La respuesta «Debajo del lavaplatos» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"Julia halló la caja de semillas debajo del lavaplatos.","example":"En este texto, la pista decisiva es: Julia halló la caja de semillas debajo del lavaplatos. Eso respalda «Debajo del lavaplatos»."},"LEC-072":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","En la primera semana apareció un único brote.","La respuesta «Uno» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"En la primera semana apareció un único brote.","example":"En este texto, la pista decisiva es: En la primera semana apareció un único brote. Eso respalda «Uno»."},"LEC-073":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","El abuelo pregunta por estación y luz para revisar condiciones de germinación.","La respuesta «Para ayudarla a considerar condiciones que afectan la germinación» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"El abuelo pregunta por estación y luz para revisar condiciones de germinación.","example":"En este texto, la pista decisiva es: El abuelo pregunta por estación y luz para revisar condiciones de germinación. Eso respalda «Para ayudarla a considerar condiciones que afectan la germinación»."},"LEC-074":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","Julia aprende a observar variables y esperar, no a exigir resultados inmediatos.","La respuesta «Que observar condiciones y tener paciencia importa más que desear un resultado rápido» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"Julia aprende a observar variables y esperar, no a exigir resultados inmediatos.","example":"En este texto, la pista decisiva es: Julia aprende a observar variables y esperar, no a exigir resultados inmediatos. Eso respalda «Que observar condiciones y tener paciencia importa más que desear un resultado rápido»."},"LEC-075":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","La germinación y las fechas funcionan como imagen del vínculo con su abuelo.","La respuesta «Una imagen que vincula el cultivo con el lazo afectivo familiar» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"La germinación y las fechas funcionan como imagen del vínculo con su abuelo.","example":"En este texto, la pista decisiva es: La germinación y las fechas funcionan como imagen del vínculo con su abuelo. Eso respalda «Una imagen que vincula el cultivo con el lazo afectivo familiar»."},"LEC-076":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","El indicador de tránsito celebra un ahorro de tres minutos.","La respuesta «Tres minutos» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"El indicador de tránsito celebra un ahorro de tres minutos.","example":"En este texto, la pista decisiva es: El indicador de tránsito celebra un ahorro de tres minutos. Eso respalda «Tres minutos»."},"LEC-077":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","El texto menciona ambulancias, buses y transporte de mercancías.","La respuesta «Ambulancias, buses y transporte de mercancías» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"El texto menciona ambulancias, buses y transporte de mercancías.","example":"En este texto, la pista decisiva es: El texto menciona ambulancias, buses y transporte de mercancías. Eso respalda «Ambulancias, buses y transporte de mercancías»."},"LEC-078":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","El ejemplo de una persona mayor ante seis pistas muestra riesgos que no refleja la rapidez.","La respuesta «Para mostrar una consecuencia que no refleja el indicador de rapidez» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"El ejemplo de una persona mayor ante seis pistas muestra riesgos que no refleja la rapidez.","example":"En este texto, la pista decisiva es: El ejemplo de una persona mayor ante seis pistas muestra riesgos que no refleja la rapidez. Eso respalda «Para mostrar una consecuencia que no refleja el indicador de rapidez»."},"LEC-079":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","La tesis propone medir tiempos, accidentes, accesibilidad y espacio público.","La respuesta «Evaluar la movilidad con indicadores diversos y considerando a distintos usuarios» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"La tesis propone medir tiempos, accidentes, accesibilidad y espacio público.","example":"En este texto, la pista decisiva es: La tesis propone medir tiempos, accidentes, accesibilidad y espacio público. Eso respalda «Evaluar la movilidad con indicadores diversos y considerando a distintos usuarios»."},"LEC-080":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","Comparar indicadores antes y después de la obra permitiría evaluar su efecto real.","La respuesta «Una comparación de tiempos, accidentes y accesibilidad antes y después de una obra» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"Comparar indicadores antes y después de la obra permitiría evaluar su efecto real.","example":"En este texto, la pista decisiva es: Comparar indicadores antes y después de la obra permitiría evaluar su efecto real. Eso respalda «Una comparación de tiempos, accidentes y accesibilidad antes y después de una obra»."},"LEC-081":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","En mayo se prestaron 40 audiolibros.","La respuesta «40» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"En mayo se prestaron 40 audiolibros.","example":"En este texto, la pista decisiva es: En mayo se prestaron 40 audiolibros. Eso respalda «40»."},"LEC-082":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","Los libros digitales pasaron de 40 en marzo a 90 en mayo.","La respuesta «Libros digitales» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"Los libros digitales pasaron de 40 en marzo a 90 en mayo.","example":"En este texto, la pista decisiva es: Los libros digitales pasaron de 40 en marzo a 90 en mayo. Eso respalda «Libros digitales»."},"LEC-083":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","Los impresos disminuyeron de 120 a 110 a 100: diez menos cada mes.","La respuesta «Una disminución gradual de diez préstamos por mes» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"Los impresos disminuyeron de 120 a 110 a 100: diez menos cada mes.","example":"En este texto, la pista decisiva es: Los impresos disminuyeron de 120 a 110 a 100: diez menos cada mes. Eso respalda «Una disminución gradual de diez préstamos por mes»."},"LEC-084":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","Un préstamo es una transacción y una misma persona puede realizar varios.","La respuesta «Porque una persona puede realizar más de un préstamo» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"Un préstamo es una transacción y una misma persona puede realizar varios.","example":"En este texto, la pista decisiva es: Un préstamo es una transacción y una misma persona puede realizar varios. Eso respalda «Porque una persona puede realizar más de un préstamo»."},"LEC-085":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","La cantidad de préstamos no mide comprensión lectora ni demuestra mejora de aprendizaje.","La respuesta «Que la comprensión lectora mejoró gracias a los dispositivos» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"La cantidad de préstamos no mide comprensión lectora ni demuestra mejora de aprendizaje.","example":"En este texto, la pista decisiva es: La cantidad de préstamos no mide comprensión lectora ni demuestra mejora de aprendizaje. Eso respalda «Que la comprensión lectora mejoró gracias a los dispositivos»."},"LEC-086":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","Elisa encontró el cuaderno en el taller de su abuela.","La respuesta «En el taller de su abuela» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"Elisa encontró el cuaderno en el taller de su abuela.","example":"En este texto, la pista decisiva es: Elisa encontró el cuaderno en el taller de su abuela. Eso respalda «En el taller de su abuela»."},"LEC-087":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","Una anotación advertía «viento del sur, no confiarse».","La respuesta «Viento del sur, no confiarse» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"Una anotación advertía «viento del sur, no confiarse».","example":"En este texto, la pista decisiva es: Una anotación advertía «viento del sur, no confiarse». Eso respalda «Viento del sur, no confiarse»."},"LEC-088":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","El primer gráfico ocultaba notas y días sin registros.","La respuesta «Omitía advertencias y vacíos importantes del registro» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"El primer gráfico ocultaba notas y días sin registros.","example":"En este texto, la pista decisiva es: El primer gráfico ocultaba notas y días sin registros. Eso respalda «Omitía advertencias y vacíos importantes del registro»."},"LEC-089":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","Elisa aprende a comunicar límites y advertencias junto a los datos.","La respuesta «De privilegiar la apariencia a comunicar datos con sus límites» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"Elisa aprende a comunicar límites y advertencias junto a los datos.","example":"En este texto, la pista decisiva es: Elisa aprende a comunicar límites y advertencias junto a los datos. Eso respalda «De privilegiar la apariencia a comunicar datos con sus límites»."},"LEC-090":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","La pregunta de la abuela cuestiona que un gráfico bonito baste para decidir.","La respuesta «Cuestionar si una representación atractiva basta para tomar decisiones» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"La pregunta de la abuela cuestiona que un gráfico bonito baste para decidir.","example":"En este texto, la pista decisiva es: La pregunta de la abuela cuestiona que un gráfico bonito baste para decidir. Eso respalda «Cuestionar si una representación atractiva basta para tomar decisiones»."},"LEC-091":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","El estacionamiento registró 34 grados.","La respuesta «34 grados» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"El estacionamiento registró 34 grados.","example":"En este texto, la pista decisiva es: El estacionamiento registró 34 grados. Eso respalda «34 grados»."},"LEC-092":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","Se midió durante cinco minutos en cada punto.","La respuesta «Cinco minutos» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"Se midió durante cinco minutos en cada punto.","example":"En este texto, la pista decisiva es: Se midió durante cinco minutos en cada punto. Eso respalda «Cinco minutos»."},"LEC-093":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","La profesora advierte que un día y variables sin controlar impiden generalizar.","La respuesta «Porque una jornada no permite aislar todas las variables ni representar el verano» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"La profesora advierte que un día y variables sin controlar impiden generalizar.","example":"En este texto, la pista decisiva es: La profesora advierte que un día y variables sin controlar impiden generalizar. Eso respalda «Porque una jornada no permite aislar todas las variables ni representar el verano»."},"LEC-094":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","Entrevistar vecinos complementa temperaturas con experiencias de uso.","La respuesta «Información sobre cómo experimentan y usan los espacios de la plaza» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"Entrevistar vecinos complementa temperaturas con experiencias de uso.","example":"En este texto, la pista decisiva es: Entrevistar vecinos complementa temperaturas con experiencias de uso. Eso respalda «Información sobre cómo experimentan y usan los espacios de la plaza»."},"LEC-095":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","Medir a horas equivalentes en varios días permite comparaciones más sólidas.","La respuesta «Medir los tres lugares a horas equivalentes durante varias jornadas» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"Medir a horas equivalentes en varios días permite comparaciones más sólidas.","example":"En este texto, la pista decisiva es: Medir a horas equivalentes en varios días permite comparaciones más sólidas. Eso respalda «Medir los tres lugares a horas equivalentes durante varias jornadas»."},"LEC-096":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","La prohibición buscaba reducir distracciones y mejorar convivencia.","La respuesta «Reducir distracciones y mejorar la convivencia» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"La prohibición buscaba reducir distracciones y mejorar convivencia.","example":"En este texto, la pista decisiva es: La prohibición buscaba reducir distracciones y mejorar convivencia. Eso respalda «Reducir distracciones y mejorar la convivencia»."},"LEC-097":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","Entre las alternativas se mencionan excepciones de accesibilidad.","La respuesta «Excepciones de accesibilidad» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"Entre las alternativas se mencionan excepciones de accesibilidad.","example":"En este texto, la pista decisiva es: Entre las alternativas se mencionan excepciones de accesibilidad. Eso respalda «Excepciones de accesibilidad»."},"LEC-098":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","El autor cuestiona el falso dilema entre permitirlo todo y prohibirlo todo.","La respuesta «Una falsa oposición que oculta soluciones intermedias» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"El autor cuestiona el falso dilema entre permitirlo todo y prohibirlo todo.","example":"En este texto, la pista decisiva es: El autor cuestiona el falso dilema entre permitirlo todo y prohibirlo todo. Eso respalda «Una falsa oposición que oculta soluciones intermedias»."},"LEC-099":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","Propone momentos sin teléfono y enseñanza de uso digital responsable.","La respuesta «Combinar espacios sin teléfonos con educación para el uso responsable» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"Propone momentos sin teléfono y enseñanza de uso digital responsable.","example":"En este texto, la pista decisiva es: Propone momentos sin teléfono y enseñanza de uso digital responsable. Eso respalda «Combinar espacios sin teléfonos con educación para el uso responsable»."},"LEC-100":{"steps":["Identifica si la pregunta pide un dato explícito, una inferencia o la función de un argumento.","Evaluar atención, convivencia y opiniones antes y después ayudaría a medir eficacia.","La respuesta «Datos de atención y convivencia antes y después, junto con opiniones de la comunidad» se justifica por ese dato o razonamiento; evita concluir más de lo que permite el texto."],"easy":"Evaluar atención, convivencia y opiniones antes y después ayudaría a medir eficacia.","example":"En este texto, la pista decisiva es: Evaluar atención, convivencia y opiniones antes y después ayudaría a medir eficacia. Eso respalda «Datos de atención y convivencia antes y después, junto con opiniones de la comunidad»."}};
for(const q of READING_QUESTIONS){if(LECTURA_EDITORIAL_LOTE_5[q.id]){Object.assign(q,LECTURA_EDITORIAL_LOTE_5[q.id]);q.reviewStatus='revisado_con_evidencia_textual';}}

/* Transferencia: cada ejemplo usa un caso distinto del texto evaluado. */
{
const examples=`
1|Si otro aviso dice «el taller se reúne tres veces al mes», la frecuencia pedida es tres al mes. No la cambies por el día de una reunión particular.
2|Si otro texto dice «el puesto móvil entrega alimentos y la sede mantiene las consultas», las consultas pertenecen a la sede. Asocia cada servicio con su lugar.
3|Si un bus cambia su ruta después de contar pasajeros, relaciona el registro con la decisión: se ajustó la ruta según el uso, no por un cambio de vehículos.
4|Un texto cuenta que una posta detecta distancia, abre una ronda rural y ajusta horarios. Su síntesis reúne problema, respuesta y ajuste; no se limita a un horario.
5|Para evaluar si una beca reduce una brecha territorial, compara la participación por zona antes y después, con poblaciones comparables. El gasto total de la beca no basta.
6|En «la visita comenzó a las 11:30 y terminó a las 13:00», si preguntan por el inicio debes elegir 11:30. Distingue el momento solicitado del final.
7|En «el lago A tiene 12 m de profundidad y el B, 18 m», la profundidad de B es 18 m. Seis metros es la diferencia, no la profundidad.
8|Si dos cultivos cambian tanto en riego como en suelo, una diferencia de crecimiento no permite atribuir el efecto solo al riego. Hay más de una explicación posible.
9|Si un informe recomienda repetir una encuesta en días distintos, esa recomendación amplía la evidencia; no prueba anticipadamente cuál será el resultado.
10|Si una encuesta encuentra más ejercicio entre quienes duermen bien, puedes afirmar una asociación. Sin controlar otros factores, no puedes asegurar que el ejercicio sea la única causa.
11|En «se debe guardar silencio durante la función», la regla se aplica a ese momento. No implica silencio durante toda la permanencia en el edificio.
12|Un autor propone regular el uso del agua, sin cerrar piscinas ni permitir todo consumo. Su tesis defiende una regulación, no ninguno de los extremos.
13|Si un autor defiende bicicletas y aclara que las ambulancias necesitan vías despejadas, la aclaración limita el alcance de su propuesta; no la abandona.
14|Para respaldar que un nuevo horario mejora asistencia, compara cursos semejantes con y sin el cambio. Una encuesta de gusto por el horario no mide asistencia.
15|Un autor defiende parques y admite que su mantención cuesta dinero. Reconocer ese costo es una objeción incorporada, no una renuncia a construir parques.
16|En una tabla con agosto: peras 8 y manzanas 15, localiza primero agosto y luego manzanas. La celda pedida es 15, no el total 23.
17|Una serie 9,7,5 disminuye en cada período; una serie 5,8,6 no lo hace, aunque su último valor sea menor que el máximo.
18|Si un informe dice que una tienda abrió a mitad de año, ese dato puede explicar ventas nulas antes de abrir. Cumple una función causal en el texto.
19|Si en una misma fila hay 7,8 y 10 unidades de tres productos, el total es 25. No mezcles valores de filas de meses diferentes.
20|Para comparar eficiencia de transporte, usa combustible por kilómetro bajo condiciones comparables. Los litros totales pueden aumentar solo porque hubo más viajes.
21|Si un relato menciona que cerraron un policlínico, no lo reemplaces por hospital porque parezca más familiar. Localizar exige conservar la información entregada.
22|Si una organización escucha propuestas y después explica qué eligió, escuchar significa considerar y fundamentar. No equivale a aceptar cada petición.
23|Si un colegio mide atrasos después de cambiar la entrada, esos datos evalúan el efecto del cambio. No reemplazan las razones que motivaron la decisión inicial.
24|Una ruta más corta puede tener escaleras. Ese ejemplo cuestiona el supuesto de que menos distancia significa mejor acceso para todas las personas.
25|Un argumento a favor del reciclaje se fortalece si reconoce sus costos y propone medir resultados. Admitir límites permite evaluar la propuesta con más precisión.
26|En «junto a cada receta anotó un lugar», el dato asociado a la receta es un lugar. No supongas una fecha por lo habitual de un diario.
27|Si durante un apagón la canción llega desde un patio, la fuente es el patio. La radio mencionada antes no sigue siendo automáticamente la fuente.
28|En un cuento, una caja de entradas de cine puede representar experiencias compartidas, si cada entrada despierta un recuerdo. El valor simbólico nace de esas acciones.
29|Si un personaje deja de reparar un reloj para escuchar a su dueña, puedes inferir un cambio de interés hacia la historia, no que el reloj quedó reparado.
30|Para sostener que un cuento trata sobre reconciliación, busca una disculpa y la respuesta del otro personaje. El color de la habitación por sí solo no basta.
31|En «el cartel advertía crecida del río», identifica ese peligro concreto. Un cierre de camino no permite inferir por sí solo que hubo un incendio.
32|Si «esa noche escribieron una carta y al día siguiente la enviaron», la acción del día siguiente es enviar. Respeta la secuencia temporal solicitada.
33|Si alguien debe elegir entre ganar una carrera o ayudar a una persona caída, el conflicto es entre logro individual y auxilio. La marca de las zapatillas es secundaria.
34|Una frase final como «perdimos el premio, pero encontramos un equipo» cambia el criterio de éxito. La conclusión valora un aprendizaje distinto de la meta inicial.
35|Si el relato muestra humo y una salida señalizada, alejarse por ella se justifica en esos indicios. La decisión se evalúa con la información disponible al personaje.
36|Si un grupo anota olores y horarios antes de hacer análisis, esos son sus registros iniciales. No atribuyas al primer momento mediciones realizadas después.
37|Si un análisis identifica sedimentos sin identificar sustancias tóxicas, informa solo el hallazgo comprobado. No conviertas una sospecha en resultado.
38|Una mancha en una pared permite investigar una filtración; por sí sola no identifica qué cañería falló. Distingue indicio, hipótesis y prueba.
39|Si se observa menos ruido un domingo, repetir la medición otros domingos ayuda a saber si es un patrón. Una sola observación no prueba regularidad.
40|Ante un estudio que encuentra una asociación sin causalidad, un titular como «Observan relación y recomiendan investigar» respeta mejor la evidencia que «Demuestran la causa».
41|En «clubes y universidades organizarán la feria», ambos son responsables explícitos. No reemplaces esas instituciones por otras que podrían organizar ferias.
42|Si un texto distingue un botón suelto de un cable expuesto, el riesgo eléctrico se relaciona con el cable. Evalúa la condición concreta, no cualquier avería.
43|Un autor recomienda reutilizar envases cuando estén limpios y sean adecuados. Su tesis tiene condiciones; no obliga a reutilizar cualquier recipiente.
44|Un artículo elogia caminar y luego menciona veredas peligrosas. El segundo párrafo introduce una condición para que la recomendación sea segura.
45|Para sostener que una campaña disminuyó residuos, mide basura evitada respecto de una situación comparable. Contar afiches mide difusión, no el resultado ambiental.
46|En un relato, un paquete se encuentra en el patio y después se guarda en una pieza. El lugar del hallazgo sigue siendo el patio, no su destino posterior.
47|Si un personaje cancela un viaje porque consiguió una beca local, esa es la causa explícita. No inventes falta de pasajes si el relato no la menciona.
48|Un ruido parece amenazante hasta que se descubre un gato. La interpretación cambia de peligro a explicación cotidiana; no cambia necesariamente el ruido observado.
49|Si alguien deja preparado un álbum para mostrárselo a su hermana, el gesto sugiere deseo de compartir recuerdos. Debe conectarse con las acciones del relato.
50|En un cuento, un testimonio que aclara quién dejó una carta puede producir el giro. El color del papel ambienta, pero no explica el cambio de interpretación.
51|Si un archivo compara vestimenta y mapas para datar una imagen, esas son sus fuentes de comparación. No atribuyas al equipo documentos que no consultó.
52|Si una fecha exacta se corrige a «entre 1980 y 1984», el dato final es ese intervalo. La primera fecha queda como hipótesis descartada.
53|Si un modelo de bus circuló entre 1960 y 1970, su presencia permite proponer un rango, no el día de la foto. La precisión de la afirmación debe seguir a la evidencia.
54|El recuerdo de un vecino puede sugerir dónde buscar un documento. Esa pista es útil aunque necesite contraste; no tiene que ser prueba definitiva para aportar.
55|Si dos registros discrepan sobre una fecha, consignar la discrepancia y sus fuentes es más riguroso que elegir arbitrariamente el dato más preciso.
56|En «la lámpara seguía encendida y el reloj detenido», solo el reloj está detenido. Distingue las propiedades atribuidas a cada objeto.
57|Si las notas aparecen en los márgenes de un cuaderno, ese es su soporte. No confundas el lugar donde se encontró el cuaderno con dónde están escritas las notas.
58|Un diario de una fábrica con cumpleaños y ayudas entre trabajadores revela una dimensión cotidiana además de la producción. La inferencia reúne distintos detalles.
59|Si después de conversar con un pescador una artista añade personas a un paisaje vacío, el cambio visual expresa nueva comprensión de la vida en ese lugar.
60|Para mostrar que una plaza reúne a la comunidad, una escena de vecinos organizando ayuda aporta más que mencionar solamente el tamaño de sus bancas.
61|Si un instructivo pide identificar emisor, fecha y evidencia, la respuesta debe incluir los tres pasos. Ver solo el título no cumple la secuencia.
62|Que una amiga recomiende una noticia explica por qué la lees, pero no prueba sus datos. La confianza personal y la verificación del contenido son criterios distintos.
63|Si un ejemplo muestra un gráfico sin eje vertical, ilustra pérdida de contexto. No es necesariamente una instrucción para diseñar gráficos.
64|Un autor que valora rectificar una cifra está defendiendo responsabilidad ante el error. No sostiene por eso que toda información anterior sea falsa.
65|«Lo vi muchas veces» describe difusión, no veracidad. Para sostener la afirmación faltan datos sobre lo que se dice, no sobre cuántas veces se repitió.
66|Si una actividad dura diez minutos y luego espera otros cinco, la pregunta sobre la espera exige cinco. Identifica a qué etapa corresponde cada cantidad.
67|Si para una salida se recomienda revisar mareas y viento, esos son los factores señalados. El precio del equipamiento puede importar, pero no responde al texto.
68|Si tras acostumbrarse a una habitación oscura alguien ve un mueble, cambió su percepción; no es necesario suponer que el mueble apareció en ese instante.
69|Un aviso de que no todo hongo es comestible impide generalizar desde su apariencia. Su función es corregir una clasificación precipitada.
70|Para repetir una medición de ruido conviene anotar lugar, hora e instrumento. Esos datos reconstruyen las condiciones; el diseño de la libreta no lo hace.
71|Si las llaves estaban bajo una maceta, ese es el lugar pedido. Que después se guardaran en un cajón no cambia dónde fueron encontradas.
72|En «de cuatro huevos nació un polluelo», el número de nacimientos es uno. Cuatro indica el total inicial, no el resultado.
73|Si una entrenadora pregunta por descanso y alimentación, orienta a considerar condiciones del rendimiento. No está asegurando una causa única sin datos.
74|Un personaje que registra resultados y ajusta una receta aprende a observar y modificar, no solo a desear que el plato salga bien.
75|Decir que una carta es «un puente entre dos casas» vincula la comunicación con una imagen de unión. No afirma que exista un puente material.
76|Si un informe celebra ahorrar cuatro minutos, responde con ese dato. No confundas la cantidad de pistas de una vía con minutos ahorrados.
77|En «ambulancias y buses requieren prioridad», conserva esas dos categorías. Que otros vehículos existan no significa que el texto los mencione.
78|Un ejemplo de una silla de ruedas ante una escalera muestra una dimensión de accesibilidad que el número de visitantes no refleja.
79|Un texto propone evaluar un hospital por tiempos, calidad y acceso. Su tesis exige varios indicadores, no eliminar uno ni usarlo como único criterio.
80|Para evaluar una biblioteca renovada, compara uso, acceso y satisfacción antes y después. Una foto de la inauguración no mide el resultado sostenido.
81|En una tabla, cruza la fila del mes solicitado con la columna del formato. Un dato de la columna vecina puede ser correcto en la tabla y aun así no responder.
82|Si una serie digital pasa de 10 a 25, verifica que esos extremos pertenezcan al mismo formato. No mezcles números de dos series.
83|Una serie 70,65,60 cae cinco por período. La variación entre meses es distinta de la disminución total de diez entre extremos.
84|Si se vendieron 50 entradas, no necesariamente asistieron 50 compradores distintos: alguien pudo comprar varias. Distingue transacciones de personas.
85|Que aumenten visitas a una web no prueba que sus lectores aprendan más. Hace falta una medición del aprendizaje y un diseño que examine otras causas.
86|Si un personaje encuentra una libreta en un taller, el lugar del hallazgo no es necesariamente el lugar donde se escribieron sus notas.
87|En «suelo húmedo: caminar con cuidado», la advertencia específica combina condición y precaución. No la sustituyas por una regla que parezca razonable pero no está escrita.
88|Un mapa que omite caminos cerrados puede ser claro y aun así informar mal. La calidad incluye qué información relevante conserva.
89|Una persona que agrega márgenes de error a un gráfico aprende a mostrar incertidumbre. La mejora no exige desechar toda representación visual.
90|La pregunta «¿una cifra basta para conocer una escuela?» cuestiona un criterio insuficiente. No afirma que todas las cifras sean inútiles.
91|Si se miden 20° a la sombra y 27° al sol, la temperatura al sol es 27°. Siete es la diferencia y no la medición pedida.
92|Si se mide dos minutos por punto durante una semana, la duración por punto es dos minutos. Una semana corresponde al período general del estudio.
93|Una encuesta realizada en una sola clase no representa automáticamente a todo el colegio. Evalúa si la muestra sostiene el alcance de la conclusión.
94|Entrevistar pasajeros sobre una ruta aporta experiencias de uso. No reemplaza por sí solo el registro de tiempos ni garantiza modificar la ruta.
95|Para comparar ruido en dos salas, mide en horarios equivalentes durante varios días con instrumentos comparables. Así reduces diferencias ajenas a la sala.
96|Si un programa anuncia que busca reducir atrasos, esa es su intención inicial. El anuncio no demuestra todavía que haya logrado reducirlos.
97|Si una norma prevé apoyo para quienes necesitan lector de pantalla, esa es una excepción de accesibilidad. No autoriza cualquier uso no relacionado.
98|Presentar «construir todo o construir nada» omite alternativas de escala y ubicación. Reconocerlas permite cuestionar una falsa dicotomía.
99|Un autor propone períodos de descanso y educación sobre sueño. Su postura combina medidas; no exige prohibir toda actividad nocturna.
100|Para evaluar una regla de biblioteca, compara ruido y satisfacción antes y después y escucha a sus usuarios. Contar carteles solo mide cuánto se anunció.
`.trim().split('\n');
for(const line of examples){const [n,example]=line.split('|');const q=window.READING_QUESTIONS[+n-1];q.example='Caso de transferencia: '+example;q.concept=q.skill==='Localizar'?'Información explícita':/función|papel|para qué/i.test(q.question)?'Función de recursos':/tesis|principal|resume|postura/i.test(q.question)?'Síntesis y postura':q.skill==='Evaluar'?'Evaluación de evidencia':'Inferencias y relaciones';q.reviewStatus='revisado_con_evidencia_textual';}
}

/* Treinta ítems adicionales: un ensayo contiene siete textos, no trece. */
window.READING_QUESTIONS.push(...[
 {
  "id": "LEC-101",
  "passageId": "T01",
  "skill": "Localizar",
  "question": "¿Qué servicio se conserva en el edificio principal después de incorporar la camioneta?",
  "options": [
   "Los talleres y el acceso a computadores",
   "La atención exclusiva a habitantes del centro",
   "La devolución de libros en dos buses",
   "La visita a ferias todos los días"
  ],
  "answer": 0,
  "steps": [
   "Relee «¿Qué servicio se conserva en el edificio principal después de incorporar la camioneta?» y distingue la información solicitada de los otros detalles del texto.",
   "El último párrafo mantiene los talleres y computadores en la sede; la camioneta complementa esos servicios.",
   "La alternativa «Los talleres y el acceso a computadores» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "El último párrafo mantiene los talleres y computadores en la sede; la camioneta complementa esos servicios.",
  "example": "Una posta rural móvil puede llevar controles a localidades alejadas y mantener los exámenes especializados en el centro. Complementar no es sustituir.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Información explícita",
  "difficulty": "intermedio",
  "explanations": [
   "¡Cachaste! El último párrafo mantiene los talleres y computadores en la sede; la camioneta complementa esos servicios.",
   "«La atención exclusiva a habitantes del centro» no coincide con lo que establece el texto. El último párrafo mantiene los talleres y computadores en la sede; la camioneta complementa esos servicios. La conclusión respaldada es «Los talleres y el acceso a computadores».",
   "«La devolución de libros en dos buses» no coincide con lo que establece el texto. El último párrafo mantiene los talleres y computadores en la sede; la camioneta complementa esos servicios. La conclusión respaldada es «Los talleres y el acceso a computadores».",
   "«La visita a ferias todos los días» no coincide con lo que establece el texto. El último párrafo mantiene los talleres y computadores en la sede; la camioneta complementa esos servicios. La conclusión respaldada es «Los talleres y el acceso a computadores»."
  ]
 },
 {
  "id": "LEC-102",
  "passageId": "T01",
  "skill": "Interpretar",
  "question": "¿Por qué contar solo préstamos habría dado una visión incompleta de la camioneta?",
  "options": [
   "Porque los préstamos dejaron de registrarse",
   "Porque cada consulta equivalía necesariamente a un libro prestado",
   "Porque la sede central ya no recibía visitantes",
   "Porque también acercó el servicio a personas nuevas y atendió consultas"
  ],
  "answer": 3,
  "steps": [
   "Relee «¿Por qué contar solo préstamos habría dado una visión incompleta de la camioneta?» y distingue la información solicitada de los otros detalles del texto.",
   "El segundo párrafo distingue préstamos, usuarios nuevos, consultas y recomendaciones: son dimensiones diferentes del servicio.",
   "La alternativa «Porque también acercó el servicio a personas nuevas y atendió consultas» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "El segundo párrafo distingue préstamos, usuarios nuevos, consultas y recomendaciones: son dimensiones diferentes del servicio.",
  "example": "Un taller puede tener pocos productos terminados y muchos participantes que aprendieron una técnica. Evaluarlo exige mirar más de un indicador.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Inferencias y relaciones",
  "difficulty": "intermedio",
  "explanations": [
   "«Porque los préstamos dejaron de registrarse» no coincide con lo que establece el texto. El segundo párrafo distingue préstamos, usuarios nuevos, consultas y recomendaciones: son dimensiones diferentes del servicio. La conclusión respaldada es «Porque también acercó el servicio a personas nuevas y atendió consultas».",
   "«Porque cada consulta equivalía necesariamente a un libro prestado» no coincide con lo que establece el texto. El segundo párrafo distingue préstamos, usuarios nuevos, consultas y recomendaciones: son dimensiones diferentes del servicio. La conclusión respaldada es «Porque también acercó el servicio a personas nuevas y atendió consultas».",
   "«Porque la sede central ya no recibía visitantes» no coincide con lo que establece el texto. El segundo párrafo distingue préstamos, usuarios nuevos, consultas y recomendaciones: son dimensiones diferentes del servicio. La conclusión respaldada es «Porque también acercó el servicio a personas nuevas y atendió consultas».",
   "¡Cachaste! El segundo párrafo distingue préstamos, usuarios nuevos, consultas y recomendaciones: son dimensiones diferentes del servicio."
  ]
 },
 {
  "id": "LEC-103",
  "passageId": "T01",
  "skill": "Evaluar",
  "question": "¿Qué afirmación excede la evidencia sobre los primeros meses del servicio móvil?",
  "options": [
   "Los préstamos fueron menores que en la sede principal",
   "El registro de uso permitió ajustar paradas",
   "Todas las personas de sectores alejados comenzaron a leer más",
   "Aumentó la cantidad de usuarios nuevos del servicio"
  ],
  "answer": 2,
  "steps": [
   "Relee «¿Qué afirmación excede la evidencia sobre los primeros meses del servicio móvil?» y distingue la información solicitada de los otros detalles del texto.",
   "El texto informa nuevos usuarios y préstamos; no mide cuánto leyeron todos los habitantes ni demuestra un cambio universal.",
   "La alternativa «Todas las personas de sectores alejados comenzaron a leer más» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "El texto informa nuevos usuarios y préstamos; no mide cuánto leyeron todos los habitantes ni demuestra un cambio universal.",
  "example": "Que aumenten las inscripciones en un gimnasio no demuestra que todos los vecinos hagan más ejercicio: falta medir esa conducta.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Evaluación de evidencia",
  "difficulty": "intermedio",
  "explanations": [
   "«Los préstamos fueron menores que en la sede principal» no coincide con lo que establece el texto. El texto informa nuevos usuarios y préstamos; no mide cuánto leyeron todos los habitantes ni demuestra un cambio universal. La conclusión respaldada es «Todas las personas de sectores alejados comenzaron a leer más».",
   "«El registro de uso permitió ajustar paradas» no coincide con lo que establece el texto. El texto informa nuevos usuarios y préstamos; no mide cuánto leyeron todos los habitantes ni demuestra un cambio universal. La conclusión respaldada es «Todas las personas de sectores alejados comenzaron a leer más».",
   "¡Cachaste! El texto informa nuevos usuarios y préstamos; no mide cuánto leyeron todos los habitantes ni demuestra un cambio universal.",
   "«Aumentó la cantidad de usuarios nuevos del servicio» no coincide con lo que establece el texto. El texto informa nuevos usuarios y préstamos; no mide cuánto leyeron todos los habitantes ni demuestra un cambio universal. La conclusión respaldada es «Todas las personas de sectores alejados comenzaron a leer más»."
  ]
 },
 {
  "id": "LEC-104",
  "passageId": "T01",
  "skill": "Interpretar",
  "question": "¿Qué relación hay entre registrar consultas y modificar las paradas?",
  "options": [
   "El registro reemplaza la necesidad de atender lectores",
   "La información recogida orienta una decisión del servicio",
   "La modificación invalida todos los datos recogidos",
   "Las consultas son una consecuencia del cierre del edificio"
  ],
  "answer": 1,
  "steps": [
   "Relee «¿Qué relación hay entre registrar consultas y modificar las paradas?» y distingue la información solicitada de los otros detalles del texto.",
   "El segundo párrafo enlaza «esa información» con la modificación de paradas. La decisión responde a datos de uso.",
   "La alternativa «La información recogida orienta una decisión del servicio» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "El segundo párrafo enlaza «esa información» con la modificación de paradas. La decisión responde a datos de uso.",
  "example": "Si una cafetería ajusta el horario tras registrar a qué hora llega gente, el registro funciona como insumo para decidir.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Inferencias y relaciones",
  "difficulty": "intermedio",
  "explanations": [
   "«El registro reemplaza la necesidad de atender lectores» no coincide con lo que establece el texto. El segundo párrafo enlaza «esa información» con la modificación de paradas. La decisión responde a datos de uso. La conclusión respaldada es «La información recogida orienta una decisión del servicio».",
   "¡Cachaste! El segundo párrafo enlaza «esa información» con la modificación de paradas. La decisión responde a datos de uso.",
   "«La modificación invalida todos los datos recogidos» no coincide con lo que establece el texto. El segundo párrafo enlaza «esa información» con la modificación de paradas. La decisión responde a datos de uso. La conclusión respaldada es «La información recogida orienta una decisión del servicio».",
   "«Las consultas son una consecuencia del cierre del edificio» no coincide con lo que establece el texto. El segundo párrafo enlaza «esa información» con la modificación de paradas. La decisión responde a datos de uso. La conclusión respaldada es «La información recogida orienta una decisión del servicio»."
  ]
 },
 {
  "id": "LEC-105",
  "passageId": "T01",
  "skill": "Evaluar",
  "question": "¿Qué dato permitiría evaluar específicamente la dificultad de acceso que motivó la camioneta?",
  "options": [
   "El tiempo de traslado de usuarios alejados antes y después",
   "El color preferido por los lectores para los estantes",
   "La cantidad de títulos que hay solo en la sede central",
   "El número de años que tiene el edificio municipal"
  ],
  "answer": 0,
  "steps": [
   "Relee «¿Qué dato permitiría evaluar específicamente la dificultad de acceso que motivó la camioneta?» y distingue la información solicitada de los otros detalles del texto.",
   "El problema inicial eran los dos buses necesarios para devolver un libro. Comparar tiempos de acceso aborda directamente esa barrera.",
   "La alternativa «El tiempo de traslado de usuarios alejados antes y después» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "El problema inicial eran los dos buses necesarios para devolver un libro. Comparar tiempos de acceso aborda directamente esa barrera.",
  "example": "Para evaluar si una rampa facilita el ingreso, observa el acceso de sus usuarios antes y después; contar baldosas no mide esa facilidad.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Evaluación de evidencia",
  "difficulty": "intermedio",
  "explanations": [
   "¡Cachaste! El problema inicial eran los dos buses necesarios para devolver un libro. Comparar tiempos de acceso aborda directamente esa barrera.",
   "«El color preferido por los lectores para los estantes» no coincide con lo que establece el texto. El problema inicial eran los dos buses necesarios para devolver un libro. Comparar tiempos de acceso aborda directamente esa barrera. La conclusión respaldada es «El tiempo de traslado de usuarios alejados antes y después».",
   "«La cantidad de títulos que hay solo en la sede central» no coincide con lo que establece el texto. El problema inicial eran los dos buses necesarios para devolver un libro. Comparar tiempos de acceso aborda directamente esa barrera. La conclusión respaldada es «El tiempo de traslado de usuarios alejados antes y después».",
   "«El número de años que tiene el edificio municipal» no coincide con lo que establece el texto. El problema inicial eran los dos buses necesarios para devolver un libro. Comparar tiempos de acceso aborda directamente esa barrera. La conclusión respaldada es «El tiempo de traslado de usuarios alejados antes y después»."
  ]
 },
 {
  "id": "LEC-106",
  "passageId": "T02",
  "skill": "Localizar",
  "question": "¿A qué hora se realizaron las mediciones comparadas de las dos plazas?",
  "options": [
   "A las 8 horas",
   "Al mediodía",
   "En cuatro horarios cada día",
   "A las 15 horas"
  ],
  "answer": 3,
  "steps": [
   "Relee «¿A qué hora se realizaron las mediciones comparadas de las dos plazas?» y distingue la información solicitada de los otros detalles del texto.",
   "El texto fija las mediciones a las 15 horas. La propuesta posterior de ampliar horarios todavía no describe lo realizado.",
   "La alternativa «A las 15 horas» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "El texto fija las mediciones a las 15 horas. La propuesta posterior de ampliar horarios todavía no describe lo realizado.",
  "example": "Si un informe distingue «medimos a las 10» de «mediremos también a las 18», identifica lo hecho sin mezclarlo con el plan.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Información explícita",
  "difficulty": "intermedio",
  "explanations": [
   "«A las 8 horas» no coincide con lo que establece el texto. El texto fija las mediciones a las 15 horas. La propuesta posterior de ampliar horarios todavía no describe lo realizado. La conclusión respaldada es «A las 15 horas».",
   "«Al mediodía» no coincide con lo que establece el texto. El texto fija las mediciones a las 15 horas. La propuesta posterior de ampliar horarios todavía no describe lo realizado. La conclusión respaldada es «A las 15 horas».",
   "«En cuatro horarios cada día» no coincide con lo que establece el texto. El texto fija las mediciones a las 15 horas. La propuesta posterior de ampliar horarios todavía no describe lo realizado. La conclusión respaldada es «A las 15 horas».",
   "¡Cachaste! El texto fija las mediciones a las 15 horas. La propuesta posterior de ampliar horarios todavía no describe lo realizado."
  ]
 },
 {
  "id": "LEC-107",
  "passageId": "T02",
  "skill": "Interpretar",
  "question": "¿Qué aporta mencionar diferencias de pavimento y tráfico entre las plazas?",
  "options": [
   "Confirma que ambas plazas tenían condiciones idénticas",
   "Prueba que los termómetros estaban defectuosos",
   "Introduce factores que también pueden influir en la temperatura",
   "Demuestra que los árboles nunca influyen"
  ],
  "answer": 2,
  "steps": [
   "Relee «¿Qué aporta mencionar diferencias de pavimento y tráfico entre las plazas?» y distingue la información solicitada de los otros detalles del texto.",
   "Esas diferencias impiden atribuir toda la variación solo a los árboles. Son explicaciones alternativas que deben considerarse.",
   "La alternativa «Introduce factores que también pueden influir en la temperatura» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "Esas diferencias impiden atribuir toda la variación solo a los árboles. Son explicaciones alternativas que deben considerarse.",
  "example": "Si dos salas difieren en ventanas y número de personas, una diferencia de calor no puede atribuirse solo a sus cortinas.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Inferencias y relaciones",
  "difficulty": "intermedio",
  "explanations": [
   "«Confirma que ambas plazas tenían condiciones idénticas» no coincide con lo que establece el texto. Esas diferencias impiden atribuir toda la variación solo a los árboles. Son explicaciones alternativas que deben considerarse. La conclusión respaldada es «Introduce factores que también pueden influir en la temperatura».",
   "«Prueba que los termómetros estaban defectuosos» no coincide con lo que establece el texto. Esas diferencias impiden atribuir toda la variación solo a los árboles. Son explicaciones alternativas que deben considerarse. La conclusión respaldada es «Introduce factores que también pueden influir en la temperatura».",
   "¡Cachaste! Esas diferencias impiden atribuir toda la variación solo a los árboles. Son explicaciones alternativas que deben considerarse.",
   "«Demuestra que los árboles nunca influyen» no coincide con lo que establece el texto. Esas diferencias impiden atribuir toda la variación solo a los árboles. Son explicaciones alternativas que deben considerarse. La conclusión respaldada es «Introduce factores que también pueden influir en la temperatura»."
  ]
 },
 {
  "id": "LEC-108",
  "passageId": "T02",
  "skill": "Evaluar",
  "question": "¿Qué afirmación sí respalda la comparación de 28 °C y 36 °C?",
  "options": [
   "La plaza más caliente recibe el doble de tráfico",
   "La diferencia registrada entre las plazas fue de 8 °C",
   "Los árboles reducen siempre exactamente 8 °C",
   "La diferencia será la misma durante todo el verano"
  ],
  "answer": 1,
  "steps": [
   "Relee «¿Qué afirmación sí respalda la comparación de 28 °C y 36 °C?» y distingue la información solicitada de los otros detalles del texto.",
   "36−28=8 describe los datos de esa observación; no establece una ley permanente ni aporta una medida del tráfico.",
   "La alternativa «La diferencia registrada entre las plazas fue de 8 °C» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "36−28=8 describe los datos de esa observación; no establece una ley permanente ni aporta una medida del tráfico.",
  "example": "Registrar 22 y 26 grados permite calcular una diferencia de 4 grados. No demuestra por sí solo su causa.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Evaluación de evidencia",
  "difficulty": "intermedio",
  "explanations": [
   "«La plaza más caliente recibe el doble de tráfico» no coincide con lo que establece el texto. 36−28=8 describe los datos de esa observación; no establece una ley permanente ni aporta una medida del tráfico. La conclusión respaldada es «La diferencia registrada entre las plazas fue de 8 °C».",
   "¡Cachaste! 36−28=8 describe los datos de esa observación; no establece una ley permanente ni aporta una medida del tráfico.",
   "«Los árboles reducen siempre exactamente 8 °C» no coincide con lo que establece el texto. 36−28=8 describe los datos de esa observación; no establece una ley permanente ni aporta una medida del tráfico. La conclusión respaldada es «La diferencia registrada entre las plazas fue de 8 °C».",
   "«La diferencia será la misma durante todo el verano» no coincide con lo que establece el texto. 36−28=8 describe los datos de esa observación; no establece una ley permanente ni aporta una medida del tráfico. La conclusión respaldada es «La diferencia registrada entre las plazas fue de 8 °C»."
  ]
 },
 {
  "id": "LEC-109",
  "passageId": "T02",
  "skill": "Interpretar",
  "question": "¿Para qué se propone entrevistar a quienes usan las plazas?",
  "options": [
   "Para complementar las mediciones con experiencias de uso",
   "Para sustituir todos los termómetros por opiniones",
   "Para demostrar que la plaza Sur debe cerrarse",
   "Para fijar de antemano cuál será la temperatura"
  ],
  "answer": 0,
  "steps": [
   "Relee «¿Para qué se propone entrevistar a quienes usan las plazas?» y distingue la información solicitada de los otros detalles del texto.",
   "Las entrevistas añaden cómo se vive el espacio. No reemplazan el dato térmico ni prueban una decisión ya tomada.",
   "La alternativa «Para complementar las mediciones con experiencias de uso» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "Las entrevistas añaden cómo se vive el espacio. No reemplazan el dato térmico ni prueban una decisión ya tomada.",
  "example": "En un estudio de buses, las entrevistas describen comodidad y los cronómetros miden duración: aportan información complementaria.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Inferencias y relaciones",
  "difficulty": "intermedio",
  "explanations": [
   "¡Cachaste! Las entrevistas añaden cómo se vive el espacio. No reemplazan el dato térmico ni prueban una decisión ya tomada.",
   "«Para sustituir todos los termómetros por opiniones» no coincide con lo que establece el texto. Las entrevistas añaden cómo se vive el espacio. No reemplazan el dato térmico ni prueban una decisión ya tomada. La conclusión respaldada es «Para complementar las mediciones con experiencias de uso».",
   "«Para demostrar que la plaza Sur debe cerrarse» no coincide con lo que establece el texto. Las entrevistas añaden cómo se vive el espacio. No reemplazan el dato térmico ni prueban una decisión ya tomada. La conclusión respaldada es «Para complementar las mediciones con experiencias de uso».",
   "«Para fijar de antemano cuál será la temperatura» no coincide con lo que establece el texto. Las entrevistas añaden cómo se vive el espacio. No reemplazan el dato térmico ni prueban una decisión ya tomada. La conclusión respaldada es «Para complementar las mediciones con experiencias de uso»."
  ]
 },
 {
  "id": "LEC-110",
  "passageId": "T02",
  "skill": "Evaluar",
  "question": "¿Qué cambio fortalecería la comparación térmica entre plazas?",
  "options": [
   "Medir cada plaza con un instrumento sin calibrar distinto",
   "Medir solo el lugar que confirmó la hipótesis inicial",
   "Elegir el día más caliente para una y el más frío para otra",
   "Repetir mediciones equivalentes en más horarios y condiciones"
  ],
  "answer": 3,
  "steps": [
   "Relee «¿Qué cambio fortalecería la comparación térmica entre plazas?» y distingue la información solicitada de los otros detalles del texto.",
   "Ampliar observaciones comparables permite revisar si la diferencia se mantiene; cambiar condiciones sin control dificulta la comparación.",
   "La alternativa «Repetir mediciones equivalentes en más horarios y condiciones» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "Ampliar observaciones comparables permite revisar si la diferencia se mantiene; cambiar condiciones sin control dificulta la comparación.",
  "example": "Para comparar ruido en dos salas, registra ambas en horarios comparables y durante varios días, en vez de elegir casos favorables.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Evaluación de evidencia",
  "difficulty": "intermedio",
  "explanations": [
   "«Medir cada plaza con un instrumento sin calibrar distinto» no coincide con lo que establece el texto. Ampliar observaciones comparables permite revisar si la diferencia se mantiene; cambiar condiciones sin control dificulta la comparación. La conclusión respaldada es «Repetir mediciones equivalentes en más horarios y condiciones».",
   "«Medir solo el lugar que confirmó la hipótesis inicial» no coincide con lo que establece el texto. Ampliar observaciones comparables permite revisar si la diferencia se mantiene; cambiar condiciones sin control dificulta la comparación. La conclusión respaldada es «Repetir mediciones equivalentes en más horarios y condiciones».",
   "«Elegir el día más caliente para una y el más frío para otra» no coincide con lo que establece el texto. Ampliar observaciones comparables permite revisar si la diferencia se mantiene; cambiar condiciones sin control dificulta la comparación. La conclusión respaldada es «Repetir mediciones equivalentes en más horarios y condiciones».",
   "¡Cachaste! Ampliar observaciones comparables permite revisar si la diferencia se mantiene; cambiar condiciones sin control dificulta la comparación."
  ]
 },
 {
  "id": "LEC-111",
  "passageId": "T03",
  "skill": "Localizar",
  "question": "Según la propuesta, ¿cuándo se guardan los teléfonos?",
  "options": [
   "Únicamente al terminar la jornada",
   "Durante toda actividad autorizada con el dispositivo",
   "Durante las explicaciones",
   "Solo durante los recreos"
  ],
  "answer": 2,
  "steps": [
   "Relee «Según la propuesta, ¿cuándo se guardan los teléfonos?» y distingue la información solicitada de los otros detalles del texto.",
   "El texto distingue guardarlos durante explicaciones y utilizarlos en actividades autorizadas; la regla depende del contexto.",
   "La alternativa «Durante las explicaciones» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "El texto distingue guardarlos durante explicaciones y utilizarlos en actividades autorizadas; la regla depende del contexto.",
  "example": "Una instrucción puede pedir guardar calculadoras al explicar un procedimiento y usarlas al comprobar resultados: cada momento tiene una regla.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Información explícita",
  "difficulty": "intermedio",
  "explanations": [
   "«Únicamente al terminar la jornada» no coincide con lo que establece el texto. El texto distingue guardarlos durante explicaciones y utilizarlos en actividades autorizadas; la regla depende del contexto. La conclusión respaldada es «Durante las explicaciones».",
   "«Durante toda actividad autorizada con el dispositivo» no coincide con lo que establece el texto. El texto distingue guardarlos durante explicaciones y utilizarlos en actividades autorizadas; la regla depende del contexto. La conclusión respaldada es «Durante las explicaciones».",
   "¡Cachaste! El texto distingue guardarlos durante explicaciones y utilizarlos en actividades autorizadas; la regla depende del contexto.",
   "«Solo durante los recreos» no coincide con lo que establece el texto. El texto distingue guardarlos durante explicaciones y utilizarlos en actividades autorizadas; la regla depende del contexto. La conclusión respaldada es «Durante las explicaciones»."
  ]
 },
 {
  "id": "LEC-112",
  "passageId": "T03",
  "skill": "Interpretar",
  "question": "¿Qué función tiene mencionar actividades manuales y lectura?",
  "options": [
   "Presentar un resultado estadístico sobre notas escolares",
   "Mostrar que el uso educativo del teléfono convive con otras formas de aprender",
   "Defender que toda actividad debe hacerse en pantalla",
   "Afirmar que leer impide aprender con tecnología"
  ],
  "answer": 1,
  "steps": [
   "Relee «¿Qué función tiene mencionar actividades manuales y lectura?» y distingue la información solicitada de los otros detalles del texto.",
   "El autor valora experiencias sin dispositivos sin renunciar a usos pedagógicos específicos: las alternativas no son excluyentes.",
   "La alternativa «Mostrar que el uso educativo del teléfono convive con otras formas de aprender» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "El autor valora experiencias sin dispositivos sin renunciar a usos pedagógicos específicos: las alternativas no son excluyentes.",
  "example": "Defender salidas a terreno junto con simulaciones digitales propone variedad de métodos, no eliminar uno de ellos.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Inferencias y relaciones",
  "difficulty": "intermedio",
  "explanations": [
   "«Presentar un resultado estadístico sobre notas escolares» no coincide con lo que establece el texto. El autor valora experiencias sin dispositivos sin renunciar a usos pedagógicos específicos: las alternativas no son excluyentes. La conclusión respaldada es «Mostrar que el uso educativo del teléfono convive con otras formas de aprender».",
   "¡Cachaste! El autor valora experiencias sin dispositivos sin renunciar a usos pedagógicos específicos: las alternativas no son excluyentes.",
   "«Defender que toda actividad debe hacerse en pantalla» no coincide con lo que establece el texto. El autor valora experiencias sin dispositivos sin renunciar a usos pedagógicos específicos: las alternativas no son excluyentes. La conclusión respaldada es «Mostrar que el uso educativo del teléfono convive con otras formas de aprender».",
   "«Afirmar que leer impide aprender con tecnología» no coincide con lo que establece el texto. El autor valora experiencias sin dispositivos sin renunciar a usos pedagógicos específicos: las alternativas no son excluyentes. La conclusión respaldada es «Mostrar que el uso educativo del teléfono convive con otras formas de aprender»."
  ]
 },
 {
  "id": "LEC-113",
  "passageId": "T03",
  "skill": "Evaluar",
  "question": "¿Qué afirmación sería incompatible con la postura del texto?",
  "options": [
   "Toda actividad escolar debe realizarse con teléfonos",
   "Se necesitan límites según la actividad",
   "Las familias pueden participar en reglas compartidas",
   "Las consecuencias deben ser proporcionales"
  ],
  "answer": 0,
  "steps": [
   "Relee «¿Qué afirmación sería incompatible con la postura del texto?» y distingue la información solicitada de los otros detalles del texto.",
   "La propuesta regula usos y conserva lectura y actividades manuales. Usar teléfonos en todo momento borra esa distinción central.",
   "La alternativa «Toda actividad escolar debe realizarse con teléfonos» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "La propuesta regula usos y conserva lectura y actividades manuales. Usar teléfonos en todo momento borra esa distinción central.",
  "example": "Si alguien propone caminar algunos trayectos y usar bus en otros, atribuirle «todos los viajes a pie» exagera su postura.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Evaluación de evidencia",
  "difficulty": "intermedio",
  "explanations": [
   "¡Cachaste! La propuesta regula usos y conserva lectura y actividades manuales. Usar teléfonos en todo momento borra esa distinción central.",
   "«Se necesitan límites según la actividad» no coincide con lo que establece el texto. La propuesta regula usos y conserva lectura y actividades manuales. Usar teléfonos en todo momento borra esa distinción central. La conclusión respaldada es «Toda actividad escolar debe realizarse con teléfonos».",
   "«Las familias pueden participar en reglas compartidas» no coincide con lo que establece el texto. La propuesta regula usos y conserva lectura y actividades manuales. Usar teléfonos en todo momento borra esa distinción central. La conclusión respaldada es «Toda actividad escolar debe realizarse con teléfonos».",
   "«Las consecuencias deben ser proporcionales» no coincide con lo que establece el texto. La propuesta regula usos y conserva lectura y actividades manuales. Usar teléfonos en todo momento borra esa distinción central. La conclusión respaldada es «Toda actividad escolar debe realizarse con teléfonos»."
  ]
 },
 {
  "id": "LEC-114",
  "passageId": "T03",
  "skill": "Interpretar",
  "question": "¿Por qué incluir a familias y docentes en las reglas?",
  "options": [
   "Para dejar cada incumplimiento sin consecuencia",
   "Para reemplazar toda decisión pedagógica por una encuesta",
   "Para permitir cualquier uso si lo pide una familia",
   "Para construir criterios compartidos sobre el uso"
  ],
  "answer": 3,
  "steps": [
   "Relee «¿Por qué incluir a familias y docentes en las reglas?» y distingue la información solicitada de los otros detalles del texto.",
   "La participación busca acuerdos comprensibles y aplicables, junto con consecuencias proporcionales, no ausencia de límites.",
   "La alternativa «Para construir criterios compartidos sobre el uso» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "La participación busca acuerdos comprensibles y aplicables, junto con consecuencias proporcionales, no ausencia de límites.",
  "example": "Un acuerdo de convivencia construido con la comunidad puede facilitar que se entiendan sus razones; participar no equivale a decidir sin reglas.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Inferencias y relaciones",
  "difficulty": "intermedio",
  "explanations": [
   "«Para dejar cada incumplimiento sin consecuencia» no coincide con lo que establece el texto. La participación busca acuerdos comprensibles y aplicables, junto con consecuencias proporcionales, no ausencia de límites. La conclusión respaldada es «Para construir criterios compartidos sobre el uso».",
   "«Para reemplazar toda decisión pedagógica por una encuesta» no coincide con lo que establece el texto. La participación busca acuerdos comprensibles y aplicables, junto con consecuencias proporcionales, no ausencia de límites. La conclusión respaldada es «Para construir criterios compartidos sobre el uso».",
   "«Para permitir cualquier uso si lo pide una familia» no coincide con lo que establece el texto. La participación busca acuerdos comprensibles y aplicables, junto con consecuencias proporcionales, no ausencia de límites. La conclusión respaldada es «Para construir criterios compartidos sobre el uso».",
   "¡Cachaste! La participación busca acuerdos comprensibles y aplicables, junto con consecuencias proporcionales, no ausencia de límites."
  ]
 },
 {
  "id": "LEC-115",
  "passageId": "T04",
  "skill": "Localizar",
  "question": "¿Cuántos kilogramos de zanahorias se cosecharon en abril y mayo en conjunto?",
  "options": [
   "8 kg",
   "25 kg",
   "15 kg",
   "7 kg"
  ],
  "answer": 2,
  "steps": [
   "Relee «¿Cuántos kilogramos de zanahorias se cosecharon en abril y mayo en conjunto?» y distingue la información solicitada de los otros detalles del texto.",
   "La tabla registra 7 kg en abril y 8 en mayo: 7+8=15. Los 25 kg corresponden a la suma de todos los cultivos de abril.",
   "La alternativa «15 kg» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "La tabla registra 7 kg en abril y 8 en mayo: 7+8=15. Los 25 kg corresponden a la suma de todos los cultivos de abril.",
  "example": "Si una tabla registra 4 y 6 cuadernos en dos semanas, el total de esas semanas es 10; no uses la columna de otro producto.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Información explícita",
  "difficulty": "intermedio",
  "explanations": [
   "«8 kg» no coincide con lo que establece el texto. La tabla registra 7 kg en abril y 8 en mayo: 7+8=15. Los 25 kg corresponden a la suma de todos los cultivos de abril. La conclusión respaldada es «15 kg».",
   "«25 kg» no coincide con lo que establece el texto. La tabla registra 7 kg en abril y 8 en mayo: 7+8=15. Los 25 kg corresponden a la suma de todos los cultivos de abril. La conclusión respaldada es «15 kg».",
   "¡Cachaste! La tabla registra 7 kg en abril y 8 en mayo: 7+8=15. Los 25 kg corresponden a la suma de todos los cultivos de abril.",
   "«7 kg» no coincide con lo que establece el texto. La tabla registra 7 kg en abril y 8 en mayo: 7+8=15. Los 25 kg corresponden a la suma de todos los cultivos de abril. La conclusión respaldada es «15 kg»."
  ]
 },
 {
  "id": "LEC-116",
  "passageId": "T04",
  "skill": "Interpretar",
  "question": "¿Qué comparación muestra un cambio de composición de la cosecha entre abril y junio?",
  "options": [
   "Los tres cultivos mantienen igual producción",
   "Bajan las lechugas y aumentan los tomates",
   "Bajan las lechugas y también los tomates",
   "Las zanahorias desaparecen de la cosecha"
  ],
  "answer": 1,
  "steps": [
   "Relee «¿Qué comparación muestra un cambio de composición de la cosecha entre abril y junio?» y distingue la información solicitada de los otros detalles del texto.",
   "Lechugas: 18 a 12; tomates: 0 a 16. La producción cambia de composición y no solo de total.",
   "La alternativa «Bajan las lechugas y aumentan los tomates» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "Lechugas: 18 a 12; tomates: 0 a 16. La producción cambia de composición y no solo de total.",
  "example": "Si bajan las ventas de pan y suben las de fruta, cambia la composición de ventas aunque el total pudiera mantenerse.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Inferencias y relaciones",
  "difficulty": "intermedio",
  "explanations": [
   "«Los tres cultivos mantienen igual producción» no coincide con lo que establece el texto. Lechugas: 18 a 12; tomates: 0 a 16. La producción cambia de composición y no solo de total. La conclusión respaldada es «Bajan las lechugas y aumentan los tomates».",
   "¡Cachaste! Lechugas: 18 a 12; tomates: 0 a 16. La producción cambia de composición y no solo de total.",
   "«Bajan las lechugas y también los tomates» no coincide con lo que establece el texto. Lechugas: 18 a 12; tomates: 0 a 16. La producción cambia de composición y no solo de total. La conclusión respaldada es «Bajan las lechugas y aumentan los tomates».",
   "«Las zanahorias desaparecen de la cosecha» no coincide con lo que establece el texto. Lechugas: 18 a 12; tomates: 0 a 16. La producción cambia de composición y no solo de total. La conclusión respaldada es «Bajan las lechugas y aumentan los tomates»."
  ]
 },
 {
  "id": "LEC-117",
  "passageId": "T04",
  "skill": "Evaluar",
  "question": "¿Por qué el total cosechado no basta para comparar eficiencia?",
  "options": [
   "Porque falta relacionarlo con los recursos utilizados",
   "Porque los kilogramos no permiten sumar productos",
   "Porque solo importan los tomates para evaluar el huerto",
   "Porque una cosecha mayor siempre requiere menos agua"
  ],
  "answer": 0,
  "steps": [
   "Relee «¿Por qué el total cosechado no basta para comparar eficiencia?» y distingue la información solicitada de los otros detalles del texto.",
   "El texto pide horas, superficie y agua. Eficiencia relaciona resultados e insumos, no únicamente cantidad producida.",
   "La alternativa «Porque falta relacionarlo con los recursos utilizados» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "El texto pide horas, superficie y agua. Eficiencia relaciona resultados e insumos, no únicamente cantidad producida.",
  "example": "Producir 100 piezas con 50 horas y 120 con 100 horas da más piezas en el segundo caso, pero menos piezas por hora.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Evaluación de evidencia",
  "difficulty": "intermedio",
  "explanations": [
   "¡Cachaste! El texto pide horas, superficie y agua. Eficiencia relaciona resultados e insumos, no únicamente cantidad producida.",
   "«Porque los kilogramos no permiten sumar productos» no coincide con lo que establece el texto. El texto pide horas, superficie y agua. Eficiencia relaciona resultados e insumos, no únicamente cantidad producida. La conclusión respaldada es «Porque falta relacionarlo con los recursos utilizados».",
   "«Porque solo importan los tomates para evaluar el huerto» no coincide con lo que establece el texto. El texto pide horas, superficie y agua. Eficiencia relaciona resultados e insumos, no únicamente cantidad producida. La conclusión respaldada es «Porque falta relacionarlo con los recursos utilizados».",
   "«Porque una cosecha mayor siempre requiere menos agua» no coincide con lo que establece el texto. El texto pide horas, superficie y agua. Eficiencia relaciona resultados e insumos, no únicamente cantidad producida. La conclusión respaldada es «Porque falta relacionarlo con los recursos utilizados»."
  ]
 },
 {
  "id": "LEC-118",
  "passageId": "T04",
  "skill": "Localizar",
  "question": "¿Qué destino tiene la producción del huerto?",
  "options": [
   "Se exporta a otra región",
   "Se vende para pagar sueldos",
   "Se almacena toda para el siguiente año",
   "Se entrega gratuitamente al comedor"
  ],
  "answer": 3,
  "steps": [
   "Relee «¿Qué destino tiene la producción del huerto?» y distingue la información solicitada de los otros detalles del texto.",
   "El texto señala el destino al comedor sin cobro. No describe venta, exportación ni almacenamiento de toda la cosecha.",
   "La alternativa «Se entrega gratuitamente al comedor» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "El texto señala el destino al comedor sin cobro. No describe venta, exportación ni almacenamiento de toda la cosecha.",
  "example": "Si un registro dice que los libros fueron donados a una escuela, no corresponde inferir ingresos por venta.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Información explícita",
  "difficulty": "intermedio",
  "explanations": [
   "«Se exporta a otra región» no coincide con lo que establece el texto. El texto señala el destino al comedor sin cobro. No describe venta, exportación ni almacenamiento de toda la cosecha. La conclusión respaldada es «Se entrega gratuitamente al comedor».",
   "«Se vende para pagar sueldos» no coincide con lo que establece el texto. El texto señala el destino al comedor sin cobro. No describe venta, exportación ni almacenamiento de toda la cosecha. La conclusión respaldada es «Se entrega gratuitamente al comedor».",
   "«Se almacena toda para el siguiente año» no coincide con lo que establece el texto. El texto señala el destino al comedor sin cobro. No describe venta, exportación ni almacenamiento de toda la cosecha. La conclusión respaldada es «Se entrega gratuitamente al comedor».",
   "¡Cachaste! El texto señala el destino al comedor sin cobro. No describe venta, exportación ni almacenamiento de toda la cosecha."
  ]
 },
 {
  "id": "LEC-119",
  "passageId": "T05",
  "skill": "Interpretar",
  "question": "¿Qué significa que participar no obliga a incorporar toda solicitud?",
  "options": [
   "Que la autoridad puede decidir sin dar razones",
   "Que solo deben consultarse quienes apoyan la obra",
   "Que las decisiones deben ponderar demandas y justificar lo resuelto",
   "Que escuchar a vecinos no tiene utilidad"
  ],
  "answer": 2,
  "steps": [
   "Relee «¿Qué significa que participar no obliga a incorporar toda solicitud?» y distingue la información solicitada de los otros detalles del texto.",
   "El texto exige escuchar y explicar decisiones; reconoce que las demandas pueden requerir ponderación y no satisfacerse todas.",
   "La alternativa «Que las decisiones deben ponderar demandas y justificar lo resuelto» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "El texto exige escuchar y explicar decisiones; reconoce que las demandas pueden requerir ponderación y no satisfacerse todas.",
  "example": "En un presupuesto escolar hay solicitudes incompatibles. Consultar permite conocerlas y explicar prioridades, aunque no se financien todas.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Inferencias y relaciones",
  "difficulty": "intermedio",
  "explanations": [
   "«Que la autoridad puede decidir sin dar razones» no coincide con lo que establece el texto. El texto exige escuchar y explicar decisiones; reconoce que las demandas pueden requerir ponderación y no satisfacerse todas. La conclusión respaldada es «Que las decisiones deben ponderar demandas y justificar lo resuelto».",
   "«Que solo deben consultarse quienes apoyan la obra» no coincide con lo que establece el texto. El texto exige escuchar y explicar decisiones; reconoce que las demandas pueden requerir ponderación y no satisfacerse todas. La conclusión respaldada es «Que las decisiones deben ponderar demandas y justificar lo resuelto».",
   "¡Cachaste! El texto exige escuchar y explicar decisiones; reconoce que las demandas pueden requerir ponderación y no satisfacerse todas.",
   "«Que escuchar a vecinos no tiene utilidad» no coincide con lo que establece el texto. El texto exige escuchar y explicar decisiones; reconoce que las demandas pueden requerir ponderación y no satisfacerse todas. La conclusión respaldada es «Que las decisiones deben ponderar demandas y justificar lo resuelto»."
  ]
 },
 {
  "id": "LEC-120",
  "passageId": "T05",
  "skill": "Localizar",
  "question": "¿Qué espacios aparecen como puntos sensibles al diseñar la ciclovía?",
  "options": [
   "Los estacionamientos de camiones rurales",
   "El consultorio y las paradas de buses",
   "Los puertos y aeropuertos",
   "Las bibliotecas universitarias"
  ],
  "answer": 1,
  "steps": [
   "Relee «¿Qué espacios aparecen como puntos sensibles al diseñar la ciclovía?» y distingue la información solicitada de los otros detalles del texto.",
   "El texto menciona acceso al consultorio y paradas de buses como situaciones que requieren atención en el diseño.",
   "La alternativa «El consultorio y las paradas de buses» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "El texto menciona acceso al consultorio y paradas de buses como situaciones que requieren atención en el diseño.",
  "example": "Al leer un plan de accesibilidad, identifica los lugares nombrados, sin reemplazarlos por otros que también podrían necesitar mejoras.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Información explícita",
  "difficulty": "intermedio",
  "explanations": [
   "«Los estacionamientos de camiones rurales» no coincide con lo que establece el texto. El texto menciona acceso al consultorio y paradas de buses como situaciones que requieren atención en el diseño. La conclusión respaldada es «El consultorio y las paradas de buses».",
   "¡Cachaste! El texto menciona acceso al consultorio y paradas de buses como situaciones que requieren atención en el diseño.",
   "«Los puertos y aeropuertos» no coincide con lo que establece el texto. El texto menciona acceso al consultorio y paradas de buses como situaciones que requieren atención en el diseño. La conclusión respaldada es «El consultorio y las paradas de buses».",
   "«Las bibliotecas universitarias» no coincide con lo que establece el texto. El texto menciona acceso al consultorio y paradas de buses como situaciones que requieren atención en el diseño. La conclusión respaldada es «El consultorio y las paradas de buses»."
  ]
 },
 {
  "id": "LEC-121",
  "passageId": "T05",
  "skill": "Evaluar",
  "question": "¿Qué conjunto de indicadores responde mejor a la evaluación posterior propuesta?",
  "options": [
   "Accidentes, tiempos y uso de la ciclovía",
   "Cantidad de discursos y carteles inaugurales",
   "Solo el precio de la pintura utilizada",
   "Número de fotografías de la inauguración"
  ],
  "answer": 0,
  "steps": [
   "Relee «¿Qué conjunto de indicadores responde mejor a la evaluación posterior propuesta?» y distingue la información solicitada de los otros detalles del texto.",
   "La evaluación se dirige a seguridad, movilidad y utilización. Los gastos o actos inaugurales no describen por sí mismos esos resultados.",
   "La alternativa «Accidentes, tiempos y uso de la ciclovía» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "La evaluación se dirige a seguridad, movilidad y utilización. Los gastos o actos inaugurales no describen por sí mismos esos resultados.",
  "example": "Para evaluar un comedor, mide acceso, tiempos de espera y alimentación entregada; contar invitaciones de apertura mide difusión.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Evaluación de evidencia",
  "difficulty": "intermedio",
  "explanations": [
   "¡Cachaste! La evaluación se dirige a seguridad, movilidad y utilización. Los gastos o actos inaugurales no describen por sí mismos esos resultados.",
   "«Cantidad de discursos y carteles inaugurales» no coincide con lo que establece el texto. La evaluación se dirige a seguridad, movilidad y utilización. Los gastos o actos inaugurales no describen por sí mismos esos resultados. La conclusión respaldada es «Accidentes, tiempos y uso de la ciclovía».",
   "«Solo el precio de la pintura utilizada» no coincide con lo que establece el texto. La evaluación se dirige a seguridad, movilidad y utilización. Los gastos o actos inaugurales no describen por sí mismos esos resultados. La conclusión respaldada es «Accidentes, tiempos y uso de la ciclovía».",
   "«Número de fotografías de la inauguración» no coincide con lo que establece el texto. La evaluación se dirige a seguridad, movilidad y utilización. Los gastos o actos inaugurales no describen por sí mismos esos resultados. La conclusión respaldada es «Accidentes, tiempos y uso de la ciclovía»."
  ]
 },
 {
  "id": "LEC-122",
  "passageId": "T05",
  "skill": "Interpretar",
  "question": "¿Cómo presenta el texto la posibilidad de modificar la obra después de evaluarla?",
  "options": [
   "Como prueba automática de que nunca debió construirse",
   "Como reemplazo de la participación previa",
   "Como garantía de que no habrá accidentes futuros",
   "Como una forma responsable de corregir problemas"
  ],
  "answer": 3,
  "steps": [
   "Relee «¿Cómo presenta el texto la posibilidad de modificar la obra después de evaluarla?» y distingue la información solicitada de los otros detalles del texto.",
   "El texto conecta evaluación y ajustes con responsabilidad: una corrección informada no equivale a invalidar toda la iniciativa.",
   "La alternativa «Como una forma responsable de corregir problemas» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "El texto conecta evaluación y ajustes con responsabilidad: una corrección informada no equivale a invalidar toda la iniciativa.",
  "example": "Si una biblioteca cambia un horario tras evaluar asistencia, el ajuste puede mejorar el servicio en lugar de demostrar un fracaso total.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Inferencias y relaciones",
  "difficulty": "intermedio",
  "explanations": [
   "«Como prueba automática de que nunca debió construirse» no coincide con lo que establece el texto. El texto conecta evaluación y ajustes con responsabilidad: una corrección informada no equivale a invalidar toda la iniciativa. La conclusión respaldada es «Como una forma responsable de corregir problemas».",
   "«Como reemplazo de la participación previa» no coincide con lo que establece el texto. El texto conecta evaluación y ajustes con responsabilidad: una corrección informada no equivale a invalidar toda la iniciativa. La conclusión respaldada es «Como una forma responsable de corregir problemas».",
   "«Como garantía de que no habrá accidentes futuros» no coincide con lo que establece el texto. El texto conecta evaluación y ajustes con responsabilidad: una corrección informada no equivale a invalidar toda la iniciativa. La conclusión respaldada es «Como una forma responsable de corregir problemas».",
   "¡Cachaste! El texto conecta evaluación y ajustes con responsabilidad: una corrección informada no equivale a invalidar toda la iniciativa."
  ]
 },
 {
  "id": "LEC-123",
  "passageId": "T06",
  "skill": "Localizar",
  "question": "¿Qué suceso interrumpe la escucha de la radio?",
  "options": [
   "La rotura de la ventana",
   "El término de la visita de Mara",
   "Un corte de electricidad",
   "La llegada de una carta"
  ],
  "answer": 2,
  "steps": [
   "Relee «¿Qué suceso interrumpe la escucha de la radio?» y distingue la información solicitada de los otros detalles del texto.",
   "El corte de electricidad detiene la radio y permite que la música de la calle adquiera protagonismo en la escena.",
   "La alternativa «Un corte de electricidad» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "El corte de electricidad detiene la radio y permite que la música de la calle adquiera protagonismo en la escena.",
  "example": "Si en un cuento la lluvia obliga a entrar a una casa, esa lluvia desencadena el cambio de escenario; no confundirla con un recuerdo posterior.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Información explícita",
  "difficulty": "intermedio",
  "explanations": [
   "«La rotura de la ventana» no coincide con lo que establece el texto. El corte de electricidad detiene la radio y permite que la música de la calle adquiera protagonismo en la escena. La conclusión respaldada es «Un corte de electricidad».",
   "«El término de la visita de Mara» no coincide con lo que establece el texto. El corte de electricidad detiene la radio y permite que la música de la calle adquiera protagonismo en la escena. La conclusión respaldada es «Un corte de electricidad».",
   "¡Cachaste! El corte de electricidad detiene la radio y permite que la música de la calle adquiera protagonismo en la escena.",
   "«La llegada de una carta» no coincide con lo que establece el texto. El corte de electricidad detiene la radio y permite que la música de la calle adquiera protagonismo en la escena. La conclusión respaldada es «Un corte de electricidad»."
  ]
 },
 {
  "id": "LEC-124",
  "passageId": "T06",
  "skill": "Interpretar",
  "question": "¿Qué aporta la anotación sobre el primer baile con Ernesto?",
  "options": [
   "Permite calcular la duración del corte de luz",
   "Vincula la melodía con una experiencia personal de Elvira",
   "Demuestra que Ernesto toca en la banda de la calle",
   "Informa cuándo se compró la radio"
  ],
  "answer": 1,
  "steps": [
   "Relee «¿Qué aporta la anotación sobre el primer baile con Ernesto?» y distingue la información solicitada de los otros detalles del texto.",
   "La nota recuerda el primer baile y la lluvia; conecta música y memoria íntima. No identifica a músicos actuales ni datos técnicos.",
   "La alternativa «Vincula la melodía con una experiencia personal de Elvira» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "La nota recuerda el primer baile y la lluvia; conecta música y memoria íntima. No identifica a músicos actuales ni datos técnicos.",
  "example": "Una entrada de teatro guardada con una fecha puede evocar una amistad: el objeto importa por la experiencia asociada.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Inferencias y relaciones",
  "difficulty": "intermedio",
  "explanations": [
   "«Permite calcular la duración del corte de luz» no coincide con lo que establece el texto. La nota recuerda el primer baile y la lluvia; conecta música y memoria íntima. No identifica a músicos actuales ni datos técnicos. La conclusión respaldada es «Vincula la melodía con una experiencia personal de Elvira».",
   "¡Cachaste! La nota recuerda el primer baile y la lluvia; conecta música y memoria íntima. No identifica a músicos actuales ni datos técnicos.",
   "«Demuestra que Ernesto toca en la banda de la calle» no coincide con lo que establece el texto. La nota recuerda el primer baile y la lluvia; conecta música y memoria íntima. No identifica a músicos actuales ni datos técnicos. La conclusión respaldada es «Vincula la melodía con una experiencia personal de Elvira».",
   "«Informa cuándo se compró la radio» no coincide con lo que establece el texto. La nota recuerda el primer baile y la lluvia; conecta música y memoria íntima. No identifica a músicos actuales ni datos técnicos. La conclusión respaldada es «Vincula la melodía con una experiencia personal de Elvira»."
  ]
 },
 {
  "id": "LEC-125",
  "passageId": "T06",
  "skill": "Interpretar",
  "question": "¿Qué cambio se produce en la atención de Mara durante la escena?",
  "options": [
   "Pasa de la rutina de la radio a escuchar la historia de Elvira",
   "Deja de interesarse por cualquier relato",
   "Se concentra solo en reparar el circuito eléctrico",
   "Decide abandonar de inmediato la visita"
  ],
  "answer": 0,
  "steps": [
   "Relee «¿Qué cambio se produce en la atención de Mara durante la escena?» y distingue la información solicitada de los otros detalles del texto.",
   "Mara no vuelve a encender la radio para privilegiar el relato. El interés cambia de un aparato a la memoria compartida.",
   "La alternativa «Pasa de la rutina de la radio a escuchar la historia de Elvira» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "Mara no vuelve a encender la radio para privilegiar el relato. El interés cambia de un aparato a la memoria compartida.",
  "example": "Cuando alguien deja de mirar un álbum para escuchar la historia de quien aparece en una foto, cambia del objeto al relato de vida.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Inferencias y relaciones",
  "difficulty": "intermedio",
  "explanations": [
   "¡Cachaste! Mara no vuelve a encender la radio para privilegiar el relato. El interés cambia de un aparato a la memoria compartida.",
   "«Deja de interesarse por cualquier relato» no coincide con lo que establece el texto. Mara no vuelve a encender la radio para privilegiar el relato. El interés cambia de un aparato a la memoria compartida. La conclusión respaldada es «Pasa de la rutina de la radio a escuchar la historia de Elvira».",
   "«Se concentra solo en reparar el circuito eléctrico» no coincide con lo que establece el texto. Mara no vuelve a encender la radio para privilegiar el relato. El interés cambia de un aparato a la memoria compartida. La conclusión respaldada es «Pasa de la rutina de la radio a escuchar la historia de Elvira».",
   "«Decide abandonar de inmediato la visita» no coincide con lo que establece el texto. Mara no vuelve a encender la radio para privilegiar el relato. El interés cambia de un aparato a la memoria compartida. La conclusión respaldada es «Pasa de la rutina de la radio a escuchar la historia de Elvira»."
  ]
 },
 {
  "id": "LEC-126",
  "passageId": "T06",
  "skill": "Evaluar",
  "question": "¿Qué interpretación carece de apoyo en el relato de Mara y Elvira?",
  "options": [
   "Una melodía puede activar recuerdos personales",
   "La interrupción de una rutina permite conversar",
   "La escucha de Mara adquiere un sentido afectivo",
   "La banda de la calle interpreta a propósito la historia de Elvira"
  ],
  "answer": 3,
  "steps": [
   "Relee «¿Qué interpretación carece de apoyo en el relato de Mara y Elvira?» y distingue la información solicitada de los otros detalles del texto.",
   "La coincidencia musical activa un recuerdo; el relato no atribuye a la banda conocimiento ni intención sobre la historia personal.",
   "La alternativa «La banda de la calle interpreta a propósito la historia de Elvira» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "La coincidencia musical activa un recuerdo; el relato no atribuye a la banda conocimiento ni intención sobre la historia personal.",
  "example": "Que una canción coincida con una emoción del personaje no demuestra que quien la canta conozca esa emoción.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Evaluación de evidencia",
  "difficulty": "intermedio",
  "explanations": [
   "«Una melodía puede activar recuerdos personales» no coincide con lo que establece el texto. La coincidencia musical activa un recuerdo; el relato no atribuye a la banda conocimiento ni intención sobre la historia personal. La conclusión respaldada es «La banda de la calle interpreta a propósito la historia de Elvira».",
   "«La interrupción de una rutina permite conversar» no coincide con lo que establece el texto. La coincidencia musical activa un recuerdo; el relato no atribuye a la banda conocimiento ni intención sobre la historia personal. La conclusión respaldada es «La banda de la calle interpreta a propósito la historia de Elvira».",
   "«La escucha de Mara adquiere un sentido afectivo» no coincide con lo que establece el texto. La coincidencia musical activa un recuerdo; el relato no atribuye a la banda conocimiento ni intención sobre la historia personal. La conclusión respaldada es «La banda de la calle interpreta a propósito la historia de Elvira».",
   "¡Cachaste! La coincidencia musical activa un recuerdo; el relato no atribuye a la banda conocimiento ni intención sobre la historia personal."
  ]
 },
 {
  "id": "LEC-127",
  "passageId": "T07",
  "skill": "Localizar",
  "question": "¿Qué señal advierte del peligro en el trayecto al tranque?",
  "options": [
   "Una carta dejada en casa",
   "Un cartel que anuncia lluvia para el mes siguiente",
   "Una cinta amarilla junto al derrumbe",
   "Un horario de museo"
  ],
  "answer": 2,
  "steps": [
   "Relee «¿Qué señal advierte del peligro en el trayecto al tranque?» y distingue la información solicitada de los otros detalles del texto.",
   "La cinta amarilla y las rocas sueltas sitúan un peligro concreto en el sendero. El aviso se relaciona con el derrumbe.",
   "La alternativa «Una cinta amarilla junto al derrumbe» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "La cinta amarilla y las rocas sueltas sitúan un peligro concreto en el sendero. El aviso se relaciona con el derrumbe.",
  "example": "En una narración, un puente cortado y una barrera pueden explicar que el personaje cambie de ruta sin que abandone todo el viaje.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Información explícita",
  "difficulty": "intermedio",
  "explanations": [
   "«Una carta dejada en casa» no coincide con lo que establece el texto. La cinta amarilla y las rocas sueltas sitúan un peligro concreto en el sendero. El aviso se relaciona con el derrumbe. La conclusión respaldada es «Una cinta amarilla junto al derrumbe».",
   "«Un cartel que anuncia lluvia para el mes siguiente» no coincide con lo que establece el texto. La cinta amarilla y las rocas sueltas sitúan un peligro concreto en el sendero. El aviso se relaciona con el derrumbe. La conclusión respaldada es «Una cinta amarilla junto al derrumbe».",
   "¡Cachaste! La cinta amarilla y las rocas sueltas sitúan un peligro concreto en el sendero. El aviso se relaciona con el derrumbe.",
   "«Un horario de museo» no coincide con lo que establece el texto. La cinta amarilla y las rocas sueltas sitúan un peligro concreto en el sendero. El aviso se relaciona con el derrumbe. La conclusión respaldada es «Una cinta amarilla junto al derrumbe»."
  ]
 },
 {
  "id": "LEC-128",
  "passageId": "T07",
  "skill": "Interpretar",
  "question": "¿Qué caracteriza la decisión de la hermana de Ignacio?",
  "options": [
   "Decide impedir para siempre las salidas de Ignacio",
   "Prioriza la seguridad y propone regresar por otro camino",
   "Busca llegar más rápido cruzando el derrumbe",
   "Desestima las señales de peligro del sendero"
  ],
  "answer": 1,
  "steps": [
   "Relee «¿Qué caracteriza la decisión de la hermana de Ignacio?» y distingue la información solicitada de los otros detalles del texto.",
   "Ante el riesgo del derrumbe, propone regresar por una ruta segura; no se plantea una prohibición permanente de salir.",
   "La alternativa «Prioriza la seguridad y propone regresar por otro camino» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "Ante el riesgo del derrumbe, propone regresar por una ruta segura; no se plantea una prohibición permanente de salir.",
  "example": "Cambiar una excursión por una ruta segura durante una tormenta es una decisión contextual, no renunciar a todas las excursiones.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Inferencias y relaciones",
  "difficulty": "intermedio",
  "explanations": [
   "«Decide impedir para siempre las salidas de Ignacio» no coincide con lo que establece el texto. Ante el riesgo del derrumbe, propone regresar por una ruta segura; no se plantea una prohibición permanente de salir. La conclusión respaldada es «Prioriza la seguridad y propone regresar por otro camino».",
   "¡Cachaste! Ante el riesgo del derrumbe, propone regresar por una ruta segura; no se plantea una prohibición permanente de salir.",
   "«Busca llegar más rápido cruzando el derrumbe» no coincide con lo que establece el texto. Ante el riesgo del derrumbe, propone regresar por una ruta segura; no se plantea una prohibición permanente de salir. La conclusión respaldada es «Prioriza la seguridad y propone regresar por otro camino».",
   "«Desestima las señales de peligro del sendero» no coincide con lo que establece el texto. Ante el riesgo del derrumbe, propone regresar por una ruta segura; no se plantea una prohibición permanente de salir. La conclusión respaldada es «Prioriza la seguridad y propone regresar por otro camino»."
  ]
 },
 {
  "id": "LEC-129",
  "passageId": "T07",
  "skill": "Evaluar",
  "question": "¿Qué afirmación exagera lo ocurrido al final del paseo?",
  "options": [
   "Ignacio deja de interesarse para siempre por fotografiar",
   "El paseo no produce las imágenes inicialmente esperadas",
   "El regreso permite observar detalles del pueblo",
   "La experiencia adquiere valor pese al cambio de plan"
  ],
  "answer": 0,
  "steps": [
   "Relee «¿Qué afirmación exagera lo ocurrido al final del paseo?» y distingue la información solicitada de los otros detalles del texto.",
   "El relato presenta un cambio de mirada durante ese paseo. No afirma una renuncia permanente a la fotografía.",
   "La alternativa «Ignacio deja de interesarse para siempre por fotografiar» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "El relato presenta un cambio de mirada durante ese paseo. No afirma una renuncia permanente a la fotografía.",
  "example": "Que una persona disfrute dibujar una tarde no demuestra que nunca volverá a usar su cámara: una experiencia no prueba un cambio absoluto.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Evaluación de evidencia",
  "difficulty": "intermedio",
  "explanations": [
   "¡Cachaste! El relato presenta un cambio de mirada durante ese paseo. No afirma una renuncia permanente a la fotografía.",
   "«El paseo no produce las imágenes inicialmente esperadas» no coincide con lo que establece el texto. El relato presenta un cambio de mirada durante ese paseo. No afirma una renuncia permanente a la fotografía. La conclusión respaldada es «Ignacio deja de interesarse para siempre por fotografiar».",
   "«El regreso permite observar detalles del pueblo» no coincide con lo que establece el texto. El relato presenta un cambio de mirada durante ese paseo. No afirma una renuncia permanente a la fotografía. La conclusión respaldada es «Ignacio deja de interesarse para siempre por fotografiar».",
   "«La experiencia adquiere valor pese al cambio de plan» no coincide con lo que establece el texto. El relato presenta un cambio de mirada durante ese paseo. No afirma una renuncia permanente a la fotografía. La conclusión respaldada es «Ignacio deja de interesarse para siempre por fotografiar»."
  ]
 },
 {
  "id": "LEC-130",
  "passageId": "T07",
  "skill": "Interpretar",
  "question": "¿Qué relación une el plan frustrado y la observación de aves y cables?",
  "options": [
   "La observación demuestra que el tranque ya no existe",
   "El paseo confirma que solo vale cumplir el objetivo inicial",
   "Las aves causan el derrumbe del sendero",
   "El cambio de plan abre una experiencia valiosa no prevista"
  ],
  "answer": 3,
  "steps": [
   "Relee «¿Qué relación une el plan frustrado y la observación de aves y cables?» y distingue la información solicitada de los otros detalles del texto.",
   "El relato desplaza el valor de la salida desde la foto prevista hacia lo descubierto en el regreso. No niega la frustración inicial.",
   "La alternativa «El cambio de plan abre una experiencia valiosa no prevista» conserva el alcance de la evidencia; las otras añaden, alteran o intercambian datos."
  ],
  "easy": "El relato desplaza el valor de la salida desde la foto prevista hacia lo descubierto en el regreso. No niega la frustración inicial.",
  "example": "Si una lluvia impide un partido y permite conocer historias de los vecinos bajo un techo, aparece un valor inesperado sin negar el contratiempo.",
  "origin": "original",
  "reviewStatus": "revisado_con_evidencia_textual",
  "concept": "Inferencias y relaciones",
  "difficulty": "intermedio",
  "explanations": [
   "«La observación demuestra que el tranque ya no existe» no coincide con lo que establece el texto. El relato desplaza el valor de la salida desde la foto prevista hacia lo descubierto en el regreso. No niega la frustración inicial. La conclusión respaldada es «El cambio de plan abre una experiencia valiosa no prevista».",
   "«El paseo confirma que solo vale cumplir el objetivo inicial» no coincide con lo que establece el texto. El relato desplaza el valor de la salida desde la foto prevista hacia lo descubierto en el regreso. No niega la frustración inicial. La conclusión respaldada es «El cambio de plan abre una experiencia valiosa no prevista».",
   "«Las aves causan el derrumbe del sendero» no coincide con lo que establece el texto. El relato desplaza el valor de la salida desde la foto prevista hacia lo descubierto en el regreso. No niega la frustración inicial. La conclusión respaldada es «El cambio de plan abre una experiencia valiosa no prevista».",
   "¡Cachaste! El relato desplaza el valor de la salida desde la foto prevista hacia lo descubierto en el regreso. No niega la frustración inicial."
  ]
 }
]);
/* Diagnóstico de cada distractor: motivos específicos, vinculados con la evidencia. */
{
const reasons=`
1|Reduce la frecuencia: el texto dice dos visitas semanales.|Aumenta la frecuencia sin respaldo: no se mencionan tres visitas.|Confunde una parada añadida con toda la frecuencia semanal.
2|Las ferias forman parte del recorrido móvil, no del servicio citado en la sede.|Las consultas en plazas corresponden a la camioneta, no a lo que se mantiene en el edificio.|Las sedes vecinales son paradas del servicio móvil.
3|El edificio conserva sus talleres; no se plantea reemplazarlos todos.|El equipo sí modifica paradas según la información de uso.|Ampliar computadores no es la causa dada para visitar ferias.
4|Las paradas se ajustan según demanda; no se exige frecuencia idéntica en todos los barrios.|El relato también considera nuevos usuarios y consultas, además de préstamos.|La sede conserva talleres y computadores; la camioneta complementa esos servicios.
5|El total del centro no distingue si mejoró el acceso de los barrios alejados.|Contar paradas no demuestra quién pudo usar el servicio.|El combustible mide un gasto, no la distribución del acceso entre habitantes.
6|El relato no ubica la medición a las nueve.|Mediodía no coincide con las quince horas indicadas.|Las veinte horas no corresponden al horario registrado.
7|Ocho grados es la diferencia entre las plazas, no la temperatura de la plaza Sur.|Quince corresponde a la hora de medición, no a grados de temperatura.|Veintiocho corresponde a la plaza Norte, no a la Sur.
8|La ausencia de lluvia no hace imposible comparar; el problema son otros factores no aislados.|El texto indica instrumentos comparables, no modelos distintos como explicación.|La diferencia observada no identifica por sí sola una causa exclusiva.
9|Medir más no elimina automáticamente el efecto del pavimento.|Se propone ampliar observaciones comparables, no reducirlas a una.|La recomendación reconoce que una observación limitada no basta para atribuir causalidad.
10|Se reconoce que pavimento y tránsito también pueden influir.|El texto no afirma haber controlado todas las condiciones de tránsito.|La calidad integral incluye usos y experiencias que una temperatura aislada no mide.
11|La regla propuesta no se limita exclusivamente a redes sociales.|El pasaje consultado dice durante explicaciones; esta alternativa cambia la condición expresa.|Las actividades autorizadas son una excepción al guardado, no parte de una prohibición total.
12|El autor conserva lectura y actividades manuales; no afirma mejora necesaria por usar pantallas siempre.|La propuesta exige normas compartidas; no defiende uso libre sin acuerdos.|La tesis cuestiona precisamente que la prohibición absoluta sea la única respuesta.
13|La lectura extensa aparece como actividad que no necesita pantalla en la propuesta.|Los experimentos conservan valor; las normas no los vuelven innecesarios.|El autor distingue usos pertinentes y momentos sin dispositivos.
14|La preferencia estudiantil sola no prueba efectos sobre atención ni aprendizaje.|La disponibilidad de teléfonos no mide el resultado de la regulación.|Las opiniones sin comparación no evalúan directamente el efecto relativo de las dos normas.
15|El texto no quiere reemplazar la lectura extensa con pantallas.|Se proponen consecuencias proporcionales; no se descartan todas.|El autor no afirma facilidad universal de las prohibiciones.
16|Diez kilogramos corresponden a zanahorias en junio.|Seis corresponde a tomates de mayo, no de junio.|Doce corresponde a lechugas de junio, no a tomates.
17|Zanahorias suben de siete a ocho y diez; no disminuyen.|Tomates pasan de cero a seis y dieciséis; aumentan.|Lechugas disminuyen; por eso no aumentan todos los cultivos.
18|La maduración del tomate no demuestra que fuera imposible cosechar lechugas.|El comentario explica la serie de tomates, no la baja de lechugas.|Los cultivos tienen trayectorias diferentes; no crecen todos por igual.
19|La suma de mayo es 15+6+8; treinta y uno no corresponde a esa fila.|Treinta y nueve no es la suma de los tres valores de mayo.|Veintitrés omite o cambia uno de los valores de mayo.
20|Las jornadas de trabajo miden otro insumo y no incluyen agua utilizada.|Agua total sin relación con producción no expresa eficiencia hídrica por resultado.|La cosecha sola tampoco informa cuánta agua se utilizó.
21|El texto menciona consultorio, no hospital regional.|Una farmacia no es la instalación nombrada.|No se menciona un laboratorio universitario en ese ejemplo.
22|Escuchar no obliga a aprobar toda solicitud: el autor reconoce límites.|Consultar no equivale a renunciar a cualquier obra.|La participación incluye distintos afectados, no solamente ciclistas expertos.
23|La evaluación busca conocer resultados y corregir, no ocultar errores.|Los indicadores incluyen seguridad y uso, no solo número de automóviles.|Evaluar después complementa la consulta previa, no la reemplaza por completo.
24|El autor propone evaluar después; no cuestiona que eso sea posible.|La presencia de cruces y paraderos es parte del contexto, no el supuesto criticado.|El acceso a servicios es un criterio defendido, no una idea rechazada.
25|El texto prevé ajustes; no promete ausencia total de problemas.|Propone indicadores y no rechaza datos cuantitativos.|Reconoce necesidades y límites, en vez de elevar una opinión a verdad indiscutible.
26|Se anota una fecha; no se indica una hora exacta junto a cada título.|El nombre de Mara no es el dato que acompaña cada canción.|El cuaderno no se presenta como registro de precios.
27|La música viene de la plaza, no de una televisión vecina.|No se identifica un automóvil como fuente musical.|El corte revela un grupo que ensaya, no una radio portátil.
28|Las fechas vinculan recuerdos pasados, no una programación futura.|El cuaderno no se usa como lista de compras.|No describe instrucciones técnicas para reparar la radio.
29|La electricidad vuelve y no se afirma una avería permanente.|No se menciona una prohibición de escuchar música.|Mara quiere escuchar a Elvira: no olvida su presencia.
30|La altura del edificio ubica el espacio, pero no conecta canción y recuerdo.|La marca de la radio no aporta la memoria del baile.|La hora de regreso de la luz no explica el vínculo afectivo central.
31|La advertencia se asocia a derrumbe, no incendio.|El riesgo está en el sendero y sus rocas, no en falta de agua.|La cinta no se vincula con protección de animales.
32|No se organiza un concurso al día siguiente.|Los hermanos avisan del problema; no cierran todas las rutas.|Deciden prudencia y no se describe ese regreso por la huella peligrosa.
33|Ignacio ya tiene un objetivo fotográfico; no se debate qué cámara comprar.|No hay concurso que fundamente una competencia por un premio.|Estudiar o trabajar no es el dilema de esta caminata.
34|El cambio valora lo observado; no renuncia para siempre a observar aves.|El regreso adquiere valor; no demuestra inutilidad de los caminos largos.|La frase expresa aprendizaje, no una acusación contra la hermana.
35|Ahorrar tiempo no elimina la evidencia de derrumbe.|Acelerar junto al borde no reduce el riesgo descrito.|No tener fotografías no vuelve segura la ruta advertida.
36|La agrupación registra observaciones; no parte de certificados de sanción.|No se mencionan análisis sanguíneos de toda la población.|El registro inicial no es una serie satelital de veinte años.
37|Los análisis no confirman un contaminante tóxico específico.|Encontraron más partículas; no ausencia absoluta de sedimentos.|No se demuestra un cambio en todas las especies.
38|Una foto puede orientar, pero no atribuye toda responsabilidad por sí sola.|El texto sí reconoce utilidad de observaciones ciudadanas.|El laboratorio informa límites y solicita nuevas muestras: no elimina toda incertidumbre.
39|Muestrear de nuevo busca repetición del patrón, no convertir imágenes en certificados.|Las observaciones de vecinos no se prohíben.|Una investigación rigurosa no busca impedir resultados contradictorios.
40|Los resultados no certifican potabilidad de todas las aguas.|No se establece culpabilidad de una empresa mediante esos datos.|No se confirma una emergencia química irreversible.
41|La propuesta menciona escuelas y municipios, no ese par de instituciones.|Bancos centrales y tribunales no son los organizadores sugeridos.|No se restringe a fabricantes extranjeros.
42|Una costura suelta no representa el riesgo eléctrico señalado.|La limpieza de una silla no corresponde al ejemplo de falla peligrosa.|Pintura desgastada en una caja no es el riesgo específico descrito.
43|El autor permite reemplazo cuando reparar no es viable o seguro.|Se advierte sobre riesgos y necesidad de conocimiento; no se propone improvisar reparación eléctrica.|La propuesta considera riesgos; no conservar a cualquier costo.
44|El párrafo fija condiciones, no se limita a historia de talleres.|No niega uso de recursos en fabricación.|El texto argumenta sobre límites; no enumera marcas.
45|Los anuncios de productos nuevos no muestran residuos evitados por reparación.|Las vitrinas no miden resultados del programa de reparación.|El color de herramientas no mide cuánto se evitó desechar.
46|El hallazgo fue sobre el mesón de la imprenta, no en un cajón familiar.|La costa pertenece al viaje deseado, no al lugar del hallazgo.|La bicicleta es parte de la historia y no el soporte donde encuentra el sobre.
47|No se atribuye la renuncia al viaje a un robo.|No se menciona cierre de rutas como causa.|La pérdida de la fotografía no explica el trabajo aceptado.
48|Valorar una decisión del padre no implica prohibir todos los viajes a la costa.|La fotografía y el relato se vinculan con una bicicleta; no prueban que jamás tuviera una.|La narración de Rosa aporta contexto; no se demuestra que invente todos los recuerdos.
49|Dejar abierto el sobre invita una conversación; no prepara una carta anónima.|No se plantea vender la fotografía.|Lo deja visible, coherente con conversar y no ocultar.
50|El color identifica el sobre, pero no revela la razón del viaje no realizado.|El horario de cierre no introduce la nueva explicación.|El cajón no contiene la revelación que transforma su interpretación.
51|La moda actual no es el conjunto de pistas históricas descrito.|Las recetas no aparecen como fuentes de datación fotográfica.|No se basa solo en testimonios de turistas.
52|El nuevo intervalo no incluye 1988.|1974 era la precisión inicial que la evidencia no permitía conservar.|La evidencia sitúa la imagen en los años setenta, no antes de 1900.
53|El periódico sí aporta información de la tienda y su rótulo.|Corregir una fotografía no fecha todas las imágenes en un solo año.|El rótulo acota años, no determina el día exacto.
54|Los recuerdos deben contrastarse; no sustituyen automáticamente documentos.|El proyecto reconoce su utilidad como pistas.|Su aporte no garantiza precisión diaria de cualquier fotografía.
55|Descartar todos los testimonios ignora una fuente que puede contrastarse.|Inventar datos contradice reconocer evidencia e incertidumbre.|La fecha más antigua no es necesariamente la correcta.
56|El objeto detenido es un reloj, no una caja registradora.|No se describe un tren detenido como ese objeto.|La bicicleta no corresponde al objeto indicado en la estación.
57|Las notas aparecen en un libro de horarios, no en un mapa turístico.|No se hallan en la pared de una escuela.|La puerta azul es parte del edificio, no el soporte de los registros.
58|Las anotaciones incluyen pasajeros y situaciones de viaje.|El reloj está detenido, no se concluye que siempre funcionara.|Las notas registran vida cotidiana, no solo ceremonias oficiales.
59|La conversación añade vida humana; no se afirma que borre la puerta.|No transforma físicamente el edificio en un centro comercial.|Tomás sigue dibujando, ahora con otra comprensión del lugar.
60|Tener lápices describe a Tomás, no la función comunitaria de la estación.|El reloj detenido no prueba por sí solo vínculos entre personas.|El color de la puerta no informa interacción comunitaria.
61|Modificar presentación y borrar autor no verifica contenido.|Consultar solo al remitente no contrasta la afirmación con fuentes.|Un título y un reenvío no comprueban origen, fecha ni evidencia.
62|El problema es falta de verificación, no intención engañosa de toda persona conocida.|Tampoco se afirma falsedad universal de mensajes privados.|La cantidad de contactos no prueba verdad del contenido.
63|El ejemplo no niega que pantallas contengan textos reales.|El objetivo es advertir sobre contexto omitido, no promocionar aplicaciones.|No enseña edición; muestra un riesgo de interpretación.
64|La amistad no reemplaza pruebas sobre la información.|El autor propone verificar y corregir, no prohibir toda noticia.|La rapidez de reenvío no comprueba veracidad.
65|El argumento citado no aporta una fuente original fechada.|No contiene mediciones contrastadas: solo confianza en la persona.|No distingue hechos y opiniones sobre el contenido mismo.
66|Un minuto no es el período de adaptación descrito.|Una hora excede los quince minutos indicados.|No esperan toda la noche para volver a comparar.
67|Tráfico y radio no son las condiciones astronómicas nombradas.|Turistas y horario comercial no responden a esa planificación.|El texto prioriza nubes y Luna; no precios o anuncios.
68|Planetas no se transforman en estrellas durante la espera.|Las estrellas podían estar allí; cambió la capacidad de observarlas.|La adaptación visual no detiene el movimiento terrestre.
69|La advertencia distingue astros; no vuelve invisibles las estrellas.|No prohíbe mapas; evita una clasificación equivocada.|Distinguir planetas y estrellas no demuestra brillo idéntico de todos los planetas.
70|El color de la libreta no permite reproducir condiciones de observación.|La comida de participantes no identifica esas condiciones.|La tienda de lápices no aporta ubicación ni momento de observación.
71|Los sobres estaban bajo el lavaplatos, no en la escuela.|La estación de buses no es el lugar del hallazgo.|El calendario no contenía los sobres según el relato.
72|Sí apareció un brote durante esa primera semana.|Dos brotes corresponden a una evolución posterior, no a la primera semana.|Tres macetas no significan tres brotes en la primera semana.
73|Preguntar por luz y estación no afirma que el agua sea innecesaria.|Reconoce condiciones y ritmos, no crecimiento idéntico de todas las especies.|No prueba que el tamaño de las macetas sea la causa.
74|El relato muestra tiempos distintos de germinación.|Observar y registrar ayudan a comprender, no son inútiles.|La orientación del abuelo contribuye al aprendizaje, no se desecha como conclusión.
75|Es una imagen afectiva; no una orden literal para conversar con plantas.|La frase literaria no aporta una prueba científica sobre voces.|No establece una relación matemática de medidas.
76|Media hora no coincide con el ahorro citado.|Seis refiere a pistas del cruce, no minutos ahorrados.|Diez minutos no es el valor del indicador mencionado.
77|El texto menciona también vehículos de emergencia, transporte colectivo y carga.|No restringe la necesidad de eficiencia a taxis.|Trenes y embarcaciones no son el conjunto nombrado para esa avenida.
78|El ejemplo se refiere a cruzar caminando, no a conducir.|El problema de accesibilidad no equivale a proponer eliminar semáforos.|Una calle ancha puede ser difícil de cruzar; no se afirma seguridad necesaria.
79|El autor busca evaluar mejor las mejoras, no rechazarlas todas.|Critica precisamente usar solo ahorro de tiempo.|Su propuesta considera distintos usuarios, sin prioridad automática del automóvil.
80|Las ventas por marca no muestran seguridad ni accesibilidad de la obra.|Una fotografía aislada no compara efectos antes y después.|Un conductor satisfecho no representa a todos los usuarios ni los distintos resultados.
81|Veinte corresponde a marzo, no a mayo.|Treinta corresponde a abril, no a mayo.|Noventa son préstamos digitales de mayo, no audiolibros.
82|Los impresos pasan de 120 a 100, no de 40 a 90.|Audiolibros pasan de 20 a 40.|La tabla no presenta revistas como ese formato.
83|Los registros de impresos sí cambian entre meses.|La caída es de diez por mes, no cincuenta.|Los impresos disminuyen, no crecen veinte mensuales.
84|La distinción no depende de que todo se devuelva el mismo día.|Los digitales sí forman parte de los préstamos registrados.|No se establece un préstamo exacto por estudiante; puede haber varios por persona.
85|El aumento digital sí se observa de 40 a 90.|La baja de impresos sí se observa de 120 a 100.|Los audiolibros sí pasan de 20 en marzo a 40 en mayo.
86|El cuaderno aparece en el taller de la abuela, no en una biblioteca.|Una embarcación abandonada no es el lugar del hallazgo.|La oficina escolar no corresponde al lugar descrito.
87|No se prescribe suspender redes durante todo invierno.|No aparece ese cierre semanal del puerto.|El aviso advierte del viento; no ordena salir siempre al amanecer.
88|El problema no es que estuviera hecho a mano, sino omitir información relevante.|El primer gráfico omitía advertencias; no incorporaba demasiadas.|No se afirma ausencia de todas las fechas; faltaban avisos y vacíos importantes.
89|Elisa mejora la representación de registros; no los destruye.|No abandona tecnología: la usa con mayor conciencia de límites.|Incorpora condiciones como el viento, en vez de ignorar clima.
90|La crítica pide información fiel, no declara inútil todo diseño.|No se le ordena dejar de programar.|Se cuestiona el gráfico incompleto, no la posibilidad de registrar mareas.
91|Veintiocho no es la temperatura del estacionamiento registrada.|Treinta y uno corresponde al sector de cemento junto al muro.|Veintiséis corresponde al sector de árboles.
92|Cuatro semanas es el período propuesto de seguimiento, no duración de cada medición.|No se mide una hora en cada punto.|Quince minutos no es el intervalo por punto indicado.
93|Se usaron instrumentos comparables; no se presenta esa diferencia como motivo.|Sí se registraron temperaturas en tres puntos.|El estudio compara sectores de una plaza, no ciudades distintas.
94|Las experiencias vecinales complementan datos, no sustituyen exactamente termómetros.|Una entrevista no calcula por sí sola temperatura del asfalto.|Conocer opiniones no garantiza que se modifique el diseño.
95|Una sola opinión no compara térmicamente los tres lugares.|Instrumentos sin calibración introducen diferencias no controladas.|Medir solo un sector impide comparar los tres en condiciones equivalentes.
96|No se propone sustituir docentes con aplicaciones.|La motivación no es comercializar dispositivos.|La prohibición de teléfonos no elimina las clases presenciales.
97|No se plantea publicidad como excepción educativa.|La excepción citada es accesibilidad, no exclusivamente pruebas finales.|No se define una excepción de recreos obligatorios.
98|Cuestionar extremos no niega la posibilidad de establecer normas.|Las soluciones intermedias incluyen momentos sin pantallas.|El texto busca mejorar convivencia, no eliminarla.
99|La propuesta no prohíbe toda tecnología fuera y dentro del colegio.|Contar confiscaciones no expresa la combinación educativa defendida.|El autor propone reglas y espacios sin teléfonos, no permiso irrestricto.
100|El tamaño del reglamento mide extensión, no efectos de la propuesta.|Contar carteles mide difusión de la norma, no convivencia ni atención.|El precio comercial de teléfonos no evalúa el cambio pedagógico.
`.trim().split('\n');
for(const line of reasons){const[n,...why]=line.split('|');const q=window.READING_QUESTIONS[+n-1];let k=0;q.explanations=q.options.map((option,i)=>i===q.answer?q.explanations[i]:'Elegiste «'+option+'». '+why[k++]+' La alternativa respaldada es «'+q.options[q.answer]+'». '+q.steps[1]);}
}
/* Los ítems añadidos del ensayo evalúan información nueva, sin parafrasear otra pregunta del mismo texto. */
{
const updates={
101:{question:'¿Qué dificultad de traslado enfrentaban lectores de sectores alejados antes del servicio móvil?',answerText:'Debían tomar dos buses para devolver un libro',wrong:['Debían caminar hasta la sede más cercana para devolver cada libro','La camioneta recorría los barrios alejados una vez por semana','Las devoluciones se recibían en las ferias vecinales'],why:'El primer párrafo señala explícitamente dos buses para devolver un libro. Esa barrera de traslado motiva acercar el servicio.',reasons:['El relato no menciona una restricción de medianoche.','Sí había transporte: el problema era requerir dos buses.','La biblioteca del centro seguía funcionando, no estaba cerrada toda la semana.'],example:'Si un texto dice que un trámite exige viajar a otra comuna, ese es un obstáculo territorial. No agregues horarios o cierres que la fuente no menciona.'},
106:{question:'¿Qué condición meteorológica caracterizó la semana de las mediciones iniciales?',answerText:'No hubo lluvias',wrong:['Se registraron lluvias intensas todos los días','Las mediciones se suspendieron por nieve','El texto no informa ninguna condición meteorológica'],why:'El texto sitúa el registro durante una semana sin lluvias. Esa condición descrita no representa todos los climas posibles.',reasons:['La semana se describe sin lluvias, no con precipitaciones intensas.','No se informa suspensión por nieve.','Sí se indica que fue una semana sin lluvias.'],example:'Si un informe aclara que observó tránsito durante vacaciones, identifica esa condición al interpretar sus datos. No la generalices a semanas de clases.'},
111:{question:'¿Cómo propone el autor que sean las consecuencias por incumplir los acuerdos de uso de teléfonos?',answerText:'Proporcionales al incumplimiento',wrong:['Idénticas para cualquier falta, sin considerar su gravedad','Inexistentes una vez que se acordaron reglas','Decididas sin comunicar previamente los criterios'],why:'La propuesta combina reglas compartidas con consecuencias proporcionales. Regular no significa ausencia de consecuencias ni castigos iguales ante cualquier situación.',reasons:['Proporcionalidad exige atender la gravedad, no tratar igual toda falta.','El texto sí contempla consecuencias por incumplimiento.','Se proponen criterios compartidos y claros, no decisiones sin comunicación.'],example:'Una norma puede distinguir un atraso breve de una conducta que daña a otra persona. La proporcionalidad vincula consecuencia y gravedad sin eliminar las reglas.'}
};
for(const[n,u]of Object.entries(updates)){const q=window.READING_QUESTIONS.find(q=>q.id==='LEC-'+n),answer=q.answer;const opts=[u.answerText,...u.wrong];q.options=opts.slice(1);q.options.splice(answer,0,u.answerText);q.question=u.question;q.steps=['Identifica exactamente el dato que solicita la pregunta y el pasaje donde se menciona.',u.why,'Comprueba que la alternativa elegida no añade condiciones ausentes ni contradice lo dicho.'];q.easy=u.why;q.example=u.example;let i=0;q.explanations=q.options.map((o,j)=>j===answer?'¡Cachaste! '+u.why:'Elegiste «'+o+'». '+u.reasons[i++]+' La respuesta respaldada es «'+u.answerText+'». '+u.why);}
}

/* Profesor lector: citas verificables, razonamiento individual y transferencia.
 * Los ejemplos son textos hipotéticos independientes de los veinte pasajes. */
(function(){
 const modules={},rows={};
 function module(key,foundation,intuition,problem,steps,bridge){modules[key]={foundation,intuition,example:{problem,steps,bridge}};}
 module('Dato explícito',[
  'Localizar es recuperar información que el texto dice directamente. Primero identifica qué se pide: una persona, lugar, tiempo, cantidad o condición. Una alternativa puede mencionar algo verdadero y aun así responder otra pregunta.',
  'La evidencia es el fragmento que permite justificar una respuesta. Une el dato con su referente: quién hizo qué, dónde y cuándo. Una paráfrasis puede conservar la idea sin usar exactamente las mismas palabras.'
 ],[
  'Es como buscar una dirección en una invitación: la hora y el lugar están en el mismo papel, pero no se pueden intercambiar. La palabra de la pregunta indica qué casillero necesitas.',
  'Pon mentalmente un dedo sobre la frase que responde y otro sobre lo que te preguntan. Si ambos señalan la misma persona, momento y acción, tienes un respaldo; si cambian, mezclaste datos.'
 ],'Texto nuevo: «El taller de cerámica funciona los martes a las 17:00 en la sede vecinal. Las inscripciones se reciben los viernes por correo». ¿Qué día se realiza el taller?',[
  'La pregunta pide el día de la actividad, no el día de inscripción. Buscamos el verbo que describe el funcionamiento del taller.',
  'La frase «funciona los martes» entrega el dato solicitado. «Los viernes» pertenece a otra acción: recibir inscripciones.',
  'Respondemos martes. La alternativa viernes sería tentadora porque también aparece en el texto, pero cambia el referente. La presencia de una palabra no basta para que responda la pregunta.'
 ],'Vuelve al pasaje e identifica el dato junto con la acción o sujeto al que corresponde, como distinguimos actividad e inscripción.');
 module('Relación causal',[
  'Explicar por qué ocurre un hecho exige relacionar una causa o motivo con su consecuencia. A veces el vínculo es explícito, con porque o por eso; otras veces se infiere conectando información del texto.',
  'Inferir no significa inventar: la conclusión debe desprenderse de pistas concretas. No atribuyas intenciones, causas únicas o efectos permanentes si solo hay coincidencias o cambios puntuales.'
 ],[
  'Piensa en seguir un hilo entre dos hechos. Que estén uno junto al otro en la página no garantiza que el primero causó el segundo: necesitas la unión que el relato ofrece.',
  'Pregunta «¿qué dato me permite dar este salto?». Si para contestar debes agregar una historia que el texto nunca cuenta, el salto es demasiado grande.'
 ],'Texto nuevo: «El sistema de reservas dejó de funcionar. Por eso, la encargada anotó temporalmente las solicitudes en una libreta». ¿Por qué usó la libreta?',[
  'El hecho que queremos explicar es la decisión de anotar a mano. El conector «por eso» la une con el problema del sistema.',
  'El motivo respaldado es poder registrar solicitudes mientras el sistema no funcionaba. No se dice que la encargada rechace toda tecnología.',
  'El adverbio «temporalmente» limita la conclusión: no podemos afirmar que la libreta reemplazará al sistema para siempre. Causa y alcance deben conservarse juntos.'
 ],'Busca el hecho que se explica, las pistas de su motivo y los límites de esa relación; no agregues una intención ajena al pasaje.');
 module('Idea global y tesis',[
  'La idea global integra las partes importantes de un texto, sin reducirlo a un dato aislado. En un texto argumentativo, la tesis es la postura que el autor defiende mediante razones.',
  'Para reconstruirla, identifica el problema inicial, lo que se propone y los límites que el autor reconoce. Una síntesis debe conservar los matices: defender una regulación no equivale a permitir todo ni a prohibir todo.'
 ],[
  'Imagina ponerle un nombre a una película después de verla completa. Un detalle de una escena puede ser cierto, pero no contar de qué trata el conjunto.',
  'En un argumento, pregunta qué propuesta seguiría en pie si borras los ejemplos. Esa idea organiza los ejemplos; no tiene por qué coincidir con la primera opinión citada, que puede ser la de un adversario.'
 ],'Texto nuevo: «El comedor debería ofrecer opciones vegetarianas. No propongo quitar los otros platos: algunos estudiantes tienen otras necesidades. Propongo ampliar las opciones y revisar su uso al terminar el semestre». ¿Cuál es la tesis?',[
  'El problema es una oferta limitada y la propuesta explícita es ampliarla con opciones vegetarianas.',
  'El autor conserva otros platos y propone evaluar la medida. La síntesis debe incluir la ampliación sin convertirla en una sustitución total.',
  'La tesis es ofrecer opciones vegetarianas junto con las existentes y revisar su uso. «Eliminar toda comida no vegetariana» contradice el límite explícito, aunque hable del mismo tema.'
 ],'Integra la propuesta con sus condiciones y contrasta la síntesis con el inicio, desarrollo y cierre del pasaje.');
 module('Función de un fragmento',[
  'Preguntar por la función de una frase no es pedir que repitas su contenido: debes explicar para qué la incluye el autor dentro del texto. Puede ejemplificar, justificar, contrastar, advertir, limitar una tesis o proponer una mejora.',
  'Lee lo que viene antes y después. Los conectores, como sin embargo o además, muestran relaciones. La respuesta debe unir el fragmento con la idea a la que contribuye, en lugar de atribuirle un propósito externo.'
 ],[
  'Piensa en las piezas de una bicicleta: describir que una pieza es redonda no explica para qué sirve. Con una frase pasa lo mismo: importa qué trabajo realiza en el argumento.',
  'Tapa el fragmento por un momento y pregunta qué se perdería: ¿un ejemplo, una precaución, una razón? Esa diferencia ayuda a nombrar su función.'
 ],'Texto nuevo: «Conviene ampliar el horario del gimnasio. Sin embargo, habrá que reservar horas de descanso para quienes viven al lado». ¿Qué función tiene la segunda oración?',[
  'La primera presenta una propuesta: abrir más tiempo. La segunda empieza con «sin embargo», señal de un límite o contraste.',
  'La mención del descanso incorpora una condición para aplicar la propuesta sin ignorar a los vecinos.',
  'Su función es limitar o matizar la ampliación, no negarla por completo ni demostrar con una medición que ya produjo molestias. Propuesta y precaución pueden coexistir.'
 ],'Relaciona la frase con el argumento o la escena que la rodea y nombra qué aporta, no solo de qué habla.');
 module('Evaluar evidencia pertinente',[
  'Evaluar una propuesta exige decidir qué dato responde a su objetivo. Un indicador es una medida observable: si la propuesta busca mejorar acceso, debemos medir acceso y no solo gastos o anuncios.',
  'Comparar antes y después ayuda a identificar cambios; condiciones comparables y grupos de comparación, cuando corresponden, hacen más sólida la evaluación. Una comparación simple no demuestra por sí sola una causa exclusiva.'
 ],[
  'Si quieres saber si un paraguas sirve, miras cuánto te moja la lluvia, no cuántos colores tiene. Un dato puede ser exacto y aun así no servir para la pregunta.',
  'Antes de buscar números, completa «queremos saber si mejoró…». Luego elige qué observación mostraría realmente esa mejora y con qué situación previa o alternativa compararla.'
 ],'Texto nuevo: «Se instalaron paneles para reducir el ruido de la sala». ¿Qué evidencia evaluaría mejor la medida: su color, su precio o el ruido registrado con un procedimiento comparable?',[
  'El objetivo es reducir ruido. Color y precio miden otros aspectos, por lo que no evalúan directamente el resultado.',
  'Comparamos niveles de ruido antes y después en condiciones equivalentes de ocupación y actividad; si fuera posible, añadimos una sala de comparación.',
  'Un descenso comparable respalda que el ruido se redujo. Para atribuirlo solo a los paneles habría que descartar cambios como menos personas o actividades más silenciosas. El indicador pertinente no elimina automáticamente toda incertidumbre.'
 ],'Identifica el objetivo concreto del pasaje y elige un indicador que mida ese resultado, con una comparación pertinente.');
 module('Límites de una conclusión',[
  'Un dato observado, una inferencia y una conclusión causal no son lo mismo. Observar que dos cosas cambian juntas puede apoyar una hipótesis, pero no basta para demostrar que una produce todo el cambio de la otra.',
  'Revisa el alcance: qué personas, lugares y período se estudiaron y qué variables no se controlaron. Palabras como siempre, todas o exclusivamente exigen más evidencia que una observación limitada.'
 ],[
  'Una foto de una esquina no muestra toda la ciudad ni todos los días. Puedes describir lo que ves sin inventar cómo es cada calle del país.',
  'La conclusión es como una caja: no debe ser más grande que lo que los datos pueden sostener. Reconocer que falta información no niega lo que sí se observó.'
 ],'Texto nuevo: «En un curso, veinte estudiantes usaron una guía y subió el promedio. Ese mes también tuvieron clases de apoyo». ¿Podemos afirmar que la guía causó toda la mejora?',[
  'Se observó un aumento del promedio en ese curso. Eso es un resultado concreto, no una ley sobre todos los cursos.',
  'También cambiaron las clases de apoyo. Sin separar ambos factores, no podemos asignar toda la mejora a la guía.',
  'La conclusión prudente reconoce la mejora y propone estudiar las causas con comparaciones adicionales. Tampoco podemos concluir que la guía no sirvió: falta aislar su aporte.'
 ],'Conserva los datos observados y distingue lo que sugieren de lo que realmente demuestran; busca variables alternativas y generalizaciones excesivas.');
 module('Cambio de un personaje',[
  'Para interpretar la evolución de un personaje compara sus expectativas o acciones iniciales con las finales. Una transformación debe apoyarse en conductas, palabras o decisiones narradas.',
  'No necesitamos que el narrador nombre una emoción para inferirla, pero sí pistas coherentes. Un cambio durante una escena no demuestra que el personaje abandonó para siempre una afición o cambió toda su vida.'
 ],[
  'Es como ver dos fotografías del mismo personaje antes y después de una experiencia, pero mirando también qué ocurrió entre ambas. El cambio no se adivina solo por cómo te sentirías tú.',
  'Busca el «antes quería…» y el «después hizo…». Si ambos se sostienen en el relato, puedes describir el cambio sin inventar una intención secreta.'
 ],'Texto nuevo: «Nico fue a devolver una llave y pensaba irse enseguida. Encontró al vecino clasificando cartas de su familia. Al terminar la tarde, Nico había guardado el teléfono y le preguntaba por cada nombre». ¿Qué cambió?',[
  'Al inicio Nico quería cumplir una tarea rápida. Al final dedica tiempo a escuchar e interesarse por las historias.',
  'El hallazgo de las cartas y la conversación unen ambos momentos. Se puede inferir un cambio desde la prisa hacia la curiosidad.',
  'No se puede afirmar que Nico dejará de usar teléfonos para siempre: solo lo guardó durante esa escena. La interpretación se limita al cambio que las acciones muestran.'
 ],'Compara el inicio y el final del personaje y usa el acontecimiento intermedio para justificar el cambio de atención o valoración.');
 module('Imagen literaria y tema',[
  'Una imagen literaria puede relacionar un objeto o acción concreta con un significado afectivo o una idea más amplia. Su sentido se interpreta en el contexto del relato, no siempre literalmente.',
  'El tema se sostiene por detalles que se repiten o resultan decisivos para los personajes. Para elegir evidencia, busca qué detalle conecta directamente con la interpretación, en vez de un elemento decorativo que solo ubica la escena.'
 ],[
  'Un objeto de familia puede ser más que su material: una chaqueta remendada puede recordar el cuidado de quien la arregló. El relato debe mostrar esa conexión; no basta con que el objeto sea antiguo.',
  'Para justificar una interpretación, señala el puente entre el objeto y la experiencia humana. El color de la chaqueta no demuestra por sí solo un vínculo afectivo.'
 ],'Texto nuevo: «Ana guardó el chaleco que su madre había remendado. Cada puntada le parecía una forma de abrazo». ¿Qué aporta esa imagen?',[
  'Las puntadas son costuras reales, pero no brazos que abracen físicamente.',
  'El relato conecta el trabajo de reparar con el cariño de la madre: la comparación representa cuidado y memoria afectiva.',
  'La lectura válida explica esa relación. No transforma la frase en una instrucción de costura ni en una prueba científica sobre efectos del tejido.'
 ],'Relaciona el detalle con lo que significa para el personaje y distingue la imagen afectiva de una afirmación literal.');
 module('Tabla y relaciones entre datos',[
  'En una tabla cada valor pertenece al cruce de dos criterios, como mes y producto. Localiza primero ambos y conserva la unidad antes de sumar, comparar o describir tendencias.',
  'Un aumento de cantidad no siempre implica más personas distintas ni mayor eficiencia. La eficiencia compara resultado con recursos; una tendencia describe cómo cambia el dato y no demuestra sola su causa.'
 ],[
  'Imagina un edificio con pisos y puertas: acertar el piso pero equivocarte de puerta lleva a otra vivienda. En una tabla, mes y categoría funcionan como esas dos coordenadas.',
  'Después de encontrar los casilleros correctos, pregunta si buscan uno, la suma de varios o una diferencia. Los mismos números pueden resolver preguntas distintas con operaciones diferentes.'
 ],'Texto nuevo: «Lunes: cuadernos 8, lápices 12. Martes: cuadernos 6, lápices 15». ¿Cuántos cuadernos se vendieron en ambos días y cuál fue su tendencia?',[
  'Seleccionamos solo cuadernos: ocho el lunes y seis el martes. Los doce y quince pertenecen a lápices.',
  'El total es 8 + 6 = 14 cuadernos. La tendencia es una disminución de 8 a 6, es decir dos menos.',
  'No confundimos el total de catorce con un valor diario ni atribuimos la caída a una causa que el texto no explica. Leer la tabla incluye preservar categorías y alcance.'
 ],'Ubica la fila y categoría pertinentes, aplica la operación solicitada y no atribuyas causas o cantidades de personas que la tabla no mide.');
 module('Pregunta de afirmación no respaldada',[
  'Algunas preguntas piden la alternativa incorrecta, injustificada, incompatible o que exagera. Primero reconoce esa consigna: aquí se responde identificando el problema, no aceptando la afirmación como verdadera.',
  'Compara todas las opciones con el pasaje. Puede haber tres afirmaciones respaldadas y una que inventa una intención, contradice una condición o generaliza demasiado. Explica tanto la evidencia válida como el salto que no autoriza.'
 ],[
  'Es como buscar la pieza que no encaja en un rompecabezas. Señalarla no significa que encaje: significa que detectaste su diferencia.',
  'Subraya mentalmente «no», «excede» o «exagera». Si eliges una frase verdadera porque aparece en el relato, podrías contestar lo contrario de lo que se pidió.'
 ],'Texto nuevo: «En la prueba piloto participaron doce vecinas y diez volvieron a la segunda reunión». ¿Qué afirmación excede la evidencia: participaron doce, volvieron diez o todas las vecinas de la ciudad apoyan el proyecto?',[
  'Las dos primeras afirmaciones repiten cantidades que el texto sí da.',
  'La tercera cambia un grupo de doce participantes por todas las vecinas de la ciudad y atribuye un apoyo que no fue medido.',
  'Esa tercera opción es la respuesta correcta a la pregunta de exceso, pero su contenido no queda demostrado. Detectar el exceso no lo convierte en una conclusión válida.'
 ],'Relee la consigna negativa y busca el salto que la evidencia no permite; no presentes esa alternativa como una afirmación respaldada.');
 function row(n,key,p,quote,reason,check,wrong=null){rows[n]={key,p,quote,reason,check,wrong};}
 row(1,'Dato explícito',0,'dos veces por semana','La pregunta pide frecuencia del recorrido, no el día de una parada añadida. La expresión cuantifica directamente cuántas visitas se realizan cada semana.','Dos veces es la frecuencia explícita; las ferias de los sábados no sustituyen esa frecuencia.');
 row(2,'Dato explícito',2,'Allí continuaron los talleres y el acceso a computadores','El adverbio Allí retoma la sede central nombrada antes. Hay que conservar esa referencia, sin trasladarle actividades de la camioneta.','Talleres y computadores pertenecen a la sede; préstamos y devoluciones se atribuyen principalmente al vehículo.');
 row(3,'Relación causal',1,'Esa información permitió modificar las paradas','Esa información remite a los registros de uso, consultas y recomendaciones. El texto enlaza esos datos con añadir ferias y reducir visitas con poca demanda.','El ajuste responde a información de uso; no al reemplazo de talleres ni a nuevos computadores.');
 row(4,'Idea global y tesis',2,'comparar el uso del servicio por barrios y no solo contar libros prestados','El problema de los dos buses, la adaptación de paradas y la evaluación por barrios apuntan al acceso territorial. El cierre conserva además la complementariedad con la sede.','La síntesis integra barrera, adaptación y evaluación; contar solo préstamos o reemplazar la sede omitiría partes decisivas.');
 row(5,'Evaluar evidencia pertinente',0,'Quienes vivían en sectores alejados debían tomar dos buses para devolver un libro','La desigualdad que se quiere reducir es territorial. Comparar usuarios nuevos de esos barrios antes y después se relaciona con el acceso, mientras combustible y paradas miden insumos o actividad.','La comparación de usuarios por barrio sirve al objetivo; por sí sola todavía no demuestra una causa exclusiva.');
 row(6,'Dato explícito',0,'Las mediciones se realizaron a las 15:00','Se pide horario de medición y el fragmento lo entrega con una hora exacta. No hay que deducir la hora a partir de los grados.','15:00 es tiempo del procedimiento; no es un valor de temperatura.');
 row(7,'Dato explícito',1,'la Plaza Sur 36 °C','El sujeto Plaza Sur está unido al valor treinta y seis. El veintiocho pertenece a la Norte y el ocho es una diferencia calculada entre ambas.','Se responde la temperatura de Sur, 36 °C, sin cambiarla por la de Norte ni por la diferencia.');
 row(8,'Límites de una conclusión',1,'las plazas también diferían en tránsito de vehículos y tipo de pavimento','Si además de árboles cambian tránsito y pavimento, cualquiera de esos factores puede aportar al resultado. La comparación no aisló un único factor.','La cautela no niega el efecto posible de la sombra; limita la atribución de toda la diferencia a ella.');
 row(9,'Función de un fragmento',2,'repetir las mediciones en más horarios y comparar lugares con pavimentos semejantes','La recomendación busca observar más situaciones y hacer más comparables las superficies. Su función es mejorar el estudio que se acaba de describir.','Ampliar observaciones fortalece la evidencia; no elimina automáticamente otras causas.');
 row(10,'Límites de una conclusión',1,'no era correcto atribuir toda la diferencia solo a los árboles','Hay una diferencia observada de 36 − 28 = 8 °C. El propio texto separa ese resultado de una atribución causal exclusiva.','Está sustentada la diferencia térmica observada, acompañada de la necesidad de aislar sus causas.');
 row(11,'Dato explícito',1,'guardarlos durante explicaciones','La condición de guardar aparece dentro de la lista de acuerdos. No equivale a guardarlos durante toda actividad, porque la siguiente regla permite usos indicados.','La alternativa debe conservar el momento exacto: durante las explicaciones.');
 row(12,'Idea global y tesis',2,'una norma es mejor cuando protege la atención y a la vez enseña a decidir','El autor reconoce las distracciones, cuestiona prohibir absolutamente y propone acuerdos. La tesis combina límites y aprendizaje de decisiones, sin uso irrestricto.','Regular según finalidad reúne las razones del texto mejor que permitir o prohibir todo.');
 row(13,'Función de un fragmento',2,'No sostengo que toda actividad requiera pantallas','La lista de lectura, discusión y experimentos responde a una posible exageración de su postura. Muestra que aceptar usos educativos no vuelve necesarias las pantallas siempre.','El fragmento limita el alcance de la tesis; no exige reemplazar actividades manuales.');
 row(14,'Evaluar evidencia pertinente',2,'protege la atención','La propuesta busca cuidar la atención con reglas. Comparar ese resultado bajo reglas claras y prohibición total es más pertinente que contar teléfonos o preferencias sin resultados.','La atención medida de manera comparable permite contrastar las normas; no basta una opinión aislada para afirmar su efecto.');
 row(15,'Función de un fragmento',1,'Una escuela que permita usar celulares sin reglas también corre riesgos','El autor concede un problema de la opción que podría parecer más permisiva. Los acuerdos que siguen son su respuesta a ese riesgo.','Reconoce problemas del uso sin reglas y los atiende mediante regulación; no niega la necesidad de consecuencias.');
 row(16,'Tabla y relaciones entre datos',0,'junio, lechugas 12 kg, tomates 16 kg, zanahorias 10 kg','Seleccionamos junio y después tomates, sin cambiar de mes ni de cultivo. Ese cruce entrega dieciséis kilogramos.','Diez pertenece a zanahorias y doce a lechugas; seis es tomate de mayo.');
 row(17,'Tabla y relaciones entre datos',0,'abril, lechugas 18 kg','La serie completa de lechugas es 18, 15, 12. Ambas variaciones son negativas: −3 y −3; tomates y zanahorias suben.','La condición exige bajar cada mes, y solo lechugas cumple los dos cambios.');
 row(18,'Relación causal',1,'los tomates comenzaron a madurar más tarde que las lechugas','La observación explica por qué tomates aparecen con cero en abril y luego seis y dieciséis. No pretende explicar la caída de lechugas ni igualar todos los cultivos.','La maduración tardía funciona como explicación del inicio tardío de la cosecha de tomates.');
 row(19,'Tabla y relaciones entre datos',0,'mayo, lechugas 15 kg, tomates 6 kg, zanahorias 8 kg','El total mensual reúne los tres cultivos de la misma fila: 15 + 6 = 21 y 21 + 8 = 29 kg.','Sumamos solo mayo y todos sus cultivos: veintinueve kilogramos.');
 row(20,'Evaluar evidencia pertinente',2,'cantidad de agua utilizada','Eficiencia hídrica relaciona producción con agua, no solo una de las dos. Litros por kilogramo permite comparar cuánto recurso requiere cada unidad de cosecha.','Un indicador que conserva agua y producción responde al objetivo; más cosecha por sí sola no demuestra menor gasto hídrico.');
 row(21,'Dato explícito',0,'dificultar el acceso a un consultorio','Se pregunta por una instalación de salud. Consultorio es la nombrada; cruces y paraderos sí aparecen, pero pertenecen a otro tipo de lugar.','La respuesta debe conservar tanto el nombre como la categoría solicitada: consultorio.');
 row(22,'Idea global y tesis',1,'conocer efectos que el plano no muestra y explicar públicamente por qué se adopta una decisión','El autor define escuchar por dos tareas: incorporar información y dar razones. Aclara que no implica satisfacer toda solicitud.','La paráfrasis correcta conserva escuchar y justificar sin prometer aprobación automática.');
 row(23,'Función de un fragmento',2,'Si los resultados no coinciden con lo previsto, modificar el diseño','Los indicadores se miden después de construir para contrastar expectativas con efectos reales. El ajuste depende de esa evaluación.','Su función es comprobar resultados y orientar correcciones, no sustituir la consulta previa.');
 row(24,'Idea global y tesis',0,'decidir su recorrido mirando solo un plano es insuficiente','El plano puede mostrar una ruta recta y omitir efectos sobre personas. La crítica se dirige a tratar eficiencia geométrica como utilidad universal.','No se rechaza planificar ni evaluar: se cuestiona que el plano por sí solo garantice un buen recorrido para todos.');
 row(25,'Función de un fragmento',2,'La participación tampoco garantiza por sí sola una obra exitosa','Reconocer ese límite evita prometer éxito automático. La propuesta añade mediciones posteriores y correcciones, haciendo más defendible su alcance.','La fuerza del argumento proviene de sus límites y mecanismos de evaluación, no de una garantía sin evidencia.');
 row(26,'Dato explícito',0,'al lado de cada título, escribía una fecha','El dato buscado acompaña a cada canción en el cuaderno: una fecha. La pregunta no solicita todavía interpretar para qué servía.','Fecha responde el dato literal; hora, precio y nombre de Mara no se atribuyen a esas anotaciones.');
 row(27,'Dato explícito',1,'Desde la calle llegaba la música de un grupo que ensayaba en la plaza','El corte apaga la radio, pero el relato sitúa una segunda fuente musical en la plaza. Hay que distinguir la música habitual de la escena durante el corte.','La música viene del grupo de la plaza, no de otra radio que el texto nunca menciona.');
 row(28,'Imagen literaria y tema',2,'una manera de conservar momentos','Las fechas del cuaderno y el recuerdo del baile conectan canciones con experiencias. El cierre explicita que no es solo un catálogo musical.','El cuaderno vincula música y memoria personal; no organiza compras ni transmisiones futuras.');
 row(29,'Cambio de un personaje',2,'Preguntó por Ernesto y escuchó una historia','Mara podría volver a la radio cuando regresa la luz, pero decide preguntar y escuchar. Su atención pasa al recuerdo que la melodía despertó.','La acción final respalda curiosidad por Elvira; no se describe una avería permanente ni una prohibición musical.');
 row(30,'Imagen literaria y tema',1,'Primer baile con Ernesto. Llovía','La anotación vincula una melodía con una experiencia concreta del pasado. La conversación posterior desarrolla ese recuerdo, a diferencia de detalles decorativos de la radio.','Baile y conversación constituyen evidencia del tema de la memoria; el color o marca de un aparato no lo demostrarían.');
 row(31,'Dato explícito',1,'una cinta amarilla que advertía sobre un derrumbe reciente','La advertencia del sendero se nombra directamente. El relato no asocia esa cinta a incendio, sequía ni protección de fauna.','Derrumbe reciente conserva el peligro literal que informa la cinta.');
 row(32,'Dato explícito',2,'Al día siguiente avisaron al municipio sobre el derrumbe','La referencia temporal distingue esta acción de lo ocurrido durante el paseo. El aviso se dirige al municipio y no equivale a cerrar todas las rutas.','El día siguiente corresponde al aviso del derrumbe, sin acciones adicionales inventadas.');
 row(33,'Cambio de un personaje',1,'si retrocedían, perderían la mejor luz para fotografiar','Ignacio quiere llegar a tiempo para las fotos, pero la cinta y las piedras muestran un riesgo. El conflicto reúne esa meta y la necesidad de actuar con prudencia.','El dilema es rapidez frente a seguridad; no compra de cámara, concurso ni trabajo.');
 row(34,'Cambio de un personaje',2,'No llegamos al lugar esperado, pero aprendimos a mirar el camino','La oposición entre no llegar y sí aprender cambia el criterio de valorar la salida. La experiencia no se reduce a obtener la fotografía planificada.','Valora el trayecto sin renunciar para siempre a las aves ni culpar a su hermana.');
 row(35,'Evaluar evidencia pertinente',1,'Su hermana observó piedras sueltas junto al borde','La hermana suma una señal física al aviso de derrumbe. Regresar por el camino señalizado responde a ese riesgo concreto, aunque cueste tiempo.','La ruta de regreso es la decisión mejor justificada por las señales disponibles; el objetivo fotográfico no elimina el peligro.');
 row(36,'Dato explícito',0,'reunió fotografías de distintos puntos y registró los horarios','La primera actuación de la agrupación es observacional: toma imágenes y anota cuándo y dónde. El laboratorio interviene después.','Fotografías y horarios corresponden al registro inicial; no se describen certificados ni muestras de sangre.');
 row(37,'Dato explícito',1,'un aumento de partículas en suspensión','Los resultados afirman un aumento de partículas, pero limitan lo que pueden decir sobre una sustancia concreta. Hay que leer el resultado junto con esa salvedad.','Más partículas es el hallazgo; no se confirmó un tóxico específico ni un cambio en todas las especies.');
 row(38,'Límites de una conclusión',2,'una señal útil para investigar, no una prueba suficiente para señalar a un responsable','El cambio visible da una razón para muestrear. No identifica por sí mismo la composición química ni una responsabilidad.','Observación útil y prueba causal son niveles diferentes: el texto reconoce el primero y limita el segundo.');
 row(39,'Función de un fragmento',1,'repetir el muestreo tras otras lluvias','La propuesta vuelve a observar cuando se repite la condición de lluvia. Permite comprobar si el patrón persiste en vez de convertir un episodio en una regla.','El propósito es ampliar la comprobación del fenómeno, no excluir datos contradictorios.');
 row(40,'Límites de una conclusión',1,'no permitieron confirmar la presencia de un contaminante específico','Un titular fiel debe mencionar el aumento observado y la necesidad de nuevos análisis. Potabilidad total, culpabilidad y daño irreversible exceden lo establecido.','Detectar sedimentos y pedir análisis conserva el hallazgo y su incertidumbre.');
 row(41,'Dato explícito',2,'escuelas y municipios organicen talleres demostrativos','Buscamos quiénes organizarían, no qué objetos se repararían. El sujeto propuesto aparece en la frase citada.','Escuelas y municipios son los organizadores sugeridos; los otros pares institucionales no aparecen.');
 row(42,'Dato explícito',1,'fallas peligrosas, insistir sin diagnóstico puede poner en riesgo','El contexto habla de un artefacto eléctrico. La condición de peligro es insistir en reparar esas fallas sin diagnóstico, no una simple tarea de limpieza.','La alternativa debe conservar riesgo eléctrico y ausencia de diagnóstico juntos.');
 row(43,'Idea global y tesis',2,'No se trata de idealizar todo objeto antiguo','El comienzo propone considerar reparación antes de reemplazar y el segundo párrafo limita esa opción por seguridad, costo y vida útil. La tesis debe mantener esas condiciones.','Reparar cuando resulte viable y seguro integra el argumento; conservar cualquier cosa a todo costo lo contradice.');
 row(44,'Función de un fragmento',1,'Reparar no siempre es la alternativa correcta','La segunda parte matiza la propuesta inicial mediante riesgos y costos. Así evita que considerar reparar se entienda como una obligación universal.','El párrafo introduce límites para una decisión responsable, no historia de talleres ni marcas comerciales.');
 row(45,'Evaluar evidencia pertinente',0,'Esa decisión puede reducir residuos','Para evaluar ese beneficio hay que medir objetos que continuaron usándose en vez de desecharse gracias a una reparación. Los anuncios y colores no describen residuos evitados.','Contar objetos reparados que no se desecharon sirve al objetivo; su masa y vida útil adicional podrían precisar aún más la evaluación.');
 row(46,'Dato explícito',0,'sobre el mesón de la imprenta','El hallazgo inicial ocurre en el trabajo. El cajón familiar aparece al final, cuando Lucía guarda la fotografía, y no debe confundirse con el primer lugar.','El lugar de encontrar el sobre es el mesón; el cajón pertenece a otra acción posterior.');
 row(47,'Relación causal',1,'se quedó en el pueblo porque consiguió trabajo en la imprenta','El conector porque expresa la causa del cambio de plan del padre. Robo, rutas cerradas y pérdida de imagen no explican su permanencia en el relato.','El trabajo en la imprenta explica por qué no realizó el viaje planeado.');
 row(48,'Cambio de un personaje',2,'no había sido una promesa solemne','Lucía comienza imaginando un secreto importante. La explicación familiar le permite valorar una decisión cotidiana con efectos sobre su historia.','El cambio es de un supuesto gran misterio a una decisión significativa; no desacredita todos los recuerdos de Rosa.');
 row(49,'Relación causal',2,'para preguntarle más a su padre esa noche','El propio cierre explica el propósito de dejar el sobre abierto. No necesitamos inventar venta, anonimato ni ocultamiento.','El motivo de esa acción es continuar la conversación familiar.');
 row(50,'Función de un fragmento',1,'su tía Rosa, quien se rio antes de explicar','Rosa ofrece la información que cambia la lectura del supuesto secreto: se trataba de vender la bicicleta y aceptar un trabajo. Ese nuevo contexto produce el giro.','La explicación transforma la interpretación de Lucía; el color del sobre no aporta esa revelación.');
 row(51,'Dato explícito',0,'rótulos de locales, modelos de buses y construcciones que todavía existían en planos antiguos','La pregunta reúne las pistas visuales y documentales usadas para identificar las imágenes. El equipo compara rótulos y buses y relaciona las construcciones con planos.','La opción correcta conserva esas fuentes; recetas, moda actual y testimonios exclusivos de turistas no describen el procedimiento.');
 row(52,'Dato explícito',1,'entre 1972 y 1978','La ficha corregida entrega un intervalo, no un año exacto. Hay que responder con la versión posterior a la revisión del periódico.','1974 era la datación inicial; la evidencia posterior solo permitió acotar 1972–1978.');
 row(53,'Límites de una conclusión',1,'esa tienda utilizó el mismo letrero entre 1972 y 1978','Un letrero que existió durante varios años no distingue cuál de ellos corresponde a la toma. Mantener solo 1974 fingiría una precisión que esa pista no aporta.','Corregir a un intervalo conserva lo que la fuente permite afirmar, sin inventar día ni año único.');
 row(54,'Límites de una conclusión',2,'las identificaciones debían quedar registradas junto a su grado de certeza','Los recuerdos pueden identificar detalles y aportar pistas. Registrar y contrastar su certeza evita convertir cualquier recuerdo en una fecha automáticamente demostrada.','La comunidad aporta información útil que necesita contraste; no reemplaza todas las fuentes ni carece de valor.');
 row(55,'Evaluar evidencia pertinente',2,'junto a su grado de certeza','El museo reconoce lo seguro y lo incierto y mantiene el respaldo de sus identificaciones. La ficha corregida muestra cómo la evidencia puede limitar una fecha.','El rigor exige fuentes y límites explícitos, no inventar precisión ni escoger siempre el año más antiguo.');
 row(56,'Dato explícito',0,'un reloj detenido','Se pide el objeto que permanecía detenido en el edificio. El reloj está nombrado literalmente y no debe confundirse con el tren que dejó de pasar.','El objeto es el reloj; el tren pertenece al cambio histórico del servicio, no al objeto detenido de la escena.');
 row(57,'Dato explícito',1,'un libro de horarios con anotaciones a lápiz','El soporte de las anotaciones aparece cuando trasladan cajas. La puerta azul da título y contexto, pero las notas se leen en un libro.','Libro de horarios conserva el soporte textual exacto; mapa, pared y puerta corresponden a otras cosas o no aparecen.');
 row(58,'Cambio de un personaje',1,'La estación había sido menos solemne de lo que imaginaba','Las notas mezclan temporal, correspondencia y una pasajera buscando a su perro. Esa variedad muestra tareas y preocupaciones cotidianas junto a los viajes.','Tomás descubre una vida cotidiana y humana, no solo ceremonias ni ausencia de pasajeros.');
 row(59,'Cambio de un personaje',2,'Esta vez añadió personas conversando, un perro en el andén y una mesa donde alguien ofrecía agua','El dibujo inicial del edificio vacío cambia después de conocer las notas y escuchar a la vecina. Las nuevas figuras representan esa comprensión humana del lugar.','La conversación enriquece el dibujo con escenas; no transforma físicamente la estación ni hace que abandone dibujar.');
 row(60,'Imagen literaria y tema',1,'pasajera busca a su perro','La nota registra un problema personal atendido en la estación, además del horario de trenes. Es un detalle que muestra interacción humana y ayuda cotidiana.','El perro y la pasajera sostienen la interpretación comunitaria más directamente que un reloj o un color de puerta.');
 row(61,'Dato explícito',1,'buscar su fuente original, revisar la fecha y verificar si otras fuentes confiables describen lo mismo','El texto enumera tres verificaciones sobre origen, momento y contraste. No basta una modificación visual ni consultar solo a quien reenvió.','La respuesta conserva las tres acciones de verificación sin sustituirlas por presentación o velocidad.');
 row(62,'Límites de una conclusión',0,'no convierte su contenido en verdadero','El autor distingue confianza interpersonal de veracidad del mensaje. Conocer al remitente no aporta por sí mismo pruebas de los hechos que el contenido afirma.','No se acusa a toda amistad de mentir; se señala que la confianza no demuestra el contenido.');
 row(63,'Función de un fragmento',1,'Una captura de pantalla sin enlace puede haber sido recortada','El recorte es un ejemplo concreto del problema de verificar el origen y contexto. Quitar partes puede cambiar la interpretación del contenido que sí queda visible.','El ejemplo ilustra un riesgo de contexto omitido; no promueve aplicaciones ni enseña a editar.');
 row(64,'Idea global y tesis',2,'Compartir una corrección cuando descubrimos un error no es vergonzoso','El autor valora responsabilizarse del efecto de la información, incluso si eso obliga a corregir la impresión inicial. No propone dejar de compartir toda noticia.','Corregir un error puede expresar responsabilidad y preferencia por una conversación informada.');
 row(65,'Evaluar evidencia pertinente',0,'El hecho de que llegue de alguien conocido genera confianza','El argumento citado solo informa sobre la relación con el remitente. No muestra fuente original, medición ni contraste de los hechos.','Su debilidad es carecer de evidencia sobre el contenido mismo, aunque la confianza personal exista.');
 row(66,'Dato explícito',1,'después de quince minutos','El taller compara un mismo sector del cielo al comienzo y luego de ese intervalo. Se pide duración de la espera, no una hora del reloj.','La espera fue de quince minutos, no una noche ni una hora.');
 row(67,'Dato explícito',0,'revisar el pronóstico de nubes y las fases de la Luna','Las dos condiciones solicitadas aparecen en la preparación de la observación. Ambas influyen en lo que puede distinguirse desde el lugar.','Nubes y fases lunares son las condiciones mencionadas, no tráfico, precios ni anuncios.');
 row(68,'Relación causal',0,'esperar a que los ojos se adapten a la oscuridad','Al relacionar esta recomendación con la comparación a los quince minutos, la mejora corresponde a percepción de los observadores. No requiere que nacieran estrellas durante la espera.','Los ojos pudieron adaptarse; no se transformaron planetas ni se detuvo la Tierra.');
 row(69,'Función de un fragmento',2,'un objeto brillante no es necesariamente una estrella','La advertencia evita clasificar únicamente por brillo: algunos planetas también se ven sin instrumentos. Su función es corregir una identificación demasiado rápida.','Distingue posibles tipos de objeto; no niega la visibilidad de estrellas ni iguala el brillo de todos los planetas.');
 row(70,'Evaluar evidencia pertinente',2,'registrar lugar, hora y fecha','Para repetir una observación importan posición, momento y condiciones que afectan lo visible, incluida la iluminación que el primer párrafo destaca. Cuaderno y comida no describen esas condiciones.','El registro pertinente reúne lugar, fecha, hora e iluminación; no garantiza por sí solo idéntico cielo si cambian otras condiciones.');
 row(71,'Dato explícito',0,'debajo del lavaplatos','Ese lugar corresponde al hallazgo de la caja de sobres después de la mudanza. El calendario aparece más tarde para registrar germinación.','La respuesta conserva el momento del hallazgo y su lugar: debajo del lavaplatos.');
 row(72,'Dato explícito',1,'Una semana después, solo apareció un brote','Solo limita la cantidad a uno y una semana identifica el período solicitado. Tres macetas no implica tres semillas germinadas.','En la primera semana aparece uno; la segunda germinación ocurre después.');
 row(73,'Relación causal',1,'si había considerado la estación y la cantidad de luz del patio','La pregunta del abuelo orienta a revisar condiciones de germinación, más allá de las ganas o del número de macetas. El texto no identifica su tamaño como causa.','La intervención ayuda a considerar estación y luz; no prueba una causa única ni vuelve innecesaria el agua.');
 row(74,'Cambio de un personaje',2,'los resultados no siempre dependen de las ganas','Julia comienza frustrada por la rapidez de los resultados y luego cambia las macetas, espera y registra fechas. El aprendizaje combina observación de condiciones y paciencia.','La evolución no elimina las instrucciones ni los registros: les da un valor para comprender.');
 row(75,'Imagen literaria y tema',2,'una forma de conversación que continuaba aun a distancia','La germinación y el calendario se relacionan con las instrucciones y la llamada del abuelo. Conversación es una imagen del lazo que sigue presente en el cultivo.','La frase expresa vínculo afectivo, no voz literal de las semillas ni una demostración científica.');
 row(76,'Dato explícito',0,'ahorrar tres minutos','Se pide el beneficio temporal anunciado por los indicadores. Las seis pistas describen la anchura del cruce en otro ejemplo, no minutos ahorrados.','La cantidad explícita de ahorro es tres minutos.');
 row(77,'Dato explícito',1,'las ambulancias, los buses y el transporte de mercancías necesitan desplazarse','El autor reconoce estos usuarios para admitir la importancia de la circulación. La enumeración debe conservarse sin restringirla a vehículos particulares.','Ambulancias, buses y mercancías son los tres casos expresos en ese argumento.');
 row(78,'Función de un fragmento',0,'inseguro para una persona mayor que debe cruzar seis pistas','El ejemplo contrasta rapidez de viaje con dificultad para cruzar. Muestra una dimensión de la experiencia urbana que el ahorro de minutos no resume.','Su función es evidenciar un efecto omitido por un indicador único, no declarar que toda calle ancha sea segura.');
 row(79,'Idea global y tesis',2,'medir tiempos de viaje, accidentes, accesibilidad y calidad del espacio público','El cierre reúne varios resultados y usuarios. El autor reconoce que circular importa, pero rechaza evaluar toda la ciudad solo por minutos de automóviles.','La tesis amplía indicadores y perspectivas; no prohíbe vehículos ni rechaza toda mejora.');
 row(80,'Evaluar evidencia pertinente',2,'qué efectos se observaron después de inaugurarla','Una comparación antes y después sobre tiempos, accidentes y accesibilidad mide los resultados de la obra. Una imagen inaugural o una opinión individual no cubre esas dimensiones.','Los indicadores comparables fortalecen la evaluación, con la cautela de estudiar también otros cambios que pudieron influir.');
 row(81,'Tabla y relaciones entre datos',0,'En mayo se prestaron 100 impresos, 90 digitales y 40 audiolibros','Primero seleccionamos mayo y después audiolibros. Cuarenta es ese cruce; veinte y treinta corresponden al mismo formato en meses anteriores.','La pregunta pide cuarenta audiolibros de mayo, sin cambiarlos por noventa digitales.');
 row(82,'Tabla y relaciones entre datos',0,'40 libros digitales','La serie digital empieza en cuarenta en marzo y llega a noventa en mayo. Impresos y audiolibros tienen otras cantidades de partida y llegada.','Solo libros digitales cumple ambos extremos del cambio solicitado: cuarenta a noventa.');
 row(83,'Tabla y relaciones entre datos',0,'120 libros impresos','Seguimos la misma categoría en los tres meses: 120, 110, 100. De marzo a abril baja diez y de abril a mayo también diez.','La tendencia registrada es disminución de diez por mes durante ese período; no predice meses futuros.');
 row(84,'Límites de una conclusión',2,'una misma persona puede retirar varios materiales','La unidad contada es una transacción. Como una persona puede generar varias, no existe una equivalencia obligatoria de un préstamo por lector.','El total de préstamos no permite saber por sí solo cuántos lectores distintos hubo.');
 row(85,'Pregunta de afirmación no respaldada',1,'no demuestra por sí solo una mejora de la comprensión lectora','Los préstamos digitales aumentan, impresos bajan y audiolibros suben: todo eso sí se ve en la tabla. Mejorar comprensión exige medir cómo interpretan textos, no solo retiros.','La afirmación injustificada es atribuir mejora de comprensión a dispositivos; elegirla aquí significa rechazar su respaldo, no aceptarla.');
 row(86,'Dato explícito',0,'Elisa encontró el cuaderno en el taller de su abuela','La escena inicial identifica quién encuentra qué y dónde. El puerto explica el trabajo previo de la abuela y no sustituye al taller como lugar del hallazgo.','El lugar explícito es el taller de la abuela.');
 row(87,'Dato explícito',1,'viento del sur, no confiarse','La advertencia aparece entre los registros que Elisa copiaba. Debe recuperarse esa frase y no inventar prohibiciones generales por estación o día.','El aviso expresa cautela por viento del sur; no ordena cerrar el puerto los lunes.');
 row(88,'Límites de una conclusión',1,'Su primer gráfico mostraba curvas elegantes, pero ocultaba esas observaciones','El problema no es la estética en sí, sino omitir advertencias y días incompletos. Una curva continua puede hacer parecer conocida una parte sin registro.','La representación inicial ocultaba límites importantes; no se afirma que careciera de todas las fechas.');
 row(89,'Cambio de un personaje',2,'conservar las notas junto a los datos y marcar claramente los días sin registros','Elisa pasa de copiar números y privilegiar curvas atractivas a comunicar advertencias e incertidumbre. Continúa usando tecnología, pero con información más fiel.','El aprendizaje es reconocer límites al ordenar datos, no destruirlos ni abandonar la aplicación.');
 row(90,'Función de un fragmento',1,'si una línea bonita podía reemplazar la experiencia de quienes salían al mar','La pregunta confronta la apariencia con la información necesaria para decidir. Motiva que Elisa incorpore notas y vacíos al gráfico.','Cuestiona que lo atractivo baste para decidir; no declara inútil todo diseño ni imposible registrar mareas.');
 row(91,'Dato explícito',0,'sobre el estacionamiento asfaltado, 34 grados','La frase relaciona estacionamiento con treinta y cuatro. Treinta y uno corresponde a cemento junto a pared y veintiséis a árboles.','Hay que conservar la correspondencia de sector y temperatura: estacionamiento, 34 grados.');
 row(92,'Dato explícito',0,'durante cinco minutos en cada punto','El período solicitado es la duración por lugar en la primera jornada. Cuatro semanas describe el seguimiento propuesto después.','Cinco minutos por punto no es el mismo dato que varias semanas de seguimiento.');
 row(93,'Límites de una conclusión',1,'Una sola jornada no permitía describir todo el verano','Además de pocos días, se mencionan viento, ubicación del termómetro y calor acumulado. Esas limitaciones impiden aislar causas y generalizar al verano.','La cautela conserva las mediciones, pero no las transforma en una ley para todos los días.');
 row(94,'Función de un fragmento',2,'para saber cuáles sectores evitaban durante las horas de mayor calor','Las entrevistas añaden experiencias de quienes usan la plaza. Complementan el dato físico con hábitos y molestias, sin sustituir al termómetro.','Aportan información de uso vivido; no calculan por sí solas grados ni garantizan obras.');
 row(95,'Evaluar evidencia pertinente',2,'repetir el procedimiento durante cuatro semanas y registrar nubosidad y horario','Comparar los mismos sectores en horarios equivalentes durante varias jornadas reduce diferencias debidas solo al momento. Registrar condiciones permite interpretar lo que aún varíe.','El diseño pertinente mantiene comparabilidad y repite observaciones; medir un solo lugar no permite comparar tres.');
 row(96,'Dato explícito',0,'reducir distracciones y mejorar la convivencia','El verbo esperaban expresa el objetivo de las autoridades, no un resultado ya demostrado. La consigna pide ese propósito inicial.','Se busca atención y convivencia; el texto no afirma que la prohibición ya haya logrado mejorarlas.');
 row(97,'Dato explícito',1,'excepciones de accesibilidad','La expresión figura en la lista de alternativas intermedias. Se refiere a necesidades de acceso y no a publicidad ni a exámenes como única excepción.','La excepción explícita es accesibilidad.');
 row(98,'Función de un fragmento',1,'hay alternativas intermedias','El texto presenta dos extremos y luego enumera opciones que ninguno de ellos recoge. Por eso critica una falsa oposición que oculta más posibilidades.','Cuestionar permitir todo o prohibir todo no significa renunciar a normas: permite diseñar reglas más precisas.');
 row(99,'Idea global y tesis',2,'establezca momentos de concentración sin teléfonos y enseñe criterios de uso digital','La conjunción y une dos componentes de la postura: espacios sin dispositivo y enseñanza de uso. Cualquiera por separado dejaría incompleta la propuesta.','Combinar concentración y educación digital conserva la tesis sin convertirla en permiso libre o prohibición universal.');
 row(100,'Evaluar evidencia pertinente',2,'indicadores de atención, convivencia y bienestar, además de escuchar a estudiantes y familias','Estos resultados corresponden al objetivo de la norma. Compararlos antes y después y escuchar experiencias permite evaluar efectos, mientras contar carteles o páginas mide difusión o extensión.','La evidencia pertinente reúne resultados y comunidad; el simple anuncio de una regla no demuestra eficacia.');

 row(101,'Dato explícito',0,'debían tomar dos buses para devolver un libro','La pregunta pide la barrera anterior a la camioneta. Dos buses describe el traslado necesario, no ausencia total de transporte ni cierre del edificio.','La dificultad es necesitar dos buses para devolver un libro, sin agregar horarios o cierres.',[null,'La medianoche no aparece como condición de devolución.','Sí había transporte: el problema era necesitar dos buses, no que no existiera ninguno.','La sede seguía prestando servicios y no se informa cierre semanal completo.']);
 row(102,'Idea global y tesis',1,'aumentó el número de personas que utilizaban el servicio por primera vez','Los préstamos son una medida de actividad, pero usuarios nuevos, consultas y recomendaciones describen otras contribuciones. Reducir la evaluación a un solo recuento las ocultaría.','Atender personas nuevas y consultas amplía la descripción del servicio, sin volver cada consulta un préstamo.',['El equipo siguió registrando préstamos; añadió otras medidas, no eliminó la anterior.','Una consulta y un préstamo son acciones distintas y no se establece una equivalencia obligatoria.','La sede central conservó talleres y computadores; no dejó de recibir visitantes.',null]);
 row(103,'Pregunta de afirmación no respaldada',1,'aumentó el número de personas que utilizaban el servicio por primera vez','Aumentar usuarios nuevos no mide cuánto leyeron todos los habitantes. El cuantificador todas y el cambio leer más agregan dos afirmaciones que esos registros no sostienen.','La opción correcta identifica el exceso: no se demostró que todas las personas alejadas leyeran más.',['Sí está respaldada: el párrafo dice que hubo menos préstamos que en el edificio principal. No es la afirmación excesiva.','Sí está respaldada: el registro se enlaza explícitamente con modificar paradas.',null,'Sí está respaldada: el texto afirma un aumento de personas que usaban el servicio por primera vez.']);
 row(104,'Relación causal',1,'Esa información permitió modificar las paradas','La expresión Esa información retoma los registros y funciona como enlace hacia una decisión posterior. No se trata de que modificar invalidara el registro ni de que el edificio cerrara.','Los datos recogidos orientaron un ajuste del recorrido.',['Registrar consultas sirve para mejorar la atención, no para reemplazar a los lectores. ',null,'El texto muestra uso de los datos, no su invalidación por cambiar paradas.','No se menciona cierre de la sede central; sus actividades continuaron.']);
 row(105,'Evaluar evidencia pertinente',0,'debían tomar dos buses para devolver un libro','El problema inicial es el costo de llegar al servicio en tiempo y desplazamiento. Comparar tiempos de usuarios alejados antes y después apunta directamente a esa barrera.','El tiempo de traslado evalúa acceso mejor que características del edificio o gustos sobre estantes.',[null,'Preferir un color no informa si las personas tardan menos en acceder.','Los títulos exclusivos del centro describen oferta, no directamente la dificultad de traslado.','La antigüedad del edificio no mide el desplazamiento de usuarios alejados.']);
 row(106,'Dato explícito',0,'en días sin lluvia','La condición meteorológica se asocia directamente con las mediciones. No significa que todas las semanas de la región sean secas ni que otras condiciones estén controladas.','La respuesta literal es que no hubo lluvias durante los registros descritos.',['Lluvias intensas contradice la condición explícita de días sin lluvia.','No se informa una suspensión por nieve.','Sí hay información meteorológica: la frase indica ausencia de lluvia.',null]);
 row(107,'Límites de una conclusión',1,'diferían en tránsito de vehículos y tipo de pavimento','Mencionar otros factores abre explicaciones alternativas del resultado térmico. La diferencia de árboles no es la única diferencia entre plazas.','Tránsito y pavimento pueden influir, por lo que falta aislar el aporte de la sombra.',['La frase establece diferencias, exactamente lo contrario de condiciones idénticas.','No aporta evidencia de defecto instrumental; los termómetros eran del mismo modelo.',null,'Reconocer otras causas posibles no demuestra ausencia de efecto de los árboles.']);
 row(108,'Límites de una conclusión',1,'28 °C en el suelo y la Plaza Sur 36 °C','La resta 36 − 28 = 8 permite describir la diferencia observada. No conocemos una proporción de tráfico ni una regularidad de todo el verano.','Ocho grados describe esta comparación; no es un efecto universal o exclusivo de los árboles.',['El texto no entrega cantidades de tráfico para afirmar que una duplique a la otra.',null,'Siempre y exactamente convierten una diferencia local en una ley causal que no se aisló.','La semana estudiada no permite predecir la misma diferencia durante todo el verano.']);
 row(109,'Función de un fragmento',2,'consultar a quienes utilizan las plazas','El motivo aparece a continuación: una temperatura no informa por sí sola comodidad, accesibilidad y seguridad. Las entrevistas añaden esa experiencia de uso.','Se busca complementar mediciones y vivencias, sin convertir opiniones en temperaturas. ',[null,'El texto suma fuentes de información; no propone retirar todos los termómetros.','No anticipa cerrar Plaza Sur: primero busca comprender usos y condiciones.','Consultar experiencias no fija de antemano un resultado de temperatura.']);
 row(110,'Evaluar evidencia pertinente',2,'repetir las mediciones en más horarios','Ampliar registros comparables permite ver si la diferencia persiste. Usar pavimentos semejantes y mantener criterios equivalentes evita confundir el lugar con otras condiciones.','Repetir con comparabilidad fortalece el estudio y permite revisar sus hipótesis.',['Instrumentos distintos sin calibrar agregan una fuente de diferencia en vez de controlarla.','Seleccionar solo el lugar favorable sesga la comparación y elimina evidencia relevante.','Medir en días extremos opuestos confunde la plaza con el clima de cada día.',null]);
 row(111,'Dato explícito',1,'consecuencias proporcionales al incumplimiento','La proporcionalidad relaciona la consecuencia con la falta. Los criterios se comparten con familias y docentes, en lugar de improvisarse caso a caso.','Las consecuencias son proporcionales, sin eliminarse ni volverse idénticas para cualquier falta.',['Ignorar la gravedad contradice consecuencias proporcionales.','El texto sí contempla consecuencias: acordar reglas no las vuelve inexistentes.',null,'La propuesta pide reglas conocidas por familias y docentes, no criterios sin comunicar.']);
 row(112,'Función de un fragmento',2,'La lectura extensa, la discusión oral y los experimentos manuales conservan su valor','La enumeración matiza el apoyo al uso educativo del teléfono. Mantener otras formas de aprender evita interpretar la propuesta como pantallas para todo.','La función es mostrar convivencia de herramientas y actividades, no exclusión mutua.',['El fragmento no presenta cifras ni un resultado estadístico.',null,'Usar pantalla en toda actividad contradice la frase que valora actividades sin ella.','Valorar la lectura no implica que sea imposible aprender con tecnología.']);
 row(113,'Pregunta de afirmación no respaldada',2,'No sostengo que toda actividad requiera pantallas','La pregunta pide la afirmación incompatible. El autor limita usos, conserva actividades sin pantalla y no exige que toda actividad use teléfonos.','La exigencia de teléfonos para toda actividad contradice el pasaje; se señala para rechazarla, no como conclusión válida.',[null,'Los límites según actividad sí coinciden con los acuerdos de uso: no son incompatibles.','Incluir familias en reglas compartidas está propuesto expresamente en el segundo párrafo.','La proporcionalidad de consecuencias es una regla explícita del autor.']);
 row(114,'Relación causal',1,'para que no dependan del criterio improvisado de cada clase','El conocimiento de las reglas por docentes y familias busca una referencia común y comprensible. La finalidad no es eliminar consecuencias ni ceder cualquier decisión a una encuesta.','La participación busca criterios compartidos para aplicar las reglas.',['Se contemplan consecuencias proporcionales, no impunidad.','El texto no propone reemplazar toda decisión pedagógica por una encuesta.','Conocer reglas no autoriza excepciones ilimitadas a petición de una familia.',null]);
 row(115,'Tabla y relaciones entre datos',0,'zanahorias 7 kg; mayo, lechugas 15 kg, tomates 6 kg, zanahorias 8 kg','Seleccionamos zanahorias en abril y mayo: siete y ocho. Sumamos 7 + 8 = 15 kg, sin incluir junio ni otros productos.','Quince kilogramos reúne exactamente los dos casilleros pedidos.',['Ocho corresponde solo a mayo, por lo que falta abril.','Veinticinco es el total de todos los cultivos de abril: 18 + 0 + 7, otra selección de datos.',null,'Siete corresponde solo a abril; todavía falta agregar mayo.']);
 row(116,'Tabla y relaciones entre datos',0,'junio, lechugas 12 kg, tomates 16 kg','Comparamos con abril: lechugas pasan de dieciocho a doce y tomates de cero a dieciséis. Una categoría baja y otra sube, cambiando la composición del total.','La lectura correcta compara cada cultivo consigo mismo en ambos meses.',['Las cantidades sí cambian: ni lechugas ni tomates mantienen su producción.',null,'Tomates aumenta de cero a dieciséis; no baja junto con lechugas.','Zanahorias no desaparece: pasa de siete a diez kilos.']);
 row(117,'Evaluar evidencia pertinente',2,'horas de trabajo, superficie plantada y cantidad de agua utilizada','La cantidad producida es solo el resultado. Para hablar de eficiencia hay que relacionarlo con recursos utilizados, porque podría producirse más gastando todavía más recursos.','Faltan insumos para comparar eficiencia; los kilogramos por sí solos no los describen.',[null,'Los kilogramos sí permiten sumar masas de cosecha; la limitación es no conocer recursos.','El texto no restringe la evaluación al tomate; importa el huerto y sus insumos.','Una cosecha mayor no implica siempre menos agua: justamente falta medirla.']);
 row(118,'Dato explícito',0,'kilogramos entregados gratuitamente en el comedor del barrio','El destino y la condición de entrega aparecen juntos en la presentación de la tabla. No se describen ingresos por ventas ni exportación.','La producción registrada se entrega al comedor sin cobro.',['No se informa exportación a otra región.','Vender para sueldos contradice la entrega gratuita.','Se informa entrega al comedor, no almacenamiento de toda la cosecha.',null]);
 row(119,'Idea global y tesis',1,'Escuchar no significa que todas las solicitudes puedan cumplirse','La frase siguiente define escuchar como conocer efectos y dar razones. No satisfacer todo es un límite de decisión, no permiso para ignorar o excluir a quienes discrepan.','La postura combina ponderar demandas y justificar la decisión.',['El autor exige explicar públicamente los motivos, no decidir sin razones.','Consultar solo a partidarios contradiría la diversidad de usuarios convocados.',null,'Se defiende escuchar como fuente de información, aunque no garantice satisfacer cada pedido.']);
 row(120,'Dato explícito',0,'dejar fuera paraderos o dificultar el acceso a un consultorio','Se buscan espacios sensibles del primer párrafo. Paraderos equivale aquí a paradas del transporte, y consultorio es un servicio de salud.','La paráfrasis correcta conserva consultorio y paradas de buses.',['No se nombran estacionamientos de camiones como esos puntos sensibles.',null,'Puertos y aeropuertos no son los ejemplos del pasaje.','Las bibliotecas universitarias no aparecen entre esos espacios.']);
 row(121,'Evaluar evidencia pertinente',2,'medir accidentes, tiempos de viaje y uso de las conexiones','Estos indicadores evalúan seguridad, movilidad y utilización real tras la obra. Actos inaugurales y gastos de pintura miden otras dimensiones.','Accidentes, tiempos y uso permiten contrastar lo previsto con los efectos observados.',[null,'Discursos y carteles cuentan difusión, no seguridad ni movilidad lograda.','El precio de la pintura describe un gasto, no los resultados de la ciclovía.','Las fotografías inaugurales no muestran evolución de accidentes ni uso habitual.']);
 row(122,'Función de un fragmento',2,'una señal de responsabilidad, no de fracaso','El texto vincula corrección con comparar resultados y expectativas. Cambiar lo que falla es una respuesta informada, no una invalidación automática de todo el proyecto.','Modificar después de evaluar se presenta como responsabilidad.',['Detectar algo corregible no prueba que nunca debió construirse.','La evaluación posterior complementa, no reemplaza, la consulta anterior.','Corregir puede mejorar, pero no garantiza ausencia de todo accidente futuro.',null]);
 row(123,'Dato explícito',1,'Una tarde se cortó la luz','Ese hecho interrumpe la radio y abre otra fuente de música desde la calle. La pregunta pide el suceso que inicia la interrupción.','Es un corte de electricidad, no una avería permanente ni un término de visita.',['La ventana se abre después; no se rompe.','Mara continúa visitando y escucha una historia después del corte.',null,'No llega una carta que interrumpa la radio.']);
 row(124,'Imagen literaria y tema',1,'Primer baile con Ernesto. Llovía','La nota nombra una experiencia íntima que una melodía hace recordar. Une música, fecha y memoria, sin información sobre compra de aparatos ni músicos actuales.','El baile vincula la melodía con el pasado personal de Elvira.',['La nota no indica cuándo empezó o terminó el corte, por lo que no calcula su duración.',null,'Recordar un baile no demuestra que Ernesto integre el grupo que ensaya ahora.','La fecha del baile no es una fecha de compra de la radio.']);
 row(125,'Cambio de un personaje',2,'Mara no pidió encender la radio','En lugar de restablecer la rutina, Mara pregunta por Ernesto y escucha. El cambio de atención se verifica en esa elección narrativa.','Mara pasa de escuchar la radio a interesarse por la historia de Elvira.',[null,'Sí muestra interés por un relato: pregunta y escucha a Elvira.','No intenta reparar un circuito: al volver la luz busca una conversación.','La escena muestra que se queda a escuchar antes de despedirse.']);
 row(126,'Pregunta de afirmación no respaldada',1,'Elvira reconoció una melodía','Reconocer una canción y recordar un baile no implica que quienes la tocan sepan la vida de Elvira. Atribuirles intención sobre esa historia agrega un conocimiento que no se narra.','La interpretación sin apoyo es que la banda toca a propósito la historia de Elvira.',['La melodía sí activa un recuerdo: Elvira reconoce la canción y busca la nota del baile.','La interrupción sí abre una conversación que antes no había ocurrido.','La escucha adquiere sentido afectivo cuando Mara se interesa por el recuerdo y la historia.',null]);
 row(127,'Dato explícito',1,'una cinta amarilla que advertía sobre un derrumbe reciente','La señal está en el trayecto y se relaciona con ese riesgo. No es una advertencia meteorológica futura ni un objeto dejado en casa.','La cinta amarilla avisa del derrumbe del sendero.',['No se menciona una carta como aviso de ese peligro.','La advertencia es por un derrumbe reciente, no por lluvia de otro mes.',null,'Un horario de museo no aparece como señal del sendero.']);
 row(128,'Relación causal',1,'propuso regresar por el camino señalizado, aunque tardaran más','La propuesta de la hermana responde a la cinta y a piedras sueltas. Acepta perder tiempo para reducir exposición al riesgo.','La decisión prioriza seguridad en ese paseo, sin prohibiciones permanentes.',['Para siempre añade una restricción futura que la hermana no plantea.',null,'Propone regresar, no cruzar más rápido por el derrumbe.','Su decisión atiende precisamente a las señales de peligro; no las desestima.']);
 row(129,'Pregunta de afirmación no respaldada',2,'aprendimos a mirar el camino','La valoración del trayecto transforma el sentido de la salida. No se dice que Ignacio renuncie definitivamente a fotografiar; para siempre excede ese cambio puntual.','La exageración es la renuncia permanente a la fotografía, una idea que el cierre no afirma.',[null,'Sí está respaldada: vuelven sin las fotografías del tranque previstas al inicio.','Sí está respaldada: cerca del pueblo observan la bandada y dibujan siluetas.','Sí está respaldada por la nota de la libreta: el paseo conserva un aprendizaje pese al cambio.']);
 row(130,'Cambio de un personaje',2,'vieron una bandada posada en los cables','La salida no logra la fotografía del tranque, pero el regreso permite otra observación valiosa. El cierre une esa experiencia con aprender a mirar el camino.','El cambio de plan abre algo no previsto sin negar la frustración ni convertir las aves en causa del derrumbe.',['No llegar al tranque no demuestra que este dejara de existir.','El relato da valor a lo descubierto aun cuando no se cumple la meta inicial.','No hay relación causal entre la bandada y el derrumbe del sendero.',null]);

 for(const q of window.READING_QUESTIONS){const n=Number(q.id.slice(4)),r=rows[n];if(!r)continue;
  const p=window.READING_PASSAGES.find(p=>p.id===q.passageId),base=modules[r.key];
  const negative=r.key==='Pregunta de afirmación no respaldada';
  const application=['En el párrafo '+(r.p+1)+' de «'+p.title+'» encontramos esta evidencia: «'+r.quote+'».',r.reason,(negative?'La opción que debemos señalar por su falta de respaldo es «':'La respuesta que se justifica es «')+q.options[q.answer]+'». '+r.check];
  const t={revision:'tutor-profesor-2026-10-15',qualityBefore:'básica',quality:'adecuada',aim:(negative?'Buscamos la afirmación que falla, sin aceptarla como verdadera. ':'Identifiquemos qué pide la consigna y cómo justificarlo con este pasaje. ')+q.question,foundation:base.foundation.slice(),application,check:r.check,intuition:base.intuition.slice(),example:{...base.example,steps:base.example.steps.slice()},evidence:[{passageId:p.id,paragraph:r.p,quote:r.quote}]};
  q.explanations=q.options.map((o,i)=>{if(i===q.answer)return '¡Cachaste! '+r.check;const old=q.explanations[i].split(' La alternativa respaldada')[0].split(' La conclusión respaldada')[0].split(' La respuesta respaldada')[0];return r.wrong?'Elegiste «'+o+'». '+r.wrong[i]+' '+r.check+' La alternativa que responde a esta consigna es «'+q.options[q.answer]+'».':old+' '+r.check+' La alternativa que responde a esta consigna es «'+q.options[q.answer]+'». ';});
  t.selectedFeedback=q.options.map((_,i)=>i===q.answer?null:{diagnosis:q.explanations[i],repair:application.slice()});q.teaching=t;q.concept=r.key;q.transferGroup=q.passageId+'-'+r.key;
  q.steps=[t.aim,...t.foundation,...application,t.check];q.easy=[...t.intuition,...application].join('\n\n');q.example=[t.example.problem,...t.example.steps,t.example.bridge].join('\n\n');
 }
})();
