import {getWebClient} from '../web/client/auth.mjs';
import {PROJECT_URL,PUBLISHABLE_KEY} from '../web/shared/config.mjs';

const status=document.getElementById('access-status');
const basic=document.getElementById('basic-access');
const premium=document.getElementById('premium-access');
const client=getWebClient({supabaseUrl:PROJECT_URL,publishableKey:PUBLISHABLE_KEY});

async function showAccess(){
 try{
  const {data:{session}}=await client.auth.getSession();
  if(!session){status.textContent='Inicia sesión para consultar tu acceso.';return;}
  const {data,error}=await client.rpc('cachaste_learning_access');
  if(error||data?.userId!==session.user.id)throw Error('ACCESS_UNAVAILABLE');
  if(data.tier==='premium'&&data.active===true){
   const admin=data.accessSource==='admin';
   status.textContent=admin?'Tu acceso de administrador es gratuito, permanente e ilimitado.':'Tu cuenta tiene acceso completo.';
   premium.textContent=admin?'Acceso de administrador':'Acceso completo';
   premium.hidden=false;
   basic.href='inicio.html';
   basic.textContent='Continuar mi preparación';
  }else if(data.tier==='basica' && data.basicEnabled===true){
   status.textContent='Tu cuenta puede utilizar el Plan Básico sin tarjeta.';
   basic.href='inicio.html';
   basic.textContent='Entrar con Plan Básico GRATIS';
  }else status.textContent='Tu acceso todavía no está disponible.';
 }catch{
  status.textContent='No pudimos consultar tu acceso. Conéctate y vuelve a intentarlo.';
 }
}

void showAccess();
