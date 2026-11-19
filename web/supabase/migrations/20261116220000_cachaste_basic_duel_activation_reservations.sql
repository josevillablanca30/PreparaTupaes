-- Reserve Basic duel quota in the authoritative match activation transaction.
-- Not applied to production. Admission remains premium-only until the entire Basic flow is ready.
-- A failed reservation aborts activation and rolls back both ledger and match changes.
create or replace function cachaste_web.reserve_basic_duel_activation()
returns trigger language plpgsql security definer set search_path='' as $$
declare
 u uuid;
 today_chile date:=(now() at time zone 'America/Santiago')::date;
 used_count integer;
 existing cachaste_web.basic_usage%rowtype;
begin
 if new.status is distinct from 'active' or old.status is distinct from 'invited' then
  return new;
 end if;
 if new.id is null or new.creator is null or new.opponent_kind not in ('human','bot') then
  raise exception 'INVALID_DUEL_ACTIVATION' using errcode='22023';
 end if;
 if new.opponent_kind='human' and (new.opponent is null or new.opponent=new.creator) then
  raise exception 'INVALID_DUEL_PARTICIPANTS' using errcode='22023';
 end if;
 -- Stable user ordering avoids deadlocks for two concurrent human duels.
 for u in select distinct x.user_id from
  (select new.creator as user_id union all
   select new.opponent where new.opponent_kind='human') x
  where x.user_id is not null order by x.user_id
 loop
  perform pg_advisory_xact_lock(hashtextextended('basic-completion:'||u::text,0));
  -- Premium never consumes a Basic quota.
  if not cachaste.premium(u) then
   select * into existing from cachaste_web.basic_usage q
    where q.user_id=u and q.event_id=new.id;
   if found then
    if existing.kind<>'duel' or existing.subject<>'all' then
     raise exception 'EVENT_ID_REUSED' using errcode='23505';
    end if;
   else
    select count(*)::integer into used_count from cachaste_web.basic_usage q
     where q.user_id=u and q.kind='duel' and q.subject='all'
      and q.usage_day=today_chile;
    if used_count>=2 then
     raise exception 'BASIC_DUEL_LIMIT_REACHED' using errcode='42501';
    end if;
    insert into cachaste_web.basic_usage(user_id,kind,subject,usage_day,event_id)
     values(u,'duel','all',today_chile,new.id);
   end if;
  end if;
 end loop;
 return new;
end$$;
revoke all on function cachaste_web.reserve_basic_duel_activation() from public,anon,authenticated;
drop trigger if exists cachaste_basic_duel_activation on cachaste_duels2.matches;
create trigger cachaste_basic_duel_activation
before update of status on cachaste_duels2.matches
for each row when (old.status is distinct from new.status and new.status='active')
execute function cachaste_web.reserve_basic_duel_activation();
