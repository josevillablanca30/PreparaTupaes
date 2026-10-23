# Versiones de evaluación: primera etapa integrada

## Implementado

Los intentos nuevos de M1, M2, Ciencias, Lectura e Historia, tanto en práctica como en ensayo, guardan `assessmentVersion`. El recorrido diario registra la misma versión y la conserva al reflejar el intento en el historial tradicional.

La versión `a1-<sha256>` identifica enunciado, orden y texto de alternativas, clave, concepto, familia, pasaje asociado y visual de la pregunta. Lectura incorpora además una huella del título y los párrafos del pasaje. La normalización de IDs numéricos de M1 es compatible con el catálogo diario. No se incluyen pistas, explicaciones ni revisiones del tutor: mejorar esos textos no cambia la evaluación respondida.

La función SHA-256 funciona sin red ni API asíncrona. Se contrasta con `node:crypto` usando Unicode, cadenas vacías, límites de bloques y textos largos. Es una huella de contenido, no una firma ni una protección contra edición del almacenamiento local.

El perfil común no utiliza un intento versionado incompatible para acreditar dominio de la pregunta actual. No recalifica ni elimina ese intento. La limpieza de resultados conserva su índice original aunque la versión actual tenga menos alternativas. Los totales históricos siguen guardados con el resultado que se registró al responder.

## Límites que siguen bloqueando cambios de evaluación

- Los intentos anteriores sin versión mantienen temporalmente su comportamiento anterior. No se les atribuye una versión retroactivamente: podría ser falsa.
- Las sesiones abiertas todavía guardan IDs e índices. Falta conservar y resolver su versión al reanudarlas, incluidas las omisiones y los ensayos con tiempo.
- La huella no contiene el texto antiguo. Falta el archivo de versiones y la selección de esa versión en las pantallas de historial y revisión.
- Falta aplicar la compatibilidad a otros consumidores históricos, incluidos selección adaptativa, diagnósticos y planes de repaso, antes de modificar preguntas bajo el mismo ID.
- No se cambió ninguna de las 788 evaluaciones ni se importaron las 37 variantes de main. Las comprobaciones históricas de reconciliación permanecen activas.

Por estos límites, esta entrega **no declara terminado el versionado ni permite todavía reemplazar preguntas existentes**.

## Evidencia y continuación

232 pruebas lógicas aprobadas; build de 34 archivos aprobado; auditoría: 788 preguntas, 44 observaciones, cero errores críticos. Nueve pruebas nuevas verifican huellas, compatibilidad entre bancos y catálogo diario, cambios de pasaje, conservación de índices y registro real de intentos en M1/Ciencias/Lectura. Las pruebas diarias existentes verifican también el espejo de las cinco materias. Los recorridos móviles de M2/Historia ahora exigen versiones en diagnóstico y ensayo; comprobar su ejecución propia en CI.

La base `29eda7966199b47114848f6cb357230c4bba5298` terminó exitosamente en los runs 39232231289 (747 pruebas móviles) y 39232224926 (90 pruebas web Android y compilación/emulador aprobados). Ese resultado no valida este nuevo código.

Siguiente bloque: archivo inmutable de evaluaciones anteriores y resolución de sesiones guardadas. Incluir compatibilidad del historial sin versión y pruebas que cambien enunciado/opciones/pasaje entre guardar y reanudar. Después de verificar esos escenarios, reformular SCI-044 y SCI-063; no debilitar las pruebas de reconciliación para permitir cambios sin migración.
