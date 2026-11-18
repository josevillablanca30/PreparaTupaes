// Verified Basic history is read-only and backed by server-attested ledger rows.
// Never derive authoritative completions from local storage or client submissions.
export async function fetchBasicVerifiedProgress({fetcher=fetch,accessToken=null}={}){
 const response=await fetcher('/api/basic/verified-progress',{
  method:'GET',credentials:'same-origin',headers:{
   'x-cachaste-request':'1',...(accessToken?{authorization:'Bearer '+accessToken}:{})
  }
 });
 if(!response.ok)throw Error(response.status===503?'BASIC_NOT_READY':'BASIC_PROGRESS_UNAVAILABLE');
 const data=await response.json();
 if(!data||!Array.isArray(data.verifiedCompletions)||
    data.verifiedCompletions.some(item=>!item||typeof item.eventId!=='string'||
     !['lesson','diagnostic','expressExam','duel'].includes(item.kind)||
     !['m1','m2','lectora','ciencias','historia','all'].includes(item.subject)))
  throw Error('INVALID_BASIC_PROGRESS');
 return Object.freeze({day:data.day,verifiedCompletions:Object.freeze(data.verifiedCompletions.map(x=>Object.freeze({...x})))});
}
