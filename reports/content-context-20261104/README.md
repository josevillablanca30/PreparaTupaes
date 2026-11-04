# Corrección de contexto · 4 de noviembre de 2026

El error reportado era real. La construcción de transferencias copiaba con `...base` el gráfico del ejercicio fuente, aunque el enunciado y los datos ya habían cambiado. Las auditorías anteriores verificaban estructura, claves registradas y visibilidad, pero no la correspondencia semántica del estímulo. Esos resultados no acreditaban ausencia de errores de contenido.

| Pregunta | Hallazgo confirmado | Corrección |
| --- | --- | --- |
| M1:TR-M1-007 | Plano de senderos con gráfico de presupuesto; tutor sobre frecuencias | Escala cm/km, explicación y ejemplo propios; se mantiene C: 14 km |
| M1:TR-M1-022 | Encuesta de preferencias con préstamos de libros y datos diferentes | Fútbol 12, dibujo 15, música 15, lectura 8; tutor de esa encuesta |
| M1:TR-M1-021 | Contexto de reducción con factor 5; ejemplo sobre suma de potencias | Contexto de algoritmo y producto/cociente; se mantiene respuesta 5 |
| Ciencias:TR-SCI-097 | Pregunta de pez con tutor heredado de pulmones | Branquias, circulación y respiración celular en todos los modos |

Además se corrigieron los 31 alias `q` de las transferencias M1: conservaban el enunciado de la base mientras `question` contenía el nuevo. No se comprobó otro fallo de pantalla causado por ese alias; se elimina la ambigüedad del dato.

## Alcance y controles

- Control automatizado de estructura sobre 802 preguntas, referencias a los 130 ítems de lectura y renderizado de las 18 figuras.
- Revisión de correspondencia de las 18 figuras y lectura editorial asistida de los enunciados, alternativas y claves de las 171 transferencias. No es revisión de un profesor externo ni certificación curricular.
- 70 respuestas contrastadas mediante cálculos o conclusiones independientes; identidades algebraicas verificadas con varios valores. Véase `audit.json`.
- El constructor rechaza una transferencia nueva basada en una figura si falta una decisión explícita sobre su estímulo. Texto, figura y pasaje ya no se copian silenciosamente.
- Regresiones específicas de escala, encuesta, tutor del pez, potencias, accesibilidad, escape HTML y compatibilidad de versiones anteriores.
- Prueba en PostgreSQL local de la actualización acotada del servidor: cuatro preguntas, repetición idempotente, rechazo de conflicto y reversión atómica; respuestas previas intactas.
- Se conservan 802 claves, familias, conceptos, alternativas e índices correctos. Las tres evaluaciones que cambian enunciado o figura guardan la versión anterior para no reinterpretar intentos históricos.
- El gráfico cm/km mantiene `type:bar` como representación compatible con versiones Android anteriores; la versión nueva muestra una escala segmentada. El esquema no debe medirse físicamente en pantalla y no revela los 14 km de la respuesta.

La auditoría heurística previa sigue mostrando 20 alertas de revisión (no errores conceptuales comprobados). No se ha revisado conceptualmente de forma exhaustiva cada una de las 802 preguntas contra fuentes disciplinares externas. Los ensayos de navegador son automatizados; no equivalen a probar en un teléfono físico con una cuenta real.

El estado del despliegue, los commits y el AAB se registran tras verificar sus ejecuciones. Cobros siguen desactivados y no se modifica Servicios Villablanca.
