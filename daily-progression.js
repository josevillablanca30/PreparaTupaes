/* Progresión propia: ruta recomendada por aprendizaje demostrado; exploración libre, independiente de XP. */
(function(g){'use strict';
 function route(items,subject,track,profile,unitExams={}){
  unitExams=unitExams&&typeof unitExams==='object'&&!Array.isArray(unitExams)?unitExams:{};
  const bank=g.CachasteCurriculum.sciencePool(items,subject==='Ciencias'?track:null).filter(q=>!q.supplementary&&q.examEligible!==false);
  const original=g.CachasteCurriculum.course(bank,subject),units=g.CachasteSchool?g.CachasteSchool.sequence(original,subject):original,states=new Map(profile.map(p=>[p.concept,p]));
  const levels=units.flatMap(unit=>unit.levels.map(level=>({...level,unit:unit.name,axis:unit.axis})));
  const exempted=new Set(),prefix=subject+':'+(subject==='Ciencias'?track||'':'')+':';
  for(const unit of units){const key=unit.routeKey||unit.axis+'|'+unit.name,prior=unitExams[prefix+key]||unitExams[prefix+(unit.legacyKey||key)];if(prior?.passed===true&&prior.total===10&&Number.isFinite(prior.correct)&&prior.correct>=0&&prior.correct<=10)for(const level of unit.levels)exempted.add(level.id);}
  const complete=level=>exempted.has(level.id)||g.CachasteLearning.skillStars(states.get(level.objective))>=4;
  const first=levels.findIndex(level=>!complete(level));
  const frontier=first<0?levels.length:first;
  const access=id=>{const index=levels.findIndex(l=>l.id===id);return index>=0;};
  return {units,levels,frontier,exempted,current:levels[frontier]||null,access,completed:levels.filter(complete).length};
 }
 g.CachasteProgression={route};
})(typeof window==='undefined'?globalThis:window);
