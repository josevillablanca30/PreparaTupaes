/* Shared, offline learning rules. No network, accounts, or paid services. */
(function (global) {
  'use strict';
  const concept = q => q.concept || q.topic || q.skill || q.area;
  function profile(bank, history) {
    const byId = new Map(bank.map(q => [q.id, q]));
    const groups = new Map();
    for (const q of bank) {
      const key = concept(q);
      if (!groups.has(key)) groups.set(key, { concept: key, area: q.area || q.axis || q.skill, attempts: 0, correct: 0, lastFailure: -1, evidence: new Set(), status: 'sin explorar' });
    }
    history.forEach((row, index) => {
      const q = row && byId.get(row.id); if (!q) return;
      const item = groups.get(concept(q)); item.attempts++;
      if (row.correct) item.correct++;
      if (!row.correct || row.assisted || row.confidence === 'azar' || row.confidence === 'duda') {
        item.lastFailure = index; item.evidence.clear(); item.status = 'por reforzar';
      } else if(row.confidence === 'seguro') {
        item.evidence.add(row.id);
        item.status = item.evidence.size >= 2 ? 'comprobado' : 'por comprobar';
      } else if(item.status !== 'comprobado') item.status='por comprobar';
    });
    return [...groups.values()].map(x => ({ ...x, evidence: [...x.evidence] }));
  }
  function select(bank, history, count, { exclude = [], concepts = null, balanced = false, random = Math.random } = {}) {
    const blocked = new Set(exclude), seen = new Map(), latest = new Map();
    history.forEach(row => { if (!row) return; seen.set(row.id, (seen.get(row.id) || 0) + 1); latest.set(row.id, row); });
    const p = new Map(profile(bank, history).map(x => [x.concept, x]));
    const allowed = concepts ? new Set(concepts) : null;
    const ranked = bank.filter(q => !blocked.has(q.id) && (!allowed || allowed.has(concept(q)))).map(q => {
      const state = p.get(concept(q));
      // New questions about weak concepts come first. Never label a repeated item as transfer.
      const priority = (seen.get(q.id) || 0) * 20 + (state?.status === 'por reforzar' ? -8 : state?.status === 'por comprobar' ? -3 : 0);
      return { q, priority, tie: random() };
    }).sort((a, b) => a.priority - b.priority || a.tie - b.tie);
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
    const weak = [...new Set(rows.filter(r => r && (!r.correct || r.assisted || r.confidence === 'duda' || r.confidence === 'azar')).map(r => byId.get(r.id)).filter(Boolean).map(concept))];
    const seen = new Set(history.map(r => r?.id));
    const exclude = [...new Set([...rows.map(r => r?.id), ...history.slice(-10).map(r => r?.id)])];
    const fresh = select(bank.filter(q => !seen.has(q.id)), history, count, { exclude, concepts: weak });
    // If the bank is exhausted, use a spaced, different item, never the item just failed.
    const rest = select(bank, history, count - fresh.length, { exclude: [...exclude, ...fresh.map(q => q.id)], concepts: weak });
    return [...fresh, ...rest];
  }
  function validSession(s, bank, modes, limit = 200) {
    if (!s || !Array.isArray(s.ids) || !s.ids.length || s.ids.length > limit || new Set(s.ids).size !== s.ids.length || !Number.isInteger(s.index) || s.index < 0 || s.index >= s.ids.length || !modes.includes(s.mode) || !Array.isArray(s.results)) return false;
    const byId = new Map(bank.map(q => [q.id, q]));
    if (!s.ids.every(id => byId.has(id)) || s.results.some(r => !r || !byId.has(r.id) || typeof r.correct !== 'boolean')) return false;
    if (s.selected != null && (!Number.isInteger(s.selected) || s.selected < 0 || s.selected >= byId.get(s.ids[s.index]).options.length)) return false;
    return true;
  }
  function summary(mode, rows, extra = {}) {
    return { id: extra.id || 'round-' + Date.now(), mode, at: new Date().toISOString(), total: rows.length, correct: rows.filter(x => x.correct).length, results: rows, ...extra };
  }
  global.CachasteLearning = { concept, profile, select, transfer, validSession, summary };
})(typeof window !== 'undefined' ? window : globalThis);
