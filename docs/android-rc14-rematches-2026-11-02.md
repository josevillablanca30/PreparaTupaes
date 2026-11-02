# rc14 / 41 · revanchas e historial

Reporte del titular: un duelo real completado en la versión anterior; la siguiente invitación por código fue rechazada con PAIR_LIMIT. Este reporte acredita ese recorrido observado por el titular, no verificación presencial del agente ni recepción real del correo.

## Cambios

- Se reemplaza el veto de24 horas entre rivales por protección de invitación pendiente/duelo activo de la misma asignatura y mención. Un encuentro terminado permite inmediatamente otro, por nickname, código o emparejamiento.
- Se sustituye la cuota de diez invitaciones diarias por control de ráfagas de30 solicitudes/minuto. No hay cuota diaria de partidas; permanecen autorización, bloqueos, consentimiento y liquidación exactamente una vez.
- Banco finito: prioriza preguntas nunca vistas y menos recientes, evita las diez del duelo anterior si hay alternativas, y mantiene diez familias distintas por encuentro. No bloquea por haber visto el banco durante los últimos14 días. No se modifican preguntas, respuestas ni explicaciones.
- Historial privado paginado de20 encuentros, con fecha, rival, marcador, victoria/derrota/empate y acceso al resultado y revancha. Conserva los encuentros antiguos, sin inventar filas. Cursor por fecha+UUID, sin exponer encuentros ajenos.
- Sesión visible al comienzo del perfil, con cierre accesible y explicación de su persistencia al actualizar. Cerrar sesión vuelve a un login limpio y no borra progreso educativo. Reinstalar no es necesario para probar otra cuenta.
- VersionCode41 / 1.5.0-rc14. Mantiene clave de carga y estética aprobada de40.

## Verificación local inicial

412 pruebas de lógica/Postgres aprobadas. Nuevo recorrido con doce duelos consecutivos entre dos identidades aisladas, seis victorias y seis derrotas, solicitudes/respuestas repetidas sin duplicación, banco marcado como visto, rotación sin repetición inmediata y23 encuentros paginados sin saltos aun con fechas idénticas. Se comprueba aislamiento de un tercer usuario y restricción de acceso directo a la función interna. Se eliminan los cambios artificiales de fecha que antes permitían probar un segundo duelo en la integración HTTP.

Compilación web aprobada. Playwright local no pudo iniciar Chromium por la restricción de socket del entorno; no se cuentan esos intentos como pruebas funcionales aprobadas. Los mismos casos se ejecutarán en GitHub Actions, incluidos historial y cierre de sesión. Backend alojado y AAB41 pendientes al momento de este commit.

La suite nativa general de32 casos de40 seguía perdiendo el emulador durante captura; esta corrección no la declara resuelta ni elimina casos. El test final en dos teléfonos y el correo Resend real siguen pendientes.


## Backend alojado aplicado

Migración `cachaste_rematches_history` aplicada mediante la integración conectada de Supabase al proyecto existente. Inspección posterior: veto de24 horas ausente, control de ráfagas activo, función interna de historial sin permiso directo para authenticated. Se conservaron los dos encuentros existentes y el resultado terminado.

Verificación adicional en el Postgres alojado: bajo las dos identidades y sesiones existentes, pasando por la RPC con rol authenticated, se consulta el resultado antiguo, se crea/activa una revancha por código, se cancela por abandono de ambos y se crea/activa otra inmediatamente. Todo dentro de una transacción revertida: no quedan encuentros, estadísticas ni invitaciones de prueba. Esta prueba de base alojada no equivale a ejecutar Auth HTTP ni tocar ambos teléfonos.

[Integración HTTP41422677126](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41422677126) aprobada:24 comprobaciones Postgres/RLS y24 escenarios HTTP con dos cuentas Auth y SMTP local, incluida revancha inmediata sin cambiar fechas, rotación de preguntas, historial privado, resultados y ranking sin duplicación. [Respaldo/restauración41422677232](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41422677232) aprobado. Advisors posterior sin nuevos avisos de seguridad: se conservan los avisos informativos de RLS sin políticas en tablas privadas y la advertencia previa de protección de contraseñas filtradas deshabilitada. No se abren permisos de tablas.


## Gate de entrega

[Android Play41422677128](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41422677128), fuente `dfd619ef0e579a901f7b9b356a43eb13130d6969`:412 pruebas de lógica y124 pruebas móviles aprobadas sin fallos ni intermitencias; las nuevas pruebas de historial paginado y sesión se aprobaron en Android-Chrome y320 px. Integración Supabase del mismo gate aprobada. Escáner de secretos y preflight de la firma aprobados. Captura del historial de320 px revisada: marcador y fechas legibles, dos encuentros distintos con el mismo rival y acceso al resultado; el enlace de salto enfocado de la captura no es un elemento permanente del diseño.


## AAB41 firmado y entregable

`Cachaste-1.5.0-rc14-41.aab`,13 539 831 bytes. SHA-256 `f4263f3aa93b4f0a5d2a9d79d6539e79a56f5e554b14dd7e348830ac9b2ff427`. Certificado de carga SHA-256 `a566926f01e79e5f75422b5c03c91b4337018e4f7987b32888c650ca7f271575`, igual al anterior. VersionCode41, versionName1.5.0-rc14, paquete cl.preparatupaes.app, target36, sin debuggable/testOnly. Fuente `dfd619ef0e579a901f7b9b356a43eb13130d6969`.

[Artefacto firmado13129903861](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41422677128/artifacts/13129903861). ZIP descargado verificado contra SHA-256 de Actions `25248d1258514797e13597fa94ba0610b79b92ac49e857d5e376672618245876`. Verificación local independiente de las265 entradas firmadas, certificado, manifiesto y coincidencia de JS/CSS e ilustraciones WebP con la distribución construida. Bundletool y lint release aprobados en Actions. Todos los jobs del gate de AAB aprobados.

41 sustituye a40 para esta corrección. No se cargó ni publicó en Google Play; corresponde a la misma prueba cerrada y a la misma clave. El bloqueo por rival se corrige del lado del servidor y ya beneficia al cliente instalado; la presentación del historial y la sesión requieren instalar41 mediante Play.

Para comprobar correo sin borrar una cuenta existente: Perfil → Cerrar sesión → Recuperar contraseña solicita un nuevo código. Crear una cuenta desde cero requiere un correo aún no registrado. No se eliminan cuentas ni se borra progreso para forzar esa prueba. Recepción real en Resend y recorrido de41 entre dos teléfonos siguen pendientes; la observación del titular de un duelo completo en la versión anterior queda registrada arriba.

Archivos modificados en `dfd619e`: `.github/workflows/android-play.yml`, `android/app/build.gradle`, `competition-app.js`, `competition-client.mjs`, `scripts/test-competition-online.mjs`, `scripts/verify-play-manifest.py`, `tests/competition-security.test.mjs`, `tests/rc10-update.mobile.spec.mjs`, `tests/competition-rematches.test.mjs`, `supabase/migrations/20261102093602_cachaste_rematches_history.sql` y este informe. No cambian el banco educativo ni las seis ilustraciones aprobadas.
