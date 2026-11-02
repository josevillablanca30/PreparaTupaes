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

El control de título mide ahora el rango de texto, excluyendo el padding del subrayado decorativo: el alto de la caja completa incluía diez píxeles de decoración y daba un falso fallo de salto de línea. Se conserva el umbral de una línea. Las pruebas previas de poses se actualizan a la referencia nueva y siguen comprobando materia seleccionada, texto alternativo, decodificación del arte e IDs de avatar persistidos.

Fidelidad de fondos: tres activos `assets/competition-reference-{energy,mountain,champions}-v1.webp`, creados con imagegen integrado desde la referencia y convertidos a WebP86. Prompts: reconstruir solo la energía violeta diagonal del panel central con izquierda oscura vacía, solo la montaña violeta de APRENDE y solo el trofeo con público dorado de COMPITE; eliminar letras, gatos, logos, botones e interfaz; mantener concentración de arte arriba y espacio oscuro para texto real. Fondos decorativos, sin alterar navegación ni representar resultados ficticios. La montaña anterior del recorrido educativo se conserva en su pantalla original, pero deja de sustituir la ilustración aprobada de la tarjeta de Inicio.

La ampliación del retrato de Inicio provocó desborde durante el gesto Web Animations (116/118 aprobadas, falla reproducida en ambos tamaños). Se devuelve el retrato al ancho completo de su columna sin ampliación estática; se conservan gesto y prueba de desborde. No se oculta el fallo ni se elimina el movimiento.

## Entrega firmada comprobada

Fuente del AAB: `498e57566487f92e712dc1400c9c9cc8d2990c28`. [Actions 41372740511](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41372740511): todos los jobs de salida aprobados. 411 pruebas de lógica, escáner de secretos, 118 pruebas móviles entre Android-Chrome y 320 px, 24 comprobaciones Postgres/RLS y 22 escenarios HTTP con Auth/SMTP en Supabase efímero. Esto no equivale a dos personas jugando desde teléfonos con el backend alojado.

AAB individual `Cachaste-1.5.0-rc12-39.aab`: 13 538 716 bytes; SHA-256 `36431fb6c3da393070668796fc007d433a48db557c4cb031dc5135cdb23abef1`. VersionCode39, versionName1.5.0-rc12, paquete cl.preparatupaes.app, targetSdk36, no debuggable ni testOnly. [Artefacto firmado 13109798352](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41372740511/artifacts/13109798352). Certificado de carga `a566926f01e79e5f75422b5c03c91b4337018e4f7987b32888c650ca7f271575`, sin cambio de clave.

Bundletool y lint release aprobados. Descarga verificada independientemente: ZIP SHA256, manifiesto y fuente; 265 entradas firmadas, certificado permanente coincidente y seis ilustraciones, CSS y JS idénticos al checkout. Sin VS beta local en el AAB comercial. Compilación web: 125 archivos públicos verificados.

Revisión visual de las ilustraciones integradas efectuada en capturas de 320 px: libro en Inicio, apuntando en Duelos y brazos cruzados en Rankings, energía y tarjetas ilustradas. El estado vacío de rankings conserva datos reales y no copia los nombres, fotos ni resultados del mockup. El gate final confirma el gesto sin desborde. Los activos son reconstrucciones desde la referencia; no se afirma una reproducción píxel por píxel de la captura completa.

Suites ampliadas al cerrar esta entrega: [Pages 41372744579](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41372744579) y [APK 41372740506](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41372740506) siguen ejecutándose; el job comercial instalado figura aprobado, sin contar la suite nativa general todavía pendiente como aprobada. No se ha publicado este AAB en Google Play. Correo real de Resend y duelo completo entre ambos teléfonos siguen pendientes antes de invitar al resto de testers.

Commits de implementación:

- `1013984` feat: apply approved violet and gold night arena for rc12
- `553c269` fix: retain night arena readability and visible actions on narrow phones
- `a37c1fa` ci: build signed Play candidate after interface and asset corrections
- `777b244` fix: keep Rankings title intact and master advice readable on 320px
- `8b44168` feat: match approved book, challenge and crossed-arm master portraits
- `a8288d8` test: verify approved portraits decode and subject selection remains independent
- `4ee6800` test: measure heading text separately from neon underline padding
- `ed60c4a` feat: match approved energy, mountain and champions artwork behind live UI
- `498e575` fix: contain master gesture without horizontal overflow on phones

Archivos de esta actualización:

- `.github/workflows/android-apk.yml`
- `.github/workflows/android-play.yml`
- `android/app/build.gradle`
- `android/app/src/main/java/cl/preparatupaes/app/MainActivity.java`
- `assets/competition-cat-book-v4.webp`
- `assets/competition-cat-crossed-v4.webp`
- `assets/competition-cat-point-v4.webp`
- `assets/competition-reference-champions-v1.webp`
- `assets/competition-reference-energy-v1.webp`
- `assets/competition-reference-mountain-v1.webp`
- `competition-app.js`
- `competition-ui.css`
- `daily-app.js`
- `daily-reference.css`
- `docs/android-rc12-neon-reference-2026-11-01.md`
- `scripts/competition-public-files.mjs`
- `scripts/verify-play-manifest.py`
- `tests/competition.mobile.spec.mjs`
- `tests/rc11-recovery-arena.mobile.spec.mjs`
- `tests/reference-ui.mobile.spec.mjs`

**Candidata39 sustituida:** la auditoría posterior encontró superficies del duelo con texto claro sobre fondo claro heredado. Se informó al titular y se prepara40; ver `android-rc13-readable-duels-2026-11-01.md`. El archivo39 entregado ya no es el recomendado para ampliar testers.
