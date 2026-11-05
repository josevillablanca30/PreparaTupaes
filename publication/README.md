# ¿Cachaste? · candidata 47 para prueba cerrada

Estado al 4 de noviembre de 2026. **1.5.0-rc20 / código 47** está compilada, firmada y verificada. Unifica recorrido, progreso, lecciones y ensayos con la identidad oscura violeta/dorada de la portada aprobada. Conserva las correcciones de la candidata 46, el contenido, el progreso y las funciones educativas. El titular realiza la carga en la misma app y prueba cerrada de Google Play.

- Fuente del AAB: `13ae26d3f752ccc6f3de97086dee07cb938ac3fc`.
- Archivo: `Cachaste-1.5.0-rc20-47.aab`, 13.550.073 bytes.
- SHA-256: `2d8343aaec8320e85a7a8b13860b1586861ab085c0e2f60631caedb594842894`.
- Certificado permanente: `a566926f01e79e5f75422b5c03c91b4337018e4f7987b32888c650ca7f271575`.
- [Compilación aprobada](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41954301999) · [Artefacto firmado](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41954301999/artifacts/13381444844).
- [Notas listas para copiar](notas-47.es-419.txt) · [Auditoría y alcance](../reports/night-identity-20261104/README.md) · [Piloto físico](prueba-dos-celulares.md).

El manifiesto real conserva cl.preparatupaes.app, API 36 y no habilita debuggable/testOnly. El ZIP coincide con su digest de Actions y la comprobación local independiente verificó las 265 entradas firmadas. Pasaron 429 pruebas de lógica y 188 recorridos móviles automatizados, además de la integración Auth/duelos en un entorno efímero.

El servidor de duelos ya contiene los cuatro cuerpos corregidos. Sus 802 hashes de evaluación coinciden con el catálogo de esta versión. Se conservan claves, alternativas e índices correctos; las tres evaluaciones cuyo enunciado o figura cambió archivan la versión previa para el historial. No es una certificación de ausencia de errores conceptuales.

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

- El titular sube el AAB 47 y valida un toque de sus enlaces, recuperación, foto y duelo en teléfonos físicos. Las pruebas de navegador son automatizadas.
- Google Play Console abrió una cuenta cerrada; no se pudieron releer sus URL o formulario actuales. El titular eligió completar manualmente los enlaces de privacidad/eliminación y Seguridad de los datos. La última cantidad autenticada observada fue dos testers; no se afirma que siga siendo la actual. Para producción se requiere cumplir la prueba cerrada y la revisión de Google.
- sitecacho.cl aún no devuelve registros A/AAAA/CNAME; no usarlo como una URL legal verificada hasta conectar su hosting. No se modificó DNS.
- Definir y documentar los plazos operativos reales de soporte, registros técnicos y respaldos. Antes de vender, completar datos del vendedor e información de contratación/devolución, configurar y probar el circuito comercial y obtener acceso a producción.

`billingReady=false`, `CACHASTE_PLAY_ENABLED=false` y el servidor de Play no habilita compras. No se activaron pagos ni infraestructura pagada y no se modificó Servicios Villablanca.
