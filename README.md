# Cachaste 💜

Aplicación de preparación PAES Chile. **Primera meta: Matemática M1 Regular 2026 / Admisión 2027**.

## Ciencias (nueva primera fase)
- Entrada **Ciencias** integrada en el inicio de Cachaste, sin sustituir Matemática M1.
- **63 preguntas originales iniciales**: 45 de Módulo Común (15 por asignatura), 12 de profundización Electiva (4 por especialidad) y 6 para refuerzo TP (2 por asignatura).
- Tutor con pistas y explicaciones por alternativa, prácticas por Biología/Física/Química, diagnóstico mixto, selección de módulo, repaso de errores y progreso independiente.
- Las observaciones científicas se pueden guardar y copiar desde el teléfono para corregir el banco posteriormente, sin cambiar automáticamente claves.
- **Todavía no hay simulacro completo de Ciencias de 80 preguntas ni equivalencia a puntaje oficial**. Se requiere extender banco y revisar los módulos a fondo.
- Recursos locales `inicio.html`, `index.html`, `science.html`, `science-bank.js`, `science-app.js` en el mismo APK; el inicio permite probar el UX de selección de asignaturas.
- **Beta Android unificada v0.8.0:** **un solo instalador** abre directamente en `inicio.html`, con selección visual de Matemática M1, Biología, Química o Física; todas se abren dentro de la misma aplicación y se regresa al selector desde sus encabezados. M1 y Ciencias registran avances independientes, mostrados en el dashboard.
- Para proteger la M1 v0.6 que ya está en el teléfono, esta beta de pruebas todavía usa el identificador Android independiente `cl.preparatupaes.app.sciencebeta` y se llama **Cachaste Beta**. La firma de depuración cambia entre runners, por lo que no es una actualización fiable de otra beta anterior con el mismo identificador; **no desinstales tu Cachaste M1 v0.6**. No hay sincronización automática entre apps Android distintas.
- Para una actualización estable de una sola aplicación será necesario configurar una firma Android persistente gestionada de forma segura.
- [Informe y fuentes de la primera fase de Ciencias](docs/ciencias-primera-fase-2026.md).

## Estado actual
- 116 preguntas originales de práctica, incluidas 16 con gráficos y figuras con alternativas, explicaciones por error y resolución.
- Banco basado en habilidades de la biblioteca educativa de Drive y el temario oficial; no reproduce preguntas de pago sin permiso.
- Diagnóstico corto (5) e integral (12 preguntas), práctica por eje, práctica visual, refuerzo, 16 ejercicios para Argumentar y Ensayo Express (10).
- Tutor con pistas progresivas: aciertos con ayuda se distinguen del dominio sin pistas.
- Simulacro **formativo** de 65 preguntas, tiempo de 140 minutos, mapa navegable, marcadores y confirmación al entregar.
- Guardado local de respuestas, reanudación de sesión y resultados por eje.
- Lista persistente de errores pendientes: rondas de diez preguntas sin perder las restantes; dominio confirmado al acertar sin pistas.
- Progreso móvil resumido por los cuatro ejes, con detalles de habilidades plegables y acciones para reforzar.
- Etiquetas pedagógicas estimadas: 45 iniciales, 40 intermedias y 31 desafíos.
- Marca e icono Android: **Cachaste**. Versión **0.6.0** compilada exitosamente como APK de prueba (debug).
- **No es aún una versión comercial aprobada**, ni sus aciertos equivalen a una conversión oficial de puntaje.
- El 13-10-2026 GitHub Actions confirmó **48/48 pruebas de navegador móvil aprobadas** en Android Chrome, iPhone WebKit y 320 px; el workflow de Android confirmó pruebas de lógica, 32/32 pruebas táctiles y compilación exitosa de APK de prueba. El APK se verificó como ZIP/APK íntegro con código y recursos incluidos. **Pendientes: instalación y pruebas en un teléfono físico y publicación web por Pages.**

Consulta [resultado de CI y APK v0.6](docs/qa-ci-apk-cachaste-2026-10-13.md), [cierre de M1 y controles QA](docs/m1-cierre-funcional-2026.md), [estabilización de progreso y repaso](docs/qa-m1-estabilidad-2026-10-13.md), [pasada grande de gráficos y tutor](docs/qa-m1-expansion-100-2026-10-13.md), [reporte de QA anterior](docs/qa-m1-pasada-calidad-2026-10-13.md) y [biblioteca y fuentes de Drive](docs/fuentes-drive-m1-2026.md).

## Probar
Abrir `index.html` con el navegador, o ejecutar:

```bash
npm ci
npm run test:logic
npm run build
npx playwright install --with-deps chromium webkit
npm test
```

La aplicación no necesita dependencias en el navegador. Node y Playwright se utilizan únicamente para construir el paquete y probarlo.

## Publicación automática

El flujo `.github/workflows/pages.yml` se ejecuta al cambiar código en `main`, en pull requests y manualmente desde Actions. Los cambios solo de documentación no generan otro despliegue.

1. Ejecuta las pruebas de lógica y clave editorial, además de las pruebas táctiles en Chromium Android, WebKit iPhone y pantalla de 320 px.
2. Si pasan, publica únicamente `dist/` en GitHub Pages. Las pull requests solo validan, sin publicar.
3. Comprueba que la URL pública sirve el mismo commit y repite las pruebas móviles sobre HTTPS.

Activación inicial requerida: **Settings → Pages → Source → GitHub Actions**. El flujo estándar no puede activar Pages por primera vez con `GITHUB_TOKEN`; la configuración necesita acceso del propietario. Una vez activado, cada cambio de código en `main` se publica automáticamente si supera las pruebas.

URL prevista (solo válida después de un despliegue exitoso): https://josevillablanca30.github.io/PreparaTupaes/

Los reportes y capturas de las pruebas quedan en el run de Actions con retención de un día. La emulación móvil comprueba interfaz y funcionalidad cuando CI finaliza exitosamente; no equivale a una prueba en un teléfono físico. El flujo del APK ahora exige primero Node, QA editorial y Playwright Android/320 px.

## Alcance y advertencias
Esta es una **versión formativa funcional en desarrollo**, no un producto comercial terminado. Las preguntas son originales de práctica y no son ensayos DEMRE ni representan una simulación oficial validada. El tutor actual usa explicaciones y pistas redactadas previamente, no un modelo de IA generativo. No hay cuentas, backend, sincronización entre dispositivos ni estimador validado de puntaje.

La biblioteca PAES descomprimida de Drive se ha podido consultar por archivos individuales. Aún falta completar su clasificación editorial y verificar derechos de uso para cualquier reproducción de material de terceros.

## Siguiente desarrollo
1. Ejecutar las pruebas completas Node y Playwright sobre el último commit, corregir cualquier regresión móvil.
2. Validar matemáticamente los nuevos problemas visuales y sus distracciones con otra revisión pedagógica.
3. Agregar más ítems de interpretación compleja, no únicamente cálculos directos.
4. Estabilizar la compilación Android y verificar un APK descargable antes de presentarlo como listo.

