# Prueba real del duelo y las compras en dos celulares

Esta guía corresponde al **VS por internet** del paquete comercial, con una cuenta distinta en cada celular. No utiliza el modo local de rc4 ni reemplaza una compra por permisos ficticios.

## Preparación

- App `cl.preparatupaes.app` en la pista interna y una compilación habilitada para Billing. El primer AAB de configuración todavía no cumple ese requisito.
- Productos activos y verificador de servidor operativo. SMTP, confirmación y recuperación de cuenta comprobados.
- Los dos correos Google agregados a la pista interna **y** a verificadores de licencia. Ser participante de una pista no evita por sí solo un cobro real. Confirmar el instrumento y aviso de compra de prueba de Google antes de aceptar.
- En cada teléfono, aceptar el enlace de participación real que entregue Console e instalar desde Play. Usar la cuenta Google agregada como verificadora de licencia.
- Crear dos cuentas reales de ¿Cachaste?, verificar el correo y completar cada apodo/perfil. Mantener desactivada la participación pública en rankings durante esta revisión.
- Habilitar `CACHASTE_PLAY_ALLOW_LICENSE_TESTS=true` solo de forma administrativa para esta prueba. El servidor debe seguir consultando y validando Google; no modificar `settings.environment` ni crear entitlements de laboratorio en producción.

## Ejecución y evidencia

| Paso | Comprobación | Resultado |
| --- | --- | --- |
| Acceso | Inicio de sesión y confirmación de correo en ambos celulares | Pendiente |
| Compra de licencia | Cada cuenta obtiene acceso tras verificar Google y asociar el recibo con su usuario | Pendiente |
| Invitación | El primer celular crea un código real; el segundo lo acepta | Pendiente |
| VS | Cada celular muestra los dos apodos reales y la misma materia | Pendiente |
| Primer turno | Responder diez preguntas; las soluciones siguen ocultas hasta que ambos terminen | Pendiente |
| Reanudación | Salir y volver a mitad del turno; retomar la misma posición y plazo de servidor | Pendiente |
| Segundo turno | El otro celular completa las mismas diez preguntas | Pendiente |
| Resultado | Ambos muestran el mismo ganador, aciertos y motivo de desempate | Pendiente |
| Tutor | Cada cuenta revisa sus errores después de terminar el duelo | Pendiente |
| Restauración | Recrear la app y restaurar la compra en la cuenta correcta, sin duplicar recompensas | Pendiente |
| Cuenta distinta | Un recibo vinculado a una cuenta no desbloquea otra | Pendiente |
| Compra pendiente/fallida | No concede acceso mientras Google no confirme | Pendiente |
| Ciclo de suscripción | Validar renovación, cancelación, vencimiento y evento RTDN con Google | Pendiente |
| Recuperación | Completar el enlace de contraseña desde correo y volver a entrar en Android | Pendiente |
| Eliminación | Probar el borrado desde la app y la vía web publicada | Pendiente |

Anotar modelo y versión Android de ambos teléfonos, código de versión instalado, fecha y cualquier error visible. Conservar las capturas solo con autorización de quienes prueban. No incluir contraseñas ni tokens de compra en capturas, correos, Git o informes públicos.

## Cierre

Deshabilitar las compras de licencia en la configuración de producción al terminar, comprobar su vencimiento o revocación y mantener privados los perfiles de prueba. No borrar resultados de usuarios reales. Una vez resuelto el flujo completo, obtener capturas de VS y resultado con estas cuentas reales para revisar la ficha; hasta entonces no usar imágenes de fixtures como evidencia de uso público.
