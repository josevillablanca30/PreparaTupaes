# Acceso web y continuidad de sesión

Implementado únicamente en la rama web. No cambia la candidata Android, sus retornos Auth ni sus archivos nativos.

## Google: código listo, proveedor pendiente

La cuenta incluye **Continuar con Google**, OAuth con PKCE S256 mediante el SDK fijado en el lockfile, retorno `cuenta.html`, limpieza inmediata del código/errores del historial, destino interno validado y comprobación del proveedor real. El mismo UUID de Supabase identifica perfil, progreso, duelos y suscripción; un correo o `user_metadata` nunca concede Premium.

El proveedor Google del proyecto `jmobinmdwrmdqrxtcruj` devolvió `external.google=false` en la consulta real del 25/10/2026. No hay credenciales Google Cloud disponibles en esta sesión. El botón explica ese estado y no fabrica una cuenta ni habilita contenido. Los dos controles de Pages, `WEB_GOOGLE_AUTH_ENABLED=false` y `WEB_AUTH_RETURN_READY=false`, conservan cerrado el flujo alojado hasta verificar la configuración.

Acciones exclusivas del titular, sin pegar secretos en el chat:

1. En un proyecto Google Cloud propio, configurar marca y pantalla de consentimiento de ¿Cachaste?, con los únicos scopes `openid`, email y perfil. Agregar usuarios de prueba mientras Google lo mantenga en Testing. No activar servicios facturables.
2. Crear el cliente OAuth **Web application**. Orígenes: `https://sitecacho.cl` y el alias HTTPS de preview, si se ensayará allí. URI autorizada de Google: `https://jmobinmdwrmdqrxtcruj.supabase.co/auth/v1/callback`.
3. Guardar Client ID y Client Secret directamente en **Supabase > Authentication > Sign In / Providers > Google** del proyecto indicado. No incluir el secreto en Pages, GitHub, la PWA ni Android.
4. Agregar retornos web de Supabase **sin quitar los Android existentes**: `https://sitecacho.cl/cuenta.html`, sus variantes de query para `next`, recuperación y `sb_flow_id`, y el retorno equivalente del alias de prueba. Validar la coincidencia con la versión actual de Auth. En producción limitar los patrones al origen y ruta exactos; no usar `https://**` ni dominios ajenos.
5. Solo después de comprobar el retorno HTTPS y las condiciones del registro, habilitar los flags web en un despliegue de ensayo autorizado. El bootstrap automático de previews los mantiene cerrados deliberadamente; no saltarse esa guarda para declarar listo un acceso que no se ha probado con Google.
6. Completar un acceso real con una cuenta de prueba autorizada y comprobar UUID, perfil privado por defecto, cierre de sesión, cancelación del consentimiento, código vencido, Safari y Chrome. Esta validación requiere al titular; la suite automatizada usa un proveedor aislado y lo identifica como tal.

El proyecto Supabase gratuito conserva su dominio `supabase.co`; no se contrata un dominio Auth personalizado de pago. La cuenta debe usar un correo verificado para enlazar identidades; no se implementa un enlace manual basado solamente en el texto del correo. Antes de cambiar la candidata Android habrá que registrar sus clientes nativos y probar la misma identidad, según [ANDROID-SINCRONIZACION.md](ANDROID-SINCRONIZACION.md).

## Sesiones largas, red y cambio de estudiante

Las pantallas educativas y competitivas de la web comparten una sola instancia del cliente Auth. La renovación del SDK vuelve a intercambiar la sesión con Pages, que verifica Auth, la sesión viva y el acceso del backend, y renueva la cookie HttpOnly y la licencia offline acotada. La visibilidad, el regreso desde segundo plano y la reconexión disparan una recuperación. El código asíncrono se ejecuta fuera del callback de Auth para no bloquear su lock.

Un cambio de UUID pausa la sincronización, conserva el borrador bajo su dueño original, elimina la autorización/caché privado de la PWA y vuelve a Mi cuenta. Cada escritura de progreso lleva el UUID del documento; el gateway rechaza una cookie de otro estudiante antes de invocar el RPC. Esto cubre la carrera entre dos pestañas durante un cambio de cuenta. Pausar no pierde las respuestas posteriores: se siguen marcando como pendientes en el almacenamiento del mismo estudiante.

Una pérdida de red conserva los borradores y permite el contenido offline previamente autorizado. Una revocación verificada cierra el acceso. Un Premium vencido sigue permitiendo administrar el perfil, privacidad y eliminación desde la página competitiva autenticada; no abre los bancos educativos.

## Pendientes independientes de los trámites SII

- Configurar Google, retornos HTTPS y correo SMTP real para confirmación/recuperación antes de abrir registro público.
- Probar inicio y recuperación reales, sesión larga y dos teléfonos físicos. Los perfiles WebKit/Chrome de CI son navegadores automatizados, no dispositivos físicos.
- Probar la eliminación real con una cuenta Google del titular: la web ya omite la contraseña local para ese proveedor, ofrece confirmar de nuevo con Google y el servidor exige una sesión creada hace menos de diez minutos y confirmación explícita.
- La candidata Android actual no importa todavía su progreso local en la nube. La web conserva el motor original y sincroniza sus propios documentos; la migración de Android sigue siendo una actualización futura separada.

Fuentes: [Google en Supabase](https://supabase.com/docs/guides/auth/social-sign-in/auth-google), [PKCE](https://supabase.com/docs/guides/auth/sessions/pkce-flow), [retornos](https://supabase.com/docs/guides/auth/redirect-urls), [exchangeCodeForSession](https://supabase.com/docs/reference/javascript/auth-exchangecodeforsession). Se consultó también el changelog y el código del SDK instalado, que soporta slots de verificador por `sb_flow_id`.
