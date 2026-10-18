import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {loadBanks} from './load-banks.mjs';
import {buildTransfers} from './paes-transfer-2027.mjs';
import {transferCasesBatch2} from './paes-transfer-batch2-2027.mjs';
import {transferCasesBatch3} from './paes-transfer-batch3-2027.mjs';
import {transferCasesBatch4} from './paes-transfer-batch4-2027.mjs';
import {transferCasesBatch5} from './paes-transfer-batch5-2027.mjs';
import {transferCasesBatch6} from './paes-transfer-batch6-2027.mjs';
import {transferCasesBatch7} from './paes-transfer-batch7-2027.mjs';
import {transferCasesBatch8} from './paes-transfer-batch8-2027.mjs';
import {transferCasesBatch9} from './paes-transfer-batch9-2027.mjs';
import {transferCasesBatch10} from './paes-transfer-batch10-2027.mjs';
import {transferCasesBatch11} from './paes-transfer-batch11-2027.mjs';
import {transferCasesBatch12} from './paes-transfer-batch12-2027.mjs';
import {transferCasesBatch13} from './paes-transfer-batch13-2027.mjs';

const batches=[undefined,transferCasesBatch2,transferCasesBatch3,transferCasesBatch4,
 transferCasesBatch5,transferCasesBatch6,transferCasesBatch7,transferCasesBatch8,
 transferCasesBatch9,transferCasesBatch10,transferCasesBatch11,transferCasesBatch12,transferCasesBatch13];

export function dailyCatalog(){
 const ctx=vm.createContext({});
 vm.runInContext(readFileSync(new URL('../daily-curriculum.js',import.meta.url),'utf8'),ctx);
 const all=loadBanks(),items=[];
 for(const subjectKey of Object.keys(ctx.CachasteCurriculum.subjects)){
  for(const q of all[subjectKey]){
   const meta=ctx.CachasteCurriculum.classify(subjectKey,q),id=String(q.id);
   items.push({...q,...meta,id,sourceId:q.id,question:q.question||q.q,subjectKey,
    key:subjectKey+':'+id,family:subjectKey+':'+(q.transferGroup||id),
    transferGroup:q.transferGroup?String(q.transferGroup):undefined,
    levelId:subjectKey+':'+meta.axis+':'+meta.unit+':'+q.concept});
  }
 }
 for(const batch of batches)items.push(...buildTransfers(items,batch));
 return {items,texts:all.texts};
}
