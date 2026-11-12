-- Duelos 2.0 question timer upgrade; additive migration for already deployed installations.

begin;

alter table cachaste_duels2.players add column if not exists question_started_at timestamptz;

update cachaste_duels2.players p set question_started_at=coalesce(m.activated_at,clock_timestamp()) from cachaste_duels2.matches m where m.id=p.match_id and p.question_started_at is null and p.position<10 and m.status='active';

create or replace function cachaste_duels2.advance(mid uuid)returns void language plpgsql set search_path='' as $$
declare m cachaste_duels2.matches;a cachaste_duels2.players;b cachaste_duels2.players;p cachaste_duels2.players;
 plan record;v record;w text;why text;score_a integer;score_b integer;delta integer;previous integer;actual integer;season_key text;changes jsonb:='{}';summary jsonb;begin
 select * into m from cachaste_duels2.matches where id=mid for update;
 if not found or m.status not in('active','invited')then return;end if;
 if m.status='invited'then
  if m.expires_at<=clock_timestamp() or not cachaste_duels2.eligible(m.creator) or(m.opponent is not null and(not cachaste_duels2.eligible(m.opponent) or exists(select 1 from cachaste.blocks where(owner_id=m.creator and blocked_id=m.opponent)or(owner_id=m.opponent and blocked_id=m.creator))))then
   update cachaste_duels2.matches set status=case when expires_at<=clock_timestamp()then 'expired'else 'cancelled'end where id=mid;perform cachaste_duels2.publish(mid);
  end if;return;
 end if;
 if m.opponent_kind='bot'then
  select * into b from cachaste_duels2.players where match_id=mid and slot=1;
  for plan in select * from cachaste_duels2.bot_plan where player_id=b.id and position>=b.position and due_at<=clock_timestamp() order by position loop
   insert into cachaste_duels2.answers(player_id,position,question_key,choice,correct,request_id,received_at)
   values(b.id,plan.position,plan.question_key,plan.choice,plan.correct,gen_random_uuid(),plan.due_at)on conflict do nothing;
   update cachaste_duels2.players set position=plan.position+1,correct=correct+case when plan.correct then 1 else 0 end,
    status=case when plan.position=9 then 'complete'else 'active'end where id=b.id;
  end loop;
 end if;
 -- Server-controlled per-question expiration, including while a client is offline.
 for p in select * from cachaste_duels2.players where match_id=mid and user_id is not null and status in('ready','active') order by slot for update loop
  while p.position<10 and p.question_started_at is not null and
   p.question_started_at+make_interval(secs=>case when upper(m.subject) in('M1','M2')then 120 else 90 end)<=clock_timestamp() loop
   insert into cachaste_duels2.answers(player_id,position,question_key,choice,correct,request_id,received_at)
    values(p.id,p.position,p.question_keys[p.position+1],null,false,gen_random_uuid(),
     p.question_started_at+make_interval(secs=>case when upper(m.subject) in('M1','M2')then 120 else 90 end))
    on conflict do nothing;
   update cachaste_duels2.players set position=position+1,streak=0,
    question_started_at=question_started_at+make_interval(secs=>case when upper(m.subject) in('M1','M2')then 120 else 90 end),
    status=case when position=9 then 'complete'else 'active'end where id=p.id returning * into p;
  end loop;
 end loop;
 if m.expires_at<=clock_timestamp()then
  -- Missing responses count as errors. A disconnect never pauses the shared deadline.
  for p in select * from cachaste_duels2.players where match_id=mid and status in('ready','active') order by slot loop
   insert into cachaste_duels2.answers(player_id,position,question_key,choice,correct,request_id)
   select p.id,n,p.question_keys[n+1],null,false,gen_random_uuid()from generate_series(p.position,9)n on conflict do nothing;
   update cachaste_duels2.players set position=10,status='forfeit',streak=0 where id=p.id;
  end loop;
 end if;
 select * into a from cachaste_duels2.players where match_id=mid and slot=0;
 select * into b from cachaste_duels2.players where match_id=mid and slot=1;
 update cachaste_duels2.matches set balance=(2*a.correct-a.position)-(2*b.correct-b.position)where id=mid;
 if a.status not in('complete','forfeit')or b.status not in('complete','forfeit')then perform cachaste_duels2.publish(mid);return;end if;
 score_a:=a.correct+(10-b.correct);score_b:=b.correct+(10-a.correct);
 if a.status='forfeit' and b.status='forfeit'then w:=null;why:='both_abandoned';
 elsif a.status='forfeit'then w:=coalesce(m.opponent::text,'virtual');why:='abandonment';
 elsif b.status='forfeit'then w:=m.creator::text;why:='abandonment';
 elsif score_a>score_b then w:=m.creator::text;why:='mastery';
 elsif score_b>score_a then w:=coalesce(m.opponent::text,'virtual');why:='mastery';else w:=null;why:='draw';end if;
 -- Match lock + unique ledger + sorted user/season locks provide exactly-once rewards.
 for p in select * from cachaste_duels2.players where match_id=mid and user_id is not null order by user_id loop
  foreach season_key in array array[m.season,'all']loop
   insert into cachaste.stats(user_id,subject,track,season)values(p.user_id,m.subject,m.track,season_key)on conflict do nothing;
   select stars into previous from cachaste.stats where user_id=p.user_id and subject=m.subject and track=m.track and season=season_key for update;
   delta:=case when w is null then 0 when w=p.user_id::text then 1 else -1 end*case when m.opponent_kind='human'then 3 else 1 end;
   actual:=greatest(0,previous+delta);
   insert into cachaste_duels2.star_ledger(match_id,user_id,season,requested_delta,delta,balance_after)
   values(mid,p.user_id,season_key,delta,actual-previous,actual)on conflict do nothing;
   if found then
    update cachaste.stats set stars=actual,wins=wins+case when w=p.user_id::text then 1 else 0 end,
     losses=losses+case when w is not null and w<>p.user_id::text then 1 else 0 end,
     draws=draws+case when w is null then 1 else 0 end,streak=case when w=p.user_id::text then streak+1 else 0 end
    where user_id=p.user_id and subject=m.subject and track=m.track and season=season_key;
   end if;
   if season_key=m.season then changes:=changes||jsonb_build_object(p.user_id::text,actual-previous);end if;
  end loop;
 end loop;
 summary:=jsonb_build_object('winner',w,'reason',why,'changes',changes,'opponentKind',m.opponent_kind,
  'creator',jsonb_build_object('correct',a.correct,'mastery',score_a,'status',a.status),
  'opponent',jsonb_build_object('correct',b.correct,'mastery',score_b,'status',b.status));
 update cachaste_duels2.matches set status='finished',result=summary where id=mid;
 update cachaste_duels2.players set released=true where match_id=mid;
 perform cachaste_duels2.publish(mid);
