# ¿Cachaste? — auditoría Android rc7, 30 de octubre de 2026

## Versión y trazabilidad

- Rama: `work/cachaste-motor-duolingo-20261016`.
- Se continuó desde `e64876f31bc5d2fdc18549c5725e6f35ae9d49b0`, conservando los cambios de registro de `1f78c26` y su regresión de `e64876f`.
- Código del AAB: **`8f5904cd69fca4b1de7d6a223752aa4368646195`**.
- Versión: **1.5.0-rc7 / versionCode 34**. Paquete: `cl.preparatupaes.app`; target SDK 36.
- No se modificaron contenidos educativos, ilustraciones, gatito ni progresión. No se escribieron datos ni permisos en el backend alojado. No se publicó en producción ni se subió la actualización a Google Play.

Commits de esta auditoría:

1. `526509b507551fd3f96b00ac0a6681e98d4927d9`: verificación de correo y recuperación dentro de la app, errores, sesiones, privacidad, pruebas y versión 34.
2. `271e10a70ccf1f523e57713915b14ab01fe866f8`: regresión del registro en WebView instalado y protocolo de errores Auth.
3. `bb4b5678f3bd3d9e922b0364030b07d19d3bdd7c`: respuestas Auth antiguas, exposición CORS y comprobación del mensaje visible.
4. `8f5904cd69fca4b1de7d6a223752aa4368646195`: revocación de todas las sesiones después de recuperar contraseña y rechazo de sesión anterior.

## Hallazgos y correcciones

| Hallazgo | Resultado |
| --- | --- |
| Crear cuenta validaba los campos de inicio de sesión | Se conservan formularios separados y botones de navegación con `type=button`. Se prueba abrir registro con campos de login vacíos, enviar sus propios campos y volver sin validación cruzada. Se agregó regresión nativa en WebView. |
| Recuperación bloqueada cuando `authReturnUrl` era null | Se solicita recuperación mediante Auth público y se verifica el correo dentro de la app, sin inventar una redirección web. Admite código o enlace del correo copiado sin abrirlo. |
| Mensajes genéricos de autenticación | Hay mensajes para credenciales incorrectas, correo sin confirmar, contraseña débil, límites de solicitudes y token vencido. También se contemplan respuestas antiguas sin código. Los errores de diálogos se muestran dentro del diálogo. |
| Identidad/resultados visibles después de terminar una sesión | `SIGNED_OUT` limpia identidad, acceso, ranking, duelo, intento y revisión visibles. Un `AUTH_REQUIRED` del servidor invalida la identidad local. Los recibos pendientes permanecen separados por cuenta para reintentar sin duplicar respuestas. |
| Recuperación cerraba solo la sesión local | Al cambiar contraseña mediante recuperación se pide cierre global. El servidor competitivo comprueba además que la sesión siga viva, y la integración rechaza la sesión anterior. El cierre ordinario sigue siendo local al teléfono. |
| Login heredaba la longitud mínima del registro | Se mantiene contraseña de 12 caracteres para alta/cambio; el login acepta la contraseña existente sin imponerle esa regla nueva. |
| Faltaban enlaces de privacidad dentro de la app | Perfil muestra los enlaces públicos de privacidad y eliminación de cuenta/datos ya publicados. |

El correo se recorta para eliminar espacios exteriores. El nickname sigue separado del correo y protegido por validación e índice único del servidor sin distinguir mayúsculas. Crear y editar perfil no exige comprar una suscripción. Ranking público y recepción de desafíos continúan siendo voluntarios.

## Confirmación y recuperación

La configuración pública del Auth alojado indica registro por email habilitado y confirmación obligatoria.

1. Crear cuenta con correo y contraseña de al menos 12 caracteres.
2. Revisar correo y spam. Mantener presionado el botón del correo, **copiar su enlace sin abrirlo** y pegarlo en la app; alternativamente ingresar el código si el correo lo incluye.
3. GoTrue verifica el token. La app solo admite enlaces del proyecto configurado, ruta `/auth/v1/verify` y acción correspondiente.
4. En recuperación, elegir la contraseña nueva, terminar las sesiones e iniciar nuevamente.

