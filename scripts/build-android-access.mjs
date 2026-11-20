// Run after the unchanged original static build; never produces an AAB.
import {readFile,writeFile} from 'node:fs/promises';
import {build} from 'esbuild';
import {adaptOriginalLearning,adaptConsumptionCompetition} from '../learning/presentation.mjs';
await writeFile('dist/daily-app.js',adaptOriginalLearning(await readFile('dist/daily-app.js','utf8')));
await writeFile('dist/inicio.html',(await readFile('dist/inicio.html','utf8')).replace('<script src="daily-app.js">','<script src="learning-access.js"></script><script src="daily-app.js">'));
await build({entryPoints:['learning/runtime.mjs'],outfile:'dist/learning-access.js',bundle:true,format:'iife',target:'chrome100',minify:true});
await build({entryPoints:['learning/competition-entry.mjs'],outfile:'dist/competition-client.js',bundle:true,format:'iife',target:'chrome100',minify:true});
await writeFile('dist/competition-app.js',adaptConsumptionCompetition(await readFile('dist/competition-app.js','utf8')));
const page=await readFile('suscripcion.html','utf8');
const head=page.slice(0,page.indexOf('<body>'));
await writeFile('dist/suscripcion.html',head+`<body><main><a class="back" href="inicio.html">← Volver a las asignaturas</a><p class="eyebrow">¿Cachaste? · Mi acceso</p><h1>Aprende a tu ritmo</h1><p id="access-status">Tu cuenta puede utilizar el Plan Básico sin tarjeta.</p><div class="plan"><h2>Plan Básico</h2><ul><li>3 etapas diarias por asignatura.</li><li>1 diagnóstico por asignatura, una sola vez.</li><li>1 PAES Express diario.</li><li>2 duelos diarios.</li><li>Tu progreso y estrellas se conservan.</li></ul></div><p>¿Quieres acceder a todas las funciones de ¿Cachaste??</p><p>Puedes conocer nuestros planes y suscribirte en <span>sitecacho.cl</span>.</p><p>Después, inicia sesión con la misma cuenta para disfrutar tus beneficios.</p><p><a class="back" href="competencia.html#perfil">Ingresar o actualizar mi acceso</a></p></main></body></html>`);
// No Billing entry point is packaged in the consumption-only build.
await writeFile('dist/competition-billing.js','/* Android consumption-only: purchases are not available inside this application. */\n');
console.log('Original Android educational engine connected; consumption-only presentation prepared. No APK/AAB generated.');
