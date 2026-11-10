# Duelos 2.0 — integración aislada

Rama exclusiva: `work/cachaste-duelos-2-20261110`.
Base web: `1b54a0789b81a120a3593af5ffbd32933360e3ee`.
Base Android: `e3a0434d70042afc40dccdbf6d57307a16c2e16e`.
La presentación web conserva su referencia Android aprobada `685e9ecc`.

## Resultado implementado

- Humanos primero; búsqueda de 10 segundos medida por servidor, con rival virtual identificado como respaldo.
- Banco PAES existente: 10 preguntas iguales, familias distintas, orden diferente por participante. M1, M2, Lectora, Historia y las cuatro menciones de Ciencias.
- 40 minutos compartidos desde la activación. Sin límite individual por pregunta ni desempate por velocidad.
- Cada acierto suma dominio al autor y cada error al rival. Tras 20 respuestas, el dominio suma 20 puntos entre ambos participantes. A = aciertos A + errores B; B = aciertos B + errores A.
- Las diez preguntas de cada persona se conservan aunque la otra termine primero. Pantalla de espera con barra actualizada.
- Victoria/derrota humana ±3; virtual ±1; empate 0; saldo mínimo cero. Se conserva el ranking existente por comuna, región y Chile, incluyendo estadísticas semanales e históricas.
- Libro de movimientos privado con delta solicitado, delta efectivo y saldo posterior; clave única por duelo/persona/temporada. Los reintentos conservan su UUID.
- Planes de bots privados, predefinidos al activar, con tres niveles, errores y tiempos de 20–90 segundos según materia. No reciben ni consultan las respuestas humanas. No usan IA.
- Historial combinado con los duelos anteriores: totales, victorias, derrotas, empates y paginación común sin duplicar encuentros.
- Revancha con preguntas nuevas cuando el banco lo permite; para humanos requiere aceptación del rival; para bots comienza directamente.
- Abandono/expiración marca pendientes sin responder y pierde frente a quien completa. Si ambos abandonan, no cambian las estrellas. El tutor incluye también las preguntas sin responder.
- Repaso completo: alternativa elegida, correcta, texto/estímulos, distractores, Paso a paso, Más fácil y Otro ejemplo.
- Las fotos y avatares originales se conservan con el mismo renderizador. Los movimientos se limitan a la barra y transiciones de texto. Se respeta `prefers-reduced-motion`.

## Aislamiento y compatibilidad

La API nueva es `public.cachaste_duels2`. Sus tablas están en el esquema privado `cachaste_duels2`. Reutiliza perfiles, banco, restricciones comunitarias, bloqueos, autenticación y saldos competitivos existentes.

No reemplaza `cachaste.dispatch`, `cachaste.premium`, el motor académico ni funciones de pago. Las identidades de partidas/intentos antiguos se derivan a su API anterior; conservan sus reglas y repaso. Las versiones anteriores y Duelos 2 mantienen colas separadas durante la transición, pero comparten el ranking de duelos.

No se cambió Mercado Pago, suscripciones, privilegios premium, accesos gratuitos, archivos de despliegue de Work 1 ni ramas ajenas. No se escribió ni desplegó nada en producción.

## Realtime y privacidad

Solo `public.cachaste_duels2_live` se añade a la publicación: `id`, `creator`, `opponent`, `balance`, `status`. No contiene preguntas, alternativas, aciertos, progreso del rival, actor de la respuesta, marcas horarias ni contadores de eventos.

RLS exige ser participante y mantener una sesión Auth vigente. Las tablas privadas no conceden acceso directo a clientes. Los resultados y soluciones solo se entregan mediante la API verificada. Los eventos disparan una lectura del agregado autorizado, evitando aplicar mensajes antiguos o fuera de orden. El cliente conserva una alternativa seleccionada durante la actualización de barra.

Hay recuperación automática mediante consulta cada 2 segundos si Realtime se desconecta. Se muestra «En vivo» únicamente cuando el canal está suscrito; de lo contrario, «Actualizando» o «Reconectando».

## Integración de base de datos — responsable del lanzamiento

