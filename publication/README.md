# ¿Cachaste? · candidata 44 para prueba cerrada

Estado al 3 de noviembre de 2026. **1.5.0-rc17 / código 44** está compilada, firmada y verificada. El titular sube personalmente el AAB a la app y prueba cerrada existentes. La última revisión de Play Console encontró activa la 42; la 43 no estaba cargada.

- Fuente: `39ce5e21c848420191cb45e75defa2e6637a74a1`.
- Archivo: `Cachaste-1.5.0-rc17-44.aab`, 13.545.240 bytes.
- SHA-256: `e6843265954760650e177821bac1cdebbf206168132d6760f922c9d099d10fb9`.
- [Compilación aprobada](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41642178471) · [Artefacto firmado](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41642178471/artifacts/13233398562).
- [Notas listas para copiar](notas-44.es-419.txt) · [Informe y pruebas](../docs/android-rc17-cierre-2026-11-03.md) · [Verificación](../reports/cachaste-rc17-verification.json).

Se conserva el paquete `cl.preparatupaes.app`, API objetivo 36 y certificado de carga permanente. No crear otra app o clave. Actualizar la misma prueba y después realizar [el piloto real en dos teléfonos](prueba-dos-celulares.md).

## Recuperación y testers

La recuperación está publicada en https://work-cachaste-web-comercial.cachaste-sitecacho.pages.dev/recuperar . El correo está en español, con botón y código. El titular confirmó que funciona: el error SMTP 535 del informe rc16 es histórico y no requiere renovar credenciales.

La candidata 44 pide el retorno HTTPS explícito y acepta el código o el enlace nuevo pegado dentro de Android. Se verifica mediante Supabase Auth. El correo alojado no se volvió a configurar; SMTP y tokens de Cloudflare no se tocaron.

El servidor ya permite acceso de hasta un año calendario para los testers que indique el titular. La migración no otorgó ni extendió acceso a nadie: conserva las dos preautorizaciones existentes. La nueva lista de correos todavía no se recibió.

## Pendientes reales

1. **Seguridad de los datos:** la última revisión encontró incorrectamente «no se recopilan datos». La edición no se guardó ni envió; se perdió la sesión y el titular optó por completar Play Console manualmente. [Respuestas preparadas](seguridad-datos.md). Resolver antes de distribuir la actualización.
2. **Prueba cerrada:** había dos inscritos. La cuenta exige doce testers durante catorce días continuos y luego solicitar acceso a producción, sujeto a revisión de Google.
3. **Pagos:** falta el perfil de comerciante y Google bloquea crear suscripciones hasta completarlo. El titular debe ingresar su identidad legal y datos de abono.
4. **Venta:** después del perfil, configurar productos/verificación de Play y probar compra de licencia, restauración, cancelación y notificaciones. Recién entonces habilitar Billing en una nueva candidata. No hay una compra real verificada.

`billingReady=false`, `CACHASTE_PLAY_ENABLED=false` y el verificador alojado responde `ready:false`. No se activaron cobros ni infraestructura pagada. La candidata está técnicamente lista para prueba gratuita; no se declara habilitada para venta. No se modificó Servicios Villablanca.
