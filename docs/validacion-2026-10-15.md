# Validación de integración — 15 de octubre de 2026

Respaldo inicial remoto: `be52b952fe4f0af3765f862466b5b7fa08a8ab1e`.
Corrección del motor y reglas: `8730e22bf79f1ad8d6f71ebda7d73331e0ea8753`.

Comprobaciones locales completadas:

- 100 pruebas de lógica aprobadas; sin omitidas.
- Integridad estructural de 595 preguntas: 0 errores críticos; 547 alertas heurísticas para revisión editorial. Esas alertas no se ocultan ni equivalen todas a errores conceptuales.
- 36 recorridos de interfaz aprobados en Chrome con emulación Pixel 7.
- Los mismos 36 recorridos aprobados con pantalla de 320 × 640 y controles táctiles.
- 14 comprobaciones adicionales aprobadas (7 escenarios en ambas configuraciones): ensayos M2/Historia editables y cronometrados, entrega al vencer el tiempo, conservación tras recarga, refuerzo con otros ítems y Lectora con siete textos.
- Chromium local 153 obtenido del paquete de pruebas de Sparticuz; GitHub Actions conserva los navegadores fijados por Playwright.

Android:

- Implementada recuperación de la última materia, recreación de actividad, ciclo pausa/reanudación y tratamiento del botón Atrás.
- Navegación WebView limitada a páginas locales conocidas y apertura explícita de enlaces HTTPS en navegador externo.
- Sin permisos de Internet ni almacenamiento.
- Versión preparada: 1.1.0-beta, versionCode 12; conserva el identificador de la beta existente.
- Agregadas tres pruebas instrumentadas para ejecutar contra la APK instalada: cinco materias sin servidor, persistencia tras recreación/botón Atrás y permisos mínimos.
- La ejecución Android en emulador y la compilación de esta versión todavía están pendientes al crear este checkpoint.

Pendientes de publicación:

- Configuración inicial de Pages: la conexión de GitHub no incluye administración y el intento anterior de habilitación devolvió `Resource not accessible by integration`.
- Firma definitiva de producción y cuenta de Google Play aún no configuradas. La firma debug se conserva por rama en caché para futuras pruebas; no es firma de publicación.
- Validación externa docente, calibración de dificultad, mayor profundidad de textos lectores y cobertura curricular exhaustiva siguen siendo criterios abiertos de versión comercial.

## Primer Android instalado y comprobado

El workflow [38708336309](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38708336309), commit `f60391306ea290b280b187f2947cc73c06ba626f`, terminó correctamente. Compiló la APK y aprobó las tres pruebas instrumentadas en emulador API 35: 3 ejecutadas, 0 fallos, 0 omitidas. El informe Android registra 100% de aprobación. No se afirma prueba en teléfono físico.

Después de ese checkpoint se preparó API 36 para los requisitos vigentes de futuras publicaciones. También se protegió la sesión activa de M1 al consultar resultados anteriores, se añadieron controles de datos dañados y se conservan las respuestas de ensayos de versiones anteriores sin duplicar el historial. La nueva compilación de esos últimos cambios se validará en su propio workflow; el resultado de API 35 no se atribuye a un commit posterior.
