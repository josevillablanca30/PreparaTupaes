// Web-only session lifecycle. The original Android client and native billing code are untouched.
import{serviceWorkerMessage}from'./shell.mjs';
const Client=window.CachasteCompetitionClient?.CompetitionClient;
async function clearWebSession(){await serviceWorkerMessage({type:'PURGE_PRIVATE'});try{await fetch('/api/session',{method:'DELETE',headers:{'x-cachaste-request':'1'}});}finally{location.assign('/cuenta.html');}}
if(Client){
 const call=Client.prototype.call,signOut=Client.prototype.signOut;
 Client.prototype.call=async function(operation,payload){const result=await call.call(this,operation,payload);if(operation==='delete_account'){
  window.CachasteWebProgress?.erase();await this.sdk.auth.signOut({scope:'local'});localStorage.removeItem('cachaste-auth-v1');const id=window.CachasteWebBootstrap?.userId,prefix='cachaste-web:'+id+':';for(const key of Object.keys(localStorage))if(key.startsWith(prefix))localStorage.removeItem(key);await clearWebSession();
 }return result;};
 Client.prototype.signOut=async function(...args){const result=await signOut.apply(this,args);await clearWebSession();return result;};
}
