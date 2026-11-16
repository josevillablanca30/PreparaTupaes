# ¿Cachaste? — Básica + Premium

## Decisión de producto
El registro no obliga a ingresar tarjeta. Tras iniciar sesión se presentan **Básica** y **Premium**, mostrando **todos** los planes: semanal $2.490, mensual $7.990 y anual $64.990. La prueba de Premium dura 7 días con tarjeta y, si no se cancela antes, continúa **únicamente** como suscripción mensual $7.990. La fecha y el precio de renovación deben estar visibles antes de contratar.

## Básica
- Tutor: máximo 3 etapas completadas por día **por asignatura** (M1, M2, Lectora, Ciencias, Historia); los contadores son independientes.
- Diagnóstico: una ejecución total por asignatura por usuario.
- Ensayo PAES Express: uno por día en total, eligiendo cualquiera de las asignaturas.
- Ensayos PAES completos: exclusivos Premium.
- Duelos: dos por día en total.
- Progreso, estrellas y rankings persistentes.
- Sin tarjeta; no usar «gratis para siempre» en textos comerciales.

## Seguridad e implementación
El modelo de cuotas en web/shared/access-tiers.mjs es declarativo, **no una autorización**. Falta integrar los controles con la base de datos y los motores de estudio y duelos antes de ofrecer Básica en producción. Las cuotas deben consumirse atómicamente en servidor y estar asociadas a auth.uid(), con fecha local America/Santiago y protección frente a reintentos, doble clic y sesiones simultáneas. Los diagnósticos se registran de manera permanente. El usuario Premium o tester conserva el acceso completo sin restricciones; las suscripciones y cobros existentes no se alteran.

No abrir /app/ ni mostrar CTA de Básica como funcional hasta que la RPC de cuotas, el acceso de contenido y los flujos web/Android estén integrados y probados. No cambiar la suscripción ni activar cobros nuevos por esta rama.


## Bloqueo de seguridad detectado — consumo directo por RPC

El navegador Android/web puede invocar la función pública de Supabase directamente con un JWT válido, sin pasar por el gateway de Cloudflare. Por eso **un flag del gateway no es una prueba de actividad completada**. La migración SQL bloquea temporalmente `operation='consume'` con `COMPLETION_ATTESTATION_REQUIRED` incluso si alguien llama el RPC directamente. El endpoint web también bloquea consumo sin `WEB_BASIC_COMPLETION_ATTESTATION_READY`.

**No activar las flags ni aplicar la migración a producción todavía.** Para habilitar Básica hay que registrar finalizaciones confiables dentro de transacciones servidor/BD, asignar el identificador de evento desde el servidor, validar tipo/materia y aplicar el límite en la misma transacción que guarda progreso o resultado. Los clientes no deben poder autoacreditar etapas, diagnósticos, ensayos ni duelos. El RPC de lectura `check` es solo informativo; no autoriza acceso a material Premium.

Android tiene un guardarraíl `web/scripts/verify-android.mjs` que impide cambios en el baseline aprobado; no introducir archivos Java aislados hasta preparar la actualización coordinada de aplicación y pruebas Android.


## Duelos: reserva obligatoria al inicio (bloqueo de lanzamiento)

No habilitar `cachaste_duels2.eligible` ni `require_player` para Básica hasta que la admisión de cada enfrentamiento reserve **atómicamente** uno de los dos cupos diarios de cada jugador Básica, usando el mismo bloqueo por usuario que el registro de uso. La reserva debe identificarse con el UUID del enfrentamiento y ser idempotente. Un enfrentamiento contra bot consume solo el cupo del jugador humano. La cola de búsqueda y una invitación pendiente **no** consumen cupo: reservar en la transición real a duelo activo. Definir explícitamente qué ocurre con una cancelación o desconexión después de la activación; no reembolsar automáticamente sin una regla verificable.

La función actual `basic_record_finished_duel` valida el resultado final, pero **no sustituye** esta reserva: registrar solo al finalizar permite iniciar simultáneamente más duelos que el límite. Los duelos Premium no consumen cupos Básica. Mantener `basicEnabled:false` hasta que el flujo completo esté probado, incluyendo concurrencia, bots y dos usuarios Básica.
