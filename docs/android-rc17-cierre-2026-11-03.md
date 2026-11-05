# rc17 / 44 · cierre técnico de prueba gratuita

Fuente `39ce5e21c848420191cb45e75defa2e6637a74a1`, rama Android existente. Conserva cinco materias, 802 preguntas, identidad visual, gatito, fotos, duelos y rankings.

## Cambios

- Recuperación Android con retorno HTTPS explícito a `/recuperar`. Acepta el código, enlace oficial de Supabase o nuevo enlace español con `token_hash` en fragmento. Usa `verifyOtp`; rechaza otro origen/ruta, tipo incorrecto, parámetros ambiguos y credenciales en URL.
- Plantilla y helper de correo Android alineados con la recuperación española ya comprobada. El helper no se volvió a ejecutar contra Auth; no se tocó SMTP. Previene localhost y retornos sin autorización.
- Migración alojada `20261103130224_cachaste_annual_tester_access`: máximo un año calendario para permisos administrativos de testers. No cambia filas, RLS, permisos, verificación comercial ni licencia local de hasta doce horas.
- Versión 44 / rc17, controles de recuperación y Billing incluidos en el gate del AAB. Cobros cerrados en configuración, build nativo y servidor.

## Paquete y pruebas

`Cachaste-1.5.0-rc17-44.aab`, 13.545.240 bytes. SHA-256 `e6843265954760650e177821bac1cdebbf206168132d6760f922c9d099d10fb9`. Sus 265 entradas están firmadas por el certificado permanente `a566926f01e79e5f75422b5c03c91b4337018e4f7987b32888c650ca7f271575`.

El ZIP descargado coincide con el digest oficial. La comprobación local independiente de firma completa y manifiesto aprobó: paquete `cl.preparatupaes.app`, código 44, nombre rc17, target 36, sin debuggable/testOnly. [Datos verificables](../reports/cachaste-rc17-verification.json).

| Ejecución | Resultado |
| --- | --- |
| [AAB 41642178471](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41642178471) | 418 pruebas de lógica, 158 recorridos móviles del gate, Postgres/RLS y dos cuentas Auth/PostgREST reales en servidor efímero; lint, bundletool, firma y manifiesto aprobados |
| [Interfaz 41642178446](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41642178446) | 433 casos aprobados en cada proyecto: Android-Chrome, iPhone-WebKit y mobile-320px |
| [Android 41642178397](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41642178397) | APK instalado en emulador Android 36: WebView sin red, persistencia y Atrás; acceso comercial a cinco materias sin compras. También 494 recorridos móviles y 12 de VS local exclusivo de beta |
| Servidor alojado | Migración anual aplicada, dos preautorizaciones previas y cero permisos UUID. RLS y denegación a clientes conservadas; nadie recibió un permiso nuevo ni extensión |
| Producción web | `/recuperar` devuelve HTTP 200; Play devuelve `ready:false`, paquete/producto correctos |

Los escenarios de interfaz/Billing son automatizados. Las identidades de integración pertenecen al servidor temporal; no equivalen a estudiantes reales ni compras. Auditoría de 802 ítems: cero críticos automáticos y veinte observaciones heurísticas; no equivale a revisión humana exhaustiva.

El titular confirmó recuperación web funcionando tras el correo español. Falta repetir recuperación, fotos y duelo en dos teléfonos sobre el AAB 44 instalado. No se verificó una compra real. [Piloto físico](../publication/prueba-dos-celulares.md).

## Google Play y venta

Última revisión: prueba cerrada activa con 42 / rc15 y dos inscritos; 43 no cargada. Producción bloqueada hasta doce testers durante catorce días continuos y revisión de Google.

Falta perfil de comerciante, por lo que Google bloquea crear suscripciones. El titular debe ingresar identidad legal y datos de abono. [Productos y precios definidos](../publication/monetizacion-20261103.json) preparados, sin activar compras.

La declaración de datos mostraba «no se recopilan datos». La edición no se guardó/envió antes de perder la sesión. El titular optó por ingresar Google Play manualmente; se dejó [la corrección preparada](../publication/seguridad-datos.md). No se declara recibida por Google.

El titular sube el AAB. Candidata verificada para prueba gratuita; venta pendiente de pagos comprobados y aprobación de producción. Servicios Villablanca, SMTP, tokens Cloudflare y planes pagados no se modificaron.
