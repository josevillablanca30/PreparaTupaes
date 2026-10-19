# Continuidad maestra · 18 de octubre de 2026

## Estado recuperado antes de editar

Se descargaron las siete ramas y todo el historial (el checkout era superficial). `reports/branches-2026-10-18.json` registra las revisiones. Main `560e48c` y trabajo `69ad25a` han divergido: 103 y 248 commits exclusivos respectivamente. No se fusionaron. PR #5 sigue abierto contra quests; #2 abierto contra main; #3 experimental sigue excluido de integración; #4 cerrado sin fusionar y #1 fusionado previamente. Las ramas diario, respaldo y quests ya son antecesoras de trabajo. La rama de protección/progreso tiene cuatro commits exclusivos; sus objetivos de revisión tras error y confianza de examen ya están atendidos en trabajo y no se duplicaron.

La revisión editorial `69ad25a2535e7dfb3e2ef49b9aa1fc50f8983c6a` terminó: 214 lógicas, 741 navegador, 88 web Android, 8 instrumentadas, compilación Android. Runs 39129828864 y 39129828899, ambos exitosos. Esto cierra la incertidumbre de la sesión previa.

## Recuperación selectiva

Se incorporaron M2-107 a M2-114 desde main `560e48cb937cdced1556d86a866c10d5c8012fc7`, preservando IDs, enunciados, alternativas y claves. Se corrigieron dos explicaciones: la condición ya conocida de la primera extracción en M2-107 y la diferencia entre sumar 10% y capitalizar 1% durante tres meses en M2-108. No se reemplazó el banco completo.

La prueba de reconciliación compara una huella de las 780 evaluaciones del commit anterior con las mismas evaluaciones actuales. Comprueba también cada evaluación recuperada contra main y calcula las claves cuantitativas por separado. Resultado local: **217/217 pruebas lógicas**, build correcto, **788 preguntas, 755 PAES, 33 complementarias, 270 conceptos PAES**, **102 alertas y cero errores críticos**. Estas pruebas no certifican calidad docente.

Contraste directo del temario DEMRE Regular 2026 / Admisión 2027, consultado el 18/10: https://demre.cl/publicaciones/pdf/2027-26-03-19-temario-paes-regular-m2.pdf . M2-107 corresponde a probabilidad condicional (p. 9); M2-108–110 a matemática financiera (p. 6); M2-111, 113 y 114 a funciones exponenciales y logarítmicas (p. 7); M2-112 a relaciones de cuerdas/secantes (p. 8). Es una correspondencia temática de este lote; no demuestra cobertura exhaustiva ni dificultad PAES. El ejercicio de capitalización es un modelo didáctico, no asesoría financiera.

Hay **37 evaluaciones con diferencias entre ramas** pendientes de reconciliación, registradas en `reports/branch-content-differences-2026-10-18.json`. Varias son candidatas del triage editorial: revisar primero lo ya realizado en main. Si una alternativa cambia de significado, introducir revisión y tratamiento explícito de las respuestas antiguas. No reinterpretar índices históricos.

## Protección y CI

Respaldo completo anterior a este bloque: `Cachaste-Respaldo-Completo-20261018.tar.gz`, SHA-256 `6b09964f8ce38d6294cb3b039c5aaceb8e83f66bc29969e1313d5bcc049f10dc`. Incluye bundle de todas las referencias, manifiesto y trabajo editorial no confirmado. Se restauró como mirror, se compararon ocho referencias y pasó `git fsck --full`. No contiene ajustes de cuenta, secretos, firma privada ni datos de estudiantes.

Se eliminó el disparador push duplicado del workflow Pages para esta rama: se conserva validación completa por PR, push en main y ejecución manual. Android mantiene su compilación y pruebas. Un push de aplicación con PR abierto debe iniciar dos workflows, en lugar de los tres anteriores. Un cambio documental puede reiniciar el PR mientras el conjunto de diferencias contenga código; agrupar registro y aplicación en un solo envío. Si se cierra el PR y se sigue programando en esta rama, ejecutar Pages manualmente o abrir el PR antes de considerar validado el código.

