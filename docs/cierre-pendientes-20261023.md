# ¿Cachaste? — cierre de pendientes y candidata 1.5.0-rc2

23 de octubre de 2026. Rama `work/cachaste-motor-duolingo-20261016`. Se continuó el desarrollo remoto; se conservaron la identidad y el contenido educativo. No se modificó main ni se publicó comercialmente.

**APK instalable para revisión. La competencia comercial permanece cerrada hasta validar suscripciones oficiales.**

## APK exacta

- Archivo: `Cachaste-v1.5.0-rc2.apk`, **13.684.689 bytes**; versión **1.5.0-rc2**, código **29**.
- Paquete beta: `cl.preparatupaes.app.sciencebeta`; mínimo API 24, objetivo API 36.
- Fuente: [037b863f1a21b5055392fcfd9ae32e291542da10](https://github.com/josevillablanca30/PreparaTupaes/commit/037b863f1a21b5055392fcfd9ae32e291542da10).
- SHA-256: `9fdca3423b3788da9eab703802e89b150eaa9e45ec57014165481694c0eae0bd`.
- Certificado: `06fea3ef23af90358868d6c7edf877a871404027e1f7104036ed25ff7b05df22`. Coincide con rc1/rc13: actualizar sobre la beta conserva sus datos.
- Sin fixtures, semillas SQL, secretos ni mecanismos de Premium de laboratorio en la candidata. El AAB de verificación compila; todavía carece de firma comercial.
- [Paquete descargable: APK, 65 PNG, contactos JPG, XML original y certificado](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39961241927/artifacts/12505271434). GitHub lo entrega como ZIP; extraer la APK antes de instalar.

## Problemas resueltos

1. **Supabase alojado:** aplicadas las dos migraciones en el proyecto independiente `jmobinmdwrmdqrxtcruj`, con 802 preguntas, 755 elegibles y 346 comunas. Salud HTTPS 200 con catálogo listo; operación competitiva anónima rechazada con 401. Las 20 tablas privadas tienen RLS. La revisión del proyecto confirmó cero identidades, perfiles y suscripciones de ejemplo.
2. **Billing implementado:** biblioteca Android 9.1.0; ofertas elegibles, compra explícita, estados pendiente/cancelado y restauración, incluso tras recrear la actividad. Puente restringido a la página principal segura de suscripción. La beta no puede iniciar compras ni conceder Premium.
3. **Verificador desplegado:** `cachaste-play` y `cachaste-play-events`, versión 2. Vinculación de recibo con Auth, consulta Google, reconocimiento, cifrado, actualización transaccional y eventos con firma OIDC. La comprobación HTTP real devuelve `ready:false`; sin configuración oficial se rechaza la verificación. Las pruebas controladas del verificador no equivalen a una compra real de Google.
4. **Android 16 y VS:** reemplazada la composición costosa de capas por un SVG estático que reutiliza el arte aprobado. Corregidos avatares atenuados, incompatibilidad Kotlin y recuperación de WebViews destruidas. La batería exige API 36, sin esconder fallos mediante otra versión Android.
5. **Capturas:** la inspección detectó dos archivos con el fotograma de la ruta anterior pese al cambio del DOM. La automatización ahora fuerza y espera dos fotogramas comprometidos. Se repitieron las 26 pruebas y se revisó el VS real.
6. **Respaldos recuperables:** el volcado original incluía definiciones administradas que fallaban con permisos normales. El formato 2 conserva aplicación, historial de migraciones y datos Auth desde una instantánea consistente; excluye sesiones y sus reclamaciones. Restauración real aprobada en PostgreSQL 17 aislado, con contraseña, estadísticas, RLS y ACLs conservadas y tokens antiguos invalidados.

## Estado funcional

| Componente | Implementado y probado | Límite actual |
| --- | --- | --- |
| Rankings | Exactamente Ensayo, Express, Modo juego y Liga; cinco materias/menciones; comuna/región/Chile; Top 10, posición y vecinos; semanas e histórico | Esquema desplegado. No se afirma prueba de dos suscriptores en el proyecto alojado |
| Comparabilidad | Formularios semanales equivalentes, una oportunidad clasificatoria; aciertos sobre total, sin puntajes oficiales DEMRE ni ponderación | La práctica educativa permanece ilimitada |
| Duelos | Nickname, código y rival aleatorio; diez preguntas iguales; aciertos antes del tiempo; soluciones al terminar ambos; tutor | Comunicación completa entre dos cuentas Auth/PostgREST reales locales; falta validación comercial alojada |
| Estadísticas | +1 victoria, −1 derrota con piso cero, empate 0; idempotencia, abandonos, límites y reservas | Estrellas educativas y competitivas independientes |
| Perfil y Auth | Correo separado de nickname; región/comuna, privacidad voluntaria, editar, reautenticar y eliminar | Falta cerrar correo público y recuperación HTTPS |
| Educación | Cinco materias, menciones, lecciones, mapa, tutor, diagnóstico, Express, repetición y progreso offline conservados | La candidata sigue siendo beta |

## Catálogo verificado

| Materia | Preguntas | Niveles | Objetivos |
| --- | ---: | ---: | ---: |
| M1 | 147 | 73 | 65 |
| M2 | 115 | 54 | 48 |
| Lectora | 130 | 16 | 10 |
| Historia | 105 | 53 | 50 |
| Ciencias | 305 | 122 | 114 |
| **Total** | **802** | **318** | **287** |

Además: **8 lecciones de fundamentos**, **20 textos lectores**, **2.414 explicaciones de alternativas incorrectas** y los **18 gráficos originales** necesarios para competencia. Los niveles no equivalen a problemas independientes.

Enunciados, alternativas y claves conservan la huella `d8a9b8965c4a53d288758624b89b00759b435664e9c6854d7051975be5e0b5fa`. Auditoría estructural: 0 problemas críticos, 20 observaciones heurísticas y 0 alertas del detector de redacción; no es certificación humana de comprensión de cada explicación.

## Pruebas y revisión visual

| Verificación | Resultado | Evidencia |
| --- | --- | --- |
| Lógica y seguridad | **375 aprobadas, 0 fallos** | [CI móvil](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39958370541) |
| Android Chrome, 320 px e iPhone WebKit | **382 por entorno; 1.146 aprobadas** | [CI móvil](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39958370541) |
| Dos cuentas, Auth/PostgREST reales locales | **15 comprobaciones aprobadas** | [Integración](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39958858061) |
| APK instalada en Android 16 / API 36 | **26 aprobadas, 0 fallos, 0 omitidas**, después de corregir capturas | [Android](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39960691720) |
| Cifrado y restauración PostgreSQL 17 aislado | Aprobada: catálogo, identidad, historia, RLS y ACLs | [Restauración](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39958858074) |
| Firma, versión, ausencia de fixtures y capturas | Verificadas | [Entrega](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39961241927) |

El código web comprobado en los tres navegadores es el mismo de la candidata; los cambios posteriores afectan respaldo, pruebas nativas y recopilación de evidencia.

Revisadas las **65 capturas nativas** mediante seis contactos: Home, mapas, menciones, fundamentos, modelos, preguntas, fórmulas, gráficos, diagnóstico, Express, estrellas, tutor y competencia. Se conservan morados/amarillos y el gatito oficial. No se observaron controles superpuestos ni fórmulas ilegibles en estas capturas representativas.

Las cuatro referencias se contrastaron con las vistas nativas: Rankings conserva pestañas/filtros/tarjetas; Duelos conserva tres accesos e ilustraciones; VS muestra jugadores, estrellas y reglas; Resultado muestra aciertos, ganador, cambio e historia. El contenido se desplaza en pantallas pequeñas. Top 10 reemplaza el Top 5 de ejemplo. Algunos iconos y el estadio usan SVG/CSS; no se afirma igualdad píxel por píxel con toda la ilustración.

`competition-fixture-*` contiene datos exclusivos del APK de instrumentación, sin usuarios ni resultados precargados en producción. La captura de acceso cerrado no prueba una suscripción ni un duelo alojado.

## Pendientes que requieren al titular

- **Auth:** SMTP/proveedor, dominio y retorno HTTPS/recuperación autorizados, contraseña mínima de doce caracteres y prueba del enlace en Android. Confirmación de correo habilitada; el envío público y la recuperación todavía no están verificados. `authReturnUrl` sigue sin configurar.
- **Google Play:** productos oficiales y precios acordados ($2.490 semanal, $7.990 mensual, $64.990 anual; siete días y mensualidad según elegibilidad), cuenta de servicio, secretos privados, Pub/Sub y compra de licencia auténtica con restauración/renovación/cancelación. No se activaron cobros ni Premium ficticio.
- **Apertura:** comprobar dos cuentas con compras verificadas en el proyecto alojado; URLs definitivas de privacidad/eliminación, firma comercial y aprobación en un teléfono físico.
- **Operación:** credenciales administrativas y destino privado para programar respaldos, conservar aparte la clave de recibos y ensayar un proyecto alojado aislado. La recuperación aprobada usa PostgreSQL desechable. Vigilar cuotas: 200 usuarios activos es una meta de diseño, no capacidad medida.

La configuración exacta está en [competition-operations.md](competition-operations.md). Los conectores disponibles no configuran SMTP/secretos ni Google Play Console; completar esos paneles requiere autorización de navegador. El banco offline puede extraerse: límites y reservas reducen abuso, pero no garantizan impedir extracción o colaboración.

## Commits principales

- [a37c1bd](https://github.com/josevillablanca30/PreparaTupaes/commit/a37c1bdf8422eb2523d2c7559d7039979002b091): Billing, verificador, eventos y rc2.
- [5741c83](https://github.com/josevillablanca30/PreparaTupaes/commit/5741c83139cc7c9ccd5d28d0111eef4edc476ced): Kotlin y ciclo de vida WebView.
- [6a5287a](https://github.com/josevillablanca30/PreparaTupaes/commit/6a5287a4812db10b5c2ac60d8b983db9024f32c5): recuperación de compras, permisos y respaldo.
- [677f73c](https://github.com/josevillablanca30/PreparaTupaes/commit/677f73c676b2c3654915e83e3794303d5f51443b): recuperación PostgreSQL completa.
- [037b863](https://github.com/josevillablanca30/PreparaTupaes/commit/037b863f1a21b5055392fcfd9ae32e291542da10): sincronización de capturas y fuente exacta de la APK.
