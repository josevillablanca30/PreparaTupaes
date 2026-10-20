/* Asignaciones candidatas exclusivas a TP: reutilizan problemas originales transversales aún no publicados. */
import {biologyCandidates} from './paes-transfer-candidates-biologia-2027.mjs';
import {scienceRemainingCandidates} from './paes-transfer-candidates-ciencias-final-2027.mjs';
export const tpCandidates=[
 ...biologyCandidates.map((row,i)=>({...row,id:'TR-SCI-'+(97+i),targetModule:'MTP',
  sourceTrace:{...row.sourceTrace,reviewStatus:'pendiente-cotejo-demre-y-drive',targetTrack:'TP'},
  transferDesign:{...row.transferDesign,trackReview:'Aplicación al módulo técnico-profesional pendiente de cotejo editorial'}})),
 {...scienceRemainingCandidates[1],id:'TR-SCI-099',targetModule:'MTP',
  sourceTrace:{...scienceRemainingCandidates[1].sourceTrace,reviewStatus:'pendiente-cotejo-demre-y-drive',targetTrack:'TP'},
  transferDesign:{...scienceRemainingCandidates[1].transferDesign,trackReview:'Aplicación al módulo técnico-profesional pendiente de cotejo editorial'}}
];
