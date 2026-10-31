# QA de Cachaste Beta 0.9 — Diagnóstico y UX simplificada

Fecha: 13 de octubre de 2026.

## Implementación
- Un único instalador Android abre en `inicio.html` y muestra M1, Biología, Física y Química.
- La pantalla de M1 muestra tres acciones principales: Diagnóstico 30, Express 10, Simulacro formativo 65. Las prácticas especializadas pasan a un desplegable.
- Un estudiante nuevo completa el diagnóstico M1 para habilitar Express/completo. Los usuarios con historial anterior pueden mantener el acceso sin perder su progreso.
- El diagnóstico M1 tiene cuotas 8/8/7/7 en los cuatro ejes, se guarda durante la práctica, puede retomarse y produce un plan por debilidades.
- La pantalla de Ciencias también presenta tres acciones: Diagnóstico 30 obligatorio, Express 10 tras el diagnóstico y Completo 80 **deshabilitado** hasta disponer de 54 comunes y 26 del perfil sin duplicar.
- El diagnóstico Ciencias usa 27 comunes (9 por ciencia) y 3 de mención o TP. Express usa 7 comunes y 3 del perfil y prioriza áreas difíciles. Las tres ciencias aparecen intercaladas.
- Ciencias incorpora autoconfianza por pregunta: **Lo tengo claro / Tengo dudas / Fue al azar**. Se registra separadamente de los aciertos con pista.
- Tras el diagnóstico se recomiendan temas de aprendizaje en Ciencias y M1. Las herramientas de refuerzo por materia continúan disponibles en un bloque plegado.
- Se corrigieron problemas de ancho de tarjetas en móviles de 320 px.

## Evidencia real en GitHub Actions
- [Compilación Android 38402949954](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38402949954): **SUCCESS**, 52/52 pruebas Android Chrome + viewport táctil de 320 px y compilación Gradle exitosa.
- [QA multidispositivo 38402950529](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38402950529): etapa de pruebas **SUCCESS**, **78/78 Playwright** en Android Chrome, iPhone WebKit y 320 px.
- La etapa adicional de publicación web falló únicamente porque GitHub Pages no está habilitado en el repositorio. No se trata de un fallo del APK. Se requiere Settings → Pages → GitHub Actions.
- Artefacto `Cachaste-Unificado-Beta-v0.9.0-debug`, ID **11817090106**.
- Archivo `app-debug.apk` extraído del ZIP y validado: **90.442 bytes**, SHA-256 `0d4ea2e39e0303f20f55fade24326a5ae64840495210ca1c214b0846366d71d0`.
- Integridad del archivo ZIP/APK comprobada sin errores CRC, con `assets/inicio.html`, `assets/index.html`, `assets/science.html`, `assets/science-bank.js` y `assets/science-app.js`.

## Limitaciones pendientes
- Falta instalar y probar esta versión 0.9 en un teléfono Android real; las pruebas táctiles de Chrome y WebKit son emulaciones.
- Los APK de depuración generados en distintos runners pueden tener firmas incompatibles. La beta usa identificador independiente `cl.preparatupaes.app.sciencebeta`, por lo que no sustituye a la M1 0.6 original instalada. No desinstalar esa app si se desea conservar su progreso local.
- Todavía falta ampliar y revisar científicamente el banco de Ciencias para un ensayo completo de 80 sin repeticiones.
- Los resultados no son un predictor validado de puntaje PAES ni representan cuadernillos oficiales.
