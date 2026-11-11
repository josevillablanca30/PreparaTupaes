import test from 'node:test';
import assert from 'node:assert/strict';
import {policy} from '../server/gateway.mjs';
test('Duelos 2 transport permits only this Supabase WebSocket origin and only on the competition document',()=>{
 const connections=path=>policy(path,{}).split(';').find(x=>x.trim().startsWith('connect-src')).trim().split(/\s+/).slice(1);
 assert.deepEqual(connections('/app/competencia.html'),["'self'",'https://jmobinmdwrmdqrxtcruj.supabase.co','wss://jmobinmdwrmdqrxtcruj.supabase.co']);
 for(const path of ['/','/cuenta.html','/recuperar','/app/inicio.html'])assert.deepEqual(connections(path),["'self'",'https://jmobinmdwrmdqrxtcruj.supabase.co']);
});
