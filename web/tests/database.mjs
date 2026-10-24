import{database as base,users,sessions,rpc,profile,grantTest}from'../../tests/helpers/competition-db.mjs';
import{readFile,readdir}from'node:fs/promises';
export{users,sessions,rpc,profile,grantTest};
export async function database(){const db=await base();for(const file of(await readdir(new URL('../supabase/migrations/',import.meta.url))).sort())if(file.endsWith('.sql'))await db.exec(await readFile(new URL('../supabase/migrations/'+file,import.meta.url),'utf8'));return db;}
export async function webRpc(db,index,operation,payload={}){await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({sub:users[index],session_id:sessions[index],role:'authenticated'})]);await db.exec('set role authenticated');try{return(await db.query('select public.cachaste_web_progress($1,$2::jsonb) result',[operation,JSON.stringify(payload)])).rows[0].result;}finally{await db.exec('reset role');}}
export async function billing(db,operation,payload={}){await db.exec('set role service_role');try{return(await db.query('select public.cachaste_web_billing_admin($1,$2::jsonb) result',[operation,JSON.stringify(payload)])).rows[0].result;}finally{await db.exec('reset role');}}
