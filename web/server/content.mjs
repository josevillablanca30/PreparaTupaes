const types={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',json:'application/json',svg:'image/svg+xml',png:'image/png',webp:'image/webp',woff2:'font/woff2'};
export async function privateAsset(req,env,encryptedFiles){
 const path=new URL(req.url).pathname,asset=encryptedFiles[path];
 if(!asset)return env.ASSETS.fetch(req); // Unit-test adapter; deployment manifests always use encryption.
 const encoded=env.BANK_CONTENT_KEY;if(!encoded)throw Error('CONTENT_KEY_REQUIRED');
 let key;try{const bytes=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));if(bytes.length!==32)throw Error();key=await crypto.subtle.importKey('raw',bytes,'AES-GCM',false,['decrypt']);}catch{throw Error('CONTENT_KEY_INVALID');}
 const url=new URL(asset,req.url),response=await env.ASSETS.fetch(new Request(url,{method:'GET'}));if(!response.ok)throw Error('CONTENT_UNAVAILABLE');
 const bytes=new Uint8Array(await response.arrayBuffer());let clear;try{clear=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes.slice(0,12),additionalData:new TextEncoder().encode(path)},key,bytes.slice(12));}catch{throw Error('CONTENT_UNAVAILABLE');}
 return new Response(clear,{headers:{'content-type':types[path.split('.').at(-1)]||'application/octet-stream'}});
}
