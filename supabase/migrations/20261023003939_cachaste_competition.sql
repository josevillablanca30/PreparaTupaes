-- No production identities, results or entitlements are seeded by this migration.
begin;
create schema if not exists cachaste;
revoke all on schema cachaste from public, anon, authenticated;
grant usage on schema cachaste to authenticated, service_role;
create table cachaste.settings (id boolean primary key default true check(id), environment text not null default 'production' check(environment in ('production','test')));
insert into cachaste.settings default values;
create table cachaste.locations (commune_code text primary key, commune text not null, region_code text not null, region text not null);
create index locations_region on cachaste.locations(region_code,commune_code);
create table cachaste.profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 nickname text not null check(nickname ~ '^[[:alnum:]_]{3,20}$' and nickname !~ '^[0-9]+$'),
 commune_code text not null references cachaste.locations(commune_code), avatar smallint not null default 0 check(avatar between 0 and 6),
 public_ranking boolean not null default false, allow_challenges boolean not null default false, show_commune boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index profiles_nickname on cachaste.profiles(lower(nickname));
create index profiles_location on cachaste.profiles(commune_code,user_id) where public_ranking;
create table cachaste.entitlements (
 user_id uuid primary key references auth.users(id) on delete cascade,
 valid_until timestamptz not null, source text not null check(source in ('google_play_verified','test_harness')),
 status text not null check(status in ('active','trial','revoked')), receipt_hash text unique not null,
 verified_at timestamptz not null default now()
);
comment on table cachaste.entitlements is 'Server verifier only. Never accept a premium boolean, device receipt claim or user_metadata. Test harness only in isolated test environment.';
create table cachaste.questions (
 key text primary key, subject text not null check(subject in ('M1','M2','Lectura','Historia','Ciencias')),
 track text, module text, family text not null, concept text not null, axis text not null,
 difficulty text not null, eligible boolean not null, assessment_hash text not null,
 body jsonb not null, answer smallint not null check(answer between 0 and 5),
 check(jsonb_typeof(body->'options')='array' and answer < jsonb_array_length(body->'options'))
);
create index questions_pool on cachaste.questions(subject,eligible,concept);
create table cachaste.blocks (owner_id uuid not null references auth.users(id) on delete cascade, blocked_id uuid not null references auth.users(id) on delete cascade, primary key(owner_id,blocked_id), check(owner_id<>blocked_id));
create table cachaste.rate_events (user_id uuid not null references auth.users(id) on delete cascade, kind text not null, at timestamptz not null default now());
create index rate_events_user on cachaste.rate_events(user_id,kind,at desc);
create table cachaste.seen (user_id uuid not null references auth.users(id) on delete cascade, question_key text not null references cachaste.questions(key), last_seen timestamptz not null default now(), primary key(user_id,question_key));
create table cachaste.duels (
 id uuid primary key default gen_random_uuid(), creator uuid not null references auth.users(id) on delete cascade,
 opponent uuid references auth.users(id) on delete cascade, code text unique not null default upper(substr(replace(gen_random_uuid()::text,'-',''),1,12)),
 subject text not null check(subject in ('M1','M2','Lectura','Historia','Ciencias')), track text not null default '',
 status text not null default 'invited' check(status in ('invited','active','finished','declined','cancelled','expired')),
 season text not null, question_keys text[], created_at timestamptz not null default now(), expires_at timestamptz not null default now()+interval '48 hours',
 winner uuid, reason text, settled_at timestamptz, check(creator is distinct from opponent)
);
create index duels_creator on cachaste.duels(creator,created_at desc);
create index duels_opponent on cachaste.duels(opponent,created_at desc);
create table cachaste.attempts (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 duel_id uuid references cachaste.duels(id) on delete cascade,
 kind text not null check(kind in ('duel','exam','express','game')), subject text not null, track text not null default '', concept text,
 season text not null, category text not null, question_keys text[] not null,
 started_at timestamptz, presented_at timestamptz, deadline timestamptz, per_question_seconds int not null default 90,
 position int not null default 0, correct int not null default 0 check(correct>=0), elapsed_ms bigint not null default 0 check(elapsed_ms>=0),
 status text not null default 'ready' check(status in ('ready','active','complete','forfeit')),
 request_id uuid not null, finished_at timestamptz, unique(user_id,request_id), unique(duel_id,user_id)
);
create unique index ranked_one_weekly_attempt on cachaste.attempts(user_id,kind,subject,track,season) where kind in ('exam','express');
create index attempts_user on cachaste.attempts(user_id,finished_at desc);
create table cachaste.answers (
 attempt_id uuid not null references cachaste.attempts(id) on delete cascade, position int not null,
 question_key text not null references cachaste.questions(key), choice int, correct boolean not null, elapsed_ms bigint not null check(elapsed_ms>=0),
 request_id uuid not null, received_at timestamptz not null default now(), primary key(attempt_id,position), unique(attempt_id,request_id)
);
create table cachaste.forms (
 kind text not null check(kind in ('exam','express')), subject text not null, track text not null, season text not null,
 question_keys text[] not null, seconds int not null, category text not null, primary key(kind,subject,track,season)
);
create table cachaste.stats (
 user_id uuid not null references auth.users(id) on delete cascade, subject text not null, track text not null, season text not null,
 stars int not null default 0 check(stars>=0), wins int not null default 0, losses int not null default 0, draws int not null default 0, streak int not null default 0,
 primary key(user_id,subject,track,season)
);
create index stats_ranking on cachaste.stats(season,subject,track,stars desc);
create table cachaste.settlements (
 duel_id uuid primary key references cachaste.duels(id) on delete cascade, result jsonb not null, created_at timestamptz not null default now()
);
create table cachaste.education (
 user_id uuid not null references auth.users(id) on delete cascade, subject text not null, concept text not null,
 stars int not null default 0 check(stars between 0 and 5), families text[] not null default '{}', primary key(user_id,subject,concept)
);
create table cachaste.education_ledger (
 attempt_id uuid primary key references cachaste.attempts(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade,
 subject text not null, season text not null, delta int not null check(delta>=0)
);
create table cachaste.records (
 user_id uuid not null references auth.users(id) on delete cascade, kind text not null, subject text not null, track text not null,
 season text not null, category text not null, score int not null, total int not null, attempt_id uuid references cachaste.attempts(id),
 primary key(user_id,kind,subject,track,season,category)
);
create index records_rank on cachaste.records(kind,season,subject,track,category,score desc);
create table cachaste.match_queue (
 user_id uuid primary key references auth.users(id) on delete cascade, subject text not null, track text not null,
 joined_at timestamptz not null default now(), expires_at timestamptz not null default now()+interval '5 minutes'
);
create index match_queue_pool on cachaste.match_queue(subject,track,expires_at);
create table cachaste.legacy_progress (
 user_id uuid primary key references auth.users(id) on delete cascade, snapshot jsonb not null, imported_at timestamptz not null default now(),
 verified boolean not null default false check(not verified)
);
create index answers_question on cachaste.answers(question_key);
create index seen_question on cachaste.seen(question_key);
create index blocks_target on cachaste.blocks(blocked_id);
create index profiles_commune_all on cachaste.profiles(commune_code);
create index records_attempt on cachaste.records(attempt_id);
create index education_ledger_rank on cachaste.education_ledger(season,subject,user_id);
create index education_ledger_user on cachaste.education_ledger(user_id);
-- Private schema is not in the Data API. RLS is defense in depth; no table is client writable/readable.
do $$declare t record; begin
 for t in select tablename from pg_tables where schemaname='cachaste' loop
  execute format('alter table cachaste.%I enable row level security',t.tablename);
  execute format('revoke all on cachaste.%I from public,anon,authenticated',t.tablename);
 end loop;
end$$;

create function cachaste.season() returns text language sql stable set search_path='' as $$select to_char(date_trunc('week',now() at time zone 'America/Santiago'),'YYYY-MM-DD')$$;
create function cachaste.require_user() returns uuid language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); sid text:=auth.jwt()->>'session_id'; begin
 if u is null or sid is null or not exists(select 1 from auth.users where id=u and coalesce(is_anonymous,false)=false and deleted_at is null)
 or not exists(select 1 from auth.sessions where id::text=sid and user_id=u and (not_after is null or not_after>now())) then raise exception 'AUTH_REQUIRED' using errcode='28000'; end if;
 return u;
