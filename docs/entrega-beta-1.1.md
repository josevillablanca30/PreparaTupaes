# ¿Cachaste? — entrega de beta 1.1, 15 de octubre de 2026

Estado: beta para pruebas supervisadas. No se declara versión comercial terminada.

## Respaldo y conservación

Se conservó el commit Android aprobado `20b5cdf562d1865573f8d78d7a9cc8affc71201b` como antecesor. Todos los cambios de la sesión se guardaron en commits organizados y se verificaron contra GitHub en `work/cachaste-respaldo-2026-10-15`. El PR #1 reúne los cambios sin reescribir el historial. El respaldo inicial incluye también el trabajo que estaba incompleto; los commits posteriores corrigen su integración.

## Funcionalidades implementadas

- Cinco materias, diagnóstico de 30, práctica de 10, resultados, historial y recuperación de sesiones.
- Ensayos con mapa, marcación, cambios de alternativa, omisiones, confirmación de entrega y corrección al finalizar. No muestran pistas ni respuestas durante el ensayo.
- Tutor local con pasos, explicación sencilla, ejemplo diferente y respuesta específica a cada distractor.
- Perfil por concepto, registro de errores y prácticas que priorizan debilidades. El refuerzo usa otros ítems y excluye también familias de paráfrasis. Dos respuestas seguras en ítems diferentes, posteriores al último error y sin ayuda, permiten comprobar aprendizaje.
- Historial, diagnósticos, resultados y refuerzos guardados en el dispositivo. Se recuperan borradores tras recargar y recrear la actividad Android. Los datos dañados se filtran sin impedir un nuevo diagnóstico.
- Inicio con progreso de las cinco materias y acceso a la sesión pendiente; controles táctiles, foco visible, movimiento reducido y diseño para 320 px.

## Bancos finales

| Materia | Antes de la sesión | Ahora |
|---|---:|---:|
| Matemática M1 | 116 | 116 |
| Matemática M2 | 55 | 106 |
| Ciencias | 166 | 206 |
| Competencia Lectora | 100 | 130 |
| Historia | 65 | 65 |
| Total | 502 | 623 |

M1 ya existía: se conservó y revisó, no se presenta como un banco nuevo de 116 preguntas. Se conservan los 20 textos lectores. Ciencias mantiene 25 ítems complementarios fuera de las nuevas sesiones por su correspondencia curricular; quedan 181 elegibles. No se borraron sus IDs para preservar historiales antiguos.

Las preguntas son originales, no preguntas oficiales ni un banco validado psicométricamente. El auditor estructural informa 0 errores críticos y 569 alertas heurísticas. Sus etiquetas señalan brevedad, plausibilidad o posibles pistas formales; no equivalen a 569 errores conceptuales comprobados y tampoco se han ocultado.

## Correcciones pedagógicas y técnicas

- Revisión asistida individual de claves, procedimientos y ejemplos de M1, M2, Ciencias, Lectora e Historia. Corrección de ejemplos que no enseñaban el concepto preguntado y de justificaciones genéricas.
- M2: cinco alternativas estándar en suficiencia de datos; 51 ejercicios nuevos con claves comprobadas. Cada concepto de M2 tiene al menos dos ítems.
- Ciencias: precisión en Golgi/RER, filtración, soluciones hipertónicas, ondas electromagnéticas, eficiencia eléctrica y concentraciones. Ampliación en genética, reproducción, óptica, modelos planetarios y química. Se excluyen paráfrasis del mismo ensayo y del refuerzo inmediato.
- Lectora: explicaciones vinculadas a evidencia de cada texto, feedback de distractores y ejemplos específicos. Se añaden 30 ítems para ensayos de siete textos.
- Historia: se distinguen causas estructurales y detonante de la Primera Guerra Mundial; contexto de fuentes y cronología chilena. Se corrige una alternativa ambigua sobre cálculo de desempleo.
- Se corrigió un error de sintaxis que impedía iniciar el motor compartido de M2 e Historia, rutas faltantes en el servidor de pruebas, reanudación del refuerzo de M1 y sobrescritura de un ensayo al consultar resultados antiguos.
- Migración de ensayos anteriores: conserva aciertos conocidos y no duplica el historial al entregar. Las respuestas antiguas cuyo distractor no se guardó no se inventan.

