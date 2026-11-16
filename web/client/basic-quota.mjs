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
export async function basicQuotaGateway({kind,subject='all',operation='check',eventId=null,fetcher=fetch}){
 if(!VALID_KINDS.has(kind)||!['check','consume'].includes(operation))throw Error('INVALID_QUOTA_REQUEST');
 if((kind==='lesson'||kind==='diagnostic')?!PAES_SUBJECTS.includes(subject):subject!=='all')throw Error('INVALID_SUBJECT');
 if(operation==='consume'&&!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(eventId||''))throw Error('EVENT_ID_REQUIRED');
 const response=await fetcher('/api/basic/quota',{
  method:'POST',credentials:'same-origin',
  headers:{'content-type':'application/json','x-cachaste-request':'1'},
  body:JSON.stringify({operation,kind,subject,eventId})
 });
 if(!response.ok)throw Error(response.status===503?'BASIC_NOT_READY':'BASIC_QUOTA_UNAVAILABLE');
 const result=await response.json();
 if(typeof result?.allowed!=='boolean'||!['premium','basica'].includes(result.tier))throw Error('INVALID_QUOTA_RESPONSE');
 return result;
}
