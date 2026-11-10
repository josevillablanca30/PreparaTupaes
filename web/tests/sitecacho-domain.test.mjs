import test from 'node:test';import assert from 'node:assert/strict';
import {configureSitecacho} from '../scripts/configure-sitecacho-domain.mjs';
import {PAGES_ACCOUNT_ID,PAGES_PROJECT,PREVIEW_BRANCH} from '../scripts/pages-client.mjs';
const alias='work-cachaste-web-unificada.cachaste-sitecacho.pages.dev',revision='a'.repeat(40),zone='f'.repeat(32);
const env={CLOUDFLARE_API_TOKEN:'synthetic-token-only-qa',CLOUDFLARE_ACCOUNT_ID:PAGES_ACCOUNT_ID,CLOUDFLARE_PAGES_PROJECT:PAGES_PROJECT,GITHUB_REF_NAME:PREVIEW_BRANCH,GITHUB_SHA:revision};
const report={revision,passed:true,deployment:{aliases:['https://'+alias]}};
function fixture({foreign=false,forbidden=false}={}){
 const records=new Map(),domains=[],writes=[];
 if(foreign)records.set('sitecacho.cl',{id:'1'.repeat(32),type:'A',name:'sitecacho.cl',content:'192.0.2.1'});
 const fetcher=async(url,options)=>{
  const u=new URL(url),method=options.method,body=options.body?JSON.parse(options.body):null;assert.equal(u.hostname,'api.cloudflare.com');assert.equal(options.redirect,'error');
  if(method!=='GET')writes.push({path:u.pathname,body});
  let result;
  if(u.pathname==='/client/v4/zones'){
   assert.equal(u.searchParams.get('name'),'sitecacho.cl');assert.equal(u.searchParams.get('account.id'),PAGES_ACCOUNT_ID);
   if(forbidden)return Response.json({success:false},{status:403});result=[{id:zone,name:'sitecacho.cl',status:'active',account:{id:PAGES_ACCOUNT_ID}}];
  }else if(u.pathname==='/client/v4/accounts/'+PAGES_ACCOUNT_ID+'/pages/projects/'+PAGES_PROJECT+'/domains'){
   if(method==='POST'){domains.push({name:body.name,status:'active'});records.set(body.name,{id:(body.name.startsWith('www')?'2':'1').repeat(32),name:body.name,type:'CNAME',content:PAGES_PROJECT+'.pages.dev',proxied:true});result=domains.at(-1);}else result=domains;
  }else if(u.pathname==='/client/v4/zones/'+zone+'/dns_records'){
   if(method==='GET')result=records.has(u.searchParams.get('name'))?[records.get(u.searchParams.get('name'))]:[];
   else{assert.equal(body.type,'CNAME');records.set(body.name,{...body,id:'3'.repeat(32)});result=records.get(body.name);}
  }else if(u.pathname.startsWith('/client/v4/zones/'+zone+'/dns_records/')&&method==='PATCH'){
   assert.ok(['sitecacho.cl','www.sitecacho.cl'].includes(body.name));records.set(body.name,{...body,id:u.pathname.split('/').at(-1)});result=records.get(body.name);
  }else throw Error('UNEXPECTED_API_SCOPE');
  return Response.json({success:true,result});
 };
 return {fetcher,records,writes};
}
test('domain setup changes only the two named CNAME routes and is idempotent',async()=>{
 const f=fixture();assert.equal((await configureSitecacho(env,report,f)).configured,true);
 for(const name of ['sitecacho.cl','www.sitecacho.cl']){assert.equal(f.records.get(name).content,alias);assert.equal(f.records.get(name).proxied,true);}
 const writes=f.writes.length;await configureSitecacho(env,report,f);assert.equal(f.writes.length,writes);
});
test('domain setup rejects unverified builds, foreign projects and existing unrelated DNS routes before mutation',async()=>{
 const f=fixture({foreign:true});await assert.rejects(configureSitecacho(env,report,f),/EXISTING_DOMAIN_ROUTE_REQUIRES_REVIEW/);assert.equal(f.writes.length,0);
 await assert.rejects(configureSitecacho(env,{...report,passed:false},fixture()),/VERIFIED_BRANCH_ALIAS_REQUIRED/);
 await assert.rejects(configureSitecacho({...env,CLOUDFLARE_PAGES_PROJECT:'unrelated'},report,fixture()),/UNRELATED_PROJECT_DENIED/);
});
test('a token without DNS zone access reports the permission failure and makes no changes',async()=>{
 const f=fixture({forbidden:true});await assert.rejects(configureSitecacho(env,report,f),/DOMAIN_API_403/);assert.equal(f.writes.length,0);
});
