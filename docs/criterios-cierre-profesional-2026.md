# Criterios de cierre profesional — ¿Cachaste?

Actualizado 16/10/2026 tras tercera ampliación y CI verde. **No solicitar al usuario que pruebe la aplicación antes de resolver las brechas relevantes.**

## Avance ya implementado

La aplicación conserva 671 preguntas de evaluación (623 originales y 48 transferencias originales en tres lotes), cinco materias, mapa progresivo, selección de mención de Ciencias, tutor de tres modos y refuerzo voluntario. La nueva estructura ofrece **287 talleres por concepto del banco**: M1 65; M2 48; Lectura 10; Ciencias 114; Historia 50. Cinco talleres son pilotos redactados individualmente; los otros 282 componen clases y secuencias usando explicaciones existentes del tutor. Que el código funcione no certifica calidad editorial individual.

Los talleres permiten clase, actividad interactiva, retroalimentación por error, guardar estado y rendir preguntas PAES independientes. No dan XP ni declaran dominio por superar un juego. El estudiante que ya sabe puede rendir sin clase obligatoria.

## Brechas por materia

| Asignatura | Conceptos | Conceptos sin dos familias independientes de evaluación |
|---|---:|---:|
| M1 | 65 | 19 |
| M2 | 48 | 1 |
| Lectora | 10 | 0 |
| Ciencias | 114 | 59 |
| Historia | 50 | 22 |
| **Total** | **287** | **101** |

Los 101 conceptos siguen sin dos familias independientes de evaluación, según la auditoría reproducible del último código. De ellos, al menos 94 todavía tienen solo un ítem. Dos IDs distintos no equivalen necesariamente a transferencia independiente. Ejecutar `node scripts/readiness-audit.mjs` para obtener el listado exacto actualizado. [El inventario del segundo lote](../reports/readiness-transfer-batch2-2026-10-16.json) es histórico, no el resultado final.

La última auditoría heurística registró **132 observaciones para revisión y 0 errores críticos automáticos**, sobre las 671 preguntas. No significa que las 132 observaciones sean errores confirmados ni que las preguntas estén certificadas: necesitan contraste editorial, solución y revisión de sus distractores.

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

## Estado actual verificado en GitHub Actions (16/10/2026)

- **671 preguntas:** 623 del banco original y 48 casos nuevos de transferencia PAES en tres lotes.
- **287 talleres por concepto** del banco actual, algunos compuestos automáticamente desde las explicaciones; la revisión individual de todos sus textos sigue pendiente.
- **101 conceptos sin dos familias independientes**, M1 19, M2 1, Lectura 0, Ciencias 59, Historia 22. No mostrarlos como dominio demostrado.
- **132 observaciones heurísticas** pendientes de revisión, sin bloqueos críticos detectados por el auditor automático.
- GitHub Actions en el commit `fcfff21a891d90d9026eeedae807c5feb1735327`: [188 pruebas lógicas aprobadas](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38967454278), [711 pruebas móviles Playwright aprobadas](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38967454278), [APK compilada e instalada en emulador Android](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38967448189). Validación CI no equivale a prueba pedagógica con estudiantes.
- `main` permanece sin cambios; PR #5 está abierto y en borrador.

