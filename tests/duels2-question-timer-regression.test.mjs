import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const upgrade=readFileSync(new URL('../web/supabase/migrations/20261112141500_cachaste_duels2_question_timers.sql',import.meta.url),'utf8');
const runtime=readFileSync(new URL('../duels2/ui-runtime.js',import.meta.url),'utf8');
test('new migration is additive and installs a per-player server clock',()=>{
 assert.match(upgrade,/add column if not exists question_started_at/);
 assert.match(upgrade,/question_started_at\+make_interval/);
 assert.match(upgrade,/upper\(m\.subject\) in\('M1','M2'\)then 120 else 90/);
 assert.match(upgrade,/on conflict do nothing/);
 assert.match(upgrade,/'questionDeadline',case when p\.question_started_at/);
});
test('UI no longer advertises a shared 40 minute window',()=>{
 assert.doesNotMatch(runtime,/40 minutos/);
 assert.match(runtime,/120 segundos/);
 assert.match(runtime,/90 segundos/);
});
