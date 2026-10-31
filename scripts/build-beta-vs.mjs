import {mkdir,readFile,writeFile,copyFile,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';

// A debug-only Android source set. Never added to dist or release/main assets.
const output=new URL('../android/app/src/beta/assets/',import.meta.url);
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
for(const file of ['beta-vs.html','beta-vs.css'])await copyFile(new URL('../beta/'+file,import.meta.url),new URL(file,output));
await build({entryPoints:[fileURLToPath(new URL('../beta/beta-vs-app.mjs',import.meta.url))],outfile:fileURLToPath(new URL('beta-vs.js',output)),bundle:true,minify:true,platform:'browser',target:'chrome100',format:'iife'});
const page=await readFile(new URL('../dist/competencia.html',import.meta.url),'utf8');
const banner='<aside class="beta-entry"><div><strong>¿Quieres probar cómo quedó el VS?</strong><small>Beta · dos personas en este teléfono, sin cuenta ni pago.</small></div><a href="beta-vs.html">Probar VS local</a></aside>';
await writeFile(new URL('competencia.html',output),page.replace('</head>','<link rel="stylesheet" href="beta-vs.css"></head>').replace('<body>','<body>'+banner));
console.log('VS local generado solo en el source set de beta; dist y release conservan su distribución.');
