// Display-only history from the authenticated, server-attested completion ledger.
// Never use this snapshot to grant access or award points on the client.
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const day=/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
const subjects=new Set(['m1','m2','lectora','ciencias','historia']);
export async function fetchBasicVerifiedProgress({fetcher=fetch,accessToken=null}={}){
 if(accessToken!==null&&(typeof accessToken!=='string'||accessToken.length<10))throw Error('INVALID_AUTH_TOKEN');
 const response=await fetcher('/api/basic/verified-progress',{
  method:'GET',credentials:'same-origin',headers:{
   'x-cachaste-request':'1',...(accessToken?{authorization:'Bearer '+accessToken}:{})
  }
 });
 if(!response.ok)throw Error(response.status===503?'BASIC_NOT_READY':'BASIC_PROGRESS_UNAVAILABLE');
 const data=await response.json();
 if(!data||typeof data!=='object'||Array.isArray(data)||!day.test(data.day||'')||
    !Array.isArray(data.verifiedCompletions)||data.verifiedCompletions.length>100)
  throw Error('INVALID_BASIC_PROGRESS');
 const ids=new Set();
 for(const item of data.verifiedCompletions){
  if(!item||typeof item!=='object'||Array.isArray(item)||
     typeof item.eventId!=='string'||!uuid.test(item.eventId)||ids.has(item.eventId)||
     !['lesson','diagnostic','expressExam'].includes(item.kind)||
     !(item.kind==='expressExam'?item.subject==='all':subjects.has(item.subject))||
     !day.test(item.day||'')||typeof item.recordedAt!=='string'||
     !Number.isFinite(Date.parse(item.recordedAt)))throw Error('INVALID_BASIC_PROGRESS');
  ids.add(item.eventId);
 }
 return Object.freeze({day:data.day,verifiedCompletions:Object.freeze(data.verifiedCompletions.map(item=>Object.freeze({
  eventId:item.eventId,kind:item.kind,subject:item.subject,day:item.day,recordedAt:item.recordedAt
 })))});
}
