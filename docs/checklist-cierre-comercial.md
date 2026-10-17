# Checklist de cierre — ¿Cachaste?

Actualizado: 17 de octubre de 2026.  
Repositorio: `main`.  
Criterio: solo se marca **Hecho** con evidencia reproducible; una prueba estructural no reemplaza revisión pedagógica, legal ni visual.

## 1. Producto y alcance

Meta de cierre: 31 de octubre de 2026, para habilitar el uso durante noviembre. La PAES Regular 2026 se rinde el 30 de noviembre, 1 y 2 de diciembre. La secuencia y criterios de salida están en [plan de cierre](plan-cierre-31-octubre-2026.md).

- [x] Existe una app móvil con M1, M2, Competencia Lectora, Ciencias e Historia.
- [x] Ciencias ofrece elección de mención.
- [x] Hay práctica, sesiones por niveles, progreso local y módulos tradicionales.
- [ ] Congelar la promesa comercial: año de admisión, pruebas cubiertas y diferencias explícitas entre práctica, diagnóstico y ensayo formativo.
- [ ] Recorrer de inicio a fin todas las tareas principales de estudiante y corregir rutas muertas, pantallas inconsistentes y estados sin salida.

## 2. Material PAES y cobertura oficial

- [x] Material PAES de Google Drive está declarado como base principal de investigación.
- [x] Se recorrieron recursivamente todas las carpetas accesibles de la carpeta principal: 143 carpetas, profundidad 4, 668 elementos listados, 513 PDF identificados y 0 errores de listado.
- [x] Completar el recorrido recursivo de la estructura accesible: sin errores y ninguna carpeta alcanzó el tope de 200 elementos por consulta.
- [x] Contrastar M2 contra el temario Regular 2027 y ampliar el banco con probabilidad condicionada y contextos hipotéticos de finanzas; preguntas originales M2-107–110 con tutor y distractores propios.
- [x] Cerrar dos brechas iniciales con preguntas M2-111 (lectura de gráfico exponencial) y M2-112 (secantes desde punto exterior); ambas tienen tutor y explicación por alternativa.
- [x] Crear una primera matriz M2 2027 enlazada a IDs actuales; identificar brechas explícitas y separar presencia de cobertura validada: [cobertura-m2-2027.md](cobertura-m2-2027.md).
- [ ] Preparar un catálogo duradero y revisable de los 668 elementos listados (513 PDF y carpetas) con título, ruta, tipo, proveedor, versión y estado de lectura; detectar duplicados y cambios posteriores.
- [ ] Clasificar cada archivo por prueba, materia, proveedor, año/versión y formato; registrar si se pudo leer o revisar visualmente.
- [ ] Verificar el temario DEMRE vigente, separado por M1, M2, Competencia Lectora, cada módulo de Ciencias e Historia.
- [ ] Completar matrices de cobertura objetivo → unidad → nivel → preguntas para las cinco pruebas y menciones; la primera matriz M2 es exploratoria y todavía no está revisada por persona experta.
- [ ] Cerrar brechas M2 (incluida cobertura heredada M1) y distribución por eje, habilidad y dificultad sin rellenar con material fuera de temario.
- [ ] Añadir trazabilidad de cada pregunta original: fuente Drive y página/sección de referencia, objetivo oficial, ID de pregunta y revisor.

## 3. Calidad pedagógica y derechos

- [x] Hay auditoría automática estructural para los cinco bancos.
- [x] El último informe de referencia contó 623 preguntas y no reportó fallas críticas; registró dos alertas heurísticas breves de M1 que se revisaron manualmente.
- [x] Revalidar los bancos tras añadir cuatro preguntas originales a M2: 627 ítems, 0 alertas críticas y 2 alertas heurísticas; 158/158 pruebas lógicas y build local aprobados.
- [x] Revalidar tras añadir M2-111–112: 158/158 pruebas lógicas, auditoría 629 ítems (0 críticas, 2 heurísticas), `npm run build` y `git diff --check` aprobados.
- [ ] Hacer revisión conceptual humana completa y guardar sus decisiones por pregunta.
- [ ] Revisar conceptualmente cada respuesta, procedimiento, unidad, gráfico y alternativa.
- [ ] Confirmar que cada distractor represente un error plausible y que cada explicación responda por qué esa alternativa se acepta o descarta.
- [ ] Revisar duplicados, variaciones insuficientes, repetición adaptativa y balance de dificultad.
- [ ] Resolver la lista de refuerzo con preguntas nuevas que midan el mismo objetivo; confirmar que no recicle la pregunta fallada.
- [ ] Revisar diagnóstico, recomendaciones y resultados para que comuniquen límites y un plan de estudio útil.
- [ ] Confirmar autorización escrita para cualquier elemento de terceros que se quiera reproducir; mantener original el contenido publicado mientras no exista permiso.

## 4. Experiencia, accesibilidad y personaje

