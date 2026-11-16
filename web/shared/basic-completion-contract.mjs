// Maps actual daily-app session modes to quota categories.
// Classification is metadata only: never proof of completion or authorization to consume.
// A trusted server must independently verify the finished activity before recording usage.
const subjects=Object.freeze({M1:'m1',M2:'m2',Lectora:'lectora',Ciencias:'ciencias',Historia:'historia'});
export function classifyDailyCompletion({mode,subject}={}){
 const mapped=subjects[subject];
 if(!mapped||typeof mode!=='string')return null;
 if(mode==='diagnostic')return Object.freeze({kind:'diagnostic',subject:mapped});
 if(mode==='express-exam')return Object.freeze({kind:'expressExam',subject:'all'});
 if(mode==='lesson')return Object.freeze({kind:'lesson',subject:mapped});
 // Free/smart practice, unit exams, and full PAES exams are not interchangeable with lessons.
 return null;
}
export function classifyDuelCompletion({finished,matchId}={}){
 if(finished!==true||typeof matchId!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(matchId))return null;
 return Object.freeze({kind:'duel',subject:'all',eventId:matchId});
}
