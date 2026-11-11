# Duelos 2.0 — entrega y pruebas

Implementación en `work/cachaste-duelos-2-20261110`, aislada del lanzamiento y pagos.

## Qué quedó

Emparejamiento humano con respaldo virtual después de 10 segundos; diez preguntas compartidas en distinto orden; dominio por aciertos y errores; 40 minutos y sin desempate por velocidad; estrellas humanas ±3 / virtuales ±1; liquidación única; revancha; historial combinado y repaso completo. El mismo módulo se empaqueta para web y Android sin reemplazar fotos ni avatares.

## Validaciones reales

| Comprobación | Resultado |
|---|---|
| Regresión web + cliente + Duelos 2 | 180 pruebas locales, 180 aprobadas, 0 fallidas |
| Motor SQL | Ocho pruebas integradas: humanos, bots, victorias/derrotas/empates, estrellas, banco completo, historial, acceso y expiración |
| Idempotencia | Reaplicación de migración y reintentos de respuestas, creación, aceptación y revancha comprobados |
| Concurrencia | Cuatro conexiones TCP a PostgreSQL; 40 RPC de respuesta/reintento; 20 respuestas únicas y una liquidación |
| Privacidad | Sin soluciones antes de terminar; sin acceso a intentos ajenos; proyección Realtime sin progreso ni alternativas; sesión revocada sin lectura |
| Móvil | Chromium a 390 y 320 píxeles, web y fuente WebView Android; contraste de los textos nuevos verificado |
| Recorrido de navegador | Dos sesiones, ambos turnos completos, barra por consultas automáticas, selección conservada, recarga, resultado, revancha, historial y tres modos del tutor; además duelo virtual con repaso |
| Builds | Web con contenido protegido; candidato nativo con assets; APK debug compilado en GitHub |

El workflow reproducible es [Duelos 2](https://github.com/josevillablanca30/PreparaTupaes/actions/workflows/duels2-tests.yml). Las identidades Auth del navegador son fixtures locales; cada RPC competitivo ejecuta la migración SQL contra PostgreSQL aislado. No se usaron cuentas reales de estudiantes ni se escribieron datos de producción.

El transporte WebSocket de Supabase alojado **no se probó**: el harness bloquea el tráfico público y verifica la sincronización automática por consultas. La prueba real de Realtime requiere la migración y el ajuste CSP de integración.

## Capturas funcionales

Capturadas en [la ejecución 42865020693](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/42865020693), después de corregir contraste y recuperación de la barra. Corresponden a preguntas del banco real, con cuentas de prueba aisladas.

- [Barra y pregunta, Android a 320 píxeles](android-320-dominio.png).
- [Barra y pregunta en web](web-dominio.png).
- [Resultado con dominio y estrellas](web-resultado.png).
- [Repaso con alternativa elegida, correcta y otro ejemplo](web-repaso.png).

## Integración pendiente

Revisar [la guía de integración](../../docs/duels2-integration.md) y aplicar [la migración idempotente](../../web/supabase/migrations/20261110130920_cachaste_duels2_isolated.sql) junto con el responsable del lanzamiento. Configurar el [mantenimiento dedicado](../../duels2/operations.sql), permitir el origen WSS de Supabase en las dos políticas CSP web y ejecutar Realtime/scheduler en el entorno alojado. El APK compiló, pero no se instaló en un teléfono físico ni se publicó en Play Store.

No se desplegó sitecacho.cl. No se modificaron pagos, acceso premium, año gratuito de testers ni ramas ajenas.

## Commits principales

- [Contrato de aislamiento](https://github.com/josevillablanca30/PreparaTupaes/commit/ed0f8762d01ff378dd8fd45b706274da6f414b49).
- [Motor de emparejamiento, dominio y estrellas](https://github.com/josevillablanca30/PreparaTupaes/commit/ecf0a7a921d4da65ac929ecd353aabc0a253e04c).
- [Interfaz compartida y pruebas simultáneas](https://github.com/josevillablanca30/PreparaTupaes/commit/f32cec280ae60c96be98167082a0a2d628a5c76a).
- [Candidato APK y repaso de navegador](https://github.com/josevillablanca30/PreparaTupaes/commit/5b8012dd7e5681d800533633b6be071660838499).
- [Contraste y recuperación de barra](https://github.com/josevillablanca30/PreparaTupaes/commit/5f4ec6897578ae6290cab4eb1a06972c675b971c).
- [Revocación de lectura y coordinación del lanzamiento](https://github.com/josevillablanca30/PreparaTupaes/commit/715fff9575b98d8ca35bb37dde03f44952b8e92a).
- [Reglas de partidas anteriores durante la transición](https://github.com/josevillablanca30/PreparaTupaes/commit/3405b61706c71cc016453514fbbdff07e2759c5e).
- [Historial común y paginación](https://github.com/josevillablanca30/PreparaTupaes/commit/50fa693f77a60ed3f27c3f1961e4914c8ab3348b).
