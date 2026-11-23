import {mergeDuelHistory} from './history.mjs';
import {readFileSync} from 'node:fs';
const runtime=readFileSync(new URL('./ui-runtime.js',import.meta.url),'utf8');
const css=readFileSync(new URL('./ui.css',import.meta.url),'utf8');
export function adaptDuels2Ui(source){
 if(source.includes('CACHASTE_DUELS2_RUNTIME'))return source;
 const anchor=' (async()=>{try{state.geo=';
 if(!source.includes(anchor))throw Error('REVIEW_DUELS2_UI_STARTUP');
 // Keep every existing avatar/photo renderer, tutor tab and platform Auth path intact.
 source=source.replace(anchor,runtime.replace('/*DUELS2_CSS*/',JSON.stringify(css)).replace('/*DUELS2_HISTORY*/',mergeDuelHistory.toString())+'\n'+anchor);
 source=source.replaceAll("'90 segundos por pregunta · gana quien tenga más aciertos.'","(a.version===2?'Tiempo por pregunta según asignatura · los errores favorecen al rival.':'90 segundos por pregunta · gana quien tenga más aciertos.')");
 source=source.replaceAll('<strong>90 segundos</strong> por pregunta',"'+(d2Available?'<strong>Tiempo por pregunta</strong> según asignatura':'<strong>90 segundos</strong> por pregunta')+'");
 source=source.replaceAll('Desempate por tiempo',"'+(d.version===2?'Sin carrera de velocidad':'Desempate por tiempo')+'").replaceAll('Desempate<br>por tiempo',"'+(d.version===2?'Sin carrera<br>de velocidad':'Desempate<br>por tiempo')+'").replaceAll('Solo si hay igual cantidad de aciertos.',"'+(d.version===2?'Los empates se conservan.':'Solo si hay igual cantidad de aciertos.')+'");
 source=source.replaceAll('Te emparejaremos con otro estudiante disponible.',"'+(d2Available?'Primero buscamos una persona. Tras 10 segundos, un rival virtual.':'Te emparejaremos con otro estudiante disponible.')+'");
 source=source.replaceAll('El encuentro es por turnos. Puedes actualizar las invitaciones; no necesitas permanecer conectado.',"'+(d2Available?'Buscamos personas por 10 segundos. Si no hay un rival disponible, jugarás con un bot identificado.':'El encuentro es por turnos. Puedes actualizar las invitaciones; no necesitas permanecer conectado.')+'");
 source=source.replaceAll("esc(r.creator.correct)","esc(d.version===2?r.creator.mastery:r.creator.correct)").replaceAll("esc(r.opponent.correct)","esc(d.version===2?r.opponent.mastery:r.opponent.correct)");
 source=source.replaceAll('<small> / 10</small>','<small> / \'+(d.version===2?\'20\':\'10\')+\'</small>');
 source=source.replace("r.reason==='correct'?","r.reason==='both_abandoned'?'Ambos dejaron el duelo. No cambian las estrellas.':r.reason==='mastery'?'Se decidió por dominio. Cada acierto suma para ti y cada error suma para tu rival.':r.reason==='correct'?");
 source=source.replaceAll('Igualaron en aciertos y tiempo válido.',"'+(d.version===2?'Igualaron en dominio. El tiempo no desempata.':'Igualaron en aciertos y tiempo válido.')+'");
 source=source.replace("function safetyButton(p){","function safetyButton(p){if(p?.virtual)return '';");
 source=source.replaceAll("'estrella competitiva'","'estrellas competitivas'");
 // Mandatory review: preserve tutorial body and restore the selected alternative + passage.
 const review="'<p><strong>Respuesta:</strong> '+esc(q.options?.[r.answer])";
 if(!source.includes(review))throw Error('REVIEW_DUELS2_EDUCATIONAL_REVIEW');
 source=source.replace(review,"(q.passage?'<details class=\"reading-passage\" open><summary>'+esc(q.passage.title||'Texto de lectura')+'</summary>'+passageHtml(q.passage)+'</details>':'')+'<p><strong>Tu alternativa:</strong> '+esc(r.choice===null?'Sin responder':q.options?.[r.choice])+'</p><p><strong>Respuesta:</strong> '+esc(q.options?.[r.answer])");
 return source;
}
