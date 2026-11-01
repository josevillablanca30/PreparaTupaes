# ¿Cachaste? · candidata 1.5.0-rc10 / código 37

Base: `945751875b5b751b2e8d86be2fc468d71bf3f58f`, rama Android existente. Esta actualización responde al público adolescente y adulto y a la misma promesa central: aprendizaje autónomo desde las bases, tutor paso a paso, práctica, ensayos y competencia por asignatura.

## Cambios

- Portada con logo oficial compacto, proporciones conservadas y acceso al perfil. El maestro sigue presente, con su identidad aprobada y frase guía.
- Aprendizaje y competencia aparecen como dos accesos protagonistas antes de la lista de asignaturas. Las acciones abren recorridos existentes; no muestran campeonatos escolares o paneles docentes todavía inexistentes.
- Retomar la sesión utiliza el mismo motor y sus borradores; las cinco asignaturas y los cuatro modos educativos se conservan. La actividad se identifica como guardada en el dispositivo.
- Menos globos y contadores como bienvenida. Jerarquía tipográfica, tarjetas sobrias, mayor contraste y controles legibles. Se conservan los 24 gatos, las ilustraciones por materia y la paleta morada.
- Duelos con acciones en filas legibles y reglas visibles (1v1, diez preguntas, noventa segundos por pregunta).
- Liga: la posición real del estudiante aparece antes del Top 10 cuando el servidor devuelve su puesto. No se fabrica una posición para cuentas nuevas o sin participación.
- Revancha desde un resultado terminado: abre una invitación confirmable con el rival, asignatura y mención del encuentro. Usa el mismo endpoint autorizado e idempotente; no acepta por el rival ni altera resultados o estadísticas.
- Resultado: conserva revisión con el tutor y agrega acceso directo a la liga de la misma asignatura. El contenido educativo, la puntuación y las políticas del backend no se modifican.

## Verificación

Pendiente de completar con CI, revisión de capturas y AAB firmado del código 37. Las pruebas con respuestas controladas no equivalen a teléfonos físicos ni a dos cuentas del proyecto alojado.

El titular verificó `auth.sitecacho.cl` en Resend y mostró guardado de SMTP en Supabase. También informó la edición manual de ambas plantillas con `{{ .Token }}`. La entrega real del nuevo correo y su verificación en la app siguen pendientes de una prueba del titular; esta sesión no puede leer esa configuración privada.

## Salida prevista

Nueva candidata firmada con la clave de carga existente; distribución en la misma prueba cerrada, sin publicación en producción. Probar instalación/actualización, correo, entrada, práctica, perfil, duelo completo y ranking entre los dos teléfonos antes de invitar al resto de testers. Los cambios visuales requieren revisar el resultado renderizado, no solamente compilar.
