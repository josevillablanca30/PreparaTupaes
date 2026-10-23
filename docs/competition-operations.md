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

## Respaldo y recuperación

El plan Free requiere un respaldo propio. `scripts/competition-backup.mjs` prepara un archivo de `pg_dump` cifrado con AES-256-GCM y una clave derivada con scrypt. Conserva ACLs; omitirlas puede reabrir funciones privilegiadas al restaurar. Los tokens y sesiones de Auth se excluyen: después de recuperar, los usuarios deben iniciar sesión de nuevo.

Requisitos: `pg_dump` 17 o posterior, conexión privada administrativa, certificado TLS válido, y un secreto de respaldo de al menos 32 caracteres guardado fuera del repositorio. Inyectar `CACHASTE_DATABASE_URL` y `CACHASTE_BACKUP_SECRET` como secretos del operador. Ejecutar:

```sh
node scripts/competition-backup.mjs /ruta-privada/cachaste.dump.enc
node scripts/competition-backup.mjs --verify /ruta-privada/cachaste.dump.enc
```

Conservar la clave por separado del archivo y guardar copias en un destino privado. No adjuntar un respaldo descifrado a un issue, APK o artefacto público.

Para recuperar, preparar primero un **proyecto aislado** con versiones compatibles. Descifrar por una tubería privada hacia `pg_restore`, revisar errores y comprobar conteos, autenticación, RLS, suscripciones y dos cuentas antes de cambiar la configuración de la aplicación. El descifrado puede realizarse con `node scripts/competition-backup.mjs --decrypt archivo.dump.enc`. Nunca restaurar directamente sobre producción para probar el mecanismo. La restauración de producción requiere un ensayo administrativo con sus credenciales reales; las pruebas de este repositorio verifican cifrado, integridad y recuperación exacta de bytes.

## Monitoreo

Ejecutar `supabase/monitor.sql` desde una sesión administrativa de solo lectura. Revisa tamaño total (umbral preventivo: 400 MiB), crecimiento de tablas, invitaciones vigentes y bloqueos. Vigilar también transferencia, Auth y consumo del plan en el panel de Supabase. Revisar avisos de seguridad/rendimiento tras cada despliegue. No borrar estadísticas históricas para reducir tamaño: separar detalle de respuestas de los récords permanentes con una migración revisada y respaldo previo.

El banco educativo también existe sin conexión dentro de la APK. Ocultar soluciones en la interfaz y verificar respuestas en servidor no evita que alguien dedicado extraiga ese banco o comparta respuestas. Los límites, formularios semanales y reservas mitigan abuso; una evaluación competitiva de mayor exigencia requerirá renovar el banco o un conjunto privado adicional, sin prometer invulnerabilidad.
