import { test, expect } from '@playwright/test';

const storageKey = 'prepara-paes-demo-v1';
const pageErrors = new WeakMap();
async function checkLayout(page) {
  const issues = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const problems = [];
    if (document.documentElement.scrollWidth > width + 1) problems.push('horizontal overflow');
    for (const button of document.querySelectorAll('button')) {
      const rect = button.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) problems.push('small target: ' + button.textContent);
      if (rect.left < -1 || rect.right > width + 1) problems.push('offscreen: ' + button.textContent);
    }
    return problems;
  });
  expect(issues).toEqual([]);
}
async function answer(page, label, last = false) {
  await page.getByRole('button', { name: label, exact: true }).tap();
  await page.getByRole('button', { name: 'Comprobar respuesta', exact: true }).tap();
  await expect(page.getByText('Respuesta correcta:', { exact: false })).toBeVisible();
  await checkLayout(page);
  await page.getByRole('button', { name: last ? 'Ver mi resultado' : 'Siguiente pregunta →', exact: true }).tap();
}

test.beforeEach(async ({ page }) => {
  const failures = [];
  pageErrors.set(page, failures);
  page.on('pageerror', error => failures.push(error.message));
  page.on('console', message => { if (message.type() === 'error') failures.push(message.text()); });
});
test.afterEach(async ({ page }) => expect(pageErrors.get(page)).toEqual([]));

test('inicio: carga, revisión publicada y controles táctiles', async ({ page }, info) => {
  const response = await page.goto('./');
  expect(response.status()).toBe(200);
  await expect(page).toHaveTitle('Cachaste · Aprende a tu ritmo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('¿Cachaste? Aquí aprender se siente distinto.');
  if (process.env.EXPECTED_SHA) await expect(page.locator('meta[name="build-revision"]')).toHaveAttribute('content', process.env.EXPECTED_SHA);
  await checkLayout(page);
  await info.attach('inicio-movil', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
});

test('diagnóstico completo: error, explicaciones, resultado y progreso persistente', async ({ page }, info) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Hacer diagnóstico · 5 preguntas', exact: true }).tap();
  await expect(page.getByRole('button', { name: 'Comprobar respuesta', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'A) $10.000', exact: true }).tap();
  await page.getByRole('button', { name: 'Tengo dudas', exact: true }).tap();
  await page.getByRole('button', { name: 'Comprobar respuesta', exact: true }).tap();
  await expect(page.getByText('Todavía no, pero cada intento enseña algo.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Más fácil', exact: true }).tap();
  await expect(page.getByText(/25% es la cuarta parte/)).toBeVisible();
  await page.getByRole('button', { name: 'Con un ejemplo', exact: true }).tap();
  await expect(page.getByText('Una polera de $20.000 con 25% de descuento queda en $15.000.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Paso a paso', exact: true }).tap();
  await expect(page.getByText('Resta el descuento: 40.000 − 10.000 = 30.000.', { exact: true })).toBeVisible();
  await checkLayout(page);
  await info.attach('explicacion-movil', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  await page.getByRole('button', { name: 'Siguiente pregunta →', exact: true }).tap();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await answer(page, 'B) 5');
  await answer(page, 'B) $9.000');
  await answer(page, 'C) 17');
  await answer(page, 'B) 2/5', true);
  await expect(page.getByRole('heading', { name: '4 de 5 correctas', exact: true })).toBeVisible();
  await checkLayout(page);
  await page.getByRole('button', { name: 'Ver progreso', exact: true }).tap();
  await expect(page.getByRole('heading', { name: '5 respuestas registradas', exact: true })).toBeVisible();
  await checkLayout(page);
  await page.reload();
  await page.getByRole('button', { name: 'Ver mi progreso', exact: true }).tap();
  await expect(page.getByRole('heading', { name: '5 respuestas registradas', exact: true })).toBeVisible();
});

test('práctica rápida de tres preguntas y repaso', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Práctica rápida · 3 preguntas', exact: true }).tap();
  await answer(page, 'C) $30.000');
  await answer(page, 'B) 5');
  await answer(page, 'B) $9.000', true);
  await expect(page.getByRole('heading', { name: '3 de 3 correctas', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Practicar lo que cuesta', exact: true }).tap();
  await expect(page.getByText('MATEMÁTICA M1 · Potencias', { exact: true })).toBeVisible();
  await checkLayout(page);
});

test('el repaso prioriza una respuesta incorrecta', async ({ page }) => {
  await page.addInitScript(key => localStorage.setItem(key, JSON.stringify([{ id: 4, correct: false }, { id: 1, correct: true }])), storageKey);
  await page.goto('./');
  await page.getByRole('button', { name: 'Repasar mis puntos débiles', exact: true }).tap();
  await expect(page.getByText('MATEMÁTICA M1 · Potencias', { exact: true })).toBeVisible();
});

test('permite responder cuando el almacenamiento está bloqueado', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'QuotaExceededError'); }; });
  await page.goto('./');
  await page.getByRole('button', { name: 'Práctica rápida · 3 preguntas', exact: true }).tap();
  await answer(page, 'C) $30.000');
  await expect(page.locator('.storage-notice')).toContainText('Puedes seguir practicando');
  await answer(page, 'B) 5');
  await answer(page, 'B) $9.000', true);
  await expect(page.getByRole('heading', { name: '3 de 3 correctas', exact: true })).toBeVisible();
});

for (const [label, saved] of [['JSON inválido', 'invalid'], ['formato inválido', '{}']]) {
  test('recuperación de progreso dañado: ' + label, async ({ page }) => {
    await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: storageKey, value: saved });
    await page.goto('./');
    await page.getByRole('button', { name: 'Ver mi progreso', exact: true }).tap();
    await expect(page.getByRole('heading', { name: '0 respuestas registradas', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Repasar', exact: true }).tap();
    await answer(page, 'C) $30.000');
  });
}

test('nueva ronda sin alternativa ni confianza heredadas', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Hacer diagnóstico · 5 preguntas', exact: true }).tap();
  await page.getByRole('button', { name: 'Lo tengo claro', exact: true }).tap();
  await page.getByRole('button', { name: 'A) $10.000', exact: true }).tap();
  await page.getByRole('button', { name: '← Inicio', exact: true }).tap();
  await page.getByRole('button', { name: 'Práctica rápida · 3 preguntas', exact: true }).tap();
  await expect(page.getByRole('button', { name: 'Tengo dudas', exact: true })).toHaveClass('active');
  await expect(page.getByRole('button', { name: 'Comprobar respuesta', exact: true })).toBeDisabled();
});

test('simulacro M1: 65 preguntas, cronómetro y reanudación tras recarga', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Simulacro M1 · 65 preguntas · 140 min', exact: true }).tap();
  await expect(page.getByText('Simulacro 1 / 65', { exact: true })).toBeVisible();
  await expect(page.getByRole('timer')).toContainText('Tiempo restante:');
  await checkLayout(page);
  await page.getByRole('button', { name: 'Siguiente →', exact: true }).tap();
  await page.reload();
  await page.getByRole('button', { name: 'Continuar ensayo', exact: true }).tap();
  await expect(page.getByText('Simulacro 2 / 65', { exact: true })).toBeVisible();
  await expect(page.getByRole('timer')).toContainText('Tiempo restante:');
});
