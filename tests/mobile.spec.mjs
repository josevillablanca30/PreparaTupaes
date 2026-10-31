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
      if (rect.width===0&&rect.height===0)continue;
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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Aprende primero. Después demuestra lo que sabes.');
  if (process.env.EXPECTED_SHA) await expect(page.locator('meta[name="build-revision"]')).toHaveAttribute('content', process.env.EXPECTED_SHA);
  await checkLayout(page);
  await info.attach('inicio-movil', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
});

test('diagnóstico completo: error, explicaciones, resultado y progreso persistente', async ({ page }, info) => {
  await page.goto('./');
  await page.locator('details.legacy-m1').evaluate(el=>el.open=true);
  await page.getByRole('button', { name: 'Hacer diagnóstico · 5 preguntas', exact: true }).tap();
  await expect(page.getByRole('button', { name: 'Comprobar respuesta', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'A) $10.000', exact: true }).tap();

  await page.getByRole('button', { name: 'Comprobar respuesta', exact: true }).tap();
  await expect(page.getByText('Todavía no, pero cada intento enseña algo.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Más fácil', exact: true }).tap();
  await expect(page.getByRole('heading',{name:'Imagínalo así',exact:true})).toBeVisible();
  await expect(page.getByText(/una de cuatro porciones de una pizza/)).toBeVisible();
  await page.getByRole('button', { name: 'Con un ejemplo', exact: true }).tap();
  await expect(page.getByText('Un estanque tenía 80 litros y se utilizó el 15% para regar. ¿Cuánta agua queda?',{exact:true})).toBeVisible();
  await expect(page.getByText(/80 − 12 = 68 litros/)).toBeVisible();
  await page.getByRole('button', { name: 'Paso a paso', exact: true }).tap();
  await expect(page.getByText('Restamos el ahorro al precio: 40.000 − 10.000 = $30.000.',{exact:true})).toBeVisible();
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
  await page.locator('details.legacy-m1').evaluate(el=>el.open=true);
  await page.getByRole('button', { name: 'Ver mi progreso', exact: true }).tap();
  await expect(page.getByRole('heading', { name: '5 respuestas registradas', exact: true })).toBeVisible();
});

test('práctica rápida de tres preguntas y repaso', async ({ page }) => {
  await page.goto('./');
  await page.locator('details.legacy-m1').evaluate(el=>el.open=true);
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
  await page.locator('details.legacy-m1').evaluate(el=>el.open=true);
  await page.getByRole('button', { name: 'Repasar mis puntos débiles', exact: true }).tap();
  await expect(page.getByText('MATEMÁTICA M1 · Potencias', { exact: true })).toBeVisible();
});

test('permite responder cuando el almacenamiento está bloqueado', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'QuotaExceededError'); }; });
  await page.goto('./');
  await page.locator('details.legacy-m1').evaluate(el=>el.open=true);
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
  await page.locator('details.legacy-m1').evaluate(el=>el.open=true);
    await page.getByRole('button', { name: 'Ver mi progreso', exact: true }).tap();
    await expect(page.getByRole('heading', { name: '0 respuestas registradas', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Repasar', exact: true }).tap();
    await answer(page, 'C) $30.000');
  });
}

