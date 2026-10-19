# ¿Cachaste? 💜

Aplicación offline de preparación PAES con Matemática M1 y M2, Competencia Lectora, Ciencias e Historia. La experiencia usa rutas progresivas, diagnóstico, práctica, ensayos formativos y tutoría explicada. El contenido y el progreso se guardan localmente.

## Estado real del proyecto · 18/10/2026

- **788 preguntas:** 631 del banco original y 157 de transferencia. Se recuperaron ocho ejercicios M2 existentes en main sin alterar las 780 evaluaciones anteriores.
- **755 preguntas de alcance PAES y 33 complementarias.** Las complementarias se conservan para práctica opcional e historial, y quedan fuera de la selección general y los ensayos nuevos.
- **287 conceptos organizados**, de los cuales 270 tienen preguntas de alcance PAES. Estos 270 disponen de al menos dos familias en el catálogo. La misma comprobación pasa por separado para Biología, Física, Química y TP.
- Los **7 conceptos que aún tienen una sola familia pertenecen al contenido complementario**. Dos familias registradas no certifican independencia semántica, profundidad ni cobertura completa del temario oficial: esas revisiones siguen siendo necesarias.
- **217 pruebas lógicas aprobadas**, compilación web correcta y auditoría estructural con **0 errores críticos y 82 observaciones heurísticas**. Las observaciones no son errores confirmados ni una certificación editorial.
- **744/744 pruebas de navegador aprobadas** en Android Chrome, iPhone WebKit y 320 px sobre `17974df`. Android también aprobó 88 pruebas rápidas y 8 pruebas nativas en esa revisión.

Estado reproducible: [matriz actual](reports/readiness-current.json), [pasada amplia](docs/pasada-amplia-2026-10-18.md) y [criterios de cierre](docs/criterios-cierre-profesional-2026.md).

El código no está declarado como versión comercial aprobada. Los bancos son material formativo original; no son ítems oficiales DEMRE ni un instrumento psicométrico validado. Falta revisión pedagógica integral y pilotaje. No hay cuentas ni sincronización entre dispositivos.

## Experiencia y materias

- **M1:** empieza desde fundamentos, avanza por Números, Álgebra y funciones, Geometría, y Probabilidad y estadística. Incluye diagnóstico, Express, ensayo formativo, tutor y refuerzo.
- **M2:** banco y recorrido propios, separados de M1.
- **Competencia Lectora:** textos originales con preguntas de Localizar, Interpretar y Evaluar.
- **Ciencias:** Biología, Física y Química; selección de mención y modalidad TP.
- **Historia:** recorrido propio con preguntas y tutor.

Las sesiones de ensayo no muestran respuestas ni pistas antes de entregar. La app diferencia respuestas seguras, dudosas y al azar. Un acierto con ayuda no prueba dominio.

## Ejecutar

```bash
npm ci
npm run test:logic
npm run audit:pedagogy
npm run build
```

Para las pruebas de interfaz, instalar los navegadores de Playwright y ejecutar:

```bash
npx playwright install --with-deps chromium webkit
npm test
```

La app no necesita dependencias en el navegador. Node y Playwright se usan para construir y verificar el proyecto.

## Publicación web y Android

El workflow de GitHub Actions valida el código y, si está habilitado GitHub Pages en Settings → Pages con origen GitHub Actions, publica `dist/` desde `main` después de las verificaciones. La URL prevista es <https://josevillablanca30.github.io/PreparaTupaes/>; solo se debe considerar activa cuando un despliegue exitoso y la prueba HTTPS confirmen el mismo commit.

El APK disponible en CI es de prueba. Antes de distribuirlo hay que verificar la compilación e instalación del artefacto vigente, configurar una firma de publicación estable y probarlo en teléfono físico. Los APK debug de distintos runners pueden no permitir actualización entre sí.

## Prioridades de cierre

1. Revisar independencia real y cobertura de habilidades de los 270 conceptos de alcance PAES; la puerta de dos familias ya pasa por materia y por mención.
2. Revisar individualmente explicaciones, claves y distractores de las cinco materias; las alertas automáticas no reemplazan esa revisión.
3. Completar pruebas de interfaz y Android en CI, recuperar una ejecución de Playwright con navegadores disponibles y comprobar instalación offline.
4. Pilotear con estudiantes y cerrar firma, publicación y sincronización si el producto lo requiere.

La aplicación no reproduce preguntas de editoriales ni de DEMRE. Los materiales de Drive son referencias de secuencia y objetivos; cualquier reproducción requiere autorización comprobada.

## Envío y validación remota de esta pasada

El usuario autorizó el 18/10/2026 subir esta pasada a `work/cachaste-motor-duolingo-20261016` del repositorio público `josevillablanca30/PreparaTupaes`. La publicación se limita a la rama de trabajo y sus comprobaciones internas. La revisión de navegador y del APK debe corresponder a ese código; los resultados locales son 214 pruebas lógicas aprobadas, build correcto y cero errores críticos estructurales.

La autorización resuelve el rechazo automático inicial. El checkout no dispone de credenciales para `git push`; se utiliza el conector de GitHub con comprobación de árbol y actualización sin forzar. La fusión y el despliegue de `main` siguen sujetos a los criterios de cierre.


Seguimiento de CI, regresión de Historia y muestra visual: [informe de esta pasada](docs/pasada-amplia-2026-10-18.md).


Revisión editorial posterior: 33 soluciones de Ciencias reescritas, retroalimentación de M2-007 ampliada y 44 alertas clasificadas. [Detalle y pendientes](docs/revision-editorial-2026-10-18.md). Las cifras de CI de `c59a80e` corresponden al cierre anterior; la nueva revisión de contenido es `69ad25a`.

Continuidad del 18/10: [reconciliación y punto de continuación](docs/continuidad-maestra-2026-10-18.md). La validación del catálogo de 788 preguntas se registra allí por separado.

Último lote editorial: otras 20 secuencias de Ciencias revisadas; 82 alertas heurísticas restantes. Las pruebas completas de este lote se registran por revisión en el documento de continuidad.
