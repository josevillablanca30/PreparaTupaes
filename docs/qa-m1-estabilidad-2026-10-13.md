# QA y UX de Cachaste M1 — estabilización de repaso y progreso

Fecha de trabajo: 13 de octubre de 2026.

## Resultado de esta pasada

Se preserva el contenido original de **100 preguntas** (16 visuales), sin sumar ítems sin revisión. Se trabajó sobre problemas concretos de seguimiento del aprendizaje, interfaz móvil y recuperación de datos.

### Funciones implementadas
- **Lista persistente de preguntas por reforzar:** la corrección del simulacro incorpora automáticamente las respuestas erróneas u omitidas. No se pierden 55 preguntas cuando el usuario revisa las primeras 10 de un ensayo de 65.
- **Repasos de hasta diez preguntas:** la selección rota por el listado y mantiene pendientes las aún no dominadas.
- **Criterio de dominio:** una pregunta sale del listado solo después de una respuesta correcta en práctica guiada sin pistas. Los aciertos con pistas se registran como avances con ayuda, no como dominio autónomo.
- **Inicio:** acceso destacado para retomar preguntas pendientes guardadas.
- **Progreso para celular:** resumen por Números, Álgebra y funciones, Geometría, Probabilidad y estadística; porcentajes por eje, botones para practicar y detalle de habilidades desplegable.
- **Recuperación robusta:** se rechazan sesiones vacías/duplicadas y se validan los cursores de repaso defectuosos.
- **Accesibilidad y legibilidad:** controles táctiles conservados, filas del progreso adaptadas a ancho reducido y mensajes en singular/plural.

### Resultados de comprobación
- Ejecutados **35 casos de lógica** de `tests/logic.test.mjs` en un entorno de JavaScript aislado; 35/35 correctos.
- Casos añadidos: 65 respuestas incorrectas/omitidas al terminar el simulacro, recuperación del backlog tras recargar, avance a nuevas tandas, acierto con pistas no considerado dominio, validación de sesión corrupta y progreso por los cuatro ejes.
- Auditoría de 100 respuestas contra `tests/answer-key-audit.test.mjs`: sin diferencias en las alternativas indicadas.
- Desglose actual de dificultad **estimada**: 45 iniciales, 40 intermedias y 15 desafíos.
- Se añadieron escenarios Playwright de navegación móvil y repaso persistente, **sin prueba de ejecución completa en navegador confirmada** en este turno.

## Limitaciones

La prueba aislada de JavaScript no es una ejecución real de Chromium/WebKit y el cotejo de una clave editorial no reemplaza una revisión matemática externa. El estado de CI consultado no mostró informes de comprobación asociados al commit revisado, así que **no corresponde declarar GitHub Actions ni el APK como verificados**.

Tampoco se han confirmado pruebas físicas en Android, funcionamiento offline de un APK compilado, capturas reales a 320 px, ni un instalador público descargable.

No se ha tocado ningún repositorio distinto de `josevillablanca30/PreparaTupaes`.

## Próximos criterios de aceptación antes de APK de prueba
1. Ejecutar `npm run test:logic` y `npm test` con Chromium/WebKit, corregir regresiones y revisar visualmente 320 px.
2. Auditar ejercicios de razonamiento y geometría, no solamente comparar claves.
3. Confirmar que el simulacro completo, el cronómetro, el repaso persistente y las pistas funcionan tras cerrar y reabrir la aplicación en un teléfono real.
4. Compilar y verificar instalación de Cachaste Android 0.5.0, y recién entonces entregar un enlace directo de descarga comprobado.
