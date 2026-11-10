-- Duelos 2.0 is additive. No payment/Auth/legacy engine definitions are replaced.
-- Apply only in coordination with launch owner; safe to re-run.
begin;
create schema if not exists cachaste_duels2;
revoke all on schema cachaste_duels2 from public,anon,authenticated;
grant usage on schema cachaste_duels2 to authenticated,service_role;
alter default privileges in schema cachaste_duels2 revoke all on tables from public,anon,authenticated;
alter default privileges in schema cachaste_duels2 revoke all on functions from public,anon,authenticated;

create table if not exists cachaste_duels2.matches(
 id uuid primary key default gen_random_uuid(),
 creator uuid not null references auth.users(id) on delete cascade,
 opponent uuid references auth.users(id) on delete cascade,
 opponent_kind text not null default 'human' check(opponent_kind in('human','bot')),
 bot_level text check(bot_level in('initial','intermediate','advanced')),
 subject text not null,track text not null default '',season text not null,
 status text not null default 'invited' check(status in('invited','active','finished','declined','cancelled','expired')),
 code text unique not null default upper(substr(replace(gen_random_uuid()::text,'-',''),1,12)),
 question_keys text[],created_at timestamptz not null default clock_timestamp(),
 activated_at timestamptz,expires_at timestamptz not null default clock_timestamp()+interval '48 hours',
 balance integer not null default 0 check(balance between -20 and 20),
 rematch_of uuid references cachaste_duels2.matches(id),result jsonb,
 check(creator is distinct from opponent),
 check(opponent_kind<>'bot' or opponent is null),
 check(question_keys is null or cardinality(question_keys)=10)
);
create index if not exists d2_matches_creator on cachaste_duels2.matches(creator,created_at desc);
create index if not exists d2_matches_opponent on cachaste_duels2.matches(opponent,created_at desc);
create index if not exists d2_matches_expiration on cachaste_duels2.matches(expires_at) where status in('active','invited');
create unique index if not exists d2_pending_rematch on cachaste_duels2.matches(rematch_of) where status in('invited','active');
create table if not exists cachaste_duels2.players(
 id uuid primary key default gen_random_uuid(),match_id uuid not null references cachaste_duels2.matches(id) on delete cascade,
 user_id uuid references auth.users(id) on delete cascade,slot smallint not null check(slot in(0,1)),
 question_keys text[] not null check(cardinality(question_keys)=10),
 position integer not null default 0 check(position between 0 and 10),correct integer not null default 0 check(correct between 0 and position),
 streak integer not null default 0,status text not null default 'ready' check(status in('ready','active','complete','forfeit')),
 released boolean not null default false,unique(match_id,slot),unique(match_id,user_id)
);
create unique index if not exists d2_one_active_player on cachaste_duels2.players(user_id) where not released and user_id is not null;
create table if not exists cachaste_duels2.answers(
 player_id uuid not null references cachaste_duels2.players(id) on delete cascade,
 position integer not null check(position between 0 and 9),question_key text not null references cachaste.questions(key),
 choice integer,correct boolean not null,request_id uuid not null,received_at timestamptz not null default clock_timestamp(),
 primary key(player_id,position),unique(player_id,request_id)
);
create table if not exists cachaste_duels2.bot_plan(
 player_id uuid not null references cachaste_duels2.players(id) on delete cascade,position integer not null,
 question_key text not null references cachaste.questions(key),choice integer not null,correct boolean not null,
 due_at timestamptz not null,primary key(player_id,position)
);
create table if not exists cachaste_duels2.queue(
 user_id uuid primary key references auth.users(id) on delete cascade,subject text not null,track text not null,
 request_id uuid not null,joined_at timestamptz not null default clock_timestamp(),
 expires_at timestamptz not null default clock_timestamp()+interval '30 seconds'
);
create index if not exists d2_queue_pool on cachaste_duels2.queue(subject,track,joined_at);
create table if not exists cachaste_duels2.requests(
 user_id uuid not null references auth.users(id) on delete cascade,request_id uuid not null,
 match_id uuid not null references cachaste_duels2.matches(id) on delete cascade,primary key(user_id,request_id)
);
create table if not exists cachaste_duels2.star_ledger(
 match_id uuid not null references cachaste_duels2.matches(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,season text not null,
 requested_delta integer not null,delta integer not null,balance_after integer not null check(balance_after>=0),
 created_at timestamptz not null default clock_timestamp(),primary key(match_id,user_id,season)
);

-- The small RLS predicate checks live Auth sessions, including revocations.
create or replace function cachaste_duels2.live_member(c uuid,o uuid)returns boolean language sql stable security definer set search_path='' as $$
 select (select auth.uid()) in(c,o)
 and exists(select 1 from auth.users where id=(select auth.uid()) and not coalesce(is_anonymous,false) and deleted_at is null)
 and exists(select 1 from auth.sessions where id::text=auth.jwt()->>'session_id' and user_id=(select auth.uid()) and(not_after is null or not_after>now()))
$$;
-- This is the ONLY replicated row. No actor, answer, progress, sequence or timestamps.
create table if not exists public.cachaste_duels2_live(
 id uuid primary key references cachaste_duels2.matches(id) on delete cascade,
 creator uuid not null,opponent uuid,balance integer not null check(balance between -20 and 20),status text not null
);
alter table public.cachaste_duels2_live enable row level security;
revoke all on public.cachaste_duels2_live from public,anon,authenticated;
grant select on public.cachaste_duels2_live to authenticated;
drop policy if exists d2_participant_read on public.cachaste_duels2_live;
create policy d2_participant_read on public.cachaste_duels2_live for select to authenticated
 using(cachaste_duels2.live_member(creator,opponent));
-- Default replica identity publishes keys only for old rows, never private records.
do $$declare t record;begin
 for t in select tablename from pg_tables where schemaname='cachaste_duels2' loop
  execute format('alter table cachaste_duels2.%I enable row level security',t.tablename);
  execute format('revoke all on cachaste_duels2.%I from public,anon,authenticated',t.tablename);
 end loop;
 if exists(select 1 from pg_publication where pubname='supabase_realtime') and not exists(
  select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='cachaste_duels2_live')then
  alter publication supabase_realtime add table public.cachaste_duels2_live;
 end if;
end$$;

create or replace function cachaste_duels2.eligible(u uuid)returns boolean language sql stable set search_path='' as $$
 select exists(select 1 from cachaste.profiles p where p.user_id=u and p.moderation_status='active'
  and p.community_version='2026-10-23' and p.community_accepted_at is not null)
 and not exists(select 1 from cachaste.community_restrictions where user_id=u) and cachaste.premium(u)
$$;
create or replace function cachaste_duels2.require_player()returns uuid language plpgsql set search_path='' as $$
declare u uuid:=cachaste.require_user();p cachaste.profiles;begin
 select * into p from cachaste.profiles where user_id=u;
 if not found then raise exception 'PROFILE_REQUIRED';end if;
 if p.moderation_status='suspended' or exists(select 1 from cachaste.community_restrictions where user_id=u)then raise exception 'ACCOUNT_RESTRICTED';end if;
 if p.community_version is distinct from '2026-10-23' or p.community_accepted_at is null then raise exception 'COMMUNITY_REQUIRED';end if;
 if not cachaste.premium(u)then raise exception 'SUBSCRIPTION_REQUIRED' using errcode='42501';end if;
 return u;
end$$;
create or replace function cachaste_duels2.publish(mid uuid)returns void language sql set search_path='' as $$
 insert into public.cachaste_duels2_live(id,creator,opponent,balance,status)
 select id,creator,opponent,balance,status from cachaste_duels2.matches where id=mid
 on conflict(id)do update set opponent=excluded.opponent,balance=excluded.balance,status=excluded.status
 where (cachaste_duels2_live.opponent,cachaste_duels2_live.balance,cachaste_duels2_live.status)
 is distinct from(excluded.opponent,excluded.balance,excluded.status)
$$;

create or replace function cachaste_duels2.activate(mid uuid)returns void language plpgsql set search_path='' as $$
#variable_conflict use_column
declare m cachaste_duels2.matches;keys text[];second_keys text[];pid uuid;q cachaste.questions;
 k text;i integer:=0;choice integer;probability numeric;due timestamptz;level_value text;begin
 select * into m from cachaste_duels2.matches where id=mid for update;
 if m.status<>'invited' or m.expires_at<=clock_timestamp() or(m.opponent_kind='human' and m.opponent is null)then raise exception 'INVITATION_UNAVAILABLE';end if;
 if exists(select 1 from cachaste_duels2.players where user_id in(m.creator,m.opponent) and not released)then raise exception 'PAIR_LIMIT';end if;
 -- Same finite, vetted PAES bank; prefer fresh questions for both. Distinct families.
 with previous as(
  select question_keys from cachaste_duels2.matches x where x.id<>m.id and m.creator in(x.creator,x.opponent)
   and x.subject=m.subject and x.track=m.track and question_keys is not null order by created_at desc,id desc limit 1
 ), candidates as(
  select q.key,q.family,q.key=any(coalesce((select question_keys from previous),'{}'::text[]))recent,
   (select max(last_seen) from cachaste.seen v where v.user_id in(m.creator,m.opponent) and v.question_key=q.key)seen_at
  from cachaste.pool(m.subject,m.track)q
 ), families as(select distinct on(family)* from candidates order by family,recent,seen_at nulls first,random()),
 picked as(select key from families order by recent,seen_at nulls first,random()limit 10)
 select array_agg(key order by random())into keys from picked;
 if cardinality(keys)is distinct from 10 then raise exception 'INSUFFICIENT_BANK';end if;
 -- Rotation guarantees a different order without leaking the opponent's order.
 second_keys:=keys[2:10]||keys[1:1];
 level_value:=case when coalesce((select stars from cachaste.stats where user_id=m.creator and subject=m.subject and track=m.track and season='all'),0)>=30 then 'advanced'
  when coalesce((select wins from cachaste.stats where user_id=m.creator and subject=m.subject and track=m.track and season='all'),0)>=3 then 'intermediate' else 'initial' end;
 update cachaste_duels2.matches set status='active',question_keys=keys,activated_at=clock_timestamp(),
  expires_at=clock_timestamp()+interval '40 minutes',bot_level=case when opponent_kind='bot'then level_value end where id=mid returning * into m;
 insert into cachaste_duels2.players(match_id,user_id,slot,question_keys)values(mid,m.creator,0,keys);
 insert into cachaste_duels2.players(match_id,user_id,slot,question_keys,status)
 values(mid,m.opponent,1,second_keys,case when m.opponent_kind='bot'then 'active'else 'ready'end)returning id into pid;
 insert into cachaste.seen(user_id,question_key)
 select u,k from unnest(array[m.creator,m.opponent])u cross join unnest(keys)k where u is not null
 on conflict(user_id,question_key)do update set last_seen=clock_timestamp();
 if m.opponent_kind='bot'then
  due:=clock_timestamp();
  foreach k in array second_keys loop
   select * into q from cachaste.questions where key=k;
   probability:=case level_value when 'advanced'then .85 when 'intermediate'then .65 else .45 end;
   probability:=greatest(.20,least(.95,probability+case when lower(q.difficulty) in('alta','difícil','hard')then -.12 when lower(q.difficulty)in('baja','fácil','easy')then .10 else 0 end));
   if random()<probability then choice:=q.answer;
   else choice:=(q.answer+1+floor(random()*(jsonb_array_length(q.body->'options')-1))::integer)%jsonb_array_length(q.body->'options');end if;
   due:=due+make_interval(secs=>case when m.subject in('M1','M2')then 35 else 20 end+floor(random()*55)::integer);
   insert into cachaste_duels2.bot_plan values(pid,i,k,choice,choice=q.answer,due);i:=i+1;
  end loop;
 end if;
 perform cachaste_duels2.publish(mid);
end$$;

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

create or replace function cachaste_duels2.match_view(mid uuid,u uuid)returns jsonb language plpgsql set search_path='' as $$
declare m cachaste_duels2.matches;p cachaste_duels2.players;rival jsonb;begin
 select * into m from cachaste_duels2.matches where id=mid and u in(creator,opponent);
 if not found then raise exception 'D2_NOT_FOUND';end if;
 select * into p from cachaste_duels2.players where match_id=mid and user_id=u;
 rival:=case when m.opponent_kind='bot'then jsonb_build_object('id','virtual','nickname','Rival virtual','avatar',0,'virtual',true,'level',m.bot_level,'commune','Entrenamiento competitivo')else cachaste.person(m.opponent)end;
 return jsonb_build_object('version',2,'id',m.id,'status',m.status,'subject',m.subject,'track',m.track,'season',m.season,
  'creator',cachaste.person(m.creator),'opponent',rival,'opponentKind',m.opponent_kind,
  'code',case when u=m.creator and m.status='invited'then m.code end,'createdAt',m.created_at,'expiresAt',m.expires_at,
  'creatorStars',coalesce((select stars from cachaste.stats where user_id=m.creator and subject=m.subject and track=m.track and season=m.season),0),
  'opponentStars',coalesce((select stars from cachaste.stats where user_id=m.opponent and subject=m.subject and track=m.track and season=m.season),0),
  'attemptId',p.id,'attemptStatus',p.status,'balance',m.balance,'result',m.result);
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
  'status',p.status,'position',p.position,'total',10,'streak',p.streak,'deadline',m.expires_at,'questionDeadline',m.expires_at,
  'serverNow',clock_timestamp(),'question',safe,'balance',m.balance,'correct',null);
