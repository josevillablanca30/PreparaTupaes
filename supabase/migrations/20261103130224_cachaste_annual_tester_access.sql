begin;
-- A thank-you year is explicitly authorized by the owner. This migration grants
-- nobody access and does not extend an existing permission: emails arrive later.
alter table cachaste.closed_test_access drop constraint closed_test_access_check;
alter table cachaste.closed_test_access add constraint closed_test_access_check
 check(valid_until>granted_at and valid_until<=granted_at+interval '1 year');
alter table cachaste.closed_test_emails drop constraint closed_test_emails_check;
alter table cachaste.closed_test_emails add constraint closed_test_emails_check
 check(valid_until>granted_at and valid_until<=granted_at+interval '1 year');
comment on table cachaste.closed_test_access is 'Owner-managed tester UUID grants, revocable, at most one calendar year. Clients cannot read, grant or renew access.';
comment on table cachaste.closed_test_emails is 'Owner-managed SHA-256 email preauthorization, verified Auth emails only, revocable and at most one calendar year. No identities are seeded.';
commit;