end$$;
create function cachaste.premium(u uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from cachaste.entitlements e cross join cachaste.settings s where e.user_id=u and e.valid_until>now() and e.status in ('active','trial')
 and (e.source='google_play_verified' or (e.source='test_harness' and s.environment='test')))
$$;
create function cachaste.rate(u uuid,k text,maximum int,window_seconds int) returns void language plpgsql set search_path='' as $$begin
 perform pg_advisory_xact_lock(hashtextextended(u::text||k,0));
 if (select count(*) from cachaste.rate_events where user_id=u and kind=k and at>now()-make_interval(secs=>window_seconds))>=maximum then raise exception 'RATE_LIMIT'; end if;
 insert into cachaste.rate_events(user_id,kind)values(u,k);
end$$;
create function cachaste.person(u uuid) returns jsonb language sql stable set search_path='' as $$
 select jsonb_build_object('id',p.user_id,'nickname',p.nickname,'avatar',p.avatar,'region',l.region,'commune',case when p.show_commune then l.commune else 'Comuna privada' end)
 from cachaste.profiles p join cachaste.locations l using(commune_code) where p.user_id=u
$$;
create function cachaste.pool(s text,t text) returns setof cachaste.questions language sql stable set search_path='' as $$
 select q.* from cachaste.questions q where q.subject=s and q.eligible and (s<>'Ciencias' or q.module='MC' or (t='TP' and q.module='MTP') or(q.module='ME' and q.track=t))
$$;
create function cachaste.validate_subject(s text,t text) returns void language plpgsql set search_path='' as $$begin
 if s not in ('M1','M2','Lectura','Historia','Ciencias') or (s='Ciencias' and t not in ('Biología','Física','Química','TP')) or(s<>'Ciencias' and t<>'') then raise exception 'INVALID_SUBJECT';end if;
