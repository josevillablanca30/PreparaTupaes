# Tutor de Historia: revisión por lotes

## Lote 1: HIS-001 a HIS-020

20 preguntas inspeccionadas individualmente y reescritas en los tres modos. Cada una tiene fundamentos, aplicación propia, comprobación, una estrategia cotidiana y un caso distinto resuelto. Se reescribieron también sus 60 explicaciones de distractores. Las 45 restantes siguen pendientes de esta pasada; no se certifican por la mera existencia de explicaciones anteriores.

Calidad anterior: básica. Calidad editorial actual: adecuada; no se utiliza «excelente» como premio por longitud ni se afirma aprendizaje medido en estudiantes. El respaldo completo previo está en `pedagogy/history-before-2026-10-15.json`. Enunciados, alternativas y claves se conservan.

Ejemplos de cambios:

- HIS-004 antes: «Aylwin ganó las elecciones de 1989 y asumió como presidente en marzo de 1990». Ahora distingue consulta, elección y ejercicio del mandato, explica las continuidades de una transición y resuelve un caso imaginado de fechas de elección y asunción diferentes.
- HIS-019 antes definía no rivalidad y no exclusión brevemente. Ahora define cada propiedad desde una manzana, distingue financiamiento estatal de clasificación económica y resuelve por qué un estanque abierto con peces es un recurso común y no un bien público puro.
- HIS-018 diferencia ingreso nominal y capacidad de compra, calcula libros adquiribles con ahorro fijo y advierte que el precio de un solo producto no demuestra inflación general.
- Los errores se corresponden con la alternativa elegida: en HIS-001 se explica por separado la confusión con 1949, con el predominio parlamentario posterior a 1891 y con las leyes laicas anteriores a 1925.

Los casos imaginados se identifican como tales. No se fabrican cartas ni citas históricas. Los ejemplos son enseñanza, no evidencia de que el estudiante ya domine el contenido. El refuerzo de costo de oportunidad utiliza HIS-059 después de HIS-009, con otro problema y sin repetir inmediatamente el fallado.

## Fuentes de contraste

Consulta: 15 de octubre de 2026. Se redactó material original; las fuentes sirven para contrastar hechos y distinciones, sin copiar sus textos.

- [BCN: Constitución de 1925](https://www.bcn.cl/constitucion1925/historia.html): separación institucional y fortalecimiento presidencial (HIS-001).
- [BCN: período 1973–1990](https://www.bcn.cl/historiapolitica/hitos_periodo/detalle_periodo.html?K=1&filtros=1%2C2%2C3%2C4%2C5%2C6&pagina=1&per=1973-1990): golpe y cambio de mando (HIS-003/004).
- [BCN: sufragio femenino](https://www.bcn.cl/historiapolitica/elecciones/detalle_eleccion?handle=10221.1%2F63027&periodo=1925-1973): ampliación parlamentaria y presidencial (HIS-020).
- [BCN: procesos electorales 1925–1973](https://www.bcn.cl/historiapolitica/elecciones/index.html?periodo=1925-1973): distinción entre ampliaciones municipal, presidencial y posteriores (HIS-020).
- [Memoria Chilena: inicios de la industria](https://www.memoriachilena.gob.cl/602/w3-article-647.html): antecedentes de la sustitución y efecto de la crisis (HIS-002).
- [Memoria Chilena: industria del salitre](https://www.memoriachilena.gob.cl/602/w3-article-3309.html) y [conexiones portuarias](https://www.memoriachilena.gob.cl/602/w3-article-639270.html): producción y encadenamientos (HIS-012).
- [ONU: su historia](https://www.un.org/es/about-us/history-of-the-un) y [Carta](https://www.un.org/es/about-us/un-charter): firma y entrada en vigor de 1945 (HIS-014).
- [Consejo para la Transparencia: acceso](https://www.consejotransparencia.cl/como-accedo-a-la-informacion-que-necesito/): publicación, solicitud y reserva (HIS-017).
- [Banco Central: política monetaria](https://www.bcentral.cl/areas/politica-monetaria): inflación y capacidad de compra (HIS-018).
- [BCN: Poder Legislativo](https://www.bcn.cl/formacioncivica/detalle_guia?h=10221.3%2F45762): función legislativa (HIS-006).

## Verificación

113 pruebas de lógica aprobadas, cero fallos y cero omitidas. La auditoría estructural conserva 623 preguntas y cero fallos críticos; sus alertas de revisión son heurísticas y no sustituyen revisión conceptual.

14 recorridos locales aprobados (Android Chrome y 320 px): usan las tres alternativas incorrectas de cada pregunta del lote, cambian entre los tres modos y comprueban ausencia de desborde horizontal. Otro recorrido recupera la clase tras recargar y ofrece HIS-059 como problema distinto. El primer intento no pudo abrir el ejecutable local truncado de Chromium; se regeneró desde el paquete existente y se ejecutaron las pruebas completas, sin cambiar ni desactivar casos. Hay una nueva prueba nativa Android para ese recorrido; su resultado se registrará al completar CI, sin darla por aprobada anticipadamente.

## Evidencia cerrada de M2

Commit `1efd7946411fe4869b75b9656b2a3aa5b440a0eb`: 110 pruebas de lógica, 189 recorridos de navegador (incluido WebKit) y cuatro pruebas nativas Android aprobadas, sin omitidas. [Android de respaldo](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38730337593); [validación móvil y bloqueo de publicación Pages](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/38730331099).

La APK M2 descargada tiene SHA-256 `36d7ba63ddffbbaf58651094f890ea98b2326768c4fd7f219edb85a0c567bec7`. Su certificado público difiere del de la beta `0a3f2f6` previamente entregada. El registro confirma ausencia de la caché de firma al compilar: no se puede prometer actualización sobre esa instalación. No se ha indicado desinstalar ni borrar datos. Es un pendiente de distribución, distinto del resultado de pruebas funcionales.
