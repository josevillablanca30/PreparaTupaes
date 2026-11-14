# Operación web y bloqueo de lanzamiento

## Entornos separados

Código: rama `work/cachaste-web-comercial-20261024`. La rama Android y sus archivos originales se verifican contra `add8a5979d28cb1f7598767bb4bf1ad7b8328937`. No se fusiona a `main`.

Supabase compartido: `jmobinmdwrmdqrxtcruj`. Migración aditiva registrada: `20261024144927_cachaste_web_commercial`. Funciones nuevas `cachaste-mercadopago` y `cachaste-mp-events`: desplegadas con facturación deshabilitada. Las funciones Google Play existentes no se reemplazan. `verify_jwt=false` en las funciones MP es deliberado: el handler autentica con Auth + sesión viva, y el webhook exige firma HMAC; no es acceso anónimo para comprar o administrar ventas.

No hay pruebas ni usuarios artificiales en el proyecto alojado. Las pruebas con suscripciones de ensayo ocurren exclusivamente en localhost o en fixtures aislados de CI. La política alojada conserva `payments_enabled=false`, `tax_ready=false`, `allow_test_purchases=false`, y el entorno competitivo sigue en `production`.

## Cloudflare Pages Free

Última preview desplegada y verificada (`3889274`): [estado real, URL, pruebas completas, capturas y DNS pendiente](../reports/lanzamiento-20261025/README.md). Se usó Wrangler/API desde Work tras la QA de Actions del mismo commit; la automatización continua todavía requiere el único secreto en GitHub. La [primera entrega](../reports/cloudflare-20261025/README.md) se conserva como evidencia histórica.

La compilación se ejecuta desde la raíz del repositorio, con Node 22 o posterior:

```sh
npm ci
node web/scripts/build.mjs
```

Salida: `web/dist`. Contiene el Worker avanzado, landing, cuenta, PWA y archivos privados cifrados. **No desplegar el `dist` original de la raíz**: corresponde al empaquetado educativo Android y contiene bancos sin la puerta de acceso web.

Usar la cuenta Cloudflare existente del titular y crear un proyecto Pages Free independiente llamado **`cachaste-sitecacho`**, exclusivamente para `sitecacho.cl`. No editar la zona, registros, nameservers, proyecto ni conexión Lovable de **`somosvillablanca.cl`**. El verificador rechaza cualquier otro nombre de proyecto, incluso dentro de la misma cuenta.

El proyecto conserva su rama Pages **`production-requires-owner-approval`**, distinta de la rama fuente web. El 10 de noviembre el titular solicitó servir la web pública después de reparar su CNAME, manteniendo los cobros cerrados. Para esa publicación se usa `web-sitecacho-public.yml`, activado por **`web/deploy-public.request`** en la rama web: exige QA del mismo SHA, verifica Mercado Pago deshabilitado, prepara claves educativas privadas del runtime público y publica únicamente este proyecto. La autorización de una web pública no activa pagos, registros nuevos ni Google. No modifica DNS ni Resend. Revalida solamente los dos dominios nombrados por la API de Pages.

El flujo separado `web-pages-preview.yml` se activa con `web/deploy-preview.request`, exige la misma QA y publica solo la preview. Si existe la web pública revisada, conserva íntegros su runtime y claves y omite la antigua vinculación del dominio a una preview. Ambos flujos comparten exclusión mutua para evitar carreras. No requieren fusionar a main ni acceder al panel de Cloudflare. Un proyecto, cuenta, rama de publicación o sitio canónico ajeno hace detener el proceso antes de escribir.

El método elegido es **Direct Upload desde GitHub Actions y Wrangler**. La API oficial crea/configura únicamente `cachaste-sitecacho`, sin iniciar sesión desde Work, sin instalar Git integration y sin tocar otra zona o proyecto. Cloudflare no permite convertir después ese proyecto a Git integration; la automatización queda en Actions. Instrucciones completas y acciones manuales mínimas en [DESPLIEGUE-CLOUDFLARE.md](DESPLIEGUE-CLOUDFLARE.md).

Antes de subir, configurar **Settings > Runtime > Fail open / closed > Fail closed**, tanto para preview como para producción. El script de despliegue lo verifica por API. Aunque la plataforma llegara a servir estáticos, los bancos solo existen como AES-256-GCM; la clave es un secreto de ejecución, nunca parte del Worker generado ni de los archivos.

### Variables y secretos Pages

