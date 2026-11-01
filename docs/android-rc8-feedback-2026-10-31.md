# ¿Cachaste? 1.5.0-rc8 · comentarios de pruebas reales

## Cambios implementados

- Confirmación y recuperación por código numérico, con instrucciones en español. El diálogo conserva el correo pendiente al recargar, permite corregirlo y controla el reenvío. No guarda contraseñas ni códigos.
- Formularios independientes de registro e inicio de sesión. Mostrar contraseña no reemplaza el formulario; cambiar de formulario conserva el correo.
- El maestro saluda con calma, conserva la identidad aprobada y utiliza ilustraciones distintas para M1, M2, Lectura, Historia y Ciencias, incluyendo la espera del duelo. Sus globos no invaden las ilustraciones.
- 24 avatares felinos, con colección desplegable y filtros de estilo. Los primeros siete mantienen IDs 0–6; los nuevos usan 7–23; no cambian perfiles, progresos ni resultados existentes.
- Invitaciones y resultados pendientes se actualizan cada 20 segundos en el lobby visible. No se refrescan preguntas ni formularios de perfil. Se descartan respuestas tardías de consultas anteriores al cambiar de usuario/acción.
- Volver desde otra aplicación conserva el nickname y avatar todavía sin guardar.
- Android versionCode 35, versionName 1.5.0-rc8. La clave y el certificado fijado de carga permanecen iguales.

## Correo alojado: bloqueo pendiente

Las capturas reales muestran un correo estándar en inglés y un enlace que termina en localhost:3000. La plantilla alojada no coincide con el nuevo flujo por código.

Las plantillas `supabase/templates/confirmation.html` y `recovery.html` están en español y muestran `{{ .Token }}`. No contienen enlaces ni localhost. Están verificadas mediante SMTP local real en CI.

**Guardar estos archivos en GitHub no actualiza las plantillas de Supabase alojado.** La API de administración devuelve HTTP 401 en este entorno y el conector no expone edición de Auth. No se aplicaron cambios al Auth alojado. El propietario debe aplicar las dos plantillas siguiendo [email-code-hosted-setup.md](email-code-hosted-setup.md). El script opcional de configuración modifica solo dos asuntos y dos cuerpos; exige credenciales de administración por entorno y comprueba la lectura posterior, sin imprimirlas.

Tras aplicarlas: solicitar un correo NUEVO, comprobar asunto/código en la bandeja real, confirmar dentro de Android y repetir recuperación. Los correos antiguos no se actualizan.

## Alcance de comprobación

- Las pruebas del navegador usan fixtures identificados y aislados. No equivalen a dos teléfonos conectados al backend alojado.
- La integración usa dos cuentas nuevas, GoTrue, PostgREST, PostgreSQL y SMTP reales en un Supabase local efímero. Comprueba registro, correos con OTP, recuperación, invalidación de contraseña/sesión, duelo completo, repetición de solicitudes, estrellas, ranking y autorización. No modifica cuentas o datos del proyecto alojado.
- Se observaron dos cuentas y dos perfiles confirmados en el backend alojado en una lectura agregada. No se ejecutó un duelo real con los teléfonos de los testers.
- La app puede compilar aunque el correo alojado siga mal configurado: no considerar listo el onboarding real hasta cerrar el paso anterior.
- El navegador del entorno local no puede iniciar por restricción de sockets; la comprobación visual se ejecuta en GitHub Actions. Esto no se contabiliza como fallo funcional de la app.

## Archivos principales

`competition-app.js`, `competition-client.mjs`, `competition-ui.css`, `daily-app.js`, `daily-reference.css`, treinta SVG con arte optimizado en `assets/competition-*`, manifiesto público de assets, plantillas/configuración de correo, pruebas de UI/SMTP, configuración Android y workflows de CI. Los prompts descriptivos y destinos del arte están en `character-art-prompts.json`.

No se modificaron las preguntas, claves educativas, lógica de puntuación del servidor ni concesiones de acceso.

## Ampliación de colección

La migración `20261031224821_cachaste_cat_avatar_collection.sql` amplía exclusivamente el CHECK cosmético a avatar 0–23. Ya aplicada al backend alojado y verificada mediante lectura posterior; no altera cuentas, consentimientos, puntuación o permisos. Pruebas de base de datos comprueban los 24 valores y rechazo de -1/24, respetando el límite real de cambios de perfil. Los avisos de seguridad antes/después no cambian: INFO de tablas privadas cerradas por RLS/RPC y WARN preexistente de protección de contraseñas filtradas deshabilitada, cuya configuración de Auth requiere acceso del propietario.

### Estilos de la colección

Rapero, metalera, otaku, emo, deportista, gamer, artista, punk, gótica, skater, DJ, rockabilly, astronauta, surfista, hippie, científica, mago, cyberpunk, disco, huasa, detective, lectora, bailarín y fotógrafa. El filtro no modifica el nickname ni la selección guardada; la colección se puede desplegar desde el perfil.

