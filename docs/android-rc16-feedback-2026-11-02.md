# rc16 / 43 · maestro legible, marca transparente y duelo alineado

Base: `ac8fef6da6374bf68d7d010cad91319bb7741518`, rama Android existente. Responde al último feedback del titular sobre correo no recibido, consejo sobre el retrato, parche detrás del logo y referencia visual del VS. No cambia las preguntas, puntuación, progreso, permisos Android ni firma de carga.

## Cambios

- Foto original: máximo 5 MiB (5.242.880 bytes) en el dispositivo. Se mantiene la miniatura WebP de 256×256 y hasta 32 KiB, una sola por cuenta y cambio cada siete días. No se sube el original.
- Marca: se usa el mismo arte incrustado en el SVG oficial como máscara para quitar su fondo claro, sin generar ni redibujar el lettering. Versión blanca con acentos dorados para el tema oscuro; mismas proporciones 355×97. Se retiran los filtros CSS de inversión que dejaban un parche visible.
- Maestro: ilustraciones existentes, gesto breve más sutil y consejo en una fila independiente debajo del retrato. El texto ya no puede cubrir al personaje al tocarlo. Se mantiene movimiento reducido.
- VS: título y maestro con libro, tarjetas de igual altura con retratos alineados, bordes violeta/dorado, reglas y botón de inicio antes del pie del maestro. Apodos largos y botón de opciones no desplazan una tarjeta. Se conservan estados de espera y los valores reales de estrellas.
- Rankings: se conservan ID y versión de foto al dibujar cada fila; antes se descartaban y se mostraba solo el gatito. Si falla una descarga se muestra el avatar elegido.
- Recuperación: se diferencia un rechazo real del servicio de correo de un envío solicitado correctamente. Se mantiene el correo escrito y no se abre el diálogo de código cuando Auth rechaza el envío. No se muestran diagnósticos privados del proveedor en la app.

## Causa comprobada del correo alojado

Los logs de Auth del proyecto `jmobinmdwrmdqrxtcruj` devuelven cuatro fallos `unexpected_failure` / HTTP 500 con respuesta del proveedor `535 Authentication credentials invalid`. La consulta agrupa solo errores y cantidades, sin correos, contraseñas ni tokens.

Esto demuestra un rechazo de autenticación del proveedor SMTP. No demuestra cuál credencial debe usarse ni que las plantillas actuales estén bien. El conector de Supabase no expone edición de Auth y no hay una credencial de Management API en el entorno. El panel solicitado abre la pantalla de inicio de sesión; no existe sesión autenticada en este navegador. No se cambian contraseñas, no se desactiva verificación y no se envían correos de prueba a personas.

Pendiente del propietario: renovar/verificar la credencial del proveedor en Authentication → Email → SMTP del proyecto, comprobar las plantillas de código y recibir una recuperación real en el teléfono. Un AAB nuevo no corrige esa credencial. El correo alojado no se declara resuelto.

## Verificación

Build local: 125 archivos de distribución verificados. Batería inicial de lógica: 414/414; comprobación de cliente/fotos tras añadir el caso de rechazo de correo: 14/14. Los recorridos móviles locales no arrancaron porque el contenedor rechaza el socket del navegador; no se cuentan como fallos funcionales ni como pruebas aprobadas. Se usa el gate existente de GitHub Actions para verificar Chromium móvil, integración y firma.

Los recorridos añadidos verifican: transparencia real y presencia del logo renderizado, separación retrato/consejo tras varios toques, tarjetas y avatares alineados, CTA antes del maestro, rechazo de 5 MiB + 1 byte y aceptación de 5 MiB exactos antes de comprimir, error HTTP realista sin falso código enviado y foto del usuario correcto en ranking con fallback.

La candidata 43 debe entregarse solo después de aprobar su gate y verificar el archivo firmado. El titular continúa subiendo el AAB a la misma prueba cerrada. La prueba física de correo, selector y duelo en dos teléfonos, y la declaración de fotos opcionales de Google Play, siguen pendientes. No se publica una versión de producción.
