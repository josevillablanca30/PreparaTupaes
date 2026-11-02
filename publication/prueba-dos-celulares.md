# Piloto final en dos teléfonos · versión 43

Este recorrido corresponde a la **prueba cerrada** de cl.preparatupaes.app, con dos cuentas distintas. El AAB es para cargarlo en Play Console; los teléfonos reciben la actualización desde Google Play. Se utiliza el acceso gratuito concedido administrativamente a las cuentas autorizadas. La candidata 43 tiene billingReady=false: este piloto no requiere comprar una suscripción, activar Billing ni cambiar el entorno de producción del backend.

## Preparación

1. Actualizar Seguridad de los datos para la foto opcional según `seguridad-datos.md` y cargar el AAB 43 firmado en la misma prueba cerrada. No publicar en producción ni crear otra clave de carga.
2. En cada teléfono, actualizar desde Google Play con la cuenta Google inscrita como tester. Comprobar en la información de la app que la versión instalada es 1.5.0-rc16 / código 43.
3. Iniciar sesión con dos cuentas diferentes y comprobar que ambas tienen acceso autorizado a la prueba. Mantener suscripciones y cobros deshabilitados.
4. Actualizar conserva la sesión. Para probar un correo nuevo: Perfil → Cerrar sesión → Crear cuenta, usando un correo aún no registrado. Para probar recepción con la cuenta existente: Cerrar sesión → Recuperar contraseña. No borrar una cuenta ni su progreso para forzar el envío.

## Recorrido

| Paso | Resultado esperado | Estado |
| --- | --- | --- |
| Correo | Código visible en el correo real; se introduce dentro de la app sin depender de localhost | Pendiente en teléfono |
| Cuenta | Registro/login, nickname y sesión persistente; nickname duplicado rechazado | Pendiente en 43 |
| Foto A | Perfil → Subir mi foto → selector de Android → vista previa → confirmación pública → Guardar. El usuario B ve esa miniatura en el duelo | Pendiente en teléfono |
| Foto B | Puede conservar su gatito o subir otra foto. Cambiar la foto no valida campos de otro formulario ni pierde un nickname aún no guardado | Pendiente en teléfono |
| Cancelación | Cancelar el selector o la vista previa no sube un archivo ni consume el plazo | Pendiente en teléfono |
| Plazo de foto | La siguiente subida queda bloqueada durante siete días; quitarla está permitido y vuelve al gatito | Pendiente en teléfono |
| Desafío | A desafía por nickname o crea un código; B recibe/acepta | Un duelo de la versión anterior completado según el titular; repetir en 43 |
| Ambos turnos | Diez preguntas para cada cuenta, sin soluciones anticipadas | Repetir en 43 |
| Reanudación | Salir y regresar a mitad del turno conserva posición y tiempo del servidor | Pendiente en teléfono |
| Resultado | Ambos ven el mismo ganador/marcador; victorias, derrotas/empates y estrellas se registran una vez | Repetir en 43 |
| Revancha | Al terminar pueden jugar otra vez entre ellos inmediatamente, sin veto diario. Un desafío aún pendiente/activo no debe duplicarse | Pendiente en teléfono; backend y HTTP aprobados |
| Historial | Cada duelo aparece separado con fecha, rival, marcador y resultado; abre su resultado y permite pedir revancha | Pendiente en teléfono; pruebas web/HTTP aprobadas |
| Ranking | Si ambos optan por participar públicamente, la misma categoría refleja los resultados; no se cambian estrellas educativas | Pendiente en teléfono; servidor probado automáticamente |
| Sesión | Cerrar sesión vuelve a login sin borrar progreso educativo; actualizar no obliga a crear otra cuenta | Pendiente en teléfono; pruebas automáticas aprobadas |

No se considera completa una comprobación solo porque la app compile o porque funcione una cuenta simulada. Registrar versión, modelo/Android y resultado real. No incluir contraseñas, OTP ni tokens en capturas o informes públicos. Usar fotos propias con permiso; las capturas automáticas publicadas en GitHub emplean una imagen sintética, no fotos de personas.

## Alcance comercial separado

Renovaciones, compras pendientes, restauración, asociación de recibos y RTDN corresponden a la futura activación de Billing. No son requisitos para este piloto gratuito ni deben reemplazarse por recibos falsos o permisos autoconcedidos. Se conservan los controles de servidor existentes y las pruebas instaladas del acceso comercial.
