// Change platform-specific account copy only. Approved art, layout and competition rules stay identical.
export function adaptCompetitionUi(source){
 const changes=[
 ['Los cobros y la prueba de siete días se habilitarán con Google Play.','Las suscripciones web se administran en Mi cuenta mediante Mercado Pago.'],
 ['Se eliminarán tu cuenta y tus datos competitivos. Tu aprendizaje local seguirá en este teléfono. Eliminar la cuenta no cancela una suscripción de Google Play: cancélala allí si no quieres que se renueve. Las compras quedan vinculadas a esta cuenta. Para protegerte, vuelve a confirmar tu contraseña.','Se eliminarán tu cuenta, tu progreso web y tus datos competitivos. Cancela primero la renovación de Mercado Pago en Mi cuenta. Las compras de Google Play se administran allí. Los importes de pagos necesarios para obligaciones contables pueden conservarse sin el vínculo a tu cuenta. Para protegerte, confirma nuevamente tu acceso antes de eliminar.']
 ];
 for(const[from,to]of changes){if(!source.includes(from))throw Error('Review web account copy: Android source changed');source=source.replace(from,to);}
 const password='<label>Contraseña actual<input name="password" type="password" autocomplete="current-password" required></label>';
 if(!source.includes(password))throw Error('REVIEW_WEB_GOOGLE_DELETION');
 source=source.replace(password,"'+(api.user?.app_metadata?.provider==='google'?'<p>Tu cuenta usa Google. Si tu acceso tiene más de diez minutos, <a href=\"/cuenta.html?reauth=google&next=%2Fapp%2Fcompetencia.html\">confirma con Google</a> y vuelve a Perfil. No necesitas crear una contraseña.</p>':'"+password+"')+'");
 const original="await api.signIn(email,String(values.get('password')));await api.call('delete_account'";
 if(!source.includes(original))throw Error('REVIEW_WEB_GOOGLE_DELETION');
 source=source.replace(original,"if(api.user?.app_metadata?.provider==='google'){const{data,error}=await api.sdk.auth.getUser();if(error||data.user?.id!==id)throw Error('AUTH_REQUIRED');}else await api.signIn(email,String(values.get('password')));await cachasteRemoveWebProfilePhoto(api);await api.call('delete_account'").replaceAll('https://cachaste-privacidad.jose-villablanca-hor.chatgpt.site/privacidad','/privacidad.html').replaceAll('https://cachaste-privacidad.jose-villablanca-hor.chatgpt.site/eliminar-cuenta','/eliminar-cuenta.html');
 // Web-only rematch: reuse the existing verified invitation operation.
 // Source is a JS string; avoid changing Android's original competition file.
 const oldResult="+btn('another-duel',icon('repeat')+' Buscar otro duelo','outline wide')";
 const newResult="+((d.creator?.id===me?d.opponent?.nickname:d.creator?.nickname)?btn('rematch',icon('repeat')+' Pedir revancha al mismo rival','primary wide'):'')+btn('another-duel',icon('users')+' Buscar otro rival','outline wide')";
 if(!source.includes(oldResult))throw Error('REVIEW_WEB_REMATCH_RESULT');
 source=source.replace(oldResult,newResult);
 const oldModal="function modal(kind){const nickname=kind==='challenge';dialog.innerHTML=";
 if(!source.includes(oldModal))throw Error('REVIEW_WEB_REMATCH_MODAL');
 source=source.replace(oldModal,"function modal(kind,prefill=''){const nickname=kind==='challenge';dialog.innerHTML=");
 // Use the exact source fragment rather than an interpolated HTML value.
 const inputAnchor="'\" autocapitalize=\"'+(nickname?'off':'characters')+'\" autocomplete=\"off\"></label>";
 if(!source.includes(inputAnchor))throw Error('REVIEW_WEB_REMATCH_INPUT');
 source=source.replace(inputAnchor,"'\" autocapitalize=\"'+(nickname?'off':'characters')+'\" autocomplete=\"off\" value=\"'+esc(nickname?prefill:'')+'\"></label>");
 const oldAction="if(action==='challenge'||action==='join'){if(guard())modal(action);return;}";
 if(!source.includes(oldAction))throw Error('REVIEW_WEB_REMATCH_ACTION');
 source=source.replace(oldAction,"if(action==='rematch'){if(!guard())return;const d=state.duel,other=d?.creator?.id===api.user?.id?d?.opponent:d?.creator;if(d?.status!=='finished'||!other?.nickname){state.message='Solo puedes pedir revancha después de un duelo terminado con un rival identificado.';render();return;}state.subject=d.subject;state.track=d.track||state.track;modal('challenge',other.nickname);return;}\n  "+oldAction);
 const profileDelete="await api.call('delete_profile')";if(!source.includes(profileDelete))throw Error('REVIEW_WEB_PROFILE_DELETION');
 source=source.replace(profileDelete,"await cachasteRemoveWebProfilePhoto(api);"+profileDelete);
 return "async function cachasteRemoveWebProfilePhoto(api){if(!api.user?.id)throw Error('AUTH_REQUIRED');const{error}=await api.sdk.storage.from('cachaste-profile-photos').remove([api.user.id+'/avatar.webp']);if(error)throw error;}\n"+source;
}
