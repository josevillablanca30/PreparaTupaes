# ¿Cachaste? rc12 / 39 · referencia neón aprobada

Continúa desde `2a30c8c019ad683706a2d4fc9072464df80a1df5`, sin sustituir el árbol del proyecto. Dirección aprobada por el titular: tríptico oscuro violeta/dorado recibido el 1 de noviembre de 2026 (`1000146915.png`).

## Implementado

- Inicio oscuro con jerarquía «Aprende. Compite. Supera.», maestro oficial de mayor tamaño, energía radial, dos caminos de igual importancia y acción competitiva dorada.
- Duelos y rankings con paneles oscuros, bordes luminosos, selección violeta con volumen, acciones de desafío doradas y navegación coherente.
- Logo existente conservado; tratamiento de color y mezcla por CSS para integrarlo sobre fondo oscuro sin reconstruir su forma. Poses oficiales, interacción del maestro y movimiento reducido conservados.
- Los efectos son decorativos y no interceptan el toque. Las lecciones conservan sus superficies de lectura; el fondo de Inicio se limita a la pantalla de entrada.
- Los nombres, fotografías y puntajes del mockup no se incorporan al ranking: la aplicación utiliza los participantes y resultados reales del servidor. No se añaden competencias de colegio no implementadas.
- Preparación de nueva candidata `39`, `1.5.0-rc12`, con la misma firma de carga configurada en Actions. El AAB 38 anterior no contiene esta estética.

## Verificado y pendiente

- 411 pruebas de lógica aprobadas; compilación web aprobada (119 archivos públicos verificados), sintaxis JS/Python y diff sin errores.
- Se amplía la comprobación móvil existente para exigir el titular aprobado y contraste de ambos controles principales. Siguen vigentes pruebas de recuperación independiente, selección de avatar, gestos, ranking vacío honesto y navegación real.
- Revisión visual de la referencia efectuada. Aún falta revisar capturas renderizadas de esta implementación y los resultados de las suites móviles/Android del nuevo commit. No se declara fidelidad visual completa ni versión final para testers.
- AAB 39: generación y firma pendientes de Actions; no se ha publicado en Google Play. Correo alojado y duelo entre dos teléfonos siguen pendientes de comprobación real.

Primera revisión renderizada: Inicio y Duelos inspeccionados en 320 px y Android habitual. Se detectó una acción principal 14 px debajo de la navegación en 320 px (116 gate aprobadas y dos fallidas), color oscuro heredado en títulos de asignatura y una unidad de tiempo cortada. Se compacta el encabezado estrecho, se corrigen las reglas de color heredadas y se conserva completa la palabra segundos. No se modifica ni relaja la prueba de visibilidad. Nueva ejecución pendiente.

Se amplía el disparo del AAB firmado a cambios de versión, interfaz y activos: una corrección visual posterior no debe dejar el artefacto de Play apuntando al commit anterior. La firma y los gates se conservan.

Segunda ejecución: gate 118/118 aprobado, integración aprobada y capturas revisadas en 320 px. Se identifica además el título Rankings cortado en dos líneas y consejo con color heredado; se ajustan la tipografía estrecha y especificidad del consejo. Se añade comprobación de título completo en una línea, sin relajar el resto del gate.

## Corrección de fidelidad de las poses

El titular pidió que los gatos fueran los de la referencia, además de la paleta. La primera implementación usaba todavía las poses previas: se corrige. Tres activos nuevos `assets/competition-cat-book-v4.webp`, `competition-cat-point-v4.webp` y `competition-cat-crossed-v4.webp`: libro en Inicio, señalando en Duelos y brazos cruzados en Rankings. Preparados con imagegen integrado usando el tríptico como objetivo de edición, fondo transparente y conversión WebP90, máximo720 px. Son reconstrucciones de alta fidelidad a partir de la imagen aplanada, no extracciones con identidad píxel por píxel. No se afirma igualdad matemática.

Prompts de producción, modo integrado, background-extraction/identity-preserve: aislar únicamente el gato de cada panel, conservar rostro negro, ojos morados, cejas/bigotes/barba blancos, moño blanco con palillo, vestuario morado/dorado y pose correspondiente; eliminar UI, texto y fondo, preservar transparencia, iluminación violeta/dorada y torso visible sin recortes. Inicio: libro morado con huella dorada. Duelos: pata apuntando hacia el observador y expresión desafiante. Rankings: brazos cruzados, expresión confiada, sin corona añadida.

Se conserva la pose de libro al tocar al maestro: cambian consejo y gesto, sin sustituir el arte por otro gato. Duelos/Rankings dejan el retrato despejado y muestran el consejo al tocar. Se retira el bloque de desafío duplicado antes del selector para respetar la jerarquía de la referencia; Desafiar sigue abriendo el mismo diálogo real. Textos de las dos tarjetas alineados con la referencia. Barras nativas e inicio de WebView oscuros con iconos claros para acompañar la superficie de entrada. Las lecciones conservan su lectura clara. Activos incluidos explícitamente en distribución web y APK. Pruebas adaptadas a las poses acordadas, conservando recuperación, gesto, invitación y datos reales.
