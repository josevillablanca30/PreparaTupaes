const encode=x=>btoa(String.fromCharCode(...new Uint8Array(x))).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
const encoder=new TextEncoder();
export function publicOfflineKey(env){try{const k=JSON.parse(env.OFFLINE_SIGNING_JWK||'null');return k?.kty==='EC'&&k.crv==='P-256'&&k.d&&k.x&&k.y?{kty:'EC',crv:'P-256',x:k.x,y:k.y,ext:true}:null;}catch{return null;}}
export async function offlineLicense(env,userId,until,origin,revision,now=Date.now()){
 if(!publicOfflineKey(env))return null;
 const payload={sub:userId,exp:Math.floor(Math.min(until,now+12*3600000)/1000),iat:Math.floor(now/1000),aud:origin,rev:revision};
 if(payload.exp*1000<=now)return null;
 const header=encode(encoder.encode(JSON.stringify({alg:'ES256',typ:'JWT'}))),body=encode(encoder.encode(JSON.stringify(payload))),input=header+'.'+body;
 const key=await crypto.subtle.importKey('jwk',JSON.parse(env.OFFLINE_SIGNING_JWK),{name:'ECDSA',namedCurve:'P-256'},false,['sign']);
 return input+'.'+encode(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},key,encoder.encode(input)));
}
export function safeJson(value){return JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');}
