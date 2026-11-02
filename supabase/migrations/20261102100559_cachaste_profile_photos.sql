-- One optional public 256px WebP per account. No transforms, original photos, gallery or paid service.
begin;
create table cachaste.profile_photos(
 user_id uuid primary key references auth.users(id)on delete cascade,
 updated_at timestamptz not null default now(),enabled boolean not null default true
);
alter table cachaste.profile_photos enable row level security;
revoke all on cachaste.profile_photos from public,anon,authenticated;
grant all on cachaste.profile_photos to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('cachaste-profile-photos','cachaste-profile-photos',true,32768,array['image/webp']);

create function cachaste.photo_version(u uuid)returns timestamptz language sql stable set search_path='' as $$
 select updated_at from cachaste.profile_photos where user_id=u and enabled
$$;
revoke all on function cachaste.photo_version(uuid)from public,anon,authenticated;

-- Policy helper exposes only this caller's write eligibility; no profile data or access tokens.
create function cachaste.can_write_photo(object_name text)returns boolean language plpgsql security definer set search_path='' as $$
declare u uuid:=cachaste.require_user();begin
 return object_name=u::text||'/avatar.webp'
  and exists(select 1 from cachaste.profiles where user_id=u and community_version='2026-10-23'and moderation_status='active')
  and not exists(select 1 from cachaste.community_restrictions where user_id=u)
  and not exists(select 1 from cachaste.profile_photos where user_id=u and updated_at>now()-interval '7 days');
end $$;
revoke all on function cachaste.can_write_photo(text)from public,anon;
grant execute on function cachaste.can_write_photo(text)to authenticated;
create function cachaste.can_manage_photo(object_name text)returns boolean language plpgsql security definer set search_path='' as $$
 begin return object_name=cachaste.require_user()::text||'/avatar.webp';end $$;
revoke all on function cachaste.can_manage_photo(text)from public,anon;
grant execute on function cachaste.can_manage_photo(text)to authenticated;
create policy cachaste_photo_insert on storage.objects for insert to authenticated
 with check(bucket_id='cachaste-profile-photos'and cachaste.can_write_photo(name));
create policy cachaste_photo_select_own on storage.objects for select to authenticated
 using(bucket_id='cachaste-profile-photos'and cachaste.can_manage_photo(name));
create policy cachaste_photo_update on storage.objects for update to authenticated
 using(bucket_id='cachaste-profile-photos'and cachaste.can_write_photo(name))
 with check(bucket_id='cachaste-profile-photos'and cachaste.can_write_photo(name));
create policy cachaste_photo_delete on storage.objects for delete to authenticated
 using(bucket_id='cachaste-profile-photos'and cachaste.can_manage_photo(name));

-- Observe Storage API commits; never delete Storage rows through application SQL.
-- Storage permission probes may have no size metadata and are rolled back by Storage.
create function cachaste.record_photo()returns trigger language plpgsql security definer set search_path='' as $$
declare u uuid;begin
 if TG_OP='DELETE'then
  update cachaste.profile_photos set enabled=false where user_id=split_part(old.name,'/',1)::uuid;
  return old;
 end if;
 -- Storage commits object metadata with its server connection, after its RLS permission probe.
 -- Use Storage's assigned owner here; finalization need not carry the caller's JWT.
 u:=split_part(new.name,'/',1)::uuid;
 if new.owner_id is distinct from u::text or new.name<>u::text||'/avatar.webp'then raise exception 'INVALID_PHOTO';end if;
 perform pg_advisory_xact_lock(hashtextextended(u::text||'profile-photo',0));
 if not exists(select 1 from cachaste.profiles where user_id=u and community_version='2026-10-23'and moderation_status='active')or exists(select 1 from cachaste.community_restrictions where user_id=u)then raise exception 'PROFILE_REQUIRED';end if;
 if exists(select 1 from cachaste.profile_photos where user_id=u and updated_at>now()-interval '7 days')then raise exception 'PHOTO_COOLDOWN';end if;
 if new.metadata->>'size' is null then return new;end if;
 if (new.metadata->>'size')::bigint not between 1 and 32768 or new.metadata->>'mimetype' is distinct from 'image/webp'then raise exception 'INVALID_PHOTO';end if;
 insert into cachaste.profile_photos(user_id,updated_at,enabled)values(u,clock_timestamp(),true)
 on conflict(user_id)do update set updated_at=excluded.updated_at,enabled=true;
 return new;
end $$;
revoke all on function cachaste.record_photo()from public,anon,authenticated;
create trigger cachaste_photo_written after insert or update on storage.objects
 for each row when(new.bucket_id='cachaste-profile-photos')execute function cachaste.record_photo();
create trigger cachaste_photo_removed after delete on storage.objects
 for each row when(old.bucket_id='cachaste-profile-photos')execute function cachaste.record_photo();

-- Preserve all existing authorization, moderation, duel and ranking logic.
do $migration$
declare source text;old text;begin
 source:=pg_get_functiondef('cachaste.dispatch(text,jsonb)'::regprocedure);
 old:=$old$if operation in('profile','delete_profile','delete_account')then$old$;
 if position(old in source)=0 then raise exception 'Unexpected community dispatcher';end if;
 source:=replace(source,old,$new$if operation='photo_status'then
  return jsonb_build_object('photoVersion',cachaste.photo_version(u),'canUpload',cachaste.can_write_photo(u::text||'/avatar.webp'),
   'nextChangeAt',(select updated_at+interval '7 days'from cachaste.profile_photos where user_id=u),'serverNow',clock_timestamp());
 end if;
 if operation in('profile','delete_profile','delete_account')then$new$);execute source;
 source:=pg_get_functiondef('cachaste.dispatch_before_community(text,jsonb)'::regprocedure);
 old:=$old$to_jsonb(pr)||jsonb_build_object('region'$old$;
 if position(old in source)=0 then raise exception 'Unexpected profile serializer';end if;
 source:=replace(source,old,$new$to_jsonb(pr)||jsonb_build_object('photoVersion',cachaste.photo_version(u),'region'$new$);execute source;
 source:=pg_get_functiondef('cachaste.person(uuid)'::regprocedure);
 old:=$old$'nickname',p.nickname,'avatar',p.avatar,$old$;
 if position(old in source)=0 then raise exception 'Unexpected person serializer';end if;
 source:=replace(source,old,$new$'nickname',p.nickname,'avatar',p.avatar,'photoVersion',cachaste.photo_version(u),$new$);execute source;
 source:=pg_get_functiondef('cachaste.rankings(uuid,jsonb)'::regprocedure);
 old:='pr.nickname,pr.avatar,l.region';
 if position(old in source)=0 then raise exception 'Unexpected ranking serializer';end if;
 source:=replace(source,old,'pr.nickname,pr.avatar,cachaste.photo_version(pr.user_id) as "photoVersion",l.region');execute source;
end $migration$;
commit;
