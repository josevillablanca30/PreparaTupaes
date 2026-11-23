import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const plans = html.match(/<section[^>]+id="planes"[^>]*>([\s\S]*?)<\/section>/)[1];
test('public plans keep Basic first and preserve Premium prices and destinations', () => {
  const cards = [...plans.matchAll(/<article[^>]*>([\s\S]*?)<\/article>/g)].map(match => match[1]);
  assert.deepEqual(cards.map(card => card.match(/<h3>(.*?)<\/h3>/)[1]), ['Básico','Semanal','Mensual','Anual']);
  const prices = ['GRATIS','$2.490','$7.990','$64.990'];
  cards.forEach((card, i) => {
    assert.ok(card.includes('<p class="price">'+prices[i]));
    assert.ok(card.includes('href="/cuenta.html#planes"'));
  });
  assert.match(cards[0], /Empezar gratis/);
  assert.match(html, /class="primary-button" href="\/cuenta.html#planes">Empezar gratis/);
});
test('public landing describes the available preparation without obsolete testing notices', () => {
  assert.doesNotMatch(html,/pruebas cerradas|etapa de pruebas|acceso de prueba|cobros .*no están habilitados|Versión de revisión/i);
  for (const label of ['Tutor paso a paso','Modo juego y diagnóstico','Ensayo Express','Ensayos PAES completos','Duelos y revanchas','Rankings y progreso','Preparación independiente de DEMRE']) assert.ok(html.includes(label),label);
});
