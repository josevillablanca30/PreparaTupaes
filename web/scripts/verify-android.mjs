import {execFileSync} from 'node:child_process';
import {ANDROID_BASE,CONTENT_BASE} from '../shared/config.mjs';
const approvedStyles=['daily-ui.css','study-ui.css'],styleRevision='13ad032704290e34ded824dc8deb82756f83e102';
const changed=execFileSync('git',['diff','--name-only',ANDROID_BASE,'--','android/','daily-*.js',':(exclude)daily-visuals.js','daily-*.css','learning-core.js','editorial-revisions.js','m1-teaching.js','study-app.js','study-ui.css','index.html','inicio.html','science*','reading*','m2*','history*','competition-*','competencia.html','suscripcion.html','scripts/build.mjs','package.json','package-lock.json','.github/workflows/android-apk.yml','.github/workflows/pages.yml'],{encoding:'utf8'}).trim().split('\n').filter(name=>name&&!approvedStyles.includes(name)).join('\n');
if(changed)throw Error('Android baseline changed:\n'+changed);
const styleChanges=execFileSync('git',['diff','--name-only',styleRevision,'--',...approvedStyles],{encoding:'utf8'}).trim();
if(styleChanges)throw Error('Approved legibility styles changed:\n'+styleChanges);
console.log('Android baseline protected at '+ANDROID_BASE+'; approved legibility styles match '+styleRevision);

const reviewed=['daily-visuals.js','scripts/paes-transfer-2027.mjs','scripts/transfer-context-review-20261104.mjs','pedagogy/content-before-20261104.json'];
const changedContent=execFileSync('git',['diff','--name-only',CONTENT_BASE,'--',...reviewed],{encoding:'utf8'}).trim();
if(changedContent)throw Error('Reviewed Android content changed:\n'+changedContent);
console.log('Question-context correction matches Android '+CONTENT_BASE);
