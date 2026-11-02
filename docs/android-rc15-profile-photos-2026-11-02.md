# rc15 / 42 · foto de perfil opcional con infraestructura gratuita

Continúa desde d2a27b7. La organización conectada de Supabase se comprobó en plan free; no se modifica facturación ni se contrata un servicio.

## Implementación

- Foto opcional; los24 gatitos/gatitas se conservan como alternativa y fallback si una descarga falla.
- Selección JPG/PNG/WebP de hasta12 MB, recorte central cuadrado y vista previa circular. Canvas en el dispositivo genera WebP256×256 de hasta32768 bytes. No se sube el archivo original, su nombre ni sus metadatos EXIF/GPS. Confirmación explícita de visibilidad pública antes de subir.
- Una ruta fija por usuario en un bucket exclusivo, límite de32 KB y MIME image/webp. No se guardan álbumes ni versiones antiguas. Cache-Control3600 y URL versionada por la fecha del servidor. No se usan transformaciones de imágenes de pago.
- RLS restringe INSERT/UPDATE/DELETE al dueño y a su única ruta; sesión viva, perfil y reglas de comunidad requeridos para subir. La fecha del último upload se registra en el servidor y bloquea otra subida durante siete días, incluso después de quitar la foto o recrear el perfil. Quitarla está permitido en cualquier momento.
- La foto pública aparece en perfil, duelos, historial y rankings. Un perfil bloqueado no devuelve referencia a su foto. URLs limitadas al proyecto configurado; no se aceptan URLs remotas proporcionadas por usuarios.
- El borrado desde perfil/cuenta usa la API de Storage para eliminar también el archivo; nunca se borran filas de Storage por SQL dejando bytes huérfanos. La foto puede denunciarse como contenido inapropiado mediante las opciones existentes.
- Android abre ACTION_OPEN_DOCUMENT solo desde la página propia de competencia y devuelve únicamente una URI content de JPG/PNG/WebP seleccionada por el usuario. Sin permiso global de galería, sin cámara y sin permisos nuevos.
- Formularios de foto y perfil independientes; se conservan ediciones pendientes al abrir/subir una foto. Se amplía la política de privacidad fuente con la finalidad, visibilidad, retención y eliminación de fotos opcionales.

## Presupuesto gratuito

Supabase Free:1 GB de almacenamiento; transferencia5 GB en caché y5 GB sin caché. Fuentes oficiales consultadas el2 de noviembre: https://supabase.com/docs/guides/platform/billing-on-supabase y https://supabase.com/docs/guides/storage/serving/bandwidth .200 miniaturas al máximo ocupan6 553 600 bytes (~6,6 MB), sin contar metadatos. Es una estimación de capacidad, no garantía de tráfico ilimitado: la cuota se comparte con el resto de la organización. No se habilitan cobros ni upgrades.

## Verificación inicial

414 pruebas locales de lógica aprobadas. Nuevas pruebas Postgres/RLS: tamaño y MIME, ruta única, acceso ajeno rechazado, cooldown real, eliminación sin reiniciar el plazo, recreación de perfil sin bypass y renovación tras siete días. URL externa/referencia bloqueada rechazada. La simulación de tablas Storage en PGlite verifica políticas; no se presenta como transferencia HTTP real.

Se habilita Storage en el Supabase efímero de CI para probar además upload/read/remove/reupload mediante SDK y HTTP reales, incluidas denegaciones por usuario ajeno/ruta/cooldown. Nuevo recorrido móvil prueba archivo inválido, compresión a256px, vista previa, consentimiento, publicación, cambio bloqueado y eliminación. Compilación y escáner de secretos aprobados.

En el primer commit quedaban pendientes backend alojado, API real, AAB42 y publicación de política/declaración de datos. Su estado final se documenta a continuación. No se declara probado en teléfono físico. La pérdida del emulador general32 de la entrega anterior se mantiene como pendiente y no se oculta.


## Corrección tras la primera integración

La primera prueba HTTP de Storage falló con28000 al finalizar la primera carga. La simulación de RLS había pasado, lo que confirma por qué no reemplaza la API real. Se cambia el registro de carga para usar el owner_id asignado por Storage, verificar su ruta y conservar el bloqueo de siete días bajo un advisory lock, en lugar de exigir el JWT del usuario en la conexión interna de finalización. Las políticas de acceso siguen verificando la sesión del cliente. El gate móvil falló únicamente en el test nuevo al intentar fetch de una URL blob bloqueada por connect-src: se mantiene la CSP y se verifica la miniatura decodificada y el resultado del compresor sin añadir permisos de red al producto. Se repiten ambos gates; no se elimina ninguna prueba.

La política pública quedó publicada en su versión3 mediante Sites, fuente043bc5cb3bb6b415367c0c3daf74fee7d6f49942, en https://cachaste-privacidad.jose-villablanca-hor.chatgpt.site/privacidad . Se preserva su audiencia pública y sus páginas de eliminación de cuenta; no se crea otro sitio ni se modifica la web comercial.


## Verificación final de backend y gate

Fuente corregida `a3965917c53976bf293caa60f418558b7332f563`. [Gate Android Play41428212526](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41428212526):414 pruebas de lógica y126 móviles aprobadas sin fallos ni intermitencias. [Integración del mismo gate](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41428212526/job/125219915478):27 comprobaciones Postgres/RLS aprobadas y Storage HTTP real aprobado. Se mantienen las pruebas Auth/OTP, duelos completos, revanchas, historial y rankings, sin desactivar casos. No se confundieron los fallos iniciales con una implementación aprobada.

