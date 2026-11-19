import {PAES_SUBJECTS} from '../shared/access-tiers.mjs';
const NAMES=Object.freeze({m1:'Matemática M1',m2:'Matemática M2',lectora:'Competencia Lectora',ciencias:'Ciencias',historia:'Historia'});
/** Render only validated server quota snapshots; never use HTML as an access gate. */
export function renderBasicQuotaSummary(summary){
 if(summary?.tier==='premium'&&summary.unlimited===true)return '<section class="account-card" aria-label="Acceso Premium"><h2>Tu acceso Premium</h2><p>Práctica sin límites de Básica.</p></section>';
 if(summary?.tier!=='basica')throw Error('INVALID_QUOTA_RESPONSE');
 const safe=(value,max)=>{if(!Number.isInteger(value)||value<0||value>max)throw Error('INVALID_QUOTA_RESPONSE');return value;};
 const lessons=PAES_SUBJECTS.map(subject=>'<li><strong>'+NAMES[subject]+'</strong>: '+safe(summary.lessonsRemaining?.[subject],3)+' etapas y '+safe(summary.diagnosticsRemaining?.[subject],1)+' diagnóstico disponible(s)</li>').join('');
 const express=safe(summary.expressExamsRemaining,1),duels=safe(summary.duelsRemaining,2);
 if(summary.fullExamsRemaining!==0)throw Error('INVALID_QUOTA_RESPONSE');
 return '<section class="account-card" aria-label="Cupos Básica"><h2>Tu Básica de hoy</h2><p>Los cupos diarios se reinician según la hora de Chile. El diagnóstico es único por asignatura.</p><ul>'+lessons+'</ul><p>Ensayo Express: '+express+' disponible(s) · Duelos: '+duels+' disponible(s)</p><p>Ensayos PAES completos: solo Premium.</p></section>';
}
