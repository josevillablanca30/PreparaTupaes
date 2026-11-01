# ¿Cachaste? · corrección de feedback real · rc11 / 38

Base remota: `72e7cca000f1a0b2dfc57c33c78bd73acf5f523d`, rama Android existente. La candidata 37 recibió feedback negativo del titular: estética plana, poco carácter competitivo, avatares masculinos poco diferenciados y recuperación que parecía exigir los campos del acceso. Esta entrega responde a ese recorrido observado, sin considerar el resultado final hasta comprobarlo con el titular.

## Cambios implementados

- Recuperación y confirmación se abren desde botones ajenos al formulario de login. Cada una tiene un formulario independiente con un solo correo. Abrirlas con email y contraseña vacíos no dispara validaciones del login. La recuperación continúa con OTP y contraseña nueva; cambiar el correo vuelve al formulario independiente. Nunca se solicita la contraseña anterior. Se conserva validación del correo y del código, sin desactivar validaciones del navegador.
- Inicio: escena con volumen, contraste y color; accesos a aprender y competir conservados. Maestro interactivo: cambio de pose por materia, consejos al tocarlo y gesto breve. Duelo: acceso protagonista a una invitación real, con las mismas reglas y autorización. El maestro reacciona al toque y acompaña cada asignatura.
- Animaciones de entrada y gesto acotadas, respetando `prefers-reduced-motion`; no modifican relojes, respuestas, estadísticas ni puntuación. No hay contrincantes ficticios ni posiciones inventadas.
- Rankings vacíos: podio decorativo sin nombres ni resultados falsos y acción al recorrido real correspondiente (evaluación, entrenamiento o duelo). “Resultados simulados” se cambia por “Aciertos del ensayo semanal” para evitar confundir el ensayo con datos ficticios.
- Avatares: doce retratos masculinos nuevos, doce femeninos conservados. Nombres completos, filtros Gatitos/Gatitas y estilos. Se mantienen los IDs 0–23 y la selección guardada, sin migrar perfiles ni aumentar el rango permitido por el servidor.
- Contenido, tutor, progreso, reglas y backend competitivo conservados. Nueva versión 38 / 1.5.0-rc11, mismo certificado de carga.

## Arte y trazabilidad

Activo: `assets/competition-avatars-male-v3.webp`, atlas raster 1448×1086, cuatro columnas y tres filas, celdas de 362 px. Generado mediante imagegen a partir de la referencia estilística del avatar rapero existente y convertido a WebP con calidad 88 para distribución; se consume como un único atlas, sin duplicar doce copias en el bundle. Las ilustraciones del maestro siguen siendo los activos oficiales existentes.

Prompt de producción: un atlas de doce retratos de gatos antropomórficos masculinos, adolescentes/adultos, rostros diferenciados, hocicos más anchos y cejas expresivas, sin maquillaje ni largas pestañas; ilustración pulida, aro morado y encuadre circular uniforme; cuadrícula exacta 4×3, sin rótulos ni números. Orden: rapero, otaku, deportista, artista / punk, DJ, astronauta, hippie / mago, disco, detective, bailarín. Pelajes, razas y caras variados. Referencia solo para estilo, sin copiar el rostro anterior.

Correspondencia del atlas con IDs persistidos: `0, 2, 4, 6, 7, 10, 12, 14, 16, 18, 20, 22`. Los otros doce IDs conservan los retratos femeninos. La interfaz hace explícitas ambas selecciones.

## Verificación

- Local: 411 pruebas de lógica aprobadas, compilación web aprobada, escáner de secretos aprobado.
- Nuevas pruebas móviles: abrir recuperación sin campos de login, correo inválido, OTP erróneo y reintento, renovación y salida de sesión, cambio de correo sin bucle, doce gatos/doce gatas con arte diferente e IDs conservados, maestro interactivo y movimiento reducido, invitación sin envío anticipado y ranking vacío con acción real.
- Prueba nativa añadida: formulario de recuperación independiente desde un login vacío en la WebView instalada. Se actualizan los casos existentes al nuevo paso explícito “Enviar código”, sin quitar sus condiciones de verificación.
- CI, revisión de capturas renderizadas y AAB firmado: pendientes de completar con evidencia.
- Correo de Resend y dos teléfonos físicos: pendientes; los fixtures y el backend efímero no equivalen a ese recorrido.

No se declara versión final, satisfacción demostrada ni “10/10”. No se publica en producción. El archivo 38 deberá probarse con ambos usuarios antes de invitar al resto de testers.
