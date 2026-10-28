# Firma permanente de carga en GitHub Actions

Workflow: `.github/workflows/android-play.yml`. Candidato: `cl.preparatupaes.app`, 1.5.0-rc6, código 33, target SDK 36.

Configurar en Settings → Secrets and variables → Actions estos **repository secrets**, nunca variables públicas:

- `CACHASTE_RELEASE_KEYSTORE_BASE64`: contenido base64 del keystore original.
- `CACHASTE_RELEASE_STORE_PASSWORD`: contraseña del almacén.
- `CACHASTE_RELEASE_KEY_ALIAS`: alias original.
- `CACHASTE_RELEASE_KEY_PASSWORD`: contraseña de la clave.

El certificado esperado está fijado en el workflow: SHA-256 `779713ca68023f881d4d8d807fcdda32182bcda3aba3c802a95cb0344838c562`. No sustituir esta huella para eludir una discrepancia. Custodiar el keystore y las contraseñas fuera de GitHub en un respaldo privado del titular: los secretos de Actions no permiten recuperar su valor después.

La clave solo se decodifica en el directorio temporal del runner, con permisos privados; se elimina incluso tras error. No se guarda en caché ni artefactos. Se comprueba el certificado antes de compilar y cada entrada del AAB después de firmar. La tarea Gradle release falla sin las cuatro variables; el workflow beta ya no genera AAB sin firma.

La ejecución entrega únicamente AAB firmado, certificado público, revisión Git y hashes. No despliega en Play Console. La huella de carga no debe confundirse con el certificado de distribución que administra Play App Signing.

## Estado comprobado el 28 de octubre de 2026

El titular informa que la aplicación y los testers ya están creados y Console está en Crear una nueva versión. Sustituye los bloqueos de creación registrados el 23 de octubre.

Se recuperó y verificó el AAB rc5/código 32: SHA-256 `644adf51eba1c9efae01e7a337f42a053b82ec17acb50e0f7d41cc7a9477832d`, 234 entradas firmadas con el certificado original. No contiene los cambios rc6 ni acredita una prueba entre dos teléfonos.

El servidor alojado devuelve `catalogueReady:true`, entorno production, cero perfiles, cero entitlements y cero duelos. Tiene una migración adicional de la rama web (20261024144927); no se revirtió ni sobrescribió. Las compras Android siguen deshabilitadas y la política de acceso sigue exigiendo una suscripción verificada. Subir un AAB no habilita por sí solo a los testers. Quedan pendientes credenciales/productos y compras de licencia reales, o una decisión explícita del titular sobre un modelo de acceso cerrado distinto. No se introdujo un bypass Premium.
