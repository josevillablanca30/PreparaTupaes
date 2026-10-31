# RC7 · Cotejo adicional y enseñanza ilustrada

La enseñanza de 151 ejercicios, correspondientes a 38 objetivos de las cinco materias, incorpora precisiones contrastadas con material del Drive. Se mantienen íntegros los fundamentos anteriores, las analogías y los ejemplos desarrollados. Las 802 evaluaciones conservan enunciados, alternativas, claves, IDs, familias, conceptos y elegibilidad respecto de `405ba05dcd0b4c0f4575152aa6af214df10ba018`; un test verifica su huella completa.

Se consultaron 14 documentos con alcances delimitados. Se cerró la revisión de los 20 problemas propuestos de TESLA MM05 con excepciones expresas; no se declara lectura integral de los 526 documentos inventariados.

## Correcciones editoriales

| Hallazgo | Tratamiento |
| --- | --- |
| MM05 omite valor absoluto al escalar desviación estándar | Se refuerza `σ(kX)=|k|σ(X)` y se incluye un factor negativo en un modelo y su práctica. |
| MM05 afirma que la varianza nunca es irracional | Se descarta esa afirmación: los datos `0` y `√(√2)` tienen varianza poblacional `√2/4`. |
| Clave E en el problema 18 de MM05 | La alternativa C es válida. Se comprueba con un espacio finito que no implica independencia ni probabilidad marginal 1/2. No se importa la clave errónea. |
| Problema 10: lados de un metro, luego áreas incompatibles | No se importa sin reformular. Interpretar solo el promedio de los lados sería otro enunciado. |
| Problemas 16 y 17: restricciones de condicionamiento omitidas | Se exige denominador positivo al definir probabilidades condicionadas. |
| M19 declara independencia entre etapas en general | Se distingue selección sin reposición, restitución de composición e independencia bajo el modelo aleatorio. |
| LE25 dice Inferir en su nombre y Sintetizar en su contenido | La revisión y la referencia corresponden al contenido leído. |
| Guía celular: extracción muy escasa para validar figuras | No se considera evidencia suficiente para aprobar esos gráficos. |
| Solucionario económico con afirmaciones absolutas | No se adoptan generalizaciones sobre Estado/salarios. El alcance conceptual usa la Bitácora de Sistema económico. |
| `TR-SCI-097`: pez explicado con aire alveolar | Desarrollo y reparación ahora conectan branquias, circulación y respiración celular. |
| `TR-SCI-099`: 220/440 Hz explicados como 200/400 Hz | Desarrollo corregido con las magnitudes del enunciado, distinguiendo tono e intensidad. |
| `TR-SCI-098`: comparación temporal genérica | Desarrollo contextual con diez y tres días, sin prometer protección absoluta. |

Las últimas tres correcciones no cambian las preguntas evaluadas. Los distractores usan el desarrollo corregido del caso actual. Los detalles de fuentes y decisiones están en `reports/editorial-additional-20261020.json`.

## Alcance oficial

Se conservó la elegibilidad previamente contrastada: estar en un libro PSU no promueve un tema al ensayo PAES. Fuentes oficiales consultadas para el alcance de esta revisión:

- [M1](https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-M1-v1.pdf).
- [M2 versión 2](https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-M2-v2.pdf).
- [Ciencias](https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf).
- [Competencia Lectora versión 2](https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-CL-v2.pdf).
- [Historia versión 2](https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Historia-v2.pdf).

## Once modelos con comprobación

Ósmosis, meiosis, circuitos, ondas, áreas, Pitágoras, probabilidad condicionada, dispersión, argumentación, inferencia e industrialización aportan 33 estados y once casos nuevos guiados, vinculados por materia y concepto exactos a 153 ejercicios. La respuesta incorrecta tiene una explicación propia; puede corregirse antes de continuar. Estas actividades no dan XP, estrellas ni evidencia de dominio.

Las relaciones exactas se dibujan con SVG y texto accesible, con fórmulas legibles también fuera del SVG. Se comprueba serie cerrada, paralelo sin cortocircuitos, separación de homólogos/cromátidas y los límites de los modelos. Las ilustraciones se muestran completas: no se recortan el gato ni los objetos didácticos. Hay un único gato en la pantalla.

## Activos y prompts finales

Herramienta: generación de imágenes integrada. Referencia inspeccionada de identidad y estilo: `assets/lesson-cat-solutions-v2.webp`. Nuevos WebP, conservando los originales. Prompt común: escena narrativa artesanal 16:9 para ¿Cachaste?, gato negro oficial de ojos violetas, cejas, bigotes, barba y moño blancos, túnica morada y ribetes crema, un solo gato en tercio izquierdo, objetos grandes a la derecha, área segura 7%, aula cálida lavanda/crema; sin texto, etiquetas, números, fórmulas, logos ni interfaz. Los modelos científicos precisos se presentan aparte en código.

| Ruta del activo | Escena específica del prompt |
| --- | --- |
| `assets/lesson-cat-osmosis-v3.webp` | Gato con lupa observa dos compartimentos transparentes separados por membrana y diferentes concentraciones de piezas. |
| `assets/lesson-cat-meiosis-v3.webp` | Gato manipula piezas de cromosomas rojas y azules en bandejas. Son material de aula; el recuento exacto está en el modelo. |
| `assets/lesson-cat-electricity-v3.webp` | Antes de armar: portapilas, dos bombillas pequeñas apagadas y cables enrollados sin conectar. La edición final conserva personaje y composición, eliminando luces y conexiones incorrectas. |
| `assets/lesson-cat-waves-v3.webp` | Gato produce ondas con paleta en una bandeja larga de agua y compara separaciones. |
| `assets/lesson-cat-geometry-v3.webp` | Gato corta y reordena triángulos de fieltro junto a rectángulo y regla de esquina. |
| `assets/lesson-cat-probability-v3.webp` | Gato clasifica fichas moradas y verdes de un frasco hacia dos bandejas. |
| `assets/lesson-cat-industry-v3.webp` | Gato reflexiona ante maquetas de taller artesanal, fábrica textil del siglo XIX y viviendas; sin glorificar contaminación ni prometer progreso automático. |
| `assets/lesson-cat-argument-v3.webp` | Gato compara tarjetas con iconos de afirmación, lupa y pregunta, y coloca una ficha de evidencia. Sin texto incorporado. |

Falta cotejar página y ejercicio por ejercicio el resto del inventario, más arte para otros objetivos y validación con estudiantes. La ficha y publicación en Play Console permanecen pendientes. La clave de carga existente no se almacena en Git.
