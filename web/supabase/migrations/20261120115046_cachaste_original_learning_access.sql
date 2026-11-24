-- Prepared only. No production activation. Reuses the original educational engine/catalogue.
alter table cachaste_web.basic_feature_flags add column if not exists original_learning_enabled boolean not null default false;
alter table cachaste_web.basic_feature_flags enable row level security;
create table cachaste_web.original_question_catalog(
 key text primary key, subject text not null, concept text not null, family text not null,
 track text, module text, eligible boolean not null, answer integer not null,
 options jsonb not null, assessment_version text not null, source_id jsonb not null
);
alter table cachaste_web.original_question_catalog enable row level security;
revoke all on cachaste_web.original_question_catalog from public,anon,authenticated;
create table cachaste_web.original_learning_sessions(
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 request_key uuid not null, kind text not null check(kind in('lesson','diagnostic','expressExam')),
 subject text not null, usage_subject text not null, usage_day date not null,
 context jsonb not null, keys jsonb not null, answers jsonb not null default '[]',
 draft jsonb not null, result jsonb, status text not null default 'reserved' check(status in('reserved','completed','expired')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(user_id,request_key)
);
create index original_learning_quota on cachaste_web.original_learning_sessions(user_id,kind,usage_subject,usage_day);
alter table cachaste_web.original_learning_sessions enable row level security;
revoke all on cachaste_web.original_learning_sessions from public,anon,authenticated;

create function cachaste_web.original_learning_ready() returns boolean language sql stable security definer set search_path='' as $$
 select coalesce((select original_learning_enabled from cachaste_web.basic_feature_flags where id),false)
$$;
revoke all on function cachaste_web.original_learning_ready() from public,anon;
grant execute on function cachaste_web.original_learning_ready() to authenticated,service_role;

-- The established entitlement resolver already combines paid web, trials and special/tester grants.
-- Do not replace or write any subscription, receipt, tester or payment record.
create function cachaste_web.learning_access() returns jsonb language plpgsql security definer set search_path='' as $$
declare a jsonb:=cachaste.access_state(); ready boolean:=cachaste_web.original_learning_ready();
begin
 return a||jsonb_build_object('tier',case when (a->>'active')::boolean then 'premium' when ready then 'basica' else 'unavailable' end,
  'basicEnabled',ready,'basicValidUntilMs',case when ready then floor(extract(epoch from now()+interval '5 minutes')*1000)::bigint else null end);
end$$;
revoke all on function cachaste_web.learning_access() from public,anon;
grant execute on function cachaste_web.learning_access() to authenticated;
create function public.cachaste_learning_access() returns jsonb language sql security invoker set search_path='' as $$select cachaste_web.learning_access()$$;
revoke all on function public.cachaste_learning_access() from public,anon;
grant execute on function public.cachaste_learning_access() to authenticated;

create function cachaste_web.original_learning(operation text,payload jsonb default '{}') returns jsonb language plpgsql security definer set search_path='' as $$
declare
 u uuid:=cachaste.require_user(); today date:=(now() at time zone 'America/Santiago')::date;
 a cachaste_web.original_learning_sessions%rowtype; q cachaste_web.original_question_catalog%rowtype;
 k text; subj text; kind_name text; usage_subj text; max_count integer; used_count integer;
 n integer; pos integer; chosen integer; row_value jsonb; rows_value jsonb; draft_value jsonb; doc jsonb; docs jsonb;
 mode_name text; request_id uuid; session_id uuid; question_ids jsonb; context_value jsonb; premium boolean:=cachaste.premium(u);
 correct_count integer; xp integer; day_value jsonb; answers_value jsonb;
begin
 if operation not in('state','start','answer','complete','abandon') or jsonb_typeof(payload) is distinct from 'object' or octet_length(payload::text)>50000 then raise exception 'INVALID_OPERATION';end if;
 if not premium and not cachaste_web.original_learning_ready() then raise exception 'BASIC_NOT_READY' using errcode='42501';end if;
 -- Same lock as Basic duel activation, so simultaneous devices share one budget.
 perform pg_advisory_xact_lock(hashtextextended('basic-completion:'||u::text,0));
 -- An empty failed launch never permanently spends a diagnostic or daily slot.
 -- Once an answer was accepted, an abandoned activity remains counted for its day.
 update cachaste_web.original_learning_sessions set status='expired' where user_id=u and status='reserved' and answers='[]'::jsonb and updated_at<now()-interval '90 minutes';
 if operation='state' then
  select coalesce(jsonb_agg(to_jsonb(d)-'user_id'),'[]') into docs from cachaste_web.learning_documents d where user_id=u;
  select * into a from cachaste_web.original_learning_sessions where user_id=u and status='reserved' order by created_at desc limit 1;
  return jsonb_build_object('access',cachaste_web.learning_access(),'documents',docs,'activity',case when a.id is null then null else a.draft end);
 end if;
 if operation='start' then
  -- Premium uses the original offline engine, never spends Basic quota.
  if premium then return jsonb_build_object('tier','premium','unlimited',true);end if;
  request_id:=(payload->>'requestKey')::uuid;mode_name:=payload->>'mode';subj:=payload->>'subject';
  kind_name:=case mode_name when 'lesson' then 'lesson' when 'smart' then 'lesson' when 'free' then 'lesson' when 'diagnostic' then 'diagnostic' when 'express-exam' then 'expressExam' end;
  if request_id is null or kind_name is null or subj not in('M1','M2','Lectura','Ciencias','Historia') or subj is null then raise exception 'INVALID_ACTIVITY';end if;
  if subj='Ciencias' and coalesce(payload->>'track','') not in('Biología','Física','Química','TP') then raise exception 'SCIENCE_TRACK_REQUIRED';end if;
  usage_subj:=case when kind_name='expressExam' then 'all' when subj='Lectura' then 'lectora' else lower(subj) end;
  context_value:=jsonb_build_object('mode',mode_name,'subject',subj,'track',payload->'track','concept',payload->'concept');
  select * into a from cachaste_web.original_learning_sessions where user_id=u and request_key=request_id;
  if found then
   if a.context<>context_value then raise exception 'REQUEST_KEY_CONFLICT';end if;
   if a.status='expired' then raise exception 'ATTEMPT_EXPIRED';end if;
   if a.status='completed' then raise exception 'ATTEMPT_ALREADY_COMPLETED';end if;
   return jsonb_build_object('tier','basica','activity',a.draft,'completed',a.status='completed','result',a.result,'replayed',true);
  end if;
  -- Resume the server-owned activity after a reload or a change of device.
  select * into a from cachaste_web.original_learning_sessions where user_id=u and status='reserved' order by created_at desc limit 1;
  if found then return jsonb_build_object('tier','basica','activity',a.draft,'resumed',true);end if;
  max_count:=case kind_name when 'lesson' then 3 else 1 end;
  select count(*) into used_count from(
   select event_id id from cachaste_web.basic_usage where user_id=u and kind=kind_name and subject=usage_subj and (kind_name='diagnostic' or usage_day=today)
   union
   select id from cachaste_web.original_learning_sessions where user_id=u and kind=kind_name and usage_subject=usage_subj and status<>'expired' and (kind_name='diagnostic' or usage_day=today)
  ) x;
  if used_count>=max_count then raise exception 'BASIC_QUOTA_EXHAUSTED' using errcode='42501';end if;
  question_ids:=payload->'keys';
  if jsonb_typeof(question_ids) is distinct from 'array' then raise exception 'INVALID_QUESTIONS';end if;
  n:=jsonb_array_length(question_ids);
  -- Keep the approved engine's 2-question lesson stages and 30/15 assessments.
  if (mode_name='lesson' and n<>2) or (mode_name in('smart','free') and n not between 1 and 10) or (kind_name='diagnostic' and n<>30) or (kind_name='expressExam' and n<>15) or
   (select count(distinct value) from jsonb_array_elements_text(question_ids))<>n then raise exception 'INVALID_QUESTIONS';end if;
  for k in select value from jsonb_array_elements_text(question_ids) loop
   select * into q from cachaste_web.original_question_catalog where key=k;
   if not found or q.subject<>subj or (kind_name<>'lesson' and not q.eligible) or
    (kind_name='lesson' and payload->>'concept' is not null and q.concept<>payload->>'concept') or
    (subj='Ciencias' and not(q.module='MC' or (payload->>'track'='TP' and q.module='MTP') or (q.module='ME' and q.track=payload->>'track'))) then raise exception 'QUESTION_CONTEXT_MISMATCH';end if;
  end loop;
  if kind_name='lesson' and (select count(distinct c.family) from cachaste_web.original_question_catalog c where c.key in(select value from jsonb_array_elements_text(question_ids)))<>n then raise exception 'INDEPENDENT_QUESTIONS_REQUIRED';end if;
  session_id:=gen_random_uuid();
  draft_value:=jsonb_build_object('id',session_id,'basicAttempt',true,'subject',subj,'track',payload->'track','mode',mode_name,'concept',payload->'concept','keys',question_ids,'index',0,'selected',null,'confidence',null,'checked',false,'hinted',false,'studied',false,'stage',case when mode_name='lesson' then 'intro' else 'question' end,'card',0,'tutor','steps','results','[]'::jsonb,'started',floor(extract(epoch from now())*1000)::bigint);
  insert into cachaste_web.original_learning_sessions(id,user_id,request_key,kind,subject,usage_subject,usage_day,context,keys,draft) values(session_id,u,request_id,kind_name,subj,usage_subj,today,context_value,question_ids,draft_value);
  return jsonb_build_object('tier','basica','activity',draft_value);
 end if;
 session_id:=(payload->>'attemptId')::uuid;
 select * into a from cachaste_web.original_learning_sessions where user_id=u and id=session_id for update;
 if not found then raise exception 'ATTEMPT_NOT_FOUND';end if;
 if operation='abandon' then
  -- Only a launch which never accepted an answer can release its reservation.
  if a.status='reserved' and a.answers='[]'::jsonb then update cachaste_web.original_learning_sessions set status='expired' where id=a.id;end if;
  return jsonb_build_object('released',a.status='reserved' and a.answers='[]'::jsonb);
 end if;
 if a.status='expired' then raise exception 'ATTEMPT_EXPIRED';end if;
 if operation='answer' then
  pos:=(payload->>'position')::integer;chosen:=(payload->>'selectedIndex')::integer;
  if pos is null or chosen is null or pos<0 or pos>=jsonb_array_length(a.keys) then raise exception 'INVALID_ANSWER';end if;
  if pos<jsonb_array_length(a.answers) then
   if (a.answers->pos->>'selected')::integer<>chosen then raise exception 'ANSWER_ALREADY_RECORDED';end if;
   return jsonb_build_object('row',a.answers->pos,'activity',a.draft,'replayed',true);
  end if;
  if a.status<>'reserved' or pos<>jsonb_array_length(a.answers) then raise exception 'ANSWER_OUT_OF_ORDER';end if;
  select * into q from cachaste_web.original_question_catalog where key=a.keys->>pos;
  if chosen<0 or chosen>=jsonb_array_length(q.options) then raise exception 'INVALID_ANSWER';end if;
  row_value:=jsonb_build_object('eventId',a.id::text||':'||pos,'assessmentVersion',q.assessment_version,'key',q.key,'subject',a.subject,'id',q.source_id,'selected',chosen,'correct',chosen=q.answer,'confidence','no-declarada','diagnosticPending',a.kind='diagnostic','repeatedReview',false,'assisted',coalesce((payload->>'assisted')::boolean,false),'afterStudy',coalesce((payload->>'afterStudy')::boolean,false),'at',now(),'mode',a.context->>'mode','evidence','sin ayuda');
  answers_value:=a.answers||jsonb_build_array(row_value);
  draft_value:=a.draft||jsonb_build_object('index',least(pos+1,jsonb_array_length(a.keys)-1),'results',answers_value,'checked',pos+1=jsonb_array_length(a.keys),'selected',case when pos+1=jsonb_array_length(a.keys) then chosen else null end,'stage','question');
  update cachaste_web.original_learning_sessions set answers=answers_value,draft=draft_value,updated_at=now() where id=a.id;
  return jsonb_build_object('row',row_value,'activity',draft_value);
 end if;
 if a.status='completed' then return a.result||jsonb_build_object('replayed',true);end if;
 if jsonb_array_length(a.answers)<>jsonb_array_length(a.keys) then raise exception 'INCOMPLETE_ANSWERS';end if;
 select count(*) into correct_count from jsonb_array_elements(a.answers) r where (r->>'correct')::boolean;
 -- Merge into the existing educational document; do not discard prior Premium progress.
 perform pg_advisory_xact_lock(hashtextextended('web-progress:'||u::text,0));
 select value into doc from cachaste_web.learning_documents where user_id=u and key='cachaste-daily-v1';
 doc:=coalesce(doc,jsonb_build_object('version',1,'seen','{}'::jsonb,'attempts','[]'::jsonb,'days','{}'::jsonb,'completed','[]'::jsonb));
 select coalesce(jsonb_agg(r||jsonb_build_object('diagnosticPending',false)),'[]') into rows_value from jsonb_array_elements(a.answers) r;
 doc:=doc||jsonb_build_object('attempts',coalesce(doc->'attempts','[]')||rows_value,'session',null,'foundationDraft',null,'chosenCourse',true,'subject',a.subject,'track',a.context->'track',
  'completed',coalesce(doc->'completed','[]')||jsonb_build_array(jsonb_build_object('id',a.id,'subject',a.subject,'track',a.context->'track','mode',a.context->>'mode','at',floor(extract(epoch from now())*1000)::bigint,'total',jsonb_array_length(a.keys),'correct',correct_count)));
 day_value:=coalesce(doc->'days'->today::text,'{"keys":[],"xp":0}'::jsonb);xp:=0;
 for row_value in select value from jsonb_array_elements(rows_value) loop
  if not (day_value->'keys') ? (row_value->>'key') then
   day_value:=day_value||jsonb_build_object('keys',(day_value->'keys')||jsonb_build_array(row_value->>'key'));
   xp:=xp+case when (row_value->>'correct')::boolean then 15 else 10 end;
  end if;
 end loop;
 for row_value in select value from jsonb_array_elements(rows_value) loop
  doc:=jsonb_set(doc,'{seen}',coalesce(doc->'seen','{}')||jsonb_build_object(row_value->>'key',jsonb_build_object('first',floor(extract(epoch from now())*1000)::bigint,'last',floor(extract(epoch from now())*1000)::bigint,'count',coalesce((doc->'seen'->(row_value->>'key')->>'count')::integer,0)+1)));
 end loop;
 doc:=doc||jsonb_build_object('days',coalesce(doc->'days','{}')||jsonb_build_object(today::text,day_value||jsonb_build_object('xp',coalesce((day_value->>'xp')::integer,0)+xp)));
 insert into cachaste_web.learning_documents(user_id,key,value) values(u,'cachaste-daily-v1',doc) on conflict(user_id,key) do update set value=excluded.value,version=cachaste_web.learning_documents.version+1,updated_at=now();
 insert into cachaste_web.basic_usage(user_id,kind,subject,usage_day,event_id) values(u,a.kind,a.usage_subject,a.usage_day,a.id);
 row_value:=jsonb_build_object('completed',true,'attemptId',a.id,'correct',correct_count,'total',jsonb_array_length(a.keys));
 update cachaste_web.original_learning_sessions set status='completed',result=row_value,updated_at=now() where id=a.id;
 return row_value;
end$$;
revoke all on function cachaste_web.original_learning(text,jsonb) from public,anon;
grant execute on function cachaste_web.original_learning(text,jsonb) to authenticated;
create function public.cachaste_original_learning(operation text,payload jsonb default '{}') returns jsonb language sql security invoker set search_path='' as $$select cachaste_web.original_learning(operation,payload)$$;
revoke all on function public.cachaste_original_learning(text,jsonb) from public,anon;
grant execute on function public.cachaste_original_learning(text,jsonb) to authenticated;

-- Basic rankings use the existing privacy-filtered ranking implementation.
create function cachaste_web.basic_rankings(payload jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=cachaste_duels2.require_player();begin
 if not cachaste.premium(u) and not cachaste_web.original_learning_ready() then raise exception 'BASIC_NOT_READY';end if;
 return cachaste.rankings(u,payload);
end$$;
revoke all on function cachaste_web.basic_rankings(jsonb) from public,anon;
grant execute on function cachaste_web.basic_rankings(jsonb) to authenticated;
create function public.cachaste_basic_rankings(payload jsonb default '{}') returns jsonb language sql security invoker set search_path='' as $$select cachaste_web.basic_rankings(payload)$$;
revoke all on function public.cachaste_basic_rankings(jsonb) from public,anon;
grant execute on function public.cachaste_basic_rankings(jsonb) to authenticated;

-- Include active original-engine reservations in the existing quota dashboard.
alter function cachaste_web.basic_quota_summary() rename to basic_quota_summary_before_original;
create function cachaste_web.basic_quota_summary() returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=cachaste.require_user();result jsonb:=cachaste_web.basic_quota_summary_before_original();s text;n integer;begin
 if result->>'tier'='premium' then return result;end if;
 for s in select unnest(array['m1','m2','lectora','ciencias','historia']) loop
  select count(*) into n from cachaste_web.original_learning_sessions a where user_id=u and usage_subject=s and kind='lesson' and status='reserved' and usage_day=(now() at time zone 'America/Santiago')::date and (answers<>'[]'::jsonb or updated_at>now()-interval '90 minutes');
  result:=jsonb_set(result,array['lessonsRemaining',s],to_jsonb(greatest(0,(result->'lessonsRemaining'->>s)::integer-n)));
  if exists(select 1 from cachaste_web.original_learning_sessions a where user_id=u and usage_subject=s and kind='diagnostic' and status='reserved' and (answers<>'[]'::jsonb or updated_at>now()-interval '90 minutes')) then result:=jsonb_set(result,array['diagnosticsRemaining',s],'0');end if;
 end loop;
 if exists(select 1 from cachaste_web.original_learning_sessions a where user_id=u and kind='expressExam' and status='reserved' and usage_day=(now() at time zone 'America/Santiago')::date and (answers<>'[]'::jsonb or updated_at>now()-interval '90 minutes')) then result:=jsonb_set(result,'{expressExamsRemaining}','0');end if;
 return result;
end$$;
revoke all on function cachaste_web.basic_quota_summary() from public,anon;
grant execute on function cachaste_web.basic_quota_summary() to authenticated;
-- Keep the public wrapper bound to the new implementation after the rename.
create or replace function public.cachaste_basic_quota_summary() returns jsonb language sql security invoker set search_path='' as $$select cachaste_web.basic_quota_summary()$$;

-- Do not put exhausted Basic players back in the queue: otherwise they can abort
-- a Premium rival's activation. The activation trigger still owns the atomic spend.
create function cachaste_web.basic_duel_available(u uuid) returns boolean language sql stable security definer set search_path='' as $$
 select cachaste.premium(u) or (select count(*)<2 from cachaste_web.basic_usage where user_id=u and kind='duel' and usage_day=(now() at time zone 'America/Santiago')::date)
$$;
revoke all on function cachaste_web.basic_duel_available(uuid) from public,anon,authenticated;
create or replace function cachaste_duels2.eligible(u uuid) returns boolean language sql stable set search_path='' as $$
 select exists(select 1 from cachaste.profiles p where p.user_id=u and p.moderation_status='active' and p.community_version='2026-10-23' and p.community_accepted_at is not null)
 and not exists(select 1 from cachaste.community_restrictions where user_id=u)
 and (cachaste.premium(u) or cachaste_web.basic_duels_enabled()) and cachaste_web.basic_duel_available(u)
$$;
alter function cachaste_duels2.dispatch(text,jsonb) rename to dispatch_before_original_access;
create function cachaste_duels2.dispatch(operation text,payload jsonb default '{}') returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=cachaste.require_user();begin
 if operation in('random','create_duel','join_code','accept','rematch') and not cachaste_web.basic_duel_available(u) then raise exception 'BASIC_DUEL_LIMIT_REACHED' using errcode='42501';end if;
 return cachaste_duels2.dispatch_before_original_access(operation,payload);
end$$;
revoke all on function cachaste_duels2.dispatch_before_original_access(text,jsonb) from public,anon,authenticated;
revoke all on function cachaste_duels2.dispatch(text,jsonb) from public,anon;
grant execute on function cachaste_duels2.dispatch(text,jsonb) to authenticated;
create or replace function public.cachaste_duels2(operation text,payload jsonb default '{}') returns jsonb language sql security invoker set search_path='' as $$select cachaste_duels2.dispatch(operation,payload)$$;
