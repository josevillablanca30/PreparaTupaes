# ¿Cachaste? · actualización de la prueba cerrada

Estado al 2 de noviembre de 2026. La app ya existe en Google Play y el titular realiza personalmente las cargas de AAB. La siguiente candidata es **1.5.0-rc16 / código 43**, con el mismo paquete `cl.preparatupaes.app`, API objetivo 36 y certificado de carga permanente.

El AAB 43 definitivo está firmado y verificado, fuente `a961e1f96450f77b482c8d2fb1c686206e9d4aa0`, SHA-256 `5ebac856932def2d8cf4ab5027574427b0caaeadc83f4f80e2f765da6999606f`. El resultado y los identificadores de evidencia se documentan en [el informe rc16](../docs/android-rc16-feedback-2026-11-02.md). No utilizar una compilación previa de 43 si el informe identifica una fuente corregida posterior.

## Actualizar la misma prueba

1. Revisar la [declaración de fotos opcionales](seguridad-datos.md) antes de distribuir esa función.
2. Abrir la app existente en Play Console, entrar a su prueba cerrada y cargar el AAB 43 definitivo como actualización. No crear otra ficha ni otra clave.
3. Copiar [las notas de la versión 43](notas-43.es-419.txt).
4. Actualizar desde Google Play los dos teléfonos inscritos y realizar [el piloto](prueba-dos-celulares.md).

## Correo y acceso de prueba

La app usa el acceso gratuito autorizado por el servidor para los testers existentes. `billingReady=false`; este piloto no necesita una compra, activar facturación ni un plan pagado de Supabase.

El flujo de recuperación admite correo y código dentro de la app, pero la recepción real sigue pendiente: los logs alojados muestran error SMTP **535: credenciales inválidas**. Antes se había guardado Resend como proveedor con `auth.sitecacho.cl`; hay que renovar/verificar su credencial privada en SMTP y recibir un correo real antes de considerar ese punto resuelto. No pegar claves en GitHub ni en conversaciones.

La recuperación de correo, la selección de foto desde Android y el duelo entre dos teléfonos se registran con resultados reales. Las pruebas automáticas no sustituyen ese piloto.

## Material de publicación

Se mantienen la ficha, productos, capturas educativas y documentos legales existentes. La política actual para fotos está publicada en https://cachaste-privacidad.jose-villablanca-hor.chatgpt.site/privacidad y la eliminación de cuenta en https://cachaste-privacidad.jose-villablanca-hor.chatgpt.site/eliminar-cuenta . Las capturas de competencia para la tienda deben usar participantes reales con permiso.

La activación futura de cobros y el lanzamiento de producción son etapas aparte. No se presentan compras, clasificaciones, pruebas físicas o aprobación pública de Google como completadas sin evidencia.
