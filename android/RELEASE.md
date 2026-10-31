# Firma de publicación de ¿Cachaste?

El paquete release usa `cl.preparatupaes.app`; la beta mantiene su sufijo independiente. La clave de carga es distinta de la firma de depuración. Su respaldo privado se entrega al propietario y no se almacena en Git.

## Firmar un AAB ya verificado

Descargar el AAB de la misma ejecución Android aprobada y descomprimir el respaldo privado fuera del repositorio. Ejecutar:

```
python scripts/sign-android-release.py app-release.aab --signing-dir /ruta/privada --output Cachaste-Play.aab
```

El script comprueba la firma, compara el certificado con `upload-certificate.pem` y verifica que ninguna entrada de la aplicación cambió durante la firma. No imprime contraseñas. Requiere Java 17 con el módulo `jdk.jartool` y Python con cryptography.

## Compilar release con firma desde Gradle

Configurar en el entorno privado las cuatro variables `CACHASTE_RELEASE_KEYSTORE`, `CACHASTE_RELEASE_STORE_PASSWORD`, `CACHASTE_RELEASE_KEY_ALIAS` y `CACHASTE_RELEASE_KEY_PASSWORD`, usando los valores del respaldo. Ejecutar `gradle :app:bundleRelease` dentro de `android`. Una configuración parcial falla explícitamente: no utiliza una clave de depuración como reemplazo.

El workflow de validación conserva un AAB sin firma para comprobar el empaquetado; el propietario puede firmarlo con el script anterior. Nunca agregar credenciales a YAML, código fuente, argumentos visibles ni artefactos públicos de Actions.

## Alta en Google Play

Al crear la aplicación, habilitar Play App Signing y registrar el certificado público de carga. Google gestiona por separado la clave con que distribuye la aplicación. La firma válida de un AAB no equivale a haber completado la ficha, declaraciones, pruebas de cuenta ni revisión de Google Play. Si existe una aplicación ya registrada, cotejar su certificado de carga antes de reemplazarlo.

Referencia oficial revisada: https://developer.android.com/studio/publish/app-signing
