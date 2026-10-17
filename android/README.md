# Prueba Android nativa — v0.3

La versión Android contiene la aplicación web local dentro de una WebView. Funciona sin internet, no exige permisos peligrosos y guarda el progreso localmente en el dispositivo.

GitHub Actions compila `app-debug.apk` en cada cambio relevante y verifica que Android también genere `app-release.aab`. Desde la pestaña **Actions**, abre **Android APK · compilación de prueba**, selecciona una ejecución verde y descarga **PreparaTuPAES-Android-v0.3-debug** en la sección Artifacts. Descomprime el ZIP y abre `app-debug.apk` desde Android. El flujo adjunta además un AAB identificado como `UNSIGNED-NOT-FOR-PLAY`: solo comprueba que el empaquetado release se genera; no tiene la firma de subida, no se puede publicar y no reemplaza la compilación final.

**Aviso:** Android puede advertir que el APK no viene de Play Store y requerir autorizar la instalación desde ese origen. Instálalo únicamente si reconoces el repositorio y la compilación. No contiene contenido PAES oficial; son preguntas originales de demostración.

Para instalar actualizaciones, descarga una nueva compilación. El progreso se almacena localmente y no se sincroniza entre equipos.
