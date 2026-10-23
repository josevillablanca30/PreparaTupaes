import {PGlite} from '@electric-sql/pglite';
import {readFileSync,readdirSync} from 'node:fs';
import {competitionSeed} from '../../scripts/competition-catalog.mjs';
export const users=['10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000003'];
export const sessions=['20000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000003'];
export async function database(){
 const db=new PGlite();
 await db.exec(`create role anon;create role authenticated;create role service_role;create schema auth;
 create table auth.users(id uuid primary key,is_anonymous boolean default false,deleted_at timestamptz);
 create table auth.sessions(id uuid primary key,user_id uuid,not_after timestamptz);
 create function auth.jwt()returns jsonb language sql stable as $$select nullif(current_setting('request.jwt.claims',true),'')::jsonb$$;
 create function auth.uid()returns uuid language sql stable as $$select (auth.jwt()->>'sub')::uuid$$;
 grant usage on schema auth to authenticated;grant execute on all functions in schema auth to authenticated;`);
 for(const f of readdirSync(new URL('../../supabase/migrations/',import.meta.url)).filter(x=>x.endsWith('.sql')).sort())await db.exec(readFileSync(new URL('../../supabase/migrations/'+f,import.meta.url),'utf8'));
 await db.exec(competitionSeed());
 for(let i=0;i<users.length;i++){
  await db.query('insert into auth.users(id)values($1)',[users[i]]);
  await db.query('insert into auth.sessions values($1,$2,null)',[sessions[i],users[i]]);
 }
 return db;
}
export async function rpc(db,index,operation,payload={}){
 await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({sub:users[index],session_id:sessions[index],role:'authenticated'})]);
 await db.exec('set role authenticated');
 try{return(await db.query('select public.cachaste_competition($1,$2::jsonb) result',[operation,JSON.stringify(payload)])).rows[0].result;}
 finally{await db.exec('reset role');}
}
export async function profile(db,index,overrides={}){return rpc(db,index,'save_profile',{nickname:'TestAlumno'+index,communeCode:index===2?'13101':'05701',publicRanking:true,allowChallenges:true,showCommune:true,...overrides});}
export async function grantTest(db,index){await db.query("insert into cachaste.entitlements(user_id,valid_until,source,status,receipt_hash)values($1,now()+interval '1 day','test_harness','active',$2)on conflict(user_id)do update set status='active'",[users[index],'test-receipt-'+index]);}