La migración, sus límites y puertas de aprobación están en `proteccion-distribucion-2026-10-18.md`. No se cambió visibilidad ni se creó Cachaste-Public.

## Siguiente acción precisa

1. Registrar SHA remoto de este bloque y resultados de sus nuevos runs: las cifras anteriores de navegador/Android no validan automáticamente el catálogo ampliado.
2. Reconciliar las 37 diferencias, empezando por SCI-044 y SCI-063 y cruzando las 24 reformulaciones editoriales con main. Diseñar revisión de evaluaciones antes de cambiar alternativas que ya pueden tener historial.
3. Revisar las 58 alertas de pasos breves y las variantes por independencia real; continuar matriz de cobertura oficial de las cinco materias.
4. Implementar y probar respaldo/recuperación del progreso y arquitectura de compras antes de un piloto comercial. El contrato de suscripciones es diseño, no cobro ni control Premium implementado.
5. Aplicar el protocolo de estudiante solo tras cerrar sus condiciones de entrada. No hay resultados ni testimonios.

No hay versión candidata comercial aprobada, publicación en tienda ni cobros reales.

## Cierre verificado de la recuperación M2

Código `17974dfa43d720503b15254462b6b44fa4767cbe`: **217 pruebas lógicas, 744 de navegador, 88 web Android y 8 instrumentadas**, compilaciones APK beta y AAB sin firma exitosas. Runs **39156239368** (PR) y **39156234636** (Android), ambos exitosos. Deploy y verificación pública se omitieron por ser rama de trabajo. El commit inicial de recuperación fue `d7ce1037d9dbf2a30d3009fa0804f3b4d01f4c76`; sus runs fueron sustituidos por los de la corrección, no deben sumarse como validación adicional.

## Lote editorial siguiente · pendiente de CI propio

Se reescribieron otras **20 secuencias de Ciencias**: SCI-014, 015, 018, 023, 026, 028, 030, 031, 034, 039, 041, 052, 058, 059, 068, 070, 093, 094, 096 y 097. Cada una distingue datos/proceso, razonamiento y comprobación; se eliminaron las concatenaciones repetidas. Se explican errores como confundir rapidez con aceleración, porcentaje útil con pérdida, masa con moles, ángulo con la normal con ángulo respecto del espejo, y alcohol con carboxilo. Se conservan enunciados, alternativas, claves, familias y elegibilidad.

Resultado local: 217/217 pruebas, build correcto; **82 alertas heurísticas**, incluidas **38 de paso breve**, y cero errores críticos. La reducción de 20 alertas proviene de revisión de contenido, sin cambiar umbrales. Los materiales de Física y Química consultados en la revisión editorial precedente son antecedentes; no se declara nueva lectura integral de Drive en este lote ni cobertura oficial adicional.

La comparación individual de las 37 evaluaciones distintas está en `reports/reconciliation-triage-2026-10-18.json`: 28 candidatas para revisión de integración, 3 cambios equivalentes no prioritarios, 2 distractores actuales que conviene conservar y 4 casos bloqueados para importación directa (SCI-006, SCI-044, SCI-063, LEC-017). Las 37 conservan índice de clave entre ramas, pero cambian alternativas; eso no vuelve compatibles las respuestas históricas. Ninguna de esas 37 versiones de main se importó. Las decisiones son revisión editorial asistida, no certificación disciplinar.

Próxima prioridad: diseño y pruebas de revisión de evaluaciones para preservar el texto/alternativa antigua y no reutilizar evidencia incompatible; después reconciliar candidatos de main y continuar las 38 alertas de pasos breves. SCI-063 necesita tarea de hipótesis sin dos opciones defendibles; SCI-044 necesita superar el enunciado tautológico.

## Punto de continuación guardado

