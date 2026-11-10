import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {credentials,PAGES_ACCOUNT_ID,PAGES_PROJECT,PREVIEW_BRANCH} from './pages-client.mjs';
const domain='sitecacho.cl',hosts=[domain,'www.'+domain];
const alias='work-cachaste-web-unificada.cachaste-sitecacho.pages.dev';
export async function configureSitecacho(env,report,{fetcher=fetch}={}){
 const {token}=credentials(env);
 if(report.revision!==env.GITHUB_SHA||report.passed!==true||!report.deployment?.aliases?.some(value=>new URL(value).hostname===alias))throw Error('VERIFIED_BRANCH_ALIAS_REQUIRED');
 const api=async(method,suffix,body)=>{
  const response=await fetcher('https://api.cloudflare.com/client/v4'+suffix,{method,headers:{authorization:'Bearer '+token,...(body?{'content-type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),redirect:'error',signal:AbortSignal.timeout(15000)});
  const data=await response.json();if(!response.ok||data.success!==true)throw Error('DOMAIN_API_'+response.status);return data.result;
 };
 // Discover only the named zone in the already verified account. Never create zones or change nameservers.
 const zones=await api('GET','/zones?name='+domain+'&account.id='+PAGES_ACCOUNT_ID);
 if(zones.length!==1||zones[0].name!==domain||zones[0].account?.id!==PAGES_ACCOUNT_ID||zones[0].status!=='active'||!/^[a-f0-9]{32}$/.test(zones[0].id))throw Error('ACTIVE_SITE_CACHO_ZONE_REQUIRED');
 const zone=zones[0].id,records=new Map();
 // Read all potential conflicts before associating a domain or writing any record.
 for(const name of hosts){const rows=await api('GET','/zones/'+zone+'/dns_records?name='+encodeURIComponent(name));const routes=rows.filter(r=>['A','AAAA','CNAME'].includes(r.type));
  if(routes.length>1||routes.some(r=>r.type!=='CNAME'||![alias,PAGES_PROJECT+'.pages.dev'].includes(r.content)))throw Error('EXISTING_DOMAIN_ROUTE_REQUIRES_REVIEW');records.set(name,routes[0]);
 }
 const prefix='/accounts/'+PAGES_ACCOUNT_ID+'/pages/projects/'+PAGES_PROJECT;
 const attached=await api('GET',prefix+'/domains');
 for(const name of hosts){
  if(!attached.some(d=>d.name===name))await api('POST',prefix+'/domains',{name});
  // Pages may have automatically created its ordinary production CNAME. Read it before writing the branch alias.
  const current=(await api('GET','/zones/'+zone+'/dns_records?name='+encodeURIComponent(name))).filter(r=>['A','AAAA','CNAME'].includes(r.type));
  if(current.length>1||current.some(r=>r.type!=='CNAME'||![alias,PAGES_PROJECT+'.pages.dev'].includes(r.content)))throw Error('EXISTING_DOMAIN_ROUTE_REQUIRES_REVIEW');
  const row=current[0],body={type:'CNAME',name,content:alias,proxied:true,ttl:1};
  if(!row)await api('POST','/zones/'+zone+'/dns_records',body);
  else if(row.content!==alias||row.proxied!==true){if(!/^[a-f0-9]{32}$/.test(row.id))throw Error('INVALID_DNS_RECORD_ID');await api('PATCH','/zones/'+zone+'/dns_records/'+row.id,body);}
  const verified=await api('GET','/zones/'+zone+'/dns_records?name='+encodeURIComponent(name));
  if(!verified.some(r=>r.name===name&&r.type==='CNAME'&&r.content===alias&&r.proxied===true))throw Error('DNS_READBACK_FAILED');
 }
 return {configured:true,domain,hosts,target:alias,branch:PREVIEW_BRANCH,realPayments:false,domains:(await api('GET',prefix+'/domains')).filter(d=>hosts.includes(d.name)).map(d=>({name:d.name,status:d.status}))};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 let result;try{
  const request=JSON.parse(await readFile('web/deploy-preview.request','utf8'));
  if(request.configureDomain!==domain||request.realPayments!==false)throw Error('DOMAIN_DEPLOYMENT_NOT_REQUESTED');
  const report=JSON.parse(await readFile('web/artifacts/pages-preview.json','utf8'));
  result=await configureSitecacho(process.env,report);
 }catch(e){result={configured:false,domain,reason:/^[A-Z_0-9]+$/.test(e.message)?e.message:'DOMAIN_SETUP_FAILED'};process.exitCode=1;}
 await mkdir('web/artifacts',{recursive:true});await writeFile('web/artifacts/domain-live.json',JSON.stringify({...result,checkedAt:new Date().toISOString()},null,2)+'\n');console.log(JSON.stringify(result));
}
