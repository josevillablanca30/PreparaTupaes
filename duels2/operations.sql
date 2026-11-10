-- Launch owner only, AFTER review/application of the Duelos 2 migration.
-- This file is intentionally NOT auto-applied to production by Work 2.
-- Official installation: https://supabase.com/docs/guides/cron/install
create extension if not exists pg_cron with schema pg_catalog;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;
select cron.schedule('cachaste-duels2-maintenance','* * * * *','select cachaste_duels2.sweep()');
-- Verify exactly this dedicated job, never change another Work's jobs.
select jobid,jobname,schedule,active from cron.job where jobname='cachaste-duels2-maintenance';
-- Realtime may publish only the sanitized aggregate projection for this feature.
select schemaname,tablename from pg_publication_tables
 where pubname='supabase_realtime' and tablename like '%duels2%';
