/* Lote 10 revisado: tareas distintas y referencias editoriales corregidas. */
export const transferCasesBatch10=[
  {
    "base": "Ciencias:SCI-168",
    "id": "TR-SCI-045",
    "question": "Dos registros didácticos muestran la liberación de un ovocito y el inicio de la menstruación siguiente: en A ocurren los días 12 y 26, y en B los días 18 y 32. ¿Qué conclusión se sostiene únicamente para estos registros?",
    "options": [
      "La ovulación ocurrió siempre el día 14 de cada ciclo",
      "La ovulación ocurrió 14 días antes de la menstruación siguiente en ambos registros",
      "La ovulación y la menstruación ocurrieron al mismo tiempo",
      "El registro B demuestra que un ciclo no puede incluir ovulación"
    ],
    "answer": 1,
    "steps": [
      "Identificamos la ovulación por la liberación del ovocito y la comparamos con el inicio posterior de la menstruación.",
      "En A transcurren 26 − 12 = 14 días; en B transcurren 32 − 18 = 14 días entre los eventos.",
      "Ambos intervalos son de 14 días, pero los días de ovulación difieren; dos registros no establecen una regla universal ni sirven para predecir un ciclo personal."
    ],
    "errors": [
      "Los registros sitúan la ovulación en los días 12 y 18, no en el día 14 de ambos ciclos.",
      "",
      "Cada registro entrega fechas diferentes para ambos eventos, por lo que no fueron simultáneos.",
      "El registro B incluye liberación de un ovocito, que corresponde al evento ovulatorio."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Biología · Procesos y funciones biológicas, ciclo ovárico y reproducción humana",
      "driveFileId": "1CRIRkNfTXcOEMlvi4Xul4aM0mF9iAngA",
      "driveMaterial": "FILADD · Guía teórica Eje 2-1: sexualidad humana",
      "alignmentRationale": "Distinguir la liberación del ovocito de otras etapas del ciclo reproductivo.",
      "sourceUse": "Referencia conceptual y curricular; pregunta y resolución originales"
    },
    "transferDesign": {
      "baseTask": "Definir ovulación",
      "newTask": "Interpretar intervalos y limitar una conclusión a dos registros didácticos",
      "review": "La segunda tarea requiere analizar datos y no volver a nombrar el mismo evento."
    }
  },
  {
    "base": "Ciencias:SCI-192",
    "id": "TR-SCI-046",
    "question": "Una mezcla contiene 4 mol de A y 1 mol de B. Se agrega únicamente B, sin reacción. ¿Cuántos moles de B deben añadirse para que su fracción molar final sea 0,50?",
    "options": [
      "1 mol",
      "3 mol",
      "4 mol",
      "5 mol"
    ],
    "answer": 1,
    "steps": [
      "Una fracción molar de B igual a 0,50 implica que la mitad de los moles finales corresponde a B y la otra mitad a A.",
      "La cantidad de A permanece en 4 mol, así que la cantidad final de B también debe ser 4 mol.",
      "Como inicialmente había 1 mol de B, deben añadirse 3 mol; se comprueba 4 / (4 + 4) = 0,50."
    ],
    "errors": [
      "Añadir 1 mol deja 2 mol de B en 6 mol totales, una fracción de 1/3.",
      "",
      "4 mol es la cantidad final de B necesaria, no la cantidad adicional que se debe incorporar.",
      "Añadir 5 mol deja 6 mol de B en 10 mol totales, una fracción de 0,60."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Química · Reacciones y estequiometría, composición de mezclas y fracción molar",
      "driveFileId": "13UvIAvE7XJJz2QEFbDoM5nwp_okrTkb3",
      "driveMaterial": "PDV · Compendio 3: Disoluciones químicas",
      "alignmentRationale": "Calcular la fracción molar de un componente usando sus moles y el total de la mezcla.",
      "sourceUse": "Referencia conceptual y curricular; pregunta y resolución originales"
    },
    "transferDesign": {
      "baseTask": "Calcular fracción molar desde cantidades dadas",
      "newTask": "Determinar la cantidad que debe agregarse para alcanzar una fracción objetivo",
      "review": "Planteamiento inverso con cambio simultáneo del numerador y el total."
    }
  },
  {
    "base": "Ciencias:SCI-177",
    "id": "TR-SCI-047",
    "question": "El eteno, C₂H₄, tiene alrededor de cada átomo de carbono tres regiones de enlace y una estructura plana. ¿Qué hibridación se asocia a cada carbono?",
    "options": [
      "sp",
      "sp²",
      "sp³",
      "s"
    ],
    "answer": 1,
    "steps": [
      "La hibridación se relaciona con la cantidad de regiones de enlace y la geometría alrededor del átomo.",
      "Tres regiones de enlace alrededor de cada carbono se asocian a una disposición trigonal plana.",
      "Esa geometría corresponde a hibridación sp² en cada carbono del eteno."
    ],
    "errors": [
      "sp se asocia a dos regiones y una geometría lineal.",
      "",
      "sp³ se asocia a cuatro regiones y una geometría tetraédrica.",
      "s no describe la hibridación de carbono en estos enlaces covalentes."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Química · Estructura atómica y enlace químico, geometría molecular e hibridación",
      "driveFileId": "1do0a8LpYU8lHJDpb9g6S5qJCuiKQLGXF",
      "driveMaterial": "TESLA · QC07: Enlaces químicos",
      "alignmentRationale": "Relacionar tres regiones de enlace y geometría trigonal plana con hibridación sp².",
      "sourceUse": "Referencia conceptual y curricular; pregunta y resolución originales"
    }
  },
  {
    "base": "Ciencias:SCI-183",
    "id": "TR-SCI-048",
    "question": "Se comparan dos pares de estructuras: I) un brazo humano y la aleta de una ballena, con patrón óseo común y funciones distintas; II) el ala de un insecto y la de un ave, con función de vuelo y organización anatómica diferente. ¿Qué clasificación está mejor respaldada?",
    "options": [
      "Ambos pares son homólogos porque toda semejanza de función prueba parentesco cercano",
      "I es análogo y II homólogo, porque la función tiene prioridad sobre la estructura",
      "I aporta evidencia de homología y ancestro común; II ejemplifica analogía funcional",
      "Ninguno permite comparar estructuras porque pertenecen a especies diferentes"
    ],
    "answer": 2,
    "steps": [
      "En I, la organización anatómica compartida pese al cambio de función es evidencia de homología y origen evolutivo común.",
      "En II, el parecido funcional del vuelo no viene acompañado del mismo plan estructural; se trata de una analogía funcional.",
      "La comparación muestra por qué una función parecida no basta para inferir el mismo origen anatómico ni un parentesco cercano."
    ],
    "errors": [
      "Compartir función no demuestra por sí solo el mismo origen anatómico de las estructuras.",
      "La clasificación invierte la evidencia: el patrón estructural común corresponde a I.",
      "",
      "La anatomía comparada examina precisamente semejanzas y diferencias entre especies."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Biología · Herencia y evolución, evidencias anatómicas y parentesco",
      "driveFileId": "1QvjRG1U87sI78LDJu0ME9U3YWI3W7yjs",
      "driveMaterial": "FILADD · Guía teórica Eje 3-4: orígenes y evidencias biológicas",
      "alignmentRationale": "Interpretar una estructura homóloga como evidencia de ancestro común, sin inferir descendencia directa.",
      "sourceUse": "Referencia conceptual y curricular; pregunta y resolución originales"
    },
    "transferDesign": {
      "baseTask": "Nombrar una estructura homóloga",
      "newTask": "Contrastar dos pares y distinguir homología estructural de analogía funcional",
      "review": "Se exige comparar evidencia de estructura y función en lugar de repetir la definición."
    }
  },
  {
    "base": "Ciencias:SCI-201",
    "id": "TR-SCI-049",
    "question": "Una persona se ubica a 2 m frente a un espejo plano. ¿A qué distancia detrás del espejo se forma su imagen?",
    "options": [
      "1 m",
      "2 m",
      "4 m",
      "La imagen se forma sobre el espejo"
    ],
    "answer": 1,
    "steps": [
      "En un espejo plano, la imagen virtual queda a la misma distancia detrás del espejo que el objeto frente a él.",
      "El objeto está a 2 m de la superficie reflectante; esa distancia se mide perpendicularmente al espejo.",
      "Por simetría, la imagen se ubica a 2 m detrás del espejo."
    ],
    "errors": [
      "1 m reduce a la mitad una distancia que el espejo plano conserva simétricamente.",
      "",
      "4 m duplica la distancia objeto-espejo; no se suman las distancias a ambos lados para ubicar la imagen.",
      "La imagen virtual parece estar detrás del espejo, no sobre su superficie."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Física · Ondas, espejos y lentes, formación de imágenes en espejos planos",
      "driveFileId": "1fz26cWRvUBQTjdLrC-9BcRl_-5HPTsFU",
      "driveMaterial": "PDV · Compendio 1: Magnitudes, Ondas, Espejos y Lentes",
      "alignmentRationale": "Aplicar la simetría de distancia objeto-imagen en un espejo plano.",
      "sourceUse": "Referencia conceptual y curricular; pregunta y resolución originales"
    }
  },
  {
    "base": "Ciencias:SCI-022",
    "id": "TR-SCI-050",
    "question": "Por una resistencia circulan 0,4 A cuando se conecta a 8 V. Si la resistencia no cambia, ¿qué voltaje hará circular 0,7 A?",
    "options": [
      "2,8 V",
      "8 V",
      "12 V",
      "14 V"
    ],
    "answer": 3,
    "steps": [
      "La ley de Ohm establece que V = R·I; si R permanece constante, voltaje y corriente son proporcionales.",
      "Con los datos iniciales, la resistencia es R = 8 V / 0,4 A = 20 Ω.",
      "Multiplicamos la resistencia constante por la nueva corriente: 20 Ω × 0,7 A = 14 V."
    ],
    "errors": [
      "2,8 V multiplica voltaje por corriente, en vez de usar la resistencia constante.",
      "8 V es el voltaje inicial, asociado a una corriente menor de 0,4 A.",
      "12 V no mantiene la resistencia de 20 Ω para la corriente final indicada.",
      ""
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Física · Electricidad, ley de Ohm",
      "driveFileId": "1Br-fqf2HsB1oeUK2RfiunAmsQrNrLD19",
      "driveMaterial": "PDV · Cuadernillo de Física: Electricidad",
      "alignmentRationale": "Usar una resistencia constante para relacionar un nuevo voltaje con la corriente solicitada.",
      "sourceUse": "Referencia conceptual y curricular; pregunta y resolución originales"
    }
  }
];
