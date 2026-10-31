# Validación de Cachaste Ciencias Beta v0.7.1 — 13-10-2026

## Estado validado
- GitHub Actions Android: **success**, ejecución [38393434167](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38393434167).
- GitHub Actions Pages: etapa de validación **success**, **60/60 Playwright** en Android Chrome, iPhone WebKit y móvil 320 px. Ejecución [38393434031](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38393434031).
- La publicación Pages sigue bloqueada por falta de activación de GitHub Pages desde Settings → Pages → GitHub Actions. No afecta al APK.
- Gradle `assembleDebug`: **BUILD SUCCESSFUL**.
- Artefacto de GitHub: `Cachaste-Ciencias-Beta-v0.7.1-debug`, ID **11809603750**.
- Instalador APK extraído: 80.866 bytes, SHA-256 `4ff0b8f91ce853ccea59d28679f6c3070eea22b869f7aac12a6d4ec1e369d206`.
- Comprobación ZIP CRC: **sin errores**.
- Dentro del APK están `assets/index.html`, `assets/science.html`, `assets/science-bank.js` y `assets/science-app.js`, Manifest y clases Android.
- El banco integrado contiene **63 preguntas originales**.
- APK debug: `applicationId` **cl.preparatupaes.app.sciencebeta**. Nombre visual: **Cachaste Ciencias Beta**, confirmado en recursos Android.

## Seguridad de la versión instalada antes
La firma debug de v0.6 es distinta a la utilizada para v0.7. La actualización directa puede fallar con incompatibilidad de firma y desinstalar la versión anterior puede borrar los datos locales de M1.

La beta 0.7.1 usa otro identificador y puede instalarse junto a `cl.preparatupaes.app`, **sin desinstalar** la M1 0.6 que el usuario probó. No existe sincronización entre ambas instalaciones y sus progresos no se transfieren automáticamente.

Una versión futura unificada necesita firma persistente, gestionada como secreto, para garantizar actualizaciones compatibles.

## Criterios aún pendientes
- Instalación y uso en un Android físico (WebView offline, pistas, selector de módulo, reporte de correcciones, reanudación).
- Segunda revisión humana de las 63 preguntas de Ciencias, en especial Biología con el usuario.
- Extender Ciencias a banco suficiente para ensayos reales de 80 con 54 MC y 26 por cada perfil, sin repetición engañosa.
- Materiales de Drive utilizados solo para referencia de habilidades y metodología; no reproducir contenido protegido sin permiso.
