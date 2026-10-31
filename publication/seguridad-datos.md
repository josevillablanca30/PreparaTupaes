# Seguridad de los datos y contenido de la app — propuesta para completar Console

Revisado contra el código de la candidata rc5. **Borrador pendiente de los datos del titular, URLs y configuración final de servicios/SDKs.** No es una declaración enviada a Google.

## Datos de ¿Cachaste?

| Datos | Tratamiento observado | Finalidad propuesta |
| --- | --- | --- |
| Correo e identificador de cuenta | Auth de Supabase y vínculo con la cuenta competitiva; el correo no es el apodo público | Gestión de cuentas, funcionalidad y seguridad |
| Contraseña y credenciales de sesión | Autenticación; no publicar ni tratar como texto de perfil | Gestión de cuentas y seguridad |
| Apodo y avatar predefinido | Perfil competitivo; el avatar no es una foto subida por el estudiante | Funcionalidad |
| Región y comuna elegidas | Selección manual, sin GPS; clasificación geográfica y visibilidad conforme al perfil | Funcionalidad; revisar ubicación aproximada en el formulario |
| Respuestas y actividad competitiva | Intentos, preguntas, aciertos, tiempos de servidor, duelos, estadísticas y preferencias | Funcionalidad, integridad de la competencia y prevención de abuso |
| Convivencia | Consentimiento y fecha de servidor, bloqueos y denuncias privadas con motivo, identificadores implicados y apodo denunciado | Funcionalidad y prevención de abuso |
| Compras | Historial de verificación, estado/vencimiento y token cifrado; Google procesa el pago | Funcionalidad, gestión de cuenta y prevención de fraude |
| Datos operativos | Auth/servidor pueden tratar IP y metadatos técnicos de solicitudes; verificar retención efectiva y SDKs | Seguridad y operación; declarar la clasificación que corresponda |
| Progreso educativo del dispositivo | Diagnóstico, práctica y progreso guardados localmente; el progreso local no se acepta como prueba de puntos del ranking | No declararlo como envío al servidor si permanece exclusivamente local |

No se solicitan cámara, micrófono, contactos, GPS, fotografías del estudiante ni identificador publicitario desde el código propio revisado. No se integró publicidad ni un SDK de analítica publicitaria. Confirmar las prácticas de la versión final de Google Play Billing y de los demás proveedores antes de enviar el formulario.

No marcar «no se recopilan datos»: el registro, los duelos y la validación de compras transmiten información fuera del dispositivo. Identificadores y compras son necesarios para el acceso comercial; los datos de perfil se requieren al elegir participar en competencia. La clasificación final de opcional/obligatorio debe reflejar los recorridos efectivamente disponibles en la versión final.

La exhibición voluntaria de apodo/resultados es una función pública de la app. No confundirla con publicidad ni prometer que todos los datos son privados. Los proveedores de alojamiento y pago deben describirse según su función y los acuerdos aplicables; no seleccionar categorías de «compartir» por suposiciones.

## Respuestas de contenido que pueden prepararse

- Tipo: app. Categoría propuesta: Educación.
- Publicidad integrada en esta versión: no se observa en el código revisado.
- Compras: suscripción de Google Play para acceso completo.
- Cuenta requerida para el acceso comercial; hay apartados restringidos. Se necesita un acceso de revisión real y funcional para Google antes de enviar a revisión.
- Público previsto: preparación PAES desde aproximadamente 15 años. Confirmar los grupos concretos de Console; no declarar automáticamente una app para menores de 13 años.
- Interacción entre estudiantes: duelos e invitaciones. No hay chat, fotos subidas ni contacto público. Hay apodos y resultados públicos por elección del usuario: revisar las preguntas de contenido generado por usuarios y sus obligaciones, sin negar esa función.
- Clasificación IARC: pendiente de completar el cuestionario; no inventar una clasificación.
- Privacidad y eliminación: pendientes de publicar con titular/contacto definitivos. La opción interna de eliminar cuenta está implementada; falta la vía externa verificada.

## Antes de enviar

Comprobar que la política publicada, los enlaces dentro de la app, las respuestas de Seguridad de los datos y los SDKs realmente distribuidos coincidan. Comprobar el mecanismo externo de eliminación y la retención aplicable; no declarar plazos o auditorías que no estén definidos. Revisar la moderación/bloqueo que corresponda a los perfiles y rankings públicos antes de habilitarlos al público.

Fuentes: https://support.google.com/googleplay/android-developer/answer/10787469?hl=es-419 y https://support.google.com/googleplay/android-developer/answer/13327111?hl=en
