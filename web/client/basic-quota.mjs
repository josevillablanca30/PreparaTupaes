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
