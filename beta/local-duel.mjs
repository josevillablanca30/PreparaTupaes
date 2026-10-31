// Deliberately local: no Auth, subscription, educational-progress or ranking APIs.
export const STORAGE_KEY='cachaste-beta-vs:v1';
export const SUBJECTS={M1:'Matemática M1',M2:'Matemática M2',Lectura:'Competencia Lectora',Historia:'Historia y Ciencias Sociales',Ciencias:'Ciencias'};
export const QUESTION_MS=90000;
const phases=['versus','question','timeout','handoff','finished'];
const nickname=value=>String(value||'').trim().normalize('NFC');
const validName=value=>typeof value==='string'&&/^[\p{L}\p{N}_]{3,20}$/u.test(value);

export function pickQuestions(items,subject,track='',random=Math.random){
 if(!SUBJECTS[subject])throw new Error('Elige una asignatura.');
 const pool=items.filter(q=>q.subjectKey===subject&&!q.supplementary&&q.examEligible!==false&&(subject!=='Ciencias'||q.subject===track));
 for(let i=pool.length-1;i>0;i--){const j=Math.min(i,Math.floor(random()*(i+1)));[pool[i],pool[j]]=[pool[j],pool[i]];}
 const families=new Set(),questions=pool.filter(q=>{if(families.has(q.family))return false;families.add(q.family);return true;}).slice(0,10);
 if(questions.length!==10)throw new Error('No hay diez preguntas distintas disponibles.');
 return questions;
}

export class LocalDuel{
 constructor(catalog,snapshot=null){this.catalog=catalog;this.state=snapshot?this.restore(snapshot):null;}
 create({subject,track,players},random=Math.random){
  players=players.map((p,i)=>({nickname:nickname(p.nickname),avatar:i}));
  if(players.length!==2||players.some(p=>!validName(p.nickname)))throw new Error('Usen dos apodos de 3 a 20 letras, números o guion bajo.');
  if(players[0].nickname.toLocaleLowerCase('es')===players[1].nickname.toLocaleLowerCase('es'))throw new Error('Usen apodos distintos para reconocer cada turno.');
  const questions=pickQuestions(this.catalog.items,subject,track,random);
  this.state={version:1,phase:'versus',subject,track:subject==='Ciencias'?track:'',players,keys:questions.map(q=>q.key),answers:[[],[]],player:0,startedAt:null};
  return this.state;
 }
 restore(raw){
  if(!raw||raw.version!==1||!phases.includes(raw.phase)||!SUBJECTS[raw.subject]||![0,1].includes(raw.player))throw new Error('Partida local no válida.');
  if(!Array.isArray(raw.players)||raw.players.length!==2||raw.players.some(p=>!validName(p.nickname)||![0,1].includes(p.avatar)))throw new Error('Jugadores no válidos.');
  if(raw.players[0].nickname.toLocaleLowerCase('es')===raw.players[1].nickname.toLocaleLowerCase('es'))throw new Error('Apodos repetidos.');
  if(!Array.isArray(raw.keys)||raw.keys.length!==10||new Set(raw.keys).size!==10)throw new Error('Preguntas no válidas.');
  const questions=raw.keys.map(key=>this.catalog.items.find(q=>q.key===key));
  if(questions.some(q=>!q||q.subjectKey!==raw.subject||q.supplementary||q.examEligible===false||(raw.subject==='Ciencias'&&q.subject!==raw.track))||new Set(questions.map(q=>q.family)).size!==10)throw new Error('Banco de preguntas cambiado.');
  if(!Array.isArray(raw.answers)||raw.answers.length!==2||raw.answers.some(a=>!Array.isArray(a)||a.length>10||a.some((r,i)=>!r||!(r.choice===null||Number.isInteger(r.choice)&&r.choice>=0&&r.choice<questions[i].options.length)||!Number.isFinite(r.elapsedMs)||r.elapsedMs<0||r.elapsedMs>QUESTION_MS)))throw new Error('Respuestas no válidas.');
  const [a,b]=raw.answers.map(a=>a.length),p=raw.phase;
  if(p==='versus'&&(a||b||raw.player!==0)||p==='handoff'&&(a!==10||b!==0||raw.player!==1)||p==='finished'&&(a!==10||b!==10||raw.player!==1)||['question','timeout'].includes(p)&&(raw.player===0?(a>=10||b!==0):(a!==10||b>=10)))throw new Error('Turnos no válidos.');
  if(p==='question'&&(!Number.isFinite(raw.startedAt)||raw.startedAt<0)||p!=='question'&&raw.startedAt!==null)throw new Error('Reloj no válido.');
  return structuredClone(raw);
 }
 question(){return this.catalog.items.find(q=>q.key===this.state.keys[this.state.answers[this.state.player].length]);}
 begin(now=Date.now()){
  if(!['versus','handoff','timeout'].includes(this.state?.phase))return false;
  this.state.phase='question';this.state.startedAt=now;return true;
 }
 remaining(now=Date.now()){return Math.max(0,QUESTION_MS-(now-this.state.startedAt));}
 answer(choice,now=Date.now()){
  const s=this.state;if(s?.phase!=='question')return false;
  const q=this.question(),elapsed=Math.max(0,Math.min(QUESTION_MS,now-s.startedAt)),expired=now-s.startedAt>=QUESTION_MS;
  if(!expired&&(!Number.isInteger(choice)||choice<0||choice>=q.options.length))return false;
  s.answers[s.player].push({choice:expired?null:choice,elapsedMs:elapsed});s.startedAt=null;
  if(s.answers[s.player].length===10){if(s.player===0){s.player=1;s.phase='handoff';}else s.phase='finished';}
  else if(expired)s.phase='timeout';
  else s.startedAt=now;
  return true;
 }
 result(){
  if(this.state?.phase!=='finished')return null;
  const s=this.state,scores=s.answers.map(a=>({correct:a.reduce((n,r,i)=>n+Number(r.choice===this.catalog.items.find(q=>q.key===s.keys[i]).answer),0),tenths:Math.round(a.reduce((n,r)=>n+r.elapsedMs,0)/100)}));
  const reason=scores[0].correct!==scores[1].correct?'correct':scores[0].tenths!==scores[1].tenths?'time':'draw';
  const winner=reason==='draw'?null:reason==='correct'?Number(scores[1].correct>scores[0].correct):Number(scores[1].tenths<scores[0].tenths);
  return {scores,reason,winner};
 }
 review(player){
  if(this.state?.phase!=='finished'||![0,1].includes(player))return [];
  return this.state.keys.map((key,i)=>{const question=this.catalog.items.find(q=>q.key===key);return {question,...this.state.answers[player][i]};});
 }
}
