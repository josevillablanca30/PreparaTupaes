# Aprendizaje diario: primera integración funcional

La experiencia de inicio ahora ofrece el gatito oficial aportado por el propietario (sin generar otra ilustración), misión de tres preguntas distintas, recorrido de las cinco asignaturas, clases progresivas, Express libre e inteligente, sesiones recuperables y recompensas locales. Los seis estados del profesor reutilizan la misma ilustración con estilos discretos; no son seis poses nuevas.

El catálogo se genera desde los cinco bancos originales durante el build: conserva 623 IDs, alternativas, claves, textos y clases. No hay un segundo banco editado manualmente. Cada nivel agrupa un objetivo conceptual, dentro de una unidad y eje. Las unidades y secuencia son una organización editorial propia, no nombres ni una secuencia oficial del DEMRE. Los 25 ítems suplementarios de Ciencias permanecen identificados como complementarios.

Fuentes curriculares primarias consultadas: los cinco temarios PAES Regular 2026 / Admisión 2027, publicados el 19 de marzo en https://demre.cl/publicaciones/pdf/2027-26-03-19-temario-paes-regular-m1.pdf , -m2.pdf, -competencia-lectora.pdf, -ciencias.pdf y -historia.pdf. Matemática conserva cuatro ejes; Lectura usa Localizar, Interpretar y Evaluar; Ciencias usa Biología, Física y Química y habilidades transversales; Historia distingue Historia, Formación ciudadana y Sistema económico. Modelación y análisis de fuentes no se presentan como nuevos ejes oficiales.

El diagnóstico y las respuestas tradicionales alimentan el perfil diario mediante su historial. Las respuestas diarias se incorporan aditivamente al historial tradicional, conservando sus borradores, evaluaciones y demás campos. El camino y Express calculan dominio con la misma función existente: dos familias distintas con respuesta segura sin pistas después del último error. Leer una tarjeta no genera dominio. Se distingue respuesta sin ayuda, con pistas, después de estudiar y error persistente.

La selección registra presentaciones (incluidas preguntas abandonadas), prioriza ítems nunca vistos y conceptos débiles, excluye las últimas diez familias y usa intervalos orientativos de uno o tres días para repaso. No es un modelo predictivo entrenado. Informa agotamiento; los objetivos con un solo ítem no pueden acreditarse artificialmente. Los tiempos de tres, cinco y diez minutos orientan la cantidad, sin imponer una cuenta regresiva.

Las recompensas se calculan por preguntas distintas cada día en fecha de Chile: 10 XP por intento, 15 por acierto, nunca penalizaciones ni vidas. No alteran dominio académico. Se muestran racha, misión y tres logros iniciales.

Validación del cierre editorial previo: 129 pruebas de lógica y 108 ejecuciones móviles del profesor de Ciencias aprobadas. Primera integración diaria: 140 pruebas de lógica aprobadas; recorridos móviles de clase, error, transferencia, persistencia, cinco asignaturas y Express, más navegación tradicional, se verifican antes del commit. Pendiente validación Android de esta nueva integración y prueba con estudiantes. La secuencia de prerrequisitos de cada unidad requiere una segunda curaduría; los niveles son accesibles y recomendados, sin bloqueo obligatorio.

## Segunda pasada funcional

Se ordenaron los objetivos de porcentajes desde cálculo de la parte hacia descuentos, cambios sucesivos y recuperación del original. Trece relaciones de prerrequisitos editoriales permiten recomendar una base anterior, incluyendo pasar desde M2 a una clase M1. No representan aún un grafo completo de prerrequisitos de todo el temario.

Se reutilizan las figuras y gráficos SVG originales de M1 en las preguntas diarias. En Lectura, después de comprobar, se resaltan únicamente citas exactas de la evidencia editorial del propio pasaje. Se distingue entre no disponer de otra pregunta para acreditar un objetivo y haberlo dominado. La recomendación diaria evita insistir en un objetivo sin preguntas disponibles.

