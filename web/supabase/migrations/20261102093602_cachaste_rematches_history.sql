-- Unlimited completed rematches; pending/active duplicates and request replay remain protected.
-- Patch only the existing private engine, preserving community/Auth checks and deployed fixes.
begin;
do $migration$
declare source text; old text; replacement text;
begin
 source:=pg_get_functiondef('cachaste.dispatch_before_community(text,jsonb)'::regprocedure);
 old:=$old$created_at>now()-interval '24 hours'$old$;
 if (length(source)-length(replace(source,old,'')))/length(old)<>3 then raise exception 'Unexpected pair guard definition';end if;
 source:=replace(source,old,$new$status in('invited','active') and expires_at>now() and subject=s and track=t$new$);
 source:=replace(source,$old$perform cachaste.rate(u,'challenge',10,86400);$old$,$new$perform cachaste.rate(u,'challenge',30,60);$new$);
 source:=replace(source,$old$perform cachaste.rate(u,'code',10,3600);$old$,$new$perform cachaste.rate(u,'code',30,60);$new$);
 source:=replace(source,$old$perform cachaste.rate(u,'random',12,3600);$old$,$new$perform cachaste.rate(u,'random',30,60);$new$);
 -- Code invitations carry their own subject; the caller need not submit it.
 source:=replace(source,$old$if d.creator=u then raise exception 'SELF_DUEL';end if;$old$,$new$if d.creator=u then raise exception 'SELF_DUEL';end if;s:=d.subject;t:=d.track;$new$);
 old:=$old$if operation='rankings'then return cachaste.rankings(u,p);end if;$old$;
 if position(old in source)=0 then raise exception 'Unexpected dispatcher definition';end if;
 source:=replace(source,old,$new$if operation='duel_history'then return cachaste.duel_history(u,p);end if;
 if operation='rankings'then return cachaste.rankings(u,p);end if;$new$);
 execute source;
end $migration$;

-- Invoked only through the authenticated, community-checked dispatcher above.
create function cachaste.duel_history(u uuid,p jsonb) returns jsonb language plpgsql set search_path='' as $$
declare page jsonb; cursor_value jsonb; rival uuid:=nullif(p->>'rivalId','')::uuid;
 before_time timestamptz:=(p->'before'->>'createdAt')::timestamptz;
 before_id uuid:=(p->'before'->>'id')::uuid; summary jsonb;
begin
 if u is distinct from auth.uid() then raise exception 'AUTH_REQUIRED';end if;
 if (before_time is null)<>(before_id is null) then raise exception 'INVALID_FILTER';end if;
 with rows as (
  select d.id,d.created_at from cachaste.duels d
  where u in(d.creator,d.opponent) and d.status in('finished','cancelled','declined','expired')
   and (rival is null or rival in(d.creator,d.opponent))
   and (before_time is null or (d.created_at,d.id)<(before_time,before_id))
  order by d.created_at desc,d.id desc limit 21
 ), visible as (select * from rows order by created_at desc,id desc limit 20)
 select coalesce((select jsonb_agg(cachaste.duel_view(v.id,u) order by v.created_at desc,v.id desc)from visible v),'[]'::jsonb),
 case when (select count(*)from rows)>20 then (select jsonb_build_object('createdAt',v.created_at,'id',v.id)from visible v order by v.created_at,v.id limit 1)end
 into page,cursor_value;
 select jsonb_build_object('played',count(*),'wins',count(*)filter(where winner=u),
  'losses',count(*)filter(where winner is not null and winner<>u),'draws',count(*)filter(where winner is null))
 into summary from cachaste.duels d where u in(d.creator,d.opponent)and status='finished'
  and(rival is null or rival in(d.creator,d.opponent));
 return jsonb_build_object('duels',page,'next',cursor_value,'summary',summary);
end $$;
revoke all on function cachaste.duel_history(uuid,jsonb) from public,anon,authenticated;

create or replace function cachaste.activate_duel(did uuid) returns void language plpgsql set search_path='' as $$
declare d cachaste.duels; keys text[]; u uuid;
begin
 select * into d from cachaste.duels where id=did for update;
 if d.status<>'invited' or d.opponent is null or d.expires_at<=now() then raise exception 'INVITATION_UNAVAILABLE';end if;
 perform pg_advisory_xact_lock(hashtextextended(least(d.creator::text,d.opponent::text)||greatest(d.creator::text,d.opponent::text)||d.season,0));
 if exists(select 1 from cachaste.duels x where x.id<>d.id and x.creator in(d.creator,d.opponent)
  and x.opponent in(d.creator,d.opponent)and x.subject=d.subject and x.track=d.track and x.status='active'and x.expires_at>now())then raise exception 'PAIR_LIMIT';end if;
 for u in select x from unnest(array[d.creator,d.opponent])x order by x loop perform pg_advisory_xact_lock(hashtextextended(u::text||'question-reservations',0));end loop;
 -- Prefer never-seen questions, then least recently seen. Avoid the preceding duel when the pool permits.
 -- Reuse is necessary for unlimited play with a finite bank; never repeat a family within one duel.
 with previous as (
  select question_keys from cachaste.duels x where x.id<>d.id and x.creator in(d.creator,d.opponent)
   and x.opponent in(d.creator,d.opponent)and x.subject=d.subject and x.track=d.track
   and cardinality(x.question_keys)=10 order by x.created_at desc,x.id desc limit 1
 ), candidates as (
  select q.key,q.family,q.key=any(coalesce((select question_keys from previous),'{}'::text[]))recent,
   (select max(last_seen)from cachaste.seen v where v.user_id in(d.creator,d.opponent)and v.question_key=q.key)seen_at
  from cachaste.pool(d.subject,d.track)q
 ), families as (
  select distinct on(family)* from candidates order by family,recent,seen_at nulls first,random()
 ), picked as (select key from families order by recent,seen_at nulls first,random() limit 10)
 select array_agg(key order by random())into keys from picked;
 if cardinality(keys) is distinct from 10 then raise exception 'INSUFFICIENT_BANK';end if;
 update cachaste.duels set question_keys=keys,status='active' where id=did;
 foreach u in array array[d.creator,d.opponent] loop
  insert into cachaste.attempts(user_id,duel_id,kind,subject,track,season,category,question_keys,request_id)
  values(u,did,'duel',d.subject,d.track,d.season,'duel10-v1',keys,gen_random_uuid());
  insert into cachaste.seen(user_id,question_key)select u,k from unnest(keys)k on conflict(user_id,question_key)do update set last_seen=now();
 end loop;
end$$;
commit;
