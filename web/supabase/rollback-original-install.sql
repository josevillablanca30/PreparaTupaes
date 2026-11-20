-- Non-destructive recovery of the pre-install educational functions. No student or commercial rows are removed.
begin;
update cachaste_web.basic_feature_flags set duel_admission_enabled=false,progress_snapshot_enabled=false,learning_attempts_enabled=false,original_learning_enabled=false where id;
CREATE OR REPLACE FUNCTION cachaste_duels2.eligible(u uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
 select exists(select 1 from cachaste.profiles p where p.user_id=u and p.moderation_status='active'
  and p.community_version='2026-10-23' and p.community_accepted_at is not null)
 and not exists(select 1 from cachaste.community_restrictions where user_id=u) and cachaste.premium(u)
$function$;

CREATE OR REPLACE FUNCTION cachaste_duels2.require_player()
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare u uuid:=cachaste.require_user();p cachaste.profiles;begin
 select * into p from cachaste.profiles where user_id=u;
 if not found then raise exception 'PROFILE_REQUIRED';end if;
 if p.moderation_status='suspended' or exists(select 1 from cachaste.community_restrictions where user_id=u)then raise exception 'ACCOUNT_RESTRICTED';end if;
 if p.community_version is distinct from '2026-10-23' or p.community_accepted_at is null then raise exception 'COMMUNITY_REQUIRED';end if;
 if not cachaste.premium(u)then raise exception 'SUBSCRIPTION_REQUIRED' using errcode='42501';end if;
 return u;
end$function$;

CREATE OR REPLACE FUNCTION cachaste_web.progress(operation text, payload jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare u uuid:=cachaste.require_user();k text:=payload->>'key';doc cachaste_web.learning_documents;size_bytes bigint;response jsonb;
begin
 if not cachaste.premium(u)then raise exception 'SUBSCRIPTION_REQUIRED'using errcode='42501';end if;
 if operation='snapshot'then
  select coalesce(jsonb_agg(to_jsonb(d)-'user_id'order by d.key),'[]'::jsonb)into response from cachaste_web.learning_documents d where d.user_id=u;
  return jsonb_build_object('documents',response);
 end if;
 if operation<>'put'then raise exception 'INVALID_OPERATION';end if;
 if k is null or k not in('cachaste-daily-v1','prepara-paes-demo-v1','prepara-paes-active-exam-v1','cachaste-m1-assessments-v1','cachaste-m1-diagnostic-30-v1','cachaste-m1-diagnostic-draft-v1','cachaste-m1-pending-review-v1','cachaste-science-v1','cachaste-reading-v1','cachaste-m2-v1','cachaste-history-v1')then raise exception 'INVALID_PROGRESS_KEY';end if;
 if octet_length(payload::text)>1050000 or jsonb_typeof(payload->'value')not in('object','array','null')then raise exception 'INVALID_PROGRESS_VALUE';end if;
 perform pg_advisory_xact_lock(hashtextextended('web-progress:'||u::text,0));
 perform cachaste.rate(u,'web_progress',240,3600);
 select * into doc from cachaste_web.learning_documents where user_id=u and key=k;
 if coalesce((payload->>'baseVersion')::bigint,-1)<>coalesce(doc.version,0)then return jsonb_build_object('conflict',true,'document',case when doc.version is null then null else to_jsonb(doc)-'user_id'end);end if;
 select coalesce(sum(octet_length(coalesce(value::text,''))),0)into size_bytes from cachaste_web.learning_documents where user_id=u and key<>k;
 if size_bytes+octet_length(coalesce((payload->'value')::text,''))>2097152 then raise exception 'PROGRESS_QUOTA';end if;
 insert into cachaste_web.learning_documents(user_id,key,value)values(u,k,payload->'value')on conflict(user_id,key)do update set value=excluded.value,version=cachaste_web.learning_documents.version+1,updated_at=now()returning * into doc;
 return jsonb_build_object('conflict',false,'document',to_jsonb(doc)-'user_id');
end$function$;

CREATE OR REPLACE FUNCTION cachaste_duels2.dispatch(operation text, payload jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
  if operation='start'and pl.status='ready'and m.status='active'then update cachaste_duels2.players set status='active',question_started_at=clock_timestamp() where id=pid;end if;
  if operation='answer'then
   rid:=(p->>'requestId')::uuid;pos:=(p->>'position')::integer;selected:=(p->>'choice')::integer;
   if rid is null then raise exception 'REQUEST_ID_REQUIRED';end if;
   if exists(select 1 from cachaste_duels2.answers where player_id=pid and request_id=rid)then return cachaste_duels2.attempt_view(pid,u);end if;
   -- Expiration was settled before this branch; do not roll it back on a late answer.
   if m.status='finished'or pl.status in('forfeit','complete')then return cachaste_duels2.attempt_view(pid,u);end if;
   if pos is not null and pos<pl.position then return cachaste_duels2.attempt_view(pid,u);end if;
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
end$function$;

notify pgrst,'reload schema';
commit;

