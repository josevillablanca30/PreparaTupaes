/* Progresión propia: acceso por aprendizaje demostrado, independiente de XP. */
(function(g){'use strict';
 function route(items,subject,track,profile){
  const bank=g.CachasteCurriculum.sciencePool(items,subject==='Ciencias'?track:null).filter(q=>!q.supplementary&&q.examEligible!==false);
  const original=g.CachasteCurriculum.course(bank,subject),units=g.CachasteSchool?g.CachasteSchool.sequence(original,subject):original,states=new Map(profile.map(p=>[p.concept,p]));
  const levels=units.flatMap(unit=>unit.levels.map(level=>({...level,unit:unit.name,axis:unit.axis})));
  const first=levels.findIndex(level=>g.CachasteLearning.skillStars(states.get(level.objective))<4);
  const frontier=first<0?levels.length:first;
  const access=id=>{const index=levels.findIndex(l=>l.id===id);return index>=0&&(index<=frontier||g.CachasteLearning.skillStars(states.get(levels[index].objective))>=4);};
  return {units,levels,frontier,current:levels[frontier]||null,access,completed:levels.filter(l=>g.CachasteLearning.skillStars(states.get(l.objective))>=4).length};
 }
 g.CachasteProgression={route};
})(typeof window==='undefined'?globalThis:window);