### Avisos existentes de Supabase

- [Tablas privadas con RLS sin políticas directas](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy): acceso deliberadamente cerrado; la app utiliza RPC con validación de identidad, permisos y propiedad.
- [Protección contra contraseñas filtradas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection): aviso WARN previo, sin cambio en esta entrega. Requiere acceso de administración de Auth para configurar.

### Compatibilidad con correos antiguos

La confirmación propone código por defecto. Para correos que solo contienen enlace, el usuario puede elegir «Mi correo solo tiene un enlace» y copiar el vínculo dentro de la app. La app valida origen/ruta/tipo y utiliza la verificación de Supabase directamente; nunca navega a localhost. No guarda el vínculo. Es una alternativa de compatibilidad y no sustituye la activación de las plantillas en español con código visible.

## Validación de esta entrega

- Commit del código empaquetado: `40ebe2d1642697ac4d0426b6a0ac1ef579b5f75d`.
- 403 pruebas de lógica aprobadas; 74 pruebas móviles principales aprobadas en Android Chrome y 320 px.
- 22 escenarios contra Supabase/SMTP local real aprobados, incluyendo avatar 23 en perfil, duelo y ranking, rechazo de avatar 24 y dos cuentas independientes.
- 24 imágenes distintas verificadas, con 444.900 bytes de imagen WebP en total.
- Backend alojado: `apiVersion: 1`, `catalogueReady: true`; restricción de avatares 0–23 confirmada. No se declara validado un duelo físico entre los dos testers.
- [Pruebas y AAB firmado](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41250675255).
- [Pruebas del APK instalado](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41250675267).

### Bundle firmado

Archivo: `Cachaste-1.5.0-rc8-35.aab`, 12.673.622 bytes.

SHA-256: `93587d2f45838df0e6cdcc0e739975da962f9d3966e3f65cf07921f2e5d1d3a0`.

Certificado de carga SHA-256: `a566926f01e79e5f75422b5c03c91b4337018e4f7987b32888c650ca7f271575`, igual al fijado en la entrega anterior. Se verificaron localmente las 258 entradas firmadas, el manifiesto release (código 35, target 36, sin debuggable/testOnly) y la presencia de los 24 avatares en el bundle. No se generó una clave nueva.

Artefacto firmado: [GitHub Actions](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41250675255/artifacts/13060479398). El ZIP de Actions es contenedor técnico; la entrega al usuario es el `.aab` individual.

No se publicó en producción ni se modificó la rama web comercial. La subida a la misma prueba cerrada debe hacerse con el AAB y comprobarse en Google Play.

### Commits principales

- `1a1c551`: plantillas de correo españolas y verificación SMTP.
- `7dc2ff5`: maestro por asignatura, avatares felinos iniciales y flujo de confirmación.
- `10048fe`: árbol completo conservado, migración de 24 avatares y comprobaciones HTTP. Se corrigió un commit intermedio incompleto; la entrega conserva todos los archivos anteriores.
- `40ebe2d`: colección final de 24 gatos, filtros, compatibilidad con correos antiguos y pruebas de UI. La verificación previa al guardado confirmó 456 archivos y coincidencia de los hashes locales con GitHub.

La suite completa de navegador también aprobó 402 pruebas en Android Chrome y 402 en 320 px (804 ejecuciones). El job de control comercial del APK instalado aprobó las cinco materias sin activar compras.

También aprobaron las 402 pruebas en iPhone WebKit. Total de la suite completa: 1.206 ejecuciones en los tres perfiles de navegador (separadas de las 403 pruebas de lógica y las 74 del gate de release).

## Cierre de verificación · 1 de noviembre de 2026

El job Android del commit empaquetado terminó correctamente: 432 pruebas de recorrido móvil, 12 de VS beta, compilación y 31 pruebas del APK instalado en emulador API 36. El job comercial independiente también aprobó 5 pruebas de acceso a asignaturas.

La suite completa de los tres perfiles de navegador terminó correctamente en [esta ejecución](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41250680382). Hubo una ejecución duplicada de WebKit cancelada durante instalación; la cobertura de 402 pruebas de WebKit corresponde a la ejecución completa enlazada, que sí aprobó.

**Pendientes humanos:** activar las plantillas del correo alojado y verificar, tras subir el AAB a la misma prueba cerrada, un recorrido completo en los dos teléfonos: acceso, nickname, invitación, aceptación, diez preguntas por persona, resultado y ranking. Las pruebas automáticas y el emulador no se declaran equivalentes a esta comprobación física.

No se declara finalizado el onboarding de nuevos testers mientras las plantillas del proyecto alojado sigan sin aplicar. La alternativa de enlace antiguo permite confirmar dentro de la app sin navegar a localhost.
