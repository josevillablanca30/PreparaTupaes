# Competencia de ¿Cachaste?

## Configuración y límites

Proyecto independiente: `jmobinmdwrmdqrxtcruj`, organización Villablanca, región São Paulo. Se confirmó costo mensual de $0 al crearlo. La meta inicial es aproximadamente 200 usuarios activos; no garantiza capacidad ni sustituye vigilar las cuotas.

La aplicación usa Auth y llamadas HTTPS a una única RPC transaccional. No hay Realtime, sockets permanentes ni servidor adicional. Rankings: caché de un minuto y máximo diez líderes más posición propia y vecinos. Las invitaciones se actualizan al pedirlo o volver a la aplicación. Se usan índices de asignatura/temporada, ubicación, participante y caducidad.

Solo se distribuye una clave **publishable**. Ninguna clave `service_role`, contraseña, conexión PostgreSQL o secreto de Google Play puede colocarse en `dist`, assets Android, configuración pública o Git.

## Despliegue de datos

La migración se creó con Supabase CLI 2.121.0 y se comprueba con PostgreSQL real mediante PGlite y el trabajo de integración con un Supabase local desechable. La semilla se regenera del catálogo educativo existente:

```sh
node scripts/competition-catalog.mjs supabase/seed.sql
```

Aplicar migraciones y esta semilla desde una conexión administrativa revisada. No hay identidades, puntuaciones ni suscripciones precargadas. El esquema `cachaste` debe permanecer fuera de los esquemas publicados de la Data API. RLS está activada en todas sus tablas. La única RPC competitiva pública usa un despachador privado que comprueba usuario, sesión, permisos y suscripción.

`cachaste.settings.environment` debe ser `production`. Una suscripción `test_harness` no funciona en ese entorno. No cambiar este valor en un proyecto con usuarios reales. La prueba de dos cuentas se niega a usar URLs alojadas y destruye sus identidades al finalizar.

La comprobación pública de salud devuelve únicamente versión y disponibilidad del catálogo. Mientras falte el esquema, la interfaz muestra competencia en preparación y no presenta cuentas o resultados demostrativos.

Estado comprobado el 23 de octubre: las dos migraciones están aplicadas en el proyecto alojado. La salud HTTP devuelve `catalogueReady: true`, con 802 preguntas y 346 comunas. No hay perfiles, suscripciones ni resultados precargados. Las versiones del historial remoto se alinearon con los nombres de migración del repositorio. Los avisos informativos de RLS sin políticas corresponden al esquema privado y a su denegación deliberada de acceso directo; no se deben resolver abriendo tablas al cliente.

## Reglas comprobables

- Cuatro rankings: ensayo, Express, estrellas educativas verificadas y liga de duelos. No hay ponderación.
- Ensayo/Express: un formulario inmutable por semana, asignatura y mención, una oportunidad clasificatoria por cuenta. Mismas preguntas y límite para todos; solo se comparan categorías equivalentes. Las prácticas locales permanecen ilimitadas. Se muestran aciertos, no puntajes oficiales DEMRE.
- Duelos: diez familias de preguntas distintas, misma selección para ambos, tiempo de servidor y resolución por aciertos antes del tiempo. Invitaciones caducan en 48 horas. Las preguntas asignadas se reservan para evitar repeticiones recientes en partidas paralelas.
- Respuestas y recompensas son idempotentes. Empate: cero cambio. Victoria: +1. Derrota: −1 hasta mínimo cero. Un abandono solo otorga victoria si el rival completó la partida. Dos abandonos anulan el duelo.
- Estrellas educativas y competitivas usan tablas independientes. El progreso anterior del teléfono no se altera ni se acepta como prueba de puntos para una clasificación pública. Una comprobación verificada requiere dos familias independientes para acreditar cuatro estrellas; no se fabrican preguntas para producir una quinta.
- Las temporadas se calculan los lunes según `America/Santiago`. Los récords anteriores y las victorias históricas se conservan. Los rankings históricos no desaparecen por el vencimiento posterior de una suscripción; la decisión de privacidad del perfil sigue aplicándose.

## Autenticación y cobros

Antes del lanzamiento configurar confirmación de correo y proveedor SMTP adecuado, URL HTTPS de retorno/recuperación y política de contraseñas de al menos doce caracteres en Supabase Auth. La configuración local de pruebas no es la configuración de producción. Para Google OAuth se necesitan las credenciales oficiales; no se inventan.

