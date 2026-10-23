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
- La instrumentación `LocalVsBetaTest` jugará ambos turnos en el WebView instalado y revisará la reanudación tras recrear la Activity. Sus resultados y la identidad del APK se registran tras el build de CI.

Versión Android: 1.5.0-rc4, código 31, actualización del mismo paquete beta.
