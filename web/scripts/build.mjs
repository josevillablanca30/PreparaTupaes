import {ANDROID_UI_REFERENCE,ANDROID_UI_FILES,androidSource,androidArt} from '../shared/android-reference.mjs';
import {CONTENT_BASE} from '../shared/config.mjs';
import{readFile,writeFile,mkdir,readdir,cp,rm,stat}from'node:fs/promises';
import{createHash,randomBytes,createCipheriv}from'node:crypto';
import{execFileSync}from'node:child_process';
import{build}from'esbuild';
import{adaptCompetitionUi}from'../shared/competition-ui.mjs';
import{adaptCompetitionClient}from'../shared/competition-client.mjs';
import{adaptLegacyActions}from'../shared/legacy-actions.mjs';
import path from'node:path';
import{fileURLToPath}from'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url)),out=path.join(root,'web/dist');
process.chdir(root);execFileSync(process.execPath,['web/scripts/verify-android.mjs'],{stdio:'inherit'});
await import('../../scripts/build.mjs');
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});await cp(path.join(root,'dist'),path.join(out,'app'),{recursive:true});
// Reference renders use the exact same immutable Android files as the web build.
const reference=path.join(root,'web/artifacts/android-reference');
await rm(reference,{recursive:true,force:true});await cp(path.join(root,'dist'),reference,{recursive:true});
for(const file of [...ANDROID_UI_FILES.filter(f=>!f.endsWith('.mjs')),...androidArt()]){
 const bytes=androidSource(file);for(const dir of [path.join(out,'app'),reference]){await mkdir(path.dirname(path.join(dir,file)),{recursive:true});await writeFile(path.join(dir,file),bytes);}
}
const currentClient=androidSource('competition-client.mjs').toString();
// Keep the reviewed accessibility fixes merged into this branch in both renders.
for(const file of ['daily-ui.css','study-ui.css'])for(const dir of [path.join(out,'app'),reference])await cp(path.join(root,file),path.join(dir,file));
await build({stdin:{contents:currentClient,resolveDir:root,sourcefile:'android-reference-client.mjs'},outfile:path.join(reference,'competition-client.js'),bundle:true,minify:true,target:['safari15','chrome100'],format:'iife',legalComments:'eof'});
await cp(path.join(root,'web/public'),out,{recursive:true});await cp(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
for(const file of androidArt())await writeFile(path.join(out,file),androidSource(file));
// The landing callback renders the same recovery document, never a second copy
// of its UI and never a navigation that forwards the incoming credentials.
const recoveryDocument=await readFile(path.join(out,'recuperar.html'),'utf8'),recoveryBody=recoveryDocument.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1];
if(!recoveryBody)throw Error('RECOVERY_DOCUMENT_REQUIRED');
const landingPath=path.join(out,'index.html');
let landing=await readFile(landingPath,'utf8');
landing=landing.replace('<script src="/landing.js" defer></script>','').replace('<meta charset="utf-8">','<meta charset="utf-8"><meta name="referrer" content="no-referrer"><script src="/landing.js"></script>').replace('</head>','<link rel="stylesheet" href="/recovery.css"></head>').replace('</body>','<template id="recovery-page-template">'+recoveryBody+'</template></body>');
await writeFile(landingPath,landing);
for(const file of await readdir(path.join(out,'icons')))if(file.endsWith('.base64')){await writeFile(path.join(out,'icons',file.slice(0,-7)),Buffer.from(await readFile(path.join(out,'icons',file),'utf8'),'base64'));await rm(path.join(out,'icons',file));}
const revision=process.env.GITHUB_SHA||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const pages=['index.html','inicio.html','science.html','reading.html','m2.html','history.html','competencia.html'];const pagePolicies={};
for(const name of pages){
 const file=path.join(out,'app',name);let text=await readFile(file,'utf8');
 if(name==='index.html')text=adaptLegacyActions(text);
 if(name==='competencia.html')text=text.replaceAll('https://work-cachaste-web-comercial.cachaste-sitecacho.pages.dev/','/');
 if(name==='competencia.html'){
  const connect="connect-src 'self' https://jmobinmdwrmdqrxtcruj.supabase.co;";
  if(!text.includes(connect))throw Error('REVIEW_DUELS2_REALTIME_CSP');
  text=text.replace(connect,"connect-src 'self' https://jmobinmdwrmdqrxtcruj.supabase.co wss://jmobinmdwrmdqrxtcruj.supabase.co;");
 }
 text=text.replace('</head>','<link rel="manifest" href="/manifest.webmanifest"><link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"><link rel="stylesheet" href="/web-shell.css"><!--CACHASTE_WEB_BOOTSTRAP--><script src="/web-init.js"></script><script src="/web-legacy.js" defer></script></head>');
 if(name==='competencia.html')text=text.replace('<script src="competition-app.js"></script>','<script src="/web-competition.js"></script><script src="competition-app.js"></script>');
 text=text.replace('</body>','<script src="/web-shell.js" defer></script></body>');
 pagePolicies['/app/'+name]=[...text.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].filter(x=>x[1].trim()).map(x=>"'sha256-"+createHash('sha256').update(x[1]).digest('base64')+"'");
 await writeFile(file,text);
}
// Web competition uses the existing server dispatcher. Google Play is not invoked on the web.
await writeFile(path.join(out,'app/competition-config.js'),`window.CACHASTE_COMPETITION_CONFIG=Object.freeze({supabaseUrl:'https://jmobinmdwrmdqrxtcruj.supabase.co',publishableKey:'sb_publishable_wf2Ji381IwRo2exQKJQ7ew_SRYCl_q1',billingReady:false,authReturnUrl:location.origin+'/recuperar'});\n`);
await rm(path.join(out,'app/suscripcion.html'));
for(const name of['science-app.js','reading-app.js']){const file=path.join(out,'app',name);await writeFile(file,adaptLegacyActions(await readFile(file,'utf8')));}
await writeFile(path.join(out,'app/competition-app.js'),adaptCompetitionUi(androidSource('competition-app.js').toString()));
await build({stdin:{contents:adaptCompetitionClient(currentClient),resolveDir:root,sourcefile:'web-competition-client.mjs'},outfile:path.join(out,'app/competition-client.js'),bundle:true,minify:true,target:['safari15','chrome100'],format:'iife',legalComments:'eof'});
for(const[entry,file]of[['legacy-actions.mjs','web-legacy.js'],['competition-platform.mjs','web-competition.js'],['account.mjs','account.js'],['recovery.mjs','recovery.js'],['landing.mjs','landing.js'],['progress-runtime.mjs','web-init.js'],['shell.mjs','web-shell.js']])await build({entryPoints:[path.join(root,'web/client',entry)],outfile:path.join(out,file),bundle:true,minify:true,target:['safari15','chrome100'],format:'iife',legalComments:'eof'});
const protectedFiles=[];async function walk(dir,rel=''){for(const name of await readdir(dir)){const p=path.join(dir,name),r=rel+'/'+name;if((await stat(p)).isDirectory())await walk(p,r);else protectedFiles.push('/app'+r);}}await walk(path.join(out,'app'));
// Account administration must remain accessible after a subscription expires.
const accountFiles=protectedFiles.filter(p=>['/app/competencia.html','/app/competition-client.js','/app/competition-config.js','/app/competition-app.js','/app/competition-ui.css','/app/daily-visuals.js','/app/competition-geography.json'].includes(p)||p.startsWith('/app/assets/competition-')||p==='/app/assets/gatito-sabio-poses-v2.webp');
// No clear educational bank is ever placed in public Pages storage, including quota fallback.
let contentKey=process.env.BANK_CONTENT_KEY;
if(!contentKey){if(process.env.CF_PAGES)throw Error('Configure BANK_CONTENT_KEY as a build AND runtime secret before deploying');contentKey=randomBytes(32).toString('base64');await writeFile(path.join(root,'web/.local-bindings.json'),JSON.stringify({BANK_CONTENT_KEY:contentKey}),{mode:0o600});}
if(Buffer.from(contentKey,'base64').length!==32)throw Error('BANK_CONTENT_KEY must contain exactly 32 random bytes encoded as base64');
const encryptedFiles={};await mkdir(path.join(out,'__encrypted'),{recursive:true});
for(const name of protectedFiles){const plain=await readFile(path.join(out,name)),nonce=randomBytes(12),cipher=createCipheriv('aes-256-gcm',Buffer.from(contentKey,'base64'),nonce);cipher.setAAD(Buffer.from(name));const sealed=Buffer.concat([nonce,cipher.update(plain),cipher.final(),cipher.getAuthTag()]),asset='/__encrypted/'+createHash('sha256').update(name).digest('hex')+'.bin';encryptedFiles[name]=asset;await writeFile(path.join(out,asset),sealed);}
const workerEntry=`import{createGateway}from'./server/gateway.mjs';export default createGateway(${JSON.stringify({revision,pagePolicies,protectedFiles,accountFiles,encryptedFiles})});`;
await build({stdin:{contents:workerEntry,resolveDir:path.join(root,'web'),sourcefile:'worker-entry.mjs'},outfile:path.join(out,'_worker.js'),bundle:true,minify:true,format:'esm',platform:'browser',target:'es2022',legalComments:'eof'});
await writeFile(path.join(out,'_routes.json'),JSON.stringify({version:1,include:['/*'],exclude:[]}));
await writeFile(path.join(out,'version.json'),JSON.stringify({revision,androidBase:'add8a5979d28cb1f7598767bb4bf1ad7b8328937',androidUiReference:ANDROID_UI_REFERENCE,contentBase:CONTENT_BASE,distribution:'web-commercial',paymentsEnabledByBuild:false})+'\n');
await writeFile(path.join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
await writeFile(path.join(out,'_headers'),'/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n  X-Frame-Options: DENY\n/recuperar*\n  Cache-Control: private, no-store\n  X-Robots-Tag: noindex, nofollow, noarchive\n');
await mkdir(path.join(root,'web/artifacts'),{recursive:true});await writeFile(path.join(root,'web/artifacts/build-manifest.json'),JSON.stringify({revision,pagePolicies,protectedFiles,accountFiles,encryptedFiles},null,2)+'\n');
for(const required of['/app/daily-catalog.js','/app/index.html','/app/science-bank.js','/app/reading-bank.js','/app/m2-bank.js','/app/history-bank.js'])if(!protectedFiles.includes(required))throw Error('Missing protected subject: '+required);
for(const file of ['daily-core.js','daily-app.js','daily-lessons.js','learning-core.js','competition-app.js','competition-ui.css'])if(!Buffer.from(await readFile(path.join(out,'app',file))).equals(Buffer.from(file==='competition-app.js'?adaptCompetitionUi(androidSource(file).toString()):ANDROID_UI_FILES.includes(file)?androidSource(file):await readFile(path.join(root,file)))))throw Error('Educational source changed during web packaging: '+file);
await rm(path.join(out,'app'),{recursive:true});
console.log('Complete five-subject web distribution built; '+protectedFiles.length+' private files guarded by Pages worker; Android unchanged.');
