begin;

-- Keep the existing twelve-hour access lease fresh, including for Android-only users.
alter table cachaste_web.checkouts add column mp_reconciliation_attempt_at timestamptz;
create table cachaste_web.mp_reconciliation_tickets (
 token_hash bytea primary key,
 expires_at timestamptz not null
);
alter table cachaste_web.mp_reconciliation_tickets enable row level security;
revoke all on cachaste_web.mp_reconciliation_tickets from public,anon,authenticated;

create function cachaste_web.mp_reconciliation_due()
returns table (checkout_id uuid, provider_id text)
language sql stable set search_path='' as $$
 select c.id,c.provider_id
 from cachaste_web.checkouts c
 left join cachaste_web.subscriptions s on s.checkout_id=c.id
 where c.provider_id is not null
 and (c.mp_reconciliation_attempt_at is null or c.mp_reconciliation_attempt_at<now()-interval '30 minutes')
 and (
  (s.provider_id is null or s.live_mode and s.provider_status='pending')
   and c.created_at>now()-interval '2 days'
  or s.live_mode and s.checked_at<now()-interval '6 hours'
   and (greatest(s.paid_until,s.trial_until)>now()-interval '3 days'
        or s.renews and s.next_payment_at between now()-interval '3 days' and now())
 )
 order by coalesce(c.mp_reconciliation_attempt_at,s.checked_at,c.created_at),c.id
 limit 12
$$;
revoke all on function cachaste_web.mp_reconciliation_due() from public,anon,authenticated;

-- A single-use ticket authenticates the scheduled request without sending a project
-- key over HTTP. Only the Edge Function's service role can claim it.
create function public.cachaste_mp_reconciliation_claim(ticket uuid)
returns text[] language plpgsql security definer set search_path='' as $$
declare ids text[];
begin
 delete from cachaste_web.mp_reconciliation_tickets
  where token_hash=sha256(convert_to(ticket::text,'UTF8')) and expires_at>now();
 if not found then return null; end if;
 perform pg_advisory_xact_lock(hashtextextended('web-mp-reconciliation',0));
 with due as (select checkout_id from cachaste_web.mp_reconciliation_due()),
 claimed as (
  update cachaste_web.checkouts c set mp_reconciliation_attempt_at=clock_timestamp()
  from due where c.id=due.checkout_id returning c.provider_id
 )
 select coalesce(array_agg(provider_id),'{}') into ids from claimed;
 return ids;
end$$;
revoke all on function public.cachaste_mp_reconciliation_claim(uuid) from public,anon,authenticated;
grant execute on function public.cachaste_mp_reconciliation_claim(uuid) to service_role;

create function cachaste_web.queue_mp_reconciliation()
returns bigint language plpgsql set search_path='' as $$
declare ticket uuid:=gen_random_uuid();
begin
 delete from cachaste_web.mp_reconciliation_tickets where expires_at<=now();
 if not exists(select 1 from cachaste_web.mp_reconciliation_due()) then return null; end if;
 insert into cachaste_web.mp_reconciliation_tickets(token_hash,expires_at)
 values(sha256(convert_to(ticket::text,'UTF8')),now()+interval '3 minutes');
 return net.http_post(
  url:='https://jmobinmdwrmdqrxtcruj.supabase.co/functions/v1/cachaste-mercadopago',
  headers:=jsonb_build_object('content-type','application/json'),
  body:=jsonb_build_object('action','reconcile_scheduled','ticket',ticket),
  timeout_milliseconds:=120000
 );
end$$;
revoke all on function cachaste_web.queue_mp_reconciliation() from public,anon,authenticated;

do $$begin
 if exists(select 1 from pg_available_extensions where name='pg_net')
  and exists(select 1 from pg_extension where extname='pg_cron') then
  create extension if not exists pg_net with schema extensions;
  revoke usage on schema net from public,anon,authenticated;
  revoke all on all tables in schema net from public,anon,authenticated;
  revoke execute on all functions in schema net from public,anon,authenticated;
  perform cron.schedule('cachaste-mp-reconciliation','*/10 * * * *','select cachaste_web.queue_mp_reconciliation()');
 end if;
end$$;
notify pgrst,'reload schema';
commit;