end$$;
create function cachaste.activate_duel(did uuid) returns void language plpgsql set search_path='' as $$
declare d cachaste.duels; keys text[]; u uuid; begin
 select * into d from cachaste.duels where id=did for update;
 if d.status<>'invited' or d.opponent is null or d.expires_at<=now() then raise exception 'INVITATION_UNAVAILABLE';end if;
 for u in select x from unnest(array[d.creator,d.opponent])x order by x loop perform pg_advisory_xact_lock(hashtextextended(u::text||'question-reservations',0));end loop;
 -- Never repeat a recently presented question for either student. One representative per transfer family.
 select array_agg(key order by rnd) into keys from (
  select distinct on(family) key,family,random() rnd from cachaste.pool(d.subject,d.track) q
  where not exists(select 1 from cachaste.seen v where v.user_id in(d.creator,d.opponent) and v.question_key=q.key and v.last_seen>now()-interval '14 days')
  order by family,random()
 ) q;
 select array_agg(k) into keys from(select k from unnest(keys)k order by random() limit 10)t;
 if cardinality(keys) is distinct from 10 then raise exception 'FRESH_POOL_EXHAUSTED';end if;
 update cachaste.duels set question_keys=keys,status='active' where id=did;
 foreach u in array array[d.creator,d.opponent] loop
  insert into cachaste.attempts(user_id,duel_id,kind,subject,track,season,category,question_keys,request_id)
  values(u,did,'duel',d.subject,d.track,d.season,'duel10-v1',keys,gen_random_uuid());
  insert into cachaste.seen(user_id,question_key)select u,k from unnest(keys)k on conflict(user_id,question_key)do update set last_seen=now();
 end loop;
end$$;
create function cachaste.finish_attempt(aid uuid) returns void language plpgsql set search_path='' as $$
declare a cachaste.attempts; r record; e cachaste.education; evidence text[]; n int; new_stars int; difference int; begin
 select * into a from cachaste.attempts where id=aid;
 if a.status not in ('complete','forfeit') or a.kind='duel' then return;end if;
 if a.kind in ('exam','express') and a.status='complete' then
  insert into cachaste.records(user_id,kind,subject,track,season,category,score,total,attempt_id)
  values(a.user_id,a.kind,a.subject,a.track,a.season,a.category,a.correct,cardinality(a.question_keys),a.id)
  on conflict(user_id,kind,subject,track,season,category)do nothing;
 elsif a.kind='game' and not exists(select 1 from cachaste.education_ledger where attempt_id=aid)then
  perform pg_advisory_xact_lock(hashtextextended(a.user_id::text||a.subject||a.concept,0));
  insert into cachaste.education(user_id,subject,concept)values(a.user_id,a.subject,a.concept)on conflict do nothing;
  select * into e from cachaste.education where user_id=a.user_id and subject=a.subject and concept=a.concept for update;
  select array_agg(distinct f)into evidence from(select unnest(e.families)f union select q.family from cachaste.answers v join cachaste.questions q on q.key=v.question_key where v.attempt_id=aid and v.correct)t;
  n:=coalesce(cardinality(evidence),0);new_stars:=case when n>=3 then 5 when n>=2 then 4 when n=1 then 3 else 1 end;difference:=greatest(e.stars,new_stars)-e.stars;
  update cachaste.education set stars=greatest(e.stars,new_stars),families=coalesce(evidence,'{}')where user_id=a.user_id and subject=a.subject and concept=a.concept;
  insert into cachaste.education_ledger values(a.id,a.user_id,a.subject,a.season,difference)on conflict do nothing;
 end if;
end$$;
create function cachaste.settle(did uuid) returns void language plpgsql set search_path='' as $$
declare d cachaste.duels; a cachaste.attempts; b cachaste.attempts; w uuid; why text; u uuid; delta int; previous int; actual int; changes jsonb:='{}'; summary jsonb; season_key text; begin
 select * into d from cachaste.duels where id=did for update;
 if d.status<>'active' or exists(select 1 from cachaste.settlements where duel_id=did)then return;end if;
 -- Expired started attempts receive blanks and the maximum valid time; device time is never trusted.
 update cachaste.attempts set status='forfeit',finished_at=now(),elapsed_ms=900000 where duel_id=did and status='active' and deadline<=now();
 if d.expires_at<=now()then update cachaste.attempts set status='forfeit',finished_at=now(),elapsed_ms=900000 where duel_id=did and status in('ready','active');end if;
 select * into a from cachaste.attempts where duel_id=did and user_id=d.creator;
 select * into b from cachaste.attempts where duel_id=did and user_id=d.opponent;
 if a.status not in('complete','forfeit') or b.status not in('complete','forfeit')then return;end if;
 if a.status='forfeit' and b.status='forfeit' then update cachaste.duels set status='cancelled',reason='Ambos abandonaron',settled_at=now()where id=did;return;end if;
 if a.status='forfeit' then w:=b.user_id;why:='abandonment';
 elsif b.status='forfeit'then w:=a.user_id;why:='abandonment';
 elsif a.correct>b.correct then w:=a.user_id;why:='correct';elsif b.correct>a.correct then w:=b.user_id;why:='correct';
 elsif a.elapsed_ms<b.elapsed_ms then w:=a.user_id;why:='time';elsif b.elapsed_ms<a.elapsed_ms then w:=b.user_id;why:='time';else w:=null;why:='draw';end if;
 -- Consistent lock order prevents cross-duel deadlocks. Unique settlement + row lock prevents double rewards.
 for u in select x from unnest(array[d.creator,d.opponent])x order by x loop
  foreach season_key in array array[d.season,'all']loop
   insert into cachaste.stats(user_id,subject,track,season)values(u,d.subject,d.track,season_key)on conflict do nothing;
   select stars into previous from cachaste.stats where user_id=u and subject=d.subject and track=d.track and season=season_key for update;
   delta:=case when w is null then 0 when w=u then 1 else -1 end;
   update cachaste.stats set stars=greatest(0,stars+delta),wins=wins+case when w=u then 1 else 0 end,losses=losses+case when w is not null and w<>u then 1 else 0 end,draws=draws+case when w is null then 1 else 0 end,streak=case when w=u then streak+1 else 0 end
   where user_id=u and subject=d.subject and track=d.track and season=season_key returning stars into actual;
   if season_key=d.season then changes:=changes||jsonb_build_object(u::text,actual-previous);end if;
  end loop;
 end loop;
 summary:=jsonb_build_object('winner',w,'reason',why,'changes',changes,'creator',jsonb_build_object('correct',a.correct,'elapsedMs',a.elapsed_ms,'status',a.status),'opponent',jsonb_build_object('correct',b.correct,'elapsedMs',b.elapsed_ms,'status',b.status));
 insert into cachaste.settlements(duel_id,result)values(did,summary);
 update cachaste.duels set status='finished',winner=w,reason=why,settled_at=now()where id=did;
