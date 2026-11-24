// Rebuild display-only reports from server-confirmed rows using the original bank/renderer.
// This projection never grants an entitlement, creates an activity or consumes a quota.
export function restoreVerifiedHistory(E,{items,texts}={}){
 const byKey=new Map(items.map(q=>[q.key,q])),reports=new Map();
 for(const completion of E.state.completed||[]){
  if(!['diagnostic','express-exam'].includes(completion.mode))continue;
  const rows=(E.state.attempts||[]).filter(r=>r.eventId?.startsWith(completion.id+':')&&!r.diagnosticPending).map(r=>{
   const q=byKey.get(r.key);if(!q)return null;
   return {...r,area:q.axis||q.area||q.skill,concept:q.concept,question:q.question,chosen:q.options[r.selected],answer:q.options[q.answer],explanation:q.explanations[r.selected]};
  });
  if(rows.length!==completion.total||rows.some(r=>!r))continue;
  const areas=[...new Set(rows.map(r=>r.area))].map(area=>{const group=rows.filter(r=>r.area===area);return {area,total:group.length,correct:group.filter(r=>r.correct).length};}).sort((a,b)=>a.correct/a.total-b.correct/b.total);
  const diagnostic=completion.mode==='diagnostic',track=completion.track??E.state.track??null;
  const report={express:!diagnostic,diagnostic,id:completion.id,title:(diagnostic?'Diagnóstico inicial · ':'Ensayo PAES Express · ')+(globalThis.CachasteCurriculum?.subjects[completion.subject]?.name||completion.subject)+(completion.subject==='Ciencias'?' · '+track:''),subject:completion.subject,track,total:rows.length,correct:rows.filter(r=>r.correct).length,areas,rows,at:completion.at};
  if(diagnostic){report.demonstrated=E.profile(completion.subject).filter(p=>p.status==='comprobado').map(p=>p.concept);report.nextConcept=globalThis.CachasteProgression?.route(items,completion.subject,track,E.profile(completion.subject),E.state.unitExams)?.current?.objective||null;}
  const key=diagnostic?'diagnosticReports':'expressReports';
  if(!(E.state[key]||=[]).some(r=>r.id===report.id))E.state[key].push(report);
  reports.set(report.id,report);
 }
 const last=E.state.completed?.at(-1);if(last&&reports.has(last.id))E.state.celebration=reports.get(last.id);
 E.save();return reports;
}
