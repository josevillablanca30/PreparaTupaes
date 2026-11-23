import test from'node:test';import assert from'node:assert/strict';import{createCipheriv,randomBytes}from'node:crypto';import{privateAsset}from'../server/content.mjs';import{createGateway}from'../server/gateway.mjs';
test('Pages storage holds only authenticated AES-GCM ciphertext; missing/wrong keys and path substitution fail',async()=>{
 const key=randomBytes(32),iv=randomBytes(12),path='/app/bank.js',c=createCipheriv('aes-256-gcm',key,iv);c.setAAD(Buffer.from(path));const sealed=Buffer.concat([iv,c.update('PRIVATE_EDUCATIONAL_ANSWER'),c.final(),c.getAuthTag()]);assert.ok(!sealed.includes(Buffer.from('PRIVATE_EDUCATIONAL_ANSWER')));
 const files={[path]:'/__encrypted/bank.bin'},req=new Request('https://qa.example'+path),env={BANK_CONTENT_KEY:key.toString('base64'),ASSETS:{fetch:async()=>new Response(sealed)}};
 assert.equal(await(await privateAsset(req,env,files)).text(),'PRIVATE_EDUCATIONAL_ANSWER');await assert.rejects(privateAsset(req,{...env,BANK_CONTENT_KEY:undefined},files),/KEY_REQUIRED/);await assert.rejects(privateAsset(req,{...env,BANK_CONTENT_KEY:randomBytes(32).toString('base64')},files),/CONTENT_UNAVAILABLE/);await assert.rejects(privateAsset(new Request('https://qa.example/app/other.js'),env,{'/app/other.js':'/__encrypted/bank.bin'}),/CONTENT_UNAVAILABLE/);
 assert.equal((await createGateway().fetch(new Request('https://qa.example/__encrypted/bank.bin'),env)).status,404);
});
test('release content uses only its named binding while older workers keep the original key',async()=>{
 const path='/app/bank.js',files={[path]:'/__encrypted/bank.bin'},req=new Request('https://qa.example'+path);
 const binding='BANK_CONTENT_KEY_RELEASE_123_1',oldKey=randomBytes(32),releaseKey=randomBytes(32);
 const sealed=key=>{const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);cipher.setAAD(Buffer.from(path));return Buffer.concat([iv,cipher.update('educational content'),cipher.final(),cipher.getAuthTag()]);};
 const env={BANK_CONTENT_KEY:oldKey.toString('base64'),[binding]:releaseKey.toString('base64'),ASSETS:{fetch:async()=>new Response(sealed(releaseKey))}};
 assert.equal(await(await privateAsset(req,env,files,binding)).text(),'educational content');
 await assert.rejects(privateAsset(req,env,files),/CONTENT_UNAVAILABLE/);
 await assert.rejects(privateAsset(req,env,files,'BANK_CONTENT_KEY_RELEASE_124_1'),/CONTENT_KEY_REQUIRED/);
 const old={...env,ASSETS:{fetch:async()=>new Response(sealed(oldKey))}};
 assert.equal(await(await privateAsset(req,old,files)).text(),'educational content');
});
