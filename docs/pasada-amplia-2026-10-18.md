# Pasada amplia · 18 de octubre de 2026

## Resultado implementado

Se añadieron **50 ejercicios originales** a los 730 del checkout previo: M2 1, Historia 12 y Ciencias 37. Total: 780. Los lotes 11–13 registran la base, la tarea anterior, la tarea nueva, el eje y páginas oficiales, archivo y sección de Drive, tres pasos y explicación de los tres distractores. No se reproducen preguntas de las editoriales.

- M2: media de grupos de distinto tamaño, para evaluar el error de promediar medias sin ponderación.
- Historia: recursos comunes, descolonización, causas y detonantes de la Gran Guerra, transmisión de la Depresión, liberalismo, colonialismo, demanda, salitre, cobre, ocupación de la Araucanía, PIB y Plan Marshall.
- Ciencias: grupos funcionales, soluciones, modelos atómicos, óptica, electricidad, movimiento, meiosis, absorción, genética, variables y evidencia. Doce casos del módulo común aseguran que la segunda familia esté disponible dentro de cada mención.

La reducción global es de **42 a 7 conceptos sin segunda familia**. Los siete restantes son complementarios. Al filtrar por alcance, hay **270 conceptos PAES sin brechas de segunda familia**, también verificados por ruta. Esto no acredita cobertura íntegra del temario ni validación pedagógica externa.

## Correcciones del motor y del tutor

1. La transferencia hereda `examEligible` y `supplementary`; se corrigieron seis casos de Ciencias que estaban etiquetados como evaluables pese a proceder de contenido complementario.
2. Ahorro periódico y diversificación financiera de Historia se conservan como complementarios: no se encontró un objetivo explícito correspondiente en el temario oficial de Historia consultado.
3. La práctica general y los ensayos nuevos excluyen complementarios. Las lecciones exclusivamente complementarias siguen disponibles al elegirlas. Los conceptos mixtos usan su evidencia PAES.
4. M2 e Historia tradicionales consumen el mismo catálogo ampliado y mantienen IDs, sesiones e historial; se verifican ensayos completos de 55 y 65 preguntas.
5. `why` y el ejemplo serializado de una transferencia corresponden a su explicación vigente. El ejemplo serializado incluye su resolución, evitando que la auditoría mida únicamente el largo del enunciado.
6. Se reescribieron cuatro variantes previas (elipse de Kepler, ciclo menstrual, fracción molar y homología) y se corrigieron explicaciones invertidas de dos distractores de porcentajes sucesivos.
7. Se redactaron ejemplos específicos de aldehídos/cetonas, ésteres/éteres y moléculas multifuncionales. Se ajustaron tres atribuciones de fuente/eje en el lote 10.

## Fuentes consultadas

Alcance: temarios oficiales **PAES Regular 2026 / Admisión 2027** de Ciencias, M2 e Historia publicados en acceso.mineduc.cl. M2 incluye los conocimientos M1 indicados en su temario; la guía de estadística M1 se usa como referencia conceptual, sin atribuirle una dificultad M2 validada.

| Material de Drive | Uso en esta pasada |
|---|---|
| CPECH, Historia del siglo XIX | Liberalismo, economía salitrera, colonialismo y expansión territorial |
| CPECH, Historia del siglo XX | Guerras mundiales, Depresión, descolonización, cobre y Plan Marshall |
| CPECH, Sistema económico | Mercado, demanda, producción y PIB |
| TESLA, M1 6 Estadística I | Media y ponderación por frecuencia |
| PDV, Compendio 4 Química Orgánica | Conectividad y grupos funcionales |
| PDV, Compendio 2 Estequiometría y Disoluciones | Mol, proporciones, dilución y concentración |
| PDV, Compendio 1 Átomo, Tabla Periódica y Enlace | Modelos, partículas, número atómico y másico |
| CPECH, Física Plan Común | Método científico, ondas, movimiento, fuerzas y lentes |
| PDV, Cuaderno 5 Electricidad | Potencia, circuitos y función de componentes |
| PDV, Compendio de ondas, espejos y lentes | Refracción y Doppler electromagnético |
| CPECH, Biología Plan Común | Absorción y microvellosidades, genética, evolución y fotosíntesis |
| FILADD, Eje 3-2 Meiosis | Separación cromosómica y recombinación |
| FILADD, Eje 2-1 Sexualidad humana | Reproducción y comparación de mecanismos anticonceptivos |

Los identificadores exactos y secciones están en cada `sourceTrace` de los lotes. Se comprobó que existieran en el inventario de Drive; se leyeron secciones pertinentes, no todos los libros completos. Los datos experimentales y ejemplos numéricos nuevos son didácticos, no resultados de estudios reales.

## Verificación y límite de entrega

- 214 pruebas lógicas aprobadas; build correcto; `git diff --check` limpio.
- Auditoría estructural: 780 preguntas, 0 errores críticos, 134 observaciones de revisión.
- 741 recorridos Playwright aprobados en CI sobre `c59a80e`; 88 pruebas rápidas y 8 pruebas nativas Android aprobadas en la misma revisión.
- No se declara la aplicación comercialmente terminada ni se solicita prueba al usuario con una APK anterior.

## Envío y validación remota de esta pasada

El usuario autorizó el 18/10/2026 subir esta pasada a `work/cachaste-motor-duolingo-20261016` del repositorio público `josevillablanca30/PreparaTupaes`. La publicación se limita a la rama de trabajo y sus comprobaciones internas. La revisión de navegador y del APK debe corresponder a ese código; los resultados locales son 214 pruebas lógicas aprobadas, build correcto y cero errores críticos estructurales.

La autorización resuelve el rechazo automático inicial. El checkout no dispone de credenciales para `git push`; se utiliza el conector de GitHub con comprobación de árbol y actualización sin forzar. La fusión y el despliegue de `main` siguen sujetos a los criterios de cierre.


## Seguimiento de la validación móvil (18/10/2026)

El código de aplicación `2dbdd7a` aprobó las 88 pruebas rápidas de navegador y las 8 pruebas nativas en Android 36 del run [39108072965](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39108072965). Se comprobaron 32 recursos del APK contra el build de esa revisión.

La batería completa inicial pasó 735 pruebas y detectó el mismo supuesto desactualizado en Historia en los tres dispositivos: HIS-001 ya dispone de TR-HIS-007, pero el escenario esperaba un banco agotado. La revisión `c59a80e` cambia únicamente la prueba: cubre tanto el refuerzo disponible como el agotamiento de todas las variantes recientes. El motor de aplicación permanece idéntico. La nueva batería contiene 741 casos.

Se inspeccionó una muestra de capturas de Android, iPhone y 320 px: materias, mapa, fundamentos, pregunta, retroalimentación y tutor. Esta revisión visual no reemplaza el pilotaje ni la revisión editorial completa. La evidencia estructurada está en `reports/qa-pasada-2026-10-18.json`.

Resultado final: **741 aprobadas, 0 fallidas** en [CI de navegador 39128171811](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39128171811), con duración de 10,1 minutos. [Android 39128171791](https://github.com/josevillablanca30/PreparaTupaes/actions/runs/39128171791) también aprobó sobre `c59a80e`. El despliegue de producción quedó omitido por tratarse de la rama de trabajo. Las modificaciones posteriores a esa revisión son únicamente documentación y evidencia.
