/* Lote 9: transferencia original; revisión geométrica del caso de Kepler. */
export const transferCasesBatch9=[
  {
    "base": "Ciencias:SCI-083",
    "id": "TR-SCI-039",
    "question": "En dos reservas se registran estas especies: la reserva A contiene 12 especies distintas y la reserva B contiene 8. Aunque B suma más individuos en total, ¿qué conclusión se sostiene sobre la riqueza de especies?",
    "options": [
      "A tiene mayor riqueza de especies",
      "B tiene mayor riqueza porque reúne más individuos",
      "Ambas tienen igual riqueza porque ambas son reservas",
      "No es posible comparar riqueza contando especies distintas"
    ],
    "answer": 0,
    "steps": [
      "La riqueza de especies se refiere al número de especies distintas registradas, no al total de individuos.",
      "La reserva A tiene 12 especies y la B tiene 8; la abundancia total de individuos no cambia esos conteos.",
      "Al comparar el número de especies distintas, se observa que A tiene cuatro más que B y, por eso, mayor riqueza."
    ],
    "errors": [
      "",
      "El total de individuos corresponde a abundancia; no reemplaza el conteo de especies distintas.",
      "Ser reservas no implica que tengan la misma cantidad de especies.",
      "El número de especies distintas sí permite comparar riqueza."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Biología · Herencia y evolución, biodiversidad y parentesco",
      "driveFileId": "1SWT6aQkvRJjt6y5i8OF8bSeC_I8Xe1Hy",
      "driveMaterial": "FILADD · Guía teórica Eje 3-5: teorías de la evolución de la biodiversidad",
      "alignmentRationale": "Distinguir riqueza de especies del número total de individuos al comparar comunidades.",
      "sourceUse": "Referencia conceptual y curricular; enunciado, alternativas y resolución originales"
    }
  },
  {
    "base": "Ciencias:SCI-172",
    "id": "TR-SCI-040",
    "question": "Un resorte se alarga 2 cm cuando se le aplica una fuerza de 6 N. Si mantiene comportamiento elástico lineal, ¿qué fuerza se requiere para alargarlo 5 cm?",
    "options": [
      "2,4 N",
      "11 N",
      "15 N",
      "30 N"
    ],
    "answer": 2,
    "steps": [
      "En el régimen lineal de la ley de Hooke, la fuerza es proporcional al alargamiento: F = kx.",
      "Con una fuerza de 6 N y un alargamiento de 2 cm, la constante del resorte es 3 N por centímetro.",
      "Al aplicar esa constante al alargamiento final de 5 cm, se obtiene una fuerza de 15 N."
    ],
    "errors": [
      "2,4 N resulta de invertir la razón; al aumentar el alargamiento también aumenta la fuerza.",
      "11 N suma magnitudes con unidades distintas en lugar de usar proporcionalidad.",
      "",
      "30 N multiplica fuerza por distancia sin dividir por el alargamiento inicial."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Física · Fuerza y movimiento, elasticidad y ley de Hooke",
      "driveFileId": "1WTyLTfNs5Xt3aiO50cxVvSJlurZs_a0W",
      "driveMaterial": "CPECH · Física, movimiento y fuerzas",
      "alignmentRationale": "Aplicar proporcionalidad fuerza-alargamiento en un resorte dentro del régimen elástico.",
      "sourceUse": "Referencia conceptual y curricular; enunciado, alternativas y resolución originales"
    }
  },
  {
    "base": "Ciencias:SCI-136",
    "id": "TR-SCI-041",
    "question": "Un átomo neutro tiene configuración electrónica por niveles 2, 8, 7. Al formar un ion estable, ¿qué cambio es más probable para completar su capa externa?",
    "options": [
      "Ganar un electrón y formar un ion −1",
      "Perder siete electrones y formar un ion +7",
      "Ganar siete electrones y formar un ion −7",
      "Perder un electrón y formar un ion +1"
    ],
    "answer": 0,
    "steps": [
      "La capa externa contiene 7 electrones, por lo que le falta uno para completar el octeto.",
      "Al ganar un electrón, el átomo pasa a tener una carga negativa neta de una unidad.",
      "La opción más probable en este modelo es formar un anión de carga −1."
    ],
    "errors": [
      "",
      "Perder siete electrones implicaría retirar toda la capa externa, un cambio mucho menos favorable en este contexto.",
      "Ganar siete electrones no completa simplemente la capa: excedería el octeto.",
      "Perder un electrón dejaría seis electrones en la capa externa, más lejos del octeto."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Química · Estructura atómica, electrones de valencia y formación de iones",
      "driveFileId": "1gILZ7GBQdpixWUdPep6AEZXnLEXPfXC0",
      "driveMaterial": "PDV · Cuaderno de Química común",
      "alignmentRationale": "Relacionar electrones de valencia con la tendencia simplificada a ganar o perder electrones.",
      "sourceUse": "Referencia conceptual y curricular; enunciado, alternativas y resolución originales"
    }
  },
  {
    "base": "Ciencias:SCI-206",
    "id": "TR-SCI-042",
    "question": "En un dibujo de una órbita elíptica no circular, un estudiante ubica el Sol en un foco y luego afirma que los dos extremos del eje mayor están a igual distancia del Sol. ¿Qué error contiene su afirmación?",
    "options": [
      "Confunde el centro de la elipse con el foco ocupado por el Sol",
      "Confunde una trayectoria elíptica con una trayectoria abierta",
      "Supone que el Sol debe ocupar simultáneamente los dos focos",
      "Considera que todos los planetas tienen la misma masa"
    ],
    "answer": 0,
    "steps": [
      "Los extremos del eje mayor son simétricos respecto del centro geométrico de la elipse, no respecto de cada foco.",
      "En una elipse no circular, un foco está desplazado respecto del centro, por lo que un extremo queda más próximo a él que el otro.",
      "Ubicar el Sol en un foco permite distancias diferentes a esos extremos, coherentes con la primera ley de Kepler."
    ],
    "errors": [
      "",
      "Una órbita elíptica es cerrada; el error del estudiante se refiere a las distancias al foco.",
      "El estudiante ubica el Sol en un solo foco; lo incorrecto es tratar ese punto como centro de simetría.",
      "La afirmación no compara masas y el error geométrico no depende de que sean iguales."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Física · Mecánica, aportes de Kepler a los modelos del sistema solar",
      "driveFileId": "1WTyLTfNs5Xt3aiO50cxVvSJlurZs_a0W",
      "driveMaterial": "CPECH · Física, movimiento y fuerzas",
      "alignmentRationale": "Interpretar la ubicación del Sol en una órbita planetaria elíptica, más allá de identificar su forma.",
      "sourceUse": "Referencia conceptual y curricular; enunciado, alternativas y resolución originales"
    },
    "transferDesign": {
      "baseTask": "Describir una órbita según la primera ley de Kepler",
      "newTask": "Detectar una inferencia geométrica inválida al confundir centro y foco",
      "review": "Aplicación de la ley a una predicción de distancias, no repetición de su definición."
    }
  },
  {
    "base": "Ciencias:SCI-094",
    "id": "TR-SCI-043",
    "question": "Una caja de 3 kg se eleva verticalmente 4 m. Considera g = 10 m/s². ¿Cuánto aumenta su energía potencial gravitatoria?",
    "options": [
      "7,5 J",
      "30 J",
      "120 J",
      "1200 J"
    ],
    "answer": 2,
    "steps": [
      "El cambio de energía potencial gravitatoria cerca de la superficie se calcula como ΔEp = m·g·Δh.",
      "Sustituimos la masa, la aceleración gravitatoria y el cambio de altura en la fórmula: 3 kg × 10 m/s² × 4 m.",
      "Multiplicamos los tres valores; las unidades kg·m²/s² equivalen a joules, así que el aumento es 120 J."
    ],
    "errors": [
      "7,5 J divide las magnitudes y no aplica la relación de energía potencial.",
      "30 J omite la altura de 4 m y por eso no representa el cambio completo de energía potencial.",
      "",
      "1200 J introduce un factor diez adicional en el producto."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Física · Energía, conservación y transformación, energía potencial gravitatoria",
      "driveFileId": "1WTyLTfNs5Xt3aiO50cxVvSJlurZs_a0W",
      "driveMaterial": "CPECH · Física, movimiento y fuerzas",
      "alignmentRationale": "Calcular el cambio de energía potencial a partir de masa, gravedad y variación de altura.",
      "sourceUse": "Referencia conceptual y curricular; enunciado, alternativas y resolución originales"
    }
  },
  {
    "base": "Ciencias:SCI-167",
    "id": "TR-SCI-044",
    "question": "En una especie, las células somáticas tienen 2n = 46 cromosomas. Tras la meiosis, un óvulo con n = 23 cromosomas es fecundado por un espermatozoide normal. ¿Cuántos cromosomas tendrá el cigoto?",
    "options": [
      "23",
      "46",
      "69",
      "92"
    ],
    "answer": 1,
    "steps": [
      "La meiosis produce gametos haploides, cada uno con la mitad del número de cromosomas de las células somáticas.",
      "El óvulo aporta 23 cromosomas y el espermatozoide normal también aporta 23 cromosomas al cigoto.",
      "Al reunirse ambos juegos haploides se restablecen 46 cromosomas, la dotación diploide propia de esa especie."
    ],
    "errors": [
      "23 corresponde a la dotación de cada gameto antes de la fecundación.",
      "",
      "69 suma una dotación haploide adicional que no participa en el caso descrito.",
      "92 duplica el número diploide en vez de sumar dos gametos haploides."
    ],
    "sourceTrace": {
      "officialTemario": "https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf",
      "officialEje": "Biología · Herencia y evolución, meiosis, gametos y fecundación",
      "driveFileId": "1ALLN-fBd0OjLL29otkMF3MZ3nioIHkjL",
      "driveMaterial": "FILADD · Guía teórica Eje 3-2: meiosis",
      "alignmentRationale": "Calcular la restauración de la dotación diploide al unir dos gametos haploides.",
      "sourceUse": "Referencia conceptual y curricular; enunciado, alternativas y resolución originales"
    }
  }
];
