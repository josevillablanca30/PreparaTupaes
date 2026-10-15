/* Course organization is ours; the axes follow DEMRE Regular 2026 / Admisión 2027. */
(function(g){'use strict';
 const subjects={M1:{name:'Matemática M1',page:'index.html',key:'prepara-paes-demo-v1'},M2:{name:'Matemática M2',page:'m2.html',key:'cachaste-m2-v1'},Lectura:{name:'Competencia Lectora',page:'reading.html',key:'cachaste-reading-v1'},Ciencias:{name:'Ciencias',page:'science.html',key:'cachaste-science-v1'},Historia:{name:'Historia y Ciencias Sociales',page:'history.html',key:'cachaste-history-v1'}};
 function axis(s,q){
  if(s==='M1')return q.axis||(/Porcentajes|Potencias|Enteros|Racionales|Raíces/.test(q.skill)?'Números':/Ecuaciones|Proporcionalidad/.test(q.skill)?'Álgebra y funciones':q.skill==='Geometría'?'Geometría':'Probabilidad y estadística');
  if(s==='M2'){if(/Logaritmos|Números reales|Interés|Porcentajes/.test(q.concept))return'Números';return q.area==='Geometría'?'Geometría':q.area==='Probabilidad'?'Probabilidad y estadística':'Álgebra y funciones';}
  if(s==='Lectura')return q.skill;
  if(s==='Ciencias')return q.subject;
  return q.area==='Formación ciudadana'?'Formación ciudadana':q.area==='Economía y sociedad'?'Sistema económico':'Historia';
 }
 function classify(s,q){const a=axis(s,q),unit=s==='M1'?q.skill:s==='M2'?(/Interés|Porcentajes/.test(q.concept)?'Matemática financiera':q.area):s==='Lectura'?(a==='Localizar'?'Información explícita':a==='Interpretar'?'Relaciones y sentido':'Lectura crítica'):q.area;return{axis:a,unit,objective:q.concept||q.skill,difficulty:q.difficulty||'orientativa',supplementary:q.examEligible===false};}
 function organize(items,s){const axes=[];for(const q of items.filter(q=>q.subjectKey===s)){let a=axes.find(a=>a.name===q.axis);if(!a)axes.push(a={name:q.axis,units:[]});let u=a.units.find(u=>u.name===q.unit);if(!u)a.units.push(u={name:q.unit,levels:[]});let l=u.levels.find(l=>l.objective===q.concept);if(!l)u.levels.push(l={id:q.levelId,objective:q.concept,ids:[],supplementary:true});l.ids.push(q.id);l.supplementary=l.supplementary&&q.supplementary;}return axes;}
 g.CachasteCurriculum={subjects,classify,organize};
})(typeof window==='undefined'?globalThis:window);
