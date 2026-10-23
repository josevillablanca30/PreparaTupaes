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
- Después del arreglo: 378 pruebas de lógica aprobadas y 54 pruebas de interfaz aprobadas entre Android Chrome y pantalla de 320 px. Incluyen compras pendientes, cancelación, pérdida de respuesta, compra previa al reinicio, restauración sin ofertas, reconexión, duelos, rankings, recuperación de contraseña y navegación educativa.
- Compilación estática aprobada: 95 archivos de distribución verificados; sin semillas privadas ni fixtures en el paquete público.
- Proyecto alojado consultado mediante lectura: 802 preguntas, 20 tablas con RLS, cero identidades, perfiles y suscripciones. El asesor de seguridad solo informa las 20 tablas privadas con RLS sin políticas, que deniegan deliberadamente el acceso directo; no se abrieron tablas.

Estas pruebas usan respuestas controladas para Google Play y no representan una compra, renovación o cancelación financiera real. El resultado Android instalado y las pruebas completas de CI deben consultarse en la ejecución correspondiente a esta revisión; no se reutilizan las cifras de rc2 como evidencia de rc3.

## Cierre comercial pendiente

Permanecen pendientes los productos y credenciales oficiales de Google Play, SMTP y retorno HTTPS, enlaces legales definitivos, firma comercial y validación con dos suscripciones auténticas. La beta permite revisar el aprendizaje local; antes de distribuir comercialmente también debe comprobarse la restricción de acceso a todas las materias del paquete release según el modelo comercial, además de la protección competitiva del servidor. No se declara esta candidata lista para venta.

No se activó ningún cobro, suscripción ficticia ni prueba de pago en el proyecto alojado.
