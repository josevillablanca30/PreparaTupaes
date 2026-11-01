# ¿Cachaste? · candidata 1.5.0-rc10 / código 37

Base: `945751875b5b751b2e8d86be2fc468d71bf3f58f`, rama Android existente. Esta actualización responde al público adolescente y adulto y a la misma promesa central: aprendizaje autónomo desde las bases, tutor paso a paso, práctica, ensayos y competencia por asignatura.

## Cambios

- Portada con logo oficial compacto, proporciones conservadas y acceso al perfil. El maestro sigue presente, con su identidad aprobada y frase guía.
- Aprendizaje y competencia aparecen como dos accesos protagonistas antes de la lista de asignaturas. Las acciones abren recorridos existentes; no muestran campeonatos escolares o paneles docentes todavía inexistentes.
- Retomar la sesión utiliza el mismo motor y sus borradores; las cinco asignaturas y los cuatro modos educativos se conservan. La actividad se identifica como guardada en el dispositivo.
- Menos globos y contadores como bienvenida. Jerarquía tipográfica, tarjetas sobrias, mayor contraste y controles legibles. Se conservan los 24 gatos, las ilustraciones por materia y la paleta morada.
- Duelos con acciones en filas legibles y reglas visibles (1v1, diez preguntas, noventa segundos por pregunta).
- Liga: la posición real del estudiante aparece antes del Top 10 cuando el servidor devuelve su puesto. No se fabrica una posición para cuentas nuevas o sin participación.
- Revancha desde un resultado terminado: abre una invitación confirmable con el rival, asignatura y mención del encuentro. Usa el mismo endpoint autorizado e idempotente; no acepta por el rival ni altera resultados o estadísticas.
- Resultado: conserva revisión con el tutor y agrega acceso directo a la liga de la misma asignatura. El contenido educativo, la puntuación y las políticas del backend no se modifican.

## Verificación

Código de la candidata: `e276fd0bafd3373242db35f9ebf113c26852466b`. Commits de implementación: `1924966718736a05fa7324aacab54c5433670e45` y `b57e709813e029650d71e3cf831ede3644a17364`. El último commit hace independiente el nuevo duelo de la prueba de revancha y comprueba la posición del mentor de forma atómica durante el refresco asíncrono; no elimina casos ni reduce sus condiciones.

| Comprobación | Resultado y alcance |
| --- | --- |
| [Gate de AAB, Actions 41316451686](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41316451686) | 411 pruebas de lógica y 104 pruebas móviles aprobadas; cero fallidas e intermitentes. Dos tamaños: Android-Chrome y 320 px. Registro, correo, perfil, comunidad, UX, aprendizaje y los cinco casos nuevos de esta entrega. |
| Integración del mismo run | 24 pruebas Postgres/RLS y 22 comprobaciones HTTP aprobadas. Dos identidades Auth independientes, SMTP local, confirmación, recuperación, nickname duplicado, duelo de diez preguntas por participante, clasificación del servidor, ranking persistente, reintentos, empate, derrota y vencimiento. Backend efímero local; no demuestra entrega de Resend ni dos teléfonos conectados al proyecto alojado. |
| Backend alojado, comprobaciones de solo lectura | Proyecto `jmobinmdwrmdqrxtcruj`: health devuelve `apiVersion: 1`, `catalogueReady: true`, tanto por SQL como por el endpoint HTTP público usado por la app. Hay 802 preguntas, 346 comunas y 16 regiones; cero tablas del esquema `cachaste` sin RLS. Auth público confirma correo habilitado, registro permitido y confirmación de correo requerida. El entorno permanece `production`; no se habilitaron accesos de prueba ni se modificaron datos. Esto verifica disponibilidad y catálogo, no un duelo entre teléfonos, recepción del correo ni todas las políticas de autorización. |
| Pedagogía y secretos | 802 preguntas, cero alertas críticas y 20 avisos heurísticos existentes. Escáner de secretos aprobado. El banco, las respuestas y las políticas de autorización no cambian en esta entrega. |
| Revisión visual | Capturas renderizadas de portada en ambos tamaños, duelos, resultado, revancha y ranking. Logo con proporción oficial, controles principales visibles sobre la navegación inferior en la primera pantalla, lectura sin desbordamiento y acciones funcionales. La revisión no equivale a una medición de satisfacción o retención. |
| AAB firmado | Bundletool validate y lint release aprobados; verificación local independiente de las 258 entradas firmadas, manifiesto, SHA-256 y commit fuente. Incluye los 24 avatares. |
| [Suite ampliada, Actions 41316457573](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41316457573) | 417 aprobadas por perfil Android-Chrome, 320 px e iPhone-WebKit: 1 251 ejecuciones aprobadas. Los seis casos VS beta se excluyen por la configuración del paquete público y se comprueban aparte en el workflow APK. |
| [Paquete Android, Actions 41316451699](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41316451699) | 462 pruebas web y 12 VS beta aprobadas antes de empaquetar; cinco pruebas de acceso comercial en emulador aprobadas. La primera ejecución nativa se interrumpió al desaparecer el dispositivo del emulador (31 esperadas, solo seis finalizadas y un caso sin diagnóstico de aserción). El informe conserva ese fallo; se reejecutó únicamente el job afectado, sin cambios ni pruebas desactivadas. El reintento aprobó las 31 pruebas del APK instalado en Android 36, cero fallidas y cero omitidas. No equivale a teléfonos físicos ni compras reales. |
| Dos teléfonos físicos y correo alojado | Pendiente. No se declara experiencia «10/10» ni prueba real del correo sin observarla. |

