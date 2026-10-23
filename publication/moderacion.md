# Operación de comunidad antes de abrir al público

La rc5 agrega reglas de comunidad aceptadas explícitamente, denuncia por cuatro motivos, bloqueo, lista privada de bloqueados y desbloqueo. Estas acciones de protección no exigen suscripción. El bloqueo anula invitaciones pendientes y oculta al rival en rankings en ambos sentidos, sin mejorar la posición del usuario. Los duelos ya iniciados conservan la posibilidad de resolución para evitar manipular resultados.

La denuncia guarda el identificador del denunciante autenticado, el del denunciado, un motivo, el apodo existente en ese momento y la fecha de servidor. No incluye texto libre, correo público ni una sanción automática. La cola y las restricciones son privadas, con RLS y sin lectura directa de los clientes. Hay límites de frecuencia y protección de duplicados.

## Estado de despliegue

La migración `supabase/migrations/20261023200921_cachaste_community.sql` está aplicada al proyecto alojado desde el 23 de octubre de 2026, a las 20:09 UTC. Pasó las pruebas en Postgres y la integración Auth/PostgREST del servidor temporal de CI. La verificación alojada confirmó 22 tablas privadas con RLS, sin lectura directa de denuncias ni escritura de restricciones desde el cliente, y sin ejecución del despachador anterior para clientes. No se crearon usuarios, perfiles, denuncias ni suscripciones de prueba en producción.

Los dos fallos iniciales de conexión quedaron resueltos. El nombre local de la migración se alineó con la versión registrada por el servidor; su SQL conserva exactamente el contenido validado. El responsable todavía debe establecer y operar el proceso de revisión antes de abrir la comunidad al público.

## Trabajo del responsable

Antes del lanzamiento, el titular debe asumir la revisión periódica de denuncias, mantener operativo el contacto público de soporte `jose.villablanca.horta@gmail.com`, atender solicitudes y documentar las decisiones con acceso administrativo restringido. La aplicación no incorpora un equipo externo de moderación ni promete plazos de atención que no existen.

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
