-- Basic read-only progress, disabled until educational gates are integrated.
-- This does not permit Basic users to submit client-authored lesson completions.
alter table cachaste_web.basic_feature_flags
 add column if not exists progress_snapshot_enabled boolean not null default false;
create or replace function cachaste_web.basic_progress_snapshot_enabled()
returns boolean language sql stable security definer set search_path='' as $$
 select coalesce((select progress_snapshot_enabled from cachaste_web.basic_feature_flags where id=true),false)
$$;
revoke all on function cachaste_web.basic_progress_snapshot_enabled() from public,anon,authenticated;
grant execute on function cachaste_web.basic_progress_snapshot_enabled() to authenticated,service_role;

create or replace function cachaste_web.progress(operation text,payload jsonb default '{}')returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=cachaste.require_user();k text:=payload->>'key';doc cachaste_web.learning_documents;size_bytes bigint;response jsonb;
begin
 if not cachaste.premium(u) then
  -- Basic may only read its existing snapshot when the DB flag is enabled.
  -- Client-authored progress writes remain Premium-only until attested completions exist.
  if operation<>'snapshot' or not cachaste_web.basic_progress_snapshot_enabled() then
   raise exception 'SUBSCRIPTION_REQUIRED' using errcode='42501';
  end if;
 end if;
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
end$$;
