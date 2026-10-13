# Prepara tu PAES

Primera base interactiva para preparar Matemática M1 en Chile.

## Estado
- Página responsive y cercana para estudiantes chilenos.
- Diagnóstico de cinco preguntas originales de demostración.
- Práctica rápida de tres preguntas y repaso básico.
- Corrección según la alternativa elegida; explicaciones paso a paso, fáciles y con ejemplos.
- Registro de seguridad al responder, guardado y progreso en el navegador.

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

1. Ejecuta seis pruebas de lógica y las pruebas táctiles en Chromium Android, WebKit iPhone y pantalla de 320 px.
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

