# ¿Cachaste? · corrección de feedback real · rc11 / 38

Base remota: `72e7cca000f1a0b2dfc57c33c78bd73acf5f523d`, rama Android existente. La candidata 37 recibió feedback negativo del titular: estética plana, poco carácter competitivo, avatares masculinos poco diferenciados y recuperación que parecía exigir los campos del acceso. Esta entrega responde a ese recorrido observado, sin considerar el resultado final hasta comprobarlo con el titular.

## Cambios implementados

- Recuperación y confirmación se abren desde botones ajenos al formulario de login. Cada una tiene un formulario independiente con un solo correo. Abrirlas con email y contraseña vacíos no dispara validaciones del login. La recuperación continúa con OTP y contraseña nueva; cambiar el correo vuelve al formulario independiente. Nunca se solicita la contraseña anterior. Se conserva validación del correo y del código, sin desactivar validaciones del navegador.
- Inicio: escena con volumen, contraste y color; accesos a aprender y competir conservados. Maestro interactivo: cambio de pose por materia, consejos al tocarlo y gesto breve. Duelo: acceso protagonista a una invitación real, con las mismas reglas y autorización. El maestro reacciona al toque y acompaña cada asignatura.
- Animaciones de entrada y gesto acotadas, respetando `prefers-reduced-motion`; no modifican relojes, respuestas, estadísticas ni puntuación. No hay contrincantes ficticios ni posiciones inventadas.
- Rankings vacíos: podio decorativo sin nombres ni resultados falsos y acción al recorrido real correspondiente (evaluación, entrenamiento o duelo). “Resultados simulados” se cambia por “Aciertos del ensayo semanal” para evitar confundir el ensayo con datos ficticios.
- Avatares: doce retratos masculinos nuevos, doce femeninos conservados. Nombres completos, filtros Gatitos/Gatitas y estilos. Se mantienen los IDs 0–23 y la selección guardada, sin migrar perfiles ni aumentar el rango permitido por el servidor.
- Contenido, tutor, progreso, reglas y backend competitivo conservados. Nueva versión 38 / 1.5.0-rc11, mismo certificado de carga.

## Arte y trazabilidad

Activo: `assets/competition-avatars-male-v3.webp`, atlas raster 1448×1086, cuatro columnas y tres filas, celdas de 362 px. Generado mediante imagegen a partir de la referencia estilística del avatar rapero existente y convertido a WebP con calidad 88 para distribución; se consume como un único atlas, sin duplicar doce copias en el bundle. Las ilustraciones del maestro siguen siendo los activos oficiales existentes.

Prompt de producción: un atlas de doce retratos de gatos antropomórficos masculinos, adolescentes/adultos, rostros diferenciados, hocicos más anchos y cejas expresivas, sin maquillaje ni largas pestañas; ilustración pulida, aro morado y encuadre circular uniforme; cuadrícula exacta 4×3, sin rótulos ni números. Orden: rapero, otaku, deportista, artista / punk, DJ, astronauta, hippie / mago, disco, detective, bailarín. Pelajes, razas y caras variados. Referencia solo para estilo, sin copiar el rostro anterior.

Correspondencia del atlas con IDs persistidos: `0, 2, 4, 6, 7, 10, 12, 14, 16, 18, 20, 22`. Los otros doce IDs conservan los retratos femeninos. La interfaz hace explícitas ambas selecciones.

## Verificación

- Local: 411 pruebas de lógica aprobadas, compilación web aprobada, escáner de secretos aprobado.
- Nuevas pruebas móviles: abrir recuperación sin campos de login, correo inválido, OTP erróneo y reintento, renovación y salida de sesión, cambio de correo sin bucle, doce gatos/doce gatas con arte diferente e IDs conservados, maestro interactivo y movimiento reducido, invitación sin envío anticipado y ranking vacío con acción real.
- Prueba nativa añadida: formulario de recuperación independiente desde un login vacío en la WebView instalada. Se actualizan los casos existentes al nuevo paso explícito “Enviar código”, sin quitar sus condiciones de verificación.
- CI y AAB: evidencia detallada a continuación; quedan por cerrar la suite ampliada y la del paquete instalado.
- Correo de Resend y dos teléfonos físicos: pendientes; los fixtures y el backend efímero no equivalen a ese recorrido.

No se declara versión final, satisfacción demostrada ni “10/10”. No se publica en producción. El archivo 38 deberá probarse con ambos usuarios antes de invitar al resto de testers.


## Evidencia de la candidata

Fuente del paquete actualizado: `d562bb0643b92f12a7761ce564830beb7e17188d`. Commits de esta corrección: `ef72f46a11a640ca188153b2d90cc8c4ba53615f`, `ac5433f0f548ea2d0818e1741848f80ccdf21bd7`, `2e856ff2bc18b50898d1f534a553ce2b60f66ef6`, `21021a58c9c4ca66936a8a5bab84cef61f294fb7` y `d562bb0643b92f12a7761ce564830beb7e17188d`.

La prueba anterior de recuperación partía con el correo de login ya escrito. El nuevo recorrido comienza con ambos campos vacíos, verifica que no se dispara su validación y exige un formulario independiente. Además se prueba una solicitud real a la API controlada de la UI, recarga de la página, vuelta al correo, cancelación explícita, segunda recarga y ausencia de un diálogo reaparecido. Tras restaurar un OTP pendiente se renderiza también el formulario subyacente de recuperación; Volver y Atrás no descubren el formulario de login por accidente.