end$$;

create or replace function cachaste_duels2.dispatch(operation text,payload jsonb default '{}')returns jsonb language plpgsql security definer set search_path='' as $$
#variable_conflict use_column
declare u uuid:=cachaste_duels2.require_player();p jsonb:=coalesce(payload,'{}');s text:=coalesce(p->>'subject','M1');t text:=coalesce(p->>'track','');
 mid uuid;pid uuid;rid uuid;other uuid;m cachaste_duels2.matches;parent cachaste_duels2.matches;pl cachaste_duels2.players;
 queue_row cachaste_duels2.queue;own_queue cachaste_duels2.queue;q cachaste.questions;pos integer;selected integer;ok boolean;items jsonb;begin
 if octet_length(p::text)>16384 then raise exception 'PAYLOAD_TOO_LARGE';end if;
 if operation='health'then return jsonb_build_object('apiVersion',2,'waitSeconds',10,'durationSeconds',2400);end if;
 if operation in('random','create_duel','join_code','accept','rematch','cancel_queue')then
  -- One short matchmaking lock avoids queue/accept races across subjects and devices.
  perform pg_advisory_xact_lock(hashtextextended('cachaste-duels2-matchmaking',0));
 end if;
 if operation='cancel_queue'then delete from cachaste_duels2.queue where user_id=u;return jsonb_build_object('waiting',false);end if;
 if operation='dashboard' or operation='duel_history'then
  for m in select * from cachaste_duels2.matches where u in(creator,opponent)and status in('active','invited')order by id limit 50 loop perform cachaste_duels2.advance(m.id);end loop;
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
    streak=case when ok then streak+1 else 0 end,status=case when position=9 then 'complete'else 'active'end where id=pid;
  elsif operation='forfeit'and pl.status in('ready','active')then
   insert into cachaste_duels2.answers(player_id,position,question_key,choice,correct,request_id)
   select pid,n,pl.question_keys[n+1],null,false,gen_random_uuid()from generate_series(pl.position,9)n;
   update cachaste_duels2.players set position=10,status='forfeit',streak=0 where id=pid;
  end if;
  perform cachaste_duels2.advance(mid);return cachaste_duels2.attempt_view(pid,u);
 end if;
 raise exception 'UNKNOWN_OPERATION';
