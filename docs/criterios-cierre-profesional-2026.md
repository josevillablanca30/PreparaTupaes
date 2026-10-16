# Criterios de cierre profesional — ¿Cachaste?

Actualizado 16/10/2026. **No solicitar al usuario que pruebe la aplicación antes de resolver las brechas relevantes.**

## Avance ya implementado

La aplicación conserva 641 preguntas de evaluación (623 originales conservadas y 18 nuevas transferencias), cinco materias, mapa progresivo, selección de mención de Ciencias, tutor de tres modos y refuerzo voluntario. La nueva estructura ofrece **287 talleres por concepto del banco**: M1 65; M2 48; Lectura 10; Ciencias 114; Historia 50. Cinco talleres son pilotos redactados individualmente; los otros 282 componen clases y secuencias usando explicaciones existentes del tutor. Que el código funcione no certifica calidad editorial individual.

Los talleres permiten clase, actividad interactiva, retroalimentación por error, guardar estado y rendir preguntas PAES independientes. No dan XP ni declaran dominio por superar un juego. El estudiante que ya sabe puede rendir sin clase obligatoria.

## Brechas por materia

| Asignatura | Conceptos | Conceptos con solo una pregunta |
|---|---:|---:|
| M1 | 65 | 24 |
| M2 | 48 | 0 |
| Lectora | 10 | 0 |
| Ciencias | 114 | 63 |
| Historia | 50 | 31 |
| **Total** | **287** | **118** |

Los 118 casos necesitan al menos otro problema original, realmente independiente y pedagógicamente revisado. Dos identificadores no garantizan independencia si el caso es el mismo: la cifra es un mínimo. Los objetivos específicos están en [la matriz actualizada del lote 1](../reports/readiness-transfer-batch1-2026-10-16.json).

La auditoría heurística detectó 129 observaciones editoriales en el banco previo (entre ellas 88 pasos breves en Ciencias y 35 distractores con lenguaje absoluto). No son necesariamente errores, pero requieren verificación por ítem, explicación y fuente.

## Criterios obligatorios antes de declarar una versión completa

1. Pertinencia: cotejar objetivos de todas las materias con los temarios DEMRE para PAES Regular 2026 / Admisión 2027; no trasladar indiscriminadamente material PSU o escolar fuera de temario.
2. Editorial: revisar por separado cada clase, solución, distractor, explicación del error y ejemplo de transferencia contra contenidos adecuados.
3. Evidencia: no marcar dominio sin al menos dos familias independientes de ejercicios correctos y seguros después del último error o ayuda.
4. Pedagogía: enseñanzas de nivel medio sin trivializar conceptos, tutor accesible, retroalimentación específica según la opción escogida y refuerzo si se necesita.
5. Juego: mapas usables, desafíos con tarea cognitiva auténtica, un solo gato expresivo por situación y progresión transparente.
6. Técnico: CI lógico y de navegador sin fallos; Android, iPhone y pantalla pequeña; APK instalada y firmada; prueba offline, persistencia y botón Atrás.
7. Biblioteca: los 526 archivos de Drive están inventariados para búsqueda por editorial y materia. **Todavía no han sido leídos ni contrastados individualmente en su totalidad**. No distribuir contenido completo de editoriales sin autorización.
8. Producto: no pedir prueba al usuario ni fusionar el PR hasta que se cumplan los controles anteriores. Las compilaciones de GitHub son control interno.

Documentación: [orden pedagógico Drive/DEMRE](orden-curricular-drive-demre-2026.md) · [contraste oficial](contraste-demre-2027.md) · [matriz de vacíos](../reports/readiness-curriculum-2026-10-16.json).

## Lote 1 de transferencia original (16/10/2026)

Se incorporaron 18 casos independientes (seis de M1, seis de Ciencias, seis de Historia) con resolución, cuatro distractores y explicaciones por alternativa. El banco pasa de 623 a 641 preguntas, y las brechas de una sola pregunta bajan de 136 a 118. Los archivos originales se conservaron sin cambios. La auditoría estructural y las pruebas automatizadas incluyen el lote; su evaluación disciplinar externa y el pilotaje con estudiantes siguen pendientes. Consulta [la matriz actualizada](../reports/readiness-transfer-batch1-2026-10-16.json).
