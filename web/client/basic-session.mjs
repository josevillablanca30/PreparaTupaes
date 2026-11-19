// Integration adapter for Basic learning engines. The engine must render only
// server-issued questions; do not pass local catalog questions into this flow.
// Not activated in daily-app until a trusted issuance endpoint is available.
import {basicReserveActivity,basicCompleteActivity} from './basic-quota.mjs';
import {classifyDailyAdmission} from '../shared/basic-completion-contract.mjs';
import {fetchBasicVerifiedProgress} from './basic-verified-progress.mjs';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function createBasicLearningSession({fetcher=fetch,accessToken=null}={}){
 let current=null,phase='idle';
 const snapshot=()=>Object.freeze({phase,attemptId:current?.attemptId??null});
 function acceptIssuedQuestions({attemptId,questions}={}){
   const admission=classifyDailyAdmission({mode:current?.mode,subject:current?.subject});
   const expected=admission.kind==='diagnostic'?30:admission.kind==='expressExam'?15:10;
   if(phase!=='reserved'||!current||!admission.allowed||attemptId!==current.attemptId||!Array.isArray(questions)||questions.length!==expected)throw Error('INVALID_BASIC_ISSUANCE');
   const ids=new Set();
   for(const q of questions){
    if(!q||typeof q.id!=='string'||!q.id||q.id.length>128||ids.has(q.id)||typeof q.prompt!=='string'||!q.prompt.trim()||q.prompt.length>10000||
       !Array.isArray(q.options)||q.options.length<2||q.options.length>8||q.options.some(x=>typeof x!=='string'||!x.trim()||x.length>2000)||
       Object.hasOwn(q,'answerIndex'))throw Error('INVALID_BASIC_ISSUANCE');
    ids.add(q.id);
   }
   // This method must only be called by the trusted issuance response handler.
   current={...current,questions:Object.freeze(questions.map(q=>Object.freeze({id:q.id,prompt:q.prompt,options:Object.freeze([...q.options])})))};
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
  // Single safe entry point for a Basic learning launcher: reserve first,
  // then fetch the immutable server-issued questions. Never start a local bank.
  async launch({mode,subject,requestKey}={}){
   if(phase!=='idle')throw Error('BASIC_SESSION_ALREADY_STARTED');
   const reserved=await this.start({mode,subject,requestKey});
   if(!current||phase!=='reserved')return reserved;
   const admission=classifyDailyAdmission({mode,subject});
   if(!admission.allowed)throw Error('BASIC_ACTIVITY_MISMATCH');
   const issued=await this.issue({subject:admission.kind==='expressExam'?({'M1':'m1','M2':'m2','Lectora':'lectora','Ciencias':'ciencias','Historia':'historia'}[subject]):admission.subject,kind:admission.kind});
   return Object.freeze({started:true,tier:'basica',attemptId:issued.attemptId,questions:issued.questions});
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
  // Recover a completion whose server response was lost. The ledger is the
  // authority; this never resubmits answers or invents a score.
  async recoverCompletion(){
   if(phase!=='issued'||!current)throw Error('BASIC_QUESTIONS_NOT_ISSUED');
   const progress=await fetchBasicVerifiedProgress({fetcher,accessToken});
   const verified=progress.verifiedCompletions.find(x=>x.eventId===current.attemptId);
   if(!verified)return Object.freeze({recovered:false,completed:false});
   const admission=classifyDailyAdmission({mode:current.mode,subject:current.subject});
   if(!admission.allowed||verified.kind!==admission.kind||verified.subject!==admission.subject)
    throw Error('INVALID_BASIC_PROGRESS');
   phase='completed';
   return Object.freeze({recovered:true,completed:true,attemptId:current.attemptId,scoreAvailable:false});
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
