# Operación de comunidad antes de abrir al público

La rc5 agrega reglas de comunidad aceptadas explícitamente, denuncia por cuatro motivos, bloqueo, lista privada de bloqueados y desbloqueo. Estas acciones de protección no exigen suscripción. El bloqueo anula invitaciones pendientes y oculta al rival en rankings en ambos sentidos, sin mejorar la posición del usuario. Los duelos ya iniciados conservan la posibilidad de resolución para evitar manipular resultados.

La denuncia guarda el identificador del denunciante autenticado, el del denunciado, un motivo, el apodo existente en ese momento y la fecha de servidor. No incluye texto libre, correo público ni una sanción automática. La cola y las restricciones son privadas, con RLS y sin lectura directa de los clientes. Hay límites de frecuencia y protección de duplicados.

## Estado de despliegue

La migración `supabase/migrations/20261023191747_cachaste_community.sql` pasó las pruebas en Postgres y la integración Auth/PostgREST del servidor temporal de CI. **No se aplicó al proyecto alojado**: dos intentos del conector devolvieron `Invalid or expired requestState`; la consulta posterior no encontró las tablas nuevas. Aplicarla mediante una conexión administrativa autorizada y comprobar los permisos antes de habilitar competencia. No usar la ejecución SQL general para esquivar el fallo del flujo de migraciones.

## Trabajo del responsable

Antes del lanzamiento, el titular debe asumir la revisión periódica de denuncias, elegir un contacto público de soporte, atender solicitudes y documentar las decisiones con acceso administrativo restringido. La aplicación no incorpora un equipo externo de moderación ni promete plazos de atención que no existen.

Desde el SQL Editor administrativo del proyecto, consultar únicamente la cola necesaria:

```sql
select id, reporter_id, target_id, reason, nickname_snapshot, created_at
from cachaste.reports
where status = 'pending'
order by created_at
limit 50;
```

Revisar el contenido y contexto antes de actuar. Usar parámetros con UUID reales de la cola, nunca identidades de las pruebas. Para una restricción, actualizar `cachaste.profiles.moderation_status` a `suspended`. El trigger desactiva visibilidad pública y desafíos, retira la búsqueda de rival y cancela invitaciones pendientes. El registro privado en `community_restrictions` evita eludirla borrando y recreando el perfil público. La gestión de cuenta, eliminación, bloqueos y denuncias continúan disponibles.

Registrar en la denuncia `status = 'reviewed'` o `'dismissed'` y `reviewed_at = now()` según la decisión. No publicar la identidad del denunciante. Revisar por separado la suscripción: una restricción competitiva no equivale a cancelar un cobro de Google Play.

Para levantar una restricción con perfil existente, cambiar administrativamente `moderation_status` a `active`; el trigger elimina la restricción privada. Si la persona borró su perfil, eliminar administrativamente su fila de `community_restrictions` tras revisar la solicitud. Las preferencias de publicación y desafíos quedan sujetas a una nueva elección del estudiante.

Al eliminar la cuenta de acceso, las denuncias y restricciones vinculadas se eliminan por cascada junto con sus datos competitivos. La retención de registros operativos y respaldos debe definirse y reflejarse en la política de privacidad antes de producción.
