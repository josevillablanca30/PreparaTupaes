/* Dos ejercicios originales de Historia en revisión editorial. No están incorporados al banco publicado. */
const design=(baseTask,newTask)=>({baseTask,newTask});
const trace=(source,subject,officialEje,officialPages,alignmentRationale)=>({source,subject,officialEje,officialPages,alignmentRationale,reviewStatus:'revision-pendiente'});
export const historiaCandidates=[
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
