import {issueBasicQuestions} from '../shared/basic-question-issuance.mjs';
// A server-only bank binding, never a public content file. Each item must be
// reviewed and owned, and must include its answerIndex. Fail closed otherwise.
const subjects=new Set(['m1','m2','lectora','ciencias','historia']);
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function prepareBasicIssuance({attemptId,subject,kind,bankJson}={}){
 if(!uuid.test(attemptId||'')||!subjects.has(subject)||
    !['lesson','diagnostic','expressExam'].includes(kind)||
    typeof bankJson!=='string'||bankJson.length>2000000)throw Error('BASIC_ISSUANCE_NOT_READY');
 let bank;try{bank=JSON.parse(bankJson);}catch{throw Error('INVALID_SERVER_BANK');}
 if(!bank||typeof bank!=='object'||Array.isArray(bank)||!Array.isArray(bank[subject]))throw Error('INVALID_SERVER_BANK');
 // Only one trusted bank per subject, with enough unique questions for each mode.
 const count=kind==='diagnostic'?30:kind==='expressExam'?15:10;
 const pool=bank[subject].filter(q=>q?.status==='reviewed'&&q?.origin?.rights==='owned');
 if(pool.length<count)throw Error('INSUFFICIENT_REVIEWED_QUESTIONS');
 // Random selection avoids fixed answer order across reservations.
 const selected=[];const available=[...pool];
 for(let i=0;i<count;i++){
  const random=new Uint32Array(1);crypto.getRandomValues(random);
  const index=random[0]%available.length;
  selected.push(available.splice(index,1)[0]);
 }
 return issueBasicQuestions({attemptId,questions:selected});
}