end$$;
create function cachaste.duel_view(did uuid,u uuid) returns jsonb language plpgsql set search_path='' as $$
declare d cachaste.duels; a cachaste.attempts; result jsonb; begin
 select * into d from cachaste.duels where id=did and u in(creator,opponent);
 if not found then raise exception 'NOT_FOUND';end if;
 select * into a from cachaste.attempts where duel_id=did and user_id=u;
 select s.result into result from cachaste.settlements s where s.duel_id=did;
 return jsonb_build_object('id',d.id,'code',case when u=d.creator and d.status='invited' then d.code else null end,'status',d.status,'subject',d.subject,'track',d.track,'season',d.season,'creator',cachaste.person(d.creator),'opponent',cachaste.person(d.opponent),'creatorStars',coalesce((select stars from cachaste.stats where user_id=d.creator and subject=d.subject and track=d.track and season=d.season),0),'opponentStars',coalesce((select stars from cachaste.stats where user_id=d.opponent and subject=d.subject and track=d.track and season=d.season),0),'expiresAt',d.expires_at,'createdAt',d.created_at,'attemptId',a.id,'attemptStatus',a.status,'result',result);
end$$;
create function cachaste.attempt_view(aid uuid,u uuid)returns jsonb language plpgsql set search_path='' as $$
declare a cachaste.attempts;q cachaste.questions; safe jsonb; begin
 select * into a from cachaste.attempts where id=aid and user_id=u;
 if not found then raise exception 'NOT_FOUND';end if;
 if a.status='active' and a.position<cardinality(a.question_keys)then
  select * into q from cachaste.questions where key=a.question_keys[a.position+1];
  safe:=jsonb_build_object('key',q.key,'question',q.body->'question','options',q.body->'options','visual',q.body->'visual','passage',q.body->'passage','concept',q.concept);
 end if;
 return jsonb_build_object('id',a.id,'duelId',a.duel_id,'kind',a.kind,'subject',a.subject,'track',a.track,'status',a.status,'position',a.position,'total',cardinality(a.question_keys),'deadline',a.deadline,'questionDeadline',least(a.deadline,a.presented_at+make_interval(secs=>a.per_question_seconds)),'serverNow',clock_timestamp(),'category',a.category,'question',safe,'correct',case when a.kind<>'duel' and a.status='complete'then a.correct else null end);
