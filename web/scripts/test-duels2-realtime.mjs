import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {setTimeout as delay} from 'node:timers/promises';

const projection='cachaste_duels2_live';
const jobName='cachaste-duels2-maintenance';

async function call(client,operation,payload={},rpc='cachaste_duels2'){
  const {data,error}=await client.rpc(rpc,{operation,payload});
  if(error)throw Error(rpc+' '+operation+': '+error.message);
  return data;
}

function subscribe(channel){
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(Error('Duelos 2 Realtime subscription timeout')),15000);
    channel.subscribe(status=>{
      if(status==='SUBSCRIBED'){clearTimeout(timer);resolve();}
      if(['CHANNEL_ERROR','TIMED_OUT','CLOSED'].includes(status)){
        clearTimeout(timer);reject(Error('Duelos 2 Realtime '+status));
      }
    });
  });
}

async function until(predicate,timeout,label){
  const expires=Date.now()+timeout;
  while(Date.now()<expires){
    if(await predicate())return;
    await delay(300);
  }
  throw Error(label);
}

export async function testDuels2Realtime({db,clients,outsider,record}){
  assert.ok(['127.0.0.1','localhost'].includes(db.connectionParameters.host));
  const {rows:published}=await db.query("select tablename from pg_publication_tables where pubname='supabase_realtime' and tablename like '%duels2%' order by tablename");
  assert.deepEqual(published,[{tablename:projection}]);
  const nicknames=['QaDominioUno','QaDominioDos'];
  await Promise.all(clients.map((client,i)=>call(client,'save_profile',{
    nickname:nicknames[i],communeCode:i?'05109':'05701',publicRanking:true,
    allowChallenges:true,showCommune:true,avatar:i,communityVersion:'2026-10-23'
  },'cachaste_competition')));
  const invitation=await call(clients[0],'create_duel',{subject:'M1',nickname:nicknames[1],requestId:randomUUID()});
  const joined=await call(clients[1],'accept',{duelId:invitation.id});
  const left=await call(clients[0],'duel',{duelId:invitation.id});
  const a=await call(clients[0],'start',{attemptId:left.attemptId});
  const b=await call(clients[1],'start',{attemptId:joined.attemptId});
  const audience=[...clients,outsider],received=audience.map(()=>[]);
  const channels=[];
  try{
    for(const [i,client] of audience.entries()){
      const {data:{session}}=await client.auth.getSession();
      assert.ok(session?.access_token);
      await client.realtime.setAuth(session.access_token);
      const channel=client.channel('qa-duel-'+invitation.id+'-'+i).on('postgres_changes',{
        event:'UPDATE',schema:'public',table:projection,filter:'id=eq.'+invitation.id
      },event=>received[i].push(event.new));
      channels.push(channel);
    }
    await Promise.all(channels.map(subscribe));
    const snapshot=await outsider.from(projection).select('*').eq('id',invitation.id).maybeSingle();
    assert.ifError(snapshot.error);
    assert.equal(snapshot.data,null);
    const own=await clients[0].from(projection).select('*').eq('id',invitation.id).single();
    assert.ifError(own.error);
    assert.equal(own.data.balance,0);
    // A fresh Realtime tenant can join the channel before its WAL reader starts.
    await until(async()=>{
      const {rows:[state]}=await db.query("select count(*)::int as readers from pg_replication_slots where slot_type='logical'");
      return state.readers>0;
    },12000,'Realtime must open a logical replication slot');
    let answer;
    for(let position=0;position<3;position++){
      received[0].length=0;received[1].length=0;
      answer=await call(clients[0],'answer',{attemptId:a.id,position,choice:0,requestId:randomUUID()});
      if(position===0)assert.equal(Math.abs(answer.balance),1);
      for(let probe=0;probe<10&&!(received[0].length&&received[1].length);probe++)await delay(250);
      if(received[0].length&&received[1].length)break;
    }
    assert.ok(received[0].length&&received[1].length,'Both players must receive actual WebSocket updates');
    for(const events of received.slice(0,2)){
      const row=events.at(-1);
      assert.equal(row.id,invitation.id);
      assert.equal(row.balance,answer.balance);
      assert.deepEqual(Object.keys(row).sort(),['balance','creator','id','opponent','status']);
    }
    await delay(900);
    assert.deepEqual(received[2],[]);
    record('Two real Auth sessions receive the same sanitized WebSocket update and RLS excludes the third user');
  }finally{
    await Promise.all(audience.map((client,i)=>channels[i]?client.removeChannel(channels[i]):undefined));
  }

  // Exercise the actual SQL deadline logic without waiting two wall-clock minutes.
  // Rewind only the disposable database clock for this one active player.
  const {rows:[beforeClock]}=await db.query(
    'select position from cachaste_duels2.players where id=$1',[a.id]);
  await db.query(
    "update cachaste_duels2.players set question_started_at=clock_timestamp()-interval '119 seconds' where id=$1",[a.id]);
  const stillOpen=await call(clients[0],'attempt',{attemptId:a.id});
  assert.equal(stillOpen.position,beforeClock.position,'M1 must not expire before 120 seconds');
  await db.query(
    "update cachaste_duels2.players set question_started_at=clock_timestamp()-interval '121 seconds' where id=$1",[a.id]);
  const expired=await call(clients[0],'attempt',{attemptId:a.id});
  assert.equal(expired.position,beforeClock.position+1,'M1 must expire after 120 seconds');
  const {rows:[miss]}=await db.query(
    'select choice,correct from cachaste_duels2.answers where player_id=$1 and position=$2',
    [a.id,beforeClock.position]);
  assert.equal(miss.choice,null);
  assert.equal(miss.correct,false);
  record('Real PostgreSQL rejects premature M1 expiry and records the 120-second timeout as an incorrect answer');
  // A stale client must not be able to submit an answer for the expired question.
  const late=await call(clients[0],'answer',{
    attemptId:a.id,position:beforeClock.position,choice:0,requestId:randomUUID()
  });
  assert.equal(late.position,expired.position);
  const {rows:[unchanged]}=await db.query(
    'select count(*)::int as count from cachaste_duels2.answers where player_id=$1 and position=$2',
    [a.id,beforeClock.position]);
  assert.equal(unchanged.count,1,'Late submission must not duplicate or replace a timeout');
  record('Real PostgreSQL rejects a stale answer after timeout without overwriting the incorrect result');
  // The 90-second rule must also be enforced for non-math subjects.
  // Reuse the disposable match and restore M1 before the rest of the QA.
  await db.query("update cachaste_duels2.matches set subject='LECTURA' where id=$1",[invitation.id]);
  const {rows:[readingStart]}=await db.query(
    'select position from cachaste_duels2.players where id=$1',[a.id]);
  await db.query(
    "update cachaste_duels2.players set question_started_at=clock_timestamp()-interval '89 seconds' where id=$1",[a.id]);
  const readingOpen=await call(clients[0],'attempt',{attemptId:a.id});
  assert.equal(readingOpen.position,readingStart.position,'Reading must remain open before 90 seconds');
  await db.query(
    "update cachaste_duels2.players set question_started_at=clock_timestamp()-interval '91 seconds' where id=$1",[a.id]);
  const readingExpired=await call(clients[0],'attempt',{attemptId:a.id});
  assert.equal(readingExpired.position,readingStart.position+1,'Reading must expire after 90 seconds');
  await db.query("update cachaste_duels2.matches set subject='M1' where id=$1",[invitation.id]);
  record('Real PostgreSQL enforces the 90-second deadline for non-math questions');

  await call(clients[0],'forfeit',{attemptId:a.id});
  await call(clients[1],'forfeit',{attemptId:b.id});
  const request={subject:'M1',requestId:randomUUID()};
  const waiting=await call(clients[0],'random',request);
  assert.equal(waiting.waiting,true);
  const {data:{user}}=await clients[0].auth.getUser();
  await db.query("update cachaste_duels2.queue set joined_at=clock_timestamp()-interval '11 seconds' where user_id=$1",[user.id]);
  const bot=await call(clients[0],'random',request);
  assert.equal(bot.opponentKind,'bot');
  const botAttempt=await call(clients[0],'start',{attemptId:bot.attemptId});
  await db.query(
    "update cachaste_duels2.players set question_started_at=clock_timestamp()-interval '121 seconds' where id=$1",
    [botAttempt.id]);
  const {rows:[offlineStart]}=await db.query(
    'select position from cachaste_duels2.players where id=$1',[botAttempt.id]);
  await db.query("update cachaste_duels2.bot_plan set due_at=clock_timestamp()-interval '1 second' where player_id in (select id from cachaste_duels2.players where match_id=$1 and slot=1)",[bot.id]);
  const operations=await readFile(new URL('../../duels2/operations.sql',import.meta.url),'utf8');
  const setup=operations.slice(operations.indexOf('create extension'),operations.indexOf('-- Verify'));
  const {rows:[{since}]}=await db.query('select clock_timestamp() as since');
  try{
    await db.query(setup);
    await until(async()=>{
      const {rows:[result]}=await db.query(`
        select exists(select 1 from cron.job_run_details r join cron.job j using(jobid)
          where j.jobname=$1 and r.status='succeeded' and r.start_time>=$2) as ran,
          (select position from cachaste_duels2.players where match_id=$3 and slot=1) as position
      `,[jobName,since,bot.id]);
      if(!result.ran||result.position!==10)return false;
      const {rows:[human]}=await db.query(
        'select position from cachaste_duels2.players where id=$1',[botAttempt.id]);
      return human.position>offlineStart.position;
    },85000,'Cron must advance bot and expired human question with no client RPC');
    const {rows:[offlineMiss]}=await db.query(
      'select choice,correct from cachaste_duels2.answers where player_id=$1 and position=$2',
      [botAttempt.id,offlineStart.position]);
    assert.equal(offlineMiss.choice,null);
    assert.equal(offlineMiss.correct,false);
    record('Cron advances the bot and expires an offline human question without client polling');
  }finally{
    if((await db.query("select to_regclass('cron.job') is not null as installed")).rows[0].installed)
      await db.query('select cron.unschedule(jobid) from cron.job where jobname=$1',[jobName]);
  }
}
