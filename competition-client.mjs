import {createClient} from '@supabase/supabase-js';

export const errors={AUTH_RECOVERY_NOT_READY:'La recuperación se habilitará al configurar el enlace seguro de correo. Tu contraseña no ha cambiado.',PASSWORD_MISMATCH:'Las contraseñas deben coincidir.',SERVICE_NOT_READY:'La competencia aún se está preparando. Tu aprendizaje sigue disponible.',AUTH_REQUIRED:'Inicia sesión para continuar.',PROFILE_REQUIRED:'Completa tu perfil para participar.',SUBSCRIPTION_REQUIRED:'Necesitas una suscripción validada para competir.',RIVAL_UNAVAILABLE:'Ese estudiante no está disponible para desafíos.',SELF_DUEL:'Elige a otro estudiante para el duelo.',PAIR_LIMIT:'Ya jugaron o se desafiaron hoy. Prueba con otro rival.',RATE_LIMIT:'Alcanzaste el límite de esta acción. Inténtalo más tarde.',INVITATION_UNAVAILABLE:'La invitación venció o ya no está disponible.',FRESH_POOL_EXHAUSTED:'Por ahora no quedan diez preguntas nuevas para ambos. Prueba otra asignatura.',WEEKLY_ATTEMPT_USED:'Ya tienes tu intento de esta semana. Puedes seguir practicando sin límite.',SOLUTIONS_HIDDEN:'Las soluciones se abren cuando termina el duelo para ambos.',ANSWER_OUT_OF_ORDER:'Tu respuesta ya cambió en el servidor. Recupera el duelo para continuar.',CHALLENGES_DISABLED:'Activa los desafíos en la privacidad de tu perfil para buscar rival.',NOT_FOUND:'No pudimos encontrar esa partida en tu cuenta.',SELECT_EQUIVALENT_WEEK:'Elige una semana: solo comparamos ensayos bajo las mismas condiciones.'};
export function errorMessage(e){const s=String(e?.message||e||'');return Object.entries(errors).find(([key])=>s.includes(key))?.[1]||(/duplicate key/i.test(s)?'Ese nickname ya está en uso. Elige otro.':/fetch|network|timeout|abort/i.test(s)?'No logramos conectarnos. Tu respuesta pendiente se conserva para reintentar.':'No pudimos completar la operación. Vuelve a intentarlo.');}
export class CompetitionClient{
 constructor(config,storage=globalThis.localStorage){
  this.config=config;this.storage=storage;this.user=null;this.profile=null;this.premium=false;this.serviceReady=false;this.recovering=false;this.billingUnavailable=false;this.nativeAccessUnavailable=false;this.nativeRequests=new Map();
  if(globalThis.CachasteAccess)globalThis.CachasteAccess.onmessage=event=>{try{const data=JSON.parse(event.data),pending=this.nativeRequests.get(data.id);if(!pending)return;this.nativeRequests.delete(data.id);clearTimeout(pending.timer);data.error?pending.reject(Error(data.error)):pending.resolve(data);}catch{}};
  this.configured=!!config?.supabaseUrl&&/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(config.supabaseUrl)&&/^sb_publishable_/.test(config.publishableKey||'');
  this.sdk=this.configured?createClient(config.supabaseUrl,config.publishableKey,{auth:{storage,persistSession:true,autoRefreshToken:true,detectSessionInUrl:typeof window!=='undefined',storageKey:'cachaste-auth-v1'}}):null;
  this.sdk?.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT')this.clearNativeAccess();if(event==='PASSWORD_RECOVERY'){this.recovering=true;setTimeout(()=>globalThis.dispatchEvent?.(new Event('cachaste-auth-recovery')),0);}});
 }
 async connect(){
  if(!this.sdk)return null;
  this.premium=false;this.billingUnavailable=false;this.nativeAccessUnavailable=false;
  if(globalThis.navigator?.onLine===false){this.serviceReady=false;this.premium=false;return null;}
  const control=new AbortController(),timeout=setTimeout(()=>control.abort(),5000);
  let health;try{health=await this.sdk.rpc('cachaste_competition_health').abortSignal(control.signal);}finally{clearTimeout(timeout);}
  this.serviceReady=!health.error&&health.data?.catalogueReady===true;
  if(!this.serviceReady){this.premium=false;return null;}
  const{data:{session}}=await this.sdk.auth.getSession();
  if(!session){this.user=null;this.profile=null;this.premium=false;this.clearNativeAccess();return null;}
  // getUser verifies the session at Auth; a cached JWT or editable metadata never grants Premium.
  this.user=null;this.profile=null;
  const{data,error}=await this.sdk.auth.getUser();if(error){this.clearNativeAccess();throw error;}this.user=data.user;
  if(this.config.billingReady===true){
   try{const verified=await this.sdk.functions.invoke('cachaste-play',{body:{action:'refresh'}});this.billingUnavailable=!!verified.error||!!verified.data?.error||typeof verified.data?.premium!=='boolean';}
   catch{this.billingUnavailable=true;}
  }
  // A payment outage must not prevent profile changes, recovery or account deletion.
  // Competitive access stays closed until verification succeeds again.
  let state;try{state=await this.call('profile');}catch(error){if(error?.code==='28000'||String(error?.message).includes('AUTH_REQUIRED')){this.clearNativeAccess();this.user=null;this.profile=null;}throw error;}
  this.profile=state.profile;this.premium=state.premium===true&&!this.billingUnavailable;this.season=state.season;
  if(this.premium){try{const access=await this.nativeAccess('verify',session.access_token);this.nativeAccessUnavailable=access?.required===true&&access.active!==true;}catch{this.nativeAccessUnavailable=true;}}
  else if(!this.billingUnavailable)this.clearNativeAccess();
  return{...state,premium:this.premium};
 }
 nativeAccess(action,token){
  if(!globalThis.CachasteAccess?.postMessage)return Promise.resolve(null);
  return new Promise((resolve,reject)=>{const id=crypto.randomUUID(),timer=setTimeout(()=>{this.nativeRequests.delete(id);reject(Error('ACCESS_UNAVAILABLE'));},20000);this.nativeRequests.set(id,{resolve,reject,timer});try{globalThis.CachasteAccess.postMessage(JSON.stringify({id,action,token,userId:this.user?.id}));}catch(error){this.nativeRequests.delete(id);clearTimeout(timer);reject(error);}});
 }
 clearNativeAccess(){this.nativeAccess('clear').catch(()=>{});}
 async call(operation,payload={}){
  if(!this.sdk)throw new Error('NETWORK_UNCONFIGURED');
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{const{data,error}=await this.sdk.rpc('cachaste_competition',{operation,payload}).abortSignal(controller.signal);if(error)throw error;return data;}
  finally{clearTimeout(timer);}
 }
 async signIn(email,password){if(!this.sdk||!this.serviceReady)throw new Error('SERVICE_NOT_READY');const{error}=await this.sdk.auth.signInWithPassword({email,password});if(error)throw error;return this.connect();}
 async signUp(email,password){if(!this.sdk||!this.serviceReady)throw new Error('SERVICE_NOT_READY');const{data,error}=await this.sdk.auth.signUp({email,password});if(error)throw error;if(data.session)await this.connect();return!!data.session;}
 async resetPassword(email){if(!this.sdk||!this.serviceReady)throw new Error('SERVICE_NOT_READY');if(!this.config.authReturnUrl||!this.config.authReturnUrl.startsWith('https://'))throw new Error('AUTH_RECOVERY_NOT_READY');const{error}=await this.sdk.auth.resetPasswordForEmail(email,{redirectTo:this.config.authReturnUrl});if(error)throw error;}
 async updatePassword(password){if(!this.sdk||!this.user||!this.recovering)throw new Error('AUTH_REQUIRED');const{error}=await this.sdk.auth.updateUser({password});if(error)throw error;await this.signOut();}
 async signOut(){this.clearNativeAccess();if(this.sdk){const{error}=await this.sdk.auth.signOut({scope:'local'});if(error)throw error;}this.user=null;this.profile=null;this.premium=false;this.recovering=false;this.billingUnavailable=false;this.nativeAccessUnavailable=false;}
 key(k){return'cachaste-competition-v1:'+this.user.id+':'+k;}
 request(scope){const key=this.key('request:'+scope);let id=this.storage.getItem(key);if(!id){id=crypto.randomUUID();this.storage.setItem(key,id);}return id;}
 clearRequest(scope){this.storage.removeItem(this.key('request:'+scope));}
 rememberAttempt(a){this.storage.setItem(this.key('attempt'),a.id);}
 pending(){if(!this.user)return null;try{return JSON.parse(this.storage.getItem(this.key('pending')))||null;}catch{return null;}}
 async answer(a,choice){
  let payload=this.pending();
  if(!payload||payload.attemptId!==a.id){payload={attemptId:a.id,position:a.position,choice,requestId:crypto.randomUUID()};this.storage.setItem(this.key('pending'),JSON.stringify(payload));}
  // Persist FIRST; retry exactly the same UUID after a lost response or reconnection.
  const result=await this.call('answer',payload);this.storage.removeItem(this.key('pending'));return result;
 }
}
if(typeof window!=='undefined')window.CachasteCompetitionClient={CompetitionClient,errorMessage};
