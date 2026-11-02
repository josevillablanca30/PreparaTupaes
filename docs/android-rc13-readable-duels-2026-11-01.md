# ¿Cachaste? rc13 / 40 · legibilidad del recorrido competitivo

Continúa desde `ef0097644aac56ee7f34eec0987b86889e46871e`. La revisión posterior a la entrega de la candidata39 detectó una regresión del cambio a tema oscuro: alternativas, texto de lectura y algunas superficies de VS/tutor conservaban fondos claros mientras heredaban texto claro. Las pruebas anteriores comprobaban funcionamiento y visibilidad geométrica, pero no el contraste de esos textos. La candidata39 queda sustituida por la40; se informó al titular antes de continuar.

## Correcciones

- Alternativas normales y seleccionadas con superficie oscura y texto claro explícitos.
- Pasaje de lectura, nombres en VS, reglas, metadatos, código de invitación, resultados y feedback del tutor con contraste definido.
- Avisos de acceso y textos de ayuda de autenticación/diálogos coherentes con sus fondos oscuros.
- Las seis ilustraciones aprobadas, gestos, logo y composición se conservan. No cambia banco, respuesta correcta, autorización, puntuación, progresión, duelos ni rankings del servidor.
- VersionCode40 / versionName1.5.0-rc13. Firma de carga permanente conservada.

## Pruebas

Se amplían los recorridos existentes de VS, diez preguntas y victoria/derrota/empate con medición del contraste del texto realmente renderizado frente a su superficie opaca. Se comprueban alternativas antes y después de seleccionar, pregunta, metadatos, reglas, resultado y feedback. Nuevo caso con pasaje de lectura servido por la API controlada: texto desplegado, alternativas y selección, captura y recorrido móvil. Umbral4.5:1, sin quitar las verificaciones de seguridad, resultados ni solicitudes al servidor.

Compilación web local y sintaxis de las pruebas aprobadas; 125 archivos públicos. Actions y AAB40 pendientes de ejecutar al momento de este commit. Las comprobaciones automáticas no sustituyen correo alojado y duelo entre dos teléfonos. No se publica en producción.

Se incluye además el error de nickname duplicado, cuya caja clara podía heredar el texto claro de ayuda. La superficie de error queda oscura con texto rosa claro y se añade medición de contraste al caso existente que conserva todas las ediciones del perfil y señala el campo correcto. Se comparte el helper de contraste entre esos recorridos.

Revisión de capturas del gate de40: lectura, alternativas y resultado comprobados visualmente. Se detectó una regla antigua específica de la pantalla VS que mantenía blanca la barra inferior con etiquetas claras. Se corrige esa regla y se incluyen las etiquetas de navegación en la prueba de contraste. El helper compone fondos translúcidos y comprueba los extremos de los gradientes, en lugar de saltar las capas translúcidas hasta el body; los píxeles decorativos se revisan visualmente.

En el gate de946b434 se aprobaron119 casos y uno necesitó reintento: la comprobación antigua del gradiente evaluó un nodo que el refresco de dashboard acababa de retirar. La medición se unifica con el helper compartido; espera una muestra conectada y sigue exigiendo4.5:1 sobre los fondos compuestos. No cambia el producto, el umbral ni el caso probado. Se repite la suite para cerrar sin intermitencias.
