# Auditoría de enlaces legales · 3 de noviembre de 2026

Las tres URL públicas son:

- https://work-cachaste-web-comercial.cachaste-sitecacho.pages.dev/privacidad.html
- https://work-cachaste-web-comercial.cachaste-sitecacho.pages.dev/condiciones.html
- https://work-cachaste-web-comercial.cachaste-sitecacho.pages.dev/eliminar-cuenta.html

Responden HTTP 200 directo, con el documento correspondiente y sin autenticación. No se confundió un fallback de portada con una página legal. La navegación desde portada, cuenta y recuperación se probó sobre la versión pública, con contexto nuevo sin sesión en cada motor. La navegación del shell educativo y el borrado se ejercitaron con identidades aisladas en QA.

Fuente desplegada: `276ee9f209a57a298a1d6166f805e20219e29ecb`. [Despliegue aprobado](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41689796792). [QA completa aprobada](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41689796905). 120 pruebas unitarias web; cuatro proyectos de navegador aprobados; 208 verificaciones HTTP y 24 comprobaciones reales de las páginas publicadas. Android-Chrome y iPhone-WebKit son emulaciones de navegador, no teléfonos físicos. [Evidencia HTTP](public-http.json), [resultado del despliegue](pages-preview.json), [comprobación real de navegadores](legal-live.json), [captura pública](eliminacion-publicada.png).

## Correcciones y correspondencia con los datos

Se conservaron diseño, identidad y recursos de la web existente. Se agregaron las tres páginas a las entradas de cuenta, recuperación y shell educativo. El título de privacidad ahora identifica expresamente la política. La eliminación muestra primero una solicitud por correo sin login ni reinstalación, además de los pasos exactos en Perfil y la eliminación parcial. El botón mailto abre un compositor: no se envió un correo ni se fingió una solicitud recibida.

Los textos distinguen cuenta Auth y sesiones, nickname, comuna/región manual sin GPS, miniatura pública opcional de 256×256/32 KiB (original hasta 5 MiB que no se sube), rankings, respuestas y tiempos competitivos, denuncias/bloqueos, progreso Android local y documentos web sincronizados. Describen Supabase, Cloudflare y Resend, procesamiento fuera de Chile y cobros actualmente cerrados.

La web antigua no retiraba la foto al eliminar una cuenta creada con Android. El adaptador web ahora usa el método oficial de Supabase Storage para retirar únicamente `<usuario>/avatar.webp` antes del RPC de borrado, también con acceso educativo vencido. Las pruebas verifican esa secuencia para perfil y cuenta; no se borraron usuarios reales para probarla.

La preautorización de tester por hash de correo tampoco desaparecía con el RPC de eliminación. Se aplicó la migración `20261103175334` al proyecto alojado y se probó localmente con cuentas sintéticas: una confirmación incorrecta no borra; la correcta elimina solo el permiso propio, cuenta y sesiones. Las dos cuentas actuales y diez permisos de correo permanecen intactos. No se cambiaron RLS ni controles de confirmación/reautenticación y no aparecieron avisos de seguridad nuevos.

## Android

Fuente `f75b92aa8e72738e23839dc8f5e690cba10922da`, AAB 45 / 1.5.0-rc18. Enlaces HTTPS públicos en competencia y planes, disponibles sin login y con acceso vencido; la navegación HTTPS utiliza el manejador externo existente de Android. Gate: 419 pruebas de lógica y 162 recorridos móviles aprobados. El AAB firmado se verificó de nuevo localmente: 13.545.587 bytes, SHA-256 `ff603b05fde38085d224300fbb238cf28ebb23e84db78bf21a56c3cf48c31b60`, paquete cl.preparatupaes.app, API 36, sin debuggable/testOnly. [AAB aprobado](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41689953231). El titular sube el AAB; aún falta un toque real de esos enlaces en un teléfono actualizado.

## Límites y pendientes concretos

- Google Play Console abrió Google con la cuenta cerrada. No se pudieron releer los valores actuales ni se modificaron sus formularios; el titular eligió completarlos manualmente. Deben guardarse privacidad y eliminación con las URL públicas de arriba y revisar Seguridad de los datos.
- `sitecacho.cl` tiene NS de Cloudflare pero no devuelve A/AAAA/CNAME. La petición desde este entorno falló con 503 de conexión upstream; no se afirma que el origen haya respondido ese estado. No se entrega una URL del dominio propio como funcional ni se cambió DNS.
- Precisar los plazos operativos de gestión y conservación de solicitudes de soporte, registros técnicos y respaldos según el proveedor y la norma aplicable. No se prometió una purga instantánea ni se inventaron plazos. La auditoría no inspeccionó un buzón de soporte ni ejecutó una eliminación real de producción.
- Antes de activar ventas, confirmar identidad/RUT/domicilio del vendedor y la información de contratación, cancelación y devoluciones. Se mantiene José Rubén Villablanca Horta como responsable ya publicado; no se inventó un RUT, domicilio o entidad vendedora nueva.
- La revisión técnica y de contenido no certifica aprobación de Google ni cumplimiento jurídico integral. No se activaron pagos, planes pagados o infraestructura nueva, y no se modificó Servicios Villablanca.

Google permite un correo de soporte como vía externa de solicitud, siempre que sea funcional, visible y explique el proceso: https://support.google.com/googleplay/android-developer/answer/13327111 . Privacidad y borrado deben ser accesibles tanto en app como en web: https://support.google.com/googleplay/android-developer/answer/10144311 . Identificación comercial previa a la venta: https://www.sernac.cl/portal/604/w3-propertyvalue-20982.html .

## Gestión de solicitudes por correo

El responsable verifica la titularidad sin pedir contraseñas/códigos/documentos innecesarios. En una eliminación manual debe retirar la miniatura mediante Storage y la autorización por hash del correo, eliminar la cuenta con la herramienta oficial de administración, comprobar los datos vinculados/progreso web y confirmar la gestión al solicitante. No basta con suspender o borrar solo el perfil. El flujo normal de la app ya retira la miniatura y el RPC elimina también el permiso por correo; una eliminación administrativa por otra vía requiere verificar ambos pasos.
