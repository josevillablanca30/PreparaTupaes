# Continuidad visual de ¿Cachaste? · 4 de noviembre de 2026

Referencia autorizada: portada «Aprende. Compite. Supera.» y tarjeta «Tu camino, a tu ritmo», en las capturas del titular. Se conserva esa portada y se extiende su identidad oscura violeta/dorada a las pantallas educativas.

Cambios: recorrido con la montaña de la tarjeta aprobada, progreso con tarjetas oscuras y estadísticas reales, botones y navegación violeta, lecciones/tutor/ensayos con el mismo marco de lectura. Las tres poses oficiales existentes (libro, señalando y brazos cruzados) sustituyen los retratos de interfaz anteriores. No se generan nuevas mascotas. Las ilustraciones educativas y dibujos científicos conservan sus datos y colores originales sobre una superficie de dibujo clara.

Las 802 evaluaciones conservan su digest publicado `71c682244491099641acb8fdba4b2b06`. No se modifican enunciados, alternativas, respuestas, explicaciones, pasajes, reglas de avance, suscripciones ni datos del servidor. No se activa ningún cobro.

Fuente final de la interfaz: `13ae26d3f752ccc6f3de97086dee07cb938ac3fc`. Los cambios se conservan en la rama Android existente, sin actualizar la rama comercial ni el servidor.

La comprobación adicional del catálogo detectó dos desbordes de títulos a 320 px (`M2:M2-071` y `Ciencias:SCI-196`). Se permite partir una palabra o fórmula únicamente cuando no cabe completa; no se cambia su texto. Las comprobaciones de contraste incluyen alternativas antes/después de responder, cuerpo del tutor, comprobación final, navegación, leyendas y controles de los ensayos.

Verificación: 429 pruebas de lógica aprobadas; build de 125 archivos y auditorías de contexto y legibilidad aprobadas. La puerta de la candidata final aprobó 188 pruebas móviles y la integración Auth/duelos en un servidor efímero. Los bancos, lecciones y motor conservan además sus archivos originales, comprobados con Git frente a `1119aaea88559dfefa8e55bdc0cc2c9fa3506525`.

Candidata 47 / 1.5.0-rc20 compilada, descargada y verificada con la firma permanente. El ZIP coincide con el digest de GitHub Actions; Java verificó de manera independiente las 265 entradas firmadas y los 124 archivos de la distribución incluidos por Android coinciden byte a byte con el build local del mismo commit. Android omite el archivo de hosting `.nojekyll`. El manifiesto conserva `cl.preparatupaes.app`, API 36 y deshabilita `debuggable` y `testOnly`. [Verificación exacta](signed-bundle.json).

## Resultados y límites

- [AAB firmado y puerta de entrega](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41954301999): aprobados.
- [Revisión completa de navegadores](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41954301955): Android Chrome y 320 px, 448 pruebas aprobadas en cada perfil. Incluyen las 802 preguntas, todas sus alternativas incorrectas y los tres modos del tutor. Se omiten seis pruebas por perfil de la beta local retirada, que no se incluye en el paquete.
- iPhone WebKit: ejecución complementaria aún en curso al cerrar este registro; no se declara aprobada.
- [Acceso comercial instalado](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/41954301943): aprobado en emulador Android 36, cinco materias y compras desactivadas. El job adicional de WebView instalado, persistencia y Atrás sigue en curso.
- Inspección de capturas del build final: recorrido, progreso, lección, pregunta, tutor, alternativas y ensayos. El contraste automatizado mantiene un mínimo de 4,5:1 en los textos comprobados; se conservaron los colores de los dibujos científicos.
- Auditoría de contexto: 802 preguntas, 171 transferencias, 18 figuras, 70 respuestas contrastadas independientemente y cero incidencias en ese conjunto de comprobaciones. No certifica ausencia absoluta de errores.

[Detalle de comprobaciones](checks.json) · [Archivos y alcance](scope.json) · [Notas de versión](../../publication/notas-47.es-419.txt).

No se cargó esta candidata en Google Play ni se probó en un teléfono físico. Falta que el titular actualice la prueba cerrada y revise la versión instalada; los resultados anteriores son automatizados. La web comercial, Supabase, SMTP y las configuraciones de pago conservaron su estado.
