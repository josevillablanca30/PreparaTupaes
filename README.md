# Cachaste 💜

Aplicación de preparación PAES Chile. **Primera meta: Matemática M1 Regular 2026 / Admisión 2027**.

## Estado actual
- 84 preguntas originales de práctica con alternativas, explicaciones por error y resolución.
- Banco basado en habilidades de la biblioteca educativa de Drive y el temario oficial; no reproduce preguntas de pago sin permiso.
- Diagnóstico, práctica rápida, práctica por eje, refuerzo y Ensayo Express de 10 preguntas.
- Simulacro **formativo** de 65 preguntas, tiempo de 140 minutos, mapa navegable, marcadores y confirmación al entregar.
- Guardado local de respuestas, reanudación de sesión y resultados por eje.
- Etiquetas pedagógicas estimadas: 45 iniciales, 24 intermedias y 15 desafíos.
- Marca visible Android: **Cachaste**.
- **No es aún una versión comercial aprobada**, ni sus aciertos equivalen a una conversión oficial de puntaje.
- Se probaron 24 casos de lógica en una ejecución JavaScript aislada y se cotejaron 84 respuestas con una segunda clave. Quedan pendientes QA visual móvil, ejecución confirmada de CI y compilación de un APK descargable.

Consulta [reporte de QA](docs/qa-m1-pasada-calidad-2026-10-13.md) y [biblioteca y fuentes de Drive](docs/fuentes-drive-m1-2026.md).

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
Esta versión subida a GitHub es una **base simplificada**, no todavía el prototipo completo preparado anteriormente. Las preguntas son originales de demostración: no son ensayos DEMRE ni representan una simulación oficial. No existe tutor IA, cuentas, backend, sincronización entre dispositivos ni estimador validado de puntaje.

El ZIP de material PAES en Drive pesa aprox. 1,86 GB y el conector no permitió descargarlo (límite 256 MB). Hace falta acceder a su contenido descomprimido, clasificarlo y verificar derechos de uso.

## Siguiente desarrollo
1. Validación real en celular y pruebas automatizadas.
2. Modularizar la aplicación e integrar el prototipo anterior.
3. Banco de preguntas y solucionarios con trazabilidad y permisos.
4. Motor de aprendizaje adaptativo y nuevas variantes verificadas.
5. Ensayos con cronómetro y resultados.

