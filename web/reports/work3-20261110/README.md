# Work 3 — propuesta web aislada

Base revisada: `89b71fbc8f19750afaefd5fe15f068c521179a82`.
No desplegar automáticamente. Work 1 debe revisar e integrar este PR.

## Cambios

- Se elimina el fondo blanco de la portada a partir del PNG ya embebido en `assets/competition-cat-rank.svg`, sin regenerar el personaje. Se conservan exactamente los píxeles RGB y las dimensiones 408 × 278. Sólo cambia el canal alfa; se eliminan fragmentos del globo y rayos que estaban en el recorte de origen.
- La imagen original permanece intacta para sus usos actuales. El recorte de portada queda en `web/public/assets/landing-cat-rank-cutout.png` y tiene prueba de igualdad de todos sus píxeles RGB.
- La web toma los estilos de la revisión Android fijada en `web/shared/android-reference.mjs`, sin sobrescribirlos con versiones antiguas de `daily-ui.css`/`study-ui.css`. No cambia los archivos fuente del Android protegido ni el motor competitivo.
- Textos secundarios públicos desde 12 px, contraste de CTA y estados deshabilitados. No se cambia lógica de cobros, suscripciones o autenticación.
- La primera acción y la acción final llevan a Mi cuenta, conservando la comprobación de acceso existente. El botón secundario describe el recorrido de la página y no promete una demostración interactiva.

## Auditoría editorial

| Antes | Después | Motivo |
| --- | --- | --- |
| Tu gatito sabio. Paciente, cercano y chileno. | Eliminado | No explica una acción ni un beneficio. |
| Entender primero. Practicar después. / Tu preparación… un camino que avanza contigo. | Practica las cinco asignaturas de la PAES. Revisa tus errores con explicaciones paso a paso y retoma tu avance. | Explica las funciones existentes. |
| Conoce cómo prepararte → sección informativa | Entrar a mi preparación → Mi cuenta | Reduce un paso y describe el destino. |
| Mira cómo funciona → ancla informativa | Ver el recorrido → misma ancla | No hay una demo en ese destino. |
| No es una versión recortada. Es tu preparación PAES. | Tutor, ensayos y competencia. | Reemplaza una comparación sin utilidad por funciones concretas. |
| Aprender de verdad se siente distinto. | De la explicación a la práctica. | Describe el recorrido que sigue la sección. |
| Quiero comenzar mi camino | Entrar a mi preparación | Coincide con el destino de cuenta. |
| Un concepto claro cambia el siguiente paso. | Eliminado | Repite la idea de la sección sin orientar. |
| Vamos de a poco. Pero vamos entendiendo. | Elige una asignatura y comienza. | Orienta el siguiente paso. |
| FAQ con «candidata Android», «actualización futura», «se conserva intacta» | Explicación explícita de avance web entre dispositivos y avance local Android. | Aclara una limitación relevante sin detalles internos de implementación. |

Los precios, las condiciones, los planes, los accesos gratuitos y los textos que avisan que los cobros están cerrados permanecen iguales. No se introduce ninguna garantía de puntaje. Los textos académicos quedan intactos.

## Validación del PR

- La revisión `713a179d44abc73303146ef2bf034eca038617ba` aprobó 170 pruebas de lógica, 47 de auditoría visual y 156 de navegación y regresión. [Ejecución verificada](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/42940126178)
- La auditoría cubrió 320, 360, 390, 430 y 1280 px. Registró 18.601 mediciones de texto y controles con un mínimo de **5,258:1** en las pantallas verificadas. Las capturas recorren portada, cuenta, recuperación, tutor, mini prácticas y corrección en todas las materias. [Capturas y resultados](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/42940126178/artifacts/13821445714)
- La regresión se ejecutó en Chromium móvil y de escritorio. Incluyó inicio de sesión de prueba, redirecciones, recuperación, persistencia y acceso a contenido protegido. La prueba de portada verificó que el RGB del gato coincide píxel por píxel con el recurso original.
- La compilación toma `daily-ui.css`, `daily-reference.css` y `study-ui.css` desde la revisión Android `8b6ab59f8780c55ecc3dd38d800e34057e40b602`. El checkout con historial completo debe tener disponible esa revisión. La distribución verificada mantiene los 124 archivos privados cifrados.
- Work 1 recibe el PR para revisar e integrar. [PR web #9](https://github.com/josevillablanca30/PreparaTupaes/pull/9)

## Primer ciclo de navegador

Run `42936906512`: aprobaron las seis pruebas públicas (cinco anchos y la captura anterior de portada). En la parte educativa se reprodujeron los mismos tres problemas de contraste de Android, ya corregidos en la revisión fijada posterior. La revisión final completó las pruebas que en ese ciclo no se alcanzaron a ejecutar. Los 170 controles de lógica web aprobaron, incluida la comparación de todos los píxeles RGB del personaje.

La rama base se volvió a inspeccionar: `35ac82e94646d16ee552b27cf343b4aada7be318` incorpora informes de lanzamiento de Work 1. Son cambios ajenos al PR y se conservan.
