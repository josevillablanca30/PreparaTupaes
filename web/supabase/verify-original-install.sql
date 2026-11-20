-- Hosted verification runs in ONE transaction and always rolls back. No public flags or fixture users persist.
begin;
set local statement_timeout='30s';
do $qa$
declare u uuid:=gen_random_uuid();sid uuid:=gen_random_uuid();r jsonb;again jsonb;activity uuid;keys jsonb;concept_name text;i integer;pos integer;answer_index integer;blocked boolean:=false;
begin
 insert into auth.users(id,email,email_confirmed_at) values(u,'cachaste-migration-qa-'||u::text||'@example.invalid',now());
 insert into auth.sessions(id,user_id,not_after) values(sid,u,now()+interval '1 hour');
 perform set_config('request.jwt.claims',jsonb_build_object('sub',u,'session_id',sid,'role','authenticated')::text,true);
 r:=public.cachaste_learning_access();
 if r->>'tier'<>'unavailable' then raise exception 'BASIC_MUST_START_DISABLED';end if;
 update cachaste_web.basic_feature_flags set original_learning_enabled=true where id;
 r:=public.cachaste_learning_access();
 if r->>'tier'<>'basica' then raise exception 'BASIC_RESOLVER_FAILED';end if;
 select concept into concept_name from cachaste_web.original_question_catalog where subject='M1' group by concept having count(distinct family)>=2 order by concept limit 1;
 select jsonb_agg(key) into keys from (select distinct on(family) key from cachaste_web.original_question_catalog where subject='M1' and concept=concept_name order by family,key limit 2) q;
 for i in 1..3 loop
  r:=public.cachaste_original_learning('start',jsonb_build_object('mode','lesson','subject','M1','track',null,'concept',concept_name,'keys',keys,'requestKey',gen_random_uuid()));
  activity:=(r->'activity'->>'id')::uuid;
  again:=public.cachaste_original_learning('state','{}');
  if again->'activity'->>'id'<>activity::text then raise exception 'RECOVERY_FAILED';end if;
  for pos in 0..1 loop
   select answer into answer_index from cachaste_web.original_question_catalog where key=keys->>pos;
   r:=public.cachaste_original_learning('answer',jsonb_build_object('attemptId',activity,'position',pos,'selectedIndex',answer_index));
   again:=public.cachaste_original_learning('answer',jsonb_build_object('attemptId',activity,'position',pos,'selectedIndex',answer_index));
   if (again->>'replayed')::boolean is not true then raise exception 'ANSWER_RETRY_FAILED';end if;
  end loop;
  perform public.cachaste_original_learning('complete',jsonb_build_object('attemptId',activity));
  r:=public.cachaste_original_learning('complete',jsonb_build_object('attemptId',activity));
  if (r->>'replayed')::boolean is not true then raise exception 'COMPLETION_RETRY_FAILED';end if;
 end loop;
 begin
  perform public.cachaste_original_learning('start',jsonb_build_object('mode','lesson','subject','M1','keys',keys,'concept',concept_name,'requestKey',gen_random_uuid()));
 exception when insufficient_privilege then
  if sqlerrm<>'BASIC_QUOTA_EXHAUSTED' then raise;end if;blocked:=true;
 end;
 if not blocked then raise exception 'FOURTH_STAGE_NOT_BLOCKED';end if;
 if (select count(*) from cachaste_web.basic_usage where user_id=u)<>3 then raise exception 'DOUBLE_CONSUMPTION';end if;
 if (select jsonb_array_length(value->'completed') from cachaste_web.learning_documents where user_id=u and key='cachaste-daily-v1')<>3 then raise exception 'PROGRESS_NOT_SAVED';end if;
 -- Synthetic grant belongs only to this rolled-back QA user; existing testers are untouched.
 insert into cachaste.closed_test_access(user_id,valid_until,reason) values(u,now()+interval '1 day','transactional migration verification');
 r:=public.cachaste_learning_access();
 if r->>'tier'<>'premium' or (r->>'active')::boolean is not true then raise exception 'SPECIAL_BENEFIT_NOT_RECOGNIZED';end if;
 r:=public.cachaste_original_learning('start',jsonb_build_object('mode','lesson','subject','M1','keys',keys,'concept',concept_name,'requestKey',gen_random_uuid()));
 if r->>'tier'<>'premium' or (r->>'unlimited')::boolean is not true then raise exception 'PREMIUM_RESTRICTED_BY_BASIC';end if;
 if (select count(*) from cachaste_web.basic_usage where user_id=u)<>3 then raise exception 'PREMIUM_CONSUMED_BASIC';end if;
 update cachaste.closed_test_access set revoked_at=now() where user_id=u;
 r:=public.cachaste_learning_access();if r->>'tier'<>'basica' then raise exception 'REVOKED_BENEFIT_NOT_REFRESHED';end if;
 perform set_config('cachaste.qa_report','{"threeStages":true,"fourthBlocked":true,"serverRecovery":true,"answerRetry":true,"completionRetry":true,"progressSaved":true,"specialBenefitPriority":true,"premiumUnlimited":true,"revocationRefresh":true,"rolledBack":true}',true);
end $qa$;
select current_setting('cachaste.qa_report')::jsonb as verification;
rollback;
