# ¿Cachaste? 💜

Aplicación chilena para aprender y practicar los contenidos de la PAES. El proyecto integra **Matemática M1, Matemática M2, Competencia Lectora, Ciencias e Historia y Ciencias Sociales** en una experiencia móvil que puede funcionar sin conexión.

## Experiencia de aprendizaje

- La pantalla inicial permite elegir materia y la experiencia diaria organiza objetivos en cursos, unidades y niveles.
- El gatito guía la sesión con poses para explicar, pensar, celebrar y acompañar.
- En Matemática hay lecciones base con apoyos visuales para comenzar desde los fundamentos.
- El progreso y las respuestas se guardan en el dispositivo mediante almacenamiento local.
- Los módulos tradicionales incluyen diagnósticos, prácticas y ensayos formativos. Sus instrucciones y cantidad de preguntas se revisan por materia; no deben presentarse como ensayos oficiales.

Los módulos se empaquetan en una aplicación Android WebView con recursos locales. Las cinco materias están contempladas en el flujo de construcción; cada banco y experiencia requiere su propia validación pedagógica y funcional.

## Contenidos y fuentes

La carpeta de **Material PAES** en Google Drive es la base principal de investigación y desarrollo. El temario DEMRE Regular vigente define qué contenidos incluir. El material de otras instituciones sirve para estudiar habilidades, métodos y errores frecuentes, después de comprobar que corresponda al temario actual.

Las preguntas publicadas deben ser originales, con respuesta comprobada y explicación específica para cada alternativa. Los archivos de terceros se usan como referencia y no se reproducen en la aplicación sin autorización. El [inventario general de Material PAES](docs/inventario-drive-material-paes-2026-10.md) registra la estructura por materia y proveedor observada en Drive; el [informe de fuentes para M1](docs/fuentes-drive-m1-2026.md) documenta la revisión específica de M1. El recorrido recursivo de metadatos del 17-10-2026 cubrió 143 carpetas accesibles y reconoció 513 PDF; todavía falta revisar los documentos, comprobar versiones/cobertura y registrar la trazabilidad archivo-página-pregunta para las cinco materias.

La auditoría automática de los bancos detecta problemas estructurales, claves inválidas y explicaciones faltantes. **No certifica por sí sola la corrección conceptual, la alineación completa con DEMRE, la dificultad ni los derechos de uso.**

## Estado del producto

**Todavía no está aprobado como producto comercial ni como versión final para estudiantes.** El último reporte histórico de producto describe M1 v0.6; el flujo automatizado del 17 de octubre produjo y probó una beta 1.3.0 con las cinco materias, la experiencia por niveles, misiones iniciales y seis poses del gatito. La animación reutiliza esas poses con movimiento CSS suave, y la validación actual aún requiere revisión humana y en teléfono físico.

En el commit `6afb7c3116df835378b52b789ab7044da30ffaa8`, el flujo de GitHub Actions pasó pruebas de lógica y contenido, auditoría de los cinco bancos, build web, uso táctil y vista de 320 px. También compiló la APK beta, comprobó su firma, instaló la aplicación en un emulador y pasó modo sin red, persistencia local y botón Atrás. La verificación es automatizada en emulador; falta validarla en un teléfono físico. La APK beta se firma con la clave de pruebas y no es una firma de distribución comercial.

La auditoría estructural más reciente (commit `6afb7c3116df835378b52b789ab7044da30ffaa8`, 17 de octubre de 2026) cubre 623 preguntas de las cinco materias y registra **0 fallas críticas y 2 alertas heurísticas** de enunciado breve (M1-210 de potencias y M1-224 de inecuaciones). Revisé ambos casos: son preguntas concisas con operación, alternativas, clave y explicación; el detector no evalúa suficiencia pedagógica. La auditoría no certifica corrección conceptual, cobertura exhaustiva del temario ni derechos de uso.

La publicación de Pages no pudo completarse: el job de validación pasó, pero el job de despliegue falló porque Pages aún no está habilitado en la configuración del repositorio.

### Bloqueos para cerrar la versión comercial

1. Completar el inventario recursivo de Drive y la trazabilidad archivo-página-pregunta para las cinco materias; verificar cobertura con sus temarios DEMRE vigentes.
2. Completar la revisión humana de preguntas, respuestas, distractores, explicaciones, dificultad y derechos de uso en cada banco.
3. Revisar visualmente la experiencia completa en Android y comprobar continuidad de progreso, navegación, accesibilidad y funcionamiento sin conexión.
4. Habilitar GitHub Pages en **Settings → Pages → Build and deployment → Source: GitHub Actions**. El primer encendido requiere acceso del propietario; después, el flujo puede publicar y verificar el sitio.
5. Preparar una firma Android de distribución estable, separar credenciales de prueba y producción y validar la instalación/actualización en un equipo real antes de distribuirla.
6. Definir cómo se entregará soporte, privacidad y manejo de datos. Hoy no hay cuentas ni sincronización en la nube; el progreso queda en el dispositivo. El tutor entrega explicaciones escritas, no respuestas generadas por una IA en vivo.

No se declara una fecha de lanzamiento ni un puntaje predictivo. Los ensayos son formativos y no equivalen a una prueba oficial DEMRE.

## Probar en desarrollo

Abrir `index.html` en un navegador o ejecutar:

```bash
npm ci
npm run test:logic
npm run audit:pedagogy
npm run build
npx playwright install --with-deps chromium webkit
npm test
```

Node y Playwright se usan para empaquetar y probar. La aplicación web no requiere dependencias remotas para cargar sus recursos locales.

## Publicación web

El flujo `.github/workflows/pages.yml` valida los cambios de código en `main` y en pull requests. Si las verificaciones pasan, publica `dist/` en GitHub Pages y comprueba que el sitio sirva el mismo commit.

URL prevista, aún sujeta a habilitar Pages y completar el despliegue: https://josevillablanca30.github.io/PreparaTupaes/

## Reportes

- [QA Android y móvil de M1 v0.6](docs/qa-ci-apk-cachaste-2026-10-13.md)
- [Cierre funcional y controles QA de M1](docs/m1-cierre-funcional-2026.md)
- [Estabilidad de progreso y repaso](docs/qa-m1-estabilidad-2026-10-13.md)
- [Expansión de gráficos y tutor](docs/qa-m1-expansion-100-2026-10-13.md)
- [Inventario recursivo de metadatos de Material PAES en Drive](docs/inventario-drive-material-paes-2026-10.md)
- [Checklist de cierre comercial](docs/checklist-cierre-comercial.md)
- [Fuentes y protocolo para Drive](docs/fuentes-drive-m1-2026.md)
- [Contrato para importar preguntas](content/README.md)
