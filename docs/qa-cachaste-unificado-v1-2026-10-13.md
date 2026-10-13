# QA · Cachaste unificado v1.0.0 · 13 de octubre de 2026

## Integración confirmada
- M1: 116 ejercicios de práctica existentes, diagnóstico 30, Express 10 y ensayo formativo de 65.
- Ciencias: 158 preguntas originales, divididas en 54 MC, 78 ME (26 por mención) y 26 TP. El ensayo de 80 selecciona 54 MC + 26 correspondientes a Biología, Física, Química o TP, sin repetición; el tiempo de trabajo es 160 minutos. No muestra respuestas antes del final.
- Competencia Lectora: 15 textos originales, 75 preguntas, habilidades Localizar/Interpretar/Evaluar, diagnóstico 30, Express 10, ensayo formativo 65 con 150 minutos y progreso persistente.
- M1, Ciencias y Competencia Lectora se abren desde el selector único y conservan datos separados en el dispositivo.
- Archivos offline del APK: `inicio.html`, `index.html`, `science.html`, `science-bank.js`, `science-app.js`, `reading.html`, `reading-bank.js`, `reading-app.js`.

## Validación automática
- [Android build run 38438839280](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38438839280): **success**; **62/62** casos de Playwright en Android Chrome y pantalla 320px; `gradle assembleDebug` finalizó correctamente.
- [Pages workflow run 38438839437](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38438839437): trabajo de tests Android Chrome, iPhone WebKit y 320px en **success**, **93/93** casos Playwright, y **75/75** pruebas de lógica. La fase de publicación Pages es independiente y sigue condicionada a la configuración de Pages en el repositorio.
- Artefacto de GitHub Actions: `Cachaste-Unificado-Beta-v1.0.0-debug` (ID `11833883959`).
- APK extraído y verificado en el entorno: **142410 bytes**, SHA-256 `68260da1198e1278b09c47a182c4eb2234739582fb006a7848f324260274b001`. ZIP y APK sin errores CRC; recursos web incluidos.

## Limitaciones expresas
- Un test móvil automatizado no sustituye la instalación y prueba real en el Android del usuario.
- Las preguntas son originales y requieren revisión humana de pertinencia curricular, exactitud científica y poder diagnóstico. Los 15 textos de Lectora son más breves que muchos textos de un ensayo oficial; ampliar corpus y longitud antes de tratarlo como experiencia PAES equivalente.
- Los simulacros son **formativos**; no afirmar que predicen puntajes PAES ni que son cuadernillos oficiales.
- La beta mantiene el identificador Android `cl.preparatupaes.app.sciencebeta`, separado de la M1 0.6 original. Firmas de depuración no garantizan actualización directa desde betas previas. Nunca recomendar desinstalar M1 sin respaldar previamente su progreso.
- No existe respaldo en la nube ni cuentas. Los datos quedan en almacenamiento local.
