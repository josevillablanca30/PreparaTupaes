# Seguridad de los datos · candidata 42 / 1.5.0-rc15

Revisado el 2 de noviembre de 2026 contra el AAB firmado de la fuente eac0a78. Esta guía prepara la actualización de la declaración existente; no crea otra app ni representa un formulario ya enviado a Google.

## Cambio que requiere la versión 42: fotos opcionales

En Contenido de la app → Seguridad de los datos, conservar lo ya declarado para cuenta/actividad y añadir **Fotos y vídeos → Fotos**:

| Pregunta | Implementación de 42 |
| --- | --- |
| ¿Se recopilan fotos? | Sí: la miniatura sale del teléfono hacia Supabase Storage. |
| ¿Es opcional? | Sí: se puede utilizar un gatito y toda la aplicación sin subir foto. |
| ¿Se procesa solo de forma efímera? | No: la miniatura se conserva hasta quitarla, reemplazarla o borrar el perfil/cuenta desde la app. |
| Finalidad | Funcionalidad de la app, personalización del perfil y gestión de cuenta. No publicidad ni análisis facial. |
| ¿Qué archivo se envía? | WebP 256×256 de hasta 32 KB; el original y sus metadatos no se suben. |
| ¿Dónde se muestra? | Perfil, duelos e historial y rankings, con confirmación explícita de visibilidad pública. |
| ¿Puede eliminarse? | Sí: Quitar foto en Perfil. El borrado de perfil/cuenta desde la app elimina también el archivo mediante Storage. |
| ¿Cuándo puede reemplazarse? | Cada siete días, comprobados en el servidor. Quitarla no reinicia el plazo. |

Para la pregunta de datos **compartidos**, Google contempla excepciones para proveedores que procesan por cuenta del desarrollador y transferencias iniciadas por el usuario con divulgación y consentimiento. La miniatura de 42 se aloja en Supabase como proveedor y su exhibición pública la confirma el usuario. La interpretación propuesta para esta implementación es **no contabilizar esas transferencias como compartir con terceros bajo las excepciones del formulario**; esto no significa que la foto sea privada. No introducir esa respuesta si se añaden destinos o usos distintos a los descritos.

La app utiliza el selector de documentos del sistema; no solicita READ_MEDIA_IMAGES, READ_MEDIA_VIDEO, READ_EXTERNAL_STORAGE ni CAMERA. No añadir permisos amplios de galería para esta función.

## Datos que se mantienen

| Datos | Tratamiento | Finalidad |
| --- | --- | --- |
| Correo e identificador de cuenta | Supabase Auth; el correo no es el nickname público | Gestión de cuentas, funcionalidad y seguridad |
| Contraseña y sesión | Autenticación; no se publican en el perfil | Gestión de cuentas y seguridad |
| Nickname y avatar del catálogo | Perfil público competitivo; se conserva como alternativa a la foto | Funcionalidad y personalización |
| Región y comuna elegidas | Selección manual, sin GPS; filtros geográficos del ranking | Funcionalidad; conservar la clasificación geográfica declarada que corresponda |
| Actividad competitiva | Respuestas, tiempos de servidor, intentos, duelos, revanchas, historial y estadísticas | Funcionalidad e integridad de resultados |
| Comunidad | Consentimiento, bloqueos y denuncias privadas | Prevención de abuso y moderación |
| Acceso/compras | La candidata tiene billingReady=false y acceso gratuito para las cuentas autorizadas de prueba. El código de Billing conserva verificación de servidor para su activación futura | Gestión de cuenta; no simular compras ni habilitar cobros durante el piloto |
| Datos operativos | Auth y alojamiento pueden procesar IP y metadatos de solicitudes | Seguridad y operación conforme al proveedor |
| Progreso educativo local | Permanece en el teléfono y no prueba puntos del ranking | No declararlo como una transferencia si no sale del dispositivo |

No marcar «no se recopilan datos». No hay publicidad integrada ni SDK de analítica publicitaria en esta candidata. Los perfiles y las fotos opcionales son contenido de usuarios: se mantienen reglas, bloqueo y denuncia por contenido inapropiado. No negar esa interacción en el cuestionario de contenido.

## Enlaces vigentes

- Política actualizada para fotos: https://cachaste-privacidad.jose-villablanca-hor.chatgpt.site/privacidad
- Solicitud de eliminación: https://cachaste-privacidad.jose-villablanca-hor.chatgpt.site/eliminar-cuenta

La política ya está publicada. La declaración en Play Console aún requiere actualizarse: el navegador del entorno de trabajo no arrancó; no se modificó el formulario por otra vía. No cambiar clasificaciones, cobros ni otras respuestas sin que correspondan al comportamiento distribuido.

Fuente oficial: https://support.google.com/googleplay/android-developer/answer/10787469?hl=es-419 . No se declara una auditoría o certificación independiente inexistente.
