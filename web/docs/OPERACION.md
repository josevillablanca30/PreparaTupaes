# Operación web y bloqueo de lanzamiento

## Entornos separados

Código: rama `work/cachaste-web-comercial-20261024`. La rama Android y sus archivos originales se verifican contra `add8a5979d28cb1f7598767bb4bf1ad7b8328937`. No se fusiona a `main`.

Supabase compartido: `jmobinmdwrmdqrxtcruj`. Migración aditiva registrada: `20261024144927_cachaste_web_commercial`. Funciones nuevas `cachaste-mercadopago` y `cachaste-mp-events`: desplegadas con facturación deshabilitada. Las funciones Google Play existentes no se reemplazan. `verify_jwt=false` en las funciones MP es deliberado: el handler autentica con Auth + sesión viva, y el webhook exige firma HMAC; no es acceso anónimo para comprar o administrar ventas.

No hay pruebas ni usuarios artificiales en el proyecto alojado. Las pruebas con suscripciones de ensayo ocurren exclusivamente en localhost o en fixtures aislados de CI. La política alojada conserva `payments_enabled=false`, `tax_ready=false`, `allow_test_purchases=false`, y el entorno competitivo sigue en `production`.

## Cloudflare Pages Free

La compilación se ejecuta desde la raíz del repositorio, con Node 22 o posterior:

```sh
npm ci
node web/scripts/build.mjs
```

Salida: `web/dist`. Contiene el Worker avanzado, landing, cuenta, PWA y archivos privados cifrados. **No desplegar el `dist` original de la raíz**: corresponde al empaquetado educativo Android y contiene bancos sin la puerta de acceso web.

Crear un proyecto Pages Free vacío. Para usar el workflow preparado, elegir una rama de producción de reserva, por ejemplo `production-requires-owner-approval`, distinta de la rama web. Ningún workflow entregado publica producción. El workflow `web-pages-preview.yml` exige QA exitosa del mismo SHA y rechaza cualquier rama distinta de la web. Se solicita manualmente; mientras el workflow no exista en la rama predeterminada de GitHub, se activa guardando una fecha de solicitud en `web/deploy-preview.request` dentro de la rama web. Ese commit inicia QA y espera su resultado antes de subir. No requiere fusionar a main.

Puede usarse Git integration con producción automática deshabilitada, build `node web/scripts/build.mjs`, salida `web/dist`, raíz `/`, y previews restringidas a la rama web. Alternativamente, un proyecto Direct Upload recibe despliegues desde el workflow de GitHub con Wrangler. Cloudflare no permite convertir un proyecto Direct Upload a Git integration: elegir antes de crearlo.

Antes de subir, configurar **Settings > Runtime > Fail open / closed > Fail closed**, tanto para preview como para producción. El script de despliegue lo verifica por API. Aunque la plataforma llegara a servir estáticos, los bancos solo existen como AES-256-GCM; la clave es un secreto de ejecución, nunca parte del Worker generado ni de los archivos.

### Variables y secretos Pages

| Nombre | Tipo y uso |
| --- | --- |
| `SUPABASE_URL` | Público; ya definido en `web/wrangler.jsonc`. |
| `SUPABASE_PUBLISHABLE_KEY` | Público; ya definido. No es una service role. |
| `BANK_CONTENT_KEY` | Secreto: 32 bytes aleatorios en base64. Mismo valor en compilación y ejecución del entorno. |
| `OFFLINE_SIGNING_JWK` | Secreto: JWK privado EC P-256, generado por el titular; solo su parte pública llega al service worker. |
| `WEB_SIGNUP_ENABLED` | `false` hasta configurar correo, URLs de retorno y documentos definitivos. |
| `WEB_AUTH_RETURN_READY` | `false` hasta comprobar recuperación y confirmación de correo por HTTPS. |
| `WEB_ADMIN_IDS` | UUID de administradores, separados por coma; nunca correos ni user_metadata. |

No registrar claves en logs, commits ni capturas. La compilación local sin clave genera un secreto efímero en `web/.local-bindings.json`, ignorado por Git. Ese archivo no se entrega ni se sube a Pages. En Cloudflare Build, una clave ausente detiene la compilación. Cambiar `BANK_CONTENT_KEY` exige reconstruir todo el contenido con la nueva clave; cambiar la clave offline revoca las licencias offline anteriores al siguiente arranque.