## Estructura de ensayos

| Prueba | Preguntas | Tiempo |
|---|---:|---:|
| M1 | 65 | 140 min |
| M2 | 55 | 140 min |
| Ciencias | 80 | 160 min |
| Competencia Lectora | 65, siete textos | 150 min |
| Historia | 65 | 120 min |

Ciencias integra 54 comunes (18 de cada disciplina) y 26 del módulo elegido: Biología, Física, Química o técnico profesional. La selección se prueba en las cuatro opciones. Las cantidades y tiempos se contrastaron con los temarios DEMRE de PAES Regular 2026 / Admisión 2027. La beta informa aciertos y no convierte estos ejercicios en puntajes oficiales; no conoce cuáles ítems experimentales de una prueba real no se puntúan.

Fuentes: https://demre.cl/la-prueba/pruebas-y-temarios/presentacion-pruebas-temarios-paes-regular

## Validación y APK

Código funcional congelado para validación final: `0a3f2f6a2d82976641831c63b7ed6a31cb0c008c`.

- Lógica local: 104 aprobadas, 0 fallidas, 0 omitidas.
- Integridad: 623 ítems, 0 alertas críticas.
- Compilación web: aprobada.
- Navegador: 144 aprobadas en Android Chrome, iPhone WebKit y pantalla de 320 px. Workflow [38713143623](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38713143623), revisión documental `6445f51` con los mismos archivos funcionales de `0a3f2f6`.
- Android: workflow [38712726253](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38712726253), commit `0a3f2f6`: compilación aprobada; 96 recorridos móviles aprobados; APK instalada en emulador API 36 con 3 pruebas instrumentadas, 0 fallidas y 0 omitidas. Informe nativo: 16,230 s.
- Se descargó la APK del workflow y se compararon sus 17 archivos de aplicación con el respaldo local: idénticos, descontando únicamente la etiqueta de revisión insertada por el build. Todas las páginas empaquetadas identifican el commit probado.
- APK: `Cachaste-1.1.0-beta-0a3f2f6.apk`, 329.828 bytes. SHA-256: `8b783bf6f91b1318677e4ebc61b39b0544c118358e6d9e4a69a8a5e2deb08579`. Se entrega como archivo descargable; el artefacto adicional de Actions tiene retención de tres días.

Android usa API 36, minSdk 24, Java 17 y versión 1.1.0-beta / código 12. No solicita permisos de Internet ni almacenamiento. Las pruebas instrumentadas ejecutan las cinco materias dentro de la APK instalada y comprueban recreación de actividad, progreso y botón Atrás. No equivalen a una prueba en teléfono físico.

## Pendientes reales

1. Revisión independiente por docentes, cobertura exhaustiva de objetivos y calibración de dificultad. Los textos lectores necesitan mayor extensión y complejidad antes de afirmar equivalencia con PAES.
2. El banco finito limita la novedad del refuerzo, especialmente después de un ensayo de Historia que usa sus 65 ítems. La aplicación no presenta una repetición inmediata como aprendizaje nuevo; una práctica espaciada no sustituye ampliar el banco.
3. Teléfonos físicos de gama media: instalación, uso prolongado, lector de pantalla, texto aumentado, retorno tras cierre del proceso y actualización desde la beta anterior. La prueba automatizada cubre recreación de actividad, no todos los cierres del sistema operativo.
4. Compatibilidad de firma con APK antiguas: la clave debug anterior puede haber sido efímera. No se debe desinstalar ni borrar datos para probar una actualización sin preservar antes el avance. El historial actual es local y no hay sincronización entre dispositivos.
5. Pages depende de su habilitación inicial por una cuenta con administración. La conexión utilizada en esta sesión no incluye ese permiso. El workflow conserva las pruebas y no intenta saltarse el requisito de administración.
6. Firma privada definitiva, política de privacidad pública, ficha de Google Play, cuenta y publicación. No se realizaron gastos ni publicaciones en Play. Detalles en `docs/publicacion-play.md`.

