# Prueba Android — ¿Cachaste?

La app se empaqueta dentro de una WebView y funciona sin internet. El progreso queda guardado localmente en el dispositivo; no se sincroniza entre equipos.

## APK beta

GitHub Actions compila una APK de depuración, la instala en un emulador y verifica WebView sin red, persistencia y navegación Atrás. Para descargarla, abre la ejecución Android exitosa en **Actions** y descarga el artefacto `Cachaste-v1.3.0-beta-camino-<commit>`. El APK es para revisión funcional, no es una versión firmada para distribución comercial.

Android podría advertir que el APK viene de fuera de Play Store. Instálala solo si reconoces el repositorio y la ejecución. Los artefactos de prueba se eliminan a los tres días.

## AAB de verificación

El flujo también compila `app-release.aab` y comprueba que el paquete se genere. El artefacto se llama `Cachaste-AAB-UNSIGNED-NOT-FOR-PLAY-<commit>`: está **sin firma de producción y no se puede subir a Play Store**. La firma de distribución debe quedar bajo custodia del propietario; las claves privadas no se guardan en GitHub.

## Contenido

El contenido es una combinación de preguntas originales del banco y ejercicios originales de transferencia alineados con temarios DEMRE y material de estudio del Drive. La app no es un producto oficial de DEMRE ni representa preguntas oficiales.

Para actualizar, descarga e instala un APK beta nuevo. El progreso local del APK existente no se sincroniza a otros equipos ni se transfiere automáticamente a otros canales.
