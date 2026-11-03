# Recuperación pública de ¿Cachaste? · 2 de noviembre de 2026

> Actualización del 3 de noviembre de 2026: la recuperación web ya está publicada y verificada en Cloudflare Pages, commit `1979a6ba`. Los errores de acceso Cloudflare se resolvieron. Supabase todavía retorna a `localhost:3000`; el flujo real de correo y teléfono permanece pendiente. [Estado actual y evidencia](../reports/publicacion-20261103/README.md). El texto inferior conserva el diagnóstico histórico del 2 de noviembre.

Se continúa la web comercial existente en `web/`, sin modificar el código Android ni habilitar cobros. El envío por Resend ya funciona según comprobación del titular; el incidente vigente es el retorno a localhost. No se cambian sus claves SMTP.

## Implementación

`/recuperar` es pública e independiente de Premium y de Mercado Pago. Usa el mismo diseño y el SDK oficial Supabase de la web. Admite token hash (plantilla nueva), fragmentos de sesión del flujo implícito usado por Android y códigos PKCE del mismo navegador que los solicitó. `/cuenta.html?recovery=1` y los retornos implícitos antiguos abren el mismo flujo, sin otra navegación que vuelva a incluir los secretos.

El callback se elimina inmediatamente de history antes de solicitudes secundarias, mensajes o enlaces. La plantilla nueva transporta el hash en el fragmento, para no enviarlo como query al servidor de Pages. Las respuestas de recuperación son públicas pero `private, no-store`, con `Referrer-Policy: no-referrer`, CSP y sin caché del service worker. No se incluyen registros de contraseñas o tokens ni se refleja texto de error del proveedor.

La contraseña solo se puede cambiar tras verificar el enlace y el usuario en Supabase; una sesión de login normal no abre ese formulario. Una marca de una hora en sessionStorage permite retomar una validación ya realizada en la misma pestaña; contiene ID y hash del token, no el token. Un cambio de identidad invalida el cambio pendiente. Tras actualizar se solicita cierre global de sesiones y se indica cómo volver a la app Android. Si la red falla después de que el cambio haya sido confirmado, no se presenta el cambio realizado como fallido ni se solicita repetirlo.

La petición de otro correo usa `resetPasswordForEmail` con `/recuperar` explícito, sin crear una cuenta. El reenvío espera sesenta segundos. La plantilla contiene el botón «Cambiar mi contraseña», el código numérico compatible con Android y el aviso para solicitudes no reconocidas.

## Despliegue y configuración alojada

Proyecto Pages existente: `cachaste-sitecacho`, independiente de Servicios Villablanca. Dirección estable ya existente: `https://work-cachaste-web-comercial.cachaste-sitecacho.pages.dev`. La ruta nueva debe verificarse después del despliegue; una respuesta 200 de la portada anterior no acredita la recuperación nueva.

Se reutiliza `.github/workflows/web-pages-preview.yml`, que exige QA completa del mismo commit y rechaza cambios de cuenta, otros proyectos o publicación comercial. Se agregan pruebas de la ruta pública y su JavaScript a la verificación HTTPS. El archivo `web/deploy-preview.request` solicita ese despliegue.

`web-auth-recovery.yml` comprueba la disponibilidad de accesos privados, ejecuta Auth y SMTP locales desechables con la plantilla nueva y el cliente Android de la rama vigente, y solo configura el Auth alojado después de verificar la versión pública exacta.

`web/scripts/configure-auth-recovery.mjs` limita el cambio a Site URL, Redirect URLs, asunto/cuerpo de recuperación y nombre público de remitente. Conserva host, puerto, usuario, clave y dirección SMTP. Verifica la página pública antes de escribir y relee el resultado. No agrega un proveedor, no crea API keys, no cambia contraseña de usuarios ni emite correos reales durante la configuración.