test('nueva ronda sin alternativa ni confianza heredadas', async ({ page }) => {
  await page.goto('./');
  await page.locator('details.legacy-m1').evaluate(el=>el.open=true);
  await page.getByRole('button', { name: 'Hacer diagnóstico · 5 preguntas', exact: true }).tap();

  await page.getByRole('button', { name: 'A) $10.000', exact: true }).tap();
  await page.getByRole('button', { name: '← Inicio', exact: true }).tap();
  await page.getByRole('button',{name:'Descartar práctica',exact:true}).click();
  await page.getByRole('button',{name:'Sí, descartar sesión',exact:true}).click();
  await page.locator('details.legacy-m1').evaluate(el=>el.open=true);
  await page.getByRole('button', { name: 'Práctica rápida · 3 preguntas', exact: true }).tap();
  await expect(page.getByRole('button', { name: 'Tengo dudas', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Comprobar respuesta', exact: true })).toBeDisabled();
});

test('simulacro M1: 65 preguntas, cronómetro y reanudación tras recarga', async ({ page }) => {
  await page.goto('./');
  await page.evaluate(()=>localStorage.setItem('cachaste-m1-diagnostic-30-v1',JSON.stringify({completed:true,results:Array.from({length:30},(_,i)=>({axis:['Números','Álgebra y funciones','Geometría','Probabilidad y estadística'][i%4],correct:true,confidence:'seguro'}))})));
 await page.reload();
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

test('simulacro M1: hoja de preguntas, marcador y entrega con confirmación', async ({ page }) => {
  await page.goto('./');
  await page.evaluate(()=>localStorage.setItem('cachaste-m1-diagnostic-30-v1',JSON.stringify({completed:true,results:Array.from({length:30},(_,i)=>({axis:['Números','Álgebra y funciones','Geometría','Probabilidad y estadística'][i%4],correct:true,confidence:'seguro'}))})));
 await page.reload();
 await page.getByRole('button', {name:'Simulacro M1 · 65 preguntas · 140 min',exact:true}).tap();
  await page.getByRole('button',{name:'Marcar para revisar',exact:true}).tap();
  await expect(page.getByRole('button',{name:'✓ Marcada para revisar',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Ver mapa de preguntas',exact:true}).tap();
  await expect(page.getByRole('button',{name:'Pregunta 1, sin responder, marcada',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Pregunta 65, sin responder',exact:true}).tap();
  await expect(page.getByText('Simulacro 65 / 65',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Revisar y finalizar',exact:true}).tap();
  await expect(page.getByRole('heading',{name:'Revisa tu simulacro',exact:true})).toBeVisible();
  await expect(page.getByText('Te faltan 65 sin responder.',{exact:false})).toBeVisible();
  await page.getByRole('button',{name:'Volver a preguntas',exact:true}).tap();
  await expect(page.getByRole('button',{name:'Pregunta 1, sin responder, marcada',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Revisar antes de entregar',exact:true}).tap();
  await page.getByRole('button',{name:'Entregar ensayo',exact:true}).tap();
  await expect(page.getByRole('heading',{name:'0 de 65 correctas',exact:true})).toBeVisible();
  await checkLayout(page);
});

test('práctica visual: los gráficos y figuras aparecen legibles en móvil', async ({page}) => {
  await page.goto('./');
  await page.locator('details.legacy-m1').evaluate(el=>el.open=true);
  await page.getByRole('button',{name:'Interpretar gráficos y figuras · 8 ejercicios',exact:true}).tap();
  await expect(page.locator('figure.question-visual svg[role="img"]')).toHaveCount(1);
  await expect(page.locator('figure.question-visual figcaption')).toBeVisible();
  await expect(page.getByText('1 / 8',{exact:true})).toBeVisible();
  await checkLayout(page);
  await page.getByRole('button',{name:'Necesito una pista',exact:true}).tap();
  await expect(page.getByText('Pista 1 de 2',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Otra pista, por favor',exact:true}).tap();
  await expect(page.getByText('Pista 2 de 2',{exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Ya tienes las dos pistas',exact:true})).toBeDisabled();
  await checkLayout(page);
});
test('tutor: progreso registra ayuda sin inflar el dominio',async({page})=>{
  await page.goto('./');
  await page.locator('details.legacy-m1').evaluate(el=>el.open=true);
  await page.getByRole('button',{name:'Hacer diagnóstico · 5 preguntas',exact:true}).tap();
  await page.getByRole('button',{name:'Necesito una pista',exact:true}).tap();
  await page.getByRole('button',{name:'C) $30.000',exact:true}).tap();

  await page.getByRole('button',{name:'Comprobar respuesta',exact:true}).tap();
  await expect(page.getByText('¡Bien! Lo lograste con una pista.',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'← Inicio',exact:true}).tap();
  await page.locator('details.legacy-m1').evaluate(el=>el.open=true);
  await page.getByRole('button',{name:'Ver mi progreso',exact:true}).tap();
  await expect(page.locator('.axis-progress').filter({hasText:'Números'}).getByText(/1 con pistas/)).toBeVisible();
  await checkLayout(page);
});

test('simulacro: errores pendientes sobreviven y se repasan de diez en diez',async({page})=>{
 await page.goto('./');
 await page.evaluate(()=>localStorage.setItem('cachaste-m1-diagnostic-30-v1',JSON.stringify({completed:true,results:Array.from({length:30},(_,i)=>({axis:['Números','Álgebra y funciones','Geometría','Probabilidad y estadística'][i%4],correct:true,confidence:'seguro'}))})));
 await page.reload();
 await page.getByRole('button',{name:'Simulacro M1 · 65 preguntas · 140 min',exact:true}).tap();
 await page.getByRole('button',{name:'Ver mapa de preguntas',exact:true}).tap();
 await page.getByRole('button',{name:'Revisar antes de entregar',exact:true}).tap();
 await page.getByRole('button',{name:'Entregar ensayo',exact:true}).tap();
 await expect(page.getByRole('heading',{name:'0 de 65 correctas',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Ver progreso',exact:true}).tap();
 await expect(page.getByRole('button',{name:'Repasar mis 65 pendientes',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Repasar mis 65 pendientes',exact:true}).tap();
 await expect(page.getByText('1 / 10',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'← Inicio',exact:true}).tap();
 await page.reload();
 await expect(page.getByText(/Tienes 65 ejercicios para reforzar/)).toBeVisible();
 await page.getByRole('button',{name:'Continuar mi repaso',exact:true}).tap();
 await expect(page.getByText('1 / 10',{exact:true})).toBeVisible();
 await checkLayout(page);
});
test('progreso amigable: cuatro ejes y detalles plegados',async({page})=>{
 await page.goto('./');
  await page.locator('details.legacy-m1').evaluate(el=>el.open=true);
 await page.getByRole('button',{name:'Ver mi progreso',exact:true}).tap();
 await expect(page.getByRole('heading',{name:'Tu mapa por eje',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Practicar Números',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Practicar Geometría',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Practicar Álgebra y funciones',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Practicar Probabilidad y estadística',exact:true})).toBeVisible();
 await checkLayout(page);
});

test('diagnóstico integral M1: lectura cómoda y cobertura de los cuatro ejes',async({page})=>{
 await page.goto('./');
  await page.locator('details.legacy-m1').evaluate(el=>el.open=true);
 await page.getByRole('button',{name:'Diagnóstico integral M1 · 12 preguntas',exact:true}).tap();
 await expect(page.getByText('1 / 12',{exact:true})).toBeVisible();
 await expect(page.locator('button.option')).toHaveCount(4);
 await expect(page.getByRole('button',{name:'Necesito una pista',exact:true})).toBeVisible();
 await checkLayout(page);
});
test('argumentación M1: corrige razonamientos en interfaz móvil',async({page})=>{
 await page.goto('./');
  await page.locator('details.legacy-m1').evaluate(el=>el.open=true);
 await page.getByRole('button',{name:'Detectar errores y razonar · 8 desafíos',exact:true}).tap();
 await expect(page.getByText('1 / 8',{exact:true})).toBeVisible();
 await expect(page.locator('button.option')).toHaveCount(4);
 await expect(page.getByRole('button',{name:'Comprobar respuesta',exact:true})).toBeDisabled();
 await page.locator('button.option').first().tap();
 await page.getByRole('button',{name:'Comprobar respuesta',exact:true}).tap();
 await expect(page.getByText('Respuesta correcta:',{exact:false})).toBeVisible();
 await page.getByRole('button',{name:'Más fácil',exact:true}).tap();
 await expect(page.getByRole('heading',{name:'Imagínalo así',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Con un ejemplo',exact:true}).tap();
 await expect(page.getByRole('heading',{name:'Un problema distinto',exact:true})).toBeVisible();
 await checkLayout(page);
});

test('UX M1: diagnóstico de 30 habilita los dos ensayos y registra plan',async({page})=>{
 test.setTimeout(120000);
 await page.goto('./');
 await expect(page.getByRole('button',{name:'Express · 10 preguntas',exact:true})).toBeDisabled();
 await expect(page.getByRole('button',{name:'Simulacro M1 · 65 preguntas · 140 min',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Comenzar diagnóstico de 30',exact:true}).tap();
 await expect(page.getByText('1 / 30',{exact:true})).toBeVisible();
 await page.locator('button.option').first().tap();
 await page.getByRole('button',{name:'Comprobar respuesta',exact:true}).tap();
 await page.getByRole('button',{name:'Siguiente pregunta →',exact:true}).tap();
 await page.evaluate(()=>{
  for(let n=1;n<30;n++){
   document.querySelector('button.option').click();
   document.querySelector('button[onclick="check()"]').click();
   document.querySelector('button[onclick="next()"]').click();
  }
 });
 await page.goto('./');
 await expect(page.getByRole('button',{name:'Express · 10 preguntas',exact:true})).toBeEnabled();
 await expect(page.getByRole('button',{name:'Simulacro M1 · 65 preguntas · 140 min',exact:true})).toBeEnabled();
 await expect(page.getByText('Esto conviene reforzar primero')).toBeVisible();
 await checkLayout(page);
});
