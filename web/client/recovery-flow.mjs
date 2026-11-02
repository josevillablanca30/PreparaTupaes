export const RECOVERY_MARKER='cachaste-web-recovery-v1';
export const RECOVERY_TTL=60*60*1000;
const SENSITIVE=['code','sb_flow_id','token_hash','token','access_token','refresh_token','error','error_code','error_description','type','expires_in','expires_at','token_type'];
const textToken=value=>typeof value==='string'&&/^[A-Za-z0-9_.-]{20,8192}$/.test(value);

export function isRecoveryReturn(location){
 const url=new URL(location.href),fragment=new URLSearchParams(url.hash.slice(1));
 return /^\/recuperar(?:\.html)?\/?$/.test(url.pathname)||url.searchParams.get('recovery')==='1'||url.searchParams.get('type')==='recovery'||fragment.get('type')==='recovery';
}

export function captureRecoveryReturn(location,history){
 const url=new URL(location.href),query=url.searchParams,fragment=new URLSearchParams(url.hash.slice(1));
 // Erase the incoming credentials before configuration requests, links, UI or SDK calls.
 history.replaceState(null,'','/recuperar');
 const duplicate=SENSITIVE.some(key=>query.getAll(key).length>1||fragment.getAll(key).length>1||(query.has(key)&&fragment.has(key)));
 const value=key=>fragment.get(key)??query.get(key);
 if(duplicate||value('error')||value('error_code'))return{kind:'invalid'};
 if(value('token_hash'))return value('type')==='recovery'&&/^[A-Za-z0-9_-]{20,256}$/.test(value('token_hash'))&&!value('code')&&!value('access_token')?{kind:'hash',tokenHash:value('token_hash')}:{kind:'invalid'};
 if(value('access_token')||value('refresh_token'))return value('type')==='recovery'&&textToken(value('access_token'))&&textToken(value('refresh_token'))&&!value('code')?{kind:'implicit',accessToken:value('access_token'),refreshToken:value('refresh_token')}:{kind:'invalid'};
 if(value('code'))return /^[A-Za-z0-9_-]{6,2048}$/.test(value('code'))&&(!value('type')||value('type')==='recovery')&&(!value('sb_flow_id')||/^[a-f0-9]{32}$/.test(value('sb_flow_id')))?{kind:'pkce',code:value('code'),flowId:value('sb_flow_id')||null}:{kind:'invalid'};
 return SENSITIVE.some(key=>query.has(key)||fragment.has(key))?{kind:'invalid'}:{kind:'none'};
}

export function recoveryError(error){
 const code=error?.code||error?.message;
 if(code==='PASSWORD_MISMATCH')return'Las contraseñas deben coincidir.';
 if(code==='PASSWORD_TOO_SHORT'||code==='weak_password')return'Usa una contraseña de al menos doce caracteres.';
 if(code==='same_password')return'Elige una contraseña distinta a la anterior.';
 if(code==='over_email_send_rate_limit'||code==='over_request_rate_limit'||error?.status===429)return'Espera un momento antes de pedir otro correo.';
 if(code==='RECOVERY_CONNECTION'||/fetch|network|timeout|abort/i.test(String(error?.message||'')))return'No logramos conectarnos. Revisa tu conexión y vuelve a intentarlo.';
 if(code==='RECOVERY_EXPIRED'||['otp_expired','flow_state_expired','flow_state_not_found','bad_code_verifier','invalid_credentials','session_not_found','refresh_token_not_found'].includes(code))return'Este enlace venció, ya se usó o no corresponde a este navegador. Solicita otro correo para continuar.';
 if(code==='RECOVERY_REQUIRED')return'Abre el enlace del correo de recuperación para cambiar tu contraseña.';
 if(code==='EMAIL_NOT_SENT'||(code==='unexpected_failure'&&/email|smtp/i.test(String(error?.message||''))))return'No pudimos enviar el correo. Conservamos tu dirección para que puedas reintentar.';
 return'No pudimos completar el cambio. Vuelve a intentarlo o solicita otro correo.';
}

