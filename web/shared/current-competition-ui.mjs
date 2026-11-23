// Web-only platform changes to the current, pinned Android presentation.
export function adaptCurrentCompetitionUi(source){
 const replace=(from,to)=>{if(!source.includes(from))throw Error('REVIEW_CURRENT_ANDROID_UI: '+from.slice(0,60));source=source.replace(from,to);};
 replace('Los cobros y la prueba de siete días se habilitarán con Google Play.','Los cobros están desactivados durante las pruebas. Revisa tu acceso en Mi cuenta.');
 source=source.replaceAll('href="suscripcion.html"','href="/cuenta.html#planes"');
 replace('Se eliminarán tu cuenta y tus datos competitivos. Tu aprendizaje local seguirá en este teléfono. Eliminar la cuenta no cancela una suscripción de Google Play: cancélala allí si no quieres que se renueve. Las compras quedan vinculadas a esta cuenta. Para protegerte, vuelve a confirmar tu contraseña.','Se eliminarán tu cuenta, tu progreso web y tus datos competitivos. Las compras de Google Play se administran allí. Si en el futuro activas una suscripción web, cancela su renovación desde Mi cuenta. Los datos contables exigidos pueden conservarse sin vincularlos a tu cuenta. Confirma tu acceso para continuar.');
 const password='<label>Contraseña actual<input name="password" type="password" autocomplete="current-password" required></label>';
 replace(password,"'+(api.user?.app_metadata?.provider==='google'?'<p>Confirma tu acceso con <a href=\"/cuenta.html?reauth=google&next=%2Fapp%2Fcompetencia.html\">Google en Mi cuenta</a> y vuelve a Perfil. No necesitas crear una contraseña.':'"+password+"')+'");
 replace("await api.signIn(email,String(values.get('password')));","if(api.user?.app_metadata?.provider==='google'){const{data,error}=await api.sdk.auth.getUser();if(error||data.user?.id!==id)throw Error('AUTH_REQUIRED');}else await api.signIn(email,String(values.get('password')));");
 source=source.replaceAll('if(api.profile?.photoVersion)await api.removePhoto();','await cachasteRemoveWebProfilePhoto(api);');
 source=source.replaceAll('https://work-cachaste-web-comercial.cachaste-sitecacho.pages.dev/','/').replaceAll('https://cachaste-privacidad.jose-villablanca-hor.chatgpt.site/privacidad','/privacidad.html').replaceAll('https://cachaste-privacidad.jose-villablanca-hor.chatgpt.site/eliminar-cuenta','/eliminar-cuenta.html');
 replace("list=state.dashboard?.duels||[];return header()","list=state.dashboard?.duels||[],finished=list.filter(d=>d.status==='finished'),visible=state.webDuelFilter==='finished'?finished:list;return header()");
 const list="(list.length?'<ul class=\"duel-list\">'+[...list].sort";
 replace(list,"'<div class=\"web-duel-filters\" role=\"group\" aria-label=\"Filtrar duelos recientes\">'+btn('web-duel-filter','Todos ('+list.length+')',state.webDuelFilter!=='finished'?'primary compact':'soft compact','data-filter=\"all\" aria-pressed=\"'+(state.webDuelFilter!=='finished')+'\"')+btn('web-duel-filter','Terminados ('+finished.length+')',state.webDuelFilter==='finished'?'primary compact':'soft compact','data-filter=\"finished\" aria-pressed=\"'+(state.webDuelFilter==='finished')+'\"')+'</div>'+(visible.length?'<ul class=\"duel-list\">'+[...visible].sort");
 replace("if(action==='subject'){","if(action==='web-duel-filter'){state.webDuelFilter=b.dataset.filter==='finished'?'finished':'all';render();return;}\n  if(action==='subject'){");
 replace("let state={route:location.hash.slice(1)||'rankings'", "const accountOnly=window.CachasteWebBootstrap?.accountOnly===true;\n let state={route:accountOnly?'perfil':location.hash.slice(1)||'rankings'");
 replace("state.route=api.recovering?'recuperar':location.hash.slice(1)||'rankings';","state.route=accountOnly?'perfil':api.recovering?'recuperar':location.hash.slice(1)||'rankings';");
 replace("function nav(active){return","function nav(active){if(accountOnly)return '';return");
 replace("function header(back=false){return","function header(back=false){if(accountOnly)return '<header class=\"comp-header\"><a class=\"soft\" href=\"/cuenta.html#planes\">Volver a Mi cuenta</a></header>';return");
 const learningLinks=`<a href="inicio.html#progress">Mi progreso educativo '+icon('arrow')+'</a><a href="inicio.html#home">Mi camino de aprendizaje '+icon('arrow')+'</a>`;
 replace(learningLinks,"'+(accountOnly?'':'"+learningLinks+"')+'");
 return "async function cachasteRemoveWebProfilePhoto(api){if(!api.user?.id)throw Error('AUTH_REQUIRED');const{error}=await api.sdk.storage.from('cachaste-profile-photos').remove([api.user.id+'/avatar.webp']);if(error)throw error;}\n"+source;
}
