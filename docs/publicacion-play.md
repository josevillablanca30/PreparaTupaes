# Preparación para Google Play

Estado: beta instalable en validación. No se publica ni se crea ninguna cuenta de pago.

## Preparado en el código

- Aplicación offline sin cuentas, publicidad, analítica ni permisos de Internet/almacenamiento.
- Cinco asignaturas, marca e icono existentes, versión 1.1.0-beta / código 12.
- Compilación y target API 36; AGP 8.10.1, Gradle 8.11.1, Java 17.
- Pruebas de navegador y pruebas instrumentadas sobre APK instalada.

Google exige API 36 para aplicaciones nuevas y actualizaciones desde el 31 de agosto de 2026:
https://developer.android.com/google/play/requirements/target-sdk
Compatibilidad de herramientas:
https://developer.android.com/build/releases/agp-8-10-0-release-notes

## Pendiente antes de publicar

1. Validación docente y editorial externa, cobertura de cada objetivo curricular y textos lectores con profundidad comparable a la prueba real. Los ejercicios propios no son oficiales ni permiten convertir aciertos a puntaje PAES.
2. Prueba en teléfonos físicos de gama media, accesibilidad con tamaño de texto aumentado y comprobación de actualización desde la beta anterior.
3. Identidad legal/contacto del responsable, política de privacidad pública, ficha de seguridad de datos, público objetivo y clasificación de contenido. Actualmente los datos del estudiante se guardan solo en el dispositivo; borrar datos o desinstalar puede eliminarlos.
4. Firma de producción privada y custodiada por el propietario. La clave debug del pipeline es solo para pruebas. Una beta anterior firmada con una clave efímera podría no aceptar actualización directa; no se debe recomendar desinstalar sin tratar primero el avance del estudiante.
5. Cuenta de desarrollador y cualquier pago o publicación requieren autorización del propietario. No se han realizado.
6. Con firma configurada, generar el Android App Bundle de release y completar las pruebas internas/cerradas que correspondan a la cuenta.

## Pages

Las pruebas no se desactivan por un fallo de permisos. La conexión de esta sesión no incluye administración del repositorio. Si Pages no existe todavía, el propietario debe habilitarlo en Settings → Pages, con origen GitHub Actions; luego el workflow puede desplegar con `pages: write` e `id-token: write`. No se inventa ni se publica un enlace mientras no se verifique la revisión.

Última verificación: el workflow de main 38713890214 aprobó 144 pruebas, pero configure-pages devolvió `Not Found` el 15 de octubre de 2026. Pages sigue pendiente; no hay enlace público nuevo verificado.
