import { mkdir, readFile, writeFile } from 'node:fs/promises';

const revision = process.env.GITHUB_SHA || 'local';
if (!/^(local|[a-f0-9]{40})$/.test(revision)) throw new Error('Invalid build revision');
const source = await readFile(new URL('../index.html', import.meta.url), 'utf8');
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/index.html', import.meta.url), source.replace('</head>', `<meta name="build-revision" content="${revision}"></head>`));
await writeFile(new URL('../dist/.nojekyll', import.meta.url), '');
await writeFile(new URL('../dist/version.json', import.meta.url), JSON.stringify({ revision }) + '\n');
console.log(`Static build ready (${revision}); only public application files are included.`);
