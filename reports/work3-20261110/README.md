# Work 3 — legibilidad, UX y Android

Estado inicial comprobado el 10 de noviembre de 2026 (Chile).

- Rama Android: `e3a0434d70042afc40dccdbf6d57307a16c2e16e`.
- Rama web inspeccionada: `89b71fbc8f19750afaefd5fe15f068c521179a82`.
- PR #7 abierto, sin fusionar; no se incorporan sus archivos.
- El run `42813488596` aprobó 178 recorridos y falló 10 comprobaciones de contraste del tutor (cinco materias × Android Chrome/320 px). `signed-bundle` quedó omitido; preflight de firma e integración local sí aprobaron.
- Causa observada en código: capas de tema fijan `color`, otras fijan `-webkit-text-fill-color`; algunos contenedores del tutor conservan fondos claros mientras sus párrafos se vuelven blancos.
- La rama web tiene diferencias relevantes en `daily-reference.css`, `daily-ui.css`, `study-ui.css` y `competition-ui.css`. Se preparará una propuesta web aislada desde su cabeza remota, sin fusionar ramas de producto.
- La primera prueba local no alcanzó a abrir el navegador: Chromium del entorno rechaza `socket()` al crear ProcessSingleton. Es un bloqueo de infraestructura, distinto de los 10 fallos funcionales confirmados en CI. Se usará CI para pruebas reales y emulador cuando corresponda.

No se modifica Supabase de producción, cobros, suscripciones, testers, DNS ni despliegue. No se publica en Google Play. El AAB anterior 47 proviene de `13ae26d3f752ccc6f3de97086dee07cb938ac3fc` y no prueba estas correcciones.

La validación final, comparativas y copia editorial se añadirán aquí con resultados ejecutados.


## Primer ciclo real

Run `42935940787`, fuente `1d47211a8b2de496eff5b5191cf2789a78bbe39b`:
- Las **188 pruebas originales** aprobaron, incluidas las diez que antes fallaban.
- La auditoría ampliada encontró tres fallos adicionales: fondo claro en alternativas de mini práctica evaluadas (texto claro, ratio 1,128), definiciones de vocabulario oscuras sobre panel oscuro (1,138), y fórmulas oscuras en un recuadro oscuro de un modelo claro (1,2). Se corrigen en la siguiente revisión, sin alterar los umbrales de contraste.
- La comprobación de cobertura de texto pedía más de diez nodos; en la pregunta inicial sólo se habían seleccionado seis. Se amplían los selectores para medir también instrucciones y acciones reales; se conserva el mínimo de cobertura.
- La comparativa anterior necesitaba historial git completo; el checkout superficial no incluía `e3a0434`. Se corrige la infraestructura de captura.
- La firma y el emulador quedaron bloqueados por el control de verificación, como corresponde. No se produjo un AAB que ocultara estas fallas.
- Copy Android: «Terminar mi ratito» pasa a «Terminar práctica» para describir la acción. El título genérico de respaldo «Cada ratito suma» pasa a «Práctica completada»; no se alteran textos académicos.


## Auditoría ampliada de recorrido

- `42937325159`: 188/188 originales; 36/41 de tutor y mini práctica. El único fallo restante fue la misma fórmula en cinco anchos dentro del modelo de ondas, cuyo contenedor es `.biology-model`. Se agregó el par claro para ese recuadro de datos.
- `42938797727`: **41/41** de tutor y mini práctica, con todas las menciones y anchos. Las siete pruebas adicionales de recorrido detectaron estilos fuera del tutor: globo de bienvenida (1,088:1), texto secundario del modo juego (3,262:1), acciones deshabilitadas de diagnósticos clásicos (2,055–2,251:1), leyendas de avatares (2,789–3,275:1) y rótulo informativo de suscripción (4,111:1). Se emparejan sus fondos y colores; sólo cambia el color del rótulo en suscripción.
- Se excluye de la sonda el valor interno de radios y casillas, que el navegador no pinta. Se mantienen las etiquetas visibles y se añade el texto visible de los selectores. Los umbrales, recorridos y controles existentes se conservan.
- Se verificó directamente la firma del AAB anterior 47: SHA-256 `a566926f01e79e5f75422b5c03c91b4337018e4f7987b32888c650ca7f271575`. La nueva firma tiene que coincidir con esa huella.

## Prueba instalada y botón Atrás

El run `42939594593` aprobó las 188 regresiones, las 48 pruebas de auditoría y las cinco comprobaciones de acceso comercial instalado. Las muestras visuales en Chromium tuvieron un mínimo de 4,602:1 en 17.618 mediciones. La prueba nueva de contraste dentro del WebView instalado también aprobó las cinco materias y las cuatro rutas de Ciencias. [Ejecución](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/42939594593) · [Auditoría visual](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/42939594593/artifacts/13818869835)

El conjunto instalado obtuvo 30 de 33 casos. Dos pruebas recibieron el evento Atrás sin alcanzar la pantalla de retorno esperada tras recrear la actividad. La tercera esperaba el atlas de 1536 px, anterior a los retratos oficiales individuales. El control de firma se mantuvo cerrado en ese run.

La revisión `108a57b00dd510809a8156276fa50a1487492f8f` registra el callback del sistema desde Android 13 y conserva la ruta de Atrás para sistemas anteriores. Las pruebas emiten el evento real de Android con la actividad enfocada y comprueban el guardado y la reapertura de la sesión. La verificación del retrato compara el archivo aprobado, sus dimensiones reales y su ajuste dentro del contenedor. Los cambios de esta revisión corresponden a navegación nativa y QA, por lo que el PR web sigue usando los mismos estilos ya medidos. [Android 16](https://developer.android.com/about/versions/16/behavior-changes-16) · [Validación de la revisión](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/42991812837)
