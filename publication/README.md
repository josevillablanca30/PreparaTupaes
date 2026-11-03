# ¿Cachaste? · candidata 45 para prueba cerrada

Estado al 3 de noviembre de 2026. **1.5.0-rc18 / código 45** está compilada, firmada y verificada. Sustituye a la 44 para distribuir los enlaces legales actualizados. El titular realiza personalmente la carga en la misma app y prueba cerrada de Google Play.

- Fuente del AAB: `f75b92aa8e72738e23839dc8f5e690cba10922da`.
- Archivo: `Cachaste-1.5.0-rc18-45.aab`, 13.545.587 bytes.
- SHA-256: `ff603b05fde38085d224300fbb238cf28ebb23e84db78bf21a56c3cf48c31b60`.
- Certificado permanente: `a566926f01e79e5f75422b5c03c91b4337018e4f7987b32888c650ca7f271575`.
- [Compilación aprobada](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41689953231) · [Artefacto firmado](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41689953231/artifacts/13257472535).
- [Notas listas para copiar](notas-45.es-419.txt) · [Verificación](../reports/cachaste-rc18-verification.json) · [Piloto físico](prueba-dos-celulares.md).

El manifiesto real conserva cl.preparatupaes.app, API 36 y no habilita debuggable/testOnly. La descarga del ZIP coincide con su digest de Actions y la comprobación local independiente verificó las 265 entradas firmadas. Gate aprobado: 419 pruebas de lógica y 162 recorridos móviles, incluidos enlaces accesibles sin login y con acceso educativo vencido. No se entregó el AAB de la ejecución fallida inicial: su fixture omitía UTF-8; se corrigió sin debilitar la aserción ni cambiar el producto.

## Enlaces públicos y borrado

Las URL vigentes, con HTTP 200 sin autenticación, son:

- https://work-cachaste-web-comercial.cachaste-sitecacho.pages.dev/privacidad.html
- https://work-cachaste-web-comercial.cachaste-sitecacho.pages.dev/condiciones.html
- https://work-cachaste-web-comercial.cachaste-sitecacho.pages.dev/eliminar-cuenta.html

La app enlaza las tres desde competencia y planes. Android abre HTTPS con su manejador externo existente. La web conserva enlaces desde portada, cuenta, recuperación y shell educativo; su comprobación pública aprobó 24 casos sobre cuatro configuraciones de navegador, incluidas emulaciones de Android e iPhone. [Informe completo](https://github.com/josevillablanca30/PreparaTupaes/blob/b67d819e47a7b183df9e62dba7bf7794bbf533ad/web/reports/legal-audit-20261103/README.md).

Se aclaró la diferencia entre progreso Android local y progreso web, así como fotos, rankings, duelos, conservación y borrado. El borrado web retira primero la miniatura de Storage. La migración alojada 20261103175334 retira también la preautorización por hash del correo al confirmar el borrado de la cuenta por la app. La migración no borró cuentas ni cambió los permisos actuales. Para una solicitud manual por correo, el responsable debe comprobar miniatura, permiso por correo y datos vinculados además de Auth.

## Acceso gratuito y recuperación

Los ocho correos indicados por el titular quedaron preautorizados hasta el 3 de noviembre de 2027, sin crear cuentas Auth. Se conservaron las dos preautorizaciones previas; el acceso requiere registro y confirmación del mismo correo. Las identidades y hashes no se publican en Git.

La recuperación española sigue en https://work-cachaste-web-comercial.cachaste-sitecacho.pages.dev/recuperar . El titular confirmó su funcionamiento. No se tocaron SMTP ni credenciales Cloudflare; no corresponde renovar claves por el error histórico del informe rc16.

## Pendientes reales

- El titular sube el AAB 45 y valida un toque de sus enlaces, recuperación, foto y duelo en teléfonos físicos. Las pruebas de navegador son automatizadas.
- Google Play Console abrió una cuenta cerrada; no se pudieron releer sus URL o formulario actuales. El titular eligió completar manualmente los enlaces de privacidad/eliminación y Seguridad de los datos. La última cantidad autenticada observada fue dos testers; no se afirma que siga siendo la actual. Para producción se requiere cumplir la prueba cerrada y la revisión de Google.
- sitecacho.cl aún no devuelve registros A/AAAA/CNAME; no usarlo como una URL legal verificada hasta conectar su hosting. No se modificó DNS.
- Definir y documentar los plazos operativos reales de soporte, registros técnicos y respaldos. Antes de vender, completar datos del vendedor e información de contratación/devolución, configurar y probar el circuito comercial y obtener acceso a producción.

`billingReady=false`, `CACHASTE_PLAY_ENABLED=false` y el servidor de Play no habilita compras. No se activaron pagos ni infraestructura pagada y no se modificó Servicios Villablanca.
