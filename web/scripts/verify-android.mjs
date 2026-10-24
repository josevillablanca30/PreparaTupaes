import {execFileSync} from 'node:child_process';
import {ANDROID_BASE} from '../shared/config.mjs';
const changed=execFileSync('git',['diff','--name-only',ANDROID_BASE,'--','android/','daily-*.js','daily-*.css','learning-core.js','editorial-revisions.js','m1-teaching.js','study-app.js','study-ui.css','index.html','inicio.html','science*','reading*','m2*','history*','competition-*','competencia.html','suscripcion.html','scripts/build.mjs','package.json','package-lock.json','.github/workflows/android-apk.yml','.github/workflows/pages.yml'],{encoding:'utf8'}).trim();
if(changed)throw Error('Android baseline changed:\n'+changed);
console.log('Android source, educational banks, competition UI, billing configuration and build remain byte-for-byte unchanged from '+ANDROID_BASE);