end$$;

create or replace function cachaste_duels2.attempt_view(pid uuid,u uuid)returns jsonb language plpgsql set search_path='' as $$
declare p cachaste_duels2.players;m cachaste_duels2.matches;q cachaste.questions;safe jsonb;begin
 select * into p from cachaste_duels2.players where id=pid and user_id=u;
 if not found then raise exception 'D2_NOT_FOUND';end if;
 select * into m from cachaste_duels2.matches where id=p.match_id;
 if p.status='active' and p.position<10 then
  select * into q from cachaste.questions where key=p.question_keys[p.position+1];
  safe:=jsonb_build_object('key',q.key,'question',q.body->'question','options',q.body->'options','visual',q.body->'visual','passage',q.body->'passage','concept',q.concept);
 end if;
 return jsonb_build_object('version',2,'id',p.id,'duelId',p.match_id,'kind','duel','subject',m.subject,'track',m.track,
  'status',p.status,'position',p.position,'total',10,'streak',p.streak,'deadline',m.expires_at,'questionDeadline',case when p.question_started_at is null then m.expires_at else p.question_started_at+make_interval(secs=>case when upper(m.subject) in('M1','M2')then 120 else 90 end)end,
  'serverNow',clock_timestamp(),'question',safe,'balance',m.balance,'correct',null);
end$$;

