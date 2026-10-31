// Inspect tracked source only. Print paths, never matched credential values.
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const paths=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean),bad=[];
for(const path of paths){
 if(/(?:\.jks|\.keystore|\.p12|\.pfx|(?:^|\/)signing\.json|(?:^|\/)\.env(?:\.|$))$/i.test(path)&&!path.endsWith('.example')){bad.push(path);continue;}
 const text=readFileSync(path).toString('utf8');
 if(/-----BEGIN (?:RSA |EC |OPENSSH |ENCRYPTED )?PRIVATE KEY-----\r?\n[A-Za-z0-9+/=]{32,}/.test(text)||/\b(?:sb_secret_[A-Za-z0-9_-]{15,}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/.test(text))bad.push(path);
 for(const token of text.match(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g)||[]){try{if(JSON.parse(Buffer.from(token.split('.')[1],'base64url')).role==='service_role')bad.push(path);}catch{}}
}
if(bad.length){console.error('Potential private credential in tracked files:',[...new Set(bad)].join(', '));process.exit(1);}
console.log('Tracked source: no private signing files, private-key blocks, secret provider keys or service-role JWTs detected.');
