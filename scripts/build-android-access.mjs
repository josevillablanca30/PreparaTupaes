// Run after the unchanged original static build; never produces an AAB.
import {execFileSync} from 'node:child_process';
import {ANDROID_UI_REFERENCE,ANDROID_UI_FILES,androidSource,androidArt} from '../web/shared/android-reference.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import {build} from 'esbuild';
import {renderCommercialTerms,renderCommercialPrivacy} from '../web/shared/commercial-terms.mjs';
import {adaptOriginalLearning,adaptConsumptionCompetition} from '../learning/presentation.mjs';
// Preserve the latest approved Android presentation, including profile photos and legibility.
for(const file of [...ANDROID_UI_FILES.filter(f=>!f.endsWith('.mjs')),...androidArt()])await writeFile('dist/'+file,androidSource(file));
await writeFile('dist/daily-app.js',adaptOriginalLearning(await readFile('dist/daily-app.js','utf8')));
await writeFile('dist/inicio.html',(await readFile('dist/inicio.html','utf8')).replace('<script src="daily-app.js">','<script src="learning-access.js"></script><script src="daily-app.js">'));
await build({entryPoints:['learning/runtime.mjs'],outfile:'dist/learning-access.js',bundle:true,format:'iife',target:'chrome100',minify:true});
const client=androidSource('competition-client.mjs').toString().replace("detectSessionInUrl:typeof window!=='undefined'", "detectSessionInUrl:false,flowType:'pkce'");
await build({stdin:{contents:client+"\nimport {installLearningCompetition} from './learning/competition-client-adapter.mjs';installLearningCompetition(CompetitionClient,errors);",resolveDir:process.cwd()},outfile:'dist/competition-client.js',bundle:true,format:'iife',target:'chrome100',minify:true});
const config=(await readFile('competition-config.js','utf8')).replace('authReturnUrl:null',"authReturnUrl:'https://sitecacho.cl/recuperar',googleAuthReady:"+String(process.env.CACHASTE_ANDROID_GOOGLE_AUTH_READY==='true'));
await writeFile('dist/competition-config.js',config);
await writeFile('dist/competition-app.js',adaptConsumptionCompetition(await readFile('dist/competition-app.js','utf8')));
const page=execFileSync('git',['show',ANDROID_UI_REFERENCE+':suscripcion.html'],{encoding:'utf8'});
const head=page.slice(0,page.indexOf('<body>'));
await writeFile('dist/suscripcion.html',head+`<body><main><a class="back" href="inicio.html">← Volver a las asignaturas</a><p class="eyebrow">¿Cachaste? · Mi acceso</p><h1>Aprende a tu ritmo</h1><p id="access-status">Tu cuenta puede utilizar el Plan Básico sin tarjeta.</p><div class="plan"><h2>Plan Básico</h2><ul><li>3 etapas diarias por asignatura.</li><li>1 diagnóstico por asignatura, una sola vez.</li><li>1 PAES Express diario.</li><li>2 duelos diarios.</li><li>Tu progreso y estrellas se conservan.</li></ul></div><p>¿Quieres acceder a todas las funciones de ¿Cachaste??</p><p>Puedes conocer nuestros planes y suscribirte en <span>sitecacho.cl</span>.</p><p>Después, inicia sesión con la misma cuenta para disfrutar tus beneficios.</p><p><a class="back" href="competencia.html#perfil">Ingresar o actualizar mi acceso</a></p></main></body></html>`);
// No Billing entry point is packaged in the consumption-only build.
await writeFile('dist/competition-billing.js','/* Android consumption-only: purchases are not available inside this application. */\n');
console.log('Original Android educational engine connected; consumption-only presentation prepared. No APK/AAB generated.');

// Legal information stays inside Android and cannot lead to the web checkout.
const approved=JSON.parse(await readFile('web/deploy-final-public.request','utf8'));
for(const [name,render]of [['privacidad',renderCommercialPrivacy],['condiciones',renderCommercialTerms],['eliminar-cuenta',text=>text]]){
 let text=await readFile('web/public/'+name+'.html','utf8');
 if(name!=='eliminar-cuenta')text=render(text,approved.seller,approved.termsDate);
 const body=text.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1];if(!body)throw Error('LEGAL_DOCUMENT_REQUIRED');
 const content=body.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<a\b[^>]*>([\s\S]*?)<\/a>/g,'<span>$1</span>');
 await writeFile('dist/'+name+'.html',`<!doctype html><html lang="es-CL"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'"><style>body{font:16px system-ui;line-height:1.6;margin:24px;color:#27233c}main{max-width:760px;margin:auto}a{color:#6044b4}</style><main><a href="competencia.html#perfil">← Volver a mi perfil</a>${content}</main></html>`);
}
for(const name of ['inicio.html','index.html','science.html','reading.html','m2.html','history.html','competencia.html','competition-app.js']){
 let text=await readFile('dist/'+name,'utf8');
 if(name==='competencia.html')text=text.replace("connect-src 'self' https://jmobinmdwrmdqrxtcruj.supabase.co;","connect-src 'self' https://jmobinmdwrmdqrxtcruj.supabase.co wss://jmobinmdwrmdqrxtcruj.supabase.co;");
 text=text.replace(/https:\/\/[^'"<> ]+\/(privacidad|condiciones|eliminar-cuenta)(?:\.html)?/g,(_,page)=>page+'.html');
 await writeFile('dist/'+name,text);
}
