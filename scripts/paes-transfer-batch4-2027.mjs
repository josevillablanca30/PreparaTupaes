/* ¿Cachaste? · Lote 4: problemas originales de transferencia.
 DEMRE PAES Regular 2026/Admisión 2027 and named Drive documents guide the scope.
 Items were authored independently; NOT official DEMRE questions. Source traces are
 bibliographic mappings, not certification of a complete textbook-page audit.
 */
export const transferCasesBatch4=[
  {
    "base": "M1:211",
    "id": "TR-M1-013",
    "question": "Una plaza cuadrada tendrá exactamente 196 m² de superficie. ¿Cuántos metros debe medir cada lado, suponiendo una longitud positiva?",
    "options": [
      "7 m",
      "14 m",
      "28 m",
      "98 m"
    ],
    "answer": 1,
    "steps": [
      "El área de un cuadrado es el lado al cuadrado, por lo que la longitud buscada satisface l² = 196 metros cuadrados.",
      "La raíz cuadrada principal entrega la longitud positiva: √196 = 14, porque 14 por 14 equivale a 196.",
      "La respuesta se interpreta en metros, no en metros cuadrados, y se comprueba al calcular 14² = 196."
    ],
    "errors": [
      "Siete metros producen un cuadrado de solo 49 m², por lo que no cumplen la superficie solicitada.",
      "",
      "Veintiocho metros producen 784 m²: multiplicar la raíz por dos duplica la longitud y cuadruplica el área.",
      "Noventa y ocho metros se obtienen al dividir 196 entre dos, operación que no deshace un cuadrado."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-M1-v1.pdf",
      "officialEje": "Números · potencias y raíces enésimas",
      "driveFileId": "1tgKp8r5wl6_PDk-G8yHUTDU4xHlldsvA",
      "driveMaterial": "CPECH · Cuaderno de ejercicios M1",
      "alignmentRationale": "La raíz principal se aplica a una magnitud geométrica positiva.",
      "sourceUse": "Referencia pedagógica; enunciado, alternativas y soluciones originales"
    }
  },
  {
    "base": "M1:213",
    "id": "TR-M1-014",
    "question": "Un diseño de soporte tiene una longitud exacta de √72 metros. ¿Cuál es su forma simplificada como producto de un entero y una raíz?",
    "options": [
      "36√2 m",
      "3√2 m",
      "6√2 m",
      "12√2 m"
    ],
    "answer": 2,
    "steps": [
      "Para simplificar el radical, se identifica el mayor cuadrado perfecto que divide 72: 72 = 36 por 2.",
      "Por la propiedad de las raíces, √72 = √36 por √2, y la raíz principal de 36 es 6.",
      "Se concluye que √72 = 6√2 metros; elevar al cuadrado esta longitud permite comprobar que su cuadrado es 72."
    ],
    "errors": [
      "Treinta y seis es el factor dentro del radical, no el número que sale de él: √36 es seis.",
      "Tres por raíz de dos, al cuadrado, da 18 y no recupera el valor de 72.",
      "",
      "Doce por raíz de dos, al cuadrado, da 288: se duplicó el factor exterior injustificadamente."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-M1-v1.pdf",
      "officialEje": "Números · potencias y raíces enésimas",
      "driveFileId": "1tgKp8r5wl6_PDk-G8yHUTDU4xHlldsvA",
      "driveMaterial": "CPECH · Cuaderno de ejercicios M1",
      "alignmentRationale": "Radicales equivalentes y comprobación de la simplificación.",
      "sourceUse": "Referencia pedagógica; enunciado, alternativas y soluciones originales"
    }
  },
  {
    "base": "M1:215",
    "id": "TR-M1-015",
    "question": "El área de un rectángulo es (x² − 49) m² y uno de sus lados mide (x + 7) m. Si x es mayor que 7, ¿cuánto mide el otro lado?",
    "options": [
      "(x − 7) m",
      "(x + 7) m",
      "(x − 49) m",
      "(x − 7)² m"
    ],
    "answer": 0,
    "steps": [
      "El área de un rectángulo resulta del producto entre los dos lados; para hallar el desconocido se divide el área por x + 7.",
      "Se reconoce la diferencia de cuadrados x² − 49 = (x − 7)(x + 7), que permite cancelar el factor común x + 7.",
      "El lado restante mide x − 7 metros y es positivo porque el enunciado restringe x a valores mayores que 7."
    ],
    "errors": [
      "",
      "El factor x + 7 ya corresponde al lado conocido; repetirlo daría un área distinta para valores generales de x.",
      "Restar 49 directamente de x no equivale a dividir una diferencia de cuadrados por x + 7.",
      "El cuadrado de x − 7 tendría unidades de longitud al cuadrado y no representa la dimensión lineal solicitada."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-M1-v1.pdf",
      "officialEje": "Álgebra y funciones · factorización y expresiones",
      "driveFileId": "1tgKp8r5wl6_PDk-G8yHUTDU4xHlldsvA",
      "driveMaterial": "CPECH · Cuaderno de ejercicios M1",
      "alignmentRationale": "La diferencia de cuadrados se usa para hallar una medida con restricciones.",
      "sourceUse": "Referencia pedagógica; enunciado, alternativas y soluciones originales"
    }
  },
  {
    "base": "M1:238",
    "id": "TR-M1-016",
    "question": "En un proyecto se destina un terreno con forma de trapecio, cuyas bases paralelas miden 14 m y 8 m y cuya altura perpendicular es 5 m. ¿Cuál es el área del terreno?",
    "options": [
      "27,5 m²",
      "55 m²",
      "70 m²",
      "110 m²"
    ],
    "answer": 1,
    "steps": [
      "El área del trapecio es el promedio de las longitudes de sus bases paralelas multiplicado por la altura perpendicular.",
      "Al sumar las bases se obtienen 22 metros; su promedio es 11 metros y debe multiplicarse por los 5 metros de altura.",
      "El área es 55 m²: el resultado tiene unidades cuadradas y es compatible con una base media de 11 metros."
    ],
    "errors": [
      "Se dividió el área correcta una segunda vez entre dos después de promediar las bases.",
      "",
      "Setenta corresponde a multiplicar solo la base mayor por la altura, como si el terreno fuera rectangular.",
      "Ciento diez omite dividir entre dos la suma de las bases antes de multiplicar por la altura."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-M1-v1.pdf",
      "officialEje": "Geometría · áreas de trapecios",
      "driveFileId": "1tgKp8r5wl6_PDk-G8yHUTDU4xHlldsvA",
      "driveMaterial": "CPECH · Cuaderno de ejercicios M1",
      "alignmentRationale": "Cálculo contextualizado de un área con altura perpendicular.",
      "sourceUse": "Referencia pedagógica; enunciado, alternativas y soluciones originales"
    }
  },
  {
    "base": "Ciencias:SCI-028",
    "id": "TR-SCI-019",
    "question": "Un átomo neutro presenta número atómico Z = 17 y número másico A = 35. ¿Cuál es la cantidad de protones y electrones que posee, respectivamente?",
    "options": [
      "17 protones y 18 electrones",
      "18 protones y 17 electrones",
      "17 protones y 17 electrones",
      "35 protones y 17 electrones"
    ],
    "answer": 2,
    "steps": [
      "El número atómico Z es, por definición, el número de protones del núcleo y determina la identidad química del elemento.",
      "La condición de átomo neutro implica igualdad entre las cargas positivas de los protones y las negativas de los electrones.",
      "Con Z = 17, el átomo tiene diecisiete protones y diecisiete electrones; A = 35 permite calcular neutrones, no modifica Z."
    ],
    "errors": [
      "Dieciocho corresponde a la cantidad de neutrones, calculada como 35 menos 17, y no al número de electrones de un átomo neutro.",
      "Dieciocho no es el número atómico dado, por lo que no corresponde a la cantidad de protones del elemento.",
      "",
      "Treinta y cinco es el número másico, suma de protones y neutrones, y no la cantidad de protones."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Química · estructura atómica y número atómico",
      "driveFileId": "1gILZ7GBQdpixWUdPep6AEZXnLEXPfXC0",
      "driveMaterial": "PDV · Cuadernillo Química QC P1",
      "alignmentRationale": "Aplicación de Z y A a una especie neutra sin confundir partículas.",
      "sourceUse": "Referencia pedagógica; enunciado, alternativas y soluciones originales"
    }
  },
  {
    "base": "Ciencias:SCI-047",
    "id": "TR-SCI-020",
    "question": "Un haz de luz monocromática de frecuencia 5,0 × 10¹⁴ Hz pasa del aire al agua y su longitud de onda disminuye. Si no cambia la fuente, ¿qué frecuencia tiene la luz al propagarse por el agua?",
    "options": [
      "3,75 × 10¹⁴ Hz",
      "5,0 × 10¹⁴ Hz",
      "6,67 × 10¹⁴ Hz",
      "0 Hz"
    ],
    "answer": 1,
    "steps": [
      "La frecuencia de una onda electromagnética la fija la fuente emisora y se conserva cuando la onda atraviesa una interfaz estacionaria.",
      "Al propagarse en otro medio cambia la rapidez de fase, por lo que puede cambiar la longitud de onda según v = f por λ.",
      "La luz mantiene 5,0 × 10¹⁴ Hz dentro del agua; el cambio de longitud de onda no implica modificar la frecuencia de la fuente."
    ],
    "errors": [
      "Reducir la frecuencia en proporción a la longitud de onda ignora que también cambió la rapidez de propagación.",
      "",
      "Elevar la frecuencia por el cambio de medio confunde la relación entre rapidez, longitud de onda y frecuencia.",
      "Una onda luminosa que se transmite por agua no adquiere frecuencia cero: sigue oscilando."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Física · ondas electromagnéticas y propagación",
      "driveFileId": "1BYAEhP-jVMlVBjM3HL9KNPUSJbyOJ6EC",
      "driveMaterial": "CPECH · Ondas",
      "alignmentRationale": "Cambio de medio: conservar frecuencia y razonar longitud de onda.",
      "sourceUse": "Referencia pedagógica; enunciado, alternativas y soluciones originales"
    }
  },
  {
    "base": "Ciencias:SCI-062",
    "id": "TR-SCI-021",
    "question": "Un equipo escolar quiere estudiar cómo depende el ángulo de refracción de la luz del ángulo de incidencia al pasar del aire al mismo bloque transparente. ¿Cuál diseño experimental es más adecuado?",
    "options": [
      "Cambiar el material y el ángulo de incidencia en cada medición sin registrar los valores",
      "Mantener fijo el ángulo de incidencia y preguntar cuál luz parece más bonita",
      "Variar el ángulo de incidencia, conservar el mismo bloque y medir el ángulo refractado",
      "Cambiar la iluminación y la temperatura sin medir los ángulos"
    ],
    "answer": 2,
    "steps": [
      "Se identifica como variable manipulada el ángulo de incidencia y como variable respuesta el ángulo de refracción de la luz.",
      "Para aislar esa relación se mantiene el mismo material transparente y se controlan condiciones relevantes durante las mediciones.",
      "Al registrar varios pares de ángulos y compararlos se obtiene evidencia contrastable de la relación investigada."
    ],
    "errors": [
      "Si se cambia simultáneamente el bloque y el ángulo incidente no se puede aislar qué modificación produce el resultado.",
      "Una preferencia estética no mide el ángulo refractado ni permite contrastar la pregunta científica.",
      "",
      "Variar factores no pertinentes sin registrar las magnitudes objetivo no constituye una prueba de refracción interpretable."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Habilidades científicas · planificar investigación; Física · refracción",
      "driveFileId": "1BYAEhP-jVMlVBjM3HL9KNPUSJbyOJ6EC",
      "driveMaterial": "CPECH · Ondas",
      "alignmentRationale": "Diseño controlado con variable independiente, respuesta y evidencia medible.",
      "sourceUse": "Referencia pedagógica; enunciado, alternativas y soluciones originales"
    }
  },
  {
    "base": "Ciencias:SCI-058",
    "id": "TR-SCI-022",
    "question": "Un cargador entrega 24 coulomb de carga eléctrica a través de un conductor en 8 segundos, manteniendo una corriente constante. ¿Cuál es la intensidad de corriente media?",
    "options": [
      "0,33 A",
      "3 A",
      "16 A",
      "192 A"
    ],
    "answer": 1,
    "steps": [
      "La corriente eléctrica cuantifica la carga que atraviesa una sección de un conductor por cada unidad de tiempo.",
      "Si la carga transportada es 24 coulomb y el tiempo transcurrido es de 8 segundos, se aplica I = Q dividido por t.",
      "La corriente media es 24 dividido por 8, es decir 3 A; un ampere equivale a un coulomb por segundo."
    ],
    "errors": [
      "0,33 A resulta de dividir el tiempo entre la carga, invirtiendo la definición de corriente eléctrica.",
      "",
      "Restar ocho a veinticuatro mezcla magnitudes diferentes y no calcula carga por unidad de tiempo.",
      "Multiplicar veinticuatro por ocho confunde la corriente con un producto de carga y tiempo."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Física · electricidad, corriente y carga",
      "driveFileId": "1Br-fqf2HsB1oeUK2RfiunAmsQrNrLD19",
      "driveMaterial": "PDV · Cuaderno N.º 5: Electricidad, Física común",
      "alignmentRationale": "El cuaderno define la corriente como carga por tiempo y explica el ampere; se modela otro caso.",
      "sourceUse": "Referencia pedagógica; enunciado, alternativas y soluciones originales"
    }
  },
  {
    "base": "Historia:HIS-030",
    "id": "TR-HIS-019",
    "question": "Un análisis histórico señala que, tras 1945, dos superpotencias compitieron por influencia mediante propaganda, alianzas militares, tecnología y conflictos en terceros países. ¿Qué interpretación sintetiza mejor ese escenario?",
    "options": [
      "Una rivalidad ideológica y geopolítica global con confrontaciones indirectas",
      "Una paz sin tensiones políticas ni competencia por influencia",
      "Una guerra militar continua y directa entre los dos ejércitos en todos los continentes",
      "Una alianza única en la que ambos bloques compartían el mismo proyecto político"
    ],
    "answer": 0,
    "steps": [
      "El texto sitúa el escenario después de la Segunda Guerra Mundial y relaciona distintos medios de competencia internacional.",
      "La confrontación ideológica entre Estados Unidos y la Unión Soviética se expresó en alianzas, propaganda y conflictos indirectos.",
      "Se identifica la Guerra Fría como una rivalidad global compleja, no como guerra directa permanente entre ambas potencias."
    ],
    "errors": [
      "",
      "La existencia de competencia y conflictos desmiente que el período estuviera libre de tensiones internacionales.",
      "Los conflictos por influencia fueron importantes, pero no equivalen a una batalla militar directa continua entre ambos ejércitos.",
      "La rivalidad entre proyectos ideológicos y geopolíticos impide describirlos como un único bloque político."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Historia-v2.pdf",
      "officialEje": "Historia · Guerra Fría y confrontación ideológica",
      "driveFileId": "1kb30RdHpKIhEsG1kr_4qQw5oNDk-5Ne1",
      "driveMaterial": "CPECH · Bitácora siglo XX",
      "alignmentRationale": "Reconocer causas y manifestaciones de la Guerra Fría a partir de una caracterización.",
      "sourceUse": "Referencia pedagógica; enunciado, alternativas y soluciones originales"
    }
  },
  {
    "base": "Historia:HIS-047",
    "id": "TR-HIS-020",
    "question": "Un registro escolar consigna 1.200 estudiantes matriculados en 1960 y 1.800 en 1970. ¿Qué conclusión está justificada únicamente por estos datos?",
    "options": [
      "La calidad de la educación aumentó en todos los establecimientos",
      "La matrícula aumentó 50 % entre ambos años, sin demostrar por sí sola cambios de calidad",
      "Se terminó la desigualdad territorial en la escolarización",
      "La proporción de estudiantes que abandonó sus estudios disminuyó exactamente 50 %"
    ],
    "answer": 1,
    "steps": [
      "Se comparan los datos observados de matrícula: el aumento es 1.800 menos 1.200, equivalente a 600 estudiantes adicionales.",
      "Para medir el cambio relativo se divide 600 por la matrícula inicial de 1.200 y se obtiene 0,5, es decir cincuenta por ciento.",
      "El registro permite afirmar el aumento de matrícula, pero no mide calidad educativa, deserción ni distribución territorial."
    ],
    "errors": [
      "Las cifras de matrícula no ofrecen por sí solas evidencia sobre aprendizaje o calidad en todos los centros.",
      "",
      "La distribución territorial requiere información desagregada por regiones o localidades que no está en la fuente.",
      "La deserción no puede calcularse solo con dos totales de matrícula, porque faltan datos de trayectoria estudiantil."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Historia-v2.pdf",
      "officialEje": "Historia · análisis crítico de fuentes y datos sociales",
      "driveFileId": "1kb30RdHpKIhEsG1kr_4qQw5oNDk-5Ne1",
      "driveMaterial": "CPECH · Bitácora Historia mundo, América y Chile siglo XX",
      "alignmentRationale": "Interpretación de registros sociales e incremento de matrícula en contextos del siglo XX, sin inferir calidad.",
      "sourceUse": "Referencia pedagógica; enunciado, alternativas y soluciones originales"
    }
  },
  {
    "base": "Historia:HIS-051",
    "id": "TR-HIS-021",
    "question": "Una zona agrícola chilena incorporó a fines del siglo XIX una conexión ferroviaria con un puerto, reduciendo el tiempo de transporte de su producción. ¿Qué efecto económico es más razonable inferir?",
    "options": [
      "Se facilitó la articulación entre zonas productoras y mercados de exportación",
      "Desaparecieron de inmediato todos los intermediarios y costos de comercialización",
      "La conexión ferroviaria eliminó por sí sola toda desigualdad rural",
      "La producción de la zona dejó necesariamente de depender de la demanda externa"
    ],
    "answer": 0,
    "steps": [
      "La fuente describe una reducción del tiempo necesario para trasladar productos desde una región agrícola hasta un puerto.",
      "Una infraestructura ferroviaria puede disminuir obstáculos logísticos y facilitar intercambios entre productores y compradores.",
      "El efecto mejor fundamentado es una mayor conexión comercial; eso no prueba desaparición universal de costos o desigualdades."
    ],
    "errors": [
      "",
      "El ferrocarril puede reducir tiempos y ciertos costos, pero no permite afirmar que desaparezcan todos los servicios de intermediación.",
      "Los cambios en transporte no eliminan por sí solos la desigualdad social ni sus causas estructurales.",
      "Conectar una zona a un puerto puede aumentar su acceso a mercados externos, no garantizar independencia de su demanda."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Historia-v2.pdf",
      "officialEje": "Historia · inserción de economía chilena en mercados internacionales del siglo XIX",
      "driveFileId": "1JaJRn8X_Zfz-otqFwoNpamrFSxwg34YI",
      "driveMaterial": "CPECH · Bitácora mundo, América y Chile siglo XIX",
      "alignmentRationale": "Relacionar ferrocarril e integración productiva con inferencias acotadas.",
      "sourceUse": "Referencia pedagógica; enunciado, alternativas y soluciones originales"
    }
  },
  {
    "base": "Historia:HIS-038",
    "id": "TR-HIS-022",
    "question": "Una radio regional publica documentos contrastados sobre gastos municipales. Una autoridad propone retirar el reportaje únicamente porque afecta la imagen del municipio, sin mencionar una infracción legal. ¿Qué principio democrático resulta más pertinente?",
    "options": [
      "Las autoridades pueden eliminar toda crítica que les resulte incómoda",
      "La libertad de informar favorece el control ciudadano del poder, con responsabilidades legales",
      "Los medios deben reproducir exclusivamente las declaraciones oficiales",
      "La libertad de prensa impide corregir informaciones falsas en cualquier circunstancia"
    ],
    "answer": 1,
    "steps": [
      "La situación plantea una publicación sobre decisiones y uso de recursos públicos que puede aportar información relevante a la ciudadanía.",
      "En democracia, la libertad de expresión y el acceso a información permiten el escrutinio de autoridades, sujeto a responsabilidades establecidas por la ley.",
      "El solo malestar de una autoridad frente a una crítica no demuestra motivo legítimo para censurar la publicación ni elimina el deber de verificar los hechos."
    ],
    "errors": [
      "El desacuerdo de una autoridad con una investigación periodística no constituye por sí solo una justificación para eliminar toda crítica.",
      "",
      "La prensa cumple funciones informativas independientes y no se limita a repetir declaraciones de organismos públicos.",
      "La libertad de prensa no elimina las responsabilidades por errores ni impide rectificaciones conforme a las reglas aplicables."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Historia-v2.pdf",
      "officialEje": "Formación ciudadana · democracia, información y comunicación masiva",
      "driveFileId": "1GZTBELme_Gtv-uDFRDsuu2bmHKuhZHgf",
      "driveMaterial": "CPECH · Bitácora Formación Ciudadana",
      "alignmentRationale": "Libertad de información y medios como garantía de control ciudadano de autoridades.",
      "sourceUse": "Referencia pedagógica; enunciado, alternativas y soluciones originales"
    }
  }
];
