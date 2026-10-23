-- Community consent and private moderation queue; no users, reports or permissions are seeded.
begin;
alter table cachaste.profiles add column community_version text;
alter table cachaste.profiles add column community_accepted_at timestamptz;
alter table cachaste.profiles add column moderation_status text not null default 'active' check(moderation_status in('active','suspended'));
create table cachaste.community_restrictions(user_id uuid primary key references auth.users(id)on delete cascade,restricted_at timestamptz not null default now());
alter table cachaste.community_restrictions enable row level security;
revoke all on cachaste.community_restrictions from public,anon,authenticated;
grant all on cachaste.community_restrictions to service_role;
create table cachaste.reports(
 id uuid primary key default gen_random_uuid(),
 reporter_id uuid not null references auth.users(id) on delete cascade,
 target_id uuid not null references auth.users(id) on delete cascade,
 reason text not null check(reason in('nickname','harassment','impersonation','other')),
 nickname_snapshot text not null,
 status text not null default 'pending' check(status in('pending','reviewed','dismissed')),
 created_at timestamptz not null default now(),reviewed_at timestamptz,
 check(reporter_id<>target_id)
);
create unique index reports_pending_unique on cachaste.reports(reporter_id,target_id,reason)where status='pending';
create index reports_pending_queue on cachaste.reports(created_at)where status='pending';
create index reports_target on cachaste.reports(target_id);
alter table cachaste.reports enable row level security;
revoke all on cachaste.reports from public,anon,authenticated;
grant all on cachaste.reports to service_role;

-- Keep the original transaction engine private. The new dispatcher verifies Auth first,
-- handles privacy/safety without a subscription, then enforces community consent.
alter function cachaste.dispatch(text,jsonb)rename to dispatch_before_community;
revoke all on function cachaste.dispatch_before_community(text,jsonb)from public,anon,authenticated;
create function cachaste.dispatch(operation text,payload jsonb default '{}')returns jsonb
language plpgsql security definer set search_path='' as $$
declare u uuid:=cachaste.require_user();p jsonb:=coalesce(payload,'{}');own cachaste.profiles;
 target uuid;nickname text;report_reason text;accepted timestamptz;result jsonb;
begin
 if octet_length(p::text)>65536 then raise exception 'PAYLOAD_TOO_LARGE';end if;
 if operation in('profile','delete_profile','delete_account')then return cachaste.dispatch_before_community(operation,p);end if;
 if operation='blocked_users'then
  select coalesce(jsonb_agg(v order by v.nickname),'[]'::jsonb)into result from(
   select b.blocked_id id,pr.nickname,pr.avatar from cachaste.blocks b join cachaste.profiles pr on pr.user_id=b.blocked_id where b.owner_id=u order by pr.nickname limit 1000
  )v;return jsonb_build_object('users',result);
 end if;
 if operation in('block','unblock','report')then
  target:=(p->>'userId')::uuid;
  if target is null or target=u or not exists(select 1 from cachaste.profiles where user_id=target)then raise exception 'INVALID_PLAYER';end if;
  if operation='block'then
   perform cachaste.rate(u,'block',30,3600);
   insert into cachaste.blocks(owner_id,blocked_id)values(u,target)on conflict do nothing;
   update cachaste.duels set status='cancelled'where status='invited'and((creator=u and opponent=target)or(creator=target and opponent=u));
   return jsonb_build_object('blocked',true);
  elsif operation='unblock'then
   delete from cachaste.blocks where owner_id=u and blocked_id=target;
   return jsonb_build_object('blocked',false);
  else
   report_reason:=p->>'reason';
   if report_reason is null or report_reason not in('nickname','harassment','impersonation','other')then raise exception 'INVALID_REPORT_REASON';end if;
   if exists(select 1 from cachaste.reports where reporter_id=u and target_id=target and cachaste.reports.reason=report_reason and status='pending')then return jsonb_build_object('reported',true);end if;
   perform cachaste.rate(u,'report',5,3600);
   select pr.nickname into nickname from cachaste.profiles pr where user_id=target;
   insert into cachaste.reports(reporter_id,target_id,reason,nickname_snapshot)values(u,target,report_reason,nickname)on conflict do nothing;
   return jsonb_build_object('reported',true);
  end if;
 end if;
 select * into own from cachaste.profiles where user_id=u;
 if exists(select 1 from cachaste.community_restrictions where user_id=u)or own.moderation_status='suspended'then raise exception 'ACCOUNT_RESTRICTED';end if;
 if operation='save_profile'then
  if p->>'communityVersion'='2026-10-23'then
   accepted:=case when own.community_version='2026-10-23'then coalesce(own.community_accepted_at,now())else now()end;
  elsif own.community_version='2026-10-23'and own.community_accepted_at is not null and not(p?'communityVersion')then
   accepted:=own.community_accepted_at;
  else raise exception 'COMMUNITY_REQUIRED';end if;
  perform cachaste.rate(u,'profile',10,3600);
  insert into cachaste.profiles(user_id,nickname,commune_code,avatar,public_ranking,allow_challenges,show_commune,community_version,community_accepted_at)
  values(u,btrim(p->>'nickname'),p->>'communeCode',coalesce((p->>'avatar')::smallint,0),coalesce((p->>'publicRanking')::boolean,false),coalesce((p->>'allowChallenges')::boolean,false),coalesce((p->>'showCommune')::boolean,false),'2026-10-23',accepted)
  on conflict(user_id)do update set nickname=excluded.nickname,commune_code=excluded.commune_code,avatar=excluded.avatar,public_ranking=excluded.public_ranking,allow_challenges=excluded.allow_challenges,show_commune=excluded.show_commune,community_version=excluded.community_version,community_accepted_at=excluded.community_accepted_at,updated_at=now();
  return cachaste.dispatch_before_community('profile','{}');
 end if;
 if own.user_id is not null and(own.community_version is distinct from '2026-10-23'or own.community_accepted_at is null)then raise exception 'COMMUNITY_REQUIRED';end if;
 return cachaste.dispatch_before_community(operation,p);