end$$;
create function cachaste.rankings(u uuid,p jsonb)returns jsonb language plpgsql set search_path='' as $$
<<rankings>>
declare mode text:=p->>'mode';s text:=p->>'subject';t text:=coalesce(p->>'track','');scope text:=coalesce(p->>'scope','Chile');week text:=coalesce(p->>'season',cachaste.season());me cachaste.profiles;geo cachaste.locations;category text;response jsonb;begin
 if mode not in('exam','express','game','duel')or scope not in('Comuna','Región','Chile')or week !~ '^(all|[0-9]{4}-[0-9]{2}-[0-9]{2})$'then raise exception 'INVALID_FILTER';end if;
 perform cachaste.validate_subject(s,t);select * into me from cachaste.profiles where user_id=u;select * into geo from cachaste.locations where commune_code=me.commune_code;
 if mode in('exam','express')then
  if week='all'then raise exception 'SELECT_EQUIVALENT_WEEK';end if;
  select f.category into category from cachaste.forms f where f.kind=mode and f.subject=s and f.track=t and f.season=week;
 end if;
 with scores as(
  select user_id,score::bigint value,total from cachaste.records where kind=mode and subject=s and track=t and season=week and cachaste.records.category=rankings.category and mode in('exam','express')
  union all select user_id,stars::bigint,0 from cachaste.stats where mode='duel' and subject=s and track=t and season=week
  union all select user_id,sum(case when week='all'then stars else 0 end)::bigint,0 from cachaste.education e where mode='game' and subject=s and week='all'and (s<>'Ciencias'or exists(select 1 from cachaste.pool(s,t)q where q.concept=e.concept))group by user_id
  union all select e.user_id,sum(e.delta)::bigint,0 from cachaste.education_ledger e join cachaste.attempts a on a.id=e.attempt_id where mode='game' and e.subject=s and e.season=week and (s<>'Ciencias'or exists(select 1 from cachaste.pool(s,t)q where q.concept=a.concept))group by e.user_id
 ), visible as(
  select x.*,pr.nickname,pr.avatar,l.region,coalesce(h.wins,0)wins,coalesce(h.losses,0)losses,coalesce(h.draws,0)draws,coalesce(h.streak,0)streak,case when pr.show_commune then l.commune else 'Comuna privada'end commune
  from scores x join cachaste.profiles pr using(user_id)join cachaste.locations l on l.commune_code=pr.commune_code
  left join cachaste.stats h on h.user_id=x.user_id and h.subject=s and h.track=t and h.season='all' and mode='duel'
  where pr.public_ranking and (week<>cachaste.season()or cachaste.premium(pr.user_id))and(scope='Chile'or(scope='Región'and l.region_code=geo.region_code)or(scope='Comuna'and l.commune_code=geo.commune_code))
 ), positioned as(select *,rank()over(order by value desc)position from visible),mine as(select position from positioned where user_id=u)
 select jsonb_build_object('top',coalesce((select jsonb_agg(v order by v.position,v.nickname)from(select * from positioned order by position,nickname limit 10)v),'[]'::jsonb),
 'me',(select to_jsonb(v)from positioned v where user_id=u),'nearby',coalesce((select jsonb_agg(v order by v.position,v.nickname)from(select * from positioned where user_id<>u and position between greatest(1,coalesce((select position from mine),1)-3)and coalesce((select position from mine),1)+1 limit 5)v),'[]'::jsonb),
 'category',category,'season',week,'scope',scope,'participating',me.public_ranking)into response;
 return response;
end$$;