Accesos necesarios si no están disponibles: `CLOUDFLARE_API_TOKEN` con Pages Edit de la cuenta existente y `SUPABASE_ACCESS_TOKEN` para la configuración Auth del proyecto. Se comprueban su presencia y las respuestas reales de las APIs; una variable presente no demuestra permiso suficiente. No enviarlos por chat. La edición equivalente puede hacerse en los paneles autenticados del propietario.

## Pruebas y límites

En la revisión `31d4dfbdf254b8a24715225dd7ee1661b4e77e5d` aprobaron 394 pruebas de lógica original, 114 pruebas web y 168 recorridos: 42 en Chrome Android, 42 en Safari/WebKit iPhone, 42 en escritorio y 42 en 320 px. También aprobaron las nueve comprobaciones nuevas con Supabase Auth y SMTP reales, pero locales y desechables, y la regresión HTTP de Auth y duelos. El preview local administrado no inició por indisponibilidad del relay; los navegadores se comprobaron mediante GitHub Actions.

Las pruebas HTTP nuevas usan exclusivamente el Auth y SMTP efímeros de CI. Comprueban entrega HTML real al buzón local, hash, código Android, cambio de contraseña, login nuevo, rechazo de clave anterior, expiración, reutilización, repetición y PKCE. No equivalen a correo nuevo en Gmail ni a tocar un enlace en un teléfono físico.

La comprobación humana final requiere pedir un correo nuevo desde la app instalada, abrir el botón desde Gmail en el teléfono, establecer una contraseña elegida por el titular, entrar con ella y verificar el rechazo de la anterior. No reutilizar correos antiguos que aún apuntan a localhost. No se da por resuelto el spam sin comprobar un mensaje real y sus encabezados.

## DNS

La consulta pública inicial encontró SPF en `send.auth.sitecacho.cl` y DKIM en `resend._domainkey.auth.sitecacho.cl`; no encontró DMARC en el subdominio remitente ni en el dominio padre. Esto acredita presencia/ausencia en DNS, no autenticación efectiva del mensaje. El script `audit-mail-dns.mjs` conserva la comprobación y deja `spamFixed=false`. No se alteran los registros de correo que ya funcionan. Para introducir DMARC de monitorización, el registro inicial es `_dmarc.auth.sitecacho.cl TXT v=DMARC1; p=none;`, sin inventar un buzón de reportes.

## Fuentes oficiales

- https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail
- https://supabase.com/docs/guides/auth/auth-email-templates
- https://supabase.com/docs/reference/api/v1-update-auth-service-config
- https://resend.com/docs/dashboard/domains/introduction
- https://resend.com/docs/dashboard/domains/dmarc

## Estado comprobado y continuación

La implementación y sus correcciones están en los commits `389756d7`, `d2ce03a5` y `31d4dfbd`. La evidencia y el procedimiento de continuación están en [`../reports/recuperacion-20261102/README.md`](../reports/recuperacion-20261102/README.md).

El despliegue se intentó en Actions y quedó bloqueado porque falta `CLOUDFLARE_API_TOKEN`. El preflight de Auth confirmó que también falta `SUPABASE_ACCESS_TOKEN`. Los paneles Cloudflare y Supabase requieren iniciar sesión en este entorno; no hay una sesión administrativa disponible. La configuración Auth preparada **no se ha aplicado** y no se cambió SMTP.

La comprobación HTTPS encontró la versión pública anterior `38892741771432f56e49fc875e4384de3e0de144`. `/recuperar` y `/recovery.js` devolvieron la portada antigua por el fallback del sitio. Por eso un HTTP 200 no se contabiliza como recuperación desplegada. No se ha solucionado el retorno a localhost para usuarios reales hasta publicar y configurar las URLs.

No se declara la misión terminada. Después del acceso administrativo falta publicar, releer la configuración Auth y completar el recorrido real de correo y teléfono. No hace falta otro AAB: la rama Android permanece sin cambios.
