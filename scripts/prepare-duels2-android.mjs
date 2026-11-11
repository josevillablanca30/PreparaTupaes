// Creates a native integration candidate from the latest inspected Android commit.
// Does not checkout, commit, publish or modify either reference branch.
import{execFileSync}from'node:child_process';import{mkdir,readFile,writeFile,rm}from'node:fs/promises';import{fileURLToPath}from'node:url';import path from'node:path';
import{adaptDuels2Ui}from'../duels2/ui-transform.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export const ANDROID_DUELS2_BASE='7589d7aba376f39a3876bf1f484b014af1ed6af1';
export async function prepareAndroid(out){
 const target=path.resolve(out);if(!target.includes('/dist/')||target===root)throw Error('Use a regenerable directory below dist/');
 await mkdir(target,{recursive:true});const archive=execFileSync('git',['archive',ANDROID_DUELS2_BASE],{cwd:root,maxBuffer:100*1024*1024});execFileSync('tar',['-x','-C',target],{input:archive,maxBuffer:1024*1024});
 await writeFile(path.join(target,'competition-app.js'),adaptDuels2Ui(await readFile(path.join(target,'competition-app.js'),'utf8')));
 // The native document also needs the authenticated Realtime WSS origin.
 const html=path.join(target,'competencia.html');await writeFile(html,(await readFile(html,'utf8')).replace("connect-src 'self' https://jmobinmdwrmdqrxtcruj.supabase.co;","connect-src 'self' https://jmobinmdwrmdqrxtcruj.supabase.co wss://jmobinmdwrmdqrxtcruj.supabase.co;"));
 // Reuse installed, lockfile-pinned dependencies without installing/changing the candidate.
 const{symlink}=await import('node:fs/promises');await symlink(path.join(root,'node_modules'),path.join(target,'node_modules'),'dir').catch(e=>{if(e.code!=='EEXIST')throw e;});
 execFileSync(process.execPath,['scripts/build.mjs'],{cwd:target,stdio:'inherit'});
 const assets=path.join(target,'android/app/src/main/assets');await mkdir(assets,{recursive:true});const{cp}=await import('node:fs/promises');await cp(path.join(target,'dist'),assets,{recursive:true});
 await writeFile(path.join(target,'DUELS2-INTEGRATION.txt'),'Duelos 2.0 candidate. Android base '+ANDROID_DUELS2_BASE+'. API/migration must be integrated before release. No billing or subscription files changed.\n');
 return target;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){const target=await prepareAndroid(process.argv[2]||path.join(root,'dist/duels2-android'));console.log('Native candidate prepared: '+target);}
