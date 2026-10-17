/* Auditoría estructural reproducible de los cinco bancos. No sustituye revisión humana de validez disciplinar. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {loadBanks} from './load-banks.mjs';
import {hasCompleteReasoningSequence} from './reasoning-quality.mjs';
const root=new URL('../',import.meta.url);
const loaded=loadBanks();
const banks={M1:loaded.M1.map(q=>({...q,question:q.q})),Ciencias:loaded.Ciencias,Lectura:loaded.Lectura,M2:loaded.M2,Historia:loaded.Historia};
const stop=/^(no|nunca|siempre|todos|todas|ningún|ninguna|únicamente|exclusivamente|completamente|absolutamente|imposible|desaparec|elimina|prohíbe|sustituye|solo funciona|solo sirve)\b/i;
const normalize=s=>(/\b(?:AA|Aa|aa)\b/.test(String(s))?String(s):String(s).toLowerCase()).replace(/−/g,'-').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}+*/=<>^%×÷≤≥√:-]/gu,' ').trim().replace(/\s+/g,' ');
const output={date:new Date().toISOString().slice(0,10),scope:'Auditoría heurística estructural de cinco bancos; no certificación de corrección conceptual',totals:{},flags:[],coverage:{}};
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
  if(![4,5].includes(opts.length)||new Set(opts.map(normalize)).size!==opts.length||!Number.isInteger(q.answer)||q.answer<0||q.answer>=opts.length)flag('invalid_options','critical','Claves o alternativas inválidas');
  if(!q.question||q.question.length<20)flag('short_stem','review','Enunciado muy breve');
  if(!q.explanations||q.explanations.length!==opts.length)flag('missing_feedback','critical','Sin justificación o explicación por alternativa');
  if(q.why&&q.why.length<35)flag('short_explanation','review','Explicación de menos de 35 caracteres');
  if(name==='Ciencias'||name==='Lectura'){
   if(!q.easy||q.easy.trim().length<95)flag('vague_easy','review','Modo Más fácil demasiado breve: requiere explicación comprensible y concreta');
   if(!q.example||q.example.trim().length<105||/En otro caso parecido|Para comprobarlo, vuelve al fragmento indicado/i.test(q.example))flag('generic_example','review','Ejemplo o aplicación demasiado genérico para enseñar el concepto');
   if(!hasCompleteReasoningSequence(q.steps))flag('short_reasoning_sequence','review','Revisar la explicación completa: faltan pasos desarrollados o contexto suficiente');
  }
  if(name==='M2'||name==='Historia'){
   if(!q.why||q.why.trim().length<85)flag('vague_core_reasoning','review','Justificación breve: revisar mecanismo, evidencia y conclusión');
   if(!q.hint||q.hint.trim().length<55)flag('vague_hint','review','Pista demasiado breve para acompañar aprendizaje');
  }

  if(wrong.some(w=>stop.test(w)))flag('absolute_distractor','review','Alternativa con negación o absoluto: comprobar plausibilidad');
  if(wrong.some(w=>w.length<correct.length*.25&&correct.length>45))flag('answer_length_cue','review','La correcta es mucho más larga que un distractor');
  if(wrong.some(w=>w.length>correct.length*4&&w.length>55))flag('reverse_length_cue','review','Distractor mucho más largo que la correcta');
  if(wrong.some(w=>normalize(w)===normalize(correct)))flag('same_meaning','critical','Respuesta duplicada tras normalización');
  if(q.explanations&&q.explanations.some((x,i)=>i!==q.answer&&x.length<20))flag('weak_wrong_feedback','review','Explicación de distractor demasiado breve');
  if(name==='Ciencias'&&(!q.steps||q.steps.length<2))flag('missing_steps','critical','Sin razonamiento guiado');
  if(name==='Lectura'&&(!q.passageId||!loaded.texts.some(p=>p.id===q.passageId)))flag('missing_passage','critical','Referencia a texto inexistente');
  if(name==='Ciencias'||name==='Lectura'){
   const examples=String(q.example||'');
   if(/^(En otro caso parecido|Para comprobarlo, vuelve al fragmento|Recuerda:|Como piezas de un rompecabezas)/i.test(examples))flag('generic_template','critical','Explicación de ejemplo genérica que no desarrolla la respuesta');
   if(/^(Es la variable que se manipula deliberadamente\.)$/i.test(String(q.explanations?.[q.answer]||'')))flag('ambiguous_variable','critical','La explicación no distingue variable independiente de controlada');
  }

 }
 output.coverage[name]=areas;
}
output.summary={critical,review:output.flags.filter(f=>f.level==='review').length,questionCount:Object.values(output.totals).reduce((a,b)=>a+b,0)};
mkdirSync(new URL('../reports/',import.meta.url),{recursive:true});
writeFileSync(new URL('../reports/pedagogical-audit.json',import.meta.url),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify(output.summary));
console.log('Revisar alertas heurísticas en reports/pedagogical-audit.json');
if(critical){console.error('Alertas críticas:',JSON.stringify(output.flags.filter(f=>f.level==='critical').slice(0,60)));process.exitCode=1;}