create or replace function cachaste_duels2.dispatch(operation text,payload jsonb default '{}')returns jsonb language plpgsql security definer set search_path='' as $$
#variable_conflict use_column
declare u uuid:=cachaste_duels2.require_player();p jsonb:=coalesce(payload,'{}');s text:=coalesce(p->>'subject','M1');t text:=coalesce(p->>'track','');
 mid uuid;pid uuid;rid uuid;other uuid;m cachaste_duels2.matches;parent cachaste_duels2.matches;pl cachaste_duels2.players;
 queue_row cachaste_duels2.queue;own_queue cachaste_duels2.queue;q cachaste.questions;pos integer;selected integer;ok boolean;items jsonb;before_time timestamptz;before_id uuid;rival uuid;cursor_value jsonb;summary jsonb;begin
 if octet_length(p::text)>16384 then raise exception 'PAYLOAD_TOO_LARGE';end if;
 if operation='health'then return jsonb_build_object('apiVersion',2,'waitSeconds',10,'durationSeconds',case when upper(s) in('M1','M2')then 120 else 90 end);end if;
 if operation in('random','create_duel','join_code','accept','rematch','cancel_queue')then
  -- One short matchmaking lock avoids queue/accept races across subjects and devices.
  perform pg_advisory_xact_lock(hashtextextended('cachaste-duels2-matchmaking',0));
 end if;
 if operation='cancel_queue'then delete from cachaste_duels2.queue where user_id=u;return jsonb_build_object('waiting',false);end if;
 if operation='dashboard' or operation='duel_history'then
  for m in select * from cachaste_duels2.matches where u in(creator,opponent)and status in('active','invited')order by id limit 50 loop perform cachaste_duels2.advance(m.id);end loop;
  if operation='duel_history'then
   before_time:=(p->'before'->>'createdAt')::timestamptz;before_id:=(p->'before'->>'id')::uuid;rival:=nullif(p->>'rivalId','')::uuid;
   if(before_time is null)<>(before_id is null)then raise exception 'INVALID_FILTER';end if;
   with rows as(
    select id,created_at from cachaste_duels2.matches where u in(creator,opponent)and status in('finished','declined','cancelled','expired')
     and(rival is null or rival in(creator,opponent))and(before_time is null or(created_at,id)<(before_time,before_id))
    order by created_at desc,id desc limit 21
   ),visible as(select * from rows order by created_at desc,id desc limit 20)
   select coalesce((select jsonb_agg(cachaste_duels2.match_view(v.id,u)order by v.created_at desc,v.id desc)from visible v),'[]'),
    case when(select count(*)from rows)>20 then(select jsonb_build_object('createdAt',v.created_at,'id',v.id)from visible v order by v.created_at,v.id limit 1)end
   into items,cursor_value;
   select jsonb_build_object('played',count(*),'wins',count(*)filter(where result->>'winner'=u::text),
    'losses',count(*)filter(where result->>'winner' is not null and result->>'winner'<>u::text),
    'draws',count(*)filter(where result->>'winner' is null))into summary
   from cachaste_duels2.matches where u in(creator,opponent)and status='finished'and(rival is null or rival in(creator,opponent));
   return jsonb_build_object('duels',items,'summary',summary,'next',cursor_value);
  end if;
  select coalesce(jsonb_agg(cachaste_duels2.match_view(id,u)order by created_at desc),'[]')into items from(
   select id,created_at from cachaste_duels2.matches where u in(creator,opponent)
   and(operation<>'duel_history' or status in('finished','declined','cancelled','expired'))order by created_at desc,id desc limit 50)x;
  return jsonb_build_object('duels',items,'stats',coalesce((select to_jsonb(v)from cachaste.stats v where user_id=u and subject=s and track=t and season=cachaste.season()),'{}'),
   'history',coalesce((select to_jsonb(v)from cachaste.stats v where user_id=u and subject=s and track=t and season='all'),'{}'));
 end if;
 if operation in('random','create_duel','rematch')then
  rid:=(p->>'requestId')::uuid;if rid is null then raise exception 'REQUEST_ID_REQUIRED';end if;
  select match_id into mid from cachaste_duels2.requests where user_id=u and request_id=rid;
  if mid is not null then perform cachaste_duels2.advance(mid);return cachaste_duels2.match_view(mid,u);end if;
  -- Reconnect to an unfinished match before starting another.
  select match_id into mid from cachaste_duels2.players where user_id=u and not released;
  if mid is not null then perform cachaste_duels2.advance(mid);
   if exists(select 1 from cachaste_duels2.players where user_id=u and match_id=mid and not released)then return cachaste_duels2.match_view(mid,u);end if;
  end if;
  perform cachaste.validate_subject(s,t);
  if operation='rematch'then
   select * into parent from cachaste_duels2.matches where id=(p->>'duelId')::uuid and u in(creator,opponent)and status='finished';
   if not found then raise exception 'D2_NOT_FOUND';end if;s:=parent.subject;t:=parent.track;
   select id into mid from cachaste_duels2.matches where rematch_of=parent.id and status in('invited','active');
   if mid is not null then return cachaste_duels2.match_view(mid,u);end if;
   other:=case when parent.creator=u then parent.opponent else parent.creator end;
  elsif operation='create_duel' and nullif(p->>'nickname','')is not null then
   select user_id into other from cachaste.profiles where lower(nickname)=lower(btrim(p->>'nickname'))and allow_challenges;
   if other is null then raise exception 'RIVAL_UNAVAILABLE';end if;
  end if;
  if operation='random'then
   if not exists(select 1 from cachaste.profiles where user_id=u and allow_challenges)then raise exception 'CHALLENGES_DISABLED';end if;
   delete from cachaste_duels2.queue where expires_at<=clock_timestamp();
   select * into own_queue from cachaste_duels2.queue where user_id=u and subject=s and track=t;
   select mq.* into queue_row from cachaste_duels2.queue mq join cachaste.profiles pr on pr.user_id=mq.user_id
   where mq.user_id<>u and mq.subject=s and mq.track=t and pr.allow_challenges and cachaste_duels2.eligible(mq.user_id)
    and not exists(select 1 from cachaste.blocks where(owner_id=u and blocked_id=mq.user_id)or(owner_id=mq.user_id and blocked_id=u))
    and not exists(select 1 from cachaste_duels2.players where user_id=mq.user_id and not released)
   order by mq.joined_at for update of mq limit 1;
   if found then other:=queue_row.user_id;
   elsif own_queue.user_id is null then
    perform cachaste.rate(u,'d2-match',30,60);
    insert into cachaste_duels2.queue(user_id,subject,track,request_id)values(u,s,t,rid)
    on conflict(user_id)do update set subject=excluded.subject,track=excluded.track,request_id=excluded.request_id,joined_at=clock_timestamp(),expires_at=clock_timestamp()+interval '30 seconds';
    return jsonb_build_object('waiting',true,'retryAfterMs',2000,'waitSeconds',10);
   elsif own_queue.joined_at>clock_timestamp()-interval '10 seconds'then
    update cachaste_duels2.queue set expires_at=clock_timestamp()+interval '30 seconds'where user_id=u;
    return jsonb_build_object('waiting',true,'retryAfterMs',2000,'waitSeconds',greatest(0,10-floor(extract(epoch from(clock_timestamp()-own_queue.joined_at)))));
   end if;
  end if;
  if other=u then raise exception 'SELF_DUEL';end if;
  if other is not null then
   if not cachaste_duels2.eligible(other)or not exists(select 1 from cachaste.profiles where user_id=other and allow_challenges)
    or exists(select 1 from cachaste.blocks where(owner_id=u and blocked_id=other)or(owner_id=other and blocked_id=u))then raise exception 'RIVAL_UNAVAILABLE';end if;
   if exists(select 1 from cachaste_duels2.matches where subject=s and track=t and status in('invited','active')and expires_at>clock_timestamp()and((creator=u and opponent=other)or(creator=other and opponent=u)))then raise exception 'PAIR_LIMIT';end if;
  end if;
  if operation<>'random'then perform cachaste.rate(u,'d2-invitation',30,60);end if;
  insert into cachaste_duels2.matches(creator,opponent,opponent_kind,subject,track,season,rematch_of)
  values(u,other,case when(operation='random'and other is null)or(operation='rematch'and parent.opponent_kind='bot')then 'bot'else 'human'end,s,t,cachaste.season(),case when operation='rematch'then parent.id end)returning id into mid;
  insert into cachaste_duels2.requests values(u,rid,mid);
  if queue_row.user_id is not null then insert into cachaste_duels2.requests values(queue_row.user_id,queue_row.request_id,mid)on conflict do nothing;end if;
  delete from cachaste_duels2.queue where user_id in(u,other);
  if operation='random' or(operation='rematch'and parent.opponent_kind='bot')then perform cachaste_duels2.activate(mid);end if;
  return cachaste_duels2.match_view(mid,u);
 end if;
 if operation='join_code'then
  perform cachaste.rate(u,'d2-code',30,60);
  select * into m from cachaste_duels2.matches where code=upper(replace(btrim(p->>'code'),'-',''))for update;
  if not found then raise exception 'D2_NOT_FOUND';end if;
  if m.opponent=u and m.status='active'then return cachaste_duels2.match_view(m.id,u);end if;
  if m.creator=u then raise exception 'SELF_DUEL';end if;
  if m.status<>'invited' or(m.opponent is not null and m.opponent<>u)or m.expires_at<=clock_timestamp()then raise exception 'INVITATION_UNAVAILABLE';end if;
  if not cachaste_duels2.eligible(m.creator)or exists(select 1 from cachaste.blocks where(owner_id=u and blocked_id=m.creator)or(owner_id=m.creator and blocked_id=u))then raise exception 'RIVAL_UNAVAILABLE';end if;
  update cachaste_duels2.matches set opponent=u where id=m.id;perform cachaste_duels2.activate(m.id);return cachaste_duels2.match_view(m.id,u);
 end if;
 if operation in('accept','decline','duel')then
  mid:=(p->>'duelId')::uuid;select * into m from cachaste_duels2.matches where id=mid and u in(creator,opponent)for update;
  if not found then raise exception 'D2_NOT_FOUND';end if;
  perform cachaste_duels2.advance(mid);select * into m from cachaste_duels2.matches where id=mid;
  if operation in('accept','decline')and m.opponent is distinct from u then raise exception 'NOT_FOUND';end if;
  if operation='accept'and m.status='invited'then perform cachaste_duels2.activate(mid);
  elsif operation='decline'and m.status='invited'then update cachaste_duels2.matches set status='declined'where id=mid;perform cachaste_duels2.publish(mid);end if;
  return cachaste_duels2.match_view(mid,u);
 end if;
 if operation in('start','attempt','answer','forfeit','review')then
  pid:=(p->>'attemptId')::uuid;select match_id into mid from cachaste_duels2.players where id=pid and user_id=u;
  if mid is null then raise exception 'D2_NOT_FOUND';end if;
  perform 1 from cachaste_duels2.matches where id=mid for update;
  perform cachaste_duels2.advance(mid);
  select * into m from cachaste_duels2.matches where id=mid;
  select * into pl from cachaste_duels2.players where id=pid for update;
  if operation='review'then
   if m.status<>'finished'then raise exception 'SOLUTIONS_HIDDEN';end if;
   select coalesce(jsonb_agg(jsonb_build_object('question',q.body,'choice',v.choice,'correct',v.correct,'answer',q.answer)order by v.position),'[]')into items
   from cachaste_duels2.answers v join cachaste.questions q on q.key=v.question_key where v.player_id=pid and not v.correct;
   return jsonb_build_object('errors',items);
  end if;
  if operation='start'and pl.status='ready'then update cachaste_duels2.players set status='active'where id=pid;end if;
  if operation='answer'then
   rid:=(p->>'requestId')::uuid;pos:=(p->>'position')::integer;selected:=(p->>'choice')::integer;
   if rid is null then raise exception 'REQUEST_ID_REQUIRED';end if;
   if exists(select 1 from cachaste_duels2.answers where player_id=pid and request_id=rid)then return cachaste_duels2.attempt_view(pid,u);end if;
   -- Expiration was settled before this branch; do not roll it back on a late answer.
   if m.status='finished'or pl.status='forfeit'then return cachaste_duels2.attempt_view(pid,u);end if;
   if pl.status<>'active'or pos is distinct from pl.position then raise exception 'ANSWER_OUT_OF_ORDER';end if;
   select * into q from cachaste.questions where key=pl.question_keys[pl.position+1];
   if selected is not null and(selected<0 or selected>=jsonb_array_length(q.body->'options'))then raise exception 'INVALID_CHOICE';end if;
   ok:=coalesce(selected=q.answer,false);
   insert into cachaste_duels2.answers(player_id,position,question_key,choice,correct,request_id)values(pid,pos,q.key,selected,ok,rid);
   update cachaste_duels2.players set position=position+1,correct=correct+case when ok then 1 else 0 end,
    streak=case when ok then streak+1 else 0 end,question_started_at=clock_timestamp(),status=case when position=9 then 'complete'else 'active'end where id=pid;
  elsif operation='forfeit'and pl.status in('ready','active')then
   insert into cachaste_duels2.answers(player_id,position,question_key,choice,correct,request_id)
   select pid,n,pl.question_keys[n+1],null,false,gen_random_uuid()from generate_series(pl.position,9)n;
   update cachaste_duels2.players set position=10,status='forfeit',streak=0 where id=pid;
  end if;
  perform cachaste_duels2.advance(mid);return cachaste_duels2.attempt_view(pid,u);
 end if;
 raise exception 'UNKNOWN_OPERATION';
end$$;

notify pgrst,'reload schema';

commit;