| Comprobación | Evidencia | Resultado y alcance |
| --- | --- | --- |
| Lógica y secretos | Gate del [run 41364670842](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41364670842) | 411 pruebas aprobadas, cero fallidas; escáner de secretos aprobado. |
| Recorridos móviles de salida | Mismo run | 118 aprobadas entre Android-Chrome y 320 px. Incluye los siete casos nuevos, ejecutados en ambos tamaños; cero fallidas e intermitentes. UI con respuestas de Auth controladas, sin equivalencia con correo alojado ni teléfonos físicos. |
| Integración del backend | Mismo run, job integration / supabase | 24 comprobaciones Postgres/RLS y 22 escenarios HTTP aprobados; dos identidades Auth y SMTP local en Supabase efímero. Se conserva el protocolo competitivo y la recuperación real con invalidación de contraseña y sesión anteriores. |
| Arte y presentación | Capturas renderizadas de los recorridos y revisión visual | Doce retratos masculinos y doce femeninos, IDs y selección conservados. Inicio, duelos, ranking vacío y correo independiente revisados en 320 px y Android habitual. Se comprueba contraste de los dos controles/textos ajustados frente a sus gradientes; no se declara conformidad integral WCAG. |
| Movimiento | Caso nuevo maestro interactivo | Se crea una animación real, breve y con transformaciones distintas al tocar; con movimiento reducido no se crea el gesto y siguen cambiando consejo y pose. No se sustituyó por un stub. |
| Pedagogía | Auditoría de Actions | 802 preguntas, cero alertas críticas y los 20 avisos heurísticos existentes. No se cambió el contenido educativo. |
| Suite ampliada | [Run 41364674924](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41364674924) | 424 aprobadas por plataforma: Android-Chrome, 320 px e iPhone-WebKit; 1272 aprobadas en total. Seis exclusiones de beta existentes por plataforma; publicación web omitida por tratarse de la rama Android. |
| Android instalado | [Run 41364670827](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41364670827) | 476 recorridos web y 12 casos VS beta aprobados; control comercial instalado: cinco pruebas aprobadas. El primer intento de los 32 casos nativos perdió el emulador durante el primer caso; XML y logs registran device not found y ejecución incompleta. No se cuenta como aprobado. Reejecución del job afectado en curso, sin cambiar ni desactivar pruebas. |
| AAB de la fuente actualizada | [Artefacto 13106767703](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41364670842/artifacts/13106767703) | Bundletool, lint release y firma aprobados. Verificación local independiente del archivo descargado: 259 entradas firmadas, manifiesto, fuente, JS y atlas coincidentes. |
| Backend alojado actual | Consulta de salud y agregados sin identidades | API v1 y catálogo listo. Dos cuentas verificadas con acceso vigente a la prueba cerrada; dos concesiones por correo, cero por ID de cuenta. Es evidencia de habilitación, no de un duelo entre teléfonos. |
| Dos teléfonos y correo alojado | Titular y pareja, prueba cerrada | Pendiente. No se declara recorrido final aprobado ni experiencia validada por usuarios. |

Se investigaron las ejecuciones iniciales fallidas: una regla heredada desactivaba los eventos de toque del maestro, el servidor de preview asignaba MIME SVG al atlas WebP y estilos importantes heredados impedían aplicar el contraste previsto. Se corrigieron las causas y se añadieron comprobaciones; no se forzaron clics ni se desactivaron pruebas.

Archivos modificados: `.github/workflows/android-apk.yml`, `.github/workflows/android-play.yml`, `android/app/build.gradle`, `android/app/src/androidTest/java/cl/preparatupaes/app/OfflineAppTest.java`, `assets/competition-avatars-male-v3.webp`, `competition-app.js`, `competition-ui.css`, `daily-app.js`, `daily-reference.css`, `scripts/competition-public-files.mjs`, `scripts/preview.mjs`, `scripts/verify-play-manifest.py`, `tests/competition.mobile.spec.mjs`, `tests/rc11-recovery-arena.mobile.spec.mjs` y este informe. Se verificó el árbol completo de 465 archivos y todos sus hashes contra el checkout antes de cada commit.


Archivo individual actualizado: `Cachaste-1.5.0-rc11-38.aab`, 13 089 826 bytes, SHA-256 `c302e21e7b4bcc4359566c6f0932cf555c6181c0cee1d5bb573fc0728891c670`. Paquete `cl.preparatupaes.app`, versionCode `38`, versionName `1.5.0-rc11`, targetSdk `36`, sin debuggable ni testOnly. Certificado de carga SHA-256 `a566926f01e79e5f75422b5c03c91b4337018e4f7987b32888c650ca7f271575`, igual al de las versiones anteriores. No se generó una clave de carga nueva ni se publicó en producción. El paquete incluye el retorno correcto después de recargar una recuperación pendiente y la cancelación explícita; su fuente es el commit d562 indicado arriba.

Prueba física pendiente antes de ampliar testers: subir el AAB actualizado a la misma prueba cerrada, actualizar ambos teléfonos, abrir Recuperar desde un login vacío, recibir el correo alojado y verificar su código, probar recarga y cancelación, cambiar la contraseña e ingresar con la nueva. Después: configurar nickname y avatar en cada cuenta, completar un duelo real, comprobar resultado y liga, revisar errores y pedir revancha. Probar el toque del maestro y los filtros de gatitos/gatitas en ambos teléfonos. Registrar cualquier fricción observada; esta candidata no sustituye esa comprobación.
