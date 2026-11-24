// Derive verification data from the approved catalogue. No new questions or editorial changes.
import {dailyCatalog} from './daily-catalog.mjs';
import vm from 'node:vm';
import {readFileSync,writeFileSync} from 'node:fs';
const ctx=vm.createContext({});vm.runInContext(readFileSync(new URL('../learning-core.js',import.meta.url),'utf8'),ctx);
export function originalCatalogSeed(){
 const rows=dailyCatalog().items.map(q=>({key:q.key,subject:q.subjectKey,concept:q.concept,family:q.family,track:q.subject||null,module:q.module||null,eligible:!q.supplementary&&q.examEligible!==false,answer:q.answer,options:q.options,assessment_version:String(ctx.CachasteLearning.assessmentVersion(q)),source_id:q.sourceId}));
 const data=JSON.stringify(rows).replaceAll("'","''");
 return `-- Generated from the existing PAES catalogue; private verification data only.\ninsert into cachaste_web.original_question_catalog select * from jsonb_populate_recordset(null::cachaste_web.original_question_catalog, '${data}'::jsonb) on conflict(key) do nothing;\n`;
}
if(process.argv[1]===new URL(import.meta.url).pathname)writeFileSync(new URL('../web/supabase/original-catalog.seed.sql',import.meta.url),originalCatalogSeed());
