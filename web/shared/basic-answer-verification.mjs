// Server-side grading primitive for Basic attempts. Never import a browser-provided
// answer key or catalog: callers must supply a trusted server-owned question set.
// This alone does NOT attest an attempt or authorize completion.
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function verifyBasicAnswers({attemptId,issuedQuestions,answers}={}){
 if(typeof attemptId!=='string'||!uuid.test(attemptId))throw Error('INVALID_ATTEMPT_ID');
 if(!Array.isArray(issuedQuestions)||issuedQuestions.length<1||issuedQuestions.length>80||
    !Array.isArray(answers)||answers.length!==issuedQuestions.length)throw Error('INVALID_QUESTION_SET');
 const seen=new Set();
 let correct=0;
 for(let i=0;i<issuedQuestions.length;i++){
  const q=issuedQuestions[i],a=answers[i];
  if(!q||typeof q.id!=='string'||!q.id||seen.has(q.id)||
     !Array.isArray(q.options)||q.options.length<2||q.options.length>8||
     !Number.isInteger(q.answerIndex)||q.answerIndex<0||q.answerIndex>=q.options.length)
    throw Error('INVALID_TRUSTED_QUESTION');
  seen.add(q.id);
  if(!a||a.questionId!==q.id||!Number.isInteger(a.selectedIndex)||
     a.selectedIndex<0||a.selectedIndex>=q.options.length)
    throw Error('INVALID_ANSWER');
  if(a.selectedIndex===q.answerIndex)correct++;
 }
 return Object.freeze({attemptId,answered:answers.length,correct,total:issuedQuestions.length,complete:true});
}
