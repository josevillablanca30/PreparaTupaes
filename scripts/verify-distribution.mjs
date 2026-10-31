import {readdir,lstat} from 'node:fs/promises';
import {join} from 'node:path';
import {competitionFiles,competitionArt} from './competition-public-files.mjs';
// Contrato explícito de salida pública. Añadir archivos requiere revisar su destino.
export const distributionFiles=Object.freeze([
 ...competitionFiles,...competitionArt,
 'index.html','inicio.html','suscripcion.html','science.html','reading.html','m2.html','history.html',
 'daily-foundation-visuals.js','daily-basics.js','daily-visuals.js','daily-curriculum.js',
 'daily-school.js','daily-progression.js','daily-illustration-kit.js','daily-scenarios.js','daily-demonstrations.js','daily-lessons.js','daily-core.js','daily-gameplay.js','daily-studios.js','daily-app.js','daily-lesson-visuals.js','daily-topic-visuals.js','daily-reference.css','daily-ui.css',
 'learning-core.js','editorial-revisions.js','m1-teaching.js','study-app.js','study-ui.css','history-bank.js',
 'history-app.js','science-bank.js','science-app.js','reading-bank.js','reading-app.js',
 'm2-bank.js','m2-app.js','daily-catalog.js','.nojekyll','version.json',
 'assets/gatito-sabio-poses-v2.webp','assets/map-valley-v1.webp','assets/subject-m1-v1.webp','assets/subject-m2-v1.webp','assets/subject-reading-v1.webp','assets/subject-history-v1.webp','assets/subject-science-v1.webp',
 'assets/gatito-sabio-poses-v1.png','assets/gatito-sabio-oficial.png',
 'assets/cachaste-icon.svg','assets/cachaste-logo.svg',
 ...['osmosis','meiosis','electricity','waves','geometry','probability','industry','argument'].map(k=>'assets/lesson-cat-'+k+'-v3.webp'),
 ...['algebra','mechanics','solutions','sources'].map(k=>'assets/lesson-cat-'+k+'-v2.webp'),
 ...['atp','numbers','balance','functions','reading','history'].map(k=>'assets/lesson-cat-'+k+'-v1.webp')
]);
export async function verifyDistribution(root){
 const allowed=new Set(distributionFiles),found=new Set();
 async function walk(relative=''){
  for(const name of await readdir(join(root,relative))){
   const path=relative?relative+'/'+name:name,stat=await lstat(join(root,path));
   if(stat.isSymbolicLink())throw new Error('Enlace no permitido en distribución: '+path);
   if(stat.isDirectory()){
    if(path!=='assets')throw new Error('Directorio no permitido en distribución: '+path);
    await walk(path);
   }else{
    if(!stat.isFile()||!allowed.has(path))throw new Error('Archivo no permitido en distribución: '+path);
    found.add(path);
   }
  }
 }
 await walk();
 const missing=distributionFiles.filter(path=>!found.has(path));
 if(missing.length)throw new Error('Distribución incompleta: '+missing.join(', '));
 return {files:found.size};
}
