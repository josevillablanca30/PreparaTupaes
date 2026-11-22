# Corrección del selector gratuito — 22 noviembre 2026

## Producción
- URL: https://sitecacho.cl
- Código desplegado: e540fb675426457985c0e7b84a6f932659d35a2f.
- Despliegue aprobado: https://github.com/josevillablanca30/PreparaTupaes/actions/runs/45023550750
- Regresión de integración aprobada: https://github.com/josevillablanca30/PreparaTupaes/actions/runs/45023550745
- Cloudflare completó el despliegue el 22/11/2026 a las 09:41 de Chile.
- /api/config confirmó basicEnabled=true y la revisión anterior.

## Cambio
La versión publicada consultaba solamente la suscripción y no incorporaba la integración Básica existente. Se incorporaron las dependencias educativas ya implementadas, manteniendo el motor y los recursos visuales existentes. El selector muestra primero **Plan Básico — Gratis**, con **Empezar gratis**, seguido de Mensual, Semanal y Anual. El botón establece la sesión y abre /app/inicio.html; no inicia checkout.

No se modificó el banco de preguntas, la selección de Express, los precios ni el código Android. No se ejecutaron migraciones ni se realizaron pagos de prueba. La base alojada ya tenía original_learning_enabled=true y duel_admission_enabled=true. El despliegue habilitó únicamente las tres banderas educativas del gateway y añadió la clave cifrada de su propio paquete. La comparación antes/después confirmó que las otras variables de producción y el entorno preview se conservaron.

## Evidencia real
Se creó una cuenta técnica nueva y confirmada para QA, sin suscripciones ni privilegios Premium, y se inició sesión contra Supabase alojado. No se usaron respuestas simuladas del backend.

| Comprobación | Resultado |
| --- | --- |
| Cuenta sin Premium y cero suscripciones | Confirmado |
| POST /api/session | tier=basica |
| GET /app/inicio.html con cookie de esa cuenta | HTTP 200, bootstrap Básica y runtime educativo presentes |
| Solicitudes HTTP con identificador Chrome Android | Aprobadas |
| Solicitudes HTTP con identificador Facebook Android | Aprobadas; simulación de User-Agent |
| Cupos iniciales | 3 etapas por materia, 1 diagnóstico por materia, 1 Express diario, 2 duelos diarios, 0 ensayos completos |
| Tres etapas reales de M1 | Iniciadas, respondidas y completadas por API contra la base de producción |
| Recuperación de cada actividad | Confirmada por RPC state |
| Cuarta etapa | BASIC_QUOTA_EXHAUSTED confirmado en la base alojada bajo las mismas credenciales de usuario |
| Cupos después de completar | M1=0; otras cuatro materias=3 |
| Pruebas focalizadas del despliegue | 77 aprobadas, 0 fallidas |
| Build y distribución privada cifrada | Aprobados |
| Chrome visual con cuenta existente de administrador | Inicio educativo visible y acceso conservado |

## Límites de la verificación
La cuenta técnica se confirmó administrativamente; no se probó la entrega de un correo de confirmación de registro nuevo. El recorrido Básica en producción se verificó por HTTP/API y base alojada, sin completar el formulario visual de login de esa cuenta en Chrome. La comprobación de Facebook fue mediante su User-Agent; **no es una prueba real dentro de la app de Facebook en un teléfono**. No se afirma esa prueba como completada.

El primer intento HTTP de comprobar el rechazo de una cuarta etapa recibió un cuerpo no interpretable como JSON. Se verificó el mismo rechazo mediante una transacción alojada con las credenciales de la cuenta técnica y rollback. Las tres finalizaciones anteriores sí se confirmaron por HTTP contra el servicio real.

La cuenta técnica y sus sesiones se eliminaron al terminar; se verificó que no quedan usuarios ni sesiones de esa prueba. No se modificaron cuentas ni progresos de estudiantes existentes.
