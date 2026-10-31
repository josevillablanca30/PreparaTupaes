# Cachaste Ciencias — primera integración (PAES Regular 2026, admisión 2027)

## Estructura oficial

Temario vigente de Ciencias publicado por DEMRE / Mineduc:
https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-Ciencias-v1.pdf

La PAES Regular de Ciencias consta de **80 preguntas, 160 minutos**, organizadas en **54 del Módulo Común (MC)** —Biología, Física y Química— y **26 del Módulo Electivo (ME)** o Técnico-Profesional (MTP). En la prueba oficial se presentan preguntas con **4 o 5 alternativas** y 75 de las 80 se consideran para el puntaje.

No confundir la estructura del examen con el estado actual del banco de Cachaste.

## Avance real (sin prometer cobertura total)

Se implementaron **63 preguntas originales** estructuradas:
- 45 preguntas de práctica MC: 15 de Biología, 15 de Física y 15 de Química.
- 12 de profundización ME: 4 por especialidad.
- 6 de refuerzo MTP: 2 por eje.

Los 11 ámbitos temáticos del temario tienen al menos una pregunta inicial: biología celular, procesos biológicos, herencia y evolución, organismo y ambiente; ondas, mecánica, energía-Tierra, electricidad; estructura atómica, química orgánica, reacciones y estequiometría.

Cinco habilidades científicas: observar y plantear preguntas, planificar y conducir investigación, procesar y analizar evidencia, evaluar y comunicar.

Las preguntas se redactaron para Cachaste. Como fuentes de contexto se revisaron el temario y carpetas de material en Drive, incluidos cuadernos PDV de microevolución, electricidad y modelos atómicos. **Los materiales de terceros no se incorporan literalmente y deben respetarse sus derechos de autor.** Algunas carpetas son antiguas y requieren filtrado con el temario vigente.

## Producto

M1 permanece en `index.html`, estable e independiente del módulo `science.html`.
- `science-bank.js` tiene preguntas, retroalimentación de cada distractor, pasos y ejemplos.
- `science-app.js` implementa tutor de ciencias, pistas progresivas, corrección, práctica común y de profundización, selección Biología/Física/Química/TP, progreso y repaso de errores independiente de M1.
- El estudiante puede **proponer y guardar correcciones de preguntas**. No se modifican automáticamente las claves; las observaciones se guardan en `localStorage` del dispositivo y pueden copiarse como texto. No hay backend, cuentas ni sincronización.
- El diagnóstico mixto es una práctica inicial de nueve preguntas. La práctica de módulo dura doce preguntas. **No se ofrece aún un simulacro de 80**, porque faltan preguntas y validación para las 54 del MC y los 26 de cada especialidad.
- Para no romper el APK, la compilación incorpora `science.html`, `science-bank.js` y `science-app.js` como recursos locales junto con `index.html`.

## Criterios siguientes para Ciencias completa

1. Completar al menos 54 ejercicios de Módulo Común variados, no repetidos, y un banco adicional amplio por ME de Biología, Física y Química y TP.
2. Auditoría editorial de cada pregunta: una alternativa inequívoca, tres distractores científicamente falsos con explicaciones, ejemplos sin simplificaciones erróneas y pertinencia al temario actualizado.
3. Construir simulacros de 80, 160 minutos, con cuotas MC/ME o MC/MTP correctas, sin ofrecer resultados oficiales no validados.
4. Agregar interpretación de gráficos, investigaciones, circuitos, tablas, microscopía y esquemas originales accesibles.
5. Revisiones particularmente rigurosas de Biología con el usuario y registro del origen/revisión de cambios.
6. Ejecutar Node, Playwright Android / iPhone / 320 px y compilar e instalar nueva APK física, sin afectar tests M1.

## Estado QA

Se agregaron nueve pruebas Node de contenido, elección de módulo, pistas, errores, reanudación, observaciones y separación del progreso M1; cuatro escenarios Playwright móviles para ruta M1↔Ciencias, preguntas, ayuda y notas. El estado real se confirmará en los workflows de GitHub; no dar por superado CI ni compilación Android antes de ver sus resultados.