Se subdividieron objetivos de Ciencias que mezclaban magnitudes o procedimientos diferentes (rapidez/aceleración, peso/fuerza, molaridad/molalidad, corriente/su unidad y otros). Se agruparon cuatro pares adicionales de paráfrasis para impedir acreditarlas como transferencia independiente. El banco conserva sus 623 ítems y claves.

Primera suite móvil completa: 388 aprobadas y cuatro fallos por título y encabezado del inicio anterior. Se actualizaron las expectativas a la nueva identidad manteniendo las comprobaciones de navegación y accesibilidad; los 18 recorridos diarios y del selector pasan después de esa corrección. No se eliminaron pruebas. Las ejecuciones finales de la suite completa y del APK se registrarán con su SHA definitivo.

Conteo de la organización inicial: M1 26 unidades/73 niveles; M2 8/53; Lectura 3/16; Ciencias 11/122; Historia 5/53. Son niveles editoriales por objetivo y contexto, no 317 clases nuevas independientes: reutilizan las 623 clases revisadas y sus fundamentos por concepto. El informe `reports/daily-curriculum-2026-10-15.json` enumera las asignaciones por ID.

Segunda integración: 145 pruebas de lógica aprobadas, incluyendo 120 muestreos adicionales de ensayos de Ciencias con 80 familias distintas, y 28 recorridos móviles de diario, selector y Ciencias aprobados (Android Chromium y 320 px). Se comprobó visualmente el inicio a 320 px sin desbordamiento. El APK cambia a versión 1.2.0-beta-daily, código 13; conserva applicationId, almacenamiento y configuración de firma beta. La prueba nativa añadida verifica el nuevo diario sin conexión y su recuperación al recrear la actividad. Su resultado depende todavía de CI.

## Integración con refuerzo tradicional

El espejo de respuestas diarias conserva los metadatos esperados por cada materia (habilidad, área, concepto, módulo y fecha). Los errores diarios también entran a las listas de refuerzo existentes de M1, Lectura y Ciencias, sin borrar notas ni sesiones. M2/Historia y los otros reforzamientos combinan resultados de la sesión previa con errores recientes del historial, de modo que una práctica diaria no queda ignorada porque exista un ensayo antiguo.

El inicio se compactó después de inspeccionarlo a 320 px. Se conservan los seis estados de presentación del gatito usando la imagen oficial, y el progreso muestra las últimas sesiones breves. No hay ilustraciones generadas ni servicios externos por respuesta.

Último resguardo de persistencia: una sesión diaria con estructura dañada se descarta conservando respuestas, puntos e historial. 147 pruebas de lógica y ocho recorridos diarios móviles pasan después del cambio. La inspección visual final del inicio a 320 px registra cero desbordamientos y cero imágenes rotas; esta medición de escritorio no sustituye una prueba de rendimiento en teléfono físico de gama media.

La disponibilidad de evidencia se cuenta por concepto en toda la asignatura, como el perfil compartido, aunque aparezca en varias unidades. Con el banco actual pueden acreditarse 41/73 niveles de M1, 52/53 de M2, 16/16 de Lectura, 49/122 de Ciencias y 15/53 de Historia mediante al menos dos familias disponibles. Los demás ofrecen estudio y práctica, pero necesitan más ítems distintos para certificar su dominio. No se presenta esa limitación como aprendizaje completado ni se generan preguntas automáticas para ocultarla.

Cierre de clasificación M2: cuatro preguntas de áreas conservan Geometría como eje aunque su formato sea suficiencia de datos o modelación. La organización final M2 tiene diez unidades por contexto y 53 niveles. La prueba específica y el resto de la lógica suman 148 aprobadas; ocho recorridos diarios pasan tras la corrección. Se actualiza también el nombre del artefacto Android a la versión real 1.2.0-beta-daily.
