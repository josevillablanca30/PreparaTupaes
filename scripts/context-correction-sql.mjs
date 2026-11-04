import {writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {competitionRows} from './competition-catalog.mjs';
export const observedPriorHashes={
 'Ciencias:TR-SCI-097':'1edcff98809fc67727b09fe279c348dab8549c9b1f73e110451ddc70f76a1a31',
 'M1:TR-M1-007':'295bd567d0e4c2def90ee1542f55dc961563bb5392e986131b76b3b8937c45aa',
 'M1:TR-M1-021':'9229098e6c377dba5930998e62055e7f6b39ae0165611820f1c784cddde0a42e',
 'M1:TR-M1-022':'700571dd88aea506e88e75b01d18c5f4c0dbaf22894c056c7ae7bdaf094cdbad'
};
export function contextCorrectionSql(){
 const rows=competitionRows().filter(q=>observedPriorHashes[q.key]).map(q=>({key:q.key,oldHash:observedPriorHashes[q.key],hash:q.hash,answer:q.answer,body:q.body}));
 if(rows.length!==4)throw Error('Se esperaban exactamente cuatro correcciones editoriales');
 const data=JSON.stringify(rows).replaceAll("'","''");
 return `begin;
set standard_conforming_strings=on;
do $context_review$
declare r jsonb; existing cachaste.questions; changed int:=0;
begin
 for r in select value from jsonb_array_elements('${data}'::jsonb) loop
  select * into existing from cachaste.questions where key=r->>'key' for update;
  if not found or existing.assessment_hash not in(r->>'oldHash',r->>'hash') then
   raise exception 'CONTEXT_REVIEW_CONFLICT: %',r->>'key';
  end if;
  if existing.answer<>(r->>'answer')::int or existing.body->'options'<>r->'body'->'options' then
   raise exception 'CONTEXT_REVIEW_ANSWER_CONFLICT: %',r->>'key';
  end if;
  update cachaste.questions set body=r->'body',assessment_hash=r->>'hash' where key=r->>'key';
  changed:=changed+1;
 end loop;
 if changed<>4 then raise exception 'CONTEXT_REVIEW_INCOMPLETE';end if;
end $context_review$;
commit;
`;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const out=process.argv[2];if(!out||/(^|\/)(dist|assets)(\/|$)/.test(out))throw Error('Indica una ruta SQL privada fuera de la distribución pública');
 writeFileSync(out,contextCorrectionSql());console.log('SQL acotado: cuatro preguntas; claves, alternativas, usuarios y resultados conservados.');
}
