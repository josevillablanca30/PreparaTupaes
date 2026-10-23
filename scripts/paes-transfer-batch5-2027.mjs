/* Lote 5: 12 problemas PAES independientes con contraste de temarios DEMRE Admisión 2027 y libros específicos del Drive. Enunciados y soluciones originales; no oficiales. */
export const transferCasesBatch5=[
  {
    "base": "M1:216",
    "id": "TR-M1-017",
    "question": "Una cooperativa registra un ingreso de (5a + 3b) y un gasto de (2a − 4b), expresados en miles de pesos. ¿Cuál es la expresión del saldo, ingreso menos gasto?",
    "options": [
      "3a − b",
      "7a − b",
      "3a + 7b",
      "7a + 7b"
    ],
    "answer": 2,
    "steps": [
      "La diferencia solicitada es (5a + 3b) − (2a − 4b), y el signo menos afecta ambos términos del gasto.",
      "Al retirar el paréntesis, se obtiene 5a + 3b − 2a + 4b; la resta de un valor negativo se convierte en suma.",
      "Agrupando términos de igual variable queda (5−2)a + (3+4)b = 3a + 7b, sin mezclar cantidades de tipos distintos."
    ],
    "errors": [
      "Se restó 4b en lugar de sumar 4b al distribuir el signo menos del segundo paréntesis.",
      "Se sumaron coeficientes de a y se restaron los de b, cambiando ambos signos incorrectamente.",
      "",
      "Se sumaron todos los coeficientes como si el gasto también fuese ingreso."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-M1-v1.pdf",
      "officialEje": "Álgebra y funciones · operatoria de expresiones algebraicas",
      "driveFileId": "1tgKp8r5wl6_PDk-G8yHUTDU4xHlldsvA",
      "driveMaterial": "CPECH · Cuaderno de ejercicios M1",
      "alignmentRationale": "Restar una expresión algebraica aplicando correctamente los signos y reduciendo términos semejantes.",
      "sourceUse": "Referencia conceptual y secuencia pedagógica; enunciado, alternativas y resolución originales"
    }
  },
  {
    "base": "M1:217",
    "id": "TR-M1-018",
    "question": "Sea E = 2x² − 3xy + y. Al reemplazar x = −2 e y = 3, ¿cuál es el valor de E?",
    "options": [
      "−13",
      "17",
      "29",
      "41"
    ],
    "answer": 2,
    "steps": [
      "El valor de x² es (−2)² = 4, mientras que xy = (−2)·3 = −6; deben respetarse los paréntesis y signos.",
      "Se sustituye en E: 2·4 − 3·(−6) + 3. Multiplicar un número negativo por −3 produce una cantidad positiva.",
      "Finalmente E = 8 + 18 + 3 = 29; el resultado incluye tanto el cuadrado como el signo del producto xy."
    ],
    "errors": [
      "Se interpretó (−2)² como negativo o se perdió el signo positivo de −3xy.",
      "Este resultado omite uno de los términos o modifica incorrectamente el signo del producto xy.",
      "",
      "Se duplicó un aporte o se sumó una cantidad que no aparece en la expresión original."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-M1-v1.pdf",
      "officialEje": "Álgebra y funciones · expresiones algebraicas",
      "driveFileId": "1tgKp8r5wl6_PDk-G8yHUTDU4xHlldsvA",
      "driveMaterial": "CPECH · Cuaderno de ejercicios M1",
      "alignmentRationale": "Evaluar expresiones algebraicas con sustitución de valores negativos y prioridad de operaciones.",
      "sourceUse": "Referencia conceptual y secuencia pedagógica; enunciado, alternativas y resolución originales"
    }
  },
  {
    "base": "M1:239",
    "id": "TR-M1-019",
    "question": "Un jardín tiene forma de paralelogramo. Su base mide 12 m, su altura perpendicular 7 m y su lado inclinado 9 m. ¿Qué superficie tiene el jardín?",
    "options": [
      "63 m²",
      "84 m²",
      "108 m²",
      "42 m²"
    ],
    "answer": 1,
    "steps": [
      "El área de un paralelogramo depende de la base y la altura perpendicular a ella, no de la longitud oblicua del otro lado.",
      "Se identifican en el enunciado la base de 12 metros y la altura perpendicular de 7 metros.",
      "El área es 12 × 7 = 84 metros cuadrados; usar 9 como altura confundiría lado inclinado con distancia perpendicular."
    ],
    "errors": [
      "63 m² resulta de multiplicar la altura por el lado oblicuo en vez de por la base.",
      "",
      "108 m² multiplica la base por el lado inclinado y no emplea la altura perpendicular.",
      "42 m² aparece al dividir por dos la superficie, aplicando indebidamente la fórmula de un triángulo."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-M1-v1.pdf",
      "officialEje": "Geometría · perímetro y áreas de paralelogramos",
      "driveFileId": "1tgKp8r5wl6_PDk-G8yHUTDU4xHlldsvA",
      "driveMaterial": "CPECH · Cuaderno de ejercicios M1",
      "alignmentRationale": "Área de paralelogramo en contexto con lado inclinado distractor y altura perpendicular relevante.",
      "sourceUse": "Referencia conceptual y secuencia pedagógica; enunciado, alternativas y resolución originales"
    }
  },
  {
    "base": "M1:260",
    "id": "TR-M1-020",
    "question": "En una situación hipotética, dos eventos son independientes: A ocurre con probabilidad 30 % y B con probabilidad 20 %. ¿Cuál es la probabilidad de que ocurran ambos?",
    "options": [
      "6 %",
      "10 %",
      "50 %",
      "60 %"
    ],
    "answer": 0,
    "steps": [
      "La condición de independencia permite usar la regla multiplicativa P(A ∩ B)=P(A)·P(B).",
      "Los porcentajes se expresan como decimales: 30 % = 0,30 y 20 % = 0,20 antes de realizar el producto.",
      "La probabilidad conjunta es 0,30 × 0,20 = 0,06, que corresponde a 6 % y es menor que ambas probabilidades individuales."
    ],
    "errors": [
      "",
      "El 10 % proviene de restar porcentajes y no representa el producto de probabilidades independientes.",
      "El 50 % suma las dos probabilidades y no corresponde al evento conjunto descrito.",
      "El 60 % multiplica 30 por 20 pero omite el cambio de escala porcentual."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-M1-v1.pdf",
      "officialEje": "Probabilidad y estadística · regla multiplicativa",
      "driveFileId": "1tgKp8r5wl6_PDk-G8yHUTDU4xHlldsvA",
      "driveMaterial": "CPECH · Cuaderno de ejercicios M1",
      "alignmentRationale": "Usar independencia explícita, en lugar de sumar porcentajes, para calcular intersección de eventos.",
      "sourceUse": "Referencia conceptual y secuencia pedagógica; enunciado, alternativas y resolución originales"
    }
  },
  {
    "base": "Ciencias:SCI-090",
    "id": "TR-SCI-023",
    "question": "Una muestra de roca tiene masa de 12 kg. En un laboratorio se simula un planeta donde la aceleración gravitatoria es 4 N/kg. ¿Cuál es su peso en ese entorno?",
    "options": [
      "12 N",
      "48 N",
      "120 N",
      "3 N"
    ],
    "answer": 1,
    "steps": [
      "La masa describe cantidad de materia, mientras el peso es una fuerza relacionada con el campo gravitatorio del lugar.",
      "El peso se calcula como P = m·g. Los datos son 12 kg y 4 N/kg, por lo que las unidades dan newton.",
      "Multiplicamos 12 por 4 y obtenemos 48 N. La masa sigue siendo 12 kg, aunque el peso cambie al cambiar g."
    ],
    "errors": [
      "Doce es el valor numérico de la masa, pero se confundió su unidad kilogramo con el newton del peso.",
      "",
      "120 N aplica una aceleración gravitatoria distinta de la declarada en este problema.",
      "Tres newton resulta de dividir la masa entre la gravedad, operación incompatible con la fórmula del peso."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Física · Mecánica, fuerza peso y leyes de Newton",
      "driveFileId": "1WTyLTfNs5Xt3aiO50cxVvSJlurZs_a0W",
      "driveMaterial": "CPECH · Física plan común, movimiento y fuerzas",
      "alignmentRationale": "Diferenciar masa de peso y usar un campo gravitatorio explícitamente dado para hallar la fuerza.",
      "sourceUse": "Referencia conceptual y secuencia pedagógica; enunciado, alternativas y resolución originales"
    }
  },
  {
    "base": "Ciencias:SCI-091",
    "id": "TR-SCI-024",
    "question": "Una bicicleta avanza en línea recta y cambia su velocidad de 5 m/s a 17 m/s en 4 s. ¿Cuál es su aceleración media en ese intervalo?",
    "options": [
      "0,33 m/s²",
      "3 m/s²",
      "5,5 m/s²",
      "12 m/s²"
    ],
    "answer": 1,
    "steps": [
      "La aceleración media se obtiene dividiendo el cambio de velocidad por el tiempo transcurrido en el intervalo estudiado.",
      "Se calcula la variación de la velocidad: 17 − 5 = 12 m/s, durante cuatro segundos de observación.",
      "La aceleración media es 12/4 = 3 m/s², positiva respecto de la dirección elegida como avance."
    ],
    "errors": [
      "Se invirtió el cociente entre tiempo y cambio de velocidad, sin respetar la definición de aceleración.",
      "",
      "Se usó un promedio de las velocidades en lugar de su diferencia dividida por tiempo.",
      "Doce corresponde al cambio total de velocidad, no a la aceleración por segundo."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Física · Mecánica, descripción del movimiento y aceleración",
      "driveFileId": "1WTyLTfNs5Xt3aiO50cxVvSJlurZs_a0W",
      "driveMaterial": "CPECH · Física plan común, movimiento y fuerzas",
      "alignmentRationale": "Calcular aceleración media a partir de dos velocidades y un intervalo de tiempo explícitos.",
      "sourceUse": "Referencia conceptual y secuencia pedagógica; enunciado, alternativas y resolución originales"
    }
  },
  {
    "base": "Ciencias:SCI-158",
    "id": "TR-SCI-025",
    "question": "Se preparan dos soluciones de un mismo soluto: A contiene 12 g de soluto en 200 g de solución; B contiene 9 g en 100 g de solución. ¿Cuál es la comparación correcta de sus concentraciones %m/m?",
    "options": [
      "A: 12 %; B: 9 %, por lo que A es mayor",
      "A: 6 %; B: 9 %, por lo que B es mayor",
      "A: 6 %; B: 4,5 %, por lo que A es mayor",
      "A y B tienen ambas 9 %"
    ],
    "answer": 1,
    "steps": [
      "La concentración porcentaje masa sobre masa relaciona la masa del soluto con la masa total de solución y multiplica por cien.",
      "En A se calcula 12/200 × 100 = 6 %. En B se obtiene 9/100 × 100 = 9 %, usando los denominadores respectivos.",
      "Como 9 % es mayor que 6 %, la solución B está más concentrada, aunque su masa absoluta de soluto sea menor."
    ],
    "errors": [
      "Doce gramos no significan automáticamente 12 % cuando la solución completa tiene masa de doscientos gramos.",
      "",
      "Se dividió incorrectamente la concentración de B o se confundieron las masas de las soluciones.",
      "La presencia del mismo soluto no garantiza concentraciones iguales si las proporciones son diferentes."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Química · Reacciones y estequiometría, concentración física %m/m",
      "driveFileId": "1gILZ7GBQdpixWUdPep6AEZXnLEXPfXC0",
      "driveMaterial": "PDV · Cuaderno de Química común 2",
      "alignmentRationale": "Comparación de porcentajes masa a masa con distintas masas totales de solución.",
      "sourceUse": "Referencia conceptual y secuencia pedagógica; enunciado, alternativas y resolución originales"
    }
  },
  {
    "base": "Ciencias:SCI-204",
    "id": "TR-SCI-026",
    "question": "Una pieza sólida homogénea tiene una masa de 90 g y desplaza 30 cm³ de agua al sumergirse completamente. ¿Cuál es la densidad media de la pieza?",
    "options": [
      "0,33 g/cm³",
      "3 g/cm³",
      "30 g/cm³",
      "120 g/cm³"
    ],
    "answer": 1,
    "steps": [
      "La densidad relaciona la masa de un cuerpo con el volumen que ocupa, de modo que se calcula como masa dividida por volumen.",
      "La pieza tiene masa 90 gramos y volumen 30 centímetros cúbicos, deducido del desplazamiento total del agua.",
      "El cociente es 90/30 = 3 g/cm³; conservar ambas unidades impide confundir densidad con masa o volumen."
    ],
    "errors": [
      "Esta opción invierte volumen entre masa en lugar de dividir la masa por el volumen.",
      "",
      "Treinta es el volumen de la pieza; falta relacionarlo con los noventa gramos de masa.",
      "Ciento veinte resulta de sumar masa y volumen, magnitudes que no deben sumarse para hallar densidad."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Química · Estructura atómica, propiedades físicas y densidad",
      "driveFileId": "1tKnuro9BMJxv4Xo8AGbn_U9FpJQV2Bpl",
      "driveMaterial": "TESLA · QC01 Materia y materiales",
      "alignmentRationale": "Usar desplazamiento de agua para obtener volumen y calcular la densidad de un sólido homogéneo.",
      "sourceUse": "Referencia conceptual y secuencia pedagógica; enunciado, alternativas y resolución originales"
    }
  },
  {
    "base": "Historia:HIS-025",
    "id": "TR-HIS-023",
    "question": "Una fuente de la década de 1960 describe gran concentración de tierras agrícolas y organizaciones campesinas que demandaban acceso a la propiedad y mejores condiciones laborales. ¿Qué transformación se relaciona directamente con ese contexto chileno?",
    "options": [
      "Sustitución de la agricultura por industria pesada en todas las regiones",
      "Reforma agraria vinculada a redistribución de tierras y cambios en la vida rural",
      "Eliminación inmediata de todo conflicto entre trabajadores y propietarios",
      "Reemplazo del sistema democrático por un régimen colonial"
    ],
    "answer": 1,
    "steps": [
      "La fuente vincula concentración de tierra, desigualdad rural y demandas de organizaciones campesinas en un período de reformas.",
      "La reforma agraria chilena buscó modificar estructuras de tenencia de la tierra e incorporó cambios y disputas sociales en el mundo rural.",
      "La relación histórica pertinente es entre esa redistribución y las transformaciones agrarias del siglo XX, sin afirmar que todos sus efectos fueron iguales."
    ],
    "errors": [
      "Industrialización pesada no fue el objetivo directo de redistribuir la propiedad agrícola en el contexto descrito.",
      "",
      "Los cambios agrarios generaron tensiones sociales y políticas; no eliminaron todos los conflictos de manera inmediata.",
      "La transformación agraria ocurrió dentro de los procesos políticos chilenos contemporáneos, no mediante una recolonización."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Historia-v2.pdf",
      "officialEje": "Historia · América Latina y Chile en la segunda mitad del siglo XX: movilización social y reformas",
      "driveFileId": "1kb30RdHpKIhEsG1kr_4qQw5oNDk-5Ne1",
      "driveMaterial": "CPECH · Bitácora Historia siglo XX",
      "alignmentRationale": "Relacionar estructura de propiedad rural y movilización campesina con reforma agraria como proceso social.",
      "sourceUse": "Referencia conceptual y secuencia pedagógica; enunciado, alternativas y resolución originales"
    }
  },
  {
    "base": "Historia:HIS-036",
    "id": "TR-HIS-024",
    "question": "Una agrupación vecinal presenta propuestas de seguridad vial en una audiencia pública municipal. La autoridad las escucha, pero aún debe decidir conforme a sus atribuciones. ¿Qué interpretación es correcta?",
    "options": [
      "La asistencia ciudadana reemplaza automáticamente todas las decisiones del municipio",
      "Es participación ciudadana que expresa demandas sin eliminar atribuciones institucionales",
      "La participación existe exclusivamente cuando se vota en elecciones nacionales",
      "Las propuestas carecen de valor público porque no son decisiones de los concejales"
    ],
    "answer": 1,
    "steps": [
      "La audiencia ofrece una instancia de expresión y deliberación donde vecinos presentan intereses y propuestas de interés común.",
      "Participar en asuntos públicos no significa sustituir de forma automática los órganos que ejercen competencias y responsabilidades legales.",
      "La situación ilustra participación ciudadana e institucionalidad democrática al mismo tiempo: demanda social, diálogo y decisión por la autoridad competente."
    ],
    "errors": [
      "Escuchar a la ciudadanía no convierte toda propuesta en una obligación de aprobarla sin proceso institucional.",
      "",
      "La participación también comprende organización, deliberación y expresiones públicas más allá del acto de votar.",
      "Que la decisión no sea inmediata no vuelve inútiles las demandas que contribuyen al debate y al control ciudadano."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Historia-v2.pdf",
      "officialEje": "Formación ciudadana · sociedad democrática y participación de personas",
      "driveFileId": "1GZTBELme_Gtv-uDFRDsuu2bmHKuhZHgf",
      "driveMaterial": "CPECH · Bitácora Formación Ciudadana",
      "alignmentRationale": "Diferenciar deliberación y participación efectiva de la atribución formal de decidir de la autoridad.",
      "sourceUse": "Referencia conceptual y secuencia pedagógica; enunciado, alternativas y resolución originales"
    }
  },
  {
    "base": "Historia:HIS-039",
    "id": "TR-HIS-025",
    "question": "Una persona acusada de un delito solicita conocer los cargos y presentar pruebas con ayuda de una defensa ante un tribunal imparcial. ¿Qué principio permite fundamentar esa solicitud?",
    "options": [
      "Que la autoridad pueda condenar sin escuchar antecedentes de la defensa",
      "El debido proceso y las garantías para ejercer la defensa en juicio",
      "Que los medios de comunicación determinen la sentencia judicial",
      "Que cualquier acusación pública equivalga automáticamente a culpabilidad"
    ],
    "answer": 1,
    "steps": [
      "El conocimiento de los cargos y la posibilidad de defensa son garantías relevantes para que una persona pueda responder a una imputación.",
      "La decisión debe adoptarse mediante procedimientos legales y por una autoridad judicial imparcial, no por presión pública.",
      "La exigencia descrita se relaciona con debido proceso y acceso a justicia, no con presumir culpabilidad a partir de una denuncia."
    ],
    "errors": [
      "Condenar sin escuchar a la defensa vulnera garantías de contradicción y posibilidad de aportar antecedentes.",
      "",
      "Un tribunal debe decidir según la ley y la prueba, no delegar esa función a opiniones de los medios.",
      "La formulación de una acusación no sustituye la prueba ni elimina las garantías de la persona imputada."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Historia-v2.pdf",
      "officialEje": "Formación ciudadana · acceso a justicia y principales características del sistema judicial",
      "driveFileId": "1GZTBELme_Gtv-uDFRDsuu2bmHKuhZHgf",
      "driveMaterial": "CPECH · Bitácora Formación Ciudadana",
      "alignmentRationale": "Reconocer garantías de defensa y juicio ante tribunal imparcial como exigencias de debido proceso.",
      "sourceUse": "Referencia conceptual y secuencia pedagógica; enunciado, alternativas y resolución originales"
    }
  },
  {
    "base": "Historia:HIS-008",
    "id": "TR-HIS-026",
    "question": "Un estudio hipotético sobre entradas a un mismo evento indica que, al aumentar su precio de $5.000 a $7.000, bajó la cantidad comprada de 500 a 380, manteniéndose los demás factores constantes. ¿Qué interpretación económica corresponde?",
    "options": [
      "Un aumento de demanda que desplaza toda la curva hacia la derecha",
      "Una reducción de la cantidad demandada por movimiento a lo largo de la curva de demanda",
      "Una disminución de la oferta causada necesariamente por mayores costos",
      "Un alza de ingresos del público que aumenta las preferencias por el evento"
    ],
    "answer": 1,
    "steps": [
      "El enunciado cambia solamente el precio del mismo bien y reporta cómo varía la cantidad que las personas están dispuestas a comprar.",
      "Con los demás factores constantes, al subir el precio es habitual observar menor cantidad demandada, según la relación descrita por la curva.",
      "Como no se informó cambio de preferencias ni ingreso, hablamos de movimiento a lo largo de la curva de demanda, no de desplazamiento de la demanda."
    ],
    "errors": [
      "Un desplazamiento de la curva exige cambios en factores distintos del precio propio, no declarados en la fuente.",
      "",
      "El caso describe decisiones de compra de usuarios y no aporta evidencia suficiente para atribuirlo a costos de los oferentes.",
      "No se especifica un aumento de ingreso ni cambios en preferencias que permitan explicar el movimiento observado."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Historia-v2.pdf",
      "officialEje": "Sistema económico · funcionamiento del mercado y factores que lo alteran",
      "driveFileId": "1bFruW8e2qlIYkve9LYwWeGuprEfKP-ka",
      "driveMaterial": "CPECH · Bitácora Sistema Económico",
      "alignmentRationale": "Distinguir variación de cantidad demandada por precio de desplazamientos de la demanda.",
      "sourceUse": "Referencia conceptual y secuencia pedagógica; enunciado, alternativas y resolución originales"
    }
  }
];