end$$;

-- Service-only maintenance: no Auth claim or client can accelerate the clock/bot.
create or replace function cachaste_duels2.sweep()returns integer language plpgsql security definer set search_path='' as $$
declare m record;n integer:=0;begin
 for m in select id from cachaste_duels2.matches where status in('active','invited')and(expires_at<=clock_timestamp()or opponent_kind='bot')order by id for update skip locked limit 200 loop
  perform cachaste_duels2.advance(m.id);n:=n+1;
 end loop;
 delete from cachaste_duels2.queue where expires_at<=clock_timestamp();return n;
end$$;
create or replace function public.cachaste_duels2(operation text,payload jsonb default '{}')returns jsonb language sql security invoker set search_path='' as $$select cachaste_duels2.dispatch(operation,payload)$$;
create or replace function public.cachaste_duels2_maintenance()returns integer language sql security invoker set search_path='' as $$select cachaste_duels2.sweep()$$;
revoke all on all functions in schema cachaste_duels2 from public,anon,authenticated;
revoke all on function public.cachaste_duels2(text,jsonb)from public,anon;
revoke all on function public.cachaste_duels2_maintenance()from public,anon,authenticated;
grant execute on function cachaste_duels2.live_member(uuid,uuid)to authenticated;
grant execute on function cachaste_duels2.dispatch(text,jsonb),public.cachaste_duels2(text,jsonb)to authenticated;
grant execute on function cachaste_duels2.sweep(),public.cachaste_duels2_maintenance()to service_role;
grant all on all tables in schema cachaste_duels2 to service_role;
grant all on public.cachaste_duels2_live to service_role;
-- Attach the dedicated job only if the launch environment already enabled pg_cron.
do $$begin
 if exists(select 1 from pg_extension where extname='pg_cron')then
  perform cron.schedule('cachaste-duels2-maintenance','* * * * *','select cachaste_duels2.sweep()');
 end if;
end$$;
notify pgrst,'reload schema';
commit;
