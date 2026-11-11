// Immutable source input: reuse the published Android UI without editing Android.
import {execFileSync} from 'node:child_process';
export const ANDROID_UI_REFERENCE='1d47211a8b2de496eff5b5191cf2789a78bbe39b';
export const ANDROID_UI_FILES=Object.freeze(['competencia.html','competition-app.js','competition-ui.css','competition-client.mjs','daily-app.js','daily-reference.css','daily-ui.css','study-ui.css','inicio.html','index.html','science.html','reading.html','m2.html','history.html']);
export function androidSource(name){
 if(!ANDROID_UI_FILES.includes(name)&&!/^assets\/competition-[A-Za-z0-9.-]+$/.test(name))throw Error('UNREVIEWED_ANDROID_UI_FILE');
 return execFileSync('git',['show',ANDROID_UI_REFERENCE+':'+name],{maxBuffer:5*1024*1024});
}
export function androidArt(){return execFileSync('git',['ls-tree','-r','--name-only',ANDROID_UI_REFERENCE,'--','assets/'],{encoding:'utf8'}).trim().split('\n').filter(name=>name.startsWith('assets/competition-'));}