end$$;
revoke all on function cachaste.dispatch(text,jsonb)from public,anon,authenticated;
grant execute on function cachaste.dispatch(text,jsonb)to authenticated;
-- Reparse the invoker wrapper so no cached reference can keep using the old dispatcher.
create or replace function public.cachaste_competition(operation text,payload jsonb default '{}')returns jsonb language sql security invoker set search_path='' as $$select cachaste.dispatch(operation,payload)$$;
revoke all on function public.cachaste_competition(text,jsonb)from public,anon;
grant execute on function public.cachaste_competition(text,jsonb)to authenticated;

create or replace function cachaste.person(u uuid)returns jsonb language sql stable set search_path='' as $$
 select case when exists(select 1 from cachaste.blocks b where(b.owner_id=auth.uid()and b.blocked_id=u)or(b.owner_id=u and b.blocked_id=auth.uid()))
 then jsonb_build_object('id',p.user_id,'nickname','Estudiante bloqueado','avatar',0,'region','','commune','','blocked',true)
 else jsonb_build_object('id',p.user_id,'nickname',p.nickname,'avatar',p.avatar,'region',l.region,'commune',case when p.show_commune then l.commune else 'Comuna privada'end)end
 from cachaste.profiles p join cachaste.locations l using(commune_code)where p.user_id=u
$$;

create or replace function cachaste.rankings(u uuid,p jsonb)returns jsonb language plpgsql set search_path='' as $$
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
  where pr.public_ranking and pr.moderation_status='active' and pr.community_version='2026-10-23' and (week<>cachaste.season()or cachaste.premium(pr.user_id))and(scope='Chile'or(scope='Región'and l.region_code=geo.region_code)or(scope='Comuna'and l.commune_code=geo.commune_code))
 ), positioned as(select *,rank()over(order by value desc)position from visible),shown as(select * from positioned v where not exists(select 1 from cachaste.blocks b where(b.owner_id=u and b.blocked_id=v.user_id)or(b.owner_id=v.user_id and b.blocked_id=u))),mine as(select position from positioned where user_id=u)
 select jsonb_build_object('top',coalesce((select jsonb_agg(v order by v.position,v.nickname)from(select * from shown order by position,nickname limit 10)v),'[]'::jsonb),
 'me',(select to_jsonb(v)from shown v where user_id=u),'nearby',coalesce((select jsonb_agg(v order by v.position,v.nickname)from(select * from shown where user_id<>u and position between greatest(1,coalesce((select position from mine),1)-3)and coalesce((select position from mine),1)+1 limit 5)v),'[]'::jsonb),
 'category',category,'season',week,'scope',scope,'participating',me.public_ranking)into response;
 return response;
end$$;

-- A private operator restriction immediately removes invitations and matchmaking.
create function cachaste.apply_community_restriction()returns trigger language plpgsql set search_path='' as $$
begin
 if new.moderation_status='suspended'then
  insert into cachaste.community_restrictions(user_id)values(new.user_id)on conflict do nothing;
  new.public_ranking:=false;new.allow_challenges:=false;
  delete from cachaste.match_queue where user_id=new.user_id;
  update cachaste.duels set status='cancelled'where status='invited'and new.user_id in(creator,opponent);
 elsif old.moderation_status='suspended'and new.moderation_status='active'then
  delete from cachaste.community_restrictions where user_id=new.user_id;
 end if;
 return new;
end$$;
revoke all on function cachaste.apply_community_restriction()from public,anon,authenticated;
create trigger community_restriction before update on cachaste.profiles for each row when(old.moderation_status is distinct from new.moderation_status or new.moderation_status='suspended')execute function cachaste.apply_community_restriction();

commit;
