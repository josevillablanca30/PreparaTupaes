/* Pasada amplia: M2 y doce objetivos de Historia. Situaciones didácticas originales. */
const sources={
 statistics:['1FYzLTwZiUhP9Cr19kYCHxFK4h0uEh3aS','TESLA · M 16 Estadística I','Media aritmética y media desde frecuencias'],
 economy:['1bFruW8e2qlIYkve9LYwWeGuprEfKP-ka','CPECH · Bitácora Sistema económico','Bienes y servicios; mercado; producción y producto interno bruto'],
 century19:['1JaJRn8X_Zfz-otqFwoNpamrFSxwg34YI','CPECH · Bitácora Historia, Mundo, América y Chile siglo XIX','Liberalismo; expansión territorial; economía salitrera'],
 century20:['1kb30RdHpKIhEsG1kr_4qQw5oNDk-5Ne1','CPECH · Bitácora Historia, Mundo, América y Chile siglo XX','Guerras mundiales; crisis de 1929; descolonización; Guerra Fría; nacionalización del cobre']
};
function trace(source,subject,officialEje,officialPages,alignmentRationale){
 const [driveFileId,driveMaterial,driveSection]=sources[source];
 return {officialTemario:`https://acceso.mineduc.cl/wp-content/uploads/2026/03/Temario-PAESRegular-2026-${subject}-v2.pdf`,officialEje,officialPages,driveFileId,driveMaterial,driveSection,alignmentRationale,reviewedAt:'2026-10-17',sourceUse:'Consulta de secciones del material; situaciones, alternativas y soluciones originales. No se reproducen preguntas editoriales.'};
}
const design=(baseTask,newTask)=>({baseTask,newTask,review:'Comparación editorial del procedimiento y de la evidencia; no basta cambiar cifras o nombres.'});
export const transferCasesBatch11=[
 {
  base:'M2:M2-037',id:'TR-M2-001',
  question:'Un grupo de 15 mediciones tiene media 12 y otro de 10 mediciones tiene media 18. Los grupos no comparten mediciones. Una estudiante afirma que la media de las 25 mediciones es 15 porque promedió las dos medias. ¿Cuál es la corrección adecuada?',
  options:['La media es 15, pues los dos grupos aportan una media cada uno','La media es 14,4, pues se pondera cada media por su cantidad de datos','La media es 30, pues se suman las dos medias disponibles','La media es 12, pues debe usarse la del grupo más numeroso'],answer:1,
  steps:['Reconstruimos las sumas de cada grupo: 15 × 12 = 180 y 10 × 18 = 180, porque suma = cantidad × media.','Al reunir los grupos hay 25 mediciones con suma 360; la media conjunta es 360 / 25 = 14,4.','Promediar 12 y 18 con igual peso sería válido para grupos del mismo tamaño; aquí el grupo de media 12 aporta más datos.'],
  errors:['El promedio simple de medias da el mismo peso a grupos que tienen tamaños diferentes.','','30 suma dos medidas de tendencia central y omite dividir la suma de los datos por su cantidad.','El grupo mayor tiene más peso, pero las diez mediciones del segundo grupo también deben incorporarse.'],
  transferDesign:design('Calcular una media a partir de cuatro datos explícitos','Evaluar una media de grupos desiguales y reconstruir sus sumas'),
  sourceTrace:trace('statistics','M2','Probabilidad y estadística · conocimientos M1 incluidos en M2',[9],'Argumentar por qué la media conjunta depende de la cantidad de datos de cada grupo.')
 },
 {
  base:'Historia:HIS-019',id:'TR-HIS-027',
  question:'En un ejemplo simplificado, cualquier embarcación puede acceder a un banco de peces y cada captura deja menos peces disponibles para otras. Un estudiante lo llama bien público puro porque el acceso es abierto. ¿Qué debe corregir?',
  options:['El acceso abierto implica que el consumo carece de rivalidad','La captura transforma el recurso en un servicio no excluible','El recurso es común: su acceso es abierto, pero su consumo es rival','El recurso es privado porque todos los pescadores pueden acceder'],answer:2,
  steps:['Separar exclusión de rivalidad permite evaluar dos propiedades diferentes: quién puede acceder y qué ocurre cuando alguien consume.','El acceso abierto del ejemplo indica dificultad de exclusión; en cambio, cada captura reduce lo que otros pueden obtener.','Por ello se trata de un recurso común con consumo rival; un bien público puro reúne no exclusión y no rivalidad.'],
  errors:['La posibilidad de acceder no determina si el uso de una persona reduce lo disponible para otra.','El objeto del caso sigue siendo un recurso cuyo stock disminuye al extraer peces.','','El carácter privado no se deduce del acceso de todos; el caso destaca precisamente acceso abierto.'],
  transferDesign:design('Reconocer la definición de bien público puro','Criticar una clasificación usando rivalidad y exclusión en un caso'),
  sourceTrace:trace('economy','Historia','Sistema económico · relaciones entre Estado y mercado',[9],'Aplicar la distinción entre bienes públicos y recursos comunes al análisis de recursos compartidos.')
 },
 {
  base:'Historia:HIS-033',id:'TR-HIS-028',
  question:'Una síntesis didáctica compara la independencia de India en 1947 con la de Argelia en 1962. Señala que siguieron trayectorias diferentes y cuestionaron el dominio de potencias europeas. ¿Qué conclusión integra mejor ambos procesos?',
  options:['La descolonización fue un proceso diverso vinculado a demandas de autodeterminación','La independencia implicó que ambas sociedades siguieran el mismo modelo político','Las diferencias de trayectoria impiden reconocer un proceso histórico común','Los cambios consistieron principalmente en sustituir una metrópoli europea por otra'],answer:0,
  steps:['Los casos se sitúan en la descolonización posterior a la Segunda Guerra Mundial y muestran cuestionamientos al control colonial.','Compartir una demanda de autodeterminación no obliga a que las estrategias, los conflictos o los resultados institucionales sean idénticos.','La comparación respalda un proceso común con trayectorias diversas, sin reducirlo a una única vía ni a una sustitución de metrópolis.'],
  errors:['','La independencia no determina por sí sola un mismo sistema político, económico o social.','Procesos comparables pueden tener ritmos y modalidades distintos sin perder sus rasgos comunes.','Los casos descritos corresponden al fin del dominio colonial, no a la cesión entre potencias.'],
  transferDesign:design('Identificar movimientos de independencia después de 1945','Comparar trayectorias nacionales sin confundir proceso común con uniformidad'),
  sourceTrace:trace('century20','Historia','Historia · nuevo orden mundial y procesos de descolonización',[7],'Relacionar diversidad de trayectorias y autodeterminación en el orden internacional de posguerra.')
 },
 {
  base:'Historia:HIS-052',id:'TR-HIS-029',
  question:'Un esquema sobre 1914 distingue rivalidades imperialistas, competencia armamentista y alianzas anteriores a la guerra; luego sitúa el asesinato de Francisco Fernando y la crisis diplomática. ¿Qué explicación respeta esa distinción temporal?',
  options:['Las rivalidades surgieron como consecuencia del asesinato y no existían antes','El sistema de alianzas apareció cuando la guerra ya había terminado','El atentado vuelve innecesario estudiar las tensiones anteriores','El atentado precipitó una crisis en un escenario de tensiones acumuladas'],answer:3,
  steps:['El esquema presenta factores de largo plazo anteriores al asesinato, por lo que no pueden explicarse como efectos posteriores de ese hecho.','El asesinato actuó como detonante de una crisis diplomática en la que intervinieron intereses, decisiones y alianzas ya existentes.','Distinguir detonante y condiciones previas permite una explicación multicausal del estallido de la Primera Guerra Mundial.'],
  errors:['El orden temporal del esquema ubica las rivalidades antes del atentado.','El esquema presenta alianzas previas que influyeron en la extensión del conflicto.','Un detonante no explica por sí mismo por qué la crisis involucró a varias potencias.',''],
  transferDesign:design('Identificar el acontecimiento precipitante de 1914','Distinguir causas estructurales y detonante mediante una secuencia temporal'),
  sourceTrace:trace('century20','Historia','Historia · procesos políticos de la primera mitad del siglo XX; pensamiento crítico',[5,6],'Evaluar multicausalidad y precedencia temporal a partir de antecedentes entregados en el enunciado.')
 },
 {
  base:'Historia:HIS-062',id:'TR-HIS-030',
  question:'Durante la Gran Depresión, una economía latinoamericana dependiente de exportaciones enfrentó menos pedidos externos y menores ingresos por ventas al exterior. ¿Qué mecanismo ayuda a explicar que una crisis internacional afectara su empleo?',
  options:['La menor demanda externa elevó necesariamente la producción exportadora','La caída de ventas redujo actividad e ingresos de sectores vinculados a las exportaciones','El comercio exterior impidió que se transmitieran dificultades de otras economías','La caída de exportaciones aumentó de inmediato todos los ingresos fiscales'],answer:1,
  steps:['La dependencia de ventas externas conecta la actividad local con la demanda de otros países.','Si disminuyen los pedidos, pueden caer la producción, el transporte y los ingresos asociados, afectando la contratación de trabajadores.','Esta cadena explica la transmisión internacional de la crisis; no supone que todos los países ni sectores sufrieran efectos idénticos.'],
  errors:['Con menos pedidos no se deduce un aumento necesario de la producción.','','Los vínculos comerciales son una vía de transmisión de la crisis, no una barrera automática.','La reducción de ventas externas no implica un aumento inmediato de toda la recaudación.'],
  transferDesign:design('Reconocer la Gran Depresión como crisis internacional','Explicar una cadena causal entre demanda externa, actividad y empleo'),
  sourceTrace:trace('century20','Historia','Historia · crisis del Estado liberal y modelos económicos del siglo XX',[6],'Explicar repercusiones económicas internacionales que permiten contextualizar cambios en el papel del Estado.')
 },
 {
  base:'Historia:HIS-031',id:'TR-HIS-031',
  question:'Una clase relaciona el principio de igualdad jurídica difundido en 1789 con las reformas liberales del siglo XIX. ¿Qué medida se vincula más directamente con ese principio?',
  options:['Reservar los cargos públicos por herencia familiar','Establecer tribunales privilegiados por pertenencia estamental','Aplicar la misma ley sin privilegios definidos por nacimiento','Mantener exenciones legales para una nobleza hereditaria'],answer:2,
  steps:['La igualdad jurídica cuestiona que el nacimiento determine privilegios frente a la ley.','Una reforma que somete a las personas a una ley común reduce las distinciones jurídicas fundadas en estamentos hereditarios.','Ese vínculo conceptual no implica que las sociedades liberales hayan eliminado de inmediato toda exclusión política o desigualdad social.'],
  errors:['La reserva hereditaria de cargos conserva un privilegio de nacimiento.','Un tribunal privilegiado por estamento contradice el criterio de una ley común.','','Las exenciones fundadas en pertenecer a una nobleza mantienen la diferencia jurídica hereditaria.'],
  transferDesign:design('Nombrar un principio de la declaración de 1789','Aplicar el principio a una reforma y delimitar lo que permite concluir'),
  sourceTrace:trace('century19','Historia','Historia · ideas republicanas y liberales del siglo XIX',[6],'Usar un antecedente explícito para analizar transformaciones liberales del siglo XIX.')
 },
 {
  base:'Historia:HIS-032',id:'TR-HIS-032',
  question:'Dos síntesis didácticas sobre el imperialismo del siglo XIX destacan aspectos distintos: una presenta los ferrocarriles coloniales como modernización; otra señala que conectaban zonas extractivas con puertos y favorecían intereses de las metrópolis. ¿Qué análisis integra ambas?',
  options:['La construcción de infraestructura pudo coexistir con relaciones de dominio y extracción','La existencia de ferrocarriles demuestra ausencia de subordinación colonial','La extracción de recursos impide que haya existido infraestructura ferroviaria','Las dos descripciones necesariamente se refieren a procesos sin relación entre sí'],answer:0,
  steps:['Las descripciones destacan una obra material y el uso económico de esa obra; no se contradicen necesariamente.','Una red ferroviaria puede facilitar transporte y, al mismo tiempo, responder a los intereses de una potencia colonial.','El análisis debe relacionar infraestructura, extracción y poder sin convertir la modernización material en prueba de igualdad política.'],
  errors:['','Una mejora de transporte no demuestra autonomía política ni igualdad en la distribución de beneficios.','La extracción puede apoyarse en ferrocarriles; ambos hechos son compatibles.','Los textos pueden describir dimensiones diferentes de un mismo proceso colonial.'],
  transferDesign:design('Identificar una consecuencia del dominio colonial','Contrastar interpretaciones y relacionar infraestructura con poder económico'),
  sourceTrace:trace('century19','Historia','Historia · transformaciones económicas del siglo XIX y análisis de fuentes',[4,6],'Analizar perspectivas sobre expansión económica y dominio sin atribuir los textos didácticos a autores reales.')
 },
 {
  base:'Historia:HIS-064',id:'TR-HIS-033',
  question:'En un mercado hipotético de un bien normal disminuye el ingreso de los hogares. Su precio y los demás factores se mantienen constantes. ¿Qué representación describe el cambio esperado?',
  options:['Un movimiento sobre la curva de demanda causado por un alza del precio','Un desplazamiento de la oferta a la derecha causado por mayor productividad','Un desplazamiento de la demanda a la derecha por el menor ingreso','Un desplazamiento de la demanda a la izquierda, con menor cantidad demandada a cada precio'],answer:3,
  steps:['El enunciado cambia el ingreso y mantiene el precio del bien; por eso no describe un movimiento causado por variar su precio.','En un bien normal, una disminución del ingreso reduce la cantidad que los consumidores desean adquirir a cada precio.','Ese cambio se representa desplazando la curva de demanda a la izquierda, sin atribuirlo a una variación de productividad.'],
  errors:['El precio permanece constante; el factor que cambia es el ingreso de los hogares.','La productividad no cambia en el caso, y el efecto descrito corresponde a la demanda.','Para un bien normal, menor ingreso desplaza la demanda en el sentido contrario.',''],
  transferDesign:design('Predecir la demanda cuando aumenta el ingreso','Traducir un cambio de ingreso a una curva y distinguir desplazamiento de movimiento'),
  sourceTrace:trace('economy','Historia','Sistema económico · funcionamiento del mercado y factores que lo alteran',[9],'Distinguir cambios en demanda de movimientos causados por el precio del propio bien.')
 },
 {
  base:'Historia:HIS-012',id:'TR-HIS-034',
  question:'Un esquema didáctico del norte salitrero de fines del siglo XIX vincula oficinas extractivas, líneas ferroviarias y puertos; junto a ellos aparecen centros de trabajo y comercio. ¿Qué relación explica mejor esa organización territorial?',
  options:['La red se orientaba a sustituir las exportaciones por una economía sin intercambio','La extracción para mercados externos impulsaba transporte, empleo y servicios urbanos','El crecimiento portuario hacía innecesaria toda conexión con las zonas productoras','La concentración de trabajadores demostraba que la minería había dejado de operar'],answer:1,
  steps:['El esquema conecta la zona de extracción con el punto de salida de productos hacia mercados externos.','Esa actividad necesita transporte, trabajadores y servicios, lo que favorece asentamientos y circulación de bienes.','La organización territorial es compatible con una economía exportadora y sus efectos urbanos, sin suponer bienestar uniforme para la población.'],
  errors:['La conexión entre extracción y puertos apunta a intercambio externo, no a su eliminación.','','El esquema destaca precisamente la articulación ferroviaria entre producción y puerto.','La presencia de trabajadores y servicios es compatible con actividad minera en funcionamiento.'],
  transferDesign:design('Identificar crecimiento urbano asociado al salitre','Interpretar una red territorial como parte del funcionamiento exportador'),
  sourceTrace:trace('century19','Historia','Historia · inserción económica de Chile en mercados internacionales del siglo XIX',[6],'Relacionar actividades extractivas, transporte y transformaciones urbanas a partir de un esquema original.')
 },
 {
  base:'Historia:HIS-061',id:'TR-HIS-035',
  question:'Una línea de tiempo distingue la chilenización del cobre, con adquisición de participación estatal en empresas, de la nacionalización de la gran minería del cobre en 1971. ¿En qué dimensión debe compararse directamente ambos hitos?',
  options:['En el paso desde la minería a la desaparición de las exportaciones','En el reemplazo de la actividad industrial por la agricultura','En el grado de propiedad y control estatal sobre la gran minería','En el cambio del mineral extraído desde cobre hacia salitre'],answer:2,
  steps:['Los dos hitos se refieren a la relación del Estado con la propiedad de empresas de la gran minería del cobre.','La participación accionaria de la chilenización y la transferencia al Estado mediante nacionalización representan grados distintos de control.','La comparación pertinente es la propiedad y el control estatal; no se deduce un cambio de mineral ni la desaparición de las exportaciones.'],
  errors:['Los cambios de propiedad no significaron por sí mismos eliminar las exportaciones de cobre.','La línea de tiempo trata reformas en la minería, no el reemplazo de toda la actividad industrial.','','Ambos procesos se refieren al cobre; no describen un cambio a la explotación de salitre.'],
  transferDesign:design('Definir la nacionalización de 1971','Comparar nacionalización y chilenización sin confundir sus mecanismos'),
  sourceTrace:trace('century20','Historia','Historia · reformas políticas y económicas en Chile durante la segunda mitad del siglo XX',[7],'Distinguir reformas relacionadas sin convertir participación accionaria en nacionalización total.')
 },
 {
  base:'Historia:HIS-056',id:'TR-HIS-036',
  question:'Dos síntesis didácticas sobre la ocupación de la Araucanía destacan, respectivamente, la expansión del control estatal y la reducción de tierras y autonomía de comunidades mapuche. ¿Cómo conviene relacionarlas?',
  options:['Describen dimensiones de un proceso de expansión estatal con efectos desiguales sobre sus actores','La expansión del Estado demuestra que no pudo existir pérdida territorial mapuche','La reducción de tierras implica que el Estado abandonó su intervención en la zona','Las diferencias de enfoque obligan a descartar ambas antes de contrastar sus evidencias'],answer:0,
  steps:['Las síntesis seleccionan actores y consecuencias diferentes: consolidación territorial estatal y efectos sobre comunidades mapuche.','Es posible que el avance del control estatal se produzca junto con una reducción de tierras y autonomía de esas comunidades.','Relacionar ambas dimensiones permite analizar el proceso y sus consecuencias desiguales, contrastando evidencias en vez de borrar una perspectiva.'],
  errors:['','El aumento del control estatal es compatible con pérdida de tierras y autonomía de comunidades.','La reducción territorial señalada no prueba un abandono de la intervención del Estado.','Tener enfoques distintos no invalida automáticamente la evidencia que cada síntesis pueda aportar.'],
  transferDesign:design('Identificar la ocupación como proceso territorial','Integrar perspectivas de actores y consecuencias desiguales de la expansión estatal'),
  sourceTrace:trace('century19','Historia','Historia · formación del Estado-nación y transformaciones sociales de Chile',[6],'Comparar perspectivas sobre expansión territorial sin inventar testimonios ni citas históricas.')
 },
 {
  base:'Historia:HIS-040',id:'TR-HIS-037',
  question:'En una economía hipotética, durante el mismo período se vende trigo a un molino por $100, harina a una panadería por $160 y el pan elaborado a consumidores por $250. Todo se produce dentro del país, no quedan existencias y no hay otras ventas. ¿Qué aporte hace esta cadena al PIB?',
  options:['$100','$160','$510','$250'],answer:3,
  steps:['El PIB evita contar repetidamente insumos que están incorporados en el precio de un bien final.','En esta cadena el bien final vendido a consumidores es el pan por $250; trigo y harina son compras intermedias.','También puede comprobarse sumando el valor agregado: 100 + (160 − 100) + (250 − 160) = 250.'],
  errors:['$100 corresponde solo a la etapa del trigo y deja fuera el valor agregado posterior.','$160 es el valor de una venta intermedia, antes de la elaboración y venta final del pan.','$510 suma trigo, harina y pan, contando varias veces el valor de los insumos.',''],
  transferDesign:design('Reconocer qué representa el PIB','Evitar doble contabilización en una cadena de bienes intermedios y finales'),
  sourceTrace:trace('economy','Historia','Sistema económico · producción, mercado y modelos de desarrollo',[9],'Aplicar el concepto de producción final a un ejemplo numérico explícitamente hipotético.')
 },
 {
  base:'Historia:HIS-057',id:'TR-HIS-038',
  question:'Una explicación del Plan Marshall destaca la ayuda estadounidense a la reconstrucción económica de Europa occidental y su contexto de confrontación con la Unión Soviética. ¿Qué interpretación relaciona ambos elementos?',
  options:['La reconstrucción eliminó las diferencias ideológicas entre los bloques','La recuperación económica se vinculó también con la consolidación del bloque occidental','El plan constituyó un tratado militar firmado por los países del bloque soviético','El objetivo fue sustituir toda producción europea por importaciones permanentes'],answer:1,
  steps:['La ayuda buscaba recuperar economías europeas afectadas por la guerra, en el contexto inicial de la Guerra Fría.','El fortalecimiento económico de Europa occidental también tenía consecuencias políticas en su relación con Estados Unidos.','La reconstrucción y la consolidación del bloque occidental son dimensiones relacionadas; el plan no debe confundirse con una alianza militar.'],
  errors:['La cooperación económica occidental no eliminó la confrontación ideológica de la Guerra Fría.','','El Plan Marshall fue un programa de asistencia económica, no un tratado militar soviético.','La reconstrucción buscaba recuperar capacidad productiva, no reemplazarla de manera permanente.'],
  transferDesign:design('Identificar el objetivo económico del Plan Marshall','Relacionar reconstrucción económica y configuración de bloques en la Guerra Fría'),
  sourceTrace:trace('century20','Historia','Historia · nuevo orden mundial de posguerra y Guerra Fría',[7],'Relacionar dimensiones económicas y políticas del Plan Marshall sin confundirlo con la OTAN.')
 },
 {
  base:'Historia:HIS-045',id:'TR-HIS-067',
  question:'Una persona tiene $1.000.000 para ahorrar. Compara dos alternativas: A, invertir todo en acciones de una sola empresa; B, repartir el monto entre empresas de distintos sectores. Sin suponer que todas subirán de precio, ¿qué afirmación es más justificada?',
  options:['B elimina completamente el riesgo de perder dinero','A es necesariamente más rentable por concentrar el capital','B reduce la exposición a un problema específico de una empresa, pero mantiene riesgos generales del mercado','Ambas alternativas tienen exactamente el mismo riesgo porque la suma invertida es igual'],answer:2,
  steps:['Identificamos el riesgo específico: si una sola empresa enfrenta un problema, una cartera concentrada depende enteramente de su resultado.','Distribuir los recursos entre sectores puede disminuir el impacto de un fracaso particular, pero no garantiza ganancias ni elimina riesgos que afectan a todo el mercado.','Por eso la opción B reduce parte del riesgo específico sin eliminarlo todo; no puede deducirse una rentabilidad segura a partir de la diversificación.'],
  errors:['Diversificar no evita caídas que afectan simultáneamente a varias empresas, como una crisis general.','La concentración no garantiza rentabilidad: aumenta la dependencia de los resultados de una sola empresa.','','Que el capital inicial sea igual no implica que la exposición a pérdidas de ambas carteras sea idéntica.'],
  transferDesign:design('Identificar el significado de diversificación','Evaluar riesgo específico frente a riesgo de mercado en dos carteras de igual monto'),
  sourceTrace:trace('economy','Historia','Sistema económico · decisiones financieras y riesgo',[1],'Distinguir diversificación de garantía de ganancias o eliminación total del riesgo.')
 },
 {
  base:'Historia:HIS-054',id:'TR-HIS-068',
  question:'Dos personas comienzan con $0 y ahorran sin intereses ni retiros. Paula deposita $15.000 al final de cada mes durante 12 meses. Diego deposita $20.000 al final de cada mes durante 9 meses. ¿Qué conclusión es correcta?',
  options:['Paula ahorra $45.000 más porque deposita durante más meses','Diego ahorra $60.000 más porque su aporte mensual es mayor','Ambos ahorran $180.000, aunque sus aportes y períodos sean distintos','Ambos ahorran $240.000 porque se debe usar el mayor aporte mensual y el mayor plazo'],answer:2,
  steps:['Cuando no hay intereses ni retiros, el ahorro acumulado corresponde a la suma de los aportes periódicos de cada persona.','Para Paula calculamos 15.000 × 12 = 180.000 pesos; para Diego calculamos 20.000 × 9 = 180.000 pesos.','Ambas personas acumulan la misma cantidad con combinaciones diferentes de monto y cantidad de depósitos; un aporte mayor no asegura un total mayor.'],
  errors:['El plazo más largo no basta: Paula deposita una cantidad menor en cada período, por lo que se deben multiplicar ambos factores.','El aporte mensual de Diego es mayor, pero realiza solo nueve depósitos y termina con el mismo ahorro.','','Esta operación mezcla el aporte de una persona con el plazo de la otra y no representa ninguno de los dos planes.'],
  transferDesign:design('Calcular acumulación mediante depósitos periódicos','Comparar planes con aportes y plazos distintos sin rendimientos'),
  sourceTrace:trace('economy','Historia','Sistema económico · ahorro y planificación financiera',[1],'Razonar con aportes periódicos sin inventar tasas de interés ni rentabilidad.')
 }
];
