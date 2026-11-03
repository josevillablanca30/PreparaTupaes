begin;
-- Account deletion must remove its email preauthorization as well as UUID-linked data.
-- This changes only the existing verified, fresh-session deletion path; no accounts or
-- permissions are deleted by applying the migration.
do $$
declare source text; marker text := 'delete from auth.sessions where user_id=u;';
begin
 source := pg_get_functiondef('cachaste.dispatch_before_community(text,jsonb)'::regprocedure);
 if source not like '%elsif operation=''delete_account''then%' or
    (length(source)-length(replace(source,marker,'')))/length(marker) <> 1 then
   raise exception 'REVIEW_ACCOUNT_DELETION_BODY';
 end if;
 source := replace(source,marker,
   'delete from cachaste.closed_test_emails where email_hash=(select sha256(convert_to(lower(btrim(email)),''UTF8'')) from auth.users where id=u);' || chr(10) || '  ' || marker);
 execute source;
end $$;
commit;