Migración aplicada al backend alojado después de aprobar la API real y publicar la política. Bucket exclusivo público, image/webp,32768 bytes por archivo; sin objetos ni fotos de usuarios generados por el agente. RLS y funciones privadas verificados. Advisors:32 avisos informativos de tablas privadas con RLS sin políticas (uno nuevo corresponde a la tabla privada de fotos, sin grants al cliente), y la advertencia previa de contraseñas filtradas deshabilitada. No se habilita un plan pagado.

La declaración de Seguridad de los datos en Google Play debe actualizarse para reflejar la foto opcional antes de distribuir esta función. No se editó Play Console ni se publicó una versión de producción. El selector Android está implementado y se valida su compilación; la elección y carga de una foto en un dispositivo físico aún debe comprobarse en el piloto. No se afirma que las pruebas web sustituyan esa comprobación.


Revisión visual del gate aprobado: la foto y sus controles se ven correctamente en320px y se conserva el nickname sin guardar. La captura detectó además dos superficies heredadas de la transición al tema oscuro: las reglas de comunidad y el aviso de éxito seguían claros con texto poco contrastado. Se corrigen sus fondos/textos y se añaden mediciones de contraste4.5:1 al recorrido de fotos; se reconstruye42 antes de entregarlo. El primer42 firmado no se presenta como archivo final.


El control comercial instalado de Android36 aprobó sus cinco casos en la fuentea396591 (MainActivity con selector nuevo). La ejecución general de APK de esa fuente fue cancelada por el avance de rama durante su gate web, no se cuenta como aprobada. La corrección de contraste posterior no cambia Java, esquema ni permisos. Fuente candidata de entrega:eac0a781f7f70490a4411a859226298acea2e1a1; su AAB se reconstruye y verifica antes de adjuntarlo.


[Gate final41429178678](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41429178678), fuenteeac0a781f7f70490a4411a859226298acea2e1a1:414 pruebas de lógica y126 móviles aprobadas, incluidas las nuevas mediciones de contraste del aviso de foto y reglas. Integración del gate nuevamente aprobada:27 comprobaciones Postgres/RLS y25 escenarios HTTP. La foto en la captura de prueba es una imagen sintética de color, no una fotografía de ninguna persona. El archivo firmado inicial de la fuentea396591 no se entrega; se sustituye por la reconstrucción del mismo versionCode42 con las correcciones de contraste.


## Entregable firmado verificado

`Cachaste-1.5.0-rc15-42.aab`,13 542 885 bytes. SHA-256 `ff37c73a82947beb087330dc9f8e5e710a9907b8056079bfcd86771ea081ce5b`. Misma firma permanente SHA-256 `a566926f01e79e5f75422b5c03c91b4337018e4f7987b32888c650ca7f271575`. VersionCode42 / versionName1.5.0-rc15 / paquete cl.preparatupaes.app / target36, sin debuggable ni testOnly. [Artefacto13134056551](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41429178678/artifacts/13134056551).

Verificación independiente del ZIP descargado, SHA-256 `ea044cd2a845b06e75770398302ccc7ace48a3adc7e67e797bf52a7c5739ff67`; fuente eac0a781f7f70490a4411a859226298acea2e1a1;265 entradas firmadas; JS/CSS e ilustraciones iguales al checkout construido; HTML/CSP iguales salvo el meta build-revision local frente al SHA de Actions, comprobado explícitamente. Bundletool y lint release aprobados en el gate. Captura final320px revisada con reglas y aviso legibles. No se crea ni sustituye una clave de carga.

Estado de comprobación: implementado y desplegado el backend; probados RLS, transferencias Storage HTTP y recorrido móvil en navegador; compilado Android y verificada firma. No se declara probado el selector del teléfono ni la carga desde dos dispositivos físicos. La app no se publicó en producción ni se subió automáticamente a Play. La candidata42 debe ir a la misma prueba cerrada después de actualizar su declaración de datos.

Consulta oficial para la declaración: https://support.google.com/googleplay/android-developer/answer/10787469 . La nueva foto opcional sale del dispositivo y debe reflejarse como Fotos en el formulario; la app permite usarla sin subir una foto y solicita confirmación de visibilidad pública. Se usa para personalizar la cuenta y mostrar el perfil en duelos/rankings, sin publicidad ni análisis facial. No se solicitó permiso amplio READ_MEDIA_IMAGES/READ_MEDIA_VIDEO.

Commits: c1aff9e (implementación de fotos/selector/política y pruebas), a396591 (finalización por owner de Storage y verificación bajo CSP), eac0a78 (contraste de reglas y avisos). Los cambios incluyen `.github/workflows/android-play.yml`, `.github/workflows/competition-integration.yml`, `android/app/build.gradle`, `android/app/src/main/java/cl/preparatupaes/app/MainActivity.java`, `competencia.html`, `competition-app.js`, `competition-client.mjs`, `competition-ui.css`, `scripts/test-competition-online.mjs`, `scripts/verify-play-manifest.py`, `tests/helpers/competition-db.mjs`, `tests/rc10-update.mobile.spec.mjs`, `tests/competition-photos.test.mjs`, `supabase/migrations/20261102100559_cachaste_profile_photos.sql`, `publication/legal/privacidad.html` y este informe.

El control comercial instalado de la fuente finaleac0a78 también aprobó sus cinco casos en [APK41429178593](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41429178593). Su suite general aún estaba en el gate web al cerrar este informe, por lo que no se cuenta como validación nativa general ni como prueba del selector de archivos.