GitHub environment `cachaste-pages-preview`: secretos `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` limitado a Pages Edit de esa cuenta y `BANK_CONTENT_KEY`; variable `CLOUDFLARE_PAGES_PROJECT`. El workflow no crea cuentas, no compra servicios y no cambia plan. La cuenta Cloudflare y estos valores todavía deben conectarse.

### Cuotas y 200 estudiantes

Workers/Pages Functions Free: 100.000 solicitudes diarias; CPU Free limitada. Pages Free: 500 builds/mes, 20.000 archivos y 25 MiB por archivo. Supabase Free: 500 MB de base de datos, 50.000 MAU, 5 GB de salida no cacheada, 5 GB cacheada y 500.000 invocaciones Edge/mes según documentación consultada el 24/10/2026. Son cuotas, no una garantía de capacidad.

Esta implementación evita Realtime permanente, guarda progreso con debounce y límite de 1 MiB por documento/2 MiB por usuario, indexa búsquedas y separa contenido estático del tráfico Supabase. La autorización de archivos se reutiliza hasta 30 segundos; las escrituras y la cuenta vuelven a comprobar la sesión y acceso. La licencia offline dura como máximo 12 horas y no puede sobrepasar el permiso verificado.

Con 200 estudiantes, el límite máximo lógico de progreso sería unos 400 MiB antes de índices y otros datos: vigilar tamaño real, salida, latencia y solicitudes desde el primer grupo. No se ha ejecutado una prueba de carga de 200 usuarios; no se garantiza que el uso concreto quepa siempre en Free. No contratar un plan sin autorización. Al agotar cuota se bloquea el acceso en lugar de revelar contenido.

## Dominio .cl y NIC Chile

`cachaste.cl` fue consultado en el WHOIS oficial de NIC Chile el 24/10/2026 y está registrado por un tercero (vencimiento publicado: 19/12/2026). No está disponible para una inscripción nueva. La búsqueda exacta de `cachastepaes.cl` no arrojó resultados y ofreció inscribirlo; es una alternativa disponible al momento de la consulta, sin reserva ni compra. La propuesta posterior del titular, `cachastelapaes.cl`, también fue consultada y la búsqueda exacta ofreció inscribirla. Aún no se elige ni registra el dominio definitivo. Consultar de nuevo y obtener autorización antes de registrar. Para el lanzamiento comercial se exige un .cl confirmado por el titular; `pages.dev` se reserva a pruebas.

1. Tras elegir y autorizar la compra del .cl, agregar la zona a Cloudflare **Free**, conservando cualquier registro de correo existente.
2. Copiar los dos nameservers que Cloudflare asigne a esa zona. No inventar nombres ni copiar los de otro dominio.
3. En NIC Chile, administrar el dominio y actualizar sus servidores DNS con esos dos nombres. No usar «Redirección web» como sustituto de DNS.
4. Esperar que Cloudflare confirme la zona activa.
5. En Pages > Custom domains, asociar primero el dominio raíz y `www`; seguir la creación de CNAME indicada por Pages. Crear solo un CNAME sin asociar el dominio al proyecto no completa la vinculación.
6. Confirmar HTTPS y certificados, dominio canónico y redirección `www` según lo aprobado. Mantener deshabilitada la publicación comercial hasta esa autorización.
7. Registrar la URL .cl exacta en los retornos Auth de Supabase y en `CACHASTE_WEB_ORIGIN`, los back URLs de los planes y los ajustes de Mercado Pago. No dejar comodines de producción.
8. Repetir Auth, restauración, checkout sandbox, cancelación, PWA y pruebas de acceso directamente sobre el dominio antes de activar ventas.

## Mercado Pago Chile

Planes de servidor: semanal $2.490/7 días; mensual $7.990/1 mes; anual $64.990/12 meses. No se acepta un precio enviado por el navegador. Los planes se consultan y validan contra el proveedor antes de crear una suscripción pendiente.

Secretos **solo Supabase Edge**: `MP_ACCESS_TOKEN`, `MP_COLLECTOR_ID`, `MP_WEBHOOK_SECRET`, `MP_PLAN_WEEKLY`, `MP_PLAN_MONTHLY`, `MP_PLAN_YEARLY`. Opcionales: `MP_PLAN_MONTHLY_TRIAL`, `CACHASTE_MP_TRIAL_ENABLED=true` únicamente si el plan oficial tiene `free_trial` de siete días exactos. `CACHASTE_WEB_ORIGIN` es el origen HTTPS definitivo; `CACHASTE_WEB_ADMIN_IDS` contiene UUID autorizados a reportes. Las claves built-in de Supabase se leen en el servidor.

