# ¿Cachaste? — cierre Android, Básica y Premium

Actualizado el 20 de noviembre de 2026 (Chile). Esta revisión reemplaza los bloqueos de firma y autorización registrados anteriormente.

## Control de cambios

Base del PR #22: `51ebeb7d4104b25c9c9ebe7e96ab116ff4cfdc8f`, conservada sin fusionar. Trabajo en `work/cachaste-cierre-android-20261120`, [PR #23](https://github.com/josevillablanca30/PreparaTupaes/pull/23), dependiente del #22. No se cambia la rama de producción. La referencia educativa Android es `8b6ab59`; la versión aceptada 47 se identifica con el origen `13ae26d3f752ccc6f3de97086dee07cb938ac3fc`.

## Funcionalidad integrada

Se conserva el motor original, catálogo, tutor, lecciones, navegación, arte y foto de perfil. `learning/original-engine.mjs` añade permisos y confirmación de actividad; no crea otro cuestionario.

| Función | Básica | Premium |
| --- | --- | --- |
| Etapas de lección | 3 por asignatura y día chileno | Sin cuota gratuita |
| Diagnóstico | 1 por asignatura, de por vida | Acceso original |
| Express | 1 diario, asignatura seleccionada | Acceso original |
| Duelos 2.0 | 2 diarios, al activarse la partida | Sin cuota gratuita |
| Ensayo completo | Bloqueado, incluidas rutas antiguas | Acceso original |
| Progreso, tutor y rankings | Motores y reglas existentes | Motores y reglas existentes |

Cuotas atómicas con bloqueo transaccional por usuario, `America/Santiago`, reservas recuperables y finalización idempotente. Cola o lanzamiento técnico sin respuestas no consumen permanentemente. Las respuestas nuevas se corrigen con el catálogo privado canónico. Cambiar preferencias locales no concede cupos ni derechos.

El acceso consulta `cachaste.access_state()` sin reemplazarlo. Se conservan las suscripciones web, prueba, cancelaciones con periodo vigente, concesiones especiales y testers. Android vuelve a verificar al iniciar actividades y recuperar primer plano. Premium offline depende del permiso nativo previamente verificado, usuario coincidente y reloj monotónico; una preferencia JavaScript no concede acceso.

Android archiva los datos anteriores del origen `file:` sin borrarlos. El primer usuario autenticado del dispositivo recibe el historial local; otros usuarios no lo heredan. El historial offline se combina para presentación con los resultados confirmados, sin convertirlo en consumo de cuota, resultados competitivos ni actividad verificada. Las actividades nuevas y su recuperación entre dispositivos pertenecen al servidor. No se atribuye verificación remota retroactiva a los antiguos datos offline.

## Supabase: instalación autorizada completada

Proyecto `jmobinmdwrmdqrxtcruj`. Migración registrada `20261120174006_cachaste_basic_original_education_install`. Se aplicaron juntos los SQL educativos preparados desde `20261116193000` hasta `20261120115046`, sin reaplicar migraciones históricas comerciales. El manifiesto [reports/cachaste-original-install-20261120.json](../reports/cachaste-original-install-20261120.json) enumera archivos y hashes. **No volver a ejecutar esos archivos individuales sobre este proyecto:** su instalación está registrada por la migración conjunta.

Antes de aplicar se guardaron privadamente las cuatro funciones existentes afectadas y los datos educativos relevantes. Recuperación no destructiva: `web/supabase/rollback-original-install.sql` apaga las banderas y restaura las funciones anteriores, sin borrar usuarios, progreso ni tablas nuevas. El respaldo de datos es un punto de recuperación; no debe restaurarse automáticamente sobre avances posteriores de estudiantes.

Se derivaron 802 registros de verificación (755 elegibles para ensayos) del catálogo aprobado. No se editó el banco PAES. Las seis tablas privadas nuevas tienen RLS y no permiten SELECT directo a `anon`/`authenticated`.

Las cuatro banderas continúan en `false`: `original_learning_enabled`, `duel_admission_enabled`, `progress_snapshot_enabled` y `learning_attempts_enabled`. **Instalar no equivale a activar públicamente Básica.** Tampoco se habilitaron las banderas web ni el checkout.

Prueba real alojada en `web/supabase/verify-original-install.sql`: crea un usuario/sesión efímeros y habilita Básica únicamente dentro de una transacción que termina con ROLLBACK. Aprobó tres etapas, bloqueo de la cuarta, respuestas repetidas, finalización repetida, recuperación y persistencia de progreso; también prioridad de beneficio especial/Premium y actualización tras revocarlo. Después se comprobó ausencia de usuarios/actividades de QA y todas las banderas apagadas. Las huellas de suscripciones, concesiones de testers y documentos previos son idénticas a las anteriores.

## Firma: flujo original recuperado

El AAB aceptado `Cachaste-1.5.0-rc20-47.aab` tiene SHA-256 de archivo `2d8343aaec8320e85a7a8b13860b1586861ab085c0e2f60631caedb594842894`. Se leyeron y verificaron las firmas de sus 265 entradas de contenido con `VerifyPlayBundle.java`; su certificado coincide con el oficial:

`A5:66:92:6F:01:E7:9E:5F:75:42:2B:5C:03:C9:1B:43:37:01:8E:4F:79:87:B3:28:88:C6:50:CA:7F:27:15:75`.

