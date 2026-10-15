/* Registro de cobertura. Solo las clases escritas y comprobadas en esta pasada cuentan como revisadas. */
import {readFileSync,writeFileSync} from 'node:fs';
import {loadBanks} from './load-banks.mjs';
const baseline=JSON.parse(readFileSync(new URL('../pedagogy/baseline-623.json',import.meta.url)));
const banks=loadBanks();
for(const row of baseline){
 const q=banks[row.subject].find(q=>q.id===row.id);
 if(!q)throw Error('Se perdió un ítem: '+row.id);
 if(!q.teaching)continue;
 row.review='revision_editorial_asistida_de_contenido';row.qualityBefore=['M2-027','M2-050'].includes(q.id)?'insuficiente':'básica';row.quality=q.teaching.quality;
 row.evidence=['Fundamentos definidos','Aplicación propia conservada y revisada','Comprobación específica','Estrategia cotidiana diferente','Otro problema resuelto y puente de transferencia','Distractor elegido identificado y procedimiento de reparación'];
}
const reviewed=baseline.filter(r=>r.review!=='pendiente_revision_pedagogica_individual');
const result={date:'2026-10-15',scope:'Revisión editorial asistida; no medición de aprendizaje con estudiantes. No se clasifica como excelente por longitud. Los ítems pendientes no se presentan como revisados.',summary:{total:baseline.length,reviewed:reviewed.length,pending:baseline.length-reviewed.length,rewrittenThreeModes:reviewed.length,excellent:0},bySubject:Object.fromEntries(Object.entries(banks).filter(([s])=>s!=='texts').map(([s,b])=>[s,{total:b.length,reviewed:reviewed.filter(r=>r.subject===s).length}])),items:baseline};
writeFileSync(new URL('../reports/tutor-review-2026-10-15.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result.summary));
