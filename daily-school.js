/* School placement is an authored learning sequence, not DEMRE grade certification.
   Stable question/level IDs and previously earned evidence are never rewritten. */
(function(g){'use strict';
 const sources={
  math1:'https://www.curriculumnacional.cl/curriculum/7o-basico-2o-medio/matematica/1-medio',
  math2:'https://www.curriculumnacional.cl/curriculum/7o-basico-2o-medio/matematica/2-medio',
  math3:'https://www.curriculumnacional.cl/614/articles-140137_programa.pdf',
  math4:'https://www.curriculumnacional.cl/docente/629/w3-article-140142.html',
  history:'https://www.curriculumnacional.cl/614/articles-34441_programa.pdf',
  citizenship3:'https://www.curriculumnacional.cl/curriculum/3o-4o-medio/educacion-ciudadana-3m/3-medio-fg',
  citizenship4:'https://www.curriculumnacional.cl/curriculum/3o-4o-medio/educacion-ciudadana-4-medio/4-medio-fg'
 };
 const set=x=>new Set(x.split('|'));
 const m1Year1=set('Potencias y operaciones|Producto de potencias|Exponente negativo|Cuadrado de una suma|Diferencia de cuadrados|Términos semejantes|Sustitución con signos|Propiedad distributiva|Sistemas lineales|Escalas de longitudes|Semejanza de longitudes|Escala de áreas|Complemento de un evento|Unión de eventos|Eventos independientes|Extracción sin reposición|Eventos incompatibles');
 const m1Year2=set('Raíz cuadrada principal|Raíz cúbica|Simplificación de radicales|Cuadráticas y soluciones reales|Extremo de una cuadrática');
 const m2Year3=set('Función exponencial|Ecuaciones exponenciales|Dispersión');
 const m2Year4=set('Interés simple|Interés compuesto|Modelo binomial|Distribución normal|Funciones trigonométricas');
 const world19=set('Razón y crítica ilustrada|Igualdad jurídica en 1789|Industrialización y urbanización|Imperialismo y dominio colonial|Detonante y causas de la Primera Guerra Mundial');
 const chile19=set('Junta de 1810 e independencia|Minería exportadora y urbanización|Cuestión social|Predominio parlamentario tras 1891|Transporte y articulación de mercados|Ocupación de la Araucanía');
 function placement(subject,concept,unit){
  if(subject==='M1'){const year=m1Year2.has(concept)?2:m1Year1.has(concept)?1:0;return{year,label:year===0?'Bases para 1.º medio':year+'.º medio',source:year===2?sources.math2:sources.math1,relation:year===0?'prerrequisito':'consolidación y aplicación'};}
  if(subject==='M2'){const year=m2Year4.has(concept)?4:m2Year3.has(concept)?3:2;return{year,label:year+'.º medio · profundización M2',source:sources['math'+year],relation:year===2?'bases previas y profundización':'modelación y aplicación'};}
  if(subject==='Historia'){
   const year=unit==='Economía y sociedad'?4:unit==='Formación ciudadana'?3:unit==='Interpretación de fuentes'?3:world19.has(concept)||chile19.has(concept)?1:2;
   return{year,label:year===4?'4.º medio · aplicación económica':year===3?'3.º medio · ciudadanía y fuentes':year+'.º medio · procesos históricos',source:year===4?sources.citizenship4:year===3?sources.citizenship3:sources.history,relation:year>=3?'ubicación pedagógica; contenidos transversales':'contexto y procesos'};
  }
  return {year:null,label:subject==='Lectura'?'Lectura de enseñanza media · habilidades transversales':'Ciencias de enseñanza media · bases y profundización',source:null,relation:'sin equivalencia exclusiva a un curso'};
 }
 function sequence(units,subject){
  if(!['M1','M2','Historia'].includes(subject))return units.map(u=>({...u,schoolLabel:placement(subject,'',u.name).label,schoolYear:null}));
  const groups=[];let order=0;
  for(const u of units)for(const level of u.levels){const p=placement(subject,level.objective,u.name),legacyKey=u.axis+'|'+u.name,key=legacyKey+'|aula:'+p.year;let group=groups.find(g=>g.routeKey===key);if(!group)groups.push(group={...u,levels:[],schoolYear:p.year,schoolLabel:p.label,schoolSource:p.source,placementRelation:p.relation,legacyKey,routeKey:key,sourceOrder:order++});group.levels.push({...level,schoolYear:p.year,schoolLabel:p.label});}
  return groups.sort((a,b)=>a.schoolYear-b.schoolYear||a.sourceOrder-b.sourceOrder);
 }
 g.CachasteSchool={placement,sequence,sources,revision:'school-sequence-2026-10-20'};
})(typeof window==='undefined'?globalThis:window);
