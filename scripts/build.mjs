import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';

const revision = process.env.GITHUB_SHA || 'local';
if (!/^(local|[a-f0-9]{40})$/.test(revision)) throw new Error('Invalid build revision');
const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
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
for(const file of ['learning-core.js','study-app.js','study-ui.css','history-bank.js','history-app.js','science-bank.js','science-app.js','reading-bank.js','reading-app.js','m2-bank.js','m2-app.js']){
  const body=await readFile(new URL('../'+file,import.meta.url),'utf8');
  await writeFile(new URL('../dist/'+file,import.meta.url),body);
}
await mkdir(new URL('../dist/assets/',import.meta.url),{recursive:true});
for(const asset of ['cachaste-icon.svg','cachaste-logo.svg'])await copyFile(new URL('../assets/'+asset,import.meta.url),new URL('../dist/assets/'+asset,import.meta.url));
await writeFile(new URL('../dist/.nojekyll', import.meta.url), '');
await writeFile(new URL('../dist/version.json', import.meta.url), JSON.stringify({ revision }) + '\n');
console.log(`Static build ready (${revision}); only public application files are included.`);
