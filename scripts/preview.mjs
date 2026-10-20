import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

// A repository subpath catches the same relative-path mistakes as GitHub Pages.
const files = new Map([
 ...['daily-foundation-visuals.js','daily-basics.js','daily-visuals.js','daily-curriculum.js','daily-progression.js','daily-core.js','daily-gameplay.js','daily-studios.js','daily-app.js','daily-catalog.js','daily-ui.css'].map(f=>['/PreparaTupaes/'+f,[f,f.endsWith('.css')?'text/css':'text/javascript']]),
 ['/PreparaTupaes/assets/gatito-sabio-poses-v1.png',['assets/gatito-sabio-poses-v1.png','image/png']],
 ['/PreparaTupaes/assets/gatito-sabio-oficial.png',['assets/gatito-sabio-oficial.png','image/png']],
  ['/PreparaTupaes/m1-teaching.js', ['m1-teaching.js', 'text/javascript; charset=utf-8']],
  ['/PreparaTupaes/editorial-revisions.js', ['editorial-revisions.js', 'text/javascript; charset=utf-8']],
 ['/PreparaTupaes/learning-core.js', ['learning-core.js', 'text/javascript; charset=utf-8']],
  ['/PreparaTupaes/study-app.js', ['study-app.js', 'text/javascript; charset=utf-8']],
  ['/PreparaTupaes/study-ui.css', ['study-ui.css', 'text/css; charset=utf-8']],
  ['/PreparaTupaes/', ['index.html', 'text/html; charset=utf-8']],
  ['/PreparaTupaes/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/PreparaTupaes/inicio.html', ['inicio.html', 'text/html; charset=utf-8']],
  ['/PreparaTupaes/science.html', ['science.html', 'text/html; charset=utf-8']],
  ['/PreparaTupaes/reading.html', ['reading.html', 'text/html; charset=utf-8']],
  ['/PreparaTupaes/reading-bank.js', ['reading-bank.js', 'text/javascript; charset=utf-8']],
  ['/PreparaTupaes/reading-app.js', ['reading-app.js', 'text/javascript; charset=utf-8']],
  ['/PreparaTupaes/science-bank.js', ['science-bank.js', 'text/javascript; charset=utf-8']],
  ['/PreparaTupaes/science-app.js', ['science-app.js', 'text/javascript; charset=utf-8']],
  ['/PreparaTupaes/m2.html', ['m2.html', 'text/html; charset=utf-8']],
  ['/PreparaTupaes/m2-bank.js', ['m2-bank.js', 'text/javascript; charset=utf-8']],
  ['/PreparaTupaes/m2-app.js', ['m2-app.js', 'text/javascript; charset=utf-8']],
  ['/PreparaTupaes/history.html', ['history.html', 'text/html; charset=utf-8']],
  ['/PreparaTupaes/history-bank.js', ['history-bank.js', 'text/javascript; charset=utf-8']],
  ['/PreparaTupaes/history-app.js', ['history-app.js', 'text/javascript; charset=utf-8']],
  ['/PreparaTupaes/assets/cachaste-icon.svg', ['assets/cachaste-icon.svg', 'image/svg+xml']],
  ['/PreparaTupaes/assets/cachaste-logo.svg', ['assets/cachaste-logo.svg', 'image/svg+xml']],
  ['/PreparaTupaes/version.json', ['version.json', 'application/json']]
]);
createServer(async (request, response) => {
  const route = new URL(request.url, 'http://localhost').pathname;
  if (route === '/PreparaTupaes') {
    response.writeHead(301, { Location: '/PreparaTupaes/' }).end();
    return;
  }
  const file = files.get(route);
  if (!file) { response.writeHead(404).end('Not found'); return; }
  try {
    const content = await readFile(new URL('../dist/' + file[0], import.meta.url));
    response.writeHead(200, { 'Content-Type': file[1], 'Cache-Control': 'no-store' });
    response.end(content);
  } catch {
    response.writeHead(500).end('Run npm run build first');
  }
}).listen(4173, '127.0.0.1', () => console.log('http://127.0.0.1:4173/PreparaTupaes/'));
