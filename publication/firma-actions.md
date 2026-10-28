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

## Verificación posterior del 28 de octubre

HEAD revisado antes de continuar: `173662e00365ed0569327ceed0fb802e4ffc4a64`.

- Integración `40627579244`: éxito; 17 comprobaciones HTTP con dos cuentas independientes y 21 comprobaciones de base de datos. Los logs acreditan cuatro escenarios completos (victoria, derrota, empate y abandono), cuatro liquidaciones únicas, rankings persistentes y reconexión sin respuestas duplicadas.
- Android `40626297611`: éxito; 394 pruebas de lógica, 414 pruebas móviles generales, 30 pruebas nativas beta y 5 del acceso comercial instalado. Estas últimas no acreditan un duelo entre dos teléfonos físicos.
- Play `40626297663`: las 42 pruebas móviles de competencia/comunidad y la integración pasaron. La firma falló en la comprobación de secretos; los pasos de compilación release se omitieron.
- El nuevo preflight enumera solo los **nombres** de secretos ausentes, nunca valores. La verificación posterior del AAB usa bundletool oficial 1.18.2 con SHA-256 fijado y exige manifest real con paquete comercial, rc6/código 33/API 36, sin debuggable ni testOnly.
- Se corrigió el salto de línea literal del resumen de integración; se conserva `cancel-in-progress: false`.

### Testers sin pago: pendiente autorización comercial

No se aplicó ningún cambio de acceso. La alternativa controlada a evaluar es una lista privada de UUID Auth autorizados por el titular, con fecha de vencimiento y revocación administrativa. El cliente no podría conceder ni renovar ese permiso. Habría que integrar el permiso tanto en la RPC competitiva como en el acceso educativo nativo, manteniendo RLS y sin aceptarlo desde user_metadata. Su implementación y despliegue necesitan autorización del titular porque cambian quién puede acceder sin una compra.

### Si no se recupera la clave original

Primero comprobar en Play Console si ya existe un certificado de carga registrado. Si Play App Signing ya está configurado con la clave anterior, el titular debe solicitar el restablecimiento de la clave de carga y aportar el nuevo certificado público por el procedimiento oficial. Si nunca se registró una clave, corresponde acordar la clave inicial y custodiar su respaldo antes de usarla. No cambiar la huella esperada en CI hasta completar y verificar ese procedimiento. Referencia oficial: https://support.google.com/googleplay/android-developer/answer/9842756

## Acceso gratuito autorizado por el titular

El 28 de octubre el titular autorizó expresamente acceso sin pago para probar él mismo y los testers. Migración `20261028103117_cachaste_closed_test_access.sql`:

- Lista privada de UUID Auth, sin cuentas precargadas, con motivo administrativo, vencimiento de hasta 30 días por concesión y revocación.
- Ningún cliente ni `service_role` tiene permisos directos sobre esta lista; solo administración de base de datos.
- Se conserva la política comercial instalada en funciones privadas separadas, incluida la de la rama web alojada. Se añade el permiso de prueba tanto a competencia como al acceso educativo nativo.
- Las compras y sus verificaciones no se modifican. Un permiso de prueba no genera recibos, cargos ni suscripciones ficticias.
- La revocación afecta inmediatamente a nuevas solicitudes online. Una licencia educativa offline ya emitida conserva el límite anterior de hasta doce horas; no existe revocación instantánea sin red.
- El titular identifica los correos. Se pueden preautorizar sus hashes privados antes de crear cuentas: el permiso solo funciona con el correo verificado por Auth. También se puede conceder acceso a un UUID existente. No basta con pertenecer al grupo de Google Play, ni con un valor Premium en el teléfono.

La integración aislada completa el primer duelo y su ranking en entorno production con estos permisos gratuitos, valida que los clientes no puedan autoconcedérselos, revoca los permisos y verifica de nuevo la denegación de competencia y acceso nativo.


### Despliegue verificado del acceso gratuito

Migración aplicada al servidor alojado el 28 de octubre y alineada con la versión `20261028103117` del repositorio. Se preautorizaron únicamente los dos correos identificados por el titular, guardando sus hashes en la tabla privada y sin incluirlos en Git. Vencimiento inicial: 27 de noviembre de 2026. En la comprobación inicial aún no existían sus cuentas Auth; el permiso se activará cuando cada persona registre y confirme su correo.

Verificación remota: dos preautorizaciones, cero concesiones UUID, cero tablas del esquema competitivo sin RLS; los clientes no pueden leer ni modificar las listas y un usuario desconocido no obtiene acceso. Las funciones comerciales conservadas coinciden exactamente con los cuerpos previos de la política web alojada y el acceso educativo. El asesor de seguridad solo informa tablas privadas con RLS sin políticas, que deliberadamente deniegan acceso directo.

Pruebas locales: 396 aprobadas. La integración `40673105899` aprobó 19 comprobaciones HTTP, incluyendo el primer duelo gratuito completo y su revocación; las pruebas posteriores ejercen también la preautorización de correos verificados. No se crearon usuarios ni resultados de prueba en el proyecto alojado.
