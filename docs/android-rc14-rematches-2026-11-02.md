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
