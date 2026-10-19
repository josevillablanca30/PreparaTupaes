# Protección y distribución con presupuesto mínimo

Estado al 18/10/2026: diseño preparado; repositorio fuente todavía público. `Cachaste-Public` es un nombre previsto, no un repositorio creado. La escritura mediante Work está comprobada en el repositorio público; no prueba autorización sobre repositorios privados.

## Migración propuesta y puertas de decisión

1. Respaldo completo y restauración: realizados, huella en continuidad-maestra. Antes de migrar, repetir respaldo para incluir el último commit y conservarlo fuera del repositorio.
2. Inventariar configuración de Actions, Pages, protección de ramas, colaboradores, secretos y firma con el propietario. El bundle no los restaura.
3. Comprobar selección/permisos de la integración GitHub para el futuro repositorio privado. Hacer lectura y un commit reversible en una rama de un repositorio privado autorizado; confirmar acceso desde una sesión nueva. Pendiente: no se ha usado otro repositorio ni cambiado permisos.
4. Consultar plan, minutos y almacenamiento restantes en Billing/Actions. Pendiente: el conector disponible no entregó el saldo. No garantizar que las compilaciones privadas caben en la cuota.
5. Ensayar compilación desde el respaldo, inspección de artefactos y restauración de progreso sin modificar visibilidad. Usar la misma revisión de código para web y Android.
6. Presentar evidencia y solicitar aprobación para crear el repositorio público de distribución y privatizar fuente. No fusionar main como atajo. El propietario debe aprobar también cualquier publicación comercial.
7. Después de aprobación, publicar únicamente artefactos verificados y comprobar acceso, actualización y reversión; volver a comprobar lectura/escritura de Work. Si falla, detener publicación y conservar fuente/respaldo; no borrar repositorios.

## Contrato de distribución

El repositorio público debe recibir una revisión identificable y solo artefactos de distribución: aplicación compilada, recursos visuales originales requeridos, versión, hashes, licencias/avisos y política pública aprobada. Excluir `.git`, `.github`, tests, informes internos, fuentes pedagógicas documentales de Drive, mapas de fuente, credenciales, claves de firma y configuraciones locales. Nunca copiar recursivamente el checkout.

El build actual selecciona archivos de aplicación, pero `dist` no se limpia automáticamente: antes de empaquetar se requiere directorio nuevo o limpieza controlada de ese directorio y una comprobación de lista permitida. Falta automatizar ese control para una distribución candidata. El artefacto Android de CI es de prueba, no una entrega comercial firmada.

La aplicación web distribuye JavaScript y su catálogo; la APK empaqueta recursos inspeccionables. Un repositorio privado oculta historial y herramientas internas, pero no evita extracción de contenidos ni ingeniería inversa. No enviar secretos en cliente. Privatizar tampoco retira clones o bifurcaciones ya existentes.

## Acciones y consumo

Workflows revisados: Pages y Android APK. Ambos usan Ubuntu estándar, concurrencia con cancelación, permisos por trabajo y filtros por archivos. Pages conserva reportes un día; Android conserva algunos artefactos 14 días. No se cambiaron retenciones históricas ni eliminaron artefactos.

El cambio de este bloque elimina la doble ejecución de Pages por push+PR en la rama motor. Mantiene el PR completo y Android; no reduce las pruebas. Los cambios exclusivamente en README/docs/reports no disparan Pages; el filtro de Android ya los excluye. Si un commit contiene código, agruparlo con sus pruebas y documentación.

La documentación oficial distingue ejecución pública gratuita con runners estándar y cuotas privadas según el plan. GitHub Free incluye 2.000 minutos mensuales y 500 MB de almacenamiento de Actions compartido con Packages; el consumo real y el plan de esta cuenta **no están verificados**. Estimar ejecuciones mensuales usando duraciones observadas y margen para reintentos; decidir después si usar CI privado completo, validación local más CI de hitos o un runner propio ya disponible. Un runner propio requiere mantenimiento y no se considera costo cero por defecto.

GitHub Pages gratuito está asociado a repositorios públicos; mantener fuente privada y salida pública separada es una opción a validar. No contratar un plan para resolver Pages automáticamente.

Fuentes oficiales consultadas el 18/10/2026:
- https://docs.github.com/en/billing/concepts/product-billing/github-actions
- https://docs.github.com/en/pages/getting-started-with-github-pages

## Aprobaciones pendientes

Cambio de visibilidad, creación y publicación de distribución, firma/Play comercial y cualquier gasto. El desarrollo, pruebas y guardado de esta rama están autorizados y continúan sin nuevas solicitudes.

## Medición observada (no saldo de facturación)

Los jobs exitosos de `69ad25a` ocuparon 10 min 53 s en Pages y 6 min 11 s en Android. Es una muestra de duración de ejecución, no minutos facturados ni proyección garantizada. El endpoint de artefactos informó 242 entradas; las primeras 100 sumaron 592.655.066 bytes. Ese subtotal paginado no indica almacenamiento activo facturable ni permite calcular cupo restante; no se eliminaron archivos. Debe verificarse saldo real y retención antes de migrar a privado.