- [x] La ruta diaria organiza materias, unidades y niveles.
- [x] Se añadió progreso de dominio por etapa y una salida al recorrido completo al terminar la última unidad.
- [x] El gatito usa poses existentes con movimiento CSS por estado; caminar y celebrar recibieron animaciones adicionales.
- [ ] Revisar visualmente todas las pantallas en Android/iPhone y anchos de 320 px, incluyendo diagnóstico, tutor, resultados, progreso, Ciencias y ensayos.
- [ ] Comprobar que navegación atrás, continuar sesión, cambio de materia y progreso guardado sean comprensibles y consistentes.
- [ ] Revisar lector de pantalla, foco, contraste, tamaños táctiles, errores y movimiento reducido.
- [ ] Diseñar e integrar fotogramas adicionales del gatito respetando la hoja de poses aprobada; validar recortes, estados y carga sin conexión.
- [ ] Unificar celebración, transiciones y retroalimentación de todas las materias bajo un solo sistema visual; revisar con pruebas reales antes de declarar pulido.

## 5. Estabilidad técnica y calidad

- [x] Existe flujo de build web, auditoría de contenido, pruebas automatizadas móviles y empaquetado Android beta.
- [x] La última validación histórica registrada pasó lógica, auditoría, build, viewport de 320 px, WebView, uso sin conexión, persistencia y navegación Atrás en emulador.
- [x] Ejecutar `npm ci`, pruebas de lógica (158/158), auditoría de bancos (623 preguntas, 0 críticas y 2 alertas) y build web en el commit `e96360c`.
- [ ] Completar Playwright móvil en Chromium y WebKit; en esta ejecución local no fue posible descargar los navegadores desde el CDN.
- [ ] Instalar y recorrer las cinco pruebas en un teléfono físico; registrar modelo, sistema y resultados.
- [ ] Probar pérdida de almacenamiento, sesiones interrumpidas, volver desde el sistema, teclado/zoom y conectividad intermitente.
- [ ] Confirmar que la app completa se abre y funciona sin red en Android, incluyendo fuentes, ilustraciones, datos y páginas enlazadas.
- [ ] Revisar dependencias, permisos Android, manifiesto, orientación, ícono, nombre y versión antes de publicar.

## 6. Publicación y operación comercial

- [ ] Habilitar GitHub Pages en la configuración del repositorio y desplegar el commit validado; revisar URL pública y HTTPS.
- [ ] Preparar firma Android de distribución controlada por el propietario; nunca incluir claves privadas en GitHub.
- [ ] Firmar release, validar instalación/actualización en dispositivo real y conservar procedimiento seguro de recuperación de la clave.
- [ ] Definir responsable, canal y tiempos de soporte.
- [ ] Publicar aviso de privacidad y explicar almacenamiento local, retención, borrado y cualquier analítica futura.
- [ ] Confirmar identidad comercial, términos de uso, política de contenidos y descripción de que no es producto oficial DEMRE.
- [ ] Definir estrategia y costos de distribución (APK web y/o tiendas); completar fichas, capturas y requisitos de cada canal.
- [ ] Hacer checklist de lanzamiento con versión, fecha, commit, APK, reporte QA y rollback.

## Pendientes que requieren acceso o decisión del propietario

- Activar GitHub Pages en Settings → Pages → Build and deployment → GitHub Actions.
- Facilitar un teléfono físico para validación o ejecutar el protocolo de QA y compartir resultados.
- Mantener la custodia de la clave de firma de producción y decidir canal de publicación.
- Aportar permisos comerciales si se reproducirá contenido protegido y definir responsable de soporte/privacidad.

## Registro de avances

| Fecha / commit | Avance | Evidencia / estado |
| --- | --- | --- |
| 17-10-2026 · `8cb1941` | Movimiento de caminar y doble salto de celebración del gatito | Código guardado; sin resultado CI reportado en la consulta |
| 17-10-2026 · `bea865e` | Pulso suave para destacar el siguiente nivel | Código guardado; sin resultado CI reportado en la consulta |
| 17-10-2026 · `e2e3ad3` | Indicador accesible de dominio por etapa y navegación tras última unidad | `node --check daily-app.js` pasó |
| 17-10-2026 · `84fcd70` | Diseño adaptable de barra de progreso | CSS balanceado; CI pendiente de confirmar |
| 17-10-2026 | Recorrido recursivo de Drive actualizado | 143 carpetas, 668 elementos, 513 PDF; metadatos solamente, sin lectura de contenido |
| 17-10-2026 · `6541b5b` → `997cd31` → `12a01cc` | M2 crece de 106 a 110 preguntas con probabilidad condicional y finanzas hipotéticas | 158/158 pruebas lógicas, auditoría 627 (0 críticas/2 heurísticas) y build pasan; se consultó Drive y no se copiaron preguntas. |
| 17-10-2026 · `0282a08` | M2 crece a 112 preguntas; se cubre lectura gráfica exponencial y relación de secantes exteriores; se actualiza currículo y tutor | 158/158 pruebas lógicas, auditoría 629 (0 críticas/2 heurísticas), build y diff check pasan. Revisión editorial humana independiente, CI y QA de navegador pendientes. |

