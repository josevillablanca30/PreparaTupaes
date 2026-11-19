# ¿Cachaste? — relevo operativo para Work (20 noviembre 2026)

## Objetivo único
Terminar la integración funcional del plan Básico en las pantallas reales de la aplicación y validar el recorrido extremo a extremo, sin alterar Premium ni el flujo de pagos existente.

## Estado confirmado
- Rama: `feature/cachaste-basica-premium-20261116`; PR #22.
- Guardrails web CI #512 aprobado hasta commit `915b0b048495ff38c88e33480775893276636ade`.
- Infraestructura de cuotas, reserva, emisión, finalización verificada y recuperación implementada en módulos separados.
- **No está conectada a las pantallas reales**; no afirmar que Básica está lista.
- Flags de Básica apagados; migraciones SQL de la rama no aplicadas en producción.

## Trabajo prioritario en orden
1. Identificar la ruta real de inicio de lección, diagnóstico, PAES Express y duelo en la web y Android. Conectar únicamente los puntos de entrada del plan Básico, conservando el motor Premium intacto. Usar `createBasicLearningSession.launch`, preguntas emitidas por el servidor y `finish` con las respuestas correspondientes. En caso de interrupción, recuperar con la clave original y el cuestionario persistido.
2. Validar en una base de pruebas aislada la secuencia completa de migraciones `20261116*`, `20261117*`, `20261119080000*`. No ejecutar migraciones sobre Supabase de producción sin autorización.
3. Pruebas reales de Basic: tres etapas de lección al día por asignatura; un diagnóstico por asignatura de por vida; un Express al día; dos duelos diarios; sin ensayo completo. Respetar el día chileno y el bloqueo de intentos repetidos.
4. Pruebas Premium y testers: verificar que suscripción, acceso, progreso, duelos y pagos existentes no cambien. No generar pagos reales ni reconfigurar Mercado Pago.
5. Verificar compilación web, Android AAB, flujos de autenticación y visuales aprobados. Documentar los bloqueos reales antes de solicitar autorización de activación y despliegue.

## Restricciones
- No rediseñar portada, gatos, textos, jerarquía ni imágenes aprobadas.
- No modificar la selección de preguntas de PAES Express sin instrucción expresa.
- No agregar planes ni alterar precios, renovaciones, periodos de prueba o testers.
- No habilitar flags ni cobros, ni desplegar a producción sin confirmación.
- No repetir auditorías generales: usar CI y pruebas focalizadas en los flujos que faltan.

## Riesgos por verificar
- El SQL de migración no ha sido ejecutado contra una base de pruebas real.
- El banco privado de preguntas (`BASIC_QUESTION_BANK_JSON`) debe existir, ser revisado y cubrir cada actividad sin exponer respuestas.
- La emisión de Express actualmente utiliza un `subject` concreto mientras la reserva usa `all`: verificar el contrato existente y no cambiar el comportamiento pedagógico aprobado.
- Recuperación de sesiones requiere prueba con red interrumpida, reintentos simultáneos y cierre de sesión.

## Criterio de terminado
Un usuario Básico puede iniciar sesión, realizar actividades permitidas y recibir límites correctos; un Premium mantiene acceso completo; los datos se verifican en servidor; el flujo sobrevive a reintentos; CI y pruebas de base de datos pasan; solo entonces solicitar autorización de publicación.
