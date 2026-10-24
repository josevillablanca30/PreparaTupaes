import {STORAGE_KEYS,MAX_DOCUMENT_BYTES} from './config.mjs';
const isObject=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const stable=x=>JSON.stringify(x);
const rowId=(row)=>row?.eventId||row?.dailyEventId||row?.receiptId||row?.sessionId&&row?.key&&`${row.sessionId}:${row.key}`||row?.id&&row?.at&&`${row.id}:${row.at}`||stable(row);
function union(a,b){const map=new Map();for(const row of [...a,...b])map.set(typeof row==='object'?rowId(row):stable(row),row);return [...map.values()];}
// Three-way merge. Additive history can merge; competing drafts stay explicit conflicts.
export function mergeDocument(base,local,remote,path=''){
 if(stable(local)===stable(remote))return {value:local,conflicts:[]};
 if(stable(base)===stable(remote))return {value:local,conflicts:[]};
 if(stable(base)===stable(local))return {value:remote,conflicts:[]};
 if(Array.isArray(local)&&Array.isArray(remote))return {value:union(remote,local),conflicts:[]};
 if(isObject(local)&&isObject(remote)){
  const value={},conflicts=[];
  for(const key of new Set([...Object.keys(local),...Object.keys(remote)])){
   const here=path?path+'.'+key:key;
   if(['session','foundationDraft','studioDraft','visualDraft','celebration'].includes(key)&&stable(local[key])!==stable(remote[key])&&stable(local[key])!==stable(base?.[key])&&stable(remote[key])!==stable(base?.[key])){
    value[key]=local[key];conflicts.push(here);continue;
   }
   if(key==='count'&&path.startsWith('seen.')&&Number.isFinite(local[key])&&Number.isFinite(remote[key])){value[key]=Math.max(local[key],remote[key]);continue;}
   if(['xp','counter'].includes(key)&&Number.isFinite(local[key])&&Number.isFinite(remote[key])){value[key]=Math.max(local[key],remote[key]);continue;}
   if(['first','last','lastAt','nextAt'].includes(key)&&Number.isFinite(local[key])&&Number.isFinite(remote[key])){value[key]=key==='first'?Math.min(local[key],remote[key]):Math.max(local[key],remote[key]);continue;}
   const merged=mergeDocument(base?.[key],local[key],remote[key],here);value[key]=merged.value;conflicts.push(...merged.conflicts);
  }
  return {value,conflicts};
 }
 // Do not silently discard a concurrent scalar or delete. Keep both snapshots for review.
 return {value:local,conflicts:[path||'document']};
}
export function validateDocument(key,value){
 if(!STORAGE_KEYS.includes(key))throw Error('INVALID_PROGRESS_KEY');
 if(value!==null&&!isObject(value)&&!Array.isArray(value))throw Error('INVALID_PROGRESS_VALUE');
 if(new TextEncoder().encode(JSON.stringify(value)).length>MAX_DOCUMENT_BYTES)throw Error('PROGRESS_TOO_LARGE');
 return true;
}
