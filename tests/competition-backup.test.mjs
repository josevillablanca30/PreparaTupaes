import test from'node:test';import assert from'node:assert/strict';import{encryptBackup,decryptBackup}from'../scripts/competition-backup.mjs';
const key='isolated-backup-test-secret-at-least-32-characters';
test('Encrypted backup recovers exact bytes and uses a fresh nonce each time',()=>{const source=Buffer.from('archived results and account data');const a=encryptBackup(source,key),b=encryptBackup(source,key);assert.notDeepEqual(a,b);assert.deepEqual(decryptBackup(a,key),source);assert.equal(a.includes(source),false);});
test('A changed backup or wrong secret fails authentication instead of restoring corrupted data',()=>{const a=encryptBackup(Buffer.from('snapshot'),key);a[a.length-1]^=1;assert.throws(()=>decryptBackup(a,key));assert.throws(()=>decryptBackup(encryptBackup(Buffer.from('snapshot'),key),'another-secret-at-least-thirty-two-characters'));});
test('Backup refuses weak encryption secrets',()=>assert.throws(()=>encryptBackup(Buffer.from('snapshot'),'1234'),/32 characters/));
