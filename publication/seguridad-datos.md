# Seguridad de los datos · candidata 45 / 1.5.0-rc18

Revisión del 3 de noviembre de 2026, basada en código y políticas publicadas. **El formulario no se guardó ni envió.** La última lectura autenticada mostraba «no se recopilan datos». El titular está completando Google Play manualmente; los valores actuales no pudieron releerse porque la sesión está cerrada.

La app sí recopila datos, usa HTTPS y conserva datos de cuenta/competencia y miniaturas: no son procesamiento efímero. No declarar certificaciones independientes, MASA o UPI inexistentes.

| Tipo de Google Play | Datos concretos | Opcionalidad y finalidad |
| --- | --- | --- |
| Ubicación aproximada | Región/comuna manual y datos operativos del proveedor | La selección manual es opcional; no usa GPS. Considerar también IP/ubicación derivada por proveedores antes de marcar todo el tipo opcional. Funcionalidad, personalización y seguridad según el uso |
| Información personal → Nombre | Nickname público | Perfil competitivo opcional. Funcionalidad, personalización y cuenta |
| Información personal → Correo electrónico | Correo Auth, sin publicarlo como nickname | Obligatorio al crear cuenta. Cuenta, funcionalidad y seguridad |
| Información personal → ID de usuario | UUID y asociaciones de cuenta | Obligatorio al crear cuenta. Cuenta, funcionalidad y seguridad |
| Fotos y videos → Fotos | Miniatura pública de perfil | Opcional; puede usarse un gatito. Funcionalidad, personalización y cuenta |
| Actividad de la app → Interacciones en la app | Operaciones, consentimiento, bloqueo y denuncias con motivos predefinidos | Algunas operaciones necesarias no tienen interruptor. Funcionalidad y prevención de fraude/seguridad |
| Actividad de la app → Otras acciones | Respuestas competitivas, tiempos, duelos, historial y resultados | Opcional al participar en competencia. Funcionalidad e integridad/seguridad |

Para «compartidos», Google contempla excepciones para el proveedor que procesa por cuenta del desarrollador y la divulgación pública que el usuario inicia y confirma. Bajo esas excepciones se propone declarar «recopilados», sin contar esos destinos como compartidos; esto no convierte la foto en privada. Revisar si se añaden otros usos/destinos.

No hay publicidad o analítica publicitaria integrada, GPS, contactos, llamadas, chats ni mensajes libres. Las denuncias usan motivos predefinidos. El progreso educativo permanece local. No inventar categorías de datos financieros: esta candidata tiene compras deshabilitadas. Revisar de nuevo la declaración antes de activar Billing.

## Cuenta y borrado

Android ofrece correo/contraseña con verificación por código, sin OAuth. Seleccionar el método que cubra contraseña y código sin inventar proveedores.

- Política: https://work-cachaste-web-comercial.cachaste-sitecacho.pages.dev/privacidad.html
- Eliminación de cuenta y datos: https://work-cachaste-web-comercial.cachaste-sitecacho.pages.dev/eliminar-cuenta.html

La app permite borrar cuenta con reconfirmación y perfil público por separado. La página incluye el canal de solicitud. No afirmar que borrar una cuenta invalida instantáneamente todos los JWT emitidos.

## Fotos

Selector de documentos Android, original de hasta 5 MiB procesado localmente, miniatura WebP 256×256 y hasta 32 KiB enviada a Supabase. No se sube el original. Hay vista previa y confirmación pública, una foto por cuenta, reemplazo cada siete días y eliminación inmediata disponible. El borrado de perfil/cuenta elimina el archivo.

No se piden CAMERA, READ_MEDIA_IMAGES, READ_MEDIA_VIDEO ni READ_EXTERNAL_STORAGE. Se conservan bloqueo y denuncia.

Fuente oficial consultada: https://support.google.com/googleplay/android-developer/answer/10787469?hl=es-419 . La respuesta final debe describir la versión distribuida y todos sus proveedores.
