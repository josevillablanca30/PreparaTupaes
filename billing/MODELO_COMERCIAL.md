# Modelo comercial definitivo — ¿Cachaste?

La app no tiene un nivel Premium: **todo el contenido requiere suscripción**, con una prueba introductoria de siete días para personas elegibles.

## Precios de Chile
- Semanal: $2.490 CLP por semana, renovación automática.
- Mensual: $7.990 CLP por mes, renovación automática.
- Anual: $64.990 CLP por año, renovación automática.
- **Oferta principal:** 7 días sin costo en la suscripción **mensual**; si no se cancela antes del término de la prueba, comienza el cobro de $7.990 CLP por mes. Las tiendas determinan la fecha exacta de cobro y deben mostrarla.

La prueba no crea un período semanal de pago ni cambia silenciosamente de un plan semanal a uno mensual. Es una oferta introductoria ligada al plan mensual. El semanal pagado se mantiene disponible como alternativa independiente; el anual también.

## Texto recomendado en la pantalla de inicio de prueba
**Prueba ¿Cachaste? gratis durante 7 días**

Estudia todas las materias, practica sin límite y aprende con nuestro gatito sabio.

**Hoy: $0. Luego: $7.990 al mes**, con renovación automática. Tu primer cobro será el **[fecha mostrada por la tienda]**, salvo que canceles antes. Puedes cancelar en cualquier momento desde las suscripciones de Google Play o App Store. La prueba gratuita está sujeta a elegibilidad.

**Botón:** «Iniciar mis 7 días gratis»

En la misma pantalla: «Ver plan semanal $2.490», «Ver plan anual $64.990», «Restaurar compras», «Términos» y «Privacidad». Los importes y detalles efectivos provienen siempre de la tienda, no de textos fijos que puedan quedar desactualizados.

## Contratos de producto y seguridad
- No llamar Premium al acceso ni prometer un plan gratuito ilimitado.
- El catálogo y los textos por sí solos no efectúan compras. La app debe consultar oferta y elegibilidad en Google Play Billing o StoreKit 2 y gestionar compras reales mediante las tiendas.
- La pantalla de prueba debe mostrar de manera destacada **7 días**, **$7.990/mes después**, **renovación automática**, **fecha del primer cargo**, **cancelación** y confirmación explícita antes de entrar al flujo de pago.
- Evitar presentar la cancelación como difícil u ocultarla. El negocio debe convertir porque la aplicación funciona y enseña bien, no porque se omitan condiciones.
- Aviso de cortesía cercano al fin de la prueba: solo para personas que acepten notificaciones, con estado de suscripción verificado. No prometer un aviso automático antes del cobro sin implementarlo.
- Permitir ingreso a la pantalla de restauración de compras y gestión de suscripciones aunque la persona no tenga una suscripción activa.
- Probar suscripción nueva, siete días de prueba, cancelación durante prueba, renovación mensual, restaurar, cambiar a anual/semanal, cambio de dispositivo, reembolso y expiración. No activar derechos de acceso por una bandera del frontend.

## Configuración en tiendas
- **Google Play Console:** crear suscripción y planes base semanal/mensual/anual; añadir una oferta de prueba gratuita de 7 días al plan base mensual, con criterios de elegibilidad, prueba y validación de tokens.
- **App Store Connect:** crear un grupo de suscripciones con las tres duraciones y una oferta introductoria de 1 semana gratis en el producto mensual; activar validación de transacciones en servidor.
- La configuración en GitHub no crea productos en las tiendas ni integra por sí sola las SDKs. El AAB actual no es una versión de venta con suscripciones integradas.

Fuentes oficiales de cumplimiento:
- https://support.google.com/googleplay/android-developer/answer/16543315?hl=es
- https://developer.android.com/google/play/billing/subscriptions
- https://developer.apple.com/app-store/subscriptions/
- https://developer.apple.com/help/app-store-connect/manage-subscriptions/set-up-introductory-offers-for-auto-renewable-subscriptions
