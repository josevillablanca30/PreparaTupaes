# rc16 / 43 · maestro legible, marca transparente y duelo alineado

> Informe histórico. Ver [candidata rc17 / 44](android-rc17-cierre-2026-11-03.md). El titular confirmó que la recuperación web funciona; el antiguo error SMTP no es un pendiente actual.


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

Build local: 125 archivos de distribución verificados. Batería de lógica final: 415/415; comprobación específica de cliente/fotos: 14/14. Los recorridos móviles locales no arrancaron porque el contenedor rechaza el socket del navegador; no se cuentan como fallos funcionales ni como pruebas aprobadas. Se usa el gate existente de GitHub Actions para verificar Chromium móvil, integración y firma.

Los recorridos añadidos verifican: transparencia real y presencia del logo renderizado, separación retrato/consejo tras varios toques, tarjetas y avatares alineados, CTA antes del maestro, rechazo de 5 MiB + 1 byte y aceptación de 5 MiB exactos antes de comprimir, error HTTP realista sin falso código enviado y foto del usuario correcto en ranking con fallback.

La candidata 43 debe entregarse solo después de aprobar su gate y verificar el archivo firmado. El titular continúa subiendo el AAB a la misma prueba cerrada. La prueba física de correo, selector y duelo en dos teléfonos, y la declaración de fotos opcionales de Google Play, siguen pendientes. No se publica una versión de producción.


## Revisión visual y reconstrucción

Primera fuente de producto `d29431e7a47c1c61b7fbc7449dcc9f05f64d9af6`: gate 41515078103 aprobó 415 pruebas de lógica, 134 recorridos móviles y 27 pruebas Postgres/RLS, además de las transferencias HTTP de Auth/Storage/duelos. Las capturas del ZIP 13175287908, SHA-256 `552adedce394f0e8e1dbe5fea6bf229e2f2367f8897e792299e696d554ccde2c`, se descargaron y verificaron antes de revisar perfil, VS de 320 px y Android, y portada. El maestro y las tarjetas quedaron corregidos. Las identidades de esas capturas son fixtures aisladas, no jugadores ni resultados reales.

Esa revisión detectó un marco de foco del navegador en el título del VS. Se retira únicamente su indicador visual (el h1 conserva foco programático para navegación accesible); el foco visible de controles interactivos se conserva. Fuente definitiva de producto: `3aeb860b8b40cb1acbb3805a21f58a1f59dd1a6c`. Se reconstruye el mismo código 43 antes de entregarlo. El AAB inicial de d29431e no se entrega.

El contexto previo confirma que el titular ya había aceptado Resend Free y se había guardado SMTP con `smtp.resend.com`, remitente `noreply@auth.sitecacho.cl` y nombre ¿Cachaste?. Esto no sustituye la comprobación actual: el servidor rechaza la autenticación del proveedor. Falta renovar/verificar su credencial privada y recibir un correo real; no hace falta crear nuevamente el dominio o contratar un plan pagado.


La ejecución 41516043040 de la corrección visual aprobó lógica e integración, pero detuvo el AAB por dos aserciones nuevas de foco (132 recorridos aprobados, dos fallidos). La lectura instantánea de `getComputedStyle(...).outlineStyle` devolvió una cadena vacía durante la actualización de la pantalla; la captura de fallo confirma que el marco ya no se dibuja. Se sustituye esa lectura por `toHaveCSS`, que resuelve nuevamente el elemento y espera el valor real. No se acepta una cadena vacía como aprobada, no se retira el caso y no cambia el producto. Fuente de reconstrucción y prueba: `a961e1f96450f77b482c8d2fb1c686206e9d4aa0`, gate 41516857964.


## Gate definitivo aprobado

Gate 41516857964, fuente `a961e1f96450f77b482c8d2fb1c686206e9d4aa0`: 415 pruebas de lógica y 134 recorridos móviles aprobados, sin fallos ni intermitencias. La integración del mismo gate está aprobada; la corrección de foco no altera funciones SQL ni transferencias. Artefacto de capturas final 13176745276, ZIP SHA-256 `5aa2be4f5522bac1b4a3cad26ad39c2b248bec89a32c23ed0fcce52b1b7b0be2`. La candidata firmada de esta fuente se verifica y registra abajo antes de entregarla.

Capturas definitivas de VS y perfil revisadas después de comprobar el hash del ZIP final. El título ya no presenta el marco de foco; el logo permanece transparente, el consejo no cubre el retrato y las tarjetas mantienen iguales alturas en 320 px. La navegación fija exige desplazar la página en las pantallas más bajas; los controles se alcanzan con scroll y los recorridos de inicio/respuesta del duelo aprobaron.


## AAB definitivo entregable

`Cachaste-1.5.0-rc16-43.aab`, 13.545.078 bytes. SHA-256 `5ebac856932def2d8cf4ab5027574427b0caaeadc83f4f80e2f765da6999606f`. Fuente de compilación `a961e1f96450f77b482c8d2fb1c686206e9d4aa0`. [Gate firmado aprobado](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41516857964) y [artefacto definitivo 13176550943](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41516857964/artifacts/13176550943).

Archivo ZIP de Actions verificado por tamaño y SHA-256 `7e4965921d39eb160438dda12bbf83754b42f51c0edf1f7e79740892a090ecaf` antes de extraerlo. Comprobación local independiente: las 265 entradas de contenido están firmadas por el certificado permanente `a566926f01e79e5f75422b5c03c91b4337018e4f7987b32888c650ca7f271575`; manifiesto con paquete `cl.preparatupaes.app`, versión 1.5.0-rc16, código 43, target 36, sin debuggable ni testOnly. Bundletool validate y lint release aprobados en el gate. Los 124 archivos públicos empaquetados en base/assets son idénticos byte a byte al build local con el mismo GITHUB_SHA; solo falta el marcador web `.nojekyll`, que no forma parte del contenido Android. [Informe verificable](../reports/cachaste-rc16-verification.json).

Esta documentación se guarda después del AAB y no cambia su contenido. La recepción real del correo sigue bloqueada por el rechazo SMTP 535; el piloto físico permanece pendiente. Se entregan archivo y notas al titular para su carga en la prueba cerrada existente.
