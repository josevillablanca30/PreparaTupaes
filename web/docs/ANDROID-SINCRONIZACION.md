# Integración futura de Android y App Store

La candidata Android actual no se modifica. La web utiliza exactamente su catálogo de 802 ítems, los cinco motores de asignatura, el camino y los IDs de contenido. La identidad, perfiles, duelos y rankings usan el mismo proyecto Supabase; la RPC `cachaste_access` acepta derechos Google verificados y suscripciones web verificadas sin sobrescribir recibos Google.

## Qué ya comparte la web

- Identidad Supabase Auth (`user.id`, UUID), perfil competitivo, consentimiento y visibilidad.
- Cuatro rankings independientes y sus filtros, intentos competitivos, respuestas de servidor, historial de victorias/derrotas/empates, estrellas competitivas y rachas.
- Acceso Premium, con permiso de servidor y sesión viva.
- Once documentos de progreso educativo por UUID, con versiones y límites, incluidas las sesiones y evaluaciones tradicionales. Dos sesiones web pueden retomar la misma lección; los conflictos conservan ambos borradores.

## Cambio que necesitará una versión Android posterior

1. Continuar con el mismo proyecto Supabase y UUID. No crear una identidad distinta para Mercado Pago ni importar datos usando solo un correo sin autenticar.
2. Adaptar `web/client/progress-runtime.mjs` a la capa de almacenamiento Android/WebView: prefijo por UUID, hidratación antes de iniciar motores, cola persistente y sincronización mediante `cachaste_web_progress`.
3. En la primera migración, ofrecer al alumno importar el avance local del teléfono a su cuenta autenticada. Conservar un respaldo del documento original y resolver colisiones de sesión antes de modificarlo. No adjudicar un avance local a una cuenta distinta ni sustituir silenciosamente el avance que ya existe en la nube.
4. Conservar claves, IDs de preguntas y versiones de evaluación. Usar `baseVersion` en cada `put`; ante un conflicto presentar ambas sesiones o una combinación verificable. El progreso sincronizado no equivale a puntuación competitiva: esos resultados siguen pasando por el dispatcher del servidor.
5. Mantener las compras y restauración Google en sus verificadores actuales. Consultar la RPC compartida de acceso para reconocer un permiso vigente de la misma identidad. Revisar las condiciones de distribución de cada tienda antes de introducir enlaces de contratación externos en una app nativa.
6. La futura App Store deberá usar ese mismo UUID y las mismas RPC. Si incorpora Apple/Google u otro proveedor social, vincularlo desde una sesión autenticada mediante el mecanismo oficial de identidades; «Ocultar mi correo» de Apple no permite deducir automáticamente que dos correos son la misma persona.
7. Repetir pruebas en dos teléfonos reales: Android → web iPhone → Android, pérdida de red, conflicto de dos sesiones, cuenta distinta, vencimiento, cierre de sesión, eliminación, diagnóstico y ensayo activo. Esas pruebas físicas están pendientes; no se presentan como ya ejecutadas.

El adaptador web trabaja con:

`cachaste-daily-v1`, `prepara-paes-demo-v1`, `prepara-paes-active-exam-v1`, `cachaste-m1-assessments-v1`, `cachaste-m1-diagnostic-30-v1`, `cachaste-m1-diagnostic-draft-v1`, `cachaste-m1-pending-review-v1`, `cachaste-science-v1`, `cachaste-reading-v1`, `cachaste-m2-v1`, `cachaste-history-v1`.

No hay sincronización retroactiva automática del teléfono de la candidata actual. Decir que hoy se puede comenzar una lección en esa candidata y retomarla en la web sería incorrecto. La integración de servidor y el adaptador están preparados para una actualización posterior, manteniendo intacta la candidata destinada a Google Play y a los 12 testers.
