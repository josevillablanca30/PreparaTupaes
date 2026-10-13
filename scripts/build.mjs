import { mkdir, readFile, writeFile } from 'node:fs/promises';

const revision = process.env.GITHUB_SHA || 'local';
if (!/^(local|[a-f0-9]{40})$/.test(revision)) throw new Error('Invalid build revision');
const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
const dashboard=await readFile(new URL('../inicio.html',import.meta.url),'utf8');
await writeFile(new URL('../dist/inicio.html',import.meta.url),dashboard.replace('</head>',`<meta name="build-revision" content="${revision}"></head>`));
await writeFile(new URL('../dist/index.html', import.meta.url), source.replace('</head>', `<meta name="build-revision" content="${revision}"></head>`));
const sciencePage=await readFile(new URL('../science.html', import.meta.url),'utf8');
await writeFile(new URL('../dist/science.html',import.meta.url),sciencePage.replace('</head>',`<meta name="build-revision" content="${revision}"></head>`));
for(const file of ['science-bank.js','science-app.js']){
  const body=await readFile(new URL('../'+file,import.meta.url),'utf8');
  await writeFile(new URL('../dist/'+file,import.meta.url),body);
}
await writeFile(new URL('../dist/.nojekyll', import.meta.url), '');
await writeFile(new URL('../dist/version.json', import.meta.url), JSON.stringify({ revision }) + '\n');
console.log(`Static build ready (${revision}); only public application files are included.`);