| Nombre | Tipo y uso |
| --- | --- |
| `SUPABASE_URL` | Público; ya definido en `web/wrangler.jsonc`. |
| `SUPABASE_PUBLISHABLE_KEY` | Público; ya definido. No es una service role. |
| `BANK_CONTENT_KEY` | Secreto: 32 bytes aleatorios en base64. Actions genera uno por despliegue en su propio entorno y usa el mismo valor en compilación y ejecución. Preview y web pública conservan claves independientes. |
| `OFFLINE_SIGNING_JWK` | Secreto: JWK privado EC P-256, generado por Actions; solo su parte pública llega al service worker. |
| `WEB_SIGNUP_ENABLED` | `false` hasta configurar correo, URLs de retorno y documentos definitivos. |
| `WEB_AUTH_RETURN_READY` | `false` hasta comprobar recuperación y confirmación de correo por HTTPS. |
| `WEB_GOOGLE_AUTH_ENABLED` | `false` hasta configurar y verificar el proveedor Google real; [guía exacta](AUTENTICACION.md). |
| `WEB_PAYMENTS_ENABLED` | `false` en la publicación pública; la política Supabase también permanece cerrada. |
| `WEB_PUBLIC_RELEASE` | Marcador `sitecacho-payments-closed-v1` para reconocer únicamente una publicación pública revisada. |

El rol administrador se obtiene de `auth.users.raw_app_meta_data.role` mediante consulta actual a la base de datos. `WEB_ADMIN_IDS` y los metadatos editables no conceden administración.

No registrar claves en logs, commits ni capturas. La compilación local sin clave genera un secreto efímero en `web/.local-bindings.json`, ignorado por Git. Ese archivo no se entrega ni se sube a Pages. En Cloudflare Build, una clave ausente detiene la compilación. Cambiar `BANK_CONTENT_KEY` exige reconstruir todo el contenido con la nueva clave; cambiar la clave offline revoca las licencias offline anteriores al siguiente arranque.

En GitHub, **Settings > Secrets and variables > Actions > Repository secrets**, guardar únicamente `CLOUDFLARE_API_TOKEN`, limitado a Cloudflare Pages Edit de esa cuenta. El Account ID público ya está configurado a partir de la captura del titular y la guarda rechaza cuentas diferentes; no requiere un secreto adicional. No dar permisos DNS, zonas, facturación ni Workers Scripts. El proyecto está fijado en el workflow y las claves del banco/firma se generan internamente. No usar environment secrets, para conservar compatibilidad con GitHub Free si el repositorio se vuelve privado. El flujo no crea cuentas, no compra servicios y no cambia el plan. La cuenta existe según confirmación del titular; falta guardar el único token directamente en GitHub, sin enviarlo al chat.

### Cuotas y 200 estudiantes

Workers/Pages Functions Free: 100.000 solicitudes diarias; CPU Free limitada. Pages Free: 500 builds/mes, 20.000 archivos y 25 MiB por archivo. Supabase Free: 500 MB de base de datos, 50.000 MAU, 5 GB de salida no cacheada, 5 GB cacheada y 500.000 invocaciones Edge/mes según documentación consultada el 24/10/2026. Son cuotas, no una garantía de capacidad.

Esta implementación evita Realtime permanente, guarda progreso con debounce y límite de 1 MiB por documento/2 MiB por usuario, indexa búsquedas y separa contenido estático del tráfico Supabase. La autorización de archivos se reutiliza hasta 30 segundos; las escrituras y la cuenta vuelven a comprobar la sesión y acceso. La licencia offline dura como máximo 12 horas y no puede sobrepasar el permiso verificado.

Con 200 estudiantes, el límite máximo lógico de progreso sería unos 400 MiB antes de índices y otros datos: vigilar tamaño real, salida, latencia y solicitudes desde el primer grupo. No se ha ejecutado una prueba de carga de 200 usuarios; no se garantiza que el uso concreto quepa siempre en Free. No contratar un plan sin autorización. Al agotar cuota se bloquea el acceso en lugar de revelar contenido.

## Dominio .cl y NIC Chile

Dominio definitivo: **`sitecacho.cl`**, comprado en NIC Chile por el titular, según su actualización del 24/10/2026. La aplicación y la marca siguen llamándose **¿Cachaste?**. No realizar otra compra, transferencia de registrador ni renovación. `pages.dev` se reserva a pruebas.

