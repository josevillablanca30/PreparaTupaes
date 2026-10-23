# Cierre comercial Android — estado y contrato seguro
Fecha: 22/10/2026. Rama: `work/cachaste-motor-duolingo-20261016`.

## Implementado en este cambio
- Pantalla informativa de suscripción con precios CLP $2.490 semanal, $7.990 mensual y $64.990 anual, y oferta principal de 7 días gratuitos seguida de $7.990 mensuales.
- Advertencias de renovación, cancelación, primer cobro y restauración. Los botones están deshabilitados; no realizan compras ni desbloquean acceso.
- Empaquetado de la pantalla en el build estático, acceso desde inicio y lista local permitida en Android WebView.

## Bloqueos obligatorios antes de producción
1. Crear cuenta de desarrollador, ficha y app en Play Console y configurar la identidad de publicación.
2. Definir **IDs oficiales** y ofertas (planes base por periodo y oferta gratuita elegible), precios efectivos, regiones y condiciones de elegibilidad. Nunca aceptar precios definidos por el cliente como fuente de cobro.
3. Implementar Google Play Billing en el cliente nativo para cargar `ProductDetails`, lanzar flujo real y consultar/restaurar compras. No permitir compra desde página web con respuesta simulada.
4. Verificar el token de compra mediante un servicio autenticado (Supabase Edge Function puede ser opción), usando Google Play Developer API **solo desde el servidor**; asociar suscripción con usuario autenticado, producto, estado y vencimiento. Gestionar renovación, cancelación, reembolso, gracia, retención y revocación; usar notificaciones RTDN y conciliación periódica. Secretos solo en entorno seguro. Evitar uso directo de service account en la app.
5. Aplicar autorización Premium **del lado confiable** a toda ruta protegida; sin estado válido no se concede acceso. Definir estrategia online/offline segura y la migración del progreso local sin pérdida de datos. La WebView actual permite acceder al contenido local, por lo que **no es una edición comercial cerrada**.
6. Probar ofertas, expiración de prueba, compra fallida, restauración, cuenta distinta, revocación, cancelación y acceso sin conexión con cuentas de prueba de Play.
7. Construir AAB firmado con clave de publicación y subir a pruebas internas, además de verificar políticas de suscripciones y seguridad de datos.

## Evidencia y límites
Esta pasada del conector GitHub escribe archivos de origen pero no ejecuta Gradle, Node, emulador ni instala APK; por tanto **no certifica capturas ni produce APK candidata**. La auditoría editorial individual de todas las asignaturas no puede declararse cerrada a partir del resumen previo; tampoco se confirma aquí la cifra de 802 preguntas. El README consultado señala 788 en su estado documentado. Los datos docentes se dejan intactos.
