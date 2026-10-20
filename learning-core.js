/* Shared, offline learning rules. No network, accounts, or paid services. */
(function (global) {
  'use strict';
  const concept = q => q.concept || q.topic || q.skill || q.area;
  // Content identifier only. This is not a signature, purchase check, or anti-tamper mechanism.
  function contentHash(text) {
    const bytes=Array.from(unescape(encodeURIComponent(text)),c=>c.charCodeAt(0)),length=bytes.length;
    bytes.push(128);while(bytes.length%64!==56)bytes.push(0);
    for(let i=7;i>=0;i--)bytes.push(Math.floor(length*8/2**(i*8))&255);
    const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    const rotate=(x,n)=>(x>>>n)|(x<<(32-n));
    for(let offset=0;offset<bytes.length;offset+=64){
      const w=[];for(let i=0;i<16;i++)w[i]=(bytes[offset+i*4]<<24)|(bytes[offset+i*4+1]<<16)|(bytes[offset+i*4+2]<<8)|bytes[offset+i*4+3];
      for(let i=16;i<64;i++){const a=w[i-15],b=w[i-2];w[i]=(w[i-16]+(rotate(a,7)^rotate(a,18)^(a>>>3))+w[i-7]+(rotate(b,17)^rotate(b,19)^(b>>>10)))|0;}
      let [a,b,c,d,e,f,g,j]=h;
      for(let i=0;i<64;i++){const t1=(j+(rotate(e,6)^rotate(e,11)^rotate(e,25))+((e&f)^(~e&g))+k[i]+w[i])|0,t2=((rotate(a,2)^rotate(a,13)^rotate(a,22))+((a&b)^(a&c)^(b&c)))|0;j=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;}
      h=h.map((v,i)=>(v+[a,b,c,d,e,f,g,j][i])|0);
    }
    return h.map(v=>(v>>>0).toString(16).padStart(8,'0')).join('');
  }
  const versionCache=new WeakMap();
  function assessmentVersion(q) {
    const source=JSON.stringify([q.question||q.q||'',q.options,q.answer,concept(q)||null,q.transferGroup||String(q.id),q.passageId||null,q.passageVersion||null,q.visual||null]);
    const cached=versionCache.get(q);if(cached?.source===source)return cached.version;
    const version='a1-'+contentHash(source);versionCache.set(q,{source,version});return version;
  }
  function bindPassages(bank,passages){const versions=new Map(passages.map(p=>[p.id,contentHash(JSON.stringify([p.title,p.paragraphs]))]));for(const q of bank)if(q.passageId)q.passageVersion=versions.get(q.passageId)||'missing';}
  function assessmentSnapshot(q) {
    return {id:q.id,assessmentVersion:assessmentVersion(q),question:q.question||q.q||'',options:[...q.options],answer:q.answer,concept:concept(q)||null,transferGroup:q.transferGroup||String(q.id),area:q.area||null,passageId:q.passageId||null,passageVersion:q.passageVersion||null,visual:q.visual==null?null:JSON.parse(JSON.stringify(q.visual))};
  }
  // Recover only exact, self-consistent snapshots: never reinterpret an old answer with a new key.
  function archivedSessionQuestions(session) {
    if (!session || !Array.isArray(session.ids) || !Array.isArray(session.assessmentVersions) ||
        !Array.isArray(session.questionSnapshots) || !session.ids.length ||
        session.ids.length!==session.assessmentVersions.length ||
        session.ids.length!==session.questionSnapshots.length) return null;
    const seen=new Set(),recovered=[];
    for (let i=0;i<session.ids.length;i++) {
      const q=session.questionSnapshots[i],id=session.ids[i],version=session.assessmentVersions[i];
      if (!q || typeof q!=='object' || String(q.id)!==String(id) || seen.has(String(id)) ||
          typeof q.question!=='string' || !Array.isArray(q.options) ||
          q.options.length<2 || q.options.some(x=>typeof x!=='string') ||
          !Number.isInteger(q.answer) || q.answer<0 || q.answer>=q.options.length ||
          !/^a1-[a-f0-9]{64}$/.test(version) || assessmentVersion(q)!==version) return null;
      seen.add(String(id));
      recovered.push({...q,options:[...q.options],visual:q.visual==null?null:JSON.parse(JSON.stringify(q.visual))});
    }
    return recovered;
  }
  function verifiedAssessmentQuestion(assessment,row,bankQuestion){
    if (!row || typeof row.assessmentVersion!=='string') return bankQuestion || null;
    const snapshots=Array.isArray(assessment?.questionSnapshots)?assessment.questionSnapshots:[];
    const candidates=snapshots.filter(q=>q && String(q.id)===String(row.id) && q.assessmentVersion===row.assessmentVersion);
    if(candidates.length===1){
      const q=candidates[0];
      if(typeof q.question==='string' && Array.isArray(q.options) && q.options.length>=2 &&
        q.options.every(x=>typeof x==='string') && Number.isInteger(q.answer) && q.answer>=0 && q.answer<q.options.length &&
        assessmentVersion(q)===row.assessmentVersion){
        const archived={...q,options:[...q.options],visual:q.visual==null?null:JSON.parse(JSON.stringify(q.visual))};
        return bankQuestion && assessmentVersion(bankQuestion)===row.assessmentVersion ? {...bankQuestion,...archived} : archived;
      }
    }
    return bankQuestion && assessmentVersion(bankQuestion)===row.assessmentVersion ? bankQuestion : null;
  }
  function sessionVersionStatus(session,bank) {
    if (!session || !Array.isArray(session.ids)) return 'invalid';
    if (!Array.isArray(session.assessmentVersions)) return 'legacy';
    if (session.assessmentVersions.length !== session.ids.length) return 'changed';
    const byId=new Map(bank.map(q=>[String(q.id),q]));
    return session.ids.every((id,i)=>{
      const q=byId.get(String(id));
      return q && session.assessmentVersions[i]===assessmentVersion(q);
    }) ? 'compatible' : 'changed';
  }
  function compatibleAttempt(q,row){return row.assessmentVersion==null||row.assessmentVersion===assessmentVersion(q);}
  function profile(bank, history) {
    const byId = new Map(bank.map(q => [q.id, q]));
    const groups = new Map();
    for (const q of bank) {
      const key = concept(q);
      if (!groups.has(key)) groups.set(key, { concept: key, area: q.area || q.axis || q.skill, attempts: 0, correct: 0, lastFailure: -1, evidence: new Set(), status: 'sin explorar' });
    }
    history.forEach((row, index) => {
      const q = row && byId.get(row.id); if (!q || !compatibleAttempt(q,row)) return;
      const item = groups.get(concept(q)); item.attempts++;
      if (row.correct) item.correct++;
      if (!row.correct || row.assisted || row.afterStudy || row.confidence === 'azar' || row.confidence === 'duda') {
        item.lastFailure = index; item.evidence.clear(); item.status = 'por reforzar';
      } else if(row.confidence === 'seguro') {
        item.evidence.add(q.transferGroup || row.id);
        item.status = item.evidence.size >= 2 ? 'comprobado' : 'por comprobar';
      } else if(item.status !== 'comprobado') item.status='por comprobar';
    });
    return [...groups.values()].map(x => ({ ...x, evidence: [...x.evidence] }));
  }
  // Stars are derived exclusively from the existing compatible evidence.
  // 4 stars = two distinct unassisted confident transfer families (mastery).
  // 5 stars = three such families; limited banks cannot fabricate the fifth.
  function skillStars(state) {
    if(!state || !Number.isFinite(state.attempts) || state.attempts<=0)return 0;
    const distinct=new Set(Array.isArray(state.evidence)?state.evidence:[]).size;
    if(distinct>=3 && state.status==='comprobado')return 5;
    if(distinct>=2 && state.status==='comprobado')return 4;
    if(distinct>=1 && state.status==='por comprobar')return 3;
    if(state.correct>0)return 2;
    return 1;
  }
  function select(bank, history, count, { exclude = [], concepts = null, balanced = false, distinctFamilies = true, random = Math.random } = {}) {
    const blocked = new Set(exclude), seen = new Map(), latest = new Map();
    history.forEach(row => { if (!row) return; seen.set(row.id, (seen.get(row.id) || 0) + 1); latest.set(row.id, row); });
    const p = new Map(profile(bank, history).map(x => [x.concept, x]));
    const allowed = concepts ? new Set(concepts) : null;
    const families=new Set();
    const ranked = bank.filter(q => !blocked.has(q.id) && (!allowed || allowed.has(concept(q)))).map(q => {
      const state = p.get(concept(q));
      // New questions about weak concepts come first. Never label a repeated item as transfer.
      const priority = (seen.get(q.id) || 0) * 20 + (state?.status === 'por reforzar' ? -8 : state?.status === 'por comprobar' ? -3 : 0);
      return { q, priority, tie: random() };
    }).sort((a, b) => a.priority - b.priority || a.tie - b.tie).filter(x=>{if(!distinctFamilies)return true;const family=x.q.transferGroup||x.q.id;if(families.has(family))return false;families.add(family);return true;});
    if (!balanced) return ranked.slice(0, count).map(x => x.q);
    const areas = [...new Set(bank.map(q => q.area || q.axis || q.skill))], result = [];
    while (result.length < count && ranked.length) {
      for (const area of areas) {
        const i = ranked.findIndex(x => (x.q.area || x.q.axis || x.q.skill) === area);
        if (i >= 0 && result.length < count) result.push(ranked.splice(i, 1)[0].q);
      }
    }
    return result;
  }
  function transfer(bank, history, rows, count = 10) {
    const byId = new Map(bank.map(q => [q.id, q]));
    const weak = [...new Set(rows.filter(r => r && (!r.correct || r.assisted || r.afterStudy || r.confidence === 'duda' || r.confidence === 'azar')).map(r => byId.get(r.id)).filter(Boolean).map(concept))];
    const seen = new Set(history.map(r => r?.id));
    const exclude = [...new Set([...rows.map(r => r?.id), ...history.slice(-10).map(r => r?.id)])];
    const blockedFamilies=new Set(exclude.map(id=>byId.get(id)).filter(Boolean).map(q=>q.transferGroup||q.id));
    const eligible=bank.filter(q=>!blockedFamilies.has(q.transferGroup||q.id));
    const fresh = select(eligible.filter(q => !seen.has(q.id)), history, count, { exclude, concepts: weak });
    // If the bank is exhausted, use a spaced, different item, never the item just failed.
    const rest = select(eligible.filter(q=>!fresh.some(f=>(f.transferGroup||f.id)===(q.transferGroup||q.id))), history, count - fresh.length, { exclude: [...exclude, ...fresh.map(q => q.id)], concepts: weak });
    return [...fresh, ...rest];
  }
  function validSession(s, bank, modes, limit = 200) {
    if (!s || !Array.isArray(s.ids) || !s.ids.length || s.ids.length > limit || new Set(s.ids).size !== s.ids.length || !Number.isInteger(s.index) || s.index < 0 || s.index >= s.ids.length || !modes.includes(s.mode) || !Array.isArray(s.results) || s.results.length>s.ids.length || new Set(s.results.map(r=>r?.id)).size!==s.results.length) return false;
    const byId = new Map(bank.map(q => [q.id, q]));
    const original=archivedSessionQuestions(s);
    // Verified archives remain resumable even when an item is no longer in the current catalog.
    if ((!original && !s.ids.every(id => byId.has(id))) || s.results.some(r => !r || !s.ids.includes(r.id) || (!original && !byId.has(r.id)) || typeof r.correct !== 'boolean')) return false;
    const active=original ? original[s.index] : byId.get(s.ids[s.index]);
    if (s.selected != null && (!Number.isInteger(s.selected) || s.selected < 0 || s.selected >= active.options.length)) return false;
    return true;
  }
  function cleanRows(bank, rows, limit = 5000) {
    const byId=new Map(bank.map(q=>[q.id,q]));
    return Array.isArray(rows)?rows.filter(r=>r&&byId.has(r.id)&&typeof r.correct==='boolean').slice(-limit).map(r=>({...r,selected:Number.isInteger(r.selected)&&r.selected>=0&&((typeof r.assessmentVersion==='string'&&/^a1-[a-f0-9]{64}$/.test(r.assessmentVersion)&&!compatibleAttempt(byId.get(r.id),r))||r.selected<byId.get(r.id).options.length)?r.selected:null})):[];
  }
  function cleanAssessment(bank, value){
    if(!value||!Array.isArray(value.results))return null;
    const results=cleanRows(bank,value.results,200);
    return {...value,id:String(value.id||'legacy-'+(value.at||value.date||'')),results,total:results.length,correct:results.filter(r=>r.correct).length};
  }
  function summary(mode, rows, extra = {}) {
    return { id: extra.id || 'round-' + Date.now(), mode, at: new Date().toISOString(), total: rows.length, correct: rows.filter(x => x.correct).length, results: rows, ...extra };
  }
  // One teaching sequence for the daily tutor in every subject. Easy mode must
  // reconnect the analogy to the actual task and finish with a check.
  function lessonCards(q, mode = 'steps') {
    const t=q?.teaching||{}, example=t.example||{};
    const cards=mode==='intro'?[t.aim,...(t.foundation||[]),example.problem?'Otro ejemplo: '+example.problem:'',...(example.steps||[]),example.bridge,t.check]:
      mode==='easy'?[...(t.intuition||[]),...(t.application||[]),t.check]:
      mode==='example'?[example.problem,...(example.steps||[]),example.bridge]:
      [t.aim,...(t.foundation||[]),...(t.application||[]),t.check];
    return cards.filter(value=>typeof value==='string'&&value.trim()).map(value=>value.trim()).filter((value,index,all)=>index===0||value!==all[index-1]);
  }
  function lesson(q, mode) {
    const esc=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    if(mode==='basic')mode='easy';
    const t=q.teaching,e=q.editorial||q;
    const paragraphs=values=>values.map(value=>'<p>'+esc(value)+'</p>').join('');
    const steps=values=>'<ol>'+values.map(value=>'<li>'+esc(value)+'</li>').join('')+'</ol>';
    if(!t)return mode==='steps'?steps(e.steps):paragraphs(String(mode==='easy'?e.easy:e.example).split('\n\n'));
    const section=(heading,body,kind='')=>'<section class="teaching-section '+kind+'"><h4>'+heading+'</h4>'+body+'</section>';
    if(mode==='steps')return section('Entendamos qué buscamos',paragraphs([t.aim]))+section('El concepto desde cero',paragraphs(t.foundation))+section('Resolvamos tu pregunta',steps(t.application))+section('Comprobemos el resultado',paragraphs([t.check]),'teaching-check');
    if(mode==='easy')return section('Imagínalo así',paragraphs(t.intuition))+section('Conectémoslo con tu ejercicio',steps(t.application))+section('Comprobemos el resultado',paragraphs([t.check]),'teaching-check');
    return section('Un problema distinto',paragraphs([t.example.problem]),'teaching-example')+section('Vamos a resolverlo',steps(t.example.steps))+section('Qué puedes llevar a tu pregunta',paragraphs([t.example.bridge]));
  }
  global.CachasteLearning = { contentHash, assessmentVersion, assessmentSnapshot, archivedSessionQuestions, verifiedAssessmentQuestion, sessionVersionStatus, compatibleAttempt, bindPassages, lessonCards, lesson, concept, profile, skillStars, select, transfer, validSession, cleanRows, cleanAssessment, summary };
})(typeof window !== 'undefined' ? window : globalThis);