1. Dentro de la cuenta Cloudflare existente, agregar únicamente la zona **`sitecacho.cl`** en plan **Free**, conservando cualquier registro de correo existente de ese dominio. Comprobar el nombre de la zona antes de cada cambio.
2. Copiar los dos nameservers que Cloudflare asigne a esa zona. No inventar nombres ni copiar los de otro dominio.
3. En NIC Chile, administrar **`sitecacho.cl`** y actualizar únicamente sus servidores DNS con esos dos nombres. Entregar al titular los nombres reales asignados antes de pedir el cambio manual. No usar «Redirección web» como sustituto de DNS. No modificar `somosvillablanca.cl`.
4. Esperar que Cloudflare confirme la zona activa.
5. En **`cachaste-sitecacho` > Custom domains**, asociar primero `sitecacho.cl` y `www.sitecacho.cl`; seguir la creación de CNAME indicada por Pages. Crear solo un CNAME sin asociar el dominio al proyecto no completa la vinculación. Para apuntar temporalmente a la rama web, después de un despliegue preview exitoso usar el alias exacto que devuelva Pages y un CNAME **proxied** de la zona `sitecacho.cl`: Cloudflare permite asociar dominios a una rama de esa forma. No adivinar cómo transforma las barras del nombre de rama en el alias.
6. Confirmar HTTPS y certificados, dominio canónico y redirección `www` según lo aprobado. Mantener deshabilitada la publicación comercial hasta esa autorización.
7. Registrar `https://sitecacho.cl/cuenta.html` con los parámetros de confirmación/recuperación usados por la web en los retornos Auth de Supabase. Mantener todos los retornos Android existentes. Preparar `CACHASTE_WEB_ORIGIN=https://sitecacho.cl`, los back URLs de los planes y los ajustes de Mercado Pago, conservando los gates de cobro en `false`. No dejar comodines de producción.
8. Repetir Auth, restauración, checkout sandbox, cancelación, PWA y pruebas de acceso directamente sobre el dominio antes de activar ventas.

## Mercado Pago Chile

Planes de servidor: semanal $2.490/7 días; mensual $7.990/1 mes; anual $64.990/12 meses. No se acepta un precio enviado por el navegador. Los planes se consultan y validan contra el proveedor antes de crear una suscripción pendiente.

Secretos **solo Supabase Edge**: `MP_ACCESS_TOKEN`, `MP_COLLECTOR_ID`, `MP_WEBHOOK_SECRET`, `MP_PLAN_WEEKLY`, `MP_PLAN_MONTHLY`, `MP_PLAN_YEARLY`. Opcionales: `MP_PLAN_MONTHLY_TRIAL`, `CACHASTE_MP_TRIAL_ENABLED=true` únicamente si el plan oficial tiene `free_trial` de siete días exactos. `CACHASTE_WEB_ORIGIN` es el origen HTTPS definitivo; `CACHASTE_WEB_ADMIN_IDS` contiene UUID autorizados a reportes. Las claves built-in de Supabase se leen en el servidor.

Gates: `CACHASTE_MP_ENABLED=false`, `CACHASTE_MP_TAX_READY=false` por defecto. La base exige además `payments_enabled` y `tax_ready`; ningún cliente puede escribirlos. `CACHASTE_MP_MODE=production` exige token `APP_USR-`; `test` exige `TEST-`, permiso explícito de compras de prueba y entorno de base `test`. **Nunca poner la base compartida con Android en test**: usar localhost o un entorno de ensayo independiente para credenciales sandbox.

Los nuevos checkouts de producción exigen `https://sitecacho.cl` y credenciales del vendedor comercial distintas de las de QA. Pausar las ventas conserva la cancelación, la conciliación y los webhooks firmados de suscripciones existentes. Los reportes administrativos están disponibles con la autorización de la cuenta.

El panel de Aconcanino SpA identifica la integración **Cachaste - Suscripciones** con el número `48384472675774` y al vendedor con el ID `3113741347`. El valor `3489525217856496` procede del campo `application_id` de los tres planes existentes y se valida como parte del catálogo. Las nuevas suscripciones vinculadas a cuentas se crean con el token de la integración del panel.

La **Clave secreta** se obtiene en **Cachaste - Suscripciones → Webhooks → Configurar notificaciones → Modo productivo**. Se guarda en `MP_WEBHOOK_SECRET` en Supabase. Una aplicación puede compartir su clave de firma entre sus URLs de prueba y producción. El servidor admite que las firmas coincidan únicamente cuando el token comercial identifica la aplicación del panel y es distinto del token sandbox. El diagnóstico consulta el vendedor y los planes mediante lecturas. Para verificar el origen de las notificaciones, comprobar en `cachaste-mp-events` una entrega firmada del simulador de esa aplicación. Una notificación de plan verifica la firma sin modificar suscripciones ni generar un cobro.

