# Cachaste 💜

Aplicación de preparación PAES Chile. **Primera meta: Matemática M1 Regular 2026 / Admisión 2027**.

## Estado actual
- 100 preguntas originales de práctica, incluidas 16 con gráficos y figuras con alternativas, explicaciones por error y resolución.
- Banco basado en habilidades de la biblioteca educativa de Drive y el temario oficial; no reproduce preguntas de pago sin permiso.
- Diagnóstico, práctica rápida, práctica por eje, práctica visual, refuerzo y Ensayo Express de 10 preguntas.
- Tutor con pistas progresivas: aciertos con ayuda se distinguen del dominio sin pistas.
- Simulacro **formativo** de 65 preguntas, tiempo de 140 minutos, mapa navegable, marcadores y confirmación al entregar.
- Guardado local de respuestas, reanudación de sesión y resultados por eje.
- Lista persistente de errores pendientes: rondas de diez preguntas sin perder las restantes; dominio confirmado al acertar sin pistas.
- Progreso móvil resumido por los cuatro ejes, con detalles de habilidades plegables y acciones para reforzar.
- Etiquetas pedagógicas estimadas: 45 iniciales, 40 intermedias y 15 desafíos.
- Marca e icono Android: **Cachaste**. Versión de código Android **0.5.0**, pendiente de compilación comprobada.
- **No es aún una versión comercial aprobada**, ni sus aciertos equivalen a una conversión oficial de puntaje.
- Se probaron 35 casos de lógica en una ejecución JavaScript aislada y se cotejaron 100 respuestas con la clave editorial. Quedan pendientes QA visual móvil, ejecución confirmada de CI y compilación de un APK descargable.

Consulta [estabilización de progreso y repaso](docs/qa-m1-estabilidad-2026-10-13.md), [pasada grande de gráficos y tutor](docs/qa-m1-expansion-100-2026-10-13.md), [reporte de QA anterior](docs/qa-m1-pasada-calidad-2026-10-13.md) y [biblioteca y fuentes de Drive](docs/fuentes-drive-m1-2026.md).

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

Los reportes y capturas de las pruebas quedan en el run de Actions con retención de un día. La emulación móvil verifica interfaz y funcionalidad; no equivale a una prueba en un teléfono físico.

## Alcance y advertencias
Esta es una **versión formativa funcional en desarrollo**, no un producto comercial terminado. Las preguntas son originales de práctica y no son ensayos DEMRE ni representan una simulación oficial validada. El tutor actual usa explicaciones y pistas redactadas previamente, no un modelo de IA generativo. No hay cuentas, backend, sincronización entre dispositivos ni estimador validado de puntaje.

La biblioteca PAES descomprimida de Drive se ha podido consultar por archivos individuales. Aún falta completar su clasificación editorial y verificar derechos de uso para cualquier reproducción de material de terceros.

## Siguiente desarrollo
1. Ejecutar las pruebas completas Node y Playwright sobre el último commit, corregir cualquier regresión móvil.
2. Validar matemáticamente los nuevos problemas visuales y sus distracciones con otra revisión pedagógica.
3. Agregar más ítems de interpretación compleja, no únicamente cálculos directos.
4. Estabilizar la compilación Android y verificar un APK descargable antes de presentarlo como listo.

