// Integration adapter for Basic learning engines. The engine must render only
// server-issued questions; do not pass local catalog questions into this flow.
// Not activated in daily-app until a trusted issuance endpoint is available.
import {basicReserveActivity,basicCompleteActivity} from './basic-quota.mjs';
import {classifyDailyAdmission} from '../shared/basic-completion-contract.mjs';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function createBasicLearningSession({fetcher=fetch,accessToken=null}={}){
 let current=null,phase='idle';
 const snapshot=()=>Object.freeze({phase,attemptId:current?.attemptId??null});
 function acceptIssuedQuestions({attemptId,questions}={}){
   if(phase!=='reserved'||!current||attemptId!==current.attemptId||!Array.isArray(questions)||!questions.length||questions.length>80)throw Error('INVALID_BASIC_ISSUANCE');
   const ids=new Set();
   for(const q of questions){
    if(!q||typeof q.id!=='string'||!q.id||ids.has(q.id)||typeof q.prompt!=='string'||!q.prompt.trim()||
       !Array.isArray(q.options)||q.options.length<2||q.options.length>8||q.options.some(x=>typeof x!=='string'||!x.trim())||
       Object.hasOwn(q,'answerIndex'))throw Error('INVALID_BASIC_ISSUANCE');
    ids.add(q.id);
   }
   // This method must only be called by the trusted issuance response handler.
   current={...current,questions:questions.map(q=>({id:q.id,prompt:q.prompt,options:[...q.options]}))};
   phase='issued';return Object.freeze({questions:current.questions,attemptId});
  }

 return Object.freeze({
  snapshot,
  async start({mode,subject,requestKey}={}){
   if(phase!=='idle')throw Error('BASIC_SESSION_ALREADY_STARTED');
   phase='reserving';
   try{
    const reservation=await basicReserveActivity({mode,subject,requestKey,fetcher,accessToken});
    if(!reservation.allowed){phase='idle';return Object.freeze({started:false,reason:'BASIC_QUOTA_EXHAUSTED'});}
    if(reservation.tier!=='basica'||!uuid.test(reservation.attemptId||'')){
     phase='idle';throw Error('BASIC_ISSUANCE_NOT_READY');
    }
    current={attemptId:reservation.attemptId,mode,subject};
    phase='reserved';
    // A reservation is not a question issuance: never start the local engine here.
    return Object.freeze({started:false,reason:'BASIC_ISSUANCE_NOT_READY',attemptId:current.attemptId});
   }catch(error){if(phase==='reserving')phase='idle';throw error;}
  },
  async issue({subject,kind}={}){
   if(phase!=='reserved'||!current)throw Error('BASIC_RESERVATION_REQUIRED');
   const admission=classifyDailyAdmission({mode:current.mode,subject:current.subject});
   if(!admission.allowed||kind!==admission.kind||subject!==(kind==='expressExam'?({'M1':'m1','M2':'m2','Lectora':'lectora','Ciencias':'ciencias','Historia':'historia'}[current.subject]):admission.subject))throw Error('BASIC_ACTIVITY_MISMATCH');
   phase='issuing';
   try{
    const response=await fetcher('/api/basic/issue',{
     method:'POST',credentials:'same-origin',
     headers:{'content-type':'application/json','x-cachaste-request':'1',
      ...(accessToken?{authorization:'Bearer '+accessToken}:{})},
     body:JSON.stringify({attemptId:current.attemptId,subject,kind})
    });
    if(!response.ok)throw Error(response.status===503?'BASIC_NOT_READY':'BASIC_ISSUANCE_FAILED');
    const result=await response.json();
    phase='reserved';
    return acceptIssuedQuestions(result);
   }catch(error){if(phase==='issuing')phase='reserved';throw error;}
  },
  async finish({answers}={}){
   if(phase!=='issued'||!current)throw Error('BASIC_QUESTIONS_NOT_ISSUED');
   if(!Array.isArray(answers)||answers.length!==current.questions.length||answers.some((a,i)=>a?.questionId!==current.questions[i].id))throw Error('INVALID_BASIC_ANSWERS');
   phase='completing';
   try{
    const result=await basicCompleteActivity({attemptId:current.attemptId,answers,fetcher,accessToken});
    phase='completed';
    return result;
   }catch(error){phase='issued';throw error;}
  }
 });
}
