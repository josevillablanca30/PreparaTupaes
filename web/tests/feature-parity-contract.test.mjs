import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const browser=readFileSync(new URL('web-commercial.spec.mjs',import.meta.url),'utf8');
const build=readFileSync(new URL('../scripts/build.mjs',import.meta.url),'utf8');
const workflow=readFileSync(new URL('../../.github/workflows/web-commercial.yml',import.meta.url),'utf8');
test('web release has browser coverage for the five subjects and every core Android experience',()=>{
 const required=[
  'five subjects and all science tracks retain the full educational engine',
  'real lesson interaction, correction and persistence',
  'full PAES exam, answer navigation and cloud persistence',
  'complete Express results, educational review and diagnostic resume',
  'four independent rankings send the correct subject and geography filters',
  'approved duelo UI keeps the Android composition',
  'approved resultado UI keeps the Android composition',
  'two browser contexts synchronize one identity',
 ];
 for(const phrase of required)assert.ok(browser.includes(phrase),'Missing web parity QA: '+phrase);
 assert.match(browser,/for\(const subject of \['M1','M2','Lectura','Ciencias','Historia'\]\)/);
 assert.match(browser,/for\(let n=0;n<15;n\+\+\)/);
 assert.match(build,/adaptCompetitionUi\(androidSource\('competition-app\.js'\)/);
 assert.match(build,/verify-android\.mjs/);
 assert.match(workflow,/Android-Chrome, iPhone-WebKit, Desktop-Chrome, mobile-320px/);
});
