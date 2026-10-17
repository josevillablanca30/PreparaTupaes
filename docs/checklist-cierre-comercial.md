# Checklist de cierre — ¿Cachaste?

Actualizado: 17 de octubre de 2026.  
Repositorio: `main`.  
Criterio: solo se marca **Hecho** con evidencia reproducible; una prueba estructural no reemplaza revisión pedagógica, legal ni visual.

## 1. Producto y alcance

- [x] Existe una app móvil con M1, M2, Competencia Lectora, Ciencias e Historia.
- [x] Ciencias ofrece elección de mención.
- [x] Hay práctica, sesiones por niveles, progreso local y módulos tradicionales.
- [ ] Congelar la promesa comercial: año de admisión, pruebas cubiertas y diferencias explícitas entre práctica, diagnóstico y ensayo formativo.
- [ ] Recorrer de inicio a fin todas las tareas principales de estudiante y corregir rutas muertas, pantallas inconsistentes y estados sin salida.

## 2. Material PAES y cobertura oficial

- [x] Material PAES de Google Drive está declarado como base principal de investigación.
- [x] Se documentó un snapshot de metadatos: 128 carpetas visitadas, 635 elementos listados y 495 PDF reconocidos.
- [ ] Completar el índice recursivo de Drive, incluyendo niveles no recorridos, carpetas con más de 100 elementos, versiones y duplicados.
- [ ] Clasificar cada archivo por prueba, materia, proveedor, año/versión y formato; registrar si se pudo leer o revisar visualmente.
- [ ] Verificar el temario DEMRE vigente, separado por M1, M2, Competencia Lectora, cada módulo de Ciencias e Historia.
- [ ] Construir matriz de cobertura objetivo → unidad → nivel → preguntas para las cinco pruebas y menciones.
- [ ] Cerrar brechas de cobertura y distribución por eje, habilidad y dificultad sin rellenar con material fuera de temario.
- [ ] Añadir trazabilidad de cada pregunta original: fuente Drive y página/sección de referencia, objetivo oficial, ID de pregunta y revisor.

## 3. Calidad pedagógica y derechos

- [x] Hay auditoría automática estructural para los cinco bancos.
- [x] El último informe de referencia contó 623 preguntas y no reportó fallas críticas; registró dos alertas heurísticas breves de M1 que se revisaron manualmente.
- [ ] Revalidar todos los bancos después de los cambios más recientes y guardar informe con fecha y commit.
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
- [ ] Ejecutar de nuevo pruebas de lógica, auditoría pedagógica, build web y Playwright después de los commits recientes.
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
| 17-10-2026 | Snapshot de Drive incorporado al inventario | 128 carpetas, 495 PDF reconocidos; no exhaustivo |

