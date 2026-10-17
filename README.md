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

Las preguntas publicadas deben ser originales, con respuesta comprobada y explicación específica para cada alternativa. Los archivos de terceros se usan como referencia y no se reproducen en la aplicación sin autorización. El informe [Biblioteca Drive como referencia principal](docs/fuentes-drive-m1-2026.md) documenta el inventario realizado para M1; la clasificación de la biblioteca y la revisión equivalente del resto de las materias siguen pendientes.

La auditoría automática de los bancos detecta problemas estructurales, claves inválidas y explicaciones faltantes. **No certifica por sí sola la corrección conceptual, la alineación completa con DEMRE, la dificultad ni los derechos de uso.**

## Estado del producto

**Todavía no está aprobado como producto comercial ni como versión final para estudiantes.** La última beta verificada en los reportes es M1 v0.6, de octubre de 2026. Desde entonces se integraron las cinco materias al paquete, una experiencia de aprendizaje por niveles, misiones iniciales y seis poses del gatito. La animación reciente reutiliza esas poses con movimiento CSS suave.

En el commit `c467dcaae1d3bea8271c7d1c6f698e64e9a70410`, la validación web y móvil pasó, y el flujo Android compiló e instaló la APK en un emulador. Pasó la comprobación sin red, guardado local y botón Atrás. Es una prueba automatizada en emulador; todavía no hay validación en un teléfono físico.

La auditoría estructural más reciente (commit `6afb7c3116df835378b52b789ab7044da30ffaa8`, 17 de octubre de 2026) cubre 623 preguntas de las cinco materias y registra **0 fallas críticas y 2 alertas heurísticas** de enunciado breve (M1-210 de potencias y M1-224 de inecuaciones). Revisé ambos casos: son preguntas concisas con operación, alternativas, clave y explicación; el detector no evalúa suficiencia pedagógica. La auditoría no certifica corrección conceptual, cobertura exhaustiva del temario ni derechos de uso.

La publicación de Pages no pudo completarse: el job de validación pasó, pero el job de despliegue falló porque Pages aún no está habilitado en la configuración del repositorio.

### Bloqueos para cerrar la versión comercial

1. Terminar la clasificación del material de Drive para las cinco materias y verificar cobertura con sus temarios DEMRE.
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
- [Fuentes y protocolo para Drive](docs/fuentes-drive-m1-2026.md)
- [Contrato para importar preguntas](content/README.md)
