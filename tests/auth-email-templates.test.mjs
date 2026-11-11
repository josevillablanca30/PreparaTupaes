import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
for(const kind of ['confirmation','recovery'])test('The '+kind+' email presents a visible OTP in Spanish without a localhost link',async()=>{
 const html=await readFile(new URL('../supabase/templates/'+kind+'.html',import.meta.url),'utf8');
 assert.match(html,/<html lang="es(?:-CL)?">/);assert.match(html,/id="verification-code"[^>]*>\{\{ \.Token \}\}/);assert.doesNotMatch(html,/localhost|ConfirmationURL|<script/i);assert.match(html,/¿Cachaste\?/);
 if(kind==='confirmation')assert.doesNotMatch(html,/TokenHash|href=/);
 else{assert.match(html,/\{\{ \.SiteURL \}\}\/recuperar#token_hash=\{\{ \.TokenHash \}\}&amp;type=recovery/);assert.match(html,/>Cambiar mi contraseña<\/a>/);}
});
