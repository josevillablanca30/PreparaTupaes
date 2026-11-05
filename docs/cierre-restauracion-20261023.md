# Recuperación de compras y continuidad de cuenta — candidata rc3

Se continúa desde `25dc950bf0a339b943fbe9c8556078d156b12046`, último commit remoto de `work/cachaste-motor-duolingo-20261016`. Esta pasada no modifica preguntas, respuestas, progreso ni arte aprobado. La candidata Android pasa a 1.5.0-rc3, código 30.

## Problemas reproducidos y corregidos

- Un pago pendiente o una respuesta de verificación perdida dejaban habilitada otra compra. Ahora la compra permanece bloqueada hasta conocer y validar el estado de Google Play; Restaurar compras sigue disponible.
- Si la recuperación automática del recibo fallaba al abrir la pantalla, Restaurar compras también quedaba bloqueado. Ahora se puede reintentar sin reiniciar la aplicación ni contratar nuevamente.
- La restauración dependía de obtener ofertas para compras nuevas. Ahora una cuenta puede recuperar su compra aunque no haya ofertas disponibles.
- Un fallo consultando las compras existentes dejaba incierto si ya había una compra. Se bloquea otra contratación hasta que la restauración responda correctamente.
- La reconexión durante una respuesta de Play podía dejar la pantalla sin posibilidad de restaurar. La reconexión se procesa al terminar la operación en curso, sin abrir otro diálogo de compra.
- La caída del verificador abortaba la carga del perfil. Ahora permite administrar el perfil y continuar el flujo de eliminación o recuperación de cuenta, manteniendo cerrado el acceso competitivo. Una sesión Auth inválida elimina de memoria la identidad y el perfil anteriores.

Se quitó la etiqueta comercial «Premium» de esta pantalla para respetar el modelo de acceso completo por suscripción. Se conservan los tres precios acordados y la prueba mensual sujeta a elegibilidad.

## Verificación local

- Base original: 375 pruebas de lógica aprobadas. Las regresiones nuevas fallaron antes del arreglo: tres de cliente y cinco escenarios de interfaz Android.
- Después del arreglo: 382 pruebas de lógica aprobadas y 54 pruebas de interfaz aprobadas entre Android Chrome y pantalla de 320 px. Incluyen compras pendientes, cancelación, pérdida de respuesta, compra previa al reinicio, restauración sin ofertas, reconexión, duelos, rankings, recuperación de contraseña y navegación educativa.
- Compilación estática aprobada: 95 archivos de distribución verificados; sin semillas privadas ni fixtures en el paquete público.
- Proyecto alojado consultado mediante lectura: 802 preguntas, 20 tablas con RLS, cero identidades, perfiles y suscripciones. El asesor de seguridad solo informa las 20 tablas privadas con RLS sin políticas, que deniegan deliberadamente el acceso directo; no se abrieron tablas.

Estas pruebas usan respuestas controladas para Google Play y no representan una compra, renovación o cancelación financiera real. El resultado Android instalado y las pruebas completas de CI deben consultarse en la ejecución correspondiente a esta revisión; no se reutilizan las cifras de rc2 como evidencia de rc3.

## Acceso educativo comercial

El paquete `cl.preparatupaes.app` exige un permiso nativo para las seis rutas educativas que cubren las cinco materias y el inicio. La aplicación lo obtiene por HTTPS directamente desde `cachaste_access`, autenticado con la sesión de Auth; no acepta un estado Premium enviado por JavaScript. El permiso queda limitado por la vigencia de servidor y de la sesión, con un máximo de doce horas y un margen de red. Se mide con reloj monotónico: cambiar la fecha del teléfono no lo extiende; un reinicio del teléfono obliga a volver a verificar. Se comprueba al abrir páginas, retomar la aplicación y durante el uso. Cerrar sesión lo elimina; un fallo temporal de red no extiende el permiso anterior. La beta conserva el acceso educativo de revisión. Perfil, recuperación, eliminación y restauración permanecen accesibles sin suscripción.

La tercera migración, `20261023164550_cachaste_education_access.sql`, está aplicada. El servidor rechaza el acceso anónimo y el cliente no puede modificar suscripciones. No se crearon usuarios ni derechos comerciales de prueba. Se añadieron pruebas PostgreSQL por cuenta, pruebas nativas de reloj/caducidad y una ejecución instalada con el identificador comercial, separada del APK beta. Esta última no inicia compras ni usa el proyecto alojado para fabricar permisos.

## Cierre comercial pendiente

Permanecen pendientes los productos y credenciales oficiales de Google Play, SMTP y retorno HTTPS, enlaces legales definitivos, firma comercial y validación con dos suscripciones auténticas. La aprobación instalada del control comercial y el flujo completo con compras oficiales deben verificarse antes de distribuir. No se declara esta candidata lista para venta.

No se activó ningún cobro, suscripción ficticia ni prueba de pago en el proyecto alojado.

El verificador de compras no consume el límite de comprobaciones de Google al navegar con recibos ya verificados hace menos de cinco minutos; solo lo consume al verificar una compra o actualizar un lote desactualizado. Se reprodujeron 25 consultas de estado sin agotar esa cuota y un lote de dos recibos con un único cargo a la cuota, usando respuestas controladas. La función alojada `cachaste-play` está en versión 3; salud real `ready:false`, petición sin Auth 401 y configuración pendiente 503. No se activaron cobros.

## Entrega Android verificada

La candidata `Cachaste-v1.5.0-rc3.apk` corresponde al código `71dcb5c0510a5c1c0a7ce7d7528690f5a832b040`, versión 1.5.0-rc3 / código 30. SHA-256 `d8f67387487fb896d6e7139fffcbe5ba21b285e7476c7f2ee03801ae74e1d4c0`; 13691373 bytes. Conserva el certificado beta `06fea3ef23af90358868d6c7edf877a871404027e1f7104036ed25ff7b05df22` de las versiones anteriores.

Aprobadas: 382 pruebas de lógica, 387 Android Chrome y 387 de 320 px; 29 pruebas de APK instalada en Android 16 y 5 del control comercial instalado, sin fallos ni omisiones. Integración de dos cuentas Auth/PostgREST reales locales: 16 comprobaciones aprobadas. Revisadas 65 capturas nativas mediante seis contactos. El APK no incluye fixtures, semillas SQL ni claves privadas. La prueba WebKit seguía preparando el entorno al cerrar esta entrega; no se afirma aprobada para rc3.

Evidencia: [Android y control comercial](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39992131027), [navegadores](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39992131079), [Auth real local](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39992131048), [firma y revisión](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39992243059). El estado detallado queda en `reports/cachaste-rc3-verification.json`.

El repositorio se comprobó público al cerrar. Cambiarlo a privado sigue pendiente y no se simula como realizado. La candidata permite revisar la beta; aún no es una publicación comercial con cobros reales.
