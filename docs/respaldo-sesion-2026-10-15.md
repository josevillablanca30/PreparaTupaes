# Respaldo de la sesión — 15 de octubre de 2026

Base conservada: `20b5cdf562d1865573f8d78d7a9cc8affc71201b`.
Rama de respaldo: `work/cachaste-respaldo-2026-10-15`.

## Trabajo conservado

- M1: 116 preguntas existentes; revisión de claves, ejemplos y supuestos; persistencia de prácticas, historial y refuerzo con otras preguntas.
- Historia: 65 preguntas; explicaciones por distractor y corrección de ambigüedad en HIS-065.
- Ciencias: 204 preguntas, incluidas 38 nuevas. Se conservan 25 preguntas complementarias para no perder referencias históricas; 179 son elegibles para sesiones conforme al listado curricular aplicado.
- M2: 80 preguntas, incluidas 25 nuevas; suficiencia de datos con cinco alternativas y nuevos ejemplos de transferencia.
- Lectora: 130 preguntas y 20 textos originales; siete textos/65 preguntas en ensayo, nuevos ejemplos y explicaciones de distractores.
- Motor compartido M2/Historia: sesiones cronometradas, mapa, revisión final, historial y progreso.
- Motor común de aprendizaje: selección adaptativa, preguntas diferentes y confirmación por dos ítems distintos sin ayuda ni dudas.
- Capa visual móvil compartida; incorporación de recursos en build y servidor de pruebas.

## Estado real de validación del respaldo

Este respaldo es trabajo en integración; no es una versión publicable.

- La comprobación local de lógica posterior a cambios produjo 75 aprobaciones y 19 fallos. Hay expectativas antiguas de cantidades y comportamiento que deben actualizarse con controles equivalentes o más fuertes; también deben resolverse regresiones reales.
- Las pruebas de navegador ya se ejecutaron. Detectaron recursos faltantes en el servidor de pruebas, corregidos, y un error de sintaxis en `study-app.js`: directiva `use strict` dentro de función con parámetros desestructurados. Se conserva aquí para que no se pierda el estado antes de corregirlo.
- Quedan pendientes revisión de fixtures ante guardado al cerrar, selección adaptativa y recorridos completos en las cinco materias.
- Android no fue modificado todavía en esta sesión. La última APK aprobada sigue siendo la de la base; aún no existe una nueva APK validada de estos cambios.
- Pages tiene un bloqueo de habilitación inicial: `Resource not accessible by integration`. La corrección de permisos/configuración aún no está aplicada.
- La revisión asistida no equivale a validación externa por docentes ni a calibración psicométrica. El corpus lector es formativo y más breve que un ensayo oficial.

## Continuación técnica

1. Corregir integración y actualizar pruebas que describen la nueva conducta, sin desactivar controles.
2. Ejecutar lógica, integridad, navegador móvil y recuperación tras cierre.
3. Terminar Android, compilar y probar APK; revisar Pages según permisos disponibles.
4. Integrar a `main` únicamente al aprobar las comprobaciones; mantener este respaldo identificable.

Los cambios se guardarán en commits frecuentes y se comprobarán en el remoto.
