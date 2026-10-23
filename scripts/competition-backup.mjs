import{randomBytes,scryptSync,createCipheriv,createDecipheriv,createHash}from'node:crypto';
import{readFile,writeFile,mkdir,rm}from'node:fs/promises';
import{spawn}from'node:child_process';
import{resolve,dirname}from'node:path';
import{pathToFileURL}from'node:url';
import pg from'pg';
const magic=Buffer.from('CACHASTE-BACKUP-1\n');
export function encryptBackup(plain,password){if(password.length<32)throw new Error('Use a backup secret of at least 32 characters');const salt=randomBytes(16),iv=randomBytes(12),key=scryptSync(password,salt,32),cipher=createCipheriv('aes-256-gcm',key,iv),data=Buffer.concat([cipher.update(plain),cipher.final()]);return Buffer.concat([magic,salt,iv,cipher.getAuthTag(),data]);}
export function decryptBackup(bytes,password){if(!bytes.subarray(0,magic.length).equals(magic))throw new Error('Invalid backup format');let n=magic.length;const salt=bytes.subarray(n,n+=16),iv=bytes.subarray(n,n+=12),tag=bytes.subarray(n,n+=16),decipher=createDecipheriv('aes-256-gcm',scryptSync(password,salt,32),iv);decipher.setAuthTag(tag);return Buffer.concat([decipher.update(bytes.subarray(n)),decipher.final()]);}
const snapshotMagic=Buffer.from('CACHASTE-PG-2\n');
export function packSnapshot(application,authData,metadata={}){
 const parts=[Buffer.from(JSON.stringify(metadata)),application,authData],out=[snapshotMagic];
 for(const part of parts){const length=Buffer.alloc(4);length.writeUInt32BE(part.length);out.push(length,part);}return Buffer.concat(out);
}
export function unpackSnapshot(bytes){
 if(!bytes.subarray(0,snapshotMagic.length).equals(snapshotMagic))throw Error('Legacy or invalid snapshot: use a reviewed manual restore');
 let n=snapshotMagic.length;const parts=[];
 for(let i=0;i<3;i++){if(n+4>bytes.length)throw Error('Incomplete snapshot');const length=bytes.readUInt32BE(n);n+=4;if(length>512*1024*1024||n+length>bytes.length)throw Error('Incomplete snapshot');parts.push(bytes.subarray(n,n+=length));}
 if(n!==bytes.length||!parts[1].subarray(0,5).equals(Buffer.from('PGDMP'))||!parts[2].subarray(0,5).equals(Buffer.from('PGDMP')))throw Error('Invalid PostgreSQL snapshot');
 return{metadata:JSON.parse(parts[0]),application:parts[1],authData:parts[2]};
}
async function main(){
 const secret=process.env.CACHASTE_BACKUP_SECRET||'',args=process.argv.slice(2);if(secret.length<32)throw new Error('CACHASTE_BACKUP_SECRET must contain at least 32 characters; never put it in app code');
 if(args[0]==='--verify'||args[0]==='--decrypt'){
  const plain=decryptBackup(await readFile(args[1]),secret);
  if(args[0]==='--decrypt')process.stdout.write(plain);else{const snapshot=unpackSnapshot(plain);console.log(JSON.stringify({verified:true,bytes:plain.length,sha256:createHash('sha256').update(plain).digest('hex'),format:2,applicationBytes:snapshot.application.length,authDataBytes:snapshot.authData.length}));}return;
 }
 const url=new URL(process.env.CACHASTE_DATABASE_URL||'');if(!['postgres:','postgresql:'].includes(url.protocol))throw new Error('Provide a private operator database URL');
 const destination=resolve(args[0]||'.cachaste-backups/cachaste-'+new Date().toISOString().replaceAll(':','-')+'.dump.enc');
 if(/\/(dist|assets)\//.test(destination))throw new Error('Backups must never be stored in public app assets');
 const local=['localhost','127.0.0.1'].includes(url.hostname);
 const env={...process.env,PGHOST:url.hostname,PGPORT:url.port||'5432',PGDATABASE:decodeURIComponent(url.pathname.slice(1)),PGUSER:decodeURIComponent(url.username),PGPASSWORD:decodeURIComponent(url.password),PGSSLMODE:local?'disable':'verify-full'};
 const ssl=local?false:{rejectUnauthorized:true,...(env.PGSSLROOTCERT?{ca:await readFile(env.PGSSLROOTCERT,'utf8')}:{})};
 const control=new pg.Client({host:env.PGHOST,port:Number(env.PGPORT),database:env.PGDATABASE,user:env.PGUSER,password:env.PGPASSWORD,ssl});
 let bytes=0,snapshot;
 const dump=(extra,snapshotId)=>new Promise((yes,no)=>{
  // Keep application ACLs; never dump managed Auth/Storage definitions or global roles.
  const child=spawn('pg_dump',['--format=custom','--no-owner','--snapshot='+snapshotId,...extra],{env,stdio:['ignore','pipe','pipe']}),chunks=[];
  child.stdout.on('data',b=>{bytes+=b.length;if(bytes>512*1024*1024)child.kill();else chunks.push(b);});child.stderr.resume();
  child.on('error',()=>no(new Error('pg_dump is required; use PostgreSQL 17 or newer')));child.on('close',code=>code===0?yes(Buffer.concat(chunks)):no(new Error('Backup failed; check private credentials, database privileges, PostgreSQL version and TLS certificate')));
 });
 try{
  await control.connect();await control.query('begin isolation level repeatable read read only');
  const id=(await control.query('select pg_export_snapshot() id')).rows[0].id;
  const application=await dump(['--schema=cachaste','--schema=public','--schema=supabase_migrations'],id);
  const transient=['sessions','refresh_tokens','flow_state','one_time_tokens','mfa_challenges','oauth_authorizations','schema_migrations','instances'];
  const authData=await dump(['--data-only','--schema=auth',...transient.map(t=>'--exclude-table-data=auth.'+t)],id);
  const version=(await control.query("select current_setting('server_version') version")).rows[0].version;
  snapshot=packSnapshot(application,authData,{format:2,createdAt:new Date().toISOString(),postgres:version,schemas:['cachaste','public','supabase_migrations'],auth:'data-only; initialized compatible Supabase Auth required',transientAuthTablesExcluded:transient});
 }finally{try{await control.query('rollback');}catch{}await control.end();}
 const encrypted=encryptBackup(snapshot,secret);await mkdir(dirname(destination),{recursive:true});await writeFile(destination,encrypted,{flag:'wx',mode:0o600});
 try{decryptBackup(await readFile(destination),secret);}catch(e){await rm(destination);throw e;}
 console.log(JSON.stringify({saved:destination,encrypted:true,bytes:encrypted.length,format:2}));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error(e.message);process.exitCode=1;});
