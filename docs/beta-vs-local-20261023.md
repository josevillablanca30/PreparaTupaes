# Prueba del VS antes de publicar · rc4

La beta Android incorpora **Duelos → Probar VS local** para revisar la presentación y jugar entre dos personas pasando un mismo teléfono, sin cuenta ni pago. No crea identidades ni oponentes y no concede suscripciones.

## Recorrido

- Dos apodos escritos por quienes prueban; cinco materias y tres áreas de Ciencias.
- Diez preguntas reales elegibles de familias distintas, con el mismo conjunto y orden para ambos. Conserva los textos, gráficos, alternativas y explicaciones del banco.
- Noventa segundos por pregunta. Guarda cada respuesta y el plazo absoluto; retoma tras recargar o recrear la Activity. Un tiempo agotado espera confirmación antes de iniciar la siguiente pregunta.
- El primer turno termina en una pantalla para pasar el celular, con respuestas, soluciones y puntajes ocultos.
- Resultado por aciertos; empate resuelto por tiempo redondeado a décimas. Revisión para cada jugador con paso a paso, explicación más fácil y otro ejemplo.
- Borrar el duelo limpia solo `cachaste-beta-vs:v1`. No cambia el progreso educativo ni consulta o escribe en Auth, compras, estrellas o rankings. La página usa CSP `connect-src 'none'`.

## Separación del paquete comercial

`scripts/build-beta-vs.mjs` genera un overlay en `android/app/src/beta/assets`, ignorado por git. Gradle lo incluye únicamente en `debug` con el paquete `.sciencebeta`, excluyendo el debug comercial de instrumentación. `dist` mantiene el contrato de 95 archivos. La navegación nativa admite la página local solo en `.sciencebeta`. El AAB release se inspecciona para comprobar que no contiene la página, scripts ni acceso al VS local.

Esta prueba permite revisar la experiencia en un teléfono. No valida la comunicación entre dos dispositivos ni sustituye una prueba de cuentas, invitaciones y suscripciones reales. El VS en línea conserva su verificación del servidor.

## Validación previa al empaquetado

- 387 pruebas de lógica aprobadas, incluidas cinco del nuevo duelo local.
- 12 recorridos móviles aprobados: cinco materias y recuperación/caducidad, en Android Chrome y 320 px.
- Capturas del VS y resultado revisadas; se conserva el arte oficial.
- CI: 12 recorridos del VS local y 402 recorridos existentes aprobados.
- Android 16/API 36: 30 pruebas instaladas aprobadas, incluido el duelo local completo y la reanudación tras recrear la Activity; cinco comprobaciones comerciales adicionales, sin fallos ni omisiones.
- Firma idéntica a la beta anterior y versión/código de paquete verificados. La identidad se registra en `reports/cachaste-rc4-verification.json`.
- Se conservaron 65 capturas nativas existentes. Las tres capturas opcionales nuevas no se exportaron por un comando compuesto en el helper de instrumentación; el recorrido funcional pasó. Se corrigió ese helper reutilizando la implementación de captura ya existente, sin modificar el código de la app ni el APK entregado. El VS y resultado se revisaron visualmente en Chrome Android y 320 px con assets idénticos al APK.

Versión Android: 1.5.0-rc4, código 31, actualización del mismo paquete beta.
