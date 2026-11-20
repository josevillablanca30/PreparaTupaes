// Isolated CI PostgreSQL ONLY: validates actual cross-connection advisory locks.
import {Client} from 'pg';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {originalCatalogSeed} from '../scripts/seed-original-learning.mjs';
import {dailyCatalog} from '../scripts/daily-catalog.mjs';
const url=new URL(process.env.CACHASTE_QA_POSTGRES_URL||'http://invalid');
if(!['127.0.0.1','localhost'].includes(url.hostname)||!url.pathname.endsWith('/cachaste_qa'))throw Error('ISOLATED_LOCAL_QA_DATABASE_REQUIRED');
const admin=new Client({connectionString:url.href});await admin.connect();
const user='10000000-0000-4000-8000-000000000001',session='20000000-0000-4000-8000-000000000001';
const clients=[];
try{
 await admin.query(`create role anon;create role authenticated;create role service_role;create schema auth;
 create table auth.users(id uuid primary key,is_anonymous boolean default false,deleted_at timestamptz,raw_app_meta_data jsonb default '{}',email text,email_confirmed_at timestamptz);
 create table auth.sessions(id uuid primary key,user_id uuid,not_after timestamptz,created_at timestamptz default now());
 create function auth.jwt() returns jsonb language sql stable as $$select nullif(current_setting('request.jwt.claims',true),'')::jsonb$$;
 create function auth.uid() returns uuid language sql stable as $$select (auth.jwt()->>'sub')::uuid$$;
 grant usage on schema auth to authenticated;grant execute on all functions in schema auth to authenticated;
 create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text references storage.buckets(id),name text,owner_id text,metadata jsonb,unique(bucket_id,name));alter table storage.objects enable row level security;
 grant usage on schema storage to authenticated;grant select,insert,update,delete on storage.objects to authenticated;`);
 for(const dir of ['supabase/migrations','web/supabase/migrations'])for(const file of readdirSync(dir).filter(x=>x.endsWith('.sql')).sort())await admin.query(readFileSync(dir+'/'+file,'utf8'));
 await admin.query(originalCatalogSeed());await admin.query('insert into auth.users(id) values($1)',[user]);await admin.query('insert into auth.sessions(id,user_id) values($1,$2)',[session,user]);await admin.query('update cachaste_web.basic_feature_flags set original_learning_enabled=true');
 const items=dailyCatalog().items.filter(q=>q.subjectKey==='M1');const first=items[0],second=items.find(q=>q.concept===first.concept&&q.family!==first.family);
 for(let i=0;i<4;i++){const c=new Client({connectionString:url.href});await c.connect();await c.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({sub:user,session_id:session,role:'authenticated'})]);await c.query('set role authenticated');clients.push(c);}
 const rpc=(c,op,p)=>c.query('select public.cachaste_original_learning($1,$2::jsonb) result',[op,JSON.stringify(p)]).then(r=>r.rows[0].result);
 for(let stage=0;stage<3;stage++){
  const starts=await Promise.all(clients.map(c=>rpc(c,'start',{requestKey:crypto.randomUUID(),mode:'lesson',subject:'M1',track:null,concept:first.concept,keys:[first.key,second.key]})));
  assert.equal(new Set(starts.map(s=>s.activity.id)).size,1,'simultaneous devices recover one active stage');const id=starts[0].activity.id;
  for(const [pos,q] of [first,second].entries())await Promise.all(clients.map(c=>rpc(c,'answer',{attemptId:id,position:pos,selectedIndex:q.answer})));
  const completions=await Promise.all(clients.map(c=>rpc(c,'complete',{attemptId:id})));assert.ok(completions.every(c=>c.correct===2));
 }
 const denials=await Promise.allSettled(clients.map(c=>rpc(c,'start',{requestKey:crypto.randomUUID(),mode:'lesson',subject:'M1',track:null,concept:first.concept,keys:[first.key,second.key]})));
 assert.ok(denials.every(d=>d.status==='rejected'&&/BASIC_QUOTA_EXHAUSTED/.test(d.reason.message)));
 assert.equal((await admin.query('select count(*)::int n from cachaste_web.basic_usage')).rows[0].n,3);
 assert.equal((await admin.query("select to_char('2026-11-20 02:30:00+00'::timestamptz at time zone 'America/Santiago','YYYY-MM-DD') as chile_day")).rows[0].chile_day,'2026-11-19');
 console.log('PostgreSQL: 4 concurrent authenticated devices, exactly 3 stages, 1 charge per completion, Chile daily boundary: PASS');
}finally{for(const c of clients)await c.end();await admin.end();}
