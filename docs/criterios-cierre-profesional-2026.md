# Criterios de cierre profesional — ¿Cachaste?

Actualizado 18/10/2026. No solicitar prueba al usuario antes de resolver las brechas relevantes. Las compilaciones de la rama de trabajo son control interno.

## Estado vigente

El catálogo contiene **780 preguntas: 623 originales y 157 transferencias**. De ellas, **747 están habilitadas para práctica PAES** y **33 son complementarias**. Se conservan sus identificadores y el historial. Las transferencias heredan el alcance de su base; una pregunta complementaria no se convierte en PAES por tener un ID nuevo.

| Materia | Preguntas totales | Preguntas PAES | Conceptos PAES | Conceptos PAES sin segunda familia |
|---|---:|---:|---:|---:|
| M1 | 147 | 147 | 65 | 0 |
| M2 | 107 | 107 | 48 | 0 |
| Lectora | 130 | 130 | 10 | 0 |
| Ciencias | 293 | 262 | 99 | 0 |
| Historia | 103 | 101 | 48 | 0 |
| **Total** | **780** | **747** | **270** | **0** |

Las rutas de Ciencias se comprueban con su selección real: módulo común más la mención elegida, o módulo técnico profesional. Un caso de otra ruta no puede cerrar artificialmente la brecha.

| Ruta de Ciencias | Preguntas PAES disponibles | Conceptos | Sin segunda familia |
|---|---:|---:|---:|
| Biología | 137 | 57 | 0 |
| Física | 143 | 61 | 0 |
| Química | 147 | 63 | 0 |
| TP | 141 | 62 | 0 |

Las rutas comparten el módulo común; sus cantidades no se suman como bancos independientes. La matriz general conserva **7 brechas complementarias**: inflamación local, reflexión y eco, tabla periódica y valencia, trabajo de una fuerza constante, transformaciones en generadores, ahorro por aportes periódicos y diversificación y riesgo.

**Alcance de la conclusión:** la auditoría comprueba cantidad de familias por concepto existente. No demuestra que se hayan incorporado todos los objetivos del temario, que toda variante sea cognitivamente independiente ni que cada taller tenga profundidad suficiente. El dominio individual sigue requiriendo respuestas correctas y seguras de familias distintas, sin ayuda y después del último error.

## Verificación de esta pasada

- **214/214 pruebas lógicas aprobadas**, incluidas claves cuantitativas, herencia curricular, disponibilidad por mención y conservación de historial.
- **Compilación web correcta**; el catálogo ampliado llega al recorrido diario y a las pantallas tradicionales de M2 e Historia.
- **0 errores críticos estructurales; 134 observaciones heurísticas** abiertas. El número no equivale a defectos confirmados.
- **738 pruebas Playwright declaradas**, con escenarios nuevos para M2, Historia y las cuatro rutas de Ciencias.
- Ejecución de navegador local bloqueada por descarga incompleta del binario. Los resultados de CI anteriores no validan los cambios actuales. Comprobar la revisión exacta antes de entregar APK.

## Criterios obligatorios antes de declarar una versión completa

1. Pertinencia: contrastar los objetivos de todas las materias con DEMRE Regular 2026 / Admisión 2027. El material PSU antiguo de Drive no amplía el alcance oficial.
2. Editorial: revisar individualmente cada clase, solución, distractor, explicación del error y ejemplo. Registrar resolución de las alertas heurísticas y contrastar independencia semántica de las familias.
3. Cobertura: mapear cada objetivo oficial a contenido practicable y habilidades evaluadas. Cero brechas dentro del banco actual no significa temario íntegro cubierto.
4. Pedagogía: nivel medio, tutor comprensible y retroalimentación específica. Los juegos y las clases no otorgan dominio por sí solos.
5. Experiencia: revisar visualmente mapas, navegación, gato, animaciones y pantallas; mantener movimiento reducido y legibilidad en pantallas pequeñas.
6. Técnico: CI de la revisión vigente en Android, iPhone y 320 px; APK instalada y firmada, offline, persistencia, reanudación y botón Atrás.
7. Fuentes: los 526 archivos de Drive están inventariados. No se han leído íntegramente todos los volúmenes; consultar secciones y registrar el contraste real sin atribuir una revisión inexistente.
8. Producto: completar los controles y el pilotaje antes de declarar una versión comercial y fusionar para producción.

## Evidencia e historial

- [Matriz vigente reproducible](../reports/readiness-current.json), generada con `node scripts/readiness-audit.mjs`.
- [Cambios y fuentes de esta pasada](pasada-amplia-2026-10-18.md).
- [Orden pedagógico Drive/DEMRE](orden-curricular-drive-demre-2026.md) y [contraste oficial](contraste-demre-2027.md).
- Los informes `readiness-*-2026-10-16.json` son fotografías históricas. Sus cifras no describen el estado vigente.
- El commit `fcfff21a891d90d9026eeedae807c5feb1735327` tuvo 188 pruebas lógicas, 711 móviles y emulador Android aprobados el 16/10. Esa evidencia se conserva como antecedente, no como validación de esta pasada.

## Envío y validación remota de esta pasada

El usuario autorizó el 18/10/2026 subir esta pasada a `work/cachaste-motor-duolingo-20261016` del repositorio público `josevillablanca30/PreparaTupaes`. La publicación se limita a la rama de trabajo y sus comprobaciones internas. La revisión de navegador y del APK debe corresponder a ese código; los resultados locales son 214 pruebas lógicas aprobadas, build correcto y cero errores críticos estructurales.

La autorización resuelve el rechazo automático inicial. El checkout no dispone de credenciales para `git push`; se utiliza el conector de GitHub con comprobación de árbol y actualización sin forzar. La fusión y el despliegue de `main` siguen sujetos a los criterios de cierre.
