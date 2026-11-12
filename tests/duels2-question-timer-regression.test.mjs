// Regression contract for Duelos 2.0 per-question deadlines.
// This test deliberately fails against the old shared 40-minute implementation.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const migration=readFileSync(new URL('../web/supabase/migrations/20261110130920_cachaste_duels2_isolated.sql',import.meta.url),'utf8');
const runtime=readFileSync(new URL('../duels2/ui-runtime.js',import.meta.url),'utf8');
test('the old shared 40-minute deadline must be replaced by a server-authoritative question clock',()=>{
 assert.doesNotMatch(migration,/expires_at=clock_timestamp\(\)\+interval '40 minutes'/);
 assert.doesNotMatch(migration,/'questionDeadline',m\.expires_at/);
 assert.doesNotMatch(migration,/'durationSeconds',2400/);
});
test('the UI must not advertise 40 minutes',()=>{
 assert.doesNotMatch(runtime,/40 minutos/);
});
