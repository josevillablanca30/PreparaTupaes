import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import {competitionFiles,competitionArt} from './competition-public-files.mjs';

// A repository subpath catches the same relative-path mistakes as GitHub Pages.
const files = new Map([
 ...competitionFiles.map(f=>['/PreparaTupaes/'+f,[f,f.endsWith('.html')?'text/html; charset=utf-8':f.endsWith('.json')?'application/json':f.endsWith('.css')?'text/css':'text/javascript']]),
 ...competitionArt.map(f=>['/PreparaTupaes/'+f,[f,'image/svg+xml']]),
 ['/PreparaTupaes/assets/gatito-sabio-poses-v2.webp',['assets/gatito-sabio-poses-v2.webp','image/webp']],['/PreparaTupaes/assets/map-valley-v1.webp',['assets/map-valley-v1.webp','image/webp']],['/PreparaTupaes/assets/subject-m1-v1.webp',['assets/subject-m1-v1.webp','image/webp']],['/PreparaTupaes/assets/subject-m2-v1.webp',['assets/subject-m2-v1.webp','image/webp']],['/PreparaTupaes/assets/subject-reading-v1.webp',['assets/subject-reading-v1.webp','image/webp']],['/PreparaTupaes/assets/subject-history-v1.webp',['assets/subject-history-v1.webp','image/webp']],['/PreparaTupaes/assets/subject-science-v1.webp',['assets/subject-science-v1.webp','image/webp']],
 ...['osmosis','meiosis','electricity','waves','geometry','probability','industry','argument'].map(key=>['/PreparaTupaes/assets/lesson-cat-'+key+'-v3.webp',['assets/lesson-cat-'+key+'-v3.webp','image/webp']]),
 ...['algebra','mechanics','solutions','sources'].map(key=>['/PreparaTupaes/assets/lesson-cat-'+key+'-v2.webp',['assets/lesson-cat-'+key+'-v2.webp','image/webp']]),
 ...['atp','numbers','balance','functions','reading','history'].map(key=>['/PreparaTupaes/assets/lesson-cat-'+key+'-v1.webp',['assets/lesson-cat-'+key+'-v1.webp','image/webp']]),
 ...['daily-foundation-visuals.js','daily-basics.js','daily-visuals.js','daily-curriculum.js','daily-school.js','daily-progression.js','daily-illustration-kit.js','daily-scenarios.js','daily-demonstrations.js','daily-lessons.js','daily-core.js','daily-gameplay.js','daily-studios.js','daily-app.js','daily-catalog.js','daily-lesson-visuals.js','daily-topic-visuals.js','daily-reference.css','daily-ui.css'].map(f=>['/PreparaTupaes/'+f,[f,f.endsWith('.css')?'text/css':'text/javascript']]),
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
 ['/PreparaTupaes/suscripcion.html', ['suscripcion.html', 'text/html; charset=utf-8']],
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
// Local opt-in preview of the debug-only Android overlay; never served by public builds.
const betaPreview=process.env.CACHASTE_BETA_PREVIEW==='1';
if(betaPreview)for(const file of ['beta-vs.html','beta-vs.js','beta-vs.css'])files.set('/PreparaTupaes/'+file,[file,file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css':'text/javascript']);
createServer(async (request, response) => {
  const route = new URL(request.url, 'http://localhost').pathname;
  if (route === '/PreparaTupaes') {
    response.writeHead(301, { Location: '/PreparaTupaes/' }).end();
    return;
  }
  const file = files.get(route);
  if (!file) { response.writeHead(404).end('Not found'); return; }
  try {
    const betaFile=betaPreview&&['competencia.html','beta-vs.html','beta-vs.js','beta-vs.css'].includes(file[0]);
    const content = await readFile(new URL((betaFile?'../android/app/src/beta/assets/':'../dist/') + file[0], import.meta.url));
    response.writeHead(200, { 'Content-Type': file[1], 'Cache-Control': 'no-store' });
    response.end(content);
  } catch {
    response.writeHead(500).end('Run npm run build first');
  }
}).listen(4173, '127.0.0.1', () => console.log('http://127.0.0.1:4173/PreparaTupaes/'));
