# Banco de contenidos · Prepara tu PAES

Arquitectura de preguntas preparada para **M1, M2, Competencia Lectora, Ciencias e Historia**. No altera el prototipo actual hasta realizar la migración y sus pruebas.

## Organización
- `schema.json`: contrato de datos para todos los ejercicios.
- `examples/m1.json`: pregunta **original** que sirve como ejemplo de importación.
- Un futuro archivo por materia, habilidad y lote de revisión.

## Reglas para importar
1. Enunciado y alternativas deben estar completos, incluidas imágenes, expresiones y textos base.
2. `answerIndex` es cero basado y debe corresponder a la solución demostrada.
3. Cada distractor lleva explicación específica.
4. Ningún ejercicio se publica sin revisión de contenido, procedimiento y derechos.
5. `origin.rights=unknown` **nunca** puede llegar al catálogo público.
6. `status=published` solo después de una revisión pedagógica y técnica.
7. Los pasajes de Competencia Lectora se guardarán como texto base asociado y no se sustituirán por preguntas de matemáticas.
8. Gráficos, figuras y fórmulas deben validarse visualmente.
9. Los ítems de terceros alojados en Drive son material de investigación y no pueden incorporarse automáticamente a una aplicación pública.
10. Los ensayos completos deben basarse en la estructura vigente aplicable a cada prueba, no asumir que todas tienen 65 preguntas.

## Estado
El catálogo ejecutado actualmente sigue integrado en `index.html`. Esta carpeta es la preparación de su futura migración, no el motor conectado todavía.