Gates: `CACHASTE_MP_ENABLED=false`, `CACHASTE_MP_TAX_READY=false` por defecto. La base exige además `payments_enabled` y `tax_ready`; ningún cliente puede escribirlos. `CACHASTE_MP_MODE=production` exige token `APP_USR-`; `test` exige `TEST-`, permiso explícito de compras de prueba y entorno de base `test`. **Nunca poner la base compartida con Android en test**: usar localhost o un entorno de ensayo independiente para credenciales sandbox.

El acceso pagado deriva de pagos reales aprobados consultados a la API: importe, CLP, receptor, modo, referencia, suscripción y período deben coincidir. Una URL de retorno, un estado `authorized` sin pago, un campo Premium, un pago pendiente o reembolsado no bastan. La prueba de siete días se enlaza una sola vez por identidad y solo se ofrece cuando su plan está verificado. El acceso se revisa al entrar a la cuenta y por webhooks; una validación con más de 12 horas requiere renovarse contra el proveedor.

Configurar notificaciones oficiales de `subscription_preapproval`, `subscription_authorized_payment` y `payment` a `https://jmobinmdwrmdqrxtcruj.supabase.co/functions/v1/cachaste-mp-events`, con secreto HMAC. Se valida `x-signature`, `x-request-id`, `data.id`, cuerpo y antigüedad; se consultan los recursos canónicos y se deduplica después de aplicar correctamente para permitir reintentos. Revisar la firma real, datos MLC y permisos de la cuenta del titular en sandbox antes de habilitar producción. Las pruebas automatizadas del proveedor son simuladas; no se ha usado una cuenta Mercado Pago real.

Cancelar cambia el estado del proveedor y vuelve a verificar; conserva el tiempo pagado confirmado. Al eliminar una cuenta se borran progreso y vínculos personales, y el ledger contable privado conserva pagos sin usuario ni suscripción. La interfaz exige cancelar primero la renovación.

## Tributación persona natural

El titular venderá como persona natural; no se usa una empresa ajena. No se han ingresado RUT, credenciales tributarias ni un giro supuesto.

Antes de cambiar los gates: verificar Inicio de Actividades y giro con SII/contador; determinar si esta prestación concreta está afecta o exenta de IVA; definir documentación de ventas y notas de crédito que correspondan; configurar el emisor y conciliación. Que el contenido sea educativo no prueba por sí solo que esta suscripción califique para una exención. Los precios previstos no autorizan agregar IVA sorpresivamente en el checkout.

El administrador puede exportar CSV de pagos, montos brutos, comisiones y netos desde Mi cuenta. La exportación está limitada por UUID del servidor y neutraliza fórmulas de hojas de cálculo. No reemplaza boletas, facturas, notas de crédito ni declaraciones tributarias. No se ha conectado un emisor de documentos. Completar revisión de responsable, domicilio comercial, condiciones de contratación, conservación y tratamiento de menores antes de habilitar registro/ventas.

## Fuentes oficiales consultadas

- [Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [GitHub CI](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/), [Fail closed](https://developers.cloudflare.com/pages/functions/routing/), [dominios Pages](https://developers.cloudflare.com/pages/configuration/custom-domains/), [límites](https://developers.cloudflare.com/pages/platform/limits/).
- [Supabase Free y cuotas](https://supabase.com/docs/guides/platform/billing-on-supabase).
- [NIC Chile: servidores DNS](https://www.nic.cl/ayuda/faq/ins-05.html), [WHOIS](https://www.nic.cl/whois/).
- [Mercado Pago: suscripciones](https://www.mercadopago.cl/developers/es/docs/subscriptions/overview), [planes](https://www.mercadopago.cl/developers/es/reference/subscriptions/_preapproval_plan/post), [webhooks](https://www.mercadopago.cl/developers/es/docs/your-integrations/notifications/webhooks).
- [SII: Inicio de Actividades](https://www.sii.cl/destacados/ley_cumplimiento_obligaciones_tributarias/quienes_deben_inicio.html), [IVA de servicios](https://www.sii.cl/destacados/iva_prestacion_servicios/), [selección de actividad y documentos](https://www.sii.cl/preguntas_frecuentes/rut_inicio_actividades/001_105_0641.htm).
