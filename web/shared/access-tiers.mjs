// Política compartida de producto. La autorización real debe ocurrir en Supabase.
export const BASIC_LIMITS=Object.freeze({
  lessonsPerSubjectPerDay:3,
  diagnosticsPerSubjectLifetime:1,
  expressExamsPerDay:1,
  duelsPerDay:2,
  fullExamsPerDay:0
});
export const PAES_SUBJECTS=Object.freeze(['m1','m2','lectora','ciencias','historia']);
export const MONTHLY_TRIAL=Object.freeze({days:7,renewalPlan:'mensual',renewalAmountCLP:7990});
export function accessTier(access){
  return access?.active===true?'premium':access?.basicEnabled===true?'basica':'unavailable';
}
export function basicQuota({kind,subject,used=0,diagnosticUsed=false}){
  if(!Number.isInteger(used)||used<0)throw Error('INVALID_USAGE');
  if(kind==='fullExam')return {allowed:false,remaining:0};
  if(kind==='lesson'||kind==='diagnostic'){
    if(!PAES_SUBJECTS.includes(subject))throw Error('INVALID_SUBJECT');
    if(kind==='diagnostic')return {allowed:!diagnosticUsed,remaining:diagnosticUsed?0:1};
    return {allowed:used<BASIC_LIMITS.lessonsPerSubjectPerDay,remaining:Math.max(0,BASIC_LIMITS.lessonsPerSubjectPerDay-used)};
  }
  const limit=kind==='expressExam'?BASIC_LIMITS.expressExamsPerDay:kind==='duel'?BASIC_LIMITS.duelsPerDay:null;
  if(limit===null)throw Error('INVALID_KIND');
  return {allowed:used<limit,remaining:Math.max(0,limit-used)};
}
