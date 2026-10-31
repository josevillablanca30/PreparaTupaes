# Suscripciones · contrato de implementación

Decisión aprobada del propietario, 18/10/2026. **Diseño pendiente de implementación y pruebas de compra**. No hay control Premium seguro, backend de compras ni cobros activados. La aplicación actual sigue offline.

| Plan | Precio CLP aprobado | Periodo | Presentación |
|---|---:|---|---|
| Semanal | $2.490 | Una semana | Alternativa |
| Mensual | $7.990 | Un mes | Principal |
| Anual | $59.990 | Un año | Alternativa |

Los tres habilitan exactamente el mismo conjunto de funciones Premium. Mostrar el precio y periodo devueltos por la tienda al comprar; no fingir una oferta contratada mediante un texto local. Confirmar configuración de renovación y precio en entorno de pruebas antes de aprobación. No derivar un mes como 30 días ni un año como 365: prevalece la vigencia verificada de la tienda.

## Componentes y separación del progreso

- Catálogo de planes compartido, oferta mensual destacada; IDs reales pendientes de Play Console.
- Adaptador Android de facturación: listar ofertas, iniciar compra solo por acción del estudiante, consultar compras y restaurar. La WebView no puede conceder acceso mediante un booleano en localStorage.
- Verificador de servidor: validar token con Google, paquete/producto/estado/vigencia y asociación a cuenta; rechazar tokens reutilizados, reconocer compra verificada y procesar notificaciones de cambios idempotentemente. Claves solo en servidor. No registrar tokens completos en logs.
- Registro de acceso: estados gratuito, pendiente, activo, gracia, suspendido y vencido; cancelación de renovación no equivale a vencimiento inmediato. Decisiones derivadas de evidencia de tienda y hora confiable, no del reloj del teléfono.
- Progreso independiente del plan: al vencer, conservar historial, diagnóstico, recompensas y ruta. Volver a gratuito limita nuevas actividades Premium, nunca borra lo aprendido. Restaurar una compra no restaura por sí solo el avance.
- Identidad y copia de progreso: diseñar cuenta mínima/exportación segura y migración del almacenamiento actual antes de probar reinstalación. No inventar sincronización existente. Consentimiento y privacidad deben describir el nuevo tratamiento de datos.

La experiencia gratuita debe permitir diagnóstico y una secuencia de aprendizaje con comprobación por ejercicio nuevo. Los límites exactos requieren medir ese recorrido; no bloquear el tutor tras un error ni impedir acceder al propio progreso. Las tres duraciones Premium comparten permisos.

## Matriz mínima de aceptación en sandbox

| Caso | Resultado exigido |
|---|---|
| Compra pendiente | No concede Premium; estado claro y recuperable |
| Compra completada verificada | Concede una vez y reconoce la compra |
| Token inválido, ajeno o reutilizado | Rechazo sin perder progreso ni revelar datos |
| Reintento / notificación duplicada | Resultado idempotente |
| Renovación, gracia, suspensión y recuperación | Refleja el estado autorizado por la tienda |
| Cancelación con vigencia restante | Conserva acceso hasta vencimiento |
| Vencimiento, devolución o revocación | Revoca según estado verificado; conserva progreso |
| Nueva instalación / otro dispositivo | Recupera compra válida; progreso según política independiente |
| Modo avión / reloj manipulado | No amplía vigencia arbitrariamente; comunica límite offline |
| Plan semanal, mensual y anual | Mismas capacidades, diferente vigencia/precio |
| Cuenta equivocada / tienda no disponible | Error accionable sin cobro simulado ni pérdida |

No aprobar solo con mocks: usar testers de licencia y compras de prueba de Play, registrar evidencia y verificar que no haya cargos reales. Política de acceso offline, identidad, soporte y retención son decisiones pendientes antes de implementación completa.

## Alternativas de costo a evaluar antes de contratar

1. Prototipo local con proveedor simulado: gratuito para pruebas unitarias, incapaz de validar compras reales.
2. Función de servidor en nivel gratuito: permite secreto y verificación, pero exige comprobar cuota, región, privacidad, disponibilidad y presupuesto de bloqueo antes de elegir proveedor.
3. Infraestructura ya disponible del propietario: reutilizable solo después de verificar acceso, seguridad, límites y costo marginal.

Ninguna opción fue contratada ni habilitada. No pedir cuentas de pago para avanzar con contrato y pruebas locales.

Referencias oficiales consultadas el 18/10/2026:
- https://developer.android.com/google/play/billing/security
- https://developer.android.com/google/play/billing/test
- https://developer.android.com/google/play/billing/integrate
