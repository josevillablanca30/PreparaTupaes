import {dailyCatalog} from './daily-catalog.mjs';
import {verifyDistribution} from './verify-distribution.mjs';
import {fileURLToPath} from 'node:url';
import { mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises';

const revision = process.env.GITHUB_SHA || 'local';
if (!/^(local|[a-f0-9]{40})$/.test(revision)) throw new Error('Invalid build revision');
const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
// Solo se limpia la salida regenerable del build; nunca el checkout ni datos del estudiante.
await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
const dashboard=await readFile(new URL('../inicio.html',import.meta.url),'utf8');
await writeFile(new URL('../dist/inicio.html',import.meta.url),dashboard.replace('</head>',`<meta name="build-revision" content="${revision}"></head>`));
await writeFile(new URL('../dist/index.html', import.meta.url), source.replace('</head>', `<meta name="build-revision" content="${revision}"></head>`));
const sciencePage=await readFile(new URL('../science.html', import.meta.url),'utf8');
await writeFile(new URL('../dist/science.html',import.meta.url),sciencePage.replace('</head>',`<meta name="build-revision" content="${revision}"></head>`));
const readingPage=await readFile(new URL('../reading.html',import.meta.url),'utf8');
await writeFile(new URL('../dist/reading.html',import.meta.url),readingPage.replace('</head>',`<meta name="build-revision" content="${revision}"></head>`));
const m2Page=await readFile(new URL('../m2.html',import.meta.url),'utf8');
await writeFile(new URL('../dist/m2.html',import.meta.url),m2Page.replace('</head>',`<meta name="build-revision" content="${revision}"></head>`));
const historyPage=await readFile(new URL('../history.html',import.meta.url),'utf8');
await writeFile(new URL('../dist/history.html',import.meta.url),historyPage.replace('</head>',`<meta name="build-revision" content="${revision}"></head>`));
for(const file of ['daily-foundation-visuals.js','daily-basics.js','daily-visuals.js','daily-curriculum.js','daily-progression.js','daily-lessons.js','daily-core.js','daily-gameplay.js','daily-studios.js','daily-app.js','daily-ui.css','learning-core.js', 'editorial-revisions.js', 'm1-teaching.js','study-app.js','study-ui.css','history-bank.js','history-app.js','science-bank.js','science-app.js','reading-bank.js','reading-app.js','m2-bank.js','m2-app.js']){
  const body=await readFile(new URL('../'+file,import.meta.url),'utf8');
  await writeFile(new URL('../dist/'+file,import.meta.url),body);
}
await mkdir(new URL('../dist/assets/',import.meta.url),{recursive:true});
for(const asset of ['gatito-sabio-poses-v1.png','gatito-sabio-oficial.png','cachaste-icon.svg','cachaste-logo.svg','lesson-cat-atp-v1.webp','lesson-cat-numbers-v1.webp','lesson-cat-balance-v1.webp','lesson-cat-functions-v1.webp','lesson-cat-reading-v1.webp','lesson-cat-history-v1.webp'])await copyFile(new URL('../assets/'+asset,import.meta.url),new URL('../dist/assets/'+asset,import.meta.url));
await writeFile(new URL('../dist/.nojekyll', import.meta.url), '');
await writeFile(new URL('../dist/version.json', import.meta.url), JSON.stringify({ revision }) + '\n');


await writeFile(new URL('../dist/daily-catalog.js',import.meta.url),'window.CACHASTE_DAILY_CATALOG='+JSON.stringify(dailyCatalog())+';\n');

const verified=await verifyDistribution(fileURLToPath(new URL('../dist/',import.meta.url)));
console.log(`Static build ready (${revision}); ${verified.files} distribution files verified.`);
