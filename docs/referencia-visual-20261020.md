# RC6: aplicación de la referencia visual aprobada

Se adopta la composición enviada por el usuario: portada con materias ilustradas, actividad real, gatito protagonista, mundo lavanda con un camino jugable y enseñanza organizada en tarjetas con modelos visuales. Los textos, controles, resultados y diagramas siguen siendo elementos reales y accesibles de la aplicación; las capturas de referencia no se usan como pantallas estáticas.

## Cambios funcionales y visuales

- Cinco tarjetas ilustradas con color por materia. Racha, XP y misión se calculan desde el historial; no se copian las cifras del ejemplo visual. Continuar aparece cuando hay una sesión o un recorrido elegido.
- Gatito oficial con seis poses de busto y transparencia real, conservando pelaje negro, ojos violetas, cejas, barba y moño blancos, túnica morada y libro. Un solo gato por lección.
- Mundo lavanda ilustrado con cinco misiones reales consecutivas por capítulo. Los candados siguen las evidencias de aprendizaje, no el aspecto del dibujo. La curva se calcula sobre las posiciones reales de los botones; se excluyen marcadores ocultos para evitar trazos diagonales incorrectos.
- Capítulos y etapas conservan identificadores y evidencias previas. Al completar un capítulo, el portal lleva a la etapa que contiene la próxima habilidad pendiente, incluso si una unidad ocupa varios capítulos.
- La eximición 8/10 abre la etapa correspondiente sin fabricar estrellas. Se reconocen resultados guardados con las claves anteriores a la agrupación escolar; una eximición de Ciencias no se traslada a otra mención. Las unidades sin diez familias válidas no ofrecen una prueba imposible de rendir.
- Lección con concepto, diálogo y personaje grandes; tarjetas con fundamento completo y modelos manipulables. Las 802 explicaciones y sus analogías, desarrollos y comprobaciones se conservan. La narración breve del personaje no sustituye la explicación íntegra.
- Modelo de ATP hecho en SVG: nutrientes, mitocondria y ATP para trabajo celular; responde al elemento explorado. Aclara que también hay producción fuera de las mitocondrias y que no representa una reacción completa. La reparación de errores incorpora el modelo y conserva las analogías y otro ejemplo completo.

## Activos y prompts de producción

Generados con la herramienta integrada de imágenes; exportados a WebP conservando el canal alfa. Referencia de identidad inspeccionada: `assets/gatito-sabio-poses-v1.png`. No se sobreescriben los originales.

| Activo | Prompt de producción y exportación |
| --- | --- |
| `assets/gatito-sabio-poses-v2.webp` | Conservar identidad oficial, seis bustos a igual escala en retícula 3×2: saludo, enseñanza con libro y puntero, pensamiento, celebración, ánimo y avance. Ilustración de cuento pulida, fondo verdaderamente transparente, sin texto ni elementos cruzando celdas. 1536×1024. |
| `assets/map-valley-v1.webp` | Valle lavanda vertical 9:16, pinos violetas, rocas y montañas en los bordes, pequeña cascada celeste a la derecha; centro claro y despejado para controles. Sin camino, botones, letras, números ni personajes incorporados. 768×1365. |
| `assets/subject-m1-v1.webp` | Calculadora violeta de formas redondeadas con cuatro operaciones, ilustración 3D suave, objeto centrado, transparencia y área segura. 256×256. |
| `assets/subject-m2-v1.webp` | Calculadora científica azul redondeada con pantalla x² y teclas azul/lavanda, mismo estilo y transparencia. 256×256. |
| `assets/subject-reading-v1.webp` | Libro abierto de páginas crema, lomo violeta y marcador coral, mismo estilo y transparencia. 256×256. |
| `assets/subject-history-v1.webp` | Globo azul y verde sobre soporte violeta, continentes simplificados sin fronteras políticas, mismo estilo y transparencia. 256×256. |
| `assets/subject-science-v1.webp` | Matraz transparente con líquido violeta y pequeñas burbujas, mismo estilo y transparencia. 256×256. |

Los modelos precisos permanecen en `daily-lesson-visuals.js`, `daily-demonstrations.js` y `daily-scenarios.js`; no se extraen números ni relaciones científicas de imágenes generadas.

## Límites reales

La nueva composición no constituye una revisión editorial comercial integral ni una ilustración raster distinta para cada objetivo. Siguen pendientes el cotejo completo del material adicional, más ilustraciones temáticas y la ficha/alta/publicación en Play Console. Ciencias y Lectura conservan una secuencia transversal; no se inventan equivalencias exclusivas a cursos escolares. La clave de carga existente se conserva fuera de Git.

La auditoría de todos los lectores detectó ocho desarrollos algebraicos largos de M2 que necesitaban saltos de línea en 320 px. Se conservan completos y se añade regresión sobre los ocho casos; no se reduce su contenido ni el tamaño tipográfico.
