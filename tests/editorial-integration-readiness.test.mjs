import test from 'node:test';
import assert from 'node:assert/strict';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
import {buildTransfers} from '../scripts/paes-transfer-2027.mjs';
import {historiaCandidates} from '../scripts/paes-transfer-candidates-historia-2027.mjs';
import {scienceCandidates} from '../scripts/paes-transfer-candidates-fisica-2027.mjs';
import {biologyCandidates} from '../scripts/paes-transfer-candidates-biologia-2027.mjs';
import {scienceExpansionCandidates} from '../scripts/paes-transfer-candidates-ciencias-expansion-2027.mjs';
import {scienceRemainingCandidates} from '../scripts/paes-transfer-candidates-ciencias-final-2027.mjs';
import {tpCandidates} from '../scripts/paes-transfer-candidates-tp-2027.mjs';

test('Puerta editorial: verificar catorce candidatos sin liberar contenido no revisado, sin desbloqueos ficticios',()=>{
 const {items}=dailyCatalog();
 const rows=[...historiaCandidates,...scienceCandidates,...biologyCandidates,...scienceExpansionCandidates,...scienceRemainingCandidates,...tpCandidates];
 const candidates=buildTransfers(items,rows);
 assert.equal(candidates.length,14);
 assert.equal(items.length,788,'No modificar el banco comercial sin una migración validada');
 assert.equal(new Set(candidates.map(q=>q.key)).size,14,'Cada ejercicio candidato tiene ID único');
 for(const candidate of candidates){
  const original=items.find(q=>q.key===candidate.sourceKey);
  assert.ok(original,'Debe existir el ítem original para '+candidate.key);
  assert.equal(candidate.concept,original.concept,'Debe conservar el objetivo pedagógico');
  assert.ok(candidate.sourceTrace?.reviewStatus?.includes('pendiente'),'El ejercicio todavía requiere cotejo curricular: '+candidate.key);
  assert.ok(!items.some(q=>q.key===candidate.key),'No publicar por accidente un candidato: '+candidate.key);
  if(candidate.sourceTrace.targetTrack==='TP')assert.equal(candidate.module,'MTP','La evidencia TP debe dirigirse exclusivamente a TP');
 }

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
 assert.equal(missing.length,0,'Las catorce transferencias candidatas cubren las brechas de evidencia sin cruzar menciones');
 assert.ok(missing.every(x=>x.track==='TP'&&['Ventilación y demanda metabólica','Defensas innatas y memoria inmune','Tono e intensidad del sonido'].includes(x.concept)));
 assert.ok(missing.every(x=>x.subject==='Ciencias'));
});
