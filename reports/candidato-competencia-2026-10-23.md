# ¿Cachaste? — candidata Android 1.5.0-rc1

Fecha: 23 de octubre de 2026. Rama: `work/cachaste-motor-duolingo-20261016`. No se modificó `main` ni se publicó comercialmente.

**APK instalable para revisión; la competencia pública todavía no está activada.** La implementación se comprobó con dos cuentas y servicios Auth/PostgREST reales en un Supabase local desechable. Eso no equivale a una prueba del proyecto alojado.

## Archivo y revisión exacta

- Versión Android: **1.5.0-rc1**, código **28**; paquete `cl.preparatupaes.app.sciencebeta`.
- APK: `Cachaste-v1.5.0-rc1.apk`, **11.374.496 bytes**.
- Fuente incrustada en la APK: [`da479cc3c6ded5bd8693c65c4e2ffe8ea41a086e`](https://github.com/josevillablanca30/PreparaTupaes/commit/da479cc3c6ded5bd8693c65c4e2ffe8ea41a086e).
- SHA-256 del archivo: `11e7c9c187b8d2dbde4c2cc8cdf75497b8f5e3eed21ffe41720dddd2ee887a4b`.
- Firma beta verificada con apksigner; mismo certificado que rc13: `06fea3ef23af90358868d6c7edf877a871404027e1f7104036ed25ff7b05df22`. Permite actualizar esa beta conservando sus datos.
- Sin usuarios demostrativos, respuestas privadas del servidor, semillas SQL ni mecanismos de Premium de pruebas en la candidata. El banco educativo offline existente sí permanece en la APK.
- El AAB release compila, pero está **sin firma de Play y no es publicable**.

## Implementado y comprobado

| Componente | Comportamiento | Estado real |
| --- | --- | --- |
| Perfil y Auth | Correo y contraseña separados del nickname; región/comuna; avatar; privacidad voluntaria; editar, reautenticar y eliminar cuenta | SDK y RPC funcionales; probados en dos cuentas locales. Configuración de correo y recuperación alojada pendiente |
| Rankings | Exactamente Ensayo PAES, Express, Modo juego y Liga de duelos; cinco materias, menciones de Ciencias; comuna/región/Chile; Top 10, posición y vecinos; semanas e histórico | Consultas y filtros probados en PostgreSQL; interfaz conectada a RPC. Publicación del esquema alojado pendiente |
| Comparabilidad | Ensayo completo por formato; Express de 15 preguntas/15 minutos; formulario semanal inmutable y una oportunidad clasificatoria por categoría | Aciertos sobre total, sin puntos ponderados ni afirmación de puntaje oficial DEMRE. La práctica educativa sigue siendo ilimitada |
| Duelos | Nickname, código o búsqueda aleatoria; asincrónicos; mismas diez preguntas para ambos; 90 segundos por pregunta | Partidas completas verificadas por HTTP; soluciones ocultas hasta terminar; tutor disponible después |
| Resultados | Aciertos primero; tiempo válido solo desempata; empate si persiste la igualdad | Servidor califica, controla tiempos y liquida una sola vez. Victoria +1; derrota −1 con piso cero; empate 0 |
| Estadísticas y seguridad | Estrellas competitivas independientes; victorias, derrotas, empates y racha; RLS, permisos mínimos, límites, reservas de preguntas y transacciones | Pruebas de autorización, duplicación, partidas propias, reconexión, abandono y manipulación de tiempos aprobadas |
| Educación existente | Cinco materias, menciones, mapa, diagnóstico, Express, tutor, celebraciones y persistencia offline | Conservados; navegación entre las dos procedencias Android mantiene el progreso local |

Las estrellas y logros educativos anteriores del teléfono se conservan. No se convierten automáticamente en puntos públicos sin verificación del servidor. El ranking de Modo juego acredita avances comprobados; no confía en cifras enviadas por el teléfono.

## Contenido contado directamente

| Materia | Preguntas | Niveles del camino | Objetivos distintos |
| --- | ---: | ---: | ---: |
| Matemática M1 | 147 | 73 | 65 |
| Matemática M2 | 115 | 54 | 48 |
| Competencia Lectora | 130 | 16 | 10 |
| Ciencias | 305 | 122 | 114 |
| Historia | 105 | 53 | 50 |
| **Total** | **802** | **318** | **287** |

Además hay **8 lecciones de fundamentos**, **20 textos lectores** y **2.414 explicaciones de alternativas incorrectas**. Los 318 niveles no son 318 problemas independientes: el catálogo contiene variantes por objetivo. Para competencia son elegibles **755 preguntas**; se excluye contenido complementario.

Enunciados, alternativas y claves conservan la huella `d8a9b8965c4a53d288758624b89b00759b435664e9c6854d7051975be5e0b5fa`. Auditoría de presentación: 0 problemas críticos y 0 alertas de redacción del detector. La auditoría heurística pedagógica mantiene 20 observaciones de revisión; no son fallos automáticos ni una certificación de comprensión humana.

## Correcciones realizadas

1. El exportador competitivo omitía ilustraciones necesarias: ahora conserva los **18 gráficos/diagramas originales**, sus textos y el pasaje lector completo. La pregunta nativa capturada usa un gráfico real del banco.
2. La respuesta perdida por desconexión podía comprometer la continuidad: se guarda la elección y su identificador antes de enviarla, se reintenta exactamente esa operación y se recupera la posición del servidor sin aplicar la elección a otra pregunta.
3. Recuperación de contraseña integrada con el evento verificado del SDK y nuevo inicio de sesión; el envío permanece cerrado mientras no exista URL de retorno configurada.
4. Corregidos desbordamientos en WebKit, recortes del arte del VS y continuidad entre navegación competitiva HTTPS y aprendizaje offline en Android.
5. Separados el acceso de prueba y el acceso comercial: un permiso de laboratorio no habilita Premium en producción; eliminar una cuenta no exige suscripción.
6. Mejoradas las evidencias del recorrido instalado: captura continua y diagnóstico del emulador; el foco del teclado se controla en la automatización, sin cambiar el formulario del usuario.

## Pruebas y evidencia

| Verificación | Resultado | Evidencia |
| --- | --- | --- |
| Lógica, seguridad PostgreSQL, cliente y respaldo | **365 aprobadas, 0 fallos** | [CI móvil](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39891307642) |
| Android Chrome, pantalla de 320 px e iPhone WebKit | **376 por entorno; 1.128 aprobadas** | [CI móvil](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39891307642), implementación `7c507cd`; el código de aplicación de la APK es idéntico |
| Supabase real local: dos cuentas por Auth y PostgREST | **15 comprobaciones aprobadas, 0 fallos** | [Integración](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39891307745), informe JSON adjunto |
| APK instalada: Android 15 / API 35 | **25 pruebas, 0 fallos, 0 omitidas** | [Android](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39894280241), XML original adjunto |
| Capturas nativas | **64 revisadas** | PNG originales y seis contactos JPG adjuntos |
| Identidad y empaquetado | SHA, versión, firma y ausencia de fixtures verificados | [Entrega verificada](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39894381379) |

Se comprobaron victoria, derrota, empate, abandono, tiempo de teléfono falsificado, respuesta duplicada, respuesta perdida, recuperación de sesión, estadísticas persistentes y permisos de tablas. Las dos identidades de integración se destruyen al terminar.

**Android 16 / API 36 queda pendiente:** el emulador desapareció de ADB durante el VS, antes de completar la batería. El mismo trabajo pasó íntegro al reintentar en API 35. No se identificó una causa definitiva y no se afirma compatibilidad nativa aprobada en Android 16. Los mensajes de terminación de WebView entre casos también aparecen en la ejecución aprobada; por sí solos no demuestran un cierre durante uso normal.

## Revisión visual

Revisados Home, selección de Ciencias, mapas de las cinco materias, fundamentos, lecciones, fórmulas, gráficos, explicaciones de errores, diagnóstico, Express, celebraciones y las nuevas vistas. Se conserva el gatito oficial y se reutilizaron las ilustraciones aprobadas para Rankings, Duelos, VS y Resultado, con los morados y amarillos originales.

La composición se adapta a una pantalla táctil: controles de al menos 48 px y contenido desplazable. El estadio del VS y algunos iconos están construidos con CSS/SVG; no constituyen una copia píxel por píxel de toda la ilustración de referencia. El Top 10 solicitado reemplaza el Top 5 demostrativo.

Las capturas `competition-fixture-*` prueban la interfaz instalada con datos **exclusivos del APK de instrumentación**. No prueban el servidor público ni aparecen como resultados reales en la candidata. `competition-live-locked.png` muestra el estado real del servicio pendiente.

## Bloqueos para abrir el servicio y publicar

- El proyecto Supabase dedicado **Cachaste**, São Paulo, está activo en Free; no se tocó Servicios Villablanca. Al aplicar la migración, la conexión de escritura devolvió `Invalid or expired requestState`. La lectura de cierre confirma que todavía no hay tablas `cachaste`: faltan aplicar migración/semilla, ejecutar asesores y comprobar dos cuentas en el proyecto alojado.
- Configurar confirmación de correo, SMTP, contraseña mínima, URL HTTPS de retorno y recuperación. Probar los enlaces desde Android y publicar las URLs de privacidad y eliminación de cuenta.
- Crear productos oficiales de Google Play y conectar Billing, verificación en servidor, restauración y renovaciones. **No hay cobros ni Premium ficticio habilitados.** Se mantienen $2.490 semanal, $7.990 mensual y $64.990 anual; oferta de siete días y posterior mensualidad sujeta a validación oficial.
- Completar Android 16 y aprobación de José en dispositivo físico; firma de lanzamiento y configuración de Play.
- Ejecutar respaldo y restauración administrativa en un entorno aislado. El código de cifrado y recuperación exacta de bytes pasó pruebas; no se afirma un ensayo de restauración alojada ya realizado.

La infraestructura evita conexiones permanentes y limita lecturas. Aproximadamente 200 usuarios activos es una meta dentro de las cuotas gratuitas, no una garantía medida de capacidad. El banco offline puede extraerse de la APK: reservas, límites y formularios semanales reducen abuso, pero no eliminan extracción o colaboración entre estudiantes.

## Commits de implementación

- [`f77c9c9`](https://github.com/josevillablanca30/PreparaTupaes/commit/f77c9c9698d8b0572673f97c0e135c6e9fa9431d): esquema competitivo, catálogo privado, seguridad e integración.
- [`6de458a`](https://github.com/josevillablanca30/PreparaTupaes/commit/6de458a468e16c2a860446bbcadc8849af754242): perfiles, rankings, duelos, arte aprobado e integración Android.
- [`7c507cd`](https://github.com/josevillablanca30/PreparaTupaes/commit/7c507cd01f4a3cddf8ffdd4ac44a1201ced41d7e): diagramas, recuperación y ajustes visuales; implementación probada en los tres navegadores.
- [`da479cc`](https://github.com/josevillablanca30/PreparaTupaes/commit/da479cc3c6ded5bd8693c65c4e2ffe8ea41a086e): fuente exacta de la APK, pruebas nativas y diagnóstico.
- [`db01b6c`](https://github.com/josevillablanca30/PreparaTupaes/commit/db01b6cb699595211189ff17e60352e36178f6e1): entrega de artefactos verificables; sin cambios en la aplicación.
