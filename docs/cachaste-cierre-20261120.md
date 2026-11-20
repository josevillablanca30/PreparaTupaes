# ¿Cachaste? — cierre técnico preparado, sin publicación

Fecha de revisión: 20 de noviembre de 2026 (Chile).

## Alcance y control de versiones

Base recuperada del PR #22: `51ebeb7d4104b25c9c9ebe7e96ab116ff4cfdc8f`. Sus 330 commits se conservaron. Se revisaron ramas remotas, el relevo del 20 de noviembre y la discusión del PR (sin comentarios). El nuevo trabajo usa `work/cachaste-cierre-android-20261120`, PR #23, con base en la rama del #22. No se modifica ni fusiona el #22. No hay despliegue, compra, AAB ni publicación.

## Implementación

- `learning/original-engine.mjs` envuelve las funciones del motor **existente**. Las pantallas, preguntas, clases, tutor, arte y selección original permanecen. Android usa la misma referencia aprobada `8b6ab59` que la web; se conservan sus estilos, legibilidad y selector nativo de foto de perfil. Las etapas son las originales de dos preguntas; no se sustituyen por cuestionarios de diez preguntas. Diagnóstico conserva 30; Express conserva 15 y la asignatura elegida. La práctica libre e inteligente mantienen su modo y longitud originales, bajo el mismo presupuesto diario de etapas. Los informes Express/diagnóstico se reconstruyen de las respuestas confirmadas y no se pierden al cambiar de dispositivo.
- `learning/runtime.mjs` autentica mediante Supabase, recupera derechos y actividad desde el servidor y conecta el almacenamiento por usuario. Las respuestas de Básica se confirman antes de avanzar; su progreso definitivo lo escribe el servidor.
- La migración `20261120115046_cachaste_original_learning_access.sql` añade reservas, respuestas canónicas, finalización idempotente, recuperación entre dispositivos y cuota diaria chilena. Diagnóstico es único por asignatura; Express uno diario; lecciones tres etapas por asignatura. El ensayo completo y las rutas tradicionales requieren Premium.
- Las reservas originales aceptan la selección del motor aprobado, validan cada ID, contexto, asignatura/mención y familia contra el catálogo canónico privado. No aceptan claves de respuesta, corrección, puntaje, identidad ni un plan enviados por el estudiante. El cliente conserva los datos pedagógicos originales; el servidor decide cupos y resultados.
- Se conserva Duelos 2.0 y su activación atómica. Un participante sin cupos ya no vuelve a entrar a la cola ni puede abortar el emparejamiento de otro alumno Premium. Dos duelos diarios; cola o activación fallida no consumen.
- Android distingue permiso temporal de acceso Premium y Básica mediante respuesta HTTPS autenticada, identidad coincidente y reloj monotónico. Una preferencia de JavaScript no concede derechos. Premium conserva uso sin conexión únicamente dentro del permiso nativo previamente verificado y vigente; Básica sigue necesitando confirmación del servidor para sus actividades. La navegación de Básica se limita al motor diario y perfil/competencia, bloqueando ensayos por rutas antiguas.
- La pantalla Android informa los planes externos como texto plano. No tiene enlaces de contratación, WebViews de checkout, puente Billing ni dependencia Billing empaquetada. Los documentos legales se empaquetan como lectura local, conservando el texto comercial aprobado y evitando navegación al checkout.
- La copia comercial web, precios y pagos se conservan. Los puntos web de integración están apagados salvo activación explícita y aprobación. El flujo Premium anterior continúa cuando la nueva integración web está apagada.
- El origen seguro de Android conserva una copia de los datos educativos anteriores; nunca elimina las claves antiguas. La primera cuenta del dispositivo recibe el respaldo local cuando no existe documento remoto de esa clave. Los documentos remotos tienen prioridad. La migración y su persistencia deben comprobarse también en una actualización instalada real antes del lanzamiento.

## Derechos existentes: web → Supabase → Android

`cachaste_learning_access` **consulta** `cachaste.access_state()`; no lo reemplaza. En producción se comprobó por consulta de definiciones que ese resolvedor compone acceso comercial y `closed_test_until`, incluyendo beneficios por usuario y por correo confirmado. Los archivos de pagos, webhooks, precios, suscripciones y concesiones existentes no se modifican.

