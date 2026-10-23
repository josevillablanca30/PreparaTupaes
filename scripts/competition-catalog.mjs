import {dailyCatalog} from './daily-catalog.mjs';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

// Server-only export. Never copied into dist or the APK.
export function competitionRows(){
 const {items,texts}=dailyCatalog();
 return items.map(q=>{
  const passage=q.passageId?texts.find(t=>t.id===q.passageId):null;
  const hash=createHash('sha256').update(JSON.stringify([q.question,q.options,q.answer,q.visual||null,passage||null])).digest('hex');
  return {key:q.key,subject:q.subjectKey,track:q.subject||null,module:q.module||null,family:q.family,concept:q.concept,axis:q.axis,difficulty:String(q.difficulty||'orientativa'),eligible:!q.supplementary&&q.examEligible!==false,hash,answer:q.answer,
   body:{key:q.key,question:q.question,options:q.options,visual:q.visual||null,passage:passage||null,concept:q.concept,steps:q.steps,easy:q.easy,example:q.example,explanations:q.explanations,teaching:q.teaching}};
 });
}
const quote=v=>v===null?'null':typeof v==='boolean'?String(v):typeof v==='number'?String(v):"'"+String(v).replaceAll("'","''")+"'";
export function competitionSeed(){
 const geo=JSON.parse(readFileSync(new URL('../competition-geography.json',import.meta.url),'utf8'));
 const rows=competitionRows();
 return 'begin;\nset standard_conforming_strings=on;\n'+geo.communes.map(c=>{
  const r=geo.regions.find(r=>r.code===c.regionCode);
  return `insert into cachaste.locations values(${[c.code,c.name,r.code,r.name].map(quote)}) on conflict(commune_code)do update set commune=excluded.commune,region=excluded.region,region_code=excluded.region_code;`;
 }).join('\n')+'\n'+rows.map(q=>`insert into cachaste.questions(key,subject,track,module,family,concept,axis,difficulty,eligible,assessment_hash,body,answer)values(${[q.key,q.subject,q.track,q.module,q.family,q.concept,q.axis,q.difficulty,q.eligible,q.hash,JSON.stringify(q.body),q.answer].map(quote)})on conflict(key)do update set body=excluded.body,eligible=excluded.eligible where cachaste.questions.assessment_hash=excluded.assessment_hash;`).join('\n')+'\ncommit;\n';
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const out=process.argv[2];if(!out)throw new Error('Provide a server-only SQL output path');
 if(/(^|\/)(dist|assets)(\/|$)/.test(out))throw new Error('Private seed cannot be exported into public assets');
 writeFileSync(out,competitionSeed());console.log('Server seed: 802 original questions, locations only; zero identities, scores or subscriptions.');
}