La próxima prueba recomendada es supervisada: estudiantes con distinto nivel realizan diagnóstico, práctica, errores con tutor, refuerzo, ensayo con pausa y reapertura. Deben observarse comprensión real, accesibilidad y conservación del progreso, además de aciertos.

## Commits de respaldo verificados

- [`3f75755`](https://github.com/josevillablanca30/PreparaTupaes/commit/3f7575580eb66dc9d27780fe6af9da5459bfab43): content: respaldar revisión individual y ampliación de bancos PAES 2027.
- [`797b3e7`](https://github.com/josevillablanca30/PreparaTupaes/commit/797b3e70066acb427a5518c46ee3e9b917d697be): wip: respaldar tutor, ensayos, refuerzo y persistencia en cinco materias.
- [`be52b95`](https://github.com/josevillablanca30/PreparaTupaes/commit/be52b952fe4f0af3765f862466b5b7fa08a8ab1e): chore: respaldar infraestructura de pruebas y documentar estado de integración.
- [`8730e22`](https://github.com/josevillablanca30/PreparaTupaes/commit/8730e22bf79f1ad8d6f71ebda7d73331e0ea8753): fix: recuperar motor compartido y validar reglas de aprendizaje y bancos ampliados.
- [`f603913`](https://github.com/josevillablanca30/PreparaTupaes/commit/f60391306ea290b280b187f2947cc73c06ba626f): android: preparar beta 1.1 con recuperación y pruebas instrumentadas offline.
- [`8da4a4d`](https://github.com/josevillablanca30/PreparaTupaes/commit/8da4a4d31e71b61d11c2ba881815deafccbedc03): feat: proteger sesiones, completar progreso y preparar Android API 36.
- [`66c08e9`](https://github.com/josevillablanca30/PreparaTupaes/commit/66c08e9aa5d54ce967c80d4560242c92e1ebba7b): fix: evitar paráfrasis repetidas y reanudar refuerzos sin perder sesiones.
- [`2ba6336`](https://github.com/josevillablanca30/PreparaTupaes/commit/2ba63369225b3765146452ef5d9f6e9cd7f83ac0): ci: localizar SDK manager explícitamente para compilar Android 16.
- [`cb5a40f`](https://github.com/josevillablanca30/PreparaTupaes/commit/cb5a40f3e5c837a8f766c7296d536e62d512a405): feat: completar transferencia adaptativa con 28 ejercicios revisados.
- [`0a3f2f6`](https://github.com/josevillablanca30/PreparaTupaes/commit/0a3f2f6a2d82976641831c63b7ed6a31cb0c008c): fix: distribuir claves de nuevos ejercicios sin alterar sus explicaciones.
- [`6445f51`](https://github.com/josevillablanca30/PreparaTupaes/commit/6445f517a215381267191478b351eaf9d019ed15): docs: registrar entrega beta, respaldo y limites verificados.

La evidencia final se agrega en un commit documental posterior. La lista completa se conserva en https://github.com/josevillablanca30/PreparaTupaes/pull/1/commits.

## Integración en main y estado real de Pages

El PR #1 fue fusionado conservando los commits, sin squash ni reescritura. GitHub confirmó `main` en `d3de0bb5ae96100b97eff41a903d8fb0c6012e8d`, con el commit aprobado original y el último respaldo como padres del merge. La comparación con el código de la APK probada solo muestra cambios en documentación. La rama de respaldo se conserva.

El workflow de main [38713890214](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38713890214) aprobó de nuevo los 144 recorridos de navegador. El job de despliegue 116353409093 falló al consultar la configuración con `Get Pages site failed` / `Not Found`. Por tanto **Pages no está publicado ni verificado**. El sitio debe habilitarse inicialmente en Settings → Pages con origen GitHub Actions desde una cuenta con administración. La conexión de esta sesión no tiene ese permiso; no se desactivaron pruebas ni se afirma un despliegue exitoso.

La repetición Android del merge en main también terminó correctamente: [workflow 38713890053](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38713890053), código `d3de0bb`: 96 recorridos móviles aprobados, APK compilada e instalada en Android 16 y 3 pruebas instrumentadas aprobadas, sin fallos ni omisiones. La APK entregada sigue identificada por `0a3f2f6`; su código funcional coincide con main.
