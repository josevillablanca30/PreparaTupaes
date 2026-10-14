/* Auditoría reproducible de los cuatro bancos modulares. No sustituye revisión humana de validez disciplinar. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const ctx={window:{}};vm.createContext(ctx);
for(const f of ['science-bank.js','reading-bank.js','m2-bank.js','history-bank.js'])vm.runInContext(readFileSync(new URL(f,root),'utf8'),ctx,{filename:f});
const banks={
 Ciencias:ctx.window.SCIENCE_BANK,
 Lectura:ctx.window.READING_QUESTIONS,
 M2:ctx.window.CACHASTE_M2,
 Historia:ctx.window.CACHASTE_HISTORIA
};
const stop=/^(no|nunca|siempre|todos|todas|ningún|ninguna|únicamente|exclusivamente|completamente|absolutamente|imposible|desaparec|elimina|prohíbe|sustituye|solo funciona|solo sirve)\b/i;
const normalize=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}+*/=<>^%×÷≤≥√:-]/gu,' ').trim().replace(/\s+/g,' ');
const output={date:'2026-10-13',scope:'Auditoría heurística completa de cuatro bancos; no certificación de corrección conceptual',totals:{},flags:[],coverage:{}};
let critical=0;
for(const [name,questions] of Object.entries(banks)){
 if(!Array.isArray(questions))throw Error('Banco ausente: '+name);
 output.totals[name]=questions.length;
 const areas={};const keys=new Set(),stems=new Set();
 for(const q of questions){
  const id=q.id,opts=Array.from(q.options||[]),correct=opts[q.answer],wrong=opts.filter((_,i)=>i!==q.answer);
  const area=q.area||q.skill||'Sin área';areas[area]=(areas[area]||0)+1;
  const flag=(type,level,detail)=>{output.flags.push({bank:name,id,area,type,level,detail});if(level==='critical')critical++};
  if(keys.has(id))flag('duplicate_id','critical',id);keys.add(id);
  if(stems.has(normalize(q.question)))flag('duplicate_stem','critical','Enunciado repetido');stems.add(normalize(q.question));
  if(opts.length!==4||new Set(opts.map(normalize)).size!==4||!Number.isInteger(q.answer)||q.answer<0||q.answer>3)flag('invalid_options','critical','Claves o alternativas inválidas');
  if(!q.question||q.question.length<20)flag('short_stem','review','Enunciado muy breve');
  if(!q.why&&(!q.explanations||q.explanations.length!==4))flag('missing_feedback','critical','Sin justificación o explicación por alternativa');
  if(q.why&&q.why.length<35)flag('short_explanation','review','Explicación de menos de 35 caracteres');
  if(wrong.some(w=>stop.test(w)))flag('absolute_distractor','review','Alternativa con negación o absoluto: comprobar plausibilidad');
  if(wrong.some(w=>w.length<correct.length*.25&&correct.length>45))flag('answer_length_cue','review','La correcta es mucho más larga que un distractor');
  if(wrong.some(w=>w.length>correct.length*4&&w.length>55))flag('reverse_length_cue','review','Distractor mucho más largo que la correcta');
  if(wrong.some(w=>normalize(w)===normalize(correct)))flag('same_meaning','critical','Respuesta duplicada tras normalización');
  if(q.explanations&&q.explanations.some((x,i)=>i!==q.answer&&x.length<20))flag('weak_wrong_feedback','review','Explicación de distractor demasiado breve');
  if(name==='Ciencias'&&(!q.steps||q.steps.length<2))flag('missing_steps','critical','Sin razonamiento guiado');
  if(name==='Lectura'&&(!q.passageId||!ctx.window.READING_PASSAGES.some(p=>p.id===q.passageId)))flag('missing_passage','critical','Referencia a texto inexistente');
 }
 output.coverage[name]=areas;
}
output.summary={critical,review:output.flags.filter(f=>f.level==='review').length,questionCount:Object.values(output.totals).reduce((a,b)=>a+b,0)};
mkdirSync(new URL('../reports/',import.meta.url),{recursive:true});
writeFileSync(new URL('../reports/pedagogical-audit.json',import.meta.url),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify(output.summary));
console.log('Revisar alertas heurísticas en reports/pedagogical-audit.json');
if(critical){console.error('Alertas críticas:',JSON.stringify(output.flags.filter(f=>f.level==='critical').slice(0,60)));process.exitCode=1;}
