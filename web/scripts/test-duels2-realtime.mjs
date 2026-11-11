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
    const answer=await call(clients[0],'answer',{attemptId:a.id,position:0,choice:0,requestId:randomUUID()});
    assert.equal(Math.abs(answer.balance),1);
    await until(()=>received[0].length>0&&received[1].length>0,15000,'Both players must receive the actual WebSocket update');
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

  await call(clients[0],'forfeit',{attemptId:a.id});
  await call(clients[1],'forfeit',{attemptId:b.id});
  const request={subject:'M1',requestId:randomUUID()};
  const waiting=await call(clients[0],'random',request);
  assert.equal(waiting.waiting,true);
  const {data:{user}}=await clients[0].auth.getUser();
  await db.query("update cachaste_duels2.queue set joined_at=clock_timestamp()-interval '11 seconds' where user_id=$1",[user.id]);
  const bot=await call(clients[0],'random',request);
  assert.equal(bot.opponentKind,'bot');
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
      return result.ran&&result.position===10;
    },85000,'Cron must advance the bot with no open channel or client RPC');
    record('The dedicated Cron job advances a bot without an open client or polling call');
  }finally{
    if((await db.query("select to_regclass('cron.job') is not null as installed")).rows[0].installed)
      await db.query('select cron.unschedule(jobid) from cron.job where jobname=$1',[jobName]);
  }
}
