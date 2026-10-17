import {dailyCatalog} from './daily-catalog.mjs';

/** A reproducible release gate, not a claim of textbook-page review. */
export function readinessAudit(items=dailyCatalog().items){
 const subjects={};
 for(const q of items){
  if(!subjects[q.subjectKey])subjects[q.subjectKey]={questions:0,originals:0,transfers:0,concepts:new Map()};
  const s=subjects[q.subjectKey];s.questions++;if(q.origin==='original-transfer-2027')s.transfers++;else s.originals++;
  if(!s.concepts.has(q.concept))s.concepts.set(q.concept,{ids:new Set(),families:new Set(),transferIds:[]});
  const c=s.concepts.get(q.concept);
  c.ids.add(q.key);
  c.families.add(q.family);
  if(q.origin==='original-transfer-2027')c.transferIds.push(q.id);
 }
 const report={generatedAt:'runtime',overall:{questions:0,originals:0,transfers:0,concepts:0,unverifiableConcepts:0},subjects:{},gaps:[]};
 for(const [subject,s]of Object.entries(subjects)){
  const detail={questions:s.questions,originals:s.originals,transfers:s.transfers,concepts:s.concepts.size,verifiableConcepts:0,unverifiableConcepts:0,verifiedCases:0};
  for(const [concept,entry]of s.concepts){
   const independent=entry.families.size;
   if(independent>=2){detail.verifiableConcepts++;detail.verifiedCases+=independent;}
   else{detail.unverifiableConcepts++;report.gaps.push({subject,concept,questions:entry.ids.size,families:independent,reason:'Se requieren al menos dos familias independientes de evaluación'});}
  }
  report.subjects[subject]=detail;
  report.overall.questions+=detail.questions;
  report.overall.originals+=detail.originals;
  report.overall.transfers+=detail.transfers;
  report.overall.concepts+=detail.concepts;
  report.overall.unverifiableConcepts+=detail.unverifiableConcepts;
 }
 report.gaps.sort((a,b)=>a.subject.localeCompare(b.subject,'es')||a.concept.localeCompare(b.concept,'es'));
 return report;
}
if(import.meta.url===new URL(process.argv[1]||'', 'file:').href)process.stdout.write(JSON.stringify(readinessAudit(),null,2)+'\n');
