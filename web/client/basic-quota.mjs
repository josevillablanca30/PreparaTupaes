// Cliente de cuotas: el servidor decide; nunca desbloquear por estado local.
import {PAES_SUBJECTS} from '../shared/access-tiers.mjs';
const VALID_KINDS=new Set(['lesson','diagnostic','expressExam','duel']);
export async function basicQuota({sdk,kind,subject='all',operation='check',eventId=null}){
 if(!sdk||!VALID_KINDS.has(kind)||!['check','consume'].includes(operation))throw Error('INVALID_QUOTA_REQUEST');
 if((kind==='lesson'||kind==='diagnostic')?!PAES_SUBJECTS.includes(subject):subject!=='all')throw Error('INVALID_SUBJECT');
 if(operation==='consume'&&!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(eventId||''))throw Error('EVENT_ID_REQUIRED');
 const {data,error}=await sdk.rpc('cachaste_basic_quota',{operation,kind,subject,event_id:eventId});
 if(error)throw error;
 if(typeof data?.allowed!=='boolean'||!['premium','basica'].includes(data.tier))throw Error('INVALID_QUOTA_RESPONSE');
 return data;
}

/**
 * The commercial web app uses the gateway rather than direct Supabase RPC.
 * Fail closed when quota service is unavailable or when the release is not ready.
 */
export async function basicQuotaGateway({kind,subject='all',operation='check',eventId=null,fetcher=fetch,accessToken=null}){
 if(!VALID_KINDS.has(kind)||!['check','consume'].includes(operation))throw Error('INVALID_QUOTA_REQUEST');
 if((kind==='lesson'||kind==='diagnostic')?!PAES_SUBJECTS.includes(subject):subject!=='all')throw Error('INVALID_SUBJECT');
 if(operation==='consume'&&!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(eventId||''))throw Error('EVENT_ID_REQUIRED');
 if(accessToken!==null&&(typeof accessToken!=='string'||accessToken.length<10))throw Error('INVALID_AUTH_TOKEN');
 const response=await fetcher('/api/basic/quota',{
  method:'POST',credentials:'same-origin',
  headers:{'content-type':'application/json','x-cachaste-request':'1',...(accessToken?{authorization:'Bearer '+accessToken}:{})},
  body:JSON.stringify({operation,kind,subject,eventId})
 });
 if(!response.ok)throw Error(response.status===503?'BASIC_NOT_READY':'BASIC_QUOTA_UNAVAILABLE');
 const result=await response.json();
 if(typeof result?.allowed!=='boolean'||!['premium','basica'].includes(result.tier)||result.tier==='basica'&&(!Number.isInteger(result.remaining)&&result.replayed!==true||result.remaining<0))throw Error('INVALID_QUOTA_RESPONSE');
 return result;
}

/**
 * Server-sourced dashboard. Never derive authorization from this display-only snapshot.
 * An invalid response fails closed rather than displaying fabricated remaining attempts.
 */
export async function basicQuotaSummary({fetcher=fetch,accessToken=null}={}){
 if(accessToken!==null&&(typeof accessToken!=='string'||accessToken.length<10))throw Error('INVALID_AUTH_TOKEN');
 const response=await fetcher('/api/basic/summary',{method:'GET',credentials:'same-origin',headers:accessToken?{authorization:'Bearer '+accessToken}:{}});
 if(!response.ok)throw Error(response.status===503?'BASIC_NOT_READY':'BASIC_QUOTA_UNAVAILABLE');
 const result=await response.json();
 if(result?.tier==='premium'&&result.unlimited===true)return result;
 if(result?.tier!=='basica'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(result.day||''))throw Error('INVALID_QUOTA_RESPONSE');
 const validRemaining=n=>Number.isInteger(n)&&n>=0;
 for(const subject of PAES_SUBJECTS){
  if(!validRemaining(result.lessonsRemaining?.[subject])||result.lessonsRemaining[subject]>3||
     !validRemaining(result.diagnosticsRemaining?.[subject])||result.diagnosticsRemaining[subject]>1)
   throw Error('INVALID_QUOTA_RESPONSE');
 }
 if(!validRemaining(result.expressExamsRemaining)||result.expressExamsRemaining>1||
    !validRemaining(result.duelsRemaining)||result.duelsRemaining>2||
    result.fullExamsRemaining!==0)throw Error('INVALID_QUOTA_RESPONSE');
 return result;
}

/**
 * Admission preflight for the actual daily-app mode/subject vocabulary.
 * This is NOT an activity start token or proof of completion.
 * Fail closed on malformed responses and exhausted quota.
 */
