import assert from'node:assert/strict';import{randomUUID}from'node:crypto';import{isolatedPostgres,users}from'../tests/helpers/duels2-postgres.mjs';
const db=await isolatedPostgres();
try{
 const queue={subject:'M1',requestId:randomUUID()},first=await db.rpc(0,'random',queue);assert.equal(first.waiting,true);
 const pair=await Promise.all([db.rpc(1,'random',{subject:'M1',requestId:randomUUID()}),db.rpc(0,'random',queue)]);
 const d=pair.find(x=>x.id);assert.equal(d.opponentKind,'human');const p=(await db.pool.query('select id from cachaste_duels2.players where match_id=$1 order by user_id',[d.id])).rows;
 assert.equal((await db.pool.query('select count(*)::int n from cachaste_duels2.matches')).rows[0].n,1);
 const a=await Promise.all(p.map((row,i)=>db.rpc(i,'start',{attemptId:row.id})));
 for(let pos=0;pos<10;pos++){
  const payloads=await Promise.all(a.map(async(row,i)=>{const answer=(await db.pool.query('select answer from cachaste.questions where key=$1',[row.question.key])).rows[0].answer;return{attemptId:row.id,position:pos,choice:i===0?answer:(answer+1)%row.question.options.length,requestId:randomUUID()};}));
  // Four independent TCP connections: both answers AND retries arrive together.
  const results=await Promise.all([db.rpc(0,'answer',payloads[0]),db.rpc(1,'answer',payloads[1]),db.rpc(0,'answer',payloads[0]),db.rpc(1,'answer',payloads[1])]);a[0]=results[0];a[1]=results[1];
 }
 const end=await db.rpc(0,'duel',{duelId:d.id});assert.equal(end.result.winner,users[0]);assert.equal(end.result.changes[users[0]],3);assert.equal(end.balance,d.creator.id===users[0]?20:-20);
 assert.equal((await db.pool.query('select count(*)::int n from cachaste_duels2.answers')).rows[0].n,20);assert.equal((await db.pool.query('select count(*)::int n from cachaste_duels2.star_ledger')).rows[0].n,4);
 const [r1,r2]=await Promise.all([db.rpc(0,'rematch',{duelId:d.id,requestId:randomUUID()}),db.rpc(1,'rematch',{duelId:d.id,requestId:randomUUID()})]);assert.equal(r1.id,r2.id);
 const acceptor=r1.opponent.id===users[0]?0:1;await Promise.all([db.rpc(acceptor,'accept',{duelId:r1.id}),db.rpc(acceptor,'accept',{duelId:r1.id})]);assert.equal((await db.pool.query('select count(*)::int n from cachaste_duels2.players where match_id=$1',[r1.id])).rows[0].n,2);
 const publication=(await db.pool.query("select schemaname,tablename from pg_publication_tables where pubname='supabase_realtime'")).rows;assert.deepEqual(publication,[{schemaname:'public',tablename:'cachaste_duels2_live'}]);
 console.log('PASS: PostgreSQL '+(await db.pool.query('show server_version')).rows[0].server_version+'; parallel matching, 40 concurrent answer/retry RPCs, one settlement, simultaneous rematch/accept, aggregate-only publication.');
}finally{await db.close();}
