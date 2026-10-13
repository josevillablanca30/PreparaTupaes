# Reporte de preparación y publicación

Fecha: 12 de octubre de 2026 (Chile).
Repositorio: josevillablanca30/PreparaTupaes.
Commit de aplicación probado: 0d01716ca3cc302c6cfc540796e474f69cacada3.
Ejecución: https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38326362593

## Resultado

La aplicación y el flujo automático quedaron preparados en main. La publicación está bloqueada por la activación inicial de GitHub Pages. No existe aún un enlace público verificado de esta versión.

## Pruebas realizadas

| Entorno | Resultado |
| --- | --- |
| Node: lógica de diagnóstico, respuestas duplicadas, guardado, datos dañados, repaso y reinicio de ronda | 6/6 aprobadas |
| Chromium con emulación Pixel 7 / Android | 8/8 aprobadas |
| WebKit con emulación iPhone 13 | 8/8 aprobadas |
| Chromium táctil a 320 × 640 px | 8/8 aprobadas |
| Construcción y empaquetado estático | Aprobados |
| Publicación GitHub Pages | Bloqueada |
| Pruebas sobre la URL pública | No ejecutadas: dependen del despliegue |

Las 24 pruebas móviles pasaron sin reintentos fallidos, en 26,4 segundos. Se ejecutaron contra el paquete construido en un servidor temporal del runner de GitHub, bajo /PreparaTupaes/; no contra producción ni teléfonos físicos.

Se verificaron carga HTTP, título, controles táctiles de al menos 44 × 44 px, ausencia de desplazamiento horizontal, diagnóstico completo, explicación de errores y sus tres formatos, práctica rápida, repaso, cálculo de resultados, persistencia tras recargar, almacenamiento bloqueado y datos dañados. Las pruebas también detectan errores JavaScript y de consola. Hay capturas del inicio y de las explicaciones en el reporte de Actions, con retención de un día.

## Cambios aplicados

- Flujo de pruebas, publicación y verificación pública automática al cambiar código en main.
- Publicación limitada a dist/, con comprobación del commit servido mediante version.json.
- Corrección del guardado bloqueado y de registros inválidos; separación del resultado de cada ronda.
- Reinicio de confianza y alternativa al comenzar; navegación vuelve al inicio de la pantalla.
- Botones táctiles, separación de acciones, adaptación a 320 px y zonas seguras de pantalla.
- Banco original de cinco preguntas conservado.

## Bloqueo comprobado

El job “Publicar en GitHub Pages” falló en actions/configure-pages con “Get Pages site failed” y “HttpError: Not Found”. Pages debe activarse en Settings → Pages → Source → GitHub Actions. El conector disponible permite modificar código, pero no expone ese ajuste. La documentación de configure-pages indica que GITHUB_TOKEN no puede realizar por sí solo la activación inicial.

Se intentó acceder a la configuración mediante el navegador. GitHub solicitó iniciar sesión y, al seleccionarse Google en el formulario seguro, la revisión automática de permisos bloqueó el acceso al origen accounts.google.com por no contar con autorización explícita para ese origen. No se continuó ni se eludió ese bloqueo.

## Continuación

Completar el acceso autorizado, activar GitHub Actions como fuente de Pages y reintentar los jobs fallidos de la ejecución indicada. El flujo volverá a verificar el commit público y repetirá las 24 pruebas móviles sobre HTTPS. Si el artefacto ya expiró, ejecutar nuevamente el flujo completo.