Se revisaron dos ejecuciones iniciales fallidas y se corrigieron las causas: controles de la portada demasiado bajos en 320 px, orden del texto/imagen del mentor y sincronización de navegación de una prueba. La prueba de revancha además necesitaba un ID de encuentro nuevo y una respuesta de servidor consistente; reutilizar el encuentro finalizado provocaba volver al resultado anterior. El gate final pasó sin reintentos fallidos.

El titular verificó `auth.sitecacho.cl` en Resend y mostró guardado de SMTP en Supabase. También informó la edición manual de ambas plantillas con `{{ .Token }}`. La entrega real del nuevo correo y su verificación en la app siguen pendientes de una prueba del titular; esta sesión no puede leer esa configuración privada.

## Salida prevista

Archivo individual: `Cachaste-1.5.0-rc10-37.aab`, 12 680 180 bytes. Paquete `cl.preparatupaes.app`, versionCode `37`, versionName `1.5.0-rc10`, targetSdk `36`, sin debuggable ni testOnly. SHA-256 `813da9eeae097d08c98deb97870ea6f08ea768374693264aa400357b0f5f4f6f`. Certificado de carga SHA-256 `a566926f01e79e5f75422b5c03c91b4337018e4f7987b32888c650ca7f271575`, igual al fijado para la entrega anterior. [Artefacto firmado](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41316451686/artifacts/13087014602).

No se generó una clave nueva, no se subió a Google Play y no se publicó en producción. El archivo está preparado para subir a la misma prueba cerrada; el AAB no se instala directamente en el teléfono.

Antes de invitar al resto de testers: actualizar ambos teléfonos desde la prueba cerrada, comprobar el nuevo correo con código y el registro desde cero, crear nicknames distintos, completar una lección, enviar/aceptar un desafío, responder las diez preguntas de cada lado, comprobar resultado y ranking, revisar errores y pedir revancha. Confirmar que actualizar conserva el aprendizaje local y que la revancha requiere aceptación del rival. Los cambios de SMTP/plantillas son del servidor; no reemplazan instalar el paquete actualizado para probar esta interfaz.

Archivos modificados: `daily-app.js`, `daily-reference.css`, `competition-app.js`, `competition-ui.css`, `tests/competition.mobile.spec.mjs`, `tests/rc10-update.mobile.spec.mjs`, `android/app/build.gradle`, `scripts/verify-play-manifest.py`, `.github/workflows/android-play.yml`, `.github/workflows/android-apk.yml` y este informe. Se conserva el resto del árbol remoto y sus avances.
