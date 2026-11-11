# Continuación: dominio público y pagos cerrados

## Estado actual comprobado

**[https://sitecacho.cl/](https://sitecacho.cl/)** y **[https://www.sitecacho.cl/](https://www.sitecacho.cl/)** están activos en Cloudflare Pages y resuelven por DNS público. La entrada con `www` hace la redirección canónica HTTPS 308 hacia `sitecacho.cl`, conservando ruta y parámetros. Cuenta, recuperación y navegación permanecen en el mismo origen.

Código publicado: [cd94b9e07d6da02c5bb39cb6a6e1005d3c140e45](https://github.com/josevillablanca30/PreparaTupaes/commit/cd94b9e07d6da02c5bb39cb6a6e1005d3c140e45). Despliegue inmutable: [c0645339.cachaste-sitecacho.pages.dev](https://c0645339.cachaste-sitecacho.pages.dev). La auditoría volvió a consultar la API de Cloudflare y verificó que esa revisión corresponde a la publicación canónica de producción, con ambos dominios activos y el runtime cerrado a cobros.

La [auditoría pública 42933431370](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/42933431370), completada a las **21:44 del 10 de noviembre de Chile**, ejecutó satisfactoriamente:

| Comprobación real | Resultado |
| --- | --- |
| HTTPS en Pages y dominio principal | 536/536 |
| Redirecciones canónicas de www y revisión final | 9/9 |
| Navegadores desde sitecacho.cl | 39/39 |
| Navegadores desde www.sitecacho.cl | 39/39 |
| Supabase alojado: sandbox anónimo rechazado | HTTP 401 |
| Supabase alojado: contratación de producción | ready=false |

Los 39 controles de cada dirección incluyen páginas legales y navegación, contraste de acceso/planes/recuperación en cuatro perfiles, y tres comprobaciones legales sin JavaScript. No representan teléfonos físicos ni sesiones autenticadas contra Supabase alojado. Evidencia: [public-http.json](public-http.json), [legal-live.json](legal-live.json), [legal-live-www.json](legal-live-www.json), [public-dns.json](public-dns.json) y [billing-evidence.json](billing-evidence.json).

La [QA 42933431371](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/42933431371), correspondiente al código de validación [89b71fbc](https://github.com/josevillablanca30/PreparaTupaes/commit/89b71fbc8f19750afaefd5fe15f068c521179a82), terminó con todos sus jobs aprobados: **403 pruebas de lógica, 169 de backend/seguridad y 208 de navegador** —52 por perfil—, además de la integración HTTP local de Auth/PostgREST. La revisión publicada `cd94b9e` había aprobado su propia [QA 42880083500](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/42880083500), con 403/168/208. Los commits posteriores ajustan la verificación; no se atribuye a producción una revisión que no se haya desplegado.

El contraste del formulario de acceso se corrigió conservando contenido y composición. [Antes](account-contrast-before.png), [después](account-readable.png) y [portada comprobada entrando desde www](sitecacho-public.png).

No se modificó DNS ni Resend durante esta continuación. El titular resolvió los registros en su cuenta. Las auditorías finales son de solo lectura y no vuelven a publicar ni cambian claves. Los cobros reales, el registro nuevo, Google y su retorno de apertura permanecen deshabilitados; el acceso existente por correo y contraseña se conserva.

## Duelos 2.0: revisión separada

Se revisó el PR [#7](https://github.com/josevillablanca30/PreparaTupaes/pull/7) siguiendo `docs/duels2-integration.md`. La combinación con la web estable fue limpia y se guardó en [169f9514](https://github.com/josevillablanca30/PreparaTupaes/commit/169f95143a801d265e1099ae3ded658cb848a69b), rama `work/cachaste-duels2-integration-20261111`.

La candidata pasó **182 pruebas locales** y la autenticación/descifrado del HTML de competición construido, con WSS limitado al Supabase indicado en ambas CSP. Su [informe de revisión](https://github.com/josevillablanca30/PreparaTupaes/blob/169f95143a801d265e1099ae3ded658cb848a69b/reports/duels2-integration-20261111/README.md) distingue las pruebas pendientes. La CI combinada [42934538098](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/42934538098) todavía está en curso al guardar este informe.

La [lectura real de preparación](duels2-readiness.json), a las 21:45 de Chile, confirmó que Duelos 2 no está instalado, Cron está deshabilitado y no hay tablas Duelos 2 publicadas. Publicar ahora el adaptador del PR sin instalar su RPC rompería ese recorrido; no se activó en la web estable ni se aplicó su migración al proyecto compartido. Siguen pendientes su migración, mantenimiento sin clientes, Realtime alojado con dos identidades de prueba y Android instalado.

## Historial de correcciones y fallos conservados

- La primera publicación `2177d3a` pasó 268 controles en Pages y 265 en el dominio propio, pero falló tres contactos legales por la transformación automática de correos de Cloudflare. [Resultado original](pages-public-attempt-2177.json). `e9955e9` mantuvo los contactos legales públicos utilizables sin JavaScript; [536 controles HTTPS](pages-public-e995.json) y [27 legales](legal-live-e995.json) pasaron.
- La revisión visual detectó después texto claro sobre la tarjeta blanca de acceso. `cd94b9e` corrigió las superficies de acceso, planes y recuperación. Su publicación quedó subida, pero la primera comprobación ampliada agotó tres esperas de red: [intento original](legal-live-attempt-cd94.json).
- El [diagnóstico de solo lectura](legal-readonly-attempt-81e2.json) mostró `page.goto: Timeout 20000ms exceeded`, con el formulario ya visible y cero muestras de contraste medidas. Se sustituyó la espera global de red por la espera del encabezado visible, manteniendo las mismas exigencias de contraste. La auditoría final de 78 comprobaciones sí se ejecutó y pasó.
- La primera comprobación de www esperaba contenido directo y recibió la redirección canónica existente. Se conserva [ese intento](public-http-attempt-1682.json). La prueba definitiva exige la redirección exacta al origen correcto y comprueba su contenido final; no se eliminó la canonicalización.
- El navegador y el DNS locales del entorno de ejecución no estuvieron disponibles. Sus intentos no cuentan como aprobados; la navegación y el DNS públicos anteriores se comprobaron desde GitHub Actions y la web también se inspeccionó directamente en el navegador remoto.

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
