import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {buildTransfers} from '../scripts/paes-transfer-2027.mjs';
import {historiaCandidates} from '../scripts/paes-transfer-candidates-historia-2027.mjs';
import {scienceCandidates} from '../scripts/paes-transfer-candidates-fisica-2027.mjs';
import {biologyCandidates} from '../scripts/paes-transfer-candidates-biologia-2027.mjs';
import {scienceExpansionCandidates} from '../scripts/paes-transfer-candidates-ciencias-expansion-2027.mjs';

test('Puerta editorial: informar brechas restantes después de revisar los nueve candidatos, sin desbloqueos ficticios',()=>{
 const {items}=dailyCatalog();
 const rows=[...historiaCandidates,...scienceCandidates,...biologyCandidates,...scienceExpansionCandidates];
 const candidates=buildTransfers(items,rows);
 assert.equal(candidates.length,9);
 assert.equal(items.length,788,'No modificar el banco comercial sin una migración validada');
 const combined=[...items,...candidates];
 const missing=[];
 for(const subject of ['M1','M2','Lectura','Historia','Ciencias']){
  const tracks=subject==='Ciencias'?['Biología','Física','Química','TP']:[null];
  for(const track of tracks){
   const applicable=combined.filter(q=>q.subjectKey===subject&&(subject!=='Ciencias'||q.module==='MC'||(track==='TP'?q.module==='MTP':q.module==='ME'&&q.subject===track)));
   const concepts=new Set(applicable.map(q=>q.concept));
   for(const concept of concepts){
    const matching=applicable.filter(q=>q.concept===concept);
    const eligible=matching.filter(q=>!q.supplementary&&q.examEligible!==false);
    const usable=eligible.length?eligible:matching;
    const families=new Set(usable.map(q=>q.transferGroup||q.family||q.key));
    if(families.size<2)missing.push({subject,track,concept});
   }
  }
 }
 console.log('CANDIDATOS: '+candidates.length+'; BRECHAS TRAS INTEGRACIÓN HIPOTÉTICA: '+JSON.stringify(missing));
 assert.equal(missing.filter(x=>x.subject==='Historia').length,0,'Los dos candidatos de Historia deben aportar una segunda familia, incluso si son complementarios');
 assert.equal(missing.length,5,'La simulación identifica cinco brechas específicas aún pendientes en las menciones de Ciencias');
 assert.ok(missing.every(x=>x.subject==='Ciencias'));
});
