import test from 'node:test';
import assert from 'node:assert/strict';
import {database,rpc,profile,users,sessions} from './helpers/competition-db.mjs';
import {profilePhotoUrl} from '../competition-client.mjs';

test('Profile photos: one object, own account only, server cooldown survives removal and profile recreation',async t=>{
 const db=await database();t.after(()=>db.close());for(let i=0;i<2;i++)await profile(db,i);
 async function storage(i,sql,params=[]){await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({sub:users[i],session_id:sessions[i],role:'authenticated'})]);await db.exec('set role authenticated');try{return await db.query(sql,params);}finally{await db.exec('reset role');}}
 const insert="insert into storage.objects(bucket_id,name,metadata)values('cachaste-profile-photos',$1,$2::jsonb)";
 const metadata={size:12000,mimetype:'image/webp'};
 assert.equal((await rpc(db,0,'photo_status')).canUpload,true);
 await assert.rejects(storage(1,insert,[users[0]+'/avatar.webp',metadata]),/row-level security/);
 await assert.rejects(storage(0,insert,[users[0]+'/other.webp',metadata]),/row-level security/);
 await assert.rejects(storage(0,insert,[users[0]+'/avatar.webp',{...metadata,size:32769}]),/INVALID_PHOTO/);
 await assert.rejects(storage(0,insert,[users[0]+'/avatar.webp',{...metadata,mimetype:'image/svg+xml'}]),/INVALID_PHOTO/);
 await storage(0,insert,[users[0]+'/avatar.webp',metadata]);assert.equal((await rpc(db,0,'photo_status')).canUpload,false);
 assert.ok((await rpc(db,0,'profile')).profile.photoVersion);
 assert.equal((await storage(1,'select * from storage.objects')).rows.length,0);
 assert.equal((await storage(1,"delete from storage.objects where name=$1",[users[0]+'/avatar.webp'])).affectedRows,0);
 assert.equal((await storage(0,"update storage.objects set metadata=$2 where name=$1",[users[0]+'/avatar.webp',metadata])).affectedRows,0);
 await storage(0,'delete from storage.objects where name=$1',[users[0]+'/avatar.webp']);assert.equal((await rpc(db,0,'profile')).profile.photoVersion,null);
 assert.equal((await rpc(db,0,'photo_status')).canUpload,false);await rpc(db,0,'delete_profile');await profile(db,0);
 await assert.rejects(storage(0,insert,[users[0]+'/avatar.webp',metadata]),/row-level security/);
 await db.exec("update cachaste.profile_photos set updated_at=now()-interval '7 days 1 second'");
 await storage(0,insert,[users[0]+'/avatar.webp',metadata]);assert.equal((await db.query('select count(*)::int n from storage.objects')).rows[0].n,1);
 await rpc(db,1,'block',{userId:users[0]});await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({sub:users[1],session_id:sessions[1]})]);assert.equal((await db.query('select cachaste.person($1) as p',[users[0]])).rows[0].p.photoVersion,undefined);
});
test('Profile thumbnail URLs use only the configured project, a real ID and server version',()=>{
 const c={supabaseUrl:'https://example.supabase.co'},p={id:users[0],photoVersion:'2026-11-02T10:00:00Z'};
 assert.match(profilePhotoUrl(p,c),/\/avatar.webp\?v=1793613600000$/);
 for(const invalid of[{...p,id:'https://evil.test/picture'},{...p,photoVersion:null},{...p,blocked:true}])assert.equal(profilePhotoUrl(invalid,c),null);
 assert.equal(profilePhotoUrl(p,{supabaseUrl:'https://evil.test'}),null);
});
