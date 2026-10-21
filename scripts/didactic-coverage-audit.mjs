import {dailyCatalog} from './daily-catalog.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

const normalized=value=>String(value||'').replace(/\s+/g,' ').trim();
const texts=value=>Array.isArray(value)&&value.length>0&&value.every(x=>normalized(x));

// Checks presence and consistency only. None of these checks certify pedagogy,
// scientific correctness, correspondence with a PDF page or commercial readiness.
export function auditDidacticCoverage(items=dailyCatalog().items){
 const reviews=JSON.parse(readFileSync(new URL('../reports/didactic-cellular-2026-10-21.json',import.meta.url),'utf8')).items;
 const subjects={},objectives=new Map();
 for(const q of items){
  const t=q.teaching||{},example=t.example||{};
  const checks={
   foundations:texts(t.foundation),
   application:texts(t.application),
   simplerExplanation:texts(t.intuition),
   reviewExplanation:!!normalized(q.easy),
   reviewDoesNotRepeatSteps:!!normalized(q.easy)&&normalized(q.easy)!==normalized(q.steps?.join(' ')),
   differentWorkedExample:!!normalized(example.problem)&&normalized(example.problem)!==normalized(q.question)&&texts(example.steps),
   optionFeedback:q.options.every((_,i)=>i===q.answer||!!normalized(t.selectedFeedback?.[i]?.diagnosis)&&texts(t.selectedFeedback[i].repair))
  };
  const s=subjects[q.subjectKey]||={questions:0,objectives:0,checks:{}};s.questions++;
  for(const [key,value]of Object.entries(checks))s.checks[key]=(s.checks[key]||0)+Number(value);
  const key=q.subjectKey+':'+q.concept;
  if(!objectives.has(key)){objectives.set(key,{subject:q.subjectKey,concept:q.concept,questionKeys:[],structuralGaps:[],consultedSources:[],editorialApproval:'pending-individual-review'});s.objectives++;}
  const objective=objectives.get(key);objective.questionKeys.push(q.key);
  const fingerprint=createHash('sha256').update(JSON.stringify([q.question,q.options,q.answer,t.foundation,t.application,t.intuition,t.example,t.selectedFeedback])).digest('hex');
  const review=reviews.find(r=>r.key===q.key&&r.contentFingerprint===fingerprint);
  if(review){objective.editorialApproval='partial-text-and-question-review';(objective.reviewedQuestions||=[]).push({key:q.key,decision:review.decision,visualApproval:review.visualApproval});}
  for(const [check,passed]of Object.entries(checks))if(!passed)objective.structuralGaps.push({question:q.key,check});
  for(const source of t.editorialSources||[])if(!objective.consultedSources.some(x=>x.id===source.id))objective.consultedSources.push(source);
 }
 return {scope:'All current catalogue questions, including complementary content',
  method:'Structural consistency audit; not individual editorial approval',
  referenceRequirements:['Explanation from zero','Relevant visual support','Specific feedback for the selected distractor','Simpler explanation','Different worked example','Independent unassisted check','Traceable source and scope'],
  releaseReady:false,
  releaseBlockers:['Complete individual didactic review of each objective and question','Verify factual correctness, alternatives and source correspondence','Review visual relevance and independent assessment coverage'],
  totalQuestions:items.length,totalObjectives:objectives.size,subjects,objectives:[...objectives.values()]};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const report=auditDidacticCoverage();
 writeFileSync(new URL('../reports/didactic-coverage-2026-10-21.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({questions:report.totalQuestions,objectives:report.totalObjectives,subjects:report.subjects,releaseReady:report.releaseReady},null,2));
}
