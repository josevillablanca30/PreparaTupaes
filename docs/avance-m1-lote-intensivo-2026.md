# Cachaste — lote intensivo M1, PAES Regular 2026 (Admisión 2027)

## Fuente curricular
Documento oficial: https://demre.cl/publicaciones/pdf/2027-26-03-19-temario-paes-regular-m1.pdf

Biblioteca pedagógica proporcionada por el propietario:
https://drive.google.com/drive/folders/1kYf2Mh9gGOIEFdxPfDozYANdta4p8V7E

Referencias efectivamente consultadas para contrastar métodos, temas y formato:
- M30M: Resumen M30M PAES 2025, ensayo M30M n.º 2.
- CPECH: Cuaderno de ejercicios M1.
- PDV: Experiencia PAES M1 marzo 2025 y tutorías temáticas de Números, Geometría y Datos y Azar.
- DEMRE: temario oficial Regular 2026 (Admisión 2027).

**No se reproducen preguntas de los materiales de pago ni de los ensayos consultados.** Se emplean para detectar habilidades y estilos de razonamiento; el lote es de redacción original. Tener acceso al material en Drive no equivale a licencia de reproducción.

## Conteo dentro de index.html
- Catálogo anterior: 20 preguntas.
- Lote A: 18 preguntas (ID 200–217): números, racionales, porcentaje, potencias, raíces y álgebra.
- Lote B: 15 preguntas (ID 218–232): proporcionalidad, sistemas, inecuaciones, funciones lineales y cuadráticas.
- Lote C: 17 preguntas (ID 233–249): figuras, Pitágoras, cuerpos, cilindros, transformaciones y semejanza.
- Lote D: 14 preguntas (ID 250–263): gráficos, frecuencias, promedio, cuartiles y probabilidades.
- Total a fecha de elaboración: **84 preguntas originales**.

Distribución del lote nuevo por eje: Números 14; Álgebra y funciones 19; Geometría 17; Probabilidad y estadística 14.

## Integración del motor
- Ensayo Express: 10 preguntas únicas, cuotas de ejes 3/3/2/2, priorización de ítems menos vistos.
- Simulacro M1: 65 preguntas únicas, cuotas de ejes 16/19/15/15.
- Tiempo máximo de simulacro: 140 minutos; reloj visible, recuperación de sesión y cierre por tiempo vencido.
- Práctica por eje: ocho preguntas por sesión, utilizando el banco ampliado.
- Repaso adaptativo sobre el catálogo completo, más resultados segmentados por eje.
- Las explicaciones y distractores se muestran en sesiones guiadas, nunca durante el ensayo.

## QA realizado y pendiente
- Comprobación automatizada en JavaScript: 84 IDs únicos; 4 alternativas distintas por pregunta; índice de respuesta válido; pasos, ejemplos, explicaciones y eje para cada ítem.
- Comprobación ejecutada de 20 muestras de ensayos Express y de la generación, guardado, reanudación y finalización de un ensayo de 65.
- Pruebas de lógica y Playwright actualizadas en GitHub.
- **Pendiente:** ejecución confirmada de la batería Node/Playwright en CI, inspección visual de preguntas en dispositivos reales, segunda revisión humana independiente de las 84 soluciones, coherencia de dificultad y calibración estadística.
- No se debe presentar el resultado como puntaje oficial ni afirmar que esta versión tiene validación DEMRE.

## Alcance
Esta es una pasada grande funcional y de contenido, **no la liberación definitiva del APK**, que se hará después de validar contenido, interfaz y compilación.
