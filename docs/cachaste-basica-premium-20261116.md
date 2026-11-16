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