create function cachaste.dispatch(operation text,payload jsonb default '{}')returns jsonb language plpgsql security definer set search_path='' as $$
#variable_conflict use_column
<<dispatch>>
declare u uuid:=cachaste.require_user();p jsonb:=coalesce(payload,'{}');s text:=coalesce(p->>'subject','M1');t text:=coalesce(p->>'track','');
 other uuid;did uuid;aid uuid;d cachaste.duels;a cachaste.attempts;question_row cachaste.questions;profile cachaste.profiles;form cachaste.forms;keys text[];rid uuid;
 choice int;pos int;elapsed bigint;lim int;kind text;week text:=cachaste.season();response jsonb;items jsonb;begin
 if octet_length(p::text)>65536 then raise exception 'PAYLOAD_TOO_LARGE';end if;
 if operation='profile'then
  select to_jsonb(pr)||jsonb_build_object('region',l.region,'region_code',l.region_code,'commune',l.commune)into response from cachaste.profiles pr join cachaste.locations l using(commune_code)where user_id=u;
  return jsonb_build_object('profile',response,'premium',cachaste.premium(u),'season',week);
 elsif operation='save_profile'then
  perform cachaste.rate(u,'profile',10,3600);
  insert into cachaste.profiles(user_id,nickname,commune_code,avatar,public_ranking,allow_challenges,show_commune)
  values(u,btrim(p->>'nickname'),p->>'communeCode',coalesce((p->>'avatar')::smallint,0),coalesce((p->>'publicRanking')::boolean,false),coalesce((p->>'allowChallenges')::boolean,false),coalesce((p->>'showCommune')::boolean,false))
  on conflict(user_id)do update set nickname=excluded.nickname,commune_code=excluded.commune_code,avatar=excluded.avatar,public_ranking=excluded.public_ranking,allow_challenges=excluded.allow_challenges,show_commune=excluded.show_commune,updated_at=now();
  return cachaste.dispatch('profile','{}');
 elsif operation='delete_profile'then
  delete from cachaste.profiles where user_id=u;delete from cachaste.match_queue where user_id=u;
  return jsonb_build_object('deleted',true);
 elsif operation='delete_account'then
  if p->>'confirmation' is distinct from 'ELIMINAR' then raise exception 'CONFIRMATION_REQUIRED';end if;
  if not exists(select 1 from auth.sessions where id::text=auth.jwt()->>'session_id' and user_id=u and created_at>now()-interval '10 minutes')then raise exception 'REAUTHENTICATION_REQUIRED';end if;
  delete from auth.sessions where user_id=u;
  delete from auth.users where id=u;
  return jsonb_build_object('deleted',true);
 end if;
 if not exists(select 1 from cachaste.profiles where user_id=u)then raise exception 'PROFILE_REQUIRED';end if;
 if not cachaste.premium(u)then raise exception 'SUBSCRIPTION_REQUIRED'using errcode='42501';end if;
 if operation='rankings'then return cachaste.rankings(u,p);end if;
 if operation='objectives'then
  perform cachaste.validate_subject(s,t);return jsonb_build_object('objectives',(select jsonb_agg(c order by c)from(select distinct concept c from cachaste.pool(s,t))v));
 end if;
 if operation='block'then
  other:=(p->>'userId')::uuid;insert into cachaste.blocks values(u,other)on conflict do nothing;return jsonb_build_object('blocked',true);
 elsif operation='dashboard'then
  perform cachaste.validate_subject(s,t);
  for d in select * from cachaste.duels where u in(creator,opponent)and status='active'order by id limit 20 loop perform cachaste.settle(d.id);end loop;
  update cachaste.duels set status='expired'where u in(creator,opponent)and status='invited'and expires_at<=now();
  select coalesce(jsonb_agg(cachaste.duel_view(v.id,u)order by v.created_at desc),'[]')into items from(select id,created_at from cachaste.duels where u in(creator,opponent)order by created_at desc limit 20)v;
  return jsonb_build_object('duels',items,'season',week,'stats',coalesce((select to_jsonb(v)from cachaste.stats v where user_id=u and subject=s and track=t and season=week),'{}'),
   'history',coalesce((select to_jsonb(v)from cachaste.stats v where user_id=u and subject=s and track=t and season='all'),'{}'));
 elsif operation='create_duel'then
  perform cachaste.validate_subject(s,t);rid:=(p->>'requestId')::uuid;
  if rid is null then raise exception 'REQUEST_ID_REQUIRED';end if;
  -- Reuse a creation UUID on network retries; prevents duplicated invitations.
  select id into did from cachaste.duels where id=rid and creator=u;if did is not null then return cachaste.duel_view(did,u);end if;
  perform cachaste.rate(u,'challenge',10,86400);
  if nullif(p->>'nickname','')is not null then
   select user_id into other from cachaste.profiles where lower(nickname)=lower(btrim(p->>'nickname'))and allow_challenges;
   if other is null or not cachaste.premium(other)then raise exception 'RIVAL_UNAVAILABLE';end if;
   if other=u then raise exception 'SELF_DUEL';end if;
   if exists(select 1 from cachaste.blocks where(owner_id=u and blocked_id=other)or(owner_id=other and blocked_id=u))then raise exception 'RIVAL_UNAVAILABLE';end if;
   perform pg_advisory_xact_lock(hashtextextended(least(u::text,other::text)||greatest(u::text,other::text)||week,0));
   if exists(select 1 from cachaste.duels where creator in(u,other)and opponent in(u,other)and created_at>now()-interval '24 hours')then raise exception 'PAIR_LIMIT';end if;
  end if;
  insert into cachaste.duels(id,creator,opponent,subject,track,season)values(rid,u,other,s,t,week)returning id into did;
  return cachaste.duel_view(did,u);
 elsif operation='join_code'then
  perform cachaste.rate(u,'code',10,3600);
  select * into d from cachaste.duels where code=upper(replace(btrim(p->>'code'),'-',''))and expires_at>now()for update;
  if found and d.opponent=u and d.status='active'then return cachaste.duel_view(d.id,u);end if;
  if not found or d.status<>'invited' or (d.opponent is not null and d.opponent<>u)then raise exception 'INVITATION_UNAVAILABLE';end if;
  if d.creator=u then raise exception 'SELF_DUEL';end if;
  if not cachaste.premium(d.creator)or exists(select 1 from cachaste.blocks where(owner_id=u and blocked_id=d.creator)or(owner_id=d.creator and blocked_id=u))then raise exception 'RIVAL_UNAVAILABLE';end if;
  perform pg_advisory_xact_lock(hashtextextended(least(u::text,d.creator::text)||greatest(u::text,d.creator::text)||week,0));
  if exists(select 1 from cachaste.duels where id<>d.id and creator in(u,d.creator)and opponent in(u,d.creator)and created_at>now()-interval '24 hours')then raise exception 'PAIR_LIMIT';end if;
  update cachaste.duels set opponent=u where id=d.id;perform cachaste.activate_duel(d.id);return cachaste.duel_view(d.id,u);
 elsif operation in('accept','decline')then
  did:=(p->>'duelId')::uuid;select * into d from cachaste.duels where id=did and opponent=u for update;
  if not found then raise exception 'NOT_FOUND';end if;
  if operation='decline'then update cachaste.duels set status='declined'where id=did and status='invited';
  elsif d.status='invited'then
   if not cachaste.premium(d.creator)or exists(select 1 from cachaste.blocks where(owner_id=u and blocked_id=d.creator)or(owner_id=d.creator and blocked_id=u))then raise exception 'RIVAL_UNAVAILABLE';end if;
   perform cachaste.activate_duel(did);
  end if;return cachaste.duel_view(did,u);
 elsif operation='random'then
  perform cachaste.validate_subject(s,t);perform cachaste.rate(u,'random',12,3600);
  perform pg_advisory_xact_lock(hashtextextended(s||t||'match',0));
  select id into did from cachaste.duels where u in(creator,opponent)and status='active'and subject=s and track=t and created_at>now()-interval '5 minutes'order by created_at desc limit 1;
  if did is not null then return cachaste.duel_view(did,u);end if;
  delete from cachaste.match_queue where expires_at<=now();
  select mq.user_id into other from cachaste.match_queue mq join cachaste.profiles pr on pr.user_id=mq.user_id where mq.subject=s and mq.track=t and mq.user_id<>u and pr.allow_challenges and cachaste.premium(mq.user_id)
  and not exists(select 1 from cachaste.blocks where(owner_id=u and blocked_id=mq.user_id)or(owner_id=mq.user_id and blocked_id=u))
  and not exists(select 1 from cachaste.duels where creator in(u,mq.user_id)and opponent in(u,mq.user_id)and created_at>now()-interval '24 hours')order by mq.joined_at limit 1 for update of mq;
  if other is null then
   if not exists(select 1 from cachaste.profiles where user_id=u and allow_challenges)then raise exception 'CHALLENGES_DISABLED';end if;
   insert into cachaste.match_queue(user_id,subject,track)values(u,s,t)on conflict(user_id)do update set subject=excluded.subject,track=excluded.track,expires_at=now()+interval '5 minutes';return jsonb_build_object('waiting',true);
  end if;
  insert into cachaste.duels(creator,opponent,subject,track,season)values(other,u,s,t,week)returning id into did;
  delete from cachaste.match_queue where user_id in(u,other);perform cachaste.activate_duel(did);return cachaste.duel_view(did,u);
 elsif operation='cancel_queue'then delete from cachaste.match_queue where user_id=u;return jsonb_build_object('waiting',false);
 elsif operation='duel'then did:=(p->>'duelId')::uuid;perform cachaste.settle(did);return cachaste.duel_view(did,u);
 elsif operation='create_assessment'then
  perform cachaste.validate_subject(s,t);kind:=p->>'kind';rid:=(p->>'requestId')::uuid;
  if kind not in('exam','express','game')or rid is null then raise exception 'INVALID_ASSESSMENT';end if;
  select id into aid from cachaste.attempts where user_id=u and request_id=rid;if aid is not null then return cachaste.attempt_view(aid,u);end if;
  perform cachaste.rate(u,'assessment',20,86400);
  if kind='game'then
   perform pg_advisory_xact_lock(hashtextextended(u::text||'question-reservations',0));
   select array_agg(key)into keys from(select distinct on(family)key,family from cachaste.pool(s,t)q where concept=p->>'concept' and not exists(select 1 from cachaste.seen v where v.user_id=u and v.question_key=q.key and v.last_seen>now()-interval '14 days')order by family,random()limit 2)v;
   if cardinality(keys) is distinct from 2 then raise exception 'FRESH_POOL_EXHAUSTED';end if;lim:=180;
  else
   perform pg_advisory_xact_lock(hashtextextended(kind||s||t||week,0));
   select * into form from cachaste.forms f where f.kind=dispatch.kind and f.subject=s and f.track=t and f.season=week;
   if not found then
    pos:=case when kind='express'then 15 when s='M2'then 55 when s='Ciencias'then 80 else 65 end;
    lim:=case when kind='express'then 900 when s='M2'then 8400 when s in('M1','Ciencias')then 9000 when s='Lectura'then 9000 else 7200 end;
    -- Each weekly category is ONE immutable form: identical questions, difficulty and time for every ranked participant.
    select array_agg(key order by rn,rnd)into keys from(select key,row_number()over(partition by axis order by random())rn,random()rnd from cachaste.pool(s,t))v;
    keys:=keys[1:pos];if cardinality(keys) is distinct from pos then raise exception 'INSUFFICIENT_BANK';end if;
    insert into cachaste.forms values(kind,s,t,week,keys,lim,kind||'-'||s||'-'||t||'-'||week||'-v1');
    select * into form from cachaste.forms f where f.kind=dispatch.kind and f.subject=s and f.track=t and f.season=week;
   end if;
   keys:=form.question_keys;lim:=form.seconds;
   if exists(select 1 from cachaste.attempts where user_id=u and cachaste.attempts.kind=dispatch.kind and subject=s and track=t and season=week)then raise exception 'WEEKLY_ATTEMPT_USED';end if;
  end if;
  insert into cachaste.attempts(user_id,kind,subject,track,concept,season,category,question_keys,request_id,per_question_seconds)
  values(u,kind,s,t,p->>'concept',week,case when kind='game'then 'game-v1'else form.category end,keys,rid,case when kind='express'then 900 when kind='game'then 90 else lim end)returning id into aid;
  if kind='game'then insert into cachaste.seen(user_id,question_key)select u,k from unnest(keys)k on conflict(user_id,question_key)do update set last_seen=now();end if;
  return cachaste.attempt_view(aid,u);
 elsif operation in('start','attempt','answer','forfeit','review')then
  aid:=(p->>'attemptId')::uuid;
  -- Lock duel BEFORE attempt everywhere. Students cannot reach another player's attempt.
  select duel_id into did from cachaste.attempts where id=aid and user_id=u;
  if did is not null then perform 1 from cachaste.duels where id=did for update;end if;
  select * into a from cachaste.attempts where id=aid and user_id=u for update;if not found then raise exception 'NOT_FOUND';end if;
  if did is not null and not exists(select 1 from cachaste.duels where id=did and status in('active','finished'))then raise exception 'DUEL_UNAVAILABLE';end if;
  if operation='review'then
   if a.status not in('complete','forfeit')or(did is not null and not exists(select 1 from cachaste.duels where id=did and status='finished'))then raise exception 'SOLUTIONS_HIDDEN';end if;
   select coalesce(jsonb_agg(jsonb_build_object('question',q.body,'choice',v.choice,'correct',v.correct,'answer',q.answer)order by v.position),'[]')into response from cachaste.answers v join cachaste.questions q on q.key=v.question_key where v.attempt_id=aid and not v.correct;
   return jsonb_build_object('errors',response);
  end if;
  if operation='start'and a.status='ready'then
   lim:=case when a.kind='duel'then 900 when a.kind='game'then 180 else(select seconds from cachaste.forms f where f.category=a.category)end;
   update cachaste.attempts set status='active',started_at=now(),presented_at=clock_timestamp(),deadline=now()+make_interval(secs=>lim)where id=aid returning * into a;
  end if;
  if a.status='active'and a.deadline<=now()then
   update cachaste.attempts set status=case when kind='duel'then 'forfeit'else 'complete'end,finished_at=now(),elapsed_ms=greatest(elapsed_ms,extract(epoch from(deadline-started_at))*1000)::bigint where id=aid returning * into a;
   perform cachaste.finish_attempt(aid);
  end if;
  if operation='forfeit'and a.status in('ready','active')then
   update cachaste.attempts set status='forfeit',finished_at=now(),elapsed_ms=900000 where id=aid returning * into a;
  elsif operation='answer'then
   rid:=(p->>'requestId')::uuid;pos:=(p->>'position')::int;choice:=(p->>'choice')::int;
   if rid is null then raise exception 'REQUEST_ID_REQUIRED';end if;
   if exists(select 1 from cachaste.answers where attempt_id=aid and request_id=rid)then return cachaste.attempt_view(aid,u);end if;
   if a.status<>'active'or pos<>a.position then raise exception 'ANSWER_OUT_OF_ORDER';end if;
   select * into question_row from cachaste.questions where key=a.question_keys[a.position+1];
   if choice is not null and(choice<0 or choice>=jsonb_array_length(question_row.body->'options'))then raise exception 'INVALID_CHOICE';end if;
   elapsed:=least(a.per_question_seconds*1000,greatest(1000,floor(extract(epoch from(clock_timestamp()-a.presented_at)))*1000))::bigint;
   if clock_timestamp()>least(a.deadline,a.presented_at+make_interval(secs=>a.per_question_seconds))then choice:=null;end if;
   insert into cachaste.answers(attempt_id,position,question_key,choice,correct,elapsed_ms,request_id)values(aid,pos,question_row.key,choice,coalesce(choice=question_row.answer,false),elapsed,rid);
   update cachaste.attempts set position=position+1,correct=correct+case when choice=question_row.answer then 1 else 0 end,elapsed_ms=elapsed_ms+elapsed,presented_at=clock_timestamp(),
    status=case when position+1=cardinality(question_keys)then 'complete'else status end,finished_at=case when position+1=cardinality(question_keys)then now()end where id=aid returning * into a;
   perform cachaste.finish_attempt(aid);
  end if;
  if a.status='active'then
   insert into cachaste.seen(user_id,question_key)values(u,a.question_keys[a.position+1])on conflict(user_id,question_key)do update set last_seen=now();
  end if;
  if did is not null then perform cachaste.settle(did);end if;
  return cachaste.attempt_view(aid,u);
 elsif operation='education'then
  return jsonb_build_object('stars',coalesce((select sum(stars)from cachaste.education where user_id=u),0),'objectives',coalesce((select jsonb_agg(v)from(select subject,concept,stars from cachaste.education where user_id=u)v),'[]'));
 end if;
 raise exception 'UNKNOWN_OPERATION';
