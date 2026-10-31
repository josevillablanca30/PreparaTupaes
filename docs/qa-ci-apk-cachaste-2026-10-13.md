# Verificación real de Cachaste M1 v0.6 — 13 de octubre de 2026

## Resultado
**Se confirmó una compilación Android exitosa y 48/48 pruebas de Playwright aprobadas.** No corresponde afirmar que ya se probó en un equipo físico.

### Fallos reales detectados y corregidos
1. **Playwright — selector ambiguo.** Una prueba para el progreso `1 con pistas` coincidía tanto con el resumen del eje como con el detalle de habilidad. La aplicación rendía ambos correctamente; se restringió el selector a `.axis-progress` del eje Números. Commit `3ac62936db7d788d8b85dd3aa61575b31fcc33f5`.
2. **Android — SDK obsoleto.** `android-actions/setup-android@v3` intentaba instalar el paquete Android `tools`, que ya no estaba disponible. Se sustituyó por la configuración del SDK instalado en el runner y se llegó exitosamente a Gradle. Commit `3a3680d51d8e92ca6df0150210b1f08f7be8f862`.
3. **Pages — falta configuración inicial.** La validación web pasó, pero `actions/configure-pages@v5` no encontró un sitio Pages habilitado. El propietario debe escoger *Settings → Pages → Build and deployment → Source: GitHub Actions*. Esto no es un fallo del APK.

### Evidencia en GitHub Actions
- [Android APK v0.6 — ejecución 38388582242](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38388582242): **success**. Pruebas de lógica: success; construcción web: success; Playwright Android/320 px: **32/32**; preparación SDK: success; Gradle assembleDebug: success; subida de artefacto: success.
- [Pages — ejecución 38388582169](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38388582169): etapa de validación **success** con **48/48 Playwright** (Android Chrome, iPhone WebKit, móvil 320 px). Etapa de publicación **failure** solo porque Pages no está habilitado; verificación pública omitida.
- Artefacto GitHub: `Cachaste-M1-v0.6-debug`, ID 11807284036, 49.419 bytes ZIP; contiene `app-debug.apk` de 52.958 bytes.
- Archivo APK extraído y comprobado: SHA-256 `a84912c6a6e6728e005cba3e1b559afe922049306fd70b60d68d0e701fb259a7`; verificación ZIP CRC sin fallos.
- Recursos comprobados dentro del APK: `classes.dex`, `classes2.dex`, `AndroidManifest.xml`, icono vectorial y `assets/index.html`. El contenido incluye Cachaste, M1, simulacro, banco de 116 preguntas y gráficos SVG.

### Limitaciones importantes
- **Todavía no se ha instalado ni abierto el APK en un teléfono Android físico**, por lo que la estabilidad del WebView offline, el icono real, los botones Android y las actualizaciones no están confirmados.
- Este APK es **debug para pruebas**, no una publicación firmada para Google Play.
- No está habilitado el enlace GitHub Pages; es necesario activarlo manualmente.
- Los tests de navegador son emulación táctil, no reemplazan prueba de campo.
- M1 sigue siendo una herramienta de preparación independiente y no un ensayo oficial ni un predictor validado de puntaje.

### Criterios de próxima prueba real
1. Instalar el APK en un Android de prueba, confirmar que el icono muestra Cachaste y que abre sin conexión.
2. Ejecutar diagnóstico integral y un ejercicio visual con pistas.
3. Iniciar simulacro de 65, responder algunas, cerrar y reabrir; comprobar reanudación y cronómetro.
4. Finalizar un ensayo, abrir repaso de errores; cerrar y reabrir y comprobar persistencia.
5. Probar pantalla angosta y navegación atrás, y reportar cualquier bloqueo.
