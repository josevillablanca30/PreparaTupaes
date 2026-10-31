# Rediseño a partir de las capturas de uso

Se conserva el proyecto, las 623 preguntas PAES, las claves, la revisión editorial y los historiales. No se copian código, personajes ni ilustraciones de Duolingo. Las capturas se usan para entender claridad de elección, progresión de misiones y acompañamiento visual.

## Cambios funcionales

- Selector con cinco tarjetas de materias; Ciencias abre cuatro opciones: Biología, Física, Química y TP. El recorrido y Express combinan módulo común con la mención seleccionada. Las sesiones ya guardadas mantienen su alcance anterior.
- Pantallas independientes para aprender, practicar, progreso y ensayos. Las lecciones ocultan el selector tradicional y la navegación inferior; incluyen pausa y recuperación. Ya no aparecen tarjetas de otras materias bajo una explicación.
- Recorrido por etapas y misiones, con niveles practicados y dominio demostrado diferenciados; selector de unidades para elegir o saltar hacia un contenido conocido. La navegación no obliga a recorrer una lista de 317 preguntas.
- M1 comienza con cinco misiones de fundamentos: cantidades, suma/resta, grupos/repartos, signos y fracciones. Son veinte comprobaciones formativas nuevas, separadas del banco PAES y de sus puntajes. Leer una tarjeta no completa una misión: hacen falta dos ejercicios distintos correctos sin pistas después del último error.
- El curso PAES M1 se ordena desde enteros y racionales hacia potencias, raíces, ecuaciones/proporciones y porcentajes, antes de los demás ejes. Las bases tienen imágenes SVG para contar, juntar, repartir, ubicar signos y representar fracciones.
- Celebración tras terminar una práctica, con progreso y XP persistentes. Completar una práctica se distingue de dominar un concepto; no se falsifica dominio por tocar un botón.
- Corrección de contraste de las barras de Android: iconos oscuros sobre fondo claro y controles dentro de los insets ya existentes.

## Gatito oficial

Se generó mediante la herramienta integrada de imágenes un atlas RGBA de seis poses, tomando como referencia exclusiva `assets/gatito-sabio-oficial.png`. Archivo del proyecto: `assets/gatito-sabio-poses-v1.png` (1536 × 1024, celdas de 512 × 512). Se conserva la referencia original.

Poses: saludo, explicación con libro y puntero, pensamiento, celebración, acompañamiento ante error y avance. Se muestran como sprites recortados por CSS, con fondo alfa; no se reutiliza la ilustración del pizarrón como única expresión. Se respetan las preferencias de movimiento reducido.

Prompt de producción utilizado (herramienta integrada, sin API de pago añadida):

> Create one transparent PNG production sprite atlas for the ¿Cachaste? Android educational app, using ONLY the exact official black wise cat character in the supplied reference. Preserve recognizable large purple eyes, white eyebrows, very long white mustache and pointed white beard, white hair topknot with wooden hair stick, purple robe with cream trim, same warm hand-painted Chilean illustrated storybook texture. This is the same character, never a different generic cat. Remove the entire classroom, book desk, logos, lettering, flag and background. Arrange SIX full-body isolated poses in a perfectly regular 3 column by 2 row grid, each pose centered within its equal cell, generous transparent margins, paws/tail/ears/hair never cut off and never crossing cells. Top-left: welcoming, open paw waving, warm smile. Top-middle: teaching with a wooden pointer, other paw holding open small purple book. Top-right: thinking, paw near chin, curious patient expression. Bottom-left: celebrating learning, both paws raised, joyful face, no objects/confetti. Bottom-middle: encouraging a student after a mistake, kneeling slightly with a gentle open paw and kind supportive face, never sad or shaming. Bottom-right: guiding the next adventure, walking confidently to the right with book tucked under arm and tail lifted. Consistent body size, proportions, palette and character identity in all six cells. Entire background genuinely transparent alpha. No text, no labels, no borders, no UI, no other characters, no Duolingo elements. It must read clearly at 120px on a phone. Sprite atlas only, six complete poses.

## Alcance real

Las seis poses son ilustraciones distintas para estados, con transiciones discretas; no son una animación esquelética continua. Las veinte comprobaciones básicas no amplían el número de preguntas tipo PAES, que sigue en 623. Todavía falta completar la cobertura de transferencia de ciertos objetivos y ampliar los recursos visuales específicos de las demás materias. No se añaden vidas, anuncios ni servicios de IA por respuesta.

## Validación del primer lote

155 pruebas de lógica aprobadas. Los recorridos diarios nuevos verifican elección de materias y mención, comienzo desde cero, imágenes, ausencia de tarjetas tradicionales durante la clase, recuperación de paso y respuesta, alternativa equivocada, pregunta diferente, dos comprobaciones antes de celebrar y conservación de XP. La regresión del selector tradicional espera a que su nueva pantalla termine de abrirse antes de medir los controles.
