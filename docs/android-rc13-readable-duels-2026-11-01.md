# ¿Cachaste? rc13 / 40 · legibilidad del recorrido competitivo

Continúa desde `ef0097644aac56ee7f34eec0987b86889e46871e`. La revisión posterior a la entrega de la candidata39 detectó una regresión del cambio a tema oscuro: alternativas, texto de lectura y algunas superficies de VS/tutor conservaban fondos claros mientras heredaban texto claro. Las pruebas anteriores comprobaban funcionamiento y visibilidad geométrica, pero no el contraste de esos textos. La candidata39 queda sustituida por la40; se informó al titular antes de continuar.

## Correcciones

- Alternativas normales y seleccionadas con superficie oscura y texto claro explícitos.
- Pasaje de lectura, nombres en VS, reglas, metadatos, código de invitación, resultados y feedback del tutor con contraste definido.
- Avisos de acceso y textos de ayuda de autenticación/diálogos coherentes con sus fondos oscuros.
- Las seis ilustraciones aprobadas, gestos, logo y composición se conservan. No cambia banco, respuesta correcta, autorización, puntuación, progresión, duelos ni rankings del servidor.
- VersionCode40 / versionName1.5.0-rc13. Firma de carga permanente conservada.

## Pruebas

Se amplían los recorridos existentes de VS, diez preguntas y victoria/derrota/empate con medición del contraste del texto realmente renderizado frente a su superficie opaca. Se comprueban alternativas antes y después de seleccionar, pregunta, metadatos, reglas, resultado y feedback. Nuevo caso con pasaje de lectura servido por la API controlada: texto desplegado, alternativas y selección, captura y recorrido móvil. Umbral4.5:1, sin quitar las verificaciones de seguridad, resultados ni solicitudes al servidor.

Compilación web local y sintaxis de las pruebas aprobadas; 125 archivos públicos. La evidencia final de Actions y AAB40 se detalla a continuación. Las comprobaciones automáticas no sustituyen correo alojado y duelo entre dos teléfonos. No se publica en producción.

Se incluye además el error de nickname duplicado, cuya caja clara podía heredar el texto claro de ayuda. La superficie de error queda oscura con texto rosa claro y se añade medición de contraste al caso existente que conserva todas las ediciones del perfil y señala el campo correcto. Se comparte el helper de contraste entre esos recorridos.

Revisión de capturas del gate de40: lectura, alternativas y resultado comprobados visualmente. Se detectó una regla antigua específica de la pantalla VS que mantenía blanca la barra inferior con etiquetas claras. Se corrige esa regla y se incluyen las etiquetas de navegación en la prueba de contraste. El helper compone fondos translúcidos y comprueba los extremos de los gradientes, en lugar de saltar las capas translúcidas hasta el body; los píxeles decorativos se revisan visualmente.

En el gate de946b434 se aprobaron119 casos y uno necesitó reintento: la comprobación antigua del gradiente evaluó un nodo que el refresco de dashboard acababa de retirar. La medición se unifica con el helper compartido; espera una muestra conectada y sigue exigiendo4.5:1 sobre los fondos compuestos. No cambia el producto, el umbral ni el caso probado. Se repite la suite para cerrar sin intermitencias.

## Candidata40 firmada

Fuente `4979f4b39172c1b35f04413450f91d6a6ff11fc1`. [Actions de salida 41375181069](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41375181069): todos los jobs aprobados. 411 pruebas de lógica, escáner de secretos, 120 pruebas móviles aprobadas sin fallos ni intermitencias, 24 comprobaciones Postgres/RLS y 22 escenarios HTTP con dos identidades Auth y SMTP local en Supabase efímero. Se mantiene la distinción frente a un duelo real entre teléfonos con el backend alojado.

`Cachaste-1.5.0-rc13-40.aab`, 13 539 098 bytes, SHA-256 `39851f8475de5e9e53bbf3c85443ccc7c33c36c97d33269b08fa2062213c2484`. VersionCode40, versionName1.5.0-rc13, paquete cl.preparatupaes.app, targetSdk36, sin debuggable ni testOnly. [Artefacto 13111047144](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41375181069/artifacts/13111047144).

Certificado de carga SHA-256 `a566926f01e79e5f75422b5c03c91b4337018e4f7987b32888c650ca7f271575`, igual al permanente anterior. Bundletool y lint release aprobados; verificación independiente del ZIP descargado, manifiesto, fuente, todas las265 entradas firmadas y coincidencia de CSS, JS y las seis ilustraciones con el checkout. Sin VS beta local en el AAB público. No se generó una clave nueva ni se publicó en producción. La40 sustituye a la39.

Capturas de preguntas, alternativas seleccionadas, VS y resultado revisadas en320 px. Las ilustraciones permanecen iguales a las de la candidata visual previa: libro en Inicio, apuntando en Duelos, brazos cruzados en Rankings, energía violeta, montaña y trofeo con público. Se verificó además visualmente la corrección de la barra inferior de VS. No se afirma conformidad integral WCAG ni identidad píxel por píxel con un mockup aplanado.

Commits de esta corrección:

