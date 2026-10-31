# Revisión editorial: secuencias y distractores

Revisión de aplicación: `69ad25a2535e7dfb3e2ef49b9aa1fc50f8983c6a`.

## Cambios aplicados

Se reescribieron 33 aplicaciones del tutor de Ciencias. Antes se concatenaban pasos breves de una versión antigua, razonamiento ampliado y comprobación, produciendo repeticiones. Ahora cada solución del lote tiene tres pasos propios: interpretar los datos, resolver con unidades y comprobar el resultado. El modo paso a paso, el modo fácil y la reparación tras una respuesta incorrecta consumen la misma aplicación revisada.

El lote incluye rapidez, aceleración, fuerza neta, peso, frecuencia, potencia, energía, corriente, resistencias, concentración, dilución, mezclas, densidad, estructura atómica y dotación cromosómica. No se amplió el alcance curricular ni se promovieron contenidos complementarios al banco PAES.

También se amplió la explicación de la alternativa «1» en M2-007: identifica el exponente cero, explica por qué no corresponde al exponente tres y reconstruye la respuesta ocho.

Se compararon los 780 registros antes y después: identificadores, enunciados, alternativas, claves, conceptos, familias y elegibilidad permanecen iguales. No hay cambio de significado de una respuesta guardada ni se añade evidencia de dominio al estudiante.

## Contraste de material

Se consultaron estas secciones mediante texto recuperado de Drive; no se declara lectura integral de los volúmenes. La redacción de las soluciones es propia y mantiene los datos existentes de los ejercicios.

| Material | ID de Drive | Secciones consultadas |
|---|---|---|
| CPECH, Física Ciencias Plan Común | `1WTyLTfNs5Xt3aiO50cxVvSJlurZs_a0W` | Rapidez y unidades; segunda ley de Newton, p. 64; fuerza elástica; potencia mecánica, p. 96 |
| PDV, Cuaderno 5 Electricidad | `1Br-fqf2HsB1oeUK2RfiunAmsQrNrLD19` | Ley de Ohm, p. 5; serie y paralelo, p. 6; potencia y energía, p. 7 |
| PDV, Compendio 2 Química | `13iIDJCjokhTCm2w_rxxkzWX1C3RMmCKt` | Concentraciones, molaridad y ppm, pp. 53–54; dilución y mezcla, p. 55 |
| PDV, Compendio 1 Química | `1DZ4ce-NoVWGMZwU0EtevBx2mIWeBTqWK` | Número atómico, número másico, carga y neutrones |
| FILADD, Eje 3-2 Meiosis | `1ALLN-fBd0OjLL29otkMF3MZ3nioIHkjL` | Dotación haploide, reducción meiótica y restitución en fecundación |

Este contraste no reabre ni reemplaza la revisión DEMRE de pertinencia. Se conserva la clasificación curricular previa; revisar una fórmula de material PSU no demuestra que pertenezca al temario actual.

## Observaciones restantes

La auditoría automática pasa de **134 a 102 observaciones**, con **0 errores críticos**. No se modificaron sus reglas ni umbrales. De las 33 soluciones reescritas, 31 eliminan una alerta de paso corto; las otras dos se mejoraron por repetición y claridad aunque no activaban ese umbral. La explicación de M2 elimina otra alerta.

Se revisaron las otras 44 alertas (absolutos, longitud de alternativas y enunciados breves):

- **20 aceptadas en su contexto**, con justificación concreta. Por ejemplo, «todos los reales» es una confusión pertinente al resolver dominios de raíces.
- **24 requieren reformulación**: algunas opciones son demasiado remotas, absolutas o desiguales en estructura; SCI-044 y SCI-063 requieren además revisar la tarea que propone el enunciado.
- **58 alertas de pasos breves siguen pendientes**. No se consideran defectos confirmados solo por su longitud.

Para Lectura se contrastaron los pasajes T01, T04, T11, T16 y T18, no solo las alternativas aisladas. Las decisiones y huellas de los enunciados/opciones están en [el registro editorial](../reports/editorial-triage-2026-10-18.json). Las 20 alertas aceptadas permanecen visibles en el informe automático: la aceptación se limita al motivo señalado, no certifica el ítem completo.

Las 24 reformulaciones deben preservar la trazabilidad del progreso: si cambia la tarea o el significado de alternativas, usar una revisión identificable y una migración explícita, sin reinterpretar silenciosamente respuestas antiguas. No se han aplicado todavía.

## Verificación

214 pruebas lógicas aprobadas, build correcto y comparación de los 780 registros de evaluación sin diferencias. CI de esta revisión: navegador `39129828864`; Android `39129828899`. Ambos terminaron con éxito: 741 pruebas de navegador, 88 comprobaciones web de Android, 8 pruebas instrumentadas y compilación Android correcta. Esta evidencia corresponde a `69ad25a`, anterior a la recuperación de ocho ejercicios de main.

## Reconciliación posterior

La comparación integral de ramas encontró 37 evaluaciones con diferencias en main, varias coincidentes con las 24 candidatas de este registro. Antes de reformularlas, revisar `reports/branch-content-differences-2026-10-18.json` y las dos versiones. No duplicar el trabajo de main ni sustituir silenciosamente respuestas históricas. Las huellas del triage describen la versión de trabajo revisada, no una aprobación de la variante de main.
