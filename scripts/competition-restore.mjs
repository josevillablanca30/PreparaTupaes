// Operator-only restore. Requires an empty, initialized Supabase target, never the running application.
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {join} from 'node:path';
import {spawn} from 'node:child_process';import pg from 'pg';
import {decryptBackup,unpackSnapshot} from './competition-backup.mjs';
const secret=process.env.CACHASTE_BACKUP_SECRET||'';
if(secret.length<32||process.env.CACHASTE_RESTORE_CONFIRMATION!=='RESTORE_TO_EMPTY_ISOLATED_DATABASE')throw Error('Explicit isolated restore confirmation and backup secret are required');
const url=new URL(process.env.CACHASTE_RESTORE_DATABASE_URL||'');
if(!['postgres:','postgresql:'].includes(url.protocol))throw Error('Provide a private restore database URL');
const local=['127.0.0.1','localhost'].includes(url.hostname),env={...process.env,PGHOST:url.hostname,PGPORT:url.port||'5432',PGDATABASE:decodeURIComponent(url.pathname.slice(1)),PGUSER:decodeURIComponent(url.username),PGPASSWORD:decodeURIComponent(url.password),PGSSLMODE:local?'disable':'verify-full'};
const ssl=local?false:{rejectUnauthorized:true,...(env.PGSSLROOTCERT?{ca:await readFile(env.PGSSLROOTCERT,'utf8')}:{})};
const db=new pg.Client({host:env.PGHOST,port:Number(env.PGPORT),database:env.PGDATABASE,user:env.PGUSER,password:env.PGPASSWORD,ssl});
const snapshot=unpackSnapshot(decryptBackup(await readFile(process.argv[2]),secret)),temp=await mkdtemp(join(tmpdir(),'cachaste-restore-'));
const run=(args,bytes)=>new Promise((yes,no)=>{
 const child=spawn('pg_restore',args,{env,stdio:['pipe','pipe','pipe']}),out=[];let diagnostic='';child.stdout.on('data',b=>out.push(b));child.stderr.on('data',b=>{if(diagnostic.length<4000)diagnostic+=b;});child.stdin.on('error',()=>{});child.on('error',()=>no(Error('pg_restore 17 or newer is required')));child.on('close',n=>{
  const safe=local&&env.PGDATABASE.startsWith('cachaste_restore_')&&env.CACHASTE_RESTORE_DIAGNOSTICS==='isolated_test_only'?diagnostic.split('\n').filter(l=>l.includes('pg_restore: error:')).slice(0,2).join(' ').slice(0,500):'';
  n===0?yes(Buffer.concat(out).toString()):no(Error('Restore failed in the isolated target; keep the source untouched. '+safe));
 });child.stdin.end(bytes);
});
try{
 await db.connect();
 const ready=(await db.query("select exists(select 1 from pg_namespace where nspname='auth') as auth,exists(select 1 from pg_namespace where nspname='cachaste') as app,(select count(*)::int from pg_tables where schemaname='public') as public_tables")).rows[0];
 if(!ready.auth||ready.app||ready.public_tables!==0)throw Error('Target must be a fresh initialized Supabase project without application tables');
 if((await db.query('select count(*)::int n from auth.users')).rows[0].n!==0)throw Error('Refusing to restore over existing identities');
 const history=(await db.query("select to_regclass('supabase_migrations.schema_migrations') is not null as present")).rows[0].present;
 if(history&&(await db.query('select count(*)::int n from supabase_migrations.schema_migrations')).rows[0].n!==0)throw Error('Refusing to restore over an existing migration history');
 if(history)await db.query('drop schema supabase_migrations cascade');
 const toc=await run(['--list'],snapshot.application);
 // Fresh Supabase keeps its managed public-schema/default privileges. Every application object ACL remains in the restore.
 const managed=new Set(['supabase_admin','supabase_auth_admin','supabase_storage_admin','supabase_functions_admin','supabase_realtime_admin','authenticator','pgbouncer']);
 const list=join(temp,'application.list');await writeFile(list,toc.split('\n').filter(line=>{
  if(!/^\d+;/.test(line))return true;
  if(/\bSCHEMA - public\b/.test(line))return false;
  const owner=line.trim().split(/\s+/).at(-1);
  return !managed.has(owner);
 }).join('\n'),{mode:0o600});
 await run(['--no-owner','--exit-on-error','--single-transaction','--data-only'],snapshot.authData);
 await run(['--no-owner','--exit-on-error','--single-transaction','--use-list='+list],snapshot.application);
 // Sessions and refresh/one-time tables are excluded. Clear legacy recovery/change tokens stored on users too.
 await db.query(`do $$declare c text;begin
 foreach c in array array['confirmation_token','recovery_token','email_change_token_new','email_change_token_current','reauthentication_token','phone_change_token','email_change','phone_change']loop
  if exists(select 1 from information_schema.columns where table_schema='auth'and table_name='users'and column_name=c)then execute format('update auth.users set %I=%L',c,'');end if;
 end loop;end$$;`);
 console.log(JSON.stringify({restored:true,isolatedTarget:true,applicationAclsPreserved:true,authDataRestored:true,previousSessionsInvalid:true,format:2}));
}finally{await db.end();await rm(temp,{recursive:true,force:true});}
