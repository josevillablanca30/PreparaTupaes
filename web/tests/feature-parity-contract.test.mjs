import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const browser=readFileSync(new URL('web-commercial.spec.mjs',import.meta.url),'utf8');
const build=readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
const hosted=readFileSync(new URL('../scripts/test-hosted-preview.mjs',import.meta.url),'utf8');
const workflow=readFileSync(new URL('../../.github/workflows/web-commercial.yml',import.meta.url),'utf8');
test('web release has browser coverage for the five subjects and every core Android experience',()=>{
 const required=[
  'five subjects and all science tracks retain the full educational engine',
  'real lesson interaction, correction and persistence',
  'full PAES exam, answer navigation and cloud persistence',
  'complete Express results, educational review and diagnostic resume',
  'four independent rankings send the correct subject and geography filters',
  "for(const state of['rankings','duelos','duelo','resultado'])",
  'two browser contexts synchronize one identity',
 ];
 for(const phrase of required)assert.ok(browser.includes(phrase),'Missing web parity QA: '+phrase);
 assert.match(browser,/for\(const subject of \['M1','M2','Lectura','Ciencias','Historia'\]\)/);
 assert.match(browser,/for\(let n=0;n<15;n\+\+\)/);
 assert.ok(build.includes("adaptCompetitionUi(androidSource('competition-app.js').toString())"),'Web must package the original Android competition UI');
 assert.match(build,/verify-android\.mjs/);
 for(const browser of ['Android-Chrome','iPhone-WebKit','Desktop-Chrome','mobile-320px'])assert.ok(workflow.includes(browser),'Missing required browser: '+browser);
});

test('hosted QA requires real tutor, Express, five full exams, duels and rankings',()=>{
 for(const evidence of [
  'Real deployed tutor opens its visual lesson',
  'Real deployed Express completes fifteen questions',
  'Real deployed complete M2 exam resumes',
  'Real deployed full PAES exams open with answer options in all five subjects',
  'Real deployed Express has exactly fifteen questions in all five subjects',
  'Real deployed Ciencias offers all four science tracks',
  'Real deployed ranking UI opens exam, Express, game and duel leaderboards',
  'Real deployed rankings switch geography and Ciencias Química filters',
  'Three full duels and two rematches',
  "rpc(0,'rankings'",
 ])assert.ok(hosted.includes(evidence),'Missing hosted QA: '+evidence);
 assert.match(hosted,/HOSTED_PREVIEW_QA_FAILED at/);
 assert.match(hosted,/temporaryAccountsRemoved:cleanup/);
 assert.match(hosted,/realPayments:false/);
 assert.match(hosted,/assert\.equal\(report\.revision,revision\)/);
});
