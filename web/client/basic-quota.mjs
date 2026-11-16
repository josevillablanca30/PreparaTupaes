// Cliente de cuotas: el servidor decide; nunca desbloquear por estado local.
import {PAES_SUBJECTS} from '../shared/access-tiers.mjs';
const VALID_KINDS=new Set(['lesson','diagnostic','expressExam','duel']);
export async function basicQuota({sdk,kind,subject='all',operation='check',eventId=null}){
 if(!sdk||!VALID_KINDS.has(kind)||!['check','consume'].includes(operation))throw Error('INVALID_QUOTA_REQUEST');
 if((kind==='lesson'||kind==='diagnostic')?!PAES_SUBJECTS.includes(subject):subject!=='all')throw Error('INVALID_SUBJECT');
 if(operation==='consume'&&!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(eventId||''))throw Error('EVENT_ID_REQUIRED');
 const {data,error}=await sdk.rpc('cachaste_basic_quota',{operation,kind,subject,event_id:eventId});
 if(error)throw error;
 if(typeof data?.allowed!=='boolean')throw Error('INVALID_QUOTA_RESPONSE');
 return data;
}
