import test from'node:test';import assert from'node:assert/strict';import{encryptBackup,decryptBackup,packSnapshot,unpackSnapshot}from'../scripts/competition-backup.mjs';
const key='isolated-backup-test-secret-at-least-32-characters';
test('Encrypted backup recovers exact bytes and uses a fresh nonce each time',()=>{const source=Buffer.from('archived results and account data');const a=encryptBackup(source,key),b=encryptBackup(source,key);assert.notDeepEqual(a,b);assert.deepEqual(decryptBackup(a,key),source);assert.equal(a.includes(source),false);});
test('A changed backup or wrong secret fails authentication instead of restoring corrupted data',()=>{const a=encryptBackup(Buffer.from('snapshot'),key);a[a.length-1]^=1;assert.throws(()=>decryptBackup(a,key));assert.throws(()=>decryptBackup(encryptBackup(Buffer.from('snapshot'),key),'another-secret-at-least-thirty-two-characters'));});
test('Backup refuses weak encryption secrets',()=>assert.throws(()=>encryptBackup(Buffer.from('snapshot'),'1234'),/32 characters/));
test('Application and Auth data share one authenticated archive without managed-schema definitions',()=>{
 const application=Buffer.from('PGDMP application and ACLs'),authData=Buffer.from('PGDMP auth data only'),metadata={format:2,auth:'data-only'};
 const restored=unpackSnapshot(decryptBackup(encryptBackup(packSnapshot(application,authData,metadata),key),key));
 assert.deepEqual(restored,{application,authData,metadata});
});
test('Truncated, appended and unsupported restore archives are rejected before PostgreSQL is touched',()=>{
 const packed=packSnapshot(Buffer.from('PGDMP application'),Buffer.from('PGDMP auth'));
 assert.throws(()=>unpackSnapshot(packed.subarray(0,packed.length-1)),/Incomplete/);
 assert.throws(()=>unpackSnapshot(Buffer.concat([packed,Buffer.from('extra')])) ,/Invalid/);
 assert.throws(()=>unpackSnapshot(Buffer.from('PGDMP legacy full database')),/Legacy/);
});
