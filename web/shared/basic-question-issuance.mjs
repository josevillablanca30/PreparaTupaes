// Pure server-side question issuance. Do not expose the returned answerKey to clients.
// The caller must persist answerKey against an authenticated reserved attempt on
// the server and return only publicQuestions. Not wired to production.
const validUuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function issueBasicQuestions({attemptId,questions}={}){
 if(typeof attemptId!=='string'||!validUuid.test(attemptId)||
    !Array.isArray(questions)||questions.length<1||questions.length>80)
  throw Error('INVALID_ISSUANCE');
 const ids=new Set();
 const publicQuestions=[],answerKey=[];
 for(const question of questions){
  if(!question||typeof question.id!=='string'||!question.id||question.id.length>128||ids.has(question.id)||
     typeof question.prompt!=='string'||!question.prompt.trim()||question.prompt.length>10000||
     !Array.isArray(question.options)||question.options.length<2||question.options.length>8||
     question.options.some(x=>typeof x!=='string'||!x.trim()||x.length>2000)||
     !Number.isInteger(question.answerIndex)||question.answerIndex<0||question.answerIndex>=question.options.length)
   throw Error('INVALID_TRUSTED_QUESTION');
  ids.add(question.id);
  publicQuestions.push(Object.freeze({id:question.id,prompt:question.prompt,options:Object.freeze([...question.options])}));
  answerKey.push(Object.freeze({id:question.id,options:Object.freeze([...question.options]),answerIndex:question.answerIndex}));
 }
 return Object.freeze({attemptId,publicQuestions:Object.freeze(publicQuestions),answerKey:Object.freeze(answerKey)});
}
