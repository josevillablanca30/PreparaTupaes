# Cierre didáctico previo a validación del usuario

La validación del usuario queda después de completar la revisión educativa.
Las referencias aportadas exigen enseñar desde cero, utilizar un modelo visual
pertinente, explicar el distractor elegido, ofrecer una explicación más sencilla,
resolver otro ejemplo y comprobar aprendizaje con un caso independiente.
La existencia de campos o el éxito de pruebas automáticas no aprueban ese nivel
de calidad ni garantizan que cada ilustración sea equivalente a la referencia.

## Comprobado en esta pasada

Se inspeccionó el catálogo de RC7: 802 preguntas y 287 objetivos entre cinco
materias. Todas contienen fundamentos, aplicación, intuición, otro ejemplo y
retroalimentación por alternativa en `teaching`. Esto es cobertura estructural,
no una revisión semántica individual de las 802 preguntas.

Se contrastaron los campos heredados de repaso contra el catálogo anterior:
166 `easy` repetían los pasos y 176 estaban ausentes. Se sincronizaron con la
intuición ya redactada y su aplicación. No se generó contenido educativo nuevo
ni se cambió el enunciado, alternativa, clave o familia de evaluación.

El informe reproducible `reports/didactic-coverage-2026-10-21.json` enumera
todos los objetivos y preguntas, brechas estructurales y fuentes consultadas
registradas. `editorialApproval` permanece pendiente: no se infiere aprobación
por extensión de texto, presencia de una analogía o una etiqueta anterior.

## Trabajo que todavía impide declarar el cierre

- Cotejar cada objetivo y ejercicio con fuentes y secciones identificables,
  verificar exactitud y suficiencia de su explicación y plausibilidad de opciones.
- Revisar que las analogías aclaren el mecanismo y expliciten sus límites.
- Comprobar pertinencia y legibilidad de los modelos visuales en cada familia.
- Verificar que el ejemplo resuelto y el ejercicio posterior realmente exijan
  aplicar lo aprendido en situaciones distintas.
- Completar el cotejo del material pendiente de Drive. El informe RC7 registra
  14 documentos consultados con alcances delimitados, no una lectura completa
  de los 526 documentos del inventario anterior.

Se recuperó además el texto de FILADD «02 ESTRUCTURAS Y FUNCION CELULAR 2»
(`1Fe1C0SDVo6ESLGolbTC7dja8r4JZ5Ew2`). El texto extraído no contiene los
datos de los gráficos ni el extracto científico completo; esta lectura no
aprueba sus figuras, no cierra el documento y no respalda conclusiones sobre
las hipótesis experimentales que allí se proponen.

Estos cambios son posteriores a RC7 y no están dentro de la APK entregada.
