# Activar códigos de correo en el proyecto alojado

Las plantillas del repositorio y `supabase/config.toml` se prueban en el entorno local de CI. **No modifican por sí solas el proyecto alojado.**

Proyecto: `jmobinmdwrmdqrxtcruj`. La sesión de Work no dispone de acceso a su configuración Auth: Management API devuelve HTTP 401 y el navegador no arranca por una restricción del entorno. No se debe presentar el correo alojado como corregido hasta aplicar y verificar este cambio.

## Opción del panel — no requiere entregar claves

1. Abre [Authentication → Email Templates](https://supabase.com/dashboard/project/jmobinmdwrmdqrxtcruj/auth/templates).
2. En **Confirm signup**, reemplaza el contenido por [confirmation.html](../supabase/templates/confirmation.html) y usa el asunto `Confirma tu correo en ¿Cachaste?`. Guarda.
3. En **Reset password**, reemplaza el contenido por [recovery.html](../supabase/templates/recovery.html) y usa el asunto `Recupera tu acceso a ¿Cachaste?`. Guarda.
4. Mantén la confirmación de correo activada. No hay que cambiar SMTP, contraseñas ni permisos de usuarios.

El cuerpo debe contener exactamente la variable `{{ .Token }}`: Supabase la sustituye por el código real. **No escribas un código fijo.** Los nuevos correos no contienen enlaces de confirmación y por tanto no conducen a `localhost`. Los correos anteriores no cambian: solicita uno nuevo desde la app.

## Opción automatizada del propietario

Con `SUPABASE_ACCESS_TOKEN` configurado de forma privada en su entorno, el propietario puede ejecutar `node scripts/configure-auth-email.mjs`. Este helper actualiza solo los dos asuntos y los dos cuerpos; verifica luego que coincidan. `--check` comprueba sin escribir. No imprime tokens ni la configuración completa. No pegues el token en el chat ni en el repositorio.

## Comprobación real imprescindible

Crear una cuenta autorizada, recibir un correo en español con código numérico visible e ingresarlo en la app. Probar reenvío, código incorrecto/usado, recuperación y regreso desde Gmail a la app. Las pruebas de SMTP local no equivalen a entrega real en Gmail.
