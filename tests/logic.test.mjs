import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];
function app(saved = '[]', failSave = false) {
  const element = { innerHTML: '' };
  const context = vm.createContext({
    document: { getElementById: () => element },
    window: { scrollTo() {} },
    localStorage: { getItem: () => saved, setItem: (_, value) => {
      if (failSave) throw new Error('Storage blocked');
      saved = value;
    } }
  });
  vm.runInContext(source, context);
  return code => vm.runInContext(code, context);
}

test('diagnóstico: calcula solamente las respuestas de la ronda actual', () => {
  const run = app(JSON.stringify([{ id: 1, correct: false }]));
  run("start('diagnostico'); for(let n=0;n<5;n++){choice=queue[i].answer;check();next()}");
  assert.equal(run('page'), 'result');
  assert.match(run('result()'), /5 de 5 correctas/);
  assert.equal(run('history.length'), 6);
});
test('no registra respuestas vacías ni duplicadas', () => {
  const run = app();
  run("start('rapida');check()");
  assert.equal(run('history.length'), 0);
  run('choice=2;check();check()');
  assert.equal(run('history.length'), 1);
});
test('almacenamiento bloqueado: permite terminar y muestra el aviso', () => {
  const run = app('[]', true);
  run("start('rapida'); for(let n=0;n<3;n++){choice=queue[i].answer;check();next()}");
  assert.equal(run('page'), 'result');
  assert.equal(run('round.length'), 3);
  assert.equal(run('storageAvailable'), false);
});
test('datos dañados: conserva registros válidos y normaliza sus etiquetas', () => {
  const run = app('[null,{"id":1,"correct":true,"skill":"<img src=x>"},{"id":99,"correct":false}]');
  assert.equal(run('history.length'), 1);
  assert.equal(run('history[0].skill'), 'Porcentajes');
  for (const value of ['{}', 'null', 'invalid']) assert.equal(app(value)('history.length'), 0);
});
test('repaso: prioriza la habilidad con respuesta incorrecta', () => {
  const run = app('[{"id":4,"correct":false},{"id":1,"correct":true}]');
  run("start('repaso')");
  assert.equal(run('queue[0].id'), 4);
  assert.equal(run('queue.length'), 3);
});
test('nueva ronda: reinicia alternativa, confianza y explicación', () => {
  const run = app();
  run("start('diagnostico');choice=0;confidence='azar';check();mode='easy';navigate('home');start('rapida')");
  assert.equal(run('choice'), null);
  assert.equal(run('confidence'), 'duda');
  assert.equal(run('mode'), 'steps');
  assert.equal(run('round.length'), 0);
});
