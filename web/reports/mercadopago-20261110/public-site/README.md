# Continuación: dominio público y pagos cerrados

## Estado recuperado

La rama web se recuperó desde `e13183ff85fa55d7d94b87d261b06fe96d1da483`. Se conservaron las funciones Mercado Pago publicadas previamente; no se modificó ninguna rama ni función de Duelos 2.0.

El titular informó que ingresó a Cloudflare con Google y creó `CNAME @ → cachaste-sitecacho.pages.dev`, con proxy activo y TTL automático, conservando los tres registros Resend. La [consulta API de solo lectura](initial-pages-state.json), el 10 de noviembre a las **14:44 de Chile**, confirmó `sitecacho.cl` **active**, validación activa y verificación activa. `www.sitecacho.cl` figuraba desactivado.

La misma consulta mostró **cero despliegues de producción** y una preview válida de `c474b81c95bbdc0181d7ef4cda2b05c9e21d2ce1`. El navegador público devolvió “Deployment Not Found”: el CNAME del sitio principal no sirve una preview automáticamente. Esto era distinto de un problema de propagación DNS.

## Corrección guardada

[2777ab4c5d26a781c1005bd9ea2671d89ca4fd3f](https://github.com/josevillablanca30/PreparaTupaes/commit/2777ab4c5d26a781c1005bd9ea2671d89ca4fd3f) incorpora un flujo específico de publicación pública solicitado por el titular. La rama fuente sigue siendo `work/cachaste-web-unificada-20261106`; el destino principal Pages conserva su identificador histórico `production-requires-owner-approval`.

- Exige QA completa del mismo SHA y rama antes de preparar o publicar.
- Verifica que el backend real mantenga `ready=false` y `trialAvailable=false`.
- Crea claves educativas de cifrado y firma solamente para el runtime público; no modifica credenciales de Mercado Pago y conserva el runtime preview.
- Fuerza `WEB_PAYMENTS_ENABLED=false`, registro nuevo, Google y retorno Auth de apertura deshabilitados.
- Rechaza proyectos, cuentas, ramas y publicaciones canónicas ajenas, así como credenciales de producción no revisadas.
- Las previews posteriores preservan las claves públicas y no redirigen el dominio principal hacia una preview.
- Revalida exclusivamente los dominios `sitecacho.cl` y `www.sitecacho.cl` mediante Pages. No hace llamadas de escritura a DNS, zonas, correo, facturación ni planes de cuenta.

La primera candidata completó su QA, pero Cloudflare detuvo la preparación con HTTP 400, código `8000066`: al actualizar `fail_open` debe indicarse para ambos entornos. La [verificación contra la API](runtime-configuration-check.json) confirmó que ambos controles en `false`, sin reenviar las variables preview, resuelven el rechazo y conservan sus claves. La corrección definitiva se guardó en [2177d3aedbb962098de1b50ff837159f7d3e64a9](https://github.com/josevillablanca30/PreparaTupaes/commit/2177d3aedbb962098de1b50ff837159f7d3e64a9). El flujo temporal de diagnóstico fue retirado y el cliente rechaza cualquier intento de `fail_open=true`.

## Supabase y límites de Mercado Pago

La [auditoría de base de datos](database-audit.json), a las **14:56 de Chile**, confirmó cero pagos y suscripciones de producción; cero checkouts sandbox residuales; diez beneficios anuales y ninguno más corto; protección del checkout gratuito activa; cero permisos de tablas privadas para clientes; y funciones administrativas sin permiso de ejecución para `anon` ni `authenticated`.

Las [ocho comprobaciones nuevas contra endpoints alojados](hosted-boundaries.json), a las **14:54 de Chile**, fueron satisfactorias: vendedor cerrado, checkout anónimo denegado, administración sandbox anónima denegada, JWT falso rechazado, origen ajeno rechazado, ambas RPC privadas denegadas y endpoint temporal de QA retirado con 404. No se crearon usuarios temporales ni suscripciones en esta continuación.

La [evidencia anterior de 22 comprobaciones sandbox](../live-sandbox.json) sigue identificada como una ejecución anterior: no se contabilizó como una nueva prueba. El webhook real continúa bloqueado por `MP_TEST_WEBHOOK_SECRET` ausente (503). El panel Mercado Pago respondió 403 en el navegador disponible. No se acreditó entrega firmada del proveedor, aprobación interactiva del comprador ni renovación por calendario.

El asesor Supabase mantiene su advertencia previa de protección contra contraseñas filtradas deshabilitada, sin nuevos errores de seguridad. Las tablas privadas usan RLS y acceso mediado por RPC. No se modificó su esquema ni Auth.

Los diez testers identificados conservan su año gratuito sin cobros; los dos restantes todavía no tienen identidades recuperables. Se volvió a consultar el contexto previo y no se inventaron correos.