export async function basicActivityAdmission({mode,subject,fetcher=fetch,accessToken=null}={}){
 if(typeof mode!=='string'||typeof subject!=='string'||mode.length>32||subject.length>32)throw Error('INVALID_ACTIVITY');
 if(accessToken!==null&&(typeof accessToken!=='string'||accessToken.length<10))throw Error('INVALID_AUTH_TOKEN');
 const response=await fetcher('/api/basic/admission',{
  method:'POST',credentials:'same-origin',
  headers:{'content-type':'application/json','x-cachaste-request':'1',...(accessToken?{authorization:'Bearer '+accessToken}:{})},
  body:JSON.stringify({mode,subject})
 });
 if(!response.ok)throw Error(response.status===503?'BASIC_NOT_READY':response.status===403?'PREMIUM_OR_BASIC_RESTRICTION':'BASIC_ADMISSION_UNAVAILABLE');
 const result=await response.json();
 if(result?.preflightOnly!==true||typeof result.allowed!=='boolean'||!['premium','basica'].includes(result.tier)||
  !['lesson','diagnostic','expressExam'].includes(result.kind)||
  !['m1','m2','lectora','ciencias','historia','all'].includes(result.subject)||
  (result.kind==='expressExam')!==(result.subject==='all')||
  (result.tier==='basica'&&(!Number.isInteger(result.remaining)||result.remaining<0))||
  (result.allowed===false&&result.tier==='basica'&&result.remaining!==0))
  throw Error('INVALID_ADMISSION_RESPONSE');
 return result;
}

/**
 * UI admission guard. It never invokes the learning engine when a server check
 * fails, and does not pretend that preflight reserves a quota slot.
 */
export async function withBasicAdmission({mode,subject,accessToken=null,fetcher=fetch,start}={}){
 if(typeof start!=='function')throw Error('ACTIVITY_START_REQUIRED');
 const decision=await basicActivityAdmission({mode,subject,accessToken,fetcher});
 if(!decision.allowed)return Object.freeze({started:false,reason:'BASIC_QUOTA_EXHAUSTED',decision});
 // Server-side attempt reservation and completion attestation are still required
 // before this can be wired to production Basic learning activities.
 return Object.freeze({started:false,reason:'BASIC_ATTEMPT_RESERVATION_NOT_READY',decision});
}

/**
 * Atomic reservation client, deliberately separate from the read-only preflight.
 * A successful reservation is not a verified completion.
 */
export async function basicReserveActivity({mode,subject,requestKey,fetcher=fetch,accessToken=null}={}){
 if(typeof requestKey!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestKey))throw Error('INVALID_REQUEST_KEY');
 if(typeof mode!=='string'||typeof subject!=='string'||mode.length>32||subject.length>32)throw Error('INVALID_ACTIVITY');
 if(accessToken!==null&&(typeof accessToken!=='string'||accessToken.length<10))throw Error('INVALID_AUTH_TOKEN');
 const response=await fetcher('/api/basic/reserve',{
  method:'POST',credentials:'same-origin',
  headers:{'content-type':'application/json','x-cachaste-request':'1',...(accessToken?{authorization:'Bearer '+accessToken}:{})},
  body:JSON.stringify({mode,subject,requestKey})
 });
 if(!response.ok)throw Error(response.status===503?'BASIC_NOT_READY':response.status===403?'PREMIUM_OR_BASIC_RESTRICTION':'BASIC_RESERVATION_UNAVAILABLE');
 const result=await response.json();
 if(result?.tier==='premium'&&result.allowed===true&&result.unlimited===true)return result;
 if(result?.tier!=='basica'||typeof result.allowed!=='boolean'||
  !Number.isInteger(result.remaining)||result.remaining<0||result.remaining>3||
  (result.allowed&&(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(result.attemptId||'')||
  !/^\d{4}-\d{2}-\d{2}$/.test(result.day||'')))||
  (!result.allowed&&result.remaining!==0))
  throw Error('INVALID_RESERVATION_RESPONSE');
 return result;
}

/**
 * Launches a Basic activity only after the server has atomically reserved a slot.
 * The callback receives the opaque attempt ID for future server attestation.
 * A reservation is spent even if the caller later fails; no client-side refund.
 */
export async function withBasicReservation({mode,subject,requestKey,fetcher=fetch,accessToken=null,start}={}){
 if(typeof start!=='function')throw Error('ACTIVITY_START_REQUIRED');
 const decision=await basicReserveActivity({mode,subject,requestKey,fetcher,accessToken});
 if(!decision.allowed)return Object.freeze({started:false,reason:'BASIC_QUOTA_EXHAUSTED',decision});
 if(decision.tier==='premium')return Object.freeze({started:true,decision,value:await start({tier:'premium',attemptId:null})});
 const value=await start({tier:'basica',attemptId:decision.attemptId});
 return Object.freeze({started:true,decision,value});
}
