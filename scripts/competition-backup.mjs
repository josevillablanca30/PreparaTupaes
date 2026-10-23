import{randomBytes,scryptSync,createCipheriv,createDecipheriv,createHash}from'node:crypto';
import{readFile,writeFile,mkdir,rm}from'node:fs/promises';
import{spawn}from'node:child_process';
import{resolve,dirname}from'node:path';
import{pathToFileURL}from'node:url';
const magic=Buffer.from('CACHASTE-BACKUP-1\n');
export function encryptBackup(plain,password){if(password.length<32)throw new Error('Use a backup secret of at least 32 characters');const salt=randomBytes(16),iv=randomBytes(12),key=scryptSync(password,salt,32),cipher=createCipheriv('aes-256-gcm',key,iv),data=Buffer.concat([cipher.update(plain),cipher.final()]);return Buffer.concat([magic,salt,iv,cipher.getAuthTag(),data]);}
export function decryptBackup(bytes,password){if(!bytes.subarray(0,magic.length).equals(magic))throw new Error('Invalid backup format');let n=magic.length;const salt=bytes.subarray(n,n+=16),iv=bytes.subarray(n,n+=12),tag=bytes.subarray(n,n+=16),decipher=createDecipheriv('aes-256-gcm',scryptSync(password,salt,32),iv);decipher.setAuthTag(tag);return Buffer.concat([decipher.update(bytes.subarray(n)),decipher.final()]);}
async function main(){
 const secret=process.env.CACHASTE_BACKUP_SECRET||'',args=process.argv.slice(2);if(secret.length<32)throw new Error('CACHASTE_BACKUP_SECRET must contain at least 32 characters; never put it in app code');
 if(args[0]==='--verify'||args[0]==='--decrypt'){
  const plain=decryptBackup(await readFile(args[1]),secret);
  if(args[0]==='--decrypt')process.stdout.write(plain);else console.log(JSON.stringify({verified:true,bytes:plain.length,sha256:createHash('sha256').update(plain).digest('hex')}));return;
 }
 const url=new URL(process.env.CACHASTE_DATABASE_URL||'');if(!['postgres:','postgresql:'].includes(url.protocol))throw new Error('Provide a private operator database URL');
 const destination=resolve(args[0]||'.cachaste-backups/cachaste-'+new Date().toISOString().replaceAll(':','-')+'.dump.enc');
 if(/\/(dist|assets)\//.test(destination))throw new Error('Backups must never be stored in public app assets');
 const env={...process.env,PGHOST:url.hostname,PGPORT:url.port||'5432',PGDATABASE:decodeURIComponent(url.pathname.slice(1)),PGUSER:decodeURIComponent(url.username),PGPASSWORD:decodeURIComponent(url.password),PGSSLMODE:['localhost','127.0.0.1'].includes(url.hostname)?'disable':'verify-full'};
 // Keep ACLs: stripping them could re-enable PUBLIC execution on privileged functions at restore time.
 const child=spawn('pg_dump',['--format=custom','--no-owner','--exclude-table-data=auth.sessions','--exclude-table-data=auth.refresh_tokens'],{env,stdio:['ignore','pipe','pipe']});const chunks=[];let bytes=0;
 child.stdout.on('data',b=>{bytes+=b.length;if(bytes>512*1024*1024)child.kill();else chunks.push(b);});child.stderr.resume();
 await new Promise((yes,no)=>{child.on('error',()=>no(new Error('pg_dump is required; use PostgreSQL 17 or newer')));child.on('close',code=>code===0?yes():no(new Error('Backup failed; check private database credentials, PostgreSQL version and TLS certificate')));});
 const encrypted=encryptBackup(Buffer.concat(chunks),secret);await mkdir(dirname(destination),{recursive:true});await writeFile(destination,encrypted,{flag:'wx',mode:0o600});
 try{decryptBackup(await readFile(destination),secret);}catch(e){await rm(destination);throw e;}
 console.log(JSON.stringify({saved:destination,encrypted:true,bytes:encrypted.length}));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error(e.message);process.exitCode=1;});