El retorno de recuperación utiliza el evento verificado `PASSWORD_RECOVERY` del SDK y exige volver a iniciar sesión después de actualizar la contraseña. `authReturnUrl` permanece en `null` hasta disponer de una página HTTPS publicada y autorizada en Auth; mientras tanto la interfaz explica que el envío de recuperación está pendiente, sin simular correos ni cambios de contraseña. Probar el enlace desde el correo y desde Android antes de abrir el servicio.

Los precios ya definidos son $2.490 semanal, $7.990 mensual y $64.990 anual, con siete días de prueba sujetos a elegibilidad y posterior renovación mensual. No hay productos oficiales conectados ni cobros habilitados. Antes de conceder acceso comercial, un verificador de Google Play en servidor debe validar compra/renovación/cancelación, vincularla al UUID de Auth, guardar un hash único de recibo y actualizar `cachaste.entitlements`. El teléfono y sus metadatos no pueden modificar esa tabla.

La APK candidata sigue siendo beta. No se debe publicar como versión comercial ni habilitar acceso ficticio para sortear los pendientes. La eliminación desde Perfil exige contraseña reciente y borra la identidad competitiva en servidor; conserva el aprendizaje local. Falta configurar la URL pública de solicitud de eliminación y los enlaces definitivos de privacidad para la ficha de Play.

### Integración Google Play preparada, cobros cerrados

La biblioteca Android está fijada en 9.1.0. El puente de mensajes solo acepta el documento principal `https://appassets.androidplatform.net/assets/suscripcion.html`; nunca páginas educativas `file:`, otros orígenes ni iframes. La beta `cl.preparatupaes.app.sciencebeta` no puede iniciar compras. En el paquete comercial se requiere además compilar con `CACHASTE_PLAY_ENABLED=true`; por defecto permanece apagado.

El cliente consulta las ofertas elegibles de Google Play y usa sus precios. Solo ofrece los tres planes CLP acordados y, cuando Google lo permite, la prueba mensual de siete días. Un recibo o una compra pendiente no otorgan acceso en el teléfono. Restaurar consulta las compras y vuelve a validarlas en servidor.

Las funciones alojadas `cachaste-play` y `cachaste-play-events` están desplegadas con su propia autenticación: Auth y sesión viva para compras; firma OIDC de Google, audiencia y correo de servicio exactos para Pub/Sub. La comprobación HTTP real devuelve `ready:false` y rechaza verificaciones mientras falte configuración. `verify_jwt=false` únicamente desactiva el filtro JWT heredado de la pasarela; no omite esas verificaciones internas.

Antes de habilitar, configurar en **secretos de Edge Functions**, nunca Git ni JavaScript:

- `CACHASTE_PLAY_ENABLED=true`, solo después de configurar y probar los productos oficiales.
- `GOOGLE_PLAY_SERVICE_ACCOUNT`: JSON de una cuenta de servicio con acceso mínimo de verificación y reconocimiento de compras para `cl.preparatupaes.app` en Google Play Developer API.
- `PLAY_RECEIPT_ENCRYPTION_KEY`: 32 bytes aleatorios codificados en base64; conservar copia privada separada para recuperar los recibos cifrados. No rotar sin recifrar los recibos anteriores con la clave antigua.
- `GOOGLE_PLAY_PUBSUB_EMAIL`: correo exacto de la cuenta de servicio usada por la suscripción push autenticada de Pub/Sub. Su audiencia debe ser `https://jmobinmdwrmdqrxtcruj.supabase.co/functions/v1/cachaste-play-events`.

Crear producto `cachaste_premium`, planes `semanal` (P1W, $2.490), `mensual` (P1M, $7.990) y `anual` (P1Y, $64.990), con una oferta mensual P7D gratis cuando corresponda. Configurar notificaciones de desarrollador en tiempo real hacia Pub/Sub. Las pruebas de licencia se rechazan salvo habilitación administrativa explícita `CACHASTE_PLAY_ALLOW_LICENSE_TESTS=true`; aun así requieren una compra de prueba auténtica validada por Google, nunca un permiso inventado.

El servidor contrasta el identificador ofuscado con el UUID de Auth, consulta `subscriptionsv2.get`, reconoce la compra, cifra el token y actualiza el registro en una transacción. Un recibo queda ligado a una sola cuenta. Cancelación conserva acceso hasta vencer; retención, pausa, vencimiento y pago pendiente lo deniegan. Varias compras verificadas de la misma cuenta no se revocan entre sí. Las respuestas antiguas no pueden reactivar un recibo revocado.

