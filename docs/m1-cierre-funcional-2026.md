# Cachaste M1 — cierre funcional y pendientes de liberación

Revisión de octubre de 2026. Repositorio: `josevillablanca30/PreparaTupaes`.

## Alcance curricular y contenido

Se ha consultado la biblioteca educativa descomprimida aportada por el usuario (PDV, M30M, CPECH) como fuente de habilidades y metodologías. Las preguntas cargadas son originales, sin reproducción literal de guías de terceros.

Documento normativo: [DEMRE, Temario PAES Regular 2026 M1, admisión 2027](https://demre.cl/publicaciones/2027/2027-26-03-19-temario-paes-regular-m1). Requiere Resolver problemas, Modelar, Representar y Argumentar. Confirma 65 preguntas de cuatro alternativas, 2 h 20 min, y cuatro ejes.

**Banco actual:** 116 preguntas únicas:
- Números: 25.
- Álgebra y funciones: 32.
- Geometría: 29.
- Probabilidad y estadística: 30.

Subconjuntos relevantes: 16 problemas visuales con SVG y accesibilidad; 16 problemas originales de detección de errores y argumentación.

Niveles pedagógicos estimados: 45 iniciales, 40 intermedias y 31 de desafío. Son una clasificación editorial no calibrada psicométricamente.

## Modos del estudiante
- Diagnóstico rápido: 5 preguntas de introducción.
- **Diagnóstico integral**: 12 preguntas, tres por eje, variedad de habilidades y dificultad ascendente.
- Ensayo Express: 10 preguntas con proporción por eje.
- Simulacro formativo M1: 65 preguntas, hasta 140 minutos, selección sin duplicados y proporciones internas 16/19/15/15.
- Práctica por eje, repaso de errores pendiente por rondas, práctica visual y entrenamiento «Detectar errores y razonar».
- Pistas pedagógicas progresivas y registro transparente de respuestas asistidas.
- Persistencia local del ensayo y repaso; indicadores de progreso por eje; cronómetro y revisión previa a entregar.

Estas cuotas son decisiones del equipo y **no** una tabla de ponderación publicada por DEMRE.

## Evidencia ejecutada
- 39 casos de lógica de `tests/logic.test.mjs` más 4 comprobaciones de auditoría editorial de `tests/answer-key-audit.test.mjs`, ejecutadas en un entorno de JavaScript aislado: **43/43 correctas**.
- Segunda clave editorial de 116 respuestas, sin discrepancias detectadas.
- Auditoría estructural: cuatro opciones distintas, una marcada como correcta, explicaciones de alternativas, dos o más pasos y explicaciones alternativas presentes.
- Validación estructural de gráficos con etiquetas y descripción accesibles.
- Pruebas móviles adicionales en `tests/mobile.spec.mjs` para diagnóstico integral y argumentación.

## Publicación Android
- Configuración de aplicación y nombre: Cachaste 0.6.0.
- El workflow de `.github/workflows/android-apk.yml` instala dependencias, ejecuta lógica + auditoría, construye dist, ejecuta Playwright táctil Chromium Android y 320 px, y **solo si pasa todo** intenta compilar el APK.
- Los cambios en tests, scripts o paquete también vuelven a activar esa compilación.
- Todavía **no existe evidencia comprobada en esta conversación de un APK compilado y descargable**. No publicar enlaces a artefactos sin verificarlos.

## Lo que impide declarar M1 liberada
1. **Sin resultado verificable de una ejecución completa y exitosa de GitHub Actions/Playwright** en Chromium, WebKit/iPhone y 320 px.
2. **Sin instalación y uso real del APK en un Android físico**, incluyendo reanudación, modos gráficos, apertura offline, cierre y reapertura.
3. **Sin revisión docente independiente** de distractores, redacción de las 116 preguntas y estimación de dificultad. La clave es una comprobación de consistencia, no validez de contenido o equivalencia de puntaje.
4. Sin calibración para predecir el puntaje PAES ni acreditación DEMRE; por tanto, Cachaste debe seguir describiendo este modo como **simulacro formativo**, no ensayo oficial.

## Siguiente etapa

Cerrar fallas que informe CI, revisar capturas móviles y verificar un APK directo con instalación real. Solo después solicitar al propietario el visto bueno para dar M1 por terminada y comenzar M2, Lectora, Ciencias o Historia.

**Estado editorial:** contenido y lógica sustancialmente avanzados.
**Estado comercial / APK:** pendiente de validaciones externas y QA visual.
