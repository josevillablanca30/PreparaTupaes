# Preparación de ¿Cachaste? para Google Play

El AAB firmado de esta entrega sirve para la **carga inicial de configuración en pruebas internas**. Conserva el identificador comercial `cl.preparatupaes.app`, versión 1.5.0-rc5/código 32, objetivo Android 16/API 36 y la clave de carga original.

**No es todavía la versión habilitada para ventas.** En este AAB, `CACHASTE_PLAY_ENABLED` y `billingReady` permanecen desactivados. El paquete comercial exige una suscripción válida para abrir el contenido; subir este archivo por sí solo no habilita los duelos ni las compras. Hace falta configurar los productos y credenciales oficiales, el acceso por correo y los enlaces legales, y generar la siguiente compilación habilitada para probarla en los dos celulares.

## Qué queda preparado

- AAB comercial firmado, certificado público y comprobación de que firmar no cambió la aplicación.
- Ficha en español: nombre, descripción breve, descripción completa y notas de versión.
- Ícono PNG 512 × 512 y gráfico PNG 1024 × 500, exportados con los activos existentes.
- Ocho capturas nativas 1080 × 1920 de funciones educativas reales. No se usan rivales, perfiles ni resultados competitivos de las fixtures. Faltan las capturas de duelos con las dos cuentas reales.
- Configuración de producto y planes, guía para los dos celulares, borradores legales y propuesta de Seguridad de los datos.
- Lista concreta de datos y verificaciones pendientes. No se asigna una clasificación IARC ni se afirma que Play haya aprobado nada.

La actualización de comunidad ya está aplicada al servidor alojado y comprobada: las tablas nuevas permanecen privadas y el despachador anterior no admite llamadas de clientes. El detalle de operación está en `moderacion.md`.

El titular confirmó la creación de su cuenta Play Console con `jose.villablanca.horta@gmail.com`; se usará el mismo correo como soporte público. El tipo de cuenta, verificación de identidad y existencia de la ficha todavía deben comprobarse dentro de Console.

## Orden de trabajo

1. **Cuenta del titular creada.** Entrar a Play Console con `jose.villablanca.horta@gmail.com` y comprobar el estado de identidad, inscripción y tipo de cuenta. La creación fue informada por el titular; no se afirma haber inspeccionado Console. No crear cuentas ficticias para cumplir pruebas.
2. **Crear o seleccionar la app.** Comprobar primero que no exista una ficha para `cl.preparatupaes.app`. Usar el nombre preparado, español y categoría Educación. La descarga se configura como gratis con suscripción dentro de la app; no es un plan gratuito de acceso al contenido.
3. **Primera carga interna.** Activar Play App Signing y cargar el AAB firmado. Registrar el certificado de carga correcto; Play App Signing usa además su propia clave de distribución. Esta carga permite continuar la configuración de la app, no acredita la validación comercial.
4. **Productos y servidor.** Configurar los planes de `productos.csv`, cuenta de servicio de Google Play Developer API y notificaciones RTDN/Pub/Sub. Colocar los secretos solo en el servidor siguiendo `docs/competition-operations.md`. Comprobar que el verificador deje de responder `ready:false`.
5. **Acceso y documentos.** Confirmar titular, correo de soporte y dominio. Publicar privacidad y eliminación en URLs HTTPS, enlazarlas dentro de la app, configurar SMTP y recuperación de contraseña y probar los correos en Android.
6. **Compilación habilitada.** Generar el siguiente código de versión con Google Play Billing y configuración pública habilitados, únicamente después de comprobar el servidor. Firmar con la misma clave y cargar en la pista interna. No sustituir el acceso verificado por un indicador Premium local.
7. **Dos celulares.** Usar dos cuentas reales, registradas como participantes de la pista y como verificadores de licencia. Completar la compra de licencia con el instrumento de prueba, restauración y un duelo íntegro según la guía. No registrar identidades ni cobros inventados.
8. **Acceso público.** Completar los formularios de Play y la prueba cerrada aplicable a la cuenta, responder con resultados reales y revisar el lanzamiento. Publicar solo después de resolver los pendientes enumerados.

## Datos que faltan del titular

| Dato | Uso |
| --- | --- |
| Estado y tipo de cuenta Play Console | Identidad, pista y requisitos de acceso a producción |
| Nombre público y responsable legal | Ficha y documentos legales |
| Correo de soporte confirmado: `jose.villablanca.horta@gmail.com` | Ficha, privacidad y solicitudes de eliminación |
| Dominio o sitio autorizado | Publicar privacidad, eliminación y recuperación HTTPS |
| Dos correos Google de quienes probarán | Pista interna y verificadores de licencia |

Estos datos no se rellenan con valores supuestos. La cuenta de Google del teléfono y la cuenta de acceso a ¿Cachaste? cumplen funciones distintas: Google administra las compras; el acceso a ¿Cachaste? vincula los recibos y el duelo con cada estudiante.

## Fuentes oficiales revisadas el 23 de octubre de 2026

- API objetivo: https://developer.android.com/google/play/requirements/target-sdk
- Pruebas de cuentas personales: https://support.google.com/googleplay/android-developer/answer/14151465?hl=es-419
- Recursos de la ficha: https://support.google.com/googleplay/android-developer/answer/9866151?hl=es-419
- Compras de licencia: https://developer.android.com/google/play/billing/test
- Seguridad de los datos: https://support.google.com/googleplay/android-developer/answer/10787469?hl=es-419
- Eliminación de cuenta: https://support.google.com/googleplay/android-developer/answer/13327111?hl=en

Las condiciones de la cuenta deben verificarse en su Console. Las pruebas automáticas aprobadas no sustituyen una compra auténtica de licencia ni una sesión entre dos teléfonos físicos.
