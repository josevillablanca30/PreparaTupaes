-- Opt-in Basic eligibility for Duelos 2.0. OFF by default.
-- Must not be enabled until server-enforced educational access and admission tests pass.
create table if not exists cachaste_web.basic_feature_flags(
 id boolean primary key default true check(id),
 duel_admission_enabled boolean not null default false
);
insert into cachaste_web.basic_feature_flags(id,duel_admission_enabled)
values(true,false) on conflict(id) do nothing;
revoke all on cachaste_web.basic_feature_flags from public,anon,authenticated;
grant select on cachaste_web.basic_feature_flags to service_role;

create or replace function cachaste_web.basic_duels_enabled()
returns boolean language sql stable security definer set search_path='' as $$
 select coalesce((select duel_admission_enabled from cachaste_web.basic_feature_flags where id=true),false)
$$;
revoke all on function cachaste_web.basic_duels_enabled() from public,anon,authenticated;
grant execute on function cachaste_web.basic_duels_enabled() to authenticated,service_role;

create or replace function cachaste_duels2.eligible(u uuid)
returns boolean language sql stable set search_path='' as $$
 select exists(
  select 1 from cachaste.profiles p where p.user_id=u
   and p.moderation_status='active'
   and p.community_version='2026-10-23'
   and p.community_accepted_at is not null
 ) and not exists(
  select 1 from cachaste.community_restrictions where user_id=u
 ) and (cachaste.premium(u) or cachaste_web.basic_duels_enabled())
$$;

create or replace function cachaste_duels2.require_player()
returns uuid language plpgsql set search_path='' as $$
declare
 u uuid:=cachaste.require_user();
 p cachaste.profiles;
 basic_used integer;
begin
 select * into p from cachaste.profiles where user_id=u;
 if not found then raise exception 'PROFILE_REQUIRED';end if;
 if p.moderation_status='suspended' or exists(
  select 1 from cachaste.community_restrictions where user_id=u
 ) then raise exception 'ACCOUNT_RESTRICTED';end if;
 if p.community_version is distinct from '2026-10-23' or p.community_accepted_at is null
 then raise exception 'COMMUNITY_REQUIRED';end if;
 if not cachaste.premium(u) then
  if not cachaste_web.basic_duels_enabled() then
   raise exception 'SUBSCRIPTION_REQUIRED' using errcode='42501';
  end if;
  -- Early user-facing rejection; the activation trigger is the authoritative
  -- concurrent reservation and repeats this check under the per-user lock.
  select count(*)::integer into basic_used from cachaste_web.basic_usage q
   where q.user_id=u and q.kind='duel' and q.subject='all'
    and q.usage_day=(now() at time zone 'America/Santiago')::date;
  if basic_used>=2 then
   raise exception 'BASIC_DUEL_LIMIT_REACHED' using errcode='42501';
  end if;
 end if;
 return u;
end$$;
