// Evalúa la secuencia completa: una instrucción breve puede ser útil si luego se desarrolla.
const LEAD_ONLY=/^(vamos a identificar el proceso o magnitud que se pide|identifiquemos qué pide la consigna)/i;
export function hasCompleteReasoningSequence(rawSteps){
 const steps=(Array.isArray(rawSteps)?rawSteps:[])
  .map(step=>String(step??'').trim())
  .filter(step=>step&&!LEAD_ONLY.test(step));
 const developed=steps.filter(step=>step.length>=55&&step.split(/\s+/).length>=8);
 return steps.length>=4&&developed.length>=3&&steps.join(' ').length>=280;
}