1. Revisar y aplicar una única migración: `web/supabase/migrations/20261110130920_cachaste_duels2_isolated.sql`. Es idempotente y se probó reaplicándola. Requiere las migraciones competitivas y comunitarias existentes.
2. Confirmar que `public.cachaste_duels2_live` pertenece a `supabase_realtime` y que ninguna tabla privada de Duelos 2 pertenece a esa publicación.
3. Habilitar mantenimiento periódico con `duels2/operations.sql`, revisado por el responsable del lanzamiento. La inspección inicial encontró `pg_cron` disponible pero desactivado. No se habilitó aquí. Si ya existe Cron al aplicar la migración, esta registra el trabajo dedicado automáticamente.
4. Conservar el trabajo `cachaste-duels2-maintenance` cada minuto. Si se usa otro scheduler, llamar solo desde servidor a `public.cachaste_duels2_maintenance()` con `service_role`. Clientes autenticados y anónimos no tienen permiso.
5. En la web, permitir **únicamente** `wss://jmobinmdwrmdqrxtcruj.supabase.co` en `connect-src`, tanto en la política de `web/server/gateway.mjs` como en la etiqueta CSP de `competencia.html` que produce el build. Actualmente ambas políticas permiten HTTPS y bloquean WSS. Work 2 dejó esos archivos de lanzamiento intactos. El fallback funciona, pero este ajuste es necesario para verificar el transporte Realtime real.
6. Validar en un entorno de integración dos cuentas reales de prueba, revocación, Realtime, scheduler sin clientes abiertos y acceso desde el APK antes de habilitar la experiencia pública.

El script de mantenimiento afecta exclusivamente tablas de Duelos 2 y sus estrellas cuando corresponda. No debe aplicarse una migración o función de otro Work para instalar esta entrega.

## Web

`web/shared/competition-ui.mjs` aplica el módulo común `duels2/ui-transform.mjs` sobre la presentación aprobada, sin modificar autenticación, pagos ni la referencia original. El build web normal empaqueta el resultado y pasó las comprobaciones de protección de contenido. No se ejecutó ningún despliegue.

## Android

```sh
npm ci
node scripts/prepare-duels2-android.mjs
```

Genera `dist/duels2-android` desde el commit Android inspeccionado, aplica el mismo módulo, habilita el origen WSS en su documento y empaqueta assets con su build existente. No hace checkout ni push a la rama Android y no cambia el código nativo de facturación.

Los únicos archivos fuente Android modificados en el candidato son `competition-app.js` y `competencia.html`. El código compartido permanece en `duels2/`; no se mantienen copias divergentes del motor.

La ejecución aislada de GitHub incluye compilación `:app:assembleDebug` y publica el APK de prueba como `cachaste-duels2-android-debug`. No es una publicación de Play Store ni una validación en un teléfono físico.

## Pruebas reproducibles

```sh
node --test web/tests/duels2-server.test.mjs tests/duels2-ui-transform.test.mjs
node --test web/tests/*.test.mjs tests/competition-client.test.mjs
# Postgres LOCAL aislado; el harness crea/elimina solo su propia base temporal.
DUELS2_DATABASE_URL=postgresql://postgres:clave@127.0.0.1:5432/postgres node scripts/test-duels2-concurrency.mjs
node scripts/prepare-duels2-android.mjs
npx playwright install --with-deps chromium
DUELS2_DATABASE_URL=postgresql://postgres:clave@127.0.0.1:5432/postgres node scripts/test-duels2-browser.mjs
```

El workflow `.github/workflows/duels2-tests.yml` ejecuta estos recorridos con PostgreSQL 17.11, Chromium y dos sesiones móviles independientes. Auth se sustituye por identidades locales de prueba; cada RPC competitivo ejecuta el SQL real. No usa cuentas, compras ni datos de estudiantes reales.

La prueba de navegador bloquea deliberadamente tráfico al Supabase público y usa recuperación por consultas. No demuestra transporte WebSocket alojado. Las capturas proceden de la interfaz ejecutada, no de una maqueta.

## Estado verificable

Las pruebas locales de servidor, idempotencia, acceso, cinco materias/menciones y transformación móvil pasaron. Pasaron también la suite web completa y las pruebas de cuatro conexiones TCP simultáneas con 40 RPC de respuestas/reintentos, una sola liquidación y revancha/aceptación simultáneas.

La ejecución [42864509327](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/42864509327) completó navegador, builds web/Android y APK. La entrega final incluye ajustes adicionales de contraste, recuperación de barra y revocación de lectura Realtime; su ejecución exacta se documenta en el informe de pruebas.

Pendientes de integración, sin declarar aprobados: migración en Supabase alojado, permiso CSP WSS de Work 1, ejecución del scheduler sin clientes, Realtime alojado y prueba en Android instalado. Duelos 2 permanece aislado para no retrasar el lanzamiento.
