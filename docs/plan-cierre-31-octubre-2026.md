# Cierre para lanzamiento de noviembre

**Meta de trabajo:** dejar una versión pública y comprobada de ¿Cachaste? antes del 31 de octubre de 2026, para que el estudiantado pueda usarla durante noviembre. La PAES Regular de Admisión 2027 se rinde el 30 de noviembre, 1 y 2 de diciembre de 2026 ([DEMRE, instrucciones PAES Regular 2026](https://demre.cl/paes/regular/inscripcion/instrucciones-generales)).

## Enfoque de salida

Cerrar primero una versión educativa estable, clara y usable en móvil. No declarar cobertura total, puntaje predictivo ni equivalencia con un ensayo oficial. Mantener las preguntas originales y usar Material PAES de Drive como fuente principal para orientar contenidos, métodos y errores frecuentes, en contraste con el temario DEMRE vigente.

## Ruta hasta el 31 de octubre

| Ventana | Entregable | Criterio de salida |
| --- | --- | --- |
| 17–19 oct | Restaurar banco M2 íntegro; resolver CI; corregir metadatos de versión, recuentos y enlaces | GitHub Actions pasa lógica, auditoría, build, móviles web y APK instalada en emulador; el APK reporta el mismo SHA que `main`. |
| 20–22 oct | Cerrar contenido prioritario y brechas M2; revisar los recorridos de las cinco materias con la matriz de preguntas | Cada materia abre diagnóstico, práctica/Express y ensayo formativo; claves y explicaciones pasan revisión matemática/editorial registrada. |
| 23–25 oct | QA visual móvil completo y accesibilidad esencial; corregir navegación, reanudación, errores y pantallas estrechas | Chromium y WebKit pasan; verificar offline, persistencia, botones atrás, foco, contraste, texto grande y movimiento reducido. |
| 26–27 oct | Piloto acotado de uso y ajustes finales | Una pasada real con estudiantes o acompañante registra fallos reproducibles, materias probadas y correcciones. No convertir opiniones de pocas personas en evidencia estadística. |
| 28–29 oct | Preparar distribución y soporte | Páginas de inicio/ayuda, política de privacidad acorde al almacenamiento local, instrucciones de instalación/uso y canal de contacto definidos. |
| 30–31 oct | Congelar versión, verificar despliegue y respaldo | Página pública responde en HTTPS; APK se instala/actualiza en teléfono; checksum, SHA, versión, QA y rollback documentados. |

## Lista de salida obligatoria

- [ ] CI verde en el SHA final: lógica, auditoría, build, Playwright Android/WebKit/320 px y pipeline de APK/emulador.
- [ ] Contenido original revisado; temarios vigentes enlazados y referencias pertinentes de Drive registradas por lote.
- [ ] Todas las materias recorren diagnóstico, práctica y ensayo formativo sin rutas muertas ni afirmaciones de puntaje oficial.
- [ ] Móvil, offline, persistencia, lector de pantalla básico y movimiento reducido verificados.
- [ ] Pages activado y sitio real confirmado; APK final con distribución acordada, instalación y actualización comprobadas.
- [ ] Privacidad, términos, soporte y descripción comercial listos. No ofrecer venta ni recopilar datos hasta que el responsable confirme esos aspectos.

## Dependencias externas que pueden bloquear la fecha

1. **Habilitar GitHub Pages una vez** en Settings → Pages → Build and deployment → GitHub Actions. Los workflows ya intentan publicar y verificar el sitio, pero la habilitación inicial requiere permisos de administración.
2. **Prueba en un teléfono Android físico** antes del congelamiento. CI usa un emulador, que no reemplaza una instalación real.
3. **Definir responsable, canal de soporte y política comercial/privacidad.** La app usa almacenamiento local y no tiene cuentas ni sincronización; publicar una política requiere aprobación del propietario.

Si alguna dependencia llega tarde, activar difusión solo cuando exista una ruta funcional de acceso y describir la versión como beta formativa, sin prometer cierre pedagógico total.
