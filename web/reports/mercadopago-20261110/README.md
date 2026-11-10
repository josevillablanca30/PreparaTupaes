# Mercado Pago — auditoría del 10 de noviembre de 2026

La integración continúa sobre la web existente. Los cobros reales permanecen deshabilitados. Las pruebas sandbox no otorgan acceso de pago en producción.

## Código y pruebas automatizadas

Código validado: [c474b81c95bbdc0181d7ef4cda2b05c9e21d2ce1](https://github.com/josevillablanca30/PreparaTupaes/commit/c474b81c95bbdc0181d7ef4cda2b05c9e21d2ce1), rama `work/cachaste-web-unificada-20261106`.

La [ejecución 42818360586](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/42818360586) terminó satisfactoriamente en todos sus jobs:

| Verificación ejecutada | Resultado |
| --- | --- |
| Lógica original y compatibilidad | 403/403 |
| Backend web, base de datos, facturación y seguridad | 161/161 |
| Desktop Chrome | 51/51 |
| Android Chrome | 51/51 |
| iPhone WebKit | 51/51 |
| Pantalla de 320 px | 51/51 |
| Auth, PostgREST, persistencia y dos jugadores por HTTP real en Supabase local efímero | 9/9 web y 17/17 competencia |
| Construcción de cinco materias y protección de contenido | 124 archivos cifrados autenticados; 0 archivos educativos en texto público; clave ausente del Worker |

Los navegadores se ejecutaron en GitHub Actions; no equivalen a teléfonos físicos. El conjunto adicional con Supabase alojado se distingue más abajo de estas pruebas. La evidencia y capturas se conservan en los artefactos de la ejecución durante 14 días.

## Despliegue comprobado

La [publicación 42818360679](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/42818360679) terminó satisfactoriamente. La versión inmutable es [de4e67d5.cachaste-sitecacho.pages.dev](https://de4e67d5.cachaste-sitecacho.pages.dev); el alias de la rama es [work-cachaste-web-unificada.cachaste-sitecacho.pages.dev](https://work-cachaste-web-unificada.cachaste-sitecacho.pages.dev).

Se comprobaron **268/268 verificaciones HTTPS** contra esa publicación: revisión exacta, cuenta y recuperación públicas, CSP, caché, documentos legales, PWA, cobros cerrados, denegación de sesiones falsas y protección de todos los archivos educativos y sus cifrados. Además, las páginas legales pasaron **24/24 verificaciones** en navegadores reales contra el despliegue. Evidencia persistida en [pages-preview.json](pages-preview.json), [legal-live.json](legal-live.json) y [billing-evidence.json](billing-evidence.json).

**`sitecacho.cl` todavía no está conectado.** El paso opcional de dominio falló con `ACTIVE_SITE_CACHO_ZONE_REQUIRED`; no modificó DNS ni asoció dominios. El estado satisfactorio global de la publicación acredita Pages y no acredita el dominio personalizado.

El [diagnóstico de solo lectura 42819924209](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/42819924209), conservado en [sitecacho-domain-audit.json](sitecacho-domain-audit.json), obtuvo `200` de Cloudflare pero ninguna zona visible llamada `sitecacho.cl`, con o sin el filtro de la cuenta Pages. Los NS públicos son `johnny.ns.cloudflare.com` y `maxine.ns.cloudflare.com`. Esto no permite distinguir por sí solo entre permisos del token y una zona en otra cuenta: se requiere acceso personal a la cuenta que administra esa zona. No se cambió ningún nameserver, cuenta, zona ni credencial.

La configuración publicada mantiene registro nuevo, Google y retorno Auth de apertura deshabilitados (`signupEnabled=false`, `googleAuthEnabled=false`, `authReturnReady=false`). La pantalla de ingreso existente se conserva; no se declara una apertura pública de registros.

## Cambios comprobados

- Administración unificada mediante `auth.users.raw_app_meta_data.role` y consulta actual a la base de datos. Los metadatos editables y un JWT antiguo no permiten adquirir ni conservar el rol administrativo.
- Checkout alojado corregido: el proveedor rechazaba la versión 4 porque solicitaba un `card_token_id` al usar un plan asociado. El checkout pendiente usa la recurrencia de un catálogo validado en servidor; los datos de tarjeta se ingresan en Mercado Pago.
- Sandbox separado con vendedor de prueba verificado, compradores de prueba, validación de importes y recurrencia, idempotencia, cancelación y conciliación. Las tablas privadas no tienen permisos para clientes.
- Webhooks con firma HMAC, antigüedad máxima, consulta canónica al proveedor y deduplicación después del procesamiento correcto. Las entregas que fallan siguen siendo reintentables.
- Conciliación de facturas con la paginación que realmente acepta el proveedor, incluyendo historiales de más de cincuenta renovaciones.
- Reintento de checkout permitido únicamente tras rechazos definitivos y sin una suscripción vinculada. Un fallo ambiguo de red o del proveedor no crea otra suscripción. Se conserva la oferta de prueba original.
- La cancelación y la conciliación siguen disponibles al cerrar nuevas ventas. Cancelar conserva el periodo ya verificado y desactiva las renovaciones futuras.
- El acceso ya pagado se verifica independientemente de que nuevas ventas estén abiertas. Ninguna autorización pendiente ni pago rechazado, reembolsado o de otro usuario concede un periodo pagado.
- Se preservó la corrección visual aprobada en el commit `13ad032704290e34ded824dc8deb82756f83e102` y la protección del contenido de las cinco materias.

## Testers sin cobros

La base de datos contiene **10 beneficios identificables**, frente a los 12 testers esperados. Ocho ya duraban un año; dos vencían al mes y se extendieron hasta un año desde su otorgamiento original. Los diez beneficios son ahora anuales y no se renuevan mediante cobros.

La web muestra su vigencia y bloquea contratar una suscripción mientras el beneficio está activo. El backend y un trigger de base de datos aplican la misma protección. Las dos identidades restantes no están disponibles en el registro recuperado; no se inventaron ni se marcaron como incorporadas.

## Ejecución contra servicios reales de prueba

La evidencia detallada está en [live-sandbox.json](live-sandbox.json), tomada a las **12:23:04 UTC**. Se ejecutaron **22 comprobaciones satisfactorias** con Supabase alojado y la API de Mercado Pago de prueba:

- Dos sesiones Auth reales temporales; denegación anónima, de alumno y de metadatos administrativos falsificados.
- Validación del vendedor como `test_user` y de los cuatro planes.
- Creación de checkout alojado pendiente, reutilización del mismo identificador al reintentar y ausencia de acceso por una autorización pendiente.
- Token de tarjeta oficial de prueba y suscripción autorizada mediante la API oficial de plan asociado. Activación del periodo de prueba en el registro sandbox y comprobación de que no habilita aprendizaje de producción.
- Notificación **simulada y firmada** procesada contra una suscripción real de prueba, repetición idempotente y rechazo de firma falsa.
- Cancelación mediante la función desplegada, `renews=false`, conservación del vencimiento y denegación de cancelaciones ajenas.
- Revocación administrativa efectiva incluso con un JWT existente.

Las dos suscripciones de prueba quedaron canceladas y las dos cuentas Auth temporales fueron eliminadas. No se registraron compras de producción. El campo `providerLiveMode=true` de la tokenización corresponde a las credenciales de una cuenta marcada por Mercado Pago como `test_user`; no representa un cobro real ejecutado.

La [auditoría de base de datos](database-audit.json), a las **12:52:50 UTC**, confirma cero pagos de producción, cero suscripciones de producción, cero checkouts sandbox residuales y cero cuentas Auth temporales. `payments_enabled`, `tax_ready` y `allow_test_purchases` siguen en `false`.

## Límites de la verificación

- **Entrega real de webhook de Mercado Pago pendiente:** falta configurar `MP_TEST_WEBHOOK_SECRET`; el endpoint sandbox devuelve 503 mientras falte. La notificación firmada simulada no acredita una entrega del proveedor. El panel de desarrolladores respondió `403 Forbidden` en el navegador disponible.
- **Autorización interactiva del comprador pendiente:** el checkout alojado se creó, pero no se completó el ingreso y aprobación del comprador en su interfaz. La autorización satisfactoria citada arriba se hizo mediante la API oficial de plan asociado con tarjeta de prueba.
- **Renovación por calendario no ejecutada:** se probaron renovaciones, rechazos, reembolsos y vencimientos con escenarios canónicos locales; no se esperó una fecha futura para recibir un cargo recurrente del proveedor.
- La suite adicional de navegador con Supabase alojado requiere `SUPABASE_ACCESS_TOKEN`, ausente en CI. La alternativa verifica evidencia API realmente ejecutada y reciente, hashes de las funciones, limpieza y denegaciones actuales. Registra expresamente que esa suite adicional **no se ejecutó**.
- El asesor de Supabase mantiene una advertencia previa por protección contra contraseñas filtradas deshabilitada. No se modificó la configuración de Auth. [Referencia de Supabase](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

## Funciones publicadas en Supabase

| Función | Versión |
| --- | ---: |
| `cachaste-mercadopago` | 20 |
| `cachaste-mp-events` | 22 |
| `cachaste-mp-sandbox-checkout` | 7 |
| `cachaste-mp-sandbox-events` | 3 |
| `cachaste-mp-test-readiness` | 32, retirado; responde 404 |

Las fuentes compartidas de las dos funciones sandbox fueron comparadas con el código publicado. El mecanismo temporal de QA se retiró. No se rotaron credenciales de producción ni se habilitaron pagos reales.
