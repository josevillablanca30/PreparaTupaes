import {issueBasicQuestions} from '../shared/basic-question-issuance.mjs';
// Private, reviewed server bank. Never expose answerIndex or source catalog to clients.
const subjects=['m1','m2','lectora','ciencias','historia'];
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function randomIndex(length){
 if(!Number.isSafeInteger(length)||length<1)throw Error('INVALID_RANDOM_RANGE');
 // Rejection sampling avoids modulo bias, including for small uneven pools.
 const range=0x100000000,limit=Math.floor(range/length)*length;
 let n;do{const values=new Uint32Array(1);crypto.getRandomValues(values);n=values[0];}while(n>=limit);
 return n%length;
}
export function prepareBasicIssuance({attemptId,subject,kind,bankJson}={}){
 if(!uuid.test(attemptId||'')||
    !['lesson','diagnostic','expressExam'].includes(kind)||
    !subjects.includes(subject)||
    typeof bankJson!=='string'||bankJson.length>2000000)throw Error('BASIC_ISSUANCE_NOT_READY');
 let bank;try{bank=JSON.parse(bankJson);}catch{throw Error('INVALID_SERVER_BANK');}
 if(!bank||typeof bank!=='object'||Array.isArray(bank))throw Error('INVALID_SERVER_BANK');
 const count=kind==='diagnostic'?30:kind==='expressExam'?15:10;
 const source=[subject];
 const pool=[];
 for(const s of source){
  if(!Array.isArray(bank[s]))throw Error('INVALID_SERVER_BANK');
  for(const q of bank[s]){
   if(q?.status==='reviewed'&&q?.origin?.rights==='owned'){
    if(q.subject?.toLowerCase()!==s&&q.subject!==undefined)throw Error('INVALID_SERVER_BANK');
    pool.push(q);
   }
  }
 }
 const unique=new Set(pool.map(q=>q.id));
 if(pool.length<count)throw Error('INSUFFICIENT_REVIEWED_QUESTIONS');
 if(unique.size!==pool.length)throw Error('DUPLICATE_QUESTION_IDS');
 const selected=[],available=[...pool];
 for(let i=0;i<count;i++)selected.push(available.splice(randomIndex(available.length),1)[0]);
 return issueBasicQuestions({attemptId,questions:selected});
}
