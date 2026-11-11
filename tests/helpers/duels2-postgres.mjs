import{Client,Pool}from'pg';import{spawn}from'node:child_process';import{setTimeout as delay}from'node:timers/promises';import{readFile,readdir}from'node:fs/promises';import{competitionSeed}from'../../scripts/competition-catalog.mjs';import{users,sessions}from'./competition-db.mjs';
export{users,sessions};
export async function isolatedPostgres(){
 let postgres=null;if(process.env.DUELS2_POSTGRES_BIN){postgres=spawn(process.env.DUELS2_POSTGRES_BIN,['-D',process.env.DUELS2_POSTGRES_DATA,'-p','55432','-h','127.0.0.1','-k',''],{stdio:'ignore'});await delay(500);}
 const url=new URL(process.env.DUELS2_DATABASE_URL||'postgresql://postgres@127.0.0.1:55432/postgres');
 if(!['127.0.0.1','localhost','[::1]'].includes(url.hostname))throw Error('Duelos 2 tests require an isolated local Postgres');
 const admin=new Client({connectionString:url.href});await admin.connect();const name='duels2_test_'+Date.now()+'_'+Math.floor(Math.random()*100000);await admin.query('create database '+name+" encoding 'UTF8' template template0");url.pathname='/'+name;
 const pool=new Pool({connectionString:url.href,max:12});const db=await pool.connect();
 try{
  await db.query(`do $$begin if not exists(select 1 from pg_roles where rolname='anon')then create role anon;end if;if not exists(select 1 from pg_roles where rolname='authenticated')then create role authenticated;end if;if not exists(select 1 from pg_roles where rolname='service_role')then create role service_role;end if;end$$;
   create schema auth;create table auth.users(id uuid primary key,is_anonymous boolean default false,deleted_at timestamptz,raw_app_meta_data jsonb default '{}');
   create table auth.sessions(id uuid primary key,user_id uuid,not_after timestamptz,created_at timestamptz default now());
   create function auth.jwt()returns jsonb language sql stable as $$select nullif(current_setting('request.jwt.claims',true),'')::jsonb$$;
   create function auth.uid()returns uuid language sql stable as $$select (auth.jwt()->>'sub')::uuid$$;
   grant usage on schema auth to authenticated;grant execute on all functions in schema auth to authenticated;
   create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
   create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text references storage.buckets(id),name text,owner_id text,metadata jsonb,unique(bucket_id,name));alter table storage.objects enable row level security;grant usage on schema storage to authenticated;grant select,insert,update,delete on storage.objects to authenticated;
   create publication supabase_realtime;`);
  for(const dir of ['supabase/migrations/','web/supabase/migrations/'])for(const f of(await readdir(new URL('../../'+dir,import.meta.url))).filter(x=>x.endsWith('.sql')).sort())await db.query(await readFile(new URL('../../'+dir+f,import.meta.url),'utf8'));
  await db.query(competitionSeed());await db.query("update cachaste.settings set environment='test'");
  for(let i=0;i<users.length;i++){
   await db.query('insert into auth.users(id)values($1)',[users[i]]);await db.query('insert into auth.sessions(id,user_id)values($1,$2)',[sessions[i],users[i]]);
   await db.query("insert into cachaste.entitlements(user_id,valid_until,source,status,receipt_hash)values($1,now()+interval '1 day','test_harness','active',$2)",[users[i],'isolated-duels2-'+i]);
  }
 }catch(error){db.release();await pool.end();await admin.query('drop database '+name);await admin.end();throw error;}
 db.release();
 async function rpc(index,operation,payload={},api='cachaste_duels2'){
  if(!['cachaste_duels2','cachaste_competition'].includes(api))throw Error('Unknown test RPC');
  const connection=await pool.connect();try{await connection.query('begin');await connection.query("select set_config('request.jwt.claims',$1,true)",[JSON.stringify({sub:users[index],session_id:sessions[index],role:'authenticated'})]);await connection.query('set local role authenticated');const r=await connection.query('select public.'+api+'($1,$2::jsonb) result',[operation,JSON.stringify(payload)]);await connection.query('commit');return r.rows[0].result;}catch(e){await connection.query('rollback');throw e;}finally{connection.release();}
 }
 for(let i=0;i<3;i++)await rpc(i,'save_profile',{nickname:'TestAlumno'+i,communeCode:'05701',publicRanking:true,allowChallenges:true,showCommune:true,communityVersion:'2026-10-23'},'cachaste_competition');
 return{pool,rpc,url:url.href,close:async()=>{await pool.end();await admin.query('drop database '+name);await admin.end();if(postgres&&postgres.exitCode===null){const stopped=new Promise(resolve=>postgres.once('exit',resolve));postgres.kill('SIGTERM');await stopped;}}};
}
