# Entrega técnica: ¿Cachaste?, un ratito a la vez

Estado: integración funcional para beta; no se declara plataforma comercial terminada.

## Implementado y respaldado

- Inicio diario con el gatito oficial, objetivo recomendado, misión, continuidad y cinco asignaturas. Se preservan diagnósticos, menciones, Express y ensayos existentes.
- Catálogo generado de los bancos originales: 623 preguntas, sin cambios de claves, alternativas, IDs ni textos de lectura. La imagen original se conserva sin generar un personaje diferente.
- Organización asignatura → eje → unidad → objetivo/nivel → clase breve; unidades desplegables y progreso por evidencia.
- Express libre e inteligente, cantidades breves y tiempos orientativos 3/5/10 minutos, sin cronómetro obligatorio.
- Presentaciones registradas, preguntas nuevas prioritarias, exclusión de familias recientes, repaso espaciado y agotamiento explícito.
- Diagnóstico tradicional e historial alimentan el perfil diario. Express y camino comparten exactamente ese perfil. Las respuestas nuevas se reflejan en estadísticas y refuerzo tradicionales sin borrar notas, ensayos ni sesiones.
- Clases progresivas con fundamento, otro ejemplo resuelto, práctica y tres modos del profesor. Diagnóstico particular por distractor, figuras/gráficos originales de M1 y citas exactas resaltadas en Lectura.
- Comprobación con otra pregunta disponible del mismo concepto. Ver una explicación no acredita dominio; se distinguen pistas, estudio previo, azar y respuesta segura.
- Misiones, XP, racha con fecha chilena, tres logros iniciales y últimas sesiones. Los errores no quitan puntos ni bloquean el estudio.
- Persistencia de sesión, recuperación tras recarga, guardado por interacción y protección frente a sesiones dañadas.

## Banco y recorrido inicial

| Materia | Preguntas | Unidades propias | Niveles/objetivos | Niveles con dos familias disponibles por concepto |
|---|---:|---:|---:|---:|
| M1 | 116 | 26 | 73 | 41 |
| M2 | 106 | 10 | 53 | 52 |
| Lectura | 130 | 3 | 16 | 16 |
| Ciencias | 206 | 11 | 122 | 49 |
| Historia | 65 | 5 | 53 | 15 |

Los niveles no son 317 clases nuevas independientes: reutilizan preguntas revisadas y fundamentos por concepto. El temario oficial define ejes y contenidos, no esta secuencia editorial. Los 25 ítems suplementarios de Ciencias siguen identificados como complementarios. La revisión editorial consolidada cubre 623 preguntas; la calificación es adecuada, no excelente ni validada por resultados reales con estudiantes.

## Ejemplos pedagógicos

M1, ítem 1: antes comenzaba directamente con 40.000 × 0,25. Ahora define porcentaje y base, diferencia descuento de precio pagado, desarrolla cálculo y comprobación, y ofrece un ejemplo de otro contexto.

SCI-204: antes «Densidad es masa dividida por volumen: 24/8=3 g/cm³». Ahora enseña qué significan masa, volumen y gramos por centímetro cúbico, compara dos muestras de tamaños diferentes con la misma densidad y comprueba recuperando sus masas.

LEC-085: la versión anterior decía que una conclusión no respaldada «se justifica», contradiciendo la consigna negativa. Ahora enseña a identificar la afirmación que excede la evidencia y explica por qué no debe aceptarse como conclusión.

## Archivos principales

`daily-core.js`, `daily-curriculum.js`, `daily-app.js`, `daily-ui.css`, `daily-visuals.js`, `inicio.html`, `assets/gatito-sabio-oficial.png`, `scripts/daily-catalog.mjs`, build/preview, bancos y aplicaciones tradicionales para integrar refuerzo, configuración y pruebas nativas Android. Se añadieron pruebas de lógica y recorridos móviles, más los informes de clasificación y revisión.

## Validación local

148 pruebas de lógica aprobadas. Suite completa aislada: 394 ejecuciones aprobadas en Android Chromium y pantalla de 320 px. Después del ajuste de disponibilidad por concepto: ocho recorridos diarios adicionales aprobados. Se verifican conservación de claves, los tres modos, distractores, textos, diagnóstico, ensayos, menciones, sesiones, refuerzo y navegación.

Una ejecución anterior compartió directorios de trazas con otra y produjo dos errores ENOENT al cerrar el navegador. La repetición aislada pasó completa; no se desactivaron pruebas. El control heurístico editorial informa cero errores críticos y 129 alertas para revisión, que no son una certificación conceptual independiente.

## Validación remota y distribución

