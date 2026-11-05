# Activar códigos de correo en el proyecto alojado

Las plantillas del repositorio y `supabase/config.toml` se prueban en el entorno local de CI. **No modifican por sí solas el proyecto alojado.**

Proyecto: `jmobinmdwrmdqrxtcruj`. Revisión del 1 de noviembre de 2026: el conector confirma proyecto activo, creado el 23 de octubre de 2026, organización Villablanca en plan Free. La sesión no dispone de una credencial de Management API; el conector no expone edición de Auth y el navegador no logra iniciar. No se debe presentar el correo alojado como corregido hasta aplicar y verificar el cambio.

## Requisito previo: envío de correo propio

**Corrección de la guía anterior:** no basta con pegar las plantillas si el proyecto usa el SMTP predeterminado. Desde el 3 de junio de 2026, los proyectos Free nuevos no pueden personalizar esas plantillas sin un proveedor SMTP propio. Además, el envío predeterminado limita los destinatarios a miembros autorizados del equipo de Supabase: estar inscrito como tester en Google Play no habilita el correo en Supabase.

El plan y la fecha están comprobados; la configuración privada de SMTP no pudo leerse. Por tanto, no se afirma que SMTP propio esté activado o desactivado. Primero hay que comprobarlo en [Authentication → Email](https://supabase.com/dashboard/project/jmobinmdwrmdqrxtcruj/auth/smtp).

Si aún no hay proveedor, una opción inicial es [Resend Free](https://resend.com/pricing), con límite diario de 100 correos según su página consultada el 1 de noviembre de 2026. Requiere cuenta y dominio verificado; no se ha contratado ni configurado un servicio de pago. No activar ampliaciones de pago para esta prueba.

1. En el proveedor, verifica un dominio o subdominio que controles para ¿Cachaste?, por ejemplo `auth.sitecacho.cl`. Copia sus registros DNS exactos; no inventes valores ni reemplaces los registros de la web o de correo existentes. Esto no requiere modificar `somosvillablanca.cl`.
2. En Supabase habilita Custom SMTP con los datos del proveedor. Con Resend: host `smtp.resend.com`, puerto `465`, usuario `resend`, contraseña igual a su API key de envío. Nombre de remitente: `¿Cachaste?`. Dirección de remitente: una del dominio que el proveedor haya verificado.
3. Introduce la clave **solo en el panel privado de Supabase**. No pegarla en este chat, el repositorio ni formularios de la app.
4. Mantén activada la confirmación de correo. Después aplica las dos plantillas indicadas abajo. No agregar testers como administradores de Supabase ni desactivar confirmación para sortear la restricción de envío.

El indicador `customSmtpConfigured` del comprobador solo acredita que los campos básicos están presentes; no demuestra que la clave, el dominio o la entrega funcionen. Eso se verifica con el correo real.

## Opción del panel — no requiere entregar claves

1. Abre [Authentication → Email Templates](https://supabase.com/dashboard/project/jmobinmdwrmdqrxtcruj/auth/templates).
2. En **Confirm signup**, reemplaza el contenido por [confirmation.html](../supabase/templates/confirmation.html) y usa el asunto `Confirma tu correo en ¿Cachaste?`. Guarda.
3. En **Reset password**, reemplaza el contenido por [recovery.html](../supabase/templates/recovery.html) y usa el asunto `Recupera tu acceso a ¿Cachaste?`. Guarda.
4. Mantén la confirmación de correo activada. Esta edición de plantillas no cambia las contraseñas ni los permisos de usuarios. SMTP debe haber quedado configurado en el paso previo.

El cuerpo debe contener exactamente la variable `{{ .Token }}`: Supabase la sustituye por el código real. **No escribas un código fijo.** Los nuevos correos no contienen enlaces de confirmación y por tanto no conducen a `localhost`. Los correos anteriores no cambian: solicita uno nuevo desde la app.

## Opción automatizada del propietario

Con `SUPABASE_ACCESS_TOKEN` configurado de forma privada en su entorno, el propietario puede usar:

```bash
node scripts/configure-auth-email.mjs --status
node scripts/configure-auth-email.mjs
node scripts/configure-auth-email.mjs --check
```

`--status` solo lee y muestra presencia de SMTP y confirmación, sin identidades o contraseñas. La ejecución sin bandera verifica primero SMTP y confirmación; actualiza únicamente los dos asuntos y los dos cuerpos, y relee para comprobar el resultado. Si ya coinciden, no escribe. `--check` comprueba sin escribir. El helper no configura el proveedor, no envía correos y no certifica entrega. No imprime tokens ni configuración completa. No pegar el token en el chat ni en el repositorio.

## Comprobación real imprescindible

Con autorización del participante, crear una cuenta y recibir un correo en español con código numérico visible; ingresarlo en la app. Probar reenvío, código incorrecto/usado, recuperación y regreso desde Gmail a la app. Verificar también un destinatario externo al equipo de Supabase, sin concederle permisos administrativos. Las pruebas de SMTP local y del helper con respuestas controladas no equivalen a entrega real en Gmail.

Pruebas del helper: `node --test tests/auth-email-configuration.test.mjs`. Incluyen fallo seguro sin SMTP o credencial, modo de solo lectura, cambio limitado a cuatro campos, relectura, idempotencia, rechazo de API y ausencia de secretos en los diagnósticos. No utilizan ni cambian el proyecto alojado.

## Fuentes oficiales comprobadas

- [Cambio de personalización en Free, 3 de junio de 2026](https://supabase.com/changelog/46599-changes-to-email-template-customisation-on-free-tier).
- [Supabase: SMTP propio y restricciones del envío predeterminado](https://supabase.com/docs/guides/auth/auth-smtp).
- [Supabase: variables y API de plantillas](https://supabase.com/docs/guides/auth/auth-email-templates).
- [Resend: configuración SMTP y requisito de dominio verificado](https://resend.com/docs/send-with-smtp).
