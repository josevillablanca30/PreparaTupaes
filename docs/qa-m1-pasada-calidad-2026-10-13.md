# QA de Cachaste M1 — segunda pasada

Fecha de revisión: 13 de octubre de 2026.

## Alcance
Se revisa el catálogo de **84 preguntas originales** elaborado a partir de habilidades identificadas en materiales de Drive (PDV, CPECH, M30M) y el temario oficial **PAES Regular 2026 / Admisión 2027**:

https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-M1-v1.pdf

La biblioteca Drive proporciona contexto pedagógico. No se han incorporado literalmente preguntas de materiales de pago sin licencia.

## Mejoras entregadas
1. Segunda clave independiente en `tests/answer-key-audit.test.mjs`, para evitar cambios accidentales en índices o alternativas correctas; comprende los 84 ítems.
2. Dificultad estimada por criterio pedagógico: **45 iniciales, 24 intermedias, 15 de desafío**. Son etiquetas de diseño, **no** calibración estadística de dificultad.
3. Ensayo formativo de 65 preguntas que conserva cuotas de ejes, pero presenta un recorrido desde tareas iniciales hacia desafíos.
4. Mapa navegable, marcador de preguntas por revisar y confirmación previa a entregar el ensayo completo.
5. Guardado y recuperación del marcador y las respuestas.
6. Cronómetro visible también en la pantalla de revisión.
7. Estadísticas que no confunden un acierto sin confianza declarada (ensayo) con una respuesta acertada «con dudas».
8. Texto aclarado en el ejercicio 209: se pide una forma de potencia equivalente, no el resultado numérico.

## Evidencia
- Revisión de sintaxis del JavaScript de la aplicación.
- Ejecución aislada de **24 pruebas de lógica** con éxito, utilizando los casos del archivo `tests/logic.test.mjs`.
- Comparación de **84 respuestas** contra una segunda clave editorial, sin discrepancias; pasos y alternativas estructuralmente completos.
- Las pruebas editoriales se han integrado en `npm run test:logic`, junto con las de lógica.
- Los escenarios táctiles Playwright para revisión/marcadores y entrega se añadieron a `tests/mobile.spec.mjs`.

## Limitaciones y bloqueos
- **No se ha ejecutado Playwright en emuladores de navegador sobre la versión GitHub actual** desde esta sesión. No afirmar que Android/iOS están visualmente validados.
- El acceso directo al repositorio por red desde el entorno local falló por resolución DNS; la revisión usó el conector GitHub.
- El flujo de GitHub Actions puede correr las pruebas, pero aquí no contamos con confirmación de un job exitoso ni APK descargable.
- La segunda clave editorial es una comprobación de consistencia; falta una revisión independiente profunda de todos los procedimientos, distractores y nivel real de dificultad por un especialista.
- El contenido requiere todavía preguntas con gráficos y escenarios más auténticos de PAES. Las 84 preguntas no se traducen a puntaje ni afirman representar la dificultad oficial.
- La proporción 16/19/15/15 por ejes en el simulacro es una **decisión pedagógica interna**, no una distribución oficial declarada por DEMRE.

## Criterio para la siguiente pasada
1. Revisar visualmente 320 px, Android y WebKit iPhone; priorizar lectura, acciones táctiles, mapa y notches.
2. Ejecutar `npm run test:logic && npm test` en CI y corregir cualquier regresión.
3. Segunda revisión matemática y expansión de ítems de lectura de gráficos e interpretación no rutinaria.
4. Recibir aprobación del propietario de M1 antes de publicar APK de prueba.