end$$;

create function cachaste.health()returns jsonb language sql stable security definer set search_path='' as $$select jsonb_build_object('apiVersion',1,'catalogueReady',(select count(*)>=802 from cachaste.questions))$$;
create function public.cachaste_competition_health()returns jsonb language sql security invoker set search_path='' as $$select cachaste.health()$$;
create function public.cachaste_competition(operation text,payload jsonb default '{}')returns jsonb language sql security invoker set search_path='' as $$select cachaste.dispatch(operation,payload)$$;
revoke all on all functions in schema cachaste from public,anon,authenticated;
grant usage on schema cachaste to anon;
grant execute on function cachaste.health()to anon,authenticated;
revoke all on function public.cachaste_competition_health()from public;
grant execute on function public.cachaste_competition_health()to anon,authenticated;
grant execute on function cachaste.dispatch(text,jsonb)to authenticated;
revoke all on function public.cachaste_competition(text,jsonb)from public,anon;
grant execute on function public.cachaste_competition(text,jsonb)to authenticated;
grant all on all tables in schema cachaste to service_role;
-- Future functions/tables remain private unless explicitly reviewed and granted.
alter default privileges in schema cachaste revoke all on tables from public,anon,authenticated;
alter default privileges in schema cachaste revoke all on functions from public,anon,authenticated;
commit;