El historial `publication/firma-actions.md` de la revisión `685e9ecc` documenta que el titular creó la clave en su Android y configuró cuatro secretos de Actions. El respaldo antiguo `77:97:13:CA` corresponde a otra clave y no se utiliza.

El workflow recuperado `.github/workflows/android-play-final.yml` usa exclusivamente los secretos existentes `CACHASTE_RELEASE_KEYSTORE_BASE64`, `CACHASTE_RELEASE_STORE_PASSWORD`, `CACHASTE_RELEASE_KEY_ALIAS`, `CACHASTE_RELEASE_KEY_PASSWORD`. La clave solo se decodifica en el runner temporal, se coteja antes de compilar, nunca se conserva en artefactos/caché y se elimina incluso tras fallo. No se recuperan sus valores desde GitHub ni se genera una clave nueva.

`VerifyPlayBundle.java` verifica todas las entradas firmadas y rechaza firmas distintas/debug, entradas sin firma, duplicados y archivos privados/de QA. Bundletool oficial 1.18.2 se comprueba mediante SHA-256 fijo; valida el bundle y extrae el manifest real. `verify-play-manifest.py` exige `cl.preparatupaes.app`, código 48, `1.5.0-rc21`, target 36, sin debuggable/testOnly.

## Pruebas y entrega

- Código educativo verificado: `94be8f2aea800af8dab703d2f0fa8ecd3c0cc8f9`, [CI 44790766013](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/44790766013). Aprobaron 28 pruebas de motor/base/regresión, 63 de acceso/sincronización/cuotas, PostgreSQL 17 con cuatro conexiones autenticadas simultáneas, cuatro pruebas del navegador original y once pruebas instaladas Android API 35.
- Actualización instalada 47 → 48 aprobada: se completa una etapa real sobre el motor de la interfaz 47, se comprueba tras cerrar/reabrir el proceso, se instala 48 con `adb install -r` sin desinstalar ni borrar datos y se verifica conservación exacta y recreación. Tres fases instrumentadas aprobadas. Emulador con firma debug, sin alterar la clave de publicación.
- Regresión web completa aprobada: 52 pruebas de navegador (18 públicas, 12 educativas/sincronización, 15 registro/recuperación y 7 rankings/duelos/accesos), además de 25 comprobaciones de cuotas y 54 salvaguardas web.
- Supabase alojado: tres etapas y bloqueo de la cuarta, recuperación, reintentos, persistencia, prioridad de beneficio especial/Premium sin consumo gratuito y revocación. Transacción revertida, sin residuos ni activación pública.
- AAB final: [ejecución 44791947034](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/44791947034), tres trabajos aprobados. Origen `c1b6e74fea0638a423c91e6b2586c5e0a4c60d1d`; respecto del código verificado solo difiere el workflow. El guard comprueba esa equivalencia y los resultados previos antes de firmar. No se omitieron pruebas de código modificado.
- `Cachaste-1.5.0-rc21-48.aab`: 12.079.819 bytes, código **48**, versión **1.5.0-rc21**, target SDK **36**, release sin debug/testOnly. Las 179 entradas de contenido están firmadas con el certificado oficial. Lint release, bundletool, manifest y verificación de firmas aprobaron. El archivo descargado se volvió a comprobar localmente.
- SHA-256 del AAB: `ca9a18f28a8ab573dc2b1799ca7ebd99e274ba4d299cae75ce7b2e255f527a27`.
- [Descargar artefacto GitHub Actions](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/44791947034/artifacts/14656093989): ZIP con AAB, certificado público, manifest, verificaciones y huellas. Caduca el 20 de diciembre de 2026. No contiene claves privadas.

La ejecución autorizada del AAB conserva únicamente el archivo firmado, certificado público, manifest, verificación de cada entrada, commit de origen y SHA-256 como artefacto Actions durante 30 días. No tiene integración para subir a Play Console.

## Políticas y activación pendiente

Fuentes oficiales consultadas el 20 de noviembre:

- [FAQ de pagos de Google Play](https://support.google.com/googleplay/android-developer/answer/10281818?hl=en): cualquier categoría puede ofrecer consumo de acceso adquirido fuera de la app; permite información de compra como texto sin enlaces. No se presupuso una exclusión por ser educación interactiva.
- [Política de pagos](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en).
- [Facturación alternativa](https://support.google.com/googleplay/android-developer/answer/13821247?hl=en): Chile no aparece entre los mercados consultados.

Android no incluye checkout, enlace de contratación, WebView de pago ni puente Billing. La web conserva los precios $2.490/$7.990/$64.990 y el flujo de prueba aprobado. Esta comprobación documental no equivale a aprobación de Google Play.

Google nativo está preparado con PKCE y callback `cl.preparatupaes.app://auth/callback`, apagado por defecto. Correo/contraseña y derechos usan la misma cuenta Supabase de la web. No anunciar Google como habilitado/probado: requiere autorizar su callback y probar el retorno instalado si se decide activarlo.

El mayor código observado en Play Console es 47; el proyecto y la comprobación del bundle exigen 48. No se accede a Console para subir, solicitar producción o publicar. El titular conserva esas acciones.

**Antes de distribuir públicamente debe autorizarse la activación de Básica.** Mientras las banderas sigan apagadas, un usuario sin Premium no obtendrá actividades gratuitas, aunque las funciones estén instaladas y probadas. Ese estado es intencional por la instrucción del titular; no debe confundirse con un lanzamiento ya habilitado.
