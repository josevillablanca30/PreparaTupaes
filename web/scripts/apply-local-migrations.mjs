import{readFile,readdir}from'node:fs/promises';import pg from'pg';
const status=JSON.parse(await readFile(process.argv[2],'utf8'));
if(!['127.0.0.1','localhost'].includes(new URL(status.DB_URL).hostname))throw Error('This test utility refuses hosted databases');
const db=new pg.Client({connectionString:status.DB_URL});await db.connect();try{for(const file of(await readdir(new URL('../supabase/migrations/',import.meta.url))).sort())if(file.endsWith('.sql'))await db.query(await readFile(new URL('../supabase/migrations/'+file,import.meta.url),'utf8'));await db.query("notify pgrst,'reload schema'");console.log('Additive web migration applied to disposable local database only');}finally{await db.end();}
