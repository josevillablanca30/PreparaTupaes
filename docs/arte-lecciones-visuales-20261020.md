# Lecciones visuales · arte y alcance

Seis escenas generadas mediante la herramienta integrada de imágenes, usando `assets/gatito-sabio-poses-v1.png` como referencia de identidad. Los originales generados se conservan fuera del repositorio; las exportaciones WebP de 960 px están integradas en la aplicación offline. No se reemplazó la mascota oficial.

## Dirección común del conjunto de prompts

Una sola escena horizontal de enseñanza para ¿Cachaste?, un único gatito negro sabio con ojos morados, moñito, cejas, bigotes largos y barba blancos; túnica morada con ribetes crema. Identidad idéntica a la referencia, ilustración artesanal de cuento chileno, expresión paciente y gesto activo. Composición clara en móvil, fondo lavanda sencillo, gato a la izquierda y material de enseñanza a la derecha. Sin texto, logotipos, ecuaciones o etiquetas pintadas, sin un segundo gato. Los diagramas, datos exactos e interacciones los dibuja el código.

## Escenas solicitadas y archivos finales

- `assets/lesson-cat-atp-v1.webp`: gato explicando en una mesa de laboratorio, señalando una maqueta simplificada de mitocondria, fichas doradas que representan transferencia y un modelo muscular; sin rayos, baterías ni fórmulas inventadas. Ilustración contextual, no diagrama científico exacto.
- `assets/lesson-cat-balance-v1.webp`: gato mostrando una balanza nivelada con fichas y cubos de madera en los platos; el código representa las igualdades y las operaciones exactas.
- `assets/lesson-cat-functions-v1.webp`: gato moviendo un marcador sobre una pista parabólica que abre hacia arriba y señalando su mínimo; sin coordenadas pintadas.
- `assets/lesson-cat-reading-v1.webp`: gato examinando un libro con lupa, marcadores y una línea destacada; trazos abstractos en las páginas, sin texto inventado legible.
- `assets/lesson-cat-history-v1.webp`: gato comparando tarjetas de documentos históricos sobre una cuerda, archivo y pluma en una mesa; ambiente de estudio del siglo XIX chileno, sin fechas inventadas, personajes reconocibles o insignias políticas.
- `assets/lesson-cat-numbers-v1.webp`: gato desplazando una ficha sobre una recta de madera sin etiquetas y manipulando grupos de cubos; los valores y operaciones se suministran por código.

## Integración pedagógica

`daily-lessons.js` vincula las imágenes por concepto, no por selección aleatoria. La ilustración de ATP no se aplica a otros contenidos de Ciencias ni la parábola a logaritmos. Hay demostraciones específicas de ATP, enteros, logaritmos, ecuación lineal, vértice, evidencia lectora y pensamiento ilustrado. El resto del banco reutiliza fundamentos y ejemplos editoriales en tarjetas breves con una actividad sobre el orden del razonamiento del ejemplo. No se declara que cada concepto tenga ya una ilustración propia o una simulación específica.

El repaso deja de usar acordeones y comparte el reproductor visual con la lección. Los estados de exploración y respuesta se guardan separados de los resultados evaluables: una actividad guiada no entrega XP, estrellas ni dominio. La comprobación del dominio permanece en problemas independientes del motor.
