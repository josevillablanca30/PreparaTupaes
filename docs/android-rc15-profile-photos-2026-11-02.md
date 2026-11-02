# rc15 / 42 · foto de perfil opcional con infraestructura gratuita

Continúa desde d2a27b7. La organización conectada de Supabase se comprobó en plan free; no se modifica facturación ni se contrata un servicio.

## Implementación

- Foto opcional; los24 gatitos/gatitas se conservan como alternativa y fallback si una descarga falla.
- Selección JPG/PNG/WebP de hasta12 MB, recorte central cuadrado y vista previa circular. Canvas en el dispositivo genera WebP256×256 de hasta32768 bytes. No se sube el archivo original, su nombre ni sus metadatos EXIF/GPS. Confirmación explícita de visibilidad pública antes de subir.
- Una ruta fija por usuario en un bucket exclusivo, límite de32 KB y MIME image/webp. No se guardan álbumes ni versiones antiguas. Cache-Control3600 y URL versionada por la fecha del servidor. No se usan transformaciones de imágenes de pago.
- RLS restringe INSERT/UPDATE/DELETE al dueño y a su única ruta; sesión viva, perfil y reglas de comunidad requeridos para subir. La fecha del último upload se registra en el servidor y bloquea otra subida durante siete días, incluso después de quitar la foto o recrear el perfil. Quitarla está permitido en cualquier momento.
- La foto pública aparece en perfil, duelos, historial y rankings. Un perfil bloqueado no devuelve referencia a su foto. URLs limitadas al proyecto configurado; no se aceptan URLs remotas proporcionadas por usuarios.
- El borrado desde perfil/cuenta usa la API de Storage para eliminar también el archivo; nunca se borran filas de Storage por SQL dejando bytes huérfanos. La foto puede denunciarse como contenido inapropiado mediante las opciones existentes.
- Android abre ACTION_OPEN_DOCUMENT solo desde la página propia de competencia y devuelve únicamente una URI content de JPG/PNG/WebP seleccionada por el usuario. Sin permiso global de galería, sin cámara y sin permisos nuevos.
- Formularios de foto y perfil independientes; se conservan ediciones pendientes al abrir/subir una foto. Se amplía la política de privacidad fuente con la finalidad, visibilidad, retención y eliminación de fotos opcionales.

## Presupuesto gratuito

Supabase Free:1 GB de almacenamiento; transferencia5 GB en caché y5 GB sin caché. Fuentes oficiales consultadas el2 de noviembre: https://supabase.com/docs/guides/platform/billing-on-supabase y https://supabase.com/docs/guides/storage/serving/bandwidth .200 miniaturas al máximo ocupan6 553 600 bytes (~6,6 MB), sin contar metadatos. Es una estimación de capacidad, no garantía de tráfico ilimitado: la cuota se comparte con el resto de la organización. No se habilitan cobros ni upgrades.

## Verificación inicial

414 pruebas locales de lógica aprobadas. Nuevas pruebas Postgres/RLS: tamaño y MIME, ruta única, acceso ajeno rechazado, cooldown real, eliminación sin reiniciar el plazo, recreación de perfil sin bypass y renovación tras siete días. URL externa/referencia bloqueada rechazada. La simulación de tablas Storage en PGlite verifica políticas; no se presenta como transferencia HTTP real.

Se habilita Storage en el Supabase efímero de CI para probar además upload/read/remove/reupload mediante SDK y HTTP reales, incluidas denegaciones por usuario ajeno/ruta/cooldown. Nuevo recorrido móvil prueba archivo inválido, compresión a256px, vista previa, consentimiento, publicación, cambio bloqueado y eliminación. Compilación y escáner de secretos aprobados.

Backend alojado, pruebas HTTP de Storage, nuevo AAB42 y publicación de política/actualización de declaración de datos en Play pendientes al momento de este commit. No se declara probado en teléfono físico. La pérdida del emulador general32 de la entrega anterior se mantiene como pendiente y no se oculta.