Último código: **`6b78278b4dbac5e38d86859a38abaf02ba63a948`**, árbol **`72493c4a764d500e8b0e0dc793b88195482bf48f`**, rama `work/cachaste-motor-duolingo-20261016`. GitHub recibió el árbol completo y la referencia se actualizó sin forzar, comprobando el SHA anterior. Checkout limpio después de sincronizar.

CI de este código iniciada y aún en curso en el último chequeo:
- Pages / PR: **39179180659**.
- Android / push: **39179177883**.

Primera acción de la siguiente continuación: consultar ambos runs y sus logs; si hay fallo, corregirlo antes del próximo lote. No atribuir al commit nuevo los 744/88/8 resultados de `17974df`. Luego continuar la revisión de evaluaciones y las 38 alertas de pasos breves. Ese supuesto resultó incorrecto para el evento pull_request: el registro documental inició otra ejecución porque el PR contiene código.

## Continuación: 18 secuencias, Lectura y aislamiento del build

Base remota inspeccionada: `782b986437526135e4e2f13725496378e462e889`. Se consultaron todas las ramas sin integrar ni modificar main. Android del lote anterior terminó correctamente: run 39179177883, 88 pruebas web, 8 instrumentadas y compilación exitosa. El run Pages 39179180659 fue cancelado por concurrencia cuando el commit documental inició 39179282012; no fue un fallo de tests y no se declara aprobado el run cancelado.

Nuevo lote: SCI-100, 103, 104, 110, 127, 131, 133, 134, 136, 152, 153, 156, 158, 174, 185, 186, 197 y 203. Las 18 secuencias ahora conectan información, razonamiento y comprobación sin repetir los pasos antiguos. Se mantuvo la elegibilidad previa: mejorar eco u otro contenido complementario no lo convierte en PAES. Se distinguen resistencia y su inverso, número atómico y másico, carga individual y neutralidad del átomo, cantidad total y electrones de valencia, y composición general frente a familia orgánica específica.

LEC-097: se leyó completo el pasaje «La escuela y el silencio digital». La comprobación ahora contrasta la excepción expresamente mencionada con alternativas que agregan motivos ausentes; evita repetir la respuesta como única explicación. No cambian texto, consigna ni alternativas.

Los materiales de Drive ya registrados son antecedentes de Física/Química; no hubo nueva lectura integral de esos volúmenes en este lote. Esta revisión de claridad no certifica cobertura curricular ni dificultad PAES.

Resultado local: **220/220 pruebas lógicas**, build correcto, **788 evaluaciones conservadas**, **63 alertas heurísticas y cero errores críticos**, con **19 alertas de paso breve** todavía pendientes. No se cambiaron umbrales de auditoría. Las pruebas de reconciliación mantienen las huellas de las 780 evaluaciones previas y de las ocho recuperadas de main.

Distribución: el build limpia solo `dist` y valida una lista de 34 archivos. Se probaron salida incompleta, archivo extra, carpeta interna y enlace simbólico; también se insertó un archivo residual ficticio y se comprobó su eliminación al recompilar. No se creó Cachaste-Public, no se cambió visibilidad y no hubo publicación comercial.

### Continuación sin reiniciar CI por documentación

Este registro se envía junto con código y pruebas. Identificar el commit que incorpora esta sección en la rama y consultar Actions por su head SHA. No añadir inmediatamente otro commit documental solo para apuntar los runs: el PR puede reiniciarse. La validación de navegador/Android de este lote está pendiente al guardar; resultados anteriores no la sustituyen.

Después de cerrar CI: quedan 19 pasos breves, las 24 reformulaciones cruzadas con main y la implementación de revisiones de evaluación antes de sustituir alternativas históricas. Empezar por el versionado y SCI-044/SCI-063, conservando los intentos originales. Compras y restauración de progreso siguen pendientes de implementación; los documentos comerciales son contratos de trabajo, no funciones ya activas.
