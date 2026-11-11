/* M2 and Historia share this tested study flow; existing bank and local keys are preserved. */
'use strict';
window.CachasteStudy = function ({ bank: BANK, key: KEY, title: TITLE, minutes, count }) {
  const L = window.CachasteLearning, root = document.getElementById('app');
  const byId = new Map(BANK.map(q => [q.id, q]));
  const ELIGIBLE = BANK.filter(q => q.examEligible !== false && !q.supplementary);
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  let stored = {}; try { stored = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch {}
  let history = Array.isArray(stored.history) ? stored.history.filter(r => r && byId.has(r.id) && typeof r.correct === 'boolean').slice(-5000) : [];
  stored.session=L.restoreSession(stored.session,BANK);
  let session = L.validSession(stored.session, BANK, ['diagnostic', 'express', 'reinforce', 'full']) ? stored.session : null;
  // The archive is self-validated. Use the original assessment, with current teaching only when available.
  const archived = () => session ? L.archivedSessionQuestions(session) : null;
  const archivedById = () => new Map((archived() || []).map(q => [q.id, q]));
  const sessionQuestion = id => {
    const original = archivedById().get(id), latest = byId.get(id);
    return original ? (latest && L.assessmentVersion(latest) === original.assessmentVersion ? {...latest, ...original} : {...original}) : latest;
  };
  let lastResult = L.cleanAssessment(BANK,stored.lastResult);
  let assessments = Array.isArray(stored.assessments) ? stored.assessments.map(r=>L.cleanAssessment(BANK,r)).filter(Boolean).slice(-100) : [];
  let diagnosticDone = stored.diagnosticDone === true || lastResult?.mode === 'diagnostic' && lastResult.results.length === 30;
  let screen = 'home', explainMode = 'steps', mapOpen = false, confirming = false, notice = '';
  // Older full-bank practices have no deadline. Preserve them as practice, not as a timed exam.
  if (session?.mode === 'full' && !Number.isFinite(session.deadline)) session.mode = 'express';
  if(session){session.selected=session.selected??null;session.checked=!!session.checked&&session.selected!==null;session.flags=Array.isArray(session.flags)?session.flags.filter(n=>Number.isInteger(n)&&n>=0&&n<session.ids.length):[];}
  if (session?.mode === 'full') {
    if (!Array.isArray(session.answers) || session.answers.length !== session.ids.length) session = null;
    else if (session.answers.some((n, i) => n !== null && (!Number.isInteger(n) || n < 0 || n >= order(sessionQuestion(session.ids[i])).options.length))) session = null;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ version: 2, history, session, lastResult, diagnosticDone, assessments })); return true; }
    catch { notice = 'No se pudo guardar en este dispositivo. Conserva esta pantalla abierta para no perder la sesión.'; return false; }
  }
  function order(q) {
    const shift = q.area === 'Suficiencia de datos' ? 0 : Number(q.id.match(/\d+$/)?.[0] || 0) % q.options.length;
    const indices = q.options.map((_, i) => (i + shift) % q.options.length);
    return { options: indices.map(i => q.options[i]), answer: indices.indexOf(q.answer), indices };
  }
  const current = () => session && sessionQuestion(session.ids[session.index]);
  function begin(mode) {
    if (!diagnosticDone && mode !== 'diagnostic' && mode !== 'full') { notice = 'Completa primero el diagnóstico para orientar tu práctica.'; render(); return; }
    if (session) { notice = 'Tienes una sesión guardada. Retómala o descártala antes de iniciar otra.'; render(); return; }
    const distinctFamilies = mode !== 'full' || new Set(ELIGIBLE.map(q => q.transferGroup || q.id)).size >= count;
    const pool = L.select(ELIGIBLE, history, mode === 'diagnostic' ? 30 : mode === 'full' ? count : 10, { balanced: true, distinctFamilies });
    launch(mode, pool);
  }
  function launch(mode, pool) {
    if (!pool.length) { notice = 'Ya trabajaste los ejercicios distintos disponibles de estos conceptos. Revisa el tutor y vuelve a una práctica Express.'; render(true); return; }
    session = { id: 'study-' + Date.now(), mode, ids: pool.map(q => q.id), assessmentVersions: pool.map(q => L.assessmentVersion(q)), questionSnapshots: pool.map(q => L.assessmentSnapshot(q)), index: 0, selected: null, checked: false, confidence: null, results: [], started: Date.now(), deadline: mode === 'full' ? Date.now() + minutes * 60000 : null, answers: pool.map(() => null), flags: [] };
    screen = 'quiz'; notice = ''; confirming = false; mapOpen = false; save(); render(true);
  }
  function reinforce() { if(session){notice='Retoma o descarta la sesión guardada antes de comenzar otra.';screen='home';render();return;}launch('reinforce', L.transfer(ELIGIBLE, history, [...(lastResult?.results || []),...history.slice(-30)], 10)); }
  function choose(n) {
    if (sessionChanged()) return;
    if (!session || session.checked || !Number.isInteger(n) || n < 0 || n >= current().options.length) return;
    if (expired()) return;
    session.selected = n;
    if (session.mode === 'full') session.answers[session.index] = n;
    save(); render();
  }
  function confidence(c) { if (sessionChanged() || !session || session.checked || !['seguro', 'duda', 'azar'].includes(c)) return; session.confidence = c; save(); render(); }
  function check() { if (sessionChanged()) return; if (!session || session.mode === 'full' || session.checked || session.selected === null) return; session.checked = true; explainMode = 'steps'; save(); render(); }
  function row(q, selected, confidence, extra = {}) {
    const original = selected === null ? null : order(q).indices[selected];
    return { id: q.id, assessmentVersion: L.assessmentVersion(q), area: q.area, concept: L.concept(q), selected: original, correct: original !== null && original === q.answer, confidence: confidence || 'sin-declarar', unanswered: original === null, mode: session.mode, date: new Date().toISOString(), sessionId: session.id, ...extra };
  }
  function next() {
    if (sessionChanged()) return;
    if (!session || !session.checked || session.mode === 'full') return;
    const rec = row(current(), session.selected, 'no-declarada');
    session.results.push(rec); history.push(rec);
    if (session.index === session.ids.length - 1) { finish(); return; }
    session.index++; session.selected = null; session.checked = false; session.confidence = null; explainMode = 'steps'; save(); render(true);
  }
  function finish() {
    if (!session || sessionChanged()) { notice = 'La sesión contiene versiones antiguas y no se puede calificar con preguntas nuevas.'; screen = 'home'; render(); return; }
    if (session.mode === 'full') {
      session.results = session.ids.map((id, i) => row(sessionQuestion(id), session.answers[i], null));
      history.push(...session.results);
    }
    const originalQuestions = archived() || [];
    lastResult = L.summary(session.mode, session.results.slice(), { id: session.id, duration: Math.max(0, Date.now() - session.started), questionSnapshots: originalQuestions });
    assessments.push(lastResult); assessments = assessments.slice(-100); history = history.slice(-5000);
    if (session.mode === 'diagnostic' && session.results.length === 30) diagnosticDone = true;
    session = null; confirming = false; screen = 'result'; save(); render(true);
  }
  function sessionChanged() { return session && L.sessionVersionStatus(session, BANK) !== 'compatible' && !archived(); }
  function expired() { if (sessionChanged()) { notice = 'La sesión anterior se conserva sin recalificar; elige cómo continuar desde el inicio.'; screen = 'home'; render(); return true; } if (session?.mode === 'full' && Date.now() >= session.deadline) { finish(); return true; } return false; }
  function move(index) { if (sessionChanged()) return; if (!session || session.mode !== 'full' || expired()) return; session.index = Math.max(0, Math.min(index, session.ids.length - 1)); session.selected = session.answers[session.index]; confirming = false; save(); render(true); }
  function timeLeft() { const secs = Math.max(0, Math.ceil((session.deadline - Date.now()) / 1000)); return Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0'); }
  function lesson(q, mode) {
    const t=q.teaching,e=q.editorial||q;
    const paragraphs=values=>values.map(value=>'<p>'+esc(value)+'</p>').join('');
    const steps=values=>'<ol>'+values.map(value=>'<li>'+esc(value)+'</li>').join('')+'</ol>';
    if(!t)return mode==='steps'?steps(Array.isArray(e.steps)?e.steps:['Resuelve el ejercicio conservado utilizando sus datos originales.']):paragraphs(String(mode==='easy'?(e.easy||'Revisa el procedimiento con los datos originales.'):(e.example||'Compara la respuesta elegida con la solución original.')).split('\n\n'));
    const section=(heading,body,kind='')=>'<section class="teaching-section '+kind+'"><h4>'+heading+'</h4>'+body+'</section>';
    if(mode==='steps')return section('Entendamos qué buscamos',paragraphs([t.aim]))+section('El concepto desde cero',paragraphs(t.foundation))+section('Resolvamos tu pregunta',steps(t.application))+section('Comprobemos el resultado',paragraphs([t.check]),'teaching-check');
    if(mode==='easy')return section('Imagínalo así',paragraphs(t.intuition))+section('Conectémoslo con tu ejercicio',steps(t.application));
    return section('Un problema distinto',paragraphs([t.example.problem]),'teaching-example')+section('Vamos a resolverlo',steps(t.example.steps))+section('Qué puedes llevar a tu pregunta',paragraphs([t.example.bridge]));
  }
  function tutor(q, selected = null) {
    const e = q.editorial || q;
    const detail = lesson(q,explainMode);
    const wrong = selected !== null && selected !== q.answer && q.explanations?.[selected];
    return '<section class="tutor-panel"><h3>Te lo dejamos clarito</h3>' + (wrong ? '<div class="error-reason"><p><strong>Elegiste: ' + esc(q.options[selected]) + '</strong></p><p>' + esc(wrong) + '</p>' + (q.teaching?.selectedFeedback?.[selected] ? '<details><summary>Cómo corregir ese razonamiento</summary><ol>' + q.teaching.selectedFeedback[selected].repair.map(s=>'<li>'+esc(s)+'</li>').join('') + '</ol><p>'+esc(q.teaching.check)+'</p></details>' : '') + '</div>' : '') + '<div class="explanation-options" role="group" aria-label="Forma de explicación">' + [['steps', 'Paso a paso'], ['easy', 'Más fácil'], ['example', 'Con un ejemplo']].map(([m, text]) => '<button data-explain="' + m + '" aria-pressed="' + (m === explainMode) + '">' + text + '</button>').join('') + '</div>' + detail + '</section>';
  }
  function report(rows) {
    const areas = [...new Set(rows.map(r => r.area))];
    return '<h2>Tu mapa de aprendizaje</h2><div class="report-grid">' + areas.map(area => {
      const r = rows.filter(x => x.area === area), good = r.filter(x => x.correct).length, pct = Math.round(good / r.length * 100);
      return '<article class="mini-stat"><strong>' + esc(area) + '</strong><p>' + good + ' de ' + r.length + ' correctas</p><div class="bar"><div style="width:' + pct + '%"></div></div><p class="small">' + (pct >= 75 ? 'Buen resultado en esta muestra.' : 'Conviene reforzar esta área.') + '</p></article>';
    }).join('') + '</div>';
  }
  function progress() {
    const p = L.profile(BANK, history).filter(x => x.attempts);
    return '<span class="eyebrow">Tu progreso</span><h1>Lo que ya estás comprendiendo</h1><p>Confirmamos un concepto al resolver dos preguntas distintas sin apoyo después del último error.</p><div class="report-grid">' + p.map(x => '<article class="mini-stat"><strong>' + esc(x.concept) + '</strong><p>' + esc(x.status) + ' · ' + x.correct + '/' + x.attempts + '</p></article>').join('') + '</div><h2>Historial de sesiones</h2>' + (assessments.length ? assessments.slice().reverse().map(a => '<button class="history-item" data-result="' + esc(a.id) + '">' + esc(({ diagnostic: 'Diagnóstico', full: 'Ensayo', express: 'Express', reinforce: 'Refuerzo' })[a.mode] || a.mode) + ' · ' + a.correct + '/' + a.total + '<small>' + esc(new Date(a.at).toLocaleDateString('es-CL')) + '</small></button>').join('') : '<p>Aún no completas una sesión.</p>') + '<button id="back" class="primary">Volver al inicio</button>';
  }
  function home() {
    return '<span class="eyebrow">' + (diagnosticDone ? 'Sigue con tu preparación' : 'Partamos por conocerte') + '</span><h1>' + TITLE + '</h1><p class="lead">Te lo dejamos clarito para un buen resultado.</p>' + (session ? '<section class="resume-card"><strong>Tienes una sesión en curso</strong><p>Pregunta ' + (session.index + 1) + ' de ' + session.ids.length + (session.mode === 'full' ? '. El reloj del ensayo sigue corriendo.' : '.') + '</p><button class="primary" id="resume">Retomar sesión guardada</button><button id="discard">Descartar sesión</button></section>' : '') + '<div class="mode-list"><button class="mode-card" id="diagnostic"><span>01</span><strong>Diagnóstico · 30 preguntas</strong><small>Conoce desde dónde partir</small></button><button class="mode-card" id="express" ' + (!diagnosticDone ? 'disabled' : '') + '><span>02</span><strong>Express · 10 preguntas</strong><small>Practica según lo que necesitas</small></button><button class="mode-card" id="full" ' + (!diagnosticDone ? 'disabled' : '') + '><span>03</span><strong>Ensayo completo · ' + count + ' preguntas</strong><small>' + minutes + ' minutos · corrección al terminar</small></button></div><div class="actions"><button id="progress">Ver mi progreso</button>' + (lastResult ? '<button id="last">Ver último resultado</button>' : '') + '</div><p class="small">' + ELIGIBLE.length + ' preguntas para práctica PAES. No equivale a puntaje PAES oficial.</p>';
  }
  function quiz() {
    const q = current(), o = order(q), isExam = session.mode === 'full';
    if (confirming) return '<section class="card"><h1>¿Entregar tu ensayo?</h1><p>' + session.answers.filter(n => n !== null).length + ' de ' + session.ids.length + ' respuestas guardadas. Las preguntas en blanco se registrarán como no respondidas.</p><div class="actions"><button class="primary" id="finish">Entregar ensayo</button><button id="cancel-finish">Seguir revisando</button></div></section>';
    return (isExam ? '<div class="exam-top"><span id="exam-timer" role="timer">Tiempo restante: ' + timeLeft() + '</span><button id="map">Mapa de preguntas</button></div>' : '') + '<span class="eyebrow">' + esc(q.area) + ' · ' + (session.index + 1) + ' de ' + session.ids.length + '</span><div class="bar" role="progressbar" aria-label="Avance" aria-valuenow="' + (session.index + 1) + '" aria-valuemin="0" aria-valuemax="' + session.ids.length + '"><div style="width:' + ((session.index + 1) / session.ids.length * 100) + '%"></div></div>' + (mapOpen && isExam ? '<nav class="question-map" aria-label="Preguntas del ensayo">' + session.ids.map((id, i) => '<button data-jump="' + i + '" class="' + (session.answers[i] !== null ? 'answered ' : '') + (session.flags.includes(i) ? 'flagged ' : '') + '" aria-current="' + (i === session.index ? 'step' : 'false') + '">' + (i + 1) + '</button>').join('') + '</nav>' : '') + '<section class="card"><h2>' + esc(q.question) + '</h2>' + o.options.map((v, i) => '<button class="choice ' + (session.selected === i ? 'selected' : '') + '" aria-pressed="' + (session.selected === i) + '" data-choice="' + i + '" ' + (session.checked ? 'disabled' : '') + '>' + String.fromCharCode(65 + i) + ') ' + esc(v) + '</button>').join('') + (isExam ? '<div class="actions"><button id="prev" ' + (session.index === 0 ? 'disabled' : '') + '>Anterior</button><button class="primary" id="exam-next">' + (session.index === session.ids.length - 1 ? 'Revisar entrega' : 'Guardar y continuar') + '</button><button id="omit">Omitir pregunta</button><button id="flag" aria-pressed="' + session.flags.includes(session.index) + '">' + (session.flags.includes(session.index) ? 'Desmarcar' : 'Marcar para revisar') + '</button></div><p class="small">Puedes cambiar tus respuestas hasta entregar. El tutor estará disponible al finalizar.</p>' : !session.checked ? '<button class="primary" id="check" ' + (session.selected === null ? 'disabled' : '') + '>Revisar respuesta</button>' : '<div class="feedback"><strong>' + (session.selected === o.answer ? '¡Cachaste!' : 'Vamos a entenderlo') + '</strong><p>Respuesta correcta: ' + esc(o.options[o.answer]) + '</p></div>' + tutor(q, o.indices[session.selected]) + '<button class="primary" id="next">' + (session.index === session.ids.length - 1 ? 'Ver resultado' : 'Continuar') + '</button>') + '</section><button id="pause">Guardar y volver</button>';
  }
  function result() {
    const rows = lastResult?.results || [], good = rows.filter(x => x.correct).length;
    return '<span class="eyebrow">Resultado de tu sesión</span><h1>' + good + ' de ' + rows.length + ' correctas</h1><p>Comprender el error es parte del avance. Revisa tus respuestas y después prueba con otro ejercicio del mismo concepto.</p>' + report(rows) + '<div class="actions"><button class="primary" id="reinforce">Practicar con preguntas nuevas</button><button id="back">Volver al inicio</button><button id="progress">Ver mi progreso</button></div><h2>Revisa y comprende</h2>' + rows.map(r => {
      const q = L.verifiedAssessmentQuestion(lastResult, r, byId.get(r.id));
      if (!q) return '<details class="review-item"><summary>Evaluación anterior · ' + esc(r.id) + '</summary><p>Conservamos tu resultado original, pero no tenemos una copia verificable para mostrar su solución con seguridad.</p></details>';
      const e = q.editorial || q;
      return '<details class="review-item"><summary>' + (r.correct ? '✓ ' : '↗ ') + esc(q.question) + '</summary><p><strong>Tu respuesta:</strong> ' + esc(r.selected == null ? r.unanswered ? 'Sin responder' : 'No guardada en esta versión anterior' : q.options[r.selected]) + '</p><p><strong>Correcta:</strong> ' + esc(q.options[q.answer]) + '</p>' + (r.selected != null && !r.correct && q.explanations?.[r.selected] ? '<p>' + esc(q.explanations[r.selected]) + '</p>' : '') + '<h3>Paso a paso</h3>' + lesson(q,'steps') + '<h3>Más fácil</h3>' + lesson(q,'easy') + '<h3>Con un ejemplo</h3>' + lesson(q,'example') + '</details>';
    }).join('');
  }
  function bind(id, fn) { const el = document.getElementById(id); if (el) el.onclick = fn; }
  function back() { screen = 'home'; confirming = false; save(); render(true); }
  function render(top = false) {
    if (screen === 'quiz' && sessionChanged()) { screen = 'home'; notice = 'Esta sesión antigua no tiene una versión verificable de sus preguntas. Está guardada sin recalificar: puedes conservarla hasta contar con recuperación de versiones anteriores o descartarla voluntariamente.'; }
    if (screen === 'quiz' && expired()) return;
    root.innerHTML = '<p id="study-notice" role="status">' + esc(notice) + '</p>' + (screen === 'home' ? home() : screen === 'result' ? result() : screen === 'progress' ? progress() : quiz());
    for (const mode of ['diagnostic', 'express', 'full']) bind(mode, () => begin(mode));
    bind('resume', () => { if (!session || sessionChanged()) { notice = 'No podemos asegurar que las preguntas coincidan con la sesión guardada. Sus datos se conservan sin recalificar.'; render(); return; } if (expired()) return; screen = 'quiz'; render(true); });
    bind('discard', () => { root.innerHTML = '<section class="card"><h2>¿Descartar esta sesión?</h2><p>El progreso de sesiones anteriores se conserva.</p><button id="discard-confirm" class="primary">Descartar</button><button id="discard-cancel">Cancelar</button></section>'; bind('discard-confirm', () => { session = null; notice = ''; save(); render(); }); bind('discard-cancel', () => render()); });
    bind('check', check); bind('next', next); bind('back', back); bind('pause', back); bind('reinforce', reinforce);
    bind('progress', () => { screen = 'progress'; render(true); }); bind('last', () => { screen = 'result'; render(true); });
    bind('map', () => { mapOpen = !mapOpen; render(); }); bind('prev', () => move(session.index - 1));
    const forward = () => { if (expired()) return; if (session.index === session.ids.length - 1) { confirming = true; render(true); } else move(session.index + 1); };
    bind('exam-next', forward); bind('omit', () => { if (expired()) return; session.answers[session.index] = null; session.selected = null; save(); forward(); });
    bind('flag', () => { const i = session.index; session.flags = session.flags.includes(i) ? session.flags.filter(x => x !== i) : [...session.flags, i]; save(); render(); });
    bind('finish', finish); bind('cancel-finish', () => { confirming = false; render(); });
    root.querySelectorAll('[data-choice]').forEach(b => b.onclick = () => choose(Number(b.dataset.choice)));
    root.querySelectorAll('[data-conf]').forEach(b => b.onclick = () => confidence(b.dataset.conf));
    root.querySelectorAll('[data-explain]').forEach(b => b.onclick = () => { explainMode = b.dataset.explain; render(); });
    root.querySelectorAll('[data-jump]').forEach(b => b.onclick = () => move(Number(b.dataset.jump)));
    root.querySelectorAll('[data-result]').forEach(b => b.onclick = () => { lastResult = assessments.find(x => x.id === b.dataset.result); screen = 'result'; render(true); });
    if (top) window.scrollTo(0, 0);
  }
  window.cachasteNativeBack = () => { if (screen !== 'home') { back(); return true; } return false; };
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); else if (screen === 'quiz') render(); });
  setInterval(() => { if (screen === 'quiz' && session?.mode === 'full' && !expired()) { const t = document.getElementById('exam-timer'); if (t) t.textContent = 'Tiempo restante: ' + timeLeft(); } }, 1000);
  render();
  if(typeof URLSearchParams!=='undefined'&&new URLSearchParams(window.location?.search||'').get('modo')==='ensayo'&&!session)begin('full');
  if(typeof URLSearchParams!=='undefined'&&new URLSearchParams(window.location?.search||'').get('modo')==='diagnostico'&&!session)begin('diagnostic');
};
