import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeDocument,validateDocument} from '../web/shared/progress.mjs';
import {STORAGE_KEYS,MAX_DOCUMENT_BYTES} from '../web/shared/config.mjs';
test('all approved progress document keys are accepted',()=>{
 for(const key of STORAGE_KEYS)assert.equal(validateDocument(key,{}),true,key);
});
test('unknown progress keys and invalid scalar documents are rejected',()=>{
 assert.throws(()=>validateDocument('admin-override',{}),/INVALID_PROGRESS_KEY/);
 assert.throws(()=>validateDocument(STORAGE_KEYS[0],'unexpected'),/INVALID_PROGRESS_VALUE/);
});
test('oversized progress payloads cannot be persisted',()=>{
 assert.throws(()=>validateDocument(STORAGE_KEYS[0],{payload:'x'.repeat(MAX_DOCUMENT_BYTES)}),/PROGRESS_TOO_LARGE/);
});
test('nonoverlapping offline edits merge without losing progress',()=>{
 const base={xp:2,seen:{a:{count:1}}};
 const local={xp:5,seen:{a:{count:2}}};
 const remote={xp:4,seen:{a:{count:3}}};
 const merged=mergeDocument(base,local,remote);
 assert.deepEqual(merged.conflicts,[]);
 assert.equal(merged.value.xp,5);
 assert.equal(merged.value.seen.a.count,3);
});
test('concurrent lesson drafts remain explicit conflicts rather than silently overwritten',()=>{
 const merged=mergeDocument({studioDraft:'initial'},{studioDraft:'phone'},{studioDraft:'desktop'});
 assert.deepEqual(merged.conflicts,['studioDraft']);
});
test('additive event histories retain independent offline entries',()=>{
 const merged=mergeDocument([{eventId:'old'}],[{eventId:'old'},{eventId:'mobile'}],[{eventId:'old'},{eventId:'desktop'}]);
 assert.deepEqual(merged.conflicts,[]);
 assert.deepEqual(new Set(merged.value.map(x=>x.eventId)),new Set(['old','mobile','desktop']));
});