function checked(result){if(result?.error)throw result.error;return result?.data;}
export async function verifyRecoveryReturn(sdk,entry){
 if(!entry||['invalid','none'].includes(entry.kind))throw Error('RECOVERY_EXPIRED');
 let result;
 if(entry.kind==='hash')result=await sdk.auth.verifyOtp({token_hash:entry.tokenHash,type:'recovery'});
 else if(entry.kind==='implicit')result=await sdk.auth.setSession({access_token:entry.accessToken,refresh_token:entry.refreshToken});
 else if(entry.kind==='pkce')result=await sdk.auth.exchangeCodeForSession(entry.code,entry.flowId?{flowId:entry.flowId}:undefined);
 else throw Error('RECOVERY_EXPIRED');
 const data=checked(result);if(!data?.session?.access_token)throw Error('RECOVERY_EXPIRED');
 const verified=checked(await sdk.auth.getUser());
 if(!verified?.user?.id||verified.user.id!==data.session.user?.id)throw Error('RECOVERY_EXPIRED');
 return{session:data.session,userId:verified.user.id};
}

async function sessionTag(session){
 const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(session.access_token));
 return Array.from(new Uint8Array(hash),n=>n.toString(16).padStart(2,'0')).join('');
}
export async function rememberRecovery(storage,verified,now=Date.now()){
 const marker={userId:verified.userId,tag:await sessionTag(verified.session),verifiedAt:now,expiresAt:Math.min(now+RECOVERY_TTL,Number(verified.session.expires_at)*1000||now+RECOVERY_TTL)};
 try{storage.setItem(RECOVERY_MARKER,JSON.stringify(marker));}catch{}
 return marker;
}
export function forgetRecovery(storage){try{storage.removeItem(RECOVERY_MARKER);}catch{}}
export async function resumeRecovery(sdk,storage,now=Date.now()){
 let marker;try{marker=JSON.parse(storage.getItem(RECOVERY_MARKER));}catch{return null;}
 if(!marker||!Number.isFinite(marker.verifiedAt)||!Number.isFinite(marker.expiresAt)||marker.verifiedAt>now||marker.expiresAt<=now||now-marker.verifiedAt>=RECOVERY_TTL){forgetRecovery(storage);return null;}
 const session=checked(await sdk.auth.getSession())?.session;
 if(!session||session.user?.id!==marker.userId||await sessionTag(session)!==marker.tag){forgetRecovery(storage);return null;}
 const verified=checked(await sdk.auth.getUser());if(verified?.user?.id!==marker.userId){forgetRecovery(storage);return null;}
 return marker;
}

export async function requestRecovery(sdk,email,origin){
 const url=new URL(origin);if(url.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(url.hostname))throw Error('RECOVERY_CONNECTION');
 const {error}=await sdk.auth.resetPasswordForEmail(email.trim(),{redirectTo:url.origin+'/recuperar'});if(error)throw error;
}

export async function changeRecoveredPassword(sdk,password,repeat,{verified=false,userId}={}){
 if(!verified||!userId)throw Error('RECOVERY_REQUIRED');
 if(password!==repeat)throw Error('PASSWORD_MISMATCH');
 if(password.length<12)throw Error('PASSWORD_TOO_SHORT');
 const identity=checked(await sdk.auth.getUser());if(identity?.user?.id!==userId)throw Error('RECOVERY_EXPIRED');
 const result=checked(await sdk.auth.updateUser({password}));if(!result?.user?.id)throw Error('RECOVERY_EXPIRED');
 // Report success even if the network drops during the subsequent session cleanup:
 // the password has already changed and must never be submitted a second time.
 let sessionsClosed=false;
 try{const signedOut=await sdk.auth.signOut({scope:'global'});sessionsClosed=!signedOut.error;}catch{}
 return{changed:true,sessionsClosed};
}
