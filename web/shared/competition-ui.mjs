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
 return source.replace(original,"if(api.user?.app_metadata?.provider==='google'){const{data,error}=await api.sdk.auth.getUser();if(error||data.user?.id!==id)throw Error('AUTH_REQUIRED');}else await api.signIn(email,String(values.get('password')));await api.call('delete_account'");
}
