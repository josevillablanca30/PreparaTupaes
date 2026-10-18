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

Se eliminó el disparador push duplicado del workflow Pages para esta rama: se conserva validación completa por PR, push en main y ejecución manual. Android mantiene su compilación y pruebas. Un push de aplicación con PR abierto debe iniciar dos workflows, en lugar de los tres anteriores. Un cambio solo documental no debe iniciar CI. Si se cierra el PR y se sigue programando en esta rama, ejecutar Pages manualmente o abrir el PR antes de considerar validado el código.

La migración, sus límites y puertas de aprobación están en `proteccion-distribucion-2026-10-18.md`. No se cambió visibilidad ni se creó Cachaste-Public.

## Siguiente acción precisa

1. Registrar SHA remoto de este bloque y resultados de sus nuevos runs: las cifras anteriores de navegador/Android no validan automáticamente el catálogo ampliado.
2. Reconciliar las 37 diferencias, empezando por SCI-044 y SCI-063 y cruzando las 24 reformulaciones editoriales con main. Diseñar revisión de evaluaciones antes de cambiar alternativas que ya pueden tener historial.
3. Revisar las 58 alertas de pasos breves y las variantes por independencia real; continuar matriz de cobertura oficial de las cinco materias.
4. Implementar y probar respaldo/recuperación del progreso y arquitectura de compras antes de un piloto comercial. El contrato de suscripciones es diseño, no cobro ni control Premium implementado.
5. Aplicar el protocolo de estudiante solo tras cerrar sus condiciones de entrada. No hay resultados ni testimonios.

No hay versión candidata comercial aprobada, publicación en tienda ni cobros reales.
