# Work 3 — legibilidad, UX y Android

Estado inicial comprobado el 10 de noviembre de 2026 (Chile).

- Rama Android: `e3a0434d70042afc40dccdbf6d57307a16c2e16e`.
- Rama web inspeccionada: `89b71fbc8f19750afaefd5fe15f068c521179a82`.
- PR #7 abierto, sin fusionar; no se incorporan sus archivos.
- El run `42813488596` aprobó 178 recorridos y falló 10 comprobaciones de contraste del tutor (cinco materias × Android Chrome/320 px). `signed-bundle` quedó omitido; preflight de firma e integración local sí aprobaron.
- Causa observada en código: capas de tema fijan `color`, otras fijan `-webkit-text-fill-color`; algunos contenedores del tutor conservan fondos claros mientras sus párrafos se vuelven blancos.
- La rama web tiene diferencias relevantes en `daily-reference.css`, `daily-ui.css`, `study-ui.css` y `competition-ui.css`. Se preparará una propuesta web aislada desde su cabeza remota, sin fusionar ramas de producto.
- La primera prueba local no alcanzó a abrir el navegador: Chromium del entorno rechaza `socket()` al crear ProcessSingleton. Es un bloqueo de infraestructura, distinto de los 10 fallos funcionales confirmados en CI. Se usará CI para pruebas reales y emulador cuando corresponda.

No se modifica Supabase de producción, cobros, suscripciones, testers, DNS ni despliegue. No se publica en Google Play. El AAB anterior 47 proviene de `13ae26d3f752ccc6f3de97086dee07cb938ac3fc` y no prueba estas correcciones.

La validación final, comparativas y copia editorial se añadirán aquí con resultados ejecutados.
