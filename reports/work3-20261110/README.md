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
