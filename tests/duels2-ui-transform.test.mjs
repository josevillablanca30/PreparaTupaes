import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
import {adaptDuels2Ui} from '../duels2/ui-transform.mjs';

test('Android builds valid Duelos 2 code with the existing avatars, tutor and native navigation', () => {
  const input = readFileSync(new URL('../competition-app.js', import.meta.url), 'utf8');
  const output = adaptDuels2Ui(input);
  assert.doesNotThrow(() => new Script(output));
  const avatar = input.split('\n').find(line => line.startsWith(' const avatar='));
  assert.ok(avatar && output.includes(avatar));
  for (const marker of ['CACHASTE_DUELS2_RUNTIME','Tu alternativa:','Paso a paso','Más fácil',
    'Otro ejemplo','cachasteNativeBack','cachaste_duels2_live','90 segundos por pregunta']) {
    assert.ok(output.includes(marker), marker);
  }
  assert.equal(adaptDuels2Ui(output), output);
});