El flujo de publicación lee `web/deploy-final-public.request` en la rama `work/cachaste-lanzamiento-final-20261113`. El alcance `public-web-commercial` requiere la aprobación del titular, una revisión con CI aprobado, los datos públicos de Aconcanino SpA, la fecha de vigencia y los textos confirmados de devolución y documentación tributaria. La publicación comercial configura el checkout y la indexación del dominio canónico. El mapa incluye la portada y las rutas legales. Las páginas de cuenta y los recursos de aprendizaje conservan sus controles de acceso y exclusión de buscadores.

El acceso pagado deriva de pagos reales aprobados consultados a la API: importe, CLP, receptor, modo, referencia, suscripción y período deben coincidir. Una URL de retorno, un estado `authorized` sin pago, un campo Premium, un pago pendiente o reembolsado no bastan. La prueba de siete días se enlaza una sola vez por identidad y solo se ofrece cuando su plan está verificado. El acceso se revisa al entrar a la cuenta y por webhooks; una validación con más de 12 horas requiere renovarse contra el proveedor.

Configurar notificaciones oficiales de `subscription_preapproval`, `subscription_authorized_payment` y `payment` a `https://jmobinmdwrmdqrxtcruj.supabase.co/functions/v1/cachaste-mp-events`, con secreto HMAC. Se valida `x-signature`, `x-request-id`, `data.id`, cuerpo y antigüedad; se consultan los recursos canónicos y se deduplica después de aplicar correctamente para permitir reintentos. Revisar la firma real, datos MLC y permisos de la cuenta del titular en sandbox antes de habilitar producción. Las pruebas automatizadas del proveedor son simuladas; no se ha usado una cuenta Mercado Pago real.

Cancelar cambia el estado del proveedor y vuelve a verificar; conserva el tiempo pagado confirmado. Al eliminar una cuenta se borran progreso y vínculos personales, y el ledger contable privado conserva pagos sin usuario ni suscripción. La interfaz exige cancelar primero la renovación.

## Documentación tributaria

La salida comercial se prepara para Aconcanino SpA. Confirmar el domicilio legal que se publicará y la emisión del documento tributario que corresponda a la suscripción.

Antes de cambiar los gates: verificar Inicio de Actividades y giro con SII/contador; determinar si esta prestación concreta está afecta o exenta de IVA; definir documentación de ventas y notas de crédito que correspondan; configurar el emisor y conciliación. Que el contenido sea educativo no prueba por sí solo que esta suscripción califique para una exención. Los precios previstos no autorizan agregar IVA sorpresivamente en el checkout.

El administrador puede exportar CSV de pagos, montos brutos, comisiones y netos desde Mi cuenta. El rango se interpreta como días completos de Chile (`America/Santiago`), incluido el horario de invierno/verano y el último día seleccionado. La exportación está limitada por UUID del servidor y neutraliza fórmulas de hojas de cálculo. No reemplaza boletas, facturas, notas de crédito ni declaraciones tributarias. No se ha conectado un emisor de documentos. Completar revisión de responsable, domicilio comercial, condiciones de contratación, conservación y tratamiento de menores antes de habilitar registro/ventas.

## Fuentes oficiales consultadas

- [Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [GitHub CI](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/), [Fail closed](https://developers.cloudflare.com/pages/functions/routing/), [dominios Pages](https://developers.cloudflare.com/pages/configuration/custom-domains/), [dominio para una rama](https://developers.cloudflare.com/pages/how-to/custom-branch-aliases/), [límites](https://developers.cloudflare.com/pages/platform/limits/).
- [Supabase Free y cuotas](https://supabase.com/docs/guides/platform/billing-on-supabase).
- [NIC Chile: servidores DNS](https://www.nic.cl/ayuda/faq/ins-05.html), [WHOIS](https://www.nic.cl/whois/).
- [Mercado Pago: suscripciones](https://www.mercadopago.cl/developers/es/docs/subscriptions/overview), [planes](https://www.mercadopago.cl/developers/es/reference/subscriptions/_preapproval_plan/post), [webhooks](https://www.mercadopago.cl/developers/es/docs/your-integrations/notifications/webhooks).
- [SII: Inicio de Actividades](https://www.sii.cl/destacados/ley_cumplimiento_obligaciones_tributarias/quienes_deben_inicio.html), [IVA de servicios](https://www.sii.cl/destacados/iva_prestacion_servicios/), [selección de actividad y documentos](https://www.sii.cl/preguntas_frecuentes/rut_inicio_actividades/001_105_0641.htm).
