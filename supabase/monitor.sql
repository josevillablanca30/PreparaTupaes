-- Operator-only, read-only. Never expose database metrics or private identifiers to the client.
select pg_database_size(current_database()) as database_bytes,
       pg_size_pretty(pg_database_size(current_database())) as database_size,
       pg_database_size(current_database()) > 400*1024*1024 as review_free_quota;
select relname,n_live_tup,n_dead_tup from pg_stat_user_tables where schemaname='cachaste'order by n_live_tup desc;
select count(*) as profiles from cachaste.profiles;
select count(*) as duels_last_24h from cachaste.duels where created_at>now()-interval '24 hours';
select count(*) as pending_invitations from cachaste.duels where status='invited' and expires_at>now();
select deadlocks from pg_stat_database where datname=current_database();