No se implementó apertura automática de enlaces Android ni se afirma que exista una redirección web configurada. Un enlace consumido o vencido requiere solicitar otro. La recepción en Gmail y el manejo del correo en teléfonos físicos aún requieren comprobación humana.

## Pruebas y alcance

| Ejecución | Resultado |
| --- | --- |
| Lógica local y en CI | **400 aprobadas, 0 fallidas**. |
| Verificación móvil requerida para firmar | **62 aprobadas** en Android-Chrome y 320 px. |
| Integración PostgreSQL de seguridad/comunidad/acceso | **23 aprobadas**, incluidas RLS, aislamiento, sesiones expiradas/revocadas, permisos y puntuación autoritativa. Se solapan con las pruebas de lógica; no se suman como casos independientes. |
| Auth y PostgREST reales por HTTP | **21 escenarios aprobados** en Supabase local desechable. |
| Suite pública completa | **396 aprobadas por plataforma** en Android-Chrome, 320 px e iPhone-WebKit. Seis casos de VS local se omiten por una condición preexistente en la distribución pública y se ejecutan aparte en la beta. No se desactivó ninguna prueba para obtener verde. |
| Paquete comercial instalado en emulador Android 16 | **5 pruebas aprobadas**, 0 fallidas y 0 omitidas. |
| APK beta instalado: navegación, progreso y nueva regresión de registro | **En ejecución al guardar este informe.** |
| Dos teléfonos físicos conectados al backend alojado | **Pendiente; no comprobado en esta sesión.** |

Evidencia:

- [AAB firmado y verificaciones obligatorias](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41035313600).
- [Integración independiente con Auth real](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41035313448).
- [Suite completa por plataforma](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41035313513).
- [APK y pruebas instaladas en emulador](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41035313533).

La integración crea dos usuarios mediante `auth.signUp` público, exige confirmación y comprueba que no puedan entrar antes de ella. La verificación utiliza el hash generado por GoTrue obtenido de la base desechable: **no es prueba de entrega del correo a Gmail**. No se usa `admin.createUser` para saltarse el alta.

Se prueban edición de nickname y rechazo de duplicado, invitación visible al rival, aceptación, diez respuestas por participante, resultado, estrellas, estadísticas y ranking. Cuatro partidas cubren victoria, derrota, empate y abandono. También se comprueban desafíos repetidos, recibos idempotentes, respuesta perdida/reconexión, tiempos y puntuaciones falsificados, soluciones ocultas hasta finalizar, pérdida de acceso, cambio de contraseña, rechazo de contraseña/sesión anterior, denuncias/bloqueos y eliminación de cuenta.

Estas son cuentas de fixture sobre servidores Auth/PostgREST reales; el arnés elige respuestas y controla relojes en la base local para escenarios deterministas. **No son personas jugando en dos teléfonos ni pruebas contra el proyecto alojado.** Los tests nunca permiten modificar un proyecto remoto.

Auditoría pedagógica: 802 preguntas, **0 alertas críticas y 20 avisos heurísticos de revisión**. No se cambiaron contenidos para silenciar avisos. El navegador local no pudo iniciarse por restricciones de sockets; las verificaciones móviles se ejecutaron en Actions.

La regresión de errores encontró un fixture que no exponía la cabecera de versión Auth al navegador. Se corrigieron la cabecera y su exposición CORS, conservando la comprobación del mensaje. El AAB solo se generó al pasar todas sus verificaciones obligatorias.

## Backend alojado: solo lectura

Proyecto `jmobinmdwrmdqrxtcruj`: salud `catalogueReady: true`, entorno `production` y dos autorizaciones temporales de testers vigentes. Al consultar había **0 cuentas, 0 perfiles, 0 duelos y 0 liquidaciones**. No se crearon identidades alojadas ni se fabricaron resultados.