Se preparó un fixture exclusivamente local con esa composición de funciones para probar suscripción vigente, prueba, cancelación con periodo pagado, vencimiento, beneficio especial y tester. Los datos de estudiantes reales no se usaron como fixtures.

Una pérdida de vigencia aplica Básica solo si el resolvedor existente ya no encuentra otro beneficio. La app vuelve a consultar el acceso al iniciar actividades y al recuperar el primer plano. No se realizan pagos reales de prueba.

## Google Play: decisión y fuentes oficiales

Consultadas el 20 de noviembre de 2026:

1. [Understanding Google Play’s Payments policy](https://support.google.com/googleplay/android-developer/answer/10281818?hl=en): FAQ «Can I offer a consumption-only (reader) app» permite este modelo para cualquier app; la categoría educativa interactiva no queda excluida por ser interactiva. La definición exige no permitir compras dentro de la app.
2. La sección «Can I communicate with my users about alternative ways to pay» de esa misma FAQ permite información de compra **sin enlaces directos** en servicios de solo consumo, incluyendo el sitio escrito en texto. Esto sustenta la copia propuesta para Android. No se convierte `sitecacho.cl` en enlace ni se abre desde esa pantalla.
3. [Payments policy](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en): reglas generales de bienes digitales y prohibición de conducir a otros medios de pago dentro de flujos de compra, salvo excepciones/programas aplicables.
4. [Understanding user choice billing](https://support.google.com/googleplay/android-developer/answer/13821247?hl=en) y [países con alternativas](https://support.google.com/googleplay/answer/11174377?hl=en): Chile no está incluido en las listas consultadas. No se presupone una excepción chilena ni se inscribe la app en un programa alternativo.

Conclusión técnica: el modelo aprobado es compatible **si Android se mantiene sin compras internas ni enlaces externos de contratación**. No requiere implantar Google Play Billing para reconocer beneficios adquiridos previamente. Esta comprobación documental no equivale a aprobación de una versión por Google Play.

## Autenticación Android

Correo y contraseña utilizan el mismo proyecto, usuario y derechos que la web. Se conserva la sesión en el origen seguro. El acceso de Google exclusivo requiere retorno nativo seguro: se prepara PKCE y callback `cl.preparatupaes.app://auth/callback`, aceptando únicamente código y verificándolo en Supabase. El inicio Google usa navegador externo, nunca una WebView de Google.

El botón está **apagado por defecto**. Antes de habilitar `CACHASTE_ANDROID_GOOGLE_AUTH_READY=true`, el propietario debe autorizar la configuración del callback en la lista de redirecciones de Supabase y completar una prueba Google instalada. No se ha modificado la configuración de Auth en producción. Un retorno arbitrario o una bandera de cliente no concede Premium.

Referencias: [signInWithOAuth](https://supabase.com/docs/reference/javascript/auth-signinwithoauth), [exchangeCodeForSession](https://supabase.com/docs/reference/javascript/auth-exchangecodeforsession).

## Comandos de validación (sin publicación)

```sh
npm ci
node --test tests/original-learning-access.test.mjs web/tests/progress-db.test.mjs web/tests/mercadopago-commercial-db.test.mjs web/tests/duels2-server.test.mjs
node --test web/tests/basic-release-gates.test.mjs web/tests/basic-verified-progress.test.mjs web/tests/access-tiers-policy.test.mjs tests/web-gateway-security.test.mjs web/tests/progress-runtime.test.mjs web/tests/session-lifecycle.test.mjs
node web/scripts/test-access-tiers.mjs
node web/scripts/test-basic-completion.mjs
node web/scripts/build.mjs
node scripts/build.mjs
node scripts/build-android-access.mjs
npx playwright test --config playwright.original-access.config.mjs
```

El workflow `.github/workflows/cachaste-original-access.yml` prepara PostgreSQL 17 aislado, cuatro conexiones simultáneas y pruebas reales de reserva/finalización; luego navegador y Android. El PostgreSQL de QA solo acepta una URL local que termine en `/cachaste_qa`. No puede apuntarse accidentalmente al proyecto productivo.

## Resultados ejecutados

Sobre el commit `f7d85fa8`, ambos workflows finalizaron correctamente: [integración Android/servidor](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/44740634193) y [regresión comercial web](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/44740634024). Incluyen 27 pruebas de motor/base/regresiones, PostgreSQL 17 con cuatro conexiones simultáneas, cuatro pruebas de navegador, compilación APK debug y once pruebas instaladas en emulador Android API 35. La regresión comercial cubre acceso, recuperación, tutor, lecciones, Express, rankings y resguardos de pagos. Esto no sustituye una actualización sobre una instalación real con progreso previo ni pruebas contra staging productivo.

Se incorpora además una regresión del reintento entre dispositivos: si otro dispositivo terminó una actividad cuya respuesta de lanzamiento se perdió, se elimina la clave obsoleta y el siguiente intento puede continuar. La regresión se ejecutó y aprobó en el workflow del commit `f7d85fa8`.

## Migraciones: aplicación futura y reversión

**No aplicadas en producción.** Tras revisión y autorización, en un clon de staging de la base real:

1. Comparar versiones de migración instaladas. No volver a aplicar los archivos históricos de octubre ni reemplazar los resolvedores productivos de testers.
2. Aplicar solo las migraciones de Básica faltantes, ordenadas: prefijos `20261116`, `20261117`, `20261119080000` y la nueva `20261120115046`. Mantener todas las banderas apagadas.
3. Generar `node scripts/seed-original-learning.mjs` y ejecutar `web/supabase/original-catalog.seed.sql` en la misma base de staging. Es un catálogo derivado, regenerable y privado; no un banco nuevo.
4. Repetir pruebas con Auth de staging, suscripciones simuladas y beneficios de prueba, y comprobar las definiciones de las funciones y RLS. Validar actualización Android conservando progreso.
5. Solo con aprobación adicional de activación, habilitar en la base `original_learning_enabled` y `duel_admission_enabled`; mantener apagados los adaptadores antiguos de emisión paralela (`learning_attempts_enabled` y sus endpoints de Worker).
6. La activación web exige conjuntamente `WEB_BASIC_ACCESS_ENABLED=true`, `WEB_BASIC_EDUCATIONAL_GUARDS_READY=true`, `WEB_BASIC_ORIGINAL_ENGINE_READY=true` y la bandera de base. No habilitar comercialización ni cambiar banderas de Mercado Pago.

Reversión no destructiva preparada: `web/supabase/rollback-original-access.sql`; deshabilita las dos banderas nuevas y conserva actividades, progreso, usuarios y pagos. Restaurar también la versión web aprobada y sus banderas anteriores. No eliminar tablas ni modificar las concesiones o suscripciones para desactivar Básica.

## Preparación del AAB

El usuario autorizó generar y conservar el AAB definitivo en GitHub Actions una vez comprobadas todas las integraciones. No autorizó subir a Play Console, solicitar acceso a producción ni publicar. No se ha generado AAB: siguen vigentes los bloqueos críticos detallados abajo. Las compilaciones ejecutadas hasta ahora son APK debug.

Tras resolver los bloqueos y cerrar QA, la generación del AAB ya está autorizada:

1. Consulta de solo lectura en Play Console completada el 20 de noviembre: la vista «Todos los paquetes de aplicación» enumera siete paquetes, con máximo `47` / `1.5.0-rc20`, activo en prueba cerrada. El proyecto conserva `48` / `1.5.0-rc21`, superior al máximo cargado observado. No se cambió la versión ni se cargó un paquete. Volver a contrastar únicamente si otra sesión carga una versión antes de generar el definitivo.
2. Cotejar el certificado de carga registrado con la clave privada existente. La configuración requiere las cuatro variables `CACHASTE_RELEASE_*`; no imprimirlas ni incluirlas en Git/artefactos.
3. Ejecutar `npm ci`, `node scripts/build.mjs`, `node scripts/build-android-access.mjs`; copiar **todo** `dist/` a `android/app/src/main/assets/`. El guard de Gradle impide empaquetar el motor antiguo sin la integración de cuotas.
4. Compilar la prueba debug y ejecutar `gradle :app:connectedDebugAndroidTest -PcachasteCommercialAccessQa -Pandroid.testInstrumentationRunnerArguments.class=cl.preparatupaes.app.CommercialAccessTest,cl.preparatupaes.app.SubscriptionLeaseTest` en Android de prueba.
5. Con la autorización del AAB ya recibida: `gradle :app:bundleRelease` dentro de `android`, con las variables privadas de firma. Verificar paquete, código de versión y certificado antes de entregarlo.
6. La subida y publicación en Play Console requieren autorización separada. No iniciar ninguna pista de lanzamiento automáticamente.

## Estado observado en Play Console

Consulta autorizada de solo lectura tras «Sigue». El panel marca completados los requisitos de prueba cerrada (12 participantes y 14 días), pero aún ofrece «Solicitar acceso a producción»; no se pulsó. Producción continúa inactiva. La página de firma se consultó sin cambiar claves ni parámetros. La advertencia de Fragment 1.1.0 corresponde al paquete publicado 47; no se atribuye automáticamente a la compilación nueva ni se cambia una dependencia por ese aviso histórico.

## Bloqueos y autorización pendiente

- Completar la comprobación instalada de actualización/conservación de datos sobre una instalación previa con progreso. La instalación limpia en emulador sí pasó.
- Staging basado en el esquema productivo real y activación de migraciones/banderas: requieren aprobación; no se crearon servicios pagados ni ramas Supabase con coste.
- Google nativo está preparado pero su callback y prueba real requieren configuración autorizada; no anunciarlo como probado.
- `versionCode` comprobado: máximo cargado 47; proyecto 48. El usuario entregó el SHA-256 oficial y se recuperó el respaldo privado de firma existente, pero su única entrada no coincide. Se requiere la clave original correspondiente al certificado oficial; no cambiar ni generar claves.
- La generación del AAB y su conservación en Actions ya están autorizadas, condicionadas al cierre técnico. La subida, solicitud de acceso a producción y publicación las realizará personalmente el usuario.

No declarar listo para publicar mientras exista alguno de los bloqueos anteriores.


## Actualización de misión: autorización del AAB y bloqueos comprobados

- SHA-256 oficial de subida proporcionado por el propietario: `A5:66:92:6F:01:E7:9E:5F:75:42:2B:5C:03:C9:1B:43:37:01:8E:4F:79:87:B3:28:88:C6:50:CA:7F:27:15:75`.
- Se recuperó el respaldo privado existente y se abrió mediante keytool sin imprimir credenciales. Contiene un solo certificado: `77:97:13:CA:68:02:3F:88:1D:4D:8D:80:7F:CD:DA:32:18:2B:CD:A3:AB:A3:C8:02:A9:5C:B0:34:48:38:C5:62`. Su PEM coincide con su keystore, pero ambos difieren del certificado oficial. El respaldo y sus contraseñas permanecen fuera del repositorio y no deben incluirse en artefactos.
- `scripts/sign-android-release.py` comprueba ahora el certificado del keystore contra la huella oficial **antes de firmar o crear la salida**. Incluye `--check-key-only`; no permite sustituir la huella mediante un argumento. La ejecución real con el respaldo recuperado termina con `UPLOAD_CERTIFICATE_MISMATCH`, como debe ocurrir. No se firmó ni generó AAB.
- Consulta de solo lectura sobre el proyecto `jmobinmdwrmdqrxtcruj`: no están instaladas `public.cachaste_learning_access()`, `public.cachaste_original_learning(text,jsonb)` ni la tabla `cachaste_web.original_learning_sessions`. El paquete nuevo no está listo para operar contra ese servidor. No se modificó la base.
- La configuración de secretos de Actions no pudo inspeccionarse desde el navegador: GitHub muestra la sesión sin iniciar. No se presupone que la clave correcta exista allí ni se extraen valores de secretos.

Intervención exacta necesaria: proporcionar el keystore original cuyo certificado tenga la huella `A5:66:...:15:75`, junto con su alias y credenciales por un medio privado (o indicar el respaldo privado correcto ya guardado); y autorizar específicamente la aplicación/activación de las migraciones educativas preparadas, sin modificar pagos, suscripciones o webhooks. Primero debe completarse su validación aislada/staging y la actualización instalada con progreso. No solicitar restablecimiento de clave para resolver este incidente.
