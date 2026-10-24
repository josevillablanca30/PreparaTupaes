/* The public key is injected by the authenticated gateway from server-owned configuration. */
const PUBLIC_KEY=__OFFLINE_PUBLIC_JWK__,REV='__BUILD_REVISION__',PUBLIC_CACHE='cachaste-public-'+REV,LEASE_CACHE='cachaste-license-'+REV;
const PUBLIC_FILES=['/','/web.css','/landing.js','/offline.html','/assets/cachaste-icon.svg','/icons/icon-192.png','/icons/icon-512.png','/manifest.webmanifest','/web-competition.js','/web-init.js','/web-shell.js','/web-shell.css','/account.js','/cuenta.html'];
const enc=new TextEncoder();let currentLease=null;
function decode(part){const s=part.replaceAll('-','+').replaceAll('_','/');return Uint8Array.from(atob(s),c=>c.charCodeAt(0));}
async function verify(token){try{if(!PUBLIC_KEY||typeof token!=='string')return null;const parts=token.split('.');if(parts.length!==3)return null;const head=JSON.parse(new TextDecoder().decode(decode(parts[0]))),body=JSON.parse(new TextDecoder().decode(decode(parts[1])));if(head.alg!=='ES256'||body.aud!==self.location.origin||body.rev!==REV||!body.sub||body.exp*1000<=Date.now()||body.iat*1000>Date.now()+30000||body.exp-body.iat>43200)return null;const key=await crypto.subtle.importKey('jwk',PUBLIC_KEY,{name:'ECDSA',namedCurve:'P-256'},false,['verify']);if(!await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},key,decode(parts[2]),enc.encode(parts[0]+'.'+parts[1])))return null;return body;}catch{return null;}}
async function purge(){for(const name of await caches.keys())if(name.startsWith('cachaste-private-')||name.startsWith('cachaste-license-'))await caches.delete(name);currentLease=null;}
async function lease(){if(currentLease){const body=await verify(currentLease);if(body)return body;}const stored=await(await caches.open(LEASE_CACHE)).match('/__license');if(stored){currentLease=await stored.text();const body=await verify(currentLease);if(body)return body;}await purge();return null;}
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(PUBLIC_CACHE);await cache.addAll(PUBLIC_FILES);await self.skipWaiting();})());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith('cachaste-')&&!name.includes(REV))await caches.delete(name);await self.clients.claim();})());});
self.addEventListener('message',event=>{event.waitUntil((async()=>{
 if(event.data?.type==='PURGE_PRIVATE'){await purge();event.ports[0]?.postMessage({ok:true});return;}
 if(event.data?.type==='CACHE_URLS'){const grant=await lease();if(!grant){event.ports[0]?.postMessage({ok:false});return;}const cache=await caches.open('cachaste-private-'+grant.sub+'-'+REV);for(const target of(event.data.urls||[]).slice(0,80)){try{const url=new URL(target,self.location.origin);if(url.origin!==self.location.origin||!url.pathname.startsWith('/app/'))continue;const response=await fetch(url.href,{credentials:'same-origin'});if(response.ok&&response.headers.get('x-cachaste-user')===grant.sub)await cache.put(url.href,response);}catch{}}event.ports[0]?.postMessage({ok:true});return;}
 if(event.data?.type==='LICENSE'){const body=await verify(event.data.token);if(!body){event.ports[0]?.postMessage({ok:false});return;}const previous=await lease();if(previous&&previous.sub!==body.sub)await purge();currentLease=event.data.token;await(await caches.open(LEASE_CACHE)).put('/__license',new Response(currentLease));event.ports[0]?.postMessage({ok:true});}
})());});
self.addEventListener('fetch',event=>{const req=event.request,url=new URL(req.url);if(url.origin!==self.location.origin||req.method!=='GET'||url.pathname.startsWith('/api/')||url.pathname==='/sw.js')return;
 event.respondWith((async()=>{
  if(url.pathname.startsWith('/app/')){
   try{const response=await fetch(req);if([401,402,403].includes(response.status)){await purge();return response;}const grant=await lease();if(response.ok&&grant&&response.headers.get('x-cachaste-user')===grant.sub)await(await caches.open('cachaste-private-'+grant.sub+'-'+REV)).put(req,response.clone());return response;}
   catch{const grant=await lease();if(grant){const cached=await(await caches.open('cachaste-private-'+grant.sub+'-'+REV)).match(req);if(cached)return cached;}return(await caches.open(PUBLIC_CACHE)).match('/offline.html');}
  }
  try{const response=await fetch(req);if(PUBLIC_FILES.includes(url.pathname)&&response.ok)await(await caches.open(PUBLIC_CACHE)).put(req,response.clone());return response;}
  catch{return await(await caches.open(PUBLIC_CACHE)).match(req)||await(await caches.open(PUBLIC_CACHE)).match('/offline.html');}
 })());});
