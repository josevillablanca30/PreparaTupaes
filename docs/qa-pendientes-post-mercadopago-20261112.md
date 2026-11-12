# Pendientes para corregir al finalizar pruebas Mercado Pago — 12/11/2026

Estado: pendientes; NO afirmar resueltos sin pruebas en producción y Android móvil.

1. **Inicio de sesión con Google:** botón "Continuar con Google" en `https://sitecacho.cl/cuenta.html` no funciona. La página publicada muestra "Acceso con Google en preparación. Aún no está habilitado." Usuario sí pudo entrar mediante correo y contraseña. Implementar OAuth y probar redirecciones, retorno de sesión y persistencia en móvil.
2. **Portada comercial móvil:** el encabezado principal de `sitecacho.cl` aparece recortado en la parte superior en Android. Corregir composición, safe areas y adaptación responsive; validar en dispositivo real.
3. **Pantalla Aprende / Compite / Supera:** eliminar el recuadro morado detrás del gatito sabio en la tarjeta del maestro, conservando el personaje original y el resto de la dirección de arte.
4. **Duelos 2.0:** la pantalla muestra "40 minutos" para 10 preguntas; reemplazar por **temporizador individual por pregunta**. M1 y M2: **120 segundos por pregunta**. Competencia Lectora, Historia y Ciencias: **90 segundos por pregunta**. Reiniciar al avanzar; definir y probar comportamiento al agotarse, sincronización entre rivales, servidor y reconexiones; eliminar referencias incorrectas a 40 minutos en UI.

Capturas aportadas por el usuario en la conversación el 12/11/2026. Estas correcciones se ejecutan **después** de las pruebas actuales de Mercado Pago. No activar cobros reales sin autorización expresa.