La vigencia concedida se limita a doce horas desde la última verificación y al vencimiento de Google, lo que ocurra primero. Al reconectar una versión comercial se revisan recibos de más de cinco minutos; los eventos firmados vuelven a consultar Google. Si estos mecanismos no están disponibles, el acceso no se prolonga indefinidamente.

Antes del lanzamiento faltan las credenciales y los productos oficiales, una compra de licencia real, su restauración y una renovación/cancelación notificada desde Google. Las pruebas automáticas del verificador usan respuestas Google controladas y no sustituyen ese ensayo financiero. No se ha activado ninguna compra ni suscripción comercial.

## Respaldo y recuperación

El plan Free requiere un respaldo propio. `scripts/competition-backup.mjs` prepara un archivo cifrado con AES-256-GCM y una clave derivada con scrypt. El formato 2 reúne dos archivos `pg_dump` obtenidos desde una misma instantánea consistente: esquema/datos/ACLs de `cachaste` y `public`, y datos de Auth. No incluye las definiciones administradas de Auth/Storage ni roles globales: restaurarlas con permisos normales provoca errores de privilegios. Conserva las ACLs de aplicación; omitirlas puede reabrir funciones privilegiadas. Se excluyen sesiones, renovación, flujos de acceso y tablas de tokens temporales; después de recuperar los usuarios deben iniciar sesión de nuevo.

Requisitos: `pg_dump` 17 o posterior, conexión privada administrativa, certificado TLS válido, y un secreto de respaldo de al menos 32 caracteres guardado fuera del repositorio. Inyectar `CACHASTE_DATABASE_URL` y `CACHASTE_BACKUP_SECRET` como secretos del operador. Ejecutar:

```sh
node scripts/competition-backup.mjs /ruta-privada/cachaste.dump.enc
node scripts/competition-backup.mjs --verify /ruta-privada/cachaste.dump.enc
```

Conservar la clave por separado del archivo y guardar copias en un destino privado. No adjuntar un respaldo descifrado a un issue, APK o artefacto público.

Para recuperar, preparar primero un **proyecto Supabase nuevo y aislado** con Auth inicializado y versiones compatibles. El operador configura `CACHASTE_RESTORE_DATABASE_URL`, `CACHASTE_BACKUP_SECRET` y `CACHASTE_RESTORE_CONFIRMATION=RESTORE_TO_EMPTY_ISOLATED_DATABASE`, y ejecuta `node scripts/competition-restore.mjs archivo.dump.enc`. El programa rechaza destinos con identidades o tablas de aplicación existentes. Restaura datos de Auth y aplicación conservando ACLs, y limpia los antiguos tokens de recuperación/cambio de correo guardados en usuarios. Usa memoria y una lista de objetos privada temporal; no escribe un volcado de datos descifrado al disco.

Revisar conteos, contraseñas, RLS, suscripciones y dos cuentas antes de cambiar la configuración de la aplicación. Nunca restaurar directamente sobre producción para ensayar. La prueba de CI restaura realmente en PostgreSQL 17 aislado, con una identidad de Auth y estadísticas históricas de prueba; no usa el proyecto alojado. Los respaldos con recibos cifrados requieren conservar también la clave `PLAY_RECEIPT_ENCRYPTION_KEY`, separada del respaldo. La configuración de Auth/SMTP, secretos de funciones y productos de Google se configura por separado del volcado de base de datos.

## Monitoreo

Ejecutar `supabase/monitor.sql` desde una sesión administrativa de solo lectura. Revisa tamaño total (umbral preventivo: 400 MiB), crecimiento de tablas, invitaciones vigentes y bloqueos. Vigilar también transferencia, Auth y consumo del plan en el panel de Supabase. Revisar avisos de seguridad/rendimiento tras cada despliegue. No borrar estadísticas históricas para reducir tamaño: separar detalle de respuestas de los récords permanentes con una migración revisada y respaldo previo.

El banco educativo también existe sin conexión dentro de la APK. Ocultar soluciones en la interfaz y verificar respuestas en servidor no evita que alguien dedicado extraiga ese banco o comparta respuestas. Los límites, formularios semanales y reservas mitigan abuso; una evaluación competitiva de mayor exigencia requerirá renovar el banco o un conjunto privado adicional, sin prometer invulnerabilidad.