Las 24 tablas competitivas tienen RLS y no conceden acceso directo a `authenticated`. El asesor mostró avisos informativos de RLS sin políticas en tablas privadas denegadas por diseño; no se abrieron permisos para silenciarlos. Se conservó el backend comercial web.

La configuración privada de SMTP no pudo consultarse por la API de administración (HTTP 401). No se modificaron credenciales ni ajustes de correo. La entrega efectiva a las dos bandejas debe verificarse con las cuentas autorizadas.

El escaneo de archivos versionados no detectó archivos privados de firma, bloques de claves privadas, claves secretas de proveedor ni JWT con rol de servicio. No sustituye una auditoría de todo el historial Git. Los secretos de carga se usan solo en el runner y el archivo temporal de firma se elimina.

## AAB de actualización

- **Generado y firmado correctamente** en Actions, usando los secretos existentes.
- Certificado SHA-256 de carga, igual al fijado para la versión 33: `a566926f01e79e5f75422b5c03c91b4337018e4f7987b32888c650ca7f271575`.
- Gradle `lintRelease` y `bundleRelease`: aprobados.
- Verificación criptográfica de entradas firmadas, `bundletool validate` y manifiesto real: aprobados.
- Nombre dentro del ZIP: **`Cachaste-1.5.0-rc7-34.aab`**.
- [Descargar artefacto firmado](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41035313600/artifacts/12967877760).
- SHA-256 **del ZIP**: `bcd83bf599b086d7cd02dfbd92be1557a32af474153113d976de77c07e415917`.
- El ZIP incluye el AAB, certificado público, manifiesto, verificaciones, commit y `SHA256SUMS.txt` con la huella del AAB. No incluye la clave privada.
- Artefacto disponible hasta el 29 de noviembre de 2026 según Actions.
- El entorno local se desconectó al preparar una copia adicional. No se afirma que se haya completado una descarga o verificación local adicional; la evidencia de firma corresponde al runner.

## Archivos modificados

- `competition-app.js`, `competition-client.mjs`: autenticación, sesiones, mensajes y enlaces de privacidad.
- `tests/competition-client.test.mjs`, `tests/competition.mobile.spec.mjs`: regresiones de Auth.
- `android/app/src/androidTest/java/cl/preparatupaes/app/OfflineAppTest.java`: regresión en WebView instalado.
- `scripts/test-competition-online.mjs`: altas públicas, confirmación y escenarios HTTP adicionales.
- `supabase/config.toml`: confirmación activada **solo en la configuración local de pruebas**; no cambia ajustes alojados.
- `scripts/check-release-secrets.mjs`: escaneo de archivos versionados sin imprimir valores detectados.
- `android/app/build.gradle`, `scripts/verify-play-manifest.py`: versión 34 y validación del manifiesto.
- `.github/workflows/android-play.yml`, `.github/workflows/android-apk.yml`: verificaciones y nombres de artefactos rc7.
- Este informe.

## Validación humana pendiente

La misión **no se considera comprobada en dispositivos reales** por compilar o pasar CI. El siguiente recorrido falta en dos teléfonos:

1. Descargar el ZIP, extraer el AAB y subir **34** a la misma prueba cerrada existente. No a producción.
2. Instalar la actualización desde Google Play en ambos teléfonos.
3. Registrar y confirmar las dos cuentas autorizadas; elegir nicknames distintos y habilitar desafíos y participación en ranking.
4. Crear, aceptar y completar un duelo.
5. Comprobar resultado/estadísticas y seleccionar **Rankings → Liga de duelos → asignatura jugada → Chile**. Express muestra otra categoría.
6. Repetir con una desconexión y actualización de pantalla, comprobando que no duplique respuestas ni estrellas.

No hay integración de Google Play Publisher disponible ni acceso a los teléfonos personales en esta sesión. No se necesitan contraseñas personales en el chat. La actualización no se ha enviado a Play desde aquí. Antes de invitar al resto de testers falta completar ese recorrido real.
