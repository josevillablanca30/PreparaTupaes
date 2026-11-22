import {verifyBasicAnswers} from './basic-answer-verification.mjs';

// Server orchestration only. loadIssuedAttempt MUST fetch a trusted, persisted
// question key for the authenticated user. commitCompletion MUST be a privileged
// DB operation. Never accept either dependency or the answer key from HTTP JSON.
export async function completeVerifiedBasicAttempt({userId,attemptId,answers,loadIssuedAttempt,commitCompletion}={}){
 if(typeof userId!=='string'||!userId||typeof loadIssuedAttempt!=='function'||typeof commitCompletion!=='function')
  throw Error('SERVER_CONFIGURATION_REQUIRED');
 const issued=await loadIssuedAttempt({userId,attemptId});
 if(!issued||issued.userId!==userId||issued.attemptId!==attemptId||
    issued.status!=='reserved'||!Array.isArray(issued.answerKey))
  throw Error('ATTEMPT_NOT_ELIGIBLE');
 const grading=verifyBasicAnswers({attemptId,issuedQuestions:issued.answerKey,answers});
 // No client-provided "complete", score, or correctness value is trusted.
 const committed=await commitCompletion({userId,attemptId,grading});
 if(!committed||committed.completed!==true)throw Error('COMPLETION_NOT_COMMITTED');
 return Object.freeze({attemptId,correct:grading.correct,total:grading.total,completed:true});
}