- `518eca4` fix: keep questions, choices and duel results readable in the night arena
- `8df4d5d` fix: preserve readable profile errors and share rendered contrast checks
- `946b434` fix: keep VS navigation readable and measure translucent surface contrast
- `4979f4b` test: sample contrast on a connected surface after dashboard refresh

Archivos de esta corrección:

- `.github/workflows/android-play.yml`
- `android/app/build.gradle`
- `competition-ui.css`
- `docs/android-rc12-neon-reference-2026-11-01.md`
- `docs/android-rc13-readable-duels-2026-11-01.md`
- `scripts/verify-play-manifest.py`
- `tests/competition-ux.mobile.spec.mjs`
- `tests/competition.mobile.spec.mjs`
- `tests/helpers/readable-surface.mjs`
- `tests/rc11-recovery-arena.mobile.spec.mjs`

## Verificación ampliada

[Pages41375184702](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41375184702): 425 casos aprobados en Android-Chrome, 425 en320 px y 425 en iPhone-WebKit, 1275 en total. Se conservan seis exclusiones beta existentes por plataforma; publicación web omitida por ser la rama Android. [APK41375181029](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41375181029): 478 recorridos web y12 casos de VS beta aprobados; cinco controles comerciales del APK instalado aprobados.

La suite general de32 pruebas Android se interrumpió durante el primer caso al desaparecer emulator-5554; XML y UTP registran device not found y ejecución incompleta, sin stack de aserción de app. No se cuenta como aprobada. El commit `b271fa6` cambia únicamente el entorno del emulador de CI al renderer swiftshader_indirect usado por el control comercial aprobado y RAM2048 MB. Conserva Android36, Pixel2 y todos los32 casos. El código del AAB40 sigue siendo el de4979f4b; no cambia el producto ni la firma. Se repite la prueba instalada con esa configuración y se conservan los478 recorridos web ya aprobados para el mismo código de aplicación.

Las trazas de25cb42f muestran que la actividad inicia, abre el VS y llega a capture begin; no alcanza el primer callback de fotograma. La primera operación en ese intervalo era waitForIdleSync, sin plazo propio. Se sustituye esa espera global redundante por la barrera existente de dos VisualStateCallback y confirmación de frame, cada una con timeout y aserción de10 segundos; se conservan captura, verificación del archivo y todas las aserciones funcionales. Es una hipótesis de sincronización del harness, no una causa confirmada del emulador hasta repetir. No cambia el AAB40.


## Resultado del diagnóstico nativo · 2 de noviembre

[Última ejecución 41403693285](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41403693285), fuente `76ba6bf8e602ec1f9d7b83456150805c62acee94`: el control comercial instalado volvió a aprobar sus cinco casos. La suite general de32 casos volvió a interrumpirse en el primer caso de VS beta: `device emulator-5554 not found`, sin completar la suite. La traza llega ahora a `local-vs render frame 0`, después de iniciar la captura y antes de completar la primera barrera de render. Por tanto, retirar la espera global inicial NO resolvió la desaparición del emulador. No se demuestra una causa de memoria, GPU ni fallo funcional de la aplicación; no se presenta la hipótesis anterior como solución confirmada.

[Artefacto del diagnóstico 13122692005](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41403693285/artifacts/13122692005), SHA-256 del ZIP `3861072e3a1ed1b42a5038bfd9b981fc03ca22f2e41101e986e1ed42e9f04556`. Se conservan XML, informe y trazas; no se eliminó el caso fallido ni se redujo el conjunto de32 pruebas. Las capturas y sus aserciones permanecen activas. Este resultado bloquea declarar validación nativa integral, aunque los controles comerciales instalados sí pasaron.

Commits adicionales de infraestructura de pruebas, sin cambiar los bytes del producto ni el AAB40:

- `b271fa6d6797065f3e78b93a57a282cdfc25540a`: renderer y RAM del emulador.
- `25cb42f4936b148680a097a0da9319a94e1b7520`: trazas de captura, diagnósticos del host y alcance de las pruebas web.
- `76ba6bf8e602ec1f9d7b83456150805c62acee94`: espera acotada de render en capturas.

Archivos adicionales: `.github/workflows/android-apk.yml`, `scripts/run-android-installed-qa.sh`, `android/app/src/betaTest/java/cl/preparatupaes/app/LocalVsBetaTest.java` y `android/app/src/androidTest/java/cl/preparatupaes/app/OfflineAppTest.java`.

## Estado de entrega y pendientes reales

AAB40 disponible como archivo individual firmado; candidata para la misma prueba cerrada, no versión final validada en dispositivos físicos. No se realizó carga ni publicación en Google Play. La continuidad del certificado de carga se verificó, sin reemplazar la clave.

El backend de duelos/rankings no se modificó en esta corrección visual: las pruebas transaccionales con dos identidades y SMTP local aprobaron, pero no equivalen a dos usuarios conectados al Supabase alojado desde teléfonos. No se ha comprobado en esta sesión recepción real del correo Resend, registro desde cero, recuperación de contraseña y un duelo completo con resultado/ranking en dos dispositivos físicos. Esos pasos siguen pendientes antes de ampliar los testers. Tampoco se declara una puntuación UX garantizada ni equivalencia visual píxel por píxel.
