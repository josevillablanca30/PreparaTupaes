/* ¿Cachaste? — Lote editorial 2: 18 problemas originales de transferencia.
 * Contrastar con temario DEMRE Admisión 2027 antes de declarar revisión experta.
 * No reproduce ejercicios de libros ni preguntas oficiales.
 */
export const transferCasesBatch2=[
  {
    "base": "M1:271",
    "id": "TR-M1-007",
    "question": "En un plano de senderos, un segmento de 2 cm de la escala gráfica representa 4 km reales. Si una ruta mide 7 cm sobre el plano, ¿cuál es su longitud real?",
    "options": [
      "7 km",
      "10 km",
      "14 km",
      "28 km"
    ],
    "answer": 2,
    "steps": [
      "La escala gráfica relaciona 2 cm del plano con 4 km del terreno y debe conservarse para cualquier medida del mismo plano.",
      "Dividimos 4 km entre 2 cm: cada centímetro del dibujo representa 2 kilómetros reales.",
      "Multiplicamos los 7 centímetros medidos por 2 kilómetros por centímetro y obtenemos 14 kilómetros de recorrido."
    ],
    "errors": [
      "7 km confunde la medida sobre el plano con una distancia sobre el terreno.",
      "10 km suma la longitud del dibujo a un dato de la escala en vez de usar proporciones.",
      "",
      "28 km multiplica los 7 centímetros por 4 km sin considerar que esos 4 km corresponden a 2 centímetros."
    ]
  },
  {
    "base": "M1:204",
    "id": "TR-M1-008",
    "question": "En un establecimiento de 240 estudiantes, tres octavos participan en un taller. De quienes participan, dos tercios presentarán un proyecto. ¿Cuántos estudiantes presentarán proyectos?",
    "options": [
      "30",
      "60",
      "90",
      "160"
    ],
    "answer": 1,
    "steps": [
      "Primero calculamos tres octavos de los 240 estudiantes: 240 × 3/8 = 90 participantes del taller.",
      "Luego tomamos dos tercios únicamente de los 90 participantes, no del establecimiento completo: 90 × 2/3 = 60.",
      "Verificamos que 60 es menor que 90 y corresponde a una cuarta parte del total inicial: 3/8 × 2/3 = 1/4."
    ],
    "errors": [
      "30 obtiene solo una parte de los participantes y no aplica correctamente los dos tercios.",
      "",
      "90 es la cantidad que entra al taller, pero todavía falta considerar quién presentará proyecto.",
      "160 calcula dos tercios de los 240 estudiantes, ignorando que solo participan tres octavos."
    ]
  },
  {
    "base": "M1:212",
    "id": "TR-M1-009",
    "question": "Un depósito cúbico tiene una capacidad interior de 729 m³. ¿Cuánto mide cada arista interior del depósito?",
    "options": [
      "3 m",
      "9 m",
      "27 m",
      "243 m"
    ],
    "answer": 1,
    "steps": [
      "El volumen de un cubo de arista a se calcula como a³; por eso debemos resolver a³ = 729 m³.",
      "La operación inversa de elevar al cubo es la raíz cúbica: la raíz cúbica de 729 es 9.",
      "Comprobamos elevando 9 metros al cubo: 9 × 9 × 9 = 729 metros cúbicos, la capacidad informada."
    ],
    "errors": [
      "3 metros al cubo darían solo 27 m³, muy por debajo de la capacidad solicitada.",
      "",
      "27 metros al cubo darían 19.683 m³, que no coincide con el volumen del depósito.",
      "243 divide 729 entre tres, confundiendo raíz cúbica con división entre el exponente."
    ]
  },
  {
    "base": "M1:218",
    "id": "TR-M1-010",
    "question": "Ocho técnicos, trabajando a igual ritmo, tardan 15 horas en completar una instalación. Si participan doce técnicos con idéntica productividad, ¿cuántas horas se requieren?",
    "options": [
      "8 horas",
      "10 horas",
      "12 horas",
      "22,5 horas"
    ],
    "answer": 1,
    "steps": [
      "La cantidad total de trabajo es la misma, así que más técnicos implican menos horas si todos trabajan al mismo ritmo.",
      "Multiplicamos ocho técnicos por quince horas y obtenemos 120 horas-técnico de trabajo en total.",
      "Dividimos 120 horas-técnico entre doce técnicos y obtenemos diez horas para completar la instalación."
    ],
    "errors": [
      "Ocho horas reduce demasiado el tiempo y no conserva las 120 horas-técnico necesarias.",
      "",
      "Doce horas confunde el nuevo número de técnicos con la duración del trabajo.",
      "22,5 horas corresponde a proporcionalidad directa: al sumar trabajadores aumenta erróneamente el tiempo."
    ]
  },
  {
    "base": "M1:214",
    "id": "TR-M1-011",
    "question": "Se amplía un patio cuadrado cuyos lados medían x metros, agregando 5 metros a cada lado. ¿Qué expresión representa el área del patio ampliado?",
    "options": [
      "x² + 25",
      "x² + 5x + 25",
      "x² + 10x + 25",
      "2x² + 25"
    ],
    "answer": 2,
    "steps": [
      "El lado nuevo del patio es x + 5 metros; el área de un cuadrado equivale al lado multiplicado por sí mismo.",
      "Desarrollamos (x + 5)(x + 5), multiplicando cada término: x² + 5x + 5x + 25.",
      "Al reunir los términos semejantes, el área queda expresada por x² + 10x + 25 metros cuadrados."
    ],
    "errors": [
      "x² + 25 omite las dos franjas rectangulares de área 5x que aparecen al ampliar el cuadrado.",
      "x² + 5x + 25 incorpora solo una de las dos franjas rectangulares adicionales.",
      "",
      "2x² + 25 duplica el área cuadrática inicial, en vez de desarrollar correctamente el binomio."
    ]
  },
  {
    "base": "M1:237",
    "id": "TR-M1-012",
    "question": "Una rueda de bicicleta tiene radio 35 cm. Si gira exactamente 100 vueltas completas sin deslizar, ¿qué distancia recorre la bicicleta expresada en metros?",
    "options": [
      "35π m",
      "70π m",
      "140π m",
      "7.000π m"
    ],
    "answer": 1,
    "steps": [
      "El recorrido por una vuelta sin deslizamiento es la longitud de la circunferencia, calculada como 2π por el radio.",
      "Para un radio de 35 cm, cada vuelta avanza 70π cm; cien vueltas recorren 7.000π centímetros.",
      "Transformamos centímetros en metros dividiendo por 100, por lo que la distancia final es 70π metros."
    ],
    "errors": [
      "35π metros corresponde a usar el radio en lugar del diámetro y luego convertir de manera incorrecta.",
      "",
      "140π metros duplica la longitud recorrida sin que el enunciado indique doscientas vueltas.",
      "7.000π metros conserva el resultado en centímetros y lo presenta incorrectamente como metros."
    ]
  },
  {
    "base": "Ciencias:SCI-001",
    "id": "TR-SCI-007",
    "question": "En un experimento se comparan células de levadura que consumen igual cantidad de glucosa: un cultivo dispone de oxígeno y el otro se mantiene sin él. ¿Qué predicción sobre el ATP por molécula de glucosa es más consistente?",
    "options": [
      "En ausencia de oxígeno se obtiene necesariamente más ATP",
      "Ambos cultivos generan exactamente la misma cantidad de ATP",
      "El cultivo con respiración aeróbica puede obtener mayor rendimiento de ATP",
      "El ATP se forma solo fuera de las células de levadura"
    ],
    "answer": 2,
    "steps": [
      "La glucosa proporciona energía química, pero las rutas metabólicas utilizadas dependen, entre otros factores, de la disponibilidad de oxígeno.",
      "La respiración aeróbica permite una oxidación más completa de la glucosa que la fermentación y suele entregar mayor rendimiento de ATP.",
      "La predicción correcta compara rendimientos por molécula de glucosa, no afirma que cada cultivo produzca la misma cantidad absoluta de ATP."
    ],
    "errors": [
      "La fermentación permite regenerar cofactores, pero su rendimiento de ATP por glucosa suele ser menor.",
      "Igual cantidad de glucosa no implica igual rendimiento si se utilizan rutas metabólicas distintas.",
      "",
      "Las células sintetizan ATP mediante procesos metabólicos internos; no lo producen exclusivamente en el exterior."
    ]
  },
  {
    "base": "Ciencias:SCI-002",
    "id": "TR-SCI-008",
    "question": "En una membrana celular intacta, una molécula pequeña de oxígeno atraviesa la bicapa lipídica con mayor facilidad que una molécula de glucosa. ¿Qué explica mejor esa diferencia?",
    "options": [
      "El oxígeno es pequeño y no polar, mientras la glucosa requiere proteínas transportadoras",
      "La glucosa solo puede cruzar membranas cuando se transforma en oxígeno",
      "El oxígeno ingresa porque siempre se transporta contra su gradiente con ATP",
      "La glucosa no puede entrar nunca a ninguna célula"
    ],
    "answer": 0,
    "steps": [
      "La bicapa lipídica presenta una región interna hidrofóbica que favorece el paso de moléculas pequeñas y no polares.",
      "El oxígeno puede difundirse a través de esa región siguiendo su gradiente; la glucosa es más grande y polar.",
      "Para atravesar eficientemente la membrana, la glucosa utiliza proteínas de transporte como transportadores facilitadores."
    ],
    "errors": [
      "",
      "La célula no convierte glucosa en oxígeno para introducirla; son moléculas con propiedades distintas.",
      "La difusión simple del oxígeno no exige necesariamente gasto de ATP ni transporte contra gradiente.",
      "Existen transportadores que permiten la entrada de glucosa; negar toda entrada contradice la fisiología celular."
    ]
  },
  {
    "base": "Ciencias:SCI-003",
    "id": "TR-SCI-009",
    "question": "Una proteína destinada a ser secretada se sintetiza en el retículo endoplasmático rugoso y luego requiere modificación, clasificación y empaquetado antes de salir de la célula. ¿Qué estructura participa especialmente en esa etapa posterior?",
    "options": [
      "El centríolo, que organiza la segregación cromosómica",
      "El aparato de Golgi, que modifica y dirige proteínas hacia su destino",
      "El nucléolo, donde se ensamblan subunidades ribosomales",
      "La membrana nuclear, que convierte proteínas en moléculas de ADN"
    ],
    "answer": 1,
    "steps": [
      "La síntesis de una proteína secretada ocurre en ribosomas asociados al retículo endoplasmático rugoso.",
      "La proteína puede transitar en vesículas hacia el aparato de Golgi para recibir modificaciones, ser clasificada y empaquetada.",
      "Desde el Golgi salen vesículas que permiten dirigir el producto a la membrana u otros destinos celulares según corresponda."
    ],
    "errors": [
      "Los centríolos participan en la organización del citoesqueleto, pero no son el centro de clasificación de proteínas secretadas.",
      "",
      "El nucléolo participa en la producción de componentes ribosomales y no organiza directamente la secreción descrita.",
      "La envoltura nuclear separa compartimentos, pero no transforma las proteínas destinadas a secreción en ADN."
    ]
  },
  {
    "base": "Ciencias:SCI-080",
    "id": "TR-SCI-010",
    "question": "Una persona presenta dos mutaciones distintas: una aparece solo en células de la piel, y otra está presente en una célula precursora que dará origen a gametos. ¿Cuál puede transmitirse a la descendencia de forma directa?",
    "options": [
      "Solamente la mutación de las células de la piel",
      "Ambas mutaciones siempre se heredan",
      "Ninguna mutación puede heredarse bajo ninguna condición",
      "La mutación que alcance un gameto que participe en la fecundación"
    ],
    "answer": 3,
    "steps": [
      "Una mutación somática restringida a células de la piel no forma parte, por ese solo hecho, de la información heredada por los gametos.",
      "Una mutación en la línea germinal puede llegar a los gametos durante su formación, aunque no todas las células precursoras originan un gameto funcional.",
      "Si el gameto portador participa en la fecundación, la variante genética puede incorporarse al material hereditario del descendiente."
    ],
    "errors": [
      "Las células de la piel no transmiten por sí mismas información genética a un descendiente durante la fecundación.",
      "La herencia no es automática: depende de que la variante esté en un gameto participante y de otras condiciones.",
      "Algunas mutaciones de la línea germinal sí pueden transmitirse, por lo que la negación absoluta es incorrecta.",
      ""
    ]
  },
  {
    "base": "Ciencias:SCI-048",
    "id": "TR-SCI-011",
    "question": "Un ciclista avanza a 4 m/s y luego acelera uniformemente a 1,5 m/s² durante 8 segundos en línea recta. ¿Cuál es su rapidez al finalizar ese intervalo?",
    "options": [
      "8 m/s",
      "12 m/s",
      "16 m/s",
      "20 m/s"
    ],
    "answer": 2,
    "steps": [
      "En una aceleración constante se puede relacionar la rapidez final con la inicial mediante v = v₀ + a·t.",
      "La variación de rapidez durante ocho segundos es 1,5 m/s² multiplicado por 8 s, equivalente a 12 m/s.",
      "Sumamos la rapidez inicial de 4 m/s y la variación de 12 m/s, obteniendo una rapidez final de 16 m/s."
    ],
    "errors": [
      "8 m/s confunde la cantidad de segundos con la rapidez final y no usa la aceleración indicada.",
      "12 m/s es solo el incremento de rapidez y no incorpora los 4 m/s del estado inicial.",
      "",
      "20 m/s aparece al sumar indebidamente valores que no corresponden a la ecuación del movimiento."
    ]
  },
  {
    "base": "Ciencias:SCI-035",
    "id": "TR-SCI-012",
    "question": "Se disuelven 12 g de un soluto hasta completar un volumen final de solución de 300 mL. ¿Cuál es la concentración expresada como porcentaje masa/volumen (% m/v)?",
    "options": [
      "0,04 % m/v",
      "4 % m/v",
      "25 % m/v",
      "40 % m/v"
    ],
    "answer": 1,
    "steps": [
      "El porcentaje masa/volumen indica cuántos gramos de soluto se encuentran en cada 100 mililitros de solución.",
      "Con doce gramos disueltos en 300 mL, calculamos (12 g / 300 mL) × 100 mL para escalar a cien mililitros.",
      "El resultado es 4 g de soluto por cada 100 mL de solución, es decir, una concentración de 4 % m/v."
    ],
    "errors": [
      "0,04 es el cociente 12/300 antes de convertirlo a una base de 100 mL; falta multiplicar por cien.",
      "",
      "25 % corresponde a invertir la relación entre el volumen y la masa y luego interpretarla como porcentaje.",
      "40 % surge de cambiar incorrectamente las unidades o el factor de escala del porcentaje."
    ]
  },
  {
    "base": "Historia:HIS-001",
    "id": "TR-HIS-007",
    "question": "En Chile, ciertas funciones sobre matrimonio y registro de personas pasaron a depender de normas e instituciones civiles durante el siglo XIX. ¿Qué transformación del Estado ilustra este cambio?",
    "options": [
      "La supresión legal de cualquier creencia religiosa",
      "La separación gradual entre funciones estatales y autoridad religiosa",
      "La desaparición completa de toda influencia cultural religiosa",
      "La sustitución de las leyes civiles por mandatos exclusivos de una iglesia"
    ],
    "answer": 1,
    "steps": [
      "El proceso histórico descrito desplaza atribuciones relacionadas con la vida civil desde ámbitos religiosos hacia normas e instituciones estatales.",
      "La secularización del Estado implica diferenciar competencias públicas respecto de autoridades e instituciones religiosas.",
      "Esta diferenciación no equivale a prohibir las creencias ni significa que la vida cultural deje automáticamente de tener expresiones religiosas."
    ],
    "errors": [
      "La secularización institucional no significa prohibir la libertad de creencias o prácticas religiosas.",
      "",
      "La influencia cultural de la religión no desaparece de inmediato porque cambie la administración civil de ciertos actos.",
      "Las leyes civiles adquieren mayor protagonismo; el cambio no entrega esas funciones exclusivamente a una iglesia."
    ]
  },
  {
    "base": "Historia:HIS-003",
    "id": "TR-HIS-008",
    "question": "Un conjunto de fuentes sobre Chile después del 11 de septiembre de 1973 documenta la disolución del Congreso y restricciones al ejercicio de derechos políticos. ¿Qué interpretación del proceso es más consistente?",
    "options": [
      "Hubo continuidad íntegra de las instituciones representativas anteriores",
      "Los cambios afectaron únicamente la administración económica, sin dimensión política",
      "Se produjo una ruptura del orden democrático con concentración del poder",
      "La elección periódica del Congreso fue fortalecida inmediatamente"
    ],
    "answer": 2,
    "steps": [
      "La disolución de una institución legislativa elegida es un cambio institucional sustantivo, no una decisión meramente administrativa.",
      "Al combinarla con restricciones a derechos y participación, las fuentes permiten caracterizar una ruptura del funcionamiento democrático.",
      "Una interpretación histórica rigurosa distingue ese quiebre institucional de las transformaciones posteriores del régimen y sus consecuencias."
    ],
    "errors": [
      "La disolución del Congreso contradice la afirmación de continuidad completa de las instituciones previas.",
      "Las restricciones a participación y representación muestran efectos políticos directos y no solo económicos.",
      "",
      "El cierre de una institución parlamentaria impide afirmar que su elección periódica fue inmediatamente fortalecida."
    ]
  },
  {
    "base": "Historia:HIS-011",
    "id": "TR-HIS-009",
    "question": "Una estudiante compara la Primera Junta de Gobierno de Chile de 1810 con la declaración de independencia de 1818. ¿Qué interpretación histórica evita confundir ambos acontecimientos?",
    "options": [
      "La Junta fue parte de un proceso político de independencia con etapas y conflictos posteriores",
      "La independencia quedó consolidada de forma definitiva en septiembre de 1810",
      "La declaración de 1818 fue anterior a las tensiones de la monarquía española",
      "Ambos hechos prueban que el proceso chileno ocurrió aislado de toda crisis internacional"
    ],
    "answer": 0,
    "steps": [
      "La formación de la Primera Junta de Gobierno se entiende en el marco de la crisis de la monarquía española y las disputas de autoridad.",
      "El movimiento hacia la independencia chilena incluyó distintas etapas, conflictos militares y decisiones políticas a lo largo de varios años.",
      "Diferenciar 1810 y 1818 permite explicar el proceso y evita atribuir a la primera Junta el resultado político de etapas posteriores."
    ],
    "errors": [
      "",
      "La Junta inicial no consolidó por sí sola toda la independencia ni puso fin a los conflictos posteriores.",
      "La declaración de 1818 ocurrió después de las transformaciones vinculadas con la crisis monárquica de 1808.",
      "Los procesos independentistas hispanoamericanos estuvieron relacionados con crisis y acontecimientos transatlánticos."
    ]
  },
  {
    "base": "Historia:HIS-020",
    "id": "TR-HIS-010",
    "question": "Un gráfico de participación política en Chile registra el reconocimiento del voto femenino municipal en la década de 1930 y su incorporación a elecciones presidenciales décadas después. ¿Qué proceso demuestra mejor?",
    "options": [
      "Una pérdida permanente de ciudadanía política femenina",
      "La eliminación inmediata de toda desigualdad social",
      "El reemplazo del derecho a voto por una obligación exclusiva para mujeres",
      "Una ampliación gradual de derechos y espacios de participación política"
    ],
    "answer": 3,
    "steps": [
      "El sufragio femenino se reconoció progresivamente en diferentes tipos de elecciones y no mediante una sola medida que cubriera todos los ámbitos.",
      "El derecho a votar en comicios municipales y su extensión a elecciones nacionales son hitos de una ampliación gradual de la ciudadanía.",
      "El análisis histórico debe distinguir avances institucionales concretos de la afirmación de que desaparecieron inmediatamente todas las desigualdades."
    ],
    "errors": [
      "Los cambios descritos son reconocimientos de participación y no evidencian una pérdida permanente de derechos.",
      "El derecho a voto es un avance político relevante, pero no elimina automáticamente toda desigualdad social.",
      "El proceso amplía el voto femenino en ámbitos diferentes; no lo reemplaza por una obligación especial.",
      ""
    ]
  },
  {
    "base": "Historia:HIS-037",
    "id": "TR-HIS-011",
    "question": "Una institución pública rechaza candidaturas a un empleo únicamente por el origen étnico de las personas, aun cuando cumplen los requisitos técnicos. ¿Qué principio resulta vulnerado?",
    "options": [
      "La facultad ilimitada de seleccionar por rasgos personales",
      "La libertad de establecer una religión oficial para cada cargo",
      "La igualdad de trato y la prohibición de discriminación arbitraria",
      "La separación entre administración y poderes judiciales"
    ],
    "answer": 2,
    "steps": [
      "La situación señala exclusión basada en origen étnico pese al cumplimiento de las competencias relevantes del empleo.",
      "La igualdad ante la ley y la prohibición de discriminación arbitraria exigen criterios pertinentes y razonables para decisiones institucionales.",
      "Descartar personas solo por un atributo ajeno a los requisitos del trabajo carece de justificación para el cargo y vulnera ese principio."
    ],
    "errors": [
      "La selección laboral debe respetar normas y derechos; no puede basarse ilimitadamente en cualquier rasgo personal.",
      "La libertad de creencias no otorga permiso general para excluir por origen étnico a candidatos idóneos.",
      "",
      "La separación de poderes trata sobre atribuciones estatales y no describe directamente la exclusión discriminatoria del caso."
    ]
  },
  {
    "base": "Historia:HIS-043",
    "id": "TR-HIS-012",
    "question": "En un ejemplo simplificado de tributación, quien recibe $500.000 aporta un 5 % de su ingreso y quien recibe $2.000.000 aporta un 12 % de su ingreso. ¿Qué característica del sistema representan esas tasas efectivas?",
    "options": [
      "Un sistema regresivo en el que la tasa baja al aumentar el ingreso",
      "Un sistema progresivo en el que la proporción aportada crece con el ingreso",
      "Un impuesto fijo idéntico en pesos para todas las personas",
      "Una tasa proporcional del 5 % sin diferencias entre ingresos"
    ],
    "answer": 1,
    "steps": [
      "Comparamos tasas efectivas, es decir, la proporción del ingreso que se aporta: 5 % para el menor ingreso y 12 % para el mayor.",
      "En el ejemplo la tasa efectiva aumenta cuando aumenta el ingreso, lo que es característico de una estructura tributaria progresiva.",
      "No es necesario suponer otras reglas legales: basta analizar las tasas declaradas y distinguir porcentaje de monto en pesos."
    ],
    "errors": [
      "La descripción regresiva implicaría que la tasa efectiva disminuye al crecer el ingreso, que es lo contrario del ejemplo.",
      "",
      "Los montos aportados son distintos y, sobre todo, las tasas no son iguales entre las dos personas.",
      "Se informa explícitamente una tasa de 12 % para el ingreso mayor, por lo que no existe una tasa única de 5 %."
    ]
  }
];
