-- OPERATOR ONLY, AFTER APPROVAL. Disable access without deleting any activity or progress.
begin;
update cachaste_web.basic_feature_flags
set original_learning_enabled=false,duel_admission_enabled=false;
commit;
-- Restore the prior approved web build and WEB_BASIC_* flags separately.
-- Do not DROP tables, truncate activity ledgers, revert payment functions or revoke tester grants.
