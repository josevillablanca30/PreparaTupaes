# Tutor profesor — pasada del 15 de octubre de 2026

Base remota comprobada antes de editar: `269220a677a7fc2ce57d16a0532fb7f7234038fd`.
Se mantiene el banco de 623 preguntas y la beta 1.1. No se agregan ítems de evaluación ni se rediseñan pantallas ajenas al tutor.

Primer lote: 40 preguntas de M2, 16 conceptos. Se escriben fundamentos, una estrategia cotidiana, otro problema desarrollado y comprobación específica por pregunta. Se conservan y revisan las aplicaciones concretas del banco; el tutor distingue las secciones de enseñanza y muestra la alternativa elegida con su diagnóstico y reparación desplegable. Los resultados históricos ofrecen el mismo contenido profundo.

No se llama excelente a ningún ítem por cumplir tamaño o estructura. La clasificación editorial asistida de este lote es adecuada; comprobar aprendizaje real requiere observar estudiantes. Las otras preguntas siguen explícitamente pendientes en `reports/tutor-review-2026-10-15.json`. El archivo original de M2 se conserva en `pedagogy/m2-before-2026-10-15.json` para comparar claves y contenido.

Antes/después:

- M2-050: el ejemplo anterior terminaba cortado en «(2)». Ahora se explica por qué distancia y condición de entero admiten dos coordenadas, cómo mostrar el contraejemplo y qué información sí decide el signo. La comprobación original demuestra que 4 y −4 son pares y ambos cumplen el cuadrado pedido.
- M2-003: antes solo se multiplicaban dos fracciones y el otro ejemplo cambiaba los colores de una bolsa. Ahora se explica qué cambia al retirar un objeto; el ejemplo trata de asignar los primeros lugares de una exposición, cuenta ambos órdenes y distingue una secuencia de dos.
- M2-001: antes tres frases sobre completar el cuadrado. Ahora se definen función, parábola, vértice y sus dos coordenadas; una analogía de valle distingue ubicación y altura. Un modelo de costo compara producciones simétricas y encuentra el mínimo.

Validación del primer lote: 107 pruebas de lógica aprobadas; 8 recorridos nuevos aprobados en Chrome Android y 320 px. Esos recorridos verifican los tres modos, el distractor exacto, el guardado al cambiar de modo, recuperación tras recarga y refuerzo con ítems distintos del mismo concepto. Las primeras pruebas locales usaron un dist anterior; se reconstruyó la aplicación y se probaron los archivos actuales. No se desactivó ninguna prueba.

Segundo lote: 74 preguntas de M2 cubiertas, 32 conceptos. Se añaden procedimientos y estrategias distintas para álgebra, geometría, estadística y modelos. La aplicación de completar el cuadrado muestra ahora explícitamente sumar y restar cuatro; los despejes e inversas justifican operaciones en ambos lados. Los ejemplos de Pitágoras, proporcionalidad y círculo que duplicaban el enunciado original se sustituyen por tareas de transferencia. Validación: 108 pruebas de lógica aprobadas; claves y alternativas idénticas al snapshot anterior.

Tercer lote: M2 completo, 106 preguntas y 48 conceptos. Los tres modos se reconstruyen a partir de 48 módulos conceptuales escritos para esta pasada, las aplicaciones particulares de cada ítem y 106 comprobaciones específicas. No se afirma haber escrito 318 clases independientes: los fundamentos de un concepto se comparten donde corresponde y la aplicación/comprobación permanece ligada a la pregunta.

Se revisaron los 326 distractores de M2 y se reescribieron 12 diagnósticos defectuosos o poco explicativos. En M2-027 los símbolos de valor absoluto habían partido una explicación en ocho fragmentos para cuatro alternativas. En M2-024 se atribuía nueve a una operación que no da nueve: ahora se distingue 3² del coeficiente 3 por 2². Cada opción tiene una explicación alineada y una reparación accesible.

La media de 2,4,6,8 aparecía con dos IDs distintos. Se conservan ambos por compatibilidad del historial, pero pertenecen ahora a una misma familia. Esa familia no se repite como transferencia y tampoco puede aportar dos evidencias independientes para declarar dominio. Como el banco no se amplía en esta misión, ese concepto no tiene una transferencia inédita disponible: se informa el agotamiento en vez de presentar la misma cuenta como nuevo aprendizaje.

Clasificación asistida de M2 antes: 104 básicas y 2 insuficientes por contenido incompleto o desalineado; después: 106 adecuadas, ninguna certificada excelente. Quedan 517 preguntas pendientes de esta pasada: M1 116, Ciencias 206, Lectora 130 e Historia 65. El registro no las marca como revisadas.

Validación al guardar este lote: 110 pruebas de lógica aprobadas y auditor estructural con cero errores críticos. Se añadió una cuarta prueba instrumentada que recorre el tutor profundo dentro del WebView Android, selecciona un distractor, cambia entre estrategias, recrea la actividad y solicita otro ejercicio. La regresión completa de navegador y la compilación Android final están en curso, no se atribuyen resultados de una APK anterior a este código.

Verificación exhaustiva de presentación: 30 pruebas locales aprobadas (15 escenarios en Chrome Android y los mismos 15 en 320 px). Los once escenarios adicionales recorren, en bloques de diez, las 106 preguntas de M2 y comprueban para cada una sus tres estrategias, el diagnóstico asociado al distractor seleccionado, ausencia de desborde horizontal y conservación de respuestas/historial. No se confunde este recorrido técnico con una medición de comprensión con estudiantes reales.

La primera ejecución de la nueva prueba Android falló por la preparación del caso: inyectar el almacenamiento desde la página M2 y luego recargar permitía al manejador pagehide de esa página guardar su estado previo. El fixture ahora se prepara desde el dashboard, antes de abrir M2. Se conserva la prueba completa y se vuelve a ejecutar; no se ignora ni se desactiva. En esa revisión, las otras tres pruebas nativas y los 156 recorridos de navegador de CI aprobaron. La matriz ampliada lleva la suite completa a 189 recorridos.

Último ajuste editorial: se reemplazan dos diagnósticos de M2-082 que solo remitían a otros datos o a la fórmula. Ahora se contrasta la fracción del círculo representada por 6π o 4π con el tercio exigido por 120°. El total final es 14 diagnósticos de distractores reescritos, además del recorrido de reparación disponible para los 326.
