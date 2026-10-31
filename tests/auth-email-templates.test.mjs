import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
for(const kind of ['confirmation','recovery'])test('The '+kind+' email presents a visible OTP in Spanish without a localhost link',async()=>{
 const html=await readFile(new URL('../supabase/templates/'+kind+'.html',import.meta.url),'utf8');
 assert.match(html,/<html lang="es">/);assert.match(html,/id="verification-code"[^>]*>\{\{ \.Token \}\}/);assert.doesNotMatch(html,/localhost|ConfirmationURL|TokenHash|href=/);assert.match(html,/¿Cachaste\?/);
});