La APK solicitada corresponde a versión 1.2.0-beta-daily, código 13, con el mismo identificador y configuración de firma beta. La compilación y pruebas nativas del SHA final se registran en el cierre de esta entrega. No se ha publicado en Google Play.

## Parcial o pendiente

- Grafo de prerrequisitos completo: hay trece relaciones iniciales, incluidas bases M1 para M2; falta curar todo el recorrido y su progresión de dificultad.
- Cobertura suficiente para comprobar todos los objetivos: los niveles sin dos familias permiten estudiar, pero no acreditan dominio. Hace falta ampliación editorial selectiva, sin paráfrasis que simulen evidencia nueva.
- Seis estados del gatito comparten una imagen oficial. No existen seis ilustraciones nuevas. La enseñanza diaria lo integra; los flujos tradicionales conservan su presentación anterior.
- El diario aún no ofrece filtro propio por mención de Ciencias; las menciones se mantienen en diagnóstico y ensayo tradicionales.
- Validación con estudiantes y teléfonos físicos de gama media; la prueba automatizada y emulador no sustituyen ese trabajo.
- No hay cobertura íntegra de diagramas por concepto ni un sistema predictivo de dificultad entrenado: se usan recursos locales y reglas explícitas.
- Configuración administrativa de GitHub Pages: se informa el resultado real del despliegue, sin presentar una compilación correcta como publicación exitosa.

Siguiente prueba recomendada: tres estudiantes (principiante, con dificultades y avanzado), sesiones de cinco minutos durante una semana, incluyendo una interrupción y reapertura diaria. Priorizar unidades iniciales con evidencia suficiente y registrar confusiones, no solo aciertos o satisfacción.

## Evidencia remota verificada (primera APK diaria)

SHA `47349b0a986b15a768ef8b9799fdb76f64acf6b0`: Android https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38806015061 aprobado; seis pruebas en emulador API 36, WebView sin permiso de Internet, incluyendo la sesión diaria. La suite de Pages https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38806015135 aprobó 591 pruebas en los tres perfiles. Su despliegue falló con `Get Pages site failed ... Not Found` al consultar el sitio; habilitar Pages para GitHub Actions requiere administración del repositorio y no se puede solucionar con el permiso `contents: read` del workflow.

La APK de ese SHA fue descargada y comprobada: 2.101.089 bytes, SHA-256 `88533f133151925f4c3efd1f5863f750555be0a4f1dc500cb0918fd87144a79b`. Contiene las 623 preguntas, el catálogo y la imagen oficial idéntica al original. Su certificado conserva SHA-256 `06fea3ef23af90358868d6c7edf877a871404027e1f7104036ed25ff7b05df22`. La corrección final de clasificación de cuatro ítems de M2 queda en `1566f44`; su compilación se registra a continuación al terminar.

## Commits de la integración diaria

| Commit | Resultado |
|---|---|
| [4b466e3](https://github.com/josevillablanca30/PreparaTupaes/commit/4b466e30519e7ef262278efc3f37743754256f17) | Cierre de las 206 clases de Ciencias; 623 preguntas con revisión editorial consolidada. |
| [a4bb0ac](https://github.com/josevillablanca30/PreparaTupaes/commit/a4bb0ac307e4c36b1834d7318b4b03e9848081f0) | Gatito oficial, inicio diario, camino, Express y recompensas locales. |
| [157f2b3](https://github.com/josevillablanca30/PreparaTupaes/commit/157f2b3afe60c7f453802edc58754e1cec7af42b) | Objetivos precisos, prerrequisitos, figuras, evidencia textual y repaso espaciado. |
| [6635ec2](https://github.com/josevillablanca30/PreparaTupaes/commit/6635ec263076ac18e995ee273a65f3bce0ff41f1) | Integración con refuerzo y metadatos del historial tradicional. |
| [70f4664](https://github.com/josevillablanca30/PreparaTupaes/commit/70f4664cdc3e174417cfd3c8aee30c923a590278) | Recuperación de sesión dañada conservando aprendizaje y recompensas. |
| [47349b0](https://github.com/josevillablanca30/PreparaTupaes/commit/47349b0a986b15a768ef8b9799fdb76f64acf6b0) | Disponibilidad de evidencia coherente entre unidades. Primera APK diaria aprobada. |
| [1566f44](https://github.com/josevillablanca30/PreparaTupaes/commit/1566f44b1a7f86d9342cf7b78ef2d73e719d5189) | Eje geométrico correcto en cuatro ítems M2 y artefacto Android identificado como versión 1.2. |

Todos se publicaron en `main`, verificando el SHA remoto y el árbol de archivos. La rama `work/cachaste-diario-2026-10-15` conserva otro punto de respaldo. No se utilizó actualización forzada ni se sobrescribió la historia anterior.
