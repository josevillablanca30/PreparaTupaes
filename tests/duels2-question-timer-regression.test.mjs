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

test('expired questions progress while offline and late answers are safe',()=>{
 assert.match(upgrade,/create or replace function cachaste_duels2\.sweep\(\)/);
 assert.match(upgrade,/p\.question_started_at\+make_interval/);
 assert.match(upgrade,/pos<pl\.position then return cachaste_duels2\.attempt_view/);
 assert.match(upgrade,/create trigger d2_init_question_clock/);
});
test('countdown uses server timestamps and does not reset on rerender',()=>{
 assert.match(runtime,/function d2QuestionClock\(\)/);
 assert.match(runtime,/Date\.parse\(a\.serverNow\)/);
 assert.match(runtime,/Date\.parse\(a\.questionDeadline\)/);
 assert.match(runtime,/a\._d2ServerStamp!==a\.serverNow/);
 assert.doesNotMatch(runtime,/render=function\(\.\.\.args\)\{if\(state\.attempt\?\.version===2\)state\.attempt\._d2ReceivedAt=Date\.now\(\)/);
});

test('expired countdown tells player the wrong-answer penalty and synchronizes',()=>{
 assert.match(runtime,/Tiempo agotado · cuenta como incorrecta \(−1\)\. Actualizando duelo/);
 assert.match(runtime,/setInterval\(\(\)=>\{d2QuestionClock\(\);void d2Sync\(\);\},1000\)/);
});

test('countdown actually decreases with elapsed time, survives rerenders and expires at zero',async()=>{
 const {runInNewContext}=await import('node:vm');
 const start=runtime.indexOf(' function d2QuestionClock(){');
 const end=runtime.indexOf(' function d2Paint(){',start);
 assert.ok(start>=0&&end>start,'timer function can be extracted');
 let now=Date.parse('2026-11-12T20:00:00.000Z');
 const attempt={version:2,serverNow:'2026-11-12T20:00:00.000Z',questionDeadline:'2026-11-12T20:01:30.000Z'};
 const clock={textContent:''};
 const question={querySelector:()=>clock};
 const root={querySelector:()=>question};
 const state={route:'pregunta',attempt};
 class FakeDate extends Date{static now(){return now;}}
 const tick=runInNewContext('('+runtime.slice(start,end).trim()+')',{state,root,Date:FakeDate,Number,Math,String});
 tick();assert.equal(clock.textContent,'Tiempo de esta pregunta: 1:30');
 now+=30000;tick();assert.equal(clock.textContent,'Tiempo de esta pregunta: 1:00');
 // Same server timestamp on a UI rerender must not reset the countdown.
 tick();assert.equal(clock.textContent,'Tiempo de esta pregunta: 1:00');
 now+=60000;tick();assert.match(clock.textContent,/Tiempo agotado/);
 now+=10000;tick();assert.match(clock.textContent,/Tiempo agotado/);
 // New authoritative timestamps may update a countdown but must not revive an expired question.
 attempt.serverNow='2026-11-12T20:01:40.000Z';tick();assert.match(clock.textContent,/Tiempo agotado/);
 // M1/M2 have a 120-second server deadline rather than the 90-second standard.
 state.attempt={version:2,serverNow:'2026-11-12T20:01:40.000Z',questionDeadline:'2026-11-12T20:03:40.000Z'};
 tick();assert.equal(clock.textContent,'Tiempo de esta pregunta: 2:00');
 now+=60000;tick();assert.equal(clock.textContent,'Tiempo de esta pregunta: 1:00');
});
