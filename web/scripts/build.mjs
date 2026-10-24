import{readFile,writeFile,mkdir,readdir,cp,rm,stat}from'node:fs/promises';
import{createHash}from'node:crypto';
import{execFileSync}from'node:child_process';
import{build}from'esbuild';
import path from'node:path';
import{fileURLToPath}from'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url)),out=path.join(root,'web/dist');
process.chdir(root);execFileSync(process.execPath,['web/scripts/verify-android.mjs'],{stdio:'inherit'});
await import('../../scripts/build.mjs');
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});await cp(path.join(root,'dist'),path.join(out,'app'),{recursive:true});
await cp(path.join(root,'web/public'),out,{recursive:true});await cp(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
for(const file of await readdir(path.join(out,'icons')))if(file.endsWith('.base64')){await writeFile(path.join(out,'icons',file.slice(0,-7)),Buffer.from(await readFile(path.join(out,'icons',file),'utf8'),'base64'));await rm(path.join(out,'icons',file));}
const revision=process.env.GITHUB_SHA||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const pages=['index.html','inicio.html','science.html','reading.html','m2.html','history.html','competencia.html'];const pagePolicies={};
for(const name of pages){
 const file=path.join(out,'app',name);let text=await readFile(file,'utf8');
 text=text.replace('</head>','<link rel="manifest" href="/manifest.webmanifest"><link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"><link rel="stylesheet" href="/web-shell.css"><!--CACHASTE_WEB_BOOTSTRAP--><script src="/web-init.js"></script></head>');
 text=text.replace('</body>','<script src="/web-shell.js" defer></script></body>');
 pagePolicies['/app/'+name]=[...text.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].filter(x=>x[1].trim()).map(x=>"'sha256-"+createHash('sha256').update(x[1]).digest('base64')+"'");
 await writeFile(file,text);
}
// Web competition uses the existing server dispatcher. Google Play is not invoked on the web.
await writeFile(path.join(out,'app/competition-config.js'),`window.CACHASTE_COMPETITION_CONFIG=Object.freeze({supabaseUrl:'https://jmobinmdwrmdqrxtcruj.supabase.co',publishableKey:'sb_publishable_wf2Ji381IwRo2exQKJQ7ew_SRYCl_q1',billingReady:false,authReturnUrl:location.origin+'/cuenta.html?recovery=1'});\n`);
await rm(path.join(out,'app/suscripcion.html'));
for(const[entry,file]of[['account.mjs','account.js'],['landing.mjs','landing.js'],['progress-runtime.mjs','web-init.js'],['shell.mjs','web-shell.js']])await build({entryPoints:[path.join(root,'web/client',entry)],outfile:path.join(out,file),bundle:true,minify:true,target:['safari15','chrome100'],format:'iife',legalComments:'eof'});
const protectedFiles=[];async function walk(dir,rel=''){for(const name of await readdir(dir)){const p=path.join(dir,name),r=rel+'/'+name;if((await stat(p)).isDirectory())await walk(p,r);else protectedFiles.push('/app'+r);}}await walk(path.join(out,'app'));
// Account administration must remain accessible after a subscription expires.
const accountFiles=protectedFiles.filter(p=>['/app/competencia.html','/app/competition-client.js','/app/competition-config.js','/app/competition-app.js','/app/competition-ui.css','/app/daily-visuals.js','/app/chile-geography.json'].includes(p)||p.startsWith('/app/assets/competition-')||p==='/app/assets/gatito-sabio-poses-v2.webp');
const workerEntry=`import{createGateway}from'./server/gateway.mjs';export default createGateway(${JSON.stringify({revision,pagePolicies,protectedFiles,accountFiles})});`;
await build({stdin:{contents:workerEntry,resolveDir:path.join(root,'web'),sourcefile:'worker-entry.mjs'},outfile:path.join(out,'_worker.js'),bundle:true,minify:true,format:'esm',platform:'browser',target:'es2022',legalComments:'eof'});
await writeFile(path.join(out,'_routes.json'),JSON.stringify({version:1,include:['/*'],exclude:[]}));
await writeFile(path.join(out,'version.json'),JSON.stringify({revision,androidBase:'add8a5979d28cb1f7598767bb4bf1ad7b8328937',distribution:'web-commercial',paymentsEnabledByBuild:false})+'\n');
await writeFile(path.join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
await writeFile(path.join(out,'_headers'),'/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n');
await mkdir(path.join(root,'web/artifacts'),{recursive:true});await writeFile(path.join(root,'web/artifacts/build-manifest.json'),JSON.stringify({revision,pagePolicies,protectedFiles,accountFiles},null,2)+'\n');
for(const required of['/app/daily-catalog.js','/app/index.html','/app/science-bank.js','/app/reading-bank.js','/app/m2-bank.js','/app/history-bank.js'])if(!protectedFiles.includes(required))throw Error('Missing protected subject: '+required);
for(const file of ['daily-core.js','daily-app.js','daily-lessons.js','learning-core.js','competition-app.js','competition-ui.css'])if(!Buffer.from(await readFile(path.join(out,'app',file))).equals(Buffer.from(await readFile(path.join(root,file)))))throw Error('Educational source changed during web packaging: '+file);
console.log('Complete five-subject web distribution built; '+protectedFiles.length+' private files guarded by Pages worker; Android unchanged.');
