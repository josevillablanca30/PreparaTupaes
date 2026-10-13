import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

// A repository subpath catches the same relative-path mistakes as GitHub Pages.
const files = new Map([
  ['/PreparaTupaes/', ['index.html', 'text/html; charset=utf-8']],
  ['/PreparaTupaes/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/PreparaTupaes/inicio.html', ['inicio.html', 'text/html; charset=utf-8']],
  ['/PreparaTupaes/science.html', ['science.html', 'text/html; charset=utf-8']],
  ['/PreparaTupaes/science-bank.js', ['science-bank.js', 'text/javascript; charset=utf-8']],
  ['/PreparaTupaes/science-app.js', ['science-app.js', 'text/javascript; charset=utf-8']],
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
