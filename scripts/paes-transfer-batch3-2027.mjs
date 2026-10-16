/* Tercer lote editorial: 12 transferencias independientes centradas en Ciencias e Historia.
 * Referencias: ejes del temario DEMRE PAES Regular 2026 / Admisión 2027.
 * Ítems originales de ¿Cachaste?; nunca se presentan como preguntas oficiales.
 */
export const transferCasesBatch3=[
  {
    "base": "Ciencias:SCI-004",
    "id": "TR-SCI-013",
    "question": "Durante una sinapsis química, una neurona libera neurotransmisores, pero un fármaco bloquea sus receptores en la membrana postsináptica. ¿Qué efecto se espera con mayor probabilidad?",
    "options": [
      "La neurona presináptica deja de tener membrana celular",
      "El mensajero puede liberarse, pero disminuye la respuesta postsináptica",
      "Los neurotransmisores se transforman directamente en impulsos musculares sin receptores",
      "El bloqueo hace que todos los impulsos viajen más rápido"
    ],
    "answer": 1,
    "steps": [
      "En una sinapsis química, el neurotransmisor es liberado desde la célula presináptica al espacio sináptico.",
      "Para generar una respuesta específica, el mensajero debe interactuar con receptores de la célula postsináptica.",
      "Si esos receptores están bloqueados, puede existir liberación del mensajero, pero su efecto postsináptico disminuye."
    ],
    "errors": [
      "Bloquear receptores no implica que la neurona pierda su membrana plasmática ni desaparezca.",
      "",
      "La transmisión química requiere reconocimiento molecular; no convierte el mensajero en señal sin intervención de receptores.",
      "La velocidad de todos los impulsos nerviosos no aumenta automáticamente por bloquear receptores locales."
    ]
  },
  {
    "base": "Ciencias:SCI-005",
    "id": "TR-SCI-014",
    "question": "Al tocar accidentalmente una superficie muy caliente, una persona retira la mano antes de identificar conscientemente el estímulo. ¿Qué explicación funcional es más adecuada?",
    "options": [
      "El arco reflejo permite una respuesta motora rápida mediante circuitos nerviosos espinales",
      "La mano se mueve porque el cerebro no recibe ninguna información sensorial",
      "Los músculos detectan el calor y elaboran por sí solos una decisión consciente",
      "El estímulo debe analizarse por completo en la corteza antes de activar cualquier músculo"
    ],
    "answer": 0,
    "steps": [
      "Los receptores sensoriales detectan el estímulo potencialmente dañino y generan señales que viajan por vías aferentes.",
      "En un arco reflejo de retirada pueden activarse circuitos de la médula espinal que conectan la información sensorial con neuronas motoras.",
      "La activación de músculos permite retirar rápidamente la mano; la percepción consciente del dolor también puede ocurrir después."
    ],
    "errors": [
      "",
      "La información sensorial puede ascender al encéfalo aunque la retirada ocurra por circuitos espinales.",
      "Los músculos ejecutan la respuesta mediante señales nerviosas, pero no toman decisiones conscientes autónomas.",
      "El circuito de retirada no necesita esperar toda la evaluación cortical para iniciar la respuesta motora."
    ]
  },
  {
    "base": "Ciencias:SCI-078",
    "id": "TR-SCI-015",
    "question": "En una especie de anfibio las células somáticas tienen 2n = 18 cromosomas. Si ocurre meiosis normal y luego fecundación entre dos gametos de esa especie, ¿qué número corresponde al gameto y al cigoto, respectivamente?",
    "options": [
      "18 y 36",
      "9 y 9",
      "9 y 18",
      "18 y 18"
    ],
    "answer": 2,
    "steps": [
      "El número diploide 2n = 18 corresponde a las células somáticas que poseen dos juegos de cromosomas.",
      "Durante la meiosis el número de juegos cromosómicos se reduce, de modo que cada gameto normal tendrá n = 9 cromosomas.",
      "En la fecundación se unen dos gametos haploides de nueve cromosomas, restaurando el número diploide de 18 en el cigoto."
    ],
    "errors": [
      "Un gameto normal no conserva dieciocho cromosomas de esa especie, pues la meiosis reduce la dotación a la mitad.",
      "La fecundación reúne dos gametos haploides y normalmente restaura la dotación diploide del cigoto.",
      "",
      "Los gametos tienen la mitad de la dotación somática; no se originan con dieciocho cromosomas tras meiosis normal."
    ]
  },
  {
    "base": "Ciencias:SCI-101",
    "id": "TR-SCI-016",
    "question": "Una instalación tiene dos resistencias, una de 12 Ω y otra de 6 Ω, conectadas en paralelo a una fuente ideal. ¿Cuál es su resistencia equivalente?",
    "options": [
      "18 Ω",
      "8 Ω",
      "2 Ω",
      "4 Ω"
    ],
    "answer": 3,
    "steps": [
      "En un circuito paralelo, ambas resistencias están sometidas a la misma diferencia de potencial, por lo que no se suman directamente.",
      "Aplicamos la relación 1/Req = 1/12 + 1/6 = 1/12 + 2/12 = 3/12 por ohmio.",
      "Invertimos la expresión: Req = 12/3 = 4 Ω, valor menor que cada resistencia individual del paralelo."
    ],
    "errors": [
      "Sumar 12 y 6 ohmios corresponde a resistencias conectadas en serie, no al circuito descrito.",
      "Ocho ohmios no satisface la suma de conductancias indicada para la conexión en paralelo.",
      "Dos ohmios resulta de una combinación numérica que no corresponde a 1/12 + 1/6.",
      ""
    ]
  },
  {
    "base": "Ciencias:SCI-111",
    "id": "TR-SCI-017",
    "question": "Al balancear la combustión completa de propano, C₃H₈ + O₂ → CO₂ + H₂O, ¿qué coeficientes enteros mínimos corresponden, en ese orden, a los cuatro compuestos?",
    "options": [
      "1, 3, 3, 4",
      "1, 5, 1, 4",
      "2, 5, 3, 4",
      "1, 5, 3, 4"
    ],
    "answer": 3,
    "steps": [
      "Partimos por el carbono y el hidrógeno: tres carbonos obligan a tres CO₂ y ocho hidrógenos a cuatro H₂O.",
      "Los productos contienen seis átomos de oxígeno en el CO₂ y cuatro en el agua, es decir diez oxígenos en total.",
      "Para aportar diez oxígenos se requieren cinco O₂; la ecuación balanceada tiene coeficientes 1, 5, 3 y 4."
    ],
    "errors": [
      "Tres moléculas de O₂ aportan solo seis átomos de oxígeno y no alcanzan para formar los productos.",
      "Un solo CO₂ no conserva los tres átomos de carbono que contiene una molécula de propano.",
      "Duplicar el propano exige duplicar proporcionalmente también las cantidades de productos y oxígeno.",
      ""
    ]
  },
  {
    "base": "Ciencias:SCI-114",
    "id": "TR-SCI-018",
    "question": "Un laboratorio toma 25 mL de una solución 2,4 mol/L de un soluto y añade agua hasta alcanzar 150 mL de volumen final. Si no se pierde soluto, ¿cuál es la concentración final?",
    "options": [
      "0,2 mol/L",
      "0,4 mol/L",
      "0,8 mol/L",
      "1,2 mol/L"
    ],
    "answer": 1,
    "steps": [
      "En una dilución se mantiene constante la cantidad de soluto y cambia el volumen total de la disolución.",
      "Se aplica C₁V₁ = C₂V₂, de modo que 2,4 mol/L × 25 mL = C₂ × 150 mL.",
      "La concentración final es C₂ = 2,4 × 25/150 = 0,4 mol/L, menor que la concentración inicial."
    ],
    "errors": [
      "El resultado 0,2 mol/L divide nuevamente la concentración y no conserva los moles originales.",
      "",
      "Un valor de 0,8 mol/L equivale a un factor de dilución incorrecto frente al aumento de seis veces del volumen.",
      "El resultado 1,2 mol/L reduce la concentración solo a la mitad, aunque el volumen final es seis veces el inicial."
    ]
  },
  {
    "base": "Historia:HIS-002",
    "id": "TR-HIS-013",
    "question": "A mediados del siglo XX, una política económica en Chile financia fábricas nacionales para producir manufacturas que antes se importaban. ¿Qué finalidad caracteriza mejor esta decisión?",
    "options": [
      "Sustituir importaciones desarrollando producción industrial para el mercado interno",
      "Eliminar inmediatamente todas las exportaciones mineras del país",
      "Prohibir por ley cualquier actividad económica privada",
      "Volver a un sistema exclusivamente agrícola sin nuevas industrias"
    ],
    "answer": 0,
    "steps": [
      "La situación describe apoyo a la producción industrial dentro de Chile de bienes que anteriormente provenían del exterior.",
      "La industrialización por sustitución de importaciones buscaba ampliar la producción nacional y el mercado interno mediante políticas de desarrollo.",
      "No implicaba dejar de exportar minerales ni abolir la actividad privada; sus resultados fueron variados y dependieron del contexto histórico."
    ],
    "errors": [
      "",
      "La estrategia de desarrollo industrial no estableció como condición eliminar todas las exportaciones de recursos mineros.",
      "El apoyo estatal a la industria no significó prohibir toda forma de empresa o inversión privada.",
      "La construcción de fábricas supone diversificación industrial, no una vuelta exclusiva a la producción agrícola."
    ]
  },
  {
    "base": "Historia:HIS-015",
    "id": "TR-HIS-014",
    "question": "En un debate municipal, organizaciones con proyectos muy distintos presentan propuestas públicas, aceptan discutirlas y reconocen el derecho de sus adversarios a participar. ¿Qué principio democrático se observa principalmente?",
    "options": [
      "La imposición de una única visión política legítima",
      "La eliminación del desacuerdo mediante censura previa",
      "El pluralismo político y la coexistencia de distintas ideas dentro de reglas democráticas",
      "La sustitución permanente de las elecciones por una sola asamblea"
    ],
    "answer": 2,
    "steps": [
      "El escenario muestra organizaciones con posiciones diferentes que pueden expresar sus proyectos en un espacio público.",
      "El pluralismo político implica reconocer la diversidad de ideas y el derecho a competir o participar conforme a reglas comunes.",
      "El desacuerdo legítimo puede persistir sin impedir participación, sin censura obligatoria y sin anular las instituciones democráticas."
    ],
    "errors": [
      "El pluralismo rechaza que solo una corriente pueda participar legítimamente en la vida política.",
      "La discrepancia puede discutirse públicamente y no debe eliminarse mediante censura sistemática.",
      "",
      "La participación local puede complementar a las elecciones representativas, pero no necesariamente reemplazarlas para siempre."
    ]
  },
  {
    "base": "Historia:HIS-018",
    "id": "TR-HIS-015",
    "question": "Una familia mantiene fijo su ingreso mensual y antes podía comprar 50 canastas idénticas de bienes. Si el precio de cada canasta sube 25% y el ingreso no cambia, ¿cuántas canastas podrá comprar ahora?",
    "options": [
      "40 canastas",
      "45 canastas",
      "50 canastas",
      "62,5 canastas"
    ],
    "answer": 0,
    "steps": [
      "Con ingreso nominal fijo, la cantidad comprable de una canasta depende inversamente del precio de esa canasta.",
      "Un aumento de precio de 25% multiplica el costo unitario por 1,25, sin modificar el dinero disponible.",
      "Dividimos la capacidad anterior entre 1,25: 50/1,25 = 40 canastas; el poder adquisitivo disminuye."
    ],
    "errors": [
      "",
      "Cuarenta y cinco canastas no corresponden a dividir la capacidad de compra inicial por el nuevo factor de precios 1,25.",
      "Cincuenta canastas supone que la subida de precios no cambia la cantidad comprable con ingresos fijos.",
      "Sesenta y dos coma cinco canastas multiplica en vez de dividir y confunde la subida de precios con una mejora del ingreso real."
    ]
  },
  {
    "base": "Historia:HIS-020",
    "id": "TR-HIS-016",
    "question": "En una línea de tiempo sobre los derechos políticos de las mujeres en Chile aparecen tres hitos: sufragio municipal en la década de 1930, reforma legal de 1949 y elección presidencial de 1952. ¿Qué interpretación integra mejor esos datos?",
    "options": [
      "Las mujeres pudieron votar en todas las elecciones desde la independencia de 1818",
      "El sufragio femenino se amplió de manera gradual a distintos tipos de elección",
      "La reforma de 1949 prohibió la participación política de mujeres",
      "La elección de 1952 antecedió cronológicamente al derecho de voto municipal"
    ],
    "answer": 1,
    "steps": [
      "Los hitos se sitúan en décadas distintas y corresponden a la extensión del derecho electoral a ámbitos diferentes.",
      "Las mujeres pudieron participar en elecciones municipales desde la década de 1930 y obtuvieron reconocimiento legal para elecciones nacionales en 1949.",
      "La primera elección presidencial en que pudieron votar fue la de 1952, evidenciando una ampliación gradual y no un solo cambio instantáneo."
    ],
    "errors": [
      "El acceso femenino a las elecciones nacionales ocurrió mucho después de la independencia y no desde 1818.",
      "",
      "La normativa de 1949 amplió el derecho de sufragio femenino en elecciones nacionales; no lo prohibió.",
      "La elección presidencial de 1952 ocurrió después de los avances en el voto municipal, no antes."
    ]
  },
  {
    "base": "Historia:HIS-023",
    "id": "TR-HIS-017",
    "question": "Un documento describe que, después de la Guerra Civil chilena de 1891, los ministros debían negociar su permanencia con grupos del Congreso y que el Ejecutivo enfrentaba mayores restricciones políticas. ¿A qué transformación se refiere?",
    "options": [
      "Al predominio parlamentario en la práctica política chilena de fines del siglo XIX",
      "A la desaparición de la Constitución de 1833 y de toda autoridad presidencial",
      "A la instalación de un sufragio universal idéntico al actual",
      "A la disolución definitiva de los partidos políticos del país"
    ],
    "answer": 0,
    "steps": [
      "La fuente sitúa el cambio político después de la Guerra Civil de 1891 y describe una influencia creciente de grupos congresales.",
      "Durante el llamado predominio parlamentario se consolidaron prácticas que restringieron la acción presidencial y dieron peso al Congreso.",
      "No desaparecieron la Constitución ni el cargo presidencial: la transformación operó principalmente en las prácticas e instituciones políticas."
    ],
    "errors": [
      "",
      "La presidencia y la Constitución de 1833 continuaron existiendo, aunque las relaciones de poder político cambiaron.",
      "El predominio parlamentario no significó instaurar de inmediato el sufragio universal actual para toda la población.",
      "Los partidos participaron intensamente en la política del período y no fueron disueltos de manera definitiva."
    ]
  },
  {
    "base": "Historia:HIS-049",
    "id": "TR-HIS-018",
    "question": "Dos testimonios de personas que participaron en una huelga describen de manera distinta sus causas. ¿Qué procedimiento permitiría construir una interpretación histórica mejor fundamentada?",
    "options": [
      "Elegir siempre el testimonio más emotivo y descartar el otro",
      "Suponer que, si hay desacuerdo, ningún testimonio aporta información válida",
      "Comparar autoría, contexto e intereses de ambos testimonios y contrastarlos con otras fuentes",
      "Tomar únicamente el testimonio escrito más recientemente, sin revisar su contenido"
    ],
    "answer": 2,
    "steps": [
      "Los testimonios ofrecen perspectivas situadas y pueden diferir por experiencia, posición social y propósito de sus autores.",
      "El análisis histórico contextualiza quién produjo cada fuente, en qué circunstancias y con qué posibles intereses.",
      "Contrastar testimonios con documentos, prensa y registros adicionales permite fundamentar una interpretación sin asumir que una sola voz explica todo."
    ],
    "errors": [
      "La intensidad emocional no basta para determinar la pertinencia ni la fiabilidad de una fuente histórica.",
      "Las discrepancias pueden ser informativas y deben explicarse en lugar de desechar automáticamente todas las fuentes.",
      "",
      "La fecha de escritura no garantiza por sí sola exactitud ni pertinencia histórica frente a otras evidencias."
    ]
  }
];
